import edgeJavaEn from '@codes-en/java/chapter_searching/binary_search_edge.java?raw';
import insJavaEn from '@codes-en/java/chapter_searching/binary_search_insertion.java?raw';
import sumJavaEn from '@codes-en/java/chapter_searching/two_sum.java?raw';
import edgePyEn from '@codes-en/python/chapter_searching/binary_search_edge.py?raw';
import insPyEn from '@codes-en/python/chapter_searching/binary_search_insertion.py?raw';
import sumPyEn from '@codes-en/python/chapter_searching/two_sum.py?raw';
import edgeJavaJa from '@codes-ja/java/chapter_searching/binary_search_edge.java?raw';
import insJavaJa from '@codes-ja/java/chapter_searching/binary_search_insertion.java?raw';
import sumJavaJa from '@codes-ja/java/chapter_searching/two_sum.java?raw';
import edgePyJa from '@codes-ja/python/chapter_searching/binary_search_edge.py?raw';
import insPyJa from '@codes-ja/python/chapter_searching/binary_search_insertion.py?raw';
import sumPyJa from '@codes-ja/python/chapter_searching/two_sum.py?raw';
import edgeJavaRu from '@codes-ru/java/chapter_searching/binary_search_edge.java?raw';
import insJavaRu from '@codes-ru/java/chapter_searching/binary_search_insertion.java?raw';
import sumJavaRu from '@codes-ru/java/chapter_searching/two_sum.java?raw';
import edgePyRu from '@codes-ru/python/chapter_searching/binary_search_edge.py?raw';
import insPyRu from '@codes-ru/python/chapter_searching/binary_search_insertion.py?raw';
import sumPyRu from '@codes-ru/python/chapter_searching/two_sum.py?raw';
import edgeJavaZh from '@codes-zh/java/chapter_searching/binary_search_edge.java?raw';
import insJavaZh from '@codes-zh/java/chapter_searching/binary_search_insertion.java?raw';
import sumJavaZh from '@codes-zh/java/chapter_searching/two_sum.java?raw';
import edgePyZh from '@codes-zh/python/chapter_searching/binary_search_edge.py?raw';
import insPyZh from '@codes-zh/python/chapter_searching/binary_search_insertion.py?raw';
import sumPyZh from '@codes-zh/python/chapter_searching/two_sum.py?raw';
import edgeJavaZhHant from '@codes-zh-hant/java/chapter_searching/binary_search_edge.java?raw';
import insJavaZhHant from '@codes-zh-hant/java/chapter_searching/binary_search_insertion.java?raw';
import sumJavaZhHant from '@codes-zh-hant/java/chapter_searching/two_sum.java?raw';
import edgePyZhHant from '@codes-zh-hant/python/chapter_searching/binary_search_edge.py?raw';
import insPyZhHant from '@codes-zh-hant/python/chapter_searching/binary_search_insertion.py?raw';
import sumPyZhHant from '@codes-zh-hant/python/chapter_searching/two_sum.py?raw';
import { arrow, box, cells, cellX, chip, drawTree, pair, pairWidth, region, rowWidth, seg, text, textWidth, treeFromLevels, type Cell } from '../kit';
import type { Figure, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

/**
 * Chapter 10, searching. Arrays are rows of cells; the search pointers i, j, m are labels under
 * them that glide from cell to cell, and the search interval is a tinted band behind the cells.
 */

const W = 440;

const INS_PY = raw(insPyEn, insPyZh, insPyZhHant, insPyJa, insPyRu);
const INS_JAVA = raw(insJavaEn, insJavaZh, insJavaZhHant, insJavaJa, insJavaRu);
const EDGE_PY = raw(edgePyEn, edgePyZh, edgePyZhHant, edgePyJa, edgePyRu);
const EDGE_JAVA = raw(edgeJavaEn, edgeJavaZh, edgeJavaZhHant, edgeJavaJa, edgeJavaRu);
const SUM_PY = raw(sumPyEn, sumPyZh, sumPyZhHant, sumPyJa, sumPyRu);
const SUM_JAVA = raw(sumJavaEn, sumJavaZh, sumJavaZhHant, sumJavaJa, sumJavaRu);

/** The book's arrays: distinct values for plain search, repeated 6s for insertion points and edges. */
const SORTED = [1, 3, 6, 8, 12, 15, 23, 26, 31, 35];
const DUP = [1, 3, 6, 6, 6, 6, 6, 10, 12, 15];

/** Cell size and gap for a row of ten. */
const CW = 34;
const CG = 4;
/** Left edge of a row of ten with a `nums` label in front of it. */
const X0 = 56;

/** Pointer colors, the same in every figure. */
const TONE = { i: 'accent', j: 'info', m: 'warn' } as const satisfies Record<string, Tone>;

/** A row of cells; `look` styles each one. */
function row(prefix: string, x0: number, y: number, values: (number | string)[], look: (k: number) => Partial<Cell> = () => ({}), w = CW, gap = CG, size?: number) {
  return cells(
    prefix,
    x0,
    y,
    values.map((v, k) => ({ value: v, ...look(k) })),
    { w, h: w, gap, size },
  );
}

/** Index labels under a row. */
function idx(prefix: string, x0: number, y: number, n: number, tone: (k: number) => Tone | undefined = () => undefined, w = CW, gap = CG) {
  return Array.from({ length: n }, (_, k) =>
    text(`${prefix}${k}`, cellX(x0, k, w, gap) + w / 2, y, String(k), { anchor: 'middle', mono: true, size: 12, tone: tone(k) ?? 'muted', bold: tone(k) !== undefined }),
  );
}

/** `nums` in front of a row. */
const numsLabel = (y: number, x0 = X0, h = CW) => text('l:nums', x0 - 10, y + h / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' });

interface Ptr {
  id: string;
  at: number;
  tone: Tone;
  label?: Rich;
  dim?: boolean;
}

/**
 * Pointer names under cells, each with a short arrow pointing up at its cell. Pointers on the
 * same cell sit side by side, so each keeps its own id and glides when it moves.
 */
function pointers(x0: number, y: number, ps: Ptr[], w = CW, gap = CG): SceneNode[] {
  const out: SceneNode[] = [];
  for (const p of ps) {
    const same = ps.filter((q) => q.at === p.at);
    const k = same.indexOf(p);
    const cx = cellX(x0, p.at, w, gap) + w / 2;
    const dx = (k - (same.length - 1) / 2) * 16;
    out.push(
      arrow(`p:${p.id}:a`, [cx, y + 14], [cx, y], { tone: p.tone, width: 1.5, dim: p.dim }),
      text(`p:${p.id}`, cx + dx, y + 29, p.label ?? p.id, { anchor: 'middle', mono: true, bold: true, size: 13, tone: p.tone, dim: p.dim }),
    );
  }
  return out;
}

/** The search interval [i, j]: a tinted band behind the cells. */
function band(id: string, x0: number, y: number, i: number, j: number, h: number, tone: Tone = 'accent', w = CW, gap = CG) {
  const left = cellX(x0, i, w, gap) - 4;
  return region(id, left, y, cellX(x0, j, w, gap) + w + 4 - left, h, { tone });
}

/** A curved arrow from cell `from` to cell `to`, over the row (or under it). */
function hop(id: string, x0: number, y: number, from: number, to: number, o: { below?: boolean; tone?: Tone; dashed?: boolean; w?: number; gap?: number; lift?: number; width?: number } = {}) {
  const { below = false, tone = 'accent', dashed, w = CW, gap = CG, width = 1.75 } = o;
  const lift = o.lift ?? 8 + Math.abs(to - from) * 2;
  const dir = to > from ? 1 : -1;
  const fx = cellX(x0, from, w, gap) + w / 2 + dir * 4;
  const tx = cellX(x0, to, w, gap) + w / 2 - dir * 4;
  const yy = below ? y + w + 3 : y - 3;
  return arrow(id, [fx, yy], [tx, yy], { bend: (below ? 1 : -1) * dir * lift, tone, dashed, width });
}

/** Center x of the gap before cell `k`. */
const gapX = (x0: number, k: number, w = CW, gap = CG) => cellX(x0, k, w, gap) - gap / 2;

/** A small dashed marker over the gap before cell `k`, for a value that is not in the array (5.5, 7). */
function phantom(id: string, x0: number, y: number, k: number, label: Rich, rowY: number) {
  const gx = gapX(x0, k);
  return [chip(id, gx, y, label, { size: 12, tone: 'info', dashed: true }), arrow(`${id}:a`, [gx, y + 30], [gx, rowY - 4], { tone: 'info', width: 1.5, dashed: true })];
}

// ── Binary search: the problem ────────────────────────────────────────

const EXAMPLE_NOTE: T = {
  en: 'nums is sorted in ascending order with no duplicates. If target is not in the array, the search returns −1.',
  zh: 'nums 按升序排列且不含重复元素。若数组中不存在 target，则返回 −1。',
  'zh-hant': 'nums 按升序排列且不含重複元素。若陣列中不存在 target，則返回 −1。',
  ja: 'nums は昇順に並び、重複要素はありません。target が配列に含まれない場合は −1 を返します。',
  ru: 'nums упорядочен по возрастанию и не содержит повторов. Если target в массиве нет, поиск возвращает −1.',
};

const binarySearchExample: StaticFigure = {
  type: 'static',
  build(l) {
    const cy = 172;
    const base = cy - 10;
    const target = 2;
    const nodes: SceneNode[] = [chip('t', X0, 10, seg(['target', 'accent', true], ' = ', ['6', 'accent', true]), { align: 'start', size: 14 })];
    // A bar per element above its cell: the heights only ever grow, which is what "sorted" means.
    SORTED.forEach((v, k) => {
      const h = 8 + v * 2.8;
      const x = cellX(X0, k, CW, CG) + 7;
      const on = k === target;
      nodes.push(
        box(`b${k}`, x, base - h, '', { w: CW - 14, h, tone: on ? 'accent' : 'muted', ring: on }),
        text(`bv${k}`, x + (CW - 14) / 2, base - h - (on ? 10 : 6), String(v), { anchor: 'middle', mono: true, size: 12, bold: on, tone: on ? 'accent' : 'muted' }),
      );
    });
    nodes.push(
      numsLabel(cy),
      ...row('a', X0, cy, SORTED, (k) => (k === target ? { tone: 'accent', ring: true } : {})),
      ...idx('i', X0, cy + CW + 16, SORTED.length, (k) => (k === target ? 'accent' : undefined)),
      chip('res', W / 2, 232, seg('binary_search(nums, ', ['6', 'accent'], ')  →  ', ['2', 'accent', true]), { size: 13 }),
    );
    return { scene: { w: W, h: 268, nodes }, notes: [EXAMPLE_NOTE[l]] };
  },
};

// ── Two interval representations ──────────────────────────────────────

const RANGE_WORD: Record<'closed' | 'open' | 'closedSub' | 'openSub' | 'init' | 'loop' | 'narrow', T> = {
  closed: { en: 'Closed interval [i, j]', zh: '双闭区间 [i, j]', 'zh-hant': '雙閉區間 [i, j]', ja: '両閉区間 [i, j]', ru: 'Двойной замкнутый интервал [i, j]' },
  open: { en: 'Left-closed, right-open [i, j)', zh: '左闭右开区间 [i, j)', 'zh-hant': '左閉右開區間 [i, j)', ja: '左閉右開区間 [i, j)', ru: 'Левозамкнутый правооткрытый [i, j)' },
  closedSub: { en: 'both boundaries included', zh: '左右边界都包含自身', 'zh-hant': '左右邊界都包含自身', ja: '両端とも含む', ru: 'обе границы включены' },
  openSub: { en: 'right boundary excluded', zh: '右边界不包含自身', 'zh-hant': '右邊界不包含自身', ja: '右端は含まない', ru: 'правая граница не включена' },
  init: { en: 'initialize', zh: '初始化', 'zh-hant': '初始化', ja: '初期化', ru: 'инициализация' },
  loop: { en: 'loop while', zh: '循环条件', 'zh-hant': '迴圈條件', ja: 'ループ条件', ru: 'условие цикла' },
  narrow: { en: 'narrow the interval', zh: '缩小区间', 'zh-hant': '縮小區間', ja: '区間の縮小', ru: 'сужение интервала' },
};

const RANGE_NOTE: T = {
  en: 'In the closed interval, i and j narrow symmetrically (i = m + 1, j = m − 1). That is less error-prone, so the closed interval is generally recommended.',
  zh: '双闭区间中 i 和 j 的缩小操作是对称的（i = m + 1，j = m − 1），更不容易出错，因此一般建议采用双闭区间的写法。',
  'zh-hant': '雙閉區間中 i 和 j 的縮小操作是對稱的（i = m + 1，j = m − 1），更不容易出錯，因此一般建議採用雙閉區間的寫法。',
  ja: '両閉区間では i と j の縮小操作が対称（i = m + 1、j = m − 1）でミスしにくいため、一般に両閉区間の書き方を推奨します。',
  ru: 'В двойном замкнутом интервале i и j сужаются симметрично (i = m + 1, j = m − 1). Так ошибиться сложнее, поэтому обычно рекомендуют именно его.',
};

const binarySearchRanges: StaticFigure = {
  type: 'static',
  build(l) {
    const w = 30;
    const gap = 4;
    const x0 = (W - rowWidth(11, w, gap)) / 2;
    const panel = (p: string, top: number, open: boolean): SceneNode[] => {
      const cy = top + 34;
      const jAt = open ? 10 : 9;
      const nodes: SceneNode[] = [
        region(`${p}:bg`, 8, top, W - 16, 172, { tone: 'muted', label: seg([open ? RANGE_WORD.open[l] : RANGE_WORD.closed[l], 'idle', true]), labelAt: 'inside' }),
        band(`${p}:band`, x0, cy - 5, 0, 9, w + 10, 'accent', w, gap),
        ...cells(`${p}:a`, x0, cy, DUP.map((_, k) => ({ value: '', tone: k === 0 ? 'accent' : k === jAt ? 'info' : 'idle' })), { w, h: w, gap }),
        ...idx(`${p}:x`, x0, cy + w + 14, 10, (k) => (k === 0 ? TONE.i : k === jAt ? TONE.j : undefined), w, gap),
        ...pointers(x0, cy + w + 20, [
          { id: `${p}i`, label: 'i', at: 0, tone: TONE.i },
          { id: `${p}j`, label: 'j', at: jAt, tone: TONE.j },
        ], w, gap),
        text(`${p}:sub`, (cellX(x0, 1, w, gap) + cellX(x0, 9, w, gap)) / 2, cy + w + 40, open ? RANGE_WORD.openSub[l] : RANGE_WORD.closedSub[l], { anchor: 'middle', size: 12, tone: 'muted' }),
      ];
      if (open) {
        // n itself lies outside the interval: an empty slot past the last element.
        nodes.push(box(`${p}:n`, cellX(x0, 10, w, gap), cy, '', { w, h: w, tone: 'info', dashed: true }), text(`${p}:x10`, cellX(x0, 10, w, gap) + w / 2, cy + w + 14, '10', { anchor: 'middle', mono: true, size: 12, bold: true, tone: TONE.j }));
      }
      const codes: [string, Rich][] = open
        ? [
            [RANGE_WORD.init[l], seg(['i', TONE.i], ', ', ['j', TONE.j], ' = 0, ', ['n', 'ok'])],
            [RANGE_WORD.loop[l], seg(['i', TONE.i], ' < ', ['j', TONE.j])],
            [RANGE_WORD.narrow[l], seg(['i', TONE.i], ' = ', ['m', TONE.m], ' + 1, ', ['j', TONE.j], ' = ', ['m', TONE.m])],
          ]
        : [
            [RANGE_WORD.init[l], seg(['i', TONE.i], ', ', ['j', TONE.j], ' = 0, ', ['n', 'ok'], ' - 1')],
            [RANGE_WORD.loop[l], seg(['i', TONE.i], ' <= ', ['j', TONE.j])],
            [RANGE_WORD.narrow[l], seg(['i', TONE.i], ' = ', ['m', TONE.m], ' + 1, ', ['j', TONE.j], ' = ', ['m', TONE.m], ' - 1')],
          ];
      const widths = codes.map(([, c]) => Math.round(textWidth(c, 12, true) + 20));
      const sep = 14;
      let x = (W - widths.reduce((a, b) => a + b, 0) - sep * (codes.length - 1)) / 2;
      codes.forEach(([cap, c], k) => {
        nodes.push(
          text(`${p}:cap${k}`, x + widths[k] / 2, top + 132, cap, { anchor: 'middle', size: 11, tone: 'muted' }),
          chip(`${p}:code${k}`, x, top + 138, c, { align: 'start', size: 12 }),
        );
        x += widths[k] + sep;
      });
      return nodes;
    };
    return { scene: { w: W, h: 368, nodes: [...panel('c', 8, false), ...panel('o', 190, true)] }, notes: [RANGE_NOTE[l]] };
  },
};

// ── Insertion point: the problem ──────────────────────────────────────

const INSERT_WORD: T = { en: 'insert target', zh: '插入 target', 'zh-hant': '插入 target', ja: 'target を挿入', ru: 'вставляем target' };

const INSERT_NOTE: T = {
  en: 'target = 6 is already in nums, so it goes to the left of the existing 6. The insertion point index is 2.',
  zh: '数组中已存在元素 6，因此将 target 插入到其左方。插入点的索引为 2。',
  'zh-hant': '陣列中已存在元素 6，因此將 target 插入到其左方。插入點的索引為 2。',
  ja: '配列にはすでに 6 があるので、target はその左側に挿入します。挿入位置のインデックスは 2 です。',
  ru: '6 уже есть в массиве, поэтому target вставляется слева от него. Индекс точки вставки равен 2.',
};

const binarySearchInsertionExample: StaticFigure = {
  type: 'static',
  build(l) {
    const w = 30;
    const gap = 4;
    const x0 = 58;
    const top = 62;
    const bottom = 146;
    const gx = gapX(x0, 2, w, gap);
    const after = [...SORTED.slice(0, 2), 6, ...SORTED.slice(2)];
    const nodes: SceneNode[] = [
      text('l:t', gx - 22, 30, 'target', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'accent' }),
      box('t', gx - w / 2, 10, 6, { w, h: w, tone: 'accent', ring: true }),
      arrow('t:a', [gx, 44], [gx, top - 4], { tone: 'accent', width: 1.5 }),
      text('l:top', x0 - 10, top + w / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
      ...cells('a', x0, top, SORTED.map((v) => ({ value: v })), { w, h: w, gap }),
      arrow('down', [gx, top + w + 8], [gx, bottom - 6], { tone: 'accent', width: 2, dashed: true }),
      text('l:ins', gx + 12, (top + w + bottom) / 2 + 4, INSERT_WORD[l], { size: 12, tone: 'muted' }),
      text('l:bottom', x0 - 10, bottom + w / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
      ...cells('b', x0, bottom, after.map((v, k) => ({ value: v, tone: k === 2 ? 'accent' : 'idle', ring: k === 2 })), { w, h: w, gap }),
      ...idx('i', x0, bottom + w + 16, after.length, (k) => (k === 2 ? 'accent' : undefined), w, gap),
    ];
    return { scene: { w: W, h: 204, nodes }, notes: [INSERT_NOTE[l]] };
  },
};

// ── Insertion point: binary search, then walk left ────────────────────

const NAIVE_SAY: Record<'search' | 'walk' | 'stop' | 'done', T> = {
  search: {
    en: 'Step 1: binary search finds some 6, but not necessarily the leftmost one. Here it lands on k = 4.',
    zh: '第一步：执行二分查找，得到任意一个 6 的索引，但不一定是最左边的那个。这里得到 k = 4。',
    'zh-hant': '第一步：執行二分搜尋，得到任意一個 6 的索引，但不一定是最左邊的那個。這裡得到 k = 4。',
    ja: 'ステップ 1：二分探索で任意の 6 のインデックスを得ますが、最も左とは限りません。ここでは k = 4 です。',
    ru: 'Шаг 1: двоичный поиск находит какой-то из элементов 6, но не обязательно самый левый. Здесь это k = 4.',
  },
  walk: {
    en: 'Step 2: walk left from k. nums[{k}] = 6 is also a target, so keep going.',
    zh: '第二步：从 k 开始向左线性遍历。nums[{k}] = 6 仍是 target，继续向左。',
    'zh-hant': '第二步：從 k 開始向左線性走訪。nums[{k}] = 6 仍是 target，繼續向左。',
    ja: 'ステップ 2：k から左へ線形探索します。nums[{k}] = 6 もまだ target なので、さらに左へ進みます。',
    ru: 'Шаг 2: идём от k влево. nums[{k}] = 6 — тоже target, продолжаем.',
  },
  stop: {
    en: 'nums[1] = 3 is not 6, so the run of 6s starts at index 2.',
    zh: 'nums[1] = 3 不等于 6，因此最左边的 6 位于索引 2。',
    'zh-hant': 'nums[1] = 3 不等於 6，因此最左邊的 6 位於索引 2。',
    ja: 'nums[1] = 3 は 6 ではないので、最も左の 6 はインデックス 2 にあります。',
    ru: 'nums[1] = 3 ≠ 6, значит самый левый 6 стоит на индексе 2.',
  },
  done: {
    en: 'Return 2. The walk may pass every copy of target, so with many duplicates this method takes O(n).',
    zh: '返回 2。线性遍历可能要经过所有 target，当数组中存在很多重复的 target 时，时间复杂度为 O(n)。',
    'zh-hant': '返回 2。線性走訪可能要經過所有 target，當陣列中存在很多重複的 target 時，時間複雜度為 O(n)。',
    ja: '2 を返します。線形探索はすべての target を通る可能性があるため、重複が多いとこの方法は O(n) かかります。',
    ru: 'Возвращаем 2. Линейный проход может пройти через все копии target, поэтому при многих повторах метод работает за O(n).',
  },
};

const binarySearchInsertionNaive: StepFigure = {
  type: 'steps',
  tones: { search: 'cmp', walk: 'swp', stop: 'cmp', done: 'done' },
  build(l) {
    const cy = 70;
    const scene = (k: number, look: (c: number) => Partial<Cell>, extra: SceneNode[], status: Rich) => ({
      w: W,
      h: 210,
      nodes: [
        chip('t', X0, 8, seg(['target', 'accent', true], ' = ', ['6', 'accent', true]), { align: 'start', size: 13 }),
        numsLabel(cy),
        ...row('a', X0, cy, DUP, look),
        ...idx('x', X0, cy + CW + 16, DUP.length),
        ...pointers(X0, cy + CW + 22, [{ id: 'k', at: k, tone: 'warn' }]),
        ...extra,
        chip('st', W / 2, 172, status, { size: 13 }),
      ],
    });
    const frames: SceneFrame[] = [
      {
        kind: 'search',
        scene: scene(4, (c) => (c === 4 ? { tone: 'warn', ring: true } : {}), [hop('h0', X0, cy, 0, 4, { tone: 'warn', dashed: true }), hop('h9', X0, cy, 9, 4, { tone: 'warn', dashed: true })], seg('binary_search(nums, 6)  →  ', ['k = 4', 'warn', true])),
        say: NAIVE_SAY.search[l],
      },
    ];
    for (const k of [3, 2]) {
      frames.push({
        kind: 'walk',
        scene: scene(k, (c) => (c === k ? { tone: 'accent', ring: true } : c > k && c <= 4 ? { tone: 'warn' } : {}), [hop('w', X0, cy, k + 1, k, { lift: 10 })], seg('nums[', [String(k), 'warn', true], '] == ', ['6', 'accent'], '  →  k - 1')),
        say: fmt(NAIVE_SAY.walk[l], { k }),
      });
    }
    frames.push(
      {
        kind: 'stop',
        scene: scene(1, (c) => (c === 1 ? { tone: 'danger', ring: true } : c >= 2 && c <= 4 ? { tone: 'warn' } : {}), [hop('w', X0, cy, 2, 1, { lift: 10, tone: 'danger' })], seg('nums[', ['1', 'warn', true], '] = 3 != ', ['6', 'accent'])),
        say: NAIVE_SAY.stop[l],
      },
      {
        kind: 'done',
        scene: scene(2, (c) => (c === 2 ? { tone: 'ok', ring: true } : c > 2 && c <= 4 ? { tone: 'warn' } : {}), [], seg('return ', ['2', 'ok', true])),
        say: NAIVE_SAY.done[l],
      },
    );
    return { frames };
  },
};

// ── Insertion point: binary search with duplicates ────────────────────

type InsKind = 'init' | 'mid' | 'lt' | 'gt' | 'eq' | 'done';

const INS_SAY: Record<InsKind, T> = {
  init: {
    en: 'Find the insertion point of target = 6 in an array with duplicates. Start with the closed interval [0, 9].',
    zh: '在含重复元素的数组中查找 target = 6 的插入点。初始化双闭区间 [0, 9]。',
    'zh-hant': '在含重複元素的陣列中查詢 target = 6 的插入點。初始化雙閉區間 [0, 9]。',
    ja: '重複要素を含む配列で target = 6 の挿入位置を探します。両閉区間 [0, 9] から始めます。',
    ru: 'Ищем точку вставки target = 6 в массиве с повторами. Начинаем с замкнутого интервала [0, 9].',
  },
  mid: {
    en: 'Midpoint m = ⌊({i} + {j}) / 2⌋ = {m}. Compare nums[{m}] = {a} with target = 6.',
    zh: '计算中点 m = ⌊({i} + {j}) / 2⌋ = {m}，比较 nums[{m}] = {a} 与 target = 6。',
    'zh-hant': '計算中點 m = ⌊({i} + {j}) / 2⌋ = {m}，比較 nums[{m}] = {a} 與 target = 6。',
    ja: '中点 m = ⌊({i} + {j}) / 2⌋ = {m} を計算し、nums[{m}] = {a} と target = 6 を比べます。',
    ru: 'Середина m = ⌊({i} + {j}) / 2⌋ = {m}. Сравниваем nums[{m}] = {a} с target = 6.',
  },
  lt: {
    en: 'nums[m] < target, so target is in [m + 1, j]: i = m + 1 = {i}.',
    zh: 'nums[m] < target，说明 target 在区间 [m + 1, j] 中：i = m + 1 = {i}。',
    'zh-hant': 'nums[m] < target，說明 target 在區間 [m + 1, j] 中：i = m + 1 = {i}。',
    ja: 'nums[m] < target なので、target は区間 [m + 1, j] にあります：i = m + 1 = {i}。',
    ru: 'nums[m] < target, значит target в интервале [m + 1, j]: i = m + 1 = {i}.',
  },
  gt: {
    en: 'nums[m] > target, so target is in [i, m − 1]: j = m − 1 = {j}.',
    zh: 'nums[m] > target，说明 target 在区间 [i, m − 1] 中：j = m − 1 = {j}。',
    'zh-hant': 'nums[m] > target，說明 target 在區間 [i, m − 1] 中：j = m − 1 = {j}。',
    ja: 'nums[m] > target なので、target は区間 [i, m − 1] にあります：j = m − 1 = {j}。',
    ru: 'nums[m] > target, значит target в интервале [i, m − 1]: j = m − 1 = {j}.',
  },
  eq: {
    en: 'nums[m] == target: the elements less than target are in [i, m − 1], so j = m − 1 = {j} moves j toward them.',
    zh: 'nums[m] == target：小于 target 的元素在区间 [i, m − 1] 中，因此 j = m − 1 = {j}，使 j 向小于 target 的元素靠近。',
    'zh-hant': 'nums[m] == target：小於 target 的元素在區間 [i, m − 1] 中，因此 j = m − 1 = {j}，使 j 向小於 target 的元素靠近。',
    ja: 'nums[m] == target：target より小さい要素は区間 [i, m − 1] にあるので、j = m − 1 = {j} として j をそれらに近づけます。',
    ru: 'nums[m] == target: элементы меньше target лежат в [i, m − 1], поэтому j = m − 1 = {j} — так j приближается к ним.',
  },
  done: {
    en: 'i > j, so the loop ends. i points to the leftmost 6 and j to the last element less than 6: return i = {i}.',
    zh: 'i > j，循环结束。i 指向最左边的 6，j 指向最右一个小于 6 的元素：返回插入点 i = {i}。',
    'zh-hant': 'i > j，迴圈結束。i 指向最左邊的 6，j 指向最右一個小於 6 的元素：返回插入點 i = {i}。',
    ja: 'i > j となりループが終わります。i は最も左の 6 を、j は 6 より小さい最も右の要素を指します：挿入位置 i = {i} を返します。',
    ru: 'i > j, цикл завершён. i указывает на самый левый 6, а j — на самый правый элемент меньше 6: возвращаем i = {i}.',
  },
};

const binarySearchInsertionSteps: StepFigure = {
  type: 'steps',
  call: 'binary_search_insertion(nums, 6)',
  tones: { init: 'idle', mid: 'cmp', lt: 'swp', gt: 'swp', eq: 'swp', done: 'done' },
  sources: funcSources(INS_PY, INS_JAVA, ['binary_search_insertion'], {
    python: {
      init: ['i, j = 0, len(nums) - 1'],
      mid: ['m = (i + j) // 2'],
      lt: ['if nums[m] < target:', 'i = m + 1'],
      gt: ['elif nums[m] > target:', 'j = m - 1'],
      eq: ['else:', '2|j = m - 1'],
      done: ['return i'],
    },
    java: {
      init: ['int i = 0, j = nums.length - 1;'],
      mid: ['int m = i + (j - i) / 2;'],
      lt: ['if (nums[m] < target) {', 'i = m + 1;'],
      gt: ['} else if (nums[m] > target) {', 'j = m - 1;'],
      eq: ['} else {', '2|j = m - 1;'],
      done: ['return i;'],
    },
  }),
  build(l) {
    const target = 6;
    const cy = 62;
    const scene = (s: { i: number; j: number; m: number | null; kind: InsKind }, status: Rich) => {
      const { i, j, m, kind } = s;
      const done = kind === 'done';
      const nodes: SceneNode[] = [
        chip('t', X0, 10, seg(['target', 'accent', true], ' = ', ['6', 'accent', true]), { align: 'start', size: 13 }),
        text('vars', X0 + rowWidth(10, CW, CG), 29, seg('i = ', [String(i), TONE.i, true], '   j = ', [String(j), TONE.j, true], '   m = ', [m === null ? '-' : String(m), TONE.m, true]), { anchor: 'end', mono: true, size: 13 }),
        numsLabel(cy),
        ...row('a', X0, cy, DUP, (k) => {
          if (done) return k === i ? { tone: 'ok', ring: true } : { dim: true };
          if (k === m) return { tone: 'warn', ring: kind === 'mid', dim: k < i || k > j };
          return { dim: k < i || k > j };
        }),
        ...idx('x', X0, cy + CW + 16, DUP.length),
        ...pointers(X0, cy + CW + 22, [
          { id: 'i', at: i, tone: TONE.i },
          ...(m !== null && !done ? [{ id: 'm', at: m, tone: TONE.m }] : []),
          { id: 'j', at: j, tone: TONE.j },
        ]),
        chip('st', W / 2, 164, status, { size: 13 }),
      ];
      if (i <= j) nodes.unshift(band('band', X0, cy - 6, i, j, CW + 12));
      return { w: W, h: 202, nodes };
    };
    let i = 0;
    let j = DUP.length - 1;
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene({ i, j, m: null, kind: 'init' }, seg(['i', TONE.i], ', ', ['j', TONE.j], ' = 0, len(nums) - 1')), say: INS_SAY.init[l] }];
    while (i <= j) {
      const m = Math.floor((i + j) / 2);
      const a = DUP[m];
      frames.push({
        kind: 'mid',
        scene: scene({ i, j, m, kind: 'mid' }, seg(['m', TONE.m], ' = ⌊(', [String(i), TONE.i], ' + ', [String(j), TONE.j], ') / 2⌋ = ', [String(m), TONE.m, true])),
        say: fmt(INS_SAY.mid[l], { i, j, m, a }),
      });
      const kind: InsKind = a < target ? 'lt' : a > target ? 'gt' : 'eq';
      const op = kind === 'lt' ? '<' : kind === 'gt' ? '>' : '==';
      if (kind === 'lt') i = m + 1;
      else j = m - 1;
      const move = kind === 'lt' ? seg(['i', TONE.i], ' = ', ['m', TONE.m], ' + 1 = ', [String(i), TONE.i, true]) : seg(['j', TONE.j], ' = ', ['m', TONE.m], ' - 1 = ', [String(j), TONE.j, true]);
      frames.push({
        kind,
        scene: scene({ i, j, m, kind }, [...seg('nums[', [String(m), TONE.m], `] ${op} target  →  `), ...move]),
        say: fmt(INS_SAY[kind][l], { i, j }),
      });
    }
    frames.push({ kind: 'done', scene: scene({ i, j, m: null, kind: 'done' }, seg(['i', TONE.i], ' > ', ['j', TONE.j], '  →  return ', [String(i), 'ok', true])), say: fmt(INS_SAY.done[l], { i }) });
    return { frames };
  },
};

// ── Edges by searching for a value that is not there ──────────────────

const EDGE_SAY: Record<'init' | 'left' | 'right' | 'done', T> = {
  init: {
    en: 'target = 6 appears five times. Searching for a value that is not in the array leaves i and j right at the edges of the 6s.',
    zh: 'target = 6 出现了 5 次。查找一个数组中不存在的元素，可以让 i 和 j 恰好停在这些 6 的边界上。',
    'zh-hant': 'target = 6 出現了 5 次。查詢一個陣列中不存在的元素，可以讓 i 和 j 恰好停在這些 6 的邊界上。',
    ja: 'target = 6 は 5 回現れます。配列に存在しない値を探すと、i と j はちょうど 6 の並びの境界で止まります。',
    ru: 'target = 6 встречается пять раз. Если искать значение, которого нет в массиве, i и j остановятся ровно на границах блока из 6.',
  },
  left: {
    en: 'Search for target − 0.5 = 5.5. At the end i points to the first element greater than 5.5, the leftmost 6: return i = 2.',
    zh: '查找 target − 0.5 = 5.5。结束时 i 指向首个大于 5.5 的元素，即最左一个 6：返回 i = 2。',
    'zh-hant': '查詢 target − 0.5 = 5.5。結束時 i 指向首個大於 5.5 的元素，即最左一個 6：返回 i = 2。',
    ja: 'target − 0.5 = 5.5 を探します。終了時、i は 5.5 より大きい最初の要素、つまり最も左の 6 を指します：i = 2 を返します。',
    ru: 'Ищем target − 0.5 = 5.5. В конце i указывает на первый элемент больше 5.5 — самый левый 6: возвращаем i = 2.',
  },
  right: {
    en: 'Search for target + 0.5 = 6.5. At the end j points to the rightmost element less than 6.5, the rightmost 6: return j = 6.',
    zh: '查找 target + 0.5 = 6.5。结束时 j 指向最右一个小于 6.5 的元素，即最右一个 6：返回 j = 6。',
    'zh-hant': '查詢 target + 0.5 = 6.5。結束時 j 指向最右一個小於 6.5 的元素，即最右一個 6：返回 j = 6。',
    ja: 'target + 0.5 = 6.5 を探します。終了時、j は 6.5 より小さい最も右の要素、つまり最も右の 6 を指します：j = 6 を返します。',
    ru: 'Ищем target + 0.5 = 6.5. В конце j указывает на самый правый элемент меньше 6.5 — самый правый 6: возвращаем j = 6.',
  },
  done: {
    en: 'The 6s span indices 2 to 6. The array holds no decimals, so 5.5 and 6.5 never equal an element and ties need no handling.',
    zh: '所有 6 位于索引 2 到 6。给定数组不包含小数，因此无须关心如何处理相等的情况。',
    'zh-hant': '所有 6 位於索引 2 到 6。給定陣列不包含小數，因此無須關心如何處理相等的情況。',
    ja: '6 はインデックス 2 から 6 に並びます。配列には小数がないので、等しい場合の処理を気にする必要はありません。',
    ru: 'Шестёрки занимают индексы 2–6. В массиве нет дробных чисел, поэтому случай равенства обрабатывать не нужно.',
  },
};

const EDGE_CHIP: T = {
  en: 'left edge {l}, right edge {r}',
  zh: '左边界 {l}，右边界 {r}',
  'zh-hant': '左邊界 {l}，右邊界 {r}',
  ja: '左端境界 {l}、右端境界 {r}',
  ru: 'левая граница {l}, правая граница {r}',
};

const binarySearchEdgeByElement: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', left: 'cmp', right: 'cmp', done: 'done' },
  build(l) {
    const cy = 74;
    const six = (k: number) => DUP[k] === 6;
    const scene = (look: (k: number) => Partial<Cell>, ps: Ptr[], extra: SceneNode[], status: Rich, sans = false) => ({
      w: W,
      h: 214,
      nodes: [
        text('t', X0, 22, seg(['target', 'accent', true], ' = ', ['6', 'accent', true]), { mono: true, size: 13 }),
        numsLabel(cy),
        ...row('a', X0, cy, DUP, look),
        ...idx('x', X0, cy + CW + 16, DUP.length),
        ...pointers(X0, cy + CW + 22, ps),
        ...extra,
        chip('st', W / 2, 176, status, { size: 13, sans }),
      ],
    });
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene((k) => (six(k) ? { tone: 'warn' } : {}), [], [], seg('nums[2..6] == ', ['6', 'accent', true])),
        say: EDGE_SAY.init[l],
      },
      {
        kind: 'left',
        scene: scene(
          (k) => (k === 2 ? { tone: 'ok', ring: true } : six(k) ? { tone: 'warn' } : {}),
          [
            { id: 'j', at: 1, tone: TONE.j },
            { id: 'i', at: 2, tone: TONE.i },
          ],
          phantom('ph', X0, 32, 2, seg(['5.5', 'info', true]), cy),
          seg('target - 0.5 = ', ['5.5', 'info'], '  →  return ', ['i', TONE.i], ' = ', ['2', 'ok', true]),
        ),
        say: EDGE_SAY.left[l],
      },
      {
        kind: 'right',
        scene: scene(
          (k) => (k === 6 ? { tone: 'ok', ring: true } : six(k) ? { tone: 'warn' } : {}),
          [
            { id: 'j', at: 6, tone: TONE.j },
            { id: 'i', at: 7, tone: TONE.i },
          ],
          phantom('ph', X0, 32, 7, seg(['6.5', 'info', true]), cy),
          seg('target + 0.5 = ', ['6.5', 'info'], '  →  return ', ['j', TONE.j], ' = ', ['6', 'ok', true]),
        ),
        say: EDGE_SAY.right[l],
      },
      {
        kind: 'done',
        scene: scene(
          (k) => (k === 2 || k === 6 ? { tone: 'ok', ring: true } : six(k) ? { tone: 'warn' } : {}),
          [
            { id: 'i', at: 2, tone: TONE.i },
            { id: 'j', at: 6, tone: TONE.j },
          ],
          [band('band', X0, cy - 6, 2, 6, CW + 12, 'ok')],
          fmt(EDGE_CHIP[l], { l: 2, r: 6 }),
          true,
        ),
        say: EDGE_SAY.done[l],
      },
    ];
    return { frames };
  },
};

// ── Right edge = left edge of target + 1, minus one ───────────────────

const RIGHT_SAY: Record<'init' | 'left' | 'plus' | 'minus' | 'done', T> = {
  init: {
    en: 'Find the rightmost 6 by reusing binary_search_insertion, the function that finds the leftmost element.',
    zh: '复用查找插入点的函数 binary_search_insertion（它查找最左一个元素），来查找最右一个 6。',
    'zh-hant': '複用查詢插入點的函式 binary_search_insertion（它查詢最左一個元素），來查詢最右一個 6。',
    ja: '最も左の要素を探す関数 binary_search_insertion を再利用して、最も右の 6 を探します。',
    ru: 'Найдём самый правый 6, переиспользовав binary_search_insertion — функцию, которая ищет самый левый элемент.',
  },
  left: {
    en: 'For comparison: binary_search_insertion(nums, 6) returns 2, the leftmost 6.',
    zh: '作为对照：binary_search_insertion(nums, 6) 返回 2，即最左一个 6。',
    'zh-hant': '作為對照：binary_search_insertion(nums, 6) 返回 2，即最左一個 6。',
    ja: '比較のため：binary_search_insertion(nums, 6) は最も左の 6 の位置 2 を返します。',
    ru: 'Для сравнения: binary_search_insertion(nums, 6) возвращает 2 — самый левый 6.',
  },
  plus: {
    en: 'Now search for the leftmost target + 1 = 7. There is no 7, so i stops at 7, the first element greater than 6.',
    zh: '转而查找最左一个 target + 1 = 7。数组中没有 7，i 停在索引 7，即首个大于 6 的元素。',
    'zh-hant': '轉而查詢最左一個 target + 1 = 7。陣列中沒有 7，i 停在索引 7，即首個大於 6 的元素。',
    ja: '次に最も左の target + 1 = 7 を探します。7 はないので、i は 6 より大きい最初の要素の位置 7 で止まります。',
    ru: 'Теперь ищем самый левый target + 1 = 7. Семёрки нет, поэтому i останавливается на 7 — первом элементе больше 6.',
  },
  minus: {
    en: 'The element just before i is the rightmost 6: j = i − 1 = 6.',
    zh: 'i 的前一个元素就是最右一个 6：j = i − 1 = 6。',
    'zh-hant': 'i 的前一個元素就是最右一個 6：j = i − 1 = 6。',
    ja: 'i の直前の要素が最も右の 6 です：j = i − 1 = 6。',
    ru: 'Элемент прямо перед i — самый правый 6: j = i − 1 = 6.',
  },
  done: {
    en: 'nums[6] == target, so return j = 6. If j were −1 or nums[j] ≠ target, the array would have no target and the result would be −1.',
    zh: 'nums[6] == target，返回 j = 6。若 j 为 −1 或 nums[j] ≠ target，说明数组中没有 target，返回 −1。',
    'zh-hant': 'nums[6] == target，返回 j = 6。若 j 為 −1 或 nums[j] ≠ target，說明陣列中沒有 target，返回 −1。',
    ja: 'nums[6] == target なので j = 6 を返します。j が −1 か nums[j] ≠ target なら配列に target はなく、−1 を返します。',
    ru: 'nums[6] == target, возвращаем j = 6. Если бы j был −1 или nums[j] ≠ target, target в массиве не было бы и результат был бы −1.',
  },
};

const binarySearchRightEdgeByLeftEdge: StepFigure = {
  type: 'steps',
  call: 'binary_search_right_edge(nums, 6)',
  tones: { init: 'idle', left: 'cmp', plus: 'cmp', minus: 'swp', done: 'done' },
  sources: funcSources(EDGE_PY, EDGE_JAVA, ['binary_search_left_edge', 'binary_search_right_edge'], {
    python: {
      init: ['def binary_search_right_edge('],
      left: ['i = binary_search_insertion(nums, target)'],
      plus: ['i = binary_search_insertion(nums, target + 1)'],
      minus: ['j = i - 1'],
      done: ['if j == -1 or nums[j] != target:', 'return j'],
    },
    java: {
      init: ['static int binarySearchRightEdge('],
      left: ['binarySearchInsertion(nums, target);'],
      plus: ['binarySearchInsertion(nums, target + 1);'],
      minus: ['int j = i - 1;'],
      done: ['if (j == -1 || nums[j] != target) {', 'return j;'],
    },
  }),
  build(l) {
    const cy = 74;
    const six = (k: number) => DUP[k] === 6;
    const scene = (look: (k: number) => Partial<Cell>, ps: Ptr[], extra: SceneNode[], status: Rich | null) => ({
      w: W,
      h: 214,
      nodes: [
        text('t', X0, 22, seg(['target', 'accent', true], ' = ', ['6', 'accent', true]), { mono: true, size: 13 }),
        numsLabel(cy),
        ...row('a', X0, cy, DUP, look),
        ...idx('x', X0, cy + CW + 16, DUP.length),
        ...pointers(X0, cy + CW + 22, ps),
        ...extra,
        ...(status ? [chip('st', W / 2, 176, status, { size: 13 })] : []),
      ],
    });
    const call = (v: number, r: number) => seg('binary_search_insertion(nums, ', [String(v), 'info', true], ')  →  ', [String(r), TONE.i, true]);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene((k) => (six(k) ? { tone: 'warn' } : {}), [], [], null), say: RIGHT_SAY.init[l] },
      {
        kind: 'left',
        scene: scene((k) => (k === 2 ? { tone: 'accent', ring: true } : six(k) ? { tone: 'warn' } : {}), [{ id: 'i', at: 2, tone: TONE.i }], [], call(6, 2)),
        say: RIGHT_SAY.left[l],
      },
      {
        kind: 'plus',
        scene: scene((k) => (k === 7 ? { tone: 'accent', ring: true } : six(k) ? { tone: 'warn' } : {}), [{ id: 'i', at: 7, tone: TONE.i }], phantom('ph', X0, 32, 7, seg(['7', 'info', true]), cy), call(7, 7)),
        say: RIGHT_SAY.plus[l],
      },
      {
        kind: 'minus',
        scene: scene(
          (k) => (k === 6 ? { tone: 'ok', ring: true } : k === 7 ? { tone: 'accent' } : six(k) ? { tone: 'warn' } : {}),
          [
            { id: 'j', at: 6, tone: TONE.j },
            { id: 'i', at: 7, tone: TONE.i },
          ],
          [hop('back', X0, cy, 7, 6, { tone: TONE.j, lift: 10 })],
          seg(['j', TONE.j], ' = ', ['i', TONE.i], ' - 1 = ', ['6', TONE.j, true]),
        ),
        say: RIGHT_SAY.minus[l],
      },
      {
        kind: 'done',
        scene: scene((k) => (k === 6 ? { tone: 'ok', ring: true } : six(k) ? { tone: 'warn' } : {}), [{ id: 'j', at: 6, tone: TONE.j }], [], seg('nums[', ['6', TONE.j], '] == target  →  return ', ['6', 'ok', true])),
        say: RIGHT_SAY.done[l],
      },
    ];
    return { frames };
  },
};

// ── Two sum ───────────────────────────────────────────────────────────

const TWO = [2, 7, 11, 15];
const SUM_TARGET = 13;

const BRUTE_SAY: Record<'init' | 'check' | 'found' | 'worst', T> = {
  init: {
    en: 'Linear search: two nested loops try every pair i < j and check whether nums[i] + nums[j] equals target = 13.',
    zh: '线性查找：开启两层循环遍历所有组合 i < j，判断 nums[i] + nums[j] 是否等于 target = 13。',
    'zh-hant': '線性查詢：開啟兩層迴圈走訪所有組合 i < j，判斷 nums[i] + nums[j] 是否等於 target = 13。',
    ja: '線形探索：2 重ループですべての組み合わせ i < j を走査し、nums[i] + nums[j] が target = 13 かを判定します。',
    ru: 'Линейный поиск: два вложенных цикла перебирают все пары i < j и проверяют, равна ли nums[i] + nums[j] значению target = 13.',
  },
  check: {
    en: 'i = {i}, j = {j}: {a} + {b} = {s} ≠ 13, so try the next pair.',
    zh: 'i = {i}，j = {j}：{a} + {b} = {s} ≠ 13，继续下一组。',
    'zh-hant': 'i = {i}，j = {j}：{a} + {b} = {s} ≠ 13，繼續下一組。',
    ja: 'i = {i}、j = {j}：{a} + {b} = {s} ≠ 13 なので、次の組へ進みます。',
    ru: 'i = {i}, j = {j}: {a} + {b} = {s} ≠ 13, проверяем следующую пару.',
  },
  found: {
    en: 'i = {i}, j = {j}: {a} + {b} = 13 = target. Return [{i}, {j}].',
    zh: 'i = {i}，j = {j}：{a} + {b} = 13 = target，返回 [{i}, {j}]。',
    'zh-hant': 'i = {i}，j = {j}：{a} + {b} = 13 = target，返回 [{i}, {j}]。',
    ja: 'i = {i}、j = {j}：{a} + {b} = 13 = target なので、[{i}, {j}] を返します。',
    ru: 'i = {i}, j = {j}: {a} + {b} = 13 = target. Возвращаем [{i}, {j}].',
  },
  worst: {
    en: 'In the worst case every pair in the table is checked, n(n − 1)/2 of them: O(n²) time, but only O(1) extra space.',
    zh: '最差情况下要检查表中全部 n(n − 1)/2 个组合：时间复杂度为 O(n²)，空间复杂度为 O(1)。',
    'zh-hant': '最差情況下要檢查表中全部 n(n − 1)/2 個組合：時間複雜度為 O(n²)，空間複雜度為 O(1)。',
    ja: '最悪の場合、表のすべての組み合わせ n(n − 1)/2 個を調べます：時間計算量は O(n²)、空間計算量は O(1) です。',
    ru: 'В худшем случае проверяются все n(n − 1)/2 пар из таблицы: время O(n²), зато дополнительная память O(1).',
  },
};

const twoSumBruteForce: StepFigure = {
  type: 'steps',
  call: 'two_sum_brute_force(nums, 13)',
  tones: { init: 'idle', check: 'cmp', found: 'done', worst: 'swp' },
  sources: funcSources(SUM_PY, SUM_JAVA, ['two_sum_brute_force'], {
    python: {
      init: ['for i in range(len(nums) - 1):', 'for j in range(i + 1, len(nums)):'],
      check: ['if nums[i] + nums[j] == target:'],
      found: ['return [i, j]'],
      worst: ['for i in range(len(nums) - 1):', 'for j in range(i + 1, len(nums)):'],
    },
    java: {
      init: ['for (int i = 0; i < size - 1; i++) {', 'for (int j = i + 1; j < size; j++) {'],
      check: ['if (nums[i] + nums[j] == target)'],
      found: ['return new int[] { i, j };'],
      worst: ['for (int i = 0; i < size - 1; i++) {', 'for (int j = i + 1; j < size; j++) {'],
    },
  }),
  build(l) {
    const w = 36;
    const gap = 4;
    const x0 = 26;
    const cy = 48;
    // The table of pair sums: column headers are nums[j], row headers nums[i].
    const gw = 38;
    const gs = 42;
    const gx = 252;
    const gy = 30;
    type Fill = 'none' | 'current' | 'past' | 'found' | 'all';
    const scene = (cur: { i: number; j: number } | null, fill: (r: number, c: number) => Fill, status: Rich | null) => {
      const nodes: SceneNode[] = [
        text('t', x0, 24, seg(['target', 'accent', true], ' = ', ['13', 'accent', true]), { mono: true, size: 13 }),
        ...row('a', x0, cy, TWO, (k) => (cur && (k === cur.i || k === cur.j) ? { tone: k === cur.i ? 'accent' : 'info', ring: true } : {}), w, gap),
        ...idx('x', x0, cy + w + 16, TWO.length, () => undefined, w, gap),
        ...(cur
          ? pointers(
              x0,
              cy + w + 22,
              [
                { id: 'i', at: cur.i, tone: TONE.i },
                { id: 'j', at: cur.j, tone: TONE.j },
              ],
              w,
              gap,
            )
          : []),
        // The empty corner names the axes: rows are i, columns are j.
        { kind: 'path', id: 'g:corner', d: `M ${gx - gs + 4} ${gy + 4} L ${gx - gs + gw - 4} ${gy + gw - 4}`, tone: 'muted', width: 1 },
        text('g:j', gx - gs + gw - 6, gy + 15, 'j', { anchor: 'end', mono: true, bold: true, size: 13, tone: TONE.j }),
        text('g:i', gx - gs + 6, gy + gw - 4, 'i', { mono: true, bold: true, size: 13, tone: TONE.i }),
      ];
      TWO.forEach((v, c) => nodes.push(box(`gc${c}`, gx + c * gs, gy, v, { w: gw, h: gw, size: 14, tone: cur?.j === c ? 'info' : 'ok' })));
      TWO.slice(0, -1).forEach((v, r) => {
        nodes.push(box(`gr${r}`, gx - gs, gy + (r + 1) * gs, v, { w: gw, h: gw, size: 14, tone: cur?.i === r ? 'accent' : 'ok' }));
        for (let c = r + 1; c < TWO.length; c++) {
          const f = fill(r, c);
          const s = TWO[r] + TWO[c];
          const x = gx + c * gs;
          const y = gy + (r + 1) * gs;
          if (f === 'none') nodes.push(box(`s${r}${c}`, x, y, '', { w: gw, h: gw, tone: 'ghost', dashed: true }));
          else
            nodes.push(
              box(`s${r}${c}`, x, y, s, {
                w: gw,
                h: gw,
                size: 14,
                tone: f === 'found' ? 'ok' : f === 'current' ? 'warn' : 'muted',
                ring: f === 'found' || f === 'current',
              }),
            );
        }
      });
      if (status) nodes.push(chip('st', x0 + rowWidth(4, w, gap) / 2, 164, status, { size: 13 }));
      return { w: W, h: 210, nodes };
    };
    const order: [number, number][] = [];
    for (let i = 0; i < TWO.length - 1; i++) for (let j = i + 1; j < TWO.length; j++) order.push([i, j]);
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null, () => 'none', null), say: BRUTE_SAY.init[l] }];
    let found: [number, number] = [0, 0];
    for (let k = 0; k < order.length; k++) {
      const [i, j] = order[k];
      const a = TWO[i];
      const b = TWO[j];
      const s = a + b;
      const seen = (r: number, c: number): Fill => {
        const at = order.findIndex(([x, y]) => x === r && y === c);
        return at < k ? 'past' : at === k ? (s === SUM_TARGET ? 'found' : 'current') : 'none';
      };
      const ok = s === SUM_TARGET;
      frames.push({
        kind: ok ? 'found' : 'check',
        scene: scene({ i, j }, seen, seg([String(a), TONE.i], ' + ', [String(b), TONE.j], ' = ', [String(s), ok ? 'ok' : 'warn', true], ok ? ' == 13' : ' != 13')),
        say: fmt(BRUTE_SAY[ok ? 'found' : 'check'][l], { i, j, a, b, s }),
      });
      if (ok) {
        found = [i, j];
        break;
      }
    }
    frames.push({
      kind: 'worst',
      scene: scene(null, (r, c) => (r === found[0] && c === found[1] ? 'found' : 'all'), seg('n(n-1)/2  →  O(n', [sup(2)], ')')),
      say: BRUTE_SAY.worst[l],
    });
    return { frames };
  },
};

const HASH_SAY: Record<'init' | 'miss' | 'store' | 'hit' | 'found', T> = {
  init: {
    en: 'Use a hash table dic: key = element, value = its index. Traverse nums once; dic starts empty.',
    zh: '借助哈希表 dic：键为数组元素，值为元素索引。单层循环遍历 nums，dic 初始为空。',
    'zh-hant': '藉助雜湊表 dic：鍵為陣列元素，值為元素索引。單層迴圈走訪 nums，dic 初始為空。',
    ja: 'ハッシュテーブル dic を使います：キーは配列要素、値はそのインデックスです。nums を 1 回だけ走査し、dic は最初は空です。',
    ru: 'Заводим хеш-таблицу dic: ключ — элемент, значение — его индекс. Проходим nums один раз; сначала dic пуст.',
  },
  miss: {
    en: 'i = {i}: is target − nums[i] = 13 − {x} = {need} in dic? No.',
    zh: 'i = {i}：target − nums[i] = 13 − {x} = {need} 在哈希表中吗？不在。',
    'zh-hant': 'i = {i}：target − nums[i] = 13 − {x} = {need} 在雜湊表中嗎？不在。',
    ja: 'i = {i}：target − nums[i] = 13 − {x} = {need} はハッシュテーブルにある？ありません。',
    ru: 'i = {i}: есть ли target − nums[i] = 13 − {x} = {need} в хеш-таблице? Нет.',
  },
  store: {
    en: 'Add the pair {x} → {i} to dic, so a later element can find it.',
    zh: '将键值对 {x} → {i} 添加进哈希表，供后面的元素查询。',
    'zh-hant': '將鍵值對 {x} → {i} 新增進雜湊表，供後面的元素查詢。',
    ja: 'キーと値の組 {x} → {i} をハッシュテーブルに追加し、後の要素から見つけられるようにします。',
    ru: 'Добавляем пару {x} → {i} в хеш-таблицу, чтобы следующие элементы могли её найти.',
  },
  hit: {
    en: 'i = {i}: target − nums[i] = 13 − {x} = {need} is in dic, with index {k}.',
    zh: 'i = {i}：target − nums[i] = 13 − {x} = {need} 在哈希表中，其索引为 {k}。',
    'zh-hant': 'i = {i}：target − nums[i] = 13 − {x} = {need} 在雜湊表中，其索引為 {k}。',
    ja: 'i = {i}：target − nums[i] = 13 − {x} = {need} はハッシュテーブルにあり、インデックスは {k} です。',
    ru: 'i = {i}: target − nums[i] = 13 − {x} = {need} есть в хеш-таблице, его индекс {k}.',
  },
  found: {
    en: 'Return [{k}, {i}]. A single loop with O(1) lookups takes O(n) time; the hash table takes O(n) extra space.',
    zh: '返回 [{k}, {i}]。单层循环配合 O(1) 的哈希查找，时间复杂度为 O(n)；哈希表占用 O(n) 额外空间。',
    'zh-hant': '返回 [{k}, {i}]。單層迴圈配合 O(1) 的雜湊查詢，時間複雜度為 O(n)；雜湊表佔用 O(n) 額外空間。',
    ja: '[{k}, {i}] を返します。O(1) のハッシュ探索を使う単一ループなので時間計算量は O(n)、ハッシュテーブルが O(n) の追加領域を使います。',
    ru: 'Возвращаем [{k}, {i}]. Один цикл с поиском за O(1) — время O(n); хеш-таблица занимает O(n) дополнительной памяти.',
  },
};

const HASH_LEGEND: Record<'key' | 'value', T> = {
  key: { en: 'key: element', zh: '键：数组元素', 'zh-hant': '鍵：陣列元素', ja: 'キー：配列要素', ru: 'ключ: элемент' },
  value: { en: 'value: index', zh: '值：元素索引', 'zh-hant': '值：元素索引', ja: '値：インデックス', ru: 'значение: индекс' },
};

const twoSumHashtableSteps: StepFigure = {
  type: 'steps',
  call: 'two_sum_hash_table(nums, 13)',
  tones: { init: 'idle', lookup: 'cmp', store: 'swp', found: 'done' },
  sources: funcSources(SUM_PY, SUM_JAVA, ['two_sum_hash_table'], {
    python: {
      init: ['dic = {}'],
      lookup: ['for i in range(len(nums)):', 'if target - nums[i] in dic:'],
      store: ['dic[nums[i]] = i'],
      found: ['return [dic[target - nums[i]], i]'],
    },
    java: {
      init: ['Map<Integer, Integer> dic = new HashMap<>();'],
      lookup: ['for (int i = 0; i < size; i++) {', 'if (dic.containsKey(target - nums[i])) {'],
      store: ['dic.put(nums[i], i);'],
      found: ['return new int[] { dic.get(target - nums[i]), i };'],
    },
  }),
  build(l) {
    const w = 40;
    const gap = 6;
    const x0 = (W - rowWidth(4, w, gap)) / 2;
    const cy = 22;
    const reg = { x: 20, y: 166, w: W - 40, h: 62 };
    const kw = 48;
    const pw = pairWidth(kw, kw);
    const px = (k: number) => 96 + k * (pw + 18);
    const py = reg.y + (reg.h - 32) / 2;
    type Look = { cur: number | null; dic: number; ring?: number; hit?: number; status?: Rich; done?: boolean };
    const scene = (s: Look) => {
      const nodes: SceneNode[] = [
        text('l:nums', x0 - 10, cy + w / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
        text('t', W - 20, cy + w / 2 + 5, seg(['target', 'accent', true], ' = ', ['13', 'accent', true]), { anchor: 'end', mono: true, size: 13 }),
        ...cells(
          'a',
          x0,
          cy,
          TWO.map((v, k) => {
            if (s.done && (k === s.cur || k === s.hit)) return { value: v, tone: 'ok', ring: true };
            if (k === s.cur) return { value: v, tone: 'accent', ring: true };
            if (k === s.hit) return { value: v, tone: 'info' };
            return { value: v, dim: s.cur !== null && k > s.cur };
          }),
          { w, h: w, gap },
        ),
        ...idx('x', x0, cy + w + 16, TWO.length, () => undefined, w, gap),
        ...(s.cur !== null ? pointers(x0, cy + w + 22, [{ id: 'i', at: s.cur, tone: TONE.i }], w, gap) : []),
        region('dic', reg.x, reg.y, reg.w, reg.h, { tone: 'info', label: seg(['dic', 'info', true]), labelAt: 'inside' }),
      ];
      for (let k = 0; k < s.dic; k++) {
        const on = s.ring === k || s.hit === k;
        nodes.push(...pair(`d${k}`, px(k), py, TWO[k], k, { kw, vw: kw, ring: on }));
      }
      if (s.dic === 0) nodes.push(text('empty', reg.x + reg.w / 2, py + 21, '{ }', { anchor: 'middle', mono: true, size: 15, tone: 'muted' }));
      if (s.status) nodes.push(chip('st', W / 2, 122, s.status, { size: 13 }));
      if (s.hit !== undefined && !s.done) nodes.push(arrow('look', [W / 2 - 40, 152], [px(s.hit) + kw / 2, py - 6], { tone: 'accent', width: 1.75, bend: 6 }));
      return { w: W, h: 236, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene({ cur: null, dic: 0 }), say: HASH_SAY.init[l] }];
    const where = new Map<number, number>();
    for (let i = 0; i < TWO.length; i++) {
      const x = TWO[i];
      const need = SUM_TARGET - x;
      const hit = where.get(need);
      const ask = (yes: boolean) => seg('13 - ', [String(x), TONE.i], ' = ', [String(need), 'accent', true], ' in dic?  ', yes ? ['✓', 'ok', true] : ['✗', 'danger', true]);
      if (hit !== undefined) {
        frames.push({ kind: 'lookup', scene: scene({ cur: i, dic: where.size, hit, status: ask(true) }), say: fmt(HASH_SAY.hit[l], { i, x, need, k: hit }) });
        frames.push({
          kind: 'found',
          scene: scene({ cur: i, dic: where.size, hit, done: true, status: seg('return [', [String(hit), 'ok', true], ', ', [String(i), 'ok', true], ']') }),
          say: fmt(HASH_SAY.found[l], { i, k: hit }),
        });
        break;
      }
      frames.push({ kind: 'lookup', scene: scene({ cur: i, dic: where.size, status: ask(false) }), say: fmt(HASH_SAY.miss[l], { i, x, need }) });
      where.set(x, i);
      frames.push({
        kind: 'store',
        scene: scene({ cur: i, dic: where.size, ring: i, status: seg('dic[', [String(x), 'ok', true], '] = ', [String(i), 'info', true]) }),
        say: fmt(HASH_SAY.store[l], { x, i }),
      });
    }
    return {
      frames,
      legend: [
        { tone: 'ok', text: HASH_LEGEND.key[l] },
        { tone: 'info', text: HASH_LEGEND.value[l] },
      ],
    };
  },
};

// ── Search methods side by side ───────────────────────────────────────

const METHOD: Record<'linear' | 'binary' | 'hash' | 'tree', { name: T; cost: string; note: T }> = {
  linear: {
    name: { en: 'Linear search', zh: '线性搜索', 'zh-hant': '線性搜尋', ja: '線形探索', ru: 'Линейный поиск' },
    cost: 'O(n)',
    note: { en: 'Visit elements one by one', zh: '逐个访问元素', 'zh-hant': '逐個訪問元素', ja: '要素を 1 つずつ調べる', ru: 'Перебор элементов по одному' },
  },
  binary: {
    name: { en: 'Binary search', zh: '二分查找', 'zh-hant': '二分搜尋', ja: '二分探索', ru: 'Двоичный поиск' },
    cost: 'O(log n)',
    note: { en: 'Use the order to halve the interval', zh: '利用有序性缩小搜索区间', 'zh-hant': '利用有序性縮小搜尋區間', ja: '順序を利用して区間を縮小', ru: 'Порядок сужает интервал' },
  },
  hash: {
    name: { en: 'Hash-based search', zh: '哈希查找', 'zh-hant': '雜湊查詢', ja: 'ハッシュ探索', ru: 'Хеш-поиск' },
    cost: 'O(1)',
    note: { en: 'Input a key, get its value', zh: '输入键，查询值', 'zh-hant': '輸入鍵，查詢值', ja: 'キーを入力して値を得る', ru: 'По ключу сразу значение' },
  },
  tree: {
    name: { en: 'Tree search', zh: '树查找', 'zh-hant': '樹查詢', ja: '木探索', ru: 'Поиск в дереве' },
    cost: 'O(log n)',
    note: { en: 'Binary search tree', zh: '二叉搜索树', 'zh-hant': '二元搜尋樹', ja: '二分探索木', ru: 'Двоичное дерево поиска' },
  },
};

const METHODS_NOTE: T = {
  en: 'Linear search needs no preprocessing. The other three are faster but rely on sorted data or an extra data structure.',
  zh: '线性搜索无须数据预处理；其余三种方法效率更高，但依赖有序数据或额外的数据结构。',
  'zh-hant': '線性搜尋無須資料預處理；其餘三種方法效率更高，但依賴有序資料或額外的資料結構。',
  ja: '線形探索はデータの前処理が不要です。ほかの 3 つは高速ですが、整列済みデータや追加のデータ構造が必要です。',
  ru: 'Линейный поиск не требует предварительной обработки. Остальные три быстрее, но нуждаются в упорядоченных данных или дополнительной структуре.',
};

const searchingAlgorithms: StaticFigure = {
  type: 'static',
  build(l) {
    const pw = 212;
    const ph = 150;
    const at = { linear: [6, 6], hash: [222, 6], binary: [6, 164], tree: [222, 164] } as const;
    const nodes: SceneNode[] = [];
    for (const [key, [x, y]] of Object.entries(at) as [keyof typeof at, readonly [number, number]][]) {
      const m = METHOD[key];
      nodes.push(
        region(`${key}:bg`, x, y, pw, ph, { tone: 'muted', label: seg([m.name[l], 'idle', true], '  ', [m.cost, 'accent', true]), labelAt: 'inside' }),
        text(`${key}:note`, x + pw / 2, y + ph - 12, m.note[l], { anchor: 'middle', size: 11, tone: 'muted' }),
      );
    }
    // Tiny arrays: 10 cells across a panel.
    const w = 17;
    const gap = 2;
    const tiny = (p: string, x0: number, y: number, values: number[], look: (k: number) => Partial<Cell>) =>
      cells(p, x0, y, values.map((v, k) => ({ value: v, ...look(k) })), { w, h: w, gap, size: 11 });
    const arcs = (p: string, x0: number, y: number, path: number[]) =>
      path.slice(1).map((to, k) => hop(`${p}${k}`, x0, y, path[k], to, { below: true, w, gap, width: 1.5, lift: 4 + Math.abs(to - path[k]) * 2.5 }));

    // Linear: from the left, one cell at a time, until 6.
    const lin = [1, 5, 3, 2, 4, 7, 6, 9, 0, 8];
    const lx = at.linear[0] + (pw - rowWidth(10, w, gap)) / 2;
    const ly = at.linear[1] + 60;
    // Every element before 6 is checked: one long sweep under the row.
    const sweepY = ly + w + 9;
    nodes.push(
      ...tiny('lin', lx, ly, lin, (k) => (k === 6 ? { tone: 'accent', ring: true } : k < 6 ? { tone: 'warn' } : {})),
      arrow('lin:sweep', [cellX(lx, 0, w, gap) + w / 2, sweepY], [cellX(lx, 6, w, gap) + w / 2, sweepY], { tone: 'accent', width: 1.75 }),
      ...lin.slice(0, 6).map((_, k) => arrow(`lin:t${k}`, [cellX(lx, k, w, gap) + w / 2, sweepY], [cellX(lx, k, w, gap) + w / 2, ly + w + 2], { head: 'none', tone: 'accent', width: 1.5 })),
    );

    // Binary: jump to the middle, then to the middle of the half that is left.
    const bx = at.binary[0] + (pw - rowWidth(10, w, gap)) / 2;
    const by = at.binary[1] + 60;
    nodes.push(
      ...tiny('bin', bx, by, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (k) => (k === 6 ? { tone: 'accent', ring: true } : k === 4 ? { tone: 'warn' } : k < 5 ? { dim: true } : {})),
      ...arcs('bin:h', bx, by, [0, 4, 6]),
    );

    // Hash: key 6 maps straight to its value.
    const keys = [1, 5, 3, 2, 4, 7, 6, 9, 0, 8];
    const hx = at.hash[0] + (pw - rowWidth(10, w, gap)) / 2;
    const hy = at.hash[1] + 42;
    nodes.push(...tiny('hk', hx, hy, keys, (k) => (k === 6 ? { tone: 'accent', ring: true } : { tone: 'muted' })));
    keys.forEach((v, k) => {
      const cx = cellX(hx, k, w, gap) + w / 2;
      const on = k === 6;
      nodes.push(
        arrow(`ha${k}`, [cx, hy + w + 3], [cx, hy + w + 22], { tone: on ? 'accent' : 'muted', width: on ? 1.75 : 1.25 }),
        box(`hv${k}`, cx - 8.5, hy + w + 25, v, { w: 17, h: 17, shape: 'circle', size: 11, tone: on ? 'accent' : 'ok', ring: on }),
      );
    });

    // Tree: compare and go left or right, 4 → 7 → 5 → 6.
    const root = treeFromLevels([4, 1, 7, 0, 2, 5, 8, null, null, null, 3, null, 6, null, 9]);
    const path = new Set(['n4', 'n7', 'n5', 'n6']);
    const paint = (n: typeof root): typeof root =>
      n ? { ...n, tone: n.id === 'n6' ? 'accent' : path.has(n.id) ? 'warn' : 'ok', ring: n.id === 'n6', l: paint(n.l ?? null), r: paint(n.r ?? null) } : null;
    const tree = drawTree('bst:', paint(root), { left: at.tree[0] + 6, width: pw - 12, top: at.tree[1] + 40, gap: 23, r: 10, size: 11 });
    nodes.push(...tree.nodes.map((n) => (n.kind === 'arrow' && path.has(n.id.slice('bst:e:'.length)) ? { ...n, tone: 'accent' as Tone, width: 2 } : n)));
    return { scene: { w: W, h: 320, nodes }, notes: [METHODS_NOTE[l]] };
  },
};

const FIGURES: Record<string, Figure> = {
  binary_search_example: binarySearchExample,
  binary_search_ranges: binarySearchRanges,
  binary_search_insertion_example: binarySearchInsertionExample,
  binary_search_insertion_naive: binarySearchInsertionNaive,
  binary_search_insertion_steps: binarySearchInsertionSteps,
  binary_search_edge_by_element: binarySearchEdgeByElement,
  binary_search_right_edge_by_left_edge: binarySearchRightEdgeByLeftEdge,
  two_sum_brute_force: twoSumBruteForce,
  two_sum_hashtable_steps: twoSumHashtableSteps,
  searching_algorithms: searchingAlgorithms,
};

export default FIGURES;
