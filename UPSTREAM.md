# 上游同步

Layer 源自 [nuxt/ui](https://github.com/nuxt/ui) 的 `docs/` 站点。本文件记录同步基准，每次同步后更新。

## 同步基准

| 项 | 值 |
|------|------|
| 上游分支 | `v4` |
| 上游提交 | [`9c4e33b7e`](https://github.com/nuxt/ui/commit/9c4e33b7e076aa6bd59b5bd99d8621d9dc1bcf60)（2026-10-08） |
| 本仓库提交 | `3923938`（PR #362，2026-10-09） |

## 同步流程

1. 在 nuxt/ui 仓库列出基准之后的候选提交：

   ```bash
   git fetch origin
   git log 9c4e33b7e..origin/v4 --oneline -- docs
   ```

2. 只移植 layer 有对应实现的改动，提交信息中注明上游 SHA，如 `（同步 nuxt/ui 52056f475）`。
3. 会改变消费方行为的项不同步，例如 `compatibilityVersion: 5`、`nuxt/server` 迁移、`icon.serverBundle.externalizeIconsJson`。
4. 更新上方「同步基准」表。

## Layer 覆盖的 Nuxt UI 组件

同步上游或升级 `@nuxt/ui` 时，需对照上游实现检查下列组件的 props 与模板：

| 组件 | 文件 | 上游来源 | 差异 |
|------|------|----------|------|
| `ProsePre` | `layer/app/components/content/ProsePre.global.vue` | `src/runtime/components/prose/Pre.vue` | 复制按钮改为「复制 / 已复制」文字反馈；`mermaid` 代码块分发到 `ProseMermaid` |
