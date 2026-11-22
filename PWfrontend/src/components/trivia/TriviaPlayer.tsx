/* eslint-disable react-hooks/set-state-in-effect -- these effects load data from Supabase and subscribe to live updates, which is what effects are for */
// Player page: reece-williams.com/trivia
// Teams join with the game code and a team name, then answer each question the host sends.
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../../lib/supabase';
import type { Game, Submission, Team } from './types';
import { fmtPoints, rankTeams, typeLabel } from './types';
import './Trivia.css';

const STORE = 'trivia-player';
interface Saved { gameId: string; teamId: string }

const loadSaved = (): Saved | null => {
  try { const raw = localStorage.getItem(STORE); return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; }
};
const setSaved = (s: Saved | null) => {
  try {
    if (s) localStorage.setItem(STORE, JSON.stringify(s));
    else localStorage.removeItem(STORE);
  } catch { /* private browsing: the team just won't be remembered */ }
};

async function ensureSession(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error || !anon.user) throw new Error("Couldn't connect to the game. Check your internet and try again.");
  return anon.user.id;
}

const TriviaPlayer: React.FC = () => {
  const [params] = useSearchParams();
  const [phase, setPhase] = useState<'loading' | 'join' | 'play'>('loading');
  const [code, setCode] = useState((params.get('code') ?? '').toUpperCase());
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const [game, setGame] = useState<Game | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [draft, setDraft] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  // Resume a team saved on this phone (refresh, screen lock, closed tab).
  useEffect(() => {
    if (!supabaseConfigured) { setPhase('join'); return; }
    const saved = loadSaved();
    const wanted = (params.get('code') ?? '').toUpperCase();
    (async () => {
      if (saved) {
        const { data: s } = await supabase.auth.getSession();
        if (s.session) {
          const [{ data: g }, { data: t }] = await Promise.all([
            supabase.from('games').select('*').eq('id', saved.gameId).maybeSingle(),
            supabase.from('teams').select('*').eq('id', saved.teamId).maybeSingle(),
          ]);
          if (g && t && g.status !== 'ended' && (!wanted || wanted === g.code)) {
            setGame(g as Game); setTeam(t as Team); setPhase('play');
            return;
          }
        }
        setSaved(null);
      }
      setPhase('join');
    })();
    // Runs once on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gameId = game?.id;
  const teamId = team?.id;

  const refreshGame = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('games').select('*').eq('id', gameId).maybeSingle();
    if (data) setGame(data as Game);
  }, [gameId]);

  const refreshTeams = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('teams').select('*').eq('game_id', gameId);
    if (!data) return;
    setTeams(data as Team[]);
    const me = (data as Team[]).find((t) => t.id === teamId);
    if (me) setTeam(me);
    else if (teamId) {
      // The host removed this team.
      setSaved(null); setTeam(null); setGame(null); setPhase('join');
      setErr('Your team was removed from the game. You can join again.');
    }
  }, [gameId, teamId]);

  const refreshSubs = useCallback(async () => {
    if (!teamId) return;
    const { data } = await supabase.from('submissions').select('*').eq('team_id', teamId);
    if (data) setSubs(data as Submission[]);
  }, [teamId]);

  // Live updates while playing.
  useEffect(() => {
    if (phase !== 'play' || !gameId || !teamId) return;
    refreshGame(); refreshTeams(); refreshSubs();
    const channel = supabase
      .channel(`player-${teamId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (p) => {
        if (p.new && 'id' in p.new) setGame(p.new as Game);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `game_id=eq.${gameId}` }, () => { refreshTeams(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `team_id=eq.${teamId}` }, () => { refreshSubs(); })
      .subscribe();
    // Phones drop the live connection when the screen sleeps, so catch up when it wakes.
    const onVisible = () => {
      if (document.visibilityState === 'visible') { refreshGame(); refreshTeams(); refreshSubs(); }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      supabase.removeChannel(channel);
    };
  }, [phase, gameId, teamId, refreshGame, refreshTeams, refreshSubs]);

  // New question: clear the answer box.
  useEffect(() => { setDraft(''); setConfirming(false); setNotice(''); }, [game?.position]);

  const join = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const uid = await ensureSession();
      const { data: g } = await supabase.from('games').select('*')
        .eq('code', code.trim().toUpperCase()).neq('status', 'ended').maybeSingle();
      if (!g) throw new Error("We couldn't find a game with that code. Check the code on the big screen.");
      const teamName = name.trim().replace(/\s+/g, ' ');
      let { data: t, error } = await supabase.from('teams').insert({ game_id: g.id, name: teamName }).select().single();
      if (error && error.code === '23505') {
        // Same phone rejoining with its own team name: take the team back.
        const { data: mine } = await supabase.from('teams').select('*')
          .eq('game_id', g.id).eq('user_id', uid).ilike('name', teamName).maybeSingle();
        if (mine) { t = mine; error = null; }
        else throw new Error('That team name is already taken. Try another one.');
      }
      if (error || !t) throw new Error("Couldn't join the game. Try again.");
      setSaved({ gameId: g.id, teamId: t.id });
      setGame(g as Game); setTeam(t as Team); setPhase('play');
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!game || !team || game.position === null) return;
    setSending(true);
    const { error } = await supabase.from('submissions')
      .insert({ game_id: game.id, team_id: team.id, position: game.position, answer: draft.trim() });
    setSending(false); setConfirming(false);
    if (error) {
      setNotice(error.code === '23505' ? 'Your team already locked in an answer for this one.' : 'Answers just closed for this question.');
    }
    refreshSubs();
  };

  const leave = () => {
    setSaved(null); setGame(null); setTeam(null); setTeams([]); setSubs([]); setPhase('join');
  };

  if (!supabaseConfigured) {
    return <div className="container trivia-page"><div className="trivia-card p-4">The trivia game isn't connected yet.</div></div>;
  }

  if (phase === 'loading') {
    return <div className="container trivia-page"><p className="text-center text-muted py-5">Loading…</p></div>;
  }

  if (phase === 'join' || !game || !team) {
    return (
      <div className="container trivia-page">
        <div className="trivia-join">
          <h1 className="trivia-title">Trivia Night</h1>
          <p className="text-muted mb-4">Enter the code from the big screen and pick a team name.</p>
          <form onSubmit={join} className="trivia-card p-4">
            <label htmlFor="trivia-code" className="form-label fw-semibold">Game code</label>
            <input id="trivia-code" className="form-control form-control-lg trivia-code-input mb-3" value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
              placeholder="ABCD" autoComplete="off" autoCapitalize="characters" inputMode="text" required />
            <label htmlFor="trivia-team" className="form-label fw-semibold">Team name</label>
            <input id="trivia-team" className="form-control form-control-lg mb-4" value={name} maxLength={30}
              onChange={(e) => setName(e.target.value)} placeholder="The Quizzly Bears" autoComplete="off" required />
            {err && <div className="alert alert-danger py-2">{err}</div>}
            <button type="submit" className="btn btn-trivia btn-lg w-100" disabled={busy || code.length < 4 || !name.trim()}>
              {busy ? 'Joining…' : 'Join game'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const ranked = rankTeams(teams);
  const myRank = ranked.find((t) => t.id === team.id)?.rank;
  const q = game.current;
  const mine = game.position !== null ? subs.find((s) => s.position === game.position) : undefined;
  const isTie = q?.type === 'tiebreaker';

  return (
    <div className="container trivia-page">
      <div className="trivia-bar">
        <div>
          <div className="fw-bold fs-5 text-truncate">{team.name}</div>
          <div className="small text-muted">Game {game.code}</div>
        </div>
        <div className="text-end">
          <div className="trivia-score">{fmtPoints(team.score)} <span className="small fw-normal">pts</span></div>
          {myRank && teams.length > 1 && <div className="small text-muted">#{myRank} of {teams.length}</div>}
        </div>
      </div>

      {game.status === 'lobby' && (
        <div className="trivia-card p-4 text-center">
          <h2 className="h3 fw-bold">You're in!</h2>
          <p className="mb-1">Watch the big screen. The first question is coming up.</p>
          <p className="text-muted small mb-0">{teams.length} {teams.length === 1 ? 'team has' : 'teams have'} joined</p>
        </div>
      )}

      {q && ['open', 'locked', 'reveal'].includes(game.status) && (
        <div className="trivia-card p-4">
          <div className="d-flex justify-content-between small text-muted mb-2">
            <span>{isTie ? 'Tiebreaker' : `Question ${q.number} of ${q.total}`}</span>
            <span>{typeLabel[q.type] ?? 'Question'}{q.points > 0 ? ` · ${fmtPoints(q.points)} pt${q.points === 1 ? '' : 's'}` : ''}</span>
          </div>
          <p className="trivia-q">{q.question}</p>
          {q.has_audio && <p className="trivia-hint">Listen to the song playing in the room.</p>}
          {q.image_urls.map((u) => <img key={u} src={u} alt="" className="trivia-img mb-3" />)}

          {game.status === 'reveal' && game.reveal?.position === game.position ? (
            <div className="trivia-reveal">
              <div className="small text-uppercase fw-semibold opacity-75">Answer</div>
              <div className="fs-4 fw-bold mb-2">{game.reveal.answer}</div>
              <div className="small">
                Your answer: <strong>{mine?.answer ?? 'no answer'}</strong>
                {mine && (mine.points === null ? ' · host is scoring…' : ` · +${fmtPoints(mine.points)}`)}
              </div>
            </div>
          ) : mine ? (
            <div className="trivia-locked">
              <div className="small fw-semibold">Locked in</div>
              <div className="fs-5 fw-bold">{mine.answer}</div>
              <div className="small opacity-75">Waiting for the host…</div>
            </div>
          ) : game.status === 'open' ? (
            <>
              {q.choices.length > 0 && (
                <div className="trivia-choices mb-3">
                  {q.choices.map((c) => (
                    <button key={c} type="button" className={`btn trivia-choice ${draft === c ? 'active' : ''}`} onClick={() => setDraft(c)}>{c}</button>
                  ))}
                </div>
              )}
              <label htmlFor="trivia-answer" className="form-label fw-semibold">Your answer</label>
              <textarea id="trivia-answer" className="form-control form-control-lg mb-3" rows={2} maxLength={500}
                inputMode={isTie ? 'numeric' : 'text'} value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder={isTie ? 'Your best guess' : 'Type your answer'} />
              {notice && <div className="alert alert-warning py-2">{notice}</div>}
              <button type="button" className="btn btn-trivia btn-lg w-100" disabled={!draft.trim()} onClick={() => setConfirming(true)}>
                Submit
              </button>
            </>
          ) : (
            <div className="trivia-locked muted">
              <div className="fw-bold">Answers are closed</div>
              <div className="small">{notice || 'Your team didn’t send an answer for this one.'}</div>
            </div>
          )}
        </div>
      )}

      {(game.status === 'scores' || game.status === 'ended') && (
        <div className="trivia-card p-4">
          <h2 className="h4 fw-bold mb-3">{game.status === 'ended' ? 'Final scores' : 'Scoreboard'}</h2>
          <ol className="trivia-standings">
            {ranked.map((t) => (
              <li key={t.id} className={t.id === team.id ? 'me' : ''}>
                <span className="rank">{t.rank}</span>
                <span className="name">{t.name}</span>
                <span className="pts">{fmtPoints(t.score)}</span>
              </li>
            ))}
          </ol>
          {game.status === 'ended' && <p className="text-center mt-3 mb-0">Thanks for playing!</p>}
        </div>
      )}

      <div className="text-center mt-4">
        <button type="button" className="btn btn-link btn-sm text-muted" onClick={leave}>Leave game</button>
      </div>

      {confirming && (
        <div className="trivia-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="trivia-modal-box">
            <h2 id="confirm-title" className="h4 fw-bold">Are you sure?</h2>
            <p className="mb-1">You're locking in:</p>
            <p className="fs-5 fw-bold trivia-confirm-answer">{draft.trim()}</p>
            <p className="small text-muted">You can't change it after this.</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-lg flex-fill" onClick={() => setConfirming(false)} disabled={sending}>Go back</button>
              <button type="button" className="btn btn-trivia btn-lg flex-fill" onClick={submit} disabled={sending}>
                {sending ? 'Sending…' : 'Lock it in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaPlayer;
