<script setup lang="ts">
const { isStreaming = false } = defineProps<{
  /**
   * 思考过程的文本内容
   */
  text: string
  /**
   * 是否正在流式接收思考内容
   * @defaultValue false
   */
  isStreaming?: boolean
}>()

const open = ref(false)
const { ui, aiChat } = useAppConfig()

watch(() => isStreaming, () => {
  open.value = isStreaming
}, { immediate: true })

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/^#+\s+/gm, '') // Remove headers
}
</script>

<template>
  <UCollapsible v-model:open="open" class="flex flex-col gap-1 my-5">
    <UButton
      class="p-0 group"
      color="neutral"
      variant="link"
      :trailing-icon="aiChat.icons.streaming || ui.icons.chevronDown"
      :ui="{
        trailingIcon: text.length > 0 ? 'group-data-[state=open]:rotate-180 transition-transform duration-200' : 'hidden'
      }"
      :label="isStreaming ? aiChat.texts.streaming : aiChat.texts.streamed"
    />

    <template #content>
      <div v-for="(value, index) in cleanMarkdown(text).split('\n').filter(Boolean)" :key="index">
        <span class="whitespace-pre-wrap text-sm text-muted font-normal">{{ value }}</span>
      </div>
    </template>
  </UCollapsible>
</template>
