import { arrow, box, cellX, chip, drawGraph, drawTree, link, pair, pairWidth, region, rowWidth, seg, tag, text, treeFromLevels, treeWalk } from '../../../figures/kit';
import type { GraphEdge, GraphVertex, TreeSpec } from '../../../figures/kit';
import type { BoxNode, Scene, SceneNode, Tone } from '../../../figures/scene';
import type { Locale } from '../../../i18n/locale';
import type { KidQuestion, LessonContent, PracticeStep, StorySlide } from '../types';

/**
 * Unit 2, ways to keep data. Each lesson: an everyday picture in the story, a short guessing
 * game in "Try it", and a three-question quiz. Text is written for 8–12 year olds.
 */

type T = Record<Locale, string>;
const t = (en: string, zh: string, zhHant: string, ja: string, ru: string): T => ({ en, zh, 'zh-hant': zhHant, ja, ru });

const W = 440;
const H = 260;

// ── Stack: a pile of plates ───────────────────────────────────────────

const PLATE_TONES: Tone[] = ['info', 'ok', 'warn', 'accent', 'danger'];

interface Plate {
  n: number;
  tone?: Tone;
  ring?: boolean;
  dim?: boolean;
}

/** A pile of plates on a table; `out` is a plate lifted off to the right, `incoming` one about to land. */
function plates(pile: Plate[], opts: { out?: Plate; incoming?: Plate; label?: string; labelTone?: Tone } = {}): Scene {
  const cx = 190;
  const pw = 130;
  const ph = 26;
  const table = 226;
  const nodes: SceneNode[] = [
    { kind: 'path', id: 'table', d: `M ${cx - 130} ${table} L ${cx + 130} ${table}`, tone: 'idle', width: 4 },
    { kind: 'path', id: 'leg1', d: `M ${cx - 100} ${table} L ${cx - 100} ${H - 6}`, tone: 'idle', width: 4 },
    { kind: 'path', id: 'leg2', d: `M ${cx + 100} ${table} L ${cx + 100} ${H - 6}`, tone: 'idle', width: 4 },
  ];
  pile.forEach((p, k) => {
    nodes.push(
      box(`plate${p.n}`, cx - pw / 2, table - (k + 1) * (ph + 4), String(p.n), {
        w: pw,
        h: ph,
        size: 15,
        tone: p.tone ?? PLATE_TONES[(p.n - 1) % PLATE_TONES.length],
        ring: p.ring,
        dim: p.dim,
      }),
    );
  });
  if (pile.length) {
    const top = table - pile.length * (ph + 4);
    nodes.push(arrow('top:a', [cx + pw / 2 + 44, top + ph / 2], [cx + pw / 2 + 6, top + ph / 2], { tone: 'accent', width: 2.5 }));
    nodes.push(text('top', cx + pw / 2 + 50, top + ph / 2 + 5, 'top', { size: 15, bold: true, tone: 'accent' }));
  }
  if (opts.out) {
    nodes.push(box(`plate${opts.out.n}`, 330, 30, String(opts.out.n), { w: 100, h: ph, size: 15, tone: 'warn', ring: true }));
  }
  if (opts.incoming) {
    nodes.push(
      box(`plate${opts.incoming.n}`, cx - pw / 2, 14, String(opts.incoming.n), { w: pw, h: ph, size: 15, tone: 'accent', dashed: true }),
      arrow('drop', [cx, 44], [cx, table - pile.length * (ph + 4) - 8], { tone: 'accent', dashed: true }),
    );
  }
  if (opts.label) nodes.push(chip('label', W / 2, 20, opts.label, { sans: true, size: 15, tone: opts.labelTone ?? 'idle' }));
  return { w: W, h: H, nodes };
}

/** The word "top" stays in English in the picture: it is the name used in code too. */
const STACK_STORY: Record<'pile' | 'push' | 'pop' | 'lifo' | 'undo', T> = {
  pile: t(
    'This is a stack of plates. You can only reach the plate on top.',
    '这是一摞盘子。你只能拿到最上面的那个。',
    '這是一疊盤子。你只能拿到最上面的那個。',
    'これはお皿の山だよ。手がとどくのは、いちばん上のお皿だけ。',
    'Это стопка тарелок. Достать можно только верхнюю.',
  ),
  push: t(
    'Push: a new plate always goes on the top of the pile.',
    '压入（push）：新盘子总是放在最上面。',
    '壓入（push）：新盤子總是放在最上面。',
    'プッシュ：新しいお皿は、いつもいちばん上にのせる。',
    'Push (положить): новая тарелка всегда ложится наверх.',
  ),
  pop: t(
    'Pop: you take a plate off, and it is always the one on top.',
    '弹出（pop）：拿走一个盘子，拿的总是最上面那个。',
    '彈出（pop）：拿走一個盤子，拿的總是最上面那個。',
    'ポップ：お皿を取るときも、いつもいちばん上から。',
    'Pop (снять): снимаем тарелку — и это всегда верхняя.',
  ),
  lifo: t(
    'So the last plate you put on is the first one you take off. We call this "last in, first out".',
    '所以最后放上去的盘子最先被拿走。这叫“后进先出”。',
    '所以最後放上去的盤子最先被拿走。這叫「後進先出」。',
    'だから、最後にのせたお皿が最初に取られる。これを「後入れ先出し」というよ。',
    'Значит, последнюю положенную тарелку снимут первой. Это называется «последним пришёл — первым ушёл».',
  ),
  undo: t(
    'Computers use stacks too! The Undo button keeps your actions in a stack, so it takes back the newest one first.',
    '计算机也用栈！“撤销”按钮把你的操作放在栈里，所以它先撤销最新的那一步。',
    '電腦也用堆疊！「復原」按鈕把你的操作放在堆疊裡，所以它先復原最新的那一步。',
    'コンピュータもスタックを使うよ！「元に戻す」ボタンは操作をスタックにためるから、いちばん新しい操作から戻すんだ。',
    'Компьютеры тоже используют стеки! Кнопка «Отменить» хранит действия в стеке и отменяет сначала самое новое.',
  ),
};

const STACK_LABEL: Record<'lifo' | 'undo' | 'undo1' | 'undo2' | 'undo3', T> = {
  lifo: t('last in, first out', '后进先出', '後進先出', '後入れ先出し', 'последним пришёл — первым ушёл'),
  undo: t('Undo', '撤销', '復原', '元に戻す', 'Отменить'),
  undo1: t('draw a sun', '画太阳', '畫太陽', '太陽をかく', 'нарисовать солнце'),
  undo2: t('draw a tree', '画树', '畫樹', '木をかく', 'нарисовать дерево'),
  undo3: t('draw a cat', '画猫', '畫貓', 'ねこをかく', 'нарисовать кота'),
};

/** Undo history as a stack of action cards; Undo takes the newest card off the top. */
function undoScene(l: Locale): Scene {
  const actions = [STACK_LABEL.undo1, STACK_LABEL.undo2, STACK_LABEL.undo3];
  const nodes: SceneNode[] = [{ kind: 'path', id: 'table', d: 'M 50 232 L 290 232', tone: 'idle', width: 4 }];
  actions.forEach((a, k) => {
    nodes.push(box(`act${k}`, 60, 186 - k * 46, a[l], { w: 220, h: 38, sans: true, size: 15, tone: k === 2 ? 'warn' : 'info', ring: k === 2 }));
  });
  nodes.push(
    chip('undo', 368, 72, seg(['←', 'accent', true], ` ${STACK_LABEL.undo[l]}`), { sans: true, size: 16 }),
    arrow('undo:a', [368, 102], [286, 111], { bend: -10, tone: 'accent', width: 2.5 }),
  );
  return { w: W, h: H, nodes };
}

const STACK_PRACTICE: Record<'start' | 'push' | 'askPop' | 'popped' | 'push4' | 'askPop2' | 'askOldest', T> = {
  start: t('Our pile has two plates: 1 at the bottom and 2 on top.', '盘子堆里有两个盘子：1 在下面，2 在上面。', '盤子堆裡有兩個盤子：1 在下面，2 在上面。', 'お皿は 2 まい。下が 1、上が 2 だよ。', 'В стопке две тарелки: внизу 1, сверху 2.'),
  push: t('push(3): plate 3 goes on top.', 'push(3)：盘子 3 放到最上面。', 'push(3)：盤子 3 放到最上面。', 'push(3)：お皿 3 を上にのせる。', 'push(3): тарелка 3 ложится наверх.'),
  askPop: t('pop(): which plate comes off?', 'pop()：哪个盘子会被拿走？', 'pop()：哪個盤子會被拿走？', 'pop()：どのお皿が取られる？', 'pop(): какую тарелку снимут?'),
  popped: t('Plate 3 came off. Now plate 2 is on top again.', '盘子 3 被拿走了。现在 2 又在最上面了。', '盤子 3 被拿走了。現在 2 又在最上面了。', 'お皿 3 が取られたよ。また 2 がいちばん上になった。', 'Тарелку 3 сняли. Теперь сверху снова 2.'),
  push4: t('push(4): plate 4 goes on top.', 'push(4)：盘子 4 放到最上面。', 'push(4)：盤子 4 放到最上面。', 'push(4)：お皿 4 を上にのせる。', 'push(4): тарелка 4 ложится наверх.'),
  askPop2: t('pop() again: which plate comes off now?', '再 pop() 一次：现在拿走哪个？', '再 pop() 一次：現在拿走哪個？', 'もう一度 pop()：こんどはどれ？', 'Снова pop(): какую снимут теперь?'),
  askOldest: t(
    'Plate 4 came off. Which plate has been in the pile the longest?',
    '盘子 4 被拿走了。哪个盘子在这堆里待得最久？',
    '盤子 4 被拿走了。哪個盤子在這堆裡待得最久？',
    'お皿 4 が取られたよ。いちばん長く山にいるお皿はどれ？',
    'Тарелку 4 сняли. Какая тарелка лежит в стопке дольше всех?',
  ),
};

const STACK_EXPLAIN: Record<'pop3' | 'pop4' | 'oldest', T> = {
  pop3: t('Plate 3 is on top, so it comes off first.', '盘子 3 在最上面，所以先拿走它。', '盤子 3 在最上面，所以先拿走它。', 'お皿 3 がいちばん上だから、最初に取られる。', 'Тарелка 3 сверху, её и снимают первой.'),
  pop4: t('Plate 4 was the last one in, so it is the first one out.', '盘子 4 最后放进去，所以最先出来。', '盤子 4 最後放進去，所以最先出來。', 'お皿 4 は最後に入ったから、最初に出る。', 'Тарелку 4 положили последней — её и снимают первой.'),
  oldest: t('Plate 1 was put in first, so it is at the bottom and comes out last.', '盘子 1 最先放进去，在最下面，最后才出来。', '盤子 1 最先放進去，在最下面，最後才出來。', 'お皿 1 は最初に入ったから、いちばん下。出るのは最後だよ。', 'Тарелку 1 положили первой: она в самом низу и уйдёт последней.'),
};

const ask = (prompt: string, ids: number[], answer: number, explain: string): KidQuestion => ({
  prompt,
  choices: ids.map((n) => ({ id: String(n), label: String(n) })),
  answer: String(answer),
  explain,
});

const STACK_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t(
    'You push 5, then 7, then 2 onto a stack. Then you pop once. What comes out?',
    '依次把 5、7、2 压入栈，然后弹出一次。出来的是哪个？',
    '依次把 5、7、2 壓入堆疊，然後彈出一次。出來的是哪個？',
    'スタックに 5、7、2 の順にプッシュして、1 回ポップしたよ。出てくるのは？',
    'Кладём в стек 5, потом 7, потом 2. Потом один раз снимаем. Что снимется?',
  ),
  q1e: t('2 went in last, so it comes out first.', '2 最后进去，所以最先出来。', '2 最後進去，所以最先出來。', '2 が最後に入ったので、最初に出る。', 'Число 2 положили последним — его и снимут первым.'),
  q2: t('Which of these works like a stack?', '下面哪个像栈一样工作？', '下面哪個像堆疊一樣運作？', 'スタックと同じしくみなのはどれ？', 'Что из этого работает как стек?'),
  q2a: t('A pile of books', '一摞书', '一疊書', '本の山', 'Стопка книг'),
  q2b: t('A line at the bus stop', '公交车站排的队', '公車站排的隊', 'バス停の行列', 'Очередь на остановке'),
  q2c: t('A row of lockers', '一排储物柜', '一排置物櫃', 'ならんだロッカー', 'Ряд шкафчиков'),
  q2e: t('You add and take books only at the top of the pile, just like plates.', '书只能从最上面放、从最上面拿，和盘子一样。', '書只能從最上面放、從最上面拿，和盤子一樣。', '本も上にのせて、上から取る。お皿と同じだね。', 'Книги кладут и берут только сверху — как тарелки.'),
  q3: t('Why is a stack good for the Undo button?', '为什么“撤销”按钮适合用栈？', '為什麼「復原」按鈕適合用堆疊？', '「元に戻す」ボタンにスタックが向いているのはなぜ？', 'Почему стек подходит для кнопки «Отменить»?'),
  q3a: t('It gives back the newest action first', '它先给出最新的操作', '它先給出最新的操作', 'いちばん新しい操作から出てくるから', 'Он первым отдаёт самое новое действие'),
  q3b: t('It gives back the oldest action first', '它先给出最早的操作', '它先給出最早的操作', 'いちばん古い操作から出てくるから', 'Он первым отдаёт самое старое действие'),
  q3c: t('It sorts the actions', '它会给操作排序', '它會給操作排序', '操作をならべかえるから', 'Он сортирует действия'),
  q3e: t('Undo should take back what you did last, and a stack always gives the last thing first.', '撤销应该先撤回你最后做的事，而栈总是先给出最后放进去的东西。', '復原應該先撤回你最後做的事，而堆疊總是先給出最後放進去的東西。', '元に戻すのは最後にしたこと。スタックはいつも最後に入れたものを先に出すよ。', '«Отменить» должна убирать последнее действие, а стек всегда отдаёт последнее первым.'),
};

const stack: LessonContent = {
  story(l): StorySlide[] {
    const S = STACK_STORY;
    return [
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3 }]), say: S.pile[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4, tone: 'accent', ring: true }]), say: S.push[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3 }], { out: { n: 4 } }), say: S.pop[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3 }], { label: STACK_LABEL.lifo[l], labelTone: 'accent' }), say: S.lifo[l] },
      { scene: undoScene(l), say: S.undo[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = STACK_PRACTICE;
    const E = STACK_EXPLAIN;
    return [
      { scene: plates([{ n: 1 }, { n: 2 }]), say: P.start[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3, tone: 'accent', ring: true }]), say: P.push[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 3 }]), say: P.askPop[l], ask: ask(P.askPop[l], [1, 2, 3], 3, E.pop3[l]) },
      { scene: plates([{ n: 1 }, { n: 2 }], { out: { n: 3 } }), say: P.popped[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 4, tone: 'accent', ring: true }]), say: P.push4[l] },
      { scene: plates([{ n: 1 }, { n: 2 }, { n: 4 }]), say: P.askPop2[l], ask: ask(P.askPop2[l], [1, 2, 4], 4, E.pop4[l]) },
      { scene: plates([{ n: 1 }, { n: 2 }], { out: { n: 4 } }), say: P.askOldest[l], ask: ask(P.askOldest[l], [1, 2], 1, E.oldest[l]) },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = STACK_QUIZ;
    return [
      ask(Q.q1[l], [5, 7, 2], 2, Q.q1e[l]),
      {
        prompt: Q.q2[l],
        choices: [
          { id: 'books', label: Q.q2a[l] },
          { id: 'line', label: Q.q2b[l] },
          { id: 'lockers', label: Q.q2c[l] },
        ],
        answer: 'books',
        explain: Q.q2e[l],
      },
      {
        prompt: Q.q3[l],
        choices: [
          { id: 'newest', label: Q.q3a[l] },
          { id: 'oldest', label: Q.q3b[l] },
          { id: 'sorts', label: Q.q3c[l] },
        ],
        answer: 'newest',
        explain: Q.q3e[l],
      },
    ];
  },
};

// ── Shared by the lessons below ───────────────────────────────────────

/** A question whose choices are words: each choice is [id, label]. */
const choose = (prompt: string, choices: [string, string][], answer: string, explain: string): KidQuestion => ({
  prompt,
  choices: choices.map(([id, label]) => ({ id, label })),
  answer,
  explain,
});

/** A caption on a chip, centered; near the bottom unless `y` says otherwise. */
const caption = (label: string, tone: Tone = 'idle', y = H - 40) => chip('label', W / 2, y, label, { sans: true, size: 15, tone });

type Look = Partial<Pick<BoxNode, 'tone' | 'ring' | 'dim' | 'dashed'>>;

// ── Array: a row of boxes ─────────────────────────────────────────────

interface Slot {
  v: number | null;
  tone?: Tone;
  ring?: boolean;
}

/** Values as slots (`null` is an empty box); `marks` styles boxes by their value. */
const slots = (values: (number | null)[], marks: Record<number, Look> = {}): Slot[] => values.map((v) => ({ v, ...(v === null ? {} : marks[v]) }));

const BOX_W = 46;
const BOX_GAP = 8;
const ROW_Y = 104;

/** A row of boxes with the index under each. Boxes are id'd by value, so a shift glides. */
function boxRow(items: Slot[], o: { point?: { at: number; label: string }; incoming?: { v: number; at: number }; shiftFrom?: number; label?: string; labelTone?: Tone } = {}): Scene {
  const x0 = Math.round((W - rowWidth(items.length, BOX_W, BOX_GAP)) / 2);
  const left = (i: number) => cellX(x0, i, BOX_W, BOX_GAP);
  const mid = (i: number) => left(i) + BOX_W / 2;
  const nodes: SceneNode[] = [];
  items.forEach((s, i) => {
    const hot = o.point?.at === i;
    nodes.push(
      box(s.v === null ? `empty${i}` : `v${s.v}`, left(i), ROW_Y, s.v === null ? '' : String(s.v), {
        w: BOX_W,
        h: 50,
        size: 18,
        tone: s.tone ?? (s.v === null ? 'ghost' : 'info'),
        dashed: s.v === null,
        ring: s.ring || hot,
      }),
      text(`i${i}`, mid(i), ROW_Y + 76, String(i), { anchor: 'middle', mono: true, size: 15, bold: hot, tone: hot ? 'accent' : 'muted' }),
    );
  });
  if (o.shiftFrom !== undefined) {
    for (let i = o.shiftFrom; i + 1 < items.length && items[i].v !== null; i++) {
      const a = mid(i) + 6;
      const b = mid(i + 1) - 6;
      const y = ROW_Y - 3;
      nodes.push(arrow(`shift${i}`, [a, y], [b, y], { via: [[a, y - 12], [b, y - 12]], tone: 'warn', width: 2 }));
    }
  }
  if (o.point) {
    const x = mid(o.point.at);
    nodes.push(chip('point', x, 12, o.point.label, { sans: true, size: 15, tone: 'accent' }), arrow('point:a', [x, 44], [x, ROW_Y - 6], { tone: 'accent', width: 2.5 }));
  }
  if (o.incoming) {
    const { v, at } = o.incoming;
    nodes.push(
      box(`v${v}`, left(at), 18, String(v), { w: BOX_W, h: 50, size: 18, tone: 'accent', dashed: true, ring: true }),
      arrow('drop', [mid(at), 72], [mid(at), ROW_Y - 22], { tone: 'accent', dashed: true }),
    );
  }
  if (o.label) nodes.push(caption(o.label, o.labelTone));
  return { w: W, h: H, nodes };
}

const BOX_NAME: Record<Locale, (n: number) => string> = {
  en: (n) => `box ${n}`,
  zh: (n) => `${n} 号`,
  'zh-hant': (n) => `${n} 號`,
  ja: (n) => `${n} 番`,
  ru: (n) => `коробка ${n}`,
};

const ARRAY_STORY = {
  row: t(
    'Here is a row of lockers. Each one has a number and can hold one thing.',
    '这是一排储物柜。每个柜子都有编号，能放一样东西。',
    '這是一排置物櫃。每個櫃子都有編號，能放一樣東西。',
    'ロッカーがならんでいるよ。どれにも番号がついていて、物をひとつ入れられる。',
    'Вот ряд шкафчиков. У каждого есть номер, и в каждый помещается одна вещь.',
  ),
  index: t(
    'This is an array: boxes side by side. A box’s number is its index, and computers start counting at 0!',
    '这就是数组：一个挨一个的盒子。盒子的编号叫索引，计算机从 0 开始数！',
    '這就是陣列：一個挨一個的盒子。盒子的編號叫索引，電腦從 0 開始數！',
    'これが配列。箱がとなりどうしにならんでいる。箱の番号はインデックスといって、コンピュータは 0 から数えるんだ！',
    'Это массив: коробки стоят вплотную друг к другу. Номер коробки называется индексом, и компьютер считает с 0!',
  ),
  jump: t(
    'Want box 5? Algo jumps straight to it. No need to open boxes 0 to 4 first!',
    '想要 5 号盒子？Algo 直接跳过去，不用先打开 0 到 4 号。',
    '想要 5 號盒子？Algo 直接跳過去，不用先打開 0 到 4 號。',
    '5 番の箱がほしい？Algo はそこへひとっとび。0 番から 4 番を先に開けなくていいんだ！',
    'Нужна коробка 5? Algo прыгает прямо к ней. Открывать коробки с 0 по 4 не нужно!',
  ),
  insert: t(
    'Putting 6 into box 2 is harder. Everyone from box 2 on must shift one step right to make room.',
    '把 6 放进 2 号盒子就麻烦了：从 2 号开始，每个数都要往右挪一格，腾出位置。',
    '把 6 放進 2 號盒子就麻煩了：從 2 號開始，每個數都要往右挪一格，騰出位置。',
    '6 を 2 番の箱に入れるのは大変。2 番から後ろのみんなが、右にひとつずつずれて場所をあけるんだ。',
    'Вставить 6 в коробку 2 сложнее. Все, начиная с коробки 2, сдвигаются на шаг вправо, чтобы освободить место.',
  ),
  shifted: t(
    'Now 6 fits into box 2. That was a lot of moving for one new number!',
    '现在 6 放进 2 号盒子了。为了一个新数字，挪了好多次！',
    '現在 6 放進 2 號盒子了。為了一個新數字，挪了好多次！',
    'これで 6 が 2 番に入った。新しい数ひとつのために、たくさん動いたね！',
    'Теперь 6 в коробке 2. Сколько переездов ради одного нового числа!',
  ),
  use: t(
    'Arrays are everywhere: the scores in a game, the days of a month, the dots of color in a photo.',
    '数组到处都有：游戏里的分数、一个月里的日子、照片上的彩色小点。',
    '陣列到處都有：遊戲裡的分數、一個月裡的日子、照片上的彩色小點。',
    '配列はどこにでもあるよ。ゲームの点数、1 か月の日にち、写真の色のつぶ。',
    'Массивы повсюду: очки в игре, дни месяца, цветные точки на фото.',
  ),
};

const ARRAY_LABEL = {
  zero: t('counting starts at 0', '从 0 开始数', '從 0 開始數', '0 から数える', 'счёт начинается с 0'),
  shift: t('everyone shifts right', '大家往右挪', '大家往右挪', 'みんな右へずれる', 'все сдвигаются вправо'),
  scores: t('game scores', '游戏分数', '遊戲分數', 'ゲームの点数', 'очки в игре'),
};

const ARRAY_PRACTICE = {
  start: t(
    'Six numbers sit in boxes 0 to 5. Box 6 at the end is still empty.',
    '六个数放在 0 到 5 号盒子里，最后的 6 号盒子还空着。',
    '六個數放在 0 到 5 號盒子裡，最後的 6 號盒子還空著。',
    '6 つの数が 0 番から 5 番の箱に入っているよ。最後の 6 番はまだ空っぽ。',
    'Шесть чисел лежат в коробках с 0 по 5. Последняя коробка 6 пока пустая.',
  ),
  askBox: t(
    'Which number is in box 3? Remember: we start counting at 0.',
    '3 号盒子里是哪个数？别忘了，从 0 开始数。',
    '3 號盒子裡是哪個數？別忘了，從 0 開始數。',
    '3 番の箱に入っている数は？0 から数えるのをわすれずに。',
    'Какое число в коробке 3? Помни: считаем с 0.',
  ),
  jumped: t(
    'Algo jumped straight to box 3 in one step. It holds 6.',
    'Algo 一步就跳到了 3 号盒子，里面是 6。',
    'Algo 一步就跳到了 3 號盒子，裡面是 6。',
    'Algo は 1 回で 3 番の箱にとんだよ。中身は 6。',
    'Algo одним прыжком попадает в коробку 3. Там лежит 6.',
  ),
  askShift: t(
    'Now 7 must go into box 1. How many numbers have to shift one step right?',
    '现在要把 7 放进 1 号盒子。有几个数要往右挪一格？',
    '現在要把 7 放進 1 號盒子。有幾個數要往右挪一格？',
    'こんどは 7 を 1 番の箱に入れたい。右にずれる数はいくつ？',
    'Теперь 7 нужно положить в коробку 1. Сколько чисел сдвинется на шаг вправо?',
  ),
  shifted: t(
    '8, 1, 6, 3 and 9 each moved one step right. Now 7 fits into box 1.',
    '8、1、6、3、9 都往右挪了一格。现在 7 放进了 1 号盒子。',
    '8、1、6、3、9 都往右挪了一格。現在 7 放進了 1 號盒子。',
    '8、1、6、3、9 がひとつずつ右にずれた。これで 7 が 1 番に入ったよ。',
    '8, 1, 6, 3 и 9 сдвинулись на шаг вправо. Теперь 7 в коробке 1.',
  ),
  askEnd: t(
    'Say we add one more empty box at the end. Which is quicker: putting a new number at the end, or at the very start?',
    '假设在最后再加一个空盒子。哪个更快：把新数放在最后面，还是放在最前面？',
    '假設在最後再加一個空盒子。哪個更快：把新數放在最後面，還是放在最前面？',
    '後ろに空っぽの箱をひとつ足したとしよう。新しい数を入れるなら、はやいのはどっち？いちばん後ろ？それともいちばん前？',
    'Допустим, в конце появилась ещё одна пустая коробка. Что быстрее: положить новое число в конец или в самое начало?',
  ),
  end: t('At the end', '加在最后面', '加在最後面', 'いちばん後ろ', 'В конец'),
  front: t('At the start', '加在最前面', '加在最前面', 'いちばん前', 'В начало'),
};

const ARRAY_EXPLAIN = {
  box3: t(
    'Count from 0: box 0 is 4, box 1 is 8, box 2 is 1, and box 3 is 6.',
    '从 0 开始数：0 号是 4，1 号是 8，2 号是 1，3 号是 6。',
    '從 0 開始數：0 號是 4，1 號是 8，2 號是 1，3 號是 6。',
    '0 から数えよう。0 番は 4、1 番は 8、2 番は 1、3 番は 6。',
    'Считаем с 0: в коробке 0 лежит 4, в 1 — 8, в 2 — 1, а в 3 — 6.',
  ),
  five: t(
    '8, 1, 6, 3 and 9 all sit in box 1 or later, so all five must shift.',
    '8、1、6、3、9 都在 1 号或更后面，所以这五个数都要挪。',
    '8、1、6、3、9 都在 1 號或更後面，所以這五個數都要挪。',
    '8、1、6、3、9 はみんな 1 番から後ろにいるから、5 つ全部ずれるんだ。',
    '8, 1, 6, 3 и 9 стоят в коробке 1 или дальше, поэтому сдвигаются все пять.',
  ),
  end: t(
    'At the end, it goes straight into the empty box and nobody moves. At the start, all seven numbers must shift.',
    '放在最后面，直接放进空盒子，谁都不用挪；放在最前面，七个数全都得挪。',
    '放在最後面，直接放進空盒子，誰都不用挪；放在最前面，七個數全都得挪。',
    '後ろなら、空っぽの箱にそのまま入れるだけで、だれも動かない。前だと、7 つの数が全部ずれるんだ。',
    'В конце число сразу ложится в пустую коробку, и никто не двигается. А в начале сдвигаются все семь чисел.',
  ),
};

const ARRAY_QUIZ = {
  q1: t(
    'What is the index of the first box in an array?',
    '数组里第一个盒子的索引是几？',
    '陣列裡第一個盒子的索引是幾？',
    '配列の最初の箱のインデックスはいくつ？',
    'Какой индекс у первой коробки в массиве?',
  ),
  q1e: t(
    'Computers start counting at 0, so the first box is box 0.',
    '计算机从 0 开始数，所以第一个盒子是 0 号。',
    '電腦從 0 開始數，所以第一個盒子是 0 號。',
    'コンピュータは 0 から数えるから、最初の箱は 0 番。',
    'Компьютер считает с 0, поэтому первая коробка — коробка 0.',
  ),
  q2: t('What is in box 2?', '2 号盒子里是什么？', '2 號盒子裡是什麼？', '2 番の箱に入っているのは？', 'Что лежит в коробке 2?'),
  q2e: t('Box 0 is 7, box 1 is 2, and box 2 is 5.', '0 号是 7，1 号是 2，2 号是 5。', '0 號是 7，1 號是 2，2 號是 5。', '0 番は 7、1 番は 2、2 番は 5。', 'В коробке 0 лежит 7, в 1 — 2, а в 2 — 5.'),
  q3: t(
    'Why can an array find box 20 so fast?',
    '为什么数组能很快找到 20 号盒子？',
    '為什麼陣列能很快找到 20 號盒子？',
    '配列が 20 番の箱をすぐ見つけられるのはなぜ？',
    'Почему массив так быстро находит коробку 20?',
  ),
  q3a: t('It jumps straight there by the number', '按编号直接跳过去', '按編號直接跳過去', '番号を見て、そこへ直接とぶから', 'По номеру прыгает прямо туда'),
  q3b: t('It opens every box from the start', '从头一个一个打开', '從頭一個一個打開', '最初から全部の箱を開けるから', 'Открывает все коробки с начала'),
  q3c: t('It makes a lucky guess', '它碰运气猜', '它碰運氣猜', '運よく当てるから', 'Угадывает наудачу'),
  q3e: t(
    'The boxes stand side by side, so the computer can work out where box 20 is and go right there.',
    '盒子一个挨一个排着，所以计算机能算出 20 号在哪儿，直接过去。',
    '盒子一個挨一個排著，所以電腦能算出 20 號在哪裡，直接過去。',
    '箱はすきまなくならんでいるから、20 番の場所を計算して、すぐ行けるんだ。',
    'Коробки стоят вплотную, поэтому компьютер вычисляет, где коробка 20, и сразу идёт туда.',
  ),
};

const ROW = [7, 3, 9, 2, 5, 8, null];
const ROW_PRACTICE = [4, 8, 1, 6, 3, 9, null];
const ROW_SHIFTED = [4, 7, 8, 1, 6, 3, 9];

const array: LessonContent = {
  story(l): StorySlide[] {
    const S = ARRAY_STORY;
    return [
      { scene: boxRow(slots(ROW)), say: S.row[l] },
      { scene: boxRow(slots(ROW), { point: { at: 0, label: BOX_NAME[l](0) }, label: ARRAY_LABEL.zero[l], labelTone: 'accent' }), say: S.index[l] },
      { scene: boxRow(slots(ROW), { point: { at: 5, label: BOX_NAME[l](5) } }), say: S.jump[l] },
      { scene: boxRow(slots(ROW), { incoming: { v: 6, at: 2 }, shiftFrom: 2, label: ARRAY_LABEL.shift[l], labelTone: 'warn' }), say: S.insert[l] },
      { scene: boxRow(slots([7, 3, 6, 9, 2, 5, 8], { 6: { tone: 'accent', ring: true } })), say: S.shifted[l] },
      {
        scene: boxRow(slots([12, 9, 15, 7, 10], { 12: { tone: 'ok' }, 9: { tone: 'warn' }, 15: { tone: 'accent' }, 7: { tone: 'danger' } }), { label: ARRAY_LABEL.scores[l], labelTone: 'accent' }),
        say: S.use[l],
      },
    ];
  },
  practice(l): PracticeStep[] {
    const P = ARRAY_PRACTICE;
    const E = ARRAY_EXPLAIN;
    return [
      { scene: boxRow(slots(ROW_PRACTICE)), say: P.start[l] },
      { scene: boxRow(slots(ROW_PRACTICE)), say: P.askBox[l], ask: ask(P.askBox[l], [1, 6, 3], 6, E.box3[l]) },
      { scene: boxRow(slots(ROW_PRACTICE), { point: { at: 3, label: BOX_NAME[l](3) } }), say: P.jumped[l] },
      { scene: boxRow(slots(ROW_PRACTICE), { incoming: { v: 7, at: 1 } }), say: P.askShift[l], ask: ask(P.askShift[l], [1, 4, 5], 5, E.five[l]) },
      { scene: boxRow(slots(ROW_SHIFTED, { 7: { tone: 'accent', ring: true } })), say: P.shifted[l] },
      {
        scene: boxRow(slots([...ROW_SHIFTED, null])),
        say: P.askEnd[l],
        ask: choose(P.askEnd[l], [['end', P.end[l]], ['start', P.front[l]]], 'end', E.end[l]),
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = ARRAY_QUIZ;
    return [
      ask(Q.q1[l], [0, 1, 2], 0, Q.q1e[l]),
      { ...ask(Q.q2[l], [2, 5, 9], 5, Q.q2e[l]), scene: boxRow(slots([7, 2, 5, 9])) },
      choose(Q.q3[l], [['jump', Q.q3a[l]], ['open', Q.q3b[l]], ['guess', Q.q3c[l]]], 'jump', Q.q3e[l]),
    ];
  },
};

// ── Linked list: a treasure hunt ──────────────────────────────────────

/** Where each clue is hidden: scattered on purpose, only the arrows give the order. `T` is the treasure. */
const CLUE_AT: Record<string, [number, number]> = { A: [50, 92], B: [140, 196], C: [240, 92], D: [330, 196], T: [404, 92], X: [228, 222] };

/** Clues joined in `order` by arrows; `loose` clues are drawn but not linked; `ghost` is an old arrow, dashed. */
function hunt(order: string[], o: { loose?: string[]; look?: Record<string, Look>; hot?: string[]; ghost?: [string, string]; label?: string } = {}): Scene {
  const r = 24;
  const circles = new Map<string, BoxNode>();
  for (const id of [...order, ...(o.loose ?? [])]) {
    const [x, y] = CLUE_AT[id];
    circles.set(id, box(`clue${id}`, x - r, y - r, id === 'T' ? '★' : id, { w: 2 * r, h: 2 * r, shape: 'circle', size: 18, tone: id === 'T' ? 'warn' : 'info', ...o.look?.[id] }));
  }
  const nodes: SceneNode[] = [];
  if (o.ghost) nodes.push(link('ghost', circles.get(o.ghost[0])!, circles.get(o.ghost[1])!, { dashed: true, dim: true, tone: 'muted', width: 2 }));
  order.slice(0, -1).forEach((a, k) => nodes.push(link(`next${a}`, circles.get(a)!, circles.get(order[k + 1])!, { tone: o.hot?.includes(a) ? 'accent' : undefined, width: 2.5 })));
  nodes.push(...circles.values(), ...tag('head', circles.get(order[0])!, 'head', { side: 'above' }));
  if (o.label) nodes.push(caption(o.label, 'accent', 8));
  return { w: W, h: H, nodes };
}

const LL_LABEL = {
  node: t('value + arrow to the next', '值 + 指向下一个的箭头', '值 + 指向下一個的箭頭', '値 ＋ つぎへの矢印', 'значение + стрелка дальше'),
  song: t('song', '歌曲', '歌曲', '曲', 'песня'),
  newSong: t('new song', '新歌', '新歌', '新しい曲', 'новая песня'),
};

/** A playlist as a linked list: a new song joins by changing arrows, nobody moves. */
function playlist(l: Locale): Scene {
  const songs = [1, 2, 3].map((n, k) => box(`song${n}`, 15 + k * 150, 70, `${LL_LABEL.song[l]} ${n}`, { w: 110, h: 50, sans: true, size: 15, tone: 'info' }));
  const fresh = box('songNew', 95, 176, LL_LABEL.newSong[l], { w: 130, h: 50, sans: true, size: 15, tone: 'accent', dashed: true, ring: true });
  return {
    w: W,
    h: H,
    nodes: [
      link('old', songs[0], songs[1], { dashed: true, dim: true, tone: 'muted', width: 2 }),
      link('next2', songs[1], songs[2], { width: 2.5 }),
      link('in', songs[0], fresh, { tone: 'accent', width: 2.5 }),
      link('out', fresh, songs[1], { tone: 'accent', width: 2.5 }),
      ...songs,
      fresh,
      ...tag('head', songs[0], 'head', { side: 'above' }),
    ],
  };
}

/** Values linked out of left-to-right order, for "follow the arrows, not the page". */
function scrambledList(): Scene {
  const r = 24;
  const spots: [number, number, number][] = [
    [5, 60, 190],
    [2, 170, 70],
    [8, 390, 120],
    [6, 270, 210],
  ];
  const circles = spots.map(([v, x, y]) => box(`q${v}`, x - r, y - r, String(v), { w: 2 * r, h: 2 * r, shape: 'circle', size: 18, tone: 'info' }));
  return {
    w: W,
    h: H,
    nodes: [...circles.slice(0, -1).map((c, k) => link(`qn${k}`, c, circles[k + 1], { width: 2.5 })), ...circles, ...tag('head', circles[0], 'head', { side: 'above' })],
  };
}

/** "head" stays in English in the pictures, like "top" for the stack: it is the name used in code. */
const LL_STORY = {
  hunt: t(
    'A treasure hunt! Each clue tells you where the next clue is hidden.',
    '寻宝游戏！每条线索都会告诉你下一条藏在哪里。',
    '尋寶遊戲！每條線索都會告訴你下一條藏在哪裡。',
    '宝さがしだ！どのヒントにも、つぎのヒントのかくし場所が書いてある。',
    'Поиск сокровищ! Каждая подсказка говорит, где спрятана следующая.',
  ),
  node: t(
    'A linked list works the same way. Each node holds a value and an arrow to the next node.',
    '链表也是这样。每个节点装着一个值，还有一个指向下一个节点的箭头。',
    '鏈結串列也是這樣。每個節點裝著一個值，還有一個指向下一個節點的箭頭。',
    '連結リストも同じしくみ。ノードには値と、つぎのノードをさす矢印が入っているよ。',
    'Связный список устроен так же. Каждый узел хранит значение и стрелку на следующий узел.',
  ),
  anywhere: t(
    'The nodes can be anywhere at all. Only the arrows keep them in order.',
    '节点可以放在任何地方，只靠箭头把它们串成一串。',
    '節點可以放在任何地方，只靠箭頭把它們串成一串。',
    'ノードはどこにあってもいい。順番をきめているのは矢印だけ。',
    'Узлы могут лежать где угодно. Порядок держится только на стрелках.',
  ),
  follow: t(
    'To reach clue D, start at A and follow A → B → C → D. No jumping ahead!',
    '想找到线索 D，得从 A 出发，顺着 A → B → C → D 走。不能跳过去！',
    '想找到線索 D，得從 A 出發，順著 A → B → C → D 走。不能跳過去！',
    'ヒント D に行くには、A から A → B → C → D とたどるしかない。とばしちゃだめ！',
    'Чтобы добраться до D, начни с A и иди A → B → C → D. Перепрыгнуть нельзя!',
  ),
  insert: t(
    'Adding clue X is easy: B points to X, and X points to C. Nobody else has to move.',
    '加入线索 X 很简单：让 B 指向 X，X 指向 C。别的线索都不用动。',
    '加入線索 X 很簡單：讓 B 指向 X，X 指向 C。別的線索都不用動。',
    'ヒント X を足すのはかんたん。B の矢印を X に、X の矢印を C に向けるだけ。ほかはだれも動かない。',
    'Добавить подсказку X легко: B указывает на X, а X — на C. Больше никто не двигается.',
  ),
  playlist: t(
    'A music playlist can work like this: each song points to the next one, so adding a song is quick.',
    '音乐播放列表也可以这样：每首歌指向下一首，所以加一首歌很快。',
    '音樂播放清單也可以這樣：每首歌指向下一首，所以加一首歌很快。',
    '音楽のプレイリストもこんなふう。曲がつぎの曲をさしているから、曲を足すのがかんたん。',
    'Плейлист может быть устроен так же: каждая песня указывает на следующую, и добавить песню легко.',
  ),
};

const LL_PRACTICE = {
  start: t(
    'This hunt goes A → B → C → D → ★. The head arrow shows the first clue.',
    '这次寻宝的顺序是 A → B → C → D → ★。head 箭头指着第一条线索。',
    '這次尋寶的順序是 A → B → C → D → ★。head 箭頭指著第一條線索。',
    'この宝さがしは A → B → C → D → ★ の順。head の矢印が最初のヒントをさしているよ。',
    'Этот поиск идёт так: A → B → C → D → ★. Стрелка head показывает первую подсказку.',
  ),
  askFirst: t(
    'You want to reach clue C. Which clue do you have to open first?',
    '你想找到线索 C。第一个要打开哪条线索？',
    '你想找到線索 C。第一個要打開哪條線索？',
    'ヒント C に行きたい。最初に開けるのはどのヒント？',
    'Нужно добраться до подсказки C. Какую подсказку открыть первой?',
  ),
  hops: t(
    'Start at A. A shows the way to B, and B shows the way to C. Two hops!',
    '从 A 出发。A 告诉你 B 在哪，B 告诉你 C 在哪。跳两次就到了！',
    '從 A 出發。A 告訴你 B 在哪，B 告訴你 C 在哪。跳兩次就到了！',
    'A からスタート。A が B の場所を、B が C の場所を教えてくれる。2 回でとうちゃく！',
    'Начинаем с A. A ведёт к B, а B — к C. Два прыжка!',
  ),
  askInsert: t(
    'New clue X must go between B and C. Whose arrow has to change?',
    '新线索 X 要放在 B 和 C 之间。谁的箭头要改？',
    '新線索 X 要放在 B 和 C 之間。誰的箭頭要改？',
    '新しいヒント X を B と C のあいだに入れたい。矢印を変えるのはだれ？',
    'Новую подсказку X надо вставить между B и C. Чья стрелка должна измениться?',
  ),
  inserted: t(
    'B now points to X, and X points to C. No clue had to move.',
    '现在 B 指向 X，X 指向 C。没有一条线索需要搬家。',
    '現在 B 指向 X，X 指向 C。沒有一條線索需要搬家。',
    'B が X を、X が C をさすようになった。ヒントはひとつも動いていないよ。',
    'Теперь B указывает на X, а X — на C. Ни одна подсказка не сдвинулась.',
  ),
  askRemove: t(
    'Now we take clue C out of the hunt. Whose arrow has to change?',
    '现在把线索 C 拿掉。谁的箭头要改？',
    '現在把線索 C 拿掉。誰的箭頭要改？',
    'こんどはヒント C をはずすよ。矢印を変えるのはだれ？',
    'Теперь уберём подсказку C. Чья стрелка должна измениться?',
  ),
  removed: t(
    'X now skips C and points straight to D. C is out of the hunt.',
    'X 跳过 C，直接指向 D。C 就离开寻宝游戏了。',
    'X 跳過 C，直接指向 D。C 就離開尋寶遊戲了。',
    'X は C をとばして、D を直接さす。これで C は宝さがしからはずれたよ。',
    'X теперь пропускает C и указывает прямо на D. C больше не в игре.',
  ),
};

const LL_EXPLAIN = {
  first: t(
    'You only know where A is. Every other clue is found by following arrows from A.',
    '你只知道 A 在哪。其他线索都得从 A 开始顺着箭头找。',
    '你只知道 A 在哪。其他線索都得從 A 開始順著箭頭找。',
    '場所がわかっているのは A だけ。ほかのヒントは A から矢印をたどって見つけるんだ。',
    'Ты знаешь только, где A. Все остальные подсказки находятся по стрелкам от A.',
  ),
  insert: t(
    'B must point to X now. Then X points on to C.',
    'B 要改成指向 X，然后 X 再指向 C。',
    'B 要改成指向 X，然後 X 再指向 C。',
    'B の矢印を X に向ける。そして X が C をさすんだ。',
    'B теперь должна указывать на X, а X — дальше на C.',
  ),
  remove: t(
    'X pointed to C. Now X must skip C and point to D.',
    'X 原来指向 C，现在要跳过 C，改成指向 D。',
    'X 原來指向 C，現在要跳過 C，改成指向 D。',
    'X は C をさしていた。こんどは C をとばして D をさすんだ。',
    'X указывала на C. Теперь X должна пропустить C и указать на D.',
  ),
};

const LL_QUIZ = {
  q1: t(
    'How do you reach the 5th node of a linked list?',
    '怎样才能到达链表的第 5 个节点？',
    '怎樣才能到達鏈結串列的第 5 個節點？',
    '連結リストの 5 番目のノードに行くには？',
    'Как добраться до 5-го узла связного списка?',
  ),
  q1a: t('Follow the arrows from the first node', '从第一个节点顺着箭头走', '從第一個節點順著箭頭走', '最初のノードから矢印をたどる', 'Идти по стрелкам от первого узла'),
  q1b: t('Jump straight to it', '直接跳过去', '直接跳過去', 'そこへ直接とぶ', 'Прыгнуть прямо к нему'),
  q1c: t('Start from the last node', '从最后一个节点开始', '從最後一個節點開始', '最後のノードから始める', 'Начать с последнего узла'),
  q1e: t(
    'Each node only knows the next one, so you start at the head and follow the arrows.',
    '每个节点只知道下一个在哪，所以要从 head 开始顺着箭头走。',
    '每個節點只知道下一個在哪，所以要從 head 開始順著箭頭走。',
    'ノードが知っているのはつぎのノードだけ。だから head から矢印をたどるんだ。',
    'Каждый узел знает только следующий, поэтому идём от head по стрелкам.',
  ),
  q2: t('Which of these is easy in a linked list?', '在链表里，下面哪件事很容易？', '在鏈結串列裡，下面哪件事很容易？', '連結リストでかんたんなのはどれ？', 'Что легко сделать в связном списке?'),
  q2a: t('Adding a node in the middle', '在中间加一个节点', '在中間加一個節點', 'まん中にノードを足す', 'Добавить узел в середину'),
  q2b: t('Jumping straight to node 10', '直接跳到第 10 个节点', '直接跳到第 10 個節點', '10 番目のノードへ直接とぶ', 'Сразу прыгнуть к 10-му узлу'),
  q2e: t(
    'Once you are at the right spot, adding a node only changes a couple of arrows. Jumping is not possible: you must follow the arrows.',
    '走到要加的位置后，加节点只要改一两个箭头。直接跳过去可不行，必须顺着箭头走。',
    '走到要加的位置後，加節點只要改一兩個箭頭。直接跳過去可不行，必須順著箭頭走。',
    '足したい場所まで来たら、矢印を 1、2 本変えるだけ。とぶのはむり。矢印をたどるしかないよ。',
    'Когда ты уже на нужном месте, добавить узел — это поменять пару стрелок. А прыгнуть нельзя — только идти по стрелкам.',
  ),
  q3: t(
    'Read the values starting at head and following the arrows. Which value is 3rd?',
    '从 head 开始，顺着箭头读出每个值。第 3 个值是哪个？',
    '從 head 開始，順著箭頭讀出每個值。第 3 個值是哪個？',
    'head から矢印の順に値を読んでいこう。3 番目の値はどれ？',
    'Читай значения, начиная с head и двигаясь по стрелкам. Какое значение третье?',
  ),
  q3e: t(
    'Follow the arrows, not left to right: 5 is 1st, 2 is 2nd, and 8 is 3rd.',
    '要顺着箭头读，而不是从左到右：第 1 个是 5，第 2 个是 2，第 3 个是 8。',
    '要順著箭頭讀，而不是從左到右：第 1 個是 5，第 2 個是 2，第 3 個是 8。',
    '左から右じゃなく、矢印の順だよ。1 番目が 5、2 番目が 2、3 番目が 8。',
    'Идём по стрелкам, а не слева направо: первое — 5, второе — 2, третье — 8.',
  ),
};

const HUNT = ['A', 'B', 'C', 'D', 'T'];
const HUNT_X = ['A', 'B', 'X', 'C', 'D', 'T'];

const linked_list: LessonContent = {
  story(l): StorySlide[] {
    const S = LL_STORY;
    return [
      { scene: hunt(HUNT), say: S.hunt[l] },
      { scene: hunt(HUNT, { look: { B: { tone: 'accent', ring: true } }, hot: ['B'], label: LL_LABEL.node[l] }), say: S.node[l] },
      { scene: hunt(HUNT, { hot: ['A', 'B', 'C', 'D'] }), say: S.anywhere[l] },
      { scene: hunt(HUNT, { look: { A: { tone: 'ok' }, B: { tone: 'ok' }, C: { tone: 'ok' }, D: { tone: 'accent', ring: true } }, hot: ['A', 'B', 'C'] }), say: S.follow[l] },
      { scene: hunt(HUNT_X, { look: { X: { tone: 'accent', ring: true } }, hot: ['B', 'X'], ghost: ['B', 'C'] }), say: S.insert[l] },
      { scene: playlist(l), say: S.playlist[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = LL_PRACTICE;
    const E = LL_EXPLAIN;
    const letters = (ids: string[]): [string, string][] => ids.map((id) => [id, id]);
    return [
      { scene: hunt(HUNT), say: P.start[l] },
      { scene: hunt(HUNT, { look: { C: { tone: 'accent', ring: true } } }), say: P.askFirst[l], ask: choose(P.askFirst[l], letters(['A', 'B', 'C']), 'A', E.first[l]) },
      { scene: hunt(HUNT, { look: { A: { tone: 'ok' }, B: { tone: 'ok' }, C: { tone: 'accent', ring: true } }, hot: ['A', 'B'] }), say: P.hops[l] },
      {
        scene: hunt(HUNT, { loose: ['X'], look: { X: { tone: 'accent', dashed: true } } }),
        say: P.askInsert[l],
        ask: choose(P.askInsert[l], letters(['A', 'B', 'C']), 'B', E.insert[l]),
      },
      { scene: hunt(HUNT_X, { look: { X: { tone: 'accent', ring: true } }, hot: ['B', 'X'] }), say: P.inserted[l] },
      {
        scene: hunt(HUNT_X, { look: { C: { tone: 'danger', ring: true } } }),
        say: P.askRemove[l],
        ask: choose(P.askRemove[l], letters(['B', 'X', 'D']), 'X', E.remove[l]),
      },
      { scene: hunt(['A', 'B', 'X', 'D', 'T'], { loose: ['C'], look: { C: { dim: true, dashed: true } }, hot: ['X'] }), say: P.removed[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = LL_QUIZ;
    return [
      choose(Q.q1[l], [['follow', Q.q1a[l]], ['jump', Q.q1b[l]], ['last', Q.q1c[l]]], 'follow', Q.q1e[l]),
      choose(Q.q2[l], [['add', Q.q2a[l]], ['jump', Q.q2b[l]]], 'add', Q.q2e[l]),
      { ...ask(Q.q3[l], [2, 6, 8], 8, Q.q3e[l]), scene: scrambledList() },
    ];
  },
};

// ── Queue: waiting in line ────────────────────────────────────────────

const KID_Y = 136;
const kidX = (i: number) => 112 + i * 66;

const QUEUE_LABEL = {
  front: t('front', '队首', '佇列首', '先頭', 'голова'),
  back: t('back', '队尾', '佇列尾', '末尾', 'хвост'),
  fifo: t('first in, first out', '先进先出', '先進先出', '先入れ先出し', 'первым пришёл — первым ушёл'),
  printer: t('printer', '打印机', '印表機', 'プリンター', 'принтер'),
};

/**
 * Kids with ticket numbers in a line, front on the left; `out` has just left, `incoming` is about to
 * join at the back, `arriving` has just come and stands aside (no arrow, so the picture does not answer "where?").
 */
function waitingLine(l: Locale, kids: number[], o: { ring?: number; out?: number; incoming?: number; arriving?: number; label?: string } = {}): Scene {
  const r = 24;
  const kid = (n: number, x: number, y: number, extra: Look = {}) =>
    box(`kid${n}`, x - r, y - r, String(n), { w: 2 * r, h: 2 * r, shape: 'circle', size: 18, tone: PLATE_TONES[n % PLATE_TONES.length], ...extra });
  const circles = kids.map((n, i) => kid(n, kidX(i), KID_Y, { ring: o.ring === n }));
  const nodes: SceneNode[] = [...circles];
  if (circles.length) nodes.push(...tag('front', circles[0], QUEUE_LABEL.front[l]), ...tag('back', circles[circles.length - 1], QUEUE_LABEL.back[l]));
  if (o.out !== undefined) nodes.push(kid(o.out, 40, 56, { ring: true }), arrow('leave', [kidX(0) - 18, KID_Y - 22], [60, 82], { tone: 'warn', width: 2 }));
  if (o.incoming !== undefined) {
    const x = kidX(kids.length);
    nodes.push(kid(o.incoming, x, 46, { dashed: true, ring: true }), arrow('join', [x, 74], [x, KID_Y - r - 6], { tone: 'accent', dashed: true, width: 2 }));
  }
  if (o.arriving !== undefined) nodes.push(kid(o.arriving, 400, 50, { dashed: true, ring: true }));
  if (o.label) nodes.push(caption(o.label, 'accent'));
  return { w: W, h: H, nodes };
}

/** A printer takes pages in the order they were sent. */
function printerQueue(l: Locale): Scene {
  const printer = box('printer', 20, 84, QUEUE_LABEL.printer[l], { w: 120, h: 84, sans: true, size: 16, tone: 'idle' });
  const pages = [1, 2, 3].map((n, k) => box(`page${n}`, 190 + k * 76, 92, String(n), { w: 58, h: 70, size: 18, tone: 'info', ring: k === 0 }));
  return {
    w: W,
    h: H,
    nodes: [printer, ...pages, link('feed', pages[0], printer, { tone: 'accent', width: 2.5 }), ...tag('front', pages[0], QUEUE_LABEL.front[l]), caption(QUEUE_LABEL.fifo[l], 'accent')],
  };
}

const QUEUE_STORY = {
  line: t(
    'This is a line at the ice-cream shop. Whoever is at the front gets served first.',
    '这是冰淇淋店前的队伍。站在最前面的人先买到。',
    '這是冰淇淋店前的隊伍。站在最前面的人先買到。',
    'アイスクリーム屋さんの行列だよ。先頭にいる人から買えるんだ。',
    'Это очередь за мороженым. Первым обслуживают того, кто стоит впереди.',
  ),
  join: t(
    'A new kid joins at the back of the line. No cutting in!',
    '新来的小朋友排到队伍最后面。不许插队！',
    '新來的小朋友排到隊伍最後面。不准插隊！',
    '新しく来た子は列のいちばん後ろにならぶ。わりこみはなし！',
    'Новые ребята встают в конец очереди. Влезать вперёд нельзя!',
  ),
  leave: t(
    'The kid at the front gets ice cream and leaves. Everyone else moves up one step.',
    '最前面的小朋友买到冰淇淋就离开了，其他人往前挪一步。',
    '最前面的小朋友買到冰淇淋就離開了，其他人往前挪一步。',
    '先頭の子がアイスを買って列をはなれる。ほかのみんなはひとつ前へ進む。',
    'Тот, кто впереди, получает мороженое и уходит. Остальные делают шаг вперёд.',
  ),
  fifo: t(
    'The first to arrive is the first to leave: “first in, first out”. That is a queue!',
    '先来的人先离开，这叫“先进先出”。这就是队列！',
    '先來的人先離開，這叫「先進先出」。這就是佇列！',
    '先に来た人が先に出る。「先入れ先出し」というよ。これがキュー！',
    'Кто первым пришёл, тот первым ушёл. Это и есть очередь!',
  ),
  printer: t(
    'Computers use queues too. A printer prints pages in the order they were sent.',
    '计算机也用队列。打印机按照收到的先后顺序打印。',
    '電腦也用佇列。印表機按照收到的先後順序列印。',
    'コンピュータもキューを使うよ。プリンターは、送られてきた順に印刷するんだ。',
    'Компьютеры тоже используют очереди. Принтер печатает листы в том порядке, в каком их прислали.',
  ),
};

const QUEUE_PRACTICE = {
  start: t(
    'Three kids wait with tickets 4, 7 and 2. Ticket 4 is at the front.',
    '三个小朋友拿着 4、7、2 号票在排队，4 号站在最前面。',
    '三個小朋友拿著 4、7、2 號票在排隊，4 號站在最前面。',
    '4 番、7 番、2 番の札をもった 3 人がならんでいる。先頭は 4 番。',
    'Трое ребят ждут с билетами 4, 7 и 2. Впереди стоит номер 4.',
  ),
  askJoin: t('Ticket 6 arrives. Where does 6 stand?', '6 号来了。6 号站在哪里？', '6 號來了。6 號站在哪裡？', '6 番が来たよ。6 番はどこにならぶ？', 'Пришёл ребёнок с билетом 6. Куда он встанет?'),
  askLeave: t(
    '6 joined at the back. Now the shop serves one kid. Who leaves the line?',
    '6 号排到了最后。现在店里接待一个人，谁离开队伍？',
    '6 號排到了最後。現在店裡招呼一個人，誰離開隊伍？',
    '6 番は後ろにならんだ。お店がひとり分売るよ。列をはなれるのはだれ？',
    'Номер 6 встал в конец. Теперь обслуживают одного. Кто уходит из очереди?',
  ),
  served: t(
    '4 got served and left. Everyone moved up one step.',
    '4 号买完离开了，大家往前挪了一步。',
    '4 號買完離開了，大家往前挪了一步。',
    '4 番は買いおわって列をはなれた。みんなひとつ前へ進んだよ。',
    'Номера 4 обслужили, и он ушёл. Все сделали шаг вперёд.',
  ),
  join9: t(
    'Then ticket 9 arrives and joins at the back.',
    '接着 9 号来了，排到了最后面。',
    '接著 9 號來了，排到了最後面。',
    'つぎに 9 番が来て、いちばん後ろにならんだよ。',
    'Потом пришёл номер 9 и встал в конец.',
  ),
  askTwo: t(
    'Two more kids get served. Who is at the front after that?',
    '又有两个人买完了。之后谁站在最前面？',
    '又有兩個人買完了。之後誰站在最前面？',
    'さらに 2 人が買いおわったよ。そのあと先頭にいるのはだれ？',
    'Обслужили ещё двоих. Кто теперь впереди?',
  ),
  end: t(
    '7 and 2 got served. Now 6 is at the front and 9 is at the back.',
    '7 号和 2 号买完了。现在 6 号在队首，9 号在队尾。',
    '7 號和 2 號買完了。現在 6 號在佇列首，9 號在佇列尾。',
    '7 番と 2 番が買いおわった。いまは 6 番が先頭、9 番が末尾だね。',
    '7 и 2 обслужили. Теперь впереди 6, а в хвосте 9.',
  ),
  back: t('At the back', '最后面', '最後面', 'いちばん後ろ', 'В конец'),
  front: t('At the front', '最前面', '最前面', 'いちばん前', 'В начало'),
  middle: t('In the middle', '中间', '中間', 'まん中', 'В середину'),
};

const QUEUE_EXPLAIN = {
  join: t(
    'New kids always join at the back. That is fair for everyone.',
    '新来的人总是排在最后面，这样对大家都公平。',
    '新來的人總是排在最後面，這樣對大家都公平。',
    '新しく来た人はいつも後ろにならぶ。それがみんなにとって公平だね。',
    'Новые всегда встают в конец. Так честно для всех.',
  ),
  leave: t(
    '4 is at the front, so 4 is served first and leaves.',
    '4 号在最前面，所以先买、先离开。',
    '4 號在最前面，所以先買、先離開。',
    '4 番が先頭だから、最初に買って列をはなれる。',
    'Номер 4 впереди, его обслуживают первым.',
  ),
  two: t(
    '7 and 2 are at the front, so they leave first. Then 6 is at the front.',
    '7 号和 2 号在前面，先离开。然后 6 号就到了最前面。',
    '7 號和 2 號在前面，先離開。然後 6 號就到了最前面。',
    '前にいる 7 番と 2 番が先に出る。すると 6 番が先頭になる。',
    'Впереди стоят 7 и 2, они уходят первыми. Тогда впереди окажется 6.',
  ),
};

const QUEUE_QUIZ = {
  q1: t(
    'Kids 1, 2 and 3 join the line in that order. Who is served first?',
    '1、2、3 号依次排队。谁最先买到？',
    '1、2、3 號依序排隊。誰最先買到？',
    '1 番、2 番、3 番の順に列にならんだ。最初に買えるのはだれ？',
    '1, 2 и 3 встают в очередь именно в таком порядке. Кого обслужат первым?',
  ),
  q1e: t(
    '1 came first, so 1 is served first: first in, first out.',
    '1 号最先来，所以最先买到：先进先出。',
    '1 號最先來，所以最先買到：先進先出。',
    '1 番が最初に来たから、最初に買える。先入れ先出しだね。',
    'Номер 1 встал первым — его первым и обслужат.',
  ),
  q2: t('Which of these is a queue?', '下面哪个是队列？', '下面哪個是佇列？', 'キューなのはどれ？', 'Что из этого — очередь?'),
  q2a: t('Kids waiting for the slide', '排队等滑滑梯的小朋友', '排隊等溜滑梯的小朋友', 'すべり台を待つ子どもの列', 'Дети ждут своей очереди на горку'),
  q2b: t('A pile of plates', '一摞盘子', '一疊盤子', 'お皿の山', 'Стопка тарелок'),
  q2c: t('A row of lockers', '一排储物柜', '一排置物櫃', 'ならんだロッカー', 'Ряд шкафчиков'),
  q2e: t(
    'Kids join the line at the back and go down the slide from the front.',
    '小朋友从队尾加入，从队首去玩滑梯。',
    '小朋友從佇列尾加入，從佇列首去玩溜滑梯。',
    '子どもは後ろにならんで、前から順にすべっていく。',
    'Дети встают в конец, а на горку идут по одному спереди.',
  ),
  q3: t(
    'Which one gives back the oldest item first?',
    '哪一个会先取出最早放进去的东西？',
    '哪一個會先取出最早放進去的東西？',
    'いちばん古いものを先に出すのはどっち？',
    'Что первым отдаёт самый старый элемент?',
  ),
  q3a: t('Queue', '队列', '佇列', 'キュー', 'Очередь'),
  q3b: t('Stack', '栈', '堆疊', 'スタック', 'Стек'),
  q3e: t(
    'A queue is first in, first out. A stack gives back the newest item first.',
    '队列是先进先出；栈则先取出最新放进去的东西。',
    '佇列是先進先出；堆疊則先取出最新放進去的東西。',
    'キューは先入れ先出し。スタックはいちばん新しいものを先に出すよ。',
    'Очередь: первым пришёл — первым ушёл. А стек первым отдаёт самое новое.',
  ),
};

const queue: LessonContent = {
  story(l): StorySlide[] {
    const S = QUEUE_STORY;
    return [
      { scene: waitingLine(l, [1, 2, 3, 4]), say: S.line[l] },
      { scene: waitingLine(l, [1, 2, 3, 4], { incoming: 5 }), say: S.join[l] },
      { scene: waitingLine(l, [2, 3, 4, 5], { out: 1 }), say: S.leave[l] },
      { scene: waitingLine(l, [2, 3, 4, 5], { label: QUEUE_LABEL.fifo[l] }), say: S.fifo[l] },
      { scene: printerQueue(l), say: S.printer[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = QUEUE_PRACTICE;
    const E = QUEUE_EXPLAIN;
    return [
      { scene: waitingLine(l, [4, 7, 2]), say: P.start[l] },
      {
        scene: waitingLine(l, [4, 7, 2], { arriving: 6 }),
        say: P.askJoin[l],
        ask: choose(P.askJoin[l], [['front', P.front[l]], ['middle', P.middle[l]], ['back', P.back[l]]], 'back', E.join[l]),
      },
      { scene: waitingLine(l, [4, 7, 2, 6], { ring: 6 }), say: P.askLeave[l], ask: ask(P.askLeave[l], [4, 7, 2, 6], 4, E.leave[l]) },
      { scene: waitingLine(l, [7, 2, 6], { out: 4 }), say: P.served[l] },
      { scene: waitingLine(l, [7, 2, 6, 9], { ring: 9 }), say: P.join9[l] },
      { scene: waitingLine(l, [7, 2, 6, 9]), say: P.askTwo[l], ask: ask(P.askTwo[l], [2, 6, 9], 6, E.two[l]) },
      { scene: waitingLine(l, [6, 9]), say: P.end[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = QUEUE_QUIZ;
    return [
      ask(Q.q1[l], [1, 2, 3], 1, Q.q1e[l]),
      choose(Q.q2[l], [['slide', Q.q2a[l]], ['plates', Q.q2b[l]], ['lockers', Q.q2c[l]]], 'slide', Q.q2e[l]),
      choose(Q.q3[l], [['queue', Q.q3a[l]], ['stack', Q.q3b[l]]], 'queue', Q.q3e[l]),
    ];
  },
};

// ── Hash table: magic lockers ─────────────────────────────────────────

const LOCKER_W = 38;
const LOCKER_Y = 110;
const lockerX = (i: number) => cellX(12, i, LOCKER_W, 4);

/**
 * Ten lockers 0–9 with their numbers above. `stored[i]` lists the keys in locker i: the first
 * shows in the locker, the others (collisions) hang below it. `rule` shows `key → locker` on top.
 */
/** `shut`: every locker is closed so its contents can't be seen, except the one numbered `shut.open`. */
function lockers(
  stored: Record<number, number[]>,
  o: { rule?: { key: number; to?: number }; ring?: number[]; hot?: number; label?: string; shut?: { open?: number } } = {},
): Scene {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < 10; i++) {
    const closed = o.shut !== undefined && o.shut.open !== i;
    const keys = closed ? [] : (stored[i] ?? []);
    const hot = o.hot === i;
    nodes.push(
      text(`li${i}`, lockerX(i) + LOCKER_W / 2, LOCKER_Y - 8, String(i), { anchor: 'middle', mono: true, size: 14, bold: hot, tone: hot ? 'accent' : 'muted' }),
      box(`locker${i}`, lockerX(i), LOCKER_Y, keys.length ? String(keys[0]) : '', {
        w: LOCKER_W,
        h: 46,
        size: 16,
        tone: closed ? 'idle' : keys.length ? 'info' : 'ghost',
        dashed: !closed && !keys.length,
        ring: hot || (keys.length > 0 && !!o.ring?.includes(keys[0])),
      }),
    );
    keys.slice(1).forEach((k, j) => nodes.push(box(`key${k}`, lockerX(i), LOCKER_Y + 54 + j * 40, String(k), { w: LOCKER_W, h: 34, size: 16, tone: 'warn', ring: o.ring?.includes(k) })));
  }
  if (o.rule) {
    const { key, to } = o.rule;
    nodes.push(chip('rule', W / 2, 10, seg([String(key), 'info', true], ' → ', [to === undefined ? '?' : String(to), 'accent', true]), { size: 16 }));
    if (to !== undefined) nodes.push(arrow('rule:a', [W / 2, 42], [lockerX(to) + LOCKER_W / 2, LOCKER_Y - 24], { tone: 'accent', width: 2.5 }));
  }
  if (o.label) nodes.push(caption(o.label, 'accent', 12));
  return { w: W, h: H, nodes };
}

const HASH_LABEL = {
  key: t('key', '键', '鍵', 'キー', 'ключ'),
  fn: t('hash function', '哈希函数', '雜湊函式', 'ハッシュ関数', 'хеш-функция'),
  locker: t('locker', '柜子', '櫃子', 'ロッカー', 'шкафчик'),
  lastDigit: t('last digit', '最后一位', '最後一位', 'いちばん下のけた', 'последняя цифра'),
  table: t('hash table', '哈希表', '雜湊表', 'ハッシュテーブル', 'хеш-таблица'),
  rule: t('rule: the last digit', '规则：看最后一位数', '規則：看最後一位數', 'ルール：いちばん下のけた', 'правило: последняя цифра'),
  scores: t('scores', '分数', '分數', '点数', 'очки'),
};

/** Key → hash function → locker, as three boxes. */
function hashFlow(l: Locale): Scene {
  const L = HASH_LABEL;
  const key = box('fk', 20, 96, '13', { w: 100, h: 60, size: 22, tone: 'info' });
  const fn = box('ff', 150, 96, L.lastDigit[l], { w: 140, h: 60, sans: true, size: 15, tone: 'accent' });
  const out = box('fl', 320, 96, '3', { w: 100, h: 60, size: 22, tone: 'ok' });
  const over = (id: string, x: number, label: string, tone: Tone) => text(id, x, 84, label, { anchor: 'middle', size: 15, bold: true, tone });
  return {
    w: W,
    h: H,
    nodes: [
      over('fkL', 70, L.key[l], 'info'),
      over('ffL', 220, L.fn[l], 'accent'),
      over('flL', 370, L.locker[l], 'ok'),
      key,
      fn,
      out,
      link('f1', key, fn, { tone: 'accent', width: 2.5 }),
      link('f2', fn, out, { tone: 'accent', width: 2.5 }),
      caption(L.table[l], 'accent'),
    ],
  };
}

/** A game's score table: name → score pairs. */
function scoreTable(l: Locale): Scene {
  const rows: [string, number][] = [
    ['Ana', 12],
    ['Ben', 7],
    ['Kai', 15],
  ];
  const x = Math.round((W - pairWidth(90, 60)) / 2);
  return {
    w: W,
    h: H,
    nodes: [
      region('scores', x - 30, 30, pairWidth(90, 60) + 60, 200, { label: HASH_LABEL.scores[l] }),
      ...rows.flatMap(([name, score], k) => pair(`p${name}`, x, 72 + k * 50, name, score, { kw: 90, vw: 60, h: 40, ring: name === 'Kai' })),
    ],
  };
}

const HASH_STORY = {
  lockers: t(
    'Here are ten magic lockers, numbered 0 to 9. Which locker should each kid’s bag go in?',
    '这里有十个神奇的储物柜，编号 0 到 9。每个小朋友的书包该放哪个柜子？',
    '這裡有十個神奇的置物櫃，編號 0 到 9。每個小朋友的書包該放哪個櫃子？',
    '魔法のロッカーが 10 こ。番号は 0 から 9。みんなのかばんは、どのロッカーに入れる？',
    'Вот десять волшебных шкафчиков с номерами от 0 до 9. В какой положить рюкзак каждого?',
  ),
  rule: t(
    'The magic rule: take the last digit of the kid’s number. Kid 13 uses locker 3.',
    '神奇规则：看小朋友号码的最后一位数。13 号就用 3 号柜。',
    '神奇規則：看小朋友號碼的最後一位數。13 號就用 3 號櫃。',
    '魔法のルール：番号のいちばん下のけたを見る。13 番の子はロッカー 3。',
    'Волшебное правило: берём последнюю цифру номера. Номер 13 кладёт рюкзак в шкафчик 3.',
  ),
  find: t(
    'To find kid 17’s bag later, use the same rule: locker 7. Straight there, no searching!',
    '之后要找 17 号的书包，用同一个规则：7 号柜。直接去，不用找！',
    '之後要找 17 號的書包，用同一個規則：7 號櫃。直接去，不用找！',
    'あとで 17 番のかばんをさがすときも同じルール。ロッカー 7 へ直行。さがし回らなくていい！',
    'Чтобы потом найти рюкзак номера 17, применяем то же правило: шкафчик 7. Сразу туда, без поисков!',
  ),
  collide: t(
    'Kid 3 also gets locker 3! When two keys land in one locker, it’s a collision. They simply share.',
    '3 号也分到了 3 号柜！两个键落进同一个柜子，叫作冲突。它们就一起用这个柜子。',
    '3 號也分到了 3 號櫃！兩個鍵落進同一個櫃子，叫作衝突。它們就一起用這個櫃子。',
    '3 番の子もロッカー 3！ふたつのキーが同じロッカーになるのを衝突というよ。そのときは、いっしょに使うんだ。',
    'Номеру 3 тоже достаётся шкафчик 3! Когда два ключа попадают в один шкафчик, это коллизия. Тогда они просто делят его.',
  ),
  idea: t(
    'This is a hash table. The kid’s number is the key, and the rule is the hash function.',
    '这就是哈希表。小朋友的号码叫键，那个规则叫哈希函数。',
    '這就是雜湊表。小朋友的號碼叫鍵，那個規則叫雜湊函式。',
    'これがハッシュテーブル。番号はキー、ルールはハッシュ関数というよ。',
    'Это хеш-таблица. Номер — это ключ, а правило называется хеш-функцией.',
  ),
  use: t(
    'Games use hash tables to find your score by your name in a flash.',
    '游戏用哈希表，凭你的名字一下子就找到你的分数。',
    '遊戲用雜湊表，憑你的名字一下子就找到你的分數。',
    'ゲームはハッシュテーブルを使って、名前から点数をあっというまに見つけるよ。',
    'Игры с помощью хеш-таблицы мгновенно находят твои очки по имени.',
  ),
};

const HASH_PRACTICE = {
  start: t(
    'All lockers are empty. Remember the rule: the last digit picks the locker.',
    '柜子都空着。记住规则：看最后一位数选柜子。',
    '櫃子都空著。記住規則：看最後一位數選櫃子。',
    'ロッカーはぜんぶ空っぽ。ルールは「いちばん下のけたでロッカーをきめる」だよ。',
    'Все шкафчики пустые. Помни правило: шкафчик выбирает последняя цифра.',
  ),
  ask16: t('Kid 16 arrives. Which locker does 16 use?', '16 号来了。16 号用哪个柜子？', '16 號來了。16 號用哪個櫃子？', '16 番の子が来たよ。どのロッカーを使う？', 'Пришёл номер 16. Какой шкафчик ему достанется?'),
  more: t(
    '16 went into locker 6. Then kids 4 and 19 took lockers 4 and 9.',
    '16 号放进了 6 号柜。接着 4 号和 19 号放进了 4 号柜和 9 号柜。',
    '16 號放進了 6 號櫃。接著 4 號和 19 號放進了 4 號櫃和 9 號櫃。',
    '16 番はロッカー 6 へ。つづいて 4 番と 19 番が、ロッカー 4 と 9 に入ったよ。',
    'Номер 16 — в шкафчике 6. Потом номера 4 и 19 заняли шкафчики 4 и 9.',
  ),
  ask14: t('Kid 14 arrives and gets locker 4. What happens?', '14 号来了，分到 4 号柜。会发生什么？', '14 號來了，分到 4 號櫃。會發生什麼？', '14 番の子が来て、ロッカー 4 になった。どうなる？', 'Пришёл номер 14, ему выпал шкафчик 4. Что будет?'),
  share: t('14 shares locker 4 with 4', '14 号和 4 号一起用 4 号柜', '14 號和 4 號一起用 4 號櫃', '14 番と 4 番がロッカー 4 をいっしょに使う', '14 делит шкафчик 4 с номером 4'),
  fresh: t('14 gets a new locker 14', '14 号换一个新的 14 号柜', '14 號換一個新的 14 號櫃', '14 番は新しいロッカー 14 をもらう', '14 получает новый шкафчик 14'),
  kick: t('14 pushes 4 out', '14 号把 4 号挤出去', '14 號把 4 號擠出去', '14 番が 4 番を追い出す', '14 выгоняет номер 4'),
  shared: t(
    'Collision! 14 and 4 both land in locker 4, so they share it.',
    '冲突！14 号和 4 号都落进 4 号柜，只好一起用。',
    '衝突！14 號和 4 號都落進 4 號櫃，只好一起用。',
    '衝突だ！14 番と 4 番がどちらもロッカー 4 になったから、いっしょに使うよ。',
    'Коллизия! 14 и 4 попали в шкафчик 4, и теперь делят его.',
  ),
  ask19: t(
    'Now all the lockers are shut, so you cannot peek inside. Which locker do you open to find kid 19’s bag?',
    '现在柜子都关上了，看不到里面。要找 19 号的书包，该打开哪个柜子？',
    '現在櫃子都關上了，看不到裡面。要找 19 號的書包，該打開哪個櫃子？',
    'ロッカーはぜんぶしまっていて、中は見えない。19 番のかばんをさがすには、どのロッカーをあける？',
    'Теперь все шкафчики закрыты, внутрь не заглянуть. Какой шкафчик открыть, чтобы найти рюкзак номера 19?',
  ),
  found: t('Locker 9, and there it is! One look, no searching.', '9 号柜，找到了！看一眼就行，不用翻找。', '9 號櫃，找到了！看一眼就行，不用翻找。', 'ロッカー 9 に、あった！ひと目で見つかったね。', 'Шкафчик 9 — вот он! Один взгляд, никаких поисков.'),
};

const HASH_EXPLAIN = {
  e16: t(
    'The last digit of 16 is 6, so it goes to locker 6.',
    '16 的最后一位是 6，所以去 6 号柜。',
    '16 的最後一位是 6，所以去 6 號櫃。',
    '16 のいちばん下のけたは 6。だからロッカー 6。',
    'Последняя цифра 16 — это 6, значит, шкафчик 6.',
  ),
  e14: t(
    'Locker 4 is already taken by 4. That’s a collision, so the two share it.',
    '4 号柜里已经有 4 号了。这就是冲突，两个只好一起用。',
    '4 號櫃裡已經有 4 號了。這就是衝突，兩個只好一起用。',
    'ロッカー 4 にはもう 4 番がいる。これが衝突。だから、ふたりでいっしょに使う。',
    'В шкафчике 4 уже лежит рюкзак номера 4. Это коллизия, поэтому они делят шкафчик.',
  ),
  e19: t(
    'Use the rule: the last digit of 19 is 9. Go straight to locker 9!',
    '用规则：19 的最后一位是 9。直接去 9 号柜！',
    '用規則：19 的最後一位是 9。直接去 9 號櫃！',
    'ルールを使おう。19 のいちばん下のけたは 9。ロッカー 9 へ直行！',
    'Применяем правило: последняя цифра 19 — это 9. Сразу к шкафчику 9!',
  ),
};

const HASH_QUIZ = {
  q1: t('Why is a hash table so fast at finding things?', '为什么哈希表找东西那么快？', '為什麼雜湊表找東西那麼快？', 'ハッシュテーブルが物をさがすのがはやいのはなぜ？', 'Почему хеш-таблица так быстро находит вещи?'),
  q1a: t('A rule tells you the locker right away', '规则马上告诉你是哪个柜子', '規則馬上告訴你是哪個櫃子', 'ルールですぐにロッカーがわかるから', 'Правило сразу называет шкафчик'),
  q1b: t('It checks every locker one by one', '它把柜子一个一个查一遍', '它把櫃子一個一個查一遍', 'ロッカーをひとつずつ全部見るから', 'Она проверяет все шкафчики по очереди'),
  q1c: t('It keeps the lockers sorted', '它让柜子保持有序', '它讓櫃子保持有序', 'ロッカーをならべかえておくから', 'Она держит шкафчики по порядку'),
  q1e: t(
    'The hash function turns the key into a locker number, so you go straight there.',
    '哈希函数把键变成柜子编号，所以能直接过去。',
    '雜湊函式把鍵變成櫃子編號，所以能直接過去。',
    'ハッシュ関数がキーをロッカーの番号に変えるから、まっすぐそこへ行けるんだ。',
    'Хеш-функция превращает ключ в номер шкафчика, и мы сразу идём туда.',
  ),
  q2: t(
    'With the last-digit rule, which locker does 20 go into?',
    '按“最后一位数”规则，20 号放进哪个柜子？',
    '按「最後一位數」規則，20 號放進哪個櫃子？',
    '「いちばん下のけた」ルールだと、20 はどのロッカー？',
    'По правилу последней цифры: в какой шкафчик попадёт 20?',
  ),
  q2e: t('The last digit of 20 is 0, so it goes into locker 0.', '20 的最后一位是 0，所以放进 0 号柜。', '20 的最後一位是 0，所以放進 0 號櫃。', '20 のいちばん下のけたは 0。だからロッカー 0。', 'Последняя цифра 20 — это 0, значит, шкафчик 0.'),
  q3: t('Two keys land in the same locker. What is that called?', '两个键落进了同一个柜子。这叫什么？', '兩個鍵落進了同一個櫃子。這叫什麼？', 'ふたつのキーが同じロッカーになった。これをなんという？', 'Два ключа попали в один шкафчик. Как это называется?'),
  q3a: t('A collision', '冲突', '衝突', '衝突', 'Коллизия'),
  q3b: t('A loop', '循环', '迴圈', 'ループ', 'Цикл'),
  q3c: t('A stack', '栈', '堆疊', 'スタック', 'Стек'),
  q3e: t(
    'It’s a collision. The keys share the locker, and we only look through the few keys inside.',
    '这叫冲突。几个键共用一个柜子，找的时候只要看柜子里的那几个。',
    '這叫衝突。幾個鍵共用一個櫃子，找的時候只要看櫃子裡的那幾個。',
    'これが衝突。キーはロッカーを分け合って、さがすときは中にある少しだけを見ればいい。',
    'Это коллизия. Ключи делят шкафчик, а при поиске смотрим только те немногие, что внутри.',
  ),
};

const STORED = { 6: [16], 4: [4], 9: [19] };

const hash_table: LessonContent = {
  story(l): StorySlide[] {
    const S = HASH_STORY;
    return [
      { scene: lockers({}), say: S.lockers[l] },
      { scene: lockers({ 3: [13] }, { rule: { key: 13, to: 3 }, ring: [13] }), say: S.rule[l] },
      { scene: lockers({ 3: [13], 5: [5], 7: [17] }, { rule: { key: 17, to: 7 }, ring: [17] }), say: S.find[l] },
      { scene: lockers({ 3: [13, 3], 5: [5], 7: [17] }, { rule: { key: 3, to: 3 }, ring: [3] }), say: S.collide[l] },
      { scene: hashFlow(l), say: S.idea[l] },
      { scene: scoreTable(l), say: S.use[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = HASH_PRACTICE;
    const E = HASH_EXPLAIN;
    return [
      { scene: lockers({}, { label: HASH_LABEL.rule[l] }), say: P.start[l] },
      { scene: lockers({}, { rule: { key: 16 } }), say: P.ask16[l], ask: ask(P.ask16[l], [1, 6, 7], 6, E.e16[l]) },
      { scene: lockers(STORED, { ring: [4, 19] }), say: P.more[l] },
      {
        scene: lockers(STORED, { rule: { key: 14, to: 4 } }),
        say: P.ask14[l],
        ask: choose(P.ask14[l], [['share', P.share[l]], ['new', P.fresh[l]], ['kick', P.kick[l]]], 'share', E.e14[l]),
      },
      { scene: lockers({ ...STORED, 4: [4, 14] }, { ring: [14], hot: 4 }), say: P.shared[l] },
      { scene: lockers({ ...STORED, 4: [4, 14] }, { rule: { key: 19 }, shut: {} }), say: P.ask19[l], ask: ask(P.ask19[l], [1, 4, 9], 9, E.e19[l]) },
      { scene: lockers({ ...STORED, 4: [4, 14] }, { rule: { key: 19, to: 9 }, ring: [19], shut: { open: 9 } }), say: P.found[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = HASH_QUIZ;
    return [
      choose(Q.q1[l], [['rule', Q.q1a[l]], ['all', Q.q1b[l]], ['sorted', Q.q1c[l]]], 'rule', Q.q1e[l]),
      { ...ask(Q.q2[l], [0, 2, 9], 0, Q.q2e[l]), scene: lockers({ 2: [12], 9: [9] }, { rule: { key: 20 } }) },
      choose(Q.q3[l], [['collision', Q.q3a[l]], ['loop', Q.q3b[l]], ['stack', Q.q3c[l]]], 'collision', Q.q3e[l]),
    ];
  },
};

// ── Tree: a family tree ───────────────────────────────────────────────

type TreeLook = Partial<Pick<TreeSpec, 'tone' | 'ring' | 'dim' | 'dashed'>>;
interface TreeLayout {
  top: number;
  gap: number;
  r: number;
  size: number;
}
const BIG_TREE: TreeLayout = { top: 40, gap: 72, r: 22, size: 16 };
const SMALL_TREE: TreeLayout = { top: 34, gap: 64, r: 19, size: 15 };

/**
 * A binary tree from a level-order list (`null` = no node), styled by value. Nodes are id'd by
 * value, so a number that swaps places glides. `extra` adds labels next to the drawn circles.
 */
function treeScene(
  values: (number | string | null)[],
  look: Record<string, TreeLook> = {},
  extra: (circles: Map<string, BoxNode>) => SceneNode[] = () => [],
  layout: TreeLayout = BIG_TREE,
): Scene {
  const root = treeFromLevels(values);
  for (const { node } of treeWalk(root)) Object.assign(node, look[String(node.v)]);
  const { nodes, boxes } = drawTree('t', root, { left: 20, width: 400, ...layout });
  return { w: W, h: H, nodes: [...nodes, ...extra(boxes)] };
}

/** A word under a node, e.g. "left" or "right". */
const under = (id: string, b: BoxNode, label: string) => text(id, b.x + b.w / 2, b.y + b.h + 20, label, { anchor: 'middle', size: 15, bold: true, tone: 'accent' });

const TREE_LABEL = {
  root: t('root', '根', '根', '根', 'корень'),
  leaves: t('leaves', '叶节点', '葉節點', '葉', 'листья'),
  left: t('left', '左', '左', '左', 'левый'),
  right: t('right', '右', '右', '右', 'правый'),
  myFiles: t('My files', '我的文件', '我的檔案', 'マイファイル', 'Мои файлы'),
  games: t('Games', '游戏', '遊戲', 'ゲーム', 'Игры'),
  photos: t('Photos', '照片', '照片', '写真', 'Фото'),
  chess: t('Chess', '国际象棋', '西洋棋', 'チェス', 'Шахматы'),
  puzzles: t('Puzzles', '拼图', '拼圖', 'パズル', 'Пазлы'),
  beach: t('Beach', '海边', '海邊', '海', 'Море'),
  cats: t('Cats', '小猫', '小貓', 'ねこ', 'Кошки'),
};

/** Folders on a computer: a tree of boxes. */
function folders(l: Locale): Scene {
  const F = TREE_LABEL;
  const folder = (id: string, x: number, y: number, w: number, label: string, tone: Tone) => box(id, x, y, label, { w, h: 40, sans: true, size: 15, tone });
  const root = folder('fRoot', 165, 24, 110, F.myFiles[l], 'warn');
  const games = folder('fGames', 60, 104, 110, F.games[l], 'warn');
  const photos = folder('fPhotos', 270, 104, 110, F.photos[l], 'warn');
  const files = [
    folder('fChess', 22, 184, 88, F.chess[l], 'info'),
    folder('fPuzzles', 122, 184, 88, F.puzzles[l], 'info'),
    folder('fBeach', 230, 184, 88, F.beach[l], 'info'),
    folder('fCats', 330, 184, 88, F.cats[l], 'info'),
  ];
  const edge = (id: string, a: BoxNode, b: BoxNode) => link(id, a, b, { width: 2 });
  return {
    w: W,
    h: H,
    nodes: [
      edge('e1', root, games),
      edge('e2', root, photos),
      edge('e3', games, files[0]),
      edge('e4', games, files[1]),
      edge('e5', photos, files[2]),
      edge('e6', photos, files[3]),
      root,
      games,
      photos,
      ...files,
    ],
  };
}

const TREE_STORY = {
  family: t(
    'A family tree starts with one person at the top. Below come their children, then grandchildren.',
    '家谱最上面是一位长辈，下面是孩子，再下面是孙辈。',
    '家譜最上面是一位長輩，下面是孩子，再下面是孫輩。',
    '家系図は、いちばん上にひとり。その下に子ども、さらに下に孫がならぶよ。',
    'Родословная начинается с одного человека наверху. Ниже — дети, ещё ниже — внуки.',
  ),
  root: t(
    'In a computer, a tree grows upside down. The node at the very top is the root.',
    '计算机里的树是倒着长的。最上面的节点叫根节点。',
    '電腦裡的樹是倒著長的。最上面的節點叫根節點。',
    'コンピュータの木は、さかさまに育つ。いちばん上のノードを根というよ。',
    'В компьютере дерево растёт вверх ногами. Самый верхний узел называется корнем.',
  ),
  children: t(
    'Each node points down to its children. A’s children are B and C.',
    '每个节点向下连着它的子节点。A 的子节点是 B 和 C。',
    '每個節點向下連著它的子節點。A 的子節點是 B 和 C。',
    'ノードは下にいる子どもとつながっている。A の子は B と C。',
    'Каждый узел ведёт вниз к своим детям. Дети A — это B и C.',
  ),
  leaves: t(
    'Nodes with no children are called leaves. Here D, E, F and G are leaves.',
    '没有子节点的节点叫叶节点。这里的 D、E、F、G 都是叶节点。',
    '沒有子節點的節點叫葉節點。這裡的 D、E、F、G 都是葉節點。',
    '子どもがいないノードを葉という。ここでは D、E、F、G が葉だよ。',
    'Узлы без детей называются листьями. Здесь листья — D, E, F и G.',
  ),
  binary: t(
    'In a binary tree, each node has at most two children: a left child and a right child.',
    '在二叉树里，每个节点最多有两个子节点：左子节点和右子节点。',
    '在二元樹裡，每個節點最多有兩個子節點：左子節點和右子節點。',
    '二分木では、どのノードも子どもは 2 つまで。左の子と右の子だよ。',
    'В двоичном дереве у каждого узла не больше двух детей: левый и правый.',
  ),
  folders: t(
    'Folders on a computer form a tree too. A folder holds more folders, and those hold files.',
    '电脑里的文件夹也是一棵树：文件夹里有文件夹，里面再放文件。',
    '電腦裡的資料夾也是一棵樹：資料夾裡有資料夾，裡面再放檔案。',
    'パソコンのフォルダも木になっているよ。フォルダの中にフォルダ、その中にファイル。',
    'Папки на компьютере тоже образуют дерево: в папке лежат папки, а в них — файлы.',
  ),
};

const TREE_PRACTICE = {
  start: t(
    'Here is a binary tree of numbers. 5 is the root at the top.',
    '这是一棵装着数字的二叉树。5 是最上面的根节点。',
    '這是一棵裝著數字的二元樹。5 是最上面的根節點。',
    '数の入った二分木だよ。いちばん上の 5 が根。',
    'Вот двоичное дерево с числами. 5 — корень наверху.',
  ),
  askKids: t('Which two nodes are the children of 3?', '3 的两个子节点是哪两个？', '3 的兩個子節點是哪兩個？', '3 の子どもはどの 2 つ？', 'Какие два узла — дети узла 3?'),
  kids: t('3 has a left child, 1, and a right child, 4.', '3 的左子节点是 1，右子节点是 4。', '3 的左子節點是 1，右子節點是 4。', '3 の左の子は 1、右の子は 4。', 'У 3 левый ребёнок — 1, а правый — 4.'),
  askLeaves: t('How many leaves does this tree have?', '这棵树有几个叶节点？', '這棵樹有幾個葉節點？', 'この木に葉はいくつある？', 'Сколько листьев у этого дерева?'),
  askStill: t(
    '6 joins as the right child of 4. Is 4 still a leaf?',
    '6 成了 4 的右子节点。4 还是叶节点吗？',
    '6 成了 4 的右子節點。4 還是葉節點嗎？',
    '6 が 4 の右の子になったよ。4 はまだ葉かな？',
    '6 стал правым ребёнком узла 4. Узел 4 всё ещё лист?',
  ),
  yes: t('Yes', '是', '是', 'はい', 'Да'),
  no: t('No', '不是', '不是', 'いいえ', 'Нет'),
  end: t(
    '4 is a parent now. The leaves are 1, 6, 7 and 9.',
    '4 现在当上了父节点。叶节点变成了 1、6、7、9。',
    '4 現在當上了父節點。葉節點變成了 1、6、7、9。',
    '4 は親になった。いまの葉は 1、6、7、9。',
    'Теперь 4 — родитель. Листья: 1, 6, 7 и 9.',
  ),
};

const TREE_EXPLAIN = {
  kids: t(
    'The two lines going down from 3 lead to 1 and 4.',
    '从 3 往下的两条线连着 1 和 4。',
    '從 3 往下的兩條線連著 1 和 4。',
    '3 から下にのびる 2 本の線は、1 と 4 につながっている。',
    'Две линии вниз от 3 ведут к 1 и 4.',
  ),
  leaves: t(
    '1, 4, 7 and 9 have no children, so there are 4 leaves.',
    '1、4、7、9 都没有子节点，所以有 4 个叶节点。',
    '1、4、7、9 都沒有子節點，所以有 4 個葉節點。',
    '1、4、7、9 には子どもがいない。だから葉は 4 つ。',
    'У 1, 4, 7 и 9 нет детей, значит, листьев 4.',
  ),
  still: t(
    '4 has a child now, so it is not a leaf any more. 6 is the new leaf.',
    '4 现在有了子节点，就不是叶节点了。6 是新的叶节点。',
    '4 現在有了子節點，就不是葉節點了。6 是新的葉節點。',
    '4 には子どもができたから、もう葉じゃない。新しい葉は 6。',
    'У 4 появился ребёнок, поэтому 4 больше не лист. Новый лист — 6.',
  ),
};

const TREE_QUIZ = {
  q1: t('What is the node at the very top of a tree called?', '树最上面的那个节点叫什么？', '樹最上面的那個節點叫什麼？', '木のいちばん上のノードはなんという？', 'Как называется самый верхний узел дерева?'),
  q1a: t('The root', '根节点', '根節點', '根', 'Корень'),
  q1b: t('A leaf', '叶节点', '葉節點', '葉', 'Лист'),
  q1c: t('A child', '子节点', '子節點', '子', 'Ребёнок'),
  q1e: t(
    'The top node is the root. Every other node hangs below it.',
    '最上面的是根节点，其他节点都挂在它下面。',
    '最上面的是根節點，其他節點都掛在它下面。',
    'いちばん上は根。ほかのノードはみんなその下にぶら下がっている。',
    'Верхний узел — корень. Все остальные висят под ним.',
  ),
  q2: t(
    'In a binary tree, how many children can a node have at most?',
    '在二叉树里，一个节点最多有几个子节点？',
    '在二元樹裡，一個節點最多有幾個子節點？',
    '二分木で、ひとつのノードがもてる子どもはいくつまで？',
    'Сколько детей может быть у узла двоичного дерева самое большее?',
  ),
  q2e: t(
    'Binary means two: a left child and a right child, at most.',
    '“二叉”就是两个：最多一个左子节点、一个右子节点。',
    '「二元」就是兩個：最多一個左子節點、一個右子節點。',
    '「二分」は 2 つという意味。左の子と右の子まで。',
    '«Двоичное» значит «два»: самое большее левый и правый ребёнок.',
  ),
  q3: t('Which of these nodes is a leaf?', '下面哪个节点是叶节点？', '下面哪個節點是葉節點？', '葉になっているノードはどれ？', 'Какой из этих узлов — лист?'),
  q3e: t(
    'D has no children, so it is a leaf. A and B both have children.',
    'D 没有子节点，所以是叶节点。A 和 B 都有子节点。',
    'D 沒有子節點，所以是葉節點。A 和 B 都有子節點。',
    'D には子どもがいないから葉。A と B には子どもがいるね。',
    'У D нет детей, значит, это лист. А у A и B дети есть.',
  ),
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const NUMS = [5, 3, 8, 1, 4, 7, 9];
const NUMS_PLUS = [5, 3, 8, 1, 4, 7, 9, null, null, null, 6];

const tree: LessonContent = {
  story(l): StorySlide[] {
    const S = TREE_STORY;
    const L = TREE_LABEL;
    const rootTag = (id: string) => (b: Map<string, BoxNode>) => tag('rootTag', b.get(id)!, L.root[l], { side: 'right' });
    const leaf: TreeLook = { tone: 'warn', ring: true };
    return [
      { scene: treeScene(LETTERS, { A: { tone: 'warn' }, B: { tone: 'info' }, C: { tone: 'info' } }), say: S.family[l] },
      { scene: treeScene(LETTERS, { A: { tone: 'warn', ring: true } }, rootTag('nA')), say: S.root[l] },
      { scene: treeScene(LETTERS, { A: { tone: 'warn' }, B: { tone: 'accent', ring: true }, C: { tone: 'accent', ring: true } }), say: S.children[l] },
      { scene: treeScene(LETTERS, { D: leaf, E: leaf, F: leaf, G: leaf }, () => [caption(L.leaves[l], 'warn')]), say: S.leaves[l] },
      {
        scene: treeScene(LETTERS, { B: { tone: 'info', ring: true }, D: { tone: 'accent' }, E: { tone: 'accent' } }, (b) => [under('leftL', b.get('nD')!, L.left[l]), under('rightL', b.get('nE')!, L.right[l])]),
        say: S.binary[l],
      },
      { scene: folders(l), say: S.folders[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = TREE_PRACTICE;
    const E = TREE_EXPLAIN;
    const L = TREE_LABEL;
    const plain = () => [];
    const leaf: TreeLook = { tone: 'warn' };
    return [
      { scene: treeScene(NUMS, { 5: { tone: 'warn' } }, (b) => tag('rootTag', b.get('n5')!, L.root[l], { side: 'right' }), SMALL_TREE), say: P.start[l] },
      {
        scene: treeScene(NUMS, { 3: { tone: 'accent', ring: true } }, plain, SMALL_TREE),
        say: P.askKids[l],
        ask: choose(P.askKids[l], [['14', '1, 4'], ['58', '5, 8'], ['79', '7, 9']], '14', E.kids[l]),
      },
      {
        scene: treeScene(NUMS, { 3: { tone: 'accent', ring: true }, 1: { tone: 'info' }, 4: { tone: 'info' } }, (b) => [under('leftL', b.get('n1')!, L.left[l]), under('rightL', b.get('n4')!, L.right[l])], SMALL_TREE),
        say: P.kids[l],
      },
      { scene: treeScene(NUMS, {}, plain, SMALL_TREE), say: P.askLeaves[l], ask: ask(P.askLeaves[l], [2, 3, 4], 4, E.leaves[l]) },
      {
        scene: treeScene(NUMS_PLUS, { 4: { ring: true }, 6: { tone: 'accent', ring: true } }, plain, SMALL_TREE),
        say: P.askStill[l],
        ask: choose(P.askStill[l], [['yes', P.yes[l]], ['no', P.no[l]]], 'no', E.still[l]),
      },
      { scene: treeScene(NUMS_PLUS, { 1: leaf, 6: leaf, 7: leaf, 9: leaf }, plain, SMALL_TREE), say: P.end[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = TREE_QUIZ;
    return [
      choose(Q.q1[l], [['root', Q.q1a[l]], ['leaf', Q.q1b[l]], ['child', Q.q1c[l]]], 'root', Q.q1e[l]),
      ask(Q.q2[l], [1, 2, 10], 2, Q.q2e[l]),
      { ...choose(Q.q3[l], [['A', 'A'], ['B', 'B'], ['D', 'D']], 'D', Q.q3e[l]), scene: treeScene(['A', 'B', 'C', null, 'D']) },
    ];
  },
};

// ── Heap: the boss on top ─────────────────────────────────────────────

const HEAP_LABEL = {
  boss: t('boss', '老大', '老大', 'ボス', 'главный'),
  rule: t('parent > children', '父节点 > 子节点', '父節點 > 子節點', '親 > 子', 'родитель > дети'),
  first: t('biggest first', '最大的先出来', '最大的先出來', '大きいものから', 'сначала самое большое'),
};

/** A max-heap as a tree, the top marked as the boss. Numbers keep their ids, so a climb glides. */
function heapScene(l: Locale, values: number[], look: Record<string, TreeLook> = {}, label?: string): Scene {
  const top = String(values[0]);
  return treeScene(values, { ...look, [top]: { tone: 'warn', ...look[top] } }, (b) => [
    ...tag('boss', b.get(`n${top}`)!, HEAP_LABEL.boss[l], { side: 'right', tone: 'warn' }),
    ...(label ? [caption(label, 'accent')] : []),
  ]);
}

const HEAP_STORY = {
  boss: t(
    'In a heap, the biggest number always sits on top, like the boss of the team.',
    '在堆里，最大的数总是坐在最上面，就像队伍的老大。',
    '在堆積裡，最大的數總是坐在最上面，就像隊伍的老大。',
    'ヒープでは、いちばん大きい数がいつもてっぺんにいる。チームのボスみたいにね。',
    'В куче самое большое число всегда сидит наверху, как главный в команде.',
  ),
  rule: t(
    'The rule: every parent is bigger than its children. Look, 6 is bigger than 3 and 5.',
    '规则：每个父节点都比它的子节点大。看，6 比 3 和 5 都大。',
    '規則：每個父節點都比它的子節點大。看，6 比 3 和 5 都大。',
    'ルール：親はいつも子どもより大きい。ほら、6 は 3 と 5 より大きいね。',
    'Правило: каждый родитель больше своих детей. Смотри: 6 больше, чем 3 и 5.',
  ),
  join: t(
    'A new number, 10, joins at the bottom, in the next free spot.',
    '新数字 10 来了，它先坐到最下面的下一个空位。',
    '新數字 10 來了，它先坐到最下面的下一個空位。',
    '新しい数 10 がやってきた。まずはいちばん下の、つぎの空いている場所に入る。',
    'Новое число 10 встаёт вниз, на следующее свободное место.',
  ),
  climb1: t(
    '10 is bigger than its parent 8, so they swap. 10 climbs up!',
    '10 比它的父节点 8 大，于是交换。10 往上爬了！',
    '10 比它的父節點 8 大，於是交換。10 往上爬了！',
    '10 は親の 8 より大きいから、入れかわる。10 が上にのぼった！',
    '10 больше своего родителя 8, поэтому они меняются местами. 10 поднимается!',
  ),
  climb2: t(
    '10 is bigger than 9 too, so it climbs again. Now 10 is the new boss!',
    '10 也比 9 大，所以再往上爬。现在 10 是新老大！',
    '10 也比 9 大，所以再往上爬。現在 10 是新老大！',
    '10 は 9 よりも大きいから、もう一度のぼる。これで 10 が新しいボス！',
    '10 больше и чем 9, поэтому поднимается ещё раз. Теперь 10 — новый главный!',
  ),
  use: t(
    'A heap is handy when you always want the biggest first, like a game showing the top score.',
    '想要每次都先拿到最大的，就用堆，比如游戏里显示最高分。',
    '想要每次都先拿到最大的，就用堆積，比如遊戲裡顯示最高分。',
    'いつもいちばん大きいものを先にほしいときはヒープが便利。ゲームの最高点を出すときみたいにね。',
    'Куча удобна, когда всегда нужно самое большое — например, чтобы игра показала лучший счёт.',
  ),
};

const HEAP_PRACTICE = {
  start: t(
    'Here is a heap. 8 is the boss on top, and every parent is bigger than its children.',
    '这是一个堆。8 是最上面的老大，每个父节点都比子节点大。',
    '這是一個堆積。8 是最上面的老大，每個父節點都比子節點大。',
    'ヒープだよ。てっぺんのボスは 8。どの親も子どもより大きい。',
    'Вот куча. Наверху главный — 8, и каждый родитель больше своих детей.',
  ),
  ask7: t(
    '7 joins under 6. But 7 is bigger than its parent 6. What happens?',
    '7 来到 6 的下面。可是 7 比父节点 6 大。会怎样？',
    '7 來到 6 的下面。可是 7 比父節點 6 大。會怎樣？',
    '7 が 6 の下に入った。でも 7 は親の 6 より大きい。どうなる？',
    '7 встаёт под 6. Но 7 больше своего родителя 6. Что будет?',
  ),
  swap: t('7 and 6 swap', '7 和 6 交换', '7 和 6 交換', '7 と 6 が入れかわる', '7 и 6 меняются местами'),
  stay: t('7 stays where it is', '7 待着不动', '7 待著不動', '7 はそのまま', '7 остаётся на месте'),
  askAgain: t(
    '7 and 6 swapped. Now 7’s parent is 8. Does 7 climb again?',
    '7 和 6 交换了。现在 7 的父节点是 8。7 还会往上爬吗？',
    '7 和 6 交換了。現在 7 的父節點是 8。7 還會往上爬嗎？',
    '7 と 6 が入れかわった。こんどの親は 8。7 はまたのぼる？',
    '7 и 6 поменялись. Теперь родитель 7 — это 8. Поднимется ли 7 ещё?',
  ),
  yes: t('Yes, it climbs', '会，继续往上爬', '會，繼續往上爬', 'のぼる', 'Да, поднимется'),
  no: t('No, it stops', '不会，停下来', '不會，停下來', 'とまる', 'Нет, остановится'),
  ask9: t(
    '7 stayed under 8. Now 9 joins under 7. Where will 9 end up?',
    '7 留在了 8 下面。现在 9 来到 7 的下面。9 最后会到哪里？',
    '7 留在了 8 下面。現在 9 來到 7 的下面。9 最後會到哪裡？',
    '7 は 8 の下でとまった。こんどは 9 が 7 の下に入る。9 は最後にどこに行く？',
    'Число 7 осталось под 8. Теперь 9 встаёт под 7. Где 9 окажется в итоге?',
  ),
  top: t('At the very top', '最上面', '最上面', 'てっぺん', 'На самом верху'),
  under7: t('Under 7, where it joined', '留在 7 下面', '留在 7 下面', '7 の下のまま', 'Под 7, где и встало'),
  next5: t('Next to 5', '5 的旁边', '5 的旁邊', '5 のとなり', 'Рядом с 5'),
  swap1: t('9 is bigger than its parent 7, so they swap.', '9 比父节点 7 大，于是交换。', '9 比父節點 7 大，於是交換。', '9 は親の 7 より大きいから、入れかわる。', '9 больше своего родителя 7, поэтому они меняются местами.'),
  swap2: t(
    '9 is bigger than 8 too, so they swap again. 9 is the new boss!',
    '9 也比 8 大，于是再交换一次。9 成了新老大！',
    '9 也比 8 大，於是再交換一次。9 成了新老大！',
    '9 は 8 よりも大きいから、もう一度入れかわる。9 が新しいボスだ！',
    '9 больше и чем 8, поэтому они снова меняются. 9 — новый главный!',
  ),
};

const HEAP_EXPLAIN = {
  swap: t(
    'A child bigger than its parent breaks the rule, so 7 climbs above 6.',
    '子节点比父节点大就违反了规则，所以 7 要爬到 6 上面。',
    '子節點比父節點大就違反了規則，所以 7 要爬到 6 上面。',
    '子が親より大きいとルール違反。だから 7 は 6 の上にのぼる。',
    'Ребёнок больше родителя — это против правила, поэтому 7 поднимается над 6.',
  ),
  stop: t('7 is smaller than 8, so it stops. 8 stays the boss.', '7 比 8 小，所以停下来。8 还是老大。', '7 比 8 小，所以停下來。8 還是老大。', '7 は 8 より小さいから、そこでとまる。ボスは 8 のまま。', '7 меньше 8, поэтому останавливается. Главным остаётся 8.'),
  top: t(
    '9 is bigger than 7 and bigger than 8, so it climbs twice, all the way to the top.',
    '9 比 7 大，也比 8 大，所以连爬两次，一直爬到最上面。',
    '9 比 7 大，也比 8 大，所以連爬兩次，一直爬到最上面。',
    '9 は 7 よりも 8 よりも大きいから、2 回のぼって、てっぺんまで行く。',
    '9 больше и 7, и 8, поэтому поднимается дважды — до самого верха.',
  ),
};

const HEAP_QUIZ = {
  q1: t(
    'In a heap where every parent is bigger than its children, where is the biggest number?',
    '在每个父节点都比子节点大的堆里，最大的数在哪里？',
    '在每個父節點都比子節點大的堆積裡，最大的數在哪裡？',
    'どの親も子どもより大きいヒープでは、いちばん大きい数はどこにいる？',
    'Каждый родитель в куче больше своих детей. Где самое большое число?',
  ),
  q1a: t('At the top', '在最上面', '在最上面', 'てっぺん', 'Наверху'),
  q1b: t('At the bottom', '在最下面', '在最下面', 'いちばん下', 'Внизу'),
  q1c: t('It could be anywhere', '哪里都有可能', '哪裡都有可能', 'どこにいるかわからない', 'Где угодно'),
  q1e: t(
    'Every parent is bigger than its children, so the biggest of all ends up on top.',
    '每个父节点都比子节点大，所以最大的那个一定在最上面。',
    '每個父節點都比子節點大，所以最大的那個一定在最上面。',
    'どの親も子より大きいから、いちばん大きい数はてっぺんに来る。',
    'Каждый родитель больше детей, поэтому самое большое число оказывается наверху.',
  ),
  q2: t('Is this a correct heap?', '这是一个正确的堆吗？', '這是一個正確的堆積嗎？', 'これは正しいヒープかな？', 'Это правильная куча?'),
  yes: t('Yes', '是', '是', 'はい', 'Да'),
  no: t('No', '不是', '不是', 'いいえ', 'Нет'),
  q2e: t(
    '8 is bigger than its parent 6. That breaks the rule: 8 should be on top.',
    '8 比它的父节点 6 大，违反了规则：8 应该在最上面。',
    '8 比它的父節點 6 大，違反了規則：8 應該在最上面。',
    '8 は親の 6 より大きい。これはルール違反。8 がてっぺんにいるべきだね。',
    '8 больше своего родителя 6. Это против правила: наверху должно быть 8.',
  ),
  q3: t('What can a heap give you very quickly?', '堆能很快给你什么？', '堆積能很快給你什麼？', 'ヒープがすぐに教えてくれるのはどれ？', 'Что куча может дать очень быстро?'),
  q3a: t('The biggest number', '最大的数', '最大的數', 'いちばん大きい数', 'Самое большое число'),
  q3b: t('The middle number', '正中间的数', '正中間的數', 'まん中の数', 'Число из середины'),
  q3c: t('All numbers in order', '排好序的所有数', '排好序的所有數', '全部の数を順番に', 'Все числа по порядку'),
  q3e: t(
    'The biggest number is always on top, so a heap hands it over right away.',
    '最大的数总在最上面，所以堆马上就能把它给你。',
    '最大的數總在最上面，所以堆積馬上就能把它給你。',
    'いちばん大きい数はいつもてっぺんにいるから、すぐに取り出せるんだ。',
    'Самое большое число всегда наверху, поэтому куча сразу его отдаёт.',
  ),
};

const heap: LessonContent = {
  story(l): StorySlide[] {
    const S = HEAP_STORY;
    const fresh: TreeLook = { tone: 'accent', ring: true };
    return [
      { scene: heapScene(l, [9, 6, 8, 3, 5, 7], { 9: { ring: true } }), say: S.boss[l] },
      { scene: heapScene(l, [9, 6, 8, 3, 5, 7], { 6: { tone: 'accent', ring: true }, 3: { tone: 'info' }, 5: { tone: 'info' } }, HEAP_LABEL.rule[l]), say: S.rule[l] },
      { scene: heapScene(l, [9, 6, 8, 3, 5, 7, 10], { 10: { ...fresh, dashed: true } }), say: S.join[l] },
      { scene: heapScene(l, [9, 6, 10, 3, 5, 7, 8], { 10: fresh }), say: S.climb1[l] },
      { scene: heapScene(l, [10, 6, 9, 3, 5, 7, 8], { 10: { ring: true } }), say: S.climb2[l] },
      { scene: heapScene(l, [10, 6, 9, 3, 5, 7, 8], {}, HEAP_LABEL.first[l]), say: S.use[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = HEAP_PRACTICE;
    const E = HEAP_EXPLAIN;
    const fresh: TreeLook = { tone: 'accent', ring: true };
    return [
      { scene: heapScene(l, [8, 5, 6, 1, 3]), say: P.start[l] },
      {
        scene: heapScene(l, [8, 5, 6, 1, 3, 7], { 7: { ...fresh, dashed: true } }),
        say: P.ask7[l],
        ask: choose(P.ask7[l], [['swap', P.swap[l]], ['stay', P.stay[l]]], 'swap', E.swap[l]),
      },
      {
        scene: heapScene(l, [8, 5, 7, 1, 3, 6], { 7: fresh }),
        say: P.askAgain[l],
        ask: choose(P.askAgain[l], [['yes', P.yes[l]], ['no', P.no[l]]], 'no', E.stop[l]),
      },
      {
        scene: heapScene(l, [8, 5, 7, 1, 3, 6, 9], { 9: { ...fresh, dashed: true } }),
        say: P.ask9[l],
        ask: choose(P.ask9[l], [['top', P.top[l]], ['stay', P.under7[l]], ['next5', P.next5[l]]], 'top', E.top[l]),
      },
      { scene: heapScene(l, [8, 5, 9, 1, 3, 6, 7], { 9: fresh }), say: P.swap1[l] },
      { scene: heapScene(l, [9, 5, 8, 1, 3, 6, 7], { 9: { ring: true } }), say: P.swap2[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = HEAP_QUIZ;
    return [
      choose(Q.q1[l], [['top', Q.q1a[l]], ['bottom', Q.q1b[l]], ['anywhere', Q.q1c[l]]], 'top', Q.q1e[l]),
      { ...choose(Q.q2[l], [['yes', Q.yes[l]], ['no', Q.no[l]]], 'no', Q.q2e[l]), scene: treeScene([6, 8, 5]) },
      choose(Q.q3[l], [['biggest', Q.q3a[l]], ['middle', Q.q3b[l]], ['sorted', Q.q3c[l]]], 'biggest', Q.q3e[l]),
    ];
  },
};

// ── Graph: a map of friends ───────────────────────────────────────────

type Spot = [name: string, x: number, y: number];

const FRIENDS: Spot[] = [
  ['Ana', 70, 80],
  ['Ben', 200, 56],
  ['Cai', 110, 200],
  ['Dev', 240, 170],
  ['Eli', 360, 90],
  ['Fay', 380, 206],
];
const FRIEND_LINES: [string, string][] = [
  ['Ana', 'Ben'],
  ['Ana', 'Cai'],
  ['Ben', 'Dev'],
  ['Cai', 'Dev'],
  ['Dev', 'Eli'],
  ['Eli', 'Fay'],
];
/** Towns A–E are joined by roads; F and G are an island of their own. */
const TOWNS: Spot[] = [
  ['A', 50, 80],
  ['B', 150, 50],
  ['C', 110, 190],
  ['D', 230, 140],
  ['E', 330, 60],
  ['F', 320, 210],
  ['G', 410, 150],
];
const ROADS: [string, string][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['C', 'D'],
  ['D', 'E'],
  ['F', 'G'],
];

/** A graph of named circles. `hot` lists edges as "A-B" (names in alphabetical order) to color. */
function graphScene(spots: Spot[], lines: [string, string][], o: { look?: Record<string, Look>; hot?: string[]; extra?: GraphEdge[]; nodes?: SceneNode[] } = {}): Scene {
  const vertices: GraphVertex[] = spots.map(([name, x, y]) => ({ id: `v${name}`, v: name, x, y, tone: 'info', ...o.look?.[name] }));
  const edges: GraphEdge[] = [
    ...lines.map(([a, b]): GraphEdge => ({ a: `v${a}`, b: `v${b}`, tone: o.hot?.includes([a, b].sort().join('-')) ? 'accent' : undefined })),
    ...(o.extra ?? []),
  ];
  const { nodes } = drawGraph('g', vertices, edges, { r: 24, size: 15 });
  return { w: W, h: H, nodes: [...nodes, ...(o.nodes ?? [])] };
}

const GRAPH_LABEL = {
  vertex: t('vertex', '顶点', '頂點', '頂点', 'вершина'),
  edge: t('edge', '边', '邊', '辺', 'ребро'),
};

const GRAPH_STORY = {
  friends: t(
    'Here is a map of friends. A line between two kids means they are friends.',
    '这是一张朋友地图。两个小朋友之间有线，就说明两人是朋友。',
    '這是一張朋友地圖。兩個小朋友之間有線，就表示兩人是朋友。',
    '友だちの地図だよ。ふたりのあいだに線があれば、友だちどうし。',
    'Вот карта друзей. Линия между двумя ребятами значит, что они дружат.',
  ),
  terms: t(
    'This is a graph! Each circle is a vertex, and each line is an edge.',
    '这就是图！每个圆圈叫顶点，每条线叫边。',
    '這就是圖！每個圓圈叫頂點，每條線叫邊。',
    'これがグラフ！丸のひとつひとつが頂点、線が辺だよ。',
    'Это граф! Каждый кружок — вершина, а каждая линия — ребро.',
  ),
  neighbors: t(
    'Kids joined by a line are neighbors. Ana’s neighbors are Ben and Cai.',
    '有线直接相连的叫邻居。Ana 的邻居是 Ben 和 Cai。',
    '有線直接相連的叫鄰居。Ana 的鄰居是 Ben 和 Cai。',
    '線でつながっている相手を「となり」という。Ana のとなりは Ben と Cai。',
    'Те, кого соединяет линия, — соседи. Соседи Ana — Ben и Cai.',
  ),
  path: t(
    'Follow lines to reach friends of friends. Ana → Ben → Dev → Eli is a path.',
    '顺着线走，能找到朋友的朋友。Ana → Ben → Dev → Eli 就是一条路径。',
    '順著線走，能找到朋友的朋友。Ana → Ben → Dev → Eli 就是一條路徑。',
    '線をたどると、友だちの友だちにも会える。Ana → Ben → Dev → Eli が道すじ（パス）だよ。',
    'Идя по линиям, можно добраться до друзей друзей. Ana → Ben → Dev → Eli — это путь.',
  ),
  maps: t(
    'Map apps use graphs too: towns are vertices, roads are edges, and the app finds a path for you.',
    '地图软件也用图：城镇是顶点，道路是边，软件帮你找出一条路径。',
    '地圖 App 也用圖：城鎮是頂點，道路是邊，App 幫你找出一條路徑。',
    '地図アプリもグラフを使うよ。町が頂点、道が辺。アプリが道すじを見つけてくれる。',
    'Карты в телефоне тоже используют графы: города — вершины, дороги — рёбра, а приложение ищет путь.',
  ),
};

const GRAPH_PRACTICE = {
  start: t(
    'Here are towns and roads. Each road connects two towns.',
    '这里有一些城镇和道路，每条路连着两个城镇。',
    '這裡有一些城鎮和道路，每條路連著兩個城鎮。',
    '町と道の地図だよ。どの道も 2 つの町をつないでいる。',
    'Вот города и дороги. Каждая дорога соединяет два города.',
  ),
  askN: t('Which towns are D’s neighbors?', '哪些城镇是 D 的邻居？', '哪些城鎮是 D 的鄰居？', 'D のとなりの町はどれ？', 'Какие города — соседи D?'),
  neighbors: t(
    'D has three neighbors: B, C and E. One road leads to each.',
    'D 有三个邻居：B、C、E，每个都有一条路直通。',
    'D 有三個鄰居：B、C、E，每個都有一條路直通。',
    'D のとなりは B、C、E の 3 つ。それぞれに道が 1 本ずつある。',
    'У D три соседа: B, C и E. К каждому ведёт своя дорога.',
  ),
  askRoads: t(
    'What is the smallest number of roads from A to E?',
    '从 A 到 E 最少要走几条路？',
    '從 A 到 E 最少要走幾條路？',
    'A から E まで、いちばん少なくて何本の道を通る？',
    'Сколько дорог нужно проехать от A до E, если ехать кратчайшим путём?',
  ),
  path: t(
    'A → B → D → E uses 3 roads. A → C → D → E is just as short.',
    'A → B → D → E 走 3 条路。A → C → D → E 也一样短。',
    'A → B → D → E 走 3 條路。A → C → D → E 也一樣短。',
    'A → B → D → E で 3 本。A → C → D → E も同じくらい短いよ。',
    'A → B → D → E — это 3 дороги. A → C → D → E так же коротко.',
  ),
  askReach: t('Can you drive from A to G?', '能从 A 开车到 G 吗？', '能從 A 開車到 G 嗎？', 'A から G まで車で行ける？', 'Можно ли доехать из A в G?'),
  yes: t('Yes', '能', '能', '行ける', 'Да'),
  no: t('No', '不能', '不能', '行けない', 'Нет'),
  bridge: t(
    'F and G are an island. One new road, from E to G, would connect every town.',
    'F 和 G 是一座孤岛。只要修一条从 E 到 G 的新路，所有城镇就连起来了。',
    'F 和 G 是一座孤島。只要修一條從 E 到 G 的新路，所有城鎮就連起來了。',
    'F と G は島みたいにはなれている。E から G へ新しい道を 1 本作れば、全部の町がつながるよ。',
    'F и G — как остров. Одна новая дорога из E в G соединит все города.',
  ),
};

const GRAPH_EXPLAIN = {
  neighbors: t('Roads go straight from D to B, C and E.', '从 D 有路直通 B、C、E。', '從 D 有路直通 B、C、E。', 'D からは B、C、E へまっすぐ道がのびている。', 'Из D прямые дороги ведут в B, C и E.'),
  roads: t(
    'A → B → D → E takes 3 roads. There is no way with fewer.',
    'A → B → D → E 要走 3 条路，没有更少的走法。',
    'A → B → D → E 要走 3 條路，沒有更少的走法。',
    'A → B → D → E で 3 本。もっと少ない行き方はないよ。',
    'A → B → D → E — 3 дороги. Меньше никак.',
  ),
  reach: t(
    'No road links A’s towns to F and G. You can’t get there from A.',
    '没有路把 A 那边的城镇和 F、G 连起来，所以从 A 到不了。',
    '沒有路把 A 那邊的城鎮和 F、G 連起來，所以從 A 到不了。',
    'A のほうの町と F・G をつなぐ道はない。だから A からは行けないんだ。',
    'Ни одна дорога не связывает города A с F и G. Из A туда не попасть.',
  ),
};

const GRAPH_QUIZ = {
  q1: t('In a graph, what does an edge show?', '在图里，一条边表示什么？', '在圖裡，一條邊表示什麼？', 'グラフの辺は何をあらわす？', 'Что показывает ребро в графе?'),
  q1a: t('Two things are connected', '两个东西连在一起', '兩個東西連在一起', 'ふたつがつながっている', 'Две вещи связаны'),
  q1b: t('Which thing is bigger', '哪个东西更大', '哪個東西更大', 'どっちが大きいか', 'Что из них больше'),
  q1c: t('Which thing came first', '哪个东西先来', '哪個東西先來', 'どっちが先に来たか', 'Что появилось раньше'),
  q1e: t(
    'An edge joins two vertices: two friends, or two towns with a road between them.',
    '一条边连着两个顶点：两个朋友，或者有路相通的两个城镇。',
    '一條邊連著兩個頂點：兩個朋友，或者有路相通的兩個城鎮。',
    '辺は 2 つの頂点をつなぐ。友だちどうしや、道でつながった町どうしだね。',
    'Ребро соединяет две вершины: двух друзей или два города с дорогой между ними.',
  ),
  q2: t('How many neighbors does B have?', 'B 有几个邻居？', 'B 有幾個鄰居？', 'B のとなりはいくつ？', 'Сколько соседей у B?'),
  q2e: t(
    'Lines go from B to A, C and D, so B has 3 neighbors.',
    'B 有线连着 A、C、D，所以有 3 个邻居。',
    'B 有線連著 A、C、D，所以有 3 個鄰居。',
    'B から A、C、D に線がある。だからとなりは 3 つ。',
    'От B идут линии к A, C и D, значит, соседей 3.',
  ),
  q3: t('Which of these fits a graph best?', '下面哪个最适合用图来表示？', '下面哪個最適合用圖來表示？', 'グラフで表すのにいちばん向いているのはどれ？', 'Что лучше всего описать графом?'),
  q3a: t('Roads between towns', '城镇之间的道路', '城鎮之間的道路', '町と町をむすぶ道', 'Дороги между городами'),
  q3b: t('A pile of plates', '一摞盘子', '一疊盤子', 'お皿の山', 'Стопка тарелок'),
  q3c: t('A line at a shop', '商店前的队伍', '商店前的隊伍', 'お店の行列', 'Очередь в магазине'),
  q3e: t(
    'Towns and roads are vertices and edges: a perfect graph.',
    '城镇和道路正好是顶点和边，是标准的图。',
    '城鎮和道路正好是頂點和邊，是標準的圖。',
    '町と道は、そのまま頂点と辺。まさにグラフだね。',
    'Города и дороги — это вершины и рёбра. Идеальный граф.',
  ),
};

const graph: LessonContent = {
  story(l): StorySlide[] {
    const S = GRAPH_STORY;
    const hot: Look = { tone: 'accent' };
    const word = (id: string, x: number, y: number, label: string) => text(id, x, y, label, { anchor: 'middle', size: 15, bold: true, tone: 'accent' });
    return [
      { scene: graphScene(FRIENDS, FRIEND_LINES), say: S.friends[l] },
      {
        scene: graphScene(FRIENDS, FRIEND_LINES, {
          look: { Ana: { tone: 'accent', ring: true } },
          hot: ['Ana-Ben'],
          nodes: [word('vertexL', 70, 46, GRAPH_LABEL.vertex[l]), word('edgeL', 134, 54, GRAPH_LABEL.edge[l])],
        }),
        say: S.terms[l],
      },
      { scene: graphScene(FRIENDS, FRIEND_LINES, { look: { Ana: { tone: 'warn', ring: true }, Ben: hot, Cai: hot }, hot: ['Ana-Ben', 'Ana-Cai'] }), say: S.neighbors[l] },
      { scene: graphScene(FRIENDS, FRIEND_LINES, { look: { Ana: hot, Ben: hot, Dev: hot, Eli: hot }, hot: ['Ana-Ben', 'Ben-Dev', 'Dev-Eli'] }), say: S.path[l] },
      {
        scene: graphScene(TOWNS, ROADS, { look: { A: { tone: 'accent', ring: true }, B: hot, D: hot, E: { tone: 'accent', ring: true } }, hot: ['A-B', 'B-D', 'D-E'] }),
        say: S.maps[l],
      },
    ];
  },
  practice(l): PracticeStep[] {
    const P = GRAPH_PRACTICE;
    const E = GRAPH_EXPLAIN;
    const hot: Look = { tone: 'accent' };
    const ends: Look = { tone: 'accent', ring: true };
    return [
      { scene: graphScene(TOWNS, ROADS), say: P.start[l] },
      {
        scene: graphScene(TOWNS, ROADS, { look: { D: { tone: 'warn', ring: true } } }),
        say: P.askN[l],
        ask: choose(P.askN[l], [['ab', 'A, B'], ['bce', 'B, C, E'], ['fg', 'F, G']], 'bce', E.neighbors[l]),
      },
      { scene: graphScene(TOWNS, ROADS, { look: { D: { tone: 'warn', ring: true }, B: hot, C: hot, E: hot }, hot: ['B-D', 'C-D', 'D-E'] }), say: P.neighbors[l] },
      { scene: graphScene(TOWNS, ROADS, { look: { A: ends, E: ends } }), say: P.askRoads[l], ask: ask(P.askRoads[l], [2, 3, 4], 3, E.roads[l]) },
      { scene: graphScene(TOWNS, ROADS, { look: { A: ends, B: hot, D: hot, E: ends }, hot: ['A-B', 'B-D', 'D-E'] }), say: P.path[l] },
      {
        scene: graphScene(TOWNS, ROADS, { look: { A: ends, G: ends } }),
        say: P.askReach[l],
        ask: choose(P.askReach[l], [['yes', P.yes[l]], ['no', P.no[l]]], 'no', E.reach[l]),
      },
      {
        scene: graphScene(TOWNS, ROADS, { look: { F: { tone: 'warn' }, G: { tone: 'warn' } }, extra: [{ a: 'vE', b: 'vG', dashed: true, tone: 'accent' }] }),
        say: P.bridge[l],
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = GRAPH_QUIZ;
    const square: Spot[] = [
      ['A', 100, 70],
      ['B', 220, 140],
      ['C', 340, 70],
      ['D', 220, 226],
    ];
    return [
      choose(Q.q1[l], [['link', Q.q1a[l]], ['bigger', Q.q1b[l]], ['first', Q.q1c[l]]], 'link', Q.q1e[l]),
      {
        ...ask(Q.q2[l], [1, 2, 3], 3, Q.q2e[l]),
        scene: graphScene(
          square,
          [
            ['A', 'B'],
            ['B', 'C'],
            ['B', 'D'],
            ['C', 'D'],
          ],
          { look: { B: { tone: 'warn', ring: true } } },
        ),
      },
      choose(Q.q3[l], [['roads', Q.q3a[l]], ['plates', Q.q3b[l]], ['line', Q.q3c[l]]], 'roads', Q.q3e[l]),
    ];
  },
};

const LESSONS: Record<string, LessonContent> = { array, linked_list, stack, queue, hash_table, tree, heap, graph };

export default LESSONS;
