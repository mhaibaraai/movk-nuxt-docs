<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  siteName?: string
}>(), {
  title: '文档',
  description: '使用 Nuxt Content 构建的文档站点',
  siteName: 'Movk Nuxt Docs'
})
</script>

<template>
  <div
    style="font-family: 'Noto Serif SC', sans-serif;"
    class="w-full h-full flex flex-col justify-center items-center relative p-10 lg:p-15 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
  >
    <div
      class="absolute top-0 left-0 right-0 bottom-0"
      :style="{
        backgroundImage: `radial-gradient(at 100% 100%, rgba(34, 197, 94, 0.15), transparent)`
      }"
    />
    <div
      class="absolute top-0 left-0 right-0 bottom-0"
      :style="{
        backgroundImage: `radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.1), transparent)`
      }"
    />

    <div class="relative flex flex-col items-center text-center gap-5 lg:gap-8">
      <div class="flex items-center gap-3">
        <svg viewBox="0 0 64 64" class="w-10 h-10 lg:w-16 lg:h-16">
          <defs>
            <linearGradient
              id="nsLine1"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stop-color="#22c55e" />
              <stop offset="100%" stop-color="#86efac" />
            </linearGradient>
            <linearGradient
              id="nsFill1"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#22c55e" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M8 52 Q20 48 24 36 T40 20 T56 12 L56 56 L8 56 Z" fill="url(#nsFill1)" />
          <path
            d="M8 52 Q20 48 24 36 T40 20 T56 12"
            fill="none"
            stroke="url(#nsLine1)"
            stroke-width="4"
            stroke-linecap="round"
          />
          <circle
            cx="56"
            cy="12"
            r="6"
            fill="url(#nsLine1)"
          />
        </svg>
        <span class="text-[32px] font-medium lg:text-[42px] text-green-500">
          {{ siteName }}
        </span>
      </div>

      <div class="items-center justify-center w-full">
        <h1
          class="text-[48px] lg:text-[80px] text-pretty font-bold text-slate-900 max-w-175 lg:max-w-250"
          style="display: block; line-clamp: 3; text-overflow: ellipsis; text-wrap: balance;"
        >
          {{ title }}
        </h1>
      </div>

      <p v-if="description" class="text-slate-500 text-[24px] lg:text-[32px] opacity-70 max-w-162.5 lg:max-w-225 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
