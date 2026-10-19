import { useEffect, useMemo, useState } from 'react';
import { findAlgorithm } from '../algorithms/registry';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';
import type { Scene } from '../figures/scene';
import { SceneView } from '../figures/SceneView';
import { isLocale, type Locale, pick, prefixOf } from '../i18n/locale';
import { ui } from '../i18n/ui';
import { findLesson, LESSONS, nextLesson, UNITS } from './lessons/catalog';
import { loadLesson } from './lessons/load';
import type { KidQuestion, LessonContent, PracticeStep, StorySlide } from './lessons/types';
import { addStars, AlgorithmGame, markDone, RobotSays, SchoolShell } from './SchoolPlayer';
import { lessonText } from './text';
import '../figures/figures.css';
import './school.css';

type Phase = 'story' | 'try' | 'quiz' | 'done';

/** A lesson picture: a figure-kit scene drawn in the School's colors. */
function KidStage({ scene, label }: { scene: Scene; label: string }) {
  return (
    <section className="hs-stage" aria-label={label}>
      <SceneView scene={scene} label={label} maxScale={1.6} />
    </section>
  );
}

function StoryView({ slides, title, locale, onDone }: { slides: StorySlide[]; title: string; locale: Locale; onDone: () => void }) {
  const lt = lessonText(locale);
  const t = ui(locale).school;
  const [k, setK] = useState(0);
  const slide = slides[k];
  const last = k === slides.length - 1;
  return (
    <div className="hs-lesson__body">
      <KidStage scene={slide.scene} label={title} />
      <RobotSays who={t.algoSays} text={slide.say} />
      <div className="hs-actions">
        <button type="button" className="hs-round" aria-label={lt.back} disabled={k === 0} onClick={() => setK(k - 1)}>
          ←
        </button>
        <span className="hs-counter">{lt.slideOf(k + 1, slides.length)}</span>
        <button type="button" className="hs-big hs-big--go" onClick={() => (last ? onDone() : setK(k + 1))}>
          {last ? lt.letsTry : lt.next}
        </button>
      </div>
    </div>
  );
}

/**
 * The order answers are shown in: shuffled with a seed taken from the question, so it is stable
 * between visits but the right answer is not always in the same place.
 */
export function choiceOrder(q: KidQuestion) {
  let seed = 0;
  for (const ch of q.prompt) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...q.choices];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Answer buttons for a question; after answering, the right one turns green and a wrong pick red. */
function Choices({ q, picked, onPick }: { q: KidQuestion; picked: string | null; onPick: (id: string) => void }) {
  const order = useMemo(() => choiceOrder(q), [q]);
  return (
    <div className="hs-choices">
      {order.map((c) => {
        const state = picked === null ? '' : c.id === q.answer ? ' is-right' : c.id === picked ? ' is-wrong' : ' is-other';
        return (
          <button key={c.id} type="button" className={`hs-big hs-big--choice${state}`} disabled={picked !== null} onClick={() => onPick(c.id)}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function PracticeView({ steps, title, lessonId, locale, onDone }: { steps: PracticeStep[]; title: string; lessonId: string; locale: Locale; onDone: () => void }) {
  const lt = lessonText(locale);
  const t = ui(locale).school;
  const [k, setK] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const step = steps[k];
  const last = k === steps.length - 1;
  const asking = step.ask !== undefined;

  const pick = (id: string) => {
    setPicked(id);
    if (id === step.ask!.answer) addStars(lessonId);
  };
  const go = (to: number) => {
    setK(to);
    setPicked(null);
  };

  let say = step.say;
  if (asking && picked === null) say = step.ask!.prompt;
  else if (asking) say = `${picked === step.ask!.answer ? lt.right : lt.notQuite} ${step.ask!.explain}`;

  return (
    <div className="hs-lesson__body">
      <KidStage scene={step.ask?.scene ?? step.scene} label={title} />
      <RobotSays who={t.algoSays} text={say} />
      {asking && <Choices q={step.ask!} picked={picked} onPick={pick} />}
      <div className="hs-actions">
        <button type="button" className="hs-round" aria-label={lt.back} disabled={k === 0} onClick={() => go(k - 1)}>
          ←
        </button>
        <span className="hs-counter">{lt.slideOf(k + 1, steps.length)}</span>
        {(!asking || picked !== null) && (
          <button type="button" className="hs-big hs-big--go" onClick={() => (last ? onDone() : go(k + 1))}>
            {last ? lt.toQuiz : lt.next}
          </button>
        )}
      </div>
    </div>
  );
}

function QuizView({ questions, title, lessonId, locale, onDone }: { questions: KidQuestion[]; title: string; lessonId: string; locale: Locale; onDone: (right: number) => void }) {
  const lt = lessonText(locale);
  const t = ui(locale).school;
  const [k, setK] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const q = questions[k];
  const last = k === questions.length - 1;

  const pick = (id: string) => {
    setPicked(id);
    if (id === q.answer) {
      setRight((r) => r + 1);
      addStars(lessonId);
    }
  };

  const say = picked === null ? q.prompt : `${picked === q.answer ? lt.right : lt.notQuite} ${q.explain}`;
  return (
    <div className="hs-lesson__body">
      <p className="hs-counter hs-counter--top">{lt.questionOf(k + 1, questions.length)}</p>
      {q.scene && <KidStage scene={q.scene} label={title} />}
      <RobotSays who={t.algoSays} text={say} />
      <Choices q={q} picked={picked} onPick={pick} />
      {picked !== null && (
        <div className="hs-actions">
          <button
            type="button"
            className="hs-big hs-big--go"
            onClick={() => {
              if (last) onDone(right);
              else {
                setK(k + 1);
                setPicked(null);
              }
            }}
          >
            {last ? lt.finish : lt.next}
          </button>
        </div>
      )}
    </div>
  );
}

function DoneView({ lessonId, right, total, locale, onStory }: { lessonId: string; right: number; total: number; locale: Locale; onStory: () => void }) {
  const lt = lessonText(locale);
  const prefix = prefixOf(locale);
  const next = nextLesson(lessonId);
  return (
    <div className="hs-lesson__body hs-done">
      <div className="hs-done__stars" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`hs-star hs-star--big${i < right ? '' : ' is-empty'}`} />
        ))}
      </div>
      <h2>{lt.done}</h2>
      <p>{lt.score(right, total)}</p>
      <div className="hs-actions">
        <button type="button" className="hs-big hs-big--soft" onClick={onStory}>
          {lt.storyAgain}
        </button>
        <a className="hs-big hs-big--soft" href={`${prefix}/school/`}>
          {lt.backToMap}
        </a>
        {next && (
          <a className="hs-big hs-big--go" href={`${prefix}/school/${next.id}`}>
            {lt.nextLesson}: {pick(next.title, locale)}
          </a>
        )}
      </div>
    </div>
  );
}

/** One School lesson page: Story, then Try it, then Quiz. */
export function SchoolLesson({ lesson: id, locale: lang }: { lesson: string; locale: string }) {
  const locale: Locale = isLocale(lang) ? lang : 'en';
  const lt = lessonText(locale);
  const meta = findLesson(id);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [spec, setSpec] = useState<AlgorithmSpec<ArrayFrame> | null>(null);
  const [phase, setPhase] = useState<Phase>('story');
  const [reached, setReached] = useState<Phase[]>(['story']);
  const [score, setScore] = useState({ right: 0, total: 0 });

  useEffect(() => {
    let live = true;
    loadLesson(id).then((c) => live && setContent(c));
    const algo = meta?.algorithm ? findAlgorithm(meta.algorithm) : undefined;
    algo?.load().then((s) => live && setSpec(s));
    return () => {
      live = false;
    };
  }, [id, meta]);

  const built = useMemo(
    () => (content ? { story: content.story(locale), practice: content.practice?.(locale) ?? null, quiz: content.quiz(locale) } : null),
    [content, locale],
  );

  if (!meta) return null;
  const prefix = prefixOf(locale);
  const title = pick(meta.title, locale);
  const unitNo = UNITS.findIndex((u) => u.id === meta.unit) + 1;
  const lessonNo = LESSONS.indexOf(meta) + 1;
  const goto = (p: Phase) => {
    setPhase(p);
    setReached((r) => (r.includes(p) ? r : [...r, p]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const ready = built && (!meta.algorithm || spec);

  return (
    <SchoolShell locale={locale} grownUpHref={`${prefix}/${meta.page}`}>
      <main className="hs-lesson">
        <div className="hs-title">
          <h1>{title}</h1>
          <span>
            {lt.unit(unitNo)} · {lt.lesson(lessonNo)}
          </span>
        </div>
        <nav className="hs-phases" aria-label={title}>
          {(['story', 'try', 'quiz'] as const).map((p, i) => (
            <button
              key={p}
              type="button"
              className={`hs-phase${phase === p ? ' is-current' : ''}${reached.includes(p) && phase !== p ? ' is-seen' : ''}`}
              aria-current={phase === p ? 'step' : undefined}
              disabled={!reached.includes(p)}
              onClick={() => goto(p)}
            >
              <span className="hs-phase__no">{i + 1}</span>
              {p === 'story' ? lt.story : p === 'try' ? lt.tryIt : lt.quiz}
            </button>
          ))}
        </nav>

        {!ready && <p className="hs-loading">{ui(locale).loading}</p>}
        {ready && phase === 'story' && <StoryView key="story" slides={built!.story} title={title} locale={locale} onDone={() => goto('try')} />}
        {ready && phase === 'try' &&
          (spec ? (
            <AlgorithmGame spec={spec} lessonId={meta.id} locale={locale} onQuiz={() => goto('quiz')} />
          ) : (
            <PracticeView key="try" steps={built!.practice ?? []} title={title} lessonId={meta.id} locale={locale} onDone={() => goto('quiz')} />
          ))}
        {ready && phase === 'quiz' && (
          <QuizView
            key="quiz"
            questions={built!.quiz}
            title={title}
            lessonId={meta.id}
            locale={locale}
            onDone={(right) => {
              markDone(meta.id);
              setScore({ right, total: built!.quiz.length });
              goto('done');
            }}
          />
        )}
        {ready && phase === 'done' && <DoneView lessonId={meta.id} right={score.right} total={score.total} locale={locale} onStory={() => goto('story')} />}
      </main>
    </SchoolShell>
  );
}
