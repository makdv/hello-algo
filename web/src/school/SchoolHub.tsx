import { useEffect, useState } from 'react';
import { isLocale, type Locale, pick, prefixOf } from '../i18n/locale';
import { ui } from '../i18n/ui';
import { LESSONS, UNITS } from './lessons/catalog';
import { readDone, readStars, RobotSays, SchoolShell } from './SchoolPlayer';
import { lessonText } from './text';

const UNIT_COLORS = ['#7FD1FF', '#7EE0A1', '#FFC857', '#FF9FB2'];

/** The School's map: every unit with its lessons, the stars earned and what is done. */
export function SchoolHub({ locale: lang }: { locale: string }) {
  const locale: Locale = isLocale(lang) ? lang : 'en';
  const t = ui(locale).school;
  const lt = lessonText(locale);
  const prefix = prefixOf(locale);
  const [progress, setProgress] = useState<Record<string, { stars: number; done: boolean }>>({});
  useEffect(() => setProgress(Object.fromEntries(LESSONS.map((l) => [l.id, { stars: readStars(l.id), done: readDone(l.id) }]))), []);

  return (
    <SchoolShell locale={locale} grownUpHref={`${prefix}/`}>
      <main className="hs-hub">
        <h1 className="hs-hub__title">{t.hubTitle}</h1>
        <RobotSays who={t.algoSays} text={lt.hubIntro} />
        {UNITS.map((unit, u) => (
          <section key={unit.id} className="hs-unit" style={{ ['--unit' as string]: UNIT_COLORS[u % UNIT_COLORS.length] }}>
            <h2 className="hs-unit__title">
              <span className="hs-unit__no">{lt.unit(u + 1)}</span>
              {pick(unit.title, locale)}
            </h2>
            <ol className="hs-hub__levels">
              {LESSONS.filter((l) => l.unit === unit.id).map((l) => {
                const p = progress[l.id];
                return (
                  <li key={l.id}>
                    <a className={`hs-hub__card${p?.done ? ' is-done' : ''}`} href={`${prefix}/school/${l.id}`}>
                      <span className="hs-hub__level">{lt.lesson(LESSONS.indexOf(l) + 1)}</span>
                      <span className="hs-hub__name">{pick(l.title, locale)}</span>
                      <span className="hs-hub__foot">
                        <span className="hs-hub__stars" aria-label={t.stars(p?.stars ?? 0)}>
                          <span className="hs-star" aria-hidden="true" />
                          {p?.stars ?? 0}
                        </span>
                        <span className="hs-hub__start">{p?.done ? `✓ ${lt.completed}` : `${t.start} →`}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </SchoolShell>
  );
}
