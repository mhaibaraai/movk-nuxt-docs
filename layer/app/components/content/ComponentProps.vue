<script setup lang="ts">
import type { ComponentMeta } from 'vue-component-meta'
import { camelCase, kebabCase } from 'scule'

const { ignore = [], slug } = defineProps<{
  /**
   * The slug of the component to fetch props for.
   * @defaultValue route path's last segment
   */
  slug?: string
  /**
   * An array of prop names to ignore.
   */
  ignore?: string[]
}>()

const route = useRoute()

const componentName = camelCase(slug ?? route.path.split('/').pop() ?? '')
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
