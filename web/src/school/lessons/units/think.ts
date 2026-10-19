import { arrow, box, chip, diamond, link, region, seg, tag, text } from '../../../figures/kit';
import type { BoxNode, Scene, SceneNode, Tone } from '../../../figures/scene';
import type { Locale } from '../../../i18n/locale';
import type { KidQuestion, LessonContent, PracticeStep, StorySlide } from '../types';

/**
 * Unit 1, think like a computer. Each lesson: an everyday picture in the story, a short guessing
 * game in "Try it", and a three-question quiz. Text is written for 8–12 year olds.
 */

type T = Record<Locale, string>;
const t = (en: string, zh: string, zhHant: string, ja: string, ru: string): T => ({ en, zh, 'zh-hant': zhHant, ja, ru });

const W = 440;
const H = 260;

/** A question whose choices are small numbers. */
const ask = (prompt: string, ids: number[], answer: number, explain: string): KidQuestion => ({
  prompt,
  choices: ids.map((n) => ({ id: String(n), label: String(n) })),
  answer: String(answer),
  explain,
});

/** A question whose choices are words: `[id, label]` pairs. */
const pick = (prompt: string, choices: [string, string][], answer: string, explain: string): KidQuestion => ({
  prompt,
  choices: choices.map(([id, label]) => ({ id, label })),
  answer,
  explain,
});

/** Russian picks the noun form by the number: 1 шаг, 3 шага, 8 шагов. */
const ruCount = (n: number, one: string, few: string, many: string) => {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return one;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return few;
  return many;
};

// ── What is an algorithm? ─────────────────────────────────────────────

type RecipeStep = 'bread' | 'butter' | 'cheese' | 'top';
const RECIPE: RecipeStep[] = ['bread', 'butter', 'cheese', 'top'];
/** The order the cards land in when they get mixed up. */
const MIXED: RecipeStep[] = ['cheese', 'bread', 'top', 'butter'];
const RECIPE_TONE: Record<RecipeStep, Tone> = { bread: 'warn', butter: 'ok', cheese: 'accent', top: 'info' };

const ALGO_LABEL: Record<RecipeStep | 'recipe' | 'mixed' | 'problem' | 'answer' | 'algorithm' | 'find' | 'middle' | 'found' | 'dictionary' | 'home' | 'school' | 'shortest', T> = {
  bread: t('Take a slice of bread', '拿一片面包', '拿一片麵包', 'パンを 1 まいおく', 'Возьми кусок хлеба'),
  butter: t('Spread butter', '抹上黄油', '抹上奶油', 'バターをぬる', 'Намажь масло'),
  cheese: t('Add cheese', '放上奶酪', '放上起司', 'チーズをのせる', 'Положи сыр'),
  top: t('Put bread on top', '盖上一片面包', '蓋上一片麵包', 'パンをかぶせる', 'Накрой хлебом'),
  recipe: t('Sandwich recipe', '三明治食谱', '三明治食譜', 'サンドイッチのつくり方', 'Рецепт бутерброда'),
  mixed: t('mixed up', '打乱的卡片', '打亂的卡片', 'バラバラのカード', 'перепутанные'),
  problem: t('problem', '问题', '問題', 'もんだい', 'задача'),
  answer: t('answer', '答案', '答案', 'こたえ', 'ответ'),
  algorithm: t('algorithm', '算法', '演算法', 'アルゴリズム', 'алгоритм'),
  find: t('find:', '要找：', '要找：', 'さがす：', 'ищем:'),
  middle: t('middle', '中间', '中間', 'まんなか', 'середина'),
  found: t('found!', '找到了！', '找到了！', '見つけた！', 'нашли!'),
  dictionary: t('dictionary', '字典', '字典', '辞書', 'словарь'),
  home: t('home', '家', '家', 'いえ', 'дом'),
  school: t('school', '学校', '學校', 'がっこう', 'школа'),
  shortest: t('shortest way', '最近的路', '最近的路', 'いちばん近い道', 'кратчайший путь'),
};

const stepLabel = (l: Locale, n: number) =>
  ({ en: `step ${n}`, zh: `第 ${n} 步`, 'zh-hant': `第 ${n} 步`, ja: `ステップ ${n}`, ru: `шаг ${n}` })[l];

/**
 * A tiny dictionary of 7 words in the language's own order, each with the letter it is sorted by
 * (pinyin for Chinese, zhuyin for Taiwan, kana for Japanese). The story looks up word 5, the
 * practice word 1, and the middle word 3 is where Algo always opens first.
 */
const DICT: Record<Locale, [word: string, key: string][]> = {
  en: [['ant', 'A'], ['dog', 'D'], ['fox', 'F'], ['kite', 'K'], ['nest', 'N'], ['robot', 'R'], ['zebra', 'Z']],
  zh: [['阿姨', 'A'], ['大象', 'D'], ['狗', 'G'], ['孔雀', 'K'], ['牛', 'N'], ['兔子', 'T'], ['熊猫', 'X']],
  'zh-hant': [['包子', 'ㄅ'], ['貓', 'ㄇ'], ['兔子', 'ㄊ'], ['老虎', 'ㄌ'], ['雞', 'ㄐ'], ['松鼠', 'ㄙ'], ['鴨子', 'ㄧ']],
  ja: [['あり', 'あ'], ['かめ', 'か'], ['さる', 'さ'], ['たこ', 'た'], ['ねこ', 'ね'], ['はな', 'は'], ['みかん', 'み']],
  ru: [['арбуз', 'А'], ['гусь', 'Г'], ['жук', 'Ж'], ['кот', 'К'], ['нос', 'Н'], ['робот', 'Р'], ['утка', 'У']],
};

const startsWith = (l: Locale, key: string) =>
  ({ en: `starts with ${key}`, zh: `拼音 ${key} 开头`, 'zh-hant': `注音 ${key} 開頭`, ja: `「${key}」ではじまる`, ru: `на букву ${key}` })[l];

/** Under the opened middle word: which way to look next. */
const lookRight = (l: Locale, mid: string, key: string) =>
  ({
    en: `${mid} comes before ${key}, so look right →`,
    zh: `${mid} 在 ${key} 前面，往右找 →`,
    'zh-hant': `${mid} 在 ${key} 前面，往右找 →`,
    ja: `「${mid}」は「${key}」より前。右をさがそう →`,
    ru: `${mid} раньше ${key} — ищем правее →`,
  })[l];

/** The recipe as a card: numbered steps in order. */
function recipeCard(l: Locale): Scene {
  const nodes: SceneNode[] = [region('card', 70, 36, 300, 212, { label: ALGO_LABEL.recipe[l] })];
  RECIPE.forEach((s, k) => {
    nodes.push(
      box(`n${k}`, 86, 52 + k * 48, String(k + 1), { w: 34, h: 34, shape: 'circle', size: 15, tone: 'accent' }),
      box(`s:${s}`, 132, 50 + k * 48, ALGO_LABEL[s][l], { w: 222, h: 38, sans: true, size: 15, tone: RECIPE_TONE[s] }),
    );
  });
  return { w: W, h: H, nodes };
}

/** Sorting the recipe: numbered slots on the left, mixed-up cards on the right; `placed` cards sit in their slots. */
function sortScene(l: Locale, placed: RecipeStep[], opts: { asking?: boolean } = {}): Scene {
  const nodes: SceneNode[] = [
    text('hl', 139, 26, ALGO_LABEL.recipe[l], { anchor: 'middle', size: 13, bold: true, tone: 'muted' }),
    text('hr', 341, 26, ALGO_LABEL.mixed[l], { anchor: 'middle', size: 13, bold: true, tone: 'muted' }),
  ];
  for (let k = 0; k < 4; k++) {
    const y = 40 + k * 52;
    nodes.push(box(`n${k}`, 14, y + 2, String(k + 1), { w: 32, h: 32, shape: 'circle', size: 15, tone: k < placed.length ? 'accent' : 'idle' }));
    const card = placed[k];
    if (card) {
      nodes.push(box(`s:${card}`, 54, y, ALGO_LABEL[card][l], { w: 170, h: 36, sans: true, size: 14, tone: RECIPE_TONE[card] }));
    } else {
      const next = opts.asking && k === placed.length;
      nodes.push(box(`slot${k}`, 54, y, next ? '?' : '', { w: 170, h: 36, size: 18, dashed: true, tone: next ? 'warn' : 'ghost', ring: next }));
    }
  }
  MIXED.forEach((card, j) => {
    if (!placed.includes(card)) nodes.push(box(`s:${card}`, 256, 40 + j * 52, ALGO_LABEL[card][l], { w: 170, h: 36, sans: true, size: 14, tone: RECIPE_TONE[card] }));
  });
  return { w: W, h: H, nodes };
}

/** Problem → a few clear steps → answer. */
function flowScene(l: Locale): Scene {
  const nodes: SceneNode[] = [
    box('prob', 14, 104, ALGO_LABEL.problem[l], { w: 104, h: 52, sans: true, size: 15, tone: 'warn' }),
    region('alg', 158, 50, 124, 170, { label: ALGO_LABEL.algorithm[l] }),
    arrow('a1', [122, 130], [154, 130], { tone: 'accent', width: 2.5 }),
    arrow('a2', [286, 130], [318, 130], { tone: 'accent', width: 2.5 }),
    box('ans', 322, 104, ALGO_LABEL.answer[l], { w: 104, h: 52, sans: true, size: 15, tone: 'ok' }),
  ];
  for (let k = 0; k < 3; k++) nodes.push(box(`st${k}`, 172, 66 + k * 50, stepLabel(l, k + 1), { w: 96, h: 38, sans: true, size: 14, tone: 'info' }));
  return { w: W, h: H, nodes };
}

/**
 * The dictionary as a row of word cards, each with its sorting letter on top. `look` is the
 * word being looked up, `open` the card Algo opened, `keep` the cards still in play (the rest
 * fade), `found` the card with the word, and `hint` says which way to go from the middle.
 */
function dictScene(l: Locale, look: number | null, opts: { open?: number; keep?: [number, number]; found?: number; hint?: boolean } = {}): Scene {
  const words = DICT[l];
  const nodes: SceneNode[] = [region('book', 6, 52, 428, 128, { tone: 'warn', label: ALGO_LABEL.dictionary[l], labelAt: 'inside' })];
  if (look !== null) {
    const [word, key] = words[look];
    nodes.push(chip('word', W / 2, 10, seg([ALGO_LABEL.find[l] + ' ', 'muted'], [word, 'accent', true], [`  (${startsWith(l, key)})`, 'muted']), { sans: true, size: 16 }));
  }
  const cards = words.map(([word, key], i) => {
    const out = opts.keep !== undefined && (i < opts.keep[0] || i > opts.keep[1]);
    const tone: Tone = i === opts.found ? 'ok' : i === opts.open && !out ? 'warn' : out ? 'idle' : 'info';
    const x = 13 + i * 60;
    const card = box(`pg${i}`, x, 80, '', { w: 54, h: 80, tone, ring: i === opts.found || (i === opts.open && !out), dim: out });
    nodes.push(
      card,
      text(`pk${i}`, x + 27, 114, key, { anchor: 'middle', size: 24, bold: true, tone: out ? 'muted' : 'accent', dim: out }),
      text(`pw${i}`, x + 27, 146, word, { anchor: 'middle', size: 13, dim: out }),
    );
    return card;
  });
  if (opts.found !== undefined) nodes.push(...tag('mid', cards[opts.found], ALGO_LABEL.found[l], { side: 'below', tone: 'ok' }));
  else if (opts.open !== undefined) nodes.push(...tag('mid', cards[opts.open], ALGO_LABEL.middle[l], { side: 'below', tone: 'warn' }));
  if (opts.hint && look !== null && opts.open !== undefined) {
    nodes.push(text('hint', W / 2, 242, lookRight(l, words[opts.open][1], words[look][1]), { anchor: 'middle', size: 15, bold: true, tone: 'accent' }));
  }
  return { w: W, h: H, nodes };
}

/**
 * A tiny map: home, four crossroads, school, and the shortest way lit up. The lower road dips
 * further and spreads wider, so it is visibly longer than the lit one, not a mirror image of it.
 */
function mapScene(l: Locale): Scene {
  const home = box('home', 14, 108, ALGO_LABEL.home[l], { w: 96, h: 44, sans: true, size: 15, tone: 'info' });
  const school = box('school', 330, 108, ALGO_LABEL.school[l], { w: 96, h: 44, sans: true, size: 15, tone: 'ok' });
  const dot = (id: string, cx: number, cy: number, on: boolean) => box(id, cx - 13, cy - 13, '', { w: 26, h: 26, shape: 'circle', tone: on ? 'ok' : 'idle' });
  const c1 = dot('c1', 180, 84, true);
  const c2 = dot('c2', 150, 216, false);
  const c3 = dot('c3', 260, 84, true);
  const c4 = dot('c4', 290, 216, false);
  const road = (id: string, a: BoxNode, b: BoxNode, best = false) => link(id, a, b, { head: 'none', pad: 1, tone: best ? 'ok' : 'idle', width: best ? 4 : 2 });
  return {
    w: W,
    h: H,
    nodes: [
      road('e1', home, c1, true),
      road('e2', home, c2),
      road('e3', c1, c3, true),
      road('e4', c2, c4),
      road('e5', c1, c4),
      road('e6', c3, school, true),
      road('e7', c4, school),
      home,
      school,
      c1,
      c2,
      c3,
      c4,
      text('best', 220, 56, ALGO_LABEL.shortest[l], { anchor: 'middle', size: 14, bold: true, tone: 'ok' }),
    ],
  };
}

const ALGO_STORY: Record<'recipe' | 'idea' | 'dict' | 'open' | 'discard' | 'found' | 'map', T> = {
  recipe: t(
    'Algo wants a sandwich. The recipe is a list of steps, done one after another.',
    'Algo 想做三明治。食谱就是一串步骤，一步接一步地做。',
    'Algo 想做三明治。食譜就是一串步驟，一步接一步地做。',
    'Algo はサンドイッチをつくりたい。つくり方は、じゅんばんにやる手順のリストだよ。',
    'Algo хочет бутерброд. Рецепт — это список шагов, которые делают по порядку.',
  ),
  idea: t(
    'Clear steps that solve a problem are called an algorithm. Follow them, and you get the answer every time.',
    '能解决问题的一串清楚的步骤，就叫算法。照着做，每次都能得到答案。',
    '能解決問題的一串清楚的步驟，就叫演算法。照著做，每次都能得到答案。',
    'もんだいをとく、はっきりした手順のことを「アルゴリズム」というよ。そのとおりにやれば、いつでもこたえが出る。',
    'Понятные шаги, которые решают задачу, называются алгоритмом. Делай по ним — и каждый раз получишь ответ.',
  ),
  dict: t(
    'Algorithms are everywhere, even in a dictionary. Its words are in ABC order: look at the big first letters. Let us find "robot". It starts with R.',
    '算法到处都有，查字典也用得上。字典里的词按拼音字母排好了顺序，看看上面的大字母。我们来找“兔子”，它的拼音 tù 以 T 开头。',
    '演算法到處都有，查字典也用得上。字典裡的詞按注音排好了順序，看看上面的大符號。我們來找「松鼠」，它的注音以 ㄙ 開頭。',
    'アルゴリズムはどこにでもあるよ。辞書の言葉は、あいうえお順にならんでいる。上の大きな字を見てね。「はな」をさがそう。「は」ではじまる言葉だよ。',
    'Алгоритмы повсюду, даже в словаре. Слова в нём идут по алфавиту — смотри на большие первые буквы. Найдём слово «робот». Оно начинается на Р.',
  ),
  open: t(
    'Do not start from the first word! Open the middle: "kite". K comes before R in the alphabet, so "robot" is further on, to the right.',
    '不从第一个词开始！先翻开中间：“孔雀”，K 开头。字母表里 K 在 T 前面，所以“兔子”还在后面，在右边。',
    '不從第一個詞開始！先翻開中間：「老虎」，ㄌ 開頭。注音裡 ㄌ 排在 ㄙ 前面，所以「松鼠」還在後面，在右邊。',
    '1 つ目からはじめない！まずまんなかを開く：「たこ」。「た」は「は」より前。だから「はな」はもっと後ろ、右のほうだね。',
    'Не начинаем с первого слова! Открываем середину: «кот». В алфавите К раньше Р, значит, «робот» дальше, справа.',
  ),
  discard: t(
    'So "robot" cannot be "kite" or anything before it. Put those away: half the dictionary is gone in one look!',
    '所以“兔子”不会是“孔雀”，也不在它前面。把这些都放到一边：看一眼，就去掉了半本字典！',
    '所以「松鼠」不會是「老虎」，也不在它前面。把這些都放到一邊：看一眼，就去掉了半本字典！',
    'だから「はな」は「たこ」でも、それより前でもない。そこはもう見なくていい。1 回見ただけで、辞書の半分がへったよ！',
    'Значит, «робот» — это не «кот» и не то, что до него. Откладываем их: один взгляд — и полсловаря долой!',
  ),
  found: t(
    'Three words are left: nest, robot, zebra. Open the middle one: "robot"! Found in 2 tries, without reading every word.',
    '还剩三个词：牛、兔子、熊猫。翻开中间那个：“兔子”！只翻了 2 次，不用一个一个地找。',
    '還剩三個詞：雞、松鼠、鴨子。翻開中間那個：「松鼠」！只翻了 2 次，不用一個一個地找。',
    'のこりは 3 つ：ねこ、はな、みかん。まんなかを開くと「はな」！たった 2 回で見つかった。ぜんぶ読まなくていいんだ。',
    'Осталось три слова: нос, робот, утка. Открываем среднее — «робот»! Нашли за 2 попытки и не читали все слова подряд.',
  ),
  map: t(
    'Computers follow algorithms too. A map app uses one to find the shortest way from home to school.',
    '计算机也按算法做事。地图软件就用算法找出从家到学校最近的路。',
    '電腦也照著演算法做事。地圖 App 就用演算法找出從家到學校最近的路。',
    'コンピュータもアルゴリズムで動くよ。地図アプリは、いえから学校までのいちばん近い道をアルゴリズムで見つけるんだ。',
    'Компьютеры тоже действуют по алгоритмам. Приложение-карта так находит самый короткий путь из дома в школу.',
  ),
};

const ALGO_PRACTICE: Record<'mixed' | 'askFirst' | 'askSecond' | 'askNext' | 'done' | 'askHalf' | 'askMid' | 'foundIt', T> = {
  mixed: t(
    'Oh no, the recipe cards got mixed up! Let us put the steps back in order.',
    '糟糕，食谱卡片被打乱了！我们把步骤排回正确的顺序吧。',
    '糟糕，食譜卡片被打亂了！我們把步驟排回正確的順序吧。',
    'たいへん、つくり方のカードがバラバラになっちゃった！正しいじゅんばんにならべよう。',
    'Ой, карточки рецепта перепутались! Давай разложим шаги по порядку.',
  ),
  askFirst: t('Which step comes first?', '哪一步是第一步？', '哪一步是第一步？', 'さいしょの手順はどれ？', 'Какой шаг первый?'),
  askSecond: t('Bread is down. What comes second?', '面包放好了。第二步是什么？', '麵包放好了。第二步是什麼？', 'パンをおいたよ。2 番目は？', 'Хлеб положили. Какой шаг второй?'),
  askNext: t('Bread, then butter. What comes next?', '先放面包，再抹黄油。接下来是什么？', '先放麵包，再抹奶油。接下來是什麼？', 'パン、それからバター。つぎは？', 'Хлеб, потом масло. Что дальше?'),
  done: t(
    'The last card, "Put bread on top", goes to step 4. The recipe is in order again. Right steps in the right order: that is an algorithm!',
    '最后一张卡片“盖上一片面包”放在第 4 步。食谱又排好了。正确的步骤，正确的顺序：这就是算法！',
    '最後一張卡片「蓋上一片麵包」放在第 4 步。食譜又排好了。正確的步驟，正確的順序：這就是演算法！',
    'のこった「パンをかぶせる」はステップ 4。カードがならんだね。正しい手順を正しいじゅんばんで：これがアルゴリズム！',
    'Последняя карточка, «Накрой хлебом», — это шаг 4. Рецепт снова по порядку. Правильные шаги в правильном порядке — это и есть алгоритм!',
  ),
  askHalf: t(
    'Now find "dog" (it starts with D). Algo opens the middle: "kite" (K). Is "dog" before "kite" or after it?',
    '现在找“大象”（拼音 D 开头）。翻开中间是“孔雀”（K）。“大象”在“孔雀”前面还是后面？',
    '現在找「貓」（注音 ㄇ 開頭）。翻開中間是「老虎」（ㄌ）。「貓」在「老虎」前面還是後面？',
    'こんどは「かめ」（「か」ではじまる）をさがそう。まんなかは「たこ」（「た」）。「かめ」は「たこ」の前？後ろ？',
    'Теперь найдём «гусь» (на букву Г). Algo открывает середину: «кот» (К). «Гусь» стоит до «кота» или после?',
  ),
  askMid: t(
    'Put away "kite" and everything after it. Three words are left. Which one is in the middle?',
    '把“孔雀”和后面的词放到一边，还剩三个词。中间是哪一个？',
    '把「老虎」和後面的詞放到一邊，還剩三個詞。中間是哪一個？',
    '「たこ」から後ろはおしまい。のこりは 3 つ。まんなかはどれ？',
    'Откладываем «кот» и всё, что после. Осталось три слова. Какое из них посередине?',
  ),
  foundIt: t(
    'Found "dog" in 2 tries. Algo never had to read every word!',
    '只翻了 2 次就找到了“大象”，根本不用一个一个地看！',
    '只翻了 2 次就找到了「貓」，根本不用一個一個地看！',
    '2 回で「かめ」が見つかった。ぜんぶ見なくてもいいんだね！',
    'Нашли «гусь» за 2 попытки — и не читали все слова подряд!',
  ),
};

const ALGO_CHOICE: Record<'before' | 'after', T> = {
  before: t('Before', '前面', '前面', '前', 'До'),
  after: t('After', '后面', '後面', '後ろ', 'После'),
};

const ALGO_EXPLAIN: Record<'first' | 'second' | 'next' | 'half' | 'mid', T> = {
  first: t(
    'You need a slice of bread before you can put anything on it.',
    '要先有面包，才能往上面放东西。',
    '要先有麵包，才能往上面放東西。',
    'まずパンがないと、なにものせられないよ。',
    'Сначала нужен хлеб — иначе не на что класть.',
  ),
  second: t(
    'Butter is spread right on the bread, before anything else goes on top.',
    '黄油要直接抹在面包上，然后才能放别的东西。',
    '奶油要直接抹在麵包上，然後才能放別的東西。',
    'バターはパンに直接ぬるよ。ほかのものをのせるのはそのあと。',
    'Масло мажут прямо на хлеб — а уже потом кладут всё остальное.',
  ),
  next: t(
    'Cheese goes on the butter. The top slice comes last, or there would be nothing to cover.',
    '奶酪放在黄油上。最上面那片面包要最后放，不然就没东西可盖了。',
    '起司放在奶油上。最上面那片麵包要最後放，不然就沒東西可蓋了。',
    'チーズはバターの上。上のパンは最後。先にかぶせたら、チーズをのせられないよ。',
    'Сыр кладём на масло. Верхний хлеб — в самом конце, иначе нечего накрывать.',
  ),
  half: t(
    'D comes before K in the alphabet, so "dog" is on the left, before "kite".',
    '字母表里 D 在 K 前面，所以“大象”在左边，在“孔雀”前面。',
    '注音裡 ㄇ 排在 ㄌ 前面，所以「貓」在左邊，在「老虎」前面。',
    '「か」は「た」より前。だから「かめ」は左のほう、「たこ」の前だよ。',
    'В алфавите Г раньше К, значит, «гусь» слева, до «кота».',
  ),
  mid: t(
    '"Dog" is in the middle of ant, dog and fox, and it is the very word we want!',
    '“大象”正好在阿姨、大象、狗的中间，而且就是我们要找的词！',
    '「貓」正好在包子、貓、兔子的中間，而且就是我們要找的詞！',
    '「あり・かめ・さる」のまんなかは「かめ」。しかも、さがしていた言葉だ！',
    '«Гусь» как раз посередине между «арбузом» и «жуком» — и это наше слово!',
  ),
};

const ALGO_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2a' | 'q2b' | 'q2c' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('What is an algorithm?', '什么是算法？', '什麼是演算法？', 'アルゴリズムってなに？', 'Что такое алгоритм?'),
  q1a: t('Clear steps that solve a problem', '解决问题的一串清楚步骤', '解決問題的一串清楚步驟', 'もんだいをとく、はっきりした手順', 'Понятные шаги, решающие задачу'),
  q1b: t('A kind of robot', '一种机器人', '一種機器人', 'ロボットのしゅるい', 'Вид робота'),
  q1c: t('A very fast computer', '一台很快的计算机', '一台很快的電腦', 'すごく速いコンピュータ', 'Очень быстрый компьютер'),
  q1e: t(
    'An algorithm is a list of steps. A robot or a computer can follow it, and so can you!',
    '算法是一串步骤。机器人和计算机可以照着做，你也可以！',
    '演算法是一串步驟。機器人和電腦可以照著做，你也可以！',
    'アルゴリズムは手順のリスト。ロボットやコンピュータも、きみも、そのとおりにできるよ！',
    'Алгоритм — это список шагов. По нему может действовать робот, компьютер — и ты тоже!',
  ),
  q2: t(
    'Algo opens the dictionary in the middle. The word is in the first half. What next?',
    '从中间翻开字典，要找的词在前一半。下一步做什么？',
    '從中間翻開字典，要找的詞在前一半。下一步做什麼？',
    '辞書をまんなかで開いたら、言葉は前の半分にあるとわかった。つぎはどうする？',
    'Algo открыл словарь посередине. Слово в первой половине. Что дальше?',
  ),
  q2a: t('Keep only the first half', '只留下前一半', '只留下前一半', '前の半分だけのこす', 'Оставить только первую половину'),
  q2b: t('Keep only the second half', '只留下后一半', '只留下後一半', '後ろの半分だけのこす', 'Оставить только вторую половину'),
  q2c: t('Read every page from the start', '从第一页开始一页页地读', '從第一頁開始一頁頁地讀', '1 ページ目からぜんぶ読む', 'Читать все страницы с начала'),
  q2e: t(
    'The word cannot be in the second half. Throw it away and open the middle of the first half.',
    '这个词不可能在后一半。扔掉后一半，再翻开前一半的中间。',
    '這個詞不可能在後一半。丟掉後一半，再翻開前一半的中間。',
    '後ろの半分にはないから、もういらない。つぎは前の半分のまんなかを開こう。',
    'Во второй половине слова точно нет: откладываем её и открываем середину первой.',
  ),
  q3: t('Which of these is an algorithm?', '下面哪个是算法？', '下面哪個是演算法？', 'アルゴリズムはどれ？', 'Что из этого — алгоритм?'),
  q3a: t('Steps for tying your shoes', '系鞋带的步骤', '綁鞋帶的步驟', 'くつひもを結ぶ手順', 'Шаги, как завязать шнурки'),
  q3b: t('Your favorite color', '你最喜欢的颜色', '你最喜歡的顏色', 'すきな色', 'Твой любимый цвет'),
  q3c: t('A sunny day', '晴朗的一天', '晴朗的一天', 'はれた日', 'Солнечный день'),
  q3e: t(
    'Tying shoes is a list of steps done in order. A color or a day is not a list of steps.',
    '系鞋带是一串按顺序做的步骤。颜色和天气都不是步骤。',
    '綁鞋帶是一串按順序做的步驟。顏色和天氣都不是步驟。',
    'くつひもを結ぶのは、じゅんばんにやる手順だね。色や天気は手順じゃないよ。',
    'Завязать шнурки — это шаги по порядку. Цвет или погода — не шаги.',
  ),
};

const algorithms: LessonContent = {
  story(l): StorySlide[] {
    const S = ALGO_STORY;
    return [
      { scene: recipeCard(l), say: S.recipe[l] },
      { scene: flowScene(l), say: S.idea[l] },
      { scene: dictScene(l, 5), say: S.dict[l] },
      { scene: dictScene(l, 5, { open: 3, hint: true }), say: S.open[l] },
      { scene: dictScene(l, 5, { keep: [4, 6] }), say: S.discard[l] },
      { scene: dictScene(l, 5, { found: 5, keep: [4, 6] }), say: S.found[l] },
      { scene: mapScene(l), say: S.map[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = ALGO_PRACTICE;
    const E = ALGO_EXPLAIN;
    const card = (s: RecipeStep): [string, string] => [s, ALGO_LABEL[s][l]];
    const words = DICT[l];
    return [
      { scene: sortScene(l, []), say: P.mixed[l] },
      { scene: sortScene(l, [], { asking: true }), say: P.askFirst[l], ask: pick(P.askFirst[l], MIXED.map(card), 'bread', E.first[l]) },
      {
        scene: sortScene(l, ['bread'], { asking: true }),
        say: P.askSecond[l],
        ask: pick(P.askSecond[l], [card('butter'), card('cheese'), card('top')], 'butter', E.second[l]),
      },
      {
        scene: sortScene(l, ['bread', 'butter'], { asking: true }),
        say: P.askNext[l],
        ask: pick(P.askNext[l], [card('cheese'), card('top')], 'cheese', E.next[l]),
      },
      { scene: sortScene(l, RECIPE), say: P.done[l] },
      {
        scene: dictScene(l, 1, { open: 3 }),
        say: P.askHalf[l],
        ask: pick(P.askHalf[l], [['before', ALGO_CHOICE.before[l]], ['after', ALGO_CHOICE.after[l]]], 'before', E.half[l]),
      },
      {
        scene: dictScene(l, 1, { keep: [0, 2] }),
        say: P.askMid[l],
        ask: pick(P.askMid[l], [0, 1, 2].map((i): [string, string] => [`p${i}`, words[i][0]]), 'p1', E.mid[l]),
      },
      { scene: dictScene(l, 1, { found: 1, keep: [0, 2] }), say: P.foundIt[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = ALGO_QUIZ;
    return [
      pick(Q.q1[l], [['steps', Q.q1a[l]], ['robot', Q.q1b[l]], ['computer', Q.q1c[l]]], 'steps', Q.q1e[l]),
      { ...pick(Q.q2[l], [['first', Q.q2a[l]], ['second', Q.q2b[l]], ['all', Q.q2c[l]]], 'first', Q.q2e[l]), scene: dictScene(l, null, { open: 3 }) },
      pick(Q.q3[l], [['shoes', Q.q3a[l]], ['color', Q.q3b[l]], ['day', Q.q3c[l]]], 'shoes', Q.q3e[l]),
    ];
  },
};

// ── Loops: do it again ────────────────────────────────────────────────

const LOOP_LABEL: Record<'jump' | 'repeat5' | 'clap' | 'repeat4' | 'yes' | 'no' | 'stop' | 'jumpInc' | 'again' | 'was', T> = {
  jump: t('jump', '跳', '跳', 'ジャンプ', 'прыжок'),
  repeat5: t('repeat 5 times:', '重复 5 次：', '重複 5 次：', '5 回くりかえす：', 'повтори 5 раз:'),
  clap: t('clap', '拍手', '拍手', '手をたたく', 'хлопок'),
  repeat4: t('repeat 4 times:', '重复 4 次：', '重複 4 次：', '4 回くりかえす：', 'повтори 4 раза:'),
  yes: t('yes', '是', '是', 'はい', 'да'),
  no: t('no', '否', '否', 'いいえ', 'нет'),
  stop: t('stop', '停', '停', 'おわり', 'стоп'),
  jumpInc: t('jump, then i + 1', '跳，然后 i + 1', '跳，然後 i + 1', 'ジャンプして i + 1', 'прыжок, потом i + 1'),
  again: t('again and again', '一遍又一遍', '一遍又一遍', 'なんども なんども', 'снова и снова'),
  was: t('was', '原来是', '原來是', 'まえは', 'было'),
};

/** The same instruction written out five times. */
function jumpCards(l: Locale): Scene {
  const nodes: SceneNode[] = [];
  for (let k = 0; k < 5; k++) nodes.push(box(`j${k}`, 150, 24 + k * 44, LOOP_LABEL.jump[l], { w: 140, h: 36, sans: true, size: 15, tone: 'info' }));
  return { w: W, h: H, nodes };
}

/** A loop written once: the "repeat" line, its body, and an arrow going round. */
function loopBox(header: string, body: string): Scene {
  return {
    w: W,
    h: H,
    nodes: [
      box('rep', 100, 56, header, { w: 240, h: 42, sans: true, size: 16, tone: 'accent' }),
      arrow('in', [220, 101], [220, 124], { tone: 'accent', width: 2.5 }),
      box('j0', 150, 128, body, { w: 140, h: 40, sans: true, size: 15, tone: 'info' }),
      arrow('loop', [292, 148], [344, 77], { via: [[380, 148], [380, 77]], tone: 'accent', width: 2.5 }),
    ],
  };
}

const TURN_X = (n: number) => 64 + (n - 1) * 64;

/** Five turns in a row; the counter i points at the current one. */
function counterScene(i: number): Scene {
  const cells = [1, 2, 3, 4, 5].map((n) =>
    box(`t${n}`, TURN_X(n), 104, String(n), { w: 56, h: 56, size: 20, tone: n < i ? 'ok' : n === i ? 'accent' : 'idle', ring: n === i }),
  );
  return {
    w: W,
    h: H,
    nodes: [chip('ichip', W / 2, 40, seg(['i', 'accent', true], ` = ${i}`), { size: 18 }), ...cells, ...tag('ptr', cells[i - 1], 'i', { side: 'below' })],
  };
}

/** Before each turn the loop checks i; yes → do the turn, no → stop. */
function checkScene(l: Locale): Scene {
  const L = LOOP_LABEL;
  return {
    w: W,
    h: H,
    nodes: [
      diamond('check', 130, 110, 150, 80, 'i ≤ 5?', 'info', { size: 16 }),
      arrow('yes:a', [207, 110], [248, 110], { tone: 'ok', width: 2.5 }),
      text('yes', 226, 100, L.yes[l], { anchor: 'middle', size: 13, bold: true, tone: 'ok' }),
      box('turn', 250, 90, L.jumpInc[l], { w: 172, h: 40, sans: true, size: 14, tone: 'ok' }),
      arrow('back', [336, 88], [130, 68], { via: [[336, 40], [130, 40]], tone: 'accent', width: 2 }),
      arrow('no:a', [130, 152], [130, 186], { tone: 'danger', width: 2.5 }),
      text('no', 142, 174, L.no[l], { size: 13, bold: true, tone: 'danger' }),
      box('stop', 65, 190, L.stop[l], { w: 130, h: 40, sans: true, size: 15, tone: 'danger' }),
    ],
  };
}

/** A game drawing the same picture again and again, with the ball a bit further each time. */
function gameScene(l: Locale): Scene {
  const nodes: SceneNode[] = [];
  for (let k = 0; k < 3; k++) {
    const x = 18 + k * 145;
    nodes.push(
      box(`f${k}`, x, 56, '', { w: 110, h: 96, tone: 'idle' }),
      box(`ball${k}`, x + 12 + k * 30, 90, '', { w: 28, h: 28, shape: 'circle', tone: 'warn' }),
      text(`fn${k}`, x + 55, 50, String(k + 1), { anchor: 'middle', size: 14, bold: true, tone: 'muted' }),
    );
    if (k < 2) nodes.push(arrow(`fa${k}`, [x + 114, 104], [x + 141, 104], { tone: 'accent', width: 2.5 }));
  }
  nodes.push(
    arrow('again:a', [363, 158], [73, 158], { bend: -16, tone: 'accent', width: 2 }),
    chip('again', W / 2, 204, seg(['↻ ', 'accent', true], LOOP_LABEL.again[l]), { sans: true, size: 15 }),
  );
  return { w: W, h: H, nodes };
}

const SUM_X = (n: number) => 90 + (n - 1) * 68;

/**
 * The sum loop: numbers 1–3 to add (4 is where it stops), i pointing at this turn's number, and the
 * running sum below. `sum: null` hides the new sum while the reader guesses; `was` shows the old one.
 */
function sumScene(l: Locale, i: number, opts: { sum: number | null; was?: number; stopped?: boolean }): Scene {
  const cells = [1, 2, 3, 4].map((n) => {
    const tone: Tone = n === 4 ? (opts.stopped ? 'danger' : i === 4 ? 'warn' : 'ghost') : n < i ? 'ok' : n === i ? 'accent' : 'idle';
    return box(`n${n}`, SUM_X(n), 72, String(n), { w: 56, h: 56, size: 20, tone, dashed: n === 4, ring: n === i });
  });
  const nodes: SceneNode[] = [
    chip('rule', W / 2, 14, seg('sum = sum + ', ['i', 'accent', true]), { size: 16 }),
    ...cells,
    ...tag('ptr', cells[i - 1], 'i', { side: 'below' }),
    text('il', 150, 186, 'i', { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'muted' }),
    box('iv', 120, 194, String(i), { w: 60, h: 46, size: 20, tone: 'accent' }),
    text('sl', 290, 186, 'sum', { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'muted' }),
    box('sv', 260, 194, opts.sum === null ? '?' : String(opts.sum), {
      w: 60,
      h: 46,
      size: 20,
      tone: opts.sum === null ? 'warn' : 'ok',
      dashed: opts.sum === null,
      ring: opts.stopped,
    }),
  ];
  if (opts.was !== undefined) nodes.push(text('was', 330, 222, `${LOOP_LABEL.was[l]} ${opts.was}`, { size: 14, tone: 'muted' }));
  if (opts.stopped) nodes.push(text('stopl', SUM_X(4) + 28, 62, LOOP_LABEL.stop[l], { anchor: 'middle', size: 14, bold: true, tone: 'danger' }));
  return { w: W, h: H, nodes };
}

const LOOP_STORY: Record<'boring' | 'loop' | 'counter' | 'check' | 'game', T> = {
  boring: t(
    'Coach says: do 5 jumps. Algo could write "jump" five times, but that is boring!',
    '教练说：跳 5 下。Algo 可以把“跳”写 5 遍，可是好无聊！',
    '教練說：跳 5 下。Algo 可以把「跳」寫 5 遍，可是好無聊！',
    'コーチが「5 回ジャンプ！」と言ったよ。「ジャンプ」を 5 回書いてもいいけど、たいくつだね！',
    'Тренер говорит: сделай 5 прыжков. Можно написать «прыжок» пять раз, но это скучно!',
  ),
  loop: t(
    'A loop says it once: repeat 5 times, jump. The computer does the rest.',
    '循环只说一次：重复 5 次，跳。剩下的交给计算机。',
    '迴圈只說一次：重複 5 次，跳。剩下的交給電腦。',
    'ループなら 1 回書くだけ：「5 回くりかえす：ジャンプ」。あとはコンピュータがやってくれる。',
    'Цикл говорит это один раз: повтори 5 раз — прыжок. Остальное сделает компьютер.',
  ),
  counter: t(
    'To know which turn it is, the loop keeps a counter called i. It goes 1, 2, 3, 4, 5.',
    '为了知道现在是第几次，循环用一个计数器 i 来记：1、2、3、4、5。',
    '為了知道現在是第幾次，迴圈用一個計數器 i 來記：1、2、3、4、5。',
    '今なん回目かをおぼえるために、ループは i というカウンターを使う。1、2、3、4、5 と数えるよ。',
    'Чтобы знать, какой сейчас ход, цикл ведёт счётчик i: 1, 2, 3, 4, 5.',
  ),
  check: t(
    'Before each turn the loop asks: is i still 5 or less? Yes: jump again. No: stop.',
    '每次开始前，循环都会问：i 还不超过 5 吗？是：再跳一次。否：停下。',
    '每次開始前，迴圈都會問：i 還不超過 5 嗎？是：再跳一次。否：停下。',
    'まいかい、ループはたしかめる：i はまだ 5 いか？はい→もう一度ジャンプ。いいえ→おわり。',
    'Перед каждым ходом цикл спрашивает: i ещё не больше 5? Да — снова прыжок. Нет — стоп.',
  ),
  game: t(
    'Games use loops all the time. They draw the picture again and again, so things seem to move.',
    '游戏一直在用循环。它一遍又一遍地画画面，东西看起来就动起来了。',
    '遊戲一直在用迴圈。它一遍又一遍地畫畫面，東西看起來就動起來了。',
    'ゲームはいつもループを使っているよ。画面をなんどもかきなおすから、ものが動いて見えるんだ。',
    'Игры всё время используют циклы: они рисуют картинку снова и снова, и всё будто движется.',
  ),
};

const LOOP_PRACTICE: Record<'start' | 'ask1' | 'ask2' | 'ask3' | 'ask4' | 'done', T> = {
  start: t(
    'This loop adds up 1 + 2 + 3. Each turn it adds i to sum. It starts with sum = 0 and i = 1.',
    '这个循环要算 1 + 2 + 3。每一次都把 i 加到 sum 上。开始时 sum = 0，i = 1。',
    '這個迴圈要算 1 + 2 + 3。每一次都把 i 加到 sum 上。開始時 sum = 0，i = 1。',
    'このループは 1 + 2 + 3 を計算するよ。まいかい sum に i をたす。はじめは sum = 0、i = 1。',
    'Этот цикл считает 1 + 2 + 3. Каждый ход он прибавляет i к sum. Сначала sum = 0 и i = 1.',
  ),
  ask1: t('Turn 1: add i to sum. What is sum now?', '第 1 次：把 i 加到 sum 上。现在 sum 是多少？', '第 1 次：把 i 加到 sum 上。現在 sum 是多少？', '1 回目：sum に i をたす。sum はいくつ？', 'Ход 1: прибавляем i к sum. Чему теперь равна sum?'),
  ask2: t('i goes up to 2. Turn 2: add i again. What is sum now?', 'i 变成 2。第 2 次：再加上 i。现在 sum 是多少？', 'i 變成 2。第 2 次：再加上 i。現在 sum 是多少？', 'i が 2 になった。2 回目：また i をたす。sum はいくつ？', 'i стало 2. Ход 2: снова прибавляем i. Чему теперь равна sum?'),
  ask3: t('Turn 3: i is 3. What is sum after this turn?', '第 3 次：i 是 3。这次之后 sum 是多少？', '第 3 次：i 是 3。這次之後 sum 是多少？', '3 回目：i は 3。この回のあと、sum はいくつ？', 'Ход 3: i равно 3. Какой станет sum после этого хода?'),
  ask4: t(
    'Now i is 4. The loop runs only while i is 3 or less. What happens?',
    '现在 i 是 4。循环只在 i 不超过 3 时才继续。会发生什么？',
    '現在 i 是 4。迴圈只在 i 不超過 3 時才繼續。會發生什麼？',
    'こんどは i が 4。ループは i が 3 いかのあいだだけ回る。どうなる？',
    'Теперь i равно 4. Цикл работает, только пока i не больше 3. Что будет?',
  ),
  done: t(
    'The loop stopped with sum = 6. Three turns from one short rule!',
    '循环停下了，sum = 6。一条短短的规则，跑了 3 次！',
    '迴圈停下了，sum = 6。一條短短的規則，跑了 3 次！',
    'ループがおわって sum = 6。みじかいルール 1 つで 3 回まわったね！',
    'Цикл остановился: sum = 6. Одно короткое правило — три хода!',
  ),
};

const LOOP_CHOICE: Record<'stop' | 'add4' | 'over', T> = {
  stop: t('The loop stops', '循环停下', '迴圈停下', 'ループがおわる', 'Цикл останавливается'),
  add4: t('It adds 4', '加上 4', '加上 4', '4 をたす', 'Прибавляет 4'),
  over: t('It starts over', '从头再来', '從頭再來', 'さいしょからやりなおす', 'Начинает сначала'),
};

const LOOP_EXPLAIN: Record<'e1' | 'e2' | 'e3' | 'e4', T> = {
  e1: t('sum was 0, and 0 + 1 = 1.', 'sum 原来是 0，0 + 1 = 1。', 'sum 原來是 0，0 + 1 = 1。', 'sum は 0 だったから、0 + 1 = 1。', 'sum была 0, а 0 + 1 = 1.'),
  e2: t('sum was 1, and 1 + 2 = 3.', 'sum 原来是 1，1 + 2 = 3。', 'sum 原來是 1，1 + 2 = 3。', 'sum は 1 だったから、1 + 2 = 3。', 'sum была 1, а 1 + 2 = 3.'),
  e3: t('sum was 3, and 3 + 3 = 6.', 'sum 原来是 3，3 + 3 = 6。', 'sum 原來是 3，3 + 3 = 6。', 'sum は 3 だったから、3 + 3 = 6。', 'sum была 3, а 3 + 3 = 6.'),
  e4: t(
    'i is 4, which is more than 3, so the loop is finished.',
    'i 是 4，比 3 大，所以循环结束了。',
    'i 是 4，比 3 大，所以迴圈結束了。',
    'i は 4 で 3 より大きい。だからループはおしまい。',
    'i равно 4 — это больше 3, поэтому цикл закончен.',
  ),
};

const LOOP_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t(
    'A loop says: repeat 4 times, clap. How many claps do you hear?',
    '循环说：重复 4 次，拍手。你会听到几下拍手？',
    '迴圈說：重複 4 次，拍手。你會聽到幾下拍手？',
    'ループに「4 回くりかえす：手をたたく」と書いた。手をたたく音は何回聞こえる？',
    'Цикл: повтори 4 раза — хлопок. Сколько хлопков ты услышишь?',
  ),
  q1e: t(
    'The loop claps once on every turn, and there are 4 turns.',
    '每一次都拍一下，一共 4 次。',
    '每一次都拍一下，一共 4 次。',
    '1 回まわるごとに 1 回たたく。ぜんぶで 4 回だよ。',
    'За каждый ход — один хлопок, а ходов 4.',
  ),
  q2: t(
    'i counts 1, 2, 3 and so on. The loop runs while i is 5 or less. How many turns?',
    'i 从 1 开始数：1、2、3……循环在 i 不超过 5 时运行。一共几次？',
    'i 從 1 開始數：1、2、3……迴圈在 i 不超過 5 時執行。一共幾次？',
    'i は 1、2、3…と数える。i が 5 いかのあいだループが回る。何回まわる？',
    'i считает 1, 2, 3 и так далее. Цикл работает, пока i не больше 5. Сколько ходов?',
  ),
  q2e: t(
    'One turn each for i = 1, 2, 3, 4 and 5. When i becomes 6, the loop stops.',
    'i = 1、2、3、4、5 各一次。i 变成 6 时，循环停下。',
    'i = 1、2、3、4、5 各一次。i 變成 6 時，迴圈停下。',
    'i = 1、2、3、4、5 で 1 回ずつ。i が 6 になったらおわり。',
    'По ходу при i = 1, 2, 3, 4 и 5. Когда i станет 6, цикл остановится.',
  ),
  q3: t('Why do programmers use loops?', '程序员为什么用循环？', '程式設計師為什麼用迴圈？', 'プログラマーがループを使うのはなぜ？', 'Зачем программисты используют циклы?'),
  q3a: t('To repeat steps without writing them again', '不用重写就能重复步骤', '不用重寫就能重複步驟', '同じ手順を書きなおさずにくりかえせるから', 'Чтобы повторять шаги, не переписывая их'),
  q3b: t('To make the computer slower', '让计算机变慢', '讓電腦變慢', 'コンピュータをおそくするため', 'Чтобы компьютер работал медленнее'),
  q3c: t('To draw circles', '为了画圆圈', '為了畫圓圈', 'まるをかくため', 'Чтобы рисовать круги'),
  q3e: t(
    'Write the steps once, and the loop repeats them as many times as needed.',
    '步骤只写一次，循环就能按需要重复很多次。',
    '步驟只寫一次，迴圈就能按需要重複很多次。',
    '手順は 1 回書くだけ。ひつような回数だけ、ループがくりかえしてくれる。',
    'Шаги пишут один раз, а цикл повторяет их столько, сколько нужно.',
  ),
};

const loops: LessonContent = {
  story(l): StorySlide[] {
    const S = LOOP_STORY;
    return [
      { scene: jumpCards(l), say: S.boring[l] },
      { scene: loopBox(LOOP_LABEL.repeat5[l], LOOP_LABEL.jump[l]), say: S.loop[l] },
      { scene: counterScene(3), say: S.counter[l] },
      { scene: checkScene(l), say: S.check[l] },
      { scene: gameScene(l), say: S.game[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = LOOP_PRACTICE;
    const E = LOOP_EXPLAIN;
    const C = LOOP_CHOICE;
    return [
      { scene: sumScene(l, 1, { sum: 0 }), say: P.start[l] },
      { scene: sumScene(l, 1, { sum: null, was: 0 }), say: P.ask1[l], ask: ask(P.ask1[l], [0, 1, 2], 1, E.e1[l]) },
      { scene: sumScene(l, 2, { sum: null, was: 1 }), say: P.ask2[l], ask: ask(P.ask2[l], [2, 3, 4], 3, E.e2[l]) },
      { scene: sumScene(l, 3, { sum: null, was: 3 }), say: P.ask3[l], ask: ask(P.ask3[l], [5, 6, 7], 6, E.e3[l]) },
      {
        scene: sumScene(l, 4, { sum: 6 }),
        say: P.ask4[l],
        ask: pick(P.ask4[l], [['stop', C.stop[l]], ['add4', C.add4[l]], ['over', C.over[l]]], 'stop', E.e4[l]),
      },
      { scene: sumScene(l, 4, { sum: 6, stopped: true }), say: P.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = LOOP_QUIZ;
    return [
      { ...ask(Q.q1[l], [1, 4, 8], 4, Q.q1e[l]), scene: loopBox(LOOP_LABEL.repeat4[l], LOOP_LABEL.clap[l]) },
      ask(Q.q2[l], [4, 5, 6], 5, Q.q2e[l]),
      pick(Q.q3[l], [['repeat', Q.q3a[l]], ['slower', Q.q3b[l]], ['circles', Q.q3c[l]]], 'repeat', Q.q3e[l]),
    ];
  },
};

// ── Recursion: a box in a box ─────────────────────────────────────────

const NEST_TONES: Tone[] = ['info', 'ok', 'warn', 'accent'];

const dollLabel = (l: Locale, n: number) =>
  ({ en: `doll ${n}`, zh: `娃娃 ${n}`, 'zh-hant': `娃娃 ${n}`, ja: `にんぎょう ${n}`, ru: `матрёшка ${n}` })[l];

const REC_LABEL: Record<'smallest' | 'myFiles' | 'photos' | 'trip' | 'sea' | 'sun', T> = {
  smallest: t('smallest', '最小', '最小', 'いちばん小さい', 'самая маленькая'),
  myFiles: t('My files', '我的文件', '我的檔案', 'わたしのファイル', 'Мои файлы'),
  photos: t('Photos', '照片', '相片', 'しゃしん', 'Фото'),
  trip: t('Trip', '旅行', '旅行', 'りょこう', 'Поездка'),
  sea: t('sea.jpg', '大海.jpg', '大海.jpg', 'うみ.jpg', 'море.jpg'),
  sun: t('sun.jpg', '太阳.jpg', '太陽.jpg', 'たいよう.jpg', 'солнце.jpg'),
};

/** Nested panels, outermost first; each one sits inside the one before. */
const nestBox = (k: number) => ({ x: 20 + 30 * k, y: 14 + 30 * k, w: 400 - 60 * k, h: 232 - 40 * k });

function nest(labels: string[], inner: SceneNode[] = []): Scene {
  const nodes: SceneNode[] = labels.map((label, k) => {
    const b = nestBox(k);
    return region(`r${k}`, b.x, b.y, b.w, b.h, { label, labelAt: 'inside', tone: NEST_TONES[k] });
  });
  return { w: W, h: H, nodes: [...nodes, ...inner] };
}

/** Dolls 4, 3, … nested, `n` of them visible; `question` puts a "?" in the innermost one, `counted` numbers them on the way out. */
function dolls(l: Locale, n: number, opts: { question?: boolean; smallest?: boolean; counted?: boolean } = {}): Scene {
  const labels = Array.from({ length: n }, (_, k) => dollLabel(l, 4 - k));
  const inner = nestBox(n - 1);
  const cy = inner.y + inner.h / 2 + 10;
  const extra: SceneNode[] = [];
  if (opts.question) extra.push(box('q', W / 2 - 24, cy - 24, '?', { w: 48, h: 48, size: 24, dashed: true, tone: 'warn' }));
  if (opts.smallest) extra.push(chip('small', W / 2, cy - 14, REC_LABEL.smallest[l], { sans: true, size: 14, tone: 'ok' }));
  if (opts.counted) {
    // Counting on the way out: 1 in the tiniest doll, then 2, 3, 4, each in the top right corner of its doll.
    for (let k = 0; k < n; k++) {
      const b = nestBox(n - 1 - k);
      extra.push(box(`cnt${k}`, b.x + b.w - 34, b.y + 3, String(k + 1), { w: 26, h: 26, shape: 'circle', size: 14, tone: 'accent', ring: k === n - 1 }));
    }
  }
  return nest(labels, extra);
}

/** Folders inside folders, with two photos in the innermost one. */
function folders(l: Locale): Scene {
  const L = REC_LABEL;
  return nest(
    [L.myFiles[l], L.photos[l], L.trip[l]],
    [
      box('f1', 100, 130, L.sea[l], { w: 110, h: 56, sans: true, size: 14, tone: 'idle' }),
      box('f2', 230, 130, L.sun[l], { w: 110, h: 56, sans: true, size: 14, tone: 'idle' }),
    ],
  );
}

/**
 * Totals worked out recursively, one row per problem from `top` down: "n + ?" asks for the total
 * of the smaller copy below it. `shown` rows are visible; `known` holds the totals worked out so far.
 */
function totals(top: number, shown: number, known: Record<number, number>, opts: { ring?: number } = {}): Scene {
  const nodes: SceneNode[] = [];
  let above: BoxNode | null = null;
  for (let k = 0; k < shown; k++) {
    const n = top - k;
    const y = 22 + k * 56;
    const cx = 30 + k * 30;
    const bx = cx + 50;
    const circle = box(`c${n}`, cx, y, String(n), { w: 40, h: 40, shape: 'circle', size: 16, tone: NEST_TONES[k] });
    const below = known[n - 1];
    const label =
      n === 1
        ? known[1] === undefined
          ? seg(['?', 'warn', true])
          : seg(['1', undefined, true])
        : seg(`${n} + `, below === undefined ? ['?', 'warn', true] : [String(below), 'ok', true]);
    nodes.push(circle, box(`b${n}`, bx, y, label, { w: 150, h: 40, size: 18, tone: 'idle', dashed: n === 1 && known[1] === undefined }));
    if (above) nodes.push(link(`d${n}`, above, circle, { dashed: true, tone: 'muted' }));
    const total = known[n];
    if (total !== undefined) {
      const ax = bx + 162;
      nodes.push(chip(`a${n}`, ax, y + 6, `= ${total}`, { align: 'start', size: 16, tone: opts.ring === n ? 'accent' : 'ok', ring: opts.ring === n }));
      if (k > 0) nodes.push(arrow(`u${n}`, [ax + 18, y + 3], [bx + 100, y - 14], { bend: 6, tone: 'accent', width: 2 }));
    }
    above = circle;
  }
  return { w: W, h: H, nodes };
}

const REC_STORY: Record<'dolls' | 'idea' | 'stop' | 'back' | 'folders', T> = {
  dolls: t(
    'Here is a set of nesting dolls. Open the big doll, and there is a smaller doll inside!',
    '这是一套套娃。打开大娃娃，里面还有一个小一点的娃娃！',
    '這是一組俄羅斯娃娃。打開大娃娃，裡面還有一個小一點的娃娃！',
    'これはマトリョーシカ。大きいにんぎょうを開けると、中にひとまわり小さいにんぎょうが！',
    'Вот набор матрёшек. Открываешь большую — а внутри матрёшка поменьше!',
  ),
  idea: t(
    'Opening a doll is the same job each time, just smaller. Solving a problem with a smaller copy of itself is called recursion.',
    '每次打开娃娃都是同一件事，只是娃娃变小了。用更小的同类问题来解决问题，就叫递归。',
    '每次打開娃娃都是同一件事，只是娃娃變小了。用更小的同類問題來解決問題，就叫遞迴。',
    'にんぎょうを開けるのは、まいかい同じしごと。小さくなるだけ。小さい同じもんだいを使ってとくことを「再帰（さいき）」というよ。',
    'Открыть матрёшку — каждый раз то же самое, только меньше. Решать задачу через её уменьшенную копию — это рекурсия.',
  ),
  stop: t(
    'Keep opening until the tiniest doll. It does not open, so this is where we stop.',
    '一直打开到最小的娃娃。它打不开了，我们就在这里停下。',
    '一直打開到最小的娃娃。它打不開了，我們就在這裡停下。',
    'いちばん小さいにんぎょうまで開けていく。それはもう開かないから、ここでストップ。',
    'Открываем, пока не дойдём до самой маленькой. Она не открывается — здесь мы останавливаемся.',
  ),
  back: t(
    'Now we go back out, one doll at a time, counting as we go: 1, 2, 3, 4 dolls!',
    '然后一层一层往外走，边走边数：1、2、3、4，一共 4 个娃娃！',
    '然後一層一層往外走，邊走邊數：1、2、3、4，一共 4 個娃娃！',
    'こんどは外へもどりながら数えよう：1、2、3、4。にんぎょうは 4 つ！',
    'Теперь возвращаемся наружу по одной и считаем: 1, 2, 3, 4 матрёшки!',
  ),
  folders: t(
    'Computers do this with folders. To find every photo, open a folder, then the folders inside it, and so on.',
    '计算机找文件也这样做：打开一个文件夹，再打开里面的文件夹，一层层找到所有照片。',
    '電腦找檔案也這樣做：打開一個資料夾，再打開裡面的資料夾，一層層找到所有相片。',
    'コンピュータもフォルダでこれをするよ。フォルダを開けて、中のフォルダも開けて…ぜんぶのしゃしんを見つける。',
    'Компьютер так ищет файлы: открывает папку, потом папки внутри неё, и так далее, пока не найдёт все фото.',
  ),
};

const REC_PRACTICE: Record<'start' | 'down' | 'ask1' | 'ask2' | 'ask3' | 'ask4' | 'done', T> = {
  start: t(
    'Let us add 1 + 2 + 3 + 4 the recursive way. Algo says: the total up to 4 is 4 + the total up to 3.',
    '我们用递归来算 1 + 2 + 3 + 4。Algo 说：前 4 个数的和 = 4 + 前 3 个数的和。',
    '我們用遞迴來算 1 + 2 + 3 + 4。Algo 說：前 4 個數的和 = 4 + 前 3 個數的和。',
    '再帰で 1 + 2 + 3 + 4 を計算しよう。Algo の考え：4 までのごうけい = 4 + 3 までのごうけい。',
    'Посчитаем 1 + 2 + 3 + 4 рекурсией. Algo говорит: сумма до 4 — это 4 + сумма до 3.',
  ),
  down: t(
    'The same problem keeps getting smaller: 3 + the total up to 2, then 2 + the total up to 1.',
    '同一个问题，越变越小：3 + 前 2 个数的和，再到 2 + 前 1 个数的和。',
    '同一個問題，越變越小：3 + 前 2 個數的和，再到 2 + 前 1 個數的和。',
    '同じもんだいが、どんどん小さくなる：3 + 2 までのごうけい、つぎは 2 + 1 までのごうけい。',
    'Та же задача, только меньше: 3 + сумма до 2, а потом 2 + сумма до 1.',
  ),
  ask1: t(
    'We reached the smallest problem: the total up to 1. What is it?',
    '到了最小的问题：前 1 个数的和。它是多少？',
    '到了最小的問題：前 1 個數的和。它是多少？',
    'いちばん小さいもんだいについた：1 までのごうけい。いくつ？',
    'Дошли до самой маленькой задачи: сумма до 1. Сколько это?',
  ),
  ask2: t(
    'Now we climb back up. The total up to 2 is 2 + 1. What is it?',
    '现在往回走。前 2 个数的和是 2 + 1。等于多少？',
    '現在往回走。前 2 個數的和是 2 + 1。等於多少？',
    'こんどは上へもどろう。2 までのごうけいは 2 + 1。いくつ？',
    'Теперь поднимаемся обратно. Сумма до 2 — это 2 + 1. Сколько?',
  ),
  ask3: t('Up again: 3 + 3. What is the total up to 3?', '再往上：3 + 3。前 3 个数的和是多少？', '再往上：3 + 3。前 3 個數的和是多少？', 'また上へ：3 + 3。3 までのごうけいは？', 'Ещё выше: 3 + 3. Чему равна сумма до 3?'),
  ask4: t('Last row: 4 + 6. What is the total up to 4?', '最上面一行：4 + 6。前 4 个数的和是多少？', '最上面一行：4 + 6。前 4 個數的和是多少？', 'いちばん上の行：4 + 6。4 までのごうけいは？', 'Верхняя строчка: 4 + 6. Чему равна сумма до 4?'),
  done: t(
    '1 + 2 + 3 + 4 = 10! We went down to the smallest problem, then climbed back up with the answers.',
    '1 + 2 + 3 + 4 = 10！先往下走到最小的问题，再带着答案一层层往回走。',
    '1 + 2 + 3 + 4 = 10！先往下走到最小的問題，再帶著答案一層層往回走。',
    '1 + 2 + 3 + 4 = 10！いちばん小さいもんだいまで下りて、こたえをもって上へもどったね。',
    '1 + 2 + 3 + 4 = 10! Мы спустились до самой маленькой задачи и поднялись обратно с ответами.',
  ),
};

const REC_EXPLAIN: Record<'e1' | 'e2' | 'e3' | 'e4', T> = {
  e1: t(
    'It is just 1. No smaller copy is needed, so we stop going down.',
    '就是 1。不需要更小的问题了，所以不再往下走。',
    '就是 1。不需要更小的問題了，所以不再往下走。',
    '1 だけだから 1。もっと小さいもんだいはいらない。下へ行くのはここでおしまい。',
    'Это просто 1. Меньшая копия не нужна — дальше вниз не идём.',
  ),
  e2: t('2 + 1 = 3. We carry 3 up to the next row.', '2 + 1 = 3。把 3 带到上一行。', '2 + 1 = 3。把 3 帶到上一行。', '2 + 1 = 3。3 を上の行へもっていく。', '2 + 1 = 3. Несём 3 на строчку выше.'),
  e3: t('3 + 3 = 6, the same as 1 + 2 + 3.', '3 + 3 = 6，正好等于 1 + 2 + 3。', '3 + 3 = 6，正好等於 1 + 2 + 3。', '3 + 3 = 6。1 + 2 + 3 と同じだね。', '3 + 3 = 6 — столько же, сколько 1 + 2 + 3.'),
  e4: t('4 + 6 = 10. The top row has its answer!', '4 + 6 = 10。最上面一行也有答案了！', '4 + 6 = 10。最上面一行也有答案了！', '4 + 6 = 10。いちばん上の行にもこたえが出た！', '4 + 6 = 10. У верхней строчки есть ответ!'),
};

const REC_QUIZ: Record<'q1' | 'q1a' | 'q1b' | 'q1c' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3a' | 'q3b' | 'q3c' | 'q3e', T> = {
  q1: t('In recursion, when do we stop going deeper?', '递归什么时候停止往下走？', '遞迴什麼時候停止往下走？', '再帰は、いつ下へ行くのをやめる？', 'Когда рекурсия перестаёт идти вглубь?'),
  q1a: t(
    'At the smallest problem, which we can answer right away',
    '到了最小的、马上能回答的问题',
    '到了最小的、馬上能回答的問題',
    'すぐこたえがわかる、いちばん小さいもんだいについたとき',
    'На самой маленькой задаче, ответ на которую ясен сразу',
  ),
  q1b: t('Never: it goes on forever', '永远不停', '永遠不停', 'ずっとやめない', 'Никогда — она идёт бесконечно'),
  q1c: t('After exactly 3 steps', '刚好走 3 步之后', '剛好走 3 步之後', 'ちょうど 3 回のあと', 'Ровно через 3 шага'),
  q1e: t(
    'The smallest problem is like the tiniest doll: its answer is known without opening anything. That is where we stop.',
    '最小的问题就像最小的娃娃，不用再打开就知道答案。我们就在那里停下。',
    '最小的問題就像最小的娃娃，不用再打開就知道答案。我們就在那裡停下。',
    'いちばん小さいもんだいは、いちばん小さいにんぎょうと同じ。もう開けなくてもこたえがわかるから、そこでストップ。',
    'Самая маленькая задача — как самая маленькая матрёшка: ответ ясен без открывания. Там и останавливаемся.',
  ),
  q2: t(
    'The total up to 3 is 3 + the total up to 2. The total up to 2 is 2 + 1. What is the total up to 3?',
    '前 3 个数的和 = 3 + 前 2 个数的和，前 2 个数的和 = 2 + 1。前 3 个数的和是多少？',
    '前 3 個數的和 = 3 + 前 2 個數的和，前 2 個數的和 = 2 + 1。前 3 個數的和是多少？',
    '3 までのごうけい = 3 + 2 までのごうけい。2 までのごうけい = 2 + 1。3 までのごうけいは？',
    'Сумма до 3 = 3 + сумма до 2. Сумма до 2 = 2 + 1. Чему равна сумма до 3?',
  ),
  q2e: t('Going up: 2 + 1 = 3, then 3 + 3 = 6.', '往回算：2 + 1 = 3，然后 3 + 3 = 6。', '往回算：2 + 1 = 3，然後 3 + 3 = 6。', '上へもどると：2 + 1 = 3、つぎに 3 + 3 = 6。', 'Поднимаемся: 2 + 1 = 3, потом 3 + 3 = 6.'),
  q3: t('Which of these is most like recursion?', '下面哪个最像递归？', '下面哪個最像遞迴？', '再帰ににているのはどれ？', 'Что больше всего похоже на рекурсию?'),
  q3a: t('Folders inside folders inside folders', '文件夹里套文件夹，再套文件夹', '資料夾裡套資料夾，再套資料夾', 'フォルダの中のフォルダの中のフォルダ', 'Папки в папках внутри папок'),
  q3b: t('A line of people at a shop', '商店门口排的队', '商店門口排的隊', 'お店の前の行列', 'Очередь в магазине'),
  q3c: t('A row of lockers', '一排储物柜', '一排置物櫃', 'ならんだロッカー', 'Ряд шкафчиков'),
  q3e: t(
    'Each folder can hold smaller folders, just like each doll holds a smaller doll.',
    '每个文件夹里还能放更小的文件夹，就像每个娃娃里还有更小的娃娃。',
    '每個資料夾裡還能放更小的資料夾，就像每個娃娃裡還有更小的娃娃。',
    'フォルダの中には小さいフォルダが入る。にんぎょうの中に小さいにんぎょうがあるのと同じ。',
    'В каждой папке могут быть папки поменьше — как в каждой матрёшке есть матрёшка поменьше.',
  ),
};

const recursion: LessonContent = {
  story(l): StorySlide[] {
    const S = REC_STORY;
    return [
      { scene: dolls(l, 2), say: S.dolls[l] },
      { scene: dolls(l, 3, { question: true }), say: S.idea[l] },
      { scene: dolls(l, 4, { smallest: true }), say: S.stop[l] },
      { scene: dolls(l, 4, { smallest: true, counted: true }), say: S.back[l] },
      { scene: folders(l), say: S.folders[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = REC_PRACTICE;
    const E = REC_EXPLAIN;
    return [
      { scene: totals(4, 1, {}), say: P.start[l] },
      { scene: totals(4, 3, {}), say: P.down[l] },
      { scene: totals(4, 4, {}), say: P.ask1[l], ask: ask(P.ask1[l], [0, 1, 2], 1, E.e1[l]) },
      { scene: totals(4, 4, { 1: 1 }), say: P.ask2[l], ask: ask(P.ask2[l], [2, 3, 4], 3, E.e2[l]) },
      { scene: totals(4, 4, { 1: 1, 2: 3 }), say: P.ask3[l], ask: ask(P.ask3[l], [5, 6, 7], 6, E.e3[l]) },
      { scene: totals(4, 4, { 1: 1, 2: 3, 3: 6 }), say: P.ask4[l], ask: ask(P.ask4[l], [9, 10, 11], 10, E.e4[l]) },
      { scene: totals(4, 4, { 1: 1, 2: 3, 3: 6, 4: 10 }, { ring: 4 }), say: P.done[l] },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = REC_QUIZ;
    return [
      pick(Q.q1[l], [['smallest', Q.q1a[l]], ['never', Q.q1b[l]], ['three', Q.q1c[l]]], 'smallest', Q.q1e[l]),
      { ...ask(Q.q2[l], [5, 6, 7], 6, Q.q2e[l]), scene: totals(3, 3, { 1: 1 }) },
      pick(Q.q3[l], [['folders', Q.q3a[l]], ['line', Q.q3b[l]], ['lockers', Q.q3c[l]]], 'folders', Q.q3e[l]),
    ];
  },
};

// ── Fast or slow? ─────────────────────────────────────────────────────

const SPEED_LABEL: Record<'one' | 'halve' | 'pairs' | 'items' | 'steps' | 'wayA' | 'wayB' | 'goal' | 'cards8' | 'pairs4', T> = {
  one: t('one by one', '一个一个', '一個一個', 'ひとつずつ', 'по одному'),
  halve: t('halving', '对半分', '對半分', 'はんぶんに', 'пополам'),
  pairs: t('every pair', '每一对', '每一對', 'ぜんぶのペア', 'все пары'),
  items: t('items', '东西的个数', '東西的個數', 'ものの数', 'предметы'),
  steps: t('steps', '步数', '步數', 'ステップ', 'шаги'),
  wayA: t('way A', '方法 A', '方法 A', 'やり方 A', 'способ А'),
  wayB: t('way B', '方法 B', '方法 B', 'やり方 B', 'способ Б'),
  goal: t('goal', '终点', '終點', 'ゴール', 'финиш'),
  cards8: t('8 cards → 8 steps', '8 张卡片 → 8 步', '8 張卡片 → 8 步', 'カード 8 まい → 8 ステップ', '8 карточек → 8 шагов'),
  pairs4: t('4 cards → 6 pairs', '4 张卡片 → 6 对', '4 張卡片 → 6 對', 'カード 4 まい → 6 ペア', '4 карточки → 6 пар'),
};

const stepsLabel = (l: Locale, n: number) =>
  ({ en: `${n} steps`, zh: `${n} 步`, 'zh-hant': `${n} 步`, ja: `${n} ステップ`, ru: `${n} ${ruCount(n, 'шаг', 'шага', 'шагов')}` })[l];

/** Two ways to the same goal: many small steps or a few big hops. */
function twoWays(l: Locale): Scene {
  const L = SPEED_LABEL;
  const nodes: SceneNode[] = [];
  const row = (id: string, cy: number, label: string, xs: number[], tone: Tone, hops: boolean) => {
    nodes.push(text(`${id}l`, 16, cy + 5, label, { size: 15, bold: true, tone }));
    const dots = xs.map((x, k) => box(`${id}${k}`, x - 13, cy - 13, String(k + 1), { w: 26, h: 26, shape: 'circle', size: 13, tone }));
    const goal = box(`${id}g`, 378, cy - 18, L.goal[l], { w: 54, h: 36, sans: true, size: 13, tone: 'idle' });
    nodes.push(...dots, goal);
    if (hops) dots.forEach((d, k) => nodes.push(link(`${id}h${k}`, d, dots[k + 1] ?? goal, { bend: -12, tone, width: 2 })));
    nodes.push(text(`${id}n`, 240, cy + 40, stepsLabel(l, xs.length), { anchor: 'middle', size: 14, bold: true, tone }));
  };
  row('a', 70, L.wayA[l], [118, 152, 186, 220, 254, 288, 322, 356], 'warn', false);
  row('b', 180, L.wayB[l], [140, 220, 300], 'ok', true);
  return { w: W, h: H, nodes };
}

const CARDS = [7, 3, 12, 5, 9, 14, 2, 6];
const cardX = (i: number) => 32 + i * 48;

/** Eight cards, each looked at once to find the biggest. */
function scanScene(l: Locale): Scene {
  const nodes: SceneNode[] = [chip('head', W / 2, 30, SPEED_LABEL.cards8[l], { sans: true, size: 15, tone: 'warn' })];
  CARDS.forEach((v, i) => {
    nodes.push(
      box(`k${i}`, cardX(i), 100, String(v), { w: 40, h: 52, size: 17, tone: v === 14 ? 'ok' : 'info', ring: v === 14 }),
      text(`s${i}`, cardX(i) + 20, 176, String(i + 1), { anchor: 'middle', mono: true, size: 13, tone: 'muted' }),
    );
  });
  return { w: W, h: H, nodes };
}

/** Guessing a number from 1 to 8: each hint keeps half the cards, 8 → 4 → 2 → 1. */
function halvingScene(): Scene {
  const keep: [number, number][] = [
    [0, 7],
    [4, 7],
    [6, 7],
    [6, 6],
  ];
  const nodes: SceneNode[] = [];
  keep.forEach(([lo, hi], r) => {
    const y = 34 + r * 58;
    nodes.push(text(`cnt${r}`, 32, y + 23, String(hi - lo + 1), { anchor: 'middle', size: 16, bold: true, tone: 'accent' }));
    for (let i = lo; i <= hi; i++) {
      const last = r === keep.length - 1;
      nodes.push(box(r === 0 ? `k${i}` : `h${r}-${i}`, 60 + i * 46, y, String(i + 1), { w: 40, h: 34, size: 15, tone: last ? 'ok' : 'info', ring: last }));
    }
  });
  return { w: W, h: H, nodes };
}

/** Four cards with an arc for every pair. */
function pairsScene(l: Locale): Scene {
  const xs = [76, 172, 268, 364];
  const nodes: SceneNode[] = [chip('head', W / 2, 16, SPEED_LABEL.pairs4[l], { sans: true, size: 15, tone: 'danger' })];
  xs.forEach((a, i) =>
    xs.slice(i + 1).forEach((b, j) => nodes.push(arrow(`pr${i}-${i + j + 1}`, [a, 146], [b, 146], { head: 'none', bend: -(b - a) / 4, tone: 'danger', width: 2 }))),
  );
  xs.forEach((x, i) => nodes.push(box(`p${i}`, x - 28, 150, String(i + 1), { w: 56, h: 56, size: 18, tone: 'info' })));
  return { w: W, h: H, nodes };
}

/** How the steps grow with the number of items, for the three ways. */
function growthScene(l: Locale): Scene {
  const L = SPEED_LABEL;
  const x0 = 60;
  const y0 = 34;
  const pw = 290;
  const ph = 180;
  const xMax = 16;
  const yMax = 20;
  const px = (v: number) => x0 + (v / xMax) * pw;
  const py = (v: number) => y0 + ph - (v / yMax) * ph;
  const curve = (id: string, f: (n: number) => number, tone: Tone) => {
    const pts: [number, number][] = [];
    for (let k = 0; k <= 60; k++) {
      const n = 1 + ((xMax - 1) * k) / 60;
      const v = f(n);
      if (v > yMax) {
        // Find where the curve leaves the top of the chart.
        let lo = pts.length ? 1 + ((xMax - 1) * (k - 1)) / 60 : 1;
        let hi = n;
        for (let s = 0; s < 20; s++) {
          const mid = (lo + hi) / 2;
          if (f(mid) > yMax) hi = mid;
          else lo = mid;
        }
        pts.push([px(lo), py(yMax)]);
        break;
      }
      pts.push([px(n), py(v)]);
    }
    const d = pts.map(([a, b], k) => `${k ? 'L' : 'M'} ${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
    return { node: { kind: 'path' as const, id, d, tone, width: 3.5 }, end: pts[pts.length - 1] };
  };
  const pairs = curve('cpairs', (n) => (n * (n - 1)) / 2, 'danger');
  const one = curve('cone', (n) => n, 'warn');
  const halve = curve('chalve', (n) => Math.log2(n), 'ok');
  return {
    w: W,
    h: H,
    nodes: [
      arrow('ax', [x0, y0 + ph], [x0 + pw + 14, y0 + ph], { tone: 'muted', width: 1.5 }),
      arrow('ay', [x0, y0 + ph], [x0, y0 - 14], { tone: 'muted', width: 1.5 }),
      text('xl', x0 + pw / 2, y0 + ph + 26, L.items[l], { anchor: 'middle', size: 13, tone: 'muted' }),
      text('yl', x0 + 10, y0 - 4, L.steps[l], { size: 13, tone: 'muted' }),
      pairs.node,
      one.node,
      halve.node,
      text('lpairs', pairs.end[0] + 8, pairs.end[1] + 12, L.pairs[l], { size: 14, bold: true, tone: 'danger' }),
      text('lone', one.end[0] + 6, one.end[1] + 5, L.one[l], { size: 14, bold: true, tone: 'warn' }),
      text('lhalve', halve.end[0] + 6, halve.end[1] + 5, L.halve[l], { size: 14, bold: true, tone: 'ok' }),
    ],
  };
}

/** 1000 names: one by one vs halving, as two bars. */
function bigScene(l: Locale): Scene {
  const L = SPEED_LABEL;
  return {
    w: W,
    h: H,
    nodes: [
      text('l1', 146, 105, L.one[l], { anchor: 'end', size: 15, bold: true, tone: 'warn' }),
      box('bar1', 156, 76, '1000', { w: 270, h: 46, size: 18, tone: 'warn' }),
      text('l2', 146, 175, L.halve[l], { anchor: 'end', size: 15, bold: true, tone: 'ok' }),
      box('bar2', 156, 146, '10', { w: 40, h: 46, size: 18, tone: 'ok', ring: true }),
    ],
  };
}

/** Eight cards 1–8; `split` draws the halfway line. */
function cardRow(opts: { split?: boolean; scan?: boolean } = {}): Scene {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < 8; i++) nodes.push(box(`k${i}`, cardX(i), 100, String(i + 1), { w: 40, h: 52, size: 17, tone: opts.scan && i === 0 ? 'accent' : 'info', ring: opts.scan && i === 0 }));
  if (opts.scan) nodes.push(arrow('scan', [cardX(0) + 20, 80], [cardX(7) + 20, 80], { dashed: true, tone: 'accent', width: 2.5 }));
  if (opts.split) nodes.push({ kind: 'path', id: 'split', d: `M ${cardX(4) - 4} 82 L ${cardX(4) - 4} 170`, tone: 'danger', width: 3, dashed: true });
  return { w: W, h: H, nodes };
}

/** Sixteen small cards in a row. */
function cards16(): Scene {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < 16; i++) nodes.push(box(`k${i}`, 14 + i * 26, 100, String(i + 1), { w: 22, h: 44, size: 13, tone: 'info' }));
  return { w: W, h: H, nodes };
}

/** Steps for 8 cards with each way, as bars. */
function barsScene(l: Locale): Scene {
  const L = SPEED_LABEL;
  const base = 206;
  const bars: [string, number, Tone, string][] = [
    ['halve', 3, 'ok', L.halve[l]],
    ['one', 8, 'warn', L.one[l]],
    ['pairs', 28, 'danger', L.pairs[l]],
  ];
  const nodes: SceneNode[] = [{ kind: 'path', id: 'base', d: `M 30 ${base} L 410 ${base}`, tone: 'idle', width: 3 }];
  bars.forEach(([id, v, tone, label], k) => {
    const cx = 92 + k * 128;
    const h = v * 5;
    nodes.push(
      box(`bar:${id}`, cx - 42, base - h, '', { w: 84, h, tone }),
      text(`v:${id}`, cx, base - h - 10, String(v), { anchor: 'middle', size: 17, bold: true, tone }),
      text(`l:${id}`, cx, base + 24, label, { anchor: 'middle', size: 14, bold: true, tone }),
    );
  });
  return { w: W, h: H, nodes };
}

/** 16 → 8 → 4 → 2 → 1, one arrow per halving. */
function halvingChain(): Scene {
  const nodes: SceneNode[] = [];
  const vals = [16, 8, 4, 2, 1];
  const boxes = vals.map((v, k) => box(`hc${k}`, 30 + k * 82, 106, String(v), { w: 52, h: 48, size: 18, tone: k === 4 ? 'ok' : 'info' }));
  boxes.forEach((b, k) => {
    if (boxes[k + 1]) nodes.push(link(`ha${k}`, b, boxes[k + 1], { tone: 'accent', width: 2.5 }));
  });
  nodes.push(...boxes);
  return { w: W, h: H, nodes };
}

const SPEED_STORY: Record<'ways' | 'scan' | 'halve' | 'pairs' | 'grow' | 'big', T> = {
  ways: t(
    'Two ways can both reach the answer, but one may take many more steps. Let us count steps!',
    '两种方法都能得到答案，但其中一种可能要多走很多步。我们来数一数步数！',
    '兩種方法都能得到答案，但其中一種可能要多走很多步。我們來數一數步數！',
    'どちらのやり方でもこたえは出る。でも、ステップがずっと多いこともあるよ。数えてみよう！',
    'Два способа могут оба привести к ответу, но одному нужно гораздо больше шагов. Давай считать шаги!',
  ),
  scan: t(
    'To find the biggest card, Algo must look at every card once. 8 cards take 8 steps.',
    '要找出最大的卡片，Algo 必须把每张卡片都看一遍。8 张卡片要 8 步。',
    '要找出最大的卡片，Algo 必須把每張卡片都看一遍。8 張卡片要 8 步。',
    'いちばん大きいカードを見つけるには、ぜんぶのカードを 1 回ずつ見るしかない。8 まいなら 8 ステップ。',
    'Чтобы найти самую большую карточку, нужно посмотреть каждую. 8 карточек — 8 шагов.',
  ),
  halve: t(
    'Guess a number from 1 to 8 with "higher" or "lower" hints. Each hint throws away half: 8, 4, 2, 1. Just 3 steps!',
    '猜 1 到 8 之间的数，每次提示“大了”或“小了”。每次都扔掉一半：8、4、2、1。只要 3 步！',
    '猜 1 到 8 之間的數，每次提示「大了」或「小了」。每次都丟掉一半：8、4、2、1。只要 3 步！',
    '1 から 8 の数をあてよう。ヒントは「もっと大きい」「もっと小さい」。まいかい半分へる：8、4、2、1。たった 3 ステップ！',
    'Угадай число от 1 до 8 по подсказкам «больше» и «меньше». Каждая убирает половину: 8, 4, 2, 1. Всего 3 шага!',
  ),
  pairs: t(
    'Now Algo compares every card with every other card. 4 cards make 6 pairs, and 8 cards make 28!',
    '这次 Algo 要把每张卡片和其他每张都比一比。4 张卡片有 6 对，8 张就有 28 对！',
    '這次 Algo 要把每張卡片和其他每張都比一比。4 張卡片有 6 對，8 張就有 28 對！',
    'こんどは、どのカードもほかのぜんぶのカードとくらべる。4 まいで 6 ペア、8 まいだと 28 ペア！',
    'Теперь Algo сравнивает каждую карточку с каждой. 4 карточки — 6 пар, а 8 карточек — уже 28!',
  ),
  grow: t(
    'Add more items and watch the steps grow. Halving barely grows. One by one grows steadily. Every pair shoots up!',
    '东西越多，步数怎么长？对半分几乎不长，一个一个稳稳地长，每一对一下子冲上天！',
    '東西越多，步數怎麼長？對半分幾乎不長，一個一個穩穩地長，每一對一下子衝上天！',
    'ものがふえると、ステップはどうふえる？はんぶんにするのはほとんどふえない。ひとつずつはじわじわ。ぜんぶのペアはぐんぐんふえる！',
    'Чем больше предметов, тем больше шагов. «Пополам» почти не растёт, «по одному» растёт ровно, а «все пары» взлетают!',
  ),
  big: t(
    'That is why programmers count steps. Among 1000 names in ABC order, one by one can take 1000 looks. Halving needs only 10!',
    '所以程序员很在意步数。在按顺序排好的 1000 个名字里找，一个一个找可能要 1000 次，对半分只要 10 次！',
    '所以程式設計師很在意步數。在按順序排好的 1000 個名字裡找，一個一個找可能要 1000 次，對半分只要 10 次！',
    'だからプログラマーはステップを数えるんだ。じゅんばんにならんだ 1000 人の名前からさがすと、ひとつずつなら 1000 回、はんぶんにするなら 10 回だけ！',
    'Поэтому программисты считают шаги. Среди 1000 имён по алфавиту поиск по одному может занять 1000 шагов, а пополам — всего 10!',
  ),
};

const SPEED_PRACTICE: Record<'start' | 'ask1' | 'ask2' | 'ask3' | 'bars' | 'ask4', T> = {
  start: t(
    'Here are 8 number cards, in order from 1 to 8. Let us count the steps for three ways.',
    '这里有 8 张数字卡片，从 1 排到 8。我们来数数三种方法各要几步。',
    '這裡有 8 張數字卡片，從 1 排到 8。我們來數數三種方法各要幾步。',
    '1 から 8 のカードが、じゅんばんにならんでいるよ。3 つのやり方のステップを数えよう。',
    'Вот 8 карточек с числами от 1 до 8 по порядку. Посчитаем шаги для трёх способов.',
  ),
  ask1: t('Way 1: look at every card once. How many steps?', '方法 1：每张卡片看一次。要几步？', '方法 1：每張卡片看一次。要幾步？', 'やり方 1：カードを 1 まいずつぜんぶ見る。何ステップ？', 'Способ 1: смотрим каждую карточку по разу. Сколько шагов?'),
  ask2: t(
    'Way 2: throw away half the cards each time, until 1 card is left. How many times?',
    '方法 2：每次扔掉一半卡片，直到只剩 1 张。要几次？',
    '方法 2：每次丟掉一半卡片，直到只剩 1 張。要幾次？',
    'やり方 2：まいかいカードを半分すてて、1 まいになるまでつづける。何回？',
    'Способ 2: каждый раз убираем половину карточек, пока не останется одна. Сколько раз?',
  ),
  ask3: t(
    'Way 3: compare every pair of cards. 4 cards make 6 pairs. How many pairs do 8 cards make?',
    '方法 3：每两张卡片比一次。4 张有 6 对。8 张有几对？',
    '方法 3：每兩張卡片比一次。4 張有 6 對。8 張有幾對？',
    'やり方 3：2 まいずつ、ぜんぶのペアをくらべる。4 まいなら 6 ペア。8 まいなら何ペア？',
    'Способ 3: сравниваем каждую пару карточек. 4 карточки дают 6 пар. А сколько пар у 8?',
  ),
  bars: t(
    'Same 8 cards, very different work: 3, 8 and 28 steps!',
    '同样是 8 张卡片，工作量差好多：3 步、8 步、28 步！',
    '同樣是 8 張卡片，工作量差好多：3 步、8 步、28 步！',
    '同じ 8 まいでも、しごとの量が大ちがい：3、8、28 ステップ！',
    'Те же 8 карточек, а работы совсем по-разному: 3, 8 и 28 шагов!',
  ),
  ask4: t('Now there are 16 cards. Which way needs the fewest steps?', '现在有 16 张卡片。哪种方法步数最少？', '現在有 16 張卡片。哪種方法步數最少？', 'こんどはカードが 16 まい。いちばんステップが少ないのは？', 'Теперь карточек 16. Какому способу нужно меньше всего шагов?'),
};

const SPEED_CHOICE: Record<'halve' | 'one' | 'pairs', T> = {
  halve: t('Halving', '对半分', '對半分', 'はんぶんにする', 'Пополам'),
  one: t('One by one', '一个一个看', '一個一個看', 'ひとつずつ見る', 'По одному'),
  pairs: t('Every pair', '每一对都比', '每一對都比', 'ぜんぶのペアをくらべる', 'Все пары'),
};

const SPEED_EXPLAIN: Record<'e1' | 'e2' | 'e3' | 'e4', T> = {
  e1: t('One look per card: 8 cards, 8 steps.', '每张看一次：8 张卡片，8 步。', '每張看一次：8 張卡片，8 步。', '1 まいに 1 回：8 まいで 8 ステップ。', 'По одному взгляду на карточку: 8 карточек — 8 шагов.'),
  e2: t('8 → 4 → 2 → 1: three halvings.', '8 → 4 → 2 → 1：分了 3 次。', '8 → 4 → 2 → 1：分了 3 次。', '8 → 4 → 2 → 1：3 回だね。', '8 → 4 → 2 → 1: три раза пополам.'),
  e3: t(
    'Card 1 pairs with 7 others, card 2 with 6 more, and so on: 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28.',
    '卡片 1 和另外 7 张配对，卡片 2 再和 6 张配对，依此类推：7 + 6 + 5 + 4 + 3 + 2 + 1 = 28。',
    '卡片 1 和另外 7 張配對，卡片 2 再和 6 張配對，依此類推：7 + 6 + 5 + 4 + 3 + 2 + 1 = 28。',
    'カード 1 はほかの 7 まいと、カード 2 はのこりの 6 まいと…：7 + 6 + 5 + 4 + 3 + 2 + 1 = 28。',
    'Карточка 1 образует пары с 7 другими, карточка 2 — ещё с 6, и так далее: 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28.',
  ),
  e4: t(
    'Halving needs just 4 steps for 16 cards. One by one needs 16, and every pair needs 120!',
    '16 张卡片对半分只要 4 步。一个一个要 16 步，每一对要 120 步！',
    '16 張卡片對半分只要 4 步。一個一個要 16 步，每一對要 120 步！',
    '16 まいでも、はんぶんにするなら 4 ステップ。ひとつずつなら 16、ぜんぶのペアなら 120！',
    'Пополам — всего 4 шага для 16 карточек. По одному — 16, а все пары — 120!',
  ),
};

const SPEED_QUIZ: Record<'q1' | 'q1e' | 'q2' | 'q2e' | 'q3' | 'q3e', T> = {
  q1: t(
    'Which way grows fastest when there are more items?',
    '东西变多时，哪种方法的步数长得最快？',
    '東西變多時，哪種方法的步數長得最快？',
    'ものがふえたとき、ステップがいちばん速くふえるのは？',
    'У какого способа шаги растут быстрее всего, когда предметов больше?',
  ),
  q1e: t(
    'Every new item has to be compared with all the others, so the pairs pile up very fast.',
    '每多一个东西，都要和其他所有东西比一遍，所以配对数涨得飞快。',
    '每多一個東西，都要和其他所有東西比一遍，所以配對數漲得飛快。',
    'ひとつふえるたびに、ほかのぜんぶとくらべるから、ペアがどんどんふえる。',
    'Каждый новый предмет надо сравнить со всеми остальными, поэтому пар становится очень много.',
  ),
  q2: t(
    'One by one, 10 cards take 10 steps. How many steps for 20 cards?',
    '一个一个看，10 张卡片要 10 步。20 张要几步？',
    '一個一個看，10 張卡片要 10 步。20 張要幾步？',
    'ひとつずつ見ると、10 まいで 10 ステップ。20 まいなら？',
    'По одному: 10 карточек — 10 шагов. А сколько шагов для 20?',
  ),
  q2e: t(
    'One look per card, so twice the cards means twice the steps.',
    '每张看一次，卡片多一倍，步数也多一倍。',
    '每張看一次，卡片多一倍，步數也多一倍。',
    '1 まいに 1 回だから、カードが 2 ばいならステップも 2 ばい。',
    'По шагу на карточку: карточек вдвое больше — и шагов вдвое больше.',
  ),
  q3: t(
    'Halving 16 cards: 16 → 8 → 4 → 2 → 1. How many steps is that?',
    '对半分 16 张卡片：16 → 8 → 4 → 2 → 1。一共几步？',
    '對半分 16 張卡片：16 → 8 → 4 → 2 → 1。一共幾步？',
    '16 まいをはんぶんにしていく：16 → 8 → 4 → 2 → 1。何ステップ？',
    'Делим 16 карточек пополам: 16 → 8 → 4 → 2 → 1. Сколько это шагов?',
  ),
  q3e: t(
    'Count the arrows: 4 halvings. 8 cards took 3, so twice the cards added just 1 step.',
    '数数箭头：分了 4 次。8 张卡片要 3 次，卡片多了一倍，只多了 1 步。',
    '數數箭頭：分了 4 次。8 張卡片要 3 次，卡片多了一倍，只多了 1 步。',
    'やじるしを数えると 4 回。8 まいなら 3 回だった。カードが 2 ばいでも、ふえたのは 1 ステップだけ。',
    'Считаем стрелки: 4 раза. Для 8 карточек было 3 — карточек вдвое больше, а шаг добавился всего один.',
  ),
};

const speed: LessonContent = {
  story(l): StorySlide[] {
    const S = SPEED_STORY;
    return [
      { scene: twoWays(l), say: S.ways[l] },
      { scene: scanScene(l), say: S.scan[l] },
      { scene: halvingScene(), say: S.halve[l] },
      { scene: pairsScene(l), say: S.pairs[l] },
      { scene: growthScene(l), say: S.grow[l] },
      { scene: bigScene(l), say: S.big[l] },
    ];
  },
  practice(l): PracticeStep[] {
    const P = SPEED_PRACTICE;
    const E = SPEED_EXPLAIN;
    const C = SPEED_CHOICE;
    return [
      { scene: cardRow(), say: P.start[l] },
      { scene: cardRow({ scan: true }), say: P.ask1[l], ask: ask(P.ask1[l], [3, 8, 28], 8, E.e1[l]) },
      { scene: cardRow({ split: true }), say: P.ask2[l], ask: ask(P.ask2[l], [3, 4, 8], 3, E.e2[l]) },
      { scene: pairsScene(l), say: P.ask3[l], ask: ask(P.ask3[l], [8, 16, 28], 28, E.e3[l]) },
      { scene: barsScene(l), say: P.bars[l] },
      {
        scene: cards16(),
        say: P.ask4[l],
        ask: pick(P.ask4[l], [['halve', C.halve[l]], ['one', C.one[l]], ['pairs', C.pairs[l]]], 'halve', E.e4[l]),
      },
    ];
  },
  quiz(l): KidQuestion[] {
    const Q = SPEED_QUIZ;
    const C = SPEED_CHOICE;
    return [
      pick(Q.q1[l], [['pairs', C.pairs[l]], ['one', C.one[l]], ['halve', C.halve[l]]], 'pairs', Q.q1e[l]),
      ask(Q.q2[l], [10, 20, 40], 20, Q.q2e[l]),
      { ...ask(Q.q3[l], [4, 8, 16], 4, Q.q3e[l]), scene: halvingChain() },
    ];
  },
};

const LESSONS: Record<string, LessonContent> = { algorithms, loops, recursion, speed };

export default LESSONS;
