import { kebabCase } from 'scule'

export interface ComponentCodeOptions {
  /** PascalCase 组件名 */
  name: string
  props: Record<string, unknown>
  /** 以 ref 变量声明并绑定的属性 */
  external?: string[]
  hide?: string[]
  /** 以 `v-model:{key}` 绑定的属性 */
  model?: string[]
  slots?: Record<string, unknown>
  /** 返回属性默认值；提供时省略与默认值相同的布尔与字符串属性 */
  getDefault?: (key: string) => unknown
}

const isTrue = (value: unknown) => value === true || value === 'true' || value === '`true`'
const isFalse = (value: unknown) => !value || value === 'false' || value === '`false`'

function isDefaultValue(value: unknown, defaultValue: unknown): boolean {
  if (typeof value === 'boolean') return value ? isTrue(defaultValue) : isFalse(defaultValue)
  return typeof value === 'string' && value === defaultValue
}

function formatAttribute(key: string, value: unknown, external: string[]): string {
  const attr = kebabCase(key)
  if (typeof value === 'boolean') return value ? attr : `:${attr}="false"`
  if (typeof value === 'object') return external.includes(key) ? `:${attr}="${key}"` : `:${attr}='${JSON.stringify(value)}'`
  if (typeof value === 'number') return `:${attr}="${value}"`
  return `${attr}="${value}"`
}

function indent(content: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return content.split('\n').map(line => line.trim() ? `${pad}${line}` : line).join('\n')
}

function formatSlots(slots: Record<string, unknown>): string {
  let content = ''
  const defaultSlot = slots.default == null ? '' : String(slots.default).trim()
  if (defaultSlot) content += `\n${indent(defaultSlot, 4)}\n  `

  for (const [slotName, value] of Object.entries(slots)) {
    const slot = value == null ? '' : String(value).trim()
    if (slotName === 'default' || !slot) continue
    content += `\n    <template #${slotName}>\n${indent(slot, 6)}\n    </template>`
  }
  return content
}

/** 由属性矩阵生成 Vue SFC 片段，ComponentCode 渲染与 raw markdown 共用 */
export function generateComponentCode({ name, props, external = [], hide = [], model = [], slots = {}, getDefault }: ComponentCodeOptions): string {
  const attributes: string[] = []
  for (const [key, value] of Object.entries(props)) {
    if (hide.includes(key) || value === undefined || value === null || value === '') continue
    if (key === 'modelValue') {
      attributes.push('v-model="value"')
    } else if (model.includes(key)) {
      attributes.push(`v-model:${kebabCase(key)}="${key}"`)
    } else if (!getDefault || !isDefaultValue(value, getDefault(key))) {
      attributes.push(formatAttribute(key, value, external))
    }
  }

  const refs = external
    .filter(key => key in props)
    .map(key => `const ${key === 'modelValue' ? 'value' : key} = ref(${JSON.stringify(props[key])})`)
  const script = refs.length ? `<script setup lang="ts">\n${refs.join('\n')}\n</script>\n\n` : ''

  const attrs = attributes.length ? ` ${attributes.join(' ')}` : ''
  const slotContent = formatSlots(slots)
  const tag = slotContent ? `<${name}${attrs}>${slotContent}</${name}>` : `<${name}${attrs} />`

  return `${script}<template>\n  ${tag}\n</template>`
}
