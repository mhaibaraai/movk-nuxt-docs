---
title: useFaq
description: AI Chat 常见问题管理 Composable。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/composables/useFaq.ts
---

## 概述

`useFaq()` 为 AI Chat 功能提供结构化的常见问题列表，帮助用户快速了解文档系统的核心功能。问题按类别组织，便于用户发现和查询。

## 使用示例

```ts [composables/useFaq.ts]
export interface FaqItem {
  category: string
  items: string[]
}

export function useFaq() {
  const faqQuestions: FaqItem[] = [
    {
      category: '快速开始',
      items: [
        '如何安装？',
        '支持哪些框架？',
        '有演示站点吗？'
      ]
    },
    {
      category: '核心功能',
      items: [
        'Markdown 语法支持哪些扩展？',
        '如何配置主题？',
        '支持暗色模式吗？'
      ]
    }
  ]

  return {
    faqQuestions
  }
}
```

## API

### `useFaq()`{lang="ts-type"}

返回常见问题配置。

### 返回值

::field-group

  :::field{name="faqQuestions" type="FaqItem[]"}
  常见问题列表，按分类组织。
  :::collapsible
    ::field-group
      ::field{name="category" type="string" required}
      问题分类名称。
      ::

      ::field{name="items" type="string[]" required}
      该分类下的问题列表。
      ::
    ::
  :::
  :::

::

## Changelog

:commit-changelog{suffix="ts" commitPath="layer/app/composables"}
