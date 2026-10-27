<script setup lang="ts">
import { kebabCase, upperFirst } from 'scule'

definePageMeta({
  layout: 'docs'
})

const { isOpen } = useAIChat()
const route = useRoute()
const appConfig = useAppConfig()
const { toc, github } = appConfig
const { docsCollection, t } = useMovkI18n()

const collection = docsCollection.value as 'docs'

const { data: page } = await useAsyncData(`docs-${kebabCase(route.path)}`, () => queryCollection(collection).path(route.path).first())

if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found', fatal: true })
}

const navigation = useDocsNavigation()

const { data: surround } = await useAsyncData(`surround-${(kebabCase(route.path))}`, () => {
  return queryCollectionItemSurroundings(collection, route.path, {
    fields: ['description']
  })
})

const { findBreadcrumb } = useNavigation(navigation)

const breadcrumb = computed(() => findBreadcrumb(page.value?.path as string))

const title = page.value?.seo?.title || page.value?.title
const prefix = page.value?.path.includes('components/') || page.value?.path.includes('composables/') ? 'Vue ' : ''
const suffix = page.value?.path.includes('components/') ? 'Component ' : page.value?.path.includes('composables/') ? 'Composable ' : ''
const description = page.value?.seo?.description || page.value?.description

const { record: recordRecentPage } = useRecentPages()

onMounted(() => {
  if (page.value) recordRecentPage({ path: page.value.path, title: page.value.title })
})

const filterValidLinks = (links: Array<any>) => links.filter(Boolean)

function buildFileLink(type: 'edit' | 'blob') {
  if (!github)
    return null

  const segments = [
    github.url,
    type,
    github.branch,
    github.rootDir,
    'content',
    `${page.value?.stem}.${page.value?.extension}`
  ].filter(Boolean)

  return segments.join('/')
}

const pageLinks = computed(() => {
  const links = []

  if (github && github.url) {
    links.push({
      icon: 'i-lucide-file-code',
      label: t('docs.viewSource'),
      to: buildFileLink('blob'),
      target: '_blank'
    })
  }

  return filterValidLinks([...(page.value?.links || []), ...links])
})

const communityLinks = computed(() => {
  const links = []

  if (github && github.url) {
    links.push({
      icon: 'i-lucide-file-pen',
      label: t('docs.editPage'),
      to: buildFileLink('edit'),
      target: '_blank'
    })
  }

  return filterValidLinks([...links, ...(toc?.bottom?.links || [])])
})

const path = computed(() => route.path.replace(/\/$/, ''))

if (import.meta.server) {
  defineOgImage('NuxtSeo.takumi', {
    title,
    description,
    siteName: useSiteConfig().name
  })
}

useCanonical(computed(() => `${path.value}.md`))

useSchemaOrg([
  defineArticle({
    '@type': 'TechArticle',
    'headline': `${prefix}${title} ${suffix}`.trim(),
    'description': description
  }),
  defineBreadcrumb({
    itemListElement: breadcrumb.value?.map(item => ({
      name: item.label,
      item: item.to ? String(item.to) : undefined
    })) || []
  })
])

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UPage
    v-if="page"
    :ui="isOpen ? {
      center: 'lg:col-span-10',
      right: 'lg:hidden'
    } : undefined"
  >
    <UPageHeader :ui="{ root: 'border-b-0 pb-0', links: 'hidden' }">
      <template #headline>
        <UBreadcrumb
          :items="breadcrumb"
          :ui="{ link: 'font-mono text-[11px] uppercase tracking-[0.16em]', separatorIcon: 'size-3.5' }"
        />
      </template>

      <template #title>
        {{ page.title }}

        <UBadge
          v-if="page.navigation?.badge"
          :label="page.navigation?.badge"
          color="neutral"
          variant="outline"
          class="rounded-none align-middle font-mono uppercase tracking-wider"
        />
      </template>

      <template #description>
        <MDC
          v-if="page.description"
          :value="page.description"
          unwrap="p"
          :cache-key="`${kebabCase(route.path)}-description`"
        />
      </template>

      <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-default py-2.5">
        <dl v-if="page.requires || page.difficulty" class="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]">
          <div v-if="page.requires" class="flex items-baseline gap-2">
            <dt class="text-dimmed">
              {{ t('docs.requires') }}
            </dt>
            <dd class="text-highlighted normal-case tracking-normal">
              {{ page.requires }}
            </dd>
          </div>
          <div v-if="page.difficulty" class="flex items-baseline gap-2">
            <dt class="text-dimmed">
              {{ t('docs.difficulty') }}
            </dt>
            <dd class="text-highlighted">
              {{ t(`docs.difficulty${upperFirst(page.difficulty)}`) }}
            </dd>
          </div>
        </dl>
        <PageLastCommit v-if="github && page?.stem && page?.extension" :stem="page.stem" :extension="page.extension" />

        <div class="ms-auto flex items-center gap-5">
          <ULink
            v-for="link in pageLinks"
            :key="link.label"
            :to="link.to ?? undefined"
            :target="link.to?.startsWith('http') ? '_blank' : undefined"
            raw
            class="link-wipe inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-highlighted transition-colors"
          >
            <UIcon v-if="link.icon" :name="link.icon" class="size-3.5" />
            {{ link.label }}
          </ULink>
          <PageHeaderLinks />
        </div>
      </div>
    </UPageHeader>

    <UPageBody class="docs-body">
      <ContentRenderer v-if="page.body" :value="page" />

      <UContentSurround :surround="surround" class="mt-16" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc
        :title="toc?.title || t('docs.tocTitle')"
        :links="page.body?.toc?.links"
        color="neutral"
        class="docs-toc z-2"
      >
        <template v-if="toc?.bottom" #bottom>
          <div class="hidden lg:block space-y-6" :class="{ 'mt-8! pt-6 border-t border-default': page.body?.toc?.links?.length }">
            <UPageLinks
              v-if="communityLinks?.length"
              :title="toc.bottom.title || t('docs.community')"
              :links="communityLinks"
            />

            <DocsAsideRightBottom />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
