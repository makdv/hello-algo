import type { Figure } from './scene';

type ChapterModule = { default: Record<string, Figure> };

/** One bundle per chapter, loaded when a page with its figures opens. */
const CHAPTERS: Record<string, () => Promise<ChapterModule>> = {
  chapter_introduction: () => import('./chapters/introduction'),
  chapter_computational_complexity: () => import('./chapters/complexity'),
  chapter_data_structure: () => import('./chapters/dataStructure'),
  chapter_array_and_linkedlist: () => import('./chapters/arrayAndLinkedlist'),
  chapter_stack_and_queue: () => import('./chapters/stackAndQueue'),
  chapter_hashing: () => import('./chapters/hashing'),
  chapter_tree: () => import('./chapters/tree'),
  chapter_heap: () => import('./chapters/heap'),
  chapter_graph: () => import('./chapters/graph'),
  chapter_searching: () => import('./chapters/searching'),
  chapter_sorting: () => import('./chapters/sorting'),
  chapter_divide_and_conquer: () => import('./chapters/divideConquer'),
};

/** Loads a figure by `chapter/id`, e.g. `chapter_hashing/hash_function`. */
export async function loadFigure(fullId: string): Promise<Figure | null> {
  const [chapter, id] = fullId.split('/');
  const mod = await CHAPTERS[chapter]?.();
  return mod?.default[id] ?? null;
}

export const CHAPTER_LOADERS = CHAPTERS;
