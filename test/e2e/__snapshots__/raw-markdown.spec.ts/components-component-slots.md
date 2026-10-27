---
title: "ComponentSlots"
description: "用一行 `:component-slots` 列出 Vue 组件的全部插槽，插槽名、作用域参数类型与 JSDoc 说明来自 `defineSlots` 的类型定义，无需手写插槽文档。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-slots"
---
# ComponentSlots

> 用一行 `:component-slots` 列出 Vue 组件的全部插槽，插槽名、作用域参数类型与 JSDoc 说明来自 `defineSlots` 的类型定义，无需手写插槽文档。

`ComponentSlots` 读取组件的 `defineSlots` 类型，渲染插槽名、作用域参数类型与说明。

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

```mdc
:component-slots{slug="TestApi"}
```

省略 `slug` 时按当前路由的最后一段查找组件。

## 编写插槽说明

在 `defineSlots` 中为每个插槽写 JSDoc，作用域参数的类型会显示在类型列：

```vue [components/TestApi.vue]
<script setup lang="ts">
defineSlots<{
  /**
   * 默认内容插槽
   */
  default(props?: {}): any
  /**
   * 头像插槽，作用域暴露头像地址
   * @see https://ui.nuxt.com/components/avatar
   */
  avatar(props: { src: string }): any
}>()
</script>
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

See commit history for [layer/modules/component-docs/runtime/components/ComponentSlots.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/{branch}/layer/modules/component-docs/runtime/components/ComponentSlots.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/component-docs/runtime/components/ComponentSlots.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
