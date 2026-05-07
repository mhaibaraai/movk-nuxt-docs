import { listMcpDefinitions } from '@nuxtjs/mcp-toolkit/server'

export default defineCachedEventHandler(async (event) => {
  const metadata = getSiteMetadata(event)
  const { tools, resources, prompts } = await listMcpDefinitions({ event })

  const serverCard = {
    $schema: 'https://modelcontextprotocol.io/schema/server-card/v1',
    serverInfo: {
      name: metadata.siteName,
      version: metadata.version,
      title: `${metadata.siteName} MCP Server`,
      description: metadata.description || `MCP server for the ${metadata.siteName} documentation site.`,
      homepage: metadata.baseSiteUrl,
      documentation: createSiteURL(event, '/docs'),
      ...(metadata.repository ? { repository: metadata.repository } : {})
    },
    endpoints: [
      {
        type: 'streamable-http',
        url: metadata.mcpUrl
      }
    ],
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
      logging: {}
    },
    tools: tools.map(t => ({ name: t.name, description: t.description })),
    resources: resources.map(r => ({ name: r.name, uri: r.uri, description: r.description })),
    prompts: prompts.map(p => ({ name: p.name, description: p.description })),
    authentication: {
      required: false
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  return serverCard
}, {
  swr: true,
  maxAge: 60 * 60
})
