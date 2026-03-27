import { addComponentsDir, createResolver, defineNuxtModule, logger } from '@nuxt/kit'
import type { ModuleDependencies } from 'nuxt/schema'

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

const log = logger.withTag('movk-nuxt-docs')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'movk-nuxt-docs',
    configKey: 'movkNuxtDocs'
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
          version: '^1.0.0-alpha.1'
        }
      }
    }
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

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
          path: resolve('./runtime/components/prose'),
          pathPrefix: false,
          prefix: 'Prose',
          global: true
        })

        // 添加 mermaid 语言高亮
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

        // 为 mermaid ESM 兼容性配置 optimizeDeps
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

        // 注入 mermaid 代码图标配置到 appConfig
        const appConfig = nuxt.options.appConfig as Record<string, any>
        appConfig.ui ??= {}
        appConfig.ui.prose ??= {}
        appConfig.ui.prose.codeIcon ??= {}
        appConfig.ui.prose.codeIcon.mmd ??= 'i-vscode-icons-file-type-mermaid'

        log.info('mermaid diagram support enabled')
      }
    }
  }
})

declare module 'nuxt/schema' {
  interface NuxtConfig {
    movkNuxtDocs?: ModuleOptions
  }
}
