import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves metadata for a component including props, slots, and events. Props are compact by default, pass `full: true` to get the raw recursive prop schemas (very large)',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)'),
    full: z.boolean().optional().describe('Return raw metadata with recursive prop schemas (very large). Defaults to false (compact props)')
  },
  inputExamples: [
    { componentName: 'Button' },
    { componentName: 'Table' },
    { componentName: 'Modal', full: true }
  ],
  cache: '30m',
  async handler({ componentName, full }) {
    const event = useEvent()
    const candidates = buildComponentNameCandidates(componentName)
    const pages = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '%/components/%')
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'category', 'links')
      .all()

    const page = pages.find((entry) => {
      const pathName = entry.path.split('/').pop()
      return Boolean(
        (pathName && candidates.pathNames.includes(pathName))
        || candidates.displayNames.includes(entry.title)
      )
    })

    if (!page) {
      throw createError({ statusCode: 404, message: `Component '${componentName}' not found in documentation` })
    }

    const normalizedName = normalizeComponentName(componentName, page.title)
    const metadata = await fetchComponentMetadata(page.title, { full })

    if (!metadata) {
      throw createError({ statusCode: 404, message: `Metadata for component '${componentName}' not available` })
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation_url: `${getRequestURL(event).origin}${page.path}`,
      metadata
    }
  }
})
