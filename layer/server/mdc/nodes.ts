import { visit } from '@nuxt/content/runtime'

export type Document = {
  title: string
  path?: string
  body: any
}

export type MDCAttributes = Record<string, unknown>

export const parseBoolean = (value?: unknown): boolean => value === true || value === '' || value === 'true'

export function getBooleanAttribute(attrs: MDCAttributes, key: string): boolean {
  return parseBoolean(attrs[key]) || parseBoolean(attrs[`:${key}`])
}

export function replaceNodeWithPre(node: any[], language: string, code: string, filename?: string) {
  node[0] = 'pre'
  node[1] = { language, code }
  if (filename) node[1].filename = filename
  // stringifier 只读取 code，原插槽内容对后续遍历只是负担
  node.length = 2
}

// 把 JSON 值写成单引号的 JS 字面量，保证能放进双引号的 Vue 属性里
export function toJsLiteral(value: unknown): string {
  return JSON.stringify(value)
    .replace(/"((?:[^"\\]|\\.)*)"/g, (_, text: string) => `'${text.replace(/\\"/g, '"').replace(/'/g, '\\\'')}'`)
    .replace(/'([A-Z_$][\w$]*)':/gi, '$1: ')
}

// 模板片段中的 Vue 属性：绑定属性以 `:key` 形式携带 JSON 字符串，还原为对象字面量
export function templateAttribute(key: string, value: unknown): string {
  const quote = (text: string) => `"${text.replace(/"/g, '&quot;')}"`

  if (key === 'className') {
    return `class=${quote((Array.isArray(value) ? value : [value]).join(' '))}`
  }
  if (typeof value === 'string') {
    if (key.startsWith(':')) {
      try {
        return `${key}=${quote(toJsLiteral(JSON.parse(value)))}`
      } catch {
        // 不是 JSON，而是绑定表达式，按原样输出
      }
    }
    return `${key}=${quote(value)}`
  }
  if (typeof value === 'object') {
    return `:${key}=${quote(toJsLiteral(value))}`
  }
  return `:${key}="${value}"`
}

// 承载现成 Markdown 的段落：stringifier 原样写出字符串子节点，
// 没有 handler 的块级结构借此输出
export function replaceNodeWithMarkdown(node: any[], markdown: string) {
  node[0] = 'p'
  node[1] = {}
  node[2] = markdown
  node.length = 3
}

export function containsNode(nodes: any[], tag: string): boolean {
  return nodes.some(child => Array.isArray(child) && (child[0] === tag || containsNode(child.slice(2), tag)))
}

// 没有 `#code` 插槽的预览是用 MDC 写的组件演示，最接近源码的形式是把语法树还原为模板
export function templateSnippet(nodes: any[]): string {
  return nodes.map((child) => {
    if (typeof child === 'string') return child
    if (!Array.isArray(child)) return ''

    const [tag, attrs = {}, ...content] = child
    const attributes = Object.entries(attrs)
      .filter(([key, value]) => key !== 'style' && value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => templateAttribute(key, value))
    const open = `<${tag}${attributes.length ? ` ${attributes.join(' ')}` : ''}`
    const inner = templateSnippet(content).trim()

    return inner ? `${open}>\n  ${inner.split('\n').join('\n  ')}\n</${tag}>` : `${open} />`
  }).filter(Boolean).join('\n')
}

export function parseAttrAsObject<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value !== 'string') return value as T
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function readMdcAttr(attrs: MDCAttributes, key: string): unknown {
  return attrs[`:${key}`] ?? attrs[key]
}

export function visitAndReplace(doc: Document, type: string, handler: (node: any[]) => void) {
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === type) {
      handler(node)
    }
    return true
  }, node => node)
}

export const BLOCK_ELEMENTS = new Set([
  'pre', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'table', 'hr'
])

export function collectBlockChildren(nodes: any[]): any[] {
  const result: any[] = []
  for (const child of nodes) {
    if (typeof child === 'string') {
      if (child.trim()) {
        result.push(['p', {}, child])
      }
    } else if (Array.isArray(child)) {
      if (BLOCK_ELEMENTS.has(child[0])) {
        result.push(child)
      } else {
        result.push(...collectBlockChildren(child.slice(2)))
      }
    }
  }
  return result
}

export function replaceWithChildren(node: any[], newChildren: any[]) {
  const collected = collectBlockChildren(newChildren)
  node[0] = '__flatten'
  node[1] = {}
  node.length = 2
  for (const child of collected) {
    node.push(child)
  }
}

// 普通节点 `[tag, attrs, ...children]` 从下标 2 开始，根 children 数组从 0 开始
export function flattenMarkers(node: any, start = 2): void {
  if (!Array.isArray(node)) return
  let i = start
  while (i < node.length) {
    const child = node[i]
    if (Array.isArray(child) && (child[0] === '__flatten' || child[0] === 'div')) {
      const innerChildren = child.slice(2)
      node.splice(i, 1, ...innerChildren)
    } else {
      flattenMarkers(child)
      i++
    }
  }
}

// 根层级处于块级上下文：只含纯文本的组件会被 stringifier 写成行内语法并与下一块粘连，
// 把文本包进段落使其按块输出
export function wrapBlockText(nodes: any[]): void {
  for (const node of nodes) {
    if (!Array.isArray(node) || BLOCK_ELEMENTS.has(node[0])) continue
    const children = node.slice(2)
    if (children.length && children.every(child => typeof child === 'string')) {
      node.splice(2, children.length, ['p', {}, children.join('')])
    }
  }
}
