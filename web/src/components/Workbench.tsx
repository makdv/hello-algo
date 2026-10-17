import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCodeLang } from '../engine/useCodeLang';
import { SPEEDS, usePlayer } from '../engine/usePlayer';
import type { AlgorithmSpec, ArrayFrame, LangId } from '../engine/types';
import { ArrayStage } from './ArrayStage';
import { CodeView } from './CodeView';
import { playerKeyHandler, Transport } from './Controls';

const KIND_LABEL: Record<string, [tone: string, label: string]> = {
  init: ['idle', 'start'],
  pass: ['idle', 'pass'],
  cmp: ['cmp', 'compare'],
  swp: ['swp', 'swap'],
  fixed: ['done', 'fixed'],
  end: ['done', 'done'],
};

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

const PRESETS: [name: string, make: () => number[]][] = [
  ['Random', randomInput],
  ['Sorted', () => [1, 2, 3, 4, 5, 6, 7]],
  ['Reversed', () => [7, 6, 5, 4, 3, 2, 1]],
  ['Few unique', () => [2, 1, 2, 1, 2, 1, 2]],
];

interface Props<F extends ArrayFrame> {
  spec: AlgorithmSpec<F>;
  input: number[];
  startAt: number;
  onClose(): void;
}

/** Explore mode: a full-screen workbench with custom input, both drawings, code, stats and a filmstrip. */
export function Workbench<F extends ArrayFrame>({ spec, input, startAt, onClose }: Props<F>) {
  const [values, setValues] = useState(input);
  const [text, setText] = useState(input.join(', '));
  const [error, setError] = useState('');
  const [view, setView] = useState<'cells' | 'bars'>('cells');
  const frames = useMemo(() => spec.trace(values), [spec, values]);
  const player = usePlayer(frames, startAt);
  const langs = Object.keys(spec.sources) as LangId[];
  const [lang, setLang] = useCodeLang(langs);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const frame = player.frame;

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

  const load = (next: number[]) => {
    setValues(next);
    setText(next.join(', '));
    setError('');
  };

  const run = () => {
    const parsed = parseInput(text);
    if (!parsed) {
      setError(`Enter 2 to ${MAX_LEN} whole numbers from 0 to 99, separated by commas.`);
      return;
    }
    load(parsed);
  };

  const lo = Math.max(0, Math.min(player.cur - 5, frames.length - 11));
  const film = frames.slice(lo, lo + 11);
  const [tone, label] = KIND_LABEL[frame.kind] ?? ['idle', frame.kind];
  const source = spec.sources[lang] ?? spec.sources[langs[0]]!;

  const stats: [string, string | number][] = [
    ...frame.vars.filter(([k]) => k === 'i' || k === 'j').map(([k, v]) => [k, v ?? '–'] as [string, string | number]),
    ...Object.entries(frame.stats),
  ];

  return createPortal(
    <div className="ha-workbench" role="dialog" aria-modal="true" aria-label={`Explore ${spec.title}`}>
      <header className="ha-workbench__header">
        <button ref={closeRef} type="button" className="ha-btn ha-workbench__close" onClick={onClose}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Back to the book
        </button>
        <div className="ha-workbench__title">
          <strong>{spec.title}</strong>
          <span>explore mode</span>
        </div>
      </header>

      <div className="ha-workbench__body" tabIndex={-1} onKeyDown={playerKeyHandler(player)}>
        <section className="ha-workbench__main" aria-label="Stage">
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
            <button type="button" className="ha-btn ha-btn--primary" onClick={run}>
              Run
            </button>
            {PRESETS.map(([name, make]) => (
              <button key={name} type="button" className="ha-btn" onClick={() => load(make())}>
                {name}
              </button>
            ))}
            <div className="ha-segmented ha-workbench__views" role="group" aria-label="Drawing">
              {(['cells', 'bars'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} className="ha-segmented__item" onClick={() => setView(v)}>
                  {v === 'cells' ? 'Cells' : 'Bars'}
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
            <span className={`ha-kind ha-mark--${tone}`}>{label}</span>
            <span>{spec.narrate(frame, 'reader')}</span>
          </div>
        </section>

        <aside className="ha-workbench__side" aria-label="Code and state">
          <div className="ha-tabs" role="tablist" aria-label="Code language">
            {langs.map((l) => (
              <button key={l} type="button" role="tab" aria-selected={lang === l} className="ha-tabs__tab" onClick={() => setLang(l)}>
                {spec.sources[l]!.label}
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
        <Transport player={player} showRestart />
        <div className="ha-segmented" role="group" aria-label="Speed">
          {SPEEDS.map((s) => (
            <button key={s} type="button" aria-pressed={player.speed === s} className="ha-segmented__item ha-mono" onClick={() => player.setSpeed(s)}>
              {s}×
            </button>
          ))}
        </div>
        <div className="ha-film" aria-label="Steps">
          {film.map((f, k) => {
            const idx = lo + k;
            const max = Math.max(1, ...f.items.map((it) => it.value));
            return (
              <button
                key={idx}
                type="button"
                className={`ha-film__frame${idx === player.cur ? ' is-current' : ''}`}
                aria-label={`Go to step ${idx + 1}`}
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
