import scJavaEn from '@codes-en/java/chapter_computational_complexity/space_complexity.java?raw';
import scPyEn from '@codes-en/python/chapter_computational_complexity/space_complexity.py?raw';
import scJavaJa from '@codes-ja/java/chapter_computational_complexity/space_complexity.java?raw';
import scPyJa from '@codes-ja/python/chapter_computational_complexity/space_complexity.py?raw';
import scJavaRu from '@codes-ru/java/chapter_computational_complexity/space_complexity.java?raw';
import scPyRu from '@codes-ru/python/chapter_computational_complexity/space_complexity.py?raw';
import scJavaZh from '@codes-zh/java/chapter_computational_complexity/space_complexity.java?raw';
import scPyZh from '@codes-zh/python/chapter_computational_complexity/space_complexity.py?raw';
import scJavaZhHant from '@codes-zh-hant/java/chapter_computational_complexity/space_complexity.java?raw';
import scPyZhHant from '@codes-zh-hant/python/chapter_computational_complexity/space_complexity.py?raw';
import { arrow, box, brace, chip, seg, text } from '../kit';
import type { Figure, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { AXIS, doublingTree, growthChart } from './complexityTime';
import { fmt, funcSources, raw, type T } from './shared';

const SPACE_PY = raw(scPyEn, scPyZh, scPyZhHant, scPyJa, scPyRu);
const SPACE_JAVA = raw(scJavaEn, scJavaZh, scJavaZhHant, scJavaJa, scJavaRu);

const W = 440;

// ── Kinds of space ────────────────────────────────────────────────────

const SPACES: Record<'input' | 'temp' | 'output' | 'tempData' | 'frames' | 'instr' | 'inputData' | 'outputData' | 'scope', T> = {
  input: { en: 'Input space', zh: '输入空间', 'zh-hant': '輸入空間', ja: '入力空間', ru: 'Входные данные' },
  temp: { en: 'Temporary space', zh: '暂存空间', 'zh-hant': '暫存空間', ja: '一時空間', ru: 'Временная память' },
  output: { en: 'Output space', zh: '输出空间', 'zh-hant': '輸出空間', ja: '出力空間', ru: 'Выходные данные' },
  inputData: { en: 'input data', zh: '输入数据', 'zh-hant': '輸入資料', ja: '入力データ', ru: 'вход' },
  tempData: { en: 'temporary data', zh: '暂存数据', 'zh-hant': '暫存資料', ja: '一時データ', ru: 'временные данные' },
  frames: { en: 'stack frames', zh: '栈帧空间', 'zh-hant': '堆疊幀空間', ja: 'スタックフレーム', ru: 'кадры стека' },
  instr: { en: 'instructions', zh: '指令空间', 'zh-hant': '指令空間', ja: '命令領域', ru: 'инструкции' },
  outputData: { en: 'output data', zh: '输出数据', 'zh-hant': '輸出資料', ja: '出力データ', ru: 'результат' },
  scope: {
    en: 'usually counted in space complexity',
    zh: '空间复杂度通常统计的范围',
    'zh-hant': '空間複雜度通常統計的範圍',
    ja: '空間計算量で通常数える範囲',
    ru: 'обычно учитывается в оценке памяти',
  },
};

const spaceTypes: StaticFigure = {
  type: 'static',
  build(l) {
    const bw = 124;
    const gap = 22;
    const x = (k: number) => 8 + k * (bw + gap);
    const y = 70;
    const items: [Tone, string, string[]][] = [
      ['ok', SPACES.input[l], [SPACES.inputData[l]]],
      ['info', SPACES.temp[l], [SPACES.tempData[l], SPACES.frames[l], SPACES.instr[l]]],
      ['accent', SPACES.output[l], [SPACES.outputData[l]]],
    ];
    const nodes: SceneNode[] = [];
    items.forEach(([tone, title, lines], k) => {
      nodes.push(box(`b${k}`, x(k), y, title, { w: bw, h: 52, sans: true, size: 13, tone }));
      lines.forEach((line, j) => nodes.push(text(`t${k}-${j}`, x(k) + bw / 2, y + 76 + j * 20, line, { anchor: 'middle', size: 12, tone: 'muted' })));
      if (k > 0) nodes.push(arrow(`a${k}`, [x(k) - gap + 3, y + 26], [x(k) - 3, y + 26], { width: 2 }));
    });
    nodes.push(brace('scope', x(1), x(2) + bw, y - 10, 'up'), text('scope:t', (x(1) + x(2) + bw) / 2, y - 34, SPACES.scope[l], { anchor: 'middle', size: 12, bold: true, tone: 'info' }));
    return { scene: { w: W, h: 196, nodes } };
  },
};

// ── Linear recursion: one stack frame per call ────────────────────────

const LINEAR_SAY: Record<'call' | 'base' | 'ret' | 'done', T> = {
  call: {
    en: 'linear_recur({n}) calls linear_recur({m}). A new stack frame is pushed; {k} frame(s) are in use.',
    zh: 'linear_recur({n}) 调用 linear_recur({m})，压入一个新的栈帧，当前占用 {k} 个栈帧。',
    'zh-hant': 'linear_recur({n}) 呼叫 linear_recur({m})，壓入一個新的堆疊幀，目前佔用 {k} 個堆疊幀。',
    ja: 'linear_recur({n}) が linear_recur({m}) を呼び、新しいスタックフレームが積まれます。使用中のフレームは {k} 個。',
    ru: 'linear_recur({n}) вызывает linear_recur({m}). В стек кладётся новый кадр; занято кадров: {k}.',
  },
  base: {
    en: 'linear_recur(1) is the base case. The stack is at its deepest: n = 4 frames at once.',
    zh: 'linear_recur(1) 触发终止条件。此时栈最深：同时存在 n = 4 个栈帧。',
    'zh-hant': 'linear_recur(1) 觸發終止條件。此時堆疊最深：同時存在 n = 4 個堆疊幀。',
    ja: 'linear_recur(1) は終了条件です。スタックは最も深く、n = 4 個のフレームが同時にあります。',
    ru: 'linear_recur(1) — базовый случай. Стек на максимальной глубине: одновременно n = 4 кадра.',
  },
  ret: {
    en: 'linear_recur({n}) returns and its frame is freed. {k} frame(s) left.',
    zh: 'linear_recur({n}) 返回，释放其栈帧，还剩 {k} 个栈帧。',
    'zh-hant': 'linear_recur({n}) 回傳，釋放其堆疊幀，還剩 {k} 個堆疊幀。',
    ja: 'linear_recur({n}) が戻り、そのフレームは解放されます。残りは {k} 個。',
    ru: 'linear_recur({n}) возвращается, его кадр освобождается. Осталось кадров: {k}.',
  },
  done: {
    en: 'All calls returned. The peak was n frames, so the space complexity is linear, O(n).',
    zh: '所有调用都已返回。峰值为 n 个栈帧，因此空间复杂度为线性阶 O(n)。',
    'zh-hant': '所有呼叫都已回傳。峰值為 n 個堆疊幀，因此空間複雜度為線性階 O(n)。',
    ja: 'すべての呼び出しが戻りました。最大で n 個のフレームを使ったので、空間計算量は線形 O(n) です。',
    ru: 'Все вызовы вернулись. В пике было n кадров, значит, память линейная — O(n).',
  },
};

const STACK_WORD: T = { en: 'call stack', zh: '调用栈', 'zh-hant': '呼叫堆疊', ja: 'コールスタック', ru: 'стек вызовов' };
const FRAMES_WORD: T = { en: 'frames in use', zh: '占用栈帧', 'zh-hant': '佔用堆疊幀', ja: '使用中のフレーム', ru: 'занято кадров' };

const recursiveLinear: StepFigure = {
  type: 'steps',
  call: 'linear_recur(4)',
  tones: { call: 'cmp', base: 'swp', ret: 'done' },
  sources: funcSources(SPACE_PY, SPACE_JAVA, ['linear_recur'], {
    python: { call: ['linear_recur(n - 1)'], base: ['if n == 1:', 'return'], ret: ['linear_recur(n - 1)'] },
    java: { call: ['linearRecur(n - 1);'], base: ['if (n == 1)', 'return;'], ret: ['linearRecur(n - 1);'] },
  }),
  build(l) {
    const slotY = (k: number) => 232 - k * 44;
    const x = 40;
    const scene = (depth: number, active: number, base: boolean, peak: number) => {
      const nodes: SceneNode[] = [
        text('title', x, 20, STACK_WORD[l], { size: 13, bold: true, tone: 'muted' }),
        { kind: 'path', id: 'floor', d: `M ${x - 8} 270 L ${x + 188} 270`, tone: 'ghost', width: 2.5 },
      ];
      for (let k = 0; k < depth; k++) {
        const n = 4 - k;
        const label: Rich = seg('linear_recur(', [String(n), 'ok', true], ')');
        nodes.push(box(`f${n}`, x, slotY(k), label, { w: 172, h: 34, size: 13, tone: k === active ? (base ? 'warn' : 'accent') : 'idle', ring: k === active }));
      }
      if (depth > 0) nodes.push(brace('br', slotY(depth - 1), slotY(0) + 34, x + 184, 'right'));
      nodes.push(
        text('count', 300, 150, seg(`${FRAMES_WORD[l]}: `, [String(depth), 'accent', true]), { size: 13 }),
        text('peak', 300, 174, seg('peak: ', [String(peak), 'ok', true], peak === 4 ? '  = n' : ''), { mono: true, size: 13 }),
      );
      return { w: W, h: 282, nodes };
    };
    const frames: SceneFrame[] = [];
    for (let k = 0; k < 4; k++) {
      const n = 4 - k;
      if (n === 1) frames.push({ kind: 'base', scene: scene(4, 3, true, 4), say: LINEAR_SAY.base[l] });
      else frames.push({ kind: 'call', scene: scene(k + 1, k, false, k + 1), say: fmt(LINEAR_SAY.call[l], { n, m: n - 1, k: k + 1 }) });
    }
    for (let depth = 3; depth >= 0; depth--) {
      const n = depth + 1;
      frames.push({
        kind: 'ret',
        scene: scene(depth, depth - 1, false, 4),
        say: depth === 0 ? LINEAR_SAY.done[l] : fmt(LINEAR_SAY.ret[l], { n, k: depth }),
      });
    }
    return { frames };
  },
};

// ── Quadratic recursion: each call allocates an array ─────────────────

const QUAD_SAY: Record<'alloc' | 'base' | 'ret', T> = {
  alloc: {
    en: 'quadratic_recur({n}) creates an array of length {n} and calls itself with {m}. Memory in use: {total}.',
    zh: 'quadratic_recur({n}) 创建长度为 {n} 的数组，并以 {m} 递归调用。当前占用：{total}。',
    'zh-hant': 'quadratic_recur({n}) 建立長度為 {n} 的陣列，並以 {m} 遞迴呼叫。目前佔用：{total}。',
    ja: 'quadratic_recur({n}) は長さ {n} の配列を作り、{m} で自分を呼びます。使用中のメモリ：{total}。',
    ru: 'quadratic_recur({n}) создаёт массив длины {n} и вызывает себя с {m}. Занято памяти: {total}.',
  },
  base: {
    en: 'quadratic_recur(0) is the base case. All arrays are alive at once: 4 + 3 + 2 + 1 = 10 = n(n + 1)/2 cells.',
    zh: 'quadratic_recur(0) 触发终止条件。此时所有数组同时存在：4 + 3 + 2 + 1 = 10 = n(n + 1)/2 个单元。',
    'zh-hant': 'quadratic_recur(0) 觸發終止條件。此時所有陣列同時存在：4 + 3 + 2 + 1 = 10 = n(n + 1)/2 個單元。',
    ja: 'quadratic_recur(0) は終了条件です。すべての配列が同時に存在し、4 + 3 + 2 + 1 = 10 = n(n + 1)/2 マスです。',
    ru: 'quadratic_recur(0) — базовый случай. Все массивы живы одновременно: 4 + 3 + 2 + 1 = 10 = n(n + 1)/2 ячеек.',
  },
  ret: {
    en: 'The calls return and free their arrays. The peak, n(n + 1)/2, grows with n²: quadratic space, O(n²).',
    zh: '调用依次返回并释放数组。峰值 n(n + 1)/2 随 n² 增长：平方阶空间 O(n²)。',
    'zh-hant': '呼叫依次回傳並釋放陣列。峰值 n(n + 1)/2 隨 n² 增長：平方階空間 O(n²)。',
    ja: '呼び出しが順に戻り、配列を解放します。最大値 n(n + 1)/2 は n² に比例して増えるので、空間は O(n²) です。',
    ru: 'Вызовы возвращаются и освобождают массивы. Пик n(n + 1)/2 растёт как n²: квадратичная память O(n²).',
  },
};

const recursiveQuadratic: StepFigure = {
  type: 'steps',
  call: 'quadratic_recur(4)',
  tones: { alloc: 'cmp', base: 'swp', ret: 'done' },
  sources: funcSources(SPACE_PY, SPACE_JAVA, ['quadratic_recur'], {
    python: { alloc: ['nums = [0] * n'], base: ['if n <= 0:', 'return 0'], ret: ['return quadratic_recur(n - 1)'] },
    java: { alloc: ['int[] nums = new int[n];'], base: ['if (n <= 0)', 'return 0;'], ret: ['return quadraticRecur(n - 1);'] },
  }),
  build(l) {
    const rowY = (k: number) => 16 + k * 46;
    const cell = 22;
    const scene = (calls: number, active: number, freed: boolean) => {
      const nodes: SceneNode[] = [];
      let total = 0;
      for (let k = 0; k < calls; k++) {
        const n = 4 - k;
        const isActive = k === active;
        nodes.push(
          box(`c${n}`, 12, rowY(k), seg('quadratic_recur(', [String(n), 'ok', true], ')'), {
            w: 182,
            h: 32,
            size: 13,
            tone: isActive ? (n === 0 ? 'warn' : 'accent') : 'idle',
            ring: isActive,
            dim: freed,
          }),
        );
        if (k > 0) nodes.push(arrow(`d${k}`, [103, rowY(k - 1) + 33], [103, rowY(k) - 2], { dim: freed }));
        for (let i = 0; i < n; i++) nodes.push(box(`m${n}-${i}`, 210 + i * (cell + 3), rowY(k) + 5, '', { w: cell, h: cell, tone: freed ? 'ghost' : 'info', dashed: freed }));
        total += n;
      }
      const parts = Array.from({ length: Math.min(calls, 4) }, (_, k) => 4 - k);
      nodes.push(
        chip('mem', W / 2, 252, seg(`${parts.join(' + ')} = `, [String(freed ? 10 : total), 'info', true], ...(calls >= 5 ? [[' = n(n + 1)/2  →  ', undefined], ['O(n²)', 'warn', true]] as [string, Tone?, boolean?][] : [])), {
          size: 13,
        }),
      );
      return { w: W, h: 290, nodes };
    };
    const frames: SceneFrame[] = [];
    let total = 0;
    for (let k = 0; k < 4; k++) {
      const n = 4 - k;
      total += n;
      frames.push({ kind: 'alloc', scene: scene(k + 1, k, false), say: fmt(QUAD_SAY.alloc[l], { n, m: n - 1, total }) });
    }
    frames.push({ kind: 'base', scene: scene(5, 4, false), say: QUAD_SAY.base[l] });
    frames.push({ kind: 'ret', scene: scene(5, 0, true), say: QUAD_SAY.ret[l] });
    return { frames };
  },
};

export const SPACE_FIGURES: Record<string, Figure> = {
  space_types: spaceTypes,
  space_complexity_common_types: growthChart(AXIS.memory),
  space_complexity_recursive_linear: recursiveLinear,
  space_complexity_recursive_quadratic: recursiveQuadratic,
  space_complexity_exponential: doublingTree('space'),
};
