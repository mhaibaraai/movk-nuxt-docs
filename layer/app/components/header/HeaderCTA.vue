<script lang="ts" setup>
const { isEnabled: isAiChatEnabled } = useAIChat()
</script>

<template>
  <div v-if="isAiChatEnabled" class="hidden md:block">
    <AiChat />
  </div>
</template>
