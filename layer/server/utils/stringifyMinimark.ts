type MinimarkNode = string | [string, Record<string, any>, ...MinimarkNode[]]

const BLOCK_SEP = '\n\n'

const SELF_CLOSE_TAGS = new Set(['br', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const INLINE_TAGS = new Set(['strong', 'em', 'code', 'a', 'br', 'span', 'img', 'b', 'i', 's', 'del', 'sub', 'sup', 'mark', 'abbr', 'kbd'])

// --- HTML attribute serialization ---

function htmlAttributes(attributes: Record<string, any>): string {
  return Object.entries(attributes).map(([key, value]) => {
    if (typeof value === 'object') return `${key}="${JSON.stringify(value).replace(/"/g, '\\"')}"`
    return `${key}="${value}"`
  }).join(' ')
}

// --- HTML fallback for unknown tags ---

function toHtml(_node: MinimarkNode[], state: State, tag: string, attrs: Record<string, any>, children: MinimarkNode[]): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${htmlAttributes(attrs)}` : ''

  if (SELF_CLOSE_TAGS.has(tag)) {
    return `<${tag}${attrStr} />`
  }

  const hasOnlyInline = children.every(c => typeof c === 'string' || INLINE_TAGS.has(String((c as any[])[0])))
  const content = children.map(c => stringify(c, state)).join('')

  if (hasOnlyInline) {
    return `<${tag}${attrStr}>${content}</${tag}>`
  }

  return `<${tag}${attrStr}>\n${content}\n</${tag}>`
}

// --- Escape helpers ---

function escapePipes(text: string): string {
  return text.split('\n').join(' ').split('|').join('\\|')
}

function escapeLeadingNumberDot(str: string): string {
  const match = /^(\d+)\./.exec(str)
  if (match) return `${match[1]}\\.${str.slice(match[0].length)}`
  return str
}

// --- State ---

interface State {
  listDepth: number
  olIndex: number
}

function createState(): State {
  return { listDepth: 0, olIndex: 0 }
}

// --- Inline helpers ---

function flow(children: MinimarkNode[], state: State): string {
  return children.map(c => stringify(c, state)).join('')
}

function indent(text: string, level: number): string {
  const prefix = '  '.repeat(level)
  return text.split('\n').map((line, i) => i === 0 ? line : (line ? prefix + line : line)).join('\n')
}

// --- Node handlers ---

function stringify(node: MinimarkNode, state: State): string {
  if (typeof node === 'string') return node

  const [tag, attrs, ...children] = node

  // Headings
  const headingMatch = /^h([1-6])$/.exec(tag)
  if (headingMatch) {
    const level = Number(headingMatch[1])
    return `${'#'.repeat(level)} ${flow(children, state)}${BLOCK_SEP}`
  }

  switch (tag) {
    case 'p':
      return `${flow(children, state)}${BLOCK_SEP}`

    case 'blockquote':
      return `${flow(children, state).trim().split('\n').map(l => `> ${l}`).join('\n')}${BLOCK_SEP}`

    case 'pre': {
      const lang = attrs?.language || ''
      const code = attrs?.code ?? flow(children, state)
      const filename = attrs?.filename ? ` [${String(attrs.filename).replace(/\]/g, '\\]')}]` : ''
      const highlights = Array.isArray(attrs?.highlights) ? ` {${formatHighlights(attrs.highlights)}}` : ''
      const meta = attrs?.meta ? ` ${attrs.meta}` : ''
      return `\`\`\`${lang}${filename}${highlights}${meta}\n${String(code).trim()}\n\`\`\`${BLOCK_SEP}`
    }

    case 'code': {
      const content = flow(children, state)
      const fence = content.includes('`') ? '``' : '`'
      return `${fence}${content}${fence}`
    }

    case 'strong':
    case 'b':
      return `**${flow(children, state).trim()}**`

    case 'em':
    case 'i':
      return `*${flow(children, state).trim()}*`

    case 'del':
    case 's':
      return `~~${flow(children, state).trim()}~~`

    case 'a': {
      const { href, ...rest } = attrs || {}
      const attrsStr = Object.keys(rest).length > 0 ? `{${Object.entries(rest).map(([k, v]) => `${k}="${v}"`).join(' ')}}` : ''
      return `[${flow(children, state)}](${href || ''})${attrsStr}`
    }

    case 'img': {
      const { src, alt, title } = attrs || {}
      return title
        ? `![${alt || ''}](${src || ''} "${title}")`
        : `![${alt || ''}](${src || ''})`
    }

    case 'br':
      return '  \n'

    case 'hr':
      return `---${BLOCK_SEP}`

    case 'ul': {
      const prevDepth = state.listDepth
      const childState = { ...state, listDepth: state.listDepth + 1 }
      let result = children.map(c => stringifyLi(c, childState, false, 0)).join('')
      if (prevDepth > 0) {
        result = '\n' + result.split('\n').map(l => l ? '  ' + l : l).join('\n')
      } else {
        result = result + '\n'
      }
      state.listDepth = prevDepth
      return result
    }

    case 'ol': {
      const prevDepth = state.listDepth
      const childState = { ...state, listDepth: state.listDepth + 1 }
      let idx = 1
      let result = children.map((c) => {
        const r = stringifyLi(c, childState, true, idx)
        idx++
        return r
      }).join('')
      if (prevDepth > 0) {
        result = '\n' + result.split('\n').map(l => l ? '  ' + l : l).join('\n')
      } else {
        result = result + '\n'
      }
      state.listDepth = prevDepth
      return result
    }

    case 'li':
      return stringifyLi(node, state, false, 0)

    case 'table':
      return stringifyTable(children, state)

    // Strip style elements (typically last child in document)
    case 'style':
      return ''

    // Slot templates
    case 'template': {
      const name = attrs?.name || 'default'
      const content = flow(children, state).trim()
      return `#${name}\n${content}${BLOCK_SEP}`
    }

    default:
      return toHtml(node as any, state, tag, attrs, children)
  }
}

// --- List item ---

function stringifyLi(node: MinimarkNode, state: State, ordered: boolean, index: number): string {
  if (typeof node === 'string') return node

  const [, attrs, ...children] = node
  const className = Array.isArray(attrs?.className)
    ? attrs.className.join(' ')
    : String(attrs?.className || attrs?.class || '')

  let prefix = ordered ? `${index}. ` : '- '

  // Task list support
  if (className.includes('task-list-item') && children.length > 0) {
    const first = children[0]
    if (Array.isArray(first) && first[0] === 'input') {
      const checked = first[1]?.checked || first[1]?.[':checked']
      prefix += checked ? '[x] ' : '[ ] '
      children.shift()
    }
  }

  let content = flow(children, state).trim()
  if (!ordered) content = escapeLeadingNumberDot(content)

  return `${prefix}${indent(content, prefix.length / 2)}\n`
}

// --- Table ---

function getAlignment(attributes: Record<string, any>): 'left' | 'center' | 'right' | null {
  const style = attributes?.style
  if (typeof style !== 'string') return null
  const normalized = style.toLowerCase().replace(/\s/g, '')
  if (normalized.includes('text-align:left')) return 'left'
  if (normalized.includes('text-align:center')) return 'center'
  if (normalized.includes('text-align:right')) return 'right'
  return null
}

function getCellContent(cell: MinimarkNode, state: State): string {
  if (typeof cell === 'string') return escapePipes(cell)
  const [, , ...children] = cell
  return escapePipes(children.map(c => stringify(c, state)).join('').trim())
}

function getRows(element: MinimarkNode): MinimarkNode[] {
  if (typeof element === 'string') return []
  const [tag, , ...children] = element
  if (tag === 'tr') return [element]
  if (tag === 'thead' || tag === 'tbody') return children.filter(c => typeof c !== 'string' && (c as any[])[0] === 'tr')
  return []
}

function getCells(row: MinimarkNode): MinimarkNode[] {
  if (typeof row === 'string') return []
  const [, , ...children] = row
  return children.filter(c => typeof c !== 'string' && ((c as any[])[0] === 'th' || (c as any[])[0] === 'td'))
}

function stringifyTable(children: MinimarkNode[], state: State): string {
  let headerRows: MinimarkNode[] = []
  let bodyRows: MinimarkNode[] = []

  for (const child of children) {
    if (typeof child === 'string') continue
    const [tag] = child
    if (tag === 'thead') headerRows = getRows(child)
    else if (tag === 'tbody') bodyRows = getRows(child)
    else if (tag === 'tr') {
      const cells = getCells(child)
      if (cells.length > 0 && (cells[0] as any[])[0] === 'th') headerRows.push(child)
      else bodyRows.push(child)
    }
  }

  // Auto-generate header if missing
  if (headerRows.length === 0 && bodyRows.length > 0) {
    const firstRow = bodyRows[0]!
    const cellCount = getCells(firstRow).length
    headerRows = [['tr', {}, ...Array.from({ length: cellCount }, (_, i) => ['th', {}, `Column ${i + 1}`])] as any]
  }

  if (headerRows.length === 0) return ''

  const headerRow = headerRows[0]!
  const headerCells = getCells(headerRow)
  const headerContent = headerCells.map(c => getCellContent(c, state))
  const alignments = headerCells.map(c => typeof c !== 'string' ? getAlignment((c as any[])[1] || {}) : null)

  // Calculate column widths
  const colWidths = headerContent.map(c => Math.max(3, c.length))
  for (const row of bodyRows) {
    getCells(row).forEach((cell, i) => {
      if (i < colWidths.length) {
        colWidths[i] = Math.max(colWidths[i]!, getCellContent(cell, state).length)
      }
    })
  }

  // Build header
  let result = '| ' + headerContent.map((c, i) => c.padEnd(colWidths[i]!)).join(' | ') + ' |\n'

  // Build separator with alignment
  result += '| ' + colWidths.map((w, i) => {
    const a = alignments[i]
    if (a === 'left') return ':' + '-'.repeat(w - 1)
    if (a === 'center') return ':' + '-'.repeat(w - 2) + ':'
    if (a === 'right') return '-'.repeat(w - 1) + ':'
    return '-'.repeat(w)
  }).join(' | ') + ' |\n'

  // Build body rows
  for (const row of bodyRows) {
    const cellContents = getCells(row).map((cell, i) => getCellContent(cell, state).padEnd(colWidths[i] || 0))
    while (cellContents.length < colWidths.length) cellContents.push(''.padEnd(colWidths[cellContents.length]!))
    result += '| ' + cellContents.join(' | ') + ' |\n'
  }

  return result + '\n'
}

// --- Highlight ranges ---

function formatHighlights(highlights: number[]): string {
  if (highlights.length === 0) return ''
  const sorted = [...highlights].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]!
  let end = sorted[0]!
  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === end + 1) {
      end = sorted[i]!
    } else {
      ranges.push(start === end ? String(start) : `${start}-${end}`)
      if (i < sorted.length) {
        start = sorted[i]!
        end = sorted[i]!
      }
    }
  }
  return ranges.join(',')
}

// --- Entry point ---

export function stringifyMinimark(body: { value: MinimarkNode[] }): string {
  const state = createState()
  const lastIndex = body.value.length - 1

  return body.value.map((child, index) => {
    // Strip trailing style elements
    if (index === lastIndex && Array.isArray(child) && child[0] === 'style') return ''
    return stringify(child, state)
  }).join('').trim() + '\n'
}
