<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()
const { vercelAnalytics } = useAppConfig()
const { track } = useAnalytics()

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)

const items = [
  {
    label: 'Copy Markdown link',
    icon: 'i-lucide-link',
    onSelect() {
      if (vercelAnalytics?.debug) track ('Page Action', { action: 'Copy Markdown Link' })
      copy(mdPath.value)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    to: `/raw${route.path}.md`,
    onSelect() {
      if (vercelAnalytics?.debug) track('Page Action', { action: 'View as Markdown' })
    }
  },
  {
    label: 'Open in ChatGPT',
    icon: 'i-simple-icons:openai',
    target: '_blank',
    to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
    onSelect() {
      if (vercelAnalytics?.debug) track('Page Action', { action: 'Open in ChatGPT' })
    }
  },
  {
    label: 'Open in Claude',
    icon: 'i-simple-icons:anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
    onSelect() {
      if (vercelAnalytics?.debug) track('Page Action', { action: 'Open in Claude' })
    }
  }
]

async function copyPage() {
  if (vercelAnalytics?.debug) track('Page Action', { action: 'Copy Page Content' })
  copy(await $fetch<string>(`/raw${route.path}.md`))
}
</script>

<template>
  <UFieldGroup size="sm">
    <UButton
      label="Copy page"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: [copied ? 'text-primary' : 'text-neutral', 'size-3.5']
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      size="sm"
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton icon="i-lucide-chevron-down" color="neutral" variant="outline" />
    </UDropdownMenu>
  </UFieldGroup>
</template>
