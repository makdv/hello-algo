import javaSource from '@codes/java/chapter_sorting/bubble_sort.java?raw';
import pythonSource from '@codes/python/chapter_sorting/bubble_sort.py?raw';
import { extractBracedFunction, extractPythonFunction } from '../engine/source';

// Interim listings until the `src` snippet plugin covers all 14 languages.
export const bubbleSortListing = {
  python: { label: 'Python', code: extractPythonFunction(pythonSource, 'bubble_sort') },
  java: { label: 'Java', code: extractBracedFunction(javaSource, 'void bubbleSort(int[] nums)') },
};

export const bubbleSortWithFlagListing = {
  python: { label: 'Python', code: extractPythonFunction(pythonSource, 'bubble_sort_with_flag') },
  java: { label: 'Java', code: extractBracedFunction(javaSource, 'void bubbleSortWithFlag(int[] nums)') },
};
