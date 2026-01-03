import { addComponent, addImports, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

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
   * 通过 AI SDK Gateway 使用的 AI 模型
   * @default 'moonshotai/kimi-k2-turbo'
   */
  model?: string
}

export default defineNuxtModule<AiChatModuleOptions>({
  meta: {
    name: 'ai-chat',
    configKey: 'aiChat'
  },
  defaults: {
    apiPath: '/api/ai-chat',
    mcpPath: '/mcp',
    model: 'moonshotai/kimi-k2-turbo'
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.aiChat = {
      apiPath: options.apiPath!
    }
    nuxt.options.runtimeConfig.aiChat = {
      mcpPath: options.mcpPath!,
      model: options.model!
    }

    addComponent({
      name: 'AiChat',
      filePath: resolve('./runtime/components/AiChat.vue')
    })
    addComponent({
      name: 'AiChatSlideover',
      filePath: resolve('./runtime/components/AiChatSlideover.vue')
    })
    addComponent({
      name: 'AiChatToolCall',
      filePath: resolve('./runtime/components/AiChatToolCall.vue')
    })
    addComponent({
      name: 'AiChatFloatingInput',
      filePath: resolve('./runtime/components/AiChatFloatingInput.vue')
    })

    addImports([
      {
        name: 'useAIChat',
        from: resolve('./runtime/composables/useAIChat')
      },
      {
        name: 'useHighlighter',
        from: resolve('./runtime/composables/useHighlighter')
      }
    ])

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
    }
  }
  interface RuntimeConfig {
    aiChat: {
      mcpPath: string
      model: string
    }
  }
}
