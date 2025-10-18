<!-- https://github.com/nuxt/ui/blob/v4/docs/app/components/content/HighlightInlineType.vue -->
<script setup lang="ts">
import { hash } from 'ohash'

const props = defineProps<{
  type: string
}>()

const type = computed(() => {
  let type = props.type
  if (type.includes(', "as" | "asChild" | "forceMount">')) {
    type = type.replace(`, "as" | "asChild" | "forceMount">`, ``).replace('Omit<', '')
  }
  if (type.includes(', "as" | "asChild">')) {
    type = type.replace(', "as" | "asChild">', '').replace('Omit<', '')
  }
  if (type.startsWith('undefined |')) {
    type = type.replace('undefined |', '')
  }
  if (type.endsWith('| undefined')) {
    type = type.replace('| undefined', '')
  }

  return type
})

const { data: ast } = await useAsyncData(`hightlight-inline-code-${hash(type.value).slice(0, 10)}`, () => parseMarkdown(`\`${type.value}\`{lang="ts-type"}`), {
  watch: [type]
})
</script>

<template>
  <ClientOnly>
    <MDCRenderer v-if="ast?.body" :body="ast.body" :data="ast.data || {}" />
    <template #fallback>
      <ProseCode>{{ type }}</ProseCode>
    </template>
  </ClientOnly>
</template>
