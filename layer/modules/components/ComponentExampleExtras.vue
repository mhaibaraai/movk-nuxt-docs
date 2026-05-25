<script setup lang="ts">
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
  <!-- Fallback: 消费方未自定义 ComponentExampleExtras 时由 layer 模块注册。 -->
  <slot />
</template>
