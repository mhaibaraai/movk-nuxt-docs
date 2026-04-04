# 技术验证指南

Movk Nuxt Docs 文档的技术规范检查，涵盖 Front-Matter、MDC 组件、代码块和文件命名。

## Front-Matter 验证

### 必填字段

每个文档页面必须包含：

```yaml
---
title: 页面标题
description: 页面描述，用于 SEO 和搜索结果。
---
```

### 可选字段

```yaml
---
title: 页面标题
description: 页面描述
navigation:
  title: 导航短标题（1-3 个词）
  icon: i-lucide-book
category: core-concepts
seo:
  title: SEO 优化标题（15-30 个中文字符）
  description: SEO 描述（50-80 个中文字符）
links:
  - label: 相关链接
    icon: i-lucide-arrow-right
    to: /docs/guide
    target: _blank  # 外部链接需要
---
```

### 字段验证规则

**title：**
- 类型：字符串
- 必填：是
- 建议长度：15 个字符以内（导航显示）

**description：**
- 类型：字符串
- 必填：是
- 建议长度：50-80 个中文字符（SEO 最优范围）

**navigation.icon：**
- 格式：`i-{collection}-{icon-name}`（如 `i-lucide-house`、`i-simple-icons-github`）
- 必须以 `i-` 开头
- 优先使用 Lucide 图标集（`i-lucide-*`）保持一致性

**links：**
- 类型：对象数组
- 每个对象必须包含：`label`、`to`
- 可选：`icon`、`target`

### 常见 Front-Matter 错误

❌ **缺少必填字段：**
```yaml
---
title: 我的页面
# 错误：缺少 description
---
```

❌ **图标格式错误：**
```yaml
---
navigation:
  icon: lucide-house  # 错误：缺少 i- 前缀
---
```

❌ **links 结构错误：**
```yaml
---
links:
  - "https://example.com"  # 错误：必须是对象
---
```

✅ **正确示例：**
```yaml
---
title: AI 聊天
description: 为您的文档站点添加内置 AI 聊天助手，支持多模型切换和自定义界面。
navigation:
  icon: i-lucide-bot
links:
  - label: 配置参考
    icon: i-lucide-settings
    to: /docs/configuration
---
```

---

## MDC 组件验证

### 关键区分：两类组件

Movk Nuxt Docs 有两类 MDC 组件，规则完全不同：

#### 内容组件（文档页面使用，无 `u-` 前缀）

| 组件 | 用途 |
|------|------|
| `::note`、`::tip`、`::warning`、`::caution` | 提示框 |
| `::callout{icon="..." color="..."}` | 自定义提示框 |
| `::accordion` + `:::accordion-item` | 折叠面板 |
| `::tabs` + `:::tabs-item` | 标签页（含多包管理器示例）|
| `::card`、`::card-group` | 卡片和卡片组 |
| `::steps{level="3"}` | 步骤列表 |
| `::badge` | 标签 |
| `::collapsible` | 折叠内容 |
| `::field`、`::field-group` | 字段说明 |
| `::code-group` | 多标签代码块 |
| `::code-preview` | 代码 + 渲染预览 |

#### 落地页组件（仅首页 `content/index.md` 使用，需 `u-` 前缀）

| 组件 | 用途 |
|------|------|
| `::u-page-hero` | 首页英雄区域 |
| `::u-page-section` | 内容区块 |
| `::u-page-grid` | 响应式网格 |
| `::u-page-feature` | 功能特性卡 |
| `::u-page-card` | 富内容卡片 |
| `::u-page-cta` | 行动号召区域 |
| `:::u-button` | 按钮（落地页内使用）|
| `:u-color-mode-image` | 深浅模式图片 |

> **常见错误：** 在文档页面使用了 `::u-page-hero` 等落地页组件，或在首页忘记了 `u-` 前缀。

### 嵌套层级规则

层级增加时冒号数量递增：

```mdc
::parent           <!-- 第 1 层：2 个冒号 -->
  :::child         <!-- 第 2 层：3 个冒号 -->
    ::::inner      <!-- 第 3 层：4 个冒号 -->
    ::::
  :::
::
```

❌ **层级跳跃（错误）：**
```mdc
::card-group
  ::::card   <!-- 错误：从 2 跳到 4 -->
  ::::
::
```

✅ **正确：**
```mdc
::card-group
  :::card
  :::
::
```

### Props 语法

**行内 Props（推荐用于简单属性）：**
```mdc
::callout{icon="i-lucide-info" color="blue"}
内容
::
```

**YAML Props（推荐用于复杂属性或多个属性）：**
```mdc
::card
---
icon: i-lucide-book
title: 标题
to: /docs/guide
target: _blank
---
内容
::
```

❌ **错误语法：**
```mdc
::card(icon="i-lucide-book")    <!-- 圆括号，错误 -->
::card[icon=book]               <!-- 方括号，错误 -->
```

### Slots 语法

```mdc
::component
默认插槽内容

#title
标题插槽内容

#description
描述插槽内容
::
```

---

## 代码块验证

### 语言标识符（必填）

所有代码块必须标注语言：

✅ 正确：` ```ts `、` ```bash `、` ```vue `、` ```mdc `
❌ 避免：` ``` `（无语言标识）

### 文件名标注

**表示文件的代码块必须标注文件名：**

✅ 正确：
````md
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs']
})
```

```vue [app/app.config.ts]
export default defineAppConfig({})
```

```bash [Terminal]
pnpm dev
```
````

❌ 缺少文件名：
````md
```typescript
export default defineNuxtConfig({})
```
````

**无需文件名的情况：**
- 类型定义/接口
- MDC 语法示例（` ```mdc `）
- 不代表具体文件的代码片段

### 多包管理器示例

**使用 `::tabs`（不使用 `::code-group`）：**

````mdc
::tabs
  :::tabs-item{label="pnpm" icon="i-simple-icons-pnpm"}
  ```bash [Terminal]
  pnpm add @movk/nuxt-docs
  ```
  :::

  :::tabs-item{label="npm" icon="i-simple-icons-npm"}
  ```bash [Terminal]
  npm install @movk/nuxt-docs
  ```
  :::

  :::tabs-item{label="yarn" icon="i-simple-icons-yarn"}
  ```bash [Terminal]
  yarn add @movk/nuxt-docs
  ```
  :::
::
````

### 代码预览

对可视化内容使用 `::code-preview`：

````mdc
::code-preview
| 标题 1 | 标题 2 |
| ------ | ------ |
| 单元格 | 单元格 |

#code
```mdc
| 标题 1 | 标题 2 |
| ------ | ------ |
| 单元格 | 单元格 |
```
::
````

**适用场景：**
- Markdown 语法示例（表格、列表、任务列表）
- 代码块功能展示（行高亮、文件名）
- 任何有渲染效果的内容

---

## 文件命名规则

### 目录和文件命名

**需要排序：** 使用数字前缀 `{number}.{name}`

```
1.getting-started/
├── 1.index.md
├── 2.installation.md
└── 3.configuration.md
```

**无需排序：** 直接命名

```
1.getting-started/
├── 1.index.md
└── troubleshooting.md   ← 无需排序，直接命名
```

**命名规则：**
- 使用 kebab-case（全小写 + 连字符）
- 描述性命名（不用 `page-1.md`、`doc.md`）
- 无需排序的文件不加数字前缀

### 常见命名错误

❌ `GettingStarted/`（大写）
❌ `getting_started/`（下划线）
❌ `page-1.md`（不描述性）
✅ `1.getting-started/`（有序）
✅ `troubleshooting.md`（无序，直接命名）

---

## 组件文档专属组件

当文档站点用于记录 Vue 组件时，可使用以下组件：

```mdc
<!-- 渲染组件示例（需在 app/components/content/examples/ 创建示例文件）-->
:component-example{name="MyButton"}

<!-- 自动生成 Props 表格 -->
:component-props{name="MyButton"}

<!-- 自动生成 Slots 表格 -->
:component-slots{name="MyButton"}

<!-- 自动生成 Emits 表格 -->
:component-emits{name="MyButton"}

<!-- 显示提交历史 -->
:commit-changelog{name="MyButton"}

<!-- 显示页面最后更新时间 -->
:page-last-commit
```

> 使用 `:component-props` 等组件前，需在 `nuxt.config.ts` 的 `componentMeta.include` 中配置目标组件。

---

## 验证清单

### Front-Matter
- [ ] `title` 和 `description` 字段存在
- [ ] `navigation.icon` 以 `i-` 开头（如存在）
- [ ] `links` 数组每项含 `label` 和 `to`
- [ ] 首页包含 `navigation: false`

### MDC 组件
- [ ] 内容组件无 `u-` 前缀
- [ ] 落地页组件（仅首页）有 `u-` 前缀
- [ ] 嵌套层级递增（`::` → `:::` → `::::`）
- [ ] Props 使用 `{key="value"}` 或 YAML 块语法

### 代码块
- [ ] 所有代码块有语言标识符
- [ ] 表示文件的代码块有文件名标注
- [ ] 多包管理器示例使用 `::tabs`
- [ ] 可视化内容使用 `::code-preview`

### 文件命名
- [ ] 需要排序的文件/目录使用数字前缀
- [ ] 无需排序的直接命名
- [ ] 使用 kebab-case
