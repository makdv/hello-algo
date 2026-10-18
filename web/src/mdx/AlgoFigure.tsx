import { useEffect, useState } from 'react';
import { AlgoPlayer } from '../components/AlgoPlayer';
import type { AlgorithmSpec, ArrayFrame } from '../engine/types';
import { findAlgorithm } from '../algorithms/registry';
import { useLocale } from '../i18n/useLocale';
import { ui } from '../i18n/ui';
import '../components/viz.css';

/**
 * An interactive figure for a registered algorithm, placed by the converter where the book
 * had a step-by-step image sequence. The player code loads on demand; until then (and in the
 * static HTML) a placeholder of the same size keeps the page from jumping.
 */
export default function AlgoFigure({ algorithm, caption }: { algorithm: string; caption?: string }) {
  const locale = useLocale();
  const [spec, setSpec] = useState<AlgorithmSpec<ArrayFrame> | null>(null);

  useEffect(() => {
    let live = true;
    findAlgorithm(algorithm)
      ?.load()
      .then((s) => {
        if (live) setSpec(s);
      });
    return () => {
      live = false;
    };
  }, [algorithm]);

  if (!spec) {
    return (
      <figure className="ha-player">
        <div className="ha-player__frame ha-player__placeholder" aria-busy="true">
          <span>{ui(locale).loading}</span>
        </div>
        {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
      </figure>
    );
  }
  return <AlgoPlayer spec={spec} caption={caption} />;
}
