<script setup lang="ts">
import { kebabCase } from 'scule'
import type { PropertyMeta } from 'vue-component-meta'

const { prop, kind = 'prop' } = defineProps<{
  prop: Pick<PropertyMeta, 'name' | 'tags'>
  /**
   * 元数据类别，用于区分 MDC 缓存键
   * @defaultValue 'prop'
   */
  kind?: string
}>()

const route = useRoute()

const links = computed(() => prop.tags?.filter(tag => tag.name === 'link' || tag.name === 'see'))
</script>

<template>
  <ProseUl v-if="links?.length">
    <ProseLi v-for="(link, index) in links" :key="index">
      <MDC :value="link.text ?? ''" class="my-1" :cache-key="`${kebabCase(route.path)}-${kind}-${prop.name}-link-${index}`" />
    </ProseLi>
  </ProseUl>
</template>
