export interface SchemaNode {
  type?: string
  title?: string
  description?: string
  default?: unknown
  properties?: Record<string, SchemaNode>
}

export type Locale = 'zh-CN' | 'en'

export interface ReferenceRow {
  path: string
  type: string
  default: unknown
  description: string
}

export interface ReferenceGroup {
  key: string
  description: string
  rows: ReferenceRow[]
}

export const REGION_START = '<!-- config-reference:start -->'
export const REGION_END = '<!-- config-reference:end -->'

// 由其他模块注册的 appConfig 分组，不属于 layer 的配置面
const EXCLUDED_GROUPS = ['icon']

const HEADERS: Record<Locale, string[]> = {
  'zh-CN': ['字段', '类型', '默认值', '说明'],
  'en': ['Field', 'Type', 'Default', 'Description']
}

function describe(path: string, node: SchemaNode, locale: Locale, en: Record<string, string>): string {
  if (locale === 'en') {
    const text = en[path]
    if (!text) throw new Error(`Missing English description for appConfig.${path}`)
    return text
  }
  return node.description || node.title || ''
}

function collectRows(node: SchemaNode, prefix: string, locale: Locale, en: Record<string, string>): ReferenceRow[] {
  return Object.entries(node.properties ?? {}).flatMap(([key, child]) => {
    const path = `${prefix}.${key}`
    if (child.type === 'object' && child.properties) return collectRows(child, path, locale, en)
    return [{ path, type: child.type ?? 'any', default: child.default, description: describe(path, child, locale, en) }]
  })
}

export function collectGroups(appConfig: SchemaNode, locale: Locale, en: Record<string, string>): ReferenceGroup[] {
  return Object.entries(appConfig.properties ?? {})
    .filter(([key]) => !EXCLUDED_GROUPS.includes(key))
    .map(([key, group]) => ({
      key,
      description: describe(key, group, locale, en),
      rows: collectRows(group, key, locale, en)
    }))
}

function cell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function formatDefault(value: unknown): string {
  return `\`${cell(JSON.stringify(value ?? null))}\``
}

export function renderGroups(groups: ReferenceGroup[], locale: Locale): string {
  const headers = HEADERS[locale]
  return groups.map(group => [
    `## \`${group.key}\``,
    '',
    group.description,
    '',
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...group.rows.map(row => `| \`${row.path}\` | \`${row.type}\` | ${formatDefault(row.default)} | ${cell(row.description)} |`)
  ].join('\n')).join('\n\n')
}

/** 替换文档中标记区域的内容，区域外的手写内容保持不变 */
export function replaceRegion(content: string, generated: string): string {
  const start = content.indexOf(REGION_START)
  const end = content.indexOf(REGION_END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing ${REGION_START} / ${REGION_END} markers`)
  }
  return `${content.slice(0, start + REGION_START.length)}\n\n${generated}\n\n${content.slice(end)}`
}
