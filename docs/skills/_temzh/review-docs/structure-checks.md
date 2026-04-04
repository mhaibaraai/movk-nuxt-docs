# 结构和组织指南

评估文档结构、组织和导航模式的指南。

## 内容层级

### 推荐的目录结构

```
content/
├── {locale}/
│   ├── index.md                      # 登陆页（必需）
│   ├── 1.getting-started/
│   │   ├── .navigation.yml
│   │   ├── 1.introduction.md
│   │   ├── 2.installation.md
│   │   └── 3.quick-start.md
│   ├── 2.guide/                      # 或 2.concepts/
│   │   ├── .navigation.yml
│   │   ├── 1.configuration.md
│   │   ├── 2.authentication.md
│   │   └── 3.deployment.md
│   ├── 3.api/                        # 如适用
│   │   ├── .navigation.yml
│   │   └── 1.reference.md
│   └── 4.advanced/                   # 可选
│       ├── .navigation.yml
│       └── 1.customization.md
```

### 深度指南

**推荐：** 最多 3 级嵌套
- 第 1 级：主要部分（`1.getting-started/`）
- 第 2 级：部分中的页面（`1.introduction.md`）
- 第 3 级：标题中的小节（页面内的 H2、H3）

**避免：** 深文件夹嵌套（4+ 级）- 改用 H2/H3 标题。

## 部分组织

### 标准部分类型

**1. 开始使用**（始终首先）
- 介绍（什么和为什么）
- 安装（前提条件、命令）
- 快速开始/第一步
- 项目结构（如适用）

**2. 指南/概念**（核心文档）
- 功能文档
- 配置指南
- 集成教程
- 最佳实践

**3. API/参考**（如适用）
- 组件参考
- 可组合项参考
- 函数参考
- 配置选项

**4. 高级/食谱**（可选）
- 高级模式
- 自定义指南
- 故障排除
- 迁移指南

### 每部分的页数

**指南：**
- **最小：** 2 页每部分（1 页 = 应该并入另一部分）
- **最优：** 3-8 页每部分
- **最大：** 15 页（超过此，考虑分割成小节）

**红旗：**
- 仅 1 页的部分
- 20+ 页的部分（太宽，难以导航）

## 导航文件

### .navigation.yml 结构

每个部分目录应该有 `.navigation.yml`：

```yaml
title: 开始使用
icon: i-lucide-rocket
```

**必需字段：**
- `title`：部分在边栏中的显示名称
- `icon`：Lucide 图标（格式：`i-lucide-{name}`）

### 按部分推荐的图标

| 部分 | 推荐图标 |
|---------|----------------|
| 开始使用 | `i-lucide-rocket`、`i-lucide-play` |
| 指南/概念 | `i-lucide-book-open`、`i-lucide-layers` |
| API/参考 | `i-lucide-code`、`i-lucide-book` |
| 高级 | `i-lucide-settings`、`i-lucide-wrench` |
| 部署 | `i-lucide-cloud`、`i-lucide-upload` |
| 故障排除 | `i-lucide-alert-circle`、`i-lucide-help-circle` |

## 内容流

### 逻辑进展

文档应遵循学习路径：

1. **方向** - 这是什么？为什么使用它？
2. **设置** - 我如何安装它？
3. **基础** - 我如何使用核心功能？
4. **高级** - 我如何自定义或扩展？
5. **参考** - 我在哪里可以找到详细的 API 信息？

### 页面结构

每个页面应遵循此模式：

```markdown
---
frontmatter here
---

# H1 页面标题（匹配 frontmatter 标题）

简短介绍（1-2 句话描述此页面涉及的内容）

## 第一个主要主题（H2）

解释该主题的内容（200-400 字）

### 子主题（H3）

详细信息

## 第二个主要主题（H2）

更多内容

## 后续步骤

- 相关页面链接
- 建议的阅读顺序
```

### 后续步骤/相关内容

**每个指南页面应包括：**
- 相关文档链接
- 建议的下一页
- 前提条件或依赖项

**示例：**

```markdown
## 后续步骤

- [配置你的主题](/guide/configuration)
- [添加自定义组件](/guide/customization)
- [部署到生产](/guide/deployment)

## 相关

- [API 参考](/api/reference) - 详细的 API 文档
- [示例](/examples) - 真实世界的使用示例
```

## 交叉引用

### 内部链接

**从内容根使用相对链接：**

✅ 好的：
```markdown
了解更多关于 [身份验证](/guide/authentication)。
```

❌ 避免：
```markdown
了解更多关于 [身份验证](../guide/authentication.md)。
```

### 链接模式

**内联链接** 用于上下文引用：
```markdown
通过设置 [环境变量](/guide/configuration#environment-variables) 来配置你的应用。
```

**标注链接** 用于重要相关内容：
```markdown
::note
此功能需要身份验证。见 [身份验证指南](/guide/authentication) 了解设置说明。
::
```

**Frontmatter 链接** 用于主要相关页面：
```yaml
---
links:
  - label: API 参考
    to: /api/reference
    icon: i-lucide-book
---
```

## 一致性检查

### 跨页面

- [ ] 一致的标题风格（指南部分中基于动作的）
- [ ] 相似的页面结构（介绍 → 内容 → 后续步骤）
- [ ] 一致的代码示例格式
- [ ] 一致的术语用法

### 跨部分

- [ ] 所有部分都有 `.navigation.yml`
- [ ] 编号目录用于一致的排序
- [ ] 相似的深度级别（避免一个部分中 2 级，另一个中 5 级）
- [ ] 一致的图标样式（所有 Lucide，无混合）

## 常见结构问题

### 孤立页面
- 没有传入链接的页面
- 从登陆页面没有路径到此页面
- 不包括在导航中

**修复：** 从父/相关页面添加链接

### 冗余内容
- 多个页面涵盖同一主题
- 跨部分的重复信息
- 没有清晰区分的重叠内容

**修复：** 合并或清楚地区分目的

### 缺少登陆页面
- 没有 index.md 的部分
- 直接跳转到编号页面（导致部分根 URL 上的 404）

**修复：** 添加 `index.md` 包含部分概览。如果页面不应出现在边栏导航中，在 frontmatter 中使用 `navigation: false`：

```yaml
---
title: 部分名称
description: 此部分的概览
navigation: false
---
```

此模式适用于作为入口点（例如通过重定向或直接 URL）但不应在边栏中招摇的部分登陆页面。

### 不一致的编号
- 编号中的间隙（1、2、4、5——3 在哪里？）
- 重重号（1.intro.md、1.install.md 在同一目录中）

**修复：** 一致地重新编号文件

### 差劲的信息架构
- 指南内容在开始使用部分
- 基础设置在高级部分
- API 参考与教程混合

**修复：** 重新组织到适当的部分

## 登陆页面结构

主登陆页（`index.md`）应包括：

1. **英雄部分** - 项目名称、标语、CTA
2. **关键功能** - 3-6 个主要功能带图标
3. **快速开始** - 最小示例或安装命令
4. **部分链接** - 开始使用、指南、API
5. **可选：** 展示、推荐、赞助商

**示例结构：**

```markdown
---
title: 项目名称
description: 项目标语
---

::u-page-hero
# 英雄内容
::

::u-page-section
# 功能
  :::u-page-grid
  # 功能卡片
  :::
::

::u-page-section
# 快速开始
# 最小代码示例
::
```

## 验证清单

- [ ] 登陆页（index.md）存在于每个语言地区的根目录
- [ ] 所有部分都有 `.navigation.yml` 带标题和图标
- [ ] 编号目录遵循一致的模式（1.、2.、3.）
- [ ] 部分中的页面编号一致
- [ ] 最多 3 级层级（文件夹 + 标题）
- [ ] 每部分有 2-15 页（不是 1，也不是 20+）
- [ ] 页面包括"后续步骤"或相关链接
- [ ] 没有孤立页面（所有可从导航访问）
- [ ] 逻辑进展（开始使用 → 指南 → API → 高级）
- [ ] 一致的标题深度（没有孤独的 H4 而没有 H3）
