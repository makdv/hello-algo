import { useEffect, useState } from 'react';
import type { Figure } from '../figures/scene';
import { FigureView } from '../figures/FigureView';
import { loadFigure } from '../figures/load';
import { useLocale } from '../i18n/useLocale';
import { ui } from '../i18n/ui';
import '../figures/figures.css';

/**
 * A book figure redrawn as a live diagram, placed by the converter instead of the original
 * image. The chapter's figures load on demand; until then a placeholder holds the space.
 */
export default function Fig({ id, caption }: { id: string; caption?: string }) {
  const locale = useLocale();
  const [fig, setFig] = useState<Figure | null>(null);

  useEffect(() => {
    let live = true;
    loadFigure(id).then((f) => {
      if (live) setFig(f);
    });
    return () => {
      live = false;
    };
  }, [id]);

  if (!fig) {
    return (
      <figure className="ha-fig">
        <div className="ha-fig__frame ha-fig__placeholder" aria-busy="true">
          <span>{ui(locale).loading}</span>
        </div>
        {caption && <figcaption className="ha-player__caption">{caption}</figcaption>}
      </figure>
    );
  }
  return <FigureView fig={fig} locale={locale} caption={caption} />;
}
