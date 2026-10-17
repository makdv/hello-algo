import fs from 'node:fs';
import path from 'node:path';
import { findCodeFile } from '../src/engine/codeFiles';
import { extractSnippet, LANG_INFO, parseSnippetRef, SNIPPET_LANGS, type SnippetLang } from '../src/engine/snippets';

/**
 * Book-specific Markdown, applied to every page at build time:
 *
 * - ```src blocks with `[file]{x}-[class]{y}-[func]{z}` become a <CodeTabs> listing,
 *   extracted from `codes/<lang>/<chapter>/x.<ext>` for every language that has it.
 * - Code fences between `<!-- ha:codetabs -->` markers (the converter's output for
 *   MkDocs language tabs) become <CodeTabs>.
 * - Content between `<!-- ha:steps -->` markers (MkDocs `<1>`, `<2>` image tabs)
 *   becomes a <StepFrames> figure.
 */

interface Options {
  codesDir: string;
  docsDir: string;
}

// Minimal mdast shapes; the plugin only touches these fields.
interface Node {
  type: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  name?: string;
  alt?: string;
  attributes?: { type: string; name: string; value: unknown }[];
  children?: Node[];
}

const LABEL_TO_LANG: Record<string, SnippetLang> = Object.fromEntries(
  SNIPPET_LANGS.map((l) => [LANG_INFO[l].label.toLowerCase(), l]),
);

const FENCE_TO_LANG: Record<string, SnippetLang> = {
  ...Object.fromEntries(SNIPPET_LANGS.map((l) => [l, l])),
  py: 'python',
  'c++': 'cpp',
  cs: 'csharp',
  js: 'javascript',
  ts: 'typescript',
  rs: 'rust',
  kt: 'kotlin',
  rb: 'ruby',
};

const jsx = (name: string, attrs: Record<string, string>, children: Node[]): Node => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: Object.entries(attrs).map(([n, v]) => ({ type: 'mdxJsxAttribute', name: n, value: v })),
  children,
});

interface TabItem {
  lang: SnippetLang;
  label: string;
  fence: string;
  code: string;
}

const codeTabs = (items: TabItem[]) =>
  jsx(
    'CodeTabs',
    {},
    items.map((it) => jsx('CodeTab', { lang: it.lang, label: it.label }, [{ type: 'code', lang: it.fence, meta: null, value: it.code }])),
  );

const isMarker = (node: Node, marker: string) => node.type === 'html' && node.value?.trim() === `<!-- ${marker} -->`;

function firstImageAlt(nodes: Node[]): string | undefined {
  for (const n of nodes) {
    if (n.type === 'image' && n.alt) return n.alt;
    if ((n.type === 'mdxJsxTextElement' || n.type === 'mdxJsxFlowElement') && n.name === 'img') {
      const alt = n.attributes?.find((a) => a.name === 'alt')?.value;
      if (typeof alt === 'string' && alt) return alt;
    }
    if (n.children) {
      const inner = firstImageAlt(n.children);
      if (inner) return inner;
    }
  }
  return undefined;
}

export function remarkHelloAlgo(options: Options) {
  return (tree: Node, file: { path?: string; history?: string[] }) => {
    const filePath = file.path ?? file.history?.[0] ?? '';
    const chapter = path.relative(options.docsDir, filePath).split(path.sep)[0] ?? '';

    const expandSrc = (node: Node): Node => {
      const ref = parseSnippetRef(node.value ?? '');
      if (!ref) return node;
      const items: TabItem[] = [];
      for (const lang of SNIPPET_LANGS) {
        const codeFile = findCodeFile(options.codesDir, lang, chapter, ref.file);
        if (!codeFile) continue;
        const code = extractSnippet(fs.readFileSync(codeFile, 'utf8'), lang, ref);
        if (code) items.push({ lang, label: LANG_INFO[lang].label, fence: lang, code });
      }
      if (!items.length) {
        console.warn(`[hello-algo] no code found for ${node.value} in ${filePath}`);
        return { type: 'paragraph', children: [{ type: 'inlineCode', value: node.value ?? '' }] };
      }
      return codeTabs(items);
    };

    const tabsFrom = (nodes: Node[]): Node => {
      const items: TabItem[] = [];
      for (const n of nodes) {
        if (n.type !== 'code') continue;
        const label = n.meta?.match(/tab="([^"]+)"/)?.[1] ?? '';
        const lang = LABEL_TO_LANG[label.toLowerCase()] ?? FENCE_TO_LANG[(n.lang ?? '').toLowerCase()];
        if (!lang) continue;
        items.push({ lang, label: label || LANG_INFO[lang].label, fence: n.lang || lang, code: n.value ?? '' });
      }
      return codeTabs(items);
    };

    const walk = (parent: Node) => {
      const children = parent.children;
      if (!children) return;
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node.type === 'code' && node.lang === 'src') {
          children[i] = expandSrc(node);
          continue;
        }
        if (node.type === 'math') {
          // remark-math emits display math as <pre><code>, which Rspress's Shiki pass would
          // try to highlight before KaTeX runs. A div keeps it for rehype-katex only.
          (node as Node & { data?: unknown }).data = {
            hName: 'div',
            hProperties: { className: ['math', 'math-display'] },
            hChildren: [{ type: 'text', value: node.value ?? '' }],
          };
          continue;
        }
        for (const [marker, build] of [
          ['ha:codetabs', (inner: Node[]) => tabsFrom(inner)],
          ['ha:steps', (inner: Node[]) => jsx('StepFrames', firstImageAlt(inner) ? { caption: firstImageAlt(inner)! } : {}, inner)],
        ] as const) {
          if (!isMarker(node, marker)) continue;
          const end = children.findIndex((n, k) => k > i && isMarker(n, `/${marker}`));
          if (end < 0) break;
          const inner = children.slice(i + 1, end);
          inner.forEach(walk);
          children.splice(i, end - i + 1, build(inner));
          break;
        }
        walk(children[i]);
      }
    };

    walk(tree);
  };
}
