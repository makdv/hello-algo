import fs from 'node:fs';
import path from 'node:path';
import { LANG_INFO, type SnippetLang } from './snippets';

/**
 * Finds `codes/<lang>/<chapter>/<file>.<ext>`, falling back to other chapters
 * because a few pages reference code that lives in a neighbouring chapter.
 */
export function findCodeFile(codesDir: string, lang: SnippetLang, chapter: string, file: string): string | null {
  const name = `${file}.${LANG_INFO[lang].ext}`;
  const direct = path.join(codesDir, lang, chapter, name);
  if (fs.existsSync(direct)) return direct;
  const langDir = path.join(codesDir, lang);
  if (!fs.existsSync(langDir)) return null;
  for (const dir of fs.readdirSync(langDir)) {
    const candidate = path.join(langDir, dir, name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}
