/** Code anchors: which source lines to highlight for each event kind. */

/** Resolves anchor substrings to 1-based line numbers. Throws if an anchor is missing. */
export function resolveAnchors(code: string, anchors: Record<string, string[]>): Record<string, number[]> {
  const lines = code.split('\n');
  const out: Record<string, number[]> = {};
  for (const [kind, needles] of Object.entries(anchors)) {
    out[kind] = needles.map((needle) => {
      const idx = lines.findIndex((l) => l.includes(needle));
      if (idx < 0) throw new Error(`Anchor "${needle}" for "${kind}" not found in source`);
      return idx + 1;
    });
  }
  return out;
}
