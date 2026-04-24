type MinimarkAttributeValue = unknown

type MinimarkAttributes = Record<string, MinimarkAttributeValue>

/**
 * Minimark-like AST 节点。
 *
 * 字符串节点表示文本内容，元组节点使用 `[tag, attributes, ...children]`
 * 结构表示元素。
 */
export type MinimarkNode = string | [tag: string, attributes: MinimarkAttributes, ...children: MinimarkNode[]]

/**
 * 包含根节点列表的 Minimark-like 文档主体。
 */
export interface MinimarkDocument {
  value: MinimarkNode[]
}

interface State {
  context: 'block' | 'inline' | 'table'
  listDepth: number
}

const BLOCK_SEP = '\n\n'
const HEADING_TAG_RE = /^h([1-6])$/

const SELF_CLOSE_TAGS = new Set(['br', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const INLINE_TAGS = new Set(['strong', 'em', 'code', 'a', 'br', 'span', 'img', 'b', 'i', 's', 'del', 'sub', 'sup', 'mark', 'abbr', 'kbd'])

function createState(context: State['context'] = 'block', listDepth = 0): State {
  return { context, listDepth }
}

function withContext(state: State, context: State['context']): State {
  return { ...state, context }
}

function escapeHtmlAttr(value: unknown): string {
  return stringifyAttributeValue(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function stringifyAttributeValue(value: unknown): string {
  if (typeof value === 'string')
    return value
  if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean')
    return String(value)
  return JSON.stringify(value) ?? String(value)
}

function htmlAttributes(attributes: MinimarkAttributes): string {
  return Object.entries(attributes)
    .flatMap(([key, value]) => {
      if (value === false || value === null || value === undefined)
        return []
      if (value === true)
        return [key]
      return [`${key}="${escapeHtmlAttr(value)}"`]
    })
    .join(' ')
}

function escapeMarkdownText(text: string, context: State['context']): string {
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/!/g, '\\!')

  if (context === 'table') {
    return escaped.split('\n').join(' ').replace(/\|/g, '\\|')
  }

  return escaped
    .replace(/^([ \t]*)(#{1,6})(?=\s)/gm, '$1\\$2')
    .replace(/^([ \t]*)(>)/gm, '$1\\$2')
    .replace(/^([ \t]*)([-+*])(?=\s)/gm, '$1\\$2')
    .replace(/^([ \t]*)(\d+)\.(?=\s)/gm, '$1$2\\.')
    .replace(/^([ \t]*)(---|\*\*\*|___)([ \t]*)$/gm, '$1\\$2$3')
}

function escapeLinkText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

function escapeLinkDestination(value: unknown): string {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/\)/g, '\\)')
}

function escapeTitle(value: unknown): string {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function escapeMdcAttribute(value: unknown): string {
  return stringifyAttributeValue(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function inlineCode(content: string): string {
  const matches = content.match(/`+/g) || []
  const max = Math.max(0, ...matches.map(match => match.length))
  const fence = '`'.repeat(max + 1)
  const needsPadding = content.startsWith('`') || content.endsWith('`')
  const body = needsPadding ? ` ${content} ` : content
  return `${fence}${body}${fence}`
}

function flow(children: MinimarkNode[], state: State): string {
  return children.map(child => stringify(child, state)).join('')
}

function rawText(children: MinimarkNode[]): string {
  return children.map((child) => {
    if (typeof child === 'string')
      return child

    const [, , ...nestedChildren] = child
    return rawText(nestedChildren)
  }).join('')
}

function indent(text: string, level: number): string {
  const prefix = '  '.repeat(level)
  return text.split('\n').map((line, index) => index === 0 ? line : (line ? prefix + line : line)).join('\n')
}

function toHtml(state: State, tag: string, attrs: MinimarkAttributes, children: MinimarkNode[]): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${htmlAttributes(attrs)}`.trimEnd() : ''

  if (SELF_CLOSE_TAGS.has(tag)) {
    return `<${tag}${attrStr} />`
  }

  const hasOnlyInline = children.every(child => typeof child === 'string' || INLINE_TAGS.has(String((child as MinimarkNode[])[0])))
  const content = children.map(child => stringify(child, state)).join('')

  if (hasOnlyInline) {
    return `<${tag}${attrStr}>${content}</${tag}>`
  }

  return `<${tag}${attrStr}>\n${content.trim()}\n</${tag}>`
}

function formatHighlights(highlights: number[]): string {
  if (highlights.length === 0)
    return ''

  const sorted = [...highlights].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]!
  let end = sorted[0]!

  for (let index = 1; index <= sorted.length; index++) {
    if (index < sorted.length && sorted[index] === end + 1) {
      end = sorted[index]!
      continue
    }

    ranges.push(start === end ? String(start) : `${start}-${end}`)
    if (index < sorted.length) {
      start = sorted[index]!
      end = sorted[index]!
    }
  }

  return ranges.join(',')
}

function stringifyLi(node: MinimarkNode, state: State, ordered: boolean, index: number): string {
  if (typeof node === 'string')
    return escapeMarkdownText(node, state.context)

  const [, attrs, ...children] = node
  const className = Array.isArray(attrs?.className)
    ? attrs.className.join(' ')
    : String(attrs?.className || attrs?.class || '')

  let prefix = ordered ? `${index}. ` : '- '
  let itemChildren = children

  if (className.includes('task-list-item') && children.length > 0) {
    const first = children[0]
    if (Array.isArray(first) && first[0] === 'input') {
      const checked = first[1]?.checked || first[1]?.[':checked']
      prefix += checked ? '[x] ' : '[ ] '
      itemChildren = children.slice(1)
    }
  }

  const content = flow(itemChildren, withContext(state, 'inline')).trim()
  return `${prefix}${indent(content, prefix.length / 2)}\n`
}

function getAlignment(attributes: MinimarkAttributes): 'left' | 'center' | 'right' | null {
  const style = attributes?.style
  if (typeof style !== 'string')
    return null

  const normalized = style.toLowerCase().replace(/\s/g, '')
  if (normalized.includes('text-align:left'))
    return 'left'
  if (normalized.includes('text-align:center'))
    return 'center'
  if (normalized.includes('text-align:right'))
    return 'right'
  return null
}

function getRows(element: MinimarkNode): MinimarkNode[] {
  if (typeof element === 'string')
    return []

  const [tag, , ...children] = element
  if (tag === 'tr')
    return [element]
  if (tag === 'thead' || tag === 'tbody') {
    return children.filter(child => typeof child !== 'string' && child[0] === 'tr')
  }

  return []
}

function getCells(row: MinimarkNode): MinimarkNode[] {
  if (typeof row === 'string')
    return []

  const [, , ...children] = row
  return children.filter(child => typeof child !== 'string' && (child[0] === 'th' || child[0] === 'td'))
}

function getCellContent(cell: MinimarkNode, state: State): string {
  if (typeof cell === 'string')
    return escapeMarkdownText(cell, 'table')

  const [, , ...children] = cell
  return children.map(child => stringify(child, withContext(state, 'table'))).join('').trim()
}

function stringifyTable(children: MinimarkNode[], state: State): string {
  let headerRows: MinimarkNode[] = []
  const bodyRows: MinimarkNode[] = []

  for (const child of children) {
    if (typeof child === 'string')
      continue

    const [tag] = child
    if (tag === 'thead') {
      headerRows = getRows(child)
    } else if (tag === 'tbody') {
      bodyRows.push(...getRows(child))
    } else if (tag === 'tr') {
      const cells = getCells(child)
      if (cells.length > 0 && Array.isArray(cells[0]) && cells[0][0] === 'th')
        headerRows.push(child)
      else bodyRows.push(child)
    }
  }

  if (headerRows.length === 0 && bodyRows.length > 0) {
    const firstRow = bodyRows[0]!
    const cellCount = getCells(firstRow).length
    headerRows = [['tr', {}, ...Array.from({ length: cellCount }, (_, index): MinimarkNode => ['th', {}, `Column ${index + 1}`])]]
  }

  if (headerRows.length === 0)
    return ''

  const headerRow = headerRows[0]!
  const headerCells = getCells(headerRow)
  const headerContent = headerCells.map(cell => getCellContent(cell, state))
  const alignments = headerCells.map(cell => typeof cell !== 'string' ? getAlignment(cell[1] || {}) : null)
  const colWidths = headerContent.map(content => Math.max(3, content.length))

  for (const row of bodyRows) {
    getCells(row).forEach((cell, index) => {
      if (index < colWidths.length) {
        colWidths[index] = Math.max(colWidths[index]!, getCellContent(cell, state).length)
      }
    })
  }

  let result = `| ${headerContent.map((content, index) => content.padEnd(colWidths[index]!)).join(' | ')} |\n`
  result += `| ${colWidths.map((width, index) => {
    const alignment = alignments[index]
    if (alignment === 'left')
      return `:${'-'.repeat(width - 1)}`
    if (alignment === 'center')
      return `:${'-'.repeat(Math.max(1, width - 2))}:`
    if (alignment === 'right')
      return `${'-'.repeat(width - 1)}:`
    return '-'.repeat(width)
  }).join(' | ')} |\n`

  for (const row of bodyRows) {
    const cellContents = getCells(row).map((cell, index) => getCellContent(cell, state).padEnd(colWidths[index] || 0))
    while (cellContents.length < colWidths.length) cellContents.push(''.padEnd(colWidths[cellContents.length]!))
    result += `| ${cellContents.join(' | ')} |\n`
  }

  return `${result}\n`
}

function stringify(node: MinimarkNode, state: State): string {
  if (typeof node === 'string')
    return escapeMarkdownText(node, state.context)

  const [tag, attrs = {}, ...children] = node
  const headingMatch = HEADING_TAG_RE.exec(tag)

  if (headingMatch) {
    const level = Number(headingMatch[1])
    return `${'#'.repeat(level)} ${flow(children, withContext(state, 'inline'))}${BLOCK_SEP}`
  }

  switch (tag) {
    case 'p':
      return `${flow(children, withContext(state, 'inline'))}${BLOCK_SEP}`

    case 'blockquote':
      return `${flow(children, state).trim().split('\n').map(line => `> ${line}`).join('\n')}${BLOCK_SEP}`

    case 'pre': {
      const lang = attrs.language || ''
      const code = attrs.code ?? flow(children, state)
      const filename = attrs.filename ? ` [${String(attrs.filename).replace(/\]/g, '\\]')}]` : ''
      const highlights = Array.isArray(attrs.highlights) ? ` {${formatHighlights(attrs.highlights)}}` : ''
      const meta = attrs.meta ? ` ${String(attrs.meta)}` : ''
      return `\`\`\`${lang}${filename}${highlights}${meta}\n${String(code).trim()}\n\`\`\`${BLOCK_SEP}`
    }

    case 'code':
      return inlineCode(rawText(children))

    case 'strong':
    case 'b':
      return `**${flow(children, withContext(state, 'inline'))}**`

    case 'em':
    case 'i':
      return `*${flow(children, withContext(state, 'inline'))}*`

    case 'del':
    case 's':
      return `~~${flow(children, withContext(state, 'inline'))}~~`

    case 'a': {
      const { href, ...rest } = attrs
      const attrsStr = Object.keys(rest).length > 0
        ? `{${Object.entries(rest)
          .flatMap(([key, value]) => value === false || value === null || value === undefined ? [] : [`${key}="${escapeMdcAttribute(value)}"`])
          .join(' ')}}`
        : ''
      return `[${escapeLinkText(flow(children, withContext(state, 'inline')))}](${escapeLinkDestination(href)})${attrsStr}`
    }

    case 'img': {
      const { src, alt, title } = attrs
      const altText = escapeLinkText(String(alt || ''))
      const destination = escapeLinkDestination(src)
      return title
        ? `![${altText}](${destination} "${escapeTitle(title)}")`
        : `![${altText}](${destination})`
    }

    case 'br':
      return '  \n'

    case 'hr':
      return `---${BLOCK_SEP}`

    case 'ul': {
      const childState = { ...state, listDepth: state.listDepth + 1 }
      const result = children.map(child => stringifyLi(child, childState, false, 0)).join('')
      return state.listDepth > 0
        ? `\n${result}`
        : `${result}\n`
    }

    case 'ol': {
      const childState = { ...state, listDepth: state.listDepth + 1 }
      const result = children.map((child, index) => stringifyLi(child, childState, true, index + 1)).join('')
      return state.listDepth > 0
        ? `\n${result}`
        : `${result}\n`
    }

    case 'li':
      return stringifyLi(node, state, false, 0)

    case 'table':
      return stringifyTable(children, state)

    case 'style':
      return ''

    case 'template': {
      const name = attrs.name || 'default'
      const content = flow(children, state).trim()
      return `#${name}\n${content}${BLOCK_SEP}`
    }

    default:
      return toHtml(state, tag, attrs, children)
  }
}

/**
 * 将 Minimark-like AST 子集序列化为 Markdown。
 *
 * 支持的节点会输出 Markdown，不支持的标签会回退为 HTML。
 * 该函数不是 `minimark.stringify()` 的字节级等价替代。
 *
 * @param body - 要序列化的 Minimark-like 文档主体。
 * @returns 带 HTML fallback 的 Markdown，并以单个换行结尾。
 *
 * @example
 * ```ts
 * stringifyMinimark({
 *   value: [
 *     ['h1', {}, 'Title'],
 *     ['p', {}, 'Hello ', ['strong', {}, 'world']],
 *   ],
 * })
 * // "# Title\n\nHello **world**\n"
 * ```
 */
export function stringifyMinimark(body: MinimarkDocument): string {
  const state = createState()
  const lastIndex = body.value.length - 1

  return `${body.value.map((child, index) => {
    if (index === lastIndex && Array.isArray(child) && child[0] === 'style')
      return ''
    return stringify(child, state)
  }).join('').trim()}\n`
}
