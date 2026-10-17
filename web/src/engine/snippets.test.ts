import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findCodeFile } from './codeFiles';
import { extractSnippet, parseSnippetRef, SNIPPET_LANGS, type SnippetLang } from './snippets';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const codesDir = path.join(repo, 'en/codes');
const docsDir = path.join(repo, 'en/docs');

function read(lang: SnippetLang, chapter: string, file: string) {
  const p = findCodeFile(codesDir, lang, chapter, file);
  if (!p) throw new Error(`missing ${lang} ${file}`);
  return fs.readFileSync(p, 'utf8');
}

describe('extractSnippet on known code', () => {
  it('extracts a free function with its leading comment', () => {
    const java = extractSnippet(read('java', 'chapter_sorting', 'bubble_sort'), 'java', { cls: '', func: 'bubble_sort' })!;
    expect(java.split('\n')[0]).toBe('/* Bubble sort */');
    expect(java).toContain('static void bubbleSort(int[] nums) {');
    expect(java).not.toContain('bubbleSortWithFlag');
    expect(java.trim().endsWith('}')).toBe(true);
  });

  it('respects each language naming convention', () => {
    const cs = extractSnippet(read('csharp', 'chapter_sorting', 'bubble_sort'), 'csharp', { cls: '', func: 'bubble_sort' })!;
    expect(cs).toContain('BubbleSort(');
    const rs = extractSnippet(read('rust', 'chapter_sorting', 'bubble_sort'), 'rust', { cls: '', func: 'bubble_sort' })!;
    expect(rs).toContain('fn bubble_sort(');
    const rb = extractSnippet(read('ruby', 'chapter_sorting', 'bubble_sort'), 'ruby', { cls: '', func: 'bubble_sort' })!;
    expect(rb.trim().startsWith('### ')).toBe(true);
    expect(rb.trim().endsWith('end')).toBe(true);
  });

  it('gathers Go structs with their methods and constructor', () => {
    const go = extractSnippet(read('go', 'chapter_stack_and_queue', 'array_stack'), 'go', { cls: 'array_stack', func: '' })!;
    expect(go).toContain('type arrayStack struct');
    expect(go).toContain('func newArrayStack()');
    expect(go).toContain('func (s *arrayStack) push(v int)');
  });

  it('gathers Rust structs with impl blocks, and C typedefs with their functions', () => {
    const rs = extractSnippet(read('rust', 'chapter_stack_and_queue', 'array_stack'), 'rust', { cls: 'array_stack', func: '' })!;
    expect(rs).toContain('struct ArrayStack<T>');
    expect(rs).toContain('impl<T> ArrayStack<T>');
    const c = extractSnippet(read('c', 'chapter_stack_and_queue', 'array_stack'), 'c', { cls: 'array_stack', func: '' })!;
    expect(c).toContain('} ArrayStack;');
    expect(c).toContain('void push(ArrayStack *stack, int num)');
    expect(c).not.toContain('int main(');
  });

  it('extracts whole Python and Ruby classes', () => {
    const py = extractSnippet(read('python', 'chapter_stack_and_queue', 'array_stack'), 'python', { cls: 'array_stack', func: '' })!;
    expect(py.startsWith('class ArrayStack')).toBe(true);
    expect(py).not.toContain('__main__');
    const rb = extractSnippet(read('ruby', 'chapter_stack_and_queue', 'array_stack'), 'ruby', { cls: 'array_stack', func: '' })!;
    expect(rb).toContain('class ArrayStack');
    expect(rb.trim().endsWith('end')).toBe(true);
  });
});

/** Every `src` reference in the English book, resolved in every language that has the file. */
function collectRefs() {
  const refs: { page: string; chapter: string; text: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.md')) {
        const text = fs.readFileSync(p, 'utf8');
        for (const m of text.matchAll(/```src\n([^\n]+)\n```/g)) {
          refs.push({ page: path.relative(docsDir, p), chapter: path.relative(docsDir, p).split(path.sep)[0], text: m[1] });
        }
      }
    }
  };
  walk(docsDir);
  return refs;
}

describe('coverage over the English book', () => {
  it('resolves nearly every snippet in every language', () => {
    const refs = collectRefs();
    expect(refs.length).toBeGreaterThan(100);
    const failures: Record<string, string[]> = {};
    let attempts = 0;
    let ok = 0;
    for (const r of refs) {
      const ref = parseSnippetRef(r.text);
      expect(ref, r.text).not.toBeNull();
      for (const lang of SNIPPET_LANGS) {
        const file = findCodeFile(codesDir, lang, r.chapter, ref!.file);
        if (!file) continue;
        attempts++;
        const code = extractSnippet(fs.readFileSync(file, 'utf8'), lang, ref!);
        if (code && code.trim()) ok++;
        else (failures[lang] ??= []).push(`${r.page}: ${r.text}`);
      }
    }
    const rate = ok / attempts;
    const summary = Object.entries(failures)
      .map(([lang, list]) => `${lang}: ${list.length}\n  ${list.slice(0, 40).join('\n  ')}`)
      .join('\n');
    if (Object.keys(failures).length) console.log(`snippet coverage ${(rate * 100).toFixed(1)}% (${ok}/${attempts})\n${summary}`);
    expect(rate).toBeGreaterThan(0.97);
  });
});
