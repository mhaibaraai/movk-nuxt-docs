<script lang="ts" setup>
const { desktopLinks } = useHeader()
const { t } = useMovkI18n()
</script>

<template>
  <nav class="flex items-center gap-7" :aria-label="t('header.mainNavigation')">
    <ULink
      v-for="link in desktopLinks"
      :key="link.to"
      :to="link.to"
      :target="link.target"
      :active="link.active"
      :aria-current="link.active ? 'page' : undefined"
      raw
      class="link-wipe py-1 text-sm transition-colors"
      active-class="text-highlighted font-medium bg-size-[100%_1px]!"
      inactive-class="text-muted hover:text-highlighted"
    >
      {{ link.label }}
    </ULink>
  </nav>
</template>
