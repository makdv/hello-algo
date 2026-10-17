export type ThemeId = 'lavender' | 'lavender-dark' | 'mint' | 'ocean' | 'sepia' | 'contrast';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  note: string;
  dark: boolean;
}

export const THEMES: ThemeInfo[] = [
  { id: 'lavender', name: 'Lavender', note: 'Graphite and plum', dark: false },
  { id: 'lavender-dark', name: 'Lavender dark', note: 'Graphite night, lilac accent', dark: true },
  { id: 'mint', name: 'Mint', note: 'The Hello Algo green', dark: false },
  { id: 'ocean', name: 'Ocean', note: 'Deep navy, cyan signal', dark: true },
  { id: 'sepia', name: 'Sepia', note: 'Warm paper for long reads', dark: false },
  { id: 'contrast', name: 'Contrast', note: 'Maximum legibility', dark: false },
];

export const THEME_STORAGE_KEY = 'ha-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function readStoredTheme(): ThemeId {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-ha-theme');
    if (isThemeId(attr)) return attr;
  }
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode); fall back to the default.
  }
  return 'lavender';
}
