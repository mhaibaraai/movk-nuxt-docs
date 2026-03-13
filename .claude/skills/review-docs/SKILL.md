---
name: review-docs
description: |
  审查 Movk Nuxt Docs 文档质量。检查 Front-Matter 完整性、MDC 组件语法、代码块规范、
  内容清晰度、SEO 和结构组织。提供分级（严重/重要/建议）的可操作报告。
  触发场景："审查文档"、"检查文档质量"、"检查 MDC 语法"、"检查 SEO"、
  "分析文档结构"、"文档 review"、"validate docs"。
---

# Review Docs

对 Movk Nuxt Docs 项目的文档进行全面审查，输出分级、可操作的问题报告。

## 工作流概览

1. **分析项目结构** - 定位内容目录，统计页面数量和章节
2. **技术验证** - Front-Matter、MDC 组件语法、代码块规范
3. **内容质量审查** - 清晰度、SEO、结构组织
4. **生成报告** - 分级问题列表，提供修复建议

### 优先级定义

- **严重**：阻止构建或导致渲染错误（Front-Matter 缺失、MDC 语法错误）
- **重要**：显著影响用户体验/SEO（描述过短、标题不描述性、缺少下一步链接）
- **建议**：锦上添花（添加提示框、改善示例、增加图片）

---

## 第 1 步：分析项目结构

### 定位内容目录

按顺序检查以下路径：
- `docs/content/docs/`（monorepo，最常见）
- `content/docs/`（独立项目）

### 统计页面

列出所有 `.md` 文件，按章节分组记录：

```
项目：[项目名]
内容目录：[路径]
章节：
  - 1.getting-started：[X] 个页面
  - 2.guide：[X] 个页面
  - 3.api：[X] 个页面（如有）
总计：[X] 个页面
```

---

## 第 2 步：技术验证

参考 [references/technical-checks.md](references/technical-checks.md) 执行完整验证。

### 检查项

1. **Front-Matter** - 必填字段、字段格式、导航图标格式
2. **MDC 组件** - 区分内容组件（无前缀）与落地页组件（`u-` 前缀）
3. **代码块** - 语言标识符、文件名标注、多包管理器使用 `::tabs`
4. **文件命名** - 数字前缀规则、kebab-case

---

## 第 3 步：内容质量审查

以下子步骤参考各专项文档：

### 清晰度

参考 [references/clarity-checks.md](references/clarity-checks.md)：
- 中文写作规范（标点、中英文间距、专有名词）
- 动作导向标题
- 代码示例质量

### SEO

参考 [references/seo-checks.md](references/seo-checks.md)：
- 标题和描述长度（中文适配标准）
- 标题描述性
- 内部链接质量

### 结构

参考 [references/structure-checks.md](references/structure-checks.md)：
- 目录层级建议
- 页面数量合理性
- 下一步链接覆盖
- 首页结构完整性

---

## 第 4 步：生成报告

使用 [assets/report-template.md](assets/report-template.md) 生成报告。

**报告要求：**
- 包含精确文件路径和行号
- 显示当前内容 vs 建议内容
- 解释每个问题的影响
- 按优先级排序

**报告后：**
- 询问用户是否需要自动修复
- 建议从严重问题开始处理

---

## 快速参考：常见问题

### 严重问题（立即修复）

| 问题 | 示例 |
|------|------|
| Front-Matter 缺少 `title` 或 `description` | `title` 字段不存在 |
| 落地页组件缺少 `u-` 前缀 | `::page-hero` → `::u-page-hero` |
| MDC 嵌套层级错误 | `::parent` 内直接用 `::::child` |
| 代码块无语言标识符 | ` ``` ` 没有语言名 |

### 重要问题（本周处理）

| 问题 | 说明 |
|------|------|
| `description` 过短 | 少于 50 个中文字符 |
| 标题不够描述性 | "配置" → "配置 AI 聊天功能" |
| 缺少文件名标注 | 代码块无 `[filename.ts]` |
| 多包管理器用了 `::code-group` | 应改为 `::tabs` |
| 指南页面无"下一步"链接 | 用户无路径继续阅读 |
| 中英文未加空格 | 「安装@movk/nuxt-docs」 |

### 建议优化（空闲时处理）

| 问题 | 说明 |
|------|------|
| 可视化内容未用 `::code-preview` | 表格、列表等有渲染效果的内容 |
| 缺少提示框 | 重要提示可用 `::note`/`::tip`/`::warning` |
| 图片未提供 alt 文本 | 影响可访问性和 SEO |

---

## 验证清单

### Front-Matter

- [ ] `title` 和 `description` 字段存在
- [ ] `navigation.icon` 格式为 `i-{collection}-{name}`
- [ ] `links` 数组结构正确（对象含 `label` 和 `to`）
- [ ] 首页有 `navigation: false`

### MDC 组件

- [ ] 内容组件无 `u-` 前缀（`::card`、`::tabs`、`::steps` 等）
- [ ] 落地页组件有 `u-` 前缀（`::u-page-hero`、`::u-page-section` 等，仅首页）
- [ ] 嵌套层级一致（`::` → `:::` → `::::` 递增）
- [ ] Props 使用正确语法 `{key="value"}` 或 YAML `---` 块

### 代码块

- [ ] 所有代码块有语言标识符
- [ ] 表示文件的代码块有文件名（如 ` ```ts [nuxt.config.ts] `）
- [ ] 多包管理器示例使用 `::tabs`
- [ ] 可视化内容使用 `::code-preview`

### 内容结构

- [ ] 指南页面有"下一步"链接
- [ ] 无孤立页面（所有页面可从导航到达）
- [ ] 每个章节有 2-15 个页面
- [ ] 标题层级从 `##` 开始
