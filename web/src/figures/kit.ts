import type { ArrowNode, BoxNode, Rich, RegionNode, SceneNode, Segment, TextNode, Tone } from './scene';

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
