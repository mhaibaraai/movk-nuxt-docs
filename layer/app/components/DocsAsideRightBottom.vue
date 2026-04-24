<script setup lang="ts">
const { aiChat } = useAppConfig()
const { isEnabled, open } = useAIChat()

const showExplainWithAi = computed(() => {
  return isEnabled.value && aiChat.explainWithAi !== false
})
</script>

<template>
  <UButton
    v-if="showExplainWithAi"
    :icon="aiChat.icons?.explain ?? ''"
    target="_blank"
    :label="aiChat.texts?.explainWithAi ?? ''"
    size="sm"
    variant="ghost"
    color="neutral"
    @click="open('Read this documentation page and summarize it. I want to ask questions about it.')"
  />
</template>
