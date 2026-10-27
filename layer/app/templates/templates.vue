<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { templatesCollection, t } = useMovkI18n()
const collection = templatesCollection.value as 'templates'

const { data: page } = await useAsyncData(collection, () => queryCollection(collection).first())
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

function hostname(url: unknown): string | undefined {
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) return undefined
  return new URL(url).hostname
}

const items = computed(() => (page.value?.items || []).map((item, index) => {
  const href = item.links?.[0]?.to
  return {
    ...item,
    index: String(index + 1).padStart(2, '0'),
    slug: slug(item.title),
    href: typeof href === 'string' ? href : undefined,
    host: hostname(href)
  }
}))
</script>

<template>
  <main v-if="page">
    <section class="border-b border-default">
      <UContainer class="pt-12 pb-16 lg:pt-16 lg:pb-20">
        <p class="kicker">
          {{ t('templates.count', { count: items.length }) }}
        </p>

        <div class="rule-double mt-4" />

        <div class="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 class="lg:col-span-7 font-display font-bold tracking-tight leading-[0.95] text-balance text-highlighted text-[clamp(3rem,7vw,6rem)]">
            {{ page.hero?.title || page.title }}
          </h1>

          <div class="lg:col-span-5">
            <p class="text-lg/relaxed text-toned text-pretty">
              {{ page.hero?.description || page.description }}
            </p>

            <div v-if="page.hero?.links?.length" class="mt-6 flex flex-wrap gap-3">
              <UButton
                v-for="(link, i) of (page.hero.links as ButtonProps[])"
                :key="String(link.label)"
                color="neutral"
                :variant="i === 0 ? 'solid' : 'outline'"
                v-bind="link"
              />
            </div>
          </div>
        </div>

        <ol class="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-default">
          <li v-for="item in items" :key="item.slug" class="border-b border-default sm:odd:border-e lg:border-e lg:last:border-e-0">
            <a :href="`#${item.slug}`" class="group flex items-baseline gap-3 py-4 sm:px-4">
              <span class="kicker text-primary">{{ item.index }}</span>
              <span class="font-display font-bold text-highlighted truncate group-hover:text-primary transition-colors">{{ item.title }}</span>
            </a>
          </li>
        </ol>
      </UContainer>
    </section>

    <article
      v-for="item in items"
      :id="item.slug"
      :key="item.slug"
      class="border-b border-default py-16 lg:py-24 scroll-mt-(--ui-header-height)"
    >
      <UContainer>
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-5">
            <p class="kicker">
              <span class="text-primary">{{ item.index }}</span>
              <template v-if="item.host">
                — {{ item.host }}
              </template>
            </p>

            <h2 class="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance text-highlighted">
              {{ item.title }}
            </h2>
          </div>

          <div class="lg:col-span-7 lg:pt-9">
            <MDC
              :value="item.description"
              unwrap="p"
              tag="p"
              :cache-key="`templates-${item.slug}-description`"
              class="text-lg/relaxed text-toned text-pretty"
            />

            <ul v-if="item.features?.length" class="mt-6 flex flex-wrap border-t border-s border-default">
              <li
                v-for="feature in item.features"
                :key="feature.title"
                class="flex items-center gap-2 border-b border-e border-default px-3 py-2 text-sm text-default"
              >
                <UIcon v-if="feature.icon" :name="feature.icon" class="size-4 shrink-0 text-primary" />
                {{ feature.title }}
              </li>
            </ul>

            <div v-if="item.links?.length" class="mt-8 flex flex-wrap gap-3">
              <UButton
                v-for="link of item.links"
                :key="link.label"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-arrow-up-right"
                v-bind="link"
              />
            </div>
          </div>
        </div>

        <figure class="mt-12">
          <component
            :is="item.href ? 'a' : 'div'"
            :href="item.href"
            :target="item.href ? '_blank' : undefined"
            :rel="item.href ? 'noopener' : undefined"
            class="group block border border-default bg-muted overflow-hidden"
          >
            <UColorModeImage
              :light="`/assets/templates/${item.slug}-light.png`"
              :dark="`/assets/templates/${item.slug}-dark.png`"
              :alt="item.title"
              class="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none"
              width="1200"
              height="466"
              sizes="100vw lg:1200px"
              format="webp"
              loading="lazy"
            />
          </component>

          <figcaption class="mt-3 text-sm text-muted">
            <span class="kicker me-2 text-highlighted">{{ t('templates.figure') }} {{ item.index }}</span>{{ item.host || item.title }}
          </figcaption>
        </figure>
      </UContainer>
    </article>
  </main>
</template>
