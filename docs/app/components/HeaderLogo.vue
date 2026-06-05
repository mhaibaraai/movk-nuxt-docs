<script lang="ts" setup>
const config = useRuntimeConfig().public
const { header } = useAppConfig()
</script>

<template>
  <div class="flex items-center gap-2" aria-label="Site Logo">
    <NuxtLink :to="header.to">
      <UUser :avatar="{ src: header.avatar, alt: 'Site Logo', loading: 'lazy' }" :name="header.title" />
    </NuxtLink>

    <UButton
      :label="`v${config.version}`"
      variant="subtle"
      size="xs"
      class="font-semibold rounded-full truncate"
    />
  </div>
</template>
