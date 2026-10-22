<script setup lang="ts">
import { useFetchComponentMeta } from '../composables/fetchComponentMeta'
import { generateComponentCode } from '../../../../shared/component-code'
import type { ChipProps } from '@nuxt/ui'
import { camelCase, upperFirst } from 'scule'
import { hash } from 'ohash'
import { registry as componentRegistry } from '#component-code/registry'
import { get, set } from '#ui/utils'

const props = withDefaults(defineProps<{
  name: string
  class?: any
  props?: Record<string, any>
  items?: Record<string, any[]>
  model?: string[]
  external?: string[]
  hide?: string[]
  ignore?: string[]
  slots?: Record<string, any>
  /**
   * 是否使用 Prettier 格式化代码
   * @defaultValue false
   */
  prettier?: boolean
  /**
   * 是否折叠代码块
   * @defaultValue false
   */
  collapse?: boolean | {
    icon?: string
    name?: string
    openText?: string
    closeText?: string
    open?: boolean
  }
  highlights?: number[]
  overflowHidden?: boolean
  elevated?: boolean
}>(), {
  prettier: false
})

const { $prettier } = useNuxtApp()

const camelName = computed(() => camelCase(props.name))
const pascalName = computed(() => upperFirst(camelName.value))

const component = computed(() => (componentRegistry as Record<string, any>)[pascalName.value] ?? null)
const isResolved = computed(() => component.value !== null)

const { data: meta } = await useFetchComponentMeta(pascalName.value as any)

const componentProps = reactive<Record<string, any>>({ ...(props.props || {}) })
const componentEvents = reactive<Record<string, (e: any) => void>>({
  ...Object.fromEntries((props.model || []).map(key => [`onUpdate:${key}`, (e: any) => set(componentProps, key, e)])),
  ...(componentProps.modelValue !== undefined
    ? { [`onUpdate:modelValue`]: (e: any) => set(componentProps, 'modelValue', e) }
    : {})
})

function mapKeys(obj: Record<string, any>, parentKey = ''): string[] {
  return Object.entries(obj || {}).flatMap(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return mapKeys(value, key)
    }
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    if (props.ignore?.includes(fullKey) || props.hide?.includes(fullKey)) return []
    return [fullKey]
  })
}

const options = computed(() => {
  const keys = mapKeys(props.props || {})
  return keys.map((key) => {
    const prop = (meta.value as any)?.meta?.props?.find((p: any) => p.name === key)
    const providedItems = (get(props.items, key, []) as any[]) || []
    const items = providedItems.length
      ? providedItems.map((item: any) => ({
          value: item,
          label: String(item),
          chip: key.toLowerCase().endsWith('color') ? { color: item } : undefined
        }))
      : (prop?.type === 'boolean' || prop?.type === 'boolean | undefined'
          ? [{ value: true, label: 'true' }, { value: false, label: 'false' }]
          : [])
    const type = prop?.type as string | undefined
    // 按原始值判定，避免清空数字输入框后退化为文本框
    const inputType = type?.includes('number') && typeof get(props.props, key) === 'number' ? 'number' : 'text'
    return { name: key, label: key, inputType, items }
  })
})

function getComponentProp(name: string) {
  return get(componentProps, name) ?? undefined
}

function setComponentProp(name: string, value: any) {
  set(componentProps, name, value)
}

function buildCollapseAttrs(): string {
  if (!props.collapse) return ''
  if (typeof props.collapse !== 'object') return ''
  return Object.entries(props.collapse)
    .map(([key, value]) => {
      if (typeof value === 'boolean') return value ? key : ''
      return `${key}="${value}"`
    })
    .filter(Boolean)
    .join(' ')
}

function getPropDefault(key: string) {
  const prop = (meta.value as any)?.meta?.props?.find((p: any) => p.name === key)
  return prop && (prop.default ?? prop.tags?.find((tag: any) => tag.name === 'defaultValue')?.text)
}

function buildCode(): string {
  const highlights = props.highlights?.length ? ` {${props.highlights.join('-')}}` : ''
  const fence = `\`\`\`vue${highlights}\n${generateComponentCode({
    name: pascalName.value,
    props: componentProps,
    external: props.external,
    hide: props.hide,
    model: props.model,
    slots: props.slots,
    getDefault: getPropDefault
  })}\n\`\`\``

  if (!props.collapse) return fence

  const collapseAttrs = buildCollapseAttrs()
  return `::code-collapse${collapseAttrs ? `{${collapseAttrs}}` : ''}\n${fence}\n::`
}

const code = computed(() => buildCode())

const codeKey = computed(() => `component-code-${pascalName.value}-${hash({ name: props.name, props: componentProps, collapse: props.collapse })}`)

const wrapperContainer = ref<HTMLElement | null>(null)
const componentContainer = ref<HTMLElement | null>(null)

const { data: ast } = useAsyncData(codeKey.value, async () => {
  if (!props.prettier) return cachedParseMarkdown(code.value)

  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true,
      printWidth: 100
    })
  } catch {
    formatted = code.value
  }
  return cachedParseMarkdown(formatted)
}, { lazy: import.meta.client, watch: [code] })
</script>

<template>
  <div class="my-5" :style="{ '--ui-header-height': '4rem' }">
    <div ref="wrapperContainer" class="relative group/component">
      <div v-if="options.length" class="flex flex-wrap items-center gap-2.5 border border-muted border-b-0 relative rounded-t-md px-4 py-2.5 overflow-x-auto">
        <UFormField
          v-for="option in options"
          :key="option.name"
          :label="option.label"
          size="sm"
          class="inline-flex ring ring-accented rounded-sm"
          :ui="{
            wrapper: 'bg-elevated/50 rounded-l-sm flex border-r border-accented',
            label: 'text-muted px-2 py-1.5',
            container: 'mt-0'
          }"
        >
          <USelectMenu
            v-if="option.items?.length"
            :model-value="getComponentProp(option.name)"
            :items="option.items"
            :search-input="false"
            value-key="value"
            color="neutral"
            variant="soft"
            class="rounded-sm rounded-l-none min-w-12"
            :class="[option.name.toLowerCase().endsWith('color') && 'pl-6']"
            :ui="{ itemLeadingChip: 'w-2' }"
            @update:model-value="setComponentProp(option.name, $event)"
          >
            <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
              <UChip
                v-if="modelValue"
                inset
                standalone
                :color="(modelValue as any)"
                :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                class="size-2"
              />
            </template>
          </USelectMenu>
          <UInput
            v-else
            :type="option.inputType"
            :model-value="getComponentProp(option.name)"
            color="neutral"
            variant="soft"
            :ui="{ base: 'rounded-sm rounded-l-none min-w-12' }"
            @update:model-value="setComponentProp(option.name, $event)"
          />
        </UFormField>
      </div>

      <div
        ref="componentContainer"
        class="flex justify-center border border-b-0 border-muted relative p-4 z-1"
        :class="[!options.length && 'rounded-t-md', props.class, { 'overflow-hidden': props.overflowHidden, 'dark:bg-neutral-950/50': props.elevated }]"
      >
        <component
          :is="component"
          v-if="isResolved && component"
          v-bind="{ ...componentProps, ...componentEvents }"
        >
          <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
            <slot :name="slot" mdc-unwrap="p">
              {{ slots?.[slot] }}
            </slot>
          </template>
        </component>
        <p v-else class="text-sm text-muted">
          Component <code>{{ pascalName }}</code> is not registered.
        </p>
      </div>

      <ClientOnly>
        <ComponentExampleExtras
          :name="name"
          :camel-name="camelName"
          :pascal-name="pascalName"
          :effective-props="componentProps"
          :wrapper-container="wrapperContainer"
          :component-container="componentContainer"
        />
      </ClientOnly>
    </div>

    <MDCRenderer
      v-if="ast"
      :body="ast.body"
      :data="ast.data"
      class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!"
    />
  </div>
</template>
