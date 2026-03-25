import { addComponent, createResolver, defineNuxtModule, hasNuxtModule, logger } from '@nuxt/kit'
import type { ModuleDependencies } from 'nuxt/schema'
import { writeFileSync } from 'node:fs'

export interface ModuleOptions {
  /**
   * 是否启用 Mermaid 图表支持
   *
   * 启用前需安装依赖: `pnpm add mermaid dompurify`
   * @defaultValue false
   */
  mermaid?: boolean
  /**
   * 是否启用 twoslash 支持
   * @defaultValue false
   * @see https://github.com/antfu/nuxt-content-twoslash
   */
  twoslash?: boolean
}

const log = logger.withTag('movk-nuxt-docs')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'movk-nuxt-docs',
    configKey: 'movkNuxtDocs'
  },
  defaults: {
    mermaid: false,
    twoslash: false
  },
  moduleDependencies(nuxt): ModuleDependencies {
    const userOptions = nuxt.options.movkNuxtDocs || {}
    return {
      ...userOptions.twoslash !== false && {
        'nuxt-content-twoslash': {
          version: '>=0.4.0',
          defaults: {
            // 在开发中跳过 Twoslash 以提高性能。当您想在 dev 中显式测试双斜杠时，请打开此选项。
            enableInDev: false,
            // 当双斜杠失败时不要抛出，类型检查应该在 CI 中关闭。
            throws: false,
            includeNuxtTypes: false
          }
        }
      }
    }
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (options.twoslash || hasNuxtModule('nuxt-content-twoslash')) {
      nuxt.hook('app:templatesGenerated', async (_app, templates) => {
        const tmpl = (templates as any[]).find(t => t.filename === 'twoslash-meta.mjs')
        if (!tmpl?.getContents) return

        writeFileSync(tmpl.dst, tmpl.getContents())
      })
    }

    if (options.mermaid) {
      // 验证 mermaid 依赖是否已安装
      try {
        import.meta.resolve('mermaid')
      } catch {
        log.warn('mermaid package not found. install it with: pnpm add mermaid dompurify')
        return
      }

      // 添加 mermaid 组件
      addComponent({
        name: 'Mermaid',
        filePath: resolve('./runtime/components/Mermaid.vue'),
        mode: 'client'
      })

      addComponent({
        name: 'ProseMermaid',
        filePath: resolve('./runtime/components/prose/Mermaid.vue'),
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
})

declare module 'nuxt/schema' {
  interface NuxtConfig {
    movkNuxtDocs?: ModuleOptions
  }
}
