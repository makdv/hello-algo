import javaEn from '@codes-en/java/chapter_sorting/quick_sort.java?raw';
import pythonEn from '@codes-en/python/chapter_sorting/quick_sort.py?raw';
import javaJa from '@codes-ja/java/chapter_sorting/quick_sort.java?raw';
import pythonJa from '@codes-ja/python/chapter_sorting/quick_sort.py?raw';
import javaRu from '@codes-ru/java/chapter_sorting/quick_sort.java?raw';
import pythonRu from '@codes-ru/python/chapter_sorting/quick_sort.py?raw';
import javaZh from '@codes-zh/java/chapter_sorting/quick_sort.java?raw';
import pythonZh from '@codes-zh/python/chapter_sorting/quick_sort.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_sorting/quick_sort.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_sorting/quick_sort.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type QuickKind = 'init' | 'partition' | 'cmpj' | 'cmpi' | 'swp' | 'pivot' | 'end';

export interface QuickData {
  lo: number | null;
  hi: number | null;
  i: number | null;
  j: number | null;
  /** Pivot value of the current partition. */
  pivot: number | null;
  /** For cmpj: nums[j] >= pivot (j keeps moving). For cmpi: nums[i] <= pivot (i keeps moving). */
  moves?: boolean;
}

export type QuickFrame = ArrayFrame<QuickData> & { kind: QuickKind };

export function traceQuickSort(input: number[]): QuickFrame[] {
  const items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const frames: QuickFrame[] = [];
  const done = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  const snap = (
    kind: QuickKind,
    o: { lo?: number | null; hi?: number | null; i?: number | null; j?: number | null; cmp?: number[]; swp?: number[]; moves?: boolean },
  ) => {
    const { lo = null, hi = null, i = null, j = null, cmp = [], swp = [], moves } = o;
    const pivotIdx = kind === 'pivot' ? i : lo;
    const marks: Mark[] = items.map((_, idx) => {
      if (done.has(idx)) return 'done';
      if (swp.includes(idx)) return 'swp';
      if (cmp.includes(idx)) return 'cmp';
      if (idx === pivotIdx && kind !== 'end' && kind !== 'init') return 'swp';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (lo !== null && kind !== 'pivot') pointers.push({ label: 'pivot', index: lo });
    if (i !== null && kind !== 'pivot') pointers.push({ label: 'i', index: i });
    if (j !== null && kind !== 'pivot') pointers.push({ label: 'j', index: j });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['left', lo],
        ['right', hi],
        ['i', i],
        ['j', j],
      ],
      stats: { comparisons, swaps, sorted: done.size },
      range: lo !== null && hi !== null ? [lo, hi] : undefined,
      data: { lo, hi, i, j, pivot: lo !== null && kind !== 'pivot' ? items[lo].value : i !== null ? items[i].value : null, moves },
    });
  };

  const partition = (lo: number, hi: number) => {
    let i = lo;
    let j = hi;
    snap('partition', { lo, hi, i, j });
    while (i < j) {
      while (i < j) {
        comparisons++;
        const ge = items[j].value >= items[lo].value;
        snap('cmpj', { lo, hi, i, j, cmp: [j], moves: ge });
        if (!ge) break;
        j--;
      }
      while (i < j) {
        comparisons++;
        const le = items[i].value <= items[lo].value;
        snap('cmpi', { lo, hi, i, j, cmp: [i], moves: le });
        if (!le) break;
        i++;
      }
      if (i !== j) {
        [items[i], items[j]] = [items[j], items[i]];
        swaps++;
        snap('swp', { lo, hi, i, j, swp: [i, j] });
      }
    }
    if (i !== lo) {
      [items[i], items[lo]] = [items[lo], items[i]];
      swaps++;
    }
    done.add(i);
    snap('pivot', { lo, hi, i });
    return i;
  };

  const sort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      done.add(lo);
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  snap('init', {});
  sort(0, n - 1);
  for (let k = 0; k < n; k++) done.add(k);
  snap('end', {});
  return frames;
}

interface Ctx {
  lo: number;
  hi: number;
  i: number;
  j: number;
  p: number;
  a: number;
  x: number;
  y: number;
  moves: boolean;
  list: string;
  comparisons: number;
  swaps: number;
}

type Lines = Record<QuickKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: () => 'Quick sort: pick a pivot, partition the range around it, then sort both sides the same way.',
    partition: (c) => `Partition [${c.lo}, ${c.hi}] with pivot nums[${c.lo}] = ${c.p}.`,
    cmpj: (c) => `j = ${c.j}: is nums[j] = ${c.a} ≥ pivot ${c.p}? ${c.moves ? 'Yes, move j left.' : 'No, j stops here.'}`,
    cmpi: (c) => `i = ${c.i}: is nums[i] = ${c.a} ≤ pivot ${c.p}? ${c.moves ? 'Yes, move i right.' : 'No, i stops here.'}`,
    swp: (c) => `Swap nums[${c.i}] and nums[${c.j}]: the smaller ${c.x} goes left, the larger ${c.y} goes right.`,
    pivot: (c) => `Swap the pivot ${c.p} to index ${c.i}. Left of it is ≤ ${c.p}, right of it is ≥ ${c.p}; it is in its final place.`,
    end: (c) => `Done. nums = [${c.list}] with ${c.comparisons} comparisons and ${c.swaps} swaps.`,
  },
  zh: {
    init: () => '快速排序：选一个基准数，把区间按它划分，再用同样的方法排序两侧。',
    partition: (c) => `划分 [${c.lo}, ${c.hi}]，基准数为 nums[${c.lo}] = ${c.p}。`,
    cmpj: (c) => `j = ${c.j}：nums[j] = ${c.a} ≥ 基准数 ${c.p} 吗？${c.moves ? '是，j 左移。' : '否，j 停在这里。'}`,
    cmpi: (c) => `i = ${c.i}：nums[i] = ${c.a} ≤ 基准数 ${c.p} 吗？${c.moves ? '是，i 右移。' : '否，i 停在这里。'}`,
    swp: (c) => `交换 nums[${c.i}] 与 nums[${c.j}]：较小的 ${c.x} 到左边，较大的 ${c.y} 到右边。`,
    pivot: (c) => `把基准数 ${c.p} 交换到索引 ${c.i}。它左边都 ≤ ${c.p}，右边都 ≥ ${c.p}，它已到达最终位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比较 ${c.comparisons} 次，交换 ${c.swaps} 次。`,
  },
  'zh-hant': {
    init: () => '快速排序：選一個基準數，把區間按它劃分，再用同樣的方法排序兩側。',
    partition: (c) => `劃分 [${c.lo}, ${c.hi}]，基準數為 nums[${c.lo}] = ${c.p}。`,
    cmpj: (c) => `j = ${c.j}：nums[j] = ${c.a} ≥ 基準數 ${c.p} 嗎？${c.moves ? '是，j 左移。' : '否，j 停在這裡。'}`,
    cmpi: (c) => `i = ${c.i}：nums[i] = ${c.a} ≤ 基準數 ${c.p} 嗎？${c.moves ? '是，i 右移。' : '否，i 停在這裡。'}`,
    swp: (c) => `交換 nums[${c.i}] 與 nums[${c.j}]：較小的 ${c.x} 到左邊，較大的 ${c.y} 到右邊。`,
    pivot: (c) => `把基準數 ${c.p} 交換到索引 ${c.i}。它左邊都 ≤ ${c.p}，右邊都 ≥ ${c.p}，它已到達最終位置。`,
    end: (c) => `完成。nums = [${c.list}]，共比較 ${c.comparisons} 次，交換 ${c.swaps} 次。`,
  },
  ja: {
    init: () => 'クイックソート：ピボットを選び、区間をそれで分割し、両側を同じ方法で整列します。',
    partition: (c) => `[${c.lo}, ${c.hi}] をピボット nums[${c.lo}] = ${c.p} で分割。`,
    cmpj: (c) => `j = ${c.j}：nums[j] = ${c.a} ≥ ピボット ${c.p}？${c.moves ? 'はい、j を左へ。' : 'いいえ、j はここで止まる。'}`,
    cmpi: (c) => `i = ${c.i}：nums[i] = ${c.a} ≤ ピボット ${c.p}？${c.moves ? 'はい、i を右へ。' : 'いいえ、i はここで止まる。'}`,
    swp: (c) => `nums[${c.i}] と nums[${c.j}] を交換：小さい ${c.x} は左へ、大きい ${c.y} は右へ。`,
    pivot: (c) => `ピボット ${c.p} をインデックス ${c.i} へ。左は ≤ ${c.p}、右は ≥ ${c.p} で、ピボットは確定。`,
    end: (c) => `完了。nums = [${c.list}]、比較 ${c.comparisons} 回、交換 ${c.swaps} 回。`,
  },
  ru: {
    init: () => 'Быстрая сортировка: выбираем опорный элемент, разбиваем диапазон вокруг него и так же сортируем обе части.',
    partition: (c) => `Разбиваем [${c.lo}, ${c.hi}] с опорным nums[${c.lo}] = ${c.p}.`,
    cmpj: (c) => `j = ${c.j}: nums[j] = ${c.a} ≥ опорного ${c.p}? ${c.moves ? 'Да, j идёт влево.' : 'Нет, j останавливается.'}`,
    cmpi: (c) => `i = ${c.i}: nums[i] = ${c.a} ≤ опорного ${c.p}? ${c.moves ? 'Да, i идёт вправо.' : 'Нет, i останавливается.'}`,
    swp: (c) => `Меняем nums[${c.i}] и nums[${c.j}]: меньший ${c.x} уходит влево, больший ${c.y} — вправо.`,
    pivot: (c) => `Ставим опорный ${c.p} на позицию ${c.i}. Слева всё ≤ ${c.p}, справа всё ≥ ${c.p}; он на своём месте.`,
    end: (c) => `Готово. nums = [${c.list}]; сравнений: ${c.comparisons}, обменов: ${c.swaps}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: () => 'Pick a leader bubble, then split everyone into smaller and bigger teams!',
    partition: (c) => `Bubble ${c.p} is the leader now.`,
    cmpj: (c) => (c.moves ? `${c.a} is not smaller than ${c.p}. Look further left.` : `${c.a} is smaller than ${c.p}! Stop here.`),
    cmpi: (c) => (c.moves ? `${c.a} is not bigger than ${c.p}. Look further right.` : `${c.a} is bigger than ${c.p}! Stop here.`),
    swp: (c) => `Whoosh! ${c.x} and ${c.y} trade places.`,
    pivot: (c) => `Leader ${c.p} jumps between the teams. It is home!`,
    end: () => 'Everyone is in order, smallest to biggest. Great job!',
  },
  zh: {
    init: () => '选一个队长泡泡，把大家分成小的一队和大的一队！',
    partition: (c) => `现在泡泡 ${c.p} 当队长。`,
    cmpj: (c) => (c.moves ? `${c.a} 不比 ${c.p} 小，继续往左看。` : `${c.a} 比 ${c.p} 小！停在这里。`),
    cmpi: (c) => (c.moves ? `${c.a} 不比 ${c.p} 大，继续往右看。` : `${c.a} 比 ${c.p} 大！停在这里。`),
    swp: (c) => `嗖！${c.x} 和 ${c.y} 交换位置。`,
    pivot: (c) => `队长 ${c.p} 跳到两队中间。它到家了！`,
    end: () => '大家都从小到大排好了。太棒了！',
  },
  'zh-hant': {
    init: () => '選一個隊長泡泡，把大家分成小的一隊和大的一隊！',
    partition: (c) => `現在泡泡 ${c.p} 當隊長。`,
    cmpj: (c) => (c.moves ? `${c.a} 不比 ${c.p} 小，繼續往左看。` : `${c.a} 比 ${c.p} 小！停在這裡。`),
    cmpi: (c) => (c.moves ? `${c.a} 不比 ${c.p} 大，繼續往右看。` : `${c.a} 比 ${c.p} 大！停在這裡。`),
    swp: (c) => `咻！${c.x} 和 ${c.y} 交換位置。`,
    pivot: (c) => `隊長 ${c.p} 跳到兩隊中間。它到家了！`,
    end: () => '大家都從小到大排好了。太棒了！',
  },
  ja: {
    init: () => 'リーダーのバブルを決めて、みんなを小さいチームと大きいチームに分けよう！',
    partition: (c) => `今のリーダーはバブル ${c.p}。`,
    cmpj: (c) => (c.moves ? `${c.a} は ${c.p} より小さくない。もっと左を見よう。` : `${c.a} は ${c.p} より小さい！ここでストップ。`),
    cmpi: (c) => (c.moves ? `${c.a} は ${c.p} より大きくない。もっと右を見よう。` : `${c.a} は ${c.p} より大きい！ここでストップ。`),
    swp: (c) => `ビュン！${c.x} と ${c.y} が入れかわる。`,
    pivot: (c) => `リーダー ${c.p} がチームのあいだへジャンプ。おうちに着いた！`,
    end: () => 'みんな小さい順にならんだよ。すごい！',
  },
  ru: {
    init: () => 'Выберем пузыря-вожака и разделим всех на команду поменьше и команду побольше!',
    partition: (c) => `Теперь вожак — пузырь ${c.p}.`,
    cmpj: (c) => (c.moves ? `${c.a} не меньше, чем ${c.p}. Смотрим левее.` : `${c.a} меньше, чем ${c.p}! Стоп.`),
    cmpi: (c) => (c.moves ? `${c.a} не больше, чем ${c.p}. Смотрим правее.` : `${c.a} больше, чем ${c.p}! Стоп.`),
    swp: (c) => `Вжух! ${c.x} и ${c.y} меняются местами.`,
    pivot: (c) => `Вожак ${c.p} прыгает между командами. Он дома!`,
    end: () => 'Все стоят по порядку, от маленького к большому. Отлично!',
  },
};

const QUESTION: Record<Locale, { readerJ: (c: Ctx) => string; readerI: (c: Ctx) => string; kidJ: (c: Ctx) => string; kidI: (c: Ctx) => string; move: [string, string]; stop: [string, string] }> = {
  en: {
    readerJ: (c) => `Will j move left past nums[${c.j}] = ${c.a} (is it ≥ pivot ${c.p})?`,
    readerI: (c) => `Will i move right past nums[${c.i}] = ${c.a} (is it ≤ pivot ${c.p})?`,
    kidJ: (c) => `Is ${c.a} smaller than leader ${c.p}?`,
    kidI: (c) => `Is ${c.a} bigger than leader ${c.p}?`,
    move: ['Keep moving', 'No, keep going!'],
    stop: ['Stop here', 'Yes, stop!'],
  },
  zh: {
    readerJ: (c) => `j 会越过 nums[${c.j}] = ${c.a} 继续左移吗（它 ≥ 基准数 ${c.p}）？`,
    readerI: (c) => `i 会越过 nums[${c.i}] = ${c.a} 继续右移吗（它 ≤ 基准数 ${c.p}）？`,
    kidJ: (c) => `${c.a} 比队长 ${c.p} 小吗？`,
    kidI: (c) => `${c.a} 比队长 ${c.p} 大吗？`,
    move: ['继续移动', '不是，继续！'],
    stop: ['停在这里', '是，停！'],
  },
  'zh-hant': {
    readerJ: (c) => `j 會越過 nums[${c.j}] = ${c.a} 繼續左移嗎（它 ≥ 基準數 ${c.p}）？`,
    readerI: (c) => `i 會越過 nums[${c.i}] = ${c.a} 繼續右移嗎（它 ≤ 基準數 ${c.p}）？`,
    kidJ: (c) => `${c.a} 比隊長 ${c.p} 小嗎？`,
    kidI: (c) => `${c.a} 比隊長 ${c.p} 大嗎？`,
    move: ['繼續移動', '不是，繼續！'],
    stop: ['停在這裡', '是，停！'],
  },
  ja: {
    readerJ: (c) => `j は nums[${c.j}] = ${c.a} を越えて左へ進む？（ピボット ${c.p} 以上？）`,
    readerI: (c) => `i は nums[${c.i}] = ${c.a} を越えて右へ進む？（ピボット ${c.p} 以下？）`,
    kidJ: (c) => `${c.a} はリーダー ${c.p} より小さい？`,
    kidI: (c) => `${c.a} はリーダー ${c.p} より大きい？`,
    move: ['進み続ける', 'いいえ、進む！'],
    stop: ['ここで止まる', 'はい、ストップ！'],
  },
  ru: {
    readerJ: (c) => `Пройдёт ли j влево мимо nums[${c.j}] = ${c.a} (он ≥ опорного ${c.p})?`,
    readerI: (c) => `Пройдёт ли i вправо мимо nums[${c.i}] = ${c.a} (он ≤ опорного ${c.p})?`,
    kidJ: (c) => `${c.a} меньше вожака ${c.p}?`,
    kidI: (c) => `${c.a} больше вожака ${c.p}?`,
    move: ['Идёт дальше', 'Нет, дальше!'],
    stop: ['Остановится', 'Да, стоп!'],
  },
};

function ctx(f: QuickFrame): Ctx {
  const { lo, hi, i, j, pivot, moves } = f.data;
  const n = f.items.length;
  const value = (idx: number | null) => (idx === null || idx < 0 || idx >= n ? 0 : f.items[idx].value);
  const a = f.kind === 'cmpi' ? value(i) : value(j);
  return {
    lo: lo ?? 0,
    hi: hi ?? 0,
    i: i ?? 0,
    j: j ?? 0,
    p: pivot ?? 0,
    a,
    x: value(i),
    y: value(j),
    moves: Boolean(moves),
    list: f.items.map((it) => it.value).join(', '),
    comparisons: f.stats.comparisons,
    swaps: f.stats.swaps,
  };
}

function narrate(f: QuickFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: QuickFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'cmpi' && f.kind !== 'cmpj') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  const isJ = f.kind === 'cmpj';
  return {
    prompt: kid ? (isJ ? q.kidJ(c) : q.kidI(c)) : isJ ? q.readerJ(c) : q.readerI(c),
    choices: [
      { id: 'move', label: q.move[kid ? 1 : 0], tone: 'cmp' },
      { id: 'stop', label: q.stop[kid ? 1 : 0], tone: 'swp' },
    ],
    answer: c.moves ? 'move' : 'stop',
    explain: narrate(f, voice, locale),
  };
}

export const quickSort: AlgorithmSpec<QuickFrame> = {
  id: 'quick_sort',
  title: { en: 'Quick sort', zh: '快速排序', 'zh-hant': '快速排序', ja: 'クイックソート', ru: 'Быстрая сортировка' },
  call: 'quick_sort',
  defaultInput: [2, 4, 1, 0, 3, 5],
  initialStep: 3,
  trace: traceQuickSort,
  tones: { init: 'idle', partition: 'swp', cmpj: 'cmp', cmpi: 'cmp', swp: 'swp', pivot: 'done', end: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [
        { cls: 'quick_sort', func: 'partition' },
        { cls: 'quick_sort', func: 'quick_sort' },
      ],
      anchors: {
        init: ['def quick_sort('],
        partition: ['i, j = left, right'],
        cmpj: ['while i < j and nums[j] >= nums[left]'],
        cmpi: ['while i < j and nums[i] <= nums[left]'],
        swp: ['nums[i], nums[j] = nums[j], nums[i]'],
        pivot: ['nums[i], nums[left] = nums[left], nums[i]'],
        end: ['self.quick_sort(nums, pivot + 1, right)'],
      },
    },
    java: {
      label: 'Java',
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [
        { cls: 'quick_sort', func: 'partition' },
        { cls: 'quick_sort', func: 'quick_sort' },
      ],
      anchors: {
        init: ['void quickSort(int[] nums, int left, int right)'],
        partition: ['int i = left, j = right'],
        cmpj: ['while (i < j && nums[j] >= nums[left])'],
        cmpi: ['while (i < j && nums[i] <= nums[left])'],
        swp: ['swap(nums, i, j)'],
        pivot: ['swap(nums, i, left)'],
        end: ['quickSort(nums, pivot + 1, right)'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Pick the first bubble as leader.', 'Smaller ones go left, bigger ones go right.', 'Do the same in each team.'],
      zh: ['让第一个泡泡当队长。', '小的去左边，大的去右边。', '每一队都照样来一次。'],
      'zh-hant': ['讓第一個泡泡當隊長。', '小的去左邊，大的去右邊。', '每一隊都照樣來一次。'],
      ja: ['最初のバブルをリーダーにする。', '小さいのは左、大きいのは右へ。', 'それぞれのチームでも同じことを。'],
      ru: ['Первый пузырь — вожак.', 'Меньшие налево, большие направо.', 'То же самое в каждой команде.'],
    },
    peek: `def quick_sort(nums, left, right):
    if left >= right:
        return
    pivot = partition(nums, left, right)
    quick_sort(nums, left, pivot - 1)
    quick_sort(nums, pivot + 1, right)`,
    rounds: (f) => ({ current: Math.max(f.stats.sorted, f.kind === 'end' ? f.items.length : 1), total: Math.max(f.items.length, 1) }),
  },
};
