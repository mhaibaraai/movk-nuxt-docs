<script setup lang="ts">
import { camelCase } from 'scule'

const props = defineProps<{
  /**
   * The slug of the component to fetch emits for.
   * @defaultValue route path's last segment
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
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
