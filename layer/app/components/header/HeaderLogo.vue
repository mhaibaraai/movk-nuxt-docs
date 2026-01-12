<script lang="ts" setup>
const { header } = useAppConfig()
</script>

<template>
  <NuxtLink :to="header.to">
    <UUser :avatar="{ src: header.avatar, alt: 'Site Logo' }" :name="header.title" />
  </NuxtLink>
</template>
