/** Helpers for pulling one function out of the repo's `codes/<lang>` sources. */

function dedent(lines: string[]): string[] {
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min));
}

function trimBlankEdges(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start++;
  while (end > start && !lines[end - 1].trim()) end--;
  return lines.slice(start, end);
}

/** Extracts `def name(...)` and its indented body. */
export function extractPythonFunction(source: string, name: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((l) => new RegExp(`^\\s*def ${name}\\(`).test(l));
  if (start < 0) throw new Error(`Python function "${name}" not found`);
  const indent = lines[start].match(/^\s*/)![0].length;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() && line.match(/^\s*/)![0].length <= indent) break;
    end++;
  }
  return dedent(trimBlankEdges(lines.slice(start, end))).join('\n');
}

/** Extracts a brace-delimited function whose first line contains `signature`. */
export function extractBracedFunction(source: string, signature: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((l) => l.includes(signature));
  if (start < 0) throw new Error(`Function with signature "${signature}" not found`);
  let depth = 0;
  let opened = false;
  let end = start;
  for (; end < lines.length; end++) {
    for (const ch of lines[end]) {
      if (ch === '{') {
        depth++;
        opened = true;
      } else if (ch === '}') {
        depth--;
      }
    }
    if (opened && depth === 0) break;
  }
  return dedent(lines.slice(start, end + 1)).join('\n');
}

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
