import avlJavaEn from '@codes-en/java/chapter_tree/avl_tree.java?raw';
import bstJavaEn from '@codes-en/java/chapter_tree/binary_search_tree.java?raw';
import avlPyEn from '@codes-en/python/chapter_tree/avl_tree.py?raw';
import bstPyEn from '@codes-en/python/chapter_tree/binary_search_tree.py?raw';
import avlJavaJa from '@codes-ja/java/chapter_tree/avl_tree.java?raw';
import bstJavaJa from '@codes-ja/java/chapter_tree/binary_search_tree.java?raw';
import avlPyJa from '@codes-ja/python/chapter_tree/avl_tree.py?raw';
import bstPyJa from '@codes-ja/python/chapter_tree/binary_search_tree.py?raw';
import avlJavaRu from '@codes-ru/java/chapter_tree/avl_tree.java?raw';
import bstJavaRu from '@codes-ru/java/chapter_tree/binary_search_tree.java?raw';
import avlPyRu from '@codes-ru/python/chapter_tree/avl_tree.py?raw';
import bstPyRu from '@codes-ru/python/chapter_tree/binary_search_tree.py?raw';
import avlJavaZh from '@codes-zh/java/chapter_tree/avl_tree.java?raw';
import bstJavaZh from '@codes-zh/java/chapter_tree/binary_search_tree.java?raw';
import avlPyZh from '@codes-zh/python/chapter_tree/avl_tree.py?raw';
import bstPyZh from '@codes-zh/python/chapter_tree/binary_search_tree.py?raw';
import avlJavaZhHant from '@codes-zh-hant/java/chapter_tree/avl_tree.java?raw';
import bstJavaZhHant from '@codes-zh-hant/java/chapter_tree/binary_search_tree.java?raw';
import avlPyZhHant from '@codes-zh-hant/python/chapter_tree/avl_tree.py?raw';
import bstPyZhHant from '@codes-zh-hant/python/chapter_tree/binary_search_tree.py?raw';
import { codeSources, type RawByLocale } from '../../algorithms/codes';
import type { Locale } from '../../i18n/locale';
import { box, cells, chip, drawTree, link, region, seg, text, treeFromLevels, treeHeight, treeWalk, type TreeSpec } from '../kit';
import type { BoxNode, Figure, LegendItem, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, raw, type T } from './shared';

/**
 * Chapter 7, binary search trees and AVL trees. Trees are plain data (`TreeSpec`); every node
 * keeps its id from frame to frame, so searches, removals and rotations glide instead of jump.
 */

const W = 440;

const BST_PY = raw(bstPyEn, bstPyZh, bstPyZhHant, bstPyJa, bstPyRu);
const BST_JAVA = raw(bstJavaEn, bstJavaZh, bstJavaZhHant, bstJavaJa, bstJavaRu);
const AVL_PY = raw(avlPyEn, avlPyZh, avlPyZhHant, avlPyJa, avlPyRu);
const AVL_JAVA = raw(avlJavaEn, avlJavaZh, avlJavaZhHant, avlJavaJa, avlJavaRu);

/** Python and Java sources of methods of one class, with the lines for each step. */
function classSources(
  py: RawByLocale,
  java: RawByLocale,
  cls: string,
  funcs: string[],
  anchors: { python: Record<string, string[]>; java: Record<string, string[]> },
) {
  return codeSources({
    python: { label: 'Python', raw: py, parts: funcs.map((func) => ({ cls, func })), anchors: anchors.python },
    java: { label: 'Java', raw: java, parts: funcs.map((func) => ({ cls, func })), anchors: anchors.java },
  });
}

// ── Tree data ─────────────────────────────────────────────────────────

type N = TreeSpec;

/** A node with id `n<value>`. */
const nd = (v: number, l: N | null = null, r: N | null = null): N => ({ id: `n${v}`, v, l, r });

type Look = Pick<TreeSpec, 'tone' | 'dim' | 'ring' | 'dashed'>;

/** A copy of the tree with each node's look set by `look`. */
function paint(n: N | null | undefined, look: (n: N) => Look): N | null {
  if (!n) return null;
  return { ...n, ...look(n), l: paint(n.l, look), r: paint(n.r, look) };
}

/** Ids of a subtree, preorder. */
const subtree = (n: N | null | undefined): string[] => (n ? [n.id, ...subtree(n.l), ...subtree(n.r)] : []);

function find(n: N | null | undefined, id: string): N | null {
  if (!n) return null;
  if (n.id === id) return n;
  return find(n.l, id) ?? find(n.r, id);
}

/** A copy of the tree with the subtree rooted at `id` replaced by `sub`. */
function replace(n: N | null | undefined, id: string, sub: N | null): N | null {
  if (!n) return null;
  if (n.id === id) return sub;
  return { ...n, l: replace(n.l, id, sub), r: replace(n.r, id, sub) };
}

/** Prefixes every id, so several trees can share a scene. */
const reid = (n: N | null | undefined, p: string): N | null => (n ? { ...n, id: p + n.id, l: reid(n.l, p), r: reid(n.r, p) } : null);

/** Balance factor of every node: left subtree height − right subtree height. */
function balance(root: N | null): Map<string, number> {
  const out = new Map<string, number>();
  for (const { node } of treeWalk(root)) out.set(node.id, treeHeight(node.l) - treeHeight(node.r));
  return out;
}

/** One rotation of the subtree rooted at `n`. */
function rotated(n: N, dir: 'right' | 'left'): N {
  if (dir === 'right') {
    const c = n.l!;
    return { ...c, r: { ...n, l: c.r ?? null } };
  }
  const c = n.r!;
  return { ...c, l: { ...n, r: c.l ?? null } };
}

/** Signed number with a real minus sign. */
const sgn = (k: number) => (k < 0 ? `−${-k}` : String(k));

// ── Drawing ───────────────────────────────────────────────────────────

interface Lay {
  left: number;
  width: number;
  top: number;
  gap: number;
  r: number;
  size?: number;
}

/** Center of a slot, as drawTree places it. */
const slotAt = (lay: Lay, depth: number, slot: number) => ({ x: lay.left + ((slot + 0.5) * lay.width) / 2 ** depth, y: lay.top + depth * lay.gap });

/** drawTree, with some edges (by child id) colored. */
function drawAt(root: N | null, lay: Lay, hot: Record<string, Tone> = {}, prefix = '') {
  const { nodes, boxes } = drawTree(prefix, root, lay);
  const out = nodes.map((n) => {
    const tone = n.kind === 'arrow' ? hot[n.id.slice(prefix.length + 2)] : undefined;
    return tone ? { ...n, tone, width: 2.25 } : n;
  });
  return { nodes: out, boxes };
}

/** A pointer name under a node, e.g. `cur`. */
const under = (id: string, b: BoxNode, label: Rich, tone: Tone) =>
  text(id, b.x + b.w / 2, b.y + b.h + 13, label, { anchor: 'middle', mono: true, bold: true, size: 11, tone });

/** A pointer name beside a node, e.g. `child`. */
const beside = (id: string, b: BoxNode, label: Rich, tone: Tone, side: 'left' | 'right') =>
  text(id, side === 'left' ? b.x - 8 : b.x + b.w + 8, b.y + b.h / 2 + 4, label, { anchor: side === 'left' ? 'end' : 'start', mono: true, bold: true, size: 12, tone });

/** A dashed empty circle standing for `None`. */
const ghost = (id: string, cx: number, cy: number, r: number) =>
  box(id, cx - r, cy - r, 'None', { w: 2 * r, h: 2 * r, shape: 'circle', dashed: true, tone: 'ghost', size: 11 });

/** A loose node drawn where it used to be, outside the tree. */
const loose = (b: BoxNode, tone: Tone, dashed = false): BoxNode => ({ ...b, tone, dashed, ring: false, dim: false });

// ── Words ─────────────────────────────────────────────────────────────

const WORD: Record<'left' | 'right' | 'path' | 'unbalanced' | 'seq' | 'bal' | 'deg', T> = {
  left: { en: 'left subtree', zh: '左子树', 'zh-hant': '左子樹', ja: '左部分木', ru: 'левое поддерево' },
  right: { en: 'right subtree', zh: '右子树', 'zh-hant': '右子樹', ja: '右部分木', ru: 'правое поддерево' },
  path: { en: 'search path', zh: '查找路径', 'zh-hant': '查詢路徑', ja: '探索経路', ru: 'путь поиска' },
  unbalanced: { en: 'unbalanced node', zh: '失衡节点', 'zh-hant': '失衡節點', ja: '不平衡ノード', ru: 'разбалансированный узел' },
  seq: { en: 'inorder traversal sequence', zh: '中序遍历序列', 'zh-hant': '中序走訪序列', ja: '中順走査列', ru: 'последовательность симметричного обхода' },
  bal: { en: 'Balanced binary search tree', zh: '平衡二叉搜索树', 'zh-hant': '平衡二元搜尋樹', ja: '平衡な二分探索木', ru: 'Сбалансированное дерево' },
  deg: { en: 'Degenerate binary search tree', zh: '退化的二叉搜索树', 'zh-hant': '退化的二元搜尋樹', ja: '退化した二分探索木', ru: 'Вырожденное дерево' },
};

const TITLE: Record<'perfect' | 'balanced' | 'unbalanced' | 'list', T> = {
  perfect: { en: 'Perfect binary tree', zh: '完美二叉树', 'zh-hant': '完美二元樹', ja: '充足二分木', ru: 'Идеальное двоичное дерево' },
  balanced: { en: 'Balanced binary tree', zh: '平衡二叉树', 'zh-hant': '平衡二元樹', ja: '平衡二分木', ru: 'Сбалансированное двоичное дерево' },
  unbalanced: { en: 'Unbalanced binary tree', zh: '不平衡二叉树', 'zh-hant': '不平衡二元樹', ja: '不平衡な二分木', ru: 'Несбалансированное двоичное дерево' },
  list: { en: 'Linked list', zh: '链表', 'zh-hant': '鏈結串列', ja: '連結リスト', ru: 'Связный список' },
};

const legendCircle = (tone: Tone, t: string): LegendItem => ({ tone, text: t, shape: 'circle' });

// ── Binary search trees ───────────────────────────────────────────────

/** The book's example tree: 1..15 as a perfect binary search tree. */
const bst15 = () => treeFromLevels([8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15])!;

const BL: Lay = { left: 10, width: 420, top: 44, gap: 54, r: 17 };
const BST_H = 282;
const CHIP_Y = 248;

interface BstView {
  root: N;
  /** Ids from the root to `cur`; the edges into them are highlighted. */
  path?: string[];
  cur?: string | null;
  pre?: string | null;
  tones?: Record<string, Tone>;
  rings?: string[];
  dim?: string[];
  /** More pointer names under nodes: [node id, name, tone]. */
  labels?: [string, string, Tone][];
  edges?: Record<string, Tone>;
  chip?: Rich;
  chipLeft?: boolean;
  /** Nodes to treat as having children when placing names (e.g. a parent of a dashed spot). */
  busy?: string[];
  target?: Rich;
  extra?: SceneNode[];
}

function bstNodes(v: BstView): SceneNode[] {
  const path = v.path ?? [];
  const dim = new Set(v.dim ?? []);
  const rings = new Set([...(v.rings ?? []), ...(v.cur ? [v.cur] : [])]);
  const painted = paint(v.root, (n) => ({
    tone: v.tones?.[n.id] ?? (n.id === v.cur ? 'accent' : path.includes(n.id) ? 'info' : undefined),
    ring: rings.has(n.id) || undefined,
    dim: dim.has(n.id) || undefined,
  }));
  const hot: Record<string, Tone> = Object.fromEntries(path.slice(1).map((id) => [id, 'accent' as Tone]));
  const { nodes, boxes } = drawAt(painted, BL, { ...hot, ...v.edges });
  const labels: [string, string, Tone][] = [
    ...(v.cur ? [[v.cur, 'cur', 'accent'] as [string, string, Tone]] : []),
    ...(v.pre ? [[v.pre, 'pre', 'info'] as [string, string, Tone]] : []),
    ...(v.labels ?? []),
  ];
  // Under a leaf there is room for the name; beside a node with children it stays clear of the edges.
  const walk = treeWalk(v.root);
  for (const [id, label, tone] of labels) {
    const b = boxes.get(id);
    const w = walk.find((x) => x.node.id === id);
    if (!b || !w) continue;
    const leaf = !w.node.l && !w.node.r && !v.busy?.includes(id);
    nodes.push(leaf ? under(`p:${label}`, b, label, tone) : beside(`p:${label}`, b, label, tone, w.parent?.r?.id === id ? 'right' : 'left'));
  }
  if (v.chip) nodes.push(chip('chip', v.chipLeft ? 10 : W / 2, CHIP_Y, v.chip, { align: v.chipLeft ? 'start' : 'middle' }));
  if (v.target) nodes.push(chip('num', 8, 8, v.target, { align: 'start' }));
  nodes.push(...(v.extra ?? []));
  return nodes;
}

/** `8 > 7 → cur = cur.left` */
const cmpChip = (a: number, op: string, b: number, then: string) => seg([String(a), 'accent', true], ` ${op} `, [String(b), 'warn', true], `  →  ${then}`);
const numChip = (v: number) => seg('num = ', [String(v), 'warn', true]);

// The BST property.

const PROPERTY_SAY: Record<'init' | 'root' | 'sub', T> = {
  init: {
    en: 'In a binary search tree, for every node: values in its left subtree < its value < values in its right subtree.',
    zh: '二叉搜索树的任意节点都满足：左子树中所有节点的值 < 该节点的值 < 右子树中所有节点的值。',
    'zh-hant': '二元搜尋樹的任意節點都滿足：左子樹中所有節點的值 < 該節點的值 < 右子樹中所有節點的值。',
    ja: '二分探索木の任意のノードについて、左部分木のすべての値 < ノードの値 < 右部分木のすべての値が成り立ちます。',
    ru: 'В двоичном дереве поиска для любого узла: значения левого поддерева < значение узла < значения правого поддерева.',
  },
  root: {
    en: 'Root 8: its left subtree holds 1–7, all smaller; its right subtree holds 9–15, all larger.',
    zh: '根节点 8：左子树为 1～7，都比它小；右子树为 9～15，都比它大。',
    'zh-hant': '根節點 8：左子樹為 1～7，都比它小；右子樹為 9～15，都比它大。',
    ja: '根ノード 8：左部分木は 1〜7 ですべて小さく、右部分木は 9〜15 ですべて大きい値です。',
    ru: 'Корень 8: в левом поддереве 1–7, все меньше; в правом 9–15, все больше.',
  },
  sub: {
    en: 'Node {v} follows the same rule: the left and right subtrees of any node are binary search trees too.',
    zh: '节点 {v} 同样满足该条件：任意节点的左、右子树也是二叉搜索树。',
    'zh-hant': '節點 {v} 同樣滿足該條件：任意節點的左、右子樹也是二元搜尋樹。',
    ja: 'ノード {v} も同じ条件を満たします。任意のノードの左右の部分木も二分探索木です。',
    ru: 'Узел {v} подчиняется тому же правилу: левое и правое поддеревья любого узла — тоже двоичные деревья поиска.',
  },
};

const bstProperty: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', node: 'cmp' },
  build(l) {
    const root = bst15();
    const scene = (focus: number | null) => {
      if (focus === null) return { w: W, h: BST_H, nodes: bstNodes({ root }) };
      const n = find(root, `n${focus}`)!;
      const left = subtree(n.l);
      const right = subtree(n.r);
      const tones: Record<string, Tone> = { [n.id]: 'accent' };
      for (const id of left) tones[id] = 'info';
      for (const id of right) tones[id] = 'warn';
      const nodes = bstNodes({ root, tones, rings: [n.id] });
      // Panels behind each subtree, sized from the drawn circles.
      const { boxes } = drawTree('', root, BL);
      const frame = (ids: string[]) => {
        const bs = ids.map((id) => boxes.get(id)!);
        const x0 = Math.min(...bs.map((b) => b.x)) - 7;
        const y0 = Math.min(...bs.map((b) => b.y)) - 7;
        return { x: x0, y: y0, w: Math.max(...bs.map((b) => b.x + b.w)) + 7 - x0, h: Math.max(...bs.map((b) => b.y + b.h)) + 7 - y0 };
      };
      const fl = frame(left);
      const fr = frame(right);
      const vals = (ids: string[]) =>
        ids
          .map((id) => Number(id.slice(1)))
          .sort((a, b) => a - b)
          .join(' ');
      nodes.push(
        region('sl', fl.x, fl.y, fl.w, fl.h, { tone: 'info', label: `< ${focus}` }),
        region('sr', fr.x, fr.y, fr.w, fr.h, { tone: 'warn', label: `> ${focus}` }),
        chip('chip', W / 2, CHIP_Y, seg([vals(left), 'info', true], '  <  ', [String(focus), 'accent', true], '  <  ', [vals(right), 'warn', true])),
      );
      return { w: W, h: BST_H, nodes };
    };
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(null), say: PROPERTY_SAY.init[l] },
      { kind: 'node', scene: scene(8), say: PROPERTY_SAY.root[l] },
      { kind: 'node', scene: scene(4), say: fmt(PROPERTY_SAY.sub[l], { v: 4 }) },
      { kind: 'node', scene: scene(12), say: fmt(PROPERTY_SAY.sub[l], { v: 12 }) },
    ];
    return { frames, legend: [{ tone: 'info', text: WORD.left[l] }, { tone: 'warn', text: WORD.right[l] }] };
  },
};

// Search.

const SEARCH_SAY: Record<'init' | 'left' | 'right' | 'found', T> = {
  init: {
    en: 'Search for 7. cur starts at the root, 8.',
    zh: '查找 7。cur 从根节点 8 出发。',
    'zh-hant': '查詢 7。cur 從根節點 8 出發。',
    ja: '7 を探索します。cur は根ノード 8 から出発します。',
    ru: 'Ищем 7. cur начинает с корня — узла 8.',
  },
  left: {
    en: '{v} > {n}: the target is in the left subtree of {v}, so cur = cur.left. The right subtree is ruled out.',
    zh: '{v} > {n}：目标节点在 {v} 的左子树中，执行 cur = cur.left，右子树被排除。',
    'zh-hant': '{v} > {n}：目標節點在 {v} 的左子樹中，執行 cur = cur.left，右子樹被排除。',
    ja: '{v} > {n}：目標ノードは {v} の左部分木にあるので cur = cur.left。右部分木は除外されます。',
    ru: '{v} > {n}: целевой узел в левом поддереве {v}, поэтому cur = cur.left. Правое поддерево отброшено.',
  },
  right: {
    en: '{v} < {n}: the target is in the right subtree of {v}, so cur = cur.right. The left subtree is ruled out.',
    zh: '{v} < {n}：目标节点在 {v} 的右子树中，执行 cur = cur.right，左子树被排除。',
    'zh-hant': '{v} < {n}：目標節點在 {v} 的右子樹中，執行 cur = cur.right，左子樹被排除。',
    ja: '{v} < {n}：目標ノードは {v} の右部分木にあるので cur = cur.right。左部分木は除外されます。',
    ru: '{v} < {n}: целевой узел в правом поддереве {v}, поэтому cur = cur.right. Левое поддерево отброшено.',
  },
  found: {
    en: 'cur.val = {n}: the target node is found. Exit the loop and return it.',
    zh: 'cur.val = {n}：找到目标节点，跳出循环并返回该节点。',
    'zh-hant': 'cur.val = {n}：找到目標節點，跳出迴圈並回傳該節點。',
    ja: 'cur.val = {n}：目標ノードが見つかったので、ループを抜けてそのノードを返します。',
    ru: 'cur.val = {n}: целевой узел найден. Выходим из цикла и возвращаем его.',
  },
};

const bstSearch: StepFigure = {
  type: 'steps',
  call: 'search(7)',
  tones: { init: 'idle', left: 'cmp', right: 'cmp', found: 'done' },
  build(l) {
    const root = bst15();
    const target = numChip(7);
    const out = (id: string) => subtree(find(root, id));
    const sc = (path: number[], dim: string[], c?: Rich) => ({ w: W, h: BST_H, nodes: bstNodes({ root, path: path.map((v) => `n${v}`), cur: `n${path[path.length - 1]}`, dim, chip: c, target }) });
    const d1 = out('n12');
    const d2 = [...d1, ...out('n2')];
    const d3 = [...d2, 'n5'];
    const frames: SceneFrame[] = [
      { kind: 'init', scene: sc([8], []), say: SEARCH_SAY.init[l] },
      { kind: 'left', scene: sc([8, 4], d1, cmpChip(8, '>', 7, 'cur = cur.left')), say: fmt(SEARCH_SAY.left[l], { v: 8, n: 7 }) },
      { kind: 'right', scene: sc([8, 4, 6], d2, cmpChip(4, '<', 7, 'cur = cur.right')), say: fmt(SEARCH_SAY.right[l], { v: 4, n: 7 }) },
      { kind: 'right', scene: sc([8, 4, 6, 7], d3, cmpChip(6, '<', 7, 'cur = cur.right')), say: fmt(SEARCH_SAY.right[l], { v: 6, n: 7 }) },
      { kind: 'found', scene: sc([8, 4, 6, 7], d3, cmpChip(7, '==', 7, 'break')), say: fmt(SEARCH_SAY.found[l], { n: 7 }) },
    ];
    return { frames, legend: [legendCircle('accent', 'cur'), legendCircle('info', WORD.path[l])] };
  },
  sources: classSources(BST_PY, BST_JAVA, 'BinarySearchTree', ['search'], {
    python: { init: ['cur = self._root'], left: ['elif cur.val > num:', 'cur = cur.left'], right: ['if cur.val < num:', 'cur = cur.right'], found: ['break'] },
    java: { init: ['TreeNode cur = root;'], left: ['else if (cur.val > num)', 'cur = cur.left;'], right: ['if (cur.val < num)', 'cur = cur.right;'], found: ['break;'] },
  }),
};

// Insert.

const INSERT_SAY: Record<'init' | 'right' | 'none' | 'insert', T> = {
  init: {
    en: 'Insert 16. First find the insertion position: as in a search, start at the root.',
    zh: '插入 16。先查找插入位置：与查找操作相同，从根节点出发。',
    'zh-hant': '插入 16。先查詢插入位置：與查詢操作相同，從根節點出發。',
    ja: '16 を挿入します。まず挿入位置を探します。探索と同じく根ノードから出発します。',
    ru: 'Вставляем 16. Сначала ищем позицию для вставки: как при поиске, начинаем с корня.',
  },
  right: {
    en: '{v} < {n}: go right. pre keeps the node just left behind, and cur = cur.right.',
    zh: '{v} < {n}：向右走。pre 保存上一轮的节点，cur = cur.right。',
    'zh-hant': '{v} < {n}：向右走。pre 儲存上一輪的節點，cur = cur.right。',
    ja: '{v} < {n}：右へ進みます。pre は直前のノードを保持し、cur = cur.right とします。',
    ru: '{v} < {n}: идем вправо. pre запоминает узел предыдущей итерации, cur = cur.right.',
  },
  none: {
    en: '{v} < {n}: cur goes right past the leaf and becomes None. That empty spot is the insertion position; pre = {v} is its parent.',
    zh: '{v} < {n}：cur 越过叶节点，变为 None。这个空位就是插入位置，pre = {v} 是它的父节点。',
    'zh-hant': '{v} < {n}：cur 越過葉節點，變為 None。這個空位就是插入位置，pre = {v} 是它的父節點。',
    ja: '{v} < {n}：cur は葉ノードを越えて None になります。この空き位置が挿入位置で、pre = {v} がその親ノードです。',
    ru: '{v} < {n}: cur выходит за лист и становится None. Это пустое место и есть позиция вставки, а pre = {v} — его родитель.',
  },
  insert: {
    en: 'Create node 16 and put it in that spot: pre.right = node. The tree is still a binary search tree.',
    zh: '初始化节点 16 并置于该位置：pre.right = node。树仍然是二叉搜索树。',
    'zh-hant': '初始化節點 16 並置於該位置：pre.right = node。樹仍然是二元搜尋樹。',
    ja: 'ノード 16 を作り、その位置に置きます：pre.right = node。木は二分探索木のままです。',
    ru: 'Создаем узел 16 и ставим его на это место: pre.right = node. Дерево остается двоичным деревом поиска.',
  },
};

const bstInsert: StepFigure = {
  type: 'steps',
  call: 'insert(16)',
  tones: { init: 'idle', right: 'cmp', insert: 'done' },
  build(l) {
    const root = bst15();
    const h = 296;
    const target = numChip(16);
    const g = slotAt(BL, 4, 15);
    const ids = (vs: number[]) => vs.map((v) => `n${v}`);
    const sc = (path: number[], pre: number | null, c?: Rich) => ({
      w: W,
      h,
      nodes: bstNodes({ root, path: ids(path), cur: `n${path[path.length - 1]}`, pre: pre === null ? null : `n${pre}`, chip: c, chipLeft: true, target }),
    });
    // cur has run off the leaf: a dashed empty spot under 15.
    const spot = ghost('n16', g.x, g.y, BL.r);
    const noneNodes = bstNodes({ root, path: ids([8, 12, 14, 15]), pre: 'n15', busy: ['n15'], chip: cmpChip(15, '<', 16, 'cur = cur.right'), chipLeft: true, target });
    const b15 = drawTree('', root, BL).boxes.get('n15')!;
    noneNodes.push(spot, link('e:n16', b15, spot, { pad: 2, width: 1.5, dashed: true, tone: 'accent' }), under('p:cur', spot, 'cur', 'accent'));
    const grown = replace(root, 'n15', { ...find(root, 'n15')!, r: nd(16) })!;
    const frames: SceneFrame[] = [
      { kind: 'init', scene: sc([8], null), say: INSERT_SAY.init[l] },
      { kind: 'right', scene: sc([8, 12], 8, cmpChip(8, '<', 16, 'cur = cur.right')), say: fmt(INSERT_SAY.right[l], { v: 8, n: 16 }) },
      { kind: 'right', scene: sc([8, 12, 14], 12, cmpChip(12, '<', 16, 'cur = cur.right')), say: fmt(INSERT_SAY.right[l], { v: 12, n: 16 }) },
      { kind: 'right', scene: sc([8, 12, 14, 15], 14, cmpChip(14, '<', 16, 'cur = cur.right')), say: fmt(INSERT_SAY.right[l], { v: 14, n: 16 }) },
      { kind: 'right', scene: { w: W, h, nodes: noneNodes }, say: fmt(INSERT_SAY.none[l], { v: 15, n: 16 }) },
      {
        kind: 'insert',
        scene: { w: W, h, nodes: bstNodes({ root: grown, path: ids([8, 12, 14, 15, 16]), pre: 'n15', tones: { n16: 'accent' }, rings: ['n16'], chip: 'pre.right = node', chipLeft: true, target }) },
        say: INSERT_SAY.insert[l],
      },
    ];
    return { frames, legend: [legendCircle('accent', 'cur'), legendCircle('info', WORD.path[l])] };
  },
  sources: classSources(BST_PY, BST_JAVA, 'BinarySearchTree', ['insert'], {
    python: { init: ['cur, pre = self._root, None'], right: ['pre = cur', 'cur = cur.right'], insert: ['node = TreeNode(num)', 'pre.right = node'] },
    java: { init: ['TreeNode cur = root, pre = null;'], right: ['pre = cur;', 'cur = cur.right;'], insert: ['TreeNode node = new TreeNode(num);', 'pre.right = node;'] },
  }),
};

// Remove.

const REMOVE_SAY: Record<'find' | 'leaf' | 'cutLeaf' | 'one' | 'cutOne' | 'two' | 'tmp' | 'down' | 'recur' | 'copy', T> = {
  find: {
    en: 'Remove {v}. First search for it: cur = {v}, and its parent is pre = {p}.',
    zh: '删除 {v}。先查找该节点：cur = {v}，其父节点 pre = {p}。',
    'zh-hant': '刪除 {v}。先查詢該節點：cur = {v}，其父節點 pre = {p}。',
    ja: '{v} を削除します。まず探索します：cur = {v}、その親ノードは pre = {p} です。',
    ru: 'Удаляем {v}. Сначала находим его: cur = {v}, его родитель pre = {p}.',
  },
  leaf: {
    en: '{v} has no children: its degree is 0, so it is a leaf.',
    zh: '{v} 没有子节点：度为 0，是叶节点。',
    'zh-hant': '{v} 沒有子節點：度為 0，是葉節點。',
    ja: '{v} には子ノードがありません。次数 0 の葉ノードです。',
    ru: 'У {v} нет дочерних узлов: степень 0, это лист.',
  },
  cutLeaf: {
    en: 'A leaf can be removed directly: child = None, so pre.left = None.',
    zh: '叶节点可以直接删除：child = None，执行 pre.left = None。',
    'zh-hant': '葉節點可以直接刪除：child = None，執行 pre.left = None。',
    ja: '葉ノードはそのまま削除できます：child = None なので pre.left = None。',
    ru: 'Лист можно удалить напрямую: child = None, поэтому pre.left = None.',
  },
  one: {
    en: '{v} has one child, {c}: its degree is 1, and child = {c}.',
    zh: '{v} 只有一个子节点 {c}：度为 1，child = {c}。',
    'zh-hant': '{v} 只有一個子節點 {c}：度為 1，child = {c}。',
    ja: '{v} の子ノードは {c} だけです。次数 1 なので child = {c}。',
    ru: 'У {v} один дочерний узел {c}: степень 1, child = {c}.',
  },
  cutOne: {
    en: 'Replace {v} with its child: pre.left = child. {c} moves up, and the order is kept.',
    zh: '将 {v} 替换为其子节点：pre.left = child。{c} 上移，大小关系保持不变。',
    'zh-hant': '將 {v} 替換為其子節點：pre.left = child。{c} 上移，大小關係保持不變。',
    ja: '{v} を子ノードで置き換えます：pre.left = child。{c} が上に移り、大小関係は保たれます。',
    ru: 'Заменяем {v} его дочерним узлом: pre.left = child. {c} поднимается, порядок сохраняется.',
  },
  two: {
    en: 'Remove 4. The search finds cur = 4. It has two children (degree 2), so it cannot be removed directly.',
    zh: '删除 4。查找得到 cur = 4。它有两个子节点（度为 2），无法直接删除。',
    'zh-hant': '刪除 4。查詢得到 cur = 4。它有兩個子節點（度為 2），無法直接刪除。',
    ja: '4 を削除します。探索で cur = 4 が見つかります。子ノードが 2 つ（次数 2）あるので、直接は削除できません。',
    ru: 'Удаляем 4. Поиск находит cur = 4. У него два дочерних узла (степень 2), поэтому удалить его напрямую нельзя.',
  },
  tmp: {
    en: 'Replace it with the next node in the inorder traversal: the smallest node of the right subtree. Start with tmp = cur.right.',
    zh: '用中序遍历的下一个节点（右子树的最小节点）替换它。先令 tmp = cur.right。',
    'zh-hant': '用中序走訪的下一個節點（右子樹的最小節點）替換它。先令 tmp = cur.right。',
    ja: '中順走査で次のノード、つまり右部分木の最小ノードで置き換えます。まず tmp = cur.right。',
    ru: 'Заменим его следующим узлом симметричного обхода — минимальным узлом правого поддерева. Начинаем с tmp = cur.right.',
  },
  down: {
    en: 'Go left as far as possible: tmp = tmp.left. 5 has no left child, so it is the inorder successor.',
    zh: '尽可能向左走：tmp = tmp.left。5 没有左子节点，它就是中序遍历的后继节点。',
    'zh-hant': '盡可能向左走：tmp = tmp.left。5 沒有左子節點，它就是中序走訪的後繼節點。',
    ja: 'できるだけ左へ進みます：tmp = tmp.left。5 には左の子ノードがないので、これが中順走査の後続ノードです。',
    ru: 'Идем влево, пока можно: tmp = tmp.left. У 5 нет левого дочернего узла, значит, это следующий узел симметричного обхода.',
  },
  recur: {
    en: 'Recursively remove tmp from the tree. 5 is a leaf, so it is cut off directly; its value is kept.',
    zh: '在树中递归删除节点 tmp。5 是叶节点，直接删除，并保留它的值。',
    'zh-hant': '在樹中遞迴刪除節點 tmp。5 是葉節點，直接刪除，並保留它的值。',
    ja: '木からノード tmp を再帰的に削除します。5 は葉ノードなので直接削除し、値は残しておきます。',
    ru: 'Рекурсивно удаляем узел tmp из дерева. 5 — лист, его удаляют напрямую, а значение сохраняют.',
  },
  copy: {
    en: 'cur.val = tmp.val: 5 overwrites 4. Left subtree 3 < 5 < right subtree 6, 7: still a binary search tree.',
    zh: 'cur.val = tmp.val：用 5 覆盖 4。左子树 3 < 5 < 右子树 6、7，仍然是二叉搜索树。',
    'zh-hant': 'cur.val = tmp.val：用 5 覆蓋 4。左子樹 3 < 5 < 右子樹 6、7，仍然是二元搜尋樹。',
    ja: 'cur.val = tmp.val：5 で 4 を上書きします。左部分木 3 < 5 < 右部分木 6、7 で、二分探索木のままです。',
    ru: 'cur.val = tmp.val: 5 записывается вместо 4. Левое поддерево 3 < 5 < правое поддерево 6, 7 — это по-прежнему двоичное дерево поиска.',
  },
};

const removeSources = classSources(BST_PY, BST_JAVA, 'BinarySearchTree', ['remove'], {
  python: {
    find: ['if cur.val == num:'],
    check: ['if cur.left is None or cur.right is None:'],
    cut: ['child = cur.left or cur.right', 'pre.left = child'],
    tmp: ['tmp: TreeNode = cur.right'],
    down: ['tmp = tmp.left'],
    recur: ['self.remove(tmp.val)'],
    copy: ['cur.val = tmp.val'],
  },
  java: {
    find: ['if (cur.val == num)'],
    check: ['if (cur.left == null || cur.right == null)'],
    cut: ['TreeNode child = cur.left != null ? cur.left : cur.right;', 'pre.left = child;'],
    tmp: ['TreeNode tmp = cur.right;'],
    down: ['tmp = tmp.left;'],
    recur: ['remove(tmp.val);'],
    copy: ['cur.val = tmp.val;'],
  },
});

const REMOVE_TONES = { find: 'cmp', check: 'cmp', cut: 'done', tmp: 'cmp', down: 'cmp', recur: 'swp', copy: 'done' } as const;

const removeLeaf: StepFigure = {
  type: 'steps',
  call: 'remove(1)',
  tones: REMOVE_TONES,
  build(l) {
    const root = bst15();
    const path = ['n8', 'n4', 'n2', 'n1'];
    const target = numChip(1);
    const sc = (nodes: SceneNode[]) => ({ w: W, h: BST_H, nodes });
    const frames: SceneFrame[] = [
      { kind: 'find', scene: sc(bstNodes({ root, path, cur: 'n1', pre: 'n2', target })), say: fmt(REMOVE_SAY.find[l], { v: 1, p: 2 }) },
      { kind: 'check', scene: sc(bstNodes({ root, path, cur: 'n1', pre: 'n2', tones: { n1: 'danger' }, chip: 'child = None', target })), say: fmt(REMOVE_SAY.leaf[l], { v: 1 }) },
      { kind: 'cut', scene: sc(bstNodes({ root: replace(root, 'n1', null)!, path: path.slice(0, 3), pre: 'n2', chip: 'pre.left = None', target })), say: REMOVE_SAY.cutLeaf[l] },
    ];
    return { frames, legend: [legendCircle('accent', 'cur'), legendCircle('info', WORD.path[l])] };
  },
  sources: removeSources,
};

const removeOneChild: StepFigure = {
  type: 'steps',
  call: 'remove(2)',
  tones: REMOVE_TONES,
  build(l) {
    const root = treeFromLevels([8, 4, 12, 2, 6, 10, 14, null, 3, 5, 7, 9, 11, 13, 15])!;
    const path = ['n8', 'n4', 'n2'];
    const target = numChip(2);
    const sc = (nodes: SceneNode[]) => ({ w: W, h: BST_H, nodes });
    const after = replace(root, 'n2', find(root, 'n3'))!;
    const frames: SceneFrame[] = [
      { kind: 'find', scene: sc(bstNodes({ root, path, cur: 'n2', pre: 'n4', target })), say: fmt(REMOVE_SAY.find[l], { v: 2, p: 4 }) },
      {
        kind: 'check',
        scene: sc(bstNodes({ root, path, cur: 'n2', pre: 'n4', tones: { n2: 'danger', n3: 'warn' }, labels: [['n3', 'child', 'warn']], edges: { n3: 'warn' }, chip: 'child = cur.right', target })),
        say: fmt(REMOVE_SAY.one[l], { v: 2, c: 3 }),
      },
      {
        kind: 'cut',
        scene: sc(bstNodes({ root: after, path: ['n8', 'n4', 'n3'], pre: 'n4', tones: { n3: 'warn' }, rings: ['n3'], labels: [['n3', 'child', 'warn']], edges: { n3: 'warn' }, chip: 'pre.left = child', target })),
        say: fmt(REMOVE_SAY.cutOne[l], { v: 2, c: 3 }),
      },
    ];
    return { frames, legend: [legendCircle('accent', 'cur'), legendCircle('warn', 'child')] };
  },
  sources: removeSources,
};

const removeTwoChildren: StepFigure = {
  type: 'steps',
  call: 'remove(4)',
  tones: REMOVE_TONES,
  build(l) {
    const root = treeFromLevels([8, 4, 12, 3, 6, 10, 14, null, null, 5, 7, 9, 11, 13, 15])!;
    const target = numChip(4);
    const path = ['n8', 'n4'];
    const sc = (nodes: SceneNode[]) => ({ w: W, h: BST_H, nodes });
    const cut = replace(root, 'n5', null)!;
    // 5 is cut off but its value is still needed: draw it loose where it was.
    const old5 = drawTree('', root, BL).boxes.get('n5')!;
    const float5 = loose(old5, 'warn', true);
    const copied = replace(cut, 'n4', { ...find(cut, 'n4')!, id: 'n5', v: 5 })!;
    const frames: SceneFrame[] = [
      { kind: 'find', scene: sc(bstNodes({ root, path, cur: 'n4', target })), say: REMOVE_SAY.two[l] },
      {
        kind: 'tmp',
        scene: sc(bstNodes({ root, path, cur: 'n4', tones: { n6: 'warn' }, labels: [['n6', 'tmp', 'warn']], edges: { n6: 'warn' }, chip: 'tmp = cur.right', target })),
        say: REMOVE_SAY.tmp[l],
      },
      {
        kind: 'down',
        scene: sc(bstNodes({ root, path, cur: 'n4', tones: { n5: 'warn' }, rings: ['n5'], labels: [['n5', 'tmp', 'warn']], edges: { n6: 'warn', n5: 'warn' }, chip: 'tmp = tmp.left', target })),
        say: REMOVE_SAY.down[l],
      },
      {
        kind: 'recur',
        scene: sc(bstNodes({ root: cut, path, cur: 'n4', chip: 'remove(tmp.val)', target, extra: [float5, under('p:tmp', float5, 'tmp', 'warn')] })),
        say: REMOVE_SAY.recur[l],
      },
      {
        kind: 'copy',
        scene: sc(bstNodes({ root: copied, path: ['n8', 'n5'], cur: 'n5', chip: 'cur.val = tmp.val', target })),
        say: REMOVE_SAY.copy[l],
      },
    ];
    return { frames, legend: [legendCircle('accent', 'cur'), legendCircle('warn', 'tmp')] };
  },
  sources: removeSources,
};

// Inorder traversal.

const INORDER_SAY: Record<'init' | 'visit' | 'done', T> = {
  init: {
    en: 'Inorder traversal visits the nodes in the order left subtree → root → right subtree.',
    zh: '中序遍历按照“左子树 → 根节点 → 右子树”的顺序访问节点。',
    'zh-hant': '中序走訪按照“左子樹 → 根節點 → 右子樹”的順序訪問節點。',
    ja: '中順走査は「左部分木 → 根ノード → 右部分木」の順にノードを訪れます。',
    ru: 'Симметричный обход посещает узлы в порядке «левое поддерево → корень → правое поддерево».',
  },
  visit: {
    en: 'Visit {v}: its left subtree is already done, so every smaller value is already in the sequence.',
    zh: '访问 {v}：它的左子树已遍历完毕，所有更小的值都已在序列中。',
    'zh-hant': '訪問 {v}：它的左子樹已走訪完畢，所有更小的值都已在序列中。',
    ja: '{v} を訪れます。左部分木は走査済みなので、より小さい値はすべて列に入っています。',
    ru: 'Посещаем {v}: его левое поддерево уже пройдено, все меньшие значения уже в последовательности.',
  },
  done: {
    en: 'The inorder sequence is ascending, so sorted data comes out of a binary search tree in O(n) time.',
    zh: '中序遍历序列是升序的，因此从二叉搜索树中获取有序数据仅需 O(n) 时间。',
    'zh-hant': '中序走訪序列是升序的，因此從二元搜尋樹中獲取有序資料僅需 O(n) 時間。',
    ja: '中順走査列は昇順なので、二分探索木から整列済みデータを O(n) 時間で取り出せます。',
    ru: 'Последовательность симметричного обхода возрастает, поэтому отсортированные данные получаются за O(n).',
  },
};

const bstInorder: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', visit: 'cmp', done: 'done' },
  build(l) {
    const root = treeFromLevels([8, 4, 12, 2, 6, 10, 14])!;
    const order = [2, 4, 6, 8, 10, 12, 14];
    const lay: Lay = { left: 20, width: 400, top: 34, gap: 60, r: 18 };
    const x0 = (W - (7 * 40 + 6 * 6)) / 2;
    const scene = (count: number, done: boolean) => {
      const cur = !done && count > 0 ? `n${order[count - 1]}` : null;
      const seen = new Set(order.slice(0, count).map((v) => `n${v}`));
      const painted = paint(root, (n) => ({ tone: n.id === cur ? 'accent' : seen.has(n.id) ? (done ? 'ok' : 'info') : undefined, ring: n.id === cur || undefined }));
      const { nodes } = drawTree('', painted, lay);
      nodes.push(
        text('seq', W / 2, 202, WORD.seq[l], { anchor: 'middle', size: 12, tone: 'muted' }),
        ...cells(
          's',
          x0,
          212,
          order.map((v, i) => ({ id: `s${i}`, value: i < count ? v : null, tone: i < count ? (i === count - 1 && !done ? 'accent' : done ? 'ok' : 'info') : undefined })),
        ),
      );
      return { w: W, h: 258, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(0, false), say: INORDER_SAY.init[l] }];
    order.forEach((v, i) => frames.push({ kind: 'visit', scene: scene(i + 1, false), say: fmt(INORDER_SAY.visit[l], { v }) }));
    frames.push({ kind: 'done', scene: scene(7, true), say: INORDER_SAY.done[l] });
    return { frames };
  },
};

// Degradation.

const bstDegradation: StaticFigure = {
  type: 'static',
  build(l) {
    const bal = reid(treeFromLevels([4, 2, 6, 1, 3, 5, 7]), 'b');
    const { nodes } = drawTree('b', bal, { left: 14, width: 190, top: 90, gap: 66, r: 17 });
    nodes.unshift(region('rb', 4, 30, 210, 270, { tone: 'ok', label: WORD.bal[l] }), region('rd', 226, 30, 210, 270, { tone: 'danger', label: WORD.deg[l] }));
    // The same values inserted in descending order: every node has only a left child.
    const chain = [7, 6, 5, 4, 3, 2, 1].map((v, i) => box(`d${v}`, 400 - i * 24 - 15, 62 + i * 36 - 15, v, { w: 30, h: 30, shape: 'circle', tone: 'ok', size: 13 }));
    chain.forEach((c, i) => {
      if (i) nodes.push(link(`de${i}`, chain[i - 1], c, { pad: 2, width: 1.5 }));
    });
    nodes.push(...chain, chip('cb', 109, 262, 'O(log n)', { tone: 'ok' }), chip('cd', 384, 262, 'O(n)', { tone: 'danger' }));
    return {
      scene: { w: W, h: 304, nodes },
      notes: [
        {
          en: 'The same values 1–7. Search in the balanced tree takes O(log n) steps; the degenerate one is really a linked list, so search takes O(n).',
          zh: '同样是 1～7 这些值。在平衡的树中查找需要 O(log n) 步；退化的树实际上是链表，查找需要 O(n)。',
          'zh-hant': '同樣是 1～7 這些值。在平衡的樹中查詢需要 O(log n) 步；退化的樹實際上是鏈結串列，查詢需要 O(n)。',
          ja: '同じ 1〜7 の値です。平衡な木での探索は O(log n) ですが、退化した木は実質的に連結リストなので探索に O(n) かかります。',
          ru: 'Одни и те же значения 1–7. Поиск в сбалансированном дереве занимает O(log n), а вырожденное дерево по сути связный список, и поиск занимает O(n).',
        }[l],
      ],
    };
  },
};

// ── AVL trees ─────────────────────────────────────────────────────────

const AL: Lay = { left: 40, width: 360, top: 40, gap: 60, r: 18 };
const AVL_H = 262;

interface AvlView {
  tones?: Record<string, Tone>;
  rings?: string[];
  /** Context outside the subtree being fixed, drawn gray. */
  muted?: string[];
  /** Pointer names beside nodes: [node id, name, tone]. */
  labels?: [string, string, Tone][];
  /** Nodes whose balance factor is not shown (stale during a rotation). */
  hideBf?: string[];
  /** Dashed `None` spots drawn under a node, which its balance factor label should also avoid. */
  spots?: Record<string, 'l' | 'r'>;
  lay?: Lay;
}

/** A tree with each node's balance factor underneath; unbalanced ones in red. */
function avlNodes(root: N, o: AvlView = {}) {
  const muted = new Set(o.muted ?? []);
  const lay = o.lay ?? AL;
  const painted = paint(root, (n) => ({ tone: o.tones?.[n.id] ?? (muted.has(n.id) ? 'muted' : undefined), ring: o.rings?.includes(n.id) || undefined }));
  const { nodes, boxes } = drawTree('', painted, lay);
  const bfs = balance(root);
  const walk = treeWalk(root);
  for (const { node } of walk) {
    if (o.hideBf?.includes(node.id)) continue;
    const b = boxes.get(node.id)!;
    const f = bfs.get(node.id)!;
    const bad = Math.abs(f) > 1;
    // Under the node, nudged away from a single child's edge.
    const hasL = Boolean(node.l) || o.spots?.[node.id] === 'l';
    const hasR = Boolean(node.r) || o.spots?.[node.id] === 'r';
    const shift = hasL && !hasR ? 1 : hasR && !hasL ? -1 : 0;
    nodes.push(
      text(`bf:${node.id}`, b.x + b.w / 2 + shift * 6, b.y + b.h + 13, sgn(f), {
        anchor: shift > 0 ? 'start' : shift < 0 ? 'end' : 'middle',
        mono: true,
        size: 11,
        bold: bad,
        tone: bad ? 'danger' : 'muted',
      }),
    );
  }
  for (const [id, label, tone] of o.labels ?? []) {
    const b = boxes.get(id);
    const w = walk.find((x) => x.node.id === id);
    if (!b || !w) continue;
    nodes.push(beside(`p:${label}`, b, label, tone, w.parent?.r?.id === id ? 'right' : 'left'));
  }
  return { nodes, boxes, walk };
}

const AVL_LEGEND = (l: Locale): LegendItem[] => [legendCircle('danger', WORD.unbalanced[l]), legendCircle('accent', 'child')];

// Degradation of a plain binary search tree.

const DEGRADE_SAY: Record<'ins0' | 'ins1' | 'ins2' | 'rm0' | 'rm1' | 'rm2', T> = {
  ins0: {
    en: 'A perfect binary tree. The number under each node is its balance factor: left subtree height minus right subtree height.',
    zh: '一棵完美二叉树。节点下方的数字是平衡因子：左子树高度减去右子树高度。',
    'zh-hant': '一棵完美二元樹。節點下方的數字是平衡因子：左子樹高度減去右子樹高度。',
    ja: '充足二分木です。ノードの下の数字は平衡係数（左部分木の高さ − 右部分木の高さ）です。',
    ru: 'Идеальное двоичное дерево. Число под узлом — баланс-фактор: высота левого поддерева минус высота правого.',
  },
  ins1: {
    en: 'Insert 2. Every balance factor is still between −1 and 1, so the tree stays balanced.',
    zh: '插入节点 2。所有平衡因子仍在 −1 到 1 之间，树仍然平衡。',
    'zh-hant': '插入節點 2。所有平衡因子仍在 −1 到 1 之間，樹仍然平衡。',
    ja: 'ノード 2 を挿入します。平衡係数はすべて −1〜1 の範囲なので、木は平衡のままです。',
    ru: 'Вставляем узел 2. Все баланс-факторы по-прежнему от −1 до 1, дерево сбалансировано.',
  },
  ins2: {
    en: 'Insert 1. Nodes 3 and 4 now have balance factor 2: the tree leans to the left and is unbalanced.',
    zh: '插入节点 1。节点 3 和 4 的平衡因子变为 2：树向左倾斜，失去平衡。',
    'zh-hant': '插入節點 1。節點 3 和 4 的平衡因子變為 2：樹向左傾斜，失去平衡。',
    ja: 'ノード 1 を挿入します。ノード 3 と 4 の平衡係数が 2 になり、木は左に傾いて不平衡になります。',
    ru: 'Вставляем узел 1. У узлов 3 и 4 баланс-фактор стал 2: дерево наклонилось влево и разбалансировано.',
  },
  rm0: {
    en: 'A balanced binary tree. The number under each node is its balance factor.',
    zh: '一棵平衡二叉树。节点下方的数字是平衡因子。',
    'zh-hant': '一棵平衡二元樹。節點下方的數字是平衡因子。',
    ja: '平衡二分木です。ノードの下の数字は平衡係数です。',
    ru: 'Сбалансированное двоичное дерево. Число под узлом — баланс-фактор.',
  },
  rm1: {
    en: 'Remove 5. The root 4 now has balance factor 2: the tree is unbalanced.',
    zh: '删除节点 5。根节点 4 的平衡因子变为 2，树失去平衡。',
    'zh-hant': '刪除節點 5。根節點 4 的平衡因子變為 2，樹失去平衡。',
    ja: 'ノード 5 を削除します。根ノード 4 の平衡係数が 2 になり、木は不平衡になります。',
    ru: 'Удаляем узел 5. У корня 4 баланс-фактор стал 2: дерево разбалансировано.',
  },
  rm2: {
    en: 'Remove 3. Every node has only a left child: the tree has degenerated into a linked list.',
    zh: '删除节点 3。每个节点只剩左子节点，树退化为链表。',
    'zh-hant': '刪除節點 3。每個節點只剩左子節點，樹退化為鏈結串列。',
    ja: 'ノード 3 を削除します。どのノードも左の子ノードしか持たず、木は連結リストに退化します。',
    ru: 'Удаляем узел 3. У каждого узла остался только левый дочерний узел: дерево выродилось в связный список.',
  },
};

const DL: Lay = { left: 60, width: 320, top: 58, gap: 56, r: 18 };

/** A tree under a title, with balance factors; nodes with |bf| > 1 in red. */
function degradeScene(root: N, title: string, fresh: string | null) {
  const bfs = balance(root);
  const tones: Record<string, Tone> = {};
  for (const [id, f] of bfs) if (Math.abs(f) > 1) tones[id] = 'danger';
  if (fresh) tones[fresh] = 'accent';
  const { nodes } = avlNodes(root, { tones, rings: fresh ? [fresh] : [], lay: DL });
  nodes.push(text('title', W / 2, 24, title, { anchor: 'middle', bold: true, size: 14 }));
  return { w: W, h: 268, nodes };
}

const avlDegradeInsert: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', insert: 'cmp', unbalanced: 'swp' },
  build(l) {
    const frames: SceneFrame[] = [
      { kind: 'init', scene: degradeScene(nd(4, nd(3), nd(5)), TITLE.perfect[l], null), say: DEGRADE_SAY.ins0[l] },
      { kind: 'insert', scene: degradeScene(nd(4, nd(3, nd(2)), nd(5)), TITLE.balanced[l], 'n2'), say: DEGRADE_SAY.ins1[l], call: 'insert(2)' },
      { kind: 'unbalanced', scene: degradeScene(nd(4, nd(3, nd(2, nd(1))), nd(5)), TITLE.unbalanced[l], 'n1'), say: DEGRADE_SAY.ins2[l], call: 'insert(1)' },
    ];
    return { frames, legend: [legendCircle('danger', WORD.unbalanced[l])] };
  },
};

const avlDegradeRemove: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', unbalanced: 'swp', list: 'swp' },
  build(l) {
    const frames: SceneFrame[] = [
      { kind: 'init', scene: degradeScene(nd(4, nd(2, nd(1), nd(3)), nd(5)), TITLE.balanced[l], null), say: DEGRADE_SAY.rm0[l] },
      { kind: 'unbalanced', scene: degradeScene(nd(4, nd(2, nd(1), nd(3))), TITLE.unbalanced[l], null), say: DEGRADE_SAY.rm1[l], call: 'remove(5)' },
      { kind: 'list', scene: degradeScene(nd(4, nd(2, nd(1))), TITLE.list[l], null), say: DEGRADE_SAY.rm2[l], call: 'remove(3)' },
    ];
    return { frames, legend: [legendCircle('danger', WORD.unbalanced[l])] };
  },
};

// Single rotations.

const TURN: Record<'right' | 'left', T> = {
  right: { en: 'right', zh: '右', 'zh-hant': '右', ja: '右', ru: 'вправо' },
  left: { en: 'left', zh: '左', 'zh-hant': '左', ja: '左', ru: 'влево' },
};

const ROT_SAY: Record<'init' | 'child' | 'grand' | 'grandNone' | 'rotate' | 'loose' | 'graft' | 'graftNone' | 'height' | 'done', T> = {
  init: {
    en: 'Balance factors are under the nodes. Going bottom-up, the first unbalanced node is {node} (balance factor {bf}); call it node.',
    zh: '节点下方为平衡因子。自底向上，第一个失衡节点是 {node}（平衡因子为 {bf}），记为 node。',
    'zh-hant': '節點下方為平衡因子。自底向上，第一個失衡節點是 {node}（平衡因子為 {bf}），記為 node。',
    ja: 'ノードの下は平衡係数です。下から上へ見て最初の不平衡ノードは {node}（平衡係数 {bf}）で、これを node とします。',
    ru: 'Под узлами — баланс-факторы. Снизу вверх первый разбалансированный узел — {node} (баланс-фактор {bf}); обозначим его node.',
  },
  child: {
    en: '{code}: child is {child}, the pivot of the rotation.',
    zh: '{code}：child 为 {child}，旋转将以它为原点。',
    'zh-hant': '{code}：child 為 {child}，旋轉將以它為原點。',
    ja: '{code}：child は {child} で、回転の支点になります。',
    ru: '{code}: child — узел {child}, вокруг него выполняется вращение.',
  },
  grand: {
    en: '{code}: grand_child is {grand}. It will change parent during the rotation.',
    zh: '{code}：grand_child 为 {grand}，旋转时它需要更换父节点。',
    'zh-hant': '{code}：grand_child 為 {grand}，旋轉時它需要更換父節點。',
    ja: '{code}：grand_child は {grand} です。回転のときに親ノードが変わります。',
    ru: '{code}: grand_child — узел {grand}; при вращении у него сменится родитель.',
  },
  grandNone: {
    en: '{code}: {child} has no child on that side, so grand_child is None.',
    zh: '{code}：{child} 在这一侧没有子节点，grand_child 为 None。',
    'zh-hant': '{code}：{child} 在這一側沒有子節點，grand_child 為 None。',
    ja: '{code}：{child} にはその側の子ノードがないので、grand_child は None です。',
    ru: '{code}: у {child} нет дочернего узла с этой стороны, поэтому grand_child = None.',
  },
  rotate: {
    en: '{code}: with child as the pivot, node {node} turns {turn} and goes down under {child}.',
    zh: '{code}：以 child 为原点，将 node（{node}）向{turn}旋转，使其成为 {child} 的子节点。',
    'zh-hant': '{code}：以 child 為原點，將 node（{node}）向{turn}旋轉，使其成為 {child} 的子節點。',
    ja: '{code}：child を支点として node（{node}）を{turn}回転させ、{child} の子ノードにします。',
    ru: '{code}: node ({node}) поворачивается {turn} вокруг child и становится дочерним узлом {child}.',
  },
  loose: {
    en: ' For now {grand} hangs loose.',
    zh: '{grand} 暂时脱离。',
    'zh-hant': '{grand} 暫時脫離。',
    ja: '{grand} はいったん切り離されます。',
    ru: ' Узел {grand} пока отсоединен.',
  },
  graft: {
    en: '{code}: grand_child {grand} becomes a child of node {node}. The order {lo} < {grand} < {hi} is kept.',
    zh: '{code}：grand_child（{grand}）成为 node（{node}）的子节点，大小关系 {lo} < {grand} < {hi} 保持不变。',
    'zh-hant': '{code}：grand_child（{grand}）成為 node（{node}）的子節點，大小關係 {lo} < {grand} < {hi} 保持不變。',
    ja: '{code}：grand_child（{grand}）が node（{node}）の子ノードになり、大小関係 {lo} < {grand} < {hi} は保たれます。',
    ru: '{code}: grand_child ({grand}) становится дочерним узлом node ({node}); порядок {lo} < {grand} < {hi} сохраняется.',
  },
  graftNone: {
    en: '{code}: grand_child is None, so that side of node {node} is now empty.',
    zh: '{code}：grand_child 为 None，node（{node}）的这一侧变为空。',
    'zh-hant': '{code}：grand_child 為 None，node（{node}）的這一側變為空。',
    ja: '{code}：grand_child は None なので、node（{node}）のその側は空になります。',
    ru: '{code}: grand_child = None, поэтому эта сторона node ({node}) теперь пуста.',
  },
  height: {
    en: 'Update the heights of node, then child: node is now the lower one, so it goes first. The balance factors are recomputed.',
    zh: '先更新 node 的高度，再更新 child 的高度：node 现在位于下方，所以先更新。平衡因子随之重新计算。',
    'zh-hant': '先更新 node 的高度，再更新 child 的高度：node 現在位於下方，所以先更新。平衡因子隨之重新計算。',
    ja: 'node、child の順に高さを更新します。node のほうが下にあるので先に更新します。平衡係数も再計算されます。',
    ru: 'Сначала обновляем высоту node, затем child: node теперь ниже, поэтому идет первым. Баланс-факторы пересчитаны.',
  },
  done: {
    en: 'return child: {child} takes the old place of node. The subtree is balanced again and is still a binary search tree.',
    zh: '返回 child：{child} 取代 node 原来的位置。子树重新恢复平衡，并且仍是二叉搜索树。',
    'zh-hant': '回傳 child：{child} 取代 node 原來的位置。子樹重新恢復平衡，並且仍是二元搜尋樹。',
    ja: 'child を返します：{child} が node のもとの位置に入ります。部分木は平衡を回復し、二分探索木のままです。',
    ru: 'return child: {child} занимает прежнее место node. Поддерево снова сбалансировано и остается двоичным деревом поиска.',
  },
};

const ROT_CODE = {
  right: { child: 'child = node.left', grand: 'grand_child = child.right', rotate: 'child.right = node', graft: 'node.left = grand_child' },
  left: { child: 'child = node.right', grand: 'grand_child = child.left', rotate: 'child.left = node', graft: 'node.right = grand_child' },
};

/** Single rotation at `node`, step by step as `right_rotate` / `left_rotate` does it. */
function rotationFigure(root: N, nodeId: string, dir: 'right' | 'left'): StepFigure {
  const right = dir === 'right';
  return {
    type: 'steps',
    tones: { init: 'idle', child: 'cmp', grand: 'cmp', rotate: 'swp', graft: 'swp', height: 'cmp', done: 'done' },
    build(l) {
      const n0 = find(root, nodeId)!;
      const ch = (right ? n0.l : n0.r)!;
      const g = (right ? ch.r : ch.l) ?? null;
      const inside = new Set(subtree(n0));
      const muted = subtree(root).filter((id) => !inside.has(id));
      const above = muted.filter((id) => subtree(find(root, id)).includes(nodeId));
      // Mid-rotation: node is under child, grand_child not yet re-attached.
      const mid = replace(root, nodeId, right ? { ...ch, r: { ...n0, l: null } } : { ...ch, l: { ...n0, r: null } })!;
      const after = replace(root, nodeId, rotated(n0, dir))!;
      const code = ROT_CODE[dir];
      const vars = { node: Number(n0.v), child: Number(ch.v), grand: g ? Number(g.v) : '', bf: sgn(balance(root).get(nodeId)!), turn: TURN[dir][l] };
      const sc = (nodes: SceneNode[]) => ({ w: W, h: AVL_H, nodes });
      const tones = (k: number, nodeTone: Tone = 'danger'): Record<string, Tone> => ({
        [nodeId]: nodeTone,
        ...(k >= 1 ? { [ch.id]: 'accent' as Tone } : {}),
        ...(k >= 2 && g ? { [g.id]: 'info' as Tone } : {}),
      });
      const lbl = (k: number): [string, string, Tone][] => [
        [nodeId, 'node', 'danger'],
        ...(k >= 1 ? [[ch.id, 'child', 'accent'] as [string, string, Tone]] : []),
        ...(k >= 2 && g ? [[g.id, 'grand_child', 'info'] as [string, string, Tone]] : []),
      ];
      const stale = [nodeId, ch.id, ...above];

      const f0 = avlNodes(root, { tones: tones(0), rings: [nodeId], muted, labels: lbl(0) });
      const f1 = avlNodes(root, { tones: tones(1), rings: [nodeId], muted, labels: lbl(1) });
      const f2 = avlNodes(root, { tones: tones(2), rings: [nodeId], muted, labels: lbl(2) });
      if (!g) {
        // grand_child is None: show the empty spot on child's inner side.
        const w = f2.walk.find((x) => x.node.id === ch.id)!;
        const p = slotAt(AL, w.depth + 1, w.slot * 2 + (right ? 1 : 0));
        const spot = ghost('g1', p.x, p.y, AL.r);
        f2.nodes.push(spot, beside('p:grand_child', spot, 'grand_child', 'info', right ? 'right' : 'left'));
      }
      const f3 = avlNodes(mid, { tones: tones(2), muted, labels: lbl(1), hideBf: stale });
      if (g) {
        const b = loose(f0.boxes.get(g.id)!, 'info', true);
        f3.nodes.push(b, beside('p:grand_child', b, 'grand_child', 'info', right ? 'right' : 'left'));
      }
      const f4 = avlNodes(after, { tones: tones(2), muted, labels: lbl(2), hideBf: stale, spots: g ? {} : { [nodeId]: right ? 'l' : 'r' } });
      if (!g) {
        const w = f4.walk.find((x) => x.node.id === nodeId)!;
        const p = slotAt(AL, w.depth + 1, w.slot * 2 + (right ? 0 : 1));
        const spot = ghost('g2', p.x, p.y, AL.r);
        f4.nodes.push(spot, link('ge2', f4.boxes.get(nodeId)!, spot, { pad: 2, width: 1.5, dashed: true, tone: 'muted' }), beside('p:grand_child', spot, 'grand_child', 'info', right ? 'left' : 'right'));
      }
      const f5 = avlNodes(after, { tones: tones(2, 'warn'), muted, labels: lbl(2) });
      const f6 = avlNodes(after, { tones: tones(2, 'warn'), rings: [ch.id], muted, labels: lbl(1) });

      const [lo, hi] = right ? [vars.child, vars.node] : [vars.node, vars.child];
      const frames: SceneFrame[] = [
        { kind: 'init', scene: sc(f0.nodes), say: fmt(ROT_SAY.init[l], vars) },
        { kind: 'child', scene: sc(f1.nodes), say: fmt(ROT_SAY.child[l], { ...vars, code: code.child }) },
        { kind: 'grand', scene: sc(f2.nodes), say: fmt((g ? ROT_SAY.grand : ROT_SAY.grandNone)[l], { ...vars, code: code.grand }) },
        { kind: 'rotate', scene: sc(f3.nodes), say: fmt(ROT_SAY.rotate[l] + (g ? ROT_SAY.loose[l] : ''), { ...vars, code: code.rotate }) },
        { kind: 'graft', scene: sc(f4.nodes), say: fmt((g ? ROT_SAY.graft : ROT_SAY.graftNone)[l], { ...vars, code: code.graft, lo, hi }) },
        { kind: 'height', scene: sc(f5.nodes), say: ROT_SAY.height[l] },
        { kind: 'done', scene: sc(f6.nodes), say: fmt(ROT_SAY.done[l], vars) },
      ];
      return { frames, legend: [...AVL_LEGEND(l), legendCircle('info', 'grand_child')] };
    },
    sources: classSources(AVL_PY, AVL_JAVA, 'AVLTree', [right ? 'right_rotate' : 'left_rotate'], {
      python: {
        init: [right ? 'def right_rotate(' : 'def left_rotate('],
        child: [ROT_CODE[dir].child],
        grand: [ROT_CODE[dir].grand],
        rotate: [ROT_CODE[dir].rotate],
        graft: [ROT_CODE[dir].graft],
        height: ['self.update_height(node)', 'self.update_height(child)'],
        done: ['return child'],
      },
      java: {
        init: [right ? 'private TreeNode rightRotate(' : 'private TreeNode leftRotate('],
        child: [right ? 'TreeNode child = node.left;' : 'TreeNode child = node.right;'],
        grand: [right ? 'TreeNode grandChild = child.right;' : 'TreeNode grandChild = child.left;'],
        rotate: [right ? 'child.right = node;' : 'child.left = node;'],
        graft: [right ? 'node.left = grandChild;' : 'node.right = grandChild;'],
        height: ['updateHeight(node);', 'updateHeight(child);'],
        done: ['return child;'],
      },
    }),
  };
}

// Double rotations.

const ROT_NAME: Record<'right' | 'left' | 'lr' | 'rl', T> = {
  right: { en: 'Right rotation', zh: '右旋', 'zh-hant': '右旋', ja: '右回転', ru: 'Правое вращение' },
  left: { en: 'Left rotation', zh: '左旋', 'zh-hant': '左旋', ja: '左回転', ru: 'Левое вращение' },
  lr: { en: 'Left-right rotation', zh: '先左旋后右旋', 'zh-hant': '先左旋後右旋', ja: '左回転してから右回転', ru: 'Сначала левое, затем правое' },
  rl: { en: 'Right-left rotation', zh: '先右旋后左旋', 'zh-hant': '先右旋後左旋', ja: '右回転してから左回転', ru: 'Сначала правое, затем левое' },
};

/** "a left rotation" in running text. */
const ROT_DO: Record<'right' | 'left', T> = {
  right: { en: 'right', zh: '右旋', 'zh-hant': '右旋', ja: '右回転', ru: 'правое вращение' },
  left: { en: 'left', zh: '左旋', 'zh-hant': '左旋', ja: '左回転', ru: 'левое вращение' },
};

const DOUBLE_SAY: Record<'init' | 'first' | 'second' | 'done', T> = {
  init: {
    en: 'Node {node} is unbalanced (balance factor {bf}), but its child {child} leans the other way ({cbf}). A single rotation cannot fix this.',
    zh: '节点 {node} 失衡（平衡因子为 {bf}），而子节点 {child} 向另一侧倾斜（{cbf}）。仅靠一次旋转无法恢复平衡。',
    'zh-hant': '節點 {node} 失衡（平衡因子為 {bf}），而子節點 {child} 向另一側傾斜（{cbf}）。僅靠一次旋轉無法恢復平衡。',
    ja: 'ノード {node} は不平衡（平衡係数 {bf}）ですが、子ノード {child} は逆側に傾いています（{cbf}）。1 回の回転では平衡に戻せません。',
    ru: 'Узел {node} разбалансирован (баланс-фактор {bf}), а его дочерний узел {child} наклонен в другую сторону ({cbf}). Одного вращения недостаточно.',
  },
  first: {
    en: 'First rotate child {child} to the {r1}: {grand} moves up into its place, and now the subtree leans one way only.',
    zh: '先对 child（{child}）执行{r1}：{grand} 上移到它的位置，现在子树只向一侧倾斜。',
    'zh-hant': '先對 child（{child}）執行{r1}：{grand} 上移到它的位置，現在子樹只向一側傾斜。',
    ja: 'まず child（{child}）を{r1}します。{grand} がその位置に上がり、部分木は一方向だけに傾きます。',
    ru: 'Сначала выполняем {r1} для child ({child}): {grand} поднимается на его место, теперь поддерево наклонено в одну сторону.',
  },
  second: {
    en: 'Then rotate node {node} to the {r2}: {grand} becomes the root of the subtree, with {child} and {node} as its children.',
    zh: '再对 node（{node}）执行{r2}：{grand} 成为子树的根节点，{child} 和 {node} 是它的子节点。',
    'zh-hant': '再對 node（{node}）執行{r2}：{grand} 成為子樹的根節點，{child} 和 {node} 是它的子節點。',
    ja: '次に node（{node}）を{r2}します。{grand} が部分木の根ノードになり、{child} と {node} がその子ノードになります。',
    ru: 'Затем выполняем {r2} для node ({node}): {grand} становится корнем поддерева, а {child} и {node} — его дочерними узлами.',
  },
  done: {
    en: 'Balanced again: every balance factor is between −1 and 1, and the inorder sequence is unchanged.',
    zh: '恢复平衡：所有平衡因子都在 −1 到 1 之间，中序遍历序列保持不变。',
    'zh-hant': '恢復平衡：所有平衡因子都在 −1 到 1 之間，中序走訪序列保持不變。',
    ja: '平衡が回復しました。平衡係数はすべて −1〜1 で、中順走査列は変わりません。',
    ru: 'Баланс восстановлен: все баланс-факторы от −1 до 1, а последовательность симметричного обхода не изменилась.',
  },
};

/** Two rotations: first at child (`first`), then at node (the other way). */
function doubleFigure(root: N, nodeId: string, first: 'right' | 'left'): StepFigure {
  const second = first === 'left' ? 'right' : 'left';
  const lr = first === 'left';
  return {
    type: 'steps',
    tones: { init: 'idle', first: 'cmp', second: 'swp', done: 'done' },
    build(l) {
      const n0 = find(root, nodeId)!;
      const ch = (lr ? n0.l : n0.r)!;
      const g = (lr ? ch.r : ch.l)!;
      const inside = new Set(subtree(n0));
      const muted = subtree(root).filter((id) => !inside.has(id));
      const t1 = replace(root, ch.id, rotated(ch, first))!;
      const t2 = replace(t1, nodeId, rotated(find(t1, nodeId)!, second))!;
      const bfs = balance(root);
      const vars = { node: Number(n0.v), child: Number(ch.v), grand: Number(g.v), bf: sgn(bfs.get(nodeId)!), cbf: sgn(bfs.get(ch.id)!), r1: ROT_DO[first][l], r2: ROT_DO[second][l] };
      const labels: [string, string, Tone][] = [
        [nodeId, 'node', 'danger'],
        [ch.id, 'child', 'accent'],
      ];
      const tones = (nodeTone: Tone, gTone: Tone = 'ok'): Record<string, Tone> => ({ [nodeId]: nodeTone, [ch.id]: 'accent', [g.id]: gTone });
      const sc = (t: N, o: AvlView) => ({ w: W, h: AVL_H, nodes: avlNodes(t, { muted, labels, ...o }).nodes });
      const frames: SceneFrame[] = [
        { kind: 'init', scene: sc(root, { tones: tones('danger'), rings: [nodeId] }), say: fmt(DOUBLE_SAY.init[l], vars) },
        { kind: 'first', scene: sc(t1, { tones: tones('danger'), rings: [nodeId] }), say: fmt(DOUBLE_SAY.first[l], vars) },
        { kind: 'second', scene: sc(t2, { tones: tones('warn') }), say: fmt(DOUBLE_SAY.second[l], vars) },
        { kind: 'done', scene: sc(t2, { tones: tones('warn'), rings: [g.id] }), say: DOUBLE_SAY.done[l] },
      ];
      return { frames, legend: [...AVL_LEGEND(l), legendCircle('ok', 'child.' + (lr ? 'right' : 'left'))] };
    },
    sources: classSources(AVL_PY, AVL_JAVA, 'AVLTree', ['rotate'], {
      python: lr
        ? {
            init: ['if balance_factor > 1:', 'if self.balance_factor(node.left) >= 0:'],
            first: ['node.left = self.left_rotate(node.left)'],
            second: ['2|return self.right_rotate(node)'],
            done: ['2|return self.right_rotate(node)'],
          }
        : {
            init: ['elif balance_factor < -1:', 'if self.balance_factor(node.right) <= 0:'],
            first: ['node.right = self.right_rotate(node.right)'],
            second: ['2|return self.left_rotate(node)'],
            done: ['2|return self.left_rotate(node)'],
          },
      java: lr
        ? {
            init: ['if (balanceFactor > 1)', 'if (balanceFactor(node.left) >= 0)'],
            first: ['node.left = leftRotate(node.left);'],
            second: ['2|return rightRotate(node);'],
            done: ['2|return rightRotate(node);'],
          }
        : {
            init: ['if (balanceFactor < -1)', 'if (balanceFactor(node.right) <= 0)'],
            first: ['node.right = rightRotate(node.right);'],
            second: ['2|return leftRotate(node);'],
            done: ['2|return leftRotate(node);'],
          },
    }),
  };
}

// The four cases side by side.

const rotationCases: StaticFigure = {
  type: 'static',
  build(l) {
    const cw = 214;
    const chh = 200;
    const cases: { name: T; root: N; node: string; child: string; grand: string }[] = [
      { name: ROT_NAME.right, root: nd(4, nd(3, nd(1, nd(0))), nd(5)), node: 'n3', child: 'n1', grand: 'n0' },
      { name: ROT_NAME.lr, root: nd(4, nd(3, nd(1, null, nd(2))), nd(5)), node: 'n3', child: 'n1', grand: 'n2' },
      { name: ROT_NAME.left, root: nd(2, nd(1), nd(3, null, nd(5, null, nd(6)))), node: 'n3', child: 'n5', grand: 'n6' },
      { name: ROT_NAME.rl, root: nd(2, nd(1), nd(3, null, nd(5, nd(4)))), node: 'n3', child: 'n5', grand: 'n4' },
    ];
    const nodes: SceneNode[] = [];
    cases.forEach((c, k) => {
      const x = (k % 2) * (cw + 12);
      const y = Math.floor(k / 2) * (chh + 12);
      const p = `c${k}`;
      const inside = new Set(subtree(find(c.root, c.node)));
      const tones: Record<string, Tone> = { [c.node]: 'danger', [c.child]: 'accent', [c.grand]: 'ok' };
      const painted = reid(
        paint(c.root, (n) => ({ tone: tones[n.id] ?? (inside.has(n.id) ? undefined : 'muted') })),
        p,
      );
      const lay: Lay = { left: x + 12, width: cw - 24, top: y + 56, gap: 40, r: 14, size: 12 };
      const drawn = drawTree(p, painted, lay);
      const bfs = balance(c.root);
      nodes.push(region(`${p}r`, x, y, cw, chh, { tone: 'idle', label: c.name[l], labelAt: 'inside' }), ...drawn.nodes);
      for (const id of [c.node, c.child]) {
        const b = drawn.boxes.get(p + id)!;
        const f = bfs.get(id)!;
        const bad = Math.abs(f) > 1;
        // Beside the node, on the side away from its only child.
        const right = Boolean(find(c.root, id)!.l);
        nodes.push(text(`${p}bf${id}`, right ? b.x + b.w + 5 : b.x - 5, b.y + b.h / 2 + 4, sgn(f), { anchor: right ? 'start' : 'end', mono: true, size: 11, bold: bad, tone: bad ? 'danger' : 'muted' }));
      }
    });
    return {
      scene: { w: W, h: 2 * chh + 12, nodes },
      legend: AVL_LEGEND(l),
      notes: [
        {
          en: 'Numbers beside nodes are balance factors. If the child leans the same way as the unbalanced node (or not at all), one rotation is enough; if it leans the other way, two are needed.',
          zh: '节点旁的数字为平衡因子。若子节点与失衡节点向同一侧倾斜（或不倾斜），旋转一次即可；若向另一侧倾斜，则需要旋转两次。',
          'zh-hant': '節點旁的數字為平衡因子。若子節點與失衡節點向同一側傾斜（或不傾斜），旋轉一次即可；若向另一側傾斜，則需要旋轉兩次。',
          ja: 'ノードの横の数字は平衡係数です。子ノードが不平衡ノードと同じ側に傾いている（または傾いていない）なら回転は 1 回、逆側に傾いていれば 2 回必要です。',
          ru: 'Числа рядом с узлами — баланс-факторы. Если дочерний узел наклонен в ту же сторону, что и разбалансированный (или не наклонен), хватит одного вращения; если в другую — нужны два.',
        }[l],
      ],
    };
  },
};

export const SEARCH_FIGURES: Record<string, Figure> = {
  binary_search_tree: bstProperty,
  bst_search_steps: bstSearch,
  bst_insert: bstInsert,
  bst_remove_case1: removeLeaf,
  bst_remove_case2: removeOneChild,
  bst_remove_case3_steps: removeTwoChildren,
  bst_inorder_traversal: bstInorder,
  bst_degradation: bstDegradation,
  avltree_degradation_from_inserting_node: avlDegradeInsert,
  avltree_degradation_from_removing_node: avlDegradeRemove,
  avltree_right_rotate_steps: rotationFigure(nd(4, nd(3, nd(1, nd(0))), nd(5)), 'n3', 'right'),
  avltree_right_rotate_with_grandchild: rotationFigure(nd(5, nd(3, nd(1, nd(0)), nd(4)), nd(6)), 'n5', 'right'),
  avltree_left_rotate: rotationFigure(nd(1, nd(0), nd(4, null, nd(5, null, nd(6)))), 'n4', 'left'),
  avltree_left_rotate_with_grandchild: rotationFigure(nd(1, nd(0), nd(4, nd(3), nd(5, null, nd(6)))), 'n1', 'left'),
  avltree_left_right_rotate: doubleFigure(nd(4, nd(3, nd(1, null, nd(2))), nd(5)), 'n3', 'left'),
  avltree_right_left_rotate: doubleFigure(nd(2, nd(1), nd(3, null, nd(5, nd(4)))), 'n3', 'right'),
  avltree_rotation_cases: rotationCases,
};
