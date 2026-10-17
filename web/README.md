# Hello Algo web (Rspress 2)

The redesigned site: Rspress 2 with interactive, trace-driven visualizers.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # trace engine tests
npm run typecheck
npm run build      # static site in doc_build/
```

## Layout

- `docs/` – pages (MDX). Only `chapter_sorting/bubble_sort` is migrated so far.
- `theme/` – Rspress theme override (theme picker in the nav) and `tokens.css`, the six palettes.
- `src/engine/` – trace types, playback (`usePlayer`), Predict mode, code extraction and highlighting.
- `src/algorithms/` – one recorded-trace implementation per algorithm, with code anchors per language.
- `src/components/` – the compact player (Watch / Predict), the Explore workbench, array stage, code view.
- `src/school/` – the cartoon School view.

Code shown in players is read from `../en/codes/<lang>/` at build time, so it always matches the repository.
