<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'
import { useFilter } from '@nuxt/ui/composables'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const searchTerm = inject<Ref<string>>('docsFilterSearch') ?? ref('')

const { scoreItem } = useFilter()
const { navigationByCategory } = useNavigation(navigation!)

const filteredNavigation = computed(() =>
  filterNavigation(navigationByCategory.value, searchTerm.value, scoreItem)
)

const navigationKey = computed(() =>
  `${route.path}-${searchTerm.value ? 'filtered' : 'unfiltered'}`
)
</script>

<template>
  <UContentNavigation
    :key="navigationKey"
    :collapsible="false"
    :navigation="filteredNavigation"
    highlight
    :ui="{
      linkTrailingBadge: 'font-semibold uppercase'
    }"
  />
</template>
