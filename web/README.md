# Hello Algo web (Rspress 2)

An experimental, unofficial redesign of the [Hello Algo](https://github.com/krahets/hello-algo) site:
Rspress 2 with interactive, trace-driven visualizers.

> **Attribution.** The book's text, code, images and translations are the work of
> [krahets](https://github.com/krahets) and the
> [Hello Algo contributors](https://github.com/krahets/hello-algo/graphs/contributors), licensed under
> [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). This folder adds a
> new site engine, design and visualizers on top of that content; it is a modified version,
> not endorsed by the original authors, and is shared under the same license. The official site is
> [hello-algo.com](https://www.hello-algo.com). Every page of the built site carries this credit in its footer.

Uses [Bun](https://bun.sh) for packages and scripts and [Rstest](https://rstest.rs) for tests.

```bash
bun install
bun run dev        # converts every book, then serves http://localhost:3000
bun run test       # rstest: traces, figures and snippet extraction
bun run typecheck
bun run build      # converts, then builds the static site into doc_build/
```

## Languages

| Locale | URL | Source |
| --- | --- | --- |
| English (default) | `/` | `../en` |
| 简体中文 | `/zh/` | `..` (`docs/`, `codes/`, `mkdocs.yml`) |
| 繁體中文 | `/zh-hant/` | `../zh-hant` |
| 日本語 | `/ja/` | `../ja` |
| Русский | `/ru/` | `../ru` |

Locales are defined once in `scripts/locales.ts` (labels, admonition titles, nav text);
the converter, the Rspress config and the snippet coverage test all read it. Code
snippets on each page come from that locale's own `codes/` folder, so comments are
translated too. The interactive players, the Explore workbench and the School view are
translated into all five languages (`src/i18n/ui.ts` for interface text, each algorithm's
own tables for narration).

## Where content comes from

The MkDocs books stay the source of truth. `bun run convert`
(`scripts/convert-mkdocs.ts`, run automatically by `dev` and `build`) regenerates
`docs/<locale>/` for every locale, including each locale's home page built from its
nav. Everything in `docs/` except `public/` is gitignored, so edit the book in its
MkDocs folder and rerun the command.

The converter turns MkDocs syntax into Rspress Markdown:

| MkDocs | Rspress |
| --- | --- |
| `=== "Python"` language tabs | code fences between `<!-- ha:codetabs -->` markers → `<CodeTabs>` |
| `=== "<1>"`, `=== "<2>"` image tabs | `<!-- ha:steps -->` markers → `<StepFrames>` figure |
| `!!! tip "Title"`, `??? success "Answer"` | `:::tip Title`, `:::details Answer` |
| `??? pythontutor` | a link to Python Tutor |
| `Table <id>` | numbered per chapter, e.g. `Table 8-1` |

Code snippets such as

````md
```src
[file]{bubble_sort}-[class]{}-[func]{bubble_sort_with_flag}
```
````

stay in the Markdown and are expanded at build time by `plugins/remarkHelloAlgo.ts`.
It extracts the function, method or class from the locale's `codes/<lang>/<chapter>/`
for up to 14 languages (`src/engine/snippets.ts`; the English tree has no Zig), and a
test checks that every reference in every translation resolves.

Hand-written pages in `content/<locale>/` replace the generated page at the same path
(none are needed right now).

## Visualizers

Each visualized algorithm is a recorded trace (`src/algorithms/<name>.ts`): the function
runs once on the input and returns a list of frames (array, marks, pointers, variables,
the active range), plus narration for two voices (reader and kid) in every locale, Predict
questions, and anchors that tie each event to a line of the book's Python and Java code.
`src/algorithms/registry.ts` lists them and loads each on demand.

| Algorithm | Book page | School level |
| --- | --- | --- |
| Bubble sort | `chapter_sorting/bubble_sort` | 1 |
| Selection sort | `chapter_sorting/selection_sort` | 2 |
| Insertion sort | `chapter_sorting/insertion_sort` | 3 |
| Binary search | `chapter_searching/binary_search` | 4 |
| Quick sort | `chapter_sorting/quick_sort` | 5 |
| Merge sort | `chapter_sorting/merge_sort` | 6 |

The converter places a player where the book had the step-by-step figure for that
algorithm (`scripts/players.ts`, `PLAYER_PLACEMENTS`): it writes a
`<!-- ha:player id :: caption -->` marker, which the remark plugin turns into
`<AlgoFigure>`. Every other figure stays the book's original image. The converter also
writes the School pages, `school/` (the level map) and `school/<id>`, for each locale.

To add an algorithm: write its trace and spec, add it to the registry, map its figure in
`PLAYER_PLACEMENTS` (and `SCHOOL_LEVELS`), and the shared tests in
`src/algorithms/algorithms.test.ts` check sorting, anchors and narration in every locale.

## Redrawn figures

The book's static images are being replaced, chapter by chapter, with figures drawn in
the browser (`src/figures/`). A figure is plain data: a *scene* of boxes, list nodes,
arrows, labels and panels in a fixed coordinate space, built with the helpers in
`src/figures/kit.ts` and rendered as SVG by `SceneView`. Colors come from the theme
tokens, so every figure follows the six palettes and dark mode, and all labels and
narration are translated.

- A **static figure** is one scene, plus an optional legend and notes.
- A **table figure** is an HTML table, for figures that are really reference tables (ASCII).
- A **step figure** is a list of scenes with narration (and, where the book has code, the
  running line in Python and Java). Nodes keep their ids between steps, so they glide to
  new positions instead of jumping.

`src/figures/registry.ts` lists which images are redrawn (by chapter folder and image
name; a `<1>`, `<2>` … sequence becomes one id ending in `_steps`). The converter replaces
those images with `<!-- ha:figure chapter/id :: caption -->`, which the remark plugin turns
into `<Fig>`. Each chapter's figures live in one module under `src/figures/chapters/` and
load with the page. Redrawn so far: chapters 1–8 (introduction, complexity analysis, data
structures, arrays and linked lists, stacks and queues, hashing, trees, heaps). `src/figures/figures.test.tsx` checks that every registered figure
exists in the book, builds well-formed scenes in every locale, resolves its code lines,
and renders.

## Layout

- `content/<locale>/` – hand-written pages that override generated ones.
- `docs/` – Rspress root: `public/` is committed, `docs/<locale>/` is generated.
- `plugins/` – the remark plugin for snippets, code tabs, step figures and display math.
- `scripts/` – locales, the MkDocs converter, player placements and the `mkdocs.yml` nav reader (also used for the sidebars).
- `theme/` – Rspress theme override (theme picker in the nav) and `tokens.css`, the six palettes.
- `src/engine/` – trace types, playback (`usePlayer`), Predict mode, code extraction and highlighting.
- `src/algorithms/` – one recorded-trace implementation per algorithm, with code anchors per language, and the registry.
- `src/components/` – the compact player (Watch / Predict), the Explore workbench, array stage, code view.
- `src/mdx/` – components available in every page: `CodeTabs`, `CodeTab`, `StepFrames`, `AlgoFigure`, `Fig`.
- `src/figures/` – redrawn book figures: scene model, layout kit, SVG renderer, step player, one module per chapter.
- `src/i18n/` – locale helpers and interface text for the players and the School view.
- `src/school/` – the cartoon School view: level map, levels, stars.
