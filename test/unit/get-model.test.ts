import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createGateway, createOpenAI } = vi.hoisted(() => {
  const chat = vi.fn((id: string) => ({ via: 'openai', id }))
  return {
    createGateway: vi.fn(() => (id: string) => ({ via: 'gateway', id })),
    createOpenAI: vi.fn(() => ({ chat }))
  }
})

vi.mock('ai', () => ({ createGateway }))
vi.mock('@ai-sdk/openai', () => ({ createOpenAI }))

const { getModel } = await import('../../layer/modules/ai-chat/runtime/server/utils/getModel')
const { modelProviderRegistry } = await import('../../layer/modules/ai-chat/runtime/server/utils/modelProviders')

describe('getModel 优先级', () => {
  beforeEach(() => {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }))
    vi.stubEnv('AI_API_KEY', 'key')
    vi.stubEnv('AI_BASE_URL', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('默认走 AI Gateway，保留 provider/model 形式', () => {
    expect(getModel('anthropic/claude-sonnet')).toEqual({ via: 'gateway', id: 'anthropic/claude-sonnet' })
    expect(createGateway).toHaveBeenCalledWith({ apiKey: 'key' })
  })

  it('配置 AI_BASE_URL 时走 OpenAI 兼容直连并剥离前缀', () => {
    vi.stubEnv('AI_BASE_URL', 'https://api.example.com/v1')
    expect(getModel('deepseek/deepseek-chat')).toEqual({ via: 'openai', id: 'deepseek-chat' })
    expect(createOpenAI).toHaveBeenCalledWith({ apiKey: 'key', baseURL: 'https://api.example.com/v1' })
    expect(getModel('gpt-5')).toEqual({ via: 'openai', id: 'gpt-5' })
  })

  it('已注册的提供商优先', () => {
    vi.stubEnv('AI_BASE_URL', 'https://api.example.com/v1')
    modelProviderRegistry.register('custom', ({ modelId }) => ({ via: 'custom', id: modelId }) as never)
    expect(getModel('custom/my-model')).toEqual({ via: 'custom', id: 'my-model' })
    expect(createOpenAI).not.toHaveBeenCalled()
  })
})
