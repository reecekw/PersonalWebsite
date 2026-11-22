/* eslint-disable react-hooks/set-state-in-effect -- these effects load data from Supabase and subscribe to live updates, which is what effects are for */
// Projector page: reece-williams.com/trivia/screen
// Open it from the host page (same browser, already signed in) and drag the window to the projector.
import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FaMusic, FaExpand } from 'react-icons/fa';
import { supabase, supabaseConfigured } from '../../lib/supabase';
import type { Game, Submission, Team } from './types';
import { fmtPoints, rankTeams, typeLabel } from './types';
import './Trivia.css';

const TriviaScreen: React.FC = () => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [subs, setSubs] = useState<Pick<Submission, 'id' | 'position'>[]>([]);
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (!supabaseConfigured) { setAllowed(false); return; }
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session || data.session.user.is_anonymous) { setAllowed(false); return; }
      const { data: ok } = await supabase.rpc('is_admin');
      setAllowed(Boolean(ok));
    })();
  }, []);

  const loadGame = useCallback(async () => {
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
    setGame((data as Game) ?? null);
  }, []);

  const gameId = game?.id;
  const refreshTeams = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('teams').select('*').eq('game_id', gameId).order('created_at');
    setTeams((data ?? []) as Team[]);
  }, [gameId]);
  const refreshSubs = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase.from('submissions').select('id, position').eq('game_id', gameId);
    setSubs((data ?? []) as Pick<Submission, 'id' | 'position'>[]);
  }, [gameId]);

  useEffect(() => { if (allowed) loadGame(); }, [allowed, loadGame]);

  // Follow new games and every change in the current one.
  useEffect(() => {
    if (!allowed) return;
    const channel = supabase
      .channel(`screen-${gameId ?? 'none'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (p) => {
        const row = p.new as Game | undefined;
        if (row && 'id' in row && (row.id === gameId || (p.eventType === 'INSERT'))) setGame(row);
      });
    if (gameId) {
      channel
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `game_id=eq.${gameId}` }, () => { refreshTeams(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `game_id=eq.${gameId}` }, () => { refreshSubs(); });
      refreshTeams(); refreshSubs();
    }
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [allowed, gameId, refreshTeams, refreshSubs]);

  const joinUrl = game ? `${window.location.origin}/trivia?code=${game.code}` : '';
  useEffect(() => {
    if (!joinUrl) return;
    QRCode.toDataURL(joinUrl, { margin: 1, width: 520, color: { dark: '#0f2027', light: '#ffffff' } })
      .then(setQr).catch(() => setQr(''));
  }, [joinUrl]);

  const fullscreen = () => { document.documentElement.requestFullscreen?.().catch(() => undefined); };

  if (allowed === null) return <div className="tv"><div className="tv-center">Loading…</div></div>;
  if (!allowed) {
    return (
      <div className="tv">
        <div className="tv-center">
          <h1 className="tv-title">Projector screen</h1>
          <p className="tv-sub">Sign in on <strong>/trivia/host</strong> in this browser first, then open the screen from there.</p>
        </div>
      </div>
    );
  }
  if (!game) {
    return <div className="tv"><div className="tv-center"><h1 className="tv-title">Trivia Night</h1><p className="tv-sub">Start a game from the host page.</p></div></div>;
  }

  const q = game.current;
  const ranked = rankTeams(teams);
  const answered = game.position !== null ? subs.filter((s) => s.position === game.position).length : 0;
  const showJoin = game.status === 'lobby';
  const isTie = q?.type === 'tiebreaker';

  return (
    <div className="tv">
      <button type="button" className="tv-fs" onClick={fullscreen} aria-label="Full screen"><FaExpand /></button>

      {showJoin && (
        <div className="tv-lobby">
          <div className="tv-lobby-text">
            <h1 className="tv-title">Trivia Night</h1>
            <p className="tv-sub">Scan the code or go to</p>
            <p className="tv-url">{window.location.host}/trivia</p>
            <p className="tv-sub mb-1">Game code</p>
            <p className="tv-code">{game.code}</p>
          </div>
          {qr && <img src={qr} alt={`QR code to join game ${game.code}`} className="tv-qr" />}
          <div className="tv-teams">
            {teams.length === 0 ? <span className="tv-muted">Teams will show up here as they join</span>
              : teams.map((t) => <span key={t.id} className="tv-chip">{t.name}</span>)}
          </div>
        </div>
      )}

      {q && (game.status === 'open' || game.status === 'locked') && (
        <div className="tv-question">
          <div className="tv-meta">
            <span>{isTie ? 'Tiebreaker' : `Question ${q.number} of ${q.total}`}</span>
            <span>{typeLabel[q.type] ?? ''}{q.points > 0 ? ` · ${fmtPoints(q.points)} pt${q.points === 1 ? '' : 's'}` : ''}</span>
          </div>
          <h1 className="tv-q">{q.question}</h1>
          {q.has_audio && <div className="tv-music"><FaMusic /> <span>Listen closely</span></div>}
          {q.image_urls.length > 0 && (
            <div className="tv-imgs">{q.image_urls.map((u) => <img key={u} src={u} alt="" />)}</div>
          )}
          {q.choices.length > 0 && (
            <div className="tv-choices">{q.choices.map((c) => <div key={c} className="tv-choice">{c}</div>)}</div>
          )}
          <div className="tv-foot">
            {game.status === 'locked'
              ? <span className="tv-pill locked">Answers locked</span>
              : <span className="tv-pill">{answered} of {teams.length} teams answered</span>}
            <span className="tv-muted">Code {game.code}</span>
          </div>
        </div>
      )}

      {q && game.status === 'reveal' && game.reveal && (
        <div className="tv-question">
          <div className="tv-meta"><span>{isTie ? 'Tiebreaker' : `Question ${q.number} of ${q.total}`}</span><span>Answer</span></div>
          <p className="tv-q small-q">{q.question}</p>
          <div className="tv-answer">{game.reveal.answer}</div>
          {game.reveal.image_urls.length > 0 && (
            <div className="tv-imgs">{game.reveal.image_urls.map((u) => <img key={u} src={u} alt="" />)}</div>
          )}
        </div>
      )}

      {(game.status === 'scores' || game.status === 'ended') && (
        <div className="tv-scores">
          <h1 className="tv-title">{game.status === 'ended' ? 'Final scores' : 'Scoreboard'}</h1>
          {game.status === 'ended' && ranked[0] && <p className="tv-winner">{ranked.filter((t) => t.rank === 1).map((t) => t.name).join(' & ')} win{ranked.filter((t) => t.rank === 1).length === 1 ? 's' : ''}!</p>}
          <ol className="tv-board">
            {ranked.slice(0, 12).map((t) => {
              const top = Number(ranked[0]?.score) || 1;
              return (
                <li key={t.id} className={t.rank === 1 ? 'first' : ''}>
                  <span className="rank">{t.rank}</span>
                  <span className="name">{t.name}</span>
                  <span className="bar"><i style={{ width: `${Math.max(4, (Number(t.score) / top) * 100)}%` }} /></span>
                  <span className="pts">{fmtPoints(t.score)}</span>
                </li>
              );
            })}
          </ol>
          {ranked.length > 12 && <p className="tv-muted">+ {ranked.length - 12} more teams</p>}
        </div>
      )}
    </div>
  );
};

export default TriviaScreen;
