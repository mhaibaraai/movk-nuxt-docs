---
title: "ComponentEmits"
description: "ComponentEmits 通过 nuxt-component-meta 自动提取 Vue 组件的 defineEmits 定义，在 Markdown 文档中生成包含事件名称、参数类型和说明的 Emits 文档表格，无需手动编写事件 API 说明，与 ComponentProps 和 ComponentSlots 配合使用。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-emits"
---
# ComponentEmits

> ComponentEmits 通过 nuxt-component-meta 自动提取 Vue 组件的 defineEmits 定义，在 Markdown 文档中生成包含事件名称、参数类型和说明的 Emits 文档表格，无需手动编写事件 API 说明，与 ComponentProps 和 ComponentSlots 配合使用。

## 用法

在您的 Markdown 文档中使用 `:component-emits` 语法：

```mdc
:component-emits{slug="TestApi"}
```

## API

### Props

```ts
/**
 * Props for the ComponentEmits component
 */
interface ComponentEmitsProps {
  /**
   * 获取组件事件的 slug 标识
   * @default 路由路径的最后一段
   */
  slug?: string | undefined;
}
```

## Changelog

See commit history for [layer/app/components/content/ComponentEmits.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/ComponentEmits.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentEmits.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
