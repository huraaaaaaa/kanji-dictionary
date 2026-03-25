'use client';

import TopBar from '@/components/layout/TopBar';
import PageWrapper from '@/components/layout/PageWrapper';
import { useProgress } from '@/hooks/useProgress';
import dictionaryData from '@/data/dictionary.json';
import { KanjiEntry } from '@/types';
import { resetProgress } from '@/lib/storage';

const allVocab = (dictionaryData as KanjiEntry[]).flatMap((e) => e.vocabulary);

const TYPE_LABEL: Record<string, string> = {
  'meaning-to-word': '意味→単語',
  'word-to-meaning': '単語→意味',
  'fill-blank': '穴埋め',
};

export default function MyPage() {
  const {
    learnedWords, favoriteWords, difficultWords, testHistory,
    accuracy, toggleFavorite, removeDifficultWord,
  } = useProgress();

  const handleReset = () => {
    if (confirm('学習記録をすべてリセットしますか？')) {
      resetProgress();
      window.location.reload();
    }
  };

  return (
    <>
      <TopBar title="マイページ" />
      <PageWrapper>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{learnedWords.length}</p>
            <p className="text-xs text-gray-500 mt-1">学習済み</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{testHistory.length}</p>
            <p className="text-xs text-gray-500 mt-1">テスト回数</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{accuracy}<span className="text-base">%</span></p>
            <p className="text-xs text-gray-500 mt-1">正答率</p>
          </div>
        </div>

        {/* Favorites */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>⭐ お気に入り</span>
            <span className="text-xs text-gray-400">({favoriteWords.length}件)</span>
          </h2>
          {favoriteWords.length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-4">
              まだありません。単語カードの★をタップして追加しよう！
            </p>
          ) : (
            <div className="space-y-2">
              {favoriteWords.map((word) => {
                const vocab = allVocab.find((v) => v.word === word);
                if (!vocab) return null;
                return (
                  <div key={word} className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900">{vocab.word}</span>
                      <span className="ml-2 text-xs text-gray-500">【{vocab.reading}】</span>
                      <p className="text-xs text-gray-600 mt-1">{vocab.meaning}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(word)}
                      aria-label="お気に入りから外す"
                      className="p-2 min-w-[36px] min-h-[36px] rounded-lg hover:bg-gray-100 flex items-center justify-center text-amber-400 flex-shrink-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Difficult words */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📌 苦手単語</span>
            <span className="text-xs text-gray-400">({difficultWords.length}件)</span>
          </h2>
          {difficultWords.length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-4">
              まだありません。テストで間違えた単語がここに追加されます。
            </p>
          ) : (
            <div className="space-y-2">
              {difficultWords.map((word) => {
                const vocab = allVocab.find((v) => v.word === word);
                if (!vocab) return null;
                return (
                  <div key={word} className="bg-red-50 rounded-xl border border-red-100 p-3 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900">{vocab.word}</span>
                      <span className="ml-2 text-xs text-gray-500">【{vocab.reading}】</span>
                      <p className="text-xs text-gray-600 mt-1">{vocab.meaning}</p>
                    </div>
                    <button
                      onClick={() => removeDifficultWord(word)}
                      aria-label="苦手リストから外す"
                      className="p-2 min-w-[36px] min-h-[36px] rounded-lg hover:bg-red-100 flex items-center justify-center text-red-400 flex-shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Test history */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📊 テスト履歴</span>
          </h2>
          {testHistory.length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-4">
              まだテストを受けていません。
            </p>
          ) : (
            <div className="space-y-2">
              {testHistory.slice(0, 10).map((result) => (
                <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-blue-600">{TYPE_LABEL[result.type]}</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(result.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-800">{result.score}<span className="text-sm text-gray-400">/{result.total}</span></span>
                    <p className="text-xs text-gray-500">{Math.round((result.score / result.total) * 100)}点</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors min-h-[44px]"
        >
          学習記録をリセット
        </button>
      </PageWrapper>
    </>
  );
}
