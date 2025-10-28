import { createResolver } from '@nuxt/kit'
import { rename } from 'node:fs/promises'
import { join } from 'node:path'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  modules: [
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    }
  ],
  css: ['~/assets/css/main.css'],
  site: {
    name: 'Movk Nuxt Docs',
    url: 'https://docs.mhaibaraai.cn'
  },
  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/docs/essentials': { redirect: '/docs/essentials/markdown-syntax', prerender: false },
    '/docs/components': { redirect: '/docs/components/component-props', prerender: false },
    '/llms-full.txt': { proxy: '/_llms-full.txt' }
  },
  compatibilityDate: 'latest',
  nitro: {
    prerender: {
      ignore: ['/_llms-full.txt']
    }
  },
  hooks: {
    async 'nitro:build:public-assets'(nitro) {
      console.log('\n📋 Processing llms files...')
      const outputDir = nitro.options.output.publicDir
      try {
        const source = join(outputDir, 'llms-full.txt')
        const dest = join(outputDir, '_llms-full.txt')
        await rename(source, dest)
        console.log(`✅ Renamed: ${source} → ${dest}`)
      } catch (err) {
        console.warn(`⚠️  Failed to process :`, err instanceof Error ? err.message : String(err))
      }
      console.log('✨ Processing completed\n')
    }
  },
  llms: {
    domain: 'https://docs.mhaibaraai.cn',
    title: 'Movk Nuxt Docs',
    description: '一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题。',
    full: {
      title: 'Movk Nuxt Docs - 优雅的 Nuxt 文档主题',
      description: '一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题，内置内容管理、SEO、暗黑模式、全文搜索等功能，助您轻松构建美观、专业的文档网站。'
    }
  }
})
