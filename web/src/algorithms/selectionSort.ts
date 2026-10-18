import javaEn from '@codes-en/java/chapter_sorting/selection_sort.java?raw';
import pythonEn from '@codes-en/python/chapter_sorting/selection_sort.py?raw';
import javaJa from '@codes-ja/java/chapter_sorting/selection_sort.java?raw';
import pythonJa from '@codes-ja/python/chapter_sorting/selection_sort.py?raw';
import javaRu from '@codes-ru/java/chapter_sorting/selection_sort.java?raw';
import pythonRu from '@codes-ru/python/chapter_sorting/selection_sort.py?raw';
import javaZh from '@codes-zh/java/chapter_sorting/selection_sort.java?raw';
import pythonZh from '@codes-zh/python/chapter_sorting/selection_sort.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_sorting/selection_sort.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_sorting/selection_sort.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type SelectionKind = 'init' | 'pass' | 'cmp' | 'min' | 'swp' | 'fixed' | 'end';

export interface SelectionData {
  i: number | null;
  j: number | null;
  k: number | null;
  /** For `cmp`: nums[j] < nums[k], so k moves to j. */
  lt?: boolean;
}

export type SelectionFrame = ArrayFrame<SelectionData> & { kind: SelectionKind };

export function traceSelectionSort(input: number[]): SelectionFrame[] {
  const items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const frames: SelectionFrame[] = [];
  let comparisons = 0;
  let swaps = 0;

  const snap = (
    kind: SelectionKind,
    o: { sorted: number; i?: number | null; j?: number | null; k?: number | null; cmp?: number[]; swp?: number[]; lt?: boolean },
  ) => {
    const { sorted, i = null, j = null, k = null, cmp = [], swp = [], lt } = o;
    const marks: Mark[] = items.map((_, idx) => {
      if (idx < sorted) return 'done';
      if (swp.includes(idx)) return 'swp';
      if (cmp.includes(idx)) return 'cmp';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (i !== null) pointers.push({ label: 'i', index: i });
    if (j !== null) pointers.push({ label: 'j', index: j });
    if (k !== null) pointers.push({ label: 'k', index: k });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['i', i],
        ['j', j],
        ['k', k],
      ],
      stats: { comparisons, swaps, sorted: Math.min(sorted, n) },
      data: { i, j, k, lt },
    });
  };

  snap('init', { sorted: 0 });
  for (let i = 0; i < n - 1; i++) {
    let k = i;
    snap('pass', { sorted: i, i, k, cmp: [k] });
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const lt = items[j].value < items[k].value;
      snap('cmp', { sorted: i, i, j, k, cmp: [j, k], lt });
      if (lt) {
        k = j;
        snap('min', { sorted: i, i, j, k, cmp: [k] });
      }
    }
    if (k !== i) swaps++;
    [items[i], items[k]] = [items[k], items[i]];
    snap('swp', { sorted: i, i, k, swp: [i, k] });
    snap('fixed', { sorted: i + 1, i });
  }
  snap('end', { sorted: n });
  return frames;
}

interface Ctx {
  n: number;
  round: number;
  i: number;
  j: number;
  k: number;
  a: number;
  b: number;
  v: number;
  lt: boolean;
  same: boolean;
  list: string;
  comparisons: number;
  swaps: number;
}

type Lines = Record<SelectionKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: (c) => `n = ${c.n}. Each round finds the smallest unsorted value and moves it to the front of the unsorted range.`,
    pass: (c) => `Round ${c.round}: the unsorted range is [${c.i}, ${c.n - 1}]. Start with k = ${c.i} as the smallest so far.`,
    cmp: (c) => `Is nums[${c.j}] = ${c.a} smaller than nums[${c.k}] = ${c.b}? ${c.lt ? 'Yes.' : 'No, k stays.'}`,
    min: (c) => `New minimum: k = ${c.k} (value ${c.b}).`,
    swp: (c) => (c.same ? `The minimum is already at index ${c.i}; nothing moves.` : `Swap nums[${c.i}] and nums[${c.k}]: ${c.v} moves to index ${c.i}.`),
    fixed: (c) => `${c.v} is now in its final position.`,
    end: (c) => `Done. nums = [${c.list}] with ${c.comparisons} comparisons and ${c.swaps} swaps.`,
  },
  zh: {
    init: (c) => `n = ${c.n}。每一轮找出未排序区间中最小的数，放到该区间的最前面。`,
    pass: (c) => `第 ${c.round} 轮：未排序区间为 [${c.i}, ${c.n - 1}]，先令 k = ${c.i} 为当前最小。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} 比 nums[${c.k}] = ${c.b} 小吗？${c.lt ? '是的。' : '不是，k 不变。'}`,
    min: (c) => `新的最小值：k = ${c.k}（值为 ${c.b}）。`,
    swp: (c) => (c.same ? `最小值已经在索引 ${c.i}，无需移动。` : `交换 nums[${c.i}] 与 nums[${c.k}]：${c.v} 移到索引 ${c.i}。`),
    fixed: (c) => `${c.v} 已到达最终位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比较 ${c.comparisons} 次，交换 ${c.swaps} 次。`,
  },
  'zh-hant': {
    init: (c) => `n = ${c.n}。每一輪找出未排序區間中最小的數，放到該區間的最前面。`,
    pass: (c) => `第 ${c.round} 輪：未排序區間為 [${c.i}, ${c.n - 1}]，先令 k = ${c.i} 為目前最小。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} 比 nums[${c.k}] = ${c.b} 小嗎？${c.lt ? '是的。' : '不是，k 不變。'}`,
    min: (c) => `新的最小值：k = ${c.k}（值為 ${c.b}）。`,
    swp: (c) => (c.same ? `最小值已經在索引 ${c.i}，無需移動。` : `交換 nums[${c.i}] 與 nums[${c.k}]：${c.v} 移到索引 ${c.i}。`),
    fixed: (c) => `${c.v} 已到達最終位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比較 ${c.comparisons} 次，交換 ${c.swaps} 次。`,
  },
  ja: {
    init: (c) => `n = ${c.n}。各ラウンドで未整列区間の最小値を見つけ、その区間の先頭へ移します。`,
    pass: (c) => `第 ${c.round} ラウンド：未整列区間は [${c.i}, ${c.n - 1}]。まず k = ${c.i} を暫定の最小とします。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} は nums[${c.k}] = ${c.b} より小さい？${c.lt ? 'はい。' : 'いいえ、k はそのまま。'}`,
    min: (c) => `最小値を更新：k = ${c.k}（値 ${c.b}）。`,
    swp: (c) => (c.same ? `最小値はすでにインデックス ${c.i} にあるので移動なし。` : `nums[${c.i}] と nums[${c.k}] を交換：${c.v} がインデックス ${c.i} へ。`),
    fixed: (c) => `${c.v} が最終位置に確定しました。`,
    end: (c) => `完了。nums = [${c.list}]、比較 ${c.comparisons} 回、交換 ${c.swaps} 回。`,
  },
  ru: {
    init: (c) => `n = ${c.n}. Каждый раунд находит наименьшее неотсортированное значение и ставит его в начало неотсортированной части.`,
    pass: (c) => `Раунд ${c.round}: неотсортированный диапазон [${c.i}, ${c.n - 1}]. Пока минимум — k = ${c.i}.`,
    cmp: (c) => `nums[${c.j}] = ${c.a} меньше, чем nums[${c.k}] = ${c.b}? ${c.lt ? 'Да.' : 'Нет, k не меняется.'}`,
    min: (c) => `Новый минимум: k = ${c.k} (значение ${c.b}).`,
    swp: (c) => (c.same ? `Минимум уже на позиции ${c.i}, ничего не двигаем.` : `Меняем nums[${c.i}] и nums[${c.k}]: ${c.v} встаёт на позицию ${c.i}.`),
    fixed: (c) => `Элемент ${c.v} занял окончательное место.`,
    end: (c) => `Готово. nums = [${c.list}]; сравнений: ${c.comparisons}, обменов: ${c.swaps}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: () => "Let's find the smallest bubble again and again!",
    pass: (c) => `Round ${c.round}! Bubble ${c.b} is the smallest so far.`,
    cmp: (c) => (c.lt ? `${c.a} is smaller than ${c.b}! It becomes the new smallest.` : `${c.a} is not smaller than ${c.b}.`),
    min: (c) => `Now ${c.b} is the smallest we have seen.`,
    swp: (c) => (c.same ? `${c.v} is already at the front!` : `Whoosh! ${c.v} goes to the front.`),
    fixed: (c) => `Bubble ${c.v} made it home! It gets a crown.`,
    end: () => 'Everyone is in order, smallest to biggest. Great job!',
  },
  zh: {
    init: () => '一次又一次地找出最小的泡泡吧！',
    pass: (c) => `第 ${c.round} 轮！目前最小的是泡泡 ${c.b}。`,
    cmp: (c) => (c.lt ? `${c.a} 比 ${c.b} 小！它成了新的最小泡泡。` : `${c.a} 不比 ${c.b} 小。`),
    min: (c) => `现在见过最小的是 ${c.b}。`,
    swp: (c) => (c.same ? `${c.v} 已经在最前面了！` : `嗖！${c.v} 跑到了最前面。`),
    fixed: (c) => `泡泡 ${c.v} 到家了！给它戴上皇冠。`,
    end: () => '大家都从小到大排好了。太棒了！',
  },
  'zh-hant': {
    init: () => '一次又一次地找出最小的泡泡吧！',
    pass: (c) => `第 ${c.round} 輪！目前最小的是泡泡 ${c.b}。`,
    cmp: (c) => (c.lt ? `${c.a} 比 ${c.b} 小！它成了新的最小泡泡。` : `${c.a} 不比 ${c.b} 小。`),
    min: (c) => `現在見過最小的是 ${c.b}。`,
    swp: (c) => (c.same ? `${c.v} 已經在最前面了！` : `咻！${c.v} 跑到了最前面。`),
    fixed: (c) => `泡泡 ${c.v} 到家了！給它戴上皇冠。`,
    end: () => '大家都從小到大排好了。太棒了！',
  },
  ja: {
    init: () => 'いちばん小さいバブルを、何度もさがそう！',
    pass: (c) => `ラウンド ${c.round}！今いちばん小さいのはバブル ${c.b}。`,
    cmp: (c) => (c.lt ? `${c.a} は ${c.b} より小さい！新しいいちばん小さいバブルだ。` : `${c.a} は ${c.b} より小さくない。`),
    min: (c) => `今まででいちばん小さいのは ${c.b}。`,
    swp: (c) => (c.same ? `${c.v} はもう先頭にいるよ！` : `ビュン！${c.v} が先頭へ。`),
    fixed: (c) => `バブル ${c.v} がおうちに着いたよ！王冠をあげよう。`,
    end: () => 'みんな小さい順にならんだよ。すごい！',
  },
  ru: {
    init: () => 'Снова и снова ищем самый маленький пузырь!',
    pass: (c) => `Раунд ${c.round}! Пока самый маленький — пузырь ${c.b}.`,
    cmp: (c) => (c.lt ? `${c.a} меньше, чем ${c.b}! Теперь он самый маленький.` : `${c.a} не меньше, чем ${c.b}.`),
    min: (c) => `Самый маленький из увиденных — ${c.b}.`,
    swp: (c) => (c.same ? `${c.v} уже впереди!` : `Вжух! ${c.v} отправляется вперёд.`),
    fixed: (c) => `Пузырь ${c.v} дома! Ему корона.`,
    end: () => 'Все стоят по порядку, от маленького к большому. Отлично!',
  },
};

const QUESTION: Record<Locale, { reader: (c: Ctx) => string; kid: (c: Ctx) => string; yes: [string, string]; no: [string, string]; why: (c: Ctx) => string }> = {
  en: {
    reader: (c) => `Is nums[${c.j}] = ${c.a} a new minimum (smaller than nums[${c.k}] = ${c.b})?`,
    kid: (c) => `Is bubble ${c.a} smaller than bubble ${c.b}?`,
    yes: ['New minimum', 'Yes!'],
    no: ['Keep k', 'No!'],
    why: (c) => (c.lt ? `${c.a} < ${c.b}, so k moves to ${c.j}.` : `${c.a} ≥ ${c.b}, so k stays at ${c.k}.`),
  },
  zh: {
    reader: (c) => `nums[${c.j}] = ${c.a} 是新的最小值吗（比 nums[${c.k}] = ${c.b} 小）？`,
    kid: (c) => `泡泡 ${c.a} 比泡泡 ${c.b} 小吗？`,
    yes: ['新最小值', '是！'],
    no: ['k 不变', '不是！'],
    why: (c) => (c.lt ? `${c.a} < ${c.b}，所以 k 移到 ${c.j}。` : `${c.a} ≥ ${c.b}，所以 k 仍为 ${c.k}。`),
  },
  'zh-hant': {
    reader: (c) => `nums[${c.j}] = ${c.a} 是新的最小值嗎（比 nums[${c.k}] = ${c.b} 小）？`,
    kid: (c) => `泡泡 ${c.a} 比泡泡 ${c.b} 小嗎？`,
    yes: ['新最小值', '是！'],
    no: ['k 不變', '不是！'],
    why: (c) => (c.lt ? `${c.a} < ${c.b}，所以 k 移到 ${c.j}。` : `${c.a} ≥ ${c.b}，所以 k 仍為 ${c.k}。`),
  },
  ja: {
    reader: (c) => `nums[${c.j}] = ${c.a} は新しい最小値（nums[${c.k}] = ${c.b} より小さい）？`,
    kid: (c) => `バブル ${c.a} はバブル ${c.b} より小さい？`,
    yes: ['最小値を更新', 'はい！'],
    no: ['k はそのまま', 'いいえ！'],
    why: (c) => (c.lt ? `${c.a} < ${c.b} なので k は ${c.j} へ。` : `${c.a} ≥ ${c.b} なので k は ${c.k} のまま。`),
  },
  ru: {
    reader: (c) => `nums[${c.j}] = ${c.a} — новый минимум (меньше, чем nums[${c.k}] = ${c.b})?`,
    kid: (c) => `Пузырь ${c.a} меньше, чем пузырь ${c.b}?`,
    yes: ['Новый минимум', 'Да!'],
    no: ['k не меняется', 'Нет!'],
    why: (c) => (c.lt ? `${c.a} < ${c.b}, поэтому k переходит на ${c.j}.` : `${c.a} ≥ ${c.b}, поэтому k остаётся ${c.k}.`),
  },
};

function ctx(f: SelectionFrame): Ctx {
  const { i, j, k, lt } = f.data;
  const n = f.items.length;
  const value = (idx: number | null) => (idx === null || idx < 0 || idx >= n ? 0 : f.items[idx].value);
  return {
    n,
    round: (i ?? 0) + 1,
    i: i ?? 0,
    j: j ?? 0,
    k: k ?? 0,
    a: value(j),
    b: value(k),
    v: value(i),
    lt: Boolean(lt),
    same: i !== null && k !== null && i === k,
    list: f.items.map((it) => it.value).join(', '),
    comparisons: f.stats.comparisons,
    swaps: f.stats.swaps,
  };
}

function narrate(f: SelectionFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: SelectionFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'cmp') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  return {
    prompt: kid ? q.kid(c) : q.reader(c),
    choices: [
      { id: 'yes', label: q.yes[kid ? 1 : 0], tone: 'cmp' },
      { id: 'no', label: q.no[kid ? 1 : 0], tone: 'idle' },
    ],
    answer: c.lt ? 'yes' : 'no',
    explain: kid ? narrate(f, 'kid', locale) : q.why(c),
  };
}

export const selectionSort: AlgorithmSpec<SelectionFrame> = {
  id: 'selection_sort',
  title: { en: 'Selection sort', zh: '选择排序', 'zh-hant': '選擇排序', ja: '選択ソート', ru: 'Сортировка выбором' },
  call: 'selection_sort',
  defaultInput: [5, 2, 4, 1, 3, 2],
  initialStep: 4,
  trace: traceSelectionSort,
  tones: { init: 'idle', pass: 'idle', cmp: 'cmp', min: 'cmp', swp: 'swp', fixed: 'done', end: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [{ func: 'selection_sort' }],
      anchors: {
        init: ['n = len(nums)'],
        pass: ['k = i'],
        cmp: ['if nums[j] < nums[k]'],
        min: ['k = j'],
        swp: ['nums[i], nums[k] = nums[k], nums[i]'],
        fixed: ['for i in range(n - 1)'],
        end: ['def selection_sort('],
      },
    },
    java: {
      label: 'Java',
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [{ func: 'selection_sort' }],
      anchors: {
        init: ['int n = nums.length'],
        pass: ['int k = i'],
        cmp: ['if (nums[j] < nums[k])'],
        min: ['k = j'],
        swp: ['int temp = nums[i]', 'nums[i] = nums[k]', 'nums[k] = temp'],
        fixed: ['for (int i = 0; i < n - 1; i++)'],
        end: ['void selectionSort(int[] nums)'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Find the smallest bubble.', 'Swap it to the front.', 'Do it again with the rest.'],
      zh: ['找到最小的泡泡。', '把它换到最前面。', '对剩下的再来一次。'],
      'zh-hant': ['找到最小的泡泡。', '把它換到最前面。', '對剩下的再來一次。'],
      ja: ['いちばん小さいバブルを見つける。', 'それを先頭と入れかえる。', '残りでもう一度。'],
      ru: ['Найди самый маленький пузырь.', 'Поставь его вперёд.', 'Повтори с остальными.'],
    },
    peek: `for i in range(n - 1):
    k = i
    for j in range(i + 1, n):
        if nums[j] < nums[k]:
            k = j
    swap(i, k)`,
    rounds: (f) => {
      const total = Math.max(f.items.length - 1, 1);
      const current = f.kind === 'end' ? total : Math.min((f.data.i ?? 0) + 1, total);
      return { current, total };
    },
  },
};
