import type { Localized } from '../i18n/locale';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';

export type AlgorithmId = 'bubble_sort' | 'selection_sort' | 'insertion_sort' | 'binary_search' | 'quick_sort' | 'merge_sort';

export interface AlgorithmMeta {
  id: AlgorithmId;
  /** School level, in the order a beginner should meet them. */
  level: number;
  title: Localized<string>;
  /** The book page (without extension) that explains it. */
  page: string;
  /** Loaded on demand so pages only download the players they show. */
  load(): Promise<AlgorithmSpec<ArrayFrame>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- specs differ only in their frame data */
const as = (p: Promise<AlgorithmSpec<any>>) => p as Promise<AlgorithmSpec<ArrayFrame>>;

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'bubble_sort',
    level: 1,
    title: { en: 'Bubble sort', zh: '冒泡排序', 'zh-hant': '泡沫排序', ja: 'バブルソート', ru: 'Сортировка пузырьком' },
    page: 'chapter_sorting/bubble_sort',
    load: () => as(import('./bubbleSort').then((m) => m.bubbleSort)),
  },
  {
    id: 'selection_sort',
    level: 2,
    title: { en: 'Selection sort', zh: '选择排序', 'zh-hant': '選擇排序', ja: '選択ソート', ru: 'Сортировка выбором' },
    page: 'chapter_sorting/selection_sort',
    load: () => as(import('./selectionSort').then((m) => m.selectionSort)),
  },
  {
    id: 'insertion_sort',
    level: 3,
    title: { en: 'Insertion sort', zh: '插入排序', 'zh-hant': '插入排序', ja: '挿入ソート', ru: 'Сортировка вставками' },
    page: 'chapter_sorting/insertion_sort',
    load: () => as(import('./insertionSort').then((m) => m.insertionSort)),
  },
  {
    id: 'binary_search',
    level: 4,
    title: { en: 'Binary search', zh: '二分查找', 'zh-hant': '二分搜尋', ja: '二分探索', ru: 'Двоичный поиск' },
    page: 'chapter_searching/binary_search',
    load: () => as(import('./binarySearch').then((m) => m.binarySearch)),
  },
  {
    id: 'quick_sort',
    level: 5,
    title: { en: 'Quick sort', zh: '快速排序', 'zh-hant': '快速排序', ja: 'クイックソート', ru: 'Быстрая сортировка' },
    page: 'chapter_sorting/quick_sort',
    load: () => as(import('./quickSort').then((m) => m.quickSort)),
  },
  {
    id: 'merge_sort',
    level: 6,
    title: { en: 'Merge sort', zh: '归并排序', 'zh-hant': '合併排序', ja: 'マージソート', ru: 'Сортировка слиянием' },
    page: 'chapter_sorting/merge_sort',
    load: () => as(import('./mergeSort').then((m) => m.mergeSort)),
  },
];

export const findAlgorithm = (id: string) => ALGORITHMS.find((a) => a.id === id);
