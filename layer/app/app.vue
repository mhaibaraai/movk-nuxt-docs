<script setup lang="ts">
import colors from 'tailwindcss/colors'
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const site = useSiteConfig()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const route = useRoute()
const { isEnabled: isAiChatEnabled, panelWidth: aiChatPanelWidth, shouldPushContent } = useAIChat()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs', ['category', 'description']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})
const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')
const font = computed(() => `:root { --font-sans: '${appConfig.theme.font}', sans-serif; }`)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
    { innerHTML: font, id: 'nuxt-ui-font', tagPriority: -2 }
  ]
})

useSeoMeta({
  titleTemplate: appConfig.seo.titleTemplate,
  title: appConfig.seo.title,
  description: appConfig.seo.description,
  ogSiteName: site.name,
  twitterCard: 'summary_large_image'
})

const { rootNavigation } = useNavigation(navigation)

provide('navigation', rootNavigation)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />
    <Analytics v-if="appConfig.vercelAnalytics" :debug="appConfig.vercelAnalytics?.debug" />
    <SpeedInsights v-if="appConfig.vercelAnalytics" :debug="appConfig.vercelAnalytics?.debug" />

    <div :class="{ root: route.path.startsWith('/docs/') }" :style="{ marginRight: shouldPushContent ? `${aiChatPanelWidth}px` : '0' }">
      <template v-if="!route.path.startsWith('/examples')">
        <Header v-if="$route.meta.header !== false" />
      </template>

      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <template v-if="!route.path.startsWith('/examples')">
        <Footer v-if="$route.meta.footer !== false" />

        <ClientOnly>
          <LazyUContentSearch :files="files" :navigation="rootNavigation" :fuse="{ resultLimit: 1000 }" />
          <template v-if="isAiChatEnabled">
            <LazyAiChatPanel />
            <LazyAiChatFloatingInput />
          </template>
        </ClientOnly>
      </template>
    </div>
  </UApp>
</template>

<style>
/* Safelist (do not remove): [&>div]:*:my-0 [&>div]:*:w-full h-64 !px-0 !py-0 !pt-0 !pb-0 !p-0 !justify-start !justify-end !min-h-96 h-136 max-h-[341px] */

@media (min-width: 1024px) {
  .root {
    --ui-header-height: 112px;
  }
}
</style>
