import type { LocaleId } from '../../scripts/locales.ts';

export type Locale = LocaleId;

export const LOCALE_IDS: Locale[] = ['en', 'zh', 'zh-hant', 'ja', 'ru'];

export const isLocale = (value: unknown): value is Locale => LOCALE_IDS.includes(value as Locale);

/** URL prefix of a locale: '' for English (the default), '/zh' etc. otherwise. */
export const prefixOf = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`);

/** A value per locale; missing locales fall back to English. */
export type Localized<T> = { en: T } & Partial<Record<Locale, T>>;

export const pick = <T,>(value: Localized<T>, locale: Locale): T => value[locale] ?? value.en;
