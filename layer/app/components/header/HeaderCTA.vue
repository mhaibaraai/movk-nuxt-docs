<script lang="ts" setup>
const { aiChat } = useRuntimeConfig().public
const route = useRoute()
</script>

<template>
  <div v-if="aiChat.enable" class="hidden md:block">
    <UButton
      v-if="route.path === '/'"
      to="/docs"
      label="Get Started"
      variant="ghost"
      trailing
      icon="i-lucide-arrow-right"
    />
    <AiChat v-else />
  </div>
</template>
