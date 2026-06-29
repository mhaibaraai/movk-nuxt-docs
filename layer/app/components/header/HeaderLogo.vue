<script lang="ts" setup>
const { header } = useAppConfig()
const { localePath } = useMovkI18n()

const logoTo = computed(() => header.to?.startsWith('/') ? localePath(header.to) : header.to)
</script>

<template>
  <NuxtLink :to="logoTo">
    <UUser :avatar="{ src: header.avatar, alt: 'Site Logo', loading: 'lazy' }" :name="header.title" />
  </NuxtLink>
</template>
