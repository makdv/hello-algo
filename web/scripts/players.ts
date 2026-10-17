/**
 * Where the book's static step figures are replaced by interactive players.
 * `image` is the file name of the first frame of a `<1>`, `<2>` … sequence, or of a single figure.
 * Image names are the same in every translation, so one table covers all locales.
 */
export interface PlayerPlacement {
  page: string;
  image: string;
  algorithm: string;
}

export const PLAYER_PLACEMENTS: PlayerPlacement[] = [
  { page: 'chapter_sorting/selection_sort.md', image: 'selection_sort_step1.png', algorithm: 'selection_sort' },
  { page: 'chapter_sorting/bubble_sort.md', image: 'bubble_operation_step1.png', algorithm: 'bubble_sort' },
  { page: 'chapter_sorting/insertion_sort.md', image: 'insertion_operation.png', algorithm: 'insertion_sort' },
  { page: 'chapter_sorting/quick_sort.md', image: 'pivot_division_step1.png', algorithm: 'quick_sort' },
  { page: 'chapter_sorting/merge_sort.md', image: 'merge_sort_step1.png', algorithm: 'merge_sort' },
  { page: 'chapter_searching/binary_search.md', image: 'binary_search_step1.png', algorithm: 'binary_search' },
];

/** The School view's levels, in order; ids match web/src/algorithms/registry.ts. */
export const SCHOOL_LEVELS = ['bubble_sort', 'selection_sort', 'insertion_sort', 'binary_search', 'quick_sort', 'merge_sort'];
