import { queryCollection } from '@nuxt/content/server'
import { eventHandler, getRequestURL, setHeader } from 'h3'

export default eventHandler(async (event) => {
  const pages = await queryCollection(event, 'docs')
    .select('path', 'title', 'navigation')
    .where('extension', '=', 'md')
    .where('path', 'NOT LIKE', '%/.navigation')
    .order('path', 'ASC')
    .all()

  const siteUrl = (getSiteConfig(event).url || getRequestURL(event).origin).replace(/\/$/, '')
  const baseURL = useRuntimeConfig(event).app.baseURL.replace(/\/$/, '')
  let md = '# Sitemap\n\n'
  let currentSection = ''

  for (const page of pages) {
    const section = page.path.replace(/^\/docs\/?/, '').split('/')[0] || 'docs'
    if (section !== currentSection) {
      if (currentSection) {
        md += '\n'
      }
      const title = section.replace(/^\d+[.-]/, '').replace(/[-_]/g, ' ').trim() || section
      md += `## ${title.replace(/\b\w/g, char => char.toUpperCase())}\n\n`
      currentSection = section
    }

    const navigationTitle = typeof page.navigation === 'object' && page.navigation ? page.navigation.title : undefined
    const pageLabel = (navigationTitle || page.title || page.path)
      .replace(/\\/g, '\\\\')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
    const href = `${siteUrl}${baseURL}/raw${page.path}.md`
    md += `- [${pageLabel}](${href})\n`
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return md
})
