import { afterEach, expect, it, vi } from 'vitest'
import { useModels } from '../../layer/modules/ai-chat/runtime/composables/useModels'

afterEach(() => vi.unstubAllGlobals())

it('使用模型 ID 的最后一段显示模型名称', () => {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { aiChat: { model: '', models: [] } } }))
  vi.stubGlobal('useAppConfig', () => ({ aiChat: {} }))
  vi.stubGlobal('useCookie', () => ({ value: '' }))
  vi.stubGlobal('computed', vi.fn())

  const { formatModelName } = useModels()
  expect(formatModelName('cloudflare/@cf/qwen/qwen3.8-27b')).toBe('Qwen3.8 27b')
  expect(formatModelName('openai/gpt-5')).toBe('GPT 5')
  expect(formatModelName('gpt-5')).toBe('GPT 5')
})
