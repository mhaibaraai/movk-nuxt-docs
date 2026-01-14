<script setup lang="ts">
import { sleep } from '@movk/core'
import { AnimatePresence, motion } from 'motion-v'

const route = useRoute()
const { aiChat } = useAppConfig()
const { open, isOpen } = useAIChat()

const input = ref('')
const isVisible = ref(true)
const inputRef = ref<{ inputRef: HTMLInputElement } | null>(null)

const isDocsRoute = computed(() => route.meta.layout === 'docs')
const isFloatingInputEnabled = computed(() => aiChat.floatingInput !== false)
const focusInputShortcut = computed(() => aiChat.shortcuts.focusInput)

const shortcutDisplayKeys = computed(() => {
  const shortcut = focusInputShortcut.value
  const parts = shortcut.split('_')
  return parts.map(part => part === 'meta' ? 'meta' : part.toUpperCase())
})

function handleSubmit() {
  if (!input.value.trim()) return

  const message = input.value
  isVisible.value = false

  sleep(200).then(() => {
    open(message, true)
    input.value = ''
    isVisible.value = true
  })
}

const shortcuts = computed(() => ({
  [focusInputShortcut.value]: {
    usingInput: true,
    handler: () => {
      if (!isDocsRoute.value || !isFloatingInputEnabled.value) return
      inputRef.value?.inputRef?.focus()
    }
  },
  escape: {
    usingInput: true,
    handler: () => {
      inputRef.value?.inputRef?.blur()
    }
  }
}))

defineShortcuts(shortcuts)
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isFloatingInputEnabled && isDocsRoute && isVisible && !isOpen"
      key="floating-input"
      :initial="{ y: 20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :exit="{ y: 100, opacity: 0 }"
      :transition="{ duration: 0.2, ease: 'easeOut' }"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4"
      style="will-change: transform"
    >
      <form @submit.prevent="handleSubmit">
        <UInput
          ref="inputRef"
          v-model="input"
          :placeholder="aiChat.texts.placeholder"
          size="lg"
          :ui="{
            root: 'w-72 py-0.5 focus-within:w-96 transition-all duration-300 ease-out',
            base: 'bg-default/80 backdrop-blur-xl shadow-lg',
            trailing: 'pe-2'
          }"
          @keydown.enter.exact.prevent="handleSubmit"
        >
          <template #trailing>
            <div class="flex items-center gap-2">
              <div class="hidden sm:!flex items-center gap-1">
                <UKbd v-for="key in shortcutDisplayKeys" :key="key" :value="key" />
              </div>

              <UButton
                aria-label="Send Message"
                type="submit"
                icon="i-lucide-arrow-up"
                color="primary"
                size="xs"
                :disabled="!input.trim()"
              />
            </div>
          </template>
        </UInput>
      </form>
    </motion.div>
  </AnimatePresence>
</template>
