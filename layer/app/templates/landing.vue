<script setup lang="ts">
const route = useRoute()
const { landingCollection } = useMovkI18n()

const collection = landingCollection.value as 'landing'

const { data: page } = await useAsyncData(`landing-${route.path}`, () => queryCollection(collection).path(route.path).first())
if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found', fatal: true })
}

const site = useSiteConfig()

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('NuxtSeo.takumi', {
    title,
    description,
    siteName: site.name
  })
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
