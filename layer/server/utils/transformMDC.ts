import type { H3Event } from 'h3'
import { camelCase, kebabCase, upperFirst } from 'scule'
import { visit } from '@nuxt/content/runtime'
// @ts-expect-error - no types available
import components from '#component-example/nitro'

type Document = {
  title: string
  body: any
}

function replaceNodeWithPre(node: any[], language: string, code: string, filename?: string) {
  node[0] = 'pre'
  node[1] = { language, code }
  if (filename) node[1].filename = filename
}

function visitAndReplace(doc: Document, type: string, handler: (node: any[]) => void) {
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === type) {
      handler(node)
    }
    return true
  }, node => node)
}

export async function transformMDC(event: H3Event, doc: Document): Promise<Document> {
  // Transform commit-changelog to changelog content
  const changelogNodes: any[][] = []
  visitAndReplace(doc, 'commit-changelog', (node) => {
    changelogNodes.push(node)
  })

  if (changelogNodes.length) {
    const { github } = useAppConfig() as { github: Record<string, any> }

    await Promise.all(changelogNodes.map(async (node) => {
      const attrs = node[1] || {}
      const basePath = attrs['commit-path'] || github?.commitPath || 'src'
      const filePrefix = attrs.prefix ? `${attrs.prefix}/` : ''
      const fileExtension = attrs.suffix || github?.suffix || 'vue'
      const fileName = attrs.name || doc.title || ''
      const casing = attrs.casing || github?.casing || 'auto'

      const transformedName = (() => {
        switch (casing) {
          case 'kebab': return kebabCase(fileName)
          case 'camel': return camelCase(fileName)
          case 'pascal': return upperFirst(camelCase(fileName))
          case 'auto':
          default:
            return fileExtension === 'vue'
              ? upperFirst(camelCase(fileName))
              : camelCase(fileName)
        }
      })()

      const filePath = `${basePath}/${filePrefix}${transformedName}.${fileExtension}`
      const githubUrl = github?.url || ''

      try {
        const commits = await $fetch<Array<{ sha: string, message: string }>>('/api/github/commits', {
          query: { path: filePath, author: attrs.author }
        })

        if (!commits?.length) {
          node[0] = 'p'
          node[1] = {}
          node[2] = 'No recent changes.'
          node.length = 3
          return
        }

        const lines = commits.map((commit) => {
          const shortSha = commit.sha.slice(0, 5)
          const message = commit.message.replace(/\(.*?\)/, '').replace(/#(\d+)/g, `[#$1](${githubUrl}/issues/$1)`)
          return `- [\`${shortSha}\`](${githubUrl}/commit/${commit.sha}) — ${message}`
        })

        node[0] = 'p'
        node[1] = {}
        node[2] = lines.join('\n')
        node.length = 3
      } catch {
        node[0] = 'p'
        node[1] = {}
        node[2] = githubUrl
          ? `See the [releases page](${githubUrl}/releases) for the latest changes.`
          : 'No recent changes.'
        node.length = 3
      }
    }))
  }

  // Transform component-props, component-slots, component-emits to markdown tables
  const DEFAULT_IGNORE_PROPS = [
    'activeClass', 'inactiveClass', 'exactActiveClass', 'ariaCurrentValue',
    'href', 'rel', 'noRel', 'prefetch', 'prefetchOn', 'noPrefetch',
    'prefetchedClass', 'replace', 'exact', 'exactQuery', 'exactHash',
    'external', 'onClick', 'viewTransition', 'enterKeyHint',
    'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'
  ]

  const metaNodes: { node: any[], type: 'props' | 'slots' | 'emits' }[] = []
  for (const type of ['component-props', 'component-slots', 'component-emits'] as const) {
    visitAndReplace(doc, type, (node) => {
      metaNodes.push({ node, type: type.replace('component-', '') as 'props' | 'slots' | 'emits' })
    })
  }

  if (metaNodes.length) {
    await Promise.all(metaNodes.map(async ({ node, type }) => {
      const attrs = node[1] || {}
      const slug = attrs.slug || doc.title || ''
      const camelName = camelCase(slug)
      const componentName = type === 'props' && attrs.prose
        ? `Prose${upperFirst(camelName)}`
        : upperFirst(camelName)

      try {
        const meta = await $fetch<{ meta: { props?: any[], slots?: any[], events?: any[] } }>(`/api/component-meta/${componentName}.json`)

        let markdown = ''

        if (type === 'props') {
          const ignoreList = attrs.ignore ? String(attrs.ignore).split(',').map((s: string) => s.trim()) : DEFAULT_IGNORE_PROPS
          const props = (meta?.meta?.props || [])
            .filter((p: any) => !ignoreList.includes(p.name))
            .sort((a: any, b: any) => {
              if (a.name === 'as') return -1
              if (b.name === 'as') return 1
              if (a.name === 'ui') return 1
              if (b.name === 'ui') return -1
              return 0
            })

          if (props.length) {
            markdown = '| Prop | Default | Type |\n| --- | --- | --- |\n'
            markdown += props.map((p: any) => {
              const def = p.default?.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\'') || ''
              const desc = p.description ? ` - ${p.description}` : ''
              return `| \`${p.name}\` | \`${def || '-'}\` | \`${p.type || '-'}\`${desc} |`
            }).join('\n')
          } else {
            markdown = 'No props available.'
          }
        } else if (type === 'slots') {
          const slots = meta?.meta?.slots || []
          if (slots.length) {
            markdown = '| Slot | Type |\n| --- | --- |\n'
            markdown += slots.map((s: any) => {
              const desc = s.description ? ` - ${s.description}` : ''
              return `| \`${s.name}\` | \`${s.type || '-'}\`${desc} |`
            }).join('\n')
          } else {
            markdown = 'No slots available.'
          }
        } else {
          const events = meta?.meta?.events || []
          if (events.length) {
            markdown = '| Event | Type |\n| --- | --- |\n'
            markdown += events.map((e: any) => `| \`${e.name}\` | \`${e.type || '-'}\` |`).join('\n')
          } else {
            markdown = 'No events available.'
          }
        }

        node[0] = 'p'
        node[1] = {}
        node[2] = markdown
        node.length = 3
      } catch {
        node[0] = 'p'
        node[1] = {}
        node[2] = `Component metadata not available for \`${componentName}\`.`
        node.length = 3
      }
    }))
  }

  // Transform component-example to code block
  visitAndReplace(doc, 'component-example', (node) => {
    const camelName = camelCase(node[1]['name'])
    const name = camelName.charAt(0).toUpperCase() + camelName.slice(1)
    const code = components[name].code
    replaceNodeWithPre(node, 'vue', code, `${name}.vue`)
  })

  // Transform callout components (tip, note, warning, caution, callout) to blockquotes
  const calloutTypes = ['tip', 'note', 'warning', 'caution', 'callout']
  const calloutLabels: Record<string, string> = {
    tip: 'TIP',
    note: 'NOTE',
    warning: 'WARNING',
    caution: 'CAUTION',
    callout: 'NOTE'
  }

  for (const calloutType of calloutTypes) {
    visitAndReplace(doc, calloutType, (node) => {
      const attrs = node[1] || {}
      const content = node.slice(2)
      const label = calloutLabels[calloutType]

      // Build the blockquote content
      let blockquoteText = `> [!${label}]`

      // Add link if present
      if (attrs.to) {
        blockquoteText += `\n> See: ${attrs.to}`
      }

      // Extract text content from children
      const extractText = (children: any[]): string => {
        return children.map((child) => {
          if (typeof child === 'string') return child
          if (Array.isArray(child)) {
            const tag = child[0]
            const childAttrs = child[1] || {}
            const childContent = child.slice(2)
            if (tag === 'code') return `\`${extractText(childContent)}\``
            if (tag === 'a') return `[${extractText(childContent)}](${childAttrs.href || ''})`
            if (tag === 'pre') {
              const lang = childAttrs.language || ''
              const code = childAttrs.code || extractText(childContent)
              return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
            }
            return extractText(childContent)
          }
          return ''
        }).join('')
      }

      if (content.length > 0) {
        const textContent = extractText(content)
        if (textContent.trim()) {
          blockquoteText += `\n> ${textContent.trim().split('\n').join('\n> ')}`
        }
      }

      node[0] = 'p'
      node[1] = {}
      node[2] = blockquoteText
      node.length = 3
    })
  }

  // Transform framework-only - extract content from both slots and label them
  visitAndReplace(doc, 'framework-only', (node) => {
    const children = node.slice(2)
    let nuxtContent = ''
    let vueContent = ''

    // Helper to extract text from AST nodes
    const extractContent = (nodes: any[]): string => {
      return nodes.map((n: any) => {
        if (typeof n === 'string') return n
        if (Array.isArray(n)) {
          const tag = n[0]
          const attrs = n[1] || {}
          const content = n.slice(2)
          if (tag === 'pre') {
            const lang = attrs.language || ''
            const code = attrs.code || ''
            return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
          }
          return extractContent(content)
        }
        return ''
      }).join('')
    }

    for (const child of children) {
      if (Array.isArray(child) && child[0] === 'template') {
        const slotAttr = child[1]?.['v-slot:nuxt'] !== undefined
          ? 'nuxt'
          : child[1]?.['v-slot:vue'] !== undefined ? 'vue' : null
        if (slotAttr === 'nuxt') {
          nuxtContent = extractContent(child.slice(2))
        } else if (slotAttr === 'vue') {
          vueContent = extractContent(child.slice(2))
        }
      }
    }

    let output = ''
    if (nuxtContent.trim()) {
      output += '**Nuxt:**\n' + nuxtContent.trim()
    }
    if (vueContent.trim()) {
      if (output) output += '\n\n'
      output += '**Vue:**\n' + vueContent.trim()
    }

    node[0] = 'p'
    node[1] = {}
    node[2] = output || ''
    node.length = 3
  })

  // Transform badge to inline text
  visitAndReplace(doc, 'badge', (node) => {
    const attrs = node[1] || {}
    const label = attrs.label || ''
    node[0] = 'code'
    node[1] = {}
    node[2] = label
    node.length = 3
  })

  // Transform card components to markdown sections
  visitAndReplace(doc, 'card', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const title = attrs.title || ''

    // Extract text content from children
    const extractText = (children: any[]): string => {
      return children.map((child) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const tag = child[0]
          const childContent = child.slice(2)
          if (tag === 'code') return `\`${extractText(childContent)}\``
          if (tag === 'a') return `[${extractText(childContent)}](${child[1]?.href || ''})`
          return extractText(childContent)
        }
        return ''
      }).join('')
    }

    let cardText = title ? `**${title}**` : ''
    if (content.length > 0) {
      const textContent = extractText(content)
      if (textContent.trim()) {
        cardText += cardText ? `\n${textContent.trim()}` : textContent.trim()
      }
    }

    node[0] = 'p'
    node[1] = {}
    node[2] = cardText
    node.length = 3
  })

  // Transform accordion-item to Q&A format
  visitAndReplace(doc, 'accordion-item', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const label = attrs.label || ''

    // Extract text content from children
    const extractText = (children: any[]): string => {
      return children.map((child) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const tag = child[0]
          const childContent = child.slice(2)
          if (tag === 'code') return `\`${extractText(childContent)}\``
          if (tag === 'a') return `[${extractText(childContent)}](${child[1]?.href || ''})`
          if (tag === 'p') return extractText(childContent)
          return extractText(childContent)
        }
        return ''
      }).join('')
    }

    let itemText = label ? `**Q: ${label}**` : ''
    if (content.length > 0) {
      const textContent = extractText(content)
      if (textContent.trim()) {
        itemText += `\n\nA: ${textContent.trim()}`
      }
    }

    node[0] = 'p'
    node[1] = {}
    node[2] = itemText
    node.length = 3
  })

  // Remove wrapper elements by extracting children content
  const wrapperTypes = ['card-group', 'accordion', 'steps', 'code-group', 'code-collapse', 'tabs']
  for (const wrapperType of wrapperTypes) {
    visitAndReplace(doc, wrapperType, (node) => {
      const children = node.slice(2)

      // Extract text from transformed children (they should be paragraphs now)
      const extractFromChildren = (nodes: any[]): string => {
        return nodes.map((child: any) => {
          if (typeof child === 'string') return child
          if (Array.isArray(child)) {
            const tag = child[0]
            const attrs = child[1] || {}
            const content = child.slice(2)
            // Handle pre/code blocks
            if (tag === 'pre') {
              const lang = attrs.language || ''
              const code = attrs.code || ''
              return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
            }
            // Handle paragraphs and other text
            if (tag === 'p') {
              const text = content.map((c: any) => typeof c === 'string' ? c : '').join('')
              return text + '\n\n'
            }
            return extractFromChildren(content)
          }
          return ''
        }).join('')
      }

      const extracted = extractFromChildren(children).trim()
      node[0] = 'p'
      node[1] = {}
      node[2] = extracted
      node.length = 3
    })
  }

  // Transform field-group to remove wrapper (fields already handled)
  const fieldWrappers = ['field-group', 'collapsible']
  for (const wrapperType of fieldWrappers) {
    visitAndReplace(doc, wrapperType, (node) => {
      const children = node.slice(2)
      const extractFromChildren = (nodes: any[]): string => {
        return nodes.map((child: any) => {
          if (typeof child === 'string') return child
          if (Array.isArray(child)) {
            const tag = child[0]
            const attrs = child[1] || {}
            const content = child.slice(2)
            if (tag === 'pre') {
              const lang = attrs.language || ''
              const code = attrs.code || ''
              return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
            }
            if (tag === 'p') {
              const text = content.map((c: any) => typeof c === 'string' ? c : '').join('')
              return text + '\n\n'
            }
            return extractFromChildren(content)
          }
          return ''
        }).join('')
      }
      const extracted = extractFromChildren(children).trim()
      node[0] = 'p'
      node[1] = {}
      node[2] = extracted
      node.length = 3
    })
  }

  // Transform field to a definition format
  visitAndReplace(doc, 'field', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const name = attrs.name || ''
    const type = attrs.type || ''
    const required = attrs.required === 'true' || attrs[':required'] === 'true'

    const extractText = (nodes: any[]): string => {
      return nodes.map((child: any) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const content = child.slice(2)
          return extractText(content)
        }
        return ''
      }).join('')
    }

    let fieldText = `**${name}**`
    if (type) fieldText += ` (\`${type}\`)`
    if (required) fieldText += ' *required*'
    const desc = extractText(content).trim()
    if (desc) fieldText += `: ${desc}`

    node[0] = 'p'
    node[1] = {}
    node[2] = fieldText
    node.length = 3
  })

  // Transform code-preview to extract the Vue code as a code block
  visitAndReplace(doc, 'code-preview', (node) => {
    const children = node.slice(2)

    const extractVueCode = (nodes: any[]): string => {
      return nodes.map((child: any) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const tag = child[0]
          const attrs = child[1] || {}
          const content = child.slice(2)
          // Build the opening tag
          let tagStr = `<${tag}`
          for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith(':') || key.startsWith('v-')) {
              tagStr += ` ${key}=${val}`
            } else if (typeof val === 'string') {
              tagStr += ` ${key}=${val}`
            }
          }
          const innerContent = extractVueCode(content)
          if (innerContent.trim()) {
            tagStr += `>\n${innerContent}</${tag}>`
          } else {
            tagStr += ' />'
          }
          return tagStr
        }
        return ''
      }).join('\n')
    }

    const vueCode = extractVueCode(children).trim()
    node[0] = 'pre'
    node[1] = { language: 'vue', code: `<template>\n  ${vueCode.split('\n').join('\n  ')}\n</template>` }
    node.length = 2
  })

  // Transform icons-theme and icons-theme-select to placeholder
  visitAndReplace(doc, 'icons-theme', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = '*See the interactive theme picker on the documentation website.*'
    node.length = 3
  })

  visitAndReplace(doc, 'icons-theme-select', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = ''
    node.length = 3
  })

  // Transform supported-languages to placeholder
  visitAndReplace(doc, 'supported-languages', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = '*See the full list of supported languages on the documentation website.*'
    node.length = 3
  })

  // Transform u-button to markdown link
  visitAndReplace(doc, 'u-button', (node) => {
    const attrs = node[1] || {}
    const label = attrs.label || ''
    const to = attrs.to || ''
    node[0] = 'p'
    node[1] = {}
    node[2] = to ? `[${label}](${to})` : label
    node.length = 3
  })

  return doc
}
