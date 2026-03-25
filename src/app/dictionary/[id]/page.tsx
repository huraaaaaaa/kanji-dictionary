'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import KanjiCard from '@/components/dictionary/KanjiCard';
import dictionaryData from '@/data/dictionary.json';
import { KanjiEntry } from '@/types';
import { useProgress } from '@/hooks/useProgress';

const entries = dictionaryData as KanjiEntry[];

export default function KanjiDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const entry = entries.find((e) => e.id === id);
  const { markLearned } = useProgress();

  useEffect(() => {
    if (entry) {
      entry.vocabulary.forEach((v) => markLearned(v.word));
    }
  }, [entry, markLearned]);

  if (!entry) notFound();

  return (
    <>
      <TopBar title={`${entry.kanji} の詳細`} showBack />
      <PageWrapper>
        <KanjiCard entry={entry} compact={false} />

        {/* Prev/Next navigation */}
        <div className="flex justify-between mt-8 gap-4">
          {id > 0 ? (
            <a
              href={`/dictionary/${id - 1}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-blue-300 hover:text-blue-700 transition-colors min-h-[44px]"
            >
              ← {entries[id - 1]?.kanji}
            </a>
          ) : <div className="flex-1" />}
          {id < entries.length - 1 ? (
            <a
              href={`/dictionary/${id + 1}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-blue-300 hover:text-blue-700 transition-colors min-h-[44px]"
            >
              {entries[id + 1]?.kanji} →
            </a>
          ) : <div className="flex-1" />}
        </div>
      </PageWrapper>
    </>
  );
}
