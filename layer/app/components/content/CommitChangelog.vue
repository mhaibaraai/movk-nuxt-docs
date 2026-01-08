<script setup lang="ts">
import { camelCase, kebabCase, upperFirst } from '@movk/core'

interface Commit {
  sha: string
  message: string
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
  casing?: 'auto' | 'kebab' | 'camel' | 'pascal'
}>()

const SHA_SHORT_LENGTH = 5

const { github } = useAppConfig()
const route = useRoute()

// 计算文件路径相关的值
const routeName = computed(() => route.path.split('/').pop() ?? '')
const githubUrl = computed(() => (github && typeof github === 'object' ? github.url : ''))

const filePath = computed(() => {
  const basePath = props.commitPath ?? (github && typeof github === 'object' ? github.commitPath : 'src')
  const filePrefix = props.prefix ? `${props.prefix}/` : ''
  const fileExtension = props.suffix ?? (github && typeof github === 'object' ? github.suffix : 'vue')
  const fileName = props.name ?? routeName.value

  // 根据 casing 参数转换文件名
  const transformedName = (() => {
    const casing = props.casing ?? (github && typeof github === 'object' ? github.casing : undefined) ?? 'auto'

    switch (casing) {
      case 'kebab':
        return kebabCase(fileName)
      case 'camel':
        return camelCase(fileName)
      case 'pascal':
        return upperFirst(camelCase(fileName))
      case 'auto':
      default:
        return fileExtension === 'vue'
          ? upperFirst(camelCase(fileName))
          : camelCase(fileName)
    }
  })()

  return `${basePath}/${filePrefix}${transformedName}.${fileExtension}`
})

const { data: commits } = await useLazyFetch<Commit[]>('/api/github/commits', {
  key: `commit-changelog-${props.name ?? routeName.value}-${props.author ?? 'all'}`,
  query: { path: [filePath.value], author: props.author }
})

// 格式化提交消息
const formattedCommits = computed(() => {
  if (!commits.value?.length) return []

  return commits.value.map((commit) => {
    const shortSha = commit.sha.slice(0, SHA_SHORT_LENGTH)
    const commitLink = `[\`${shortSha}\`](${githubUrl.value}/commit/${commit.sha})`

    const content = commit.message
      .replace(/\(.*?\)/, '')
      .replace(/#(\d+)/g, `<a href='${githubUrl.value}/issues/$1'>#$1</a>`)
      .replace(/`(.*?)`/g, '<code class="text-xs">$1</code>')

    return {
      sha: commit.sha,
      formatted: `${commitLink} — ${content}`
    }
  })
})
</script>

<template>
  <div v-if="!formattedCommits.length">
    No recent changes
  </div>

  <div v-else class="flex flex-col gap-1.5 relative">
    <div class="bg-accented w-px h-full absolute left-[11px] z-[-1]" />

    <div v-for="commit of formattedCommits" :key="commit.sha" class="flex gap-1.5 items-center">
      <div class="bg-accented ring-2 ring-bg size-1.5 mx-[8.5px] rounded-full" />
      <MDC :value="commit.formatted" class="text-sm *:py-0 *:my-0 [&_code]:text-xs" tag="div" />
    </div>
  </div>
</template>
