import { createResolver } from '@nuxt/kit'
import { rename, access } from 'node:fs/promises'
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
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/docs/essentials': { redirect: '/docs/essentials/markdown-syntax', prerender: false },
    '/docs/components': { redirect: '/docs/components/component-props', prerender: false }
  },
  compatibilityDate: 'latest',
  hooks: {
    async 'nitro:build:public-assets'(nitro) {
      console.log('\n📋 Renaming llms files to avoid Serverless Function...')

      const outputDir = nitro.options.output.publicDir
      console.log('📁 Output directory:', outputDir)

      const files = [
        { from: 'llms.txt', to: '_llms.txt' },
        { from: 'llms-full.txt', to: '_llms-full.txt' }
      ]

      for (const { from, to } of files) {
        try {
          const source = join(outputDir, from)
          const dest = join(outputDir, to)

          await access(source)
          await rename(source, dest)
          console.log(`✅ Renamed: ${from} → ${to}`)
        } catch (err) {
          console.warn(`⚠️  Failed to rename ${from}:`, err instanceof Error ? err.message : String(err))
        }
      }

      console.log('✨ Rename process completed\n')
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
