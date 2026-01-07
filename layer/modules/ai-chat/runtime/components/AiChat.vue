<script setup lang="ts">
const { tooltipText = '向 AI 提问' } = defineProps<{
  /**
   * 鼠标悬停时的提示文本
   * @defaultValue 向 AI 提问
   */
  tooltipText?: string
}>()

const { toggle } = useAIChat()
</script>

<template>
  <UTooltip :text="tooltipText">
    <UButton
      icon="i-lucide-sparkles"
      variant="ghost"
      class="rounded-full"
      @click="toggle"
    />
  </UTooltip>
</template>
