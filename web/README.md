# Hello Algo web (Rspress 2)

The redesigned site: Rspress 2 with interactive, trace-driven visualizers.

Uses [Bun](https://bun.sh) for packages and scripts and [Rstest](https://rstest.rs) for tests.

```bash
bun install
bun run dev        # converts every book, then serves http://localhost:3000
bun run test       # rstest: trace engine and snippet extraction
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
translated too. The interactive bubble sort page and the School view are English-only;
other locales show the book's original step figures.

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

Hand-written pages in `content/<locale>/` replace the generated page at the same path.
For example, `content/en/chapter_sorting/bubble_sort.mdx` is the interactive bubble sort
page and `content/en/school/` is the School view.

## Layout

- `content/<locale>/` – hand-written pages that override generated ones.
- `docs/` – Rspress root: `public/` is committed, `docs/<locale>/` is generated.
- `plugins/` – the remark plugin for snippets, code tabs, step figures and display math.
- `scripts/` – locales, the MkDocs converter and the `mkdocs.yml` nav reader (also used for the sidebars).
- `theme/` – Rspress theme override (theme picker in the nav) and `tokens.css`, the six palettes.
- `src/engine/` – trace types, playback (`usePlayer`), Predict mode, code extraction and highlighting.
- `src/algorithms/` – one recorded-trace implementation per algorithm, with code anchors per language.
- `src/components/` – the compact player (Watch / Predict), the Explore workbench, array stage, code view.
- `src/mdx/` – components available in every page: `CodeTabs`, `CodeTab`, `StepFrames`.
- `src/school/` – the cartoon School view.
