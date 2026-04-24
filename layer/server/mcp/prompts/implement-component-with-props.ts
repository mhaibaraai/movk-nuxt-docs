import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpPrompt({
  description: 'Generate complete component implementation with proper props and styling',
  inputSchema: {
    componentName: z.string().describe('The component name (PascalCase)'),
    requirements: z.string().optional().describe('Specific requirements or customizations needed')
  },
  async handler({ componentName, requirements }) {
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
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Component '${componentName}' not found in documentation. Please use a valid component name.`
            }
          }
        ]
      }
    }

    const normalizedName = normalizeComponentName(componentName, page.title)
    const metaCandidates = buildComponentNameCandidates(page.title).metaNames

    let metadata = null
    for (const metaName of metaCandidates) {
      try {
        metadata = await $fetch<any>(`/api/component-meta/${metaName}.json`)
        break
      } catch {
        continue
      }
    }

    const component = {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation_url: `${getRequestURL(event).origin}${page.path}`,
      metadata: metadata
        ? {
            pascalName: metadata.pascalName,
            kebabName: metadata.kebabName,
            props: metadata.meta.props,
            slots: metadata.meta.slots,
            emits: metadata.meta.emits
          }
        : null
    }

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Generate a complete implementation of the ${componentName} component with proper props and styling. ${requirements ? `Requirements: ${requirements}` : ''}\n\nComponent details: ${JSON.stringify(component, null, 2)}`
          }
        }
      ]
    }
  }
})
