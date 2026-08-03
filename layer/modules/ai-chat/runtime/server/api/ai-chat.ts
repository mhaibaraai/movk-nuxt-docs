import type { InferUITools, Tool, UIMessage } from 'ai'
import { smoothStream, isStepCount, dynamicTool, jsonSchema, ToolLoopAgent, createAgentUIStreamResponse, consumeStream, APICallError } from 'ai'
import type { McpRequestExtra, McpToolDefinitionListItem } from '@nuxtjs/mcp-toolkit/server'
import { createCacheOptions, wrapWithCache } from '@nuxtjs/mcp-toolkit/server'
// @ts-ignore 构建期虚拟模块，其 ambient 声明只注入 Nitro tsconfig，app tsconfig 无法解析
import { tools as mcpToolDefinitions } from '#nuxt-mcp-toolkit/tools.mjs'
import z from 'zod'
import { getModel } from '../utils/getModel'
import { hasAnyAiKey } from '../../../keys'
import { getChatUser } from '../utils/chatUser'

function getMainAgentSystemPrompt(siteName: string, currentPage?: string | null) {
  return `You are a helpful assistant for ${siteName}, the official documentation site. Treat the documentation and MCP tool results as the source of truth. Use your knowledge base tools to search for relevant information before answering documentation questions.

${currentPage ? `The user is currently viewing the documentation page at \`${currentPage}\`. Use this context to provide more relevant answers. If the question seems related, read that page first, but do not limit yourself to it when the question is broader or unrelated.\n` : ''}Guidelines:
- For documentation questions, ALWAYS use tools to search or read the relevant information before answering. Never rely on pre-trained knowledge for project-specific APIs, components, composables, configuration, behavior, or examples.
- For questions about configuration, customization, page structure, content authoring, AI chat, MCP, skills, or examples, search the documentation like any other docs question.
- If a question is unrelated to this documentation, answer briefly if you can, but do not waste tool calls searching docs for it.
- If no relevant information is found after searching, respond with "Sorry, I couldn't find information about that in the documentation."
- Be concise, direct, and practical.

**PAGE CONTEXT:**
- A user message may end with a \`[Context: the user is currently viewing <path>]\` marker. It is added automatically and is not something the user typed, so never mention it or repeat it back.
- Use it to resolve vague questions ("explain this page", "how does this work?"). Only the most recent marker is relevant, earlier ones are stale.
- When the marker names a docs path, call \`get-documentation-page\` with that exact path instead of searching first. Don't limit yourself to that page if the question is broader or unrelated.

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

// 与 registerToolFromDefinition 保持一致的默认缓存键，让本端点与 /mcp 共用同一份缓存条目
function toolCacheKey(args: Record<string, unknown>) {
  return Object.values(args).map(value => String(value).replace(/\//g, '-').replace(/^-/, '')).join(':')
}

function resolveToolHandler(def: McpToolDefinitionListItem, name: string) {
  if (def.cache === undefined) {
    return def.handler
  }

  const cacheOptions = createCacheOptions(def.cache, `mcp-tool:${name}`, def.inputSchema ? toolCacheKey : undefined)
  return wrapWithCache(def.handler as (...args: unknown[]) => unknown, cacheOptions)
}

function mcpToolsToAiTools() {
  const aiTools: Record<string, Tool> = {}

  for (const def of mcpToolDefinitions as McpToolDefinitionListItem[]) {
    const filename = def._meta?.filename as string | undefined
    const name = def.name || (filename
      ? filename.replace(/\.(ts|js|mts|mjs)$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase()
      : null)
    if (!name) continue

    const schema = def.inputSchema
      ? z.toJSONSchema(z.object(def.inputSchema)) as Record<string, unknown>
      : { type: 'object' as const, properties: {} }

    const handler = resolveToolHandler(def, name)

    aiTools[name] = dynamicTool({
      description: def.description || '',
      inputSchema: jsonSchema(schema),
      execute: async (args, { abortSignal }) => {
        try {
          return await handler(args, { signal: abortSignal } as McpRequestExtra)
        } catch (error: any) {
          return { error: error.statusCode ? `[${error.statusCode}] ${error.message}` : error.message || String(error) }
        }
      }
    })
  }

  return aiTools
}

const tools = {
  ...mcpToolsToAiTools()
}

export type DocsChatTools = InferUITools<typeof tools>
export type DocsChatMessage = UIMessage<unknown, never, DocsChatTools>

export default defineEventHandler(async (event) => {
  if (!hasAnyAiKey()) {
    throw createError({ statusCode: 503, message: 'AI Chat is not configured.' })
  }

  const config = useRuntimeConfig()

  const { messages, model: requestModel, currentPage } = await readBody(event)

  const safeCurrentPage = typeof currentPage === 'string'
    && currentPage.length <= 128
    && !/[\r\n]/.test(currentPage)
    && /^\/docs\/[\w/-]*$/.test(currentPage)
    ? currentPage
    : null

  const uiMessages = messages.map((message: UIMessage, index: number) => {
    if (!safeCurrentPage || index !== messages.length - 1 || message.role !== 'user') {
      return message
    }

    return {
      ...message,
      parts: [...(message.parts || []), { type: 'text' as const, text: `[Context: the user is currently viewing ${safeCurrentPage}]` }]
    }
  })

  const siteConfig = getSiteConfig(event)
  const siteName = siteConfig.name || 'Documentation'

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const model = getModel(requestModel || config.public.aiChat.model)

  const agent = new ToolLoopAgent({
    model,
    instructions: getMainAgentSystemPrompt(siteName, currentPage),
    maxOutputTokens: 8000,
    stopWhen: isStepCount(6),
    tools,
    providerOptions: {
      anthropic: {
        thinking: {
          type: 'adaptive',
          display: 'summarized'
        },
        effort: 'low'
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
      },
      gateway: {
        caching: 'auto',
        user: getChatUser(event, siteName),
        tags: ['docs-chat']
      }
    }
  })

  return createAgentUIStreamResponse({
    agent,
    uiMessages,
    abortSignal: abortController.signal,
    experimental_transform: smoothStream(),
    consumeSseStream: consumeStream,
    onError: (error) => {
      // Provider errors carry the outgoing prompt in `requestBodyValues` and the raw
      // `responseBody`, so log identifying fields only and keep chat content out of the logs.
      const statusCode = APICallError.isInstance(error) ? error.statusCode : undefined

      console.error('[api/ai] stream error:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        statusCode
      })

      if (statusCode === 429) {
        return 'You have reached the message limit for now. Please try again later.'
      }

      return 'An error occurred.'
    }
  })
})
