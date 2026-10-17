import { useCallback, useEffect, useState } from 'react';
import type { LangId } from './types';

const KEY = 'ha-code-lang';
const EVENT = 'ha-code-lang-change';

/** The reader's code language, shared by every player on the site and remembered between visits. */
export function useCodeLang(available: LangId[]): [LangId, (lang: LangId) => void] {
  const [lang, setLangState] = useState<LangId>(available[0]);
  const availableKey = available.join(',');

  useEffect(() => {
    const read = () => {
      try {
        const stored = localStorage.getItem(KEY) as LangId | null;
        if (stored && available.includes(stored)) setLangState(stored);
      } catch {
        // Storage unavailable: keep the default language.
      }
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
    // Keyed by the language list's contents, not the array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableKey]);

  const setLang = useCallback((next: LangId) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Ignore: the choice still applies on this page.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [lang, setLang];
}
