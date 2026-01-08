<script setup lang="ts">
const { aiChat } = useRuntimeConfig().public
const route = useRoute()

const pageUrl = route.path
const { open } = useAIChat()
const { faqQuestions } = useFaq()
</script>

<template>
  <div v-if="aiChat.enable">
    <UButton
      icon="i-lucide-brain"
      target="_blank"
      label="用 AI 解释此页面"
      size="sm"
      variant="ghost"
      color="neutral"
      @click="open(`解释此页面 ${pageUrl}`, true)"
    />
    <AiChatSlideover :faq-questions="faqQuestions" />

    <Teleport to="body">
      <ClientOnly>
        <LazyAiChatFloatingInput />
      </ClientOnly>
    </Teleport>
  </div>
</template>
