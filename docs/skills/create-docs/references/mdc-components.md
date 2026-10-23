# MDC Component Reference

Movk Nuxt Docs renders Markdown with Nuxt Content (MDC) and Nuxt UI. Three families of components are available.

| Family | MDC name | Prefix |
|--------|----------|--------|
| Nuxt UI components | `u-page-hero`, `u-button`, `u-color-mode-image` | `u-` required |
| Nuxt UI prose components | `note`, `tip`, `code-group`, `card`, `field`, `badge` | no prefix |
| Layer content components | `motion`, `stars-bg`, `commit-changelog`, `page-last-commit`, `component-*` | no prefix |

```markdown
::u-page-hero      Correct: resolves to UPageHero
::page-hero        Wrong: unknown component, renders nothing
::note             Correct: prose component, no prefix
```

Nesting adds one colon per level: `::` → `:::` → `::::`. Props use `{key="value"}` inline or a YAML block between `---` lines; slots use `#slot-name`.

## Documentation sources

- Component list: https://ui.nuxt.com/llms.txt
- Raw component docs: `https://ui.nuxt.com/raw/docs/components/[component].md`
- Prose overview: https://ui.nuxt.com/raw/docs/typography.md
- Headings and text: https://ui.nuxt.com/raw/docs/typography/headers-and-text.md
- Lists and tables: https://ui.nuxt.com/raw/docs/typography/lists-and-tables.md
- Code blocks: https://ui.nuxt.com/raw/docs/typography/code-blocks.md
- Callouts: https://ui.nuxt.com/raw/docs/typography/callouts.md
- Accordion: https://ui.nuxt.com/raw/docs/typography/accordion.md
- Tabs: https://ui.nuxt.com/raw/docs/typography/tabs.md

## Page layout (Nuxt UI, `u-` prefix)

Mostly for the landing page.

| Component | Raw docs | Usage |
|-----------|----------|-------|
| `u-page-hero` | [page-hero.md](https://ui.nuxt.com/raw/docs/components/page-hero.md) | Hero with title, description, links |
| `u-page-section` | [page-section.md](https://ui.nuxt.com/raw/docs/components/page-section.md) | Titled section, `#features` slot |
| `u-page-feature` | [page-feature.md](https://ui.nuxt.com/raw/docs/components/page-feature.md) | Feature item |
| `u-page-grid` | [page-grid.md](https://ui.nuxt.com/raw/docs/components/page-grid.md) | Responsive grid |
| `u-page-card` | [page-card.md](https://ui.nuxt.com/raw/docs/components/page-card.md) | Card with title, description, media |
| `u-page-cta` | [page-cta.md](https://ui.nuxt.com/raw/docs/components/page-cta.md) | Call to action |
| `u-button` | [button.md](https://ui.nuxt.com/raw/docs/components/button.md) | Link button |
| `u-color-mode-image` | [color-mode-image.md](https://ui.nuxt.com/raw/docs/components/color-mode-image.md) | Light / dark image pair |

```markdown
::u-page-section
  :::u-page-grid
    ::::u-page-card{to="/docs/guide/configuration" class="col-span-2 lg:col-span-1"}
    #title
    Configure

    #description
    One file for navigation, theme and integrations.
    ::::
  :::
::
```

## Prose components (no prefix)

### Callouts

```markdown
::note
Extra context.
::

::tip{title="Faster"}
A helpful suggestion.
::

::warning
Something that can break.
::

::caution
Something destructive or irreversible.
::

::callout{icon="i-lucide-info" color="neutral" to="/docs/guide/features"}
Generic callout with a link.
::
```

### Code

````markdown
::code-group
```bash [pnpm]
pnpm add my-package
```

```bash [npm]
npm install my-package
```
::

::code-preview
**Rendered output**

#code
```md
**Rendered output**
```
::

::code-collapse
```ts [long-file.ts]
// long code
```
::

::code-tree{default-value="nuxt.config.ts"}
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```

```ts [app/app.config.ts]
export default defineAppConfig({})
```
::
````

Code block options: a filename label ` ```ts [nuxt.config.ts] `, line highlights ` ```ts {2-3} `, and `mermaid` blocks when `movkNuxtDocs.mermaid` is enabled. The layer replaces Nuxt UI `ProsePre` to add a text copy button; the syntax is unchanged.

### Structure

```markdown
::steps{level="3"}
### Install

Run the install command.

### Configure

Add the configuration.
::

::tabs
  :::tabs-item{label="Vue" icon="i-logos-vue"}
  Vue content
  :::

  :::tabs-item{label="Nuxt" icon="i-logos-nuxt-icon"}
  Nuxt content
  :::
::

::accordion
  :::accordion-item{label="Question?" icon="i-lucide-circle-help"}
  Answer.
  :::
::

::card-group
  :::card{title="Guide" icon="i-lucide-compass" to="/docs/guide/configuration"}
  Card body.
  :::
::

::field-group
  :::field{name="mode" type="'light' | 'dark'" required}
  Field description.
  :::
::
```

Inline: `:badge{label="v3"}`, `:kbd{value="meta"}`, `:icon{name="i-lucide-star"}`, `` `code`{lang="ts"} ``.

## Layer content components

| Component | Needs | Usage |
|-----------|-------|-------|
| `motion` | — | Fade/blur-in wrapper (motion-v); props `initial`, `animate`, `transition` |
| `stars-bg` | — | Decorative star field; props `star-count`, `color`, `size` |
| `page-last-commit` | GitHub config | Last commit for the current page, rendered automatically by the docs page |
| `commit-changelog` | GitHub config, `NUXT_GITHUB_TOKEN` in production | Commit history of a source file; props `name`, `commit-path`, `prefix`, `suffix`, `author`, `casing` |
| `component-props` | `componentDocs` | Props table; `slug` defaults to the last URL segment, `prose` for Prose components, `ignore` |
| `component-slots` | `componentDocs` | Slots table; `slug` |
| `component-emits` | `componentDocs` | Emits table; `slug` |
| `component-example` | `componentDocs` | Renders `app/components/content/examples/[Name].vue` with its source; props `name`, `client-only` |
| `component-code` | `componentDocs` | Interactive playground with generated code; props `name`, `props`, `items`, `slots`, `hide`, `ignore` |

```markdown
::motion{:transition='{"duration":0.6,"delay":0.3}'}
Animated text
::

:commit-changelog{name="useHeader" prefix="composables" suffix="ts"}

:component-props{slug="MyButton"}
```

`componentDocs` means `movkNuxtDocs.componentDocs: true` plus the packages `nuxt-component-meta vue-component-meta prettier`. With it disabled these components render nothing.

## Images

```markdown
![Alt text](/images/diagram.png)

:u-color-mode-image{light="/screenshots/panel-light.png" dark="/screenshots/panel-dark.png" alt="Panel" class="rounded-md" width="1280" height="800"}
```

Always set `alt`. Provide light and dark variants for UI screenshots.

## Full references

- All components: https://ui.nuxt.com/llms.txt
- Full docs for LLMs: https://ui.nuxt.com/llms-full.txt
- Content integration: https://ui.nuxt.com/raw/docs/getting-started/integrations/content.md
- Theme customization: https://ui.nuxt.com/raw/docs/getting-started/theme/components.md
