import { useEffect, useState } from 'react';
import { createCssVariablesTheme, createHighlighterCore, type HighlighterCore, type ThemedToken } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { LangId } from './types';

// Same theme Rspress uses for code blocks, so player code follows the site palette.
const cssVariablesTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [cssVariablesTheme],
    langs: [import('shiki/langs/python.mjs'), import('shiki/langs/java.mjs')],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** Highlighted tokens per line, or null until the highlighter has loaded (plain text is shown meanwhile). */
export function useCodeTokens(code: string, lang: LangId): ThemedToken[][] | null {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  useEffect(() => {
    let live = true;
    setTokens(null);
    getHighlighter()
      .then((h) => {
        if (live) setTokens(h.codeToTokensBase(code, { lang, theme: 'css-variables' }));
      })
      .catch(() => {
        // Grammar not bundled for this language: keep plain text.
      });
    return () => {
      live = false;
    };
  }, [code, lang]);
  return tokens;
}
