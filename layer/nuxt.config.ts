import { createResolver } from '@nuxt/kit'
import pkg from './package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/css'),
    resolve('./modules/component-example'),
    resolve('./modules/llms'),
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
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
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'css', 'mdc', 'blade', 'edge']
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
    ...process.env.NODE_ENV === 'development'
      ? {
          '/_llms-full.txt': { proxy: '/llms-full.txt' }
        }
      : {}
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
      routes: ['/', '/sitemap.xml', '/robots.txt', '/404.html'],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },
  vite: {
    optimizeDeps: {
      // See: https://cn.vite.dev/config/dep-optimization-options.html
      include: [
        '@nuxt/content > slugify',
        'extend', // unified 所需（用于 @nuxt/content 的 markdown 处理）
        'debug', // Babel 和开发工具所需
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
    report: {
      publish: true,
      html: true,
      markdown: true,
      json: true
    }
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
