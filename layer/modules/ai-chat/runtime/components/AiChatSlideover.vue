<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { useClipboard } from '@vueuse/core'
import { getRandomUUID } from '@movk/core'
import AiChatPreStream from './AiChatPreStream.vue'

export interface FaqCategory {
  category: string
  items: string[]
}

const {
  title = 'AI 助手',
  description = ' ',
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

const toast = useToast()
const clipboard = useClipboard()
const { model } = useModels()
const { messages, isOpen, pendingMessage, clearPending } = useAIChat()
const { apiPath } = useRuntimeConfig().public.aiChat

const input = ref('Tailwind CSS best practices')

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

const chat = new Chat({
  id: getRandomUUID(),
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: apiPath
  }),
  onFinish: () => {
    messages.value = chat.messages
  },
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-circle-alert',
      color: 'error',
      duration: 0
    })
  }
})

function askQuestion(question: string) {
  chat.sendMessage({
    text: question
  })
}

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

function resetChat() {
  chat.stop()
  messages.value = []
  chat.messages.length = 0
}

const copied = ref(false)

function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(getTextFromMessage(message))

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
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
    :dismissible="false"
    :description="description"
    :modal="false"
    :close="{ size: 'sm' }"
    :ui="{ body: 'flex', title: 'flex w-100 pr-6' }"
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
      <UChatPalette :ui="{ prompt: 'border-0 px-2.5' }">
        <template #body>
          <UChatMessages
            should-auto-scroll
            :messages="chat.messages"
            :status="chat.status"
            :assistant="chat.status !== 'streaming' ? { actions: [{ label: 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] } : { actions: [] }"
            :spacing-offset="160"
            class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
          >
            <template #content="{ message }">
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
              </template>
            </template>
          </UChatMessages>
        </template>
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
