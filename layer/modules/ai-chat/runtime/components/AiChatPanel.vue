<script setup lang="ts">
import type { DefineComponent } from 'vue'
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { createReusableTemplate } from '@vueuse/core'
import AiChatPreStream from './AiChatPreStream.vue'
import { useModels } from '../composables/useModels'

const components = {
  pre: AiChatPreStream as unknown as DefineComponent
}

const [DefineChatContent, ReuseChatContent] = createReusableTemplate<{ showExpandButton?: boolean }>()

const { isOpen, isExpanded, isMobile, panelWidth, toggleExpanded, messages, pendingMessage, clearPending, faqQuestions } = useAIChat()
const config = useRuntimeConfig()
const { aiChat } = useAppConfig()
const toast = useToast()
const { model } = useModels()

const input = ref('')

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: config.public.aiChat.apiPath,
    body: () => ({ model: model.value })
  }),
  onError: (error: Error) => {
    const message = (() => {
      try {
        const parsed = JSON.parse(error.message)
        return parsed?.message || error.message
      } catch {
        return error.message
      }
    })()

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

watch(pendingMessage, (message: string | undefined) => {
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

watch(messages, (newMessages: UIMessage[]) => {
  if (newMessages.length === 0 && chat.messages.length > 0) {
    chat.messages.length = 0
  }
}, { deep: true })

const lastMessage = computed(() => chat.messages.at(-1))

const { tools } = useToolCall()
function getToolLabel(toolName: string, args?: any): string {
  const label = tools[toolName]

  if (!label) {
    return toolName
  }

  return typeof label === 'function' ? label(args) : label
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
  <DefineChatContent v-slot="{ showExpandButton = true }">
    <div class="flex h-full flex-col">
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-muted/50 px-4">
        <span class="font-medium text-highlighted">{{ aiChat.texts.title }}</span>
        <div class="flex items-center gap-1">
          <UTooltip
            v-if="showExpandButton"
            :text="isExpanded ? aiChat.texts.collapse : aiChat.texts.expand"
          >
            <UButton
              :icon="isExpanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-muted hover:text-highlighted"
              @click="toggleExpanded"
            />
          </UTooltip>
          <UTooltip
            v-if="chat.messages.length > 0"
            :text="aiChat.texts.clearChat"
          >
            <UButton
              :icon="aiChat.icons.clearChat"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-muted hover:text-highlighted"
              @click="resetChat"
            />
          </UTooltip>
          <UTooltip :text="aiChat.texts.close">
            <UButton
              :icon="aiChat.icons.close"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-muted hover:text-highlighted"
              @click="isOpen = false"
            />
          </UTooltip>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <UChatMessages
          v-if="chat.messages.length > 0"
          should-auto-scroll
          :messages="chat.messages"
          compact
          :status="chat.status"
          :user="{ ui: { container: 'pb-2', content: 'text-sm' } }"
          :ui="{ indicator: '*:bg-accented', root: 'h-auto!' }"
          class="px-4 py-4"
        >
          <template #content="{ message }">
            <div class="flex flex-col gap-2">
              <template
                v-for="(part, index) in message.parts"
                :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
              >
                <AiChatReasoning v-if="part.type === 'reasoning'" :text="part.text" :is-streaming="part.state !== 'done'" />

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
                    :key="`${tool.toolCallId}-${JSON.stringify(tool.args)}`"
                    :text="getToolLabel(tool.toolName, tool.args)"
                    :is-loading="false"
                  />
                </template>

                <UButton
                  v-if="chat.status === 'streaming' && message.id === lastMessage?.id"
                  class="px-0"
                  color="neutral"
                  variant="link"
                  size="sm"
                  :label="aiChat.texts.loading"
                  loading
                  :loading-icon="aiChat.icons.loading"
                />
              </template>
            </div>
          </template>
        </UChatMessages>

        <div
          v-else
          class="p-4"
        >
          <div
            v-if="!faqQuestions?.length"
            class="flex h-full flex-col items-center justify-center py-12 text-center"
          >
            <div class="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <UIcon
                name="i-lucide-message-circle-question"
                class="size-6 text-primary"
              />
            </div>
            <h3 class="mb-2 text-base font-medium text-highlighted">
              {{ aiChat.texts.askAnything }}
            </h3>
            <p class="max-w-xs text-sm text-muted">
              {{ aiChat.texts.askMeAnythingDescription }}
            </p>
          </div>

          <template v-else>
            <p class="mb-4 text-sm font-medium text-muted">
              {{ aiChat.texts.faq }}
            </p>

            <AiChatSlideoverFaq :faq-questions="faqQuestions" @ask-question="askQuestion" />
          </template>
        </div>
      </div>

      <div class="w-full shrink-0 p-3">
        <UChatPrompt
          v-model="input"
          :rows="2"
          class="text-sm"
          :placeholder="aiChat.texts.placeholder"
          :ui="{
            root: 'shadow-none!',
            body: '*:p-0! *:rounded-none!'
          }"
          @submit="handleSubmit"
        >
          <template #footer>
            <div class="hidden items-center divide-x divide-muted/50 sm:flex">
              <AiChatModelSelect v-model="model" />
              <div class="flex gap-1 justify-between items-center px-1 text-xs text-dimmed">
                <span>{{ aiChat.texts.lineBreak }}</span>
                <UKbd value="shift" />
                <UKbd value="enter" />
              </div>
            </div>

            <UChatPromptSubmit
              class="ml-auto"
              size="xs"
              :status="chat.status"
              @stop="chat.stop()"
              @reload="chat.regenerate()"
            />
          </template>
        </UChatPrompt>
      </div>
    </div>
  </DefineChatContent>

  <aside
    v-if="!isMobile"
    class="fixed top-0 z-50 h-dvh overflow-hidden border-l border-muted/50 bg-default/95 backdrop-blur-xl transition-[right,width] duration-200 ease-linear will-change-[right,width]"
    :style="{
      width: `${panelWidth}px`,
      right: isOpen ? '0' : `-${panelWidth}px`
    }"
  >
    <div
      class="h-full transition-[width] duration-200 ease-linear"
      :style="{ width: `${panelWidth}px` }"
    >
      <ReuseChatContent :show-expand-button="true" />
    </div>
  </aside>

  <USlideover
    v-else
    v-model:open="isOpen"
    side="right"
    :ui="{
      content: 'ring-0 bg-default'
    }"
  >
    <template #content>
      <ReuseChatContent :show-expand-button="false" />
    </template>
  </USlideover>
</template>
