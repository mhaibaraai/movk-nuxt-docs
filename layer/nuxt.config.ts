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
    '@nuxt/fonts',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/a11y',
    '@nuxtjs/robots',
    '@nuxtjs/mcp-toolkit',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-llms',
    'nuxt-og-image',
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
      componentDetection: true
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
        '@movk/nuxt-docs > @movk/core',
        '@movk/nuxt-docs > prettier',
        '@movk/nuxt-docs > reka-ui'
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

  a11y: {
    logIssues: false
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
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image'
    ]
  },

  fonts: {
    provider: 'bunny',
    families: [
      { name: 'Public Sans', global: true },
      { name: 'Noto Sans SC', global: true }
    ]
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
  }
})
