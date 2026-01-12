import { defineNuxtModule, extendPages, createResolver } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { existsSync } from 'node:fs'

export default defineNuxtModule({
  meta: {
    name: 'routing'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const cwd = joinURL(nuxt.options.rootDir, 'content')

    const hasReleases = ['releases.yml', 'releases.md']
      .some(file => existsSync(joinURL(cwd, file)))

    extendPages((pages) => {
      if (hasReleases) {
        pages.push({
          name: 'releases',
          path: '/releases',
          file: resolve('../app/templates/releases.vue')
        })
      }
    })
  }
})
