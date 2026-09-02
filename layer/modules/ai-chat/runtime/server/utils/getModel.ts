import { createGateway } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { modelProviderRegistry } from './modelProviders'
import { AI_API_KEY_ENV, AI_BASE_URL_ENV } from '../../../keys'

/**
 * 获取 AI 模型实例
 * 优先级:用户注册的提供商 > AI_BASE_URL OpenAI 兼容直连 > AI Gateway 兜底
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

  const apiKey = process.env[AI_API_KEY_ENV] || undefined
  const baseURL = process.env[AI_BASE_URL_ENV]

  // 配了 baseURL 即视为 OpenAI 兼容直连:第三方端点只支持 chat completions，
  // 且 provider 前缀仅用于前端图标，发请求时要剥掉只留裸模型 id
  if (baseURL) {
    return createOpenAI({ apiKey, baseURL }).chat(parsed?.modelId ?? modelId)
  }

  // 兜底走 AI Gateway，modelId 保持 provider/model 形式
  return createGateway({ apiKey })(modelId)
}
