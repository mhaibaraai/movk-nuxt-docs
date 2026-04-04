<script setup lang="ts">
import type { ProsePreProps } from '@nuxt/ui'
// @ts-ignore - #build alias only available at Nuxt build time
import NuxtUIProsePre from '@nuxt/ui/components/prose/Pre.vue'

const props = defineProps<ProsePreProps>()

const MermaidComponent = computed(() => {
  if (props.language !== 'mermaid') return null
  const resolved = resolveComponent('ProseMermaid')
  return typeof resolved === 'string' ? null : resolved
})
</script>

<template>
  <component
    :is="MermaidComponent"
    v-if="MermaidComponent"
    :code="props.code || ''"
    :filename="props.filename"
    :icon="props.icon"
  />

  <NuxtUIProsePre v-else v-bind="props">
    <slot />
  </NuxtUIProsePre>
</template>
