---
description: 学习如何利用 Nuxt 的页面和布局系统，在 Movk Nuxt Docs 中构建交互式和可重用的元素，以增强您的文档网站。
title: Nuxt
category: core-concepts
---

## Vue 页面

Movk Nuxt Docs 提供了三个内置页面：

- `pages/index.vue`：首页
- `pages/releases.vue`：发布日志页面
- `pages/docs/[...slug].vue`：文档页面

您可以通过在 `app/pages/` 目录下创建 Vue 文件来添加自定义页面。例如，创建一个简单的 `hello.vue` 页面：

```vue [app/pages/hello.vue]
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  // 移除头部
  header: false,
  // 移除页脚
  footer: false,
})
</script>
```

## 扩展页面

::tip{to="https://content.nuxt.com/docs/collections/inherit-schema-from-component"}
从 Vue 组件继承 Schema
::

您可以通过以下配置定义一个 `releases` 页面：

::code-tree{defaultValue="content.config.ts"}

```ts[content.config.ts]
import { defineCollection, defineContentConfig, z, property } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    releases: defineCollection(asSeoCollection({
      type: 'page',
      source: 'releases.yml',
      schema: z.object({
        releases: z.string(),
        hero: property(z.object({})).inherit('@nuxt/ui/components/PageHero.vue')
      })
    }))
  }
})
```

```vue [app/pages/releases.vue]
<script setup lang="ts">
const { data: page } = await useAsyncData('releases', () => queryCollection('releases').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

defineOgImageComponent('Nuxt', {
  title,
  description
})

const { data: versions } = await useFetch(page.value.releases || '', {
  transform: (data: {
    releases: {
      name?: string
      tag: string
      publishedAt: string
      markdown: string
    }[]
  }) => {
    return data.releases.map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt,
      markdown: release.markdown
    }))
  }
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      class="md:border-b border-default"
      :ui="{
        container: 'relative lg:py-32'
      }"
    >
      <template #top>
        <div
          class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"
        />
      </template>

      <LazyStarsBg />

      <div
        aria-hidden="true"
        class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8"
      />
    </UPageHero>

    <UPageSection :ui="{ container: 'py-0!' }">
      <div class="py-4 md:py-8 lg:py-16 md:border-x border-default">
        <UContainer class="max-w-5xl">
          <UChangelogVersions>
            <UChangelogVersion
              v-for="version in versions"
              :key="version.tag"
              v-bind="version"
              :ui="{
                root: 'flex items-start',
                container: 'max-w-xl',
                header: 'border-b border-default pb-4',
                title: 'text-3xl',
                date: 'text-xs/9 text-highlighted font-mono',
                indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
              }"
            >
              <template #body>
                <ClientOnly>
                  <MDC v-if="version.markdown" :value="version.markdown" />
                </ClientOnly>
              </template>
            </UChangelogVersion>
          </UChangelogVersions>
        </UContainer>
      </div>
    </UPageSection>
  </div>
</template>
```

```mdc[content/releases.yaml]
title: 发布日志
description: 了解 Movk Nuxt Docs 的最新功能、改进和错误修复。
navigation: false
hero:
  title: 发布日志
  description: 了解 Movk Nuxt Docs 的最新功能、改进和错误修复。
  releases: https://ungh.cc/repos/mhaibaraai/movk-nuxt-docs/releases
  links:
    - label: 在 GitHub 上标星
      color: neutral
      variant: outline
      to: https://github.com/mhaibaraai/movk-nuxt-docs
      target: _blank
      icon: i-lucide-star
```

::

## 布局

Movk Nuxt Docs 提供了两个内置布局：

- `default` 布局：用于首页和自定义 Vue 页面
- `docs` 布局：用于文档页面

如果您想使用不同的布局，可以在 `app/layouts/` 目录下创建。

```vue [app/layouts/custom.vue]
<template>
  <main class="custom-layout">
    <slot />
  </main>
</template>
```
