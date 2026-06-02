<script lang="ts" setup>
const route = useRoute()
const docsFilterSearch = ref('')
const showFilter = useDocsFilterVisible()

provide('docsFilterSearch', docsFilterSearch)

watch(() => route.path, () => {
  docsFilterSearch.value = ''
})
</script>

<template>
  <UMain class="relative" as="main">
    <HeroBackground />

    <UContainer>
      <UPage>
        <template #left>
          <UPageAside :ui="{ topHeader: 'bg-transparent', topBody: 'bg-transparent', topFooter: 'bg-transparent' }">
            <template v-if="showFilter" #top>
              <DocsAsideLeftTop />
            </template>

            <DocsAsideLeftBody />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
