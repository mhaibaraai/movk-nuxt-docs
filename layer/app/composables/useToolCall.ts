import type { ToolState } from '#ai-chat/types'

export function useToolCall(_state: ToolState, _toolName: string, _input: Record<string, string | undefined>) {
  return {
    toolMessage: {} as Record<string, string>,
    toolIcon: {} as Record<string, string>
  }
}
