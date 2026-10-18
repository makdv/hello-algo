import csJavaEn from '@codes-en/java/chapter_dynamic_programming/climbing_stairs_dp.java?raw';
import mcJavaEn from '@codes-en/java/chapter_dynamic_programming/min_cost_climbing_stairs_dp.java?raw';
import mpJavaEn from '@codes-en/java/chapter_dynamic_programming/min_path_sum.java?raw';
import csPyEn from '@codes-en/python/chapter_dynamic_programming/climbing_stairs_dp.py?raw';
import mcPyEn from '@codes-en/python/chapter_dynamic_programming/min_cost_climbing_stairs_dp.py?raw';
import mpPyEn from '@codes-en/python/chapter_dynamic_programming/min_path_sum.py?raw';
import csJavaJa from '@codes-ja/java/chapter_dynamic_programming/climbing_stairs_dp.java?raw';
import mcJavaJa from '@codes-ja/java/chapter_dynamic_programming/min_cost_climbing_stairs_dp.java?raw';
import mpJavaJa from '@codes-ja/java/chapter_dynamic_programming/min_path_sum.java?raw';
import csPyJa from '@codes-ja/python/chapter_dynamic_programming/climbing_stairs_dp.py?raw';
import mcPyJa from '@codes-ja/python/chapter_dynamic_programming/min_cost_climbing_stairs_dp.py?raw';
import mpPyJa from '@codes-ja/python/chapter_dynamic_programming/min_path_sum.py?raw';
import csJavaRu from '@codes-ru/java/chapter_dynamic_programming/climbing_stairs_dp.java?raw';
import mcJavaRu from '@codes-ru/java/chapter_dynamic_programming/min_cost_climbing_stairs_dp.java?raw';
import mpJavaRu from '@codes-ru/java/chapter_dynamic_programming/min_path_sum.java?raw';
import csPyRu from '@codes-ru/python/chapter_dynamic_programming/climbing_stairs_dp.py?raw';
import mcPyRu from '@codes-ru/python/chapter_dynamic_programming/min_cost_climbing_stairs_dp.py?raw';
import mpPyRu from '@codes-ru/python/chapter_dynamic_programming/min_path_sum.py?raw';
import csJavaZh from '@codes-zh/java/chapter_dynamic_programming/climbing_stairs_dp.java?raw';
import mcJavaZh from '@codes-zh/java/chapter_dynamic_programming/min_cost_climbing_stairs_dp.java?raw';
import mpJavaZh from '@codes-zh/java/chapter_dynamic_programming/min_path_sum.java?raw';
import csPyZh from '@codes-zh/python/chapter_dynamic_programming/climbing_stairs_dp.py?raw';
import mcPyZh from '@codes-zh/python/chapter_dynamic_programming/min_cost_climbing_stairs_dp.py?raw';
import mpPyZh from '@codes-zh/python/chapter_dynamic_programming/min_path_sum.py?raw';
import csJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/climbing_stairs_dp.java?raw';
import mcJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/min_cost_climbing_stairs_dp.java?raw';
import mpJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/min_path_sum.java?raw';
import csPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/climbing_stairs_dp.py?raw';
import mcPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/min_cost_climbing_stairs_dp.py?raw';
import mpPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/min_path_sum.py?raw';
import { arrow, binarySlots, box, chip, link, text, textWidth, treeSlots } from '../kit';
import type { ArrowNode, BoxNode, Figure, LegendItem, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

const CS_PY = raw(csPyEn, csPyZh, csPyZhHant, csPyJa, csPyRu);
const CS_JAVA = raw(csJavaEn, csJavaZh, csJavaZhHant, csJavaJa, csJavaRu);
const MC_PY = raw(mcPyEn, mcPyZh, mcPyZhHant, mcPyJa, mcPyRu);
const MC_JAVA = raw(mcJavaEn, mcJavaZh, mcJavaZhHant, mcJavaJa, mcJavaRu);
const MP_PY = raw(mpPyEn, mpPyZh, mpPyZhHant, mpPyJa, mpPyRu);
const MP_JAVA = raw(mpJavaEn, mpJavaZh, mpJavaZhHant, mpJavaJa, mpJavaRu);

const W = 440;

// ── Shared pieces ─────────────────────────────────────────────────────

/** A row of chips centered on `cx`; every chip keeps its place even when some are hidden. */
function chipRow(prefix: string, cx: number, y: number, items: { text: Rich; tone?: Tone; dashed?: boolean; dim?: boolean; ring?: boolean; hidden?: boolean }[], opts: { gap?: number; size?: number } = {}) {
  const { gap = 12, size = 13 } = opts;
  const widths = items.map((it) => Math.round(textWidth(it.text, size, true) + 20));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
  let x = cx - total / 2;
  const out: BoxNode[] = [];
  items.forEach((it, k) => {
    if (!it.hidden) out.push(chip(`${prefix}${k}`, x, y, it.text, { align: 'start', size, tone: it.tone ?? 'idle', dashed: it.dashed, dim: it.dim, ring: it.ring }));
    x += widths[k] + gap;
  });
  return out;
}

interface Stairs {
  nodes: SceneNode[];
  /** Middle of step k's tread. */
  top(k: number): [number, number];
}

/** A staircase rising to the right: the ground (step 0) and steps 1..n, with the step numbers underneath. */
function stairs(x0: number, base: number, sw: number, sh: number, n: number, opts: { tread?: (k: number) => Tone | undefined; label?: (k: number) => Tone | undefined; labels?: boolean } = {}): Stairs {
  const { labels = true } = opts;
  let d = `M ${x0} ${base}`;
  for (let k = 0; k <= n; k++) d += ` L ${x0 + k * sw} ${base - k * sh} L ${x0 + (k + 1) * sw} ${base - k * sh}`;
  d += ` L ${x0 + (n + 1) * sw} ${base} Z`;
  const nodes: SceneNode[] = [{ kind: 'path', id: 'stairs', d, fill: true, tone: 'muted', width: 1.25 }];
  for (let k = 0; k <= n; k++) {
    const tone = opts.tread?.(k);
    const y = base - k * sh;
    if (tone) nodes.push({ kind: 'path', id: `tread${k}`, d: `M ${x0 + k * sw + 4} ${y} L ${x0 + (k + 1) * sw - 4} ${y}`, tone, width: 4 });
    if (labels) nodes.push(text(`step${k}`, x0 + k * sw + sw / 2, base + 20, String(k), { anchor: 'middle', mono: true, size: 13, bold: !!opts.label?.(k), tone: opts.label?.(k) ?? 'muted' }));
  }
  return { nodes, top: (k) => [x0 + k * sw + sw / 2, base - k * sh] };
}

/** A jump from step a up to step b, drawn as an arc over the stairs. */
function hop(id: string, s: Stairs, a: number, b: number, tone: Tone, opts: Partial<ArrowNode> & { dx?: number } = {}): ArrowNode {
  const { dx = 0, ...rest } = opts;
  const [x1, y1] = s.top(a);
  const [x2, y2] = s.top(b);
  return arrow(id, [x1 + dx, y1 - 2], [x2 + dx, y2 - 2], { bend: -(8 + 10 * (b - a)), tone, width: 2, ...rest });
}

/** The highest point of a hop's arc, for marking it. */
function hopApex(s: Stairs, a: number, b: number, dx = 0): [number, number] {
  const [x1, y1] = s.top(a);
  const [x2, y2] = s.top(b);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const bend = -(8 + 10 * (b - a));
  return [(x1 + x2) / 2 + dx + (-(y2 - y1) / len) * bend, (y1 + y2) / 2 - 2 + ((x2 - x1) / len) * bend];
}

const arrowPath = (p: number[]) => p.join(' → ');

const WAYS = [
  [0, 1, 2, 3],
  [0, 2, 3],
  [0, 1, 3],
];
const WAY_TONE: Tone[] = ['accent', 'info', 'warn'];

// ── Climbing stairs: the three ways up ────────────────────────────────

const EXAMPLE_SAY: Record<'start' | 'way0' | 'way1' | 'way2' | 'done', T> = {
  start: {
    en: 'A staircase of 3 steps. Each move climbs 1 or 2 steps. How many different ways lead to the top?',
    zh: '一个 3 阶的楼梯，每步可以上 1 阶或 2 阶。有多少种方案可以爬到楼顶？',
    'zh-hant': '一個 3 階的樓梯，每步可以上 1 階或 2 階。有多少種方案可以爬到樓頂？',
    ja: '3 段の階段です。各ステップで 1 段または 2 段上れます。頂上まで何通りの方法があるでしょうか。',
    ru: 'Лестница из 3 ступеней. За шаг можно подняться на 1 или 2 ступени. Сколькими способами можно добраться до вершины?',
  },
  way0: {
    en: 'Way 1: 0 → 1 → 2 → 3, three moves of 1 step.',
    zh: '方案 1：0 → 1 → 2 → 3，连续上 3 次 1 阶。',
    'zh-hant': '方案 1：0 → 1 → 2 → 3，連續上 3 次 1 階。',
    ja: '方法 1：0 → 1 → 2 → 3。1 段ずつ 3 回上ります。',
    ru: 'Способ 1: 0 → 1 → 2 → 3 — три шага по 1 ступени.',
  },
  way1: {
    en: 'Way 2: 0 → 2 → 3, first 2 steps, then 1 step.',
    zh: '方案 2：0 → 2 → 3，先上 2 阶，再上 1 阶。',
    'zh-hant': '方案 2：0 → 2 → 3，先上 2 階，再上 1 階。',
    ja: '方法 2：0 → 2 → 3。先に 2 段、次に 1 段上ります。',
    ru: 'Способ 2: 0 → 2 → 3 — сначала 2 ступени, затем 1.',
  },
  way2: {
    en: 'Way 3: 0 → 1 → 3, first 1 step, then 2 steps.',
    zh: '方案 3：0 → 1 → 3，先上 1 阶，再上 2 阶。',
    'zh-hant': '方案 3：0 → 1 → 3，先上 1 階，再上 2 階。',
    ja: '方法 3：0 → 1 → 3。先に 1 段、次に 2 段上ります。',
    ru: 'Способ 3: 0 → 1 → 3 — сначала 1 ступень, затем 2.',
  },
  done: {
    en: 'There are 3 ways to reach step 3.',
    zh: '爬到第 3 阶共有 3 种方案。',
    'zh-hant': '爬到第 3 階共有 3 種方案。',
    ja: '第 3 段まで上る方法は全部で 3 通りです。',
    ru: 'Всего есть 3 способа подняться на 3-ю ступень.',
  },
};

const climbingStairsExample: StepFigure = {
  type: 'steps',
  call: 'n = 3',
  tones: { start: 'idle', way: 'cmp', done: 'done' },
  build(l) {
    const s = stairs(50, 176, 84, 44, 3, { tread: (k) => (k === 3 ? 'ok' : undefined), label: (k) => (k === 3 ? 'ok' : undefined) });
    const scene = (shown: number, focus: number | null) => {
      const nodes: SceneNode[] = [...s.nodes];
      WAYS.forEach((p, w) => {
        if (w >= shown) return;
        const dim = focus !== null && w !== focus;
        for (let k = 1; k < p.length; k++) nodes.push(hop(`w${w}:${k}`, s, p[k - 1], p[k], WAY_TONE[w], { dx: (w - 1) * 9, dim, dashed: w === 1 }));
      });
      nodes.push(...chipRow('c', W / 2, 218, WAYS.map((p, w) => ({ text: arrowPath(p), tone: WAY_TONE[w], hidden: w >= shown, dim: focus !== null && w !== focus }))));
      return { w: W, h: 256, nodes };
    };
    const frames: SceneFrame[] = [{ kind: 'start', scene: scene(0, null), say: EXAMPLE_SAY.start[l] }];
    WAYS.forEach((_, w) => frames.push({ kind: 'way', scene: scene(w + 1, w), say: EXAMPLE_SAY[`way${w}` as 'way0'][l] }));
    frames.push({ kind: 'done', scene: scene(3, null), say: EXAMPLE_SAY.done[l] });
    return { frames };
  },
};

// ── dp[i] = dp[i−1] + dp[i−2] on the stairs ───────────────────────────

const CS_DP = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55];

const climbingStairsStateTransfer: StaticFigure = {
  type: 'static',
  build(l) {
    const x0 = 40;
    const sw = 50;
    const s = stairs(x0, 186, sw, 24, 6, { labels: false, tread: (k) => ({ 3: 'info', 4: 'accent', 5: 'ok' }) [k] as Tone | undefined });
    const tone = (k: number): Tone | undefined => ({ 3: 'info', 4: 'accent', 5: 'ok' })[k] as Tone | undefined;
    const colX = (k: number) => x0 + k * sw + sw / 2;
    const nodes: SceneNode[] = [
      ...s.nodes,
      hop('h3', s, 3, 5, 'info', { dashed: true }),
      hop('h4', s, 4, 5, 'accent'),
      chip(
        'eq',
        12,
        10,
        seg2(['dp[', null], ['5', 'ok'], ['] = dp[', null], ['4', 'accent'], ['] + dp[', null], ['3', 'info'], ['] = 5 + 3 = ', null], ['8', 'ok']),
        { align: 'start' },
      ),
      text('h:n', colX(0), 210, 'i', { anchor: 'middle', mono: true, size: 13, tone: 'muted' }),
      text('h:dp', colX(0), 240, 'dp[i]', { anchor: 'middle', mono: true, size: 13, tone: 'muted' }),
    ];
    for (let k = 1; k <= 6; k++) {
      nodes.push(text(`n${k}`, colX(k), 210, String(k), { anchor: 'middle', mono: true, size: 13, bold: !!tone(k), tone: tone(k) ?? 'muted' }));
      nodes.push(box(`dp${k}`, colX(k) - 20, 220, CS_DP[k], { w: 40, h: 32, size: 14, tone: tone(k) ?? 'idle' }));
    }
    nodes.push(
      arrow('a3', [colX(3), 254], [colX(5) - 4, 254], { bend: 14, tone: 'info', dashed: true }),
      arrow('a4', [colX(4) + 4, 254], [colX(5) + 4, 254], { bend: 7, tone: 'accent' }),
      text('plus', colX(4), 286, '+', { anchor: 'middle', mono: true, bold: true, size: 14, tone: 'muted' }),
    );
    return {
      scene: { w: W, h: 296, nodes },
      notes: [
        {
          en: 'Step i can only be reached from step i − 1 or step i − 2, so dp[i] = dp[i − 1] + dp[i − 2].',
          zh: '只能从第 i − 1 阶或第 i − 2 阶到达第 i 阶，因此 dp[i] = dp[i − 1] + dp[i − 2]。',
          'zh-hant': '只能從第 i − 1 階或第 i − 2 階到達第 i 階，因此 dp[i] = dp[i − 1] + dp[i − 2]。',
          ja: '第 i 段には第 i − 1 段か第 i − 2 段からしか到達できないので、dp[i] = dp[i − 1] + dp[i − 2] です。',
          ru: 'На ступень i можно попасть только со ступени i − 1 или i − 2, поэтому dp[i] = dp[i − 1] + dp[i − 2].',
        }[l],
      ],
    };
  },
};

/** Colored runs where `null` means the default color. */
function seg2(...parts: [string, Tone | null, boolean?][]): Rich {
  return parts.map(([t, tone, bold]) => ({ t, tone: tone ?? undefined, bold: bold ?? (tone ? true : undefined) }));
}

// ── Recursion tree of dp[9] ───────────────────────────────────────────

const V_TONE: Record<number, Tone> = { 9: 'idle', 8: 'danger', 7: 'warn', 6: 'info', 5: 'ok', 4: 'accent', 3: 'muted' };

const DFS_SAY: Record<'l0' | 'l1' | 'l2' | 'l3' | 'repeat', T> = {
  l0: {
    en: 'Brute force search starts from the original problem dp[9].',
    zh: '暴力搜索从原问题 dp[9] 开始。',
    'zh-hant': '暴力搜尋從原問題 dp[9] 開始。',
    ja: '総当たり探索は元の問題 dp[9] から始まります。',
    ru: 'Полный перебор начинается с исходной задачи dp[9].',
  },
  l1: {
    en: 'dp[9] = dp[8] + dp[7]: the problem splits into two smaller subproblems.',
    zh: 'dp[9] = dp[8] + dp[7]：问题被分解为两个更小的子问题。',
    'zh-hant': 'dp[9] = dp[8] + dp[7]：問題被分解為兩個更小的子問題。',
    ja: 'dp[9] = dp[8] + dp[7]：問題は 2 つの小さな部分問題に分解されます。',
    ru: 'dp[9] = dp[8] + dp[7]: задача распадается на две подзадачи поменьше.',
  },
  l2: {
    en: 'dp[8] needs dp[7] too, so dp[7] is solved twice. Same color means the same subproblem.',
    zh: 'dp[8] 也需要 dp[7]，于是 dp[7] 被计算了两次。颜色相同表示同一个子问题。',
    'zh-hant': 'dp[8] 也需要 dp[7]，於是 dp[7] 被計算了兩次。顏色相同表示同一個子問題。',
    ja: 'dp[8] も dp[7] を必要とするので、dp[7] は 2 回計算されます。同じ色は同じ部分問題です。',
    ru: 'dp[8] тоже нужен dp[7], поэтому dp[7] решается дважды. Одинаковый цвет — одна и та же подзадача.',
  },
  l3: {
    en: 'Each level doubles the number of calls, and the same subproblems keep coming back.',
    zh: '每下一层调用数量就翻倍，相同的子问题反复出现。',
    'zh-hant': '每下一層呼叫數量就翻倍，相同的子問題反覆出現。',
    ja: '1 段下がるごとに呼び出しは倍になり、同じ部分問題が何度も現れます。',
    ru: 'На каждом уровне вызовов вдвое больше, и одни и те же подзадачи появляются снова.',
  },
  repeat: {
    en: 'In just these 4 levels dp[5] is computed 4 times. These overlapping subproblems make the time O(2{n}).',
    zh: '仅这 4 层中 dp[5] 就被计算了 4 次。正是这些重叠子问题导致了 O(2{n}) 的时间复杂度。',
    'zh-hant': '僅這 4 層中 dp[5] 就被計算了 4 次。正是這些重疊子問題導致了 O(2{n}) 的時間複雜度。',
    ja: 'この 4 段だけで dp[5] は 4 回計算されます。こうした重複部分問題が O(2{n}) の時間計算量を生みます。',
    ru: 'Только на этих 4 уровнях dp[5] вычисляется 4 раза. Именно перекрывающиеся подзадачи дают время O(2{n}).',
  },
};

const climbingStairsDfsTree: StepFigure = {
  type: 'steps',
  call: 'dfs(9)',
  tones: { level: 'cmp', repeat: 'done' },
  build(l) {
    const slots = binarySlots(4, 0, 460, 24, 62);
    const val: number[] = [];
    slots.forEach((s, k) => (val[k] = s.level === 0 ? 9 : val[(k - 1) >> 1] - (k % 2 === 1 ? 1 : 2)));
    const boxes = slots.map((s, k) => box(`d${k}`, s.x - 26, s.y - 13, `dp[${val[k]}]`, { w: 52, h: 26, size: 12, tone: V_TONE[val[k]] }));
    const scene = (levels: number, repeat: boolean) => {
      const nodes: SceneNode[] = [];
      slots.forEach((s, k) => {
        if (s.level >= levels) return;
        nodes.push(boxes[k]);
        if (k > 0) nodes.push(link(`e${k}`, boxes[(k - 1) >> 1], boxes[k], { pad: 2, tone: 'muted' }));
      });
      if (repeat) {
        slots.filter((s) => s.level === 3).forEach((s, k) => nodes.push(text(`dots${k}`, s.x, 252, '⋯', { anchor: 'middle', size: 14, tone: 'muted' })));
        const counts: [number, number][] = [
          [7, 2],
          [6, 3],
          [5, 4],
          [4, 3],
        ];
        nodes.push(...chipRow('cnt', 230, 268, counts.map(([v, c]) => ({ text: `dp[${v}] ×${c}`, tone: V_TONE[v] }))));
      }
      return { w: 460, h: 306, nodes };
    };
    const frames: SceneFrame[] = [0, 1, 2, 3].map((k) => ({ kind: 'level', scene: scene(k + 1, false), say: DFS_SAY[`l${k}` as 'l0'][l] }));
    frames.push({ kind: 'repeat', scene: scene(4, true), say: fmt(DFS_SAY.repeat[l], { n: sup('n') }) });
    return { frames };
  },
};

// ── Memoized recursion tree ───────────────────────────────────────────

const climbingStairsDfsMemoTree: StaticFigure = {
  type: 'static',
  build(l) {
    const at = (r: number) => ({ x: 340 - r * 66, y: 22 + r * 52 });
    const bw = 58;
    const node = (id: string, cx: number, cy: number, label: string, pruned = false) =>
      box(id, cx - bw / 2, cy - 14, label, { w: bw, h: 28, size: 13, tone: pruned ? 'ghost' : 'ok', dashed: pruned });
    // Ellipses stand for the elided middle of the chain; links still need a shape to attach to.
    const gap = (id: string, cx: number, cy: number) => box(id, cx - 12, cy - 8, '', { w: 24, h: 16 });
    const chain: BoxNode[] = [node('c9', at(0).x, at(0).y, 'dp[9]'), node('c8', at(1).x, at(1).y, 'dp[8]'), node('c7', at(2).x, at(2).y, 'dp[7]'), gap('cg', at(3).x, at(3).y), node('c3', at(4).x, at(4).y, 'dp[3]')];
    const pruned: BoxNode[] = [
      node('p7', at(1).x + 124, at(1).y, 'dp[7]', true),
      node('p6', at(2).x + 124, at(2).y, 'dp[6]', true),
      node('p5', at(3).x + 124, at(3).y, 'dp[5]', true),
      gap('pg', at(4).x + 124, at(4).y),
    ];
    const leaves = [node('c2', 40, 282, 'dp[2]'), node('c1', 120, 282, 'dp[1]')];
    const nodes: SceneNode[] = [];
    for (let r = 1; r < chain.length; r++) {
      nodes.push(link(`e${r}`, chain[r - 1], chain[r], { pad: 2, tone: 'ok' }));
      const p = link(`x${r}`, chain[r - 1], pruned[r - 1], { pad: 2, tone: 'muted', dashed: true });
      nodes.push(p);
      const mx = (p.from[0] + p.to[0]) / 2;
      const my = (p.from[1] + p.to[1]) / 2;
      nodes.push(text(`cut${r}`, mx + 6, my - 2, '✂', { anchor: 'middle', size: 14, tone: 'danger' }));
    }
    leaves.forEach((b, k) => nodes.push(link(`leaf${k}`, chain[4], b, { pad: 2, tone: 'ok' })));
    nodes.push(...chain.filter((b) => b.id !== 'cg'), ...pruned.filter((b) => b.id !== 'pg'), ...leaves);
    nodes.push(
      text('cg', at(3).x, at(3).y + 5, '⋯', { anchor: 'middle', size: 16, tone: 'muted' }),
      text('pg', at(4).x + 124, at(4).y + 5, '⋯', { anchor: 'middle', size: 16, tone: 'muted' }),
    );
    const legend: LegendItem[] = [
      { tone: 'ok', text: { en: 'computed once', zh: '只计算一次', 'zh-hant': '只計算一次', ja: '1 回だけ計算', ru: 'вычисляется один раз' }[l] },
      {
        tone: 'ghost',
        dashed: true,
        text: { en: 'pruned: found in mem, returned at once', zh: '剪枝：在 mem 中找到记录，直接返回', 'zh-hant': '剪枝：在 mem 中找到記錄，直接返回', ja: '枝刈り：mem に記録があればそのまま返す', ru: 'отсечение: решение есть в mem, сразу возвращаем' }[l],
      },
    ];
    return {
      scene: { w: W, h: 304, nodes },
      legend,
      notes: [
        {
          en: 'After memoization every overlapping subproblem is computed only once, so the time drops to O(n).',
          zh: '经过记忆化处理后，所有重叠子问题都只需计算一次，时间复杂度优化至 O(n)。',
          'zh-hant': '經過記憶化處理後，所有重疊子問題都只需計算一次，時間複雜度最佳化至 O(n)。',
          ja: 'メモ化により、すべての重複部分問題は 1 回だけ計算すればよくなり、時間計算量は O(n) になります。',
          ru: 'После мемоизации каждая перекрывающаяся подзадача вычисляется один раз, и время сокращается до O(n).',
        }[l],
      ],
    };
  },
};

// ── Bottom-up dp table for climbing stairs ────────────────────────────

const CS_SAY: Record<'init' | 'base' | 'step' | 'end', T> = {
  init: {
    en: 'Create the dp table dp[0..9] to store the solution of each subproblem.',
    zh: '初始化 dp 表 dp[0..9]，用于存储每个子问题的解。',
    'zh-hant': '初始化 dp 表 dp[0..9]，用於儲存每個子問題的解。',
    ja: '各部分問題の解を保存する dp テーブル dp[0..9] を用意します。',
    ru: 'Создаём таблицу dp[0..9] для решений подзадач.',
  },
  base: {
    en: 'Initial states: dp[1] = 1 and dp[2] = 2, the smallest subproblems.',
    zh: '初始状态：最小子问题 dp[1] = 1，dp[2] = 2。',
    'zh-hant': '初始狀態：最小子問題 dp[1] = 1，dp[2] = 2。',
    ja: '初期状態：最小の部分問題 dp[1] = 1、dp[2] = 2。',
    ru: 'Начальные состояния — наименьшие подзадачи: dp[1] = 1, dp[2] = 2.',
  },
  step: {
    en: 'dp[{i}] = dp[{a}] + dp[{b}] = {x} + {y} = {v}, built from two smaller solutions already in the table.',
    zh: 'dp[{i}] = dp[{a}] + dp[{b}] = {x} + {y} = {v}，由表中两个更小子问题的解得到。',
    'zh-hant': 'dp[{i}] = dp[{a}] + dp[{b}] = {x} + {y} = {v}，由表中兩個更小子問題的解得到。',
    ja: 'dp[{i}] = dp[{a}] + dp[{b}] = {x} + {y} = {v}。表にある 2 つの小さな解から求めます。',
    ru: 'dp[{i}] = dp[{a}] + dp[{b}] = {x} + {y} = {v} — из двух меньших решений, уже лежащих в таблице.',
  },
  end: {
    en: 'The target state is reached: there are dp[9] = 55 ways to climb 9 steps.',
    zh: '到达目标状态：爬到第 9 阶共有 dp[9] = 55 种方案。',
    'zh-hant': '到達目標狀態：爬到第 9 階共有 dp[9] = 55 種方案。',
    ja: '目標の状態に到達：9 段を上る方法は dp[9] = 55 通りです。',
    ru: 'Целевое состояние достигнуто: подняться на 9 ступеней можно dp[9] = 55 способами.',
  },
};

const climbingStairsDp: StepFigure = {
  type: 'steps',
  call: 'climbing_stairs_dp(9)',
  tones: { init: 'idle', base: 'swp', step: 'cmp', end: 'done' },
  sources: funcSources(CS_PY, CS_JAVA, ['climbing_stairs_dp'], {
    python: { init: ['dp = [0] * (n + 1)'], base: ['dp[1], dp[2] = 1, 2'], step: ['for i in range(3, n + 1):', 'dp[i] = dp[i - 1] + dp[i - 2]'], end: ['return dp[n]'] },
    java: { init: ['int[] dp = new int[n + 1];'], base: ['dp[1] = 1;', 'dp[2] = 2;'], step: ['for (int i = 3; i <= n; i++)', 'dp[i] = dp[i - 1] + dp[i - 2];'], end: ['return dp[n];'] },
  }),
  build(l) {
    const x = 16;
    const cw = 40;
    const gap = 6;
    const y = 72;
    const cx = (i: number) => x + (i - 1) * (cw + gap) + cw / 2;
    const scene = (filled: number, cur: number | null, eq: Rich | null) => {
      const nodes: SceneNode[] = [];
      for (let i = 1; i <= 9; i++) {
        const known = i <= filled;
        const tone: Tone = i === cur ? 'ok' : cur !== null && i === cur - 1 ? 'accent' : cur !== null && i === cur - 2 ? 'info' : known ? 'idle' : 'ghost';
        nodes.push(box(`dp${i}`, cx(i) - cw / 2, y, known ? CS_DP[i] : 0, { w: cw, h: 40, tone, dashed: !known, ring: i === cur }));
        nodes.push(text(`i${i}`, cx(i), y + 80, `dp[${i}]`, { anchor: 'middle', mono: true, size: 11, tone: i === cur ? 'ok' : 'muted' }));
      }
      if (cur !== null && cur >= 3) {
        nodes.push(arrow('a2', [cx(cur - 2), y - 3], [cx(cur) - 4, y - 3], { bend: -16, tone: 'info' }));
        nodes.push(arrow('a1', [cx(cur - 1), y + 43], [cx(cur) - 4, y + 43], { bend: 9, tone: 'accent' }));
      }
      if (eq) nodes.push(chip('eq', W / 2, 8, eq));
      return { w: W, h: 166, nodes };
    };
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(0, null, null), say: CS_SAY.init[l] },
      { kind: 'base', scene: scene(2, null, seg2(['dp[1] = ', null], ['1', 'ok'], [' , dp[2] = ', null], ['2', 'ok'])), say: CS_SAY.base[l] },
    ];
    for (let i = 3; i <= 9; i++) {
      const eq = seg2(['dp[', null], [String(i), 'ok'], ['] = ', null], [String(CS_DP[i - 1]), 'accent'], [' + ', null], [String(CS_DP[i - 2]), 'info'], [' = ', null], [String(CS_DP[i]), 'ok']);
      frames.push({ kind: 'step', scene: scene(i, i, eq), say: fmt(CS_SAY.step[l], { i, a: i - 1, b: i - 2, x: CS_DP[i - 1], y: CS_DP[i - 2], v: CS_DP[i] }) });
    }
    const last = scene(9, null, seg2(['return dp[9] = ', null], ['55', 'ok']));
    last.nodes = last.nodes.map((n) => (n.id === 'dp9' ? { ...n, tone: 'ok', ring: true } : n));
    frames.push({ kind: 'end', scene: last, say: CS_SAY.end[l] });
    return { frames };
  },
};

// ── Min cost climbing stairs ──────────────────────────────────────────

const minCostExample: StaticFigure = {
  type: 'static',
  build(l) {
    const cost = [0, 1, 10, 1];
    const costTone = (k: number): Tone | undefined => (k === 0 ? undefined : cost[k] > 5 ? 'danger' : 'ok');
    const x0 = 96;
    const sw = 80;
    const s = stairs(x0, 170, sw, 40, 3, { tread: costTone, label: (k) => (k === 3 ? 'ok' : undefined) });
    const best = 2;
    const nodes: SceneNode[] = [...s.nodes];
    WAYS.forEach((p, w) => {
      for (let k = 1; k < p.length; k++) nodes.push(hop(`w${w}:${k}`, s, p[k - 1], p[k], w === best ? 'ok' : 'muted', { dx: (w - 1) * 9, dashed: w !== best, width: w === best ? 2.5 : 1.5 }));
    });
    nodes.push(
      text('h:n', x0 - 14, 190, 'i', { anchor: 'end', mono: true, size: 13, tone: 'muted' }),
      text('h:cost', x0 - 14, 214, 'cost[i]', { anchor: 'end', mono: true, size: 13, tone: 'muted' }),
      ...cost.map((c, k) => text(`cost${k}`, x0 + k * sw + sw / 2, 214, String(c), { anchor: 'middle', mono: true, bold: k > 0, size: 13, tone: costTone(k) ?? 'muted' })),
    );
    const sums = WAYS.map((p) => p.slice(1).map((k) => cost[k]));
    nodes.push(
      ...chipRow(
        'c',
        W / 2,
        238,
        WAYS.map((p, w) => ({
          text: seg2([`${p.join('→')}: ${sums[w].join('+')} = `, null], [String(sums[w].reduce((a, b) => a + b, 0)), w === best ? 'ok' : null]),
          tone: w === best ? 'ok' : 'idle',
          ring: w === best,
          dim: w !== best,
        })),
        { size: 12, gap: 8 },
      ),
    );
    return {
      scene: { w: W, h: 276, nodes },
      notes: [
        {
          en: 'Of the 3 ways to step 3, 0 → 1 → 3 costs the least: 1 + 1 = 2.',
          zh: '爬到第 3 阶的 3 种方案中，0 → 1 → 3 的代价最小：1 + 1 = 2。',
          'zh-hant': '爬到第 3 階的 3 種方案中，0 → 1 → 3 的代價最小：1 + 1 = 2。',
          ja: '第 3 段までの 3 通りのうち、0 → 1 → 3 のコストが最小で 1 + 1 = 2 です。',
          ru: 'Из 3 способов подняться на 3-ю ступень дешевле всего 0 → 1 → 3: 1 + 1 = 2.',
        }[l],
      ],
    };
  },
};

const MC_COST = [0, 1, 10, 1, 1, 1, 10, 1, 1, 10, 1];
const MC_DP = (() => {
  const dp = [0, MC_COST[1], MC_COST[2]];
  for (let i = 3; i < MC_COST.length; i++) dp[i] = Math.min(dp[i - 1], dp[i - 2]) + MC_COST[i];
  return dp;
})();

const MC_SAY: Record<'init' | 'base' | 'step' | 'tie' | 'end', T> = {
  init: {
    en: 'cost[i] is the cost of step i. Create the dp table: dp[i] will hold the minimum cost to reach step i.',
    zh: 'cost[i] 是第 i 阶的代价。初始化 dp 表，dp[i] 表示爬到第 i 阶的最小代价。',
    'zh-hant': 'cost[i] 是第 i 階的代價。初始化 dp 表，dp[i] 表示爬到第 i 階的最小代價。',
    ja: 'cost[i] は第 i 段のコストです。dp テーブルを用意し、dp[i] に第 i 段までの最小コストを入れます。',
    ru: 'cost[i] — стоимость ступени i. Создаём таблицу dp: dp[i] — минимальная стоимость подъёма на ступень i.',
  },
  base: {
    en: 'Initial states: dp[1] = cost[1] = 1 and dp[2] = cost[2] = 10.',
    zh: '初始状态：dp[1] = cost[1] = 1，dp[2] = cost[2] = 10。',
    'zh-hant': '初始狀態：dp[1] = cost[1] = 1，dp[2] = cost[2] = 10。',
    ja: '初期状態：dp[1] = cost[1] = 1、dp[2] = cost[2] = 10。',
    ru: 'Начальные состояния: dp[1] = cost[1] = 1, dp[2] = cost[2] = 10.',
  },
  step: {
    en: 'Step {i} comes from step {a} or step {b}. The cheaper one is dp[{m}] = {x}; add cost[{i}] = {c} to get {v}.',
    zh: '第 {i} 阶来自第 {a} 阶或第 {b} 阶。较小的是 dp[{m}] = {x}，加上 cost[{i}] = {c}，得到 {v}。',
    'zh-hant': '第 {i} 階來自第 {a} 階或第 {b} 階。較小的是 dp[{m}] = {x}，加上 cost[{i}] = {c}，得到 {v}。',
    ja: '第 {i} 段へは第 {a} 段か第 {b} 段から来ます。小さいのは dp[{m}] = {x}。cost[{i}] = {c} を足して {v}。',
    ru: 'На ступень {i} попадаем со ступени {a} или {b}. Дешевле dp[{m}] = {x}; прибавляем cost[{i}] = {c} и получаем {v}.',
  },
  tie: {
    en: 'Step {i}: both dp[{a}] and dp[{b}] are {x}; add cost[{i}] = {c} to get {v}.',
    zh: '第 {i} 阶：dp[{a}] 和 dp[{b}] 都是 {x}，加上 cost[{i}] = {c}，得到 {v}。',
    'zh-hant': '第 {i} 階：dp[{a}] 和 dp[{b}] 都是 {x}，加上 cost[{i}] = {c}，得到 {v}。',
    ja: '第 {i} 段：dp[{a}] と dp[{b}] はどちらも {x}。cost[{i}] = {c} を足して {v}。',
    ru: 'Ступень {i}: dp[{a}] и dp[{b}] оба равны {x}; прибавляем cost[{i}] = {c} и получаем {v}.',
  },
  end: {
    en: 'The minimum cost to reach the top, step 10, is dp[10] = 6.',
    zh: '爬到顶部第 10 阶的最小代价为 dp[10] = 6。',
    'zh-hant': '爬到頂部第 10 階的最小代價為 dp[10] = 6。',
    ja: '頂上の第 10 段までの最小コストは dp[10] = 6 です。',
    ru: 'Минимальная стоимость подъёма на вершину, ступень 10, равна dp[10] = 6.',
  },
};

const minCostDp: StepFigure = {
  type: 'steps',
  call: 'min_cost_climbing_stairs_dp(cost)',
  tones: { init: 'idle', base: 'swp', step: 'cmp', end: 'done' },
  sources: funcSources(MC_PY, MC_JAVA, ['min_cost_climbing_stairs_dp'], {
    python: { init: ['dp = [0] * (n + 1)'], base: ['dp[1], dp[2] = cost[1], cost[2]'], step: ['for i in range(3, n + 1):', 'dp[i] = min(dp[i - 1], dp[i - 2]) + cost[i]'], end: ['return dp[n]'] },
    java: { init: ['int[] dp = new int[n + 1];'], base: ['dp[1] = cost[1];', 'dp[2] = cost[2];'], step: ['for (int i = 3; i <= n; i++)', 'dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i];'], end: ['return dp[n];'] },
  }),
  build(l) {
    const n = MC_COST.length - 1;
    const x = 56;
    const cw = 34;
    const gap = 4;
    const cx = (i: number) => x + (i - 1) * (cw + gap) + cw / 2;
    const yc = 30;
    const yd = 104;
    const scene = (filled: number, cur: number | null, eq: Rich | null) => {
      const a = cur !== null ? MC_DP[cur - 1] : 0;
      const b = cur !== null ? MC_DP[cur - 2] : 0;
      const nodes: SceneNode[] = [text('h:cost', x - 10, yc + 22, 'cost', { anchor: 'end', mono: true, size: 13, tone: 'muted' }), text('h:dp', x - 10, yd + 22, 'dp', { anchor: 'end', mono: true, size: 13, tone: 'muted' })];
      for (let i = 1; i <= n; i++) {
        nodes.push(text(`i${i}`, cx(i), yc - 8, String(i), { anchor: 'middle', mono: true, size: 11, tone: i === cur ? 'ok' : 'muted' }));
        const costText: Rich = MC_COST[i] > 5 && i !== cur ? [{ t: String(MC_COST[i]), tone: 'danger', bold: true }] : String(MC_COST[i]);
        nodes.push(box(`c${i}`, cx(i) - cw / 2, yc, costText, { w: cw, h: 34, size: 13, tone: i === cur ? 'warn' : 'idle' }));
        const known = i <= filled;
        let tone: Tone = known ? 'idle' : 'ghost';
        let dim = false;
        if (cur !== null && i === cur) tone = 'ok';
        if (cur !== null && (i === cur - 1 || i === cur - 2)) {
          tone = i === cur - 1 ? 'accent' : 'info';
          dim = a !== b && MC_DP[i] !== Math.min(a, b);
        }
        nodes.push(box(`d${i}`, cx(i) - cw / 2, yd, known ? MC_DP[i] : 0, { w: cw, h: 34, size: 13, tone, dashed: !known, dim, ring: i === cur }));
      }
      if (cur !== null && cur >= 3) {
        nodes.push(arrow('ac', [cx(cur), yc + 36], [cx(cur), yd - 2], { tone: 'warn' }));
        nodes.push(text('plus', cx(cur) + 8, (yc + yd + 34) / 2 + 4, '+', { mono: true, bold: true, size: 13, tone: 'warn' }));
        nodes.push(arrow('a2', [cx(cur - 2), yd + 37], [cx(cur) - 4, yd + 37], { bend: 13, tone: 'info', dim: a !== b && b > a }));
        nodes.push(arrow('a1', [cx(cur - 1), yd + 37], [cx(cur) - 3, yd + 37], { bend: 6, tone: 'accent', dim: a !== b && a > b }));
        nodes.push(text('min', cx(cur - 1), yd + 66, 'min', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }));
      }
      if (eq) nodes.push(chip('eq', W / 2, 186, eq));
      return { w: W, h: 222, nodes };
    };
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(0, null, null), say: MC_SAY.init[l] },
      { kind: 'base', scene: scene(2, null, seg2(['dp[1] = ', null], ['1', 'ok'], [' , dp[2] = ', null], ['10', 'ok'])), say: MC_SAY.base[l] },
    ];
    for (let i = 3; i <= n; i++) {
      const a = MC_DP[i - 1];
      const b = MC_DP[i - 2];
      const eq = seg2(['dp[', null], [String(i), 'ok'], ['] = min(', null], [String(a), 'accent'], [', ', null], [String(b), 'info'], [') + ', null], [String(MC_COST[i]), 'warn'], [' = ', null], [String(MC_DP[i]), 'ok']);
      const m = a <= b ? i - 1 : i - 2;
      const say = a === b ? fmt(MC_SAY.tie[l], { i, a: i - 1, b: i - 2, x: a, c: MC_COST[i], v: MC_DP[i] }) : fmt(MC_SAY.step[l], { i, a: i - 1, b: i - 2, m, x: Math.min(a, b), c: MC_COST[i], v: MC_DP[i] });
      frames.push({ kind: 'step', scene: scene(i, i, eq), say });
    }
    const last = scene(n, null, seg2(['return dp[10] = ', null], ['6', 'ok']));
    last.nodes = last.nodes.map((nd) => (nd.id === `d${n}` ? { ...nd, tone: 'ok', ring: true } : nd));
    frames.push({ kind: 'end', scene: last, say: MC_SAY.end[l] });
    return { frames };
  },
};

// ── Climbing stairs with a constraint ─────────────────────────────────

const constraintExample: StaticFigure = {
  type: 'static',
  build(l) {
    const s = stairs(50, 200, 84, 46, 3, { tread: (k) => (k === 3 ? 'ok' : undefined), label: (k) => (k === 3 ? 'ok' : undefined) });
    const nodes: SceneNode[] = [...s.nodes];
    // The discarded way first, so the valid ones draw on top.
    for (let k = 1; k < 4; k++) nodes.push(hop(`w0:${k}`, s, k - 1, k, 'muted', { dx: -10, dashed: true, width: 1.75 }));
    [1, 2].forEach((w) => {
      const p = WAYS[w];
      for (let k = 1; k < p.length; k++) nodes.push(hop(`w${w}:${k}`, s, p[k - 1], p[k], WAY_TONE[w], { dx: (w - 1) * 10 }));
    });
    // Mark the second 1-step move in a row, where the rule is broken.
    const [ax, ay] = hopApex(s, 1, 2, -10);
    nodes.push(text('x', ax, ay - 4, '✗', { anchor: 'middle', size: 18, bold: true, tone: 'danger' }));
    nodes.push(
      text(
        'why',
        12,
        24,
        { en: '1 step twice in a row: discarded', zh: '连续两轮跳 1 阶：舍弃', 'zh-hant': '連續兩輪跳 1 階：捨棄', ja: '2 回続けて 1 段：除外', ru: 'Два раза подряд по 1 ступени: отбрасываем' }[l],
        { size: 13, tone: 'danger' },
      ),
    );
    nodes.push(
      ...chipRow('c', W / 2, 244, [
        { text: arrowPath(WAYS[1]), tone: WAY_TONE[1] },
        { text: arrowPath(WAYS[2]), tone: WAY_TONE[2] },
        { text: seg2([arrowPath(WAYS[0]), null], [' ✗', 'danger']), tone: 'ghost', dashed: true },
      ]),
    );
    return {
      scene: { w: W, h: 282, nodes },
      notes: [
        {
          en: 'If 1 step may not be taken twice in a row, only 2 ways reach step 3: 0 → 2 → 3 and 0 → 1 → 3.',
          zh: '如果不能连续两轮跳 1 阶，爬到第 3 阶只剩 2 种方案：0 → 2 → 3 和 0 → 1 → 3。',
          'zh-hant': '如果不能連續兩輪跳 1 階，爬到第 3 階只剩 2 種方案：0 → 2 → 3 和 0 → 1 → 3。',
          ja: '2 回続けて 1 段上ることができない場合、第 3 段までの方法は 0 → 2 → 3 と 0 → 1 → 3 の 2 通りだけです。',
          ru: 'Если нельзя дважды подряд подниматься на 1 ступень, на 3-ю ступень ведут только 2 способа: 0 → 2 → 3 и 0 → 1 → 3.',
        }[l],
      ],
    };
  },
};

const constraintStateTransfer: StaticFigure = {
  type: 'static',
  build(l) {
    const cols = [104, 232, 360];
    const rows = [56, 148];
    const cw = 96;
    const ch = 34;
    const label = (c: number, j: number) => `dp[${['i-2', 'i-1', 'i'][c]}, ${j}]`;
    const tones: Tone[][] = [
      ['accent', 'ghost', 'info'],
      ['accent', 'info', 'accent'],
    ];
    const cells = rows.map((y, r) => cols.map((x, c) => box(`s${c}${r}`, x - cw / 2, y, label(c, r + 1), { w: cw, h: ch, size: 12, tone: tones[r][c], dashed: tones[r][c] === 'ghost', ring: c === 2 })));
    const nodes: SceneNode[] = [
      ...cols.map((x, c) => text(`col${c}`, x, 36, ['i − 2', 'i − 1', 'i'][c], { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' })),
      ...rows.map((y, r) => text(`row${r}`, 50, y + 22, `j = ${r + 1}`, { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' })),
      ...cells.flat(),
      link('t1', cells[1][1], cells[0][2], { tone: 'info', width: 2 }),
      link('bad', cells[0][1], cells[0][2], { tone: 'danger', dashed: true }),
      text('badx', (cols[1] + cols[2]) / 2, rows[0] + 10, '✗', { anchor: 'middle', size: 15, bold: true, tone: 'danger' }),
      link('t2a', cells[0][0], cells[1][2], { tone: 'accent', width: 2 }),
      arrow('t2b', [cols[0], rows[1] + ch + 2], [cols[2] - 6, rows[1] + ch + 3], { bend: 18, tone: 'accent', width: 2 }),
      text(
        'eq1',
        W / 2,
        250,
        seg2(['dp[i, 1]', 'info'], [' = ', null], ['dp[i-1, 2]', 'info']),
        { anchor: 'middle', mono: true, size: 13 },
      ),
      text(
        'eq2',
        W / 2,
        276,
        seg2(['dp[i, 2]', 'accent'], [' = ', null], ['dp[i-2, 1]', 'accent'], [' + ', null], ['dp[i-2, 2]', 'accent']),
        { anchor: 'middle', mono: true, size: 13 },
      ),
    ];
    const legend: LegendItem[] = [
      { tone: 'info', shape: 'line', text: { en: 'last move: 1 step', zh: '上一轮跳 1 阶', 'zh-hant': '上一輪跳 1 階', ja: '直前に 1 段上った', ru: 'последний шаг: 1 ступень' }[l] },
      { tone: 'accent', shape: 'line', text: { en: 'last move: 2 steps', zh: '上一轮跳 2 阶', 'zh-hant': '上一輪跳 2 階', ja: '直前に 2 段上った', ru: 'последний шаг: 2 ступени' }[l] },
      { tone: 'danger', shape: 'line', dashed: true, text: { en: '1 step twice in a row: not allowed', zh: '连续两轮跳 1 阶：不允许', 'zh-hant': '連續兩輪跳 1 階：不允許', ja: '2 回続けて 1 段：不可', ru: 'дважды подряд по 1 ступени: нельзя' }[l] },
    ];
    return {
      scene: { w: W, h: 290, nodes },
      legend,
      notes: [
        {
          en: 'State [i, j]: standing on step i after a last move of j steps. dp[i, 1] can only follow a 2-step move; dp[i, 2] can follow either.',
          zh: '状态 [i, j] 表示处在第 i 阶并且上一轮跳了 j 阶。dp[i, 1] 只能从上一轮跳 2 阶的状态转移而来，dp[i, 2] 则两种都可以。',
          'zh-hant': '狀態 [i, j] 表示處在第 i 階並且上一輪跳了 j 階。dp[i, 1] 只能從上一輪跳 2 階的狀態轉移而來，dp[i, 2] 則兩種都可以。',
          ja: '状態 [i, j] は、直前に j 段上って第 i 段にいることを表します。dp[i, 1] は 2 段上った状態からしか遷移できず、dp[i, 2] はどちらからでも遷移できます。',
          ru: 'Состояние [i, j]: мы на ступени i, а последний шаг был на j ступеней. dp[i, 1] может следовать только за шагом на 2 ступени, а dp[i, 2] — за любым.',
        }[l],
      ],
    };
  },
};

// ── Minimum path sum ──────────────────────────────────────────────────

const GRID = [
  [1, 3, 1, 5],
  [2, 2, 4, 2],
  [5, 3, 2, 1],
  [4, 3, 5, 2],
];
const MP_DP = (() => {
  const dp = GRID.map((r) => r.map(() => 0));
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      const up = i > 0 ? dp[i - 1][j] : Infinity;
      const left = j > 0 ? dp[i][j - 1] : Infinity;
      dp[i][j] = GRID[i][j] + (i === 0 && j === 0 ? 0 : Math.min(up, left));
    }
  return dp;
})();
/** The cells of the cheapest path, found by walking back from the end to the smaller neighbor. */
const MP_PATH = (() => {
  const out = new Set<string>();
  let i = 3;
  let j = 3;
  out.add('3-3');
  while (i > 0 || j > 0) {
    if (i === 0) j--;
    else if (j === 0) i--;
    else if (MP_DP[i - 1][j] < MP_DP[i][j - 1]) i--;
    else j--;
    out.add(`${i}-${j}`);
  }
  return out;
})();

const MC = 40;
const MG = 3;
const cellAt = (x: number, y: number, r: number, c: number) => ({ x: x + c * (MC + MG), y: y + r * (MC + MG), w: MC, h: MC });

/** A 4 × 4 table of cells; `cell` decides each cell's text and look. */
function table(prefix: string, x: number, y: number, cell: (r: number, c: number) => { text: Rich | number; tone?: Tone; dashed?: boolean; ring?: boolean; dim?: boolean; size?: number }) {
  const out: BoxNode[] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const v = cell(r, c);
      const at = cellAt(x, y, r, c);
      out.push(box(`${prefix}${r}-${c}`, at.x, at.y, v.text, { w: MC, h: MC, size: v.size ?? 15, tone: v.tone ?? 'idle', dashed: v.dashed, ring: v.ring, dim: v.dim }));
    }
  return out;
}

/**
 * Arrows into cell (r, c) from its left or upper neighbor, drawn as glyphs across the shared
 * border: text sits above the cells, while arrow nodes would be hidden under their fill.
 */
function fromLeft(id: string, x: number, y: number, r: number, c: number, tone: Tone): SceneNode[] {
  const b = cellAt(x, y, r, c);
  return [text(id, b.x - MG / 2, b.y + MC - 5, '→', { anchor: 'middle', size: 20, bold: true, tone })];
}
function fromAbove(id: string, x: number, y: number, r: number, c: number, tone: Tone): SceneNode[] {
  const b = cellAt(x, y, r, c);
  return [text(id, b.x + MC - 9, b.y + 8, '↓', { anchor: 'middle', size: 20, bold: true, tone })];
}

const WORD: Record<'start' | 'end', T> = {
  start: { en: 'start', zh: '起点', 'zh-hant': '起點', ja: '始点', ru: 'старт' },
  end: { en: 'end', zh: '终点', 'zh-hant': '終點', ja: '終点', ru: 'финиш' },
};

const minPathSumExample: StaticFigure = {
  type: 'static',
  build(l) {
    const lx = 22;
    const rx = 250;
    const y = 44;
    const left = table('g', lx, y, (r, c) => ({ text: GRID[r][c], tone: (r === 0 && c === 0) || (r === 3 && c === 3) ? 'soft' : 'idle' }));
    const right = table('p', rx, y, (r, c) => ({ text: GRID[r][c], tone: MP_PATH.has(`${r}-${c}`) ? 'ok' : 'idle', dim: !MP_PATH.has(`${r}-${c}`) }));
    const s = cellAt(lx, y, 0, 0);
    const e = cellAt(lx, y, 3, 3);
    const pathVals = [...MP_PATH].map((k) => k.split('-').map(Number)).sort((a, b) => a[0] + a[1] - (b[0] + b[1])).map(([r, c]) => GRID[r][c]);
    const nodes: SceneNode[] = [
      ...left,
      ...right,
      text('start', s.x + MC / 2, 22, WORD.start[l], { anchor: 'middle', bold: true, size: 13 }),
      arrow('start:a', [s.x + MC / 2, 27], [s.x + MC / 2, y - 3], { tone: 'muted', width: 1.25 }),
      arrow('end:a', [e.x + MC / 2, e.y + MC + 18], [e.x + MC / 2, e.y + MC + 3], { tone: 'muted', width: 1.25 }),
      text('end', e.x + MC / 2, e.y + MC + 34, WORD.end[l], { anchor: 'middle', bold: true, size: 13 }),
      arrow('to', [lx + 4 * MC + 3 * MG + 12, y + 86], [rx - 12, y + 86], { tone: 'muted', width: 3 }),
      chip('sum', W / 2, 254, seg2([`${pathVals.join(' + ')} = `, null], ['13', 'ok'])),
    ];
    return {
      scene: { w: W, h: 290, nodes },
      notes: [
        {
          en: 'Moving only down or right, the minimum path sum from the top-left to the bottom-right cell is 13.',
          zh: '每次只能向下或向右移动，从左上角到右下角的最小路径和为 13。',
          'zh-hant': '每次只能向下或向右移動，從左上角到右下角的最小路徑和為 13。',
          ja: '下か右にだけ進むとき、左上から右下までの最小経路和は 13 です。',
          ru: 'Если двигаться только вниз или вправо, минимальная сумма пути от левой верхней клетки до правой нижней равна 13.',
        }[l],
      ],
    };
  },
};

const DEF_LINES: Record<'decision' | 'state' | 'sub' | 'table', [T, T]> = {
  decision: [
    { en: 'Decision', zh: '决策', 'zh-hant': '決策', ja: '決定', ru: 'Решение' },
    { en: 'move one cell right or down', zh: '向右或向下移动一格', 'zh-hant': '向右或向下移動一格', ja: '右か下に 1 マス進む', ru: 'сдвиг на клетку вправо или вниз' },
  ],
  state: [
    { en: 'State', zh: '状态', 'zh-hant': '狀態', ja: '状態', ru: 'Состояние' },
    { en: 'row and column index [i, j]', zh: '行列索引 [i, j]', 'zh-hant': '行列索引 [i, j]', ja: '行と列のインデックス [i, j]', ru: 'индексы строки и столбца [i, j]' },
  ],
  sub: [
    { en: 'Subproblem', zh: '子问题', 'zh-hant': '子問題', ja: '部分問題', ru: 'Подзадача' },
    { en: 'min path sum from [0, 0] to [i, j]', zh: '从 [0, 0] 到 [i, j] 的最小路径和', 'zh-hant': '從 [0, 0] 到 [i, j] 的最小路徑和', ja: '[0, 0] から [i, j] までの最小経路和', ru: 'мин. сумма пути из [0, 0] в [i, j]' },
  ],
  table: [
    { en: 'dp table', zh: 'dp 表', 'zh-hant': 'dp 表', ja: 'dp テーブル', ru: 'Таблица dp' },
    { en: 'a matrix the same size as grid', zh: '与 grid 尺寸相同的矩阵', 'zh-hant': '與 grid 尺寸相同的矩陣', ja: 'grid と同じサイズの行列', ru: 'матрица того же размера, что и grid' },
  ],
};

const coord = (r: number, c: number) => `${r},${c}`;

const minPathSumStateDefinition: StaticFigure = {
  type: 'static',
  build(l) {
    const gx = 44;
    const dx = 254;
    const y = 36;
    const g = table('g', gx, y, (r, c) => ({ text: GRID[r][c], tone: r === 1 && c === 1 ? 'ok' : r === 1 && c === 2 ? 'accent' : r === 2 && c === 1 ? 'info' : 'idle' }));
    const d = table('d', dx, y, (r, c) => ({ text: coord(r, c), size: 12, tone: r === 1 && c === 1 ? 'ok' : 'ghost', ring: r === 1 && c === 1 }));
    const ty = y + 4 * MC + 3 * MG;
    const nodes: SceneNode[] = [
      ...g,
      ...d,
      ...fromLeft('mr', gx, y, 1, 2, 'accent'),
      ...fromAbove('md', gx, y, 2, 1, 'info'),
      text('j', cellAt(gx, y, 0, 1).x + MC / 2, y - 10, 'j', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('j1', cellAt(gx, y, 0, 2).x + MC / 2, y - 10, 'j+1', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('i', gx - 8, cellAt(gx, y, 1, 0).y + 25, 'i', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('i1', gx - 8, cellAt(gx, y, 2, 0).y + 25, 'i+1', { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('cap:g', gx + 85, ty + 22, 'grid', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('cap:d', dx + 85, ty + 22, 'dp', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
    ];
    (['decision', 'state', 'sub', 'table'] as const).forEach((k, n) => {
      const [head, body] = DEF_LINES[k];
      nodes.push(text(`line${n}`, 20, ty + 56 + n * 24, seg2([`${head[l]}: `, null, true], [body[l], null]), { size: 13 }));
    });
    return { scene: { w: W, h: ty + 56 + 3 * 24 + 14, nodes } };
  },
};

const EQ_MP: Rich = seg2(['dp[i, j]', 'ok'], [' = min(', null], ['dp[i-1, j]', 'info'], [', ', null], ['dp[i, j-1]', 'accent'], [') + ', null], ['grid[i, j]', 'ok']);

const minPathSumStateTransition: StaticFigure = {
  type: 'static',
  build(l) {
    const gx = 30;
    const dx = 240;
    const y = 16;
    const tone = (r: number, c: number): Tone | undefined => (r === 2 && c === 2 ? 'ok' : r === 1 && c === 2 ? 'info' : r === 2 && c === 1 ? 'accent' : undefined);
    const g = table('g', gx, y, (r, c) => ({ text: GRID[r][c], tone: tone(r, c) ?? 'idle' }));
    const d = table('d', dx, y, (r, c) => ({ text: coord(r, c), size: 12, tone: tone(r, c) ?? 'ghost', ring: r === 2 && c === 2 }));
    const ty = y + 4 * MC + 3 * MG;
    const nodes: SceneNode[] = [
      ...g,
      ...d,
      ...fromLeft('gl', gx, y, 2, 2, 'accent'),
      ...fromAbove('gu', gx, y, 2, 2, 'info'),
      ...fromLeft('dl', dx, y, 2, 2, 'accent'),
      ...fromAbove('du', dx, y, 2, 2, 'info'),
      text('cap:g', gx + 85, ty + 22, 'grid', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('cap:d', dx + 85, ty + 22, 'dp', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      text('eq', W / 2, ty + 58, EQ_MP, { anchor: 'middle', mono: true, size: 13 }),
    ];
    return {
      scene: { w: W, h: ty + 72, nodes },
      notes: [
        {
          en: 'Cell [i, j] can only be entered from the cell above or the cell to its left, so its minimum path sum is the smaller of those two plus its own cost.',
          zh: '状态 [i, j] 只能从上边的格子或左边的格子转移而来，因此其最小路径和由这两者中较小的一个加上本格代价得到。',
          'zh-hant': '狀態 [i, j] 只能從上邊的格子或左邊的格子轉移而來，因此其最小路徑和由這兩者中較小的一個加上本格代價得到。',
          ja: '[i, j] には上のセルか左のセルからしか入れないので、その最小経路和は 2 つのうち小さい方に自身のコストを足したものです。',
          ru: 'В клетку [i, j] можно попасть только сверху или слева, поэтому её минимальная сумма пути — меньшая из двух плюс стоимость самой клетки.',
        }[l],
      ],
    };
  },
};

const minPathSumInitialState: StaticFigure = {
  type: 'static',
  build(l) {
    const lx = 26;
    const rx = 250;
    const y = 30;
    const left = table('b', lx, y, (r, c) =>
      r === 0 && c === 0 ? { text: MP_DP[0][0], tone: 'ok' } : r === 0 ? { text: MP_DP[r][c], tone: 'accent' } : c === 0 ? { text: MP_DP[r][c], tone: 'info' } : { text: '', tone: 'ghost', dashed: true },
    );
    let order = 0;
    const right = table('o', rx, y, (r, c) => (r === 0 || c === 0 ? { text: MP_DP[r][c], tone: 'idle', dim: true } : { text: String(++order), tone: 'soft', size: 13 }));
    const nodes: SceneNode[] = [...left, ...right];
    for (let c = 1; c < 4; c++) {
      const a = cellAt(lx, y, 0, c - 1);
      const b = cellAt(lx, y, 0, c);
      nodes.push(arrow(`rowa${c}`, [a.x + MC / 2, a.y - 3], [b.x + MC / 2 - 3, b.y - 3], { bend: -9, tone: 'accent' }));
    }
    for (let r = 1; r < 4; r++) {
      const a = cellAt(lx, y, r - 1, 0);
      const b = cellAt(lx, y, r, 0);
      nodes.push(arrow(`cola${r}`, [a.x - 3, a.y + MC / 2], [b.x - 3, b.y + MC / 2 - 3], { bend: 9, tone: 'info' }));
    }
    const ty = y + 4 * MC + 3 * MG;
    nodes.push(
      text('cap:l', lx + 85, ty + 26, { en: 'Boundary conditions', zh: '边界条件', 'zh-hant': '邊界條件', ja: '境界条件', ru: 'Граничные условия' }[l], { anchor: 'middle', bold: true, size: 13 }),
      text('cap:r', rx + 85, ty + 26, { en: 'Transition order', zh: '状态转移顺序', 'zh-hant': '狀態轉移順序', ja: '状態遷移の順序', ru: 'Порядок переходов' }[l], { anchor: 'middle', bold: true, size: 13 }),
    );
    return {
      scene: { w: W, h: ty + 40, nodes },
      notes: [
        {
          en: 'The first row can only be reached from the left and the first column only from above, so they are initialized first. The rest is filled row by row, each row left to right.',
          zh: '首行只能从左边转移而来，首列只能从上边转移而来，因此先初始化首行和首列。其余格子按行从上到下、每行从左到右填写。',
          'zh-hant': '首行只能從左邊轉移而來，首列只能從上邊轉移而來，因此先初始化首行和首列。其餘格子按行從上到下、每行從左到右填寫。',
          ja: '先頭行は左から、先頭列は上からしか到達できないので、まずこれらを初期化します。残りは上の行から順に、各行を左から右へ埋めます。',
          ru: 'В первую строку можно попасть только слева, а в первый столбец — только сверху, поэтому их заполняют первыми. Остальное заполняется по строкам сверху вниз, каждая строка слева направо.',
        }[l],
      ],
    };
  },
};

// ── Recursion trees for min path sum ──────────────────────────────────

interface MpNode {
  i: number;
  j: number;
  parent: number;
  kind: 'call' | 'base' | 'oob' | 'memo';
  /** Reached through dp[i − 1, j] (up) or dp[i, j − 1] (left). */
  via: 'up' | 'left' | null;
}

function mpTree(mem: boolean): MpNode[] {
  const out: MpNode[] = [];
  const seen = new Set<string>();
  const walk = (i: number, j: number, parent: number, via: MpNode['via']) => {
    const k = out.length;
    if (i < 0 || j < 0) return void out.push({ i, j, parent, kind: 'oob', via });
    if (i === 0 && j === 0) return void out.push({ i, j, parent, kind: 'base', via });
    if (mem && seen.has(`${i},${j}`)) return void out.push({ i, j, parent, kind: 'memo', via });
    out.push({ i, j, parent, kind: 'call', via });
    walk(i - 1, j, k, 'up');
    walk(i, j - 1, k, 'left');
    seen.add(`${i},${j}`);
  };
  walk(2, 1, -1, null);
  return out;
}

function mpTreeFigure(mem: boolean): StaticFigure {
  return {
    type: 'static',
    build(l) {
      const tree = mpTree(mem);
      const slots = treeSlots(
        tree.map((t) => t.parent),
        0,
        460,
        22,
        64,
      );
      const counts = new Map<string, number>();
      tree.forEach((t) => t.kind === 'call' && counts.set(`${t.i},${t.j}`, (counts.get(`${t.i},${t.j}`) ?? 0) + 1));
      const boxes = tree.map((t, k) => {
        const repeat = (counts.get(`${t.i},${t.j}`) ?? 0) > 1;
        const tone: Tone = t.kind === 'oob' ? 'ghost' : t.kind === 'memo' ? 'warn' : t.kind === 'base' ? 'ok' : repeat ? 'warn' : 'idle';
        return box(`n${k}`, slots[k].x - 30, slots[k].y - 13, `dp[${t.i},${t.j}]`, { w: 60, h: 26, size: 11, tone, dashed: t.kind === 'oob' || t.kind === 'memo', ring: k === 0 });
      });
      const nodes: SceneNode[] = [];
      tree.forEach((t, k) => {
        if (t.parent < 0) return;
        const pruned = t.kind === 'oob' || t.kind === 'memo';
        const e = link(`e${k}`, boxes[t.parent], boxes[k], { pad: 2, tone: t.via === 'up' ? 'info' : 'accent', dashed: pruned, width: 1.75 });
        nodes.push(e);
        if (pruned) {
          const mx = (e.from[0] + e.to[0]) / 2;
          const my = (e.from[1] + e.to[1]) / 2;
          nodes.push(text(`cut${k}`, mx + (t.via === 'up' ? -9 : 9), my + 4, '✂', { anchor: 'middle', size: 14, tone: t.kind === 'memo' ? 'warn' : 'danger' }));
        }
      });
      nodes.push(...boxes);
      // Label the two kinds of edges once, at the root.
      const root = boxes[0];
      nodes.push(
        text('lab:up', root.x - 30, root.y + 22, 'i − 1', { anchor: 'end', mono: true, bold: true, size: 12, tone: 'info' }),
        text('lab:left', root.x + root.w + 30, root.y + 22, 'j − 1', { mono: true, bold: true, size: 12, tone: 'accent' }),
      );
      const legend: LegendItem[] = [
        { tone: 'info', shape: 'line', text: { en: 'from the cell above [i − 1, j]', zh: '来自上边 [i − 1, j]', 'zh-hant': '來自上邊 [i − 1, j]', ja: '上のセル [i − 1, j] から', ru: 'из клетки сверху [i − 1, j]' }[l] },
        { tone: 'accent', shape: 'line', text: { en: 'from the cell on the left [i, j − 1]', zh: '来自左边 [i, j − 1]', 'zh-hant': '來自左邊 [i, j − 1]', ja: '左のセル [i, j − 1] から', ru: 'из клетки слева [i, j − 1]' }[l] },
        { tone: 'ok', text: { en: 'start cell: return grid[0][0]', zh: '起点：返回 grid[0][0]', 'zh-hant': '起點：返回 grid[0][0]', ja: '始点：grid[0][0] を返す', ru: 'старт: вернуть grid[0][0]' }[l] },
        { tone: 'ghost', dashed: true, text: { en: 'pruning: index out of bounds, +∞', zh: '剪枝：索引越界，返回 +∞', 'zh-hant': '剪枝：索引越界，返回 +∞', ja: '枝刈り：インデックスが範囲外、+∞', ru: 'отсечение: индекс вне границ, +∞' }[l] },
        mem
          ? { tone: 'warn', dashed: true, text: { en: 'pruning: found in mem', zh: '剪枝：已有记录', 'zh-hant': '剪枝：已有記錄', ja: '枝刈り：記録済み', ru: 'отсечение: решение уже в mem' }[l] }
          : { tone: 'warn', text: { en: 'overlapping subproblem', zh: '重叠子问题', 'zh-hant': '重疊子問題', ja: '重複部分問題', ru: 'перекрывающаяся подзадача' }[l] },
      ];
      const note: T = mem
        ? {
            en: 'With mem, dp[1,0] is computed once; the second call finds the record and returns it. Every state is computed once, so the time is O(nm).',
            zh: '引入 mem 后，dp[1,0] 只计算一次，第二次调用直接返回记录。每个状态只计算一次，时间复杂度为 O(nm)。',
            'zh-hant': '引入 mem 後，dp[1,0] 只計算一次，第二次呼叫直接返回記錄。每個狀態只計算一次，時間複雜度為 O(nm)。',
            ja: 'mem を使うと dp[1,0] は 1 回だけ計算され、2 回目の呼び出しは記録をそのまま返します。各状態は 1 回だけ計算されるので、時間計算量は O(nm) です。',
            ru: 'С mem dp[1,0] вычисляется один раз, а второй вызов просто возвращает запись. Каждое состояние считается один раз, поэтому время — O(nm).',
          }
        : {
            en: 'Two paths reach cell [1, 0], so dp[1,0] and everything below it are computed twice. Such overlapping subproblems multiply quickly as the grid grows.',
            zh: '有两条路径可以到达 [1, 0]，所以 dp[1,0] 及其下方的子问题都被计算了两次。网格越大，这类重叠子问题增长得越快。',
            'zh-hant': '有兩條路徑可以到達 [1, 0]，所以 dp[1,0] 及其下方的子問題都被計算了兩次。網格越大，這類重疊子問題增長得越快。',
            ja: '[1, 0] へは 2 通りの経路があるので、dp[1,0] とその下の部分問題は 2 回計算されます。グリッドが大きくなるほど、こうした重複部分問題は急増します。',
            ru: 'В клетку [1, 0] ведут два пути, поэтому dp[1,0] и всё под ним считается дважды. С ростом сетки таких перекрывающихся подзадач становится всё больше.',
          };
      return { scene: { w: 460, h: 22 + 3 * 64 + 22, nodes }, legend, notes: [note[l]] };
    },
  };
}

// ── Filling the dp table for min path sum ─────────────────────────────

const MP_SAY: Record<'init' | 'start' | 'row' | 'col' | 'cell' | 'tie' | 'end', T> = {
  init: {
    en: 'Create a dp table the same size as grid.',
    zh: '初始化与 grid 尺寸相同的 dp 表。',
    'zh-hant': '初始化與 grid 尺寸相同的 dp 表。',
    ja: 'grid と同じサイズの dp テーブルを用意します。',
    ru: 'Создаём таблицу dp того же размера, что и grid.',
  },
  start: {
    en: 'The start cell: dp[0][0] = grid[0][0] = 1.',
    zh: '起点：dp[0][0] = grid[0][0] = 1。',
    'zh-hant': '起點：dp[0][0] = grid[0][0] = 1。',
    ja: '始点：dp[0][0] = grid[0][0] = 1。',
    ru: 'Стартовая клетка: dp[0][0] = grid[0][0] = 1.',
  },
  row: {
    en: 'First row: only reachable from the left. dp[0][{j}] = {a} + {g} = {v}.',
    zh: '首行：只能从左边到达。dp[0][{j}] = {a} + {g} = {v}。',
    'zh-hant': '首行：只能從左邊到達。dp[0][{j}] = {a} + {g} = {v}。',
    ja: '先頭行：左からしか来られません。dp[0][{j}] = {a} + {g} = {v}。',
    ru: 'Первая строка: попасть можно только слева. dp[0][{j}] = {a} + {g} = {v}.',
  },
  col: {
    en: 'First column: only reachable from above. dp[{i}][0] = {a} + {g} = {v}.',
    zh: '首列：只能从上边到达。dp[{i}][0] = {a} + {g} = {v}。',
    'zh-hant': '首列：只能從上邊到達。dp[{i}][0] = {a} + {g} = {v}。',
    ja: '先頭列：上からしか来られません。dp[{i}][0] = {a} + {g} = {v}。',
    ru: 'Первый столбец: попасть можно только сверху. dp[{i}][0] = {a} + {g} = {v}.',
  },
  cell: {
    en: 'dp[{i}][{j}]: from the left {l} or from above {u}. Take the smaller, {m}, and add grid[{i}][{j}] = {g}.',
    zh: 'dp[{i}][{j}]：左边是 {l}，上边是 {u}。取较小的 {m}，加上 grid[{i}][{j}] = {g}。',
    'zh-hant': 'dp[{i}][{j}]：左邊是 {l}，上邊是 {u}。取較小的 {m}，加上 grid[{i}][{j}] = {g}。',
    ja: 'dp[{i}][{j}]：左は {l}、上は {u}。小さい方の {m} に grid[{i}][{j}] = {g} を足します。',
    ru: 'dp[{i}][{j}]: слева {l}, сверху {u}. Берём меньшее, {m}, и прибавляем grid[{i}][{j}] = {g}.',
  },
  tie: {
    en: 'dp[{i}][{j}]: left and above are both {m}. Add grid[{i}][{j}] = {g}.',
    zh: 'dp[{i}][{j}]：左边和上边都是 {m}，加上 grid[{i}][{j}] = {g}。',
    'zh-hant': 'dp[{i}][{j}]：左邊和上邊都是 {m}，加上 grid[{i}][{j}] = {g}。',
    ja: 'dp[{i}][{j}]：左も上も {m}。grid[{i}][{j}] = {g} を足します。',
    ru: 'dp[{i}][{j}]: слева и сверху одинаково, {m}. Прибавляем grid[{i}][{j}] = {g}.',
  },
  end: {
    en: 'Return dp[3][3] = 13. Walking back through the smaller neighbors traces the cheapest path.',
    zh: '返回 dp[3][3] = 13。沿着较小的相邻格子回溯，就能找到最小路径。',
    'zh-hant': '返回 dp[3][3] = 13。沿著較小的相鄰格子回溯，就能找到最小路徑。',
    ja: 'dp[3][3] = 13 を返します。小さい方の隣をたどって戻ると、最小の経路が分かります。',
    ru: 'Возвращаем dp[3][3] = 13. Если идти назад через меньших соседей, получится самый дешёвый путь.',
  },
};

const minPathSumDp: StepFigure = {
  type: 'steps',
  call: 'min_path_sum_dp(grid)',
  tones: { init: 'idle', start: 'swp', row: 'swp', col: 'swp', cell: 'cmp', end: 'done' },
  sources: funcSources(MP_PY, MP_JAVA, ['min_path_sum_dp'], {
    python: {
      init: ['dp = [[0] * m for _ in range(n)]'],
      start: ['dp[0][0] = grid[0][0]'],
      row: ['for j in range(1, m):', 'dp[0][j] = dp[0][j - 1] + grid[0][j]'],
      col: ['for i in range(1, n):', 'dp[i][0] = dp[i - 1][0] + grid[i][0]'],
      cell: ['dp[i][j] = min(dp[i][j - 1], dp[i - 1][j]) + grid[i][j]'],
      end: ['return dp[n - 1][m - 1]'],
    },
    java: {
      init: ['int[][] dp = new int[n][m];'],
      start: ['dp[0][0] = grid[0][0];'],
      row: ['for (int j = 1; j < m; j++)', 'dp[0][j] = dp[0][j - 1] + grid[0][j];'],
      col: ['for (int i = 1; i < n; i++)', 'dp[i][0] = dp[i - 1][0] + grid[i][0];'],
      cell: ['dp[i][j] = Math.min(dp[i][j - 1], dp[i - 1][j]) + grid[i][j];'],
      end: ['return dp[n - 1][m - 1];'],
    },
  }),
  build(l) {
    const gx = 26;
    const dx = 246;
    const y = 14;
    const order: [number, number][] = [[0, 0]];
    for (let j = 1; j < 4; j++) order.push([0, j]);
    for (let i = 1; i < 4; i++) order.push([i, 0]);
    for (let i = 1; i < 4; i++) for (let j = 1; j < 4; j++) order.push([i, j]);
    const ty = y + 4 * MC + 3 * MG;
    /** `done` cells are filled; the last of them is the current one unless `final`. */
    const scene = (done: number, eq: Rich | null, final = false) => {
      const filled = new Set(order.slice(0, done).map(([i, j]) => `${i}-${j}`));
      const cur = !final && done > 0 ? order[done - 1] : null;
      const isCur = (r: number, c: number) => cur !== null && cur[0] === r && cur[1] === c;
      const up = cur && cur[0] > 0 ? MP_DP[cur[0] - 1][cur[1]] : Infinity;
      const left = cur && cur[1] > 0 ? MP_DP[cur[0]][cur[1] - 1] : Infinity;
      const onPath = (r: number, c: number) => final && MP_PATH.has(`${r}-${c}`);
      const g = table('g', gx, y, (r, c) => ({ text: GRID[r][c], tone: isCur(r, c) || onPath(r, c) ? 'ok' : 'idle', ring: isCur(r, c) }));
      const d = table('d', dx, y, (r, c) => {
        if (!filled.has(`${r}-${c}`)) return { text: 0, tone: 'ghost', dashed: true };
        if (isCur(r, c)) return { text: MP_DP[r][c], tone: 'ok', ring: true };
        if (cur && r === cur[0] - 1 && c === cur[1]) return { text: MP_DP[r][c], tone: 'info', dim: left < up };
        if (cur && r === cur[0] && c === cur[1] - 1) return { text: MP_DP[r][c], tone: 'accent', dim: up < left };
        if (onPath(r, c)) return { text: MP_DP[r][c], tone: 'ok', ring: r === 3 && c === 3 };
        return { text: MP_DP[r][c], tone: 'idle' };
      });
      const nodes: SceneNode[] = [...g, ...d];
      if (cur && cur[1] > 0) nodes.push(...fromLeft('al', dx, y, cur[0], cur[1], 'accent'));
      if (cur && cur[0] > 0) nodes.push(...fromAbove('au', dx, y, cur[0], cur[1], 'info'));
      nodes.push(
        text('cap:g', gx + 85, ty + 22, 'grid', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
        text('cap:d', dx + 85, ty + 22, 'dp', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
      );
      if (eq) nodes.push(chip('eq', W / 2, ty + 36, eq));
      return { w: W, h: ty + 74, nodes };
    };
    const ref = (i: number, j: number, tone: Tone | null): [string, Tone | null] => [`dp[${i}][${j}]`, tone];
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(0, null), say: MP_SAY.init[l] },
      { kind: 'start', scene: scene(1, seg2(ref(0, 0, 'ok'), [' = grid[0][0] = ', null], ['1', 'ok'])), say: MP_SAY.start[l] },
    ];
    for (let k = 1; k < order.length; k++) {
      const [i, j] = order[k];
      const g = GRID[i][j];
      const v = MP_DP[i][j];
      if (i === 0) {
        const a = MP_DP[0][j - 1];
        frames.push({ kind: 'row', scene: scene(k + 1, seg2(ref(i, j, 'ok'), [' = ', null], [String(a), 'accent'], [' + ', null], [String(g), 'ok'], [' = ', null], [String(v), 'ok'])), say: fmt(MP_SAY.row[l], { j, a, g, v }) });
      } else if (j === 0) {
        const a = MP_DP[i - 1][0];
        frames.push({ kind: 'col', scene: scene(k + 1, seg2(ref(i, j, 'ok'), [' = ', null], [String(a), 'info'], [' + ', null], [String(g), 'ok'], [' = ', null], [String(v), 'ok'])), say: fmt(MP_SAY.col[l], { i, a, g, v }) });
      } else {
        const lf = MP_DP[i][j - 1];
        const u = MP_DP[i - 1][j];
        const m = Math.min(lf, u);
        const eq = seg2(ref(i, j, 'ok'), [' = min(', null], [String(lf), 'accent'], [', ', null], [String(u), 'info'], [') + ', null], [String(g), 'ok'], [' = ', null], [String(v), 'ok']);
        const say = lf === u ? fmt(MP_SAY.tie[l], { i, j, m, g }) : fmt(MP_SAY.cell[l], { i, j, l: lf, u, m, g });
        frames.push({ kind: 'cell', scene: scene(k + 1, eq), say });
      }
    }
    frames.push({ kind: 'end', scene: scene(order.length, seg2(['return dp[3][3] = ', null], ['13', 'ok']), true), say: MP_SAY.end[l] });
    return { frames };
  },
};

export const DP_BASIC_FIGURES: Record<string, Figure> = {
  climbing_stairs_example: climbingStairsExample,
  climbing_stairs_state_transfer: climbingStairsStateTransfer,
  climbing_stairs_dfs_tree: climbingStairsDfsTree,
  climbing_stairs_dfs_memo_tree: climbingStairsDfsMemoTree,
  climbing_stairs_dp: climbingStairsDp,
  min_cost_cs_example: minCostExample,
  min_cost_cs_dp: minCostDp,
  climbing_stairs_constraint_example: constraintExample,
  climbing_stairs_constraint_state_transfer: constraintStateTransfer,
  min_path_sum_example: minPathSumExample,
  min_path_sum_solution_state_definition: minPathSumStateDefinition,
  min_path_sum_solution_state_transition: minPathSumStateTransition,
  min_path_sum_solution_initial_state: minPathSumInitialState,
  min_path_sum_dfs: mpTreeFigure(false),
  min_path_sum_dfs_mem: mpTreeFigure(true),
  min_path_sum_dp_steps: minPathSumDp,
};
