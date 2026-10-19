import heapSortJavaEn from '@codes-en/java/chapter_sorting/heap_sort.java?raw';
import heapSortPyEn from '@codes-en/python/chapter_sorting/heap_sort.py?raw';
import heapSortJavaJa from '@codes-ja/java/chapter_sorting/heap_sort.java?raw';
import heapSortPyJa from '@codes-ja/python/chapter_sorting/heap_sort.py?raw';
import heapSortJavaRu from '@codes-ru/java/chapter_sorting/heap_sort.java?raw';
import heapSortPyRu from '@codes-ru/python/chapter_sorting/heap_sort.py?raw';
import heapSortJavaZh from '@codes-zh/java/chapter_sorting/heap_sort.java?raw';
import heapSortPyZh from '@codes-zh/python/chapter_sorting/heap_sort.py?raw';
import heapSortJavaZhHant from '@codes-zh-hant/java/chapter_sorting/heap_sort.java?raw';
import heapSortPyZhHant from '@codes-zh-hant/python/chapter_sorting/heap_sort.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, cellX, cells, chip, indices, link, region, rowWidth, text } from '../kit';
import type { Figure, SceneFrame, SceneNode, StaticFigure, StepFigure, TableFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

/**
 * Chapter 11, sorting: the comparison sorts drawn as wholes (sorting examples, selection sort's
 * instability, bubble / insertion / quick / merge sort overviews), heap sort step by step, and
 * the summary table that compares every sort in the chapter.
 */

const W = 440;

/** One array element. `id` follows the element as it moves, so swaps and shifts glide. */
interface Item {
  id: string;
  v: number | string;
}

interface Look {
  tone?: Tone;
  ring?: boolean;
  dim?: boolean;
}

const items = (values: (number | string)[]): Item[] => values.map((v, i) => ({ id: String(i), v }));

/** A row of cells id'd by element, so the same element keeps its node between frames. */
const row = (prefix: string, arr: Item[], x: number, y: number, look: (k: number, it: Item) => Look | undefined, o: { w?: number; h?: number; gap?: number; size?: number } = {}) =>
  cells(
    prefix,
    x,
    y,
    arr.map((it, k) => ({ id: `${prefix}${it.id}`, value: it.v, tone: 'idle' as Tone, ...(look(k, it) ?? {}) })),
    o,
  );

const WORD: Record<'unsorted' | 'sorted' | 'left' | 'right' | 'pivot' | 'divide' | 'merge' | 'heap' | 'heapRange' | 'sortedShort' | 'swap' | 'compare' | 'children' | 'base', T> = {
  unsorted: { en: 'unsorted interval', zh: '未排序区间', 'zh-hant': '未排序區間', ja: '未ソート区間', ru: 'неотсортированный диапазон' },
  sorted: { en: 'sorted interval', zh: '已排序区间', 'zh-hant': '已排序區間', ja: '整列済み区間', ru: 'отсортированный диапазон' },
  left: { en: 'left sub-array', zh: '左子数组', 'zh-hant': '左子陣列', ja: '左部分配列', ru: 'левый подмассив' },
  right: { en: 'right sub-array', zh: '右子数组', 'zh-hant': '右子陣列', ja: '右部分配列', ru: 'правый подмассив' },
  pivot: { en: 'pivot', zh: '基准数', 'zh-hant': '基準數', ja: '基準数', ru: 'опорный' },
  divide: { en: 'Divide phase', zh: '划分阶段', 'zh-hant': '劃分階段', ja: '分割段階', ru: 'Этап разделения' },
  merge: { en: 'Merge phase', zh: '合并阶段', 'zh-hant': '合併階段', ja: 'マージ段階', ru: 'Этап слияния' },
  heap: { en: 'heap', zh: '堆', 'zh-hant': '堆積', ja: 'ヒープ', ru: 'куча' },
  heapRange: { en: 'heap', zh: '堆的有效区间', 'zh-hant': '堆積的有效區間', ja: 'ヒープの有効区間', ru: 'куча' },
  sortedShort: { en: 'sorted', zh: '已排序区间', 'zh-hant': '已排序區間', ja: '整列済み区間', ru: 'отсортировано' },
  swap: { en: 'swap', zh: '交换元素', 'zh-hant': '交換元素', ja: '交換する要素', ru: 'обмен' },
  compare: { en: 'heapify', zh: '堆化节点', 'zh-hant': '堆積化節點', ja: 'ヒープ化するノード', ru: 'просеивание' },
  children: { en: 'children', zh: '子节点', 'zh-hant': '子節點', ja: '子ノード', ru: 'дочерние узлы' },
  base: { en: 'base', zh: 'base', 'zh-hant': 'base', ja: 'base', ru: 'base' },
};

/** Label under a range of cells, starting at its left edge, with a brace above it. */
function rangeBrace(id: string, x0: number, from: number, to: number, y: number, label: string, o: { w: number; gap: number; tone?: Tone }): SceneNode[] {
  const a = cellX(x0, from, o.w, o.gap);
  const b = cellX(x0, to, o.w, o.gap) + o.w;
  return [brace(id, a, b, y, 'down', o.tone ?? 'muted'), text(`${id}:l`, x0, y + 32, label, { size: 12, tone: o.tone ?? 'muted' })];
}

// ── Sorting examples ──────────────────────────────────────────────────

const EXAMPLE_TITLE: Record<'num' | 'str' | 'rule', T> = {
  num: { en: 'Integers, by numeric value', zh: '按照数字大小排序整数', 'zh-hant': '按照數字大小排序整數', ja: '整数を数値の大小でソート', ru: 'Целые числа — по величине' },
  str: { en: 'Strings, in alphabetical order', zh: '按照字典序排序字符串', 'zh-hant': '按照字典序排序字串', ja: '文字列を辞書順でソート', ru: 'Строки — в алфавитном порядке' },
  rule: { en: 'Strings, by a custom rule (grades)', zh: '按照自定义规则排序字符串', 'zh-hant': '按照自訂規則排序字串', ja: '文字列をカスタムルールでソート', ru: 'Строки — по пользовательскому правилу' },
};

const EXAMPLE_NOTE: T = {
  en: 'The data can be integers, floats, characters or strings; the order can be numeric value, alphabetical (ASCII) order or any custom rule.',
  zh: '待排序的数据可以是整数、浮点数、字符或字符串等；排序规则可以是数字大小、字符 ASCII 码顺序或自定义规则。',
  'zh-hant': '待排序的資料可以是整數、浮點數、字元或字串等；排序規則可以是數字大小、字元 ASCII 碼順序或自訂規則。',
  ja: 'ソートするデータは整数、浮動小数点数、文字、文字列など。順序は数値の大小、文字の ASCII コード順、カスタムルールなどで決められます。',
  ru: 'Сортировать можно целые и вещественные числа, символы, строки; порядок задается величиной чисел, порядком ASCII-кодов или пользовательским правилом.',
};

const sortingExamples: StaticFigure = {
  type: 'static',
  build(l) {
    const examples: { key: 'num' | 'str' | 'rule'; from: string[]; to: string[]; w: number }[] = [
      { key: 'num', from: ['7', '3', '2', '6', '0', '1', '5', '4'], to: ['0', '1', '2', '3', '4', '5', '6', '7'], w: 36 },
      { key: 'str', from: ['Kobe', 'Durant', 'Curry', 'Lebron', 'Harden'], to: ['Curry', 'Durant', 'Harden', 'Kobe', 'Lebron'], w: 64 },
      { key: 'rule', from: ['B-', 'A+', 'B', 'B+', 'A', 'D', 'C'], to: ['D', 'C', 'B-', 'B', 'B+', 'A', 'A+'], w: 38 },
    ];
    const gap = 5;
    const h = 32;
    const nodes: SceneNode[] = [];
    examples.forEach((ex, k) => {
      const top = k * 132;
      const x = Math.round((W - rowWidth(ex.from.length, ex.w, gap)) / 2);
      nodes.push(text(`t${k}`, W / 2, top + 16, EXAMPLE_TITLE[ex.key][l], { anchor: 'middle', bold: true, size: 13 }));
      nodes.push(...cells(`in${k}:`, x, top + 26, ex.from.map((v) => ({ value: v })), { w: ex.w, h, gap, size: 13 }));
      nodes.push(arrow(`ar${k}`, [W / 2, top + 63], [W / 2, top + 81], { tone: 'muted', width: 2 }));
      nodes.push(...cells(`out${k}:`, x, top + 86, ex.to.map((v) => ({ value: v, tone: 'ok' as Tone })), { w: ex.w, h, gap, size: 13 }));
      if (ex.key === 'rule') nodes.push(text('rule', W / 2 + 14, top + 77, 'D < C < B- < B < B+ < A < A+', { mono: true, size: 11, tone: 'muted' }));
    });
    return { scene: { w: W, h: 2 * 132 + 126, nodes }, notes: [EXAMPLE_NOTE[l]] };
  },
};

// ── Selection sort is unstable ────────────────────────────────────────

const INSTABILITY_SAY: Record<'init' | 'select' | 'swap' | 'done', T> = {
  init: {
    en: 'There are two equal elements 4, marked 4a and 4b, with 4a first. Round 1 of selection runs over the unsorted interval [0, 5].',
    zh: '数组中有两个相等的元素 4，记为 4a 和 4b，4a 在前。第 1 轮选择的未排序区间为 [0, 5]。',
    'zh-hant': '陣列中有兩個相等的元素 4，記為 4a 和 4b，4a 在前。第 1 輪選擇的未排序區間為 [0, 5]。',
    ja: '配列には等しい要素 4 が 2 つあり、4a と 4b とします（4a が先）。第 1 ラウンドの選択は未ソート区間 [0, 5] で行います。',
    ru: 'В массиве два равных элемента 4 — обозначим их 4a и 4b, первым стоит 4a. Первый раунд выбора идет по неотсортированному диапазону [0, 5].',
  },
  select: {
    en: 'The smallest element in [0, 5] is 1, at index 3. It is swapped with nums[0], which is 4a.',
    zh: '区间 [0, 5] 中的最小元素是索引 3 处的 1，它将与 nums[0]（即 4a）交换。',
    'zh-hant': '區間 [0, 5] 中的最小元素是索引 3 處的 1，它將與 nums[0]（即 4a）交換。',
    ja: '区間 [0, 5] の最小要素はインデックス 3 の 1 です。これを nums[0]、つまり 4a と交換します。',
    ru: 'Минимальный элемент в [0, 5] — 1 с индексом 3. Его меняют местами с nums[0], то есть с 4a.',
  },
  swap: {
    en: 'After the swap, 1 is sorted at index 0, and 4a has jumped over 4b to index 3.',
    zh: '交换后，1 位于索引 0 并完成排序，而 4a 越过 4b 被换到了索引 3。',
    'zh-hant': '交換後，1 位於索引 0 並完成排序，而 4a 越過 4b 被換到了索引 3。',
    ja: '交換後、1 はインデックス 0 で整列済みになり、4a は 4b を飛び越えてインデックス 3 へ移りました。',
    ru: 'После обмена 1 занимает свое место с индексом 0, а 4a перепрыгивает через 4b на индекс 3.',
  },
  done: {
    en: 'Now 4b comes before 4a: the relative order of the equal elements has changed. That is why selection sort is unstable.',
    zh: '现在 4b 位于 4a 之前，两个相等元素的相对位置发生了改变。因此选择排序是非稳定排序。',
    'zh-hant': '現在 4b 位於 4a 之前，兩個相等元素的相對位置發生了改變。因此選擇排序是非穩定排序。',
    ja: 'いまや 4b が 4a より前にあり、等しい 2 つの要素の相対的な順序が変わりました。そのため選択ソートは不安定ソートです。',
    ru: 'Теперь 4b стоит перед 4a: относительный порядок равных элементов изменился. Поэтому сортировка выбором нестабильна.',
  },
};

const selectionSortInstability: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', select: 'cmp', swap: 'swp', done: 'done' },
  build(l) {
    const cw = 46;
    const gap = 6;
    const x0 = Math.round((W - rowWidth(6, cw, gap)) / 2);
    const y = 50;
    const start: Item[] = [
      { id: 'a', v: 4 },
      { id: 'b', v: 4 },
      { id: 'c', v: 3 },
      { id: 'd', v: 1 },
      { id: 'e', v: 5 },
      { id: 'f', v: 2 },
    ];
    const swapped: Item[] = [start[3], start[1], start[2], start[0], start[4], start[5]];
    const PAIR: Record<string, Tone> = { a: 'info', b: 'accent' };
    const scene = (arr: Item[], step: 'init' | 'select' | 'swap' | 'done') => {
      const from = step === 'init' || step === 'select' ? 0 : 1;
      const look = (k: number, it: Item): Look => {
        if (it.id in PAIR) return { tone: PAIR[it.id], ring: (step === 'select' && it.id === 'a') || step === 'done' || (step === 'swap' && it.id === 'a') };
        if (k < from) return { tone: 'ok' };
        if (step === 'select' && it.id === 'd') return { tone: 'warn', ring: true };
        return { tone: 'idle' };
      };
      const a = cellX(x0, from, cw, gap);
      const b = cellX(x0, 5, cw, gap) + cw;
      const nodes: SceneNode[] = [
        brace('br', a, b, y - 6, 'up'),
        text('brl', (a + b) / 2, y - 28, `${WORD.unsorted[l]} [${from}, 5]`, { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        ...row('c', arr, x0, y, look, { w: cw, h: cw, gap }),
        ...indices('ix', x0, y + cw + 16, arr.map((_, k) => k), { w: cw, gap }),
      ];
      // The a / b marks ride in the corner of their cells.
      arr.forEach((it, k) => {
        if (it.id in PAIR) nodes.push(text(`tag:${it.id}`, cellX(x0, k, cw, gap) + cw - 6, y + 14, it.id, { anchor: 'end', mono: true, bold: true, size: 11, tone: PAIR[it.id] }));
      });
      if (step === 'select') {
        nodes.push(arrow('sw', [cellX(x0, 0, cw, gap) + cw / 2, y + cw + 24], [cellX(x0, 3, cw, gap) + cw / 2, y + cw + 24], { head: 'both', bend: 12, tone: 'warn', width: 1.5 }));
      }
      if (step === 'done') {
        nodes.push(chip('order', W / 2, y + cw + 30, '4a, 4b  →  4b, 4a', { tone: 'danger' }));
      }
      return { w: W, h: y + cw + 66, nodes };
    };
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(start, 'init'), say: INSTABILITY_SAY.init[l] },
      { kind: 'select', scene: scene(start, 'select'), say: INSTABILITY_SAY.select[l] },
      { kind: 'swap', scene: scene(swapped, 'swap'), say: INSTABILITY_SAY.swap[l] },
      { kind: 'done', scene: scene(swapped, 'done'), say: INSTABILITY_SAY.done[l] },
    ];
    return {
      frames,
      legend: [
        { tone: 'info', text: '4a' },
        { tone: 'accent', text: '4b' },
        { tone: 'ok', text: WORD.sorted[l] },
      ],
    };
  },
};

// ── Bubble sort, round by round ───────────────────────────────────────

const ROUND: T = { en: 'Round {k}', zh: '第 {k} 轮', 'zh-hant': '第 {k} 輪', ja: '第 {k} ラウンド', ru: 'Раунд {k}' };

const BUBBLE_SAY: Record<'init' | 'round' | 'end', T> = {
  init: {
    en: 'nums = [{list}]. Each round of "bubbling" swaps the largest element of the unsorted interval to its right end.',
    zh: 'nums = [{list}]。每轮“冒泡”都将未排序区间中的最大元素交换至该区间的最右端。',
    'zh-hant': 'nums = [{list}]。每輪“冒泡”都將未排序區間中的最大元素交換至該區間的最右端。',
    ja: 'nums = [{list}]。各ラウンドの「バブル処理」で、未ソート区間の最大要素がその右端へ交換されます。',
    ru: 'nums = [{list}]. Каждый раунд «всплытия» переносит наибольший элемент неотсортированного диапазона в его правый конец.',
  },
  round: {
    en: 'Round {k}: bubbling through [0, {i}] brings {v} to index {i}. The unsorted interval shrinks to [0, {j}].',
    zh: '第 {k} 轮：在 [0, {i}] 中执行冒泡，{v} 被交换至索引 {i}。未排序区间缩小为 [0, {j}]。',
    'zh-hant': '第 {k} 輪：在 [0, {i}] 中執行冒泡，{v} 被交換至索引 {i}。未排序區間縮小為 [0, {j}]。',
    ja: '第 {k} ラウンド：[0, {i}] でバブル処理を行い、{v} がインデックス {i} に来ます。未ソート区間は [0, {j}] に縮みます。',
    ru: 'Раунд {k}: «всплытие» по [0, {i}] приводит {v} на индекс {i}. Неотсортированный диапазон сужается до [0, {j}].',
  },
  end: {
    en: 'After n − 1 = {r} rounds, the one remaining element must be the smallest and needs no sorting. The array is sorted.',
    zh: '经过 n − 1 = {r} 轮冒泡后，仅剩的一个元素必定是最小元素，无须排序，数组排序完成。',
    'zh-hant': '經過 n − 1 = {r} 輪冒泡後，僅剩的一個元素必定是最小元素，無須排序，陣列排序完成。',
    ja: 'n − 1 = {r} ラウンドの後、残った 1 つの要素は必ず最小なのでソート不要です。配列のソートが完了しました。',
    ru: 'После n − 1 = {r} раундов оставшийся элемент обязательно минимальный, сортировать его не нужно. Массив отсортирован.',
  },
};

const bubbleSortOverview: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', round: 'swp', end: 'done' },
  build(l) {
    const values = [4, 1, 3, 1, 5, 2];
    const a = items(values);
    const n = a.length;
    const cw = 46;
    const gap = 6;
    const x0 = 86;
    const y = 40;
    const o = { w: cw, gap };
    const scene = (sortedFrom: number, ringAt: number | null, title: string) => {
      const nodes: SceneNode[] = [
        text('title', x0, 22, title, { bold: true, size: 13, tone: 'muted' }),
        text('nums', x0 - 12, y + cw / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 14, tone: 'ok' }),
        ...row('c', a, x0, y, (k) => ({ tone: k >= sortedFrom ? 'ok' : 'idle', ring: k === ringAt }), { w: cw, h: cw, gap }),
        ...indices('ix', x0, y + cw + 16, a.map((_, k) => k), o),
      ];
      if (sortedFrom > 0) nodes.push(...rangeBrace('br', x0, 0, sortedFrom - 1, y + cw + 24, `${WORD.unsorted[l]} [0, ${sortedFrom - 1}]`, o));
      else nodes.push(...rangeBrace('br', x0, 0, n - 1, y + cw + 24, `${WORD.sorted[l]} [0, ${n - 1}]`, { ...o, tone: 'ok' }));
      return { w: W, h: y + cw + 70, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(n, null, 'nums'), say: fmt(BUBBLE_SAY.init[l], { list: values.join(', ') }) }];
    for (let i = n - 1, k = 1; i > 0; i--, k++) {
      for (let j = 0; j < i; j++) if (Number(a[j].v) > Number(a[j + 1].v)) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      frames.push({ kind: 'round', scene: scene(i, i, fmt(ROUND[l], { k })), say: fmt(BUBBLE_SAY.round[l], { k, i, j: i - 1, v: a[i].v }) });
    }
    frames.push({ kind: 'end', scene: scene(0, null, ''), say: fmt(BUBBLE_SAY.end[l], { r: n - 1 }) });
    return { frames, legend: [{ tone: 'ok', text: WORD.sorted[l] }] };
  },
};

// ── Insertion sort, round by round ────────────────────────────────────

const INSERTION_SAY: Record<'init' | 'pick' | 'shift' | 'stay' | 'end', T> = {
  init: {
    en: 'At first, only the first element, 4, is sorted: the sorted interval is [0, 0].',
    zh: '初始状态下，数组的第 1 个元素 4 已完成排序，已排序区间为 [0, 0]。',
    'zh-hant': '初始狀態下，陣列的第 1 個元素 4 已完成排序，已排序區間為 [0, 0]。',
    ja: '初期状態では、配列の 1 番目の要素 4 だけが整列済みで、整列済み区間は [0, 0] です。',
    ru: 'В начальном состоянии отсортирован только первый элемент, 4: отсортированный диапазон — [0, 0].',
  },
  pick: {
    en: 'Round {k}: take base = nums[{k}] = {v} and compare it with the sorted elements on its left.',
    zh: '第 {k} 轮：选取 base = nums[{k}] = {v}，将其与左侧已排序区间的元素逐一比较。',
    'zh-hant': '第 {k} 輪：選取 base = nums[{k}] = {v}，將其與左側已排序區間的元素逐一比較。',
    ja: '第 {k} ラウンド：base = nums[{k}] = {v} を選び、左側の整列済み区間の要素と 1 つずつ比較します。',
    ru: 'Раунд {k}: берем base = nums[{k}] = {v} и сравниваем его с элементами отсортированного диапазона слева.',
  },
  shift: {
    en: 'The larger elements ({list}) shift right by one, and {v} goes into index {j}. The sorted interval grows to [0, {k}].',
    zh: '比 {v} 大的元素（{list}）向右移动一位，{v} 放入索引 {j}。已排序区间扩大为 [0, {k}]。',
    'zh-hant': '比 {v} 大的元素（{list}）向右移動一位，{v} 放入索引 {j}。已排序區間擴大為 [0, {k}]。',
    ja: '{v} より大きい要素（{list}）を 1 つ右へ移動し、{v} をインデックス {j} に入れます。整列済み区間は [0, {k}] に広がります。',
    ru: 'Элементы больше {v} ({list}) сдвигаются на одну позицию вправо, а {v} встает на индекс {j}. Отсортированный диапазон — [0, {k}].',
  },
  stay: {
    en: 'No sorted element is larger than {v}, so it stays at index {k}. The sorted interval grows to [0, {k}].',
    zh: '已排序区间中没有比 {v} 大的元素，它留在索引 {k}。已排序区间扩大为 [0, {k}]。',
    'zh-hant': '已排序區間中沒有比 {v} 大的元素，它留在索引 {k}。已排序區間擴大為 [0, {k}]。',
    ja: '整列済み区間に {v} より大きい要素はないので、インデックス {k} のままです。整列済み区間は [0, {k}] に広がります。',
    ru: 'В отсортированном диапазоне нет элементов больше {v}, поэтому он остается на индексе {k}. Отсортированный диапазон — [0, {k}].',
  },
  end: {
    en: 'After the last round of insertion, all elements are sorted.',
    zh: '最后一轮插入完成后，所有元素均已排序。',
    'zh-hant': '最後一輪插入完成後，所有元素均已排序。',
    ja: '最後のラウンドの挿入を終えると、すべての要素が整列済みになります。',
    ru: 'После последнего раунда вставки все элементы отсортированы.',
  },
};

const SHIFTED: T = { en: 'shifted right', zh: '右移一位', 'zh-hant': '右移一位', ja: '右へ移動', ru: 'сдвиг вправо' };

const insertionSortOverview: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', pick: 'cmp', place: 'swp', end: 'done' },
  build(l) {
    const a = items([4, 1, 3, 1, 5, 2]);
    const n = a.length;
    const cw = 46;
    const gap = 6;
    const x0 = Math.round((W - rowWidth(n, cw, gap)) / 2);
    const y = 76;
    const lift = 14;
    const o = { w: cw, gap };
    /** `sorted` = last index of the sorted interval; `base` = index lifted out of the row; `moved` = indices that just shifted. */
    const scene = (sorted: number, opts: { base?: number; placed?: number; moved?: number[] } = {}) => {
      const nodes: SceneNode[] = [
        ...Array.from({ length: n }, (_, k) => box(`slot${k}`, cellX(x0, k, cw, gap), y, '', { w: cw, h: cw, tone: 'ghost', dashed: true })),
        ...indices('ix', x0, y + cw + 16, a.map((_, k) => k), o),
      ];
      a.forEach((it, k) => {
        const lifted = k === opts.base;
        const tone: Tone = lifted || k === opts.placed ? 'accent' : opts.moved?.includes(k) ? 'warn' : k <= sorted ? 'ok' : 'idle';
        nodes.push(box(`c${it.id}`, cellX(x0, k, cw, gap), lifted ? lift : y, it.v, { w: cw, h: cw, tone, ring: lifted || k === opts.placed }));
        if (lifted) nodes.push(text('base', cellX(x0, k, cw, gap) + cw + 8, lift + cw / 2 + 5, WORD.base[l], { mono: true, bold: true, size: 13, tone: 'accent' }));
      });
      nodes.push(...rangeBrace('br', x0, 0, sorted, y + cw + 24, `${WORD.sorted[l]} [0, ${sorted}]`, { ...o, tone: 'ok' }));
      return { w: W, h: y + cw + 70, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(0), say: INSERTION_SAY.init[l] }];
    for (let k = 1; k < n; k++) {
      const base = a[k];
      const v = Number(base.v);
      frames.push({ kind: 'pick', scene: scene(k - 1, { base: k }), say: fmt(INSERTION_SAY.pick[l], { k, v }) });
      let j = k - 1;
      const larger: number[] = [];
      while (j >= 0 && Number(a[j].v) > v) {
        larger.unshift(Number(a[j].v));
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = base;
      const moved = larger.map((_, m) => j + 2 + m);
      frames.push({
        kind: 'place',
        scene: scene(k, { placed: j + 1, moved }),
        say: larger.length ? fmt(INSERTION_SAY.shift[l], { list: larger.join(', '), v, j: j + 1, k }) : fmt(INSERTION_SAY.stay[l], { v, k }),
      });
    }
    frames.push({ kind: 'end', scene: scene(n - 1), say: INSERTION_SAY.end[l] });
    return {
      frames,
      legend: [
        { tone: 'accent', text: 'base' },
        { tone: 'warn', text: SHIFTED[l] },
        { tone: 'ok', text: WORD.sorted[l] },
      ],
    };
  },
};

// ── Quick sort: partition, then recurse on both sides ─────────────────

const QUICK_SAY: Record<'call' | 'part' | 'next' | 'leaf' | 'end', T> = {
  call: {
    en: 'Recursion on [{l}, {r}]: sentinel partitioning takes the leftmost element, {v}, as the pivot.',
    zh: '对区间 [{l}, {r}] 执行哨兵划分，以最左端元素 {v} 作为基准数。',
    'zh-hant': '對區間 [{l}, {r}] 執行哨兵劃分，以最左端元素 {v} 作為基準數。',
    ja: '[{l}, {r}] に対してパーティションを行います。最も左の要素 {v} を基準数とします。',
    ru: 'Разделение с опорным элементом для [{l}, {r}]: опорный элемент — крайний левый, {v}.',
  },
  part: {
    en: 'After partitioning, elements ≤ {v} are on its left and elements ≥ {v} on its right, so the pivot {v} is in its final place.',
    zh: '划分完成后，基准数 {v} 左侧的元素均 ≤ {v}，右侧的元素均 ≥ {v}，{v} 已位于最终位置。',
    'zh-hant': '劃分完成後，基準數 {v} 左側的元素均 ≤ {v}，右側的元素均 ≥ {v}，{v} 已位於最終位置。',
    ja: 'パーティション後、基準数 {v} の左は {v} 以下、右は {v} 以上の要素になり、{v} は最終位置に確定します。',
    ru: 'После разделения слева от опорного элемента {v} стоят элементы ≤ {v}, справа — ≥ {v}, и {v} уже на своем месте.',
  },
  next: {
    en: ' Next, sort the left and right sub-arrays recursively.',
    zh: '接下来对左子数组和右子数组递归排序。',
    'zh-hant': '接下來對左子陣列和右子陣列遞迴排序。',
    ja: '次に、左部分配列と右部分配列を再帰的にソートします。',
    ru: ' Далее рекурсивно сортируем левый и правый подмассивы.',
  },
  leaf: {
    en: ' The sub-arrays left over are no longer than 1, so the recursion ends there.',
    zh: '剩下的子数组长度不超过 1，递归在此终止。',
    'zh-hant': '剩下的子陣列長度不超過 1，遞迴在此終止。',
    ja: '残った部分配列の長さは 1 以下なので、そこで再帰を終了します。',
    ru: ' Оставшиеся подмассивы не длиннее 1, поэтому рекурсия на них завершается.',
  },
  end: {
    en: 'Every sub-array has been partitioned down to length 1, so the whole array is sorted.',
    zh: '所有子数组都已递归划分至长度为 1，整个数组排序完成。',
    'zh-hant': '所有子陣列都已遞迴劃分至長度為 1，整個陣列排序完成。',
    ja: 'すべての部分配列が長さ 1 になるまで再帰的に分割され、配列全体のソートが完了しました。',
    ru: 'Все подмассивы рекурсивно разделены до длины 1, и весь массив отсортирован.',
  },
};

const quickSortOverview: StepFigure = {
  type: 'steps',
  tones: { call: 'cmp', part: 'swp', end: 'done' },
  build(l) {
    const a = items([2, 4, 1, 0, 3, 5]);
    const n = a.length;
    const cw = 46;
    const gap = 6;
    const x0 = Math.round((W - rowWidth(n, cw, gap)) / 2);
    const y = 60;
    const o = { w: cw, gap };
    const fixed = new Set<string>();
    const val = (k: number) => Number(a[k].v);
    const span = (id: string, lo: number, hi: number, tone: Tone = 'soft') => region(id, cellX(x0, lo, cw, gap) - 5, y - 5, rowWidth(hi - lo + 1, cw, gap) + 10, cw + 10, { tone });
    const under = (id: string, lo: number, hi: number, label: string, tone: Tone, line: number) =>
      text(id, (cellX(x0, lo, cw, gap) + cellX(x0, hi, cw, gap) + cw) / 2, y + cw + 38 + line * 18, label, { anchor: 'middle', size: 12, tone });
    const scene = (range: [number, number] | null, pivot: number | null, subs: [number, number][], call: string | null) => {
      const nodes: SceneNode[] = [];
      if (call) nodes.push(chip('call', W / 2, 6, call));
      if (range && !subs.length) nodes.push(span('rg', range[0], range[1]));
      subs.forEach(([lo, hi], s) => {
        if (hi - lo < 1) return;
        nodes.push(span(`sub${s}`, lo, hi));
        nodes.push(under(`subl${s}`, lo, hi, (lo < pivot! ? WORD.left : WORD.right)[l], 'muted', 1));
      });
      if (pivot !== null && subs.length) nodes.push(under('pl', pivot, pivot, WORD.pivot[l], 'ok', 0));
      nodes.push(
        ...row('c', a, x0, y, (k, it) => {
          if (fixed.has(it.id)) return { tone: 'ok', ring: k === pivot };
          if (k === pivot) return { tone: 'accent', ring: true };
          const inside = range ? k >= range[0] && k <= range[1] : true;
          return { tone: 'idle', dim: !inside };
        }, { w: cw, h: cw, gap }),
        ...indices('ix', x0, y + cw + 16, a.map((_, k) => k), o),
      );
      return { w: W, h: y + cw + 72, nodes };
    };
    /** The book's sentinel partitioning, returning the pivot's final index. */
    const partition = (lo: number, hi: number) => {
      let i = lo;
      let j = hi;
      while (i < j) {
        while (i < j && val(j) >= val(lo)) j--;
        while (i < j && val(i) <= val(lo)) i++;
        [a[i], a[j]] = [a[j], a[i]];
      }
      [a[i], a[lo]] = [a[lo], a[i]];
      return i;
    };
    const frames: SceneFrame[] = [];
    const sort = (lo: number, hi: number) => {
      if (lo >= hi) {
        if (lo === hi) fixed.add(a[lo].id);
        return;
      }
      const call = `quick_sort(nums, ${lo}, ${hi})`;
      const v = val(lo);
      frames.push({ kind: 'call', scene: scene([lo, hi], lo, [], call), say: fmt(QUICK_SAY.call[l], { l: lo, r: hi, v }) });
      const p = partition(lo, hi);
      fixed.add(a[p].id);
      const subs: [number, number][] = [
        [lo, p - 1],
        [p + 1, hi],
      ];
      // Length-1 sub-arrays are already in place.
      for (const [s, e] of subs) if (s === e) fixed.add(a[s].id);
      const deeper = subs.some(([s, e]) => e > s);
      frames.push({ kind: 'part', scene: scene([lo, hi], p, subs, call), say: fmt(QUICK_SAY.part[l], { v }) + (deeper ? QUICK_SAY.next : QUICK_SAY.leaf)[l] });
      sort(lo, p - 1);
      sort(p + 1, hi);
    };
    sort(0, n - 1);
    frames.push({ kind: 'end', scene: scene(null, null, [], null), say: QUICK_SAY.end[l] });
    return {
      frames,
      legend: [
        { tone: 'accent', text: WORD.pivot[l] },
        { tone: 'ok', text: WORD.sorted[l] },
      ],
    };
  },
};

// ── Merge sort: divide, then merge back up ────────────────────────────

const MERGE_SAY: Record<'init' | 'divide' | 'base' | 'merge' | 'end', T> = {
  init: {
    en: 'Merge sort on nums = [{list}]. The divide phase splits the array at its midpoint, again and again.',
    zh: '对 nums = [{list}] 执行归并排序。划分阶段：通过递归不断地将数组从中点处分开。',
    'zh-hant': '對 nums = [{list}] 執行合併排序。劃分階段：透過遞迴不斷地將陣列從中點處分開。',
    ja: 'nums = [{list}] にマージソートを行います。分割段階では、再帰によって配列を中点で繰り返し分割します。',
    ru: 'Сортируем слиянием nums = [{list}]. На этапе разделения массив рекурсивно делится пополам.',
  },
  divide: {
    en: 'Divide: each sub-array of length {a} splits at its midpoint into two of length {b}.',
    zh: '划分：每个长度为 {a} 的子数组从中点处分为两个长度为 {b} 的子数组。',
    'zh-hant': '劃分：每個長度為 {a} 的子陣列從中點處分為兩個長度為 {b} 的子陣列。',
    ja: '分割：長さ {a} の各部分配列を、中点で長さ {b} の 2 つに分けます。',
    ru: 'Разделение: каждый подмассив длины {a} делится пополам на два подмассива длины {b}.',
  },
  base: {
    en: 'Sub-arrays of length 1 end the recursion, since a single element is already sorted. The merge phase begins.',
    zh: '子数组长度为 1 时终止划分，因为单个元素本身就是有序的。开始合并阶段。',
    'zh-hant': '子陣列長度為 1 時終止劃分，因為單個元素本身就是有序的。開始合併階段。',
    ja: '部分配列の長さが 1 になると分割を終了します。要素 1 つはすでにソート済みだからです。ここからマージ段階です。',
    ru: 'Подмассивы длины 1 завершают рекурсию: один элемент уже упорядочен. Начинается этап слияния.',
  },
  merge: {
    en: 'Merge: each pair of sorted sub-arrays of length {b} combines into one sorted array of length {a}.',
    zh: '合并：将左右两个长度为 {b} 的有序数组合并为一个长度为 {a} 的有序数组。',
    'zh-hant': '合併：將左右兩個長度為 {b} 的有序陣列合併為一個長度為 {a} 的有序陣列。',
    ja: 'マージ：長さ {b} の左右 2 つのソート済み配列を、長さ {a} のソート済み配列 1 つにマージします。',
    ru: 'Слияние: каждая пара упорядоченных подмассивов длины {b} объединяется в упорядоченный массив длины {a}.',
  },
  end: {
    en: 'The last merge produces the whole sorted array: [{list}].',
    zh: '最后一次合并得到完整的有序数组 [{list}]。',
    'zh-hant': '最後一次合併得到完整的有序陣列 [{list}]。',
    ja: '最後のマージで、配列全体がソートされます：[{list}]。',
    ru: 'Последнее слияние дает весь упорядоченный массив: [{list}].',
  },
};

const mergeSortOverview: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', divide: 'cmp', base: 'cmp', merge: 'swp', end: 'done' },
  build(l) {
    const values = [7, 3, 2, 6, 0, 1, 5, 4];
    const n = values.length;
    const depth = Math.log2(n);
    const cw = 34;
    const gap = 4;
    const left = 10;
    const width = W - 2 * left;
    const rowY = (d: number) => 30 + d * 62;
    const size = (d: number) => n / 2 ** d;
    const groupW = (d: number) => rowWidth(size(d), cw, gap);
    const groupCx = (d: number, g: number) => left + ((g + 0.5) * width) / 2 ** d;
    const groupX = (d: number, g: number) => groupCx(d, g) - groupW(d) / 2;
    /** Element indices of each group at level d, in original order or sorted within the group. */
    const groups = (d: number, sorted: boolean) =>
      Array.from({ length: 2 ** d }, (_, g) => {
        const ids = Array.from({ length: size(d) }, (_, k) => g * size(d) + k);
        return sorted ? ids.sort((p, q) => values[p] - values[q] || p - q) : ids;
      });
    const scene = (level: number, sorted: boolean, deepest: number, phase: 'divide' | 'merge', cellTone: Tone) => {
      const nodes: SceneNode[] = [];
      for (let d = 0; d <= deepest; d++) {
        for (let g = 0; g < 2 ** d; g++) {
          const on = d === level;
          nodes.push(region(`r${d}.${g}`, groupX(d, g) - 4, rowY(d) - 4, groupW(d) + 8, cw + 8, { tone: on ? (phase === 'merge' ? 'ok' : 'soft') : 'idle', dim: !on }));
          if (d > 0) {
            const px = groupCx(d - 1, g >> 1);
            const cx = groupCx(d, g);
            const y1 = rowY(d - 1) + cw + 4;
            const y2 = rowY(d) - 4;
            const ym = (y1 + y2) / 2;
            nodes.push(arrow(`k${d}.${g}`, [px, y1], [cx, y2], { via: [[px, ym], [cx, ym]], head: 'none', tone: 'muted', width: 1.25, dim: true }));
          }
        }
      }
      // Earlier and later stages stay behind as faint values, as in a recursion trace.
      for (let d = 0; d <= deepest; d++) {
        if (d === level) continue;
        const merged = phase === 'merge' && d > level && d < depth;
        groups(d, merged).forEach((ids, g) => {
          ids.forEach((e, k) => nodes.push(box(`g${d}.${e}`, cellX(groupX(d, g), k, cw, gap), rowY(d), values[e], { w: cw, h: cw, size: 14, tone: 'ghost', dashed: true })));
        });
      }
      groups(level, sorted).forEach((ids, g) => {
        ids.forEach((e, k) => nodes.push(box(`m${e}`, cellX(groupX(level, g), k, cw, gap), rowY(level), values[e], { w: cw, h: cw, size: 14, tone: cellTone })));
      });
      nodes.push(chip('phase', W / 2, rowY(depth) + cw + 18, WORD[phase][l], { sans: true, tone: phase === 'divide' ? 'accent' : 'ok' }));
      return { w: W, h: rowY(depth) + cw + 52, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(0, false, 0, 'divide', 'idle'), say: fmt(MERGE_SAY.init[l], { list: values.join(', ') }) }];
    for (let d = 1; d <= depth; d++) {
      if (d < depth) frames.push({ kind: 'divide', scene: scene(d, false, d, 'divide', 'idle'), say: fmt(MERGE_SAY.divide[l], { a: size(d - 1), b: size(d) }) });
      else frames.push({ kind: 'base', scene: scene(d, false, d, 'merge', 'ok'), say: MERGE_SAY.base[l] });
    }
    for (let d = depth - 1; d >= 0; d--) {
      const say = d > 0 ? fmt(MERGE_SAY.merge[l], { a: size(d), b: size(d + 1) }) : fmt(MERGE_SAY.end[l], { list: [...values].sort((p, q) => p - q).join(', ') });
      frames.push({ kind: d > 0 ? 'merge' : 'end', scene: scene(d, true, depth, 'merge', 'ok'), say });
    }
    return { frames };
  },
};

// ── Heap sort ─────────────────────────────────────────────────────────

const HEAP_SORT_PY = raw(heapSortPyEn, heapSortPyZh, heapSortPyZhHant, heapSortPyJa, heapSortPyRu);
const HEAP_SORT_JAVA = raw(heapSortJavaEn, heapSortJavaZh, heapSortJavaZhHant, heapSortJavaJa, heapSortJavaRu);

const HEAP_SAY: Record<'init' | 'keep' | 'swap' | 'heap' | 'top' | 'end', T> = {
  init: {
    en: 'nums = [{list}], drawn as a complete binary tree. First build a max heap: heapify each non-leaf node from top to bottom, starting from the last one.',
    zh: 'nums = [{list}]，画成一棵完全二叉树。首先建立大顶堆：从最后一个非叶节点开始，依次对每个非叶节点执行从顶至底堆化。',
    'zh-hant': 'nums = [{list}]，畫成一棵完全二元樹。首先建立大頂堆積：從最後一個非葉節點開始，依次對每個非葉節點執行從頂至底堆積化。',
    ja: 'nums = [{list}] を完全二分木として描きます。まず最大ヒープを構築します。最後の非葉ノードから順に、各非葉ノードを上から下へヒープ化します。',
    ru: 'nums = [{list}] в виде полного двоичного дерева. Сначала строим макс-кучу: просеиваем сверху вниз каждый нелистовой узел, начиная с последнего.',
  },
  keep: {
    en: 'Heapify index {i} ({v}): its children ({kids}) are not larger, so nothing moves.',
    zh: '堆化索引 {i}（{v}）：其子节点（{kids}）都不比它大，无须交换。',
    'zh-hant': '堆積化索引 {i}（{v}）：其子節點（{kids}）都不比它大，無須交換。',
    ja: 'インデックス {i}（{v}）をヒープ化：子ノード（{kids}）はどれも大きくないので、交換は不要です。',
    ru: 'Просеиваем индекс {i} ({v}): его дочерние узлы ({kids}) не больше, обмен не нужен.',
  },
  swap: {
    en: '{v} is smaller than its larger child {m}, so they swap: {v} moves down to index {ma}.',
    zh: '{v} 小于较大的子节点 {m}，二者交换：{v} 下移到索引 {ma}。',
    'zh-hant': '{v} 小於較大的子節點 {m}，二者交換：{v} 下移到索引 {ma}。',
    ja: '{v} は大きいほうの子ノード {m} より小さいので交換し、{v} はインデックス {ma} へ下がります。',
    ru: '{v} меньше большего дочернего узла {m}, поэтому они меняются местами: {v} опускается на индекс {ma}.',
  },
  heap: {
    en: 'The max heap is built: the largest element, {v}, is at the heap top. Now extract the largest element n − 1 times.',
    zh: '大顶堆建立完成，最大元素 {v} 位于堆顶。接下来循环 n − 1 轮，从堆中提取最大元素。',
    'zh-hant': '大頂堆積建立完成，最大元素 {v} 位於堆積頂。接下來迴圈 n − 1 輪，從堆積中提取最大元素。',
    ja: '最大ヒープが完成し、最大要素 {v} がヒープ頂点にあります。ここから n − 1 回、最大要素を取り出します。',
    ru: 'Макс-куча построена: наибольший элемент {v} в вершине кучи. Теперь n − 1 раз извлекаем максимум.',
  },
  top: {
    en: 'Swap the heap top {top} with the heap bottom {bottom}. {top} joins the sorted interval, and the heap shrinks to length {n}.',
    zh: '交换堆顶元素 {top} 与堆底元素 {bottom}。{top} 进入已排序区间，堆的长度减为 {n}。',
    'zh-hant': '交換堆積頂元素 {top} 與堆積底元素 {bottom}。{top} 進入已排序區間，堆積的長度減為 {n}。',
    ja: 'ヒープ頂点の {top} とヒープ末尾の {bottom} を交換します。{top} は整列済み区間に入り、ヒープの長さは {n} になります。',
    ru: 'Меняем вершину кучи {top} с нижним элементом {bottom}. {top} попадает в отсортированный диапазон, длина кучи — {n}.',
  },
  end: {
    en: 'After n − 1 = {r} rounds, the element left in the heap is the smallest. The array is sorted.',
    zh: '循环 n − 1 = {r} 轮后，堆中仅剩的元素就是最小元素，数组排序完成。',
    'zh-hant': '迴圈 n − 1 = {r} 輪後，堆積中僅剩的元素就是最小元素，陣列排序完成。',
    ja: 'n − 1 = {r} 回の繰り返しの後、ヒープに残った要素が最小で、配列のソートが完了します。',
    ru: 'После n − 1 = {r} раундов в куче остается минимальный элемент, и массив отсортирован.',
  },
};

const heapSortSteps: StepFigure = {
  type: 'steps',
  call: 'heap_sort(nums)',
  tones: { init: 'idle', keep: 'cmp', build: 'swp', heap: 'cmp', top: 'swp', sift: 'swp', end: 'done' },
  sources: funcSources(HEAP_SORT_PY, HEAP_SORT_JAVA, ['heap_sort', 'sift_down'], {
    python: {
      init: ['for i in range(len(nums) // 2 - 1, -1, -1):'],
      keep: ['if l < n and nums[l] > nums[ma]:', 'if r < n and nums[r] > nums[ma]:', 'if ma == i:'],
      build: ['sift_down(nums, len(nums), i)', 'nums[i], nums[ma] = nums[ma], nums[i]'],
      heap: ['for i in range(len(nums) - 1, 0, -1):'],
      top: ['nums[0], nums[i] = nums[i], nums[0]'],
      sift: ['sift_down(nums, i, 0)', 'nums[i], nums[ma] = nums[ma], nums[i]'],
      end: ['def heap_sort('],
    },
    java: {
      init: ['for (int i = nums.length / 2 - 1; i >= 0; i--)'],
      keep: ['if (l < n && nums[l] > nums[ma])', 'if (r < n && nums[r] > nums[ma])', 'if (ma == i)'],
      build: ['siftDown(nums, nums.length, i);', 'nums[i] = nums[ma];'],
      heap: ['for (int i = nums.length - 1; i > 0; i--)'],
      top: ['int tmp = nums[0];', 'nums[0] = nums[i];', 'nums[i] = tmp;'],
      sift: ['siftDown(nums, i, 0);', 'nums[i] = nums[ma];'],
      end: ['public static void heapSort('],
    },
  }),
  build(l) {
    const values = [4, 1, 3, 1, 5, 2];
    const a = items(values);
    const n = a.length;
    const tree = { left: 70, width: 300, top: 32, gap: 54, r: 18 };
    const cw = 40;
    const gap = 6;
    const x0 = Math.round((W - rowWidth(n, cw, gap)) / 2);
    const ay = 206;
    const slot = (i: number) => {
      const d = Math.floor(Math.log2(i + 1));
      const s = i - (2 ** d - 1);
      return { cx: tree.left + ((s + 0.5) * tree.width) / 2 ** d, cy: tree.top + d * tree.gap };
    };
    type Marks = Map<number, Look>;
    const scene = (size: number, marks: Marks, built: boolean) => {
      const look = (k: number): Look => marks.get(k) ?? { tone: k >= size ? 'ok' : 'idle' };
      const circles = a.map((it, k) => {
        const { cx, cy } = slot(k);
        const m = look(k);
        return box(`t${it.id}`, cx - tree.r, cy - tree.r, it.v, { w: tree.r * 2, h: tree.r * 2, shape: 'circle', size: 14, tone: m.tone, ring: m.ring });
      });
      const nodes: SceneNode[] = [];
      for (let k = 1; k < size; k++) nodes.push(link(`e${k}`, circles[(k - 1) >> 1], circles[k], { pad: 2, width: 1.5 }));
      nodes.push(...circles);
      nodes.push(...row('a', a, x0, ay, (k) => look(k), { w: cw, h: cw, gap, size: 14 }));
      nodes.push(...indices('ix', x0, ay + cw + 14, a.map((_, k) => k), { w: cw, gap }));
      const top = ay - 6;
      if (built && size > 0) {
        const p = cellX(x0, 0, cw, gap);
        const q = cellX(x0, size - 1, cw, gap) + cw;
        nodes.push(brace('bh', p, q, top, 'up'), text('bhl', (p + q) / 2, top - 22, WORD.heapRange[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }));
      }
      if (size < n) {
        const p = cellX(x0, size, cw, gap);
        const q = cellX(x0, n - 1, cw, gap) + cw;
        nodes.push(brace('bs', p, q, top, 'up', 'ok'), text('bsl', (p + q) / 2, top - 22, WORD.sortedShort[l], { anchor: 'middle', size: 12, bold: true, tone: 'ok' }));
      }
      return { w: W, h: ay + cw + 24, nodes };
    };
    const frames: SceneFrame[] = [];
    const push = (kind: string, size: number, marks: [number, Look][], say: string, built = true) => frames.push({ kind, scene: scene(size, new Map(marks), built), say });
    const v = (k: number) => Number(a[k].v);
    /** sift_down(nums, size, start), one frame per swap, or one frame when nothing moves. */
    const siftDown = (size: number, start: number, kind: 'build' | 'sift', built: boolean) => {
      let i = start;
      let moved = false;
      for (;;) {
        const li = 2 * i + 1;
        const ri = 2 * i + 2;
        let ma = i;
        if (li < size && v(li) > v(ma)) ma = li;
        if (ri < size && v(ri) > v(ma)) ma = ri;
        if (ma === i) {
          const kids = [li, ri].filter((k) => k < size);
          if (!moved && kids.length) {
            push('keep', size, [[i, { tone: 'accent', ring: true }], ...kids.map((k): [number, Look] => [k, { tone: 'info' }])], fmt(HEAP_SAY.keep[l], { i, v: v(i), kids: kids.map(v).join(', ') }), built);
          }
          return;
        }
        const vi = v(i);
        const m = v(ma);
        [a[i], a[ma]] = [a[ma], a[i]];
        push(
          kind,
          size,
          [
            [i, { tone: 'warn' }],
            [ma, { tone: 'warn', ring: true }],
          ],
          fmt(HEAP_SAY.swap[l], { v: vi, m, ma }),
          built,
        );
        moved = true;
        i = ma;
      }
    };
    push('init', n, [], fmt(HEAP_SAY.init[l], { list: values.join(', ') }), false);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i, 'build', false);
    push('heap', n, [[0, { tone: 'accent', ring: true }]], fmt(HEAP_SAY.heap[l], { v: v(0) }));
    for (let i = n - 1; i > 0; i--) {
      const top = v(0);
      const bottom = v(i);
      [a[0], a[i]] = [a[i], a[0]];
      push(
        'top',
        i,
        [
          [0, { tone: 'warn', ring: true }],
          [i, { tone: 'ok', ring: true }],
        ],
        fmt(HEAP_SAY.top[l], { top, bottom, n: i }),
      );
      siftDown(i, 0, 'sift', true);
    }
    push('end', 0, [], fmt(HEAP_SAY.end[l], { r: n - 1 }));
    return {
      frames,
      legend: [
        { tone: 'idle', text: WORD.heap[l], shape: 'circle' },
        { tone: 'accent', text: WORD.compare[l], shape: 'circle' },
        { tone: 'info', text: WORD.children[l], shape: 'circle' },
        { tone: 'warn', text: WORD.swap[l], shape: 'circle' },
        { tone: 'ok', text: WORD.sortedShort[l], shape: 'circle' },
      ],
    };
  },
};

// ── Comparison of the sorting algorithms ──────────────────────────────

type Algo = 'selection' | 'bubble' | 'insertion' | 'quick' | 'merge' | 'heap' | 'bucket' | 'counting' | 'radix';

const ALGO_NAME: Record<Algo, T> = {
  selection: { en: 'Selection sort', zh: '选择排序', 'zh-hant': '選擇排序', ja: '選択ソート', ru: 'Сортировка выбором' },
  bubble: { en: 'Bubble sort', zh: '冒泡排序', 'zh-hant': '泡沫排序', ja: 'バブルソート', ru: 'Сортировка пузырьком' },
  insertion: { en: 'Insertion sort', zh: '插入排序', 'zh-hant': '插入排序', ja: '挿入ソート', ru: 'Сортировка вставками' },
  quick: { en: 'Quick sort', zh: '快速排序', 'zh-hant': '快速排序', ja: 'クイックソート', ru: 'Быстрая сортировка' },
  merge: { en: 'Merge sort', zh: '归并排序', 'zh-hant': '合併排序', ja: 'マージソート', ru: 'Сортировка слиянием' },
  heap: { en: 'Heap sort', zh: '堆排序', 'zh-hant': '堆積排序', ja: 'ヒープソート', ru: 'Пирамидальная сортировка' },
  bucket: { en: 'Bucket sort (k buckets)', zh: '桶排序（k 个桶）', 'zh-hant': '桶排序（k 個桶）', ja: 'バケットソート（バケット数 k）', ru: 'Блочная сортировка (k блоков)' },
  counting: { en: 'Counting sort (data range m)', zh: '计数排序（数据范围 m）', 'zh-hant': '計數排序（資料範圍 m）', ja: '計数ソート（データ範囲 m）', ru: 'Сортировка подсчетом (диапазон m)' },
  radix: {
    en: 'Radix sort (k digits, base b)',
    zh: '基数排序（k 位，b 进制）',
    'zh-hant': '基數排序（k 位，b 進位制）',
    ja: '基数ソート（k 桁、b 進数）',
    ru: 'Поразрядная сортировка (k разрядов, основание b)',
  },
};

const TABLE_HEAD: Record<Locale, string[]> = {
  en: ['Algorithm', 'Best time', 'Average time', 'Worst time', 'Worst space', 'Stability', 'In-place', 'Adaptivity', 'Comparison'],
  zh: ['排序算法', '最佳时间', '平均时间', '最差时间', '最差空间', '稳定性', '就地性', '自适应性', '基于比较'],
  'zh-hant': ['排序演算法', '最佳時間', '平均時間', '最差時間', '最差空間', '穩定性', '就地性', '自適應性', '基於比較'],
  ja: ['ソートアルゴリズム', '最良時間', '平均時間', '最悪時間', '最悪空間', '安定性', 'インプレース性', '適応性', '比較ベース'],
  ru: ['Алгоритм', 'Лучшее время', 'Среднее время', 'Худшее время', 'Память (худший случай)', 'Стабильность', 'На месте', 'Адаптивность', 'Сравнения'],
};

/** [yes, no] for stability, in-place, adaptivity and comparison. */
const TABLE_YESNO: Record<'stable' | 'inPlace' | 'adaptive' | 'comparison', Record<Locale, [string, string]>> = {
  stable: { en: ['Stable', 'Unstable'], zh: ['稳定', '非稳定'], 'zh-hant': ['穩定', '非穩定'], ja: ['安定', '不安定'], ru: ['Стабильная', 'Нестабильная'] },
  inPlace: { en: ['In-place', 'Not in-place'], zh: ['原地', '非原地'], 'zh-hant': ['原地', '非原地'], ja: ['インプレース', '非インプレース'], ru: ['На месте', 'Не на месте'] },
  adaptive: { en: ['Adaptive', 'Non-adaptive'], zh: ['自适应', '非自适应'], 'zh-hant': ['自適應', '非自適應'], ja: ['適応的', '非適応的'], ru: ['Адаптивная', 'Неадаптивная'] },
  comparison: { en: ['Comparison-based', 'Non-comparison'], zh: ['比较', '非比较'], 'zh-hant': ['比較', '非比較'], ja: ['比較ベース', '非比較'], ru: ['На основе сравнений', 'Без сравнений'] },
};

const N2 = 'O(n²)';
const NLOGN = 'O(n log n)';

/** Best, average and worst time, worst space, then stable, in-place, adaptive, comparison-based — as in the book's summary. */
const TABLE_ROWS: [Algo, string, string, string, string, boolean, boolean, boolean, boolean][] = [
  ['selection', N2, N2, N2, 'O(1)', false, true, false, true],
  ['bubble', 'O(n)', N2, N2, 'O(1)', true, true, true, true],
  ['insertion', 'O(n)', N2, N2, 'O(1)', true, true, true, true],
  ['quick', NLOGN, NLOGN, N2, 'O(log n)', false, true, false, true],
  ['merge', NLOGN, NLOGN, NLOGN, 'O(n)', true, false, false, true],
  ['heap', NLOGN, NLOGN, NLOGN, 'O(1)', false, true, false, true],
  ['bucket', 'O(n + k)', 'O(n + k)', N2, 'O(n + k)', true, false, false, false],
  ['counting', 'O(n + m)', 'O(n + m)', 'O(n + m)', 'O(n + m)', true, false, false, false],
  ['radix', 'O(nk)', 'O(nk)', 'O(nk)', 'O(n + b)', true, false, false, false],
];

const sortingAlgorithmsComparison: TableFigure = {
  type: 'table',
  build(l) {
    const yn = (key: keyof typeof TABLE_YESNO, yes: boolean) => TABLE_YESNO[key][l][yes ? 0 : 1];
    return {
      head: TABLE_HEAD[l],
      rows: TABLE_ROWS.map(([algo, best, avg, worst, space, stable, inPlace, adaptive, comparison]) => [
        ALGO_NAME[algo][l],
        best,
        avg,
        worst,
        space,
        yn('stable', stable),
        yn('inPlace', inPlace),
        yn('adaptive', adaptive),
        yn('comparison', comparison),
      ]),
      mono: [1, 2, 3, 4],
    };
  },
};

export const COMPARE_FIGURES: Record<string, Figure> = {
  sorting_examples: sortingExamples,
  selection_sort_instability: selectionSortInstability,
  bubble_sort_overview: bubbleSortOverview,
  insertion_sort_overview: insertionSortOverview,
  quick_sort_overview: quickSortOverview,
  merge_sort_overview: mergeSortOverview,
  heap_sort_steps: heapSortSteps,
  sorting_algorithms_comparison: sortingAlgorithmsComparison,
};
