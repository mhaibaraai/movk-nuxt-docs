<script setup lang="ts">
const { aiChat } = useAppConfig()
const { toggleChat } = useAIChat()
</script>

<template>
  <UTooltip :text="aiChat.texts?.trigger ?? ''">
    <UButton
      :icon="aiChat.icons?.trigger ?? ''"
      variant="ghost"
      class="rounded-full"
      :aria-label="aiChat.texts?.trigger ?? ''"
      @click="toggleChat"
    />
  </UTooltip>
</template>
