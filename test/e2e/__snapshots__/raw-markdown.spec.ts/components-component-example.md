---
title: "ComponentExample"
description: "用 `:component-example` 把示例目录中的 Vue 文件渲染为实时预览，并在下方展示带高亮的源码；支持行高亮、折叠、可调参数与仅客户端渲染，适合展示组件在真实场景下的组合用法。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/component-example"
---
# ComponentExample

> 用 `:component-example` 把示例目录中的 Vue 文件渲染为实时预览，并在下方展示带高亮的源码；支持行高亮、折叠、可调参数与仅客户端渲染，适合展示组件在真实场景下的组合用法。

`ComponentExample` 渲染一个示例组件的实时预览，并在下方展示该示例文件的源码。源码在构建期读取，与预览始终一致。

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

## 编写示例

示例放在 `app/components/content/examples/` 目录（可以有子目录），文件名即示例名：

```text
app/components/content/examples/
└── AccordionExample.vue
```

`name` 传入文件名，支持 PascalCase 或 kebab-case：

```mdc
:component-example{name="AccordionExample"}
```

## 源码展示

### 高亮与折叠

`highlights` 高亮指定行，`collapse` 折叠较长的源码：

```mdc
::component-example
---
name: AccordionExample
highlights: [2, 9]
collapse: true
---
::
```

`collapse` 也可以传入对象，自定义按钮文案与初始状态：

```mdc
::component-example
---
name: AccordionExample
collapse:
  openText: 展开源码
  closeText: 收起源码
---
::
```

### 只显示预览或源码

- `source: false` 只渲染预览
- `preview: false` 只展示源码，此时代码块显示文件名，可用 `filename` 覆盖
- `prettier: true` 使用 Prettier 格式化源码后再展示

## 可调参数

`options` 在预览上方生成参数选择器，选中的值作为 props 传给示例组件。名称以 `color` 结尾的参数显示色块：

```mdc
::component-example
---
name: ButtonExample
options:
  - name: color
    label: color
    items: [primary, secondary, neutral]
    default: primary
  - name: label
    label: label
    default: Button
---
::
```

`props` 传入固定的初始 props，与 `options` 合并后生效。

## 仅客户端渲染

示例内部直接使用 `window`、`document`、`setInterval` 等浏览器 API 时，设置 `client-only` 让预览只在客户端渲染，避免 SSR 阶段报错：

```mdc
:component-example{name="AccordionExample" client-only}
```

## 扩展示例容器

在项目中新建 `app/components/content/ComponentExampleExtras.vue`，即可在每个示例容器内叠加额外 UI（主题可视化、Playground 按钮等）。layer 默认提供空实现，[ComponentCode](https://docs.mhaibaraai.cn/docs/components/component-code) 也会渲染它。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | `name` 的原始值 |
| `camelName` | `string` | 示例名的 camelCase 形式 |
| `pascalName` | `string` | 示例名的 PascalCase 形式 |
| `effectiveProps` | `Record<string, any>` | `props` 与 `options` 合并后的当前值 |
| `options` | `Array<{ name: string, label: string }> \| undefined` | 原样透传的 `options` |
| `wrapperContainer` | `HTMLElement \| null` | 示例最外层容器，用于定位浮层 |
| `componentContainer` | `HTMLElement \| null` | 示例组件的渲染容器，用于扫描 DOM |

下例参考 [Nuxt UI 的 `ComponentThemeVisualizer.vue`](https://github.com/nuxt/ui/blob/v4/docs/app/components/content/ComponentThemeVisualizer.vue)，在示例上叠加主题可视化：

```vue [app/components/content/ComponentExampleExtras.vue]
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

扩展组件只在客户端渲染，不影响 SSR 输出。

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

## Changelog

See commit history for [layer/modules/component-docs/runtime/components/ComponentExample.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/{branch}/layer/modules/component-docs/runtime/components/ComponentExample.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/modules/component-docs/runtime/components/ComponentExample.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
