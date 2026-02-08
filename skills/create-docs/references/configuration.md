# 配置参考

Movk Nuxt Docs 通过 `nuxt.config.ts` 和 `app/app.config.ts` 两个文件进行配置。

## nuxt.config.ts

### 最小配置

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
})
```

### 完整配置

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  // 自定义 CSS
  css: ['~/assets/css/main.css'],

  // 站点信息（用于 SEO）
  site: {
    name: 'My Docs',
  },

  // AI 聊天配置
  aiChat: {
    model: 'openai/gpt-5-nano',
    models: [
      'openai/gpt-5-nano',
      'deepseek/deepseek-v3.2',
    ],
  },

  // MCP Server 配置
  mcp: {
    name: 'My Docs',
  },

  // 组件元数据（用于自动生成组件文档）
  componentMeta: {
    include: [
      'Button',
      'Card*',
    ],
  },
})
```

### AI 聊天

| 选项 | 类型 | 描述 |
|------|------|------|
| `aiChat.model` | `string` | 默认模型 |
| `aiChat.models` | `string[]` | 可选模型列表 |

模型格式为 `provider/model-name`，例如 `openai/gpt-5-nano`、`deepseek/deepseek-v3.2`。

### 组件元数据

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  componentMeta: {
    // 支持字符串 glob、正则、函数
    include: [
      'Button',                // 精确匹配
      'Card*',                 // 通配符
      /^Modal/,                // 正则
    ],
    exclude: ['Internal*'],
  },
})
```

## app/app.config.ts

### 主题

```ts [app/app.config.ts]
export default defineAppConfig({
  theme: {
    radius: 0.25,           // 圆角大小（rem）
    blackAsPrimary: false,   // 是否使用黑色作为主色调
    icons: 'lucide',         // 图标集（lucide）
    font: 'Public Sans',     // 字体
  },
  ui: {
    colors: {
      primary: 'green',      // 主色调
      neutral: 'slate',      // 中性色
    },
  },
})
```

### Header 头部

```ts [app/app.config.ts]
export default defineAppConfig({
  header: {
    title: 'My Docs',           // 标题
    avatar: '/avatar.png',      // 头像
    to: '/',                     // 标题链接
    search: true,                // 搜索栏
    colorMode: true,             // 颜色模式切换
    links: [                     // 头部链接
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/my/repo',
        target: '_blank',
        label: 'GitHub',
      },
    ],
  },
})
```

### Footer 页脚

```ts [app/app.config.ts]
export default defineAppConfig({
  footer: {
    credits: `Copyright © 2024 - ${new Date().getFullYear()}`,
    socials: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/my/repo',
        target: '_blank',
        label: 'GitHub',
      },
    ],
  },
})
```

### TOC 目录

```ts [app/app.config.ts]
export default defineAppConfig({
  toc: {
    title: '本页内容',
    bottom: {
      title: '社区',
      links: [
        {
          icon: 'i-lucide-book-open',
          label: 'Nuxt UI 文档',
          to: 'https://ui.nuxt.com',
          target: '_blank',
        },
      ],
    },
  },
})
```

### SEO

```ts [app/app.config.ts]
export default defineAppConfig({
  seo: {
    titleTemplate: '',      // 标题模板，默认 '%s - ${site.name}'
    title: '',              // 默认标题
    description: '',        // 默认描述
  },
})
```

### GitHub 集成

```ts [app/app.config.ts]
export default defineAppConfig({
  github: {
    branch: 'main',
    rootDir: 'docs',         // 文档根目录（monorepo 场景）
    dateFormat: {
      locale: 'zh-CN',
      options: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    },
  },
})
```

禁用 GitHub 集成：`github: false`

### AI 聊天界面

```ts [app/app.config.ts]
export default defineAppConfig({
  aiChat: {
    floatingInput: true,       // 浮动输入框
    explainWithAi: true,       // AI 解释按钮
    shortcuts: {
      focusInput: 'meta_i',   // 快捷键
    },
    // FAQ 问题列表
    faqQuestions: [
      {
        category: '快速开始',
        items: ['如何安装？', '如何配置？'],
      },
    ],
    // 自定义界面文本
    texts: {
      title: 'AI 助手',
      placeholder: '输入你的问题...',
      trigger: '与 AI 聊天',
    },
    // 自定义图标
    icons: {
      trigger: 'i-lucide-sparkles',
    },
  },
})
```

### Vercel Analytics

```ts [app/app.config.ts]
export default defineAppConfig({
  vercelAnalytics: {
    enable: true,
    debug: false,
  },
})
```

## 路由规则

在 `nuxt.config.ts` 中配置重定向和预渲染规则：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
  },
})
```

## 内容集合

Movk Nuxt Docs 预定义了三种内容集合：

| 集合 | 路径 | 说明 |
|------|------|------|
| `docs` | `content/docs/` | 文档页面 |
| `landing` | `content/index.md` | 首页 |
| `releases` | `content/releases.yml` | 发布日志 |

`releases.yml` 或 `releases.md` 会被自动检测并创建 `/releases` 路由。

## 组件覆盖

在 `app/components/` 下创建同名文件即可覆盖 Layer 默认组件：

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Header | `components/header/Header.vue` | 完整头部 |
| HeaderLogo | `components/header/HeaderLogo.vue` | Logo 和标题 |
| HeaderCTA | `components/header/HeaderCTA.vue` | 头部右侧操作区 |
| Footer | `components/footer/Footer.vue` | 完整页脚 |
| DocsAsideLeftTop | `components/DocsAsideLeftTop.vue` | 左侧导航上方 |
| DocsAsideLeftBody | `components/DocsAsideLeftBody.vue` | 左侧导航主体 |
| DocsAsideRightBottom | `components/DocsAsideRightBottom.vue` | 右侧目录下方 |
| PageHeaderLinks | `components/PageHeaderLinks.vue` | 页面标题右侧操作 |
| ThemePicker | `components/theme-picker/ThemePicker.vue` | 主题选择器 |

## 环境变量

根据启用的功能配置环境变量：

```bash [.env]
# Used to fetch docs content
NUXT_GITHUB_TOKEN=
# Used to access AI Gateway services
AI_GATEWAY_API_KEY=
# Used to access OpenRouter services (alternative to AI Gateway)
OPENROUTER_API_KEY=
```
