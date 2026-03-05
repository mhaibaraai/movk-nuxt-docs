import { existsSync } from 'node:fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { join } from 'pathe'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'
import { getPackageJsonMetadata, inferSiteURL } from '../utils/meta'
import { createComponentMetaExcludeFilters } from '../utils/component-meta'

function getMdcConfigSources(nuxt: any): string[] {
  return nuxt.options._layers.flatMap((layer: any) => {
    const tsConfigPath = join(layer.config.srcDir, 'mdc.config.ts')
    if (existsSync(tsConfigPath)) {
      return [tsConfigPath]
    }

    const jsConfigPath = join(layer.config.srcDir, 'mdc.config.js')
    if (existsSync(jsConfigPath)) {
      return [jsConfigPath]
    }

    return []
  })
}

export default defineNuxtModule({
  meta: {
    name: 'config'
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#ai-chat'] = resolve('./ai-chat/runtime')

    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()

    const site = nuxt.options.site
    const siteName = (site && site.name) || meta.name || gitInfo?.name || ''

    nuxt.options.site = defu(nuxt.options.site, {
      url,
      name: siteName,
      debug: false
    })

    nuxt.options.llms = defu(nuxt.options.llms, {
      domain: url || 'https://example.com',
      title: siteName,
      description: meta.description || '',
      full: {
        title: siteName,
        description: meta.description || ''
      }
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
      branch: getGitBranch(),
      per_page: 100,
      until: new Date().toISOString()
    })

    const layerPath = resolve('..')

    // @ts-ignore - component-meta is not typed
    nuxt.hook('component-meta:extend', (options: any) => {
      const userInclude = (nuxt.options.componentMeta && typeof nuxt.options.componentMeta === 'object')
        ? nuxt.options.componentMeta.include || []
        : []

      options.exclude = [
        ...(options.exclude || []),
        ...createComponentMetaExcludeFilters(resolve, dir, layerPath, userInclude)
      ]
    })

    // Load mdc.config from all layers
    const mdcConfigSources = getMdcConfigSources(nuxt)
    if (mdcConfigSources.length > 0) {
      await nuxt.callHook('mdc:configSources', mdcConfigSources)
    }
  }
})
