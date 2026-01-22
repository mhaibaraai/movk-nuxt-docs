import type { LanguageModel } from 'ai'

export interface ModelProviderContext {
  config: ReturnType<typeof useRuntimeConfig>
  modelId: string
}

export type ModelProviderFactory = (context: ModelProviderContext) => LanguageModel

/**
 * 模型提供商注册表
 */
class ModelProviderRegistry {
  private providers = new Map<string, ModelProviderFactory>()

  register(prefix: string, factory: ModelProviderFactory): void {
    this.providers.set(prefix, factory)
  }

  get(prefix: string): ModelProviderFactory | undefined {
    return this.providers.get(prefix)
  }

  parseModelId(modelId: string): { prefix: string, modelId: string } | null {
    const separatorIndex = modelId.indexOf('/')
    if (separatorIndex === -1) return null
    return {
      prefix: modelId.slice(0, separatorIndex),
      modelId: modelId.slice(separatorIndex + 1)
    }
  }
}

export const modelProviderRegistry = new ModelProviderRegistry()
