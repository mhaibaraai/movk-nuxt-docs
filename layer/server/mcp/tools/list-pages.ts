import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: `列出所有可用的文档页面及其分类和基本信息。`,
  cache: '1h',
  async handler() {
    const event = useEvent()

    const pages = await queryCollection(event, 'docs').all()

    return pages.map(doc => ({
      title: doc.title,
      description: doc.description,
      path: doc.path
    }))
  }
})
