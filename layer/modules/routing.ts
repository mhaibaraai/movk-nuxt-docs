import { defineNuxtModule, extendPages, createResolver } from '@nuxt/kit'
import { landingPageExists, releasesFileExists } from '../utils/pages'

export default defineNuxtModule({
  meta: {
    name: 'routing'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const rootDir = nuxt.options.rootDir

    const hasReleasesFile = releasesFileExists(rootDir)
    const hasLandingPage = landingPageExists(rootDir)
    const routeRules = nuxt.options.routeRules ||= {}
    const docsRouteRules = routeRules['/docs/**'] || {}

    routeRules['/docs/**'] = {
      ...docsRouteRules,
      headers: {
        ...docsRouteRules.headers,
        Vary: 'Accept, User-Agent'
      }
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
          path: '/releases',
          file: resolve('../app/templates/releases.vue')
        })
      }
    })
  }
})
