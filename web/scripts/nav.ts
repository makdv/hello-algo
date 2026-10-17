import fs from 'node:fs';

export interface NavPage {
  /** Title from mkdocs.yml, or null for a chapter's index page. */
  title: string | null;
  /** Path relative to the docs dir, e.g. `chapter_sorting/bubble_sort.md`. */
  file: string;
}

export interface NavChapter {
  title: string;
  /** Number from "Chapter 11. Sorting", "第 11 章", "Глава 11."; null for unnumbered sections. */
  number: number | null;
  pages: NavPage[];
}

const cleanTitle = (t: string) => t.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

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
      const title = cleanTitle(chapter[1]);
      const number = title.match(/(\d+)/)?.[1];
      chapters.push({ title, number: number === undefined ? null : Number(number), pages: [] });
      continue;
    }
    const titled = line.match(/^    - (.+?):\s*(\S+\.md)\s*$/);
    const bare = line.match(/^    - (\S+\.md)\s*$/);
    const current = chapters[chapters.length - 1];
    if (!current) continue;
    if (titled) current.pages.push({ title: cleanTitle(titled[1]), file: titled[2] });
    else if (bare) current.pages.push({ title: null, file: bare[1] });
  }
  return chapters;
}

/** `chapter_sorting/bubble_sort.md` → `/chapter_sorting/bubble_sort`; index pages → `/chapter_sorting/`. */
export function routeOf(file: string, prefix = ''): string {
  return `${prefix}/${file.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`;
}
