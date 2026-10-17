import { useEffect, useState } from 'react';
import { ALGORITHMS } from '../algorithms/registry';
import { isLocale, type Locale, pick, prefixOf } from '../i18n/locale';
import { ui } from '../i18n/ui';
import { readStars, RobotSays, SchoolShell } from './SchoolPlayer';

const MINI = ['#FF9FB2', '#FFC857', '#7FD1FF', '#B69CFF', '#7EE0A1', '#FFA36C'];

/** The School's start page: every level as a card with the stars earned so far. */
export function SchoolHub({ locale: lang }: { locale: string }) {
  const locale: Locale = isLocale(lang) ? lang : 'en';
  const t = ui(locale).school;
  const prefix = prefixOf(locale);
  const [stars, setStars] = useState<Record<string, number>>({});
  useEffect(() => setStars(Object.fromEntries(ALGORITHMS.map((a) => [a.id, readStars(a.id)]))), []);

  return (
    <SchoolShell locale={locale} grownUpHref={`${prefix}/`}>
      <main className="hs-hub">
        <h1 className="hs-hub__title">{t.hubTitle}</h1>
        <RobotSays who={t.algoSays} text={t.hubIntro} />
        <ol className="hs-hub__levels">
          {ALGORITHMS.map((a, k) => (
            <li key={a.id}>
              <a className="hs-hub__card" href={`${prefix}/school/${a.id}`}>
                <span className="hs-hub__level">{t.level(a.level)}</span>
                <span className="hs-hub__bubbles" aria-hidden="true">
                  {[0, 1, 2].map((b) => (
                    <span key={b} style={{ background: MINI[(k + b) % MINI.length], width: 22 + b * 8, height: 22 + b * 8 }} />
                  ))}
                </span>
                <span className="hs-hub__name">{pick(a.title, locale)}</span>
                <span className="hs-hub__foot">
                  <span className="hs-hub__stars" aria-label={t.stars(stars[a.id] ?? 0)}>
                    <span className="hs-star" aria-hidden="true" />
                    {stars[a.id] ?? 0}
                  </span>
                  <span className="hs-hub__start">{t.start} →</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </main>
    </SchoolShell>
  );
}
