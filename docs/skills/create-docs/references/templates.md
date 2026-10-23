# Page Templates

Skeletons for the pages a Movk Nuxt Docs site needs. Replace every `[placeholder]`. All docs pages live in `content/docs/` and are served under `/docs`; with i18n, other locales mirror the tree in `content/{locale}/docs/`.

## Frontmatter

Every docs page uses the same fields:

```yaml
---
title: [Page title]                 # Sidebar and H1, short
description: [What the page covers and what the reader can do after reading it]
seo:
  title: [Search-result title, 50-60 characters]
  description: [Search-result description, 120-160 characters]
navigation:
  icon: i-lucide-[icon]             # Optional sidebar icon
  title: [Shorter sidebar label]    # Optional
  badge: New                        # Optional
category: [category id]             # Optional, groups the page via app.config docs.categories
links:                              # Optional buttons under the page header
  - label: Source
    icon: i-simple-icons-github
    to: [https://github.com/...]
    target: _blank
---
```

- The page body starts with an H2; the title is rendered from `title`.
- `navigation: false` keeps a route out of the sidebar.
- On a Chinese site, keep `title` / `description` in Chinese and write `seo.*` in the language you want search engines to show.

## Section navigation

```yaml [content/docs/1.getting-started/.navigation.yml]
title: Getting Started
icon: i-lucide-square-play
```

| Section | Icon |
|---------|------|
| Getting started | `i-lucide-square-play` |
| Guide | `i-lucide-compass` |
| API / Reference | `i-lucide-book-marked` |
| Components | `i-lucide-component` |
| Composables | `i-lucide-square-function` |
| Examples | `i-lucide-lightbulb` |

Add a redirect for each section root in `nuxt.config.ts` `routeRules`, e.g. `'/docs/guide': { redirect: '/docs/guide/configuration', prerender: false }`.

## Landing page

`content/index.md`. Keep it short: hero, install command, features.

```markdown
---
seo:
  title: [Project Name]
  description: [One-sentence pitch, 120-160 characters]
---

::u-page-hero
#title
[Project Name]

#description
[What problem it solves, for whom, in one or two sentences.]

#links
  :::u-button{to="/docs/getting-started" size="xl" trailing-icon="i-lucide-arrow-right"}
  Get started
  :::

  :::u-button{to="[GitHub URL]" target="_blank" size="xl" color="neutral" variant="outline" icon="i-simple-icons-github"}
  GitHub
  :::
::

::u-page-section
#title
Features

#features
  :::u-page-feature{icon="i-lucide-[icon]" to="/docs/guide/[topic]"}
  #title
  [Feature name]

  #description
  [One sentence about what it does for the user.]
  :::

  :::u-page-feature{icon="i-lucide-[icon]" to="/docs/guide/[topic]"}
  #title
  [Feature name]

  #description
  [One sentence.]
  :::
::
```

For screenshots use light and dark variants:

```markdown
:u-color-mode-image{light="/screenshots/[name]-light.png" dark="/screenshots/[name]-dark.png" alt="[What the image shows]" class="rounded-md" width="1280" height="800"}
```

## Introduction

`content/docs/1.getting-started/1.index.md` → `/docs/getting-started`

```markdown
---
title: Introduction
description: [Project] is [category] that [main benefit]. Learn what it does, when to use it and where to start.
seo:
  title: Introduction to [Project]
  description: [120-160 characters]
navigation:
  icon: i-lucide-house
---

## What is [Project]?

[Two or three sentences: what it is and the problem it solves.]

## Features

- **[Feature]** — [one line]
- **[Feature]** — [one line]
- **[Feature]** — [one line]

## When to use it

[Who benefits, and when another tool is a better fit.]

## Next steps

::card-group
  :::card{title="Installation" icon="i-lucide-download" to="/docs/getting-started/installation"}
  Install [Project] and run it for the first time.
  :::

  :::card{title="Guide" icon="i-lucide-compass" to="/docs/guide/[first-topic]"}
  Learn the core workflows.
  :::
::
```

## Installation

`content/docs/1.getting-started/2.installation.md`

````markdown
---
title: Installation
description: Install [Project], add the minimal configuration and verify that it works.
seo:
  title: Install [Project]
  description: [120-160 characters]
navigation:
  icon: i-lucide-download
---

## Prerequisites

- Node.js [version] or later
- [Other requirement]

## Install the package

::code-group
```bash [pnpm]
pnpm add [package]
```

```bash [npm]
npm install [package]
```

```bash [yarn]
yarn add [package]
```

```bash [bun]
bun add [package]
```
::

## Configure

```ts [[config file]]
[minimal configuration]
```

## Verify the installation

[Command or code that proves it works, and the expected output.]
````

## Guide page

`content/docs/2.guide/[n].[topic].md`. One feature per page, headings start with a verb.

````markdown
---
title: [Topic]
description: [What the reader will be able to do with this feature.]
seo:
  title: [Topic] - [Project]
  description: [120-160 characters]
navigation:
  icon: i-lucide-[icon]
category: [category id]
---

## Enable [feature]

[Short explanation.]

```ts [[file]]
[code]
```

## Configure [feature]

::field-group
  :::field{name="[option]" type="string"}
  [What it does.] Defaults to `[value]`.
  :::
::

## Handle [edge case]

::warning
[Gotcha and how to avoid it.]
::

## Next steps

- [Related guide](/docs/guide/[topic])
````

## API reference page

`content/docs/3.api/[n].[name].md`. One page per public function, composable or module option group.

````markdown
---
title: [functionName]
description: [One sentence about what it returns or does.]
seo:
  title: [functionName] - [Project] API
  description: [120-160 characters]
navigation:
  icon: i-lucide-square-function
---

## Usage

```ts
const result = [functionName]([args])
```

## Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `[param]` | `[type]` | `[default]` | [description] |

## Returns

| Name | Type | Description |
|------|------|-------------|
| `[field]` | `[type]` | [description] |

## Example

```ts [[file]]
[complete example]
```
````

Signatures, defaults and return shapes must be copied from the source, not paraphrased.

## Component page

Requires `movkNuxtDocs.componentDocs: true`, the packages `nuxt-component-meta vue-component-meta prettier`, and the component listed in `componentMeta.include`. The slug defaults to the last path segment, so name the file after the component (`3.my-button.md` → `MyButton`).

````markdown
---
title: MyButton
description: [What the component is for.]
seo:
  title: MyButton component - [Project]
  description: [120-160 characters]
navigation:
  icon: i-lucide-mouse-pointer-click
links:
  - label: Source
    icon: i-simple-icons-github
    to: [https://github.com/.../MyButton.vue]
    target: _blank
---

## Usage

::component-code
---
name: MyButton
props:
  color: primary
items:
  color: [primary, neutral]
---
::

## Examples

:component-example{name="MyButtonLoadingExample"}

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Changelog

:commit-changelog
````

Examples live in `app/components/content/examples/` (`MyButtonLoadingExample.vue`).
