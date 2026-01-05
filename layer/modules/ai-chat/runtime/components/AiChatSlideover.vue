<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { getRandomUUID } from '@movk/core'
import AiChatPreStream from './AiChatPreStream.vue'
import type { FaqCategory } from './AiChatSlideoverFaq.vue'

const {
  title = 'AI 助手',
  description = '向 AI 提问',
  placeholder = '输入你的问题...'
} = defineProps<{
  title?: string
  description?: string
  placeholder?: string
  faqQuestions?: FaqCategory[]
}>()

const components = {
  pre: AiChatPreStream as unknown as DefineComponent
}

const { messages, isOpen, pendingMessage, clearPending } = useAIChat()
const { apiPath } = useRuntimeConfig().public.aiChat

const { getToolLabel } = useTools()
const { model } = useModels()

const input = ref('')

watch(pendingMessage, (message) => {
  if (message) {
    if (messages.value.length === 0 && chat.messages.length > 0) {
      chat.messages.length = 0
    }
    chat.sendMessage({
      text: message
    })
    clearPending()
  }
}, { immediate: true })

watch(messages, (newMessages) => {
  if (newMessages.length === 0 && chat.messages.length > 0) {
    chat.messages.length = 0
  }
}, { deep: true })

const toast = useToast()
const lastMessage = computed(() => chat.messages.at(-1))
const showThinking = computed(() =>
  chat.status === 'streaming'
  && lastMessage.value?.role === 'assistant'
  && lastMessage.value?.parts?.length === 0
)

const chat = new Chat({
  id: getRandomUUID(),
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: apiPath,
    body: () => ({ model: model.value })
  }),
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-circle-alert',
      color: 'error',
      duration: 0
    })
  },
  onFinish: () => {
    messages.value = chat.messages
  }
})

function handleSubmit(event?: Event) {
  event?.preventDefault()

  if (!input.value.trim()) {
    return
  }

  chat.sendMessage({
    text: input.value
  })

  input.value = ''
}

function askQuestion(question: string) {
  chat.sendMessage({
    text: question
  })
}

function resetChat() {
  chat.stop()
  messages.value = []
  chat.messages.length = 0
}

onMounted(() => {
  if (pendingMessage.value) {
    chat.sendMessage({
      text: pendingMessage.value
    })
    clearPending()
  } else if (chat.lastMessage?.role === 'user') {
    chat.regenerate()
  }
})
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    :description="description"
    :close="{ size: 'sm' }"
    :ui="{
      body: 'flex',
      title: 'flex w-100 pr-6',
      overlay: 'bg-default/60 backdrop-blur-sm',
      content: 'w-full sm:max-w-md bg-default/95 backdrop-blur-xl shadow-2xl'
    }"
  >
    <template #title>
      <div class="flex items-center gap-2 flex-1">
        <UBadge icon="i-lucide-sparkles" variant="soft" square />
        <span class="font-medium text-highlighted">{{ title }}</span>
      </div>

      <UTooltip v-if="chat.messages.length > 0" text="清空聊天">
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="resetChat"
        />
      </UTooltip>
    </template>

    <template #body>
      <UChatPalette class="flex-1" :ui="{ prompt: 'border-0 px-2.5' }">
        <UChatMessages
          v-if="chat.messages.length > 0"
          should-auto-scroll
          :messages="chat.messages"
          :status="chat.status"
          :user="{ ui: { content: 'text-sm' } }"
          :ui="{ indicator: '*:bg-accented' }"
        >
          <template #content="{ message }">
            <div class="flex flex-col gap-2">
              <div v-if="showThinking && message.role === 'assistant'">
                <TextShimmer text="思考中..." />
              </div>
              <template
                v-for="(part, index) in message.parts"
                :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
              >
                <Reasoning v-if="part.type === 'reasoning'" :text="part.text" :is-streaming="part.state !== 'done'" />
                <MDCCached
                  v-else-if="part.type === 'text'"
                  :value="part.text"
                  :cache-key="`${message.id}-${index}`"
                  :components="components"
                  :parser-options="{ highlight: false }"
                  class="*:first:mt-0 *:last:mb-0"
                />
                <template v-else-if="part.type === 'data-tool-calls'">
                  <AiChatToolCall
                    v-for="tool in (part as any).data.tools"
                    :key="tool.toolCallId"
                    :text="getToolLabel(tool.toolName, tool.input)"
                    :is-loading="false"
                  />
                </template>
              </template>
            </div>
          </template>
        </UChatMessages>
        <div v-else class="flex-1 overflow-y-auto px-4 py-4">
          <p class="text-sm font-medium text-muted mb-4">
            FAQ 建议
          </p>
          <AiChatSlideoverFaq :faq-questions="faqQuestions" @ask-question="askQuestion" />
        </div>
        <template #prompt>
          <UChatPrompt
            v-model="input"
            :error="chat.error"
            :placeholder="placeholder"
            variant="subtle"
            class="[view-transition-name:chat-prompt]"
            :ui="{ base: 'px-1.5 text-sm' }"
            @submit="handleSubmit"
          >
            <template #footer>
              <div class="flex items-center gap-1">
                <ModelSelect v-model="model" />
                <div class="flex gap-1 justify-between items-center px-1 text-xs text-dimmed">
                  换行
                  <UKbd value="shift" />
                  <UKbd value="enter" />
                </div>
              </div>

              <UChatPromptSubmit
                :status="chat.status"
                color="neutral"
                size="sm"
                @stop="chat.stop()"
                @reload="chat.regenerate()"
              />
            </template>
          </UChatPrompt>
        </template>
      </UChatPalette>
    </template>
  </USlideover>
</template>
