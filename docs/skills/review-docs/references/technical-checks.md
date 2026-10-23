# Technical Validation Guide

Checks for Movk Nuxt Docs v3 / Nuxt Content projects: content location, frontmatter, MDC components, feature-dependent components, images, code blocks, i18n parity and file naming. Each check lists its default priority.

## Content Location and Links

| Check | Priority |
|-------|----------|
| Docs pages are under `content/docs/`; other locales under `content/{locale}/docs/` | Critical |
| Internal links use absolute paths starting with `/docs/` (other locales `/{locale}/docs/`) | Important |
| Internal links point to existing pages (compare with the file tree, numeric prefixes stripped) | Critical |
| No relative `.md` links (`../guide/x.md`) and no hard-coded deployed domain for internal pages | Important |
| A page in a non-default locale links to the same locale (`/en/docs/...`), not the default locale | Important |
| Each section root URL has a page or a `routeRules` redirect in `nuxt.config.ts` | Important |

Route mapping: `content/docs/2.guide/3.navigation.md` → `/docs/guide/navigation`; `content/docs/1.getting-started/1.index.md` → `/docs/getting-started`.

Broken links do not fail a Movk build (`nitro.prerender.failOnError` is `false`); they only print `[request error]` lines during prerender. When a build log is available, treat each such line as Critical.

## Frontmatter

### Fields

```yaml
---
title: Navigation              # Required
description: Declare header links and sidebar groups in app.config.ts.   # Required
seo:
  title: Configure navigation in Movk Nuxt Docs        # Recommended
  description: Declare desktop and mobile header links ...   # Recommended
navigation:                    # Optional
  icon: i-lucide-panel-left
  title: Nav
  badge: New
category: basics               # Optional, must exist in app.config docs.categories
links:                         # Optional header buttons
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/org/repo/blob/main/src/x.ts
    target: _blank
keywords: [sidebar, menu]      # Optional, used by MCP search
---
```

| Check | Priority |
|-------|----------|
| `title` and `description` present and non-empty | Critical |
| Valid YAML (quotes around values containing `:` or starting with `@`, `*`, `[`) | Critical |
| `seo.title` and `seo.description` present | Important |
| `description` unique across pages | Important |
| `links` is an array of objects with `label` and `to`; external links have `target: _blank` | Important |
| `category` declared in `docs.categories` for the page's top-level section; an undeclared id hides the page from the sidebar | Important |
| Icons use the `i-{collection}-{name}` format (`i-lucide-house`) | Important |
| `navigation: false` only on pages that must stay out of the sidebar | Suggested |
| Stale badges such as `navigation.badge: V2` on pages that are no longer new | Suggested |
| `links` pointing to source files that still exist at that path | Suggested |

## MDC Components

### Naming

| Family | Example | Prefix |
|--------|---------|--------|
| Nuxt UI components | `::u-page-hero`, `:::u-button`, `:u-color-mode-image` | `u-` required |
| Nuxt UI prose components | `::note`, `::tip`, `::warning`, `::caution`, `::callout`, `::code-group`, `::code-preview`, `::code-collapse`, `::code-tree`, `::steps`, `::tabs`, `::accordion`, `::card`, `::card-group`, `::field`, `::field-group`, `:badge`, `:kbd`, `:icon` | none |
| Layer content components | `::motion`, `:stars-bg`, `:commit-changelog`, `:page-last-commit` | none |
| Component docs (needs `componentDocs`) | `:component-props`, `:component-slots`, `:component-emits`, `:component-example`, `:component-code` | none |
| Project components | anything in `app/components/content/` | none |

| Check | Priority |
|-------|----------|
| Nuxt UI component without `u-` (`::page-hero`) | Critical |
| Prose component with `u-` (`::u-note`) | Critical |
| Component name that exists nowhere (Nuxt UI, layer, project) | Critical |
| Unclosed block or mismatched colon count | Critical |
| Slot name not supported by the component (`#title`, `#description`, `#links`, `#code`) | Important |
| Props passed with invalid syntax (`{key=value}` without quotes for strings containing spaces) | Important |

Nesting: `::` → `:::` → `::::`, one extra colon per level; inner blocks are indented by two spaces for readability.

To confirm a name, check `https://ui.nuxt.com/llms.txt`, `layer/app/components/content/`, `layer/modules/component-docs/runtime/components/` (in `node_modules/@movk/nuxt-docs/`), and the project's `app/components/content/`.

### Feature-dependent components

Read `nuxt.config.ts` before validating:

| Usage | Requires | Priority if missing |
|-------|----------|---------------------|
| `component-props` / `slots` / `emits` / `example` / `code` | `movkNuxtDocs.componentDocs: true`, packages `nuxt-component-meta vue-component-meta prettier`, target in `componentMeta.include` | Critical (renders empty or fails the build) |
| ` ```mermaid ` blocks | `movkNuxtDocs.mermaid: true`, packages `mermaid dompurify` | Important (shown as plain code) |
| `:commit-changelog`, edit links, releases | `app.config` `github` not `false`, owner / name set, `NUXT_GITHUB_TOKEN` in production | Important |
| Docs describing AI Chat as available | `aiChat.enabled` or `AI_API_KEY`, AI packages installed, MCP not disabled | Important |

`component-props` / `slots` / `emits` resolve the component from `slug`, defaulting to the last URL segment in camel/Pascal case. A page named `3.button.md` documents `Button`. Flag pages whose file name does not match the component and no `slug` is given. `component-example` uses `name`, matching a file in `app/components/content/examples/`.

### Component overrides described in docs

When docs tell users to override a layer component, the name must be in the v3 override contract: `Header`, `HeaderLogo`, `HeaderCenter`, `HeaderCTA`, `HeaderBody`, `HeaderBottom`, `LanguageSwitcher`, `ThemePicker`, `PageHeaderLinks`, `DocsAsideLeftTop`, `DocsAsideLeftBody`, `DocsAsideRightBottom`, `Footer`, `FooterLeft`, `FooterRight`, `ComponentExampleExtras`. The source of truth is the table in the layer's customization guide (`docs/content/docs/2.guide/5.customization.md` in the movk-nuxt-docs repository). Recommending an unlisted component (e.g. `ThemePickerButton`) is Important. Recommending `useHeader` / `useCategory` overrides for plain navigation changes is Suggested: v3 uses `app.config` `header.nav`, `header.mobileNav`, `docs.categories`.

## Images

| Check | Priority |
|-------|----------|
| Image file exists in `public/` at the referenced path | Critical |
| Every image has meaningful `alt` text | Important |
| UI screenshots use `:u-color-mode-image{light="..." dark="..."}` with both files present | Important |
| `width` / `height` set on large images to avoid layout shift | Suggested |
| Screenshots show the current UI (not an older theme or removed component) | Suggested |

## Code Blocks

| Check | Priority |
|-------|----------|
| Every fence has a language (`ts`, `vue`, `bash`, `json`, `yaml`, `md`, `mdc`, `text`) | Important |
| Blocks representing a file have a label: ` ```ts [nuxt.config.ts] ` | Important |
| Code matches the project stack (`<script setup lang="ts">` in TypeScript projects) | Important |
| Install commands in `::code-group` cover the package managers the project supports (usually pnpm, npm, yarn, bun) | Important |
| `::code-group` only groups equivalent variants, never install + config | Important |
| Options, defaults and signatures in examples match the source code | Critical |
| `::code-preview` used for rendered Markdown / MDC examples | Suggested |

Label conventions: `[nuxt.config.ts]`, `[app/app.config.ts]`, `[components/Alert.vue]`, `[Terminal]`. No label needed for type-only snippets, MDC syntax examples and inline fragments.

Good:

````markdown
```bash [Terminal]
pnpm add my-package
```

Add the module to `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['my-package']
})
```
````

Avoid: putting both blocks above into one `::code-group`.

## Internationalization Parity

Only when `@nuxtjs/i18n` is in `modules`:

| Check | Priority |
|-------|----------|
| `i18n.locales` entries do not declare `file` (the layer registers its own translations) | Critical |
| Each locale in `i18n.locales` has a `content/{code}/` directory (default locale uses the `content/` root); missing ones are dropped at build time | Critical |
| Every default-locale page has a counterpart at the same relative path in each locale | Important |
| Counterparts have the same H2 / H3 structure, code blocks and component usage | Important |
| `.navigation.yml` titles are translated per locale | Suggested |
| `app.config` labels used on multilingual sites are per-locale objects (`{ 'zh-CN': '文档', 'en': 'Docs' }`) | Suggested |

## File and Directory Naming

| Check | Priority |
|-------|----------|
| Kebab-case file and directory names | Important |
| Numeric prefixes for ordering (`1.getting-started/`, `2.installation.md`), no duplicates in one directory | Important |
| `.navigation.yml` with `title` and `icon` in every section directory | Important |
| Gaps in numbering | Suggested |

```yaml [content/docs/1.getting-started/.navigation.yml]
title: Getting Started
icon: i-lucide-square-play
```

## Validation Checklist

### Location and links
- [ ] Pages under `content/docs/` (and `content/{locale}/docs/`).
- [ ] Internal links absolute, `/docs/`-prefixed, locale-correct, and resolving.
- [ ] Section roots have a page or redirect.

### Frontmatter
- [ ] `title`, `description` present; `seo.*` present.
- [ ] `category` ids declared in `docs.categories`.
- [ ] `links` objects well-formed; icons `i-*`.

### MDC
- [ ] `u-` prefix only on Nuxt UI components.
- [ ] Every component name resolves.
- [ ] Feature-dependent components have their feature flag and packages.
- [ ] Override advice limited to the v3 contract.

### Images and code
- [ ] Images exist, have `alt`, screenshots have light and dark variants.
- [ ] Fences have languages and file labels; examples match the source.

### i18n (if enabled)
- [ ] No `file` on locales; every locale has content.
- [ ] Pages and headings mirrored across locales.
