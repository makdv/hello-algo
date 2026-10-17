import type { ArrayFrame, Mark } from '../engine/types';
import type { Player } from '../engine/usePlayer';
import type { UiText } from '../i18n/ui';

const TICK_HEIGHT: Record<Mark, number> = { idle: 7, cmp: 12, swp: 20, done: 16 };

/** Step ticks colored by event kind, plus a scrubber. */
export function Timeline({ player, tones, t }: { player: Player<ArrayFrame>; tones: Record<string, Mark>; t: UiText }) {
  return (
    <div className="ha-timeline">
      <div className="ha-timeline__ticks" aria-hidden="true">
        {player.frames.map((f, k) => {
          const tone = tones[f.kind] ?? 'idle';
          return (
            <span
              key={k}
              className={`ha-tick ha-tick--${tone === 'idle' ? 'muted' : tone}${k === player.cur ? ' is-current' : ''}${k > player.cur ? ' is-future' : ''}`}
              style={{ height: TICK_HEIGHT[tone] }}
            />
          );
        })}
      </div>
      <input
        type="range"
        className="ha-timeline__range"
        aria-label={t.step}
        min={0}
        max={player.last}
        step={1}
        value={player.cur}
        onChange={(e) => player.go(Number(e.target.value))}
      />
    </div>
  );
}

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

export function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}

export function Transport({
  player,
  t,
  showPlay = true,
  showRestart = false,
}: {
  player: Player<ArrayFrame>;
  t: UiText;
  showPlay?: boolean;
  showRestart?: boolean;
}) {
  return (
    <div className="ha-transport">
      {showRestart && (
        <button type="button" className="ha-btn ha-btn--icon" aria-label={t.restart} onClick={player.restart}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 1 0 2.3-5.7" />
            <path d="M4 4v4h4" />
          </svg>
        </button>
      )}
      <button type="button" className="ha-btn ha-btn--icon" aria-label={t.prevStep} onClick={player.prev}>
        <Chevron dir="left" />
      </button>
      {showPlay && (
        <button type="button" className="ha-btn ha-btn--icon ha-btn--primary" aria-label={player.playing ? t.pause : t.play} onClick={player.toggle}>
          <PlayIcon playing={player.playing} />
        </button>
      )}
      <button type="button" className="ha-btn ha-btn--icon" aria-label={t.nextStep} onClick={player.next}>
        <Chevron dir="right" />
      </button>
    </div>
  );
}

/** Arrow keys step, space plays or pauses. Attach to a focusable player container. */
export function playerKeyHandler(player: Player<ArrayFrame>, enabled = true) {
  return (e: React.KeyboardEvent) => {
    if (!enabled) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'range') return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      player.next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      player.prev();
    } else if (e.key === ' ' && target.tagName !== 'BUTTON') {
      e.preventDefault();
      player.toggle();
    }
  };
}
