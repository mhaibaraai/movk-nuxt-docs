import { defineNuxtConfig } from 'nuxt/config'
import { createResolver, useNuxt } from '@nuxt/kit'
import { join } from 'pathe'
import { hasAnyAiKey } from './modules/ai-chat/keys'

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
    },
    head: {
      // 字体在构建期静态声明，随 SSR 直出。crossorigin 不可省：
      // woff2 经 CSS 加载是 anonymous CORS 请求，属性不匹配的预热连接不会被复用
      link: [
        { rel: 'preconnect', href: 'https://cdn.mhaibaraai.cn', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://cdn.mhaibaraai.cn/fonts/alibaba-puhuiti.css' }
      ]
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
    // 中文字体经 unicode-range 分包，交给 @nuxt/fonts 会让它在构建期把
    // 全部分片下载进产物，既失去按需加载也丢掉跨项目共享的 CDN 缓存
    fonts: false,
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

  experimental: {
    asyncContext: true,
    defaults: {
      nuxtLink: {
        externalRelAttribute: 'noopener'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    // Nitro defaults to true; server source maps are useless for a docs site
    // and generating them costs ~270 extra artifacts per build.
    sourceMap: false,
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
      const cfg = config as { optimizeDeps?: { include?: string[], exclude?: string[] } }
      cfg.optimizeDeps ||= {}
      cfg.optimizeDeps.include ||= []
      cfg.optimizeDeps.exclude ||= []

      // tailwindcss/colors is a peer dep resolved in the consumer project directly.
      cfg.optimizeDeps.include.push(
        'tailwindcss/colors',
        '@movk/nuxt-docs > prettier'
      )

      // shiki-transformer-color-highlight is inlined into the mdc highlighter
      // bundle via app/mdc.config.ts; its bare specifier is discovered from a
      // virtual module and can't be resolved from the consumer root under pnpm.
      // Exclude it from pre-bundling so it resolves on demand instead of warning.
      cfg.optimizeDeps.exclude.push('shiki-transformer-color-highlight')

      // AI Chat static deps — only pre-bundle when the feature is actually enabled.
      // @shikijs/langs/* and @shikijs/themes/* are dynamically imported in useHighlighter.ts
      if (hasAnyAiKey()) {
        cfg.optimizeDeps.include.push(
          '@movk/nuxt-docs > @ai-sdk/vue',
          '@movk/nuxt-docs > ai',
          '@movk/nuxt-docs > @shikijs/core',
          '@movk/nuxt-docs > @shikijs/engine-javascript'
        )
        // @comark/vue (+ highlight plugin) is imported by AiMarkdown.client.ts;
        // same bare-specifier resolution constraint as above.
        cfg.optimizeDeps.exclude.push(
          '@comark/vue',
          '@comark/vue/plugins/highlight'
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
    zeroRuntime: true,
    // Reuse images rendered by a previous build; on memory-constrained CI the
    // per-page takumi renders are the dominant native allocation.
    buildCache: true,
    security: {
      renderTimeout: 60000
    }
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
