import { existsSync } from 'node:fs'
import { join } from 'pathe'
import {
  addImports,
  addServerHandler,
  addComponent,
  createResolver,
  defineNuxtModule,
  logger
} from '@nuxt/kit'
import { getFeatures } from '../../utils/features'
import { hasAnyAiKey } from './keys'

export interface AiChatModuleOptions {
  /**
   * 是否启用 AI Chat；未设置时以构建期是否存在 AI_API_KEY 决定。启用时需要 movkNuxtDocs.mcp 同时开启
   */
  enabled?: boolean
  /**
   * 聊天 API 端点路径
   * @default '/api/ai-chat'
   */
  apiPath?: string
  /**
   * MCP 服务器连接路径
   * @default '/mcp'
   */
  mcpPath?: string
  /**
   * 使用的 AI 模型
   */
  model?: string
  /**
   * 可用模型列表
   * - 格式为 "provider/model" 或 "model"
   */
  models?: string[]
}

const log = logger.withTag('@movk/nuxt-docs')

export default defineNuxtModule<AiChatModuleOptions>({
  meta: {
    name: 'ai-chat',
    configKey: 'aiChat'
  },
  defaults: {
    apiPath: '/api/ai-chat',
    mcpPath: '/mcp',
    model: '',
    models: []
  },
  setup(options, nuxt) {
    const hasApiKey = getFeatures(nuxt).aiChat

    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.aiChat = {
      enabled: hasApiKey,
      apiPath: options.apiPath!,
      model: options.model!,
      models: options.models!
    }

    addImports([
      {
        name: 'useAIChat',
        from: resolve('./runtime/composables/useAIChat')
      }
    ])

    const components = [
      'AiChat',
      'AiChatFloatingInput',
      'AiChatModelSelect',
      'AiChatPanel'
    ]

    components.forEach(name =>
      addComponent({
        name,
        filePath: hasApiKey
          ? resolve(`./runtime/components/${name}.vue`)
          : resolve('./runtime/components/AiChatDisabled.vue')
      })
    )

    if (hasApiKey) {
      addComponent({
        name: 'AiMarkdown',
        filePath: resolve('./runtime/components/AiMarkdown.client.ts')
      })
    }

    if (!hasApiKey) {
      return
    }

    if (!hasAnyAiKey()) {
      log.warn('AI Chat 已启用，但构建期未检测到 AI_API_KEY，请确认运行环境已配置该变量')
    }

    nuxt.hook('vite:extendConfig', (config) => {
      const cfg = config as { optimizeDeps?: { include?: string[], exclude?: string[] } }
      cfg.optimizeDeps ??= {}
      cfg.optimizeDeps.include ??= []
      cfg.optimizeDeps.exclude ??= []
      // @shikijs/langs/* 与 @shikijs/themes/* 在 useHighlighter 中动态导入，不预构建
      cfg.optimizeDeps.include.push(
        '@movk/nuxt-docs > @ai-sdk/vue',
        '@movk/nuxt-docs > ai',
        '@movk/nuxt-docs > @shikijs/core',
        '@movk/nuxt-docs > @shikijs/engine-javascript'
      )
      // @comark/vue 由 AiMarkdown.client.ts 引入，裸模块名经虚拟模块发现后无法从消费方根目录解析
      cfg.optimizeDeps.exclude.push('@comark/vue', '@comark/vue/plugins/highlight')
    })

    nuxt.options.runtimeConfig.aiChat = {
      mcpPath: options.mcpPath!
    }

    /**
     * 检查用户项目中是否存在自定义 handler
     * '/api/ai-chat' -> 'api/ai-chat'，'/custom' -> 'custom'
     */
    const routePath = options.apiPath!.replace(/^\//, '')
    const extensions = ['ts', 'js', 'mjs']

    const possibleHandlerPaths = extensions.flatMap(ext => [
      join(nuxt.options.serverDir, `${routePath}.${ext}`),
      join(nuxt.options.serverDir, routePath, `index.${ext}`)
    ])

    const hasCustomHandler = possibleHandlerPaths.some(path => existsSync(path))

    if (!hasCustomHandler) {
      addServerHandler({
        route: options.apiPath!,
        handler: resolve('./runtime/server/api/ai-chat')
      })
    } else {
      log.info(`[movk-nuxt-docs] Using custom handler, skipping default handler registration`)
    }
  }
})

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    aiChat: {
      enabled: boolean
      apiPath: string
      model: string
      models: string[]
    }
  }
  interface RuntimeConfig {
    aiChat: {
      mcpPath: string
    }
  }
}
