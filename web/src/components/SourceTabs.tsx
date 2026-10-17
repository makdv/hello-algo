import { useCodeLang } from '../engine/useCodeLang';
import type { LangId } from '../engine/types';
import { CodeView } from './CodeView';
import './viz.css';

interface Props {
  sources: Partial<Record<LangId, { label: string; code: string }>>;
}

/** Code listing with one tab per language. The selected language is shared with every player. */
export function SourceTabs({ sources }: Props) {
  const langs = Object.keys(sources) as LangId[];
  const [lang, setLang] = useCodeLang(langs);
  const current = sources[lang] ?? sources[langs[0]]!;
  return (
    <div className="ha-source">
      <div className="ha-tabs" role="tablist" aria-label="Code language">
        {langs.map((l) => (
          <button key={l} type="button" role="tab" aria-selected={lang === l} className="ha-tabs__tab" onClick={() => setLang(l)}>
            {sources[l]!.label}
          </button>
        ))}
      </div>
      <CodeView source={{ ...current, anchors: {} }} lang={lang} kind="" />
    </div>
  );
}
