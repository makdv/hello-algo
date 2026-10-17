import type { Locale } from '../../i18n/locale';
import { arrow, box, cellX, chip, link, region, rowWidth, seg, tag, text, textWidth } from '../kit';
import type { BoxNode, Figure, PathNode, SceneFrame, SceneNode, Segment, StaticFigure, StepFigure, Tone } from '../scene';

type T = Record<Locale, string>;

/** Fills `{name}` placeholders. */
const fmt = (s: string, vars: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));

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

const W = 440;

// ── Looking up a dictionary: binary search ────────────────────────────

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const TARGET = 'r';

const DICT_W = 460;
const CW = 15;
const CG = 2;
const CX0 = (DICT_W - rowWidth(LETTERS.length, CW, CG)) / 2;
const CY = 62;
const CH = 24;

const DICT: Record<'task' | 'range' | 'middle', T> = {
  task: {
    en: 'find a word starting with {r}',
    zh: '查找首字母为 {r} 的字',
    'zh-hant': '查詢首字母為 {r} 的字',
    ja: '先頭文字が {r} の字を探す',
    ru: 'найти слово на букву {r}',
  },
  range: { en: 'search range', zh: '查找范围', 'zh-hant': '查詢範圍', ja: '探索範囲', ru: 'область поиска' },
  middle: { en: 'middle', zh: '中点', 'zh-hant': '中點', ja: '中央', ru: 'середина' },
};

const DICT_SAY: Record<'init' | 'openFirst' | 'open' | 'after' | 'before' | 'found', T> = {
  init: {
    en: 'Words in a dictionary are sorted alphabetically. We look for a word starting with r.',
    zh: '字典按照拼音字母顺序排列。我们要查找拼音首字母为 r 的字。',
    'zh-hant': '字典按照拼音字母順序排列。我們要查詢拼音首字母為 r 的字。',
    ja: '辞書はピンインのアルファベット順に並んでいます。先頭文字が r の字を探します。',
    ru: 'Слова в словаре упорядочены по алфавиту. Ищем слово на букву r.',
  },
  openFirst: {
    en: 'Open the dictionary to about halfway: the first word on that page starts with {m}.',
    zh: '翻开字典约一半的页数，该页的首字母为 {m}。',
    'zh-hant': '翻開字典約一半的頁數，該頁的首字母為 {m}。',
    ja: '辞書をおよそ半分のところで開きます。そのページの先頭文字は {m} です。',
    ru: 'Открываем словарь примерно на середине: первое слово на странице начинается на {m}.',
  },
  open: {
    en: 'Open the middle of the remaining pages: this page starts with {m}.',
    zh: '翻开剩余部分的中间页，该页的首字母为 {m}。',
    'zh-hant': '翻開剩餘部分的中間頁，該頁的首字母為 {m}。',
    ja: '残りのページの真ん中を開きます。先頭文字は {m} です。',
    ru: 'Открываем середину оставшихся страниц: здесь первая буква — {m}.',
  },
  after: {
    en: 'r comes after {m}, so the first half, {m} included, is excluded. The search range shrinks to {lo}–{hi}.',
    zh: 'r 位于 {m} 之后，排除前半部分（含 {m}），查找范围缩小到 {lo}–{hi}。',
    'zh-hant': 'r 位於 {m} 之後，排除前半部分（含 {m}），查詢範圍縮小到 {lo}–{hi}。',
    ja: 'r は {m} の後にあるので、{m} を含む前半を除外し、探索範囲を {lo}〜{hi} に絞ります。',
    ru: 'r идёт после {m}, поэтому первую половину вместе с {m} исключаем. Область поиска сужается до {lo}–{hi}.',
  },
  before: {
    en: 'r comes before {m}, so the second half, {m} included, is excluded. The search range shrinks to {lo}–{hi}.',
    zh: 'r 位于 {m} 之前，排除后半部分（含 {m}），查找范围缩小到 {lo}–{hi}。',
    'zh-hant': 'r 位於 {m} 之前，排除後半部分（含 {m}），查詢範圍縮小到 {lo}–{hi}。',
    ja: 'r は {m} の前にあるので、{m} を含む後半を除外し、探索範囲を {lo}〜{hi} に絞ります。',
    ru: 'r идёт раньше {m}, поэтому вторую половину вместе с {m} исключаем. Область поиска сужается до {lo}–{hi}.',
  },
  found: {
    en: 'Open the middle again: this page starts with r. Found! Each look halves the range, so {n} looks were enough. This is binary search.',
    zh: '再翻开中间页，首字母正是 r，查找完成！每一步都把范围缩小一半，只翻了 {n} 次。这就是“二分查找”。',
    'zh-hant': '再翻開中間頁，首字母正是 r，查詢完成！每一步都把範圍縮小一半，只翻了 {n} 次。這就是“二分搜尋”。',
    ja: 'もう一度真ん中を開くと、先頭文字はまさに r。見つかりました！毎回範囲が半分になるので、開いたのは {n} 回だけです。これが「二分探索」です。',
    ru: 'Снова открываем середину: здесь первая буква — r. Нашли! Каждый шаг вдвое сужает область, поэтому словарь пришлось открыть всего {n} раза. Это двоичный поиск.',
  },
};

function dictScene(l: Locale, s: { lo: number; hi: number; mid?: number; op?: string; found?: boolean }) {
  const nodes: SceneNode[] = [
    chip('task', DICT_W / 2, 6, rich(DICT.task[l], { r: [TARGET, 'accent', true] }), { sans: true, size: 13 }),
    region('range', cellX(CX0, s.lo, CW, CG) - 4, CY - 4, rowWidth(s.hi - s.lo + 1, CW, CG) + 8, CH + 8, {
      tone: s.found ? 'ok' : 'info',
      label: DICT.range[l],
    }),
  ];
  LETTERS.forEach((ch, i) => {
    const inRange = i >= s.lo && i <= s.hi;
    const isMid = i === s.mid;
    const tone: Tone = isMid && inRange ? (s.found ? 'ok' : 'accent') : inRange ? 'idle' : 'muted';
    nodes.push(box(`L${ch}`, cellX(CX0, i, CW, CG), CY, ch, { w: CW, h: CH, size: 12, tone, dim: !inRange, ring: isMid && inRange }));
  });
  if (s.mid !== undefined) {
    const cell = { x: cellX(CX0, s.mid, CW, CG), y: CY, w: CW, h: CH };
    const tone: Tone = s.found ? 'ok' : 'accent';
    nodes.push(...tag('mid', cell, DICT.middle[l], { side: 'below', tone }));
    nodes.push(
      chip('cmp', cell.x + CW / 2, 124, seg([TARGET, 'accent', true], ` ${s.op ?? '?'} `, [LETTERS[s.mid], s.found ? 'ok' : 'idle', true]), { size: 14 }),
    );
  }
  return { w: DICT_W, h: 160, nodes };
}

const binarySearchDictionary: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', open: 'cmp', discard: 'swp', found: 'done' },
  build(l) {
    const S = DICT_SAY;
    const frames: SceneFrame[] = [{ kind: 'init', scene: dictScene(l, { lo: 0, hi: LETTERS.length - 1 }), say: S.init[l] }];
    let lo = 0;
    let hi = LETTERS.length - 1;
    let looks = 0;
    for (;;) {
      const mid = Math.floor((lo + hi) / 2);
      const m = LETTERS[mid];
      looks++;
      if (m === TARGET) {
        frames.push({ kind: 'found', scene: dictScene(l, { lo, hi, mid, op: '=', found: true }), say: fmt(S.found[l], { n: looks }) });
        break;
      }
      frames.push({ kind: 'open', scene: dictScene(l, { lo, hi, mid }), say: fmt(looks === 1 ? S.openFirst[l] : S.open[l], { m }) });
      const after = TARGET > m;
      if (after) lo = mid + 1;
      else hi = mid - 1;
      frames.push({
        kind: 'discard',
        scene: dictScene(l, { lo, hi, mid, op: after ? '>' : '<' }),
        say: fmt(after ? S.after[l] : S.before[l], { m, lo: LETTERS[lo], hi: LETTERS[hi] }),
      });
    }
    return { frames };
  },
};

// ── Sorting playing cards: insertion sort ─────────────────────────────

const HAND = ['4', '2', 'A', '5', '3'];
const rank = (c: string) => (c === 'A' ? 1 : Number(c));

const CARD_W = 44;
const CARD_H = 60;
const CSTEP = CARD_W + 8;
const CARD_Y = 118;
const LIFT_Y = 16;
const REG_Y = 88;
const REG_H = 104;

const CARD_WORD: Record<'sorted' | 'unsorted', T> = {
  sorted: { en: 'Sorted', zh: '有序', 'zh-hant': '有序', ja: '整列済み', ru: 'Упорядоченные' },
  unsorted: { en: 'Unsorted', zh: '无序', 'zh-hant': '無序', ja: '未整列', ru: 'Неупорядоченные' },
};

const CARD_SAY: Record<'all' | 'split' | 'lift' | 'insert' | 'done', T> = {
  all: {
    en: 'Five cards in hand, in no particular order: 4, 2, A, 5, 3. We want them in ascending order.',
    zh: '手中有 5 张扑克牌，顺序是乱的：4、2、A、5、3。我们要把它们从小到大排列。',
    'zh-hant': '手中有 5 張撲克牌，順序是亂的：4、2、A、5、3。我們要把它們從小到大排列。',
    ja: '手札に 5 枚のトランプがあり、順番はばらばらです：4、2、A、5、3。これを小さい順に並べます。',
    ru: 'В руке пять карт вперемешку: 4, 2, A, 5, 3. Нужно упорядочить их от меньшей к большей.',
  },
  split: {
    en: 'Divide the cards into a sorted and an unsorted part. At first, only the leftmost card, 4, counts as sorted.',
    zh: '将扑克牌划分为“有序”和“无序”两部分。初始时，最左 1 张牌 4 已经有序。',
    'zh-hant': '將撲克牌劃分為“有序”和“無序”兩部分。初始時，最左 1 張牌 4 已經有序。',
    ja: 'トランプを「整列済み」と「未整列」の 2 つの部分に分けます。最初は一番左の 4 だけが整列済みです。',
    ru: 'Делим карты на упорядоченную и неупорядоченную части. Сначала упорядоченной считается только самая левая карта, 4.',
  },
  lift: {
    en: 'Take the next card, {c}, out of the unsorted part and find its place among the sorted cards.',
    zh: '从无序部分抽出下一张牌 {c}，在有序部分中寻找它的位置。',
    'zh-hant': '從無序部分抽出下一張牌 {c}，在有序部分中尋找它的位置。',
    ja: '未整列部分から次の 1 枚 {c} を取り出し、整列済みのカードの中で位置を探します。',
    ru: 'Берём из неупорядоченной части следующую карту, {c}, и ищем ей место среди упорядоченных.',
  },
  insert: {
    en: 'Insert {c} at its correct position in the sorted part. Now the leftmost {n} cards are in order.',
    zh: '把 {c} 插入至有序部分的正确位置。完成后最左 {n} 张牌已经有序。',
    'zh-hant': '把 {c} 插入至有序部分的正確位置。完成後最左 {n} 張牌已經有序。',
    ja: '{c} を整列済み部分の正しい位置に挿入します。これで左端の {n} 枚が整列済みです。',
    ru: 'Вставляем {c} на правильное место в упорядоченной части. Теперь упорядочено карт слева: {n}.',
  },
  done: {
    en: 'Insert {c}: all cards are in order, A 2 3 4 5. This way of sorting cards is insertion sort.',
    zh: '插入 {c} 后，所有扑克牌都有序了：A 2 3 4 5。这种整理扑克牌的方法就是“插入排序”。',
    'zh-hant': '插入 {c} 後，所有撲克牌都有序了：A 2 3 4 5。這種整理撲克牌的方法就是“插入排序”。',
    ja: '{c} を挿入すると、すべてのトランプが整列済みになります：A 2 3 4 5。このトランプの整理法が「挿入ソート」です。',
    ru: 'Вставляем {c} — все карты упорядочены: A 2 3 4 5. Такой способ упорядочивания карт — это сортировка вставками.',
  },
};

interface HandState {
  sorted: string[];
  unsorted: string[];
  /** The card held above the hand, and where it will go in the sorted part. */
  lifted?: string;
  insertAt?: number;
  placed?: string;
}

const regionWidth = (n: number, label: string) => Math.max(n * CSTEP + 12, Math.ceil(textWidth(label, 13) * 1.1) + 24);

function handWidth(l: Locale, s: HandState) {
  const sw = s.sorted.length ? regionWidth(s.sorted.length, CARD_WORD.sorted[l]) : 0;
  const uw = s.unsorted.length ? regionWidth(s.unsorted.length, CARD_WORD.unsorted[l]) : 0;
  return sw + uw + (sw && uw ? 10 : 0);
}

function card(c: string, x: number, y: number, extra: Partial<BoxNode> = {}) {
  const face: Segment[] = [{ t: c, bold: true }, { t: '♥', tone: 'danger' }];
  return box(`card${c}`, x, y, face, { w: CARD_W, h: CARD_H, sans: true, size: 16, ...extra });
}

function handScene(l: Locale, s: HandState, ox: number) {
  const nodes: SceneNode[] = [];
  const sw = s.sorted.length ? regionWidth(s.sorted.length, CARD_WORD.sorted[l]) : 0;
  const ux = sw ? ox + sw + 10 : ox;
  if (sw) nodes.push(region('sorted', ox, REG_Y, sw, REG_H, { tone: 'ok', label: CARD_WORD.sorted[l], labelAt: 'inside' }));
  if (s.unsorted.length) {
    nodes.push(region('unsorted', ux, REG_Y, regionWidth(s.unsorted.length, CARD_WORD.unsorted[l]), REG_H, { tone: 'danger', label: CARD_WORD.unsorted[l], labelAt: 'inside' }));
  }
  s.sorted.forEach((c, i) => nodes.push(card(c, ox + 10 + i * CSTEP, CARD_Y, { ring: c === s.placed, tone: c === s.placed ? 'accent' : 'idle' })));
  s.unsorted.forEach((c, j) => {
    const x = ux + 10 + j * CSTEP;
    if (c !== s.lifted) {
      nodes.push(card(c, x, CARD_Y));
      return;
    }
    nodes.push(card(c, x, LIFT_Y, { tone: 'accent', ring: true }));
    const gx = ox + 10 + (s.insertAt ?? 0) * CSTEP - 4;
    // Where the card goes: a marker in the gap between two sorted cards.
    nodes.push({ kind: 'path', id: 'slot', d: `M ${gx} ${CARD_Y - 4} L ${gx} ${CARD_Y + CARD_H + 4}`, tone: 'accent', width: 3 } satisfies PathNode);
  });
  return { w: W, h: 200, nodes };
}

const playingCardsSorting: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', lift: 'cmp', insert: 'swp', done: 'done' },
  build(l) {
    const steps: { kind: string; state: HandState; say: string }[] = [
      { kind: 'init', state: { sorted: [], unsorted: [...HAND] }, say: CARD_SAY.all[l] },
      { kind: 'init', state: { sorted: [HAND[0]], unsorted: HAND.slice(1) }, say: CARD_SAY.split[l] },
    ];
    const sorted = [HAND[0]];
    for (let i = 1; i < HAND.length; i++) {
      const c = HAND[i];
      let at = sorted.length;
      while (at > 0 && rank(sorted[at - 1]) > rank(c)) at--;
      steps.push({ kind: 'lift', state: { sorted: [...sorted], unsorted: HAND.slice(i), lifted: c, insertAt: at }, say: fmt(CARD_SAY.lift[l], { c }) });
      sorted.splice(at, 0, c);
      const last = i === HAND.length - 1;
      steps.push({
        kind: last ? 'done' : 'insert',
        state: { sorted: [...sorted], unsorted: HAND.slice(i + 1), placed: c },
        say: fmt(last ? CARD_SAY.done[l] : CARD_SAY.insert[l], { c, n: sorted.length }),
      });
    }
    // One offset for every frame, so cards only move when they really move.
    const ox = Math.round((W - Math.max(...steps.map((s) => handWidth(l, s.state)))) / 2);
    return { frames: steps.map((s) => ({ kind: s.kind, scene: handScene(l, s.state, ox), say: s.say })) };
  },
};

// ── Making change: greedy ─────────────────────────────────────────────

const NOTES = [20, 10, 5, 1];
const CHANGE = 31;

const NOTE_X = 28;
const NOTE_W = 96;
const NOTE_H = 30;
const TRAY_X = 228;
const noteY = (i: number) => 94 + i * 38;

const CHANGE_WORD: Record<'remaining' | 'notes' | 'change', T> = {
  remaining: { en: 'Remaining', zh: '剩余', 'zh-hant': '剩餘', ja: '残り', ru: 'Остаток' },
  notes: { en: 'Notes', zh: '可选面值', 'zh-hant': '可選面值', ja: '使える額面', ru: 'Купюры' },
  change: { en: 'Change', zh: '找零', 'zh-hant': '找零', ja: 'お釣り', ru: 'Сдача' },
};

const CHANGE_SAY: Record<'init' | 'pick' | 'take' | 'skip' | 'done', T> = {
  init: {
    en: 'Change of 31 is due. The available notes are 20, 10, 5 and 1.',
    zh: '需要找零 31 元。可选的货币面值为 20 元、10 元、5 元、1 元。',
    'zh-hant': '需要找零 31 元。可選的貨幣面值為 20 元、10 元、5 元、1 元。',
    ja: 'お釣りは 31 元です。使える額面は 20 元、10 元、5 元、1 元です。',
    ru: 'Нужно выдать сдачу 31 руб. Есть купюры номиналом 20, 10, 5 и 1 руб.',
  },
  pick: {
    en: '{r} remains: pick the largest note that is not more than {r}. That is {n}.',
    zh: '剩余 {r} 元：选出不超过 {r} 元的最大面值，即 {n} 元。',
    'zh-hant': '剩餘 {r} 元：選出不超過 {r} 元的最大面值，即 {n} 元。',
    ja: '残りは {r} 元：{r} 元以下で最大の額面、{n} 元を選びます。',
    ru: 'Осталось {r} руб.: берём самую крупную купюру не больше {r} — это {n}.',
  },
  take: {
    en: 'Hand over {n}: {r} − {n} = {left} is left.',
    zh: '拿出 {n} 元，剩余 {r} − {n} = {left} 元。',
    'zh-hant': '拿出 {n} 元，剩餘 {r} − {n} = {left} 元。',
    ja: '{n} 元を渡すと、残りは {r} − {n} = {left} 元です。',
    ru: 'Выдаём {n}: остаётся {r} − {n} = {left} руб.',
  },
  skip: {
    en: 'Only 1 is left. The 5 note is larger than 1, like 20 and 10, so it is skipped.',
    zh: '只剩 1 元。5 元和 20 元、10 元一样都大于 1 元，因此跳过。',
    'zh-hant': '只剩 1 元。5 元和 20 元、10 元一樣都大於 1 元，因此跳過。',
    ja: '残りは 1 元だけです。5 元も 20 元や 10 元と同じく 1 元より大きいので飛ばします。',
    ru: 'Остался 1 руб. Купюра 5, как и 20 и 10, больше 1, поэтому её пропускаем.',
  },
  done: {
    en: 'Hand over 1: nothing is left, and the change is 20 + 10 + 1 = 31. Taking the best option at each step like this is a greedy algorithm.',
    zh: '拿出 1 元，剩余 0 元，找零完成：20 + 10 + 1 = 31 元。每一步都采取当前看来最好的选择，这就是“贪心”算法。',
    'zh-hant': '拿出 1 元，剩餘 0 元，找零完成：20 + 10 + 1 = 31 元。每一步都採取當前看來最好的選擇，這就是“貪婪”演算法。',
    ja: '1 元を渡すと残りは 0 元、お釣りは完了です：20 + 10 + 1 = 31 元。このように各ステップでその時点の最善を選ぶのが「貪欲法」です。',
    ru: 'Выдаём 1 — остаток 0, сдача готова: 20 + 10 + 1 = 31 руб. Выбор наилучшего варианта на каждом шаге — это жадный алгоритм.',
  },
};

interface ChangeState {
  /** Remaining amounts so far, e.g. 31, 11. */
  amounts: number[];
  /** Notes already handed over. */
  taken: number[];
  /** The note being picked now. */
  pick?: number;
  /** A note that does not fit and is skipped. */
  skip?: number;
  /** Show which notes are too large for the current remainder. */
  why?: boolean;
  done?: boolean;
}

function changeScene(l: Locale, s: ChangeState) {
  const rem = s.amounts[s.amounts.length - 1];
  const label = CHANGE_WORD.remaining[l];
  const ax = 16 + Math.ceil(textWidth(label, 13) * 1.1) + 14;
  const astep = 84;
  const nodes: SceneNode[] = [text('rem', 16, 30, label, { size: 13, bold: true, tone: 'ok' })];
  s.amounts.forEach((a, i) => {
    const x = ax + i * astep;
    const current = i === s.amounts.length - 1;
    nodes.push(box(`amt${i}`, x, 10, a, { w: 40, h: 30, size: 15, tone: current ? (s.done ? 'ok' : 'accent') : 'muted', ring: current }));
    if (i > 0) {
      nodes.push(
        arrow(`amt:a${i}`, [x - astep + 44, 30], [x - 4, 30], { tone: 'muted' }),
        text(`amt:d${i}`, x - astep / 2 + 20, 22, `−${s.taken[i - 1]}`, { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'accent' }),
      );
    }
  });

  nodes.push(
    region('notes', 16, 80, 180, 168, { tone: 'info', label: CHANGE_WORD.notes[l] }),
    region('tray', 212, 80, 212, 168, { tone: s.done ? 'ok' : 'soft', label: CHANGE_WORD.change[l] }),
  );
  NOTES.forEach((n, i) => {
    const tooBig = (s.why ?? false) && n > rem;
    const skipped = n === s.skip;
    nodes.push(box(`n${n}`, NOTE_X, noteY(i), n, { w: NOTE_W, h: NOTE_H, size: 15, tone: skipped ? 'danger' : 'idle', dim: tooBig && !skipped, ring: skipped }));
    if (tooBig) {
      nodes.push(text(`why${n}`, NOTE_X + NOTE_W + 10, noteY(i) + 20, `> ${rem}`, { mono: true, size: 12, bold: skipped, tone: skipped ? 'danger' : 'muted' }));
    }
  });
  s.taken.forEach((n, k) => nodes.push(box(`t${k}`, TRAY_X, noteY(k), n, { w: NOTE_W, h: NOTE_H, size: 15, tone: 'ok' })));
  if (s.pick !== undefined) {
    const k = s.taken.length;
    const i = NOTES.indexOf(s.pick);
    const src = box(`t${k}`, NOTE_X, noteY(i), s.pick, { w: NOTE_W, h: NOTE_H, size: 15, tone: 'accent', ring: true });
    const dst = box('dst', TRAY_X, noteY(k), '', { w: NOTE_W, h: NOTE_H, tone: 'ghost', dashed: true });
    nodes.push(dst, src, link('go', src, dst, { tone: 'accent', dashed: true, pad: 4 }));
  }
  if (s.done) {
    nodes.push(chip('sum', 318, 210, seg(s.taken.join(' + ') + ' = ', [String(CHANGE), 'ok', true]), { size: 14 }));
  }
  return { w: W, h: 256, nodes };
}

const greedyChange: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', pick: 'cmp', take: 'swp', skip: 'swp', done: 'done' },
  build(l) {
    const S = CHANGE_SAY;
    const frames: SceneFrame[] = [{ kind: 'init', scene: changeScene(l, { amounts: [CHANGE], taken: [] }), say: S.init[l] }];
    const amounts = [CHANGE];
    const taken: number[] = [];
    let rem = CHANGE;
    while (rem > 0) {
      const n = NOTES.find((x) => x <= rem)!;
      // Show why a note smaller than the last pick is passed over.
      const skipped = NOTES.filter((x) => x > rem && x < (taken[taken.length - 1] ?? Infinity));
      for (const x of skipped) {
        frames.push({ kind: 'skip', scene: changeScene(l, { amounts: [...amounts], taken: [...taken], skip: x, why: true }), say: S.skip[l] });
      }
      frames.push({ kind: 'pick', scene: changeScene(l, { amounts: [...amounts], taken: [...taken], pick: n, why: true }), say: fmt(S.pick[l], { r: rem, n }) });
      taken.push(n);
      const left = rem - n;
      amounts.push(left);
      const done = left === 0;
      frames.push({
        kind: done ? 'done' : 'take',
        scene: changeScene(l, { amounts: [...amounts], taken: [...taken], done }),
        say: done ? S.done[l] : fmt(S.take[l], { r: rem, n, left }),
      });
      rem = left;
    }
    return { frames };
  },
};

// ── Data structures and algorithms ────────────────────────────────────

const DSA: Record<'input' | 'algorithm' | 'output' | 'ds' | 'algoNote' | 'dsNote', T> = {
  input: { en: 'Input', zh: '输入', 'zh-hant': '輸入', ja: '入力', ru: 'Вход' },
  algorithm: { en: 'Algorithm', zh: '算法', 'zh-hant': '演算法', ja: 'アルゴリズム', ru: 'Алгоритм' },
  output: { en: 'Output', zh: '输出', 'zh-hant': '輸出', ja: '出力', ru: 'Выход' },
  ds: { en: 'Data structures', zh: '数据结构', 'zh-hant': '資料結構', ja: 'データ構造', ru: 'Структуры данных' },
  algoNote: {
    en: 'A series of steps that turns input into output',
    zh: '一系列操作步骤，将输入转化为输出',
    'zh-hant': '一系列操作步驟，將輸入轉化為輸出',
    ja: '一連の操作手順で、入力を出力に変える',
    ru: 'Последовательность шагов, превращающая вход в выход',
  },
  dsNote: {
    en: 'Store data in an organized way and provide the operations on it',
    zh: '提供结构化存储的数据，以及操作数据的方法',
    'zh-hant': '提供結構化儲存的資料，以及操作資料的方法',
    ja: '構造化して格納したデータと、その操作方法を提供する',
    ru: 'Хранят данные в упорядоченном виде и дают методы работы с ними',
  },
};

const bold = (t: string): Segment[] => [{ t, bold: true }];

const relationship: StaticFigure = {
  type: 'static',
  build(l) {
    const input = box('in', 16, 50, bold(DSA.input[l]), { w: 100, h: 44, sans: true, tone: 'ok' });
    const algo = box('algo', 160, 42, bold(DSA.algorithm[l]), { w: 120, h: 60, sans: true, tone: 'info' });
    const output = box('out', 324, 50, bold(DSA.output[l]), { w: 100, h: 44, sans: true, tone: 'ok' });
    const ds = box('ds', 16, 150, bold(DSA.ds[l]), { w: 408, h: 48, sans: true, tone: 'warn' });
    const up = (id: string, target: BoxNode) => {
      const cx = target.x + target.w / 2;
      return arrow(id, [cx, ds.y - 3], [cx, target.y + target.h + 5], { tone: 'warn', width: 2.5 });
    };
    const nodes: SceneNode[] = [
      text('algoNote', W / 2, 22, DSA.algoNote[l], { anchor: 'middle', size: 12, tone: 'info' }),
      input,
      algo,
      output,
      link('e1', input, algo, { width: 2 }),
      link('e2', algo, output, { width: 2 }),
      ds,
      up('u1', input),
      up('u2', algo),
      up('u3', output),
      text('dsNote', W / 2, 224, DSA.dsNote[l], { anchor: 'middle', size: 12, tone: 'warn' }),
    ];
    return { scene: { w: W, h: 236, nodes } };
  },
};

// ── Assembling building blocks ────────────────────────────────────────

interface Piece {
  id: string;
  w: number;
  h: number;
  tone: Tone;
  /** Top-left corner in the loose pile, sorted by shape, and in the finished model. */
  pile: [number, number];
  sorted: [number, number];
  model: [number, number];
  /** The assembly step that puts the piece in place. */
  step: number;
}

const PIECES: Piece[] = [
  { id: 'A', w: 68, h: 22, tone: 'info', pile: [24, 190], sorted: [24, 80], model: [260, 200], step: 1 },
  { id: 'B', w: 68, h: 22, tone: 'info', pile: [110, 158], sorted: [96, 80], model: [332, 200], step: 1 },
  { id: 'C', w: 44, h: 22, tone: 'warn', pile: [140, 196], sorted: [24, 114], model: [262, 176], step: 2 },
  { id: 'D', w: 44, h: 22, tone: 'warn', pile: [30, 122], sorted: [72, 114], model: [308, 176], step: 2 },
  { id: 'E', w: 44, h: 22, tone: 'warn', pile: [150, 130], sorted: [120, 114], model: [354, 176], step: 2 },
  { id: 'F', w: 46, h: 22, tone: 'ok', pile: [150, 96], sorted: [24, 148], model: [282, 152], step: 2 },
  { id: 'G', w: 46, h: 22, tone: 'ok', pile: [62, 160], sorted: [74, 148], model: [332, 152], step: 2 },
];

/** The roof: a triangle given its bottom-left corner. */
const ROOF = { w: 116, h: 40, pile: [20, 112] as [number, number], sorted: [24, 222] as [number, number], model: [272, 150] as [number, number], step: 3 };
/** Room between the stage chip and the panel titles; every piece position is shifted down by it. */
const DY = 10;
const roofPath = ([x, y]: [number, number]) => `M ${x} ${y + DY} L ${x + ROOF.w / 2} ${y + DY - ROOF.h} L ${x + ROOF.w} ${y + DY} Z`;

const BLOCK_STAGE: Record<'input' | 'structure' | 'algorithm' | 'output', { term: T; meaning: T }> = {
  input: {
    term: { en: 'Input data', zh: '输入数据', 'zh-hant': '輸入資料', ja: '入力データ', ru: 'Входные данные' },
    meaning: { en: 'unassembled blocks', zh: '未拼装的积木', 'zh-hant': '未拼裝的積木', ja: 'まだ組み立てていないブロック', ru: 'несобранные детали' },
  },
  structure: {
    term: { en: 'Data structure', zh: '数据结构', 'zh-hant': '資料結構', ja: 'データ構造', ru: 'Структура данных' },
    meaning: { en: 'how the blocks are organized', zh: '积木的组织形式', 'zh-hant': '積木的組織形式', ja: 'ブロックの構成形式', ru: 'организация деталей' },
  },
  algorithm: {
    term: { en: 'Algorithm', zh: '算法', 'zh-hant': '演算法', ja: 'アルゴリズム', ru: 'Алгоритм' },
    meaning: { en: 'assembly step {k} of 3', zh: '组装步骤 {k}/3', 'zh-hant': '組裝步驟 {k}/3', ja: '組み立て手順 {k}/3', ru: 'шаг сборки {k} из 3' },
  },
  output: {
    term: { en: 'Output data', zh: '输出数据', 'zh-hant': '輸出資料', ja: '出力データ', ru: 'Выходные данные' },
    meaning: { en: 'the finished model', zh: '积木模型', 'zh-hant': '積木模型', ja: 'ブロック模型', ru: 'собранная модель' },
  },
};

const BLOCK_WORD: Record<'blocks' | 'model', T> = {
  blocks: { en: 'Blocks', zh: '积木', 'zh-hant': '積木', ja: 'ブロック', ru: 'Детали' },
  model: { en: 'Model', zh: '积木模型', 'zh-hant': '積木模型', ja: 'ブロック模型', ru: 'Модель' },
};

const BLOCK_SAY: Record<'input' | 'structure' | 'step1' | 'step2' | 'step3' | 'output', T> = {
  input: {
    en: 'Input data: a pile of loose, unassembled blocks of different shapes and colors.',
    zh: '输入数据：一堆散乱的、尚未拼装的积木，形状和颜色各不相同。',
    'zh-hant': '輸入資料：一堆散亂的、尚未拼裝的積木，形狀和顏色各不相同。',
    ja: '入力データ：形も色もさまざまな、まだ組み立てていないブロックの山です。',
    ru: 'Входные данные: груда несобранных деталей разной формы и цвета.',
  },
  structure: {
    en: 'Data structure: how the blocks are organized, including their shape, size and how they connect. Sorted by shape, every block has a known place in the model.',
    zh: '数据结构：积木的组织形式，包括形状、大小、连接方式等。按形状分好类后，每块积木在模型中都有确定的位置。',
    'zh-hant': '資料結構：積木的組織形式，包括形狀、大小、連接方式等。按形狀分好類後，每塊積木在模型中都有確定的位置。',
    ja: 'データ構造：形状、大きさ、接続方法などを含むブロックの構成形式です。形ごとに分けると、各ブロックの模型での位置が決まります。',
    ru: 'Структура данных: организация деталей — их форма, размер и способ соединения. Разложенная по форме, каждая деталь получает своё место в модели.',
  },
  step1: {
    en: 'Algorithm: follow the instructions step by step. Step 1: lay the two long blocks as the base.',
    zh: '算法：按照说明书一步步操作。第 1 步：用两块长积木铺好底座。',
    'zh-hant': '演算法：按照說明書一步步操作。第 1 步：用兩塊長積木鋪好底座。',
    ja: 'アルゴリズム：説明書に従って一歩ずつ組み立てます。手順 1：長いブロック 2 つで土台を作ります。',
    ru: 'Алгоритм: шаг за шагом следуем инструкции. Шаг 1: кладём две длинные детали в основание.',
  },
  step2: {
    en: 'Step 2: put three short blocks on the base, then two more on top of them.',
    zh: '第 2 步：在底座上放三块短积木，再在上面放两块。',
    'zh-hant': '第 2 步：在底座上放三塊短積木，再在上面放兩塊。',
    ja: '手順 2：土台の上に短いブロックを 3 つ、その上にさらに 2 つ積みます。',
    ru: 'Шаг 2: ставим на основание три короткие детали, а на них — ещё две.',
  },
  step3: {
    en: 'Step 3: put the roof on top.',
    zh: '第 3 步：盖上屋顶。',
    'zh-hant': '第 3 步：蓋上屋頂。',
    ja: '手順 3：屋根をのせます。',
    ru: 'Шаг 3: накрываем крышей.',
  },
  output: {
    en: 'Output data: the finished building block model.',
    zh: '输出数据：拼好的积木模型。',
    'zh-hant': '輸出資料：拼好的積木模型。',
    ja: '出力データ：完成したブロック模型です。',
    ru: 'Выходные данные: собранная модель конструктора.',
  },
};

/** `stage` 0 is the pile, 1 is sorted by shape, 2–4 are the assembly steps, 5 is the finished model. */
function blocksScene(l: Locale, stage: number) {
  const step = stage - 1;
  const key = stage === 0 ? 'input' : stage === 1 ? 'structure' : stage === 5 ? 'output' : 'algorithm';
  const { term, meaning } = BLOCK_STAGE[key];
  const done = stage === 5;
  const nodes: SceneNode[] = [
    chip('stage', W / 2, 8, seg([term[l], 'accent', true], `: ${fmt(meaning[l], { k: step })}`), { sans: true, size: 13 }),
    region('pile', 12, 58 + DY, 200, 172, { tone: 'soft', label: BLOCK_WORD.blocks[l], dim: done }),
    region('model', 228, 58 + DY, 200, 172, { tone: done ? 'ok' : 'info', label: BLOCK_WORD.model[l] }),
  ];
  const showSlots = stage >= 1 && stage <= 4;
  for (const p of PIECES) {
    const placed = step >= p.step;
    if (showSlots && !placed) nodes.push(box(`slot${p.id}`, p.model[0], p.model[1] + DY, '', { w: p.w, h: p.h, tone: 'ghost', dashed: true }));
    const [x, y] = placed ? p.model : stage === 0 ? p.pile : p.sorted;
    nodes.push(box(`blk${p.id}`, x, y + DY, '', { w: p.w, h: p.h, tone: p.tone, ring: step === p.step }));
  }
  const roofPlaced = step >= ROOF.step;
  if (showSlots && !roofPlaced) nodes.push({ kind: 'path', id: 'slotRoof', d: roofPath(ROOF.model), tone: 'ghost', dashed: true, width: 1.5 });
  nodes.push({
    kind: 'path',
    id: 'roof',
    d: roofPath(roofPlaced ? ROOF.model : stage === 0 ? ROOF.pile : ROOF.sorted),
    tone: 'danger',
    fill: true,
    width: step === ROOF.step ? 3 : 1.5,
  });
  return { w: W, h: 236 + DY, nodes };
}

const assemblingBlocks: StepFigure = {
  type: 'steps',
  tones: { input: 'idle', structure: 'cmp', step: 'swp', output: 'done' },
  build(l) {
    const S = BLOCK_SAY;
    const kinds = ['input', 'structure', 'step', 'step', 'step', 'output'];
    const says = [S.input, S.structure, S.step1, S.step2, S.step3, S.output];
    return { frames: kinds.map((kind, stage) => ({ kind, scene: blocksScene(l, stage), say: says[stage][l] })) };
  },
};

const FIGURES: Record<string, Figure> = {
  binary_search_dictionary_steps: binarySearchDictionary,
  playing_cards_sorting: playingCardsSorting,
  greedy_change: greedyChange,
  relationship_between_data_structure_and_algorithm: relationship,
  assembling_blocks: assemblingBlocks,
};

export default FIGURES;
