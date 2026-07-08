<script setup lang="ts">
import type { CommitCasing, CommitPathParts } from '../../../shared/commit-path'
import { useTimeAgo } from '@vueuse/core'
import { resolveCommitFilePath } from '../../../shared/commit-path'

interface Commit {
  sha: string
  date: string
  message: string
}

interface CommitChangelogFile {
  /**
   * 覆盖顶层 commitPath
   */
  commitPath?: string
  /**
   * 覆盖顶层 prefix
   */
  prefix?: string
  /**
   * 覆盖顶层 suffix
   */
  suffix?: string
  /**
   * 覆盖顶层 name
   */
  name?: string
  /**
   * 覆盖顶层 casing
   */
  casing?: CommitCasing
}

interface Release {
  tag_name: string
  published_at: string
  html_url: string
}

interface ReleaseGroup {
  tag: string
  url?: string
  icon?: string
  title: string
  commits: Commit[]
  published_at?: string
}

const props = defineProps<{
  /**
   * 仓库中的文件路径
   * @defaultValue 'src'
   */
  commitPath?: string
  /**
   * 文件路径的前缀
   */
  prefix?: string
  /**
   * 文件扩展名
   * @defaultValue 'vue'
   */
  suffix?: string
  /**
   * 要获取更新日志的组件或文件名
   */
  name?: string
  /**
   * 按作者筛选提交
   */
  author?: string
  /**
   * 文件名的命名格式
   * - 'auto': Vue 文件使用 PascalCase，其他使用 camelCase（默认）
   * - 'kebab': 保持 kebab-case（如 use-user.ts）
   * - 'camel': 转换为 camelCase（如 useUser.ts）
   * - 'pascal': 转换为 PascalCase（如 UseUser.ts）
   * @defaultValue 'auto'
   */
  casing?: CommitCasing
  /**
   * 关联多个文件：每一项与顶层 props 合并后各自解析出一个文件路径，
   * 对应的提交记录会合并去重并按时间倒序展示
   */
  files?: CommitChangelogFile[]
}>()

const SHA_SHORT_LENGTH = 5

const { github } = useAppConfig()
const route = useRoute()

const routeName = computed(() => route.path.split('/').pop() ?? '')
const githubConfig = computed(() => (github && typeof github === 'object' ? github : undefined))
const githubUrl = computed(() => githubConfig.value?.url ?? '')

function toParts(override: CommitChangelogFile): CommitPathParts {
  return {
    basePath: override.commitPath ?? props.commitPath ?? githubConfig.value?.commitPath ?? 'src',
    prefix: override.prefix ?? props.prefix,
    suffix: override.suffix ?? props.suffix ?? githubConfig.value?.suffix ?? 'vue',
    name: override.name ?? props.name ?? routeName.value,
    casing: override.casing ?? props.casing ?? githubConfig.value?.casing ?? 'auto'
  }
}

const filePaths = computed(() => {
  const list = props.files?.length ? props.files : [{}]
  return list.map(override => resolveCommitFilePath(toParts(override)))
})

const { data: commits } = useLazyFetch<Commit[]>('/api/github/commits.json', {
  key: `commit-changelog-${filePaths.value.join(',')}-${props.author ?? 'all'}`,
  query: { path: filePaths.value, author: props.author },
  server: false,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
})

const { data: releases } = useLazyFetch<Release[]>('/api/github/releases.json', {
  server: false,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
})

const groupedByRelease = computed<ReleaseGroup[]>(() => {
  if (!commits.value?.length) return []

  const sortedReleases = (releases.value ?? [])
    .filter(r => r.published_at)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  const releasesOldestFirst = [...sortedReleases].reverse()
  const groups: ReleaseGroup[] = []
  const unreleased: Commit[] = []

  for (const commit of commits.value) {
    const commitDate = new Date(commit.date).getTime()
    const release = releasesOldestFirst.find(r => new Date(r.published_at).getTime() >= commitDate)

    if (release) {
      const majorTag = release.tag_name.replace(/-(alpha|beta|rc)\.\d+$/, '')
      let group = groups.find(g => g.tag === majorTag)
      if (!group) {
        group = { tag: majorTag, title: majorTag, icon: 'i-lucide-tag', published_at: release.published_at, url: release.html_url, commits: [] }
        groups.push(group)
      }
      if (new Date(release.published_at) > new Date(group.published_at!)) {
        group.published_at = release.published_at
        group.url = release.html_url
      }
      group.commits.push(commit)
    } else {
      unreleased.push(commit)
    }
  }

  const result: ReleaseGroup[] = []
  if (unreleased.length) {
    result.push({ tag: 'unreleased', title: 'Soon', icon: 'i-lucide-tag', commits: unreleased })
  }

  const uniqueTags = [...new Set(sortedReleases.map(r => r.tag_name.replace(/-(alpha|beta|rc)\.\d+$/, '')))]
  groups.sort((a, b) => uniqueTags.indexOf(a.tag) - uniqueTags.indexOf(b.tag))
  result.push(...groups)

  return result
})

function normalizeCommitMessage(commit: Commit) {
  const prefix = `[\`${commit.sha.slice(0, SHA_SHORT_LENGTH)}\`](${githubUrl.value}/commit/${commit.sha})`
  const content = commit.message
    .replace(/#(\d+)/g, `<a href='${githubUrl.value}/issues/$1'>#$1</a>`)
    .replace(/`(.*?)`/g, '<code class="text-xs">$1</code>')

  return `${prefix} — ${content}`
}
</script>

<template>
  <div v-if="!commits?.length">
    No recent changes
  </div>

  <UTimeline
    v-else
    :items="groupedByRelease"
    size="xs"
    :ui="{ root: '', wrapper: 'mt-0 pb-0', title: 'mb-1.5 flex items-center justify-between' }"
  >
    <template #title="{ item }">
      <UBadge
        v-if="item.tag === 'unreleased'"
        color="neutral"
        variant="subtle"
        :label="item.title"
        class="w-12.5 justify-center"
      />
      <NuxtLink
        v-else
        :to="item.url"
        target="_blank"
        class="hover:underline"
      >
        <UBadge variant="subtle" :label="item.tag" />
      </NuxtLink>

      <time v-if="item.published_at" :datetime="item.published_at" class="text-xs text-dimmed font-normal">
        {{ useTimeAgo(new Date(item.published_at)) }}
      </time>
    </template>

    <template #description="{ item }">
      <ul class="flex flex-col gap-1.5">
        <li v-for="commit of item.commits" :key="commit.sha">
          <MDC :value="normalizeCommitMessage(commit)" class="text-sm [&_code]:text-xs" unwrap="p" />
        </li>
      </ul>
    </template>
  </UTimeline>
</template>
