import type { Localized } from '../../i18n/locale';

/**
 * Every School lesson, in learning order. Pure data, so the MkDocs converter can read it to
 * generate one page per lesson. Lesson content lives in `units/<unit>.ts`.
 */

export type UnitId = 'think' | 'structures' | 'search_sort' | 'solve';

export interface UnitMeta {
  id: UnitId;
  title: Localized<string>;
}

export interface LessonMeta {
  id: string;
  unit: UnitId;
  title: Localized<string>;
  /** The book page (no extension) behind the "grown-up view" link. */
  page: string;
  /** Lessons whose Try part is an algorithm game play this algorithm (src/algorithms/registry.ts). */
  algorithm?: string;
}

export const UNITS: UnitMeta[] = [
  { id: 'think', title: { en: 'Think like a computer', zh: '像计算机一样思考', 'zh-hant': '像電腦一樣思考', ja: 'コンピュータのように考えよう', ru: 'Думай как компьютер' } },
  { id: 'structures', title: { en: 'Ways to keep data', zh: '存放数据的方法', 'zh-hant': '存放資料的方法', ja: 'データのしまい方', ru: 'Как хранить данные' } },
  { id: 'search_sort', title: { en: 'Find it and sort it', zh: '查找与排序', 'zh-hant': '搜尋與排序', ja: 'さがす・ならべる', ru: 'Найти и упорядочить' } },
  { id: 'solve', title: { en: 'Clever ways to solve puzzles', zh: '聪明的解题方法', 'zh-hant': '聰明的解題方法', ja: 'パズルの上手な解き方', ru: 'Хитрые способы решать задачи' } },
];

const L = (en: string, zh: string, zhHant: string, ja: string, ru: string): Localized<string> => ({ en, zh, 'zh-hant': zhHant, ja, ru });

export const LESSONS: LessonMeta[] = [
  // Unit 1: think like a computer
  { id: 'algorithms', unit: 'think', title: L('What is an algorithm?', '什么是算法？', '什麼是演算法？', 'アルゴリズムってなに？', 'Что такое алгоритм?'), page: 'chapter_introduction/algorithms_are_everywhere' },
  { id: 'loops', unit: 'think', title: L('Loops: do it again', '循环：再做一遍', '迴圈：再做一遍', 'ループ：くりかえし', 'Циклы: ещё раз'), page: 'chapter_computational_complexity/iteration_and_recursion' },
  { id: 'recursion', unit: 'think', title: L('Recursion: a box in a box', '递归：盒子里的盒子', '遞迴：盒子裡的盒子', '再帰：箱の中の箱', 'Рекурсия: коробка в коробке'), page: 'chapter_computational_complexity/iteration_and_recursion' },
  { id: 'speed', unit: 'think', title: L('Fast or slow?', '快还是慢？', '快還是慢？', '速い？遅い？', 'Быстро или медленно?'), page: 'chapter_computational_complexity/time_complexity' },
  // Unit 2: ways to keep data
  { id: 'array', unit: 'structures', title: L('Array: a row of boxes', '数组：一排盒子', '陣列：一排盒子', '配列：ならんだ箱', 'Массив: ряд коробок'), page: 'chapter_array_and_linkedlist/array' },
  { id: 'linked_list', unit: 'structures', title: L('Linked list: a treasure hunt', '链表：寻宝游戏', '鏈結串列：尋寶遊戲', '連結リスト：宝さがし', 'Связный список: поиск сокровищ'), page: 'chapter_array_and_linkedlist/linked_list' },
  { id: 'stack', unit: 'structures', title: L('Stack: a pile of plates', '栈：一摞盘子', '堆疊：一疊盤子', 'スタック：お皿の山', 'Стек: стопка тарелок'), page: 'chapter_stack_and_queue/stack' },
  { id: 'queue', unit: 'structures', title: L('Queue: waiting in line', '队列：排队', '佇列：排隊', 'キュー：順番待ちの列', 'Очередь: стоим друг за другом'), page: 'chapter_stack_and_queue/queue' },
  { id: 'hash_table', unit: 'structures', title: L('Hash table: magic lockers', '哈希表：神奇的储物柜', '雜湊表：神奇的置物櫃', 'ハッシュテーブル：魔法のロッカー', 'Хеш-таблица: волшебные шкафчики'), page: 'chapter_hashing/hash_map' },
  { id: 'tree', unit: 'structures', title: L('Tree: a family tree', '树：家谱', '樹：家譜', '木：家系図', 'Дерево: родословная'), page: 'chapter_tree/binary_tree' },
  { id: 'heap', unit: 'structures', title: L('Heap: the boss on top', '堆：老大在最上面', '堆積：老大在最上面', 'ヒープ：いちばん上はボス', 'Куча: главный наверху'), page: 'chapter_heap/heap' },
  { id: 'graph', unit: 'structures', title: L('Graph: a map of friends', '图：朋友地图', '圖：朋友地圖', 'グラフ：友だちの地図', 'Граф: карта друзей'), page: 'chapter_graph/graph' },
  // Unit 3: find it and sort it
  { id: 'linear_search', unit: 'search_sort', title: L('Look one by one', '一个一个地找', '一個一個地找', 'ひとつずつさがす', 'Ищем по одному'), page: 'chapter_searching/searching_algorithm_revisited' },
  { id: 'binary_search', unit: 'search_sort', title: L('Binary search: halve it', '二分查找：切一半', '二分搜尋：切一半', '二分探索：半分にする', 'Двоичный поиск: пополам'), page: 'chapter_searching/binary_search', algorithm: 'binary_search' },
  { id: 'bubble_sort', unit: 'search_sort', title: L('Bubble sort', '冒泡排序', '泡沫排序', 'バブルソート', 'Сортировка пузырьком'), page: 'chapter_sorting/bubble_sort', algorithm: 'bubble_sort' },
  { id: 'selection_sort', unit: 'search_sort', title: L('Selection sort', '选择排序', '選擇排序', '選択ソート', 'Сортировка выбором'), page: 'chapter_sorting/selection_sort', algorithm: 'selection_sort' },
  { id: 'insertion_sort', unit: 'search_sort', title: L('Insertion sort', '插入排序', '插入排序', '挿入ソート', 'Сортировка вставками'), page: 'chapter_sorting/insertion_sort', algorithm: 'insertion_sort' },
  { id: 'quick_sort', unit: 'search_sort', title: L('Quick sort', '快速排序', '快速排序', 'クイックソート', 'Быстрая сортировка'), page: 'chapter_sorting/quick_sort', algorithm: 'quick_sort' },
  { id: 'merge_sort', unit: 'search_sort', title: L('Merge sort', '归并排序', '合併排序', 'マージソート', 'Сортировка слиянием'), page: 'chapter_sorting/merge_sort', algorithm: 'merge_sort' },
  // Unit 4: clever ways to solve puzzles
  { id: 'maze', unit: 'solve', title: L('Get out of the maze', '走出迷宫', '走出迷宮', '迷路からぬけ出そう', 'Выберись из лабиринта'), page: 'chapter_graph/graph_traversal' },
  { id: 'greedy', unit: 'solve', title: L('Greedy: grab the biggest', '贪心：先拿最大的', '貪婪：先拿最大的', '貪欲法：いちばん大きいのから', 'Жадность: бери самое большое'), page: 'chapter_greedy/greedy_algorithm' },
  { id: 'backtracking', unit: 'solve', title: L('Backtracking: try and step back', '回溯：试一试，退一步', '回溯：試一試，退一步', 'バックトラック：ためして戻る', 'Перебор с возвратом: пробуй и отступай'), page: 'chapter_backtracking/backtracking_algorithm' },
  { id: 'dynamic_programming', unit: 'solve', title: L('Remember answers', '记住答案', '記住答案', '答えをおぼえておく', 'Запоминай ответы'), page: 'chapter_dynamic_programming/intro_to_dynamic_programming' },
  { id: 'divide_conquer', unit: 'solve', title: L('Split the big problem', '把大问题拆小', '把大問題拆小', '大きな問題を分けよう', 'Дели большую задачу'), page: 'chapter_divide_and_conquer/hanota_problem' },
];

export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);

/** The lesson after this one, in learning order. */
export const nextLesson = (id: string) => LESSONS[LESSONS.findIndex((l) => l.id === id) + 1];
