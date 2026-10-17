import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCodeLang } from '../engine/useCodeLang';
import { SPEEDS, usePlayer } from '../engine/usePlayer';
import type { AlgorithmSpec, ArrayFrame, LangId } from '../engine/types';
import { pick } from '../i18n/locale';
import { useLocale } from '../i18n/useLocale';
import { ui } from '../i18n/ui';
import { ArrayStage } from './ArrayStage';
import { CodeView } from './CodeView';
import { playerKeyHandler, Transport } from './Controls';

const MAX_LEN = 10;

function parseInput(text: string): number[] | null {
  const values = text
    .split(/[\s,[\]]+/)
    .filter(Boolean)
    .map(Number);
  if (values.length < 2 || values.length > MAX_LEN) return null;
  if (values.some((v) => !Number.isInteger(v) || v < 0 || v > 99)) return null;
  return values;
}

const randomInput = () => Array.from({ length: 7 }, () => 1 + Math.floor(Math.random() * 20));

const PRESETS: [key: 'random' | 'sorted' | 'reversed' | 'fewUnique', make: () => number[]][] = [
  ['random', randomInput],
  ['sorted', () => [1, 2, 3, 4, 5, 6, 7]],
  ['reversed', () => [7, 6, 5, 4, 3, 2, 1]],
  ['fewUnique', () => [2, 1, 2, 1, 2, 1, 2]],
];

interface Props<F extends ArrayFrame> {
  spec: AlgorithmSpec<F>;
  input: number[];
  param?: number;
  startAt: number;
  onClose(): void;
}

/** Explore mode: a full-screen workbench with custom input, both drawings, code, stats and a filmstrip. */
export function Workbench<F extends ArrayFrame>({ spec, input, param, startAt, onClose }: Props<F>) {
  const locale = useLocale();
  const t = ui(locale);
  const [values, setValues] = useState(input);
  const [paramValue, setParamValue] = useState(param);
  const [text, setText] = useState(input.join(', '));
  const [paramText, setParamText] = useState(param === undefined ? '' : String(param));
  const [error, setError] = useState('');
  const [view, setView] = useState<'cells' | 'bars'>('cells');
  const frames = useMemo(() => spec.trace(values, paramValue), [spec, values, paramValue]);
  const player = usePlayer(frames, startAt);
  const sources = spec.sources(locale);
  const langs = Object.keys(sources) as LangId[];
  const [lang, setLang] = useCodeLang(langs);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const frame = player.frame;
  const title = pick(spec.title, locale);

  // Runs once per opening: trap the page scroll, focus the dialog, restore focus on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, []);

  const load = (next: number[], nextParam = paramValue) => {
    setValues(next);
    setParamValue(nextParam);
    setText(next.join(', '));
    setError('');
  };

  const run = () => {
    const parsed = parseInput(text);
    const p = spec.param ? Number(paramText) : undefined;
    if (!parsed || (spec.param && (!Number.isInteger(p) || p! < 0 || p! > 99))) {
      setError(t.inputError(MAX_LEN));
      return;
    }
    load(parsed, p);
  };

  const lo = Math.max(0, Math.min(player.cur - 5, frames.length - 11));
  const film = frames.slice(lo, lo + 11);
  const tone = spec.tones[frame.kind] ?? 'idle';
  const source = sources[lang] ?? sources[langs[0]]!;

  const stats: [string, string | number][] = [
    ...frame.vars.filter(([k]) => ['i', 'j', 'k', 'm'].includes(k)).map(([k, v]) => [k, v ?? '–'] as [string, string | number]),
    ...Object.entries(frame.stats).map(([k, v]) => [t.stats[k] ?? k, v] as [string, string | number]),
  ];

  return createPortal(
    <div className="ha-workbench" role="dialog" aria-modal="true" aria-label={`${t.explore}: ${title}`}>
      <header className="ha-workbench__header">
        <button ref={closeRef} type="button" className="ha-btn ha-workbench__close" onClick={onClose}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {t.backToBook}
        </button>
        <div className="ha-workbench__title">
          <strong>{title}</strong>
          <span>{t.exploreMode}</span>
        </div>
      </header>

      <div className="ha-workbench__body" tabIndex={-1} onKeyDown={playerKeyHandler(player)}>
        <section className="ha-workbench__main" aria-label={title}>
          <div className="ha-workbench__inputs">
            <label className="ha-workbench__input">
              <span>nums =</span>
              <input
                value={text}
                aria-invalid={Boolean(error)}
                aria-describedby="ha-workbench-error"
                onChange={(e) => {
                  setText(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') run();
                }}
              />
            </label>
            {spec.param && (
              <label className="ha-workbench__input ha-workbench__input--param">
                <span>{pick(spec.param.label, locale)} =</span>
                <input
                  value={paramText}
                  inputMode="numeric"
                  aria-invalid={Boolean(error)}
                  aria-describedby="ha-workbench-error"
                  onChange={(e) => {
                    setParamText(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') run();
                  }}
                />
              </label>
            )}
            <button type="button" className="ha-btn ha-btn--primary" onClick={run}>
              {t.run}
            </button>
            {PRESETS.map(([key, make]) => (
              <button key={key} type="button" className="ha-btn" onClick={() => load(make())}>
                {t.presets[key]}
              </button>
            ))}
            <div className="ha-segmented ha-workbench__views" role="group" aria-label={t.drawing}>
              {(['cells', 'bars'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} className="ha-segmented__item" onClick={() => setView(v)}>
                  {v === 'cells' ? t.cells : t.bars}
                </button>
              ))}
            </div>
          </div>
          <div id="ha-workbench-error" className="ha-workbench__error" role="alert">
            {error}
          </div>

          <div className="ha-workbench__stage ha-grid-paper">
            <ArrayStage frame={frame} view={view} size="fluid-lg" />
          </div>

          <div className="ha-workbench__narration" aria-live="polite">
            <span className={`ha-kind ha-mark--${tone}`}>{t.kinds[frame.kind] ?? frame.kind}</span>
            <span>{spec.narrate(frame, 'reader', locale)}</span>
          </div>
        </section>

        <aside className="ha-workbench__side" aria-label={t.codeLanguage}>
          <div className="ha-tabs" role="tablist" aria-label={t.codeLanguage}>
            {langs.map((l) => (
              <button key={l} type="button" role="tab" aria-selected={lang === l} className="ha-tabs__tab" onClick={() => setLang(l)}>
                {sources[l]!.label}
              </button>
            ))}
          </div>
          <CodeView source={source} lang={lang} kind={frame.kind} />
          <div className="ha-stats">
            {stats.map(([k, v]) => (
              <div key={k} className="ha-stat">
                <span className="ha-stat__label">{k}</span>
                <span className="ha-stat__value">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className="ha-workbench__footer">
        <Transport player={player} t={t} showRestart />
        <div className="ha-segmented" role="group" aria-label={t.speed}>
          {SPEEDS.map((s) => (
            <button key={s} type="button" aria-pressed={player.speed === s} className="ha-segmented__item ha-mono" onClick={() => player.setSpeed(s)}>
              {s}×
            </button>
          ))}
        </div>
        <div className="ha-film" aria-label={t.steps}>
          {film.map((f, k) => {
            const idx = lo + k;
            const max = Math.max(1, ...f.items.map((it) => it.value));
            return (
              <button
                key={idx}
                type="button"
                className={`ha-film__frame${idx === player.cur ? ' is-current' : ''}`}
                aria-label={t.stepAria(idx + 1)}
                aria-current={idx === player.cur ? 'step' : undefined}
                onClick={() => player.go(idx)}
              >
                <span className="ha-film__bars" aria-hidden="true">
                  {f.items.map((it, b) => (
                    <span key={it.id} className={`ha-film__bar ha-tone--${f.marks[b]}`} style={{ height: 3 + Math.round(25 * (it.value / max)) }} />
                  ))}
                </span>
                <span className="ha-film__no">{idx + 1}</span>
              </button>
            );
          })}
        </div>
        <span className="ha-mono ha-muted">
          {player.cur + 1} / {player.last + 1}
        </span>
      </footer>
    </div>,
    document.body,
  );
}
