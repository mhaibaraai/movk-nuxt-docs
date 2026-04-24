import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves detailed metadata for a component including props, slots, and events',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)')
  },
  inputExamples: [
    { componentName: 'Button' },
    { componentName: 'Table' }
  ],
  cache: '30m',
  async handler({ componentName }) {
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
    const metaCandidates = buildComponentNameCandidates(page.title).metaNames

    let metadata
    for (const metaName of metaCandidates) {
      try {
        metadata = await $fetch<Record<string, any>>(`/api/component-meta/${metaName}.json`)
        break
      } catch {
        continue
      }
    }

    if (!metadata) {
      throw createError({ statusCode: 404, message: `Metadata for component '${componentName}' not available` })
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation_url: `${getRequestURL(event).origin}${page.path}`,
      metadata: {
        pascalName: metadata.pascalName,
        kebabName: metadata.kebabName,
        props: metadata.meta.props,
        slots: metadata.meta.slots,
        emits: metadata.meta.emits
      }
    }
  }
})
