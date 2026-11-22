/* eslint-disable react-hooks/set-state-in-effect -- these effects load data from Supabase and subscribe to live updates, which is what effects are for */
// Host tab for loading questions from a CSV, uploading pictures and songs, and reshuffling.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Question } from './types';
import { BUCKET, fmtPoints, splitList, typeLabel } from './types';
import { parseCsv } from './csv';

const TYPES = ['text', 'multiple_choice', 'image', 'name_that_tune', 'tiebreaker'];
const blank = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

interface Props { questions: Question[]; onChanged: () => void; locked: boolean }

const QuestionManager: React.FC<Props> = ({ questions, onChanged, locked }) => {
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  const [csvName, setCsvName] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const loadFiles = useCallback(async () => {
    const { data } = await supabase.storage.from(BUCKET).list('', { limit: 1000 });
    setFiles((data ?? []).map((f) => f.name));
  }, []);
  useEffect(() => { loadFiles(); }, [loadFiles]);

  const needed = useMemo(() => {
    const names = new Set<string>();
    questions.forEach((q) => [...splitList(q.question_image), ...splitList(q.answer_image), ...splitList(q.audio_file), ...splitList(q.answer_audio)].forEach((n) => names.add(n)));
    return [...names];
  }, [questions]);
  const missing = needed.filter((n) => !files.includes(n));

  const readCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const parsed = parseCsv(await f.text()).filter((r) => r.question);
    setRows(parsed); setCsvName(f.name);
    setStatus(parsed.length ? '' : 'No questions found. The CSV needs a "question" column.');
  };

  const importRows = async () => {
    if (!rows) return;
    setBusy(true); setStatus('Replacing questions…');
    const records = rows.map((r, i) => {
      const pts = Number(r.points);
      const type = (r.type || 'text').toLowerCase();
      return {
        position: Number(r.position) || i + 1,
        source: blank(r.source),
        type: TYPES.includes(type) ? type : 'text',
        question: r.question,
        choices: blank(r.choices),
        answer: blank(r.answer),
        points: Number.isFinite(pts) && r.points !== '' ? pts : 1,
        question_image: blank(r.question_image),
        answer_image: blank(r.answer_image),
        audio_file: blank(r.audio_file),
        answer_audio: blank(r.answer_audio),
        notes: blank(r.notes),
      };
    });
    const del = await supabase.from('questions').delete().not('id', 'is', null);
    if (del.error) { setStatus(`Couldn't clear old questions: ${del.error.message}`); setBusy(false); return; }
    const ins = await supabase.from('questions').insert(records);
    setBusy(false);
    if (ins.error) { setStatus(`Couldn't save questions: ${ins.error.message}`); return; }
    setStatus(`Loaded ${records.length} questions from ${csvName}.`);
    setRows(null);
    onChanged();
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    if (!list.length) return;
    setBusy(true);
    let done = 0; const failed: string[] = [];
    for (const f of list) {
      setStatus(`Uploading ${done + 1} of ${list.length}: ${f.name}`);
      const { error } = await supabase.storage.from(BUCKET).upload(f.name, f, { upsert: true, contentType: f.type || undefined });
      if (error) failed.push(`${f.name} (${error.message})`);
      done++;
    }
    setBusy(false);
    e.target.value = '';
    setStatus(failed.length ? `Uploaded ${done - failed.length} files. Failed: ${failed.join(', ')}` : `Uploaded ${done} files.`);
    loadFiles();
  };

  const shuffle = async () => {
    setBusy(true); setStatus('Shuffling…');
    const normal = questions.filter((q) => q.type !== 'tiebreaker');
    const ties = questions.filter((q) => q.type === 'tiebreaker');
    for (let i = normal.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [normal[i], normal[j]] = [normal[j], normal[i]];
    }
    const reordered = [...normal, ...ties].map((q, i) => ({ ...q, position: i + 1 }));
    const { error } = await supabase.from('questions').upsert(reordered);
    setBusy(false);
    setStatus(error ? `Couldn't shuffle: ${error.message}` : 'Questions shuffled. The tiebreaker stays last.');
    onChanged();
  };

  return (
    <div className="row g-3">
      <div className="col-lg-5">
        <div className="trivia-card p-3 p-md-4 mb-3">
          <h2 className="h5 fw-bold">1. Load questions from a CSV</h2>
          <p className="small text-muted">Columns: position, type, question, choices (separated by |), answer, points, question_image, answer_image, audio_file (clip played with the question), answer_audio (played when you reveal), notes. Loading replaces every question.</p>
          <input type="file" accept=".csv,text/csv" className="form-control mb-2" onChange={readCsv} disabled={busy || locked} aria-label="Question CSV file" />
          {rows && rows.length > 0 && (
            <div className="mt-2">
              <p className="mb-2"><strong>{rows.length}</strong> questions found in {csvName}.</p>
              <button type="button" className="btn btn-trivia" onClick={importRows} disabled={busy}>Replace all questions</button>
            </div>
          )}
          {locked && <p className="small text-danger mt-2 mb-0">A game is in progress. End it before replacing or shuffling questions.</p>}
        </div>

        <div className="trivia-card p-3 p-md-4 mb-3">
          <h2 className="h5 fw-bold">2. Upload pictures and songs</h2>
          <p className="small text-muted">Select all the files at once. Names must match the CSV (for example T05_audio.mp3). Uploading a file with the same name replaces it. Files are private: players only get a temporary link when you send or reveal a question.</p>
          <input type="file" multiple accept="image/*,audio/*" className="form-control mb-2" onChange={upload} disabled={busy} aria-label="Pictures and songs" />
          <p className="small mb-1">{files.length} files uploaded.</p>
          {needed.length > 0 && (missing.length === 0
            ? <p className="small text-success mb-0">Every picture and song the questions need is uploaded.</p>
            : <p className="small text-danger mb-0">Missing {missing.length}: {missing.join(', ')}</p>)}
        </div>

        <div className="trivia-card p-3 p-md-4 mb-3">
          <h2 className="h5 fw-bold">3. Shuffle the order</h2>
          <p className="small text-muted">Randomizes every question. The tiebreaker always stays last.</p>
          <button type="button" className="btn btn-outline-dark" onClick={shuffle} disabled={busy || locked || questions.length < 2}>Shuffle questions</button>
        </div>
        {status && <div className="alert alert-info py-2">{status}</div>}
      </div>

      <div className="col-lg-7">
        <div className="trivia-card p-3 p-md-4">
          <h2 className="h5 fw-bold">{questions.length} questions in play order</h2>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead><tr><th>#</th><th>Question</th><th>Answer</th><th className="text-end">Pts</th></tr></thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.id}>
                    <td className="text-muted">{q.type === 'tiebreaker' ? 'TB' : i + 1}</td>
                    <td>
                      <div>{q.question}</div>
                      <div className="small text-muted">
                        {typeLabel[q.type] ?? q.type}{q.source ? ` · ${q.source}` : ''}
                        {q.audio_file ? ` · ${q.audio_file}` : ''}{q.answer_audio ? ` · ${q.answer_audio}` : ''}
                      </div>
                      {q.notes && <div className="small text-warning-emphasis">{q.notes}</div>}
                    </td>
                    <td>{q.answer}</td>
                    <td className="text-end">{fmtPoints(q.points)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
