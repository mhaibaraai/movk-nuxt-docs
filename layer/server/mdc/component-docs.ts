import { camelCase, upperFirst } from 'scule'
import meta from '#nuxt-component-meta/nitro'
import { getComponentExample } from '#component-example/nitro'
import { compactProps } from '../utils/componentMeta'
import { generateComponentCode } from '../../shared/component-code'
import type { Document, MDCAttributes } from './nodes'
import { getBooleanAttribute, parseAttrAsObject, readMdcAttr, replaceNodeWithPre, visitAndReplace } from './nodes'

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

/** 组件文档类 MDC 组件转为纯 Markdown：Props / Slots / Emits 接口、组件代码与示例源码 */
export async function transformComponentDocs(doc: Document, componentName: string): Promise<void> {
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
      name: upperFirst(targetName),
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
}
