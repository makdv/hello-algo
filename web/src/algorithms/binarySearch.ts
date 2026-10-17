import javaEn from '@codes-en/java/chapter_searching/binary_search.java?raw';
import pythonEn from '@codes-en/python/chapter_searching/binary_search.py?raw';
import javaJa from '@codes-ja/java/chapter_searching/binary_search.java?raw';
import pythonJa from '@codes-ja/python/chapter_searching/binary_search.py?raw';
import javaRu from '@codes-ru/java/chapter_searching/binary_search.java?raw';
import pythonRu from '@codes-ru/python/chapter_searching/binary_search.py?raw';
import javaZh from '@codes-zh/java/chapter_searching/binary_search.java?raw';
import pythonZh from '@codes-zh/python/chapter_searching/binary_search.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_searching/binary_search.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_searching/binary_search.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type SearchKind = 'init' | 'mid' | 'right' | 'left' | 'found' | 'missing';

export interface SearchData {
  i: number;
  j: number;
  m: number | null;
  target: number;
  /** For `mid`: how nums[m] relates to the target. */
  rel?: 'lt' | 'gt' | 'eq';
  /** Maximum number of checks: floor(log2 n) + 1. */
  maxChecks: number;
}

export type SearchFrame = ArrayFrame<SearchData> & { kind: SearchKind };

export const DEFAULT_TARGET = 6;

/** Records binary search on the closed interval [i, j]. The input is sorted first. */
export function traceBinarySearch(input: number[], target = DEFAULT_TARGET): SearchFrame[] {
  const items = [...input].sort((x, y) => x - y).map((value, id) => ({ id, value }));
  const n = items.length;
  const maxChecks = n ? Math.floor(Math.log2(n)) + 1 : 0;
  const frames: SearchFrame[] = [];
  let checks = 0;

  const snap = (kind: SearchKind, o: { i: number; j: number; m?: number | null; rel?: SearchData['rel'] }) => {
    const { i, j, m = null, rel } = o;
    const marks: Mark[] = items.map((_, idx) => {
      if (kind === 'found' && idx === m) return 'done';
      if (idx === m) return 'cmp';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (i <= j || kind !== 'missing') {
      if (i >= 0 && i < n) pointers.push({ label: 'i', index: i });
      if (j >= 0 && j < n) pointers.push({ label: 'j', index: j });
    }
    if (m !== null) pointers.push({ label: 'm', index: m });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['target', target],
        ['i', i],
        ['j', j],
        ['m', m],
      ],
      stats: { checks, ...(kind === 'found' && m !== null ? { found: m } : {}) },
      range: i <= j ? [i, j] : [i, i - 1],
      data: { i, j, m, target, rel, maxChecks },
    });
  };

  let i = 0;
  let j = n - 1;
  snap('init', { i, j });
  while (i <= j) {
    const m = Math.floor((i + j) / 2);
    checks++;
    const v = items[m].value;
    const rel = v < target ? 'lt' : v > target ? 'gt' : 'eq';
    snap('mid', { i, j, m, rel });
    if (rel === 'eq') {
      snap('found', { i, j, m });
      return frames;
    }
    if (rel === 'lt') {
      i = m + 1;
      snap('right', { i, j, m });
    } else {
      j = m - 1;
      snap('left', { i, j, m });
    }
  }
  snap('missing', { i, j });
  return frames;
}

interface Ctx {
  n: number;
  i: number;
  j: number;
  m: number;
  a: number;
  t: number;
  rel: SearchData['rel'];
  checks: number;
}

type Lines = Record<SearchKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: (c) => `Search for ${c.t} in the sorted array. Start with the whole interval [0, ${c.n - 1}].`,
    mid: (c) => `Middle m = ${c.m}: nums[m] = ${c.a}. ${c.rel === 'lt' ? `${c.a} < ${c.t}, so the target is in the right half.` : c.rel === 'gt' ? `${c.a} > ${c.t}, so the target is in the left half.` : 'That is the target!'}`,
    right: (c) => `i = m + 1 = ${c.i}. The interval is now [${c.i}, ${c.j}].`,
    left: (c) => `j = m - 1 = ${c.j}. The interval is now [${c.i}, ${c.j}].`,
    found: (c) => `Found ${c.t} at index ${c.m} after ${c.checks} checks.`,
    missing: (c) => `The interval is empty, so ${c.t} is not in the array: return -1 after ${c.checks} checks.`,
  },
  zh: {
    init: (c) => `在有序数组中查找 ${c.t}，初始区间为整个数组 [0, ${c.n - 1}]。`,
    mid: (c) => `中点 m = ${c.m}：nums[m] = ${c.a}。${c.rel === 'lt' ? `${c.a} < ${c.t}，目标在右半部分。` : c.rel === 'gt' ? `${c.a} > ${c.t}，目标在左半部分。` : '这就是目标！'}`,
    right: (c) => `i = m + 1 = ${c.i}，区间变为 [${c.i}, ${c.j}]。`,
    left: (c) => `j = m - 1 = ${c.j}，区间变为 [${c.i}, ${c.j}]。`,
    found: (c) => `检查 ${c.checks} 次后，在索引 ${c.m} 找到 ${c.t}。`,
    missing: (c) => `区间为空，${c.t} 不在数组中：检查 ${c.checks} 次后返回 -1。`,
  },
  'zh-hant': {
    init: (c) => `在有序陣列中搜尋 ${c.t}，初始區間為整個陣列 [0, ${c.n - 1}]。`,
    mid: (c) => `中點 m = ${c.m}：nums[m] = ${c.a}。${c.rel === 'lt' ? `${c.a} < ${c.t}，目標在右半部分。` : c.rel === 'gt' ? `${c.a} > ${c.t}，目標在左半部分。` : '這就是目標！'}`,
    right: (c) => `i = m + 1 = ${c.i}，區間變為 [${c.i}, ${c.j}]。`,
    left: (c) => `j = m - 1 = ${c.j}，區間變為 [${c.i}, ${c.j}]。`,
    found: (c) => `檢查 ${c.checks} 次後，在索引 ${c.m} 找到 ${c.t}。`,
    missing: (c) => `區間為空，${c.t} 不在陣列中：檢查 ${c.checks} 次後回傳 -1。`,
  },
  ja: {
    init: (c) => `整列済み配列から ${c.t} を探します。最初の区間は配列全体 [0, ${c.n - 1}]。`,
    mid: (c) => `中央 m = ${c.m}：nums[m] = ${c.a}。${c.rel === 'lt' ? `${c.a} < ${c.t} なので、目標は右半分。` : c.rel === 'gt' ? `${c.a} > ${c.t} なので、目標は左半分。` : 'これが目標です！'}`,
    right: (c) => `i = m + 1 = ${c.i}。区間は [${c.i}, ${c.j}] に。`,
    left: (c) => `j = m - 1 = ${c.j}。区間は [${c.i}, ${c.j}] に。`,
    found: (c) => `${c.checks} 回の確認で、インデックス ${c.m} に ${c.t} が見つかりました。`,
    missing: (c) => `区間が空なので ${c.t} は配列にありません。${c.checks} 回の確認のあと -1 を返します。`,
  },
  ru: {
    init: (c) => `Ищем ${c.t} в отсортированном массиве. Начинаем со всего интервала [0, ${c.n - 1}].`,
    mid: (c) => `Середина m = ${c.m}: nums[m] = ${c.a}. ${c.rel === 'lt' ? `${c.a} < ${c.t}, значит цель в правой половине.` : c.rel === 'gt' ? `${c.a} > ${c.t}, значит цель в левой половине.` : 'Это и есть цель!'}`,
    right: (c) => `i = m + 1 = ${c.i}. Теперь интервал [${c.i}, ${c.j}].`,
    left: (c) => `j = m - 1 = ${c.j}. Теперь интервал [${c.i}, ${c.j}].`,
    found: (c) => `Нашли ${c.t} на позиции ${c.m}; проверок: ${c.checks}.`,
    missing: (c) => `Интервал пуст: ${c.t} нет в массиве. Возвращаем -1; проверок: ${c.checks}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: (c) => `Find bubble ${c.t}! Every peek lets us skip half of the bubbles.`,
    mid: (c) => (c.rel === 'eq' ? `Peek at the middle: ${c.a}. That is it!` : `Peek at the middle bubble: ${c.a}.`),
    right: (c) => `${c.t} is bigger, so only look to the right!`,
    left: (c) => `${c.t} is smaller, so only look to the left!`,
    found: (c) => `There it is: bubble ${c.t}! Only ${c.checks} peeks.`,
    missing: (c) => `${c.t} is not here. Good searching anyway!`,
  },
  zh: {
    init: (c) => `找到泡泡 ${c.t}！每看一次，就能跳过一半的泡泡。`,
    mid: (c) => (c.rel === 'eq' ? `看看中间：${c.a}。就是它！` : `看看中间的泡泡：${c.a}。`),
    right: (c) => `${c.t} 更大，只看右边！`,
    left: (c) => `${c.t} 更小，只看左边！`,
    found: (c) => `找到了：泡泡 ${c.t}！只看了 ${c.checks} 次。`,
    missing: (c) => `${c.t} 不在这里。不过找得很棒！`,
  },
  'zh-hant': {
    init: (c) => `找到泡泡 ${c.t}！每看一次，就能跳過一半的泡泡。`,
    mid: (c) => (c.rel === 'eq' ? `看看中間：${c.a}。就是它！` : `看看中間的泡泡：${c.a}。`),
    right: (c) => `${c.t} 更大，只看右邊！`,
    left: (c) => `${c.t} 更小，只看左邊！`,
    found: (c) => `找到了：泡泡 ${c.t}！只看了 ${c.checks} 次。`,
    missing: (c) => `${c.t} 不在這裡。不過找得很棒！`,
  },
  ja: {
    init: (c) => `バブル ${c.t} を見つけよう！のぞくたびに、半分のバブルをとばせるよ。`,
    mid: (c) => (c.rel === 'eq' ? `まん中をのぞくと ${c.a}。見つけた！` : `まん中のバブルをのぞこう：${c.a}。`),
    right: (c) => `${c.t} の方が大きいから、右だけ見よう！`,
    left: (c) => `${c.t} の方が小さいから、左だけ見よう！`,
    found: (c) => `いた！バブル ${c.t}！のぞいたのは ${c.checks} 回だけ。`,
    missing: (c) => `${c.t} はここにいないみたい。でも上手にさがせたね！`,
  },
  ru: {
    init: (c) => `Найди пузырь ${c.t}! Каждый взгляд отбрасывает половину пузырей.`,
    mid: (c) => (c.rel === 'eq' ? `Смотрим в середину: ${c.a}. Это он!` : `Смотрим на средний пузырь: ${c.a}.`),
    right: (c) => `${c.t} больше — смотрим только направо!`,
    left: (c) => `${c.t} меньше — смотрим только налево!`,
    found: (c) => `Вот он, пузырь ${c.t}! Понадобилось всего ${c.checks} взгл.`,
    missing: (c) => `${c.t} здесь нет. Но искали отлично!`,
  },
};

const QUESTION: Record<Locale, { reader: (c: Ctx) => string; kid: (c: Ctx) => string; left: [string, string]; right: [string, string]; found: [string, string] }> = {
  en: {
    reader: (c) => `nums[${c.m}] = ${c.a}, target = ${c.t}. Where is the target?`,
    kid: (c) => `Is ${c.t} smaller, bigger, or the same as ${c.a}?`,
    left: ['Left half', 'Smaller!'],
    right: ['Right half', 'Bigger!'],
    found: ['Found it', 'Same!'],
  },
  zh: {
    reader: (c) => `nums[${c.m}] = ${c.a}，target = ${c.t}。目标在哪里？`,
    kid: (c) => `${c.t} 比 ${c.a} 小、大，还是一样？`,
    left: ['左半部分', '更小！'],
    right: ['右半部分', '更大！'],
    found: ['找到了', '一样！'],
  },
  'zh-hant': {
    reader: (c) => `nums[${c.m}] = ${c.a}，target = ${c.t}。目標在哪裡？`,
    kid: (c) => `${c.t} 比 ${c.a} 小、大，還是一樣？`,
    left: ['左半部分', '更小！'],
    right: ['右半部分', '更大！'],
    found: ['找到了', '一樣！'],
  },
  ja: {
    reader: (c) => `nums[${c.m}] = ${c.a}、target = ${c.t}。目標はどこ？`,
    kid: (c) => `${c.t} は ${c.a} より小さい？大きい？同じ？`,
    left: ['左半分', '小さい！'],
    right: ['右半分', '大きい！'],
    found: ['見つけた', '同じ！'],
  },
  ru: {
    reader: (c) => `nums[${c.m}] = ${c.a}, target = ${c.t}. Где цель?`,
    kid: (c) => `${c.t} меньше, больше или равен ${c.a}?`,
    left: ['Левая половина', 'Меньше!'],
    right: ['Правая половина', 'Больше!'],
    found: ['Нашли', 'Равен!'],
  },
};

function ctx(f: SearchFrame): Ctx {
  const { i, j, m, target, rel } = f.data;
  const n = f.items.length;
  return {
    n,
    i,
    j,
    m: m ?? 0,
    a: m === null ? 0 : f.items[m].value,
    t: target,
    rel,
    checks: f.stats.checks,
  };
}

function narrate(f: SearchFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: SearchFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'mid') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  return {
    prompt: kid ? q.kid(c) : q.reader(c),
    choices: [
      { id: 'left', label: q.left[kid ? 1 : 0], tone: 'cmp' },
      { id: 'found', label: q.found[kid ? 1 : 0], tone: 'done' },
      { id: 'right', label: q.right[kid ? 1 : 0], tone: 'swp' },
    ],
    answer: c.rel === 'eq' ? 'found' : c.rel === 'gt' ? 'left' : 'right',
    explain: narrate(f, voice, locale),
  };
}

export const binarySearch: AlgorithmSpec<SearchFrame> = {
  id: 'binary_search',
  title: { en: 'Binary search', zh: '二分查找', 'zh-hant': '二分搜尋', ja: '二分探索', ru: 'Двоичный поиск' },
  call: 'binary_search',
  defaultInput: [1, 3, 6, 8, 12, 15, 23, 26, 31, 35],
  initialStep: 1,
  param: { name: 'target', label: { en: 'target', zh: 'target', 'zh-hant': 'target', ja: 'target', ru: 'target' }, default: DEFAULT_TARGET },
  trace: traceBinarySearch,
  tones: { init: 'idle', mid: 'cmp', right: 'idle', left: 'idle', found: 'done', missing: 'swp' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [{ func: 'binary_search' }],
      anchors: {
        init: ['i, j = 0, len(nums) - 1'],
        mid: ['m = (i + j) // 2'],
        right: ['i = m + 1'],
        left: ['j = m - 1'],
        found: ['return m'],
        missing: ['return -1'],
      },
    },
    java: {
      label: 'Java',
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [{ func: 'binary_search' }],
      anchors: {
        init: ['int i = 0, j = nums.length - 1'],
        mid: ['int m = i + (j - i) / 2'],
        right: ['i = m + 1;'],
        left: ['j = m - 1;'],
        found: ['return m;'],
        missing: ['return -1;'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Peek at the middle bubble.', 'Bigger? Look right. Smaller? Look left.', 'Each peek skips half the bubbles.'],
      zh: ['看看中间的泡泡。', '更大就看右边，更小就看左边。', '每看一次就跳过一半。'],
      'zh-hant': ['看看中間的泡泡。', '更大就看右邊，更小就看左邊。', '每看一次就跳過一半。'],
      ja: ['まん中のバブルをのぞく。', '大きければ右、小さければ左。', 'のぞくたびに半分とばせる。'],
      ru: ['Посмотри на средний пузырь.', 'Больше — смотри направо, меньше — налево.', 'Каждый взгляд отбрасывает половину.'],
    },
    peek: `i, j = 0, len(nums) - 1
while i <= j:
    m = (i + j) // 2
    if nums[m] < target: i = m + 1
    elif nums[m] > target: j = m - 1
    else: return m
return -1`,
    rounds: (f) => ({ current: Math.max(Math.min(f.stats.checks, f.data.maxChecks), 1), total: Math.max(f.data.maxChecks, 1) }),
  },
};
