# Technical Validation Guide

Technical specification checks for Movk Nuxt Docs documentation, covering frontmatter, MDC components, code blocks, and file naming.

## Frontmatter Validation

### Required Fields

Every documentation page must include:

```yaml
---
title: Page title
description: Page description used for SEO and search results.
---
```

### Optional Fields

```yaml
---
title: Page title
description: Page description
navigation:
  title: Short navigation title (1–3 words)
  icon: i-lucide-book
category: core-concepts
seo:
  title: SEO-optimized title (50–60 characters)
  description: SEO description (120–160 characters)
links:
  - label: Related link
    icon: i-lucide-arrow-right
    to: /docs/guide
    target: _blank  # Required for external links
---
```

### Field Validation Rules

**title:**
- Type: string
- Required: yes
- Recommended length: under 60 characters (page title and SEO use)
- Must be unique across pages

**description:**
- Type: string
- Required: yes
- Recommended length: 120–160 characters (optimal SEO range)
- Should be concise and descriptive

**navigation.icon:**
- Format: `i-{collection}-{icon-name}` (e.g. `i-lucide-house`, `i-simple-icons-github`)
- Must start with `i-`
- Prefer the Lucide icon set (`i-lucide-*`) for consistency

**navigation.title:**
- Type: string
- Optional: overrides the default sidebar title
- Keep it short (1–3 words)

**seo.title:**
- Type: string
- Optimal: 50–60 characters
- May differ from the page title for SEO optimization

**seo.description:**
- Type: string
- Optimal: 120–160 characters
- More detailed than the main description if needed

**links:**
- Type: array of objects
- Each object must include: `label`, `to`
- Optional: `icon`, `target` (for external links)

### Common Frontmatter Errors

❌ **Missing required fields:**
```yaml
---
title: My page
# Wrong: description is missing
---
```

❌ **Wrong icon format:**
```yaml
---
navigation:
  icon: lucide-house  # Wrong: missing the i- prefix
---
```

❌ **Wrong links structure:**
```yaml
---
links:
  - "https://example.com"  # Wrong: must be an object
---
```

✅ **Correct example:**
```yaml
---
title: AI Chat
description: Add a built-in AI chat assistant to your docs site, with multi-model switching and a customizable UI.
navigation:
  icon: i-lucide-bot
seo:
  title: AI Chat — Movk Nuxt Docs
  description: Learn how to integrate the AI chat feature in Movk Nuxt Docs to provide intelligent Q&A and an interactive experience.
links:
  - label: Configuration reference
    icon: i-lucide-settings
    to: /docs/configuration
---
```

---

## MDC Component Validation

### Strict Rule: the `u-` Prefix

**Every Nuxt UI component used in MDC must use the `u-` prefix.**

This is the most common error and causes build failures.

### Common Components Requiring the `u-` Prefix

| Component | Wrong | Correct |
|-----------|-------|---------|
| Page hero | `::page-hero` | `::u-page-hero` |
| Page section | `::page-section` | `::u-page-section` |
| Page grid | `::page-grid` | `::u-page-grid` |
| Page card | `::page-card` | `::u-page-card` |
| Page feature | `::page-feature` | `::u-page-feature` |
| Button | `::button` or `:::button` | `:::u-button` |
| Badge | `::badge` | `::u-badge` |
| Color mode image | `:color-mode-image` | `:u-color-mode-image` |

### Component Nesting Levels

MDC uses colons to indicate nesting depth:

```markdown
::u-page-hero           # Level 1: 2 colons
  :::u-button           # Level 2: 3 colons
    ::::div             # Level 3: 4 colons (HTML element)
      :::::span         # Level 4: 5 colons
```

**Validate:** ensure nesting levels are consistent and logical.

### Component Properties

**Inline properties** (using braces):

```markdown
:::u-button{color="neutral" size="xl" to="/path" trailing-icon="i-lucide-arrow-right"}
Button text
:::
```

**Block properties** (using `---` delimiters):

```markdown
:::u-button
---
color: neutral
size: xl
to: /path
trailing-icon: i-lucide-arrow-right
---
Button text
:::
```

**Common property errors:**

❌ Wrong: `:::u-button(color="neutral")`
✅ Correct: `:::u-button{color="neutral"}`

❌ Wrong: `:::u-button[size=xl]`
✅ Correct: `:::u-button{size="xl"}`

### Slot Syntax

Components with named slots use `#slot-name`:

```markdown
::u-page-hero
#title
Your title here

#description
Your description text

#links
  :::u-button{to="/start"}
  Get started
  :::
::
```

**Validate:** ensure slot names match the component documentation.

### Content vs. Nuxt Content Components

**Nuxt Content components** (no `u-` prefix):
- `::code-group` — multi-tab code block
- `::steps` — step-by-step instructions
- `::note`, `::tip`, `::warning`, `::caution` — callouts

**Nuxt UI components** (require the `u-` prefix):
- `::u-page-*` — page layout components
- `::u-button`, `::u-badge` — interactive elements
- `:u-color-mode-image` — image with theme variants

### Code Block Validation

#### File Path Labels

**Every code block that represents a file should include a filename label**, not just config files. This applies to every code sample that represents a file:

✅ Good:
````markdown
```vue [App.vue]
<script setup lang="ts">
import { ref } from 'vue'
</script>
```
````

````markdown
```typescript [parse.ts]
import { parse } from 'comark'
```
````

````markdown
```tsx [App.tsx]
export default function App() {}
```
````

❌ Missing label:
````markdown
```vue
<script setup lang="ts">
import { ref } from 'vue'
</script>
```
````

**Label naming conventions:**
- Vue components: `[App.vue]`, `[components/Alert.vue]`, `[pages/index.vue]`
- TypeScript files: `[parse.ts]`, `[config.ts]`, `[server.ts]`
- React components: `[App.tsx]`, `[components/Card.tsx]`
- Configuration files: `[nuxt.config.ts]`, `[app.config.ts]`
- CSS files: `[styles.css]`, `[app/assets/css/main.css]`
- Terminal commands: `[Terminal]`

**Exceptions** (no label needed):
- Type definitions / interfaces
- MDC syntax examples (` ```mdc `)
- Inline snippets that don't represent a file

#### Code Language Consistency

Code samples should match the project's language stack. Check the project's `tsconfig.json`, `package.json`, or existing code to determine the default language.

**For TypeScript projects**, every code sample should use TypeScript. Common mismatches to flag:
- Vue `<script setup>` missing `lang="ts"` → should be `<script setup lang="ts">`.
- `.js` extensions in samples when the project uses `.ts`.
- Missing type annotations on function signatures when the project uses strict TypeScript.

#### Language Tags

Always specify a language for syntax highlighting:

✅ Good: ` ```ts `, ` ```bash `, ` ```vue `
❌ Avoid: ` ``` ` (no language)

#### Code Group

Use `::code-group` for multi-variant examples (package managers, frameworks, etc.):

````markdown
::code-group
```bash [pnpm]
pnpm add @movk/nuxt-docs
```

```bash [npm]
npm install @movk/nuxt-docs
```

```bash [yarn]
yarn add @movk/nuxt-docs
```

```bash [bun]
bun add @movk/nuxt-docs
```
::
````

**Make sure every package manager the project / ecosystem supports is represented.** Check the project's README, `package.json` scripts, or lock files to decide which to include. Common omissions: forgetting newer package managers (such as bun) or accidentally dropping one.

#### Code Group: What Not to Group

**Don't mix terminal commands and config files in one group** — these are separate steps:

❌ Bad (mixing install + config in one group):
````markdown
::code-group
```bash [Terminal]
npm install my-package
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['my-package']
})
```
::
````

✅ Good (separate blocks with transition text):
````markdown
```bash [Terminal]
npm install my-package
```

Add the module to your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['my-package']
})
```
````

**When to use `::code-group`:**
- Package manager variants (pnpm/npm/yarn/bun).
- Framework variants (Vue/React).
- Code + output pairs (`[Code]` / `[Output]`).
- Syntax + AST pairs (`[Syntax]` / `[AST]`).

#### Code Preview

Use `::code-preview` to display rendered output beside the source code. This is ideal for documenting visual features (Markdown syntax, code-block metadata, component rendering):

````markdown
::code-preview
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |

#code
```mdc
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```
::
````

**When to use `::code-preview`:**
- Markdown syntax examples (headings, lists, tables, blockquotes, task lists, emojis).
- Code-block features (filename labels, line highlighting).
- Any feature where rendering adds clarity.

**When not to use `::code-preview`:**
- API/TypeScript code samples (no visual preview).
- Component samples that use unregistered custom components.

---

## File and Directory Naming

### Directory Structure

Documentation sections should follow a numbered pattern:

```
content/
├── en/
│   ├── index.md
│   ├── 1.getting-started/
│   ├── 2.guide/
│   ├── 3.api/
│   └── 4.advanced/
```

**Rules:**
- Directories start with a number for ordering: `1.`, `2.`, `3.`.
- Directory names use kebab-case.
- Names reflect the section content.

### File Naming

**Pattern:** `{number}.{name}.md`

Examples:
- `1.introduction.md`
- `2.installation.md`
- `3.configuration.md`

**Rules:**
- Start with a number for ordering.
- Use kebab-case (lowercase with hyphens).
- Use descriptive names (not `page-1.md` or `doc.md`).

### Navigation Files

**Every section directory must have a `.navigation.yml`:**

```yaml
# 1.getting-started/.navigation.yml
title: Getting started
icon: i-lucide-rocket
```

**Purpose:** controls sidebar display and section metadata.

---

## Common Technical Errors

### 1. Missing `u-` Prefix (most common)

**Error pattern:**
```markdown
::page-hero
#title
Welcome
::
```

**Fix:**
```markdown
::u-page-hero
#title
Welcome
::
```

### 2. Inconsistent Nesting

**Error pattern:**
```markdown
::u-page-section
::::u-button  # Wrong: skipped a nesting level
Close
::::
::
```

**Fix:**
```markdown
::u-page-section
  :::u-button
  Close
  :::
::
```

### 3. Invalid Component Name

**Error pattern:**
```markdown
::u-hero  # Component does not exist
```

**Fix:**
```markdown
::u-page-hero  # Use the correct component name
```

### 4. Missing File Label on a Code Block

**Error pattern:**
````markdown
```typescript
export default defineNuxtConfig({})
```
````

**Fix:**
````markdown
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```
````

### 5. Broken Component Attributes

**Error pattern:**
```markdown
:::u-button color=neutral size=xl
```

**Fix:**
```markdown
:::u-button{color="neutral" size="xl"}
```

---

## Component Documentation Components

When the docs site documents Vue components, the following components are available:

```markdown
<!-- Render a component example (requires an example file under app/components/content/examples/) -->
:component-example{name="MyButton"}

<!-- Auto-generate the props table -->
:component-props{name="MyButton"}

<!-- Auto-generate the slots table -->
:component-slots{name="MyButton"}

<!-- Auto-generate the emits table -->
:component-emits{name="MyButton"}

<!-- Show commit history -->
:commit-changelog{name="MyButton"}

<!-- Show the page's last update time -->
:page-last-commit
```

---

## Validation Checklist

Validate every page against the following:

### Frontmatter
- [ ] `title` and `description` fields are present.
- [ ] `navigation.icon`, when present, starts with `i-`.
- [ ] The `links` array has the correct object structure.
- [ ] No invalid YAML syntax.
- [ ] Use `navigation: false` for pages that should exist as routes but be excluded from the sidebar.

### MDC Components
- [ ] Every Nuxt UI component uses the `u-` prefix.
- [ ] Nesting levels are consistent (`::`, `:::`, `::::`).
- [ ] Component names are valid.
- [ ] Properties use the correct syntax `{key="value"}`.
- [ ] Slot names match the component documentation.
- [ ] `::code-preview` is used for visually renderable examples (Markdown syntax, tables, lists, etc.).

### Code Blocks
- [ ] Language tags are specified (ts, js, vue, bash, etc.).
- [ ] Filename labels exist on every code block that represents a file (not just config files).
- [ ] Code language matches the project's stack (for example, `lang="ts"` on Vue `<script setup>` in TypeScript projects).
- [ ] `::code-group` is used for multi-variant examples (package managers, frameworks, etc.).
- [ ] Package manager `::code-group` blocks cover every supported package manager (check by project / ecosystem).
- [ ] Only equivalent alternatives are grouped — don't mix unrelated steps in `::code-group` (for example install + config).
- [ ] `::code-preview` is used wherever a rendered preview adds clarity.

### File Structure
- [ ] Directories follow the numbered pattern (`1.section/`).
- [ ] Files follow the numbered pattern (`1.page.md`).
- [ ] `.navigation.yml` exists in every section.
- [ ] File and directory names are kebab-case.
