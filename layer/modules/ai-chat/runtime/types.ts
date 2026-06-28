import type { DynamicToolUIPart, ToolUIPart } from 'ai'

export interface FaqCategory {
  category: string
  items: string[]
}

export type FaqQuestions = string[] | FaqCategory[]

/**
 * 按 locale 分组的 FAQ 配置，键为语言代码（如 'zh-CN'、'en'）
 */
export type LocalizedFaqQuestions = Record<string, FaqQuestions>

export type ToolPart = ToolUIPart | DynamicToolUIPart
export type ToolState = ToolPart['state']
