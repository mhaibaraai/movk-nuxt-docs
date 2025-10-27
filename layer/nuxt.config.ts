import { createResolver } from '@nuxt/kit'
import pkg from './package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/css'),
    resolve('./modules/component-example'),
    resolve('./modules/component-meta'),
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'nuxt-component-meta',
    'motion-v/nuxt',
    'nuxt-llms'
  ],
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
  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },
  experimental: {
    typescriptPlugin: true
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
      // Pre-bundle CommonJS dependencies for Nuxt 4.2+ compatibility
      // See: https://cn.vite.dev/config/dep-optimization-options.html
      include: [
        '@nuxt/content',
        'extend', // Required by unified (used in @nuxt/content for markdown processing)
        'debug', // Required by Babel and dev tools
        'tailwind-variants'
      ]
    },
    resolve: {
      alias: {
        // Ensure CommonJS modules resolve to correct entry points
        extend: 'extend/index.js',
        debug: 'debug/src/browser.js' // Use browser version for client-side
      }
    }
  },
  icon: {
    provider: 'iconify'
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
