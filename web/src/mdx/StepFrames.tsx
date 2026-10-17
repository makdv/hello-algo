import { Children, type ReactNode, useEffect, useState } from 'react';
import { PlayIcon } from '../components/Controls';
import '../components/viz.css';

const INTERVAL_MS = 1500;

/**
 * A numbered sequence of figures (the book's step-by-step PNG animations),
 * with stepping, autoplay and a step counter. Every frame stays in the DOM for search and print.
 */
export default function StepFrames({ children, caption }: { children?: ReactNode; caption?: string }) {
  const frames = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim());
  const last = Math.max(frames.length - 1, 0);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setCur((c) => (c >= last ? 0 : c + 1)), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [playing, last]);

  const go = (k: number) => {
    setPlaying(false);
    setCur(Math.max(0, Math.min(last, k)));
  };

  return (
    <figure
      className="ha-steps"
      tabIndex={0}
      aria-label={caption ? `${caption}: step-by-step figure` : 'Step-by-step figure'}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(cur + 1);
        if (e.key === 'ArrowLeft') go(cur - 1);
      }}
    >
      <div className="ha-steps__frames">
        {frames.map((f, k) => (
          <div key={k} className="ha-steps__frame" hidden={k !== cur} aria-hidden={k !== cur}>
            {f}
          </div>
        ))}
      </div>
      <div className="ha-steps__bar">
        <div className="ha-transport">
          <button type="button" className="ha-btn ha-btn--icon" aria-label="Previous step" onClick={() => go(cur - 1)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="ha-btn ha-btn--icon ha-btn--primary"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={() => setPlaying((p) => !p)}
          >
            <PlayIcon playing={playing} />
          </button>
          <button type="button" className="ha-btn ha-btn--icon" aria-label="Next step" onClick={() => go(cur + 1)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="ha-steps__dots" role="group" aria-label="Steps">
          {frames.map((_, k) => (
            <button
              key={k}
              type="button"
              className={`ha-steps__dot${k === cur ? ' is-current' : ''}`}
              aria-label={`Step ${k + 1}`}
              aria-current={k === cur ? 'step' : undefined}
              onClick={() => go(k)}
            />
          ))}
        </div>
        <span className="ha-steps__count" aria-live="polite">
          {cur + 1} / {last + 1}
        </span>
      </div>
      {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
    </figure>
  );
}
