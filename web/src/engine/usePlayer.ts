import { useCallback, useEffect, useRef, useState } from 'react';

export const SPEEDS = [0.5, 1, 2, 4] as const;
const BASE_INTERVAL_MS = 800;

export interface Player<F> {
  frames: F[];
  frame: F;
  cur: number;
  last: number;
  playing: boolean;
  speed: number;
  go(index: number): void;
  next(): void;
  prev(): void;
  restart(): void;
  toggle(): void;
  stop(): void;
  setSpeed(speed: number): void;
}

/** Playback state over a list of recorded frames. */
export function usePlayer<F>(frames: F[], initial = 0): Player<F> {
  const last = Math.max(frames.length - 1, 0);
  const [cur, setCur] = useState(Math.min(initial, last));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // A new input produces new frames: start over. `initial` only applies to the first trace.
  const firstFrames = useRef(frames);
  useEffect(() => {
    if (frames === firstFrames.current) return;
    setCur(0);
    setPlaying(false);
  }, [frames]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setCur((c) => Math.min(c + 1, last)), BASE_INTERVAL_MS / speed);
    return () => clearInterval(timer);
  }, [playing, speed, last]);

  useEffect(() => {
    if (playing && cur >= last) setPlaying(false);
  }, [playing, cur, last]);

  const go = useCallback((index: number) => setCur(Math.max(0, Math.min(last, index))), [last]);
  const stop = useCallback(() => setPlaying(false), []);

  return {
    frames,
    frame: frames[Math.min(cur, last)],
    cur: Math.min(cur, last),
    last,
    playing,
    speed,
    go: (index) => {
      setPlaying(false);
      go(index);
    },
    next: () => {
      setPlaying(false);
      go(cur + 1);
    },
    prev: () => {
      setPlaying(false);
      go(cur - 1);
    },
    restart: () => {
      setPlaying(false);
      go(0);
    },
    toggle: () => {
      if (playing) {
        setPlaying(false);
        return;
      }
      if (cur >= last) setCur(0);
      setPlaying(true);
    },
    stop,
    setSpeed,
  };
}
