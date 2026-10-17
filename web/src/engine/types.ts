import type { Locale, Localized } from '../i18n/locale';
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
  /** Indices [lo, hi] the algorithm is working on; elements outside are dimmed. */
  range?: [number, number];
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
  /** The extracted code (one or more functions), already dedented. */
  code: string;
  /** Event kind → substrings of the lines to highlight for that event. */
  anchors: Record<string, string[]>;
}

/** An extra numeric input, such as the target of a search. */
export interface ParamSpec {
  name: string;
  label: Localized<string>;
  default: number;
}

export interface AlgorithmSpec<F extends ArrayFrame = ArrayFrame> {
  id: string;
  /** Human title, e.g. "Bubble sort" / "冒泡排序". */
  title: Localized<string>;
  /** Function name shown in the player header, e.g. `bubble_sort`. */
  call: string;
  defaultInput: number[];
  /** Step shown first, so the figure opens on an interesting moment. */
  initialStep?: number;
  param?: ParamSpec;
  trace(input: number[], param?: number): F[];
  /** Code shown next to the player, in the page's language (comments are translated). */
  sources(locale: Locale): Partial<Record<LangId, SourceSpec>>;
  /** Timeline and badge color for each event kind. */
  tones: Record<string, Mark>;
  narrate(frame: F, voice: Voice, locale: Locale): string;
  /** Returns a question when the reader can guess what this step leads to. */
  predict?(frame: F, voice: Voice, locale: Locale): Question | null;
  /** The School view's level: rules in kid language and the code to peek at. */
  school: {
    rules: Localized<string[]>;
    peek: string;
    /** How many "rounds" the progress bar shows, from a frame. */
    rounds(frame: F): { current: number; total: number };
  };
}
