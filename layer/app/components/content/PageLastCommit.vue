<script setup lang="ts">
interface LastCommit {
  sha: string
  date: string
  dateFormatted: string
  message: string
  url: string
  author: {
    name: string
    login: string
    avatar: string
  }
}

const {
  showAvatar = true,
  showMessage = true,
  stem,
  extension
} = defineProps<{
  /**
   * 文件路径（不含扩展名），通常由页面自动传入
   * @defaultValue ''
   */
  stem: string
  /**
   * 文件扩展名，通常由页面自动传入
   * @defaultValue 'md'
   */
  extension: string
  /**
   * 是否显示提交信息。
   * @defaultValue true
   */
  showMessage?: boolean
  /**
   * 是否显示作者头像。
   * @defaultValue true
   */
  showAvatar?: boolean
}>()

const { github } = useAppConfig()

const filePath = computed(() => {
  if (!stem || !extension) return ''

  const rootDir = github && typeof github === 'object' ? github.rootDir : ''
  return [rootDir, 'content', `${stem}.${extension}`].filter(Boolean).join('/')
})

const { data: commit } = await useFetch<LastCommit | null>('/api/github/last-commit', {
  key: `last-commit-${filePath.value}`,
  query: { path: filePath.value },
  default: () => null,
  lazy: true,
  server: false
})

const commitUrl = computed(() => commit.value?.url ?? '')

const authorUrl = computed(() => {
  const login = commit.value?.author.login
  return login ? `https://github.com/${login}` : ''
})
</script>

<template>
  <div v-if="commit" class="flex items-center flex-wrap gap-1.5 text-sm text-muted mt-2">
    <span class="text-dimmed">最后更新于</span>
    <time class="font-medium text-default" :datetime="commit.date">{{ commit.dateFormatted }}</time>
    <span class="text-dimmed">由</span>
    <ULink
      v-if="authorUrl"
      :to="authorUrl"
      target="_blank"
      class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
    >
      <UAvatar
        v-if="showAvatar && commit.author.avatar"
        :src="commit.author.avatar"
        :alt="commit.author.name"
        size="2xs"
      />
      <UBadge color="neutral" variant="outline" size="sm">
        {{ commit.author.name || commit.author.login }}
      </UBadge>
    </ULink>
    <span v-else class="inline-flex items-center gap-1.5">
      <UAvatar
        v-if="showAvatar && commit.author.avatar"
        :src="commit.author.avatar"
        :alt="commit.author.name"
        size="2xs"
      />
      <UBadge color="neutral" variant="outline" size="sm">
        {{ commit.author.name || commit.author.login }}
      </UBadge>
    </span>
    <template v-if="showMessage && commit.message">
      <span class="text-dimmed">提交</span>
      <ULink
        v-if="commitUrl"
        :to="commitUrl"
        target="_blank"
        class="hover:opacity-80 transition-opacity max-w-[250px]"
      >
        <UBadge
          color="neutral"
          variant="outline"
          size="sm"
          class="font-mono text-xs"
        >
          <span class="truncate">{{ commit.message }}</span>
        </UBadge>
      </ULink>
      <UBadge
        v-else
        color="neutral"
        variant="outline"
        size="sm"
        class="max-w-[250px] font-mono text-xs"
      >
        <span class="truncate">{{ commit.message }}</span>
      </UBadge>
    </template>
  </div>
</template>
