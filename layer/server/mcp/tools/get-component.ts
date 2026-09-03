import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import { getAgentDocument, getAgentSiteUrl } from '#agent-discovery'

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

    // 与 /raw/**.md 同一个适配器，在进程内解析并按请求的 h2 章节裁剪
    const document = await getAgentDocument(event, page.path, { sections })
    if (!document || 'redirect' in document) {
      throw createError({ statusCode: 404, message: `Component '${componentName}' has no documentation page` })
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation: document.markdown,
      documentation_url: `${getAgentSiteUrl(event)}${page.path}`,
      sections_returned: sections || ['full']
    }
  }
})
