import bsrJavaEn from '@codes-en/java/chapter_divide_and_conquer/binary_search_recur.java?raw';
import btJavaEn from '@codes-en/java/chapter_divide_and_conquer/build_tree.java?raw';
import bsrPyEn from '@codes-en/python/chapter_divide_and_conquer/binary_search_recur.py?raw';
import btPyEn from '@codes-en/python/chapter_divide_and_conquer/build_tree.py?raw';
import bsrJavaJa from '@codes-ja/java/chapter_divide_and_conquer/binary_search_recur.java?raw';
import btJavaJa from '@codes-ja/java/chapter_divide_and_conquer/build_tree.java?raw';
import bsrPyJa from '@codes-ja/python/chapter_divide_and_conquer/binary_search_recur.py?raw';
import btPyJa from '@codes-ja/python/chapter_divide_and_conquer/build_tree.py?raw';
import bsrJavaRu from '@codes-ru/java/chapter_divide_and_conquer/binary_search_recur.java?raw';
import btJavaRu from '@codes-ru/java/chapter_divide_and_conquer/build_tree.java?raw';
import bsrPyRu from '@codes-ru/python/chapter_divide_and_conquer/binary_search_recur.py?raw';
import btPyRu from '@codes-ru/python/chapter_divide_and_conquer/build_tree.py?raw';
import bsrJavaZh from '@codes-zh/java/chapter_divide_and_conquer/binary_search_recur.java?raw';
import btJavaZh from '@codes-zh/java/chapter_divide_and_conquer/build_tree.java?raw';
import bsrPyZh from '@codes-zh/python/chapter_divide_and_conquer/binary_search_recur.py?raw';
import btPyZh from '@codes-zh/python/chapter_divide_and_conquer/build_tree.py?raw';
import bsrJavaZhHant from '@codes-zh-hant/java/chapter_divide_and_conquer/binary_search_recur.java?raw';
import btJavaZhHant from '@codes-zh-hant/java/chapter_divide_and_conquer/build_tree.java?raw';
import bsrPyZhHant from '@codes-zh-hant/python/chapter_divide_and_conquer/binary_search_recur.py?raw';
import btPyZhHant from '@codes-zh-hant/python/chapter_divide_and_conquer/build_tree.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, cells, cellX, center, chip, indices, link, region, rowWidth, seg, tag, text } from '../kit';
import type { ArrowNode, BoxNode, Figure, LegendItem, PathNode, Rich, SceneFrame, SceneNode, Segment, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

/**
 * Chapter 12, divide and conquer. Merge sort and bubble sort show dividing and merging arrays;
 * binary search and tree building show recursive calls on shrinking index ranges; the Tower of
 * Hanoi draws rods and disks, and each disk keeps its id so it glides from rod to rod.
 */

const BSR_PY = raw(bsrPyEn, bsrPyZh, bsrPyZhHant, bsrPyJa, bsrPyRu);
const BSR_JAVA = raw(bsrJavaEn, bsrJavaZh, bsrJavaZhHant, bsrJavaJa, bsrJavaRu);
const BT_PY = raw(btPyEn, btPyZh, btPyZhHant, btPyJa, btPyRu);
const BT_JAVA = raw(btJavaEn, btJavaZh, btJavaZhHant, btJavaJa, btJavaRu);

const W = 440;

const WORD = {
  divide: { en: 'Divide', zh: '划分阶段', 'zh-hant': '劃分階段', ja: '分割段階', ru: 'Разделение' },
  conquer: { en: 'Conquer', zh: '合并阶段', 'zh-hant': '合併階段', ja: '統合段階', ru: 'Объединение' },
  before: { en: 'Before division', zh: '划分前', 'zh-hant': '劃分前', ja: '分割前', ru: 'Без разбиения' },
  after: { en: 'After division', zh: '划分后', 'zh-hant': '劃分後', ja: '分割後', ru: 'С разбиением' },
  ops: { en: 'operations', zh: '操作数量', 'zh-hant': '操作數量', ja: '操作回数', ru: 'число операций' },
  unordered: { en: 'Unordered data', zh: '无序数据', 'zh-hant': '無序資料', ja: '未ソートのデータ', ru: 'Неупорядоченные данные' },
  ordered: { en: 'Ordered data', zh: '有序数据', 'zh-hant': '有序資料', ja: 'ソート済みのデータ', ru: 'Упорядоченные данные' },
  core: { en: 'core', zh: '核心', 'zh-hant': '核心', ja: 'コア', ru: 'ядро' },
  stack: { en: 'call stack', zh: '调用栈', 'zh-hant': '呼叫堆疊', ja: '呼び出しスタック', ru: 'стек вызовов' },
  root: { en: 'root node', zh: '根节点', 'zh-hant': '根節點', ja: '根ノード', ru: 'корневой узел' },
  leftSub: { en: 'left subtree', zh: '左子树', 'zh-hant': '左子樹', ja: '左部分木', ru: 'левое поддерево' },
  rightSub: { en: 'right subtree', zh: '右子树', 'zh-hant': '右子樹', ja: '右部分木', ru: 'правое поддерево' },
  current: { en: 'current tree', zh: '当前树', 'zh-hant': '當前樹', ja: '現在の木', ru: 'текущее дерево' },
  pre: { en: 'Preorder traversal', zh: '前序遍历', 'zh-hant': '前序走訪', ja: '前順走査', ru: 'Прямой обход' },
  in: { en: 'Inorder traversal', zh: '中序遍历', 'zh-hant': '中序走訪', ja: '中順走査', ru: 'Симметричный обход' },
  build: { en: 'Build binary tree', zh: '构建二叉树', 'zh-hant': '構建二元樹', ja: '二分木を構築', ru: 'Построить дерево' },
  one: { en: '1 node', zh: '1 个节点', 'zh-hant': '1 個節點', ja: 'ノード 1 個', ru: '1 узел' },
  three: { en: '3 nodes', zh: '3 个节点', 'zh-hant': '3 個節點', ja: 'ノード 3 個', ru: '3 узла' },
  moves: { en: 'moves', zh: '移动次数', 'zh-hant': '移動次數', ja: '移動回数', ru: 'перемещений' },
  moveAll: { en: 'Move all disks from A to C', zh: '将所有圆盘从 A 移至 C', 'zh-hant': '將所有圓盤從 A 移至 C', ja: 'すべての円盤を A から C へ移す', ru: 'Переместить все диски с A на C' },
  original: { en: 'Original problem', zh: '原问题', 'zh-hant': '原問題', ja: '元の問題', ru: 'Исходная задача' },
  found: { en: 'Found: index', zh: '找到：索引', 'zh-hant': '找到：索引', ja: '発見：インデックス', ru: 'Найден: индекс' },
  left: { en: 'left', zh: '左', 'zh-hant': '左', ja: '左', ru: 'левым' },
  right: { en: 'right', zh: '右', 'zh-hant': '右', ja: '右', ru: 'правым' },
} satisfies Record<string, T>;

// ── 1. Merge sort: divide down, merge back up ─────────────────────────

const MS = [7, 3, 2, 6, 0, 1, 5, 4];
/** Group size in each row: 8 → 4 → 2 → 1 on the way down, then 2 → 4 → 8 while merging. */
const MS_GROUP = [8, 4, 2, 1, 2, 4, 8];
const MS_CW = 26;
const MS_CG = 3;
const MS_GG = 12;
const MS_H = 26;
const MS_CX = 164;
const msRowY = (r: number) => 12 + r * 52;

const msValues = (r: number) => {
  const g = MS_GROUP[r];
  if (r <= 3) return MS;
  const out: number[] = [];
  for (let k = 0; k < MS.length; k += g) out.push(...MS.slice(k, k + g).sort((a, b) => a - b));
  return out;
};

const msCellX = (r: number, p: number) => {
  const g = MS_GROUP[r];
  const width = 8 * MS_CW + 7 * MS_CG + (8 / g - 1) * MS_GG;
  return MS_CX - width / 2 + p * (MS_CW + MS_CG) + Math.floor(p / g) * MS_GG;
};

const MS_SAY: Record<'start' | 'd1' | 'd2' | 'base' | 'm1' | 'm2' | 'done', T> = {
  start: {
    en: 'The original problem: sort this array of 8 numbers.',
    zh: '原问题：对这个包含 8 个数字的数组排序。',
    'zh-hant': '原問題：對這個包含 8 個數字的陣列排序。',
    ja: '元の問題：8 個の数からなるこの配列をソートします。',
    ru: 'Исходная задача: отсортировать этот массив из 8 чисел.',
  },
  d1: {
    en: 'Divide: split the array at its midpoint into two subarrays of 4.',
    zh: '分：从中点将数组划分为两个长度为 4 的子数组。',
    'zh-hant': '分：從中點將陣列劃分為兩個長度為 4 的子陣列。',
    ja: '分：配列を中点で長さ 4 の 2 つの部分配列に分けます。',
    ru: 'Разделение: делим массив посередине на два подмассива по 4 элемента.',
  },
  d2: {
    en: 'Divide again: each subarray splits into two of length 2.',
    zh: '继续划分：每个子数组再分成两个长度为 2 的子数组。',
    'zh-hant': '繼續劃分：每個子陣列再分成兩個長度為 2 的子陣列。',
    ja: 'さらに分割：各部分配列を長さ 2 の 2 つに分けます。',
    ru: 'Делим дальше: каждый подмассив распадается на два длины 2.',
  },
  base: {
    en: 'Every subarray now has one element. This is the smallest subproblem, and its solution is known: it is already sorted.',
    zh: '每个子数组只剩一个元素，这就是最小子问题，它的解是已知的：本身就是有序的。',
    'zh-hant': '每個子陣列只剩一個元素，這就是最小子問題，它的解是已知的：本身就是有序的。',
    ja: 'どの部分配列も要素が 1 つになりました。これが最小の部分問題で、解は既知です。すでにソート済みです。',
    ru: 'В каждом подмассиве остался один элемент. Это наименьшая подзадача, и её решение известно: она уже отсортирована.',
  },
  m1: {
    en: 'Conquer: merge neighbouring subarrays from bottom to top, keeping them sorted. First into sorted pairs.',
    zh: '治：从底至顶合并相邻的子数组，并保持有序。先合并成有序的两两一组。',
    'zh-hant': '治：從底至頂合併相鄰的子陣列，並保持有序。先合併成有序的兩兩一組。',
    ja: '治：隣り合う部分配列を下から上へ、順序を保ちながら統合します。まずソート済みの 2 個組に。',
    ru: 'Объединение: снизу вверх сливаем соседние подмассивы, сохраняя порядок. Сначала в отсортированные пары.',
  },
  m2: {
    en: 'Merge the sorted pairs into two sorted subarrays of 4.',
    zh: '将有序的两两一组合并为两个长度为 4 的有序子数组。',
    'zh-hant': '將有序的兩兩一組合併為兩個長度為 4 的有序子陣列。',
    ja: 'ソート済みの組を統合して、長さ 4 のソート済み部分配列 2 つにします。',
    ru: 'Сливаем отсортированные пары в два отсортированных подмассива по 4.',
  },
  done: {
    en: 'The last merge yields the sorted array: the solution of the original problem.',
    zh: '最后一次合并得到有序数组，即原问题的解。',
    'zh-hant': '最後一次合併得到有序陣列，即原問題的解。',
    ja: '最後の統合でソート済みの配列、つまり元の問題の解が得られます。',
    ru: 'Последнее слияние даёт отсортированный массив — решение исходной задачи.',
  },
};

const mergeSort: StepFigure = {
  type: 'steps',
  call: 'merge_sort([7, 3, 2, 6, 0, 1, 5, 4])',
  tones: { divide: 'cmp', base: 'swp', merge: 'done', done: 'done' },
  build(l) {
    const scene = (cur: number) => {
      const nodes: SceneNode[] = [];
      for (let r = 0; r <= cur; r++) {
        const g = MS_GROUP[r];
        const vals = msValues(r);
        const y = msRowY(r);
        const active = r === cur;
        const tone: Tone = active ? (r === 3 ? 'warn' : r === 6 ? 'ok' : 'accent') : r >= 4 ? 'ok' : 'idle';
        for (let gi = 0; gi < 8 / g; gi++) {
          const x = msCellX(r, gi * g);
          nodes.push(region(`g${r}.${gi}`, x - 3, y - 3, g * MS_CW + (g - 1) * MS_CG + 6, MS_H + 6, { tone: active ? 'accent' : 'idle' }));
        }
        vals.forEach((v, p) => nodes.push(box(`c${r}.${p}`, msCellX(r, p), y, v, { w: MS_CW, h: MS_H, size: 13, tone })));
        if (r === 0) continue;
        if (r <= 3) {
          // Each group points down to its two halves.
          for (let gi = 0; gi < 8 / g; gi++) {
            const parent = Math.floor((gi * g) / MS_GROUP[r - 1]) * MS_GROUP[r - 1];
            const px = msCellX(r - 1, parent) + (MS_GROUP[r - 1] * (MS_CW + MS_CG) - MS_CG) / 2;
            const cx = msCellX(r, gi * g) + (g * (MS_CW + MS_CG) - MS_CG) / 2;
            nodes.push(arrow(`a${r}.${gi}`, [px, msRowY(r - 1) + MS_H + 4], [cx, y - 5], { width: 1.25, dim: !active }));
          }
        } else {
          // Each element travels to its place in the merged group.
          const prev = msValues(r - 1);
          prev.forEach((v, p) => {
            const q = vals.indexOf(v);
            nodes.push(
              arrow(`a${r}.${p}`, [msCellX(r - 1, p) + MS_CW / 2, msRowY(r - 1) + MS_H + 4], [msCellX(r, q) + MS_CW / 2, y - 4], {
                width: 1.25,
                head: 'none',
                tone: active ? 'accent' : undefined,
                dim: !active,
              }),
            );
          });
        }
      }
      const bx = 330;
      // The base row belongs to both stages: the divide brace ends at its middle once merging starts.
      const dEnd = cur >= 4 ? msRowY(3) + MS_H / 2 - 2 : msRowY(cur) + MS_H;
      nodes.push(brace('br:div', msRowY(0), dEnd, bx, 'right', 'info'));
      nodes.push(text('t:div', bx + 22, (msRowY(0) + dEnd) / 2 + 4, WORD.divide[l], { size: 12, bold: true, tone: 'info' }));
      if (cur >= 4) {
        const cStart = msRowY(3) + MS_H / 2 + 2;
        const cEnd = msRowY(cur) + MS_H;
        nodes.push(brace('br:con', cStart, cEnd, bx, 'right', 'ok'));
        nodes.push(text('t:con', bx + 22, (cStart + cEnd) / 2 + 4, WORD.conquer[l], { size: 12, bold: true, tone: 'ok' }));
      }
      return { w: W, h: msRowY(6) + MS_H + 10, nodes };
    };
    const S = MS_SAY;
    const frames: SceneFrame[] = [
      { kind: 'divide', scene: scene(0), say: S.start[l] },
      { kind: 'divide', scene: scene(1), say: S.d1[l] },
      { kind: 'divide', scene: scene(2), say: S.d2[l] },
      { kind: 'base', scene: scene(3), say: S.base[l] },
      { kind: 'merge', scene: scene(4), say: S.m1[l] },
      { kind: 'merge', scene: scene(5), say: S.m2[l] },
      { kind: 'done', scene: scene(6), say: S.done[l] },
    ];
    return { frames };
  },
};

// ── 2. Bubble sort before and after dividing the array ───────────────

const BUB_SAY: Record<'start' | 'sortL' | 'split' | 'sortR' | 'merge', T> = {
  start: {
    en: 'Sort 8 numbers with bubble sort: on the left directly, on the right after dividing the array at its midpoint.',
    zh: '用冒泡排序对 8 个数字排序：左边直接排序，右边先从中点把数组划分为两半。',
    'zh-hant': '用泡沫排序對 8 個數字排序：左邊直接排序，右邊先從中點把陣列劃分為兩半。',
    ja: '8 個の数をバブルソートでソートします。左はそのまま、右は配列を中央で 2 つに分割してから行います。',
    ru: 'Сортируем 8 чисел пузырьком: слева сразу, справа — после разбиения массива посередине.',
  },
  sortL: {
    en: 'Bubble sort on the whole array takes about n² = 64 operations.',
    zh: '对整个数组做冒泡排序，大约需要 n² = 64 次操作。',
    'zh-hant': '對整個陣列做泡沫排序，大約需要 n² = 64 次操作。',
    ja: '配列全体をバブルソートすると、およそ n² = 64 回の操作が必要です。',
    ru: 'Пузырьковая сортировка всего массива требует около n² = 64 операций.',
  },
  split: {
    en: 'On the right, dividing the array into two halves takes n = 8 operations.',
    zh: '右边：将数组划分为两半，需要 n = 8 次操作。',
    'zh-hant': '右邊：將陣列劃分為兩半，需要 n = 8 次操作。',
    ja: '右側：配列を 2 つに分割するのに n = 8 回の操作がかかります。',
    ru: 'Справа: разбиение массива на две половины стоит n = 8 операций.',
  },
  sortR: {
    en: 'Bubble sort each half: (n/2)² = 16 operations each, 32 for both.',
    zh: '分别对两半做冒泡排序：每半 (n/2)² = 16 次，共 32 次。',
    'zh-hant': '分別對兩半做泡沫排序：每半 (n/2)² = 16 次，共 32 次。',
    ja: '各半分をバブルソートします。それぞれ (n/2)² = 16 回、合わせて 32 回です。',
    ru: 'Сортируем каждую половину пузырьком: по (n/2)² = 16 операций, вместе 32.',
  },
  merge: {
    en: 'Merging the two sorted halves takes n = 8 more: 48 in total, fewer than 64. In general n²/2 + 2n < n² whenever n > 4.',
    zh: '合并两个有序的半数组再需 n = 8 次：共 48 次，少于 64 次。一般地，当 n > 4 时 n²/2 + 2n < n²。',
    'zh-hant': '合併兩個有序的半陣列再需 n = 8 次：共 48 次，少於 64 次。一般地，當 n > 4 時 n²/2 + 2n < n²。',
    ja: 'ソート済みの 2 つの半分の統合にさらに n = 8 回。合計 48 回で 64 回より少なくなります。一般に n > 4 なら n²/2 + 2n < n² です。',
    ru: 'Слияние двух отсортированных половин — ещё n = 8: всего 48, меньше 64. В общем случае n²/2 + 2n < n² при n > 4.',
  },
};

const bubbleSort: StepFigure = {
  type: 'steps',
  tones: { start: 'idle', sortL: 'swp', split: 'cmp', sortR: 'swp', merge: 'done' },
  build(l) {
    const cw = 20;
    const gap = 2;
    const ch = 22;
    const arr = MS;
    const sorted = [...MS].sort((a, b) => a - b);
    const lx = 103;
    const rx = 333;
    const row = (prefix: string, cx: number, y: number, vals: number[], tone: Tone) => {
      const x0 = cx - rowWidth(vals.length, cw, gap) / 2;
      return cells(
        prefix,
        x0,
        y,
        vals.map((v) => ({ value: v, tone })),
        { w: cw, h: ch, gap, size: 12 },
      );
    };
    const Y0 = 34;
    const Y1 = 112;
    const Y2 = 192;
    const Y3 = 300;
    const hl = 281;
    const hr = 385;
    const scene = (step: number) => {
      const nodes: SceneNode[] = [
        arrow('div', [220, 8], [220, 362], { head: 'none', dashed: true, tone: 'muted', width: 1 }),
        text('h:l', lx, 18, WORD.before[l], { anchor: 'middle', size: 13, bold: true }),
        text('h:r', rx, 18, WORD.after[l], { anchor: 'middle', size: 13, bold: true }),
        ...row('L0.', lx, Y0, arr, 'idle'),
        ...row('R0.', rx, Y0, arr, 'idle'),
      ];
      let opsL = false;
      let opsR = '';
      if (step >= 1) {
        nodes.push(
          arrow('aL', [lx, Y0 + ch + 3], [lx, Y3 - 4]),
          chip('kL', lx, (Y0 + Y3) / 2 - 4, seg('n² = ', ['64', 'warn', true]), { size: 12 }),
          ...row('L3.', lx, Y3, sorted, 'ok'),
        );
        opsL = true;
      }
      if (step >= 2) {
        nodes.push(
          arrow('aS1', [rx, Y0 + ch + 3], [hl, Y1 - 4], { via: [[rx, 74], [hl, 74]] }),
          arrow('aS2', [rx, Y0 + ch + 3], [hr, Y1 - 4], { via: [[rx, 74], [hr, 74]] }),
          chip('kS', rx, 80, seg('n = ', ['8', 'info', true]), { size: 12 }),
          ...row('R1a.', hl, Y1, arr.slice(0, 4), step === 2 ? 'accent' : 'idle'),
          ...row('R1b.', hr, Y1, arr.slice(4), step === 2 ? 'accent' : 'idle'),
        );
        opsR = '8';
      }
      if (step >= 3) {
        const half = (k: number) => [...arr.slice(k * 4, k * 4 + 4)].sort((a, b) => a - b);
        nodes.push(
          arrow('aB1', [hl, Y1 + ch + 3], [hl, Y2 - 4]),
          arrow('aB2', [hr, Y1 + ch + 3], [hr, Y2 - 4]),
          chip('kB1', hl, (Y1 + ch + Y2) / 2 - 14, seg('(n/2)² = ', ['16', 'warn', true]), { size: 12 }),
          chip('kB2', hr, (Y1 + ch + Y2) / 2 - 14, seg('(n/2)² = ', ['16', 'warn', true]), { size: 12 }),
          ...row('R2a.', hl, Y2, half(0), 'ok'),
          ...row('R2b.', hr, Y2, half(1), 'ok'),
        );
        opsR = '8 + 16 + 16 = 40';
      }
      if (step >= 4) {
        nodes.push(
          arrow('aM1', [hl, Y2 + ch + 3], [rx, 246], { via: [[hl, 246]], head: 'none' }),
          arrow('aM2', [hr, Y2 + ch + 3], [rx, 246], { via: [[hr, 246]], head: 'none' }),
          arrow('aM', [rx, 246], [rx, Y3 - 4]),
          chip('kM', rx, 252, seg('n = ', ['8', 'info', true]), { size: 12 }),
          ...row('R3.', rx, Y3, sorted, 'ok'),
        );
        opsR = '8 + 16 + 16 + 8 = 48';
      }
      if (opsL) {
        nodes.push(text('o:l', lx, 344, WORD.ops[l], { anchor: 'middle', size: 12, tone: 'muted' }));
        nodes.push(text('o:lv', lx, 364, seg(['64', 'warn', true]), { anchor: 'middle', mono: true, size: 14 }));
      }
      if (opsR) {
        const [sum, total] = opsR.split(' = ');
        nodes.push(text('o:r', rx, 344, WORD.ops[l], { anchor: 'middle', size: 12, tone: 'muted' }));
        nodes.push(text('o:rv', rx, 364, total ? seg(`${sum} = `, [total, step === 4 ? 'ok' : 'info', true]) : seg([sum, 'info', true]), { anchor: 'middle', mono: true, size: 14 }));
      }
      return { w: W, h: 374, nodes };
    };
    const S = BUB_SAY;
    return {
      frames: [
        { kind: 'start', scene: scene(0), say: S.start[l] },
        { kind: 'sortL', scene: scene(1), say: S.sortL[l] },
        { kind: 'split', scene: scene(2), say: S.split[l] },
        { kind: 'sortR', scene: scene(3), say: S.sortR[l] },
        { kind: 'merge', scene: scene(4), say: S.merge[l] },
      ],
    };
  },
};

// ── 3. Parallel computing: buckets sorted on separate cores ──────────

const PAR_DATA = [27, 4, 45, 13, 38, 9, 31, 2, 49, 18, 36, 22];
const PAR_TONES: Tone[] = ['danger', 'warn', 'info', 'ok'];
const parBucket = (v: number) => Math.min(3, Math.floor(v / 12.5));

const PAR_NOTE: T = {
  en: 'The data is spread evenly over 4 buckets. The buckets do not depend on each other, so each one is sorted on its own core at the same time; then the results are joined in order.',
  zh: '数据被平均分配到 4 个桶中。各个桶互不依赖，因此可以同时在不同的核心上排序，完成后再按顺序合并结果。',
  'zh-hant': '資料被平均分配到 4 個桶中。各個桶互不依賴，因此可以同時在不同的核心上排序，完成後再按順序合併結果。',
  ja: 'データを 4 つのバケットに均等に振り分けます。バケット同士は独立しているので、それぞれを別のコアで同時にソートし、最後に結果を順に統合します。',
  ru: 'Данные равномерно распределяются по 4 блокам. Блоки не зависят друг от друга, поэтому каждый сортируется на своём ядре одновременно, а затем результаты объединяются по порядку.',
};

const parallelComputing: StaticFigure = {
  type: 'static',
  build(l) {
    const cw = 28;
    const cg = 4;
    const x0 = (W - rowWidth(12, cw, cg)) / 2;
    const buckets = [0, 1, 2, 3].map((b) => PAR_DATA.filter((v) => parBucket(v) === b));
    const sorted = [...PAR_DATA].sort((a, b) => a - b);
    const bw = 100;
    const bx = (b: number) => 5 + b * 108;
    const by = 98;
    const nodes: SceneNode[] = [
      region('src', x0 - 6, 24, rowWidth(12, cw, cg) + 12, 40, { tone: 'idle', label: WORD.unordered[l] }),
      ...cells(
        'u',
        x0,
        30,
        PAR_DATA.map((v) => ({ value: v, tone: PAR_TONES[parBucket(v)] })),
        { w: cw, h: 28, gap: cg, size: 13 },
      ),
      region('cpu', 4, 170, W - 8, 66, { tone: 'idle' }),
      region('dst', x0 - 6, 266, rowWidth(12, cw, cg) + 12, 40, { tone: 'idle' }),
      text('dst:l', W / 2, 326, WORD.ordered[l], { anchor: 'middle', size: 13, bold: true, tone: 'muted' }),
    ];
    buckets.forEach((items, b) => {
      const tone = PAR_TONES[b];
      const left = bx(b);
      const cx = left + bw / 2;
      nodes.push(region(`b${b}`, left, by, bw, 44, { tone }), arrow(`in${b}`, [cx, 66], [cx, by - 3], { tone, width: 1.5 }));
      items.forEach((v, k) => {
        const x = left + 7 + k * (26 + 4);
        nodes.push(box(`b${b}.${v}`, x, by + 8, v, { w: 26, h: 28, size: 13, tone }));
      });
      nodes.push(arrow(`link${b}`, [cx, by + 46], [cx, 176], { head: 'none', dashed: true, tone, width: 1.25 }));
      nodes.push({ kind: 'icon', id: `core${b}`, x: cx - 15, y: 178, size: 30, icon: 'cpu', tone });
      nodes.push(text(`core${b}:l`, cx, 226, `${WORD.core[l]} ${b + 1}`, { anchor: 'middle', size: 12, bold: true, tone }));
      const first = sorted.indexOf(Math.min(...items));
      const segMid = cellX(x0, first, cw, cg) + rowWidth(items.length, cw, cg) / 2;
      nodes.push(arrow(`out${b}`, [cx, 238], [segMid, 268], { tone, width: 1.5 }));
    });
    nodes.push(
      ...cells(
        'o',
        x0,
        272,
        sorted.map((v) => ({ value: v, tone: PAR_TONES[parBucket(v)] })),
        { w: cw, h: 28, gap: cg, size: 13 },
      ),
    );
    return { scene: { w: W, h: 334, nodes }, notes: [PAR_NOTE[l]] };
  },
};

// ── 4. Binary search as divide and conquer ────────────────────────────

const BS_NUMS = [1, 3, 6, 8, 12, 15, 23, 26, 31, 35];
const BS_TARGET = 6;

const BS_SAY: Record<'mid' | 'left' | 'right' | 'hit' | 'found', T> = {
  mid: {
    en: 'f({i}, {j}): the midpoint of [{i}, {j}] is m = {m}. Compare nums[{m}] = {v} with the target {t}.',
    zh: 'f({i}, {j})：区间 [{i}, {j}] 的中点为 m = {m}。比较 nums[{m}] = {v} 与目标元素 {t}。',
    'zh-hant': 'f({i}, {j})：區間 [{i}, {j}] 的中點為 m = {m}。比較 nums[{m}] = {v} 與目標元素 {t}。',
    ja: 'f({i}, {j})：区間 [{i}, {j}] の中点は m = {m}。nums[{m}] = {v} を目標要素 {t} と比べます。',
    ru: 'f({i}, {j}): середина интервала [{i}, {j}] — m = {m}. Сравниваем nums[{m}] = {v} с целевым элементом {t}.',
  },
  left: {
    en: '{v} > {t}, so the target can only be in the left half. Recurse into the subproblem f({i}, {j}).',
    zh: '{v} > {t}，目标只可能在左半部分。递归求解子问题 f({i}, {j})。',
    'zh-hant': '{v} > {t}，目標只可能在左半部分。遞迴求解子問題 f({i}, {j})。',
    ja: '{v} > {t} なので、目標は左半分にしかありません。部分問題 f({i}, {j}) を再帰的に解きます。',
    ru: '{v} > {t}, значит, цель может быть только в левой половине. Рекурсивно решаем подзадачу f({i}, {j}).',
  },
  right: {
    en: '{v} < {t}, so the target can only be in the right half. Recurse into the subproblem f({i}, {j}).',
    zh: '{v} < {t}，目标只可能在右半部分。递归求解子问题 f({i}, {j})。',
    'zh-hant': '{v} < {t}，目標只可能在右半部分。遞迴求解子問題 f({i}, {j})。',
    ja: '{v} < {t} なので、目標は右半分にしかありません。部分問題 f({i}, {j}) を再帰的に解きます。',
    ru: '{v} < {t}, значит, цель может быть только в правой половине. Рекурсивно решаем подзадачу f({i}, {j}).',
  },
  hit: {
    en: 'f(2, 3): m = 2 and nums[2] = 6 is the target.',
    zh: 'f(2, 3)：m = 2，nums[2] = 6 正是目标元素。',
    'zh-hant': 'f(2, 3)：m = 2，nums[2] = 6 正是目標元素。',
    ja: 'f(2, 3)：m = 2 で、nums[2] = 6 がまさに目標要素です。',
    ru: 'f(2, 3): m = 2, и nums[2] = 6 — это и есть целевой элемент.',
  },
  found: {
    en: 'Return m = 2. Each call hands 2 back to its caller unchanged, so no merging is needed: the index of 6 is 2.',
    zh: '返回 m = 2。每层调用把 2 原样返回给上一层，无须合并子问题的解：元素 6 的索引为 2。',
    'zh-hant': '回傳 m = 2。每層呼叫把 2 原樣回傳給上一層，無須合併子問題的解：元素 6 的索引為 2。',
    ja: 'm = 2 を返します。各呼び出しは 2 をそのまま呼び出し元へ返すので、解の統合は不要です。要素 6 のインデックスは 2 です。',
    ru: 'Возвращаем m = 2. Каждый вызов просто передаёт 2 наверх, объединять решения не нужно: индекс элемента 6 равен 2.',
  },
};

const binarySearchRecur: StepFigure = {
  type: 'steps',
  call: 'binary_search(nums, 6)',
  tones: { mid: 'cmp', left: 'swp', right: 'swp', found: 'done' },
  sources: funcSources(BSR_PY, BSR_JAVA, ['dfs'], {
    python: {
      mid: ['m = (i + j) // 2'],
      left: ['return dfs(nums, target, i, m - 1)'],
      right: ['return dfs(nums, target, m + 1, j)'],
      found: ['return m'],
    },
    java: {
      mid: ['int m = (i + j) / 2;'],
      left: ['return dfs(nums, target, i, m - 1);'],
      right: ['return dfs(nums, target, m + 1, j);'],
      found: ['return m;'],
    },
  }),
  build(l) {
    const calls: [number, number][] = [
      [0, 9],
      [0, 3],
      [2, 3],
    ];
    const mOf = ([i, j]: [number, number]) => Math.floor((i + j) / 2);
    const cw = 30;
    const cg = 3;
    const x0 = 104;
    const rowY = (k: number) => 32 + k * 72;
    /** `rows`: calls shown; `mids`: how many of them already computed m; `found`: the search is over. */
    const scene = (rows: number, mids: number, found: boolean) => {
      const nodes: SceneNode[] = [
        text('target', 8, 20, seg('target = ', [String(BS_TARGET), 'info', true]), { mono: true, size: 12 }),
        ...indices('ix', x0, 20, BS_NUMS.map((_, k) => k), { w: cw, gap: cg }),
      ];
      for (let k = 0; k < rows; k++) {
        const [i, j] = calls[k];
        const y = rowY(k);
        const old = k < rows - 1 && !found;
        const m = k < mids ? mOf(calls[k]) : null;
        nodes.push(region(`band${k}`, cellX(x0, i, cw, cg) - 3, y - 3, rowWidth(j - i + 1, cw, cg) + 6, 36, { tone: 'accent', dim: old }));
        nodes.push(
          ...cells(
            `r${k}.`,
            x0,
            y,
            BS_NUMS.map((v, p) => {
              const inside = p >= i && p <= j;
              const hit = found && p === 2;
              const tone: Tone = hit ? 'ok' : p === m ? 'accent' : !inside ? 'muted' : v === BS_TARGET ? 'info' : 'idle';
              return { value: v, tone, ring: p === m && k === rows - 1, dim: (old && p !== m) || (!inside && !hit) };
            }),
            { w: cw, h: 30, gap: cg, size: 13 },
          ),
        );
        if (m !== null) {
          const cell = { x: cellX(x0, m, cw, cg), y, w: cw, h: 30 };
          nodes.push(...tag(`m${k}`, cell, 'm', { side: 'below', gap: 16, tone: 'danger' }));
        }
        const call = chip(`call${k}`, 8, y + 1, seg('f(', [String(i), 'accent', true], ', ', [String(j), 'accent', true], ')'), {
          align: 'start',
          size: 13,
          tone: found ? 'ok' : k === rows - 1 ? 'accent' : 'idle',
          ring: !found && k === rows - 1,
        });
        nodes.push(call);
        if (k > 0) nodes.push(arrow(`down${k}`, [8 + call.w / 2, rowY(k - 1) + 31], [8 + call.w / 2, y - 2], { tone: 'muted' }));
        if (found) nodes.push(text(`ret${k}`, 8 + call.w / 2, y + 48, seg('return ', ['2', 'ok', true]), { anchor: 'middle', mono: true, size: 11 }));
      }
      if (found) nodes.push(text('res', W / 2 + 40, rowY(2) + 76, seg(`${WORD.found[l]} `, ['2', 'ok', true]), { anchor: 'middle', size: 14, bold: true }));
      return { w: W, h: rowY(2) + 86, nodes };
    };
    const S = BS_SAY;
    const v = (k: number) => BS_NUMS[mOf(calls[k])];
    const midSay = (k: number) => fmt(S.mid[l], { i: calls[k][0], j: calls[k][1], m: mOf(calls[k]), v: v(k), t: BS_TARGET });
    const callOf = (k: number) => `dfs(nums, 6, ${calls[k][0]}, ${calls[k][1]})`;
    const frames: SceneFrame[] = [
      { kind: 'mid', scene: scene(1, 1, false), say: midSay(0), call: callOf(0) },
      { kind: 'left', scene: scene(2, 1, false), say: fmt(S.left[l], { v: v(0), t: BS_TARGET, i: 0, j: 3 }), call: callOf(1) },
      { kind: 'mid', scene: scene(2, 2, false), say: midSay(1), call: callOf(1) },
      { kind: 'right', scene: scene(3, 2, false), say: fmt(S.right[l], { v: v(1), t: BS_TARGET, i: 2, j: 3 }), call: callOf(2) },
      { kind: 'mid', scene: scene(3, 3, false), say: S.hit[l], call: callOf(2) },
      { kind: 'found', scene: scene(3, 3, true), say: S.found[l] },
    ];
    return { frames };
  },
};

// ── Building a binary tree from preorder and inorder ─────────────────

const PRE = [3, 9, 2, 1, 7];
const INO = [9, 3, 1, 2, 7];
/** Depth and slot (position within a complete level) of each value in the built tree. */
const SLOT: Record<number, [number, number]> = { 3: [0, 0], 9: [1, 0], 2: [1, 1], 1: [2, 2], 7: [2, 3] };
const PARENT: Record<number, number> = { 9: 3, 2: 3, 1: 2, 7: 2 };
const ROLE = { root: 'warn', left: 'info', right: 'accent' } as const satisfies Record<string, Tone>;
const ROLE_OF: Record<number, Tone> = { 3: ROLE.root, 9: ROLE.left, 2: ROLE.right, 1: ROLE.right, 7: ROLE.right };

const roleLegend = (l: Locale): LegendItem[] => [
  { tone: ROLE.root, text: WORD.root[l] },
  { tone: ROLE.left, text: WORD.leftSub[l] },
  { tone: ROLE.right, text: WORD.rightSub[l] },
];

/** The example tree: circles for `values` (default all) and edges to the children listed in `edges`. */
function exampleTree(
  lay: { left: number; width: number; top: number; gap: number; r: number },
  opts: { values?: number[]; edges?: number[]; tone?: (v: number) => Tone; ring?: (v: number) => boolean; edgeTone?: (v: number) => Tone | undefined } = {},
) {
  const values = opts.values ?? PRE;
  const edges = opts.edges ?? Object.keys(PARENT).map(Number);
  const boxes = new Map<number, BoxNode>();
  for (const v of values) {
    const [d, s] = SLOT[v];
    const cx = lay.left + ((s + 0.5) * lay.width) / 2 ** d;
    const cy = lay.top + d * lay.gap;
    boxes.set(v, box(`n${v}`, cx - lay.r, cy - lay.r, v, { w: lay.r * 2, h: lay.r * 2, shape: 'circle', size: 14, tone: opts.tone?.(v) ?? 'ok', ring: opts.ring?.(v) }));
  }
  const nodes: SceneNode[] = [];
  for (const v of edges) {
    const a = boxes.get(PARENT[v]);
    const b = boxes.get(v);
    if (a && b) nodes.push(link(`e${v}`, a, b, { pad: 2, width: 1.5, tone: opts.edgeTone?.(v) }));
  }
  nodes.push(...boxes.values());
  return { nodes, boxes };
}

/** Tone of preorder index `p` and inorder index `q` in the call that builds the tree rooted at preorder[i] over inorder[l..r]. */
function callRoles(i: number, l: number, r: number) {
  const m = INO.indexOf(PRE[i]);
  const left = m - l;
  const pre = (p: number): Tone | null => (p === i ? ROLE.root : p > i && p <= i + left ? ROLE.left : p > i + left && p <= i + (r - l) ? ROLE.right : null);
  const ino = (q: number): Tone | null => (q === m ? ROLE.root : q >= l && q < m ? ROLE.left : q > m && q <= r ? ROLE.right : null);
  return { m, pre, ino };
}

// ── 5. Example data ───────────────────────────────────────────────────

const buildTreeExample: StaticFigure = {
  type: 'static',
  build(l) {
    const tree = exampleTree({ left: 0, width: 180, top: 34, gap: 62, r: 17 });
    const x0 = 262;
    const nodes: SceneNode[] = [
      ...tree.nodes,
      arrow('build', [248, 112], [196, 112], { width: 3, tone: 'accent' }),
      text('build:l', 222, 96, WORD.build[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
      text('pre:l', x0, 24, WORD.pre[l], { size: 12, bold: true, tone: 'muted' }),
      text('pre:c', x0, 42, 'preorder', { mono: true, size: 12 }),
      ...cells(
        'p',
        x0,
        50,
        PRE.map((v) => ({ value: v })),
        { w: 30, h: 30, gap: 3, size: 14 },
      ),
      text('in:l', x0, 122, WORD.in[l], { size: 12, bold: true, tone: 'muted' }),
      text('in:c', x0, 140, 'inorder', { mono: true, size: 12 }),
      ...cells(
        'i',
        x0,
        148,
        INO.map((v) => ({ value: v })),
        { w: 30, h: 30, gap: 3, size: 14 },
      ),
    ];
    return { scene: { w: W, h: 196, nodes } };
  },
};

// ── 6. Dividing preorder and inorder at the root ─────────────────────

const DIV_SAY: Record<'root' | 'find' | 'split', T> = {
  root: {
    en: 'The first element of preorder, 3, is the value of the root node.',
    zh: '前序遍历的首元素 3 是根节点的值。',
    'zh-hant': '前序走訪的首元素 3 是根節點的值。',
    ja: '前順走査の先頭要素 3 が根ノードの値です。',
    ru: 'Первый элемент прямого обхода, 3, — значение корневого узла.',
  },
  find: {
    en: 'Find 3 in inorder (index 1). It divides inorder into [ 9 | 3 | 1 2 7 ]: the left subtree has 1 node, the right subtree 3.',
    zh: '在 inorder 中找到 3（索引 1），它将 inorder 划分为 [ 9 | 3 | 1 2 7 ]：左子树有 1 个节点，右子树有 3 个。',
    'zh-hant': '在 inorder 中找到 3（索引 1），它將 inorder 劃分為 [ 9 | 3 | 1 2 7 ]：左子樹有 1 個節點，右子樹有 3 個。',
    ja: 'inorder で 3 を探します（インデックス 1）。inorder は [ 9 | 3 | 1 2 7 ] に分かれ、左部分木はノード 1 個、右部分木は 3 個です。',
    ru: 'Находим 3 в inorder (индекс 1). Он делит inorder на [ 9 | 3 | 1 2 7 ]: в левом поддереве 1 узел, в правом — 3.',
  },
  split: {
    en: 'With those sizes, preorder divides into [ 3 | 9 | 2 1 7 ]: root node, left subtree, right subtree.',
    zh: '根据节点数量，preorder 被划分为 [ 3 | 9 | 2 1 7 ]：根节点、左子树、右子树。',
    'zh-hant': '根據節點數量，preorder 被劃分為 [ 3 | 9 | 2 1 7 ]：根節點、左子樹、右子樹。',
    ja: 'このノード数から、preorder は [ 3 | 9 | 2 1 7 ]、つまり根ノード・左部分木・右部分木に分かれます。',
    ru: 'По этим размерам preorder делится на [ 3 | 9 | 2 1 7 ]: корень, левое поддерево, правое поддерево.',
  },
};

const preorderInorderDivision: StepFigure = {
  type: 'steps',
  tones: { root: 'cmp', find: 'cmp', split: 'done' },
  build(l) {
    const x0 = 196;
    const cw = 30;
    const cg = 4;
    const preY = 58;
    const inY = 136;
    const span = (a: number, b: number) => [cellX(x0, a, cw, cg), cellX(x0, b, cw, cg) + cw] as const;
    const scene = (step: number) => {
      const roles = callRoles(0, 0, 4);
      const tree = exampleTree(
        { left: 0, width: 160, top: 46, gap: 62, r: 16 },
        { tone: (v) => (step === 0 ? (v === 3 ? ROLE.root : 'idle') : ROLE_OF[v]), ring: (v) => v === 3 && step === 0 },
      );
      const nodes: SceneNode[] = [
        ...tree.nodes,
        text('pre:c', 370, preY + 19, 'preorder', { mono: true, size: 12, tone: 'muted' }),
        text('in:c', 370, inY + 19, 'inorder', { mono: true, size: 12, tone: 'muted' }),
        ...cells(
          'p',
          x0,
          preY,
          PRE.map((v, p) => ({ value: v, tone: step === 0 ? (p === 0 ? ROLE.root : 'idle') : step === 1 ? (p === 0 ? ROLE.root : 'idle') : (roles.pre(p) ?? 'idle'), ring: step === 0 && p === 0 })),
          { w: cw, h: 30, gap: cg, size: 14 },
        ),
        ...cells(
          'i',
          x0,
          inY,
          INO.map((v, q) => ({ value: v, tone: step === 0 ? 'idle' : (roles.ino(q) ?? 'idle'), ring: step === 1 && q === 1 })),
          { w: cw, h: 30, gap: cg, size: 14 },
        ),
      ];
      if (step >= 1) {
        const from = cellX(x0, 0, cw, cg) + cw / 2;
        const to = cellX(x0, 1, cw, cg) + cw / 2;
        nodes.push(arrow('find', [from, preY + 33], [to, inY - 4], { bend: 14, tone: ROLE.root, dashed: true }));
        const [a1, b1] = span(0, 0);
        const [a2, b2] = span(2, 4);
        nodes.push(
          brace('in:bl', a1, b1, inY + 34, 'down', ROLE.left),
          brace('in:br', a2, b2, inY + 34, 'down', ROLE.right),
          text('in:tl', (a1 + b1) / 2, inY + 68, WORD.one[l], { anchor: 'middle', size: 12, bold: true, tone: ROLE.left }),
          text('in:tr', (a2 + b2) / 2, inY + 68, WORD.three[l], { anchor: 'middle', size: 12, bold: true, tone: ROLE.right }),
        );
      }
      if (step >= 2) {
        const [a1, b1] = span(1, 1);
        const [a2, b2] = span(2, 4);
        nodes.push(
          brace('pre:bl', a1, b1, preY - 4, 'up', ROLE.left),
          brace('pre:br', a2, b2, preY - 4, 'up', ROLE.right),
          text('pre:tl', (a1 + b1) / 2, preY - 26, WORD.one[l], { anchor: 'middle', size: 12, bold: true, tone: ROLE.left }),
          text('pre:tr', (a2 + b2) / 2, preY - 26, WORD.three[l], { anchor: 'middle', size: 12, bold: true, tone: ROLE.right }),
        );
      }
      return { w: W, h: 216, nodes };
    };
    const S = DIV_SAY;
    return {
      frames: [
        { kind: 'root', scene: scene(0), say: S.root[l] },
        { kind: 'find', scene: scene(1), say: S.find[l] },
        { kind: 'split', scene: scene(2), say: S.split[l] },
      ],
      legend: roleLegend(l),
    };
  },
};

// ── 7. Index variables for the root and both subtrees ────────────────

const VAR_TONE = { i: 'warn', l: 'info', r: 'accent', m: 'danger' } as const satisfies Record<string, Tone>;

/** A formula with the variables i, l, r, m colored, e.g. `i+1+(m-l)`. */
const formula = (s: string): Segment[] =>
  s.split(/([ilrm])/).flatMap((part): Segment[] => {
    if (!part) return [];
    const tone = VAR_TONE[part as keyof typeof VAR_TONE];
    return tone ? [{ t: part, tone, bold: true }] : [{ t: part }];
  });

const DIV_PTR_NOTE: T = {
  en: '(m − l) is the number of nodes in the left subtree, so the right subtree starts that many places after i + 1 in preorder.',
  zh: '(m − l) 表示左子树的节点数量，因此右子树的根节点在 preorder 中位于 i + 1 之后再跳过这么多个位置。',
  'zh-hant': '(m − l) 表示左子樹的節點數量，因此右子樹的根節點在 preorder 中位於 i + 1 之後再跳過這麼多個位置。',
  ja: '(m − l) は左部分木のノード数です。そのため右部分木の根は、preorder で i + 1 からその数だけ後ろにあります。',
  ru: '(m − l) — число узлов в левом поддереве, поэтому корень правого поддерева в preorder стоит на столько позиций дальше i + 1.',
};

const divisionPointers: StaticFigure = {
  type: 'static',
  build(l) {
    const x0 = 168;
    const cw = 44;
    const cg = 12;
    const preY = 40;
    const inY = 134;
    const roles = callRoles(0, 0, 4);
    const tree = exampleTree({ left: 0, width: 160, top: 44, gap: 66, r: 17 }, { tone: (v) => ROLE_OF[v] });
    const cell = (y: number, k: number) => ({ x: cellX(x0, k, cw, cg), y, w: cw, h: 32 });
    const nodes: SceneNode[] = [
      ...tree.nodes,
      text('pre:c', x0, preY - 10, 'preorder', { mono: true, size: 12, tone: 'muted' }),
      text('in:c', x0, inY - 10, 'inorder', { mono: true, size: 12, tone: 'muted' }),
      ...cells(
        'p',
        x0,
        preY,
        PRE.map((v, p) => ({ value: v, tone: roles.pre(p) ?? 'idle' })),
        { w: cw, h: 32, gap: cg, size: 14 },
      ),
      ...cells(
        'i',
        x0,
        inY,
        INO.map((v, q) => ({ value: v, tone: roles.ino(q) ?? 'idle' })),
        { w: cw, h: 32, gap: cg, size: 14 },
      ),
      ...tag('t:i', cell(preY, 0), formula('i'), { gap: 16, tone: 'muted' }),
      ...tag('t:i1', cell(preY, 1), formula('i+1'), { gap: 16, tone: 'muted' }),
      // One row lower than its neighbour, so the two labels never touch.
      ...tag('t:i2', cell(preY, 2), formula('i+1+(m-l)'), { gap: 30, tone: 'muted' }),
      ...tag('t:l', cell(inY, 0), formula('l'), { gap: 16, tone: 'muted' }),
      ...tag('t:m', cell(inY, 1), formula('m'), { gap: 16, tone: 'muted' }),
      ...tag('t:r', cell(inY, 4), formula('r'), { gap: 16, tone: 'muted' }),
    ];
    // A small table: where each tree's root is in preorder, and its range in inorder.
    const ty = 222;
    const c2 = 214;
    const c3 = 336;
    nodes.push(
      region('tbl', 4, ty - 8, W - 8, 98, { tone: 'idle' }),
      text('th:p', c2, ty + 8, 'preorder', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
      text('th:i', c3, ty + 8, 'inorder', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
    );
    const rows: [Rich, Tone, string, string][] = [
      [WORD.current[l], 'idle', 'i', '[l, r]'],
      [WORD.leftSub[l], ROLE.left, 'i + 1', '[l, m-1]'],
      [WORD.rightSub[l], ROLE.right, 'i + 1 + (m - l)', '[m+1, r]'],
    ];
    rows.forEach(([label, tone, p, q], k) => {
      const y = ty + 30 + k * 22;
      nodes.push(
        text(`tr${k}`, 16, y, label, { size: 12, bold: true, tone: tone === 'idle' ? undefined : tone }),
        text(`tp${k}`, c2, y, formula(p), { anchor: 'middle', mono: true, size: 13 }),
        text(`tq${k}`, c3, y, formula(q), { anchor: 'middle', mono: true, size: 13 }),
      );
    });
    return { scene: { w: W, h: 316, nodes }, legend: roleLegend(l), notes: [DIV_PTR_NOTE[l]] };
  },
};

// ── 8. The recursive construction, step by step ──────────────────────

const BUILT_SAY: Record<'node' | 'leaf' | 'link' | 'firstLink' | 'done', T> = {
  node: {
    en: 'dfs({i}, {l}, {r}): preorder[{i}] = {v} becomes a new node. It sits at index m = {m} in inorder, which splits [{l}, {r}] into its left and right subtrees.',
    zh: 'dfs({i}, {l}, {r})：preorder[{i}] = {v} 成为新节点。它在 inorder 中的索引为 m = {m}，据此将 [{l}, {r}] 划分为左右子树。',
    'zh-hant': 'dfs({i}, {l}, {r})：preorder[{i}] = {v} 成為新節點。它在 inorder 中的索引為 m = {m}，據此將 [{l}, {r}] 劃分為左右子樹。',
    ja: 'dfs({i}, {l}, {r})：preorder[{i}] = {v} が新しいノードになります。inorder でのインデックスは m = {m} で、これで [{l}, {r}] を左右の部分木に分けます。',
    ru: 'dfs({i}, {l}, {r}): preorder[{i}] = {v} становится новым узлом. В inorder он стоит на индексе m = {m}, который делит [{l}, {r}] на левое и правое поддеревья.',
  },
  leaf: {
    en: 'dfs({i}, {l}, {r}): preorder[{i}] = {v} becomes a new node. Its range [{l}, {r}] holds only this node, so both of its subtrees are empty.',
    zh: 'dfs({i}, {l}, {r})：preorder[{i}] = {v} 成为新节点。区间 [{l}, {r}] 中只有它自己，因此左右子树都为空。',
    'zh-hant': 'dfs({i}, {l}, {r})：preorder[{i}] = {v} 成為新節點。區間 [{l}, {r}] 中只有它自己，因此左右子樹都為空。',
    ja: 'dfs({i}, {l}, {r})：preorder[{i}] = {v} が新しいノードになります。区間 [{l}, {r}] にはこのノードしかないので、左右の部分木は空です。',
    ru: 'dfs({i}, {l}, {r}): preorder[{i}] = {v} становится новым узлом. В интервале [{l}, {r}] только он сам, поэтому оба поддерева пусты.',
  },
  firstLink: {
    en: 'The calls for the empty subtrees of {c} return None, so dfs returns node {c}. Back in the caller, {c} becomes the left child of {p}: nodes are made on the way down, edges on the way back up.',
    zh: '{c} 的空子树调用返回 None，于是 dfs 返回节点 {c}。回到上一层，{c} 成为 {p} 的左子节点：节点在“递”的过程中创建，边在“归”的过程中建立。',
    'zh-hant': '{c} 的空子樹呼叫回傳 None，於是 dfs 回傳節點 {c}。回到上一層，{c} 成為 {p} 的左子節點：節點在「遞」的過程中建立，邊在「歸」的過程中建立。',
    ja: '{c} の空の部分木に対する呼び出しは None を返し、dfs はノード {c} を返します。呼び出し元に戻ると、{c} は {p} の左子ノードになります。ノードは下りで、辺は戻りで作られます。',
    ru: 'Вызовы для пустых поддеревьев {c} возвращают None, и dfs возвращает узел {c}. В вызывающем вызове {c} становится левым дочерним узлом {p}: узлы создаются по пути вниз, рёбра — на обратном пути.',
  },
  link: {
    en: 'dfs returns node {c}, which becomes the {side} child of {p}.',
    zh: 'dfs 返回节点 {c}，它成为 {p} 的{side}子节点。',
    'zh-hant': 'dfs 回傳節點 {c}，它成為 {p} 的{side}子節點。',
    ja: 'dfs はノード {c} を返し、{c} は {p} の{side}子ノードになります。',
    ru: 'dfs возвращает узел {c}, и он становится {side} дочерним узлом {p}.',
  },
  done: {
    en: 'dfs returns node 2, the right child of 3. The whole tree is built and dfs(0, 0, 4) returns the root node 3.',
    zh: 'dfs 返回节点 2，它成为 3 的右子节点。整棵树构建完成，dfs(0, 0, 4) 返回根节点 3。',
    'zh-hant': 'dfs 回傳節點 2，它成為 3 的右子節點。整棵樹構建完成，dfs(0, 0, 4) 回傳根節點 3。',
    ja: 'dfs はノード 2 を返し、2 は 3 の右子ノードになります。木全体が完成し、dfs(0, 0, 4) は根ノード 3 を返します。',
    ru: 'dfs возвращает узел 2 — правый дочерний узел 3. Дерево построено, и dfs(0, 0, 4) возвращает корневой узел 3.',
  },
};

const builtTreeSteps: StepFigure = {
  type: 'steps',
  call: 'build_tree(preorder, inorder)',
  tones: { node: 'cmp', linkL: 'swp', linkR: 'swp', done: 'done' },
  sources: funcSources(BT_PY, BT_JAVA, ['dfs'], {
    python: {
      node: ['root = TreeNode(preorder[i])', 'm = inorder_map[preorder[i]]'],
      linkL: ['root.left = dfs('],
      linkR: ['root.right = dfs('],
      done: ['root.right = dfs(', 'return root'],
    },
    java: {
      node: ['TreeNode root = new TreeNode(preorder[i]);', 'int m = inorderMap.get(preorder[i]);'],
      linkL: ['root.left = dfs('],
      linkR: ['root.right = dfs('],
      done: ['root.right = dfs(', 'return root;'],
    },
  }),
  build(l) {
    type Call = [number, number, number];
    const x0 = 82;
    const cw = 32;
    const cg = 4;
    const sx = 288;
    const scene = (stack: Call[], made: number[], linked: number[], fresh: number | null) => {
      const [i, lo, hi] = stack[stack.length - 1];
      const roles = callRoles(i, lo, hi);
      const cur = PRE[i];
      const nodes: SceneNode[] = [
        ...indices('ix', x0, 22, [0, 1, 2, 3, 4], { w: cw, gap: cg }),
        text('pre:c', x0 - 8, 51, 'preorder', { anchor: 'end', mono: true, size: 12, tone: 'muted' }),
        text('in:c', x0 - 8, 95, 'inorder', { anchor: 'end', mono: true, size: 12, tone: 'muted' }),
        region('band', cellX(x0, lo, cw, cg) - 3, 75, rowWidth(hi - lo + 1, cw, cg) + 6, 36, { tone: 'accent' }),
        ...cells(
          'p',
          x0,
          30,
          PRE.map((v, p) => {
            const tone = roles.pre(p);
            return { value: v, tone: tone ?? 'muted', dim: tone === null, ring: p === i };
          }),
          { w: cw, h: 30, gap: cg, size: 14 },
        ),
        ...cells(
          'i',
          x0,
          78,
          INO.map((v, q) => {
            const tone = roles.ino(q);
            return { value: v, tone: tone ?? 'muted', dim: tone === null, ring: q === roles.m };
          }),
          { w: cw, h: 30, gap: cg, size: 14 },
        ),
        chip(
          'vars',
          8,
          126,
          seg('i = ', [String(i), ROLE.root, true], '   l = ', [String(lo), 'info', true], '   r = ', [String(hi), 'accent', true], '   m = ', [String(roles.m), 'danger', true]),
          { align: 'start', size: 12 },
        ),
        text('st:l', sx, 22, WORD.stack[l], { size: 12, bold: true, tone: 'muted' }),
      ];
      stack.forEach(([a, b, c], k) => {
        const top = k === stack.length - 1;
        nodes.push(
          chip(`call${a}`, sx, 32 + k * 32, seg('dfs(', [String(a), ROLE.root, true], ', ', [String(b), 'info', true], ', ', [String(c), 'accent', true], ')'), {
            align: 'start',
            size: 12,
            tone: top ? 'accent' : 'idle',
            ring: top,
          }),
        );
      });
      const tree = exampleTree(
        { left: 20, width: 400, top: 200, gap: 62, r: 18 },
        {
          values: made,
          edges: linked,
          tone: (v) => (v === cur ? ROLE.root : 'ok'),
          ring: (v) => v === cur,
          edgeTone: (v) => (v === fresh ? 'accent' : undefined),
        },
      );
      nodes.push(...tree.nodes);
      return { w: W, h: 350, nodes };
    };
    const S = BUILT_SAY;
    const frames: SceneFrame[] = [];
    const callStr = ([a, b, c]: Call) => `dfs(preorder, inorder_map, ${a}, ${b}, ${c})`;
    const nodeFrame = (stack: Call[], made: number[], linked: number[]) => {
      const top = stack[stack.length - 1];
      const [i, lo, hi] = top;
      const tpl = lo === hi ? S.leaf[l] : S.node[l];
      frames.push({
        kind: 'node',
        scene: scene(stack, made, linked, null),
        say: fmt(tpl, { i, l: lo, r: hi, v: PRE[i], m: INO.indexOf(PRE[i]) }),
        call: callStr(top),
      });
    };
    const linkFrame = (kind: string, stack: Call[], made: number[], linked: number[], say: string) => {
      frames.push({ kind, scene: scene(stack, made, linked, linked[linked.length - 1]), say, call: callStr(stack[stack.length - 1]) });
    };
    const side = (s: 'left' | 'right') => WORD[s][l];
    const A: Call = [0, 0, 4];
    const B: Call = [1, 0, 0];
    const C: Call = [2, 2, 4];
    const D: Call = [3, 2, 2];
    const E: Call = [4, 4, 4];
    nodeFrame([A], [3], []);
    nodeFrame([A, B], [3, 9], []);
    linkFrame('linkL', [A], [3, 9], [9], fmt(S.firstLink[l], { c: 9, p: 3 }));
    nodeFrame([A, C], [3, 9, 2], [9]);
    nodeFrame([A, C, D], [3, 9, 2, 1], [9]);
    linkFrame('linkL', [A, C], [3, 9, 2, 1], [9, 1], fmt(S.link[l], { c: 1, p: 2, side: side('left') }));
    nodeFrame([A, C, E], [3, 9, 2, 1, 7], [9, 1]);
    linkFrame('linkR', [A, C], [3, 9, 2, 1, 7], [9, 1, 7], fmt(S.link[l], { c: 7, p: 2, side: side('right') }));
    linkFrame('done', [A], [3, 9, 2, 1, 7], [9, 1, 7, 2], S.done[l]);
    return { frames, legend: roleLegend(l) };
  },
};

// ── 9. Every call's ranges on the finished tree ──────────────────────

const OVERALL_NOTE: T = {
  en: 'Next to each node: its call dfs(i, l, r). The upper strip is preorder, the lower one inorder; colors mark the root node and the two subtrees inside that call.',
  zh: '每个节点旁标出其递归调用 dfs(i, l, r)。上方为 preorder，下方为 inorder，颜色表示该调用中的根节点与左右子树。',
  'zh-hant': '每個節點旁標出其遞迴呼叫 dfs(i, l, r)。上方為 preorder，下方為 inorder，顏色表示該呼叫中的根節點與左右子樹。',
  ja: '各ノードの横にその呼び出し dfs(i, l, r) を示します。上の帯が preorder、下の帯が inorder で、色はその呼び出しにおける根ノードと左右の部分木を表します。',
  ru: 'Рядом с каждым узлом — его вызов dfs(i, l, r). Верхняя полоска — preorder, нижняя — inorder; цвета показывают корень и оба поддерева в этом вызове.',
};

const builtTreeOverall: StaticFigure = {
  type: 'static',
  build(l) {
    const lay = { left: 10, width: 360, top: 62, gap: 86, r: 18 };
    const tree = exampleTree(lay);
    const calls: Record<number, [number, number, number]> = { 3: [0, 0, 4], 9: [1, 0, 0], 2: [2, 2, 4], 1: [3, 2, 2], 7: [4, 4, 4] };
    const side: Record<number, 'left' | 'right'> = { 3: 'right', 9: 'left', 2: 'right', 1: 'left', 7: 'right' };
    const cs = 13;
    const cg = 2;
    const gw = rowWidth(5, cs, cg);
    const nodes: SceneNode[] = [...tree.nodes];
    for (const v of PRE) {
      const c = center(tree.boxes.get(v)!);
      const [i, lo, hi] = calls[v];
      const roles = callRoles(i, lo, hi);
      const gx = side[v] === 'right' ? c.x + lay.r + 8 : c.x - lay.r - 8 - gw;
      nodes.push(
        text(`h${v}`, gx, c.y - 20, seg('dfs(', [String(i), ROLE.root, true], ',', [String(lo), 'info', true], ',', [String(hi), 'accent', true], ')'), { mono: true, size: 11 }),
        ...cells(
          `s${v}p`,
          gx,
          c.y - 13,
          PRE.map((x, p) => ({ value: x, tone: roles.pre(p) ?? 'ghost', dashed: false, dim: roles.pre(p) === null })),
          { w: cs, h: cs, gap: cg, size: 11 },
        ),
        ...cells(
          `s${v}i`,
          gx,
          c.y + 3,
          INO.map((x, q) => ({ value: x, tone: roles.ino(q) ?? 'ghost', dashed: false, dim: roles.ino(q) === null })),
          { w: cs, h: cs, gap: cg, size: 11 },
        ),
      );
    }
    return { scene: { w: W, h: 254, nodes }, legend: roleLegend(l), notes: [OVERALL_NOTE[l]] };
  },
};

// ── Tower of Hanoi ────────────────────────────────────────────────────

/** Disk tones from the smallest disk to the largest. */
const DISK_TONES: Tone[] = ['danger', 'warn', 'info', 'ok', 'accent'];
const ROD = ['A', 'B', 'C'];

interface Rods {
  cx: number[];
  /** Top of the base plate; the lowest disk rests on it. */
  baseY: number;
  baseW: number;
  rodH: number;
  diskH: number;
  diskW: (k: number) => number;
  letters?: boolean;
  letterSize?: number;
  /** Thinner rods for small drawings. */
  thin?: boolean;
}

const diskTop = (lay: Rods, j: number) => lay.baseY - (j + 1) * lay.diskH;

/**
 * Three rods with their disks. `rods[r]` lists disk sizes from the bottom up (1 is the smallest).
 * Disks keep their id (`<prefix>d<size>`) wherever they are, so moving one between frames glides it.
 */
function hanoi(p: string, lay: Rods, rods: number[][], opts: { ghost?: number[][]; roles?: (string | null)[]; hot?: number | null } = {}) {
  const nodes: SceneNode[] = [];
  lay.cx.forEach((cx, r) => {
    // Rods and base plates are thick round-capped lines, drawn under the disks.
    const t = lay.thin ? 0.6 : 1;
    nodes.push(
      arrow(`${p}rod${r}`, [cx, lay.baseY], [cx, lay.baseY - lay.rodH], { head: 'none', width: 4 * t }),
      arrow(`${p}base${r}`, [cx - lay.baseW / 2 + 3, lay.baseY + 3], [cx + lay.baseW / 2 - 3, lay.baseY + 3], { head: 'none', width: 6 * t }),
    );
    if (lay.letters !== false) {
      nodes.push(text(`${p}L${r}`, cx, lay.baseY + 24, ROD[r], { anchor: 'middle', mono: true, bold: true, size: lay.letterSize ?? 14 }));
    }
    const role = opts.roles?.[r];
    if (role) nodes.push(text(`${p}role${r}`, cx, lay.baseY + 41, role, { anchor: 'middle', mono: true, size: 11, tone: role === 'tar' ? 'accent' : 'muted' }));
    (opts.ghost?.[r] ?? []).forEach((k, j) => {
      const w = lay.diskW(k);
      nodes.push(box(`${p}g${k}`, cx - w / 2, diskTop(lay, j) + 1, '', { w, h: lay.diskH - 2, shape: 'chip', tone: 'ghost', dashed: true }));
    });
  });
  lay.cx.forEach((cx, r) => {
    rods[r].forEach((k, j) => {
      const w = lay.diskW(k);
      nodes.push(box(`${p}d${k}`, cx - w / 2, diskTop(lay, j) + 1, '', { w, h: lay.diskH - 2, shape: 'chip', tone: DISK_TONES[k - 1], ring: opts.hot === k }));
    });
  });
  return nodes;
}

/** A dashed arc from where the top disk of `from` was to where it landed on `to`. */
function moveArc(id: string, lay: Rods, from: number, fromLevel: number, to: number, toLevel: number): ArrowNode {
  const x1 = lay.cx[from];
  const x2 = lay.cx[to];
  const y1 = diskTop(lay, fromLevel) - 3;
  const y2 = diskTop(lay, toLevel) - 4;
  const bend = -Math.sign(x2 - x1) * Math.abs(x2 - x1) * 0.2;
  return arrow(id, [x1, y1], [x2, y2], { bend, dashed: true, tone: 'accent', width: 1.75 });
}

/** A translucent trapezoid around disks stacked from `level` upwards on rod `r`, sizes `big` (bottom) to `small` (top). */
function group(id: string, lay: Rods, r: number, level: number, count: number, big: number, small: number): PathNode {
  const cx = lay.cx[r];
  const yb = diskTop(lay, level) + lay.diskH + 1;
  const yt = diskTop(lay, level + count - 1) - 3;
  const bw = lay.diskW(big) / 2 + 7;
  const tw = lay.diskW(small) / 2 + 5;
  const d = `M ${cx - bw} ${yb} L ${cx - tw} ${yt} L ${cx + tw} ${yt} L ${cx + bw} ${yb} Z`;
  return { kind: 'path', id, d, fill: true, tone: 'soft', dashed: true, width: 1.25 };
}

const counter = (l: Locale, n: number, total?: number) =>
  chip('count', 8, 8, seg(`${WORD.moves[l]}: `, [String(n), 'accent', true], ...(total ? [` / ${total}`] : [])), { align: 'start', size: 12, sans: true });

// ── 10. The problem ───────────────────────────────────────────────────

const HANOTA_NOTE: T = {
  en: 'Rules: move one disk at a time, take it only from the top of a rod, and never put a larger disk on a smaller one.',
  zh: '规则：每次只能移动一个圆盘，只能从柱子顶部取出，并且小圆盘必须始终在大圆盘之上。',
  'zh-hant': '規則：每次只能移動一個圓盤，只能從柱子頂部取出，並且小圓盤必須始終在大圓盤之上。',
  ja: 'ルール：1 回に動かせる円盤は 1 枚だけで、柱の頂上からしか取り出せず、小さい円盤は常に大きい円盤の上になければなりません。',
  ru: 'Правила: за раз перемещается один диск, снимать его можно только с вершины стержня, и меньший диск всегда должен лежать на большем.',
};

const hanotaExample: StaticFigure = {
  type: 'static',
  build(l) {
    const lay = (top: number): Rods => ({ cx: [100, 220, 340], baseY: top + 112, baseW: 104, rodH: 92, diskH: 15, diskW: (k) => 26 + k * 14.5 });
    const stack = [5, 4, 3, 2, 1];
    const top = lay(8);
    const bottom = lay(202);
    const nodes: SceneNode[] = [
      region('p1', 20, 8, 400, 146, { tone: 'idle' }),
      ...hanoi('a.', top, [stack, [], []]),
      arrow('down', [100, 160], [100, 194], { width: 3, tone: 'accent' }),
      text('down:l', 116, 182, WORD.moveAll[l], { size: 13, bold: true }),
      region('p2', 20, 202, 400, 146, { tone: 'idle' }),
      ...hanoi('b.', bottom, [[], [], stack]),
    ];
    return { scene: { w: W, h: 352, nodes }, notes: [HANOTA_NOTE[l]] };
  },
};

// ── 11–12. f(1) and f(2) ──────────────────────────────────────────────

const SMALL: Rods = { cx: [90, 220, 350], baseY: 136, baseW: 112, rodH: 96, diskH: 18, diskW: (k) => 40 + k * 22 };
const SMALL_ROLES = ['src', 'buf', 'tar'];

/** Applies moves to a starting position and returns the position after each. */
function play(start: number[][], moves: [number, number][]) {
  const states = [start.map((r) => [...r])];
  for (const [a, b] of moves) {
    const next = states[states.length - 1].map((r) => [...r]);
    next[b].push(next[a].pop()!);
    states.push(next);
  }
  return states;
}

const F1_SAY: Record<'start' | 'move', T> = {
  start: {
    en: 'f(1): there is only one disk, on A.',
    zh: 'f(1)：只有一个圆盘，位于 A。',
    'zh-hant': 'f(1)：只有一個圓盤，位於 A。',
    ja: 'f(1)：円盤は A に 1 枚だけです。',
    ru: 'f(1): есть только один диск, на стержне A.',
  },
  move: {
    en: 'Move it straight from A to C. One move solves f(1).',
    zh: '将它直接从 A 移至 C。一次移动即可解决 f(1)。',
    'zh-hant': '將它直接從 A 移至 C。一次移動即可解決 f(1)。',
    ja: 'それを A から C へ直接移します。1 回の移動で f(1) は解けます。',
    ru: 'Переносим его прямо с A на C. Одно перемещение решает f(1).',
  },
};

const hanotaF1: StepFigure = {
  type: 'steps',
  call: 'dfs(1, A, B, C)',
  tones: { start: 'idle', move: 'done' },
  build(l) {
    const scene = (moved: boolean) => ({
      w: W,
      h: 194,
      nodes: [
        counter(l, moved ? 1 : 0),
        ...hanoi('', SMALL, moved ? [[], [], [1]] : [[1], [], []], { roles: SMALL_ROLES, hot: moved ? 1 : null }),
        ...(moved ? [moveArc('mv', SMALL, 0, 0, 2, 0)] : []),
      ],
    });
    return {
      frames: [
        { kind: 'start', scene: scene(false), say: F1_SAY.start[l] },
        { kind: 'move', scene: scene(true), say: F1_SAY.move[l] },
      ],
    };
  },
};

const F2_SAY: Record<'start' | 'm1' | 'm2' | 'm3', T> = {
  start: {
    en: 'f(2): two disks on A. The small disk must always stay above the large one, so B is used as a buffer.',
    zh: 'f(2)：A 上有两个圆盘。由于小圆盘必须始终在大圆盘之上，需要借助 B 来完成移动。',
    'zh-hant': 'f(2)：A 上有兩個圓盤。由於小圓盤必須始終在大圓盤之上，需要藉助 B 來完成移動。',
    ja: 'f(2)：A に円盤が 2 枚あります。小さい円盤は常に大きい円盤の上になければならないので、B を補助に使います。',
    ru: 'f(2): на A два диска. Меньший всегда должен лежать на большем, поэтому используем B как буфер.',
  },
  m1: {
    en: 'First, move the small disk from A to B.',
    zh: '先将上面的小圆盘从 A 移至 B。',
    'zh-hant': '先將上面的小圓盤從 A 移至 B。',
    ja: 'まず上の小さい円盤を A から B へ移します。',
    ru: 'Сначала переносим маленький диск с A на B.',
  },
  m2: {
    en: 'Then move the large disk from A to C.',
    zh: '再将大圆盘从 A 移至 C。',
    'zh-hant': '再將大圓盤從 A 移至 C。',
    ja: '次に大きい円盤を A から C へ移します。',
    ru: 'Затем переносим большой диск с A на C.',
  },
  m3: {
    en: 'Finally, move the small disk from B to C. Two disks went from A to C with the help of B: C is the target rod, B the buffer rod.',
    zh: '最后将小圆盘从 B 移至 C。两个圆盘借助 B 从 A 移至 C：C 称为目标柱，B 称为缓冲柱。',
    'zh-hant': '最後將小圓盤從 B 移至 C。兩個圓盤藉助 B 從 A 移至 C：C 稱為目標柱，B 稱為緩衝柱。',
    ja: '最後に小さい円盤を B から C へ移します。2 枚の円盤が B を介して A から C へ移りました。C を目標の柱、B を補助の柱と呼びます。',
    ru: 'Наконец, переносим маленький диск с B на C. Два диска перешли с A на C с помощью B: C — целевой стержень, B — буферный.',
  },
};

const hanotaF2: StepFigure = {
  type: 'steps',
  call: 'dfs(2, A, B, C)',
  tones: { start: 'idle', move: 'swp', done: 'done' },
  build(l) {
    const moves: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 2],
    ];
    const states = play([[2, 1], [], []], moves);
    const frames: SceneFrame[] = states.map((st, k) => {
      const nodes: SceneNode[] = [counter(l, k, 3)];
      let hot: number | null = null;
      if (k > 0) {
        const [a, b] = moves[k - 1];
        hot = st[b][st[b].length - 1];
        nodes.push(moveArc('mv', SMALL, a, states[k - 1][a].length - 1, b, st[b].length - 1));
      }
      nodes.push(...hanoi('', SMALL, st, { roles: SMALL_ROLES, hot }));
      const say = [F2_SAY.start, F2_SAY.m1, F2_SAY.m2, F2_SAY.m3][k][l];
      return { kind: k === 0 ? 'start' : k === 3 ? 'done' : 'move', scene: { w: W, h: 194, nodes }, say };
    });
    return { frames };
  },
};

// ── 13. f(3) as three subproblems ─────────────────────────────────────

const F3_STEP: T[] = [
  {
    en: '1. f(2): move two disks from A to B (buffer C)',
    zh: '1. f(2)：将两个圆盘从 A 移至 B（借助 C）',
    'zh-hant': '1. f(2)：將兩個圓盤從 A 移至 B（藉助 C）',
    ja: '1. f(2)：2 枚の円盤を A から B へ（C を補助に）',
    ru: '1. f(2): два диска с A на B (буфер C)',
  },
  {
    en: '2. f(1): move the remaining disk from A to C',
    zh: '2. f(1)：将剩余的一个圆盘从 A 移至 C',
    'zh-hant': '2. f(1)：將剩餘的一個圓盤從 A 移至 C',
    ja: '2. f(1)：残りの 1 枚を A から C へ',
    ru: '2. f(1): оставшийся диск с A на C',
  },
  {
    en: '3. f(2): move two disks from B to C (buffer A)',
    zh: '3. f(2)：将两个圆盘从 B 移至 C（借助 A）',
    'zh-hant': '3. f(2)：將兩個圓盤從 B 移至 C（藉助 A）',
    ja: '3. f(2)：2 枚の円盤を B から C へ（A を補助に）',
    ru: '3. f(2): два диска с B на C (буфер A)',
  },
];

const F3_SAY: Record<'start' | 's1' | 's2' | 's3', T> = {
  start: {
    en: 'f(3): three disks on A. f(1) and f(2) are already solved, so treat the top two disks as one block.',
    zh: 'f(3)：A 上有三个圆盘。f(1) 和 f(2) 的解已知，因此把 A 顶部的两个圆盘看作一个整体。',
    'zh-hant': 'f(3)：A 上有三個圓盤。f(1) 和 f(2) 的解已知，因此把 A 頂部的兩個圓盤看作一個整體。',
    ja: 'f(3)：A に円盤が 3 枚あります。f(1) と f(2) の解は既知なので、上の 2 枚をひとまとまりとみなします。',
    ru: 'f(3): на A три диска. Решения f(1) и f(2) уже известны, поэтому два верхних диска считаем одним целым.',
  },
  s1: {
    en: 'With B as the target rod and C as the buffer, move the two disks from A to B. That is f(2): 3 moves.',
    zh: '令 B 为目标柱、C 为缓冲柱，将两个圆盘从 A 移至 B。这就是 f(2)，需 3 次移动。',
    'zh-hant': '令 B 為目標柱、C 為緩衝柱，將兩個圓盤從 A 移至 B。這就是 f(2)，需 3 次移動。',
    ja: 'B を目標の柱、C を補助の柱として、2 枚の円盤を A から B へ移します。これは f(2) で、3 回の移動です。',
    ru: 'B — целевой стержень, C — буферный: переносим два диска с A на B. Это f(2): 3 перемещения.',
  },
  s2: {
    en: 'Move the remaining disk straight from A to C. That is f(1): 1 move.',
    zh: '将 A 中剩余的一个圆盘直接移至 C。这就是 f(1)，需 1 次移动。',
    'zh-hant': '將 A 中剩餘的一個圓盤直接移至 C。這就是 f(1)，需 1 次移動。',
    ja: 'A に残った 1 枚を C へ直接移します。これは f(1) で、1 回の移動です。',
    ru: 'Оставшийся диск переносим прямо с A на C. Это f(1): 1 перемещение.',
  },
  s3: {
    en: 'With C as the target rod and A as the buffer, move the two disks from B to C: f(2) again. 3 + 1 + 3 = 7 moves.',
    zh: '令 C 为目标柱、A 为缓冲柱，将两个圆盘从 B 移至 C，再次是 f(2)。共 3 + 1 + 3 = 7 次移动。',
    'zh-hant': '令 C 為目標柱、A 為緩衝柱，將兩個圓盤從 B 移至 C，再次是 f(2)。共 3 + 1 + 3 = 7 次移動。',
    ja: 'C を目標の柱、A を補助の柱として、2 枚の円盤を B から C へ移します。再び f(2) です。合計 3 + 1 + 3 = 7 回。',
    ru: 'C — целевой стержень, A — буферный: переносим два диска с B на C, снова f(2). Всего 3 + 1 + 3 = 7 перемещений.',
  },
};

const F3: Rods = { cx: [90, 220, 350], baseY: 132, baseW: 116, rodH: 88, diskH: 17, diskW: (k) => 36 + k * 22 };

const hanotaF3: StepFigure = {
  type: 'steps',
  call: 'dfs(3, A, B, C)',
  tones: { start: 'idle', sub: 'swp', move: 'cmp', done: 'done' },
  build(l) {
    const states: number[][][] = [
      [[3, 2, 1], [], []],
      [[3], [2, 1], []],
      [[], [2, 1], [3]],
      [[], [], [3, 2, 1]],
    ];
    const roles: (string | null)[][] = [
      ['src', 'buf', 'tar'],
      ['src', 'tar', 'buf'],
      ['src', null, 'tar'],
      ['buf', 'src', 'tar'],
    ];
    const count = [0, 3, 4, 7];
    /** Where the two-disk block sits: rod and level of its lowest disk. */
    const block: [number, number][] = [
      [0, 1],
      [1, 0],
      [1, 0],
      [2, 1],
    ];
    const arcs: [number, number, number, number][] = [
      [0, 2, 1, 1],
      [0, 0, 2, 0],
      [1, 1, 2, 2],
    ];
    const frames: SceneFrame[] = states.map((st, k) => {
      const [br, bl] = block[k];
      const nodes: SceneNode[] = [counter(l, count[k], 7), group('grp', F3, br, bl, 2, 2, 1), ...hanoi('', F3, st, { roles: roles[k], hot: k === 2 ? 3 : null })];
      if (k > 0) {
        const [a, al, b, bl2] = arcs[k - 1];
        nodes.push(moveArc('mv', F3, a, al, b, bl2));
      }
      F3_STEP.forEach((s, j) => {
        const state = j + 1 < k ? 'done' : j + 1 === k ? 'now' : 'todo';
        nodes.push(
          text(`st${j}`, 44, 206 + j * 22, s[l], {
            size: 12,
            bold: state === 'now',
            tone: state === 'now' ? 'accent' : state === 'done' ? 'ok' : 'muted',
          }),
        );
        if (state === 'done') nodes.push(text(`ck${j}`, 28, 206 + j * 22, '✓', { size: 12, bold: true, tone: 'ok' }));
      });
      const say = [F3_SAY.start, F3_SAY.s1, F3_SAY.s2, F3_SAY.s3][k][l];
      return { kind: ['start', 'sub', 'move', 'done'][k], scene: { w: W, h: 262, nodes }, say };
    });
    return { frames };
  },
};

// ── 14. f(n) = f(n−1) + f(1) + f(n−1) ─────────────────────────────────

const HDC_NOTE: T = {
  en: 'Solve the three subproblems in order: move n−1 disks from A to B with the help of C, move the remaining disk from A to C, then move the n−1 disks from B to C with the help of A.',
  zh: '按顺序解决三个子问题：将 n−1 个圆盘借助 C 从 A 移至 B；将剩余 1 个圆盘从 A 直接移至 C；将 n−1 个圆盘借助 A 从 B 移至 C。',
  'zh-hant': '按順序解決三個子問題：將 n−1 個圓盤藉助 C 從 A 移至 B；將剩餘 1 個圓盤從 A 直接移至 C；將 n−1 個圓盤藉助 A 從 B 移至 C。',
  ja: '3 つの部分問題を順に解きます。n−1 枚の円盤を C を介して A から B へ移し、残りの 1 枚を A から C へ直接移し、n−1 枚を A を介して B から C へ移します。',
  ru: 'Решаем три подзадачи по порядку: переносим n−1 дисков с A на B с помощью C, оставшийся диск — прямо с A на C, затем n−1 дисков с B на C с помощью A.',
};

const hanotaDivideAndConquer: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes: SceneNode[] = [];
    // The original problem, on top.
    const top: Rods = { cx: [140, 220, 300], baseY: 120, baseW: 74, rodH: 70, diskH: 12, diskW: (k) => 22 + k * 11.5, letterSize: 12 };
    nodes.push(
      region('orig', 70, 26, 300, 132, { tone: 'idle', label: seg(`${WORD.original[l]} `, ['f(n)', 'accent'], ': A → C') }),
      ...hanoi('o.', top, [[], [], [4, 3, 2, 1]], { ghost: [[4, 3, 2, 1], [], []] }),
      moveArc('o.mv', top, 0, 3, 2, 3),
    );
    // Three subproblems, left to right.
    const subs: { label: Rich; rods: number[][]; ghost: number[][]; arc: [number, number, number, number]; grp: [number, number, number, number, number] }[] = [
      {
        label: seg('1. ', ['f(n−1)', 'accent'], ': A → B'),
        rods: [[4], [3, 2, 1], []],
        ghost: [[4, 3, 2, 1], [], []],
        arc: [0, 3, 1, 2],
        grp: [1, 0, 3, 3, 1],
      },
      {
        label: seg('2. ', ['f(1)', 'accent'], ': A → C'),
        rods: [[], [3, 2, 1], [4]],
        ghost: [[4], [], []],
        arc: [0, 0, 2, 0],
        grp: [2, 0, 1, 4, 4],
      },
      {
        label: seg('3. ', ['f(n−1)', 'accent'], ': B → C'),
        rods: [[], [], [4, 3, 2, 1]],
        ghost: [[], [3, 2, 1], []],
        arc: [1, 2, 2, 3],
        grp: [2, 1, 3, 3, 1],
      },
    ];
    subs.forEach((s, k) => {
      const px = 4 + k * 146;
      const lay: Rods = { cx: [px + 25, px + 70, px + 115], baseY: 280, baseW: 42, rodH: 50, diskH: 9, diskW: (d) => 12 + d * 7, letterSize: 12, thin: true };
      const [gr, gl, gc, gb, gs] = s.grp;
      nodes.push(
        region(`s${k}`, px, 206, 140, 104, { tone: 'idle', label: s.label }),
        arrow(`fan${k}`, [220, 160], [px + 70, 182], { tone: 'muted', width: 1.25, dashed: true }),
        group(`s${k}.grp`, lay, gr, gl, gc, gb, gs),
        ...hanoi(`s${k}.`, lay, s.rods, { ghost: s.ghost }),
        moveArc(`s${k}.mv`, lay, s.arc[0], s.arc[1], s.arc[2], s.arc[3]),
      );
    });
    nodes.push(text('eq', W / 2, 334, seg(['f(n)', 'accent', true], ' = ', ['f(n−1)', 'info', true], ' + ', ['f(1)', 'warn', true], ' + ', ['f(n−1)', 'info', true]), { anchor: 'middle', mono: true, size: 14 }));
    return { scene: { w: W, h: 344, nodes }, notes: [HDC_NOTE[l]] };
  },
};

// ── 15. Recursion tree for n = 3 ──────────────────────────────────────

const TREE_SAY: Record<'l0' | 'l1' | 'l2' | 'moves', T> = {
  l0: {
    en: 'The call dfs(3, A, B, C), written f(3), moves three disks from A to C.',
    zh: '调用 dfs(3, A, B, C)，记为 f(3)，将三个圆盘从 A 移至 C。',
    'zh-hant': '呼叫 dfs(3, A, B, C)，記為 f(3)，將三個圓盤從 A 移至 C。',
    ja: '呼び出し dfs(3, A, B, C)（f(3) と書きます）は、3 枚の円盤を A から C へ移します。',
    ru: 'Вызов dfs(3, A, B, C), он же f(3), переносит три диска с A на C.',
  },
  l1: {
    en: 'It divides into three subproblems: f(2) from A to B, f(1) from A to C, f(2) from B to C.',
    zh: '它被划分为三个子问题：f(2) 从 A 到 B，f(1) 从 A 到 C，f(2) 从 B 到 C。',
    'zh-hant': '它被劃分為三個子問題：f(2) 從 A 到 B，f(1) 從 A 到 C，f(2) 從 B 到 C。',
    ja: '3 つの部分問題に分かれます。A から B への f(2)、A から C への f(1)、B から C への f(2) です。',
    ru: 'Она делится на три подзадачи: f(2) с A на B, f(1) с A на C, f(2) с B на C.',
  },
  l2: {
    en: 'Each f(2) divides the same way into three f(1). Every f(1) is a single move, so the recursion stops there.',
    zh: '每个 f(2) 以相同方式再划分为三个 f(1)。每个 f(1) 只需一次移动，递归在此终止。',
    'zh-hant': '每個 f(2) 以相同方式再劃分為三個 f(1)。每個 f(1) 只需一次移動，遞迴在此終止。',
    ja: '各 f(2) も同じように 3 つの f(1) に分かれます。f(1) は 1 回の移動なので、再帰はここで止まります。',
    ru: 'Каждая f(2) так же делится на три f(1). Каждая f(1) — одно перемещение, на этом рекурсия останавливается.',
  },
  moves: {
    en: 'Read the leaves from left to right: that is the order of the moves, 7 = 2³ − 1 in all. The tree has height n, so time is O(2ⁿ) and space is O(n).',
    zh: '从左到右读取叶节点，就是移动的顺序，共 7 = 2³ − 1 次。递归树高度为 n，因此时间复杂度为 O(2ⁿ)，空间复杂度为 O(n)。',
    'zh-hant': '從左到右讀取葉節點，就是移動的順序，共 7 = 2³ − 1 次。遞迴樹高度為 n，因此時間複雜度為 O(2ⁿ)，空間複雜度為 O(n)。',
    ja: '葉を左から右へ読むと移動の順序になり、全部で 7 = 2³ − 1 回です。再帰木の高さは n なので、時間計算量は O(2ⁿ)、空間計算量は O(n) です。',
    ru: 'Листья слева направо дают порядок перемещений, всего 7 = 2³ − 1. Высота дерева равна n, поэтому время O(2ⁿ), а память O(n).',
  },
};

interface HanoiCall {
  n: number;
  src: number;
  tar: number;
  kids: HanoiCall[];
}

/** The calls of dfs(n, src, buf, tar); the middle child stands for the single move between the two halves. */
function hanoiCalls(n: number, src: number, buf: number, tar: number): HanoiCall {
  if (n === 1) return { n, src, tar, kids: [] };
  return { n, src, tar, kids: [hanoiCalls(n - 1, src, tar, buf), { n: 1, src, tar, kids: [] }, hanoiCalls(n - 1, buf, src, tar)] };
}

const hanotaRecursiveTree: StepFigure = {
  type: 'steps',
  call: 'dfs(3, A, B, C)',
  tones: { level: 'cmp', moves: 'done' },
  build(l) {
    // Flatten the call tree; leaves are spread evenly and parents sit over their children.
    const flat: { c: HanoiCall; depth: number; parent: number }[] = [];
    const walk = (c: HanoiCall, depth: number, parent: number) => {
      const k = flat.length;
      flat.push({ c, depth, parent });
      c.kids.forEach((kid) => walk(kid, depth + 1, k));
    };
    walk(hanoiCalls(3, 0, 1, 2), 0, -1);
    const leaves = flat.map((_, k) => k).filter((k) => flat[k].c.kids.length === 0);
    const xs = new Map<number, number>();
    leaves.forEach((k, j) => xs.set(k, ((j + 0.5) * W) / leaves.length));
    const place = (k: number): number => {
      if (xs.has(k)) return xs.get(k)!;
      const kids = flat.map((f, j) => (f.parent === k ? j : -1)).filter((j) => j >= 0);
      const x = (Math.min(...kids.map(place)) + Math.max(...kids.map(place))) / 2;
      xs.set(k, x);
      return x;
    };
    place(0);
    const rowY = (d: number) => 44 + d * 84;
    const bh = 28;
    const boxes = flat.map(({ c, depth }, k) => {
      const leaf = c.kids.length === 0;
      const label: Rich = leaf ? `f(1)` : seg(`f(${c.n}) `, [`${ROD[c.src]}→${ROD[c.tar]}`, 'muted']);
      const w = leaf ? 50 : 84;
      return box(`f${k}`, xs.get(k)! - w / 2, rowY(depth), label, { w, h: bh, size: 12, tone: leaf ? 'info' : 'ok' });
    });
    const scene = (levels: number, numbered: boolean) => {
      const nodes: SceneNode[] = [];
      flat.forEach(({ c, depth, parent }, k) => {
        if (depth >= levels) return;
        const b = boxes[k];
        nodes.push({ ...b, tone: depth === levels - 1 && !numbered ? 'accent' : b.tone });
        if (parent >= 0) nodes.push(link(`e${k}`, boxes[parent], b, { pad: 2, width: 1.5 }));
        if (c.kids.length === 0) {
          nodes.push(text(`mv${k}`, xs.get(k)!, rowY(depth) + bh + 16, `${ROD[c.src]}→${ROD[c.tar]}`, { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
          if (numbered) {
            const order = leaves.indexOf(k) + 1;
            nodes.push(box(`n${k}`, b.x + b.w - 14, b.y - 14, String(order), { w: 18, h: 18, shape: 'circle', size: 11, tone: 'warn' }));
          }
        }
      });
      if (numbered) nodes.push(chip('total', 8, 6, seg(`${WORD.moves[l]}: `, ['7', 'accent', true], ` = 2${sup(3)} − 1`), { align: 'start', size: 12, sans: true }));
      return { w: W, h: rowY(2) + bh + 26, nodes };
    };
    const S = TREE_SAY;
    return {
      frames: [
        { kind: 'level', scene: scene(1, false), say: S.l0[l] },
        { kind: 'level', scene: scene(2, false), say: S.l1[l] },
        { kind: 'level', scene: scene(3, false), say: S.l2[l] },
        { kind: 'moves', scene: scene(3, true), say: S.moves[l] },
      ],
    };
  },
};

const FIGURES: Record<string, Figure> = {
  divide_and_conquer_merge_sort: mergeSort,
  divide_and_conquer_bubble_sort: bubbleSort,
  divide_and_conquer_parallel_computing: parallelComputing,
  binary_search_recur: binarySearchRecur,
  build_tree_example: buildTreeExample,
  build_tree_preorder_inorder_division: preorderInorderDivision,
  build_tree_division_pointers: divisionPointers,
  built_tree_steps: builtTreeSteps,
  built_tree_overall: builtTreeOverall,
  hanota_example: hanotaExample,
  hanota_f1_steps: hanotaF1,
  hanota_f2_steps: hanotaF2,
  hanota_f3_steps: hanotaF3,
  hanota_divide_and_conquer: hanotaDivideAndConquer,
  hanota_recursive_tree: hanotaRecursiveTree,
};

export default FIGURES;
