---
name: review-docs
description: |
  Review documentation for quality, clarity, SEO, and technical correctness.
  Optimized for Movk Nuxt Docs v3 / Nuxt Content, compatible with any Markdown docs.
  Use when asked to:
  "review docs", "audit documentation", "check documentation",
  "validate MDC syntax", "check SEO issues", "analyze docs structure",
  "improve documentation quality", "verify documentation".
  审查文档的质量、清晰度、SEO 和技术正确性。当被要求时使用：
  "审查文档"、"检查文档"、"审计文档"、"验证 MDC 语法"、
  "检查 SEO 问题"、"分析文档结构"、"改进文档质量"、"分析文档"。
  Provides prioritized, actionable suggestions (Critical / Important / Suggested).
---

# Review Docs

Review a documentation site and produce a prioritized report. Full checks apply to Movk Nuxt Docs v3 / Nuxt Content projects; generic Markdown docs get the content-quality checks only.

## Workflow

1. **Detect** — Project type, feature flags, locales.
2. **Map** — Content tree, sections, page counts, locale parity.
3. **Validate** — Technical checks ([references/technical-checks.md](./references/technical-checks.md)).
4. **Review content** — Clarity, SEO, structure.
5. **Report** — Fill [assets/report-template.md](./assets/report-template.md).

This skill reports only. Offer to fix issues after the report; do not edit files unless asked.

### Priorities

- **Critical** — Breaks the build, rendering or navigation: missing `title` / `description`, unknown or mis-prefixed MDC component, dead internal link, page outside `content/docs/`, component-docs component used with `componentDocs` disabled, `file` declared on an i18n locale, examples that contradict the source.
- **Important** — Hurts users or search: missing `seo.*`, undeclared `category`, missing locale counterpart, screenshot without dark variant, override advice outside the v3 contract, unlabeled code blocks, passive instructions.
- **Suggested** — Polish: callouts, next-step links, tighter wording, stale badges.

---

## Step 1: Detect the Project

### Type

| Signal | Type |
|--------|------|
| `@movk/nuxt-docs` in `package.json` or `extends` in `nuxt.config.ts` | A: Movk Nuxt Docs (full checks) |
| `@nuxt/content` without the layer | A-: Nuxt Content (skip layer-specific checks) |
| Markdown only | B: Generic (content quality only) |

### Configuration to read (type A)

From `nuxt.config.ts`:

- `movkNuxtDocs.componentDocs`, `mcp`, `ogImage`, `mermaid`, `a11y` (defaults `false`, `true`, `true`, `false`, `false`)
- `aiChat.enabled`, `aiChat.model(s)`
- `modules` contains `@nuxtjs/i18n` → read `i18n.defaultLocale` and `i18n.locales`
- `routeRules` redirects for section roots
- `componentMeta.include`

From `app/app.config.ts`:

- `header.nav`, `header.mobileNav`, `docs.categories`
- `github` (object or `false`)
- `i18n.locale` for single-language sites

Record:

```text
Project type: Movk Nuxt Docs v3
Locales: zh-CN (default), en
Features: componentDocs on, mermaid off, mcp on, aiChat off
```

---

## Step 2: Map the Content

### Locate content

Check in order: `docs/content/`, `content/`, `apps/docs/content/`. Docs pages must be under `<content>/docs/`; other locales under `<content>/{locale}/docs/`.

### Build the map

```text
content/docs (zh-CN)
  1.getting-started   4 pages   .navigation.yml present
  2.guide            11 pages   .navigation.yml present   categories: basics, customization, shipping
  3.ai                5 pages   .navigation.yml present
content/en/docs (en)
  1.getting-started   4 pages
  2.guide            10 pages   missing: 11.faq.md
Total: 39 pages
```

Note for each section: page count, `.navigation.yml`, how the section root URL resolves (page or redirect), and which `category` ids pages use.

### Locale parity

For each extra locale, diff the relative file list against the default locale. Missing files are Important; extra files without a default-locale counterpart are Suggested.

---

## Step 3: Technical Validation

Follow [references/technical-checks.md](./references/technical-checks.md). Summary:

1. **Location and links** — `/docs/` prefix, locale-correct links, every link resolves, section roots redirect.
2. **Frontmatter** — `title`, `description`, `seo.title`, `seo.description`; `category` declared in `docs.categories`; `links` objects; icon format.
3. **MDC components** — `u-` prefix only for Nuxt UI components (`::u-page-hero`); prose components without prefix (`::note`, `::code-group`, `:badge`); every name resolves to Nuxt UI, the layer or the project.
4. **Feature-dependent components** — `component-props` / `slots` / `emits` / `example` / `code` need `componentDocs`; ` ```mermaid ` needs `mermaid`; `commit-changelog` needs GitHub config.
5. **Override advice** — only components in the v3 override contract; navigation changes via `app.config`, not `useHeader` / `useCategory`.
6. **Images** — files exist, `alt` set, UI screenshots via `:u-color-mode-image` with light and dark files.
7. **Code blocks** — languages, file labels, package-manager coverage, examples match the source.
8. **i18n** — no `file` on locales, content per locale, mirrored headings.
9. **Naming** — kebab-case, numeric prefixes, `.navigation.yml` per section.

When a build log is available, every `[request error]` line from prerender is a dead link (Critical): Movk Nuxt Docs does not fail the build on them.

For type B projects run only: frontmatter presence, Markdown syntax, link and image targets.

---

## Step 4: Content Quality

Applies to every project type.

### Clarity — [references/clarity-checks.md](./references/clarity-checks.md)

- Active voice, present tense, second person.
- Sentences around 15-20 words; paragraphs of 2-5 sentences.
- Guide headings start with a verb; getting started uses nouns; API uses symbol names.
- Consistent terminology; jargon defined on first use.
- Chinese text: full-width punctuation, spaces between Chinese and Latin / numbers, no space between number and unit.

### SEO — [references/seo-checks.md](./references/seo-checks.md)

- `seo.title` 50-60 characters, `seo.description` 120-160 characters, unique per page.
- Single H1 (from `title`), no skipped heading levels.
- Descriptive link text, related links at the end of guides.
- Image `alt` text.

### Structure — [references/structure-checks.md](./references/structure-checks.md)

- At most three levels (section, page, headings); subdirectories only for real groups.
- 2-15 pages per section.
- Logical order: getting started → guides → reference.
- No orphan pages; every page reachable from the sidebar or a link.
- Landing page with hero, install command and features.

---

## Step 5: Report

Copy [assets/report-template.md](./assets/report-template.md) and fill every section:

- Exact file path and line for each issue.
- Current text and the proposed fix side by side.
- Why it matters (impact), in one sentence.
- Group by priority, then by category (Technical, SEO, Clarity, Structure, i18n).
- Count issues in the statistics table.
- Two or three positive highlights.
- A short action plan per priority.

Keep the report proportional: for large sites, list every Critical issue, the top Important ones per category, and summarize repeated patterns ("12 pages lack `seo.description`") instead of repeating them.

End by offering to:

1. Fix all Critical issues.
2. Fill missing frontmatter and SEO metadata.
3. Add missing locale pages or align headings.
4. Rewrite specific pages for clarity.

---

## Quick Reference

Most common issues in Movk Nuxt Docs projects:

- Nuxt UI component without `u-` (`::page-hero`) or prose component with it (`::u-note`).
- Internal link without `/docs` or pointing to the default locale from a translated page.
- `category` in frontmatter not declared in `docs.categories`, so the page vanishes from the sidebar.
- `component-props` on a site where `componentDocs` is off.
- Translated page missing or with different headings.
- Screenshot without a dark variant.
- `seo.description` missing or shorter than 120 characters.
- Code block without language or file label; install commands missing a package manager.
- Install and config steps merged into one `::code-group`.
