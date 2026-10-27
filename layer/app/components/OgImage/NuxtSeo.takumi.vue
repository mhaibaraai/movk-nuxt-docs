<script setup lang="ts">
/**
 * @credits Nuxt SEO <https://nuxtseo.com/>
 */

import { computed } from 'vue'

const props = withDefaults(defineProps<{
  colorMode?: 'dark' | 'light'
  title?: string
  description?: string
  siteName?: string
  isPro?: boolean
  width?: number
  height?: number
}>(), {
  colorMode: 'light',
  title: 'title',
  width: 1200,
  height: 600
})

// 渲染器不解析 CSS 变量，直接使用 paper / vermilion token 的色值
const palette = computed(() => props.colorMode === 'dark'
  ? { background: '#141413', ink: '#faf9f5', muted: '#b0aea5', rule: '#3d3d3a', accent: '#e57461' }
  : { background: '#faf9f5', ink: '#141413', muted: '#5e5d59', rule: '#d1cfc5', accent: '#bf3a24' })
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between px-20 py-16"
    :style="{ backgroundColor: palette.background, color: palette.ink }"
  >
    <div class="flex items-center justify-between pb-5" :style="{ borderBottom: `2px solid ${palette.ink}` }">
      <span class="text-[26px] font-bold tracking-tight">{{ siteName }}</span>
      <span class="text-[18px] uppercase tracking-[0.2em]" :style="{ color: palette.accent }">Docs</span>
    </div>

    <div class="flex flex-col gap-6">
      <h1
        class="text-[76px] font-bold m-0 leading-[1.08] tracking-tight max-w-250"
        style="display: block; line-clamp: 3; text-overflow: ellipsis; text-wrap: balance;"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-[28px] m-0 leading-relaxed max-w-225"
        style="display: block; line-clamp: 2; text-overflow: ellipsis;"
        :style="{ color: palette.muted }"
      >
        {{ description }}
      </p>
    </div>

    <div class="flex items-center gap-4 pt-5" :style="{ borderTop: `1px solid ${palette.rule}` }">
      <span class="w-10 h-1.5" :style="{ backgroundColor: palette.accent }" />
    </div>
  </div>
</template>
