---
title: "ComponentEmits"
description: "用一行 `:component-emits` 列出 Vue 组件的全部事件，事件名、参数签名与 JSDoc 说明来自 `defineEmits` 的类型定义，与 Props、Slots 表格配套组成完整 API 文档。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-emits"
---
# ComponentEmits

> 用一行 `:component-emits` 列出 Vue 组件的全部事件，事件名、参数签名与 JSDoc 说明来自 `defineEmits` 的类型定义，与 Props、Slots 表格配套组成完整 API 文档。

`ComponentEmits` 读取组件的 `defineEmits` 类型，渲染事件名、参数签名与说明。

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
:component-emits{slug="TestApi"}
```

省略 `slug` 时按当前路由的最后一段查找组件。

## 编写事件说明

使用具名元组语法声明事件，并在每个事件上写 JSDoc。layer 在构建期从源码中解析这些注释，补全 `vue-component-meta` 无法读取的事件说明：

```vue [components/TestApi.vue]
<script setup lang="ts">
defineEmits<{
  /**
   * 值变化时触发
   * @see https://vuejs.org/guide/components/events.html
   */
  change: [value: string]
  /**
   * 删除时触发
   */
  delete: []
}>()
</script>
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

See commit history for [layer/modules/component-docs/runtime/components/ComponentEmits.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/modules/component-docs/runtime/components/ComponentEmits.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/component-docs/runtime/components/ComponentEmits.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
