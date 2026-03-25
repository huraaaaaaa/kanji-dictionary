'use client';

import { useCallback, useMemo, useState } from 'react';
import dictionaryData from '@/data/dictionary.json';
import { KanjiEntry, Question, QuestionType, TestResult } from '@/types';
import { generateQuestions } from '@/lib/testGenerator';
import { useProgress } from './useProgress';

type Phase = 'answering' | 'result';

export function useTest(type: QuestionType, count: number, grade: number | null = null) {
  const allEntries = dictionaryData as KanjiEntry[];
  const entries = grade === null ? allEntries : allEntries.filter((e) => e.grade === grade);
  const questions = useMemo(
    () => generateQuestions(entries, type, Math.min(count, entries.flatMap((e) => e.vocabulary).length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    () => Array(questions.length).fill(null)
  );
  const [phase, setPhase] = useState<Phase>('answering');
  const { addDifficultWord, saveTestResult } = useProgress();

  const currentQuestion: Question | null = questions[index] ?? null;

  const answer = useCallback(
    (choice: string) => {
      if (answers[index] !== null) return;
      const q = questions[index];
      const isCorrect = choice === q.answer;
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = choice;
        return next;
      });
      if (!isCorrect) {
        addDifficultWord(q.sourceWord);
      }
    },
    [index, answers, questions, addDifficultWord]
  );

  const next = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      const score = answers.filter((a, i) => a === questions[i].answer).length;
      const incorrectWords = questions
        .filter((q, i) => answers[i] !== q.answer)
        .map((q) => q.sourceWord);
      const result: TestResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type,
        score,
        total: questions.length,
        incorrectWords,
      };
      saveTestResult(result);
      setPhase('result');
    }
  }, [index, answers, questions, type, saveTestResult]);

  const score = answers.filter((a, i) => a !== null && a === questions[i].answer).length;
  const incorrectWords = questions
    .filter((q, i) => answers[i] !== null && answers[i] !== q.answer)
    .map((q) => q.sourceWord);

  return {
    questions,
    currentQuestion,
    index,
    answers,
    phase,
    score,
    incorrectWords,
    answer,
    next,
  };
}
