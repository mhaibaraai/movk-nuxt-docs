<script setup lang="ts">
import { camelCase, kebabCase } from 'scule'

const props = defineProps<{
  /**
   * 获取组件插槽的 slug 标识
   * @defaultValue 路由路径的最后一段
   */
  slug?: string
}>()

const route = useRoute()

const componentName = camelCase(props.slug ?? route.path.split('/').pop() ?? '')
const meta = await fetchComponentMeta(componentName as any)
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Slot
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="slot in (meta?.meta?.slots || [])" :key="slot.name">
        <ProseTd>
          <ProseCode>
            {{ slot.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="slot.type" :type="slot.type" />

          <MDC
            v-if="slot.description"
            :value="slot.description"
            class="text-toned mt-1"
            :cache-key="`${kebabCase(route.path)}-${slot.name}-description`"
          />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
