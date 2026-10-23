# Configuration Reference

Only the options a generated docs site usually needs. Full, always up-to-date tables:

- `app.config.ts`: https://docs.mhaibaraai.cn/docs/reference/app-config
- `nuxt.config.ts`: https://docs.mhaibaraai.cn/docs/reference/nuxt-config

`nuxt.config.ts` holds build-time module options (feature flags, AI models, i18n). `app/app.config.ts` holds runtime UI settings (header, navigation, footer, GitHub, theme).

## nuxt.config.ts

### Minimal

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest'
})
```

### Site identity

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  site: {
    url: 'https://docs.example.com',
    name: 'My Project'
  },
  mcp: {
    name: 'My Project'
  },
  llms: {
    domain: 'https://docs.example.com',
    title: 'My Project',
    description: 'One-sentence description of the project for AI tools.'
  }
})
```

`site.url` drives canonical URLs, the sitemap, OG images and agent discovery documents.

### Feature flags

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  movkNuxtDocs: {
    componentDocs: false, // ComponentProps / Slots / Emits / Example / Code
    mcp: true,            // MCP server at /mcp
    ogImage: true,        // Build-time OG images
    mermaid: false,       // ```mermaid code blocks
    a11y: false           // @nuxt/a11y during development
  }
})
```

| Flag | Default | Install when enabled |
|------|---------|----------------------|
| `componentDocs` | `false` | `nuxt-component-meta vue-component-meta prettier` |
| `mcp` | `true` | — |
| `ogImage` | `true` | — |
| `mermaid` | `false` | `mermaid dompurify` |
| `a11y` | `false` | `@nuxt/a11y` |

### Component docs

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  movkNuxtDocs: { componentDocs: true },
  componentMeta: {
    include: ['app/components/MyButton.vue', /Card/]
  }
})
```

Put live examples in `app/components/content/examples/` and reference them with `:component-example{name="MyButtonExample"}`.

### AI Chat

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  aiChat: {
    // enabled: true,          // defaults to whether AI_API_KEY exists at build time
    model: 'openai/gpt-5-mini',
    models: ['openai/gpt-5-mini', 'anthropic/claude-sonnet-5.5']
  }
})
```

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` if `AI_API_KEY` is set | Turn AI Chat on or off |
| `model` | `''` | Default model id, `provider/model` |
| `models` | `[]` | Models offered in the selector |
| `apiPath` | `'/api/ai-chat'` | Chat endpoint |
| `mcpPath` | `'/mcp'` | MCP endpoint used for tools |

Model routing: a provider registered with `modelProviderRegistry` wins; otherwise `AI_BASE_URL` sends every model to that OpenAI-compatible endpoint (the `provider/` prefix is stripped and only used for the icon); otherwise Vercel AI Gateway is used. Install the AI packages listed in the feature table of `SKILL.md`.

### Internationalization

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/en/docs': { redirect: '/en/docs/getting-started', prerender: false }
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文' },
      { code: 'en', name: 'English' }
    ]
  }
})
```

- Do not set `file` on locales.
- The layer forces `strategy: 'prefix_except_default'`.
- Built-in UI translations: `zh-CN`, `en`. Other locales need a translation file and are otherwise filtered out with a warning.
- Content collections: default locale `docs`, `landing`, `releases`, `templates`; others `docs_{code}` etc. (`-` becomes `_`).

## app/app.config.ts

### Header and navigation

```ts [app/app.config.ts]
export default defineAppConfig({
  header: {
    title: 'My Project',
    avatar: '/logo.svg',
    nav: [
      { label: { 'zh-CN': '文档', 'en': 'Docs' }, to: '/docs/getting-started', activeMatch: '/docs' }
    ],
    mobileNav: [
      { label: { 'zh-CN': '快速开始', 'en': 'Getting Started' }, icon: 'i-lucide-square-play', to: '/docs/getting-started' }
    ],
    links: [
      { 'icon': 'i-simple-icons-github', 'to': 'https://github.com/my-org/my-project', 'target': '_blank', 'aria-label': 'GitHub' }
    ]
  }
})
```

`mobileNav` falls back to `nav` when empty. Plain string labels are fine for single-language sites.

### Sidebar categories

```ts [app/app.config.ts]
export default defineAppConfig({
  docs: {
    categories: {
      'guide': [
        { id: 'basics', title: 'Basics', icon: 'i-lucide-settings' }
      ]
    }
  }
})
```

```yaml [content/docs/2.guide/1.configuration.md]
---
title: Configuration
category: basics
---
```

### GitHub

```ts [app/app.config.ts]
export default defineAppConfig({
  github: {
    owner: 'my-org',
    name: 'my-project',
    url: 'https://github.com/my-org/my-project',
    branch: 'main',
    rootDir: 'docs',      // docs directory inside the repo (monorepos)
    commitPath: 'src',    // where CommitChangelog looks for source files
    suffix: 'vue'
  }
})
```

Set `github: false` to disable edit links, commit history and releases fetching. Production builds that use them need `NUXT_GITHUB_TOKEN`.

### Footer, TOC, SEO

```ts [app/app.config.ts]
export default defineAppConfig({
  seo: { titleTemplate: '%s - My Project' },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()} My Org`,
    socials: [{ 'icon': 'i-simple-icons-github', 'to': 'https://github.com/my-org', 'target': '_blank', 'aria-label': 'GitHub' }]
  },
  toc: {
    bottom: {
      links: [{ icon: 'i-lucide-message-circle-code', label: 'llms.txt', to: '/llms.txt', target: '_blank' }]
    }
  }
})
```

### Theme

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: { primary: 'vermilion', neutral: 'paper' } // layer defaults
  },
  theme: {
    font: 'editorial', // 'editorial' serif headings | 'sans'
    grain: false,      // paper grain texture
    radius: 0.25,
    icons: 'lucide'
  }
})
```

Single-language UI language: `i18n: { locale: 'en' }` (default `zh-CN`).

### AI Chat UI

```ts [app/app.config.ts]
export default defineAppConfig({
  aiChat: {
    floatingInput: true,
    explainWithAi: true,
    faqQuestions: [
      { category: 'Getting started', items: ['How do I install it?', 'How do I configure it?'] }
    ]
  }
})
```

`faqQuestions` also accepts a string array or an object keyed by locale.

## Component overrides

Create a component with the same name in `app/components/` to override the layer. Stable override points in v3: `Header`, `HeaderLogo`, `HeaderCenter`, `HeaderCTA`, `HeaderBody`, `HeaderBottom`, `LanguageSwitcher`, `ThemePicker`, `PageHeaderLinks`, `DocsAsideLeftTop`, `DocsAsideLeftBody`, `DocsAsideRightBottom`, `Footer`, `FooterLeft`, `FooterRight`, `ComponentExampleExtras`. Anything else is internal. Prefer `app.config` when only links or text change.

## Environment variables

```bash [.env]
NUXT_GITHUB_TOKEN=   # releases and commit history
AI_API_KEY=          # enables AI Chat
AI_BASE_URL=         # optional OpenAI-compatible endpoint, e.g. https://api.deepseek.com/v1
```
