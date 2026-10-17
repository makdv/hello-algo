import javaSource from '@codes/java/chapter_sorting/bubble_sort.java?raw';
import pythonSource from '@codes/python/chapter_sorting/bubble_sort.py?raw';
import { extractBracedFunction, extractPythonFunction } from '../engine/source';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';

export type BubbleKind = 'init' | 'pass' | 'cmp' | 'swp' | 'fixed' | 'end';

export interface BubbleData {
  i: number | null;
  j: number | null;
  /** For `cmp`: whether the left element is larger, so a swap follows. */
  gt?: boolean;
  pass?: number;
  passes: number;
}

export type BubbleFrame = ArrayFrame<BubbleData> & { kind: BubbleKind };

export function traceBubbleSort(input: number[]): BubbleFrame[] {
  const items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const passes = Math.max(n - 1, 0);
  const frames: BubbleFrame[] = [];
  let comparisons = 0;
  let swaps = 0;

  const snap = (
    kind: BubbleKind,
    opts: { sortedFrom: number; i?: number | null; j?: number | null; cmp?: number[]; swp?: number[]; gt?: boolean },
  ) => {
    const { sortedFrom, i = null, j = null, cmp = [], swp = [], gt } = opts;
    const marks: Mark[] = items.map((_, idx) => {
      if (idx >= sortedFrom) return 'done';
      if (swp.includes(idx)) return 'swp';
      if (cmp.includes(idx)) return 'cmp';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (j !== null) pointers.push({ label: 'j', index: j }, { label: 'j+1', index: j + 1 });
    if (i !== null) pointers.push({ label: 'i', index: i });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['n', n],
        ['i', i],
        ['j', j],
        ['nums[j]', j === null ? null : items[j].value],
      ],
      stats: { comparisons, swaps, sorted: n - Math.min(sortedFrom, n) },
      data: { i, j, gt, pass: i === null ? undefined : n - i, passes },
    });
  };

  snap('init', { sortedFrom: n });
  for (let i = n - 1; i > 0; i--) {
    snap('pass', { sortedFrom: i + 1, i });
    for (let j = 0; j < i; j++) {
      comparisons++;
      const gt = items[j].value > items[j + 1].value;
      snap('cmp', { sortedFrom: i + 1, i, j, cmp: [j, j + 1], gt });
      if (gt) {
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swaps++;
        snap('swp', { sortedFrom: i + 1, i, j, swp: [j, j + 1] });
      }
    }
    snap('fixed', { sortedFrom: i, i });
  }
  snap('end', { sortedFrom: 0 });
  return frames;
}

function narrate(f: BubbleFrame, voice: Voice): string {
  const { i, j, gt } = f.data;
  const v = (idx: number) => f.items[idx].value;
  const n = f.items.length;
  if (voice === 'kid') {
    switch (f.kind) {
      case 'init':
        return "Meet the bubbles! Let's line them up from smallest to biggest.";
      case 'pass':
        return `Round ${n - i!}! We walk from left to right.`;
      case 'cmp':
        return gt
          ? `${v(j!)} is bigger than ${v(j! + 1)}, so they will swap!`
          : `${v(j!)} is not bigger than ${v(j! + 1)}, so they stay.`;
      case 'swp':
        return `Whoosh! ${v(j! + 1)} hops to the right.`;
      case 'fixed':
        return `Bubble ${v(i!)} made it home! It gets a crown.`;
      case 'end':
        return 'Everyone is in order, smallest to biggest. Great job!';
    }
  }
  switch (f.kind) {
    case 'init':
      return `n = ${n}. Each pass carries the largest unsorted value to the right end.`;
    case 'pass':
      return `Pass ${n - i!}: the unsorted range is [0, ${i}].`;
    case 'cmp':
      return `Compare nums[${j}] = ${v(j!)} with nums[${j! + 1}] = ${v(j! + 1)}. ${
        gt ? 'The left one is larger, so they swap.' : 'Already in order, move on.'
      }`;
    case 'swp':
      return `Swapped. ${v(j! + 1)} moves one step to the right.`;
    case 'fixed':
      return `${v(i!)} has reached its final position.`;
    case 'end':
      return `Done. nums = [${f.items.map((it) => it.value).join(', ')}] with ${f.stats.comparisons} comparisons and ${f.stats.swaps} swaps.`;
  }
}

function predict(f: BubbleFrame, voice: Voice): Question | null {
  if (f.kind !== 'cmp') return null;
  const { j, gt } = f.data;
  const a = f.items[j!].value;
  const b = f.items[j! + 1].value;
  if (voice === 'kid') {
    return {
      prompt: `Bubble ${a} and bubble ${b} are looking at each other. Should they swap?`,
      choices: [
        { id: 'swap', label: 'Swap!', tone: 'swp' },
        { id: 'keep', label: 'Stay!', tone: 'cmp' },
      ],
      answer: gt ? 'swap' : 'keep',
      explain: narrate(f, 'kid'),
    };
  }
  return {
    prompt: `Will nums[${j}] = ${a} and nums[${j! + 1}] = ${b} swap?`,
    choices: [
      { id: 'swap', label: 'Swap', tone: 'swp' },
      { id: 'keep', label: 'Keep', tone: 'idle' },
    ],
    answer: gt ? 'swap' : 'keep',
    explain: gt ? `${a} > ${b}, so they swap.` : `${a} ≤ ${b}, so they stay. Equal values never swap, which keeps the sort stable.`,
  };
}

export const bubbleSort: AlgorithmSpec<BubbleFrame> = {
  id: 'bubble_sort',
  title: 'bubble_sort',
  defaultInput: [4, 1, 3, 1, 5, 2],
  trace: traceBubbleSort,
  sources: {
    python: {
      label: 'Python',
      code: extractPythonFunction(pythonSource, 'bubble_sort'),
      anchors: {
        init: ['n = len(nums)'],
        pass: ['for i in range(n - 1, 0, -1)'],
        cmp: ['if nums[j] > nums[j + 1]'],
        swp: ['nums[j], nums[j + 1] = nums[j + 1], nums[j]'],
        fixed: ['for i in range(n - 1, 0, -1)'],
        end: ['def bubble_sort('],
      },
    },
    java: {
      label: 'Java',
      code: extractBracedFunction(javaSource, 'void bubbleSort(int[] nums)'),
      anchors: {
        init: ['void bubbleSort(int[] nums)'],
        pass: ['for (int i = nums.length - 1'],
        cmp: ['if (nums[j] > nums[j + 1])'],
        swp: ['int tmp = nums[j]', 'nums[j] = nums[j + 1]', 'nums[j + 1] = tmp'],
        fixed: ['for (int i = nums.length - 1'],
        end: ['void bubbleSort(int[] nums)'],
      },
    },
  },
  narrate,
  predict,
};
