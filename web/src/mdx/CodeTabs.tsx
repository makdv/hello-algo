import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { useCodeLang } from '../engine/useCodeLang';
import type { LangId } from '../engine/types';
import '../components/viz.css';

interface TabProps {
  lang: LangId;
  label: string;
  children?: ReactNode;
}

/**
 * Code listing with one tab per language, emitted by the remark plugin for `src` blocks
 * and language tab groups. The chosen language is shared by every listing and player.
 */
export default function CodeTabs({ children }: { children?: ReactNode }) {
  const tabs = Children.toArray(children).filter((c): c is ReactElement<TabProps> => isValidElement(c));
  const langs = tabs.map((t) => t.props.lang);
  const [lang, setLang] = useCodeLang(langs);
  const active = Math.max(0, langs.indexOf(lang));

  return (
    <div className="ha-codetabs">
      <div className="ha-tabs ha-codetabs__tabs" role="tablist" aria-label="Code language">
        {tabs.map((t, k) => (
          <button
            key={t.props.lang}
            type="button"
            role="tab"
            aria-selected={k === active}
            className="ha-tabs__tab"
            onClick={() => setLang(t.props.lang)}
          >
            {t.props.label}
          </button>
        ))}
      </div>
      {tabs.map((t, k) => (
        <div key={t.props.lang} role="tabpanel" className="ha-codetabs__panel" hidden={k !== active}>
          {t}
        </div>
      ))}
    </div>
  );
}
