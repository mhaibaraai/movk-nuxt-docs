<script setup lang="ts">
// 兜底空实现：消费方在组件目录中提供同名组件（如 app/components/content/ComponentExampleExtras.vue）即可覆盖
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
