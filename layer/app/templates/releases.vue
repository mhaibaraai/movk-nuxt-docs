<script setup lang="ts">
import type { ContentSurroundLink } from '@nuxt/ui'
import type { MDCParserResult } from '@nuxtjs/mdc'
import type { ReleaseSummary } from '../utils/releases'

// 每个版本一页：左侧为版本导航，右侧为说明正文的目录；/releases 为最新版本，其余位于各自的 tag 下
definePageMeta({
  key: route => route.path
})

const route = useRoute()
const { github, toc } = useAppConfig()
const { releasesCollection, locale, localePath, t } = useMovkI18n()

const collection = releasesCollection.value as 'releases'
const { data: page } = await useAsyncData(collection, () => queryCollection(collection).first())
if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found', fatal: true })
}

// GitHub 不可达时降级为空列表，页面给出提示而不是让整条路由与预渲染失败
const { data: allReleases } = await useAsyncData('releases-list', () =>
  $fetch<ReleaseSummary[]>('/api/github/releases.json').catch((error: unknown) => {
    console.warn('[releases] could not load the release list', error)
    return []
  })
)

const releases = filterReleases(allReleases.value ?? [], page.value)
const tag = route.params.tag as string | undefined

// 指定 tag 时在全部版本中查找，被筛掉的预发布版本仍可直接访问，只是不出现在导航中
const release = tag ? allReleases.value?.find(entry => entry.tag === tag) : releases[0]
if (tag && !release && allReleases.value?.length) {
  throw createError({ status: 404, statusText: 'Release not found', fatal: true })
}
if (tag && tag === releases[0]?.tag) {
  await navigateTo(localePath(RELEASES_ROOT), { redirectCode: 302, replace: true })
}

const { data: notes } = await useAsyncData<MDCParserResult | null>(`release-${release?.tag ?? 'unavailable'}`, async () => {
  if (!release) {
    return null
  }
  try {
    const { markdown } = await $fetch<{ markdown: string }>(`/api/github/releases/${encodeURIComponent(release.tag)}`)
    const parsed = await parseMarkdown(prepareReleaseNotes(markdown), { toc: { depth: 3, searchDepth: 3 } })
    return { ...parsed, body: unwrapHeadingLinks(parsed.body) }
  } catch (error) {
    console.warn('[releases] could not load the release notes', error)
    return null
  }
})

// 按 UTC 格式化：GitHub 以 UTC 发布，用本地时区会让东八区等读者看到的日期错一天
const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value))

const navigation = releasesNavigation(releases, localePath)

const index = release ? releases.findIndex(entry => entry.tag === release.tag) : -1
// 左侧为较新版本，右侧为较旧版本，与导航顺序一致
const surround = index === -1
  ? []
  : [releases[index - 1], releases[index + 1]].map(entry => entry
      ? { title: entry.tag, path: localePath(releasePath(releases, entry.tag)), description: formatDate(entry.date) }
      : undefined) as ContentSurroundLink[]

const githubConfig = github && typeof github === 'object' ? github : undefined
const githubReleasesUrl = release?.url ?? (githubConfig?.url ? `${githubConfig.url}/releases` : undefined)

const sectionTitle = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description
const title = release ? `${release.title} - ${sectionTitle}` : sectionTitle

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('NuxtSeo.takumi', {
    title: release?.title ?? sectionTitle,
    description: release ? t('releases.releasedOn', { date: formatDate(release.date) }) : description,
    siteName: useSiteConfig().name
  })
}
</script>

<template>
  <UContainer>
    <UPage>
      <template v-if="navigation.length" #left>
        <UPageAside>
          <UContentNavigation :navigation="navigation" :collapsible="false" highlight />
        </UPageAside>
      </template>

      <UPageHeader
        :headline="release ? sectionTitle : undefined"
        :title="release?.title ?? sectionTitle"
        :description="release ? t('releases.releasedOn', { date: formatDate(release.date) }) : description"
        :links="githubReleasesUrl ? [{
          label: t('releases.viewOnGitHub'),
          icon: 'i-simple-icons-github',
          to: githubReleasesUrl,
          target: '_blank',
          color: 'neutral',
          variant: 'outline'
        }] : []"
      />

      <UPageBody>
        <MDCRenderer v-if="notes" :body="notes.body" :data="notes.data" />

        <p v-else class="text-muted">
          {{ t('releases.unavailable') }}
        </p>

        <template v-if="surround.some(Boolean)">
          <USeparator />

          <UContentSurround :surround="surround" />
        </template>
      </UPageBody>

      <template v-if="notes?.toc?.links?.length" #right>
        <UContentToc
          :title="toc?.title || t('docs.tocTitle')"
          :links="notes.toc.links"
          class="z-2"
          highlight
          highlight-variant="circuit"
        />
      </template>
    </UPage>
  </UContainer>
</template>
