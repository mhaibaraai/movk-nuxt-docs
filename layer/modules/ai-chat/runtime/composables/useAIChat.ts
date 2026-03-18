import type { UIMessage } from 'ai'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'

export const useAIChat = createSharedComposable(() => {
  const config = useRuntimeConfig()
  const site = useSiteConfig()

  const isEnabled = computed(() => config.public.aiChat?.enabled ?? false)

  const storageOpen = useLocalStorage(`${site.name}-ai-chat-open`, false)
  const messages = useLocalStorage<UIMessage[]>(`${site.name}-ai-chat-messages`, [])

  const isOpen = ref(false)

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
      parts: [{ type: 'text', text: text }]
    }]
    isOpen.value = true
  }

  return {
    isEnabled,
    isOpen,
    messages,
    toggleChat,
    open
  }
})
