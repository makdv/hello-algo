/**
 * Which book figures have been redrawn, by chapter folder. Pure data, so the MkDocs converter
 * can read it: an image listed here is replaced by `<Fig>` in every locale.
 *
 * Ids are image file names without the extension. A `<1>`, `<2>` … step sequence is one
 * animated figure whose id is its frames' shared name plus `_steps`, e.g. `array_stack_steps`
 * for `array_stack_step1.png`, `array_stack_step2_push.png`, ….
 */
export const FIGURE_IDS: Record<string, string[]> = {
  chapter_introduction: [
    'binary_search_dictionary_steps',
    'playing_cards_sorting',
    'greedy_change',
    'relationship_between_data_structure_and_algorithm',
    'assembling_blocks',
  ],
  chapter_computational_complexity: [
    'iteration',
    'nested_iteration',
    'recursion_sum',
    'recursion_sum_depth',
    'tail_recursion_sum',
    'recursion_tree',
    'space_types',
    'space_complexity_common_types',
    'space_complexity_recursive_linear',
    'space_complexity_recursive_quadratic',
    'space_complexity_exponential',
    'time_complexity_simple_example',
    'asymptotic_upper_bound',
    'time_complexity_common_types',
    'time_complexity_constant_linear_quadratic',
    'time_complexity_exponential',
    'time_complexity_logarithmic',
    'time_complexity_logarithmic_linear',
    'time_complexity_factorial',
  ],
  chapter_data_structure: [
    'classification_logic_structure',
    'classification_phisical_structure',
    'computer_memory_location',
    'ascii_table',
    'unicode_hello_algo',
    'utf-8_hello_algo',
    '1s_2s_complement',
    'ieee_754_float',
  ],
  chapter_array_and_linkedlist: [
    'array_definition',
    'array_memory_location_calculation',
    'array_insert_element',
    'array_remove_element',
    'linkedlist_definition',
    'linkedlist_insert_node',
    'linkedlist_remove_node',
    'linkedlist_common_types',
    'computer_storage_devices',
    'storage_pyramid',
  ],
  chapter_stack_and_queue: [
    'stack_operations',
    'linkedlist_stack_steps',
    'array_stack_steps',
    'queue_operations',
    'linkedlist_queue_steps',
    'array_queue_steps',
    'deque_operations',
    'linkedlist_deque_steps',
    'array_deque_steps',
  ],
  chapter_hashing: [
    'hash_table_lookup',
    'hash_function',
    'hash_collision',
    'hash_table_reshash',
    'hash_table_chaining',
    'hash_table_linear_probing',
    'hash_table_open_addressing_deletion',
    'hash_collision_best_worst_condition',
  ],
};

/** The figure id for an image: its name, or for the first frame of a step sequence, the sequence's name. */
export function figureIdOf(file: string, inSequence: boolean): string {
  const name = file.replace(/\.[a-z]+$/i, '');
  if (!inSequence) return name;
  return `${name.replace(/_step\d+.*$/, '')}_steps`;
}

export function hasFigure(chapter: string, id: string): boolean {
  return FIGURE_IDS[chapter]?.includes(id) ?? false;
}
