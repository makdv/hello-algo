import type { Locale } from '../../i18n/locale';
import { arrow, box, brace, cells, center, chip, link, linkedList, listNode, region, rowWidth, seg, text, textWidth, binarySlots } from '../kit';
import type { Figure, PathNode, SceneFrame, SceneNode, Segment, StaticFigure, StepFigure, TableFigure, Tone } from '../scene';

type T = Record<Locale, string>;

/** Fills `{name}` placeholders. */
const fmt = (s: string, vars: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));

/** `n` as 8 binary digits. */
const bin8 = (n: number) => (n & 0xff).toString(2).padStart(8, '0');

/** `0100 0001`: a byte split into two nibbles. */
const nibbles = (bits: string) => `${bits.slice(0, 4)} ${bits.slice(4)}`;

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/** `2` + sup(-3) → `2⁻³`. */
const sup = (n: number) => [...String(n)].map((c) => SUP[c] ?? c).join('');

/**
 * A byte as colored runs: bits whose mask bit is set get `tone`, with a space between the nibbles.
 * Bit 7 is the leftmost character.
 */
function byteSeg(n: number, mask = 0, tone: Tone = 'accent'): Segment[] {
  const out: Segment[] = [];
  for (let i = 7; i >= 0; i--) {
    const b = (n >> i) & 1;
    out.push((mask >> i) & 1 ? { t: String(b), tone, bold: true } : { t: String(b) });
    if (i === 4) out.push({ t: ' ' });
  }
  return out;
}

// ── Logical structure ─────────────────────────────────────────────────

const LOGIC: Record<'linear' | 'nonlinear' | 'array' | 'list' | 'stack' | 'queue' | 'hash' | 'tree' | 'graph' | 'heap' | 'key' | 'value', T> = {
  linear: { en: 'Linear data structures', zh: '线性数据结构', 'zh-hant': '線性資料結構', ja: '線形データ構造', ru: 'Линейные структуры' },
  nonlinear: { en: 'Non-linear data structures', zh: '非线性数据结构', 'zh-hant': '非線性資料結構', ja: '非線形データ構造', ru: 'Нелинейные структуры' },
  array: { en: 'Array', zh: '数组', 'zh-hant': '陣列', ja: '配列', ru: 'Массив' },
  list: { en: 'Linked list', zh: '链表', 'zh-hant': '鏈結串列', ja: '連結リスト', ru: 'Связный список' },
  stack: { en: 'Stack', zh: '栈', 'zh-hant': '堆疊', ja: 'スタック', ru: 'Стек' },
  queue: { en: 'Queue', zh: '队列', 'zh-hant': '佇列', ja: 'キュー', ru: 'Очередь' },
  hash: { en: 'Hash table', zh: '哈希表', 'zh-hant': '雜湊表', ja: 'ハッシュテーブル', ru: 'Хеш-таблица' },
  tree: { en: 'Tree', zh: '树', 'zh-hant': '樹', ja: '木', ru: 'Дерево' },
  graph: { en: 'Graph', zh: '图', 'zh-hant': '圖', ja: 'グラフ', ru: 'Граф' },
  heap: { en: 'Heap', zh: '堆', 'zh-hant': '堆積', ja: 'ヒープ', ru: 'Куча' },
  key: { en: 'key', zh: '键', 'zh-hant': '鍵', ja: 'キー', ru: 'ключ' },
  value: { en: 'value', zh: '值', 'zh-hant': '值', ja: '値', ru: 'значение' },
};

const VALUES = [1, 3, 2, 5, 4];

const classificationLogic: StaticFigure = {
  type: 'static',
  build(l) {
    const L = (k: keyof typeof LOGIC) => LOGIC[k][l];
    const title = (id: string, x: number, y: number, k: keyof typeof LOGIC, tone: Tone) => text(id, x, y, L(k), { size: 12, bold: true, tone });
    const op = (id: string, x: number, y: number, value: string) => text(id, x, y, value, { anchor: 'middle', mono: true, size: 11, tone: 'muted' });
    const c = 22;
    const g = 3;
    const row = rowWidth(5, c, g);
    const valueCells = (prefix: string, x: number, y: number) =>
      cells(prefix, x, y, VALUES.map((v) => ({ value: v, tone: 'accent' as Tone })), { w: c, h: c, gap: g, size: 12 });
    const line = (id: string, d: string): PathNode => ({ kind: 'path', id, d, tone: 'accent', width: 1.25 });

    const nodes: SceneNode[] = [
      region('lin', 8, 28, 214, 366, { tone: 'accent', label: L('linear') }),
      region('non', 230, 28, 202, 366, { tone: 'ok', label: L('nonlinear') }),
    ];

    // Linear column: centered on x = 115.
    const mid = 115;
    nodes.push(title('t:arr', 20, 56, 'array', 'accent'), ...valueCells('arr', mid - row / 2, 66));

    const list = linkedList(
      'll',
      mid - (4 * 38 + 24) / 2,
      142,
      VALUES.map((v) => ({ id: `ll${v}`, value: v, tone: 'accent' as Tone })),
      { step: 38, r: 12 },
    );
    nodes.push(title('t:ll', 20, 132, 'list', 'accent'), ...list.nodes.map((n) => (n.kind === 'box' ? { ...n, size: 12 } : n)));

    // Stack: open on the left, where elements are pushed and popped.
    const sy = 252;
    const sx = 70;
    nodes.push(
      title('t:st', 20, 216, 'stack', 'accent'),
      line('st:box', `M 66 ${sy - 15} L ${sx + row + 4} ${sy - 15} L ${sx + row + 4} ${sy + 15} L 66 ${sy + 15}`),
      ...valueCells('st', sx, sy - c / 2),
      arrow('st:push', [24, sy - 5], [60, sy - 5], { tone: 'accent', width: 1.5 }),
      op('st:push:t', 42, sy - 11, 'push'),
      arrow('st:pop', [60, sy + 5], [24, sy + 5], { tone: 'muted', width: 1.5 }),
      op('st:pop:t', 42, sy + 21, 'pop'),
    );

    // Queue: in at the rear (right), out at the front (left).
    const qy = 342;
    const qx = mid - row / 2;
    nodes.push(
      title('t:q', 20, 306, 'queue', 'accent'),
      line('q:top', `M ${qx - 4} ${qy - 15} L ${qx + row + 4} ${qy - 15}`),
      line('q:bot', `M ${qx - 4} ${qy + 15} L ${qx + row + 4} ${qy + 15}`),
      ...valueCells('q', qx, qy - c / 2),
      arrow('q:pop', [qx - 8, qy], [qx - 34, qy], { tone: 'muted', width: 1.5 }),
      op('q:pop:t', qx - 21, qy + 18, 'pop'),
      arrow('q:push', [qx + row + 34, qy], [qx + row + 8, qy], { tone: 'accent', width: 1.5 }),
      op('q:push:t', qx + row + 21, qy + 18, 'push'),
    );

    // Non-linear column.
    const r = 12;
    const circle = (id: string, value: number, x: number, y: number) => ({ ...listNode({ id, value }, x, y, r), size: 12 });
    const tree = binarySlots(3, 238, 186, 74, 34).map((s, k) => circle(`tr${k}`, k + 1, s.x, s.y));
    nodes.push(title('t:tr', 242, 54, 'tree', 'ok'), ...tree);
    for (let k = 1; k < tree.length; k++) nodes.push(link(`tr:e${k}`, tree[(k - 1) >> 1], tree[k], { width: 1.5 }));

    const gp: Record<number, [number, number]> = { 1: [278, 196], 2: [338, 196], 4: [400, 223], 3: [278, 250], 5: [338, 250] };
    const graph = Object.entries(gp).map(([v, [x, y]]) => circle(`gr${v}`, Number(v), x, y));
    const byValue = (v: number) => graph.find((n) => n.text === String(v))!;
    const edges: [number, number][] = [
      [1, 2],
      [1, 3],
      [2, 3],
      [2, 5],
      [2, 4],
      [3, 5],
      [5, 4],
    ];
    nodes.push(title('t:gr', 242, 176, 'graph', 'ok'), ...graph);
    for (const [a, b] of edges) nodes.push(link(`gr:e${a}${b}`, byValue(a), byValue(b), { head: 'none', pad: 1, width: 1.5 }));

    // A min-heap stored as [1, 3, 2, 5, 4]: a complete binary tree filled level by level.
    const heap = binarySlots(3, 238, 186, 306, 34)
      .slice(0, 5)
      .map((s, k) => circle(`hp${k}`, VALUES[k], s.x, s.y));
    nodes.push(title('t:hp', 242, 288, 'heap', 'ok'), ...heap);
    for (let k = 1; k < heap.length; k++) nodes.push(link(`hp:e${k}`, heap[(k - 1) >> 1], heap[k], { width: 1.5 }));

    // Hash table: counted in both groups by the book, so it sits between them.
    const lw = Math.max(textWidth(L('key'), 12), textWidth(L('value'), 12));
    const hw = 12 + lw + 12 + rowWidth(3, 24, 12) + 14;
    const hx = Math.round(220 - hw / 2);
    const kx = hx + 12 + lw + 12;
    const keys = cells('hk', kx, 438, ['a', 'b', 'c'].map((v) => ({ value: v, tone: 'info' as Tone })), { w: 24, h: 24, gap: 12, size: 12 });
    const vals = cells('hv', kx, 474, [1, 2, 3].map((v) => ({ value: v })), { w: 24, h: 24, gap: 12, size: 12 });
    nodes.push(
      region('hash', hx, 428, hw, 80, { tone: 'info', label: L('hash') }),
      text('h:k', hx + 12, 455, L('key'), { size: 12, tone: 'muted' }),
      text('h:v', hx + 12, 491, L('value'), { size: 12, tone: 'muted' }),
      ...keys,
      ...vals,
      ...keys.map((k, i) => link(`h:e${i}`, k, vals[i], { tone: 'info', width: 1.5 })),
    );

    return { scene: { w: 440, h: 512, nodes } };
  },
};

// ── Physical structure ────────────────────────────────────────────────

const PHYS: Record<'contig' | 'scatter' | 'array' | 'list' | 'free' | 'used' | 'value' | 'pointer', T> = {
  contig: { en: 'Contiguous space', zh: '连续空间存储', 'zh-hant': '連續空間儲存', ja: '連続空間格納', ru: 'Непрерывное пространство' },
  scatter: { en: 'Dispersed space', zh: '分散空间存储', 'zh-hant': '分散空間儲存', ja: '分散空間格納', ru: 'Разрозненное пространство' },
  array: { en: 'array', zh: '数组', 'zh-hant': '陣列', ja: '配列', ru: 'массив' },
  list: { en: 'linked list', zh: '链表', 'zh-hant': '鏈結串列', ja: '連結リスト', ru: 'связный список' },
  free: { en: 'Free memory', zh: '可用内存空间', 'zh-hant': '可用記憶體空間', ja: '空きメモリ', ru: 'Свободная память' },
  used: { en: 'Memory used by the array', zh: '数组占用的内存空间', 'zh-hant': '陣列佔用的記憶體空間', ja: '配列が使うメモリ', ru: 'Память массива' },
  value: { en: 'Node value', zh: '节点值', 'zh-hant': '節點值', ja: 'ノードの値', ru: 'Значение узла' },
  pointer: { en: 'Reference to the next node', zh: '指向下一节点的引用', 'zh-hant': '指向下一節點的引用', ja: '次のノードへの参照', ru: 'Ссылка на следующий узел' },
};

const classificationPhysical: StaticFigure = {
  type: 'static',
  build(l) {
    const size = 26;
    const step = 30;
    const rows = 5;
    const cols = 6;
    const gy = 58;
    const left = 24;
    const right = 240;
    const gridW = cols * step - (step - size);
    const at = (gx: number, r: number, c: number) => [gx + c * step, gy + r * step] as const;
    const nodes: SceneNode[] = [
      text('t:a', left + gridW / 2, 22, PHYS.contig[l], { anchor: 'middle', size: 13, bold: true }),
      text('s:a', left + gridW / 2, 42, PHYS.array[l], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }),
      text('t:b', right + gridW / 2, 22, PHYS.scatter[l], { anchor: 'middle', size: 13, bold: true }),
      text('s:b', right + gridW / 2, 42, PHYS.list[l], { anchor: 'middle', size: 12, bold: true, tone: 'ok' }),
    ];
    const free = (id: string, x: number, y: number) => box(id, x, y, '', { w: size, h: size, tone: 'ghost', dashed: true });

    // Contiguous: the array's elements fill one unbroken run of cells.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const [x, y] = at(left, r, c);
        const used = r === 1 && c < VALUES.length;
        nodes.push(used ? box(`a${r}-${c}`, x, y, VALUES[c], { w: size, h: size, size: 13, tone: 'accent' }) : free(`a${r}-${c}`, x, y));
      }
    }

    // Dispersed: each node (value + reference) sits wherever memory was free.
    const spots: [number, number][] = [
      [0, 0],
      [2, 2],
      [4, 1],
      [3, 4],
      [0, 4],
    ];
    const taken = new Set(spots.flatMap(([r, c]) => [`${r}-${c}`, `${r}-${c + 1}`]));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (taken.has(`${r}-${c}`)) continue;
        const [x, y] = at(right, r, c);
        nodes.push(free(`b${r}-${c}`, x, y));
      }
    }
    const valueBox = (k: number) => {
      const [x, y] = at(right, spots[k][0], spots[k][1]);
      return box(`v${k}`, x, y, VALUES[k], { w: size, h: size, size: 13, tone: 'ok' });
    };
    const ptrBox = (k: number) => {
      const [x, y] = at(right, spots[k][0], spots[k][1] + 1);
      return box(`p${k}`, x, y, k === spots.length - 1 ? '∅' : '•', { w: size, h: size, size: 12, tone: 'info' });
    };
    spots.forEach((_, k) => nodes.push(valueBox(k), ptrBox(k)));
    for (let k = 0; k < spots.length - 1; k++) {
      const from = center(ptrBox(k));
      nodes.push(link(`e${k}`, { ...ptrBox(k), x: from.x - 1, y: from.y - 1, w: 2, h: 2 }, valueBox(k + 1), { tone: 'info', width: 1.5 }));
    }

    return {
      scene: { w: 440, h: 214, nodes },
      legend: [
        { tone: 'ghost', dashed: true, text: PHYS.free[l] },
        { tone: 'accent', text: PHYS.used[l] },
        { tone: 'ok', text: PHYS.value[l] },
        { tone: 'info', text: PHYS.pointer[l] },
      ],
    };
  },
};

// ── Memory addresses ──────────────────────────────────────────────────

const MEM: Record<'free' | 'used' | 'read' | 'hint', T> = {
  free: { en: 'Free memory', zh: '可用内存空间', 'zh-hant': '可用記憶體空間', ja: '空きメモリ', ru: 'Свободная память' },
  used: { en: 'Used memory', zh: '已使用的内存空间', 'zh-hant': '已使用的記憶體空間', ja: '使用中のメモリ', ru: 'Занятая память' },
  read: { en: 'Accessed cell', zh: '正在访问', 'zh-hant': '正在訪問', ja: 'アクセス中', ru: 'Читаемая ячейка' },
  hint: { en: 'address = row + column', zh: '地址 = 行 + 列', 'zh-hant': '位址 = 行 + 列', ja: 'アドレス = 行 + 列', ru: 'адрес = строка + столбец' },
};

const MEM_SAY: Record<'memory' | 'access', T> = {
  memory: {
    en: 'Memory works like a huge table. Each cell is a small piece of memory with a unique address; here the address is the row number plus the column number.',
    zh: '内存就像一张巨大的表格。每个单元格是一小块内存空间，并有唯一的内存地址；这里的地址等于行号加列号。',
    'zh-hant': '記憶體就像一張巨大的表格。每個單元格是一小塊記憶體空間，並有唯一的記憶體位址；這裡的位址等於行號加列號。',
    ja: 'メモリは巨大な表のようなものです。各セルは小さなメモリ空間で、固有のメモリアドレスを持ちます。ここではアドレス＝行番号＋列番号です。',
    ru: 'Память похожа на огромную таблицу. Каждая ячейка — небольшой участок памяти со своим уникальным адресом; здесь адрес равен номеру строки плюс номер столбца.',
  },
  access: {
    en: 'Access address {a}: row {r}, column {c}. The system goes straight to that cell and reads the data stored there: {v}.',
    zh: '访问内存地址 {a}：行 {r}，列 {c}。系统直接定位到该单元格，读取其中的数据 {v}。',
    'zh-hant': '訪問記憶體位址 {a}：行 {r}，列 {c}。系統直接定位到該單元格，讀取其中的資料 {v}。',
    ja: 'メモリアドレス {a} にアクセスします（行 {r}、列 {c}）。システムはそのセルへ直接移動し、格納されたデータ {v} を読み取ります。',
    ru: 'Обращаемся по адресу {a}: строка {r}, столбец {c}. Система сразу находит эту ячейку и читает хранящиеся в ней данные: {v}.',
  },
};

const hex4 = (n: number) => `0x${n.toString(16).toUpperCase().padStart(4, '0')}`;
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');

const memoryLocation: StepFigure = {
  type: 'steps',
  tones: { memory: 'idle', access: 'cmp' },
  build(l) {
    const W = 440;
    const H = 272;
    const rows = 5;
    const cols = 8;
    const size = 26;
    const step = 30;
    const gx = 178;
    const gy = 48;
    const data = new Map<number, number>([
      [0x12, 1],
      [0x24, 2],
    ]);
    const zoomChip = 1;

    // A flat memory stick: green board, gold pins along one edge, chips on top.
    const stick = (): SceneNode[] => {
      const out: SceneNode[] = [box('ram', 16, 14, '', { w: 44, h: 248, tone: 'ok' })];
      for (let k = 0; k < 24; k++) {
        const y = 22 + k * 9.8 + (k >= 12 ? 4 : 0);
        out.push(box(`pin${k}`, 9, y, '', { w: 7, h: 6, tone: 'warn' }));
      }
      for (let k = 0; k < 7; k++) {
        out.push(box(`chip${k}`, 25, 22 + k * 34, '', { w: 26, h: 24, tone: k === zoomChip ? 'accent' : 'muted', ring: k === zoomChip }));
      }
      const cy = 22 + zoomChip * 34;
      out.push(
        region('zoom', 110, 16, 324, 212, { tone: 'muted' }),
        arrow('w1', [52, cy], [110, 16], { head: 'none', tone: 'muted', width: 1 }),
        arrow('w2', [52, cy + 24], [110, 228], { head: 'none', tone: 'muted', width: 1 }),
      );
      return out;
    };

    const scene = (target: number | null): SceneNode[] => {
      const tr = target === null ? -1 : target >> 4;
      const tc = target === null ? -1 : target & 15;
      const nodes = stick();
      for (let c = 0; c < cols; c++) {
        const x = gx + c * step + size / 2;
        nodes.push(text(`ch${c}`, x, 38, hex2(c), { anchor: 'middle', mono: true, size: 12, bold: c === tc, tone: c === tc ? 'accent' : 'muted' }));
        nodes.push(text(`cd${c}`, x, 214, '⋮', { anchor: 'middle', size: 16, tone: 'muted' }));
      }
      nodes.push(text('cd:l', 152, 214, '⋮', { anchor: 'middle', size: 16, tone: 'muted' }));
      for (let r = 0; r < rows; r++) {
        const y = gy + r * step;
        nodes.push(text(`rh${r}`, 172, y + 17, hex4(r * 16), { anchor: 'end', mono: true, size: 11, bold: r === tr, tone: r === tr ? 'accent' : 'muted' }));
        nodes.push(text(`rd${r}`, 424, y + 18, '⋯', { anchor: 'middle', size: 14, tone: 'muted' }));
        for (let c = 0; c < cols; c++) {
          const addr = r * 16 + c;
          const v = data.get(addr);
          const hit = addr === target;
          nodes.push(
            box(`m${r}-${c}`, gx + c * step, y, v ?? '', {
              w: size,
              h: size,
              size: 13,
              tone: hit ? 'accent' : v !== undefined ? 'info' : 'muted',
              ring: hit,
            }),
          );
        }
      }
      if (target === null) {
        nodes.push(text('hint', 272, 252, MEM.hint[l], { anchor: 'middle', size: 12, tone: 'muted' }));
      } else {
        nodes.push(
          chip(
            'res',
            272,
            236,
            seg([hex4(tr * 16), 'accent'], ' + ', [hex2(tc), 'accent'], ' = ', [hex4(target), 'accent', true], '  →  ', [String(data.get(target)), 'accent', true]),
          ),
        );
      }
      return nodes;
    };

    const frames: SceneFrame[] = [{ kind: 'memory', scene: { w: W, h: H, nodes: scene(null) }, say: MEM_SAY.memory[l] }];
    for (const addr of data.keys()) {
      frames.push({
        kind: 'access',
        scene: { w: W, h: H, nodes: scene(addr) },
        say: fmt(MEM_SAY.access[l], { a: hex4(addr), r: hex4(addr & ~15), c: hex2(addr & 15), v: data.get(addr)! }),
        call: hex4(addr),
      });
    }
    return {
      frames,
      legend: [
        { tone: 'muted', text: MEM.free[l] },
        { tone: 'info', text: MEM.used[l] },
        { tone: 'accent', text: MEM.read[l] },
      ],
    };
  },
};

// ── ASCII ─────────────────────────────────────────────────────────────

const CONTROL_ABBR = [
  'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
  'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US', 'SP',
];

/** Names of the control characters 0–31, the space (32) and DEL (127, last). */
const CONTROL_NAMES: Record<Locale, string[]> = {
  en: [
    'Null', 'Start of heading', 'Start of text', 'End of text', 'End of transmission', 'Enquiry', 'Acknowledge', 'Bell',
    'Backspace', 'Horizontal tab', 'Line feed (new line)', 'Vertical tab', 'Form feed (new page)', 'Carriage return', 'Shift out', 'Shift in',
    'Data link escape', 'Device control 1', 'Device control 2', 'Device control 3', 'Device control 4', 'Negative acknowledge', 'Synchronous idle', 'End of transmission block',
    'Cancel', 'End of medium', 'Substitute', 'Escape', 'File separator', 'Group separator', 'Record separator', 'Unit separator',
    'Space', 'Delete',
  ],
  zh: [
    '空字符', '标题开始', '正文开始', '正文结束', '传输结束', '请求', '确认', '响铃',
    '退格', '水平制表符', '换行', '垂直制表符', '换页', '回车', '移出', '移入',
    '数据链路转义', '设备控制 1', '设备控制 2', '设备控制 3', '设备控制 4', '否定确认', '同步空闲', '传输块结束',
    '取消', '介质结束', '替换', '转义', '文件分隔符', '组分隔符', '记录分隔符', '单元分隔符',
    '空格', '删除',
  ],
  'zh-hant': [
    '空字元', '標題開始', '正文開始', '正文結束', '傳輸結束', '請求', '確認', '響鈴',
    '退格', '水平定位字元', '換行', '垂直定位字元', '換頁', '歸位', '移出', '移入',
    '資料鏈路跳脫', '裝置控制 1', '裝置控制 2', '裝置控制 3', '裝置控制 4', '否定確認', '同步閒置', '傳輸區塊結束',
    '取消', '媒體結束', '替換', '跳脫', '檔案分隔符', '群組分隔符', '記錄分隔符', '單元分隔符',
    '空格', '刪除',
  ],
  ja: [
    'ヌル', 'ヘッディング開始', 'テキスト開始', 'テキスト終了', '伝送終了', '問い合わせ', '肯定応答', 'ベル',
    '後退', '水平タブ', '改行', '垂直タブ', '改ページ', '復帰', 'シフトアウト', 'シフトイン',
    '伝送制御拡張', '装置制御 1', '装置制御 2', '装置制御 3', '装置制御 4', '否定応答', '同期信号', '伝送ブロック終了',
    '取り消し', '媒体終端', '置換', 'エスケープ', 'ファイル分離', 'グループ分離', 'レコード分離', 'ユニット分離',
    '空白', '削除',
  ],
  ru: [
    'Пустой символ', 'Начало заголовка', 'Начало текста', 'Конец текста', 'Конец передачи', 'Запрос', 'Подтверждение', 'Звонок',
    'Возврат на шаг', 'Горизонтальная табуляция', 'Перевод строки', 'Вертикальная табуляция', 'Перевод страницы', 'Возврат каретки', 'Выход из набора', 'Возврат в набор',
    'Экранирование канала данных', 'Управление устройством 1', 'Управление устройством 2', 'Управление устройством 3', 'Управление устройством 4', 'Отрицательное подтверждение', 'Синхронизация', 'Конец блока передачи',
    'Отмена', 'Конец носителя', 'Замена', 'Экранирование', 'Разделитель файлов', 'Разделитель групп', 'Разделитель записей', 'Разделитель элементов',
    'Пробел', 'Удаление',
  ],
};

const ASCII_HEAD: Record<Locale, string[]> = {
  en: ['Dec', 'Binary', 'Char', 'Name'],
  zh: ['十进制', '二进制', '字符', '名称'],
  'zh-hant': ['十進位', '二進位', '字元', '名稱'],
  ja: ['10 進数', '2 進数', '文字', '名前'],
  ru: ['Дес.', 'Двоичный', 'Символ', 'Название'],
};

const asciiTable: TableFigure = {
  type: 'table',
  build(l) {
    const names = CONTROL_NAMES[l];
    const rows = Array.from({ length: 128 }, (_, code) => {
      const ch = code <= 32 ? CONTROL_ABBR[code] : code === 127 ? 'DEL' : String.fromCharCode(code);
      const name = code <= 32 ? names[code] : code === 127 ? names[33] : '';
      return [String(code), nibbles(bin8(code)), ch, name];
    });
    return { head: ASCII_HEAD[l], rows, columns: 4, mono: [0, 1, 2] };
  },
};

// ── Unicode and UTF-8 ─────────────────────────────────────────────────

const HELLO = ['H', 'e', 'l', 'l', 'o', '算', '法'];
/** One color per distinct character. */
const CHAR_TONES: Tone[] = ['danger', 'warn', 'info', 'info', 'ok', 'accent', 'idle'];

const codePoint = (ch: string) => ch.codePointAt(0)!;
const bits16 = (cp: number) => cp.toString(2).padStart(16, '0');

/** UTF-8 bytes of a code point below 0x10000. */
function utf8(cp: number): number[] {
  if (cp < 0x80) return [cp];
  if (cp < 0x800) return [0xc0 | (cp >> 6), 0x80 | (cp & 63)];
  return [0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
}

const ENC: Record<'char' | 'en1' | 'en2' | 'zh1' | 'zh2', T> = {
  char: { en: 'Char', zh: '字符', 'zh-hant': '字元', ja: '文字', ru: 'Символ' },
  en1: { en: 'English letters', zh: '英文字符', 'zh-hant': '英文字元', ja: '英字', ru: 'Латинские буквы' },
  en2: { en: '1 byte, high byte = 0', zh: '1 字节，高位填 0', 'zh-hant': '1 位元組，高位填 0', ja: '1 バイト（上位は 0）', ru: '1 байт, старший = 0' },
  zh1: { en: 'Chinese characters', zh: '中文字符', 'zh-hant': '中文字元', ja: '漢字', ru: 'Китайские иероглифы' },
  zh2: { en: '2 bytes', zh: '2 字节', 'zh-hant': '2 位元組', ja: '2 バイト', ru: '2 байта' },
};

const unicodeHello: StaticFigure = {
  type: 'static',
  build(l) {
    const y0 = 32;
    const step = 32;
    const h = 26;
    const bx = 100;
    const bw = 80;
    const nodes: SceneNode[] = [
      text('h:c', 31, 20, ENC.char[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
      text('h:u', bx + bw + 3, 20, 'Unicode', { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
    ];
    HELLO.forEach((ch, k) => {
      const y = y0 + k * step;
      const cp = codePoint(ch);
      const b = bits16(cp);
      const tone = CHAR_TONES[k];
      const hi = b.slice(0, 8);
      nodes.push(
        box(`c${k}`, 16, y, ch, { w: 30, h, size: 14, tone, sans: cp > 0x7f }),
        text(`u${k}`, 54, y + 17, `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`, { mono: true, size: 11, tone: 'muted' }),
        box(`hi${k}`, bx, y, hi, { w: bw, h, size: 13, tone: hi === '00000000' ? 'muted' : tone }),
        box(`lo${k}`, bx + bw + 6, y, b.slice(8), { w: bw, h, size: 13, tone }),
      );
    });
    const bxEnd = bx + 2 * bw + 6 + 8;
    const yEnd = (k: number) => y0 + k * step + h;
    const label = (id: string, a: number, b: number, l1: string, l2: string): SceneNode[] => [
      brace(`${id}:b`, a, b, bxEnd, 'right'),
      text(`${id}:1`, bxEnd + 22, (a + b) / 2 - 3, l1, { size: 13, bold: true }),
      text(`${id}:2`, bxEnd + 22, (a + b) / 2 + 14, l2, { size: 12, tone: 'muted' }),
    ];
    nodes.push(...label('en', y0, yEnd(4), ENC.en1[l], ENC.en2[l]), ...label('zh', y0 + 5 * step, yEnd(6), ENC.zh1[l], ENC.zh2[l]));
    return { scene: { w: 440, h: y0 + 6 * step + h + 8, nodes } };
  },
};

const UTF_SAY: Record<'unicode' | 'ascii' | 'cjk' | 'done', T> = {
  unicode: {
    en: 'Each character has a Unicode code point, shown here as 16 bits. Storing every character in 2 bytes wastes a zero byte on each English letter.',
    zh: '每个字符都有一个 Unicode 码点，这里写成 16 位。若每个字符都存成 2 字节，每个英文字母都会浪费一个全 0 的字节。',
    'zh-hant': '每個字元都有一個 Unicode 碼點，這裡寫成 16 位。若每個字元都存成 2 位元組，每個英文字母都會浪費一個全 0 的位元組。',
    ja: '各文字には Unicode コードポイントがあり、ここでは 16 ビットで示しています。すべての文字を 2 バイトで保存すると、英字ごとに 0 だけのバイトが無駄になります。',
    ru: 'У каждого символа есть кодовая точка Unicode, здесь записанная 16 битами. Если хранить каждый символ в 2 байтах, на каждую латинскую букву впустую уходит нулевой байт.',
  },
  ascii: {
    en: 'H, e, l, l, o are below 128, so each takes 1 byte: the highest bit is 0 and the other 7 bits are the code point. This is exactly ASCII, so UTF-8 is backward compatible with it.',
    zh: 'H、e、l、l、o 的码点都小于 128，各占 1 字节：最高位设为 0，其余 7 位就是码点。这与 ASCII 码完全相同，因此 UTF-8 可以向下兼容 ASCII 码。',
    'zh-hant': 'H、e、l、l、o 的碼點都小於 128，各佔 1 位元組：最高位設為 0，其餘 7 位就是碼點。這與 ASCII 碼完全相同，因此 UTF-8 可以向下相容 ASCII 碼。',
    ja: 'H、e、l、l、o のコードポイントは 128 未満なので、それぞれ 1 バイトです。最上位ビットを 0 にし、残りの 7 ビットがコードポイントです。これは ASCII コードと同じなので、UTF-8 は ASCII と下位互換性があります。',
    ru: 'Кодовые точки H, e, l, l, o меньше 128, поэтому каждая буква занимает 1 байт: старший бит равен 0, а остальные 7 битов — кодовая точка. Это в точности ASCII, поэтому UTF-8 обратно совместима с ASCII.',
  },
  cjk: {
    en: '算 and 法 need 3 bytes. The first byte starts with 1110: three 1s mean "3 bytes", and the 0 ends the count. Each following byte starts with 10. The 16 code-point bits fill the remaining 4 + 6 + 6 bits.',
    zh: '“算”和“法”需要 3 字节。首个字节以 1110 开头：3 个 1 表示长度为 3 字节，0 表示计数结束。后续每个字节都以 10 开头。码点的 16 位依次填入剩下的 4 + 6 + 6 位。',
    'zh-hant': '“算”和“法”需要 3 位元組。首個位元組以 1110 開頭：3 個 1 表示長度為 3 位元組，0 表示計數結束。後續每個位元組都以 10 開頭。碼點的 16 位依次填入剩下的 4 + 6 + 6 位。',
    ja: '算 と 法 は 3 バイト必要です。先頭バイトは 1110 で始まり、3 つの 1 が「3 バイト」を表し、0 で数え終わります。続く各バイトは 10 で始まります。コードポイントの 16 ビットが残りの 4 + 6 + 6 ビットに入ります。',
    ru: 'Для 算 и 法 нужно 3 байта. Первый байт начинается с 1110: три единицы означают «3 байта», а 0 завершает счёт. Каждый следующий байт начинается с 10. 16 битов кодовой точки заполняют оставшиеся 4 + 6 + 6 битов.',
  },
  done: {
    en: 'Hello算法 takes {u} bytes in UTF-8 instead of {f} with fixed 2-byte codes. Counting the leading 1s tells the system how long each character is.',
    zh: '“Hello算法”在 UTF-8 下占 {u} 字节，而固定 2 字节的编码需要 {f} 字节。系统通过数开头的 1 的个数就能知道每个字符的长度。',
    'zh-hant': '“Hello算法”在 UTF-8 下佔 {u} 位元組，而固定 2 位元組的編碼需要 {f} 位元組。系統透過數開頭的 1 的個數就能知道每個字元的長度。',
    ja: '「Hello算法」は UTF-8 では {u} バイトで、固定 2 バイトなら {f} バイト必要です。先頭の 1 の個数を数えれば、各文字の長さがわかります。',
    ru: '«Hello算法» занимает в UTF-8 {u} байт вместо {f} при фиксированных 2 байтах. По числу ведущих единиц система узнаёт длину каждого символа.',
  },
};

const utf8Hello: StepFigure = {
  type: 'steps',
  tones: { unicode: 'idle', ascii: 'cmp', cjk: 'swp', done: 'done' },
  build(l) {
    const W = 440;
    const H = 284;
    const ox = 27;
    const bw = 62;
    const h = 24;
    const y0 = 30;
    const step = 30;
    const ux = ox + 38;
    const vx = ux + 2 * (bw + 4) + 22;
    const data = HELLO.map((ch) => {
      const cp = codePoint(ch);
      return { ch, cp, bits: bits16(cp), bytes: utf8(cp) };
    });
    type Stage = 'unicode' | 'ascii' | 'cjk' | 'done';
    const order: Stage[] = ['unicode', 'ascii', 'cjk', 'done'];

    const scene = (stage: Stage): SceneNode[] => {
      const at = order.indexOf(stage);
      const nodes: SceneNode[] = [
        text('h:c', ox + 14, 20, ENC.char[l], { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        text('h:u', ux + bw + 2, 20, 'Unicode', { anchor: 'middle', size: 12, bold: true, tone: 'muted' }),
        text('h:8', vx + (3 * bw + 8) / 2, 20, 'UTF-8', { anchor: 'middle', size: 12, bold: true, tone: at > 0 ? 'accent' : 'muted' }),
      ];
      data.forEach((d, k) => {
        const y = y0 + k * step;
        const ascii = d.bytes.length === 1;
        const focus = stage === 'ascii' ? ascii : stage === 'cjk' ? !ascii : true;
        const hi = d.bits.slice(0, 8);
        nodes.push(
          box(`c${k}`, ox, y, d.ch, { w: 28, h, size: 14, sans: !ascii, dim: !focus }),
          box(`hi${k}`, ux, y, hi, { w: bw, h, size: 12, tone: hi === '00000000' ? 'muted' : 'idle', dim: !focus }),
          box(`lo${k}`, ux + bw + 4, y, d.bits.slice(8), { w: bw, h, size: 12, dim: !focus }),
        );
        const shown = ascii ? at >= 1 : at >= 2;
        if (!shown) return;
        d.bytes.forEach((b, i) => {
          // Leading bits: 0 for one byte; n ones and a 0 for the first of n bytes; 10 for the rest.
          const lead = ascii ? 1 : i === 0 ? d.bytes.length + 1 : 2;
          const tone: Tone = ascii ? 'ok' : i === 0 ? 'accent' : 'info';
          const s = bin8(b);
          nodes.push(
            box(`u${k}-${i}`, vx + i * (bw + 4), y, seg([s.slice(0, lead), tone, true], s.slice(lead)), {
              w: bw,
              h,
              size: 12,
              dim: !focus,
            }),
          );
        });
      });
      const ty = y0 + 7 * step + 8;
      const mid = W / 2;
      if (stage === 'ascii') nodes.push(chip('tpl', mid, ty, seg(['0', 'ok', true], 'xxxxxxx')));
      if (stage === 'cjk') nodes.push(chip('tpl', mid, ty, seg(['1110', 'accent', true], 'xxxx ', ['10', 'info', true], 'xxxxxx ', ['10', 'info', true], 'xxxxxx')));
      if (stage === 'done') {
        const u = data.reduce((s, d) => s + d.bytes.length, 0);
        nodes.push(chip('tpl', mid, ty, seg('UTF-8: ', [String(u), 'ok', true], ' B   ·   2 × 7 = ', [String(2 * data.length), 'muted', true], ' B')));
      }
      return nodes;
    };

    const u = data.reduce((s, d) => s + d.bytes.length, 0);
    const frames: SceneFrame[] = order.map((stage) => ({
      kind: stage,
      scene: { w: W, h: H, nodes: scene(stage) },
      say: fmt(UTF_SAY[stage][l], { u, f: 2 * data.length }),
    }));
    return { frames };
  },
};

// ── Sign-magnitude, 1's and 2's complement ────────────────────────────

const CODES: Record<'sm' | 'ones' | 'twos', T> = {
  sm: { en: 'Sign-magnitude', zh: '原码', 'zh-hant': '原碼', ja: '符号付き絶対値表現', ru: 'Прямой код' },
  ones: { en: "1's complement", zh: '反码', 'zh-hant': '一補數', ja: '1 の補数', ru: 'Обратный код' },
  twos: { en: "2's complement", zh: '补码', 'zh-hant': '二補數', ja: '2 の補数', ru: 'Дополнительный код' },
};

const COMP_SAY: Record<'sm' | 'ones' | 'twos' | 'done', T> = {
  sm: {
    en: 'Sign-magnitude: the highest bit is the sign bit (0 for positive, 1 for negative) and the other 7 bits hold the absolute value. +0 and −0 get two different codes.',
    zh: '原码：最高位是符号位（0 表示正数，1 表示负数），其余 7 位表示数值的绝对值。+0 和 −0 有两个不同的原码。',
    'zh-hant': '原碼：最高位是符號位（0 表示正數，1 表示負數），其餘 7 位表示數值的絕對值。+0 和 −0 有兩個不同的原碼。',
    ja: '符号付き絶対値表現：最上位ビットが符号ビット（0 は正、1 は負）で、残りの 7 ビットが絶対値を表します。+0 と −0 には異なる 2 つの表現があります。',
    ru: 'Прямой код: старший бит — знаковый (0 — положительное число, 1 — отрицательное), остальные 7 битов хранят модуль числа. У +0 и −0 получаются два разных кода.',
  },
  ones: {
    en: "1's complement: positive numbers stay the same. For a negative number, every bit except the sign bit is inverted (highlighted).",
    zh: '反码：正数不变；负数则对原码除符号位外的所有位取反（高亮的位）。',
    'zh-hant': '一補數：正數不變；負數則對原碼除符號位外的所有位取反（標示的位）。',
    ja: '1 の補数：正数はそのままです。負数は符号ビット以外のすべてのビットを反転します（強調したビット）。',
    ru: 'Обратный код: положительные числа не меняются. У отрицательного числа инвертируются все биты, кроме знакового (выделены).',
  },
  twos: {
    en: "2's complement: positive numbers stay the same; negative numbers add 1 to the 1's complement. For −0, 1111 1111 + 1 carries out of the 8 bits; the carry is dropped, leaving 0000 0000.",
    zh: '补码：正数不变；负数在反码的基础上加 1。对 −0 来说，1111 1111 + 1 会向第 9 位进位，超出的 1 被舍弃，结果为 0000 0000。',
    'zh-hant': '二補數：正數不變；負數在一補數的基礎上加 1。對 −0 來說，1111 1111 + 1 會向第 9 位進位，超出的 1 被捨棄，結果為 0000 0000。',
    ja: '2 の補数：正数はそのままで、負数は 1 の補数に 1 を加えます。−0 では 1111 1111 + 1 が 8 ビットからあふれ、その桁上がりは捨てられて 0000 0000 になります。',
    ru: 'Дополнительный код: положительные числа не меняются, а к обратному коду отрицательного числа прибавляется 1. Для −0 сумма 1111 1111 + 1 выходит за 8 битов; перенос отбрасывается, и остаётся 0000 0000.',
  },
  done: {
    en: "In 2's complement, +0 and −0 share the single code 0000 0000, so zero is no longer ambiguous.",
    zh: '在补码中，+0 和 −0 都是 0000 0000，正负零的歧义消失了。',
    'zh-hant': '在二補數中，+0 和 −0 都是 0000 0000，正負零的歧義消失了。',
    ja: '2 の補数では +0 と −0 がどちらも 0000 0000 になり、正負のゼロのあいまいさがなくなります。',
    ru: 'В дополнительном коде +0 и −0 имеют один и тот же код 0000 0000, поэтому неоднозначность нуля исчезает.',
  },
};

const complement: StepFigure = {
  type: 'steps',
  tones: { sm: 'idle', ones: 'swp', twos: 'cmp', done: 'done' },
  build(l) {
    const W = 440;
    const H = 246;
    const cw = 13;
    const cg = 1.5;
    const ch = 22;
    const colW = 8 * cw + 7 * cg + 3;
    const colGap = 16;
    const x0 = 46;
    const colX = (k: number) => x0 + k * (colW + colGap);
    const bitX = (k: number, i: number) => colX(k) + i * (cw + cg) + (i >= 4 ? 3 : 0);
    const rowY = (r: number) => 34 + r * 32 + (r >= 2 ? 8 : 0);

    const nums = [
      { label: '+0', v: 0, neg: false },
      { label: '+5', v: 5, neg: false },
      { label: '−0', v: 0, neg: true },
      { label: '−28', v: 28, neg: true },
    ].map((n) => {
      const sm = (n.neg ? 0x80 : 0) | n.v;
      const ones = n.neg ? sm ^ 0x7f : sm;
      const twos = n.neg ? (ones + 1) & 0xff : sm;
      return { ...n, codes: [sm, ones, twos] };
    });
    type Stage = 'sm' | 'ones' | 'twos' | 'done';
    const stages: Stage[] = ['sm', 'ones', 'twos', 'done'];
    const codeKeys = ['sm', 'ones', 'twos'] as const;
    const colTone: Tone[] = ['warn', 'info', 'accent'];

    const scene = (stage: Stage): SceneNode[] => {
      const at = stages.indexOf(stage);
      const nodes: SceneNode[] = [];
      for (let k = 0; k <= Math.min(at, 2); k++) {
        nodes.push(text(`h${k}`, colX(k) + colW / 2, 22, CODES[codeKeys[k]][l], { anchor: 'middle', size: 12, bold: true, tone: k === at ? colTone[k] : 'muted' }));
      }
      nums.forEach((n, r) => {
        const y = rowY(r);
        nodes.push(text(`r${r}`, 38, y + 16, n.label, { anchor: 'end', mono: true, bold: true, size: 13, tone: n.neg ? 'danger' : 'ok' }));
        for (let k = 0; k <= Math.min(at, 2); k++) {
          const code = n.codes[k];
          const prev = k > 0 ? n.codes[k - 1] : code;
          for (let i = 0; i < 8; i++) {
            const bit = (code >> (7 - i)) & 1;
            const changed = ((prev >> (7 - i)) & 1) !== bit;
            let tone: Tone = 'idle';
            if (k === at) {
              if (k === 0 && i === 0) tone = 'warn';
              else if (k > 0 && changed) tone = colTone[k];
            }
            if (stage === 'done' && k === 2 && n.v === 0) tone = 'ok';
            nodes.push(box(`b${r}-${k}-${i}`, bitX(k, i), y, String(bit), { w: cw, h: ch, size: 11, tone }));
          }
        }
      });

      // Worked conversions for the negative numbers.
      const m28 = nums[3].codes;
      const m0 = nums[2].codes;
      const changed = (a: number, b: number) => a ^ b;
      let c1: Segment[];
      let c2: Segment[];
      if (stage === 'sm') {
        c1 = [{ t: '+28 = ' }, ...byteSeg(28)];
        c2 = [{ t: '−28 = ' }, ...byteSeg(m28[0], 0x80, 'warn')];
      } else if (stage === 'ones') {
        c1 = [{ t: '−28: ' }, ...byteSeg(m28[0]), { t: ' → ' }, ...byteSeg(m28[1], changed(m28[0], m28[1]), 'info')];
        c2 = [{ t: '−0: ' }, ...byteSeg(m0[0]), { t: ' → ' }, ...byteSeg(m0[1], changed(m0[0], m0[1]), 'info')];
      } else if (stage === 'twos') {
        c1 = [{ t: '−28: ' }, ...byteSeg(m28[1]), { t: ' + 1 = ' }, ...byteSeg(m28[2], changed(m28[1], m28[2]), 'accent')];
        c2 = [{ t: '−0: ' }, ...byteSeg(m0[1]), { t: ' + 1 = ' }, { t: (m0[1] + 1 > 0xff ? '1' : ''), tone: 'danger', bold: true }, { t: ' ' }, ...byteSeg(m0[2], 0xff, 'accent')];
      } else {
        c1 = [{ t: '+0 = −0 = ' }, ...byteSeg(m0[2], 0xff, 'ok')];
        c2 = [{ t: '−28 = ' }, ...byteSeg(m28[2])];
      }
      nodes.push(chip('c1', W / 2, 178, c1), chip('c2', W / 2, 212, c2));
      return nodes;
    };

    const frames: SceneFrame[] = stages.map((stage) => ({ kind: stage, scene: { w: W, h: H, nodes: scene(stage) }, say: COMP_SAY[stage][l] }));
    return { frames };
  },
};

// ── IEEE 754 float ────────────────────────────────────────────────────

const FLOAT: Record<'size' | 'sign' | 'exp' | 'frac', T> = {
  size: { en: 'float: 4 bytes = 32 bits', zh: 'float：4 字节 = 32 比特', 'zh-hant': 'float：4 位元組 = 32 位元', ja: 'float：4 バイト = 32 ビット', ru: 'float: 4 байта = 32 бита' },
  sign: { en: 'Sign bit S', zh: '符号位 S', 'zh-hant': '符號位 S', ja: '符号部 S', ru: 'Бит знака S' },
  exp: { en: 'Exponent bits E', zh: '指数位 E', 'zh-hant': '指數位 E', ja: '指数部 E', ru: 'Биты экспоненты E' },
  frac: { en: 'Fraction bits N', zh: '分数位 N', 'zh-hant': '分數位 N', ja: '仮数部 N', ru: 'Биты мантиссы N' },
};

const FLOAT_SAY: Record<'bits' | 'sign' | 'exp' | 'frac' | 'value', T> = {
  bits: {
    en: 'The float value {x} in memory: 4 bytes = 32 bits, from b31 on the left to b0 on the right.',
    zh: 'float 类型的 {x} 在内存中占 4 字节 = 32 比特，从左到右依次为 b31 到 b0。',
    'zh-hant': 'float 型別的 {x} 在記憶體中佔 4 位元組 = 32 位元，從左到右依次為 b31 到 b0。',
    ja: 'float 型の {x} はメモリ上で 4 バイト = 32 ビットを占め、左から順に b31 〜 b0 です。',
    ru: 'Значение {x} типа float занимает в памяти 4 байта = 32 бита: слева направо от b31 до b0.',
  },
  sign: {
    en: 'Sign bit S = b31 = {s}. The factor (−1)^S = {f}, so the number is positive.',
    zh: '符号位 S = b31 = {s}，(−1)^S = {f}，所以这是一个正数。',
    'zh-hant': '符號位 S = b31 = {s}，(−1)^S = {f}，所以這是一個正數。',
    ja: '符号部 S = b31 = {s}。(−1)^S = {f} なので、この数は正です。',
    ru: 'Бит знака S = b31 = {s}. Множитель (−1)^S = {f}, значит, число положительное.',
  },
  exp: {
    en: 'Exponent bits E = b30…b23 = {bits} = {e}. The exponent is stored with an offset of 127, so the factor is 2^(E − 127) = {p} = {v}.',
    zh: '指数位 E = b30…b23 = {bits} = {e}。指数存储时加了偏移量 127，因此因子为 2^(E − 127) = {p} = {v}。',
    'zh-hant': '指數位 E = b30…b23 = {bits} = {e}。指數儲存時加了偏移量 127，因此因子為 2^(E − 127) = {p} = {v}。',
    ja: '指数部 E = b30…b23 = {bits} = {e}。指数は 127 だけずらして格納されるので、係数は 2^(E − 127) = {p} = {v} です。',
    ru: 'Биты экспоненты E = b30…b23 = {bits} = {e}. Экспонента хранится со смещением 127, поэтому множитель равен 2^(E − 127) = {p} = {v}.',
  },
  frac: {
    en: 'Fraction bits N = b22…b0. Bit b22 is worth 2⁻¹, b21 is worth 2⁻², and so on. Here {list} are 1, so N = {sum} = {n}.',
    zh: '分数位 N = b22…b0。b22 表示 2⁻¹，b21 表示 2⁻²，依此类推。这里 {list} 为 1，所以 N = {sum} = {n}。',
    'zh-hant': '分數位 N = b22…b0。b22 表示 2⁻¹，b21 表示 2⁻²，依此類推。這裡 {list} 為 1，所以 N = {sum} = {n}。',
    ja: '仮数部 N = b22…b0。b22 は 2⁻¹、b21 は 2⁻² を表し、以下同様です。ここでは {list} が 1 なので、N = {sum} = {n} です。',
    ru: 'Биты мантиссы N = b22…b0. Бит b22 весит 2⁻¹, b21 — 2⁻² и так далее. Здесь единицы стоят в {list}, поэтому N = {sum} = {n}.',
  },
  value: {
    en: 'Put together by the IEEE 754 rule: val = (−1)^S × 2^(E − 127) × (1 + N) = {f} × {p} × {m} = {v}.',
    zh: '按照 IEEE 754 标准组合起来：val = (−1)^S × 2^(E − 127) × (1 + N) = {f} × {p} × {m} = {v}。',
    'zh-hant': '按照 IEEE 754 標準組合起來：val = (−1)^S × 2^(E − 127) × (1 + N) = {f} × {p} × {m} = {v}。',
    ja: 'IEEE 754 の規則でまとめると、val = (−1)^S × 2^(E − 127) × (1 + N) = {f} × {p} × {m} = {v} です。',
    ru: 'Собираем по стандарту IEEE 754: val = (−1)^S × 2^(E − 127) × (1 + N) = {f} × {p} × {m} = {v}.',
  },
};

const ieee754: StepFigure = {
  type: 'steps',
  tones: { bits: 'idle', sign: 'cmp', exp: 'cmp', frac: 'cmp', value: 'done' },
  build(l) {
    const W = 460;
    const H = 196;
    const X = 0.171875;
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, X);
    const word = view.getUint32(0);
    const bits = word.toString(2).padStart(32, '0');
    const S = word >>> 31;
    const E = (word >>> 23) & 0xff;
    const frac = word & 0x7fffff;
    const N = frac / 2 ** 23;
    const factor = (-1) ** S;
    const pow = 2 ** (E - 127);
    const value = factor * pow * (1 + N);
    const fracOnes = [...bits.slice(9)].flatMap((b, k) => (b === '1' ? [k + 1] : []));
    const sumText = fracOnes.map((k) => `2${sup(-k)}`).join(' + ');

    const cw = 12;
    const step = 13.5;
    const total = 32 * cw + 31 * (step - cw) + 4;
    const x0 = (W - total) / 2;
    const bx = (i: number) => x0 + i * step + (i >= 1 ? 2 : 0) + (i >= 9 ? 2 : 0);
    const by = 80;
    const field = (i: number) => (i === 0 ? 'sign' : i <= 8 ? 'exp' : 'frac');
    const fieldTone = { sign: 'warn', exp: 'info', frac: 'ok' } as const;

    type Stage = 'bits' | 'sign' | 'exp' | 'frac' | 'value';
    const stages: Stage[] = ['bits', 'sign', 'exp', 'frac', 'value'];
    const fields = ['sign', 'exp', 'frac'] as const;

    const scene = (stage: Stage): SceneNode[] => {
      const at = stages.indexOf(stage);
      const shown = (f: (typeof fields)[number]) => at === 4 || fields.indexOf(f) + 1 <= at;
      const dim = (f: (typeof fields)[number]) => at < 4 && fields.indexOf(f) + 1 < at;
      const nodes: SceneNode[] = [
        text('size', W / 2, 16, FLOAT.size[l], { anchor: 'middle', size: 12, tone: 'muted' }),
        brace('size:b', bx(0), bx(31) + cw, 40, 'up'),
      ];
      for (let i = 0; i < 32; i++) {
        const f = field(i);
        nodes.push(
          box(`b${i}`, bx(i), by, bits[i], {
            w: cw,
            h: 20,
            size: 11,
            tone: shown(f) ? fieldTone[f] : 'idle',
            dim: dim(f),
            // The fraction bits that are 1 add 2^-k each.
            ring: stage === 'frac' && i >= 9 && bits[i] === '1',
          }),
        );
      }
      // Bit numbers under the field boundaries.
      const idx = (id: string, i: number, label: string, anchor: 'start' | 'middle' | 'end') => {
        const x = anchor === 'start' ? bx(i) : anchor === 'end' ? bx(i) + cw : bx(i) + cw / 2;
        return text(id, x, by + 34, label, { anchor, mono: true, size: 11, tone: 'muted' });
      };
      nodes.push(idx('i31', 0, 'b31', 'end'), idx('i30', 1, 'b30', 'start'), idx('i23', 8, 'b23', 'end'), idx('i22', 9, 'b22', 'start'), idx('i0', 31, 'b0', 'end'));

      if (shown('sign')) nodes.push(text('f:s', bx(0) + cw / 2, 70, 'S', { anchor: 'middle', size: 13, bold: true, tone: 'warn', dim: dim('sign') }));
      if (shown('exp')) {
        nodes.push(
          { ...brace('f:e:b', bx(1), bx(8) + cw, 76, 'up', 'info'), dim: dim('exp') },
          text('f:e', (bx(1) + bx(8) + cw) / 2, 54, FLOAT.exp[l], { anchor: 'middle', size: 12, bold: true, tone: 'info', dim: dim('exp') }),
        );
      }
      if (shown('frac')) {
        nodes.push(
          { ...brace('f:n:b', bx(9), bx(31) + cw, 76, 'up', 'ok'), dim: dim('frac') },
          text('f:n', (bx(9) + bx(31) + cw) / 2, 54, FLOAT.frac[l], { anchor: 'middle', size: 12, bold: true, tone: 'ok', dim: dim('frac') }),
        );
      }

      nodes.push(text('rule', W / 2, 146, 'val = (−1)^S × 2^(E − 127) × (1 + N)', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
      let c: Segment[];
      if (stage === 'bits') c = seg(String(X), ' = ', [`0x${word.toString(16).toUpperCase().padStart(8, '0')}`, 'accent', true]);
      else if (stage === 'sign') c = seg('S = ', [String(S), 'warn', true], ' → (−1)', sup(S), ' = ', [String(factor), 'warn', true]);
      else if (stage === 'exp') c = seg('E = ', [bits.slice(1, 9), 'info'], ' = ', [String(E), 'info', true], ' → 2', sup(E - 127), ' = ', [String(pow), 'info', true]);
      else if (stage === 'frac') c = seg('N = ', sumText, ' = ', [String(N), 'ok', true]);
      else c = seg([String(factor), 'warn'], ' × ', [String(pow), 'info'], ' × ', [String(1 + N), 'ok'], ' = ', [String(value), 'accent', true]);
      nodes.push(chip('calc', W / 2, 158, c));
      return nodes;
    };

    const vars = {
      x: X,
      s: S,
      f: factor,
      bits: bits.slice(1, 9),
      e: E,
      p: `2${sup(E - 127)}`,
      v: pow,
      list: fracOnes.map((k) => `b${22 - k + 1}`).join(', '),
      sum: sumText,
      n: N,
      m: 1 + N,
    };
    const frames: SceneFrame[] = stages.map((stage) => ({
      kind: stage,
      scene: { w: W, h: H, nodes: scene(stage) },
      say: fmt(FLOAT_SAY[stage][l], stage === 'value' ? { ...vars, v: value, p: pow } : vars),
    }));
    return {
      frames,
      legend: [
        { tone: 'warn', text: FLOAT.sign[l] },
        { tone: 'info', text: FLOAT.exp[l] },
        { tone: 'ok', text: FLOAT.frac[l] },
      ],
    };
  },
};

const FIGURES: Record<string, Figure> = {
  classification_logic_structure: classificationLogic,
  classification_phisical_structure: classificationPhysical,
  computer_memory_location: memoryLocation,
  ascii_table: asciiTable,
  unicode_hello_algo: unicodeHello,
  'utf-8_hello_algo': utf8Hello,
  '1s_2s_complement': complement,
  ieee_754_float: ieee754,
};

export default FIGURES;
