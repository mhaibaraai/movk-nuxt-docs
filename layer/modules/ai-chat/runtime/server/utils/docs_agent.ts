import { tool, stepCountIs, generateText } from 'ai'
import { z } from 'zod/v4'

function getSubAgentSystemPrompt(siteName: string) {
  return `You are a documentation search agent for ${siteName}. Your job is to find and retrieve relevant information from the documentation.

**Your task:**
- Use the available tools to search and read documentation pages
- Start with list-pages to discover what documentation exists
- Then use get-page to read the relevant page(s)
- If a specific path is mentioned, you can call get-page directly

**Guidelines:**
- Be thorough - read all relevant pages before answering
- Return the raw information you find, let the main agent format the response
- If you can't find information, say so clearly

**Output:**
Return the relevant documentation content you found, including code examples if present.`
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
        stopWhen: stepCountIs(5),
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
