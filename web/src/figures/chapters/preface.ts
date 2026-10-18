import { arrow, box, region, text, textWidth } from '../kit';
import type { Figure, SceneFrame, SceneNode, StepFigure, Tone } from '../scene';
import { fmt, type T } from './shared';

const W = 460;

/** Splits text into lines no wider than `max` (CJK may break between any two characters). */
function wrap(value: string, max: number, size: number): string[] {
  const tokens = value.match(/[⺀-鿿＀-￯　-〿]|[^\s⺀-鿿＀-￯　-〿]+\s*/g) ?? [value];
  const lines: string[] = [];
  let line = '';
  for (const t of tokens) {
    if (line && textWidth(line + t, size) > max) {
      lines.push(line.trimEnd());
      line = t.trimStart();
    } else line += t;
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

// ── The book's mind map ───────────────────────────────────────────────

interface Chapter {
  id: string;
  name: T;
  topics: T[];
}

interface Part {
  id: string;
  name: T;
  tone: Tone;
  chapters: Chapter[];
}

const t = (en: string, zh: string, zhHant: string, ja: string, ru: string): T => ({ en, zh, 'zh-hant': zhHant, ja, ru });

const ESTIMATE = t('how to estimate, common types', '推算方法、常见类型', '推算方法、常見型別', '見積もり方と代表的な種類', 'как оценивать, типичные классы');

const PARTS: Part[] = [
  {
    id: 'complexity',
    name: t('Complexity analysis', '复杂度分析', '複雜度分析', '計算量の分析', 'Анализ сложности'),
    tone: 'info',
    chapters: [
      {
        id: 'iteration',
        name: t('Iteration and recursion', '迭代与递归', '迭代與遞迴', '反復と再帰', 'Итерация и рекурсия'),
        topics: [
          t('for, while and nested loops', 'for 循环、while 循环、嵌套循环', 'for 迴圈、while 迴圈、巢狀迴圈', 'for ループ、while ループ、ネストしたループ', 'циклы for, while и вложенные циклы'),
          t('call stack, tail recursion, recursion tree', '调用栈、尾递归、递归树', '呼叫堆疊、尾遞迴、遞迴樹', 'コールスタック、末尾再帰、再帰木', 'стек вызовов, хвостовая рекурсия, дерево рекурсии'),
          t('iteration vs recursion', '迭代与递归的对比', '迭代與遞迴的對比', '反復と再帰の比較', 'сравнение итерации и рекурсии'),
        ],
      },
      {
        id: 'time',
        name: t('Time complexity', '时间复杂度', '時間複雜度', '時間計算量', 'Временная сложность'),
        topics: [
          t('asymptotic upper bound', '渐近上界', '漸近上界', '漸近的上界', 'асимптотическая верхняя граница'),
          ESTIMATE,
          t('worst, best and average case', '最差、最佳、平均时间复杂度', '最差、最佳、平均時間複雜度', '最悪・最良・平均の計算量', 'худший, лучший и средний случай'),
        ],
      },
      {
        id: 'space',
        name: t('Space complexity', '空间复杂度', '空間複雜度', '空間計算量', 'Пространственная сложность'),
        topics: [ESTIMATE, t('balancing time and space', '权衡时间与空间', '權衡時間與空間', '時間と空間のトレードオフ', 'баланс времени и памяти')],
      },
    ],
  },
  {
    id: 'structures',
    name: t('Data structures', '数据结构', '資料結構', 'データ構造', 'Структуры данных'),
    tone: 'ok',
    chapters: [
      {
        id: 'ds',
        name: t('Data structures', '数据结构', '資料結構', 'データ構造', 'Структуры данных'),
        topics: [
          t('logical and physical structure', '逻辑结构与物理结构', '邏輯結構與物理結構', '論理構造と物理構造', 'логическая и физическая структура'),
          t('basic data types', '基本数据类型', '基本資料型別', '基本データ型', 'базовые типы данных'),
          t('number and character encoding', '数字编码、字符编码', '數字編碼、字元編碼', '数値の符号化、文字コード', 'кодирование чисел и символов'),
        ],
      },
      {
        id: 'array',
        name: t('Arrays and linked lists', '数组与链表', '陣列與鏈結串列', '配列と連結リスト', 'Массивы и связные списки'),
        topics: [
          t('contiguous vs scattered storage', '连续存储与分散存储', '連續儲存與分散儲存', '連続領域と分散領域', 'непрерывное и разрозненное хранение'),
          t('operations, pros and cons', '常用操作、优点与局限', '常用操作、優點與侷限', '基本操作と長所・短所', 'операции, плюсы и минусы'),
          t('lists built on dynamic arrays', '基于动态数组实现列表', '基於動態陣列實現串列', '動的配列によるリストの実装', 'список на динамическом массиве'),
          t('memory and cache', '内存与缓存', '記憶體與快取', 'メモリとキャッシュ', 'память и кэш'),
        ],
      },
      {
        id: 'stack',
        name: t('Stacks and queues', '栈与队列', '堆疊與佇列', 'スタックとキュー', 'Стеки и очереди'),
        topics: [
          t('LIFO, FIFO, double-ended queue', '先入后出、先入先出、双向队列', '先入後出、先入先出、雙向佇列', 'LIFO・FIFO・両端キュー', 'LIFO, FIFO, дек'),
          t('built on arrays and on linked lists', '基于数组与链表的实现', '基於陣列與鏈結串列的實現', '配列と連結リストによる実装', 'реализация на массиве и на списке'),
        ],
      },
      {
        id: 'hash',
        name: t('Hash tables', '哈希表', '雜湊表', 'ハッシュテーブル', 'Хеш-таблицы'),
        topics: [
          t('principles, built on an array', '原理、基于数组的实现', '原理、基於陣列的實現', '仕組みと配列による実装', 'устройство и реализация на массиве'),
          t('collisions: chaining, open addressing', '哈希冲突：链式地址、开放寻址', '雜湊衝突：鏈結位址、開放定址', '衝突：チェイン法、オープンアドレス法', 'коллизии: цепочки, открытая адресация'),
          t('hash algorithms and their design goals', '哈希算法的应用与设计目标', '雜湊演算法的應用與設計目標', 'ハッシュアルゴリズムの用途と設計目標', 'хеш-алгоритмы: применение и цели'),
        ],
      },
      {
        id: 'tree',
        name: t('Trees', '树', '樹', '木', 'Деревья'),
        topics: [
          t('perfect, complete, full and balanced binary trees', '完美、完全、完满、平衡二叉树', '完美、完全、完滿、平衡二元樹', '完全・完備・満・平衡二分木', 'идеальное, полное, строгое и сбалансированное двоичное дерево'),
          t('linked vs array representation', '链表表示与数组表示', '鏈結串列表示與陣列表示', '連結表現と配列表現', 'ссылочное и массивное представление'),
          t('level, pre-, in- and post-order traversal', '层序、前序、中序、后序遍历', '層序、前序、中序、後序走訪', 'レベル順・前順・中順・後順の走査', 'обход по уровням, прямой, симметричный, обратный'),
          t('binary search trees', '二叉搜索树', '二元搜尋樹', '二分探索木', 'двоичные деревья поиска'),
          t('AVL trees', 'AVL 树', 'AVL 樹', 'AVL 木', 'АВЛ-деревья'),
        ],
      },
      {
        id: 'heap',
        name: t('Heaps', '堆', '堆積', 'ヒープ', 'Кучи'),
        topics: [
          t('min-heap, max-heap, priority queue', '小顶堆、大顶堆、优先队列', '小頂堆積、大頂堆積、優先佇列', '最小ヒープ・最大ヒープ・優先度付きキュー', 'min-куча, max-куча, очередь с приоритетом'),
          t('built on an array, building a heap', '基于数组的实现、建堆', '基於陣列的實現、建堆積', '配列による実装とヒープ構築', 'реализация на массиве, построение кучи'),
          t('the top-k problem', 'Top-k 问题', 'Top-k 問題', 'Top-k 問題', 'задача top-k'),
        ],
      },
      {
        id: 'graph',
        name: t('Graphs', '图', '圖', 'グラフ', 'Графы'),
        topics: [
          t('directed, connected and weighted graphs', '有向图、连通图、有权图', '有向圖、連通圖、有權圖', '有向・連結・重み付きグラフ', 'ориентированные, связные и взвешенные графы'),
          t('adjacency list vs adjacency matrix', '邻接表与邻接矩阵', '鄰接表與鄰接矩陣', '隣接リストと隣接行列', 'список и матрица смежности'),
          t('breadth-first and depth-first traversal', '广度优先遍历、深度优先遍历', '廣度優先走訪、深度優先走訪', '幅優先探索と深さ優先探索', 'обход в ширину и в глубину'),
        ],
      },
    ],
  },
  {
    id: 'algorithms',
    name: t('Algorithms', '算法', '演算法', 'アルゴリズム', 'Алгоритмы'),
    tone: 'accent',
    chapters: [
      {
        id: 'search',
        name: t('Searching', '搜索', '搜尋', '探索', 'Поиск'),
        topics: [
          t('brute force: linear search, BFS and DFS', '暴力搜索：线性查找、广度与深度优先', '暴力搜尋：線性查詢、廣度與深度優先', '総当たり：線形探索、BFS と DFS', 'перебор: линейный поиск, BFS и DFS'),
          t('faster: binary, hash and tree search', '高效搜索：二分查找、哈希查找、树查找', '高效搜尋：二分搜尋、雜湊搜尋、樹搜尋', '効率的：二分・ハッシュ・木による探索', 'быстрые: двоичный, хеш- и древесный поиск'),
          t('choosing a search method', '搜索方法选取', '搜尋方法選取', '探索手法の選び方', 'выбор метода поиска'),
        ],
      },
      {
        id: 'sort',
        name: t('Sorting', '排序', '排序', 'ソート', 'Сортировка'),
        topics: [
          t('in-place, stable, adaptive, comparison-based', '原地、稳定、自适应、基于比较', '原地、穩定、自適應、基於比較', 'インプレース・安定・適応的・比較ベース', 'на месте, устойчивость, адаптивность, сравнения'),
          t('selection, bubble and insertion sort', '选择、冒泡、插入排序', '選擇、泡沫、插入排序', '選択・バブル・挿入ソート', 'выбором, пузырьком, вставками'),
          t('quick, merge and heap sort', '快速、归并、堆排序', '快速、合併、堆積排序', 'クイック・マージ・ヒープソート', 'быстрая, слиянием, пирамидальная'),
          t('bucket, counting and radix sort', '桶、计数、基数排序', '桶、計數、基數排序', 'バケット・計数・基数ソート', 'блочная, подсчётом, поразрядная'),
        ],
      },
      {
        id: 'divide',
        name: t('Divide and conquer', '分治', '分治', '分割統治', 'Разделяй и властвуй'),
        topics: [
          t('features, recognizing the problems', '特点与问题识别', '特點與問題識別', '特徴と問題の見分け方', 'признаки и распознавание задач'),
          t('binary search, building a tree, Tower of Hanoi', '二分查找、构建树、汉诺塔', '二分搜尋、構建樹、河內塔', '二分探索・木の構築・ハノイの塔', 'двоичный поиск, построение дерева, Ханойская башня'),
        ],
      },
      {
        id: 'backtrack',
        name: t('Backtracking', '回溯', '回溯', 'バックトラッキング', 'Поиск с возвратом'),
        topics: [
          t('features and code template', '特点与代码框架', '特點與程式碼框架', '特徴とコードの型', 'особенности и шаблон кода'),
          t('permutations, subset sum, n-queens', '全排列、子集和、N 皇后', '全排列、子集和、N 皇后', '順列・部分和・N クイーン', 'перестановки, сумма подмножеств, n ферзей'),
        ],
      },
      {
        id: 'dp',
        name: t('Dynamic programming', '动态规划', '動態規劃', '動的計画法', 'Динамическое программирование'),
        topics: [
          t('brute force, memoization, iteration', '暴力搜索、记忆化搜索、递推', '暴力搜尋、記憶化搜尋、遞推', '総当たり・メモ化・反復', 'перебор, мемоизация, итерация'),
          t('overlapping subproblems, optimal substructure, no aftereffects', '重叠子问题、最优子结构、无后效性', '重疊子問題、最佳子結構、無後效性', '重複部分問題・最適部分構造・無後効性', 'перекрывающиеся подзадачи, оптимальная подструктура, отсутствие последействия'),
          t('recognizing the problems, solution steps', '问题判断与解题步骤', '問題判斷與解題步驟', '問題の判断と解き方の手順', 'распознавание задач и шаги решения'),
          t('0-1 knapsack, unbounded knapsack, edit distance', '0-1 背包、完全背包、编辑距离', '0-1 背包、完全背包、編輯距離', '0-1 ナップサック・完全ナップサック・編集距離', 'рюкзак 0-1, неограниченный рюкзак, редакционное расстояние'),
        ],
      },
      {
        id: 'greedy',
        name: t('Greedy', '贪心', '貪婪', '貪欲法', 'Жадные алгоритмы'),
        topics: [
          t('features and solution steps', '特点与解题步骤', '特點與解題步驟', '特徴と解き方の手順', 'особенности и шаги решения'),
          t('fractional knapsack, max capacity, max product cutting', '分数背包、最大容量、最大切分乘积', '分數背包、最大容量、最大切分乘積', '分数ナップサック・最大容量・最大切断積', 'дробный рюкзак, максимальная ёмкость, максимальное произведение'),
        ],
      },
    ],
  },
];

/** Steps of the walk through the map: which chapters to open together. */
const FOCUS: string[][] = [['iteration', 'time', 'space'], ['ds', 'array', 'stack'], ['hash', 'tree'], ['heap', 'graph'], ['search', 'sort'], ['divide', 'backtrack', 'dp'], ['greedy']];

const MAP_SAY: Record<'overview' | 'focus', T> = {
  overview: {
    en: 'The book in three parts: complexity analysis, data structures and algorithms, 16 chapters in all. Step through to open each group of chapters.',
    zh: '本书分为三部分：复杂度分析、数据结构和算法，共 16 章。逐步查看，依次展开各章。',
    'zh-hant': '本書分為三部分：複雜度分析、資料結構和演算法，共 16 章。逐步查看，依次展開各章。',
    ja: '本書は計算量の分析、データ構造、アルゴリズムの 3 部構成、全 16 章です。ステップを進めると各章が開きます。',
    ru: 'Книга состоит из трёх частей — анализ сложности, структуры данных и алгоритмы, всего 16 глав. Шагайте вперёд, чтобы раскрыть главы.',
  },
  focus: { en: '{part}: {chapters}.', zh: '{part}：{chapters}。', 'zh-hant': '{part}：{chapters}。', ja: '{part}：{chapters}。', ru: '{part}: {chapters}.' },
};

const mindMap: StepFigure = {
  type: 'steps',
  tones: { overview: 'idle', focus: 'cmp' },
  build(l) {
    const H = 392;
    const all = PARTS.flatMap((p) => p.chapters.map((c) => ({ part: p, chapter: c })));
    const rowY = (k: number) => 12 + k * 23.5;
    const chW = 190;
    // Long chapter names (Russian) get a smaller face so they stay inside their box.
    const nameSize = (name: string) => (name.length > 22 ? 10 : 11);
    const sep = l === 'zh' || l === 'zh-hant' || l === 'ja' ? '、' : ', ';

    const overview = (): SceneNode[] => {
      const nodes: SceneNode[] = [box('root', 4, H / 2 - 18, 'hello algo', { w: 84, h: 36, sans: true, size: 13, tone: 'accent', ring: true })];
      let k = 0;
      for (const p of PARTS) {
        const first = k;
        const last = k + p.chapters.length - 1;
        const cy = (rowY(first) + rowY(last)) / 2 + 11;
        nodes.push(
          box(`p:${p.id}`, 100, cy - 16, p.name[l], { w: 134, h: 32, sans: true, size: 12, tone: p.tone }),
          arrow(`e:${p.id}`, [89, H / 2], [99, cy], { head: 'none', bend: (cy - H / 2) / 8, tone: p.tone }),
        );
        for (const c of p.chapters) {
          const y = rowY(k++);
          nodes.push(
            box(`c:${c.id}`, 262, y, c.name[l], { w: chW, h: 21, sans: true, size: nameSize(c.name[l]), tone: p.tone }),
            arrow(`e:${c.id}`, [235, cy], [261, y + 11], { head: 'none', bend: (y + 11 - cy) / 10, tone: p.tone, width: 1.25 }),
          );
        }
      }
      return nodes;
    };

    const focus = (ids: string[]): SceneNode[] => {
      const items = all.filter((x) => ids.includes(x.chapter.id));
      const part = items[0].part;
      const nodes: SceneNode[] = [box(`p:${part.id}`, 4, 6, part.name[l], { w: 150, h: 30, sans: true, size: 12, tone: part.tone, ring: true })];
      let y = 50;
      for (const { chapter } of items) {
        const lines = chapter.topics.flatMap((tp, j) => wrap(`• ${tp[l]}`, W - 236, 12).map((line, n) => ({ line, j, n })));
        const blockH = Math.max(24, lines.length * 17 + 4);
        nodes.push(region(`r:${chapter.id}`, 0, y - 6, W, blockH + 12, { tone: part.tone }));
        nodes.push(box(`c:${chapter.id}`, 8, y + (blockH - 24) / 2, chapter.name[l], { w: chW, h: 24, sans: true, size: nameSize(chapter.name[l]), tone: part.tone }));
        lines.forEach(({ line, j, n }, k) => nodes.push(text(`t:${chapter.id}:${j}:${n}`, 208, y + 13 + k * 17, n ? `  ${line}` : line, { size: 12 })));
        y += blockH + 18;
      }
      return nodes;
    };

    const frames: SceneFrame[] = [{ kind: 'overview', scene: { w: W, h: H, nodes: overview() }, say: MAP_SAY.overview[l] }];
    for (const ids of FOCUS) {
      const items = all.filter((x) => ids.includes(x.chapter.id));
      frames.push({
        kind: 'focus',
        scene: { w: W, h: H, nodes: focus(ids) },
        say: fmt(MAP_SAY.focus[l], { part: items[0].part.name[l], chapters: items.map((x) => x.chapter.name[l]).join(sep) }),
      });
    }
    return { frames };
  },
};

// ── Learning route ────────────────────────────────────────────────────

const ROUTE: Record<'s1' | 's2' | 's3' | 'basic' | 'practice' | 'system' | 'course' | 'problems' | 'frameworks' | 'review' | 'reviewText' | 'summary' | 'summaryText', T> = {
  s1: t('Stage 1', '阶段一', '階段一', 'ステージ 1', 'Этап 1'),
  s2: t('Stage 2', '阶段二', '階段二', 'ステージ 2', 'Этап 2'),
  s3: t('Stage 3', '阶段三', '階段三', 'ステージ 3', 'Этап 3'),
  basic: t('getting started', '算法入门', '演算法入門', '入門', 'знакомство'),
  practice: t('practice', '刷算法题', '刷演算法題', '問題演習', 'практика'),
  system: t('building a system', '搭建知识体系', '搭建知識體系', '知識の体系化', 'система знаний'),
  course: t('An algorithms crash course', '算法入门教程', '演算法入門教程', 'アルゴリズム入門書', 'Вводный курс алгоритмов'),
  problems: t('Algorithm problems', '算法题', '演算法題', 'アルゴリズムの問題', 'Задачи на алгоритмы'),
  frameworks: t('Problem-solving frameworks, algorithm books', '解题框架、算法书籍', '解題框架、演算法書籍', '解法の型、アルゴリズムの本', 'Шаблоны решений, книги по алгоритмам'),
  review: t('Review regularly', '定期复习', '定期複習', '定期的な復習', 'Регулярно повторяйте'),
  reviewText: t('Revisit solved problems to make them stick.', '隔一段时间重做做过的题，形成长期记忆。', '隔一段時間重做做過的題，形成長期記憶。', '解いた問題を時々解き直して記憶を定着させる。', 'Возвращайтесь к решённым задачам, чтобы запомнить надолго.'),
  summary: t('Summarize actively', '主动总结', '主動總結', '自分でまとめる', 'Обобщайте сами'),
  summaryText: t('Organize key points and look for patterns.', '梳理知识要点，归纳解题套路。', '梳理知識要點，歸納解題套路。', '要点を整理し、解法のパターンを見つける。', 'Сводите ключевые идеи и ищите закономерности.'),
};

const ROUTE_SAY: Record<'s1' | 's2' | 'review' | 's3' | 'summary', T> = {
  s1: {
    en: 'Stage 1: learn the basic data structures and algorithms from an introductory book like this one.',
    zh: '阶段一：通过本书这样的入门教程，学习基础的数据结构与算法。',
    'zh-hant': '階段一：透過本書這樣的入門教程，學習基礎的資料結構與演算法。',
    ja: 'ステージ 1：本書のような入門書で、基本的なデータ構造とアルゴリズムを学びます。',
    ru: 'Этап 1: изучите базовые структуры данных и алгоритмы по вводной книге вроде этой.',
  },
  s2: {
    en: 'Stage 2: practice on algorithm problems, starting with popular ones.',
    zh: '阶段二：刷算法题，建议从热门题目开始。',
    'zh-hant': '階段二：刷演算法題，建議從熱門題目開始。',
    ja: 'ステージ 2：人気の問題から始めて、アルゴリズムの問題を解きます。',
    ru: 'Этап 2: решайте задачи на алгоритмы, начиная с популярных.',
  },
  review: {
    en: 'Forgetting is normal at first. Revisit problems periodically and they turn into long-term memory.',
    zh: '刚开始容易忘记是正常的。定期复习做过的题，就能形成长期记忆。',
    'zh-hant': '剛開始容易忘記是正常的。定期複習做過的題，就能形成長期記憶。',
    ja: '最初は忘れるのが普通です。定期的に解き直せば、長期記憶になります。',
    ru: 'Поначалу забывать нормально. Возвращайтесь к задачам регулярно — так они закрепятся надолго.',
  },
  s3: {
    en: 'Stage 3: build a system — learn problem-solving frameworks and read algorithm books, going back and forth with practice.',
    zh: '阶段三：搭建知识体系——学习解题框架、阅读算法书籍，并与刷题交替进行。',
    'zh-hant': '階段三：搭建知識體系——學習解題框架、閱讀演算法書籍，並與刷題交替進行。',
    ja: 'ステージ 3：知識を体系化します。解法の型を学びアルゴリズムの本を読み、演習と行き来します。',
    ru: 'Этап 3: стройте систему — изучайте шаблоны решений и книги по алгоритмам, чередуя это с практикой.',
  },
  summary: {
    en: 'Summarize actively: organize key points and identify patterns, so new problems map onto ones you know.',
    zh: '主动总结：梳理知识要点、归纳解题套路，让新题能对应到已掌握的模式。',
    'zh-hant': '主動總結：梳理知識要點、歸納解題套路，讓新題能對應到已掌握的模式。',
    ja: '自分でまとめましょう。要点を整理しパターンを見つければ、新しい問題も既知の型に当てはめられます。',
    ru: 'Обобщайте сами: сводите ключевые идеи и ищите закономерности, чтобы новые задачи сводились к знакомым.',
  },
};

const learningRoute: StepFigure = {
  type: 'steps',
  tones: { s1: 'idle', s2: 'cmp', review: 'swp', s3: 'cmp', summary: 'done' },
  build(l) {
    const H = 270;
    const colW = 140;
    const gap = 20;
    const x = (k: number) => k * (colW + gap);
    const tones: Tone[] = ['ok', 'info', 'accent'];
    const heads: [T, T, T][] = [
      [ROUTE.s1, ROUTE.basic, ROUTE.course],
      [ROUTE.s2, ROUTE.practice, ROUTE.problems],
      [ROUTE.s3, ROUTE.system, ROUTE.frameworks],
    ];
    const stage = (k: number, hot: boolean): SceneNode[] => {
      const [s, sub, label] = heads[k];
      const lines = wrap(label[l], colW - 16, 12);
      return [
        text(`s${k}`, x(k) + colW / 2, 18, s[l], { anchor: 'middle', size: 12, tone: 'muted' }),
        text(`sub${k}`, x(k) + colW / 2, 36, sub[l], { anchor: 'middle', size: 13, bold: true, tone: tones[k] }),
        box(`b${k}`, x(k), 50, '', { w: colW, h: 60, tone: tones[k], ring: hot }),
        ...lines.map((line, n) => text(`bt${k}-${n}`, x(k) + colW / 2, 80 - ((lines.length - 1) * 16) / 2 + n * 16 + 4, line, { anchor: 'middle', size: 12, bold: true })),
      ];
    };
    const card = (k: 1 | 2, title: T, body: T, hot: boolean): SceneNode[] => {
      const lines = wrap(body[l], colW - 16, 11);
      return [
        arrow(`up${k}`, [x(k) + colW / 2, 152], [x(k) + colW / 2, 116], { tone: hot ? tones[k] : 'muted', width: 2.5 }),
        region(`card${k}`, x(k), 158, colW, 100, { tone: 'idle' }),
        text(`ct${k}`, x(k) + colW / 2, 180, title[l], { anchor: 'middle', size: 12, bold: true, tone: tones[k] }),
        ...lines.map((line, n) => text(`cb${k}-${n}`, x(k) + colW / 2, 200 + n * 15, line, { anchor: 'middle', size: 11, tone: 'muted' })),
      ];
    };
    const scene = (stages: number, review: boolean, summary: boolean, hot: string) => {
      const nodes: SceneNode[] = [];
      for (let k = 0; k < stages; k++) nodes.push(...stage(k, hot === `s${k + 1}`));
      if (stages > 1) nodes.push(arrow('a12', [x(0) + colW + 2, 80], [x(1) - 3, 80], { width: 2 }));
      if (stages > 2) nodes.push(arrow('a23', [x(1) + colW + 2, 72], [x(2) - 3, 72], { width: 2 }), arrow('a32', [x(2) - 2, 90], [x(1) + colW + 3, 90], { width: 2 }));
      if (review) nodes.push(...card(1, ROUTE.review, ROUTE.reviewText, hot === 'review'));
      if (summary) nodes.push(...card(2, ROUTE.summary, ROUTE.summaryText, hot === 'summary'));
      return { w: W, h: H, nodes };
    };
    const S = ROUTE_SAY;
    return {
      frames: [
        { kind: 's1', scene: scene(1, false, false, 's1'), say: S.s1[l] },
        { kind: 's2', scene: scene(2, false, false, 's2'), say: S.s2[l] },
        { kind: 'review', scene: scene(2, true, false, 'review'), say: S.review[l] },
        { kind: 's3', scene: scene(3, true, false, 's3'), say: S.s3[l] },
        { kind: 'summary', scene: scene(3, true, true, 'summary'), say: S.summary[l] },
      ],
    };
  },
};

const FIGURES: Record<string, Figure> = {
  hello_algo_mindmap: mindMap,
  learning_route: learningRoute,
};

export default FIGURES;
