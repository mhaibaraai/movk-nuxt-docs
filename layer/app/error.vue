<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { t } = useMovkI18n()
const isDocsRoute = useDocsRoute()
const { isEnabled: isAiChatEnabled } = useAIChat()
const { nuxtUiLocale, rootNavigation, files } = await useDocsShell()

if (import.meta.server) {
  useSeoMeta({
    title: t('docs.pageNotFound'),
    description: t('docs.pageNotFoundDescription')
  })
}
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="{ root: isDocsRoute }">
        <Header v-if="$route.meta.header !== false" />

        <UError :error="error" />

        <Footer v-if="$route.meta.footer !== false" />
      </div>

      <ClientOnly>
        <template v-if="isAiChatEnabled">
          <AiChatPanel />

          <AiChatFloatingInput />
        </template>

        <UContentSearch :files="files" :navigation="rootNavigation" />
      </ClientOnly>
    </div>
  </UApp>
</template>
