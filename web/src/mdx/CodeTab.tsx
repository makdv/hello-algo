import type { ReactNode } from 'react';
import type { LangId } from '../engine/types';

/** One language inside <CodeTabs>; the parent reads `lang` and `label`. */
export default function CodeTab({ children }: { lang: LangId; label: string; children?: ReactNode }) {
  return <>{children}</>;
}
