import heapJavaEn from '@codes-en/java/chapter_heap/my_heap.java?raw';
import topkJavaEn from '@codes-en/java/chapter_heap/top_k.java?raw';
import heapPyEn from '@codes-en/python/chapter_heap/my_heap.py?raw';
import topkPyEn from '@codes-en/python/chapter_heap/top_k.py?raw';
import heapJavaJa from '@codes-ja/java/chapter_heap/my_heap.java?raw';
import topkJavaJa from '@codes-ja/java/chapter_heap/top_k.java?raw';
import heapPyJa from '@codes-ja/python/chapter_heap/my_heap.py?raw';
import topkPyJa from '@codes-ja/python/chapter_heap/top_k.py?raw';
import heapJavaRu from '@codes-ru/java/chapter_heap/my_heap.java?raw';
import topkJavaRu from '@codes-ru/java/chapter_heap/top_k.java?raw';
import heapPyRu from '@codes-ru/python/chapter_heap/my_heap.py?raw';
import topkPyRu from '@codes-ru/python/chapter_heap/top_k.py?raw';
import heapJavaZh from '@codes-zh/java/chapter_heap/my_heap.java?raw';
import topkJavaZh from '@codes-zh/java/chapter_heap/top_k.java?raw';
import heapPyZh from '@codes-zh/python/chapter_heap/my_heap.py?raw';
import topkPyZh from '@codes-zh/python/chapter_heap/top_k.py?raw';
import heapJavaZhHant from '@codes-zh-hant/java/chapter_heap/my_heap.java?raw';
import topkJavaZhHant from '@codes-zh-hant/java/chapter_heap/top_k.java?raw';
import heapPyZhHant from '@codes-zh-hant/python/chapter_heap/my_heap.py?raw';
import topkPyZhHant from '@codes-zh-hant/python/chapter_heap/top_k.py?raw';
import { codeSources, type RawByLocale } from '../../algorithms/codes';
import { arrow, box, brace, cellX, cells, chip, indices, link, region, rowWidth, seg, tag, text } from '../kit';
import type { Figure, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

/** Chapter 8, heaps: min and max heaps, the array representation, push and pop, building a heap, top-k. */

const W = 440;

/** Python and Java sources of one class, with the methods to show and the lines for each step. */
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

const HEAP_PY = raw(heapPyEn, heapPyZh, heapPyZhHant, heapPyJa, heapPyRu);
const HEAP_JAVA = raw(heapJavaEn, heapJavaZh, heapJavaZhHant, heapJavaJa, heapJavaRu);
const TOPK_PY = raw(topkPyEn, topkPyZh, topkPyZhHant, topkPyJa, topkPyRu);
const TOPK_JAVA = raw(topkJavaEn, topkJavaZh, topkJavaZhHant, topkJavaJa, topkJavaRu);

const WORD: Record<
  'heapTop' | 'heapBottom' | 'minHeap' | 'maxHeap' | 'parent' | 'left' | 'right' | 'height' | 'nodes' | 'iters' | 'leaves' | 'largestK' | 'scanned',
  T
> = {
  heapTop: { en: 'heap top', zh: '堆顶', 'zh-hant': '堆積頂', ja: 'ヒープ頂点', ru: 'вершина кучи' },
  heapBottom: { en: 'heap bottom', zh: '堆底', 'zh-hant': '堆積底', ja: 'ヒープ底', ru: 'основание кучи' },
  minHeap: { en: 'min heap', zh: '小顶堆', 'zh-hant': '小頂堆積', ja: '最小ヒープ', ru: 'минимальная куча' },
  maxHeap: { en: 'max heap', zh: '大顶堆', 'zh-hant': '大頂堆積', ja: '最大ヒープ', ru: 'максимальная куча' },
  parent: { en: 'parent', zh: '父节点', 'zh-hant': '父節點', ja: '親ノード', ru: 'родитель' },
  left: { en: 'left child', zh: '左子节点', 'zh-hant': '左子節點', ja: '左子ノード', ru: 'левый дочерний' },
  right: { en: 'right child', zh: '右子节点', 'zh-hant': '右子節點', ja: '右子ノード', ru: 'правый дочерний' },
  height: { en: 'height', zh: '节点高度', 'zh-hant': '節點高度', ja: 'ノードの高さ', ru: 'высота' },
  nodes: { en: 'nodes', zh: '节点数量', 'zh-hant': '節點數量', ja: 'ノード数', ru: 'узлов' },
  iters: { en: 'iterations', zh: '迭代次数', 'zh-hant': '迭代次數', ja: '反復回数', ru: 'итераций' },
  leaves: { en: 'leaves have height 0', zh: '叶节点的高度为 0', 'zh-hant': '葉節點的高度為 0', ja: '葉ノードの高さは 0', ru: 'высота листьев — 0' },
  largestK: { en: 'largest k', zh: '最大的 k 个', 'zh-hant': '最大的 k 個', ja: '最大の k 個', ru: 'наибольшие k' },
  scanned: { en: 'scanned', zh: '遍历元素', 'zh-hant': '走訪元素', ja: '走査した要素', ru: 'просмотрено' },
};

// ── Drawing a heap ────────────────────────────────────────────────────

/** One heap element. `id` follows the value as it moves, so swaps animate. */
interface HNode {
  id: string;
  v: Rich | number;
  tone?: Tone;
  ring?: boolean;
  dim?: boolean;
}

interface TreeBox {
  left: number;
  width: number;
  top: number;
  gap: number;
  r: number;
  size?: number;
}

/** Center of array index `i` drawn as a complete binary tree: level d has 2^d evenly spaced slots. */
function slotXY(o: TreeBox, i: number) {
  let d = 0;
  while (2 ** (d + 1) - 1 <= i) d++;
  const s = i - (2 ** d - 1);
  return { cx: o.left + ((s + 0.5) * o.width) / 2 ** d, cy: o.top + d * o.gap };
}

/**
 * A heap drawn as a tree from its array. Circles are id'd by element (`prefix` + id), edges by
 * the child's index, so the shape stays put while swapped values glide between slots.
 */
function heapTree(prefix: string, items: HNode[], o: TreeBox, edgeTone: (i: number) => Tone | undefined = () => undefined) {
  const circles = items.map((it, i) => {
    const { cx, cy } = slotXY(o, i);
    return box(`${prefix}${it.id}`, cx - o.r, cy - o.r, it.v, {
      w: o.r * 2,
      h: o.r * 2,
      shape: 'circle',
      size: o.size ?? (o.r < 15 ? 12 : 14),
      tone: it.tone ?? 'ok',
      ring: it.ring,
      dim: it.dim,
    });
  });
  const edges = circles.slice(1).map((c, k) => link(`${prefix}e${k + 1}`, circles[Math.floor(k / 2)], c, { pad: 2, width: 1.5, tone: edgeTone(k + 1), dim: items[k + 1].dim }));
  return { nodes: [...edges, ...circles] as SceneNode[], circles };
}

/** The same heap as a row of array cells, id'd by element. */
const heapRow = (prefix: string, items: HNode[], x: number, y: number, w: number, gap: number, size = 13) =>
  cells(
    prefix,
    x,
    y,
    items.map((it) => ({ id: `${prefix}${it.id}`, value: it.v, tone: it.tone ?? 'idle', ring: it.ring, dim: it.dim })),
    { w, h: w, gap, size },
  );

/** `name = value` pairs in one chip, e.g. `i = 12   p = 5`. */
const vars = (id: string, x: number, y: number, pairs: [string, number | string, Tone?][]) =>
  chip(
    id,
    x,
    y,
    seg(...pairs.flatMap(([k, v, tone], n) => [`${n ? '   ' : ''}${k} = `, [String(v), tone ?? 'info', true] as [string, Tone, boolean]])),
    { align: 'start' },
  );

// ── Min heap and max heap ─────────────────────────────────────────────

const MINMAX: Record<'min' | 'max' | 'note', T> = {
  min: { en: 'node ≤ its children', zh: '任意节点 ≤ 其子节点', 'zh-hant': '任意節點 ≤ 其子節點', ja: '任意のノード ≤ 子ノード', ru: 'узел ≤ дочерних узлов' },
  max: { en: 'node ≥ its children', zh: '任意节点 ≥ 其子节点', 'zh-hant': '任意節點 ≥ 其子節點', ja: '任意のノード ≥ 子ノード', ru: 'узел ≥ дочерних узлов' },
  note: {
    en: 'Both are complete binary trees. The heap top (the root) is the smallest element of a min heap and the largest of a max heap.',
    zh: '两者都是完全二叉树。小顶堆的堆顶（根节点）是最小的元素，大顶堆的堆顶是最大的元素。',
    'zh-hant': '兩者都是完全二元樹。小頂堆積的堆積頂（根節點）是最小的元素，大頂堆積的堆積頂是最大的元素。',
    ja: 'どちらも完全二分木です。最小ヒープではヒープ頂点（根ノード）が最小の要素、最大ヒープでは最大の要素です。',
    ru: 'Обе кучи — полные двоичные деревья. Вершина (корень) минимальной кучи — наименьший элемент, максимальной — наибольший.',
  },
};

const minHeapAndMaxHeap: StaticFigure = {
  type: 'static',
  build(l) {
    const w = 460;
    const half = 222;
    const side = (key: 'min' | 'max', values: number[], left: number) => {
      const o: TreeBox = { left, width: half, top: 38, gap: 46, r: 12 };
      const items: HNode[] = values.map((v, i) => ({ id: String(i), v, tone: i === 0 ? 'accent' : 'ok' }));
      const t = heapTree(key, items, o);
      const root = t.circles[0];
      const mid = left + half / 2;
      return [
        ...t.nodes,
        text(`${key}:top`, root.x + root.w + 8, root.y + 16, WORD.heapTop[l], { size: 12, tone: 'accent' }),
        text(`${key}:title`, mid, 214, key === 'min' ? WORD.minHeap[l] : WORD.maxHeap[l], { anchor: 'middle', bold: true, size: 14, tone: 'ok' }),
        chip(`${key}:rule`, mid, 226, MINMAX[key][l], { sans: true }),
      ];
    };
    return {
      scene: {
        w,
        h: 262,
        nodes: [...side('min', [1, 3, 2, 6, 4, 2, 6, 8, 7, 9, 6, 5], 6), ...side('max', [9, 8, 6, 6, 7, 5, 2, 1, 4, 3, 6, 2], w - 6 - half)],
      },
      notes: [MINMAX.note[l]],
    };
  },
};

// ── Representation: the heap as an array ──────────────────────────────

const REPR_SAY: Record<'init' | 'index' | 'bound', T> = {
  init: {
    en: 'A heap is a complete binary tree, stored in an array level by level. Elements are node values; indices are node positions.',
    zh: '堆是一棵完全二叉树，按层存储在数组中：元素代表节点值，索引代表节点在树中的位置。',
    'zh-hant': '堆積是一棵完全二元樹，按層儲存在陣列中：元素代表節點值，索引代表節點在樹中的位置。',
    ja: 'ヒープは完全二分木で、層ごとに配列へ格納します。要素はノードの値、インデックスは木の中でのノードの位置です。',
    ru: 'Куча — полное двоичное дерево, записанное в массив уровень за уровнем: элементы — значения узлов, индексы — их положения в дереве.',
  },
  index: {
    en: 'i = {i} (value {v}): the parent is at (i−1)/2 = {p}, the left child at 2i+1 = {l}, the right child at 2i+2 = {r}.',
    zh: 'i = {i}（值为 {v}）：父节点索引为 (i−1)/2 = {p}，左子节点索引为 2i+1 = {l}，右子节点索引为 2i+2 = {r}。',
    'zh-hant': 'i = {i}（值為 {v}）：父節點索引為 (i−1)/2 = {p}，左子節點索引為 2i+1 = {l}，右子節點索引為 2i+2 = {r}。',
    ja: 'i = {i}（値 {v}）：親ノードは (i−1)/2 = {p}、左子ノードは 2i+1 = {l}、右子ノードは 2i+2 = {r} です。',
    ru: 'i = {i} (значение {v}): родительский узел — (i−1)/2 = {p}, левый дочерний — 2i+1 = {l}, правый дочерний — 2i+2 = {r}.',
  },
  bound: {
    en: 'i = {i} (value {v}): the parent is at {p}, the left child at {l}. 2i+2 = {r} is out of bounds, so there is no right child.',
    zh: 'i = {i}（值为 {v}）：父节点索引为 {p}，左子节点索引为 {l}。2i+2 = {r} 越界，表示右子节点不存在。',
    'zh-hant': 'i = {i}（值為 {v}）：父節點索引為 {p}，左子節點索引為 {l}。2i+2 = {r} 越界，表示右子節點不存在。',
    ja: 'i = {i}（値 {v}）：親ノードは {p}、左子ノードは {l} です。2i+2 = {r} は範囲外なので、右子ノードは存在しません。',
    ru: 'i = {i} (значение {v}): родитель — {p}, левый дочерний — {l}. Индекс 2i+2 = {r} выходит за границы, значит, правого дочернего узла нет.',
  },
};

const representationOfHeap: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', index: 'cmp', bound: 'swp' },
  build(l) {
    const values = [9, 8, 6, 6, 7, 5, 2, 1, 4, 3, 6, 2];
    const n = values.length;
    const o: TreeBox = { left: 20, width: 400, top: 26, gap: 48, r: 14 };
    const cw = 30;
    const cg = 3;
    const x0 = Math.round((W - rowWidth(n, cw, cg)) / 2);
    const ay = 214;
    const cellMid = (i: number) => cellX(x0, i, cw, cg) + cw / 2;
    const cols = [80, 220, 360];
    const scene = (i: number | null) => {
      const role = (k: number): Tone | undefined => {
        if (i === null) return undefined;
        if (k === i) return 'accent';
        if (k === (i - 1) >> 1 && i > 0) return 'warn';
        if (k === 2 * i + 1 || k === 2 * i + 2) return 'info';
        return undefined;
      };
      const items: HNode[] = values.map((v, k) => ({ id: String(k), v, tone: role(k) ?? 'ok', ring: k === i }));
      const t = heapTree('t', items, o);
      const nodes: SceneNode[] = [
        ...t.nodes,
        ...t.circles.map((c, k) => {
          // Under a leaf or the root; beside an inner node, on the side away from its parent's edge.
          const side = k > 0 && 2 * k + 1 < n ? (k % 2 ? -1 : 1) : 0;
          const x = side ? c.x + c.w / 2 + side * (o.r + 4) : c.x + c.w / 2;
          const y = side ? c.y + c.h / 2 + 4 : c.y + c.h + 12;
          return text(`ti${k}`, x, y, String(k), { anchor: side < 0 ? 'end' : side > 0 ? 'start' : 'middle', mono: true, size: 11, tone: role(k) ?? 'muted' });
        }),
        ...heapRow('a', items.map((it) => ({ ...it, tone: role(Number(it.id)) ?? 'idle' })), x0, ay, cw, cg),
        ...indices('ai', x0, ay + cw + 14, values.map((_, k) => k), { w: cw, gap: cg, tone: (k) => role(k) }),
      ];
      const p = i === null ? null : (i - 1) >> 1;
      const kids = i === null ? [] : [2 * i + 1, 2 * i + 2];
      const formula = (k: 0 | 1 | 2) => ['(i−1)/2', '2i+1', '2i+2'][k];
      const target = (k: 0 | 1 | 2) => (i === null ? null : k === 0 ? p! : kids[k - 1]);
      ([0, 1, 2] as const).forEach((k) => {
        const tone: Tone = k === 0 ? 'warn' : 'info';
        const at = target(k);
        const out = at !== null && at >= n;
        const label = [WORD.parent, WORD.left, WORD.right][k][l];
        nodes.push(text(`fl${k}`, cols[k], 298, label, { anchor: 'middle', size: 12, bold: true, tone: i === null ? 'muted' : tone }));
        nodes.push(
          chip(`fc${k}`, cols[k], 306, at === null ? formula(k) : seg(`${formula(k)} = `, [String(at), out ? 'muted' : tone, true], out ? ' ≥ n' : ''), {
            tone: i === null || out ? 'muted' : tone,
            dashed: out,
          }),
        );
        if (i !== null && at !== null && !out) {
          const from = cellMid(i);
          const to = cellMid(at);
          const dist = Math.abs(to - from);
          const bend = Math.min(16, 6 + dist / 18) * (to > from ? 1 : -1);
          nodes.push(arrow(`fa${k}`, [from, 263], [to, 263], { bend, tone, width: 1.5 }));
        }
      });
      return { w: W, h: 340, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null), say: REPR_SAY.init[l] }];
    for (const i of [1, 4, 5]) {
      const r = 2 * i + 2;
      frames.push({
        kind: r < n ? 'index' : 'bound',
        scene: scene(i),
        say: fmt((r < n ? REPR_SAY.index : REPR_SAY.bound)[l], { i, v: values[i], p: (i - 1) >> 1, l: 2 * i + 1, r }),
      });
    }
    return {
      frames,
      legend: [
        { tone: 'accent', text: 'i', shape: 'circle' },
        { tone: 'warn', text: WORD.parent[l], shape: 'circle' },
        { tone: 'info', text: `${WORD.left[l]} / ${WORD.right[l]}`, shape: 'circle' },
      ],
    };
  },
};

// ── Push and pop on a max heap ────────────────────────────────────────

/** Layout shared by the push and pop figures: the tree, the array under it, and a slot for the value that enters or leaves. */
const PP = {
  tree: { left: 20, width: 400, top: 36, gap: 50, r: 15 } as TreeBox,
  cw: 28,
  cg: 3,
  x0: 20,
  ay: 222,
  h: 316,
  /** Where the value waiting to enter (push) or the returned value (pop) sits. */
  side: { cx: 398, cy: 36 },
};

type Marks = Map<number, { tone: Tone; ring?: boolean }>;

function ppScene(arr: HNode[], marks: Marks, extra: SceneNode[], opts: { slots?: number } = {}) {
  const items = arr.map((it, i) => ({ ...it, tone: marks.get(i)?.tone ?? 'ok', ring: marks.get(i)?.ring }));
  const t = heapTree('t', items, PP.tree);
  const slots = opts.slots ?? arr.length;
  const nodes: SceneNode[] = [
    ...Array.from({ length: slots }, (_, i) => box(`slot${i}`, cellX(PP.x0, i, PP.cw, PP.cg), PP.ay, '', { w: PP.cw, h: PP.cw, tone: 'ghost', dashed: true })),
    ...t.nodes,
    ...heapRow('a', items.map((it, k) => ({ ...it, tone: marks.get(k)?.tone ?? 'idle' })), PP.x0, PP.ay, PP.cw, PP.cg),
    ...indices('ix', PP.x0, PP.ay + PP.cw + 14, Array.from({ length: slots }, (_, i) => i), { w: PP.cw, gap: PP.cg }),
    ...extra,
  ];
  return { w: W, h: PP.h, nodes };
}

/** A circle beside the tree for the value entering or leaving the heap, with a `val` label. */
const sideValue = (it: HNode, tone: Tone): SceneNode[] => {
  const { cx, cy } = PP.side;
  const r = PP.tree.r;
  return [
    box(`t${it.id}`, cx - r, cy - r, it.v, { w: r * 2, h: r * 2, shape: 'circle', size: 14, tone, ring: true }),
    text('val', cx - r - 8, cy + 4, 'val', { anchor: 'end', mono: true, size: 13, bold: true, tone }),
  ];
};

const PUSH_SAY: Record<'init' | 'append' | 'compare' | 'swap' | 'stop', T> = {
  init: {
    en: 'Push {v} into this max heap. The tree above and the array below are the same heap.',
    zh: '元素 {v} 入堆。上方的树与下方的数组是同一个大顶堆的两种表示。',
    'zh-hant': '元素 {v} 入堆積。上方的樹與下方的陣列是同一個大頂堆積的兩種表示。',
    ja: '要素 {v} をこの最大ヒープに追加します。上の木と下の配列は同じヒープの 2 つの表現です。',
    ru: 'Добавим {v} в эту максимальную кучу. Дерево вверху и массив внизу — одна и та же куча.',
  },
  append: {
    en: 'Add {v} at the heap bottom, the end of the array (index {i}). It may be larger than its parent, which breaks the heap property.',
    zh: '先将 {v} 添加到堆底，即数组末尾（索引 {i}）。它可能大于父节点，使堆的成立条件被破坏。',
    'zh-hant': '先將 {v} 新增到堆積底，即陣列末尾（索引 {i}）。它可能大於父節點，使堆積的成立條件被破壞。',
    ja: 'まず {v} をヒープ底、つまり配列の末尾（インデックス {i}）に追加します。親より大きいと、ヒープ条件が崩れます。',
    ru: 'Сначала помещаем {v} в основание кучи — в конец массива (индекс {i}). Если оно больше родителя, свойство кучи нарушено.',
  },
  compare: {
    en: 'The parent of index {i} is (i−1)/2 = {p}, holding {pv}. {v} > {pv}, so the two must swap.',
    zh: '索引 {i} 的父节点索引为 (i−1)/2 = {p}，值为 {pv}。{v} > {pv}，需要交换。',
    'zh-hant': '索引 {i} 的父節點索引為 (i−1)/2 = {p}，值為 {pv}。{v} > {pv}，需要交換。',
    ja: 'インデックス {i} の親は (i−1)/2 = {p} で、値は {pv} です。{v} > {pv} なので交換します。',
    ru: 'Родитель индекса {i} — (i−1)/2 = {p}, там {pv}. {v} > {pv}, значит, их нужно поменять местами.',
  },
  swap: {
    en: 'Swap: {v} moves up to index {p}. Heapify continues from bottom to top with i = {p}.',
    zh: '交换后 {v} 上移到索引 {p}。令 i = {p}，继续从底至顶堆化。',
    'zh-hant': '交換後 {v} 上移到索引 {p}。令 i = {p}，繼續從底至頂堆積化。',
    ja: '交換して {v} はインデックス {p} に上がります。i = {p} として、下から上へのヒープ化を続けます。',
    ru: 'После обмена {v} поднимается на индекс {p}. Продолжаем упорядочивание снизу вверх с i = {p}.',
  },
  stop: {
    en: 'The parent at index {p} holds {pv}, and {v} ≤ {pv}: no swap is needed, so heapify ends. The heap property holds again.',
    zh: '父节点（索引 {p}）的值为 {pv}，{v} ≤ {pv}，无须交换，堆化结束。堆重新满足成立条件。',
    'zh-hant': '父節點（索引 {p}）的值為 {pv}，{v} ≤ {pv}，無須交換，堆積化結束。堆積重新滿足成立條件。',
    ja: '親（インデックス {p}）の値は {pv} で、{v} ≤ {pv} なので交換は不要です。ヒープ化を終え、ヒープ条件が回復しました。',
    ru: 'Родитель (индекс {p}) хранит {pv}, и {v} ≤ {pv}: обмен не нужен, упорядочивание завершается. Свойство кучи восстановлено.',
  },
};

const heapPushSteps: StepFigure = {
  type: 'steps',
  call: 'push(7)',
  tones: { init: 'idle', append: 'cmp', compare: 'cmp', swap: 'swp', stop: 'done' },
  sources: classSources(HEAP_PY, HEAP_JAVA, 'MaxHeap', ['push', 'sift_up'], {
    python: {
      init: ['def push('],
      append: ['self.max_heap.append(val)', 'self.sift_up(self.size() - 1)'],
      compare: ['p = self.parent(i)', 'if p < 0 or self.max_heap[i] <= self.max_heap[p]:'],
      swap: ['self.swap(i, p)', 'i = p'],
      stop: ['if p < 0 or self.max_heap[i] <= self.max_heap[p]:', 'break'],
    },
    java: {
      init: ['public void push('],
      append: ['maxHeap.add(val);', 'siftUp(size() - 1);'],
      compare: ['int p = parent(i);', 'if (p < 0 || maxHeap.get(i) <= maxHeap.get(p))'],
      swap: ['swap(i, p);', 'i = p;'],
      stop: ['if (p < 0 || maxHeap.get(i) <= maxHeap.get(p))', 'break;'],
    },
  }),
  build(l) {
    const arr: HNode[] = [9, 8, 6, 6, 7, 5, 2, 1, 4, 3, 6, 2].map((v, i) => ({ id: `v${i}`, v }));
    const nv: HNode = { id: 'v12', v: 7 };
    const v = 7;
    const slots = arr.length + 1;
    const frame = (kind: string, a: HNode[], marks: Marks, extra: SceneNode[], say: string): SceneFrame => {
      return { kind, scene: ppScene(a, marks, extra, { slots }), say };
    };
    const frames: SceneFrame[] = [frame('init', arr, new Map(), sideValue(nv, 'accent'), fmt(PUSH_SAY.init[l], { v }))];
    const a = [...arr, nv];
    let i = a.length - 1;
    const at = (k: number) => Number(a[k].v);
    const vx = (pairs: [string, number, Tone?][]) => [vars('vars', PP.x0, 278, pairs)];
    frames.push(frame('append', a, new Map([[i, { tone: 'accent', ring: true }]]), vx([['i', i, 'accent']]), fmt(PUSH_SAY.append[l], { v, i })));
    for (;;) {
      const p = (i - 1) >> 1;
      if (p < 0 || at(i) <= at(p)) {
        frames.push(
          frame(
            'stop',
            a,
            new Map([
              [i, { tone: 'ok', ring: true }],
              [p, { tone: 'info' }],
            ]),
            vx([
              ['i', i, 'accent'],
              ['p', p],
            ]),
            fmt(PUSH_SAY.stop[l], { v, p, pv: at(p) }),
          ),
        );
        break;
      }
      frames.push(
        frame(
          'compare',
          a,
          new Map([
            [i, { tone: 'accent' }],
            [p, { tone: 'info', ring: true }],
          ]),
          vx([
            ['i', i, 'accent'],
            ['p', p],
          ]),
          fmt(PUSH_SAY.compare[l], { i, p, v, pv: at(p) }),
        ),
      );
      [a[i], a[p]] = [a[p], a[i]];
      frames.push(
        frame(
          'swap',
          a,
          new Map([
            [p, { tone: 'warn', ring: true }],
            [i, { tone: 'warn' }],
          ]),
          vx([['i', p, 'accent']]),
          fmt(PUSH_SAY.swap[l], { v, p }),
        ),
      );
      i = p;
    }
    return { frames };
  },
};

const POP_SAY: Record<'init' | 'swapEnds' | 'remove' | 'compare' | 'swap' | 'leaf' | 'order', T> = {
  init: {
    en: 'Pop the heap top {top}. Deleting index 0 directly would shift every index, so the heap swaps first.',
    zh: '堆顶元素 {top} 出堆。直接删除索引 0 会使所有索引发生变化，因此先做交换。',
    'zh-hant': '堆積頂元素 {top} 出堆積。直接刪除索引 0 會使所有索引發生變化，因此先做交換。',
    ja: 'ヒープ頂点の {top} を取り出します。インデックス 0 を直接削除するとすべてのインデックスが変わるので、まず交換します。',
    ru: 'Извлекаем вершину кучи, {top}. Удаление индекса 0 сдвинуло бы все индексы, поэтому сначала делается обмен.',
  },
  swapEnds: {
    en: 'Swap the heap top {top} with the heap bottom {bottom}: the first and last elements of the array.',
    zh: '交换堆顶元素 {top} 与堆底元素 {bottom}，即数组的首元素与尾元素。',
    'zh-hant': '交換堆積頂元素 {top} 與堆積底元素 {bottom}，即陣列的首元素與尾元素。',
    ja: 'ヒープ頂点の {top} とヒープ底の {bottom} を交換します。配列の先頭要素と末尾要素です。',
    ru: 'Меняем вершину кучи {top} с основанием кучи {bottom} — первым и последним элементами массива.',
  },
  remove: {
    en: 'Remove the last element: the old heap top {top}, which pop() returns. Now {bottom} sits at the top and breaks the order.',
    zh: '删除数组尾元素，也就是原来的堆顶 {top}，作为返回值。此时 {bottom} 位于堆顶，破坏了堆的成立条件。',
    'zh-hant': '刪除陣列尾元素，也就是原來的堆積頂 {top}，作為回傳值。此時 {bottom} 位於堆積頂，破壞了堆積的成立條件。',
    ja: '末尾の要素を削除します。これは元のヒープ頂点 {top} で、pop() の戻り値です。いま頂点にある {bottom} がヒープ条件を崩しています。',
    ru: 'Удаляем последний элемент — прежнюю вершину {top}, которую и возвращает pop(). Теперь наверху {bottom}, и порядок нарушен.',
  },
  compare: {
    en: 'Heapify from top to bottom: compare {v} with its children {a} and {b}. The larger child, {m}, is bigger than {v}.',
    zh: '从顶至底堆化：比较 {v} 与其子节点 {a}、{b}。较大的子节点 {m} 大于 {v}。',
    'zh-hant': '從頂至底堆積化：比較 {v} 與其子節點 {a}、{b}。較大的子節點 {m} 大於 {v}。',
    ja: '上から下へヒープ化：{v} を子ノード {a}、{b} と比較します。大きいほうの子 {m} は {v} より大きいです。',
    ru: 'Упорядочивание сверху вниз: сравниваем {v} с дочерними узлами {a} и {b}. Больший из них, {m}, больше {v}.',
  },
  swap: {
    en: 'Swap {v} with {m}. Heapify continues from i = {ma}.',
    zh: '交换 {v} 与 {m}。令 i = {ma}，继续向下堆化。',
    'zh-hant': '交換 {v} 與 {m}。令 i = {ma}，繼續向下堆積化。',
    ja: '{v} と {m} を交換し、i = {ma} からヒープ化を続けます。',
    ru: 'Меняем {v} и {m} местами и продолжаем с i = {ma}.',
  },
  leaf: {
    en: 'Index {i} has no children: 2i+1 = {l} is out of bounds. Heapify ends, and {top} is the new heap top.',
    zh: '索引 {i} 没有子节点：2i+1 = {l} 已越界。堆化结束，{top} 成为新的堆顶。',
    'zh-hant': '索引 {i} 沒有子節點：2i+1 = {l} 已越界。堆積化結束，{top} 成為新的堆積頂。',
    ja: 'インデックス {i} には子ノードがありません（2i+1 = {l} は範囲外）。ヒープ化を終え、{top} が新しいヒープ頂点です。',
    ru: 'У индекса {i} нет дочерних узлов: 2i+1 = {l} выходит за границы. Упорядочивание завершено, новая вершина кучи — {top}.',
  },
  order: {
    en: '{v} is not smaller than its larger child {m}, so no swap is needed. Heapify ends, and {top} is the new heap top.',
    zh: '{v} 不小于较大的子节点 {m}，无须交换。堆化结束，{top} 成为新的堆顶。',
    'zh-hant': '{v} 不小於較大的子節點 {m}，無須交換。堆積化結束，{top} 成為新的堆積頂。',
    ja: '{v} は大きいほうの子 {m} 以上なので、交換は不要です。ヒープ化を終え、{top} が新しいヒープ頂点です。',
    ru: '{v} не меньше большего дочернего узла {m}, обмен не нужен. Упорядочивание завершено, новая вершина кучи — {top}.',
  },
};

const heapPopSteps: StepFigure = {
  type: 'steps',
  call: 'pop()',
  tones: { init: 'idle', swapEnds: 'swp', remove: 'cmp', compare: 'cmp', swap: 'swp', stop: 'done' },
  sources: classSources(HEAP_PY, HEAP_JAVA, 'MaxHeap', ['pop', 'sift_down'], {
    python: {
      init: ['def pop('],
      swapEnds: ['self.swap(0, self.size() - 1)'],
      remove: ['val = self.max_heap.pop()', 'self.sift_down(0)'],
      compare: ['l, r, ma = self.left(i), self.right(i), i', 'if l < self.size() and self.max_heap[l] > self.max_heap[ma]:', 'if r < self.size() and self.max_heap[r] > self.max_heap[ma]:'],
      swap: ['self.swap(i, ma)', 'i = ma'],
      stop: ['if ma == i:', 'break'],
    },
    java: {
      init: ['public int pop('],
      swapEnds: ['swap(0, size() - 1);'],
      remove: ['int val = maxHeap.remove(size() - 1);', 'siftDown(0);'],
      compare: ['int l = left(i), r = right(i), ma = i;', 'if (l < size() && maxHeap.get(l) > maxHeap.get(ma))', 'if (r < size() && maxHeap.get(r) > maxHeap.get(ma))'],
      swap: ['swap(i, ma);', 'i = ma;'],
      stop: ['if (ma == i)', 'break;'],
    },
  }),
  build(l) {
    const a: HNode[] = [9, 8, 7, 6, 7, 6, 2, 1, 4, 3, 6, 2, 5].map((v, i) => ({ id: `v${i}`, v }));
    const slots = a.length;
    const at = (k: number) => Number(a[k].v);
    const top = at(0);
    const bottom = at(a.length - 1);
    const vx = (pairs: [string, number, Tone?][]) => [vars('vars', PP.x0, 278, pairs)];
    const frame = (kind: string, marks: Marks, extra: SceneNode[], say: string): SceneFrame => {
      return { kind, scene: ppScene(a, marks, extra, { slots }), say };
    };
    const last = a.length - 1;
    const rootTag = (tone: Tone) => {
      const { cx, cy } = slotXY(PP.tree, 0);
      return text('lt', cx + PP.tree.r + 8, cy + 4, WORD.heapTop[l], { size: 12, tone });
    };
    const bottomTag = (tone: Tone) => {
      const { cx, cy } = slotXY(PP.tree, last);
      return text('lb', cx + PP.tree.r + 8, cy + 4, WORD.heapBottom[l], { size: 12, tone });
    };
    const frames: SceneFrame[] = [
      frame(
        'init',
        new Map([
          [0, { tone: 'accent', ring: true }],
          [last, { tone: 'info', ring: true }],
        ]),
        [rootTag('accent'), bottomTag('info')],
        fmt(POP_SAY.init[l], { top }),
      ),
    ];
    [a[0], a[last]] = [a[last], a[0]];
    frames.push(
      frame(
        'swapEnds',
        new Map([
          [0, { tone: 'warn', ring: true }],
          [last, { tone: 'warn', ring: true }],
        ]),
        [rootTag('muted'), bottomTag('muted')],
        fmt(POP_SAY.swapEnds[l], { top, bottom }),
      ),
    );
    const out = a.pop()!;
    const kept = sideValue(out, 'accent');
    frames.push(frame('remove', new Map([[0, { tone: 'accent' }]]), [...kept, ...vx([['val', top, 'accent']])], fmt(POP_SAY.remove[l], { top, bottom })));
    let i = 0;
    const v = bottom;
    for (;;) {
      const li = 2 * i + 1;
      const ri = 2 * i + 2;
      let ma = i;
      if (li < a.length && at(li) > at(ma)) ma = li;
      if (ri < a.length && at(ri) > at(ma)) ma = ri;
      const kids = [li, ri].filter((k) => k < a.length);
      const kidMarks = kids.map((k): [number, { tone: Tone; ring?: boolean }] => [k, { tone: 'info', ring: k === ma }]);
      const state: [string, number, Tone?][] = [
        ['i', i, 'accent'],
        ['l', li],
        ['r', ri],
        ['ma', ma, 'warn'],
      ];
      if (ma === i) {
        const larger = kids.length ? Math.max(...kids.map(at)) : 0;
        frames.push(
          frame(
            'stop',
            new Map([[i, { tone: 'ok', ring: true }], ...kidMarks]),
            [...kept, ...vx(state)],
            kids.length ? fmt(POP_SAY.order[l], { v, m: larger, top: at(0) }) : fmt(POP_SAY.leaf[l], { i, l: li, top: at(0) }),
          ),
        );
        break;
      }
      const [x, y] = kids.map(at);
      frames.push(frame('compare', new Map([[i, { tone: 'accent' }], ...kidMarks]), [...kept, ...vx(state)], fmt(POP_SAY.compare[l], { v, a: x, b: y ?? '', m: at(ma) })));
      const m = at(ma);
      [a[i], a[ma]] = [a[ma], a[i]];
      frames.push(
        frame(
          'swap',
          new Map([
            [i, { tone: 'warn' }],
            [ma, { tone: 'warn', ring: true }],
          ]),
          [...kept, ...vx([['i', ma, 'accent']])],
          fmt(POP_SAY.swap[l], { v, m, ma }),
        ),
      );
      i = ma;
    }
    return { frames };
  },
};

// ── Building a heap: why it is O(n) ───────────────────────────────────

const COUNT_SAY: Record<'init' | 'level' | 'leaves' | 'sum', T> = {
  init: {
    en: 'A perfect binary tree of height h = 3 with n = 15 nodes. Top-to-bottom heapify of a node takes at most as many iterations as its height, its distance to a leaf.',
    zh: '一棵高度 h = 3、共 n = 15 个节点的完美二叉树。节点“从顶至底堆化”的最大迭代次数等于节点高度，即它到叶节点的距离。',
    'zh-hant': '一棵高度 h = 3、共 n = 15 個節點的完美二元樹。節點“從頂至底堆積化”的最大迭代次數等於節點高度，即它到葉節點的距離。',
    ja: '高さ h = 3、ノード数 n = 15 の満二分木です。ノードの「上から下へのヒープ化」の最大反復回数は、ノードの高さ（葉ノードまでの距離）に等しくなります。',
    ru: 'Идеальное двоичное дерево высоты h = 3 из n = 15 узлов. Упорядочивание узла сверху вниз занимает не больше итераций, чем его высота — расстояние до листа.',
  },
  level: {
    en: 'Level {d}: {c} × {ht} = {p} (nodes × height). Running total: {s}.',
    zh: '第 {d} 层：{c} × {ht} = {p}（节点数量 × 节点高度）。累计 {s}。',
    'zh-hant': '第 {d} 層：{c} × {ht} = {p}（節點數量 × 節點高度）。累計 {s}。',
    ja: '第 {d} 層：{c} × {ht} = {p}（ノード数 × ノードの高さ）。累計 {s}。',
    ru: 'Уровень {d}: {c} × {ht} = {p} (число узлов × высота). Всего: {s}.',
  },
  leaves: {
    en: 'Level {d}: the {c} leaves have height 0 and need no heapify. Total: {s}.',
    zh: '第 {d} 层：{c} 个叶节点的高度为 0，无须堆化。总计 {s}。',
    'zh-hant': '第 {d} 層：{c} 個葉節點的高度為 0，無須堆積化。總計 {s}。',
    ja: '第 {d} 層：{c} 個の葉ノードは高さ 0 で、ヒープ化は不要です。合計 {s}。',
    ru: 'Уровень {d}: у {c} листьев высота 0, упорядочивать их не нужно. Итого: {s}.',
  },
  sum: {
    en: 'In general T(h) = 2⁰h + 2¹(h−1) + … + 2ʰ⁻¹·1 = 2ʰ⁺¹ − h − 2 = O(2ʰ). A perfect tree has n = 2ʰ⁺¹ − 1 nodes, so building a heap is O(n).',
    zh: '一般地，T(h) = 2⁰h + 2¹(h−1) + … + 2ʰ⁻¹·1 = 2ʰ⁺¹ − h − 2 = O(2ʰ)。完美二叉树的节点数量为 n = 2ʰ⁺¹ − 1，因此建堆的时间复杂度为 O(n)。',
    'zh-hant': '一般地，T(h) = 2⁰h + 2¹(h−1) + … + 2ʰ⁻¹·1 = 2ʰ⁺¹ − h − 2 = O(2ʰ)。完美二元樹的節點數量為 n = 2ʰ⁺¹ − 1，因此建堆積的時間複雜度為 O(n)。',
    ja: '一般に T(h) = 2⁰h + 2¹(h−1) + … + 2ʰ⁻¹·1 = 2ʰ⁺¹ − h − 2 = O(2ʰ) です。満二分木のノード数は n = 2ʰ⁺¹ − 1 なので、ヒープ構築の時間計算量は O(n) です。',
    ru: 'В общем виде T(h) = 2⁰h + 2¹(h−1) + … + 2ʰ⁻¹·1 = 2ʰ⁺¹ − h − 2 = O(2ʰ). В идеальном дереве n = 2ʰ⁺¹ − 1 узлов, поэтому построение кучи занимает O(n).',
  },
};

const heapifyOperationsCount: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', level: 'cmp', leaves: 'cmp', sum: 'done' },
  build(l) {
    const h = 3;
    const n = 2 ** (h + 1) - 1;
    const o: TreeBox = { left: 8, width: 216, top: 70, gap: 44, r: 10 };
    const cols = [276, 344, 408];
    const levelOf = (k: number) => Math.floor(Math.log2(k + 1) + 1e-9);
    /** Index of the leftmost node of level d, and the path from it down to a leaf. */
    const pathFrom = (d: number) => {
      const out: number[] = [];
      for (let k = 2 ** d - 1; k < n; k = 2 * k + 1) out.push(k);
      return out;
    };
    const products = Array.from({ length: h + 1 }, (_, d) => 2 ** d * (h - d));
    const scene = (cur: number | null, shown: number, final: boolean) => {
      const path = cur === null ? [] : pathFrom(cur);
      const items: HNode[] = Array.from({ length: n }, (_, k) => ({
        id: String(k),
        v: '',
        tone: path.includes(k) && k !== path[0] ? 'warn' : cur !== null && levelOf(k) === cur ? 'accent' : 'ok',
        dim: cur !== null && levelOf(k) !== cur && !path.includes(k),
      }));
      const t = heapTree('t', items, o, (k) => (path.includes(k) && k !== path[0] ? 'warn' : undefined));
      const nodes: SceneNode[] = [
        ...t.nodes,
        text('h0', cols[0], 24, WORD.height[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        text('h1', cols[1], 24, WORD.nodes[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        text('h2', cols[2], 24, WORD.iters[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        text('s0', cols[0], 42, 'h − i', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
        text('s1', cols[1], 42, '2ⁱ', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
        text('s2', cols[2], 42, '2ⁱ(h − i)', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
        text('leafnote', o.left, 248, `(${WORD.leaves[l]})`, { size: 12, tone: 'muted' }),
      ];
      for (let d = 0; d <= h; d++) {
        const y = o.top + d * o.gap;
        const xr = o.left + o.width - o.width / 2 ** (d + 1) + o.r + 5;
        const on = cur === d;
        nodes.push({ kind: 'path', id: `g${d}`, d: `M ${xr} ${y} L 238 ${y}`, tone: on ? 'accent' : 'muted', width: 1, dashed: true });
        if (d >= shown) continue;
        const tone: Tone = on ? 'accent' : 'idle';
        const hl = d === 0 ? seg(['h', 'ok', true], ` = ${h}`) : seg(['h', 'ok', true], `−${d} = ${h - d}`);
        nodes.push(
          text(`r0:${d}`, cols[0], y + 4, hl, { anchor: 'middle', mono: true, size: 13, tone }),
          text(`r1:${d}`, cols[1], y + 4, `2${sup(d)} = ${2 ** d}`, { anchor: 'middle', mono: true, size: 13, tone }),
          text(`r2:${d}`, cols[2], y + 4, String(products[d]), { anchor: 'middle', mono: true, size: 13, bold: true, tone: on ? 'accent' : 'idle' }),
        );
      }
      if (shown > 0) {
        const terms = products.slice(0, shown);
        const total = terms.reduce((x, y) => x + y, 0);
        nodes.push(text('sum', 432, 250, seg(`T(${h}) = ${terms.join(' + ')} = `, [String(total), 'accent', true]), { anchor: 'end', mono: true, size: 13 }));
      }
      if (final) nodes.push(chip('formula', W / 2, 266, seg('T(h) = 2ʰ⁺¹ − h − 2 = ', ['O(n)', 'ok', true]), { tone: 'ok' }));
      return { w: W, h: 304, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null, 0, false), say: COUNT_SAY.init[l] }];
    let s = 0;
    for (let d = 0; d <= h; d++) {
      s += products[d];
      const leaf = d === h;
      frames.push({
        kind: leaf ? 'leaves' : 'level',
        scene: scene(d, d + 1, false),
        say: fmt((leaf ? COUNT_SAY.leaves : COUNT_SAY.level)[l], { d, c: 2 ** d, ht: h - d, p: products[d], s }),
      });
    }
    frames.push({ kind: 'sum', scene: scene(null, h + 1, true), say: COUNT_SAY.sum[l] });
    return { frames };
  },
};

// ── Top-k: traversal and sorting ──────────────────────────────────────

const NUMS = [1, 7, 6, 3, 2];
const K = 3;

const TRAV_SAY: Record<'init' | 'scan' | 'take' | 'summary', T> = {
  init: {
    en: 'k = 3. Method 1: run k rounds of traversal; each round scans the remaining elements and takes the largest.',
    zh: 'k = 3。方法一：进行 k 轮遍历，每轮在剩余元素中找出最大的一个并取出。',
    'zh-hant': 'k = 3。方法一：進行 k 輪走訪，每輪在剩餘元素中找出最大的一個並取出。',
    ja: 'k = 3。方法一：k 回の走査を行い、各ラウンドで残りの要素から最大のものを取り出します。',
    ru: 'k = 3. Метод 1: выполняем k проходов; на каждом просматриваем оставшиеся элементы и забираем наибольший.',
  },
  scan: {
    en: 'Round {j}: scan the {m} remaining elements; the largest is {v}.',
    zh: '第 {j} 轮：遍历剩余的 {m} 个元素，最大的是 {v}。',
    'zh-hant': '第 {j} 輪：走訪剩餘的 {m} 個元素，最大的是 {v}。',
    ja: '第 {j} ラウンド：残りの {m} 個の要素を走査し、最大は {v} です。',
    ru: 'Проход {j}: просматриваем {m} оставшихся элементов, наибольший — {v}.',
  },
  take: {
    en: 'Take {v} out and put it with the results.',
    zh: '将 {v} 取出，放入结果中。',
    'zh-hant': '將 {v} 取出，放入結果中。',
    ja: '{v} を取り出して結果に加えます。',
    ru: 'Забираем {v} в результат.',
  },
  summary: {
    en: 'k rounds of up to n elements each: O(nk), which approaches O(n²) as k nears n.',
    zh: 'k 轮、每轮最多 n 个元素：时间复杂度为 O(nk)，当 k 接近 n 时趋向 O(n²)。',
    'zh-hant': 'k 輪、每輪最多 n 個元素：時間複雜度為 O(nk)，當 k 接近 n 時趨向 O(n²)。',
    ja: 'k ラウンド × 各最大 n 個：時間計算量は O(nk) で、k が n に近づくと O(n²) に近づきます。',
    ru: 'k проходов, в каждом не больше n элементов: O(nk), а при k, близком к n, — почти O(n²).',
  },
};

/** `k = 3` and the `nums` label, as the book draws them. */
const kAndNums = (y: number, x: number, h: number) => [
  text('k', 14, 26, seg(['k', 'info', true], ` = ${K}`), { mono: true, size: 14 }),
  text('nums', x - 10, y + h / 2 + 5, 'nums', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
];

const topKTraversal: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', scan: 'cmp', take: 'swp', done: 'done' },
  build(l) {
    const cw = 36;
    const cg = 5;
    const x0 = 66;
    const y = 58;
    const resX = (j: number) => W - 14 - cw - j * (cw + cg);
    const all = NUMS.map((v, i) => ({ id: `e${i}`, v }));
    const scene = (rest: typeof all, found: typeof all, scan: string | null, moved: { from: number; to: number } | null, counted: number[]) => {
      const nodes: SceneNode[] = [
        ...kAndNums(y, x0, cw),
        region('res', resX(K - 1) - 8, y - 10, rowWidth(K, cw, cg) + 16, cw + 20, { tone: 'info' }),
        text('resl', resX(1) + cw / 2, y + cw + 28, WORD.largestK[l], { anchor: 'middle', bold: true, size: 13, tone: 'info' }),
        ...Array.from({ length: K }, (_, j) => box(`slot${j}`, resX(j), y, '', { w: cw, h: cw, tone: 'ghost', dashed: true })),
        ...rest.map((e, i) =>
          box(e.id, cellX(x0, i, cw, cg), y, e.v, { w: cw, h: cw, tone: scan === null ? 'idle' : e.id === scan ? 'accent' : 'info', ring: e.id === scan }),
        ),
        ...found.map((e, j) => box(e.id, resX(j), y, e.v, { w: cw, h: cw, tone: 'ok', ring: j === found.length - 1 && moved !== null })),
      ];
      if (scan !== null) nodes.push(brace('scan', x0, x0 + rowWidth(rest.length, cw, cg), y + cw + 6, 'down', 'info'));
      if (moved) nodes.push(arrow('mv', [moved.from, y - 4], [moved.to, y - 4], { bend: -18, tone: 'accent', width: 1.5 }));
      if (counted.length) {
        const total = counted.reduce((a, b) => a + b, 0);
        nodes.push(text('count', 14, 138, seg(`${WORD.scanned[l]}: ${counted.join(' + ')} = `, [String(total), 'accent', true]), { mono: false, size: 13 }));
      }
      return { w: W, h: 152, nodes };
    };
    let rest = [...all];
    const found: typeof all = [];
    const counted: number[] = [];
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(rest, found, null, null, counted), say: TRAV_SAY.init[l] }];
    for (let j = 1; j <= K; j++) {
      const best = rest.reduce((m, e) => (e.v > m.v ? e : m));
      const m = rest.length;
      counted.push(m);
      frames.push({ kind: 'scan', scene: scene(rest, found, best.id, null, counted), say: fmt(TRAV_SAY.scan[l], { j, m, v: best.v }) });
      const from = cellX(x0, rest.indexOf(best), cw, cg) + cw / 2;
      rest = rest.filter((e) => e !== best);
      found.push(best);
      const say = fmt(TRAV_SAY.take[l], { v: best.v }) + (j === K ? ` ${TRAV_SAY.summary[l]}` : '');
      frames.push({ kind: j === K ? 'done' : 'take', scene: scene(rest, found, null, { from, to: resX(j - 1) + cw / 2 }, counted), say });
    }
    return { frames };
  },
};

const SORT_SAY: Record<'init' | 'sort' | 'take', T> = {
  init: {
    en: 'k = 3. Method 2: sort the array nums first.',
    zh: 'k = 3。方法二：先对数组 nums 进行排序。',
    'zh-hant': 'k = 3。方法二：先對陣列 nums 進行排序。',
    ja: 'k = 3。方法二：まず配列 nums をソートします。',
    ru: 'k = 3. Метод 2: сначала сортируем массив nums.',
  },
  sort: {
    en: 'After sorting in ascending order, the largest elements sit at the right end. Sorting takes O(n log n).',
    zh: '升序排序后，最大的元素都位于最右边。排序的时间复杂度为 O(n log n)。',
    'zh-hant': '升序排序後，最大的元素都位於最右邊。排序的時間複雜度為 O(n log n)。',
    ja: '昇順にソートすると、大きい要素は右端に集まります。ソートの時間計算量は O(n log n) です。',
    ru: 'После сортировки по возрастанию наибольшие элементы оказываются справа. Сортировка занимает O(n log n).',
  },
  take: {
    en: 'Return the rightmost k elements: 3, 6, 7. The method does more than needed: the other elements did not have to be sorted.',
    zh: '返回最右边的 k 个元素：3、6、7。该方法“超额”完成了任务，其他元素其实无须排序。',
    'zh-hant': '返回最右邊的 k 個元素：3、6、7。該方法“超額”完成了任務，其他元素其實無須排序。',
    ja: '右端の k 個の要素 3、6、7 を返します。ほかの要素までソートしており、必要以上の処理をしています。',
    ru: 'Возвращаем k крайних правых элементов: 3, 6, 7. Метод делает лишнее: остальные элементы сортировать было не нужно.',
  },
};

const topKSorting: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', sort: 'swp', take: 'done' },
  build(l) {
    const cw = 40;
    const cg = 6;
    const x0 = Math.round((W - rowWidth(NUMS.length, cw, cg)) / 2);
    const y = 56;
    const all = NUMS.map((v, i) => ({ id: `e${i}`, v }));
    const sorted = [...all].sort((a, b) => a.v - b.v);
    const scene = (order: typeof all, stage: 'init' | 'sort' | 'take') => {
      const n = order.length;
      const nodes: SceneNode[] = [
        ...kAndNums(y, x0, cw),
        ...order.map((e, i) => {
          const pick = stage === 'take' && i >= n - K;
          return box(e.id, cellX(x0, i, cw, cg), y, e.v, { tone: pick ? 'ok' : stage === 'sort' ? 'warn' : 'idle', ring: pick, dim: stage === 'take' && !pick });
        }),
        ...indices('ix', x0, y + cw + 16, order.map((_, i) => i)),
      ];
      if (stage === 'sort') nodes.push(text('arrow', x0 + rowWidth(n, cw, cg) / 2, y + cw + 44, 'O(n log n)', { anchor: 'middle', mono: true, size: 13, tone: 'warn', bold: true }));
      if (stage === 'take') {
        const a = cellX(x0, n - K, cw, cg);
        const b = cellX(x0, n - 1, cw, cg) + cw;
        nodes.push(brace('kb', a, b, y + cw + 24, 'down', 'ok'), text('kl', (a + b) / 2, y + cw + 56, seg(['k', 'info', true], ` = ${K}`), { anchor: 'middle', mono: true, size: 13 }));
      }
      return { w: W, h: 168, nodes };
    };
    return {
      frames: [
        { kind: 'init', scene: scene(all, 'init'), say: SORT_SAY.init[l] },
        { kind: 'sort', scene: scene(sorted, 'sort'), say: SORT_SAY.sort[l], call: 'sort(nums)' },
        { kind: 'take', scene: scene(sorted, 'take'), say: SORT_SAY.take[l], call: 'nums[n-k:]' },
      ],
    };
  },
};

// ── Top-k with a min heap ─────────────────────────────────────────────

const TOPK_SAY: Record<'init' | 'push' | 'cmp' | 'pop' | 'enter' | 'skip' | 'done', T> = {
  init: {
    en: 'k = 3. Method 3: keep a min heap, whose heap top is always its smallest element.',
    zh: 'k = 3。方法三：初始化一个小顶堆，其堆顶元素最小。',
    'zh-hant': 'k = 3。方法三：初始化一個小頂堆積，其堆積頂元素最小。',
    ja: 'k = 3。方法三：最小ヒープを用意します。そのヒープ頂点の要素が常に最小です。',
    ru: 'k = 3. Метод 3: заводим минимальную кучу, вершина которой — наименьший элемент.',
  },
  push: {
    en: 'i = {i}: the first k elements enter the heap one by one, so {v} is pushed.',
    zh: 'i = {i}：将数组的前 k 个元素依次入堆，{v} 入堆。',
    'zh-hant': 'i = {i}：將陣列的前 k 個元素依次入堆積，{v} 入堆積。',
    ja: 'i = {i}：先頭 k 個の要素を順にヒープへ挿入します。{v} を挿入します。',
    ru: 'i = {i}: первые k элементов по очереди добавляются в кучу — добавляем {v}.',
  },
  cmp: {
    en: 'i = {i}: {v} > heap top {t}, so {t} is no longer among the largest k.',
    zh: 'i = {i}：{v} > 堆顶元素 {t}，因此 {t} 不再属于最大的 k 个元素。',
    'zh-hant': 'i = {i}：{v} > 堆積頂元素 {t}，因此 {t} 不再屬於最大的 k 個元素。',
    ja: 'i = {i}：{v} > ヒープ頂点 {t} なので、{t} はもう最大の k 個に入りません。',
    ru: 'i = {i}: {v} > вершины кучи {t}, значит, {t} больше не входит в k наибольших.',
  },
  pop: {
    en: 'Pop the heap top {t}. After heapify, {n} is the new heap top.',
    zh: '堆顶元素 {t} 出堆，堆化后 {n} 成为新的堆顶。',
    'zh-hant': '堆積頂元素 {t} 出堆積，堆積化後 {n} 成為新的堆積頂。',
    ja: 'ヒープ頂点 {t} を取り出します。ヒープ化の後、{n} が新しいヒープ頂点になります。',
    ru: 'Извлекаем вершину кучи {t}. После упорядочивания новой вершиной становится {n}.',
  },
  enter: {
    en: 'Push the current element {v}. After heapify, the heap top is {t}.',
    zh: '当前元素 {v} 入堆，堆化后堆顶为 {t}。',
    'zh-hant': '當前元素 {v} 入堆積，堆積化後堆積頂為 {t}。',
    ja: '現在の要素 {v} をヒープに挿入します。ヒープ化の後、ヒープ頂点は {t} です。',
    ru: 'Добавляем текущий элемент {v}. После упорядочивания вершина кучи — {t}.',
  },
  skip: {
    en: 'i = {i}: {v} ≤ heap top {t}, so {v} is skipped.',
    zh: 'i = {i}：{v} ≤ 堆顶元素 {t}，跳过。',
    'zh-hant': 'i = {i}：{v} ≤ 堆積頂元素 {t}，跳過。',
    ja: 'i = {i}：{v} ≤ ヒープ頂点 {t} なので、スキップします。',
    ru: 'i = {i}: {v} ≤ вершины кучи {t}, пропускаем.',
  },
  done: {
    en: 'Traversal done: the heap holds the largest k elements, {res}. n rounds on a heap of at most k elements: O(n log k).',
    zh: '遍历完成，堆中保存的就是最大的 k 个元素：{res}。共 n 轮，堆的最大长度为 k：O(n log k)。',
    'zh-hant': '走訪完成，堆積中儲存的就是最大的 k 個元素：{res}。共 n 輪，堆積的最大長度為 k：O(n log k)。',
    ja: '走査完了：ヒープには最大の k 個の要素 {res} が残ります。n 回の操作で、ヒープの長さは最大 k なので O(n log k) です。',
    ru: 'Обход завершён: в куче хранятся k наибольших элементов, {res}. n шагов с кучей длины не больше k: O(n log k).',
  },
};

/** Python's heapq: a min heap on a plain list. */
function minPush(h: HNode[], it: HNode) {
  h.push(it);
  let i = h.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (Number(h[p].v) <= Number(h[i].v)) break;
    [h[i], h[p]] = [h[p], h[i]];
    i = p;
  }
}

function minPop(h: HNode[]) {
  const top = h[0];
  const last = h.pop()!;
  if (h.length) {
    h[0] = last;
    let i = 0;
    for (;;) {
      const l = 2 * i + 1;
      const r = l + 1;
      let m = i;
      if (l < h.length && Number(h[l].v) < Number(h[m].v)) m = l;
      if (r < h.length && Number(h[r].v) < Number(h[m].v)) m = r;
      if (m === i) break;
      [h[i], h[m]] = [h[m], h[i]];
      i = m;
    }
  }
  return top;
}

const topKHeapSteps: StepFigure = {
  type: 'steps',
  call: 'top_k_heap(nums, 3)',
  tones: { init: 'idle', push: 'cmp', cmp: 'cmp', pop: 'swp', enter: 'cmp', skip: 'idle', done: 'done' },
  sources: funcSources(TOPK_PY, TOPK_JAVA, ['top_k_heap'], {
    python: {
      init: ['heap = []'],
      push: ['for i in range(k):', 'heapq.heappush(heap, nums[i])'],
      cmp: ['for i in range(k, len(nums)):', 'if nums[i] > heap[0]:'],
      pop: ['heapq.heappop(heap)'],
      enter: ['2|heapq.heappush(heap, nums[i])'],
      skip: ['if nums[i] > heap[0]:'],
      done: ['return heap'],
    },
    java: {
      init: ['Queue<Integer> heap = new PriorityQueue<Integer>();'],
      push: ['for (int i = 0; i < k; i++) {', 'heap.offer(nums[i]);'],
      cmp: ['for (int i = k; i < nums.length; i++) {', 'if (nums[i] > heap.peek()) {'],
      pop: ['heap.poll();'],
      enter: ['2|heap.offer(nums[i]);'],
      skip: ['if (nums[i] > heap.peek()) {'],
      done: ['return heap;'],
    },
  }),
  build(l) {
    const cw = 34;
    const cg = 4;
    const x0 = 62;
    const ny = 62;
    const reg = { x: 262, y: 34, w: 170, h: 176 };
    const tree: TreeBox = { left: reg.x + 10, width: reg.w - 20, top: 76, gap: 50, r: 16 };
    const hw = 32;
    const hg = 4;
    const hx = reg.x + reg.w / 2 - rowWidth(K, hw, hg) / 2 + 14;
    const hy = 164;
    const elems: HNode[] = NUMS.map((v) => ({ id: String(v), v }));
    type Mark = { tone: Tone; ring?: boolean };
    const scene = (heap: HNode[], cursor: number | null, marks: { nums?: Map<number, Mark>; heap?: Map<number, Mark> }, status: Rich | null) => {
      const items = heap.map((it, k) => ({ ...it, tone: marks.heap?.get(k)?.tone ?? 'ok', ring: marks.heap?.get(k)?.ring }));
      const t = heapTree('t', items, tree);
      const numCells = elems.map((e, i) => {
        const m = marks.nums?.get(i);
        return box(`n${e.id}`, cellX(x0, i, cw, cg), ny, e.v, { w: cw, h: cw, tone: m?.tone ?? 'idle', ring: m?.ring, dim: cursor !== null && i > cursor });
      });
      const nodes: SceneNode[] = [
        ...kAndNums(ny, x0, cw),
        region('hp', reg.x, reg.y, reg.w, reg.h, { label: WORD.minHeap[l], tone: 'info' }),
        ...t.nodes,
        text('hl', hx - 8, hy + 21, 'heap', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
        ...Array.from({ length: K }, (_, k) => box(`hs${k}`, cellX(hx, k, hw, hg), hy, '', { w: hw, h: hw, tone: 'ghost', dashed: true })),
        ...heapRow('h', items.map((it) => ({ ...it, tone: it.tone === 'ok' ? 'idle' : it.tone })), hx, hy, hw, hg),
        ...numCells,
      ];
      if (cursor !== null) nodes.push(...tag('i', numCells[cursor], 'i', { side: 'below', tone: 'accent' }));
      if (status !== null) nodes.push(chip('st', 155, 150, status, { tone: 'idle' }));
      return { w: W, h: 226, nodes };
    };
    const heap: HNode[] = [];
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(heap, null, {}, null), say: TOPK_SAY.init[l] }];
    const cur = (i: number, tone: Tone = 'accent') => new Map<number, Mark>([[i, { tone, ring: true }]]);
    for (let i = 0; i < K; i++) {
      minPush(heap, elems[i]);
      const at = heap.indexOf(elems[i]);
      frames.push({ kind: 'push', scene: scene([...heap], i, { nums: cur(i), heap: new Map([[at, { tone: 'accent', ring: true }]]) }, null), say: fmt(TOPK_SAY.push[l], { i, v: NUMS[i] }) });
    }
    for (let i = K; i < elems.length; i++) {
      const e = elems[i];
      const t = Number(heap[0].v);
      const v = Number(e.v);
      const topMark = new Map<number, Mark>([[0, { tone: 'info', ring: true }]]);
      if (v > t) {
        frames.push({ kind: 'cmp', scene: scene([...heap], i, { nums: cur(i), heap: topMark }, seg([String(v), 'accent', true], ' > ', [String(t), 'info', true])), say: fmt(TOPK_SAY.cmp[l], { i, v, t }) });
        minPop(heap);
        frames.push({ kind: 'pop', scene: scene([...heap], i, { nums: cur(i), heap: new Map([[0, { tone: 'info' }]]) }, null), say: fmt(TOPK_SAY.pop[l], { t, n: Number(heap[0].v) }) });
        minPush(heap, e);
        const at = heap.indexOf(e);
        frames.push({ kind: 'enter', scene: scene([...heap], i, { nums: cur(i), heap: new Map([[at, { tone: 'accent', ring: true }]]) }, null), say: fmt(TOPK_SAY.enter[l], { v, t: Number(heap[0].v) }) });
      } else {
        frames.push({ kind: 'skip', scene: scene([...heap], i, { nums: cur(i, 'muted'), heap: topMark }, seg([String(v), 'muted', true], ' ≤ ', [String(t), 'info', true])), say: fmt(TOPK_SAY.skip[l], { i, v, t }) });
      }
    }
    const res = heap.map((h) => h.v).join(l === 'zh' || l === 'zh-hant' || l === 'ja' ? '、' : ', ');
    frames.push({ kind: 'done', scene: scene([...heap], null, { heap: new Map(heap.map((_, k) => [k, { tone: 'ok', ring: true }] as const)) }, null), say: fmt(TOPK_SAY.done[l], { res }) });
    return { frames };
  },
};

const FIGURES: Record<string, Figure> = {
  min_heap_and_max_heap: minHeapAndMaxHeap,
  representation_of_heap: representationOfHeap,
  heap_push_steps: heapPushSteps,
  heap_pop_steps: heapPopSteps,
  heapify_operations_count: heapifyOperationsCount,
  top_k_traversal: topKTraversal,
  top_k_sorting: topKSorting,
  top_k_heap_steps: topKHeapSteps,
};

export default FIGURES;
