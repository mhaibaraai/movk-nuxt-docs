<script setup lang="ts">
import { ShikiCachedRenderer } from 'shiki-stream/vue'
import { useHighlighter } from '../composables/useHighlighter'

const colorMode = useColorMode()
const highlighter = await useHighlighter()
const props = defineProps<{
  /**
   * 要高亮显示的代码内容
   */
  code: string
  /**
   * 代码语言（如 'vue'、'javascript'、'typescript'）
   */
  language: string
  /**
   * 自定义 CSS 类名
   */
  class?: string
  /**
   * 代码块元数据
   */
  meta?: string
}>()

const trimmedCode = computed(() => {
  return props.code.trim().replace(/`+$/, '')
})

const lang = computed(() => {
  switch (props.language) {
    case 'vue':
      return 'vue'
    case 'javascript':
      return 'js'
    case 'typescript':
      return 'ts'
    case 'css':
      return 'css'
    default:
      return props.language
  }
})
const key = computed(() => {
  return `${lang.value}-${colorMode.value}`
})
</script>

<template>
  <ProsePre v-bind="props">
    <ShikiCachedRenderer
      :key="key"
      :highlighter="highlighter"
      :code="trimmedCode"
      :lang="lang"
      :theme="colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter'"
    />
  </ProsePre>
</template>
