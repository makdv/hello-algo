import javaEn from '@codes-en/java/chapter_sorting/bubble_sort.java?raw';
import pythonEn from '@codes-en/python/chapter_sorting/bubble_sort.py?raw';
import javaJa from '@codes-ja/java/chapter_sorting/bubble_sort.java?raw';
import pythonJa from '@codes-ja/python/chapter_sorting/bubble_sort.py?raw';
import javaRu from '@codes-ru/java/chapter_sorting/bubble_sort.java?raw';
import pythonRu from '@codes-ru/python/chapter_sorting/bubble_sort.py?raw';
import javaZh from '@codes-zh/java/chapter_sorting/bubble_sort.java?raw';
import pythonZh from '@codes-zh/python/chapter_sorting/bubble_sort.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_sorting/bubble_sort.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_sorting/bubble_sort.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type BubbleKind = 'init' | 'pass' | 'cmp' | 'swp' | 'fixed' | 'end';

export interface BubbleData {
  i: number | null;
  j: number | null;
  /** For `cmp`: whether the left element is larger, so a swap follows. */
  gt?: boolean;
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
      ],
      stats: { comparisons, swaps, sorted: n - Math.min(sortedFrom, n) },
      data: { i, j, gt, passes },
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

interface Ctx {
  n: number;
  pass: number;
  i: number;
  j: number;
  a: number;
  b: number;
  gt: boolean;
  list: string;
  comparisons: number;
  swaps: number;
}

type Lines = Record<BubbleKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: (c) => `n = ${c.n}. Each pass carries the largest unsorted value to the right end.`,
    pass: (c) => `Pass ${c.pass}: the unsorted range is [0, ${c.i}].`,
    cmp: (c) => `Compare nums[${c.j}] = ${c.a} with nums[${c.j + 1}] = ${c.b}. ${c.gt ? 'The left one is larger, so they swap.' : 'Already in order, move on.'}`,
    swp: (c) => `Swapped. ${c.b} moves one step to the right.`,
    fixed: (c) => `${c.a} has reached its final position.`,
    end: (c) => `Done. nums = [${c.list}] with ${c.comparisons} comparisons and ${c.swaps} swaps.`,
  },
  zh: {
    init: (c) => `n = ${c.n}。每一轮把未排序部分中最大的数移到右端。`,
    pass: (c) => `第 ${c.pass} 轮：未排序区间为 [0, ${c.i}]。`,
    cmp: (c) => `比较 nums[${c.j}] = ${c.a} 与 nums[${c.j + 1}] = ${c.b}。${c.gt ? '左边更大，交换二者。' : '顺序正确，继续向右。'}`,
    swp: (c) => `已交换，${c.b} 向右移动一位。`,
    fixed: (c) => `${c.a} 已到达最终位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比较 ${c.comparisons} 次，交换 ${c.swaps} 次。`,
  },
  'zh-hant': {
    init: (c) => `n = ${c.n}。每一輪把未排序部分中最大的數移到右端。`,
    pass: (c) => `第 ${c.pass} 輪：未排序區間為 [0, ${c.i}]。`,
    cmp: (c) => `比較 nums[${c.j}] = ${c.a} 與 nums[${c.j + 1}] = ${c.b}。${c.gt ? '左邊更大，交換二者。' : '順序正確，繼續向右。'}`,
    swp: (c) => `已交換，${c.b} 向右移動一位。`,
    fixed: (c) => `${c.a} 已到達最終位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比較 ${c.comparisons} 次，交換 ${c.swaps} 次。`,
  },
  ja: {
    init: (c) => `n = ${c.n}。各ラウンドで未整列部分の最大値を右端へ運びます。`,
    pass: (c) => `第 ${c.pass} ラウンド：未整列の区間は [0, ${c.i}]。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} と nums[${c.j + 1}] = ${c.b} を比較。${c.gt ? '左の方が大きいので交換します。' : 'すでに正しい順序なので次へ。'}`,
    swp: (c) => `交換しました。${c.b} が 1 つ右へ移動。`,
    fixed: (c) => `${c.a} が最終位置に確定しました。`,
    end: (c) => `完了。nums = [${c.list}]、比較 ${c.comparisons} 回、交換 ${c.swaps} 回。`,
  },
  ru: {
    init: (c) => `n = ${c.n}. Каждый проход переносит наибольшее неотсортированное значение в правый конец.`,
    pass: (c) => `Проход ${c.pass}: неотсортированный диапазон [0, ${c.i}].`,
    cmp: (c) => `Сравниваем nums[${c.j}] = ${c.a} и nums[${c.j + 1}] = ${c.b}. ${c.gt ? 'Левый больше — меняем их местами.' : 'Порядок верный, идём дальше.'}`,
    swp: (c) => `Обмен. ${c.b} сдвигается на одну позицию вправо.`,
    fixed: (c) => `Элемент ${c.a} занял окончательное место.`,
    end: (c) => `Готово. nums = [${c.list}]; сравнений: ${c.comparisons}, обменов: ${c.swaps}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: () => "Meet the bubbles! Let's line them up from smallest to biggest.",
    pass: (c) => `Round ${c.pass}! We walk from left to right.`,
    cmp: (c) => (c.gt ? `${c.a} is bigger than ${c.b}, so they will swap!` : `${c.a} is not bigger than ${c.b}, so they stay.`),
    swp: (c) => `Whoosh! ${c.b} hops to the right.`,
    fixed: (c) => `Bubble ${c.a} made it home! It gets a crown.`,
    end: () => 'Everyone is in order, smallest to biggest. Great job!',
  },
  zh: {
    init: () => '来认识泡泡们！我们把它们从小到大排好队。',
    pass: (c) => `第 ${c.pass} 轮！从左往右走。`,
    cmp: (c) => (c.gt ? `${c.a} 比 ${c.b} 大，它们要交换！` : `${c.a} 不比 ${c.b} 大，它们不动。`),
    swp: (c) => `嗖！${c.b} 跳到了右边。`,
    fixed: (c) => `泡泡 ${c.a} 到家了！给它戴上皇冠。`,
    end: () => '大家都从小到大排好了。太棒了！',
  },
  'zh-hant': {
    init: () => '來認識泡泡們！我們把它們從小到大排好隊。',
    pass: (c) => `第 ${c.pass} 輪！從左往右走。`,
    cmp: (c) => (c.gt ? `${c.a} 比 ${c.b} 大，它們要交換！` : `${c.a} 不比 ${c.b} 大，它們不動。`),
    swp: (c) => `咻！${c.b} 跳到了右邊。`,
    fixed: (c) => `泡泡 ${c.a} 到家了！給它戴上皇冠。`,
    end: () => '大家都從小到大排好了。太棒了！',
  },
  ja: {
    init: () => 'バブルたちを紹介するよ！小さい順にならべよう。',
    pass: (c) => `ラウンド ${c.pass}！左から右へ進もう。`,
    cmp: (c) => (c.gt ? `${c.a} は ${c.b} より大きいから、入れかえるよ！` : `${c.a} は ${c.b} より大きくないから、そのまま。`),
    swp: (c) => `ビュン！${c.b} が右へジャンプ。`,
    fixed: (c) => `バブル ${c.a} がおうちに着いたよ！王冠をあげよう。`,
    end: () => 'みんな小さい順にならんだよ。すごい！',
  },
  ru: {
    init: () => 'Знакомься с пузырями! Выстроим их от маленького к большому.',
    pass: (c) => `Раунд ${c.pass}! Идём слева направо.`,
    cmp: (c) => (c.gt ? `${c.a} больше, чем ${c.b}, — они меняются местами!` : `${c.a} не больше, чем ${c.b}, — они остаются.`),
    swp: (c) => `Вжух! ${c.b} прыгает вправо.`,
    fixed: (c) => `Пузырь ${c.a} дома! Ему корона.`,
    end: () => 'Все стоят по порядку, от маленького к большому. Отлично!',
  },
};

const QUESTION: Record<Locale, { reader: (c: Ctx) => string; kid: (c: Ctx) => string; swap: [string, string]; keep: [string, string]; why: (c: Ctx) => string }> = {
  en: {
    reader: (c) => `Will nums[${c.j}] = ${c.a} and nums[${c.j + 1}] = ${c.b} swap?`,
    kid: (c) => `Bubble ${c.a} and bubble ${c.b} are looking at each other. Should they swap?`,
    swap: ['Swap', 'Swap!'],
    keep: ['Keep', 'Stay!'],
    why: (c) => (c.gt ? `${c.a} > ${c.b}, so they swap.` : `${c.a} ≤ ${c.b}, so they stay. Equal values never swap, which keeps the sort stable.`),
  },
  zh: {
    reader: (c) => `nums[${c.j}] = ${c.a} 和 nums[${c.j + 1}] = ${c.b} 会交换吗？`,
    kid: (c) => `泡泡 ${c.a} 和泡泡 ${c.b} 互相看着对方。它们要交换吗？`,
    swap: ['交换', '交换！'],
    keep: ['不动', '不动！'],
    why: (c) => (c.gt ? `${c.a} > ${c.b}，所以交换。` : `${c.a} ≤ ${c.b}，所以不动。相等的元素不会交换，这保证了排序的稳定性。`),
  },
  'zh-hant': {
    reader: (c) => `nums[${c.j}] = ${c.a} 和 nums[${c.j + 1}] = ${c.b} 會交換嗎？`,
    kid: (c) => `泡泡 ${c.a} 和泡泡 ${c.b} 互相看著對方。它們要交換嗎？`,
    swap: ['交換', '交換！'],
    keep: ['不動', '不動！'],
    why: (c) => (c.gt ? `${c.a} > ${c.b}，所以交換。` : `${c.a} ≤ ${c.b}，所以不動。相等的元素不會交換，這保證了排序的穩定性。`),
  },
  ja: {
    reader: (c) => `nums[${c.j}] = ${c.a} と nums[${c.j + 1}] = ${c.b} は交換される？`,
    kid: (c) => `バブル ${c.a} とバブル ${c.b} が見つめ合っているよ。入れかえる？`,
    swap: ['交換', '入れかえ！'],
    keep: ['そのまま', 'そのまま！'],
    why: (c) => (c.gt ? `${c.a} > ${c.b} なので交換。` : `${c.a} ≤ ${c.b} なのでそのまま。等しい値は交換しないので、安定ソートになります。`),
  },
  ru: {
    reader: (c) => `Поменяются ли nums[${c.j}] = ${c.a} и nums[${c.j + 1}] = ${c.b}?`,
    kid: (c) => `Пузыри ${c.a} и ${c.b} смотрят друг на друга. Поменять их?`,
    swap: ['Обменять', 'Поменять!'],
    keep: ['Оставить', 'Оставить!'],
    why: (c) => (c.gt ? `${c.a} > ${c.b}, поэтому обмен.` : `${c.a} ≤ ${c.b}, поэтому остаются. Равные значения не меняются местами — сортировка устойчива.`),
  },
};

function ctx(f: BubbleFrame): Ctx {
  const { i, j, gt } = f.data;
  const n = f.items.length;
  const value = (idx: number | null) => (idx === null || idx < 0 || idx >= n ? 0 : f.items[idx].value);
  // For `fixed`, the settled value is at i; for `swp`, the larger value now sits at j + 1.
  return {
    n,
    pass: i === null ? 0 : n - i,
    i: i ?? 0,
    j: j ?? 0,
    a: f.kind === 'fixed' ? value(i) : value(j),
    b: value(j === null ? null : j + 1),
    gt: Boolean(gt),
    list: f.items.map((it) => it.value).join(', '),
    comparisons: f.stats.comparisons,
    swaps: f.stats.swaps,
  };
}

function narrate(f: BubbleFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: BubbleFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'cmp') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  return {
    prompt: kid ? q.kid(c) : q.reader(c),
    choices: [
      { id: 'swap', label: q.swap[kid ? 1 : 0], tone: 'swp' },
      { id: 'keep', label: q.keep[kid ? 1 : 0], tone: kid ? 'cmp' : 'idle' },
    ],
    answer: c.gt ? 'swap' : 'keep',
    explain: kid ? narrate(f, 'kid', locale) : q.why(c),
  };
}

export const bubbleSort: AlgorithmSpec<BubbleFrame> = {
  id: 'bubble_sort',
  title: { en: 'Bubble sort', zh: '冒泡排序', 'zh-hant': '泡沫排序', ja: 'バブルソート', ru: 'Сортировка пузырьком' },
  call: 'bubble_sort',
  defaultInput: [4, 1, 3, 1, 5, 2],
  initialStep: 6,
  trace: traceBubbleSort,
  tones: { init: 'idle', pass: 'idle', cmp: 'cmp', swp: 'swp', fixed: 'done', end: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [{ func: 'bubble_sort' }],
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
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [{ func: 'bubble_sort' }],
      anchors: {
        init: ['void bubbleSort(int[] nums)'],
        pass: ['for (int i = nums.length - 1'],
        cmp: ['if (nums[j] > nums[j + 1])'],
        swp: ['int tmp = nums[j]', 'nums[j] = nums[j + 1]', 'nums[j + 1] = tmp'],
        fixed: ['for (int i = nums.length - 1'],
        end: ['void bubbleSort(int[] nums)'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Look at two neighbours.', 'If the left one is bigger, swap!', 'The biggest floats to the end.'],
      zh: ['看相邻的两个。', '左边的更大，就交换！', '最大的浮到最后。'],
      'zh-hant': ['看相鄰的兩個。', '左邊的更大，就交換！', '最大的浮到最後。'],
      ja: ['となりどうしを見る。', '左の方が大きければ入れかえ！', 'いちばん大きいのが最後へ。'],
      ru: ['Смотри на двух соседей.', 'Если левый больше — поменяй!', 'Самый большой уплывает в конец.'],
    },
    peek: `for i in range(n - 1, 0, -1):
    for j in range(i):
        if nums[j] > nums[j + 1]:
            swap(j, j + 1)`,
    rounds: (f) => {
      const n = f.items.length;
      const total = Math.max(n - 1, 1);
      const current = f.kind === 'end' ? total : f.data.i === null ? 1 : n - f.data.i;
      return { current, total };
    },
  },
};
