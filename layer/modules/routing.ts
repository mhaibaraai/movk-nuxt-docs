import { defineNuxtModule, extendPages, createResolver, logger } from '@nuxt/kit'
import { docsFolderExists, landingPageExists, releasesFileExists, templatesFileExists } from '../utils/pages'

export default defineNuxtModule({
  meta: {
    name: 'routing'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const rootDir = nuxt.options.rootDir

    const hasReleasesFile = releasesFileExists(rootDir)
    const hasTemplatesFile = templatesFileExists(rootDir)
    const hasLandingPage = landingPageExists(rootDir)

    if (!docsFolderExists(rootDir)) {
      logger.withTag('@movk/nuxt-docs').warn('未找到 content/docs 目录，文档页面固定位于 /docs 下，请将文档放入 content/docs/')
    }

    // 供 CommitChangelog 等组件判断能否链接到站内版本页
    nuxt.options.runtimeConfig.public.movkDocs = {
      ...nuxt.options.runtimeConfig.public.movkDocs,
      releasesPage: hasReleasesFile
    }

    extendPages((pages) => {
      if (!hasLandingPage) {
        pages.push({
          name: 'index',
          path: '/',
          file: resolve('../app/templates/landing.vue')
        })
      }

      if (hasReleasesFile) {
        pages.push({
          name: 'releases',
          path: '/releases/:tag?',
          file: resolve('../app/templates/releases.vue')
        })
      }

      if (hasTemplatesFile) {
        pages.push({
          name: 'templates',
          path: '/templates',
          file: resolve('../app/templates/templates.vue')
        })
      }
    })
  }
})
