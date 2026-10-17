import type { Mark, SourceSpec, LangId } from '../engine/types';
import type { Locale } from '../i18n/locale';

/**
 * Figures are drawn from plain data: a scene is a list of nodes in a fixed coordinate space,
 * rendered as SVG by SceneView. Nodes keep a stable `id`, so a node that changes position or
 * color between two frames of a step figure animates instead of jumping.
 */

/** Colors come from the site theme; see figures.css. */
export type Tone = 'idle' | 'accent' | 'warn' | 'ok' | 'info' | 'danger' | 'muted' | 'ghost' | 'soft';

/** A run of text with its own color or weight, e.g. `nums[` + `4` + `]`. */
export interface Segment {
  t: string;
  tone?: Tone;
  bold?: boolean;
}

export type Rich = string | Segment[];

interface Base {
  id: string;
  tone?: Tone;
  /** Faded: present but not part of the current step. */
  dim?: boolean;
}

/** A cell, a list node (`shape: 'circle'`), or a code chip (`shape: 'chip'`). `x`, `y` is the top-left corner. */
export interface BoxNode extends Base {
  kind: 'box';
  x: number;
  y: number;
  w: number;
  h: number;
  text?: Rich;
  shape?: 'rect' | 'circle' | 'chip';
  size?: number;
  /** Numbers and code use the monospace face; labels can use the text face. */
  sans?: boolean;
  dashed?: boolean;
  /** Raised: a highlight ring around the box. */
  ring?: boolean;
}

export interface TextNode extends Base {
  kind: 'text';
  x: number;
  y: number;
  text: Rich;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  bold?: boolean;
  mono?: boolean;
}

export interface ArrowNode extends Base {
  kind: 'arrow';
  from: [number, number];
  to: [number, number];
  /** Sideways offset of the curve's middle, in scene units; 0 is straight. */
  bend?: number;
  /** Route through these corner points instead of a curve. */
  via?: [number, number][];
  head?: 'end' | 'both' | 'none';
  dashed?: boolean;
  width?: number;
}

/** A translucent panel behind a group of nodes, with an optional title. */
export interface RegionNode extends Base {
  kind: 'region';
  x: number;
  y: number;
  w: number;
  h: number;
  label?: Rich;
  /** Where the label sits. */
  labelAt?: 'top' | 'inside';
}

/** Any outline in scene coordinates (pyramid layers, braces). */
export interface PathNode extends Base {
  kind: 'path';
  d: string;
  fill?: boolean;
  text?: Rich;
  textAt?: [number, number];
  size?: number;
  /** Outline width; defaults to 1.5. */
  width?: number;
}

export type IconName = 'cpu' | 'cache' | 'ram' | 'disk';

export interface IconNode extends Base {
  kind: 'icon';
  x: number;
  y: number;
  size: number;
  icon: IconName;
}

export type SceneNode = BoxNode | TextNode | ArrowNode | RegionNode | PathNode | IconNode;

export interface Scene {
  w: number;
  h: number;
  nodes: SceneNode[];
}

export interface LegendItem {
  tone: Tone;
  text: string;
  shape?: 'rect' | 'circle' | 'line';
  dashed?: boolean;
}

/** One step of an animated figure. */
export interface SceneFrame {
  kind: string;
  scene: Scene;
  /** What happens in this step, in the page's language. */
  say: string;
  /** The call in the header, e.g. `push(4)`; defaults to the figure's own. */
  call?: string;
}

export interface StaticFigure {
  type: 'static';
  build(locale: Locale): { scene: Scene; legend?: LegendItem[]; notes?: string[] };
}

export interface StepFigure {
  type: 'steps';
  build(locale: Locale): { frames: SceneFrame[]; legend?: LegendItem[] };
  call?: string;
  initialStep?: number;
  /** Timeline color per frame kind. */
  tones: Record<string, Mark>;
  sources?(locale: Locale): Partial<Record<LangId, SourceSpec>>;
}

export type Figure = StaticFigure | StepFigure;
