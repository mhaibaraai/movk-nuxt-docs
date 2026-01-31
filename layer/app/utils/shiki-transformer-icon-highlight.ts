import type { ShikiTransformer } from 'shiki'
import type { Element } from 'hast'

export interface TransformerIconHighlightOptions {
  /**
   * Custom function to create icon HAST element
   * @default Uses Iconify API with mask mode
   */
  createIconElement?: (icon: string, iconUrl: string) => Element
}

// Common icon collections to validate against (sorted by length descending for proper matching)
const ICON_COLLECTIONS = [
  'simple-icons',
  'vscode-icons',
  'tabler',
  'lucide',
  'logos',
  'ph'
]

function parseIconName(text: string): { collection: string, name: string, format: 'i' | 'colon' } | null {
  // Strip quotes if present (single, double, or backticks)
  let cleanText = text
  if (/^['"`].*['"`]$/.test(text)) {
    cleanText = text.slice(1, -1)
  }

  // Try i-{collection}-{name} format
  if (cleanText.startsWith('i-')) {
    const rest = cleanText.slice(2)
    for (const collection of ICON_COLLECTIONS) {
      if (rest.startsWith(`${collection}-`)) {
        const name = rest.slice(collection.length + 1)
        if (name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(name)) {
          return { collection, name, format: 'i' }
        }
      }
    }
  }

  // Try {collection}:{name} format
  const colonIndex = cleanText.indexOf(':')
  if (colonIndex > 0) {
    const collection = cleanText.slice(0, colonIndex)
    const name = cleanText.slice(colonIndex + 1)
    if (ICON_COLLECTIONS.includes(collection) && name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(name)) {
      return { collection, name, format: 'colon' }
    }
  }

  return null
}

export function transformerIconHighlight(options: TransformerIconHighlightOptions = {}): ShikiTransformer {
  const { createIconElement } = options

  return {
    name: 'shiki-transformer-icon-highlight',
    span(hast, _line, _col, _lineElement, token) {
      const text = token.content

      const parsed = parseIconName(text)
      if (!parsed) return

      const iconIdentifier = `${parsed.collection}:${parsed.name}`
      const iconUrl = `https://api.iconify.design/${iconIdentifier}.svg?color=%23000`

      const iconElement: Element = createIconElement
        ? createIconElement(iconIdentifier, iconUrl)
        : {
            type: 'element',
            tagName: 'i',
            properties: {
              class: 'shiki-icon-highlight',
              style: `--shiki-icon-url: url(${iconUrl})`
            },
            children: []
          }

      if (Array.isArray(hast.children)) {
        hast.children.unshift(iconElement)
      }
    }
  }
}
