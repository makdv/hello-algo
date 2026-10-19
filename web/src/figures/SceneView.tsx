import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { ArrowNode, BoxNode, IconName, IconNode, PathNode, RegionNode, Rich, Scene, SceneNode, TextNode } from './scene';

const at = (x: number, y: number, extra = ''): CSSProperties => ({ transform: `translate(${x}px, ${y}px)${extra}` });

function RichText({ value }: { value: Rich }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      {value.map((s, k) => (
        <tspan key={k} className={`${s.tone ? `ha-ink--${s.tone}` : ''}${s.bold ? ' ha-sn__bold' : ''}`}>
          {s.t}
        </tspan>
      ))}
    </>
  );
}

function classes(n: SceneNode, leaving: boolean, extra = '') {
  return `ha-sn ha-sn--${n.kind} ha-t--${n.tone ?? 'idle'}${n.dim ? ' is-dim' : ''}${leaving ? ' is-leaving' : ''}${extra}`;
}

function Box({ n, leaving }: { n: BoxNode; leaving: boolean }) {
  // Small cells get proportionally smaller corners, so they stay square.
  const rx = n.shape === 'circle' ? n.w / 2 : n.shape === 'chip' ? 7 : Math.min(8, Math.min(n.w, n.h) / 4);
  const size = n.size ?? (n.shape === 'circle' ? 14 : 15);
  const mono = !n.sans;
  return (
    <g className={classes(n, leaving, `${n.shape ? ` ha-sn--${n.shape}` : ''}${n.dashed ? ' is-dashed' : ''}${n.ring ? ' is-ring' : ''}`)} style={at(n.x, n.y)}>
      {n.ring && <rect className="ha-sn__ring" x={-4} y={-4} width={n.w + 8} height={n.h + 8} rx={rx + 4} />}
      <rect className="ha-sn__shape" width={n.w} height={n.h} rx={rx} />
      {n.text !== undefined && n.text !== '' && (
        <text className={mono ? 'ha-sn__mono' : 'ha-sn__sans'} x={n.w / 2} y={n.h / 2} dy="0.35em" textAnchor="middle" fontSize={size}>
          <RichText value={n.text} />
        </text>
      )}
    </g>
  );
}

function Text({ n, leaving }: { n: TextNode; leaving: boolean }) {
  return (
    <g className={classes(n, leaving)} style={at(n.x, n.y)}>
      <text
        className={`${n.mono ? 'ha-sn__mono' : 'ha-sn__sans'}${n.bold ? ' ha-sn__bold' : ''}`}
        textAnchor={n.anchor ?? 'start'}
        fontSize={n.size ?? 14}
      >
        <RichText value={n.text} />
      </text>
    </g>
  );
}

const HEAD = 9;

/** Path for an arrow and the angle of its end, so the head can be placed on it. */
function arrowGeometry(n: ArrowNode) {
  const [x1, y1] = n.from;
  const [x2, y2] = n.to;
  const head = n.head ?? 'end';
  if (n.via?.length) {
    const pts = [n.from, ...n.via, n.to];
    const [px, py] = pts[pts.length - 2];
    const [sx, sy] = pts[1];
    const endAngle = Math.atan2(y2 - py, x2 - px);
    const startAngle = Math.atan2(y1 - sy, x1 - sx);
    const trimEnd = head === 'none' ? 0 : HEAD - 2;
    const trimStart = head === 'both' ? HEAD - 2 : 0;
    const e: [number, number] = [x2 - Math.cos(endAngle) * trimEnd, y2 - Math.sin(endAngle) * trimEnd];
    const s: [number, number] = [x1 - Math.cos(startAngle) * trimStart, y1 - Math.sin(startAngle) * trimStart];
    const d = `M ${s[0]} ${s[1]} ${n.via.map(([x, y]) => `L ${x} ${y}`).join(' ')} L ${e[0]} ${e[1]}`;
    return { d, endAngle, startAngle };
  }
  const bend = n.bend ?? 0;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  // Control point offset perpendicular to the line.
  const cx = mx + (-(y2 - y1) / len) * bend * 2;
  const cy = my + ((x2 - x1) / len) * bend * 2;
  const endAngle = Math.atan2(y2 - cy, x2 - cx);
  const startAngle = Math.atan2(y1 - cy, x1 - cx);
  const trimEnd = head === 'none' ? 0 : HEAD - 2;
  const trimStart = head === 'both' ? HEAD - 2 : 0;
  const ex = x2 - Math.cos(endAngle) * trimEnd;
  const ey = y2 - Math.sin(endAngle) * trimEnd;
  const sx = x1 - Math.cos(startAngle) * trimStart;
  const sy = y1 - Math.sin(startAngle) * trimStart;
  // Always a quadratic curve, so the path can morph between straight and bent.
  return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`, endAngle, startAngle };
}

function Arrow({ n, leaving }: { n: ArrowNode; leaving: boolean }) {
  const { d, endAngle, startAngle } = arrowGeometry(n);
  const head = n.head ?? 'end';
  const deg = (r: number) => (r * 180) / Math.PI;
  const headPath = `M 0 0 L ${-HEAD} ${-HEAD / 2} L ${-HEAD} ${HEAD / 2} Z`;
  return (
    <g className={classes(n, leaving, n.dashed ? ' is-dashed' : '')}>
      <path className="ha-sn__line" d={d} style={{ d: `path("${d}")`, strokeWidth: n.width ?? 1.75 } as CSSProperties} />
      {head !== 'none' && <path className="ha-sn__head" d={headPath} style={at(n.to[0], n.to[1], ` rotate(${deg(endAngle)}deg)`)} />}
      {head === 'both' && <path className="ha-sn__head" d={headPath} style={at(n.from[0], n.from[1], ` rotate(${deg(startAngle)}deg)`)} />}
    </g>
  );
}

function Region({ n, leaving }: { n: RegionNode; leaving: boolean }) {
  return (
    <g className={classes(n, leaving)} style={at(n.x, n.y)}>
      <rect className="ha-sn__shape" width={n.w} height={n.h} rx={12} />
      {n.label !== undefined && (
        <text className="ha-sn__sans ha-sn__bold ha-sn__label" x={n.labelAt === 'inside' ? 12 : n.w / 2} y={n.labelAt === 'inside' ? 20 : -10} textAnchor={n.labelAt === 'inside' ? 'start' : 'middle'} fontSize={13}>
          <RichText value={n.label} />
        </text>
      )}
    </g>
  );
}

function PathShape({ n, leaving }: { n: PathNode; leaving: boolean }) {
  return (
    <g className={classes(n, leaving, `${n.fill ? ' is-filled' : ''}${n.dashed ? ' is-dashed' : ''}`)}>
      <path className="ha-sn__shape" d={n.d} style={{ d: `path("${n.d}")`, ...(n.width ? { strokeWidth: n.width } : {}) } as CSSProperties} />
      {n.text !== undefined && n.textAt && (
        <text className="ha-sn__sans ha-sn__on" x={n.textAt[0]} y={n.textAt[1]} dy="0.35em" textAnchor="middle" fontSize={n.size ?? 14}>
          <RichText value={n.text} />
        </text>
      )}
    </g>
  );
}

/** Small line icons on a 24-unit grid. */
const ICONS: Record<IconName, ReactNode> = {
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  cache: (
    <>
      <ellipse cx="11" cy="5.5" rx="7" ry="2.5" />
      <path d="M4 5.5v12c0 1.4 3.1 2.5 7 2.5M18 5.5v5M4 11.5c0 1.4 3.1 2.5 7 2.5" />
      <path d="M17 13l-3 5h4l-2 4" />
    </>
  ),
  ram: (
    <>
      <rect x="2" y="7" width="20" height="9" rx="1.5" />
      <path d="M6 10v3M10 10v3M14 10v3M18 10v3M5 16v2.5M9 16v2.5M13 16v2.5M17 16v2.5" />
    </>
  ),
  disk: (
    <>
      <rect x="3.5" y="2.5" width="17" height="19" rx="3" />
      <circle cx="12" cy="10" r="5" />
      <circle cx="12" cy="10" r="1" />
      <path d="M12 10l3.5 7.5" />
      <circle cx="7" cy="18.5" r="0.6" />
    </>
  ),
};

function Icon({ n, leaving }: { n: IconNode; leaving: boolean }) {
  return (
    <g className={classes(n, leaving)} style={at(n.x, n.y, ` scale(${n.size / 24})`)}>
      {ICONS[n.icon]}
    </g>
  );
}

const LAYER: Record<SceneNode['kind'], number> = { region: 0, path: 1, arrow: 2, box: 3, icon: 3, text: 4 };

function draw(n: SceneNode, leaving: boolean) {
  switch (n.kind) {
    case 'box':
      return <Box key={n.id} n={n} leaving={leaving} />;
    case 'text':
      return <Text key={n.id} n={n} leaving={leaving} />;
    case 'arrow':
      return <Arrow key={n.id} n={n} leaving={leaving} />;
    case 'region':
      return <Region key={n.id} n={n} leaving={leaving} />;
    case 'path':
      return <PathShape key={n.id} n={n} leaving={leaving} />;
    case 'icon':
      return <Icon key={n.id} n={n} leaving={leaving} />;
  }
}

/**
 * Draws a scene as SVG. When the scene changes, nodes with the same id glide to their new
 * place and color, new nodes fade in, and removed nodes fade out before they are dropped.
 */
export function SceneView({ scene, label, maxScale = 1.25 }: { scene: Scene; label: string; maxScale?: number }) {
  const [prev, setPrev] = useState(scene);
  const [leaving, setLeaving] = useState<SceneNode[]>([]);

  if (scene !== prev) {
    const ids = new Set(scene.nodes.map((n) => n.id));
    const gone = [...leaving, ...prev.nodes].filter((n, k, all) => !ids.has(n.id) && all.findIndex((m) => m.id === n.id) === k);
    setLeaving(gone);
    setPrev(scene);
  }

  useEffect(() => {
    if (!leaving.length) return;
    const timer = setTimeout(() => setLeaving([]), 420);
    return () => clearTimeout(timer);
  }, [leaving]);

  const all = [...scene.nodes.map((n) => [n, false] as const), ...leaving.map((n) => [n, true] as const)];
  all.sort((a, b) => LAYER[a[0].kind] - LAYER[b[0].kind]);

  return (
    <svg
      className="ha-scene"
      viewBox={`0 0 ${scene.w} ${scene.h}`}
      style={{ maxWidth: `${scene.w * maxScale}px` }}
      role="img"
      aria-label={label}
    >
      {all.map(([n, gone]) => draw(n, gone))}
    </svg>
  );
}
