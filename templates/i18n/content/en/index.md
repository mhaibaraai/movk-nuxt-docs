---
title: My Docs
description: A documentation site built with Movk Nuxt Docs.
---

::landing-cover{kicker="Docs" aside="MIT"}
#title
My Docs[.]{.text-primary}

#description
One sentence about your project: what it solves and who it is for.

#links
  :::u-button
  ---
  to: /en/docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

#default
  ```bash [Terminal]
  pnpm add my-package
  ```

  :landing-index{label="Contents"}
::

::landing-section{index="01" kicker="Features"}
#title
Highlights

#description
Summarize this group of features in two or three sentences, then give each one its own cell below.

#default

  :::landing-feature
  #title
  Ready to use

  #description
  Describe what the first feature brings.
  :::

  :::landing-feature
  #title
  Type safe

  #description
  Describe what the second feature brings.
  :::

  :::landing-feature
  #title
  Extensible

  #description
  Describe what the third feature brings.
  :::

  :::landing-feature
  #title
  Documented

  #description
  Describe what the fourth feature brings.
  :::
::

::landing-closing
#title
Start here[.]{.text-primary}

#links
  :::u-button
  ---
  to: /en/docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::
::
