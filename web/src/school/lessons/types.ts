import type { Scene } from '../../figures/scene';
import type { Locale } from '../../i18n/locale';

/**
 * A School lesson has three parts:
 * - Story: Algo the robot explains the idea with an everyday picture, slide by slide.
 * - Try: the reader works through it, guessing what happens next.
 * - Quiz: a few quick questions to check the idea stuck.
 * Scenes use the same kit as the book's figures (src/figures/kit.ts), drawn in the School's colors.
 */

export interface KidChoice {
  id: string;
  label: string;
}

export interface KidQuestion {
  prompt: string;
  choices: KidChoice[];
  /** Id of the right choice. */
  answer: string;
  /** Shown after answering, right or wrong: why that is the answer. */
  explain: string;
  /** An optional picture for the question. */
  scene?: Scene;
}

export interface StorySlide {
  scene: Scene;
  /** What Algo says on this slide: one or two short sentences. */
  say: string;
}

/** One step of a Try activity; with `ask`, the reader guesses before Algo shows the answer. */
export interface PracticeStep {
  scene: Scene;
  say: string;
  ask?: KidQuestion;
}

export interface LessonContent {
  story(locale: Locale): StorySlide[];
  /** Steps of the hands-on part. Omitted when the lesson plays an algorithm game instead (see the catalog). */
  practice?(locale: Locale): PracticeStep[];
  quiz(locale: Locale): KidQuestion[];
}
