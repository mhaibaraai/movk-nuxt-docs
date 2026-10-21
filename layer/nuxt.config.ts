import { defineNuxtConfig } from 'nuxt/config'
import { createResolver, useNuxt } from '@nuxt/kit'
import { join } from 'pathe'
import { defu } from 'defu'
import { docsFolderExists } from './utils/pages'
import { getFeatures } from './utils/features'

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
    '@nuxtjs/sitemap',
    // nuxt-agent-discovery 在 setup 里就读走了自己的选项，所以依赖 rootDir 的两项
    // 必须在它之前写入：docs 前缀是运行期探测的（见 content.config.ts），
    // MCP 端点则由 aiChat.mcpPath 决定。服务卡片的名称、版本、仓库等消费方元数据
    // 留给 server/plugins/agent-discovery.ts 在请求期补全
    () => {
      const nuxt = useNuxt()
      const options = nuxt.options as unknown as Record<string, any>
      const docsPrefix = docsFolderExists(nuxt.options.rootDir) ? '/docs' : '/'

      options.agentDiscovery = defu(options.agentDiscovery, {
        discovery: {
          mcpServerCard: getFeatures(nuxt).mcp
            ? {
                endpoint: options.aiChat?.mcpPath || '/mcp',
                name: '',
                documentation: options.mcp?.browserRedirect || docsPrefix
              }
            : false,
          links: [
            { href: docsPrefix, rel: 'service-doc', type: 'text/html', title: 'Documentation', anchor: '/' },
            // agent 从错误页恢复用的入口，不进 Link 头——Link 头只通告发现文档本身
            { href: '/raw/index.md', rel: 'start', type: 'text/markdown', title: 'Homepage', header: false }
          ]
        }
      })
    },
    'nuxt-agent-discovery',
    '@vueuse/nuxt',
    'nuxt-llms',
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

  // 由 modules/i18n.ts 与 modules/routing.ts 在构建期写入，这里声明默认值以生成完整类型
  runtimeConfig: {
    // GitHub API 令牌，对应环境变量 NUXT_GITHUB_TOKEN
    githubToken: '',
    public: {
      movkDocs: {
        filteredLocales: [] as { code: string, name: string }[],
        releasesPage: false,
        features: {
          mcp: true,
          aiChat: false,
          componentDocs: false,
          ogImage: true
        }
      }
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
      cfg.optimizeDeps.include.push('tailwindcss/colors')

      // shiki-transformer-color-highlight is inlined into the mdc highlighter
      // bundle via app/mdc.config.ts; its bare specifier is discovered from a
      // virtual module and can't be resolved from the consumer root under pnpm.
      // Exclude it from pre-bundling so it resolves on demand instead of warning.
      cfg.optimizeDeps.exclude.push('shiki-transformer-color-highlight')

      // 其余模块追加的嵌套依赖（如 @nuxt/a11y > axe-core、@nuxtjs/mdc > remark-gfm）
      // 在 pnpm 下无法从消费方根目录解析，统一改为经由 @movk/nuxt-docs 解析
      cfg.optimizeDeps.include = cfg.optimizeDeps.include
        .map(id => (id.startsWith('@movk/nuxt-docs > ') || !id.includes(' > '))
          ? id
          : `@movk/nuxt-docs > ${id}`
        )
    }
  },

  // siteUrl/siteName 留空：由消费方的 site.url / site.name 解析，layer 无从得知。
  // routes 保持默认 ['/', '/**']——docs 前缀是运行期探测的（见 content.config.ts），
  // i18n 前缀也一并被覆盖，无需按 locale 枚举。
  // 依赖 rootDir 的 mcpServerCard 与 discovery.links 由 modules 数组里的内联模块补齐。
  agentDiscovery: {
    sitemap: {
      markdown: {
        expand: ['/docs'],
        labels: { 'getting-started': 'Getting Started' }
      }
    },
    skills: {
      dir: 'skills'
    }
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: resolve('./app/assets/icons')
      }
    ],
    clientBundle: {
      scan: { globInclude: ['**/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml,ts}'] },
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
    // agent 的 Allow 分组与 Content-Signal 由 nuxt-agent-discovery 通过 robots:config 注入，
    // 与内容协商共用同一份 user-agent 列表
    disallow: ['/_nuxt/', '/api/']
  }
})
