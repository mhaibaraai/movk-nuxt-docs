<script setup lang="ts">
const site = useSiteConfig()
const appConfig = useAppConfig()
const route = useRoute()

const { isEnabled: isAiChatEnabled } = useAIChat()
const isDocsRoute = useDocsRoute()
const { nuxtUiLocale, rootNavigation, files } = await useDocsShell()

useLocaleSeo()

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

const { t } = useMovkI18n()
const { pages: recentPages } = useRecentPages()
const searchTerm = ref('')

// 搜索词为空时只展示最近访问，输入后恢复完整的分类导航
const recentItems = computed(() => recentPages.value
  .filter(page => page.path !== route.path)
  .map(page => ({ label: page.title, to: page.path, icon: 'i-lucide-history' })))

const recentGroups = computed(() => !searchTerm.value && recentItems.value.length
  ? [{ id: 'recent', label: t('search.recent'), items: recentItems.value }]
  : [])
</script>

<template>
  <UApp :toaster="appConfig.toaster" :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <UTheme
      :ui="{
        contentNavigation: {
          linkLeadingIcon: 'size-4 mr-1',
          linkTrailingIcon: 'hidden'
        },
        pageLinks: {
          linkLeadingIcon: 'size-4',
          linkLabelExternalIcon: 'size-2.5'
        }
      }"
    >
      <div class="flex">
        <div class="flex-1 min-w-0" :class="[isDocsRoute && 'root']">
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

        <template v-if="!route.path.startsWith('/examples')">
          <ClientOnly>
            <template v-if="isAiChatEnabled">
              <AiChatPanel />

              <AiChatFloatingInput />
            </template>

            <UContentSearch
              v-model:search-term="searchTerm"
              :files="files"
              :navigation="recentGroups.length ? undefined : rootNavigation"
              :groups="recentGroups"
              :fuse="fuse"
              :unmount-on-hide="false"
            />
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
