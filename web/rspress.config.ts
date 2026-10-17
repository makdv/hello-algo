import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspress/core';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkHelloAlgo } from './plugins/remarkHelloAlgo';
import { DEFAULT_LOCALE, LOCALES, localePrefix } from './scripts/locales.ts';
import { readNav, routeOf } from './scripts/nav.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoDir = path.join(__dirname, '..');

/** Sidebar for one locale, built from that book's own navigation in mkdocs.yml. */
function bookSidebar(source: string, prefix: string) {
  return readNav(path.join(repoDir, source, 'mkdocs.yml')).map((chapter) => {
    const index = chapter.pages.find((p) => p.title === null);
    const pages = chapter.pages.filter((p) => p.title !== null);
    if (!pages.length && index) return { text: chapter.title, link: routeOf(index.file, prefix) };
    return {
      text: chapter.title,
      ...(index ? { link: routeOf(index.file, prefix) } : {}),
      collapsible: true,
      collapsed: true,
      items: pages.map((p) => ({ text: p.title!, link: routeOf(p.file, prefix) })),
    };
  });
}

/** Rspress UI strings for the locales it does not translate itself (it ships zh and en). */
const UI_TEXT: Record<string, Record<string, string>> = {
  outlineTitle: { 'zh-hant': '本頁目錄', ja: 'このページ', ru: 'На этой странице' },
  prevPageText: { 'zh-hant': '上一頁', ja: '前へ', ru: 'Назад' },
  nextPageText: { 'zh-hant': '下一頁', ja: '次へ', ru: 'Далее' },
  searchPlaceholderText: { 'zh-hant': '搜尋', ja: '検索', ru: 'Поиск' },
  searchNoResultsText: { 'zh-hant': '沒有找到結果', ja: '結果が見つかりません', ru: 'Ничего не найдено' },
  searchPanelCancelText: { 'zh-hant': '取消', ja: 'キャンセル', ru: 'Отмена' },
  searchSuggestedQueryText: { 'zh-hant': '試試搜尋', ja: '次で検索', ru: 'Попробуйте' },
  languagesText: { 'zh-hant': '語言', ja: '言語', ru: 'Язык' },
  menuTitle: { 'zh-hant': '選單', ja: 'メニュー', ru: 'Меню' },
  scrollToTopText: { 'zh-hant': '回到頂部', ja: 'トップへ戻る', ru: 'Наверх' },
  notFoundText: { 'zh-hant': '頁面不存在', ja: 'ページが見つかりません', ru: 'Страница не найдена' },
  takeMeHomeText: { 'zh-hant': '返回首頁', ja: 'ホームへ戻る', ru: 'На главную' },
  codeButtonGroupCopyButtonText: { 'zh-hant': '複製', ja: 'コピー', ru: 'Копировать' },
  codeButtonGroupWrapButtonText: { 'zh-hant': '自動換行', ja: '折り返し', ru: 'Перенос строк' },
  versionsText: { 'zh-hant': '版本', ja: 'バージョン', ru: 'Версии' },
  themeText: { 'zh-hant': '主題', ja: 'テーマ', ru: 'Тема' },
  copyMarkdownText: { 'zh-hant': '複製 Markdown', ja: 'Markdown をコピー', ru: 'Копировать Markdown' },
  copyMarkdownLinkText: { 'zh-hant': '複製 Markdown 連結', ja: 'Markdown リンクをコピー', ru: 'Копировать ссылку на Markdown' },
  openInText: { 'zh-hant': '在 {{name}} 中開啟', ja: '{{name}} で開く', ru: 'Открыть в {{name}}' },
  lastUpdatedText: { 'zh-hant': '最後更新時間', ja: '最終更新', ru: 'Последнее обновление' },
  lastUpdatedAuthorText: { 'zh-hant': '作者', ja: '作成者', ru: 'Автор' },
  editLinkText: { 'zh-hant': '編輯此頁', ja: 'このページを編集', ru: 'Редактировать страницу' },
  sourceCodeText: { 'zh-hant': '原始碼', ja: 'ソースコード', ru: 'Исходный код' },
  'overview.filterNameText': { 'zh-hant': '篩選', ja: 'フィルター', ru: 'Фильтр' },
  'overview.filterPlaceholderText': { 'zh-hant': '輸入關鍵字', ja: 'キーワードを入力', ru: 'Введите ключевое слово' },
  'overview.filterNoResultText': { 'zh-hant': '沒有符合的項目', ja: '一致する項目がありません', ru: 'Ничего не найдено' },
  promptCopyText: { 'zh-hant': '複製', ja: 'コピー', ru: 'Копировать' },
  promptCopiedText: { 'zh-hant': '已複製', ja: 'コピーしました', ru: 'Скопировано' },
  promptExpandText: { 'zh-hant': '展開', ja: '展開', ru: 'Развернуть' },
  promptCollapseText: { 'zh-hant': '收合', ja: '折りたたむ', ru: 'Свернуть' },
};

const THEME_IDS = ['lavender', 'lavender-dark', 'mint', 'ocean', 'sepia', 'contrast'];
const DARK_THEMES = ['lavender-dark', 'ocean'];

// Runs before first paint so the stored theme is applied without a flash.
const themeBootScript = `(function(){try{var ids=${JSON.stringify(THEME_IDS)};var dark=${JSON.stringify(DARK_THEMES)};var t=localStorage.getItem('ha-theme');if(ids.indexOf(t)<0){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'lavender-dark':'lavender';}var r=document.documentElement;r.setAttribute('data-ha-theme',t);var d=dark.indexOf(t)>=0;r.classList.toggle('dark',d);r.classList.toggle('rp-dark',d);r.style.colorScheme=d?'dark':'light';localStorage.setItem('rspress-theme-appearance',d?'dark':'light');}catch(e){}})();`;

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Hello Algo',
  description: 'Data structures and algorithms tutorial with interactive illustrations and ready-to-run code',
  lang: DEFAULT_LOCALE,
  locales: LOCALES.map(({ lang, label }) => ({ lang, label })),
  i18nSource: (defaults) => {
    const merged = { ...defaults };
    for (const [key, values] of Object.entries(UI_TEXT)) merged[key] = { ...(defaults[key] ?? {}), ...values };
    return merged;
  },
  icon: '/favicon.png',
  logoText: 'Hello Algo',
  globalStyles: path.join(__dirname, 'theme/tokens.css'),
  head: [
    `<script>${themeBootScript}</script>`,
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Fredoka:wght@400;500;600;700&display=swap',
      },
    ],
  ],
  themeConfig: {
    darkMode: true,
    socialLinks: [{ icon: 'github', mode: 'link', content: 'https://github.com/krahets/hello-algo' }],
    locales: LOCALES.map(({ lang, label, source, bookNav, schoolNav }) => {
      const prefix = localePrefix(lang);
      const start = readNav(path.join(repoDir, source, 'mkdocs.yml')).find((c) => c.pages.length)?.pages[0];
      return {
        lang,
        label,
        nav: [
          { text: bookNav, link: start ? routeOf(start.file, prefix) : `${prefix}/` },
          { text: schoolNav, link: `${prefix}/school/` },
        ],
        sidebar: { [`${prefix}/`]: bookSidebar(source, prefix) },
      };
    }),
  },
  markdown: {
    globalComponents: ['CodeTabs', 'CodeTab', 'StepFrames', 'AlgoFigure', 'Fig'].map((c) => path.join(__dirname, `src/mdx/${c}.tsx`)),
    remarkPlugins: [
      remarkMath,
      [
        remarkHelloAlgo,
        {
          docsDir: path.join(__dirname, 'docs'),
          codesDirs: Object.fromEntries(LOCALES.map((l) => [l.lang, path.join(repoDir, l.source, 'codes')])),
        },
      ],
    ],
    rehypePlugins: [rehypeKatex],
  },
  builderConfig: {
    tools: {
      // Source files from ../en/codes are imported as plain text for the visualizers.
      rspack: (_config, { appendRules }) => {
        appendRules({ resourceQuery: /raw/, test: /\.(py|java|cpp|c|h|go|rs|ts|js|swift|kt|rb|dart|zig|cs)$/, type: 'asset/source' });
      },
    },
    resolve: {
      alias: {
        '@viz': path.join(__dirname, 'src'),
        ...Object.fromEntries(LOCALES.map((l) => [`@codes-${l.lang}`, path.join(repoDir, l.source, 'codes')])),
      },
    },
  },
});
