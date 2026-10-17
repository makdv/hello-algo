import type { SnippetLang } from './snippets';

/** Visual state of one element in an array-shaped visualization. */
export type Mark = 'idle' | 'cmp' | 'swp' | 'done';

export type LangId = SnippetLang;

/**
 * One recorded step of an algorithm over an array.
 * Items keep a stable `id` so renderers can animate elements moving between indices.
 */
export interface ArrayFrame<D = object> {
  /** Event kind, e.g. `cmp` or `swp`. Used for code anchors, timeline colors and narration. */
  kind: string;
  items: { id: number; value: number }[];
  marks: Mark[];
  pointers: { label: string; index: number }[];
  vars: [name: string, value: string | number | null][];
  stats: Record<string, number>;
  data: D;
}

export interface Choice {
  id: string;
  label: string;
  tone: Mark;
}

export interface Question {
  prompt: string;
  choices: Choice[];
  answer: string;
  /** Shown after the reader answers, right or wrong. */
  explain: string;
}

export type Voice = 'reader' | 'kid';

export interface SourceSpec {
  label: string;
  /** The extracted function, already dedented. */
  code: string;
  /** Event kind → substrings of the lines to highlight for that event. */
  anchors: Record<string, string[]>;
}

export interface AlgorithmSpec<F extends ArrayFrame = ArrayFrame> {
  id: string;
  title: string;
  defaultInput: number[];
  trace(input: number[]): F[];
  sources: Partial<Record<LangId, SourceSpec>>;
  narrate(frame: F, voice: Voice): string;
  /** Returns a question when the reader can guess what this step leads to. */
  predict?(frame: F, voice: Voice): Question | null;
}
