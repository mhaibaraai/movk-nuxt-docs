---
id: movk-commit-message-format
trigger: "when writing a git commit message"
confidence: 0.95
domain: git
source: local-repo-analysis
---

# 约定式提交：英文类型前缀 + 中文描述

## Action

提交消息格式：`<type>: <中文描述>`

允许的类型：`feat`、`fix`、`refactor`、`chore`、`docs`、`perf`、`ci`、`test`

特殊格式：
- 依赖更新：`chore(deps): update <包名>`
- 发布：`chore(release): v<版本号>`
- 特定范围：`fix(aiChat): <描述>`

## Evidence

分析 200 个提交，100% 遵循约定式提交格式，
描述部分全部使用中文（除 Renovate 自动提交外）。

## Why

这是项目的明确约定：技术规范用国际标准（英文类型），
业务描述用中文（团队主要语言），两者组合保证可读性和规范性。
