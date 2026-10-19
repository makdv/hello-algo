import { arrow, binarySlots, box, chip, link, plot, region, seg, text, treeSlots } from '../kit';
import type { Figure, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, type T } from './shared';

const W = 440;

const AXIS: Record<'n' | 'ops' | 'memory' | 'time' | 'value', T> = {
  n: { en: 'input size n', zh: '输入数据大小 n', 'zh-hant': '輸入資料大小 n', ja: '入力サイズ n', ru: 'размер входа n' },
  ops: { en: 'operations T(n)', zh: '操作数量 T(n)', 'zh-hant': '操作數量 T(n)', ja: '操作回数 T(n)', ru: 'число операций T(n)' },
  memory: { en: 'memory used', zh: '占用内存', 'zh-hant': '佔用記憶體', ja: '使用メモリ', ru: 'занятая память' },
  time: { en: 'running time', zh: '运行时间', 'zh-hant': '執行時間', ja: '実行時間', ru: 'время работы' },
  value: { en: 'function value', zh: '函数值', 'zh-hant': '函式值', ja: '関数の値', ru: 'значение функции' },
};

// ── Growth curves (shared by time and space) ──────────────────────────

interface GrowthClass {
  key: 'const' | 'log' | 'lin' | 'quad' | 'exp';
  label: string;
  tone: Tone;
  f: (n: number) => number;
}

const CLASSES: GrowthClass[] = [
  { key: 'const', label: 'O(1)', tone: 'ok', f: () => 1.2 },
  { key: 'log', label: 'O(log n)', tone: 'info', f: (n) => 4 * Math.log2(n) },
  { key: 'lin', label: 'O(n)', tone: 'accent', f: (n) => 1.6 * n },
  { key: 'quad', label: 'O(n²)', tone: 'warn', f: (n) => (n * n) / 5 },
  { key: 'exp', label: 'O(2ⁿ)', tone: 'danger', f: (n) => 2 ** n / 250 },
];

const GROWTH_SAY: Record<GrowthClass['key'] | 'order', T> = {
  const: {
    en: 'Constant O(1): the cost stays the same however large n gets.',
    zh: '常数阶 O(1)：无论 n 多大，开销都不变。',
    'zh-hant': '常數階 O(1)：無論 n 多大，開銷都不變。',
    ja: '定数オーダー O(1)：n がどれほど大きくてもコストは変わりません。',
    ru: 'Константная O(1): затраты не меняются, каким бы большим ни было n.',
  },
  log: {
    en: 'Logarithmic O(log n): grows very slowly. Doubling n adds just one more step.',
    zh: '对数阶 O(log n)：增长非常缓慢，n 翻倍只多一步。',
    'zh-hant': '對數階 O(log n)：增長非常緩慢，n 翻倍只多一步。',
    ja: '対数オーダー O(log n)：とてもゆっくり増え、n が 2 倍になっても 1 ステップ増えるだけです。',
    ru: 'Логарифмическая O(log n): растёт очень медленно — удвоение n добавляет лишь один шаг.',
  },
  lin: {
    en: 'Linear O(n): grows in proportion to n.',
    zh: '线性阶 O(n)：与 n 成正比增长。',
    'zh-hant': '線性階 O(n)：與 n 成正比增長。',
    ja: '線形オーダー O(n)：n に比例して増えます。',
    ru: 'Линейная O(n): растёт пропорционально n.',
  },
  quad: {
    en: 'Quadratic O(n²): grows with the square of n. Doubling n makes it four times larger.',
    zh: '平方阶 O(n²)：随 n 的平方增长，n 翻倍时变为 4 倍。',
    'zh-hant': '平方階 O(n²)：隨 n 的平方增長，n 翻倍時變為 4 倍。',
    ja: '二乗オーダー O(n²)：n の 2 乗で増え、n が 2 倍になると 4 倍になります。',
    ru: 'Квадратичная O(n²): растёт как квадрат n — при удвоении n становится в 4 раза больше.',
  },
  exp: {
    en: 'Exponential O(2ⁿ): doubles with every extra 1 in n and soon leaves the chart.',
    zh: '指数阶 O(2ⁿ)：n 每增加 1 就翻倍，很快冲出图表。',
    'zh-hant': '指數階 O(2ⁿ)：n 每增加 1 就翻倍，很快衝出圖表。',
    ja: '指数オーダー O(2ⁿ)：n が 1 増えるごとに 2 倍になり、すぐにグラフの外へ出ます。',
    ru: 'Экспоненциальная O(2ⁿ): удваивается при каждом +1 к n и быстро уходит за пределы графика.',
  },
  order: {
    en: 'From low to high: O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ). For large n, the order matters far more than constant factors.',
    zh: '从低到高：O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ)。当 n 很大时，阶数远比常数系数重要。',
    'zh-hant': '從低到高：O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ)。當 n 很大時，階數遠比常數係數重要。',
    ja: '低い順に O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ)。n が大きいときは、定数倍よりオーダーのほうがはるかに重要です。',
    ru: 'От меньшего к большему: O(1) < O(log n) < O(n) < O(n²) < O(2ⁿ). При больших n порядок роста важнее любых констант.',
  },
};

/** The common complexity classes drawn one after another on one chart. */
export function growthChart(yLabel: T): StepFigure {
  return {
    type: 'steps',
    tones: { add: 'cmp', order: 'done' },
    build(l) {
      const p = plot('p', { x: 56, y: 40, w: 300, h: 190 }, { xMin: 1, xMax: 14, yMax: 48, xTicks: [1, 2, 4, 6, 8, 10, 12, 14], xLabel: AXIS.n[l], yLabel: yLabel[l] });
      const curves = CLASSES.map((c) => ({ c, ...p.curve(`c:${c.key}`, c.f, { tone: c.tone }) }));
      const scene = (count: number, hl: number) => {
        const nodes: SceneNode[] = [...p.nodes];
        curves.slice(0, count).forEach(({ c, node, end }, k) => {
          nodes.push({ ...node, width: k === hl ? 3.5 : 2.5 });
          nodes.push(text(`l:${c.key}`, end[0] + 6, end[1] + 4, c.label, { mono: true, bold: true, size: 12, tone: c.tone }));
        });
        return { w: 460, h: 290, nodes };
      };
      const frames: SceneFrame[] = CLASSES.map((c, k) => ({ kind: 'add', scene: scene(k + 1, k), say: GROWTH_SAY[c.key][l] }));
      frames.push({ kind: 'order', scene: scene(CLASSES.length, -1), say: GROWTH_SAY.order[l] });
      return { frames };
    },
  };
}

// ── Doubling recursion tree (shared by time and space) ────────────────

const DOUBLE_SAY: Record<'space' | 'time', Record<'level' | 'total', T>> = {
  space: {
    level: {
      en: 'Level {k}: every node of the level above created two children, so this level holds 2^{k} = {count} nodes.',
      zh: '第 {k} 层：上一层的每个节点都创建了两个子节点，这一层有 2^{k} = {count} 个节点。',
      'zh-hant': '第 {k} 層：上一層的每個節點都建立了兩個子節點，這一層有 2^{k} = {count} 個節點。',
      ja: '{k} 段目：上の段の各ノードが子を 2 つ作ったので、この段には 2^{k} = {count} 個のノードがあります。',
      ru: 'Уровень {k}: каждый узел уровнем выше создал двух детей, здесь 2^{k} = {count} узлов.',
    },
    total: {
      en: 'A full binary tree with n levels has 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 nodes: exponential O(2ⁿ) space.',
      zh: 'n 层的满二叉树共有 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 个节点：指数阶 O(2ⁿ) 空间。',
      'zh-hant': 'n 層的滿二元樹共有 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 個節點：指數階 O(2ⁿ) 空間。',
      ja: 'n 段の完全二分木のノード数は 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1：指数オーダー O(2ⁿ) の空間です。',
      ru: 'В полном двоичном дереве из n уровней 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 узлов: экспоненциальная память O(2ⁿ).',
    },
  },
  time: {
    level: {
      en: 'Level {k}: every call of the level above split into two, so this level makes 2^{k} = {count} calls.',
      zh: '第 {k} 层：上一层的每次调用都分裂为两次，这一层共 2^{k} = {count} 次调用。',
      'zh-hant': '第 {k} 層：上一層的每次呼叫都分裂為兩次，這一層共 2^{k} = {count} 次呼叫。',
      ja: '{k} 段目：上の段の各呼び出しが 2 つに分かれ、この段では 2^{k} = {count} 回呼び出されます。',
      ru: 'Уровень {k}: каждый вызов уровнем выше разделился на два, здесь 2^{k} = {count} вызовов.',
    },
    total: {
      en: 'With n levels the calls add up to 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 operations: exponential O(2ⁿ) time.',
      zh: 'n 层共计 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 次操作：指数阶 O(2ⁿ) 时间。',
      'zh-hant': 'n 層共計 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 次操作：指數階 O(2ⁿ) 時間。',
      ja: 'n 段で合計 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 回の操作：指数オーダー O(2ⁿ) の時間です。',
      ru: 'За n уровней набегает 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 операций: экспоненциальное время O(2ⁿ).',
    },
  },
};

const SUPERS = ['2⁰', '2¹', '2²', '2³'];

/** A tree that doubles at every level; circles for nodes in memory, squares for operations. */
export function doublingTree(kind: 'space' | 'time'): StepFigure {
  return {
    type: 'steps',
    tones: { level: 'cmp', total: 'done' },
    build(l) {
      const slots = binarySlots(4, 0, 340, 36, 50);
      const size = kind === 'space' ? 24 : 22;
      const boxes = slots.map((s, k) =>
        box(`n${k}`, s.x - size / 2, s.y - size / 2, '', { w: size, h: size, tone: 'ok', shape: kind === 'space' ? 'circle' : 'rect' }),
      );
      const scene = (levels: number, total: boolean) => {
        const nodes: SceneNode[] = [];
        slots.forEach((s, k) => {
          if (s.level >= levels) return;
          nodes.push({ ...boxes[k], tone: s.level === levels - 1 && !total ? 'accent' : 'ok' });
          if (k > 0) nodes.push(link(`e${k}`, boxes[(k - 1) >> 1], boxes[k], { pad: 2, width: 1.5 }));
        });
        for (let k = 0; k < levels; k++) {
          nodes.push(text(`cnt${k}`, 392, 41 + k * 50, SUPERS[k], { anchor: 'middle', mono: true, bold: true, size: 14, tone: 'ok' }));
        }
        if (total) {
          slots.filter((s) => s.level === 3).forEach((s, k) => nodes.push(text(`dots${k}`, s.x, 222, '⋯', { anchor: 'middle', size: 13, tone: 'muted' })));
          nodes.push(
            text('cnt:more', 392, 222, '⋯', { anchor: 'middle', size: 13, tone: 'muted' }),
            chip('sum', W / 2, 236, seg('2⁰ + 2¹ + 2² + … + 2ⁿ⁻¹ = ', ['2ⁿ − 1', 'ok', true], '  →  ', ['O(2ⁿ)', 'danger', true]), { size: 13 }),
          );
        }
        return { w: W, h: 272, nodes };
      };
      const frames: SceneFrame[] = [0, 1, 2, 3].map((k) => ({ kind: 'level', scene: scene(k + 1, false), say: fmt(DOUBLE_SAY[kind].level[l], { k, count: 2 ** k }) }));
      frames.push({ kind: 'total', scene: scene(4, true), say: DOUBLE_SAY[kind].total[l] });
      return { frames };
    },
  };
}

// ── Algorithms A, B and C ─────────────────────────────────────────────

const ALGOS: Record<'a' | 'b' | 'c' | 'note', T> = {
  a: { en: 'A: constant', zh: 'A：常数阶', 'zh-hant': 'A：常數階', ja: 'A：定数時間', ru: 'A: константа' },
  b: { en: 'B: linear', zh: 'B：线性阶', 'zh-hant': 'B：線性階', ja: 'B：線形時間', ru: 'B: линейный' },
  c: { en: 'C: constant', zh: 'C：常数阶', 'zh-hant': 'C：常數階', ja: 'C：定数時間', ru: 'C: константа' },
  note: {
    en: 'A does 1 operation, B does n, C always does 1,000,000. C is O(1) like A, yet slower than B for every practical n: complexity describes growth, not actual speed.',
    zh: 'A 执行 1 次操作，B 执行 n 次，C 恒为 1000000 次。C 与 A 同为 O(1)，却在实际规模下都比 B 慢：时间复杂度描述的是增长趋势，而非实际快慢。',
    'zh-hant': 'A 執行 1 次操作，B 執行 n 次，C 恆為 1000000 次。C 與 A 同為 O(1)，卻在實際規模下都比 B 慢：時間複雜度描述的是增長趨勢，而非實際快慢。',
    ja: 'A は 1 回、B は n 回、C は常に 1,000,000 回の操作を行います。C は A と同じ O(1) ですが、現実的な n では B より遅い。計算量は増え方を表し、実際の速さではありません。',
    ru: 'A делает 1 операцию, B — n, C — всегда 1 000 000. C, как и A, — O(1), но при любых практических n медленнее B: сложность описывает рост, а не реальную скорость.',
  },
};

const simpleExample: StaticFigure = {
  type: 'static',
  build(l) {
    const p = plot('p', { x: 76, y: 30, w: 250, h: 170 }, { xMax: 9, yMax: 14, xTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], xLabel: AXIS.n[l], yLabel: AXIS.time[l] });
    const a = p.curve('a', () => 1.5, { tone: 'ok' });
    const b = p.curve('b', (n) => n * 1.2, { tone: 'info' });
    const c = p.curve('c', () => 13, { tone: 'danger' });
    const ytick = (id: string, v: number, label: string) => text(id, 68, p.py(v) + 4, label, { anchor: 'end', mono: true, size: 11, tone: 'muted' });
    return {
      scene: {
        w: W,
        h: 250,
        nodes: [
          ...p.nodes,
          ytick('y0', 0, '0'),
          ytick('y5', 5, '5'),
          ytick('y10', 10, '10'),
          ytick('yc', 13, '1000000'),
          text('break', 76, p.py(11.6) + 4, '≈', { anchor: 'middle', size: 16, bold: true, tone: 'muted' }),
          a.node,
          b.node,
          c.node,
          text('la', a.end[0] + 8, a.end[1] + 4, seg([ALGOS.a[l], 'ok', true], '  O(1)'), { size: 12 }),
          text('lb', b.end[0] + 8, b.end[1] + 4, seg([ALGOS.b[l], 'info', true], '  O(n)'), { size: 12 }),
          text('lc', c.end[0] + 8, c.end[1] + 4, seg([ALGOS.c[l], 'danger', true], '  O(1)'), { size: 12 }),
        ],
      },
      notes: [ALGOS.note[l]],
    };
  },
};

// ── Asymptotic upper bound ────────────────────────────────────────────

const BOUND_SAY: Record<'t' | 'cf' | 'n0' | 'bound', T> = {
  t: {
    en: 'T(n): the actual number of operations of some algorithm. It wiggles, but grows roughly like n².',
    zh: 'T(n)：某个算法的实际操作数量。它有起伏，但大致按 n² 增长。',
    'zh-hant': 'T(n)：某個演算法的實際操作數量。它有起伏，但大致按 n² 增長。',
    ja: 'T(n)：あるアルゴリズムの実際の操作回数。上下しながらも、おおむね n² のように増えます。',
    ru: 'T(n): реальное число операций некоторого алгоритма. Оно колеблется, но растёт примерно как n².',
  },
  cf: {
    en: 'c · f(n): a simple function, here f(n) = n², times a constant c.',
    zh: 'c · f(n)：一个简单函数（这里 f(n) = n²）乘以常数 c。',
    'zh-hant': 'c · f(n)：一個簡單函式（這裡 f(n) = n²）乘以常數 c。',
    ja: 'c · f(n)：単純な関数（ここでは f(n) = n²）に定数 c を掛けたもの。',
    ru: 'c · f(n): простая функция, здесь f(n) = n², умноженная на константу c.',
  },
  n0: {
    en: 'From n₀ on, c · f(n) stays above T(n). What happens for small n does not matter.',
    zh: '从 n₀ 开始，c · f(n) 始终不小于 T(n)。n 较小时的情况无关紧要。',
    'zh-hant': '從 n₀ 開始，c · f(n) 始終不小於 T(n)。n 較小時的情況無關緊要。',
    ja: 'n₀ 以降、c · f(n) は常に T(n) 以上です。n が小さいときの様子は関係ありません。',
    ru: 'Начиная с n₀, c · f(n) всегда не ниже T(n). Что происходит при малых n — неважно.',
  },
  bound: {
    en: 'So f(n) is an asymptotic upper bound of T(n), written T(n) = O(f(n)) = O(n²).',
    zh: '因此 f(n) 是 T(n) 的渐近上界，记为 T(n) = O(f(n)) = O(n²)。',
    'zh-hant': '因此 f(n) 是 T(n) 的漸近上界，記為 T(n) = O(f(n)) = O(n²)。',
    ja: 'したがって f(n) は T(n) の漸近的上界で、T(n) = O(f(n)) = O(n²) と書きます。',
    ru: 'Значит, f(n) — асимптотическая верхняя граница T(n): T(n) = O(f(n)) = O(n²).',
  },
};

const upperBound: StepFigure = {
  type: 'steps',
  tones: { t: 'idle', cf: 'cmp', n0: 'swp', bound: 'done' },
  build(l) {
    const T_ = (x: number) => 0.17 * x * x + 3 * Math.exp(-((x - 3) ** 2) / 3);
    const CF = (x: number) => 0.22 * x * x;
    // n0: the last point where T(n) is still above c·f(n).
    let n0 = 0;
    for (let x = 0; x <= 14; x += 0.05) if (T_(x) > CF(x)) n0 = x;
    const p = plot('p', { x: 46, y: 34, w: 300, h: 170 }, { xMax: 14, yMax: 46, xTicks: [0, 2, 4, 6, 8, 10, 12, 14], xLabel: AXIS.n[l], yLabel: AXIS.value[l] });
    const t = p.curve('t', T_, { tone: 'info' });
    const cf = p.curve('cf', CF, { tone: 'warn' });
    const scene = (stage: number) => {
      const nodes: SceneNode[] = [...p.nodes];
      if (stage >= 2) {
        nodes.push(
          region('zone', p.px(n0), 34, p.px(14) - p.px(n0), 170, { tone: 'ok' }),
          arrow('n0:line', [p.px(n0), 204], [p.px(n0), 50], { tone: 'ok', dashed: true, head: 'none' }),
          text('n0', p.px(n0), 46, 'n₀', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'ok' }),
        );
      }
      nodes.push(t.node, text('l:t', t.end[0] + 8, t.end[1] + 10, 'T(n)', { mono: true, bold: true, size: 13, tone: 'info' }));
      if (stage >= 1) nodes.push(cf.node, text('l:cf', cf.end[0] + 8, cf.end[1] + 2, 'c · f(n)', { mono: true, bold: true, size: 13, tone: 'warn' }));
      if (stage >= 3) nodes.push(chip('res', W / 2 - 10, 252, seg(['T(n)', 'info', true], ' = O(', ['f(n)', 'warn', true], ')'), { size: 14 }));
      return { w: W, h: 290, nodes };
    };
    return {
      frames: [
        { kind: 't', scene: scene(0), say: BOUND_SAY.t[l] },
        { kind: 'cf', scene: scene(1), say: BOUND_SAY.cf[l] },
        { kind: 'n0', scene: scene(2), say: BOUND_SAY.n0[l] },
        { kind: 'bound', scene: scene(3), say: BOUND_SAY.bound[l] },
      ],
    };
  },
};

// ── 1, n and n² operations ────────────────────────────────────────────

const OPS_SAY: T = {
  en: 'n = {n}: the constant algorithm does 1 operation, the loop does {n}, and the nested loop does {sq}.',
  zh: 'n = {n}：常数阶算法执行 1 次操作，单层循环 {n} 次，嵌套循环 {sq} 次。',
  'zh-hant': 'n = {n}：常數階演算法執行 1 次操作，單層迴圈 {n} 次，巢狀迴圈 {sq} 次。',
  ja: 'n = {n}：定数のアルゴリズムは 1 回、ループは {n} 回、二重ループは {sq} 回の操作を行います。',
  ru: 'n = {n}: константный алгоритм делает 1 операцию, цикл — {n}, вложенный цикл — {sq}.',
};

const OPS_WORD: T = { en: 'operations', zh: '次操作', 'zh-hant': '次操作', ja: '回の操作', ru: 'операций' };

const constantLinearQuadratic: StepFigure = {
  type: 'steps',
  tones: { grow: 'cmp' },
  build(l) {
    const sq = 14;
    const gap = 4;
    const panels: [string, Tone, number][] = [
      ['O(1)', 'ok', 8],
      ['O(n)', 'info', 152],
      ['O(n²)', 'warn', 296],
    ];
    const scene = (n: number) => {
      const nodes: SceneNode[] = [];
      panels.forEach(([label, tone, x], k) => {
        nodes.push(region(`p${k}`, x, 40, 136, 140, { tone }), text(`t${k}`, x + 68, 24, label, { anchor: 'middle', mono: true, bold: true, size: 15, tone }));
        const cols = k === 0 ? 1 : n;
        const rows = k === 2 ? n : 1;
        const gw = cols * (sq + gap) - gap;
        const gh = rows * (sq + gap) - gap;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            nodes.push(box(`o${k}-${r}-${c}`, x + 68 - gw / 2 + c * (sq + gap), 110 - gh / 2 + r * (sq + gap), '', { w: sq, h: sq, tone }));
          }
        }
        const count = k === 0 ? 1 : k === 1 ? n : n * n;
        nodes.push(text(`c${k}`, x + 68, 204, `${count} ${OPS_WORD[l]}`, { anchor: 'middle', size: 13, bold: true, tone }));
      });
      return { w: W, h: 220, nodes };
    };
    return { frames: [1, 2, 3, 4, 5].map((n) => ({ kind: 'grow', scene: scene(n), say: fmt(OPS_SAY[l], { n, sq: n * n }), call: `n = ${n}` })) };
  },
};

// ── Halving: O(log n) ─────────────────────────────────────────────────

const LOG_SAY: Record<'level' | 'total', T> = {
  level: {
    en: 'Operation {k}: {size} element(s) left. Each operation halves what remains.',
    zh: '第 {k} 次操作：还剩 {size} 个元素。每次操作都把剩余部分减半。',
    'zh-hant': '第 {k} 次操作：還剩 {size} 個元素。每次操作都把剩餘部分減半。',
    ja: '{k} 回目の操作：残りは {size} 個。操作のたびに残りが半分になります。',
    ru: 'Операция {k}: осталось элементов — {size}. Каждая операция делит остаток пополам.',
  },
  total: {
    en: 'Halving 8 down to 1 takes log₂8 + 1 = 4 operations. In general log₂n + 1: logarithmic O(log n).',
    zh: '把 8 减半到 1 需要 log₂8 + 1 = 4 次操作。一般为 log₂n + 1：对数阶 O(log n)。',
    'zh-hant': '把 8 減半到 1 需要 log₂8 + 1 = 4 次操作。一般為 log₂n + 1：對數階 O(log n)。',
    ja: '8 を 1 まで半分にしていくと log₂8 + 1 = 4 回。一般に log₂n + 1 回：対数オーダー O(log n) です。',
    ru: 'Чтобы уменьшить 8 до 1 делением пополам, нужно log₂8 + 1 = 4 операции. В общем случае log₂n + 1: логарифмическая O(log n).',
  },
};

const logarithmic: StepFigure = {
  type: 'steps',
  tones: { level: 'cmp', total: 'done' },
  build(l) {
    const cell = 30;
    const gap = 4;
    const x0 = 60;
    const rowY = (k: number) => 30 + k * 46;
    const scene = (levels: number, total: boolean) => {
      const nodes: SceneNode[] = [];
      for (let k = 0; k < levels; k++) {
        const size = 8 >> k;
        nodes.push(text(`s${k}`, x0 - 14, rowY(k) + 20, String(size), { anchor: 'end', mono: true, bold: true, size: 13, tone: 'muted' }));
        for (let i = 0; i < 8; i++) {
          const kept = i >= 8 - size;
          nodes.push(box(`c${k}-${i}`, x0 + i * (cell + gap), rowY(k), '', { w: cell, h: cell, tone: kept ? (k === levels - 1 && !total ? 'accent' : 'ok') : 'muted' }));
        }
        nodes.push(box(`op${k}`, 368, rowY(k) + 4, '', { w: 22, h: 22, tone: 'ok' }));
        if (k > 0) nodes.push(arrow(`a${k}`, [379, rowY(k - 1) + 27], [379, rowY(k) + 2], { tone: 'muted' }));
      }
      if (total) nodes.push(chip('sum', W / 2, 220, seg(['log₂8 + 1 = 4', 'ok', true], '  →  ', ['O(log n)', 'info', true]), { size: 13 }));
      return { w: W, h: 256, nodes };
    };
    const frames: SceneFrame[] = [0, 1, 2, 3].map((k) => ({ kind: 'level', scene: scene(k + 1, false), say: fmt(LOG_SAY.level[l], { k: k + 1, size: 8 >> k }) }));
    frames.push({ kind: 'total', scene: scene(4, true), say: LOG_SAY.total[l] });
    return { frames };
  },
};

// ── Split in halves, n work per level: O(n log n) ─────────────────────

const NLOGN_SAY: Record<'level' | 'total', T> = {
  level: {
    en: 'Level {k}: {groups} part(s) of size {size}. Each part costs as many operations as its size, so the level costs {size} × {groups} = 8.',
    zh: '第 {k} 层：{groups} 个大小为 {size} 的部分。每部分的操作数等于其大小，这一层共 {size} × {groups} = 8 次。',
    'zh-hant': '第 {k} 層：{groups} 個大小為 {size} 的部分。每部分的操作數等於其大小，這一層共 {size} × {groups} = 8 次。',
    ja: '{k} 段目：大きさ {size} の部分が {groups} 個。各部分の操作回数は大きさと同じなので、この段は {size} × {groups} = 8 回です。',
    ru: 'Уровень {k}: частей — {groups}, размер каждой — {size}. Часть стоит столько операций, сколько в ней элементов, поэтому уровень стоит {size} × {groups} = 8.',
  },
  total: {
    en: 'Every level costs n = 8 and there are log₂8 + 1 = 4 levels: 8 × 4 = 32 operations. In general n(log₂n + 1): O(n log n).',
    zh: '每层都是 n = 8 次，共 log₂8 + 1 = 4 层：8 × 4 = 32 次操作。一般为 n(log₂n + 1)：O(n log n)。',
    'zh-hant': '每層都是 n = 8 次，共 log₂8 + 1 = 4 層：8 × 4 = 32 次操作。一般為 n(log₂n + 1)：O(n log n)。',
    ja: 'どの段も n = 8 回で、段数は log₂8 + 1 = 4：8 × 4 = 32 回。一般に n(log₂n + 1) 回で O(n log n) です。',
    ru: 'Каждый уровень стоит n = 8, уровней log₂8 + 1 = 4: всего 8 × 4 = 32 операции. В общем случае n(log₂n + 1): O(n log n).',
  },
};

const linearithmic: StepFigure = {
  type: 'steps',
  tones: { level: 'cmp', total: 'done' },
  build(l) {
    const sq = 16;
    const gap = 2;
    const groupGap = 14;
    const rowY = (k: number) => 34 + k * 48;
    const scene = (levels: number, total: boolean) => {
      const nodes: SceneNode[] = [];
      for (let k = 0; k < levels; k++) {
        const groups = 2 ** k;
        const size = 8 / groups;
        const gw = size * sq + (size - 1) * gap;
        const width = groups * gw + (groups - 1) * groupGap;
        const left = 20 + (280 - width) / 2;
        for (let g = 0; g < groups; g++) {
          const gx = left + g * (gw + groupGap);
          nodes.push(region(`g${k}-${g}`, gx - 4, rowY(k) - 4, gw + 8, sq + 8, { tone: k === levels - 1 && !total ? 'accent' : 'info' }));
          for (let i = 0; i < size; i++) nodes.push(box(`o${k}-${g}-${i}`, gx + i * (sq + gap), rowY(k), '', { w: sq, h: sq, tone: 'ok' }));
        }
        nodes.push(text(`m${k}`, 318, rowY(k) + 13, seg(`${size} × ${groups} = `, ['8', 'ok', true]), { mono: true, size: 13 }));
      }
      if (total) nodes.push(chip('sum', W / 2, 222, seg('8 × (log₂8 + 1) = ', ['32', 'ok', true], '  →  ', ['O(n log n)', 'info', true]), { size: 13 }));
      return { w: W, h: 258, nodes };
    };
    const frames: SceneFrame[] = [0, 1, 2, 3].map((k) => ({ kind: 'level', scene: scene(k + 1, false), say: fmt(NLOGN_SAY.level[l], { k, groups: 2 ** k, size: 8 / 2 ** k }) }));
    frames.push({ kind: 'total', scene: scene(4, true), say: NLOGN_SAY.total[l] });
    return { frames };
  },
};

// ── Permutations: O(n!) ───────────────────────────────────────────────

const FACT_SAY: Record<'level' | 'total', T> = {
  level: {
    en: 'Level {k}: each branch picks one of the {left} remaining numbers. Branches so far: {count}.',
    zh: '第 {k} 层：每个分支从剩下的 {left} 个数中选一个，目前共 {count} 个分支。',
    'zh-hant': '第 {k} 層：每個分支從剩下的 {left} 個數中選一個，目前共 {count} 個分支。',
    ja: '{k} 段目：各枝が残り {left} 個の数から 1 つを選びます。ここまでの枝の数は {count}。',
    ru: 'Уровень {k}: каждая ветка выбирает одно из оставшихся чисел ({left} шт.). Веток пока: {count}.',
  },
  total: {
    en: 'All orderings of 1, 2, 3: 3 × 2 × 1 = 3! = 6 leaves. For n items there are n! of them: factorial O(n!).',
    zh: '1、2、3 的全部排列：3 × 2 × 1 = 3! = 6 个叶节点。n 个元素共有 n! 种：阶乘阶 O(n!)。',
    'zh-hant': '1、2、3 的全部排列：3 × 2 × 1 = 3! = 6 個葉節點。n 個元素共有 n! 種：階乘階 O(n!)。',
    ja: '1、2、3 の並べ方すべて：3 × 2 × 1 = 3! = 6 枚の葉。n 個なら n! 通り：階乗オーダー O(n!) です。',
    ru: 'Все перестановки 1, 2, 3: 3 × 2 × 1 = 3! = 6 листьев. Для n элементов их n!: факториальная O(n!).',
  },
};

const factorial: StepFigure = {
  type: 'steps',
  tones: { level: 'cmp', total: 'done' },
  build(l) {
    // Build the permutation tree of [1, 2, 3]: each node remembers the path to it.
    const parents: number[] = [-1];
    const paths: number[][] = [[]];
    for (let k = 0; k < paths.length; k++) {
      if (paths[k].length === 3) continue;
      for (const v of [1, 2, 3]) {
        if (paths[k].includes(v)) continue;
        parents.push(k);
        paths.push([...paths[k], v]);
      }
    }
    const slots = treeSlots(parents, 6, 340, 26, 54);
    const boxes = slots.map((s, k) =>
      box(`n${k}`, s.x - 14, s.y - 14, k === 0 ? '·' : String(paths[k][paths[k].length - 1]), { w: 28, h: 28, size: 13, tone: k === 0 ? 'muted' : 'ok' }),
    );
    const counts = ['1', '3', '3 × 2', '3 × 2 × 1'];
    const scene = (levels: number, total: boolean) => {
      const nodes: SceneNode[] = [];
      slots.forEach((s, k) => {
        if (s.level > levels) return;
        nodes.push({ ...boxes[k], tone: k === 0 ? 'muted' : s.level === levels && !total ? 'accent' : 'ok' });
        if (k > 0) nodes.push(link(`e${k}`, boxes[parents[k]], boxes[k], { pad: 2, width: 1.25 }));
        if (total && s.level === 3) nodes.push(text(`perm${k}`, s.x, s.y + 32, paths[k].join(''), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      });
      for (let k = 1; k <= levels; k++) nodes.push(text(`cnt${k}`, 362, 26 + k * 54 + 5, counts[k], { mono: true, bold: true, size: 13, tone: 'ok' }));
      if (total) nodes.push(chip('sum', W / 2, 236, seg('3 × 2 × 1 = ', ['3! = 6', 'ok', true], '  →  ', ['O(n!)', 'danger', true]), { size: 13 }));
      return { w: W, h: 270, nodes };
    };
    const frames: SceneFrame[] = [1, 2, 3].map((k) => ({
      kind: 'level',
      scene: scene(k, false),
      say: fmt(FACT_SAY.level[l], { k, left: 4 - k, count: [3, 6, 6][k - 1] }),
    }));
    frames.push({ kind: 'total', scene: scene(3, true), say: FACT_SAY.total[l] });
    return { frames };
  },
};

export const TIME_FIGURES: Record<string, Figure> = {
  time_complexity_simple_example: simpleExample,
  asymptotic_upper_bound: upperBound,
  time_complexity_common_types: growthChart(AXIS.ops),
  time_complexity_constant_linear_quadratic: constantLinearQuadratic,
  time_complexity_exponential: doublingTree('time'),
  time_complexity_logarithmic: logarithmic,
  time_complexity_logarithmic_linear: linearithmic,
  time_complexity_factorial: factorial,
};

export { AXIS };
