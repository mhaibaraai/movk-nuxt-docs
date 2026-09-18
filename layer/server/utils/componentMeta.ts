import { decodeUnicodeEscapes } from '../../app/utils/unicode'

export interface ComponentMetaTag {
  name: string
  text?: string
}

export interface CompactProp {
  name: string
  type: string
  description?: string
  required?: boolean
  default?: unknown
  tags?: ComponentMetaTag[]
}

/**
 * 将 vue-component-meta 的 prop 精简为不含递归 `schema` 的结构（泛型 prop 的 schema 可展开到数 MB），
 * 类型与默认值的展示规则与 `app/components/content/ComponentProps.vue` 保持一致
 */
export function compactProp(prop: any): CompactProp {
  let type: string = typeof prop.type === 'string' ? prop.type : 'any'

  if (!type.startsWith('boolean') && prop.schema?.kind === 'enum' && Object.keys(prop.schema.schema ?? {}).length) {
    const values = Object.values(prop.schema.schema).map((schema: any) => schema?.type ? schema.type : schema)
    // enum schema 把 undefined 排在首位，移到末尾使可选 prop 读起来与源码类型一致
    type = [...values.filter(value => value !== 'undefined'), ...values.filter(value => value === 'undefined')].join(' | ')
  }

  let defaultValue = prop.default
  if (typeof defaultValue === 'string') {
    defaultValue = decodeUnicodeEscapes(defaultValue.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\''))
  }
  if (defaultValue === undefined) {
    defaultValue = prop.tags?.find((tag: ComponentMetaTag) => tag.name === 'defaultValue')?.text
  }

  const tags = prop.tags?.filter((tag: ComponentMetaTag) => tag.name !== 'defaultValue')

  return {
    name: prop.name,
    type,
    ...(prop.description?.trim() ? { description: prop.description } : {}),
    ...(prop.required ? { required: true } : {}),
    ...(defaultValue !== undefined ? { default: defaultValue } : {}),
    ...(tags?.length ? { tags } : {})
  }
}

export function compactProps(props: any[] | undefined): CompactProp[] {
  return (props ?? []).map(compactProp)
}

/**
 * 依次尝试组件标题对应的元数据名，映射为 `get-component-metadata` 工具与
 * `implement-component-with-props` 提示词共用的结构；无元数据时返回 `null`
 */
export async function fetchComponentMetadata(title: string, { full = false }: { full?: boolean } = {}) {
  for (const metaName of buildComponentNameCandidates(title).metaNames) {
    let metadata: Record<string, any>
    try {
      metadata = await $fetch<Record<string, any>>(`/api/component-meta/${metaName}.json`)
    } catch {
      continue
    }

    return {
      pascalName: metadata.pascalName,
      kebabName: metadata.kebabName,
      props: full ? metadata.meta.props : compactProps(metadata.meta.props),
      slots: metadata.meta.slots,
      emits: metadata.meta.events
    }
  }

  return null
}
