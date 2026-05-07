import { addComponentsDir, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import type { ModuleDependencies, NuxtModule } from 'nuxt/schema'
import { defu } from 'defu'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'
import { getPackageJsonMetadata, inferSiteURL } from '../utils/meta'
import { createComponentMetaExcludeFilters } from '../utils/component-meta'
import { startCase, kebabCase } from '@movk/core'
import { updateSiteConfig } from 'nuxt-site-config/kit'
import type { SiteConfigInput } from 'nuxt-site-config/kit'

export interface ModuleOptions {
  /**
   * 是否启用 @nuxt/a11y 无障碍支持
   * @defaultValue true
   * @see https://a11y.nuxtjs.org/
   */
  a11y?: boolean
  /**
   * 是否启用 Mermaid 图表支持
   * - 启用前需安装依赖: `pnpm add mermaid dompurify`
   * @defaultValue false
   */
  mermaid?: boolean
}

const log = logger.withTag('@movk/nuxt-docs')

const movkNuxtDocsModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'movk-nuxt-docs',
    configKey: 'movkNuxtDocs',
    docs: 'https://docs.mhaibaraai.cn/'
  },
  defaults: {
    a11y: true,
    mermaid: false
  },
  moduleDependencies(nuxt): ModuleDependencies {
    const userOptions = nuxt.options.movkNuxtDocs || {}

    return {
      ...userOptions.a11y !== false && {
        '@nuxt/a11y': {
          version: '^1.0.0-alpha.1',
          defaults: {
            logIssues: false
          }
        }
      }
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#ai-chat'] = resolve('./ai-chat/runtime')

    if (options.mermaid) {
      let mermaidAvailable = true
      try {
        import.meta.resolve('mermaid')
      } catch {
        log.warn('mermaid package not found. install it with: pnpm add mermaid dompurify')
        mermaidAvailable = false
      }

      if (mermaidAvailable) {
        addComponentsDir({
          path: resolve('./components/prose'),
          pathPrefix: false,
          prefix: 'Prose',
          global: true
        })

        const contentOptions = nuxt.options.content as Record<string, any> | false
        if (contentOptions) {
          const build = contentOptions.build ??= {}
          const markdown = build.markdown ??= {}
          const highlight = markdown.highlight ??= {}
          const langs = highlight.langs ??= [] as string[]
          if (!langs.includes('mermaid')) {
            langs.push('mermaid')
          }
        }

        nuxt.hooks.hook('vite:extendConfig', (config) => {
          const cfg = config as { optimizeDeps?: { include?: string[] } }
          cfg.optimizeDeps ??= {}
          cfg.optimizeDeps.include ??= []
          cfg.optimizeDeps.include.push(
            '@movk/nuxt-docs > mermaid',
            '@movk/nuxt-docs > mermaid > dayjs',
            '@movk/nuxt-docs > mermaid > @braintree/sanitize-url',
            '@movk/nuxt-docs > mermaid > d3',
            '@movk/nuxt-docs > mermaid > dompurify'
          )
        })

        const appConfig = nuxt.options.appConfig as Record<string, any>
        appConfig.ui ??= {}
        appConfig.ui.prose ??= {}
        appConfig.ui.prose.codeIcon ??= {}
        appConfig.ui.prose.codeIcon.mmd ??= 'i-vscode-icons-file-type-mermaid'

        log.info('mermaid diagram support enabled')
      }
    }

    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()

    const site = defu(nuxt.options.site, {
      url,
      name: kebabCase(meta.name || gitInfo?.name || ''),
      debug: false
    })

    updateSiteConfig(site as SiteConfigInput)

    const siteName = (typeof nuxt.options.site === 'object' && nuxt.options.site?.name) || meta.name || gitInfo?.name || ''

    nuxt.options.llms = defu(nuxt.options.llms, {
      domain: url || 'https://example.com',
      title: siteName,
      description: meta.description || '',
      full: {
        title: siteName,
        description: meta.description || ''
      }
    })

    nuxt.options.appConfig.header = defu(nuxt.options.appConfig.header as Record<string, any>, {
      title: startCase(siteName)
    })

    nuxt.options.appConfig.seo = defu(nuxt.options.appConfig.seo as Record<string, any>, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || ''
    })

    nuxt.options.appConfig.github = defu(nuxt.options.appConfig.github as Record<string, any>, {
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
  }
})

export default movkNuxtDocsModule
