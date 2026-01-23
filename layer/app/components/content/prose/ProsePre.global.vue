<script setup lang="ts">
import type { ProsePreProps } from '@nuxt/ui'
// @ts-ignore
import NuxtUIProsePre from '@nuxt/ui/components/prose/Pre.vue'
import Mermaid from '../Mermaid.vue'

const props = defineProps<ProsePreProps>()

const isMermaid = computed(() => props.language === 'mermaid')
</script>

<template>
  <Mermaid
    v-if="isMermaid"
    :code="props.code || ''"
    :filename="props.filename"
    :icon="props.icon"
  />
  <NuxtUIProsePre v-else v-bind="props">
    <slot />
  </NuxtUIProsePre>
</template>
