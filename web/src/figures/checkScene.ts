import { expect } from '@rstest/core';
import type { Rich, Scene } from './scene';

/** Shared by the figure and School lesson tests: every number finite, ids unique, text filled in, nothing outside the scene. */
const plain = (t: Rich | undefined) => (t === undefined ? '' : typeof t === 'string' ? t : t.map((s) => s.t).join(''));

/** Every number in a scene is finite and every id is unique. */
export function checkScene(scene: Scene, where: string) {
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

