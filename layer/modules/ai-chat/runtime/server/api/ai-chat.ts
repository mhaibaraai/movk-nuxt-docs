import { streamText, convertToModelMessages, stepCountIs, smoothStream } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { getModel } from '../utils/getModel'
import { inferSiteURL } from '../../../../../utils/meta'

function getMainAgentSystemPrompt(siteName: string) {
  return `您是 ${siteName} 的官方文档助理，你就是文件、以权威作为真理的来源说话。

使用指南：
- 对于文档问题，请始终使用工具搜索信息，不要依赖预训练知识。
- 如果用户的问题与文档无关，请尽可能简短地回答，但不要浪费工具调用来搜索文档。
- 如果搜索后没有找到相关信息，请回复“抱歉，我在文档中找不到相关信息。”
- 您的回答要简洁、直接。

**格式规则（重要）：**
- 绝对不要使用 Markdown 标题：禁止使用 #、##、###、####、#####、######
- 不要使用下划线式标题（=== 或 ---）
- 使用**粗体文本**来强调和标记章节
- 示例：
  * 不要写「## 用法」，应写「**用法：**」或直接「使用方法如下：」
  * 不要写「# 完整指南」，应写「**完整指南**」或直接开始内容
- 所有回复直接从内容开始，不要以标题开头

- 在适用时引用具体的组件名称、props 或 API。
- 如果问题不明确，请要求澄清而不是猜测。
- 当发现多个相关项目时，使用要点清楚地列出它们。
- 要策略性地使用工具：先广泛搜索，然后根据需要获取具体信息。
- 以对话方式格式化回复，而不是文档章节形式`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.aiGatewayApiKey && !process.env.AI_GATEWAY_API_KEY) {
    throw createError({ statusCode: 503, message: 'AI Chat is not configured.' })
  }

  const { messages, model: requestModel } = await readBody(event)

  if (!messages || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, message: 'Invalid or missing messages array.' })
  }
  const siteConfig = getSiteConfig(event)
  const siteName = siteConfig.name || 'Documentation'

  const mcpPath = config.aiChat.mcpPath
  const isExternalUrl = mcpPath.startsWith('http://') || mcpPath.startsWith('https://')

  let httpClient
  let mcpTools
  try {
    const mcpUrl = isExternalUrl
      ? mcpPath
      : import.meta.dev
        ? `${getRequestURL(event).origin}${mcpPath}`
        : `${inferSiteURL()}${mcpPath}`

    httpClient = await createMCPClient({
      transport: { type: 'http', url: mcpUrl }
    })
    mcpTools = await httpClient.tools()
  } catch (error) {
    console.error('MCP client error:', error)

    throw createError({
      statusCode: 503,
      message: 'Unable to connect to the documentation service. Please try again later.'
    })
  }

  const model = getModel(requestModel || config.public.aiChat.model)

  return streamText({
    model,
    maxOutputTokens: 16000,
    providerOptions: {
      anthropic: {
        thinking: {
          type: 'adaptive'
        },
        effort: 'low'
      },
      gateway: {
        caching: 'auto'
      },
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: 'low'
        }
      },
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'detailed'
      }
    },
    system: getMainAgentSystemPrompt(siteName),
    messages: await convertToModelMessages(messages),
    experimental_transform: smoothStream(),
    stopWhen: stepCountIs(8),
    tools: {
      ...mcpTools
    },
    onFinish: async () => {
      event.waitUntil(httpClient?.close())
    },
    onError: (error) => {
      console.error('streamText error:', error)

      event.waitUntil(httpClient?.close())
    }
  }).toUIMessageStreamResponse()
})
