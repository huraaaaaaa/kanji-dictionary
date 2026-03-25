'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import GradeSelector from '@/components/layout/GradeSelector';
import { QuestionType } from '@/types';
import { availableGrades } from '@/hooks/useKanjiData';
import dictionaryData from '@/data/dictionary.json';
import { KanjiEntry } from '@/types';

const allEntries = dictionaryData as KanjiEntry[];

const TEST_TYPES: { type: QuestionType; label: string; desc: string; emoji: string }[] = [
  { type: 'meaning-to-word', label: '意味から単語', desc: '意味を見て、正しい単語を選ぼう', emoji: '📝' },
  { type: 'word-to-meaning', label: '単語から意味', desc: '単語を見て、正しい意味を選ぼう', emoji: '🔍' },
  { type: 'fill-blank', label: '穴埋め問題', desc: '例文の＿＿＿に入る単語を答えよう', emoji: '✏️' },
];

const COUNTS = [5, 10];

export default function TestPage() {
  const router = useRouter();
  const [grade, setGrade] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<QuestionType>('meaning-to-word');
  const [count, setCount] = useState(10);

  const vocabCount = allEntries
    .filter((e) => grade === null || e.grade === grade)
    .flatMap((e) => e.vocabulary).length;

  const handleStart = () => {
    const params = new URLSearchParams({
      type: selectedType,
      count: String(Math.min(count, vocabCount)),
      ...(grade !== null && { grade: String(grade) }),
    });
    router.push(`/test/session?${params}`);
  };

  return (
    <>
      <TopBar title="語彙テスト" />
      <PageWrapper>
        {/* Grade */}
        <h2 className="text-base font-semibold text-gray-700 mb-3">学年</h2>
        <div className="mb-6">
          <GradeSelector selected={grade} onChange={setGrade} />
          <p className="text-xs text-gray-400 mt-2">
            対象語彙数：{vocabCount}語
          </p>
        </div>

        {/* Test type */}
        <h2 className="text-base font-semibold text-gray-700 mb-3">問題の種類</h2>
        <div className="space-y-3 mb-6">
          {TEST_TYPES.map(({ type, label, desc, emoji }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[44px] ${
                selectedType === type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${selectedType === type ? 'text-blue-700' : 'text-gray-800'}`}>{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                {selectedType === type && (
                  <svg className="ml-auto text-blue-500 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Count */}
        <h2 className="text-base font-semibold text-gray-700 mb-3">問題数</h2>
        <div className="flex gap-3 mb-8">
          {COUNTS.map((n) => {
            const disabled = n > vocabCount;
            return (
              <button
                key={n}
                onClick={() => !disabled && setCount(n)}
                disabled={disabled}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all min-h-[44px] ${
                  count === n && !disabled
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : disabled
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {n}問
              </button>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          disabled={vocabCount === 0}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[56px] shadow-sm disabled:opacity-40"
        >
          テストを始める 🚀
        </button>
      </PageWrapper>
    </>
  );
}
