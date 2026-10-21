---
title: "ComponentCode"
description: "ComponentCode 让作者在 Markdown 中以声明式属性矩阵驱动任意已注册的 Vue 组件实时渲染，并同步合成可复制粘贴的 Vue 代码片段。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-code"
---
# ComponentCode

> ComponentCode 让作者在 Markdown 中以声明式属性矩阵驱动任意已注册的 Vue 组件实时渲染，并同步合成可复制粘贴的 Vue 代码片段。

## 用法

### 基本用法

最小示例：传入 `name`（PascalCase 的组件名）与初始 `props`，配合 `items` 给出可选项。

```mdc
::component-code
---
name: UBadge
props:
  label: New
  color: primary
  variant: solid
items:
  color: [primary, secondary, success, warning, error, neutral]
  variant: [solid, outline, soft, subtle]
---
::
```

> [!NOTE]
> See: /docs/components/component-example#componentexampleextras
> 
> ComponentCode 与 ComponentExample 共用同一个 
> 
> ComponentExampleExtras
> 
>  扩展组件。

## API

### Props

```ts
/**
 * Props for the ComponentCode component
 */
interface ComponentCodeProps {
  name: string;
  props?: Record<string, any> | undefined;
  items?: Record<string, any[]> | undefined;
  model?: string[] | undefined;
  external?: string[] | undefined;
  hide?: string[] | undefined;
  ignore?: string[] | undefined;
  slots?: Record<string, any> | undefined;
  /**
   * 是否使用 Prettier 格式化代码
   * @default false
   */
  prettier?: boolean | undefined;
  /**
   * 是否折叠代码块
   * @default false
   */
  collapse?: boolean | { icon?: string | undefined; name?: string | undefined; openText?: string | undefined; closeText?: string | undefined; open?: boolean | undefined; } | undefined;
  highlights?: number[] | undefined;
  overflowHidden?: boolean | undefined;
  elevated?: boolean | undefined;
}
```

## Changelog

See commit history for [layer/app/components/content/ComponentCode.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/ComponentCode.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentCode.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
