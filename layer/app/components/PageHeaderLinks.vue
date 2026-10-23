<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()
const { ui } = useAppConfig()
const { t } = useMovkI18n()

const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app?.baseURL || '/'
const mcpEnabled = runtimeConfig.public.movkDocs.features.mcp

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)
const aiPrompt = computed(() => `I'm looking at this documentation: ${mdPath.value}\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`)

const pageItems = computed(() => [
  {
    label: t('docs.copyMarkdownLink'),
    icon: 'i-lucide-link',
    onSelect() {
      copy(mdPath.value)
      toast.add({
        title: t('docs.copied'),
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: t('docs.viewAsMarkdown'),
    icon: 'i-simple-icons-markdown',
    target: '_blank',
    to: `/raw${route.path}.md`
  },
  {
    label: t('docs.openInChatGPT'),
    icon: 'i-simple-icons-openai',
    target: '_blank',
    to: `https://chatgpt.com/?prompt=${encodeURIComponent(aiPrompt.value)}`
  },
  {
    label: t('docs.openInClaude'),
    icon: 'i-simple-icons-anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt.value)}`
  }
])

const mcpItems = computed(() => mcpEnabled
  ? [
      {
        label: t('docs.copyMcpUrl'),
        icon: 'i-lucide-cpu',
        onSelect() {
          copy(`${window?.location?.origin}${appBaseURL}mcp`)
          toast.add({
            title: t('docs.copied'),
            icon: 'i-lucide-circle-check'
          })
        }
      },
      {
        label: t('docs.addMcpVscode'),
        icon: 'i-simple-icons-visualstudiocode',
        target: '_blank',
        to: `/mcp/deeplink?ide=vscode`
      },
      {
        label: t('docs.addMcpCursor'),
        icon: 'i-simple-icons-cursor',
        target: '_blank',
        to: `/mcp/deeplink`
      }
    ]
  : [])

const items = computed(() => [pageItems.value, mcpItems.value].filter(group => group.length))

async function copyPage() {
  copy(await $fetch<string>(`/raw${route.path}.md`))
}
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <button
      type="button"
      class="link-wipe inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-highlighted transition-colors"
      @click="copyPage"
    >
      <UIcon :name="copied ? ui.icons.copyCheck : ui.icons.copy" class="size-3.5" :class="copied && 'text-primary'" />
      {{ t('docs.copyPage') }}
    </button>
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
        variant="link"
        size="xs"
        class="text-muted hover:text-highlighted"
        :aria-label="t('header.toggleMenu')"
      />
    </UDropdownMenu>
  </div>
</template>
