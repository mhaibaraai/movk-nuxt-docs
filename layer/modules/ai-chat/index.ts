import { addComponentsDir, addImportsDir, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

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
   * 通过 AI SDK Gateway 、OpenRouter 使用的 AI 模型
   */
  model?: string
  /**
   * 可用模型列表
   * - 格式为 "provider/model" 或 "model"
   */
  models?: string[]
}

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
    const hasApiKey = !!(
      process.env.AI_GATEWAY_API_KEY
      || process.env.OPENROUTER_API_KEY
    )

    if (!hasApiKey) {
      console.info('[ai-chat] Module disabled: no AI_GATEWAY_API_KEY or OPENROUTER_API_KEY found')
      return
    }

    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.aiChat = {
      apiPath: options.apiPath!,
      model: options.model!,
      models: options.models!
    }
    nuxt.options.runtimeConfig.aiChat = {
      mcpPath: options.mcpPath!
    }

    addComponentsDir({
      path: resolve('runtime/components')
    })

    addImportsDir(resolve('runtime/composables'))

    const routePath = options.apiPath!.replace(/^\//, '')
    addServerHandler({
      route: `/${routePath}`,
      handler: resolve('./runtime/server/api/search')
    })
  }
})

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    aiChat: {
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
