import type { DocsChatMessage } from '../server/api/ai-chat'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { kebabCase } from '@movk/core'

export const useAIChat = createSharedComposable(() => {
  const config = useRuntimeConfig()
  const site = useSiteConfig()
  const route = useRoute()
  const name = kebabCase(site.name)

  const isEnabled = computed(() => config.public.aiChat?.enabled ?? false)

  const storageOpen = useLocalStorage(`${name}-ai-chat-open`, false)
  const messages = useLocalStorage<DocsChatMessage[]>(`${name}-ai-chat-messages`, [])

  const isOpen = ref(false)
  const currentPage = computed(() => route.path)

  onNuxtReady(() => {
    nextTick(() => {
      isOpen.value = storageOpen.value
    })
  })

  watch(isOpen, (value) => {
    storageOpen.value = value
  })

  function toggleChat() {
    isOpen.value = !isOpen.value
  }

  function open(text: string) {
    messages.value = [...messages.value, {
      id: String(Date.now()),
      role: 'user',
      parts: [{ type: 'text', text: text }],
      metadata: { currentPage: currentPage.value }
    }]
    isOpen.value = true
  }

  return {
    isEnabled,
    isOpen,
    messages,
    currentPage,
    toggleChat,
    open
  }
})
