import itJavaEn from '@codes-en/java/chapter_computational_complexity/iteration.java?raw';
import reJavaEn from '@codes-en/java/chapter_computational_complexity/recursion.java?raw';
import itPyEn from '@codes-en/python/chapter_computational_complexity/iteration.py?raw';
import rePyEn from '@codes-en/python/chapter_computational_complexity/recursion.py?raw';
import itJavaJa from '@codes-ja/java/chapter_computational_complexity/iteration.java?raw';
import reJavaJa from '@codes-ja/java/chapter_computational_complexity/recursion.java?raw';
import itPyJa from '@codes-ja/python/chapter_computational_complexity/iteration.py?raw';
import rePyJa from '@codes-ja/python/chapter_computational_complexity/recursion.py?raw';
import itJavaRu from '@codes-ru/java/chapter_computational_complexity/iteration.java?raw';
import reJavaRu from '@codes-ru/java/chapter_computational_complexity/recursion.java?raw';
import itPyRu from '@codes-ru/python/chapter_computational_complexity/iteration.py?raw';
import rePyRu from '@codes-ru/python/chapter_computational_complexity/recursion.py?raw';
import itJavaZh from '@codes-zh/java/chapter_computational_complexity/iteration.java?raw';
import reJavaZh from '@codes-zh/java/chapter_computational_complexity/recursion.java?raw';
import itPyZh from '@codes-zh/python/chapter_computational_complexity/iteration.py?raw';
import rePyZh from '@codes-zh/python/chapter_computational_complexity/recursion.py?raw';
import itJavaZhHant from '@codes-zh-hant/java/chapter_computational_complexity/iteration.java?raw';
import reJavaZhHant from '@codes-zh-hant/java/chapter_computational_complexity/recursion.java?raw';
import itPyZhHant from '@codes-zh-hant/python/chapter_computational_complexity/iteration.py?raw';
import rePyZhHant from '@codes-zh-hant/python/chapter_computational_complexity/recursion.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, binarySlots, box, brace, chip, diamond, link, region, seg, text } from '../kit';
import type { BoxNode, Figure, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

const ITER_PY = raw(itPyEn, itPyZh, itPyZhHant, itPyJa, itPyRu);
const ITER_JAVA = raw(itJavaEn, itJavaZh, itJavaZhHant, itJavaJa, itJavaRu);
const REC_PY = raw(rePyEn, rePyZh, rePyZhHant, rePyJa, rePyRu);
const REC_JAVA = raw(reJavaEn, reJavaZh, reJavaZhHant, reJavaJa, reJavaRu);

const W = 440;

const WORD: Record<'begin' | 'end' | 'loop' | 'outer' | 'inner' | 'call' | 'ret' | 'base' | 'depth', T> = {
  begin: { en: 'Begin', zh: '开始', 'zh-hant': '開始', ja: '開始', ru: 'Начало' },
  end: { en: 'End', zh: '结束', 'zh-hant': '結束', ja: '終了', ru: 'Конец' },
  loop: { en: 'loop', zh: '循环', 'zh-hant': '迴圈', ja: 'ループ', ru: 'цикл' },
  outer: { en: 'outer loop', zh: '外循环', 'zh-hant': '外迴圈', ja: '外側のループ', ru: 'внешний цикл' },
  inner: { en: 'inner loop', zh: '内循环', 'zh-hant': '內迴圈', ja: '内側のループ', ru: 'внутренний цикл' },
  call: { en: 'Call', zh: '递', 'zh-hant': '遞', ja: '呼び出し', ru: 'Вызов' },
  ret: { en: 'Return', zh: '归', 'zh-hant': '歸', ja: '戻り', ru: 'Возврат' },
  base: { en: 'base case', zh: '终止条件', 'zh-hant': '終止條件', ja: '終了条件', ru: 'базовый случай' },
  depth: { en: 'recursion depth', zh: '递归深度', 'zh-hant': '遞迴深度', ja: '再帰の深さ', ru: 'глубина рекурсии' },
};

/** `name = value` pairs in a chip, the current values highlighted. */
const varsChip = (pairs: [string, string | number, boolean?][], x = 8, y = 8) =>
  chip(
    'vars',
    x,
    y,
    seg(...pairs.flatMap(([k, v, hot], i) => [`${i ? '   ' : ''}${k} = `, [String(v), hot ? 'accent' : 'info', true] as [string, Tone, boolean]])),
    { align: 'start', size: 13 },
  );

/** A flowchart step box; the running one is raised and accented. */
const step = (id: string, x: number, y: number, w: number, h: number, label: Rich, tone: Tone, active: boolean, sans = false): BoxNode =>
  box(id, x, y, label, { w, h, size: 13, sans, tone: active ? 'accent' : tone, ring: active });

// ── for loop ──────────────────────────────────────────────────────────

const LOOP_SAY: Record<'begin' | 'init' | 'yes' | 'no' | 'task' | 'update' | 'end', T> = {
  begin: {
    en: 'for_loop(3) adds 1 + 2 + 3 with a for loop. res starts at 0.',
    zh: 'for_loop(3) 用 for 循环计算 1 + 2 + 3，res 初始为 0。',
    'zh-hant': 'for_loop(3) 用 for 迴圈計算 1 + 2 + 3，res 初始為 0。',
    ja: 'for_loop(3) は for ループで 1 + 2 + 3 を計算します。res は 0 から始まります。',
    ru: 'for_loop(3) складывает 1 + 2 + 3 циклом for. res начинается с 0.',
  },
  init: {
    en: 'Initialization: i = 1.',
    zh: '初始化：i = 1。',
    'zh-hant': '初始化：i = 1。',
    ja: '初期化：i = 1。',
    ru: 'Инициализация: i = 1.',
  },
  yes: {
    en: 'Check i ≤ n: {i} ≤ 3 is true, so run the loop body.',
    zh: '判断 i ≤ n：{i} ≤ 3 成立，执行循环体。',
    'zh-hant': '判斷 i ≤ n：{i} ≤ 3 成立，執行迴圈體。',
    ja: 'i ≤ n を確認：{i} ≤ 3 は真なので、ループ本体を実行します。',
    ru: 'Проверка i ≤ n: {i} ≤ 3 — истина, выполняем тело цикла.',
  },
  no: {
    en: 'Check i ≤ n: 4 ≤ 3 is false, so the loop stops.',
    zh: '判断 i ≤ n：4 ≤ 3 不成立，循环结束。',
    'zh-hant': '判斷 i ≤ n：4 ≤ 3 不成立，迴圈結束。',
    ja: 'i ≤ n を確認：4 ≤ 3 は偽なので、ループを終えます。',
    ru: 'Проверка i ≤ n: 4 ≤ 3 — ложь, цикл завершается.',
  },
  task: {
    en: 'Body: res += i, so res = {res}.',
    zh: '循环体：res += i，res = {res}。',
    'zh-hant': '迴圈體：res += i，res = {res}。',
    ja: '本体：res += i で res = {res}。',
    ru: 'Тело: res += i, теперь res = {res}.',
  },
  update: {
    en: 'Update: i += 1, so i = {i}. Back to the condition.',
    zh: '更新：i += 1，i = {i}。回到条件判断。',
    'zh-hant': '更新：i += 1，i = {i}。回到條件判斷。',
    ja: '更新：i += 1 で i = {i}。条件の確認に戻ります。',
    ru: 'Обновление: i += 1, теперь i = {i}. Возвращаемся к условию.',
  },
  end: {
    en: 'Return res = 6. The body ran exactly n = 3 times, so the number of operations grows with n.',
    zh: '返回 res = 6。循环体恰好执行了 n = 3 次，操作次数随 n 增长。',
    'zh-hant': '回傳 res = 6。迴圈體恰好執行了 n = 3 次，操作次數隨 n 增長。',
    ja: 'res = 6 を返します。本体はちょうど n = 3 回実行され、操作回数は n に比例して増えます。',
    ru: 'Возвращаем res = 6. Тело выполнилось ровно n = 3 раз: число операций растёт вместе с n.',
  },
};

const iteration: StepFigure = {
  type: 'steps',
  call: 'for_loop(3)',
  tones: { begin: 'idle', init: 'idle', cond: 'cmp', task: 'done', update: 'swp', end: 'done' },
  sources: funcSources(ITER_PY, ITER_JAVA, ['for_loop'], {
    python: {
      begin: ['def for_loop('],
      init: ['for i in range(1, n + 1)'],
      cond: ['for i in range(1, n + 1)'],
      update: ['for i in range(1, n + 1)'],
      task: ['res += i'],
      end: ['return res'],
    },
    java: {
      begin: ['int forLoop('],
      init: ['for (int i = 1; i <= n; i++)'],
      cond: ['for (int i = 1; i <= n; i++)'],
      update: ['for (int i = 1; i <= n; i++)'],
      task: ['res += i;'],
      end: ['return res;'],
    },
  }),
  build(l) {
    const cx = 250;
    const scene = (active: string, i: number | null, res: number, hot: 'i' | 'res' | null) => {
      const nodes: SceneNode[] = [
        region('loop', 100, 50, 256, 256, { tone: 'info', label: WORD.loop[l], labelAt: 'inside' }),
        step('begin', cx - 40, 8, 80, 28, WORD.begin[l], 'muted', active === 'begin', true),
        step('init', cx - 50, 64, 100, 32, 'i = 1', 'info', active === 'init'),
        diamond('cond', cx, 150, 116, 52, 'i ≤ n', active === 'cond' ? 'accent' : 'info'),
        step('task', cx - 50, 212, 100, 32, 'res += i', 'ok', active === 'task'),
        step('update', 112, 212, 80, 32, 'i += 1', 'info', active === 'update'),
        step('end', cx - 40, 330, 80, 28, WORD.end[l], 'muted', active === 'end', true),
        arrow('a:begin', [cx, 37], [cx, 62]),
        arrow('a:init', [cx, 97], [cx, 122]),
        arrow('a:yes', [cx, 177], [cx, 210]),
        text('l:yes', cx + 8, 198, 'true', { mono: true, size: 11, tone: 'ok' }),
        arrow('a:task', [cx - 51, 228], [194, 228]),
        arrow('a:back', [152, 211], [cx - 2, 112], { via: [[152, 112]] }),
        arrow('a:no', [cx + 59, 150], [cx, 328], { via: [[340, 150], [340, 318], [cx, 318]] }),
        text('l:no', cx + 64, 142, 'false', { mono: true, size: 11, tone: 'danger' }),
        varsChip([
          ['n', 3],
          ['i', i ?? '–', hot === 'i'],
          ['res', res, hot === 'res'],
        ]),
      ];
      return { w: W, h: 366, nodes };
    };
    const S = LOOP_SAY;
    const frames: SceneFrame[] = [
      { kind: 'begin', scene: scene('begin', null, 0, null), say: S.begin[l] },
      { kind: 'init', scene: scene('init', 1, 0, 'i'), say: S.init[l] },
    ];
    let res = 0;
    for (let i = 1; i <= 3; i++) {
      frames.push({ kind: 'cond', scene: scene('cond', i, res, null), say: fmt(S.yes[l], { i }) });
      res += i;
      frames.push({ kind: 'task', scene: scene('task', i, res, 'res'), say: fmt(S.task[l], { res }) });
      frames.push({ kind: 'update', scene: scene('update', i + 1, res, 'i'), say: fmt(S.update[l], { i: i + 1 }) });
    }
    frames.push({ kind: 'cond', scene: scene('cond', 4, res, null), say: S.no[l] });
    frames.push({ kind: 'end', scene: scene('end', 4, res, 'res'), say: S.end[l] });
    return { frames };
  },
};

// ── Nested for loop ───────────────────────────────────────────────────

const NESTED_SAY: Record<'begin' | 'init_i' | 'yes_i' | 'no_i' | 'init_j' | 'yes_j' | 'no_j' | 'task' | 'upd_j' | 'upd_i' | 'end', T> = {
  begin: {
    en: 'nested_for_loop(2) records every pair (i, j) with 1 ≤ i, j ≤ 2.',
    zh: 'nested_for_loop(2) 记录所有满足 1 ≤ i, j ≤ 2 的数对 (i, j)。',
    'zh-hant': 'nested_for_loop(2) 記錄所有滿足 1 ≤ i, j ≤ 2 的數對 (i, j)。',
    ja: 'nested_for_loop(2) は 1 ≤ i, j ≤ 2 のすべての組 (i, j) を記録します。',
    ru: 'nested_for_loop(2) записывает все пары (i, j), где 1 ≤ i, j ≤ 2.',
  },
  init_i: { en: 'Outer loop starts: i = 1.', zh: '外循环开始：i = 1。', 'zh-hant': '外迴圈開始：i = 1。', ja: '外側のループ開始：i = 1。', ru: 'Начало внешнего цикла: i = 1.' },
  yes_i: {
    en: 'i ≤ n: {i} ≤ 2, so enter the inner loop.',
    zh: 'i ≤ n：{i} ≤ 2 成立，进入内循环。',
    'zh-hant': 'i ≤ n：{i} ≤ 2 成立，進入內迴圈。',
    ja: 'i ≤ n：{i} ≤ 2 なので内側のループへ。',
    ru: 'i ≤ n: {i} ≤ 2, заходим во внутренний цикл.',
  },
  no_i: {
    en: 'i ≤ n: 3 ≤ 2 is false, so the outer loop ends.',
    zh: 'i ≤ n：3 ≤ 2 不成立，外循环结束。',
    'zh-hant': 'i ≤ n：3 ≤ 2 不成立，外迴圈結束。',
    ja: 'i ≤ n：3 ≤ 2 は偽なので外側のループを終えます。',
    ru: 'i ≤ n: 3 ≤ 2 — ложь, внешний цикл завершается.',
  },
  init_j: { en: 'Inner loop starts again: j = 1.', zh: '内循环重新开始：j = 1。', 'zh-hant': '內迴圈重新開始：j = 1。', ja: '内側のループを最初から：j = 1。', ru: 'Внутренний цикл начинается заново: j = 1.' },
  yes_j: {
    en: 'j ≤ n: {j} ≤ 2, so run the body.',
    zh: 'j ≤ n：{j} ≤ 2 成立，执行循环体。',
    'zh-hant': 'j ≤ n：{j} ≤ 2 成立，執行迴圈體。',
    ja: 'j ≤ n：{j} ≤ 2 なので本体を実行。',
    ru: 'j ≤ n: {j} ≤ 2, выполняем тело.',
  },
  no_j: {
    en: 'j ≤ n: 3 ≤ 2 is false, so the inner loop is done for i = {i}.',
    zh: 'j ≤ n：3 ≤ 2 不成立，i = {i} 时的内循环结束。',
    'zh-hant': 'j ≤ n：3 ≤ 2 不成立，i = {i} 時的內迴圈結束。',
    ja: 'j ≤ n：3 ≤ 2 は偽なので、i = {i} の内側のループは終わりです。',
    ru: 'j ≤ n: 3 ≤ 2 — ложь, внутренний цикл для i = {i} закончен.',
  },
  task: {
    en: 'Record ({i}, {j}). That is pair number {k} of n² = 4.',
    zh: '记录 ({i}, {j})，这是 n² = 4 个数对中的第 {k} 个。',
    'zh-hant': '記錄 ({i}, {j})，這是 n² = 4 個數對中的第 {k} 個。',
    ja: '({i}, {j}) を記録。n² = 4 組のうち {k} 組目です。',
    ru: 'Записываем ({i}, {j}) — пара номер {k} из n² = 4.',
  },
  upd_j: { en: 'j += 1, so j = {j}.', zh: 'j += 1，j = {j}。', 'zh-hant': 'j += 1，j = {j}。', ja: 'j += 1 で j = {j}。', ru: 'j += 1, теперь j = {j}.' },
  upd_i: { en: 'i += 1, so i = {i}.', zh: 'i += 1，i = {i}。', 'zh-hant': 'i += 1，i = {i}。', ja: 'i += 1 で i = {i}。', ru: 'i += 1, теперь i = {i}.' },
  end: {
    en: 'Done: (1, 1), (1, 2), (2, 1), (2, 2). For each of the n values of i, the inner loop runs n times: n² operations.',
    zh: '完成：(1, 1), (1, 2), (2, 1), (2, 2)。i 的每个取值都让内循环执行 n 次，共 n² 次操作。',
    'zh-hant': '完成：(1, 1), (1, 2), (2, 1), (2, 2)。i 的每個取值都讓內迴圈執行 n 次，共 n² 次操作。',
    ja: '完了：(1, 1), (1, 2), (2, 1), (2, 2)。i の n 通りの値ごとに内側が n 回回るので、操作は n² 回です。',
    ru: 'Готово: (1, 1), (1, 2), (2, 1), (2, 2). Для каждого из n значений i внутренний цикл делает n шагов: всего n² операций.',
  },
};

const nestedIteration: StepFigure = {
  type: 'steps',
  call: 'nested_for_loop(2)',
  tones: { begin: 'idle', init_i: 'idle', cond_i: 'cmp', init_j: 'idle', cond_j: 'cmp', task: 'done', upd_j: 'swp', upd_i: 'swp', end: 'done' },
  sources: funcSources(ITER_PY, ITER_JAVA, ['nested_for_loop'], {
    python: {
      begin: ['def nested_for_loop('],
      init_i: ['for i in range(1, n + 1)'],
      cond_i: ['for i in range(1, n + 1)'],
      upd_i: ['for i in range(1, n + 1)'],
      init_j: ['for j in range(1, n + 1)'],
      cond_j: ['for j in range(1, n + 1)'],
      upd_j: ['for j in range(1, n + 1)'],
      task: ['res += f"({i}, {j}), "'],
      end: ['return res'],
    },
    java: {
      begin: ['String nestedForLoop('],
      init_i: ['for (int i = 1; i <= n; i++)'],
      cond_i: ['for (int i = 1; i <= n; i++)'],
      upd_i: ['for (int i = 1; i <= n; i++)'],
      init_j: ['for (int j = 1; j <= n; j++)'],
      cond_j: ['for (int j = 1; j <= n; j++)'],
      upd_j: ['for (int j = 1; j <= n; j++)'],
      task: ['res.append('],
      end: ['return res.toString();'],
    },
  }),
  build(l) {
    const cx = 250;
    const scene = (active: string, i: number | null, j: number | null, hot: 'i' | 'j' | null) => ({
      w: W,
      h: 448,
      nodes: [
        region('outer', 86, 44, 322, 354, { tone: 'accent', label: WORD.outer[l], labelAt: 'inside' }),
        region('inner', 100, 160, 220, 226, { tone: 'info', label: WORD.inner[l], labelAt: 'inside' }),
        step('begin', cx - 40, 6, 80, 28, WORD.begin[l], 'muted', active === 'begin', true),
        step('init_i', cx - 50, 58, 100, 30, 'i = 1', 'info', active === 'init_i'),
        diamond('cond_i', cx, 124, 110, 46, 'i ≤ n', active === 'cond_i' ? 'accent' : 'info'),
        step('init_j', cx - 50, 192, 100, 30, 'j = 1', 'info', active === 'init_j'),
        diamond('cond_j', cx, 260, 110, 46, 'j ≤ n', active === 'cond_j' ? 'accent' : 'info'),
        step('task', cx - 50, 322, 100, 30, '(i, j)', 'ok', active === 'task'),
        step('upd_j', 110, 322, 72, 30, 'j += 1', 'info', active === 'upd_j'),
        step('upd_i', 332, 245, 66, 30, 'i += 1', 'info', active === 'upd_i'),
        step('end', cx - 40, 414, 80, 28, WORD.end[l], 'muted', active === 'end', true),
        arrow('a:begin', [cx, 35], [cx, 56]),
        arrow('a:init_i', [cx, 89], [cx, 100]),
        arrow('a:yes_i', [cx, 148], [cx, 190]),
        text('l:yes_i', cx + 8, 172, 'true', { mono: true, size: 11, tone: 'ok' }),
        arrow('a:init_j', [cx, 223], [cx, 236]),
        arrow('a:yes_j', [cx, 284], [cx, 320]),
        text('l:yes_j', cx + 8, 306, 'true', { mono: true, size: 11, tone: 'ok' }),
        arrow('a:task', [cx - 51, 337], [184, 337]),
        arrow('a:back_j', [146, 321], [cx - 2, 230], { via: [[146, 230]] }),
        arrow('a:no_j', [cx + 56, 260], [330, 260]),
        text('l:no_j', cx + 58, 252, 'false', { mono: true, size: 11, tone: 'danger' }),
        arrow('a:back_i', [365, 244], [cx + 2, 94], { via: [[365, 94]] }),
        arrow('a:no_i', [cx - 56, 124], [cx, 412], { via: [[76, 124], [76, 404], [cx, 404]] }),
        text('l:no_i', cx - 60, 116, 'false', { anchor: 'end', mono: true, size: 11, tone: 'danger' }),
        varsChip([
          ['n', 2],
          ['i', i ?? '–', hot === 'i'],
          ['j', j ?? '–', hot === 'j'],
        ]),
      ],
    });
    const S = NESTED_SAY;
    const frames: SceneFrame[] = [
      { kind: 'begin', scene: scene('begin', null, null, null), say: S.begin[l] },
      { kind: 'init_i', scene: scene('init_i', 1, null, 'i'), say: S.init_i[l] },
    ];
    let k = 0;
    for (let i = 1; i <= 2; i++) {
      frames.push({ kind: 'cond_i', scene: scene('cond_i', i, null, null), say: fmt(S.yes_i[l], { i }) });
      frames.push({ kind: 'init_j', scene: scene('init_j', i, 1, 'j'), say: S.init_j[l] });
      for (let j = 1; j <= 2; j++) {
        frames.push({ kind: 'cond_j', scene: scene('cond_j', i, j, null), say: fmt(S.yes_j[l], { j }) });
        frames.push({ kind: 'task', scene: scene('task', i, j, null), say: fmt(S.task[l], { i, j, k: ++k }) });
        frames.push({ kind: 'upd_j', scene: scene('upd_j', i, j + 1, 'j'), say: fmt(S.upd_j[l], { j: j + 1 }) });
      }
      frames.push({ kind: 'cond_j', scene: scene('cond_j', i, 3, null), say: fmt(S.no_j[l], { i }) });
      frames.push({ kind: 'upd_i', scene: scene('upd_i', i + 1, 3, 'i'), say: fmt(S.upd_i[l], { i: i + 1 }) });
    }
    frames.push({ kind: 'cond_i', scene: scene('cond_i', 3, 3, null), say: S.no_i[l] });
    frames.push({ kind: 'end', scene: scene('end', 3, 3, null), say: S.end[l] });
    return { frames };
  },
};

// ── Recursion: calls go down, returns come back up ────────────────────

const REC_SAY: Record<'call' | 'base' | 'ret' | 'done', T> = {
  call: {
    en: 'recur({n}): n is not 1, so it first needs recur({m}). This call waits for the answer.',
    zh: 'recur({n})：n 不等于 1，需要先计算 recur({m})，当前调用暂停等待。',
    'zh-hant': 'recur({n})：n 不等於 1，需要先計算 recur({m})，目前呼叫暫停等待。',
    ja: 'recur({n})：n は 1 ではないので、先に recur({m}) が必要です。この呼び出しは結果を待ちます。',
    ru: 'recur({n}): n не равно 1, сначала нужен recur({m}). Этот вызов ждёт ответа.',
  },
  base: {
    en: 'recur(1) hits the base case: it returns 1 without calling itself again.',
    zh: 'recur(1) 触发终止条件：直接返回 1，不再递归。',
    'zh-hant': 'recur(1) 觸發終止條件：直接回傳 1，不再遞迴。',
    ja: 'recur(1) は終了条件に当たり、自分を呼ばずに 1 を返します。',
    ru: 'recur(1) — базовый случай: возвращает 1, больше не вызывая себя.',
  },
  ret: {
    en: 'Back in recur({n}): return {n} + {sub} = {res}.',
    zh: '回到 recur({n})：返回 {n} + {sub} = {res}。',
    'zh-hant': '回到 recur({n})：回傳 {n} + {sub} = {res}。',
    ja: 'recur({n}) に戻り、{n} + {sub} = {res} を返します。',
    ru: 'Снова в recur({n}): возвращаем {n} + {sub} = {res}.',
  },
  done: {
    en: 'recur(4) returns 10 = 4 + 3 + 2 + 1. The sum is built on the way back up.',
    zh: 'recur(4) 返回 10 = 4 + 3 + 2 + 1。求和是在“归”的过程中完成的。',
    'zh-hant': 'recur(4) 回傳 10 = 4 + 3 + 2 + 1。求和是在「歸」的過程中完成的。',
    ja: 'recur(4) は 10 = 4 + 3 + 2 + 1 を返します。和は戻る途中で組み立てられます。',
    ru: 'recur(4) возвращает 10 = 4 + 3 + 2 + 1. Сумма собирается на обратном пути.',
  },
};

/** Call boxes stacked downwards and return lines beside them. */
function callScene(
  l: Locale,
  calls: { label: Rich; state: 'hidden' | 'active' | 'waiting' | 'done' | 'base' }[],
  returns: (Rich | null)[],
  opts: { rowY: (k: number) => number; boxW: number; h: number; retTone?: Tone },
) {
  const x = 30;
  const rx = 266;
  const nodes: SceneNode[] = [
    text('h:call', x + opts.boxW / 2, 18, WORD.call[l], { anchor: 'middle', size: 13, bold: true, tone: 'muted' }),
    text('h:ret', rx + 60, 18, WORD.ret[l], { anchor: 'middle', size: 13, bold: true, tone: 'muted' }),
  ];
  calls.forEach((c, k) => {
    if (c.state === 'hidden') return;
    const y = opts.rowY(k);
    const tone: Tone = c.state === 'active' ? 'accent' : c.state === 'base' ? 'warn' : c.state === 'done' ? 'ok' : 'idle';
    nodes.push(box(`c${k}`, x, y, c.label, { w: opts.boxW, h: 30, size: 13, tone, ring: c.state === 'active' || c.state === 'base', dim: c.state === 'done' }));
    if (k > 0) nodes.push(arrow(`d${k}`, [x + opts.boxW / 2, opts.rowY(k - 1) + 31], [x + opts.boxW / 2, y - 2]));
  });
  returns.forEach((r, k) => {
    if (r === null) return;
    const y = opts.rowY(k) + 20;
    nodes.push(text(`r${k}`, rx, y, r, { mono: true, size: 13, tone: opts.retTone }));
    if (k < returns.length - 1 && returns[k + 1] !== null) nodes.push(arrow(`u${k}`, [rx - 10, opts.rowY(k + 1) + 6], [rx - 10, opts.rowY(k) + 26], { tone: 'ok' }));
  });
  return { w: W, h: opts.h, nodes };
}

const recursionSum: StepFigure = {
  type: 'steps',
  call: 'recur(4)',
  tones: { call: 'cmp', base: 'swp', ret: 'done' },
  sources: funcSources(REC_PY, REC_JAVA, ['recur'], {
    python: { call: ['res = recur(n - 1)'], base: ['if n == 1:', 'return 1'], ret: ['return n + res'] },
    java: { call: ['int res = recur(n - 1);'], base: ['if (n == 1)', 'return 1;'], ret: ['return n + res;'] },
  }),
  build(l) {
    const ns = [4, 3, 2, 1];
    const rowY = (k: number) => 34 + k * 58;
    const opts = { rowY, boxW: 136, h: 270 };
    const sums = [10, 6, 3, 1];
    const retText = (k: number): Rich =>
      ns[k] === 1 ? seg('return ', ['1', 'ok', true]) : seg(`return ${ns[k]} + `, [String(sums[k + 1]), 'ok'], ' = ', [String(sums[k]), 'ok', true]);
    const frames: SceneFrame[] = [];
    const label = (n: number): Rich => seg('recur(', [String(n), 'ok', true], ')');
    for (let k = 0; k < 4; k++) {
      const base = ns[k] === 1;
      const calls = ns.map((n, c) => ({ label: label(n), state: (c > k ? 'hidden' : c === k ? (base ? 'base' : 'active') : 'waiting') as 'hidden' | 'active' | 'waiting' | 'base' }));
      const scene = callScene(l, calls, ns.map((_, c) => (base && c === 3 ? retText(3) : null)), opts);
      if (base) {
        scene.nodes.push(
          arrow('base', [168, rowY(3) + 15], [252, rowY(3) + 15], { tone: 'warn' }),
          text('base:l', 210, rowY(3) - 4, WORD.base[l], { anchor: 'middle', size: 11, bold: true, tone: 'warn' }),
        );
        frames.push({ kind: 'base', scene, say: REC_SAY.base[l] });
      } else {
        frames.push({ kind: 'call', scene, say: fmt(REC_SAY.call[l], { n: ns[k], m: ns[k] - 1 }) });
      }
    }
    for (let k = 2; k >= 0; k--) {
      const calls = ns.map((n, c) => ({ label: label(n), state: (c > k ? 'done' : c === k ? 'active' : 'waiting') as 'done' | 'active' | 'waiting' }));
      const returns = ns.map((_, c) => (c >= k ? retText(c) : null));
      frames.push({
        kind: 'ret',
        scene: callScene(l, calls, returns, opts),
        say: k === 0 ? REC_SAY.done[l] : fmt(REC_SAY.ret[l], { n: ns[k], sub: sums[k + 1], res: sums[k] }),
      });
    }
    return { frames };
  },
};

const recursionDepth: StaticFigure = {
  type: 'static',
  build(l) {
    const rows: Rich[] = [
      seg('recur(', ['n', 'ok', true], ')'),
      seg('recur(', ['n - 1', 'ok', true], ')'),
      '⋯',
      seg('recur(', ['2', 'ok', true], ')'),
      seg('recur(', ['1', 'ok', true], ')'),
    ];
    const x = 170;
    const rowY = (k: number) => 24 + k * 50;
    const nodes: SceneNode[] = [];
    rows.forEach((r, k) => {
      nodes.push(box(`c${k}`, x, rowY(k), r, { w: 140, h: 30, size: 13, tone: k === 4 ? 'warn' : 'idle', dashed: k === 2 }));
      if (k > 0) nodes.push(arrow(`d${k}`, [x + 70, rowY(k - 1) + 31], [x + 70, rowY(k) - 2]));
    });
    nodes.push(
      brace('br', rowY(0), rowY(4) + 30, x - 12, 'left'),
      text('depth', x - 40, rowY(2) + 8, WORD.depth[l], { anchor: 'end', size: 13, bold: true }),
      text('depth:n', x - 40, rowY(2) + 28, 'n', { anchor: 'end', mono: true, bold: true, size: 15, tone: 'ok' }),
      arrow('base', [x + 142, rowY(4) + 15], [x + 200, rowY(4) + 15], { tone: 'warn' }),
      text('base:l', x + 172, rowY(4) - 4, WORD.base[l], { anchor: 'middle', size: 11, bold: true, tone: 'warn' }),
      text('ret', x + 206, rowY(4) + 20, seg('return ', ['1', 'ok', true]), { mono: true, size: 13 }),
    );
    return {
      scene: { w: W, h: rowY(4) + 44, nodes },
      notes: [
        {
          en: 'Each call waits for the one below it, so n calls are open at the same time when the base case is reached.',
          zh: '每次调用都要等待下一层返回，因此触发终止条件时，同时存在 n 个尚未返回的调用。',
          'zh-hant': '每次呼叫都要等待下一層回傳，因此觸發終止條件時，同時存在 n 個尚未回傳的呼叫。',
          ja: '各呼び出しは下の呼び出しを待つので、終了条件に達した時点で n 個の呼び出しが同時に残っています。',
          ru: 'Каждый вызов ждёт нижний, поэтому к базовому случаю одновременно открыто n вызовов.',
        }[l],
      ],
    };
  },
};

const TAIL_SAY: Record<'call' | 'base' | 'ret', T> = {
  call: {
    en: 'tail_recur({n}, {res}): add n to res first, then call tail_recur({m}, {next}). Nothing is left to do after the call.',
    zh: 'tail_recur({n}, {res})：先把 n 加到 res 上，再调用 tail_recur({m}, {next})。调用之后不再有其他操作。',
    'zh-hant': 'tail_recur({n}, {res})：先把 n 加到 res 上，再呼叫 tail_recur({m}, {next})。呼叫之後不再有其他操作。',
    ja: 'tail_recur({n}, {res})：先に n を res に足してから tail_recur({m}, {next}) を呼びます。呼び出しの後にする仕事はありません。',
    ru: 'tail_recur({n}, {res}): сначала прибавляем n к res, затем вызываем tail_recur({m}, {next}). После вызова делать уже нечего.',
  },
  base: {
    en: 'tail_recur(0, 10): base case. The answer, 10, is already in res.',
    zh: 'tail_recur(0, 10)：触发终止条件，结果 10 已经在 res 中。',
    'zh-hant': 'tail_recur(0, 10)：觸發終止條件，結果 10 已經在 res 中。',
    ja: 'tail_recur(0, 10)：終了条件です。答えの 10 はすでに res に入っています。',
    ru: 'tail_recur(0, 10): базовый случай. Ответ 10 уже лежит в res.',
  },
  ret: {
    en: 'Every level just passes 10 back up unchanged: the sum was computed on the way down. That is tail recursion.',
    zh: '每一层只是把 10 原样向上传递：求和在“递”的过程中已经完成，这就是尾递归。',
    'zh-hant': '每一層只是把 10 原樣向上傳遞：求和在「遞」的過程中已經完成，這就是尾遞迴。',
    ja: 'どの段も 10 をそのまま上へ返すだけ。和は下りの途中で計算済みで、これが末尾再帰です。',
    ru: 'Каждый уровень просто передаёт 10 наверх без изменений: сумма посчитана по пути вниз. Это и есть хвостовая рекурсия.',
  },
};

const tailRecursion: StepFigure = {
  type: 'steps',
  call: 'tail_recur(4, 0)',
  tones: { call: 'cmp', base: 'swp', ret: 'done' },
  sources: funcSources(REC_PY, REC_JAVA, ['tail_recur'], {
    python: { call: ['return tail_recur(n - 1, res + n)'], base: ['if n == 0:', 'return res'], ret: ['return tail_recur(n - 1, res + n)'] },
    java: { call: ['return tailRecur(n - 1, res + n);'], base: ['if (n == 0)', 'return res;'], ret: ['return tailRecur(n - 1, res + n);'] },
  }),
  build(l) {
    const args: [number, number][] = [
      [4, 0],
      [3, 4],
      [2, 7],
      [1, 9],
      [0, 10],
    ];
    const rowY = (k: number) => 32 + k * 46;
    const opts = { rowY, boxW: 160, h: 268 };
    const label = ([n, r]: [number, number]): Rich => seg('tail_recur(', [String(n), 'ok', true], ', ', [String(r), 'info', true], ')');
    const frames: SceneFrame[] = [];
    for (let k = 0; k < 5; k++) {
      const calls = args.map((a, c) => ({ label: label(a), state: (c > k ? 'hidden' : c === k ? (k === 4 ? 'base' : 'active') : 'waiting') as 'hidden' | 'active' | 'waiting' | 'base' }));
      const returns = args.map((_, c) => (k === 4 && c === 4 ? seg('return ', ['10', 'ok', true]) : null));
      const scene = callScene(l, calls, returns, opts);
      if (k === 4) {
        scene.nodes.push(
          arrow('base', [194, rowY(4) + 15], [252, rowY(4) + 15], { tone: 'warn' }),
          text('base:l', 223, rowY(4) - 4, WORD.base[l], { anchor: 'middle', size: 11, bold: true, tone: 'warn' }),
        );
        frames.push({ kind: 'base', scene, say: TAIL_SAY.base[l] });
      } else {
        const [n, r] = args[k];
        frames.push({ kind: 'call', scene, say: fmt(TAIL_SAY.call[l], { n, res: r, m: n - 1, next: r + n }) });
      }
    }
    const calls = args.map((a, c) => ({ label: label(a), state: (c === 0 ? 'active' : 'done') as 'active' | 'done' }));
    const returns = args.map(() => seg('return ', ['10', 'ok', true]));
    frames.push({ kind: 'ret', scene: callScene(l, calls, returns, opts), say: TAIL_SAY.ret[l] });
    return { frames };
  },
};

// ── Fibonacci recursion tree ──────────────────────────────────────────

const TREE_SAY: Record<'level' | 'more', T> = {
  level: {
    en: 'Level {k}: each call f(m) makes two calls, f(m − 1) and f(m − 2). This level has {count} calls.',
    zh: '第 {k} 层：每个 f(m) 都会调用 f(m − 1) 和 f(m − 2)，这一层共有 {count} 个调用。',
    'zh-hant': '第 {k} 層：每個 f(m) 都會呼叫 f(m − 1) 和 f(m − 2)，這一層共有 {count} 個呼叫。',
    ja: '{k} 段目：各 f(m) は f(m − 1) と f(m − 2) の 2 回の呼び出しを行います。この段には {count} 個の呼び出しがあります。',
    ru: 'Уровень {k}: каждый f(m) вызывает f(m − 1) и f(m − 2). На этом уровне {count} вызовов.',
  },
  more: {
    en: 'The calls keep doubling until the base cases f(1) and f(2), so the recursion forms a tree. Note how f(n − 3) and f(n − 4) are computed again and again.',
    zh: '调用数量不断翻倍，直到 f(1) 和 f(2) 的终止条件，因此递归形成一棵树。注意 f(n − 3) 和 f(n − 4) 被重复计算了多次。',
    'zh-hant': '呼叫數量不斷翻倍，直到 f(1) 和 f(2) 的終止條件，因此遞迴形成一棵樹。注意 f(n − 3) 和 f(n − 4) 被重複計算了多次。',
    ja: '呼び出しは f(1) と f(2) の終了条件まで倍々に増え、再帰は木になります。f(n − 3) や f(n − 4) が何度も計算されている点に注目してください。',
    ru: 'Вызовы удваиваются вплоть до базовых случаев f(1) и f(2), и рекурсия образует дерево. Заметьте: f(n − 3) и f(n − 4) считаются снова и снова.',
  },
};

const recursionTree: StepFigure = {
  type: 'steps',
  call: 'fib(n)',
  tones: { level: 'cmp', more: 'done' },
  build(l) {
    const slots = binarySlots(4, 0, 460, 30, 60);
    // Each node is f(n − d): the left child adds 1, the right child adds 2.
    const offset: number[] = [];
    slots.forEach((s, k) => {
      if (s.level === 0) offset[k] = 0;
      else {
        const parent = (k - 1) >> 1;
        offset[k] = offset[parent] + (k % 2 === 1 ? 1 : 2);
      }
    });
    const boxes = slots.map((s, k) => box(`f${k}`, s.x - 27, s.y - 13, offset[k] === 0 ? 'f(n)' : `f(n-${offset[k]})`, { w: 54, h: 26, size: 11, tone: 'ok' }));
    const scene = (levels: number, more: boolean, hl: number) => {
      const nodes: SceneNode[] = [];
      slots.forEach((s, k) => {
        if (s.level >= levels) return;
        nodes.push({ ...boxes[k], tone: s.level === hl ? 'accent' : 'ok' });
        if (k > 0) nodes.push(link(`e${k}`, boxes[(k - 1) >> 1], boxes[k], { pad: 2 }));
      });
      if (more) {
        slots.filter((s) => s.level === 3).forEach((s, k) => nodes.push(text(`dots${k}`, s.x, 250, '⋯', { anchor: 'middle', size: 14, tone: 'muted' })));
      }
      return { w: 460, h: 262, nodes };
    };
    const frames: SceneFrame[] = [0, 1, 2, 3].map((k) => ({ kind: 'level', scene: scene(k + 1, false, k), say: fmt(TREE_SAY.level[l], { k, count: 2 ** k }) }));
    frames.push({ kind: 'more', scene: scene(4, true, -1), say: TREE_SAY.more[l] });
    return { frames };
  },
};

export const LOOP_FIGURES: Record<string, Figure> = {
  iteration,
  nested_iteration: nestedIteration,
  recursion_sum: recursionSum,
  recursion_sum_depth: recursionDepth,
  tail_recursion_sum: tailRecursion,
  recursion_tree: recursionTree,
};
