import type { Collections, PageCollectionItemBase } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    return '---\ntitle: Not Found\n---\n\n# Page Not Found\n\nThe requested page does not exist. Browse the [sitemap](/sitemap.md) to find available pages.\n'
  }

  let path = withLeadingSlash(slug.replace('.md', ''))
  if (path.endsWith('/index')) {
    path = path.substring(0, path.length - 6)
  }

  let page: PageCollectionItemBase | null = null
  for (const collection of getPageCollections()) {
    page = await queryCollection(event, collection as keyof Collections).path(path).first() as PageCollectionItemBase | null
    if (page) break
  }

  if (!page) {
    setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    return `---\ntitle: Not Found\n---\n\n# Page Not Found\n\nThe page \`${path}\` does not exist. Browse the [sitemap](/sitemap.md) to find available pages.\n`
  }

  await transformMDC(event, page as any)

  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')

  const canonicalUrl = createSiteURL(event, page.path)
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(page.title || '')}`,
    `description: ${JSON.stringify(page.description || '')}`,
    `seo_title: ${JSON.stringify(page.seo?.title || '')}`,
    `seo_description: ${JSON.stringify(page.seo?.description || '')}`,
    `canonical_url: ${JSON.stringify(canonicalUrl)}`,
    `last_updated: ${JSON.stringify(new Date().toISOString().split('T')[0])}`,
    '---',
    ''
  ].join('\n')

  setResponseHeader(event, 'Link', `<${canonicalUrl}>; rel="canonical"`)
  const body = stringifyMinimark(page.body)
  return frontmatter + body + '\n\n## Sitemap\n\nSee the full [sitemap](/sitemap.md) for all pages.\n'
})
