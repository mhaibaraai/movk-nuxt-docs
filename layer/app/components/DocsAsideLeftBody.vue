<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { navigationByCategory } = useNavigation(navigation!)
</script>

<template>
  <UContentNavigation :key="route.path" :navigation="navigationByCategory" highlight />
</template>
