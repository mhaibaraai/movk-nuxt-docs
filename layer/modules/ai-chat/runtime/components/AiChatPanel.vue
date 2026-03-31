<script setup lang="ts">
import type { DefineComponent } from 'vue'
import type { FaqCategory, FaqQuestions, ToolPart, ToolState } from '../types'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport, getToolName, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai'
import { computed } from 'vue'
import { isReasoningStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { useModels } from '../composables/useModels'
import { splitByCase, upperFirst } from 'scule'
import AiChatPreStream from './AiChatPreStream.vue'
import { useMemoize } from '@vueuse/core'

const components = {
  pre: AiChatPreStream as unknown as DefineComponent
}

const { isOpen, messages } = useAIChat()
const toast = useToast()
const config = useRuntimeConfig()
const { aiChat } = useAppConfig()
const { model } = useModels()

const canClear = computed(() => messages.value.length > 0)

const input = ref('')
let _skipSync = false

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: config.public.aiChat.apiPath,
    body: () => ({ model: model.value })
  }),
  onError: (error: Error) => {
    let message = error.message
    if (typeof message === 'string' && message[0] === '{') {
      try {
        message = JSON.parse(message).message || message
      } catch {
        // keep original message on malformed JSON
      }
    }

    toast.add({
      description: message,
      icon: 'i-lucide-circle-alert',
      color: 'error',
      duration: 0
    })
  },
  onFinish: () => {
    _skipSync = true
    messages.value = chat.messages
    nextTick(() => {
      _skipSync = false
    })
  }
})

watch(messages, (newMessages) => {
  if (_skipSync) return

  chat.messages = newMessages
  if (chat.lastMessage?.role === 'user') {
    chat.regenerate()
  }
})

function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}

function getToolMessage(state: ToolState, toolName: string, input: Record<string, string | undefined>) {
  const { toolMessage } = useToolCall(state, toolName, input)
  const searchVerb = state === 'output-available' ? '已搜索' : '搜索中'
  const readVerb = state === 'output-available' ? '已读取' : '读取中'

  return {
    'list-getting-started-guides': `${searchVerb} 入门指南`,
    'list-pages': `${searchVerb} 所有文档页面`,
    'list-examples': `${searchVerb} 所有示例`,
    'get-page': `${readVerb} ${input.path || ''} 页面`,
    'get-example': `${readVerb} ${upperName(input.exampleName || '')} 示例`,
    ...toolMessage
  }[toolName] || `${searchVerb} ${toolName}`
}

const getCachedToolMessage = useMemoize((state: ToolState, toolName: string, input: string) =>
  getToolMessage(state, toolName, JSON.parse(input))
)

function getToolText(part: ToolPart) {
  return getCachedToolMessage(part.state, getToolName(part), JSON.stringify(part.input || {}))
}

function getToolIcon(part: ToolPart): string {
  const toolName = getToolName(part)
  const { toolIcon } = useToolCall(part.state, toolName, part.input || {} as any)

  const iconMap: Record<string, string> = {
    'get-page': 'i-lucide-book-open',
    'get-example': 'i-lucide-codepen',
    'list-examples': 'i-lucide-codesandbox',
    'list-getting-started-guides': 'i-lucide-square-play',
    'list-pages': 'i-lucide-book-minus',
    ...toolIcon
  }

  return iconMap[toolName] || 'i-lucide-search'
}

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  chat.sendMessage({ text: input.value })

  input.value = ''
}

function askQuestion(question: string) {
  input.value = question
  onSubmit()
}

function clearMessages() {
  if (chat.status === 'streaming') {
    chat.stop()
  }
  messages.value = []
  chat.messages = []
}

function normalizeFaqQuestions(questions: FaqQuestions): FaqCategory[] {
  if (!questions || (Array.isArray(questions) && questions.length === 0)) {
    return []
  }

  if (typeof questions[0] === 'string') {
    return [{
      category: '问题',
      items: questions as string[]
    }]
  }

  return questions as FaqCategory[]
}

const faqQuestions = computed<FaqCategory[]>(() => {
  const faqConfig = aiChat?.faqQuestions
  if (!faqConfig) return []

  return normalizeFaqQuestions(faqConfig)
})
</script>

<template>
  <USidebar
    v-model:open="isOpen"
    side="right"
    :title="aiChat.texts?.title ?? ''"
    rail
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0.5' }"
  >
    <template #actions>
      <UTooltip v-if="canClear" :text="aiChat.texts?.clearChat ?? ''">
        <UButton
          :icon="aiChat.icons?.clearChat ?? ''"
          color="neutral"
          variant="ghost"
          :aria-label="aiChat.texts?.clearChat ?? ''"
          @click="clearMessages"
        />
      </UTooltip>
    </template>

    <template #close>
      <UTooltip :text="aiChat.texts?.close ?? ''">
        <UButton
          :icon="aiChat.icons?.close ?? ''"
          color="neutral"
          variant="ghost"
          :aria-label="aiChat.texts?.close ?? ''"
          @click="isOpen = false"
        />
      </UTooltip>
    </template>

    <UTheme
      :ui="{
        prose: {
          p: { base: 'my-2 text-sm/6' },
          li: { base: 'my-0.5 text-sm/6' },
          ul: { base: 'my-2' },
          ol: { base: 'my-2' },
          h1: { base: 'text-xl mb-4' },
          h2: { base: 'text-lg mt-6 mb-3' },
          h3: { base: 'text-base mt-4 mb-2' },
          h4: { base: 'text-sm mt-3 mb-1.5' },
          code: { base: 'text-xs' },
          pre: { root: 'my-2', base: 'text-xs/5' },
          table: { root: 'my-2' },
          hr: { base: 'my-4' }
        }
      }"
    >
      <UChatMessages
        v-if="chat.messages.length"
        should-auto-scroll
        :messages="chat.messages"
        :status="chat.status"
        compact
        class="px-0 gap-2"
        :user="{ ui: { container: 'max-w-full' } }"
      >
        <template #indicator>
          <UChatTool icon="i-lucide-brain" text="Thinking..." streaming />
        </template>

        <template #content="{ message }">
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <UChatReasoning
              v-if="isReasoningUIPart(part)"
              :text="part.text"
              :streaming="isReasoningStreaming(message, index, chat)"
              :icon="aiChat.icons?.reasoning ?? ''"
            >
              <MDCCached
                :value="part.text"
                :cache-key="`reasoning-${message.id}-${index}`"
                :parser-options="{ highlight: false }"
                class="*:first:mt-0 *:last:mb-0"
              />
            </UChatReasoning>
            <MDCCached
              v-else-if="isTextUIPart(part) && part.text.length > 0"
              :value="part.text"
              :cache-key="`${message.id}-${index}`"
              :components="components"
              :parser-options="{ highlight: false }"
              class="*:first:mt-0 *:last:mb-0"
            />
            <UChatTool
              v-else-if="isToolUIPart(part)"
              :text="getToolText(part)"
              :icon="getToolIcon(part)"
              :streaming="isToolStreaming(part)"
            />
          </template>
        </template>
      </UChatMessages>

      <div v-else class="flex flex-col gap-6">
        <UPageLinks
          v-for="category in faqQuestions"
          :key="category.category"
          :title="category.category"
          :links="category.items.map(item => ({ label: item, onClick: () => askQuestion(item) }))"
        />
      </div>
    </UTheme>

    <template #footer>
      <UChatPrompt
        v-model="input"
        :error="chat.error"
        :placeholder="aiChat.texts?.placeholder ?? ''"
        variant="naked"
        size="sm"
        autofocus
        :ui="{ base: 'px-0' }"
        class="px-4"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="flex items-center gap-x-1 text-xs text-muted">
            <AiChatModelSelect v-model="model" />

            <div class="flex gap-1 justify-between items-center px-1 text-xs text-muted">
              <span>{{ aiChat.texts?.lineBreak ?? '' }}</span>
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
    </template>
  </USidebar>
</template>
