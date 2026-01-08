<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import { camelCase } from 'scule'
import { hash } from 'ohash'
import { useElementSize } from '@vueuse/core'
import { get, set } from '#ui/utils'

const { preview = true, source = true, prettier = false, ...props } = defineProps<{
  name: string
  class?: any
  /**
   * 是否在 iframe 中渲染组件
   * @defaultValue false
   */
  iframe?: boolean | { [key: string]: any }
  /**
   * 是否在移动端尺寸的 iframe 视口中显示组件
   * @defaultValue false
   */
  iframeMobile?: boolean
  props?: { [key: string]: any }
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
  /**
   * 是否显示预览
   * 当设置为 `false` 时，将显示文件名
   * @defaultValue true
   */
  preview?: boolean
  /**
   * 是否显示源代码
   * @defaultValue true
   */
  source?: boolean
  /**
   * 链接到组件的可变属性列表
   */
  options?: Array<{
    alias?: string
    name: string
    label: string
    items?: any[]
    default: any
    multiple?: boolean
  }>
  /**
   * 代码块中需要高亮的行号列表
   */
  highlights?: number[]
  /**
   * 是否在包装器上添加 overflow-hidden
   */
  overflowHidden?: boolean
}>()

const slots = defineSlots<{
  options(props?: {}): any
  code(props?: {}): any
}>()

const el = ref<HTMLElement | null>(null)
const { $prettier } = useNuxtApp()

const { width } = useElementSize(el)

const camelName = camelCase(props.name)

const data = await fetchComponentExample(camelName)

const componentProps = reactive({ ...(props.props || {}) })

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    // 构建 code-collapse 的属性
    const collapseAttrs = typeof props.collapse === 'object'
      ? Object.entries(props.collapse)
          .map(([key, value]) => {
            if (typeof value === 'boolean') {
              return value ? key : ''
            }
            return `${key}="${value}"`
          })
          .filter(Boolean)
          .join(' ')
      : ''

    code += `::code-collapse${collapseAttrs ? `{${collapseAttrs}}` : ''}
`
  }

  code += `\`\`\`vue ${preview ? '' : ` [${data.pascalName}.vue]`}${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${data?.code ?? ''}
\`\`\``

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(`component-example-${camelName}${hash({ props: componentProps, collapse: props.collapse })}`, async () => {
  if (!prettier) {
    return parseMarkdown(code.value)
  }

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

  return parseMarkdown(formatted)
}, { watch: [code] })

const optionsValues = ref(props.options?.reduce((acc, option) => {
  if (option.name) {
    acc[option.alias || option.name] = option.default
  }
  if (option.name.toLowerCase().endsWith('color') && option.items?.length) {
    option.items = option.items.map((item: any) => ({
      label: item,
      value: item,
      chip: { color: item }
    }))
  }
  return acc
}, {} as Record<string, any>) || {})

const urlSearchParams = computed(() => {
  const params = {
    ...optionsValues.value,
    ...componentProps
  }

  if (!props.iframeMobile) {
    params.width = Math.round(width.value).toString()
  }

  return new URLSearchParams(params).toString()
})
</script>

<template>
  <div ref="el" class="my-5" :style="{ '--ui-header-height': '4rem' }">
    <template v-if="preview">
      <div class="border border-muted relative z-1" :class="{ 'border-b-0 rounded-t-md': source, 'rounded-md': !source, 'overflow-hidden': props.overflowHidden }">
        <div v-if="props.options?.length || !!slots.options" class="flex gap-4 p-4 border-b border-muted">
          <slot name="options" />

          <UFormField
            v-for="option in props.options"
            :key="option.name"
            :label="option.label"
            :name="option.name"
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
              :model-value="get(optionsValues, option.name)"
              :items="option.items"
              :search-input="false"
              :value-key="option.name.toLowerCase().endsWith('color') ? 'value' : undefined"
              color="neutral"
              variant="soft"
              class="rounded-sm rounded-l-none min-w-12"
              :multiple="option.multiple"
              :class="{ 'pl-6': option.name.toLowerCase().endsWith('color') }"
              :ui="{ itemLeadingChip: 'w-2' }"
              @update:model-value="set(optionsValues, option.name, $event)"
            >
              <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
                <UChip
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
              :model-value="get(optionsValues, option.name)"
              color="neutral"
              variant="soft"
              :ui="{ base: 'rounded-sm rounded-l-none min-w-12' }"
              @update:model-value="set(optionsValues, option.name, $event)"
            />
          </UFormField>
        </div>

        <iframe
          v-if="iframe"
          v-bind="typeof iframe === 'object' ? iframe : {}"
          :src="`/examples/${name}?${urlSearchParams}`"
          class="relative w-full"
          :class="[props.class, { 'lg:left-1/2 lg:-translate-x-1/2 lg:w-[1024px]': !iframeMobile }]"
        />
        <div v-else class="flex justify-center p-4" :class="props.class">
          <component :is="camelName" v-bind="{ ...componentProps, ...optionsValues }" />
        </div>
      </div>
    </template>

    <template v-if="source">
      <div v-if="!!slots.code" class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!">
        <slot name="code" />
      </div>
      <MDCRenderer
        v-else-if="ast"
        :body="ast.body"
        :data="ast.data"
        class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!"
      />
    </template>
  </div>
</template>
