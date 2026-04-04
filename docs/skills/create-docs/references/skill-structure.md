# Skill 项目结构

本文档说明 Movk Nuxt Docs 中 Agent Skills 的标准目录结构、字段规范与发布行为。

## 目录布局

```text
skills/{skill-name}/
├── SKILL.md
├── references/
│   ├── guide.md
│   └── examples.md
└── assets/
    └── template.md
```

说明：

- `SKILL.md` 为必需文件
- `references/`、`assets/` 为可选目录
- 所有非隐藏文件都可通过发现端点访问

## SKILL.md front-matter

`SKILL.md` 顶部必须使用 YAML front-matter：

```yaml
---
name: create-docs
description: 使用 Movk Nuxt Docs 创建和编写文档站点。
---
```

### 必需字段

| 字段 | 类型 | 规则 |
|------|------|------|
| `name` | `string` | 必须与目录名一致，kebab-case，长度 ≤ 64 |
| `description` | `string` | 必填，用于 `index.json` 展示 |

### 命名规则

- 仅允许：`a-z`、`0-9`、`-`
- 不允许连续连字符 `--`
- 首尾不能是 `-`

## 自动发现与发布

站点构建时会自动：

1. 扫描 `skills/*/SKILL.md`
2. 解析 front-matter
3. 递归收集 skill 目录文件
4. 发布到：
   - `/.well-known/skills/index.json`
   - `/.well-known/skills/{skill-name}/{file-path}`

并默认设置：

- `Cache-Control: public, max-age=3600`

## 贡献检查清单

- [ ] `SKILL.md` 存在且 front-matter 完整
- [ ] `name` 与目录名一致
- [ ] `description` 为清晰的一句话描述
- [ ] 引用路径与目录结构一致
- [ ] `/.well-known/skills/index.json` 可看到该 skill
