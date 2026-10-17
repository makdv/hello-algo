/**
 * Which book figures have been redrawn, by chapter folder. Pure data, so the MkDocs converter
 * can read it: an image listed here is replaced by `<Fig>` in every locale.
 *
 * Ids are image file names without the extension. A `<1>`, `<2>` … step sequence is one
 * animated figure whose id is its frames' shared name plus `_steps`, e.g. `array_stack_steps`
 * for `array_stack_step1.png`, `array_stack_step2_push.png`, ….
 */
export const FIGURE_IDS: Record<string, string[]> = {
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
