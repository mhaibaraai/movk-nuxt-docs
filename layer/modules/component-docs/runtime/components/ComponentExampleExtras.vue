<script setup lang="ts">
// Fallback：消费方在 app/components/content/ComponentExampleExtras.vue 提供同名文件即可整体覆盖。
defineProps<{
  name: string
  camelName: string
  pascalName: string
  effectiveProps: Record<string, any>
  options?: Array<{ name: string, label: string, [k: string]: any }>
  wrapperContainer: HTMLElement | null
  componentContainer: HTMLElement | null
}>()
</script>

<template>
  <slot />
</template>
