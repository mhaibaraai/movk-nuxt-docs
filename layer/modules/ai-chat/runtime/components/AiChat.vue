<script setup lang="ts">
const { aiChat } = useAppConfig()
const { toggleChat } = useAIChat()
const { t } = useMovkI18n()

const triggerLabel = computed(() => aiChat.texts?.trigger || t('assistant.trigger'))
</script>

<template>
  <UTooltip :text="triggerLabel">
    <UButton
      :icon="aiChat.icons?.trigger ?? ''"
      variant="ghost"
      class="rounded-full"
      :aria-label="triggerLabel"
      @click="toggleChat"
    />
  </UTooltip>
</template>
