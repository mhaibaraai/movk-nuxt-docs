# 国际化（i18n）指南

Docus 中多语言文档一致性审查指南。

**注意：** 这些检查仅在检测到多语言支持时适用（多个语言地区目录：`en/`、`fr/` 等）

## 语言地区检测

检查 `content/` 中的多个语言目录：

```
content/
├── en/          # 英语
├── fr/          # 法语
└── es/          # 西班牙语（如适用）
```

如果只存在一个语言目录，请跳过 i18n 检查。

## 并行结构

### 目录奇偶

所有语言地区应该有相同的目录结构：

✅ 正确：
```
content/
├── en/
│   ├── 1.getting-started/
│   ├── 2.guide/
│   └── 3.api/
└── fr/
    ├── 1.getting-started/
    ├── 2.guide/
    └── 3.api/
```

❌ 不一致：
```
content/
├── en/
│   ├── 1.getting-started/
│   ├── 2.guide/
│   ├── 3.api/
│   └── 4.advanced/        # 仅英文
└── fr/
    ├── 1.getting-started/
    └── 2.guide/            # 缺少部分
```

### 文件奇偶

每个语言地区应该有匹配的文件：

✅ 正确：
```
en/1.getting-started/
├── 1.introduction.md
├── 2.installation.md
└── 3.quick-start.md

fr/1.getting-started/
├── 1.introduction.md
├── 2.installation.md
└── 3.quick-start.md
```

❌ 缺少翻译：
```
en/1.getting-started/
├── 1.introduction.md
├── 2.installation.md
└── 3.quick-start.md

fr/1.getting-started/
├── 1.introduction.md
└── 2.installation.md     # 缺少快速开始
```

## 翻译完整性

### 内容长度比较

**预期：** 翻译中的相似内容长度（±30%）

**红旗：**
- 英文页面：1000 词、法文页面：200 词（可能不完整）
- 英文页面有 5 个 H2 部分、法文有 2 个（缺少内容）

### 结构完整性

检查翻译包含：
- 相同数量的主要标题（H2）
- 相同的部分和小节
- 相同的代码示例
- 相同的标注（::note、::tip 等）
- 相同的组件使用（::u-page-hero 等）

### 视觉内容

- [ ] 所有语言版本中都存在图像
- [ ] 如果屏幕截图包含文本，则本地化
- [ ] 如果图表包含标签，则翻译
- [ ] 颜色模式图像（浅色/深色）对所有语言地区都可用

## 导航一致性

### .navigation.yml 文件

每个部分应该在所有语言地区中都有 `.navigation.yml`：

```yaml
# en/1.getting-started/.navigation.yml
title: Getting Started
icon: i-lucide-rocket

# fr/1.getting-started/.navigation.yml
title: Premiers Pas
icon: i-lucide-rocket    # 语言地区中使用相同的图标
```

**验证：**
- [ ] 跨语言地区使用相同的图标
- [ ] 适当翻译的标题
- [ ] 所有语言地区中的所有部分都有导航文件

## 语言地区特定问题

### 语言特定检查

**英语：**
- 主动语态
- 现在时
- 第二人称

**法语：**
- 正确的正式/非正式语气（tu vs vous）
- 正确的重音（é、è、à 等）
- 协议（性别/数字）

**其他语言：**
- 适当的形式水平
- 正确的语法和语法
- 文化适当性

### 代码示例

**跨语言地区保持一致：**
- 变量名（通常是英文）
- 函数名
- 技术术语
- 包名

**翻译：**
- 代码块中的注释
- 字符串值（如适用）
- 控制台输出消息

**示例：**

英语：
````markdown
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // Configure your app
  app: {
    name: 'My App'
  }
})
```
````

法语：
````markdown
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // Configurez votre application
  app: {
    name: 'Mon Application'
  }
})
```
````

## 常见 i18n 问题

### 部分翻译

**问题：** 文档在一种语言中启动，部分翻译成其他。

**检测：**
- 某些语言地区中缺少文件
- 不完整的页面内容（比原始版本短很多）
- 否则已翻译页面中的未翻译部分

**修复：** 要么完成翻译，要么清楚地标记不完整的部分。

### 不一致的术语

**问题：** 相同的技术术语在页面之间以不同的方式翻译。

**示例：**
- Page 1："authentication"→"authentification"
- Page 2："authentication"→"connexion"
- Page 3："authentication"→"identification"

**修复：** 选择一个翻译并一致地使用。创建术语表。

### 混合语言

**问题：** 非英文语言地区中出现英文文本（除代码/技术术语外）。

**常见示例：**
- 法文页面中的英文标题
- 未翻译的导航标签
- 英文错误消息
- 同一段落中的混合语言

**修复：** 翻译所有用户界面面的文本，除了代码、包名和公认的技术术语。

### URL 不匹配

**问题：** 内部链接没有为语言地区更新。

❌ 错误（在法文文档中）：
```markdown
见 [安装指南](/en/getting-started/installation)
```

✅ 正确：
```markdown
见 [安装指南](/fr/getting-started/installation)
```

### 缺少语言地区配置

检查 `nuxt.config.ts` 或 `app.config.ts` 是否包含 i18n 配置：

```ts
// nuxt.config.ts 或 app/app.config.ts
i18n: {
  defaultLocale: 'en',
  locales: [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ]
}
```

## 验证清单

如果检测到多语言：

- [ ] 所有语言地区都有相同的目录结构
- [ ] 所有语言地区都有匹配的文件结构（每个部分的相同页数）
- [ ] 所有 `.navigation.yml` 文件都以相同图标存在于所有语言地区
- [ ] 翻译中的内容长度相似（±30%）
- [ ] 非英文页面中没有英文文本（除了代码/技术术语）
- [ ] 内部链接指向正确的语言地区
- [ ] 代码注释适当翻译
- [ ] 每个语言地区中的术语一致
- [ ] 现存于 Nuxt 配置中的语言地区配置
- [ ] 所有语言地区都存在登陆页面
