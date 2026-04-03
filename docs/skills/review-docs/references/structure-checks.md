# 结构审查指南

评估 Movk Nuxt Docs 文档的目录组织、信息架构和内容流。

## 推荐目录结构

```
content/docs/
├── 1.getting-started/         # 必须第一个
│   ├── 1.index.md             # 章节入口（或 1.introduction.md）
│   ├── 2.installation.md
│   └── 3.configuration.md
├── 2.guide/                   # 核心功能文档
│   ├── 1.feature-a.md
│   └── 2.feature-b.md
├── 3.api/                     # 可选：API 参考
│   └── 1.reference.md
└── 4.advanced/                # 可选：高级用法
    └── 1.customization.md
```

**层级规则：**
- 最多 3 层（目录 → 页面 → 页面内标题）
- 不使用 4 层及以上的目录嵌套，改用页面内 H2/H3

## 章节类型

**1. 快速开始**（始终第一章节）
- 简介（是什么、为什么使用）
- 安装（前提条件、安装命令）
- 快速开始/基础配置

**2. 指南**（核心文档）
- 功能说明
- 配置选项
- 集成教程
- 最佳实践

**3. API 参考**（如适用）
- 组件 Props/Slots/Emits
- Composable 参考
- 配置选项完整列表

**4. 高级用法**（可选）
- 自定义和覆盖
- 迁移指南
- 故障排除

## 页面数量

| 状态 | 页面数 | 处理建议 |
|------|--------|----------|
| 过少 | 1 页 | 合并到相邻章节 |
| 正常 | 2-8 页 | 无需调整 |
| 较多 | 9-15 页 | 考虑拆分子章节 |
| 过多 | 16+ 页 | 必须拆分，影响导航 |

## 内容流

### 学习路径顺序

文档应遵循从入门到深入的路径：

1. **定向**（什么是？为什么用？）
2. **安装**（怎么安装？）
3. **基础**（基本功能怎么用？）
4. **配置**（如何定制？）
5. **高级**（如何扩展？）
6. **参考**（完整 API 在哪？）

### 每页结构

```
Front-Matter (title + description)
  ↓
简短介绍（1-2 句话）
  ↓
主要内容（H2 章节）
```

## 下一步链接

### 检查标准

每个**指南页面**应包含"下一步"区域：

✅ 使用 `::card-group`（内嵌在页面内容末尾）：
```mdc
## 下一步

::card-group
  :::card{icon="i-lucide-settings" title="配置" to="/docs/configuration"}
  自定义站点设置。
  :::

  :::card{icon="i-lucide-palette" title="自定义主题" to="/docs/customization"}
  调整颜色和字体。
  :::
::
```

✅ 使用 Front-Matter `links`（显示在右侧边栏）：
```yaml
---
links:
  - label: 配置参考
    icon: i-lucide-settings
    to: /docs/configuration
---
```

**无需下一步链接的页面：**
- API 参考页（用户自行查阅，无特定路径）
- 快速开始的最后一页（已完成入门流程）

## 首页结构

`content/index.md` 应包含以下区域（使用落地页组件）：

1. **Hero 区域**（必须）：标题、描述、CTA 按钮
2. **功能特性**（推荐）：3-6 个核心功能图标+描述
3. **快速开始**（推荐）：最小化安装命令或示例

```mdc
::u-page-hero
#title
项目名称

#description
一句话描述

#links
  :::u-button{to="/docs/getting-started"}
  快速开始
  :::
::

::u-page-section
  :::u-page-grid
    ::::u-page-feature{icon="i-lucide-zap" title="功能 1"}
    描述
    ::::
  :::
::
```

## 常见结构问题

### 章节入口缺失（导致 404）

当用户访问 `/docs/getting-started` 时，如果没有 `1.index.md`，会返回 404。

**修复：** 创建 `1.index.md` 作为章节入口，包含章节概述和到各页面的链接。

### 内容放错章节

| 错误 | 正确 |
|------|------|
| 快速开始中放了完整的 API 参考 | 快速开始只放入门流程，API 放在独立章节 |
| 高级功能放在快速开始里 | 高级功能放在 guide/ 或 advanced/ |
| 故障排除放在 getting-started/ | 故障排除放在 guide/ 或 advanced/ |

### 章节数量不平衡

❌ 一个章节 1 页，另一个 20 页 → 考虑合并或拆分
✅ 各章节 2-8 页，平衡分布

---

## 验证清单

### 目录结构
- [ ] 最多 3 层嵌套
- [ ] 需要排序的章节使用数字前缀
- [ ] 每个章节有入口页面（`1.index.md` 或类似文件）

### 页面数量
- [ ] 每个章节 2-15 页
- [ ] 没有单页章节（1 页章节应合并）

### 内容流
- [ ] 快速开始是第一章节
- [ ] 指南页面有"下一步"链接
- [ ] 无孤立页面（所有页面可达）
- [ ] 页面内容按复杂度递增排列

### 首页
- [ ] 包含 Hero 区域（`::u-page-hero`）
- [ ] 包含功能介绍区域
- [ ] CTA 按钮指向快速开始
- [ ] `navigation: false` 在 Front-Matter 中
