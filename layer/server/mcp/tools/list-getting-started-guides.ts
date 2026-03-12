import { queryCollection } from '@nuxt/content/server'
import { inferSiteURL } from '../../../utils/meta'

export default defineMcpTool({
  description: '列出所有入门指南和安装说明',
  cache: '30m',
  async handler() {
    const event = useEvent()
    const siteUrl = import.meta.dev ? getRequestURL(event).origin : inferSiteURL()

    const pages = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/getting-started/%')
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'navigation')
      .all()

    const result = pages.map(page => ({
      title: page.title,
      description: page.description,
      path: page.path,
      url: `${siteUrl}${page.path}`,
      navigation: page.navigation
    })).sort((a, b) => a.path.localeCompare(b.path))

    return jsonResult(result)
  }
})
