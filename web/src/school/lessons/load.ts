import type { UnitId } from './catalog';
import { findLesson } from './catalog';
import type { LessonContent } from './types';

type UnitModule = { default: Record<string, LessonContent> };

/** One bundle per unit, loaded when one of its lessons opens. */
export const UNIT_LOADERS: Record<UnitId, () => Promise<UnitModule>> = {
  think: () => import('./units/think'),
  structures: () => import('./units/structures'),
  search_sort: () => import('./units/searchSort'),
  solve: () => import('./units/solve'),
};

export async function loadLesson(id: string): Promise<LessonContent | null> {
  const meta = findLesson(id);
  if (!meta) return null;
  const mod = await UNIT_LOADERS[meta.unit]();
  return mod.default[id] ?? null;
}
