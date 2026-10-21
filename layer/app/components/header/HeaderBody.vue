<script setup lang="ts">
const navigation = useDocsNavigation()

const { mobileLinks } = useHeader()
const { t } = useMovkI18n()
const { navigationByCategory } = useNavigation(navigation)
const isDocsRoute = useDocsRoute()
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="mobileLinks"
    class="-mx-2.5"
    :aria-label="t('header.mobileNavigation')"
  />

  <template v-if="isDocsRoute">
    <USeparator type="dashed" class="mt-4 mb-6" />

    <UContentNavigation
      :navigation="navigationByCategory"
      highlight
      :ui="{ linkTrailingBadge: 'font-semibold uppercase' }"
      :aria-label="t('header.docsNavigation')"
    />
  </template>
</template>
