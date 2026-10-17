import { describe, expect, it } from '@rstest/core';
import fs from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { resolveAnchors } from '../engine/source';
import { LOCALE_IDS } from '../i18n/locale';
import { FigureView } from './FigureView';
import { CHAPTER_LOADERS } from './load';
import { FIGURE_IDS, figureIdOf } from './registry';
import type { Figure, Rich, Scene } from './scene';

const BOOK = path.resolve(__dirname, '../../../en/docs');

const plain = (t: Rich | undefined) => (t === undefined ? '' : typeof t === 'string' ? t : t.map((s) => s.t).join(''));

/** Every number in a scene is finite and every id is unique. */
function checkScene(scene: Scene, where: string) {
  expect(scene.w, where).toBeGreaterThan(0);
  expect(scene.h, where).toBeGreaterThan(0);
  const ids = new Set<string>();
  for (const n of scene.nodes) {
    expect(ids.has(n.id), `${where}: duplicate id ${n.id}`).toBe(false);
    ids.add(n.id);
    const numbers = JSON.stringify(n).match(/-?\d+(\.\d+)?(e-?\d+)?|NaN|Infinity|null/g) ?? [];
    expect(numbers.filter((x) => x === 'NaN' || x === 'Infinity'), `${where}: ${n.id}`).toEqual([]);
    const label = 'text' in n ? plain(n.text) : n.kind === 'region' ? plain(n.label) : '';
    expect(label, `${where}: ${n.id}`).not.toMatch(/undefined|NaN|\{\w+\}/);
    if (n.kind === 'box' || n.kind === 'region') {
      // Nothing is drawn outside the scene.
      expect(n.x, `${where}: ${n.id}`).toBeGreaterThanOrEqual(-1);
      expect(n.x + n.w, `${where}: ${n.id}`).toBeLessThanOrEqual(scene.w + 1);
      expect(n.y + n.h, `${where}: ${n.id}`).toBeLessThanOrEqual(scene.h + 1);
    }
  }
}

const modules = await Promise.all(Object.entries(CHAPTER_LOADERS).map(async ([chapter, load]) => [chapter, (await load()).default] as const));

describe('figure registry', () => {
  it('lists exactly the figures each chapter module defines', () => {
    expect(Object.keys(CHAPTER_LOADERS).sort()).toEqual(Object.keys(FIGURE_IDS).sort());
    for (const [chapter, figures] of modules) expect(Object.keys(figures).sort()).toEqual([...FIGURE_IDS[chapter]].sort());
  });

  it('names images that exist in the book', () => {
    const images = new Map<string, string[]>();
    for (const chapter of Object.keys(FIGURE_IDS)) {
      const dir = path.join(BOOK, chapter);
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.assets')).flatMap((a) => fs.readdirSync(path.join(dir, a)));
      images.set(chapter, files);
    }
    for (const [chapter, ids] of Object.entries(FIGURE_IDS)) {
      const files = images.get(chapter)!;
      for (const id of ids) {
        const found = files.some((f) => figureIdOf(f, /_step1(\D|$)/.test(f)) === id);
        expect(found, `${chapter}/${id}`).toBe(true);
      }
    }
  });

  it('turns a sequence of step images into one id', () => {
    expect(figureIdOf('array_deque_step2_push_last.png', true)).toBe('array_deque_steps');
    expect(figureIdOf('hash_function.png', false)).toBe('hash_function');
  });
});

const all: [string, Figure][] = modules.flatMap(([chapter, figures]) => Object.entries(figures).map(([id, f]) => [`${chapter}/${id}`, f] as [string, Figure]));

describe.each(all)('%s', (id, fig) => {
  it('builds well-formed scenes in every locale', () => {
    for (const locale of LOCALE_IDS) {
      if (fig.type === 'static') {
        const { scene, legend, notes } = fig.build(locale);
        checkScene(scene, `${id} ${locale}`);
        for (const t of [...(legend ?? []).map((x) => x.text), ...(notes ?? [])]) expect(t.length).toBeGreaterThan(2);
        continue;
      }
      const { frames } = fig.build(locale);
      expect(frames.length).toBeGreaterThan(1);
      frames.forEach((f, k) => {
        const where = `${id} ${locale} #${k}`;
        checkScene(f.scene, where);
        // A constant size keeps the page from jumping while stepping.
        expect([f.scene.w, f.scene.h], where).toEqual([frames[0].scene.w, frames[0].scene.h]);
        expect(f.say.length, where).toBeGreaterThan(3);
        expect(f.say, where).not.toMatch(/undefined|NaN|\{\w+\}/);
        expect(fig.tones[f.kind], `${where}: tone for ${f.kind}`).toBeDefined();
      });
    }
  });

  it('highlights a code line for every step, in every locale and language', () => {
    if (fig.type !== 'steps' || !fig.sources) return;
    const kinds = new Set(fig.build('en').frames.map((f) => f.kind));
    for (const locale of LOCALE_IDS) {
      for (const [lang, source] of Object.entries(fig.sources(locale))) {
        expect(source!.code.length, `${lang} ${locale}`).toBeGreaterThan(20);
        expect(() => resolveAnchors(source!.code, source!.anchors), `${lang} ${locale}`).not.toThrow();
        for (const kind of kinds) expect(source!.anchors[kind], `${lang}: ${kind}`).toBeDefined();
      }
    }
  });

  it('renders on the server', () => {
    const html = renderToString(<FigureView fig={fig} locale="zh" caption="caption" />);
    expect(html).toContain('<svg');
  });
});
