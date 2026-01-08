import { z } from 'zod/v4'
import { queryCollection } from '@nuxt/content/server'
import { inferSiteURL } from '../../../utils/meta'

export default defineMcpTool({
  description: `检索特定文档页面的完整内容和详细信息。

何时使用：当你知道文档页面的确切路径时使用。常见用例：
- 用户请求特定页面：「显示入门指南」→ /docs/getting-started
- 用户询问已知主题的专用页面
- 你从 list-pages 找到了相关路径并想要完整内容
- 用户引用了他们想要阅读的特定部分或指南

何时不使用：如果你不知道确切路径并需要搜索/探索，请先使用 list-pages。

工作流程：此工具返回完整的页面内容，包括标题、描述和完整的 markdown。当你需要从特定文档页面提供详细答案或代码示例时使用。`,
  inputSchema: {
    path: z.string().describe('从 list-pages 获取或用户提供的页面路径（例如 /docs/getting-started/installation）')
  },
  cache: '1h',
  handler: async ({ path }) => {
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

      const content = await $fetch<string>(`/raw${path}.md`, {
        baseURL: siteUrl
      })

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
