import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

const sectionEnum = z.enum(['usage', 'examples', 'api', 'theme', 'changelog'])

export default defineMcpTool({
  description: 'Retrieves component documentation and details. Use the `sections` parameter to fetch only specific parts of the documentation to reduce response size.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)'),
    sections: z.array(sectionEnum).optional().describe('Specific sections to return: usage, examples, api, theme, changelog. If omitted, returns full documentation.')
  },
  inputExamples: [
    { componentName: 'Button', sections: ['usage', 'api'] },
    { componentName: 'Modal' },
    { componentName: 'Table', sections: ['examples'] }
  ],
  cache: '30m',
  async handler({ componentName, sections }) {
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

    const fullDocumentation = await $fetch<string>(`/raw${page.path}.md`)

    let documentation = fullDocumentation

    // If sections are specified, extract only those sections
    if (sections && sections.length > 0) {
      documentation = extractSections(fullDocumentation, sections)
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation,
      documentation_url: `${getRequestURL(event).origin}${page.path}`,
      sections_returned: sections || ['full']
    }
  }
})
