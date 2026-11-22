-- Trivia game: database setup for Supabase
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run. Run it once.

create extension if not exists pgcrypto;

-- ---------- Admins: who can host ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to authenticated;

-- ---------- Questions: only admins can ever read these ----------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  position int not null,
  source text,
  type text not null default 'text',
  question text not null,
  choices text,
  answer text,
  points numeric not null default 1,
  question_image text,
  answer_image text,
  audio_file text,
  answer_audio text,
  notes text
);
alter table public.questions add column if not exists answer_audio text;
alter table public.questions enable row level security;
drop policy if exists "admins manage questions" on public.questions;
create policy "admins manage questions" on public.questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Games: one row per game night ----------
-- "current" holds only what players may see; "reveal" is filled in when the host reveals the answer.
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'lobby'
    check (status in ('lobby', 'open', 'locked', 'reveal', 'scores', 'ended')),
  position int,
  total int,
  current jsonb,
  reveal jsonb,
  created_at timestamptz not null default now()
);
alter table public.games enable row level security;
drop policy if exists "players read games" on public.games;
create policy "players read games" on public.games
  for select to authenticated using (true);
drop policy if exists "admins run games" on public.games;
create policy "admins run games" on public.games
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Teams ----------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 30),
  user_id uuid not null default auth.uid(),
  score numeric not null default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists teams_unique_name on public.teams (game_id, lower(btrim(name)));
alter table public.teams enable row level security;
drop policy if exists "everyone reads teams" on public.teams;
create policy "everyone reads teams" on public.teams
  for select to authenticated using (true);
drop policy if exists "players join open games" on public.teams;
create policy "players join open games" on public.teams
  for insert to authenticated with check (
    teams.user_id = auth.uid()
    and exists (select 1 from public.games g where g.id = teams.game_id and g.status <> 'ended')
  );
drop policy if exists "admins edit teams" on public.teams;
create policy "admins edit teams" on public.teams
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins remove teams" on public.teams;
create policy "admins remove teams" on public.teams
  for delete to authenticated using (public.is_admin());
-- Players may only set a game and a name; score is kept by the database.
revoke insert, update on public.teams from anon, authenticated;
grant insert (game_id, name) on public.teams to authenticated;
grant update (name) on public.teams to authenticated;

-- ---------- Submissions: one locked answer per team per question ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  position int not null,
  answer text not null check (char_length(answer) between 1 and 500),
  points numeric,
  created_at timestamptz not null default now(),
  unique (team_id, position)
);
alter table public.submissions enable row level security;
drop policy if exists "teams see own answers, admins see all" on public.submissions;
create policy "teams see own answers, admins see all" on public.submissions
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.teams t where t.id = submissions.team_id and t.user_id = auth.uid())
  );
drop policy if exists "teams answer the open question" on public.submissions;
create policy "teams answer the open question" on public.submissions
  for insert to authenticated with check (
    exists (
      select 1 from public.teams t join public.games g on g.id = t.game_id
      where t.id = submissions.team_id
        and t.user_id = auth.uid()
        and g.id = submissions.game_id
        and g.status = 'open'
        and g.position = submissions.position
    )
  );
drop policy if exists "admins score answers" on public.submissions;
create policy "admins score answers" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete answers" on public.submissions;
create policy "admins delete answers" on public.submissions
  for delete to authenticated using (public.is_admin());
-- Players can't set their own points; answers can't be edited once sent.
revoke insert, update on public.submissions from anon, authenticated;
grant insert (game_id, team_id, position, answer) on public.submissions to authenticated;
grant update (points) on public.submissions to authenticated;

-- Keep each team's total score up to date automatically.
create or replace function public.refresh_team_score() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid uuid;
begin
  if tg_op = 'DELETE' then tid := old.team_id; else tid := new.team_id; end if;
  update public.teams
     set score = coalesce((select sum(s.points) from public.submissions s where s.team_id = tid), 0)
   where id = tid;
  return null;
end $$;
drop trigger if exists submissions_refresh_score on public.submissions;
create trigger submissions_refresh_score
  after insert or update of points or delete on public.submissions
  for each row execute function public.refresh_team_score();

-- ---------- Live updates ----------
do $$
begin
  begin alter publication supabase_realtime add table public.games; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.teams; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.submissions; exception when duplicate_object then null; end;
end $$;

-- ---------- Private file storage for pictures and songs ----------
insert into storage.buckets (id, name, public)
values ('trivia', 'trivia', false)
on conflict (id) do nothing;
drop policy if exists "admins manage trivia files" on storage.objects;
create policy "admins manage trivia files" on storage.objects
  for all to authenticated
  using (bucket_id = 'trivia' and public.is_admin())
  with check (bucket_id = 'trivia' and public.is_admin());

-- ---------- LAST STEP: make yourself the admin ----------
-- 1. Create your login first: Authentication > Users > Add user (use your email + a password).
-- 2. Put that email below, select just these two lines, and run them.
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com';
