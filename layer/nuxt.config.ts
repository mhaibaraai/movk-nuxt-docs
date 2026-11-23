import { defineNuxtConfig } from 'nuxt/config'
import { createResolver, useNuxt } from '@nuxt/kit'
import { join } from 'pathe'
import { defu } from 'defu'
import { resolveModulePath } from 'exsolve'
import { setupSiteMetadata } from './modules/module'
import { getFeatures } from './utils/features'
import { setupPrerenderContentTypes } from './utils/prerender-content-types'

const { resolve } = createResolver(import.meta.url)
const ogFontPackage = '@fontsource-variable/noto-sans-sc'

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
    // nuxt-agent-discovery 在 setup 里就读走了自己的选项，依赖消费方配置的项必须在它之前写入：
    // MCP 服务卡片取决于功能开关与 aiChat.mcpPath。服务卡片的名称、版本、仓库等消费方元数据
    // 留给 server/plugins/agent-discovery.ts 在请求期补全
    () => {
      const nuxt = useNuxt()
      const options = nuxt.options as unknown as Record<string, any>

      options.agentDiscovery = defu(options.agentDiscovery, {
        discovery: {
          mcpServerCard: getFeatures(nuxt).mcp
            ? {
                endpoint: options.aiChat?.mcpPath || '/mcp',
                name: '',
                documentation: options.mcp?.browserRedirect || '/docs'
              }
            : false,
          links: [
            { href: '/docs', rel: 'service-doc', type: 'text/html', title: 'Documentation', anchor: '/' },
            // agent 从错误页恢复用的入口，不进 Link 头——Link 头只通告发现文档本身
            { href: '/raw/index.md', rel: 'start', type: 'text/markdown', title: 'Homepage', header: false }
          ]
        }
      })
    },
    'nuxt-agent-discovery',
    '@vueuse/nuxt',
    // Set site metadata before nuxt-llms reads its options during setup.
    () => setupSiteMetadata(useNuxt()),
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
          theme: { default: 'github-light', light: 'github-light', dark: 'github-dark' },
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
      noApiRoute: false,
      theme: { default: 'github-light', light: 'github-light', dark: 'github-dark' }
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

  // 由 modules/i18n.ts 与 modules/routing.ts 在构建期写入，这里声明默认值以生成完整类型
  runtimeConfig: {
    // GitHub API 令牌，对应环境变量 NUXT_GITHUB_TOKEN
    githubToken: '',
    public: {
      movkDocs: {
        filteredLocales: [] as { code: string, name: string, language?: string }[],
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
    // 页面切换时标题形变、页头与侧栏保持静止；Nuxt 在 prefers-reduced-motion 下自动跳过
    viewTransition: true,
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
    'modules:before': () => {
      // Nuxt UI resolves its Fonts dependency before module setup.
      const nuxt = useNuxt()
      nuxt.options.ui ||= {}
      const ogImage = getFeatures(nuxt).ogImage
      const ogOnlyFonts = nuxt.options.ui.fonts === undefined && nuxt.options.fonts === undefined
      nuxt.options.ui.fonts ??= ogImage
      if (ogImage && nuxt.options.ui.fonts && nuxt.options.fonts !== false) {
        const fonts: NonNullable<typeof nuxt.options.fonts> = {
          // The legacy Fonts panel needs h3 v2 even when the host pins h3 to v1.
          devtools: false,
          ...ogOnlyFonts && {
            processCSSVariables: false,
            providers: {
              google: false,
              googleicons: false,
              bunny: false,
              fontshare: false,
              fontsource: false,
              adobe: false
            }
          },
          npm: {
            remote: false,
            resolve: (id: string) => {
              // pnpm consumers cannot resolve a dependency installed only under the layer.
              const from = id.startsWith(`${ogFontPackage}/`) ? import.meta.url : `${nuxt.options.rootDir}/`
              return resolveModulePath(id, { from, conditions: ['node', 'import', 'style', 'default'], try: true }) ?? null
            }
          },
          families: [{
            name: 'Noto Sans SC Variable',
            provider: 'npm',
            providerOptions: { npm: { package: ogFontPackage } },
            weights: [400, 700],
            styles: ['normal'],
            formats: ['woff2'],
            global: true,
            preload: false
          }]
        }
        nuxt.options.fonts = defu(nuxt.options.fonts, fonts)
      }
    },
    'nitro:init': setupPrerenderContentTypes,
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

      // @nuxtjs/i18n 在 package.json 声明了 imports 字段，依赖扫描器会把其运行时文件里的
      // #components 当作包内 subpath import 解析并报错，导致整轮预构建被跳过。
      // 扫描阶段将 Nuxt 虚拟模块标记为外部即可，正常编译仍由 Nuxt 的插件解析
      const scanOptions = cfg.optimizeDeps as { rolldownOptions?: { plugins?: unknown[] } }
      scanOptions.rolldownOptions ||= {}
      scanOptions.rolldownOptions.plugins = [
        ...(scanOptions.rolldownOptions.plugins || []),
        {
          name: 'movk:scan-nuxt-virtual',
          resolveId: (id: string) => id === '#components' ? { id, external: true } : null
        }
      ]

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
  // routes 保持默认 ['/', '/**']，i18n 前缀也一并被覆盖，无需按 locale 枚举。
  // 依赖消费方配置的 mcpServerCard 与 discovery.links 由 modules 数组里的内联模块补齐。
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
    disallow: ['/api/github/']
  }
})
