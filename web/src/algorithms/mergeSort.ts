import javaEn from '@codes-en/java/chapter_sorting/merge_sort.java?raw';
import pythonEn from '@codes-en/python/chapter_sorting/merge_sort.py?raw';
import javaJa from '@codes-ja/java/chapter_sorting/merge_sort.java?raw';
import pythonJa from '@codes-ja/python/chapter_sorting/merge_sort.py?raw';
import javaRu from '@codes-ru/java/chapter_sorting/merge_sort.java?raw';
import pythonRu from '@codes-ru/python/chapter_sorting/merge_sort.py?raw';
import javaZh from '@codes-zh/java/chapter_sorting/merge_sort.java?raw';
import pythonZh from '@codes-zh/python/chapter_sorting/merge_sort.py?raw';
import javaZhHant from '@codes-zh-hant/java/chapter_sorting/merge_sort.java?raw';
import pythonZhHant from '@codes-zh-hant/python/chapter_sorting/merge_sort.py?raw';
import type { Locale } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame, Mark, Question, Voice } from '../engine/types';
import { codeSources } from './codes';

export type MergeKind = 'init' | 'split' | 'cmp' | 'take' | 'merged' | 'end';

export interface MergeData {
  lo: number | null;
  mid: number | null;
  hi: number | null;
  /** Index of the next left-half element, or null when the left half is used up. */
  i: number | null;
  /** Index of the next right-half element, or null when the right half is used up. */
  j: number | null;
  /** Index the next element is written to. */
  k: number | null;
  /** For `cmp`: left <= right, so the left element is taken (ties go left: stable). */
  le?: boolean;
  /** Merges finished so far and in total (n - 1). */
  merges: number;
  totalMerges: number;
}

export type MergeFrame = ArrayFrame<MergeData> & { kind: MergeKind };

/**
 * Records merge sort. During a merge the range is drawn as
 * [already merged | rest of left half | rest of right half],
 * so each taken element moves to the end of the merged part, as it does when tmp is copied back.
 */
export function traceMergeSort(input: number[]): MergeFrame[] {
  let items = input.map((value, id) => ({ id, value }));
  const n = items.length;
  const frames: MergeFrame[] = [];
  const totalMerges = Math.max(n - 1, 0);
  let comparisons = 0;
  let moves = 0;
  let merges = 0;

  const snap = (
    kind: MergeKind,
    o: { lo?: number | null; mid?: number | null; hi?: number | null; i?: number | null; j?: number | null; k?: number | null; placedTo?: number; cmp?: number[]; swp?: number[]; le?: boolean; all?: boolean },
  ) => {
    const { lo = null, mid = null, hi = null, i = null, j = null, k = null, placedTo = -1, cmp = [], swp = [], le, all = false } = o;
    const marks: Mark[] = items.map((_, idx) => {
      if (all) return 'done';
      if (swp.includes(idx)) return 'swp';
      if (cmp.includes(idx)) return 'cmp';
      if (lo !== null && idx >= lo && idx <= placedTo) return 'done';
      return 'idle';
    });
    const pointers: ArrayFrame['pointers'] = [];
    if (i !== null) pointers.push({ label: 'i', index: i });
    if (j !== null) pointers.push({ label: 'j', index: j });
    frames.push({
      kind,
      items: items.map((it) => ({ ...it })),
      marks,
      pointers,
      vars: [
        ['left', lo],
        ['mid', mid],
        ['right', hi],
      ],
      stats: { comparisons, moves },
      range: lo !== null && hi !== null ? [lo, hi] : undefined,
      data: { lo, mid, hi, i, j, k, le, merges, totalMerges },
    });
  };

  const merge = (lo: number, mid: number, hi: number) => {
    const left = items.slice(lo, mid + 1);
    const right = items.slice(mid + 1, hi + 1);
    const placed: typeof items = [];
    // Writes the current [placed | left | right] layout back into items.
    const layout = () => {
      items = [...items.slice(0, lo), ...placed, ...left, ...right, ...items.slice(hi + 1)];
    };
    const pos = () => {
      const k = lo + placed.length;
      return { k, i: left.length ? k : null, j: right.length ? k + left.length : null };
    };
    snap('split', { lo, mid, hi, ...pos(), placedTo: lo - 1 });
    while (left.length && right.length) {
      comparisons++;
      const le = left[0].value <= right[0].value;
      const p = pos();
      snap('cmp', { lo, mid, hi, ...p, placedTo: p.k - 1, cmp: [p.i!, p.j!], le });
      placed.push((le ? left : right).shift()!);
      moves++;
      layout();
      const after = pos();
      snap('take', { lo, mid, hi, ...after, k: after.k - 1, placedTo: after.k - 1, swp: [after.k - 1] });
    }
    while (left.length || right.length) {
      placed.push((left.length ? left : right).shift()!);
      moves++;
      layout();
      const after = pos();
      snap('take', { lo, mid, hi, ...after, k: after.k - 1, placedTo: after.k - 1, swp: [after.k - 1] });
    }
    merges++;
    snap('merged', { lo, mid, hi, placedTo: hi });
  };

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  snap('init', {});
  sort(0, n - 1);
  snap('end', { all: true });
  return frames;
}

interface Ctx {
  lo: number;
  mid: number;
  hi: number;
  k: number;
  a: number;
  b: number;
  v: number;
  le: boolean;
  tie: boolean;
  list: string;
  comparisons: number;
  moves: number;
}

type Lines = Record<MergeKind, (c: Ctx) => string>;

const READER: Record<Locale, Lines> = {
  en: {
    init: () => 'Merge sort: split the array in halves down to single elements, then merge the halves back in order.',
    split: (c) => `Merge [${c.lo}, ${c.mid}] and [${c.mid + 1}, ${c.hi}]; each half is already sorted.`,
    cmp: (c) => `Compare left ${c.a} with right ${c.b}: ${c.le ? `${c.a} ≤ ${c.b}, take from the left.` : `${c.b} < ${c.a}, take from the right.`}`,
    take: (c) => `Write ${c.v} at index ${c.k}.`,
    merged: (c) => `[${c.lo}, ${c.hi}] is now sorted.`,
    end: (c) => `Done. nums = [${c.list}] with ${c.comparisons} comparisons and ${c.moves} writes.`,
  },
  zh: {
    init: () => '归并排序：不断把数组对半划分直到只剩单个元素，再把两半按顺序合并回来。',
    split: (c) => `合并 [${c.lo}, ${c.mid}] 与 [${c.mid + 1}, ${c.hi}]，两半都已有序。`,
    cmp: (c) => `比较左边的 ${c.a} 与右边的 ${c.b}：${c.le ? `${c.a} ≤ ${c.b}，取左边的。` : `${c.b} < ${c.a}，取右边的。`}`,
    take: (c) => `把 ${c.v} 写入索引 ${c.k}。`,
    merged: (c) => `[${c.lo}, ${c.hi}] 已有序。`,
    end: (c) => `完成。nums = [${c.list}]，共比较 ${c.comparisons} 次，写入 ${c.moves} 次。`,
  },
  'zh-hant': {
    init: () => '合併排序：不斷把陣列對半劃分直到只剩單個元素，再把兩半按順序合併回來。',
    split: (c) => `合併 [${c.lo}, ${c.mid}] 與 [${c.mid + 1}, ${c.hi}]，兩半都已有序。`,
    cmp: (c) => `比較左邊的 ${c.a} 與右邊的 ${c.b}：${c.le ? `${c.a} ≤ ${c.b}，取左邊的。` : `${c.b} < ${c.a}，取右邊的。`}`,
    take: (c) => `把 ${c.v} 寫入索引 ${c.k}。`,
    merged: (c) => `[${c.lo}, ${c.hi}] 已有序。`,
    end: (c) => `完成。nums = [${c.list}]，共比較 ${c.comparisons} 次，寫入 ${c.moves} 次。`,
  },
  ja: {
    init: () => 'マージソート：要素が 1 つになるまで半分に分け、半分どうしを順に併合します。',
    split: (c) => `[${c.lo}, ${c.mid}] と [${c.mid + 1}, ${c.hi}] を併合。どちらも整列済み。`,
    cmp: (c) => `左の ${c.a} と右の ${c.b} を比較：${c.le ? `${c.a} ≤ ${c.b} なので左から取る。` : `${c.b} < ${c.a} なので右から取る。`}`,
    take: (c) => `${c.v} をインデックス ${c.k} に書き込む。`,
    merged: (c) => `[${c.lo}, ${c.hi}] が整列されました。`,
    end: (c) => `完了。nums = [${c.list}]、比較 ${c.comparisons} 回、書き込み ${c.moves} 回。`,
  },
  ru: {
    init: () => 'Сортировка слиянием: делим массив пополам до одиночных элементов, затем по порядку сливаем половины обратно.',
    split: (c) => `Сливаем [${c.lo}, ${c.mid}] и [${c.mid + 1}, ${c.hi}]; обе половины уже отсортированы.`,
    cmp: (c) => `Сравниваем левый ${c.a} и правый ${c.b}: ${c.le ? `${c.a} ≤ ${c.b}, берём слева.` : `${c.b} < ${c.a}, берём справа.`}`,
    take: (c) => `Записываем ${c.v} на позицию ${c.k}.`,
    merged: (c) => `[${c.lo}, ${c.hi}] теперь отсортирован.`,
    end: (c) => `Готово. nums = [${c.list}]; сравнений: ${c.comparisons}, записей: ${c.moves}.`,
  },
};

const KID: Record<Locale, Lines> = {
  en: {
    init: () => 'Split the bubbles into tiny teams, then join the teams back in order!',
    split: () => 'Two sorted teams meet. Let us join them!',
    cmp: (c) => `${c.a} or ${c.b}? The smaller one goes first.`,
    take: (c) => `${c.v} steps into line!`,
    merged: () => 'This team is in order now!',
    end: () => 'Everyone is in order, smallest to biggest. Great job!',
  },
  zh: {
    init: () => '把泡泡们分成小小的队伍，再按顺序把队伍合起来！',
    split: () => '两支排好的队伍碰面了，把它们合起来吧！',
    cmp: (c) => `${c.a} 还是 ${c.b}？小的先走。`,
    take: (c) => `${c.v} 站进队里！`,
    merged: () => '这支队伍排好啦！',
    end: () => '大家都从小到大排好了。太棒了！',
  },
  'zh-hant': {
    init: () => '把泡泡們分成小小的隊伍，再按順序把隊伍合起來！',
    split: () => '兩支排好的隊伍碰面了，把它們合起來吧！',
    cmp: (c) => `${c.a} 還是 ${c.b}？小的先走。`,
    take: (c) => `${c.v} 站進隊裡！`,
    merged: () => '這支隊伍排好啦！',
    end: () => '大家都從小到大排好了。太棒了！',
  },
  ja: {
    init: () => 'バブルを小さなチームに分けて、順番どおりにチームを合わせよう！',
    split: () => 'ならんだ 2 つのチームが出会ったよ。合わせよう！',
    cmp: (c) => `${c.a} と ${c.b}、どっち？小さい方が先だよ。`,
    take: (c) => `${c.v} が列に入ったよ！`,
    merged: () => 'このチームはならんだよ！',
    end: () => 'みんな小さい順にならんだよ。すごい！',
  },
  ru: {
    init: () => 'Разобьём пузыри на маленькие команды и по порядку соберём их обратно!',
    split: () => 'Встретились две упорядоченные команды. Объединим их!',
    cmp: (c) => `${c.a} или ${c.b}? Меньший идёт первым.`,
    take: (c) => `${c.v} встаёт в строй!`,
    merged: () => 'Эта команда упорядочена!',
    end: () => 'Все стоят по порядку, от маленького к большому. Отлично!',
  },
};

const QUESTION: Record<Locale, { reader: (c: Ctx) => string; kid: (c: Ctx) => string; left: [string, string]; right: [string, string]; tie: string }> = {
  en: {
    reader: (c) => `Which goes next: left ${c.a} or right ${c.b}?`,
    kid: (c) => `Which bubble goes first: ${c.a} or ${c.b}?`,
    left: ['Left', 'Left one!'],
    right: ['Right', 'Right one!'],
    tie: 'On a tie the left element goes first, which keeps merge sort stable.',
  },
  zh: {
    reader: (c) => `下一个取哪个：左边的 ${c.a} 还是右边的 ${c.b}？`,
    kid: (c) => `哪个泡泡先走：${c.a} 还是 ${c.b}？`,
    left: ['左边', '左边的！'],
    right: ['右边', '右边的！'],
    tie: '相等时先取左边的元素，这保证了归并排序的稳定性。',
  },
  'zh-hant': {
    reader: (c) => `下一個取哪個：左邊的 ${c.a} 還是右邊的 ${c.b}？`,
    kid: (c) => `哪個泡泡先走：${c.a} 還是 ${c.b}？`,
    left: ['左邊', '左邊的！'],
    right: ['右邊', '右邊的！'],
    tie: '相等時先取左邊的元素，這保證了合併排序的穩定性。',
  },
  ja: {
    reader: (c) => `次はどちら：左の ${c.a}、それとも右の ${c.b}？`,
    kid: (c) => `先に行くバブルはどっち：${c.a}、それとも ${c.b}？`,
    left: ['左', '左の方！'],
    right: ['右', '右の方！'],
    tie: '等しいときは左を先に取るので、マージソートは安定です。',
  },
  ru: {
    reader: (c) => `Что идёт следующим: левый ${c.a} или правый ${c.b}?`,
    kid: (c) => `Какой пузырь идёт первым: ${c.a} или ${c.b}?`,
    left: ['Левый', 'Левый!'],
    right: ['Правый', 'Правый!'],
    tie: 'При равенстве первым идёт левый элемент — так сортировка слиянием остаётся устойчивой.',
  },
};

function ctx(f: MergeFrame): Ctx {
  const { lo, mid, hi, i, j, k, le } = f.data;
  const n = f.items.length;
  const value = (idx: number | null) => (idx === null || idx < 0 || idx >= n ? 0 : f.items[idx].value);
  const a = value(i);
  const b = value(j);
  return {
    lo: lo ?? 0,
    mid: mid ?? 0,
    hi: hi ?? 0,
    k: k ?? 0,
    a,
    b,
    v: value(k),
    le: Boolean(le),
    tie: a === b,
    list: f.items.map((it) => it.value).join(', '),
    comparisons: f.stats.comparisons,
    moves: f.stats.moves,
  };
}

function narrate(f: MergeFrame, voice: Voice, locale: Locale): string {
  const table = (voice === 'kid' ? KID : READER)[locale] ?? (voice === 'kid' ? KID.en : READER.en);
  return table[f.kind](ctx(f));
}

function predict(f: MergeFrame, voice: Voice, locale: Locale): Question | null {
  if (f.kind !== 'cmp') return null;
  const q = QUESTION[locale] ?? QUESTION.en;
  const c = ctx(f);
  const kid = voice === 'kid';
  const why = narrate(f, voice, locale);
  return {
    prompt: kid ? q.kid(c) : q.reader(c),
    choices: [
      { id: 'left', label: q.left[kid ? 1 : 0], tone: 'cmp' },
      { id: 'right', label: q.right[kid ? 1 : 0], tone: 'swp' },
    ],
    answer: c.le ? 'left' : 'right',
    explain: c.tie && !kid ? `${why} ${q.tie}` : why,
  };
}

export const mergeSort: AlgorithmSpec<MergeFrame> = {
  id: 'merge_sort',
  title: { en: 'Merge sort', zh: '归并排序', 'zh-hant': '合併排序', ja: 'マージソート', ru: 'Сортировка слиянием' },
  call: 'merge_sort',
  defaultInput: [7, 3, 2, 6, 0, 1, 5, 4],
  initialStep: 8,
  trace: traceMergeSort,
  tones: { init: 'idle', split: 'idle', cmp: 'cmp', take: 'swp', merged: 'done', end: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: { en: pythonEn, zh: pythonZh, 'zh-hant': pythonZhHant, ja: pythonJa, ru: pythonRu },
      parts: [{ func: 'merge' }, { func: 'merge_sort' }],
      anchors: {
        init: ['def merge_sort('],
        split: ['i, j, k = left, mid + 1, 0'],
        cmp: ['if nums[i] <= nums[j]'],
        take: ['k += 1'],
        merged: ['nums[left + k] = tmp[k]'],
        end: ['merge(nums, left, mid, right)'],
      },
    },
    java: {
      label: 'Java',
      raw: { en: javaEn, zh: javaZh, 'zh-hant': javaZhHant, ja: javaJa, ru: javaRu },
      parts: [{ func: 'merge' }, { func: 'merge_sort' }],
      anchors: {
        init: ['void mergeSort(int[] nums, int left, int right)'],
        split: ['int i = left, j = mid + 1, k = 0'],
        cmp: ['if (nums[i] <= nums[j])'],
        take: ['tmp[k++] = nums[i++]'],
        merged: ['nums[left + k] = tmp[k]'],
        end: ['merge(nums, left, mid, right)'],
      },
    },
  }),
  narrate,
  predict,
  school: {
    rules: {
      en: ['Split into tiny teams.', 'Join two teams: smaller one first.', 'Keep joining until one team is left.'],
      zh: ['分成小小的队伍。', '合并两队：小的先走。', '一直合并到只剩一队。'],
      'zh-hant': ['分成小小的隊伍。', '合併兩隊：小的先走。', '一直合併到只剩一隊。'],
      ja: ['小さなチームに分ける。', '2 チームを合わせる：小さい方が先。', '1 チームになるまで合わせ続ける。'],
      ru: ['Раздели на маленькие команды.', 'Объединяй по две: меньший первым.', 'Пока не останется одна команда.'],
    },
    peek: `def merge_sort(nums, left, right):
    if left >= right:
        return
    mid = (left + right) // 2
    merge_sort(nums, left, mid)
    merge_sort(nums, mid + 1, right)
    merge(nums, left, mid, right)`,
    rounds: (f) => ({ current: Math.max(f.kind === 'end' ? f.data.totalMerges : f.data.merges + 1, 1), total: Math.max(f.data.totalMerges, 1) }),
  },
};
