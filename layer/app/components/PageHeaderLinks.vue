<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()
const { ui } = useAppConfig()

const appBaseURL = useRuntimeConfig().app?.baseURL || '/'

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)
const aiPrompt = computed(() => `I'm looking at this documentation: ${mdPath.value}\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`)

const items = [[
  {
    label: 'Copy Markdown link',
    icon: 'i-lucide-link',
    onSelect() {
      copy(mdPath.value)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons-markdown',
    target: '_blank',
    to: `/raw${route.path}.md`
  },
  {
    label: 'Open in ChatGPT',
    icon: 'i-simple-icons-openai',
    target: '_blank',
    to: `https://chatgpt.com/?prompt=${encodeURIComponent(aiPrompt.value)}`
  },
  {
    label: 'Open in Claude',
    icon: 'i-simple-icons-anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt.value)}`
  }
], [
  {
    label: 'Copy MCP Server URL',
    icon: 'i-lucide-cpu',
    onSelect() {
      copy(`${window?.location?.origin}${appBaseURL}mcp`)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-lucide-circle-check'
      })
    }
  },
  {
    label: 'Add MCP Server to VSCode',
    icon: 'i-simple-icons-visualstudiocode',
    target: '_blank',
    to: `/mcp/deeplink?ide=vscode`
  },
  {
    label: 'Add MCP Server to Cursor',
    icon: 'i-simple-icons-cursor',
    target: '_blank',
    to: `/mcp/deeplink`
  }
]]

async function copyPage() {
  copy(await $fetch<string>(`/raw${route.path}.md`))
}
</script>

<template>
  <UFieldGroup size="sm">
    <UButton
      label="Copy page"
      :icon="copied ? ui.icons.copyCheck : ui.icons.copy"
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
      <UButton
        :icon="ui.icons.chevronDown"
        color="neutral"
        variant="outline"
        aria-label="Toggle Dropdown"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
