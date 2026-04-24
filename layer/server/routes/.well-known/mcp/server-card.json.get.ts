import { eventHandler, setHeader } from 'h3'

export default eventHandler((event) => {
  const metadata = getSiteMetadata(event)

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
    transport: {
      type: 'streamable-http',
      endpoint: metadata.mcpUrl
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
    tools: [
      { name: 'search-components', description: 'Search documented components by name, description, or category.' },
      { name: 'get-component', description: 'Get the full documentation for a documented component.' },
      { name: 'get-component-metadata', description: 'Get component metadata such as props, slots, and events.' },
      { name: 'list-examples', description: 'List available component examples.' },
      { name: 'get-example', description: 'Get the source code for a component example.' },
      { name: 'search-composables', description: 'Search documented composables.' },
      { name: 'search-documentation', description: 'Search the documentation site.' },
      { name: 'get-documentation-page', description: 'Get the markdown content of a documentation page.' },
      { name: 'search-icons', description: 'Search icons from the configured icon collections.' }
    ],
    resources: [
      { name: 'components', description: 'Catalog of documented components.' },
      { name: 'composables', description: 'Catalog of documented composables.' },
      { name: 'documentation-pages', description: 'Catalog of documentation pages.' },
      { name: 'examples', description: 'Catalog of component examples.' }
    ],
    prompts: [
      { name: 'find-component-for-usecase', description: 'Find the best documented component for a specific use case.' },
      { name: 'implement-component-with-props', description: 'Implement a documented component with the right props and slots.' }
    ],
    authentication: {
      required: false
    }
  }

  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return serverCard
})
