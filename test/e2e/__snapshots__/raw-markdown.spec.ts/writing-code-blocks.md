---
title: "代码块"
description: "代码块默认使用 github-light / github-dark 高亮，支持文件名、行高亮、复制按钮与颜色、图标预览；用 code-group、code-tree 等组件组织多文件与长代码示例。"
canonical_url: "https://docs.mhaibaraai.cn/docs/writing/code-blocks"
---
# 代码块

> 代码块默认使用 github-light / github-dark 高亮，支持文件名、行高亮、复制按钮与颜色、图标预览；用 code-group、code-tree 等组件组织多文件与长代码示例。

## 基础用法

### 行内代码

用反引号包裹行内代码。需要 TypeScript 高亮时加上 `{lang="ts-type"}`：

```mdc
`useMovkI18n()` 返回 `Ref<string>`{lang="ts-type"}
```

### 代码块

三个反引号后写语言标识。亮色模式使用 `github-light`，暗色模式使用 `github-dark`，随站点主题自动切换：

````mdc
```ts
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs']
})
```
````

layer 预置了 `bash`、`shell`、`diff`、`json`、`js`、`ts`、`html`、`css`、`vue`、`mdc`、`md`、`yaml` 的语法，开启 Mermaid 时追加 `mermaid`。其他语言需加入 `content.build.markdown.highlight.langs`。

### 文件名

在语言标识后用方括号写文件名，代码块顶部显示文件名与按扩展名匹配的图标：

````mdc
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs']
})
```
````

### 行高亮

在文件名后用花括号标出需要高亮的行，支持单行与范围：

````mdc
```ts [nuxt.config.ts] {3-5}
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  movkNuxtDocs: {
    mermaid: true
  }
})
```
````

### 复制按钮

每个代码块右上角都有复制按钮，点击后文字由「复制」变为「已复制」，约 2 秒后复原。文案跟随当前语言。

### 颜色与图标预览

代码中的字面颜色值（如 `#d64b34`、`rgb(214 75 52)`）旁显示色块，`i-lucide-*` 这类图标名旁显示对应图标。Tailwind 调色板名（如 `primary: 'vermilion'`）不显示色块：

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'vermilion'
    }
  },
  toc: {
    bottom: {
      links: [{ icon: 'i-lucide-message-circle-code', label: 'llms.txt', to: '/llms.txt' }]
    }
  }
})
```

```css [app/assets/css/main.css]
@theme static {
  --color-brand-500: #d64b34;
}
```

> [!TIP]
> See: https://ui.nuxt.com/getting-started/icons/nuxt#theme
> 
> 代码块图标可在 `app/app.config.ts` 中自定义：
> 
> ```ts [app/app.config.ts]
> export default defineAppConfig({
>   ui: {
>     prose: {
>       codeIcon: {
>         terminal: 'i-lucide-square-terminal'
>       }
>     }
>   }
> })
> ```

## 组合多个代码块

### `CodeGroup`

`code-group` 把多个代码块合成选项卡，用于不同包管理器或不同写法：

````mdc
::code-group

```bash [pnpm]
pnpm add @movk/nuxt-docs
```

```bash [npm]
npm install @movk/nuxt-docs
```

```bash [yarn]
yarn add @movk/nuxt-docs
```

```bash [bun]
bun add @movk/nuxt-docs
```

::
````

标签页全部是包管理器（`pnpm`、`npm`、`yarn`、`bun`、`deno`）或全部是 TypeScript / JavaScript 代码的代码组会自动全站同步：在任意一处切换到 `npm`，其他页面的同类代码组也会切换，并在下次访问时保持。layer 会把这类代码组的标签页排成统一顺序。需要独立切换时，给代码组声明自己的 `sync` 值即可，例如 `::code-group{sync="my-group"}`。

### `CodeTree`

`code-tree` 以文件树展示一组相关文件，`default-value` 指定默认打开的文件：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs']
})
```

```ts [app/app.config.ts]
export default defineAppConfig({
  header: {
    title: 'My Docs'
  }
})
```

```md [content/index.md]
---
title: My Docs
---

# My Docs
```

```md [content/docs/1.getting-started/1.index.md]
---
title: 简介
description: 一句话介绍这个项目。
---

## 快速开始
```

```json [package.json]
{
  "name": "my-docs",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate"
  },
  "dependencies": {
    "@movk/nuxt-docs": "^3.0.0",
    "nuxt": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### `CodePreview`

`code-preview` 把渲染结果与源码上下排列：默认插槽写要渲染的内容，`#code` 插槽写展示的代码。本页的示例都使用了它：

````mdc
::code-preview
`行内代码`

#code
```mdc
`行内代码`
```
::
````

### `CodeCollapse`

`code-collapse` 折叠较长的代码，读者需要时再展开：

````mdc
::code-collapse

```css [app/assets/css/colors.css]
@theme static {
--color-vermilion-50: #fdf3f1;
/* ... */
--color-vermilion-950: #3c110a;
}
```

::
````


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
