'use client';

import { VocabEntry } from '@/types';
import Furigana from '@/components/Furigana';
import FuriganaHtml from '@/components/FuriganaHtml';
import SpeakButton from './SpeakButton';

interface VocabItemProps {
  vocab: VocabEntry;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function renderExampleWithFurigana(example: string, word: string, reading: string) {
  const parts = example.split(word);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <Furigana word={word} reading={reading} />}
        </span>
      ))}
    </>
  );
}

export default function VocabItem({ vocab, isFavorite, onToggleFavorite }: VocabItemProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Furigana word={vocab.word} reading={vocab.reading} className="text-xl font-bold text-gray-900" />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <SpeakButton text={`${vocab.word}。${vocab.reading}。${vocab.meaning}。${vocab.example}`} label={vocab.word} size="sm" />
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
            className="p-1.5 min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? '#f59e0b' : 'none'} stroke={isFavorite ? '#f59e0b' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm">
        {vocab.meaningFurigana
          ? <FuriganaHtml html={vocab.meaningFurigana} />
          : vocab.meaning}
      </p>
      <div className="flex items-start gap-2">
        <p className="text-gray-500 text-sm flex-1">
          <span className="text-xs font-medium text-blue-600 mr-1"><ruby>例文<rt>れいぶん</rt></ruby></span>
          {vocab.exampleFurigana
            ? <FuriganaHtml html={vocab.exampleFurigana} />
            : renderExampleWithFurigana(vocab.example, vocab.word, vocab.reading)}
        </p>
        <SpeakButton text={vocab.example} label="例文" size="sm" />
      </div>
    </div>
  );
}
