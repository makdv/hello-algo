import { useMemo, type CSSProperties } from 'react';
import { CodeView } from '../components/CodeView';
import { playerKeyHandler, Timeline, Transport } from '../components/Controls';
import { useCodeLang } from '../engine/useCodeLang';
import { usePlayer } from '../engine/usePlayer';
import type { LangId } from '../engine/types';
import type { Locale } from '../i18n/locale';
import { ui } from '../i18n/ui';
import type { Figure, LegendItem, StaticFigure, StepFigure, TableFigure } from './scene';
import { SceneView } from './SceneView';
import '../components/viz.css';
import './figures.css';

function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="ha-legend">
      {items.map((it, k) => (
        <li key={k}>
          <span className={`ha-legend__swatch ha-legend__swatch--${it.shape ?? 'rect'} ha-t--${it.tone}${it.dashed ? ' is-dashed' : ''}`} aria-hidden="true" />
          {it.text}
        </li>
      ))}
    </ul>
  );
}

function StaticView({ fig, locale, caption }: { fig: StaticFigure; locale: Locale; caption?: string }) {
  const { scene, legend, notes } = useMemo(() => fig.build(locale), [fig, locale]);
  return (
    <figure className="ha-fig">
      <div className="ha-fig__frame">
        <div className="ha-fig__stage ha-grid-paper">
          <SceneView scene={scene} label={caption ?? ''} />
        </div>
        {(legend?.length || notes?.length) && (
          <div className="ha-fig__foot">
            {legend && <Legend items={legend} />}
            {notes?.map((n, k) => (
              <p key={k} className="ha-fig__note">
                {n}
              </p>
            ))}
          </div>
        )}
      </div>
      {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
    </figure>
  );
}

function StepView({ fig, locale, caption }: { fig: StepFigure; locale: Locale; caption?: string }) {
  const t = ui(locale);
  const { frames, legend } = useMemo(() => fig.build(locale), [fig, locale]);
  const player = usePlayer(frames, fig.initialStep ?? 0);
  const sources = useMemo(() => fig.sources?.(locale) ?? {}, [fig, locale]);
  const langs = Object.keys(sources) as LangId[];
  const [lang, setLang] = useCodeLang(langs);
  const source = sources[lang] ?? sources[langs[0]];
  const frame = player.frame;
  const call = frame.call ?? fig.call;
  // The bar shows the running call; keep it for every step if any step has one, so nothing jumps.
  const hasBar = Boolean(legend || fig.call || frames.some((f) => f.call));

  return (
    <figure className="ha-player ha-fig">
      <div className="ha-player__frame" tabIndex={0} role="group" aria-label={t.visualizerAria(caption ?? call ?? '')} onKeyDown={playerKeyHandler(player)}>
        {hasBar && (
          <div className="ha-player__bar ha-fig__bar">
            <span className="ha-player__call">{call ?? '\u00a0'}</span>
            {legend && <Legend items={legend} />}
          </div>
        )}
        <div className="ha-fig__stage ha-grid-paper">
          <SceneView scene={frame.scene} label={caption ?? call ?? ''} />
        </div>
        {source && (
          <div className="ha-player__codeline">
            <CodeView source={source} lang={lang} kind={frame.kind} variant="line" />
            <label className="ha-select">
              <span className="ha-visually-hidden">{t.codeLanguage}</span>
              <select value={lang} onChange={(e) => setLang(e.target.value as LangId)}>
                {langs.map((l) => (
                  <option key={l} value={l}>
                    {sources[l]!.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="ha-player__narration" aria-live="polite">
          <span className="ha-player__step">
            {String(player.cur + 1).padStart(2, '0')} / {player.last + 1}
          </span>
          <span>{frame.say}</span>
        </div>
        <div className="ha-player__controls">
          <Transport player={player} t={t} showRestart />
          <Timeline player={player} tones={fig.tones} t={t} />
        </div>
      </div>
      {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
    </figure>
  );
}

function TableView({ fig, locale, caption }: { fig: TableFigure; locale: Locale; caption?: string }) {
  const { head, rows, columns = 1, mono = [] } = useMemo(() => fig.build(locale), [fig, locale]);
  const per = Math.ceil(rows.length / columns);
  const parts = Array.from({ length: columns }, (_, k) => rows.slice(k * per, (k + 1) * per));
  return (
    <figure className="ha-fig">
      <div className="ha-fig__frame">
        <div className="ha-fig__tables" style={{ ['--cols' as string]: columns } as CSSProperties}>
          {parts.map((part, k) => (
            <table key={k} className="ha-fig__table">
              <thead>
                <tr>
                  {head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {part.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className={mono.includes(c) ? 'is-mono' : undefined}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
      {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
    </figure>
  );
}

/** A redrawn book figure: a still scene, an animated sequence with step controls, or a table. */
export function FigureView({ fig, locale, caption }: { fig: Figure; locale: Locale; caption?: string }) {
  if (fig.type === 'table') return <TableView fig={fig} locale={locale} caption={caption} />;
  return fig.type === 'static' ? <StaticView fig={fig} locale={locale} caption={caption} /> : <StepView fig={fig} locale={locale} caption={caption} />;
}
