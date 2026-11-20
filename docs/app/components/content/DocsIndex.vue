<script setup lang="ts">
const route = useRoute()
const { docsCollection, locale } = useMovkI18n()

const collection = docsCollection.value as 'docs'
const englishPrefix = '/en'

const { data } = await useAsyncData(`docs-index-${locale.value}`, async () => {
  const [pages, englishPages] = await Promise.all([
    queryCollection(collection).select('title', 'path').all(),
    locale.value === 'en' ? [] : queryCollection('docs_en').select('title', 'path').all()
  ])
  return { pages, englishPages }
})

// 用英文文档的标题分组，让两种语言的索引共用字母顺序。
const groups = computed(() => {
  const englishTitles = new Map(data.value?.englishPages.map(page => [page.path.slice(englishPrefix.length), page.title]))
  const entries = (data.value?.pages ?? [])
    .filter(page => page.path !== route.path)
    .map((page) => {
      const sortKey = (englishTitles.get(page.path) || page.title).trim()
      const letter = sortKey.charAt(0).toUpperCase()
      return {
        title: page.title,
        // 英文标题与页面标题不同时作为副标题，方便中文页按字母检索
        subtitle: sortKey !== page.title ? sortKey : undefined,
        to: page.path,
        sortKey,
        letter: /[A-Z]/.test(letter) ? letter : '#'
      }
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'en'))

  const letters = [...new Set(entries.map(entry => entry.letter))]
  return letters.map(letter => ({ letter, items: entries.filter(entry => entry.letter === letter) }))
})
</script>

<template>
  <div class="mt-8">
    <nav class="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm" aria-label="A–Z">
      <a
        v-for="group in groups"
        :key="group.letter"
        :href="`#index-${group.letter}`"
        class="text-muted transition-colors hover:text-primary"
      >{{ group.letter }}</a>
    </nav>

    <section
      v-for="group in groups"
      :id="`index-${group.letter}`"
      :key="group.letter"
      class="mt-8 grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-inverted pt-3"
    >
      <span class="font-display text-2xl font-bold text-primary">{{ group.letter }}</span>

      <ul>
        <li v-for="item in group.items" :key="item.to" class="border-b border-default last:border-b-0">
          <NuxtLink :to="item.to" class="group flex items-baseline justify-between gap-4 py-2.5">
            <span class="min-w-0">
              <span class="text-highlighted transition-colors group-hover:text-primary">{{ item.title }}</span>
              <span v-if="item.subtitle" class="ms-2 text-sm text-dimmed">{{ item.subtitle }}</span>
            </span>
            <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-dimmed transition-colors group-hover:text-primary" />
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
