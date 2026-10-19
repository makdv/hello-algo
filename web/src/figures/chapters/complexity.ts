import type { Figure } from '../scene';
import { LOOP_FIGURES } from './complexityLoops';
import { SPACE_FIGURES } from './complexitySpace';
import { TIME_FIGURES } from './complexityTime';

/** Chapter 2, complexity analysis: iteration and recursion, time and space. */
const FIGURES: Record<string, Figure> = { ...LOOP_FIGURES, ...SPACE_FIGURES, ...TIME_FIGURES };

export default FIGURES;
