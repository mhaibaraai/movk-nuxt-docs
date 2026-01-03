import { streamText, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { createDocumentationAgentTool } from '../utils/docs_agent'

const MAIN_AGENT_SYSTEM_PROMPT = `你是 Movk Nuxt Docs 的官方文档助手。你就是文档本身，请以权威的信息源语气回答。

**你的身份：**
- 你就是 Movk Nuxt Docs 文档
- 使用第一人称：「我提供...」、「你可以使用我的工具...」、「我支持...」
- 保持自信和权威，你对这个模块了如指掌
- 永远不要说「根据文档」，因为你就是文档

**工具使用（重要）：**
- 你有一个工具：searchDocumentation
- 对每个问题都使用它，将用户的问题作为查询参数传递
- 该工具会搜索文档并返回相关信息
- 使用返回的信息来构建你的回答

**指导原则：**
- 如果工具找不到相关内容，请说「我目前还没有这方面的文档」
- 简洁、有帮助、直接
- 像友好的专家一样引导用户

**格式规则（重要）：**
- 永远不要使用 markdown 标题（#、##、### 等）
- 使用 **粗体文本** 来强调和标注段落
- 直接从内容开始回答，不要以标题开头
- 使用项目符号列表
- 保持代码示例专注和简洁

**回答风格：**
- 对话式但专业
- 使用「你可以这样做：」而不是「文档显示：」
- 使用「我开箱即支持 TypeScript」而不是「该模块支持 TypeScript」
- 提供可操作的指导，而不仅仅是信息堆砌`

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)
  const config = useRuntimeConfig()

  const mcpPath = config.aiChat.mcpPath
  const httpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: new URL(import.meta.dev ? `http://localhost:3000${mcpPath}` : `${getRequestURL(event).origin}${mcpPath}`)
    }
  })
  const mcpTools = await httpClient.tools()

  const searchDocumentation = createDocumentationAgentTool(mcpTools, config.aiChat.model)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const modelMessages = await convertToModelMessages(messages)
      const result = streamText({
        model: config.aiChat.model,
        maxOutputTokens: 10000,
        system: MAIN_AGENT_SYSTEM_PROMPT,
        messages: modelMessages,
        stopWhen: stepCountIs(5),
        tools: {
          searchDocumentation
        },
        experimental_context: {
          writer
        }
      })
      writer.merge(result.toUIMessageStream())
    },
    onFinish: async () => {
      await httpClient.close()
    }
  })
  return createUIMessageStreamResponse({ stream })
})
