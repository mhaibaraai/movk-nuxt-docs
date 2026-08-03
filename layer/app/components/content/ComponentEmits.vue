<script setup lang="ts">
import { camelCase, kebabCase } from 'scule'

const props = defineProps<{
  /**
   * 获取组件事件的 slug 标识
   * @defaultValue 路由路径的最后一段
   */
  slug?: string
}>()

const route = useRoute()
const componentName = camelCase(props.slug ?? route.path.split('/').pop() ?? '')

const { data: meta } = await useFetchComponentMeta(componentName as any)
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Event
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="event in (meta?.meta?.events || [])" :key="event.name">
        <ProseTd>
          <ProseCode>
            {{ event.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="event.type" :type="event.type" />

          <div v-if="event.signature" class="mt-1">
            <HighlightInlineType :type="event.signature" />
          </div>

          <MDC
            v-if="event.description"
            :value="event.description"
            class="text-toned mt-1"
            :cache-key="`${kebabCase(route.path)}-event-${event.name}-description`"
          />

          <ComponentPropsLinks v-if="event.tags?.length" :prop="event" kind="event" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
