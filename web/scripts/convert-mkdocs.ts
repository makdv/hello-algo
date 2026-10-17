/**
 * Converts the MkDocs book (en/docs) into Rspress pages under web/docs.
 *
 *   node scripts/convert-mkdocs.ts
 *
 * The generated chapters are not committed: en/docs stays the single source of truth,
 * and `npm run dev` / `npm run build` regenerate them first. Hand-written pages in
 * web/content (for example the interactive bubble sort page) replace generated ones.
 *
 * Handled MkDocs syntax:
 * - `=== "Python"` language tabs → code fences between `<!-- ha:codetabs -->` markers
 * - `=== "<1>"` numbered image tabs → `<!-- ha:steps -->` markers (rendered by StepFrames)
 * - `!!! type "title"` / `??? type "title"` → Rspress `:::` containers and details
 * - `??? pythontutor` → a link to Python Tutor
 * - attribute lists `{ ... }`, front matter, and `Table <id>` numbering
 * ```src blocks are left as they are; the remark plugin expands them at build time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNav } from './nav.ts';

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(webDir, '..');
const srcDocs = path.join(repoDir, 'en/docs');
const outDocs = path.join(webDir, 'docs');
const overridesDir = path.join(webDir, 'content');
/** Shared asset folders that pages reference with ../ paths; regenerated with the chapters. */
const GENERATED_ROOT_DIRS = ['assets', 'index.assets'];

const ADMONITION_TYPE: Record<string, string> = {
  abstract: 'info',
  info: 'info',
  note: 'note',
  tip: 'tip',
  success: 'tip',
  question: 'important',
  quote: 'note',
  warning: 'warning',
  danger: 'danger',
  example: 'info',
};

interface Context {
  chapterNumber: number | null;
  /** Shared per chapter so table numbers continue across its pages. */
  tables: { count: number };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Takes the indented body that follows a `===`, `!!!` or `???` header line. */
function takeIndented(lines: string[], from: number): [body: string[], next: number] {
  let i = from;
  const body: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() && !/^( {4}|\t)/.test(line)) break;
    body.push(line.replace(/^( {4}|\t)/, ''));
    i++;
  }
  // Give trailing blank lines back to the parent.
  while (body.length && !body[body.length - 1].trim()) {
    body.pop();
    i--;
  }
  return [body, i];
}

/** Escapes generic-type text like <int> in prose (outside code spans), which HTML would swallow. */
function escapeProse(line: string): string {
  return line
    .split(/(`[^`]*`)/)
    .map((part, k) => (k % 2 ? part : part.replace(/<(int|bool|double|string|char|float|long|Integer|T)>/g, '&lt;$1&gt;')))
    .join('');
}

function convertLine(line: string, ctx: Context): string {
  let out = line
    // Attribute lists after images and links: ![x](y){ class="..." }, [x](y){ .button }
    .replace(/\)\{[^}]*\}/g, ')')
    .replace(/\s*\{\s*class="[^"]*"\s*\}/g, '')
    // Bare relative image paths would be resolved as packages by the bundler.
    .replace(/(!\[[^\]]*\]\()(?!\.{1,2}\/|\/|[a-z]+:|#)([^)\s]+)/gi, '$1./$2');
  if (out.includes('<id>')) {
    out = out.replace(/<id>/g, () => {
      ctx.tables.count++;
      return ctx.chapterNumber === null ? String(ctx.tables.count) : `${ctx.chapterNumber}-${ctx.tables.count}`;
    });
  }
  return escapeProse(out);
}

function convertBlock(lines: string[], ctx: Context): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code: copy verbatim.
    const fence = line.match(/^(\s*)(`{3,}|~{3,})/);
    if (fence) {
      const marker = fence[2];
      out.push(line);
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith(marker)) out.push(lines[i++]);
      if (i < lines.length) out.push(lines[i++]);
      continue;
    }

    // Tab group: === "Label"
    if (/^=== "(.*)"\s*$/.test(line)) {
      const items: { label: string; body: string[] }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^=== "(.*)"\s*$/);
        if (!m) break;
        const [body, next] = takeIndented(lines, i + 1);
        items.push({ label: m[1], body: convertBlock(body, ctx) });
        i = next;
        let k = i;
        while (k < lines.length && !lines[k].trim()) k++;
        if (k < lines.length && /^=== "/.test(lines[k])) i = k;
        else break;
      }
      const steps = items.every((it) => /^<\d+>$/.test(it.label));
      if (steps) {
        out.push('<!-- ha:steps -->', '');
        for (const it of items) out.push(...it.body, '');
        out.push('<!-- /ha:steps -->', '');
      } else {
        out.push('<!-- ha:codetabs -->', '');
        for (const it of items) {
          const body = [...it.body];
          const f = body.findIndex((l) => /^(`{3,}|~{3,})\S*/.test(l));
          if (f < 0) continue;
          body[f] = `${body[f].replace(/\s+title="[^"]*"/, '')} tab="${it.label}"`;
          out.push(...body, '');
        }
        out.push('<!-- /ha:codetabs -->', '');
      }
      continue;
    }

    // Admonitions: !!! type "Title", ??? type "Title", ???+ type "Title"
    const adm = line.match(/^(!!!|\?\?\?\+?)\s+(\w+)(?:\s+"(.*)")?\s*$/);
    if (adm) {
      const [, kind, type, title] = adm;
      const [rawBody, next] = takeIndented(lines, i + 1);
      i = next;
      if (type === 'pythontutor') {
        const url = rawBody.join(' ').match(/https?:\/\/\S+/)?.[0];
        if (url) out.push(`[${title || 'Code visualization'}: run it step by step in Python Tutor](${url})`, '');
        continue;
      }
      const body = convertBlock(rawBody, ctx);
      const deepest = Math.max(2, ...body.map((l) => l.match(/^(:{3,})/)?.[1].length ?? 0));
      const colons = ':'.repeat(deepest + 1);
      const rpType = kind.startsWith('???') ? 'details' : (ADMONITION_TYPE[type] ?? 'note');
      const heading = title === undefined ? capitalize(type) : title;
      out.push(`${colons}${rpType}${heading ? ` ${heading}` : ''}`, '', ...body, '', colons, '');
      continue;
    }

    // Chapter cover art: keep it book-cover sized instead of page-wide.
    if (/^!\[[^\]]*\]\([^)]*assets\/covers\//.test(line)) {
      out.push('<div class="ha-cover">', '', convertLine(line, ctx), '', '</div>');
      i++;
      continue;
    }

    out.push(convertLine(line, ctx));
    i++;
  }
  return out;
}

export function convertMarkdown(text: string, ctx: Context): string {
  const withoutFrontMatter = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  const lines = withoutFrontMatter.replace(/\r\n/g, '\n').split('\n');
  return `${convertBlock(lines, ctx)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

/** Relative image and asset references in converted Markdown/HTML. */
function assetRefs(md: string): string[] {
  const refs = [
    ...[...md.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
    ...[...md.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]),
  ];
  return refs.filter((r) => !/^([a-z]+:)?\/\//i.test(r) && !r.startsWith('/') && !r.startsWith('data:'));
}

function copyFile(from: string, to: string) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function listMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(p));
    else if (entry.name.endsWith('.md')) out.push(path.relative(srcDocs, p));
  }
  return out;
}

function main() {
  // Generated chapters are rebuilt from scratch each run.
  for (const entry of fs.readdirSync(outDocs)) {
    if (entry.startsWith('chapter_') || GENERATED_ROOT_DIRS.includes(entry)) {
      fs.rmSync(path.join(outDocs, entry), { recursive: true, force: true });
    }
  }

  const nav = readNav(path.join(repoDir, 'en/mkdocs.yml'));
  const ordered: { file: string; ctx: Context }[] = [];
  const seen = new Set<string>();
  for (const chapter of nav) {
    const ctx: Context = { chapterNumber: chapter.number, tables: { count: 0 } };
    for (const page of chapter.pages) {
      ordered.push({ file: page.file, ctx });
      seen.add(page.file);
    }
  }
  for (const file of listMarkdown(srcDocs)) {
    if (seen.has(file) || file === 'index.md' || !file.startsWith('chapter_')) continue;
    ordered.push({ file, ctx: { chapterNumber: null, tables: { count: 0 } } });
  }

  let pages = 0;
  let assets = 0;
  for (const { file, ctx } of ordered) {
    const from = path.join(srcDocs, file);
    if (!fs.existsSync(from)) continue;
    const md = convertMarkdown(fs.readFileSync(from, 'utf8'), ctx);
    const to = path.join(outDocs, file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, md);
    pages++;
    for (const ref of assetRefs(md)) {
      const clean = decodeURI(ref.split('#')[0].split('?')[0]);
      const asset = path.resolve(path.dirname(from), clean);
      if (!fs.existsSync(asset)) continue;
      const target = path.join(outDocs, path.relative(srcDocs, asset));
      if (!fs.existsSync(target)) {
        copyFile(asset, target);
        assets++;
      }
    }
  }

  // Hand-written pages replace their generated counterparts.
  let overrides = 0;
  const overlay = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        overlay(p);
        continue;
      }
      const rel = path.relative(overridesDir, p);
      copyFile(p, path.join(outDocs, rel));
      if (rel.endsWith('.mdx')) {
        fs.rmSync(path.join(outDocs, rel.replace(/\.mdx$/, '.md')), { force: true });
        overrides++;
      }
    }
  };
  overlay(overridesDir);

  console.log(`[convert-mkdocs] ${pages} pages, ${assets} assets, ${overrides} hand-written overrides`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
