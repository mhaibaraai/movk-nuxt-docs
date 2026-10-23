---
title: "MDC 组件"
description: "在 Markdown 中用 MDC 语法嵌入 Nuxt UI 的 Prose 组件：提示块、徽标、卡片、折叠面板、选项卡、步骤、字段说明、图标与按键，无需编写 Vue 代码即可组织更有层次的文档内容。"
canonical_url: "https://docs.mhaibaraai.cn/docs/writing/mdc-components"
---
# MDC 组件

> 在 Markdown 中用 MDC 语法嵌入 Nuxt UI 的 Prose 组件：提示块、徽标、卡片、折叠面板、选项卡、步骤、字段说明、图标与按键，无需编写 Vue 代码即可组织更有层次的文档内容。

[MDC 语法](https://content.nuxt.com/docs/files/markdown#mdc-syntax) 允许在 Markdown 中使用 Vue 组件：块级组件写作 `::name`，行内组件写作 `:name`，属性放在 `{}` 或 YAML 块中，嵌套时每层多加一个冒号。

::prose-note{to="https://ui.nuxt.com/docs/typography"}
本页只列出文档中最常用的 Prose 组件。任何全局注册的 Vue 组件都能以同样的方式在 Markdown 中使用，完整列表见 [Nuxt UI 文档](https://ui.nuxt.com/docs/typography)。
::

## `Callout`

提示块用于强调与正文并列的补充信息。`note`、`tip`、`warning`、`caution` 是预设了图标与颜色的快捷写法：

> [!NOTE]
> 
> 页面标题来自 frontmatter 的 
> 
> title
> 
> ，正文从二级标题开始。

> [!TIP]
> 
> 在 
> 
> app.config.ts
> 
>  中修改的配置无需重启开发服务器。

> [!WARNING]
> 
> 启用 AI Chat 时不能关闭 MCP Server。

> [!CAUTION]
> 
> 不要把 
> 
> NUXT_GITHUB_TOKEN
> 
>  提交到公开仓库。

```mdc
::note
  页面标题来自 frontmatter 的 `title`，正文从二级标题开始。
  ::

  ::tip
  在 `app.config.ts` 中修改的配置无需重启开发服务器。
  ::

  ::warning
  启用 AI Chat 时不能关闭 MCP Server。
  ::

  ::caution
  不要把 `NUXT_GITHUB_TOKEN` 提交到公开仓库。
  ::
```

:::
::

通用的 `callout` 通过 `icon` 与 `color` 自定义外观。所有提示块都接受 [`NuxtLink`](https://nuxt.com/docs/api/components/nuxt-link) 的属性，设置 `to` 后整个提示块可点击：

```mdc
::callout{icon="i-lucide-square-play" color="neutral" to="/docs/getting-started/installation"}
第一次使用？从安装开始。
::
```

## `Badge`

`badge` 的默认插槽支持 Markdown，适合标注版本或状态：

```mdc
::badge
**v3.0.0**
::
```

## `Card` 与 `CardGroup`

`card` 用于突出一段内容或一个入口，支持 `title`、`icon`、`color` 与 `NuxtLink` 属性。用 `card-group` 包裹多个卡片得到网格布局：

```mdc
::card-group
:::card
---
icon: i-lucide-compass
title: 指南
to: /docs/guide/configuration
---
配置、主题、导航与部署。
:::

:::card
---
icon: i-lucide-sparkles
title: AI
to: /docs/ai/ai-chat
---
AI Chat、MCP Server 与 llms.txt。
:::
::
```

## `Accordion`

`accordion` 与 `accordion-item` 把多个问答收进折叠面板，适合 FAQ：

**Q: 文档必须放在哪个目录？**

默认语言的文档放在 

content/docs/

，其他语言放在 

content/{locale}/docs/

，路由前缀固定为 

/docs

。

**Q: 修改 app.config.ts 需要重启吗？**

不需要。

app.config.ts

 在运行时读取，开发服务器会热更新。

**Q: 如何关闭 GitHub 集成？**

在 

app/app.config.ts

 中设置 

github: false

。

```mdc
::accordion
    :::accordion-item{icon="i-lucide-circle-help" label="文档必须放在哪个目录？"}
    默认语言的文档放在 `content/docs/`，其他语言放在 `content/{locale}/docs/`，路由前缀固定为 `/docs`。
    :::

    :::accordion-item{icon="i-lucide-circle-help" label="修改 app.config.ts 需要重启吗？"}
    不需要。`app.config.ts` 在运行时读取，开发服务器会热更新。
    :::

    :::accordion-item{icon="i-lucide-circle-help" label="如何关闭 GitHub 集成？"}
    在 `app/app.config.ts` 中设置 `github: false`。
    :::
  ::
```

:::
::

## `Collapsible`

`collapsible` 默认收起内容，适合放置次要的长表格：

```mdc
::collapsible
| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `theme.radius` | `0.25` | 全局圆角，单位 rem |
| `theme.font` | `editorial` | 标题字体风格 |
| `theme.grain` | `false` | 背景纸张颗粒 |
::
```

## `Tabs`

`tabs` 与 `tabs-item` 用于并列展示可互换的内容，例如同一配置的两种写法：

````mdc
::tabs
:::tabs-item{icon="i-lucide-file-cog" label="app.config.ts"}
```ts [app/app.config.ts]
export default defineAppConfig({
header: { title: 'My Docs' }
})
```
  :::

  :::tabs-item{icon="i-lucide-settings" label="nuxt.config.ts"}
  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    extends: ['@movk/nuxt-docs']
  })
  ```
  :::
::
````

## `Steps`

`steps` 把指定级别的标题渲染为编号步骤，`level` 决定使用哪一级标题：

#### 创建项目

`````bash [Terminal]
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/default my-docs
    ```

    #### 启动开发服务器

    ```bash [Terminal]
    cd my-docs && pnpm dev
    ```
    ::::
  :::

  :::tabs-item{icon="i-lucide-code" label="代码"}
  ````mdc
  ::steps{level="4"}
  #### 创建项目

  ```bash [Terminal]
  npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/default my-docs
`````

#### 启动开发服务器

```bash [Terminal]
cd my-docs && pnpm dev
```

::

````text
:::
::

::tip
`steps` 中的标题不会出现在右侧目录里，也不参与二级标题编号，建议使用 `level="4"`。
::

## `Field` 与 `FieldGroup`

`field` 描述一个参数或属性，`name` 与 `type` 显示在标题行，`required` 标记必填。用 `field-group` 组合成列表：

::code-preview
:::field-group{.my-0}
  ::::field{name="componentDocs" type="boolean"}
  组件文档：ComponentProps、ComponentExample 等，默认 `false`。
  ::::

  ::::field{name="mcp" type="boolean"}
  内置 MCP Server，AI Chat 依赖此项，默认 `true`。
  ::::

  ::::field{name="ogImage" type="boolean"}
  构建期生成 OG 图片，默认 `true`。
  ::::

  ::::field{name="mermaid" type="boolean"}
  Mermaid 图表，需安装 `mermaid` 与 `dompurify`，默认 `false`。
  ::::
:::

#code
```mdc
::field-group
:::field{name="componentDocs" type="boolean"}
组件文档：ComponentProps、ComponentExample 等，默认 `false`。
:::

:::field{name="mcp" type="boolean"}
内置 MCP Server，AI Chat 依赖此项，默认 `true`。
:::
````

````text
::

## `Icon`

`icon` 渲染任意 [Iconify](https://icones.js.org/) 图标，名称格式为 `i-{集合}-{图标}`：

::code-preview
:icon{name="i-simple-icons-nuxtdotjs" class="size-6"} :icon{name="i-lucide-book-open" class="size-6"}

#code
```mdc
:icon{name="i-simple-icons-nuxtdotjs" class="size-6"} :icon{name="i-lucide-book-open" class="size-6"}
````

::

## `Kbd`

`kbd` 显示键盘按键，`meta` 在 macOS 上显示为 `⌘`，在其他系统上显示为 `Ctrl`：

```mdc
按 :kbd{value="meta"} :kbd{value="K"} 打开搜索。
```


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
