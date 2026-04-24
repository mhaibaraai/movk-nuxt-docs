import { eventHandler, setHeader } from 'h3'

export default eventHandler((event) => {
  const metadata = getSiteMetadata(event)
  const docsUrl = createSiteURL(event, '/docs')

  const linkset = {
    linkset: [
      {
        'anchor': metadata.mcpUrl,
        'service-desc': [
          {
            href: createSiteURL(event, '/.well-known/mcp/server-card.json'),
            type: 'application/json'
          }
        ],
        'service-doc': [
          {
            href: docsUrl,
            type: 'text/html'
          }
        ]
      },
      {
        'anchor': docsUrl,
        'service-desc': [
          {
            href: createSiteURL(event, '/llms.txt'),
            type: 'text/plain'
          }
        ],
        'service-doc': [
          {
            href: docsUrl,
            type: 'text/html'
          }
        ]
      }
    ]
  }

  setHeader(event, 'Content-Type', 'application/linkset+json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return linkset
})
