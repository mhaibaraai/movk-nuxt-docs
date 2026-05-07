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

    const varyHeaders = {
      Vary: 'Accept, User-Agent'
    }

    const mergeRouteHeaders = (path: string, headers: Record<string, string>) => {
      const routeRule = routeRules[path] || {}

      routeRules[path] = {
        ...routeRule,
        headers: {
          ...routeRule.headers,
          ...headers
        }
      }
    }

    mergeRouteHeaders('/docs/**', varyHeaders)

    // Agent discovery Link headers on the homepage (RFC 8288, RFC 9727)
    mergeRouteHeaders('/', {
      Link: [
        '</sitemap.xml>; rel="sitemap"; type="application/xml"',
        '</sitemap.md>; rel="sitemap"; type="text/markdown"',
        '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
        '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
        '</docs>; rel="service-doc"; type="text/html"',
        '</llms.txt>; rel="describedby"; type="text/plain"',
        '</llms-full.txt>; rel="describedby"; type="text/plain"',
        '</>; rel="alternate"; type="text/markdown"'
      ].join(', '),
      ...varyHeaders
    })

    mergeRouteHeaders('/raw/**', varyHeaders)

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
