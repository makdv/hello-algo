import { ThemeContext } from '@rspress/core/runtime';
import { useContext, useEffect, useRef, useState } from 'react';
import { THEME_STORAGE_KEY, THEMES, type ThemeId, readStoredTheme } from './themes';
import './theme-picker.css';

export function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  root.setAttribute('data-ha-theme', id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Ignore storage failures; the attribute still applies for this visit.
  }
}

export function ThemePicker() {
  const { setTheme } = useContext(ThemeContext) as { setTheme?: (v: 'light' | 'dark') => void };
  const [current, setCurrent] = useState<ThemeId>('lavender');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rspress rewrites <html> attributes while hydrating, so re-apply the stored palette here.
    const stored = readStoredTheme();
    applyTheme(stored);
    setCurrent(stored);
    setTheme?.(THEMES.find((t) => t.id === stored)?.dark ? 'dark' : 'light');
    // Only on mount: align Rspress's light/dark state with the stored palette.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (id: ThemeId) => {
    applyTheme(id);
    setCurrent(id);
    setTheme?.(THEMES.find((t) => t.id === id)?.dark ? 'dark' : 'light');
    setOpen(false);
  };

  const info = THEMES.find((t) => t.id === current) ?? THEMES[0];

  return (
    <div className="ha-theme-picker" ref={rootRef}>
      <button
        type="button"
        className="ha-theme-picker__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Theme: ${info.name}. Change theme`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ha-theme-swatch" data-swatch={info.id} aria-hidden="true" />
      </button>
      {open && (
        <div className="ha-theme-picker__menu" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === current}
              className="ha-theme-picker__item"
              onClick={() => choose(t.id)}
            >
              <span className="ha-theme-swatch" data-swatch={t.id} aria-hidden="true" />
              <span className="ha-theme-picker__text">
                <span className="ha-theme-picker__name">{t.name}</span>
                <span className="ha-theme-picker__note">{t.note}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
