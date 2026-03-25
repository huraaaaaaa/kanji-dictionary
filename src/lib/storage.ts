import { ProgressData } from '@/types';

const PROGRESS_KEY = 'kd_progress';

const defaultProgress: ProgressData = {
  learnedWords: [],
  favoriteWords: [],
  difficultWords: [],
  testHistory: [],
};

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
}
