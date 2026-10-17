/**
 * Extracts functions, methods and classes from the repo's `codes/<lang>` sources,
 * for the book's `[file]{x}-[class]{y}-[func]{z}` snippet references.
 *
 * Sources are split into declaration "units" (leading comments + declaration),
 * using braces, indentation (Python) or `end` (Ruby) to find where each ends.
 */

export const SNIPPET_LANGS = [
  'python',
  'cpp',
  'java',
  'csharp',
  'go',
  'swift',
  'javascript',
  'typescript',
  'dart',
  'rust',
  'c',
  'kotlin',
  'ruby',
  'zig',
] as const;

export type SnippetLang = (typeof SNIPPET_LANGS)[number];

export const LANG_INFO: Record<SnippetLang, { label: string; ext: string; family: 'brace' | 'py' | 'rb' }> = {
  python: { label: 'Python', ext: 'py', family: 'py' },
  cpp: { label: 'C++', ext: 'cpp', family: 'brace' },
  java: { label: 'Java', ext: 'java', family: 'brace' },
  csharp: { label: 'C#', ext: 'cs', family: 'brace' },
  go: { label: 'Go', ext: 'go', family: 'brace' },
  swift: { label: 'Swift', ext: 'swift', family: 'brace' },
  javascript: { label: 'JS', ext: 'js', family: 'brace' },
  typescript: { label: 'TS', ext: 'ts', family: 'brace' },
  dart: { label: 'Dart', ext: 'dart', family: 'brace' },
  rust: { label: 'Rust', ext: 'rs', family: 'brace' },
  c: { label: 'C', ext: 'c', family: 'brace' },
  kotlin: { label: 'Kotlin', ext: 'kt', family: 'brace' },
  ruby: { label: 'Ruby', ext: 'rb', family: 'rb' },
  zig: { label: 'Zig', ext: 'zig', family: 'brace' },
};

export interface SnippetRef {
  file: string;
  cls: string;
  func: string;
}

/** Parses `[file]{bubble_sort}-[class]{}-[func]{bubble_sort}`. */
export function parseSnippetRef(text: string): SnippetRef | null {
  const m = text.trim().match(/^\[file\]\{([^}]*)\}-\[class\]\{([^}]*)\}-\[func\]\{([^}]*)\}$/);
  return m ? { file: m[1], cls: m[2], func: m[3] } : null;
}

/** Identifiers compare without case or underscores: `min_path_sum_dfs` ≈ `minPathSumDFS`, `avl_tree` ≈ `AVLTree`. */
export const normalizeName = (name: string) => name.replace(/[_?!]/g, '').toLowerCase();

/** Constructor names per language for the book's `__init__` references. */
function nameTargets(func: string, cls: string): Set<string> {
  if (func !== '__init__') return new Set([normalizeName(func)]);
  const c = normalizeName(cls);
  return new Set(['init', 'constructor', 'initialize', 'new', c, `new${c}`]);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const indentOf = (line: string) => line.match(/^[ \t]*/)![0].replace(/\t/g, '    ').length;

interface Unit {
  /** Lines including leading comments. */
  lines: string[];
  /** Index (within `lines`) of the declaration's first line. */
  head: number;
  indent: number;
}

function isPrefixLine(trimmed: string, family: 'brace' | 'py' | 'rb'): boolean {
  if (!trimmed) return false;
  if (family === 'brace') {
    return /^(\/\*|\*|\/\/|@|#\[)/.test(trimmed);
  }
  if (family === 'py') return trimmed.startsWith('#') || trimmed.startsWith('@');
  return trimmed.startsWith('#');
}

/** Strips string literals and line comments so braces inside them are not counted. */
function codeOnly(line: string): string {
  return line
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/\/\/.*$/, '')
    .replace(/\/\*.*?\*\//g, '');
}

/** Splits `lines` into units that start at exactly `level` indentation. */
function splitUnits(lines: string[], level: number, family: 'brace' | 'py' | 'rb'): Unit[] {
  const units: Unit[] = [];
  let prefix: string[] = [];
  let i = 0;
  let inBlockComment = false;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      // A blank line detaches comments from the next declaration.
      prefix = [];
      i++;
      continue;
    }
    if (family === 'brace' && (inBlockComment || trimmed.startsWith('/*'))) {
      prefix.push(line);
      inBlockComment = !trimmed.includes('*/');
      i++;
      continue;
    }
    if (indentOf(line) !== level || isPrefixLine(trimmed, family)) {
      if (indentOf(line) === level) prefix.push(line);
      else prefix = [];
      i++;
      continue;
    }

    const start = i;
    let end = i;
    if (family === 'py') {
      end = i + 1;
      while (end < lines.length && (!lines[end].trim() || indentOf(lines[end]) > level)) end++;
    } else if (family === 'rb') {
      if (/^(def|class|module)\b/.test(trimmed) && !/\bend$/.test(trimmed)) {
        end = i + 1;
        while (end < lines.length && !(indentOf(lines[end]) === level && /^end\b/.test(lines[end].trim()))) end++;
        end = Math.min(end + 1, lines.length);
      } else {
        end = i + 1;
      }
    } else {
      let depth = 0;
      let opened = false;
      end = i;
      for (; end < lines.length; end++) {
        const code = codeOnly(lines[end]);
        for (const ch of code) {
          if (ch === '{') {
            depth++;
            opened = true;
          } else if (ch === '}') depth--;
        }
        if (opened && depth <= 0) break;
        if (!opened && /;\s*$/.test(code)) break;
        if (!opened) {
          // A statement without a body (package, import, field): it ends here unless the
          // next line continues it (deeper indent) or opens its block (Allman-style `{`).
          let k = end + 1;
          while (k < lines.length && !lines[k].trim()) k++;
          const next = lines[k];
          const continues = next !== undefined && /^(\{|\)|\]|\.|:|->|where\b|throws\b|extends\b|implements\b)/.test(next.trim());
          if (next === undefined || (indentOf(next) <= level && !continues)) break;
        }
      }
      end = Math.min(end + 1, lines.length);
    }
    // Trim trailing blank lines (Python bodies can end with them).
    let last = end;
    while (last > start + 1 && !lines[last - 1].trim()) last--;
    units.push({ lines: [...prefix, ...lines.slice(start, last)], head: prefix.length, indent: level });
    prefix = [];
    i = end;
  }
  return units;
}

function dedentText(lines: string[]): string {
  const expanded = lines.map((l) => l.replace(/^\t+/, (t) => '    '.repeat(t.length)));
  const indents = expanded.filter((l) => l.trim()).map(indentOf);
  const min = indents.length ? Math.min(...indents) : 0;
  return expanded.map((l) => l.slice(min)).join('\n');
}

function headOf(unit: Unit): string {
  return unit.lines[unit.head];
}

function matchesFunc(unit: Unit, targets: Set<string>, lang: SnippetLang, loose = false): boolean {
  const head = headOf(unit).trim();
  const family = LANG_INFO[lang].family;
  // Loose: some languages rename to avoid clashes (`insert` → `insertNode`, `constant` → `spaceConstant`).
  const hit = (id: string) => {
    const n = normalizeName(id);
    if (targets.has(n)) return true;
    return loose && [...targets].some((t) => t.length > 2 && (n.startsWith(t) || n.endsWith(t)));
  };
  if (family === 'py') {
    const m = head.match(/^(?:async\s+)?def (\w+)\(/);
    return Boolean(m && hit(m[1]));
  }
  if (family === 'rb') {
    const m = head.match(/^def (?:self\.)?(\w+[?!]?)/);
    return Boolean(m && hit(m[1]));
  }
  if (/^(return|if|for|while|switch|else|case)\b/.test(head)) return false;
  if (!unit.lines.slice(unit.head).some((l) => l.includes('{'))) return false;
  for (const m of head.matchAll(/([A-Za-z_]\w*)\s*(?:<[^>()]*>)?\s*\(/g)) {
    if (hit(m[1])) return true;
  }
  return false;
}

function matchesClass(unit: Unit, target: string, lang: SnippetLang): boolean {
  const body = unit.lines.slice(unit.head);
  const head = body[0].trim();
  const t = normalizeName(target);
  const m = head.match(/\b(?:class|struct|interface|enum|object)\s+(\w+)/);
  if (m && normalizeName(m[1]) === t) return true;
  if (lang === 'go') {
    const g = head.match(/^type\s+(\w+)\s+struct\b/);
    if (g && normalizeName(g[1]) === t) return true;
  }
  if (lang === 'zig') {
    // Zig types are functions returning a struct (`pub fn ArrayStack(comptime T: type) type {`)
    // or struct constants (`const ListNode = struct {`).
    const z = head.match(/\bfn\s+(\w+)\s*\(.*\)\s*type\s*\{/) ?? head.match(/\bconst\s+(\w+)\s*=\s*struct\b/);
    if (z && normalizeName(z[1]) === t) return true;
  }
  if (lang === 'c' && head.startsWith('typedef')) {
    const c = body[body.length - 1].trim().match(/}\s*(\w+)\s*;$/);
    if (c && normalizeName(c[1]) === t) return true;
  }
  return false;
}

/** Units directly inside a class-like unit (methods, fields with comments). */
function innerUnits(unit: Unit, lang: SnippetLang): Unit[] {
  const family = LANG_INFO[lang].family;
  const body = unit.lines.slice(unit.head + 1);
  // Skip closing braces and C++ access labels (`private:`), which sit at a shallower indent.
  const firstInner = body.find((l) => l.trim() && !/^[}\]]/.test(l.trim()) && !/^(public|private|protected)\s*:/.test(l.trim()));
  if (!firstInner) return [];
  const units = splitUnits(body, indentOf(firstInner), family);
  // Zig generic types wrap their members in `return struct { ... }`.
  if (lang === 'zig') {
    const wrapper = units.find((u) => /^return\s+struct\b/.test(headOf(u).trim()));
    if (wrapper) return innerUnits(wrapper, lang);
  }
  return units;
}

/** Go, Rust and C keep methods outside the type declaration: gather them too. */
function gatherTypeWithMethods(units: Unit[], lang: SnippetLang, cls: string): Unit[] {
  const typeUnit = units.find((u) => matchesClass(u, cls, lang));
  if (!typeUnit) return [];
  const t = normalizeName(cls);
  return units.filter((u) => {
    if (u === typeUnit) return true;
    const head = headOf(u).trim();
    if (lang === 'go') {
      const recv = head.match(/^func\s+\(\w+\s+\*?(\w+)\)/);
      if (recv) return normalizeName(recv[1]) === t;
      const ctor = head.match(/^func\s+(\w+)\s*\(/);
      return Boolean(ctor && normalizeName(ctor[1]) === `new${t}`);
    }
    if (lang === 'rust') {
      if (!/^impl\b/.test(head)) return false;
      return [...head.matchAll(/\b(\w+)\b/g)].some((m) => normalizeName(m[1]) === t);
    }
    if (lang === 'c') {
      if (/^typedef\b/.test(head) || !head.includes('(')) return false;
      return [...head.matchAll(/\b(\w+)\b/g)].some((m) => normalizeName(m[1]) === t);
    }
    return false;
  });
}

/** Returns the extracted code, or null when the reference cannot be resolved for this language. */
export function extractSnippet(source: string, lang: SnippetLang, ref: Pick<SnippetRef, 'cls' | 'func'>): string | null {
  const family = LANG_INFO[lang].family;
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const top = splitUnits(lines, 0, family);
  const targets = ref.func ? nameTargets(ref.func, ref.cls) : new Set<string>();
  const outOfClassMethods = lang === 'go' || lang === 'rust' || lang === 'c';
  const exact = (u: Unit) => matchesFunc(u, targets, lang);
  const loose = (u: Unit) => matchesFunc(u, targets, lang, true);
  const isClass = (u: Unit) => matchesClass(u, ref.cls, lang);

  // Whole class.
  if (ref.cls && !ref.func) {
    if (outOfClassMethods) {
      const units = gatherTypeWithMethods(top, lang, ref.cls);
      return units.length ? units.map((u) => dedentText(u.lines)).join('\n\n') : null;
    }
    const cls = findDeep(top, isClass, lang);
    return cls ? dedentText(cls.lines) : null;
  }

  // Method of a class.
  if (ref.cls && ref.func) {
    if (!outOfClassMethods) {
      const cls = findDeep(top, isClass, lang);
      const inner = cls ? innerUnits(cls, lang) : [];
      const fn = inner.find(exact) ?? inner.find(loose);
      if (fn) return dedentText(fn.lines);
    }
  }

  // Free function (or Go/Rust/C method): top level first, then inside classes and impls.
  const fn = findDeep(top, exact, lang) ?? findDeep(top, loose, lang);
  return fn ? dedentText(fn.lines) : null;
}

/** Searches top-level units, then one level inside class-like units. */
function findDeep(units: Unit[], pred: (u: Unit) => boolean, lang: SnippetLang): Unit | null {
  const hit = units.find(pred);
  if (hit) return hit;
  for (const u of units) {
    const head = headOf(u).trim();
    if (
      /\b(class|struct|object|impl|namespace|module|extension|enum)\b/.test(head) ||
      /^(public|internal|static)\b.*\bclass\b/.test(head) ||
      (lang === 'zig' && /\)\s*type\s*\{/.test(head))
    ) {
      const inner = findDeep(innerUnits(u, lang), pred, lang);
      if (inner) return inner;
    }
  }
  return null;
}
