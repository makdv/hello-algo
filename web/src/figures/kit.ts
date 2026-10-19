import type { ArrowNode, BoxNode, PathNode, Rich, RegionNode, SceneNode, Segment, TextNode, Tone } from './scene';

/**
 * Layout helpers. Each returns scene nodes at computed positions, so figure files describe
 * *what* is drawn and the kit decides sizes, spacing and arrow endpoints consistently.
 */

export const CELL = 40;
export const GAP = 6;
export const NODE_R = 20;

const plain = (text: Rich) => (typeof text === 'string' ? text : text.map((s) => s.t).join(''));

/** Rough rendered width of text: wide for CJK, narrower for Latin; enough for laying out chips. */
export function textWidth(text: Rich, size = 14, mono = false): number {
  let w = 0;
  for (const ch of plain(text)) {
    if (/[⺀-鿿가-힯＀-￯　-〿]/.test(ch)) w += size;
    else if (mono) w += size * 0.6;
    else if (/[A-ZА-ЯЁ]/.test(ch)) w += size * 0.64;
    else if (/[ilj.,:;|!'’\s]/.test(ch)) w += size * 0.3;
    else w += size * 0.54;
  }
  return w;
}

/** Shorthand for colored runs: seg('nums[', ['4', 'accent'], ']'). */
export function seg(...parts: (string | [string, Tone?, boolean?])[]): Segment[] {
  return parts.map((p) => (typeof p === 'string' ? { t: p } : { t: p[0], tone: p[1], bold: p[2] }));
}

export function box(id: string, x: number, y: number, text: Rich | number, opts: Partial<BoxNode> = {}): BoxNode {
  return { kind: 'box', id, x, y, w: CELL, h: CELL, text: typeof text === 'number' ? String(text) : text, ...opts };
}

export function text(id: string, x: number, y: number, value: Rich, opts: Partial<TextNode> = {}): TextNode {
  return { kind: 'text', id, x, y, text: value, ...opts };
}

/** A code chip sized to its text, e.g. `nums[4] = nums[3]`. `x` is its center unless `align` says otherwise. */
export function chip(
  id: string,
  x: number,
  y: number,
  value: Rich,
  opts: Partial<BoxNode> & { align?: 'start' | 'middle' | 'end' } = {},
): BoxNode {
  const { align = 'middle', ...rest } = opts;
  const size = rest.size ?? 13;
  const w = Math.round(textWidth(value, size, !rest.sans) + 20);
  const left = align === 'start' ? x : align === 'end' ? x - w : x - w / 2;
  return { kind: 'box', id, x: left, y, w, h: 28, text: value, shape: 'chip', size, ...rest };
}

export function region(id: string, x: number, y: number, w: number, h: number, opts: Partial<RegionNode> = {}): RegionNode {
  return { kind: 'region', id, x, y, w, h, tone: 'soft', ...opts };
}

export function arrow(id: string, from: [number, number], to: [number, number], opts: Partial<ArrowNode> = {}): ArrowNode {
  return { kind: 'arrow', id, from, to, ...opts };
}

/** Left edge of cell `i` in a row of cells starting at `x`. */
export const cellX = (x: number, i: number, w = CELL, gap = GAP) => x + i * (w + gap);

/** Total width of `n` cells. */
export const rowWidth = (n: number, w = CELL, gap = GAP) => (n > 0 ? n * w + (n - 1) * gap : 0);

export interface Cell {
  /** Stable id so the cell can move between frames; defaults to the index. */
  id?: string;
  value: Rich | number | null;
  tone?: Tone;
  dashed?: boolean;
  dim?: boolean;
  ring?: boolean;
}

/** A horizontal run of cells (an array). `null` values draw empty dashed slots. */
export function cells(prefix: string, x: number, y: number, items: Cell[], opts: { w?: number; h?: number; gap?: number; size?: number } = {}) {
  const { w = CELL, h = CELL, gap = GAP, size } = opts;
  return items.map((c, i) =>
    box(c.id ?? `${prefix}${i}`, cellX(x, i, w, gap), y, c.value === null ? '' : c.value, {
      w,
      h,
      size,
      tone: c.tone ?? (c.value === null ? 'ghost' : 'idle'),
      dashed: c.dashed ?? c.value === null,
      dim: c.dim,
      ring: c.ring,
    }),
  );
}

/** Index labels under a row of cells. */
export function indices(prefix: string, x: number, y: number, labels: (string | number)[], opts: { w?: number; gap?: number; tone?: (i: number) => Tone | undefined } = {}) {
  const { w = CELL, gap = GAP } = opts;
  return labels.map((label, i) =>
    text(`${prefix}${i}`, cellX(x, i, w, gap) + w / 2, y, String(label), { anchor: 'middle', mono: true, size: 12, tone: opts.tone?.(i) ?? 'muted' }),
  );
}

/** A vertical column of cells, top to bottom. */
export function column(prefix: string, x: number, y: number, items: Cell[], opts: { w?: number; h?: number; gap?: number; size?: number } = {}) {
  const { w = CELL, h = CELL, gap = GAP, size } = opts;
  return items.map((c, i) =>
    box(c.id ?? `${prefix}${i}`, x, y + i * (h + gap), c.value === null ? '' : c.value, {
      w,
      h,
      size,
      tone: c.tone ?? (c.value === null ? 'ghost' : 'idle'),
      dashed: c.dashed ?? c.value === null,
      dim: c.dim,
      ring: c.ring,
    }),
  );
}

export interface Point {
  x: number;
  y: number;
}

/** Center of a box node. */
export const center = (b: { x: number; y: number; w: number; h: number }): Point => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/**
 * Arrow between two boxes or circles, trimmed to their outlines so heads touch the edge.
 * `pad` leaves a little air between the head and the target.
 */
export function link(id: string, a: BoxNode, b: BoxNode, opts: Partial<ArrowNode> & { pad?: number } = {}): ArrowNode {
  const { pad = 3, ...rest } = opts;
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const edge = (node: BoxNode) => {
    if (node.shape === 'circle') return node.w / 2;
    // Distance from the center to the rectangle's edge along the direction.
    const tx = Math.abs(ux) > 1e-6 ? node.w / 2 / Math.abs(ux) : Infinity;
    const ty = Math.abs(uy) > 1e-6 ? node.h / 2 / Math.abs(uy) : Infinity;
    return Math.min(tx, ty);
  };
  const from: [number, number] = [ca.x + ux * (edge(a) + 1), ca.y + uy * (edge(a) + 1)];
  const to: [number, number] = [cb.x - ux * (edge(b) + pad), cb.y - uy * (edge(b) + pad)];
  return arrow(id, from, to, rest);
}

export interface ListItem {
  id: string;
  value: Rich | number;
  tone?: Tone;
  dim?: boolean;
  ring?: boolean;
}

/** List nodes as circles at the given centers. */
export function listNode(item: ListItem, cx: number, cy: number, r = NODE_R): BoxNode {
  return box(item.id, cx - r, cy - r, typeof item.value === 'number' ? String(item.value) : item.value, {
    w: r * 2,
    h: r * 2,
    shape: 'circle',
    tone: item.tone ?? 'ok',
    dim: item.dim,
    ring: item.ring,
  });
}

/**
 * A singly (or doubly) linked list laid out left to right or top to bottom.
 * Returns the nodes, the `next` arrows, and the circles (for attaching more arrows or labels).
 */
export function linkedList(
  prefix: string,
  x: number,
  y: number,
  items: ListItem[],
  opts: { step?: number; r?: number; dir?: 'right' | 'down'; doubly?: boolean; tail?: string | null } = {},
) {
  const { step = 76, r = NODE_R, dir = 'right', doubly = false, tail = null } = opts;
  const circles = items.map((it, i) => listNode(it, dir === 'right' ? x + r + i * step : x + r, dir === 'right' ? y + r : y + r + i * step, r));
  const nodes: SceneNode[] = [];
  circles.forEach((c, i) => {
    const nxt = circles[i + 1];
    if (!nxt) return;
    if (doubly) {
      const off = 5;
      const ox = dir === 'right' ? 0 : off;
      const oy = dir === 'right' ? off : 0;
      nodes.push(
        link(`${prefix}n:${c.id}`, { ...c, x: c.x - ox, y: c.y - oy }, { ...nxt, x: nxt.x - ox, y: nxt.y - oy }),
        link(`${prefix}p:${nxt.id}`, { ...nxt, x: nxt.x + ox, y: nxt.y + oy }, { ...c, x: c.x + ox, y: c.y + oy }),
      );
    } else {
      nodes.push(link(`${prefix}n:${c.id}`, c, nxt));
    }
  });
  if (tail !== null && circles.length) {
    const last = circles[circles.length - 1];
    const cl = center(last);
    const end: [number, number] = dir === 'right' ? [cl.x + r + 34, cl.y] : [cl.x, cl.y + r + 30];
    nodes.push(arrow(`${prefix}tail`, dir === 'right' ? [cl.x + r + 1, cl.y] : [cl.x, cl.y + r + 1], end, { tone: 'muted' }));
    nodes.push(
      text(`${prefix}none`, dir === 'right' ? end[0] + 6 : end[0], dir === 'right' ? end[1] + 4 : end[1] + 16, tail, {
        anchor: dir === 'right' ? 'start' : 'middle',
        mono: true,
        size: 12,
        tone: 'muted',
      }),
    );
  }
  return { nodes: [...nodes, ...circles], circles };
}

/** A key → value pair drawn as two joined cells, as in a hash table bucket. */
export function pair(id: string, x: number, y: number, key: Rich | number, value: Rich | number, opts: { kw?: number; vw?: number; h?: number; tone?: Tone; dim?: boolean; ring?: boolean } = {}) {
  const { kw = 56, vw = 56, h = 32, tone, dim, ring } = opts;
  return [
    box(`${id}.k`, x, y, key, { w: kw, h, size: 13, tone: tone ?? 'ok', dim, ring }),
    box(`${id}.v`, x + kw + 3, y, value, { w: vw, h, size: 13, tone: tone ?? 'info', dim, ring }),
  ];
}

/** Width of a pair drawn by `pair`. */
export const pairWidth = (kw = 56, vw = 56) => kw + vw + 3;

/** A label pointing at a node from above or below, e.g. `front`, `head`, `P`. */
export function tag(id: string, target: { x: number; y: number; w: number; h: number }, label: Rich, opts: { side?: 'above' | 'below' | 'left' | 'right'; tone?: Tone; gap?: number } = {}) {
  const { side = 'below', tone = 'accent', gap = 22 } = opts;
  const c = center(target);
  if (side === 'left' || side === 'right') {
    const sx = side === 'left' ? target.x - 4 : target.x + target.w + 4;
    const lx = side === 'left' ? sx - gap : sx + gap;
    return [
      arrow(`${id}:a`, [lx + (side === 'left' ? 4 : -4), c.y], [sx, c.y], { tone, width: 1.5 }),
      text(id, side === 'left' ? lx - 2 : lx + 2, c.y + 4, label, { anchor: side === 'left' ? 'end' : 'start', mono: true, bold: true, size: 13, tone }),
    ];
  }
  const sy = side === 'below' ? target.y + target.h + 3 : target.y - 3;
  const ly = side === 'below' ? sy + gap : sy - gap;
  return [
    arrow(`${id}:a`, [c.x, side === 'below' ? ly - 12 : ly + 4], [c.x, sy], { tone, width: 1.5 }),
    text(id, c.x, side === 'below' ? ly + 2 : ly - 2, label, { anchor: 'middle', mono: true, bold: true, size: 13, tone }),
  ];
}

/** Vertical ellipsis (⋮) used for elided rows. */
export function ellipsis(id: string, x: number, y: number, tone: Tone = 'muted') {
  return text(id, x, y, '⋮', { anchor: 'middle', size: 16, tone });
}

// ── Charts ────────────────────────────────────────────────────────────

export interface Plot {
  nodes: SceneNode[];
  /** Data x → scene x. */
  px(x: number): number;
  /** Data y → scene y. */
  py(y: number): number;
  /** A sampled curve of `f`, clipped at the top of the plot; returns the path and where it ends. */
  curve(id: string, f: (x: number) => number, opts?: { tone?: Tone; from?: number; to?: number; width?: number; dashed?: boolean; dim?: boolean }): { node: PathNode; end: [number, number] };
}

/**
 * Axes for a chart. The area spans `x..x+w` and `y..y+h` in scene units and shows data from
 * `0..xMax` and `0..yMax`; ticks under the x axis are labelled with their values.
 */
export function plot(
  id: string,
  area: { x: number; y: number; w: number; h: number },
  opts: { xMin?: number; xMax: number; yMax: number; xTicks?: number[]; xLabel?: Rich; yLabel?: Rich },
): Plot {
  const { x, y, w, h } = area;
  const xMin = opts.xMin ?? 0;
  const px = (v: number) => x + ((v - xMin) / (opts.xMax - xMin)) * w;
  const py = (v: number) => y + h - (v / opts.yMax) * h;
  const nodes: SceneNode[] = [
    arrow(`${id}:x`, [x, y + h], [x + w + 14, y + h], { tone: 'muted', width: 1.25 }),
    arrow(`${id}:y`, [x, y + h], [x, y - 14], { tone: 'muted', width: 1.25 }),
    ...(opts.xTicks ?? []).map((t) => text(`${id}:t${t}`, px(t), y + h + 16, String(t), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })),
  ];
  if (opts.xLabel) nodes.push(text(`${id}:xl`, x + w / 2, y + h + 36, opts.xLabel, { anchor: 'middle', size: 12, tone: 'muted' }));
  if (opts.yLabel) nodes.push(text(`${id}:yl`, x - 8, y - 22, opts.yLabel, { size: 12, tone: 'muted' }));
  const curve: Plot['curve'] = (cid, f, o = {}) => {
    const from = o.from ?? xMin;
    const to = o.to ?? opts.xMax;
    const pts: [number, number][] = [];
    const steps = 80;
    for (let k = 0; k <= steps; k++) {
      const xv = from + ((to - from) * k) / steps;
      const yv = f(xv);
      if (yv > opts.yMax) {
        // Stop where the curve leaves the plot.
        const prev = pts[pts.length - 1];
        if (prev) pts.push([px(xv), py(opts.yMax)]);
        break;
      }
      pts.push([px(xv), py(Math.max(0, yv))]);
    }
    const d = pts.map(([a, b], k) => `${k ? 'L' : 'M'} ${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
    return {
      node: { kind: 'path', id: cid, d, tone: o.tone ?? 'info', width: o.width ?? 2.5, dashed: o.dashed, dim: o.dim },
      end: pts[pts.length - 1] ?? [px(from), py(0)],
    };
  };
  return { nodes, px, py, curve };
}

// ── Trees ─────────────────────────────────────────────────────────────

export interface TreeSlot {
  level: number;
  /** Position within its level, 0-based. */
  index: number;
  x: number;
  y: number;
}

/**
 * Slots of a complete binary tree with `levels` levels, centered in `left..left+width`.
 * Level k has 2^k slots evenly spread; `levelGap` is the vertical distance between levels.
 */
export function binarySlots(levels: number, left: number, width: number, top: number, levelGap: number): TreeSlot[] {
  const out: TreeSlot[] = [];
  for (let level = 0; level < levels; level++) {
    const count = 2 ** level;
    for (let index = 0; index < count; index++) out.push({ level, index, x: left + ((index + 0.5) * width) / count, y: top + level * levelGap });
  }
  return out;
}

/** Slots for any tree given each node's parent (−1 for the root): leaves are spread evenly, parents sit over their children. */
export function treeSlots(parents: number[], left: number, width: number, top: number, levelGap: number): TreeSlot[] {
  const children = parents.map((_, k) => parents.flatMap((p, c) => (p === k ? [c] : [])));
  const depth = (k: number): number => (parents[k] < 0 ? 0 : depth(parents[k]) + 1);
  const leaves: number[] = [];
  const walk = (k: number) => (children[k].length ? children[k].forEach(walk) : leaves.push(k));
  walk(parents.indexOf(-1));
  const xs = new Map<number, number>();
  leaves.forEach((k, i) => xs.set(k, left + ((i + 0.5) * width) / leaves.length));
  const place = (k: number): number => {
    if (xs.has(k)) return xs.get(k)!;
    const cx = children[k].map(place);
    const x = (Math.min(...cx) + Math.max(...cx)) / 2;
    xs.set(k, x);
    return x;
  };
  place(parents.indexOf(-1));
  const perLevel = new Map<number, number>();
  return parents.map((_, k) => {
    const level = depth(k);
    const index = perLevel.get(level) ?? 0;
    perLevel.set(level, index + 1);
    return { level, index, x: xs.get(k)!, y: top + level * levelGap };
  });
}

// ── Shapes ────────────────────────────────────────────────────────────

/** A flowchart decision: a diamond with a label, centered at cx, cy. */
export function diamond(id: string, cx: number, cy: number, w: number, h: number, label: Rich, tone: Tone = 'info', extra: Partial<PathNode> = {}): PathNode {
  const d = `M ${cx} ${cy - h / 2} L ${cx + w / 2} ${cy} L ${cx} ${cy + h / 2} L ${cx - w / 2} ${cy} Z`;
  return { kind: 'path', id, d, fill: true, tone, text: label, textAt: [cx, cy], size: 13, ...extra };
}

/**
 * A curly brace along one side of a span. `side` is where the brace points:
 * `right` draws `}` from y1 to y2 at x; `down` draws a brace under x1..x2 at y.
 */
export function brace(id: string, a: number, b: number, at: number, side: 'left' | 'right' | 'up' | 'down', tone: Tone = 'muted'): PathNode {
  const depth = 8;
  const mid = (a + b) / 2;
  const s = side === 'right' || side === 'down' ? 1 : -1;
  const d =
    side === 'left' || side === 'right'
      ? `M ${at} ${a} Q ${at + s * depth} ${a} ${at + s * depth} ${a + depth} L ${at + s * depth} ${mid - depth} Q ${at + s * depth} ${mid} ${at + s * depth * 2} ${mid} Q ${at + s * depth} ${mid} ${at + s * depth} ${mid + depth} L ${at + s * depth} ${b - depth} Q ${at + s * depth} ${b} ${at} ${b}`
      : `M ${a} ${at} Q ${a} ${at + s * depth} ${a + depth} ${at + s * depth} L ${mid - depth} ${at + s * depth} Q ${mid} ${at + s * depth} ${mid} ${at + s * depth * 2} Q ${mid} ${at + s * depth} ${mid + depth} ${at + s * depth} L ${b - depth} ${at + s * depth} Q ${b} ${at + s * depth} ${b} ${at}`;
  return { kind: 'path', id, d, tone, width: 1.25 };
}

// ── Binary trees with node identity ───────────────────────────────────

/** A binary tree node. `id` is the node's identity: keep it stable so moves (rotations, swaps) animate. */
export interface TreeSpec {
  id: string;
  v: Rich | number;
  l?: TreeSpec | null;
  r?: TreeSpec | null;
  tone?: Tone;
  dim?: boolean;
  ring?: boolean;
  dashed?: boolean;
}

/**
 * Builds a tree from a level-order array, as the book stores trees (`null` = no node).
 * Ids default to `n<value>`; pass `id` when values repeat.
 */
export function treeFromLevels(values: (number | string | null)[], id: (v: number | string, index: number) => string = (v) => `n${v}`): TreeSpec | null {
  const nodes = values.map((v, i) => (v === null ? null : ({ id: id(v, i), v } as TreeSpec)));
  nodes.forEach((n, i) => {
    if (!n) return;
    n.l = nodes[2 * i + 1] ?? null;
    n.r = nodes[2 * i + 2] ?? null;
  });
  return nodes[0] ?? null;
}

/** Every node of a tree in preorder, with its depth and slot (position within its level, as in a complete tree). */
export function treeWalk(root: TreeSpec | null): { node: TreeSpec; depth: number; slot: number; parent: TreeSpec | null }[] {
  const out: { node: TreeSpec; depth: number; slot: number; parent: TreeSpec | null }[] = [];
  const go = (n: TreeSpec | null | undefined, depth: number, slot: number, parent: TreeSpec | null) => {
    if (!n) return;
    out.push({ node: n, depth, slot, parent });
    go(n.l, depth + 1, slot * 2, n);
    go(n.r, depth + 1, slot * 2 + 1, n);
  };
  go(root, 0, 0, null);
  return out;
}

/**
 * Draws a binary tree: circles at slot positions (level d has 2^d evenly spaced slots across
 * `left..left+width`) and one edge per child, id'd by the child, so a node that changes parent
 * keeps its edge and both glide. Returns the drawn circles by node id for attaching labels.
 */
export function drawTree(
  prefix: string,
  root: TreeSpec | null,
  opts: { left: number; width: number; top: number; gap: number; r?: number; size?: number; edgeTone?: Tone },
) {
  const { left, width, top, gap, r = 17, size } = opts;
  const boxes = new Map<string, BoxNode>();
  const nodes: SceneNode[] = [];
  const walk = treeWalk(root);
  for (const { node, depth, slot } of walk) {
    const cx = left + ((slot + 0.5) * width) / 2 ** depth;
    const cy = top + depth * gap;
    const b = box(node.id, cx - r, cy - r, typeof node.v === 'number' ? String(node.v) : node.v, {
      w: r * 2,
      h: r * 2,
      shape: 'circle',
      size: size ?? (r < 15 ? 12 : 14),
      tone: node.tone ?? 'ok',
      dim: node.dim,
      ring: node.ring,
      dashed: node.dashed,
    });
    boxes.set(node.id, b);
  }
  for (const { node, parent } of walk) {
    if (!parent) continue;
    nodes.push(link(`${prefix}e:${node.id}`, boxes.get(parent.id)!, boxes.get(node.id)!, { pad: 2, width: 1.5, tone: opts.edgeTone, dim: node.dim }));
  }
  nodes.push(...boxes.values());
  return { nodes, boxes };
}

/** Height of a tree (number of edges on the longest root-to-leaf path; −1 for an empty tree). */
export const treeHeight = (n: TreeSpec | null | undefined): number => (n ? 1 + Math.max(treeHeight(n.l), treeHeight(n.r)) : -1);

// ── Graphs ────────────────────────────────────────────────────────────

export interface GraphVertex {
  /** Stable id: keep it between frames so the vertex can move or recolor smoothly. */
  id: string;
  v: Rich | number;
  x: number;
  y: number;
  tone?: Tone;
  dim?: boolean;
  ring?: boolean;
  dashed?: boolean;
}

export interface GraphEdge {
  a: string;
  b: string;
  /** Draw an arrowhead from a to b. */
  directed?: boolean;
  weight?: Rich | number;
  tone?: Tone;
  dim?: boolean;
  dashed?: boolean;
  /** Curve the edge sideways (useful for a pair of opposite directed edges). */
  bend?: number;
}

/**
 * Draws a graph with vertices as circles at given centers. Edge ids are `<prefix>e:<a>-<b>`
 * with the endpoints sorted for undirected edges, so the same edge keeps its id across frames.
 * Weights sit at the edge's midpoint on a small chip.
 */
export function drawGraph(prefix: string, vertices: GraphVertex[], edges: GraphEdge[], opts: { r?: number; size?: number } = {}) {
  const { r = 18, size } = opts;
  const boxes = new Map<string, BoxNode>();
  for (const v of vertices) {
    boxes.set(
      v.id,
      box(v.id, v.x - r, v.y - r, typeof v.v === 'number' ? String(v.v) : v.v, {
        w: r * 2,
        h: r * 2,
        shape: 'circle',
        size: size ?? 14,
        tone: v.tone ?? 'ok',
        dim: v.dim,
        ring: v.ring,
        dashed: v.dashed,
      }),
    );
  }
  const nodes: SceneNode[] = [];
  for (const e of edges) {
    const key = e.directed ? `${e.a}>${e.b}` : [e.a, e.b].sort().join('-');
    const A = boxes.get(e.a)!;
    const B = boxes.get(e.b)!;
    nodes.push(link(`${prefix}e:${key}`, A, B, { head: e.directed ? 'end' : 'none', tone: e.tone, dim: e.dim, dashed: e.dashed, bend: e.bend, width: 1.75, pad: e.directed ? 3 : 1 }));
    if (e.weight !== undefined) {
      const ca = center(A);
      const cb = center(B);
      nodes.push(chip(`${prefix}w:${key}`, (ca.x + cb.x) / 2, (ca.y + cb.y) / 2 - 12, typeof e.weight === 'number' ? String(e.weight) : e.weight, { size: 11, dim: e.dim }));
    }
  }
  nodes.push(...boxes.values());
  return { nodes, boxes };
}

/** Vertices evenly placed on a circle, starting at the top and going clockwise. */
export function ringLayout(ids: string[], cx: number, cy: number, radius: number): Record<string, { x: number; y: number }> {
  return Object.fromEntries(
    ids.map((id, k) => {
      const a = -Math.PI / 2 + (2 * Math.PI * k) / ids.length;
      return [id, { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) }];
    }),
  );
}

// ── Grids (DP tables, boards) ─────────────────────────────────────────

/**
 * A 2D grid of cells, row by row. Cell ids are `<prefix><r>-<c>` unless a cell gives its own,
 * so a value that changes keeps its cell and only recolors.
 */
export function grid(prefix: string, x: number, y: number, rows: Cell[][], opts: { w?: number; h?: number; gap?: number; size?: number } = {}) {
  const { w = CELL, h = CELL, gap = GAP, size } = opts;
  return rows.flatMap((row, r) =>
    row.map((c, k) =>
      box(c.id ?? `${prefix}${r}-${k}`, x + k * (w + gap), y + r * (h + gap), c.value === null ? '' : c.value, {
        w,
        h,
        size,
        tone: c.tone ?? (c.value === null ? 'ghost' : 'idle'),
        dashed: c.dashed ?? c.value === null,
        dim: c.dim,
        ring: c.ring,
      }),
    ),
  );
}

/** Top-left corner of a grid cell, for arrows and labels. */
export const gridAt = (x: number, y: number, r: number, c: number, w = CELL, h = CELL, gap = GAP) => ({ x: x + c * (w + gap), y: y + r * (h + gap), w, h });
