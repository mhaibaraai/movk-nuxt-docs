<script setup lang="ts">
import colors from 'tailwindcss/colors'
import { zh_cn } from '@nuxt/ui/locale'

const site = useSiteConfig()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const route = useRoute()
const { style, link } = useTheme()
const { isEnabled: isAiChatEnabled } = useAIChat()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs', ['category', 'description']))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs', {
  ignoredTags: ['style']
}), {
  server: false
})

const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: computed(() => [
    { rel: 'icon', href: '/favicon.ico' },
    ...link.value
  ]),
  htmlAttrs: {
    lang: 'zh-CN',
    dir: 'ltr'
  },
  style
})

if (import.meta.server) {
  useSeoMeta({
    titleTemplate: appConfig.seo.titleTemplate,
    title: appConfig.seo.title,
    description: appConfig.seo.description,
    ogSiteName: site.name,
    twitterCard: 'summary_large_image'
  })

  useSchemaOrg([
    defineWebSite({
      name: useSiteConfig().name
    })
  ])
}

const fuse = {
  resultLimit: 500
}

const { rootNavigation } = useNavigation(navigation)

provide('navigation', rootNavigation)
</script>

<template>
  <UApp :toaster="appConfig.toaster" :locale="zh_cn">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <UTheme
      :ui="{
        contentNavigation: {
          linkLeadingIcon: 'size-4 mr-1',
          linkTrailing: 'hidden'
        },
        pageLinks: {
          linkLeadingIcon: 'size-4',
          linkLabelExternalIcon: 'size-2.5'
        }
      }"
    >
      <div class="flex">
        <div class="flex-1 min-w-0" :class="[route.path.startsWith('/docs/') && 'root']">
          <template v-if="!route.path.startsWith('/examples')">
            <Header v-if="$route.meta.header !== false" />
          </template>

          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>

          <template v-if="!route.path.startsWith('/examples')">
            <Footer v-if="$route.meta.footer !== false" />
          </template>
        </div>

        <template v-if="!route.path.startsWith('/examples') && isAiChatEnabled">
          <ClientOnly>
            <AiChatPanel />

            <AiChatFloatingInput />

            <UContentSearch :files="files" :navigation="rootNavigation" :fuse="fuse" />
          </ClientOnly>
        </template>
      </div>
    </UTheme>
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
