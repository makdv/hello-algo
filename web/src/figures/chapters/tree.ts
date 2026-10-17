import type { Figure } from '../scene';
import { BASIC_FIGURES } from './treeBasics';
import { SEARCH_FIGURES } from './treeSearch';

/** Chapter 7, trees: binary trees, traversal, array representation, search trees and AVL trees. */
const FIGURES: Record<string, Figure> = { ...BASIC_FIGURES, ...SEARCH_FIGURES };

export default FIGURES;
