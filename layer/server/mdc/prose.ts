import type { H3Event } from 'h3'
import { visit } from '@nuxt/content/runtime'
import { textContent } from 'minimark'
import { queryCollection } from '@nuxt/content/server'
import { rawUrl } from '#agent-discovery'
import { fencedBlock, pipeTable } from '../utils/markdown'
import type { Document } from './nodes'
import { collectBlockChildren, containsNode, replaceNodeWithMarkdown, replaceNodeWithPre, replaceWithChildren, templateSnippet, visitAndReplace } from './nodes'

// useKbd 渲染为符号或按平台区分的按键，给出可读名称；字母、数字、`/` 等保持原样
const KBD_LABELS: Record<string, string> = {
  meta: 'Meta',
  cmd: 'Cmd',
  command: 'Cmd',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: 'Option',
  win: 'Win',
  shift: 'Shift',
  enter: 'Enter',
  escape: 'Esc',
  backspace: 'Backspace',
  delete: 'Delete',
  tab: 'Tab',
  space: 'Space',
  capslock: 'CapsLock',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  home: 'Home',
  end: 'End',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→'
}

// 在 Markdown 中没有意义的行内组件
const DROPPED_INLINE = new Set(['icon', 'u-icon', 'prose-icon', 'u-color-mode-select'])

/** Nuxt UI 等通用 MDC 组件转为纯 Markdown，需在其他转换之后执行（pre 依赖前面生成的代码块） */
export async function transformProse(event: H3Event, doc: Document): Promise<void> {
  // Transform framework-only - extract content from both slots and label them
  visitAndReplace(doc, 'framework-only', (node) => {
    const children = node.slice(2)
    const allChildren: any[] = []

    for (const child of children) {
      if (Array.isArray(child) && child[0] === 'template') {
        const slotAttr = child[1]?.['v-slot:nuxt'] !== undefined
          ? 'nuxt'
          : child[1]?.['v-slot:vue'] !== undefined ? 'vue' : null
        if (slotAttr === 'nuxt') {
          allChildren.push(['p', {}, ['strong', {}, 'Nuxt:']])
          allChildren.push(...collectBlockChildren(child.slice(2)))
        } else if (slotAttr === 'vue') {
          allChildren.push(['p', {}, ['strong', {}, 'Vue:']])
          allChildren.push(...collectBlockChildren(child.slice(2)))
        }
      }
    }

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
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

    const allChildren: any[] = []
    if (title) {
      // strong 序列化后只剩文本，链接需要包在外层
      const heading = ['strong', {}, title]
      allChildren.push(['p', {}, attrs.to ? ['a', { href: attrs.to }, heading] : heading])
    }
    allChildren.push(...collectBlockChildren(content))

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
  })

  // Transform accordion-item to Q&A format
  visitAndReplace(doc, 'accordion-item', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const label = attrs.label || ''

    const allChildren: any[] = []
    if (label) {
      allChildren.push(['p', {}, ['strong', {}, `Q: ${label}`]])
    }
    allChildren.push(...collectBlockChildren(content))

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
  })

  const componentsListNodes: any[] = []
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === 'components-list') {
      componentsListNodes.push(node)
    }
    return true
  }, node => node)

  for (const node of componentsListNodes) {
    const category = node[1]?.category
    if (!category) continue

    const components = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/components/%')
      .where('extension', '=', 'md')
      .where('index', 'IS NULL')
      .where('category', '=', category)
      .select('path', 'title')
      .all()

    const listItems = components.map((c: any) =>
      ['li', {}, ['a', { href: rawUrl(event, c.path) }, c.title]]
    )

    node[0] = 'ul'
    node[1] = {}
    node.length = 2
    for (const item of listItems) {
      node.push(item)
    }
  }

  // code-preview 的 `#code` 插槽保存的就是源码，丢弃渲染预览；没有该插槽时预览本身即演示，
  // 还原为模板。必须在解包 wrapper 之前执行，否则 `::tabs` 中的预览会被拆散
  visitAndReplace(doc, 'code-preview', (node) => {
    const children = node.slice(2)
    const codeSlot = children.find(child => Array.isArray(child) && child[0] === 'template' && child[1]?.['v-slot:code'] !== undefined)

    if (codeSlot) {
      replaceWithChildren(node, codeSlot.slice(2))
      return
    }

    const preview = children.filter(child => !(Array.isArray(child) && child[0] === 'template'))

    // 预览的是代码块本身（如 code-tree、code-group），直接输出其中的代码块，
    // 否则高亮后的 span 会被还原成冗长的模板
    if (containsNode(preview, 'pre')) {
      replaceWithChildren(node, preview)
      return
    }

    const snippet = templateSnippet(preview)
    replaceNodeWithPre(node, 'vue', `<template>\n  ${snippet.split('\n').join('\n  ')}\n</template>`)
  })

  // Remove wrapper elements by extracting children content
  const wrapperTypes = ['card-group', 'accordion', 'steps', 'code-group', 'code-collapse', 'tabs', 'div']
  for (const wrapperType of wrapperTypes) {
    visitAndReplace(doc, wrapperType, (node) => {
      replaceWithChildren(node, node.slice(2))
    })
  }

  // Transform field to a definition format (before field-group unwrapping so attrs are intact)
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
          const innerContent = child.slice(2)
          return extractText(innerContent)
        }
        return ''
      }).join('')
    }

    const parts: any[] = [['strong', {}, name]]
    if (type) {
      parts.push(' (', ['code', {}, type], ')')
    }
    if (required) {
      parts.push(' ', ['em', {}, 'required'])
    }
    const desc = extractText(content).trim()
    if (desc) {
      parts.push(`: ${desc}`)
    }

    node[0] = 'p'
    node[1] = {}
    node.length = 2
    for (const part of parts) {
      node.push(part)
    }
  })

  // Remove field-group / collapsible wrappers (after fields are transformed to <p>)
  const fieldWrappers = ['field-group', 'collapsible']
  for (const wrapperType of fieldWrappers) {
    visitAndReplace(doc, wrapperType, (node) => {
      replaceWithChildren(node, node.slice(2))
    })
  }

  // Transform icons-theme and icons-theme-select to placeholder
  visitAndReplace(doc, 'icons-theme', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = ['em', {}, 'See the interactive theme picker on the documentation website.']
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
    node[2] = ['em', {}, 'See the full list of supported languages on the documentation website.']
    node.length = 3
  })

  // Transform u-button to markdown link
  visitAndReplace(doc, 'u-button', (node) => {
    const attrs = node[1] || {}
    const label = attrs.label || ''
    const to = attrs.to || ''
    if (to) {
      node[0] = 'p'
      node[1] = {}
      node[2] = ['a', { href: to }, label]
      node.length = 3
    } else {
      node[0] = 'p'
      node[1] = {}
      node[2] = label
      node.length = 3
    }
  })

  // 没有 Markdown 对应物的行内组件：kbd 转为带可读名称的行内代码（minimark 会把行内 HTML
  // 写到单独的行上，不能用 `<kbd>`），span 解包为文本，装饰性图标与交互控件直接丢弃
  visitAndReplace(doc, 'kbd', (node) => {
    // `:kbd{value="K"}` 以属性携带按键，`<kbd>K</kbd>` 以文本携带
    const value = String(node[1]?.value ?? textContent(node as any))
    node[0] = 'code'
    node[1] = {}
    node[2] = KBD_LABELS[value.toLowerCase()] ?? value
    node.length = 3
  })

  visitAndReplace(doc, 'span', (node) => {
    node[0] = '__flatten'
    node[1] = {}
  })

  visit(doc.body, (node) => {
    if (Array.isArray(node) && DROPPED_INLINE.has(node[0])) {
      node[0] = '__flatten'
      node[1] = {}
      node.length = 2
    }
    return true
  }, node => node)

  // minimark 没有管道表 handler，会把表格写成 HTML，这里逐格渲染为行内 Markdown。
  // 放在所有行内处理之后，确保单元格中的 kbd、图标已被归一化
  visitAndReplace(doc, 'table', (node) => {
    replaceNodeWithMarkdown(node, pipeTable(node))
  })

  // minimark 总是用三个反引号开围栏，代码自身含围栏（如讲解代码块的排版页面）时会被提前闭合
  visitAndReplace(doc, 'pre', (node) => {
    const attrs = node[1] || {}
    const code = String(attrs.code ?? '')
    if (code.includes('```')) {
      replaceNodeWithMarkdown(node, fencedBlock(code, attrs.language, attrs.filename, attrs.meta))
    }
  })
}
