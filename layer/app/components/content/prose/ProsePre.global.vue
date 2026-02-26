<script setup lang="ts">
import type { ProsePreProps } from '@nuxt/ui'
// @ts-ignore
import NuxtUIProsePre from '@nuxt/ui/components/prose/Pre.vue'

const props = defineProps<ProsePreProps>()

const isMermaid = computed(() => props.language === 'mermaid')

// 动态解析 Mermaid 组件（仅在 mermaid 模块启用时可用）
const MermaidComponent = computed(() => {
  if (!isMermaid.value) return null
  const resolved = resolveComponent('Mermaid')
  return typeof resolved === 'string' ? null : resolved
})
</script>

<template>
  <component
    :is="MermaidComponent"
    v-if="isMermaid && MermaidComponent"
    :code="props.code || ''"
    :filename="props.filename"
    :icon="props.icon"
  />
  <NuxtUIProsePre v-else v-bind="props">
    <slot />
  </NuxtUIProsePre>
</template>
