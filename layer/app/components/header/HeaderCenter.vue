<script lang="ts" setup>
const { desktopLinks } = useHeader()
</script>

<template>
  <UNavigationMenu :items="desktopLinks" variant="link" aria-label="Main Navigation" />
</template>
