import { z } from 'zod'

export default defineMcpTool({
  description: `检索特定文档页面的完整内容和详细信息，使用 \`sections\` 参数仅获取特定的 h2 部分以减少响应大小。`,
  inputSchema: {
    path: z.string().describe('从 list-pages 获取或用户提供的页面路径（例如 /docs/getting-started/installation）'),
    sections: z.array(z.string()).optional().describe('要返回的特定 h2 部分标题（例如 ["Usage","API"]）。如果省略，则返回完整文档。')
  },
  cache: '30m',
  handler: async ({ path, sections }) => {
    try {
      const fullContent = await $fetch<string>(`/raw${path}.md`)

      let content = fullContent

      // If sections are specified, extract only those sections
      if (sections && sections.length > 0) {
        content = extractSections(fullContent, sections)
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(content, null, 2) }]
      }
    } catch (error) {
      return errorResult(`获取页面失败: ${error}`)
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
