import { useEffect, useMemo, useState } from 'react';
import { usePlayer } from '../engine/usePlayer';
import { usePredict } from '../engine/usePredict';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';
import './school.css';

const BUBBLE_COLORS = ['#E3E7EE', '#FF9FB2', '#FFC857', '#7FD1FF', '#B69CFF', '#7EE0A1', '#FFA36C', '#9EE6E0', '#F7A8E0', '#C9E86B'];
const MODE_KEY = 'ha-school-sky';
const STARS_KEY = 'ha-school-stars';

type Sky = 'day' | 'night';

interface Props<F extends ArrayFrame> {
  spec: AlgorithmSpec<F>;
  title: string;
  level: number;
  levelNote: string;
  grownUpHref: string;
  rules: string[];
  peekCode: string;
}

/** A number drawn as a bubble character; bigger values are bigger bubbles. */
function Bubble({ value, mark, scale, color, looking, hopTag }: {
  value: number;
  mark: ArrayFrame['marks'][number];
  /** value / max, from 0 to 1. */
  scale: number;
  color: string;
  looking: 'left' | 'right' | null;
  hopTag: boolean;
}) {
  return (
    <div className={`hs-bubble hs-bubble--${mark}`}>
      <div className="hs-bubble__hat" aria-hidden="true">
        {mark === 'done' && <span className="hs-crown" />}
        {hopTag && <span className="hs-tag">Whoosh!</span>}
      </div>
      <div className="hs-bubble__body" style={{ ['--s' as string]: scale, background: color }}>
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

/** The cartoon School view: bubble characters, Algo the robot guide, and stars for correct guesses. */
export function SchoolPlayer<F extends ArrayFrame>({ spec, title, level, levelNote, grownUpHref, rules, peekCode }: Props<F>) {
  const frames = useMemo(() => spec.trace(spec.defaultInput), [spec]);
  const player = usePlayer(frames);
  const [guessing, setGuessing] = useState(true);
  const predict = usePredict(spec, player, guessing, 'kid');
  const [sky, setSky] = useState<Sky>('day');
  const [stars, setStars] = useState(0);
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(MODE_KEY) === 'night') setSky('night');
      setStars(Number(localStorage.getItem(STARS_KEY)) || 0);
    } catch {
      // Storage unavailable: start fresh.
    }
  }, []);

  const toggleSky = () => {
    const next = sky === 'day' ? 'night' : 'day';
    setSky(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // Ignore.
    }
  };

  const answer = (choiceId: string) => {
    const right = choiceId === predict.question?.answer;
    predict.answer(choiceId);
    if (right) {
      const next = stars + 1;
      setStars(next);
      try {
        localStorage.setItem(STARS_KEY, String(next));
      } catch {
        // Ignore.
      }
    }
  };

  const f = player.frame;
  const n = f.items.length;
  const max = Math.max(1, ...f.items.map((it) => it.value));
  const j = f.pointers.find((p) => p.label === 'j')?.index ?? null;
  const passes = Math.max(n - 1, 1);
  const iPointer = f.pointers.find((p) => p.label === 'i')?.index;
  const round = f.kind === 'end' ? passes : iPointer === undefined ? 1 : n - iPointer;

  let say = spec.narrate(f, 'kid');
  if (predict.asking) say = predict.question!.prompt;
  else if (predict.result === 'right') say = `Yes! You earned a star. ${say}`;
  else if (predict.result === 'wrong') say = `Good try! ${say}`;

  const last = player.cur >= player.last;

  return (
    <div className={`hs hs--${sky}`}>
      <header className="hs-header">
        <a className="hs-logo" href="/">
          <span className="hs-logo__face" aria-hidden="true">
            <span />
            <span />
          </span>
          hello algo
          <span className="hs-badge">school</span>
        </a>
        <div className="hs-header__right">
          <div className="hs-pill" aria-label={`Stars: ${stars}`}>
            <span className="hs-star" aria-hidden="true" />
            {stars}
          </div>
          <button type="button" className="hs-pill hs-pill--button" onClick={toggleSky}>
            {sky === 'day' ? 'Night sky' : 'Sunny day'}
          </button>
          <a className="hs-pill hs-pill--dashed" href={grownUpHref}>
            Grown-up view
          </a>
        </div>
      </header>

      <main className="hs-main">
        <div className="hs-main__story">
          <div className="hs-title">
            <h1>{title}</h1>
            <span>
              Level {level} · {levelNote}
            </span>
          </div>

          <section className="hs-scene" aria-label={`${title} story`}>
            <span className="hs-scene__glow" aria-hidden="true" />
            <span className="hs-sun" aria-hidden="true" />
            <span className="hs-cloud hs-cloud--a" aria-hidden="true" />
            <span className="hs-cloud hs-cloud--b" aria-hidden="true" />
            <span className="hs-ground" aria-hidden="true" />
            <div className="hs-bubbles" role="img" aria-label={`Bubbles: ${f.items.map((it) => it.value).join(', ')}`}>
              {f.items.map((it, idx) => (
                <Bubble
                  key={it.id}
                  value={it.value}
                  mark={f.marks[idx]}
                  color={BUBBLE_COLORS[it.value % BUBBLE_COLORS.length]}
                  scale={it.value / max}
                  looking={f.marks[idx] === 'cmp' ? (idx === j ? 'right' : 'left') : null}
                  hopTag={f.marks[idx] === 'swp' && j !== null && idx === j + 1}
                />
              ))}
            </div>
            <span className="hs-scene__label hs-scene__label--left">small</span>
            <span className="hs-scene__label hs-scene__label--right">big</span>
          </section>

          <div className="hs-guide">
            <Robot />
            <div className="hs-speech" aria-live="polite">
              <span className="hs-speech__who">Algo says</span>
              <span className="hs-speech__text">{say}</span>
            </div>
          </div>

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
              <button type="button" className="hs-round" aria-label="Go back" onClick={player.prev}>
                ←
              </button>
              <button type="button" className="hs-big hs-big--go" onClick={last ? player.restart : player.next}>
                {last ? 'Play again' : 'Next!'}
              </button>
            </div>
          )}
          <label className="hs-check">
            <input type="checkbox" checked={guessing} onChange={(e) => setGuessing(e.target.checked)} />
            Let me guess each step
          </label>
        </div>

        <aside className="hs-side">
          <div className="hs-card">
            <h2>The rule</h2>
            <ol className="hs-rules">
              {rules.map((r, k) => (
                <li key={k}>
                  <span className={`hs-rules__no hs-rules__no--${k}`}>{k + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
          <div className="hs-card">
            <h2>
              Round {round} of {passes}
            </h2>
            <div className="hs-rounds" aria-hidden="true">
              {Array.from({ length: passes }, (_, k) => (
                <span
                  key={k}
                  className={k + 1 < round || f.kind === 'end' ? 'is-done' : k + 1 === round ? 'is-now' : ''}
                />
              ))}
            </div>
          </div>
          <button type="button" className="hs-peek" aria-expanded={peek} onClick={() => setPeek((p) => !p)}>
            {peek ? 'Hide the code' : 'Peek at the real code'}
          </button>
          {peek && <pre className="hs-code">{peekCode}</pre>}
        </aside>
      </main>
    </div>
  );
}
