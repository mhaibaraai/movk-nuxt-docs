import { defineNuxtModule, extendPages, createResolver } from '@nuxt/kit'
import { landingPageExists, releasesFileExists, templatesFileExists } from '../utils/pages'

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
          path: '/releases',
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
