'use client';

import { useCallback, useEffect, useState } from 'react';
import { ProgressData, TestResult } from '@/types';
import { getProgress, saveProgress } from '@/lib/storage';

export function useProgress() {
  const [data, setData] = useState<ProgressData>({
    learnedWords: [],
    favoriteWords: [],
    difficultWords: [],
    testHistory: [],
  });

  useEffect(() => {
    setData(getProgress());
  }, []);

  const update = useCallback((updater: (prev: ProgressData) => ProgressData) => {
    setData((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const markLearned = useCallback((word: string) => {
    update((prev) => {
      if (prev.learnedWords.includes(word)) return prev;
      return { ...prev, learnedWords: [...prev.learnedWords, word] };
    });
  }, [update]);

  const toggleFavorite = useCallback((word: string) => {
    update((prev) => {
      const isFav = prev.favoriteWords.includes(word);
      return {
        ...prev,
        favoriteWords: isFav
          ? prev.favoriteWords.filter((w) => w !== word)
          : [...prev.favoriteWords, word],
      };
    });
  }, [update]);

  const addDifficultWord = useCallback((word: string) => {
    update((prev) => {
      if (prev.difficultWords.includes(word)) return prev;
      return { ...prev, difficultWords: [...prev.difficultWords, word] };
    });
  }, [update]);

  const removeDifficultWord = useCallback((word: string) => {
    update((prev) => ({
      ...prev,
      difficultWords: prev.difficultWords.filter((w) => w !== word),
    }));
  }, [update]);

  const saveTestResult = useCallback((result: TestResult) => {
    update((prev) => ({
      ...prev,
      testHistory: [result, ...prev.testHistory].slice(0, 50),
    }));
  }, [update]);

  const accuracy = (() => {
    const total = data.testHistory.reduce((sum, r) => sum + r.total, 0);
    const correct = data.testHistory.reduce((sum, r) => sum + r.score, 0);
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  })();

  return {
    ...data,
    accuracy,
    markLearned,
    toggleFavorite,
    addDifficultWord,
    removeDifficultWord,
    saveTestResult,
  };
}
