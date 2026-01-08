<script setup lang="ts">
import type { ComponentMeta } from 'vue-component-meta'
import { camelCase, kebabCase, upperFirst } from 'scule'
import { decodeUnicodeEscapes } from '../../utils/unicode'

const { ignore = [
  'activeClass',
  'inactiveClass',
  'exactActiveClass',
  'ariaCurrentValue',
  'href',
  'rel',
  'noRel',
  'prefetch',
  'prefetchOn',
  'noPrefetch',
  'prefetchedClass',
  'replace',
  'exact',
  'exactQuery',
  'exactHash',
  'external',
  'onClick',
  'viewTransition',
  'enterKeyHint',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget'
], slug, prose } = defineProps<{
  /**
   * 获取组件属性的 slug 标识
   * @defaultValue 路由路径的最后一段
   */
  slug?: string
  /**
   * 需要忽略的属性名数组
   */
  ignore?: string[]
  prose?: boolean
}>()

const route = useRoute()
const camelName = camelCase(slug ?? route.path.split('/').pop() ?? '')
const componentName = prose ? `Prose${upperFirst(camelName)}` : `${upperFirst(camelName)}`
const meta = await fetchComponentMeta(componentName as any)

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!meta?.meta?.props?.length) {
    return []
  }

  return meta.meta.props.filter((prop) => {
    return !ignore?.includes(prop.name)
  }).map((prop) => {
    if (prop.default) {
      prop.default = prop.default.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\'')
      prop.default = decodeUnicodeEscapes(prop.default)
    } else {
      const tag = prop.tags?.find(tag => tag.name === 'defaultValue')?.text
      if (tag) {
        prop.default = tag
      }
    }

    // @ts-expect-error - Type is not correct
    prop.type = !prop.type.startsWith('boolean') && prop.schema?.kind === 'enum' && Object.keys(prop.schema.schema)?.length ? Object.values(prop.schema.schema).map(schema => schema?.type ? schema.type : schema).join(' | ') : prop.type
    return prop
  }).sort((a, b) => {
    if (a.name === 'as') {
      return -1
    }

    if (b.name === 'as') {
      return 1
    }

    if (a.name === 'ui') {
      return 1
    }

    if (b.name === 'ui') {
      return -1
    }

    return 0
  })
})
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Prop
        </ProseTh>
        <ProseTh>
          Default
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="prop in metaProps" :key="prop.name">
        <ProseTd>
          <ProseCode>
            {{ prop.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.default" :type="prop.default" />
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.type" :type="prop.type" />

          <MDC
            v-if="prop.description"
            :value="prop.description"
            class="text-toned mt-1"
            :cache-key="`${kebabCase(route.path)}-${prop.name}-description`"
          />

          <ComponentPropsLinks v-if="prop.tags?.length" :prop="prop" />
          <ComponentPropsSchema v-if="prop.schema" :prop="prop" :ignore="ignore" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
