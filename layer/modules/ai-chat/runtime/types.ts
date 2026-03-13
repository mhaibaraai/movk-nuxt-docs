import type { DynamicToolUIPart, ToolUIPart } from 'ai'

export interface FaqCategory {
  category: string
  items: string[]
}

export type FaqQuestions = string[] | FaqCategory[]

export type ToolPart = ToolUIPart | DynamicToolUIPart
export type ToolState = ToolPart['state']
