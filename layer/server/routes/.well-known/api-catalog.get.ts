export default defineCachedEventHandler((event) => {
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
          },
          {
            href: createSiteURL(event, '/llms-full.txt'),
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

  setResponseHeader(event, 'Content-Type', 'application/linkset+json; charset=utf-8')
  return linkset
}, {
  swr: true,
  maxAge: 60 * 60
})
