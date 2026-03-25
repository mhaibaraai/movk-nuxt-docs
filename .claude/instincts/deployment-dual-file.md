---
id: movk-deployment-dual-file
trigger: "when modifying Dockerfile or deploy workflow"
confidence: 0.88
domain: deployment
source: local-repo-analysis
---

# 部署配置双文件原则

## Action

修改 `Dockerfile` 时，同步检查并更新 `.github/workflows/deploy.yml`，反之亦然。
两个文件描述同一部署流程的不同阶段，必须保持一致。

## Evidence

分析 200 个提交，`Dockerfile` 与 `.github/workflows/deploy.yml` 共同变更 10 次，
几乎每次部署变更都涉及两个文件。

## Why

Dockerfile 定义镜像构建逻辑，deploy.yml 定义 CI 触发和推送流程。
Docker BuildKit secrets、环境变量、构建参数等在两处都有引用，单独修改一处会导致部署失败。
