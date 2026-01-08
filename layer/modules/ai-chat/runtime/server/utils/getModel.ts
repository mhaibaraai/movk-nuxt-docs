import { createGateway } from '@ai-sdk/gateway'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

/**
 * 获取 AI 模型实例
 * @param modelId - 模型标识符,格式为 "provider/model" 或 "model"
 * @returns AI SDK 模型实例
 */
export function getModel(modelId: string) {
  const config = useRuntimeConfig()

  // OpenRouter 模型:以 "openrouter/" 开头
  if (modelId.startsWith('openrouter/')) {
    const openRouter = createOpenRouter({
      apiKey: config.openRouterApiKey as string | undefined
    })
    return openRouter.chat(modelId.replace('openrouter/', ''))
  }

  // AI Gateway 模型(默认)
  const gateway = createGateway({
    apiKey: config.aiGatewayApiKey as string | undefined
  })
  return gateway(modelId)
}
