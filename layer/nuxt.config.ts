import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/a11y',
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
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'diff', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'mermaid']
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

  compatibilityDate: 'latest',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      autoSubfolderIndex: false
    }
  },

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
        '@movk/nuxt-docs > @ai-sdk/gateway > @vercel/oidc',
        // Fix mermaid ESM compatibility issues
        '@movk/nuxt-docs > mermaid',
        '@movk/nuxt-docs > mermaid > dayjs',
        '@movk/nuxt-docs > mermaid > @braintree/sanitize-url',
        '@movk/nuxt-docs > mermaid > d3',
        '@movk/nuxt-docs > mermaid > dompurify'
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
      { name: 'DM Sans', provider: 'google', global: true },
      { name: 'Geist', provider: 'google', global: true },
      { name: 'Inter', provider: 'google', global: true },
      { name: 'Poppins', provider: 'google', global: true },
      { name: 'Outfit', provider: 'google', global: true },
      { name: 'Raleway', provider: 'google', global: true }
    ]
  },

  icon: {
    provider: 'iconify'
  },

  ogImage: {
    zeroRuntime: true,
    fonts: [
      'Noto+Sans+SC:400',
      'Inter:400'
    ]
  }
})
