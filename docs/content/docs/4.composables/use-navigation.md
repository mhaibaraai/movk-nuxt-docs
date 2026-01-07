---
title: useNavigation
description: 导航结构管理 Composable。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useNavigation.ts
---

## 概述

管理文档导航结构，提供导航树处理和面包屑生成功能。

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { rootNavigation, navigationByCategory, findBreadcrumb } = useNavigation(navigation!)

const route = useRoute()
const breadcrumb = computed(() => findBreadcrumb(route.path))
</script>

<template>
  <div>
    <!-- 顶级导航 -->
    <UNavigationMenu :items="rootNavigation" />

    <!-- 侧边栏分类导航 -->
    <UContentNavigation :navigation="navigationByCategory" />

    <!-- 面包屑 -->
    <UBreadcrumb :items="breadcrumb" />
  </div>
</template>
```

### 在 Layout 中使用

```vue
<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation()
)

provide('navigation', navigation)

const { navigationByCategory } = useNavigation(navigation!)
</script>

<template>
  <div class="flex">
    <aside>
      <UContentNavigation :navigation="navigationByCategory" />
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>
```

## API

### `useNavigation(navigation)`{lang="ts-type"}

处理导航树，提供导航和面包屑功能。

### 参数

::field-group
  ::field{name="navigation" type="Ref<ContentNavigationItem[]>" required}
  Nuxt Content 提供的导航数据。
  ::
::

### 返回值

::field-group
  ::field{name="rootNavigation" type="ComputedRef<ContentNavigationItem[]>"}
  根级导航项数组。
  ::

  ::field{name="navigationByCategory" type="ComputedRef<ContentNavigationItem[]>"}
  按分类分组的当前页面子导航。
  ::

  ::field{name="findBreadcrumb" type="(path: string) => ContentNavigationItem[]"}
  生成指定路径的面包屑导航。
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
