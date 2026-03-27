---
id: movk-dependency-cascade
trigger: "when updating package.json dependencies"
confidence: 0.85
domain: package-management
source: local-repo-analysis
---

# 依赖升级必须在所有层级级联同步

## Action

升级任何依赖时，按照以下顺序同步更新所有 package.json：
1. `layer/package.json`
2. `package.json`（根目录）
3. `templates/default/package.json`
4. `templates/module/package.json`

然后运行 `pnpm install` 更新 `pnpm-lock.yaml`。

## Evidence

分析 200 个提交，`layer/package.json` 与根 `package.json` 共同变更 22 次，
与 `templates/default/package.json` 共同变更 9 次。

## Why

这是 pnpm monorepo 项目，templates 是独立的用户项目起点。
若模板中的依赖版本落后于 layer，用户从模板创建的项目会出现版本不兼容问题。
