import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Question, Voice } from './types';
import type { Player } from './usePlayer';

export interface Predict {
  question: Question | null;
  /** True while a question is waiting for an answer and stepping is paused. */
  asking: boolean;
  result: 'right' | 'wrong' | 'skipped' | null;
  right: number;
  total: number;
  answer(choiceId: string): void;
  skip(): void;
}

/** Predict mode: before a step with a question, the reader guesses what happens next. */
export function usePredict<F extends ArrayFrame>(
  spec: AlgorithmSpec<F>,
  player: Player<F>,
  enabled: boolean,
  voice: Voice,
  locale: Locale,
): Predict {
  const [result, setResult] = useState<Predict['result']>(null);
  const [right, setRight] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => setResult(null), [player.cur, player.frames, enabled]);

  const question = enabled ? (spec.predict?.(player.frame, voice, locale) ?? null) : null;

  return {
    question,
    asking: Boolean(question) && result === null,
    result,
    right,
    total,
    answer: (choiceId) => {
      if (!question) return;
      const ok = choiceId === question.answer;
      setResult(ok ? 'right' : 'wrong');
      setTotal((t) => t + 1);
      if (ok) setRight((r) => r + 1);
    },
    skip: () => setResult('skipped'),
  };
}
