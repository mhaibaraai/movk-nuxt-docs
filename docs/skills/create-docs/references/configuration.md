# Configuration Reference

Movk Nuxt Docs is configured through two files: `nuxt.config.ts` and `app/app.config.ts`.

## nuxt.config.ts

### Minimal Configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
})
```

### Full Configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  // Custom CSS
  css: ['~/assets/css/main.css'],

  // Site information (used for SEO)
  site: {
    name: 'My Docs',
  },

  // AI Chat configuration
  aiChat: {
    model: 'openai/gpt-5-nano',
    models: [
      'openai/gpt-5-nano',
      'deepseek/deepseek-v3.2',
    ],
  },

  // MCP Server configuration
  mcp: {
    name: 'My Docs',
  },

  // Layer feature flags
  movkNuxtDocs: {
    a11y: true,
    mermaid: false
  },

  // Component metadata (for auto-generated component docs)
  componentMeta: {
    include: [
      'Button',
      'Card*',
    ],
  }
})
```

### Layer Feature Flags

| Option | Type | Default | Description |
|------|------|--------|------|
| `movkNuxtDocs.a11y` | `boolean` | `true` | Enable the `@nuxt/a11y` accessibility module |
| `movkNuxtDocs.mermaid` | `boolean` | `false` | Enable Mermaid diagram rendering (requires `mermaid` and `dompurify`) |

### AI Chat

| Option | Type | Description |
|------|------|------|
| `aiChat.model` | `string` | Default model |
| `aiChat.models` | `string[]` | List of selectable models |

The model format is `provider/model-name`, for example `openai/gpt-5-nano` or `deepseek/deepseek-v3.2`.

### Component Metadata

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  componentMeta: {
    // Supports string globs, regular expressions, and functions
    include: [
      'Button',                // Exact match
      'Card*',                 // Wildcard
      /^Modal/,                // Regular expression
    ],
    exclude: ['Internal*'],
  },
})
```

## app/app.config.ts

### Theme

```ts [app/app.config.ts]
export default defineAppConfig({
  theme: {
    radius: 0.25,            // Border radius (rem)
    blackAsPrimary: false,   // Use black as the primary color
    icons: 'lucide',         // Icon set (lucide)
    font: 'Alibaba PuHuiTi', // Font
  },
  ui: {
    colors: {
      primary: 'green',      // Primary color
      neutral: 'slate',      // Neutral color
    },
  },
})
```

### Header

```ts [app/app.config.ts]
export default defineAppConfig({
  header: {
    title: 'My Docs',           // Title
    avatar: '/avatar.png',      // Avatar
    to: '/',                    // Title link
    search: true,               // Search bar
    colorMode: true,            // Color mode toggle
    links: [                    // Header links
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/my/repo',
        target: '_blank',
        label: 'GitHub',
      },
    ],
  },
})
```

### Footer

```ts [app/app.config.ts]
export default defineAppConfig({
  footer: {
    credits: `Copyright © 2024 - ${new Date().getFullYear()}`,
    socials: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/my/repo',
        target: '_blank',
        label: 'GitHub',
      },
    ],
  },
})
```

### TOC

```ts [app/app.config.ts]
export default defineAppConfig({
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      links: [
        {
          icon: 'i-lucide-book-open',
          label: 'Nuxt UI Docs',
          to: 'https://ui.nuxt.com',
          target: '_blank',
        },
      ],
    },
  },
})
```

### SEO

```ts [app/app.config.ts]
export default defineAppConfig({
  seo: {
    titleTemplate: '',      // Title template, defaults to '%s - ${site.name}'
    title: '',              // Default title
    description: '',        // Default description
  },
})
```

### GitHub Integration

```ts [app/app.config.ts]
export default defineAppConfig({
  github: {
    branch: 'main',
    rootDir: 'docs',         // Docs root directory (for monorepos)
    dateFormat: {
      locale: 'en-US',
      options: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    },
  },
})
```

Disable the GitHub integration: `github: false`.

### AI Chat UI

```ts [app/app.config.ts]
export default defineAppConfig({
  aiChat: {
    floatingInput: true,       // Floating input
    explainWithAi: true,       // "Explain with AI" button
    shortcuts: {
      focusInput: 'meta_i',    // Keyboard shortcut
    },
    // FAQ questions
    faqQuestions: [
      {
        category: 'Quick start',
        items: ['How do I install?', 'How do I configure it?'],
      },
    ],
    // Customize UI text
    texts: {
      title: 'AI Assistant',
      placeholder: 'Type your question...',
      trigger: 'Chat with AI',
    },
    // Customize icons
    icons: {
      trigger: 'i-custom-ai',
    },
  },
})
```

## Route Rules

Configure redirects and prerender rules in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
  },
})
```

## Content Collections

Movk Nuxt Docs predefines three content collections:

| Collection | Path | Description |
|------|------|------|
| `docs` | `content/docs/` | Documentation pages |
| `landing` | `content/index.md` | Landing page |
| `releases` | `content/releases.yml` | Release log |

`releases.yml` or `releases.md` is auto-detected and exposes a `/releases` route.

## Component Overrides

Create a same-named file under `app/components/` to override the Layer default component:

| Component | File path | Description |
|------|----------|------|
| Header | `components/header/Header.vue` | Full header |
| HeaderLogo | `components/header/HeaderLogo.vue` | Logo and title |
| HeaderCTA | `components/header/HeaderCTA.vue` | Right-side header actions |
| Footer | `components/footer/Footer.vue` | Full footer |
| DocsAsideLeftTop | `components/DocsAsideLeftTop.vue` | Top of the left sidebar |
| DocsAsideLeftBody | `components/DocsAsideLeftBody.vue` | Body of the left sidebar |
| DocsAsideRightBottom | `components/DocsAsideRightBottom.vue` | Bottom of the right TOC sidebar |
| PageHeaderLinks | `components/PageHeaderLinks.vue` | Right-side actions on the page header |
| ThemePicker | `components/theme-picker/ThemePicker.vue` | Theme picker |

## Environment Variables

Configure environment variables according to the features you enable:

```bash [.env]
# Used to fetch docs content
NUXT_GITHUB_TOKEN=
# Used to access AI Gateway services
AI_GATEWAY_API_KEY=
```
