<script lang="ts" setup>
import { useFilter } from '@nuxt/ui/composables'

const route = useRoute()
const navigation = useDocsNavigation()
const searchTerm = inject<Ref<string>>('docsFilterSearch', ref(''), false)

const { scoreItem } = useFilter()
const { navigationByCategory } = useNavigation(navigation)

const filteredNavigation = computed(() =>
  filterNavigation(navigationByCategory.value, searchTerm.value, scoreItem)
)

const navigationKey = computed(() => route.params.slug?.[0] as string ?? '')
</script>

<template>
  <div :key="navigationKey" class="flex flex-col">
    <section
      v-for="(group, index) in filteredNavigation"
      :key="group.path"
      class="py-5 first:pt-0 border-b border-default last:border-b-0"
    >
      <p class="mb-2.5 flex items-baseline gap-2.5 text-[13px] font-semibold text-highlighted">
        <span class="font-mono text-[11px] font-normal tracking-[0.12em] text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
        {{ group.title }}
      </p>

      <UContentNavigation
        :collapsible="false"
        :navigation="group.children"
        color="neutral"
      />
    </section>
  </div>
</template>
