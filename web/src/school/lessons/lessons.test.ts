import { describe, expect, it } from '@rstest/core';
import { ALGORITHMS } from '../../algorithms/registry';
import { checkScene } from '../../figures/checkScene';
import { LOCALE_IDS } from '../../i18n/locale';
import { LESSONS, UNITS } from './catalog';
import { UNIT_LOADERS } from './load';
import type { KidQuestion, LessonContent } from './types';

const units = Object.fromEntries(await Promise.all(Object.entries(UNIT_LOADERS).map(async ([id, load]) => [id, (await load()).default] as const)));

const clean = (s: string, where: string) => {
  expect(s.trim().length, where).toBeGreaterThan(0);
  expect(s, where).not.toMatch(/undefined|NaN|\{\w+\}/);
};

function checkQuestion(q: KidQuestion, where: string) {
  clean(q.prompt, where);
  clean(q.explain, where);
  expect(q.choices.length, where).toBeGreaterThanOrEqual(2);
  expect(new Set(q.choices.map((c) => c.id)).size, `${where}: unique choices`).toBe(q.choices.length);
  expect(q.choices.map((c) => c.id), where).toContain(q.answer);
  for (const c of q.choices) clean(c.label, where);
  if (q.scene) checkScene(q.scene, where);
}

describe('School catalog', () => {
  it('has unique lesson ids in known units', () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
    for (const l of LESSONS) expect(UNITS.map((u) => u.id)).toContain(l.unit);
  });

  it('names algorithms that exist', () => {
    for (const l of LESSONS.filter((x) => x.algorithm)) expect(ALGORITHMS.map((a) => a.id), l.id).toContain(l.algorithm);
  });

  it('has content for every lesson, and no content without a lesson', () => {
    for (const l of LESSONS) expect(units[l.unit][l.id], `${l.unit}/${l.id}`).toBeDefined();
    for (const [unit, lessons] of Object.entries(units)) {
      for (const id of Object.keys(lessons)) expect(LESSONS.find((l) => l.id === id)?.unit, `${unit}/${id}`).toBe(unit);
    }
  });
});

const written = LESSONS.filter((l) => units[l.unit][l.id]).map((l) => [l.id, l, units[l.unit][l.id] as LessonContent] as const);

describe.each(written)('lesson %s', (id, meta, content) => {
  it('tells a story in every locale', () => {
    for (const locale of LOCALE_IDS) {
      const slides = content.story(locale);
      expect(slides.length, locale).toBeGreaterThanOrEqual(3);
      slides.forEach((s, k) => {
        checkScene(s.scene, `${id} ${locale} story #${k}`);
        clean(s.say, `${id} ${locale} story #${k}`);
      });
    }
  });

  it('has a hands-on part', () => {
    if (meta.algorithm) {
      expect(content.practice, `${id}: algorithm lessons play the game instead`).toBeUndefined();
      return;
    }
    for (const locale of LOCALE_IDS) {
      const steps = content.practice?.(locale) ?? [];
      expect(steps.length, locale).toBeGreaterThanOrEqual(3);
      expect(steps.some((s) => s.ask), `${id} ${locale}: at least one guess`).toBe(true);
      steps.forEach((s, k) => {
        const where = `${id} ${locale} try #${k}`;
        checkScene(s.scene, where);
        clean(s.say, where);
        if (s.ask) checkQuestion(s.ask, where);
      });
    }
  });

  it('ends with a quiz', () => {
    for (const locale of LOCALE_IDS) {
      const quiz = content.quiz(locale);
      expect(quiz.length, locale).toBeGreaterThanOrEqual(2);
      quiz.forEach((q, k) => checkQuestion(q, `${id} ${locale} quiz #${k}`));
    }
  });
});
