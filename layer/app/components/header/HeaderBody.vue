<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const route = useRoute()
const { mobileLinks } = useHeader()
const { navigationByCategory } = useNavigation(navigation!)
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="mobileLinks"
    class="-mx-2.5"
    aria-label="Mobile Navigation"
  />

  <template v-if="route.path.startsWith('/docs/')">
    <USeparator type="dashed" class="mt-4 mb-6" />

    <UContentNavigation
      :navigation="navigationByCategory"
      highlight
      :ui="{ linkTrailingBadge: 'font-semibold uppercase' }"
      aria-label="Documentation Navigation"
    />
  </template>
</template>
