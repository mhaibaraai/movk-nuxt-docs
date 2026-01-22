import { createGateway } from '@ai-sdk/gateway'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { modelProviderRegistry } from './modelProviders'

modelProviderRegistry.register('openrouter', ({ config, modelId }) => {
  const openRouter = createOpenRouter({
    apiKey: config.openRouterApiKey as string | undefined
  })
  return openRouter.chat(modelId)
})

/**
 * 获取 AI 模型实例
 * 优先使用注册的提供商，否则回退到 AI Gateway
 */
export function getModel(modelId: string) {
  const config = useRuntimeConfig()
  const parsed = modelProviderRegistry.parseModelId(modelId)

  if (parsed) {
    const factory = modelProviderRegistry.get(parsed.prefix)
    if (factory) {
      return factory({ config, modelId: parsed.modelId })
    }
  }

  const gateway = createGateway({
    apiKey: config.aiGatewayApiKey as string | undefined
  })
  return gateway(modelId)
}
