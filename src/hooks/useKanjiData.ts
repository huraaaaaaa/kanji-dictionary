'use client';

import { useMemo, useState } from 'react';
import dictionaryData from '@/data/dictionary.json';
import { KanjiEntry } from '@/types';

const allEntries = dictionaryData as KanjiEntry[];

export const availableGrades = Array.from(new Set(allEntries.map((e) => e.grade))).sort();

export function useKanjiData(grade: number | null = null) {
  const [query, setQuery] = useState('');

  const byGrade = useMemo(
    () => (grade === null ? allEntries : allEntries.filter((e) => e.grade === grade)),
    [grade]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return byGrade;
    const q = query.trim();
    return byGrade.filter(
      (e) =>
        e.kanji.includes(q) ||
        e.readings.on.some((r) => r.includes(q)) ||
        e.readings.kun.some((r) => r.includes(q)) ||
        e.vocabulary.some(
          (v) =>
            v.word.includes(q) ||
            v.reading.includes(q) ||
            v.meaning.includes(q)
        )
    );
  }, [byGrade, query]);

  return { entries: allEntries, byGrade, filtered, query, setQuery };
}
