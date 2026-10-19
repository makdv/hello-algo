import arrayJavaEn from '@codes-en/java/chapter_array_and_linkedlist/array.java?raw';
import listJavaEn from '@codes-en/java/chapter_array_and_linkedlist/linked_list.java?raw';
import arrayPyEn from '@codes-en/python/chapter_array_and_linkedlist/array.py?raw';
import listPyEn from '@codes-en/python/chapter_array_and_linkedlist/linked_list.py?raw';
import arrayJavaJa from '@codes-ja/java/chapter_array_and_linkedlist/array.java?raw';
import listJavaJa from '@codes-ja/java/chapter_array_and_linkedlist/linked_list.java?raw';
import arrayPyJa from '@codes-ja/python/chapter_array_and_linkedlist/array.py?raw';
import listPyJa from '@codes-ja/python/chapter_array_and_linkedlist/linked_list.py?raw';
import arrayJavaRu from '@codes-ru/java/chapter_array_and_linkedlist/array.java?raw';
import listJavaRu from '@codes-ru/java/chapter_array_and_linkedlist/linked_list.java?raw';
import arrayPyRu from '@codes-ru/python/chapter_array_and_linkedlist/array.py?raw';
import listPyRu from '@codes-ru/python/chapter_array_and_linkedlist/linked_list.py?raw';
import arrayJavaZh from '@codes-zh/java/chapter_array_and_linkedlist/array.java?raw';
import listJavaZh from '@codes-zh/java/chapter_array_and_linkedlist/linked_list.java?raw';
import arrayPyZh from '@codes-zh/python/chapter_array_and_linkedlist/array.py?raw';
import listPyZh from '@codes-zh/python/chapter_array_and_linkedlist/linked_list.py?raw';
import arrayJavaZhHant from '@codes-zh-hant/java/chapter_array_and_linkedlist/array.java?raw';
import listJavaZhHant from '@codes-zh-hant/java/chapter_array_and_linkedlist/linked_list.java?raw';
import arrayPyZhHant from '@codes-zh-hant/python/chapter_array_and_linkedlist/array.py?raw';
import listPyZhHant from '@codes-zh-hant/python/chapter_array_and_linkedlist/linked_list.py?raw';
import { codeSources } from '../../algorithms/codes';
import type { Locale } from '../../i18n/locale';
import {
  arrow,
  box,
  cells,
  cellX,
  center,
  chip,
  indices,
  link,
  linkedList,
  listNode,
  region,
  rowWidth,
  seg,
  tag,
  text,
  type Cell,
} from '../kit';
import type { BoxNode, Figure, SceneFrame, SceneNode, StaticFigure, StepFigure, Tone } from '../scene';

type T = Record<Locale, string>;

const ARRAY_PY = { en: arrayPyEn, zh: arrayPyZh, 'zh-hant': arrayPyZhHant, ja: arrayPyJa, ru: arrayPyRu };
const ARRAY_JAVA = { en: arrayJavaEn, zh: arrayJavaZh, 'zh-hant': arrayJavaZhHant, ja: arrayJavaJa, ru: arrayJavaRu };
const LIST_PY = { en: listPyEn, zh: listPyZh, 'zh-hant': listPyZhHant, ja: listPyJa, ru: listPyRu };
const LIST_JAVA = { en: listJavaEn, zh: listJavaZh, 'zh-hant': listJavaZhHant, ja: listJavaJa, ru: listJavaRu };

const LABEL: Record<'array' | 'index' | 'address' | 'memory' | 'free' | 'used' | 'value' | 'pointer', T> = {
  array: { en: 'array', zh: '数组', 'zh-hant': '陣列', ja: '配列', ru: 'массив' },
  index: { en: 'index', zh: '索引', 'zh-hant': '索引', ja: 'インデックス', ru: 'индекс' },
  address: { en: 'address', zh: '内存地址', 'zh-hant': '記憶體位址', ja: 'アドレス', ru: 'адрес' },
  memory: { en: 'memory', zh: '内存', 'zh-hant': '記憶體', ja: 'メモリ', ru: 'память' },
  free: { en: 'Free memory', zh: '可用内存', 'zh-hant': '可用記憶體', ja: '空きメモリ', ru: 'Свободная память' },
  used: { en: 'Memory used by the array', zh: '数组占用的内存', 'zh-hant': '陣列佔用的記憶體', ja: '配列が使うメモリ', ru: 'Память массива' },
  value: { en: 'Node value', zh: '节点值', 'zh-hant': '節點值', ja: 'ノードの値', ru: 'Значение узла' },
  pointer: { en: 'Reference to the next node', zh: '指向下一节点的引用', 'zh-hant': '指向下一節點的引用', ja: '次のノードへの参照', ru: 'Ссылка на следующий узел' },
};

const W = 440;
const VALUES = [1, 3, 2, 5, 4];

/** Row labels to the left of an array: "index", "address". */
function rowLabel(id: string, y: number, label: string, tone: Tone = 'muted') {
  return text(id, 156, y, label, { anchor: 'end', size: 13, bold: true, tone });
}

/** Curved arrow over a row of cells from cell `from` to cell `to`, for copies and moves. */
function hop(id: string, x0: number, y: number, from: number, to: number, tone: Tone = 'warn') {
  const fx = cellX(x0, from) + 20;
  const tx = cellX(x0, to) + 20;
  return arrow(id, [fx + (to > from ? 6 : -6), y - 3], [tx - (to > from ? 6 : -6), y - 3], { bend: to > from ? -12 : 12, tone, width: 1.75 });
}

// ── Arrays ────────────────────────────────────────────────────────────

const arrayDefinition: StaticFigure = {
  type: 'static',
  build(l) {
    const x0 = 170;
    const nodes: SceneNode[] = [
      region('arr', x0 - 6, 14, rowWidth(5) + 12, 52, { tone: 'accent' }),
      rowLabel('l:arr', 45, LABEL.array[l], 'accent'),
      ...cells('a', x0, 20, VALUES.map((v) => ({ value: v, tone: 'accent' }))),
      rowLabel('l:idx', 88, LABEL.index[l]),
      ...indices('i', x0, 88, [0, 1, 2, 3, 4]),
      rowLabel('l:addr', 110, LABEL.address[l]),
      ...indices('m', x0, 110, ['00', '04', '08', '12', '16'], { tone: () => 'info' }),
      text('l:mem', 42, 146, LABEL.memory[l], { size: 12, bold: true, tone: 'muted' }),
    ];
    // A strip of memory: the array's five elements sit side by side, nothing in between.
    const cols = 12;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < cols; c++) {
        const k = c - 3;
        const used = r === 1 && k >= 0 && k < 5;
        nodes.push(
          box(`g${r}-${c}`, 42 + c * 30, 156 + r * 30, used ? VALUES[k] : '', {
            w: 26,
            h: 26,
            size: 12,
            tone: used ? 'accent' : 'muted',
          }),
        );
      }
    }
    return {
      scene: { w: W, h: 252, nodes },
      legend: [
        { tone: 'muted', text: LABEL.free[l] },
        { tone: 'accent', text: LABEL.used[l] },
      ],
    };
  },
};

const ADDRESS_FORMULA: Record<Locale, [string, string, string, string]> = {
  en: ['element address', 'array start', 'element size', 'index'],
  zh: ['元素内存地址', '数组内存地址', '元素长度', '元素索引'],
  'zh-hant': ['元素記憶體位址', '陣列記憶體位址', '元素長度', '元素索引'],
  ja: ['要素のアドレス', '配列の先頭アドレス', '要素のサイズ', 'インデックス'],
  ru: ['адрес элемента', 'адрес начала', 'размер элемента', 'индекс'],
};

const ADDRESS_SAY: Record<Locale, (i: number, addr: string) => string> = {
  en: (i, a) =>
    `nums[${i}] is at 0 + 4 × ${i} = ${a}. The address is computed in one step, without looking at the elements before it, so access takes O(1).`,
  zh: (i, a) => `nums[${i}] 的地址是 0 + 4 × ${i} = ${a}。地址一步算出，不需要经过前面的元素，所以访问是 O(1)。`,
  'zh-hant': (i, a) => `nums[${i}] 的位址是 0 + 4 × ${i} = ${a}。位址一步算出，不需要經過前面的元素，所以訪問是 O(1)。`,
  ja: (i, a) => `nums[${i}] のアドレスは 0 + 4 × ${i} = ${a}。前の要素をたどらず一度の計算で求まるので、アクセスは O(1) です。`,
  ru: (i, a) => `nums[${i}] лежит по адресу 0 + 4 × ${i} = ${a}. Адрес вычисляется сразу, без обхода предыдущих элементов, поэтому доступ — O(1).`,
};

const arrayAddress: StepFigure = {
  type: 'steps',
  initialStep: 3,
  tones: { index: 'cmp' },
  build(l) {
    const x0 = 170;
    const [fa, fs, fz, fi] = ADDRESS_FORMULA[l];
    const frames: SceneFrame[] = VALUES.map((_, i) => {
      const addr = String(4 * i).padStart(2, '0');
      const nodes: SceneNode[] = [
        rowLabel('l:arr', 45, 'nums', 'accent'),
        ...cells('a', x0, 20, VALUES.map((v, k) => ({ value: v, tone: k === i ? 'accent' : 'idle', ring: k === i }))),
        rowLabel('l:idx', 88, LABEL.index[l], 'warn'),
        ...indices('i', x0, 88, [0, 1, 2, 3, 4], { tone: (k) => (k === i ? 'warn' : 'muted') }),
        rowLabel('l:addr', 110, LABEL.address[l], 'info'),
        ...indices('m', x0, 110, ['00', '04', '08', '12', '16'], { tone: (k) => (k === i ? 'info' : 'muted') }),
        region('col', cellX(x0, i) - 4, 14, 48, 104, { tone: 'accent' }),
        text('f', W / 2, 150, seg([fa, 'info', true], ' = ', [fs, 'info'], ' + ', [fz, 'ok'], ' × ', [fi, 'warn']), {
          anchor: 'middle',
          size: 12,
        }),
        chip('calc', W / 2, 162, seg([addr, 'info', true], ' = ', ['00', 'info'], ' + ', ['4', 'ok'], ' × ', [String(i), 'warn', true]), { size: 14 }),
      ];
      return { kind: 'index', scene: { w: W, h: 204, nodes }, say: ADDRESS_SAY[l](i, addr), call: `nums[${i}]` };
    });
    return { frames };
  },
};

const INSERT_SAY: Record<'init' | 'shift' | 'place' | 'done', Record<Locale, (a: number, b: number) => string>> = {
  init: {
    en: () => 'Insert 3 at index 1. An array has a fixed length, so everything from index 1 on moves one place right, and the last element (0) falls off.',
    zh: () => '在索引 1 处插入 3。数组长度不可变，所以索引 1 及之后的元素都要向右移动一位，最后一个元素（0）会丢失。',
    'zh-hant': () => '在索引 1 處插入 3。陣列長度不可變，所以索引 1 及之後的元素都要向右移動一位，最後一個元素（0）會遺失。',
    ja: () => 'インデックス 1 に 3 を挿入します。配列の長さは固定なので、インデックス 1 以降の要素を 1 つずつ右へ移し、最後の要素（0）は失われます。',
    ru: () => 'Вставим 3 по индексу 1. Длина массива фиксирована, поэтому всё начиная с индекса 1 сдвигается на одну позицию вправо, а последний элемент (0) теряется.',
  },
  shift: {
    en: (i, v) => `nums[${i}] = nums[${i - 1}]: copy ${v} one place right. Moving starts from the end, so nothing is overwritten before it is copied.`,
    zh: (i, v) => `nums[${i}] = nums[${i - 1}]：把 ${v} 向右复制一位。从末尾开始移动，元素在被覆盖之前都已复制。`,
    'zh-hant': (i, v) => `nums[${i}] = nums[${i - 1}]：把 ${v} 向右複製一位。從末尾開始移動，元素在被覆蓋之前都已複製。`,
    ja: (i, v) => `nums[${i}] = nums[${i - 1}]：${v} を 1 つ右へコピー。末尾から移すので、上書きされる前に必ずコピーされます。`,
    ru: (i, v) => `nums[${i}] = nums[${i - 1}]: копируем ${v} на одну позицию вправо. Сдвиг идёт с конца, поэтому ничего не затирается до копирования.`,
  },
  place: {
    en: () => 'nums[1] = 3: index 1 is free to overwrite, so 3 goes there.',
    zh: () => 'nums[1] = 3：索引 1 处可以被覆盖了，把 3 放进去。',
    'zh-hant': () => 'nums[1] = 3：索引 1 處可以被覆蓋了，把 3 放進去。',
    ja: () => 'nums[1] = 3：インデックス 1 は上書きしてよいので、そこに 3 を入れます。',
    ru: () => 'nums[1] = 3: ячейку 1 уже можно перезаписать, кладём туда 3.',
  },
  done: {
    en: () => 'Done: [1, 3, 2, 5, 4]. Inserting moved up to n elements, so it takes O(n).',
    zh: () => '完成：[1, 3, 2, 5, 4]。插入最多要移动 n 个元素，时间复杂度为 O(n)。',
    'zh-hant': () => '完成：[1, 3, 2, 5, 4]。插入最多要移動 n 個元素，時間複雜度為 O(n)。',
    ja: () => '完了：[1, 3, 2, 5, 4]。挿入では最大 n 個の要素を移すので O(n) かかります。',
    ru: () => 'Готово: [1, 3, 2, 5, 4]. Вставка сдвигает до n элементов, поэтому занимает O(n).',
  },
};

const arrayInsert: StepFigure = {
  type: 'steps',
  call: 'insert(nums, 3, 1)',
  tones: { init: 'idle', shift: 'swp', place: 'cmp', done: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: ARRAY_PY,
      parts: [{ func: 'insert' }],
      anchors: { init: ['def insert('], shift: ['nums[i] = nums[i - 1]'], place: ['nums[index] = num'], done: ['nums[index] = num'] },
    },
    java: {
      label: 'Java',
      raw: ARRAY_JAVA,
      parts: [{ func: 'insert' }],
      anchors: { init: ['void insert('], shift: ['nums[i] = nums[i - 1];'], place: ['nums[index] = num;'], done: ['nums[index] = num;'] },
    },
  }),
  build(l) {
    const x0 = (W - rowWidth(5)) / 2;
    const say = (k: keyof typeof INSERT_SAY, a = 0, b = 0) => INSERT_SAY[k][l](a, b);
    const scene = (arr: Cell[], extra: SceneNode[], numAt: 'above' | 'cell' | null) => ({
      w: W,
      h: 200,
      nodes: [
        ...cells('a', x0, 88, arr),
        ...indices('i', x0, 148, [0, 1, 2, 3, 4]),
        ...(numAt ? [box('num', cellX(x0, 1), numAt === 'above' ? 16 : 88, 3, { tone: numAt === 'above' ? 'info' : 'accent' })] : []),
        ...extra,
      ],
    });
    const arr = [1, 2, 5, 4, 0];
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene(
          arr.map((v, k) => (k === 4 ? { value: v, tone: 'ghost', dashed: true } : { value: v })),
          [arrow('drop', [cellX(x0, 1) + 20, 60], [cellX(x0, 1) + 20, 82], { tone: 'info', dashed: true })],
          'above',
        ),
        say: say('init'),
      },
    ];
    for (let i = 4; i > 1; i--) {
      const v = arr[i - 1];
      arr[i] = v;
      frames.push({
        kind: 'shift',
        scene: scene(
          arr.map((x, k) => ({ value: x, tone: k === i ? 'warn' : k === i - 1 ? 'accent' : 'idle' })),
          [hop('mv', x0, 88, i - 1, i), chip('code', W / 2, 166, seg('nums[', [String(i), 'warn'], '] = nums[', [String(i - 1), 'accent'], ']'))],
          'above',
        ),
        say: say('shift', i, v),
      });
    }
    arr[1] = 3;
    frames.push({
      kind: 'place',
      scene: scene(
        arr.map((x, k) => ({ value: x, tone: k === 1 ? 'accent' : 'idle' })),
        [chip('code', W / 2, 166, seg('nums[', ['1', 'accent'], '] = ', ['3', 'info']))],
        'cell',
      ),
      say: say('place'),
    });
    frames.push({
      kind: 'done',
      scene: scene(arr.map((x, k) => ({ value: x, tone: k === 1 ? 'ok' : 'idle' })), [], null),
      say: say('done'),
    });
    return { frames };
  },
};

const REMOVE_SAY: Record<'init' | 'shift' | 'done', Record<Locale, (i: number, v: number) => string>> = {
  init: {
    en: () => 'Remove the element at index 1 (3). Every element after it moves one place left to close the gap.',
    zh: () => '删除索引 1 处的元素（3）。它之后的元素都要向左移动一位，填补空位。',
    'zh-hant': () => '刪除索引 1 處的元素（3）。它之後的元素都要向左移動一位，填補空位。',
    ja: () => 'インデックス 1 の要素（3）を削除します。後ろの要素をすべて 1 つ左へ移して隙間を埋めます。',
    ru: () => 'Удалим элемент по индексу 1 (3). Все элементы после него сдвигаются на одну позицию влево, закрывая дыру.',
  },
  shift: {
    en: (i, v) => `nums[${i}] = nums[${i + 1}]: copy ${v} one place left.`,
    zh: (i, v) => `nums[${i}] = nums[${i + 1}]：把 ${v} 向左复制一位。`,
    'zh-hant': (i, v) => `nums[${i}] = nums[${i + 1}]：把 ${v} 向左複製一位。`,
    ja: (i, v) => `nums[${i}] = nums[${i + 1}]：${v} を 1 つ左へコピー。`,
    ru: (i, v) => `nums[${i}] = nums[${i + 1}]: копируем ${v} на одну позицию влево.`,
  },
  done: {
    en: () => 'Done: [1, 2, 5, 4]. The last cell still holds a stale 4 that the program simply ignores. Removing also takes O(n).',
    zh: () => '完成：[1, 2, 5, 4]。最后一格仍留着一个无意义的 4，程序会忽略它。删除同样是 O(n)。',
    'zh-hant': () => '完成：[1, 2, 5, 4]。最後一格仍留著一個無意義的 4，程式會忽略它。刪除同樣是 O(n)。',
    ja: () => '完了：[1, 2, 5, 4]。最後のマスには意味のない 4 が残りますが、プログラムは無視します。削除も O(n) です。',
    ru: () => 'Готово: [1, 2, 5, 4]. В последней ячейке осталась ненужная 4 — программа её просто игнорирует. Удаление тоже O(n).',
  },
};

const arrayRemove: StepFigure = {
  type: 'steps',
  call: 'remove(nums, 1)',
  tones: { init: 'swp', shift: 'swp', done: 'done' },
  sources: codeSources({
    python: {
      label: 'Python',
      raw: ARRAY_PY,
      parts: [{ func: 'remove' }],
      anchors: { init: ['def remove('], shift: ['nums[i] = nums[i + 1]'], done: ['def remove('] },
    },
    java: {
      label: 'Java',
      raw: ARRAY_JAVA,
      parts: [{ func: 'remove' }],
      anchors: { init: ['void remove('], shift: ['nums[i] = nums[i + 1];'], done: ['void remove('] },
    },
  }),
  build(l) {
    const x0 = (W - rowWidth(5)) / 2;
    const scene = (arr: Cell[], extra: SceneNode[] = []) => ({
      w: W,
      h: 172,
      nodes: [...cells('a', x0, 52, arr), ...indices('i', x0, 112, [0, 1, 2, 3, 4]), ...extra],
    });
    const arr = [...VALUES];
    const frames: SceneFrame[] = [
      {
        kind: 'init',
        scene: scene(arr.map((v, k) => ({ value: v, tone: k === 1 ? 'danger' : 'idle', ring: k === 1 }))),
        say: REMOVE_SAY.init[l](1, 3),
      },
    ];
    for (let i = 1; i < 4; i++) {
      arr[i] = arr[i + 1];
      frames.push({
        kind: 'shift',
        scene: scene(
          arr.map((v, k) => ({ value: v, tone: k === i ? 'warn' : k === i + 1 ? 'accent' : 'idle' })),
          [hop('mv', x0, 52, i + 1, i), chip('code', W / 2, 132, seg('nums[', [String(i), 'warn'], '] = nums[', [String(i + 1), 'accent'], ']'))],
        ),
        say: REMOVE_SAY.shift[l](i, arr[i]),
      });
    }
    frames.push({
      kind: 'done',
      scene: scene(arr.map((v, k) => (k === 4 ? { value: v, tone: 'ghost', dashed: true } : { value: v, tone: 'idle' }))),
      say: REMOVE_SAY.done[l](0, 0),
    });
    return { frames };
  },
};

// ── Linked lists ──────────────────────────────────────────────────────

const linkedlistDefinition: StaticFigure = {
  type: 'static',
  build(l) {
    const list = linkedList(
      'l',
      40,
      22,
      VALUES.map((v) => ({ id: `n${v}`, value: v })),
      { step: 66, r: 18, tail: 'None' },
    );
    const head = list.circles[0];
    const nodes: SceneNode[] = [...list.nodes, ...tag('head', head, 'head', { side: 'below', gap: 18 })];
    // Nodes live wherever memory was free; each holds a value and a reference to the next one.
    const gx = 62;
    const gy = 128;
    const size = 28;
    const step = 32;
    const spots: [number, number][] = [
      [1, 1],
      [2, 4],
      [3, 1],
      [3, 6],
      [0, 7],
    ];
    const cols = 10;
    const used = new Set(spots.flatMap(([r, c]) => [`${r}-${c}`, `${r}-${c + 1}`]));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < cols; c++) {
        if (used.has(`${r}-${c}`)) continue;
        nodes.push(box(`g${r}-${c}`, gx + c * step, gy + r * step, '', { w: size, h: size, tone: 'muted' }));
      }
    }
    const valueBox = (k: number) => box(`v${k}`, gx + spots[k][1] * step, gy + spots[k][0] * step, VALUES[k], { w: size, h: size, size: 13, tone: 'ok' });
    const ptrBox = (k: number) =>
      box(`p${k}`, gx + (spots[k][1] + 1) * step, gy + spots[k][0] * step, k === 4 ? '∅' : '', { w: size, h: size, size: 12, tone: 'info' });
    spots.forEach((_, k) => nodes.push(valueBox(k), ptrBox(k)));
    for (let k = 0; k < 4; k++) {
      const from = center(ptrBox(k));
      const to = valueBox(k + 1);
      nodes.push(link(`e${k}`, { ...ptrBox(k), x: from.x - 1, y: from.y - 1, w: 2, h: 2 }, to, { tone: 'info', width: 1.5 }));
    }
    nodes.push(text('l:mem', gx, gy - 12, LABEL.memory[l], { size: 12, bold: true, tone: 'muted' }));
    return {
      scene: { w: W, h: 262, nodes },
      legend: [
        { tone: 'muted', text: LABEL.free[l] },
        { tone: 'ok', text: LABEL.value[l] },
        { tone: 'info', text: LABEL.pointer[l] },
      ],
    };
  },
};

const LIST_KINDS: Record<'singly' | 'circular' | 'doubly', T> = {
  singly: { en: 'Singly linked list', zh: '单向链表', 'zh-hant': '單向鏈結串列', ja: '単方向連結リスト', ru: 'Односвязный список' },
  circular: { en: 'Circular linked list', zh: '环形链表', 'zh-hant': '環形鏈結串列', ja: '循環連結リスト', ru: 'Кольцевой список' },
  doubly: { en: 'Doubly linked list', zh: '双向链表', 'zh-hant': '雙向鏈結串列', ja: '双方向連結リスト', ru: 'Двусвязный список' },
};

const linkedlistTypes: StaticFigure = {
  type: 'static',
  build(l) {
    const items = (p: string) => VALUES.map((v) => ({ id: `${p}${v}`, value: v }));
    const x = 84;
    const r = 16;
    const step = 58;
    const singly = linkedList('s', x, 34, items('s'), { step, r, tail: 'None' });
    const circular = linkedList('c', x, 128, items('c'), { step, r });
    const doubly = linkedList('d', x, 222, items('d'), { step, r, doubly: true, tail: 'None' });
    const first = center(circular.circles[0]);
    const last = center(circular.circles[4]);
    const dFirst = center(doubly.circles[0]);
    return {
      scene: {
        w: W,
        h: 268,
        nodes: [
          text('t:s', x, 20, LIST_KINDS.singly[l], { size: 13, bold: true, tone: 'ok' }),
          ...singly.nodes,
          text('t:c', x, 114, LIST_KINDS.circular[l], { size: 13, bold: true, tone: 'ok' }),
          ...circular.nodes,
          arrow('c:back', [last.x, last.y + r + 1], [first.x, first.y + r + 1], {
            via: [
              [last.x, last.y + r + 16],
              [first.x, first.y + r + 16],
            ],
            tone: 'accent',
          }),
          text('t:d', x, 208, LIST_KINDS.doubly[l], { size: 13, bold: true, tone: 'ok' }),
          ...doubly.nodes,
          arrow('d:none', [dFirst.x - r - 1, dFirst.y], [dFirst.x - r - 30, dFirst.y], { tone: 'muted' }),
          text('d:none:t', dFirst.x - r - 36, dFirst.y + 4, 'None', { anchor: 'end', mono: true, size: 12, tone: 'muted' }),
        ],
      },
    };
  },
};

type NodeSpec = { id: string; value: number; cx: number; cy: number; tone?: Tone; dim?: boolean; ring?: boolean };

/** Draws list nodes and `next` arrows from a small description, for the insert and remove players. */
function listScene(specs: NodeSpec[], edges: [string, string, { bend?: number; tone?: Tone; dim?: boolean }?][], extra: SceneNode[], h: number) {
  const byId = new Map<string, BoxNode>();
  for (const s of specs) byId.set(s.id, listNode({ id: s.id, value: s.value, tone: s.tone ?? 'ok', dim: s.dim, ring: s.ring }, s.cx, s.cy, 20));
  const nodes: SceneNode[] = [...byId.values()];
  for (const [a, b, o] of edges) nodes.push(link(`e:${a}`, byId.get(a)!, byId.get(b)!, { bend: o?.bend, tone: o?.tone, dim: o?.dim }));
  return { w: W, h, nodes: [...nodes, ...extra] };
}

const INS: Record<'n1' | 'link_p' | 'link_n0' | 'done', T> = {
  n1: {
    en: 'n1 = n0.next: remember the node that comes after n0. The new node P (0) is not in the list yet.',
    zh: 'n1 = n0.next：记住 n0 之后的节点。新节点 P（0）还不在链表中。',
    'zh-hant': 'n1 = n0.next：記住 n0 之後的節點。新節點 P（0）還不在鏈結串列中。',
    ja: 'n1 = n0.next：n0 の次のノードを覚えておきます。新しいノード P（0）はまだリストに入っていません。',
    ru: 'n1 = n0.next: запоминаем узел после n0. Новый узел P (0) пока не в списке.',
  },
  link_p: {
    en: 'P.next = n1: P now points to n1. The list itself has not changed yet.',
    zh: 'P.next = n1：P 指向 n1。此时链表本身还没有变化。',
    'zh-hant': 'P.next = n1：P 指向 n1。此時鏈結串列本身還沒有變化。',
    ja: 'P.next = n1：P が n1 を指すようにします。リスト自体はまだ変わっていません。',
    ru: 'P.next = n1: P теперь указывает на n1. Сам список пока не изменился.',
  },
  link_n0: {
    en: 'n0.next = P: n0 now points to P, so P is part of the list. Only two references changed.',
    zh: 'n0.next = P：n0 指向 P，P 就加入了链表。只改了两个引用。',
    'zh-hant': 'n0.next = P：n0 指向 P，P 就加入了鏈結串列。只改了兩個引用。',
    ja: 'n0.next = P：n0 が P を指すので、P はリストの一部になります。変えた参照は 2 つだけです。',
    ru: 'n0.next = P: n0 указывает на P, и P становится частью списка. Изменились всего две ссылки.',
  },
  done: {
    en: 'Done: 1 → 0 → 3 → 2 → …. No element had to move, so inserting a node takes O(1).',
    zh: '完成：1 → 0 → 3 → 2 → …。没有任何元素需要移动，插入节点是 O(1)。',
    'zh-hant': '完成：1 → 0 → 3 → 2 → …。沒有任何元素需要移動，插入節點是 O(1)。',
    ja: '完了：1 → 0 → 3 → 2 → …。要素を動かす必要がないので、ノードの挿入は O(1) です。',
    ru: 'Готово: 1 → 0 → 3 → 2 → …. Ни один элемент не сдвигался, поэтому вставка узла — O(1).',
  },
};

const LIST_SOURCES = (func: 'insert' | 'remove', py: Record<string, string[]>, java: Record<string, string[]>) =>
  codeSources({
    python: { label: 'Python', raw: LIST_PY, parts: [{ func }], anchors: py },
    java: { label: 'Java', raw: LIST_JAVA, parts: [{ func }], anchors: java },
  });

/** The `…` after a list's last drawn node. */
function rest(id: string, from: [number, number]) {
  return [arrow(`${id}:a`, [from[0] + 21, from[1]], [from[0] + 52, from[1]], { tone: 'muted' }), text(`${id}:t`, from[0] + 58, from[1] + 5, '…', { size: 16, tone: 'muted' })];
}

const linkedlistInsert: StepFigure = {
  type: 'steps',
  call: 'insert(n0, P)',
  tones: { n1: 'idle', link_p: 'cmp', link_n0: 'cmp', done: 'done' },
  sources: LIST_SOURCES(
    'insert',
    { n1: ['n1 = n0.next'], link_p: ['P.next = n1'], link_n0: ['n0.next = P'], done: ['n0.next = P'] },
    { n1: ['ListNode n1 = n0.next;'], link_p: ['P.next = n1;'], link_n0: ['n0.next = P;'], done: ['n0.next = P;'] },
  ),
  build(l) {
    const y = 46;
    const row = (cx1: number) => [
      { id: 'a', value: 1, cx: 60, cy: y },
      { id: 'b', value: 3, cx: cx1, cy: y },
      { id: 'c', value: 2, cx: cx1 + 80, cy: y },
    ];
    const tags = (b: number, pSide: 'left' | 'below', p: { cx: number; cy: number }) => [
      ...tag('t:n0', { x: 40, y: y - 20, w: 40, h: 40 }, 'n0', { tone: 'ok' }),
      ...tag('t:n1', { x: b - 20, y: y - 20, w: 40, h: 40 }, 'n1', { tone: 'ok' }),
      ...tag('t:p', { x: p.cx - 20, y: p.cy - 20, w: 40, h: 40 }, 'P', { side: pSide, tone: 'info' }),
    ];
    const p = (cy: number, tone: Tone = 'info') => ({ id: 'p', value: 0, cx: 140, cy, tone });
    const frames: SceneFrame[] = [
      {
        kind: 'n1',
        scene: listScene([...row(220), p(122)], [['a', 'b'], ['b', 'c']], [...tags(220, 'left', { cx: 140, cy: 122 }), ...rest('r', [300, y])], 172),
        say: INS.n1[l],
      },
      {
        kind: 'link_p',
        scene: listScene([...row(220), p(122)], [['a', 'b'], ['b', 'c'], ['p', 'b', { tone: 'accent' }]], [...tags(220, 'left', { cx: 140, cy: 122 }), ...rest('r', [300, y])], 172),
        say: INS.link_p[l],
      },
      {
        kind: 'link_n0',
        scene: listScene([...row(220), p(122)], [['a', 'p', { tone: 'accent' }], ['b', 'c'], ['p', 'b']], [...tags(220, 'left', { cx: 140, cy: 122 }), ...rest('r', [300, y])], 172),
        say: INS.link_n0[l],
      },
      {
        kind: 'done',
        scene: listScene([...row(220), p(y, 'ok')], [['a', 'p'], ['b', 'c'], ['p', 'b']], [...tags(220, 'below', { cx: 140, cy: y }), ...rest('r', [300, y])], 172),
        say: INS.done[l],
      },
    ];
    return { frames };
  },
};

const REM: Record<'p' | 'n1' | 'link' | 'done', T> = {
  p: {
    en: 'P = n0.next: P is the node to remove, the one right after n0.',
    zh: 'P = n0.next：P 是要删除的节点，即 n0 之后的那个。',
    'zh-hant': 'P = n0.next：P 是要刪除的節點，即 n0 之後的那個。',
    ja: 'P = n0.next：P は削除するノード、つまり n0 の次のノードです。',
    ru: 'P = n0.next: P — удаляемый узел, тот, что сразу после n0.',
  },
  n1: {
    en: 'n1 = P.next: remember the node after P, so the list can continue there.',
    zh: 'n1 = P.next：记住 P 之后的节点，链表要从这里接上。',
    'zh-hant': 'n1 = P.next：記住 P 之後的節點，鏈結串列要從這裡接上。',
    ja: 'n1 = P.next：P の次のノードを覚えておき、そこへつなぎ直します。',
    ru: 'n1 = P.next: запоминаем узел после P — к нему мы и подключим список.',
  },
  link: {
    en: 'n0.next = n1: n0 skips over P. P can no longer be reached from the head of the list.',
    zh: 'n0.next = n1：n0 跳过 P。从头节点出发已经无法访问 P。',
    'zh-hant': 'n0.next = n1：n0 跳過 P。從頭節點出發已經無法訪問 P。',
    ja: 'n0.next = n1：n0 が P を飛ばします。先頭からは P にたどり着けなくなりました。',
    ru: 'n0.next = n1: n0 перешагивает через P. От головы списка до P больше не добраться.',
  },
  done: {
    en: 'Done: 1 → 2 → 5 → …. Removing a node changes a single reference: O(1).',
    zh: '完成：1 → 2 → 5 → …。删除节点只改一个引用：O(1)。',
    'zh-hant': '完成：1 → 2 → 5 → …。刪除節點只改一個引用：O(1)。',
    ja: '完了：1 → 2 → 5 → …。ノードの削除で変える参照は 1 つだけ：O(1)。',
    ru: 'Готово: 1 → 2 → 5 → …. Удаление узла меняет одну ссылку: O(1).',
  },
};

const linkedlistRemove: StepFigure = {
  type: 'steps',
  call: 'remove(n0)',
  tones: { p: 'idle', n1: 'idle', link: 'swp', done: 'done' },
  sources: LIST_SOURCES(
    'remove',
    { p: ['P = n0.next'], n1: ['n1 = P.next'], link: ['n0.next = n1'], done: ['n0.next = n1'] },
    { p: ['ListNode P = n0.next;'], n1: ['ListNode n1 = P.next;'], link: ['n0.next = n1;'], done: ['n0.next = n1;'] },
  ),
  build(l) {
    const y = 46;
    const nodeBox = (cx: number) => ({ x: cx - 20, y: y - 20, w: 40, h: 40 });
    const full = (pDim: boolean): NodeSpec[] => [
      { id: 'a', value: 1, cx: 60, cy: y },
      { id: 'p', value: 3, cx: 140, cy: y, tone: 'danger', dim: pDim },
      { id: 'b', value: 2, cx: 220, cy: y },
      { id: 'c', value: 5, cx: 300, cy: y },
    ];
    const n0Tag = tag('t:n0', nodeBox(60), 'n0', { tone: 'ok' });
    const pTag = tag('t:p', nodeBox(140), 'P', { tone: 'danger' });
    const n1Tag = (cx: number) => tag('t:n1', nodeBox(cx), 'n1', { tone: 'ok' });
    const frames: SceneFrame[] = [
      {
        kind: 'p',
        scene: listScene(full(false), [['a', 'p'], ['p', 'b'], ['b', 'c']], [...n0Tag, ...pTag, ...rest('r', [300, y])], 120),
        say: REM.p[l],
      },
      {
        kind: 'n1',
        scene: listScene(full(false), [['a', 'p'], ['p', 'b'], ['b', 'c']], [...n0Tag, ...pTag, ...n1Tag(220), ...rest('r', [300, y])], 120),
        say: REM.n1[l],
      },
      {
        kind: 'link',
        scene: listScene(
          full(true),
          [['a', 'b', { bend: -26, tone: 'accent' }], ['p', 'b', { dim: true }], ['b', 'c']],
          [...n0Tag, ...pTag.map((n) => ({ ...n, dim: true })), ...n1Tag(220), ...rest('r', [300, y])],
          120,
        ),
        say: REM.link[l],
      },
      {
        kind: 'done',
        scene: listScene(
          [
            { id: 'a', value: 1, cx: 60, cy: y },
            { id: 'b', value: 2, cx: 140, cy: y },
            { id: 'c', value: 5, cx: 220, cy: y },
          ],
          [['a', 'b'], ['b', 'c']],
          [...n0Tag, ...n1Tag(140), ...rest('r', [220, y])],
          120,
        ),
        say: REM.done[l],
      },
    ];
    return { frames };
  },
};

// ── Memory and cache ──────────────────────────────────────────────────

const DEVICES: Record<'cpu' | 'processor' | 'cache' | 'memory' | 'disk', T> = {
  cpu: { en: 'CPU', zh: 'CPU', 'zh-hant': 'CPU', ja: 'CPU', ru: 'ЦП' },
  processor: { en: 'Cores', zh: '运算核心', 'zh-hant': '運算核心', ja: 'コア', ru: 'Ядра' },
  cache: { en: 'Cache', zh: '缓存', 'zh-hant': '快取', ja: 'キャッシュ', ru: 'Кэш' },
  memory: { en: 'Memory (RAM)', zh: '内存', 'zh-hant': '記憶體', ja: 'メモリ', ru: 'Память' },
  disk: { en: 'Disk', zh: '硬盘', 'zh-hant': '硬碟', ja: 'ディスク', ru: 'Диск' },
};

const storageDevices: StaticFigure = {
  type: 'static',
  build(l) {
    const iy = 62;
    const label = (id: string, x: number, value: string, tone: Tone) => text(id, x, 134, value, { anchor: 'middle', size: 13, bold: true, tone });
    const both = { head: 'both' as const, tone: 'muted' as Tone };
    return {
      scene: {
        w: W,
        h: 156,
        nodes: [
          region('cpu', 8, 40, 186, 110, { tone: 'ok', label: DEVICES.cpu[l], labelAt: 'inside' }),
          { kind: 'icon', id: 'i:cpu', x: 36, y: iy + 8, size: 44, icon: 'cpu', tone: 'ok' },
          { kind: 'icon', id: 'i:cache', x: 124, y: iy + 8, size: 44, icon: 'cache', tone: 'warn' },
          { kind: 'icon', id: 'i:ram', x: 238, y: iy + 8, size: 52, icon: 'ram', tone: 'info' },
          { kind: 'icon', id: 'i:disk', x: 362, y: iy + 8, size: 44, icon: 'disk', tone: 'accent' },
          label('l:cpu', 58, DEVICES.processor[l], 'ok'),
          label('l:cache', 146, DEVICES.cache[l], 'warn'),
          label('l:ram', 264, DEVICES.memory[l], 'info'),
          label('l:disk', 384, DEVICES.disk[l], 'accent'),
          arrow('a1', [86, iy + 30], [120, iy + 30], both),
          arrow('a2', [176, iy + 30], [232, iy + 30], both),
          arrow('a3', [296, iy + 30], [356, iy + 30], both),
          arrow('a4', [58, iy + 4], [264, iy + 10], { ...both, via: [[58, 14], [264, 14]] }),
        ],
      },
    };
  },
};

const PYRAMID: Record<'cpu' | 'faster' | 'pricier' | 'larger' | 'keeps', T> = {
  cpu: { en: 'inside the CPU', zh: 'CPU 内部', 'zh-hant': 'CPU 內部', ja: 'CPU の中', ru: 'внутри ЦП' },
  faster: { en: 'faster', zh: '更快', 'zh-hant': '更快', ja: '高速', ru: 'быстрее' },
  pricier: { en: 'pricier per byte', zh: '单价更高', 'zh-hant': '單價更高', ja: '容量単価が高い', ru: 'дороже за байт' },
  larger: { en: 'larger', zh: '容量更大', 'zh-hant': '容量更大', ja: '大容量', ru: 'больше объём' },
  keeps: { en: 'keeps data without power', zh: '断电后数据不丢失', 'zh-hant': '斷電後資料不遺失', ja: '電源を切っても保持', ru: 'хранит без питания' },
};

const storagePyramid: StaticFigure = {
  type: 'static',
  build(l) {
    const cx = 160;
    const top = 30;
    const layerH = 40;
    const gap = 6;
    const half = (y: number) => 26 + (y - top) * 0.52;
    const layers: [string, Tone][] = [
      ['L1', 'danger'],
      ['L2', 'warn'],
      ['L3', 'info'],
      ['RAM', 'ok'],
      ['SSD / HDD', 'accent'],
    ];
    const nodes: SceneNode[] = layers.map(([name, tone], k) => {
      const y0 = top + k * (layerH + gap);
      const y1 = y0 + layerH;
      const d = `M ${cx - half(y0)} ${y0} L ${cx + half(y0)} ${y0} L ${cx + half(y1)} ${y1} L ${cx - half(y1)} ${y1} Z`;
      return { kind: 'path', id: `L${k}`, d, fill: true, tone, text: name, textAt: [cx, (y0 + y1) / 2], size: 14 };
    });
    const cacheBottom = top + 3 * (layerH + gap) - gap;
    nodes.unshift(region('cpu', cx - half(cacheBottom) - 14, top - 10, (half(cacheBottom) + 14) * 2, cacheBottom - top + 20, { tone: 'muted' }));
    nodes.push(text('cpu:l', cx - half(cacheBottom) - 14, top - 16, PYRAMID.cpu[l], { size: 12, bold: true, tone: 'muted' }));
    const ax = 330;
    const bottom = top + 5 * (layerH + gap) - gap;
    nodes.push(
      arrow('up', [ax, bottom], [ax, top], { head: 'both', tone: 'muted', width: 2 }),
      text('t:fast', ax + 12, top + 12, PYRAMID.faster[l], { size: 13, bold: true, tone: 'accent' }),
      text('t:price', ax + 12, top + 30, PYRAMID.pricier[l], { size: 12, tone: 'muted' }),
      text('t:large', ax + 12, bottom - 24, PYRAMID.larger[l], { size: 13, bold: true, tone: 'ok' }),
      text('t:keep', ax + 12, bottom - 6, PYRAMID.keeps[l], { size: 12, tone: 'muted' }),
    );
    return { scene: { w: 500, h: bottom + 12, nodes } };
  },
};

const FIGURES: Record<string, Figure> = {
  array_definition: arrayDefinition,
  array_memory_location_calculation: arrayAddress,
  array_insert_element: arrayInsert,
  array_remove_element: arrayRemove,
  linkedlist_definition: linkedlistDefinition,
  linkedlist_insert_node: linkedlistInsert,
  linkedlist_remove_node: linkedlistRemove,
  linkedlist_common_types: linkedlistTypes,
  computer_storage_devices: storageDevices,
  storage_pyramid: storagePyramid,
};

export default FIGURES;
