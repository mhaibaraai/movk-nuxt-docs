<script lang="ts" setup>
import { useFilter } from '@nuxt/ui/composables'

const route = useRoute()
const navigation = useDocsNavigation()
const searchTerm = inject<Ref<string>>('docsFilterSearch') ?? ref('')

const { scoreItem } = useFilter()
const { navigationByCategory } = useNavigation(navigation)

const filteredNavigation = computed(() =>
  filterNavigation(navigationByCategory.value, searchTerm.value, scoreItem)
)

const navigationKey = computed(() => route.params.slug?.[0] as string ?? '')
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
