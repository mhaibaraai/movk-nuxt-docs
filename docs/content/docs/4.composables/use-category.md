---
title: useCategory
description: 文档分类系统管理 Composable。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useCategory.ts
---

## 概述

管理文档的分类系统，方便对文档进行分组和导航。

### 配置分类

在项目中创建 `composables/useCategory.ts` 覆盖默认配置：

```ts
export function useCategory() {
  return {
    categories: {
      components: [
        {
          id: 'content',
          title: 'Content Components',
          icon: 'i-lucide-component'
        },
        {
          id: 'layout',
          title: 'Layout Components',
          icon: 'i-lucide-layout-dashboard'
        }
      ],
      composables: [
        {
          id: 'navigation',
          title: 'Navigation',
          icon: 'i-lucide-compass'
        },
        {
          id: 'ui',
          title: 'UI Utilities',
          icon: 'i-lucide-sparkles'
        }
      ]
    }
  }
}
```

### Frontmatter 中使用分类

```md
---
title: ComponentPropsLinks
category: content
---
```

## API

### `useCategory()`{lang="ts-type"}

返回分类配置。

### 返回值

::field-group

  :::field{name="categories" type="Record<string, Category[]>"}
  分类配置对象，键为文档目录 slug。
  :::collapsible
    ::field-group
      ::field{name="id" type="string" required}
      分类 ID，对应 frontmatter 的 category 字段。
      ::

      ::field{name="title" type="string" required}
      分类显示标题。
      ::

      ::field{name="icon" type="string" required}
      分类图标类名。
      ::
    ::
  :::
  :::

::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
