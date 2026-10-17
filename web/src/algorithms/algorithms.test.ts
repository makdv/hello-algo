import { describe, expect, it } from '@rstest/core';
import { resolveAnchors } from '../engine/source';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';
import { LOCALE_IDS } from '../i18n/locale';
import { binarySearch, traceBinarySearch } from './binarySearch';
import { bubbleSort, traceBubbleSort } from './bubbleSort';
import { insertionSort, traceInsertionSort } from './insertionSort';
import { mergeSort, traceMergeSort } from './mergeSort';
import { quickSort, traceQuickSort } from './quickSort';
import { selectionSort, traceSelectionSort } from './selectionSort';

/* eslint-disable @typescript-eslint/no-explicit-any -- specs differ only in their frame data */
const SPECS: AlgorithmSpec<any>[] = [bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, binarySearch];

const INPUTS = [[4, 1, 3, 1, 5, 2], [5, 4, 3, 2, 1], [1, 2, 3, 4], [2, 2, 2], [7, 3, 2, 6, 0, 1, 5, 4], [9], []];

/** Deterministic pseudo-random inputs. */
function randomInputs(count: number) {
  let seed = 7;
  const next = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => Array.from({ length: 1 + Math.floor(next() * 9) }, () => Math.floor(next() * 12)));
}

const values = (f: ArrayFrame) => f.items.map((it) => it.value);
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);

describe.each([
  ['bubble', traceBubbleSort, true],
  ['selection', traceSelectionSort, false],
  ['insertion', traceInsertionSort, true],
  ['quick', traceQuickSort, false],
  ['merge', traceMergeSort, true],
] as const)('%s sort', (_name, trace, stable) => {
  it('ends sorted with every element marked done', () => {
    for (const input of [...INPUTS, ...randomInputs(40)]) {
      const last = trace(input).at(-1)!;
      expect(values(last)).toEqual(sorted(input));
      expect(last.marks.every((m) => m === 'done')).toBe(true);
    }
  });

  it('keeps every element: frames are permutations of the input', () => {
    for (const input of randomInputs(20)) {
      for (const f of trace(input)) expect(sorted(values(f))).toEqual(sorted(input));
    }
  });

  if (stable) {
    it('is stable: equal values keep their original order', () => {
      for (const input of [[2, 1, 2, 1], [3, 3, 1, 3], ...randomInputs(30)]) {
        const last = trace(input).at(-1)!;
        for (const v of new Set(input)) {
          const ids = last.items.filter((it) => it.value === v).map((it) => it.id);
          expect(ids).toEqual([...ids].sort((a, b) => a - b));
        }
      }
    });
  }
});

describe('operation counts', () => {
  it('bubble sort: n(n-1)/2 comparisons and one swap per inversion', () => {
    const last = traceBubbleSort([4, 1, 3, 1, 5, 2]).at(-1)!;
    expect(last.stats).toMatchObject({ comparisons: 15, swaps: 7 });
  });

  it('selection sort: always n(n-1)/2 comparisons', () => {
    expect(traceSelectionSort([5, 2, 4, 1, 3, 2]).at(-1)!.stats.comparisons).toBe(15);
  });

  it('insertion sort: one move per inversion', () => {
    expect(traceInsertionSort([4, 1, 3, 1, 5, 2]).at(-1)!.stats.moves).toBe(7);
  });
});

describe('binary search', () => {
  it('finds every present value at its sorted index, within log2(n) + 1 checks', () => {
    const arr = [1, 3, 6, 8, 12, 15, 23, 26, 31, 35];
    for (const [index, target] of arr.entries()) {
      const frames = traceBinarySearch(arr, target);
      const last = frames.at(-1)!;
      expect(last.kind).toBe('found');
      expect(last.data.m).toBe(index);
      expect(last.stats.checks).toBeLessThanOrEqual(last.data.maxChecks);
    }
  });

  it('reports missing values', () => {
    for (const target of [0, 2, 20, 99]) expect(traceBinarySearch([1, 3, 6, 8, 12], target).at(-1)!.kind).toBe('missing');
  });

  it('sorts its input first', () => {
    expect(values(traceBinarySearch([9, 1, 5], 5)[0])).toEqual([1, 5, 9]);
  });
});

describe.each(SPECS.map((s) => [s.id, s] as const))('%s spec', (_id, spec) => {
  it('resolves every code anchor in every locale and language', () => {
    for (const locale of LOCALE_IDS) {
      const sources = spec.sources(locale);
      expect(Object.keys(sources).sort()).toEqual(['java', 'python']);
      for (const source of Object.values(sources)) {
        expect(source!.code.length).toBeGreaterThan(20);
        expect(() => resolveAnchors(source!.code, source!.anchors)).not.toThrow();
      }
    }
  });

  it('has an anchor and a tone for every event kind', () => {
    const kinds = new Set(spec.trace(spec.defaultInput, spec.param?.default).map((f: ArrayFrame) => f.kind));
    for (const kind of kinds) {
      expect(spec.tones[kind]).toBeDefined();
      for (const source of Object.values(spec.sources('en'))) expect(source!.anchors[kind]).toBeDefined();
    }
  });

  it('narrates every step in every locale and both voices', () => {
    const inputs = spec.id === 'binary_search' ? [spec.defaultInput] : [spec.defaultInput, ...INPUTS.slice(0, 5)];
    for (const input of inputs) {
      const frames = spec.trace(input, spec.param?.default);
      for (const f of frames) {
        for (const locale of LOCALE_IDS) {
          for (const voice of ['reader', 'kid'] as const) {
            const text = spec.narrate(f, voice, locale);
            expect(text.length).toBeGreaterThan(3);
            expect(text).not.toMatch(/undefined|NaN|null/);
            const q = spec.predict?.(f, voice, locale);
            if (q) {
              expect(q.choices.map((c) => c.id)).toContain(q.answer);
              expect(q.prompt).not.toMatch(/undefined|NaN|null/);
            }
          }
        }
      }
    }
  });

  it('has School rules in every locale', () => {
    for (const locale of LOCALE_IDS) expect((spec.school.rules[locale] ?? spec.school.rules.en).length).toBe(3);
  });
});

describe('predict answers match what happens next', () => {
  const check = (spec: AlgorithmSpec<any>, frames: ArrayFrame[], expected: (f: any, next: any) => string) => {
    frames.forEach((f, k) => {
      const q = spec.predict!(f, 'reader', 'en');
      if (q) expect(q.answer).toBe(expected(f, frames[k + 1]));
    });
  };

  it('bubble: swap exactly when a swap follows', () => {
    check(bubbleSort, traceBubbleSort([3, 1, 2, 2, 0]), (_f, next) => (next.kind === 'swp' ? 'swap' : 'keep'));
  });

  it('selection: new minimum exactly when k moves', () => {
    check(selectionSort, traceSelectionSort([3, 1, 2, 0, 2]), (_f, next) => (next.kind === 'min' ? 'yes' : 'no'));
  });

  it('insertion: shift exactly when a shift follows', () => {
    check(insertionSort, traceInsertionSort([3, 1, 2, 0, 2]), (_f, next) => (next.kind === 'shift' ? 'shift' : 'place'));
  });

  it('quick: the pointer keeps moving exactly when its next comparison is one step further', () => {
    const frames = traceQuickSort([3, 1, 4, 1, 5, 9, 2, 6]);
    check(quickSort, frames, (f, next) => {
      const moved = next.kind === f.kind && (f.kind === 'cmpj' ? next.data.j === f.data.j - 1 : next.data.i === f.data.i + 1);
      const stoppedAtMeet = f.kind === 'cmpj' ? f.data.j - 1 === f.data.i : f.data.i + 1 === f.data.j;
      return moved || (f.data.moves && stoppedAtMeet) ? 'move' : 'stop';
    });
  });

  it('merge: the taken element is the one the answer names', () => {
    const frames = traceMergeSort([5, 2, 4, 2, 1, 3]);
    check(mergeSort, frames, (f) => (f.items[f.data.i].value <= f.items[f.data.j].value ? 'left' : 'right'));
  });

  it('binary search: left, right or found matches the next step', () => {
    for (const target of [1, 8, 23, 35, 4]) {
      check(binarySearch, traceBinarySearch(binarySearch.defaultInput, target), (_f, next) =>
        next.kind === 'found' ? 'found' : next.kind === 'left' ? 'left' : 'right',
      );
    }
  });
});
