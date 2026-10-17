import 'katex/dist/katex.min.css';
import { Layout as BaseLayout } from '@rspress/core/theme-original';
import { SiteFooter, SiteFooterOutsideDocs } from '../src/theme/SiteFooter';
import { ThemePicker } from '../src/theme/ThemePicker';

function Layout() {
  return <BaseLayout afterNavMenu={<ThemePicker />} afterDocFooter={<SiteFooter />} bottom={<SiteFooterOutsideDocs />} />;
}

export { Layout };
export * from '@rspress/core/theme-original';
