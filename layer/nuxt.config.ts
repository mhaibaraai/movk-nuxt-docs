import { createResolver } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'
import pkg from './package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/css'),
    resolve('./modules/component-example'),
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/seo',
    'nuxt-component-meta',
    'motion-v/nuxt',
    'nuxt-llms'
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
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'yaml', 'css', 'mdc', 'blade', 'edge']
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
    experimental: {
      componentDetection: true
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
      autoSubfolderIndex: false
    }
  },
  vite: {
    optimizeDeps: {
      // See: https://cn.vite.dev/config/dep-optimization-options.html
      include: [
        '@nuxt/content > slugify',
        'tailwind-variants',
        'tailwindcss/colors'
      ]
    }
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
  image: {
    format: ['webp', 'jpeg', 'jpg', 'png', 'svg'],
    provider: 'ipx'
  },
  linkChecker: {
    enabled: false
  },
  ogImage: {
    zeroRuntime: true,
    googleFontMirror: 'fonts.loli.net',
    fonts: [
      // 思源黑体 - 支持中文
      'Noto+Sans+SC:400',
      'Noto+Sans+SC:500',
      'Noto+Sans+SC:700',
      // 如果需要英文字体
      'Inter:400',
      'Inter:700'
    ]
  }
})
