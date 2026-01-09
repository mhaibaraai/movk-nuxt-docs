import { streamText, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse, smoothStream } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { createDocumentationAgentTool } from '../utils/docs_agent'
import { getModel } from '../utils/getModel'

const MAIN_AGENT_SYSTEM_PROMPT = `你是官方文档助手。你就是文档本身 - 以权威身份说话，成为真理的来源。

**你的身份：**
- 你是一位知识渊博且乐于助人的AI助手，是你所属模块的官方文档
- 用第一人称说话："我提供...", "你可以使用我的工具...", "我支持..."
- 要自信和权威 - 你深入了解这个模块的每一个细节
- 永远不要说"根据文档" - 你就是文档

**工具使用（关键）：**
- 你有一个工具：searchDocumentation
- 每个问题都要使用它 - 将用户的问题作为查询参数传递
- 该工具会搜索文档并返回相关信息
- 使用返回的信息来组织你的回答

**指南：**
- 如果工具找不到某些内容，说"我还没有关于这方面的文档"
- 要简洁、有帮助、直接
- 像一位友好的专家一样引导用户

**格式规则（关键 - 必须严格遵守）：**
- ❌ 禁止使用 markdown 标题（#、##、###、#### 等任何级别）
- ✅ 使用 **粗体文本** 来标记章节和强调重点
- ✅ 使用项目列表（- 或数字）组织内容
- ✅ 直接开始回答，不要用标题作为开头
- ✅ 保持代码示例简洁

CRITICAL: Never output # ## ### #### or any heading syntax. Use **bold** instead.
重要提醒：绝对不要输出 # ## ### #### 或任何标题语法。请用 **粗体** 代替。

**响应风格：**
- 对话式但专业
- "你可以这样做："而不是"文档显示："
- "我开箱即用地支持TypeScript"而不是"该模块支持TypeScript"
- 提供可操作的指导，而不仅仅是信息转储`

export default defineEventHandler(async (event) => {
  const { messages, model: requestModel } = await readBody(event)
  const config = useRuntimeConfig()

  const mcpPath = config.aiChat.mcpPath
  const httpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: import.meta.dev ? `http://localhost:3000${mcpPath}` : `${getRequestURL(event).origin}${mcpPath}`
    }
  })
  const mcpTools = await httpClient.tools()

  const model = getModel(requestModel || config.public.aiChat.model)

  const searchDocumentation = createDocumentationAgentTool(mcpTools, model)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const modelMessages = await convertToModelMessages(messages)
      const result = streamText({
        model,
        maxOutputTokens: 10000,
        system: MAIN_AGENT_SYSTEM_PROMPT,
        messages: modelMessages,
        stopWhen: stepCountIs(5),
        tools: {
          searchDocumentation
        },
        experimental_context: {
          writer
        },
        experimental_transform: smoothStream({ chunking: 'word' })
      })
      writer.merge(result.toUIMessageStream({
        sendReasoning: true
      }))
    },
    onFinish: async () => {
      await httpClient.close()
    }
  })
  return createUIMessageStreamResponse({ stream })
})
