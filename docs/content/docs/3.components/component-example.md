---
title: ComponentExample
description: 学习如何使用 `ComponentExample` 组件创建引人入胜的交互式组件示例，功能包括实时预览、源代码展示、代码高亮和折叠，以极大地提升文档的交互性和用户体验。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/ComponentExample.vue
---

## 用法

`ComponentExample` 用于在文档中嵌入可交互的组件示例。它会自动加载组件,并展示实时预览和源代码。

::warning
使用 `ComponentExample` 前,需要在 `nuxt.config.ts` 中配置示例组件目录,以确保组件被全局注册:

```ts
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ 
          path: resolve('./app/components/content/examples'), 
          pathPrefix: false, 
          prefix: '', 
          global: true 
        })
      })
    }
  ]
})
```

此配置将 `./app/components/content/examples` 目录下的所有组件注册为全局组件,使 `ComponentExample` 能够动态加载它们。
::

### 基本用法

在您的 Markdown 文档中使用 `::component-example` 指令：

```md [md]
:component-example{name="ButtonExample"}
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

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:commit-changelog
