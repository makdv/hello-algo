import { useLang, usePage } from '@rspress/core/runtime';
import type { ReactNode } from 'react';
import './site-footer.css';

const ORIGINAL_REPO = 'https://github.com/krahets/hello-algo';
const OFFICIAL_SITE = 'https://www.hello-algo.com';
const LICENSE = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
const THIS_VERSION = 'https://github.com/makdv/hello-algo';

const a = (href: string, text: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

/**
 * Attribution required by the book's CC BY-NC-SA 4.0 license: credit, license,
 * and a clear note that this is a modified, unofficial version.
 */
const TEXT: Record<string, { credit: ReactNode; changes: ReactNode }> = {
  en: {
    credit: (
      <>
        Content from {a(ORIGINAL_REPO, 'Hello Algo')} by krahets and contributors, licensed under {a(LICENSE, 'CC BY-NC-SA 4.0')}.
      </>
    ),
    changes: (
      <>
        This is an unofficial, modified version with a redesigned site and interactive visualizers ({a(THIS_VERSION, 'source')}). The
        official site is {a(OFFICIAL_SITE, 'hello-algo.com')}.
      </>
    ),
  },
  zh: {
    credit: (
      <>
        内容来自 krahets 及贡献者的《{a(ORIGINAL_REPO, 'Hello 算法')}》，采用 {a(LICENSE, 'CC BY-NC-SA 4.0')} 许可协议。
      </>
    ),
    changes: (
      <>
        本站为非官方的修改版本，重新设计了网站并加入交互式可视化（{a(THIS_VERSION, '源码')}）。官方网站：{a(OFFICIAL_SITE, 'hello-algo.com')}。
      </>
    ),
  },
  'zh-hant': {
    credit: (
      <>
        內容來自 krahets 及貢獻者的《{a(ORIGINAL_REPO, 'Hello 演算法')}》，採用 {a(LICENSE, 'CC BY-NC-SA 4.0')} 授權條款。
      </>
    ),
    changes: (
      <>
        本站為非官方的修改版本，重新設計了網站並加入互動式視覺化（{a(THIS_VERSION, '原始碼')}）。官方網站：{a(OFFICIAL_SITE, 'hello-algo.com')}。
      </>
    ),
  },
  ja: {
    credit: (
      <>
        コンテンツは krahets とコントリビューターによる『{a(ORIGINAL_REPO, 'Hello アルゴリズム')}』に基づき、{a(LICENSE, 'CC BY-NC-SA 4.0')} で提供されています。
      </>
    ),
    changes: (
      <>
        本サイトは非公式の改変版で、サイトを再設計しインタラクティブな可視化を追加しています（{a(THIS_VERSION, 'ソース')}）。公式サイト：
        {a(OFFICIAL_SITE, 'hello-algo.com')}。
      </>
    ),
  },
  ru: {
    credit: (
      <>
        Материалы — {a(ORIGINAL_REPO, 'Hello Algo')} от krahets и соавторов, лицензия {a(LICENSE, 'CC BY-NC-SA 4.0')}.
      </>
    ),
    changes: (
      <>
        Это неофициальная изменённая версия с новым дизайном сайта и интерактивными визуализациями ({a(THIS_VERSION, 'исходный код')}). Официальный
        сайт — {a(OFFICIAL_SITE, 'hello-algo.com')}.
      </>
    ),
  },
};

export function SiteFooter() {
  const lang = useLang();
  const text = TEXT[lang] ?? TEXT.en;
  return (
    <footer className="ha-site-footer">
      <p>{text.credit}</p>
      <p>{text.changes}</p>
    </footer>
  );
}

/** Pages without the doc layout (home, School view, 404) get the footer at the very bottom. */
export function SiteFooterOutsideDocs() {
  const { page } = usePage();
  const pageType = page.pageType ?? 'doc';
  if (pageType === 'doc' || pageType === 'doc-wide') return null;
  return (
    <div className="ha-site-footer__outside">
      <SiteFooter />
    </div>
  );
}
