import { describe, expect, it } from 'vitest'
import { modelProviderRegistry } from '../../layer/modules/ai-chat/runtime/server/utils/modelProviders'

describe('modelProviderRegistry', () => {
  it('按首个斜杠拆分 provider 前缀', () => {
    expect(modelProviderRegistry.parseModelId('openrouter/anthropic/claude')).toEqual({ prefix: 'openrouter', modelId: 'anthropic/claude' })
    expect(modelProviderRegistry.parseModelId('gpt-5')).toBeNull()
  })

  it('注册与读取提供商', () => {
    const factory = () => ({}) as never
    modelProviderRegistry.register('test-provider', factory)
    expect(modelProviderRegistry.get('test-provider')).toBe(factory)
    expect(modelProviderRegistry.get('missing')).toBeUndefined()
  })
})
