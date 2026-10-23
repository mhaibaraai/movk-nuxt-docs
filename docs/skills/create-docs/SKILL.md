---
name: create-docs
description: |
  Create a complete documentation site for any project with Movk Nuxt Docs v3.
  Use when asked to:
  "create docs", "add documentation", "set up a docs site", "generate documentation",
  "document this project", "write docs", "initialize docs",
  "add docs folder", "scaffold a documentation site".
  为任何项目创建完整的文档网站。当被要求时使用此技能：
  "创建文档", "添加文档", "建立文档网站", "生成文档",
  "文档化项目", "编写文档", "初始化文档",
  "添加文档文件夹", "创建文档网站"。
  Generates a Movk Nuxt Docs site with search, dark mode, MCP server, llms.txt and agent discovery built in.
---

# Create Docs

Generate a production-ready documentation site based on the `@movk/nuxt-docs` Nuxt layer (v3).

## Workflow

1. **Analyze** — Detect the package manager, monorepo layout, languages, and what the project exposes.
2. **Scaffold** — Pick a template (`default`, `i18n`, `module`) or extend the layer in an existing Nuxt app.
3. **Generate** — Write pages under `content/docs/` from the skeletons in [references/templates.md](./references/templates.md).
4. **Configure** — Declare navigation in `app.config.ts`, enable only the features the project needs.
5. **Finalize** — Verify the build and hand over the commands.

Requirements: Node.js >= 22.5 (Nuxt Content uses the built-in `node:sqlite`), Nuxt 4, Tailwind CSS 4, `@nuxt/content` 3.

---

## Step 1: Analyze the Project

### Package manager

Detect from the lock file; default to npm. Use `[pm]` below as the placeholder.

| Lock file | PM | Install | Run | Add |
|-----------|----|---------|-----|-----|
| `pnpm-lock.yaml` | pnpm | `pnpm install` | `pnpm run` | `pnpm add` |
| `package-lock.json` | npm | `npm install` | `npm run` | `npm install` |
| `yarn.lock` | yarn | `yarn install` | `yarn` | `yarn add` |
| `bun.lock` / `bun.lockb` | bun | `bun install` | `bun run` | `bun add` |

### Project layout

| Signal | Meaning |
|--------|---------|
| `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, `workspaces` in `package.json` | Monorepo |
| `apps/` | Put the docs in `apps/docs` |
| `packages/` only | Put the docs in `docs` |
| Existing `docs/` that is not a Nuxt app | Ask before overwriting; otherwise use `documentation/` |
| `nuxt.config.ts` already present and the user wants docs inside it | Extend the layer instead of scaffolding |

### Context to read

| Source | Extract |
|--------|---------|
| `README.md` | Name, pitch, features, usage examples |
| `package.json` | Name, description, repository URL, `exports`, peer dependencies |
| `src/` / `lib/` / `runtime/` | Public functions, composables, components, module options |
| `CHANGELOG.md` or GitHub releases | Whether a releases page is worth enabling |
| Existing translations | Whether the docs need more than one language |

Document what the code actually exposes. Never invent options or return values.

---

## Step 2: Scaffold

### Choose a template

| Template | Use for | Includes |
|----------|---------|----------|
| `default` | Most projects | ESLint, typecheck scripts, `.editorconfig`, `.vscode/` |
| `i18n` | Docs in two or more languages | `@nuxtjs/i18n`, `zh-CN` + `en` content trees |
| `module` | Small library / Nuxt module docs | Minimal setup plus `content/releases.yml` |

```bash
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/default my-docs
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/i18n my-docs
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/module my-docs
```

Template layout (`default`):

```text
[docs-location]/
├── app/
│   └── app.config.ts            # header.nav, header.mobileNav, docs.categories
├── content/
│   ├── index.md                 # Landing page (optional, see below)
│   └── docs/                    # Required: every docs page lives here → /docs/**
│       └── 1.getting-started/
│           ├── .navigation.yml
│           ├── 1.index.md
│           └── 2.installation.md
├── public/
├── nuxt.config.ts               # extends: ['@movk/nuxt-docs']
└── package.json
```

The `i18n` template adds `content/en/index.md` and `content/en/docs/**`. The default locale stays at the `content/` root without a URL prefix; every other locale lives in `content/{locale}/` and is served under `/{locale}/docs/**`.

### Extend an existing Nuxt app

```bash
[pm] add @movk/nuxt-docs @nuxt/content tailwindcss
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs']
})
```

Then create `content/docs/` and an `app/app.config.ts` as described in Step 4.

### Monorepo wiring

```yaml [pnpm-workspace.yaml]
packages:
  - packages/*
  - docs
```

```json [package.json]
{
  "scripts": {
    "docs:dev": "pnpm --filter ./docs dev",
    "docs:build": "pnpm --filter ./docs build"
  }
}
```

For npm / yarn / bun add the docs directory to `workspaces` and use `[pm] run dev --workspace=docs`.

---

## Step 3: Generate Content

### Content rules (v3)

- Docs pages must live in `content/docs/` (other locales: `content/{locale}/docs/`). Routes always start with `/docs`.
- Numeric prefixes (`1.getting-started/`, `2.installation.md`) order pages and are stripped from URLs.
- Every section directory gets a `.navigation.yml` with `title` and `icon`.
- The sidebar shows the current top-level section. Pages without `category` appear under an "Overview" group; subdirectories become their own groups; pages with `category` are grouped by `docs.categories` in `app.config.ts`.
- `content/index.md` is the landing page, written with Nuxt UI page components. To build the home page in Vue instead, create `app/pages/index.vue`; the landing collection is then skipped.
- `content/releases.yml` (or `.md`) enables `/releases`; `content/templates.yml` (or `.md`) enables `/templates`.
- Add a `routeRules` redirect for every section root, e.g. `'/docs': { redirect: '/docs/getting-started', prerender: false }`.

### Recommended structure

```text
content/docs/
├── 1.getting-started/   # Introduction, installation, project structure
├── 2.guide/             # Task-oriented guides, one feature per page
├── 3.api/               # Functions, composables, components, options (if any)
└── 4.examples/          # Recipes (optional)
```

Generate, in order:

1. **Introduction** — what it is, who it is for, key features, link to installation.
2. **Installation** — prerequisites, install commands in a `::code-group`, minimal setup, verification.
3. **Guides** — one page per feature with action-oriented H2 headings.
4. **API reference** — one page per public function / component when the surface is large; a single table page when it is small.
5. **Landing page** — hero, install command, feature grid. Do not add an "AI integration" section; MCP and llms.txt work without configuration.

### MDC rules

- Nuxt UI components need the `u-` prefix in MDC: `::u-page-hero`, `:::u-button`, `:u-color-mode-image`.
- Prose components do not: `::note`, `::tip`, `::warning`, `::caution`, `::callout`, `::code-group`, `::code-preview`, `::steps`, `::tabs`, `::accordion`, `::card`, `::card-group`, `::field`, `:badge`.
- Nesting increases the colon count: `::` → `:::` → `::::`.

See [references/mdc-components.md](./references/mdc-components.md) and [references/writing-guide.md](./references/writing-guide.md).

---

## Step 4: Configure

Keep configuration minimal and only enable what the project uses. Full details: [references/configuration.md](./references/configuration.md).

### Navigation in `app.config.ts`

```ts [app/app.config.ts]
export default defineAppConfig({
  header: {
    title: 'My Project',
    nav: [
      { label: 'Docs', to: '/docs/getting-started', activeMatch: '/docs' },
      { label: 'Releases', to: '/releases' }
    ],
    mobileNav: [
      { label: 'Getting Started', icon: 'i-lucide-square-play', to: '/docs/getting-started' }
    ]
  },
  docs: {
    categories: {
      guide: [
        { id: 'basics', title: 'Basics', icon: 'i-lucide-settings' },
        { id: 'advanced', title: 'Advanced', icon: 'i-lucide-rocket' }
      ]
    }
  },
  github: {
    owner: 'my-org',
    name: 'my-project',
    url: 'https://github.com/my-org/my-project',
    rootDir: 'docs'
  }
})
```

- `label` / `title` accept a per-locale object (`{ 'zh-CN': '文档', 'en': 'Docs' }`) when i18n is enabled.
- Internal links get the locale prefix automatically; do not hard-code `/en/...` in `nav`.
- Keys of `docs.categories` are top-level directory slugs without the numeric prefix; pages opt in with `category: <id>` in frontmatter.
- Do not override `useHeader` / `useCategory` for navigation; `app.config` is the v3 way.

### Feature flags in `nuxt.config.ts`

| Flag | Default | Extra packages when enabled |
|------|---------|-----------------------------|
| `movkNuxtDocs.mcp` | `true` | none |
| `movkNuxtDocs.ogImage` | `true` | none |
| `movkNuxtDocs.componentDocs` | `false` | `nuxt-component-meta vue-component-meta prettier` |
| `movkNuxtDocs.mermaid` | `false` | `mermaid dompurify` |
| `movkNuxtDocs.a11y` | `false` | `@nuxt/a11y` |
| `aiChat.enabled` | `true` when `AI_API_KEY` is set at build time | `ai @ai-sdk/openai @ai-sdk/vue @comark/vue @shikijs/engine-javascript @shikijs/langs @shikijs/themes` |

A missing package fails the build with the exact install command. AI Chat requires MCP; do not set `mcp: false` while AI Chat is enabled.

Enable `componentDocs` only when the project ships Vue components to document, and `mermaid` only when pages contain `mermaid` code blocks.

### Internationalization

Only when the project needs several languages: install `@nuxtjs/i18n`, add it to `modules`, and list `i18n.locales` with `code` and `name`. Never declare `file` on a locale; the layer registers its own translations (`zh-CN`, `en`). A locale without a matching translation and `content/{locale}/` directory is dropped at build time with a warning. Single-language sites set the UI language with `app.config` `i18n.locale` (default `zh-CN`; use `en` for English sites).

### Theme

The default look is editorial: vermilion primary, warm `paper` neutral, serif headings. Change it only on request:

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: { colors: { primary: 'blue', neutral: 'zinc' } },
  theme: { font: 'sans', grain: false, radius: 0.5 }
})
```

### AI features

Enabled by default, nothing to configure:

- MCP server at `/mcp`
- `/llms.txt` and `/llms-full.txt`
- Markdown for agents: `/raw/<path>.md`, `Accept: text/markdown` negotiation, `/sitemap.md`
- `/.well-known/api-catalog`, `/.well-known/mcp/server-card.json`, `/.well-known/skills/index.json`

Set `mcp.name` and the `llms` title / description in `nuxt.config.ts` so agents see the project name. To publish Agent Skills, add `skills/<name>/SKILL.md` at the docs root (directory name equals `name`, kebab-case, max 64 characters).

### Environment variables

| Variable | When |
|----------|------|
| `NUXT_GITHUB_TOKEN` | Production builds that show releases or commit history |
| `AI_API_KEY` | Enables AI Chat |
| `AI_BASE_URL` | OpenAI-compatible endpoint; omit to route through Vercel AI Gateway |

---

## Step 5: Finalize

1. Run `[pm] install` and `[pm] run build`. Treat `[request error]` lines in the prerender log as dead links and fix them.
2. Hand over:

```text
Documentation created at [docs-location]

  cd [docs-location]
  [pm] install
  [pm] run dev        # http://localhost:3000
```

For monorepos also mention `[pm] run docs:dev` from the root.

3. Offer follow-ups: brand colors, richer landing page, component docs, i18n, deployment.

### Deployment

| Platform | Build | Notes |
|----------|-------|-------|
| Vercel | `[pm] run build` | Auto-detected, set env vars in the dashboard |
| Netlify | `[pm] run build` | Auto-detected preset |
| Cloudflare | `[pm] run build` | Select the Cloudflare Nitro preset for the target (Pages or Workers) |
| Static hosting | `[pm] run generate` | Output in `.output/public`; AI Chat and MCP need a server and are unavailable |

Docs: https://docs.mhaibaraai.cn/docs/getting-started/installation, https://docs.mhaibaraai.cn/docs/guide/deployment
