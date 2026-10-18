import type { Figure } from '../scene';
import { COMPARE_FIGURES } from './sortingCompare';
import { DISTRIBUTE_FIGURES } from './sortingDistribute';

/**
 * Chapter 11, sorting: the figures not already covered by the interactive players
 * (overviews, heap sort, and the non-comparison sorts).
 */
const FIGURES: Record<string, Figure> = { ...COMPARE_FIGURES, ...DISTRIBUTE_FIGURES };

export default FIGURES;
