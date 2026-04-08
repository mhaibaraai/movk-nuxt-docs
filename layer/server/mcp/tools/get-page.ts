import { z } from 'zod'

export default defineMcpTool({
  description: `检索特定文档页面的完整内容和详细信息，使用 \`sections\` 参数仅获取特定的 h2 部分以减少响应大小。`,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    path: z.string().describe('从 list-pages 获取或用户提供的页面路径（例如 /docs/getting-started/installation）'),
    sections: z.array(z.string()).optional().describe('要返回的特定 h2 部分标题（例如 ["Usage","API"]）。如果省略，则返回完整文档。')
  },
  inputExamples: [
    { path: '/docs/components/button', sections: ['Usage', 'API'] },
    { path: '/docs/getting-started/installation' }
  ],
  cache: '30m',
  handler: async ({ path, sections }) => {
    let content
    try {
      content = await $fetch<string>(`/raw${path}.md`)
    } catch {
      throw createError({ statusCode: 404, message: `获取页面失败: ${path}` })
    }
    // If sections are specified, extract only those sections
    if (sections && sections.length > 0) {
      content = extractSections(content, sections)
    }

    return content
  }
})
