import 'katex/dist/katex.min.css';
import { Layout as BaseLayout } from '@rspress/core/theme-original';
import { ThemePicker } from '../src/theme/ThemePicker';

function Layout() {
  return <BaseLayout afterNavMenu={<ThemePicker />} />;
}

export { Layout };
export * from '@rspress/core/theme-original';
