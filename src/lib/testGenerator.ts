import { KanjiEntry, Question, QuestionType, VocabEntry } from '@/types';

// Replace the target word in a furigana HTML string with ＿＿＿
function blankWordInFuriganaHtml(html: string | undefined, word: string): string | undefined {
  if (!html) return undefined;
  const tokens: Array<{ text: string; html: string }> = [];
  const rubyRe = /<ruby>([^<]+)<rp>\(<\/rp><rt>[^<]+<\/rt><rp>\)<\/rp><\/ruby>/g;
  let last = 0;
  let m;
  while ((m = rubyRe.exec(html)) !== null) {
    if (m.index > last) {
      for (const ch of html.slice(last, m.index)) tokens.push({ text: ch, html: ch });
    }
    tokens.push({ text: m[1], html: m[0] });
    last = rubyRe.lastIndex;
  }
  if (last < html.length) {
    for (const ch of html.slice(last)) tokens.push({ text: ch, html: ch });
  }
  const fullText = tokens.map((t) => t.text).join('');
  const wordIdx = fullText.indexOf(word);
  if (wordIdx === -1) return html;
  let charCount = 0, startTok = -1, endTok = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (charCount === wordIdx && startTok === -1) startTok = i;
    charCount += tokens[i].text.length;
    if (charCount === wordIdx + word.length) { endTok = i; break; }
  }
  if (startTok === -1 || endTok === -1) return html;
  return tokens.slice(0, startTok).map((t) => t.html).join('') + '＿＿＿' + tokens.slice(endTok + 1).map((t) => t.html).join('');
}

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
  const wordReadingMap = new Map(allVocab.map((v) => [v.word, v.reading]));
  const meaningFuriganaMap = new Map(allVocab.map((v) => [v.meaning, v.meaningFurigana ?? v.meaning]));

  const shuffled = shuffle(allVocab).slice(0, count);

  return shuffled.map((vocab) => {
    if (type === 'meaning-to-word') {
      const distractors = pickDistractors(vocab.word, allWords, 3);
      const choices = shuffle([vocab.word, ...distractors]);
      const choicesWithReadings = choices.map((text) => ({
        text,
        reading: wordReadingMap.get(text) ?? '',
      }));
      return {
        type,
        prompt: vocab.meaning,
        promptFurigana: vocab.meaningFurigana,
        answer: vocab.word,
        choices,
        choicesWithReadings,
        sourceWord: vocab.word,
        sourceReading: vocab.reading,
      };
    }

    if (type === 'word-to-meaning') {
      const distractors = pickDistractors(vocab.meaning, allMeanings, 3);
      const choices = shuffle([vocab.meaning, ...distractors]);
      return {
        type,
        prompt: `「${vocab.word}」の意味は？`,
        answer: vocab.meaning,
        choices,
        choicesMeaningFurigana: choices.map((m) => meaningFuriganaMap.get(m) ?? m),
        sourceWord: vocab.word,
        sourceReading: vocab.reading,
        promptWord: vocab.word,
        promptReading: vocab.reading,
      };
    }

    // fill-blank
    const blankedSentence = vocab.example.replace(vocab.word, '＿＿＿');
    return {
      type,
      prompt: blankedSentence,
      answer: vocab.word,
      blankedSentence,
      blankedSentenceFurigana: blankWordInFuriganaHtml(vocab.exampleFurigana, vocab.word),
      sourceWord: vocab.word,
      sourceReading: vocab.reading,
    };
  });
}
