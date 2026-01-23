import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import { inferSiteURL } from '../../../utils/meta'

export default defineMcpTool({
  description: `检索特定文档页面的完整内容和详细信息，使用 \`sections\` 参数仅获取特定的 h2 部分以减少响应大小。'

何时使用：当你知道文档页面的确切路径时使用。常见用例：
- 用户请求特定页面：「显示入门指南」→ /docs/getting-started
- 用户询问已知主题的专用页面
- 你从 list-pages 找到了相关路径并想要完整内容
- 用户引用了他们想要阅读的特定部分或指南

何时不使用：如果你不知道确切路径并需要搜索/探索，请先使用 list-pages。

工作流程：此工具返回完整的页面内容，包括标题、描述和完整的 markdown。当你需要从特定文档页面提供详细答案或代码示例时使用。`,
  inputSchema: {
    path: z.string().describe('从 list-pages 获取或用户提供的页面路径（例如 /docs/getting-started/installation）'),
    sections: z.array(z.string()).optional().describe('要返回的特定 h2 部分标题（例如 ["Usage","API"]）。如果省略，则返回完整文档。')
  },
  cache: '30m',
  handler: async ({ path, sections }) => {
    const event = useEvent()
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : inferSiteURL()

    try {
      const page = await queryCollection(event, 'docs')
        .where('path', '=', path)
        .select('title', 'path', 'description')
        .first()

      if (!page) {
        return {
          content: [{ type: 'text', text: '页面未找到' }],
          isError: true
        }
      }

      const fullContent = await $fetch<string>(`/raw${path}.md`, {
        baseURL: siteUrl
      })

      let content = fullContent

      // If sections are specified, extract only those sections
      if (sections && sections.length > 0) {
        content = extractSections(fullContent, sections)
      }

      const result = {
        title: page.title,
        path: page.path,
        description: page.description,
        content,
        url: `${siteUrl}${page.path}`
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      }
    } catch {
      return {
        content: [{ type: 'text', text: '获取页面失败' }],
        isError: true
      }
    }
  }
})

/**
 * Extract specific sections from markdown content based on h2 headings
 */
function extractSections(markdown: string, sectionTitles: string[]): string {
  const lines = markdown.split('\n')
  const result: string[] = []

  // Normalize section titles for matching
  const normalizedTitles = sectionTitles.map(t => t.toLowerCase().trim())

  // Always include title (h1) and description (first blockquote)
  let inHeader = true
  for (const line of lines) {
    if (inHeader) {
      result.push(line)
      // Stop after the description blockquote
      if (line.startsWith('>') && result.length > 1) {
        result.push('')
        inHeader = false
      }
      continue
    }
    break
  }

  // Find and extract requested sections
  let currentSection: string | null = null
  let sectionContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Check for h2 heading
    if (line.startsWith('## ')) {
      // Save previous section if it was requested
      if (currentSection && normalizedTitles.includes(currentSection.toLowerCase())) {
        result.push(...sectionContent)
        result.push('')
      }

      // Start new section
      currentSection = line.replace('## ', '').trim()
      sectionContent = [line]
      continue
    }

    // Add line to current section
    if (currentSection) {
      sectionContent.push(line)
    }
  }

  // Don't forget the last section
  if (currentSection && normalizedTitles.includes(currentSection.toLowerCase())) {
    result.push(...sectionContent)
  }

  return result.join('\n').trim()
}
