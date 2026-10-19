import type { Locale } from '../../i18n/locale';
import { arrow, box, chip, pair, pairWidth, region, seg, text } from '../kit';
import type { Figure, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';

type T = Record<Locale, string>;

const fmt = (s: string, vars: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));

const W = 440;
const q = (s: string) => `"${s}"`;

const WORD: Record<'key' | 'value' | 'index' | 'hash' | 'buckets' | 'chains' | 'notFound', T> = {
  key: { en: 'key', zh: 'key', 'zh-hant': 'key', ja: 'key', ru: 'key' },
  value: { en: 'value', zh: 'value', 'zh-hant': 'value', ja: 'value', ru: 'value' },
  index: { en: 'index', zh: '索引', 'zh-hant': '索引', ja: 'インデックス', ru: 'индекс' },
  hash: { en: 'hash function', zh: '哈希函数', 'zh-hant': '雜湊函式', ja: 'ハッシュ関数', ru: 'хеш-функция' },
  buckets: { en: 'bucket array', zh: '桶数组', 'zh-hant': '桶陣列', ja: 'バケット配列', ru: 'массив корзин' },
  chains: { en: 'linked lists of colliding pairs', zh: '冲突键值对组成的链表', 'zh-hant': '衝突鍵值對組成的鏈結串列', ja: '衝突したペアの連結リスト', ru: 'списки столкнувшихся пар' },
  notFound: { en: 'not found', zh: '未找到', 'zh-hant': '未找到', ja: '見つからない', ru: 'не найдено' },
};

const STUDENTS: [number, string][] = [
  [12836, 'Ha'],
  [15937, 'Luo'],
  [16750, 'Suan'],
  [13276, 'Fa'],
  [10583, 'Ya'],
];

// ── Lookup: key → value ───────────────────────────────────────────────

const LOOKUP_SAY: Record<'init' | 'query', T> = {
  init: {
    en: 'A hash table stores key-value pairs: here, student IDs (keys) and names (values).',
    zh: '哈希表存储键值对：这里的键是学号，值是姓名。',
    'zh-hant': '雜湊表儲存鍵值對：這裡的鍵是學號，值是姓名。',
    ja: 'ハッシュテーブルはキーと値のペアを保存します。ここではキーが学籍番号、値が名前です。',
    ru: 'Хеш-таблица хранит пары «ключ — значение»: здесь ключ — номер студента, значение — имя.',
  },
  query: {
    en: 'map[{k}]: give the key, get the value {v} directly, in O(1), without scanning the other pairs.',
    zh: 'map[{k}]：输入键，直接得到值 {v}，时间为 O(1)，无须遍历其他键值对。',
    'zh-hant': 'map[{k}]：輸入鍵，直接得到值 {v}，時間為 O(1)，無須走訪其他鍵值對。',
    ja: 'map[{k}]：キーを渡すと、他のペアを調べずに値 {v} が O(1) で得られます。',
    ru: 'map[{k}]: по ключу сразу получаем значение {v} за O(1), не просматривая остальные пары.',
  },
};

const hashTableLookup: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', query: 'done' },
  build(l) {
    const x0 = 96;
    const colW = 62;
    const step = colW + 6;
    const scene = (hl: number | null) => {
      const nodes: SceneNode[] = [
        region('tbl', x0 - 10, 18, step * 5 + 14, 98, { tone: 'info' }),
        text('l:k', x0 - 20, 46, WORD.key[l], { anchor: 'end', mono: true, bold: true, size: 13, tone: 'ok' }),
        text('l:v', x0 - 20, 92, WORD.value[l], { anchor: 'end', mono: true, bold: true, size: 13, tone: 'info' }),
      ];
      STUDENTS.forEach(([k, v], i) => {
        const x = x0 + i * step;
        const on = hl === i;
        nodes.push(
          box(`k${i}`, x, 26, k, { w: colW, h: 32, size: 13, tone: on ? 'accent' : 'ok', ring: on }),
          box(`v${i}`, x, 72, q(v), { w: colW, h: 32, size: 13, tone: on ? 'accent' : 'info', ring: on }),
          arrow(`a${i}`, [x + colW / 2, 59], [x + colW / 2, 70], { tone: on ? 'accent' : 'muted', width: 1.25 }),
        );
      });
      if (hl !== null) {
        const [k, v] = STUDENTS[hl];
        nodes.push(chip('q', W / 2, 140, seg(`map[`, [String(k), 'ok', true], `]  →  `, [q(v), 'accent', true]), { size: 14 }));
      }
      return { w: W, h: 182, nodes };
    };
    return {
      frames: [
        { kind: 'init', scene: scene(null), say: LOOKUP_SAY.init[l] },
        { kind: 'query', scene: scene(3), say: fmt(LOOKUP_SAY.query[l], { k: 13276, v: q('Fa') }), call: 'map[13276]' },
        { kind: 'query', scene: scene(1), say: fmt(LOOKUP_SAY.query[l], { k: 15937, v: q('Luo') }), call: 'map[15937]' },
      ],
    };
  },
};

// ── Hash function: key → index → value ────────────────────────────────

const BUCKETS: { idx: number; key: number; val: string }[] = [
  { idx: 36, key: 12836, val: 'Ha' },
  { idx: 37, key: 15937, val: 'Luo' },
  { idx: 50, key: 16750, val: 'Suan' },
  { idx: 76, key: 13276, val: 'Fa' },
  { idx: 83, key: 10583, val: 'Ya' },
];

/** The scene shared by the hash-function and collision figures: a key flows through `key % 100` into a bucket. */
function hashFlow(l: Locale, flow: { key: number; tone: Tone; out: string; outTone: Tone } | null) {
  const rowY = (k: number) => 34 + k * 46;
  const px = 258;
  const fx = 84;
  const fw = 120;
  const nodes: SceneNode[] = [
    region('fn', fx, 24, fw, 220, { tone: 'info', label: WORD.hash[l], labelAt: 'inside' }),
    text('fn:f', fx + fw / 2, 70, 'key % 100', { anchor: 'middle', mono: true, bold: true, size: 14, tone: 'info' }),
    region('arr', px - 8, 22, pairWidth() + 16, 5 * 46 + 4, { tone: 'info' }),
  ];
  BUCKETS.forEach((b, k) => {
    const target = flow !== null && flow.key % 100 === b.idx;
    nodes.push(
      text(`i${k}`, px - 16, rowY(k) + 21, String(b.idx), { anchor: 'end', mono: true, size: 13, tone: target ? 'accent' : 'muted', bold: target }),
      ...pair(`b${k}`, px, rowY(k), b.key, q(b.val), { ring: target, tone: target ? flow!.outTone : undefined }),
    );
    if (k > 1 && k < 5) nodes.push(text(`dots${k}`, px - 24, rowY(k) - 4, '⋮', { anchor: 'middle', size: 11, tone: 'muted' }));
  });
  if (flow) {
    const k = BUCKETS.findIndex((b) => b.idx === flow.key % 100);
    const y = rowY(k) + 16;
    const ox = px + pairWidth() + 16;
    nodes.push(
      box(`key${flow.key}`, 4, 118, flow.key, { w: 62, h: 32, size: 13, tone: flow.tone }),
      arrow(`ka${flow.key}`, [68, 134], [fx - 2, 134], { tone: flow.tone }),
      chip(`calc${flow.key}`, fx + fw / 2, 120, seg(`${flow.key} % 100 = `, [String(flow.key % 100), 'accent', true]), { size: 10 }),
      arrow(`ia${flow.key}`, [fx + fw + 2, 134], [px - 40, y], { bend: k > 2 ? 10 : -10, tone: flow.tone }),
      arrow(`oa${flow.key}`, [px + pairWidth() + 2, y], [ox - 2, y], { tone: flow.outTone }),
      box(`out${flow.key}`, ox, y - 16, q(flow.out), { w: 48, h: 32, size: 12, tone: flow.outTone }),
    );
  }
  return { w: W, h: 270, nodes };
}

const HASH_FN_SAY: Record<'init' | 'lookup', T> = {
  init: {
    en: 'Inside, a hash table is an array of buckets. A hash function turns each key into a bucket index.',
    zh: '哈希表内部是一个桶数组。哈希函数把每个键转换为桶的索引。',
    'zh-hant': '雜湊表內部是一個桶陣列。雜湊函式把每個鍵轉換為桶的索引。',
    ja: 'ハッシュテーブルの中身はバケットの配列です。ハッシュ関数がキーをバケットのインデックスに変換します。',
    ru: 'Внутри хеш-таблица — массив корзин. Хеш-функция превращает каждый ключ в индекс корзины.',
  },
  lookup: {
    en: 'Look up {k}: {k} % 100 = {i}, so read bucket {i} and get {v}.',
    zh: '查询 {k}：{k} % 100 = {i}，读取桶 {i}，得到 {v}。',
    'zh-hant': '查詢 {k}：{k} % 100 = {i}，讀取桶 {i}，得到 {v}。',
    ja: '{k} を検索：{k} % 100 = {i} なのでバケット {i} を読み、{v} を得ます。',
    ru: 'Ищем {k}: {k} % 100 = {i}, читаем корзину {i} и получаем {v}.',
  },
};

const hashFunction: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', lookup: 'done' },
  build(l) {
    const frames: SceneFrame[] = [{ kind: 'init', scene: hashFlow(l, null), say: HASH_FN_SAY.init[l] }];
    for (const key of [12836, 16750, 13276]) {
      const b = BUCKETS.find((x) => x.idx === key % 100)!;
      frames.push({
        kind: 'lookup',
        scene: hashFlow(l, { key, tone: 'info', out: b.val, outTone: 'ok' }),
        say: fmt(HASH_FN_SAY.lookup[l], { k: key, i: b.idx, v: q(b.val) }),
        call: `get(${key})`,
      });
    }
    return { frames };
  },
};

const COLLISION_SAY: Record<'first' | 'second', T> = {
  first: {
    en: 'get(12836): 12836 % 100 = 36, bucket 36 holds "Ha". Correct.',
    zh: 'get(12836)：12836 % 100 = 36，桶 36 中是 "Ha"。正确。',
    'zh-hant': 'get(12836)：12836 % 100 = 36，桶 36 中是 "Ha"。正確。',
    ja: 'get(12836)：12836 % 100 = 36、バケット 36 には "Ha"。正しい結果です。',
    ru: 'get(12836): 12836 % 100 = 36, в корзине 36 лежит "Ha". Верно.',
  },
  second: {
    en: 'get(20336): 20336 % 100 = 36 too. Two different keys map to the same bucket: a hash collision. Without extra handling the table returns the wrong value.',
    zh: 'get(20336)：20336 % 100 也等于 36。两个不同的键对应同一个桶，这就是哈希冲突。不加处理就会返回错误的值。',
    'zh-hant': 'get(20336)：20336 % 100 也等於 36。兩個不同的鍵對應同一個桶，這就是雜湊衝突。不加處理就會回傳錯誤的值。',
    ja: 'get(20336)：20336 % 100 も 36 です。異なるキーが同じバケットに対応する、これがハッシュ衝突です。対策しないと誤った値を返します。',
    ru: 'get(20336): 20336 % 100 тоже 36. Два разных ключа попали в одну корзину — это хеш-коллизия. Без особой обработки таблица вернёт не то значение.',
  },
};

const hashCollision: StepFigure = {
  type: 'steps',
  tones: { lookup: 'done', collide: 'swp' },
  build(l) {
    return {
      frames: [
        { kind: 'lookup', scene: hashFlow(l, { key: 12836, tone: 'info', out: 'Ha', outTone: 'ok' }), say: COLLISION_SAY.first[l], call: 'get(12836)' },
        { kind: 'collide', scene: hashFlow(l, { key: 20336, tone: 'warn', out: 'Ha', outTone: 'danger' }), say: COLLISION_SAY.second[l], call: 'get(20336)' },
      ],
    };
  },
};

// ── Resizing: capacity 100 → 200 ──────────────────────────────────────

const RESIZE_SAY: Record<'init' | 'collide' | 'grow' | 'rehash', T> = {
  init: {
    en: 'A table with capacity 100 and hash(key) = key % 100 holds three pairs, at buckets 36, 50 and 83.',
    zh: '容量为 100、哈希函数为 key % 100 的哈希表中有三个键值对，位于桶 36、50、83。',
    'zh-hant': '容量為 100、雜湊函式為 key % 100 的雜湊表中有三個鍵值對，位於桶 36、50、83。',
    ja: '容量 100、ハッシュ関数 key % 100 のテーブルに 3 つのペアがあり、バケット 36、50、83 に入っています。',
    ru: 'В таблице ёмкостью 100 с хешем key % 100 три пары — в корзинах 36, 50 и 83.',
  },
  collide: {
    en: 'put(236, "D"): 236 % 100 = 36, but bucket 36 is taken by 136. Collision.',
    zh: 'put(236, "D")：236 % 100 = 36，但桶 36 已被 136 占用，发生冲突。',
    'zh-hant': 'put(236, "D")：236 % 100 = 36，但桶 36 已被 136 佔用，發生衝突。',
    ja: 'put(236, "D")：236 % 100 = 36 ですが、バケット 36 は 136 が使っています。衝突です。',
    ru: 'put(236, "D"): 236 % 100 = 36, но корзина 36 занята ключом 136. Коллизия.',
  },
  grow: {
    en: 'Expand: double the capacity to 200. The hash function becomes key % 200, so every pair must be placed again.',
    zh: '扩容：容量翻倍为 200，哈希函数变为 key % 200，所有键值对都要重新放置。',
    'zh-hant': '擴容：容量翻倍為 200，雜湊函式變為 key % 200，所有鍵值對都要重新放置。',
    ja: '拡張：容量を 2 倍の 200 にします。ハッシュ関数は key % 200 になるので、すべてのペアを置き直します。',
    ru: 'Расширение: ёмкость удваивается до 200, хеш становится key % 200 — каждую пару нужно разместить заново.',
  },
  rehash: {
    en: 'Rehashed: 136 → 136, 550 → 150, 783 → 183, and 236 → 36. Each key now has its own bucket. Moving every pair costs O(n), which is why resizing is done rarely.',
    zh: '重新哈希后：136 → 136，550 → 150，783 → 183，236 → 36，每个键都有了自己的桶。迁移所有键值对需要 O(n)，所以扩容不宜频繁。',
    'zh-hant': '重新雜湊後：136 → 136，550 → 150，783 → 183，236 → 36，每個鍵都有了自己的桶。遷移所有鍵值對需要 O(n)，所以擴容不宜頻繁。',
    ja: '再ハッシュ後：136 → 136、550 → 150、783 → 183、236 → 36。どのキーも別々のバケットに入りました。全ペアの移動は O(n) なので、拡張はまれにしか行いません。',
    ru: 'После перехеширования: 136 → 136, 550 → 150, 783 → 183, 236 → 36 — у каждого ключа своя корзина. Перенос всех пар стоит O(n), поэтому расширяют таблицу редко.',
  },
};

const hashTableResize: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', collide: 'swp', grow: 'cmp', rehash: 'done' },
  build(l) {
    const px = 150;
    const rowY = (k: number) => 64 + k * 50;
    const pairs: Record<string, [number, string]> = { A: [136, 'A'], B: [550, 'B'], C: [783, 'C'], D: [236, 'D'] };
    const header = (cap: number, tone: Tone) =>
      chip('hdr', W / 2, 12, seg('capacity = ', [String(cap), tone, true], '   hash(key) = key % ', [String(cap), tone, true]), { size: 13 });
    const scene = (cap: number, rows: { idx: number; id?: keyof typeof pairs; tone?: Tone; ring?: boolean }[], side: { id: keyof typeof pairs; tone: Tone } | null, capTone: Tone = 'info') => {
      const nodes: SceneNode[] = [header(cap, capTone), region('arr', px - 8, rowY(0) - 8, pairWidth() + 16, rows.length * 50 + 6, { tone: 'info' })];
      rows.forEach((r, k) => {
        nodes.push(text(`idx${r.idx}`, px - 18, rowY(k) + 21, String(r.idx), { anchor: 'end', mono: true, size: 13, tone: 'muted' }));
        if (r.id) {
          const [key, v] = pairs[r.id];
          nodes.push(...pair(`p${r.id}`, px, rowY(k), key, q(v), { tone: r.tone, ring: r.ring }));
        } else {
          nodes.push(box(`empty${k}`, px, rowY(k), '', { w: pairWidth(), h: 32, tone: 'ghost', dashed: true }));
        }
      });
      if (side) {
        const [key, v] = pairs[side.id];
        nodes.push(...pair(`p${side.id}`, 300, rowY(0), key, q(v), { tone: side.tone }), arrow('clash', [298, rowY(0) + 16], [px + pairWidth() + 6, rowY(0) + 16], { tone: 'danger', dashed: true }));
      }
      return { w: W, h: 290, nodes };
    };
    const old = [
      { idx: 36, id: 'A' as const },
      { idx: 50, id: 'B' as const },
      { idx: 83, id: 'C' as const },
    ];
    return {
      frames: [
        { kind: 'init', scene: scene(100, old, null), say: RESIZE_SAY.init[l] },
        {
          kind: 'collide',
          scene: scene(100, [{ idx: 36, id: 'A', tone: 'danger', ring: true }, old[1], old[2]], { id: 'D', tone: 'warn' }),
          say: RESIZE_SAY.collide[l],
          call: 'put(236, "D")',
        },
        {
          kind: 'grow',
          scene: scene(200, [{ idx: 36 }, { idx: 136 }, { idx: 150 }, { idx: 183 }], { id: 'D', tone: 'warn' }, 'accent'),
          say: RESIZE_SAY.grow[l],
          call: 'extend()',
        },
        {
          kind: 'rehash',
          scene: scene(200, [
            { idx: 36, id: 'D', tone: 'accent' },
            { idx: 136, id: 'A', tone: 'accent' },
            { idx: 150, id: 'B', tone: 'accent' },
            { idx: 183, id: 'C', tone: 'accent' },
          ], null, 'accent'),
          say: RESIZE_SAY.rehash[l],
          call: 'extend()',
        },
      ],
    };
  },
};

// ── Separate chaining ─────────────────────────────────────────────────

const CHAINS: [string, [number, string][]][] = [
  ['00', [[200, 'A'], [500, 'F'], [300, 'J']]],
  ['37', [[937, 'B'], [637, 'G'], [437, 'K'], [237, 'M']]],
  ['50', [[750, 'C'], [850, 'H']]],
  ['76', [[276, 'D']]],
  ['83', [[583, 'E'], [683, 'I'], [283, 'L']]],
];

const hashTableChaining: StaticFigure = {
  type: 'static',
  build(l) {
    const kw = 40;
    const vw = 28;
    const pw = pairWidth(kw, vw);
    const stepX = pw + 26;
    const x0 = 48;
    const rowY = (k: number) => 36 + k * 46;
    const nodes: SceneNode[] = [
      region('arr', x0 - 8, 26, pw + 16, CHAINS.length * 46 + 2, { tone: 'info', label: WORD.buckets[l] }),
      region('chains', x0 + pw + 14, 26, W - (x0 + pw + 14) - 4, CHAINS.length * 46 + 2, { tone: 'ok', label: WORD.chains[l] }),
    ];
    CHAINS.forEach(([idx, items], k) => {
      const y = rowY(k);
      nodes.push(text(`i${idx}`, x0 - 16, y + 18, idx, { anchor: 'end', mono: true, size: 12, tone: 'muted' }));
      items.forEach(([key, v], j) => {
        const x = x0 + j * stepX;
        nodes.push(...pair(`c${idx}-${j}`, x, y, key, v, { kw, vw, h: 28 }));
        if (j > 0) nodes.push(arrow(`e${idx}-${j}`, [x - 26 + 1, y + 14], [x - 3, y + 14]));
      });
    });
    return {
      scene: { w: W, h: rowY(CHAINS.length) + 4, nodes },
      notes: [
        {
          en: 'Separate chaining with hash(key) = key % 100: keys with the same last two digits collide, and each bucket keeps them in a linked list.',
          zh: '链式地址，哈希函数为 key % 100：末两位相同的键会冲突，每个桶用链表存放它们。',
          'zh-hant': '鏈結位址，雜湊函式為 key % 100：末兩位相同的鍵會衝突，每個桶用鏈結串列存放它們。',
          ja: 'チェイン法（ハッシュ関数 key % 100）：下 2 桁が同じキーは衝突し、各バケットはそれらを連結リストで持ちます。',
          ru: 'Метод цепочек, хеш key % 100: ключи с одинаковыми двумя последними цифрами сталкиваются, и каждая корзина хранит их в связном списке.',
        }[l],
      ],
    };
  },
};

// ── Open addressing: linear probing ───────────────────────────────────

type Slot = { key: number; v: string } | null | 'tomb';

/** A column of buckets 0–2 and 76–80, with a probe arrow at the bucket being checked. */
function probeScene(
  l: Locale,
  slots: Record<number, Slot>,
  opts: { probe?: number; probeTone?: Tone; hl?: Record<number, Tone>; key?: { key: number; v?: string; tone: Tone }; note?: { text: string; tone: Tone } },
) {
  const order = [0, 1, 2, 76, 77, 78, 79, 80];
  const px = 252;
  const y0 = 26;
  const rowY = (k: number) => y0 + k * 38 + (k >= 3 ? 18 : 0);
  const nodes: SceneNode[] = [region('arr', px - 8, y0 - 8, pairWidth() + 16, rowY(order.length - 1) - y0 + 48, { tone: 'info' })];
  order.forEach((idx, k) => {
    const s = slots[idx] ?? null;
    const y = rowY(k);
    const tone = opts.hl?.[idx];
    nodes.push(text(`i${idx}`, px - 18, y + 20, String(idx).padStart(2, '0'), { anchor: 'end', mono: true, size: 13, tone: opts.probe === idx ? opts.probeTone ?? 'accent' : 'muted', bold: opts.probe === idx }));
    if (s === null) nodes.push(box(`s${idx}`, px, y, '', { w: pairWidth(), h: 30, tone: tone ?? 'ghost', dashed: true }));
    else if (s === 'tomb') nodes.push(box(`s${idx}`, px, y, 'TOMBSTONE', { w: pairWidth(), h: 30, size: 11, tone: tone ?? 'muted' }));
    else nodes.push(...pair(`p${s.key}`, px, y, String(s.key).padStart(3, '0'), s.v, { h: 30, tone, ring: tone !== undefined }));
  });
  nodes.push(text('dots', px - 26, rowY(3) - 8, '⋮', { anchor: 'middle', size: 13, tone: 'muted' }));
  if (opts.probe !== undefined) {
    const k = order.indexOf(opts.probe);
    const y = rowY(k) + 15;
    nodes.push(arrow('probe', [px - 64, y], [px - 46, y], { tone: opts.probeTone ?? 'accent', width: 2.25 }));
  }
  if (opts.key) {
    nodes.push(
      chip(
        'op',
        16,
        34,
        seg(opts.key.v ? `put(` : 'get(', [String(opts.key.key), opts.key.tone, true], opts.key.v ? `, ${opts.key.v})` : ')'),
        { align: 'start', size: 13 },
      ),
      text('hash', 16, 84, seg(`${opts.key.key} % 100 = `, [String(opts.key.key % 100), 'accent', true]), { mono: true, size: 13 }),
    );
  }
  if (opts.note) nodes.push(text('note', 16, 116, opts.note.text, { size: 13, bold: true, tone: opts.note.tone }));
  return { w: W, h: rowY(order.length - 1) + 44, nodes };
}

const PROBE_SAY: Record<'init' | 'hash' | 'taken' | 'free' | 'place', T> = {
  init: {
    en: 'Open addressing keeps every pair in the array itself. With linear probing, a collision tries the next bucket, then the next, until one is free.',
    zh: '开放寻址把所有键值对直接存放在数组中。线性探测遇到冲突时，依次尝试下一个桶，直到找到空桶。',
    'zh-hant': '開放定址把所有鍵值對直接存放在陣列中。線性探查遇到衝突時，依次嘗試下一個桶，直到找到空桶。',
    ja: 'オープンアドレス法では、すべてのペアを配列そのものに入れます。線形探査では、衝突したら次のバケット、その次…と空きが見つかるまで試します。',
    ru: 'При открытой адресации все пары лежат прямо в массиве. При линейном пробировании в случае коллизии проверяем следующую корзину, потом следующую — пока не найдём свободную.',
  },
  hash: {
    en: 'put({k}): {k} % 100 = 76. Start at bucket 76.',
    zh: 'put({k})：{k} % 100 = 76，从桶 76 开始。',
    'zh-hant': 'put({k})：{k} % 100 = 76，從桶 76 開始。',
    ja: 'put({k})：{k} % 100 = 76。バケット 76 から始めます。',
    ru: 'put({k}): {k} % 100 = 76. Начинаем с корзины 76.',
  },
  taken: {
    en: 'Bucket {i} is taken by another key: step to the next one.',
    zh: '桶 {i} 已被其他键占用：移到下一个桶。',
    'zh-hant': '桶 {i} 已被其他鍵佔用：移到下一個桶。',
    ja: 'バケット {i} は別のキーが使っています。次へ進みます。',
    ru: 'Корзина {i} занята другим ключом — переходим к следующей.',
  },
  free: {
    en: 'Bucket {i} is empty.',
    zh: '桶 {i} 是空的。',
    'zh-hant': '桶 {i} 是空的。',
    ja: 'バケット {i} は空いています。',
    ru: 'Корзина {i} свободна.',
  },
  place: {
    en: 'Store ({k}, {v}) in bucket {i}. Colliding keys end up side by side, which is why long probes form clusters.',
    zh: '把 ({k}, {v}) 存入桶 {i}。冲突的键会挨在一起，因此容易形成聚集。',
    'zh-hant': '把 ({k}, {v}) 存入桶 {i}。衝突的鍵會挨在一起，因此容易形成聚集。',
    ja: '({k}, {v}) をバケット {i} に保存します。衝突したキーは隣り合って並ぶので、クラスタができやすくなります。',
    ru: 'Кладём ({k}, {v}) в корзину {i}. Столкнувшиеся ключи оказываются рядом — так образуются кластеры.',
  },
};

const linearProbing: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', hash: 'idle', taken: 'swp', free: 'cmp', place: 'done' },
  build(l) {
    const slots: Record<number, Slot> = { 0: { key: 200, v: 'A' }, 1: { key: 500, v: 'D' }, 2: { key: 300, v: 'Y' }, 76: { key: 76, v: 'H' } };
    const S = PROBE_SAY;
    const frames: SceneFrame[] = [{ kind: 'init', scene: probeScene(l, slots, {}), say: S.init[l] }];
    for (const [k, v] of [
      [876, 'I'],
      [276, 'E'],
    ] as [number, string][]) {
      const key = { key: k, v, tone: 'info' as Tone };
      const call = `put(${k}, ${v})`;
      frames.push({ kind: 'hash', scene: probeScene(l, slots, { probe: 76, key }), say: fmt(S.hash[l], { k }), call });
      let i = 76;
      while (slots[i]) {
        frames.push({ kind: 'taken', scene: probeScene(l, slots, { probe: i, probeTone: 'warn', hl: { [i]: 'warn' }, key }), say: fmt(S.taken[l], { i }), call });
        i++;
      }
      frames.push({ kind: 'free', scene: probeScene(l, slots, { probe: i, hl: { [i]: 'accent' }, key }), say: fmt(S.free[l], { i }), call });
      slots[i] = { key: k, v };
      frames.push({ kind: 'place', scene: probeScene(l, slots, { probe: i, probeTone: 'ok', hl: { [i]: 'ok' }, key }), say: fmt(S.place[l], { k, v, i }), call });
    }
    return { frames };
  },
};

// ── Open addressing: why removal needs a tombstone ────────────────────

const DELETE_SAY: Record<'init' | 'remove' | 'search1' | 'stuck' | 'tomb' | 'search2' | 'found', T> = {
  init: {
    en: 'Buckets 76–80 hold five keys that all hash to 76; linear probing put them one after another.',
    zh: '桶 76–80 中的五个键哈希值都是 76，线性探测把它们依次排开。',
    'zh-hant': '桶 76–80 中的五個鍵雜湊值都是 76，線性探查把它們依次排開。',
    ja: 'バケット 76〜80 の 5 つのキーはすべてハッシュ値 76 で、線形探査により順に並んでいます。',
    ru: 'В корзинах 76–80 пять ключей, у всех хеш 76; линейное пробирование расставило их подряд.',
  },
  remove: {
    en: 'remove(876) by simply emptying bucket 77…',
    zh: 'remove(876)：如果直接把桶 77 清空……',
    'zh-hant': 'remove(876)：如果直接把桶 77 清空……',
    ja: 'remove(876)：バケット 77 を単に空にすると…',
    ru: 'remove(876): если просто очистить корзину 77…',
  },
  search1: {
    en: 'get(276): start at 76, which holds 076, not 276. Move on.',
    zh: 'get(276)：从 76 开始，这里是 076 而不是 276，继续。',
    'zh-hant': 'get(276)：從 76 開始，這裡是 076 而不是 276，繼續。',
    ja: 'get(276)：76 から始めます。ここは 076 で 276 ではないので先へ。',
    ru: 'get(276): начинаем с 76 — там 076, а не 276. Идём дальше.',
  },
  stuck: {
    en: 'Bucket 77 is empty, and an empty bucket means "the key is not here", so the search stops. But 276 is right below, in bucket 78!',
    zh: '桶 77 为空，而空桶意味着“键不存在”，查询就此停止。可 276 明明就在下面的桶 78 里！',
    'zh-hant': '桶 77 為空，而空桶意味著「鍵不存在」，查詢就此停止。可 276 明明就在下面的桶 78 裡！',
    ja: 'バケット 77 は空で、空きは「キーはない」という意味なので探索はここで終わります。でも 276 はすぐ下のバケット 78 にあります！',
    ru: 'Корзина 77 пуста, а пустая корзина означает «ключа нет», и поиск останавливается. Но 276 лежит прямо ниже, в корзине 78!',
  },
  tomb: {
    en: 'The fix: removal leaves a TOMBSTONE marker instead of an empty bucket.',
    zh: '解决办法：删除时放一个删除标记 TOMBSTONE，而不是清空桶。',
    'zh-hant': '解決辦法：刪除時放一個刪除標記 TOMBSTONE，而不是清空桶。',
    ja: '解決策：削除ではバケットを空にせず、削除マーカー TOMBSTONE を置きます。',
    ru: 'Решение: при удалении оставляем метку TOMBSTONE вместо пустой корзины.',
  },
  search2: {
    en: 'get(276) again: a tombstone means "keep going", so the search passes bucket 77.',
    zh: '再次 get(276)：遇到删除标记表示“继续查找”，于是越过桶 77。',
    'zh-hant': '再次 get(276)：遇到刪除標記表示「繼續查找」，於是越過桶 77。',
    ja: 'もう一度 get(276)：TOMBSTONE は「先へ進め」の意味なので、バケット 77 を通り過ぎます。',
    ru: 'Снова get(276): метка означает «ищи дальше», и поиск проходит корзину 77.',
  },
  found: {
    en: 'Bucket 78 holds 276: found, value E.',
    zh: '桶 78 中正是 276：找到，值为 E。',
    'zh-hant': '桶 78 中正是 276：找到，值為 E。',
    ja: 'バケット 78 に 276 があります。見つかりました、値は E です。',
    ru: 'В корзине 78 лежит 276: найдено, значение E.',
  },
};

const openAddressingDeletion: StepFigure = {
  type: 'steps',
  tones: { init: 'idle', remove: 'swp', search1: 'idle', stuck: 'swp', tomb: 'cmp', search2: 'idle', found: 'done' },
  build(l) {
    const base: Record<number, Slot> = {
      0: { key: 200, v: 'A' },
      1: { key: 500, v: 'D' },
      2: { key: 300, v: 'Y' },
      76: { key: 76, v: 'H' },
      77: { key: 876, v: 'I' },
      78: { key: 276, v: 'E' },
      79: { key: 676, v: 'T' },
      80: { key: 776, v: 'X' },
    };
    const emptied = { ...base, 77: null };
    const tomb = { ...base, 77: 'tomb' as Slot };
    const get = { key: 276, tone: 'info' as Tone };
    const S = DELETE_SAY;
    return {
      frames: [
        { kind: 'init', scene: probeScene(l, base, {}), say: S.init[l] },
        { kind: 'remove', scene: probeScene(l, emptied, { probe: 77, probeTone: 'danger', hl: { 77: 'danger' } }), say: S.remove[l], call: 'remove(876)' },
        { kind: 'search1', scene: probeScene(l, emptied, { probe: 76, probeTone: 'warn', hl: { 76: 'warn' }, key: get }), say: S.search1[l], call: 'get(276)' },
        {
          kind: 'stuck',
          scene: probeScene(l, emptied, { probe: 77, probeTone: 'danger', hl: { 77: 'danger', 78: 'muted' }, key: get, note: { text: WORD.notFound[l], tone: 'danger' } }),
          say: S.stuck[l],
          call: 'get(276)',
        },
        { kind: 'tomb', scene: probeScene(l, tomb, { probe: 77, probeTone: 'accent', hl: { 77: 'accent' } }), say: S.tomb[l], call: 'remove(876)' },
        { kind: 'search2', scene: probeScene(l, tomb, { probe: 77, probeTone: 'warn', key: get }), say: S.search2[l], call: 'get(276)' },
        { kind: 'found', scene: probeScene(l, tomb, { probe: 78, probeTone: 'ok', hl: { 78: 'ok' }, key: get }), say: S.found[l], call: 'get(276)' },
      ],
    };
  },
};

// ── Best and worst case of chaining ───────────────────────────────────

const CASES: Record<'best' | 'worst', T> = {
  best: {
    en: 'Best case: pairs spread evenly over the buckets. Lookup is O(1).',
    zh: '最佳情况：键值对均匀分布在各个桶中，查询为 O(1)。',
    'zh-hant': '最佳情況：鍵值對均勻分布在各個桶中，查詢為 O(1)。',
    ja: '最良の場合：ペアがバケットに均等に散らばり、検索は O(1)。',
    ru: 'Лучший случай: пары равномерно распределены по корзинам, поиск — O(1).',
  },
  worst: {
    en: 'Worst case: every pair lands in one bucket, which degrades into a linked list. Lookup is O(n).',
    zh: '最差情况：所有键值对都落在同一个桶中，退化为链表，查询为 O(n)。',
    'zh-hant': '最差情況：所有鍵值對都落在同一個桶中，退化為鏈結串列，查詢為 O(n)。',
    ja: '最悪の場合：すべてのペアが 1 つのバケットに入り連結リストに退化、検索は O(n)。',
    ru: 'Худший случай: все пары попадают в одну корзину, и она вырождается в связный список. Поиск — O(n).',
  },
};

const sub = (n: number) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);

const bestWorst: StaticFigure = {
  type: 'static',
  build(l) {
    const kw = 26;
    const vw = 26;
    const pw = pairWidth(kw, vw);
    const stepX = pw + 9;
    const nodes: SceneNode[] = [];
    const chain = (prefix: string, x: number, y: number, ids: number[], tone: Tone) =>
      ids.forEach((n, j) => {
        const px = x + j * stepX;
        nodes.push(...pair(`${prefix}${n}`, px, y, `k${sub(n)}`, `s${sub(n)}`, { kw, vw, h: 28, tone: j === 0 ? undefined : tone }));
        if (j > 0) nodes.push(arrow(`${prefix}e${n}`, [px - 9, y + 14], [px - 1, y + 14], { head: 'none' }));
      });
    nodes.push(region('best', 4, 22, W - 8, 124, { tone: 'ok', label: 'O(1)', labelAt: 'inside' }));
    chain('b', 64, 34, [1, 2], 'ok');
    chain('b', 64, 74, [3, 4], 'ok');
    chain('b', 64, 114, [5, 6], 'ok');
    nodes.push(region('worst', 4, 166, W - 8, 58, { tone: 'danger', label: 'O(n)', labelAt: 'inside' }));
    chain('w', 64, 182, [1, 2, 3, 4, 5, 6], 'danger');
    return { scene: { w: W, h: 230, nodes }, notes: [CASES.best[l], CASES.worst[l]] };
  },
};

const FIGURES: Record<string, Figure> = {
  hash_table_lookup: hashTableLookup,
  hash_function: hashFunction,
  hash_collision: hashCollision,
  hash_table_reshash: hashTableResize,
  hash_table_chaining: hashTableChaining,
  hash_table_linear_probing: linearProbing,
  hash_table_open_addressing_deletion: openAddressingDeletion,
  hash_collision_best_worst_condition: bestWorst,
};

export default FIGURES;
