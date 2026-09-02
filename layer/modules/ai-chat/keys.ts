export const AI_API_KEY_ENV = 'AI_API_KEY'
export const AI_BASE_URL_ENV = 'AI_BASE_URL'

// AI_API_KEY 存在即视为启用；端点由可选的 AI_BASE_URL 决定，缺省走 AI Gateway
export function hasAnyAiKey(): boolean {
  return !!process.env[AI_API_KEY_ENV]
}
