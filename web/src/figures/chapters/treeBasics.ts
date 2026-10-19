import bfsJavaEn from '@codes-en/java/chapter_tree/binary_tree_bfs.java?raw';
import dfsJavaEn from '@codes-en/java/chapter_tree/binary_tree_dfs.java?raw';
import bfsPyEn from '@codes-en/python/chapter_tree/binary_tree_bfs.py?raw';
import dfsPyEn from '@codes-en/python/chapter_tree/binary_tree_dfs.py?raw';
import bfsJavaJa from '@codes-ja/java/chapter_tree/binary_tree_bfs.java?raw';
import dfsJavaJa from '@codes-ja/java/chapter_tree/binary_tree_dfs.java?raw';
import bfsPyJa from '@codes-ja/python/chapter_tree/binary_tree_bfs.py?raw';
import dfsPyJa from '@codes-ja/python/chapter_tree/binary_tree_dfs.py?raw';
import bfsJavaRu from '@codes-ru/java/chapter_tree/binary_tree_bfs.java?raw';
import dfsJavaRu from '@codes-ru/java/chapter_tree/binary_tree_dfs.java?raw';
import bfsPyRu from '@codes-ru/python/chapter_tree/binary_tree_bfs.py?raw';
import dfsPyRu from '@codes-ru/python/chapter_tree/binary_tree_dfs.py?raw';
import bfsJavaZh from '@codes-zh/java/chapter_tree/binary_tree_bfs.java?raw';
import dfsJavaZh from '@codes-zh/java/chapter_tree/binary_tree_dfs.java?raw';
import bfsPyZh from '@codes-zh/python/chapter_tree/binary_tree_bfs.py?raw';
import dfsPyZh from '@codes-zh/python/chapter_tree/binary_tree_dfs.py?raw';
import bfsJavaZhHant from '@codes-zh-hant/java/chapter_tree/binary_tree_bfs.java?raw';
import dfsJavaZhHant from '@codes-zh-hant/java/chapter_tree/binary_tree_dfs.java?raw';
import bfsPyZhHant from '@codes-zh-hant/python/chapter_tree/binary_tree_bfs.py?raw';
import dfsPyZhHant from '@codes-zh-hant/python/chapter_tree/binary_tree_dfs.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, cells, center, chip, indices, link, listNode, region, seg, tag, text, textWidth } from '../kit';
import type { ArrowNode, BoxNode, Figure, PathNode, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

const BFS_PY = raw(bfsPyEn, bfsPyZh, bfsPyZhHant, bfsPyJa, bfsPyRu);
const BFS_JAVA = raw(bfsJavaEn, bfsJavaZh, bfsJavaZhHant, bfsJavaJa, bfsJavaRu);
const DFS_PY = raw(dfsPyEn, dfsPyZh, dfsPyZhHant, dfsPyJa, dfsPyRu);
const DFS_JAVA = raw(dfsJavaEn, dfsJavaZh, dfsJavaZhHant, dfsJavaJa, dfsJavaRu);

const W = 440;

const WORD = {
  parent: { en: 'parent node', zh: '父节点', 'zh-hant': '父節點', ja: '親ノード', ru: 'родительский узел' },
  leftChild: { en: 'left child node', zh: '左子节点', 'zh-hant': '左子節點', ja: '左子ノード', ru: 'левый дочерний узел' },
  rightChild: { en: 'right child node', zh: '右子节点', 'zh-hant': '右子節點', ja: '右子ノード', ru: 'правый дочерний узел' },
  leftSub: { en: 'left subtree', zh: '左子树', 'zh-hant': '左子樹', ja: '左部分木', ru: 'левое поддерево' },
  rightSub: { en: 'right subtree', zh: '右子树', 'zh-hant': '右子樹', ja: '右部分木', ru: 'правое поддерево' },
  root: { en: 'root node', zh: '根节点', 'zh-hant': '根節點', ja: '根ノード', ru: 'корневой узел' },
  leaf: { en: 'leaf node', zh: '叶节点', 'zh-hant': '葉節點', ja: '葉ノード', ru: 'листовой узел' },
  edge: { en: 'edge', zh: '边', 'zh-hant': '邊', ja: '辺', ru: 'ребро' },
  height: { en: 'height', zh: '高度', 'zh-hant': '高度', ja: '高さ', ru: 'высота' },
  depth: { en: 'depth', zh: '深度', 'zh-hant': '深度', ja: '深さ', ru: 'глубина' },
  queue: { en: 'queue', zh: '队列', 'zh-hant': '佇列', ja: 'キュー', ru: 'очередь' },
  stack: { en: 'call stack', zh: '调用栈', 'zh-hant': '呼叫堆疊', ja: '呼び出しスタック', ru: 'стек вызовов' },
  pre: { en: 'preorder', zh: '前序遍历', 'zh-hant': '前序走訪', ja: '先行順走査', ru: 'прямой обход' },
  in: { en: 'inorder', zh: '中序遍历', 'zh-hant': '中序走訪', ja: '中間順走査', ru: 'симметричный обход' },
  post: { en: 'postorder', zh: '后序遍历', 'zh-hant': '後序走訪', ja: '後行順走査', ru: 'обратный обход' },
  levelOrder: { en: 'level-order traversal', zh: '层序遍历', 'zh-hant': '層序走訪', ja: 'レベル順走査', ru: 'обход по уровням' },
  perfect: { en: 'perfect binary tree', zh: '完美二叉树', 'zh-hant': '完美二元樹', ja: '充足二分木', ru: 'идеальное двоичное дерево' },
  list: { en: 'linked list', zh: '链表', 'zh-hant': '鏈結串列', ja: '連結リスト', ru: 'связный список' },
  ideal: { en: 'Ideal structure', zh: '理想结构', 'zh-hant': '理想結構', ja: '理想的な構造', ru: 'Лучшая структура' },
  degenerate: { en: 'Degenerate structure', zh: '退化结构', 'zh-hant': '退化結構', ja: '退化した構造', ru: 'Вырожденная структура' },
  l2r: { en: 'left to right', zh: '从左至右', 'zh-hant': '從左至右', ja: '左から右へ', ru: 'слева направо' },
  deg2: { en: 'degree 2', zh: '度为 2', 'zh-hant': '度為 2', ja: '次数 2', ru: 'степень 2' },
  deg0: { en: 'degree 0 (leaf node)', zh: '度为 0（叶节点）', 'zh-hant': '度為 0（葉節點）', ja: '次数 0（葉ノード）', ru: 'степень 0 (листовой узел)' },
  left: { en: 'left', zh: '左', 'zh-hant': '左', ja: '左', ru: 'левый' },
  right: { en: 'right', zh: '右', 'zh-hant': '右', ja: '右', ru: 'правый' },
} satisfies Record<string, T>;

const AND: T = { en: ' and ', zh: ' 和 ', 'zh-hant': ' 和 ', ja: ' と ', ru: ' и ' };

const levelWord = (l: Locale, n: number) => ({ en: `level ${n}`, zh: `第 ${n} 层`, 'zh-hant': `第 ${n} 層`, ja: `レベル ${n}`, ru: `уровень ${n}` })[l];

// ── Trees stored level by level ───────────────────────────────────────

type Val = number | string | null;

interface Lay {
  left: number;
  width: number;
  top: number;
  gap: number;
}

/** Depth of index `i` in a level-order array. */
const depthOf = (i: number) => {
  let d = 0;
  while (2 ** (d + 1) - 1 <= i) d++;
  return d;
};

/** Center of slot `i` of a level-order array: level d has 2^d evenly spaced slots. */
function slotAt(i: number, o: Lay) {
  const d = depthOf(i);
  const k = i + 1 - 2 ** d;
  return { x: o.left + ((k + 0.5) * o.width) / 2 ** d, y: o.top + d * o.gap, d };
}

const has = (values: Val[], i: number) => i < values.length && values[i] !== null;

/** Is `i` inside the subtree whose root is index `root`? */
const inSub = (i: number, root: number) => {
  let k = i;
  while (k > root) k = (k - 1) >> 1;
  return k === root;
};

/**
 * Draws a tree given as a level-order array (`null` = no node). Node ids are `${prefix}${index}` and
 * edges `${prefix}e${child index}`. With `gaps`, `null` slots are drawn as dashed placeholders.
 */
function levelTree(
  prefix: string,
  values: Val[],
  o: Lay & { r?: number; size?: number; gaps?: boolean; node?: (i: number) => Partial<BoxNode>; edge?: (i: number) => Partial<ArrowNode> },
) {
  const r = o.r ?? 16;
  const boxes = new Map<number, BoxNode>();
  values.forEach((v, i) => {
    if (v === null && !o.gaps) return;
    const { x, y } = slotAt(i, o);
    boxes.set(
      i,
      box(`${prefix}${i}`, x - r, y - r, v === null ? '' : String(v), {
        w: 2 * r,
        h: 2 * r,
        shape: 'circle',
        size: o.size ?? (r < 15 ? 12 : 14),
        tone: v === null ? 'ghost' : 'ok',
        dashed: v === null,
        ...(v === null ? {} : o.node?.(i)),
      }),
    );
  });
  const edges: SceneNode[] = [];
  for (const [i, b] of boxes) {
    const p = (i - 1) >> 1;
    if (i === 0 || !has(values, i) || !has(values, p)) continue;
    edges.push(link(`${prefix}e${i}`, boxes.get(p)!, b, { pad: 2, width: 1.5, ...o.edge?.(i) }));
  }
  return { nodes: [...edges, ...boxes.values()], boxes };
}

/** Index labels under the nodes of a level-order tree. */
const indexLabels = (prefix: string, boxes: Map<number, BoxNode>, hot: (i: number) => Tone | undefined = () => undefined) =>
  [...boxes].map(([i, b]) => {
    const tone = hot(i);
    return text(`${prefix}i${i}`, b.x + b.w / 2, b.y + b.h + 12, String(i), { anchor: 'middle', mono: true, size: 11, tone: tone ?? 'muted', bold: Boolean(tone) });
  });

const ONE_TO = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

// ── Walking around a tree (depth-first) ───────────────────────────────

type Pt = [number, number];

/**
 * The outline a depth-first walk traces around a tree: for each node it passes the left side,
 * dips into the left subtree, passes underneath, the right subtree, then the right side.
 * `at` names the points: `L3`, `B3`, `R3` for index 3, `S` start and `E` end.
 */
function contour(values: Val[], o: Lay, R: number) {
  const pts: Pt[] = [];
  const at: Record<string, number> = {};
  const root = slotAt(0, o);
  at.S = pts.push([root.x - 14, root.y - 2.2 * R]) - 1;
  const walk = (i: number) => {
    const { x, y } = slotAt(i, o);
    at[`L${i}`] = pts.push([x - R, y]) - 1;
    if (has(values, 2 * i + 1)) walk(2 * i + 1);
    at[`B${i}`] = pts.push([x, y + R]) - 1;
    if (has(values, 2 * i + 2)) walk(2 * i + 2);
    at[`R${i}`] = pts.push([x + R, y]) - 1;
  };
  walk(0);
  at.E = pts.push([root.x + 14, root.y - 2.2 * R]) - 1;
  return { pts, at };
}

/** A smooth curve through the points (Catmull-Rom as cubic Béziers). */
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

/** The walk up to point `upto`; later points collapse onto it so the path keeps its shape and can grow smoothly. */
function walkPath(id: string, pts: Pt[], upto: number, dim = false): PathNode {
  const cut = pts.map((q, k) => (k <= upto ? q : pts[upto]));
  return { kind: 'path', id, d: smooth(cut), tone: 'ok', dashed: true, width: 2, dim };
}

// ── 1. Parent, child, subtree ─────────────────────────────────────────

const DEF_SAY: Record<'tree' | 'parent' | 'left' | 'right' | 'node2', T> = {
  tree: {
    en: 'A binary tree: each node holds a value and two references, one to its left child node and one to its right child node.',
    zh: '二叉树：每个节点包含一个值，以及指向左子节点和右子节点的两个引用。',
    'zh-hant': '二元樹：每個節點包含一個值，以及指向左子節點和右子節點的兩個引用。',
    ja: '二分木：各ノードは値と、左子ノードと右子ノードへの 2 つの参照を持ちます。',
    ru: 'Двоичное дерево: каждый узел хранит значение и две ссылки — на левый и на правый дочерний узел.',
  },
  parent: {
    en: 'Node 1 is the parent node of nodes 2 and 3: node 2 is its left child node, node 3 its right child node.',
    zh: '节点 1 是节点 2 和 3 的父节点：节点 2 是它的左子节点，节点 3 是它的右子节点。',
    'zh-hant': '節點 1 是節點 2 和 3 的父節點：節點 2 是它的左子節點，節點 3 是它的右子節點。',
    ja: 'ノード 1 はノード 2 と 3 の親ノードです。ノード 2 が左子ノード、ノード 3 が右子ノードです。',
    ru: 'Узел 1 — родительский узел для узлов 2 и 3: узел 2 — его левый дочерний узел, узел 3 — правый.',
  },
  left: {
    en: 'Node 2 and all the nodes below it form the left subtree of node 1.',
    zh: '节点 2 及其以下的所有节点构成节点 1 的左子树。',
    'zh-hant': '節點 2 及其以下的所有節點構成節點 1 的左子樹。',
    ja: 'ノード 2 とその配下のすべてのノードが、ノード 1 の左部分木です。',
    ru: 'Узел 2 и все узлы под ним образуют левое поддерево узла 1.',
  },
  right: {
    en: 'Node 3 and all the nodes below it form the right subtree of node 1.',
    zh: '节点 3 及其以下的所有节点构成节点 1 的右子树。',
    'zh-hant': '節點 3 及其以下的所有節點構成節點 1 的右子樹。',
    ja: 'ノード 3 とその配下のすべてのノードが、ノード 1 の右部分木です。',
    ru: 'Узел 3 и все узлы под ним образуют правое поддерево узла 1.',
  },
  node2: {
    en: 'Any node can be seen as a parent. For node 2, the left subtree is node 4 and the nodes below it, the right subtree is node 5 and the nodes below it.',
    zh: '任何节点都可以视为父节点。对节点 2 来说，左子树是节点 4 及其以下节点，右子树是节点 5 及其以下节点。',
    'zh-hant': '任何節點都可以視為父節點。對節點 2 來說，左子樹是節點 4 及其以下節點，右子樹是節點 5 及其以下節點。',
    ja: 'どのノードも親ノードとみなせます。ノード 2 の左部分木はノード 4 とその配下、右部分木はノード 5 とその配下です。',
    ru: 'Любой узел можно считать родительским. У узла 2 левое поддерево — узел 4 и узлы под ним, правое — узел 5 и узлы под ним.',
  },
};

const binaryTreeDefinition: StepFigure = {
  type: 'steps',
  tones: { tree: 'idle', parent: 'cmp', left: 'swp', right: 'swp', node2: 'done' },
  build(l) {
    const values = ONE_TO(15);
    const lay = { left: 0, width: W, top: 56, gap: 60 };
    const r = 15;
    const H = 266;
    const half = (s: string) => (textWidth(s, 12) * 1.08) / 2;
    /** A tinted panel around the subtree rooted at index k. */
    const subRegion = (id: string, k: number, tone: Tone, label?: string) => {
      const idx = values.map((_, i) => i).filter((i) => inSub(i, k));
      const xs = idx.map((i) => slotAt(i, lay).x);
      const top = slotAt(k, lay).y - r - 9;
      const bottom = slotAt(14, lay).y + r + 8;
      const x = Math.min(...xs) - r - 9;
      return region(id, x, top, Math.max(...xs) + r + 9 - x, bottom - top, { tone, label });
    };
    const scene = (focus: keyof typeof DEF_SAY) => {
      const node = (i: number): Partial<BoxNode> => {
        if (focus === 'parent') return i === 0 ? { tone: 'accent', ring: true } : i <= 2 ? { tone: 'info' } : { dim: true };
        if (focus === 'left') return i === 0 ? { tone: 'accent', ring: true } : inSub(i, 1) ? {} : { dim: true };
        if (focus === 'right') return i === 0 ? { tone: 'accent', ring: true } : inSub(i, 2) ? {} : { dim: true };
        if (focus === 'node2') return i === 1 ? { tone: 'accent', ring: true } : inSub(i, 3) || inSub(i, 4) ? {} : { dim: true };
        return {};
      };
      const edge = (i: number): Partial<ArrowNode> => {
        if (focus === 'parent') return i <= 2 ? { tone: 'accent' } : { dim: true };
        if (focus === 'left') return i === 1 ? { tone: 'accent' } : inSub(i, 1) ? {} : { dim: true };
        if (focus === 'right') return i === 2 ? { tone: 'accent' } : inSub(i, 2) ? {} : { dim: true };
        if (focus === 'node2') return i === 3 || i === 4 ? { tone: 'accent' } : inSub(i, 3) || inSub(i, 4) ? {} : { dim: true };
        return {};
      };
      const nodes: SceneNode[] = [];
      if (focus === 'left') nodes.push(subRegion('sub:l', 1, 'warn', WORD.leftSub[l]));
      if (focus === 'right') nodes.push(subRegion('sub:r', 2, 'info', WORD.rightSub[l]));
      if (focus === 'node2') nodes.push(subRegion('sub:ll', 3, 'warn'), subRegion('sub:lr', 4, 'info'));
      nodes.push(...levelTree('n', values, { ...lay, r, size: 13, node, edge }).nodes);
      const root = slotAt(0, lay);
      if (focus === 'parent') {
        nodes.push(
          text('lab:p', root.x, root.y - r - 10, WORD.parent[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
          // Over the child, shifted outward when long so it stays clear of the edge from the root.
          text('lab:l', Math.max(Math.min(slotAt(1, lay).x - 10, 150 - half(WORD.leftChild[l])), 4 + half(WORD.leftChild[l])), slotAt(1, lay).y - r - 10, WORD.leftChild[l], { anchor: 'middle', size: 12, bold: true, tone: 'info' }),
          text('lab:r', Math.min(Math.max(slotAt(2, lay).x + 10, W - 150 + half(WORD.rightChild[l])), W - 4 - half(WORD.rightChild[l])), slotAt(2, lay).y - r - 10, WORD.rightChild[l], { anchor: 'middle', size: 12, bold: true, tone: 'info' }),
        );
      }
      if (focus === 'node2') {
        const n2 = slotAt(1, lay);
        nodes.push(text('lab:p2', n2.x, n2.y - r - 10, WORD.parent[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
      }
      return { w: W, h: H, nodes };
    };
    const kinds = ['tree', 'parent', 'left', 'right', 'node2'] as const;
    return { frames: kinds.map((k) => ({ kind: k, scene: scene(k), say: DEF_SAY[k][l] })) };
  },
};

// ── 2. Terminology ────────────────────────────────────────────────────

type Term = 'root' | 'leaf' | 'edge' | 'level' | 'degree' | 'height' | 'depth' | 'nodeHeight';

const TERM_SAY: Record<Term, T> = {
  root: {
    en: 'Root node: the node at the top of the binary tree. It has no parent node.',
    zh: '根节点：位于二叉树顶层的节点，没有父节点。',
    'zh-hant': '根節點：位於二元樹頂層的節點，沒有父節點。',
    ja: '根ノード：二分木の最上位にあるノードで、親ノードを持ちません。',
    ru: 'Корневой узел: узел на верхнем уровне двоичного дерева, у него нет родительского узла.',
  },
  leaf: {
    en: 'Leaf nodes: nodes without children; both of their pointers are None.',
    zh: '叶节点：没有子节点的节点，其两个指针均指向 None。',
    'zh-hant': '葉節點：沒有子節點的節點，其兩個指標均指向 None。',
    ja: '葉ノード：子ノードを持たないノードで、2 本のポインタはどちらも None を指します。',
    ru: 'Листовые узлы: узлы без дочерних узлов, оба их указателя направлены на None.',
  },
  edge: {
    en: 'Edge: the line connecting two nodes, that is, a reference (pointer) from a node to its child.',
    zh: '边：连接两个节点的线段，即节点引用（指针）。',
    'zh-hant': '邊：連線兩個節點的線段，即節點引用（指標）。',
    ja: '辺：2 つのノードを結ぶ線分、つまりノード参照（ポインタ）です。',
    ru: 'Ребро: отрезок, соединяющий два узла, то есть ссылка (указатель) между ними.',
  },
  level: {
    en: 'Level: counted from top to bottom; the root node is on level 1.',
    zh: '层：从顶至底递增，根节点所在层为 1。',
    'zh-hant': '層：從頂至底遞增，根節點所在層為 1。',
    ja: 'レベル：上から下へ増えていき、根ノードのレベルは 1 です。',
    ru: 'Уровень: растёт сверху вниз, корневой узел находится на уровне 1.',
  },
  degree: {
    en: 'Degree: the number of child nodes a node has. In a binary tree it is 0, 1 or 2.',
    zh: '度：节点的子节点数量。在二叉树中，度的取值为 0、1、2。',
    'zh-hant': '度：節點的子節點數量。在二元樹中，度的取值為 0、1、2。',
    ja: '次数：ノードが持つ子ノードの数。二分木では 0、1、2 のいずれかです。',
    ru: 'Степень: число дочерних узлов. В двоичном дереве она равна 0, 1 или 2.',
  },
  height: {
    en: 'Height of the binary tree: the number of edges from the root node to the farthest leaf node, here 3.',
    zh: '二叉树的高度：从根节点到最远叶节点所经过的边的数量，这里是 3。',
    'zh-hant': '二元樹的高度：從根節點到最遠葉節點所經過的邊的數量，這裡是 3。',
    ja: '二分木の高さ：根ノードから最も遠い葉ノードまでに通る辺の数で、ここでは 3 です。',
    ru: 'Высота двоичного дерева: число рёбер от корневого узла до самого удалённого листового узла, здесь 3.',
  },
  depth: {
    en: 'Depth of a node: the number of edges from the root node down to it. Node 2 has depth 1.',
    zh: '节点的深度：从根节点到该节点所经过的边的数量。节点 2 的深度为 1。',
    'zh-hant': '節點的深度：從根節點到該節點所經過的邊的數量。節點 2 的深度為 1。',
    ja: 'ノードの深さ：根ノードからそのノードまでに通る辺の数。ノード 2 の深さは 1 です。',
    ru: 'Глубина узла: число рёбер от корневого узла до него. Глубина узла 2 равна 1.',
  },
  nodeHeight: {
    en: 'Height of a node: the number of edges from its farthest leaf node up to it. Node 2 has height 2.',
    zh: '节点的高度：从距离该节点最远的叶节点到该节点所经过的边的数量。节点 2 的高度为 2。',
    'zh-hant': '節點的高度：從距離該節點最遠的葉節點到該節點所經過的邊的數量。節點 2 的高度為 2。',
    ja: 'ノードの高さ：最も遠い葉ノードからそのノードまでに通る辺の数。ノード 2 の高さは 2 です。',
    ru: 'Высота узла: число рёбер от самого удалённого листового узла до него. Высота узла 2 равна 2.',
  },
};

const binaryTreeTerminology: StepFigure = {
  type: 'steps',
  tones: { root: 'cmp', leaf: 'done', edge: 'swp', level: 'idle', degree: 'cmp', height: 'swp', depth: 'cmp', nodeHeight: 'done' },
  build(l) {
    const values: Val[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, null, 12, null, 14, 15];
    const lay = { left: 96, width: 336, top: 52, gap: 60 };
    const r = 15;
    const H = 292;
    const levelY = (d: number) => lay.top + d * lay.gap;
    const isLeaf = (i: number) => has(values, i) && !has(values, 2 * i + 1) && !has(values, 2 * i + 2);
    const degree = (i: number) => Number(has(values, 2 * i + 1)) + Number(has(values, 2 * i + 2));
    /** A vertical measure on the left with dashed guides to the nodes it spans. */
    const measure = (id: string, d1: number, d2: number, to1: number, to2: number, label: string) => {
      const x = 88;
      const [y1, y2] = [levelY(d1), levelY(d2)];
      return [
        arrow(`${id}:g1`, [x - 6, y1], [slotAt(to1, lay).x - r - 4, y1], { head: 'none', dashed: true, tone: 'muted', width: 1 }),
        arrow(`${id}:g2`, [x - 6, y2], [slotAt(to2, lay).x - r - 4, y2], { head: 'none', dashed: true, tone: 'muted', width: 1 }),
        arrow(id, [x, y1 + 1], [x, y2 - 1], { head: 'both', tone: 'accent', width: 1.5 }),
        text(`${id}:t`, x - 8, (y1 + y2) / 2 + 4, label, { anchor: 'end', mono: true, bold: true, size: 12, tone: 'accent' }),
      ];
    };
    const scene = (term: Term) => {
      const node = (i: number): Partial<BoxNode> => {
        switch (term) {
          case 'root':
            return i === 0 ? { tone: 'accent', ring: true } : {};
          case 'leaf':
            return isLeaf(i) ? { tone: 'accent', ring: true } : {};
          case 'height':
            return i === 0 || i === 7 ? { tone: 'accent' } : {};
          case 'depth':
            return i === 1 ? { tone: 'accent', ring: true } : i === 0 ? { tone: 'info' } : {};
          case 'nodeHeight':
            return i === 1 ? { tone: 'accent', ring: true } : i === 7 ? { tone: 'info' } : {};
          default:
            return {};
        }
      };
      const edge = (i: number): Partial<ArrowNode> => {
        if (term === 'edge') return { tone: 'accent', width: 2.25 };
        if (term === 'height') return [1, 3, 7].includes(i) ? { tone: 'accent', width: 2.25 } : {};
        if (term === 'depth') return i === 1 ? { tone: 'accent', width: 2.25 } : {};
        if (term === 'nodeHeight') return [3, 7].includes(i) ? { tone: 'accent', width: 2.25 } : {};
        return {};
      };
      const tree = levelTree('n', values, { ...lay, r, node, edge });
      const nodes: SceneNode[] = [];
      if (term === 'level') {
        for (let d = 0; d < 4; d++) {
          nodes.push(
            region(`band${d}`, 4, levelY(d) - 24, W - 8, 48, { tone: 'soft' }),
            text(`band${d}:t`, 14, levelY(d) + 4, levelWord(l, d + 1), { size: 12, bold: true, tone: 'accent' }),
          );
        }
      }
      nodes.push(...tree.nodes);
      const at = (i: number) => center(tree.boxes.get(i)!);
      if (term === 'root') nodes.push(text('lab:root', at(0).x, at(0).y - r - 10, WORD.root[l], { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      if (term === 'leaf') {
        const lx = 264;
        const ly = H - 22;
        values.forEach((_, i) => {
          if (!isLeaf(i)) return;
          const c = at(i);
          nodes.push(arrow(`lf${i}`, [lx, ly], [c.x, c.y + r + 5], { head: 'none', tone: 'muted', width: 1 }));
        });
        nodes.push(text('lab:leaf', lx, ly + 16, WORD.leaf[l], { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      }
      if (term === 'edge') {
        const a = at(0);
        const b = at(2);
        nodes.push(text('lab:edge', (a.x + b.x) / 2 + 12, (a.y + b.y) / 2 - 6, WORD.edge[l], { size: 13, bold: true, tone: 'accent' }));
      }
      if (term === 'degree') {
        values.forEach((_, i) => {
          if (!has(values, i)) return;
          const c = at(i);
          // On the side away from the incoming edge.
          const left = i > 0 && i % 2 === 1;
          nodes.push(text(`deg${i}`, left ? c.x - r - 3 : c.x + r + 3, c.y - r + 5, String(degree(i)), { anchor: left ? 'end' : 'start', mono: true, bold: true, size: 12, tone: 'warn' }));
        });
      }
      if (term === 'height') nodes.push(...measure('ms', 0, 3, 0, 7, `${WORD.height[l]} = 3`));
      if (term === 'depth') nodes.push(...measure('ms', 0, 1, 0, 1, `${WORD.depth[l]} = 1`));
      if (term === 'nodeHeight') nodes.push(...measure('ms', 1, 3, 1, 7, `${WORD.height[l]} = 2`));
      return { w: W, h: H, nodes };
    };
    const terms: Term[] = ['root', 'leaf', 'edge', 'level', 'degree', 'height', 'depth', 'nodeHeight'];
    return { frames: terms.map((t) => ({ kind: t, scene: scene(t), say: TERM_SAY[t][l] })) };
  },
};

// ── 3. Inserting and removing a node ──────────────────────────────────

const ADD_SAY: Record<'init' | 'link1' | 'link2' | 'remove', T> = {
  init: {
    en: 'Insert node P between n1 and n2. As in a linked list, only pointers need to change.',
    zh: '在 n1 和 n2 之间插入节点 P。与链表类似，只需修改指针。',
    'zh-hant': '在 n1 和 n2 之間插入節點 P。與鏈結串列類似，只需修改指標。',
    ja: 'n1 と n2 の間にノード P を挿入します。連結リストと同様に、ポインタを変更するだけです。',
    ru: 'Вставим узел P между n1 и n2. Как и в связном списке, достаточно изменить указатели.',
  },
  link1: {
    en: 'n1.left = P: node 1 now points to P. The old subtree is still reachable through n2.',
    zh: 'n1.left = P：节点 1 的左指针改为指向 P，原来的子树仍由 n2 引用。',
    'zh-hant': 'n1.left = P：節點 1 的左指標改為指向 P，原來的子樹仍由 n2 引用。',
    ja: 'n1.left = P：ノード 1 の左ポインタが P を指します。元の部分木は n2 から参照されたままです。',
    ru: 'n1.left = P: левый указатель узла 1 теперь указывает на P. Прежнее поддерево доступно через n2.',
  },
  link2: {
    en: 'P.left = n2: n2 becomes the left child of P, and P is now part of the tree.',
    zh: 'P.left = n2：n2 成为 P 的左子节点，节点 P 插入完成。',
    'zh-hant': 'P.left = n2：n2 成為 P 的左子節點，節點 P 插入完成。',
    ja: 'P.left = n2：n2 が P の左子ノードになり、P の挿入が完了します。',
    ru: 'P.left = n2: n2 становится левым дочерним узлом P, и вставка завершена.',
  },
  remove: {
    en: 'Remove P with n1.left = n2: node 1 skips over P and points to n2 again, so P leaves the tree.',
    zh: '删除节点 P：n1.left = n2，节点 1 越过 P 直接指向 n2，P 被移出二叉树。',
    'zh-hant': '刪除節點 P：n1.left = n2，節點 1 越過 P 直接指向 n2，P 被移出二元樹。',
    ja: 'P を削除：n1.left = n2 で、ノード 1 は P を飛ばして n2 を指し、P は木から外れます。',
    ru: 'Удаление P: n1.left = n2 — узел 1 указывает прямо на n2 в обход P, и P покидает дерево.',
  },
};

const binaryTreeAddRemove: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', link1: 'cmp', link2: 'cmp', remove: 'swp' },
  build(l) {
    const r = 17;
    const before: Record<string, Pt> = { v1: [210, 44], v2: [140, 112], v3: [280, 112], v4: [100, 180], v5: [180, 180], vP: [370, 196] };
    const after: Record<string, Pt> = { v1: [210, 44], vP: [140, 112], v3: [280, 112], v2: [110, 180], v4: [70, 248], v5: [150, 248] };
    const label: Record<string, string> = { v1: '1', v2: '2', v3: '3', v4: '4', v5: '5', vP: '0' };
    const scene = (pos: Record<string, Pt>, edges: [string, string][], hot: string[], p: 'loose' | 'in' | 'gone', code: Rich | null) => {
      const circles = new Map<string, BoxNode>();
      for (const [id, [x, y]] of Object.entries(pos)) {
        const isP = id === 'vP';
        circles.set(id, listNode({ id, value: label[id], tone: isP ? 'info' : 'ok', dim: isP && p === 'gone' }, x, y, r));
        if (isP && p === 'gone') circles.set(id, { ...circles.get(id)!, dashed: true });
      }
      const nodes: SceneNode[] = edges.map(([a, b]) =>
        link(`e:${b}`, circles.get(a)!, circles.get(b)!, { pad: 2, width: hot.includes(b) ? 2.25 : 1.5, tone: hot.includes(b) ? 'accent' : undefined }),
      );
      nodes.push(...circles.values());
      nodes.push(...tag('t:n1', circles.get('v1')!, 'n1', { side: 'right', tone: 'ok' }));
      nodes.push(...tag('t:n2', circles.get('v2')!, 'n2', { side: 'left', tone: 'ok' }));
      const pTag = tag('t:P', circles.get('vP')!, 'P', { side: 'left', tone: 'info' });
      nodes.push(...pTag.map((n) => (p === 'gone' ? { ...n, dim: true } : n)));
      if (code) nodes.push(chip('code', W - 8, 8, code, { align: 'end' }));
      return { w: W, h: 284, nodes };
    };
    const tree: [string, string][] = [
      ['v1', 'v2'],
      ['v1', 'v3'],
      ['v2', 'v4'],
      ['v2', 'v5'],
    ];
    const n1 = (s: string): [string, Tone, boolean] => [s, 'ok', true];
    const P: [string, Tone, boolean] = ['P', 'info', true];
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(before, tree, [], 'loose', null), say: ADD_SAY.init[l] },
      {
        kind: 'link1',
        scene: scene(after, [['v1', 'vP'], ['v1', 'v3'], ['v2', 'v4'], ['v2', 'v5']], ['vP'], 'in', seg(n1('n1'), '.left = ', P)),
        say: ADD_SAY.link1[l],
        call: 'n1.left = P',
      },
      {
        kind: 'link2',
        scene: scene(after, [['v1', 'vP'], ['v1', 'v3'], ['vP', 'v2'], ['v2', 'v4'], ['v2', 'v5']], ['v2'], 'in', seg(P, '.left = ', n1('n2'))),
        say: ADD_SAY.link2[l],
        call: 'P.left = n2',
      },
      {
        kind: 'remove',
        scene: scene({ ...before, vP: [370, 112] }, tree, ['v2'], 'gone', seg(n1('n1'), '.left = ', n1('n2'))),
        say: ADD_SAY.remove[l],
        call: 'n1.left = n2',
      },
    ];
    return { frames };
  },
};

// ── 4–7. Kinds of binary trees ────────────────────────────────────────

const KIND_NOTE: Record<'perfect' | 'complete' | 'full' | 'balanced', T> = {
  perfect: {
    en: 'Every level is completely filled: leaf nodes have degree 0 and all other nodes degree 2. A tree of height h has 2ʰ⁺¹ − 1 nodes.',
    zh: '所有层的节点都被完全填满：叶节点的度为 0，其余所有节点的度都为 2。若树的高度为 h，则节点总数为 2ʰ⁺¹ − 1。',
    'zh-hant': '所有層的節點都被完全填滿：葉節點的度為 0，其餘所有節點的度都為 2。若樹的高度為 h，則節點總數為 2ʰ⁺¹ − 1。',
    ja: 'すべてのレベルが完全に埋まっています。葉ノードの次数は 0、それ以外のノードは 2 です。高さ h の木のノード総数は 2ʰ⁺¹ − 1 です。',
    ru: 'Все уровни заполнены полностью: у листовых узлов степень 0, у остальных — 2. Дерево высоты h содержит 2ʰ⁺¹ − 1 узлов.',
  },
  complete: {
    en: 'Only the bottom level may be incomplete, and its nodes are filled from left to right without gaps.',
    zh: '仅允许最底层的节点不完全填满，且最底层的节点必须从左至右依次连续填充。',
    'zh-hant': '僅允許最底層的節點不完全填滿，且最底層的節點必須從左至右依次連續填充。',
    ja: '最下層だけが埋まっていなくてもよく、最下層のノードは左から右へ隙間なく詰められます。',
    ru: 'Не до конца заполненным может быть только нижний уровень, и его узлы идут слева направо без пропусков.',
  },
  full: {
    en: 'All nodes except leaf nodes have two child nodes, so every node has degree 0 or 2.',
    zh: '除了叶节点之外，其余所有节点都有两个子节点，即每个节点的度为 0 或 2。',
    'zh-hant': '除了葉節點之外，其餘所有節點都有兩個子節點，即每個節點的度為 0 或 2。',
    ja: '葉ノードを除くすべてのノードが 2 つの子ノードを持ちます。つまり各ノードの次数は 0 か 2 です。',
    ru: 'Все узлы, кроме листовых, имеют ровно два дочерних узла: степень каждого узла 0 или 2.',
  },
  balanced: {
    en: 'The number in each node is d, the height of its left subtree minus the height of its right subtree. In a balanced binary tree, |d| ≤ 1 at every node.',
    zh: '节点中的数字 d 为左子树高度减去右子树高度。平衡二叉树中任意节点都满足 |d| ≤ 1。',
    'zh-hant': '節點中的數字 d 為左子樹高度減去右子樹高度。平衡二元樹中任意節點都滿足 |d| ≤ 1。',
    ja: 'ノード内の数 d は、左部分木の高さから右部分木の高さを引いた値です。平衡二分木ではすべてのノードで |d| ≤ 1 です。',
    ru: 'Число d в узле — высота левого поддерева минус высота правого. В сбалансированном двоичном дереве |d| ≤ 1 для каждого узла.',
  },
};

const perfectBinaryTree: StaticFigure = {
  type: 'static',
  build(l) {
    const values = Array<Val>(15).fill('');
    const lay = { left: 0, width: 352, top: 34, gap: 56 };
    const nodes: SceneNode[] = [...levelTree('n', values, { ...lay, r: 13 }).nodes];
    for (let d = 0; d < 4; d++) {
      nodes.push(text(`cnt${d}`, 372, lay.top + d * lay.gap + 5, seg(`2${sup(d)} = `, [String(2 ** d), 'ok', true]), { mono: true, size: 13, tone: 'muted' }));
    }
    nodes.push(chip('total', lay.left + lay.width / 2, 228, seg('h = 3   n = 2⁴ − 1 = ', ['15', 'accent', true]), { size: 13 }));
    return { scene: { w: W, h: 262, nodes }, notes: [KIND_NOTE.perfect[l]] };
  },
};

const completeBinaryTree: StaticFigure = {
  type: 'static',
  build(l) {
    const values: Val[] = [...Array<Val>(12).fill(''), null, null, null];
    const lay = { left: 0, width: W, top: 30, gap: 56 };
    const r = 14;
    const tree = levelTree('n', values, { ...lay, r, gaps: true });
    const a = center(tree.boxes.get(7)!);
    const b = center(tree.boxes.get(11)!);
    const y = a.y + r + 18;
    const nodes: SceneNode[] = [
      ...tree.nodes,
      arrow('fill', [a.x - r, y], [b.x + r, y], { tone: 'accent', width: 2 }),
      text('fill:t', (a.x + b.x) / 2, y + 22, WORD.l2r[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
    ];
    return { scene: { w: W, h: 262, nodes }, legend: [{ tone: 'ghost', dashed: true, shape: 'circle', text: 'None' }], notes: [KIND_NOTE.complete[l]] };
  },
};

const fullBinaryTree: StaticFigure = {
  type: 'static',
  build(l) {
    const values: Val[] = [2, 2, 0, 0, 2, null, null, null, null, 0, 0];
    const tree = levelTree('n', values, { left: 40, width: 360, top: 30, gap: 60, r: 16, node: (i) => ({ tone: values[i] === 2 ? 'ok' : 'info' }) });
    return {
      scene: { w: W, h: 240, nodes: tree.nodes },
      legend: [
        { tone: 'ok', shape: 'circle', text: WORD.deg2[l] },
        { tone: 'info', shape: 'circle', text: WORD.deg0[l] },
      ],
      notes: [KIND_NOTE.full[l]],
    };
  },
};

/** Height of the subtree at index i of a level-order array (−1 when empty). */
const heightAt = (values: Val[], i: number): number => (has(values, i) ? 1 + Math.max(heightAt(values, 2 * i + 1), heightAt(values, 2 * i + 2)) : -1);

const balancedBinaryTree: StaticFigure = {
  type: 'static',
  build(l) {
    const shape: Val[] = [1, 1, 1, 1, null, 1, 1, null, null, null, null, 1, 1];
    const d = (i: number) => heightAt(shape, 2 * i + 1) - heightAt(shape, 2 * i + 2);
    const values = shape.map((v, i) => (v === null ? null : d(i) < 0 ? `−${-d(i)}` : String(d(i))));
    const tree = levelTree('n', values, { left: 0, width: W, top: 30, gap: 60, r: 16, node: (i) => ({ tone: d(i) === 0 ? 'ok' : 'info' }) });
    return { scene: { w: W, h: 240, nodes: tree.nodes }, notes: [KIND_NOTE.balanced[l]] };
  },
};

// ── 8. Best and worst structures ──────────────────────────────────────

const BEST_WORST_NOTE: T = {
  en: 'At best every level is full and the height is about log n. At worst every node has a single child: the tree degenerates into a linked list of height n − 1, and operations slow down to O(n).',
  zh: '最佳情况下各层都被填满，高度约为 log n；最差情况下每个节点只有一个子节点，二叉树退化为高度为 n − 1 的链表，各项操作的时间复杂度退化至 O(n)。',
  'zh-hant': '最佳情況下各層都被填滿，高度約為 log n；最差情況下每個節點只有一個子節點，二元樹退化為高度為 n − 1 的鏈結串列，各項操作的時間複雜度退化至 O(n)。',
  ja: '最良の場合は各レベルが埋まり、高さは約 log n です。最悪の場合は各ノードの子が 1 つだけで、木は高さ n − 1 の連結リストに退化し、操作は O(n) になります。',
  ru: 'В лучшем случае все уровни заполнены и высота около log n. В худшем у каждого узла один дочерний узел: дерево вырождается в связный список высоты n − 1, и операции замедляются до O(n).',
};

const binaryTreeBestWorstCases: StaticFigure = {
  type: 'static',
  build(l) {
    const tree = levelTree('a', ONE_TO(7), { left: 14, width: 220, top: 74, gap: 78, r: 17 });
    const chain = ONE_TO(7).map((v, k) => listNode({ id: `b${v}`, value: v }, 418 - k * 25, 24 + k * 38, 14));
    const captions = (id: string, cx: number, title: string, term: string, h: string) => [
      text(`${id}:1`, cx, 290, title, { anchor: 'middle', size: 13, bold: true }),
      text(`${id}:2`, cx, 310, term, { anchor: 'middle', size: 13, tone: 'muted' }),
      text(`${id}:3`, cx, 334, h, { anchor: 'middle', mono: true, size: 12, bold: true, tone: 'accent' }),
    ];
    const nodes: SceneNode[] = [
      region('pa', 4, 6, 236, 340, { tone: 'ok' }),
      region('pb', 248, 6, 188, 340, { tone: 'danger' }),
      ...tree.nodes,
      ...chain.slice(1).map((c, k) => link(`be${k}`, chain[k], c, { pad: 2, width: 1.5 })),
      ...chain,
      ...captions('ca', 122, WORD.ideal[l], WORD.perfect[l], `${WORD.height[l]} = ⌊log₂ n⌋ = 2`),
      ...captions('cb', 342, WORD.degenerate[l], WORD.list[l], `${WORD.height[l]} = n − 1 = 6`),
    ];
    return { scene: { w: W, h: 352, nodes }, notes: [BEST_WORST_NOTE[l]] };
  },
};

// ── 9. Level-order traversal ──────────────────────────────────────────

const BFS_SAY: Record<'init' | 'visit' | 'leaf' | 'push' | 'done', T> = {
  init: {
    en: 'Initialize the queue with the root node.',
    zh: '初始化队列，加入根节点。',
    'zh-hant': '初始化佇列，加入根節點。',
    ja: 'キューを初期化し、根ノードを追加します。',
    ru: 'Создаём очередь и кладём в неё корневой узел.',
  },
  visit: {
    en: 'Dequeue node {v} and save its value: res = [{res}].',
    zh: '节点 {v} 出队，保存节点值：res = [{res}]。',
    'zh-hant': '節點 {v} 出列，儲存節點值：res = [{res}]。',
    ja: 'ノード {v} をデキューし、値を保存します：res = [{res}]。',
    ru: 'Извлекаем узел {v} из очереди и сохраняем значение: res = [{res}].',
  },
  leaf: {
    en: 'Dequeue node {v} and save its value: res = [{res}]. It has no children to enqueue.',
    zh: '节点 {v} 出队，保存节点值：res = [{res}]。它没有子节点需要入队。',
    'zh-hant': '節點 {v} 出列，儲存節點值：res = [{res}]。它沒有子節點需要入列。',
    ja: 'ノード {v} をデキューし、値を保存します：res = [{res}]。キューに追加する子ノードはありません。',
    ru: 'Извлекаем узел {v} и сохраняем значение: res = [{res}]. Дочерних узлов у него нет.',
  },
  push: {
    en: 'Enqueue the children of node {v}: {kids}.',
    zh: '节点 {v} 的子节点 {kids} 入队。',
    'zh-hant': '節點 {v} 的子節點 {kids} 入列。',
    ja: 'ノード {v} の子ノード {kids} をキューに追加します。',
    ru: 'Помещаем в очередь дочерние узлы узла {v}: {kids}.',
  },
  done: {
    en: 'The queue is empty, so the traversal ends. Level-order traversal: 1, 2, 3, 4, 5, 6, 7.',
    zh: '队列为空，遍历结束。层序遍历序列为 1, 2, 3, 4, 5, 6, 7。',
    'zh-hant': '佇列為空，走訪結束。層序走訪序列為 1, 2, 3, 4, 5, 6, 7。',
    ja: 'キューが空になり、走査が終わります。レベル順走査の結果は 1, 2, 3, 4, 5, 6, 7 です。',
    ru: 'Очередь пуста, обход завершён. Обход по уровням: 1, 2, 3, 4, 5, 6, 7.',
  },
};

const binaryTreeBfs: StepFigure = {
  type: 'steps',
  call: 'level_order(root)',
  tones: { init: 'idle', visit: 'cmp', push: 'swp', done: 'done' },
  sources: funcSources(BFS_PY, BFS_JAVA, ['level_order'], {
    python: {
      init: ['queue.append(root)'],
      visit: ['queue.popleft()', 'res.append(node.val)'],
      push: ['queue.append(node.left)', 'queue.append(node.right)'],
      done: ['return res'],
    },
    java: {
      init: ['queue.add(root);'],
      visit: ['queue.poll();', 'list.add(node.val);'],
      push: ['queue.offer(node.left);', 'queue.offer(node.right);'],
      done: ['return list;'],
    },
  }),
  build(l) {
    const values = ONE_TO(7);
    const lay = { left: 40, width: 360, top: 34, gap: 62 };
    const r = 18;
    const cw = 34;
    const x0 = 96;
    const qy = 202;
    const ry = 248;
    const scene = (queue: number[], res: number[], cur: number | null) => {
      const tree = levelTree('n', values, {
        ...lay,
        r,
        node: (i) => {
          const v = i + 1;
          if (v === cur) return { tone: 'accent', ring: true };
          if (queue.includes(v)) return { tone: 'info' };
          if (res.includes(v)) return { tone: 'ok' };
          return { tone: 'idle' };
        },
      });
      const nodes: SceneNode[] = [
        region('qbox', x0 - 6, qy - 5, 4 * (cw + 6) + 6, cw + 4, { tone: 'info' }),
        region('rbox', x0 - 6, ry - 5, 7 * (cw + 6) + 6, cw + 4, { tone: 'ok' }),
        text('ql', x0 - 14, qy + 19, WORD.queue[l], { anchor: 'end', size: 12, bold: true, tone: 'info' }),
        text('rl', x0 - 14, ry + 19, 'res', { anchor: 'end', mono: true, size: 12, bold: true, tone: 'ok' }),
        ...tree.nodes,
      ];
      // The visiting order, as a dotted line under the nodes.
      const dot = (v: number): Pt => {
        const c = center(tree.boxes.get(v - 1)!);
        return [c.x, c.y + r + 1];
      };
      res.forEach((v, k) => {
        const [x, y] = dot(v);
        nodes.push(box(`d${v}`, x - 4, y - 4, '', { w: 8, h: 8, shape: 'circle', tone: 'accent' }));
        if (k === 0) return;
        const [px, py] = dot(res[k - 1]);
        const len = Math.hypot(x - px, y - py);
        const ux = (x - px) / len;
        const uy = (y - py) / len;
        nodes.push(arrow(`p${v}`, [px + ux * 6, py + uy * 6], [x - ux * 6, y - uy * 6], { dashed: true, tone: 'accent', width: 1.5 }));
      });
      queue.forEach((v, k) =>
        nodes.push(box(`c${v}`, x0 + k * (cw + 6), qy - 1, v, { w: cw, h: 30, size: 14, tone: 'info' })),
      );
      res.forEach((v, k) => nodes.push(box(`c${v}`, x0 + k * (cw + 6), ry - 1, v, { w: cw, h: 30, size: 14, tone: v === cur ? 'accent' : 'ok' })));
      return { w: W, h: 290, nodes };
    };
    const frames: SceneFrame[] = [];
    let queue = [1];
    const res: number[] = [];
    frames.push({ kind: 'init', scene: scene(queue, res, null), say: BFS_SAY.init[l] });
    while (queue.length) {
      const v = queue[0];
      queue = queue.slice(1);
      res.push(v);
      const kids = [2 * v, 2 * v + 1].filter((c) => c <= values.length);
      frames.push({
        kind: 'visit',
        scene: scene(queue, [...res], v),
        say: fmt(kids.length ? BFS_SAY.visit[l] : BFS_SAY.leaf[l], { v, res: res.join(', ') }),
      });
      if (kids.length) {
        queue = [...queue, ...kids];
        frames.push({ kind: 'push', scene: scene(queue, [...res], v), say: fmt(BFS_SAY.push[l], { v, kids: kids.join(AND[l]) }) });
      }
    }
    frames.push({ kind: 'done', scene: scene([], res, null), say: BFS_SAY.done[l] });
    return { frames };
  },
};

// ── 10. Preorder, inorder, postorder ──────────────────────────────────

type Order = 'pre' | 'in' | 'post';

const ORDER_TONE: Record<Order, Tone> = { pre: 'warn', in: 'info', post: 'accent' };

const ORDER_SEQ: Record<Order, number[]> = {
  pre: [1, 2, 4, 5, 3, 6, 7],
  in: [4, 2, 5, 1, 6, 3, 7],
  post: [4, 5, 2, 6, 7, 3, 1],
};

const DFS_SAY: Record<'walk' | Order, T> = {
  walk: {
    en: 'Depth-first traversal is like walking around the outside of the whole tree. The walk passes each node three times: on its left, below it and on its right.',
    zh: '深度优先遍历就像绕着整棵二叉树的外围走一圈，在每个节点都会经过三个位置：左侧、下方和右侧。',
    'zh-hant': '深度優先走訪就像繞著整棵二元樹的外圍走一圈，在每個節點都會經過三個位置：左側、下方和右側。',
    ja: '深度優先走査は木全体の外周を一周するようなものです。各ノードを左側、下側、右側の 3 回通ります。',
    ru: 'Обход в глубину похож на прогулку вокруг всего дерева: каждый узел встречается трижды — слева, снизу и справа.',
  },
  pre: {
    en: 'Preorder: visit a node when passing on its left, before both of its subtrees: 1, 2, 4, 5, 3, 6, 7.',
    zh: '前序遍历：经过节点左侧时访问它，先于左右子树：1, 2, 4, 5, 3, 6, 7。',
    'zh-hant': '前序走訪：經過節點左側時訪問它，先於左右子樹：1, 2, 4, 5, 3, 6, 7。',
    ja: '先行順走査：ノードの左側を通るときに訪問し、左右の部分木より先になります：1, 2, 4, 5, 3, 6, 7。',
    ru: 'Прямой обход: узел посещается, когда путь проходит слева от него, раньше обоих поддеревьев: 1, 2, 4, 5, 3, 6, 7.',
  },
  in: {
    en: 'Inorder: visit a node when passing below it, between its left and right subtrees: 4, 2, 5, 1, 6, 3, 7.',
    zh: '中序遍历：经过节点下方时访问它，位于左子树和右子树之间：4, 2, 5, 1, 6, 3, 7。',
    'zh-hant': '中序走訪：經過節點下方時訪問它，位於左子樹和右子樹之間：4, 2, 5, 1, 6, 3, 7。',
    ja: '中間順走査：ノードの下側を通るときに訪問し、左部分木と右部分木の間になります：4, 2, 5, 1, 6, 3, 7。',
    ru: 'Симметричный обход: узел посещается снизу, между левым и правым поддеревьями: 4, 2, 5, 1, 6, 3, 7.',
  },
  post: {
    en: 'Postorder: visit a node when passing on its right, after both of its subtrees: 4, 5, 2, 6, 7, 3, 1.',
    zh: '后序遍历：经过节点右侧时访问它，晚于左右子树：4, 5, 2, 6, 7, 3, 1。',
    'zh-hant': '後序走訪：經過節點右側時訪問它，晚於左右子樹：4, 5, 2, 6, 7, 3, 1。',
    ja: '後行順走査：ノードの右側を通るときに訪問し、左右の部分木の後になります：4, 5, 2, 6, 7, 3, 1。',
    ru: 'Обратный обход: узел посещается справа, после обоих поддеревьев: 4, 5, 2, 6, 7, 3, 1.',
  },
};

/** The three spots a depth-first walk passes on a node's outline: left (pre), bottom (in), right (post). */
function orderDots(b: BoxNode, i: number, style: (o: Order) => Partial<BoxNode>) {
  const c = center(b);
  const r = b.w / 2;
  const spots: Record<Order, Pt> = { pre: [c.x - r, c.y], in: [c.x, c.y + r], post: [c.x + r, c.y] };
  return (Object.keys(spots) as Order[]).map((o) =>
    box(`${o}${i}`, spots[o][0] - 5, spots[o][1] - 5, '', { w: 10, h: 10, shape: 'circle', tone: ORDER_TONE[o], ...style(o) }),
  );
}

const binaryTreeDfs: StepFigure = {
  type: 'steps',
  tones: { walk: 'idle', pre: 'cmp', in: 'swp', post: 'done' },
  build(l) {
    const values = ONE_TO(7);
    const lay = { left: 20, width: 400, top: 72, gap: 70 };
    const r = 17;
    const { pts, at } = contour(values, lay, r + 10);
    const scene = (focus: 'walk' | Order) => {
      const tree = levelTree('n', values, { ...lay, r });
      const end = pts[at.E];
      const nodes: SceneNode[] = [
        walkPath('walk', pts, pts.length - 1),
        arrow('walk:h', [end[0], end[1] + 8], [end[0], end[1] - 4], { tone: 'ok', width: 2 }),
        ...tree.nodes,
      ];
      for (const [i, b] of tree.boxes) nodes.push(...orderDots(b, i, (o) => ({ dim: focus !== 'walk' && focus !== o, ring: focus === o })));
      (['pre', 'in', 'post'] as Order[]).forEach((o, k) => {
        const y = 272 + k * 24;
        const dim = focus !== 'walk' && focus !== o;
        nodes.push(
          text(`seq:${o}:l`, 196, y, WORD[o][l], { anchor: 'end', size: 13, bold: true, tone: ORDER_TONE[o], dim }),
          text(`seq:${o}`, 208, y, ORDER_SEQ[o].join(', '), { mono: true, size: 14, dim }),
        );
      });
      return { w: W, h: 330, nodes };
    };
    const kinds = ['walk', 'pre', 'in', 'post'] as const;
    return {
      frames: kinds.map((k) => ({ kind: k, scene: scene(k), say: DFS_SAY[k][l] })),
      legend: (['pre', 'in', 'post'] as Order[]).map((o) => ({ tone: ORDER_TONE[o], shape: 'circle' as const, text: WORD[o][l] })),
    };
  },
};

// ── 11. The recursion of preorder traversal ───────────────────────────

const PRE_SAY: Record<'first' | 'left' | 'right' | 'ret' | 'retUp' | 'done', T> = {
  first: {
    en: 'Call pre_order(1): visit the root node 1 first, then head into its left subtree.',
    zh: '调用 pre_order(1)：先访问根节点 1，再进入左子树。',
    'zh-hant': '呼叫 pre_order(1)：先訪問根節點 1，再進入左子樹。',
    ja: 'pre_order(1) を呼び出し、まず根ノード 1 を訪問してから左部分木へ進みます。',
    ru: 'Вызов pre_order(1): сначала посещаем корневой узел 1, затем идём в левое поддерево.',
  },
  left: {
    en: 'Recurse into the left child: pre_order({v}) visits node {v}.',
    zh: '递归进入左子节点：pre_order({v}) 访问节点 {v}。',
    'zh-hant': '遞迴進入左子節點：pre_order({v}) 訪問節點 {v}。',
    ja: '左子ノードへ再帰します：pre_order({v}) がノード {v} を訪問します。',
    ru: 'Рекурсия в левый дочерний узел: pre_order({v}) посещает узел {v}.',
  },
  right: {
    en: 'The left subtree is done, so recurse into the right child: pre_order({v}) visits node {v}.',
    zh: '左子树已遍历完，递归进入右子节点：pre_order({v}) 访问节点 {v}。',
    'zh-hant': '左子樹已走訪完，遞迴進入右子節點：pre_order({v}) 訪問節點 {v}。',
    ja: '左部分木が終わったので右子ノードへ再帰します：pre_order({v}) がノード {v} を訪問します。',
    ru: 'Левое поддерево пройдено, рекурсия в правый дочерний узел: pre_order({v}) посещает узел {v}.',
  },
  ret: {
    en: 'Node {c} has no children: both of its calls get None and return at once, so pre_order({c}) returns to node {p}.',
    zh: '节点 {c} 没有子节点：两次递归调用都遇到 None 并立即返回，pre_order({c}) 返回到节点 {p}。',
    'zh-hant': '節點 {c} 沒有子節點：兩次遞迴呼叫都遇到 None 並立即返回，pre_order({c}) 返回到節點 {p}。',
    ja: 'ノード {c} には子ノードがなく、2 回の呼び出しはどちらも None ですぐに戻ります。pre_order({c}) はノード {p} に戻ります。',
    ru: 'У узла {c} нет дочерних узлов: оба вызова получают None и сразу возвращаются, и pre_order({c}) возвращается к узлу {p}.',
  },
  retUp: {
    en: 'Leaf node {c} returns to {m}. Both subtrees of node {m} are done, so pre_order({m}) returns to node {p}.',
    zh: '叶节点 {c} 返回到 {m}。节点 {m} 的左右子树都已遍历完，pre_order({m}) 返回到节点 {p}。',
    'zh-hant': '葉節點 {c} 返回到 {m}。節點 {m} 的左右子樹都已走訪完，pre_order({m}) 返回到節點 {p}。',
    ja: '葉ノード {c} が {m} に戻ります。ノード {m} の左右の部分木が終わったので、pre_order({m}) はノード {p} に戻ります。',
    ru: 'Листовой узел {c} возвращается к {m}. Оба поддерева узла {m} пройдены, и pre_order({m}) возвращается к узлу {p}.',
  },
  done: {
    en: 'Leaf node 7 returns, then pre_order(3) and pre_order(1). Preorder traversal: 1, 2, 4, 5, 3, 6, 7.',
    zh: '叶节点 7 返回，随后 pre_order(3) 和 pre_order(1) 依次返回。前序遍历序列为 1, 2, 4, 5, 3, 6, 7。',
    'zh-hant': '葉節點 7 返回，隨後 pre_order(3) 和 pre_order(1) 依次返回。前序走訪序列為 1, 2, 4, 5, 3, 6, 7。',
    ja: '葉ノード 7 が戻り、続いて pre_order(3) と pre_order(1) も戻ります。先行順走査の結果は 1, 2, 4, 5, 3, 6, 7 です。',
    ru: 'Листовой узел 7 возвращается, за ним pre_order(3) и pre_order(1). Прямой обход: 1, 2, 4, 5, 3, 6, 7.',
  },
};

const preorderSteps: StepFigure = {
  type: 'steps',
  call: 'pre_order(root)',
  tones: { visit: 'cmp', left: 'cmp', right: 'swp', ret: 'idle', done: 'done' },
  sources: funcSources(DFS_PY, DFS_JAVA, ['pre_order'], {
    python: {
      visit: ['res.append(root.val)'],
      left: ['pre_order(root=root.left)', 'res.append(root.val)'],
      right: ['pre_order(root=root.right)', 'res.append(root.val)'],
      ret: ['if root is None:'],
      done: ['def pre_order('],
    },
    java: {
      visit: ['list.add(root.val);'],
      left: ['preOrder(root.left);', 'list.add(root.val);'],
      right: ['preOrder(root.right);', 'list.add(root.val);'],
      ret: ['if (root == null)'],
      done: ['void preOrder('],
    },
  }),
  build(l) {
    const values = ONE_TO(7);
    const lay = { left: 0, width: 300, top: 80, gap: 70 };
    const r = 16;
    const { pts, at } = contour(values, lay, r + 10);
    const sx = 314;
    const scene = (upto: string, stack: number[], res: number[], cur: number | null) => {
      const tree = levelTree('n', values, {
        ...lay,
        r,
        node: (i) => (i + 1 === cur ? { tone: 'accent', ring: true } : res.includes(i + 1) ? { tone: 'ok' } : { tone: 'idle' }),
      });
      const end = pts[at[upto]];
      const nodes: SceneNode[] = [walkPath('walk', pts, at[upto]), ...tree.nodes];
      if (upto === 'E') nodes.push(arrow('walk:h', [end[0], end[1] + 8], [end[0], end[1] - 4], { tone: 'ok', width: 2 }));
      else nodes.push(box('cursor', end[0] - 5, end[1] - 5, '', { w: 10, h: 10, shape: 'circle', tone: 'accent' }));
      for (const [i, b] of tree.boxes) {
        const c = center(b);
        nodes.push(box(`pre${i}`, c.x - r - 5, c.y - 5, '', { w: 10, h: 10, shape: 'circle', tone: res.includes(i + 1) ? 'warn' : 'ghost' }));
      }
      nodes.push(text('st:l', sx, 30, WORD.stack[l], { size: 12, bold: true, tone: 'muted' }));
      stack.forEach((v, k) => {
        const top = k === stack.length - 1;
        nodes.push(chip(`call${v}`, sx, 42 + k * 36, seg('pre_order(', [String(v), top ? 'accent' : 'ok', true], ')'), { align: 'start', size: 12, ring: top, tone: top ? 'accent' : 'idle' }));
      });
      nodes.push(
        region('rbox', 40, 266, 7 * 34 + 6, 36, { tone: 'warn' }),
        text('rl', 32, 289, 'res', { anchor: 'end', mono: true, size: 12, bold: true, tone: 'warn' }),
        ...cells(
          'r',
          46,
          270,
          res.map((v) => ({ id: `r${v}`, value: v, tone: v === cur ? ('accent' as Tone) : ('ok' as Tone) })),
          { w: 30, h: 28, gap: 4, size: 14 },
        ),
      );
      return { w: W, h: 312, nodes };
    };
    const steps: { kind: string; upto: string; stack: number[]; cur: number; say: string }[] = [
      { kind: 'visit', upto: 'L0', stack: [1], cur: 1, say: PRE_SAY.first[l] },
      { kind: 'left', upto: 'L1', stack: [1, 2], cur: 2, say: fmt(PRE_SAY.left[l], { v: 2 }) },
      { kind: 'left', upto: 'L3', stack: [1, 2, 4], cur: 4, say: fmt(PRE_SAY.left[l], { v: 4 }) },
      { kind: 'ret', upto: 'B1', stack: [1, 2], cur: 2, say: fmt(PRE_SAY.ret[l], { c: 4, p: 2 }) },
      { kind: 'right', upto: 'L4', stack: [1, 2, 5], cur: 5, say: fmt(PRE_SAY.right[l], { v: 5 }) },
      { kind: 'ret', upto: 'B0', stack: [1], cur: 1, say: fmt(PRE_SAY.retUp[l], { c: 5, m: 2, p: 1 }) },
      { kind: 'right', upto: 'L2', stack: [1, 3], cur: 3, say: fmt(PRE_SAY.right[l], { v: 3 }) },
      { kind: 'left', upto: 'L5', stack: [1, 3, 6], cur: 6, say: fmt(PRE_SAY.left[l], { v: 6 }) },
      { kind: 'ret', upto: 'B2', stack: [1, 3], cur: 3, say: fmt(PRE_SAY.ret[l], { c: 6, p: 3 }) },
      { kind: 'right', upto: 'L6', stack: [1, 3, 7], cur: 7, say: fmt(PRE_SAY.right[l], { v: 7 }) },
      { kind: 'done', upto: 'E', stack: [], cur: 0, say: PRE_SAY.done[l] },
    ];
    const order = ORDER_SEQ.pre;
    const frames: SceneFrame[] = steps.map((s) => {
      // Values visited by the time the walk reaches this point.
      const reached = at[s.upto];
      const res = order.filter((v) => at[`L${v - 1}`] <= reached);
      return { kind: s.kind, scene: scene(s.upto, s.stack, res, s.cur || null), say: s.say, call: s.stack.length ? `pre_order(${s.stack[s.stack.length - 1]})` : undefined };
    });
    return { frames };
  },
};

// ── 12. Array representation of a perfect binary tree ────────────────

const ARRAY_SAY: Record<'init' | 'map', T> = {
  init: {
    en: 'Number the nodes level by level, starting from 0, and store them in that order: the tree becomes an array.',
    zh: '按层序从 0 开始为节点编号，并按此顺序存储，二叉树就变成了数组。',
    'zh-hant': '按層序從 0 開始為節點編號，並按此順序儲存，二元樹就變成了陣列。',
    ja: 'ノードにレベル順で 0 から番号を付け、その順に格納すると、二分木は配列になります。',
    ru: 'Пронумеруем узлы по уровням начиная с 0 и сохраним в этом порядке — дерево превращается в массив.',
  },
  map: {
    en: 'Node {v} has index i = {i}: its left child is at 2i + 1 = {a}, its right child at 2i + 2 = {b}.',
    zh: '节点 {v} 的索引 i = {i}：左子节点索引为 2i + 1 = {a}，右子节点索引为 2i + 2 = {b}。',
    'zh-hant': '節點 {v} 的索引 i = {i}：左子節點索引為 2i + 1 = {a}，右子節點索引為 2i + 2 = {b}。',
    ja: 'ノード {v} のインデックスは i = {i}：左子ノードは 2i + 1 = {a}、右子ノードは 2i + 2 = {b} です。',
    ru: 'Узел {v} имеет индекс i = {i}: левый дочерний узел — 2i + 1 = {a}, правый — 2i + 2 = {b}.',
  },
};

/** Layout shared by the array-representation figures: a 4-level tree with an array of 15 cells below. */
const ARR_LAY = { left: 0, width: W, top: 22, gap: 54 };
const ARR_CW = 26;
const ARR_X0 = (W - (15 * (ARR_CW + 2) - 2)) / 2;
const cellCenter = (i: number) => ARR_X0 + i * (ARR_CW + 2) + ARR_CW / 2;

const arrayRepresentationBinaryTree: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', map: 'cmp' },
  build(l) {
    const values = ONE_TO(15);
    const cy = 288;
    const scene = (i: number | null) => {
      const kids = i === null ? [] : [2 * i + 1, 2 * i + 2];
      const role = (k: number): Tone | undefined => (k === i ? 'accent' : kids.includes(k) ? 'info' : undefined);
      const tree = levelTree('n', values, {
        ...ARR_LAY,
        r: 12,
        node: (k) => (role(k) ? { tone: role(k), ring: true } : {}),
        edge: (k) => (kids.includes(k) ? { tone: 'accent', width: 2.25 } : {}),
      });
      const nodes: SceneNode[] = [
        ...tree.nodes,
        ...indexLabels('n', tree.boxes, role),
        ...cells(
          'c',
          ARR_X0,
          cy,
          values.map((v, k) => ({ value: v, tone: role(k) ?? 'ok', ring: role(k) !== undefined })),
          { w: ARR_CW, h: 26, gap: 2, size: 12 },
        ),
        ...indices('ci', ARR_X0, cy + 40, values.map((_, k) => k), { w: ARR_CW, gap: 2, tone: role }),
      ];
      if (i === null) {
        nodes.push(
          chip('f', W / 2, 224, seg(`${WORD.left[l]}: `, ['2i + 1', 'info', true], `    ${WORD.right[l]}: `, ['2i + 2', 'info', true]), { size: 13 }),
        );
      } else {
        const [a, b] = kids;
        const x = cellCenter(i);
        nodes.push(
          chip('f', W / 2, 224, seg('i = ', [String(i), 'accent', true], '   2i + 1 = ', [String(a), 'info', true], '   2i + 2 = ', [String(b), 'info', true]), { size: 13 }),
          arrow('arcA', [x - 3, cy - 3], [cellCenter(a), cy - 3], { bend: -(10 + (cellCenter(a) - x) * 0.07), tone: 'accent', width: 1.5 }),
          arrow('arcB', [x + 3, cy - 3], [cellCenter(b), cy - 3], { bend: -(14 + (cellCenter(b) - x) * 0.07), tone: 'accent', width: 1.5 }),
        );
      }
      return { w: W, h: 340, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null), say: ARRAY_SAY.init[l] }];
    for (let i = 0; i < 7; i++) {
      frames.push({ kind: 'map', scene: scene(i), say: fmt(ARRAY_SAY.map[l], { v: values[i], i, a: 2 * i + 1, b: 2 * i + 2 }) });
    }
    return { frames };
  },
};

// ── 13–15. Arbitrary and complete binary trees as arrays ──────────────

const ARRAY_NOTE: Record<'without' | 'with' | 'complete', T> = {
  without: {
    en: 'Without None, the level-order sequence 1, 2, 3, 4, 5 fits all three trees, so it cannot uniquely represent a binary tree.',
    zh: '如果不写出 None，层序遍历序列 1, 2, 3, 4, 5 同时符合这三棵树，无法唯一表示一棵二叉树。',
    'zh-hant': '如果不寫出 None，層序走訪序列 1, 2, 3, 4, 5 同時符合這三棵樹，無法唯一表示一棵二元樹。',
    ja: 'None を書かないと、レベル順走査列 1, 2, 3, 4, 5 は 3 つの木のどれにも当てはまり、二分木を一意に表現できません。',
    ru: 'Без None последовательность обхода по уровням 1, 2, 3, 4, 5 подходит ко всем трём деревьям, поэтому однозначно задать дерево она не может.',
  },
  with: {
    en: 'With every None written out, the level-order sequence uniquely represents the binary tree.',
    zh: '在层序遍历序列中显式地写出所有 None 后，该序列就可以唯一表示这棵二叉树。',
    'zh-hant': '在層序走訪序列中顯式地寫出所有 None 後，該序列就可以唯一表示這棵二元樹。',
    ja: 'レベル順走査列にすべての None を明示的に書き込めば、二分木を一意に表現できます。',
    ru: 'Если явно записать все None, последовательность обхода по уровням однозначно задаёт двоичное дерево.',
  },
  complete: {
    en: 'In a complete binary tree, None only appears at the bottom right, so all None values sit at the end of the sequence and need not be stored.',
    zh: '完全二叉树的 None 只出现在最底层靠右的位置，因此一定位于层序遍历序列的末尾，可以省略不存。',
    'zh-hant': '完全二元樹的 None 只出現在最底層靠右的位置，因此一定位於層序走訪序列的末尾，可以省略不存。',
    ja: '完全二分木では None は最下層の右側にしか現れないため、必ずレベル順走査列の末尾に並び、格納を省略できます。',
    ru: 'В полном двоичном дереве None бывают только справа на нижнем уровне, то есть в конце последовательности, и их можно не хранить.',
  },
};

const NONE_LEGEND = { tone: 'ghost' as Tone, dashed: true, shape: 'circle' as const, text: 'None' };

const arrayRepresentationWithoutEmpty: StaticFigure = {
  type: 'static',
  build(l) {
    const seq = [1, 2, 3, 4, 5];
    const trees: Val[][] = [
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, null, 5, null],
      [1, 2, 3, null, 4, null, 5],
    ];
    const cw = 30;
    const ax = (W - (seq.length * (cw + 4) - 4)) / 2;
    const nodes: SceneNode[] = [
      text('al', W / 2, 16, WORD.levelOrder[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
      ...cells('a', ax, 24, seq.map((v) => ({ value: v, tone: 'ok' as Tone })), { w: cw, h: 28, gap: 4, size: 13 }),
    ];
    trees.forEach((values, k) => {
      const px = 6 + k * 144;
      nodes.push(
        region(`p${k}`, px, 86, 140, 150, { tone: 'soft' }),
        arrow(`pa${k}`, [W / 2 + (k - 1) * 30, 56], [px + 70, 82], { tone: 'muted', width: 1.25 }),
        ...levelTree(`t${k}:`, values, { left: px + 4, width: 132, top: 114, gap: 50, r: 13, gaps: true }).nodes,
      );
    });
    return { scene: { w: W, h: 242, nodes }, legend: [NONE_LEGEND], notes: [ARRAY_NOTE.without[l]] };
  },
};

const arrayRepresentationWithEmpty: StaticFigure = {
  type: 'static',
  build(l) {
    const values: Val[] = [1, 2, 3, 4, null, 6, 7, 8, 9, null, null, 12, null, null, 15];
    const tree = levelTree('n', values, { ...ARR_LAY, r: 12, gaps: true });
    const cy = 246;
    const arr = cells('c', ARR_X0, cy, values.map((v) => ({ value: v, tone: v === null ? undefined : ('ok' as Tone) })), { w: ARR_CW, h: 26, gap: 2, size: 12 });
    const nodes: SceneNode[] = [
      ...tree.nodes,
      ...indexLabels('n', tree.boxes),
      ...indices('ci', ARR_X0, cy - 6, values.map((_, k) => k), { w: ARR_CW, gap: 2 }),
      ...arr,
      ...tag('none', arr[4], 'None', { side: 'below', tone: 'muted', gap: 18 }),
    ];
    return { scene: { w: W, h: 306, nodes }, legend: [NONE_LEGEND], notes: [ARRAY_NOTE.with[l]] };
  },
};

const arrayRepresentationCompleteBinaryTree: StaticFigure = {
  type: 'static',
  build(l) {
    const values: Val[] = [...ONE_TO(10), null, null, null, null, null];
    const tree = levelTree('n', values, { ...ARR_LAY, r: 12, gaps: true });
    const y1 = 232;
    const y2 = 302;
    const tailA = ARR_X0 + 10 * (ARR_CW + 2);
    const tailB = ARR_X0 + 15 * (ARR_CW + 2) - 2;
    const headMid = ARR_X0 + (10 * (ARR_CW + 2) - 2) / 2;
    const nodes: SceneNode[] = [
      ...tree.nodes,
      text('al', ARR_X0, y1 - 8, WORD.levelOrder[l], { size: 12, bold: true, tone: 'muted' }),
      ...cells('a', ARR_X0, y1, values.map((v) => ({ value: v, tone: v === null ? undefined : ('ok' as Tone) })), { w: ARR_CW, h: 26, gap: 2, size: 12 }),
      brace('tail', tailA, tailB, y1 + 30, 'down'),
      text('tail:t', (tailA + tailB) / 2, y1 + 62, 'None', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
      arrow('down', [headMid, y1 + 32], [headMid, y2 - 6], { tone: 'accent', width: 2 }),
      ...cells('b', ARR_X0, y2, ONE_TO(10).map((v) => ({ value: v, tone: 'ok' as Tone })), { w: ARR_CW, h: 26, gap: 2, size: 12 }),
    ];
    return { scene: { w: W, h: 334, nodes }, legend: [NONE_LEGEND], notes: [ARRAY_NOTE.complete[l]] };
  },
};

export const BASIC_FIGURES: Record<string, Figure> = {
  binary_tree_definition: binaryTreeDefinition,
  binary_tree_terminology: binaryTreeTerminology,
  binary_tree_add_remove: binaryTreeAddRemove,
  perfect_binary_tree: perfectBinaryTree,
  complete_binary_tree: completeBinaryTree,
  full_binary_tree: fullBinaryTree,
  balanced_binary_tree: balancedBinaryTree,
  binary_tree_best_worst_cases: binaryTreeBestWorstCases,
  binary_tree_bfs: binaryTreeBfs,
  binary_tree_dfs: binaryTreeDfs,
  preorder_steps: preorderSteps,
  array_representation_binary_tree: arrayRepresentationBinaryTree,
  array_representation_without_empty: arrayRepresentationWithoutEmpty,
  array_representation_with_empty: arrayRepresentationWithEmpty,
  array_representation_complete_binary_tree: arrayRepresentationCompleteBinaryTree,
};
