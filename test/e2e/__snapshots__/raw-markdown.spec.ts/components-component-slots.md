---
title: "ComponentSlots"
description: "ComponentSlots 通过 nuxt-component-meta 自动为 Vue 组件生成完整的 Slot 插槽文档，在 Markdown 中一行代码即可展示所有插槽的名称、作用域变量类型和功能说明，大幅简化手写 API 文档的工作量。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-slots"
---
# ComponentSlots

> ComponentSlots 通过 nuxt-component-meta 自动为 Vue 组件生成完整的 Slot 插槽文档，在 Markdown 中一行代码即可展示所有插槽的名称、作用域变量类型和功能说明，大幅简化手写 API 文档的工作量。

## 用法

在您的 Markdown 文档中使用 `:component-slots` 语法：

```mdc
:component-slots{slug="TestApi"}
```

## API

### Props

```ts
/**
 * Props for the ComponentSlots component
 */
interface ComponentSlotsProps {
  /**
   * 获取组件插槽的 slug 标识
   * @default 路由路径的最后一段
   */
  slug?: string | undefined;
}
```

## Changelog

See commit history for [layer/app/components/content/ComponentSlots.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/ComponentSlots.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentSlots.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
