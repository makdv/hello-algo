import bucketJavaEn from '@codes-en/java/chapter_sorting/bucket_sort.java?raw';
import countJavaEn from '@codes-en/java/chapter_sorting/counting_sort.java?raw';
import radixJavaEn from '@codes-en/java/chapter_sorting/radix_sort.java?raw';
import bucketPyEn from '@codes-en/python/chapter_sorting/bucket_sort.py?raw';
import countPyEn from '@codes-en/python/chapter_sorting/counting_sort.py?raw';
import radixPyEn from '@codes-en/python/chapter_sorting/radix_sort.py?raw';
import bucketJavaJa from '@codes-ja/java/chapter_sorting/bucket_sort.java?raw';
import countJavaJa from '@codes-ja/java/chapter_sorting/counting_sort.java?raw';
import radixJavaJa from '@codes-ja/java/chapter_sorting/radix_sort.java?raw';
import bucketPyJa from '@codes-ja/python/chapter_sorting/bucket_sort.py?raw';
import countPyJa from '@codes-ja/python/chapter_sorting/counting_sort.py?raw';
import radixPyJa from '@codes-ja/python/chapter_sorting/radix_sort.py?raw';
import bucketJavaRu from '@codes-ru/java/chapter_sorting/bucket_sort.java?raw';
import countJavaRu from '@codes-ru/java/chapter_sorting/counting_sort.java?raw';
import radixJavaRu from '@codes-ru/java/chapter_sorting/radix_sort.java?raw';
import bucketPyRu from '@codes-ru/python/chapter_sorting/bucket_sort.py?raw';
import countPyRu from '@codes-ru/python/chapter_sorting/counting_sort.py?raw';
import radixPyRu from '@codes-ru/python/chapter_sorting/radix_sort.py?raw';
import bucketJavaZh from '@codes-zh/java/chapter_sorting/bucket_sort.java?raw';
import countJavaZh from '@codes-zh/java/chapter_sorting/counting_sort.java?raw';
import radixJavaZh from '@codes-zh/java/chapter_sorting/radix_sort.java?raw';
import bucketPyZh from '@codes-zh/python/chapter_sorting/bucket_sort.py?raw';
import countPyZh from '@codes-zh/python/chapter_sorting/counting_sort.py?raw';
import radixPyZh from '@codes-zh/python/chapter_sorting/radix_sort.py?raw';
import bucketJavaZhHant from '@codes-zh-hant/java/chapter_sorting/bucket_sort.java?raw';
import countJavaZhHant from '@codes-zh-hant/java/chapter_sorting/counting_sort.java?raw';
import radixJavaZhHant from '@codes-zh-hant/java/chapter_sorting/radix_sort.java?raw';
import bucketPyZhHant from '@codes-zh-hant/python/chapter_sorting/bucket_sort.py?raw';
import countPyZhHant from '@codes-zh-hant/python/chapter_sorting/counting_sort.py?raw';
import radixPyZhHant from '@codes-zh-hant/python/chapter_sorting/radix_sort.py?raw';
import { arrow, box, brace, cellX, chip, link, rowWidth, seg, tag, text, treeSlots } from '../kit';
import type { BoxNode, Figure, PathNode, Rich, SceneFrame, SceneNode, Segment, StepFigure, Tone } from '../scene';
import { fmt, funcSources, raw, type T } from './shared';

/**
 * Chapter 11, sorting: bucket sort, counting sort and radix sort. Elements keep their ids while
 * they travel, so a number glides from the input array into its bucket (or into `res`) and back.
 */

const W = 440;

const BUCKET_PY = raw(bucketPyEn, bucketPyZh, bucketPyZhHant, bucketPyJa, bucketPyRu);
const BUCKET_JAVA = raw(bucketJavaEn, bucketJavaZh, bucketJavaZhHant, bucketJavaJa, bucketJavaRu);
const COUNT_PY = raw(countPyEn, countPyZh, countPyZhHant, countPyJa, countPyRu);
const COUNT_JAVA = raw(countJavaEn, countJavaZh, countJavaZhHant, countJavaJa, countJavaRu);
const RADIX_PY = raw(radixPyEn, radixPyZh, radixPyZhHant, radixPyJa, radixPyRu);
const RADIX_JAVA = raw(radixJavaEn, radixJavaZh, radixJavaZhHant, radixJavaJa, radixJavaRu);

/** A variable name in front of a row, e.g. `nums`, `counter`. */
const nameLabel = (id: string, x: number, y: number, h: number, name: string, tone: Tone = 'ok') =>
  text(id, x, y + h / 2 + 5, name, { anchor: 'end', mono: true, bold: true, size: 13, tone });

/** An open bucket drawn as a cylinder outline, with its top-left corner at x, y. */
function cylinder(id: string, x: number, y: number, w: number, h: number, tone: Tone, o: { dashed?: boolean; dim?: boolean } = {}): PathNode {
  const e = Math.min(6, w / 7);
  const rx = w / 2;
  const d = `M ${x} ${y} L ${x} ${y + h - e} A ${rx} ${e} 0 0 0 ${x + w} ${y + h - e} L ${x + w} ${y} A ${rx} ${e} 0 0 0 ${x} ${y} A ${rx} ${e} 0 0 0 ${x + w} ${y}`;
  return { kind: 'path', id, d, tone, dashed: o.dashed, dim: o.dim, width: 1.5 };
}

// ── Bucket sort: distribute, sort each bucket, merge ──────────────────

const FLOATS = [0.49, 0.96, 0.82, 0.09, 0.57, 0.43, 0.91, 0.75, 0.15, 0.37];
const K = 5;
const B_TONES: Tone[] = ['danger', 'warn', 'ok', 'info', 'accent'];
const RANGES = ['[0,0.2)', '[0.2,0.4)', '[0.4,0.6)', '[0.6,0.8)', '[0.8,1)'];
const bucketOf = (v: number) => Math.floor(v * K + 1e-9);
const f2 = (v: number) => v.toFixed(2);

type BucketKind = 'init' | 'put' | 'sort' | 'merge' | 'done';

const BUCKET_SAY: Record<BucketKind, T> = {
  init: {
    en: 'nums holds 10 floats in [0, 1). Create k = n / 2 = 5 buckets, each covering a range of width 0.2.',
    zh: 'nums 中有 10 个范围在 [0, 1) 内的浮点数。初始化 k = n / 2 = 5 个桶，每个桶对应一个宽度为 0.2 的范围。',
    'zh-hant': 'nums 中有 10 個範圍在 [0, 1) 內的浮點數。初始化 k = n / 2 = 5 個桶，每個桶對應一個寬度為 0.2 的範圍。',
    ja: 'nums には範囲 [0, 1) の浮動小数点数が 10 個あります。k = n / 2 = 5 個のバケットを用意し、各バケットは幅 0.2 の範囲を受け持ちます。',
    ru: 'В nums 10 чисел с плавающей запятой из [0, 1). Создаем k = n / 2 = 5 блоков, каждый отвечает за диапазон шириной 0.2.',
  },
  put: {
    en: 'i = ⌊{v} × 5⌋ = {b}: {v} goes into bucket {b}.',
    zh: 'i = ⌊{v} × 5⌋ = {b}：将 {v} 分配到桶 {b}。',
    'zh-hant': 'i = ⌊{v} × 5⌋ = {b}：將 {v} 分配到桶 {b}。',
    ja: 'i = ⌊{v} × 5⌋ = {b}：{v} をバケット {b} に分配します。',
    ru: 'i = ⌊{v} × 5⌋ = {b}: число {v} попадает в блок {b}.',
  },
  sort: {
    en: 'Sort each bucket separately (here with the built-in sort function).',
    zh: '对每个桶分别执行排序（这里采用内置排序函数）。',
    'zh-hant': '對每個桶分別執行排序（這裡採用內建排序函式）。',
    ja: '各バケットをそれぞれソートします（ここでは組み込みのソート関数を使います）。',
    ru: 'Сортируем каждый блок по отдельности (здесь встроенной функцией сортировки).',
  },
  merge: {
    en: 'Take the elements of bucket {b} in order ({list}) and write them back into nums.',
    zh: '按顺序取出桶 {b} 中的元素（{list}），写回 nums。',
    'zh-hant': '按順序取出桶 {b} 中的元素（{list}），寫回 nums。',
    ja: 'バケット {b} の要素（{list}）を順に nums へ書き戻します。',
    ru: 'Элементы блока {b} ({list}) по порядку записываем обратно в nums.',
  },
  done: {
    en: 'All buckets are merged in order from smallest to largest, so nums is sorted.',
    zh: '按照桶从小到大的顺序合并完毕，nums 已有序。',
    'zh-hant': '按照桶從小到大的順序合併完畢，nums 已有序。',
    ja: 'バケットを小さい順に結合し終え、nums はソート済みになりました。',
    ru: 'Все блоки объединены по порядку от меньшего к большему — nums отсортирован.',
  },
};

type Spot = { at: 'nums'; slot: number } | { at: 'bucket'; b: number; j: number };

const bucketSortOverview: StepFigure = {
  type: 'steps',
  call: 'bucket_sort(nums)',
  tones: { init: 'idle', put: 'cmp', sort: 'swp', merge: 'swp', done: 'done' },
  sources: funcSources(BUCKET_PY, BUCKET_JAVA, ['bucket_sort'], {
    python: {
      init: ['k = len(nums) // 2'],
      put: ['i = int(num * k)', 'buckets[i].append(num)'],
      sort: ['bucket.sort()'],
      merge: ['nums[i] = num'],
      done: ['nums[i] = num'],
    },
    java: {
      init: ['int k = nums.length / 2;'],
      put: ['int i = (int) (num * k);', 'buckets.get(i).add(num);'],
      sort: ['Collections.sort(bucket);'],
      merge: ['nums[i++] = num;'],
      done: ['nums[i++] = num;'],
    },
  }),
  build(l) {
    const n = FLOATS.length;
    const cw = 34;
    const ch = 26;
    const gap = 3;
    const x0 = 62;
    const rowY = 14;
    const span = rowWidth(n, cw, gap);
    const bw = 52;
    const bTop = 78;
    const bH = 112;
    const bcx = (b: number) => x0 + ((b + 0.5) * span) / K;
    const scene = (spots: Spot[], tones: (Tone | undefined)[], o: { ring?: Set<number>; extra?: SceneNode[]; status?: Rich; done?: boolean } = {}) => {
      const nodes: SceneNode[] = [nameLabel('l:nums', x0 - 8, rowY, ch, 'nums')];
      for (let i = 0; i < n; i++) nodes.push(box(`s${i}`, cellX(x0, i, cw, gap), rowY, '', { w: cw, h: ch, tone: 'ghost', dashed: true }));
      for (let b = 0; b < K; b++) {
        nodes.push(
          cylinder(`b${b}`, bcx(b) - bw / 2, bTop, bw, bH, B_TONES[b]),
          text(`r${b}`, bcx(b), bTop + bH + 18, RANGES[b], { anchor: 'middle', mono: true, size: 11, tone: 'muted' }),
        );
      }
      spots.forEach((s, i) => {
        const x = s.at === 'nums' ? cellX(x0, s.slot, cw, gap) : bcx(s.b) - cw / 2;
        const y = s.at === 'nums' ? rowY : bTop + 14 + s.j * (ch + 4);
        nodes.push(box(`e${i}`, x, y, f2(FLOATS[i]), { w: cw, h: ch, size: 12, tone: tones[i] ?? 'idle', ring: o.ring?.has(i) }));
      });
      nodes.push(...(o.extra ?? []));
      if (o.status) nodes.push(chip('st', W / 2, 226, o.status, { size: 13 }));
      return { w: W, h: 258, nodes };
    };

    const spots: Spot[] = FLOATS.map((_, i) => ({ at: 'nums', slot: i }));
    const tones: (Tone | undefined)[] = FLOATS.map(() => undefined);
    const buckets: number[][] = Array.from({ length: K }, () => []);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(spots, tones, { status: seg('k = n / 2 = ', ['5', 'accent', true]) }), say: BUCKET_SAY.init[l] },
    ];

    FLOATS.forEach((v, t) => {
      const b = bucketOf(v);
      buckets[b].push(t);
      spots[t] = { at: 'bucket', b, j: buckets[b].length - 1 };
      tones[t] = B_TONES[b];
      frames.push({
        kind: 'put',
        scene: scene([...spots], [...tones], {
          ring: new Set([t]),
          extra: [arrow('drop', [cellX(x0, t, cw, gap) + cw / 2, rowY + ch + 4], [bcx(b), bTop - 6], { tone: B_TONES[b], width: 1.5 })],
          status: seg('i = ⌊', [f2(v), B_TONES[b], true], ' × 5⌋ = ', [String(b), B_TONES[b], true]),
        }),
        say: fmt(BUCKET_SAY.put[l], { v: f2(v), b }),
      });
    });

    for (const bucket of buckets) {
      bucket.sort((a, c) => FLOATS[a] - FLOATS[c]);
      bucket.forEach((i, j) => (spots[i] = { at: 'bucket', b: bucketOf(FLOATS[i]), j }));
    }
    frames.push({ kind: 'sort', scene: scene([...spots], [...tones]), say: BUCKET_SAY.sort[l] });

    let pos = 0;
    buckets.forEach((bucket, b) => {
      const start = pos;
      bucket.forEach((i) => (spots[i] = { at: 'nums', slot: pos++ }));
      const mid = (cellX(x0, start, cw, gap) + cellX(x0, pos - 1, cw, gap) + cw) / 2;
      frames.push({
        kind: 'merge',
        scene: scene([...spots], [...tones], {
          extra: [arrow('up', [bcx(b), bTop - 6], [mid, rowY + ch + 4], { tone: B_TONES[b], width: 1.5 })],
        }),
        say: fmt(BUCKET_SAY.merge[l], { b, list: bucket.map((i) => f2(FLOATS[i])).join(', ') }),
      });
    });

    frames.push({
      kind: 'done',
      scene: scene([...spots], [...tones]),
      say: BUCKET_SAY.done[l],
    });
    return { frames };
  },
};

// ── Even distribution: boundaries from the probability distribution ──

/** Standard normal CDF (Abramowitz–Stegun erf approximation) and its inverse by bisection. */
function normalCdf(z: number) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + (z < 0 ? -y : y));
}

function normalQuantile(p: number) {
  let lo = -6;
  let hi = 6;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (normalCdf(mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const DIST_WORD: Record<'density' | 'price', T> = {
  density: { en: 'probability density', zh: '概率密度', 'zh-hant': '機率密度', ja: '確率密度', ru: 'плотность вероятности' },
  price: { en: 'price', zh: '商品价格', 'zh-hant': '商品價格', ja: '商品価格', ru: 'цена' },
};

const DIST_SAY: Record<'even' | 'fit', T> = {
  even: {
    en: 'Assume product prices follow a normal distribution. Splitting the price range into equal-width intervals fills the buckets very unevenly: 8 products in each middle bucket, only 1 at either end.',
    zh: '假设商品价格服从正态分布。若将价格区间等宽划分，各桶中的商品数量差距很大：中间的桶各有 8 件，两端的桶只有 1 件。',
    'zh-hant': '假設商品價格服從正態分佈。若將價格區間等寬劃分，各桶中的商品數量差距很大：中間的桶各有 8 件，兩端的桶只有 1 件。',
    ja: '商品価格が正規分布に従うとします。価格区間を等幅に分けると、バケットごとの商品数に大きな差が出ます：中央のバケットは 8 件ずつ、両端は 1 件だけです。',
    ru: 'Пусть цены товаров подчиняются нормальному распределению. Если разбить диапазон цен на равные интервалы, блоки заполнятся очень неравномерно: в средних по 8 товаров, в крайних всего по 1.',
  },
  fit: {
    en: 'Instead, set each bucket’s price boundaries from the distribution: narrow intervals where prices are dense, wide ones where they are sparse. Now every bucket gets 4 products.',
    zh: '改为根据概率分布设置每个桶的价格分界线：价格密集处区间窄，稀疏处区间宽。现在每个桶都分到 4 件商品。',
    'zh-hant': '改為根據機率分佈設定每個桶的價格分界線：價格密集處區間窄，稀疏處區間寬。現在每個桶都分到 4 件商品。',
    ja: '代わりに、確率分布に基づいて各バケットの価格境界を設定します：価格が密なところは区間を狭く、疎なところは広くします。これで各バケットに 4 件ずつ入ります。',
    ru: 'Вместо этого зададим границы цен для каждого блока по распределению: где цены встречаются часто, интервалы узкие, где редко — широкие. Теперь в каждый блок попадает по 4 товара.',
  },
};

const scatterInBucketsDistribution: StepFigure = {
  type: 'steps',
  tones: { even: 'swp', fit: 'done' },
  build(l) {
    const nb = 6;
    const dots = 24;
    const zMax = 3;
    const left = 40;
    const right = 420;
    const base = 140;
    const peak = 100;
    const px = (z: number) => left + ((z + zMax) / (2 * zMax)) * (right - left);
    const py = (z: number) => base - peak * Math.exp((-z * z) / 2);
    const curve = (a: number, b: number, steps: number) =>
      Array.from({ length: steps + 1 }, (_, k) => {
        const z = a + ((b - a) * k) / steps;
        return `L ${px(z).toFixed(1)} ${py(z).toFixed(1)}`;
      }).join(' ');
    const zs = Array.from({ length: dots }, (_, i) => normalQuantile((i + 0.5) / dots));
    const bTop = 190;
    const bH = 56;
    const bw = 48;
    const bcx = (b: number) => W / 2 + (b - (nb - 1) / 2) * 62;
    const tones: Tone[] = ['info', 'accent', 'info', 'accent', 'info', 'accent'];
    const PRICES = ['3', '10', '25', '80', '200'];
    const RANGE = ['<3', '3–10', '10–25', '25–80', '80–200', '>200'];

    const scene = (edges: number[], fit: boolean) => {
      const nodes: SceneNode[] = [
        text('l:y', left - 6, 22, DIST_WORD.density[l], { size: 12, tone: 'muted' }),
        arrow('ax', [left - 6, base], [right + 12, base], { tone: 'muted', width: 1.25 }),
        text('l:x', right + 12, base + 18, DIST_WORD.price[l], { anchor: 'end', size: 12, tone: 'muted' }),
      ];
      const bucketOfZ = (z: number) => edges.findIndex((e, k) => k > 0 && z < e) - 1;
      const members: number[][] = Array.from({ length: nb }, () => []);
      zs.forEach((z, i) => members[Math.max(0, bucketOfZ(z))].push(i));
      for (let b = 0; b < nb; b++) {
        const a = edges[b];
        const c = edges[b + 1];
        const count = members[b].length;
        const over = count > dots / nb;
        const tone: Tone = !fit && over ? 'danger' : tones[b];
        nodes.push({ kind: 'path', id: `sl${b}`, d: `M ${px(a).toFixed(1)} ${base} ${curve(a, c, 16)} L ${px(c).toFixed(1)} ${base} Z`, tone, fill: true, width: 0.5 });
        nodes.push(arrow(`cn${b}`, [px((a + c) / 2), base + 22], [bcx(b), bTop - 6], { head: 'none', tone, width: 1.25, dashed: true }));
        nodes.push(cylinder(`bk${b}`, bcx(b) - bw / 2, bTop, bw, bH, tone));
        members[b].forEach((i, j) => {
          const col = j % 3;
          const row = Math.floor(j / 3);
          nodes.push(box(`d${i}`, bcx(b) - 18 + col * 13, bTop + bH - 20 - row * 13, '', { w: 10, h: 10, shape: 'circle', tone: tones[b] }));
        });
        nodes.push(text(`c${b}`, bcx(b), bTop + bH + 18, `×${count}`, { anchor: 'middle', mono: true, bold: true, size: 13, tone: !fit && over ? 'danger' : fit ? 'ok' : 'muted' }));
        if (fit) nodes.push(text(`rg${b}`, bcx(b), bTop + bH + 36, RANGE[b], { anchor: 'middle', mono: true, bold: true, size: 12, tone: tones[b] }));
      }
      for (let k = 1; k < nb; k++) {
        const z = edges[k];
        nodes.push(arrow(`bd${k}`, [px(z), base], [px(z), py(z)], { head: 'none', dashed: true, tone: 'muted', width: 1.25 }));
        if (fit) nodes.push(text(`pt${k}`, px(z), base + 15, PRICES[k - 1], { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      }
      nodes.push({ kind: 'path', id: 'curve', d: `M ${px(-zMax).toFixed(1)} ${py(-zMax).toFixed(1)} ${curve(-zMax, zMax, 60)}`, tone: 'info', width: 2.25 });
      return { w: W, h: 292, nodes };
    };

    const even = Array.from({ length: nb + 1 }, (_, k) => -zMax + k);
    const fit = Array.from({ length: nb + 1 }, (_, k) => (k === 0 ? -zMax : k === nb ? zMax : normalQuantile(k / nb)));
    return {
      frames: [
        { kind: 'even', scene: scene(even, false), say: DIST_SAY.even[l] },
        { kind: 'fit', scene: scene(fit, true), say: DIST_SAY.fit[l] },
      ],
    };
  },
};

// ── Even distribution: split crowded buckets recursively ──────────────

interface SplitNode {
  id: string;
  share: number;
  range: string;
  parent: string | null;
}

const SPLIT_NODES: SplitNode[] = [
  { id: 'A', share: 65, range: '<100', parent: null },
  { id: 'B', share: 20, range: '100–500', parent: null },
  { id: 'C', share: 15, range: '>500', parent: null },
  { id: 'D', share: 18, range: '<10', parent: 'A' },
  { id: 'E', share: 35, range: '10–50', parent: 'A' },
  { id: 'F', share: 12, range: '50–100', parent: 'A' },
  { id: 'G', share: 13, range: '10–20', parent: 'E' },
  { id: 'H', share: 12, range: '20–35', parent: 'E' },
  { id: 'I', share: 10, range: '35–50', parent: 'E' },
];

const ROOT_WORD: T = { en: 'product data', zh: '商品数据', 'zh-hant': '商品資料', ja: '商品データ', ru: 'данные о товарах' };

const SPLIT_SAY: Record<'first' | 'second' | 'done', T> = {
  first: {
    en: 'First set rough boundaries and split the products into 3 buckets. The <100 bucket gets 65% of the data, far too many.',
    zh: '先设定一条大致的分界线，将商品粗略地分到 3 个桶中。<100 的桶分到了 65% 的数据，太多了。',
    'zh-hant': '先設定一條大致的分界線，將商品粗略地分到 3 個桶中。<100 的桶分到了 65% 的資料，太多了。',
    ja: 'まず大まかな境界線を設定し、商品を 3 個のバケットに粗く振り分けます。<100 のバケットにはデータの 65% が入り、多すぎます。',
    ru: 'Сначала задаем грубые границы и делим товары на 3 блока. В блок <100 попадает 65% данных — слишком много.',
  },
  second: {
    en: 'Split that bucket again into 3 buckets. The 10–50 bucket still holds 35%.',
    zh: '将这个桶继续划分为 3 个桶。10–50 的桶仍有 35% 的数据。',
    'zh-hant': '將這個桶繼續劃分為 3 個桶。10–50 的桶仍有 35% 的資料。',
    ja: 'そのバケットをさらに 3 個のバケットに分割します。10–50 のバケットにはまだ 35% あります。',
    ru: 'Делим этот блок еще на 3 блока. В блоке 10–50 все еще 35% данных.',
  },
  done: {
    en: 'Split 10–50 once more. Every leaf bucket now holds 10%–20% of the data: the leaves of this recursion tree are roughly balanced.',
    zh: '再将 10–50 划分一次。现在每个叶节点桶中都只有 10%～20% 的数据，递归树的叶节点大致平均。',
    'zh-hant': '再將 10–50 劃分一次。現在每個葉節點桶中都只有 10%～20% 的資料，遞迴樹的葉節點大致平均。',
    ja: '10–50 をもう一度分割します。これで各葉ノードのバケットはデータの 10%〜20% になり、再帰木の葉がおおむね均等になりました。',
    ru: 'Делим 10–50 еще раз. Теперь в каждом листовом блоке от 10% до 20% данных: листья рекурсивного дерева примерно равны.',
  },
};

const scatterInBucketsRecursively: StepFigure = {
  type: 'steps',
  tones: { split: 'swp', done: 'done' },
  build(l) {
    const bw = 46;
    const bh = 36;
    const scene = (shown: string[], look: Record<string, Tone>, split: Set<string>, fresh: Set<string>) => {
      const list = SPLIT_NODES.filter((s) => shown.includes(s.id));
      const ids = ['root', ...list.map((s) => s.id)];
      const parents = [-1, ...list.map((s) => ids.indexOf(s.parent ?? 'root'))];
      const slots = treeSlots(parents, 0, W, 22, 80);
      const nodes: SceneNode[] = [chip('root', W / 2, 8, ROOT_WORD[l], { sans: true, size: 13 })];
      list.forEach((s, k) => {
        const slot = slots[k + 1];
        const parent = slots[parents[k + 1]];
        const inner = split.has(s.id);
        const tone: Tone = inner ? 'ghost' : look[s.id] ?? 'info';
        const fromY = s.parent ? parent.y + bh / 2 + 22 : 37;
        nodes.push(
          arrow(`e:${s.id}`, [s.parent ? parent.x : W / 2, fromY], [slot.x, slot.y - bh / 2 - 6], { head: 'none', tone: fresh.has(s.id) ? 'accent' : 'muted', width: 1.25 }),
          cylinder(`b:${s.id}`, slot.x - bw / 2, slot.y - bh / 2, bw, bh, tone, { dashed: inner }),
          text(`p:${s.id}`, slot.x, slot.y + 7, `${s.share}%`, { anchor: 'middle', mono: true, bold: !inner, size: 13, tone: inner ? 'muted' : tone }),
          text(`r:${s.id}`, slot.x, slot.y + bh / 2 + 16, s.range, { anchor: 'middle', mono: true, size: 11, tone: inner ? 'muted' : tone }),
        );
      });
      return { w: W, h: 300, nodes };
    };
    const first = ['A', 'B', 'C'];
    const second = [...first, 'D', 'E', 'F'];
    const all = [...second, 'G', 'H', 'I'];
    const okAll = Object.fromEntries(all.map((id) => [id, 'ok' as Tone]));
    return {
      frames: [
        { kind: 'split', scene: scene(first, { A: 'danger' }, new Set(), new Set(first)), say: SPLIT_SAY.first[l] },
        { kind: 'split', scene: scene(second, { E: 'warn' }, new Set(['A']), new Set(['D', 'E', 'F'])), say: SPLIT_SAY.second[l] },
        { kind: 'done', scene: scene(all, okAll, new Set(['A', 'E']), new Set(['G', 'H', 'I'])), say: SPLIT_SAY.done[l] },
      ],
    };
  },
};

// ── Counting sort ─────────────────────────────────────────────────────

const INTS = [1, 0, 1, 2, 0, 4, 0, 2, 2, 4];
const M = 4;
/** One color per value, so equal numbers are easy to follow. */
const V_TONE: Tone[] = ['warn', 'info', 'ok', 'muted', 'accent'];
const CW = 32;
const CG = 4;
const CX0 = 72;
/** The counter row (length 5) sits centered under the ten-cell rows. */
const COUNTER_X = CX0 + (rowWidth(INTS.length, CW, CG) - rowWidth(M + 1, CW, CG)) / 2;

const counterOf = (nums: number[]) => {
  const c = Array(M + 1).fill(0) as number[];
  for (const v of nums) c[v]++;
  return c;
};

/** `num` index labels over the counter row, each in its value's color. */
const numIndices = (y: number) => [
  text('l:num', COUNTER_X - 8, y, 'num', { anchor: 'end', mono: true, size: 12, tone: 'muted' }),
  ...Array.from({ length: M + 1 }, (_, k) => text(`ix${k}`, cellX(COUNTER_X, k, CW, CG) + CW / 2, y, String(k), { anchor: 'middle', mono: true, bold: true, size: 12, tone: V_TONE[k] })),
];

type NaiveKind = 'init' | 'count' | 'fill' | 'skip' | 'done';

const NAIVE_SAY: Record<NaiveKind, T> = {
  init: {
    en: 'nums holds non-negative integers, the largest being m = 4. Create counter of length m + 1 = 5, all zeros.',
    zh: 'nums 中都是非负整数，最大数字 m = 4。创建长度为 m + 1 = 5 的 counter，初始全为 0。',
    'zh-hant': 'nums 中都是非負整數，最大數字 m = 4。建立長度為 m + 1 = 5 的 counter，初始全為 0。',
    ja: 'nums の要素はすべて非負整数で、最大値は m = 4 です。長さ m + 1 = 5 の counter を 0 で作成します。',
    ru: 'В nums только неотрицательные целые числа, максимум m = 4. Создаем counter длины m + 1 = 5 из нулей.',
  },
  count: {
    en: 'num = {v}: increase counter[{v}] by 1, to {c}.',
    zh: 'num = {v}：counter[{v}] 增加 1，变为 {c}。',
    'zh-hant': 'num = {v}：counter[{v}] 增加 1，變為 {c}。',
    ja: 'num = {v}：counter[{v}] を 1 増やして {c} にします。',
    ru: 'num = {v}: увеличиваем counter[{v}] на 1, теперь {c}.',
  },
  fill: {
    en: 'counter[{v}] = {c}, so write {v} into nums {c} times.',
    zh: 'counter[{v}] = {c}，因此向 nums 填入 {c} 个 {v}。',
    'zh-hant': 'counter[{v}] = {c}，因此向 nums 填入 {c} 個 {v}。',
    ja: 'counter[{v}] = {c} なので、nums に {v} を {c} 個書き込みます。',
    ru: 'counter[{v}] = {c}, поэтому записываем {v} в nums {c} раза.',
  },
  skip: {
    en: 'counter[3] = 0: the number 3 does not appear, so nothing is written.',
    zh: 'counter[3] = 0：数字 3 没有出现，不填入。',
    'zh-hant': 'counter[3] = 0：數字 3 沒有出現，不填入。',
    ja: 'counter[3] = 0：3 は現れないので、何も書き込みません。',
    ru: 'counter[3] = 0: числа 3 нет, ничего не записываем.',
  },
  done: {
    en: 'The indices of counter are naturally ordered, so after this traversal nums is sorted.',
    zh: 'counter 的各个索引天然有序，遍历完成后 nums 就排好序了。',
    'zh-hant': 'counter 的各個索引天然有序，走訪完成後 nums 就排好序了。',
    ja: 'counter の各インデックスは自然に順序づけられているので、走査を終えると nums はソート済みです。',
    ru: 'Индексы counter изначально упорядочены, поэтому после прохода nums отсортирован.',
  },
};

const countingSortOverview: StepFigure = {
  type: 'steps',
  call: 'counting_sort_naive(nums)',
  tones: { init: 'idle', count: 'cmp', fill: 'swp', skip: 'cmp', done: 'done' },
  sources: funcSources(COUNT_PY, COUNT_JAVA, ['counting_sort_naive'], {
    python: {
      init: ['counter = [0] * (m + 1)'],
      count: ['counter[num] += 1'],
      fill: ['for _ in range(counter[num]):', 'nums[i] = num'],
      skip: ['for num in range(m + 1):'],
      done: ['nums[i] = num'],
    },
    java: {
      init: ['int[] counter = new int[m + 1];'],
      count: ['counter[num]++;'],
      fill: ['for (int j = 0; j < counter[num]; j++, i++) {', 'nums[i] = num;'],
      skip: ['for (int num = 0; num < m + 1; num++) {'],
      done: ['nums[i] = num;'],
    },
  }),
  build(l) {
    const inY = 16;
    const cY = 112;
    const outY = 200;
    const inBox = (i: number, o: Partial<BoxNode> = {}) => box(`in${i}`, cellX(CX0, i, CW, CG), inY, INTS[i], { w: CW, h: CW, tone: V_TONE[INTS[i]], ...o });
    const cBox = (k: number, v: number, o: Partial<BoxNode> = {}) => box(`c${k}`, cellX(COUNTER_X, k, CW, CG), cY, v, { w: CW, h: CW, tone: 'idle', ...o });
    const scene = (o: { cur?: number; counter: number[]; hot?: number; hotTone?: Tone; out: (number | null)[]; fresh?: [number, number]; inDim?: boolean; extra?: SceneNode[]; status?: Rich }) => {
      const nodes: SceneNode[] = [
        nameLabel('l:in', CX0 - 8, inY, CW, 'nums'),
        ...INTS.map((_, i) => inBox(i, { ring: o.cur === i, dim: o.inDim })),
        ...numIndices(cY - 8),
        nameLabel('l:c', COUNTER_X - 8, cY, CW, 'counter', 'info'),
        ...o.counter.map((v, k) => cBox(k, v, { tone: o.hot === k ? o.hotTone ?? 'accent' : 'idle', ring: o.hot === k })),
        nameLabel('l:out', CX0 - 8, outY, CW, 'nums'),
        ...o.out.map((v, j) =>
          box(`o${j}`, cellX(CX0, j, CW, CG), outY, v ?? '', {
            w: CW,
            h: CW,
            tone: v === null ? 'ghost' : V_TONE[v],
            dashed: v === null,
            ring: o.fresh !== undefined && j >= o.fresh[0] && j < o.fresh[1],
          }),
        ),
        ...(o.extra ?? []),
      ];
      if (o.status) nodes.push(chip('st', W / 2, 250, o.status, { size: 13 }));
      return { w: W, h: 284, nodes };
    };

    const counter = Array(M + 1).fill(0) as number[];
    const out: (number | null)[] = INTS.map(() => null);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene({ counter: [...counter], out: [...out], status: seg('m = ', ['4', 'accent', true], '   counter = [0, 0, 0, 0, 0]') }), say: NAIVE_SAY.init[l] },
    ];
    INTS.forEach((v, i) => {
      counter[v]++;
      frames.push({
        kind: 'count',
        scene: scene({
          cur: i,
          counter: [...counter],
          hot: v,
          out: [...out],
          extra: [link('a', inBox(i), cBox(v, 0), { tone: V_TONE[v], width: 1.5 })],
          status: seg('counter[', [String(v), V_TONE[v], true], '] += 1  →  ', [String(counter[v]), 'accent', true]),
        }),
        say: fmt(NAIVE_SAY.count[l], { v, c: counter[v] }),
      });
    });
    let pos = 0;
    for (let v = 0; v <= M; v++) {
      const c = counter[v];
      if (c === 0) {
        frames.push({
          kind: 'skip',
          scene: scene({ counter: [...counter], hot: v, hotTone: 'muted', out: [...out], inDim: true, status: seg('counter[', [String(v), 'muted', true], '] = 0') }),
          say: NAIVE_SAY.skip[l],
        });
        continue;
      }
      const start = pos;
      for (let k = 0; k < c; k++) out[pos++] = v;
      const a = cellX(CX0, start, CW, CG);
      const b = cellX(CX0, pos - 1, CW, CG) + CW;
      const cx = cellX(COUNTER_X, v, CW, CG) + CW / 2;
      frames.push({
        kind: 'fill',
        scene: scene({
          counter: [...counter],
          hot: v,
          hotTone: V_TONE[v],
          out: [...out],
          fresh: [start, pos],
          inDim: true,
          extra: [brace('br', a, b, outY - 4, 'up', V_TONE[v]), arrow('fa', [cx, cY + CW + 4], [(a + b) / 2, outY - 22], { tone: V_TONE[v], width: 1.5 })],
          status: seg('counter[', [String(v), V_TONE[v], true], '] = ', [String(c), 'accent', true], '  →  ', [Array(c).fill(v).join(', '), V_TONE[v], true]),
        }),
        say: fmt(NAIVE_SAY.fill[l], { v, c }),
      });
    }
    frames.push({
      kind: 'done',
      scene: scene({ counter: [...counter], out: [...out], inDim: true, status: seg('nums = [', [out.join(', '), 'ok', true], ']') }),
      say: NAIVE_SAY.done[l],
    });
    return { frames };
  },
};

// ── Counting sort, complete: prefix sums and a backward pass ──────────

type FullKind = 'init' | 'count' | 'prefix' | 'place' | 'copy';

const FULL_SAY: Record<FullKind | 'prefixLast' | 'placeAgain', T> = {
  init: {
    en: 'Find the largest number m = 4 and create counter of length m + 1 = 5, all zeros.',
    zh: '找出最大数字 m = 4，创建长度为 m + 1 = 5 的 counter，初始全为 0。',
    'zh-hant': '找出最大數字 m = 4，建立長度為 m + 1 = 5 的 counter，初始全為 0。',
    ja: '最大値 m = 4 を求め、長さ m + 1 = 5 の counter を 0 で作成します。',
    ru: 'Находим максимум m = 4 и создаем counter длины m + 1 = 5 из нулей.',
  },
  count: {
    en: 'Traverse nums and count each number: counter[num] is how many times num appears.',
    zh: '遍历 nums，统计各数字的出现次数：counter[num] 对应数字 num 的出现次数。',
    'zh-hant': '走訪 nums，統計各數字的出現次數：counter[num] 對應數字 num 的出現次數。',
    ja: 'nums を走査して各数値の出現回数を数えます：counter[num] は num の出現回数です。',
    ru: 'Проходим по nums и считаем вхождения: counter[num] — сколько раз встречается num.',
  },
  prefix: {
    en: 'Prefix sum: counter[{a}] += counter[{b}], now {c}.',
    zh: '计算前缀和：counter[{a}] += counter[{b}]，得到 {c}。',
    'zh-hant': '計算前綴和：counter[{a}] += counter[{b}]，得到 {c}。',
    ja: '累積和を計算します：counter[{a}] += counter[{b}] で {c} になります。',
    ru: 'Префиксная сумма: counter[{a}] += counter[{b}], получаем {c}.',
  },
  prefixLast: {
    en: 'Prefix sum: counter[{a}] += counter[{b}], now {c}. counter[num] − 1 is now the last index of num in res.',
    zh: '计算前缀和：counter[{a}] += counter[{b}]，得到 {c}。现在 counter[num] − 1 就是 num 在 res 中最后一次出现的索引。',
    'zh-hant': '計算前綴和：counter[{a}] += counter[{b}]，得到 {c}。現在 counter[num] − 1 就是 num 在 res 中最後一次出現的索引。',
    ja: '累積和を計算します：counter[{a}] += counter[{b}] で {c} になります。これで counter[num] − 1 は、num が res に最後に現れるインデックスです。',
    ru: 'Префиксная сумма: counter[{a}] += counter[{b}], получаем {c}. Теперь counter[num] − 1 — индекс последнего вхождения num в res.',
  },
  place: {
    en: 'i = {i}, num = {v}: place it at res[counter[{v}] − 1] = res[{p}], then decrease counter[{v}] by 1, to {p}.',
    zh: 'i = {i}，num = {v}：将其填入 res[counter[{v}] − 1] = res[{p}]，再令 counter[{v}] 减 1，变为 {p}。',
    'zh-hant': 'i = {i}，num = {v}：將其填入 res[counter[{v}] − 1] = res[{p}]，再令 counter[{v}] 減 1，變為 {p}。',
    ja: 'i = {i}、num = {v}：res[counter[{v}] − 1] = res[{p}] に格納し、counter[{v}] を 1 減らして {p} にします。',
    ru: 'i = {i}, num = {v}: записываем в res[counter[{v}] − 1] = res[{p}] и уменьшаем counter[{v}] на 1, до {p}.',
  },
  placeAgain: {
    en: 'i = {i}, num = {v}: res[{p}], just left of the {v} placed earlier, so equal elements keep their order. counter[{v}] becomes {p}.',
    zh: 'i = {i}，num = {v}：填入 res[{p}]，位于先前放置的 {v} 左侧，相等元素的相对顺序不变。counter[{v}] 变为 {p}。',
    'zh-hant': 'i = {i}，num = {v}：填入 res[{p}]，位於先前放置的 {v} 左側，相等元素的相對順序不變。counter[{v}] 變為 {p}。',
    ja: 'i = {i}、num = {v}：先に置いた {v} のすぐ左の res[{p}] に格納するので、等しい要素の順序は保たれます。counter[{v}] は {p} になります。',
    ru: 'i = {i}, num = {v}: res[{p}] — левее ранее размещенного {v}, поэтому порядок равных элементов сохраняется. counter[{v}] становится {p}.',
  },
  copy: {
    en: 'The traversal is done and res holds the sorted result. Overwrite nums with res.',
    zh: '遍历完成，数组 res 中就是排序好的结果。最后使用 res 覆盖原数组 nums。',
    'zh-hant': '走訪完成，陣列 res 中就是排序好的結果。最後使用 res 覆蓋原陣列 nums。',
    ja: '走査が完了し、res にソート済みの結果が入りました。res で元の配列 nums を上書きします。',
    ru: 'Проход завершен: в res отсортированный результат. Переписываем res обратно в nums.',
  },
};

type Place = { row: 'nums' | 'res'; slot: number };

const countingSortSteps: StepFigure = {
  type: 'steps',
  call: 'counting_sort(nums)',
  tones: { init: 'idle', count: 'cmp', prefix: 'cmp', place: 'swp', copy: 'done' },
  sources: funcSources(COUNT_PY, COUNT_JAVA, ['counting_sort'], {
    python: {
      init: ['counter = [0] * (m + 1)'],
      count: ['counter[num] += 1'],
      prefix: ['counter[i + 1] += counter[i]'],
      place: ['res[counter[num] - 1] = num', 'counter[num] -= 1'],
      copy: ['nums[i] = res[i]'],
    },
    java: {
      init: ['int[] counter = new int[m + 1];'],
      count: ['counter[num]++;'],
      prefix: ['counter[i + 1] += counter[i];'],
      place: ['res[counter[num] - 1] = num;', 'counter[num]--;'],
      copy: ['nums[i] = res[i];'],
    },
  }),
  build(l) {
    const n = INTS.length;
    const numsY = 40;
    const resY = 100;
    const cY = 184;
    const rowY = (r: Place['row']) => (r === 'nums' ? numsY : resY);
    const cBox = (k: number, v: number, o: Partial<BoxNode> = {}) => box(`c${k}`, cellX(COUNTER_X, k, CW, CG), cY, v, { w: CW, h: CW, tone: 'idle', ...o });
    const slotBox = (r: Place['row'], j: number) => box('', cellX(CX0, j, CW, CG), rowY(r), '', { w: CW, h: CW });
    const scene = (o: {
      at: Place[];
      counter: number[];
      cTone?: Record<number, Tone>;
      /** The counter cell that changes in this step. */
      cRing?: number;
      ring?: number;
      resShow?: (number | null)[];
      cursor?: number;
      extra?: SceneNode[];
      status?: Rich;
    }) => {
      const nodes: SceneNode[] = [
        nameLabel('l:nums', CX0 - 8, numsY, CW, 'nums'),
        nameLabel('l:res', CX0 - 8, resY, CW, 'res', 'info'),
        ...INTS.map((v, i) => box(`g${i}`, cellX(CX0, i, CW, CG), numsY, v, { w: CW, h: CW, tone: 'ghost', dashed: true })),
        ...INTS.map((_, j) => {
          const v = o.resShow?.[j] ?? null;
          return box(`r${j}`, cellX(CX0, j, CW, CG), resY, v ?? '', { w: CW, h: CW, tone: 'ghost', dashed: v === null });
        }),
        ...INTS.map((_, j) => text(`ri${j}`, cellX(CX0, j, CW, CG) + CW / 2, resY + CW + 15, String(j), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })),
        ...numIndices(cY - 8),
        nameLabel('l:c', COUNTER_X - 8, cY, CW, 'counter', 'info'),
        ...o.counter.map((v, k) => cBox(k, v, { tone: o.cTone?.[k] ?? 'idle', ring: o.cRing === k })),
        ...o.at.map((p, i) => box(`e${i}`, cellX(CX0, p.slot, CW, CG), rowY(p.row), INTS[i], { w: CW, h: CW, tone: V_TONE[INTS[i]], ring: o.ring === i })),
      ];
      if (o.cursor !== undefined) nodes.push(...tag('cur', slotBox('nums', o.cursor), 'i', { side: 'above', tone: 'accent', gap: 20 }));
      nodes.push(...(o.extra ?? []));
      if (o.status) nodes.push(chip('st', W / 2, 238, o.status, { size: 12 }));
      return { w: W, h: 272, nodes };
    };

    const at: Place[] = INTS.map((_, i) => ({ row: 'nums', slot: i }));
    const counter = Array(M + 1).fill(0) as number[];
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene({ at: [...at], counter: [...counter], status: seg('m = ', ['4', 'accent', true], '   counter = [0, 0, 0, 0, 0]') }), say: FULL_SAY.init[l] },
    ];
    const counts = counterOf(INTS);
    frames.push({
      kind: 'count',
      scene: scene({
        at: [...at],
        counter: [...counts],
        cTone: Object.fromEntries(counts.map((_, k) => [k, 'accent' as Tone])),
        status: seg('counter = [', [counts.join(', '), 'accent', true], ']'),
      }),
      say: FULL_SAY.count[l],
    });
    const prefix = [...counts];
    for (let i = 0; i < M; i++) {
      prefix[i + 1] += prefix[i];
      const from = cellX(COUNTER_X, i, CW, CG) + CW / 2 + 4;
      const to = cellX(COUNTER_X, i + 1, CW, CG) + CW / 2 - 4;
      frames.push({
        kind: 'prefix',
        scene: scene({
          at: [...at],
          counter: [...prefix],
          cTone: { [i]: 'accent', [i + 1]: 'warn' },
          cRing: i + 1,
          extra: [arrow('hop', [from, cY + CW + 3], [to, cY + CW + 3], { bend: 8, tone: 'warn', width: 1.5 })],
          status: seg('counter[', [String(i + 1), 'warn', true], '] += counter[', [String(i), 'accent', true], ']  →  ', [String(prefix[i + 1]), 'warn', true]),
        }),
        say: fmt(i === M - 1 ? FULL_SAY.prefixLast[l] : FULL_SAY.prefix[l], { a: i + 1, b: i, c: prefix[i + 1] }),
      });
    }
    const c = [...prefix];
    const placed = new Set<number>();
    const res: (number | null)[] = INTS.map(() => null);
    for (let i = n - 1; i >= 0; i--) {
      const v = INTS[i];
      const p = c[v] - 1;
      const before = c[v];
      c[v] -= 1;
      at[i] = { row: 'res', slot: p };
      res[p] = v;
      const again = placed.has(v);
      placed.add(v);
      frames.push({
        kind: 'place',
        scene: scene({
          at: [...at],
          counter: [...c],
          cTone: { [v]: 'warn' },
          cRing: v,
          ring: i,
          cursor: i,
          extra: [link('pa', cBox(v, 0), slotBox('res', p), { tone: 'warn', dashed: true, width: 1.5 })],
          status: seg('res[', [String(p), 'info', true], '] = ', [String(v), V_TONE[v], true], '    counter[', [String(v), V_TONE[v], true], ']: ', String(before), ' → ', [String(c[v]), 'warn', true]),
        }),
        say: fmt(again ? FULL_SAY.placeAgain[l] : FULL_SAY.place[l], { i, v, p }),
      });
    }
    const back: Place[] = at.map((p) => ({ row: 'nums', slot: p.slot }));
    frames.push({
      kind: 'copy',
      scene: scene({ at: back, counter: [...c], resShow: res, status: seg('nums = [', [res.join(', '), 'ok', true], ']') }),
      say: FULL_SAY.copy[l],
    });
    return { frames };
  },
};

// ── Radix sort: counting sort on each digit, lowest first ─────────────

const IDS = [10546151, 35663510, 42865989, 34862445, 81883077, 88906420, 72429244, 30524779, 82060337, 63832996];
const DIGITS = 8;

type RadixKind = 'init' | 'digit' | 'sort' | 'done';

const RADIX_SAY: Record<RadixKind | 'sort1', T> = {
  init: {
    en: 'Sort 10 eight-digit student IDs. The lowest digit is the 1st and the highest is the 8th; start with k = 1.',
    zh: '对 10 个 8 位学号排序。最低位是第 1 位，最高位是第 8 位，从 k = 1 开始。',
    'zh-hant': '對 10 個 8 位學號排序。最低位是第 1 位，最高位是第 8 位，從 k = 1 開始。',
    ja: '8 桁の学籍番号 10 個をソートします。最下位桁が第 1 位、最上位桁が第 8 位で、k = 1 から始めます。',
    ru: 'Сортируем 10 восьмизначных номеров студентов. Младший разряд — 1-й, старший — 8-й; начинаем с k = 1.',
  },
  digit: {
    en: 'Pass {k}: take digit {k} of each ID, d = ⌊x / {exp}⌋ mod 10.',
    zh: '第 {k} 轮：取每个学号的第 {k} 位，d = ⌊x / {exp}⌋ mod 10。',
    'zh-hant': '第 {k} 輪：取每個學號的第 {k} 位，d = ⌊x / {exp}⌋ mod 10。',
    ja: '第 {k} ラウンド：各学籍番号の第 {k} 位 d = ⌊x / {exp}⌋ mod 10 を取り出します。',
    ru: 'Проход {k}: берем {k}-й разряд каждого номера, d = ⌊x / {exp}⌋ mod 10.',
  },
  sort1: {
    en: 'Counting sort by digit 1. It is stable, so IDs with the same digit keep their original order. The IDs are now ordered by digit 1.',
    zh: '对第 1 位执行计数排序。它是稳定的，第 1 位相同的学号保持原有的相对顺序。现在学号按第 1 位有序。',
    'zh-hant': '對第 1 位執行計數排序。它是穩定的，第 1 位相同的學號保持原有的相對順序。現在學號按第 1 位有序。',
    ja: '第 1 位で計数ソートします。安定なので、第 1 位が同じ番号は元の順序を保ちます。これで第 1 位の順に並びました。',
    ru: 'Сортировка подсчетом по 1-му разряду. Она стабильна: номера с одинаковой цифрой сохраняют исходный порядок. Теперь номера упорядочены по 1-му разряду.',
  },
  sort: {
    en: 'Counting sort by digit {k}. It is stable, so IDs with the same digit keep the order of the previous pass. The IDs are now ordered by their lowest {k} digits.',
    zh: '对第 {k} 位执行计数排序。它是稳定的，第 {k} 位相同的学号保持上一轮的相对顺序。现在学号按低 {k} 位有序。',
    'zh-hant': '對第 {k} 位執行計數排序。它是穩定的，第 {k} 位相同的學號保持上一輪的相對順序。現在學號按低 {k} 位有序。',
    ja: '第 {k} 位で計数ソートします。安定なので、第 {k} 位が同じ番号は前のラウンドの順序を保ちます。これで下位 {k} 桁の順に並びました。',
    ru: 'Сортировка подсчетом по {k}-му разряду. Она стабильна: номера с одинаковой цифрой сохраняют порядок предыдущего прохода. Теперь номера упорядочены по младшим {k} разрядам.',
  },
  done: {
    en: 'After the 8th digit, all student IDs are sorted.',
    zh: '第 8 位排序完成后，所有学号都已有序。',
    'zh-hant': '第 8 位排序完成後，所有學號都已有序。',
    ja: '第 8 位までソートし終えると、すべての学籍番号が整列します。',
    ru: 'После 8-го разряда все номера студентов отсортированы.',
  },
};

const digitOf = (x: number, k: number) => Math.floor(x / 10 ** (k - 1)) % 10;

/** An ID with digit k in the accent color and the digits already sorted on in green. */
function idText(x: number, k: number, sortedUpTo: number): Segment[] {
  const s = String(x).padStart(DIGITS, '0');
  return s.split('').map((ch, p) => {
    const kk = DIGITS - p;
    if (kk === k) return { t: ch, tone: 'accent', bold: true };
    if (kk <= sortedUpTo) return { t: ch, tone: 'ok' };
    return { t: ch };
  });
}

const radixSortOverview: StepFigure = {
  type: 'steps',
  call: 'radix_sort(nums)',
  tones: { init: 'idle', digit: 'cmp', sort: 'swp', done: 'done' },
  sources: funcSources(RADIX_PY, RADIX_JAVA, ['radix_sort'], {
    python: {
      init: ['m = max(nums)'],
      digit: ['while exp <= m:'],
      sort: ['counting_sort_digit(nums, exp)'],
      done: ['while exp <= m:'],
    },
    java: {
      init: ['int m = Integer.MIN_VALUE;'],
      digit: ['for (int exp = 1; exp <= m; exp *= 10) {'],
      sort: ['countingSortDigit(nums, exp);'],
      done: ['for (int exp = 1; exp <= m; exp *= 10) {'],
    },
  }),
  build(l) {
    const y0 = 48;
    const step = 28;
    const rh = 24;
    const bw = 116;
    const bx = 172;
    const tx = bx + bw + 12;
    const scene = (order: number[], o: { k: number; sorted: number; tags: boolean; done?: boolean; header: Rich }) => {
      const nodes: SceneNode[] = [chip('hdr', W / 2, 6, o.header, { size: 13 }), nameLabel('l:nums', bx - 30, y0, rh, 'nums')];
      order.forEach((id, r) => {
        const y = y0 + r * step;
        nodes.push(
          text(`ix${r}`, bx - 10, y + rh / 2 + 4, String(r), { anchor: 'end', mono: true, size: 11, tone: 'muted' }),
          box(`n${id}`, bx, y, o.done ? String(IDS[id]) : idText(IDS[id], o.k, o.sorted), { w: bw, h: rh, size: 15, tone: o.done ? 'ok' : 'idle' }),
        );
        if (o.tags) nodes.push(box(`t${id}`, tx, y, digitOf(IDS[id], o.k), { w: 26, h: rh, size: 13, tone: 'accent' }));
      });
      return { w: W, h: y0 + 9 * step + rh + 8, nodes };
    };
    const head = (k: number, exp: number) => seg('k = ', [String(k), 'accent', true], '    d = ⌊x / ', [String(exp), 'accent', true], '⌋ mod 10');
    let order = IDS.map((_, i) => i);
    const frames: SceneFrame[] = [
      { kind: 'init', scene: scene(order, { k: 0, sorted: 0, tags: false, header: 'xₖ = ⌊x / 10ᵏ⁻¹⌋ mod 10' }), say: RADIX_SAY.init[l] },
    ];
    for (let k = 1; k <= DIGITS; k++) {
      const exp = 10 ** (k - 1);
      frames.push({ kind: 'digit', scene: scene(order, { k, sorted: k - 1, tags: true, header: head(k, exp) }), say: fmt(RADIX_SAY.digit[l], { k, exp }) });
      order = [...order].sort((a, b) => digitOf(IDS[a], k) - digitOf(IDS[b], k));
      frames.push({ kind: 'sort', scene: scene(order, { k, sorted: k, tags: true, header: head(k, exp) }), say: fmt(k === 1 ? RADIX_SAY.sort1[l] : RADIX_SAY.sort[l], { k }) });
    }
    frames.push({ kind: 'done', scene: scene(order, { k: 0, sorted: DIGITS, tags: false, done: true, header: 'xₖ = ⌊x / 10ᵏ⁻¹⌋ mod 10' }), say: RADIX_SAY.done[l] });
    return { frames };
  },
};

export const DISTRIBUTE_FIGURES: Record<string, Figure> = {
  bucket_sort_overview: bucketSortOverview,
  scatter_in_buckets_distribution: scatterInBucketsDistribution,
  scatter_in_buckets_recursively: scatterInBucketsRecursively,
  counting_sort_overview: countingSortOverview,
  counting_sort_steps: countingSortSteps,
  radix_sort_overview: radixSortOverview,
};
