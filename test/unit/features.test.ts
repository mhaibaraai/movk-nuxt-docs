import { describe, expect, it } from 'vitest'
import { resolveFeatures } from '../../layer/utils/features'

describe('resolveFeatures', () => {
  it('默认值', () => {
    expect(resolveFeatures({}, {})).toEqual({
      componentDocs: false,
      mcp: true,
      ogImage: true,
      mermaid: false,
      a11y: false,
      aiChat: false
    })
  })

  it('aiChat 未显式设置时沿用 AI_API_KEY 判断', () => {
    expect(resolveFeatures({}, {}, { hasAiKey: true }).aiChat).toBe(true)
    expect(resolveFeatures({}, { enabled: false }, { hasAiKey: true }).aiChat).toBe(false)
    expect(resolveFeatures({}, { enabled: true }, { hasAiKey: false }).aiChat).toBe(true)
  })

  it('显式开关覆盖默认值', () => {
    expect(resolveFeatures({ componentDocs: true, mcp: false, ogImage: false, a11y: true }, {})).toMatchObject({
      componentDocs: true,
      mcp: false,
      ogImage: false,
      a11y: true
    })
  })

  it('AI Chat 依赖 MCP，冲突时报错', () => {
    expect(() => resolveFeatures({ mcp: false }, { enabled: true })).toThrow(/aiChat.*mcp/i)
  })
})
