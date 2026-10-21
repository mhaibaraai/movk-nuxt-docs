---
title: "ComponentProps"
description: "ComponentProps 通过 nuxt-component-meta 自动读取 Vue 组件元数据，在 Markdown 文档中一行代码生成包含属性名称、类型、默认值和说明的完整 Props 文档表格，支持通过 slug 属性指定目标组件名称。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-props"
---
# ComponentProps

> ComponentProps 通过 nuxt-component-meta 自动读取 Vue 组件元数据，在 Markdown 文档中一行代码生成包含属性名称、类型、默认值和说明的完整 Props 文档表格，支持通过 slug 属性指定目标组件名称。

## 用法

在您的 Markdown 文档中使用 `:component-props` 语法：

```mdc
:component-props{slug="TestApi"}
```

## API

### Props

```ts
/**
 * Props for the ComponentProps component
 */
interface ComponentPropsProps {
  /**
   * 获取组件属性的 slug 标识
   * @default 路由路径的最后一段
   */
  slug?: string | undefined;
  /**
   * 需要忽略的属性名数组
   * @default [
    "activeClass",
    "inactiveClass",
    "exactActiveClass",
    "ariaCurrentValue",
    "href",
    "rel",
    "noRel",
    "prefetch",
    "prefetchOn",
    "noPrefetch",
    "prefetchedClass",
    "replace",
    "exact",
    "exactQuery",
    "exactHash",
    "external",
    "onClick",
    "viewTransition",
    "enterKeyHint",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget"
]
   */
  ignore?: string[] | undefined;
  prose?: boolean | undefined;
}
```

## Changelog

See commit history for [layer/app/components/content/ComponentProps.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/ComponentProps.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentProps.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
