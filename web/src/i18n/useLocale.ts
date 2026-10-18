import { useLang } from '@rspress/core/runtime';
import { isLocale, type Locale } from './locale';

/** The page's locale, as Rspress resolves it from the URL. */
export function useLocale(): Locale {
  const lang = useLang();
  return isLocale(lang) ? lang : 'en';
}
