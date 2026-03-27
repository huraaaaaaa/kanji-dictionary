'use client';

import { availableGrades } from '@/hooks/useKanjiData';

interface GradeSelectorProps {
  selected: number | null;
  onChange: (grade: number | null) => void;
}

export default function GradeSelector({ selected, onChange }: GradeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors min-h-[44px] ${
          selected === null
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-200 text-gray-600 hover:border-blue-300'
        }`}
      >
        <ruby>全<rt>ぜん</rt></ruby><ruby>学年<rt>がくねん</rt></ruby>
      </button>
      {availableGrades.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors min-h-[44px] ${
            selected === g
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 text-gray-600 hover:border-blue-300'
          }`}
        >
          {g}<ruby>年生<rt>ねんせい</rt></ruby>
        </button>
      ))}
    </div>
  );
}
