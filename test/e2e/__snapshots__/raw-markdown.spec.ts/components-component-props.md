---
title: "ComponentProps"
description: "在 Markdown 中用一行 `:component-props` 生成 Vue 组件的 Props 表格，名称、默认值、类型与 JSDoc 说明均来自 nuxt-component-meta 提取的元数据，组件改动后文档自动同步。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-props"
---
# ComponentProps

> 在 Markdown 中用一行 `:component-props` 生成 Vue 组件的 Props 表格，名称、默认值、类型与 JSDoc 说明均来自 nuxt-component-meta 提取的元数据，组件改动后文档自动同步。

`ComponentProps` 读取组件的 `defineProps` 定义，把每个 prop 的名称、默认值、类型和 JSDoc 说明渲染为表格。

> [!NOTE]
> See: /docs/guide/features
> 
> 组件文档默认关闭。使用本页与 
> 
> ComponentSlots
> 
> 、
> 
> ComponentEmits
> 
> 、
> 
> ComponentExample
> 
> 、
> 
> ComponentCode
> 
>  前，需在 
> 
> nuxt.config.ts
> 
>  中设置 
> 
> movkNuxtDocs.componentDocs: true
> 
> ，并安装 
> 
> nuxt-component-meta
> 
> 、
> 
> vue-component-meta
> 
>  与 
> 
> prettier
> 
> 。

## 用法

通过 `slug` 指定组件名：

```mdc
:component-props{slug="TestApi"}
```

### 按路由推断组件

省略 `slug` 时取当前路由的最后一段并转为 PascalCase，例如 `/docs/components/button` 对应 `Button`。为组件单独建页时，文件名与组件名保持一致即可直接写 `:component-props`。

### 忽略属性

`ignore` 用于隐藏不希望出现在表格中的 prop。默认已忽略 `NuxtLink` 透传的路由属性（`href`、`prefetch`、`replace` 等）与表单属性（`form`、`formaction` 等），传入 `ignore` 会替换这份默认列表：

```mdc
:component-props{slug="TestApi" :ignore='["disabled", "avatar"]'}
```

### Prose 组件

设置 `prose` 后查找 `Prose` 前缀的组件，例如在 `mermaid` 页面中 `:component-props{prose}` 对应 `ProseMermaid`。

## 元数据来源

表格内容来自组件源码中的类型与注释：

- **默认值**：取 `withDefaults` 或解构默认值；没有运行时默认值时读取 JSDoc 的 `@defaultValue`
- **类型**：枚举类型展开为联合类型，对象类型可展开查看嵌套字段
- **说明**：JSDoc 正文按 Markdown 渲染，`@see` 等标签渲染为链接

```vue [components/TestApi.vue]
<script setup lang="ts">
interface Props {
  /**
   * The variant of the component
   * @defaultValue 'solid'
   */
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
}

defineProps<Props>()
</script>
```

> [!TIP]
> See: /docs/reference/nuxt-config
> 
> 项目 
> 
> app/components/
> 
>  与 
> 
> components/
> 
>  下的组件默认不生成元数据，需要文档化的组件加入 
> 
> componentMeta.include
> 
> ，例如 
> 
> componentMeta: { include: ['app/components/TestApi.vue'] }
> 
> 。
> 
> include
> 
>  支持路径、glob、正则与函数。

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

See commit history for [layer/modules/component-docs/runtime/components/ComponentProps.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/{branch}/layer/modules/component-docs/runtime/components/ComponentProps.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/component-docs/runtime/components/ComponentProps.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
