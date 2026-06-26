<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { data: page } = await useAsyncData('templates', () => queryCollection('templates').first())
if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found', fatal: true })
}

const site = useSiteConfig()

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
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

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
</script>

<template>
  <main v-if="page">
    <UPageHero
      :title="page.hero?.title || page.title"
      :description="page.hero?.description || page.description"
      :links="(page.hero?.links as ButtonProps[]) || []"
      class="md:border-b border-default"
      :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection
      v-for="(template, index) in page.items"
      :key="index"
      :title="template.title"
      :features="template.features"
      orientation="horizontal"
      class="lg:border-t border-default"
      :ui="{
        title: 'lg:text-4xl',
        wrapper: 'lg:py-16 lg:min-h-[481px] flex flex-col justify-center lg:border-r border-default order-last lg:pr-16',
        container: 'lg:py-0',
        links: 'gap-x-3'
      }"
    >
      <template #links>
        <UButton
          v-for="link of template.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          v-bind="link"
        />
      </template>

      <template #description>
        <MDC :value="template.description" unwrap="p" :cache-key="`templates-${index}-description`" />
      </template>

      <div class="lg:border-x border-default h-full flex items-center lg:bg-muted/20">
        <UColorModeImage
          :light="`/assets/templates/${slug(template.title)}-light.png`"
          :dark="`/assets/templates/${slug(template.title)}-dark.png`"
          class="w-full h-auto border lg:border-y lg:border-x-0 border-default rounded-sm lg:rounded-none"
          :alt="`Template ${template.title} screenshot`"
          width="654"
          height="368"
          loading="lazy"
        />
      </div>
    </UPageSection>
  </main>
</template>
