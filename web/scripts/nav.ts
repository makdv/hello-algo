import fs from 'node:fs';

export interface NavPage {
  /** Title from mkdocs.yml, or null for a chapter's index page. */
  title: string | null;
  /** Path relative to the docs dir, e.g. `chapter_sorting/bubble_sort.md`. */
  file: string;
}

export interface NavChapter {
  title: string;
  /** Number from "Chapter 11. Sorting", or null for unnumbered sections. */
  number: number | null;
  pages: NavPage[];
}

/** Reads the `nav:` tree of a hello-algo mkdocs.yml (two levels: chapter → pages). */
export function readNav(mkdocsPath: string): NavChapter[] {
  const lines = fs.readFileSync(mkdocsPath, 'utf8').split('\n');
  const start = lines.findIndex((l) => /^nav:\s*$/.test(l));
  if (start < 0) return [];
  const chapters: NavChapter[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const chapter = line.match(/^  - (.+):\s*$/);
    if (chapter) {
      const title = chapter[1].trim();
      const number = title.match(/^Chapter (\d+)\./)?.[1];
      chapters.push({ title, number: number === undefined ? null : Number(number), pages: [] });
      continue;
    }
    const titled = line.match(/^    - (.+?):\s*(\S+\.md)\s*$/);
    const bare = line.match(/^    - (\S+\.md)\s*$/);
    const current = chapters[chapters.length - 1];
    if (!current) continue;
    if (titled) current.pages.push({ title: titled[1].trim(), file: titled[2] });
    else if (bare) current.pages.push({ title: null, file: bare[1] });
  }
  return chapters;
}

/** `chapter_sorting/bubble_sort.md` → `/chapter_sorting/bubble_sort`; index pages → `/chapter_sorting/`. */
export function routeOf(file: string): string {
  return `/${file.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`;
}
