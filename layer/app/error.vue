<script setup lang="ts">
import type { NuxtError } from '#app'
import * as nuxtUiLocales from '@nuxt/ui/locale'

defineProps<{
  error: NuxtError
}>()

const { style, link, color } = useTheme()
const { locale, docsRoot, docsCollection, t } = useMovkI18n()
const isDocsRoute = useDocsRoute()

const nuxtUiLocale = computed(() =>
  nuxtUiLocales[locale.value.replace('-', '_').toLowerCase() as keyof typeof nuxtUiLocales] || nuxtUiLocales.en
)

const { data: navigation } = await useAsyncData(
  () => `docs-navigation-${locale.value}`,
  () => queryCollectionNavigation(docsCollection.value as 'docs', ['category', 'description']),
  {
    transform: data => transformNavigation(data, docsRoot.value)
  }
)

const { data: files } = useLazyAsyncData(
  () => `docs-search-${locale.value}`,
  () => queryCollectionSearchSections(docsCollection.value as 'docs', { ignoredTags: ['style'] }),
  { server: false }
)

useHead({
  htmlAttrs: {
    lang: computed(() => nuxtUiLocale.value.code),
    dir: computed(() => nuxtUiLocale.value.dir)
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link,
  style
})

if (import.meta.server) {
  useSeoMeta({
    title: t('docs.pageNotFound'),
    description: t('docs.pageNotFoundDescription')
  })
}

const { rootNavigation } = useNavigation(navigation)

provide('navigation', rootNavigation)
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
        <AiChatPanel />

        <AiChatFloatingInput />

        <UContentSearch :files="files" :navigation="rootNavigation" />
      </ClientOnly>
    </div>
  </UApp>
</template>
