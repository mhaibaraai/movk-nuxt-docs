---
title: "ComponentExample"
description: "ComponentExample 在文档中嵌入交互式 Vue 组件示例，实时渲染预览效果并展示带语法高亮的源代码，支持折叠显示。通过 useFetchComponentExample 获取构建时注册的示例文件，显著提升文档的可读性和用户体验。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-example"
---
# ComponentExample

> ComponentExample 在文档中嵌入交互式 Vue 组件示例，实时渲染预览效果并展示带语法高亮的源代码，支持折叠显示。通过 useFetchComponentExample 获取构建时注册的示例文件，显著提升文档的可读性和用户体验。

## 用法

`ComponentExample` 用于在文档中嵌入可交互的组件示例。它会自动加载组件,并展示实时预览和源代码。

### 基本用法

在您的 Markdown 文档中使用 `:component-example` 指令：

```mdc
:component-example{name="AccordionExample"}
```

### 高级配置

```md [md]
::component-example
---
name: AccordionExample
highlights: [10, 15, 20]
collapse: true
---
::
```

### 仅客户端渲染

如果示例内部会直接使用 `window`、`document`、`setInterval` 这类浏览器 API，可以加上 `client-only="true"`，让预览组件仅在客户端渲染，避免 SSR 阶段触发警告：

```md [md]
:component-example{name="AccordionExample" client-only="true"}
```

## API

### Props

```ts
/**
 * Props for the ComponentExample component
 */
interface ComponentExampleProps {
  name: string;
  /**
   * 是否在 iframe 中渲染组件
   * @default false
   */
  iframe?: boolean | { [key: string]: any; } | undefined;
  /**
   * 是否在移动端尺寸的 iframe 视口中显示组件
   * @default false
   */
  iframeMobile?: boolean | undefined;
  props?: { [key: string]: any; } | undefined;
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
  /**
   * 是否显示预览
   * 当设置为 `false` 时，将显示文件名
   * @default true
   */
  preview?: boolean | undefined;
  /**
   * 是否显示源代码
   * @default true
   */
  source?: boolean | undefined;
  /**
   * 链接到组件的可变属性列表
   */
  options?: { type?: string | undefined; alias?: string | undefined; name: string; label: string; items?: any[] | undefined; default: any; multiple?: boolean | undefined; }[] | undefined;
  /**
   * 代码块中需要高亮的行号列表
   */
  highlights?: number[] | undefined;
  /**
   * 是否在包装器上添加 overflow-hidden
   */
  overflowHidden?: boolean | undefined;
  /**
   * 是否只在客户端渲染预览组件，适用于依赖 window / setInterval 等浏览器 API 的示例
   * @default false
   */
  clientOnly?: boolean | undefined;
  /**
   * 是否添加 background-elevated 到 wrapper
   */
  elevated?: boolean | undefined;
  /**
   * @default 'vue'
   */
  lang?: string | undefined;
  /**
   * 覆盖用于代码块的文件名
   */
  filename?: string | undefined;
}
```

### Slots

```ts
/**
 * Slots for the ComponentExample component
 */
interface ComponentExampleSlots {
  options(): any;
  code(): any;
}
```

## `ComponentExampleExtras`

在消费方仓库新建 `app/components/content/ComponentExampleExtras.vue` 即可在示例容器内叠加 `ThemeVisualizer`、Playground 按钮等附加 UI，无需 fork `ComponentExample`。Layer 默认提供空实现。

可用 props：

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | MDC `name="..."` 的原始值，即示例文件名 |
| `camelName` | `string` | 示例名的 camelCase 形式 |
| `pascalName` | `string` | 示例名的 PascalCase 形式，来自 `useFetchComponentExample` |
| `effectiveProps` | `Record<string, any>` | 当前生效的合并 props（含 options） |
| `options` | `Array<{ name, label, ... }> \| undefined` | options 配置原样透传 |
| `wrapperContainer` | `HTMLElement \| null` | 最外层 wrapper，用于 popover / 高亮框定位 |
| `componentContainer` | `HTMLElement \| null` | 示例组件实际渲染容器，用于 `querySelector('[data-slot]')` 等 DOM 扫描 |

### 示例：叠加 ThemeVisualizer

参考 [Nuxt UI 的 `ComponentThemeVisualizer.vue`](https://github.com/nuxt/ui/blob/v4/docs/app/components/content/ComponentThemeVisualizer.vue) 实现一个 `LazyComponentThemeVisualizer`，然后在覆盖文件中接入。

```vue [docs/app/components/content/ComponentExampleExtras.vue]
<script setup lang="ts">
import { camelCase } from 'scule'

defineProps<{
  wrapperContainer: HTMLElement | null
  componentContainer: HTMLElement | null
}>()

const route = useRoute()
const slug = computed(() => camelCase(route.path.split('/').pop() ?? ''))
</script>

<template>
  <LazyComponentThemeVisualizer
    :slug="slug"
    :container="componentContainer"
    :position-container="wrapperContainer"
  />
</template>
```

## Changelog

See commit history for [layer/app/components/content/ComponentExample.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/ComponentExample.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentExample.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
