import { useMemo } from 'react';
import { useCodeTokens } from '../engine/highlight';
import { resolveAnchors } from '../engine/source';
import type { LangId, SourceSpec } from '../engine/types';

interface Props {
  source: SourceSpec;
  lang: LangId;
  /** Frame kind whose anchor lines are highlighted. */
  kind: string;
  /** `line` shows only the running line, for the compact player. */
  variant?: 'full' | 'line';
}

export function CodeView({ source, lang, kind, variant = 'full' }: Props) {
  const anchors = useMemo(() => resolveAnchors(source.code, source.anchors), [source]);
  const tokens = useCodeTokens(source.code, lang);
  const lines = source.code.split('\n');
  const active = anchors[kind] ?? [];

  const renderLine = (index: number, trim = false) => {
    const lineTokens = tokens?.[index];
    if (!lineTokens) return trim ? lines[index].trim() : lines[index];
    let leading = trim;
    return lineTokens.map((t, k) => {
      let content = t.content;
      if (leading) {
        content = content.replace(/^\s+/, '');
        if (content) leading = false;
      }
      return (
        <span key={k} style={{ color: t.color, fontStyle: t.fontStyle === 1 ? 'italic' : undefined }}>
          {content}
        </span>
      );
    });
  };

  if (variant === 'line') {
    const first = active[0] ?? 1;
    return (
      <div className="ha-codeline" aria-label={`Running line ${first}`}>
        <span className="ha-codeline__no">line {first}</span>
        <code className="ha-codeline__code">{renderLine(first - 1, true)}</code>
      </div>
    );
  }

  return (
    <pre className="ha-code" aria-label={`${source.label} source`}>
      <code>
        {lines.map((_, index) => (
          <span key={index} className={`ha-code__line${active.includes(index + 1) ? ' is-active' : ''}`}>
            <span className="ha-code__no" aria-hidden="true">
              {index + 1}
            </span>
            <span className="ha-code__text">{renderLine(index)}</span>
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  );
}
