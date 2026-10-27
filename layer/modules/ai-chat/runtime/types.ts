import type { DynamicToolUIPart, ToolUIPart } from 'ai'

export type { FaqCategory, FaqQuestions, LocalizedFaqQuestions } from '../../../shared/faq'

export type ToolPart = ToolUIPart | DynamicToolUIPart
export type ToolState = ToolPart['state']
