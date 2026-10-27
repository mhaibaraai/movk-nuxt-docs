<script setup lang="ts">
import { ULink } from '#components'

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

const { data: commit } = useLazyFetch<LastCommit | null>('/api/github/last-commit.json', {
  key: `last-commit-${filePath.value}`,
  query: { path: filePath.value },
  default: () => null,
  server: false,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
})

const commitUrl = computed(() => commit.value?.url ?? '')

const authorUrl = computed(() => {
  const login = commit.value?.author.login
  return login ? `https://github.com/${login}` : ''
})
</script>

<template>
  <div v-if="commit" class="flex items-center flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-muted">
    <span class="uppercase tracking-[0.12em]">最后更新于</span>
    <time class="text-highlighted" :datetime="commit.date">{{ commit.dateFormatted }}</time>
    <span>·</span>
    <component
      :is="authorUrl ? ULink : 'span'"
      v-bind="authorUrl ? { to: authorUrl, target: '_blank', raw: true } : {}"
      class="inline-flex items-center gap-1.5 hover:text-highlighted transition-colors"
    >
      <UAvatar
        v-if="showAvatar && commit.author.avatar"
        :src="commit.author.avatar"
        alt="Author Avatar"
        size="3xs"
        loading="lazy"
      />
      {{ commit.author.name || commit.author.login }}
    </component>
    <template v-if="showMessage && commit.message">
      <span>·</span>
      <component
        :is="commitUrl ? ULink : 'span'"
        v-bind="commitUrl ? { to: commitUrl, target: '_blank', raw: true } : {}"
        class="max-w-62.5 truncate hover:text-highlighted transition-colors"
      >
        {{ commit.message }}
      </component>
    </template>
  </div>
</template>
