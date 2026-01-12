<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { kebabCase } from 'scule'

definePageMeta({
  layout: 'docs',
  heroBackground: 'opacity-30'
})

const route = useRoute()
const { toc, github } = useAppConfig()

const { data: page } = await useAsyncData(`docs-${kebabCase(route.path)}`, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { shouldPushContent: shouldHideToc } = useAIChat()

const { data: surround } = await useAsyncData(`surround-${(kebabCase(route.path))}`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description']
  })
})

const { findBreadcrumb } = useNavigation(navigation!)

const breadcrumb = computed(() => findBreadcrumb(page.value?.path as string))

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

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
      label: 'View source',
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
      label: 'Edit this page',
      to: buildFileLink('edit'),
      target: '_blank'
    })
  }

  return filterValidLinks([...links, ...(toc?.bottom?.links || [])])
})

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Nuxt', {
  title,
  description
})
</script>

<template>
  <UPage v-if="page" :key="`page-${shouldHideToc}`">
    <UPageHeader :title="title">
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #description>
        <MDC
          v-if="page.description"
          :value="page.description"
          unwrap="p"
          :cache-key="`${kebabCase(route.path)}-description`"
        />

        <PageLastCommit v-if="github && page?.stem && page?.extension" :stem="page.stem" :extension="page.extension" />
      </template>

      <template #links>
        <UButton
          v-for="link in pageLinks"
          :key="link.label"
          color="neutral"
          variant="outline"
          :target="link.to?.startsWith('http') ? '_blank' : undefined"
          size="sm"
          v-bind="link"
        >
          <template v-if="link.avatar" #leading>
            <UAvatar v-bind="link.avatar" size="2xs" :alt="`${link.label} avatar`" />
          </template>
        </UButton>
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.filter(Boolean).length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length && !shouldHideToc" #right>
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
        highlight
        class="z-2"
      >
        <template v-if="toc?.bottom" #bottom>
          <div class="hidden lg:block space-y-6" :class="{ 'mt-6!': page.body?.toc?.links?.length }">
            <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

            <UPageLinks v-if="communityLinks?.length" :title="toc.bottom.title" :links="communityLinks" />

            <USeparator v-if="communityLinks?.length" type="dashed" />

            <DocsAsideRightBottom />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
