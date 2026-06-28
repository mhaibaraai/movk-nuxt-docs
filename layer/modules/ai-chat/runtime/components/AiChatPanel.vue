<script setup lang="ts">
import type { FaqCategory, FaqQuestions, LocalizedFaqQuestions, ToolPart, ToolState } from '../types'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport, getToolName, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai'
import { computed } from 'vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { useModels } from '../composables/useModels'
import { splitByCase, upperFirst } from 'scule'
import { useMemoize } from '@vueuse/core'

const { isOpen, messages } = useAIChat()
const toast = useToast()
const route = useRoute()
const config = useRuntimeConfig()
const { aiChat } = useAppConfig()
const { model } = useModels()
const { t, locale, defaultLocale } = useMovkI18n()

const canClear = computed(() => messages.value.length > 0)

const texts = computed(() => ({
  title: aiChat.texts?.title || t('assistant.title'),
  clearChat: aiChat.texts?.clearChat || t('assistant.clearChat'),
  close: aiChat.texts?.close || t('assistant.close'),
  placeholder: aiChat.texts?.placeholder || t('assistant.placeholder'),
  lineBreak: aiChat.texts?.lineBreak || t('assistant.lineBreak'),
  thinking: t('assistant.thinking')
}))

const input = ref('')
let _skipSync = false

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: (config.app?.baseURL.replace(/\/$/, '') || '') + config.public.aiChat.apiPath,
    body: () => ({ model: model.value, currentPage: route.path.startsWith('/docs/') ? route.path : null })
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

type ToolDisplayInput = Record<string, string | undefined>
type ToolMessageBuilder = (state: ToolState, input: ToolDisplayInput) => string

const getSearchVerb = (state: ToolState) => t(state === 'output-available' ? 'assistant.verb.searched' : 'assistant.verb.searching')
const getReadVerb = (state: ToolState) => t(state === 'output-available' ? 'assistant.verb.read' : 'assistant.verb.reading')

const sectionSuffix = (value?: string) => value ? t('assistant.fmt.section', { value }) : ''
const searchSuffix = (value?: string) => value ? t('assistant.fmt.search', { value }) : ''

const builtinToolDisplayConfig: Record<string, { icon: string, message: ToolMessageBuilder }> = {
  'search-documentation': {
    icon: 'i-lucide-book-search',
    message: (state, input) => `${getSearchVerb(state)} ${t('assistant.tool.searchDocs')}${sectionSuffix(input.section)}${searchSuffix(input.search)}`
  },
  'get-documentation-page': {
    icon: 'i-lucide-book-open',
    message: (state, input) => `${getReadVerb(state)} ${t('assistant.tool.readPage', { path: input.path || '' })}`
  },
  'search-composables': {
    icon: 'i-lucide-braces',
    message: (state, input) => `${getSearchVerb(state)} ${t('assistant.tool.searchComposables')}${searchSuffix(input.search)}`
  },
  'search-icons': {
    icon: 'i-lucide-search',
    message: (state, input) => `${getSearchVerb(state)} ${t('assistant.tool.searchIcons')}${searchSuffix(input.query)}`
  },
  'list-examples': {
    icon: 'i-lucide-codesandbox',
    message: state => `${getSearchVerb(state)} ${t('assistant.tool.listExamples')}`
  },
  'get-example': {
    icon: 'i-lucide-codepen',
    message: (state, input) => `${getReadVerb(state)} ${t('assistant.tool.getExample', { name: upperName(input.exampleName || '') })}`
  },
  'get-component': {
    icon: 'i-lucide-box',
    message: (state, input) => `${getReadVerb(state)} ${t('assistant.tool.getComponent', { name: upperName(input.componentName || '') })}`
  },
  'get-component-metadata': {
    icon: 'i-lucide-file-code',
    message: (state, input) => `${getReadVerb(state)} ${t('assistant.tool.getComponentMeta', { name: upperName(input.componentName || '') })}`
  }
}

function getBuiltinToolDisplay(toolName: string) {
  return builtinToolDisplayConfig[toolName]
}

function getToolMessage(state: ToolState, toolName: string, input: Record<string, string | undefined>) {
  const { toolMessage } = useToolCall(state, toolName, input)
  const builtinDisplay = getBuiltinToolDisplay(toolName)

  return {
    [toolName]: builtinDisplay?.message(state, input),
    ...toolMessage
  }[toolName] || `${getSearchVerb(state)} ${toolName}`
}

const getCachedToolMessage = useMemoize((state: ToolState, toolName: string, input: string, _locale: string) =>
  getToolMessage(state, toolName, JSON.parse(input))
)

function getToolText(part: ToolPart) {
  return getCachedToolMessage(part.state, getToolName(part), JSON.stringify(part.input || {}), locale.value)
}

function getToolIcon(part: ToolPart): string {
  const toolName = getToolName(part)
  const { toolIcon } = useToolCall(part.state, toolName, part.input || {} as any)
  const builtinDisplay = getBuiltinToolDisplay(toolName)
  const iconMap: Record<string, string> = {
    [toolName]: builtinDisplay?.icon || '',
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
      category: t('assistant.faqCategory'),
      items: questions as string[]
    }]
  }

  return questions as FaqCategory[]
}

const faqQuestions = computed<FaqCategory[]>(() => {
  const faqConfig = aiChat?.faqQuestions
  if (!faqConfig) return []

  if (!Array.isArray(faqConfig)) {
    const localized = faqConfig as LocalizedFaqQuestions
    const questions = localized[locale.value] || localized[defaultLocale] || Object.values(localized)[0]
    return normalizeFaqQuestions(questions || [])
  }

  return normalizeFaqQuestions(faqConfig)
})

const promptRef = useTemplateRef('promptRef')
watch(isOpen, (value) => {
  if (value) {
    nextTick(() => {
      promptRef.value?.textareaRef?.focus()
    })
  }
})
</script>

<template>
  <USidebar
    v-model:open="isOpen"
    side="right"
    :title="texts.title"
    rail
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0.5' }"
  >
    <template #actions>
      <UTooltip v-if="canClear" :text="texts.clearChat">
        <UButton
          :icon="aiChat.icons?.clearChat ?? ''"
          color="neutral"
          variant="ghost"
          :aria-label="texts.clearChat"
          @click="clearMessages"
        />
      </UTooltip>
    </template>

    <template #close>
      <UTooltip :text="texts.close">
        <UButton
          :icon="aiChat.icons?.close ?? ''"
          color="neutral"
          variant="ghost"
          :aria-label="texts.close"
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
          <UChatTool icon="i-lucide-brain" :text="texts.thinking" streaming />
        </template>

        <template #content="{ message }">
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <UChatReasoning
              v-if="isReasoningUIPart(part)"
              :text="part.text"
              :streaming="isPartStreaming(part)"
              :icon="aiChat.icons?.reasoning ?? ''"
            >
              <AiComark
                :markdown="part.text"
                :streaming="isPartStreaming(part)"
              />
            </UChatReasoning>

            <template v-else-if="isTextUIPart(part) && part.text.length > 0">
              <AiComark
                v-if="message.role === 'assistant'"
                :markdown="part.text"
                :streaming="isPartStreaming(part)"
              />
              <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap text-sm/6">
                {{ part.text }}
              </p>
            </template>

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
        ref="promptRef"
        v-model="input"
        :error="chat.error"
        :placeholder="texts.placeholder"
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
              <span>{{ texts.lineBreak }}</span>
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
