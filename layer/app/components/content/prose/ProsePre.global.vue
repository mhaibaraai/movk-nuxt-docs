<script setup lang="ts">
import type { ProsePreProps } from '@nuxt/ui'
// @ts-ignore
import NuxtUIProsePre from '@nuxt/ui/components/prose/Pre.vue'

const props = defineProps<ProsePreProps>()
const attrs = useAttrs()

const isMermaid = computed(() => props.language === 'mermaid')
const isTwoslash = computed(() => {
  const classAndMeta = [
    props.class,
    props.meta,
    attrs.class,
    attrs.className,
    attrs['class-name'],
    attrs.meta
  ]
    .filter(Boolean)
    .join(' ')

  return /\btwoslash\b/.test(classAndMeta)
})

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
  <ClientOnly v-else-if="isTwoslash">
    <NuxtUIProsePre v-bind="props">
      <slot />
    </NuxtUIProsePre>

    <template #fallback>
      <NuxtUIProsePre v-bind="props">
        <code v-if="props.code">{{ props.code }}</code>
      </NuxtUIProsePre>
    </template>
  </ClientOnly>
  <NuxtUIProsePre v-else v-bind="props">
    <slot />
  </NuxtUIProsePre>
</template>
