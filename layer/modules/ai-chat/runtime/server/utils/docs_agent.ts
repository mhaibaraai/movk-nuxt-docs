import { tool, stepCountIs, generateText } from 'ai'
import { z } from 'zod/v4'

const SUB_AGENT_SYSTEM_PROMPT = `你是文档搜索代理。你的工作是从文档中查找并检索相关信息。

**你的任务：**
- 使用可用工具搜索和阅读文档页面
- 首先使用 list-pages 发现可用的文档
- 然后使用 get-page 阅读相关页面
- 如果提到了特定路径，可以直接调用 get-page

**指导原则：**
- 要彻底，在回答前阅读所有相关页面
- 返回你找到的原始信息，让主代理格式化响应
- 如果找不到信息，请明确说明

**输出：**
返回你找到的相关文档内容，如果有代码示例也一并包含。`

export function createDocumentationAgentTool(mcpTools: Record<string, any>, model: any) {
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
        system: SUB_AGENT_SYSTEM_PROMPT,
        stopWhen: stepCountIs(5),
        onStepFinish: ({ toolCalls }) => {
          writer?.write({
            id: toolCalls[0]?.toolCallId,
            type: 'data-tool-calls',
            data: {
              tools: toolCalls.map(toolCall => ({ toolName: toolCall.toolName, toolCallId: toolCall.toolCallId, input: toolCall.input }))
            }
          })
        },
        prompt: query
      })

      return result.text
    }
  })
}
