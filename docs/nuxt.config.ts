import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from '../package.json'

const buildForWorkers = process.env.NITRO_PRESET?.replaceAll('_', '-') === 'cloudflare-module'
const localD1Id = '00000000-0000-0000-0000-000000000000'

const moved = (slugs: string[], from: string, to: string) =>
  Object.fromEntries(slugs.map(slug => [`${from}/${slug}`, `${to}/${slug}`]))

// 组合式函数参考页的 slug 改为与函数名一致
const renamedComposables = (from: string) => Object.fromEntries(Object.entries({
  'fetch-component-meta': 'use-fetch-component-meta',
  'fetch-component-example': 'use-fetch-component-example',
  'use-docs-filter': 'use-docs-filter-config'
}).map(([oldSlug, newSlug]) => [`${from}/${oldSlug}`, `/docs/reference/composables/${newSlug}`]))

// 区块首页跳到首篇
const sectionRedirects: Record<string, string> = {
  '/docs': '/docs/getting-started',
  '/docs/guide': '/docs/guide/configuration',
  '/docs/ai': '/docs/ai/ai-chat',
  '/docs/writing': '/docs/writing/markdown-syntax',
  '/docs/components': '/docs/components/component-props',
  '/docs/reference': '/docs/reference/app-config',
  '/docs/reference/composables': '/docs/reference/composables/use-movk-i18n'
}

// v2 旧路径永久跳到 v3 新位置
const legacyRedirects: Record<string, string> = {
  '/docs/typography': '/docs/writing/markdown-syntax',
  '/docs/composables': '/docs/reference/composables/use-header',
  '/docs/getting-started/nuxt': '/docs/guide/pages',
  ...moved(['configuration', 'customization', 'i18n', 'deployment', 'troubleshooting'], '/docs/getting-started', '/docs/guide'),
  ...moved(['ai-chat', 'mcp', 'skills', 'llms-txt'], '/docs/getting-started', '/docs/ai'),
  ...moved(['markdown-syntax', 'code-blocks', 'mdc-components', 'media', 'mermaid'], '/docs/typography', '/docs/writing'),
  ...moved(['use-header', 'use-navigation', 'use-category', 'use-theme'], '/docs/composables', '/docs/reference/composables'),
  ...renamedComposables('/docs/composables'),
  ...renamedComposables('/docs/reference/composables')
}

// llms.txt 按文档分区列出中文页面，英文页面通过 details 说明路径规则
const llmsSections = [
  ['Getting Started', 'getting-started'],
  ['Guide', 'guide'],
  ['AI', 'ai'],
  ['Writing', 'writing'],
  ['Components', 'components'],
  ['Reference', 'reference']
].map(([title, slug]) => ({
  title,
  contentCollection: 'docs',
  contentFilters: [{ field: 'path', operator: 'LIKE', value: `/docs/${slug}%` }]
}))

const redirectRules = (redirects: Record<string, string>, statusCode: number) =>
  ['', '/en'].flatMap(prefix => Object.entries(redirects).map(([from, to]) => [
    `${prefix}${from}`,
    { redirect: { to: `${prefix}${to}`, statusCode }, prerender: false }
  ]))

export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxtjs/i18n'],

  $development: {
    site: {
      url: 'http://localhost:3000'
    }
  },

  $production: {
    site: {
      url: 'https://docs.mhaibaraai.cn'
    }
  },

  app: {
    head: {
      // 中文字体经 unicode-range 分包托管在 CDN，按需加载；crossorigin 需与 woff2 的 CORS 请求一致才能复用预热连接
      link: [
        { rel: 'preconnect', href: 'https://cdn.mhaibaraai.cn', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://cdn.mhaibaraai.cn/fonts/alibaba-puhuiti.css' }
      ]
    }
  },

  site: {
    name: 'Movk Nuxt Docs'
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: Object.fromEntries([
    ...redirectRules(sectionRedirects, 302),
    ...redirectRules(legacyRedirects, 301)
  ]),

  compatibilityDate: '2026-06-30',

  ...(buildForWorkers && {
    image: { provider: 'none' },
    ogImage: {
      buildCache: { base: '../node_modules/.cache/nuxt/og-image' }
    },
    nitro: {
      output: { dir: '.output-cloudflare' },
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
        wrangler: {
          d1_databases: [{
            binding: 'DB',
            database_name: 'movk-nuxt-docs-content',
            database_id: process.env.CLOUDFLARE_D1_DATABASE_ID || localD1Id
          }]
        }
      }
    },
    hooks: {
      'nitro:init': (nitro) => {
        nitro.hooks.hook('compiled', async () => {
          const path = join(nitro.options.output.publicDir, '_headers')
          const headers = await readFile(path, 'utf8')
          const buildRules = headers.match(/^\/_nuxt\/builds\/[^\n]*\n(?:[ \t][^\n]*\n?)*/gm) || []
          if (!buildRules.length) return

          // Cloudflare combines matching headers. Apply the build rules after /_nuxt/*
          // so the latest manifest keeps its short lifetime and hashed metadata stays immutable.
          let output = headers
          for (const rule of buildRules) output = output.replace(rule, '')
          const overrides = buildRules
            .sort((a, b) => a.indexOf('\n') - b.indexOf('\n'))
            .map(rule => rule.replace(/^([ \t]+)cache-control:/m, '$1! cache-control\n$1cache-control:'))
          await writeFile(path, `${output.trimEnd()}\n${overrides.join('').trimEnd()}\n`)
        })
      },
      'nitro:config': (config) => {
        // Agent discovery handles negotiated requests before the HTML asset fallback.
        config.handlers ||= []
        config.handlers.push({
          middleware: true,
          env: 'cloudflare-module',
          handler: fileURLToPath(new URL('./runtime/cloudflare/prerendered.ts', import.meta.url))
        })
      }
    }
  }),

  vite: {
    optimizeDeps: {
      include: [
        '@comark/vue',
        '@comark/vue/plugins/highlight',
        '@movk/core',
        '@unhead/schema-org/vue',
        'shiki-transformer-color-highlight'
      ]
    }
  },

  agentDiscovery: {
    llms: {
      details: ['Chinese docs live under /docs and English docs under /en/docs. Append .md to any page URL to get its Markdown.']
    },
    sitemap: {
      markdown: {
        labels: { ai: 'AI' }
      }
    }
  },

  aiChat: {
    model: 'alibaba/qwen3.8-27b',
    models: [
      'alibaba/qwen3.8-27b',
      'deepseek/deepseek-v4-pro-0813'
    ]
  },

  componentMeta: {
    include: ['app/components/TestApi.vue']
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文' },
      { code: 'en', name: 'English' }
    ]
  },

  llms: {
    domain: 'https://docs.mhaibaraai.cn',
    title: 'Movk Nuxt Docs',
    description: 'A Nuxt 4 documentation layer built on Nuxt UI and Nuxt Content, with editorial typography, search, SEO, MCP Server, llms.txt, AI Chat and automated component docs.',
    notes: [
      'Nuxt 4',
      'Nuxt UI',
      'Nuxt Content',
      'MDC',
      'MCP Server',
      'AI Chat',
      'Component docs',
      'i18n'
    ],
    sections: llmsSections,
    full: {
      title: 'Movk Nuxt Docs',
      description: 'Full Chinese documentation of Movk Nuxt Docs, a Nuxt 4 documentation layer built on Nuxt UI and Nuxt Content.'
    }
  },

  mcp: {
    name: 'Movk Nuxt Docs',
    browserRedirect: '/docs/ai/mcp'
  },

  movkNuxtDocs: {
    componentDocs: true,
    a11y: true,
    mermaid: true
  }
})
