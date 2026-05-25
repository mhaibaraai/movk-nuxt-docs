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
  <!-- Layer default stub. Override in consumer app/components/content/ComponentExampleExtras.vue to inject Visualizer or other overlays. -->
  <slot />
</template>
