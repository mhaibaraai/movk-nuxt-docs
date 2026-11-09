<script lang="ts" setup>
const searchTerm = inject<Ref<string>>('docsFilterSearch', ref(''), false)

const { placeholder, shortcut } = useDocsFilterConfig()

const input = useTemplateRef('input')

const shortcutKeys = computed(() => shortcut.value.split('_'))

const shortcuts = computed(() => {
  if (!shortcut.value) return {}

  return {
    [shortcut.value]: {
      usingInput: false,
      handler: () => {
        input.value?.inputRef?.focus()
      }
    }
  }
})

defineShortcuts(shortcuts)
</script>

<template>
  <UInput
    ref="input"
    v-model="searchTerm"
    variant="none"
    :placeholder="placeholder"
    icon="i-lucide-search"
    class="group w-full border-b border-default focus-within:border-(--ui-text-strong) transition-colors"
    :ui="{ base: 'px-0 ps-6 text-sm placeholder:text-faint', leading: 'ps-0', leadingIcon: 'size-3.5 text-faint' }"
  >
    <template v-if="shortcut" #trailing>
      <div class="flex items-center gap-0.5">
        <UKbd
          v-for="key in shortcutKeys"
          :key="key"
          :value="key"
          variant="outline"
          class="font-mono text-faint"
        />
      </div>
    </template>
  </UInput>
</template>
