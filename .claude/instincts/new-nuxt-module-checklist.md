---
id: movk-new-nuxt-module-checklist
trigger: "when adding a new Nuxt module to layer"
confidence: 0.92
domain: architecture
source: local-repo-analysis
---

# 新增 Nuxt 模块完整检查清单

## Action

在 `layer/modules/` 添加新模块时，必须完成以下所有步骤：

- [ ] `layer/modules/<name>/` — 创建模块目录
- [ ] `layer/nuxt.config.ts` — 在 modules 数组中注册
- [ ] `layer/package.json` — 添加相关依赖
- [ ] `layer/nuxt.schema.ts` — 定义 appConfig 配置字段和默认值
- [ ] `layer/app/app.config.ts` — 设置配置默认值
- [ ] `skills/create-docs/references/configuration.md` — 更新配置文档
- [ ] `docs/content/docs/` — 编写对应用户文档

## Evidence

`layer/nuxt.config.ts`、`layer/nuxt.schema.ts`、`layer/app/app.config.ts` 的历史变更
总是伴随出现，且经常同步更新 `skills/create-docs/references/configuration.md`。

## Why

`nuxt.schema.ts` 是 appConfig 字段的权威来源（类型 + 默认值），
`app.config.ts` 提供运行时默认值，两者必须保持一致。
技能文档是 AI 助手的参考依据，不同步会导致配置建议过时。
