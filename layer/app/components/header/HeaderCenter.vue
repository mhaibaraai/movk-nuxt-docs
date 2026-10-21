<script lang="ts" setup>
const { desktopLinks } = useHeader()
const { t } = useMovkI18n()
</script>

<template>
  <UNavigationMenu :items="desktopLinks" variant="link" :aria-label="t('header.mainNavigation')" />
</template>
