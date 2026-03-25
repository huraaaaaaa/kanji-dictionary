'use client';

import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import KanjiCard from '@/components/dictionary/KanjiCard';
import GradeSelector from '@/components/layout/GradeSelector';
import { useKanjiData } from '@/hooks/useKanjiData';

export default function DictionaryPage() {
  const [grade, setGrade] = useState<number | null>(null);
  const { filtered, query, setQuery } = useKanjiData(grade);

  return (
    <>
      <TopBar title="国語辞典" />
      <PageWrapper>
        {/* Grade selector */}
        <div className="mb-4">
          <GradeSelector selected={grade} onChange={setGrade} />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="漢字・読み・意味で検索…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-500 mb-4">
          {query
            ? `「${query}」の検索結果：${filtered.length}件`
            : `${grade !== null ? `${grade}年生 ` : ''}${filtered.length}字`}
        </p>

        {/* Kanji list — 2 columns on tablet/iPad */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((entry) => (
              <KanjiCard key={entry.id} entry={entry} compact />
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
