import { createResolver, defineNuxtModule, logger } from '@nuxt/kit'

export interface MermaidModuleOptions {
  /**
   * 是否启用 Mermaid 图表支持
   *
   * 启用前需安装依赖: `pnpm add mermaid dompurify`
   * @default false
   */
  enabled?: boolean
}

const log = logger.withTag('movk-nuxt-docs')

export default defineNuxtModule<MermaidModuleOptions>({
  meta: {
    name: 'mermaid',
    configKey: 'mermaid'
  },
  defaults: {
    enabled: false
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const mermaidFilePath = resolve('../app/components/content/Mermaid.vue')

    // Layer 自动扫描会注册 Mermaid.vue，通过 components:extend 统一管理：
    // - 禁用时：从列表移除，resolveComponent('Mermaid') 返回字符串，ProsePre fallback 到普通代码块
    // - 启用时：将 mode 改为 'client'，避免 SSR 阶段执行
    nuxt.hooks.hook('components:extend', (components) => {
      const idx = components.findIndex(c => c.filePath === mermaidFilePath)
      if (idx === -1) return

      if (!options.enabled) {
        components.splice(idx, 1)
        return
      }

      components[idx]!.mode = 'client'
    })

    if (!options.enabled) return

    // 验证 mermaid 依赖是否已安装
    try {
      import.meta.resolve('mermaid')
    } catch {
      log.warn('[mermaid] `mermaid` package not found. Install it with: pnpm add mermaid dompurify')
      return
    }

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

    log.info('[mermaid] Mermaid diagram support enabled')
  }
})

declare module 'nuxt/schema' {
  interface NuxtConfig {
    mermaid?: MermaidModuleOptions
  }
}
