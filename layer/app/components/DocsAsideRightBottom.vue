<script setup lang="ts">
const route = useRoute()
const pageUrl = route.path

const { aiChat } = useAppConfig()
const { isEnabled, open } = useAIChat()

const showExplainWithAi = computed(() => {
  return isEnabled.value && aiChat.explainWithAi !== false
})
</script>

<template>
  <UButton
    v-if="showExplainWithAi"
    :icon="aiChat.icons.explain"
    target="_blank"
    :label="aiChat.texts.explainWithAi"
    size="sm"
    variant="ghost"
    color="neutral"
    @click="open(`解释此页面 ${pageUrl}`, true)"
  />
</template>
