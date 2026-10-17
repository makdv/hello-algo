# Hello Algo web (Rspress 2)

The redesigned site: Rspress 2 with interactive, trace-driven visualizers.

```bash
npm install
npm run dev        # converts ../en/docs, then serves http://localhost:3000
npm test           # trace engine and snippet extraction tests
npm run typecheck
npm run build      # converts, then builds the static site into doc_build/
```

## Where content comes from

`../en/docs` (the MkDocs book) is still the source of truth. `npm run convert`
(`scripts/convert-mkdocs.ts`, run automatically by `dev` and `build`) regenerates
`docs/chapter_*`, `docs/assets` and `docs/index.assets` from it. These folders are
gitignored, so edit the book in `../en/docs` and rerun the command.

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
It extracts the function, method or class from `../en/codes/<lang>/<chapter>/` for
all 13 languages (`src/engine/snippets.ts`), and a test checks every reference in
the book resolves.

Hand-written pages in `content/` replace the generated page at the same path. For
example, `content/chapter_sorting/bubble_sort.mdx` is the interactive bubble sort page.

## Layout

- `content/` – hand-written pages that override generated ones.
- `docs/` – Rspress root: home (`index.mdx`), School view, public files, plus the generated chapters.
- `plugins/` – the remark plugin for snippets, code tabs, step figures and display math.
- `scripts/` – the MkDocs converter and the `mkdocs.yml` nav reader (also used for the sidebar).
- `theme/` – Rspress theme override (theme picker in the nav) and `tokens.css`, the six palettes.
- `src/engine/` – trace types, playback (`usePlayer`), Predict mode, code extraction and highlighting.
- `src/algorithms/` – one recorded-trace implementation per algorithm, with code anchors per language.
- `src/components/` – the compact player (Watch / Predict), the Explore workbench, array stage, code view.
- `src/mdx/` – components available in every page: `CodeTabs`, `CodeTab`, `StepFrames`.
- `src/school/` – the cartoon School view.
