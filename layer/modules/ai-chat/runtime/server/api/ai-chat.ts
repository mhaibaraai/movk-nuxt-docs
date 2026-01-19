import { streamText, convertToModelMessages, stepCountIs, createUIMessageStream, createUIMessageStreamResponse, smoothStream } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { createDocumentationAgentTool } from '../utils/docs_agent'
import { getModel } from '../utils/getModel'

function getMainAgentSystemPrompt(siteName: string) {
  return `您是 ${siteName} 的官方文档助理。你就是文件、以权威作为真理的来源说话.

使用指南：
- 始终使用工具搜索信息，不要依赖预训练知识
- 如果搜索后未找到相关信息，回复「抱歉，我在文档中没有找到相关信息」
- 回答要简洁直接

**格式规则（重要）：**
- 绝对不要使用 Markdown 标题：禁止使用 #、##、###、####、#####、######
- 不要使用下划线式标题（=== 或 ---）
- 使用**粗体文本**来强调和标记章节
- 示例：
  * 不要写「## 用法」，应写「**用法：**」或直接「使用方法如下：」
  * 不要写「# 完整指南」，应写「**完整指南**」或直接开始内容
- 所有回复直接从内容开始，不要以标题开头

- 在适用时引用具体的组件名称、属性或 API
- 如果问题模糊，请要求澄清而不是猜测
- 当找到多个相关项目时，使用项目符号清晰列出
- 你最多有 6 次工具调用机会来找到答案，因此要策略性地使用：先广泛搜索，然后根据需要获取具体信息
- 以对话方式格式化回复，而不是文档章节形式`
}

export default defineEventHandler(async (event) => {
  const { messages, model: requestModel } = await readBody(event)
  const config = useRuntimeConfig()
  const siteConfig = getSiteConfig(event)
  const siteName = siteConfig.name || 'Documentation'

  const mcpPath = config.aiChat.mcpPath
  const isExternalUrl = mcpPath.startsWith('http://') || mcpPath.startsWith('https://')
  const mcpUrl = isExternalUrl
    ? mcpPath
    : import.meta.dev
      ? `http://localhost:3000${mcpPath}`
      : `${getRequestURL(event).origin}${mcpPath}`

  const httpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: mcpUrl
    }
  })
  const mcpTools = await httpClient.tools()

  const model = getModel(requestModel || config.public.aiChat.model)

  const searchDocumentation = createDocumentationAgentTool(mcpTools, model, siteName)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const modelMessages = await convertToModelMessages(messages)
      const result = streamText({
        model,
        maxOutputTokens: 10000,
        system: getMainAgentSystemPrompt(siteName),
        messages: modelMessages,
        stopWhen: stepCountIs(6),
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
