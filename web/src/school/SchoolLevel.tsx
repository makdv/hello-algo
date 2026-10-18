import { useEffect, useState } from 'react';
import { findAlgorithm } from '../algorithms/registry';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';
import { isLocale, type Locale, prefixOf } from '../i18n/locale';
import { ui } from '../i18n/ui';
import { SchoolPlayer, SchoolShell } from './SchoolPlayer';

/** One School level page: loads the algorithm and shows it as a cartoon story. */
export function SchoolLevel({ algorithm, locale: lang }: { algorithm: string; locale: string }) {
  const locale: Locale = isLocale(lang) ? lang : 'en';
  const meta = findAlgorithm(algorithm);
  const [spec, setSpec] = useState<AlgorithmSpec<ArrayFrame> | null>(null);

  useEffect(() => {
    let live = true;
    meta?.load().then((s) => {
      if (live) setSpec(s);
    });
    return () => {
      live = false;
    };
  }, [meta]);

  if (!meta) return null;
  if (!spec) {
    return (
      <SchoolShell locale={locale} current={meta.id} grownUpHref={`${prefixOf(locale)}/${meta.page}`}>
        <p className="hs-loading">{ui(locale).loading}</p>
      </SchoolShell>
    );
  }
  return <SchoolPlayer spec={spec} meta={meta} locale={locale} />;
}
