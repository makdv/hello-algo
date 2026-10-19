import { arrow, box, chip, region, text } from '../../../figures/kit';
import type { BoxNode, Scene, SceneNode, Tone } from '../../../figures/scene';
import type { Locale } from '../../../i18n/locale';
import type { KidQuestion, LessonContent, PracticeStep, StorySlide } from '../types';

/**
 * Unit 3, find it and sort it. Linear search has its own guessing game in "Try it"; the other
 * lessons play the bubble game of their algorithm, so their stories use the game's rule wording
 * and the same kind of small numbers. Text is written for 8–12 year olds.
 */

type T = Record<Locale, string>;
type F = Record<Locale, (n: number) => string>;
const t = (en: string, zh: string, zhHant: string, ja: string, ru: string): T => ({ en, zh, 'zh-hant': zhHant, ja, ru });

const W = 440;
const H = 260;

// ── Shared pictures ───────────────────────────────────────────────────

/** A number bubble (a cell in a row). Keep `id` stable between slides so swaps glide. */
interface Bub {
  id: string;
  v: number | string;
  tone?: Tone;
  ring?: boolean;
  dim?: boolean;
  dashed?: boolean;
  /** Picked up: drawn above its spot (insertion sort). */
  lift?: boolean;
  /** Home: in its final spot, with a crown, as in the game. */
  home?: boolean;
  /** A big mark under the bubble, like ✗ or ✓. */
  below?: { text: string; tone: Tone };
}

const scene = (nodes: SceneNode[]): Scene => ({ w: W, h: H, nodes });

function bubble(b: Bub, x: number, y: number, w: number): { nodes: SceneNode[]; box: BoxNode } {
  const by = b.lift ? y - Math.round(w * 1.1) : y;
  const bx = box(b.id, x, by, String(b.v), {
    w,
    h: w,
    size: w >= 48 ? 20 : 16,
    tone: b.tone ?? (b.home ? 'ok' : 'info'),
    ring: b.ring,
    dim: b.dim,
    dashed: b.dashed,
  });
  const nodes: SceneNode[] = [bx];
  if (b.home) nodes.push(text(`${b.id}:crown`, x + w / 2, by - 7, '👑', { anchor: 'middle', size: 18 }));
  if (b.below) nodes.push(text(`${b.id}:below`, x + w / 2, y + w + 26, b.below.text, { anchor: 'middle', size: 22, bold: true, tone: b.below.tone }));
  return { nodes, box: bx };
}

/** Left edges of `n` spots centered across the scene; `teams` (sizes) adds wider gaps between groups. */
function spots(n: number, w: number, gap: number, teams: number[] = [], teamGap = 30): number[] {
  const breaks = new Set<number>();
  let acc = 0;
  for (const s of teams.slice(0, -1)) breaks.add((acc += s));
  const total = n * w + (n - 1) * gap + breaks.size * teamGap;
  let x = (W - total) / 2;
  return Array.from({ length: n }, (_, k) => {
    if (breaks.has(k)) x += teamGap;
    const at = x;
    x += w + gap;
    return Math.round(at);
  });
}

interface RowOpts {
  y?: number;
  w?: number;
  gap?: number;
  teams?: number[];
}

/** A row of bubbles; returns the nodes and each bubble's box (for tags and arcs). */
function row(items: Bub[], o: RowOpts = {}) {
  const { y = 100, w = 56, gap = 14, teams } = o;
  const xs = spots(items.length, w, gap, teams);
  const nodes: SceneNode[] = [];
  const at: BoxNode[] = [];
  items.forEach((b, k) => {
    const d = bubble(b, xs[k], y, w);
    nodes.push(...d.nodes);
    at.push(d.box);
  });
  return { nodes, at };
}

/** A short label in a pill at the bottom (or top) of the picture. */
const caption = (id: string, label: string, tone: Tone = 'idle', y = H - 42) => chip(id, W / 2, y, label, { sans: true, size: 15, tone });

/** What we are looking for, at the top. */
const goal = (label: string) => chip('goal', W / 2, 12, label, { sans: true, size: 16, tone: 'accent' });

/** A word with an arrow pointing at a bubble from above or below. */
function pointer(id: string, b: BoxNode, label: string, side: 'above' | 'below' = 'above', tone: Tone = 'accent'): SceneNode[] {
  const cx = b.x + b.w / 2;
  if (side === 'above') {
    return [arrow(`${id}:a`, [cx, b.y - 24], [cx, b.y - 5], { tone, width: 2 }), text(id, cx, b.y - 30, label, { anchor: 'middle', size: 15, bold: true, tone })];
  }
  const bottom = b.y + b.h;
  return [arrow(`${id}:a`, [cx, bottom + 24], [cx, bottom + 5], { tone, width: 2 }), text(id, cx, bottom + 42, label, { anchor: 'middle', size: 15, bold: true, tone })];
}

/** A double-headed arc under two bubbles: these two just traded places. */
function swapArc(id: string, a: BoxNode, b: BoxNode): SceneNode {
  const [l, r] = a.x <= b.x ? [a, b] : [b, a];
  const lx = l.x + l.w / 2;
  const rx = r.x + r.w / 2;
  const y = l.y + l.h + 8;
  return arrow(id, [lx, y], [rx, y], { bend: Math.min(18, (rx - lx) / 6), head: 'both', tone: 'warn', width: 2.5 });
}

/** A soft panel behind bubbles `from..to` of a row. */
function team(id: string, at: BoxNode[], from: number, to: number, tone: Tone = 'soft'): SceneNode {
  const a = at[from];
  const b = at[to];
  return region(id, a.x - 8, a.y - 8, b.x + b.w - a.x + 16, a.h + 16, { tone });
}

/** Numbers as answer buttons, as in the stack lesson. */
const ask = (prompt: string, ids: number[], answer: number, explain: string): KidQuestion => ({
  prompt,
  choices: ids.map((n) => ({ id: String(n), label: String(n) })),
  answer: String(answer),
  explain,
});

/** Labels drawn in the pictures. */
const LABEL: Record<'smallToBig' | 'middle' | 'smallest' | 'leader' | 'smaller' | 'bigger' | 'inOrder' | 'rest' | 'moreBoxes' | 'oneByOne' | 'halving' | 'newLine', T> = {
  smallToBig: t('small → big', '小 → 大', '小 → 大', '小 → 大', 'меньше → больше'),
  middle: t('middle', '中间', '中間', 'まん中', 'середина'),
  smallest: t('smallest', '最小', '最小', 'いちばん小さい', 'самый маленький'),
  leader: t('leader', '队长', '隊長', 'リーダー', 'вожак'),
  smaller: t('smaller', '更小', '更小', '小さい', 'меньше'),
  bigger: t('bigger', '更大', '更大', '大きい', 'больше'),
  inOrder: t('in order', '排好了', '排好了', 'ならんだ', 'по порядку'),
  rest: t('the rest', '剩下的', '剩下的', 'のこり', 'остальные'),
  moreBoxes: t('more boxes, more looking', '盒子越多，找得越久', '盒子越多，找得越久', '箱がふえると、さがす回数もふえる', 'больше коробок — дольше искать'),
  oneByOne: t('one by one: 6 looks', '一个一个找：6 次', '一個一個找：6 次', 'ひとつずつ：6 回', 'по одному: 6 раз'),
  halving: t('halving: 3 peeks', '切一半：3 次', '切一半：3 次', '半分ずつ：3 回', 'пополам: 3 раза'),
  newLine: t('new line', '新队伍', '新隊伍', '新しい列', 'новый строй'),
};

const FIND: F = {
  en: (n) => `find ${n}`,
  zh: (n) => `找 ${n}`,
  'zh-hant': (n) => `找 ${n}`,
  ja: (n) => `${n} をさがす`,
  ru: (n) => `ищем ${n}`,
};

const NOT_HERE: F = {
  en: (n) => `${n} is not here`,
  zh: (n) => `${n} 不在这里`,
  'zh-hant': (n) => `${n} 不在這裡`,
  ja: (n) => `${n} はない`,
  ru: (n) => `${n} здесь нет`,
};

const AND: Record<Locale, (a: number, b: number) => string> = {
  en: (a, b) => `${a} and ${b}`,
  zh: (a, b) => `${a} 和 ${b}`,
  'zh-hant': (a, b) => `${a} 和 ${b}`,
  ja: (a, b) => `${a} と ${b}`,
  ru: (a, b) => `${a} и ${b}`,
};

// ── Linear search: look one by one ────────────────────────────────────

/** closed: a "?" box; no: opened, not it; look: just opened; yes: found; open: shown, no mark. */
type BoxState = 'closed' | 'no' | 'look' | 'yes' | 'open';

/** A row of boxes that hide numbers, opened from the left. */
function boxes(vals: number[], states: BoxState[], o: { goal?: string; caption?: string; captionTone?: Tone; w?: number; gap?: number } = {}): Scene {
  const items: Bub[] = vals.map((v, k) => {
    const s = states[k] ?? 'closed';
    const id = `box${k}`;
    if (s === 'closed') return { id, v: '?', tone: 'info' };
    if (s === 'no') return { id, v, tone: 'idle', below: { text: '✗', tone: 'danger' } };
    if (s === 'look') return { id, v, tone: 'warn', ring: true };
    if (s === 'yes') return { id, v, tone: 'ok', ring: true, below: { text: '✓', tone: 'ok' } };
    return { id, v, tone: 'idle' };
  });
  const nodes: SceneNode[] = [];
  if (o.goal) nodes.push(goal(o.goal));
  nodes.push(...row(items, { y: 92, w: o.w ?? 52, gap: o.gap ?? 12 }).nodes);
  if (o.caption) nodes.push(caption('cap', o.caption, o.captionTone ?? 'idle'));
  return scene(nodes);
}

const states = (n: number, upTo: number, last: BoxState): BoxState[] => Array.from({ length: n }, (_, k) => (k < upTo ? 'no' : k === upTo ? last : 'closed'));

const LS_ROW = [3, 8, 1, 7, 5, 2];
const LS_TRY = [6, 2, 9, 4, 11, 3];

const LINEAR_STORY: Record<'hide' | 'first' | 'more' | 'found' | 'missing' | 'name', T> = {
  hide: t(
    'I am looking for the number 7. It is hiding in one of these boxes. But which one?',
    '我要找数字 7。它藏在其中一个盒子里。可是是哪一个呢？',
    '我要找數字 7。它藏在其中一個盒子裡。可是是哪一個呢？',
    '数字の 7 をさがしているよ。どれかの箱にかくれているんだ。でも、どの箱かな？',
    'Я ищу число 7. Оно спряталось в одной из коробок. Но в какой?',
  ),
  first: t(
    'There is no clue, so we open the boxes one by one, from the left. Box 1 has 3. Not it!',
    '没有任何线索，所以我们从左边开始，一个一个地打开。第 1 个盒子里是 3。不是它！',
    '沒有任何線索，所以我們從左邊開始，一個一個地打開。第 1 個盒子裡是 3。不是它！',
    'ヒントはないから、左から ひとつずつ あけよう。1 番目の箱は 3。ちがう！',
    'Подсказок нет, поэтому открываем коробки по одной, слева направо. В первой — 3. Не то!',
  ),
  more: t(
    'Next comes 8, then 1. Still no 7. Keep going!',
    '接着是 8，然后是 1。还不是 7。继续找！',
    '接著是 8，然後是 1。還不是 7。繼續找！',
    'つぎは 8、そのつぎは 1。まだ 7 じゃない。どんどん行こう！',
    'Дальше 8, потом 1. Семёрки всё нет. Идём дальше!',
  ),
  found: t(
    'Box 4 has 7. Found it! Now we can stop looking.',
    '第 4 个盒子里是 7。找到了！现在不用再找了。',
    '第 4 個盒子裡是 7。找到了！現在不用再找了。',
    '4 番目の箱に 7 があった。見つけた！もう さがさなくていいね。',
    'В четвёртой коробке — 7. Нашли! Дальше искать не нужно.',
  ),
  missing: t(
    'Now let us look for 9. We open all six boxes and never see it. Only then can we say: 9 is not here.',
    '现在找 9。六个盒子全打开了，也没看到它。只有这样，我们才能说：9 不在这里。',
    '現在找 9。六個盒子全打開了，也沒看到它。只有這樣，我們才能說：9 不在這裡。',
    'こんどは 9 をさがそう。6 つの箱を ぜんぶ あけても見つからない。ここまでして、やっと「9 はない」と言えるんだ。',
    'Теперь ищем 9. Открываем все шесть коробок — её нигде нет. Только теперь можно сказать: девятки здесь нет.',
  ),
  name: t(
    'This is called linear search. It always works, but more boxes mean more looking.',
    '这叫线性查找。它总能用，不过盒子越多，要找的次数也越多。',
    '這叫線性搜尋。它總能用，不過盒子越多，要找的次數也越多。',
    'これを線形探索というよ。いつでも使えるけど、箱がふえるほど、さがす回数もふえるんだ。',
    'Это называется линейный поиск. Он работает всегда, но чем больше коробок, тем дольше искать.',
  ),
};

const LINEAR_PRACTICE: Record<
  'start' | 'ask1' | 'next' | 'stop' | 'skip' | 'ask1e' | 'box2' | 'box3' | 'ask2' | 'ask2e' | 'ask3' | 'ask3e' | 'done',
  T
> = {
  start: t(
    'Your turn! Help me find 4. We start with the box on the left.',
    '轮到你了！帮我找 4。我们从最左边的盒子开始。',
    '輪到你了！幫我找 4。我們從最左邊的盒子開始。',
    'きみの番だよ！4 をさがすのを手伝って。左はしの箱から始めよう。',
    'Твоя очередь! Помоги найти 4. Начинаем с левой коробки.',
  ),
  ask1: t('Box 1 has 6. What should we do now?', '第 1 个盒子里是 6。现在该怎么做？', '第 1 個盒子裡是 6。現在該怎麼做？', '1 番目の箱は 6。つぎは どうする？', 'В первой коробке — 6. Что делаем дальше?'),
  next: t('Open the next box', '打开下一个盒子', '打開下一個盒子', 'となりの箱をあける', 'Открыть следующую'),
  stop: t('Stop: we found it', '停下：找到了', '停下：找到了', 'ストップ：見つけた', 'Стоп: нашли'),
  skip: t('Jump to the last box', '直接跳到最后一个', '直接跳到最後一個', 'いちばん右の箱へとぶ', 'Сразу к последней'),
  ask1e: t(
    '6 is not 4, so we open the next box.',
    '6 不是 4，所以打开下一个盒子。',
    '6 不是 4，所以打開下一個盒子。',
    '6 は 4 じゃないから、となりの箱をあけるよ。',
    '6 — это не 4, поэтому открываем следующую коробку.',
  ),
  box2: t(
    'Box 2 has 2. Still not 4, so we open the next one.',
    '第 2 个盒子里是 2。还不是 4，再打开下一个。',
    '第 2 個盒子裡是 2。還不是 4，再打開下一個。',
    '2 番目の箱は 2。まだ 4 じゃないから、となりをあけよう。',
    'Во второй коробке — 2. Всё ещё не 4, открываем следующую.',
  ),
  box3: t(
    'Box 3 has 9. Not 4 either. On to box 4!',
    '第 3 个盒子里是 9。也不是 4。看第 4 个！',
    '第 3 個盒子裡是 9。也不是 4。看第 4 個！',
    '3 番目の箱は 9。これも 4 じゃない。4 番目へ！',
    'В третьей — 9. Тоже не 4. Открываем четвёртую!',
  ),
  ask2: t(
    'Box 4 has 4. Found it! How many boxes did we open?',
    '第 4 个盒子里是 4，找到了！我们一共打开了几个盒子？',
    '第 4 個盒子裡是 4，找到了！我們一共打開了幾個盒子？',
    '4 番目の箱に 4 があった！ぜんぶで いくつ箱をあけた？',
    'В четвёртой коробке — 4. Нашли! Сколько коробок мы открыли?',
  ),
  ask2e: t(
    'We opened 6, 2, 9 and then 4. That is four boxes.',
    '我们打开了 6、2、9，然后是 4，一共四个盒子。',
    '我們打開了 6、2、9，然後是 4，一共四個盒子。',
    '6、2、9、そして 4。あけた箱は 4 つだよ。',
    'Мы открыли 6, 2, 9 и потом 4 — четыре коробки.',
  ),
  ask3: t(
    'Now find 8. What if 8 is in none of the boxes? How many boxes must we open before we know for sure?',
    '现在找 8。如果 8 不在任何一个盒子里呢？要打开几个盒子，我们才能确定？',
    '現在找 8。如果 8 不在任何一個盒子裡呢？要打開幾個盒子，我們才能確定？',
    'こんどは 8 をさがそう。もし 8 が どの箱にも なかったら？いくつ箱をあけたら、「ない」と はっきりわかる？',
    'Теперь ищем 8. А если восьмёрки нет ни в одной коробке? Сколько коробок нужно открыть, чтобы знать наверняка?',
  ),
  ask3e: t(
    'To be sure 8 is missing, we must look in every box: all 6.',
    '要确定 8 不在，就得把每个盒子都看一遍：全部 6 个。',
    '要確定 8 不在，就得把每個盒子都看一遍：全部 6 個。',
    '8 がないとわかるには、ぜんぶの箱を見ないとね。6 つ全部だよ。',
    'Чтобы убедиться, что восьмёрки нет, надо заглянуть в каждую коробку — во все 6.',
  ),
  done: t(
    'Right! After all 6 boxes, we are sure: 8 is not here.',
    '没错！看完全部 6 个盒子，我们就确定了：8 不在这里。',
    '沒錯！看完全部 6 個盒子，我們就確定了：8 不在這裡。',
    'そのとおり！6 つの箱を ぜんぶ見たから、8 はないと言えるね。',
    'Точно! Открыв все 6 коробок, мы уверены: восьмёрки здесь нет.',
  ),
};

const LINEAR_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'We look for 5 in this row, one by one from the left. How many boxes do we open?',
    '在这一排里从左往右一个一个地找 5。要打开几个盒子？',
    '在這一排裡從左往右一個一個地找 5。要打開幾個盒子？',
    'この列で、左から ひとつずつ 5 をさがすよ。いくつ箱をあける？',
    'Ищем 5 в этом ряду, по одной слева направо. Сколько коробок откроем?',
  ),
  q1e: t('We open 2, then 9, then 5. That is 3 boxes.', '依次打开 2、9、5，一共 3 个盒子。', '依次打開 2、9、5，一共 3 個盒子。', '2、9、5 の順にあけるから、3 つだよ。', 'Открываем 2, потом 9, потом 5 — три коробки.'),
  q2: t('Why do we look one by one here?', '为什么这里要一个一个地找？', '為什麼這裡要一個一個地找？', 'ここで ひとつずつ さがすのは どうして？', 'Почему здесь мы ищем по одной?'),
  q2a: t(
    'The numbers are mixed up, so any box could hide it',
    '数字是乱的，哪个盒子都可能藏着它',
    '數字是亂的，哪個盒子都可能藏著它',
    '数字がばらばらで、どの箱にあってもおかしくないから',
    'Числа перемешаны — оно может быть в любой коробке',
  ),
  q2b: t('It is always the fastest way', '这永远是最快的方法', '這永遠是最快的方法', 'いつでも いちばん速い方法だから', 'Это всегда самый быстрый способ'),
  q2c: t('The number is always in the last box', '数字总在最后一个盒子里', '數字總在最後一個盒子裡', '数字は いつも最後の箱にあるから', 'Число всегда в последней коробке'),
  q2e: t(
    'With no order, there is no clue where to look. Checking every box is the safe way.',
    '数字没有顺序，就没有线索。一个一个检查最稳妥。',
    '數字沒有順序，就沒有線索。一個一個檢查最穩妥。',
    '順番がないと、どこをさがせばいいか ヒントがない。ぜんぶ見るのが たしかな方法だよ。',
    'Когда порядка нет, нет и подсказки. Проверить каждую коробку — надёжный способ.',
  ),
  q3: t(
    'There are 10 boxes. What if the number is in none of them? How many boxes do we open before we know for sure?',
    '一共有 10 个盒子。如果要找的数字一个也不在呢？要打开几个盒子才能确定？',
    '一共有 10 個盒子。如果要找的數字一個也不在呢？要打開幾個盒子才能確定？',
    '箱は 10 こ。もし さがす数字が どの箱にも なかったら？いくつ箱をあけたら、はっきりわかる？',
    'Коробок 10. А если числа нет ни в одной? Сколько коробок откроем, пока не узнаем наверняка?',
  ),
  q3e: t(
    'We have to open all 10 to be sure the number is not there.',
    '要打开全部 10 个，才能确定它不在。',
    '要打開全部 10 個，才能確定它不在。',
    '10 こ全部あけて、やっと「ない」とわかるよ。',
    'Нужно открыть все 10, чтобы убедиться, что числа нет.',
  ),
};

const linear_search: LessonContent = {
  story(l): StorySlide[] {
    const S = LINEAR_STORY;
    const n = LS_ROW.length;
    return [
      { scene: boxes(LS_ROW, states(n, -1, 'closed'), { goal: FIND[l](7) }), say: S.hide[l] },
      { scene: boxes(LS_ROW, states(n, 0, 'look'), { goal: FIND[l](7) }), say: S.first[l] },
      { scene: boxes(LS_ROW, states(n, 2, 'look'), { goal: FIND[l](7) }), say: S.more[l] },
      { scene: boxes(LS_ROW, states(n, 3, 'yes'), { goal: FIND[l](7) }), say: S.found[l] },
      { scene: boxes(LS_ROW, states(n, n, 'closed'), { goal: FIND[l](9), caption: NOT_HERE[l](9), captionTone: 'danger' }), say: S.missing[l] },
      {
        scene: boxes(Array(10).fill(0), [], { w: 34, gap: 6, caption: LABEL.moreBoxes[l], captionTone: 'accent' }),
        say: S.name[l],
      },
    ];
  },
  practice(l): PracticeStep[] {
    const P = LINEAR_PRACTICE;
    const n = LS_TRY.length;
    return [
      { scene: boxes(LS_TRY, states(n, -1, 'closed'), { goal: FIND[l](4) }), say: P.start[l] },
      {
        scene: boxes(LS_TRY, states(n, 0, 'look'), { goal: FIND[l](4) }),
        say: P.ask1[l],
        ask: {
          prompt: P.ask1[l],
          choices: [
            { id: 'next', label: P.next[l] },
            { id: 'stop', label: P.stop[l] },
            { id: 'skip', label: P.skip[l] },
          ],
          answer: 'next',
          explain: P.ask1e[l],
        },
      },
      { scene: boxes(LS_TRY, states(n, 1, 'look'), { goal: FIND[l](4) }), say: P.box2[l] },
      { scene: boxes(LS_TRY, states(n, 2, 'look'), { goal: FIND[l](4) }), say: P.box3[l] },
      { scene: boxes(LS_TRY, states(n, 3, 'yes'), { goal: FIND[l](4) }), say: P.ask2[l], ask: ask(P.ask2[l], [1, 3, 4], 4, P.ask2e[l]) },
      { scene: boxes(LS_TRY, states(n, -1, 'closed'), { goal: FIND[l](8) }), say: P.ask3[l], ask: ask(P.ask3[l], [1, 3, 6], 6, P.ask3e[l]) },
      { scene: boxes(LS_TRY, states(n, n, 'closed'), { goal: FIND[l](8), caption: NOT_HERE[l](8), captionTone: 'danger' }), say: P.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = LINEAR_QUIZ;
    return [
      { ...ask(Q.q1[l], [1, 2, 3, 4], 3, Q.q1e[l]), scene: boxes([2, 9, 5, 1], ['open', 'open', 'open', 'open'], { goal: FIND[l](5) }) },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'mixed', label: Q.q2a[l] },
          { id: 'fast', label: Q.q2b[l] },
          { id: 'last', label: Q.q2c[l] },
        ],
        answer: 'mixed',
        explain: Q.q2e[l],
      },
      { ...ask(Q.q3[l], [1, 5, 10], 10, Q.q3e[l]), scene: boxes(Array(10).fill(0), [], { w: 34, gap: 6 }) },
    ];
  },
};

// ── Binary search: halve it ───────────────────────────────────────────

const BS_ROW = [2, 4, 5, 7, 9, 11, 14, 16, 18];

/** A sorted row; bubbles outside lo..hi are skipped (faded), `mid` is the one we peek at. */
function sortedRow(vals: number[], o: { lo?: number; hi?: number; mid?: number; found?: number; goal?: string; peeks?: number[]; caption?: SceneNode[]; middle?: string } = {}): Scene {
  const { lo = 0, hi = vals.length - 1 } = o;
  const items: Bub[] = vals.map((v, k) => {
    const peek = o.peeks?.indexOf(k) ?? -1;
    return {
      id: `bs${k}`,
      v,
      tone: k === o.found ? 'ok' : k === o.mid ? 'warn' : peek >= 0 ? 'warn' : 'info',
      ring: k === o.mid || k === o.found,
      dim: (k < lo || k > hi) && peek < 0,
      below: peek >= 0 ? { text: String(peek + 1), tone: 'accent' } : undefined,
    };
  });
  const r = row(items, { y: 100, w: 40, gap: 6 });
  const nodes: SceneNode[] = [];
  if (o.goal) nodes.push(goal(o.goal));
  nodes.push(...r.nodes);
  if (o.mid !== undefined && o.middle) nodes.push(...pointer('mid', r.at[o.mid], o.middle));
  if (o.caption) nodes.push(...o.caption);
  return scene(nodes);
}

const BINARY_STORY: Record<'sorted' | 'peek1' | 'right' | 'peek2' | 'found' | 'win', T> = {
  sorted: t(
    'Binary search is a trick for sorted rows, where numbers go from small to big. Like the pages of a book!',
    '二分查找是用在排好序的队伍上的妙招：数字从小排到大，就像书的页码一样！',
    '二分搜尋是用在排好順序的隊伍上的妙招：數字從小排到大，就像書的頁碼一樣！',
    '二分探索は、小さい順にならんだ列で使える わざだよ。本のページ番号みたいにね！',
    'Двоичный поиск — хитрость для упорядоченного ряда, где числа идут от меньшего к большему. Как страницы в книге!',
  ),
  peek1: t(
    'Let us find 11. Instead of starting at the left, peek at the middle bubble: 9.',
    '我们来找 11。不从左边开始，而是先看看中间的泡泡：9。',
    '我們來找 11。不從左邊開始，而是先看看中間的泡泡：9。',
    '11 をさがそう。左から始めないで、まん中のバブルをのぞくよ：9。',
    'Найдём 11. Не будем начинать слева — посмотрим на средний пузырь: 9.',
  ),
  right: t(
    '11 is bigger than 9, so it must be on the right. The whole left half is skipped!',
    '11 比 9 大，所以它一定在右边。左边一半全都跳过！',
    '11 比 9 大，所以它一定在右邊。左邊一半全都跳過！',
    '11 は 9 より大きいから、右がわにあるはず。左半分は まるごと とばせる！',
    '11 больше 9, значит, оно справа. Всю левую половину пропускаем!',
  ),
  peek2: t(
    'Peek at the middle of the 4 that are left. Two sit in the middle, so we take the left one: 14. 11 is smaller, so now look only to the left of 14.',
    '再看看剩下 4 个的中间。中间有两个，我们取左边那个：14。11 更小，所以只看 14 的左边。',
    '再看看剩下 4 個的中間。中間有兩個，我們取左邊那個：14。11 更小，所以只看 14 的左邊。',
    'のこり 4 この まん中をのぞこう。まん中が 2 こあるときは 左の方：14。11 の方が小さいから、14 の左だけ見ればいい。',
    'Смотрим в середину оставшихся четырёх. В середине двое — берём левого: 14. 11 меньше, значит, смотрим только левее 14.',
  ),
  found: t(
    'Only one bubble is left: 11. Found it, in just 3 peeks!',
    '只剩一个泡泡：11。找到了，只看了 3 次！',
    '只剩一個泡泡：11。找到了，只看了 3 次！',
    'のこったバブルは ひとつ：11。見つけた！のぞいたのは たった 3 回！',
    'Остался один пузырь: 11. Нашли всего за 3 взгляда!',
  ),
  win: t(
    'One by one, we would look 6 times: 2, 4, 5, 7, 9, 11. Halving took only 3 peeks! Every peek throws away half, so even a huge row needs few peeks.',
    '一个一个找，要看 6 次：2、4、5、7、9、11。切一半只看了 3 次！每看一次就扔掉一半，所以就算队伍很长，也只要看几次。',
    '一個一個找，要看 6 次：2、4、5、7、9、11。切一半只看了 3 次！每看一次就丟掉一半，所以就算隊伍很長，也只要看幾次。',
    'ひとつずつだと 6 回：2、4、5、7、9、11。半分にすると 3 回だけ！のぞくたびに半分へるから、すごく長い列でも すぐ見つかるよ。',
    'По одному пришлось бы смотреть 6 раз: 2, 4, 5, 7, 9, 11. Пополам — всего 3 взгляда! Каждый взгляд отбрасывает половину, так что даже огромный ряд проверяется быстро.',
  ),
};

const BINARY_QUIZ: Record<'q1' | 'left' | 'right' | 'stop' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'We look for 15 and peek at the middle: 9. Where do we look next?',
    '我们找 15，先看中间：9。接下来看哪边？',
    '我們找 15，先看中間：9。接下來看哪邊？',
    '15 をさがして、まん中をのぞいたら 9 だった。つぎは どっちを見る？',
    'Ищем 15 и смотрим в середину: там 9. Куда смотрим дальше?',
  ),
  left: t('Look left', '看左边', '看左邊', '左を見る', 'Налево'),
  right: t('Look right', '看右边', '看右邊', '右を見る', 'Направо'),
  stop: t('Stop: found it', '停下：找到了', '停下：找到了', 'ストップ：見つけた', 'Стоп: нашли'),
  q1e: t(
    '15 is bigger than 9, so it can only be on the right.',
    '15 比 9 大，所以它只可能在右边。',
    '15 比 9 大，所以它只可能在右邊。',
    '15 は 9 より大きいから、右にしか ないよ。',
    '15 больше 9, значит, оно может быть только справа.',
  ),
  q2: t('When does binary search work?', '二分查找什么时候才能用？', '二分搜尋什麼時候才能用？', '二分探索が使えるのは どんなとき？', 'Когда работает двоичный поиск?'),
  q2a: t('When the numbers are sorted', '数字排好顺序的时候', '數字排好順序的時候', '数字が小さい順にならんでいるとき', 'Когда числа упорядочены'),
  q2b: t('When the numbers are mixed up', '数字乱七八糟的时候', '數字亂七八糟的時候', '数字がばらばらのとき', 'Когда числа перемешаны'),
  q2c: t('Always, for any row', '任何时候都行', '任何時候都行', 'どんな列でも いつでも', 'Всегда, для любого ряда'),
  q2e: t(
    'The middle only tells us which half to keep if the numbers are in order.',
    '只有数字排好了顺序，看中间才能知道该留哪一半。',
    '只有數字排好了順序，看中間才能知道該留哪一半。',
    'ならんでいるときだけ、まん中を見て どっちの半分をのこすか わかるんだ。',
    'Только в упорядоченном ряду середина подсказывает, какую половину оставить.',
  ),
  q3: t(
    'There are 16 sorted bubbles. About how many are left to check after one peek?',
    '有 16 个排好序的泡泡。看一次之后，大约还剩几个要找？',
    '有 16 個排好順序的泡泡。看一次之後，大約還剩幾個要找？',
    '小さい順にならんだバブルが 16 こ。1 回のぞいたら、のこりは だいたい何こ？',
    'Есть 16 упорядоченных пузырей. Сколько примерно останется проверить после одного взгляда?',
  ),
  q3e: t(
    'Each peek skips about half. Half of 16 is 8.',
    '每看一次大约跳过一半，16 的一半是 8。',
    '每看一次大約跳過一半，16 的一半是 8。',
    '1 回のぞくと だいたい半分とばせる。16 の半分は 8 だよ。',
    'Каждый взгляд отбрасывает около половины. Половина от 16 — это 8.',
  ),
};

const binary_search: LessonContent = {
  story(l): StorySlide[] {
    const S = BINARY_STORY;
    const find = FIND[l](11);
    const middle = LABEL.middle[l];
    return [
      { scene: sortedRow(BS_ROW, { caption: [caption('cap', LABEL.smallToBig[l], 'accent')] }), say: S.sorted[l] },
      { scene: sortedRow(BS_ROW, { goal: find, mid: 4, middle }), say: S.peek1[l] },
      { scene: sortedRow(BS_ROW, { goal: find, lo: 5, hi: 8 }), say: S.right[l] },
      { scene: sortedRow(BS_ROW, { goal: find, lo: 5, hi: 8, mid: 6, middle }), say: S.peek2[l] },
      { scene: sortedRow(BS_ROW, { goal: find, lo: 5, hi: 5, found: 5 }), say: S.found[l] },
      {
        scene: sortedRow(BS_ROW, {
          lo: 9,
          hi: 8,
          peeks: [4, 6, 5],
          caption: [chip('slow', W / 2, 188, LABEL.oneByOne[l], { sans: true, size: 15, tone: 'muted' }), chip('fast', W / 2, 222, LABEL.halving[l], { sans: true, size: 15, tone: 'ok' })],
        }),
        say: S.win[l],
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = BINARY_QUIZ;
    return [
      {
        prompt: Q.q1[l],
        choices: [
          { id: 'left', label: Q.left[l] },
          { id: 'right', label: Q.right[l] },
          { id: 'stop', label: Q.stop[l] },
        ],
        answer: 'right',
        explain: Q.q1e[l],
        scene: sortedRow([1, 4, 6, 9, 13, 15, 19], { goal: FIND[l](15), mid: 3, middle: LABEL.middle[l] }),
      },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'sorted', label: Q.q2a[l] },
          { id: 'mixed', label: Q.q2b[l] },
          { id: 'any', label: Q.q2c[l] },
        ],
        answer: 'sorted',
        explain: Q.q2e[l],
      },
      ask(Q.q3[l], [15, 8, 4], 8, Q.q3e[l]),
    ];
  },
};

// ── Sorting games: a row of bubbles ───────────────────────────────────

/** A bubble in a sorting picture, by value: `pick` rings it, `home` crowns it. */
interface Spot {
  v: number;
  pick?: boolean;
  home?: boolean;
  lift?: boolean;
  dim?: boolean;
}

/** A row of sorting bubbles; ids follow the values so a swap glides. Returns the boxes for extras. */
function sortRow(prefix: string, spots: Spot[], o: RowOpts = {}) {
  return row(
    spots.map((s) => ({ id: `${prefix}${s.v}`, v: s.v, home: s.home, lift: s.lift, dim: s.dim, ring: s.pick, tone: s.pick ? 'warn' : undefined })),
    o,
  );
}

/** Values to spots: `pick` and `home` list values. */
const line = (vals: number[], pick: number[] = [], home: number[] = [], lift: number[] = []): Spot[] =>
  vals.map((v) => ({ v, pick: pick.includes(v), home: home.includes(v), lift: lift.includes(v) }));

/** A sorting picture: the row, an optional swap arc between two values, tags and a caption. */
function sortScene(
  prefix: string,
  spots: Spot[],
  o: { swap?: [number, number]; tags?: { v: number; label: string; side?: 'above' | 'below'; tone?: Tone }[]; caption?: string; captionTone?: Tone; teams?: [number, number][]; y?: number } = {},
): Scene {
  const r = sortRow(prefix, spots, { y: o.y ?? 100 });
  const idx = (v: number) => spots.findIndex((s) => s.v === v);
  const nodes: SceneNode[] = [];
  (o.teams ?? []).forEach(([a, b], k) => nodes.push(team(`team${k}`, r.at, a, b)));
  nodes.push(...r.nodes);
  if (o.swap) nodes.push(swapArc('swap', r.at[idx(o.swap[0])], r.at[idx(o.swap[1])]));
  for (const tg of o.tags ?? []) nodes.push(...pointer(`tag${tg.v}`, r.at[idx(tg.v)], tg.label, tg.side, tg.tone));
  if (o.caption) nodes.push(caption('cap', o.caption, o.captionTone ?? 'accent'));
  return scene(nodes);
}

// ── Bubble sort ───────────────────────────────────────────────────────

const BUBBLE_STORY: Record<'line' | 'swap1' | 'stay' | 'float' | 'round2' | 'done', T> = {
  line: t(
    'Let us line up these bubbles from smallest to biggest, like kids by height. Bubble sort only looks at two neighbours at a time.',
    '我们把泡泡从小到大排好队，就像小朋友按身高排队。冒泡排序每次只看相邻的两个。',
    '我們把泡泡從小到大排好隊，就像小朋友按身高排隊。泡沫排序每次只看相鄰的兩個。',
    'バブルを小さい順にならべよう。せの順にならぶみたいにね。バブルソートは、いつも となりどうしの 2 つだけを見るよ。',
    'Выстроим пузыри от маленького к большому, как ребят по росту. Сортировка пузырьком смотрит только на двух соседей сразу.',
  ),
  swap1: t(
    'Look at 3 and 1. The left one is bigger, so they swap. Whoosh!',
    '看 3 和 1。左边的更大，所以交换。嗖！',
    '看 3 和 1。左邊的更大，所以交換。咻！',
    '3 と 1 を見よう。左の方が大きいから、入れかえ。ビュン！',
    'Смотрим на 3 и 1. Левый больше — меняем их. Вжух!',
  ),
  stay: t(
    'Next pair: 3 and 4. The left one is not bigger, so they stay.',
    '下一对：3 和 4。左边的不比右边大，所以不动。',
    '下一對：3 和 4。左邊的不比右邊大，所以不動。',
    'つぎは 3 と 4。左の方が大きくないから、そのまま。',
    'Следующая пара: 3 и 4. Левый не больше — они остаются.',
  ),
  float: t(
    'Then 4 and 2 swap. See? The biggest bubble, 4, floated all the way to the end. It is home!',
    '接着 4 和 2 交换。看！最大的泡泡 4 一路浮到了最后。它到家了！',
    '接著 4 和 2 交換。看！最大的泡泡 4 一路浮到了最後。它到家了！',
    'つぎに 4 と 2 が入れかわる。見て！いちばん大きい 4 が、最後まで うかんでいった。おうちに着いたよ！',
    'Потом 4 и 2 меняются. Видишь? Самый большой, 4, уплыл в самый конец. Он дома!',
  ),
  round2: t(
    'Round 2: walk from the left again. 1 and 3 stay, then 3 and 2 swap. Now 3 is home too.',
    '第 2 轮：再从左边走一遍。1 和 3 不动，3 和 2 交换。现在 3 也到家了。',
    '第 2 輪：再從左邊走一遍。1 和 3 不動，3 和 2 交換。現在 3 也到家了。',
    'ラウンド 2：もう一度 左から。1 と 3 はそのまま、3 と 2 は入れかえ。これで 3 もおうちに着いた。',
    'Раунд 2: снова идём слева. 1 и 3 остаются, 3 и 2 меняются. Теперь и 3 дома.',
  ),
  done: t(
    'Each round, one more bubble gets home. In round 3, 1 and 2 are already in order. Everyone is lined up!',
    '每一轮都有一个泡泡到家。第 3 轮时，1 和 2 已经排好了。大家都排好队了！',
    '每一輪都有一個泡泡到家。第 3 輪時，1 和 2 已經排好了。大家都排好隊了！',
    'ラウンドごとに、バブルが 1 つずつ おうちに着く。ラウンド 3 では 1 と 2 はもう正しい順。みんな ならんだね！',
    'Каждый раунд ещё один пузырь попадает домой. В раунде 3 видим: 1 и 2 уже по порядку. Все выстроились!',
  ),
};

const BUBBLE_QUIZ: Record<'q1' | 'swap' | 'stay' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'Bubble 5 is on the left, bubble 2 on the right. Should they swap?',
    '泡泡 5 在左边，泡泡 2 在右边。它们要交换吗？',
    '泡泡 5 在左邊，泡泡 2 在右邊。它們要交換嗎？',
    'バブル 5 が左、バブル 2 が右。入れかえる？',
    'Пузырь 5 слева, пузырь 2 справа. Поменять их?',
  ),
  swap: t('Swap!', '交换！', '交換！', '入れかえ！', 'Поменять!'),
  stay: t('Stay!', '不动！', '不動！', 'そのまま！', 'Оставить!'),
  q1e: t(
    'The left one is bigger, so they swap. Then 2 is on the left.',
    '左边的更大，所以交换，2 就到了左边。',
    '左邊的更大，所以交換，2 就到了左邊。',
    '左の方が大きいから入れかえ。これで 2 が左になるよ。',
    'Левый больше, поэтому меняем. Теперь 2 слева.',
  ),
  q2: t(
    'After round 1, where is the biggest bubble?',
    '第 1 轮结束后，最大的泡泡在哪里？',
    '第 1 輪結束後，最大的泡泡在哪裡？',
    'ラウンド 1 が終わったら、いちばん大きいバブルは どこ？',
    'Где самый большой пузырь после первого раунда?',
  ),
  q2a: t('At the right end', '在最右边', '在最右邊', 'いちばん右', 'В правом конце'),
  q2b: t('At the left end', '在最左边', '在最左邊', 'いちばん左', 'В левом конце'),
  q2c: t('In the middle', '在中间', '在中間', 'まん中', 'В середине'),
  q2e: t(
    'It is bigger than every neighbour it meets, so it keeps swapping until it reaches the end.',
    '它比遇到的每个邻居都大，所以一路交换，直到最后。',
    '它比遇到的每個鄰居都大，所以一路交換，直到最後。',
    '出会う となりより いつも大きいから、入れかえ続けて 最後まで行くよ。',
    'Он больше каждого соседа, поэтому меняется снова и снова, пока не дойдёт до конца.',
  ),
  q3: t(
    'We do one round on this row. What does it look like after the round?',
    '对这一排走一轮。走完以后是什么样子？',
    '對這一排走一輪。走完以後是什麼樣子？',
    'この列で ラウンドを 1 回やるよ。終わったら どうなる？',
    'Делаем один раунд на этом ряду. Каким он станет?',
  ),
  q3e: t(
    '2 and 3 stay. Then 3 and 1 swap. So we get 2 1 3, and round 2 will fix the rest.',
    '2 和 3 不动，3 和 1 交换，得到 2 1 3。剩下的交给第 2 轮。',
    '2 和 3 不動，3 和 1 交換，得到 2 1 3。剩下的交給第 2 輪。',
    '2 と 3 はそのまま、3 と 1 は入れかえ。だから 2 1 3。のこりはラウンド 2 で直すよ。',
    '2 и 3 остаются, 3 и 1 меняются — получается 2 1 3. Остальное исправит раунд 2.',
  ),
};

const bubble_sort: LessonContent = {
  story(l): StorySlide[] {
    const S = BUBBLE_STORY;
    const p = 'bb';
    return [
      { scene: sortScene(p, line([3, 1, 4, 2]), { caption: LABEL.smallToBig[l] }), say: S.line[l] },
      { scene: sortScene(p, line([1, 3, 4, 2], [1, 3]), { swap: [1, 3] }), say: S.swap1[l] },
      { scene: sortScene(p, line([1, 3, 4, 2], [3, 4])), say: S.stay[l] },
      { scene: sortScene(p, line([1, 3, 2, 4], [2], [4]), { swap: [2, 4] }), say: S.float[l] },
      { scene: sortScene(p, line([1, 2, 3, 4], [2], [3, 4]), { swap: [2, 3] }), say: S.round2[l] },
      { scene: sortScene(p, line([1, 2, 3, 4], [], [1, 2, 3, 4]), { caption: LABEL.smallToBig[l] }), say: S.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = BUBBLE_QUIZ;
    return [
      {
        prompt: Q.q1[l],
        choices: [
          { id: 'swap', label: Q.swap[l] },
          { id: 'stay', label: Q.stay[l] },
        ],
        answer: 'swap',
        explain: Q.q1e[l],
        scene: sortScene('bb', line([5, 2], [5, 2])),
      },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'end', label: Q.q2a[l] },
          { id: 'start', label: Q.q2b[l] },
          { id: 'middle', label: Q.q2c[l] },
        ],
        answer: 'end',
        explain: Q.q2e[l],
      },
      {
        prompt: Q.q3[l],
        choices: [
          { id: '213', label: '2 1 3' },
          { id: '123', label: '1 2 3' },
          { id: '321', label: '3 2 1' },
        ],
        answer: '213',
        explain: Q.q3e[l],
        scene: sortScene('bb', line([2, 3, 1])),
      },
    ];
  },
};

// ── Selection sort ────────────────────────────────────────────────────

const SELECTION_STORY: Record<'idea' | 'find' | 'swap' | 'stays' | 'swap3' | 'done', T> = {
  idea: t(
    'Selection sort is simple: find the smallest bubble and put it at the front. Then do it again with the rest.',
    '选择排序很简单：找到最小的泡泡，把它放到最前面。然后对剩下的再来一次。',
    '選擇排序很簡單：找到最小的泡泡，把它放到最前面。然後對剩下的再來一次。',
    '選択ソートはかんたん。いちばん小さいバブルを見つけて先頭におく。のこりでも同じことをくりかえすよ。',
    'Сортировка выбором простая: найди самый маленький пузырь и поставь его вперёд. Потом повтори с остальными.',
  ),
  find: t(
    'Round 1: we look at every bubble to find the smallest. It is 1!',
    '第 1 轮：把每个泡泡都看一遍，找出最小的。是 1！',
    '第 1 輪：把每個泡泡都看一遍，找出最小的。是 1！',
    'ラウンド 1：ぜんぶのバブルを見て、いちばん小さいのをさがす。1 だ！',
    'Раунд 1: смотрим на все пузыри и ищем самый маленький. Это 1!',
  ),
  swap: t(
    'Swap 1 with the bubble at the front, 4. Now 1 is home!',
    '把 1 和最前面的 4 交换。1 到家了！',
    '把 1 和最前面的 4 交換。1 到家了！',
    '1 を先頭の 4 と入れかえる。1 はおうちに着いた！',
    'Меняем 1 с первым пузырём, 4. Теперь 1 дома!',
  ),
  stays: t(
    'Round 2: look only at the rest. The smallest is 2, and it is already at the front of the rest. It stays!',
    '第 2 轮：只看剩下的。最小的是 2，它已经在剩下部分的最前面了，不用动！',
    '第 2 輪：只看剩下的。最小的是 2，它已經在剩下部分的最前面了，不用動！',
    'ラウンド 2：のこりだけを見る。いちばん小さいのは 2。もう のこりの先頭にいるから、そのまま！',
    'Раунд 2: смотрим только на остальных. Самый маленький — 2, и он уже стоит первым среди них. Остаётся!',
  ),
  swap3: t(
    'Round 3: the smallest of the rest is 3. Swap it with 5, and 3 is home.',
    '第 3 轮：剩下的里面最小的是 3。把它和 5 交换，3 到家了。',
    '第 3 輪：剩下的裡面最小的是 3。把它和 5 交換，3 到家了。',
    'ラウンド 3：のこりで いちばん小さいのは 3。5 と入れかえて、3 もおうちへ。',
    'Раунд 3: самый маленький из остальных — 3. Меняем его с 5, и 3 дома.',
  ),
  done: t(
    'Round 4: 4 is smaller than 5, so it stays. The last bubble is home by itself. All in order!',
    '第 4 轮：4 比 5 小，不用动。最后一个泡泡自然就到家了。全部排好啦！',
    '第 4 輪：4 比 5 小，不用動。最後一個泡泡自然就到家了。全部排好啦！',
    'ラウンド 4：4 は 5 より小さいから そのまま。最後のバブルは しぜんに おうちへ。ぜんぶ ならんだ！',
    'Раунд 4: 4 меньше 5, остаётся. Последний пузырь сам оказывается дома. Всё по порядку!',
  ),
};

const SELECTION_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'Round 1 on this row: which bubble moves to the front?',
    '对这一排做第 1 轮：哪个泡泡会去最前面？',
    '對這一排做第 1 輪：哪個泡泡會去最前面？',
    'この列でラウンド 1：先頭へ行くのは どのバブル？',
    'Раунд 1 на этом ряду: какой пузырь встанет вперёд?',
  ),
  q1e: t(
    '2 is the smallest bubble, so it swaps with 6 at the front.',
    '2 是最小的泡泡，所以它和最前面的 6 交换。',
    '2 是最小的泡泡，所以它和最前面的 6 交換。',
    '2 がいちばん小さいから、先頭の 6 と入れかわるよ。',
    '2 — самый маленький, поэтому он меняется с 6, который стоит впереди.',
  ),
  q2: t('What does each round of selection sort look for?', '选择排序的每一轮在找什么？', '選擇排序的每一輪在找什麼？', '選択ソートは、ラウンドごとに 何をさがす？', 'Что ищет каждый раунд сортировки выбором?'),
  q2a: t('The smallest of the rest', '剩下的里面最小的', '剩下的裡面最小的', 'のこりで いちばん小さいバブル', 'Самый маленький из остальных'),
  q2b: t('Two neighbours to swap', '要交换的两个邻居', '要交換的兩個鄰居', '入れかえる となりどうし', 'Двух соседей для обмена'),
  q2c: t('The middle bubble', '中间的泡泡', '中間的泡泡', 'まん中のバブル', 'Средний пузырь'),
  q2e: t(
    'Each round finds the smallest bubble that is not home yet and puts it in front of the rest.',
    '每一轮都找出还没到家的最小泡泡，放到剩下部分的最前面。',
    '每一輪都找出還沒到家的最小泡泡，放到剩下部分的最前面。',
    'ラウンドごとに、まだおうちにいない いちばん小さいバブルを見つけて、のこりの先頭におくよ。',
    'Каждый раунд находит самый маленький пузырь, который ещё не дома, и ставит его первым среди остальных.',
  ),
  q3: t(
    '1 is already home. In round 2, which two bubbles swap?',
    '1 已经到家了。第 2 轮里，哪两个泡泡交换？',
    '1 已經到家了。第 2 輪裡，哪兩個泡泡交換？',
    '1 はもう おうちにいる。ラウンド 2 で入れかわるのは どの 2 つ？',
    '1 уже дома. Какие два пузыря поменяются в раунде 2?',
  ),
  q3e: t(
    'The smallest of the rest is 2, and the front of the rest is 4. So 4 and 2 swap.',
    '剩下的里面最小的是 2，剩下部分的最前面是 4，所以 4 和 2 交换。',
    '剩下的裡面最小的是 2，剩下部分的最前面是 4，所以 4 和 2 交換。',
    'のこりで いちばん小さいのは 2、のこりの先頭は 4。だから 4 と 2 が入れかわる。',
    'Самый маленький из остальных — 2, а первым среди них стоит 4. Значит, меняются 4 и 2.',
  ),
};

const selection_sort: LessonContent = {
  story(l): StorySlide[] {
    const S = SELECTION_STORY;
    const p = 'sel';
    const smallest = LABEL.smallest[l];
    return [
      { scene: sortScene(p, line([4, 2, 5, 1, 3]), { caption: LABEL.smallToBig[l] }), say: S.idea[l] },
      { scene: sortScene(p, line([4, 2, 5, 1, 3], [1]), { tags: [{ v: 1, label: smallest }] }), say: S.find[l] },
      { scene: sortScene(p, line([1, 2, 5, 4, 3], [], [1]), { swap: [1, 4] }), say: S.swap[l] },
      {
        scene: sortScene(p, line([1, 2, 5, 4, 3], [2], [1]), { teams: [[1, 4]], tags: [{ v: 2, label: smallest, side: 'below' }], caption: LABEL.rest[l], captionTone: 'muted' }),
        say: S.stays[l],
      },
      { scene: sortScene(p, line([1, 2, 3, 4, 5], [], [1, 2, 3]), { swap: [3, 5] }), say: S.swap3[l] },
      { scene: sortScene(p, line([1, 2, 3, 4, 5], [], [1, 2, 3, 4, 5]), { caption: LABEL.smallToBig[l] }), say: S.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = SELECTION_QUIZ;
    return [
      { ...ask(Q.q1[l], [6, 3, 2], 2, Q.q1e[l]), scene: sortScene('sel', line([6, 3, 8, 2, 7])) },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'smallest', label: Q.q2a[l] },
          { id: 'pair', label: Q.q2b[l] },
          { id: 'middle', label: Q.q2c[l] },
        ],
        answer: 'smallest',
        explain: Q.q2e[l],
      },
      {
        prompt: Q.q3[l],
        choices: [
          { id: '4-2', label: AND[l](4, 2) },
          { id: '4-3', label: AND[l](4, 3) },
          { id: '3-2', label: AND[l](3, 2) },
        ],
        answer: '4-2',
        explain: Q.q3e[l],
        scene: sortScene('sel', line([1, 4, 3, 2], [], [1])),
      },
    ];
  },
};

// ── Insertion sort ────────────────────────────────────────────────────

/** Insertion sort picture: `sorted` is how many bubbles on the left are in order, `lift` is the one picked up. */
function cards(vals: number[], sorted: number, o: { lift?: number; pick?: number; caption?: string } = {}): Scene {
  const spots: Spot[] = vals.map((v) => ({ v, lift: v === o.lift, pick: v === o.lift || v === o.pick }));
  const r = sortRow('ins', spots, { y: 128 });
  const nodes: SceneNode[] = [];
  if (sorted > 0) {
    // The "in order" part: a green panel with its name underneath (a lifted bubble sits above it).
    const left = r.at[0].x - 8;
    const width = r.at[sorted - 1].x + r.at[sorted - 1].w - r.at[0].x + 16;
    nodes.push(region('sorted', left, 120, width, 72, { tone: 'ok' }));
    if (o.caption) nodes.push(text('sorted:l', left + width / 2, 216, o.caption, { anchor: 'middle', size: 15, bold: true, tone: 'ok' }));
  }
  nodes.push(...r.nodes);
  return scene(nodes);
}

const INSERTION_STORY: Record<'cards' | 'five' | 'pick2' | 'past5' | 'past3' | 'four', T> = {
  cards: t(
    'Insertion sort works like sorting cards in your hand. One bubble on its own is already in order.',
    '插入排序就像整理手里的扑克牌。只有一个泡泡的时候，它自己就是排好的。',
    '插入排序就像整理手裡的撲克牌。只有一個泡泡的時候，它自己就是排好的。',
    '挿入ソートは、手もちのトランプをならべるのと同じ。バブルが 1 つだけなら、もうならんでいるよ。',
    'Сортировка вставками похожа на то, как раскладывают карты в руке. Один пузырь сам по себе уже упорядочен.',
  ),
  five: t(
    'Pick up the next bubble, 5. The left one, 3, is not bigger, so 5 stays where it is.',
    '拿起下一个泡泡 5。左边的 3 不比它大，所以 5 待在原地。',
    '拿起下一個泡泡 5。左邊的 3 不比它大，所以 5 待在原地。',
    'つぎのバブル 5 を持ち上げる。左の 3 は大きくないから、5 はそのまま。',
    'Берём следующий пузырь, 5. Левый, 3, не больше, поэтому 5 остаётся на месте.',
  ),
  pick2: t('Pick up the next one, 2. Where does it fit?', '再拿起下一个：2。它该放在哪里？', '再拿起下一個：2。它該放在哪裡？', 'つぎは 2 を持ち上げる。どこに入るかな？', 'Берём следующий — 2. Куда он встанет?'),
  past5: t(
    '5 is bigger than 2, so 5 slides right and 2 moves left past it.',
    '5 比 2 大，所以 5 往右滑，2 越过它往左移。',
    '5 比 2 大，所以 5 往右滑，2 越過它往左移。',
    '5 は 2 より大きいから、5 が右へすべって、2 は左へ進む。',
    '5 больше 2, поэтому 5 отъезжает вправо, а 2 проходит влево мимо него.',
  ),
  past3: t(
    '3 is bigger too, so slide again! Nothing is left of 2 now, so it sits down at the front.',
    '3 也更大，再滑一次！2 的左边没有泡泡了，它就坐在最前面。',
    '3 也更大，再滑一次！2 的左邊沒有泡泡了，它就坐在最前面。',
    '3 も大きいから、もう一回すべる！2 の左には もう だれもいないから、先頭にすわるよ。',
    '3 тоже больше — ещё раз! Слева от 2 никого нет, и он садится в начало.',
  ),
  four: t(
    'Last, pick up 4. It slides past 5 and stops, because 3 is not bigger. All in order!',
    '最后拿起 4。它越过 5，然后停下，因为 3 不比它大。全部排好了！',
    '最後拿起 4。它越過 5，然後停下，因為 3 不比它大。全部排好了！',
    '最後に 4 を持ち上げる。5 をこえて、3 のところでストップ。3 は大きくないからね。ぜんぶ ならんだ！',
    'Наконец берём 4. Он проходит мимо 5 и останавливается: 3 не больше. Всё по порядку!',
  ),
};

const INSERTION_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t('We pick up 5. Where does it stop?', '拿起 5。它会停在哪里？', '拿起 5。它會停在哪裡？', '5 を持ち上げたよ。どこで止まる？', 'Берём 5. Где он остановится?'),
  q1a: t('Between 2 and 6', '2 和 6 中间', '2 和 6 中間', '2 と 6 のあいだ', 'Между 2 и 6'),
  q1b: t('At the very front', '最前面', '最前面', 'いちばん前', 'В самом начале'),
  q1c: t('After 9', '9 的后面', '9 的後面', '9 のうしろ', 'После 9'),
  q1e: t(
    '9 and 6 are bigger, so 5 slides past them. 2 is not bigger, so 5 stops right after 2.',
    '9 和 6 比 5 大，5 越过它们。2 不比 5 大，所以 5 停在 2 后面。',
    '9 和 6 比 5 大，5 越過它們。2 不比 5 大，所以 5 停在 2 後面。',
    '9 と 6 は大きいから こえていく。2 は大きくないから、2 のすぐうしろで止まる。',
    '9 и 6 больше, и 5 проходит мимо них. 2 не больше, поэтому 5 встаёт сразу после 2.',
  ),
  q2: t('When does the bubble you picked up stop sliding?', '拿起的泡泡什么时候停下来？', '拿起的泡泡什麼時候停下來？', '持ち上げたバブルは、いつ すべるのをやめる？', 'Когда взятый пузырь перестаёт двигаться?'),
  q2a: t('When the left one is not bigger', '左边的不比它大时', '左邊的不比它大時', '左が大きくないとき', 'Когда левый не больше'),
  q2b: t('When it reaches the middle', '滑到中间时', '滑到中間時', 'まん中に着いたとき', 'Когда дошёл до середины'),
  q2c: t('When the left one is bigger', '左边的比它大时', '左邊的比它大時', '左が大きいとき', 'Когда левый больше'),
  q2e: t(
    'Bigger bubbles make room. As soon as the left one is not bigger, the spot is found.',
    '比它大的泡泡会让开。一旦左边的不比它大，就找到位置了。',
    '比它大的泡泡會讓開。一旦左邊的不比它大，就找到位置了。',
    '大きいバブルは よけてくれる。左が大きくなくなったら、そこが その場所だよ。',
    'Большие пузыри уступают место. Как только левый не больше — место найдено.',
  ),
  q3: t('We pick up 2. How many bubbles does it slide past?', '拿起 2。它要越过几个泡泡？', '拿起 2。它要越過幾個泡泡？', '2 を持ち上げたよ。いくつのバブルを こえていく？', 'Берём 2. Мимо скольких пузырей он проедет?'),
  q3e: t(
    '7, 4 and 3 are all bigger than 2. 1 is not, so 2 stops after 1.',
    '7、4、3 都比 2 大。1 不比它大，所以 2 停在 1 后面。',
    '7、4、3 都比 2 大。1 不比它大，所以 2 停在 1 後面。',
    '7、4、3 は 2 より大きい。1 は大きくないから、1 のうしろで止まるよ。',
    '7, 4 и 3 больше 2. А 1 не больше, поэтому 2 встаёт после 1.',
  ),
};

const insertion_sort: LessonContent = {
  story(l): StorySlide[] {
    const S = INSERTION_STORY;
    const ok = LABEL.inOrder[l];
    return [
      { scene: cards([3, 5, 2, 4], 1, { caption: ok }), say: S.cards[l] },
      { scene: cards([3, 5, 2, 4], 2, { pick: 5, caption: ok }), say: S.five[l] },
      { scene: cards([3, 5, 2, 4], 2, { lift: 2, caption: ok }), say: S.pick2[l] },
      { scene: cards([3, 2, 5, 4], 3, { lift: 2, caption: ok }), say: S.past5[l] },
      { scene: cards([2, 3, 5, 4], 3, { pick: 2, caption: ok }), say: S.past3[l] },
      { scene: cards([2, 3, 4, 5], 4, { pick: 4, caption: ok }), say: S.four[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = INSERTION_QUIZ;
    const ok = LABEL.inOrder[l];
    return [
      {
        prompt: Q.q1[l],
        choices: [
          { id: 'mid', label: Q.q1a[l] },
          { id: 'front', label: Q.q1b[l] },
          { id: 'end', label: Q.q1c[l] },
        ],
        answer: 'mid',
        explain: Q.q1e[l],
        scene: cards([2, 6, 9, 5], 3, { lift: 5, caption: ok }),
      },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'notBigger', label: Q.q2a[l] },
          { id: 'middle', label: Q.q2b[l] },
          { id: 'bigger', label: Q.q2c[l] },
        ],
        answer: 'notBigger',
        explain: Q.q2e[l],
      },
      { ...ask(Q.q3[l], [1, 2, 3], 3, Q.q3e[l]), scene: cards([1, 3, 4, 7, 2], 4, { lift: 2, caption: ok }) },
    ];
  },
};

// ── Quick sort ────────────────────────────────────────────────────────

const QUICK_STORY: Record<'leader' | 'helpers' | 'trade' | 'home' | 'teams' | 'done', T> = {
  leader: t(
    'Quick sort picks a leader. Smaller bubbles go to its left, bigger ones to its right. Like a teacher splitting a class into two teams!',
    '快速排序会选一个队长。比它小的去左边，比它大的去右边，就像老师把同学分成两队！',
    '快速排序會選一個隊長。比它小的去左邊，比它大的去右邊，就像老師把同學分成兩隊！',
    'クイックソートは リーダーを決める。小さいバブルは左へ、大きいバブルは右へ。先生がクラスを 2 チームに分けるみたいにね！',
    'Быстрая сортировка выбирает вожака. Меньшие пузыри идут налево, большие — направо. Как учитель делит класс на две команды!',
  ),
  helpers: t(
    'The first bubble, 3, is the leader. Two helpers search: one from the right for a smaller bubble, one from the left for a bigger one.',
    '第一个泡泡 3 当队长。两个小帮手出发：一个从右边找更小的，一个从左边找更大的。',
    '第一個泡泡 3 當隊長。兩個小幫手出發：一個從右邊找更小的，一個從左邊找更大的。',
    '最初のバブル 3 がリーダー。お手伝いが 2 人 さがすよ。右からは小さいバブルを、左からは大きいバブルを。',
    'Первый пузырь, 3, — вожак. Два помощника ищут: один справа ищет пузырь поменьше, другой слева — побольше.',
  ),
  trade: t(
    'They find 2 and 5. Both are on the wrong side, so whoosh, they trade places!',
    '它们找到了 2 和 5。两个都站错了边，嗖，交换位置！',
    '它們找到了 2 和 5。兩個都站錯了邊，咻，交換位置！',
    '見つかったのは 2 と 5。どっちも反対がわにいるから、ビュン！入れかわる。',
    'Они находят 2 и 5. Оба не на своей стороне — вжух, меняются местами!',
  ),
  home: t(
    'The helpers meet at 1. The leader swaps with 1 and lands between the teams. 3 is home!',
    '两个帮手在 1 那里碰头。队长和 1 交换，站到两队中间。3 到家了！',
    '兩個幫手在 1 那裡碰頭。隊長和 1 交換，站到兩隊中間。3 到家了！',
    'お手伝いは 1 のところで出会う。リーダーは 1 と入れかわって、チームのあいだへ。3 はおうちに着いた！',
    'Помощники встречаются у 1. Вожак меняется с 1 и встаёт между командами. 3 дома!',
  ),
  teams: t(
    'Now each team does the same with its own leader: 1 in the small team, 4 in the big team.',
    '接着每一队都照样来：小队的队长是 1，大队的队长是 4。',
    '接著每一隊都照樣來：小隊的隊長是 1，大隊的隊長是 4。',
    'つぎは それぞれのチームで同じことをする。小さいチームのリーダーは 1、大きいチームは 4。',
    'Теперь каждая команда делает то же самое со своим вожаком: 1 в маленькой команде, 4 — в большой.',
  ),
  done: t(
    'Teams get smaller and smaller until every bubble is home. All in order!',
    '队伍越分越小，直到每个泡泡都到家。全部排好了！',
    '隊伍越分越小，直到每個泡泡都到家。全部排好了！',
    'チームはどんどん小さくなって、さいごは みんな おうちへ。ぜんぶ ならんだ！',
    'Команды становятся всё меньше, пока каждый пузырь не окажется дома. Всё по порядку!',
  ),
};

const QUICK_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('The leader is 4. Which side does 6 go to?', '队长是 4。6 要去哪一边？', '隊長是 4。6 要去哪一邊？', 'リーダーは 4。6 はどっちへ行く？', 'Вожак — 4. В какую сторону пойдёт 6?'),
  q1a: t('Left: the smaller team', '左边：小的一队', '左邊：小的一隊', '左：小さいチーム', 'Налево, к меньшим'),
  q1b: t('Right: the bigger team', '右边：大的一队', '右邊：大的一隊', '右：大きいチーム', 'Направо, к большим'),
  q1e: t(
    '6 is bigger than the leader 4, so it joins the team on the right.',
    '6 比队长 4 大，所以去右边那队。',
    '6 比隊長 4 大，所以去右邊那隊。',
    '6 はリーダーの 4 より大きいから、右のチームへ。',
    '6 больше вожака 4, поэтому идёт в команду справа.',
  ),
  q2: t(
    'In our game, which bubble is the first leader?',
    '在我们的游戏里，哪个泡泡当第一个队长？',
    '在我們的遊戲裡，哪個泡泡當第一個隊長？',
    'ゲームでは、最初のリーダーは どのバブル？',
    'Какой пузырь в нашей игре становится первым вожаком?',
  ),
  q2e: t(
    'The first bubble in the row is the leader, so it is 5.',
    '排在第一个的泡泡当队长，所以是 5。',
    '排在第一個的泡泡當隊長，所以是 5。',
    '列の最初のバブルがリーダー。だから 5 だよ。',
    'Вожак — первый пузырь в ряду, то есть 5.',
  ),
  q3: t('Leader 3 is home. What happens next?', '队长 3 到家了。接下来会怎样？', '隊長 3 到家了。接下來會怎樣？', 'リーダーの 3 が おうちに着いた。つぎは どうなる？', 'Вожак 3 дома. Что дальше?'),
  q3a: t(
    'Each team picks its own leader and does the same',
    '每一队选自己的队长，照样再来',
    '每一隊選自己的隊長，照樣再來',
    'それぞれのチームでリーダーを決めて、同じことをする',
    'Каждая команда выбирает вожака и делает то же',
  ),
  q3b: t('Everyone mixes up and we start over', '大家打乱，从头再来', '大家打亂，從頭再來', 'みんなまぜて、さいしょからやり直す', 'Всех перемешиваем и начинаем сначала'),
  q3c: t('Nothing: the row is already sorted', '什么也不做：已经排好了', '什麼也不做：已經排好了', 'なにもしない：もうならんでいる', 'Ничего: ряд уже упорядочен'),
  q3e: t(
    'Inside the teams, 2 1 and 5 4 are still mixed up. Each team repeats the same trick until every bubble is home.',
    '两队里面，2 1 和 5 4 还是乱的。每一队都用同样的方法，直到每个泡泡都到家。',
    '兩隊裡面，2 1 和 5 4 還是亂的。每一隊都用同樣的方法，直到每個泡泡都到家。',
    'チームの中の 2 1 と 5 4 は、まだ ならんでいない。みんなが おうちに着くまで、同じわざを くりかえすよ。',
    'Внутри команд, 2 1 и 5 4, порядка ещё нет. Каждая повторяет тот же приём, пока все пузыри не окажутся дома.',
  ),
};

const quick_sort: LessonContent = {
  story(l): StorySlide[] {
    const S = QUICK_STORY;
    const p = 'qs';
    const leader = LABEL.leader[l];
    const lead = (v: number) => ({ v, label: leader });
    return [
      { scene: sortScene(p, line([3, 5, 1, 4, 2], [3]), { tags: [lead(3)] }), say: S.leader[l] },
      {
        scene: sortScene(p, line([3, 5, 1, 4, 2], [3]), {
          tags: [lead(3), { v: 5, label: LABEL.bigger[l], side: 'below', tone: 'info' }, { v: 2, label: LABEL.smaller[l], side: 'below', tone: 'info' }],
        }),
        say: S.helpers[l],
      },
      { scene: sortScene(p, line([3, 2, 1, 4, 5], [2, 5]), { tags: [lead(3)], swap: [2, 5] }), say: S.trade[l] },
      { scene: sortScene(p, line([1, 2, 3, 4, 5], [], [3]), { swap: [1, 3] }), say: S.home[l] },
      {
        scene: sortScene(p, line([1, 2, 3, 4, 5], [1, 4], [3]), {
          teams: [
            [0, 1],
            [3, 4],
          ],
          tags: [lead(1), lead(4)],
        }),
        say: S.teams[l],
      },
      { scene: sortScene(p, line([1, 2, 3, 4, 5], [], [1, 2, 3, 4, 5]), { caption: LABEL.smallToBig[l] }), say: S.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = QUICK_QUIZ;
    const leader = LABEL.leader[l];
    return [
      {
        prompt: Q.q1[l],
        choices: [
          { id: 'left', label: Q.q1a[l] },
          { id: 'right', label: Q.q1b[l] },
        ],
        answer: 'right',
        explain: Q.q1e[l],
        scene: sortScene('qs', line([4, 7, 1, 6, 2], [4]), { tags: [{ v: 4, label: leader }] }),
      },
      { ...ask(Q.q2[l], [5, 2, 8, 1], 5, Q.q2e[l]), scene: sortScene('qs', line([5, 2, 8, 1])) },
      {
        prompt: Q.q3[l],
        choices: [
          { id: 'each', label: Q.q3a[l] },
          { id: 'over', label: Q.q3b[l] },
          { id: 'done', label: Q.q3c[l] },
        ],
        answer: 'each',
        explain: Q.q3e[l],
        // What leader 3 leaves after splitting [3, 1, 2, 5, 4]: both teams still mixed up.
        scene: sortScene('qs', line([2, 1, 3, 5, 4], [], [3]), {
          teams: [
            [0, 1],
            [3, 4],
          ],
        }),
      },
    ];
  },
};

// ── Merge sort ────────────────────────────────────────────────────────

const M_W = 50;
const M_GAP = 12;
const M_TOP = 62;
const M_LINE = 172;

/**
 * Merge sort picture. `top` lists bubbles still in their teams as [value, spot] (spots 0..3 of a
 * row split into `teams`); `out` are the values already in the new line, left to right.
 */
function merge(top: [number, number][], teams: number[], o: { out?: number[]; pick?: number[]; line?: string; home?: boolean } = {}): Scene {
  const xs = spots(4, M_W, M_GAP, teams);
  const nodes: SceneNode[] = [];
  // One panel per team, spanning its spots.
  let first = 0;
  teams.forEach((size, k) => {
    const members = top.filter(([, s]) => s >= first && s < first + size);
    if (members.length) {
      const a = Math.min(...members.map(([, s]) => s));
      const b = Math.max(...members.map(([, s]) => s));
      nodes.push(region(`team${k}`, xs[a] - 8, M_TOP - 8, xs[b] + M_W - xs[a] + 16, M_W + 16, { tone: 'soft' }));
    }
    first += size;
  });
  const out = o.out ?? [];
  if (o.line !== undefined) {
    const lx = spots(4, M_W, M_GAP);
    nodes.push(region('line', lx[0] - 8, M_LINE - 8, lx[3] + M_W - lx[0] + 16, M_W + 16, { tone: o.home ? 'ok' : 'soft', label: o.line }));
    lx.forEach((x, k) => {
      if (k >= out.length) nodes.push(box(`slot${k}`, x, M_LINE, '', { w: M_W, h: M_W, tone: 'ghost', dashed: true }));
    });
    // A finished line turns green; no crowns here, they would cover the line's label.
    const tone = (v: number): Tone | undefined => (o.pick?.includes(v) ? 'warn' : o.home ? 'ok' : undefined);
    out.forEach((v, k) => nodes.push(...bubble({ id: `ms${v}`, v, ring: o.pick?.includes(v), tone: tone(v) }, lx[k], M_LINE, M_W).nodes));
  }
  for (const [v, s] of top) nodes.push(...bubble({ id: `ms${v}`, v, ring: o.pick?.includes(v), tone: o.pick?.includes(v) ? 'warn' : undefined }, xs[s], M_TOP, M_W).nodes);
  return scene(nodes);
}

const MERGE_STORY: Record<'idea' | 'half' | 'ones' | 'pairs' | 'front' | 'done', T> = {
  idea: t(
    'Merge sort has two parts: first split the row into tiny teams, then join the teams back in order.',
    '归并排序分两步：先把队伍分成小小的队伍，再按顺序把队伍合起来。',
    '合併排序分兩步：先把隊伍分成小小的隊伍，再按順序把隊伍合起來。',
    'マージソートは 2 ステップ。まず列を小さなチームに分けて、それから順番どおりに合わせるよ。',
    'У сортировки слиянием два шага: сначала делим ряд на маленькие команды, потом по порядку собираем их обратно.',
  ),
  half: t(
    'Split the row in half: two teams of two.',
    '从中间切开：变成两队，每队两个泡泡。',
    '從中間切開：變成兩隊，每隊兩個泡泡。',
    'まん中で分ける。2 こずつの チームが 2 つ。',
    'Делим ряд пополам: две команды по два пузыря.',
  ),
  ones: t(
    'Split again. Now each team has one bubble, and a team of one is always in order!',
    '再分一次。现在每队只有一个泡泡。只有一个，当然是排好的！',
    '再分一次。現在每隊只有一個泡泡。只有一個，當然是排好的！',
    'もう一回分ける。どのチームも 1 こだけ。1 こなら、いつでも ならんでいるね！',
    'Делим ещё раз. Теперь в каждой команде по одному пузырю, а один пузырь всегда упорядочен!',
  ),
  pairs: t(
    'Now join them back. 2 is smaller than 5, so 2 goes first. 1 and 4 join the same way: 1 first.',
    '现在合起来。2 比 5 小，所以 2 先走。1 和 4 也一样：1 先走。',
    '現在合起來。2 比 5 小，所以 2 先走。1 和 4 也一樣：1 先走。',
    'さあ 合わせよう。2 は 5 より小さいから 2 が先。1 と 4 も同じで、1 が先。',
    'Теперь собираем. 2 меньше 5, значит, 2 идёт первым. 1 и 4 так же: 1 первым.',
  ),
  front: t(
    'Join the two teams into one new line. Look at the fronts: 2 or 1? 1 is smaller, so it steps in first.',
    '把两队合成一条新队伍。看两队排头：2 还是 1？1 更小，它先站进来。',
    '把兩隊合成一條新隊伍。看兩隊排頭：2 還是 1？1 更小，它先站進來。',
    '2 つのチームを 新しい列に合わせる。先頭どうしをくらべて：2 と 1？1 が小さいから、先に入る。',
    'Собираем две команды в новый строй. Сравниваем первых: 2 или 1? 1 меньше — встаёт первым.',
  ),
  done: t(
    'Then 2 or 4? 2 goes. 5 or 4? 4 goes. Last comes 5. One team, all in order!',
    '接着 2 还是 4？2 先。5 还是 4？4 先。最后是 5。只剩一队，全部排好了！',
    '接著 2 還是 4？2 先。5 還是 4？4 先。最後是 5。只剩一隊，全部排好了！',
    'つぎは 2 と 4？2 が先。5 と 4？4 が先。最後に 5。1 チームになって、ぜんぶ ならんだ！',
    'Дальше 2 или 4? Идёт 2. 5 или 4? Идёт 4. Последним — 5. Одна команда, всё по порядку!',
  ),
};

const MERGE_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'Both teams are in order. Which bubble steps into the new line first?',
    '两队都排好了。哪个泡泡先站进新队伍？',
    '兩隊都排好了。哪個泡泡先站進新隊伍？',
    'どちらのチームも ならんでいる。新しい列に 先に入るのは どのバブル？',
    'Обе команды упорядочены. Какой пузырь первым встанет в новый строй?',
  ),
  q1e: t(
    'Compare the fronts, 3 and 2. 2 is smaller, so it goes first.',
    '比较排头 3 和 2。2 更小，先走。',
    '比較排頭 3 和 2。2 更小，先走。',
    '先頭の 3 と 2 をくらべる。2 が小さいから先だよ。',
    'Сравниваем первых: 3 и 2. 2 меньше — идёт первым.',
  ),
  q2: t('What does merge sort do first?', '归并排序第一步做什么？', '合併排序第一步做什麼？', 'マージソートが さいしょにすることは？', 'Что сортировка слиянием делает сначала?'),
  q2a: t('Split into tiny teams', '分成小小的队伍', '分成小小的隊伍', '小さなチームに分ける', 'Делит на маленькие команды'),
  q2b: t('Find the smallest bubble', '找最小的泡泡', '找最小的泡泡', 'いちばん小さいバブルをさがす', 'Ищет самый маленький пузырь'),
  q2c: t('Pick a leader', '选一个队长', '選一個隊長', 'リーダーを決める', 'Выбирает вожака'),
  q2e: t(
    'First it splits until every team has one bubble. Then it joins the teams back in order.',
    '先一直分，直到每队只有一个泡泡，再按顺序合起来。',
    '先一直分，直到每隊只有一個泡泡，再按順序合起來。',
    'まず、1 こずつになるまで分ける。それから 順番どおりに合わせるよ。',
    'Сначала она делит, пока в каждой команде не останется по одному пузырю. Потом собирает по порядку.',
  ),
  q3: t(
    '1 and 4 are already in the new line. Who steps in next?',
    '1 和 4 已经站进新队伍了。下一个是谁？',
    '1 和 4 已經站進新隊伍了。下一個是誰？',
    '1 と 4 は もう新しい列にいる。つぎに入るのは？',
    '1 и 4 уже в новом строю. Кто встанет следующим?',
  ),
  q3e: t(
    'The fronts are now 6 and 7. 6 is smaller, so it goes next.',
    '现在排头是 6 和 7。6 更小，下一个就是它。',
    '現在排頭是 6 和 7。6 更小，下一個就是它。',
    'いまの先頭は 6 と 7。6 が小さいから、つぎは 6。',
    'Теперь первые — 6 и 7. 6 меньше, значит, следующий он.',
  ),
};

const merge_sort: LessonContent = {
  story(l): StorySlide[] {
    const S = MERGE_STORY;
    const nl = LABEL.newLine[l];
    const start: [number, number][] = [
      [5, 0],
      [2, 1],
      [4, 2],
      [1, 3],
    ];
    return [
      { scene: merge(start, [4]), say: S.idea[l] },
      { scene: merge(start, [2, 2]), say: S.half[l] },
      { scene: merge(start, [1, 1, 1, 1]), say: S.ones[l] },
      {
        scene: merge(
          [
            [2, 0],
            [5, 1],
            [1, 2],
            [4, 3],
          ],
          [2, 2],
          { pick: [2, 1] },
        ),
        say: S.pairs[l],
      },
      {
        scene: merge(
          [
            [2, 0],
            [5, 1],
            [4, 3],
          ],
          [2, 2],
          { out: [1], pick: [1], line: nl },
        ),
        say: S.front[l],
      },
      { scene: merge([], [2, 2], { out: [1, 2, 4, 5], line: nl, home: true }), say: S.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = MERGE_QUIZ;
    const nl = LABEL.newLine[l];
    return [
      {
        ...ask(Q.q1[l], [3, 8, 2], 2, Q.q1e[l]),
        scene: merge(
          [
            [3, 0],
            [8, 1],
            [2, 2],
            [9, 3],
          ],
          [2, 2],
          { line: nl },
        ),
      },
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'split', label: Q.q2a[l] },
          { id: 'min', label: Q.q2b[l] },
          { id: 'leader', label: Q.q2c[l] },
        ],
        answer: 'split',
        explain: Q.q2e[l],
      },
      {
        ...ask(Q.q3[l], [6, 7], 6, Q.q3e[l]),
        scene: merge(
          [
            [6, 1],
            [7, 3],
          ],
          [2, 2],
          { out: [1, 4], line: nl },
        ),
      },
    ];
  },
};

const LESSONS: Record<string, LessonContent> = { linear_search, binary_search, bubble_sort, selection_sort, insertion_sort, quick_sort, merge_sort };

export default LESSONS;
