// 内置 provider 前缀与其官方环境变量的映射（智谱用 zai 前缀 + ZHIPU_API_KEY）
export const AI_BUILTIN_PROVIDERS = [
  { prefix: 'openai', env: 'OPENAI_API_KEY' },
  { prefix: 'anthropic', env: 'ANTHROPIC_API_KEY' },
  { prefix: 'deepseek', env: 'DEEPSEEK_API_KEY' },
  { prefix: 'alibaba', env: 'ALIBABA_API_KEY' },
  { prefix: 'zai', env: 'ZHIPU_API_KEY' }
] as const

export const AI_PROVIDER_ENV_KEYS = [
  'AI_GATEWAY_API_KEY',
  ...AI_BUILTIN_PROVIDERS.map(p => p.env)
]

// AI Gateway key 或任一内置 provider key 存在即视为启用
export function hasAnyAiKey(): boolean {
  return AI_PROVIDER_ENV_KEYS.some(key => !!process.env[key])
}
