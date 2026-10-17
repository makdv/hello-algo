import javaEn from '@codes-en/java/chapter_sorting/insertion_sort.java?raw';
import pythonEn from '@codes-en/python/chapter_sorting/insertion_sort.py?raw';
import javaJa from '@codes-ja/java/chapter_sorting/insertion_sort.java?raw';
import pythonJa from '@codes-ja/python/chapter_sorting/insertion_sort.py?raw';
import javaRu from '@codes-ru/java/chapter_sorting/insertion_sort.java?raw';
import pythonRu from '@codes-ru/python/chapter_sorting/insertion_sort.py?raw';
import javaZh from '@codes-zh/java/chapter_sorting/insertion_sort.java?raw';
import pythonZh from '@codes-zh/python/chapter_sorting/insertion_sort.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_sorting/insertion_sort.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_sorting/insertion_sort.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type InsertionKind = 'init' | 'pick' | 'cmp' | 'shift' | 'place' | 'end';

export interface InsertionData {
  i: number | null;
  j: number | null;
  /** Current index of the element being inserted. */
  base: number | null;
  /** For `cmp`: nums[j] > base, so nums[j] shifts right. */
  gt?: boolean;
}

export type InsertionFrame = ArrayFrame<InsertionData> & { kind: InsertionKind };

/**
 * Records insertion sort. Shifting nums[j] right and writing base into the gap is drawn
 * as base sliding left past each larger element, which is what the shifts amount to.
 */
export function traceInsertionSort(input: number[]): InsertionFrame[] {
  const items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const frames: InsertionFrame[] = [];
  let comparisons = 0;
  let moves = 0;

  const snap = (kind: InsertionKind, o: { sortedTo: number; i?: number | null; j?: number | null; base?: number | null; gt?: boolean }) => {
    const { sortedTo, i = null, j = null, base = null, gt } = o;
    const marks: Mark[] = items.map((_, idx) => {
      if (idx === base) return 'swp';
      if (idx === j && kind === 'cmp') return 'cmp';
      if (idx <= sortedTo) return 'done';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (i !== null) pointers.push({ label: 'i', index: i });
    if (j !== null && j >= 0 && kind === 'cmp') pointers.push({ label: 'j', index: j });
    if (base !== null) pointers.push({ label: 'base', index: base });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['i', i],
        ['j', j],
        ['base', base === null ? null : items[base].value],
      ],
      stats: { comparisons, moves },
      data: { i, j, base, gt },
    });
  };

  snap('init', { sortedTo: n > 0 ? 0 : -1 });
  for (let i = 1; i < n; i++) {
    let b = i;
    snap('pick', { sortedTo: i - 1, i, base: b });
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      const gt = items[j].value > items[b].value;
      snap('cmp', { sortedTo: i - 1, i, j, base: b, gt });
      if (!gt) break;
      [items[j], items[j + 1]] = [items[j + 1], items[j]];
      moves++;
      b = j;
      snap('shift', { sortedTo: i - 1, i, j, base: b });
      j--;
    }
    snap('place', { sortedTo: i, i, base: b });
  }
  snap('end', { sortedTo: n - 1 });
  return frames;
}

interface Ctx {
  i: number;
  j: number;
  /** Where base is now. */
  b: number;
  /** The element base is compared with (cmp) or slid past (shift). */
  a: number;
  base: number;
  gt: boolean;
  list: string;
  comparisons: number;
  moves: number;
}

type Lines = Record<InsertionKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: () => 'nums[0] alone is a sorted part. Insert the other elements into it one by one.',
    pick: (c) => `Take base = nums[${c.i}] = ${c.base}. The sorted part is [0, ${c.i - 1}].`,
    cmp: (c) => `Is nums[${c.j}] = ${c.a} > base = ${c.base}? ${c.gt ? 'Yes, shift it one step right.' : 'No, base goes right after it.'}`,
    shift: (c) => `${c.a} moves one step right; base is now at index ${c.b}.`,
    place: (c) => `Write base = ${c.base} at index ${c.b}. The sorted part is now [0, ${c.i}].`,
    end: (c) => `Done. nums = [${c.list}] with ${c.comparisons} comparisons and ${c.moves} moves.`,
  },
  zh: {
    init: () => 'nums[0] 单独构成已排序区间，把其余元素逐个插入其中。',
    pick: (c) => `取出 base = nums[${c.i}] = ${c.base}。已排序区间为 [0, ${c.i - 1}]。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} > base = ${c.base} 吗？${c.gt ? '是的，把它向右移动一位。' : '不是，base 应放在它后面。'}`,
    shift: (c) => `${c.a} 向右移动一位；base 现在位于索引 ${c.b}。`,
    place: (c) => `把 base = ${c.base} 写入索引 ${c.b}。已排序区间变为 [0, ${c.i}]。`,
    end: (c) => `完成。nums = [${c.list}]，共比较 ${c.comparisons} 次，移动 ${c.moves} 次。`,
  },
  'zh-hant': {
    init: () => 'nums[0] 單獨構成已排序區間，把其餘元素逐個插入其中。',
    pick: (c) => `取出 base = nums[${c.i}] = ${c.base}。已排序區間為 [0, ${c.i - 1}]。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} > base = ${c.base} 嗎？${c.gt ? '是的，把它向右移動一位。' : '不是，base 應放在它後面。'}`,
    shift: (c) => `${c.a} 向右移動一位；base 現在位於索引 ${c.b}。`,
    place: (c) => `把 base = ${c.base} 寫入索引 ${c.b}。已排序區間變為 [0, ${c.i}]。`,
    end: (c) => `完成。nums = [${c.list}]，共比較 ${c.comparisons} 次，移動 ${c.moves} 次。`,
  },
  ja: {
    init: () => 'nums[0] だけで整列済みの部分とみなし、残りの要素を 1 つずつ挿入します。',
    pick: (c) => `base = nums[${c.i}] = ${c.base} を取り出す。整列済みの部分は [0, ${c.i - 1}]。`,
    cmp: (c) => `nums[${c.j}] = ${c.a} > base = ${c.base}？${c.gt ? 'はい、1 つ右へずらします。' : 'いいえ、base はその直後に入ります。'}`,
    shift: (c) => `${c.a} が 1 つ右へ。base は今インデックス ${c.b}。`,
    place: (c) => `base = ${c.base} をインデックス ${c.b} に書き込む。整列済みの部分は [0, ${c.i}] に。`,
    end: (c) => `完了。nums = [${c.list}]、比較 ${c.comparisons} 回、移動 ${c.moves} 回。`,
  },
  ru: {
    init: () => 'Один nums[0] — уже отсортированная часть. Вставляем в неё остальные элементы по одному.',
    pick: (c) => `Берём base = nums[${c.i}] = ${c.base}. Отсортированная часть — [0, ${c.i - 1}].`,
    cmp: (c) => `nums[${c.j}] = ${c.a} > base = ${c.base}? ${c.gt ? 'Да, сдвигаем его на одну позицию вправо.' : 'Нет, base встаёт сразу после него.'}`,
    shift: (c) => `${c.a} сдвигается вправо; base теперь на позиции ${c.b}.`,
    place: (c) => `Записываем base = ${c.base} на позицию ${c.b}. Отсортированная часть — [0, ${c.i}].`,
    end: (c) => `Готово. nums = [${c.list}]; сравнений: ${c.comparisons}, сдвигов: ${c.moves}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: () => 'The first bubble is already in order. Let us slide each new bubble into its spot!',
    pick: (c) => `Pick up bubble ${c.base}!`,
    cmp: (c) => (c.gt ? `${c.a} is bigger than ${c.base}, so it slides right.` : `${c.a} is not bigger than ${c.base}. Found the spot!`),
    shift: (c) => `Slide! ${c.base} moves left past ${c.a}.`,
    place: (c) => `${c.base} sits down in its spot.`,
    end: () => 'Everyone is in order, smallest to biggest. Great job!',
  },
  zh: {
    init: () => '第一个泡泡已经排好了。把每个新泡泡滑进它的位置吧！',
    pick: (c) => `拿起泡泡 ${c.base}！`,
    cmp: (c) => (c.gt ? `${c.a} 比 ${c.base} 大，它往右滑。` : `${c.a} 不比 ${c.base} 大。找到位置啦！`),
    shift: (c) => `滑！${c.base} 越过 ${c.a} 往左移。`,
    place: (c) => `${c.base} 坐到了它的位置上。`,
    end: () => '大家都从小到大排好了。太棒了！',
  },
  'zh-hant': {
    init: () => '第一個泡泡已經排好了。把每個新泡泡滑進它的位置吧！',
    pick: (c) => `拿起泡泡 ${c.base}！`,
    cmp: (c) => (c.gt ? `${c.a} 比 ${c.base} 大，它往右滑。` : `${c.a} 不比 ${c.base} 大。找到位置啦！`),
    shift: (c) => `滑！${c.base} 越過 ${c.a} 往左移。`,
    place: (c) => `${c.base} 坐到了它的位置上。`,
    end: () => '大家都從小到大排好了。太棒了！',
  },
  ja: {
    init: () => '最初のバブルはもうならんでいるよ。新しいバブルを、ぴったりの場所へすべりこませよう！',
    pick: (c) => `バブル ${c.base} を持ち上げて！`,
    cmp: (c) => (c.gt ? `${c.a} は ${c.base} より大きいから、右へすべるよ。` : `${c.a} は ${c.base} より大きくない。場所が見つかった！`),
    shift: (c) => `スーッ！${c.base} が ${c.a} をこえて左へ。`,
    place: (c) => `${c.base} が自分の場所にすわったよ。`,
    end: () => 'みんな小さい順にならんだよ。すごい！',
  },
  ru: {
    init: () => 'Первый пузырь уже на месте. Вставим каждый новый пузырь на своё место!',
    pick: (c) => `Берём пузырь ${c.base}!`,
    cmp: (c) => (c.gt ? `${c.a} больше, чем ${c.base}, — он отъезжает вправо.` : `${c.a} не больше, чем ${c.base}. Место найдено!`),
    shift: (c) => `Скольжение! ${c.base} проезжает влево мимо ${c.a}.`,
    place: (c) => `${c.base} занимает своё место.`,
    end: () => 'Все стоят по порядку, от маленького к большому. Отлично!',
  },
};

const QUESTION: Record<Locale, { reader: (c: Ctx) => string; kid: (c: Ctx) => string; shift: [string, string]; place: [string, string]; why: (c: Ctx) => string }> = {
  en: {
    reader: (c) => `Is nums[${c.j}] = ${c.a} greater than base = ${c.base}?`,
    kid: (c) => `Is ${c.a} bigger than ${c.base}?`,
    shift: ['Shift right', 'Slide!'],
    place: ['Insert here', 'Stop!'],
    why: (c) => (c.gt ? `${c.a} > ${c.base}, so ${c.a} shifts right.` : `${c.a} ≤ ${c.base}, so base goes at index ${c.j + 1}. Equal values are not passed, which keeps the sort stable.`),
  },
  zh: {
    reader: (c) => `nums[${c.j}] = ${c.a} 大于 base = ${c.base} 吗？`,
    kid: (c) => `${c.a} 比 ${c.base} 大吗？`,
    shift: ['右移', '滑！'],
    place: ['插入这里', '停！'],
    why: (c) => (c.gt ? `${c.a} > ${c.base}，所以 ${c.a} 右移。` : `${c.a} ≤ ${c.base}，所以 base 放在索引 ${c.j + 1}。相等的元素不会被越过，保证了稳定性。`),
  },
  'zh-hant': {
    reader: (c) => `nums[${c.j}] = ${c.a} 大於 base = ${c.base} 嗎？`,
    kid: (c) => `${c.a} 比 ${c.base} 大嗎？`,
    shift: ['右移', '滑！'],
    place: ['插入這裡', '停！'],
    why: (c) => (c.gt ? `${c.a} > ${c.base}，所以 ${c.a} 右移。` : `${c.a} ≤ ${c.base}，所以 base 放在索引 ${c.j + 1}。相等的元素不會被越過，保證了穩定性。`),
  },
  ja: {
    reader: (c) => `nums[${c.j}] = ${c.a} は base = ${c.base} より大きい？`,
    kid: (c) => `${c.a} は ${c.base} より大きい？`,
    shift: ['右へずらす', 'すべる！'],
    place: ['ここに挿入', 'ストップ！'],
    why: (c) => (c.gt ? `${c.a} > ${c.base} なので ${c.a} を右へ。` : `${c.a} ≤ ${c.base} なので base はインデックス ${c.j + 1} へ。等しい値は追い越さないので安定です。`),
  },
  ru: {
    reader: (c) => `nums[${c.j}] = ${c.a} больше, чем base = ${c.base}?`,
    kid: (c) => `${c.a} больше, чем ${c.base}?`,
    shift: ['Сдвинуть', 'Едем!'],
    place: ['Вставить сюда', 'Стоп!'],
    why: (c) => (c.gt ? `${c.a} > ${c.base}, поэтому ${c.a} сдвигается вправо.` : `${c.a} ≤ ${c.base}, поэтому base встаёт на позицию ${c.j + 1}. Равные не обгоняются — сортировка устойчива.`),
  },
};

function ctx(f: InsertionFrame): Ctx {
  const { i, j, base, gt } = f.data;
  const n = f.items.length;
  const value = (idx: number | null) => (idx === null || idx < 0 || idx >= n ? 0 : f.items[idx].value);
  // After a shift, base sits at j and the element it passed is at j + 1.
  const passed = f.kind === 'shift' ? value(j === null ? null : j + 1) : value(j);
  return {
    i: i ?? 0,
    j: j ?? 0,
    b: base ?? 0,
    a: passed,
    base: value(base),
    gt: Boolean(gt),
    list: f.items.map((it) => it.value).join(', '),
    comparisons: f.stats.comparisons,
    moves: f.stats.moves,
  };
}

function narrate(f: InsertionFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: InsertionFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'cmp') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  return {
    prompt: kid ? q.kid(c) : q.reader(c),
    choices: [
      { id: 'shift', label: q.shift[kid ? 1 : 0], tone: 'swp' },
      { id: 'place', label: q.place[kid ? 1 : 0], tone: kid ? 'cmp' : 'idle' },
    ],
    answer: c.gt ? 'shift' : 'place',
    explain: kid ? narrate(f, 'kid', locale) : q.why(c),
  };
}

export const insertionSort: AlgorithmSpec<InsertionFrame> = {
  id: 'insertion_sort',
  title: { en: 'Insertion sort', zh: '插入排序', 'zh-hant': '插入排序', ja: '挿入ソート', ru: 'Сортировка вставками' },
  call: 'insertion_sort',
  defaultInput: [4, 1, 3, 1, 5, 2],
  initialStep: 4,
  trace: traceInsertionSort,
  tones: { init: 'idle', pick: 'swp', cmp: 'cmp', shift: 'swp', place: 'done', end: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [{ func: 'insertion_sort' }],
      anchors: {
        init: ['for i in range(1, len(nums))'],
        pick: ['base = nums[i]'],
        cmp: ['while j >= 0 and nums[j] > base'],
        shift: ['nums[j + 1] = nums[j]'],
        place: ['nums[j + 1] = base'],
        end: ['def insertion_sort('],
      },
    },
    java: {
      label: 'Java',
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [{ func: 'insertion_sort' }],
      anchors: {
        init: ['for (int i = 1; i < nums.length; i++)'],
        pick: ['int base = nums[i], j = i - 1'],
        cmp: ['while (j >= 0 && nums[j] > base)'],
        shift: ['nums[j + 1] = nums[j];'],
        place: ['nums[j + 1] = base;'],
        end: ['void insertionSort(int[] nums)'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Pick up the next bubble.', 'Slide it left past bigger ones.', 'Stop when the left one is not bigger.'],
      zh: ['拿起下一个泡泡。', '越过比它大的往左滑。', '左边不比它大时就停下。'],
      'zh-hant': ['拿起下一個泡泡。', '越過比它大的往左滑。', '左邊不比它大時就停下。'],
      ja: ['次のバブルを持ち上げる。', '大きいバブルをこえて左へすべる。', '左が大きくなければストップ。'],
      ru: ['Возьми следующий пузырь.', 'Двигай его влево мимо больших.', 'Стоп, когда левый не больше.'],
    },
    peek: `for i in range(1, n):
    base = nums[i]
    j = i - 1
    while j >= 0 and nums[j] > base:
        nums[j + 1] = nums[j]
        j -= 1
    nums[j + 1] = base`,
    rounds: (f) => {
      const total = Math.max(f.items.length - 1, 1);
      const current = f.kind === 'end' ? total : Math.max(f.data.i ?? 1, 1);
      return { current, total };
    },
  },
};
