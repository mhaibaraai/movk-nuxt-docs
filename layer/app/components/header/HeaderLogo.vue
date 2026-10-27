<script lang="ts" setup>
const { header } = useAppConfig()
const site = useSiteConfig()
const { localePath } = useMovkI18n()

const logoTo = computed(() => header.to?.startsWith('/') ? localePath(header.to) : header.to)
const title = computed(() => header.title || site.name)
</script>

<template>
  <NuxtLink :to="logoTo" class="flex items-center gap-2.5 min-w-0 rounded-sm outline-primary/25 focus-visible:outline-3">
    <img
      v-if="header.avatar"
      :src="header.avatar"
      alt=""
      class="size-6 shrink-0 rounded-sm"
      loading="lazy"
    >
    <span v-if="title" class="font-display text-xl font-bold tracking-tight text-highlighted truncate">
      {{ title }}<span class="text-primary">.</span>
    </span>
  </NuxtLink>
</template>
