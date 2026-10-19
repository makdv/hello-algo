import { arrow, box, center, chip, link, seg, text } from '../../../figures/kit';
import type { BoxNode, Scene, SceneNode, Tone } from '../../../figures/scene';
import type { Locale } from '../../../i18n/locale';
import type { KidQuestion, LessonContent, PracticeStep, StorySlide } from '../types';

/**
 * Unit 4, clever ways to solve puzzles. Each lesson: an everyday picture in the story, a short
 * guessing game in "Try it", and a three-question quiz. Text is written for 8–12 year olds.
 */

type T = Record<Locale, string>;
type F = Record<Locale, (n: number) => string>;
const t = (en: string, zh: string, zhHant: string, ja: string, ru: string): T => ({ en, zh, 'zh-hant': zhHant, ja, ru });

const W = 440;
const H = 260;

/** Russian plural form for a count: 1 диск, 2 диска, 5 дисков. */
const ruPlural = (n: number, one: string, few: string, many: string) => {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return one;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return few;
  return many;
};

/** A question with numbers as choices. */
const ask = (prompt: string, ids: number[], answer: number, explain: string): KidQuestion => ({
  prompt,
  choices: ids.map((n) => ({ id: String(n), label: String(n) })),
  answer: String(answer),
  explain,
});

/** A question with worded choices, given as [id, label] pairs. */
const pick = (prompt: string, choices: [string, string][], answer: string, explain: string): KidQuestion => ({
  prompt,
  choices: choices.map(([id, label]) => ({ id, label })),
  answer,
  explain,
});

// ── Maze: rooms, ripples and dead ends ────────────────────────────────

type Pos = [number, number];

/** `#` is a wall; the start is the top-left room and the star the bottom-right one. */
const MAZE = ['...#.', '##.#.', '.....', '.###.'];
const START: Pos = [0, 0];
const EXIT: Pos = [3, 4];
const MS = 44;
const MG = 4;
const MX = 20;
const MY = 34;

const roomBox = ([r, c]: Pos) => ({ x: MX + c * (MS + MG), y: MY + r * (MS + MG), w: MS, h: MS });
const mid = (p: Pos): [number, number] => {
  const b = roomBox(p);
  return [b.x + MS / 2, b.y + MS / 2];
};
const same = (a: Pos, b: Pos) => a[0] === b[0] && a[1] === b[1];
const has = (list: Pos[] | undefined, p: Pos) => (list ?? []).some((q) => same(q, p));

/** Steps from the start to every room: the "ripple" numbers. */
const DIST: number[][] = (() => {
  const d = MAZE.map((row) => [...row].map(() => -1));
  d[START[0]][START[1]] = 0;
  const queue: Pos[] = [START];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (MAZE[nr]?.[nc] === '.' && d[nr][nc] < 0) {
        d[nr][nc] = d[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return d;
})();

const SHORTEST: Pos[] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 4],
];
/** Depth-first goes left at the fork and ends in the bottom-left dead end. */
const LEFT_TRY: Pos[] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [2, 1],
  [2, 0],
  [3, 0],
];
const FORK: Pos = [2, 2];
const DEAD_END: Pos = [3, 0];

/** A brick wall square of side `s`: its outline and the lines between bricks, drawn as one filled path. */
const brickWall = (x: number, y: number, s: number) => {
  const a = Math.round(s / 3);
  const b = Math.round((2 * s) / 3);
  return [
    `M ${x} ${y} L ${x + s} ${y} L ${x + s} ${y + s} L ${x} ${y + s} Z`,
    `M ${x} ${y + a} L ${x + s} ${y + a}`,
    `M ${x} ${y + b} L ${x + s} ${y + b}`,
    `M ${x + s / 2} ${y} L ${x + s / 2} ${y + a}`,
    `M ${x + s / 4} ${y + a} L ${x + s / 4} ${y + b}`,
    `M ${x + (3 * s) / 4} ${y + a} L ${x + (3 * s) / 4} ${y + b}`,
    `M ${x + s / 2} ${y + b} L ${x + s / 2} ${y + s}`,
  ].join(' ');
};

/** Which way the next room is: an arrow drawn inside the room. */
const arrowGlyph = (a: Pos, b: Pos) => (b[0] > a[0] ? '↓' : b[0] < a[0] ? '↑' : b[1] > a[1] ? '→' : '←');

interface MazeView {
  /** Where Algo stands. */
  at?: Pos;
  /** Show ripple numbers up to this many steps. */
  nums?: number;
  /** Rooms marked as visited. */
  seen?: Pos[];
  /** Rooms of the shortest path, highlighted once numbered. */
  path?: Pos[];
  /** Rooms walked so far, each showing which way Algo went next. */
  trail?: Pos[];
  stuck?: Pos;
  /** The fork Algo walks back to. */
  back?: Pos;
  qs?: Pos[];
  side?: SceneNode[];
}

function maze(o: MazeView): Scene {
  const nodes: SceneNode[] = [];
  const walls: string[] = [];
  const trail = o.trail ?? [];
  MAZE.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      const p: Pos = [r, c];
      const { x, y } = roomBox(p);
      if (ch === '#') {
        walls.push(brickWall(x, y, MS));
        return;
      }
      const d = DIST[r][c];
      const isExit = same(p, EXIT);
      let label = isExit ? '★' : '';
      let tone: Tone = isExit ? 'ok' : 'idle';
      let ring = false;
      let dashed = false;
      if (has(o.seen, p)) {
        label = '✓';
        tone = 'ok';
      }
      const k = trail.findIndex((q) => same(q, p));
      if (k >= 0 && k < trail.length - 1) {
        label = arrowGlyph(p, trail[k + 1]);
        tone = 'accent';
      }
      if (o.back && same(o.back, p)) {
        tone = 'warn';
        ring = true;
      }
      if (o.nums !== undefined && d <= o.nums) {
        label = String(d);
        tone = d === o.nums ? 'accent' : 'info';
        if (has(o.path, p)) {
          tone = 'ok';
          ring = true;
        }
      }
      if (has(o.qs, p)) {
        label = '?';
        tone = 'accent';
        ring = true;
        dashed = true;
      }
      if (o.stuck && same(o.stuck, p)) tone = 'danger';
      nodes.push(box(`m${r}-${c}`, x, y, label, { w: MS, h: MS, size: 18, tone, ring, dashed }));
    }),
  );
  nodes.push({ kind: 'path', id: 'm:walls', d: walls.join(' '), fill: true, tone: 'warn', width: 2 });
  if (o.at) {
    const [cx, cy] = mid(o.at);
    nodes.push(box('algo', cx - 14, cy - 14, '', { w: 28, h: 28, shape: 'circle', tone: 'accent', ring: true }));
  }
  nodes.push(...(o.side ?? []));
  return { w: W, h: H, nodes };
}

const MAZE_WORD: Record<'exit' | 'wall' | 'room' | 'bfs' | 'bfsHint' | 'dfs' | 'dfsHint' | 'seen' | 'deadEnd' | 'backToFork', T> = {
  exit: t('exit', '出口', '出口', '出口', 'выход'),
  wall: t('wall', '墙', '牆', 'かべ', 'стена'),
  room: t('room', '房间', '房間', 'へや', 'комната'),
  bfs: t('breadth-first', '广度优先', '廣度優先', '幅優先', 'в ширину'),
  bfsHint: t('like ripples', '像水波一样', '像水波一樣', '波のように', 'как круги на воде'),
  dfs: t('depth-first', '深度优先', '深度優先', '深さ優先', 'в глубину'),
  dfsHint: t('one path at a time', '一条路走到底', '一條路走到底', '一本道をすすむ', 'по одной тропе'),
  seen: t('✓ = visited', '✓ = 走过了', '✓ = 走過了', '✓ = 行ったへや', '✓ = уже были'),
  deadEnd: t('Dead end!', '死胡同！', '死路！', '行き止まり！', 'Тупик!'),
  backToFork: t('← back to the fork', '← 退回岔路口', '← 退回岔路口', '← 分かれ道へもどる', '← назад к развилке'),
};

const STEPS: F = {
  en: (n) => `${n} steps`,
  zh: (n) => `${n} 步`,
  'zh-hant': (n) => `${n} 步`,
  ja: (n) => `${n} 歩`,
  ru: (n) => `${n} ${ruPlural(n, 'шаг', 'шага', 'шагов')}`,
};

/** What each picture means: Algo, rooms, walls and the star. */
function mazeLegend(l: Locale): SceneNode[] {
  const x = 286;
  const row = (k: number) => 44 + k * 46;
  const label = (id: string, k: number, value: string) => text(id, x + 44, row(k) + 21, value, { size: 16, bold: true });
  return [
    box('lg:algo', x + 1, row(0) + 1, '', { w: 28, h: 28, shape: 'circle', tone: 'accent', ring: true }),
    label('lg:algo:t', 0, 'Algo'),
    box('lg:room', x, row(1), '', { w: 30, h: 30 }),
    label('lg:room:t', 1, MAZE_WORD.room[l]),
    { kind: 'path', id: 'lg:wall', d: brickWall(x, row(2), 30), fill: true, tone: 'warn', width: 2 },
    label('lg:wall:t', 2, MAZE_WORD.wall[l]),
    box('lg:exit', x, row(3), '★', { w: 30, h: 30, size: 16, tone: 'ok' }),
    label('lg:exit:t', 3, MAZE_WORD.exit[l]),
  ];
}

/** A method name and a friendly hint in the right-hand panel. */
const sideChips = (name: string, hint?: string, tone: Tone = 'accent', extra?: { text: string; tone: Tone }): SceneNode[] => [
  chip('side:name', 348, 70, name, { sans: true, size: 16, tone }),
  ...(hint ? [chip('side:hint', 348, 112, hint, { sans: true, size: 14 })] : []),
  ...(extra ? [chip('side:extra', 348, 154, extra.text, { sans: true, size: 14, tone: extra.tone })] : []),
];

const MAZE_STORY: Record<'intro' | 'marks' | 'dfs' | 'bfs' | 'short', T> = {
  intro: t(
    'Algo is in a maze! Plain squares are rooms and brick squares are walls. Can Algo reach the star?',
    'Algo 走进了一座迷宫！空白方格是房间，砖块方格是墙。Algo 能走到星星那儿吗？',
    'Algo 走進了一座迷宮！空白方格是房間，磚塊方格是牆。Algo 能走到星星那裡嗎？',
    'Algo が迷路に入っちゃった！なにもない四角はへや、レンガの四角はかべ。星までたどりつけるかな？',
    'Algo в лабиринте! Пустые клетки — комнаты, кирпичные — стены. Сможет ли Algo дойти до звезды?',
  ),
  marks: t(
    'Rule one: leave a mark in every room you visit. Then you never walk around in circles.',
    '第一条规则：每走进一个房间，就做个记号。这样就不会绕圈子了。',
    '第一條規則：每走進一個房間，就做個記號。這樣就不會繞圈圈了。',
    'ルール 1：入ったへやには、しるしをつける。そうすれば、同じところをぐるぐる回らないよ。',
    'Правило первое: отмечай каждую пройденную комнату. Тогда не будешь ходить по кругу.',
  ),
  dfs: t(
    'Way one: follow one path as far as it goes. At a dead end, walk back to the last fork and try another way.',
    '方法一：沿着一条路一直走。走到死胡同，就退回上一个岔路口，换条路试试。',
    '方法一：沿著一條路一直走。走到死路，就退回上一個岔路口，換條路試試。',
    'やり方 1：ひとつの道を行けるところまで進む。行き止まりなら、さっきの分かれ道までもどって、別の道をためす。',
    'Способ первый: иди по одной дороге до конца. В тупике вернись к последней развилке и попробуй другой путь.',
  ),
  bfs: t(
    'Way two: spread out like ripples in a pond. First every room 1 step away, then 2 steps, then 3, and so on.',
    '方法二：像池塘里的水波一样一圈圈散开。先走离起点 1 步的房间，再走 2 步的，然后 3 步……',
    '方法二：像池塘裡的水波一樣一圈圈散開。先走離起點 1 步的房間，再走 2 步的，然後 3 步……',
    'やり方 2：池の波のように広がっていく。まず 1 歩でいけるへや、つぎに 2 歩、そのつぎに 3 歩…と調べるよ。',
    'Способ второй: расходись, как круги на воде. Сначала все комнаты в 1 шаге, потом в 2 шагах, потом в 3…',
  ),
  short: t(
    'The ripples reach the star after 7 steps, so that is the shortest way out. Map apps find routes like this!',
    '水波走了 7 步碰到星星，所以这就是最短的出路。地图软件也是这样找路线的！',
    '水波走了 7 步碰到星星，所以這就是最短的出路。地圖 App 也是這樣找路線的！',
    '波は 7 歩で星にとどいた。だから、これがいちばん近い出口への道。地図アプリもこうやって道をさがすよ！',
    'Круги доходят до звезды за 7 шагов — это самый короткий путь. Так ищут дорогу приложения с картами!',
  ),
};

const MAZE_PRACTICE: Record<'start' | 'grow' | 'askFork' | 'six' | 'askStar' | 'found' | 'askDead', T> = {
  start: t(
    "Let's make ripples! The start room gets 0. The room 1 step away gets 1.",
    '我们来画水波吧！起点房间写 0，离它 1 步的房间写 1。',
    '我們來畫水波吧！起點房間寫 0，離它 1 步的房間寫 1。',
    '波を広げてみよう！スタートのへやは 0。そこから 1 歩のへやは 1。',
    'Пустим круги! В стартовой комнате пишем 0, в соседней — 1.',
  ),
  grow: t(
    'The ripple keeps going: 2, 3, 4. The room with 4 is a fork, where two new ways open up.',
    '水波继续往外走：2、3、4。写着 4 的房间是个岔路口，这里有两条新路。',
    '水波繼續往外走：2、3、4。寫著 4 的房間是個岔路口，這裡有兩條新路。',
    '波はどんどん進む：2、3、4。4 のへやは分かれ道。ここから新しい道が 2 つあるよ。',
    'Круги идут дальше: 2, 3, 4. Комната с 4 — развилка: отсюда два новых пути.',
  ),
  askFork: t(
    "What number do the two '?' rooms next to the 4 get?",
    '4 旁边的两个“?”房间该写几？',
    '4 旁邊的兩個「?」房間該寫幾？',
    '4 のとなりの「?」のへや 2 つには、何を書く？',
    'Какое число получат две комнаты «?» рядом с 4?',
  ),
  six: t(
    'Both got 5. The ripple goes on, and the next rooms get 6.',
    '两个都写 5。水波继续走，下一批房间写 6。',
    '兩個都寫 5。水波繼續走，下一批房間寫 6。',
    'どちらも 5 になった。波はさらに進んで、つぎのへやは 6。',
    'Обе получили 5. Круги идут дальше, и следующие комнаты получают 6.',
  ),
  askStar: t(
    "The star room now shows '?'. What number will it get?",
    '星星所在的房间现在标着“?”。它会写几？',
    '星星所在的房間現在標著「?」。它會寫幾？',
    '星のへやは、いま「?」になっている。何が入る？',
    'Комната со звездой теперь помечена «?». Какое число она получит?',
  ),
  found: t(
    'The star got 7. Follow the numbers down, 7, 6, 5… back to 0, and you have the shortest path!',
    '星星是 7。顺着数字往回走：7、6、5……一直到 0，就是最短的路！',
    '星星是 7。順著數字往回走：7、6、5……一直到 0，就是最短的路！',
    '星は 7。数字を 7、6、5…と 0 まで逆にたどれば、いちばん短い道になるよ！',
    'У звезды 7. Иди по числам вниз — 7, 6, 5… до 0, — и получится самый короткий путь!',
  ),
  askDead: t(
    'Now depth-first: Algo goes left at the fork and walks into a dead end. What next?',
    '现在试试深度优先：Algo 在岔路口往左走，走进了死胡同。接下来怎么办？',
    '現在試試深度優先：Algo 在岔路口往左走，走進了死路。接下來怎麼辦？',
    'こんどは深さ優先。Algo は分かれ道で左へ行って、行き止まりに着いた。つぎはどうする？',
    'Теперь в глубину: на развилке Algo сворачивает налево и попадает в тупик. Что дальше?',
  ),
};

const MAZE_EXPLAIN: Record<'fork' | 'star' | 'dead', T> = {
  fork: t(
    'They are one step further than the 4, so both get 5.',
    '它们比 4 多走一步，所以都写 5。',
    '它們比 4 多走一步，所以都寫 5。',
    '4 より 1 歩遠いから、どちらも 5。',
    'Они на шаг дальше, чем 4, поэтому обе получают 5.',
  ),
  star: t(
    'The star is right next to a 6, so it is 6 + 1 = 7 steps away.',
    '星星就在 6 的旁边，所以离起点 6 + 1 = 7 步。',
    '星星就在 6 的旁邊，所以離起點 6 + 1 = 7 步。',
    '星は 6 のすぐとなり。だから 6 + 1 = 7 歩。',
    'Звезда рядом с 6, значит, до неё 6 + 1 = 7 шагов.',
  ),
  dead: t(
    'Walk back to the last fork and try a way not tried yet. That is how depth-first works.',
    '退回最近的岔路口，试一条还没走过的路。深度优先就是这样走的。',
    '退回最近的岔路口，試一條還沒走過的路。深度優先就是這樣走的。',
    'いちばん近い分かれ道までもどって、まだ行っていない道をためす。それが深さ優先だよ。',
    'Нужно вернуться к последней развилке и попробовать путь, где ещё не ходили. Так и работает обход в глубину.',
  ),
};

const MAZE_CHOICE: Record<'back' | 'wall' | 'stay', T> = {
  back: t('Go back to the fork and try the other way', '退回岔路口，走另一条路', '退回岔路口，走另一條路', '分かれ道までもどって、別の道へ', 'Вернуться к развилке и пойти другим путём'),
  wall: t('Break through the wall', '把墙打穿', '把牆打穿', 'かべをこわす', 'Пробить стену'),
  stay: t('Stay there forever', '永远待在那里', '永遠待在那裡', 'ずっとそこにいる', 'Остаться там навсегда'),
};

const MAZE_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t(
    "The ripple numbers so far are 0, 1, 2. What goes in the '?' room?",
    '水波已经写到 0、1、2。“?”房间该写几？',
    '水波已經寫到 0、1、2。「?」房間該寫幾？',
    '波の数字は 0、1、2 まで書けた。「?」のへやには何が入る？',
    'Круги уже дошли до 0, 1, 2. Что написать в комнате «?»?',
  ),
  q1e: t('It is one more step past the 2, so it gets 3.', '它比 2 再多走一步，所以写 3。', '它比 2 再多走一步，所以寫 3。', '2 から、もう 1 歩先だから 3。', 'Она на шаг дальше двойки, поэтому 3.'),
  q2: t('Why does Algo mark every room it visits?', 'Algo 为什么要给走过的每个房间做记号？', 'Algo 為什麼要給走過的每個房間做記號？', 'Algo が入ったへやにしるしをつけるのはなぜ？', 'Зачем Algo отмечает каждую пройденную комнату?'),
  q2a: t('So it never walks in circles', '这样就不会绕圈子', '這樣就不會繞圈圈', 'ぐるぐる回らないため', 'Чтобы не ходить по кругу'),
  q2b: t('To make the maze pretty', '让迷宫更好看', '讓迷宮更好看', '迷路をかわいくするため', 'Чтобы лабиринт был красивее'),
  q2c: t('To walk through walls', '为了穿过墙', '為了穿過牆', 'かべを通りぬけるため', 'Чтобы проходить сквозь стены'),
  q2e: t(
    'With marks, Algo knows which rooms are done and never checks a room twice.',
    '有了记号，Algo 就知道哪些房间走过了，不会重复去看。',
    '有了記號，Algo 就知道哪些房間走過了，不會重複去看。',
    'しるしがあれば、もう調べたへやがわかるから、同じへやを 2 回調べないよ。',
    'По отметкам видно, какие комнаты уже проверены, и ни одна не проверяется дважды.',
  ),
  q3: t('Which way finds the shortest way out?', '哪种方法能找到最短的出路？', '哪種方法能找到最短的出路？', 'いちばん短い出口への道を見つけるのはどれ？', 'Какой способ находит самый короткий выход?'),
  q3a: t('Ripples (breadth-first)', '水波（广度优先）', '水波（廣度優先）', '波（幅優先）', 'Круги на воде (в ширину)'),
  q3b: t('One path at a time (depth-first)', '一条路走到底（深度优先）', '一條路走到底（深度優先）', '一本道（深さ優先）', 'По одной тропе (в глубину)'),
  q3c: t('Guessing', '随便猜', '隨便猜', 'あてずっぽう', 'Наугад'),
  q3e: t(
    'Ripples check every room 1 step away, then 2 steps, and so on. The first time they touch the exit is the shortest way.',
    '水波先查完 1 步远的房间，再查 2 步远的……第一次碰到出口时，走的就是最短的路。',
    '水波先查完 1 步遠的房間，再查 2 步遠的……第一次碰到出口時，走的就是最短的路。',
    '波は 1 歩のへやを全部、つぎに 2 歩のへやを全部調べる。はじめて出口にとどいた道が、いちばん短いよ。',
    'Круги проверяют все комнаты в 1 шаге, потом в 2 и так далее. Первое касание выхода — это самый короткий путь.',
  ),
};

const mazeLesson: LessonContent = {
  story(l): StorySlide[] {
    const S = MAZE_STORY;
    const M = MAZE_WORD;
    return [
      { scene: maze({ at: START, side: mazeLegend(l) }), say: S.intro[l] },
      { scene: maze({ at: FORK, seen: LEFT_TRY.slice(0, 4), side: sideChips(M.seen[l], undefined, 'ok') }), say: S.marks[l] },
      {
        scene: maze({ at: DEAD_END, trail: LEFT_TRY, stuck: DEAD_END, back: FORK, side: sideChips(M.dfs[l], M.dfsHint[l], 'accent', { text: M.backToFork[l], tone: 'warn' }) }),
        say: S.dfs[l],
      },
      { scene: maze({ nums: 4, side: sideChips(M.bfs[l], M.bfsHint[l]) }), say: S.bfs[l] },
      { scene: maze({ nums: 8, path: SHORTEST, side: sideChips(STEPS[l](7), undefined, 'ok') }), say: S.short[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = MAZE_PRACTICE;
    const E = MAZE_EXPLAIN;
    const C = MAZE_CHOICE;
    const bfs = sideChips(MAZE_WORD.bfs[l], MAZE_WORD.bfsHint[l]);
    return [
      { scene: maze({ nums: 1, side: bfs }), say: P.start[l] },
      { scene: maze({ nums: 4, side: bfs }), say: P.grow[l] },
      {
        scene: maze({ nums: 4, qs: [[2, 1], [2, 3]], side: bfs }),
        say: P.askFork[l],
        ask: ask(P.askFork[l], [4, 5, 6], 5, E.fork[l]),
      },
      { scene: maze({ nums: 6, side: bfs }), say: P.six[l] },
      { scene: maze({ nums: 6, qs: [EXIT], side: bfs }), say: P.askStar[l], ask: ask(P.askStar[l], [6, 7, 8], 7, E.star[l]) },
      { scene: maze({ nums: 8, path: SHORTEST, side: sideChips(STEPS[l](7), undefined, 'ok') }), say: P.found[l] },
      {
        scene: maze({ at: DEAD_END, trail: LEFT_TRY, stuck: DEAD_END, side: sideChips(MAZE_WORD.dfs[l], undefined, 'accent', { text: MAZE_WORD.deadEnd[l], tone: 'danger' }) }),
        say: P.askDead[l],
        ask: pick(
          P.askDead[l],
          [
            ['back', C.back[l]],
            ['wall', C.wall[l]],
            ['stay', C.stay[l]],
          ],
          'back',
          E.dead[l],
        ),
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = MAZE_QUIZ;
    return [
      { ...ask(Q.q1[l], [2, 3, 4], 3, Q.q1e[l]), scene: maze({ nums: 2, qs: [[1, 2]] }) },
      pick(
        Q.q2[l],
        [
          ['circles', Q.q2a[l]],
          ['pretty', Q.q2b[l]],
          ['walls', Q.q2c[l]],
        ],
        'circles',
        Q.q2e[l],
      ),
      pick(
        Q.q3[l],
        [
          ['bfs', Q.q3a[l]],
          ['dfs', Q.q3b[l]],
          ['guess', Q.q3c[l]],
        ],
        'bfs',
        Q.q3e[l],
      ),
    ];
  },
};

// ── Greedy: grab the biggest coin ─────────────────────────────────────

const COIN_TONE: Record<number, Tone> = { 20: 'warn', 10: 'info', 5: 'ok', 4: 'warn', 3: 'info', 2: 'danger', 1: 'accent' };
const COIN_R = 26;

const coin = (id: string, cx: number, cy: number, value: number, opts: Partial<BoxNode> = {}) =>
  box(id, cx - COIN_R, cy - COIN_R, String(value), { w: COIN_R * 2, h: COIN_R * 2, shape: 'circle', size: 18, tone: COIN_TONE[value] ?? 'idle', ...opts });

const GREEDY_WORD: Record<'bank' | 'given' | 'done' | 'greedy' | 'best', T> = {
  bank: t("Algo's coins", 'Algo 的硬币', 'Algo 的硬幣', 'Algo のコイン', 'Монеты Algo'),
  given: t('Coins handed over', '拿出的硬币', '拿出的硬幣', 'わたしたコイン', 'Отданные монеты'),
  done: t('Done!', '完成！', '完成！', 'できた！', 'Готово!'),
  greedy: t('Greedy', '贪心', '貪婪', '貪欲法', 'Жадно'),
  best: t('Best', '最好', '最好', 'いちばん少ない', 'Лучше всего'),
};

const GOAL: F = {
  en: (n) => `Goal: ${n}`,
  zh: (n) => `目标：${n}`,
  'zh-hant': (n) => `目標：${n}`,
  ja: (n) => `目標：${n}`,
  ru: (n) => `Цель: ${n}`,
};
const LEFT: F = {
  en: (n) => `Left: ${n}`,
  zh: (n) => `还差 ${n}`,
  'zh-hant': (n) => `還差 ${n}`,
  ja: (n) => `のこり ${n}`,
  ru: (n) => `Осталось: ${n}`,
};
const COINS: F = {
  en: (n) => `${n} ${n === 1 ? 'coin' : 'coins'}`,
  zh: (n) => `${n} 枚硬币`,
  'zh-hant': (n) => `${n} 枚硬幣`,
  ja: (n) => `${n} まい`,
  ru: (n) => `${n} ${ruPlural(n, 'монета', 'монеты', 'монет')}`,
};

/** Algo's coins at the top, the goal on the right, and the coins handed over so far below. */
function coins(l: Locale, o: { kinds: number[]; goal: number; given: number[]; hot?: number; tooBig?: number[] }): Scene {
  const left = o.goal - o.given.reduce((a, b) => a + b, 0);
  const cy = 72;
  const kx = (k: number) => 46 + k * 66;
  const nodes: SceneNode[] = [
    { kind: 'region', id: 'bank', x: 12, y: 8, w: 272, h: 104, tone: 'soft', label: GREEDY_WORD.bank[l], labelAt: 'inside' },
    { kind: 'region', id: 'tray', x: 12, y: 126, w: 416, h: 124, tone: 'idle', label: GREEDY_WORD.given[l], labelAt: 'inside' },
  ];
  o.kinds.forEach((v, k) => {
    nodes.push(coin(`k${v}`, kx(k), cy + 6, v, { ring: o.hot === v, dim: o.tooBig?.includes(v) }));
  });
  nodes.push(chip('goal', 362, 22, GOAL[l](o.goal), { sans: true, size: 17, tone: 'accent' }));
  nodes.push(
    left === 0
      ? chip('left', 362, 66, GREEDY_WORD.done[l], { sans: true, size: 17, tone: 'ok' })
      : chip('left', 362, 66, LEFT[l](left), { sans: true, size: 17, tone: 'warn' }),
  );
  const gx = (k: number) => 48 + k * 74;
  const gy = 196;
  o.given.forEach((v, k) => {
    nodes.push(coin(`g${k}`, gx(k), gy, v));
    if (k > 0) nodes.push(text(`plus${k}`, gx(k) - 37, gy + 7, '+', { anchor: 'middle', size: 20, bold: true, tone: 'muted' }));
  });
  if (o.given.length) {
    nodes.push(text('sum', gx(o.given.length - 1) + 38, gy + 7, `= ${o.goal - left}`, { size: 20, bold: true, tone: left === 0 ? 'ok' : 'idle' }));
  }
  if (o.hot !== undefined) {
    const k = o.kinds.indexOf(o.hot);
    if (k >= 0) {
      const slot = gx(o.given.length);
      nodes.push(
        coin('slot', slot, gy, o.hot, { tone: 'ghost', dashed: true }),
        arrow('grab', [kx(k), cy + 6 + COIN_R + 4], [slot, gy - COIN_R - 6], { tone: 'accent', width: 3 }),
      );
    }
  }
  return { w: W, h: H, nodes };
}

/** Coins 4, 3, 1 and the goal 6: greedy uses three coins, the best way only two. */
function greedyFails(l: Locale): Scene {
  const W2 = GREEDY_WORD;
  const nodes: SceneNode[] = [chip('goal', 220, 6, `${GOAL[l](6)}  ·  4, 3, 1`, { sans: true, size: 16, tone: 'accent' })];
  const rows: { id: string; label: string; tone: Tone; values: number[]; y: number }[] = [
    { id: 'greedy', label: W2.greedy[l], tone: 'warn', values: [4, 1, 1], y: 46 },
    { id: 'best', label: W2.best[l], tone: 'ok', values: [3, 3], y: 152 },
  ];
  for (const r of rows) {
    nodes.push({ kind: 'region', id: r.id, x: 12, y: r.y, w: 416, h: 96, tone: r.tone, label: r.label, labelAt: 'inside' });
    r.values.forEach((v, k) => {
      const cx = 60 + k * 70;
      nodes.push(coin(`${r.id}${k}`, cx, r.y + 56, v, { w: 44, h: 44, x: cx - 22, y: r.y + 34 }));
      if (k > 0) nodes.push(text(`${r.id}+${k}`, cx - 35, r.y + 63, '+', { anchor: 'middle', size: 20, bold: true, tone: 'muted' }));
    });
    nodes.push(chip(`${r.id}:n`, 350, r.y + 42, COINS[l](r.values.length), { sans: true, size: 16, tone: r.tone }));
  }
  return { w: W, h: H, nodes };
}

const GREEDY_STORY: Record<'intro' | 'idea' | 'first' | 'done' | 'shop' | 'fail', T> = {
  intro: t(
    'Algo runs a shop and must give back 31 in change. The coins are 20, 10, 5 and 1. Use as few coins as possible!',
    'Algo 开了一家小店，要给客人找零 31。硬币有 20、10、5 和 1。用的硬币越少越好！',
    'Algo 開了一家小店，要給客人找零 31。硬幣有 20、10、5 和 1。用的硬幣越少越好！',
    'Algo のお店で、おつりを 31 わたしたい。コインは 20、10、5、1。できるだけ少ないまい数でわたそう！',
    'У Algo магазинчик, и нужно дать сдачу 31. Есть монеты 20, 10, 5 и 1. Монет должно быть как можно меньше!',
  ),
  idea: t(
    'The greedy trick: always grab the biggest coin that still fits. No planning ahead, just the best choice right now.',
    '贪心的诀窍：每次都拿还放得下的最大硬币。不用想以后，只挑眼前最好的。',
    '貪婪的訣竅：每次都拿還放得下的最大硬幣。不用想以後，只挑眼前最好的。',
    '貪欲法のコツ：いつも、入るなかでいちばん大きいコインを取る。先のことは考えず、今いちばんよいものをえらぶよ。',
    'Жадный приём: всегда бери самую большую монету, которая ещё помещается. Не думай наперёд — выбирай лучшее прямо сейчас.',
  ),
  first: t(
    'For 31, the biggest coin that fits is 20. Take it, and 11 is left.',
    '31 里放得下的最大硬币是 20。拿走它，还差 11。',
    '31 裡放得下的最大硬幣是 20。拿走它，還差 11。',
    '31 に入るいちばん大きいコインは 20。それを取ると、のこりは 11。',
    'Для 31 самая большая подходящая монета — 20. Берём её, остаётся 11.',
  ),
  done: t(
    'For 11, take 10. For the last 1, take 1. Done: 20 + 10 + 1, only 3 coins!',
    '11 就拿 10，最后的 1 就拿 1。搞定：20 + 10 + 1，只用 3 枚硬币！',
    '11 就拿 10，最後的 1 就拿 1。搞定：20 + 10 + 1，只用 3 枚硬幣！',
    '11 には 10、のこりの 1 には 1。できた！20 + 10 + 1 で、たった 3 まい！',
    'Для 11 берём 10, для последней единицы — 1. Готово: 20 + 10 + 1, всего 3 монеты!',
  ),
  shop: t(
    'Greedy is quick: 26 is just 20 + 5 + 1. Cashiers give change this way every day, and real coins are picked so that it always works.',
    '贪心很快：26 就是 20 + 5 + 1。收银员每天都这样找零，真正的硬币面值也正好让贪心总能成功。',
    '貪婪很快：26 就是 20 + 5 + 1。店員每天都這樣找零，真正的硬幣面額也剛好讓貪婪總是成功。',
    '貪欲法は速い。26 なら 20 + 5 + 1 ですぐ決まる。レジの人も毎日この方法でおつりを出すよ。本物のコインは、これでうまくいくように決められているんだ。',
    'Жадный способ быстрый: 26 — это просто 20 + 5 + 1. Кассиры дают сдачу именно так, а настоящие монеты подобраны так, чтобы он всегда работал.',
  ),
  fail: t(
    'Careful! With coins 4, 3 and 1, greedy pays 6 as 4 + 1 + 1. But 3 + 3 needs only 2 coins.',
    '小心！如果硬币是 4、3 和 1，贪心付 6 会用 4 + 1 + 1。可是 3 + 3 只要 2 枚。',
    '小心！如果硬幣是 4、3 和 1，貪婪付 6 會用 4 + 1 + 1。可是 3 + 3 只要 2 枚。',
    '気をつけて！コインが 4、3、1 だと、貪欲法は 6 を 4 + 1 + 1 にする。でも 3 + 3 なら 2 まいですむよ。',
    'Осторожно! С монетами 4, 3 и 1 жадный способ платит 6 как 4 + 1 + 1. А 3 + 3 — это всего 2 монеты.',
  ),
};

const GREEDY_PRACTICE: Record<'start' | 'askFirst' | 'took10' | 'askNext' | 'took5' | 'askLast' | 'done', T> = {
  start: t(
    'Your turn! Now Algo must pay 17 with coins 10, 5, 2 and 1.',
    '轮到你了！现在 Algo 要用 10、5、2、1 的硬币凑出 17。',
    '換你了！現在 Algo 要用 10、5、2、1 的硬幣湊出 17。',
    'きみの番！こんどは 10、5、2、1 のコインで 17 をはらうよ。',
    'Твоя очередь! Теперь Algo нужно набрать 17 монетами 10, 5, 2 и 1.',
  ),
  askFirst: t('Which coin does greedy grab first?', '贪心先拿哪一枚？', '貪婪先拿哪一枚？', '貪欲法が最初に取るコインはどれ？', 'Какую монету жадный способ возьмёт первой?'),
  took10: t('Take 10. Now 7 is left.', '拿 10，还差 7。', '拿 10，還差 7。', '10 を取ったよ。のこりは 7。', 'Берём 10. Остаётся 7.'),
  askNext: t('7 is left. Which coin comes next?', '还差 7。下一枚拿哪个？', '還差 7。下一枚拿哪個？', 'のこりは 7。つぎに取るのは？', 'Осталось 7. Какая монета следующая?'),
  took5: t('Take 5. Now 2 is left.', '拿 5，还差 2。', '拿 5，還差 2。', '5 を取ったよ。のこりは 2。', 'Берём 5. Остаётся 2.'),
  askLast: t('2 is left. Which coin does greedy take now?', '还差 2。贪心这次拿哪一枚？', '還差 2。貪婪這次拿哪一枚？', 'のこりは 2。貪欲法はこんどどれを取る？', 'Осталось 2. Какую монету жадный способ возьмёт теперь?'),
  done: t(
    '10 + 5 + 2 = 17: just 3 coins. Greedy never had to look ahead!',
    '10 + 5 + 2 = 17，只用 3 枚。贪心一步也不用往后想！',
    '10 + 5 + 2 = 17，只用 3 枚。貪婪一步也不用往後想！',
    '10 + 5 + 2 = 17。たった 3 まい！貪欲法は、先のことを考えなくてよかったね！',
    '10 + 5 + 2 = 17 — всего 3 монеты. И ни разу не пришлось думать наперёд!',
  ),
};

const GREEDY_EXPLAIN: Record<'first' | 'next' | 'last', T> = {
  first: t('10 is the biggest coin that fits in 17.', '10 是 17 里放得下的最大硬币。', '10 是 17 裡放得下的最大硬幣。', '10 は、17 に入るいちばん大きいコインだから。', '10 — самая большая монета, которая помещается в 17.'),
  next: t(
    '10 is too big for 7, so the biggest coin that fits is 5.',
    '10 比 7 大，放不下，所以放得下的最大硬币是 5。',
    '10 比 7 大，放不下，所以放得下的最大硬幣是 5。',
    '10 は 7 より大きくて入らない。だから入るなかでいちばん大きいのは 5。',
    '10 больше 7 и не помещается, поэтому самая большая подходящая — 5.',
  ),
  last: t(
    '5 is too big for 2, and a 2 fits exactly. A 1 would leave 1 more to pay.',
    '5 比 2 大，放不下；2 刚好放得下。拿 1 的话还差 1。',
    '5 比 2 大，放不下；2 剛好放得下。拿 1 的話還差 1。',
    '5 は 2 より大きくて入らない。2 ならぴったり。1 だと、まだ 1 のこるよ。',
    '5 больше 2 и не помещается, а 2 подходит точно. С монетой 1 осталось бы ещё 1.',
  ),
};

const GREEDY_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'Pay 15 with coins 10, 5 and 1. Which coins does greedy take?',
    '用 10、5、1 的硬币付 15，贪心会拿哪些？',
    '用 10、5、1 的硬幣付 15，貪婪會拿哪些？',
    '10、5、1 のコインで 15 をはらうと、貪欲法はどれを取る？',
    'Нужно 15, есть монеты 10, 5 и 1. Какие возьмёт жадный способ?',
  ),
  q1e: t(
    'Greedy takes 10 first, and then a 5 fits the 5 that is left.',
    '贪心先拿 10，剩下的 5 正好用一枚 5。',
    '貪婪先拿 10，剩下的 5 剛好用一枚 5。',
    'まず 10、のこりの 5 には 5 がぴったり。',
    'Сначала 10, а на оставшиеся 5 как раз есть монета 5.',
  ),
  q2: t('What does a greedy algorithm do at each step?', '贪心算法每一步都做什么？', '貪婪演算法每一步都做什麼？', '貪欲法は、毎回なにをする？', 'Что делает жадный алгоритм на каждом шаге?'),
  q2a: t('Takes what looks best right now', '拿眼前看起来最好的', '拿眼前看起來最好的', '今いちばんよさそうなものを取る', 'Берёт то, что лучше всего прямо сейчас'),
  q2b: t('Tries every possible way', '把所有办法都试一遍', '把所有辦法都試一遍', 'すべてのやり方をためす', 'Пробует все способы'),
  q2c: t('Goes back to change old choices', '回头改掉以前的选择', '回頭改掉以前的選擇', 'もどって前の選択を変える', 'Возвращается и меняет прошлые решения'),
  q2e: t(
    'Greedy picks the best-looking choice right now and never changes it later.',
    '贪心每一步都挑眼前最好的，以后也不会改。',
    '貪婪每一步都挑眼前最好的，之後也不會改。',
    '貪欲法は、そのときいちばんよさそうなものをえらび、あとで変えないよ。',
    'Жадный алгоритм выбирает лучшее на этот момент и потом не передумывает.',
  ),
  q3: t(
    'With coins 4, 3 and 1, what is the fewest number of coins that make 6?',
    '硬币有 4、3、1，凑出 6 最少要几枚？',
    '硬幣有 4、3、1，湊出 6 最少要幾枚？',
    'コインが 4、3、1 のとき、6 を作るいちばん少ないまい数は？',
    'Есть монеты 4, 3 и 1. Каким наименьшим числом монет набрать 6?',
  ),
  q3e: t(
    '3 + 3 = 6 uses 2 coins. Greedy grabs 4 first and needs 3, so greedy is not always best.',
    '3 + 3 = 6，只要 2 枚。贪心先拿 4，要用 3 枚，所以贪心不一定最好。',
    '3 + 3 = 6，只要 2 枚。貪婪先拿 4，要用 3 枚，所以貪婪不一定最好。',
    '3 + 3 = 6 で 2 まい。貪欲法は先に 4 を取って 3 まいになるから、いつもいちばんとはかぎらないよ。',
    '3 + 3 = 6 — это 2 монеты. Жадный способ сначала берёт 4 и тратит 3 монеты, так что он не всегда лучший.',
  ),
};

const BIG = [20, 10, 5, 1];
const SMALL = [10, 5, 2, 1];

const greedy: LessonContent = {
  story(l): StorySlide[] {
    const S = GREEDY_STORY;
    return [
      { scene: coins(l, { kinds: BIG, goal: 31, given: [] }), say: S.intro[l] },
      { scene: coins(l, { kinds: BIG, goal: 31, given: [], hot: 20 }), say: S.idea[l] },
      { scene: coins(l, { kinds: BIG, goal: 31, given: [20] }), say: S.first[l] },
      { scene: coins(l, { kinds: BIG, goal: 31, given: [20, 10, 1] }), say: S.done[l] },
      { scene: coins(l, { kinds: BIG, goal: 26, given: [20, 5, 1] }), say: S.shop[l] },
      { scene: greedyFails(l), say: S.fail[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = GREEDY_PRACTICE;
    const E = GREEDY_EXPLAIN;
    return [
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [] }), say: P.start[l] },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [] }), say: P.askFirst[l], ask: ask(P.askFirst[l], [10, 5, 2, 1], 10, E.first[l]) },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [10] }), say: P.took10[l] },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [10], tooBig: [10] }), say: P.askNext[l], ask: ask(P.askNext[l], [10, 5, 2], 5, E.next[l]) },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [10, 5], tooBig: [10] }), say: P.took5[l] },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [10, 5], tooBig: [10, 5] }), say: P.askLast[l], ask: ask(P.askLast[l], [5, 2, 1], 2, E.last[l]) },
      { scene: coins(l, { kinds: SMALL, goal: 17, given: [10, 5, 2] }), say: P.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = GREEDY_QUIZ;
    return [
      {
        ...pick(
          Q.q1[l],
          [
            ['10+5', '10 + 5'],
            ['5+5+5', '5 + 5 + 5'],
            ['10+1x5', '10 + 1 + 1 + 1 + 1 + 1'],
          ],
          '10+5',
          Q.q1e[l],
        ),
        scene: coins(l, { kinds: [10, 5, 1], goal: 15, given: [] }),
      },
      pick(
        Q.q2[l],
        [
          ['now', Q.q2a[l]],
          ['all', Q.q2b[l]],
          ['back', Q.q2c[l]],
        ],
        'now',
        Q.q2e[l],
      ),
      { ...ask(Q.q3[l], [2, 3, 4], 2, Q.q3e[l]), scene: coins(l, { kinds: [4, 3, 1], goal: 6, given: [] }) },
    ];
  },
};

// ── Backtracking: coloring a map ──────────────────────────────────────

type Crayon = 'r' | 'g' | 'b';
const CRAYONS: Crayon[] = ['r', 'g', 'b'];
const CRAYON_TONE: Record<Crayon, Tone> = { r: 'danger', g: 'ok', b: 'info' };

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Countries are boxes that share edges where they touch; the lake touches only the countries above it. */
interface MapLayout {
  countries: Record<string, Rect>;
  lake: Rect;
}

/** A, B and C all touch each other, and the lake touches only C. */
const MAP3: MapLayout = {
  countries: {
    A: { x: 20, y: 40, w: 140, h: 80 },
    B: { x: 160, y: 40, w: 140, h: 80 },
    C: { x: 20, y: 120, w: 280, h: 70 },
  },
  lake: { x: 90, y: 190, w: 140, h: 44 },
};

/** A–B, B–C, B–D and C–D touch; the lake touches only D. */
const MAP4: MapLayout = {
  countries: {
    A: { x: 20, y: 40, w: 90, h: 90 },
    B: { x: 110, y: 40, w: 95, h: 90 },
    C: { x: 205, y: 40, w: 95, h: 90 },
    D: { x: 130, y: 130, w: 170, h: 60 },
  },
  lake: { x: 160, y: 190, w: 110, h: 44 },
};

const MAP_WORD: Record<Crayon | 'lake' | 'order' | 'stuck' | 'back' | 'solved', T> = {
  r: t('red', '红色', '紅色', '赤', 'красный'),
  g: t('green', '绿色', '綠色', '緑', 'зелёный'),
  b: t('blue', '蓝色', '藍色', '青', 'синий'),
  lake: t('lake', '湖', '湖', '湖', 'озеро'),
  order: t('Try in order', '按顺序试', '照順序試', 'この順にためす', 'Пробуем по порядку'),
  stuck: t('Dead end!', '走不通！', '走不通！', '行き止まり！', 'Тупик!'),
  back: t('← step back', '← 退一步', '← 退一步', '← 1 つもどる', '← шаг назад'),
  solved: t('Solved!', '完成！', '完成！', 'できた！', 'Готово!'),
};

interface MapView {
  paint: Partial<Record<string, Crayon>>;
  /** The country Algo is working on. */
  hot?: string;
  /** A country where no crayon works. */
  stuck?: string;
  /** Crayon being tried, ringed in the box. */
  trying?: Crayon;
  /** Dashed arrow from the stuck country back to the one that changes. */
  back?: [string, string];
  note?: 'stuck' | 'back' | 'solved';
}

function mapScene(l: Locale, lay: MapLayout, o: MapView): Scene {
  // Countries are filled outlines (drawn under arrows), so the step-back arrow shows on top of them.
  const nodes: SceneNode[] = [];
  for (const [id, r] of Object.entries(lay.countries)) {
    const color = o.paint[id];
    const isStuck = o.stuck === id;
    const hot = o.hot === id;
    nodes.push({
      kind: 'path',
      id: `c${id}`,
      d: `M ${r.x} ${r.y} L ${r.x + r.w} ${r.y} L ${r.x + r.w} ${r.y + r.h} L ${r.x} ${r.y + r.h} Z`,
      fill: true,
      tone: color ? CRAYON_TONE[color] : hot ? 'soft' : 'ghost',
      // A painted country's letter takes its crayon's color too, so colors read well in the dark theme.
      text: isStuck ? seg(`${id} `, ['✗', 'danger', true]) : color ? seg([id, CRAYON_TONE[color], true]) : id,
      textAt: [r.x + r.w / 2, r.y + r.h / 2],
      size: 22,
      width: hot || isStuck ? 3.5 : 2.5,
      // Not painted yet: a dashed outline.
      dashed: !color,
    });
  }
  nodes.push(box('lake', lay.lake.x, lay.lake.y, MAP_WORD.lake[l], { w: lay.lake.w, h: lay.lake.h, shape: 'chip', sans: true, size: 16, tone: 'info' }));
  if (o.back) {
    const a = center(lay.countries[o.back[0]]);
    const b = center(lay.countries[o.back[1]]);
    nodes.push(arrow('backArrow', [a.x + 14, a.y + 6], [b.x + 14, b.y + 12], { bend: 24, dashed: true, tone: 'warn', width: 3 }));
  }
  // The crayon box: tried top to bottom.
  nodes.push(text('order', 374, 42, MAP_WORD.order[l], { anchor: 'middle', size: 14, bold: true, tone: 'muted' }));
  CRAYONS.forEach((c, k) => {
    nodes.push(box(`crayon-${c}`, 322, 56 + k * 42, MAP_WORD[c][l], { w: 104, h: 32, shape: 'chip', sans: true, size: 15, tone: CRAYON_TONE[c], ring: o.trying === c }));
  });
  if (o.note) {
    const tone: Tone = o.note === 'stuck' ? 'danger' : o.note === 'back' ? 'warn' : 'ok';
    nodes.push(chip('note', 374, 200, MAP_WORD[o.note][l], { sans: true, size: 16, tone }));
  }
  return { w: W, h: H, nodes };
}

const LOOP_WORD: Record<'try' | 'fits' | 'stuck', T> = {
  try: t('Try a choice', '试一个选择', '試一個選擇', 'ためしてみる', 'Пробуем вариант'),
  fits: t('Fits? Go on', '行得通？继续', '行得通？繼續', 'OK なら先へ', 'Подходит? Дальше'),
  stuck: t('Stuck? Step back', '走不通？退一步', '走不通？退一步', 'だめなら もどる', 'Тупик? Назад'),
};

/** The backtracking loop: try, then go on or step back. */
function loopScene(l: Locale): Scene {
  const tryC = chip('loop:try', 220, 30, LOOP_WORD.try[l], { sans: true, size: 17, tone: 'accent' });
  const stuck = chip('loop:stuck', 110, 172, LOOP_WORD.stuck[l], { sans: true, size: 17, tone: 'warn' });
  const fits = chip('loop:fits', 330, 172, LOOP_WORD.fits[l], { sans: true, size: 17, tone: 'ok' });
  const midY = (c: BoxNode) => c.y + c.h / 2;
  return {
    w: W,
    h: H,
    nodes: [
      tryC,
      fits,
      stuck,
      link('loop:a1', tryC, fits, { tone: 'ok', width: 2.5 }),
      link('loop:a2', tryC, stuck, { tone: 'warn', width: 2.5 }),
      // Both ends lead back to the next try, along the outside.
      arrow('loop:back', [stuck.x - 3, midY(stuck)], [tryC.x - 5, midY(tryC)], { tone: 'warn', width: 2.5, dashed: true, bend: -30 }),
      arrow('loop:next', [fits.x + fits.w + 3, midY(fits)], [tryC.x + tryC.w + 5, midY(tryC)], { tone: 'ok', width: 2.5, dashed: true, bend: 30 }),
    ],
  };
}

const BACK_STORY: Record<'intro' | 'two' | 'stuck' | 'back' | 'solved' | 'use', T> = {
  intro: t(
    'Algo is coloring a map with 3 crayons. Countries that touch must get different colors. The lake is already blue.',
    'Algo 要用 3 支蜡笔给地图涂色。挨着的国家颜色必须不一样。湖已经是蓝色的了。',
    'Algo 要用 3 支蠟筆幫地圖塗色。相鄰的國家顏色必須不一樣。湖已經是藍色的了。',
    'Algo は 3 本のクレヨンで地図に色をぬるよ。となり合う国は、ちがう色にしないといけない。湖はもう青い。',
    'Algo раскрашивает карту тремя карандашами. Соседние страны должны быть разного цвета. Озеро уже синее.',
  ),
  two: t(
    'Algo tries the crayons in order: red, green, blue. A gets red. B touches A, so B gets green.',
    'Algo 按顺序试蜡笔：红、绿、蓝。A 涂红色。B 挨着 A，所以 B 涂绿色。',
    'Algo 照順序試蠟筆：紅、綠、藍。A 塗紅色。B 和 A 相鄰，所以 B 塗綠色。',
    'クレヨンは赤、緑、青の順にためす。A は赤。B は A のとなりだから緑。',
    'Algo пробует карандаши по порядку: красный, зелёный, синий. A — красная. B касается A, поэтому B — зелёная.',
  ),
  stuck: t(
    'C touches red A, green B and the blue lake. No crayon works. Dead end!',
    'C 挨着红色的 A、绿色的 B 和蓝色的湖。哪支蜡笔都不行。走不通了！',
    'C 和紅色的 A、綠色的 B、藍色的湖都相鄰。哪支蠟筆都不行。走不通了！',
    'C は赤の A、緑の B、青い湖のとなり。どのクレヨンもだめ。行き止まり！',
    'C касается красной A, зелёной B и синего озера. Ни один карандаш не подходит. Тупик!',
  ),
  back: t(
    'So Algo steps back and changes the last choice. B tries the next crayon: blue.',
    '于是 Algo 退回一步，改掉上一个选择：B 换下一支蜡笔，蓝色。',
    '於是 Algo 退回一步，改掉上一個選擇：B 換下一支蠟筆，藍色。',
    'だから Algo は 1 つもどって、前のえらび方を変える。B はつぎのクレヨン、青にする。',
    'Тогда Algo делает шаг назад и меняет прошлый выбор: B берёт следующий карандаш — синий.',
  ),
  solved: t(
    'Now C can be green. Solved! Try a choice, and when you get stuck, step back and try another. That is backtracking.',
    '现在 C 可以涂绿色了。完成！先试一试，走不通就退一步换一个——这就是回溯。',
    '現在 C 可以塗綠色了。完成！先試一試，走不通就退一步換一個——這就是回溯。',
    'これで C は緑にできる。できた！ためしてみて、だめならもどって別のをためす。これがバックトラックだよ。',
    'Теперь C может быть зелёной. Готово! Пробуй вариант, а в тупике возвращайся и бери другой. Это и есть перебор с возвратом.',
  ),
  use: t(
    'Sudoku solvers and puzzle games work this way: put in a number, and take it back when it breaks a rule.',
    '解数独的程序和很多益智游戏都这样做：填一个数，违反规则就擦掉重来。',
    '解數獨的程式和很多益智遊戲都這樣做：填一個數字，違反規則就擦掉重來。',
    '数独を解くプログラムやパズルゲームも、こうしているよ。数字を入れて、ルールに合わなければ消すんだ。',
    'Так решают судоку и другие головоломки: ставят число, а если оно нарушает правило, убирают.',
  ),
};

const BACK_PRACTICE: Record<'start' | 'two' | 'askC' | 'cRed' | 'askD' | 'askBack' | 'solved', T> = {
  start: t(
    'A new map with 4 countries. Same rule, same crayon order: red, green, blue.',
    '一张新地图，有 4 个国家。规则一样，蜡笔顺序也一样：红、绿、蓝。',
    '一張新地圖，有 4 個國家。規則一樣，蠟筆順序也一樣：紅、綠、藍。',
    '新しい地図。国は 4 つ。ルールもクレヨンの順番も同じ：赤、緑、青。',
    'Новая карта, в ней 4 страны. Правило то же, порядок тот же: красный, зелёный, синий.',
  ),
  two: t('A gets red. B touches A, so B gets green.', 'A 涂红色。B 挨着 A，所以涂绿色。', 'A 塗紅色。B 和 A 相鄰，所以塗綠色。', 'A は赤。B は A のとなりだから緑。', 'A — красная. B касается A, поэтому B — зелёная.'),
  askC: t(
    'C touches B and D, but D has no color yet. Which crayon does C get?',
    'C 挨着 B 和 D，不过 D 还没涂色。C 会涂哪种颜色？',
    'C 和 B、D 相鄰，不過 D 還沒塗色。C 會塗哪種顏色？',
    'C のとなりは B と D。でも D はまだ色がない。C は何色になる？',
    'C касается B и D, но D ещё не раскрашена. Какой цвет получит C?',
  ),
  cRed: t('C is red. Now it is D’s turn.', 'C 是红色。现在轮到 D 了。', 'C 是紅色。現在輪到 D 了。', 'C は赤。つぎは D の番。', 'C — красная. Теперь очередь D.'),
  askD: t(
    'D touches green B, red C and the blue lake. What happens?',
    'D 挨着绿色的 B、红色的 C 和蓝色的湖。会怎样？',
    'D 和綠色的 B、紅色的 C、藍色的湖都相鄰。會怎樣？',
    'D は緑の B、赤の C、青い湖のとなり。どうなる？',
    'D касается зелёной B, красной C и синего озера. Что будет?',
  ),
  askBack: t(
    'Algo steps back to C. Red led to a dead end, and green touches B. Which crayon is left for C?',
    'Algo 退回到 C。红色走不通，绿色挨着 B。C 还能用哪支？',
    'Algo 退回到 C。紅色走不通，綠色和 B 相鄰。C 還能用哪支？',
    'Algo は C までもどる。赤は行き止まりになったし、緑は B のとなり。C にのこっているクレヨンは？',
    'Algo возвращается к C. Красный привёл в тупик, а зелёный касается B. Какой карандаш остался для C?',
  ),
  solved: t(
    'With C blue, D can be red. Solved! One step back saved the whole map.',
    'C 涂蓝色后，D 就能涂红色了。完成！退一步，整张地图就涂好了。',
    'C 塗藍色後，D 就能塗紅色了。完成！退一步，整張地圖就塗好了。',
    'C を青にしたら、D は赤にできた。完成！1 つもどっただけで、地図がぜんぶぬれたね。',
    'Когда C синяя, D может стать красной. Готово! Один шаг назад — и вся карта раскрашена.',
  ),
};

const BACK_EXPLAIN: Record<'c' | 'd' | 'back', T> = {
  c: t(
    'C does not touch red A, so the first crayon, red, is fine.',
    'C 不挨着红色的 A，所以第一支蜡笔红色就可以。',
    'C 不和紅色的 A 相鄰，所以第一支蠟筆紅色就可以。',
    'C は赤の A のとなりじゃないから、最初のクレヨンの赤で OK。',
    'C не касается красной A, поэтому подходит первый карандаш — красный.',
  ),
  d: t(
    'Red, green and blue are all next to D, so Algo is stuck.',
    '红、绿、蓝都在 D 旁边，Algo 被卡住了。',
    '紅、綠、藍都在 D 旁邊，Algo 被卡住了。',
    '赤も緑も青も D のとなりにあるから、Algo は先に進めない。',
    'Красный, зелёный и синий — все рядом с D, дальше хода нет.',
  ),
  back: t('Blue! C does not touch the lake, so blue is allowed.', '蓝色！C 不挨着湖，所以可以涂蓝色。', '藍色！C 不和湖相鄰，所以可以塗藍色。', '青！C は湖のとなりじゃないから、青にできる。', 'Синий! C не касается озера, так что синий можно.'),
};

const BACK_CHOICE: Record<'stuck' | 'dRed' | 'dGreen', T> = {
  stuck: t('Dead end: no crayon works', '走不通：哪支都不行', '走不通：哪支都不行', '行き止まり：どれもだめ', 'Тупик: ни один не подходит'),
  dRed: t('D gets red', 'D 涂红色', 'D 塗紅色', 'D は赤', 'D будет красной'),
  dGreen: t('D gets green', 'D 涂绿色', 'D 塗綠色', 'D は緑', 'D будет зелёной'),
};

const BACK_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('What does Algo do at a dead end?', 'Algo 走不通的时候会怎么做？', 'Algo 走不通的時候會怎麼做？', '行き止まりのとき、Algo はどうする？', 'Что делает Algo в тупике?'),
  q1a: t('Step back and try another choice', '退一步，换一个选择', '退一步，換一個選擇', '1 つもどって別のをためす', 'Шаг назад и другой вариант'),
  q1b: t('Erase everything and start over', '全部擦掉，从头再来', '全部擦掉，從頭再來', 'ぜんぶ消して最初から', 'Стирает всё и начинает заново'),
  q1c: t('Give up: there is no answer', '放弃：没有答案', '放棄：沒有答案', 'あきらめる：答えはない', 'Сдаётся: ответа нет'),
  q1e: t(
    'Only the last choice changes. Everything that worked stays.',
    '只改最后那个选择，前面没问题的都留着。',
    '只改最後那個選擇，前面沒問題的都留著。',
    '変えるのは最後のえらび方だけ。うまくいっていた所はそのままだよ。',
    'Меняется только последний выбор, всё удачное остаётся.',
  ),
  q2: t('A is red, and B touches A. Which crayon can B NOT use?', 'A 是红色，B 挨着 A。B 不能用哪支蜡笔？', 'A 是紅色，B 和 A 相鄰。B 不能用哪支蠟筆？', 'A は赤。B は A のとなり。B に使えないクレヨンは？', 'A — красная, B касается A. Какой карандаш нельзя взять для B?'),
  q2e: t(
    'Countries that touch must be different, so B cannot be red like A.',
    '挨着的国家颜色要不同，所以 B 不能和 A 一样是红色。',
    '相鄰的國家顏色要不同，所以 B 不能和 A 一樣是紅色。',
    'となりの国はちがう色だから、B は A と同じ赤にはできない。',
    'Соседи должны быть разного цвета, поэтому B не может быть красной, как A.',
  ),
  q3: t('Which puzzle is a good job for backtracking?', '下面哪件事适合用回溯来做？', '下面哪件事適合用回溯來做？', 'バックトラックが役に立つのはどれ？', 'Для чего подходит перебор с возвратом?'),
  q3a: t('Filling in a Sudoku', '填数独', '填數獨', '数独をとく', 'Решать судоку'),
  q3b: t('Counting to 10', '从 1 数到 10', '從 1 數到 10', '10 まで数える', 'Считать до 10'),
  q3c: t('Reading a story', '读一个故事', '讀一個故事', 'お話を読む', 'Читать сказку'),
  q3e: t(
    'In Sudoku you try a number, and if it breaks a rule, you take it back and try another.',
    '填数独时先试一个数，违反规则就擦掉换一个。',
    '填數獨時先試一個數字，違反規則就擦掉換一個。',
    '数独では数字を入れてみて、ルールに合わなければ消して別の数字をためすよ。',
    'В судоку ставишь число, а если оно нарушает правило, убираешь и пробуешь другое.',
  ),
};

const crayonChoices = (l: Locale, list: Crayon[]): [string, string][] => list.map((c) => [c, MAP_WORD[c][l]]);

const backtracking: LessonContent = {
  story(l): StorySlide[] {
    const S = BACK_STORY;
    return [
      { scene: mapScene(l, MAP3, { paint: {} }), say: S.intro[l] },
      { scene: mapScene(l, MAP3, { paint: { A: 'r', B: 'g' }, hot: 'B', trying: 'g' }), say: S.two[l] },
      { scene: mapScene(l, MAP3, { paint: { A: 'r', B: 'g' }, stuck: 'C', note: 'stuck' }), say: S.stuck[l] },
      { scene: mapScene(l, MAP3, { paint: { A: 'r', B: 'b' }, hot: 'B', trying: 'b', back: ['C', 'B'], note: 'back' }), say: S.back[l] },
      { scene: mapScene(l, MAP3, { paint: { A: 'r', B: 'b', C: 'g' }, note: 'solved' }), say: S.solved[l] },
      { scene: loopScene(l), say: S.use[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = BACK_PRACTICE;
    const E = BACK_EXPLAIN;
    const C = BACK_CHOICE;
    return [
      { scene: mapScene(l, MAP4, { paint: {} }), say: P.start[l] },
      { scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g' } }), say: P.two[l] },
      { scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g' }, hot: 'C' }), say: P.askC[l], ask: pick(P.askC[l], crayonChoices(l, CRAYONS), 'r', E.c[l]) },
      { scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g', C: 'r' }, hot: 'D' }), say: P.cRed[l] },
      {
        scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g', C: 'r' }, hot: 'D' }),
        say: P.askD[l],
        ask: pick(
          P.askD[l],
          [
            ['stuck', C.stuck[l]],
            ['red', C.dRed[l]],
            ['green', C.dGreen[l]],
          ],
          'stuck',
          E.d[l],
        ),
      },
      {
        scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g' }, hot: 'C', stuck: 'D', back: ['D', 'C'], note: 'back' }),
        say: P.askBack[l],
        ask: pick(P.askBack[l], crayonChoices(l, ['g', 'b']), 'b', E.back[l]),
      },
      { scene: mapScene(l, MAP4, { paint: { A: 'r', B: 'g', C: 'b', D: 'r' }, note: 'solved' }), say: P.solved[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = BACK_QUIZ;
    return [
      pick(
        Q.q1[l],
        [
          ['back', Q.q1a[l]],
          ['restart', Q.q1b[l]],
          ['quit', Q.q1c[l]],
        ],
        'back',
        Q.q1e[l],
      ),
      { ...pick(Q.q2[l], crayonChoices(l, CRAYONS), 'r', Q.q2e[l]), scene: mapScene(l, MAP3, { paint: { A: 'r' }, hot: 'B' }) },
      pick(
        Q.q3[l],
        [
          ['sudoku', Q.q3a[l]],
          ['count', Q.q3b[l]],
          ['read', Q.q3c[l]],
        ],
        'sudoku',
        Q.q3e[l],
      ),
    ];
  },
};

// ── Dynamic programming: climbing stairs ──────────────────────────────

/** Ways to climb n stairs taking 1 or 2 steps at a time. */
const WAYS = [1, 1, 2, 3, 5, 8, 13];
const STAIRS = 5;
const SX = 58;
const SW = 42;
const SH = 34;
const GROUND = 230;

const stepBox = (k: number) => ({ x: SX + (k - 1) * SW, y: GROUND - k * SH, w: SW, h: k * SH });
/** Where Algo stands on step k (0 is the floor). */
const standAt = (k: number): [number, number] => (k === 0 ? [30, GROUND - 15] : [SX + (k - 1) * SW + SW / 2, GROUND - k * SH - 15]);

const DP_WORD: Record<'notebook' | 'remember', T> = {
  notebook: t('steps → ways', '台阶 → 走法', '階梯 → 走法', 'だん → 行き方', 'ступени → способы'),
  remember: t('remember, then reuse', '记下来，再用上', '記下來，再用上', 'おぼえて、また使う', 'запомни и используй снова'),
};

interface StairsView {
  algo?: number;
  /** Answers written in the notebook so far. */
  known: number;
  /** A notebook row showing '?'. */
  ask?: number;
  /** Steps the last move can start from, with arrows to `target`. */
  from?: number[];
  target?: number;
  /** Arrows for a 1-step and a 2-step move from the floor. */
  hops?: boolean;
  hot?: number;
}

function stairs(l: Locale, o: StairsView): Scene {
  const nodes: SceneNode[] = [{ kind: 'path', id: 'ground', d: `M 6 ${GROUND} L ${SX + STAIRS * SW + 6} ${GROUND}`, tone: 'idle', width: 3 }];
  for (let k = 1; k <= STAIRS; k++) {
    const b = stepBox(k);
    const tone: Tone = o.target === k ? 'accent' : o.from?.includes(k) ? 'info' : 'idle';
    nodes.push(box(`step${k}`, b.x, b.y, '', { ...b, tone, ring: o.target === k }));
    nodes.push(text(`step${k}:n`, b.x + SW / 2, b.y + 24, String(k), { anchor: 'middle', size: 17, bold: true, tone: tone === 'idle' ? 'muted' : tone }));
  }
  const top = (k: number): [number, number] => [SX + (k - 1) * SW + SW / 2, GROUND - k * SH - 4];
  if (o.hops) {
    nodes.push(
      arrow('hop1', [36, GROUND - 32], top(1), { bend: -12, tone: 'ok', width: 2.5 }),
      arrow('hop2', [26, GROUND - 34], top(2), { bend: -24, tone: 'warn', width: 2.5, dashed: true }),
      text('hop1:t', 60, GROUND - 58, '+1', { anchor: 'middle', size: 15, bold: true, tone: 'ok' }),
      text('hop2:t', 52, GROUND - 104, '+2', { anchor: 'middle', size: 15, bold: true, tone: 'warn' }),
    );
  }
  if (o.target && o.from) {
    for (const f of o.from) {
      nodes.push(arrow(`from${f}`, top(f), top(o.target), { bend: o.target - f === 2 ? -26 : -14, tone: 'accent', width: 2.5 }));
    }
  }
  if (o.algo !== undefined) {
    const [cx, cy] = standAt(o.algo);
    nodes.push(box('algo', cx - 13, cy - 13, '', { w: 26, h: 26, shape: 'circle', tone: 'accent', ring: true }));
  }
  // The notebook: one row per staircase size.
  nodes.push({ kind: 'region', id: 'notebook', x: 286, y: 22, w: 146, h: 226, tone: 'soft', label: DP_WORD.notebook[l], labelAt: 'inside' });
  for (let k = 1; k <= STAIRS; k++) {
    const y = 56 + (k - 1) * 38;
    const known = k <= o.known;
    const asking = o.ask === k;
    nodes.push(box(`nb${k}.k`, 300, y, String(k), { w: 50, h: 32, size: 16, tone: known || asking ? 'info' : 'ghost', dashed: !known && !asking }));
    nodes.push(text(`nb${k}.arrow`, 359, y + 21, '→', { anchor: 'middle', size: 15, tone: 'muted' }));
    nodes.push(
      box(`nb${k}.v`, 368, y, known ? String(WAYS[k]) : asking ? '?' : '', {
        w: 50,
        h: 32,
        size: 16,
        tone: asking ? 'accent' : known ? 'ok' : 'ghost',
        dashed: !known,
        ring: asking || o.hot === k,
      }),
    );
  }
  return { w: W, h: H, nodes };
}

/** The answers in a row, each one the sum of the two before it. */
function chain(l: Locale, opts: { last?: '?' } = {}): Scene {
  const cw = 56;
  const gap = 22;
  const x0 = (W - (5 * cw + 4 * gap)) / 2;
  const y = 92;
  const nodes: SceneNode[] = [];
  for (let k = 1; k <= 5; k++) {
    const x = x0 + (k - 1) * (cw + gap);
    const isQ = k === 5 && opts.last === '?';
    nodes.push(text(`ch${k}:n`, x + cw / 2, y - 14, String(k), { anchor: 'middle', size: 14, bold: true, tone: 'muted' }));
    nodes.push(box(`ch${k}`, x, y, isQ ? '?' : String(WAYS[k]), { w: cw, h: cw, size: 22, tone: isQ ? 'accent' : k >= 3 ? 'ok' : 'info', ring: isQ, dashed: isQ }));
    if (k >= 3 && !isQ) {
      nodes.push(text(`ch${k}:sum`, x + cw / 2, y + cw + 26, `${WAYS[k - 1]} + ${WAYS[k - 2]}`, { anchor: 'middle', size: 15, bold: true, tone: 'muted' }));
    }
    if (k >= 2) nodes.push(arrow(`ch${k}:a`, [x - gap + 3, y + cw / 2], [x - 3, y + cw / 2], { tone: 'muted', width: 2 }));
  }
  nodes.push(chip('remember', W / 2, 214, DP_WORD.remember[l], { sans: true, size: 16, tone: 'accent' }));
  return { w: W, h: H, nodes };
}

const DP_STORY: Record<'climb' | 'count' | 'small' | 'three' | 'notebook' | 'name', T> = {
  climb: t(
    'Algo wants to climb 5 stairs. Each move goes up 1 step or 2 steps.',
    'Algo 想爬上 5 级台阶。每次可以上 1 级，也可以上 2 级。',
    'Algo 想爬上 5 階樓梯。每次可以上 1 階，也可以上 2 階。',
    'Algo は 5 だんの階段をのぼりたい。1 回で 1 だんか 2 だん進めるよ。',
    'Algo хочет подняться на 5 ступенек. За один шаг можно пройти 1 ступеньку или 2.',
  ),
  count: t(
    "How many different ways lead to the top? Counting every path one by one takes ages. Let's start small.",
    '走到顶上有多少种不同的走法？一条一条数太慢了。我们从小的开始。',
    '走到頂端有多少種不同的走法？一條一條數太慢了。我們從小的開始。',
    '上まで行く行き方は何通り？ひとつずつ数えると時間がかかる。小さいところから始めよう。',
    'Сколько разных способов добраться до верха? Пересчитывать каждый путь — долго. Начнём с малого.',
  ),
  small: t(
    'Small stairs are easy. 1 step: only 1 way. 2 steps: 2 ways, 1 + 1 or one big 2.',
    '小台阶很简单。1 级：只有 1 种走法。2 级：2 种，1 + 1 或者一下跨 2 级。',
    '小樓梯很簡單。1 階：只有 1 種走法。2 階：2 種，1 + 1 或者一次跨 2 階。',
    '小さい階段はかんたん。1 だんなら 1 通り。2 だんなら 1 + 1 か、いっきに 2 の 2 通り。',
    'С маленькими лестницами просто. 1 ступенька — 1 способ. 2 ступеньки — 2 способа: 1 + 1 или сразу 2.',
  ),
  three: t(
    'To reach step 3, the last move starts on step 2 or on step 1. So step 3 has 2 + 1 = 3 ways.',
    '想到第 3 级，最后一步要么从第 2 级上来，要么从第 1 级上来。所以有 2 + 1 = 3 种。',
    '想到第 3 階，最後一步不是從第 2 階上來，就是從第 1 階上來。所以有 2 + 1 = 3 種。',
    '3 だん目に着く最後の 1 歩は、2 だん目か 1 だん目から。だから 2 + 1 = 3 通り。',
    'На 3-ю ступеньку последний шаг делается со 2-й или с 1-й. Значит, способов 2 + 1 = 3.',
  ),
  notebook: t(
    'Algo writes each answer in a notebook and reuses it. Step 4: 3 + 2 = 5. Step 5: 5 + 3 = 8.',
    'Algo 把每个答案记在本子上，再拿来用。第 4 级：3 + 2 = 5。第 5 级：5 + 3 = 8。',
    'Algo 把每個答案記在本子上，再拿來用。第 4 階：3 + 2 = 5。第 5 階：5 + 3 = 8。',
    'Algo は答えをノートに書いておいて、また使う。4 だん：3 + 2 = 5。5 だん：5 + 3 = 8。',
    'Algo записывает каждый ответ в блокнот и использует снова. 4 ступеньки: 3 + 2 = 5. 5 ступенек: 5 + 3 = 8.',
  ),
  name: t(
    'Remembering small answers to build big ones is called dynamic programming. Map apps and games use it to plan fast.',
    '记住小问题的答案，用来算大问题，这叫动态规划。地图软件和游戏都用它来快速计算。',
    '記住小問題的答案，用來算大問題，這叫動態規劃。地圖 App 和遊戲都用它來快速計算。',
    '小さい答えをおぼえておいて大きい答えを作る。これを動的計画法というよ。地図アプリやゲームでも使われているんだ。',
    'Запоминать маленькие ответы, чтобы собрать из них большие, — это динамическое программирование. Им пользуются карты и игры.',
  ),
};

const DP_PRACTICE: Record<'start' | 'ask4' | 'wrote4' | 'ask5' | 'top' | 'ask6', T> = {
  start: t(
    "Algo's notebook already has the answers for 1, 2 and 3 steps: 1, 2 and 3.",
    'Algo 的本子上已经写好了 1、2、3 级台阶的答案：1、2、3。',
    'Algo 的本子上已經寫好了 1、2、3 階的答案：1、2、3。',
    'Algo のノートには、1、2、3 だんの答え 1、2、3 がもう書いてある。',
    'В блокноте Algo уже есть ответы для 1, 2 и 3 ступенек: 1, 2 и 3.',
  ),
  ask4: t('How many ways lead to step 4?', '到第 4 级有几种走法？', '到第 4 階有幾種走法？', '4 だん目までの行き方は何通り？', 'Сколько способов дойти до 4-й ступеньки?'),
  wrote4: t(
    'Write 5 in the notebook. No need to count all those paths again!',
    '在本子上写下 5。不用再把所有走法数一遍！',
    '在本子上寫下 5。不用再把所有走法數一遍！',
    'ノートに 5 と書く。道を全部数えなおさなくていいね！',
    'Записываем 5 в блокнот. Пересчитывать все пути заново не нужно!',
  ),
  ask5: t('Now 5 steps. How many ways?', '现在是 5 级。有几种走法？', '現在是 5 階。有幾種走法？', 'こんどは 5 だん。何通り？', 'Теперь 5 ступенек. Сколько способов?'),
  top: t(
    '8 ways to the top! Each new answer is just the two before it added up.',
    '到顶有 8 种走法！每个新答案都是前两个答案的和。',
    '到頂端有 8 種走法！每個新答案都是前兩個答案的和。',
    '上までは 8 通り！新しい答えは、前の 2 つを足すだけ。',
    'До верха 8 способов! Каждый новый ответ — сумма двух предыдущих.',
  ),
  ask6: t(
    'If the stairs had 6 steps, which two answers would Algo add?',
    '如果有 6 级台阶，Algo 要把哪两个答案加起来？',
    '如果有 6 階，Algo 要把哪兩個答案加起來？',
    'もし階段が 6 だんなら、Algo はどの 2 つを足す？',
    'Если ступенек 6, какие два ответа нужно сложить?',
  ),
};

const DP_EXPLAIN: Record<'four' | 'five' | 'six', T> = {
  four: t(
    'The last move starts on step 3 (3 ways) or step 2 (2 ways): 3 + 2 = 5.',
    '最后一步从第 3 级（3 种）或第 2 级（2 种）上来：3 + 2 = 5。',
    '最後一步從第 3 階（3 種）或第 2 階（2 種）上來：3 + 2 = 5。',
    '最後の 1 歩は 3 だん目（3 通り）か 2 だん目（2 通り）から。3 + 2 = 5。',
    'Последний шаг — с 3-й (3 способа) или со 2-й (2 способа): 3 + 2 = 5.',
  ),
  five: t('Add the two answers before it: 5 + 3 = 8.', '把前两个答案加起来：5 + 3 = 8。', '把前兩個答案加起來：5 + 3 = 8。', 'その前の 2 つの答えを足す：5 + 3 = 8。', 'Складываем два предыдущих ответа: 5 + 3 = 8.'),
  six: t(
    'The last move starts on step 5 or step 4: 8 + 5 = 13 ways.',
    '最后一步从第 5 级或第 4 级上来：8 + 5 = 13 种。',
    '最後一步從第 5 階或第 4 階上來：8 + 5 = 13 種。',
    '最後の 1 歩は 5 だん目か 4 だん目から。8 + 5 = 13 通り。',
    'Последний шаг — с 5-й или с 4-й ступеньки: 8 + 5 = 13 способов.',
  ),
};

const DP_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('What is the big trick of dynamic programming?', '动态规划最大的诀窍是什么？', '動態規劃最大的訣竅是什麼？', '動的計画法のいちばんのコツは？', 'В чём главный приём динамического программирования?'),
  q1a: t('Write down small answers and reuse them', '记下小问题的答案，再拿来用', '記下小問題的答案，再拿來用', '小さい答えを書いておいて、また使う', 'Записывать маленькие ответы и использовать их снова'),
  q1b: t('Guess quickly', '快快地猜', '快快地猜', 'すばやくあてずっぽう', 'Быстро угадывать'),
  q1c: t('Always take the biggest step', '每次都迈最大的一步', '每次都跨最大的一步', 'いつもいちばん大きく進む', 'Всегда делать самый большой шаг'),
  q1e: t(
    'Saved answers mean Algo never works out the same thing twice.',
    '把答案存起来，Algo 就不用把同一件事算两遍。',
    '把答案存起來，Algo 就不用把同一件事算兩遍。',
    '答えをとっておけば、同じ計算を 2 回しなくてすむよ。',
    'Ответы сохранены, и одно и то же не приходится считать дважды.',
  ),
  q2: t('What comes next: 1, 2, 3, 5, …?', '接下来是几：1、2、3、5、……？', '接下來是幾：1、2、3、5、……？', 'つぎの数は？ 1、2、3、5、…', 'Какое число дальше: 1, 2, 3, 5, …?'),
  q2e: t('Each number is the sum of the two before it: 3 + 5 = 8.', '每个数都是前两个数的和：3 + 5 = 8。', '每個數都是前兩個數的和：3 + 5 = 8。', 'どの数も、前の 2 つを足した数。3 + 5 = 8。', 'Каждое число — сумма двух предыдущих: 3 + 5 = 8.'),
  q3: t(
    'To reach step 3, where can the last move start?',
    '要到第 3 级，最后一步可以从哪儿出发？',
    '要到第 3 階，最後一步可以從哪裡出發？',
    '3 だん目に着くとき、最後の 1 歩はどこから？',
    'Откуда может начаться последний шаг на 3-ю ступеньку?',
  ),
  q3a: t('Step 1 or step 2', '第 1 级或第 2 级', '第 1 階或第 2 階', '1 だん目か 2 だん目', 'С 1-й или со 2-й ступеньки'),
  q3b: t('Only step 2', '只能从第 2 级', '只能從第 2 階', '2 だん目だけ', 'Только со 2-й'),
  q3c: t('Only the floor', '只能从地面', '只能從地面', '地面だけ', 'Только с пола'),
  q3e: t(
    'A 1-step move starts on step 2, and a 2-step move starts on step 1.',
    '迈 1 级就从第 2 级出发，迈 2 级就从第 1 级出发。',
    '跨 1 階就從第 2 階出發，跨 2 階就從第 1 階出發。',
    '1 だん進むなら 2 だん目から、2 だん進むなら 1 だん目からだよ。',
    'Шаг на 1 начинается со 2-й ступеньки, а шаг на 2 — с 1-й.',
  ),
};

const dynamicProgramming: LessonContent = {
  story(l): StorySlide[] {
    const S = DP_STORY;
    return [
      { scene: stairs(l, { algo: 0, known: 0, hops: true }), say: S.climb[l] },
      { scene: stairs(l, { algo: 0, known: 0, ask: 5 }), say: S.count[l] },
      { scene: stairs(l, { algo: 2, known: 2, hot: 2 }), say: S.small[l] },
      { scene: stairs(l, { known: 3, from: [1, 2], target: 3, hot: 3 }), say: S.three[l] },
      { scene: stairs(l, { algo: 5, known: 5, hot: 5 }), say: S.notebook[l] },
      { scene: chain(l), say: S.name[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = DP_PRACTICE;
    const E = DP_EXPLAIN;
    return [
      { scene: stairs(l, { algo: 3, known: 3 }), say: P.start[l] },
      { scene: stairs(l, { known: 3, ask: 4, from: [2, 3], target: 4 }), say: P.ask4[l], ask: ask(P.ask4[l], [4, 5, 6], 5, E.four[l]) },
      { scene: stairs(l, { algo: 4, known: 4, hot: 4 }), say: P.wrote4[l] },
      { scene: stairs(l, { known: 4, ask: 5, from: [3, 4], target: 5 }), say: P.ask5[l], ask: ask(P.ask5[l], [7, 8, 10], 8, E.five[l]) },
      { scene: stairs(l, { algo: 5, known: 5, hot: 5 }), say: P.top[l] },
      {
        scene: stairs(l, { algo: 5, known: 5 }),
        say: P.ask6[l],
        ask: pick(
          P.ask6[l],
          [
            ['8+5', '8 + 5'],
            ['8+1', '8 + 1'],
            ['5+3', '5 + 3'],
          ],
          '8+5',
          E.six[l],
        ),
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = DP_QUIZ;
    return [
      pick(
        Q.q1[l],
        [
          ['remember', Q.q1a[l]],
          ['guess', Q.q1b[l]],
          ['biggest', Q.q1c[l]],
        ],
        'remember',
        Q.q1e[l],
      ),
      // Not 7: a child could read 1, 2, 3, 5, 7 as the prime numbers.
      { ...ask(Q.q2[l], [6, 8, 10], 8, Q.q2e[l]), scene: chain(l, { last: '?' }) },
      {
        ...pick(
          Q.q3[l],
          [
            ['both', Q.q3a[l]],
            ['two', Q.q3b[l]],
            ['floor', Q.q3c[l]],
          ],
          'both',
          Q.q3e[l],
        ),
        scene: stairs(l, { known: 2, target: 3 }),
      },
    ];
  },
};

// ── Divide and conquer: the Tower of Hanoi ────────────────────────────

const ROD_X = [80, 220, 360];
const ROD = ['A', 'B', 'C'];
const BASE_Y = 196;
const DISK_H = 26;
const DISK_TONES: Tone[] = ['accent', 'info', 'warn'];
const diskW = (k: number) => 36 + k * 26;
const diskTop = (level: number) => BASE_Y - (level + 1) * DISK_H;

const DISKS: F = {
  en: (n) => `${n} ${n === 1 ? 'disk' : 'disks'}`,
  zh: (n) => `${n} 个圆盘`,
  'zh-hant': (n) => `${n} 個圓盤`,
  ja: (n) => `円盤 ${n} まい`,
  ru: (n) => `${n} ${ruPlural(n, 'диск', 'диска', 'дисков')}`,
};
const MOVES: F = {
  en: (n) => `Moves: ${n}`,
  zh: (n) => `步数：${n}`,
  'zh-hant': (n) => `步數：${n}`,
  ja: (n) => `動かした回数：${n}`,
  ru: (n) => `Ходов: ${n}`,
};

interface HanoiView {
  /** Disk sizes on each rod, bottom up (1 is the smallest). */
  rods: number[][];
  /** A dashed arc for the move just made: from rod, to rod, and how many disks moved. */
  arc?: [number, number, number];
  hot?: number;
  moves?: number;
}

function hanoi(l: Locale, o: HanoiView): Scene {
  const nodes: SceneNode[] = [];
  ROD_X.forEach((cx, r) => {
    nodes.push(
      arrow(`rod${r}`, [cx, BASE_Y], [cx, BASE_Y - 128], { head: 'none', width: 6, tone: 'muted' }),
      arrow(`base${r}`, [cx - 60, BASE_Y + 4], [cx + 60, BASE_Y + 4], { head: 'none', width: 8, tone: 'muted' }),
      text(`L${r}`, cx, BASE_Y + 34, ROD[r], { anchor: 'middle', size: 18, bold: true }),
    );
  });
  o.rods.forEach((rod, r) =>
    rod.forEach((k, j) => {
      const w = diskW(k);
      nodes.push(box(`d${k}`, ROD_X[r] - w / 2, diskTop(j) + 1, String(k), { w, h: DISK_H - 2, shape: 'chip', size: 14, tone: DISK_TONES[k - 1], ring: o.hot === k }));
    }),
  );
  if (o.arc) {
    const [from, to, count] = o.arc;
    const x1 = ROD_X[from];
    const x2 = ROD_X[to];
    const y1 = diskTop(o.rods[from].length) + DISK_H - 6;
    const y2 = diskTop(o.rods[to].length - 1) - 6;
    const dx = x2 - x1;
    nodes.push(arrow('arc', [x1, Math.min(y1, BASE_Y - 30)], [x2, y2], { bend: -Math.sign(dx) * Math.abs(dx) * 0.24, dashed: true, tone: 'accent', width: 2.5 }));
    if (count > 1) {
      nodes.push(chip('arc:n', (x1 + x2) / 2, Math.min(y1, y2) - Math.abs(dx) * 0.24 - 30, DISKS[l](count), { sans: true, size: 14, tone: 'accent' }));
    }
  }
  if (o.moves !== undefined) nodes.push(chip('count', 8, 6, MOVES[l](o.moves), { align: 'start', sans: true, size: 15, tone: 'ok' }));
  return { w: W, h: H, nodes };
}

/** The 3-disk job splits into "2 disks, 1 disk, 2 disks", and each 2-disk job splits again. */
function splitTree(l: Locale): Scene {
  const root = chip('t:root', 220, 14, DISKS[l](3), { sans: true, size: 17, tone: 'accent' });
  const kids = [
    chip('t:k0', 80, 104, DISKS[l](2), { sans: true, size: 16, tone: 'info' }),
    chip('t:k1', 220, 104, DISKS[l](1), { sans: true, size: 16, tone: 'warn' }),
    chip('t:k2', 360, 104, DISKS[l](2), { sans: true, size: 16, tone: 'info' }),
  ];
  const nodes: SceneNode[] = [root, ...kids];
  kids.forEach((k, i) => nodes.push(link(`t:e${i}`, root, k, { width: 2, tone: 'muted' })));
  [0, 2].forEach((p) => {
    const parent = kids[p];
    const cx = center(parent).x;
    [-40, 0, 40].forEach((dx, j) => {
      const leaf = box(`t:l${p}-${j}`, cx + dx - 17, 192, '1', { w: 34, h: 34, shape: 'circle', size: 15, tone: 'warn' });
      nodes.push(leaf, link(`t:le${p}-${j}`, parent, leaf, { width: 1.75, tone: 'muted', head: 'none' }));
    });
  });
  return { w: W, h: H, nodes };
}

const HANOI_STORY: Record<'intro' | 'rules' | 'split' | 'big' | 'last' | 'name', T> = {
  intro: t(
    'This is the Tower of Hanoi. Algo must move the whole tower from rod A to rod C.',
    '这是汉诺塔。Algo 要把整座塔从 A 柱搬到 C 柱。',
    '這是河內塔。Algo 要把整座塔從 A 柱搬到 C 柱。',
    'これはハノイの塔。Algo は塔をまるごと、A の棒から C の棒へうつしたい。',
    'Это Ханойская башня. Algo нужно перенести всю башню со стержня A на стержень C.',
  ),
  rules: t(
    'Two rules: move one disk at a time, and never put a bigger disk on a smaller one.',
    '两条规则：一次只能搬一个圆盘；大圆盘不能放在小圆盘上面。',
    '兩條規則：一次只能搬一個圓盤；大圓盤不能放在小圓盤上面。',
    'ルールは 2 つ。1 回に動かせる円盤は 1 まいだけ。大きい円盤を小さい円盤の上にのせてはだめ。',
    'Два правила: переносить по одному диску и никогда не класть больший диск на меньший.',
  ),
  split: t(
    'Big job? Split it! First, move the top 2 disks out of the way, onto rod B.',
    '大任务？拆开它！第一步：把上面 2 个圆盘先挪到 B 柱上，让出位置。',
    '大任務？拆開它！第一步：把上面 2 個圓盤先挪到 B 柱上，讓出位置。',
    '大きな仕事は分けよう！まず、上の 2 まいを B の棒にどかす。',
    'Большая задача? Раздели её! Сначала убери 2 верхних диска на стержень B.',
  ),
  big: t(
    'Now the biggest disk is free. Move it straight to rod C. Just one move!',
    '现在最大的圆盘上面空了。把它直接搬到 C 柱。只要一步！',
    '現在最大的圓盤上面空了。把它直接搬到 C 柱。只要一步！',
    'これでいちばん大きい円盤が動かせる。そのまま C の棒へ。たった 1 回！',
    'Теперь самый большой диск свободен. Переносим его прямо на C. Всего один ход!',
  ),
  last: t(
    'Last, move the 2 disks from B onto C. That is the same puzzle again, just smaller!',
    '最后把 B 柱上的 2 个圆盘搬到 C 柱上。这又是同一个谜题，只是变小了！',
    '最後把 B 柱上的 2 個圓盤搬到 C 柱上。這又是同一個謎題，只是變小了！',
    '最後に、B の 2 まいを C へ。これはさっきと同じパズル。小さくなっただけ！',
    'Напоследок переносим 2 диска с B на C. Это та же головоломка, только меньше!',
  ),
  name: t(
    'This is divide and conquer: split a big problem into smaller copies of itself. Merge sort works the same way.',
    '这就是分治：把大问题拆成和它一样、但更小的问题。归并排序也是这样做的。',
    '這就是分治：把大問題拆成和它一樣、但更小的問題。合併排序也是這樣做的。',
    'これが分割統治。大きな問題を、同じ形の小さな問題に分ける。マージソートも同じやり方だよ。',
    'Это «разделяй и властвуй»: большая задача делится на такие же, но поменьше. Так же работает сортировка слиянием.',
  ),
};

const HANOI_PRACTICE: Record<'start' | 'askSmall' | 'small' | 'askBig' | 'big' | 'askLast' | 'done' | 'askThree' | 'three', T> = {
  start: t(
    "Let's solve a tower of 2 disks. Move it from rod A to rod C.",
    '我们来解 2 个圆盘的塔：把它从 A 柱搬到 C 柱。',
    '我們來解 2 個圓盤的塔：把它從 A 柱搬到 C 柱。',
    '2 まいの塔をといてみよう。A の棒から C の棒へうつすよ。',
    'Решим башню из 2 дисков: перенесём её со стержня A на C.',
  ),
  askSmall: t('Where should the small disk go first?', '小圆盘应该先放到哪里？', '小圓盤應該先放到哪裡？', '小さい円盤は、まずどこへ？', 'Куда сначала положить маленький диск?'),
  small: t(
    'Small disk to B. Now the big disk is free to move.',
    '小圆盘放到 B。现在大圆盘可以动了。',
    '小圓盤放到 B。現在大圓盤可以動了。',
    '小さい円盤を B へ。これで大きい円盤が動かせる。',
    'Маленький диск — на B. Теперь большой диск свободен.',
  ),
  askBig: t('Where does the big disk go?', '大圆盘放到哪里？', '大圓盤放到哪裡？', '大きい円盤はどこへ？', 'Куда пойдёт большой диск?'),
  big: t(
    'Big disk to C. That is 2 moves so far, and only the small disk is left.',
    '大圆盘放到 C。到现在走了 2 步，只剩小圆盘了。',
    '大圓盤放到 C。到現在走了 2 步，只剩小圓盤了。',
    '大きい円盤を C へ。ここまで 2 回。のこりは小さい円盤だけ。',
    'Большой диск — на C. Это уже 2 хода, остался только маленький диск.',
  ),
  askLast: t('Where does the small disk go now?', '现在小圆盘放到哪里？', '現在小圓盤放到哪裡？', 'こんどは小さい円盤をどこへ？', 'Куда теперь положить маленький диск?'),
  done: t(
    'Small disk on top of the big one. The tower is on C in 3 moves!',
    '小圆盘放到大圆盘上面。3 步就把塔搬到了 C！',
    '小圓盤放到大圓盤上面。3 步就把塔搬到了 C！',
    '小さい円盤を大きい円盤の上へ。3 回で塔が C にうつった！',
    'Маленький диск — сверху на большой. Башня на C за 3 хода!',
  ),
  askThree: t(
    '3 disks: move 2 disks (3 moves), then the big one (1 move), then 2 disks again (3 moves). How many moves?',
    '3 个圆盘：先搬 2 个（3 步），再搬大的（1 步），再搬 2 个（3 步）。一共几步？',
    '3 個圓盤：先搬 2 個（3 步），再搬大的（1 步），再搬 2 個（3 步）。一共幾步？',
    '3 まいなら、2 まい（3 回）、大きいの（1 回）、また 2 まい（3 回）。全部で何回？',
    '3 диска: переносим 2 диска (3 хода), потом большой (1 ход), потом снова 2 (3 хода). Сколько всего ходов?',
  ),
  three: t(
    '7 moves for 3 disks. A bigger tower just uses the smaller tower’s answer twice!',
    '3 个圆盘要 7 步。更大的塔，只要把小一号的塔的解法用两次！',
    '3 個圓盤要 7 步。更大的塔，只要把小一號的塔的解法用兩次！',
    '3 まいなら 7 回。大きい塔は、ひとつ小さい塔のとき方を 2 回使うだけ！',
    'Для 3 дисков — 7 ходов. Башня побольше просто дважды использует решение для башни поменьше!',
  ),
};

const HANOI_EXPLAIN: Record<'small' | 'big' | 'last' | 'three', T> = {
  small: t(
    'The big disk has to land on C, so the small disk waits on B.',
    '大圆盘最后要放在 C 上，所以小圆盘先到 B 上等着。',
    '大圓盤最後要放在 C 上，所以小圓盤先到 B 上等著。',
    '大きい円盤は C に置きたい。だから小さい円盤は B で待つよ。',
    'Большой диск должен попасть на C, поэтому маленький ждёт на B.',
  ),
  big: t(
    'A big disk cannot go on the small one on B, so it goes to the empty rod C.',
    'B 上有小圆盘，大的不能压在小的上面，所以放到空着的 C。',
    'B 上有小圓盤，大的不能壓在小的上面，所以放到空著的 C。',
    'B には小さい円盤がある。大きいのは小さいのの上にのせられないから、空いている C へ。',
    'На B лежит маленький диск, а большой на маленький класть нельзя. Значит, на пустой C.',
  ),
  last: t(
    'The whole tower must end up on C, so the small disk goes on top of the big one there.',
    '整座塔最后要在 C 上，所以小圆盘要放到 C 上的大圆盘上面。',
    '整座塔最後要在 C 上，所以小圓盤要放到 C 上的大圓盤上面。',
    '塔はぜんぶ C にうつしたい。だから小さい円盤は、C の大きい円盤の上へ。',
    'Вся башня должна оказаться на C, поэтому маленький диск кладём сверху на большой.',
  ),
  three: t('3 + 1 + 3 = 7 moves.', '3 + 1 + 3 = 7 步。', '3 + 1 + 3 = 7 步。', '3 + 1 + 3 = 7 回。', '3 + 1 + 3 = 7 ходов.'),
};

const HANOI_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('What does divide and conquer mean?', '“分治”是什么意思？', '「分治」是什麼意思？', '分割統治ってどういう意味？', 'Что значит «разделяй и властвуй»?'),
  q1a: t('Split a big problem into smaller ones', '把大问题拆成小问题', '把大問題拆成小問題', '大きな問題を小さく分ける', 'Делить большую задачу на маленькие'),
  q1b: t('Do everything at once', '一下子全部做完', '一下子全部做完', '全部いっぺんにやる', 'Делать всё сразу'),
  q1c: t('Skip the hard parts', '跳过难的部分', '跳過難的部分', 'むずかしい所をとばす', 'Пропускать трудное'),
  q1e: t(
    'Small problems are easy to solve, and their answers build the big answer.',
    '小问题容易解决，把它们的答案合起来就是大问题的答案。',
    '小問題容易解決，把它們的答案合起來就是大問題的答案。',
    '小さな問題はかんたんにとける。その答えを合わせると、大きな問題の答えになるよ。',
    'Маленькие задачи решать легко, а из их ответов складывается ответ к большой.',
  ),
  q2: t('How many moves does a tower of 2 disks need?', '2 个圆盘的塔要搬几步？', '2 個圓盤的塔要搬幾步？', '2 まいの塔は何回でうつせる？', 'Сколько ходов нужно для башни из 2 дисков?'),
  q2e: t(
    'Small disk to B, big disk to C, small disk onto C: 3 moves.',
    '小的到 B，大的到 C，小的再到 C：3 步。',
    '小的到 B，大的到 C，小的再到 C：3 步。',
    '小さいのを B、大きいのを C、小さいのを C。3 回だよ。',
    'Маленький на B, большой на C, маленький на C — 3 хода.',
  ),
  q3: t('Which move breaks the Tower of Hanoi rules?', '下面哪一步违反了汉诺塔的规则？', '下面哪一步違反了河內塔的規則？', 'ハノイの塔のルールやぶりになるのはどれ？', 'Какой ход нарушает правила Ханойской башни?'),
  q3a: t('Putting a big disk on a small one', '把大圆盘放在小圆盘上', '把大圓盤放在小圓盤上', '大きい円盤を小さい円盤の上にのせる', 'Положить большой диск на маленький'),
  q3b: t('Putting a small disk on a big one', '把小圆盘放在大圆盘上', '把小圓盤放在大圓盤上', '小さい円盤を大きい円盤の上にのせる', 'Положить маленький диск на большой'),
  q3c: t('Putting a disk on an empty rod', '把圆盘放到空柱子上', '把圓盤放到空柱子上', '空いている棒に円盤をおく', 'Положить диск на пустой стержень'),
  q3e: t(
    'A bigger disk may never sit on a smaller one.',
    '大圆盘永远不能压在小圆盘上面。',
    '大圓盤永遠不能壓在小圓盤上面。',
    '大きい円盤は、小さい円盤の上にはぜったいにのせられないよ。',
    'Больший диск никогда не кладут на меньший.',
  ),
};

const rodChoices: [string, string][] = [
  ['B', 'B'],
  ['C', 'C'],
];

const divideConquer: LessonContent = {
  story(l): StorySlide[] {
    const S = HANOI_STORY;
    return [
      { scene: hanoi(l, { rods: [[3, 2, 1], [], []] }), say: S.intro[l] },
      // Only the top disk can move; no move is shown, so the next slide still starts from the full tower.
      { scene: hanoi(l, { rods: [[3, 2, 1], [], []], hot: 1 }), say: S.rules[l] },
      { scene: hanoi(l, { rods: [[3], [2, 1], []], arc: [0, 1, 2] }), say: S.split[l] },
      { scene: hanoi(l, { rods: [[], [2, 1], [3]], arc: [0, 2, 1], hot: 3 }), say: S.big[l] },
      { scene: hanoi(l, { rods: [[], [], [3, 2, 1]], arc: [1, 2, 2] }), say: S.last[l] },
      { scene: splitTree(l), say: S.name[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = HANOI_PRACTICE;
    const E = HANOI_EXPLAIN;
    return [
      { scene: hanoi(l, { rods: [[2, 1], [], []], moves: 0 }), say: P.start[l] },
      { scene: hanoi(l, { rods: [[2, 1], [], []], hot: 1, moves: 0 }), say: P.askSmall[l], ask: pick(P.askSmall[l], rodChoices, 'B', E.small[l]) },
      { scene: hanoi(l, { rods: [[2], [1], []], arc: [0, 1, 1], moves: 1 }), say: P.small[l] },
      { scene: hanoi(l, { rods: [[2], [1], []], hot: 2, moves: 1 }), say: P.askBig[l], ask: pick(P.askBig[l], rodChoices, 'C', E.big[l]) },
      { scene: hanoi(l, { rods: [[], [1], [2]], arc: [0, 2, 1], moves: 2 }), say: P.big[l] },
      {
        scene: hanoi(l, { rods: [[], [1], [2]], hot: 1, moves: 2 }),
        say: P.askLast[l],
        ask: pick(
          P.askLast[l],
          [
            ['A', 'A'],
            ['C', 'C'],
          ],
          'C',
          E.last[l],
        ),
      },
      { scene: hanoi(l, { rods: [[], [], [2, 1]], arc: [1, 2, 1], moves: 3 }), say: P.done[l] },
      { scene: hanoi(l, { rods: [[3, 2, 1], [], []], moves: 0 }), say: P.askThree[l], ask: ask(P.askThree[l], [6, 7, 9], 7, E.three[l]) },
      { scene: hanoi(l, { rods: [[], [], [3, 2, 1]], moves: 7 }), say: P.three[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = HANOI_QUIZ;
    return [
      pick(
        Q.q1[l],
        [
          ['split', Q.q1a[l]],
          ['once', Q.q1b[l]],
          ['skip', Q.q1c[l]],
        ],
        'split',
        Q.q1e[l],
      ),
      { ...ask(Q.q2[l], [2, 3, 4], 3, Q.q2e[l]), scene: hanoi(l, { rods: [[2, 1], [], []] }) },
      pick(
        Q.q3[l],
        [
          ['big', Q.q3a[l]],
          ['small', Q.q3b[l]],
          ['empty', Q.q3c[l]],
        ],
        'big',
        Q.q3e[l],
      ),
    ];
  },
};

const LESSONS: Record<string, LessonContent> = {
  maze: mazeLesson,
  greedy,
  backtracking,
  dynamic_programming: dynamicProgramming,
  divide_conquer: divideConquer,
};

export default LESSONS;
