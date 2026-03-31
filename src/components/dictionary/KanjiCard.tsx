'use client';

import Link from 'next/link';
import { KanjiEntry } from '@/types';
import SpeakButton from './SpeakButton';
import VocabItem from './VocabItem';
import StrokeOrder from './StrokeOrder';
import FuriganaHtml from '@/components/FuriganaHtml';
import { useProgress } from '@/hooks/useProgress';

interface KanjiCardProps {
  entry: KanjiEntry;
  compact?: boolean;
}

export default function KanjiCard({ entry, compact = false }: KanjiCardProps) {
  const { favoriteWords, toggleFavorite } = useProgress();

  const readingText = [
    ...entry.readings.on.map((r) => `音読み ${r}`),
    ...entry.readings.kun.map((r) => `訓読み ${r}`),
  ].join('、');

  if (compact) {
    return (
      <Link href={`/dictionary/${entry.id}`} className="block">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-blue-900 w-16 text-center">{entry.kanji}</span>
            <div>
              <div className="flex flex-wrap gap-1 mb-1">
                {entry.readings.on.map((r) => (
                  <span key={r} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium"><ruby>音<rt>おん</rt></ruby> {r}</span>
                ))}
                {entry.readings.kun.map((r) => (
                  <span key={r} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"><ruby>訓<rt>くん</rt></ruby> {r}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">{entry.vocabulary.length}<ruby>語<rt>ご</rt></ruby>の<ruby>語彙<rt>ごい</rt></ruby></p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      {/* Kanji header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-7xl font-bold text-blue-900 leading-none">{entry.kanji}</span>
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1">
                {entry.readings.on.map((r) => (
                  <span key={r} className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"><ruby>音<rt>おん</rt></ruby> {r}</span>
                ))}
                {entry.readings.kun.map((r) => (
                  <span key={r} className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full font-medium"><ruby>訓<rt>くん</rt></ruby> {r}</span>
                ))}
              </div>
            </div>
          </div>
          <SpeakButton text={readingText} label="読み方" />
        </div>
        <div className="mt-4 pt-4 border-t border-blue-100">
          <p className="text-xs font-semibold text-blue-600 mb-1"><ruby>成<rt>な</rt></ruby>り<ruby>立<rt>た</rt></ruby>ち</p>
          <p className="text-sm text-gray-700">
            {entry.originFurigana
              ? <FuriganaHtml html={entry.originFurigana} />
              : entry.origin}
          </p>
        </div>
      </div>

      {/* Stroke order */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          <ruby>書<rt>か</rt></ruby>き<ruby>順<rt>じゅん</rt></ruby>
        </h3>
        <StrokeOrder kanji={entry.kanji} />
      </div>

      {/* Vocabulary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3"><ruby>関連<rt>かんれん</rt></ruby><ruby>語彙<rt>ごい</rt></ruby></h3>
        <div className="space-y-3">
          {entry.vocabulary.map((vocab) => (
            <VocabItem
              key={vocab.word}
              vocab={vocab}
              isFavorite={favoriteWords.includes(vocab.word)}
              onToggleFavorite={() => toggleFavorite(vocab.word)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
