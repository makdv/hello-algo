import { codeSources, type RawByLocale } from '../../algorithms/codes';
import type { Locale } from '../../i18n/locale';

/** Text in every locale. */
export type T = Record<Locale, string>;

/** Fills `{name}` placeholders. */
export const fmt = (s: string, vars: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));

export const raw = (en: string, zh: string, zhHant: string, ja: string, ru: string): RawByLocale => ({ en, zh, 'zh-hant': zhHant, ja, ru });

/** Python and Java sources of free functions, with the lines for each step. */
export function funcSources(
  py: RawByLocale,
  java: RawByLocale,
  funcs: string[],
  anchors: { python: Record<string, string[]>; java: Record<string, string[]> },
) {
  return codeSources({
    python: { label: 'Python', raw: py, parts: funcs.map((func) => ({ func })), anchors: anchors.python },
    java: { label: 'Java', raw: java, parts: funcs.map((func) => ({ func })), anchors: anchors.java },
  });
}

/** Superscript digits and signs, for 2ⁿ, n², 2⁻³. */
export const sup = (s: string | number) =>
  String(s).replace(/[0-9n+\-−]/g, (c) => ({ n: 'ⁿ', '+': '⁺', '-': '⁻', '−': '⁻' })[c] ?? '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]);
