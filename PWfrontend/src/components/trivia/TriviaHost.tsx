/* eslint-disable react-hooks/set-state-in-effect -- these effects load data from Supabase and subscribe to live updates, which is what effects are for */
// Host page: reece-williams.com/trivia/host
// Only signed-in admins get past the login. Run the game, score answers, manage questions.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../../lib/supabase';
import type { Game, PublicQuestion, Question, Submission, Team } from './types';
import { BUCKET, fmtPoints, rankTeams, splitList, typeLabel } from './types';
import QuestionManager from './QuestionManager';
import './Trivia.css';

const SIGNED_FOR = 60 * 60 * 8; // picture and song links last 8 hours

async function signedUrls(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, SIGNED_FOR);
  return (data ?? []).map((d) => d.signedUrl).filter((u): u is string => Boolean(u));
}

const firstNumber = (s: string | null | undefined): number | null => {
  const m = (s ?? '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const newCode = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
};

// ---------------- Sign-in gate ----------------
const TriviaHost: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || session.user.is_anonymous) { setIsAdmin(null); return; }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);

  const signOut = () => { supabase.auth.signOut(); };

  if (!supabaseConfigured) {
    return (
      <div className="container trivia-page">
        <div className="trivia-card p-4">
          <h1 className="h4 fw-bold">Trivia isn't connected yet</h1>
          <p className="mb-0">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> (and to Cloudflare), then restart.</p>
        </div>
      </div>
    );
  }
  if (!ready || (session && !session.user.is_anonymous && isAdmin === null)) {
    return <div className="container trivia-page"><p className="text-center text-muted py-5">Loading…</p></div>;
  }
  if (!session || session.user.is_anonymous) return <HostLogin />;
  if (!isAdmin) {
    return (
      <div className="container trivia-page">
        <div className="trivia-card p-4">
          <h1 className="h4 fw-bold">Not a host account</h1>
          <p>{session.user.email} isn't set up as an admin.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }
  return <HostConsole email={session.user.email ?? ''} onSignOut={signOut} />;
};

const HostLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr('That email and password didn’t work.');
  };
  return (
    <div className="container trivia-page">
      <div className="trivia-join">
        <h1 className="trivia-title">Host sign in</h1>
        <form onSubmit={submit} className="trivia-card p-4">
          <label htmlFor="host-email" className="form-label fw-semibold">Email</label>
          <input id="host-email" type="email" className="form-control form-control-lg mb-3" value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
          <label htmlFor="host-password" className="form-label fw-semibold">Password</label>
          <input id="host-password" type="password" className="form-control form-control-lg mb-4" value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <button type="submit" className="btn btn-trivia btn-lg w-100" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
};

// ---------------- Host console ----------------
const HostConsole: React.FC<{ email: string; onSignOut: () => void }> = ({ email, onSignOut }) => {
  const [tab, setTab] = useState<'run' | 'questions'>('run');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [audioUrls, setAudioUrls] = useState<{ q: string; a: string }>({ q: '', a: '' });
  const [hostImgs, setHostImgs] = useState<{ q: string[]; a: string[] }>({ q: [], a: [] });
  const clipRef = useRef<HTMLAudioElement>(null);
  const chorusRef = useRef<HTMLAudioElement>(null);
  const stopAudio = () => { clipRef.current?.pause(); chorusRef.current?.pause(); };

  const loadQuestions = useCallback(async () => {
    const { data, error } = await supabase.from('questions').select('*').order('position');
    if (error) setMsg(`Couldn't load questions: ${error.message}`);
    setQuestions((data ?? []) as Question[]);
  }, []);

  const loadGame = useCallback(async () => {
    const { data } = await supabase.from('games').select('*').neq('status', 'ended')
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    setGame((data as Game) ?? null);
  }, []);

  useEffect(() => { loadQuestions(); loadGame(); }, [loadQuestions, loadGame]);

  const gameId = game?.id;
  const refreshTeams = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('teams').select('*').eq('game_id', gameId).order('created_at');
    setTeams((data ?? []) as Team[]);
  }, [gameId]);
  const refreshSubs = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('submissions').select('*').eq('game_id', gameId).order('created_at');
    setSubs((data ?? []) as Submission[]);
  }, [gameId]);

  useEffect(() => {
    if (!gameId) { setTeams([]); setSubs([]); return; }
    refreshTeams(); refreshSubs();
    const channel = supabase
      .channel(`host-${gameId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `game_id=eq.${gameId}` }, () => { refreshTeams(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `game_id=eq.${gameId}` }, () => { refreshSubs(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [gameId, refreshTeams, refreshSubs]);

  const ordered = useMemo(() => [...questions].sort((a, b) => a.position - b.position), [questions]);
  const numberOf = (pos: number) => ordered.findIndex((q) => q.position === pos) + 1;
  const cur = game?.position != null ? ordered.find((q) => q.position === game.position) : undefined;
  const curIndex = cur ? ordered.indexOf(cur) : -1;
  const next = ordered[curIndex + 1];
  const curSubs = cur ? subs.filter((s) => s.position === cur.position) : [];
  const answeredIds = new Set(curSubs.map((s) => s.team_id));
  const waiting = teams.filter((t) => !answeredIds.has(t.id));
  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? 'Removed team';
  const ranked = rankTeams(teams);

  // Load the song and the pictures for the current question (host-only preview).
  useEffect(() => {
    let live = true;
    (async () => {
      if (!cur) { setAudioUrls({ q: '', a: '' }); setHostImgs({ q: [], a: [] }); return; }
      const [clip, chorus, q, a] = await Promise.all([
        signedUrls(cur.audio_file ? [cur.audio_file] : []),
        signedUrls(cur.answer_audio ? [cur.answer_audio] : []),
        signedUrls(splitList(cur.question_image)),
        signedUrls(splitList(cur.answer_image)),
      ]);
      if (!live) return;
      setAudioUrls({ q: clip[0] ?? '', a: chorus[0] ?? '' });
      setHostImgs({ q, a });
    })();
    return () => { live = false; };
  }, [cur?.id, cur?.audio_file, cur?.answer_audio, cur?.question_image, cur?.answer_image]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateGame = async (patch: Partial<Game>) => {
    if (!game) return;
    setBusy(true); setMsg('');
    const { data, error } = await supabase.from('games').update(patch).eq('id', game.id).select().single();
    setBusy(false);
    if (error) { setMsg(`Couldn't update the game: ${error.message}`); return; }
    setGame(data as Game);
  };

  const startGame = async () => {
    setBusy(true); setMsg('');
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase.from('games')
        .insert({ code: newCode(), status: 'lobby', total: ordered.length }).select().single();
      if (!error) { setGame(data as Game); setBusy(false); return; }
      if (error.code !== '23505') { setMsg(`Couldn't start a game: ${error.message}`); break; }
    }
    setBusy(false);
  };

  const send = async (q: Question) => {
    const image_urls = await signedUrls(splitList(q.question_image));
    const current: PublicQuestion = {
      position: q.position,
      number: numberOf(q.position),
      total: ordered.filter((x) => x.type !== 'tiebreaker').length,
      type: q.type,
      question: q.question,
      choices: splitList(q.choices, '|'),
      points: Number(q.points),
      image_urls,
      has_audio: Boolean(q.audio_file),
    };
    stopAudio();
    await updateGame({ status: 'open', position: q.position, current, reveal: null, total: ordered.length });
  };

  const reveal = async () => {
    if (!cur) return;
    const image_urls = await signedUrls(splitList(cur.answer_image));
    clipRef.current?.pause();
    await updateGame({ status: 'reveal', reveal: { position: cur.position, answer: cur.answer ?? '', image_urls } });
    // Play the chorus with the reveal, if this question has one.
    if (chorusRef.current && audioUrls.a) {
      chorusRef.current.currentTime = 0;
      chorusRef.current.play().catch(() => undefined);
    }
  };

  const endGame = async () => { await updateGame({ status: 'ended' }); setConfirmEnd(false); };

  const score = async (s: Submission, pts: number | null) => {
    setSubs((all) => all.map((x) => (x.id === s.id ? { ...x, points: pts } : x)));
    const { error } = await supabase.from('submissions').update({ points: pts }).eq('id', s.id);
    if (error) { setMsg(`Couldn't save that score: ${error.message}`); refreshSubs(); }
  };

  const removeTeam = async (t: Team) => {
    if (removing !== t.id) { setRemoving(t.id); setTimeout(() => setRemoving(null), 3000); return; }
    setRemoving(null);
    const { error } = await supabase.from('teams').delete().eq('id', t.id);
    if (error) setMsg(`Couldn't remove ${t.name}: ${error.message}`);
    refreshTeams();
  };

  const openScreen = () => { window.open('/trivia/screen', 'trivia-screen'); };

  // Tiebreaker: sort guesses by how close they are.
  const target = cur?.type === 'tiebreaker' ? firstNumber(cur.answer) : null;
  const shownSubs = target === null ? curSubs : [...curSubs].sort((a, b) => {
    const da = firstNumber(a.answer); const db = firstNumber(b.answer);
    return (da === null ? Infinity : Math.abs(da - target)) - (db === null ? Infinity : Math.abs(db - target));
  });

  const status = game?.status;

  return (
    <div className="container-fluid trivia-host">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="h3 fw-bold mb-0">Trivia host</h1>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <div className="btn-group" role="tablist">
            <button type="button" className={`btn ${tab === 'run' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setTab('run')}>Run game</button>
            <button type="button" className={`btn ${tab === 'questions' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setTab('questions')}>Questions &amp; files</button>
          </div>
          <span className="small text-muted d-none d-md-inline">{email}</span>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onSignOut}>Sign out</button>
        </div>
      </div>
      {msg && <div className="alert alert-warning py-2">{msg}</div>}

      {tab === 'questions' && (
        <QuestionManager questions={ordered} onChanged={loadQuestions} locked={Boolean(game && status !== 'lobby' && status !== 'ended')} />
      )}

      {tab === 'run' && !game && (
        <div className="trivia-card p-4">
          <h2 className="h4 fw-bold">No game running</h2>
          {ordered.length === 0 ? (
            <p className="mb-0">Add your questions first in <strong>Questions &amp; files</strong>.</p>
          ) : (
            <>
              <p>{ordered.length} questions are ready. Starting a game creates a join code for players.</p>
              <button type="button" className="btn btn-trivia btn-lg" onClick={startGame} disabled={busy}>Start a new game</button>
            </>
          )}
        </div>
      )}

      {tab === 'run' && game && (
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="trivia-card p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <div className="small text-muted">Join code</div>
                <div className="trivia-host-code">{game.code}</div>
                <div className="small text-muted">{window.location.host}/trivia · {teams.length} {teams.length === 1 ? 'team' : 'teams'}</div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline-dark" onClick={openScreen}>Open projector screen</button>
                {confirmEnd ? (
                  <button type="button" className="btn btn-danger" onClick={endGame}>Tap again to end the game</button>
                ) : (
                  <button type="button" className="btn btn-outline-danger" onClick={() => { setConfirmEnd(true); setTimeout(() => setConfirmEnd(false), 3000); }}>End game</button>
                )}
              </div>
            </div>

            {status === 'lobby' && (
              <div className="trivia-card p-4 mb-3">
                <h2 className="h4 fw-bold">Waiting for teams</h2>
                <p>Put the projector screen up so teams can scan the code. Send the first question when everyone's in.</p>
                {ordered[0] && <button type="button" className="btn btn-trivia btn-lg" onClick={() => send(ordered[0])} disabled={busy}>Send question 1</button>}
              </div>
            )}

            {status === 'ended' && (
              <div className="trivia-card p-4 mb-3">
                <h2 className="h4 fw-bold">Game over</h2>
                <p>Final scores are on the projector and on every phone.</p>
                <button type="button" className="btn btn-trivia btn-lg" onClick={startGame} disabled={busy}>Start a new game</button>
              </div>
            )}

            {cur && status !== 'lobby' && status !== 'ended' && (
              <div className="trivia-card p-3 p-md-4 mb-3">
                <div className="d-flex flex-wrap justify-content-between gap-2 small text-muted mb-1">
                  <span>{cur.type === 'tiebreaker' ? 'Tiebreaker' : `Question ${numberOf(cur.position)} of ${ordered.filter((x) => x.type !== 'tiebreaker').length}`} · {typeLabel[cur.type] ?? cur.type} · {fmtPoints(cur.points)} {Number(cur.points) === 1 ? 'pt' : 'pts'}</span>
                  <span className={`badge trivia-status ${status}`}>{status === 'open' ? 'Answers open' : status === 'locked' ? 'Answers locked' : status === 'reveal' ? 'Answer revealed' : status === 'scores' ? 'Showing scores' : status}</span>
                </div>
                <p className="fs-5 fw-semibold mb-2">{cur.question}</p>
                {cur.choices && <p className="small mb-2">{splitList(cur.choices, '|').join('   ·   ')}</p>}
                <div className="trivia-host-answer">Answer: <strong>{cur.answer}</strong></div>
                {cur.notes && <p className="small text-muted mt-2 mb-0">Note: {cur.notes}</p>}
                {(hostImgs.q.length > 0 || hostImgs.a.length > 0) && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {hostImgs.q.map((u) => <img key={u} src={u} alt="Question picture" className="trivia-thumb" />)}
                    {hostImgs.a.map((u) => <img key={u} src={u} alt="Answer picture" className="trivia-thumb answer" />)}
                  </div>
                )}
                {(cur.audio_file || cur.answer_audio) && (
                  <div className="trivia-audio mt-3">
                    {([
                      ['Song clip', 'plays with the question', cur.audio_file, audioUrls.q, clipRef, chorusRef],
                      ['Chorus', 'plays automatically when you reveal the answer', cur.answer_audio, audioUrls.a, chorusRef, clipRef],
                    ] as const).map(([label, hint, file, url, ref, other]) => file && (
                      <div key={label} className="trivia-audio-row">
                        <div className="small mb-1"><strong>{label}</strong> <span className="text-muted">· {hint}</span></div>
                        {url ? (
                          <>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              <button type="button" className="btn btn-trivia" onClick={() => { other.current?.pause(); ref.current?.play(); }}>Play</button>
                              <button type="button" className="btn btn-outline-dark" onClick={() => ref.current?.pause()}>Pause</button>
                              <button type="button" className="btn btn-outline-dark" onClick={() => { if (ref.current) { other.current?.pause(); ref.current.currentTime = 0; ref.current.play(); } }}>Restart</button>
                            </div>
                            <audio ref={ref} src={url} controls preload="auto" className="w-100" />
                          </>
                        ) : (
                          <div className="small text-danger">“{file}” isn't uploaded yet.</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {status === 'open' && <button type="button" className="btn btn-dark" onClick={() => updateGame({ status: 'locked' })} disabled={busy}>Lock answers</button>}
                  {status === 'locked' && <button type="button" className="btn btn-outline-dark" onClick={() => updateGame({ status: 'open' })} disabled={busy}>Reopen answers</button>}
                  {(status === 'open' || status === 'locked') && <button type="button" className="btn btn-trivia" onClick={reveal} disabled={busy}>{cur.answer_audio ? 'Reveal answer + play chorus' : 'Reveal answer'}</button>}
                  {status === 'reveal' && <button type="button" className="btn btn-dark" onClick={() => updateGame({ status: 'scores' })} disabled={busy}>Show scoreboard</button>}
                  {status === 'scores' && <button type="button" className="btn btn-outline-dark" onClick={() => updateGame({ status: 'reveal' })} disabled={busy}>Back to answer</button>}
                  {(status === 'reveal' || status === 'scores') && (next
                    ? <button type="button" className="btn btn-trivia" onClick={() => send(next)} disabled={busy}>Next: {next.type === 'tiebreaker' ? 'tiebreaker' : `question ${numberOf(next.position)}`} →</button>
                    : <button type="button" className="btn btn-danger" onClick={endGame} disabled={busy}>Finish and show final scores</button>)}
                </div>
              </div>
            )}

            {cur && status !== 'lobby' && (
              <div className="trivia-card p-3 p-md-4 mb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-2">
                  <h2 className="h5 fw-bold mb-0">Answers · {curSubs.length} of {teams.length}</h2>
                  {target !== null && <span className="small text-muted">Sorted by closest to {target.toLocaleString()}</span>}
                </div>
                {shownSubs.length === 0 && <p className="text-muted mb-2">No answers yet.</p>}
                <ul className="trivia-subs">
                  {shownSubs.map((s, i) => (
                    <li key={s.id} className={s.points === null ? '' : Number(s.points) > 0 ? 'right' : 'wrong'}>
                      <div className="who">
                        <div className="fw-bold text-truncate">{teamName(s.team_id)}{target !== null && i === 0 && <span className="badge bg-warning text-dark ms-2">Closest</span>}</div>
                        <div className="ans">{s.answer}</div>
                      </div>
                      <div className="pts-btns">
                        <button type="button" className={`btn btn-sm ${Number(s.points) === Number(cur.points) && s.points !== null ? 'btn-success' : 'btn-outline-success'}`} onClick={() => score(s, Number(cur.points) || 1)} title="Full points">✓ {fmtPoints(Number(cur.points) || 1)}</button>
                        {Number(cur.points) >= 1 && (
                          <button type="button" className={`btn btn-sm ${s.points !== null && Number(s.points) === (Number(cur.points) || 1) / 2 ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => score(s, (Number(cur.points) || 1) / 2)} title="Half points">½</button>
                        )}
                        <button type="button" className={`btn btn-sm ${s.points !== null && Number(s.points) === 0 ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => score(s, 0)} title="No points">✗</button>
                        <input type="number" step="0.5" min="0" className="form-control form-control-sm trivia-pts-input" aria-label={`Points for ${teamName(s.team_id)}`}
                          value={s.points ?? ''} placeholder="pts"
                          onChange={(e) => score(s, e.target.value === '' ? null : Number(e.target.value))} />
                      </div>
                    </li>
                  ))}
                </ul>
                {waiting.length > 0 && status === 'open' && (
                  <p className="small text-muted mb-0">Still waiting on: {waiting.map((t) => t.name).join(', ')}</p>
                )}
              </div>
            )}
          </div>

          <div className="col-lg-5">
            <div className="trivia-card p-3 p-md-4 mb-3">
              <h2 className="h5 fw-bold">Scoreboard</h2>
              {ranked.length === 0 && <p className="text-muted mb-0">No teams yet.</p>}
              <ol className="trivia-standings host">
                {ranked.map((t) => (
                  <li key={t.id}>
                    <span className="rank">{t.rank}</span>
                    <span className="name">{t.name}</span>
                    <span className="pts">{fmtPoints(t.score)}</span>
                    <button type="button" className={`btn btn-sm ${removing === t.id ? 'btn-danger' : 'btn-link text-muted'}`} onClick={() => removeTeam(t)}>
                      {removing === t.id ? 'Confirm' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="trivia-card p-3 p-md-4">
              <h2 className="h5 fw-bold">All questions</h2>
              <p className="small text-muted">Only you can see these. Send any question to jump to it.</p>
              <ol className="trivia-qlist">
                {ordered.map((q, i) => (
                  <li key={q.id} className={q.position === game.position ? 'now' : curIndex >= 0 && i < curIndex ? 'done' : ''}>
                    <div className="flex-grow-1">
                      <div className="small text-muted">{q.type === 'tiebreaker' ? 'Tiebreaker' : `#${i + 1}`} · {typeLabel[q.type] ?? q.type}{q.audio_file || q.answer_audio ? ' · song' : ''}</div>
                      <div className="fw-semibold">{q.question}</div>
                      <div className="small">Answer: {q.answer}</div>
                    </div>
                    {q.position !== game.position && (
                      <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => send(q)} disabled={busy}>Send</button>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaHost;
