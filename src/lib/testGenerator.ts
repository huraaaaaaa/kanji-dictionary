import { KanjiEntry, Question, QuestionType, VocabEntry } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  correct: string,
  pool: string[],
  count: number
): string[] {
  const others = pool.filter((v) => v !== correct);
  return shuffle(others).slice(0, count);
}

export function generateQuestions(
  entries: KanjiEntry[],
  type: QuestionType,
  count: number
): Question[] {
  const allVocab: VocabEntry[] = entries.flatMap((e) => e.vocabulary);
  const allWords = allVocab.map((v) => v.word);
  const allMeanings = allVocab.map((v) => v.meaning);

  const shuffled = shuffle(allVocab).slice(0, count);

  return shuffled.map((vocab) => {
    if (type === 'meaning-to-word') {
      const distractors = pickDistractors(vocab.word, allWords, 3);
      const choices = shuffle([vocab.word, ...distractors]);
      return {
        type,
        prompt: vocab.meaning,
        answer: vocab.word,
        choices,
        sourceWord: vocab.word,
      };
    }

    if (type === 'word-to-meaning') {
      const distractors = pickDistractors(vocab.meaning, allMeanings, 3);
      const choices = shuffle([vocab.meaning, ...distractors]);
      return {
        type,
        prompt: `「${vocab.word}」（${vocab.reading}）の意味は？`,
        answer: vocab.meaning,
        choices,
        sourceWord: vocab.word,
      };
    }

    // fill-blank
    const blankedSentence = vocab.example.replace(vocab.word, '＿＿＿');
    return {
      type,
      prompt: blankedSentence,
      answer: vocab.word,
      blankedSentence,
      sourceWord: vocab.word,
    };
  });
}
