import { tool, stepCountIs, generateText } from 'ai'
import { z } from 'zod/v4'

function getSubAgentSystemPrompt(siteName: string) {
  return `您是 ${siteName} 的文档搜索代理。您的工作是从文档中查找并检索相关信息。

**您的任务：**
- 使用可用的工具搜索和阅读文档页面

**指南：**
- 在回答之前阅读所有相关页面
- 返回你找到的原始信息，让主代理格式化响应
- 如果找不到信息，请明确说明

**输出：**
返回您找到的相关文档内容，包括代码示例（如果存在）。`
}

export function createDocumentationAgentTool(mcpTools: Record<string, any>, model: any, siteName: string) {
  return tool({
    description: '从文档中搜索并检索信息。使用此工具回答有关文档的任何问题。将用户的问题作为查询参数传递。',
    inputSchema: z.object({
      query: z.string().describe('要在文档中搜索的问题')
    }),
    execute: async ({ query }, executionOptions) => {
      const writer = (executionOptions as any)?.experimental_context?.writer

      const result = await generateText({
        model,
        tools: mcpTools,
        system: getSubAgentSystemPrompt(siteName),
        stopWhen: stepCountIs(6),
        onStepFinish: ({ toolCalls }) => {
          if (toolCalls.length === 0) return

          writer?.write({
            id: toolCalls[0]?.toolCallId,
            type: 'data-tool-calls',
            data: {
              tools: toolCalls.map((toolCall: any) => ({
                toolName: toolCall.toolName,
                toolCallId: toolCall.toolCallId,
                args: toolCall.args || toolCall.input || {}
              }))
            }
          })
        },
        prompt: query
      })

      return result.text
    }
  })
}
