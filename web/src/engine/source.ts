/** Code anchors: which source lines to highlight for each event kind. */

/**
 * Resolves anchor substrings to 1-based line numbers. Throws if an anchor is missing.
 * A `2|` prefix picks the second line containing the rest of the needle, `3|` the third, and so on.
 */
export function resolveAnchors(code: string, anchors: Record<string, string[]>): Record<string, number[]> {
  const lines = code.split('\n');
  const out: Record<string, number[]> = {};
  for (const [kind, needles] of Object.entries(anchors)) {
    out[kind] = needles.map((raw) => {
      const m = raw.match(/^(\d)\|(.*)$/);
      const nth = m ? Number(m[1]) : 1;
      const needle = m ? m[2] : raw;
      let seen = 0;
      const idx = lines.findIndex((l) => l.includes(needle) && ++seen === nth);
      if (idx < 0) throw new Error(`Anchor "${raw}" for "${kind}" not found in source`);
      return idx + 1;
    });
  }
  return out;
}
