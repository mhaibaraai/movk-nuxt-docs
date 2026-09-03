import { z } from 'zod'
import { getAgentDocument } from '#agent-discovery'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path. Use the `headings` parameter to fetch only specific h2 sections to reduce response size.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/SearchForm)'),
    headings: z.array(z.string()).optional().describe('Specific h2 heading titles to extract (e.g., ["Usage", "API"]). If omitted, returns full page.')
  },
  inputExamples: [
    { path: '/docs/components/button', headings: ['Usage', 'API'] },
    { path: '/docs/getting-started/installation' }
  ],
  cache: '30m',
  handler: async ({ path, headings }) => {
    const event = useEvent()

    // 与 /raw/**.md 同一个适配器，在进程内解析，不再从函数里再发一次请求。
    // 指向章节而非页面的路径会解析出 redirect，跟进它等价于原先 raw 路由的重定向行为。
    let document = await getAgentDocument(event, path, { sections: headings })
    if (document && 'redirect' in document) {
      document = await getAgentDocument(event, document.redirect, { sections: headings })
    }

    if (!document || 'redirect' in document) {
      throw createError({ statusCode: 404, message: `Documentation page not found at path: ${path}` })
    }

    return document.markdown
  }
})
