<script lang="ts" setup>
const searchTerm = inject<Ref<string>>('docsFilterSearch') ?? ref('')

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
    variant="soft"
    :placeholder="placeholder"
    class="group"
  >
    <template v-if="shortcut" #trailing>
      <div class="flex items-center gap-0.5">
        <UKbd
          v-for="key in shortcutKeys"
          :key="key"
          :value="key"
          variant="subtle"
          class="ring-muted bg-transparent text-muted"
        />
      </div>
    </template>
  </UInput>
</template>
