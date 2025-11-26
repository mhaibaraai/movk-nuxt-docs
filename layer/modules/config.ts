import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'
import { getPackageJsonMetadata, inferSiteURL } from '../utils/meta'

export default defineNuxtModule({
  meta: {
    name: 'config'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()
    const siteName = nuxt.options?.site?.name || meta.name || gitInfo?.name || ''

    nuxt.options.llms = defu(nuxt.options.llms, {
      domain: url || 'https://example.com',
      title: siteName,
      description: meta.description || '',
      full: {
        title: siteName,
        description: meta.description || ''
      }
    })

    nuxt.options.site = defu(nuxt.options.site, {
      url,
      name: siteName,
      debug: false
    })

    nuxt.options.robots = defu(nuxt.options.robots, {
      sitemap: url ? `${url.replace(/\/$/, '')}/sitemap.xml` : undefined
    })

    nuxt.options.appConfig.header = defu(nuxt.options.appConfig.header, {
      title: siteName
    })

    nuxt.options.appConfig.seo = defu(nuxt.options.appConfig.seo, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || ''
    })

    nuxt.options.appConfig.github = defu(nuxt.options.appConfig.github, {
      owner: gitInfo?.owner,
      name: gitInfo?.name,
      url: gitInfo?.url,
      commitPath: 'src',
      suffix: 'vue',
      since: '2025-01-31T04:00:00Z',
      branch: getGitBranch()
    })

    const componentsPath = resolve('../app/components')

    nuxt.options.componentMeta = defu(nuxt.options.componentMeta, {
      exclude: [
        '@nuxt/content',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/color-mode',
        '@nuxtjs/mdc',
        'nuxt/dist',
        'nuxt-og-image',
        '@nuxtjs/plausible',
        '@nuxt/ui',
        new RegExp(`${componentsPath.replace(/[/\\]/g, '[/\\\\]')}/(?!content/(ComponentEmits|ComponentProps|ComponentSlots|ComponentExample|CommitChangelog)\\.vue$)`)
      ],
      metaFields: {
        type: false,
        props: true,
        slots: 'no-schema' as const,
        events: 'no-schema' as const,
        exposed: false
      }
    })
  }
})
