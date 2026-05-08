<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const route = useRoute()

const { style, link, color } = useTheme()

const { data: navigation } = await useFetch('/api/navigation.json')
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link,
  style
})

if (import.meta.server) {
  useSeoMeta({
    title: 'Page not found',
    description: 'We are sorry but this page could not be found.'
  })
}

const { rootNavigation } = useNavigation(navigation)

provide('navigation', rootNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="{ root: route.path.startsWith('/docs/') }">
        <Header v-if="$route.meta.header !== false" />

        <UError :error="error" />

        <Footer v-if="$route.meta.footer !== false" />
      </div>

      <ClientOnly>
        <AiChatPanel />

        <AiChatFloatingInput />

        <UContentSearch :files="files" :navigation="navigation" />
      </ClientOnly>
    </div>
  </UApp>
</template>
