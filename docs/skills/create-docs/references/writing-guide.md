# Writing Guide

Conventions for docs written in English, Chinese, or both. When a site has several locales, every page exists in each locale with the same headings, code and links (only the text is translated).

## Frontmatter text

| Field | English | Chinese |
|-------|---------|---------|
| `title` | 1-4 words, noun for concepts, function / component name for API | 2-8 characters |
| `description` | One or two sentences, 120-160 characters, says what the reader can do after reading | 60-120 characters, same intent |
| `seo.title` | 50-60 characters, includes the project name or main keyword | Same, or English when the site targets English search |
| `seo.description` | 120-160 characters, unique per page | Same |

Never copy the same description to several pages.

## English

- Straight ASCII punctuation and quotes.
- Oxford comma: `themes, layouts, and components`.
- No space between number and unit: `16px`, `300ms`.
- Active voice, present tense, second person: "Configure the header", not "The header can be configured".
- Contractions are fine in guides, avoid them in API reference.

## Chinese

- Full-width punctuation in prose: `，。：；？！（）`; quotes use `「」` or `“”`.
- One space between Chinese and Latin letters or numbers: `使用 Nuxt 4 构建`, `共 3 个选项`.
- No space between numbers and units: `16px`, `100ms`.
- Code, paths, option names and URLs keep half-width characters and go in inline code.
- Address the reader directly ("在 `app.config.ts` 中配置"), avoid passive constructions such as "被配置".
- Do not mix full-width punctuation into code spans or file names.

## Proper nouns

| Correct | Wrong |
|---------|-------|
| Nuxt, Nuxt UI, Nuxt Content | nuxt, NuxtUI |
| Vue.js / Vue | vue, VueJS |
| TypeScript | Typescript |
| GitHub | Github |
| Tailwind CSS | tailwindcss (in prose) |
| Markdown, MDC | markdown, mdc |
| pnpm, npm | PNPM, NPM |

## Headings

- One H1 per page, generated from `title`; start the body with H2.
- Do not skip levels (H2 → H4), keep a blank line after each heading.
- Guides: start H2 / H3 with a verb ("Add a category", "添加分类").
- Getting started uses nouns (Introduction, Installation); API pages use the exact symbol name.

| Static | Action-based |
|--------|--------------|
| Configuration | Configure the site |
| Navigation | Add navigation links |
| Deployment | Deploy to Vercel |

Verbs: add, configure, create, enable, disable, customize, connect, handle, deploy, override, use.

## Code

- Every fenced block has a language: `bash`, `ts`, `vue`, `json`, `yaml`, `md`, `mdc`, `text`.
- Blocks that represent a file carry its path: ` ```ts [nuxt.config.ts] `.
- Install commands go in a `::code-group` with pnpm, npm, yarn and bun; put the project's package manager first.
- Group only equivalent alternatives; an install command and a config file are two separate blocks.
- Examples are complete and copy-paste ready, with realistic names; comments only where intent is not obvious.
- Use `::code-preview` when showing Markdown or MDC so the reader sees the rendered result.

## Links and images

- Internal links start with `/docs/` (other locales `/{locale}/docs/`), never relative paths or the deployed domain.
- External links get `target: _blank` in frontmatter `links`.
- Link text describes the target ("see [feature flags](/docs/guide/features)"), never "click here".
- Every image has meaningful `alt`; UI screenshots provide light and dark variants with `u-color-mode-image`.

## Formatting

- Lists use `-`.
- Blank line before and after tables, lists and code blocks.
- Paragraphs of 2-5 sentences; split pages longer than roughly 1500 words.
- No emojis.
- End guides with a short "Next steps" / 「下一步」 list of related pages.
