import { createResolver, extendViteConfig } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/a11y',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-llms',
    'motion-v/nuxt',
    () => {
      extendViteConfig((config) => {
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push(
          '@nuxt/content > slugify',
          'extend',
          '@ai-sdk/gateway > @vercel/oidc',
          'mermaid',
          'dompurify'
        )
        config.optimizeDeps.include = config.optimizeDeps.include
          .map(id => id.replace(/^@nuxt\/content > /, '@movk/nuxt-docs > @nuxt/content > '))
      })
    }
  ],
  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      'class': 'bg-default'
    }
  },
  // @ts-ignore - content 配置的类型定义在运行时才能正确解析
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
  routeRules: {
    '/llms.txt': { isr: true },
    '/llms-full.txt': { isr: true }
  },
  experimental: {
    typescriptPlugin: true,
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
  a11y: {
    logIssues: false
  },
  componentMeta: {
    metaFields: {
      type: false,
      props: true,
      slots: 'no-schema' as const,
      events: 'no-schema' as const,
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
    googleFontMirror: 'fonts.loli.net',
    fonts: [
      'Noto+Sans+SC:400',
      'Noto+Sans+SC:500',
      'Noto+Sans+SC:700',
      'Inter:400',
      'Inter:700'
    ]
  },
  sitemap: {
    zeroRuntime: true
  }
})
