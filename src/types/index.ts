export interface VocabEntry {
  word: string;
  reading: string;
  meaning: string;
  example: string;
}

export interface KanjiEntry {
  id: number;
  grade: number;
  kanji: string;
  readings: { on: string[]; kun: string[] };
  origin: string;
  vocabulary: VocabEntry[];
}

export const GRADES = [1, 2, 3, 4, 5, 6] as const;
export type Grade = typeof GRADES[number];

export type QuestionType = 'meaning-to-word' | 'word-to-meaning' | 'fill-blank';

export type AnswerState = 'idle' | 'correct' | 'incorrect';

export interface Question {
  type: QuestionType;
  prompt: string;
  answer: string;
  choices?: string[];
  blankedSentence?: string;
  sourceWord: string;
}

export interface TestResult {
  id: string;
  date: string;
  type: QuestionType;
  score: number;
  total: number;
  incorrectWords: string[];
}

export interface ProgressData {
  learnedWords: string[];
  favoriteWords: string[];
  difficultWords: string[];
  testHistory: TestResult[];
}
