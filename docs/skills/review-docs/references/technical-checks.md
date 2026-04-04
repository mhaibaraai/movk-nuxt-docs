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
- 必须在页面中唯一

**description：**
- 类型：字符串
- 必填：是
- 建议长度：50-80 个中文字符（SEO 最优范围）
- 应简洁且描述性

**navigation.icon：**
- 格式：`i-{collection}-{icon-name}`（如 `i-lucide-house`、`i-simple-icons-github`）
- 必须以 `i-` 开头
- 优先使用 Lucide 图标集（`i-lucide-*`）保持一致性

**navigation.title：**
- 类型：字符串
- 可选：覆盖默认边栏标题
- 保持简短（1-3 字）

**seo.title：**
- 类型：字符串
- 最优：50-60 字符
- 可与页面标题不同以进行 SEO 优化

**seo.description：**
- 类型：字符串
- 最优：120-160 字符
- 如果需要，比主描述更详细

**links：**
- 类型：对象数组
- 每个对象必须包含：`label`、`to`
- 可选：`icon`、`target`（用于外部链接）

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
seo:
  title: AI 聊天功能 - Movk Nuxt Docs
  description: 了解如何在 Movk Nuxt Docs 中集成 AI 聊天功能，提供智能问答和交互体验。
links:
  - label: 配置参考
    icon: i-lucide-settings
    to: /docs/configuration
---
```

---

## MDC 组件验证

### 严格规则：u- 前缀

**所有 MDC 中的 Nuxt UI 组件必须使用 `u-` 前缀。**

这是最常见的错誤，導致構建失敗。

### 需要 u- 前缀的常见组件

| 组件 | 错误 | 正确 |
|-----------|-----------|---------|
| 页面英雄 | `::page-hero` | `::u-page-hero` |
| 页面部分 | `::page-section` | `::u-page-section` |
| 页面网格 | `::page-grid` | `::u-page-grid` |
| 页面卡片 | `::page-card` | `::u-page-card` |
| 页面功能 | `::page-feature` | `::u-page-feature` |
| 按钮 | `::button` 或 `:::button` | `:::u-button` |
| 徽章 | `::badge` | `::u-badge` |
| 颜色模式图像 | `:color-mode-image` | `:u-color-mode-image` |

### 组件嵌套级别

MDC 使用冒号指示嵌套深度：

```markdown
::u-page-hero           # 第 1 级：2 个冒号
  :::u-button           # 第 2 级：3 个冒号
    ::::div             # 第 3 级：4 个冒号（HTML 元素）
      :::::span         # 第 4 级：5 个冒号
```

**验证：** 确保嵌套级别一致且合逻辑。

### 组件属性

**内联属性**（使用大括号）：

```markdown
:::u-button{color="neutral" size="xl" to="/path" trailing-icon="i-lucide-arrow-right"}
按钮文本
:::
```

**块属性**（使用 --- 分隔符）：

```markdown
:::u-button
---
color: neutral
size: xl
to: /path
trailing-icon: i-lucide-arrow-right
---
按钮文本
:::
```

**常见属性错误：**

❌ 错误：`:::u-button(color="neutral")`
✅ 正确：`:::u-button{color="neutral"}`

❌ 错误：`:::u-button[size=xl]`
✅ 正确：`:::u-button{size="xl"}`

### 插槽语法

带有命名插槽的组件使用 `#slot-name`：

```markdown
::u-page-hero
#title
你的标题在这里

#description
你的描述文本

#links
  :::u-button{to="/start"}
  开始使用
  :::
::
```

**验证：** 确保插槽名称与组件文档匹配。

### 内容 vs Nuxt Content 组件

**Nuxt Content 组件**（无 u- 前缀）：
- `::code-group` - 多选项卡代码块
- `::steps` - 分步说明
- `::note`、`::tip`、`::warning`、`::caution` - 标注

**Nuxt UI 组件**（需要 u- 前缀）：
- `::u-page-*` - 页面布局组件
- `::u-button`、`::u-badge` - 交互元素
- `:u-color-mode-image` - 带主题变体的图像

### 代码块验证

#### 文件路径标签

**所有代码块都应包含文件名标签**，而不仅仅是配置文件。这适用于代表文件的每个代码示例：

✅ 好的：
````markdown
```vue [App.vue]
<script setup lang="ts">
import { ref } from 'vue'
</script>
```
````

````markdown
```typescript [parse.ts]
import { parse } from 'comark'
```
````

````markdown
```tsx [App.tsx]
export default function App() {}
```
````

❌ 缺少标签：
````markdown
```vue
<script setup lang="ts">
import { ref } from 'vue'
</script>
```
````

**标签命名约定：**
- Vue 组件：`[App.vue]`、`[components/Alert.vue]`、`[pages/index.vue]`
- TypeScript 文件：`[parse.ts]`、`[config.ts]`、`[server.ts]`
- React 组件：`[App.tsx]`、`[components/Card.tsx]`
- 配置文件：`[nuxt.config.ts]`、`[app.config.ts]`
- CSS 文件：`[styles.css]`、`[app/assets/css/main.css]`
- 终端命令：`[Terminal]`

**例外**（无标签需要）：
- 类型定义/接口
- MDC 语法示例（` ```mdc `）
- 不代表文件的内联片段

#### 代码语言一致性

代码示例应与项目的语言整合相匹配。检查项目的 `tsconfig.json`、`package.json` 或现有代码以确定默认语言。

**对于 TypeScript 项目**，所有代码示例都应使用 TypeScript。要标记的常见不匹配：
- Vue `<script setup>` 缺少 `lang="ts"` → 应该是 `<script setup lang="ts">`
- 当项目使用 `.ts` 时，示例中的 `.js` 文件扩展名
- 当项目使用严格 TypeScript 时，函数签名中缺少类型注解

#### 语言标签

始终为语法突出显示指定语言：

✅ 好的：` ```ts `、` ```bash `、` ```vue `
❌ 避免：` ``` `（无语言）

#### 代码组

为多变量示例使用 `::code-group`（包管理器、框架等）：

````markdown
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

**确保项目/生态系统支持的所有包管理器都代表存在。** 检查项目的 README、`package.json` 脚本或 lock 文件以确定要包括哪些。常见遗漏：忘记较新的包管理器（例如 bun）或误删除一个。

#### 代码组：不要分组什么

**不要在一个组中混合终端命令和配置文件** ——— 这些是单独的步骤：

❌ 坏（在一个组中混合安装 + 配置）：
````markdown
::code-group
```bash [Terminal]
npm install my-package
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['my-package']
})
```
::
````

✅ 好（单独块带过渡文本）：
````markdown
```bash [Terminal]
npm install my-package
```

将模块添加到你的 `nuxt.config.ts`：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['my-package']
})
```
````

**何时使用 `::code-group`：**
- 包管理器变体（pnpm/npm/yarn/bun）
- 框架变体（Vue/React）
- 代码 + 输出对（`[Code]` / `[Output]`）
- 语法 + AST 对（`[Syntax]` / `[AST]`）

#### 代码预览

使用 `::code-preview` 在源代码旁边显示呈现的输出。这对于记录视觉功能（如 markdown 语法、代码块元数据、组件呈现）非常理想：

````markdown
::code-preview
| 标题 1 | 标题 2 |
| -------- | -------- |
| 单元格 1 | 单元格 2 |

#code
```mdc
| 标题 1 | 标题 2 |
| -------- | -------- |
| 单元格 1 | 单元格 2 |
```
::
````

**何时使用 `::code-preview`：**
- Markdown 语法示例（标题、列表、表格、块引用、任务列表、表情符号）
- 代码块功能（文件名标签、行突出显示）
- 呈现结果增加清晰度的任何功能

**何时不使用 `::code-preview`：**
- API/TypeScript 代码示例（无视觉预览）
- 带有未注册自定义组件的组件示例

---

## 文件和目录命名

### 目录结构

文档部分应遵循编号模式：

```
content/
├── en/
│   ├── index.md
│   ├── 1.getting-started/
│   ├── 2.guide/
│   ├── 3.api/
│   └── 4.advanced/
```

**规则：**
- 目录以数字开头以进行排序：`1.`、`2.`、`3.`
- 目录名称使用 kebab-case
- 名称反映部分内容

### 文件命名

**模式：** `{number}.{name}.md`

示例：
- `1.introduction.md`
- `2.installation.md`
- `3.configuration.md`

**规则：**
- 以数字开头开始排序
- 使用 kebab-case（小写，带连字符）
- 描述性名称（不是 `page-1.md` 或 `doc.md`）

### 导航文件

**每个部分目录必须有 `.navigation.yml`：**

```yaml
# 1.getting-started/.navigation.yml
title: 开始使用
icon: i-lucide-rocket
```

**目的：** 控制边栏显示和部分元数据。

---

## 常见技术错误

### 1. 缺少 u- 前缀（最常见）

**错误模式：**
```markdown
::page-hero
#title
欢迎
::
```

**修复：**
```markdown
::u-page-hero
#title
欢迎
::
```

### 2. 不一致的嵌套

**错误模式：**
```markdown
::u-page-section
::::u-button  # 错误：跳过了嵌套级别
关闭
::::
::
```

**修复：**
```markdown
::u-page-section
  :::u-button
  关闭
  :::
::
```

### 3. 无效的组件名称

**错误模式：**
```markdown
::u-hero  # 组件不存在
```

**修复：**
```markdown
::u-page-hero  # 使用正确的组件名称
```

### 4. 代码块中缺少文件标签

**错误模式：**
````markdown
```typescript
export default defineNuxtConfig({})
```
````

**修复：**
````markdown
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```
````

### 5. 损坏的组件属性

**错误模式：**
```markdown
:::u-button color=neutral size=xl
```

**修复：**
```markdown
:::u-button{color="neutral" size="xl"}
```

---

## 组件文档专属组件

当文档站点用于记录 Vue 组件时，可使用以下组件：

```markdown
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

---

## 验证清单

对于每个页面，验证：

### Frontmatter
- [ ] `title` 和 `description` 字段存在
- [ ] `navigation.icon` 存在时现开始 `i-`
- [ ] `links` 数组具有正确的对象结构
- [ ] 无效的 YAML 语法
- [ ] 为不应出现在边栏但应作为路由存在的页面使用 `navigation: false`

### MDC 组件
- [ ] 所有 Nuxt UI 组件使用 `u-` 前缀
- [ ] 嵌套级别一致（::、:::、::::）
- [ ] 组件名称有效
- [ ] 属性使用正确的语法 `{key="value"}`
- [ ] 插槽名称与组件文档匹配
- [ ] 对视觉上可呈现的示例使用 `::code-preview`（markdown 语法、表格、列表等）

### 代码块
- [ ] 指定的语言标签（ts、js、vue、bash 等）
- [ ] 代表文件的所有代码块上的文件名标签（不仅仅是配置文件）
- [ ] 代码语言与项目的栈匹配（例如，`lang="ts"` 在 Vue `<script setup>` 对于 TypeScript 项目）
- [ ] 对多变量示例使用 `::code-group`（包管理器、框架等）
- [ ] 包管理器 `::code-group` 覆盖所有支持的包管理器（根据项目/生态系统检查）
- [ ] 仅组合等效替有品体——不要在 `::code-group` 中混合无关的步骤（例如，安装 + 配置）
- [ ] 呈现预览增加清晰度时使用 `::code-preview`

### 文件结构
- [ ] 目录遵循编号模式（`1.section/`）
- [ ] 文件遵循编号模式（`1.page.md`）
- [ ] `.navigation.yml` 存在于每个部分
- [ ] 文件和目录名称是 kebab-case
