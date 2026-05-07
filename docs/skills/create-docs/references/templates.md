# Documentation Templates

Ready-to-use templates for generating documentation pages.

**Critical: every Nuxt UI component must use the `u-` prefix in MDC syntax.**
- `::u-page-hero` not `::page-hero`
- `:::u-button` not `:::button`
- `::::u-page-card` not `::::page-card`

## Table of Contents

- [Landing page](#landing-page)
- [Introduction page](#introduction-page)
- [Installation page](#installation-page)
- [Guide page](#guide-page)
- [Navigation YAML](#navigation-yaml)

---

## Landing Page

### Basic Landing Page

```markdown
---
seo:
  title: [Project Name] Documentation
  description: [Project description]
---

::u-page-hero
#title
[Project Name]

#description
[Short description — what problem does it solve?]

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started/introduction
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: [GitHub URL]
  target: _blank
  variant: outline
  ---
  View on GitHub
  :::
::

::u-page-section
#title
What you can do

#features
  :::u-page-feature
  ---
  icon: [icon]
  to: /guide/[topic]
  ---
  #title
  [Action verb] [thing]

  #description
  [One-sentence description of the feature]
  :::
::
```

### Advanced Landing Page with Grid Cards

Use `u-page-grid` + `u-page-card` for richer feature showcases:

```markdown
::u-page-hero
#title
[Project Name]

#description
[Description]

#headline
  :::u-button
  ---
  size: sm
  to: [changelog-url]
  variant: outline
  ---
  v1.0.0 released →
  :::

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /guide/feature-1
    ---
    #title
    Feature one

    #description
    Description of this feature and what it's for.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2
    ---
      :::::u-color-mode-image
      ---
      alt: Feature screenshot
      class: w-full rounded-lg
      dark: /images/feature-dark.png
      light: /images/feature-light.png
      ---
      :::::

    #title
    Feature with image

    #description
    Showcase a feature with light/dark mode images.
    ::::
  :::
::
```

### Card with Code Preview

```markdown
::::u-page-card
---
spotlight: true
class: col-span-2 md:col-span-1
---
  :::::div{.bg-elevated.rounded-lg.p-3.overflow-x-auto}
  ```ts [config.ts]
  export default {
    option: 'value'
  }
  ```
  :::::

#title
Simple configuration

#description
Configure with straightforward options.
::::
```

### Card with a Custom Component

Create custom components under `app/components/content/` for interactive demos:

```markdown
::::u-page-card
---
spotlight: true
class: col-span-2
---
:my-custom-demo

#title
Interactive demo

#description
A custom Vue component embedded in a card.
::::
```

### Grid Layout Classes

| Class | Usage |
|-------|-------|
| `col-span-2` | Full width (2 columns) |
| `col-span-2 lg:col-span-1` | Full width on mobile, half width on desktop |
| `col-span-2 md:col-span-1` | Full width on mobile, half width on tablet and up |
| `min-h-[450px]` | Minimum height for tall cards |

### Optional Enhancement Patterns

Choose based on the project's needs:

| Pattern | When to use |
|---------|-------------|
| Code preview in cards | Libraries, APIs, CLIs |
| Feature grid with icons | Projects with multiple features |
| CTA section | Drive user action |
| Code comparison | Projects that solve a pain point |

See [mdc-components.md](mdc-components.md) for component syntax.
See https://ui.nuxt.com/llms.txt for the full component reference.

---

## Introduction Page

```markdown
---
title: Introduction
description: Learn what [Project Name] is and when to use it
navigation:
  icon: i-lucide-house
---

[Project Name] helps you [main value proposition].

## What is [Project Name]?

[2–3 sentences explaining the project]

## What you can do

- **[Action 1]** — [Short description]
- **[Action 2]** — [Short description]
- **[Action 3]** — [Short description]

## When to use [Project Name]

Use [Project Name] when you need to:

- [Use case 1]
- [Use case 2]
- [Use case 3]
```

---

## Installation Page

Use the detected package manager and show every option:

```markdown
---
title: Installation
description: How to install [Project Name]
navigation:
  icon: i-lucide-download
---

## Prerequisites

[List any prerequisites]

## How to install

::code-group
```bash [pnpm]
pnpm add [package-name]
```

```bash [npm]
npm install [package-name]
```

```bash [yarn]
yarn add [package-name]
```

```bash [bun]
bun add [package-name]
```
::

## How to verify the installation

[Verification steps]
```

---

## Guide Page

Use action verbs in H2/H3 headings:

```markdown
---
title: [Topic]
description: [Action verb] [thing] in your [Project Name] app
navigation:
  icon: [icon]
---

[One-sentence overview]

## Add basic [feature]

[Explanation]

```[language] [[file-path]]
[code]
```

## Configure [feature]

[Explanation]

```[language] [[file-path]]
[code]
```

## Handle [edge case]

[Explanation]

## Next steps

- [Link to related guide]
- [Link to advanced topic]
```

**Action verbs for H2 headings:** add, configure, create, set up, enable, connect, handle, customize, deploy, use.

---

## Navigation YAML

Each section folder needs a `.navigation.yml`:

```yaml
title: [Section title]
icon: [icon-name]
```

### Recommended Icons by Section

| Section | Icon |
|---------|------|
| Getting started | `i-lucide-rocket` |
| Guide | `i-lucide-book-open` |
| Recipes | `i-lucide-chef-hat` |
| API | `i-lucide-code` |
| Examples | `i-lucide-lightbulb` |
| Configuration | `i-lucide-settings` |
| Advanced | `i-lucide-sparkles` |
