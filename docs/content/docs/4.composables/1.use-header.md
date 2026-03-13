---
title: useHeader
description: Header 组件导航链接配置 Composable。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useHeader.ts
---

## 概述

`useHeader()` 配置 Header 组件的桌面端和移动端导航链接。

### 默认实现

默认返回空数组：

```ts [composables/useHeader.ts]
export function useHeader() {
  return {
    desktopLinks: computed(() => []),
    mobileLinks: computed(() => [])
  }
}
```

## 使用示例

### 覆盖默认配置

在项目中创建 `composables/useHeader.ts` 覆盖默认配置：

```ts [composables/useHeader.ts]
export function useHeader() {
  const route = useRoute()

  return {
    desktopLinks: computed(() => [
      {
        label: '文档',
        to: '/docs',
        icon: 'i-lucide-book',
        active: route.path.startsWith('/docs')
      },
      {
        label: 'API',
        to: '/api',
        icon: 'i-lucide-code',
        active: route.path.startsWith('/api')
      }
    ]),

    mobileLinks: computed(() => [
      {
        label: '首页',
        to: '/',
        icon: 'i-lucide-square-play'
      },
      {
        label: '文档',
        to: '/docs',
        icon: 'i-lucide-book'
      }
    ])
  }
}
```

### 多语言支持

```ts [composables/useHeader.ts]
export function useHeader() {
  const { t } = useI18n()

  return {
    desktopLinks: computed(() => [
      {
        label: t('nav.docs'),
        to: '/docs',
        icon: 'i-lucide-book'
      },
      {
        label: t('nav.api'),
        to: '/api',
        icon: 'i-lucide-code'
      }
    ]),

    mobileLinks: computed(() => [
      {
        label: t('nav.home'),
        to: '/',
        icon: 'i-lucide-square-play'
      },
      {
        label: t('nav.docs'),
        to: '/docs',
        icon: 'i-lucide-book'
      }
    ])
  }
}
```

## API

### `useHeader()`{lang="ts-type"}

返回 Header 导航链接配置。

### 返回值

::field-group
  ::field{name="desktopLinks" type="ComputedRef<NavigationLink[]>"}
  桌面端导航菜单项。
  ::

  ::field{name="mobileLinks" type="ComputedRef<NavigationLink[]>"}
  移动端导航菜单项。
  ::
::

### 链接对象字段

::field-group
  ::field{name="label" type="string" required}
  显示文本。
  ::

  ::field{name="to" type="string" required}
  链接地址。
  ::

  ::field{name="icon" type="string"}
  图标类名。
  ::

  ::field{name="active" type="boolean"}
  是否激活状态。
  ::

  ::field{name="badge" type="string"}
  徽章文本。
  ::

  ::field{name="children" type="NavigationLink[]"}
  子菜单。
  ::
::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
