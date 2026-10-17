import { describe, expect, it } from '@rstest/core';
import { resolveAnchors } from '../engine/source';
import { bubbleSort, traceBubbleSort } from './bubbleSort';

describe('traceBubbleSort', () => {
  it('ends sorted with every element marked done', () => {
    const frames = traceBubbleSort([4, 1, 3, 1, 5, 2]);
    const last = frames[frames.length - 1];
    expect(last.kind).toBe('end');
    expect(last.items.map((it) => it.value)).toEqual([1, 1, 2, 3, 4, 5]);
    expect(last.marks.every((m) => m === 'done')).toBe(true);
  });

  it('counts n(n-1)/2 comparisons and one swap per inversion', () => {
    const last = traceBubbleSort([4, 1, 3, 1, 5, 2]).at(-1)!;
    expect(last.stats.comparisons).toBe(15);
    expect(last.stats.swaps).toBe(7);
  });

  it('is stable: equal values keep their original order', () => {
    const last = traceBubbleSort([2, 1, 2, 1]).at(-1)!;
    const ones = last.items.filter((it) => it.value === 1).map((it) => it.id);
    const twos = last.items.filter((it) => it.value === 2).map((it) => it.id);
    expect(ones).toEqual([1, 3]);
    expect(twos).toEqual([0, 2]);
  });

  it('follows every cmp with a swp exactly when the left value is larger', () => {
    const frames = traceBubbleSort([3, 2, 1, 2]);
    frames.forEach((f, k) => {
      if (f.kind !== 'cmp') return;
      expect(frames[k + 1].kind === 'swp').toBe(Boolean(f.data.gt));
    });
  });

  it('handles trivial inputs', () => {
    expect(traceBubbleSort([]).map((f) => f.kind)).toEqual(['init', 'end']);
    expect(traceBubbleSort([7]).map((f) => f.kind)).toEqual(['init', 'end']);
  });
});

describe('bubbleSort sources', () => {
  it('resolves every code anchor in every language', () => {
    for (const spec of Object.values(bubbleSort.sources)) {
      expect(() => resolveAnchors(spec!.code, spec!.anchors)).not.toThrow();
    }
  });

  it('extracts only the bubble_sort function', () => {
    const py = bubbleSort.sources.python!.code;
    expect(py.startsWith('def bubble_sort(')).toBe(true);
    expect(py).not.toContain('bubble_sort_with_flag');
  });
});

describe('bubbleSort predict', () => {
  it('asks only on comparisons, with the right answer', () => {
    const frames = traceBubbleSort([4, 1]);
    const cmp = frames.find((f) => f.kind === 'cmp')!;
    expect(bubbleSort.predict!(cmp, 'reader')!.answer).toBe('swap');
    expect(bubbleSort.predict!(frames[0], 'reader')).toBeNull();
  });
});
