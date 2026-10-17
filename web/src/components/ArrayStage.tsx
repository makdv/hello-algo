import type { CSSProperties } from 'react';
import type { ArrayFrame } from '../engine/types';

interface Props {
  frame: ArrayFrame;
  view?: 'cells' | 'bars';
  /** `fluid` is medium on wide screens and small on phones, decided in CSS so nothing jumps on load. */
  size?: 'sm' | 'md' | 'lg' | 'fluid' | 'fluid-lg';
}

const BAR_AREA = 220;

/** Draws an array frame as memory cells or bars. Elements keep their id so swaps animate. */
export function ArrayStage({ frame, view = 'cells', size = 'md' }: Props) {
  const n = frame.items.length;
  const max = Math.max(1, ...frame.items.map((it) => it.value));
  const at = (index: number) => ({ ['--i' as string]: index }) as CSSProperties;

  const labels = new Map<number, string[]>();
  for (const p of frame.pointers) labels.set(p.index, [...(labels.get(p.index) ?? []), p.label]);

  const pointerRow = (
    <div className="ha-stage__row ha-stage__pointers" aria-hidden="true">
      {[...labels.entries()].map(([index, ls]) => (
        <span key={index} className="ha-stage__pointer" style={at(index)}>
          {ls.join(' · ')}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`ha-stage ha-stage--${view} ha-stage--${size}`}
      style={{ ['--n' as string]: Math.max(n, 1) } as CSSProperties}
      role="img"
      aria-label={`Array: ${frame.items.map((it) => it.value).join(', ')}`}
    >
      {view === 'cells' && pointerRow}
      <div className="ha-stage__items" style={view === 'bars' ? { height: BAR_AREA + 28 } : undefined}>
        {frame.items.map((it, index) => (
          <div
            key={it.id}
            className={`ha-item ha-mark--${frame.marks[index]}`}
            style={{
              ...at(index),
              ...(view === 'bars' ? { height: Math.round(24 + (BAR_AREA - 24) * (it.value / max)) + 28 } : {}),
            }}
          >
            {view === 'bars' ? (
              <>
                <span className="ha-item__value">{it.value}</span>
                <span className="ha-item__bar" />
              </>
            ) : (
              it.value
            )}
          </div>
        ))}
      </div>
      <div className="ha-stage__row ha-stage__indices" aria-hidden="true">
        {frame.items.map((it, index) => (
          <span key={index} style={at(index)}>
            {index}
          </span>
        ))}
      </div>
      {/* Bars have uneven tops, so pointers sit under the indices instead. */}
      {view === 'bars' && pointerRow}
    </div>
  );
}
