import { addComponentsDir, addImportsDir, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface AiChatModuleOptions {
  /**
   * 是否启用 AI 聊天功能
   * @default import.meta.env.AI_GATEWAY_API_KEY || import.meta.env.OPENROUTER_API_KEY
   */
  enable?: boolean
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
    enable: !!(
      import.meta.env.AI_GATEWAY_API_KEY
        || import.meta.env.OPENROUTER_API_KEY
    ),
    apiPath: '/api/ai-chat',
    mcpPath: '/mcp',
    model: '',
    models: []
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.aiChat = {
      enable: options.enable!,
      apiPath: options.apiPath!,
      model: options.model!,
      models: options.models!
    }
    nuxt.options.runtimeConfig.aiChat = {
      mcpPath: options.mcpPath!
    }

    if (!options.enable) {
      console.info('[ai-chat] Module disabled: no AI_GATEWAY_API_KEY or OPENROUTER_API_KEY found')
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
      enable: boolean
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
