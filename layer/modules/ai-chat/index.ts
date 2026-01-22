import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  addComponent,
  addComponentsDir,
  addImports,
  addServerHandler,
  createResolver,
  defineNuxtModule,
  logger
} from '@nuxt/kit'

export interface AiChatModuleOptions {
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

const log = logger.withTag('movk-nuxt-docs:ai-assistant')

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
    const hasApiKey = !!(process.env.AI_GATEWAY_API_KEY || process.env.OPENROUTER_API_KEY || process.env.ZHIPU_API_KEY)

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

    if (hasApiKey) {
      addComponentsDir({
        path: resolve('./runtime/components'),
        ignore: ['AiChatDisabled']
      })
    } else {
      addComponent({
        name: 'AiChatDisabled',
        filePath: resolve('./runtime/components/AiChatDisabled.vue')
      })
    }

    if (!hasApiKey) {
      log.warn('[ai-chat] Module disabled: no API key found in environment variables.')
      return
    }

    nuxt.options.runtimeConfig.aiChat = {
      mcpPath: options.mcpPath!
    }

    addImports([
      {
        name: 'useHighlighter',
        from: resolve('./runtime/composables/useHighlighter')
      }
    ])

    addImports([
      {
        name: 'useModels',
        from: resolve('./runtime/composables/useModels')
      }
    ])

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
      log.info(`[ai-chat] Using custom handler, skipping default handler registration`)
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
