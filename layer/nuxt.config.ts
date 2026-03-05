import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'
import { createResolver, useNuxt } from '@nuxt/kit'
import { join } from 'pathe'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
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
    },
    compatibilityDate: {
      // Don't generate observability routes for now
      vercel: '2025-07-14'
    }
  },

  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1024
    }
  },

  telemetry: false,

  hooks: {
    'vite:extendConfig': async (config) => {
      // Ensure optimizeDeps.include exists
      const cfg = config as { optimizeDeps?: { include?: string[] } }
      cfg.optimizeDeps ??= {}
      cfg.optimizeDeps.include ??= []
      const include = cfg.optimizeDeps.include

      // Rewrite optimizeDeps paths for layer architecture
      const layerPkgs = /^(?:@nuxt\/content|@nuxtjs\/mdc|@nuxt\/a11y) > /
      include.forEach((id, i) => {
        if (layerPkgs.test(id)) include[i] = `@movk/nuxt-docs > ${id}`
      })

      include.push(
        '@movk/nuxt-docs > @nuxt/content > slugify',
        '@movk/nuxt-docs > @ai-sdk/gateway > @vercel/oidc'
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
    families: [
      { name: 'Public Sans', provider: 'google', global: true },
      { name: 'DM Sans', provider: 'google' },
      { name: 'Geist', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'Poppins', provider: 'google' },
      { name: 'Outfit', provider: 'google' },
      { name: 'Raleway', provider: 'google' }
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

  ogImage: {
    zeroRuntime: true,
    fonts: [
      'Noto+Sans+SC:400',
      'Inter:400'
    ]
  }
})
