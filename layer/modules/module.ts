import { addComponentsDir, addImports, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import type { ModuleDependencies, NuxtModule } from 'nuxt/schema'
import { defu } from 'defu'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'
import { getPackageJsonMetadata, inferSiteURL } from '../utils/meta'
import { getFeatures, type FeatureOptions } from '../utils/features'
import { assertFeatureDependencies } from '../utils/feature-dependencies'
import { excludeFeatureTypes } from '../utils/feature-types'
import { syncCodeGroups, type MinimarkNode } from '../utils/code-groups'
import { startCase, kebabCase } from '@movk/core'
import { updateSiteConfig } from 'nuxt-site-config/kit'
import type { SiteConfigInput } from 'nuxt-site-config/kit'

export type ModuleOptions = FeatureOptions

const log = logger.withTag('@movk/nuxt-docs')

const movkNuxtDocsModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'movk-nuxt-docs',
    configKey: 'movkNuxtDocs',
    docs: 'https://docs.mhaibaraai.cn/'
  },
  // 默认值见 utils/features.ts，模块与 nuxt.config 中的内联模块共用同一份解析逻辑
  moduleDependencies(nuxt): ModuleDependencies {
    assertFeatureDependencies(nuxt)
    const features = getFeatures(nuxt)

    return {
      ...features.mcp && { '@nuxtjs/mcp-toolkit': {} },
      ...features.ogImage && { 'nuxt-og-image': {} },
      ...features.a11y && {
        '@nuxt/a11y': {
          defaults: {
            logIssues: false
          }
        }
      }
    }
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const features = getFeatures(nuxt)

    nuxt.options.alias['#ai-chat'] = resolve('./ai-chat/runtime')

    nuxt.options.runtimeConfig.public.movkDocs = {
      ...nuxt.options.runtimeConfig.public.movkDocs,
      features: {
        mcp: features.mcp,
        aiChat: features.aiChat,
        componentDocs: features.componentDocs,
        ogImage: features.ogImage
      }
    }

    excludeFeatureTypes(nuxt, [
      ...features.aiChat ? [] : [resolve('./ai-chat/runtime')],
      ...features.componentDocs ? [] : [resolve('./component-docs/runtime')]
    ])

    // 关闭 OG 图片时保留 defineOgImage 调用点，替换为空实现
    if (!features.ogImage) {
      addImports({ name: 'defineOgImage', from: resolve('./runtime/og-image-stub') })
    }

    nuxt.hook('content:file:afterParse', ({ content }) => {
      const body = content.body as { type?: string, value?: unknown[] } | undefined
      if (body?.type === 'minimark' && Array.isArray(body.value)) {
        content.body = { ...body, value: syncCodeGroups(body.value as MinimarkNode[]) }
      }
    })

    if (features.a11y) {
      const a11yOptions = (nuxt.options as Record<string, any>).a11y ??= {}
      a11yOptions.axe = defu(a11yOptions.axe, {
        runOptions: { preload: false }
      })
    }

    if (features.mermaid) {
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

    // 仅补充从 git 推断的仓库信息，其余默认值以 nuxt.schema.ts 为准
    // github: false 表示关闭集成，不能交给 defu（会被默认值整体替换）
    if ((nuxt.options.appConfig.github as unknown) !== false) {
      nuxt.options.appConfig.github = defu(nuxt.options.appConfig.github as Record<string, any>, {
        owner: gitInfo?.owner,
        name: gitInfo?.name,
        url: gitInfo?.url,
        branch: getGitBranch()
      })
    }
  }
})

export default movkNuxtDocsModule
