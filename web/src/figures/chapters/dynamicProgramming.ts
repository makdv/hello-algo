import type { Figure } from '../scene';
import { DP_BASIC_FIGURES } from './dpBasics';
import { DP_PROBLEM_FIGURES } from './dpProblems';

/** Chapter 14, dynamic programming: climbing stairs and min path sum, then knapsack, coin change and edit distance. */
const FIGURES: Record<string, Figure> = { ...DP_BASIC_FIGURES, ...DP_PROBLEM_FIGURES };

export default FIGURES;
