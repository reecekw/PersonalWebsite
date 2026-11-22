export type GameStatus = 'lobby' | 'open' | 'locked' | 'reveal' | 'scores' | 'ended';

// What players are allowed to see about the current question.
export interface PublicQuestion {
  position: number;
  number: number; // question number shown to people (1, 2, 3...)
  total: number;
  type: string;
  question: string;
  choices: string[];
  points: number;
  image_urls: string[];
  has_audio: boolean;
}

export interface Reveal {
  position: number;
  answer: string;
  image_urls: string[];
}

export interface Game {
  id: string;
  code: string;
  status: GameStatus;
  position: number | null;
  total: number | null;
  current: PublicQuestion | null;
  reveal: Reveal | null;
  created_at: string;
}

export interface Team {
  id: string;
  game_id: string;
  name: string;
  score: number;
  created_at: string;
}

export interface Submission {
  id: string;
  game_id: string;
  team_id: string;
  position: number;
  answer: string;
  points: number | null;
  created_at: string;
}

export interface Question {
  id: string;
  position: number;
  source: string | null;
  type: string;
  question: string;
  choices: string | null;
  answer: string | null;
  points: number;
  question_image: string | null;
  answer_image: string | null;
  audio_file: string | null; // song clip played with the question
  answer_audio: string | null; // e.g. the chorus, played when the answer is revealed
  notes: string | null;
}

export const BUCKET = 'trivia';

export const splitList = (v: string | null | undefined, sep = ';'): string[] =>
  (v ?? '').split(sep).map((s) => s.trim()).filter(Boolean);

export const rankTeams = (teams: Team[]): (Team & { rank: number })[] => {
  const sorted = [...teams].sort((a, b) => Number(b.score) - Number(a.score) || a.created_at.localeCompare(b.created_at));
  let rank = 0;
  let last: number | null = null;
  return sorted.map((t, i) => {
    if (last === null || Number(t.score) !== last) rank = i + 1;
    last = Number(t.score);
    return { ...t, rank };
  });
};

export const fmtPoints = (n: number | null | undefined): string =>
  n === null || n === undefined ? '' : Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toFixed(1);

export const typeLabel: Record<string, string> = {
  text: 'Question',
  multiple_choice: 'Multiple choice',
  image: 'Picture',
  name_that_tune: 'Name that tune',
  tiebreaker: 'Tiebreaker',
};
