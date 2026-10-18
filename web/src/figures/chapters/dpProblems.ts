import coinJavaEn from '@codes-en/java/chapter_dynamic_programming/coin_change.java?raw';
import editJavaEn from '@codes-en/java/chapter_dynamic_programming/edit_distance.java?raw';
import knapJavaEn from '@codes-en/java/chapter_dynamic_programming/knapsack.java?raw';
import unboundJavaEn from '@codes-en/java/chapter_dynamic_programming/unbounded_knapsack.java?raw';
import coinPyEn from '@codes-en/python/chapter_dynamic_programming/coin_change.py?raw';
import editPyEn from '@codes-en/python/chapter_dynamic_programming/edit_distance.py?raw';
import knapPyEn from '@codes-en/python/chapter_dynamic_programming/knapsack.py?raw';
import unboundPyEn from '@codes-en/python/chapter_dynamic_programming/unbounded_knapsack.py?raw';
import coinJavaJa from '@codes-ja/java/chapter_dynamic_programming/coin_change.java?raw';
import editJavaJa from '@codes-ja/java/chapter_dynamic_programming/edit_distance.java?raw';
import knapJavaJa from '@codes-ja/java/chapter_dynamic_programming/knapsack.java?raw';
import unboundJavaJa from '@codes-ja/java/chapter_dynamic_programming/unbounded_knapsack.java?raw';
import coinPyJa from '@codes-ja/python/chapter_dynamic_programming/coin_change.py?raw';
import editPyJa from '@codes-ja/python/chapter_dynamic_programming/edit_distance.py?raw';
import knapPyJa from '@codes-ja/python/chapter_dynamic_programming/knapsack.py?raw';
import unboundPyJa from '@codes-ja/python/chapter_dynamic_programming/unbounded_knapsack.py?raw';
import coinJavaRu from '@codes-ru/java/chapter_dynamic_programming/coin_change.java?raw';
import editJavaRu from '@codes-ru/java/chapter_dynamic_programming/edit_distance.java?raw';
import knapJavaRu from '@codes-ru/java/chapter_dynamic_programming/knapsack.java?raw';
import unboundJavaRu from '@codes-ru/java/chapter_dynamic_programming/unbounded_knapsack.java?raw';
import coinPyRu from '@codes-ru/python/chapter_dynamic_programming/coin_change.py?raw';
import editPyRu from '@codes-ru/python/chapter_dynamic_programming/edit_distance.py?raw';
import knapPyRu from '@codes-ru/python/chapter_dynamic_programming/knapsack.py?raw';
import unboundPyRu from '@codes-ru/python/chapter_dynamic_programming/unbounded_knapsack.py?raw';
import coinJavaZh from '@codes-zh/java/chapter_dynamic_programming/coin_change.java?raw';
import editJavaZh from '@codes-zh/java/chapter_dynamic_programming/edit_distance.java?raw';
import knapJavaZh from '@codes-zh/java/chapter_dynamic_programming/knapsack.java?raw';
import unboundJavaZh from '@codes-zh/java/chapter_dynamic_programming/unbounded_knapsack.java?raw';
import coinPyZh from '@codes-zh/python/chapter_dynamic_programming/coin_change.py?raw';
import editPyZh from '@codes-zh/python/chapter_dynamic_programming/edit_distance.py?raw';
import knapPyZh from '@codes-zh/python/chapter_dynamic_programming/knapsack.py?raw';
import unboundPyZh from '@codes-zh/python/chapter_dynamic_programming/unbounded_knapsack.py?raw';
import coinJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/coin_change.java?raw';
import editJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/edit_distance.java?raw';
import knapJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/knapsack.java?raw';
import unboundJavaZhHant from '@codes-zh-hant/java/chapter_dynamic_programming/unbounded_knapsack.java?raw';
import coinPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/coin_change.py?raw';
import editPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/edit_distance.py?raw';
import knapPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/knapsack.py?raw';
import unboundPyZhHant from '@codes-zh-hant/python/chapter_dynamic_programming/unbounded_knapsack.py?raw';
import type { Locale } from '../../i18n/locale';
import { arrow, box, type Cell, cells, cellX, chip, grid, gridAt, indices, link, rowWidth, seg, text, treeSlots } from '../kit';
import type { BoxNode, Figure, LegendItem, Rich, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

/**
 * Chapter 14, dynamic programming problems: 0-1 knapsack, unbounded knapsack, coin change and
 * edit distance. Every table is computed here from the book's example data; cells keep their
 * ids from step to step, so filling the table only recolors and fills in values.
 */

const KNAP_PY = raw(knapPyEn, knapPyZh, knapPyZhHant, knapPyJa, knapPyRu);
const KNAP_JAVA = raw(knapJavaEn, knapJavaZh, knapJavaZhHant, knapJavaJa, knapJavaRu);
const UNBOUND_PY = raw(unboundPyEn, unboundPyZh, unboundPyZhHant, unboundPyJa, unboundPyRu);
const UNBOUND_JAVA = raw(unboundJavaEn, unboundJavaZh, unboundJavaZhHant, unboundJavaJa, unboundJavaRu);
const COIN_PY = raw(coinPyEn, coinPyZh, coinPyZhHant, coinPyJa, coinPyRu);
const COIN_JAVA = raw(coinJavaEn, coinJavaZh, coinJavaZhHant, coinJavaJa, coinJavaRu);
const EDIT_PY = raw(editPyEn, editPyZh, editPyZhHant, editPyJa, editPyRu);
const EDIT_JAVA = raw(editJavaEn, editJavaZh, editJavaZhHant, editJavaJa, editJavaRu);

// ── Book data ─────────────────────────────────────────────────────────

/** Example data of the problem statements (knapsack_example, unbounded_knapsack_example). */
const KNAP_EX = { wgt: [10, 20, 30, 40, 50], val: [50, 120, 150, 210, 240], cap: 50 };
/** The small instance drawn as a recursion tree. */
const KNAP_TREE = { wgt: [10, 20, 20], val: [60, 110, 120], cap: 30 };
/** The instance whose dp table is filled step by step. */
const KNAP_DP = { wgt: [1, 2, 3], val: [5, 11, 15], cap: 4 };
const COINS = [1, 2, 5];
const COIN_EX_AMT = 11;
const COIN_DP_AMT = 4;
const COIN_II_AMT = 5;
const EDIT_EX: [string, string][] = [
  ['kitten', 'sitting'],
  ['hello', 'algo'],
];
const EDIT_DP = { s: 'bag', t: 'pack' };
const EDIT_TRANSFER = { s: 'book', t: 'code' };

/** One color per item / coin, so a row of the data table and its pieces match. */
const ITEM_TONES: Tone[] = ['accent', 'warn', 'info', 'ok', 'danger'];
const COIN_TONES: Tone[] = ['warn', 'ok', 'info'];

// ── Words ─────────────────────────────────────────────────────────────

const WORD: Record<
  'capacity' | 'maxValue' | 'totalWeight' | 'amount' | 'minCoins' | 'combos' | 'reverse' | 'forward' | 'found' | 'edits',
  T
> = {
  capacity: { en: 'Knapsack capacity', zh: '背包容量', 'zh-hant': '背包容量', ja: 'ナップサック容量', ru: 'Вместимость рюкзака' },
  maxValue: { en: 'Maximum value', zh: '最大价值', 'zh-hant': '最大價值', ja: '最大価値', ru: 'Максимальная стоимость' },
  totalWeight: { en: 'Total weight', zh: '总重量', 'zh-hant': '總重量', ja: '重さの合計', ru: 'Общий вес' },
  amount: { en: 'Target amount', zh: '目标金额', 'zh-hant': '目標金額', ja: '目標金額', ru: 'Целевая сумма' },
  minCoins: { en: 'Minimum number of coins', zh: '最少硬币数量', 'zh-hant': '最少硬幣數量', ja: '最小の硬貨枚数', ru: 'Минимальное число монет' },
  combos: { en: 'Number of combinations', zh: '组合数量', 'zh-hant': '組合數量', ja: '組合せ数', ru: 'Число комбинаций' },
  reverse: { en: 'reverse traversal', zh: '倒序遍历', 'zh-hant': '倒序走訪', ja: '逆方向に走査', ru: 'обход справа налево' },
  forward: { en: 'forward traversal', zh: '正序遍历', 'zh-hant': '正序走訪', ja: '順方向に走査', ru: 'обход слева направо' },
  found: { en: 'found in mem', zh: '找到记录', 'zh-hant': '找到記錄', ja: '記録あり', ru: 'есть в mem' },
  edits: { en: 'edits', zh: '编辑步数', 'zh-hant': '編輯步數', ja: '編集回数', ru: 'шагов' },
};

type Op = 'match' | 'replace' | 'insert' | 'delete';

const OP_TONE: Record<Op, Tone> = { match: 'ok', replace: 'info', insert: 'accent', delete: 'warn' };

const OP_NAME: Record<Exclude<Op, 'match'>, T> = {
  replace: { en: 'replace', zh: '替换', 'zh-hant': '替換', ja: '置換', ru: 'замена' },
  insert: { en: 'insert', zh: '插入', 'zh-hant': '插入', ja: '挿入', ru: 'вставка' },
  delete: { en: 'delete', zh: '删除', 'zh-hant': '刪除', ja: '削除', ru: 'удаление' },
};

const OP_DESC: Record<Exclude<Op, 'match'>, T> = {
  replace: { en: 'Replace {a} with {b}', zh: '将 {a} 替换为 {b}', 'zh-hant': '將 {a} 替換為 {b}', ja: '{a} を {b} に置換', ru: 'заменить {a} на {b}' },
  insert: { en: 'Insert {b} at the end', zh: '在尾部添加 {b}', 'zh-hant': '在尾部新增 {b}', ja: '末尾に {b} を追加', ru: 'вставить {b} в конец' },
  delete: { en: 'Delete {a}', zh: '删除 {a}', 'zh-hant': '刪除 {a}', ja: '{a} を削除', ru: 'удалить {a}' },
};

const OP_LEGEND: Record<Exclude<Op, 'match'>, T> = {
  replace: { en: 'Replace a character', zh: '替换字符', 'zh-hant': '替換字元', ja: '文字の置換', ru: 'замена символа' },
  insert: { en: 'Insert a character', zh: '插入字符', 'zh-hant': '插入字元', ja: '文字の挿入', ru: 'вставка символа' },
  delete: { en: 'Delete a character', zh: '删除字符', 'zh-hant': '刪除字元', ja: '文字の削除', ru: 'удаление символа' },
};

// ── Small helpers ─────────────────────────────────────────────────────

const table = (rows: number, cols: number, fill = 0) => Array.from({ length: rows }, () => Array<number>(cols).fill(fill));
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** dp table of the 0-1 (or unbounded) knapsack, exactly as knapsack_dp fills it. */
function knapsackTable(wgt: number[], val: number[], cap: number, unbounded = false) {
  const n = wgt.length;
  const dp = table(n + 1, cap + 1);
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= cap; c++) {
      if (wgt[i - 1] > c) dp[i][c] = dp[i - 1][c];
      else dp[i][c] = Math.max(dp[i - 1][c], dp[unbounded ? i : i - 1][c - wgt[i - 1]] + val[i - 1]);
    }
  }
  return dp;
}

/** Every way to pick counts[k] copies of item k (at most `limit(k)` each). */
function allCounts(n: number, limit: (k: number) => number): number[][] {
  const out: number[][] = [];
  const go = (k: number, acc: number[]) => {
    if (k === n) return void out.push(acc);
    for (let x = 0; x <= limit(k); x++) go(k + 1, [...acc, x]);
  };
  go(0, []);
  return out;
}

/** Best choice for the knapsack examples, found by trying every combination. */
function bestKnapsack(wgt: number[], val: number[], cap: number, unbounded: boolean) {
  let best = { value: -1, counts: [] as number[] };
  for (const counts of allCounts(wgt.length, (k) => (unbounded ? Math.floor(cap / wgt[k]) : 1))) {
    const w = sum(counts.map((x, k) => x * wgt[k]));
    const v = sum(counts.map((x, k) => x * val[k]));
    if (w <= cap && v > best.value) best = { value: v, counts };
  }
  return best;
}

/** All coin combinations (as non-decreasing lists) that make up `amt`, in lexicographic order. */
function coinCombos(coins: number[], amt: number) {
  const lists = allCounts(coins.length, (k) => Math.floor(amt / coins[k]))
    .filter((counts) => sum(counts.map((x, k) => x * coins[k])) === amt)
    .map((counts) => counts.flatMap((x, k) => Array<number>(x).fill(coins[k])));
  const cmp = (a: number[], b: number[]): number => {
    for (let k = 0; k < Math.min(a.length, b.length); k++) if (a[k] !== b[k]) return a[k] - b[k];
    return a.length - b.length;
  };
  return lists.sort(cmp);
}

/** Edit distance table, as edit_distance_dp fills it. */
function editTable(s: string, t: string) {
  const n = s.length;
  const m = t.length;
  const dp = table(n + 1, m + 1);
  for (let i = 1; i <= n; i++) dp[i][0] = i;
  for (let j = 1; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp;
}

interface AlignCol {
  op: Op;
  a: string | null;
  b: string | null;
  /** Index of the character in s (for match/replace/delete). */
  si: number;
}

/** One shortest edit script, read back from the dp table, left to right. */
function editAlignment(s: string, t: string): AlignCol[] {
  const dp = editTable(s, t);
  const cols: AlignCol[] = [];
  let i = s.length;
  let j = t.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s[i - 1] === t[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      cols.push({ op: 'match', a: s[i - 1], b: t[j - 1], si: i - 1 });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      cols.push({ op: 'replace', a: s[i - 1], b: t[j - 1], si: i - 1 });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      cols.push({ op: 'delete', a: s[i - 1], b: null, si: i - 1 });
      i--;
    } else {
      cols.push({ op: 'insert', a: null, b: t[j - 1], si: i });
      j--;
    }
  }
  return cols.reverse();
}

/** A label in front of a row of cells, e.g. `s =`. */
const rowLabel = (id: string, x: number, y: number, h: number, label: string, tone: Tone = 'muted') =>
  text(id, x, y + h / 2 + 5, label, { anchor: 'end', mono: true, bold: true, size: 13, tone });

// ── Knapsack example ──────────────────────────────────────────────────

const EX_W = 440;

/** Item table on the left, the knapsack (a column as tall as its capacity) on the right, filled with the best choice. */
function knapsackExample(l: Locale, unbounded: boolean) {
  const { wgt, val, cap } = KNAP_EX;
  const { value, counts } = bestKnapsack(wgt, val, cap, unbounded);
  const nodes: SceneNode[] = [];
  const headY = 50;
  const rowY = (r: number) => 60 + r * 34;
  const rh = 28;
  const colX = [16, 56, 126];
  const colW = [34, 64, 64];
  const heads = ['i', 'wgt[i-1]', 'val[i-1]'];
  heads.forEach((h, k) => nodes.push(text(`h${k}`, colX[k] + colW[k] / 2, headY, h, { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' })));

  // The knapsack: a body as tall as the capacity, a handle on top.
  const bagX = 296;
  const bagW = 100;
  const bagTop = 64;
  const unit = 3.2;
  const bagH = cap * unit + 8;
  const bagCx = bagX + bagW / 2;
  nodes.push(
    text('cap:w', bagCx, 16, WORD.capacity[l], { anchor: 'middle', size: 12, tone: 'muted', bold: true }),
    text('cap', bagCx, 34, seg(['cap', undefined, true], ' = ', [String(cap), 'accent', true]), { anchor: 'middle', mono: true, size: 14 }),
    { kind: 'path', id: 'handle', d: `M ${bagCx - 24} ${bagTop} C ${bagCx - 24} ${bagTop - 22}, ${bagCx + 24} ${bagTop - 22}, ${bagCx + 24} ${bagTop}`, tone: 'muted', width: 3 },
    box('bag', bagX, bagTop, '', { w: bagW, h: bagH, tone: 'ghost' }),
  );

  wgt.forEach((w, k) => {
    const tone = counts[k] > 0 ? ITEM_TONES[k] : 'idle';
    nodes.push(
      box(`i${k}`, colX[0], rowY(k), k + 1, { w: colW[0], h: rh, size: 13, tone: 'muted' }),
      box(`w${k}`, colX[1], rowY(k), w, { w: colW[1], h: rh, size: 13, tone }),
      box(`v${k}`, colX[2], rowY(k), val[k], { w: colW[2], h: rh, size: 13, tone }),
    );
  });
  // Stack from the bottom, last item first, so arrows from the rows do not cross.
  let filled = 0;
  [...wgt.keys()].reverse().forEach((k) => {
    const w = wgt[k];
    const y = rowY(k);
    if (counts[k] === 0) return;
    if (unbounded) nodes.push(text(`x${k}`, colX[2] + colW[2] + 10, y + rh / 2 + 5, `×${counts[k]}`, { mono: true, bold: true, size: 13, tone: ITEM_TONES[k] }));
    for (let copy = 0; copy < counts[k]; copy++) {
      const h = w * unit;
      const by = bagTop + bagH - 4 - filled - h;
      filled += h;
      const block = box(`b${k}-${copy}`, bagX + 6, by + 1.5, `i = ${k + 1}`, { w: bagW - 12, h: h - 3, size: 12, tone: ITEM_TONES[k] });
      nodes.push(block, arrow(`a${k}-${copy}`, [colX[2] + colW[2] + (unbounded ? 40 : 10), y + rh / 2], [bagX - 6, by + h / 2], { tone: ITEM_TONES[k], width: 1.5 }));
    }
  });

  const picked = counts.flatMap((x, k) => Array<number>(x).fill(k));
  nodes.push(
    chip('sum:v', EX_W / 2, 248, seg(`${WORD.maxValue[l]}: ${picked.map((k) => val[k]).join(' + ')} = `, [String(value), 'ok', true]), { sans: true, size: 13 }),
    chip('sum:w', EX_W / 2, 282, seg(`${WORD.totalWeight[l]}: ${picked.map((k) => wgt[k]).join(' + ')} = `, [String(sum(picked.map((k) => wgt[k]))), 'accent', true]), {
      sans: true,
      size: 13,
    }),
  );
  return { w: EX_W, h: 318, nodes };
}

const knapsackExampleFig: StaticFigure = {
  type: 'static',
  build(l) {
    return {
      scene: knapsackExample(l, false),
      notes: [
        {
          en: 'Each item can be selected at most once. Items 2 and 3 fill the capacity of 50 exactly and give the maximum value.',
          zh: '每个物品只能选择一次。物品 2 和 3 恰好占满 50 的容量，价值最大。',
          'zh-hant': '每個物品只能選擇一次。物品 2 和 3 恰好佔滿 50 的容量，價值最大。',
          ja: '各品物は 1 回しか選べません。品物 2 と 3 で容量 50 をちょうど使い切り、価値が最大になります。',
          ru: 'Каждый предмет можно выбрать только один раз. Предметы 2 и 3 ровно заполняют вместимость 50 и дают максимальную стоимость.',
        }[l],
      ],
    };
  },
};

const unboundedKnapsackExampleFig: StaticFigure = {
  type: 'static',
  build(l) {
    return {
      scene: knapsackExample(l, true),
      notes: [
        {
          en: 'Each item can be selected multiple times: one item 1 and two items 2 give the maximum value.',
          zh: '每个物品可以重复选取：放入一个物品 1 和两个物品 2，价值最大。',
          'zh-hant': '每個物品可以重複選取：放入一個物品 1 和兩個物品 2，價值最大。',
          ja: '各品物は繰り返し選択できます。品物 1 を 1 個、品物 2 を 2 個入れると価値が最大になります。',
          ru: 'Каждый предмет можно выбирать многократно: один предмет 1 и два предмета 2 дают максимальную стоимость.',
        }[l],
      ],
    };
  },
};

// ── Knapsack recursion trees ──────────────────────────────────────────

interface KNode {
  id: string;
  i: number;
  c: number;
  parent: number;
  edge: 'no' | 'yes' | null;
  /** The "put in" branch cut because the item is heavier than the capacity. */
  pruned: boolean;
  /** Memoization: the state was already solved, so the call returns at once. */
  hit: boolean;
}

/** The calls made by knapsack_dfs (or knapsack_dfs_mem), in call order: "not put in" first. */
function knapsackCalls(memo: boolean): KNode[] {
  const { wgt, cap } = KNAP_TREE;
  const out: KNode[] = [];
  const seen = new Set<string>();
  const go = (i: number, c: number, parent: number, edge: KNode['edge'], id: string) => {
    const k = out.length;
    out.push({ id, i, c, parent, edge, pruned: false, hit: false });
    if (i === 0 || c === 0) return;
    if (memo && seen.has(`${i},${c}`)) {
      out[k].hit = true;
      return;
    }
    go(i - 1, c, k, 'no', `${id}n`);
    if (wgt[i - 1] > c) out.push({ id: `${id}y`, i: i - 1, c: c - wgt[i - 1], parent: k, edge: 'yes', pruned: true, hit: false });
    else go(i - 1, c - wgt[i - 1], k, 'yes', `${id}y`);
    seen.add(`${i},${c}`);
  };
  go(wgt.length, cap, -1, null, 't');
  return out;
}

const TREE_W = 460;

const TREE_LEGEND: Record<'no' | 'yes' | 'overlap' | 'cut' | 'found', T> = {
  no: { en: 'Do not put in item i', zh: '不放入物品 i', 'zh-hant': '不放入物品 i', ja: '品物 i を入れない', ru: 'не класть предмет i' },
  yes: { en: 'Put in item i (value + val)', zh: '放入物品 i（价值 + val）', 'zh-hant': '放入物品 i（價值 + val）', ja: '品物 i を入れる（価値 + val）', ru: 'положить предмет i (стоимость + val)' },
  overlap: { en: 'Overlapping subproblems (same color, same state)', zh: '重叠子问题（同色即同一状态）', 'zh-hant': '重疊子問題（同色即同一狀態）', ja: '重複部分問題（同じ色は同じ状態）', ru: 'перекрывающиеся подзадачи (один цвет — одно состояние)' },
  cut: { en: 'Pruning: item weight > capacity', zh: '剪枝：物品重量 > 背包容量', 'zh-hant': '剪枝：物品重量 > 背包容量', ja: '枝刈り：品物の重さ > 容量', ru: 'обрезка: вес предмета > вместимости' },
  found: { en: 'Pruning: record found in mem', zh: '剪枝：找到记录', 'zh-hant': '剪枝：找到記錄', ja: '枝刈り：記録が見つかった', ru: 'обрезка: запись найдена в mem' },
};

/** Draws the recursion tree; the layout always comes from the full brute-force tree, so both figures line up. */
function knapsackTree(l: Locale, memo: boolean) {
  const { wgt, val, cap } = KNAP_TREE;
  const full = knapsackCalls(false);
  const slots = treeSlots(
    full.map((n) => n.parent),
    2,
    TREE_W - 4,
    28,
    64,
  );
  const pos = new Map(full.map((n, k) => [n.id, slots[k]]));
  const calls = memo ? knapsackCalls(true) : full;

  // States solved more than once in the brute-force tree get a shared color.
  const repeatTone = new Map<string, Tone>();
  if (!memo) {
    const count = new Map<string, number>();
    for (const n of full) if (!n.pruned) count.set(`${n.i},${n.c}`, (count.get(`${n.i},${n.c}`) ?? 0) + 1);
    const palette: Tone[] = ['warn', 'info', 'accent'];
    for (const n of full) {
      const key = `${n.i},${n.c}`;
      if (!n.pruned && (count.get(key) ?? 0) > 1 && !repeatTone.has(key)) repeatTone.set(key, palette[repeatTone.size % palette.length]);
    }
  }
  const hitKeys = new Set(calls.filter((n) => n.hit).map((n) => `${n.i},${n.c}`));

  const boxes = new Map<string, BoxNode>();
  const nodes: SceneNode[] = [];
  for (const n of calls) {
    const p = pos.get(n.id)!;
    const key = `${n.i},${n.c}`;
    const w = n.pruned ? 64 : 58;
    let tone: Tone = 'idle';
    if (n.pruned) tone = 'ghost';
    else if (repeatTone.has(key)) tone = repeatTone.get(key)!;
    else if (hitKeys.has(key)) tone = 'warn';
    const b = box(`n:${n.id}`, p.x - w / 2, p.y - 13, `dp[${n.i},${n.c}]`, {
      w,
      h: 26,
      size: 11,
      tone,
      dashed: n.pruned || n.hit,
    });
    boxes.set(n.id, b);
    nodes.push(b);
  }
  for (const n of calls) {
    if (n.parent < 0) continue;
    const parent = calls[n.parent];
    const a = boxes.get(parent.id)!;
    const b = boxes.get(n.id)!;
    const yes = n.edge === 'yes';
    nodes.push(link(`e:${n.id}`, a, b, { tone: n.pruned ? 'danger' : yes ? 'ok' : 'muted', dashed: n.pruned || n.hit, width: 1.5, pad: 2 }));
    if (yes && !n.pruned) {
      const pa = pos.get(parent.id)!;
      const pb = pos.get(n.id)!;
      nodes.push(text(`v:${n.id}`, (pa.x + pb.x) / 2 + 7, (pa.y + pb.y) / 2 + 4, `+${val[parent.i - 1]}`, { mono: true, bold: true, size: 11, tone: 'ok' }));
    }
    if (n.pruned) {
      nodes.push(chip(`cut:${n.id}`, b.x + b.w / 2, b.y + b.h + 8, `${wgt[parent.i - 1]} > ${parent.c}`, { size: 11, tone: 'danger' }));
    }
    if (n.hit) {
      nodes.push(chip(`hit:${n.id}`, b.x + b.w / 2, b.y + b.h + 8, WORD.found[l], { size: 11, sans: true, tone: 'warn' }));
    }
  }
  nodes.push(
    text(
      'data',
      TREE_W / 2,
      268,
      seg('wgt = ', [`[${wgt.join(', ')}]`, 'info', true], '   val = ', [`[${val.join(', ')}]`, 'ok', true], '   cap = ', [String(cap), 'accent', true]),
      { anchor: 'middle', mono: true, size: 12 },
    ),
  );
  const legend: LegendItem[] = [
    { tone: 'muted', text: TREE_LEGEND.no[l], shape: 'line' },
    { tone: 'ok', text: TREE_LEGEND.yes[l], shape: 'line' },
    memo ? { tone: 'warn', text: TREE_LEGEND.found[l], dashed: true } : { tone: 'warn', text: TREE_LEGEND.overlap[l] },
    { tone: 'ghost', text: TREE_LEGEND.cut[l], dashed: true },
  ];
  return { scene: { w: TREE_W, h: 282, nodes }, legend };
}

const knapsackDfsFig: StaticFigure = {
  type: 'static',
  build(l) {
    return {
      ...knapsackTree(l, false),
      notes: [
        {
          en: 'Each node dp[i, c] is the maximum value of the first i items in a knapsack of capacity c. Every item adds two branches, so the time is O(2ⁿ), and subproblems such as dp[1, 10] are solved more than once.',
          zh: '节点 dp[i, c] 表示前 i 个物品在容量为 c 的背包中的最大价值。每个物品都产生不选和选两条分支，时间复杂度为 O(2ⁿ)，且 dp[1, 10] 等子问题被重复求解。',
          'zh-hant': '節點 dp[i, c] 表示前 i 個物品在容量為 c 的背包中的最大價值。每個物品都產生不選和選兩條分支，時間複雜度為 O(2ⁿ)，且 dp[1, 10] 等子問題被重複求解。',
          ja: 'ノード dp[i, c] は、先頭 i 個の品物を容量 c のナップサックに入れるときの最大価値です。各品物で 2 つの分岐が生じるため時間計算量は O(2ⁿ) で、dp[1, 10] などの部分問題が重複して計算されます。',
          ru: 'Узел dp[i, c] — максимальная стоимость первых i предметов в рюкзаке вместимости c. Каждый предмет дает две ветви, поэтому время O(2ⁿ), а подзадачи вроде dp[1, 10] решаются повторно.',
        }[l],
      ],
    };
  },
};

const knapsackDfsMemFig: StaticFigure = {
  type: 'static',
  build(l) {
    return {
      ...knapsackTree(l, true),
      notes: [
        {
          en: 'The second call of dp[1, 10] finds its record in mem and returns it directly, so its whole subtree is pruned. The time now depends on the number of subproblems: O(n × cap).',
          zh: '第二次调用 dp[1, 10] 时在 mem 中找到记录并直接返回，其整棵子树被剪掉。时间复杂度取决于子问题数量，即 O(n × cap)。',
          'zh-hant': '第二次呼叫 dp[1, 10] 時在 mem 中找到記錄並直接返回，其整棵子樹被剪掉。時間複雜度取決於子問題數量，即 O(n × cap)。',
          ja: '2 回目の dp[1, 10] の呼び出しでは mem に記録が見つかるのでそのまま返し、その部分木全体が枝刈りされます。時間計算量は部分問題の数に依存し、O(n × cap) です。',
          ru: 'Второй вызов dp[1, 10] находит запись в mem и сразу возвращает ее, поэтому все его поддерево отсекается. Теперь время зависит от числа подзадач: O(n × cap).',
        }[l],
      ],
    };
  },
};

// ── dp tables ─────────────────────────────────────────────────────────

interface Geom {
  x: number;
  y: number;
  cw: number;
  ch: number;
  gap: number;
}

const cellOf = (g: Geom, r: number, c: number) => gridAt(g.x, g.y, r, c, g.cw, g.ch, g.gap);

/** Row and column indices around a dp table, with the split corner naming both. */
function tableLabels(p: string, g: Geom, rows: number, cols: number, rv: string, cv: string, hot: { r?: number; c?: number } = {}): SceneNode[] {
  const nodes: SceneNode[] = [];
  for (let c = 0; c < cols; c++) {
    const b = cellOf(g, 0, c);
    nodes.push(text(`${p}cx${c}`, b.x + g.cw / 2, g.y - 8, String(c), { anchor: 'middle', mono: true, size: 12, tone: hot.c === c ? 'accent' : 'muted', bold: hot.c === c }));
  }
  for (let r = 0; r < rows; r++) {
    const b = cellOf(g, r, 0);
    nodes.push(text(`${p}rx${r}`, g.x - 10, b.y + g.ch / 2 + 4, String(r), { anchor: 'end', mono: true, size: 12, tone: hot.r === r ? 'accent' : 'muted', bold: hot.r === r }));
  }
  nodes.push(
    { kind: 'path', id: `${p}corner`, d: `M ${g.x - 30} ${g.y - 24} L ${g.x - 4} ${g.y - 3}`, tone: 'muted', width: 1 },
    text(`${p}cv`, g.x - 4, g.y - 14, cv, { anchor: 'end', mono: true, size: 12, bold: true, tone: 'muted' }),
    text(`${p}rv`, g.x - 30, g.y - 2, rv, { mono: true, size: 12, bold: true, tone: 'muted' }),
  );
  return nodes;
}

/** The cells of a dp table: unfilled cells are faint, others take a tone from `look` (`r,c` keys). */
function board(p: string, g: Geom, shown: string[][], filled: (r: number, c: number) => boolean, look: Record<string, Tone>, ring: string | null, size = 14) {
  const rows: Cell[][] = shown.map((row, r) =>
    row.map((v, c) => {
      const key = `${r},${c}`;
      if (!filled(r, c)) return { value: v, tone: 'ghost' as Tone, dim: true };
      return { value: v, tone: look[key] ?? 'idle', ring: ring === key };
    }),
  );
  return grid(p, g.x, g.y, rows, { w: g.cw, h: g.ch, gap: g.gap, size });
}

/** Cursor over a table filled row by row: cells up to (r, c) are filled, plus row 0 / column 0 when given. */
const filledUpTo = (cur: [number, number] | null, base: (r: number, c: number) => boolean) => (r: number, c: number) =>
  base(r, c) || (cur !== null && r >= 1 && c >= 1 && (r < cur[0] || (r === cur[0] && c <= cur[1])));

// ── 0-1 knapsack: dp table, row by row ────────────────────────────────

type KnapKind = 'init' | 'skip' | 'max' | 'done';

const KNAP_SAY: Record<KnapKind, T> = {
  init: {
    en: 'Initialize a dp table of size (n + 1) × (cap + 1) = {r} × {cl}. Row 0 (no items) and column 0 (capacity 0) are 0.',
    zh: '初始化尺寸为 (n + 1) × (cap + 1) = {r} × {cl} 的 dp 表。首行（无物品）和首列（容量为 0）都为 0。',
    'zh-hant': '初始化尺寸為 (n + 1) × (cap + 1) = {r} × {cl} 的 dp 表。首行（無物品）和首列（容量為 0）都為 0。',
    ja: 'サイズ (n + 1) × (cap + 1) = {r} × {cl} の dp テーブルを初期化します。先頭行（品物なし）と先頭列（容量 0）は 0 です。',
    ru: 'Создаем таблицу dp размера (n + 1) × (cap + 1) = {r} × {cl}. Первая строка (нет предметов) и первый столбец (вместимость 0) равны 0.',
  },
  skip: {
    en: 'dp[{i}, {c}]: item {i} weighs {w} > {c}, so it can only be left out. Take dp[{p}, {c}] = {v} from above.',
    zh: 'dp[{i}, {c}]：物品 {i} 的重量 {w} > {c}，只能不放入，取上方的 dp[{p}, {c}] = {v}。',
    'zh-hant': 'dp[{i}, {c}]：物品 {i} 的重量 {w} > {c}，只能不放入，取上方的 dp[{p}, {c}] = {v}。',
    ja: 'dp[{i}, {c}]：品物 {i} の重さ {w} > {c} なので、入れない選択しかできません。真上の dp[{p}, {c}] = {v} を使います。',
    ru: 'dp[{i}, {c}]: вес предмета {i} равен {w} > {c}, его можно только не брать. Берем значение сверху dp[{p}, {c}] = {v}.',
  },
  max: {
    en: 'dp[{i}, {c}] is the larger of not putting item {i} in ({no}) and putting it in ({base} + {val} = {yes}): {v}.',
    zh: 'dp[{i}, {c}] 取不放入物品 {i}（{no}）和放入物品 {i}（{base} + {val} = {yes}）中的较大值：{v}。',
    'zh-hant': 'dp[{i}, {c}] 取不放入物品 {i}（{no}）和放入物品 {i}（{base} + {val} = {yes}）中的較大值：{v}。',
    ja: 'dp[{i}, {c}] は、品物 {i} を入れない場合（{no}）と入れる場合（{base} + {val} = {yes}）の大きい方で、{v} です。',
    ru: 'dp[{i}, {c}] — большее из «не брать предмет {i}» ({no}) и «взять» ({base} + {val} = {yes}): {v}.',
  },
  done: {
    en: 'The table is full. Return dp[{n}, {cap}] = {v}, the maximum value that fits in the knapsack.',
    zh: '表格填写完毕，返回 dp[{n}, {cap}] = {v}，即背包能放入物品的最大价值。',
    'zh-hant': '表格填寫完畢，返回 dp[{n}, {cap}] = {v}，即背包能放入物品的最大價值。',
    ja: 'テーブルが埋まりました。ナップサックに入れられる最大価値 dp[{n}, {cap}] = {v} を返します。',
    ru: 'Таблица заполнена. Возвращаем dp[{n}, {cap}] = {v} — максимальную стоимость, которая помещается в рюкзак.',
  },
};

const KNAP_LEGEND: Record<'no' | 'yes' | 'cur', T> = {
  no: { en: 'Not put in item i: dp[i-1, c]', zh: '不放入物品 i：dp[i-1, c]', 'zh-hant': '不放入物品 i：dp[i-1, c]', ja: '品物 i を入れない：dp[i-1, c]', ru: 'не класть предмет i: dp[i-1, c]' },
  yes: {
    en: 'Put in item i: dp[i-1, c-wgt[i-1]] + val[i-1]',
    zh: '放入物品 i：dp[i-1, c-wgt[i-1]] + val[i-1]',
    'zh-hant': '放入物品 i：dp[i-1, c-wgt[i-1]] + val[i-1]',
    ja: '品物 i を入れる：dp[i-1, c-wgt[i-1]] + val[i-1]',
    ru: 'положить предмет i: dp[i-1, c-wgt[i-1]] + val[i-1]',
  },
  cur: { en: 'Current state dp[i, c]', zh: '当前状态 dp[i, c]', 'zh-hant': '當前狀態 dp[i, c]', ja: '現在の状態 dp[i, c]', ru: 'текущее состояние dp[i, c]' },
};

const TABLE_W = 400;

const knapsackDpSteps: StepFigure = {
  type: 'steps',
  call: 'knapsack_dp(wgt, val, cap)',
  tones: { init: 'idle', skip: 'cmp', max: 'swp', done: 'done' },
  sources: funcSources(KNAP_PY, KNAP_JAVA, ['knapsack_dp'], {
    python: {
      init: ['dp = [[0] * (cap + 1) for _ in range(n + 1)]'],
      skip: ['if wgt[i - 1] > c:', 'dp[i][c] = dp[i - 1][c]'],
      max: ['dp[i][c] = max(dp[i - 1][c], dp[i - 1][c - wgt[i - 1]] + val[i - 1])'],
      done: ['return dp[n][cap]'],
    },
    java: {
      init: ['int[][] dp = new int[n + 1][cap + 1];'],
      skip: ['if (wgt[i - 1] > c) {', 'dp[i][c] = dp[i - 1][c];'],
      max: ['dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - wgt[i - 1]] + val[i - 1]);'],
      done: ['return dp[n][cap];'],
    },
  }),
  build(l) {
    const { wgt, val, cap } = KNAP_DP;
    const n = wgt.length;
    const dp = knapsackTable(wgt, val, cap);
    const g: Geom = { x: 157, y: 34, cw: 40, ch: 30, gap: 4 };
    const itemX = [27, 71];
    const shown = (cur: [number, number] | null, full: boolean) =>
      dp.map((row, r) => row.map((v, c) => (full || r === 0 || c === 0 || (cur && (r < cur[0] || (r === cur[0] && c <= cur[1]))) ? String(v) : '0')));
    const scene = (cur: [number, number] | null, o: { full?: boolean; look?: Record<string, Tone>; ring?: string | null; formula: Rich; hotRow?: number }) => {
      const filled = o.full ? () => true : filledUpTo(cur, (r, c) => r === 0 || c === 0);
      const nodes: SceneNode[] = [
        ...tableLabels('t', g, n + 1, cap + 1, 'i', 'c', cur ? { r: cur[0], c: cur[1] } : {}),
        ...board('d', g, shown(cur, Boolean(o.full)), filled, o.look ?? {}, o.ring ?? null),
        text('hw', itemX[0] + g.cw / 2, g.y + g.ch / 2 + 5, 'wgt', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
        text('hv', itemX[1] + g.cw / 2, g.y + g.ch / 2 + 5, 'val', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
      ];
      for (let i = 1; i <= n; i++) {
        const y = cellOf(g, i, 0).y;
        const hot = o.hotRow === i;
        nodes.push(
          box(`iw${i}`, itemX[0], y, wgt[i - 1], { w: g.cw, h: g.ch, size: 14, tone: hot ? 'accent' : 'muted' }),
          box(`iv${i}`, itemX[1], y, val[i - 1], { w: g.cw, h: g.ch, size: 14, tone: hot ? 'accent' : 'muted' }),
        );
      }
      nodes.push(chip('f', TABLE_W / 2, 186, o.formula, { size: 13 }));
      return { w: TABLE_W, h: 226, nodes };
    };

    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene(null, { formula: seg('dp: (n + 1) × (cap + 1) = ', [`${n + 1} × ${cap + 1}`, 'accent', true]) }),
        say: fmt(KNAP_SAY.init[l], { r: n + 1, cl: cap + 1 }),
      },
    ];
    for (let i = 1; i <= n; i++) {
      for (let c = 1; c <= cap; c++) {
        const w = wgt[i - 1];
        const v = dp[i][c];
        const key = `${i},${c}`;
        if (w > c) {
          frames.push({
            kind: 'skip',
            scene: scene([i, c], {
              look: { [`${i - 1},${c}`]: 'info', [key]: 'ok' },
              ring: key,
              hotRow: i,
              formula: seg(`wgt[${i - 1}] = ${w} > ${c}  →  dp[${i},${c}] = dp[${i - 1},${c}] = `, [String(v), 'ok', true]),
            }),
            say: fmt(KNAP_SAY.skip[l], { i, c, w, p: i - 1, v }),
          });
          continue;
        }
        const no = dp[i - 1][c];
        const base = dp[i - 1][c - w];
        frames.push({
          kind: 'max',
          scene: scene([i, c], {
            look: { [`${i - 1},${c}`]: 'info', [`${i - 1},${c - w}`]: 'warn', [key]: 'ok' },
            ring: key,
            hotRow: i,
            formula: seg(`dp[${i},${c}] = max(`, [String(no), 'info', true], ', ', [String(base), 'warn', true], ' + ', [String(val[i - 1]), 'warn'], ') = ', [String(v), 'ok', true]),
          }),
          say: fmt(KNAP_SAY.max[l], { i, c, no, base, val: val[i - 1], yes: base + val[i - 1], v }),
        });
      }
    }
    frames.push({
      kind: 'done',
      scene: scene(null, { full: true, look: { [`${n},${cap}`]: 'ok' }, ring: `${n},${cap}`, formula: seg(`return dp[${n},${cap}] = `, [String(dp[n][cap]), 'ok', true]) }),
      say: fmt(KNAP_SAY.done[l], { n, cap, v: dp[n][cap] }),
    });
    return {
      frames,
      legend: [
        { tone: 'info', text: KNAP_LEGEND.no[l] },
        { tone: 'warn', text: KNAP_LEGEND.yes[l] },
        { tone: 'ok', text: KNAP_LEGEND.cur[l] },
      ],
    };
  },
};

// ── Space optimization: one array, reverse (0-1) or forward (unbounded) ──

type CompKind = 'init' | 'step' | 'skip' | 'done' | 'wrong';

const COMP_SAY: Record<'init' | 'skip' | 'done' | 'stepRev' | 'stepFwd' | 'wrong', T> = {
  init: {
    en: 'Before traversing row i = {i}, the single array dp still holds all the solutions of row i = {p}.',
    zh: '在遍历 i = {i} 之前，数组 dp 中存储的是 i = {p} 这一行的全部解。',
    'zh-hant': '在走訪 i = {i} 之前，陣列 dp 中儲存的是 i = {p} 這一行的全部解。',
    ja: 'i = {i} の走査を始める前、配列 dp には i = {p} 行目の解がすべて格納されています。',
    ru: 'Перед обходом строки i = {i} массив dp хранит все решения строки i = {p}.',
  },
  stepRev: {
    en: 'Reverse traversal, c = {c}: dp[{c}] = max({no}, dp[{s}] + {val}) = {v}. dp[{s}] has not been overwritten yet, so it is still dp[{p}, {s}].',
    zh: '倒序遍历，c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] 尚未被覆盖，仍是 dp[{p}, {s}]。',
    'zh-hant': '倒序走訪，c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] 尚未被覆蓋，仍是 dp[{p}, {s}]。',
    ja: '逆方向に走査、c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] はまだ上書きされておらず、dp[{p}, {s}] のままです。',
    ru: 'Обход справа налево, c = {c}: dp[{c}] = max({no}, dp[{s}] + {val}) = {v}. dp[{s}] еще не перезаписан и равен dp[{p}, {s}].',
  },
  stepFwd: {
    en: 'Forward traversal, c = {c}: dp[{c}] = max({no}, dp[{s}] + {val}) = {v}. dp[{s}] already holds dp[{i}, {s}] of the current row, so item {i} can be put in again.',
    zh: '正序遍历，c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] 已是当前行的 dp[{i}, {s}]，因此物品 {i} 可以再次放入。',
    'zh-hant': '正序走訪，c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] 已是當前行的 dp[{i}, {s}]，因此物品 {i} 可以再次放入。',
    ja: '順方向に走査、c = {c}：dp[{c}] = max({no}, dp[{s}] + {val}) = {v}。dp[{s}] はすでに現在の行の dp[{i}, {s}] なので、品物 {i} を再び入れられます。',
    ru: 'Обход слева направо, c = {c}: dp[{c}] = max({no}, dp[{s}] + {val}) = {v}. dp[{s}] уже содержит dp[{i}, {s}] текущей строки, поэтому предмет {i} можно взять снова.',
  },
  skip: {
    en: 'c = {c}: item {i} weighs {w} > {c}, so dp[{c}] keeps {v}.',
    zh: 'c = {c}：物品 {i} 的重量 {w} > {c}，dp[{c}] 保持 {v} 不变。',
    'zh-hant': 'c = {c}：物品 {i} 的重量 {w} > {c}，dp[{c}] 保持 {v} 不變。',
    ja: 'c = {c}：品物 {i} の重さ {w} > {c} なので、dp[{c}] は {v} のままです。',
    ru: 'c = {c}: вес предмета {i} равен {w} > {c}, поэтому dp[{c}] остается равным {v}.',
  },
  done: {
    en: 'After the traversal, the array dp holds all the solutions of row i = {i}.',
    zh: '遍历完成后，数组 dp 存储的是 i = {i} 这一行的全部解。',
    'zh-hant': '走訪完成後，陣列 dp 儲存的是 i = {i} 這一行的全部解。',
    ja: '走査を終えると、配列 dp には i = {i} 行目の解がすべて格納されています。',
    ru: 'После обхода массив dp хранит все решения строки i = {i}.',
  },
  wrong: {
    en: 'Why not traverse forward? Then dp[{s}] would already be overwritten with {nv}, and dp[{c}] = {nv} + {val} = {bad} would put item {i} in twice (correct: {good}).',
    zh: '为什么不能正序遍历？那样 dp[{s}] 已被覆盖为 {nv}，dp[{c}] = {nv} + {val} = {bad}，物品 {i} 被放入了两次（正确值为 {good}）。',
    'zh-hant': '為什麼不能正序走訪？那樣 dp[{s}] 已被覆蓋為 {nv}，dp[{c}] = {nv} + {val} = {bad}，物品 {i} 被放入了兩次（正確值為 {good}）。',
    ja: 'なぜ順方向ではだめなのでしょうか？その場合 dp[{s}] はすでに {nv} に上書きされ、dp[{c}] = {nv} + {val} = {bad} となり、品物 {i} を 2 回入れてしまいます（正しくは {good}）。',
    ru: 'Почему не слева направо? Тогда dp[{s}] уже был бы перезаписан значением {nv}, и dp[{c}] = {nv} + {val} = {bad}: предмет {i} положен дважды (верно: {good}).',
  },
};

const COMP_LEGEND: Record<'old' | 'new' | 'src', T> = {
  old: { en: 'Row i-1 (not yet updated)', zh: '第 i-1 行（尚未更新）', 'zh-hant': '第 i-1 行（尚未更新）', ja: 'i-1 行目（未更新）', ru: 'строка i-1 (еще не обновлена)' },
  new: { en: 'Row i (updated)', zh: '第 i 行（已更新）', 'zh-hant': '第 i 行（已更新）', ja: 'i 行目（更新済み）', ru: 'строка i (уже обновлена)' },
  src: { en: 'Read when putting in: dp[c-wgt[i-1]]', zh: '放入时读取：dp[c-wgt[i-1]]', 'zh-hant': '放入時讀取：dp[c-wgt[i-1]]', ja: '入れる場合に読む値：dp[c-wgt[i-1]]', ru: 'читается при «взять»: dp[c-wgt[i-1]]' },
};

/** Transition from row i - 1 to row i = 2 with a single array; the 2D table above shows where each value lives. */
function compFigure(unbounded: boolean): StepFigure {
  const COMP_W = 420;
  const fn = unbounded ? 'unbounded_knapsack_dp_comp' : 'knapsack_dp_comp';
  return {
    type: 'steps',
    call: `${fn}(wgt, val, cap)`,
    tones: { init: 'idle', step: 'swp', skip: 'cmp', done: 'done', wrong: 'cmp' },
    sources: funcSources(unbounded ? UNBOUND_PY : KNAP_PY, unbounded ? UNBOUND_JAVA : KNAP_JAVA, [fn], {
      python: {
        init: ['for i in range(1, n + 1):'],
        step: ['dp[c] = max(dp[c], dp[c - wgt[i - 1]] + val[i - 1])'],
        skip: ['if wgt[i - 1] > c:', 'dp[c] = dp[c]'],
        done: ['return dp[cap]'],
        wrong: [unbounded ? 'for c in range(1, cap + 1):' : 'for c in range(cap, 0, -1):'],
      },
      java: {
        init: ['for (int i = 1; i <= n; i++) {'],
        step: ['dp[c] = Math.max(dp[c], dp[c - wgt[i - 1]] + val[i - 1]);'],
        skip: unbounded ? ['if (wgt[i - 1] > c) {', 'dp[c] = dp[c];'] : ['if (wgt[i - 1] <= c) {'],
        done: ['return dp[cap];'],
        wrong: [unbounded ? 'for (int c = 1; c <= cap; c++) {' : 'for (int c = cap; c >= 1; c--) {'],
      },
    }),
    build(l) {
      const { wgt, val, cap } = KNAP_DP;
      const n = wgt.length;
      const i = 2;
      const w = wgt[i - 1];
      const v = val[i - 1];
      const dp2 = knapsackTable(wgt, val, cap, unbounded);
      const g2: Geom = { x: 206, y: 30, cw: 34, ch: 24, gap: 3 };
      const aw = 44;
      const ag = 6;
      const ax = (COMP_W - rowWidth(cap + 1, aw, ag)) / 2;
      const ay = 180;
      const acx = (c: number) => cellX(ax, c, aw, ag) + aw / 2;

      interface State {
        arr: number[];
        isNew: boolean[];
        cur?: number;
        src?: number;
        /** Row of the source in the 2D table. */
        srcRow?: number;
        bad?: number;
        formula: Rich;
        dir: boolean;
      }
      const scene = (st: State) => {
        const filled2 = (r: number, c: number) => r < i || c === 0 || (r === i && st.isNew[c]);
        const look: Record<string, Tone> = {};
        for (let c = 1; c <= cap; c++) {
          if (!st.isNew[c]) look[`${i - 1},${c}`] = 'info';
          else look[`${i},${c}`] = 'ok';
        }
        if (st.src !== undefined && st.srcRow !== undefined && st.src > 0) look[`${st.srcRow},${st.src}`] = 'warn';
        if (st.bad !== undefined) look[`${i},${st.bad}`] = 'danger';
        // The wrong (forward) frame shows the value the array would hold.
        const shown2 = dp2.map((row, r) => row.map((x, c) => (r === i && c === st.bad ? String(st.arr[c]) : filled2(r, c) ? String(x) : '0')));
        const nodes: SceneNode[] = [
          ...tableLabels('t', g2, n + 1, cap + 1, 'i', 'c', st.cur !== undefined ? { r: i, c: st.cur } : { r: i }),
          ...board('d', g2, shown2, filled2, look, st.cur !== undefined ? `${i},${st.cur}` : st.bad !== undefined ? `${i},${st.bad}` : null, 12),
          text('it', 14, 54, seg('i = ', [String(i), 'accent', true]), { mono: true, size: 12 }),
          text('iw', 14, 76, seg(`wgt[${i - 1}] = `, [String(w), 'warn', true]), { mono: true, size: 12 }),
          text('iv', 14, 98, seg(`val[${i - 1}] = `, [String(v), 'warn', true]), { mono: true, size: 12 }),
          rowLabel('l:dp', ax - 10, ay, 36, 'dp', 'idle'),
          ...cells(
            'a',
            ax,
            ay,
            st.arr.map((x, c) => ({
              value: x,
              tone: c === st.bad ? 'danger' : c === 0 ? 'idle' : st.isNew[c] ? 'ok' : 'info',
              ring: c === st.cur || c === st.bad,
            })),
            { w: aw, h: 36, gap: ag, size: 15 },
          ),
          text('l:c', ax - 10, ay + 54, 'c', { anchor: 'end', mono: true, bold: true, size: 12, tone: 'muted' }),
          ...indices('ax', ax, ay + 54, Array.from({ length: cap + 1 }, (_, c) => c), { w: aw, gap: ag, tone: (c) => (c === st.cur || c === st.bad ? 'accent' : undefined) }),
        ];
        const target = st.cur ?? st.bad;
        if (target !== undefined && st.src !== undefined) {
          nodes.push(
            arrow('take', [acx(st.src), ay - 3], [acx(target), ay - 3], { bend: -16, tone: st.bad !== undefined ? 'danger' : 'warn', width: 1.75 }),
            text('take:v', (acx(st.src) + acx(target)) / 2, ay - 26, `+${v}`, { anchor: 'middle', mono: true, bold: true, size: 12, tone: st.bad !== undefined ? 'danger' : 'warn' }),
          );
        }
        const left = ax;
        const right = ax + rowWidth(cap + 1, aw, ag);
        const fwd = st.dir;
        nodes.push(
          arrow('dir', fwd ? [left + 4, ay + 66] : [right - 4, ay + 66], fwd ? [right - 4, ay + 66] : [left + 4, ay + 66], { tone: 'accent', width: 1.5 }),
          text('dir:l', COMP_W / 2, ay + 84, WORD[fwd ? 'forward' : 'reverse'][l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
          chip('f', COMP_W / 2, ay + 94, st.formula, { size: 13 }),
        );
        return { w: COMP_W, h: ay + 132, nodes };
      };

      const order = Array.from({ length: cap }, (_, k) => (unbounded ? k + 1 : cap - k));
      const arr = [...dp2[i - 1]];
      const isNew = Array<boolean>(cap + 1).fill(false);
      const list = (xs: number[]) => `[${xs.join(', ')}]`;
      const frames: SceneFrame[] = [
        {
          kind: 'init',
          scene: scene({ arr: [...arr], isNew: [...isNew], dir: unbounded, formula: seg(`i = ${i - 1}:  dp = `, [list(arr), 'info', true]) }),
          say: fmt(COMP_SAY.init[l], { i, p: i - 1 }),
        },
      ];
      for (const c of order) {
        if (w > c) {
          isNew[c] = true;
          frames.push({
            kind: 'skip',
            scene: scene({ arr: [...arr], isNew: [...isNew], cur: c, dir: unbounded, formula: seg(`wgt[${i - 1}] = ${w} > ${c}  →  dp[${c}] = `, [String(arr[c]), 'ok', true]) }),
            say: fmt(COMP_SAY.skip[l], { c, i, w, v: arr[c] }),
          });
          continue;
        }
        const s = c - w;
        const no = arr[c];
        const base = arr[s];
        const res = Math.max(no, base + v);
        arr[c] = res;
        isNew[c] = true;
        const srcTone: Tone = s === 0 ? 'idle' : isNew[s] ? 'ok' : 'info';
        frames.push({
          kind: 'step',
          scene: scene({
            arr: [...arr],
            isNew: [...isNew],
            cur: c,
            src: s,
            srcRow: unbounded ? i : i - 1,
            dir: unbounded,
            formula: seg(`dp[${c}] = max(`, [String(no), 'info', true], ', ', [String(base), srcTone, true], ' + ', [String(v), 'warn', true], ') = ', [String(res), 'ok', true]),
          }),
          say: fmt(COMP_SAY[unbounded ? 'stepFwd' : 'stepRev'][l], { c, no, s, val: v, v: res, p: i - 1, i }),
        });
      }
      frames.push({
        kind: 'done',
        scene: scene({ arr: [...arr], isNew: [...isNew], dir: unbounded, formula: seg(`i = ${i}:  dp = `, [list(arr), 'ok', true]) }),
        say: fmt(COMP_SAY.done[l], { i }),
      });

      if (!unbounded) {
        // The same row traversed left to right: find the first value that goes wrong.
        const fwd = [...dp2[i - 1]];
        let bad = -1;
        let nv = 0;
        for (let c = 1; c <= cap; c++) {
          if (w > c) continue;
          const val2 = Math.max(fwd[c], fwd[c - w] + v);
          if (bad < 0 && val2 !== dp2[i][c]) {
            bad = c;
            nv = fwd[c - w];
          }
          fwd[c] = val2;
        }
        if (bad > 0) {
          const s = bad - w;
          const shownArr = dp2[i].map((x, c) => (c === bad ? nv + v : x));
          frames.push({
            kind: 'wrong',
            scene: scene({
              arr: shownArr,
              isNew: Array<boolean>(cap + 1).fill(true),
              src: s,
              srcRow: i,
              bad,
              dir: true,
              formula: seg(`dp[${bad}] = max(${dp2[i - 1][bad]}, `, [String(nv), 'ok', true], ` + ${v}) = `, [String(nv + v), 'danger', true], `  ≠ ${dp2[i][bad]}`),
            }),
            say: fmt(COMP_SAY.wrong[l], { s, nv, c: bad, val: v, bad: nv + v, i, good: dp2[i][bad] }),
          });
        }
      }
      return {
        frames,
        legend: [
          { tone: 'info', text: COMP_LEGEND.old[l] },
          { tone: 'ok', text: COMP_LEGEND.new[l] },
          { tone: 'warn', text: COMP_LEGEND.src[l] },
        ],
      };
    },
  };
}

// ── Coin change examples ──────────────────────────────────────────────

/** The coin table: index, denomination and a coin; the target amount on the right. */
function coinTable(l: Locale, amt: number): SceneNode[] {
  const nodes: SceneNode[] = [
    text('h:i', 77, 24, 'i', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
    text('h:c', 142, 24, 'coins[i-1]', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
    text('amt:w', 330, 48, WORD.amount[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
    text('amt', 330, 74, seg(['amt', undefined, true], ' = ', [String(amt), 'accent', true]), { anchor: 'middle', mono: true, size: 16 }),
  ];
  COINS.forEach((coin, k) => {
    const y = 34 + k * 34;
    nodes.push(
      box(`ci${k}`, 60, y, k + 1, { w: 34, h: 28, size: 13, tone: 'muted' }),
      box(`cv${k}`, 100, y, coin, { w: 84, h: 28, size: 13 }),
      box(`cc${k}`, 196, y + 1, coin, { w: 26, h: 26, shape: 'circle', size: 13, tone: COIN_TONES[k] }),
    );
  });
  return nodes;
}

/** An amount drawn as a bar of `amt` units, split into the coins that make it up. */
function coinBar(p: string, x: number, y: number, unit: number, h: number, coins: number[]): SceneNode[] {
  let at = 0;
  return coins.map((coin, k) => {
    const b = box(`${p}${k}`, x + at * unit + 1.5, y, coin, { w: coin * unit - 3, h, size: 13, tone: COIN_TONES[COINS.indexOf(coin)] });
    at += coin;
    return b;
  });
}

const coinChangeExampleFig: StaticFigure = {
  type: 'static',
  build(l) {
    const amt = COIN_EX_AMT;
    const combos = coinCombos(COINS, amt);
    const best = combos.reduce((a, b) => (b.length < a.length ? b : a));
    const W = 440;
    const unit = Math.floor(380 / amt);
    const x0 = (W - unit * amt) / 2;
    const barY = 190;
    const nodes: SceneNode[] = [
      ...coinTable(l, amt),
      chip('sum', W / 2, 146, seg(`${WORD.minCoins[l]}: `, [String(best.length), 'ok', true], `   (${best.join(' + ')} = ${amt})`), { sans: true, size: 13 }),
      ...coinBar('b', x0, barY, unit, 34, best),
    ];
    let at = 0;
    const ticks = [0, ...best.map((c) => (at += c))];
    ticks.forEach((t, k) => nodes.push(text(`tk${k}`, x0 + t * unit, barY + 52, String(t), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })));
    return {
      scene: { w: W, h: barY + 62, nodes },
      notes: [
        {
          en: 'Each coin can be selected multiple times. The fewest coins that make up exactly 11 are 1 + 5 + 5.',
          zh: '每种硬币可以重复选取。恰好凑出 11 的最少硬币组合为 1 + 5 + 5。',
          'zh-hant': '每種硬幣可以重複選取。恰好湊出 11 的最少硬幣組合為 1 + 5 + 5。',
          ja: '各硬貨は繰り返し選べます。ちょうど 11 を作る最小の組合せは 1 + 5 + 5 です。',
          ru: 'Монеты каждого вида можно брать многократно. Ровно 11 набирается минимум тремя монетами: 1 + 5 + 5.',
        }[l],
      ],
    };
  },
};

const coinChangeIIExampleFig: StaticFigure = {
  type: 'static',
  build(l) {
    const amt = COIN_II_AMT;
    const combos = coinCombos(COINS, amt);
    const W = 440;
    const unit = 40;
    const x0 = (W - unit * amt) / 2;
    const nodes: SceneNode[] = [...coinTable(l, amt), chip('sum', W / 2, 146, seg(`${WORD.combos[l]}: `, [String(combos.length), 'ok', true]), { sans: true, size: 13 })];
    combos.forEach((combo, r) => {
      const y = 190 + r * 38;
      nodes.push(...coinBar(`b${r}-`, x0, y, unit, 30, combo), text(`eq${r}`, x0 + unit * amt + 12, y + 20, `= ${amt}`, { mono: true, size: 12, tone: 'muted' }));
    });
    return {
      scene: { w: W, h: 190 + combos.length * 38 + 6, nodes },
      notes: [
        {
          en: 'The order of coins does not matter: 1 + 2 + 2 and 2 + 1 + 2 count as one combination.',
          zh: '硬币的顺序无关紧要：1 + 2 + 2 和 2 + 1 + 2 算作同一种组合。',
          'zh-hant': '硬幣的順序無關緊要：1 + 2 + 2 和 2 + 1 + 2 算作同一種組合。',
          ja: '硬貨の順序は問いません。1 + 2 + 2 と 2 + 1 + 2 は同じ 1 つの組合せです。',
          ru: 'Порядок монет не важен: 1 + 2 + 2 и 2 + 1 + 2 считаются одной комбинацией.',
        }[l],
      ],
    };
  },
};

// ── Coin change: dp table ─────────────────────────────────────────────

type CoinKind = 'init' | 'base' | 'skip' | 'min' | 'done';

const COIN_SAY: Record<CoinKind, T> = {
  init: {
    en: 'Initialize a dp table of size (n + 1) × (amt + 1) = {r} × {cl}. Column 0: making up amount 0 takes 0 coins.',
    zh: '初始化尺寸为 (n + 1) × (amt + 1) = {r} × {cl} 的 dp 表。首列：凑出金额 0 所需的硬币数量为 0。',
    'zh-hant': '初始化尺寸為 (n + 1) × (amt + 1) = {r} × {cl} 的 dp 表。首列：湊出金額 0 所需的硬幣數量為 0。',
    ja: 'サイズ (n + 1) × (amt + 1) = {r} × {cl} の dp テーブルを初期化します。先頭列：金額 0 を作るのに必要な硬貨は 0 枚です。',
    ru: 'Создаем таблицу dp размера (n + 1) × (amt + 1) = {r} × {cl}. Первый столбец: для суммы 0 нужно 0 монет.',
  },
  base: {
    en: 'Without coins no amount > 0 can be made up. Fill row 0 with MAX = amt + 1 = {max} to mark these invalid solutions.',
    zh: '没有硬币时无法凑出任何 > 0 的金额。首行填入 MAX = amt + 1 = {max}，表示无效解。',
    'zh-hant': '沒有硬幣時無法湊出任何 > 0 的金額。首行填入 MAX = amt + 1 = {max}，表示無效解。',
    ja: '硬貨がなければ > 0 の金額は作れません。先頭行に無効解を表す MAX = amt + 1 = {max} を入れます。',
    ru: 'Без монет нельзя набрать сумму > 0. Заполняем строку 0 значением MAX = amt + 1 = {max}, обозначающим недопустимое решение.',
  },
  skip: {
    en: 'dp[{i}, {a}]: coin {coin} > {a}, so coin {i} cannot be selected. Take dp[{p}, {a}] = {v} from above.',
    zh: 'dp[{i}, {a}]：硬币面值 {coin} > {a}，只能不选硬币 {i}，取上方的 dp[{p}, {a}] = {v}。',
    'zh-hant': 'dp[{i}, {a}]：硬幣面值 {coin} > {a}，只能不選硬幣 {i}，取上方的 dp[{p}, {a}] = {v}。',
    ja: 'dp[{i}, {a}]：額面 {coin} > {a} なので硬貨 {i} は選べません。真上の dp[{p}, {a}] = {v} を使います。',
    ru: 'dp[{i}, {a}]: номинал {coin} > {a}, монету {i} взять нельзя. Берем значение сверху dp[{p}, {a}] = {v}.',
  },
  min: {
    en: 'dp[{i}, {a}] is the smaller of not selecting coin {i} ({no}) and selecting one more coin {coin} ({base} + 1 = {yes}): {v}.',
    zh: 'dp[{i}, {a}] 取不选硬币 {i}（{no}）和再选一枚面值 {coin} 的硬币（{base} + 1 = {yes}）中的较小值：{v}。',
    'zh-hant': 'dp[{i}, {a}] 取不選硬幣 {i}（{no}）和再選一枚面值 {coin} 的硬幣（{base} + 1 = {yes}）中的較小值：{v}。',
    ja: 'dp[{i}, {a}] は、硬貨 {i} を選ばない場合（{no}）と額面 {coin} の硬貨をもう 1 枚選ぶ場合（{base} + 1 = {yes}）の小さい方で、{v} です。',
    ru: 'dp[{i}, {a}] — меньшее из «не брать монету {i}» ({no}) и «взять еще одну монету {coin}» ({base} + 1 = {yes}): {v}.',
  },
  done: {
    en: 'dp[{n}, {amt}] = {v} ≠ MAX, so return {v}: the minimum number of coins needed to make up the target amount.',
    zh: 'dp[{n}, {amt}] = {v} ≠ MAX，返回 {v}，即凑出目标金额所需的最少硬币数量。',
    'zh-hant': 'dp[{n}, {amt}] = {v} ≠ MAX，返回 {v}，即湊出目標金額所需的最少硬幣數量。',
    ja: 'dp[{n}, {amt}] = {v} ≠ MAX なので {v} を返します。これが目標金額を作るのに必要な最小の硬貨枚数です。',
    ru: 'dp[{n}, {amt}] = {v} ≠ MAX, поэтому возвращаем {v} — минимальное число монет для целевой суммы.',
  },
};

const COIN_LEGEND: Record<'no' | 'yes' | 'cur', T> = {
  no: { en: 'Not select coin i: dp[i-1, a]', zh: '不选硬币 i：dp[i-1, a]', 'zh-hant': '不選硬幣 i：dp[i-1, a]', ja: '硬貨 i を選ばない：dp[i-1, a]', ru: 'не брать монету i: dp[i-1, a]' },
  yes: {
    en: 'Select coin i: dp[i, a-coins[i-1]] + 1',
    zh: '选硬币 i：dp[i, a-coins[i-1]] + 1',
    'zh-hant': '選硬幣 i：dp[i, a-coins[i-1]] + 1',
    ja: '硬貨 i を選ぶ：dp[i, a-coins[i-1]] + 1',
    ru: 'взять монету i: dp[i, a-coins[i-1]] + 1',
  },
  cur: { en: 'Current state dp[i, a]', zh: '当前状态 dp[i, a]', 'zh-hant': '當前狀態 dp[i, a]', ja: '現在の状態 dp[i, a]', ru: 'текущее состояние dp[i, a]' },
};

const coinChangeDpSteps: StepFigure = {
  type: 'steps',
  call: 'coin_change_dp(coins, amt)',
  tones: { init: 'idle', base: 'idle', skip: 'cmp', min: 'swp', done: 'done' },
  sources: funcSources(COIN_PY, COIN_JAVA, ['coin_change_dp'], {
    python: {
      init: ['dp = [[0] * (amt + 1) for _ in range(n + 1)]'],
      base: ['dp[0][a] = MAX'],
      skip: ['if coins[i - 1] > a:', 'dp[i][a] = dp[i - 1][a]'],
      min: ['dp[i][a] = min(dp[i - 1][a], dp[i][a - coins[i - 1]] + 1)'],
      done: ['return dp[n][amt] if dp[n][amt] != MAX else -1'],
    },
    java: {
      init: ['int[][] dp = new int[n + 1][amt + 1];'],
      base: ['dp[0][a] = MAX;'],
      skip: ['if (coins[i - 1] > a) {', 'dp[i][a] = dp[i - 1][a];'],
      min: ['dp[i][a] = Math.min(dp[i - 1][a], dp[i][a - coins[i - 1]] + 1);'],
      done: ['return dp[n][amt] != MAX ? dp[n][amt] : -1;'],
    },
  }),
  build(l) {
    const amt = COIN_DP_AMT;
    const n = COINS.length;
    const MAX = amt + 1;
    const dp = table(n + 1, amt + 1);
    for (let a = 1; a <= amt; a++) dp[0][a] = MAX;
    for (let i = 1; i <= n; i++) {
      for (let a = 1; a <= amt; a++) dp[i][a] = COINS[i - 1] > a ? dp[i - 1][a] : Math.min(dp[i - 1][a], dp[i][a - COINS[i - 1]] + 1);
    }
    const show = (v: number) => (v >= MAX ? 'MAX' : String(v));
    const plusOne = (v: number) => (v >= MAX ? 'MAX + 1' : String(v + 1));
    const g: Geom = { x: 140, y: 34, cw: 44, ch: 30, gap: 4 };
    const coinX = 60;
    const scene = (cur: [number, number] | null, o: { row0?: boolean; full?: boolean; look?: Record<string, Tone>; ring?: string | null; formula: Rich; hotRow?: number }) => {
      const base = (r: number, c: number) => c === 0 || (r === 0 && Boolean(o.row0));
      const filled = o.full ? () => true : filledUpTo(cur, base);
      const shown = dp.map((row, r) => row.map((v, c) => (filled(r, c) ? show(v) : '0')));
      const nodes: SceneNode[] = [
        ...tableLabels('t', g, n + 1, amt + 1, 'i', 'a', cur ? { r: cur[0], c: cur[1] } : {}),
        ...board('d', g, shown, filled, o.look ?? {}, o.ring ?? null, 13),
        text('hc', coinX + 22, g.y + g.ch / 2 + 5, 'coins', { anchor: 'middle', mono: true, bold: true, size: 12, tone: 'muted' }),
      ];
      for (let i = 1; i <= n; i++) {
        const y = cellOf(g, i, 0).y;
        nodes.push(
          box(`co${i}`, coinX + 7, y, COINS[i - 1], { w: g.ch, h: g.ch, shape: 'circle', size: 13, tone: COIN_TONES[i - 1], ring: o.hotRow === i }),
        );
      }
      nodes.push(chip('f', TABLE_W / 2, 186, o.formula, { size: 13 }));
      return { w: TABLE_W, h: 226, nodes };
    };

    const row0Look = Object.fromEntries(Array.from({ length: amt }, (_, k) => [`0,${k + 1}`, 'ok' as Tone]));
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene(null, { formula: seg('dp: (n + 1) × (amt + 1) = ', [`${n + 1} × ${amt + 1}`, 'accent', true]) }),
        say: fmt(COIN_SAY.init[l], { r: n + 1, cl: amt + 1 }),
      },
      {
        kind: 'base',
        scene: scene(null, { row0: true, look: row0Look, formula: seg('dp[0, a] = MAX = amt + 1 = ', [String(MAX), 'accent', true]) }),
        say: fmt(COIN_SAY.base[l], { max: MAX }),
      },
    ];
    for (let i = 1; i <= n; i++) {
      for (let a = 1; a <= amt; a++) {
        const coin = COINS[i - 1];
        const v = dp[i][a];
        const key = `${i},${a}`;
        if (coin > a) {
          frames.push({
            kind: 'skip',
            scene: scene([i, a], {
              row0: true,
              look: { [`${i - 1},${a}`]: 'info', [key]: 'ok' },
              ring: key,
              hotRow: i,
              formula: seg(`coins[${i - 1}] = ${coin} > ${a}  →  dp[${i},${a}] = `, [show(v), 'ok', true]),
            }),
            say: fmt(COIN_SAY.skip[l], { i, a, coin, p: i - 1, v: show(v) }),
          });
          continue;
        }
        const no = dp[i - 1][a];
        const b = dp[i][a - coin];
        frames.push({
          kind: 'min',
          scene: scene([i, a], {
            row0: true,
            look: { [`${i - 1},${a}`]: 'info', [`${i},${a - coin}`]: 'warn', [key]: 'ok' },
            ring: key,
            hotRow: i,
            formula: seg(`dp[${i},${a}] = min(`, [show(no), 'info', true], ', ', [show(b), 'warn', true], ' + 1) = ', [show(v), 'ok', true]),
          }),
          say: fmt(COIN_SAY.min[l], { i, a, coin, no: show(no), base: show(b), yes: plusOne(b), v: show(v) }),
        });
      }
    }
    frames.push({
      kind: 'done',
      scene: scene(null, { full: true, look: { [`${n},${amt}`]: 'ok' }, ring: `${n},${amt}`, formula: seg(`return dp[${n},${amt}] = `, [show(dp[n][amt]), 'ok', true]) }),
      say: fmt(COIN_SAY.done[l], { n, amt, v: show(dp[n][amt]) }),
    });
    return {
      frames,
      legend: [
        { tone: 'info', text: COIN_LEGEND.no[l] },
        { tone: 'warn', text: COIN_LEGEND.yes[l] },
        { tone: 'ok', text: COIN_LEGEND.cur[l] },
      ],
    };
  },
};

// ── Edit distance: example ────────────────────────────────────────────

const editExampleFig: StaticFigure = {
  type: 'static',
  build(l) {
    const W = 440;
    const cw = 30;
    const gap = 4;
    const x0 = 46;
    const nodes: SceneNode[] = [];
    EDIT_EX.forEach(([s, t], p) => {
      const cols = editAlignment(s, t);
      const y0 = 16 + p * 140;
      const ty = y0 + 72;
      nodes.push(rowLabel(`ls${p}`, x0 - 10, y0, cw, 's =', 'idle'), rowLabel(`lt${p}`, x0 - 10, ty, cw, 't =', 'idle'));
      cols.forEach((col, k) => {
        const x = cellX(x0, k, cw, gap);
        const tone = OP_TONE[col.op];
        const sBox = col.a === null ? box(`s${p}-${k}`, x, y0, '', { w: cw, h: cw, tone: 'ghost', dashed: true }) : box(`s${p}-${k}`, x, y0, col.a, { w: cw, h: cw, size: 15, tone: col.op === 'match' ? 'idle' : tone });
        const tBox = col.b === null ? box(`t${p}-${k}`, x, ty, '', { w: cw, h: cw, tone: 'ghost', dashed: true }) : box(`t${p}-${k}`, x, ty, col.b, { w: cw, h: cw, size: 15, tone: col.op === 'match' ? 'idle' : tone });
        nodes.push(sBox, tBox);
        if (col.op === 'match') nodes.push(arrow(`m${p}-${k}`, [x + cw / 2, y0 + cw + 3], [x + cw / 2, ty - 3], { head: 'none', dashed: true, tone: 'muted', width: 1 }));
        else nodes.push(arrow(`o${p}-${k}`, [x + cw / 2, y0 + cw + 3], [x + cw / 2, ty - 3], { tone, width: 2 }));
      });
      const right = cellX(x0, cols.length, cw, gap) + 22;
      const kinds = (['replace', 'insert', 'delete'] as const).filter((op) => cols.some((c) => c.op === op));
      kinds.forEach((op, k) => {
        const count = cols.filter((c) => c.op === op).length;
        nodes.push(text(`n${p}-${op}`, right, y0 + 22 + k * 22, seg([OP_NAME[op][l], OP_TONE[op], true], ` × ${count}`), { size: 13 }));
      });
      const total = cols.filter((c) => c.op !== 'match').length;
      nodes.push(text(`tot${p}`, right, y0 + 22 + kinds.length * 22 + 6, seg(`${WORD.edits[l]}: `, [String(total), 'accent', true]), { size: 13, bold: true }));
    });
    return {
      scene: { w: W, h: 16 + 140 + 72 + cw + 14, nodes },
      legend: (['replace', 'insert', 'delete'] as const).map((op) => ({ tone: OP_TONE[op], text: OP_LEGEND[op][l] })),
    };
  },
};

// ── Edit distance: decision tree ──────────────────────────────────────

const editDecisionTreeFig: StaticFigure = {
  type: 'static',
  build(l) {
    const [s, t] = EDIT_EX[1];
    const W = 440;
    // Apply the edits of one shortest script from right to left, so earlier indices stay valid.
    const cols = editAlignment(s, t);
    const words: { chars: string[]; hot: number }[] = [{ chars: [...s], hot: -1 }];
    const labels: string[] = [];
    let chars = [...s];
    for (let k = cols.length - 1; k >= 0; k--) {
      const col = cols[k];
      if (col.op === 'match') continue;
      chars = [...chars];
      let hot = -1;
      if (col.op === 'replace') {
        chars[col.si] = col.b!;
        hot = col.si;
        labels.push(fmt(OP_DESC.replace[l], { a: col.a!, b: col.b! }));
      } else if (col.op === 'delete') {
        chars.splice(col.si, 1);
        labels.push(fmt(OP_DESC.delete[l], { a: col.a! }));
      } else {
        chars.splice(col.si, 0, col.b!);
        hot = col.si;
        labels.push(fmt(OP_DESC.insert[l], { b: col.b! }));
      }
      words.push({ chars, hot });
    }
    const levels = words.length;
    const xs = words.map((_, k) => 270 - k * 55);
    const ys = words.map((_, k) => 26 + k * 72);
    const nodes: SceneNode[] = [];
    words.forEach((wd, k) => {
      const label: Rich = wd.chars.flatMap((ch, j) => [...(j ? [{ t: ' ' }] : []), j === wd.hot ? { t: ch, tone: 'accent' as Tone, bold: true } : { t: ch }]);
      const last = k === levels - 1;
      const node = chip(`w${k}`, xs[k], ys[k] - 14, label, { size: 14, tone: k === 0 || last ? 'ok' : 'idle', ring: k === 0 || last });
      nodes.push(node);
      if (k === 0) nodes.push(text('ls', node.x - 8, ys[k] + 5, 's =', { anchor: 'end', mono: true, bold: true, size: 13 }));
      if (last) nodes.push(text('lt', node.x - 8, ys[k] + 5, 't =', { anchor: 'end', mono: true, bold: true, size: 13 }));
      if (last) return;
      const ny = ys[k + 1];
      nodes.push(arrow(`e${k}`, [xs[k], ys[k] + 15], [xs[k + 1], ny - 16], { tone: 'accent', width: 2 }));
      for (let d = 0; d < 3; d++) {
        const dx = xs[k] + 60 + d * 50;
        nodes.push(
          arrow(`f${k}-${d}`, [xs[k] + 4, ys[k] + 15], [dx, ny - 8], { tone: 'muted', width: 1.25 }),
          text(`dots${k}-${d}`, dx, ny + 6, '…', { anchor: 'middle', size: 16, bold: true, tone: 'muted' }),
        );
      }
      nodes.push(chip(`op${k}`, (xs[k] + xs[k + 1]) / 2 - 16, (ys[k] + ny) / 2 - 14, labels[k], { sans: true, size: 12, align: 'end' }));
    });
    return {
      scene: { w: W, h: ys[levels - 1] + 24, nodes },
      notes: [
        fmt(
          {
            en: 'Each node is a string and each edge one edit. Without restrictions every node branches into many edits; the goal is the shortest path from {s} to {t}.',
            zh: '每个节点对应一个字符串，每条边对应一次编辑操作。在不限制操作时，每个节点都能派生出许多条边；目标是求节点 {s} 到节点 {t} 的最短路径。',
            'zh-hant': '每個節點對應一個字串，每條邊對應一次編輯操作。在不限制操作時，每個節點都能派生出許多條邊；目標是求節點 {s} 到節點 {t} 的最短路徑。',
            ja: '各ノードは文字列、各辺は 1 回の編集操作に対応します。操作に制限がなければ各ノードから多くの辺が派生します。目標はノード {s} からノード {t} への最短経路を求めることです。',
            ru: 'Узлы — строки, ребра — операции редактирования. Без ограничений из каждого узла выходит много ребер; цель — кратчайший путь от узла {s} до узла {t}.',
          }[l],
          { s, t },
        ),
      ],
    };
  },
};

// ── Edit distance: the three transitions ──────────────────────────────

const editStateTransferFig: StaticFigure = {
  type: 'static',
  build(l) {
    const { s, t } = EDIT_TRANSFER;
    const a = s[s.length - 1];
    const b = t[t.length - 1];
    const W = 460;
    const cw = 22;
    const gap = 3;
    const startX = 36;
    const midX = 172;
    const endX = 330;
    const pairH = cw * 2 + 4;
    interface Ch {
      ch: string;
      tone?: Tone;
      ring?: boolean;
      dim?: boolean;
      dashed?: boolean;
    }
    const pair = (p: string, x: number, y: number, sc: Ch[], tc: Ch[]): SceneNode[] => {
      const row = (q: string, yy: number, cs: Ch[], base: Tone): SceneNode[] =>
        cells(
          q,
          x,
          yy,
          cs.map((c) => ({ value: c.ch, tone: c.dim ? 'ghost' : c.tone ?? base, ring: c.ring, dashed: c.dashed ?? false, dim: c.dim })),
          { w: cw, h: cw, gap, size: 12 },
        );
      return [...row(`${p}s`, y, sc, 'idle'), ...row(`${p}t`, y + cw + 4, tc, 'idle')];
    };
    const chars = (str: string, o: (k: number) => Partial<Ch> = () => ({})): Ch[] => [...str].map((ch, k) => ({ ch, ...o(k) }));
    const lastRing = (str: string) => chars(str, (k) => ({ ring: k === str.length - 1 }));
    const dpLabel = (id: string, x: number, y: number, di: string, dj: string) =>
      text(id, x, y, seg('dp[', [di, 'idle', true], ', ', [dj, 'idle', true], ']'), { anchor: 'middle', mono: true, size: 13 });
    const pairW = (len: number) => rowWidth(len, cw, gap);

    const tops = [24, 140, 256];
    const startY = tops[1] + 30;
    const nodes: SceneNode[] = [
      ...pair('st', startX, startY, lastRing(s), lastRing(t)),
      text('st:s', startX - 6, startY + cw / 2 + 5, 's =', { anchor: 'end', mono: true, bold: true, size: 12 }),
      text('st:t', startX - 6, startY + cw + 4 + cw / 2 + 5, 't =', { anchor: 'end', mono: true, bold: true, size: 12 }),
      dpLabel('st:dp', startX + pairW(s.length) / 2, startY + pairH + 18, 'i', 'j'),
    ];
    const cases: { op: Exclude<Op, 'match'>; mid: [Ch[], Ch[]]; end: [Ch[], Ch[]]; di: string; dj: string }[] = [
      {
        op: 'insert',
        mid: [[...chars(s), { ch: b, tone: OP_TONE.insert }], chars(t)],
        end: [[...lastRing(s), { ch: b, dim: true }], [...lastRing(t.slice(0, -1)), { ch: b, dim: true }]],
        di: 'i',
        dj: 'j-1',
      },
      {
        op: 'delete',
        mid: [[...chars(s.slice(0, -1)), { ch: a, tone: OP_TONE.delete, dashed: true }], chars(t)],
        end: [[...lastRing(s.slice(0, -1)), { ch: a, dim: true }], lastRing(t)],
        di: 'i-1',
        dj: 'j',
      },
      {
        op: 'replace',
        mid: [[...chars(s.slice(0, -1)), { ch: b, tone: OP_TONE.replace }], chars(t)],
        end: [[...lastRing(s.slice(0, -1)), { ch: b, dim: true }], [...lastRing(t.slice(0, -1)), { ch: b, dim: true }]],
        di: 'i-1',
        dj: 'j-1',
      },
    ];
    cases.forEach((cs, k) => {
      const top = tops[k];
      const py = top + 30;
      const tone = OP_TONE[cs.op];
      const midW = pairW(cs.mid[0].length);
      const endW = pairW(cs.end[0].length);
      nodes.push(
        chip(`op${k}`, midX + midW / 2, top, fmt(OP_DESC[cs.op][l], { a, b }), { sans: true, size: 12, tone }),
        arrow(`in${k}`, [startX + pairW(s.length) + 6, startY + pairH / 2], [midX - 6, py + pairH / 2], { tone, width: 1.75 }),
        ...pair(`m${k}`, midX, py, cs.mid[0], cs.mid[1]),
        arrow(`to${k}`, [midX + midW + 8, py + pairH / 2], [endX - 8, py + pairH / 2], { tone, width: 3 }),
        ...pair(`e${k}`, endX, py, cs.end[0], cs.end[1]),
        dpLabel(`dp${k}`, endX + endW / 2, py + pairH + 18, cs.di, cs.dj),
      );
    });
    return {
      scene: { w: W, h: tops[2] + 30 + pairH + 28, nodes },
      legend: (['insert', 'delete', 'replace'] as const).map((op) => ({ tone: OP_TONE[op], text: OP_LEGEND[op][l] })),
      notes: [
        {
          en: 'After any of the three edits the tail characters match and are skipped, leaving a smaller subproblem: dp[i, j] = min(dp[i, j-1], dp[i-1, j], dp[i-1, j-1]) + 1.',
          zh: '三种编辑操作之后，两字符串的尾部字符相同，可以跳过，剩下规模更小的子问题：dp[i, j] = min(dp[i, j-1], dp[i-1, j], dp[i-1, j-1]) + 1。',
          'zh-hant': '三種編輯操作之後，兩字串的尾部字元相同，可以跳過，剩下規模更小的子問題：dp[i, j] = min(dp[i, j-1], dp[i-1, j], dp[i-1, j-1]) + 1。',
          ja: '3 つのどの編集操作の後でも末尾の文字が一致するのでスキップでき、より小さい部分問題が残ります：dp[i, j] = min(dp[i, j-1], dp[i-1, j], dp[i-1, j-1]) + 1。',
          ru: 'После любой из трех операций последние символы совпадают и пропускаются, остается подзадача меньшего размера: dp[i, j] = min(dp[i, j-1], dp[i-1, j], dp[i-1, j-1]) + 1.',
        }[l],
      ],
    };
  },
};

// ── Edit distance: dp table ───────────────────────────────────────────

type EditKind = 'init' | 'base' | 'match' | 'min' | 'done';

const EDIT_SAY: Record<EditKind, T> = {
  init: {
    en: 'For s = "{s}" and t = "{t}", initialize a dp table of size (n + 1) × (m + 1) = {r} × {cl}.',
    zh: '对于 s = "{s}" 和 t = "{t}"，初始化尺寸为 (n + 1) × (m + 1) = {r} × {cl} 的 dp 表。',
    'zh-hant': '對於 s = "{s}" 和 t = "{t}"，初始化尺寸為 (n + 1) × (m + 1) = {r} × {cl} 的 dp 表。',
    ja: 's = "{s}"、t = "{t}" に対して、サイズ (n + 1) × (m + 1) = {r} × {cl} の dp テーブルを初期化します。',
    ru: 'Для s = "{s}" и t = "{t}" создаем таблицу dp размера (n + 1) × (m + 1) = {r} × {cl}.',
  },
  base: {
    en: 'If s is empty, the edits equal the length of t: dp[0, j] = j. If t is empty, they equal the length of s: dp[i, 0] = i.',
    zh: '当 s 为空时，最少编辑步数等于 t 的长度：dp[0, j] = j；当 t 为空时，等于 s 的长度：dp[i, 0] = i。',
    'zh-hant': '當 s 為空時，最少編輯步數等於 t 的長度：dp[0, j] = j；當 t 為空時，等於 s 的長度：dp[i, 0] = i。',
    ja: 's が空なら最小編集回数は t の長さで dp[0, j] = j、t が空なら s の長さで dp[i, 0] = i です。',
    ru: 'Если s пуста, число правок равно длине t: dp[0, j] = j. Если пуста t, оно равно длине s: dp[i, 0] = i.',
  },
  match: {
    en: 's[{p}] = t[{q}] = "{ch}": no edit is needed for this character, so dp[{i}, {j}] = dp[{p}, {q}] = {v}.',
    zh: 's[{p}] = t[{q}] = "{ch}"：无须编辑当前字符，dp[{i}, {j}] = dp[{p}, {q}] = {v}。',
    'zh-hant': 's[{p}] = t[{q}] = "{ch}"：無須編輯當前字元，dp[{i}, {j}] = dp[{p}, {q}] = {v}。',
    ja: 's[{p}] = t[{q}] = "{ch}"：現在の文字は編集不要なので、dp[{i}, {j}] = dp[{p}, {q}] = {v} です。',
    ru: 's[{p}] = t[{q}] = "{ch}": этот символ редактировать не нужно, dp[{i}, {j}] = dp[{p}, {q}] = {v}.',
  },
  min: {
    en: '"{a}" ≠ "{b}": dp[{i}, {j}] = min(insert {ins}, delete {del}, replace {rep}) + 1 = {v}.',
    zh: '"{a}" ≠ "{b}"：dp[{i}, {j}] = min(插入 {ins}，删除 {del}，替换 {rep}) + 1 = {v}。',
    'zh-hant': '"{a}" ≠ "{b}"：dp[{i}, {j}] = min(插入 {ins}，刪除 {del}，替換 {rep}) + 1 = {v}。',
    ja: '"{a}" ≠ "{b}"：dp[{i}, {j}] = min(挿入 {ins}、削除 {del}、置換 {rep}) + 1 = {v}。',
    ru: '"{a}" ≠ "{b}": dp[{i}, {j}] = min(вставка {ins}, удаление {del}, замена {rep}) + 1 = {v}.',
  },
  done: {
    en: 'Return dp[{n}, {m}] = {v}: turning "{s}" into "{t}" takes at least {v} edits.',
    zh: '返回 dp[{n}, {m}] = {v}：将 "{s}" 转换为 "{t}" 最少需要 {v} 步编辑。',
    'zh-hant': '返回 dp[{n}, {m}] = {v}：將 "{s}" 轉換為 "{t}" 最少需要 {v} 步編輯。',
    ja: 'dp[{n}, {m}] = {v} を返します。"{s}" を "{t}" に変換するには最少 {v} 回の編集が必要です。',
    ru: 'Возвращаем dp[{n}, {m}] = {v}: минимальное число шагов редактирования, превращающих "{s}" в "{t}".',
  },
};

const EDIT_LEGEND: Record<'ins' | 'del' | 'rep' | 'cur', T> = {
  ins: { en: 'Insert: dp[i, j-1]', zh: '插入：dp[i, j-1]', 'zh-hant': '插入：dp[i, j-1]', ja: '挿入：dp[i, j-1]', ru: 'вставка: dp[i, j-1]' },
  del: { en: 'Delete: dp[i-1, j]', zh: '删除：dp[i-1, j]', 'zh-hant': '刪除：dp[i-1, j]', ja: '削除：dp[i-1, j]', ru: 'удаление: dp[i-1, j]' },
  rep: { en: 'Replace or skip: dp[i-1, j-1]', zh: '替换或跳过：dp[i-1, j-1]', 'zh-hant': '替換或跳過：dp[i-1, j-1]', ja: '置換またはスキップ：dp[i-1, j-1]', ru: 'замена или пропуск: dp[i-1, j-1]' },
  cur: { en: 'Current state dp[i, j]', zh: '当前状态 dp[i, j]', 'zh-hant': '當前狀態 dp[i, j]', ja: '現在の状態 dp[i, j]', ru: 'текущее состояние dp[i, j]' },
};

const editDistanceDpSteps: StepFigure = {
  type: 'steps',
  call: 'edit_distance_dp(s, t)',
  tones: { init: 'idle', base: 'idle', match: 'cmp', min: 'swp', done: 'done' },
  sources: funcSources(EDIT_PY, EDIT_JAVA, ['edit_distance_dp'], {
    python: {
      init: ['dp = [[0] * (m + 1) for _ in range(n + 1)]'],
      base: ['dp[i][0] = i', 'dp[0][j] = j'],
      match: ['if s[i - 1] == t[j - 1]:', 'dp[i][j] = dp[i - 1][j - 1]'],
      min: ['dp[i][j] = min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]) + 1'],
      done: ['return dp[n][m]'],
    },
    java: {
      init: ['int[][] dp = new int[n + 1][m + 1];'],
      base: ['dp[i][0] = i;', 'dp[0][j] = j;'],
      match: ['if (s.charAt(i - 1) == t.charAt(j - 1)) {', 'dp[i][j] = dp[i - 1][j - 1];'],
      min: ['dp[i][j] = Math.min(Math.min(dp[i][j - 1], dp[i - 1][j]), dp[i - 1][j - 1]) + 1;'],
      done: ['return dp[n][m];'],
    },
  }),
  build(l) {
    const { s, t } = EDIT_DP;
    const n = s.length;
    const m = t.length;
    const dp = editTable(s, t);
    const g: Geom = { x: 127, y: 64, cw: 40, ch: 30, gap: 4 };
    const scene = (cur: [number, number] | null, o: { base?: boolean; full?: boolean; look?: Record<string, Tone>; ring?: string | null; formula: Rich }) => {
      const base = (r: number, c: number) => (r === 0 && c === 0) || (Boolean(o.base) && (r === 0 || c === 0));
      const filled = o.full ? () => true : filledUpTo(cur, base);
      const shown = dp.map((row, r) => row.map((v, c) => (filled(r, c) ? String(v) : '0')));
      const match = cur !== null && s[cur[0] - 1] === t[cur[1] - 1];
      const nodes: SceneNode[] = [
        ...tableLabels('x', g, n + 1, m + 1, 'i', 'j', cur ? { r: cur[0], c: cur[1] } : {}),
        ...board('d', g, shown, filled, o.look ?? {}, o.ring ?? null),
      ];
      [...t].forEach((ch, k) => {
        const b = cellOf(g, 0, k + 1);
        const hot = cur?.[1] === k + 1;
        nodes.push(box(`tc${k}`, b.x + 7, g.y - 50, ch, { w: 26, h: 26, size: 14, tone: hot && match ? 'ok' : 'idle', ring: hot }));
      });
      [...s].forEach((ch, k) => {
        const b = cellOf(g, k + 1, 0);
        const hot = cur?.[0] === k + 1;
        nodes.push(box(`sc${k}`, g.x - 72, b.y + 2, ch, { w: 26, h: 26, size: 14, tone: hot && match ? 'ok' : 'idle', ring: hot }));
      });
      nodes.push(
        text('l:t', g.x + g.cw / 2, g.y - 32, 't', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
        text('l:s', g.x - 59, g.y + g.ch / 2 + 5, 's', { anchor: 'middle', mono: true, bold: true, size: 13, tone: 'muted' }),
        chip('f', TABLE_W / 2, 216, o.formula, { size: 13 }),
      );
      return { w: TABLE_W, h: 256, nodes };
    };

    const edgeLook: Record<string, Tone> = {};
    for (let i = 1; i <= n; i++) edgeLook[`${i},0`] = 'ok';
    for (let j = 1; j <= m; j++) edgeLook[`0,${j}`] = 'ok';
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene(null, { formula: seg('dp: (n + 1) × (m + 1) = ', [`${n + 1} × ${m + 1}`, 'accent', true]) }),
        say: fmt(EDIT_SAY.init[l], { s, t, r: n + 1, cl: m + 1 }),
      },
      {
        kind: 'base',
        scene: scene(null, { base: true, look: edgeLook, formula: seg('dp[i,0] = ', ['i', 'accent', true], '    dp[0,j] = ', ['j', 'accent', true]) }),
        say: EDIT_SAY.base[l],
      },
    ];
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const v = dp[i][j];
        const key = `${i},${j}`;
        if (s[i - 1] === t[j - 1]) {
          frames.push({
            kind: 'match',
            scene: scene([i, j], {
              base: true,
              look: { [`${i - 1},${j - 1}`]: 'info', [key]: 'ok' },
              ring: key,
              formula: seg(`s[${i - 1}] = t[${j - 1}]  →  dp[${i},${j}] = dp[${i - 1},${j - 1}] = `, [String(v), 'ok', true]),
            }),
            say: fmt(EDIT_SAY.match[l], { p: i - 1, q: j - 1, ch: s[i - 1], i, j, v }),
          });
          continue;
        }
        const ins = dp[i][j - 1];
        const del = dp[i - 1][j];
        const rep = dp[i - 1][j - 1];
        frames.push({
          kind: 'min',
          scene: scene([i, j], {
            base: true,
            look: { [`${i},${j - 1}`]: 'accent', [`${i - 1},${j}`]: 'warn', [`${i - 1},${j - 1}`]: 'info', [key]: 'ok' },
            ring: key,
            formula: seg(`dp[${i},${j}] = min(`, [String(ins), 'accent', true], ', ', [String(del), 'warn', true], ', ', [String(rep), 'info', true], ') + 1 = ', [String(v), 'ok', true]),
          }),
          say: fmt(EDIT_SAY.min[l], { a: s[i - 1], b: t[j - 1], i, j, ins, del, rep, v }),
        });
      }
    }
    frames.push({
      kind: 'done',
      scene: scene(null, { full: true, look: { [`${n},${m}`]: 'ok' }, ring: `${n},${m}`, formula: seg(`return dp[${n},${m}] = `, [String(dp[n][m]), 'ok', true]) }),
      say: fmt(EDIT_SAY.done[l], { n, m, v: dp[n][m], s, t }),
    });
    return {
      frames,
      legend: [
        { tone: 'accent', text: EDIT_LEGEND.ins[l] },
        { tone: 'warn', text: EDIT_LEGEND.del[l] },
        { tone: 'info', text: EDIT_LEGEND.rep[l] },
        { tone: 'ok', text: EDIT_LEGEND.cur[l] },
      ],
    };
  },
};

export const DP_PROBLEM_FIGURES: Record<string, Figure> = {
  knapsack_example: knapsackExampleFig,
  knapsack_dfs: knapsackDfsFig,
  knapsack_dfs_mem: knapsackDfsMemFig,
  knapsack_dp_steps: knapsackDpSteps,
  knapsack_dp_comp_steps: compFigure(false),
  unbounded_knapsack_example: unboundedKnapsackExampleFig,
  unbounded_knapsack_dp_comp_steps: compFigure(true),
  coin_change_example: coinChangeExampleFig,
  coin_change_dp_steps: coinChangeDpSteps,
  coin_change_ii_example: coinChangeIIExampleFig,
  edit_distance_example: editExampleFig,
  edit_distance_decision_tree: editDecisionTreeFig,
  edit_distance_state_transfer: editStateTransferFig,
  edit_distance_dp_steps: editDistanceDpSteps,
};
