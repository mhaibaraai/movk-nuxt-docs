import type { Collections, PageCollectionItemBase } from '@nuxt/content'
import { queryCollection } from '@nuxt/content/server'
import type { H3Event } from 'h3'
import { eventHandler, setHeader } from 'h3'

async function findIndexPage(event: H3Event) {
  const landingCollection = 'landing' as keyof Collections
  const pageCollections = getPageCollections()

  if (pageCollections.includes(landingCollection)) {
    const page = await queryCollection(event, landingCollection)
      .path('/')
      .first() as PageCollectionItemBase | null

    if (page) return page
  }

  for (const collection of getPageCollections([landingCollection])) {
    const page = await queryCollection(event, collection)
      .path('/')
      .first() as PageCollectionItemBase | null

    if (page) return page
  }

  return null
}

export default eventHandler(async (event) => {
  const page = await findIndexPage(event)
  const metadata = getSiteMetadata(event, page)
  const title = page?.title || metadata.siteName
  const description = page?.description || metadata.description
  const canonicalUrl = metadata.baseSiteUrl

  const links = [
    `- Website: <${metadata.baseSiteUrl}>`,
    metadata.repository ? `- GitHub: <${metadata.repository}>` : undefined
  ].filter(Boolean).join('\n')

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical_url: ${JSON.stringify(canonicalUrl)}`,
    `last_updated: ${JSON.stringify(new Date().toISOString().split('T')[0])}`,
    '---',
    ''
  ].join('\n')

  const body = `# ${title}

> ${description}

## About

${description || `${title} documentation site.`}

## Explore

- Documentation: <${createSiteURL(event, '/docs')}>
- Sitemap: <${createSiteURL(event, '/sitemap.md')}>
- LLMs index: <${createSiteURL(event, '/llms.txt')}>
- Full LLMs documentation: <${createSiteURL(event, '/llms-full.txt')}>

## Resources for Agents

- MCP Server Card: <${createSiteURL(event, '/.well-known/mcp/server-card.json')}>
- MCP endpoint: <${metadata.mcpUrl}>
- API Catalog: <${createSiteURL(event, '/.well-known/api-catalog')}>
- Skills index: <${createSiteURL(event, '/.well-known/skills/index.json')}>

## Links

${links}
`

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Link', `<${canonicalUrl}>; rel="canonical"`)
  return frontmatter + body
})
