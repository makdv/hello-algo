/** The book's languages: where each one's MkDocs sources live and its site-specific strings. */

export type LocaleId = 'en' | 'zh' | 'zh-hant' | 'ja' | 'ru';

export interface LocaleInfo {
  lang: LocaleId;
  label: string;
  /** Directory under the repo root holding `docs/`, `codes/` and `mkdocs.yml`. */
  source: string;
  /** Default titles for MkDocs admonitions written without a title. */
  admonitions: Record<string, string>;
  pythonTutor: string;
  bookNav: string;
  schoolNav: string;
}

/** English is the default locale and is served without a URL prefix. */
export const DEFAULT_LOCALE: LocaleId = 'en';

export const LOCALES: LocaleInfo[] = [
  {
    lang: 'en',
    label: 'English',
    source: 'en',
    admonitions: { abstract: 'Abstract', note: 'Note', tip: 'Tip', question: 'Question', quote: 'Quote', success: 'Success', info: 'Info', warning: 'Warning' },
    pythonTutor: 'run it step by step in Python Tutor',
    bookNav: 'Book',
    schoolNav: 'School',
  },
  {
    lang: 'zh',
    label: '简体中文',
    source: '.',
    admonitions: { abstract: '摘要', note: '备注', tip: '提示', question: '问题', quote: '引用', success: '成功', info: '信息', warning: '警告' },
    pythonTutor: '在 Python Tutor 中逐步运行',
    bookNav: '目录',
    schoolNav: '学堂',
  },
  {
    lang: 'zh-hant',
    label: '繁體中文',
    source: 'zh-hant',
    admonitions: { abstract: '摘要', note: '備註', tip: '提示', question: '問題', quote: '引用', success: '成功', info: '資訊', warning: '警告' },
    pythonTutor: '在 Python Tutor 中逐步執行',
    bookNav: '目錄',
    schoolNav: '學堂',
  },
  {
    lang: 'ja',
    label: '日本語',
    source: 'ja',
    admonitions: { abstract: '概要', note: '注記', tip: 'ヒント', question: '質問', quote: '引用', success: '成功', info: '情報', warning: '警告' },
    pythonTutor: 'Python Tutor でステップ実行',
    bookNav: '目次',
    schoolNav: 'スクール',
  },
  {
    lang: 'ru',
    label: 'Русский',
    source: 'ru',
    admonitions: {
      abstract: 'Аннотация',
      note: 'Примечание',
      tip: 'Совет',
      question: 'Вопрос',
      quote: 'Цитата',
      success: 'Успех',
      info: 'Информация',
      warning: 'Предупреждение',
    },
    pythonTutor: 'пошаговый запуск в Python Tutor',
    bookNav: 'Книга',
    schoolNav: 'Школа',
  },
];

/** URL prefix for a locale: '' for the default, '/zh' etc. otherwise. */
export const localePrefix = (lang: LocaleId) => (lang === DEFAULT_LOCALE ? '' : `/${lang}`);
