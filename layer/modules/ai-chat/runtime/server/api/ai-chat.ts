import { streamText, convertToModelMessages, stepCountIs, smoothStream } from 'ai'
import { createMCPClient } from '@ai-sdk/mcp'
import { getModel } from '../utils/getModel'

function getMainAgentSystemPrompt(siteName: string, currentPage?: string | null) {
  return `You are a helpful assistant for ${siteName}, the official documentation site. Treat the documentation and MCP tool results as the source of truth. Use your knowledge base tools to search for relevant information before answering documentation questions.

${currentPage ? `The user is currently viewing the documentation page at \`${currentPage}\`. Use this context to provide more relevant answers. If the question seems related, read that page first, but do not limit yourself to it when the question is broader or unrelated.\n` : ''}Guidelines:
- For documentation questions, ALWAYS use tools to search or read the relevant information before answering. Never rely on pre-trained knowledge for project-specific APIs, components, composables, configuration, behavior, or examples.
- For questions about configuration, customization, page structure, content authoring, AI chat, MCP, skills, or examples, search the documentation like any other docs question.
- If a question is unrelated to this documentation, answer briefly if you can, but do not waste tool calls searching docs for it.
- If no relevant information is found after searching, respond with "Sorry, I couldn't find information about that in the documentation."
- Be concise, direct, and practical.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and short section labels when useful
- Start all responses with content, never with a heading

- Reference specific page paths, component names, props, composables, config keys, or APIs when applicable.
- If a question is ambiguous, ask for clarification rather than guessing.
- When multiple relevant items are found, list them clearly using bullet points.
- You have up to 5 tool calls to find the answer, so be strategic: start broad, then get specific if needed.
- Format responses in a conversational way, not as documentation sections.`
}

export default defineEventHandler(async (event) => {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw createError({ statusCode: 503, message: 'AI Chat is not configured.' })
  }

  const config = useRuntimeConfig()

  const { messages, model: requestModel, currentPage } = await readBody(event)

  if (!messages || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, message: 'Invalid or missing messages array.' })
  }
  const siteConfig = getSiteConfig(event)
  const siteName = siteConfig.name || 'Documentation'

  const baseURL = config.app?.baseURL?.replace(/\/$/, '') || ''
  const mcpPath = config.aiChat.mcpPath
  const isExternalUrl = mcpPath.startsWith('http://') || mcpPath.startsWith('https://')

  let httpClient
  let mcpTools
  try {
    const mcpUrl = isExternalUrl
      ? mcpPath
      : `${getRequestURL(event).origin}${baseURL}${mcpPath}`

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

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const closeMcp = () => event.waitUntil(httpClient?.close())
  const model = getModel(requestModel || config.public.aiChat.model)

  return streamText({
    model,
    maxOutputTokens: 8000,
    abortSignal: abortController.signal,
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
    system: getMainAgentSystemPrompt(siteName, currentPage),
    messages: await convertToModelMessages(messages),
    experimental_transform: smoothStream(),
    stopWhen: stepCountIs(6),
    tools: {
      ...mcpTools
    },
    onFinish: closeMcp,
    onAbort: closeMcp,
    onError: (error) => {
      console.error('streamText error:', error)
      closeMcp()
    }
  }).toUIMessageStreamResponse()
})
