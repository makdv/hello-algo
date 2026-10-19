import nqJavaEn from '@codes-en/java/chapter_backtracking/n_queens.java?raw';
import permJavaEn from '@codes-en/java/chapter_backtracking/permutations_i.java?raw';
import preJavaEn from '@codes-en/java/chapter_backtracking/preorder_traversal_ii_compact.java?raw';
import ss1JavaEn from '@codes-en/java/chapter_backtracking/subset_sum_i.java?raw';
import ss2JavaEn from '@codes-en/java/chapter_backtracking/subset_sum_ii.java?raw';
import nqPyEn from '@codes-en/python/chapter_backtracking/n_queens.py?raw';
import permPyEn from '@codes-en/python/chapter_backtracking/permutations_i.py?raw';
import prePyEn from '@codes-en/python/chapter_backtracking/preorder_traversal_ii_compact.py?raw';
import ss1PyEn from '@codes-en/python/chapter_backtracking/subset_sum_i.py?raw';
import ss2PyEn from '@codes-en/python/chapter_backtracking/subset_sum_ii.py?raw';
import nqJavaJa from '@codes-ja/java/chapter_backtracking/n_queens.java?raw';
import permJavaJa from '@codes-ja/java/chapter_backtracking/permutations_i.java?raw';
import preJavaJa from '@codes-ja/java/chapter_backtracking/preorder_traversal_ii_compact.java?raw';
import ss1JavaJa from '@codes-ja/java/chapter_backtracking/subset_sum_i.java?raw';
import ss2JavaJa from '@codes-ja/java/chapter_backtracking/subset_sum_ii.java?raw';
import nqPyJa from '@codes-ja/python/chapter_backtracking/n_queens.py?raw';
import permPyJa from '@codes-ja/python/chapter_backtracking/permutations_i.py?raw';
import prePyJa from '@codes-ja/python/chapter_backtracking/preorder_traversal_ii_compact.py?raw';
import ss1PyJa from '@codes-ja/python/chapter_backtracking/subset_sum_i.py?raw';
import ss2PyJa from '@codes-ja/python/chapter_backtracking/subset_sum_ii.py?raw';
import nqJavaRu from '@codes-ru/java/chapter_backtracking/n_queens.java?raw';
import permJavaRu from '@codes-ru/java/chapter_backtracking/permutations_i.java?raw';
import preJavaRu from '@codes-ru/java/chapter_backtracking/preorder_traversal_ii_compact.java?raw';
import ss1JavaRu from '@codes-ru/java/chapter_backtracking/subset_sum_i.java?raw';
import ss2JavaRu from '@codes-ru/java/chapter_backtracking/subset_sum_ii.java?raw';
import nqPyRu from '@codes-ru/python/chapter_backtracking/n_queens.py?raw';
import permPyRu from '@codes-ru/python/chapter_backtracking/permutations_i.py?raw';
import prePyRu from '@codes-ru/python/chapter_backtracking/preorder_traversal_ii_compact.py?raw';
import ss1PyRu from '@codes-ru/python/chapter_backtracking/subset_sum_i.py?raw';
import ss2PyRu from '@codes-ru/python/chapter_backtracking/subset_sum_ii.py?raw';
import nqJavaZh from '@codes-zh/java/chapter_backtracking/n_queens.java?raw';
import permJavaZh from '@codes-zh/java/chapter_backtracking/permutations_i.java?raw';
import preJavaZh from '@codes-zh/java/chapter_backtracking/preorder_traversal_ii_compact.java?raw';
import ss1JavaZh from '@codes-zh/java/chapter_backtracking/subset_sum_i.java?raw';
import ss2JavaZh from '@codes-zh/java/chapter_backtracking/subset_sum_ii.java?raw';
import nqPyZh from '@codes-zh/python/chapter_backtracking/n_queens.py?raw';
import permPyZh from '@codes-zh/python/chapter_backtracking/permutations_i.py?raw';
import prePyZh from '@codes-zh/python/chapter_backtracking/preorder_traversal_ii_compact.py?raw';
import ss1PyZh from '@codes-zh/python/chapter_backtracking/subset_sum_i.py?raw';
import ss2PyZh from '@codes-zh/python/chapter_backtracking/subset_sum_ii.py?raw';
import nqJavaZhHant from '@codes-zh-hant/java/chapter_backtracking/n_queens.java?raw';
import permJavaZhHant from '@codes-zh-hant/java/chapter_backtracking/permutations_i.java?raw';
import preJavaZhHant from '@codes-zh-hant/java/chapter_backtracking/preorder_traversal_ii_compact.java?raw';
import ss1JavaZhHant from '@codes-zh-hant/java/chapter_backtracking/subset_sum_i.java?raw';
import ss2JavaZhHant from '@codes-zh-hant/java/chapter_backtracking/subset_sum_ii.java?raw';
import nqPyZhHant from '@codes-zh-hant/python/chapter_backtracking/n_queens.py?raw';
import permPyZhHant from '@codes-zh-hant/python/chapter_backtracking/permutations_i.py?raw';
import prePyZhHant from '@codes-zh-hant/python/chapter_backtracking/preorder_traversal_ii_compact.py?raw';
import ss1PyZhHant from '@codes-zh-hant/python/chapter_backtracking/subset_sum_i.py?raw';
import ss2PyZhHant from '@codes-zh-hant/python/chapter_backtracking/subset_sum_ii.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, cells, grid, link, region, seg, text, treeSlots, type Cell, type TreeSlot } from '../kit';
import type { ArrowNode, BoxNode, Figure, LegendItem, PathNode, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

const PRE_PY = raw(prePyEn, prePyZh, prePyZhHant, prePyJa, prePyRu);
const PRE_JAVA = raw(preJavaEn, preJavaZh, preJavaZhHant, preJavaJa, preJavaRu);
const PERM_PY = raw(permPyEn, permPyZh, permPyZhHant, permPyJa, permPyRu);
const PERM_JAVA = raw(permJavaEn, permJavaZh, permJavaZhHant, permJavaJa, permJavaRu);
const SS1_PY = raw(ss1PyEn, ss1PyZh, ss1PyZhHant, ss1PyJa, ss1PyRu);
const SS1_JAVA = raw(ss1JavaEn, ss1JavaZh, ss1JavaZhHant, ss1JavaJa, ss1JavaRu);
const SS2_PY = raw(ss2PyEn, ss2PyZh, ss2PyZhHant, ss2PyJa, ss2PyRu);
const SS2_JAVA = raw(ss2JavaEn, ss2JavaZh, ss2JavaZhHant, ss2JavaJa, ss2JavaRu);
const NQ_PY = raw(nqPyEn, nqPyZh, nqPyZhHant, nqPyJa, nqPyRu);
const NQ_JAVA = raw(nqJavaEn, nqJavaZh, nqJavaZhHant, nqJavaJa, nqJavaRu);

const W = 440;

/** The book writes the second of two equal elements with a hat: 1̂, 4̂. */
const hat = (v: string | number) => `${v}̂`;

/** Each element of an input array keeps one color across a figure, like the book's colored cells. */
const ELEM_TONE: Tone[] = ['accent', 'ok', 'info'];

const QUEEN = '♛';
const SCISSORS = '✂';

const WORD = {
  attempt: { en: 'Attempt', zh: '尝试', 'zh-hant': '嘗試', ja: '試行', ru: 'Попытка' },
  backtrack: { en: 'Backtrack', zh: '回退', 'zh-hant': '回退', ja: '戻る', ru: 'Откат' },
  pruning: { en: 'Pruning', zh: '剪枝', 'zh-hant': '剪枝', ja: '枝刈り', ru: 'Обрезка' },
  visit: { en: 'visit a node (preorder)', zh: '访问节点（前序）', 'zh-hant': '訪問節點（前序）', ja: 'ノードを訪問（前順）', ru: 'посещение узла (прямой обход)' },
  dfs: { en: 'depth-first search', zh: '深度优先搜索', 'zh-hant': '深度優先搜尋', ja: '深さ優先探索', ru: 'поиск в глубину' },
  found7: { en: 'value 7: added to res', zh: '值为 7：加入 res', 'zh-hant': '值為 7：加入 res', ja: '値が 7：res に追加', ru: 'значение 7: добавляется в res' },
  onPath: { en: 'node in path', zh: 'path 中的节点', 'zh-hant': 'path 中的節點', ja: 'path 内のノード', ru: 'узел в path' },
  visited: { en: 'visited, already left', zh: '已访问并离开', 'zh-hant': '已訪問並離開', ja: '訪問済みで離れたノード', ru: 'посещён и покинут' },
  val3: { en: 'value 3: return at once', zh: '值为 3：立即返回', 'zh-hant': '值為 3：立即返回', ja: '値が 3：すぐに戻る', ru: 'значение 3: сразу return' },
  prunedBranch: { en: 'pruned branch', zh: '被剪掉的分支', 'zh-hant': '被剪掉的分支', ja: '枝刈りされた枝', ru: 'отсечённая ветвь' },
  keepReturn: { en: 'Keep return', zh: '保留 return', 'zh-hant': '保留 return', ja: 'return を残す', ru: 'С return' },
  deleteReturn: { en: 'Delete return', zh: '删除 return', 'zh-hant': '刪除 return', ja: 'return を削除', ru: 'Без return' },
  keepSub: { en: 'record, then stop searching', zh: '记录解后返回，不再继续搜索', 'zh-hant': '記錄解後返回，不再繼續搜尋', ja: '解を記録して戻り、探索を止める', ru: 'записали решение и вернулись' },
  deleteSub: { en: 'record, then keep searching', zh: '记录解后继续搜索', 'zh-hant': '記錄解後繼續搜尋', ja: '解を記録して探索を続ける', ru: 'записали решение и ищем дальше' },
  choice: { en: 'current choice', zh: '当前选择', 'zh-hant': '當前選擇', ja: '現在の選択', ru: 'текущий выбор' },
  selPrune: {
    en: 'pruning duplicate choices: selected[i] is True',
    zh: '重复选择剪枝：selected[i] 为 True',
    'zh-hant': '重複選擇剪枝：selected[i] 為 True',
    ja: '重複選択の枝刈り：selected[i] が True',
    ru: 'обрезка повторного выбора: selected[i] = True',
  },
  dupPrune: {
    en: 'pruning equal elements: the value is already in duplicated',
    zh: '相等元素剪枝：该值已在 duplicated 中',
    'zh-hant': '相等元素剪枝：該值已在 duplicated 中',
    ja: '等しい要素の枝刈り：値がすでに duplicated にある',
    ru: 'обрезка равных элементов: значение уже в duplicated',
  },
  dupPerm: { en: 'duplicate permutations', zh: '重复排列', 'zh-hant': '重複排列', ja: '重複した順列', ru: 'повторяющиеся перестановки' },
  dupSubsets: { en: 'duplicate subsets', zh: '重复子集', 'zh-hant': '重複子集', ja: '重複部分集合', ru: 'повторяющиеся подмножества' },
  over9: { en: 'element sum > 9: pruned', zh: '元素和 > 9：剪枝', 'zh-hant': '元素和 > 9：剪枝', ja: '要素の和 > 9：枝刈り', ru: 'сумма > 9: обрезка' },
  dup45: {
    en: 'duplicate subsets [4, 5] and [5, 4]',
    zh: '重复子集 [4, 5] 和 [5, 4]',
    'zh-hant': '重複子集 [4, 5] 和 [5, 4]',
    ja: '重複部分集合 [4, 5] と [5, 4]',
    ru: 'повторяющиеся подмножества [4, 5] и [5, 4]',
  },
  repeatPrune: {
    en: 'pruned: the subset was already generated',
    zh: '剪枝：该子集已经生成过',
    'zh-hant': '剪枝：該子集已經生成過',
    ja: '枝刈り：この部分集合は生成済み',
    ru: 'обрезка: это подмножество уже получено',
  },
  p1: { en: 'pruning 1: the sum would exceed target', zh: '剪枝一：子集和超过 target', 'zh-hant': '剪枝一：子集和超過 target', ja: '枝刈り 1：部分和が target を超える', ru: 'обрезка 1: сумма превысит target' },
  p2: { en: 'pruning 2: index before start', zh: '剪枝二：索引小于 start', 'zh-hant': '剪枝二：索引小於 start', ja: '枝刈り 2：インデックスが start より前', ru: 'обрезка 2: индекс меньше start' },
  p23: { en: 'pruning 2, 3: index before start', zh: '剪枝二、三：索引小于 start', 'zh-hant': '剪枝二、三：索引小於 start', ja: '枝刈り 2・3：インデックスが start より前', ru: 'обрезка 2, 3: индекс меньше start' },
  p4: { en: 'pruning 4: equals the element on its left', zh: '剪枝四：与左边的元素相等', 'zh-hant': '剪枝四：與左邊的元素相等', ja: '枝刈り 4：左隣の要素と等しい', ru: 'обрезка 4: равен элементу слева' },
  sameRow: { en: 'same row', zh: '同一行', 'zh-hant': '同一行', ja: '同じ行', ru: 'та же строка' },
  sameCol: { en: 'same column', zh: '同一列', 'zh-hant': '同一列', ja: '同じ列', ru: 'тот же столбец' },
  sameMain: { en: 'same main diagonal \\', zh: '同一主对角线 \\', 'zh-hant': '同一主對角線 \\', ja: '同じ主対角線 \\', ru: 'та же главная диагональ \\' },
  sameAnti: { en: 'same anti-diagonal /', zh: '同一次对角线 /', 'zh-hant': '同一次對角線 /', ja: '同じ副対角線 /', ru: 'та же побочная диагональ /' },
  attacked: { en: 'Attacked squares', zh: '受攻击的格子', 'zh-hant': '受攻擊的格子', ja: '攻撃されるマス', ru: 'Клетки под ударом' },
  noAttack: { en: 'Solution: no attacks', zh: '解：互不攻击', 'zh-hant': '解：互不攻擊', ja: '解：互いに攻撃しない', ru: 'Решение: нет атак' },
  queen: { en: 'queen', zh: '皇后', 'zh-hant': '皇后', ja: 'クイーン', ru: 'ферзь' },
  conflict: { en: 'attacked: pruned', zh: '受到攻击：剪枝', 'zh-hant': '受到攻擊：剪枝', ja: '攻撃される：枝刈り', ru: 'под ударом: обрезка' },
  curRow: { en: 'row being placed', zh: '当前放置的行', 'zh-hant': '當前放置的行', ja: '配置中の行', ru: 'текущая строка' },
  mainDiag: { en: 'main diagonal \\ through the queen', zh: '皇后所在的主对角线 \\', 'zh-hant': '皇后所在的主對角線 \\', ja: 'クイーンを通る主対角線 \\', ru: 'главная диагональ \\ через ферзя' },
  antiDiag: { en: 'anti-diagonal / through the queen', zh: '皇后所在的次对角线 /', 'zh-hant': '皇后所在的次對角線 /', ja: 'クイーンを通る副対角線 /', ru: 'побочная диагональ / через ферзя' },
  solution: { en: 'Solution {n}', zh: '解 {n}', 'zh-hant': '解 {n}', ja: '解 {n}', ru: 'Решение {n}' },
} satisfies Record<string, T>;

const roundLabel = (l: Locale, n: number) => ({ en: `Round ${n}`, zh: `第 ${n} 轮`, 'zh-hant': `第 ${n} 輪`, ja: `${n} 回目`, ru: `Раунд ${n}` })[l];

// ── Shared drawing helpers ────────────────────────────────────────────

type Pt = [number, number];

const circle = (id: string, cx: number, cy: number, r: number, value: Rich, opts: Partial<BoxNode> = {}): BoxNode =>
  box(id, cx - r, cy - r, value, { w: 2 * r, h: 2 * r, shape: 'circle', size: r < 15 ? 13 : 14, ...opts });

/** A row of small cells centered at `cx`, e.g. a partial permutation or subset. */
function miniRow(id: string, cx: number, y: number, items: Cell[], opts: { w?: number; h?: number; gap?: number; size?: number } = {}) {
  const { w = 17, h = 22, gap = 2, size = 12 } = opts;
  const width = items.length * w + (items.length - 1) * gap;
  return cells(id, cx - width / 2, y, items, { w, h, gap, size });
}

/** A small colored label on an edge, `+3` or `−4`, at fraction `t` from `a` to `b`. */
const edgeChip = (id: string, a: Pt, b: Pt, label: Rich, tone: Tone, t = 0.5, extra: Partial<BoxNode> = {}) =>
  box(id, a[0] + (b[0] - a[0]) * t - 13, a[1] + (b[1] - a[1]) * t - 9, label, { w: 26, h: 18, size: 11, tone, ...extra });

/** A cut mark on an edge. */
const snip = (id: string, a: Pt, b: Pt, t = 0.5) => text(id, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + 5, SCISSORS, { anchor: 'middle', size: 18, tone: 'danger' });

/** A short dashed stub leaving a circle at `deg` degrees from straight down: a branch cut before it starts. */
function stub(id: string, cx: number, cy: number, r: number, deg: number, tone: Tone, label?: Rich, len = 22): SceneNode[] {
  const a = (deg * Math.PI) / 180;
  const sx = Math.sin(a);
  const sy = Math.cos(a);
  const out: SceneNode[] = [arrow(id, [cx + (r + 1) * sx, cy + (r + 1) * sy], [cx + (r + len) * sx, cy + (r + len) * sy], { tone, dashed: true, width: 1.75 })];
  if (label !== undefined) out.push(text(`${id}:t`, cx + (r + len + 9) * sx, cy + (r + len + 9) * sy + 4, label, { anchor: 'middle', mono: true, size: 11, tone: tone === 'idle' ? 'muted' : tone }));
  return out;
}

/** A Catmull-Rom curve through the points, as cubic Béziers. */
function smooth(pts: Pt[]): string {
  const p = (k: number) => pts[Math.max(0, Math.min(pts.length - 1, k))];
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  let d = `M ${f(pts[0])}`;
  for (let k = 0; k < pts.length - 1; k++) {
    const [p0, p1, p2, p3] = [p(k - 1), p(k), p(k + 1), p(k + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1)} ${f(c2)} ${f(p2)}`;
  }
  return d;
}

/** The walk up to point `upto`; later points collapse onto it, so the path can grow smoothly between frames. */
function walkPath(id: string, pts: Pt[], upto: number): PathNode {
  const cut = pts.map((q, k) => (k <= upto ? q : pts[upto]));
  return { kind: 'path', id, d: smooth(cut), tone: 'ok', dashed: true, width: 2 };
}

// ── Binary trees stored level by level (the book's examples) ──────────

type Val = number | null;

interface Lay {
  left: number;
  width: number;
  top: number;
  gap: number;
}

const depthOf = (i: number) => Math.floor(Math.log2(i + 1));

function slotAt(i: number, o: Lay) {
  const d = depthOf(i);
  const k = i + 1 - 2 ** d;
  return { x: o.left + ((k + 0.5) * o.width) / 2 ** d, y: o.top + d * o.gap };
}

const has = (values: Val[], i: number) => i < values.length && values[i] !== null;

/** Circles at level-order slots and an edge per child; node ids `${prefix}${i}`, edge ids `${prefix}e${i}`. */
function lvlTree(prefix: string, values: Val[], o: Lay, r: number, node: (i: number) => Partial<BoxNode> = () => ({}), edge: (i: number) => Partial<ArrowNode> = () => ({})) {
  const boxes = new Map<number, BoxNode>();
  values.forEach((v, i) => {
    if (v === null) return;
    const { x, y } = slotAt(i, o);
    boxes.set(i, circle(`${prefix}${i}`, x, y, r, String(v), { tone: 'idle', ...node(i) }));
  });
  const edges: SceneNode[] = [];
  for (const [i, b] of boxes) {
    if (i === 0) continue;
    edges.push(link(`${prefix}e${i}`, boxes.get((i - 1) >> 1)!, b, { pad: 2, width: 1.5, ...edge(i) }));
  }
  return { nodes: [...edges, ...boxes.values()], boxes };
}

/**
 * The outline a depth-first walk traces: past a node's left side, around its subtrees, out on its
 * right side. Nodes where `descend` is false are passed around without entering their children.
 * Points are named `L3`, `B3`, `R3` for index 3; `S` and `E` are the start and the end.
 */
function contour(values: Val[], o: Lay, R: number, lift: number, descend: (i: number) => boolean = () => true) {
  const pts: Pt[] = [];
  const at: Record<string, number> = {};
  const root = slotAt(0, o);
  at.S = pts.push([root.x - 14, root.y - lift]) - 1;
  const walk = (i: number) => {
    const { x, y } = slotAt(i, o);
    at[`L${i}`] = pts.push([x - R, y]) - 1;
    if (descend(i) && has(values, 2 * i + 1)) walk(2 * i + 1);
    at[`B${i}`] = pts.push([x, y + R]) - 1;
    if (descend(i) && has(values, 2 * i + 2)) walk(2 * i + 2);
    at[`R${i}`] = pts.push([x + R, y]) - 1;
  };
  walk(0);
  at.E = pts.push([root.x + 14, root.y - lift]) - 1;
  return { pts, at };
}

/** The walk's arrowhead pointing up out of the tree at the end point. */
const walkEnd = (id: string, end: Pt) => arrow(id, [end[0], end[1] + 8], [end[0], end[1] - 4], { tone: 'ok', width: 2 });

/** A dashed cut across the edges below a node, with scissors on the left. */
function cutBelow(id: string, cx: number, y: number, half: number): SceneNode[] {
  return [
    { kind: 'path', id, d: `M ${cx - half} ${y} L ${cx + half} ${y}`, tone: 'danger', dashed: true, width: 1.25 },
    text(`${id}:s`, cx - half - 2, y + 5, SCISSORS, { anchor: 'end', size: 20, tone: 'danger' }),
  ];
}

/** `res` with a list of node values as circles, in a tinted strip. */
function resStrip(prefix: string, cx: number, y: number, rows: number[][]): SceneNode[] {
  const cw = 26;
  const widths = rows.map((r) => r.length * cw + (r.length - 1) * 3);
  const total = widths.reduce((a, b) => a + b, 0) + (rows.length - 1) * 14 + 20;
  const x0 = cx - total / 2;
  const nodes: SceneNode[] = [region(`${prefix}box`, x0, y, total, 40, { tone: 'warn' }), text(`${prefix}l`, x0 - 8, y + 25, 'res', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'warn' })];
  let x = x0 + 10;
  rows.forEach((row, k) => {
    nodes.push(...cells(`${prefix}${k}-`, x, y + 7, row.map((v) => ({ value: v, tone: 'ok' as Tone })), { w: cw, h: 26, gap: 3, size: 13 }));
    x += widths[k] + 14;
  });
  return nodes;
}

// ── 1. Finding nodes in preorder ──────────────────────────────────────

const PRE_VALUES: Val[] = [1, 7, 3, 4, 5, 6, 7];
const PRE_LAY: Lay = { left: 80, width: 280, top: 60, gap: 70 };

const preorderFindNodes: StaticFigure = {
  type: 'static',
  build(l) {
    const r = 17;
    const tree = lvlTree('n', PRE_VALUES, PRE_LAY, r, (i) => (PRE_VALUES[i] === 7 ? { tone: 'accent', ring: true } : { tone: 'ok' }));
    const { pts } = contour(PRE_VALUES, PRE_LAY, r + 10, 42);
    const nodes: SceneNode[] = [walkPath('walk', pts, pts.length - 1), walkEnd('walk:h', pts[pts.length - 1]), ...tree.nodes];
    for (const [i, b] of tree.boxes) nodes.push(box(`dot${i}`, b.x - 5, b.y + r - 5, '', { w: 10, h: 10, shape: 'circle', tone: 'warn' }));
    nodes.push(...resStrip('res', W / 2, 248, [[7], [7]]));
    return {
      scene: { w: W, h: 296, nodes },
      legend: [
        { tone: 'ok', text: WORD.dfs[l], shape: 'line', dashed: true },
        { tone: 'warn', text: WORD.visit[l], shape: 'circle' },
        { tone: 'accent', text: WORD.found7[l], shape: 'circle' },
      ],
    };
  },
};

// ── 2. Attempt and backtrack: recording paths to 7 ────────────────────

const PATH_SAY: Record<'try' | 'record' | 'back' | 'done', T> = {
  try: {
    en: 'Attempt: visit node {v} and append it to path.',
    zh: '尝试：访问节点 {v}，并将其加入 path 。',
    'zh-hant': '嘗試：訪問節點 {v}，並將其加入 path 。',
    ja: '試行：ノード {v} を訪問し、path に追加します。',
    ru: 'Попытка: посещаем узел {v} и добавляем его в path.',
  },
  record: {
    en: 'Attempt: visit node 7 and append it to path. Its value is 7, so a copy of path is recorded in res.',
    zh: '尝试：访问节点 7 并将其加入 path 。节点值为 7 ，将 path 的副本记录到 res 中。',
    'zh-hant': '嘗試：訪問節點 7 並將其加入 path 。節點值為 7 ，將 path 的副本記錄到 res 中。',
    ja: '試行：ノード 7 を訪問して path に追加します。値が 7 なので、path のコピーを res に記録します。',
    ru: 'Попытка: посещаем узел 7 и добавляем его в path. Значение равно 7, поэтому копия path записывается в res.',
  },
  back: {
    en: 'Backtrack: the search below node {v} is finished. Pop {v} from path to restore the state before this attempt.',
    zh: '回退：节点 {v} 之下的搜索已结束。将 {v} 从 path 中弹出，恢复到本次尝试之前的状态。',
    'zh-hant': '回退：節點 {v} 之下的搜尋已結束。將 {v} 從 path 中彈出，恢復到本次嘗試之前的狀態。',
    ja: '戻る：ノード {v} 以下の探索が終わりました。path から {v} を取り除き、この試行の前の状態に戻します。',
    ru: 'Откат: поиск под узлом {v} завершён. Удаляем {v} из path и восстанавливаем состояние до этой попытки.',
  },
  done: {
    en: 'Backtrack through nodes 3 and 1: path is empty again, and res holds both paths that end at 7.',
    zh: '依次回退经过节点 3 和 1 ，path 重新变为空，res 中记录了两条通往 7 的路径。',
    'zh-hant': '依次回退經過節點 3 和 1 ，path 重新變為空，res 中記錄了兩條通往 7 的路徑。',
    ja: 'ノード 3 と 1 を経て戻ると path は再び空になり、res には 7 に至る 2 つの経路が記録されています。',
    ru: 'Откат через узлы 3 и 1: path снова пуст, а в res записаны оба пути, ведущие к 7.',
  },
};

const preorderFindPaths: StepFigure = {
  type: 'steps',
  call: 'pre_order(root)',
  tones: { try: 'cmp', record: 'done', back: 'swp', done: 'done' },
  sources: funcSources(PRE_PY, PRE_JAVA, ['pre_order'], {
    python: {
      try: ['path.append(root)'],
      record: ['path.append(root)', 'res.append(list(path))'],
      back: ['path.pop()'],
      done: ['path.pop()'],
    },
    java: {
      try: ['path.add(root);'],
      record: ['path.add(root);', 'res.add(new ArrayList<>(path));'],
      back: ['path.remove(path.size() - 1);'],
      done: ['path.remove(path.size() - 1);'],
    },
  }),
  build(l) {
    const lay: Lay = { left: 8, width: 280, top: 62, gap: 70 };
    const r = 17;
    const { pts, at } = contour(PRE_VALUES, lay, r + 10, 42);
    const solutions = [
      [0, 1],
      [0, 2, 6],
    ];
    const RX = 304;
    const scene = (kind: string, upto: string, path: number[], resN: number) => {
      const reached = at[upto];
      const visited = (i: number) => at[`L${i}`] <= reached;
      const cur = path[path.length - 1];
      const tree = lvlTree(
        'n',
        PRE_VALUES,
        lay,
        r,
        (i) => (path.includes(i) ? { tone: 'accent', ring: i === cur } : visited(i) ? { tone: 'ok' } : { tone: 'idle' }),
        (i) => (path.includes(i) ? { tone: 'accent', width: 2.25 } : {}),
      );
      const end = pts[reached];
      const nodes: SceneNode[] = [walkPath('walk', pts, reached), ...tree.nodes];
      if (upto === 'E') nodes.push(walkEnd('walk:h', end));
      else nodes.push(box('cursor', end[0] - 5, end[1] - 5, '', { w: 10, h: 10, shape: 'circle', tone: kind === 'back' ? 'warn' : 'accent' }));
      const trying = kind === 'try' || kind === 'record';
      nodes.push(
        box('mode:a', RX, 12, WORD.attempt[l], { w: 120, h: 28, shape: 'chip', sans: true, size: 13, tone: trying ? 'accent' : 'idle', dim: !trying }),
        box('mode:b', RX, 46, WORD.backtrack[l], { w: 120, h: 28, shape: 'chip', sans: true, size: 13, tone: trying ? 'idle' : 'warn', dim: trying }),
        text('pl', RX, 102, 'path', { mono: true, bold: true, size: 13, tone: 'accent' }),
        ...cells(
          'p',
          RX,
          110,
          path.map((i) => ({ id: `p${i}`, value: PRE_VALUES[i]!, tone: 'accent' as Tone })),
          { w: 30, h: 28, gap: 4, size: 14 },
        ),
        text('rl', RX, 164, 'res', { mono: true, bold: true, size: 13, tone: 'warn' }),
      );
      if (!path.length) nodes.push(text('p:empty', RX, 130, '[ ]', { mono: true, size: 13, tone: 'muted' }));
      solutions.slice(0, resN).forEach((sol, k) => {
        nodes.push(...cells(`r${k}-`, RX, 172 + k * 34, sol.map((i) => ({ value: PRE_VALUES[i]!, tone: 'ok' as Tone })), { w: 26, h: 26, gap: 3, size: 13 }));
      });
      return { w: W, h: 248, nodes };
    };
    const v = (i: number) => PRE_VALUES[i]!;
    const steps: { kind: 'try' | 'record' | 'back' | 'done'; upto: string; path: number[]; res: number; node?: number }[] = [
      { kind: 'try', upto: 'L0', path: [0], res: 0, node: 0 },
      { kind: 'record', upto: 'L1', path: [0, 1], res: 1 },
      { kind: 'try', upto: 'L3', path: [0, 1, 3], res: 1, node: 3 },
      { kind: 'back', upto: 'R3', path: [0, 1], res: 1, node: 3 },
      { kind: 'try', upto: 'L4', path: [0, 1, 4], res: 1, node: 4 },
      { kind: 'back', upto: 'R4', path: [0, 1], res: 1, node: 4 },
      { kind: 'back', upto: 'R1', path: [0], res: 1, node: 1 },
      { kind: 'try', upto: 'L2', path: [0, 2], res: 1, node: 2 },
      { kind: 'try', upto: 'L5', path: [0, 2, 5], res: 1, node: 5 },
      { kind: 'back', upto: 'R5', path: [0, 2], res: 1, node: 5 },
      { kind: 'record', upto: 'L6', path: [0, 2, 6], res: 2 },
      { kind: 'back', upto: 'R6', path: [0, 2], res: 2, node: 6 },
      { kind: 'done', upto: 'E', path: [], res: 2 },
    ];
    const frames: SceneFrame[] = steps.map((s) => ({
      kind: s.kind,
      scene: scene(s.kind, s.upto, s.path, s.res),
      say: fmt(PATH_SAY[s.kind][l], { v: s.node === undefined ? 7 : v(s.node) }),
    }));
    return {
      frames,
      legend: [
        { tone: 'accent', text: WORD.onPath[l], shape: 'circle' },
        { tone: 'ok', text: WORD.visited[l], shape: 'circle' },
      ],
    };
  },
};

// ── 3. Pruning by a constraint ────────────────────────────────────────

const preorderFindConstrainedPaths: StaticFigure = {
  type: 'static',
  build(l) {
    const r = 17;
    const pruned = (i: number) => i === 5 || i === 6;
    const tree = lvlTree(
      'n',
      PRE_VALUES,
      PRE_LAY,
      r,
      (i) => (i === 2 ? { tone: 'danger', ring: true } : pruned(i) ? { tone: PRE_VALUES[i] === 7 ? 'accent' : 'ok', dim: true, dashed: true } : PRE_VALUES[i] === 7 ? { tone: 'accent', ring: true } : { tone: 'ok' }),
      (i) => (pruned(i) ? { dim: true, dashed: true } : {}),
    );
    const { pts } = contour(PRE_VALUES, PRE_LAY, r + 10, 42, (i) => PRE_VALUES[i] !== 3);
    const three = slotAt(2, PRE_LAY);
    const cutY = three.y + 36;
    const nodes: SceneNode[] = [
      walkPath('walk', pts, pts.length - 1),
      walkEnd('walk:h', pts[pts.length - 1]),
      ...tree.nodes,
      ...cutBelow('cut', three.x, cutY, 44),
      text('cut:l', three.x + 50, cutY + 5, WORD.pruning[l], { bold: true, size: 13, tone: 'danger' }),
      ...resStrip('res', W / 2, 248, [[1, 7]]),
    ];
    return {
      scene: { w: W, h: 296, nodes },
      legend: [
        { tone: 'danger', text: WORD.val3[l], shape: 'circle' },
        { tone: 'muted', text: WORD.prunedBranch[l], shape: 'line', dashed: true },
        { tone: 'accent', text: WORD.found7[l], shape: 'circle' },
      ],
    };
  },
};

// ── 4. Keeping or removing `return` after a solution ─────────────────

const RET_VALUES: Val[] = [1, 7, 3, 4, 5, 6, 7, 7];

const backtrackRemoveReturn: StaticFigure = {
  type: 'static',
  build(l) {
    const r = 13;
    const H = 318;
    const PW = 215;
    const nodes: SceneNode[] = [];
    const panel = (key: string, px: number, keep: boolean) => {
      const lay: Lay = { left: px + 6, width: PW - 12, top: 76, gap: 52 };
      const stopAt = (i: number) => RET_VALUES[i] === 3 || (keep && i === 1);
      const reach = (i: number) => {
        for (let k = i; k > 0; ) {
          k = (k - 1) >> 1;
          if (stopAt(k)) return false;
        }
        return true;
      };
      const tree = lvlTree(
        `${key}n`,
        RET_VALUES,
        lay,
        r,
        (i) => {
          if (!reach(i)) return { tone: RET_VALUES[i] === 7 ? 'accent' : 'ok', dim: true, dashed: true };
          if (RET_VALUES[i] === 3) return { tone: 'danger', ring: true };
          if (RET_VALUES[i] === 7) return { tone: 'accent', ring: true };
          return { tone: 'ok' };
        },
        (i) => (reach(i) ? {} : { dim: true, dashed: true }),
      );
      const { pts } = contour(RET_VALUES, lay, r + 8, 34, (i) => !stopAt(i));
      nodes.push(region(`${key}bg`, px, 26, PW, H - 30, { tone: keep ? 'danger' : 'ok', label: keep ? WORD.keepReturn[l] : WORD.deleteReturn[l] }));
      nodes.push(walkPath(`${key}walk`, pts, pts.length - 1), walkEnd(`${key}walk:h`, pts[pts.length - 1]), ...tree.nodes);
      for (const i of keep ? [1, 2] : [2]) {
        const s = slotAt(i, lay);
        nodes.push(...cutBelow(`${key}cut${i}`, s.x, s.y + 30, 34));
      }
      const res = keep ? 'res = [[1,7]]' : 'res = [[1,7],[1,7,4,7]]';
      nodes.push(
        text(`${key}res`, px + PW / 2, 282, seg(['res', 'warn', true], res.slice(3)), { anchor: 'middle', mono: true, size: 12 }),
        text(`${key}sub`, px + PW / 2, 302, keep ? WORD.keepSub[l] : WORD.deleteSub[l], { anchor: 'middle', size: 12, tone: 'muted' }),
      );
    };
    panel('a', 0, true);
    panel('b', W - PW, false);
    return {
      scene: { w: W, h: H, nodes },
      legend: [
        { tone: 'accent', text: WORD.found7[l], shape: 'circle' },
        { tone: 'danger', text: WORD.val3[l], shape: 'circle' },
        { tone: 'muted', text: WORD.prunedBranch[l], shape: 'line', dashed: true },
      ],
    };
  },
};

// ── Permutation trees ─────────────────────────────────────────────────

interface PNode {
  /** Indices into the input array, in the order chosen. */
  path: number[];
  parent: number;
  /** Why the branch is cut, if it is. */
  cut?: 'sel' | 'dup';
}

/** The full recursion tree of permutations of `n` elements, without pruning by value. */
function permNodes(n: number): PNode[] {
  const out: PNode[] = [{ path: [], parent: -1 }];
  for (let k = 0; k < out.length; k++) {
    if (out[k].path.length === n) continue;
    for (let i = 0; i < n; i++) if (!out[k].path.includes(i)) out.push({ path: [...out[k].path, i], parent: k });
  }
  return out;
}

/** The cells of a state: chosen elements in their colors, then empty slots. */
const stateCells = (path: number[], elems: string[], n = 3, extra: Partial<Cell> = {}): Cell[] =>
  Array.from({ length: n }, (_, k) => (k < path.length ? { value: elems[path[k]], tone: ELEM_TONE[path[k]], ...extra } : { value: null, ...extra }));

const PT = { left: 68, width: 366, top: 26, gap: 62 };
const ROW_H = 22;

/** `choices` and the empty state at the top of a permutation tree. */
function permHeader(elems: string[]): SceneNode[] {
  return [
    text('ch:l', 8, 30, 'choices', { mono: true, bold: true, size: 13, tone: 'muted' }),
    ...cells('ch', 68, 12, elems.map((e, i) => ({ value: e, tone: ELEM_TONE[i] })), { w: 20, h: 24, gap: 2, size: 13 }),
  ];
}

function roundLabels(l: Locale, upto: number, ys: number[]): SceneNode[] {
  return ys.slice(1, upto + 1).map((y, k) => text(`round${k + 1}`, 6, y + 4, roundLabel(l, k + 1), { size: 12, tone: 'muted' }));
}

/** Draws state rows at the slots, with straight edges between them. */
function drawStates(prefix: string, nodes: PNode[], slots: TreeSlot[], elems: string[], show: (k: number) => boolean, style: (k: number) => { cell?: Partial<Cell>; edge?: Partial<ArrowNode>; bg?: Tone } = () => ({})) {
  const out: SceneNode[] = [];
  const edges: SceneNode[] = [];
  nodes.forEach((nd, k) => {
    if (!show(k)) return;
    const s = slots[k];
    const st = style(k);
    if (st.bg) out.push(box(`${prefix}${k}bg`, s.x - 30, s.y - 14, '', { w: 60, h: 28, tone: st.bg }));
    out.push(...miniRow(`${prefix}${k}c`, s.x, s.y - ROW_H / 2, stateCells(nd.path, elems, 3, st.cell)));
    if (nd.parent >= 0) {
      const p = slots[nd.parent];
      edges.push(arrow(`${prefix}e${k}`, [p.x, p.y + ROW_H / 2 + 1], [s.x, s.y - ROW_H / 2 - 3], { width: 1.25, ...st.edge }));
    }
  });
  return [...edges, ...out];
}

// ── 5. The recursion tree of permutations ─────────────────────────────

const PERM_SAY: Record<'init' | 'round' | 'done', T> = {
  init: {
    en: 'The root node is the empty state. Each round chooses one element of 1, 2, 3 that is not in the state yet.',
    zh: '根节点是空状态。每一轮从 1, 2, 3 中选择一个尚未在状态中的元素。',
    'zh-hant': '根節點是空狀態。每一輪從 1, 2, 3 中選擇一個尚未在狀態中的元素。',
    ja: '根ノードは空の状態です。各ラウンドで、1, 2, 3 のうちまだ状態に含まれない要素を 1 つ選びます。',
    ru: 'Корень — пустое состояние. В каждом раунде выбираем один из элементов 1, 2, 3, которого ещё нет в состоянии.',
  },
  round: {
    en: 'Round {k}: every state branches into its {n} remaining choices.',
    zh: '第 {k} 轮：每个状态分出 {n} 个尚未选择的分支。',
    'zh-hant': '第 {k} 輪：每個狀態分出 {n} 個尚未選擇的分支。',
    ja: '{k} 回目のラウンド：各状態から、残っている {n} 個の選択肢に分岐します。',
    ru: 'Раунд {k}: каждое состояние ветвится на {n} оставшихся выбора.',
  },
  done: {
    en: 'Round 3: one choice is left. Each leaf node is a permutation, 3! = 6 in all.',
    zh: '第 3 轮：只剩一个选择。每个叶节点对应一个排列，共 3! = 6 个。',
    'zh-hant': '第 3 輪：只剩一個選擇。每個葉節點對應一個排列，共 3! = 6 個。',
    ja: '3 回目のラウンド：残る選択肢は 1 つです。各葉ノードが 1 つの順列に対応し、全部で 3! = 6 個です。',
    ru: 'Раунд 3: остаётся один выбор. Каждый лист — это перестановка, всего 3! = 6.',
  },
};

const permutationsI: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', round: 'cmp', done: 'done' },
  build(l) {
    const elems = ['1', '2', '3'];
    const nodes = permNodes(3);
    const slots = treeSlots(
      nodes.map((n) => n.parent),
      PT.left,
      PT.width,
      PT.top,
      PT.gap,
    );
    const ys = [0, 1, 2, 3].map((k) => PT.top + k * PT.gap);
    const scene = (level: number) => {
      const out: SceneNode[] = [
        ...permHeader(elems),
        text('st:l', slots[0].x - 40, slots[0].y + 5, 'state', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }),
        ...roundLabels(l, level, ys),
        ...drawStates('s', nodes, slots, elems, (k) => nodes[k].path.length <= level),
      ];
      return { w: W, h: 242, nodes: out };
    };
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(0), say: PERM_SAY.init[l] },
      { kind: 'round', scene: scene(1), say: fmt(PERM_SAY.round[l], { k: 1, n: 3 }) },
      { kind: 'round', scene: scene(2), say: fmt(PERM_SAY.round[l], { k: 2, n: 2 }) },
      { kind: 'done', scene: scene(3), say: PERM_SAY.done[l] },
    ];
    return { frames };
  },
};

// ── 6. Pruning repeated choices with `selected` ───────────────────────

const PRUNE1_SAY: Record<'r1' | 'r2' | 'r3' | 'record', T> = {
  r1: {
    en: 'Round 1: all of 1, 2, 3 are valid. Choose 1 and set selected[0] = True.',
    zh: '第 1 轮：1, 2, 3 均可选。选择 1 ，并将 selected[0] 设为 True 。',
    'zh-hant': '第 1 輪：1, 2, 3 均可選。選擇 1 ，並將 selected[0] 設為 True 。',
    ja: '1 回目のラウンド：1, 2, 3 はすべて選択可能です。1 を選び、selected[0] を True にします。',
    ru: 'Раунд 1: допустимы все элементы 1, 2, 3. Выбираем 1 и ставим selected[0] = True.',
  },
  r2: {
    en: 'Round 2: selected[0] is True, so the branch of 1 is pruned. Valid choices are 2 and 3; choose 3.',
    zh: '第 2 轮：selected[0] 为 True ，剪掉元素 1 的分支。剩余可选元素为 2 和 3 ，选择 3 。',
    'zh-hant': '第 2 輪：selected[0] 為 True ，剪掉元素 1 的分支。剩餘可選元素為 2 和 3 ，選擇 3 。',
    ja: '2 回目のラウンド：selected[0] が True なので、要素 1 の枝を刈り取ります。残る選択肢は 2 と 3 で、3 を選びます。',
    ru: 'Раунд 2: selected[0] = True, поэтому ветвь элемента 1 отсекается. Допустимы 2 и 3; выбираем 3.',
  },
  r3: {
    en: 'Round 3: 1 and 3 are already selected, so their branches are pruned. Only 2 is left.',
    zh: '第 3 轮：1 和 3 已被选择，剪掉它们的分支，只剩元素 2 。',
    'zh-hant': '第 3 輪：1 和 3 已被選擇，剪掉它們的分支，只剩元素 2 。',
    ja: '3 回目のラウンド：1 と 3 は選択済みなので枝刈りし、残るのは 2 だけです。',
    ru: 'Раунд 3: 1 и 3 уже выбраны, их ветви отсекаются. Остаётся только 2.',
  },
  record: {
    en: 'The state holds all three elements: record the permutation [1, 3, 2]. Pruning lets each element be chosen only once.',
    zh: '状态已包含全部三个元素，记录排列 [1, 3, 2] 。剪枝保证了每个元素只被选择一次。',
    'zh-hant': '狀態已包含全部三個元素，記錄排列 [1, 3, 2] 。剪枝保證了每個元素只被選擇一次。',
    ja: '状態に 3 つの要素がそろったので、順列 [1, 3, 2] を記録します。枝刈りにより各要素は 1 回だけ選ばれます。',
    ru: 'Состояние содержит все три элемента: записываем перестановку [1, 3, 2]. Обрезка гарантирует, что каждый элемент выбран один раз.',
  },
};

const permutationsIPruning: StepFigure = {
  type: 'steps',
  call: 'permutations_i([1, 2, 3])',
  tones: { choose: 'cmp', prune: 'swp', record: 'done' },
  sources: funcSources(PERM_PY, PERM_JAVA, ['backtrack'], {
    python: {
      choose: ['selected[i] = True', 'state.append(choice)'],
      prune: ['if not selected[i]:'],
      record: ['res.append(list(state))'],
    },
    java: {
      choose: ['selected[i] = true;', 'state.add(choice);'],
      prune: ['if (!selected[i])'],
      record: ['res.add(new ArrayList<Integer>(state));'],
    },
  }),
  build(l) {
    const elems = ['1', '2', '3'];
    const ys = [26, 86, 146, 206];
    // Hand-placed: only the branch 1 → 3 → 2 is followed, the rest is elided or cut.
    const tree: (PNode & { x: number; role: 'path' | 'side' | 'cut' })[] = [
      { path: [], parent: -1, x: 282, role: 'path' },
      { path: [0], parent: 0, x: 175, role: 'path' },
      { path: [1], parent: 0, x: 290, role: 'side' },
      { path: [2], parent: 0, x: 395, role: 'side' },
      { path: [0, 0], parent: 1, x: 105, role: 'cut' },
      { path: [0, 1], parent: 1, x: 175, role: 'side' },
      { path: [0, 2], parent: 1, x: 245, role: 'path' },
      { path: [0, 2, 0], parent: 6, x: 175, role: 'cut' },
      { path: [0, 2, 1], parent: 6, x: 245, role: 'path' },
      { path: [0, 2, 2], parent: 6, x: 315, role: 'cut' },
    ];
    const slots = tree.map((n) => ({ level: n.path.length, index: 0, x: n.x, y: ys[n.path.length] }));
    const selected = [
      [true, false, false],
      [true, false, true],
      [true, true, true],
      [true, true, true],
    ];
    const scene = (f: number) => {
      const level = Math.min(f + 1, 3);
      const out: SceneNode[] = [
        ...permHeader(elems),
        ...roundLabels(l, level, ys),
        ...drawStates(
          's',
          tree,
          slots,
          elems,
          (k) => tree[k].path.length <= level,
          (k) => {
            const role = tree[k].role;
            if (role === 'cut') return { cell: { tone: 'muted', dashed: true }, edge: { tone: 'muted', dashed: true } };
            if (role === 'side') return { cell: { dim: true }, edge: { dim: true } };
            return { edge: { tone: 'accent', width: 2.25 }, bg: f === 3 && tree[k].path.length === 3 ? 'ok' : undefined };
          },
        ),
      ];
      tree.forEach((n, k) => {
        if (n.path.length > level) return;
        const p = slots[n.parent] ?? slots[0];
        if (n.role === 'cut') out.push(snip(`snip${k}`, [p.x, p.y + 12], [slots[k].x, slots[k].y - 12], 0.5));
        if (n.role === 'side' && n.path.length === 1) out.push(text(`more${k}`, slots[k].x, slots[k].y + 30, '⋯', { anchor: 'middle', size: 16, tone: 'muted', dim: true }));
      });
      if (level >= 2) out.push(text('more5', slots[5].x, slots[5].y + 30, '⋯', { anchor: 'middle', size: 16, tone: 'muted', dim: true }));
      out.push(
        text('sel:l', 338, 128, 'selected', { mono: true, bold: true, size: 12, tone: 'muted' }),
        ...cells(
          'sel',
          338,
          136,
          selected[f].map((v) => ({ value: v ? 'T' : 'F', tone: v ? ('ok' as Tone) : ('idle' as Tone) })),
          { w: 28, h: 24, gap: 3, size: 12 },
        ),
        ...elems.map((e, i) => text(`sel:i${i}`, 338 + i * 31 + 14, 174, e, { anchor: 'middle', mono: true, size: 11, tone: ELEM_TONE[i] })),
      );
      return { w: W, h: 236, nodes: out };
    };
    const frames: SceneFrame[] = [
      { kind: 'choose', scene: scene(0), say: PRUNE1_SAY.r1[l] },
      { kind: 'prune', scene: scene(1), say: PRUNE1_SAY.r2[l] },
      { kind: 'prune', scene: scene(2), say: PRUNE1_SAY.r3[l] },
      { kind: 'record', scene: scene(3), say: PRUNE1_SAY.record[l] },
    ];
    return {
      frames,
      legend: [
        { tone: 'accent', text: WORD.choice[l], shape: 'line' },
        { tone: 'muted', text: WORD.selPrune[l], shape: 'line', dashed: true },
      ],
    };
  },
};

// ── 7. Duplicate permutations from equal elements ────────────────────

const DUP_ELEMS = ['1', hat(1), '2'];
const valueOf = (i: number) => (i === 2 ? 2 : 1);

const permutationsII: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = permNodes(3);
    const slots = treeSlots(
      nodes.map((n) => n.parent),
      PT.left,
      PT.width,
      PT.top,
      PT.gap,
    );
    const ys = [0, 1, 2, 3].map((k) => PT.top + k * PT.gap);
    // A leaf repeats an earlier one when the same values appear in the same order.
    const seen = new Set<string>();
    const dup = new Set<number>();
    nodes.forEach((n, k) => {
      if (n.path.length !== 3) return;
      const key = n.path.map(valueOf).join();
      if (seen.has(key)) dup.add(k);
      seen.add(key);
    });
    const out: SceneNode[] = [
      ...permHeader(DUP_ELEMS),
      text('st:l', slots[0].x - 40, slots[0].y + 5, 'state', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }),
      ...roundLabels(l, 3, ys),
      ...drawStates('s', nodes, slots, DUP_ELEMS, () => true, (k) => (dup.has(k) ? { bg: 'warn' } : {})),
    ];
    const dupXs = [...dup].map((k) => slots[k].x);
    const tx = (Math.min(...dupXs) + Math.max(...dupXs)) / 2;
    for (const k of dup) out.push(arrow(`dl${k}`, [slots[k].x, ys[3] + 16], [tx, 250], { head: 'none', tone: 'warn', width: 1 }));
    out.push(text('dupl', tx, 266, WORD.dupPerm[l], { anchor: 'middle', bold: true, size: 13, tone: 'warn' }));
    return { scene: { w: W, h: 276, nodes: out } };
  },
};

// ── 8. Pruning equal elements with `duplicated` ───────────────────────

const permutationsIIPruning: StaticFigure = {
  type: 'static',
  build(l) {
    const tree: PNode[] = [
      { path: [], parent: -1 },
      { path: [0], parent: 0 },
      { path: [1], parent: 0, cut: 'dup' },
      { path: [2], parent: 0 },
      { path: [0, 1], parent: 1 },
      { path: [0, 2], parent: 1 },
      { path: [2, 0], parent: 3 },
      { path: [2, 1], parent: 3, cut: 'dup' },
      { path: [0, 1, 2], parent: 4 },
      { path: [0, 2, 1], parent: 5 },
      { path: [2, 0, 1], parent: 6 },
    ];
    const slots = treeSlots(
      tree.map((n) => n.parent),
      PT.left,
      PT.width,
      PT.top,
      PT.gap,
    );
    const ys = [0, 1, 2, 3].map((k) => PT.top + k * PT.gap);
    const out: SceneNode[] = [
      ...permHeader(DUP_ELEMS),
      text('st:l', slots[0].x - 40, slots[0].y + 5, 'state', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }),
      ...roundLabels(l, 3, ys),
      ...drawStates('s', tree, slots, DUP_ELEMS, () => true, (k) =>
        tree[k].cut ? { cell: { tone: 'muted', dashed: true }, edge: { tone: 'danger', dashed: true } } : tree[k].path.length === 3 ? { bg: 'ok' } : {},
      ),
    ];
    tree.forEach((n, k) => {
      if (!n.cut) return;
      const s = slots[k];
      const p = slots[n.parent];
      out.push(snip(`snip${k}`, [p.x, p.y + 12], [s.x, s.y - 12], 0.5));
      // `duplicated` of that round, under the cut branch (kept inside the scene at the right edge).
      const x = Math.min(s.x, W - 40);
      out.push(
        text(`dupset${k}`, x, s.y + 28, 'duplicated', { anchor: 'middle', mono: true, size: 11, tone: 'danger' }),
        text(`dupval${k}`, x, s.y + 42, '= { 1 }', { anchor: 'middle', mono: true, size: 11, tone: 'danger' }),
      );
    });
    return {
      scene: { w: W, h: 246, nodes: out },
      legend: [
        { tone: 'danger', text: WORD.dupPrune[l], shape: 'line', dashed: true },
        { tone: 'ok', text: WORD.choice[l], shape: 'rect' },
      ],
    };
  },
};

// ── 9. Where each kind of pruning applies ─────────────────────────────

const permutationsIIPruningSummary: StaticFigure = {
  type: 'static',
  build(l) {
    // Run the search of permutations II and keep every cut branch as a leaf.
    const tree: PNode[] = [{ path: [], parent: -1 }];
    const grow = (k: number) => {
      const { path } = tree[k];
      if (path.length === 3) return;
      const tried = new Set<number>();
      for (let i = 0; i < 3; i++) {
        if (path.includes(i)) tree.push({ path: [...path, i], parent: k, cut: 'sel' });
        else if (tried.has(valueOf(i))) tree.push({ path: [...path, i], parent: k, cut: 'dup' });
        else {
          tried.add(valueOf(i));
          tree.push({ path: [...path, i], parent: k });
          grow(tree.length - 1);
        }
      }
    };
    grow(0);
    const ys = [18, 72, 126, 180];
    const slots = treeSlots(
      tree.map((n) => n.parent),
      10,
      W - 20,
      ys[0],
      54,
    );
    const S = 24;
    const boxes = tree.map((n, k) => {
      const s = slots[k];
      if (k === 0) return box('n0', s.x - 6, s.y - 6, '', { w: 12, h: 12, shape: 'circle', tone: 'muted' });
      const last = n.path[n.path.length - 1];
      return box(`n${k}`, s.x - S / 2, s.y - S / 2, DUP_ELEMS[last], { w: S, h: S, size: 13, tone: n.cut ? 'muted' : ELEM_TONE[last], dashed: Boolean(n.cut), dim: Boolean(n.cut) });
    });
    const out: SceneNode[] = [];
    tree.forEach((n, k) => {
      if (k === 0) return;
      const tone: Tone = n.cut === 'dup' ? 'danger' : n.cut === 'sel' ? 'muted' : 'idle';
      out.push(link(`e${k}`, boxes[n.parent], boxes[k], { pad: 2, width: n.cut ? 1.25 : 1.75, dashed: Boolean(n.cut), tone }));
    });
    out.push(...boxes);
    const outY = 222;
    out.push(text('out:l', 8, outY + 15, 'res', { mono: true, bold: true, size: 13, tone: 'muted' }));
    tree.forEach((n, k) => {
      if (n.cut || n.path.length !== 3) return;
      const s = slots[k];
      out.push(arrow(`o${k}`, [s.x, s.y + S / 2 + 2], [s.x, outY - 2], { tone: 'ok', width: 1.5 }));
      out.push(...miniRow(`out${k}`, s.x, outY, n.path.map((i) => ({ value: DUP_ELEMS[i], tone: ELEM_TONE[i] })), { w: 16, h: 20, size: 11 }));
    });
    return {
      scene: { w: W, h: 248, nodes: out },
      legend: [
        { tone: 'muted', text: WORD.selPrune[l], shape: 'line', dashed: true },
        { tone: 'danger', text: WORD.dupPrune[l], shape: 'line', dashed: true },
      ],
    };
  },
};

// ── Subset-sum trees ──────────────────────────────────────────────────

/** `choices` (and `target`) in the top-left corner. */
function subsetHeader(elems: string[], target?: number): SceneNode[] {
  const out: SceneNode[] = [
    text('ch:l', 8, 26, 'choices', { mono: true, bold: true, size: 13, tone: 'muted' }),
    ...cells('ch', 68, 8, elems.map((e, i) => ({ value: e, tone: ELEM_TONE[i] })), { w: 20, h: 24, gap: 2, size: 13 }),
  ];
  if (target !== undefined)
    out.push(text('tg:l', 8, 58, 'target', { mono: true, bold: true, size: 13, tone: 'muted' }), circle('tg', 79, 53, 12, String(target), { tone: 'ok', size: 12 }));
  return out;
}

const minus = (v: string) => `−${v}`;

interface SNode {
  v: number | string;
  parent: number;
  /** Index of the element chosen on the edge into this node. */
  e: number;
}

/** State and res under a subset-sum search. */
function stateAndRes(y: number, state: number[], res: number[][], elems: string[]): SceneNode[] {
  const out: SceneNode[] = [
    text('st:l', 8, y + 16, 'state', { mono: true, bold: true, size: 13, tone: 'accent' }),
    ...cells('st', 60, y, state.map((i, k) => ({ id: `st${k}`, value: elems[i], tone: ELEM_TONE[i] })), { w: 22, h: 22, gap: 3, size: 12 }),
    text('rs:l', 196, y + 16, 'res', { mono: true, bold: true, size: 13, tone: 'warn' }),
  ];
  let x = 230;
  res.forEach((row, k) => {
    out.push(region(`rs${k}`, x - 4, y - 4, row.length * 21 + 6, 30, { tone: 'warn' }));
    out.push(...cells(`rs${k}-`, x, y, row.map((i) => ({ value: elems[i], tone: ELEM_TONE[i] })), { w: 19, h: 22, gap: 2, size: 12 }));
    x += row.length * 21 + 14;
  });
  return out;
}

// ── 10. Naive subset search: same subset in different orders ─────────

const subsetSumINaive: StaticFigure = {
  type: 'static',
  build(l) {
    const elems = ['3', '4', '5'];
    const tree: SNode[] = [
      { v: 0, parent: -1, e: -1 },
      { v: 3, parent: 0, e: 0 },
      { v: 4, parent: 0, e: 1 },
      { v: 5, parent: 0, e: 2 },
      { v: 6, parent: 1, e: 0 },
      { v: 7, parent: 1, e: 1 },
      { v: 8, parent: 1, e: 2 },
      { v: 7, parent: 2, e: 0 },
      { v: 8, parent: 2, e: 1 },
      { v: 9, parent: 2, e: 2 },
      { v: 8, parent: 3, e: 0 },
      { v: 9, parent: 3, e: 1 },
      { v: '> 9', parent: 3, e: 2 },
      { v: 9, parent: 4, e: 0 },
    ];
    const slots = treeSlots(
      tree.map((n) => n.parent),
      12,
      416,
      26,
      66,
    );
    const r = 14;
    const out: SceneNode[] = [...subsetHeader(elems, 9)];
    const nodeBoxes: SceneNode[] = [];
    const paths = (k: number): number[] => (k === 0 ? [] : [...paths(tree[k].parent), tree[k].e]);
    tree.forEach((n, k) => {
      const s = slots[k];
      const over = typeof n.v === 'string';
      if (k > 0) {
        const p = slots[n.parent];
        const a: Pt = [p.x, p.y + r];
        const b: Pt = [s.x, s.y - (over ? 0 : r + 2)];
        out.push(arrow(`e${k}`, a, b, { width: 1.5, tone: over ? 'danger' : 'idle', dashed: over, dim: over }));
        out.push(edgeChip(`c${k}`, a, b, `+${elems[n.e]}`, ELEM_TONE[n.e], n.parent === 0 ? 0.5 : 0.6, { dim: over }));
      }
      if (over) {
        out.push(text(`n${k}`, s.x, s.y + 12, String(n.v), { anchor: 'middle', mono: true, size: 12, tone: 'danger' }));
        out.push(snip(`snip${k}`, [slots[n.parent].x, slots[n.parent].y + r], [s.x, s.y], 0.3));
        return;
      }
      const solved = n.v === 9;
      nodeBoxes.push(circle(`n${k}`, s.x, s.y, r, String(n.v), { tone: solved ? 'ok' : 'idle', ring: solved }));
      if (solved) {
        const p = paths(k);
        const isDup = p.length === 2;
        if (isDup) out.push(box(`sbg${k}`, s.x - 23, s.y + r + 6, '', { w: 46, h: 26, tone: 'warn', ring: true }));
        out.push(...miniRow(`sol${k}`, s.x, s.y + r + 8, p.map((i) => ({ value: elems[i], tone: ELEM_TONE[i] })), { w: 15, h: 20, size: 11 }));
      }
    });
    // Every remaining choice under these nodes would exceed 9.
    for (const k of [5, 6, 7, 8, 10]) {
      const s = slots[k];
      out.push(arrow(`x${k}`, [s.x, s.y + r + 1], [s.x, s.y + r + 18], { tone: 'danger', dashed: true, width: 1.5, dim: true }));
      out.push(text(`xt${k}`, s.x, s.y + r + 31, '> 9', { anchor: 'middle', mono: true, size: 11, tone: 'danger' }));
    }
    const six = slots[4];
    out.push(...stub('x4a', six.x, six.y, r, 40, 'danger'), ...stub('x4b', six.x, six.y, r, 70, 'danger'));
    out.push(...nodeBoxes);
    return {
      scene: { w: W, h: 276, nodes: out },
      legend: [
        { tone: 'danger', text: WORD.over9[l], shape: 'line', dashed: true },
        { tone: 'warn', text: WORD.dup45[l], shape: 'rect' },
      ],
    };
  },
};

// ── 11. Subset sum I: the full search with both prunings ─────────────

type StubKind = 'break' | 'start' | 'dup';
const STUB_TONE: Record<StubKind, Tone> = { break: 'danger', start: 'idle', dup: 'warn' };

interface SearchStep {
  kind: string;
  /** Nodes drawn so far. */
  shown: number[];
  /** Nodes whose loop has run, so their cut branches show. */
  cut: number[];
  cur: number | null;
  state: number[];
  res: number[][];
  say: string;
}

/** Draws a subset-sum search tree as far as a step has gone. */
function searchScene(step: SearchStep, tree: SNode[], slots: TreeSlot[], stubs: Record<number, { k: number; kind: StubKind; deg: number }[]>, elems: string[], opts: { r: number; infoY: number; h: number; stubLabels: boolean; target: number }) {
  const { r } = opts;
  const shown = new Set(step.shown);
  const onPath = new Set<number>();
  for (let k = step.cur; k !== null && k >= 0; k = tree[k].parent >= 0 ? tree[k].parent : null) onPath.add(k);
  const out: SceneNode[] = [...subsetHeader(elems, opts.target)];
  const circles: SceneNode[] = [];
  tree.forEach((n, k) => {
    if (!shown.has(k)) return;
    const s = slots[k];
    if (k > 0) {
      const p = slots[n.parent];
      const a: Pt = [p.x, p.y + r];
      const b: Pt = [s.x, s.y - r - 2];
      const hot = onPath.has(k);
      out.push(arrow(`e${k}`, a, b, { width: hot ? 2.25 : 1.5, tone: hot ? 'accent' : 'idle' }));
      out.push(edgeChip(`c${k}`, a, b, minus(elems[n.e]), ELEM_TONE[n.e], 0.5));
    }
    const solved = n.v === 0;
    circles.push(circle(`n${k}`, s.x, s.y, r, String(n.v), { tone: k === step.cur ? 'accent' : solved ? 'ok' : 'idle', ring: k === step.cur || solved }));
  });
  for (const k of step.cut) {
    const s = slots[k];
    for (const st of stubs[k] ?? []) out.push(...stub(`x${k}-${st.k}`, s.x, s.y, r, st.deg, STUB_TONE[st.kind], opts.stubLabels ? elems[st.k] : undefined));
  }
  out.push(...circles, ...stateAndRes(opts.infoY, step.state, step.res, elems));
  return { w: W, h: opts.h, nodes: out };
}

const SUB1_SAY: Record<'init' | 'try' | 'trySkip' | 'record' | 'breakAt' | 'tryBreak' | 'done', T> = {
  init: {
    en: 'Sort choices and subtract from target instead of summing: start at 9 with start = 0.',
    zh: '先对 choices 排序，并用 target 减去所选元素：从 9 开始，start = 0 。',
    'zh-hant': '先對 choices 排序，並用 target 減去所選元素：從 9 開始，start = 0 。',
    ja: 'choices をソートし、和を求める代わりに target から引いていきます。9 から始め、start = 0 です。',
    ru: 'Сортируем choices и вычитаем из target вместо суммирования: начинаем с 9, start = 0.',
  },
  try: {
    en: 'Choose {c}: target {a} − {c} = {b}. The next round starts at index {s}.',
    zh: '选择 {c} ：target 变为 {a} − {c} = {b} ，下一轮从索引 {s} 开始。',
    'zh-hant': '選擇 {c} ：target 變為 {a} − {c} = {b} ，下一輪從索引 {s} 開始。',
    ja: '{c} を選びます：target は {a} − {c} = {b} になり、次のラウンドはインデックス {s} から始まります。',
    ru: 'Выбираем {c}: target = {a} − {c} = {b}. Следующий раунд начинается с индекса {s}.',
  },
  trySkip: {
    en: 'Back at 9, choose 4: target becomes 5. The next round starts at index 1, so 3 is skipped and [4, 3] never appears.',
    zh: '回到 9 ，选择 4 ：target 变为 5 。下一轮从索引 1 开始，跳过 3 ，不会再生成 [4, 3] 。',
    'zh-hant': '回到 9 ，選擇 4 ：target 變為 5 。下一輪從索引 1 開始，跳過 3 ，不會再生成 [4, 3] 。',
    ja: '9 に戻り 4 を選びます：target は 5 になります。次のラウンドはインデックス 1 から始まるため 3 は飛ばされ、[4, 3] は生成されません。',
    ru: 'Вернувшись к 9, выбираем 4: target = 5. Следующий раунд начинается с индекса 1, поэтому 3 пропускается и [4, 3] не появится.',
  },
  record: {
    en: 'Choose {c}: target becomes 0, so record {set} in res.',
    zh: '选择 {c} ：target 变为 0 ，将 {set} 记录到 res 中。',
    'zh-hant': '選擇 {c} ：target 變為 0 ，將 {set} 記錄到 res 中。',
    ja: '{c} を選びます：target が 0 になったので、{set} を res に記録します。',
    ru: 'Выбираем {c}: target становится 0, записываем {set} в res.',
  },
  breakAt: {
    en: 'Back at 3: 3 − 4 < 0. Later elements are even larger, so the loop breaks.',
    zh: '回到 3 ：3 − 4 < 0 。后面的元素更大，因此直接结束循环。',
    'zh-hant': '回到 3 ：3 − 4 < 0 。後面的元素更大，因此直接結束迴圈。',
    ja: '3 に戻ります：3 − 4 < 0 です。後ろの要素はさらに大きいので、ループを終了します。',
    ru: 'Возвращаемся к 3: 3 − 4 < 0. Следующие элементы ещё больше, поэтому цикл прерывается.',
  },
  tryBreak: {
    en: 'Choose {c}: target becomes {b}. Every choice from index {s} on is too large, so the loop breaks at once.',
    zh: '选择 {c} ：target 变为 {b} 。从索引 {s} 起的选择都过大，循环直接结束。',
    'zh-hant': '選擇 {c} ：target 變為 {b} 。從索引 {s} 起的選擇都過大，迴圈直接結束。',
    ja: '{c} を選びます：target は {b} になります。インデックス {s} 以降の選択肢はどれも大きすぎるため、ループはすぐに終了します。',
    ru: 'Выбираем {c}: target = {b}. Все варианты начиная с индекса {s} слишком велики, и цикл сразу прерывается.',
  },
  done: {
    en: 'The search is complete: res = [[3, 3, 3], [4, 5]], and each subset appears once.',
    zh: '搜索结束：res = [[3, 3, 3], [4, 5]] ，每个子集只出现一次。',
    'zh-hant': '搜尋結束：res = [[3, 3, 3], [4, 5]] ，每個子集只出現一次。',
    ja: '探索が完了しました：res = [[3, 3, 3], [4, 5]] で、各部分集合は 1 回だけ現れます。',
    ru: 'Поиск завершён: res = [[3, 3, 3], [4, 5]], каждое подмножество встречается один раз.',
  },
};

const subsetSumI: StepFigure = {
  type: 'steps',
  call: 'subset_sum_i([3, 4, 5], 9)',
  tones: { init: 'idle', try: 'cmp', record: 'done', prune: 'swp', done: 'done' },
  sources: funcSources(SS1_PY, SS1_JAVA, ['backtrack'], {
    python: {
      init: ['for i in range(start, len(choices)):'],
      try: ['state.append(choices[i])', 'backtrack(state, target - choices[i], choices, i, res)'],
      record: ['res.append(list(state))'],
      prune: ['if target - choices[i] < 0:', 'break'],
      done: ['res.append(list(state))'],
    },
    java: {
      init: ['for (int i = start; i < choices.length; i++)'],
      try: ['state.add(choices[i]);', 'backtrack(state, target - choices[i], choices, i, res);'],
      record: ['res.add(new ArrayList<>(state));'],
      prune: ['if (target - choices[i] < 0)', 'break;'],
      done: ['res.add(new ArrayList<>(state));'],
    },
  }),
  build(l) {
    const elems = ['3', '4', '5'];
    const tree: SNode[] = [
      { v: 9, parent: -1, e: -1 },
      { v: 6, parent: 0, e: 0 },
      { v: 5, parent: 0, e: 1 },
      { v: 4, parent: 0, e: 2 },
      { v: 3, parent: 1, e: 0 },
      { v: 2, parent: 1, e: 1 },
      { v: 1, parent: 1, e: 2 },
      { v: 1, parent: 2, e: 1 },
      { v: 0, parent: 2, e: 2 },
      { v: 0, parent: 4, e: 0 },
    ];
    const slots = treeSlots(
      tree.map((n) => n.parent),
      20,
      400,
      28,
      62,
    );
    const fan = [-45, 0, 45];
    const cutsOf = (ks: [number, StubKind][], degs = fan) => ks.map(([k, kind]) => ({ k, kind, deg: degs[k] }));
    const stubs = {
      4: cutsOf(
        [
          [1, 'break'],
          [2, 'break'],
        ],
        [0, 35, 70],
      ),
      5: cutsOf([
        [0, 'start'],
        [1, 'break'],
        [2, 'break'],
      ]),
      6: cutsOf([
        [0, 'start'],
        [1, 'start'],
        [2, 'break'],
      ]),
      2: cutsOf([[0, 'start']], [-70, 0, 0]),
      7: cutsOf([
        [0, 'start'],
        [1, 'break'],
        [2, 'break'],
      ]),
      3: cutsOf([
        [0, 'start'],
        [1, 'start'],
        [2, 'break'],
      ]),
    };
    const S = SUB1_SAY;
    const steps: SearchStep[] = [
      { kind: 'init', shown: [0], cut: [], cur: 0, state: [], res: [], say: S.init[l] },
      { kind: 'try', shown: [0, 1], cut: [], cur: 1, state: [0], res: [], say: fmt(S.try[l], { c: 3, a: 9, b: 6, s: 0 }) },
      { kind: 'try', shown: [0, 1, 4], cut: [], cur: 4, state: [0, 0], res: [], say: fmt(S.try[l], { c: 3, a: 6, b: 3, s: 0 }) },
      { kind: 'record', shown: [0, 1, 4, 9], cut: [], cur: 9, state: [0, 0, 0], res: [[0, 0, 0]], say: fmt(S.record[l], { c: 3, set: '[3, 3, 3]' }) },
      { kind: 'prune', shown: [0, 1, 4, 9], cut: [4], cur: 4, state: [0, 0], res: [[0, 0, 0]], say: S.breakAt[l] },
      { kind: 'prune', shown: [0, 1, 4, 9, 5], cut: [4, 5], cur: 5, state: [0, 1], res: [[0, 0, 0]], say: fmt(S.tryBreak[l], { c: 4, b: 2, s: 1 }) },
      { kind: 'prune', shown: [0, 1, 4, 9, 5, 6], cut: [4, 5, 6], cur: 6, state: [0, 2], res: [[0, 0, 0]], say: fmt(S.tryBreak[l], { c: 5, b: 1, s: 2 }) },
      { kind: 'try', shown: [0, 1, 4, 9, 5, 6, 2], cut: [4, 5, 6, 2], cur: 2, state: [1], res: [[0, 0, 0]], say: S.trySkip[l] },
      { kind: 'prune', shown: [0, 1, 4, 9, 5, 6, 2, 7], cut: [4, 5, 6, 2, 7], cur: 7, state: [1, 1], res: [[0, 0, 0]], say: fmt(S.tryBreak[l], { c: 4, b: 1, s: 1 }) },
      {
        kind: 'record',
        shown: [0, 1, 4, 9, 5, 6, 2, 7, 8],
        cut: [4, 5, 6, 2, 7],
        cur: 8,
        state: [1, 2],
        res: [
          [0, 0, 0],
          [1, 2],
        ],
        say: fmt(S.record[l], { c: 5, set: '[4, 5]' }),
      },
      {
        kind: 'prune',
        shown: [0, 1, 4, 9, 5, 6, 2, 7, 8, 3],
        cut: [4, 5, 6, 2, 7, 3],
        cur: 3,
        state: [2],
        res: [
          [0, 0, 0],
          [1, 2],
        ],
        say: fmt(S.tryBreak[l], { c: 5, b: 4, s: 2 }),
      },
      {
        kind: 'done',
        shown: [0, 1, 4, 9, 5, 6, 2, 7, 8, 3],
        cut: [4, 5, 6, 2, 7, 3],
        cur: null,
        state: [],
        res: [
          [0, 0, 0],
          [1, 2],
        ],
        say: S.done[l],
      },
    ];
    const frames: SceneFrame[] = steps.map((s) => ({
      kind: s.kind,
      scene: searchScene(s, tree, slots, stubs, elems, { r: 14, infoY: 248, h: 280, stubLabels: false, target: 9 }),
      say: s.say,
    }));
    return {
      frames,
      legend: [
        { tone: 'danger', text: WORD.p1[l], shape: 'line', dashed: true },
        { tone: 'muted', text: WORD.p2[l], shape: 'line', dashed: true },
      ],
    };
  },
};

// ── 12. Different orders give the same subset ─────────────────────────

const subsetSumIPruning: StaticFigure = {
  type: 'static',
  build(l) {
    const elems = ['3', '4', '5'];
    const r = 12;
    const ys = [30, 98, 166];
    const leafX = (k: number) => 16 + (k + 0.5) * (420 / 9);
    const out: SceneNode[] = [...subsetHeader(elems)];
    const circles: SceneNode[] = [];
    const root: Pt = [leafX(4), ys[0]];
    circles.push(circle('n', root[0], root[1], r, '', { tone: 'muted' }));
    // Pruned pairs, and the earlier subset each one repeats.
    const twin: Record<string, string> = { '1,0': '0,1', '2,0': '0,2', '2,1': '1,2' };
    const subX: Record<string, number> = {};
    for (let i = 0; i < 3; i++) {
      const p: Pt = [leafX(1 + 3 * i), ys[1]];
      out.push(arrow(`e${i}`, [root[0], root[1] + r], [p[0], p[1] - r - 2], { width: 1.5 }));
      out.push(edgeChip(`c${i}`, [root[0], root[1] + r], [p[0], p[1] - r], `+${elems[i]}`, ELEM_TONE[i], 0.5));
      circles.push(circle(`n${i}`, p[0], p[1], r, '', { tone: 'muted' }));
      out.push(text(`start${i}`, p[0] - r - 6, p[1] + 4, `start = ${i}`, { anchor: 'end', mono: true, size: 11, tone: 'muted' }));
      for (let j = 0; j < 3; j++) {
        const key = `${i},${j}`;
        const cut = key in twin;
        const q: Pt = [leafX(3 * i + j), ys[2]];
        subX[key] = q[0];
        const a: Pt = [p[0], p[1] + r];
        const b: Pt = [q[0], q[1] - r - 2];
        out.push(arrow(`e${i}${j}`, a, b, { width: 1.5, dashed: cut, tone: cut ? 'muted' : 'idle' }));
        out.push(edgeChip(`c${i}${j}`, a, b, `+${elems[j]}`, cut ? 'muted' : ELEM_TONE[j], 0.62, { dashed: cut }));
        if (cut) out.push(snip(`snip${i}${j}`, a, b, 0.3));
        circles.push(circle(`n${i}${j}`, q[0], q[1], r, '', { tone: cut ? 'ghost' : 'muted', dashed: cut }));
        out.push(
          ...miniRow(`s${i}${j}`, q[0] - 4, q[1] + r + 8, [i, j].map((e) => ({ value: elems[e], tone: cut ? ('muted' as Tone) : ELEM_TONE[e], dashed: cut })), { w: 14, h: 18, size: 11 }),
          text(`s${i}${j}:m`, q[0] + 15, q[1] + r + 22, '…', { anchor: 'middle', size: 11, tone: 'muted' }),
        );
      }
    }
    const arcY = ys[2] + r + 30;
    Object.entries(twin).forEach(([cut, orig], k) => {
      const a = subX[orig];
      const b = subX[cut];
      out.push(arrow(`dup${k}`, [a - 4, arcY], [b - 4, arcY], { head: 'none', dashed: true, tone: 'idle', width: 1.25, bend: 8 + Math.abs(b - a) / 14 }));
    });
    out.push(text('dupl', W / 2, arcY + 50, WORD.dupSubsets[l], { anchor: 'middle', bold: true, size: 13, tone: 'muted' }));
    out.push(...circles);
    return {
      scene: { w: W, h: arcY + 60, nodes: out },
      legend: [{ tone: 'muted', text: WORD.repeatPrune[l], shape: 'line', dashed: true }],
    };
  },
};

// ── 13. Equal elements repeat subsets ─────────────────────────────────

const DUP4 = ['4', hat(4), '5'];

const subsetSumIIRepeat: StaticFigure = {
  type: 'static',
  build(l) {
    const r = 12;
    const ys = [34, 104, 174];
    const leafX = (k: number) => 20 + (k + 0.5) * 84;
    const out: SceneNode[] = [...subsetHeader(DUP4)];
    const circles: SceneNode[] = [];
    const A: Pt = [leafX(1), ys[1]];
    const root: Pt = [(leafX(1) + leafX(4)) / 2, ys[0]];
    circles.push(circle('n', root[0], root[1], r, '', { tone: 'muted' }));
    const kids: Pt[] = [A, [leafX(3), ys[1]], [leafX(4), ys[1]]];
    const sub = (id: string, cx: number, y: number, path: number[], dup: boolean) => {
      if (dup) out.push(box(`${id}bg`, cx - 30, y - 3, '', { w: 60, h: 24, tone: 'warn' }));
      out.push(
        ...miniRow(id, cx - 5, y, path.map((e) => ({ value: DUP4[e], tone: ELEM_TONE[e] })), { w: 15, h: 18, size: 11 }),
        text(`${id}:m`, cx - 5 + (path.length * 17 - 2) / 2 + 7, y + 14, '…', { anchor: 'middle', size: 11, tone: 'muted' }),
      );
    };
    kids.forEach((p, i) => {
      out.push(arrow(`e${i}`, [root[0], root[1] + r], [p[0], p[1] - r - 2], { width: 1.5 }));
      out.push(edgeChip(`c${i}`, [root[0], root[1] + r], [p[0], p[1] - r], `+${DUP4[i]}`, ELEM_TONE[i], 0.5));
      circles.push(circle(`n${i}`, p[0], p[1], r, '', { tone: 'muted' }));
    });
    sub('sA', A[0] + 44, A[1] - 9, [0], true);
    sub('sB', kids[1][0], kids[1][1] + r + 8, [1], true);
    sub('sC', kids[2][0], kids[2][1] + r + 8, [2], false);
    for (let j = 0; j < 3; j++) {
      const q: Pt = [leafX(j), ys[2]];
      out.push(arrow(`e0${j}`, [A[0], A[1] + r], [q[0], q[1] - r - 2], { width: 1.5 }));
      out.push(edgeChip(`c0${j}`, [A[0], A[1] + r], [q[0], q[1] - r], `+${DUP4[j]}`, ELEM_TONE[j], 0.5));
      circles.push(circle(`n0${j}`, q[0], q[1], r, '', { tone: 'muted' }));
      sub(`s0${j}`, q[0], q[1] + r + 8, [0, j], j < 2);
    }
    const lowY = ys[2] + r + 34;
    out.push(arrow('dupA', [leafX(0) - 5, lowY], [leafX(1) - 5, lowY], { head: 'none', dashed: true, tone: 'warn', width: 1.25, bend: 10 }));
    out.push(text('duplA', (leafX(0) + leafX(1)) / 2 - 5, lowY + 36, WORD.dupSubsets[l], { anchor: 'middle', bold: true, size: 13, tone: 'warn' }));
    const bY = kids[1][1] + r + 30;
    out.push(arrow('dupB', [A[0] + 39, A[1] + 12], [kids[1][0] - 5, bY], { head: 'none', dashed: true, tone: 'warn', width: 1.25, bend: 14 }));
    out.push(text('duplB', kids[1][0] - 5, bY + 24, WORD.dupSubsets[l], { anchor: 'middle', bold: true, size: 13, tone: 'warn' }));
    out.push(...circles);
    return { scene: { w: W, h: lowY + 48, nodes: out }, legend: [{ tone: 'warn', text: WORD.dupSubsets[l], shape: 'rect' }] };
  },
};

// ── 14. Subset sum II: skipping equal choices in a round ─────────────

const SUB2_SAY: Record<'init' | 'try1' | 'try2' | 'prune' | 'record' | 'skip' | 'try3' | 'done', T> = {
  init: {
    en: 'Sorted choices [4, 4̂, 5], target 9. Each element may be chosen at most once.',
    zh: '排序后的 choices 为 [4, 4̂, 5] ，target 为 9 。每个元素最多只能选择一次。',
    'zh-hant': '排序後的 choices 為 [4, 4̂, 5] ，target 為 9 。每個元素最多只能選擇一次。',
    ja: 'ソート済みの choices は [4, 4̂, 5]、target は 9 です。各要素は最大 1 回しか選べません。',
    ru: 'Отсортированные choices: [4, 4̂, 5], target = 9. Каждый элемент можно выбрать не более одного раза.',
  },
  try1: {
    en: 'Choose 4: target becomes 5. The next round starts at index 1, so this 4 cannot be chosen again.',
    zh: '选择 4 ：target 变为 5 。下一轮从索引 1 开始，这个 4 不会被重复选择。',
    'zh-hant': '選擇 4 ：target 變為 5 。下一輪從索引 1 開始，這個 4 不會被重複選擇。',
    ja: '4 を選びます：target は 5 になります。次のラウンドはインデックス 1 から始まるので、この 4 が再び選ばれることはありません。',
    ru: 'Выбираем 4: target = 5. Следующий раунд начинается с индекса 1, поэтому этот 4 повторно не выбирается.',
  },
  try2: {
    en: 'Choose 4̂: target becomes 1, and the next round starts at index 2.',
    zh: '选择 4̂ ：target 变为 1 ，下一轮从索引 2 开始。',
    'zh-hant': '選擇 4̂ ：target 變為 1 ，下一輪從索引 2 開始。',
    ja: '4̂ を選びます：target は 1 になり、次のラウンドはインデックス 2 から始まります。',
    ru: 'Выбираем 4̂: target = 1, следующий раунд начинается с индекса 2.',
  },
  prune: {
    en: 'At 1: indices 0 and 1 lie before start, and 1 − 5 < 0, so the loop breaks.',
    zh: '在 1 处：索引 0 和 1 位于 start 之前，且 1 − 5 < 0 ，循环直接结束。',
    'zh-hant': '在 1 處：索引 0 和 1 位於 start 之前，且 1 − 5 < 0 ，迴圈直接結束。',
    ja: '1 では、インデックス 0 と 1 は start より前にあり、1 − 5 < 0 なのでループを終了します。',
    ru: 'В узле 1: индексы 0 и 1 лежат до start, а 1 − 5 < 0, поэтому цикл прерывается.',
  },
  record: {
    en: 'Back at 5, choose 5: target becomes 0, so record [4, 5].',
    zh: '回到 5 ，选择 5 ：target 变为 0 ，记录 [4, 5] 。',
    'zh-hant': '回到 5 ，選擇 5 ：target 變為 0 ，記錄 [4, 5] 。',
    ja: '5 に戻って 5 を選びます：target が 0 になったので [4, 5] を記録します。',
    ru: 'Вернувшись к 5, выбираем 5: target = 0, записываем [4, 5].',
  },
  skip: {
    en: 'Back at 9: 4̂ equals the 4 on its left, which this round already chose. Skip it to avoid a duplicate subset.',
    zh: '回到 9 ：4̂ 与左边的 4 相等，而本轮已经选过 4 ，跳过它以避免重复子集。',
    'zh-hant': '回到 9 ：4̂ 與左邊的 4 相等，而本輪已經選過 4 ，跳過它以避免重複子集。',
    ja: '9 に戻ります：4̂ は左隣の 4 と等しく、このラウンドではすでに 4 を選んでいます。重複部分集合を避けるため飛ばします。',
    ru: 'Возвращаемся к 9: 4̂ равен 4 слева от него, который уже выбирался в этом раунде. Пропускаем его, чтобы избежать повторного подмножества.',
  },
  try3: {
    en: 'Choose 5: target becomes 4 and start = 3. No choices are left, so the call returns.',
    zh: '选择 5 ：target 变为 4 ，start = 3 。没有剩余选择，函数直接返回。',
    'zh-hant': '選擇 5 ：target 變為 4 ，start = 3 。沒有剩餘選擇，函式直接返回。',
    ja: '5 を選びます：target は 4、start = 3 になります。残る選択肢がないので、この呼び出しは戻ります。',
    ru: 'Выбираем 5: target = 4, start = 3. Вариантов не осталось, и вызов возвращается.',
  },
  done: {
    en: 'The search ends with res = [[4, 5]]: no duplicate subsets and no element used twice.',
    zh: '搜索结束，res = [[4, 5]] ：没有重复子集，也没有元素被重复选择。',
    'zh-hant': '搜尋結束，res = [[4, 5]] ：沒有重複子集，也沒有元素被重複選擇。',
    ja: '探索は res = [[4, 5]] で終了します。重複部分集合はなく、同じ要素が 2 回選ばれることもありません。',
    ru: 'Поиск завершён, res = [[4, 5]]: нет повторяющихся подмножеств, и ни один элемент не выбран дважды.',
  },
};

const subsetSumII: StepFigure = {
  type: 'steps',
  call: 'subset_sum_ii([4, 4, 5], 9)',
  tones: { init: 'idle', try: 'cmp', prune: 'swp', record: 'done', skip: 'swp', done: 'done' },
  sources: funcSources(SS2_PY, SS2_JAVA, ['backtrack'], {
    python: {
      init: ['for i in range(start, len(choices)):'],
      try: ['state.append(choices[i])', 'backtrack(state, target - choices[i], choices, i + 1, res)'],
      prune: ['if target - choices[i] < 0:', 'break'],
      record: ['res.append(list(state))'],
      skip: ['if i > start and choices[i] == choices[i - 1]:', 'continue'],
      done: ['res.append(list(state))'],
    },
    java: {
      init: ['for (int i = start; i < choices.length; i++)'],
      try: ['state.add(choices[i]);', 'backtrack(state, target - choices[i], choices, i + 1, res);'],
      prune: ['if (target - choices[i] < 0)', 'break;'],
      record: ['res.add(new ArrayList<>(state));'],
      skip: ['if (i > start && choices[i] == choices[i - 1])', 'continue;'],
      done: ['res.add(new ArrayList<>(state));'],
    },
  }),
  build(l) {
    const tree: SNode[] = [
      { v: 9, parent: -1, e: -1 },
      { v: 5, parent: 0, e: 0 },
      { v: 4, parent: 0, e: 2 },
      { v: 1, parent: 1, e: 1 },
      { v: 0, parent: 1, e: 2 },
    ];
    const slots = treeSlots(
      tree.map((n) => n.parent),
      40,
      360,
      34,
      70,
    );
    const stubs: Record<number, { k: number; kind: StubKind; deg: number }[]> = {
      0: [{ k: 1, kind: 'dup', deg: 0 }],
      1: [{ k: 0, kind: 'start', deg: -80 }],
      3: [
        { k: 0, kind: 'start', deg: -45 },
        { k: 1, kind: 'start', deg: 0 },
        { k: 2, kind: 'break', deg: 45 },
      ],
      2: [
        { k: 0, kind: 'start', deg: -45 },
        { k: 1, kind: 'start', deg: 0 },
        { k: 2, kind: 'start', deg: 45 },
      ],
    };
    const S = SUB2_SAY;
    const steps: SearchStep[] = [
      { kind: 'init', shown: [0], cut: [], cur: 0, state: [], res: [], say: S.init[l] },
      { kind: 'try', shown: [0, 1], cut: [], cur: 1, state: [0], res: [], say: S.try1[l] },
      { kind: 'try', shown: [0, 1, 3], cut: [1], cur: 3, state: [0, 1], res: [], say: S.try2[l] },
      { kind: 'prune', shown: [0, 1, 3], cut: [1, 3], cur: 3, state: [0, 1], res: [], say: S.prune[l] },
      { kind: 'record', shown: [0, 1, 3, 4], cut: [1, 3], cur: 4, state: [0, 2], res: [[0, 2]], say: S.record[l] },
      { kind: 'skip', shown: [0, 1, 3, 4], cut: [1, 3, 0], cur: 0, state: [], res: [[0, 2]], say: S.skip[l] },
      { kind: 'try', shown: [0, 1, 3, 4, 2], cut: [1, 3, 0, 2], cur: 2, state: [2], res: [[0, 2]], say: S.try3[l] },
      { kind: 'done', shown: [0, 1, 3, 4, 2], cut: [1, 3, 0, 2], cur: null, state: [], res: [[0, 2]], say: S.done[l] },
    ];
    const frames: SceneFrame[] = steps.map((s) => ({
      kind: s.kind,
      scene: searchScene(s, tree, slots, stubs, DUP4, { r: 15, infoY: 246, h: 278, stubLabels: true, target: 9 }),
      say: s.say,
    }));
    return {
      frames,
      legend: [
        { tone: 'danger', text: WORD.p1[l], shape: 'line', dashed: true },
        { tone: 'muted', text: WORD.p23[l], shape: 'line', dashed: true },
        { tone: 'warn', text: WORD.p4[l], shape: 'line', dashed: true },
      ],
    };
  },
};

// ── Chess boards ──────────────────────────────────────────────────────

const checker = (r: number, c: number): Tone => ((r + c) % 2 ? 'muted' : 'idle');

/** A 4 × 4 board; `cell` can recolor or label a square. Square ids are `${prefix}${r}-${c}`. */
function board(prefix: string, x: number, y: number, size: number, cell: (r: number, c: number) => Partial<Cell> = () => ({})) {
  const rows: Cell[][] = Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => ({ value: '', tone: checker(r, c), dashed: false, ...cell(r, c) })));
  return grid(prefix, x, y, rows, { w: size, h: size, gap: 3, size: Math.round(size * 0.42) });
}

const at = (x: number, y: number, size: number, r: number, c: number) => ({ x: x + c * (size + 3), y: y + r * (size + 3) });

const queen = (id: string, x: number, y: number, size: number, r: number, c: number, extra: Partial<BoxNode> = {}) => {
  const p = at(x, y, size, r, c);
  return box(id, p.x, p.y, QUEEN, { w: size, h: size, tone: 'ok', sans: true, size: Math.round(size * 0.58), ...extra });
};

const boardWidth = (size: number) => 4 * size + 9;

// ── 15. What a queen attacks ──────────────────────────────────────────

const nQueensConstraints: StaticFigure = {
  type: 'static',
  build(l) {
    const S = 38;
    const BW = boardWidth(S);
    const lx = 28;
    const rx = W - 28 - BW;
    const y = 36;
    const [qr, qc] = [1, 1];
    const kind = (r: number, c: number): Tone | null => {
      if (r === qr && c === qc) return null;
      if (r === qr) return 'warn';
      if (c === qc) return 'info';
      if (r - c === qr - qc) return 'ok';
      if (r + c === qr + qc) return 'accent';
      return null;
    };
    const solution = [1, 3, 0, 2];
    const nodes: SceneNode[] = [
      region('ra', lx - 12, y - 12, BW + 24, BW + 24, { tone: 'idle', label: WORD.attacked[l] }),
      region('rb', rx - 12, y - 12, BW + 24, BW + 24, { tone: 'ok', label: WORD.noAttack[l] }),
      ...board('a', lx, y, S, (r, c) => {
        const t = kind(r, c);
        return t ? { value: '×', tone: t } : {};
      }),
      queen('qa', lx, y, S, qr, qc, { tone: 'idle', ring: true }),
      ...board('b', rx, y, S),
      ...solution.map((c, r) => queen(`qb${r}`, rx, y, S, r, c)),
    ];
    return {
      scene: { w: W, h: y + BW + 16, nodes },
      legend: [
        { tone: 'warn', text: WORD.sameRow[l] },
        { tone: 'info', text: WORD.sameCol[l] },
        { tone: 'ok', text: WORD.sameMain[l] },
        { tone: 'accent', text: WORD.sameAnti[l] },
      ],
    };
  },
};

// ── 16. Placing queens row by row, with backtracking ──────────────────

const QUEENS_SAY: Record<'first' | 'place' | 'placeAfter' | 'allBad' | 'move' | 'deadEnd' | 'done', T> = {
  first: {
    en: 'Row 0: place a queen in column 0, and mark its column and both diagonals in cols, diags1 and diags2.',
    zh: '第 0 行：在第 0 列放置皇后，并在 cols、diags1、diags2 中标记其所在列和两条对角线。',
    'zh-hant': '第 0 行：在第 0 列放置皇后，並在 cols、diags1、diags2 中標記其所在列和兩條對角線。',
    ja: '行 0：列 0 にクイーンを置き、その列と 2 本の対角線を cols、diags1、diags2 に記録します。',
    ru: 'Строка 0: ставим ферзя в столбец 0 и отмечаем его столбец и обе диагонали в cols, diags1 и diags2.',
  },
  place: {
    en: 'Row {r}: place the queen in column {c}.',
    zh: '第 {r} 行：将皇后放在第 {c} 列。',
    'zh-hant': '第 {r} 行：將皇后放在第 {c} 列。',
    ja: '行 {r}：クイーンを列 {c} に置きます。',
    ru: 'Строка {r}: ставим ферзя в столбец {c}.',
  },
  placeAfter: {
    en: 'Row {r}: {bad} attacked and pruned. Place the queen in column {c}.',
    zh: '第 {r} 行：{bad}受到攻击，被剪枝。将皇后放在第 {c} 列。',
    'zh-hant': '第 {r} 行：{bad}受到攻擊，被剪枝。將皇后放在第 {c} 列。',
    ja: '行 {r}：{bad}は攻撃されるため枝刈りします。クイーンを列 {c} に置きます。',
    ru: 'Строка {r}: {bad} под ударом — обрезка. Ставим ферзя в столбец {c}.',
  },
  allBad: {
    en: 'Row {r}: every column is attacked. Backtrack to row {p}.',
    zh: '第 {r} 行：所有列都受到攻击，回退到第 {p} 行。',
    'zh-hant': '第 {r} 行：所有列都受到攻擊，回退到第 {p} 行。',
    ja: '行 {r}：どの列も攻撃されます。行 {p} に戻ります。',
    ru: 'Строка {r}: все столбцы под ударом. Откат к строке {p}.',
  },
  move: {
    en: 'Row {r}: remove the queen from column {a} and try column {b}.',
    zh: '第 {r} 行：撤销第 {a} 列的皇后，尝试第 {b} 列。',
    'zh-hant': '第 {r} 行：撤銷第 {a} 列的皇后，嘗試第 {b} 列。',
    ja: '行 {r}：列 {a} のクイーンを取り除き、列 {b} を試します。',
    ru: 'Строка {r}: убираем ферзя из столбца {a} и пробуем столбец {b}.',
  },
  deadEnd: {
    en: 'Row 2: columns 2 and 3 are attacked too. Rows 2 and 1 have no column left, so backtrack to row 0.',
    zh: '第 2 行：第 2、3 列也受到攻击。第 2 行和第 1 行都已无列可选，回退到第 0 行。',
    'zh-hant': '第 2 行：第 2、3 列也受到攻擊。第 2 行和第 1 行都已無列可選，回退到第 0 行。',
    ja: '行 2：列 2 と 3 も攻撃されます。行 2 と行 1 には試す列が残っていないので、行 0 に戻ります。',
    ru: 'Строка 2: столбцы 2 и 3 тоже под ударом. В строках 2 и 1 столбцов не осталось — откат к строке 0.',
  },
  done: {
    en: 'Row 3: columns 0 and 1 are attacked; place the queen in column 2. All 4 rows are filled: record the solution.',
    zh: '第 3 行：第 0、1 列受到攻击，将皇后放在第 2 列。4 行均已放置，记录该解。',
    'zh-hant': '第 3 行：第 0、1 列受到攻擊，將皇后放在第 2 列。4 行均已放置，記錄該解。',
    ja: '行 3：列 0 と 1 は攻撃されるので、クイーンを列 2 に置きます。4 行すべてが埋まったので解を記録します。',
    ru: 'Строка 3: столбцы 0 и 1 под ударом, ставим ферзя в столбец 2. Все 4 строки заполнены — записываем решение.',
  },
};

/** "column 0 is" / "columns 0 and 1 are", in each locale's own form. */
function colsList(l: Locale, cols: number[]): string {
  const and = (xs: number[], w: string) => (xs.length === 1 ? String(xs[0]) : `${xs.slice(0, -1).join(', ')} ${w} ${xs[xs.length - 1]}`);
  switch (l) {
    case 'en':
      return cols.length === 1 ? `column ${cols[0]} is` : `columns ${and(cols, 'and')} are`;
    case 'ru':
      return cols.length === 1 ? `столбец ${cols[0]}` : `столбцы ${and(cols, 'и')}`;
    case 'ja':
      return `列 ${cols.join('、')} `;
    default:
      return `第 ${cols.join('、')} 列`;
  }
}

const nQueensPlacing: StepFigure = {
  type: 'steps',
  call: 'n_queens(4)',
  tones: { place: 'cmp', back: 'swp', done: 'done' },
  sources: funcSources(NQ_PY, NQ_JAVA, ['backtrack'], {
    python: {
      place: ['if not cols[col] and not diags1[diag1] and not diags2[diag2]:', 'state[row][col] = "Q"', '1|cols[col] = diags1[diag1] = diags2[diag2]'],
      back: ['state[row][col] = "#"', '2|cols[col] = diags1[diag1] = diags2[diag2]'],
      done: ['res.append('],
    },
    java: {
      place: ['if (!cols[col] && !diags1[diag1] && !diags2[diag2])', 'state.get(row).set(col, "Q");', '1|cols[col] = diags1[diag1] = diags2[diag2]'],
      back: ['state.get(row).set(col, "#");', '2|cols[col] = diags1[diag1] = diags2[diag2]'],
      done: ['res.add(copyState);'],
    },
  }),
  build(l) {
    const S = 42;
    const bx = 30;
    const by = 34;
    const AX = 236;
    const scene = (qs: number[], row: number, bad: number[], kind: string) => {
      const nodes: SceneNode[] = [
        region('rowhl', bx - 5, by + row * (S + 3) - 5, boardWidth(S) + 10, S + 10, { tone: kind === 'back' ? 'danger' : 'accent' }),
        ...[0, 1, 2, 3].map((c) => text(`ci${c}`, bx + c * (S + 3) + S / 2, by - 10, String(c), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })),
        ...[0, 1, 2, 3].map((r) => text(`ri${r}`, bx - 12, by + r * (S + 3) + S / 2 + 4, String(r), { anchor: 'middle', mono: true, size: 11, tone: r === row ? 'accent' : 'muted', bold: r === row })),
        ...board('b', bx, by, S),
      ];
      for (const c of bad) {
        const p = at(bx, by, S, row, c);
        nodes.push(box(`x${row}-${c}`, p.x, p.y, '×', { w: S, h: S, tone: 'danger', sans: true, size: 22 }));
      }
      qs.forEach((c, r) => nodes.push(queen(`q${r}`, bx, by, S, r, c, { ring: kind !== 'back' && r === qs.length - 1 && r === row })));
      // The arrays the code keeps: a queen's column, main diagonal and anti-diagonal.
      const last = kind !== 'back' && qs.length - 1 === row ? row : -1;
      const arrays: { name: string; gloss: string; n: number; on: (i: number) => boolean; hot: number }[] = [
        { name: 'cols', gloss: 'col', n: 4, on: (i) => qs.includes(i), hot: last >= 0 ? qs[last] : -1 },
        { name: 'diags1', gloss: 'row − col + 3', n: 7, on: (i) => qs.some((c, r) => r - c + 3 === i), hot: last >= 0 ? last - qs[last] + 3 : -1 },
        { name: 'diags2', gloss: 'row + col', n: 7, on: (i) => qs.some((c, r) => r + c === i), hot: last >= 0 ? last + qs[last] : -1 },
      ];
      arrays.forEach((a, k) => {
        const y = 40 + k * 68;
        nodes.push(
          text(`${a.name}:l`, AX, y, a.name, { mono: true, bold: true, size: 12, tone: 'idle' }),
          text(`${a.name}:g`, AX + 56, y, `[${a.gloss}]`, { mono: true, size: 11, tone: 'muted' }),
          ...cells(
            a.name,
            AX,
            y + 8,
            Array.from({ length: a.n }, (_, i) => ({ value: a.on(i) ? 'T' : seg(['F', 'muted']), tone: a.on(i) ? ('ok' as Tone) : ('idle' as Tone), ring: i === a.hot })),
            { w: 24, h: 24, gap: 3, size: 12 },
          ),
          ...Array.from({ length: a.n }, (_, i) => text(`${a.name}:i${i}`, AX + i * 27 + 12, y + 46, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })),
        );
      });
      return { w: W, h: 228, nodes };
    };
    const Q = QUEENS_SAY;
    const steps: { kind: 'place' | 'back' | 'done'; qs: number[]; row: number; bad: number[]; say: string }[] = [
      { kind: 'place', qs: [0], row: 0, bad: [], say: Q.first[l] },
      { kind: 'place', qs: [0, 2], row: 1, bad: [0, 1], say: fmt(Q.placeAfter[l], { r: 1, c: 2, bad: colsList(l, [0, 1]) }) },
      { kind: 'back', qs: [0, 2], row: 2, bad: [0, 1, 2, 3], say: fmt(Q.allBad[l], { r: 2, p: 1 }) },
      { kind: 'place', qs: [0, 3], row: 1, bad: [], say: fmt(Q.move[l], { r: 1, a: 2, b: 3 }) },
      { kind: 'place', qs: [0, 3, 1], row: 2, bad: [0], say: fmt(Q.placeAfter[l], { r: 2, c: 1, bad: colsList(l, [0]) }) },
      { kind: 'back', qs: [0, 3, 1], row: 3, bad: [0, 1, 2, 3], say: fmt(Q.allBad[l], { r: 3, p: 2 }) },
      { kind: 'back', qs: [0, 3], row: 2, bad: [2, 3], say: Q.deadEnd[l] },
      { kind: 'place', qs: [1], row: 0, bad: [], say: fmt(Q.move[l], { r: 0, a: 0, b: 1 }) },
      { kind: 'place', qs: [1, 3], row: 1, bad: [0, 1, 2], say: fmt(Q.placeAfter[l], { r: 1, c: 3, bad: colsList(l, [0, 1, 2]) }) },
      { kind: 'place', qs: [1, 3, 0], row: 2, bad: [], say: fmt(Q.place[l], { r: 2, c: 0 }) },
      { kind: 'done', qs: [1, 3, 0, 2], row: 3, bad: [0, 1], say: Q.done[l] },
    ];
    const frames: SceneFrame[] = steps.map((s) => ({ kind: s.kind, scene: scene(s.qs, s.row, s.bad, s.kind), say: s.say }));
    return {
      frames,
      legend: [
        { tone: 'ok', text: WORD.queen[l] },
        { tone: 'danger', text: WORD.conflict[l] },
        { tone: 'accent', text: WORD.curRow[l] },
      ],
    };
  },
};

// ── 17. Diagonals share row − col or row + col ────────────────────────

const nQueensColsDiagonals: StaticFigure = {
  type: 'static',
  build(l) {
    const S = 32;
    const BW = boardWidth(S);
    const PW = W / 2;
    const [qr, qc] = [1, 1];
    const nodes: SceneNode[] = [];
    const panel = (key: string, px: number, f: (r: number, c: number) => number, name: string, label: string, tone: Tone) => {
      const bx = px + (PW - BW) / 2;
      const by = 30;
      const hit = f(qr, qc);
      const fmtv = (v: number) => (v < 0 ? `−${-v}` : String(v));
      nodes.push(
        text(`${key}:t`, px + PW / 2, 18, label, { anchor: 'middle', mono: true, bold: true, size: 13, tone }),
        ...board(`${key}b`, bx, by, S, (r, c) => (f(r, c) === hit ? { value: fmtv(f(r, c)), tone } : { value: seg([fmtv(f(r, c)), 'muted']) })),
        queen(`${key}q`, bx, by, S, qr, qc, { tone, ring: true }),
      );
      const cw = 19;
      const ax = px + (PW - (7 * cw + 12)) / 2;
      const ay = by + BW + 26;
      const index = (v: number) => (key === 'm' ? v + 3 : v);
      nodes.push(
        text(`${key}:a`, px + PW / 2, ay - 6, seg([name, tone, true], key === 'm' ? '[row − col + 3]' : '[row + col]'), { anchor: 'middle', mono: true, size: 12 }),
        ...cells(
          `${key}a`,
          ax,
          ay,
          Array.from({ length: 7 }, (_, i) => (i === index(hit) ? { value: 'T', tone } : { value: seg(['F', 'muted']), tone: 'idle' as Tone })),
          { w: cw, h: 22, gap: 2, size: 11 },
        ),
        ...Array.from({ length: 7 }, (_, i) => text(`${key}:i${i}`, ax + i * (cw + 2) + cw / 2, ay + 36, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })),
      );
    };
    panel('m', 0, (r, c) => r - c, 'diags1', 'row − col', 'info');
    panel('n', PW, (r, c) => r + c, 'diags2', 'row + col', 'accent');
    return {
      scene: { w: W, h: 30 + BW + 26 + 46, nodes },
      legend: [
        { tone: 'info', text: WORD.mainDiag[l] },
        { tone: 'accent', text: WORD.antiDiag[l] },
      ],
    };
  },
};

// ── 18. The two solutions for n = 4 ──────────────────────────────────

const solution4Queens: StaticFigure = {
  type: 'static',
  build(l) {
    const S = 44;
    const BW = boardWidth(S);
    const gap = 36;
    const x0 = (W - 2 * BW - gap) / 2;
    const y = 14;
    const solutions = [
      [1, 3, 0, 2],
      [2, 0, 3, 1],
    ];
    const nodes: SceneNode[] = solutions.flatMap((sol, k) => {
      const x = x0 + k * (BW + gap);
      return [
        ...board(`b${k}`, x, y, S),
        ...sol.map((c, r) => queen(`q${k}-${r}`, x, y, S, r, c)),
        text(`t${k}`, x + BW / 2, y + BW + 22, fmt(WORD.solution[l], { n: k + 1 }), { anchor: 'middle', bold: true, size: 13, tone: 'muted' }),
      ];
    });
    return { scene: { w: W, h: y + BW + 34, nodes } };
  },
};

const FIGURES: Record<string, Figure> = {
  preorder_find_nodes: preorderFindNodes,
  preorder_find_paths_steps: preorderFindPaths,
  preorder_find_constrained_paths: preorderFindConstrainedPaths,
  backtrack_remove_return_or_not: backtrackRemoveReturn,
  permutations_i: permutationsI,
  permutations_i_pruning: permutationsIPruning,
  permutations_ii: permutationsII,
  permutations_ii_pruning: permutationsIIPruning,
  permutations_ii_pruning_summary: permutationsIIPruningSummary,
  subset_sum_i_naive: subsetSumINaive,
  subset_sum_i: subsetSumI,
  subset_sum_i_pruning: subsetSumIPruning,
  subset_sum_ii_repeat: subsetSumIIRepeat,
  subset_sum_ii: subsetSumII,
  n_queens_constraints: nQueensConstraints,
  n_queens_placing: nQueensPlacing,
  n_queens_cols_diagonals: nQueensColsDiagonals,
  solution_4_queens: solution4Queens,
};

export default FIGURES;
