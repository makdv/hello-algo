import type { Locale } from '../i18n/locale';
import { extractSnippet } from '../engine/snippets';
import type { LangId, SourceSpec } from '../engine/types';

/** Raw source files of one algorithm, per locale (comments differ, code is the same). */
export type RawByLocale = { en: string } & Partial<Record<Locale, string>>;

interface CodeLang {
  label: string;
  raw: RawByLocale;
  /** Functions (and methods, with `cls`) to show, in order. */
  parts: { cls?: string; func: string }[];
  /** Event kind → substrings of lines to highlight. Code is identical across locales, so one set fits all. */
  anchors: Record<string, string[]>;
}

/** Builds `AlgorithmSpec.sources`: the shown code per language, in the page's locale. */
export function codeSources(langs: Partial<Record<LangId, CodeLang>>) {
  const cache = new Map<Locale, Partial<Record<LangId, SourceSpec>>>();
  return (locale: Locale) => {
    const hit = cache.get(locale);
    if (hit) return hit;
    const out: Partial<Record<LangId, SourceSpec>> = {};
    for (const [lang, spec] of Object.entries(langs) as [LangId, CodeLang][]) {
      const raw = spec.raw[locale] ?? spec.raw.en;
      const code = spec.parts
        .map((p) => extractSnippet(raw, lang, { cls: p.cls ?? '', func: p.func }))
        .filter((c): c is string => Boolean(c))
        .join('\n\n');
      out[lang] = { label: spec.label, code, anchors: spec.anchors };
    }
    cache.set(locale, out);
    return out;
  };
}
