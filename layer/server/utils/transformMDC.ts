import type { H3Event } from 'h3'
import { camelCase, kebabCase, upperFirst } from 'scule'
import { visit } from '@nuxt/content/runtime'
import { textContent } from 'minimark'
import { queryCollection } from '@nuxt/content/server'
import { resolveCommitFilePath } from '../../shared/commit-path'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import { getComponentExample } from '#component-example/nitro'
import { getAgentSiteUrl, rawUrl } from '#agent-discovery'
import { compactProps } from './componentMeta'
import { fencedBlock, pipeTable } from './markdown'

type Document = {
  title: string
  path?: string
  body: any
}

type MDCAttributes = Record<string, unknown>

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

const parseBoolean = (value?: unknown): boolean => value === true || value === '' || value === 'true'

function getBooleanAttribute(attrs: MDCAttributes, key: string): boolean {
  return parseBoolean(attrs[key]) || parseBoolean(attrs[`:${key}`])
}

function resolveComponentTargetName(attrs: MDCAttributes, fallback: string, options: { name?: boolean } = {}) {
  const target = attrs.slug ?? (options.name ? attrs.name : undefined) ?? fallback
  return camelCase(String(target || ''))
}

function getComponentMeta(componentName: string) {
  const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  const strategies = [
    `Prose${pascalCaseName}`,
    pascalCaseName
  ]

  let componentMeta: any
  let finalMetaComponentName: string = pascalCaseName

  for (const nameToTry of strategies) {
    finalMetaComponentName = nameToTry
    const metaAttempt = (meta as Record<string, any>)[nameToTry]?.meta
    if (metaAttempt) {
      componentMeta = metaAttempt
      break
    }
  }

  if (!componentMeta) {
    console.warn(`[getComponentMeta] Metadata not found for ${pascalCaseName} using strategies: Prose, or no prefix. Last tried: ${finalMetaComponentName}`)
  }

  return {
    pascalCaseName,
    metaComponentName: finalMetaComponentName,
    componentMeta
  }
}

function generateTSInterface(
  name: string,
  items: any[],
  itemHandler: (item: any) => string,
  description: string
) {
  let code = `/**\n * ${description}\n */\ninterface ${name} {\n`
  for (const item of items) {
    code += itemHandler(item)
  }
  code += `}`
  return code
}

function propItemHandler(propValue: any): string {
  if (!propValue?.name) return ''
  const propName = propValue.name
  // 已由 compactProp 归一化，type 总是字符串
  const propType = propValue.type
  const isRequired = propValue.required || false
  const hasDescription = propValue.description && propValue.description.trim().length > 0
  const hasDefault = propValue.default !== undefined
  let result = ''
  if (hasDescription || hasDefault) {
    result += `  /**\n`
    if (hasDescription) {
      const descLines = propValue.description.split(/\r?\n/)
      descLines.forEach((line: string) => {
        result += `   * ${line}\n`
      })
    }
    if (hasDefault) {
      const defaultValue = propValue.default
      result += `   * @default ${typeof defaultValue === 'string' ? defaultValue : JSON.stringify(defaultValue)}\n`
    }
    result += `   */\n`
  }
  result += `  ${propName}${isRequired ? '' : '?'}: ${propType};\n`
  return result
}

function slotItemHandler(slotValue: any): string {
  if (!slotValue?.name) return ''
  const slotName = slotValue.name
  const hasDescription = slotValue.description && slotValue.description.trim().length > 0
  let result = ''
  if (hasDescription) {
    result += `  /**\n`
    const descLines = slotValue.description.split(/\r?\n/)
    descLines.forEach((line: string) => {
      result += `   * ${line}\n`
    })
    result += `   */\n`
  }
  if (slotValue.bindings && Object.keys(slotValue.bindings).length > 0) {
    let bindingsType = '{\n'
    Object.entries(slotValue.bindings).forEach(([bindingName, bindingValue]: [string, any]) => {
      const bindingType = bindingValue.type || 'any'
      bindingsType += `    ${bindingName}: ${bindingType};\n`
    })
    bindingsType += '  }'
    result += `  ${slotName}(bindings: ${bindingsType}): any;\n`
  } else {
    result += `  ${slotName}(): any;\n`
  }
  return result
}

function emitItemHandler(event: any): string {
  if (!event?.name) return ''
  let payloadType = 'void'
  if (event.type) {
    payloadType = Array.isArray(event.type)
      ? event.type.map((t: any) => t.name || t).join(' | ')
      : event.type.name || event.type
  }
  let result = ''
  if (event.description && event.description.trim().length > 0) {
    result += `  /**\n`
    event.description.split(/\r?\n/).forEach((line: string) => {
      result += `   * ${line}\n`
    })
    result += `   */\n`
  }
  result += `  ${event.name}: (payload: ${payloadType}) => void;\n`
  return result
}

function replaceNodeWithPre(node: any[], language: string, code: string, filename?: string) {
  node[0] = 'pre'
  node[1] = { language, code }
  if (filename) node[1].filename = filename
  // stringifier 只读取 code，原插槽内容对后续遍历只是负担
  node.length = 2
}

// 把 JSON 值写成单引号的 JS 字面量，保证能放进双引号的 Vue 属性里
function toJsLiteral(value: unknown): string {
  return JSON.stringify(value)
    .replace(/"((?:[^"\\]|\\.)*)"/g, (_, text: string) => `'${text.replace(/\\"/g, '"').replace(/'/g, '\\\'')}'`)
    .replace(/'([A-Z_$][\w$]*)':/gi, '$1: ')
}

// 模板片段中的 Vue 属性：绑定属性以 `:key` 形式携带 JSON 字符串，还原为对象字面量
function templateAttribute(key: string, value: unknown): string {
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
function replaceNodeWithMarkdown(node: any[], markdown: string) {
  node[0] = 'p'
  node[1] = {}
  node[2] = markdown
  node.length = 3
}

function containsNode(nodes: any[], tag: string): boolean {
  return nodes.some(child => Array.isArray(child) && (child[0] === tag || containsNode(child.slice(2), tag)))
}

// 没有 `#code` 插槽的预览是用 MDC 写的组件演示，最接近源码的形式是把语法树还原为模板
function templateSnippet(nodes: any[]): string {
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

function parseAttrAsObject<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value !== 'string') return value as T
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function readMdcAttr(attrs: MDCAttributes, key: string): unknown {
  return attrs[`:${key}`] ?? attrs[key]
}

type ComponentCodeConfig = {
  props: Record<string, any>
  external: string[]
  hide: string[]
  componentName: string
  slots?: Record<string, string>
  model?: string[]
}

function generateComponentCode({
  props,
  external,
  hide,
  componentName,
  slots,
  model
}: ComponentCodeConfig): string {
  const pascalName = upperFirst(componentName)
  const externalSet = new Set(external)
  const modelSet = new Set(model || [])

  const propAttributes: string[] = []
  for (const [key, value] of Object.entries(props)) {
    if (hide.includes(key)) continue
    if (value === undefined || value === null || value === '') continue

    if (key === 'modelValue') {
      propAttributes.push(`v-model="value"`)
      continue
    }
    if (modelSet.has(key)) {
      propAttributes.push(`v-model:${kebabCase(key)}="${key}"`)
      continue
    }

    const attr = kebabCase(key)

    if (typeof value === 'boolean') {
      propAttributes.push(value ? attr : `:${attr}="false"`)
      continue
    }
    if (typeof value === 'object') {
      if (externalSet.has(key)) {
        propAttributes.push(`:${attr}="${key}"`)
      } else {
        propAttributes.push(`:${attr}='${JSON.stringify(value)}'`)
      }
      continue
    }
    if (typeof value === 'number') {
      propAttributes.push(`:${attr}="${value}"`)
      continue
    }
    propAttributes.push(`${attr}="${value}"`)
  }

  const refDeclarations: string[] = []
  for (const key of external) {
    if (!(key in props)) continue
    const varName = key === 'modelValue' ? 'value' : key
    refDeclarations.push(`const ${varName} = ref(${JSON.stringify(props[key])})`)
  }

  let scriptSetup = ''
  if (refDeclarations.length) {
    scriptSetup = `<script setup lang="ts">\n${refDeclarations.join('\n')}\n</script>\n\n`
  }

  let defaultSlotContent = ''
  let namedSlotsContent = ''
  if (slots && Object.keys(slots).length) {
    const defaultSlot = slots.default?.trim()
    if (defaultSlot) {
      const indented = defaultSlot
        .split('\n')
        .map(line => line.trim() ? `    ${line}` : line)
        .join('\n')
      defaultSlotContent = `\n${indented}\n  `
    }
    for (const [slotName, content] of Object.entries(slots)) {
      if (slotName === 'default' || !content?.trim?.()) continue
      const indented = content.trim()
        .split('\n')
        .map((line: string) => line.trim() ? `      ${line}` : line)
        .join('\n')
      namedSlotsContent += `\n    <template #${slotName}>\n${indented}\n    </template>`
    }
  }

  const formattedProps = propAttributes.length ? ` ${propAttributes.join(' ')}` : ''
  const componentTemplate = (defaultSlotContent || namedSlotsContent)
    ? `<${pascalName}${formattedProps}>${defaultSlotContent}${namedSlotsContent}</${pascalName}>`
    : `<${pascalName}${formattedProps} />`

  return `${scriptSetup}<template>
  ${componentTemplate}
</template>`
}

function visitAndReplace(doc: Document, type: string, handler: (node: any[]) => void) {
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === type) {
      handler(node)
    }
    return true
  }, node => node)
}

const BLOCK_ELEMENTS = new Set([
  'pre', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'table', 'hr'
])

function collectBlockChildren(nodes: any[]): any[] {
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

function replaceWithChildren(node: any[], newChildren: any[]) {
  const collected = collectBlockChildren(newChildren)
  node[0] = '__flatten'
  node[1] = {}
  node.length = 2
  for (const child of collected) {
    node.push(child)
  }
}

// 普通节点 `[tag, attrs, ...children]` 从下标 2 开始，根 children 数组从 0 开始
function flattenMarkers(node: any, start = 2): void {
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

export async function transformMDC(event: H3Event, doc: Document): Promise<Document> {
  const componentName = camelCase(doc.title)

  visitAndReplace(doc, 'component-props', (node) => {
    const attributes = (node[1] || {}) as MDCAttributes
    const isProse = getBooleanAttribute(attributes, 'prose')
    const finalComponentName = resolveComponentTargetName(attributes, componentName, { name: true })

    const { pascalCaseName, componentMeta } = getComponentMeta(finalComponentName)

    if (!componentMeta?.props) return

    const interfaceName = isProse ? `Prose${pascalCaseName}Props` : `${pascalCaseName}Props`

    const interfaceCode = generateTSInterface(
      interfaceName,
      compactProps(Object.values(componentMeta.props)),
      propItemHandler,
      `Props for the ${isProse ? 'Prose' : ''}${pascalCaseName} component`
    )
    replaceNodeWithPre(node, 'ts', interfaceCode)
  })

  visitAndReplace(doc, 'component-slots', (node) => {
    const attributes = (node[1] || {}) as MDCAttributes
    const finalComponentName = resolveComponentTargetName(attributes, componentName)
    const { pascalCaseName, componentMeta } = getComponentMeta(finalComponentName)
    if (!componentMeta?.slots) return

    const interfaceCode = generateTSInterface(
      `${pascalCaseName}Slots`,
      Object.values(componentMeta.slots),
      slotItemHandler,
      `Slots for the ${pascalCaseName} component`
    )
    replaceNodeWithPre(node, 'ts', interfaceCode)
  })

  visitAndReplace(doc, 'component-emits', (node) => {
    const attributes = (node[1] || {}) as MDCAttributes
    const finalComponentName = resolveComponentTargetName(attributes, componentName)
    const { pascalCaseName, componentMeta } = getComponentMeta(finalComponentName)
    const hasEvents = componentMeta?.events && Object.keys(componentMeta.events).length > 0

    if (hasEvents) {
      const interfaceCode = generateTSInterface(
        `${pascalCaseName}Emits`,
        Object.values(componentMeta.events),
        emitItemHandler,
        `Emitted events for the ${pascalCaseName} component`
      )
      replaceNodeWithPre(node, 'ts', interfaceCode)
    } else {
      node[0] = 'p'
      node[1] = {}
      node[2] = 'No events available for this component.'
    }
  })

  visitAndReplace(doc, 'component-code', (node) => {
    const attrs = (node[1] || {}) as MDCAttributes
    const targetName = camelCase(String(attrs.slug ?? attrs.name ?? doc.title ?? ''))
    if (!targetName) return

    const code = generateComponentCode({
      props: parseAttrAsObject<Record<string, any>>(readMdcAttr(attrs, 'props'), {}),
      external: parseAttrAsObject<string[]>(readMdcAttr(attrs, 'external'), []),
      hide: parseAttrAsObject<string[]>(readMdcAttr(attrs, 'hide'), []),
      componentName: targetName,
      slots: parseAttrAsObject<Record<string, string>>(readMdcAttr(attrs, 'slots'), {}),
      model: parseAttrAsObject<string[]>(readMdcAttr(attrs, 'model'), [])
    })
    replaceNodeWithPre(node, 'vue', code)
  })

  const exampleNodes: any[][] = []
  visitAndReplace(doc, 'component-example', (node) => {
    exampleNodes.push(node)
  })

  await Promise.all(exampleNodes.map(async (node) => {
    const camelName = camelCase(node[1]['name'])
    const name = camelName.charAt(0).toUpperCase() + camelName.slice(1)
    const component = await getComponentExample(name)
    if (component) {
      replaceNodeWithPre(node, 'vue', component.code, `${name}.vue`)
    }
  }))

  // Transform commit-changelog to changelog content
  const changelogNodes: any[][] = []

  visitAndReplace(doc, 'commit-changelog', (node) => {
    changelogNodes.push(node)
  })

  if (changelogNodes.length) {
    const { github } = useAppConfig() as { github: Record<string, any> }
    // 站点规范地址而非构建期请求源：文档会被预渲染，绝对链接就此烘进产物
    const origin = getAgentSiteUrl(event)

    changelogNodes.forEach((node) => {
      const attrs = node[1] || {}
      const githubUrl = github?.url || ''
      const branch = github?.branch || 'main'

      const resolveOne = (override: Record<string, any>): string => resolveCommitFilePath({
        basePath: override.commitPath ?? override['commit-path'] ?? attrs.commitPath ?? attrs['commit-path'] ?? github?.commitPath ?? 'src',
        prefix: override.prefix ?? attrs.prefix,
        suffix: override.suffix ?? attrs.suffix ?? github?.suffix ?? 'vue',
        name: override.name ?? attrs.name ?? doc.title ?? '',
        casing: override.casing ?? attrs.casing ?? github?.casing ?? 'auto'
      })

      // 块 frontmatter 的数组值在 AST 里以 `:files` 绑定形式存为 JSON 字符串
      const files = parseAttrAsObject<Record<string, any>[]>(readMdcAttr(attrs, 'files'), [])
      const overrides = Array.isArray(files) && files.length ? files : [{}]
      const filePaths: string[] = overrides.map(resolveOne)

      node[0] = 'p'
      node[1] = {}
      let idx = 2
      node[idx++] = 'See commit history for '
      filePaths.forEach((filePath, i) => {
        if (i > 0) node[idx++] = '、'
        const commitsUrl = githubUrl
          ? `${githubUrl}/commits/${branch}/${filePath}`
          : `${origin}/${filePath}`
        node[idx++] = ['a', { href: commitsUrl }, filePath]
      })
      node[idx++] = '.'
      node.length = idx
    })
  }

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

      const blockquoteChildren: any[] = []

      let firstLine = `[!${label}]`
      if (attrs.to) {
        firstLine += `\nSee: ${attrs.to}`
      }
      blockquoteChildren.push(['p', {}, firstLine])

      blockquoteChildren.push(...collectBlockChildren(content))

      node[0] = 'blockquote'
      node[1] = {}
      node.length = 2
      for (const child of blockquoteChildren) {
        node.push(child)
      }
    })
  }

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

  // Flatten __flatten markers by splicing their children into parents
  if (Array.isArray(doc.body)) {
    flattenMarkers(doc.body, 0)
  } else if (doc.body?.value && Array.isArray(doc.body.value)) {
    flattenMarkers(doc.body.value, 0)
  }

  return doc
}
