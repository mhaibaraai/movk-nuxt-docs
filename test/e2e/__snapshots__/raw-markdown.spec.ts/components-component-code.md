---
title: "ComponentCode"
description: "用 `::component-code` 以属性矩阵驱动任意已注册的 Vue 组件实时渲染，读者在预览上方切换属性值，下方的 Vue 代码片段同步更新，可直接复制使用。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-code"
---
# ComponentCode

> 用 `::component-code` 以属性矩阵驱动任意已注册的 Vue 组件实时渲染，读者在预览上方切换属性值，下方的 Vue 代码片段同步更新，可直接复制使用。

`ComponentCode` 不需要单独的示例文件：在 frontmatter 中给出组件名与初始 props，即可得到可交互的预览和对应的 Vue 代码。

> [!NOTE]
> See: /docs/components/component-props
> 
> 需要开启 
> 
> movkNuxtDocs.componentDocs
> 
> ，前置条件与 
> 
> ComponentProps
> 
>  相同。

## 用法

`name` 为 PascalCase 的组件名，可以是 Nuxt UI 组件或项目中自动导入的组件。`props` 中的每个键都会生成一个控件，`items` 为对应的键提供可选值：

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

布尔类型的 prop 自动提供 `true` / `false` 两个选项，数字类型显示数字输入框，其余显示文本框。代码片段会省略与组件默认值相同的布尔与字符串属性。

## 控制生成的代码

| 字段 | 作用 |
| --- | --- |
| `ignore` | 不生成控件，但仍写入代码，适合固定不变的属性 |
| `hide` | 既不生成控件，也不写入代码，适合只影响预览的属性 |
| `external` | 在 `<script setup>` 中声明为 `ref`，模板中以变量绑定 |
| `model` | 以 `v-model:{key}` 绑定；`modelValue` 始终以 `v-model` 绑定 |
| `slots` | 插槽内容，键为插槽名，值为模板字符串 |

```mdc
::component-code
---
name: UInput
props:
  modelValue: ''
  placeholder: 搜索文档
  class: w-64
external: [modelValue]
hide: [class]
slots:
  trailing: <UKbd value="/" />
---
::
```

上例生成的代码中，`modelValue` 声明为 `const value = ref("")` 并以 `v-model="value"` 绑定，`class` 只作用于预览。

> [!TIP]
> See: /docs/components/component-example#扩展示例容器
> 
> ComponentCode 与 ComponentExample 共用 
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

See commit history for [layer/modules/component-docs/runtime/components/ComponentCode.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/modules/component-docs/runtime/components/ComponentCode.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/component-docs/runtime/components/ComponentCode.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
