import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: `列出所有可用的文档页面及其分类和基本信息。

何时使用：当你需要探索或搜索某个主题的文档但不知道确切的页面路径时使用。常见场景：
- 「查找关于 markdown 功能的文档」- 探索可用指南
- 「显示所有入门指南」- 浏览入门内容
- 「搜索高级配置选项」- 查找特定主题
- 用户提出的一般性问题，未指定确切页面
- 你需要了解整体文档结构

何时不使用：如果你已经知道具体的页面路径（例如 "/docs/getting-started/installation"），请直接使用 get-page。

工作流程：此工具返回页面标题、描述和路径。找到相关页面后，使用 get-page 检索符合用户需求的特定页面的完整内容。

输出：返回包含以下内容的结构化列表：
- title：可读的页面名称
- path：用于 get-page 的确切路径
- description：页面内容的简要摘要
- url：完整 URL 供参考`,
  cache: '30m',
  handler: async () => {
    const event = useEvent()
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : getRequestURL(event).origin

    try {
      const pages = await queryCollection(event, 'docs')
        .select('title', 'path', 'description')
        .all()

      const result = pages.map(page => ({
        title: page.title,
        path: page.path,
        description: page.description,
        url: `${siteUrl}${page.path}`
      }))

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      }
    } catch {
      return {
        content: [{ type: 'text', text: '获取页面列表失败' }],
        isError: true
      }
    }
  }
})
