import listJavaEn from '@codes-en/java/chapter_graph/graph_adjacency_list.java?raw';
import matJavaEn from '@codes-en/java/chapter_graph/graph_adjacency_matrix.java?raw';
import bfsJavaEn from '@codes-en/java/chapter_graph/graph_bfs.java?raw';
import dfsJavaEn from '@codes-en/java/chapter_graph/graph_dfs.java?raw';
import listPyEn from '@codes-en/python/chapter_graph/graph_adjacency_list.py?raw';
import matPyEn from '@codes-en/python/chapter_graph/graph_adjacency_matrix.py?raw';
import bfsPyEn from '@codes-en/python/chapter_graph/graph_bfs.py?raw';
import dfsPyEn from '@codes-en/python/chapter_graph/graph_dfs.py?raw';
import listJavaJa from '@codes-ja/java/chapter_graph/graph_adjacency_list.java?raw';
import matJavaJa from '@codes-ja/java/chapter_graph/graph_adjacency_matrix.java?raw';
import bfsJavaJa from '@codes-ja/java/chapter_graph/graph_bfs.java?raw';
import dfsJavaJa from '@codes-ja/java/chapter_graph/graph_dfs.java?raw';
import listPyJa from '@codes-ja/python/chapter_graph/graph_adjacency_list.py?raw';
import matPyJa from '@codes-ja/python/chapter_graph/graph_adjacency_matrix.py?raw';
import bfsPyJa from '@codes-ja/python/chapter_graph/graph_bfs.py?raw';
import dfsPyJa from '@codes-ja/python/chapter_graph/graph_dfs.py?raw';
import listJavaRu from '@codes-ru/java/chapter_graph/graph_adjacency_list.java?raw';
import matJavaRu from '@codes-ru/java/chapter_graph/graph_adjacency_matrix.java?raw';
import bfsJavaRu from '@codes-ru/java/chapter_graph/graph_bfs.java?raw';
import dfsJavaRu from '@codes-ru/java/chapter_graph/graph_dfs.java?raw';
import listPyRu from '@codes-ru/python/chapter_graph/graph_adjacency_list.py?raw';
import matPyRu from '@codes-ru/python/chapter_graph/graph_adjacency_matrix.py?raw';
import bfsPyRu from '@codes-ru/python/chapter_graph/graph_bfs.py?raw';
import dfsPyRu from '@codes-ru/python/chapter_graph/graph_dfs.py?raw';
import listJavaZh from '@codes-zh/java/chapter_graph/graph_adjacency_list.java?raw';
import matJavaZh from '@codes-zh/java/chapter_graph/graph_adjacency_matrix.java?raw';
import bfsJavaZh from '@codes-zh/java/chapter_graph/graph_bfs.java?raw';
import dfsJavaZh from '@codes-zh/java/chapter_graph/graph_dfs.java?raw';
import listPyZh from '@codes-zh/python/chapter_graph/graph_adjacency_list.py?raw';
import matPyZh from '@codes-zh/python/chapter_graph/graph_adjacency_matrix.py?raw';
import bfsPyZh from '@codes-zh/python/chapter_graph/graph_bfs.py?raw';
import dfsPyZh from '@codes-zh/python/chapter_graph/graph_dfs.py?raw';
import listJavaZhHant from '@codes-zh-hant/java/chapter_graph/graph_adjacency_list.java?raw';
import matJavaZhHant from '@codes-zh-hant/java/chapter_graph/graph_adjacency_matrix.java?raw';
import bfsJavaZhHant from '@codes-zh-hant/java/chapter_graph/graph_bfs.java?raw';
import dfsJavaZhHant from '@codes-zh-hant/java/chapter_graph/graph_dfs.java?raw';
import listPyZhHant from '@codes-zh-hant/python/chapter_graph/graph_adjacency_list.py?raw';
import matPyZhHant from '@codes-zh-hant/python/chapter_graph/graph_adjacency_matrix.py?raw';
import bfsPyZhHant from '@codes-zh-hant/python/chapter_graph/graph_bfs.py?raw';
import dfsPyZhHant from '@codes-zh-hant/python/chapter_graph/graph_dfs.py?raw';
import { codeSources, type RawByLocale } from '../../algorithms/codes';
import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, chip, drawGraph, link, region, seg, tag, text, textWidth, treeSlots, type GraphEdge, type GraphVertex } from '../kit';
import type { ArrowNode, BoxNode, Figure, LegendItem, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

const MAT_PY = raw(matPyEn, matPyZh, matPyZhHant, matPyJa, matPyRu);
const MAT_JAVA = raw(matJavaEn, matJavaZh, matJavaZhHant, matJavaJa, matJavaRu);
const LIST_PY = raw(listPyEn, listPyZh, listPyZhHant, listPyJa, listPyRu);
const LIST_JAVA = raw(listJavaEn, listJavaZh, listJavaZhHant, listJavaJa, listJavaRu);
const BFS_PY = raw(bfsPyEn, bfsPyZh, bfsPyZhHant, bfsPyJa, bfsPyRu);
const BFS_JAVA = raw(bfsJavaEn, bfsJavaZh, bfsJavaZhHant, bfsJavaJa, bfsJavaRu);
const DFS_PY = raw(dfsPyEn, dfsPyZh, dfsPyZhHant, dfsPyJa, dfsPyRu);
const DFS_JAVA = raw(dfsJavaEn, dfsJavaZh, dfsJavaZhHant, dfsJavaJa, dfsJavaRu);

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

const WORD = {
  list: { en: 'Linked list', zh: '链表', 'zh-hant': '鏈結串列', ja: '連結リスト', ru: 'Связный список' },
  tree: { en: 'Tree', zh: '树', 'zh-hant': '樹', ja: '木', ru: 'Дерево' },
  graph: { en: 'Graph', zh: '图', 'zh-hant': '圖', ja: 'グラフ', ru: 'Граф' },
  linear: { en: 'linear relationship', zh: '线性关系', 'zh-hant': '線性關係', ja: '線形関係', ru: 'линейные отношения' },
  divide: { en: 'divide and conquer', zh: '分治关系', 'zh-hant': '分治關係', ja: '分治関係', ru: 'отношения разделения' },
  network: { en: 'network relationship', zh: '网络关系', 'zh-hant': '網路關係', ja: 'ネットワーク関係', ru: 'сетевые отношения' },
  freedom: { en: 'higher degree of freedom', zh: '自由度更高', 'zh-hant': '自由度更高', ja: '自由度が高くなる', ru: 'больше свободы' },
  undirected: { en: 'Undirected graph', zh: '无向图', 'zh-hant': '無向圖', ja: '無向グラフ', ru: 'Неориентированный граф' },
  directed: { en: 'Directed graph', zh: '有向图', 'zh-hant': '有向圖', ja: '有向グラフ', ru: 'Ориентированный граф' },
  noDir: { en: 'edges without direction', zh: '边没有方向', 'zh-hant': '邊沒有方向', ja: '辺に方向がない', ru: 'ребра без направления' },
  withDir: { en: 'edges with direction', zh: '边具有方向', 'zh-hant': '邊具有方向', ja: '辺に方向がある', ru: 'ребра с направлением' },
  connected: { en: 'Connected graph', zh: '连通图', 'zh-hant': '連通圖', ja: '連結グラフ', ru: 'Связный граф' },
  disconnected: { en: 'Disconnected graph', zh: '非连通图', 'zh-hant': '非連通圖', ja: '非連結グラフ', ru: 'Несвязный граф' },
  allReach: { en: 'every vertex is reachable', zh: '所有顶点都可到达', 'zh-hant': '所有頂點都可到達', ja: 'すべての頂点に到達できる', ru: 'достижима любая вершина' },
  someNot: { en: 'some vertex is unreachable', zh: '存在无法到达的顶点', 'zh-hant': '存在無法到達的頂點', ja: '到達できない頂点がある', ru: 'есть недостижимая вершина' },
  unreachable: { en: 'unreachable', zh: '无法到达', 'zh-hant': '無法到達', ja: '到達不可', ru: 'недостижима' },
  unweighted: { en: 'Unweighted graph', zh: '无权图', 'zh-hant': '無權圖', ja: '重みなしグラフ', ru: 'Невзвешенный граф' },
  weighted: { en: 'Weighted graph', zh: '有权图', 'zh-hant': '有權圖', ja: '重み付きグラフ', ru: 'Взвешенный граф' },
  sameEdges: { en: 'all edges are equal', zh: '所有边都等价', 'zh-hant': '所有邊都等價', ja: 'すべての辺が等価', ru: 'все ребра равноценны' },
  hasWeight: { en: 'edges carry weights', zh: '边带有权重', 'zh-hant': '邊帶有權重', ja: '辺が重みを持つ', ru: 'у ребер есть веса' },
  vertexList: { en: 'vertex list', zh: '顶点列表', 'zh-hant': '頂點串列', ja: '頂点リスト', ru: 'список вершин' },
  index: { en: 'index', zh: '索引', 'zh-hant': '索引', ja: 'インデックス', ru: 'индекс' },
  diagonal: { en: 'main diagonal', zh: '主对角线', 'zh-hant': '主對角線', ja: '主対角線', ru: 'главная диагональ' },
  vertex: { en: 'vertex', zh: '顶点', 'zh-hant': '頂點', ja: '頂点', ru: 'вершина' },
  adjacent: { en: 'adjacent vertices', zh: '邻接顶点', 'zh-hant': '鄰接頂點', ja: '隣接頂点', ru: 'смежные вершины' },
  distance: { en: 'distance', zh: '距离', 'zh-hant': '距離', ja: '距離', ru: 'расстояние' },
  bfsOrder: { en: 'BFS order', zh: '遍历序列', 'zh-hant': '走訪序列', ja: '走査順序', ru: 'порядок обхода' },
  calls: { en: 'recursive calls', zh: '递归调用', 'zh-hant': '遞迴呼叫', ja: '再帰呼び出し', ru: 'рекурсивные вызовы' },
  stack: { en: 'call stack', zh: '调用栈', 'zh-hant': '呼叫堆疊', ja: '呼び出しスタック', ru: 'стек вызовов' },
  start: { en: 'start', zh: '起点', 'zh-hant': '起點', ja: '開始', ru: 'старт' },
  down: { en: 'recursion: go deeper', zh: '向下递推', 'zh-hant': '向下遞推', ja: '再帰呼び出し：さらに深く', ru: 'рекурсия: идём глубже' },
  up: { en: 'backtracking: return', zh: '向上回溯', 'zh-hant': '向上回溯', ja: 'バックトラック：戻る', ru: 'возврат назад' },
  current: { en: 'current vertex', zh: '当前顶点', 'zh-hant': '當前頂點', ja: '現在の頂点', ru: 'текущая вершина' },
  inQueue: { en: 'in the queue', zh: '在队列中', 'zh-hant': '在佇列中', ja: 'キューの中', ru: 'в очереди' },
  dequeued: { en: 'dequeued, in res', zh: '已出队，在 res 中', 'zh-hant': '已出列，在 res 中', ja: 'デキュー済み（res 内）', ru: 'извлечена, в res' },
  skipped: { en: 'already in visited: skipped', zh: '已在 visited 中，跳过', 'zh-hant': '已在 visited 中，跳過', ja: 'visited にあるのでスキップ', ru: 'уже в visited: пропуск' },
  visited: { en: 'visited', zh: '已访问', 'zh-hant': '已訪問', ja: '訪問済み', ru: 'посещена' },
  unvisited: { en: 'not visited yet', zh: '未访问', 'zh-hant': '未訪問', ja: '未訪問', ru: 'ещё не посещена' },
  edgeIn: { en: 'edge to a new vertex', zh: '通往新顶点的边', 'zh-hant': '通往新頂點的邊', ja: '新しい頂点への辺', ru: 'ребро к новой вершине' },
  layer: { en: 'current layer', zh: '当前层', 'zh-hant': '當前層', ja: '現在の層', ru: 'текущий слой' },
  earlier: { en: 'earlier layers', zh: '之前的层', 'zh-hant': '之前的層', ja: 'これまでの層', ru: 'прежние слои' },
  removed: { en: 'to be removed', zh: '将被删除', 'zh-hant': '將被刪除', ja: '削除対象', ru: 'будет удалено' },
  added: { en: 'added', zh: '新增', 'zh-hant': '新增', ja: '追加', ru: 'добавлено' },
} satisfies Record<string, T>;

/** List separator per locale, for "2, 4" in narration. */
const SEP: T = { en: ', ', zh: '、', 'zh-hant': '、', ja: '、', ru: ', ' };

const joinL = (l: Locale, xs: (number | string)[]) => xs.join(SEP[l]);

// ── Shared drawing helpers ────────────────────────────────────────────

type Pos = Record<number, [number, number]>;

/** The book's five-vertex graph: 1 and 5 on top, 3 and 2 below, 4 on the right. */
const BOOK_EDGES: [number, number][] = [
  [1, 2],
  [1, 3],
  [1, 5],
  [2, 3],
  [2, 4],
  [2, 5],
  [4, 5],
];

function bookPos(x0: number, y0: number, sx: number, sy: number, k = 1.75): Pos {
  return { 1: [x0, y0], 5: [x0 + sx, y0], 4: [x0 + sx * k, y0 + sy / 2], 3: [x0, y0 + sy], 2: [x0 + sx, y0 + sy] };
}

const verts = (prefix: string, pos: Pos, style: (v: number) => Partial<GraphVertex> = () => ({})): GraphVertex[] =>
  Object.entries(pos).map(([v, [x, y]]) => ({ id: `${prefix}${v}`, v: Number(v), x, y, ...style(Number(v)) }));

const edges = (prefix: string, list: [number, number][], style: (a: number, b: number) => Partial<GraphEdge> = () => ({})): GraphEdge[] =>
  list.map(([a, b]) => ({ a: `${prefix}${a}`, b: `${prefix}${b}`, ...style(a, b) }));

/** Same undirected edge, either way round. */
const sameEdge = (e: [number, number], a: number, b: number) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a);

/** A titled panel: a soft card with a bold title above and a short muted subtitle at its foot. */
function panel(id: string, x: number, w: number, top: number, h: number, title: string, sub: string): SceneNode[] {
  return [
    region(id, x, top, w, h, { tone: 'idle' }),
    text(`${id}:t`, x + w / 2, top - 9, title, { anchor: 'middle', size: 13, bold: true }),
    text(`${id}:s`, x + w / 2, top + h - 11, sub, { anchor: 'middle', size: 11, tone: 'muted' }),
  ];
}

/** A small weight label sitting on an edge's midpoint. */
function weightChip(id: string, a: [number, number], b: [number, number], value: string): BoxNode {
  const w = Math.round(textWidth(value, 11, true) + 8);
  return box(id, (a[0] + b[0]) / 2 - w / 2, (a[1] + b[1]) / 2 - 10, value, { w, h: 20, shape: 'chip', size: 11 });
}

/**
 * A step of a depth-first walk drawn beside the edge it follows: going deeper is a straight
 * dashed arrow, backtracking a curved one. Both sit on their own left-hand side, so the way
 * down and the way back never overlap.
 */
function walkArrow(id: string, a: BoxNode, b: BoxNode, back: boolean, extra: Partial<ArrowNode> = {}): ArrowNode {
  const base = link(id, a, b, { pad: 4 });
  const [x1, y1] = base.from;
  const [x2, y2] = base.to;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 7;
  const ny = ((x2 - x1) / len) * 7;
  return arrow(id, [x1 + nx, y1 + ny], [x2 + nx, y2 + ny], { dashed: true, width: 1.5, tone: back ? 'warn' : 'info', bend: back ? 7 : 0, ...extra });
}

// ── 1. Linked list, tree, graph ───────────────────────────────────────

const LTG_NOTE: T = {
  en: 'Seen as nodes and references, a graph extends a linked list. A list links each node to one next node, a tree links a node to its children, and a graph lets any vertex connect to any other: the most freedom, and the most complexity.',
  zh: '把顶点看作节点、把边看作引用，图就是从链表拓展而来的数据结构。链表中每个节点只指向下一个节点，树中节点指向其子节点，而图中任意顶点都可以相连：自由度最高，也最复杂。',
  'zh-hant': '把頂點看作節點、把邊看作引用，圖就是從鏈結串列拓展而來的資料結構。鏈結串列中每個節點只指向下一個節點，樹中節點指向其子節點，而圖中任意頂點都可以相連：自由度最高，也最複雜。',
  ja: '頂点をノード、辺を参照とみなすと、グラフは連結リストを拡張した構造です。連結リストは次のノードだけ、木は子ノードだけを指しますが、グラフでは任意の頂点どうしを結べます。自由度が最も高く、最も複雑です。',
  ru: 'Если вершины — это узлы, а ребра — ссылки, граф расширяет связный список. В списке узел ссылается на следующий, в дереве — на дочерние узлы, а в графе любая вершина может соединяться с любой: свободы больше всего, как и сложности.',
};

const linkedlistTreeGraph: StaticFigure = {
  type: 'static',
  build(l) {
    const r = 13;
    const top = 34;
    const h = 214;
    const panels = [
      { id: 'pl', x: 6, title: WORD.list[l], sub: WORD.linear[l] },
      { id: 'pt', x: 152, title: WORD.tree[l], sub: WORD.divide[l] },
      { id: 'pg', x: 298, title: WORD.graph[l], sub: WORD.network[l] },
    ];
    const list = drawGraph(
      'l',
      [1, 2, 3, 4, 5].map((v, k) => ({ id: `l${v}`, v, x: 74, y: 52 + k * 38 })),
      [1, 2, 3, 4].map((v) => ({ a: `l${v}`, b: `l${v + 1}`, directed: true })),
      { r },
    );
    const treePos: Pos = { 1: [220, 66], 2: [190, 126], 3: [250, 126], 4: [166, 186], 5: [214, 186] };
    const tree = drawGraph(
      't',
      verts('t', treePos),
      edges('t', [
        [1, 2],
        [1, 3],
        [2, 4],
        [2, 5],
      ]).map((e) => ({ ...e, directed: true })),
      { r },
    );
    const graph = drawGraph('g', verts('g', bookPos(322, 76, 56, 104, 1.6)), edges('g', BOOK_EDGES), { r });
    const nodes: SceneNode[] = [
      ...panels.flatMap((p) => panel(p.id, p.x, 136, top, h, p.title, p.sub)),
      ...list.nodes,
      ...tree.nodes,
      ...graph.nodes,
      arrow('free', [30, 268], [410, 268], { tone: 'accent', width: 2 }),
      text('free:t', 220, 290, WORD.freedom[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
    ];
    return { scene: { w: W, h: 300, nodes }, notes: [LTG_NOTE[l]] };
  },
};

// ── 2–4. Kinds of graphs: two panels side by side ─────────────────────

const PANEL = { top: 34, h: 196, w: 212, left: 6, right: 224 };

/** Two panels with the book's graph in each; `draw` fills a panel given its left edge. */
function twoPanels(titles: [string, string], subs: [string, string], draw: (side: 0 | 1, x0: number) => SceneNode[]): SceneNode[] {
  return [
    ...panel('pa', PANEL.left, PANEL.w, PANEL.top, PANEL.h, titles[0], subs[0]),
    ...panel('pb', PANEL.right, PANEL.w, PANEL.top, PANEL.h, titles[1], subs[1]),
    ...draw(0, PANEL.left),
    ...draw(1, PANEL.right),
  ];
}

const panelPos = (x0: number) => bookPos(x0 + 36, 76, 84, 104, 1.76);

const DIRECTED_NOTE: T = {
  en: 'In an undirected graph an edge links two vertices both ways, like a friendship. In a directed graph A → B and B → A are separate edges, like following someone and being followed back.',
  zh: '无向图中的边表示两顶点之间的“双向”连接，例如好友关系；有向图中 A → B 和 B → A 是两条相互独立的边，例如“关注”与“被关注”。',
  'zh-hant': '無向圖中的邊表示兩頂點之間的“雙向”連線，例如好友關係；有向圖中 A → B 和 B → A 是兩條相互獨立的邊，例如“關注”與“被關注”。',
  ja: '無向グラフの辺は 2 つの頂点を双方向に結びます（友だち関係など）。有向グラフでは A → B と B → A は別々の辺です（フォローとフォロワーなど）。',
  ru: 'В неориентированном графе ребро связывает две вершины в обе стороны, как дружба. В ориентированном графе A → B и B → A — разные ребра, как подписка и ответная подписка.',
};

const DIRECTED_EDGES: [number, number, number?][] = [
  [5, 1],
  [1, 3, 5],
  [3, 1, 5],
  [2, 1],
  [3, 2],
  [2, 5],
  [5, 4, 5],
  [4, 5, 5],
  [2, 4],
];

const directedGraph: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = twoPanels([WORD.undirected[l], WORD.directed[l]], [WORD.noDir[l], WORD.withDir[l]], (side, x0) => {
      const p = side ? 'b' : 'a';
      const es: GraphEdge[] = side
        ? DIRECTED_EDGES.map(([a, b, bend]) => ({ a: `${p}${a}`, b: `${p}${b}`, directed: true, bend }))
        : edges(p, BOOK_EDGES);
      return drawGraph(p, verts(p, panelPos(x0)), es).nodes;
    });
    return { scene: { w: W, h: 240, nodes }, notes: [DIRECTED_NOTE[l]] };
  },
};

const CONNECTED_NOTE: T = {
  en: 'In a connected graph, starting from any vertex you can reach every other vertex. In a disconnected graph, at least one vertex cannot be reached: here nothing leads to vertex 4.',
  zh: '对于连通图，从某个顶点出发可以到达其余任意顶点；对于非连通图，至少有一个顶点无法到达，例如这里的顶点 4。',
  'zh-hant': '對於連通圖，從某個頂點出發可以到達其餘任意頂點；對於非連通圖，至少有一個頂點無法到達，例如這裡的頂點 4。',
  ja: '連結グラフでは、どの頂点から出発してもほかのすべての頂点に到達できます。非連結グラフでは到達できない頂点が少なくとも 1 つあります。ここでは頂点 4 です。',
  ru: 'В связном графе из любой вершины можно дойти до всех остальных. В несвязном хотя бы одна вершина недостижима — здесь это вершина 4.',
};

const connectedGraph: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = twoPanels([WORD.connected[l], WORD.disconnected[l]], [WORD.allReach[l], WORD.someNot[l]], (side, x0) => {
      const p = side ? 'b' : 'a';
      const pos = panelPos(x0);
      const es = side ? BOOK_EDGES.filter(([a, b]) => a !== 4 && b !== 4) : BOOK_EDGES;
      const out = drawGraph(p, verts(p, pos, (v) => (side && v === 4 ? { tone: 'danger', dashed: true } : {})), edges(p, es)).nodes;
      if (side) {
        const half = textWidth(WORD.unreachable[l], 11) / 2;
        out.push(text('b4:t', Math.min(pos[4][0], PANEL.right + PANEL.w - 6 - half), pos[4][1] - 27, WORD.unreachable[l], { anchor: 'middle', size: 11, bold: true, tone: 'danger' }));
      }
      return out;
    });
    return { scene: { w: W, h: 240, nodes }, notes: [CONNECTED_NOTE[l]] };
  },
};

const WEIGHTS: Record<string, string> = { '1-2': '0.5', '1-3': '0.2', '1-5': '0.25', '2-3': '0.3', '2-4': '1.0', '2-5': '0.7', '4-5': '0.88' };

const WEIGHTED_NOTE: T = {
  en: 'Adding a weight to every edge gives a weighted graph. For example, a game can rate how close two players are by how long they have played together.',
  zh: '为边添加“权重”变量，就得到有权图。例如游戏可以根据共同游戏时间计算玩家之间的“亲密度”。',
  'zh-hant': '為邊新增“權重”變數，就得到有權圖。例如遊戲可以根據共同遊戲時間計算玩家之間的“親密度”。',
  ja: '辺に「重み」を加えると重み付きグラフになります。例えばゲームでは、一緒に遊んだ時間からプレイヤー間の「親密度」を計算できます。',
  ru: 'Если добавить каждому ребру вес, получится взвешенный граф. Например, игра может оценивать «близость» игроков по времени совместной игры.',
};

const weightedGraph: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = twoPanels([WORD.unweighted[l], WORD.weighted[l]], [WORD.sameEdges[l], WORD.hasWeight[l]], (side, x0) => {
      const p = side ? 'b' : 'a';
      const pos = panelPos(x0);
      const out = drawGraph(p, verts(p, pos), edges(p, BOOK_EDGES)).nodes;
      if (side) for (const [a, b] of BOOK_EDGES) out.push(weightChip(`w${a}-${b}`, pos[a], pos[b], WEIGHTS[`${a}-${b}`]));
      return out;
    });
    return { scene: { w: W, h: 240, nodes }, notes: [WEIGHTED_NOTE[l]] };
  },
};

// ── Adjacency matrix drawing ──────────────────────────────────────────

interface MatrixLook {
  x: number;
  y: number;
  cell: number;
  gap: number;
  /** Radius of the vertex circles that head rows and columns. */
  r: number;
  size: number;
  /** Highlighted cells by `row-col` vertex values. */
  cells?: Map<string, Tone>;
  /** A whole row and column, e.g. a vertex being added or removed. */
  line?: { v: number; tone: Tone };
  /** Header circles by vertex. */
  heads?: Map<number, Tone>;
}

/** An adjacency matrix with vertex circles heading each row and column and index labels outside them. Cells keep their vertex pair as id, so removing a row lets the rest glide up and left. */
function matrixNodes(vs: number[], has: (a: number, b: number) => boolean, look: MatrixLook): SceneNode[] {
  const { x, y, cell, gap, r, size } = look;
  const step = cell + gap;
  const nodes: SceneNode[] = [];
  vs.forEach((v, k) => {
    const headTone = look.heads?.get(v) ?? (look.line?.v === v ? look.line.tone : 'ok');
    const ring = look.heads?.has(v) ?? false;
    const cx = x + k * step + cell / 2;
    const cy = y + k * step + cell / 2;
    nodes.push(
      box(`ch${v}`, cx - r, y - 2 * r - 8, v, { w: 2 * r, h: 2 * r, shape: 'circle', size: 12, tone: headTone, ring }),
      box(`rh${v}`, x - 2 * r - 8, cy - r, v, { w: 2 * r, h: 2 * r, shape: 'circle', size: 12, tone: headTone, ring }),
      text(`ci${k}`, cx, y - 2 * r - 16, String(k), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
      text(`ri${k}`, x - 2 * r - 18, cy + 4, String(k), { anchor: 'end', mono: true, size: 11, tone: 'muted' }),
    );
  });
  vs.forEach((a, i) =>
    vs.forEach((b, j) => {
      const one = a !== b && has(a, b);
      const hl = look.cells?.get(`${a}-${b}`);
      const lineTone = look.line && (look.line.v === a || look.line.v === b) ? look.line.tone : undefined;
      nodes.push(
        box(`m${a}-${b}`, x + j * step, y + i * step, one ? '1' : '0', {
          w: cell,
          h: cell,
          size,
          tone: hl ?? lineTone ?? (one ? 'idle' : 'ghost'),
          ring: hl !== undefined,
        }),
      );
    }),
  );
  return nodes;
}

/** Labels left of the column headers: the vertex list and the index row. */
function headLabels(look: { x: number; y: number; r: number }, vertexLabel: string, mono: boolean, indexLabel: string) {
  const x = look.x - 2 * look.r - 16;
  return [
    text('vl', x, look.y - look.r - 8 + 4, vertexLabel, { anchor: 'end', size: 11, bold: true, mono, tone: 'muted' }),
    text('il', x, look.y - 2 * look.r - 16, indexLabel, { anchor: 'end', size: 11, tone: 'muted' }),
  ];
}

// ── 5. Adjacency matrix ───────────────────────────────────────────────

const MAT_V = [1, 3, 2, 5, 4];

const MATRIX_SAY: Record<'init' | 'edge' | 'none' | 'diag', T> = {
  init: {
    en: 'Vertex list V = [1, 3, 2, 5, 4]. Row i and column i both stand for vertex V[i], and M[i][j] = 1 means V[i] and V[j] share an edge.',
    zh: '顶点列表 V = [1, 3, 2, 5, 4]。第 i 行和第 i 列都代表顶点 V[i]，M[i][j] = 1 表示 V[i] 与 V[j] 之间存在边。',
    'zh-hant': '頂點串列 V = [1, 3, 2, 5, 4]。第 i 行和第 i 列都代表頂點 V[i]，M[i][j] = 1 表示 V[i] 與 V[j] 之間存在邊。',
    ja: '頂点リスト V = [1, 3, 2, 5, 4]。第 i 行と第 i 列はどちらも頂点 V[i] を表し、M[i][j] = 1 は V[i] と V[j] の間に辺があることを示します。',
    ru: 'Список вершин V = [1, 3, 2, 5, 4]. Строка i и столбец i соответствуют вершине V[i], а M[i][j] = 1 означает ребро между V[i] и V[j].',
  },
  edge: {
    en: 'Edge {a}–{b}: vertex {a} has index {i} and vertex {b} has index {j}, so M[{i}][{j}] = M[{j}][{i}] = 1.',
    zh: '边 {a}–{b}：顶点 {a} 的索引为 {i}，顶点 {b} 的索引为 {j}，因此 M[{i}][{j}] = M[{j}][{i}] = 1。',
    'zh-hant': '邊 {a}–{b}：頂點 {a} 的索引為 {i}，頂點 {b} 的索引為 {j}，因此 M[{i}][{j}] = M[{j}][{i}] = 1。',
    ja: '辺 {a}–{b}：頂点 {a} のインデックスは {i}、頂点 {b} は {j} なので、M[{i}][{j}] = M[{j}][{i}] = 1 です。',
    ru: 'Ребро {a}–{b}: у вершины {a} индекс {i}, у вершины {b} — {j}, поэтому M[{i}][{j}] = M[{j}][{i}] = 1.',
  },
  none: {
    en: 'Vertices {a} and {b} are not adjacent, so M[{i}][{j}] = M[{j}][{i}] = 0.',
    zh: '顶点 {a} 与 {b} 不邻接，因此 M[{i}][{j}] = M[{j}][{i}] = 0。',
    'zh-hant': '頂點 {a} 與 {b} 不鄰接，因此 M[{i}][{j}] = M[{j}][{i}] = 0。',
    ja: '頂点 {a} と {b} は隣接していないので、M[{i}][{j}] = M[{j}][{i}] = 0 です。',
    ru: 'Вершины {a} и {b} не смежны, поэтому M[{i}][{j}] = M[{j}][{i}] = 0.',
  },
  diag: {
    en: 'An undirected edge counts both ways, so the matrix is symmetric about the main diagonal. The diagonal itself means nothing: a vertex has no edge to itself.',
    zh: '无向图中两个方向的边等价，因此邻接矩阵关于主对角线对称。主对角线元素没有意义：顶点不能与自身相连。',
    'zh-hant': '無向圖中兩個方向的邊等價，因此鄰接矩陣關於主對角線對稱。主對角線元素沒有意義：頂點不能與自身相連。',
    ja: '無向グラフでは 2 方向の辺が等価なので、隣接行列は主対角線に関して対称です。頂点は自分自身と接続できないため、主対角線の要素には意味がありません。',
    ru: 'Ребро неориентированного графа действует в обе стороны, поэтому матрица симметрична относительно главной диагонали. Сама диагональ не несет смысла: вершина не соединена сама с собой.',
  },
};

const adjacencyMatrix: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', edge: 'cmp', none: 'swp', diag: 'done' },
  build(l) {
    const pos = bookPos(34, 92, 84, 108, 1.76);
    const look = { x: 270, y: 72, cell: 30, gap: 2, r: 11, size: 13 };
    const has = (a: number, b: number) => BOOK_EDGES.some((e) => sameEdge(e, a, b));
    const end = look.x + 5 * (look.cell + look.gap) - look.gap;
    const scene = (pair: [number, number] | null, tone: Tone, diag: boolean) => {
      const on = (v: number) => pair !== null && pair.includes(v);
      const cells = new Map<string, Tone>();
      const heads = new Map<number, Tone>();
      if (pair) {
        cells.set(`${pair[0]}-${pair[1]}`, tone).set(`${pair[1]}-${pair[0]}`, tone);
        heads.set(pair[0], tone).set(pair[1], tone);
      }
      const g = drawGraph(
        'g',
        verts('g', pos, (v) => (on(v) ? { tone, ring: true } : {})),
        edges('g', BOOK_EDGES, (a, b) => (pair && sameEdge(pair, a, b) ? { tone } : {})),
      );
      const nodes: SceneNode[] = [
        ...g.nodes,
        ...matrixNodes(MAT_V, has, { ...look, cells, heads }),
        ...headLabels(look, WORD.vertexList[l], false, WORD.index[l]),
        { kind: 'path', id: 'diag', d: `M ${look.x - 6} ${look.y - 6} L ${end + 6} ${end - look.x + look.y + 6}`, tone: diag ? 'accent' : 'muted', dashed: true, width: diag ? 2 : 1.25 },
        text('dl', end + 4, end - look.x + look.y + 26, WORD.diagonal[l], { anchor: 'end', size: 11, bold: diag, tone: diag ? 'accent' : 'muted' }),
      ];
      return { w: W, h: 262, nodes };
    };
    const idx = (v: number) => MAT_V.indexOf(v);
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null, 'accent', false), say: MATRIX_SAY.init[l] }];
    for (const [a, b] of [
      [1, 2],
      [3, 2],
      [5, 4],
    ] as [number, number][]) {
      frames.push({ kind: 'edge', scene: scene([a, b], 'accent', false), say: fmt(MATRIX_SAY.edge[l], { a, b, i: idx(a), j: idx(b) }) });
    }
    frames.push({ kind: 'none', scene: scene([1, 4], 'warn', false), say: fmt(MATRIX_SAY.none[l], { a: 1, b: 4, i: idx(1), j: idx(4) }) });
    frames.push({ kind: 'diag', scene: scene(null, 'accent', true), say: MATRIX_SAY.diag[l] });
    return { frames };
  },
};

// ── Adjacency list drawing ────────────────────────────────────────────

interface ListLook {
  /** Center of the vertex column. */
  x: number;
  /** Center of the first row. */
  y: number;
  rowGap: number;
  r: number;
  /** Center of the first list node and the step between nodes. */
  nx: number;
  nstep: number;
  nr: number;
  heads?: Map<number, Tone>;
  /** List nodes by `owner-vertex`. */
  items?: Map<string, Tone>;
  dimOthers?: number;
}

/** Vertices in a framed column, each followed by its list of adjacent vertices. Nodes are id'd by owner and value, so lists can grow, shrink and move rows smoothly. */
function listNodes(keys: number[], lists: Record<number, number[]>, look: ListLook): SceneNode[] {
  const { x, y, rowGap, r, nx, nstep, nr } = look;
  const nodes: SceneNode[] = [region('col', x - r - 5, y - r - 5, 2 * r + 10, (keys.length - 1) * rowGap + 2 * r + 10, { tone: 'ok' })];
  keys.forEach((k, row) => {
    const cy = y + row * rowGap;
    const dim = look.dimOthers !== undefined && look.dimOthers !== k;
    const head = box(`h${k}`, x - r, cy - r, k, { w: 2 * r, h: 2 * r, shape: 'circle', tone: look.heads?.get(k) ?? 'ok', ring: look.heads?.has(k), dim });
    nodes.push(head);
    let prev: BoxNode = head;
    (lists[k] ?? []).forEach((v, i) => {
      const t = look.items?.get(`${k}-${v}`);
      const node = box(`n${k}-${v}`, nx + i * nstep - nr, cy - nr, v, { w: 2 * nr, h: 2 * nr, shape: 'circle', size: 13, tone: t ?? 'ok', ring: t !== undefined, dim });
      nodes.push(link(`a${k}-${v}`, prev, node, { pad: 2, width: 1.5, dim }), node);
      prev = node;
    });
  });
  return nodes;
}

// ── 6. Adjacency list ─────────────────────────────────────────────────

const BOOK_LISTS: Record<number, number[]> = { 1: [2, 3, 5], 3: [1, 2], 2: [1, 3, 5, 4], 5: [1, 2, 4], 4: [2, 5] };

const LIST_SAY: Record<'init' | 'row' | 'done', T> = {
  init: {
    en: 'An adjacency list keeps one list per vertex. The list of vertex i stores every vertex adjacent to i.',
    zh: '邻接表为每个顶点维护一个链表，第 i 个链表存储顶点 i 的所有邻接顶点。',
    'zh-hant': '鄰接表為每個頂點維護一個鏈結串列，第 i 個鏈結串列儲存頂點 i 的所有鄰接頂點。',
    ja: '隣接リストは頂点ごとに 1 本の連結リストを持ち、頂点 i のリストには i に隣接するすべての頂点を格納します。',
    ru: 'Список смежности хранит по одному списку на вершину: список вершины i содержит все смежные с ней вершины.',
  },
  row: {
    en: 'Vertex {v} has {n} edges, to {list}: its list holds exactly these vertices.',
    zh: '顶点 {v} 有 {n} 条边，连向 {list}，它的链表恰好存储这些顶点。',
    'zh-hant': '頂點 {v} 有 {n} 條邊，連向 {list}，它的鏈結串列恰好儲存這些頂點。',
    ja: '頂点 {v} には {n} 本の辺があり、{list} とつながっています。そのリストにはちょうどこれらの頂点が入ります。',
    ru: 'Вершина {v}: {n} ребра — к вершинам {list}, и ее список хранит именно их.',
  },
  done: {
    en: 'Only edges that exist are stored, each one twice, once in the list of each end: 7 edges, 14 list nodes.',
    zh: '邻接表只存储实际存在的边，且每条边在两端顶点的链表中各存一次：7 条边，共 14 个链表节点。',
    'zh-hant': '鄰接表只儲存實際存在的邊，且每條邊在兩端頂點的鏈結串列中各存一次：7 條邊，共 14 個鏈結串列節點。',
    ja: '実際に存在する辺だけを、両端の頂点のリストに 1 回ずつ格納します。辺 7 本でノードは 14 個です。',
    ru: 'Хранятся только существующие ребра, каждое дважды — в списках обоих концов: 7 ребер, 14 узлов.',
  },
};

/** Russian count agreement for "N ребро/ребра/ребер". */
const ruEdges = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'ребро' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'ребра' : 'ребер');

const adjacencyList: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', row: 'cmp', done: 'done' },
  build(l) {
    const pos = bookPos(34, 92, 84, 108, 1.76);
    const keys = [1, 3, 2, 5, 4];
    const look = { x: 252, y: 58, rowGap: 40, r: 14, nx: 298, nstep: 38, nr: 13 };
    const scene = (focus: number | null) => {
      const heads = new Map<number, Tone>();
      const items = new Map<string, Tone>();
      if (focus !== null) {
        heads.set(focus, 'accent');
        for (const v of BOOK_LISTS[focus]) items.set(`${focus}-${v}`, 'info');
      }
      const g = drawGraph(
        'g',
        verts('g', pos, (v) => (v === focus ? { tone: 'accent', ring: true } : focus !== null && BOOK_LISTS[focus].includes(v) ? { tone: 'info' } : {})),
        edges('g', BOOK_EDGES, (a, b) => (focus !== null && (a === focus || b === focus) ? { tone: 'accent' } : {})),
      );
      const right = look.nx + 3 * look.nstep + look.nr;
      const nodes: SceneNode[] = [
        ...g.nodes,
        ...listNodes(keys, BOOK_LISTS, { ...look, heads, items, dimOthers: focus ?? undefined }),
        text('vl', look.x, 22, WORD.vertex[l], { anchor: 'middle', size: 11, bold: true, tone: 'muted' }),
        brace('br', look.nx - look.nr, right, 38, 'up'),
        text('al', (look.nx - look.nr + right) / 2, 14, WORD.adjacent[l], { anchor: 'middle', size: 11, bold: true, tone: 'muted' }),
      ];
      return { w: W, h: 262, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'init', scene: scene(null), say: LIST_SAY.init[l] }];
    for (const v of keys) {
      const n = BOOK_LISTS[v].length;
      frames.push({
        kind: 'row',
        scene: scene(v),
        say: fmt(LIST_SAY.row[l], { v, n, list: joinL(l, BOOK_LISTS[v]) }).replace(' ребра ', ` ${ruEdges(n)} `),
      });
    }
    frames.push({ kind: 'done', scene: scene(null), say: LIST_SAY.done[l] });
    return { frames };
  },
};

// ── 7–8. Operations: shared state ─────────────────────────────────────

/** Initial graph of the operations pages: the book's graph without edge 1–2. */
const OPS_EDGES: [number, number][] = BOOK_EDGES.filter((e) => !sameEdge(e, 1, 2));

const opsPos = (): Pos => ({ ...bookPos(30, 80, 82, 108, 1.75), 6: [173.5, 226] });

/** Graph of an operations step: vertices `vs`, edges `es`, with highlights. */
function opsGraph(vs: number[], es: [number, number][], hl: { verts?: Map<number, Tone>; edges?: { e: [number, number]; tone: Tone; dashed?: boolean }[] }) {
  const pos = opsPos();
  const shown: Pos = Object.fromEntries(vs.map((v) => [v, pos[v]]));
  return drawGraph(
    'g',
    verts('g', shown, (v) => (hl.verts?.has(v) ? { tone: hl.verts.get(v), ring: true } : {})),
    edges('g', es, (a, b) => {
      const h = hl.edges?.find((x) => sameEdge(x.e, a, b));
      return h ? { tone: h.tone, dashed: h.dashed } : {};
    }),
  ).nodes;
}

type OpKind = 'init' | 'add_edge' | 'remove_edge' | 'add_vertex' | 'remove_vertex' | 'removed';

const OP_TONES: Record<OpKind, 'idle' | 'cmp' | 'swp' | 'done'> = {
  init: 'idle',
  add_edge: 'cmp',
  remove_edge: 'swp',
  add_vertex: 'cmp',
  remove_vertex: 'swp',
  removed: 'done',
};

// ── 7. Adjacency matrix operations ────────────────────────────────────

const MAT_OPS_SAY: Record<OpKind, T> = {
  init: {
    en: 'Initialize with vertices 1, 3, 2, 5, 4: a vertex list of length 5, O(n), and a 5 × 5 adjacency matrix, O(n²).',
    zh: '传入顶点 1、3、2、5、4 进行初始化：长度为 5 的顶点列表，O(n)；5 × 5 的邻接矩阵，O(n²)。',
    'zh-hant': '傳入頂點 1、3、2、5、4 進行初始化：長度為 5 的頂點串列，O(n)；5 × 5 的鄰接矩陣，O(n²)。',
    ja: '頂点 1、3、2、5、4 で初期化します。長さ 5 の頂点リストに O(n)、5 × 5 の隣接行列に O(n²) かかります。',
    ru: 'Инициализация вершинами 1, 3, 2, 5, 4: список вершин длины 5 за O(n) и матрица смежности 5 × 5 за O(n²).',
  },
  add_edge: {
    en: 'Add edge 1–2, at indices 0 and 2: set M[0][2] and M[2][0] to 1. Both directions change, in O(1).',
    zh: '添加边 1–2（索引 0 和 2）：将 M[0][2] 和 M[2][0] 设为 1。两个方向同时更新，O(1)。',
    'zh-hant': '新增邊 1–2（索引 0 和 2）：將 M[0][2] 和 M[2][0] 設為 1。兩個方向同時更新，O(1)。',
    ja: '辺 1–2（インデックス 0 と 2）を追加します。M[0][2] と M[2][0] を 1 にし、2 方向を同時に更新します。O(1)。',
    ru: 'Добавляем ребро 1–2 (индексы 0 и 2): M[0][2] и M[2][0] становятся 1. Меняются оба направления, O(1).',
  },
  remove_edge: {
    en: 'Remove edge 1–3, at indices 0 and 1: set M[0][1] and M[1][0] to 0, in O(1).',
    zh: '删除边 1–3（索引 0 和 1）：将 M[0][1] 和 M[1][0] 设为 0，O(1)。',
    'zh-hant': '刪除邊 1–3（索引 0 和 1）：將 M[0][1] 和 M[1][0] 設為 0，O(1)。',
    ja: '辺 1–3（インデックス 0 と 1）を削除します。M[0][1] と M[1][0] を 0 にします。O(1)。',
    ru: 'Удаляем ребро 1–3 (индексы 0 и 1): M[0][1] и M[1][0] становятся 0, O(1).',
  },
  add_vertex: {
    en: 'Add vertex 6: append it to the vertex list, then add a row and a column filled with 0, in O(n).',
    zh: '添加顶点 6：将其加入顶点列表尾部，并在邻接矩阵尾部添加一行一列，全部填 0，O(n)。',
    'zh-hant': '新增頂點 6：將其加入頂點串列尾部，並在鄰接矩陣尾部新增一行一列，全部填 0，O(n)。',
    ja: '頂点 6 を追加します。頂点リストの末尾に加え、行列の末尾に 0 で埋めた 1 行 1 列を追加します。O(n)。',
    ru: 'Добавляем вершину 6: дописываем ее в список вершин и добавляем строку и столбец из нулей, O(n).',
  },
  remove_vertex: {
    en: 'Remove vertex 3, at index 1: its entry in the vertex list, row 1 and column 1 all have to go.',
    zh: '删除顶点 3（索引 1）：需要删除它在顶点列表中的元素，以及第 1 行和第 1 列。',
    'zh-hant': '刪除頂點 3（索引 1）：需要刪除它在頂點串列中的元素，以及第 1 行和第 1 列。',
    ja: '頂点 3（インデックス 1）を削除します。頂点リストの要素と、第 1 行・第 1 列を取り除きます。',
    ru: 'Удаляем вершину 3 с индексом 1: из списка вершин и из матрицы уходят ее элемент, строка 1 и столбец 1.',
  },
  removed: {
    en: 'Everything below and to the right moves up and to the left by one. Removing the first row and column is the worst case: (n − 1)² moves, O(n²).',
    zh: '其后的元素都要“向左上移动”一格。删除首行首列时最差，需要移动 (n − 1)² 个元素，O(n²)。',
    'zh-hant': '其後的元素都要“向左上移動”一格。刪除首行首列時最差，需要移動 (n − 1)² 個元素，O(n²)。',
    ja: '後ろの要素はすべて 1 つずつ「左上へ移動」します。先頭行と先頭列を削除する場合が最悪で、(n − 1)² 個を動かすため O(n²) です。',
    ru: 'Все элементы правее и ниже сдвигаются влево вверх на одну позицию. Худший случай — удаление первой строки и столбца: (n − 1)² сдвигов, O(n²).',
  },
};

const adjacencyMatrixSteps: StepFigure = {
  type: 'steps',
  tones: OP_TONES,
  call: 'GraphAdjMat(vertices, edges)',
  sources: classSources(MAT_PY, MAT_JAVA, 'GraphAdjMat', ['__init__', 'add_edge', 'remove_edge', 'add_vertex', 'remove_vertex'], {
    python: {
      init: ['self.add_vertex(val)', 'self.add_edge(e[0], e[1])'],
      add_edge: ['self.adj_mat[i][j] = 1', 'self.adj_mat[j][i] = 1'],
      remove_edge: ['self.adj_mat[i][j] = 0', 'self.adj_mat[j][i] = 0'],
      add_vertex: ['self.vertices.append(val)', 'self.adj_mat.append(new_row)', 'row.append(0)'],
      remove_vertex: ['self.vertices.pop(index)'],
      removed: ['self.adj_mat.pop(index)', 'row.pop(index)'],
    },
    java: {
      init: ['addVertex(val);', 'addEdge(e[0], e[1]);'],
      add_edge: ['adjMat.get(i).set(j, 1);', 'adjMat.get(j).set(i, 1);'],
      remove_edge: ['adjMat.get(i).set(j, 0);', 'adjMat.get(j).set(i, 0);'],
      add_vertex: ['vertices.add(val);', 'adjMat.add(newRow);', 'row.add(0);'],
      remove_vertex: ['vertices.remove(index);'],
      removed: ['adjMat.remove(index);', 'row.remove(index);'],
    },
  }),
  build(l) {
    const look = { x: 268, y: 62, cell: 26, gap: 2, r: 10, size: 12 };
    const scene = (
      vs: number[],
      es: [number, number][],
      hl: { cells?: [number, number][]; cellTone?: Tone; line?: { v: number; tone: Tone }; heads?: number[]; verts?: Map<number, Tone>; edges?: { e: [number, number]; tone: Tone; dashed?: boolean }[] },
    ) => {
      const has = (a: number, b: number) => es.some((e) => sameEdge(e, a, b));
      const cells = new Map<string, Tone>();
      for (const [a, b] of hl.cells ?? []) cells.set(`${a}-${b}`, hl.cellTone ?? 'accent').set(`${b}-${a}`, hl.cellTone ?? 'accent');
      const heads = new Map<number, Tone>((hl.heads ?? []).map((v) => [v, hl.cellTone ?? hl.line?.tone ?? 'accent']));
      const nodes: SceneNode[] = [
        ...opsGraph(vs, es, hl),
        ...matrixNodes(vs, has, { ...look, cells, heads, line: hl.line }),
        ...headLabels(look, 'vertices', true, WORD.index[l]),
      ];
      return { w: W, h: 250, nodes };
    };
    const v0 = [1, 3, 2, 5, 4];
    const e1: [number, number][] = [...OPS_EDGES, [1, 2]];
    const e2 = e1.filter((e) => !sameEdge(e, 1, 3));
    const v1 = [...v0, 6];
    const v2 = v1.filter((v) => v !== 3);
    const e3 = e2.filter(([a, b]) => a !== 3 && b !== 3);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(v0, OPS_EDGES, {}), say: MAT_OPS_SAY.init[l] },
      {
        kind: 'add_edge',
        call: 'add_edge(0, 2)',
        scene: scene(v0, e1, { cells: [[1, 2]], heads: [1, 2], verts: new Map([[1, 'accent'], [2, 'accent']]), edges: [{ e: [1, 2], tone: 'accent' }] }),
        say: MAT_OPS_SAY.add_edge[l],
      },
      {
        kind: 'remove_edge',
        call: 'remove_edge(0, 1)',
        scene: scene(v0, e2, { cells: [[1, 3]], cellTone: 'danger', heads: [1, 3], verts: new Map([[1, 'danger'], [3, 'danger']]) }),
        say: MAT_OPS_SAY.remove_edge[l],
      },
      {
        kind: 'add_vertex',
        call: 'add_vertex(6)',
        scene: scene(v1, e2, { line: { v: 6, tone: 'info' }, verts: new Map([[6, 'info']]) }),
        say: MAT_OPS_SAY.add_vertex[l],
      },
      {
        kind: 'remove_vertex',
        call: 'remove_vertex(1)',
        scene: scene(v1, e2, { line: { v: 3, tone: 'danger' }, verts: new Map([[3, 'danger']]), edges: [{ e: [3, 2], tone: 'danger', dashed: true }] }),
        say: MAT_OPS_SAY.remove_vertex[l],
      },
      { kind: 'removed', call: 'remove_vertex(1)', scene: scene(v2, e3, {}), say: MAT_OPS_SAY.removed[l] },
    ];
    return { frames, legend: [{ tone: 'info', text: WORD.added[l] }, { tone: 'danger', text: WORD.removed[l] }] satisfies LegendItem[] };
  },
};

// ── 8. Adjacency list operations ──────────────────────────────────────

const LIST_OPS_SAY: Record<OpKind, T> = {
  init: {
    en: 'Initialize from the edges: create every vertex with its list and store each edge in both lists, O(n + m).',
    zh: '根据边进行初始化：创建 n 个顶点及其链表，并把每条边存入两端顶点的链表，O(n + m)。',
    'zh-hant': '根據邊進行初始化：建立 n 個頂點及其鏈結串列，並把每條邊存入兩端頂點的鏈結串列，O(n + m)。',
    ja: '辺から初期化します。n 個の頂点とそのリストを作り、各辺を両端のリストに格納します。O(n + m)。',
    ru: 'Инициализация по ребрам: создаем n вершин с их списками и кладем каждое ребро в списки обоих концов, O(n + m).',
  },
  add_edge: {
    en: 'Add edge 1–2: append 2 to the list of 1 and 1 to the list of 2, in O(1).',
    zh: '添加边 1–2：在顶点 1 的链表末尾添加 2，在顶点 2 的链表末尾添加 1，O(1)。',
    'zh-hant': '新增邊 1–2：在頂點 1 的鏈結串列末尾新增 2，在頂點 2 的鏈結串列末尾新增 1，O(1)。',
    ja: '辺 1–2 を追加します。頂点 1 のリスト末尾に 2 を、頂点 2 のリスト末尾に 1 を加えます。O(1)。',
    ru: 'Добавляем ребро 1–2: дописываем 2 в конец списка вершины 1, а 1 — в конец списка вершины 2, O(1).',
  },
  remove_edge: {
    en: 'Remove edge 1–3: find and delete 3 in the list of 1, and 1 in the list of 3. Finding them takes O(m).',
    zh: '删除边 1–3：在顶点 1 的链表中查找并删除 3，在顶点 3 的链表中查找并删除 1。查找需要 O(m)。',
    'zh-hant': '刪除邊 1–3：在頂點 1 的鏈結串列中查詢並刪除 3，在頂點 3 的鏈結串列中查詢並刪除 1。查詢需要 O(m)。',
    ja: '辺 1–3 を削除します。頂点 1 のリストから 3 を、頂点 3 のリストから 1 を探して削除します。探索に O(m) かかります。',
    ru: 'Удаляем ребро 1–3: находим и удаляем 3 в списке вершины 1 и 1 в списке вершины 3. Поиск занимает O(m).',
  },
  add_vertex: {
    en: 'Add vertex 6: add a new, empty list headed by 6, in O(1).',
    zh: '添加顶点 6：在邻接表中添加一个以 6 为头节点的空链表，O(1)。',
    'zh-hant': '新增頂點 6：在鄰接表中新增一個以 6 為頭節點的空鏈結串列，O(1)。',
    ja: '頂点 6 を追加します。6 を先頭ノードとする空のリストを隣接リストに加えます。O(1)。',
    ru: 'Добавляем вершину 6: в список смежности добавляется пустой список с головным узлом 6, O(1).',
  },
  remove_vertex: {
    en: 'Remove vertex 3: drop its own list, then look through every other list for edges that contain 3.',
    zh: '删除顶点 3：删除它自己的链表，再遍历其余所有链表，找出包含 3 的边。',
    'zh-hant': '刪除頂點 3：刪除它自己的鏈結串列，再走訪其餘所有鏈結串列，找出包含 3 的邊。',
    ja: '頂点 3 を削除します。自身のリストを取り除き、ほかのすべてのリストから 3 を含む辺を探します。',
    ru: 'Удаляем вершину 3: убираем ее собственный список, затем просматриваем все остальные в поисках ребер с вершиной 3.',
  },
  removed: {
    en: 'Vertex 3 is gone, and so is its entry in the list of 2. Traversing the whole adjacency list takes O(n + m).',
    zh: '顶点 3 被删除，顶点 2 链表中的 3 也被删除。遍历整个邻接表需要 O(n + m)。',
    'zh-hant': '頂點 3 被刪除，頂點 2 鏈結串列中的 3 也被刪除。走訪整個鄰接表需要 O(n + m)。',
    ja: '頂点 3 が消え、頂点 2 のリストにあった 3 も削除されました。隣接リスト全体の走査に O(n + m) かかります。',
    ru: 'Вершина 3 удалена, как и ее запись в списке вершины 2. Обход всего списка смежности занимает O(n + m).',
  },
};

const adjacencyListSteps: StepFigure = {
  type: 'steps',
  tones: OP_TONES,
  call: 'GraphAdjList(edges)',
  sources: classSources(LIST_PY, LIST_JAVA, 'GraphAdjList', ['__init__', 'add_edge', 'remove_edge', 'add_vertex', 'remove_vertex'], {
    python: {
      init: ['self.add_vertex(edge[0])', 'self.add_edge(edge[0], edge[1])'],
      add_edge: ['self.adj_list[vet1].append(vet2)', 'self.adj_list[vet2].append(vet1)'],
      remove_edge: ['self.adj_list[vet1].remove(vet2)', 'self.adj_list[vet2].remove(vet1)'],
      add_vertex: ['self.adj_list[vet] = []'],
      remove_vertex: ['self.adj_list.pop(vet)'],
      removed: ['self.adj_list[vertex].remove(vet)'],
    },
    java: {
      init: ['addVertex(edge[0]);', 'addEdge(edge[0], edge[1]);'],
      add_edge: ['adjList.get(vet1).add(vet2);', 'adjList.get(vet2).add(vet1);'],
      remove_edge: ['adjList.get(vet1).remove(vet2);', 'adjList.get(vet2).remove(vet1);'],
      add_vertex: ['adjList.put(vet, new ArrayList<>());'],
      remove_vertex: ['adjList.remove(vet);'],
      removed: ['list.remove(vet);'],
    },
  }),
  build(l) {
    const look = { x: 250, y: 40, rowGap: 36, r: 13, nx: 292, nstep: 34, nr: 12 };
    const scene = (
      keys: number[],
      lists: Record<number, number[]>,
      es: [number, number][],
      hl: { heads?: Map<number, Tone>; items?: Map<string, Tone>; verts?: Map<number, Tone>; edges?: { e: [number, number]; tone: Tone; dashed?: boolean }[] },
    ) => {
      const nodes: SceneNode[] = [
        ...opsGraph(keys, es, hl),
        ...listNodes(keys, lists, { ...look, heads: hl.heads, items: hl.items }),
        text('vl', look.x, 14, WORD.vertex[l], { anchor: 'middle', size: 11, bold: true, tone: 'muted' }),
        text('al', look.nx - look.nr, 14, WORD.adjacent[l], { size: 11, bold: true, tone: 'muted' }),
      ];
      return { w: W, h: 250, nodes };
    };
    const L0: Record<number, number[]> = { 1: [3, 5], 3: [1, 2], 2: [3, 5, 4], 5: [1, 2, 4], 4: [2, 5] };
    const L1 = { ...L0, 1: [3, 5, 2], 2: [3, 5, 4, 1] };
    const L2 = { ...L1, 1: [5, 2], 3: [2] };
    const L3 = { ...L2, 6: [] };
    const L4: Record<number, number[]> = { 1: [5, 2], 2: [5, 4, 1], 5: [1, 2, 4], 4: [2, 5], 6: [] };
    const k0 = [1, 3, 2, 5, 4];
    const k1 = [...k0, 6];
    const k2 = k1.filter((v) => v !== 3);
    const e1: [number, number][] = [...OPS_EDGES, [1, 2]];
    const e2 = e1.filter((e) => !sameEdge(e, 1, 3));
    const e3 = e2.filter(([a, b]) => a !== 3 && b !== 3);
    const tones = (pairs: [string, Tone][]) => new Map<string, Tone>(pairs);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(k0, L0, OPS_EDGES, {}), say: LIST_OPS_SAY.init[l] },
      {
        kind: 'add_edge',
        call: 'add_edge(1, 2)',
        scene: scene(k0, L1, e1, {
          heads: new Map([[1, 'accent'], [2, 'accent']]),
          items: tones([['1-2', 'accent'], ['2-1', 'accent']]),
          verts: new Map([[1, 'accent'], [2, 'accent']]),
          edges: [{ e: [1, 2], tone: 'accent' }],
        }),
        say: LIST_OPS_SAY.add_edge[l],
      },
      {
        kind: 'remove_edge',
        call: 'remove_edge(1, 3)',
        scene: scene(k0, L2, e2, { heads: new Map([[1, 'danger'], [3, 'danger']]), verts: new Map([[1, 'danger'], [3, 'danger']]) }),
        say: LIST_OPS_SAY.remove_edge[l],
      },
      {
        kind: 'add_vertex',
        call: 'add_vertex(6)',
        scene: scene(k1, L3, e2, { heads: new Map([[6, 'info']]), verts: new Map([[6, 'info']]) }),
        say: LIST_OPS_SAY.add_vertex[l],
      },
      {
        kind: 'remove_vertex',
        call: 'remove_vertex(3)',
        scene: scene(k1, L3, e2, {
          heads: new Map([[3, 'danger']]),
          items: tones([['3-2', 'danger'], ['2-3', 'danger']]),
          verts: new Map([[3, 'danger']]),
          edges: [{ e: [3, 2], tone: 'danger', dashed: true }],
        }),
        say: LIST_OPS_SAY.remove_vertex[l],
      },
      { kind: 'removed', call: 'remove_vertex(3)', scene: scene(k2, L4, e3, {}), say: LIST_OPS_SAY.removed[l] },
    ];
    return { frames, legend: [{ tone: 'info', shape: 'circle', text: WORD.added[l] }, { tone: 'danger', shape: 'circle', text: WORD.removed[l] }] satisfies LegendItem[] };
  },
};

// ── Traversal graphs ──────────────────────────────────────────────────

/** The 3 × 3 grid of the BFS pages: vertex 3r + c sits at row r, column c. */
const GRID_EDGES: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 2],
  [1, 4],
  [2, 5],
  [3, 4],
  [3, 6],
  [4, 5],
  [4, 7],
  [5, 8],
  [6, 7],
  [7, 8],
];

/** Neighbors in the order the code meets them: edges are appended in the order above. */
const adjOf = (es: [number, number][], n: number) => {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of es) {
    adj[a].push(b);
    adj[b].push(a);
  }
  return adj;
};

const GRID_ADJ = adjOf(GRID_EDGES, 9);

/** BFS from vertex 0: the order, each vertex's parent in the BFS tree and its distance. */
const BFS = (() => {
  const order: number[] = [];
  const parent: number[] = Array(9).fill(-1);
  const dist: number[] = Array(9).fill(0);
  const seen = new Set([0]);
  const que = [0];
  while (que.length) {
    const v = que.shift()!;
    order.push(v);
    for (const u of GRID_ADJ[v]) {
      if (seen.has(u)) continue;
      seen.add(u);
      parent[u] = v;
      dist[u] = dist[v] + 1;
      que.push(u);
    }
  }
  return { order, parent, dist };
})();

const gridPos = (x0: number, y0: number, step: number): Pos => Object.fromEntries(Array.from({ length: 9 }, (_, v) => [v, [x0 + (v % 3) * step, y0 + Math.floor(v / 3) * step]]));

// ── 9. BFS: layer by layer ────────────────────────────────────────────

const LAYERS_SAY: Record<'start' | 'layer' | 'done', T> = {
  start: {
    en: 'Breadth-first search starts from vertex 0, at distance 0.',
    zh: '广度优先遍历从顶点 0 出发，它与自身的距离为 0。',
    'zh-hant': '廣度優先走訪從頂點 0 出發，它與自身的距離為 0。',
    ja: '幅優先走査は頂点 0 から出発します。距離は 0 です。',
    ru: 'Обход в ширину начинается с вершины 0, расстояние до нее 0.',
  },
  layer: {
    en: 'Layer {d}: {list}, at distance {d} from vertex 0. They are reached through the previous layer.',
    zh: '第 {d} 层：{list}，与顶点 0 的距离为 {d}，经由上一层到达。',
    'zh-hant': '第 {d} 層：{list}，與頂點 0 的距離為 {d}，經由上一層到達。',
    ja: '第 {d} 層：{list}。頂点 0 からの距離は {d} で、前の層を経由して到達します。',
    ru: 'Слой {d}: {list} — на расстоянии {d} от вершины 0, их находим через предыдущий слой.',
  },
  done: {
    en: 'BFS goes from near to far, expanding layer by layer: 0, 1, 3, 2, 4, 6, 5, 7, 8.',
    zh: '广度优先遍历由近及远，一层层向外扩张：0, 1, 3, 2, 4, 6, 5, 7, 8。',
    'zh-hant': '廣度優先走訪由近及遠，一層層向外擴張：0, 1, 3, 2, 4, 6, 5, 7, 8。',
    ja: '幅優先走査は近くから遠くへ、層ごとに広がります：0, 1, 3, 2, 4, 6, 5, 7, 8。',
    ru: 'Обход в ширину идет от ближнего к дальнему, слой за слоем: 0, 1, 3, 2, 4, 6, 5, 7, 8.',
  },
};

const graphBfs: StepFigure = {
  type: 'steps',
  tones: { start: 'idle', layer: 'cmp', done: 'done' },
  build(l) {
    const step = 76;
    const x0 = 44;
    const y0 = 58;
    const pos = gridPos(x0, y0, step);
    const maxD = Math.max(...BFS.dist);
    const layers = Array.from({ length: maxD + 1 }, (_, d) => BFS.order.filter((v) => BFS.dist[v] === d));
    /** A dashed line between layer k and k + 1: the anti-diagonal c + r = k + 0.5 of the grid. */
    const separator = (k: number): SceneNode => {
      const s = k + 0.5;
      const c1 = Math.min(s + 0.4, 2.4);
      const r2 = Math.min(s + 0.4, 2.4);
      const at = (c: number, r: number) => `${x0 + c * step} ${y0 + r * step}`;
      return { kind: 'path', id: `sep${k}`, d: `M ${at(c1, s - c1)} L ${at(s - r2, r2)}`, tone: 'ghost', dashed: true, width: 1.5 };
    };
    const scene = (upto: number, done: boolean) => {
      const toneOf = (v: number): Tone => (BFS.dist[v] > upto ? 'idle' : BFS.dist[v] === upto && !done ? 'accent' : 'ok');
      const g = drawGraph(
        'g',
        verts('g', pos, (v) => ({ tone: toneOf(v), ring: !done && BFS.dist[v] === upto })),
        edges('g', GRID_EDGES, (a, b) => {
          const child = BFS.parent[b] === a ? b : BFS.parent[a] === b ? a : -1;
          if (child < 0 || BFS.dist[child] > upto) return {};
          return { tone: BFS.dist[child] === upto && !done ? 'accent' : 'ok' };
        }),
      );
      const nodes: SceneNode[] = [...g.nodes];
      for (let k = 0; k < upto; k++) nodes.push(separator(k));
      nodes.push(...tag('st', { x: pos[0][0] - 18, y: pos[0][1] - 18, w: 36, h: 36 }, WORD.start[l], { side: 'above', gap: 16 }));
      // Layers on the right: distance, then the vertices at that distance.
      const lx = 246;
      nodes.push(text('dh', lx, 26, WORD.distance[l], { size: 11, bold: true, tone: 'muted' }));
      layers.forEach((vs, d) => {
        const y = 52 + d * 34;
        const tone: Tone = d > upto ? 'idle' : d === upto && !done ? 'accent' : 'ok';
        nodes.push(text(`d${d}`, lx + 8, y + 5, String(d), { anchor: 'middle', mono: true, size: 13, bold: true, tone: d > upto ? 'muted' : tone }));
        vs.forEach((v, k) => nodes.push(box(`L${v}`, lx + 30 + k * 32 - 13, y - 13, v, { w: 26, h: 26, shape: 'circle', size: 13, tone, dim: d > upto })));
      });
      const seq = BFS.order.filter((v) => BFS.dist[v] <= upto);
      nodes.push(
        text('oh', lx, 232, WORD.bfsOrder[l], { size: 11, bold: true, tone: 'muted' }),
        text('ov', lx, 252, seq.join(', '), { mono: true, size: 12, bold: true, tone: 'ok' }),
      );
      return { w: W, h: 262, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'start', scene: scene(0, false), say: LAYERS_SAY.start[l] }];
    for (let d = 1; d <= maxD; d++) {
      frames.push({ kind: 'layer', scene: scene(d, false), say: fmt(LAYERS_SAY.layer[l], { d, list: joinL(l, layers[d]) }) });
    }
    frames.push({ kind: 'done', scene: scene(maxD, true), say: LAYERS_SAY.done[l] });
    return {
      frames,
      legend: [
        { tone: 'accent', shape: 'circle', text: WORD.layer[l] },
        { tone: 'ok', shape: 'circle', text: WORD.earlier[l] },
        { tone: 'ok', shape: 'line', text: WORD.edgeIn[l] },
      ],
    };
  },
};

// ── 10. BFS step by step ──────────────────────────────────────────────

const BFS_SAY: Record<'init' | 'visit' | 'skip' | 'done', T> = {
  init: {
    en: 'Put the start vertex 0 into the queue que and mark it in the hash set visited.',
    zh: '将起始顶点 0 加入队列 que，并在哈希集合 visited 中标记它。',
    'zh-hant': '將起始頂點 0 加入佇列 que，並在雜湊集合 visited 中標記它。',
    ja: '開始頂点 0 をキュー que に追加し、ハッシュ集合 visited に記録します。',
    ru: 'Кладем стартовую вершину 0 в очередь que и отмечаем ее в хеш-множестве visited.',
  },
  visit: {
    en: 'Dequeue vertex {v} and append it to res. Unvisited neighbors join the queue and visited: {list}.',
    zh: '顶点 {v} 出队并加入 res。它尚未访问的邻接顶点 {list} 入队，并加入 visited。',
    'zh-hant': '頂點 {v} 出列並加入 res。它尚未訪問的鄰接頂點 {list} 入列，並加入 visited。',
    ja: '頂点 {v} をデキューして res に追加します。未訪問の隣接頂点 {list} をキューと visited に追加します。',
    ru: 'Извлекаем вершину {v} и добавляем в res. Ее непосещенные соседи {list} попадают в очередь и в visited.',
  },
  skip: {
    en: 'Dequeue vertex {v} and append it to res. All its neighbors are already in visited, so nothing joins the queue.',
    zh: '顶点 {v} 出队并加入 res。它的邻接顶点都已在 visited 中，没有顶点入队。',
    'zh-hant': '頂點 {v} 出列並加入 res。它的鄰接頂點都已在 visited 中，沒有頂點入列。',
    ja: '頂点 {v} をデキューして res に追加します。隣接頂点はすべて visited にあるので、キューには何も追加しません。',
    ru: 'Извлекаем вершину {v} и добавляем в res. Все ее соседи уже в visited, поэтому в очередь ничего не попадает.',
  },
  done: {
    en: 'The queue is empty, so the traversal ends. BFS order: 0, 1, 3, 2, 4, 6, 5, 7, 8.',
    zh: '队列为空，遍历结束。广度优先遍历序列为 0, 1, 3, 2, 4, 6, 5, 7, 8。',
    'zh-hant': '佇列為空，走訪結束。廣度優先走訪序列為 0, 1, 3, 2, 4, 6, 5, 7, 8。',
    ja: 'キューが空になり、走査が終わります。幅優先走査の順序は 0, 1, 3, 2, 4, 6, 5, 7, 8 です。',
    ru: 'Очередь пуста, обход завершен. Порядок обхода в ширину: 0, 1, 3, 2, 4, 6, 5, 7, 8.',
  },
};

const graphBfsSteps: StepFigure = {
  type: 'steps',
  call: 'graph_bfs(graph, 0)',
  tones: { init: 'idle', visit: 'cmp', skip: 'swp', done: 'done' },
  sources: funcSources(BFS_PY, BFS_JAVA, ['graph_bfs'], {
    python: {
      init: ['visited = set[Vertex]([start_vet])', 'que = deque[Vertex]([start_vet])'],
      visit: ['que.popleft()', 'res.append(vet)', 'que.append(adj_vet)', 'visited.add(adj_vet)'],
      skip: ['que.popleft()', 'res.append(vet)', 'continue'],
      done: ['return res'],
    },
    java: {
      init: ['visited.add(startVet);', 'que.offer(startVet);'],
      visit: ['que.poll();', 'res.add(vet);', 'que.offer(adjVet);', 'visited.add(adjVet);'],
      skip: ['que.poll();', 'res.add(vet);', 'continue;'],
      done: ['return res;'],
    },
  }),
  build(l) {
    const pos = gridPos(40, 40, 74);
    const cw = 32;
    const gap = 6;
    const rx = 84;
    const rows = { res: 232, que: 272, visited: 312 };
    const scene = (que: number[], res: number[], seen: number[], cur: number | null, fresh: number[]) => {
      const toneOf = (v: number): Tone => (v === cur ? 'accent' : que.includes(v) ? 'info' : res.includes(v) ? 'ok' : 'idle');
      const g = drawGraph(
        'g',
        verts('g', pos, (v) => ({ tone: toneOf(v), ring: v === cur || fresh.includes(v) })),
        edges('g', GRID_EDGES, (a, b) => {
          const child = BFS.parent[b] === a ? b : BFS.parent[a] === b ? a : -1;
          if (child < 0 || !seen.includes(child)) return {};
          return { tone: fresh.includes(child) ? 'accent' : 'ok' };
        }),
        { r: 17 },
      );
      const nodes: SceneNode[] = [...g.nodes];
      // The neighbors of the current vertex, as the loop meets them.
      if (cur !== null) {
        nodes.push(chip('adj', 236, 40, seg('adj_list[', [String(cur), 'accent', true], ']'), { align: 'start', size: 13 }));
        GRID_ADJ[cur].forEach((u, k) => {
          const isNew = fresh.includes(u);
          nodes.push(
            box(`nb${k}`, 252 + k * 40 - 15, 96 - 15, u, { w: 30, h: 30, shape: 'circle', size: 13, tone: isNew ? 'info' : 'ghost', dashed: !isNew, ring: isNew }),
          );
        });
      }
      const row = (key: keyof typeof rows, vs: number[], tone: (v: number) => Tone, ring: (v: number) => boolean, prefix: string) => {
        const y = rows[key];
        nodes.push(
          region(`${key}:bg`, rx - 5, y - 5, 9 * (cw + gap) - gap + 10, 40, { tone: key === 'res' ? 'ok' : key === 'que' ? 'info' : 'idle' }),
          text(`${key}:l`, rx - 12, y + 20, key, { anchor: 'end', mono: true, size: 13, bold: true, tone: key === 'res' ? 'ok' : key === 'que' ? 'info' : 'muted' }),
        );
        vs.forEach((v, k) => nodes.push(box(`${prefix}${v}`, rx + k * (cw + gap), y, v, { w: cw, h: 30, size: 14, tone: tone(v), ring: ring(v) })));
      };
      row('res', res, (v) => (v === cur ? 'accent' : 'ok'), (v) => v === cur, 'r');
      row('que', que, () => 'info', (v) => fresh.includes(v), 'q');
      row('visited', seen, () => 'idle', (v) => fresh.includes(v), 's');
      return { w: W, h: 350, nodes };
    };
    const frames: SceneFrame[] = [];
    let que = [0];
    const res: number[] = [];
    const seen = [0];
    frames.push({ kind: 'init', scene: scene(que, res, seen, null, [0]), say: BFS_SAY.init[l] });
    while (que.length) {
      const v = que[0];
      que = que.slice(1);
      res.push(v);
      const fresh = GRID_ADJ[v].filter((u) => !seen.includes(u));
      seen.push(...fresh);
      que = [...que, ...fresh];
      frames.push({
        kind: fresh.length ? 'visit' : 'skip',
        scene: scene(que, [...res], [...seen], v, fresh),
        say: fmt(fresh.length ? BFS_SAY.visit[l] : BFS_SAY.skip[l], { v, list: joinL(l, fresh) }),
      });
    }
    frames.push({ kind: 'done', scene: scene([], res, seen, null, []), say: BFS_SAY.done[l] });
    return {
      frames,
      legend: [
        { tone: 'accent', shape: 'circle', text: WORD.current[l] },
        { tone: 'info', shape: 'circle', text: WORD.inQueue[l] },
        { tone: 'ok', shape: 'circle', text: WORD.dequeued[l] },
        { tone: 'ghost', shape: 'circle', dashed: true, text: WORD.skipped[l] },
      ],
    };
  },
};

// ── DFS graph ─────────────────────────────────────────────────────────

/** The DFS pages' graph: 0 1 2 on top, 3 4 5 below, 6 under 5. */
const DFS_EDGES: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 2],
  [2, 5],
  [4, 5],
  [5, 6],
];

const DFS_ADJ = adjOf(DFS_EDGES, 7);

const dfsPos = (x0: number, y0: number, step: number): Pos => ({
  0: [x0, y0],
  1: [x0 + step, y0],
  2: [x0 + 2 * step, y0],
  3: [x0, y0 + step],
  4: [x0 + step, y0 + step],
  5: [x0 + 2 * step, y0 + step],
  6: [x0 + 2 * step, y0 + 2 * step],
});

/** One event of the recursion: a call into `to` from `from`, or a return from `from` to `to`. */
interface Move {
  from: number;
  to: number;
  back: boolean;
}

/** The DFS from vertex 0 as calls and returns, in the order they happen. */
const DFS_MOVES: Move[] = (() => {
  const out: Move[] = [];
  const seen = new Set<number>();
  const go = (v: number) => {
    seen.add(v);
    for (const u of DFS_ADJ[v]) {
      if (seen.has(u)) continue;
      out.push({ from: v, to: u, back: false });
      go(u);
      out.push({ from: u, to: v, back: true });
    }
  };
  go(0);
  return out;
})();

const DFS_ORDER = [0, ...DFS_MOVES.filter((m) => !m.back).map((m) => m.to)];

/** Walk arrows for the first `n` moves. */
function walkNodes(boxes: Map<string, BoxNode>, n: number, lastTone = false): SceneNode[] {
  return DFS_MOVES.slice(0, n).map((m, k) =>
    walkArrow(`w${m.from}>${m.to}`, boxes.get(`g${m.from}`)!, boxes.get(`g${m.to}`)!, m.back, lastTone && k < n - 1 ? { dim: true } : {}),
  );
}

// ── 11. DFS overview ──────────────────────────────────────────────────

const DFS_NOTE: T = {
  en: 'Depth-first search goes as far as it can, then backtracks when no path remains. Straight dashed arrows are calls going deeper; curved ones are returns. The tree on the right shows which call started which.',
  zh: '深度优先遍历优先走到底，无路可走再回头。直虚线代表向下递推，曲虚线代表向上回溯。右侧的树展示了每次递归调用由谁发起。',
  'zh-hant': '深度優先走訪優先走到底，無路可走再回頭。直虛線代表向下遞推，曲虛線代表向上回溯。右側的樹展示了每次遞迴呼叫由誰發起。',
  ja: '深さ優先走査は行けるところまで進み、進めなくなったら戻ります。直線の破線は再帰呼び出し、曲線の破線はバックトラックです。右の木は、どの呼び出しがどの呼び出しを始めたかを示します。',
  ru: 'Обход в глубину идет до упора, а когда пути нет, возвращается назад. Прямые пунктирные стрелки — рекурсивные вызовы вглубь, изогнутые — возвраты. Дерево справа показывает, какой вызов запустил какой.',
};

const graphDfs: StaticFigure = {
  type: 'static',
  build(l) {
    const pos = dfsPos(44, 62, 84);
    const g = drawGraph('g', verts('g', pos), edges('g', DFS_EDGES));
    const nodes: SceneNode[] = [
      ...g.nodes,
      ...walkNodes(g.boxes, DFS_MOVES.length),
      ...tag('st', g.boxes.get('g0')!, WORD.start[l], { side: 'above', gap: 18 }),
    ];
    // Recursion tree: who called whom.
    const parents = Array<number>(7).fill(-1);
    for (const m of DFS_MOVES) if (!m.back) parents[m.to] = m.from;
    const slots = treeSlots(parents, 300, 136, 50, 44);
    const tb = new Map<number, BoxNode>();
    slots.forEach((s, v) => tb.set(v, box(`c${v}`, s.x - 13, s.y - 13, v, { w: 26, h: 26, shape: 'circle', size: 13, tone: 'ok' })));
    nodes.push(text('ct', 368, 20, WORD.calls[l], { anchor: 'middle', size: 11, bold: true, tone: 'muted' }));
    for (const [v, b] of tb) if (parents[v] >= 0) nodes.push(link(`ce${v}`, tb.get(parents[v])!, b, { pad: 2, width: 1.5, tone: 'info' }));
    nodes.push(...tb.values());
    // The resulting order.
    nodes.push(
      text('res:l', 52, 285, 'res', { anchor: 'end', mono: true, size: 13, bold: true, tone: 'ok' }),
      ...DFS_ORDER.map((v, k) => box(`r${v}`, 60 + k * 36, 266, v, { w: 30, h: 28, size: 14, tone: 'ok' })),
    );
    return {
      scene: { w: W, h: 304, nodes },
      legend: [
        { tone: 'info', shape: 'line', dashed: true, text: WORD.down[l] },
        { tone: 'warn', shape: 'line', dashed: true, text: WORD.up[l] },
      ],
      notes: [DFS_NOTE[l]],
    };
  },
};

// ── 12. DFS step by step ──────────────────────────────────────────────

const DFS_SAY: Record<'start' | 'visit' | 'ret' | 'unwind' | 'done', T> = {
  start: {
    en: 'Call dfs(0): append vertex 0 to res and mark it in visited.',
    zh: '调用 dfs(0)：将顶点 0 加入 res，并在 visited 中标记它。',
    'zh-hant': '呼叫 dfs(0)：將頂點 0 加入 res，並在 visited 中標記它。',
    ja: 'dfs(0) を呼び出します。頂点 0 を res に追加し、visited に記録します。',
    ru: 'Вызываем dfs(0): добавляем вершину 0 в res и отмечаем в visited.',
  },
  visit: {
    en: 'Neighbor {v} of vertex {p} is not visited yet: recurse into dfs({v}), append {v} to res and mark it.',
    zh: '顶点 {p} 的邻接顶点 {v} 尚未访问：递归调用 dfs({v})，将 {v} 加入 res 并标记。',
    'zh-hant': '頂點 {p} 的鄰接頂點 {v} 尚未訪問：遞迴呼叫 dfs({v})，將 {v} 加入 res 並標記。',
    ja: '頂点 {p} の隣接頂点 {v} は未訪問です。dfs({v}) を再帰呼び出しし、{v} を res に追加して記録します。',
    ru: 'Сосед {v} вершины {p} еще не посещен: рекурсивно вызываем dfs({v}), добавляем {v} в res и отмечаем.',
  },
  ret: {
    en: 'Every neighbor of vertex {v} is visited, so dfs({v}) returns, backtracking to vertex {p}.',
    zh: '顶点 {v} 的所有邻接顶点都已访问，dfs({v}) 返回，回溯到顶点 {p}。',
    'zh-hant': '頂點 {v} 的所有鄰接頂點都已訪問，dfs({v}) 返回，回溯到頂點 {p}。',
    ja: '頂点 {v} の隣接頂点はすべて訪問済みなので、dfs({v}) は戻り、頂点 {p} にバックトラックします。',
    ru: 'Все соседи вершины {v} посещены, поэтому dfs({v}) возвращается к вершине {p}.',
  },
  unwind: {
    en: 'Vertices 5, 2 and 1 have no unvisited neighbors left, so their calls return one after another, back to vertex 0.',
    zh: '顶点 5、2、1 都没有未访问的邻接顶点，它们的调用依次返回，回溯到顶点 0。',
    'zh-hant': '頂點 5、2、1 都沒有未訪問的鄰接頂點，它們的呼叫依次返回，回溯到頂點 0。',
    ja: '頂点 5、2、1 には未訪問の隣接頂点が残っていないので、呼び出しが順に戻り、頂点 0 までバックトラックします。',
    ru: 'У вершин 5, 2 и 1 не осталось непосещенных соседей, поэтому их вызовы по очереди возвращаются к вершине 0.',
  },
  done: {
    en: 'dfs(3) returns to vertex 0, and dfs(0) returns too: the traversal is complete. DFS order: 0, 1, 2, 5, 4, 6, 3.',
    zh: 'dfs(3) 回溯到顶点 0，dfs(0) 也随之返回，遍历完成。深度优先遍历序列为 0, 1, 2, 5, 4, 6, 3。',
    'zh-hant': 'dfs(3) 回溯到頂點 0，dfs(0) 也隨之返回，走訪完成。深度優先走訪序列為 0, 1, 2, 5, 4, 6, 3。',
    ja: 'dfs(3) が頂点 0 に戻り、dfs(0) も戻って走査が完了します。深さ優先走査の順序は 0, 1, 2, 5, 4, 6, 3 です。',
    ru: 'dfs(3) возвращается к вершине 0, затем возвращается и dfs(0): обход завершен. Порядок обхода в глубину: 0, 1, 2, 5, 4, 6, 3.',
  },
};

const graphDfsSteps: StepFigure = {
  type: 'steps',
  call: 'graph_dfs(graph, 0)',
  tones: { start: 'cmp', visit: 'cmp', ret: 'swp', done: 'done' },
  sources: funcSources(DFS_PY, DFS_JAVA, ['dfs', 'graph_dfs'], {
    python: {
      start: ['dfs(graph, visited, res, start_vet)', 'res.append(vet)', 'visited.add(vet)'],
      visit: ['dfs(graph, visited, res, adjVet)', 'res.append(vet)', 'visited.add(vet)'],
      ret: ['for adjVet in graph.adj_list[vet]:', 'continue'],
      done: ['return res'],
    },
    java: {
      start: ['dfs(graph, visited, res, startVet);', 'res.add(vet);', 'visited.add(vet);'],
      visit: ['dfs(graph, visited, res, adjVet);', 'res.add(vet);', 'visited.add(vet);'],
      ret: ['for (Vertex adjVet : graph.adjList.get(vet))', 'continue;'],
      done: ['return res;'],
    },
  }),
  build(l) {
    const pos = dfsPos(36, 50, 80);
    const cw = 32;
    const gap = 6;
    const rx = 92;
    const sx = 262;
    /** State after the first `n` moves. */
    const scene = (n: number, cur: number | null, from: number | null) => {
      const res = [0, ...DFS_MOVES.slice(0, n).filter((m) => !m.back).map((m) => m.to)];
      const stack = [0];
      for (const m of DFS_MOVES.slice(0, n)) {
        if (m.back) stack.pop();
        else stack.push(m.to);
      }
      if (cur === null) stack.length = 0;
      const g = drawGraph(
        'g',
        verts('g', pos, (v) => (v === cur ? { tone: 'accent', ring: true } : v === from ? { tone: 'warn', ring: true } : res.includes(v) ? { tone: 'ok' } : { tone: 'idle' })),
        edges('g', DFS_EDGES),
        { r: 17 },
      );
      const nodes: SceneNode[] = [...g.nodes, ...walkNodes(g.boxes, n)];
      nodes.push(text('st:l', sx, 22, WORD.stack[l], { size: 11, bold: true, tone: 'muted' }));
      stack.forEach((v, k) => {
        const top = k === stack.length - 1;
        nodes.push(chip(`call${v}`, sx, 34 + k * 34, seg('dfs(', [String(v), top ? 'accent' : 'ok', true], ')'), { align: 'start', size: 12, ring: top, tone: top ? 'accent' : 'idle' }));
      });
      for (const [key, y, tone] of [
        ['res', 244, 'ok'],
        ['visited', 284, 'idle'],
      ] as const) {
        nodes.push(
          region(`${key}:bg`, rx - 5, y - 5, 7 * (cw + gap) - gap + 10, 40, { tone }),
          text(`${key}:l`, rx - 12, y + 20, key, { anchor: 'end', mono: true, size: 13, bold: true, tone: tone === 'ok' ? 'ok' : 'muted' }),
          ...res.map((v, k) => box(`${key[0]}${v}`, rx + k * (cw + gap), y, v, { w: cw, h: 30, size: 14, tone: v === cur && !DFS_MOVES[n - 1]?.back ? 'accent' : tone, ring: v === cur && !DFS_MOVES[n - 1]?.back })),
        );
      }
      return { w: W, h: 324, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'start', scene: scene(0, 0, null), say: DFS_SAY.start[l], call: 'dfs(0)' }];
    let n = 0;
    while (n < DFS_MOVES.length) {
      const m = DFS_MOVES[n];
      if (!m.back) {
        n++;
        frames.push({ kind: 'visit', scene: scene(n, m.to, null), say: fmt(DFS_SAY.visit[l], { v: m.to, p: m.from }), call: `dfs(${m.to})` });
        continue;
      }
      // A run of returns: the first one on its own, the rest of the run together.
      let k = n;
      if (n === 0 || DFS_MOVES[n - 1].back) while (k + 1 < DFS_MOVES.length && DFS_MOVES[k + 1].back) k++;
      const last = DFS_MOVES[k];
      if (k === DFS_MOVES.length - 1) {
        n = k + 1;
        frames.push({ kind: 'done', scene: scene(n, null, null), say: DFS_SAY.done[l] });
        break;
      }
      const single = k === n;
      n = k + 1;
      frames.push({
        kind: 'ret',
        scene: scene(n, last.to, single ? m.from : null),
        say: single ? fmt(DFS_SAY.ret[l], { v: m.from, p: last.to }) : DFS_SAY.unwind[l],
        call: `dfs(${last.to})`,
      });
    }
    return {
      frames,
      legend: [
        { tone: 'info', shape: 'line', dashed: true, text: WORD.down[l] },
        { tone: 'warn', shape: 'line', dashed: true, text: WORD.up[l] },
      ],
    };
  },
};

const FIGURES: Record<string, Figure> = {
  linkedlist_tree_graph: linkedlistTreeGraph,
  directed_graph: directedGraph,
  connected_graph: connectedGraph,
  weighted_graph: weightedGraph,
  adjacency_matrix: adjacencyMatrix,
  adjacency_list: adjacencyList,
  adjacency_matrix_steps: adjacencyMatrixSteps,
  adjacency_list_steps: adjacencyListSteps,
  graph_bfs: graphBfs,
  graph_bfs_steps: graphBfsSteps,
  graph_dfs: graphDfs,
  graph_dfs_steps: graphDfsSteps,
};

export default FIGURES;
