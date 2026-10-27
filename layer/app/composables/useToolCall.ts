/**
 * AI Chat 工具调用的展示文案与图标，供使用方在 app/composables 中同名覆盖。
 * state 为 AI SDK 的工具调用状态，这里放宽为 string 以免核心代码依赖可选的 ai 包
 */
export function useToolCall(_state: string, _toolName: string, _input: Record<string, string | undefined>) {
  return {
    toolMessage: {} as Record<string, string>,
    toolIcon: {} as Record<string, string>
  }
}
