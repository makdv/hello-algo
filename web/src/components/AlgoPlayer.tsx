import { useMemo, useState } from 'react';
import { useCodeLang } from '../engine/useCodeLang';
import { usePlayer } from '../engine/usePlayer';
import { usePredict } from '../engine/usePredict';
import type { AlgorithmSpec, ArrayFrame, LangId } from '../engine/types';
import { pick } from '../i18n/locale';
import { useLocale } from '../i18n/useLocale';
import { ui } from '../i18n/ui';
import { ArrayStage } from './ArrayStage';
import { CodeView } from './CodeView';
import { playerKeyHandler, Timeline, Transport } from './Controls';
import { Workbench } from './Workbench';
import './viz.css';

type Mode = 'watch' | 'predict';

interface Props<F extends ArrayFrame> {
  spec: AlgorithmSpec<F>;
  input?: number[];
  param?: number;
  /** Step to show first; defaults to the spec's own pick. */
  initialStep?: number;
  caption?: string;
}

/** The call shown in the player header, e.g. `binary_search([1, 3, 6], 6)`. */
export const callLabel = (spec: AlgorithmSpec<ArrayFrame>, input: number[], param?: number) =>
  `${spec.call}([${input.join(', ')}]${spec.param ? `, ${param ?? spec.param.default}` : ''})`;

/**
 * The compact, inline player used in book pages.
 * Watch and Predict happen in place; Explore opens the full workbench.
 */
export function AlgoPlayer<F extends ArrayFrame>({ spec, input, param, initialStep, caption }: Props<F>) {
  const locale = useLocale();
  const t = ui(locale);
  const startInput = input ?? spec.defaultInput;
  const startParam = param ?? spec.param?.default;
  const inputKey = startInput.join(',');
  // Keyed by value: MDX may pass a fresh array literal on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const frames = useMemo(() => spec.trace(startInput, startParam), [spec, inputKey, startParam]);
  const player = usePlayer(frames, initialStep ?? spec.initialStep ?? 0);
  const [mode, setMode] = useState<Mode>('watch');
  const [exploring, setExploring] = useState(false);
  const sources = spec.sources(locale);
  const langs = Object.keys(sources) as LangId[];
  const [lang, setLang] = useCodeLang(langs);
  const predict = usePredict(spec, player, mode === 'predict', 'reader', locale);
  const source = sources[lang] ?? sources[langs[0]]!;
  const frame = player.frame;
  const title = pick(spec.title, locale);

  const switchMode = (next: Mode) => {
    player.stop();
    setMode(next);
  };

  const narration = predict.asking ? predict.question!.prompt : spec.narrate(frame, 'reader', locale);

  return (
    <figure className="ha-player">
      <div className="ha-player__frame" tabIndex={0} role="group" aria-label={t.visualizerAria(title)} onKeyDown={playerKeyHandler(player, !predict.asking)}>
        <div className="ha-player__bar">
          <span className="ha-player__call">{callLabel(spec, startInput, startParam)}</span>
          <div className="ha-segmented" role="group" aria-label={t.playerMode}>
            {(['watch', 'predict'] as Mode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} className="ha-segmented__item" onClick={() => switchMode(m)}>
                {m === 'watch' ? t.watch : t.predict}
              </button>
            ))}
            <button
              type="button"
              className="ha-segmented__item ha-segmented__item--link"
              onClick={() => {
                player.stop();
                setExploring(true);
              }}
            >
              {t.explore}
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="ha-player__stage ha-grid-paper">
          <ArrayStage frame={frame} size="fluid" />
        </div>

        <div className="ha-player__codeline">
          <CodeView source={source} lang={lang} kind={frame.kind} variant="line" />
          <label className="ha-select">
            <span className="ha-visually-hidden">{t.codeLanguage}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as LangId)}>
              {langs.map((l) => (
                <option key={l} value={l}>
                  {sources[l]!.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="ha-player__narration" aria-live="polite">
          <span className="ha-player__step">
            {String(player.cur + 1).padStart(2, '0')} / {player.last + 1}
          </span>
          <span>{narration}</span>
        </div>

        {predict.asking ? (
          <div className="ha-player__ask">
            <span className="ha-player__ask-label">{t.predictNext}</span>
            {predict.question!.choices.map((c) => (
              <button key={c.id} type="button" className={`ha-btn ha-choice ha-mark--${c.tone}`} onClick={() => predict.answer(c.id)}>
                {c.label}
              </button>
            ))}
            <button type="button" className="ha-btn ha-btn--link" onClick={predict.skip}>
              {t.showMe}
            </button>
          </div>
        ) : (
          <div className="ha-player__controls">
            <Transport player={player} t={t} showPlay={mode === 'watch'} />
            {predict.result && predict.result !== 'skipped' && predict.question && (
              <span className={`ha-feedback ha-mark--${predict.result === 'right' ? 'done' : 'swp'}`}>
                {predict.result === 'right' ? t.correct : t.notQuite} {predict.question.explain}
              </span>
            )}
            <Timeline player={player} tones={spec.tones} t={t} />
            {mode === 'predict' && (
              <span className="ha-player__score">
                {t.score} {predict.right}/{predict.total}
              </span>
            )}
          </div>
        )}
      </div>
      {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
      {exploring && (
        <Workbench spec={spec} input={startInput} param={startParam} startAt={player.cur} onClose={() => setExploring(false)} />
      )}
    </figure>
  );
}
