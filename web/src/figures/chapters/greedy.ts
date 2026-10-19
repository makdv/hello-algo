import ccgJavaEn from '@codes-en/java/chapter_greedy/coin_change_greedy.java?raw';
import fkJavaEn from '@codes-en/java/chapter_greedy/fractional_knapsack.java?raw';
import mcJavaEn from '@codes-en/java/chapter_greedy/max_capacity.java?raw';
import mpcJavaEn from '@codes-en/java/chapter_greedy/max_product_cutting.java?raw';
import ccgPyEn from '@codes-en/python/chapter_greedy/coin_change_greedy.py?raw';
import fkPyEn from '@codes-en/python/chapter_greedy/fractional_knapsack.py?raw';
import mcPyEn from '@codes-en/python/chapter_greedy/max_capacity.py?raw';
import mpcPyEn from '@codes-en/python/chapter_greedy/max_product_cutting.py?raw';
import ccgJavaJa from '@codes-ja/java/chapter_greedy/coin_change_greedy.java?raw';
import fkJavaJa from '@codes-ja/java/chapter_greedy/fractional_knapsack.java?raw';
import mcJavaJa from '@codes-ja/java/chapter_greedy/max_capacity.java?raw';
import mpcJavaJa from '@codes-ja/java/chapter_greedy/max_product_cutting.java?raw';
import ccgPyJa from '@codes-ja/python/chapter_greedy/coin_change_greedy.py?raw';
import fkPyJa from '@codes-ja/python/chapter_greedy/fractional_knapsack.py?raw';
import mcPyJa from '@codes-ja/python/chapter_greedy/max_capacity.py?raw';
import mpcPyJa from '@codes-ja/python/chapter_greedy/max_product_cutting.py?raw';
import ccgJavaRu from '@codes-ru/java/chapter_greedy/coin_change_greedy.java?raw';
import fkJavaRu from '@codes-ru/java/chapter_greedy/fractional_knapsack.java?raw';
import mcJavaRu from '@codes-ru/java/chapter_greedy/max_capacity.java?raw';
import mpcJavaRu from '@codes-ru/java/chapter_greedy/max_product_cutting.java?raw';
import ccgPyRu from '@codes-ru/python/chapter_greedy/coin_change_greedy.py?raw';
import fkPyRu from '@codes-ru/python/chapter_greedy/fractional_knapsack.py?raw';
import mcPyRu from '@codes-ru/python/chapter_greedy/max_capacity.py?raw';
import mpcPyRu from '@codes-ru/python/chapter_greedy/max_product_cutting.py?raw';
import ccgJavaZh from '@codes-zh/java/chapter_greedy/coin_change_greedy.java?raw';
import fkJavaZh from '@codes-zh/java/chapter_greedy/fractional_knapsack.java?raw';
import mcJavaZh from '@codes-zh/java/chapter_greedy/max_capacity.java?raw';
import mpcJavaZh from '@codes-zh/java/chapter_greedy/max_product_cutting.java?raw';
import ccgPyZh from '@codes-zh/python/chapter_greedy/coin_change_greedy.py?raw';
import fkPyZh from '@codes-zh/python/chapter_greedy/fractional_knapsack.py?raw';
import mcPyZh from '@codes-zh/python/chapter_greedy/max_capacity.py?raw';
import mpcPyZh from '@codes-zh/python/chapter_greedy/max_product_cutting.py?raw';
import ccgJavaZhHant from '@codes-zh-hant/java/chapter_greedy/coin_change_greedy.java?raw';
import fkJavaZhHant from '@codes-zh-hant/java/chapter_greedy/fractional_knapsack.java?raw';
import mcJavaZhHant from '@codes-zh-hant/java/chapter_greedy/max_capacity.java?raw';
import mpcJavaZhHant from '@codes-zh-hant/java/chapter_greedy/max_product_cutting.java?raw';
import ccgPyZhHant from '@codes-zh-hant/python/chapter_greedy/coin_change_greedy.py?raw';
import fkPyZhHant from '@codes-zh-hant/python/chapter_greedy/fractional_knapsack.py?raw';
import mcPyZhHant from '@codes-zh-hant/python/chapter_greedy/max_capacity.py?raw';
import mpcPyZhHant from '@codes-zh-hant/python/chapter_greedy/max_product_cutting.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, chip, link, region, seg, text, textWidth } from '../kit';
import type { BoxNode, Figure, LegendItem, PathNode, Rich, Scene, SceneFrame, SceneNode, Segment, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, sup, type T } from './shared';

/**
 * Chapter 15, greedy. Coins are circles sized by face value; knapsack items keep one color
 * each across the table, the knapsack and the area chart; the max capacity boards stand on a
 * height grid with the water between i and j; integer cuts are runs of unit cells.
 */

const W = 440;

const CCG_PY = raw(ccgPyEn, ccgPyZh, ccgPyZhHant, ccgPyJa, ccgPyRu);
const CCG_JAVA = raw(ccgJavaEn, ccgJavaZh, ccgJavaZhHant, ccgJavaJa, ccgJavaRu);
const FK_PY = raw(fkPyEn, fkPyZh, fkPyZhHant, fkPyJa, fkPyRu);
const FK_JAVA = raw(fkJavaEn, fkJavaZh, fkJavaZhHant, fkJavaJa, fkJavaRu);
const MC_PY = raw(mcPyEn, mcPyZh, mcPyZhHant, mcPyJa, mcPyRu);
const MC_JAVA = raw(mcJavaEn, mcJavaZh, mcJavaZhHant, mcJavaJa, mcJavaRu);
const MPC_PY = raw(mpcPyEn, mpcPyZh, mpcPyZhHant, mpcPyJa, mpcPyRu);
const MPC_JAVA = raw(mpcJavaEn, mpcJavaZh, mpcJavaZhHant, mpcJavaJa, mpcJavaRu);

/** Splits a localized string at `{name}` placeholders, so the filled-in parts can carry their own color. */
function rich(s: string, vars: Record<string, [string, Tone?, boolean?]>): Segment[] {
  const out: Segment[] = [];
  for (const part of s.split(/(\{\w+\})/)) {
    const m = /^\{(\w+)\}$/.exec(part);
    if (m && vars[m[1]]) {
      const [t, tone, bold] = vars[m[1]];
      out.push({ t, tone, bold });
    } else if (part) out.push({ t: part });
  }
  return out;
}

const path = (id: string, d: string, extra: Partial<PathNode> = {}): PathNode => ({ kind: 'path', id, d, ...extra });

// ── Coin change ───────────────────────────────────────────────────────

const COINS = [1, 5, 10, 20, 50, 100];
const AMT = 131;

/** One color per face value, shared by both coin figures. */
const COIN_TONE: Record<number, Tone> = { 1: 'danger', 5: 'warn', 10: 'info', 20: 'ok', 49: 'info', 50: 'accent', 100: 'accent' };

/** Larger face values are drawn as larger coins. */
const coinR = (v: number) => 11 + Math.round(Math.log10(v) * 3.5);

function coin(id: string, cx: number, cy: number, v: number, extra: Partial<BoxNode> = {}, r = coinR(v)) {
  return box(id, cx - r, cy - r, String(v), { w: r * 2, h: r * 2, shape: 'circle', size: v >= 100 ? 11 : 12, ...extra });
}

const COIN_COUNT: T = { en: '{n} coins', zh: '{n} 枚硬币', 'zh-hant': '{n} 枚硬幣', ja: '{n} 枚', ru: '{n} монет' };

/** "11 coins", with Russian plural forms. */
function coinCount(l: Locale, n: number) {
  if (l === 'en' && n === 1) return '1 coin';
  if (l === 'ru') {
    const m10 = n % 10;
    const m100 = n % 100;
    const word = m10 === 1 && m100 !== 11 ? 'монета' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'монеты' : 'монет';
    return `${n} ${word}`;
  }
  return fmt(COIN_COUNT[l], { n });
}

const CG_WORD: Record<'strategy', T> = {
  strategy: {
    en: 'Greedy: the largest coin ≤ the remaining amount',
    zh: '贪心：选择不大于剩余金额的最大硬币',
    'zh-hant': '貪婪：選擇不大於剩餘金額的最大硬幣',
    ja: '貪欲：残りの金額以下で最大の硬貨を選ぶ',
    ru: 'Жадно: самая крупная монета ≤ остатка',
  },
};

const CG_SAY: Record<'init' | 'scanAll' | 'scan' | 'pick' | 'done', T> = {
  init: {
    en: 'Make up amt = 131 with coins of 1, 5, 10, 20, 50 and 100, using as few coins as possible. Start from the largest coin.',
    zh: '用面值为 1、5、10、20、50、100 的硬币凑出 amt = 131，硬币数量越少越好。从面值最大的硬币开始。',
    'zh-hant': '用面值為 1、5、10、20、50、100 的硬幣湊出 amt = 131，硬幣數量越少越好。從面值最大的硬幣開始。',
    ja: '額面 1、5、10、20、50、100 の硬貨で、できるだけ少ない枚数で amt = 131 を作ります。最大額面の硬貨から始めます。',
    ru: 'Наберём amt = 131 монетами номиналом 1, 5, 10, 20, 50 и 100, используя как можно меньше монет. Начинаем с самой крупной монеты.',
  },
  scanAll: {
    en: 'No coin is larger than {r}, so the largest coin, {c}, is chosen.',
    zh: '所有硬币都不大于 {r}，因此选择最大的硬币 {c}。',
    'zh-hant': '所有硬幣都不大於 {r}，因此選擇最大的硬幣 {c}。',
    ja: '{r} を超える硬貨はないので、最大の硬貨 {c} を選びます。',
    ru: 'Ни одна монета не больше {r}, поэтому выбираем самую крупную — {c}.',
  },
  scan: {
    en: '{r} remains: coins larger than {r} ({b}) are skipped. The largest coin not exceeding it is {c}.',
    zh: '剩余 {r}：跳过大于 {r} 的硬币（{b}），不大于它的最大硬币是 {c}。',
    'zh-hant': '剩餘 {r}：跳過大於 {r} 的硬幣（{b}），不大於它的最大硬幣是 {c}。',
    ja: '残りは {r}：{r} より大きい硬貨（{b}）は飛ばします。{r} を超えない最大の硬貨は {c} です。',
    ru: 'Осталось {r}: монеты больше {r} ({b}) пропускаем. Самая крупная монета, не превышающая {r}, — {c}.',
  },
  pick: {
    en: 'Choose {c}: amt = {r} − {c} = {left}, count = {n}.',
    zh: '选择 {c}：amt = {r} − {c} = {left}，count = {n}。',
    'zh-hant': '選擇 {c}：amt = {r} − {c} = {left}，count = {n}。',
    ja: '{c} を選びます：amt = {r} − {c} = {left}、count = {n}。',
    ru: 'Берём {c}: amt = {r} − {c} = {left}, count = {n}.',
  },
  done: {
    en: 'amt is 0, so the loop ends: 131 = {sum}. The greedy algorithm returns count = {n}.',
    zh: 'amt 为 0，循环结束：131 = {sum}。贪心算法返回 count = {n}。',
    'zh-hant': 'amt 為 0，迴圈結束：131 = {sum}。貪婪演算法返回 count = {n}。',
    ja: 'amt が 0 になったのでループを終了します：131 = {sum}。貪欲法は count = {n} を返します。',
    ru: 'amt стал равен 0, цикл завершается: 131 = {sum}. Жадный алгоритм возвращает count = {n}.',
  },
};

const CG_AX = 28;
const CG_AW = 64;
const CG_AH = 32;
const cgRow = (k: number) => 84 + k * 52;
const cgCoinX = (idx: number) => 158 + idx * 50;

interface ChangeState {
  /** Remaining amount after each pick; the last one is the current row. */
  amounts: number[];
  /** Coin chosen in each row so far. */
  chosen: number[];
  /** The current row has been scanned: coins that are too large are faded. */
  scanned: boolean;
  count: number;
  done?: boolean;
}

function changeScene(l: Locale, s: ChangeState): Scene {
  const cur = s.amounts.length - 1;
  const nodes: SceneNode[] = [
    chip('strategy', W / 2, 6, CG_WORD.strategy[l], { sans: true, size: 13 }),
    text('h:amt', CG_AX + CG_AW / 2, 58, 'amt', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'accent' }),
    text('h:coins', (cgCoinX(0) + cgCoinX(5)) / 2, 58, 'coins', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
  ];
  const coinsAt = new Map<string, BoxNode>();
  s.amounts.forEach((a, k) => {
    const y = cgRow(k);
    const current = k === cur;
    nodes.push(
      box(`a${k}`, CG_AX, y - CG_AH / 2, a, { w: CG_AW, h: CG_AH, size: 15, tone: current ? (s.done ? 'ok' : 'accent') : 'muted', ring: current }),
    );
    if (k > 0) {
      const ax = CG_AX + CG_AW / 2;
      nodes.push(
        arrow(`a:${k}`, [ax, cgRow(k - 1) + CG_AH / 2 + 2], [ax, y - CG_AH / 2 - 2], { tone: 'muted', width: 1.5 }),
        text(`a:d${k}`, ax + 8, (cgRow(k - 1) + y) / 2 + 4, `−${s.chosen[k - 1]}`, { mono: true, bold: true, size: 11, tone: COIN_TONE[s.chosen[k - 1]] }),
      );
    }
    if (a === 0) return;
    COINS.forEach((v, idx) => {
      const id = `c${k}-${v}`;
      const pick = s.chosen[k];
      let look: Partial<BoxNode>;
      if (!current) look = v === pick ? { tone: COIN_TONE[v] } : { tone: 'idle', dim: true };
      else if (!s.scanned) look = { tone: 'idle' };
      else if (v === pick) look = { tone: COIN_TONE[v], ring: true };
      else look = v > a ? { tone: 'muted', dim: true } : { tone: 'idle' };
      const c = coin(id, cgCoinX(idx), y, v, look);
      coinsAt.set(id, c);
      nodes.push(c);
    });
  });
  // The path of choices: from each chosen coin to the next one.
  for (let k = 1; k < s.chosen.length; k++) {
    const a = coinsAt.get(`c${k - 1}-${s.chosen[k - 1]}`);
    const b = coinsAt.get(`c${k}-${s.chosen[k]}`);
    if (a && b) nodes.push(link(`go${k}`, a, b, { dashed: true, tone: 'muted', bend: 6, width: 1.5 }));
  }
  nodes.push(
    chip('count', W - 16, cgRow(4) - 14, seg('count = ', [String(s.count), s.done ? 'ok' : 'accent', true]), { align: 'end', size: 14, tone: s.done ? 'ok' : 'idle' }),
  );
  return { w: W, h: cgRow(4) + CG_AH / 2 + 10, nodes };
}

const coinChangeGreedyStrategy: StepFigure = {
  type: 'steps',
  call: 'coin_change_greedy(coins, 131)',
  tones: { init: 'idle', scan: 'cmp', pick: 'swp', done: 'done' },
  sources: funcSources(CCG_PY, CCG_JAVA, ['coin_change_greedy'], {
    python: {
      init: ['i = len(coins) - 1', 'count = 0'],
      scan: ['while i > 0 and coins[i] > amt:', 'i -= 1'],
      pick: ['amt -= coins[i]', 'count += 1'],
      done: ['return count if amt == 0 else -1'],
    },
    java: {
      init: ['int i = coins.length - 1;', 'int count = 0;'],
      scan: ['while (i > 0 && coins[i] > amt) {', 'i--;'],
      pick: ['amt -= coins[i];', 'count++;'],
      done: ['return amt == 0 ? count : -1;'],
    },
  }),
  build(l) {
    const S = CG_SAY;
    const amounts = [AMT];
    const chosen: number[] = [];
    let count = 0;
    const frames: SceneFrame[] = [{ kind: 'init', scene: changeScene(l, { amounts: [...amounts], chosen: [], scanned: false, count }), say: S.init[l] }];
    let amt = AMT;
    while (amt > 0) {
      const c = [...COINS].reverse().find((v) => v <= amt)!;
      chosen.push(c);
      const bigger = COINS.filter((v) => v > amt);
      frames.push({
        kind: 'scan',
        scene: changeScene(l, { amounts: [...amounts], chosen: [...chosen], scanned: true, count }),
        say: fmt(bigger.length ? S.scan[l] : S.scanAll[l], { r: amt, c, b: bigger.join(', ') }),
      });
      amt -= c;
      count++;
      amounts.push(amt);
      frames.push({
        kind: 'pick',
        scene: changeScene(l, { amounts: [...amounts], chosen: [...chosen], scanned: false, count }),
        say: fmt(S.pick[l], { r: amt + c, c, left: amt, n: count }),
      });
    }
    frames.push({
      kind: 'done',
      scene: changeScene(l, { amounts: [...amounts], chosen: [...chosen], scanned: false, count, done: true }),
      say: fmt(S.done[l], { sum: chosen.join(' + '), n: count }),
    });
    return { frames };
  },
};

// ── Coin change: where greedy fails ───────────────────────────────────

const VS_WORD: Record<'greedy' | 'optimum' | 'same' | 'note', T> = {
  greedy: { en: 'Greedy', zh: '贪心', 'zh-hant': '貪婪', ja: '貪欲法', ru: 'Жадно' },
  optimum: { en: 'Optimum', zh: '最优解', 'zh-hant': '最優解', ja: '最適解', ru: 'Оптимум' },
  same: { en: 'Greedy = optimum', zh: '贪心 = 最优解', 'zh-hant': '貪婪 = 最優解', ja: '貪欲法 = 最適解', ru: 'Жадно = оптимум' },
  note: {
    en: 'Greedy makes the locally optimal choice at each step. For coins [1, 5, 10, 20, 50, 100] this always gives the optimum; for [1, 20, 50] and [1, 49, 50] it does not, while dynamic programming finds the global optimum.',
    zh: '贪心算法在每一步都做出局部最优的选择。对于硬币组合 [1, 5, 10, 20, 50, 100]，它总能找到最优解；对于 [1, 20, 50] 和 [1, 49, 50] 则不能，而动态规划可以找到全局最优解。',
    'zh-hant': '貪婪演算法在每一步都做出區域性最優的選擇。對於硬幣組合 [1, 5, 10, 20, 50, 100]，它總能找到最優解；對於 [1, 20, 50] 和 [1, 49, 50] 則不能，而動態規劃可以找到全域性最優解。',
    ja: '貪欲法は各ステップで局所最適な選択をします。硬貨の組み合わせ [1, 5, 10, 20, 50, 100] では常に最適解が得られますが、[1, 20, 50] や [1, 49, 50] では得られません。動的計画法なら大域最適解を見つけられます。',
    ru: 'Жадный алгоритм на каждом шаге делает локально оптимальный выбор. Для монет [1, 5, 10, 20, 50, 100] это всегда даёт оптимум, а для [1, 20, 50] и [1, 49, 50] — нет; динамическое программирование находит глобальный оптимум.',
  },
};

interface ChangeCase {
  coins: number[];
  amt: number;
  /** Terms of the sum as [coin, how many]. */
  greedy: [number, number][];
  best: [number, number][];
}

const CASES: ChangeCase[] = [
  { coins: [1, 5, 10, 20, 50, 100], amt: 131, greedy: [[100, 1], [20, 1], [10, 1], [1, 1]], best: [[100, 1], [20, 1], [10, 1], [1, 1]] },
  { coins: [1, 20, 50], amt: 60, greedy: [[50, 1], [1, 10]], best: [[20, 3]] },
  { coins: [1, 49, 50], amt: 98, greedy: [[50, 1], [1, 48]], best: [[49, 2]] },
];

const countOf = (terms: [number, number][]) => terms.reduce((s, [, k]) => s + k, 0);

/** A sum of coins such as 50 + 1 × 10, drawn left to right from `x`. */
function coinExpr(prefix: string, x: number, cy: number, terms: [number, number][]) {
  const r = 13;
  const nodes: SceneNode[] = [];
  let cx = x;
  terms.forEach(([c, k], t) => {
    if (t > 0) {
      nodes.push(text(`${prefix}+${t}`, cx + 9, cy + 5, '+', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
      cx += 18;
    }
    nodes.push(coin(`${prefix}c${t}`, cx + r, cy, c, { tone: COIN_TONE[c], size: c >= 100 ? 11 : 12 }, r));
    cx += 2 * r;
    if (k > 1) {
      const label = `× ${k}`;
      nodes.push(text(`${prefix}k${t}`, cx + 6, cy + 5, label, { mono: true, size: 13 }));
      cx += 6 + textWidth(label, 13, true);
    }
  });
  return nodes;
}

const coinChangeGreedyVsDp: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes: SceneNode[] = [];
    // Coin sums start right of the widest row label.
    const EX = Math.max(140, ...(['greedy', 'optimum', 'same'] as const).map((k) => Math.ceil(26 + textWidth(VS_WORD[k][l], 13) * 1.12 + 14)));
    let y = 8;
    CASES.forEach((c, n) => {
      const same = n === 0;
      const h = same ? 64 : 92;
      nodes.push(
        region(`case${n}`, 12, y, W - 24, h, { tone: same ? 'ok' : 'danger' }),
        text(`t${n}`, 26, y + 21, seg(`coins = [${c.coins.join(', ')}]`, '   ', ['amt = ', 'muted'], [String(c.amt), 'accent', true]), { mono: true, size: 12 }),
      );
      const lines: { key: 'greedy' | 'optimum' | 'same'; terms: [number, number][]; tone: Tone }[] = same
        ? [{ key: 'same', terms: c.greedy, tone: 'ok' }]
        : [
            { key: 'greedy', terms: c.greedy, tone: 'danger' },
            { key: 'optimum', terms: c.best, tone: 'ok' },
          ];
      lines.forEach((ln, k) => {
        const cy = y + 46 + k * 30;
        nodes.push(
          text(`l${n}-${k}`, 26, cy + 5, VS_WORD[ln.key][l], { size: 13, bold: true, tone: ln.tone }),
          ...coinExpr(`e${n}-${k}:`, EX, cy, ln.terms),
          chip(`n${n}-${k}`, W - 24, cy - 14, coinCount(l, countOf(ln.terms)), { align: 'end', sans: true, size: 12, tone: ln.tone }),
        );
      });
      y += h + 12;
    });
    return { scene: { w: W, h: y - 4, nodes }, notes: [VS_WORD.note[l]] };
  },
};

// ── Fractional knapsack ───────────────────────────────────────────────

interface Item {
  i: number;
  w: number;
  v: number;
}

const ITEMS: Item[] = [
  { i: 1, w: 10, v: 50 },
  { i: 2, w: 20, v: 120 },
  { i: 3, w: 30, v: 150 },
  { i: 4, w: 40, v: 210 },
  { i: 5, w: 50, v: 240 },
];
const CAP = 50;
const itemOf = (i: number) => ITEMS[i - 1];
const unit = (it: Item) => it.v / it.w;
/** Sorted by unit value, high to low (a stable sort keeps 1 before 3). */
const BY_UNIT = [...ITEMS].sort((a, b) => unit(b) - unit(a)).map((it) => it.i);

/** Each item keeps its color in the table, the knapsack and the chart. */
const ITEM_TONE: Record<number, Tone> = { 1: 'danger', 2: 'warn', 3: 'accent', 4: 'ok', 5: 'info' };

type ColKey = 'i' | 'w' | 'v' | 'u';

interface Col {
  key: ColKey;
  x: number;
  w: number;
}

const cellText = (it: Item, key: ColKey) => String(key === 'i' ? it.i : key === 'w' ? it.w : key === 'v' ? it.v : unit(it));

const ROW_H = 30;
const ROW_STEP = 36;

/** Item rows in the given order; cells keep ids per item, so rows glide when the order changes. */
function itemRows(cols: Col[], order: number[], y0: number, look: (it: Item, key: ColKey) => Partial<BoxNode> = () => ({})) {
  return order.flatMap((i, k) => {
    const it = itemOf(i);
    return cols.map((c) =>
      box(`r${i}:${c.key}`, c.x, y0 + k * ROW_STEP, cellText(it, c.key), {
        w: c.w,
        h: ROW_H,
        size: 13,
        tone: c.key === 'i' ? ITEM_TONE[i] : 'idle',
        ...look(it, c.key),
      }),
    );
  });
}

const colCenter = (c: Col) => c.x + c.w / 2;

/** An open-topped knapsack outline. */
const bagPath = (id: string, x: number, top: number, w: number, bottom: number) =>
  arrow(id, [x, top], [x + w, top], { via: [[x, bottom], [x + w, bottom]], head: 'none', width: 2 });

const FK_WORD: Record<'item' | 'weight' | 'value' | 'putIn' | 'unit' | 'knapsack' | 'max' | 'added' | 'wIs' | 'example', T> = {
  item: { en: 'Item', zh: '物品', 'zh-hant': '物品', ja: '品物', ru: 'Предмет' },
  weight: { en: 'Weight', zh: '重量', 'zh-hant': '重量', ja: '重さ', ru: 'Вес' },
  value: { en: 'Value', zh: '价值', 'zh-hant': '價值', ja: '価値', ru: 'Ценность' },
  putIn: { en: 'Put in', zh: '放入重量', 'zh-hant': '放入重量', ja: '入れる重さ', ru: 'Кладём' },
  unit: { en: 'Unit value', zh: '单位价值', 'zh-hant': '單位價值', ja: '単位価値', ru: 'Уд. ценность' },
  knapsack: { en: 'Knapsack', zh: '背包', 'zh-hant': '背包', ja: 'ナップサック', ru: 'Рюкзак' },
  max: { en: 'Max value', zh: '最大价值', 'zh-hant': '最大價值', ja: '最大価値', ru: 'Макс. ценность' },
  added: { en: 'Value added', zh: '增加的价值', 'zh-hant': '增加的價值', ja: '増える価値', ru: 'Прирост ценности' },
  wIs: { en: 'w: weight put in', zh: 'w：放入的重量', 'zh-hant': 'w：放入的重量', ja: 'w：入れる重さ', ru: 'w — взятый вес' },
  example: { en: 'Item 4, w = 30:', zh: '物品 4，w = 30：', 'zh-hant': '物品 4，w = 30：', ja: '品物 4、w = 30：', ru: 'Предмет 4, w = 30:' },
};

const FK_NOTE: Record<'example' | 'unit', T> = {
  example: {
    en: 'A fraction of an item may be taken, with value in proportion to its weight. The best choice is all of item 2 plus 30 of item 4’s weight of 40, which fills the capacity of 50.',
    zh: '可以只选择物品的一部分，价值按重量比例计算。最优方案是放入整个物品 2，以及物品 4（重量 40）中重量为 30 的部分，恰好占满容量 50。',
    'zh-hant': '可以只選擇物品的一部分，價值按重量比例計算。最優方案是放入整個物品 2，以及物品 4（重量 40）中重量為 30 的部分，恰好佔滿容量 50。',
    ja: '品物の一部だけを選ぶこともでき、価値は重さの割合で計算します。最適解は品物 2 を丸ごと、品物 4（重さ 40）のうち重さ 30 の部分を入れるもので、容量 50 がちょうど埋まります。',
    ru: 'Можно взять часть предмета, а её ценность пропорциональна весу. Лучший вариант — весь предмет 2 и 30 из 40 единиц веса предмета 4: вместе они занимают всю вместимость 50.',
  },
  unit: {
    en: 'Unit value is the value per unit of weight, val[i-1] / wgt[i-1]. Putting weight w of item i into the knapsack adds w × val[i-1] / wgt[i-1] to the total value.',
    zh: '单位价值是物品在单位重量下的价值，即 val[i-1] / wgt[i-1]。将物品 i 中重量为 w 的部分放入背包，增加的价值为 w × val[i-1] / wgt[i-1]。',
    'zh-hant': '單位價值是物品在單位重量下的價值，即 val[i-1] / wgt[i-1]。將物品 i 中重量為 w 的部分放入背包，增加的價值為 w × val[i-1] / wgt[i-1]。',
    ja: '単位価値は単位重量あたりの価値 val[i-1] / wgt[i-1] です。品物 i のうち重さ w の部分をナップサックに入れると、価値は w × val[i-1] / wgt[i-1] だけ増えます。',
    ru: 'Удельная ценность — это ценность единицы веса, val[i-1] / wgt[i-1]. Если положить в рюкзак часть предмета i весом w, общая ценность вырастет на w × val[i-1] / wgt[i-1].',
  },
};

const fractionalKnapsackExample: StaticFigure = {
  type: 'static',
  build(l) {
    const cols: Col[] = [
      { key: 'i', x: 16, w: 30 },
      { key: 'w', x: 52, w: 64 },
      { key: 'v', x: 122, w: 64 },
    ];
    const TX = 198;
    const TW = 58;
    const y0 = 56;
    const rowY = (i: number) => y0 + (i - 1) * ROW_STEP;
    const taken: Record<number, number> = { 2: 20, 4: 30 };
    const heads: [number, string, string][] = [
      [colCenter(cols[0]), FK_WORD.item[l], 'i'],
      [colCenter(cols[1]), FK_WORD.weight[l], 'wgt[i-1]'],
      [colCenter(cols[2]), FK_WORD.value[l], 'val[i-1]'],
      [TX + TW / 2, FK_WORD.putIn[l], 'w'],
    ];
    const nodes: SceneNode[] = [];
    for (const i of [2, 4]) nodes.push(region(`band${i}`, 10, rowY(i) - 4, TX + TW + 6 - 10, ROW_H + 8, { tone: 'accent' }));
    heads.forEach(([x, h, code], k) => {
      nodes.push(
        text(`h${k}`, x, 22, h, { anchor: 'middle', size: 12, tone: 'muted', bold: true }),
        text(`hc${k}`, x, 44, code, { anchor: 'middle', mono: true, size: 12, bold: true }),
      );
    });
    nodes.push(...itemRows(cols, [1, 2, 3, 4, 5], y0));
    // The knapsack: item 2 on top, item 4 below, so the arrows do not cross.
    const BX = 304;
    const BW = 100;
    const top = 82;
    const bottom = rowY(5) + ROW_H;
    const u = (bottom - top - 4) / CAP;
    nodes.push(
      text('bag:t', BX + BW / 2, 28, FK_WORD.knapsack[l], { anchor: 'middle', size: 13, bold: true }),
      text('bag:c', BX + BW / 2, 52, seg('cap = ', [String(CAP), 'accent', true]), { anchor: 'middle', mono: true, size: 13 }),
      bagPath('bag', BX, top - 4, BW, bottom),
    );
    let segTop = top;
    for (const i of [2, 4]) {
      const h = taken[i] * u - 2;
      const label = taken[i] === itemOf(i).w ? String(taken[i]) : `${taken[i]} / ${itemOf(i).w}`;
      const s = box(`seg${i}`, BX + 4, segTop, label, { w: BW - 8, h, size: 13, tone: ITEM_TONE[i] });
      const t = box(`take${i}`, TX, rowY(i), String(taken[i]), { w: TW, h: ROW_H, size: 13, tone: ITEM_TONE[i], ring: true });
      nodes.push(s, t, link(`go${i}`, t, s, { tone: ITEM_TONE[i], width: 1.75 }));
      segTop += h + 2;
    }
    nodes.push(
      chip('max', W / 2, bottom + 16, seg([`${FK_WORD.max[l]} = `, 'muted'], '120 + (30 / 40) × 210 = ', ['277.5', 'ok', true]), { size: 13 }),
    );
    return { scene: { w: W, h: bottom + 52, nodes }, notes: [FK_NOTE.example[l]] };
  },
};

const fractionalKnapsackUnitValue: StaticFigure = {
  type: 'static',
  build(l) {
    const cols: Col[] = [
      { key: 'i', x: 12, w: 28 },
      { key: 'w', x: 46, w: 56 },
      { key: 'v', x: 108, w: 56 },
      { key: 'u', x: 170, w: 80 },
    ];
    const y0 = 66;
    const nodes: SceneNode[] = [];
    const heads = [FK_WORD.item[l], FK_WORD.weight[l], FK_WORD.value[l], FK_WORD.unit[l]];
    cols.forEach((c, k) => nodes.push(text(`h${k}`, colCenter(c), 14, heads[k], { anchor: 'middle', size: 11, bold: true, tone: k === 3 ? 'warn' : 'muted' })));
    nodes.push(
      text('hc0', colCenter(cols[0]), 46, 'i', { anchor: 'middle', mono: true, size: 12, bold: true }),
      text('hc1', colCenter(cols[1]), 46, 'wgt[i-1]', { anchor: 'middle', mono: true, size: 11, bold: true }),
      text('hc2', colCenter(cols[2]), 46, 'val[i-1]', { anchor: 'middle', mono: true, size: 11, bold: true }),
      text('hc3n', colCenter(cols[3]), 36, 'val[i-1]', { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'warn' }),
      path('hc3bar', `M ${cols[3].x + 2} 42 L ${cols[3].x + cols[3].w - 2} 42`, { tone: 'warn', width: 1.25 }),
      text('hc3d', colCenter(cols[3]), 56, 'wgt[i-1]', { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'warn' }),
      ...itemRows(cols, [1, 2, 3, 4, 5], y0, (it, key) => (key === 'u' ? { tone: 'warn', ring: it.i === 4 } : {})),
    );
    // The value added by a part of an item, with one worked example.
    const PX = 264;
    const PW = W - 12 - PX;
    const cx = PX + PW / 2;
    const bottom = y0 + 4 * ROW_STEP + ROW_H;
    nodes.push(
      region('panel', PX, y0, PW, bottom - y0, { tone: 'idle' }),
      text('p:t', cx, y0 + 24, FK_WORD.added[l], { anchor: 'middle', size: 13, bold: true }),
      text('p:w', cx - 22, y0 + 64, 'w ×', { anchor: 'end', mono: true, size: 13, bold: true }),
      text('p:n', cx + 14, y0 + 56, 'val[i-1]', { anchor: 'middle', mono: true, size: 12, tone: 'warn' }),
      path('p:bar', `M ${cx - 16} ${y0 + 61} L ${cx + 44} ${y0 + 61}`, { tone: 'warn', width: 1.25 }),
      text('p:d', cx + 14, y0 + 76, 'wgt[i-1]', { anchor: 'middle', mono: true, size: 12, tone: 'warn' }),
      text('p:wIs', cx, y0 + 102, FK_WORD.wIs[l], { anchor: 'middle', size: 12, tone: 'muted' }),
      text('p:ex', cx, y0 + 130, FK_WORD.example[l], { anchor: 'middle', size: 12, tone: 'muted' }),
      text('p:calc', cx, y0 + 154, seg('30 × ', ['5.25', 'warn', true], ' = ', ['157.5', 'ok', true]), { anchor: 'middle', mono: true, size: 13 }),
    );
    return { scene: { w: W, h: bottom + 8, nodes }, notes: [FK_NOTE.unit[l]] };
  },
};

const FKS_SAY: Record<'init' | 'sort' | 'whole' | 'part' | 'done', T> = {
  init: {
    en: 'Five items and a knapsack of capacity cap = 50. Build the item list: each item has a weight w and a value v.',
    zh: '共有 5 个物品，背包容量 cap = 50。创建物品列表，每个物品包含重量 w 和价值 v。',
    'zh-hant': '共有 5 個物品，背包容量 cap = 50。建立物品串列，每個物品包含重量 w 和價值 v。',
    ja: '品物は 5 個、ナップサックの容量は cap = 50 です。品物リストを作ります。各品物は重さ w と価値 v を持ちます。',
    ru: 'Есть пять предметов и рюкзак вместимостью cap = 50. Создаём список предметов: у каждого есть вес w и ценность v.',
  },
  sort: {
    en: 'Sort the items by unit value v / w from high to low: items 2, 4, 1, 3, 5.',
    zh: '按照单位价值 v / w 从高到低排序：物品 2、4、1、3、5。',
    'zh-hant': '按照單位價值 v / w 從高到低排序：物品 2、4、1、3、5。',
    ja: '単位価値 v / w の高い順に並べ替えます：品物 2、4、1、3、5。',
    ru: 'Сортируем предметы по удельной ценности v / w по убыванию: 2, 4, 1, 3, 5.',
  },
  whole: {
    en: 'Item {i} weighs {w} ≤ cap = {cap}: put the whole item in. res = {res}, cap = {left}.',
    zh: '物品 {i} 的重量 {w} ≤ cap = {cap}：将整个物品放入背包。res = {res}，cap = {left}。',
    'zh-hant': '物品 {i} 的重量 {w} ≤ cap = {cap}：將整個物品放入背包。res = {res}，cap = {left}。',
    ja: '品物 {i} の重さ {w} ≤ cap = {cap}：品物を丸ごと入れます。res = {res}、cap = {left}。',
    ru: 'Предмет {i} весит {w} ≤ cap = {cap}: кладём его целиком. res = {res}, cap = {left}.',
  },
  part: {
    en: 'Item {i} weighs {w} > cap = {cap}: put in only weight {cap} of it, worth {u} × {cap} = {add}. res = {res}.',
    zh: '物品 {i} 的重量 {w} > cap = {cap}：只放入其中重量为 {cap} 的部分，价值 {u} × {cap} = {add}。res = {res}。',
    'zh-hant': '物品 {i} 的重量 {w} > cap = {cap}：只放入其中重量為 {cap} 的部分，價值 {u} × {cap} = {add}。res = {res}。',
    ja: '品物 {i} の重さ {w} > cap = {cap}：そのうち重さ {cap} の部分だけを入れます。価値は {u} × {cap} = {add}。res = {res}。',
    ru: 'Предмет {i} весит {w} > cap = {cap}: кладём только его часть весом {cap}, ценностью {u} × {cap} = {add}. res = {res}.',
  },
  done: {
    en: 'The knapsack is full, so the loop breaks; the remaining items are not needed. The maximum value is {res}.',
    zh: '背包已满，跳出循环，其余物品无须考虑。最大价值为 {res}。',
    'zh-hant': '背包已滿，跳出迴圈，其餘物品無須考慮。最大價值為 {res}。',
    ja: 'ナップサックが満杯になったのでループを抜けます。残りの品物は不要です。最大価値は {res} です。',
    ru: 'Рюкзак заполнен, цикл прерывается; остальные предметы не нужны. Максимальная ценность равна {res}.',
  },
};

interface KnapState {
  order: number[];
  /** Weight taken from each item so far, in the order taken. */
  taken: [number, number][];
  cur?: number;
  sorted?: boolean;
  cap: number;
  res: number;
  done?: boolean;
}

const FKS_COLS: Col[] = [
  { key: 'i', x: 12, w: 30 },
  { key: 'w', x: 48, w: 46 },
  { key: 'v', x: 100, w: 50 },
  { key: 'u', x: 156, w: 50 },
];

function knapScene(s: KnapState): Scene {
  const y0 = 62;
  const rowY = (i: number) => y0 + s.order.indexOf(i) * ROW_STEP;
  const nodes: SceneNode[] = [];
  const heads = ['i', 'w', 'v', 'v / w'];
  FKS_COLS.forEach((c, k) => nodes.push(text(`h${k}`, colCenter(c), 50, heads[k], { anchor: 'middle', mono: true, bold: true, size: 13, tone: k === 3 && s.sorted ? 'warn' : 'muted' })));
  if (s.cur !== undefined) nodes.push(region('cur', 6, rowY(s.cur) - 4, 206, ROW_H + 8, { tone: 'accent' }));
  const takenSet = new Map(s.taken);
  nodes.push(
    ...itemRows(FKS_COLS, s.order, y0, (it, key) => {
      if (key === 'u' && s.sorted) return { tone: 'warn' };
      if (key !== 'i' && takenSet.has(it.i)) return { tone: 'ok' };
      if (s.done && !takenSet.has(it.i)) return { dim: true };
      return {};
    }),
  );
  if (s.sorted && !s.taken.length) {
    nodes.push(arrow('sortArrow', [222, y0 + 4 * ROW_STEP + ROW_H], [222, y0 + 2], { tone: 'warn', width: 2 }));
  }
  // The knapsack fills from the bottom, 3 units of height per unit of weight.
  const BX = 318;
  const BW = 100;
  const bottom = y0 + 4 * ROW_STEP + ROW_H;
  const top = bottom - CAP * 3 - 4;
  nodes.push(bagPath('bag', BX, top, BW, bottom));
  let segBottom = bottom - 2;
  for (const [i, w] of s.taken) {
    const h = w * 3 - 2;
    const it = itemOf(i);
    const label = w === it.w ? String(w) : `${w} / ${it.w}`;
    const sg = box(`seg${i}`, BX + 4, segBottom - h, label, { w: BW - 8, h, size: 13, tone: ITEM_TONE[i] });
    nodes.push(sg);
    if (i === s.cur) {
      nodes.push(arrow(`go${i}`, [214, rowY(i) + ROW_H / 2], [BX + 1, segBottom - h / 2], { tone: ITEM_TONE[i], width: 1.75, bend: -4 }));
    }
    segBottom -= h + 2;
  }
  nodes.push(
    chip('cap', W - 12, 8, seg('cap = ', [String(s.cap), 'accent', true]), { align: 'end', size: 13 }),
    chip('res', W - 12 - 104, 8, seg('res = ', [String(s.res), s.done ? 'ok' : 'idle', true]), { align: 'end', size: 13, tone: s.done ? 'ok' : 'idle' }),
  );
  return { w: W, h: bottom + 10, nodes };
}

const fractionalKnapsackGreedyStrategy: StepFigure = {
  type: 'steps',
  call: 'fractional_knapsack(wgt, val, 50)',
  tones: { init: 'idle', sort: 'cmp', whole: 'swp', part: 'swp', done: 'done' },
  sources: funcSources(FK_PY, FK_JAVA, ['fractional_knapsack'], {
    python: {
      init: ['items = [Item(w, v) for w, v in zip(wgt, val)]'],
      sort: ['items.sort(key=lambda item: item.v / item.w, reverse=True)'],
      whole: ['if item.w <= cap:', 'res += item.v', 'cap -= item.w'],
      part: ['else:', 'res += (item.v / item.w) * cap'],
      done: ['break', 'return res'],
    },
    java: {
      init: ['Item[] items = new Item[wgt.length];', 'items[i] = new Item(wgt[i], val[i]);'],
      sort: ['Arrays.sort(items, Comparator.comparingDouble(item -> -((double) item.v / item.w)));'],
      whole: ['if (item.w <= cap) {', 'res += item.v;', 'cap -= item.w;'],
      part: ['} else {', 'res += (double) item.v / item.w * cap;'],
      done: ['break;', 'return res;'],
    },
  }),
  build(l) {
    const S = FKS_SAY;
    const orig = ITEMS.map((it) => it.i);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: knapScene({ order: orig, taken: [], cap: CAP, res: 0 }), say: S.init[l] },
      { kind: 'sort', scene: knapScene({ order: BY_UNIT, taken: [], sorted: true, cap: CAP, res: 0 }), say: S.sort[l] },
    ];
    let cap = CAP;
    let res = 0;
    const taken: [number, number][] = [];
    for (const i of BY_UNIT) {
      const it = itemOf(i);
      if (it.w <= cap) {
        res += it.v;
        cap -= it.w;
        taken.push([i, it.w]);
        frames.push({
          kind: 'whole',
          scene: knapScene({ order: BY_UNIT, taken: [...taken], cur: i, sorted: true, cap, res }),
          say: fmt(S.whole[l], { i, w: it.w, cap: cap + it.w, res, left: cap }),
        });
      } else {
        const add = unit(it) * cap;
        res += add;
        taken.push([i, cap]);
        frames.push({
          kind: 'part',
          scene: knapScene({ order: BY_UNIT, taken: [...taken], cur: i, sorted: true, cap, res }),
          say: fmt(S.part[l], { i, w: it.w, cap, u: unit(it), add, res }),
        });
        break;
      }
    }
    frames.push({ kind: 'done', scene: knapScene({ order: BY_UNIT, taken: [...taken], sorted: true, cap, res, done: true }), say: fmt(S.done[l], { res }) });
    return { frames };
  },
};

// ── Fractional knapsack as an area ────────────────────────────────────

const AREA_WORD: Record<'x' | 'y', T> = {
  x: { en: 'Weight', zh: '物品重量', 'zh-hant': '物品重量', ja: '重さ', ru: 'Вес' },
  y: { en: 'Unit value', zh: '物品单位价值', 'zh-hant': '物品單位價值', ja: '単位価値', ru: 'Удельная ценность' },
};

const AREA_SAY: Record<'bars' | 'window' | 'sort' | 'why', T> = {
  bars: {
    en: 'Draw each item as a bar: its width is the weight and its height the unit value, so its area is the item’s value.',
    zh: '把每个物品画成一个矩形：宽度为重量，高度为单位价值，因此面积就是物品的价值。',
    'zh-hant': '把每個物品畫成一個矩形：寬度為重量，高度為單位價值，因此面積就是物品的價值。',
    ja: '各品物を長方形で表します：幅は重さ、高さは単位価値なので、面積が品物の価値になります。',
    ru: 'Изобразим каждый предмет прямоугольником: ширина — вес, высота — удельная ценность, поэтому площадь равна ценности предмета.',
  },
  window: {
    en: 'The knapsack holds weight 50, so the total value is the area over the first 50 units of the axis. In the original order it is {expr}.',
    zh: '背包容量为 50，因此总价值就是横轴前 50 个单位上方的面积。按原始顺序，面积为 {expr}。',
    'zh-hant': '背包容量為 50，因此總價值就是橫軸前 50 個單位上方的面積。按原始順序，面積為 {expr}。',
    ja: '容量は 50 なので、総価値は横軸の最初の 50 単位の上の面積です。元の順序では {expr} です。',
    ru: 'В рюкзак помещается вес 50, поэтому общая ценность — площадь над первыми 50 единицами оси. В исходном порядке она равна {expr}.',
  },
  sort: {
    en: 'Sort the bars by unit value from high to low. The same 50 units now enclose {expr}.',
    zh: '将矩形按单位价值从高到低排序。同样的 50 个单位现在围成的面积为 {expr}。',
    'zh-hant': '將矩形按單位價值從高到低排序。同樣的 50 個單位現在圍成的面積為 {expr}。',
    ja: '長方形を単位価値の高い順に並べ替えます。同じ 50 単位で囲まれる面積は {expr} になります。',
    ru: 'Отсортируем прямоугольники по убыванию удельной ценности. Те же 50 единиц теперь покрывают {expr}.',
  },
  why: {
    en: 'The first 50 units now hold the tallest bars, so no other choice of weight 50 encloses more area: 277.5 is the maximum value. This is why the greedy strategy works.',
    zh: '此时前 50 个单位上都是最高的矩形，任何其他选法围成的面积都不会更大：277.5 就是最大价值。这就是贪心策略有效的原因。',
    'zh-hant': '此時前 50 個單位上都是最高的矩形，任何其他選法圍成的面積都不會更大：277.5 就是最大價值。這就是貪婪策略有效的原因。',
    ja: '最初の 50 単位には最も高い長方形が並ぶので、ほかのどの選び方でも面積はこれ以上大きくなりません：277.5 が最大価値です。これが貪欲戦略が有効な理由です。',
    ru: 'Теперь над первыми 50 единицами стоят самые высокие прямоугольники, и никакой другой выбор веса 50 не даёт большей площади: 277.5 — максимальная ценность. Поэтому жадная стратегия корректна.',
  },
};

/** Area within the first `CAP` units for items laid out in `order`, as a sum and its terms. */
function windowArea(order: number[]) {
  let start = 0;
  let total = 0;
  const terms: string[] = [];
  for (const i of order) {
    const it = itemOf(i);
    const inside = Math.max(0, Math.min(it.w, CAP - start));
    if (inside > 0) {
      total += inside * unit(it);
      terms.push(`${inside}×${unit(it)}`);
    }
    start += it.w;
  }
  return { total, expr: `${terms.join(' + ')} = ${total}` };
}

function areaScene(l: Locale, order: number[], showWindow: boolean, why: boolean): Scene {
  const X0 = 44;
  const BASE = 196;
  const PW = 372;
  const sx = PW / 150;
  const sy = 21;
  const nodes: SceneNode[] = [
    arrow('ax', [X0, BASE], [X0 + PW + 16, BASE], { tone: 'muted', width: 1.25 }),
    arrow('ay', [X0, BASE], [X0, 26], { tone: 'muted', width: 1.25 }),
    text('ayl', X0 - 6, 16, AREA_WORD.y[l], { size: 12, tone: 'muted' }),
    text('axl', W - 4, BASE + 18, AREA_WORD.x[l], { anchor: 'end', size: 12, tone: 'muted' }),
  ];
  let start = 0;
  for (const i of order) {
    const it = itemOf(i);
    const u = unit(it);
    const x = X0 + 1 + start * sx;
    const h = u * sy;
    const inside = showWindow ? Math.max(0, Math.min(it.w, CAP - start)) : it.w;
    const outside = it.w - inside;
    const tone = ITEM_TONE[i];
    if (inside > 0) nodes.push(box(`in${i}`, x, BASE - h, String(i), { w: inside * sx - 1, h, size: 12, tone }));
    if (outside > 0) nodes.push(box(`out${i}`, x + inside * sx, BASE - h, inside > 0 ? '' : String(i), { w: outside * sx - 1, h, size: 12, tone, dim: true }));
    nodes.push(
      text(`u${i}`, x + (it.w * sx) / 2, BASE - h - 6, String(u), { anchor: 'middle', mono: true, bold: true, size: 11, tone }),
      text(`w${i}`, x + (it.w * sx) / 2, BASE + 16, String(it.w), { anchor: 'middle', mono: true, size: 11, tone }),
    );
    start += it.w;
  }
  if (showWindow) {
    const cx = X0 + CAP * sx;
    const { expr } = windowArea(order);
    nodes.push(
      path('cap', `M ${cx} ${BASE + 4} L ${cx} 40`, { tone: 'accent', width: 2, dashed: true }),
      brace('capBrace', X0, cx, BASE + 24, 'down', 'accent'),
      text('capL', (X0 + cx) / 2, BASE + 54, seg('cap = ', ['50', 'accent', true]), { anchor: 'middle', mono: true, size: 13 }),
      chip('area', W - 8, 10, seg(expr.split(' = ')[0] + ' = ', [expr.split(' = ')[1], why ? 'ok' : 'accent', true]), { align: 'end', size: 12, tone: why ? 'ok' : 'idle' }),
    );
  }
  return { w: W, h: BASE + 64, nodes };
}

const fractionalKnapsackAreaChart: StepFigure = {
  type: 'steps',
  tones: { bars: 'idle', window: 'cmp', sort: 'swp', done: 'done' },
  build(l) {
    const orig = ITEMS.map((it) => it.i);
    return {
      frames: [
        { kind: 'bars', scene: areaScene(l, orig, false, false), say: AREA_SAY.bars[l] },
        { kind: 'window', scene: areaScene(l, orig, true, false), say: fmt(AREA_SAY.window[l], { expr: windowArea(orig).expr }) },
        { kind: 'sort', scene: areaScene(l, BY_UNIT, true, false), say: fmt(AREA_SAY.sort[l], { expr: windowArea(BY_UNIT).expr }) },
        { kind: 'done', scene: areaScene(l, BY_UNIT, true, true), say: AREA_SAY.why[l] },
      ],
    };
  },
};

// ── Max capacity ──────────────────────────────────────────────────────

const HT = [3, 8, 5, 2, 7, 7, 3, 4];
const capOf = (i: number, j: number) => Math.min(HT[i], HT[j]) * (j - i);

/** Board k stands at bx(k); one unit of height is UH. */
const MC_X0 = 92;
const MC_STEP = 44;
const MC_BASE = 210;
const UH = 20;
const bx = (k: number) => MC_X0 + k * MC_STEP;
const levelY = (v: number) => MC_BASE - v * UH;

const TONE_I: Tone = 'accent';
const TONE_J: Tone = 'warn';

interface BoardsState {
  i?: number;
  j?: number;
  /** The container between two boards, filled with water. */
  water?: [number, number];
  waterTone?: Tone;
  /** The previous container, as a dashed outline. */
  old?: [number, number];
  /** A pointer that moves (or has just moved) from one board to the next. */
  hop?: { from: number; to: number; tone: Tone };
  /** Label both pointers on one board, when they meet. */
  meet?: boolean;
}

function waterPath(a: number, b: number) {
  const top = levelY(Math.min(HT[a], HT[b]));
  return `M ${bx(a)} ${MC_BASE} L ${bx(a)} ${top} L ${bx(b)} ${top} L ${bx(b)} ${MC_BASE} Z`;
}

/** The boards on a height grid, with pointers, water and index labels. */
function boards(s: BoardsState): SceneNode[] {
  const left = MC_X0 - 16;
  const right = bx(HT.length - 1) + 14;
  const level = s.water ? Math.min(HT[s.water[0]], HT[s.water[1]]) : -1;
  const grid = Array.from({ length: 8 }, (_, k) => `M ${left} ${levelY(k + 1)} L ${right} ${levelY(k + 1)}`).join(' ');
  const nodes: SceneNode[] = [path('grid', grid, { tone: 'ghost', width: 0.75, dashed: true }), path('axis', `M ${left} ${MC_BASE} L ${right} ${MC_BASE}`, { tone: 'muted', width: 1.5 })];
  for (let v = 0; v <= 8; v++) {
    const on = v === level;
    nodes.push(text(`y${v}`, left - 8, levelY(v) + 4, String(v), { anchor: 'end', mono: true, size: 11, bold: on, tone: on ? 'info' : 'muted' }));
  }
  if (s.water) nodes.push(path('water', waterPath(...s.water), { tone: s.waterTone ?? 'info', fill: true, width: 1.5 }));
  if (s.old) {
    // The container before the move, outlined over the water.
    const [a, b] = s.old;
    const top = levelY(Math.min(HT[a], HT[b]));
    nodes.push(arrow('old', [bx(a), MC_BASE], [bx(b), MC_BASE], { via: [[bx(a), top], [bx(b), top]], head: 'none', dashed: true, width: 1.5 }));
  }
  const toneOf = (k: number): Tone | undefined => (k === s.i ? TONE_I : k === s.j ? TONE_J : s.water?.includes(k) ? s.waterTone : undefined);
  HT.forEach((h, k) => {
    const tone = toneOf(k);
    nodes.push(
      arrow(`b${k}`, [bx(k), MC_BASE], [bx(k), levelY(h)], { head: 'none', width: tone ? 5 : 3.5, tone }),
      text(`x${k}`, bx(k), MC_BASE + 20, String(k), { anchor: 'middle', mono: true, size: 12, bold: tone !== undefined, tone: tone ?? 'muted' }),
    );
  });
  const ptr = (id: string, k: number, label: string, tone: Tone) => {
    const top = levelY(HT[k]);
    nodes.push(
      arrow(`${id}:a`, [bx(k), top - 18], [bx(k), top - 3], { tone, width: 1.5 }),
      text(id, bx(k), top - 22, label, { anchor: 'middle', mono: true, bold: true, size: 13, tone }),
    );
  };
  if (s.meet && s.i !== undefined) ptr('p:i', s.i, 'i = j', TONE_I);
  else {
    if (s.i !== undefined) ptr('p:i', s.i, 'i', TONE_I);
    if (s.j !== undefined) ptr('p:j', s.j, 'j', TONE_J);
  }
  if (s.hop) {
    const y = MC_BASE + 30;
    nodes.push(arrow('hop', [bx(s.hop.from), y], [bx(s.hop.to), y], { tone: s.hop.tone, width: 2, bend: s.hop.to > s.hop.from ? 7 : -7, dashed: true }));
  }
  return nodes;
}

/** cap = min(3, 4) × (7 − 0) = 21, with i's numbers in i's color and j's in j's. */
function capExpr(i: number, j: number, tail: Segment[] = []): Segment[] {
  return [
    ...seg('cap = min(', [String(HT[i]), TONE_I, true], ', ', [String(HT[j]), TONE_J, true], ') × (', [String(j), TONE_J, true], ' − ', [String(i), TONE_I, true], ') = ', [String(capOf(i, j)), undefined, true]),
    ...tail,
  ];
}

const MC_WORD: Record<'max' | 'roles' | 'short' | 'long', T> = {
  max: { en: 'Maximum capacity is {expr}', zh: '最大容量为 {expr}', 'zh-hant': '最大容量為 {expr}', ja: '最大容量は {expr}', ru: 'Максимальная вместимость: {expr}' },
  roles: {
    en: '{i} is the shorter board, {j} is the longer board',
    zh: '{i} 为短板，{j} 为长板',
    'zh-hant': '{i} 為短板，{j} 為長板',
    ja: '{i} が短い板、{j} が長い板',
    ru: '{i} — короткая перегородка, {j} — длинная',
  },
  short: {
    en: 'Moving the shorter board inward may increase capacity',
    zh: '向内移动短板，容量可能变大',
    'zh-hant': '向內移動短板，容量可能變大',
    ja: '短い板を内側へ動かすと、容量は大きくなりうる',
    ru: 'Сдвиг короткой перегородки может увеличить вместимость',
  },
  long: {
    en: 'Moving the longer board inward always decreases capacity',
    zh: '向内移动长板，容量一定变小',
    'zh-hant': '向內移動長板，容量一定變小',
    ja: '長い板を内側へ動かすと、容量は必ず小さくなる',
    ru: 'Сдвиг длинной перегородки всегда уменьшает вместимость',
  },
};

const MC_NOTE: Record<'example' | 'initial' | 'short' | 'long', T> = {
  example: {
    en: 'Any two boards form a container. Its height is set by the shorter board and its width is the difference of the indices: cap[i, j] = min(ht[i], ht[j]) × (j − i).',
    zh: '任意两个隔板都可以组成一个容器。高度由短板决定，宽度是两个隔板的索引之差：cap[i, j] = min(ht[i], ht[j]) × (j − i)。',
    'zh-hant': '任意兩個隔板都可以組成一個容器。高度由短板決定，寬度是兩個隔板的索引之差：cap[i, j] = min(ht[i], ht[j]) × (j − i)。',
    ja: '任意の 2 枚の仕切り板で容器ができます。高さは短い板で決まり、幅はインデックスの差です：cap[i, j] = min(ht[i], ht[j]) × (j − i)。',
    ru: 'Любые две перегородки образуют контейнер. Его высота задаётся короткой перегородкой, а ширина — разностью индексов: cap[i, j] = min(ht[i], ht[j]) × (j − i).',
  },
  initial: {
    en: 'Take a state [i, j] with i < j and ht[i] < ht[j]: i is the shorter board and j the longer board.',
    zh: '选取一个状态 [i, j]，满足 i < j 且 ht[i] < ht[j]，即 i 为短板、j 为长板。',
    'zh-hant': '選取一個狀態 [i, j]，滿足 i < j 且 ht[i] < ht[j]，即 i 為短板、j 為長板。',
    ja: 'i < j かつ ht[i] < ht[j] を満たす状態 [i, j] を考えます。i が短い板、j が長い板です。',
    ru: 'Возьмём состояние [i, j], где i < j и ht[i] < ht[j]: i — короткая перегородка, j — длинная.',
  },
  short: {
    en: 'The width shrinks by 1, but the height may grow, because the board i moves onto can be taller. Here the capacity rises from 21 to 24.',
    zh: '宽度减小 1，但高度可能变大，因为移动后的短板可能更长。此处容量从 21 增大到 24。',
    'zh-hant': '寬度減小 1，但高度可能變大，因為移動後的短板可能更長。此處容量從 21 增大到 24。',
    ja: '幅は 1 減りますが、移動先の板のほうが高ければ高さは大きくなります。ここでは容量が 21 から 24 に増えます。',
    ru: 'Ширина уменьшается на 1, но высота может вырасти: новая перегородка может оказаться выше. Здесь вместимость растёт с 21 до 24.',
  },
  long: {
    en: 'The width shrinks, and the height can only stay the same or drop, since the shorter board i still limits it. Here the capacity falls from 21 to 18.',
    zh: '宽度一定变小，而高度由短板决定，只可能不变或变小。此处容量从 21 减小到 18。',
    'zh-hant': '寬度一定變小，而高度由短板決定，只可能不變或變小。此處容量從 21 減小到 18。',
    ja: '幅は必ず小さくなり、高さは短い板で決まるので、変わらないか小さくなるだけです。ここでは容量が 21 から 18 に減ります。',
    ru: 'Ширина уменьшается, а высота, ограниченная короткой перегородкой, может лишь остаться прежней или уменьшиться. Здесь вместимость падает с 21 до 18.',
  },
};

const MC_H = 322;

/** Two chips under the chart: a sentence and a formula. */
function mcChips(line1: Rich | null, line2: Segment[], tone2: Tone = 'idle', code1 = false): SceneNode[] {
  const nodes: SceneNode[] = [];
  if (line1) nodes.push(chip('l1', W / 2, MC_BASE + 50, line1, code1 ? { size: 13 } : { sans: true, size: 12 }));
  nodes.push(chip('l2', W / 2, MC_BASE + (line1 ? 84 : 66), line2, { size: 13, tone: tone2 }));
  return nodes;
}

const maxCapacityExample: StaticFigure = {
  type: 'static',
  build(l) {
    const i = 1;
    const j = 5;
    const nodes: SceneNode[] = [
      ...boards({ i, j, water: [i, j] }),
      brace('width', bx(i), bx(j), MC_BASE + 28, 'down', 'muted'),
      text('widthL', (bx(i) + bx(j)) / 2, MC_BASE + 58, seg(['j', TONE_J, true], ' − ', ['i', TONE_I, true], ' = 4'), { anchor: 'middle', mono: true, size: 12 }),
      chip(
        'max',
        W / 2,
        MC_BASE + 72,
        rich(MC_WORD.max[l], { expr: ['(5 − 1) × 7 = 28', undefined, true] }).map((s) => (s.bold ? { ...s, tone: 'ok' as Tone } : s)),
        { sans: true, size: 13 },
      ),
    ];
    return { scene: { w: W, h: MC_H - 10, nodes }, notes: [MC_NOTE.example[l]] };
  },
};

const roles = (l: Locale) => rich(MC_WORD.roles[l], { i: ['i', TONE_I, true], j: ['j', TONE_J, true] });

const maxCapacityInitialState: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = [...boards({ i: 0, j: 7, water: [0, 7] }), ...mcChips(roles(l), capExpr(0, 7))];
    return { scene: { w: W, h: MC_H, nodes }, notes: [MC_NOTE.initial[l]] };
  },
};

const maxCapacityMovingShortBoard: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = [
      ...boards({ i: 1, j: 7, water: [1, 7], old: [0, 7], hop: { from: 0, to: 1, tone: TONE_I } }),
      ...mcChips(MC_WORD.short[l], capExpr(1, 7, seg(' > ', ['21', 'muted'])), 'ok'),
    ];
    return { scene: { w: W, h: MC_H, nodes }, notes: [MC_NOTE.short[l]] };
  },
};

const maxCapacityMovingLongBoard: StaticFigure = {
  type: 'static',
  build(l) {
    const nodes = [
      ...boards({ i: 0, j: 6, water: [0, 6], old: [0, 7], hop: { from: 7, to: 6, tone: TONE_J } }),
      ...mcChips(MC_WORD.long[l], capExpr(0, 6, seg(' < ', ['21', 'muted'])), 'danger'),
    ];
    return { scene: { w: W, h: MC_H, nodes }, notes: [MC_NOTE.long[l]] };
  },
};

const MCS_SAY: Record<'init' | 'moveI' | 'moveJ' | 'done', T> = {
  init: {
    en: 'Place pointers i and j at the two ends of the array: i = 0, j = 7, and res = 0.',
    zh: '初始化指针 i 和 j，使其分列数组两端：i = 0，j = 7，res = 0。',
    'zh-hant': '初始化指標 i 和 j，使其分列陣列兩端：i = 0，j = 7，res = 0。',
    ja: 'ポインタ i と j を配列の両端に置きます：i = 0、j = 7、res = 0。',
    ru: 'Ставим указатели i и j на концы массива: i = 0, j = 7, res = 0.',
  },
  moveI: {
    en: 'cap[{i}, {j}] = {cap}, so res = {res}. ht[i] = {hi} < ht[j] = {hj}: i is the shorter board, so move i inward.',
    zh: 'cap[{i}, {j}] = {cap}，res = {res}。ht[i] = {hi} < ht[j] = {hj}，i 为短板，向内移动 i。',
    'zh-hant': 'cap[{i}, {j}] = {cap}，res = {res}。ht[i] = {hi} < ht[j] = {hj}，i 為短板，向內移動 i。',
    ja: 'cap[{i}, {j}] = {cap} なので res = {res}。ht[i] = {hi} < ht[j] = {hj} で i が短い板なので、i を内側へ動かします。',
    ru: 'cap[{i}, {j}] = {cap}, значит res = {res}. ht[i] = {hi} < ht[j] = {hj}: i — короткая перегородка, сдвигаем i внутрь.',
  },
  moveJ: {
    en: 'cap[{i}, {j}] = {cap}, so res = {res}. ht[i] = {hi} ≥ ht[j] = {hj}: j is the shorter board, so move j inward.',
    zh: 'cap[{i}, {j}] = {cap}，res = {res}。ht[i] = {hi} ≥ ht[j] = {hj}，j 为短板，向内移动 j。',
    'zh-hant': 'cap[{i}, {j}] = {cap}，res = {res}。ht[i] = {hi} ≥ ht[j] = {hj}，j 為短板，向內移動 j。',
    ja: 'cap[{i}, {j}] = {cap} なので res = {res}。ht[i] = {hi} ≥ ht[j] = {hj} で j が短い板なので、j を内側へ動かします。',
    ru: 'cap[{i}, {j}] = {cap}, значит res = {res}. ht[i] = {hi} ≥ ht[j] = {hj}: j — короткая перегородка, сдвигаем j внутрь.',
  },
  done: {
    en: 'i and j meet, so the loop ends. The maximum capacity is res = {res}, between boards {a} and {b}.',
    zh: 'i 和 j 相遇，循环结束。最大容量 res = {res}，由隔板 {a} 和 {b} 围成。',
    'zh-hant': 'i 和 j 相遇，迴圈結束。最大容量 res = {res}，由隔板 {a} 和 {b} 圍成。',
    ja: 'i と j が出会ったのでループを終了します。最大容量は res = {res} で、仕切り板 {a} と {b} の間です。',
    ru: 'i и j встретились, цикл завершён. Максимальная вместимость res = {res} — между перегородками {a} и {b}.',
  },
};

const maxCapacityGreedySteps: StepFigure = {
  type: 'steps',
  call: 'max_capacity(ht)',
  tones: { init: 'idle', moveI: 'cmp', moveJ: 'swp', done: 'done' },
  sources: funcSources(MC_PY, MC_JAVA, ['max_capacity'], {
    python: {
      init: ['i, j = 0, len(ht) - 1', 'res = 0'],
      moveI: ['cap = min(ht[i], ht[j]) * (j - i)', 'res = max(res, cap)', 'if ht[i] < ht[j]:', 'i += 1'],
      moveJ: ['cap = min(ht[i], ht[j]) * (j - i)', 'res = max(res, cap)', 'else:', 'j -= 1'],
      done: ['while i < j:', 'return res'],
    },
    java: {
      init: ['int i = 0, j = ht.length - 1;', 'int res = 0;'],
      moveI: ['int cap = Math.min(ht[i], ht[j]) * (j - i);', 'res = Math.max(res, cap);', 'if (ht[i] < ht[j]) {', 'i++;'],
      moveJ: ['int cap = Math.min(ht[i], ht[j]) * (j - i);', 'res = Math.max(res, cap);', '} else {', 'j--;'],
      done: ['while (i < j) {', 'return res;'],
    },
  }),
  build(l) {
    const S = MCS_SAY;
    let i = 0;
    let j = HT.length - 1;
    let res = 0;
    let best: [number, number] = [0, 0];
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: { w: W, h: MC_H, nodes: [...boards({ i, j }), ...mcChips(seg(['i', TONE_I, true], ' = 0, ', ['j', TONE_J, true], ` = ${j}`), seg('res = ', ['0', undefined, true]), 'idle', true)] },
        say: S.init[l],
      },
    ];
    while (i < j) {
      const cap = capOf(i, j);
      const prev = res;
      if (cap > res) {
        res = cap;
        best = [i, j];
      }
      const moveI = HT[i] < HT[j];
      const hop = moveI ? { from: i, to: i + 1, tone: TONE_I } : { from: j, to: j - 1, tone: TONE_J };
      const grew = res > prev;
      frames.push({
        kind: moveI ? 'moveI' : 'moveJ',
        scene: {
          w: W,
          h: MC_H,
          nodes: [
            ...boards({ i, j, water: [i, j], hop }),
            ...mcChips(capExpr(i, j), seg(`res = max(${prev}, ${cap}) = `, [String(res), grew ? 'ok' : undefined, true]), grew ? 'ok' : 'idle', true),
          ],
        },
        say: fmt(moveI ? S.moveI[l] : S.moveJ[l], { i, j, cap, res, hi: HT[i], hj: HT[j] }),
      });
      if (moveI) i++;
      else j--;
    }
    frames.push({
      kind: 'done',
      scene: {
        w: W,
        h: MC_H,
        nodes: [
          ...boards({ i, j, water: best, waterTone: 'ok', meet: true }),
          ...mcChips(seg(['i', TONE_I, true], ' = ', ['j', TONE_J, true], ` = ${i}`), seg('return res = ', [String(res), 'ok', true]), 'ok', true),
        ],
      },
      say: fmt(S.done[l], { res, a: best[0], b: best[1] }),
    });
    return { frames };
  },
};

// ── Max capacity: skipped states ──────────────────────────────────────

const SKIP_WORD: Record<'visited' | 'skipI' | 'skipJ' | 'max' | 'note', T> = {
  visited: { en: 'State checked by greedy', zh: '贪心检查的状态', 'zh-hant': '貪婪檢查的狀態', ja: '貪欲法が調べる状態', ru: 'Проверенное состояние' },
  skipI: { en: 'Skipped by moving i', zh: '移动 i 时跳过', 'zh-hant': '移動 i 時跳過', ja: 'i を動かしてスキップ', ru: 'Пропущено при сдвиге i' },
  skipJ: { en: 'Skipped by moving j', zh: '移动 j 时跳过', 'zh-hant': '移動 j 時跳過', ja: 'j を動かしてスキップ', ru: 'Пропущено при сдвиге j' },
  max: { en: 'Maximum capacity', zh: '最大容量', 'zh-hant': '最大容量', ja: '最大容量', ru: 'Максимальная вместимость' },
  note: {
    en: 'Each cell is a state cap[i, j] for ht = [3, 8, 5, 2, 7, 7, 3, 4]. Moving the shorter board i inward from [i, j] skips cap[i, i+1] … cap[i, j−1]; these only move the longer board inward, so each is smaller than cap[i, j]. Every skipped state is smaller than the state that skipped it, so the optimum is never missed.',
    zh: '每个格子是 ht = [3, 8, 5, 2, 7, 7, 3, 4] 的一个状态 cap[i, j]。从 [i, j] 向内移动短板 i，会跳过 cap[i, i+1] … cap[i, j−1]；这些状态相当于向内移动长板，容量都小于 cap[i, j]。每个被跳过的状态都小于跳过它的状态，因此不会错过最优解。',
    'zh-hant': '每個格子是 ht = [3, 8, 5, 2, 7, 7, 3, 4] 的一個狀態 cap[i, j]。從 [i, j] 向內移動短板 i，會跳過 cap[i, i+1] … cap[i, j−1]；這些狀態相當於向內移動長板，容量都小於 cap[i, j]。每個被跳過的狀態都小於跳過它的狀態，因此不會錯過最優解。',
    ja: '各マスは ht = [3, 8, 5, 2, 7, 7, 3, 4] の状態 cap[i, j] です。[i, j] から短い板 i を内側へ動かすと、cap[i, i+1] … cap[i, j−1] がスキップされます。これらは長い板を内側へ動かした状態なので、どれも cap[i, j] より小さくなります。スキップされる状態はすべて、それをスキップした状態より小さいので、最適解を見逃すことはありません。',
    ru: 'Каждая клетка — состояние cap[i, j] для ht = [3, 8, 5, 2, 7, 7, 3, 4]. Сдвиг короткой перегородки i внутрь из [i, j] пропускает cap[i, i+1] … cap[i, j−1]: это сдвиги длинной перегородки внутрь, и каждое из них меньше cap[i, j]. Любое пропущенное состояние меньше того, из которого его пропустили, поэтому оптимум не теряется.',
  },
};

const maxCapacitySkippedStates: StaticFigure = {
  type: 'static',
  build(l) {
    // Walk the greedy and record which move skipped each state.
    const visited: [number, number][] = [];
    const skippedBy = new Map<string, 'i' | 'j'>();
    let i = 0;
    let j = HT.length - 1;
    while (i < j) {
      visited.push([i, j]);
      if (HT[i] < HT[j]) {
        for (let k = i + 1; k < j; k++) skippedBy.set(`${i},${k}`, 'i');
        i++;
      } else {
        for (let k = i + 1; k < j; k++) skippedBy.set(`${k},${j}`, 'j');
        j--;
      }
    }
    let best = visited[0];
    for (const v of visited) if (capOf(...v) > capOf(...best)) best = v;
    const isVisited = (a: number, b: number) => visited.some(([x, y]) => x === a && y === b);

    const CS = 34;
    const PITCH = 44;
    const X0 = 116;
    const Y0 = 46;
    const at = (a: number, b: number) => ({ x: X0 + (b - 1) * PITCH, y: Y0 + a * PITCH, w: CS, h: CS });
    const nodes: SceneNode[] = [text('corner', X0 - 12, Y0 - 12, 'cap[i, j]', { anchor: 'end', mono: true, size: 12, bold: true, tone: 'muted' })];
    for (let b = 1; b < HT.length; b++) nodes.push(text(`cj${b}`, at(0, b).x + CS / 2, Y0 - 12, `j=${b}`, { anchor: 'middle', mono: true, size: 11, tone: TONE_J, bold: true }));
    for (let a = 0; a < HT.length - 1; a++) nodes.push(text(`ri${a}`, X0 - 12, at(a, 1).y + CS / 2 + 4, `i=${a}`, { anchor: 'end', mono: true, size: 11, tone: TONE_I, bold: true }));
    const cellsAt = new Map<string, BoxNode>();
    for (let a = 0; a < HT.length - 1; a++) {
      for (let b = a + 1; b < HT.length; b++) {
        const p = at(a, b);
        const key = `${a},${b}`;
        const by = skippedBy.get(key);
        const look: Partial<BoxNode> = isVisited(a, b)
          ? a === best[0] && b === best[1]
            ? { tone: 'ok', ring: true }
            : { tone: 'info' }
          : by === 'i'
            ? { tone: TONE_I, dashed: true, dim: true }
            : { tone: TONE_J, dashed: true, dim: true };
        const c = box(`s${key}`, p.x, p.y, capOf(a, b), { w: CS, h: CS, size: 13, ...look });
        cellsAt.set(key, c);
        nodes.push(c);
      }
    }
    for (let k = 1; k < visited.length; k++) {
      const a = cellsAt.get(visited[k - 1].join(','))!;
      const b = cellsAt.get(visited[k].join(','))!;
      nodes.push(link(`go${k}`, a, b, { tone: 'info', width: 2, pad: 1 }));
    }
    const bottom = at(HT.length - 2, 1).y + CS;
    const legend: LegendItem[] = [
      { tone: 'info', text: SKIP_WORD.visited[l] },
      { tone: 'ok', text: SKIP_WORD.max[l] },
      { tone: TONE_I, text: SKIP_WORD.skipI[l], dashed: true },
      { tone: TONE_J, text: SKIP_WORD.skipJ[l], dashed: true },
    ];
    return { scene: { w: W, h: bottom + 8, nodes }, legend, notes: [SKIP_WORD.note[l]] };
  },
};

// ── Max product cutting ───────────────────────────────────────────────

interface Piece {
  len: number;
  tone: Tone;
  label?: Rich;
}

interface PieceOpts {
  uw: number;
  ug: number;
  pg: number;
  h: number;
  /** Put × between pieces. */
  times?: boolean;
  labelDy?: number;
}

/** Width of a run of pieces made of unit cells. */
const piecesWidth = (pieces: Piece[], o: PieceOpts) =>
  pieces.reduce((s, p) => s + p.len * o.uw + (p.len - 1) * o.ug, 0) + Math.max(0, pieces.length - 1) * o.pg;

/** Pieces of an integer as runs of unit cells. Unit k keeps the id `<prefix>u<k>` whichever piece it is in. */
function pieceRow(prefix: string, x: number, y: number, pieces: Piece[], o: PieceOpts) {
  const nodes: SceneNode[] = [];
  let cx = x;
  let k = 0;
  pieces.forEach((p, g) => {
    if (g > 0) {
      if (o.times) nodes.push(text(`${prefix}x${g}`, cx + o.pg / 2, y + o.h / 2 + 4, '×', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
      cx += o.pg;
    }
    const x1 = cx;
    for (let u = 0; u < p.len; u++, k++) {
      nodes.push(box(`${prefix}u${k}`, cx, y, '', { w: o.uw, h: o.h, tone: p.tone }));
      cx += o.uw + (u < p.len - 1 ? o.ug : 0);
    }
    if (p.label !== undefined) nodes.push(text(`${prefix}l${g}`, (x1 + cx) / 2, y + o.h + (o.labelDy ?? 18), p.label, { anchor: 'middle', mono: true, bold: true, size: 12, tone: p.tone === 'idle' ? 'muted' : p.tone }));
  });
  return nodes;
}

/** A double-headed dimension arrow with a label above (or below) it. */
function dim(id: string, x1: number, x2: number, y: number, label: Rich, tone?: Tone, below = false) {
  return [
    arrow(id, [x1, y], [x2, y], { head: 'both', tone, width: 1.25 }),
    text(`${id}:l`, (x1 + x2) / 2, below ? y + 18 : y - 7, label, { anchor: 'middle', mono: true, bold: true, size: 13, tone: tone ?? 'muted' }),
  ];
}

const MPC_WORD: Record<'goal' | 'replace', T> = {
  goal: {
    en: 'Cut n into m ≥ 2 positive integers, maximize the product',
    zh: '将 n 切分为至少两个正整数，求最大乘积',
    'zh-hant': '將 n 切分為至少兩個正整數，求最大乘積',
    ja: 'n を 2 つ以上の正整数に分割し、積の最大値を求める',
    ru: 'Разбить n на m ≥ 2 слагаемых и максимизировать произведение',
  },
  replace: {
    en: 'Three {two}s should be replaced by two {three}s',
    zh: '三个 {two} 应替换为两个 {three}',
    'zh-hant': '三個 {two} 應替換為兩個 {three}',
    ja: '3 つの {two} は 2 つの {three} に置き換えるべき',
    ru: 'Три двойки ({two}) выгоднее заменить двумя тройками ({three})',
  },
};

const MPC_NOTE: Record<'definition' | 'infer1' | 'infer2', T> = {
  definition: {
    en: 'Here n = 10: of all the ways to cut it, 3 + 3 + 2 + 2 gives the largest product, 36.',
    zh: '此处 n = 10：在所有切分方案中，3 + 3 + 2 + 2 的乘积 36 最大。',
    'zh-hant': '此處 n = 10：在所有切分方案中，3 + 3 + 2 + 2 的乘積 36 最大。',
    ja: 'ここでは n = 10：すべての分割方法のうち、3 + 3 + 2 + 2 の積 36 が最大です。',
    ru: 'Здесь n = 10: среди всех разбиений наибольшее произведение, 36, даёт 3 + 3 + 2 + 2.',
  },
  infer1: {
    en: 'When n ≥ 4, splitting off a 2 does not lower the product, so every factor ≥ 4 should be cut further: only the factors 1, 2 and 3 remain.',
    zh: '当 n ≥ 4 时，切分出一个 2 后乘积不会变小，因此大于等于 4 的因子都应继续切分，最终只剩下 1、2、3 这三种因子。',
    'zh-hant': '當 n ≥ 4 時，切分出一個 2 後乘積不會變小，因此大於等於 4 的因子都應繼續切分，最終只剩下 1、2、3 這三種因子。',
    ja: 'n ≥ 4 のとき、2 を 1 つ切り出しても積は小さくならないので、4 以上の因子はさらに分割すべきです。最終的に残る因子は 1、2、3 だけです。',
    ru: 'При n ≥ 4 выделение двойки не уменьшает произведение, поэтому каждый множитель ≥ 4 нужно разбивать дальше: остаются только множители 1, 2 и 3.',
  },
  infer2: {
    en: 'Both use 6 of n, but 3 × 3 = 9 > 2 × 2 × 2 = 8. So cutting off 3s beats cutting off 2s, and a cut has at most two 2s.',
    zh: '两种方案都占用 n 中的 6，但 3 × 3 = 9 > 2 × 2 × 2 = 8。因此切分出 3 比切分出 2 更优，切分方案中最多只应有两个 2。',
    'zh-hant': '兩種方案都佔用 n 中的 6，但 3 × 3 = 9 > 2 × 2 × 2 = 8。因此切分出 3 比切分出 2 更優，切分方案中最多只應有兩個 2。',
    ja: 'どちらも n のうち 6 を使いますが、3 × 3 = 9 > 2 × 2 × 2 = 8 です。したがって 2 より 3 を切り出すほうが有利で、分割方法に含まれる 2 は高々 2 つです。',
    ru: 'Оба варианта занимают 6 единиц из n, но 3 × 3 = 9 > 2 × 2 × 2 = 8. Значит, выделять тройки выгоднее, чем двойки, и двоек в разбиении не больше двух.',
  },
};

const maxProductCuttingDefinition: StaticFigure = {
  type: 'static',
  build(l) {
    const o: PieceOpts = { uw: 30, ug: 2, pg: 14, h: 24, times: true };
    const whole: Piece[] = [{ len: 10, tone: 'idle' }];
    const cut: Piece[] = [
      { len: 3, tone: 'danger', label: 'n₁ = 3' },
      { len: 3, tone: 'warn', label: 'n₂ = 3' },
      { len: 2, tone: 'info', label: 'n₃ = 2' },
      { len: 2, tone: 'accent', label: 'n₄ = 2' },
    ];
    const tw = piecesWidth(whole, o);
    const tx = (W - tw) / 2;
    const cw = piecesWidth(cut, o);
    const cx = (W - cw) / 2;
    const nodes: SceneNode[] = [
      ...dim('n', tx, tx + tw, 30, 'n = 10'),
      ...pieceRow('t', tx, 40, whole, o),
      arrow('down', [W / 2 - 40, 72], [W / 2 - 40, 98], { width: 1.5 }),
      ...pieceRow('c', cx, 104, cut, o),
      chip('goal', W / 2, 166, MPC_WORD.goal[l], { sans: true, size: 12 }),
      chip(
        'prod',
        W / 2,
        200,
        seg(['n₁', 'danger', true], ' × ', ['n₂', 'warn', true], ' × ', ['n₃', 'info', true], ' × ', ['n₄', 'accent', true], ' = 3 × 3 × 2 × 2 = ', ['36', 'ok', true]),
        { size: 13 },
      ),
    ];
    return { scene: { w: W, h: 238, nodes }, notes: [MPC_NOTE.definition[l]] };
  },
};

const maxProductCuttingGreedyInfer1: StaticFigure = {
  type: 'static',
  build(l) {
    const X = 50;
    const BW = W - 2 * X;
    const two = 70;
    const nodes: SceneNode[] = [
      ...dim('n', X, X + BW, 30, 'n'),
      box('whole', X, 40, '', { w: BW, h: 18, tone: 'idle' }),
      arrow('down', [W / 2, 64], [W / 2, 90], { width: 1.5 }),
      box('two', X, 96, '', { w: two, h: 18, tone: 'ok' }),
      box('rest', X + two + 6, 96, '', { w: BW - two - 6, h: 18, tone: 'info' }),
      ...dim('d2', X, X + two, 126, '2', 'ok', true),
      ...dim('dr', X + two + 6, X + BW, 126, 'n − 2', 'info', true),
      chip('rule', W / 2, 160, seg(['2', 'ok', true], ' × (', ['n − 2', 'info', true], ') ≥ n  ⇔  n ≥ ', ['4', undefined, true]), { size: 14 }),
    ];
    const examples = [4, 5, 6, 7].map((n) => `n=${n}: 2×${n - 2}=${2 * (n - 2)}`);
    const widths = examples.map((e) => textWidth(e, 11, true) + 20);
    const total = widths.reduce((a, b) => a + b, 0) + 8 * (examples.length - 1);
    let x = (W - total) / 2;
    examples.forEach((e, k) => {
      nodes.push(chip(`ex${k}`, x, 200, e, { align: 'start', size: 11, tone: 'ok' }));
      x += widths[k] + 8;
    });
    return { scene: { w: W, h: 236, nodes }, notes: [MPC_NOTE.infer1[l]] };
  },
};

const maxProductCuttingGreedyInfer2: StaticFigure = {
  type: 'static',
  build(l) {
    const X = 36;
    const END = 300;
    const G = 5;
    const twoW = 50;
    const six = 3 * twoW + 2 * G;
    const threeW = (six - G) / 2;
    const rest = (y: number, id: string) => box(id, X + six + 6, y, 'n − 6', { w: END - X - six - 6, h: 22, size: 12, tone: 'idle' });
    const nodes: SceneNode[] = [
      ...dim('n', X, END, 30, 'n'),
      box('whole', X, 40, '', { w: END - X, h: 18, tone: 'idle' }),
      ...[0, 1, 2].map((k) => box(`two${k}`, X + k * (twoW + G), 84, '2', { w: twoW, h: 22, size: 13, tone: 'info' })),
      rest(84, 'restA'),
      chip('pA', W - 12, 81, seg('2 × 2 × 2 = ', ['8', 'danger', true]), { align: 'end', size: 13 }),
      arrow('down', [X + six / 2, 114], [X + six / 2, 138], { width: 1.5 }),
      ...[0, 1].map((k) => box(`three${k}`, X + k * (threeW + G), 144, '3', { w: threeW, h: 22, size: 13, tone: 'accent' })),
      rest(144, 'restB'),
      chip('pB', W - 12, 141, seg('3 × 3 = ', ['9', 'ok', true]), { align: 'end', size: 13, tone: 'ok' }),
      chip('rule', W / 2, 188, rich(MPC_WORD.replace[l], { two: ['2', 'info', true], three: ['3', 'accent', true] }), { sans: true, size: 13 }),
    ];
    return { scene: { w: W, h: 224, nodes }, notes: [MPC_NOTE.infer2[l]] };
  },
};

const MPCS_SAY: Record<'split' | 'b0' | 'b1' | 'b2' | 'edge', T> = {
  split: {
    en: 'n = {n}: cut off as many 3s as possible. a = n // 3 = {a} threes, remainder b = n % 3 = {b}.',
    zh: 'n = {n}：尽可能多地切分出 3。3 的个数 a = n // 3 = {a}，余数 b = n % 3 = {b}。',
    'zh-hant': 'n = {n}：盡可能多地切分出 3。3 的個數 a = n // 3 = {a}，餘數 b = n % 3 = {b}。',
    ja: 'n = {n}：3 をできるだけ多く切り出します。3 の個数 a = n // 3 = {a}、余り b = n % 3 = {b}。',
    ru: 'n = {n}: выделяем как можно больше троек. Троек a = n // 3 = {a}, остаток b = n % 3 = {b}.',
  },
  b0: {
    en: 'b = 0: n is a multiple of 3, so nothing else is needed. The product is {expr}.',
    zh: 'b = 0：n 是 3 的倍数，无须处理。乘积为 {expr}。',
    'zh-hant': 'b = 0：n 是 3 的倍數，無須處理。乘積為 {expr}。',
    ja: 'b = 0：n は 3 の倍数なので、何もしません。積は {expr} です。',
    ru: 'b = 0: n кратно 3, больше ничего делать не нужно. Произведение равно {expr}.',
  },
  b2: {
    en: 'b = 2: keep the 2 as it is. The product is {expr}.',
    zh: 'b = 2：保留这个 2，不做处理。乘积为 {expr}。',
    'zh-hant': 'b = 2：保留這個 2，不做處理。乘積為 {expr}。',
    ja: 'b = 2：2 はそのまま残します。積は {expr} です。',
    ru: 'b = 2: оставляем двойку как есть. Произведение равно {expr}.',
  },
  b1: {
    en: 'b = 1: since 2 × 2 > 1 × 3, turn the last 3 and the 1 into two 2s. The product is {expr}.',
    zh: 'b = 1：由于 2 × 2 > 1 × 3，将最后一个 3 和 1 替换为两个 2。乘积为 {expr}。',
    'zh-hant': 'b = 1：由於 2 × 2 > 1 × 3，將最後一個 3 和 1 替換為兩個 2。乘積為 {expr}。',
    ja: 'b = 1：2 × 2 > 1 × 3 なので、最後の 3 と 1 を 2 つの 2 に置き換えます。積は {expr} です。',
    ru: 'b = 1: так как 2 × 2 > 1 × 3, заменяем последнюю тройку и единицу двумя двойками. Произведение равно {expr}.',
  },
  edge: {
    en: 'Edge case n ≤ 3: a 1 must be cut off, so the product is 1 × (n − 1) = {p}.',
    zh: '边界情况 n ≤ 3：必须切分出一个 1，乘积为 1 × (n − 1) = {p}。',
    'zh-hant': '邊界情況 n ≤ 3：必須切分出一個 1，乘積為 1 × (n − 1) = {p}。',
    ja: '境界ケース n ≤ 3：必ず 1 を切り出すので、積は 1 × (n − 1) = {p} です。',
    ru: 'Граничный случай n ≤ 3: обязательно выделяется 1, поэтому произведение равно 1 × (n − 1) = {p}.',
  },
};

const CUT_O: PieceOpts = { uw: 28, ug: 2, pg: 14, h: 28 };
const CUT_X = 38;
const CUT_Y = 60;

function cutScene(n: number, pieces: Piece[], head: Segment[], result: Segment[] | null): Scene {
  const nodes: SceneNode[] = [chip('head', W / 2, 8, head, { size: 14 }), ...pieceRow('', CUT_X, CUT_Y, pieces, CUT_O)];
  if (result) nodes.push(chip('res', W / 2, CUT_Y + CUT_O.h + 40, result, { size: 14, tone: 'ok' }));
  return { w: W, h: CUT_Y + CUT_O.h + 78, nodes };
}

const THREE: Tone = 'info';
const REM: Tone = 'ok';
const TWO: Tone = 'warn';

const maxProductCuttingGreedyCalculation: StepFigure = {
  type: 'steps',
  tones: { split: 'cmp', b0: 'done', b2: 'done', b1: 'swp', edge: 'idle' },
  sources: funcSources(MPC_PY, MPC_JAVA, ['max_product_cutting'], {
    python: {
      edge: ['if n <= 3:', 'return 1 * (n - 1)'],
      split: ['a, b = n // 3, n % 3'],
      b1: ['if b == 1:', 'return int(math.pow(3, a - 1)) * 2 * 2'],
      b2: ['if b == 2:', 'return int(math.pow(3, a)) * 2'],
      b0: ['2|return int(math.pow(3, a))'],
    },
    java: {
      edge: ['if (n <= 3) {', 'return 1 * (n - 1);'],
      split: ['int a = n / 3;', 'int b = n % 3;'],
      b1: ['if (b == 1) {', 'return (int) Math.pow(3, a - 1) * 2 * 2;'],
      b2: ['if (b == 2) {', 'return (int) Math.pow(3, a) * 2;'],
      b0: ['return (int) Math.pow(3, a);'],
    },
  }),
  build(l) {
    const S = MPCS_SAY;
    const frames: SceneFrame[] = [];
    const threes = (a: number): Piece[] => Array.from({ length: a }, () => ({ len: 3, tone: THREE, label: '3' }));
    const head = (n: number, a: number, b: number) =>
      seg('n = 3', ['a', THREE, true], ' + ', ['b', REM, true], `  →  ${n} = 3 × `, [String(a), THREE, true], ' + ', [String(b), REM, true]);
    for (const n of [9, 11, 10]) {
      const a = Math.floor(n / 3);
      const b = n % 3;
      const call = `max_product_cutting(${n})`;
      const split: Piece[] = [...threes(a), ...(b ? [{ len: b, tone: REM, label: `b = ${b}` }] : [])];
      frames.push({ kind: 'split', call, scene: cutScene(n, split, head(n, a, b), null), say: fmt(S.split[l], { n, a, b }) });
      if (b === 0) {
        const expr = `3${sup(a)} = ${3 ** a}`;
        frames.push({ kind: 'b0', call, scene: cutScene(n, split, head(n, a, b), seg(`3${sup(a)} = `, [String(3 ** a), 'ok', true])), say: fmt(S.b0[l], { expr }) });
      } else if (b === 2) {
        const p = 3 ** a * 2;
        frames.push({ kind: 'b2', call, scene: cutScene(n, split, head(n, a, b), seg(`3${sup(a)} × 2 = `, [String(p), 'ok', true])), say: fmt(S.b2[l], { expr: `3${sup(a)} × 2 = ${p}` }) });
      } else {
        const p = 3 ** (a - 1) * 4;
        const pieces: Piece[] = [...threes(a - 1), { len: 2, tone: TWO, label: '2' }, { len: 2, tone: TWO, label: '2' }];
        frames.push({
          kind: 'b1',
          call,
          scene: cutScene(n, pieces, head(n, a, b), seg(`3${sup(a - 1)} × 2 × 2 = `, [String(p), 'ok', true])),
          say: fmt(S.b1[l], { expr: `3${sup(a - 1)} × 2 × 2 = ${p}` }),
        });
      }
    }
    frames.push({
      kind: 'edge',
      call: 'max_product_cutting(3)',
      scene: cutScene(3, [{ len: 1, tone: REM, label: '1' }, { len: 2, tone: TWO, label: '2' }], seg('n = 3 = ', ['1', REM, true], ' + ', ['2', TWO, true]), seg('1 × 2 = ', ['2', 'ok', true])),
      say: fmt(S.edge[l], { p: 2 }),
    });
    return { frames };
  },
};

const FIGURES: Record<string, Figure> = {
  coin_change_greedy_strategy: coinChangeGreedyStrategy,
  coin_change_greedy_vs_dp: coinChangeGreedyVsDp,
  fractional_knapsack_example: fractionalKnapsackExample,
  fractional_knapsack_unit_value: fractionalKnapsackUnitValue,
  fractional_knapsack_greedy_strategy: fractionalKnapsackGreedyStrategy,
  fractional_knapsack_area_chart: fractionalKnapsackAreaChart,
  max_capacity_example: maxCapacityExample,
  max_capacity_initial_state: maxCapacityInitialState,
  max_capacity_moving_short_board: maxCapacityMovingShortBoard,
  max_capacity_moving_long_board: maxCapacityMovingLongBoard,
  max_capacity_greedy_steps: maxCapacityGreedySteps,
  max_capacity_skipped_states: maxCapacitySkippedStates,
  max_product_cutting_definition: maxProductCuttingDefinition,
  max_product_cutting_greedy_infer1: maxProductCuttingGreedyInfer1,
  max_product_cutting_greedy_infer2: maxProductCuttingGreedyInfer2,
  max_product_cutting_greedy_calculation: maxProductCuttingGreedyCalculation,
};

export default FIGURES;
