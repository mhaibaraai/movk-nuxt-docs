# Movk Nuxt Docs 模板

> 使用 Movk Nuxt Docs 快速创建文档网站的起始模板

这是一个预配置的项目模板，包含了创建文档网站所需的所有基础结构和示例内容。

## 🚀 快速开始

### 使用此模板创建项目

```bash
# 使用此模板创建新项目
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/template my-docs
# 进入项目目录
cd my-docs
# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 查看你的文档网站。

## 📁 项目结构

```bash
my-docs/
├── content/             # Markdown 内容
│   ├── index.md         # 首页
│   └── docs/            # 文档页面
├── public/              # 静态资源
├── nuxt.config.ts       # Nuxt 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 依赖与脚本
```

## 📝 开始编写

### 1. 修改首页

编辑 `content/index.md` 来自定义你的首页：

```md
---
seo:
  title: 你的文档标题
  description: 你的文档描述
---

::u-page-hero
#title
你的[标题]{.text-primary}

#description
你的文档描述

#links
  :::u-button
  ---
  to: /docs/getting-started
  ---
  开始使用
  :::
::
```

### 2. 添加文档页面

在 `content/docs/` 目录下创建新的 Markdown 文件：

```md
---
title: 页面标题
description: 页面描述
---

# 页面标题

你的内容...
```

### 3. 组织导航

使用数字前缀来控制导航顺序：

```bash
content/docs/
├── 1.getting-started/
│   ├── 1.introduction.md    # 第一章第一节
│   └── 2.installation.md    # 第一章第二节
├── 2.guide/
│   ├── 1.basic.md
│   └── 2.advanced.md
└── 3.api/
    └── 1.reference.md
```

### 4. 添加静态资源

将图片、图标等静态文件放入 `public/` 目录：

```bash
public/
├── logo.svg
├── social-card.png
└── images/
    └── example.png
```

在 Markdown 中引用：

```md
![示例图片](/images/example.png)
```

## ⚙️ 配置

### 基础配置

编辑 `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  
  // 你的自定义配置
  site: {
    url: 'https://your-domain.com',
    name: '你的文档标题'
  }
})
```

### 应用配置

创建 `app.config.ts` 来自定义主题：

```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',    // 主色调
      neutral: 'slate'    // 中性色
    }
  }
})
```

## 🎨 自定义

### 添加自定义组件

创建 `app/components/` 目录来添加自定义组件：

```
app/
└── components/
    └── MyCustomComponent.vue
```

在 Markdown 中使用：

```md
::my-custom-component
内容
::
```

### 自定义样式

创建 `app/assets/css/main.css`:

```css
@import 'tailwindcss';

/* 你的自定义样式 */
.my-custom-class {
  color: theme('colors.primary.500');
}
```

在 `nuxt.config.ts` 中引入：

```ts
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  
  css: ['~/app/assets/css/main.css']
})
```

## 🔧 脚本命令

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm build            # 构建生产版本
pnpm preview          # 预览生产构建

# 其他
pnpm typecheck        # 类型检查
pnpm lint             # 代码检查
```

## 📦 构建和部署

### 构建生产版本

```bash
pnpm build
```

生成的静态文件将位于 `.output/public` 目录。

### 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 Nuxt 项目并部署

### 部署到 Netlify

1. 将项目推送到 GitHub
2. 在 [Netlify](https://netlify.com) 导入项目
3. 设置构建命令: `pnpm build`
4. 设置发布目录: `.output/public`

### 部署到其他平台

查看 [Nuxt 部署文档](https://nuxt.com/docs/getting-started/deployment) 了解更多部署选项。

## 📖 文档和资源

- [Movk Nuxt Docs 文档](https://docs.mhaibaraai.cn)
- [Nuxt 文档](https://nuxt.com)
- [Nuxt Content 文档](https://content.nuxt.com)
- [Nuxt UI 文档](https://ui.nuxt.com)

## 🆘 获取帮助

- [GitHub Issues](https://github.com/mhaibaraai/movk-nuxt-docs/issues) - 报告问题或建议
- [GitHub Discussions](https://github.com/mhaibaraai/movk-nuxt-docs/discussions) - 提问和讨论

## 📄 许可证

[MIT](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/LICENSE) License © 2024-PRESENT [YiXuan](https://github.com/mhaibaraai)
