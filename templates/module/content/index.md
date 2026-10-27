---
title: My Docs
description: 用 Movk Nuxt Docs 搭建的文档站点。
---

::landing-cover{kicker="文档" aside="MIT"}
#title
My Docs[.]{.text-primary}

#description
一句话介绍你的项目：它解决什么问题，适合谁使用。

#links
  :::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  快速开始
  :::

#default
  ```bash [Terminal]
  pnpm add my-package
  ```

  :landing-index{label="目录"}
::

::landing-section{index="01" kicker="Features"}
#title
主要特性

#description
用两三句话概括这一组特性，下面的每一格各写一项。

#default

  :::landing-feature
  #title
  开箱即用

  #description
  说明第一项特性带来的好处。
  :::

  :::landing-feature
  #title
  类型安全

  #description
  说明第二项特性带来的好处。
  :::

  :::landing-feature
  #title
  易于扩展

  #description
  说明第三项特性带来的好处。
  :::

  :::landing-feature
  #title
  文档齐全

  #description
  说明第四项特性带来的好处。
  :::
::

::landing-closing
#title
从这里开始[.]{.text-primary}

#links
  :::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  快速开始
  :::

  :::u-button
  ---
  color: neutral
  variant: ghost
  size: xl
  to: /releases
  ---
  版本发布
  :::
::
