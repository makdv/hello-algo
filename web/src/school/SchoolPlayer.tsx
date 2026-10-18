import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ALGORITHMS, type AlgorithmMeta } from '../algorithms/registry';
import { usePlayer } from '../engine/usePlayer';
import { usePredict } from '../engine/usePredict';
import type { AlgorithmSpec, ArrayFrame, Mark } from '../engine/types';
import { type Locale, pick, prefixOf } from '../i18n/locale';
import { ui } from '../i18n/ui';
import './school.css';

const BUBBLE_COLORS = ['#E3E7EE', '#FF9FB2', '#FFC857', '#7FD1FF', '#B69CFF', '#7EE0A1', '#FFA36C', '#9EE6E0', '#F7A8E0', '#C9E86B'];
const SKY_KEY = 'ha-school-sky';
const starsKey = (id: string) => `ha-school-stars:${id}`;

type Sky = 'day' | 'night';

/** Stars earned per level, remembered in this browser. */
export function readStars(id: string): number {
  try {
    return Number(localStorage.getItem(starsKey(id))) || 0;
  } catch {
    return 0;
  }
}

function useSky(): [Sky, () => void] {
  const [sky, setSky] = useState<Sky>('day');
  useEffect(() => {
    try {
      if (localStorage.getItem(SKY_KEY) === 'night') setSky('night');
    } catch {
      // Storage unavailable: keep the day sky.
    }
  }, []);
  const toggle = () => {
    const next = sky === 'day' ? 'night' : 'day';
    setSky(next);
    try {
      localStorage.setItem(SKY_KEY, next);
    } catch {
      // Ignore.
    }
  };
  return [sky, toggle];
}

/** Header shared by the hub and every level: logo, level map, stars, sky and the grown-up view. */
export function SchoolShell({
  locale,
  current,
  stars,
  grownUpHref,
  children,
}: {
  locale: Locale;
  current?: string;
  stars?: number;
  grownUpHref: string;
  children: ReactNode;
}) {
  const t = ui(locale).school;
  const prefix = prefixOf(locale);
  const [sky, toggleSky] = useSky();
  const [earned, setEarned] = useState<Record<string, number>>({});
  useEffect(() => {
    setEarned(Object.fromEntries(ALGORITHMS.map((a) => [a.id, readStars(a.id)])));
  }, [stars]);

  return (
    <div className={`hs hs--${sky}`}>
      <header className="hs-header">
        <a className="hs-logo" href={`${prefix}/school/`}>
          <span className="hs-logo__face" aria-hidden="true">
            <span />
            <span />
          </span>
          hello algo
          <span className="hs-badge">{t.badge}</span>
        </a>
        <nav className="hs-levels" aria-label={t.levels}>
          {ALGORITHMS.map((a) => (
            <a
              key={a.id}
              href={`${prefix}/school/${a.id}`}
              aria-label={`${t.level(a.level)}: ${pick(a.title, locale)}`}
              aria-current={a.id === current ? 'page' : undefined}
              className={`hs-levels__dot${a.id === current ? ' is-current' : earned[a.id] ? ' is-done' : ''}`}
            >
              {a.level}
            </a>
          ))}
        </nav>
        <div className="hs-header__right">
          {stars !== undefined && (
            <div className="hs-pill" aria-label={t.stars(stars)}>
              <span className="hs-star" aria-hidden="true" />
              {stars}
            </div>
          )}
          <button type="button" className="hs-pill hs-pill--button" onClick={toggleSky}>
            {sky === 'day' ? t.nightSky : t.sunnyDay}
          </button>
          <a className="hs-pill hs-pill--dashed" href={grownUpHref}>
            {t.grownUp}
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}

/** A number drawn as a bubble character; bigger values are bigger bubbles. */
function Bubble({ value, mark, scale, color, looking, hopTag, out, whoosh }: {
  value: number;
  mark: Mark;
  scale: number;
  color: string;
  looking: 'left' | 'right' | null;
  hopTag: boolean;
  out: boolean;
  whoosh: string;
}) {
  return (
    <div className={`hs-bubble hs-bubble--${mark}${out ? ' hs-bubble--out' : ''}`}>
      <div className="hs-bubble__hat" aria-hidden="true">
        {mark === 'done' && <span className="hs-crown" />}
        {hopTag && <span className="hs-tag">{whoosh}</span>}
      </div>
      <div className="hs-bubble__body" style={{ ['--s' as string]: scale, background: color } as CSSProperties}>
        <span className="hs-eyes" aria-hidden="true">
          {[0, 1].map((k) => (
            <span key={k} className="hs-eye">
              <span className={`hs-pupil${looking ? ` hs-pupil--${looking}` : ''}`} />
            </span>
          ))}
        </span>
        <span className={mark === 'swp' ? 'hs-mouth hs-mouth--ooh' : 'hs-mouth'} aria-hidden="true" />
        <span className="hs-bubble__value">{value}</span>
      </div>
    </div>
  );
}

function Robot() {
  return (
    <div className="hs-robot" aria-hidden="true">
      <span className="hs-robot__ball" />
      <span className="hs-robot__stick" />
      <div className="hs-robot__head">
        <div className="hs-robot__screen">
          <span className="hs-robot__eyes">
            <span />
            <span />
          </span>
          <span className="hs-robot__smile" />
        </div>
      </div>
      <div className="hs-robot__body" />
    </div>
  );
}

export function RobotSays({ who, text }: { who: string; text: string }) {
  return (
    <div className="hs-guide">
      <Robot />
      <div className="hs-speech" aria-live="polite">
        <span className="hs-speech__who">{who}</span>
        <span className="hs-speech__text">{text}</span>
      </div>
    </div>
  );
}

/** The cartoon School view for one algorithm: bubbles, Algo the robot guide, and stars for correct guesses. */
export function SchoolPlayer<F extends ArrayFrame>({ spec, meta, locale }: { spec: AlgorithmSpec<F>; meta: AlgorithmMeta; locale: Locale }) {
  const t = ui(locale).school;
  const frames = useMemo(() => spec.trace(spec.defaultInput, spec.param?.default), [spec]);
  const player = usePlayer(frames);
  const [guessing, setGuessing] = useState(true);
  const predict = usePredict(spec, player, guessing, 'kid', locale);
  const [stars, setStars] = useState(0);
  const [peek, setPeek] = useState(false);

  useEffect(() => setStars(readStars(spec.id)), [spec.id]);

  const answer = (choiceId: string) => {
    const right = choiceId === predict.question?.answer;
    predict.answer(choiceId);
    if (right) {
      const next = stars + 1;
      setStars(next);
      try {
        localStorage.setItem(starsKey(spec.id), String(next));
      } catch {
        // Ignore.
      }
    }
  };

  const f = player.frame;
  const n = f.items.length;
  const max = Math.max(1, ...f.items.map((it) => it.value));
  const pointerAt = (label: string) => f.pointers.find((p) => p.label === label)?.index ?? null;
  const j = pointerAt('j');
  const cmpIdx = f.marks.map((m, k) => (m === 'cmp' ? k : -1)).filter((k) => k >= 0);
  const { current: round, total: rounds } = spec.school.rounds(f);
  const out = (k: number) => Boolean(f.range) && (k < f.range![0] || k > f.range![1]);

  let say = spec.narrate(f, 'kid', locale);
  if (predict.asking) say = predict.question!.prompt;
  else if (predict.result === 'right') say = `${t.yes} ${say}`;
  else if (predict.result === 'wrong') say = `${t.goodTry} ${say}`;

  const last = player.cur >= player.last;
  const title = pick(spec.title, locale);
  // Long arrays get smaller bubbles so they fit the scene.
  const fit = Math.min(1, 7 / Math.max(n, 1));

  return (
    <SchoolShell locale={locale} current={spec.id} stars={stars} grownUpHref={`${prefixOf(locale)}/${meta.page}`}>
      <main className="hs-main">
        <div className="hs-main__story">
          <div className="hs-title">
            <h1>{title}</h1>
            <span>{t.level(meta.level)}</span>
          </div>

          <section className="hs-scene" aria-label={title}>
            <span className="hs-scene__glow" aria-hidden="true" />
            <span className="hs-sun" aria-hidden="true" />
            <span className="hs-cloud hs-cloud--a" aria-hidden="true" />
            <span className="hs-cloud hs-cloud--b" aria-hidden="true" />
            <span className="hs-ground" aria-hidden="true" />
            <div
              className="hs-bubbles"
              style={{ ['--fit' as string]: fit, ['--n' as string]: Math.max(n, 1), ['--sum' as string]: f.items.reduce((a, it) => a + it.value / max, 0) } as CSSProperties}
              data-crowded={n > 7 ? 'true' : undefined}
              role="img"
              aria-label={f.items.map((it) => it.value).join(', ')}
            >
              {f.items.map((it, idx) => {
                const looking = cmpIdx.length === 2 && cmpIdx.includes(idx) ? (idx === Math.min(...cmpIdx) ? 'right' : 'left') : null;
                return (
                  <Bubble
                    key={it.id}
                    value={it.value}
                    mark={f.marks[idx]}
                    color={BUBBLE_COLORS[it.value % BUBBLE_COLORS.length]}
                    scale={it.value / max}
                    looking={looking}
                    hopTag={f.marks[idx] === 'swp' && j !== null && idx === j + 1}
                    out={out(idx)}
                    whoosh={t.whoosh}
                  />
                );
              })}
            </div>
            <span className="hs-scene__label hs-scene__label--left">{t.small}</span>
            <span className="hs-scene__label hs-scene__label--right">{t.big}</span>
          </section>

          <RobotSays who={t.algoSays} text={say} />

          {predict.asking ? (
            <div className="hs-actions">
              {predict.question!.choices.map((c) => (
                <button key={c.id} type="button" className={`hs-big hs-big--${c.tone}`} onClick={() => answer(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="hs-actions">
              <button type="button" className="hs-round" aria-label={t.goBack} onClick={player.prev}>
                ←
              </button>
              <button type="button" className="hs-big hs-big--go" onClick={last ? player.restart : player.next}>
                {last ? t.playAgain : t.next}
              </button>
            </div>
          )}
          <label className="hs-check">
            <input type="checkbox" checked={guessing} onChange={(e) => setGuessing(e.target.checked)} />
            {t.guessToggle}
          </label>
        </div>

        <aside className="hs-side">
          <div className="hs-card">
            <h2>{t.rule}</h2>
            <ol className="hs-rules">
              {pick(spec.school.rules, locale).map((r, k) => (
                <li key={k}>
                  <span className={`hs-rules__no hs-rules__no--${k % 3}`}>{k + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
          <div className="hs-card">
            <h2>{t.round(round, rounds)}</h2>
            <div className="hs-rounds" aria-hidden="true">
              {Array.from({ length: Math.min(rounds, 10) }, (_, k) => {
                const at = Math.ceil(((k + 1) * rounds) / Math.min(rounds, 10));
                return <span key={k} className={at < round || f.kind === 'end' ? 'is-done' : at === round ? 'is-now' : ''} />;
              })}
            </div>
          </div>
          <button type="button" className="hs-peek" aria-expanded={peek} onClick={() => setPeek((p) => !p)}>
            {peek ? t.hidePeek : t.peek}
          </button>
          {peek && <pre className="hs-code">{spec.school.peek}</pre>}
        </aside>
      </main>
    </SchoolShell>
  );
}
