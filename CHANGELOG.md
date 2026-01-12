# 📋 Changelog

## [1.7.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.7.0...v1.7.1) (2026-01-12)

### ♻️ Code Refactoring

* 将 StarsBg 组件移动到 layer 目录 ([b22cbb3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b22cbb3ca5b71ba3b18751167054bcf5db8a49be))

## [1.7.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.6.2...v1.7.0) (2026-01-12)

### ⚠ BREAKING CHANGES

* **ai-chat:** 将配置从 runtimeConfig 迁移到 appConfig。原 `runtimeConfig.public.aiChat.enable` 改为通过环境变量自动判断,FAQ 配置从 `useFaq` composable 迁移到 `app.config.ts` 的 `aiChat.faqQuestions`。详见迁移指南:[删除项目中的 composables/useFaq.ts,在 app.config.ts 中添加 aiChat.faqQuestions 配置] ([4f73657](https://github.com/mhaibaraai/movk-nuxt-docs/commit/4f73657))

### ✨ Features

* 添加无障碍支持并改进语义化标签 ([90b8f44](https://github.com/mhaibaraai/movk-nuxt-docs/commit/90b8f44))
* 改进 AI Chat 配置和文档体验 ([83942ea](https://github.com/mhaibaraai/movk-nuxt-docs/commit/83942ea))

### 🐛 Bug Fixes

* **ai-chat:** 优化侧边栏面板标题显示和加载状态位置 ([3d90163](https://github.com/mhaibaraai/movk-nuxt-docs/commit/3d90163))

### ♻️ Code Refactoring

* **ai-chat:** 重构组件架构为侧边栏面板模式 ([0ddd574](https://github.com/mhaibaraai/movk-nuxt-docs/commit/0ddd574))
* **ai-chat:** 精简 FAQ 配置 ([851ae12](https://github.com/mhaibaraai/movk-nuxt-docs/commit/851ae12))
* **config:** 移除不可用的 AI 模型 ([a1eab47](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a1eab47))
* **config:** 移除冗余配置项 ([7010803](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7010803))
* 将路由配置迁移到 routing 模块并统一内容集合 ([dbb25a5](https://github.com/mhaibaraai/movk-nuxt-docs/commit/dbb25a5))

### 💄 Styles

* **ai-chat:** 统一文本样式类名 ([244fbdd](https://github.com/mhaibaraai/movk-nuxt-docs/commit/244fbdd))
* 修复 nuxt.config.ts 代码格式 ([b2f56b3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b2f56b3))

### 🔧 Chores

* **deps:** lock file maintenance ([1791020](https://github.com/mhaibaraai/movk-nuxt-docs/commit/1791020), [b259f0d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b259f0d))
* **deps:** update all non-major dependencies ([f80c398](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f80c398), [041b567](https://github.com/mhaibaraai/movk-nuxt-docs/commit/041b567))

## [1.6.2](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.6.1...v1.6.2) (2026-01-09)

### ✨ Features

* **ai-chat:** 支持自定义 handler 覆盖 ([e932af2](https://github.com/mhaibaraai/movk-nuxt-docs/commit/e932af2c6c508e45053f8222bd81c300a822d383))
* **ai-chat:** 重命名 API 处理器文件以提高语义清晰度 ([280218f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/280218f6f2ec22ac26d38cde44b53aa03d3ca9be))

## [1.6.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.6.0...v1.6.1) (2026-01-09)

### 🐛 Bug Fixes

* **app:** 修正 LLMs 链接图标类名格式 ([ac2f6da](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ac2f6dadc86be20c773623bc9e464dc6ea882b5d))

### 📝 Documentation

* **composables:** 补充 useToolCall 使用文档 ([fb9d8f7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/fb9d8f724f58b7a204c0813f368cf14d89971bc4))

### ♻️ Code Refactoring

* **ai-chat:** 重构 useTools 为 useToolCall 并简化 API ([2c361bb](https://github.com/mhaibaraai/movk-nuxt-docs/commit/2c361bb943dcb601d295fe2fa536b9e2f8211456))

## [1.6.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.5.2...v1.6.0) (2026-01-08)

### ✨ Features

* 集成 MCP 服务器和工具包支持 ([5cd707c](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5cd707c))
* 新增 AI 聊天功能支持多模型选择 ([8618dde](https://github.com/mhaibaraai/movk-nuxt-docs/commit/8618dde))
* 新增工具函数和 Composables ([42ba073](https://github.com/mhaibaraai/movk-nuxt-docs/commit/42ba073))
* 添加 MCP 安装徽章和 VSCode 支持 ([c94c482](https://github.com/mhaibaraai/movk-nuxt-docs/commit/c94c482))
* 新增文档站点专属 FAQ 配置 ([03bba24](https://github.com/mhaibaraai/movk-nuxt-docs/commit/03bba24))

### 🐛 Bug Fixes

* 修正文件名从 CLAUDE.md 为 AGENTS.md ([88b79e7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/88b79e7))
* 修正图标名称格式 ([bd9fc0b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bd9fc0b))

### 📝 Documentation

* 重构文档目录结构和内容 ([171752a](https://github.com/mhaibaraai/movk-nuxt-docs/commit/171752a))
* 优化 README 布局和 OG 图片 ([efddd5f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/efddd5f))

### ♻️ Code Refactoring

* 重构组件结构并优化代码组织 ([4e45d02](https://github.com/mhaibaraai/movk-nuxt-docs/commit/4e45d02))
* 优化组件使用 Vue 3 组合式 API 最佳实践 ([073a9d7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/073a9d7))
* 移除自定义 llms 模块 ([f908c2d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f908c2d))

### 🔧 Chores

* **deps:** lock file maintenance ([459d809](https://github.com/mhaibaraai/movk-nuxt-docs/commit/459d809))
* **deps:** update all non-major dependencies ([52efe6b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/52efe6b))
* 优化 Vite 和 Nuxt 配置项 ([7ef5355](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7ef5355))
* 清理旧文档和废弃组件 ([7183d49](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7183d49))

## [1.5.2](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.5.1...v1.5.2) (2025-12-31)

### ✨ Features

* 添加文件命名格式配置支持 ([e61d5a2](https://github.com/mhaibaraai/movk-nuxt-docs/commit/e61d5a2d5eab87ab89edc66152da4bf13bdae5ca))

### ♻️ Code Refactoring

* 调整 zod 导入路径以支持 v4 ([4d831ae](https://github.com/mhaibaraai/movk-nuxt-docs/commit/4d831ae8499a41ac97ddffaa9775802ae5416b21))

### 🔧 Chores

* **deps:** update all non-major dependencies ([b2784da](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b2784dadf03bf0121ba679ed7a7b9aaa1af62f48))
* **deps:** 升级到 zod v4 ([f45af34](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f45af34a4c16d03d342f55d7e4ea69559c005e5d))

## [1.5.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.5.0...v1.5.1) (2025-12-29)

### ✨ Features

* 在组件白名单中添加 Motion 组件支持 ([1247306](https://github.com/mhaibaraai/movk-nuxt-docs/commit/12473067dd073b6291e29e28764a12a1156956c3))

### 🐛 Bug Fixes

* 使用函数过滤器替代正则表达式以避免路径长度限制 ([a320218](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a320218773a46bc3bdf7e520661e60c7c1a22963))
* 修复 AppConfig 类型定义缺失导致的 TypeScript 错误 ([d139e83](https://github.com/mhaibaraai/movk-nuxt-docs/commit/d139e83ddb6dea813ffcef90872c9db2523aa390))

### 👷 CI

* 在 CI 工作流中添加类型检查步骤 ([1fcd44b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/1fcd44b6f9f2bd0a791d5908eb253c87273ac59a))

## [1.5.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.4.2...v1.5.0) (2025-12-29)

### ⚠ BREAKING CHANGES

* 不再依赖 @nuxt/ui 组件的运行时类型推导,改用静态 schema 定义。这确保了更好的类型安全和编辑器支持

### ✨ Features

* 增强应用配置和实验性功能 ([b40a9ac](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b40a9ac9bffa0a7cb8fd80f1fcef7ebcde8caa6b))
* 新增 Shiki 代码高亮图标转换器 ([ee9801f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ee9801f7f0ad2c66af3dff54420e9b7b4733b8b1))
* 新增 useOverlay 和 useToast composables 文档 ([5e64622](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5e646226ca4d8ba89e309d3c7cd7b20771f03383))

### 🐛 Bug Fixes

* 增强 GitHub API 端点的错误处理和边界条件校验 ([67fad6d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/67fad6dd92469aed013625160537e562f3b1bedc))

### 📝 Documentation

* 为 composables 文档中的提示组件添加导航链接 ([00308c7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/00308c72ceebb5be43a37b3bb4ebc1735f8d8348))
* 优化组合式函数文档内容 ([9ea0a11](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9ea0a11db939c84d8df9b26cfa1007eba5ae655a))
* 修复 composables 文档中的 markdown 语法错误 ([c52b6f3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/c52b6f38638d00843b11a7058517aa5520a43f9a))
* 新增组合式函数文档 ([30d9476](https://github.com/mhaibaraai/movk-nuxt-docs/commit/30d947636ec58ffa77b447279cff7d385097bf00))
* 更新 OG 图片路径和资源文件 ([d877d52](https://github.com/mhaibaraai/movk-nuxt-docs/commit/d877d52a56d1e7a82a5fd0d8d49f1dbea027c318))
* 清理过时的 composables 文档 ([0a45f56](https://github.com/mhaibaraai/movk-nuxt-docs/commit/0a45f56bb395bb696868770bd50aaf899ea0ef9b))
* 移除 tip 组件中冗余的链接属性 ([bd3b7e2](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bd3b7e2e2f8a1653c7bbd0cf0db6b8848aa03625))

### ♻️ Code Refactoring

* 优化 Nuxt 配置并移除冗余 alias ([45952e0](https://github.com/mhaibaraai/movk-nuxt-docs/commit/45952e000cb46c52961c3796c1d445f8466d8473))
* 优化类型声明文件结构并启用 Nuxt UI 实验性功能 ([54b3972](https://github.com/mhaibaraai/movk-nuxt-docs/commit/54b3972ff98f50a6ff09d7ec991ba2a622cb0080))
* 移除 Nuxt Content 的 property 继承,改用显式 schema 定义 ([984996c](https://github.com/mhaibaraai/movk-nuxt-docs/commit/984996cae2ac30d542bcdf16766a81b3b4d180c7))
* 迁移类型声明至 app/types 目录并启用 Nuxt 自动发现 ([539736e](https://github.com/mhaibaraai/movk-nuxt-docs/commit/539736ec368362305206ab249df954f3fb54d7a3))

### 👷 CI

* 优化构建流程，将准备步骤移至 postinstall 钩子 ([8e32fa4](https://github.com/mhaibaraai/movk-nuxt-docs/commit/8e32fa4b1373fec0ec6de8fca2289f6f01d69c61))
* 新增开发环境准备步骤 ([a137e77](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a137e77a970e4828abbd67f8f00fd5b17b3317dc))

### 🔧 Chores

* **deps:** update all non-major dependencies ([fb98fc3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/fb98fc3d626a84fea7cc3c6a1a66946fa6cc5277))
* 优化发布前钩子配置 ([354316c](https://github.com/mhaibaraai/movk-nuxt-docs/commit/354316c18456a55cde738b01f6bd2b7479faf881))
* 升级 @movk/core 并移除冗余脚本 ([999b45f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/999b45f2cf09eccde9ea4c702c450cce6b22f303))
* 放宽 TypeScript 注释限制以支持必要的类型忽略 ([a513551](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a513551e4060dd8d88da167f9b549f7e69891b93))
* 更新项目配置 ([f1dcf44](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f1dcf44cf808b462f9bde094340d4fd7d7d335b0))
* 移除 @antfu/ni 依赖并使用显式 pnpm 命令 ([f2a7e22](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f2a7e22fedea092ec92074c1c9eeeca3c4e6ad7b))

## [1.4.2](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.4.1...v1.4.2) (2025-12-18)

### ♻️ Code Refactoring

* 优化 Vercel Analytics 追踪逻辑 ([89b2011](https://github.com/mhaibaraai/movk-nuxt-docs/commit/89b2011ce2c832c02aaf08ea05a13bbecce95a6d))
* 重构 vercelAnalytics 配置结构 ([17fc01f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/17fc01f3781e86c004a158267f056238c73b34ad))

## [1.4.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.4.0...v1.4.1) (2025-12-18)

### ✨ Features

* 内置 Vercel Analytics 和 Speed Insights 集成 ([66e2ede](https://github.com/mhaibaraai/movk-nuxt-docs/commit/66e2edef3df8a5ac2846bb05c6be76bdc9105b2f))

### 📝 Documentation

* 更新 Vercel Analytics 集成文档 ([59f9956](https://github.com/mhaibaraai/movk-nuxt-docs/commit/59f9956668d997d1eb39ed63295873701d17adf5))

### ♻️ Code Refactoring

* 优化页面组件并添加分析追踪 ([ceb4213](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ceb4213bfd271bca82aa43b4784c8a544f2fa26a))

## [1.4.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.12...v1.4.0) (2025-12-18)

### ✨ Features

* 增强主题定制系统并优化 UI 组件 ([5a468e3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5a468e33643ba83329131e37a704e1288d428fac))

### 🔧 Chores

* **deps:** update all non-major dependencies ([6868077](https://github.com/mhaibaraai/movk-nuxt-docs/commit/686807733404206b289c82a331b5fa6c071e3dbf))

## [1.3.12](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.11...v1.3.12) (2025-12-10)

### 🐛 Bug Fixes

* 修复部署文档重定向路径 ([3c7c13b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/3c7c13b15cead3aa0462b2420a255e2c36a97479))

### 📝 Documentation

* 在首页添加 @movk/nuxt 项目卡片 ([6d67762](https://github.com/mhaibaraai/movk-nuxt-docs/commit/6d67762c39f6b658367da8a99eb0817c9b39e14d))

### 🔧 Chores

* **deps:** lock file maintenance ([91b876d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/91b876d7cc47617a62f35144fb9a5c204cd04624))
* **deps:** update all non-major dependencies ([1701cc0](https://github.com/mhaibaraai/movk-nuxt-docs/commit/1701cc01bba444fa76b70d9e06a147c284bdec88))
* **deps:** update all non-major dependencies ([bdc9674](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bdc9674a844280aa00e193419b3f2fbde43b20ef))
* **deps:** update devdependency @antfu/ni to v28 ([6863b16](https://github.com/mhaibaraai/movk-nuxt-docs/commit/6863b160fc9a59f047fd84ffd8a03b41d2cc5a2d))
* **deps:** update nuxt framework to ^4.2.2 ([249c4eb](https://github.com/mhaibaraai/movk-nuxt-docs/commit/249c4eb35aac969c553c4a848e601499fe023916))
* **deps:** 降级 @release-it/conventional-changelog 到 10.0.1 版本 ([efca7c1](https://github.com/mhaibaraai/movk-nuxt-docs/commit/efca7c1b51b53159f9f74111621a6fee13836ccc))

## [1.3.11](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.10...v1.3.11) (2025-12-02)

### ✨ Features

* 添加页面最后提交信息展示功能 ([b3c3d27](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b3c3d27ac6343a7f0c808ff5876957fbd80acf6b))

### 📝 Documentation

* 添加 CommitChangelog 组件 author 参数示例 ([53bd400](https://github.com/mhaibaraai/movk-nuxt-docs/commit/53bd400e52632c81d266c10a049ef22b12eb1945))
* 重构配置文档层级结构 ([631594c](https://github.com/mhaibaraai/movk-nuxt-docs/commit/631594caa0dee84286dce9ad102a994f20afd59a))

### ♻️ Code Refactoring

* 优化 PageLastCommit 组件实现 ([c48bb7f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/c48bb7f6de3730d56274e0da5624f3194f8c1d94))

### 🔧 Chores

* **deps:** lock file maintenance ([7cde0bd](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7cde0bd34554870c83cf3d14bffdfcfc2742e50c))
* **deps:** update all non-major dependencies ([ad1e2bc](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ad1e2bcb3eeb741d713113543b768a2ce8cb39ac))

## [1.3.10](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.9...v1.3.10) (2025-11-28)

### ✨ Features

* 增强 GitHub 提交 API 支持更多过滤和分页参数 ([a87b363](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a87b36391678ee5e4acef264be8757fb1b0bfaf9))

### 🐛 Bug Fixes

* 更新 @release-it/conventional-changelog 依赖版本至 ^10.0.2 ([5ec1399](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5ec139991b352ced1c3e53a6938e0deb0c22df93))
* 添加分支参数以正确获取指定分支的提交记录 ([b7abba5](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b7abba5a7923672120833a07462a18c5131c3c82))

### 📝 Documentation

* 更新 GitHub 配置和 CommitChangelog 组件文档 ([9cd4dd4](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9cd4dd4c6b6b6687094e3fa0ddd8d3dca96f9bfa))

### 🔧 Chores

* **deps:** update all non-major dependencies ([9126100](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9126100e84101571d40163e35349a3d17e8a9405))

## [1.3.9](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.8...v1.3.9) (2025-11-27)

### 🔧 Chores

* 移除 GitHub 提交接口的调试日志 ([2ee66a4](https://github.com/mhaibaraai/movk-nuxt-docs/commit/2ee66a4b2b1c6bb4d1aebea7399437d43eba1fe9))

## [1.3.8](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.7...v1.3.8) (2025-11-26)

### ✨ Features

* **config:** 扩展 GitHub 配置以支持提交历史功能 ([ace88d5](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ace88d5fcf2a0021a27c69e6af65e1c5b8903b6e))
* 新增 CommitChangelog 组件 ([b4084b5](https://github.com/mhaibaraai/movk-nuxt-docs/commit/b4084b5bd16df1a3c076ccc327676225e9ca7e95))
* 新增模块模板和环境配置示例 ([9035d66](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9035d665a035e6044a66e6539ad65aa4e076533c))

### 📝 Documentation

* 完善文档内容并新增模板说明 ([85c53c1](https://github.com/mhaibaraai/movk-nuxt-docs/commit/85c53c1b1831dbcda09614f82aabb631d884baae))

### ♻️ Code Refactoring

* **component:** 调整 ComponentExample 默认配置 ([9cfe622](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9cfe622dfdd7f613be46842da4bd09c495826b26))

### 🔧 Chores

* **config:** 扩展 changelog 配置以显示所有提交类型 ([db2d250](https://github.com/mhaibaraai/movk-nuxt-docs/commit/db2d250c4da0977610c5d920ce3280fbc1934a69))
* **deps:** update all non-major dependencies ([6d73240](https://github.com/mhaibaraai/movk-nuxt-docs/commit/6d732405280d1e72535db117e87a54d99fc0aeb2))
* **deps:** 更新依赖包 ([85edb34](https://github.com/mhaibaraai/movk-nuxt-docs/commit/85edb347a249e115dff061143719a1c608de5c36))

## [1.3.7](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.6...v1.3.7) (2025-11-25)

### Features

* 增强组件属性显示功能 ([d68bce6](https://github.com/mhaibaraai/movk-nuxt-docs/commit/d68bce69021966cdb71246c610d09da3c3d146e9))

### Bug Fixes

* 修复内联类型高亮的服务端渲染问题 ([17ea5b7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/17ea5b7fd3db2c035db73e20a42965dfb676e94e))

## [1.3.6](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.5...v1.3.6) (2025-11-24)

## [1.3.5](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.4...v1.3.5) (2025-11-21)

### Features

* 为内容搜索添加结果数量限制 ([ee06e7d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ee06e7de68dc5a8b958120b51454a471c9f26dfe))
* 添加 “Composables” 文档页面 ([542f2a3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/542f2a383fdbc8c25ed6bb60432aa42feebcc973))

### Documentation

* 修复 code-tree 组件语法格式 ([f20e95d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f20e95db5b4aeef2563f2fda02d70447295098c1))

## [1.3.4](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.3...v1.3.4) (2025-11-19)

* **deps:** update all non-major dependencies ([5baccc8](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5baccc817405a16547c66eec519dedb53c8758d5))

## [1.3.3](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.2...v1.3.3) (2025-11-17)

### 🔧 Chores

* **deps:** lock file maintenance ([573542f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/573542fe238908c4f8246583a51e360a89f2dc27))
* **deps:** update all non-major dependencies ([7eabaf6](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7eabaf6181282511b0a5a78dcbb2a0781159135e))

## [1.3.2](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.1...v1.3.2) (2025-11-11)

### 📚 Documentation

* 优化项目结构文档和模板配置 ([7d8aaf3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7d8aaf3ef5d4bff87e03d94408a743f3891f9309))

### 🔧 Chores

* 优化 nuxt.config.ts 依赖配置 ([bb314d8](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bb314d8c26fa1db8254b739a339d9d21b22af53b))
* 清理项目依赖配置 ([309eead](https://github.com/mhaibaraai/movk-nuxt-docs/commit/309eead78281a2f997f47ce8c05e40a92e85c5cd))
* 重新生成 pnpm-lock.yaml ([a56916e](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a56916ea5dafc8adff39e2e32c64c25a05ecc75f))

## [1.3.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.3.0...v1.3.1) (2025-11-11)

### 🐛 Bug Fixes

* 为 MDC 组件添加 ClientOnly 包装解决 SSR 问题 ([a101c2d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a101c2d8e45c645fcbd555d2801ed5074895754c))

### 📚 Documentation

* 更新 CHANGELOG 记录 releases 页面重构 ([ff16a36](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ff16a3688d458566e46beebed9892cbd63315b0a))

### 💄 Styles

* 优化 StarsBg 组件 CSS 代码格式 ([a5b70fd](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a5b70fdfa89c25c8b4da0beaab4ed72f5143cb74))

### 🔧 Chores

* **deps:** lock file maintenance ([ba61a0d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ba61a0d8c9250dc6d8f7340dcdf3aead3e3c61b7))
* **deps:** update all non-major dependencies ([9073e6d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9073e6dc8a7847234e8f838f226caeabde9b7150))
* **deps:** update all non-major dependencies ([a8976ef](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a8976ef93f5b53914db26f427cb02039842677ef))
* **deps:** update all non-major dependencies ([8c6831f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/8c6831fc649e34b6c743d33589c209f25df9e516))
* **deps:** update dependency @nuxt/image to v2 ([9225ab6](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9225ab66ba833473074e1d696c5b88d3d1bebee8))
* **deps:** update dependency exsolve to ^1.0.8 ([ea1b983](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ea1b983acaddab24a29eede691ebbed2a9d36011))
* **deps:** update devdependency @nuxt/devtools to ^3.0.1 ([e879bb2](https://github.com/mhaibaraai/movk-nuxt-docs/commit/e879bb24229263247dfdf105bd0af4b3d891b40e))
* **deps:** update devdependency eslint to ^9.39.0 ([fc2d0ba](https://github.com/mhaibaraai/movk-nuxt-docs/commit/fc2d0bae7bf03b74a476c24c966d3a4728c5a31a))
* **deps:** update nuxt framework to ^4.2.1 ([564d8ac](https://github.com/mhaibaraai/movk-nuxt-docs/commit/564d8ace5d1766b32a52ecbc675bee1c37c08996))
* 关闭 TypeScript unified-signatures ESLint 规则 ([8fea873](https://github.com/mhaibaraai/movk-nuxt-docs/commit/8fea873ef8d5e618aa6913458dd726ff1a8b4d31))

## [1.3.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.2.1...v1.3.0) (2025-10-31)

### ♻️ refactor

* 重构 releases 页面架构到 docs 目录 ([c03e1d4](https://github.com/mhaibaraai/movk-nuxt-docs/commit/c03e1d4e6a4bb2f914375677ad4e0d62b78d25ed))

### 🐛 Bug Fixes

* 修复 HeaderBottom 组件空值处理 ([bf502c0](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bf502c0e40db2e53886ea79263e3cd2b87fb915a))
* 修复 llms 文档中的外部链接地址 ([6e2b339](https://github.com/mhaibaraai/movk-nuxt-docs/commit/6e2b339dc3403e43be7291fa24919c54f49ebd0e))

### 📚 Documentation

* 更新入门教程关于页面扩展的说明 ([8d84e22](https://github.com/mhaibaraai/movk-nuxt-docs/commit/8d84e224c4eb9dfa58d7206fcffccb3661244d96))

### 💄 Styles

* 调整容器最大宽度 ([2fa88ba](https://github.com/mhaibaraai/movk-nuxt-docs/commit/2fa88babf07c25beb64a0619d0c601fbd2080207))

## [1.2.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.2.0...v1.2.1) (2025-10-30)

### 📚 Documentation

* 清理 CHANGELOG 中与 Vercel 部署相关的条目 ([851103d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/851103d00613e4864753a449e47cb6e50a404296))
* 清理 CHANGELOG 中重复的 lock file maintenance 条目 ([188db9a](https://github.com/mhaibaraai/movk-nuxt-docs/commit/188db9ae09a53c03708098e97b77630c09d6f216))

### 💄 Styles

* 优化首页布局容器样式 ([72dcce7](https://github.com/mhaibaraai/movk-nuxt-docs/commit/72dcce7eaf7534a3d4ed6ad846f82f9a6d0dcb07))
* 修复组件示例中颜色选择器的样式类名 ([6cd2f71](https://github.com/mhaibaraai/movk-nuxt-docs/commit/6cd2f7196e2ac51ca5d04131a98811d0d76a2499))
* 同步首页容器样式到模板文件 ([42cf173](https://github.com/mhaibaraai/movk-nuxt-docs/commit/42cf1732787d5384335f4837371e7614e954b19a))

### 🔧 Chores

* **deps:** lock file maintenance ([60ea10b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/60ea10b8f575c0126800694c57da4290dfdf6008))
* **deps:** lock file maintenance ([ee605bc](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ee605bc03d2e96c8aeb2669bc247c50614bfa764))
* **deps:** update all non-major dependencies ([5480a38](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5480a387e494952cffce5bb5f3a536553acf8b2b))
* **deps:** update all non-major dependencies ([f635ab9](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f635ab9a370fc3ac42d47bba20853fd0a5a73f62))
* 优化 Vite 依赖预打包配置 ([348ee6d](https://github.com/mhaibaraai/movk-nuxt-docs/commit/348ee6d116e41f35fa839f018a74672b056983c1))

## [1.2.0](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.1.2...v1.2.0) (2025-10-28)

### ✨ Features

* 新增 OgImage 组件 ([e9588b3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/e9588b33fc4bb6e424e8b0b3fac5661ae2837257))
* 替换 OgImage 组件为新的 Nuxt 组件 ([7cdfb2e](https://github.com/mhaibaraai/movk-nuxt-docs/commit/7cdfb2ee3085f457ec6dbbf0ba24b57ccbc8e8c4))
* 添加 LLMs 模块并启用预渲染容错配置 ([2307df6](https://github.com/mhaibaraai/movk-nuxt-docs/commit/2307df6dd94f5fe15ca6ce156d0dd28314a63a23))

### 🐛 Bug Fixes

* 修复原始路由处理函数类型定义 ([1194697](https://github.com/mhaibaraai/movk-nuxt-docs/commit/1194697785bf3debe35612543d0360ce4443b4ab))
* 修复文档页面中 Tailwind CSS 类名语法错误 ([292aff5](https://github.com/mhaibaraai/movk-nuxt-docs/commit/292aff58e8ac9cd236cb8080e7463539f29a008c))
* 添加开发环境 LLMs 代理路由并优化文档引用 ([69ffce4](https://github.com/mhaibaraai/movk-nuxt-docs/commit/69ffce4ce521a5853a0832d507c4f0a97705fc2c))

### 📚 Documentation

* 更新 LLMs 文档引用并简化配置结构 ([39d1b10](https://github.com/mhaibaraai/movk-nuxt-docs/commit/39d1b10e647c49d226914f4aa9401debfd1bc746))

### 🔧 Chores

* **deps:** lock file maintenance ([98b5650](https://github.com/mhaibaraai/movk-nuxt-docs/commit/98b56507b6a5403de81cf94d8fa59f0d15e05dc6))
* **deps:** update all non-major dependencies ([258342a](https://github.com/mhaibaraai/movk-nuxt-docs/commit/258342af6fcaa199748e4a97cdf728349fa81ba9))
* **deps:** update all non-major dependencies ([f4bd3cb](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f4bd3cbe18c1aed1b0de02cd3dd621d7304d36d8))
* **deps:** update dependency @iconify-json/simple-icons to ^1.2.56 ([bfe906b](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bfe906b79276578fe234c82a1c4f31b0daefff5f))
* **deps:** update dependency @iconify-json/simple-icons to ^1.2.56 ([dbe244f](https://github.com/mhaibaraai/movk-nuxt-docs/commit/dbe244f69e96012f867c656ad0191ea9f7a49500))
* **deps:** update devdependency @nuxt/devtools to v3 ([37b6024](https://github.com/mhaibaraai/movk-nuxt-docs/commit/37b60248017fe9977f65b3598e3e57ba79a56471))
* **deps:** update devdependency @nuxt/devtools to v3 ([71e9812](https://github.com/mhaibaraai/movk-nuxt-docs/commit/71e9812bcf011be59e2a5ce35bb7fc2834f4cc11))
* **deps:** update nuxt framework to ^4.2.0 ([edd1789](https://github.com/mhaibaraai/movk-nuxt-docs/commit/edd1789b60440487631ce35239847781d4d57d4a))
* **deps:** update vueuse monorepo to v14 ([f9f47dc](https://github.com/mhaibaraai/movk-nuxt-docs/commit/f9f47dc89ae3e5de4f69665a2899bf23b077d05c))
* 优化 VSCode 编辑器自动格式化和代码修复配置 ([853cfa9](https://github.com/mhaibaraai/movk-nuxt-docs/commit/853cfa9f1c22420cac66ad5b8c7e29f47e257ae4))
* 更新 TypeScript 配置使用新的引用结构 ([9b1e099](https://github.com/mhaibaraai/movk-nuxt-docs/commit/9b1e099c4241f99fbca7dc2658e8109e5a154be8))
* 清理未使用的 composables 和更新清理脚本 ([a992455](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a992455090cb3bfb313d2cb0274de1a5dfc18820))
* 移除 CI 工作流中的类型检查步骤 ([788ee65](https://github.com/mhaibaraai/movk-nuxt-docs/commit/788ee6582a7718bdeec1339c0782f6cab985be6f))
* 简化发布流程，移除 typecheck 检查 ([fd1b446](https://github.com/mhaibaraai/movk-nuxt-docs/commit/fd1b4460f8cca22d472bbcebccd77967924aa559))

## [1.1.2](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.1.1...v1.1.2) (2025-10-22)

### ✨ Features

* 为首页添加动画效果 ([bcb520a](https://github.com/mhaibaraai/movk-nuxt-docs/commit/bcb520a562514c2c175351fdf674c7b7dfe4689f))

### 🐛 Bug Fixes

* 修复导航引用和内容配置格式 ([0f9d0aa](https://github.com/mhaibaraai/movk-nuxt-docs/commit/0f9d0aa2d4ac029cd1bcf8b5f90338d2ebd942db))

## [1.1.1](https://github.com/mhaibaraai/movk-nuxt-docs/compare/v1.1.0...v1.1.1) (2025-10-20)

### 🐛 Bug Fixes

* 修正导航栏标签拼写错误 ([1aaaf50](https://github.com/mhaibaraai/movk-nuxt-docs/commit/1aaaf50e06d72b3d4535cc61c2033bfae998bb64))

### 📚 Documentation

* 优化代码块格式并更新项目结构说明 ([5357ac1](https://github.com/mhaibaraai/movk-nuxt-docs/commit/5357ac16bcdd5be3c14385f3763a007620d2a740))
* 修正模板路径错误 ([e851635](https://github.com/mhaibaraai/movk-nuxt-docs/commit/e85163539509a09f12f45e9a53ae68092789a004))

### 💄 Styles

* 修正 accordion 文档格式 ([ac058e3](https://github.com/mhaibaraai/movk-nuxt-docs/commit/ac058e3ce8103dbc2f07d9479abef46d60302538))
* 移除配置文件尾随逗号 ([cc00e29](https://github.com/mhaibaraai/movk-nuxt-docs/commit/cc00e299db412aa575b2223f2fe893912671b0e1))

### 🔧 Chores

* 简化发布脚本配置 ([a44a2bf](https://github.com/mhaibaraai/movk-nuxt-docs/commit/a44a2bf1608f8c5bcc3b54668a539942bdf597f1))
