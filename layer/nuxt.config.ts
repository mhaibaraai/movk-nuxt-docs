import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'
import { createResolver, useNuxt } from '@nuxt/kit'
import { join } from 'pathe'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    () => {
      const nuxt = useNuxt()
      nuxt.options.icon ||= {}
      nuxt.options.icon.customCollections ||= []
      nuxt.options.icon.customCollections.push({
        prefix: 'custom',
        dir: join(nuxt.options.srcDir, 'assets/icons')
      })
    },
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/mcp-toolkit',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-llms',
    'nuxt-og-image',
    'nuxt-schema-org',
    'motion-v/nuxt'
  ],

  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      'class': 'bg-default'
    }
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'diff', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml']
        },
        remarkPlugins: {
          'remark-mdc': {
            options: {
              autoUnwrap: true
            }
          }
        }
      }
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'important']
    },
    experimental: {
      componentDetection: [
        'Sidebar',
        'ChatMessages',
        'ChatPrompt',
        'ChatPromptSubmit',
        'ChatReasoning',
        'ChatTool'
      ]
    }
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  experimental: {
    asyncContext: true,
    defaults: {
      nuxtLink: {
        externalRelAttribute: 'noopener'
      }
    }
  },

  compatibilityDate: '2026-01-14',

  nitro: {
    prerender: {
      routes: ['/', '/raw/index.md'],
      crawlLinks: true,
      failOnError: false,
      autoSubfolderIndex: false
    }
  },

  vite: {
    build: {
      sourcemap: false
    }
  },

  telemetry: false,

  hooks: {
    'vite:extendConfig': async (config) => {
      const cfg = config as { optimizeDeps?: { include?: string[] } }
      cfg.optimizeDeps ||= {}
      cfg.optimizeDeps.include ||= []

      // tailwindcss/colors is a peer dep resolved in the consumer project directly.
      cfg.optimizeDeps.include.push(
        'tailwindcss/colors',
        '@movk/nuxt-docs > prettier'
      )

      // AI Chat static deps — only pre-bundle when the feature is actually enabled.
      // @shikijs/langs/* and @shikijs/themes/* are dynamically imported in useHighlighter.ts
      if (process.env.AI_GATEWAY_API_KEY) {
        cfg.optimizeDeps.include.push(
          '@movk/nuxt-docs > @ai-sdk/vue',
          '@movk/nuxt-docs > ai',
          '@movk/nuxt-docs > shiki-stream/vue',
          '@movk/nuxt-docs > @shikijs/core',
          '@movk/nuxt-docs > @shikijs/engine-javascript'
        )
      }

      // Transform all remaining 'pkg > dep' entries added by Nuxt modules
      // (e.g. @nuxt/a11y > axe-core, @nuxtjs/mdc > remark-gfm) to use the
      cfg.optimizeDeps.include = cfg.optimizeDeps.include
        .map(id => (id.startsWith('@movk/nuxt-docs > ') || !id.includes(' > '))
          ? id
          : `@movk/nuxt-docs > ${id}`
        )
    }
  },

  componentMeta: {
    metaFields: {
      type: false,
      props: true,
      slots: 'no-schema',
      events: 'no-schema',
      exposed: false
    },
    exclude: [
      '@nuxt/ui',
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxtjs/color-mode',
      '@nuxtjs/mcp-toolkit',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      '@comark/vue',
      'nuxt/dist',
      'nuxt-og-image'
    ]
  },

  fonts: {
    provider: 'local'
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: resolve('./app/assets/icons')
      }
    ],
    clientBundle: {
      scan: true,
      includeCustomCollections: true
    }
  },

  llms: {
    // Must be defined before @nuxt/content setup,
    // otherwise Content LLMS module will overwrite it in modules:done.
    contentRawMarkdown: false
  },

  ogImage: {
    zeroRuntime: true
  },

  robots: {
    groups: [
      {
        contentSignal: 'search=yes, ai-train=yes, ai-input=yes'
      },
      {
        userAgent: '*',
        disallow: [
          '/vercel/',
          '/node_modules/',
          '/docs/src/',
          '/home/',
          '/_nuxt/',
          '/_plausible',
          '/dev/',
          '/api/'
        ],
        allow: '/'
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' }
    ],
    sitemap: '/sitemap.xml'
  }
})
