'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import { QuestionType } from '@/types';
import { useTest } from '@/hooks/useTest';

function TestSession() {
  const params = useSearchParams();
  const router = useRouter();
  const type = (params.get('type') ?? 'meaning-to-word') as QuestionType;
  const count = parseInt(params.get('count') ?? '10', 10);
  const gradeParam = params.get('grade');
  const grade = gradeParam ? parseInt(gradeParam, 10) : null;

  const { questions, currentQuestion, index, answers, phase, score, incorrectWords, answer, next } = useTest(type, count, grade);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentAnswer = answers[index];
  const hasAnswered = currentAnswer !== null;

  const handleChoice = (choice: string) => {
    if (hasAnswered) return;
    answer(choice);
  };

  const handleFillSubmit = () => {
    if (hasAnswered || !inputValue.trim()) return;
    answer(inputValue.trim());
    setSubmitted(true);
  };

  const handleNext = () => {
    setInputValue('');
    setSubmitted(false);
    next();
  };

  if (phase === 'result') {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <>
        <TopBar title="テスト結果" />
        <PageWrapper>
          <div className="text-center py-8">
            <p className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '😊' : '😢'}</p>
            <p className="text-4xl font-bold text-blue-900 mb-1">{score} <span className="text-2xl text-gray-400">/ {total}</span></p>
            <p className="text-2xl font-bold text-blue-600 mb-6">{pct}点</p>
          </div>

          {incorrectWords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">間違えた単語（復習しよう）</h3>
              <div className="space-y-2">
                {incorrectWords.map((word, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => { window.location.reload(); }}
              className="w-full py-4 rounded-xl border-2 border-blue-500 text-blue-600 font-bold text-base hover:bg-blue-50 transition-colors min-h-[56px]"
            >
              もう一度
            </button>
            <button
              onClick={() => router.push('/mypage')}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors min-h-[56px]"
            >
              マイページへ
            </button>
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!currentQuestion) return null;

  const progressPct = Math.round((index / questions.length) * 100);

  return (
    <>
      <TopBar title={`問題 ${index + 1} / ${questions.length}`} showBack />
      <PageWrapper>
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-6">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm min-h-[100px] flex items-center">
          <p className="text-base font-medium text-gray-800 leading-relaxed w-full">
            {currentQuestion.type === 'fill-blank'
              ? currentQuestion.blankedSentence
              : currentQuestion.prompt}
          </p>
        </div>

        {/* Multiple choice */}
        {(currentQuestion.type === 'meaning-to-word' || currentQuestion.type === 'word-to-meaning') && currentQuestion.choices && (
          <div className="space-y-3">
            {currentQuestion.choices.map((choice) => {
              let state: 'idle' | 'correct' | 'incorrect' = 'idle';
              if (hasAnswered) {
                if (choice === currentQuestion.answer) state = 'correct';
                else if (choice === currentAnswer) state = 'incorrect';
              }
              return (
                <button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  disabled={hasAnswered}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all min-h-[56px] ${
                    state === 'correct'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : state === 'incorrect'
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : hasAnswered
                      ? 'border-gray-200 bg-gray-50 text-gray-400'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 active:bg-blue-50'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the blank */}
        {currentQuestion.type === 'fill-blank' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleFillSubmit(); }}
                disabled={submitted}
                placeholder="答えを入力…"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:bg-gray-50 min-h-[48px]"
              />
              <button
                onClick={handleFillSubmit}
                disabled={submitted || !inputValue.trim()}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-40 transition-colors min-h-[48px]"
              >
                答える
              </button>
            </div>
            {submitted && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                currentAnswer === currentQuestion.answer
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {currentAnswer === currentQuestion.answer
                  ? '正解！'
                  : `不正解。正解は「${currentQuestion.answer}」`}
              </div>
            )}
          </div>
        )}

        {/* Next button */}
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full mt-5 py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors min-h-[56px]"
          >
            {index < questions.length - 1 ? '次の問題 →' : '結果を見る'}
          </button>
        )}
      </PageWrapper>
    </>
  );
}

export default function TestSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">読み込み中…</div>}>
      <TestSession />
    </Suspense>
  );
}
