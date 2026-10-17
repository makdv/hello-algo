import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspress/core';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkHelloAlgo } from './plugins/remarkHelloAlgo';
import { readNav, routeOf } from './scripts/nav.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoDir = path.join(__dirname, '..');

/** Sidebar built from the book's own navigation in en/mkdocs.yml. */
function bookSidebar() {
  return readNav(path.join(repoDir, 'en/mkdocs.yml')).map((chapter) => {
    const index = chapter.pages.find((p) => p.title === null);
    const pages = chapter.pages.filter((p) => p.title !== null);
    if (!pages.length && index) return { text: chapter.title, link: routeOf(index.file) };
    return {
      text: chapter.title,
      ...(index ? { link: routeOf(index.file) } : {}),
      collapsible: true,
      collapsed: true,
      items: pages.map((p) => ({ text: p.title!, link: routeOf(p.file) })),
    };
  });
}

const THEME_IDS = ['lavender', 'lavender-dark', 'mint', 'ocean', 'sepia', 'contrast'];
const DARK_THEMES = ['lavender-dark', 'ocean'];

// Runs before first paint so the stored theme is applied without a flash.
const themeBootScript = `(function(){try{var ids=${JSON.stringify(THEME_IDS)};var dark=${JSON.stringify(DARK_THEMES)};var t=localStorage.getItem('ha-theme');if(ids.indexOf(t)<0){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'lavender-dark':'lavender';}var r=document.documentElement;r.setAttribute('data-ha-theme',t);var d=dark.indexOf(t)>=0;r.classList.toggle('dark',d);r.classList.toggle('rp-dark',d);r.style.colorScheme=d?'dark':'light';localStorage.setItem('rspress-theme-appearance',d?'dark':'light');}catch(e){}})();`;

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Hello Algo',
  description: 'Data structures and algorithms tutorial with interactive illustrations and ready-to-run code',
  lang: 'en',
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
    nav: [
      { text: 'Book', link: '/chapter_hello_algo/' },
      { text: 'Bubble sort demo', link: '/chapter_sorting/bubble_sort' },
      { text: 'School', link: '/school/bubble_sort' },
    ],
    sidebar: {
      '/': bookSidebar(),
    },
  },
  markdown: {
    globalComponents: ['CodeTabs', 'CodeTab', 'StepFrames'].map((c) => path.join(__dirname, `src/mdx/${c}.tsx`)),
    remarkPlugins: [remarkMath, [remarkHelloAlgo, { codesDir: path.join(repoDir, 'en/codes'), docsDir: path.join(__dirname, 'docs') }]],
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
        '@codes': path.join(__dirname, '../en/codes'),
      },
    },
  },
});
