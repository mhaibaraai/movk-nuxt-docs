import type { LanguageModel } from 'ai'
import { createGateway } from '@ai-sdk/gateway'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createAlibaba } from '@ai-sdk/alibaba'
import { createZhipu } from 'zhipu-ai-provider'
import { modelProviderRegistry } from './modelProviders'
import { AI_BUILTIN_PROVIDERS } from '../../../keys'

// 前缀 → 各 SDK 的 create 函数（env 名称由 keys.ts 的 AI_BUILTIN_PROVIDERS 单一维护）
const builtinFactories = {
  openai: createOpenAI,
  anthropic: createAnthropic,
  deepseek: createDeepSeek,
  alibaba: createAlibaba,
  zai: createZhipu
} as const

type BuiltinPrefix = keyof typeof builtinFactories

function resolveBuiltin(prefix: string, modelId: string): LanguageModel | undefined {
  const meta = AI_BUILTIN_PROVIDERS.find(p => p.prefix === prefix)
  const create = builtinFactories[prefix as BuiltinPrefix]
  const apiKey = meta && process.env[meta.env]
  if (!create || !apiKey) return undefined

  // 约定 *_API_KEY → *_BASE_URL，缺省时各 SDK 用默认端点（如阿里云国际站）
  const baseURL = process.env[meta.env.replace(/_API_KEY$/, '_BASE_URL')]
  return create({ apiKey, baseURL })(modelId)
}

/**
 * 获取 AI 模型实例
 * 优先级:用户注册的提供商 > 内置直连提供商 > AI Gateway 兜底
 */
export function getModel(modelId: string) {
  const config = useRuntimeConfig()
  const parsed = modelProviderRegistry.parseModelId(modelId)

  if (parsed) {
    const factory = modelProviderRegistry.get(parsed.prefix)
    if (factory) {
      return factory({ config, modelId: parsed.modelId })
    }

    const model = resolveBuiltin(parsed.prefix, parsed.modelId)
    if (model) return model
  }

  const gateway = createGateway({
    apiKey: process.env.AI_GATEWAY_API_KEY || undefined
  })
  return gateway(modelId)
}
