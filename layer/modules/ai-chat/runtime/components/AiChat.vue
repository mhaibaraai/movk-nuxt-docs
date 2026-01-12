<script setup lang="ts">
const { aiChat } = useAppConfig()
const { toggle } = useAIChat()
</script>

<template>
  <UTooltip :text="aiChat.texts.trigger">
    <UButton
      :icon="aiChat.icons.trigger"
      variant="ghost"
      class="rounded-full"
      @click="toggle"
    />
  </UTooltip>
</template>
