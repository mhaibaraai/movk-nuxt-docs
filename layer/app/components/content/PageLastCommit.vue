<script setup lang="ts">
interface LastCommit {
  sha: string
  date: string
  message: string
  author: {
    name: string
    email: string
    login: string
    avatarUrl: string
  }
}

const props = withDefaults(defineProps<{
  /**
   * The path to the file in the repository.
   */
  path?: string
  /**
   * Date locale for formatting.
   * @defaultValue 'en-US'
   */
  locale?: string
  /**
   * Whether to show the commit message.
   * @defaultValue true
   */
  showMessage?: boolean
  /**
   * Whether to show the author avatar.
   * @defaultValue false
   */
  showAvatar?: boolean
}>(), {
  locale: 'en-US',
  showMessage: true,
  showAvatar: false
})

const { github } = useAppConfig()

// 类型安全的 github 配置访问
const githubUrl = computed(() => (github && typeof github === 'object' ? github.url : ''))
const githubRootDir = computed(() => (github && typeof github === 'object' ? github.rootDir : ''))

const filePath = computed(() => {
  if (props.path) return props.path

  const page = useState<{ stem?: string, extension?: string }>('page')
  if (page.value?.stem && page.value?.extension) {
    return [
      githubRootDir.value,
      'content',
      `${page.value.stem}.${page.value.extension}`
    ].filter(Boolean).join('/')
  }

  return ''
})

const { data: commit } = await useLazyFetch<LastCommit | null>('/api/github/last-commit', {
  key: `last-commit-${filePath.value}`,
  query: { path: filePath }
})

const formattedDate = computed(() => {
  if (!commit.value?.date) return ''

  return new Date(commit.value.date).toLocaleDateString(props.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const commitMessage = computed(() => {
  if (!commit.value?.message) return ''

  // Remove conventional commit type prefix like "feat:", "fix:", etc.
  // But keep the scope if present, e.g., "feat(auth):" -> "auth"
  return commit.value.message
    .replace(/^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.*?\))?!?:\s*/i, '$2')
    .replace(/^\(|\)$/g, '')
    .trim() || commit.value.message
})

const authorName = computed(() => {
  return commit.value?.author.name || commit.value?.author.login || ''
})

const commitUrl = computed(() => {
  if (!githubUrl.value || !commit.value?.sha) return ''
  return `${githubUrl.value}/commit/${commit.value.sha}`
})

const authorUrl = computed(() => {
  if (!commit.value?.author.login) return ''
  return `https://github.com/${commit.value.author.login}`
})
</script>

<template>
  <div v-if="commit" class="flex items-center flex-wrap gap-1 text-sm text-muted">
    <span>Last updated</span>
    <span class="font-medium text-default">{{ formattedDate }}</span>
    <span>by</span>
    <ULink
      v-if="authorUrl"
      :to="authorUrl"
      target="_blank"
      class="inline-flex items-center gap-1.5"
    >
      <UAvatar
        v-if="showAvatar && commit.author.avatarUrl"
        :src="commit.author.avatarUrl"
        :alt="authorName"
        size="2xs"
      />
      <UBadge color="neutral" variant="outline" size="sm">
        {{ authorName }}
      </UBadge>
    </ULink>
    <span v-else class="inline-flex items-center gap-1.5">
      <UAvatar
        v-if="showAvatar && commit.author.avatarUrl"
        :src="commit.author.avatarUrl"
        :alt="authorName"
        size="2xs"
      />
      <UBadge color="neutral" variant="outline" size="sm">
        {{ authorName }}
      </UBadge>
    </span>
    <template v-if="showMessage && commitMessage">
      <span>in</span>
      <ULink v-if="commitUrl" :to="commitUrl" target="_blank">
        <UBadge color="neutral" variant="outline" size="sm">
          {{ commitMessage }}
        </UBadge>
      </ULink>
      <UBadge
        v-else
        color="neutral"
        variant="outline"
        size="sm"
      >
        {{ commitMessage }}
      </UBadge>
    </template>
  </div>
</template>
