import { z } from 'zod'
import { listAgentPages } from '#agent-discovery'

export default defineMcpTool({
  description: 'Search documentation pages by title, description, or section. With no params, lists all pages.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    search: z.string().optional().describe('Search terms to filter pages by title, path or description. Every term has to match.'),
    section: z.string().optional().describe('Filter by documentation section (e.g., "getting-started", "components", "composables")')
  },
  inputExamples: [
    {},
    { section: 'getting-started' },
    { search: 'installation' },
    { search: 'color', section: 'getting-started' }
  ],
  cache: '30m',
  async handler({ search, section }) {
    // 两个 URL 都来自内容协商与 CDN 重写共用的那份路由配置，
    // markdown_url 因此不会与页面的真实位置漂移，站点地址也不再写死在这里
    const pages = await listAgentPages(useEvent(), {
      search,
      prefix: section ? `/docs/${section}/` : '/docs/'
    })

    return {
      pages: pages
        .map(page => ({
          title: page.title,
          description: page.description,
          path: page.route,
          url: page.url,
          markdown_url: page.rawUrl
        }))
        .sort((a, b) => a.path.localeCompare(b.path)),
      total: pages.length
    }
  }
})
