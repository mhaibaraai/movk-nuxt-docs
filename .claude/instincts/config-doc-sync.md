---
id: movk-config-doc-sync
trigger: "when modifying layer/nuxt.config.ts"
confidence: 0.9
domain: workflow
source: local-repo-analysis
---

# Layer 配置变更必须同步文档

## Action

修改 `layer/nuxt.config.ts` 后，检查并更新 `skills/create-docs/references/configuration.md`。
若变更影响文档站行为，同步更新 `docs/nuxt.config.ts`。

## Evidence

分析 200 个提交，`layer/nuxt.config.ts` 与 `skills/create-docs/references/configuration.md`
共同变更 8 次，与 `docs/nuxt.config.ts` 共同变更 12 次。

## Why

技能文档是 AI 编写文档的参考依据。Layer 配置若新增或删除选项，而技能文档未同步，
AI 助手将基于过时的配置引导用户——这是项目中频繁出现的问题根源。
