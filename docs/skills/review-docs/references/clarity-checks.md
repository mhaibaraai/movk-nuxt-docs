# Clarity Review Guide

Evaluate the clarity and readability of Movk Nuxt Docs content.

## Writing Conventions

### Punctuation

Use straight ASCII punctuation. Common errors to flag:

| Case | Correct | Incorrect |
|------|---------|-----------|
| Comma | Install, configure | Install，configure |
| Period | Configuration complete. | Configuration complete。 |
| Colon | Description: | Description： |
| Question mark | How do I use it? | How do I use it？ |
| Exclamation mark | Note! | Note！ |
| Quotes | Use straight `"quotes"` or `'apostrophes'` | Curly “quotes” mixed with straight |

Use the Oxford comma in lists of three or more items: `components, themes, and layouts`.

### Spacing

Add a single space after sentence-ending punctuation. No space between numbers and units:

✅ `Width is 16px` — not `Width is 16 px`.

Add a space between an inline code identifier and surrounding text:

✅ `Install the @movk/nuxt-docs dependency.`
❌ `Install the@movk/nuxt-docsdependency.`

✅ `The default port is 3000.`

### Proper Noun Capitalization

| Correct | Common errors |
|---------|---------------|
| Nuxt | nuxt, NUXT |
| TypeScript | typescript, Typescript |
| Vue.js | vue.js, VueJS |
| GitHub | github, Github |
| Tailwind CSS | tailwindcss, TailwindCSS |
| Markdown | markdown |
| MDC | mdc |
| pnpm | PNPM, Pnpm |

---

## Tone and Voice

### Active Voice
✅ Good: "Configure your app by adding..."
❌ Avoid: "The app can be configured by adding..."

### Present Tense
✅ Good: "The server handles the request..."
❌ Avoid: "The server will handle the request..."

### Second Person
✅ Good: "You can customize the theme..."
❌ Avoid: "Users can customize the theme..."

## Sentence Structure

**Target:** 15–20 words per sentence.
**Maximum:** 25 words before a sentence is flagged for review.

Examples:
- Too long (32 words): "When you want to configure your app to use authentication with an OAuth provider, you should first install the required dependencies and then configure your environment variables."
- Better (split into two): "First, install the required dependencies for OAuth. Then, configure your authentication environment variables."

## Paragraph Structure

**Guidelines:**
- 2–5 sentences per paragraph.
- One main idea per paragraph.
- 200–400 words between headings.

## Action-Based Headings

### Best Practice: Follow the Nuxt Pattern

Modern documentation (such as [Nuxt](https://nuxt.com/docs)) consistently uses **action verbs** in guide and tutorial pages. This makes documentation scannable and task-oriented.

### When to Use Action Verbs

**Page titles (H1)** — for:
- Guide pages: "Create your first module", "Build a custom plugin".
- Tutorial pages: "Deploy your app", "Set up authentication".
- How-to pages: "Add dark mode", "Configure environment variables".
- Recipe pages: "Implement realtime updates".

**Headings (H2/H3)** — for:
- All steps in guides and tutorials.
- Sequential operations.
- Configuration sections.
- Implementation details.

### When to Use Nouns (Exceptions)

- **File names:** always remain nouns / kebab-case (`1.introduction.md`, `2.installation.md`).
- **Getting-started titles:** "Introduction", "Installation", "Quick start" (orientation pages).
- **API reference pages:** use the function / component name ("useSession", "Button", "defineNuxtConfig").
- **Concept pages:** nouns work when explaining theory ("Architecture", "Core concepts", "Best practices").

### Action Verb Examples

| Category | Verbs |
|----------|-------|
| Primary | create, build, use, develop, run, publish, add, configure, set up, enable, connect |
| Secondary | handle, customize, deploy, implement, integrate, install, define, write, test, debug, update |

### Real Examples (Nuxt Pattern)

**Page title (H1):**
```markdown
# Create your first module
```

**Section heading (H2):**
```markdown
## Create the module
## Use the starter template
## Develop your module
```

**Subsection heading (H3):**
```markdown
### Run the tests
### Build your module
### Publish to npm
```

### Bad vs. Good Examples

| Static / noun (avoid) | Action-based (use) |
|-----------------------|--------------------|
| Configuration | Configure your app |
| Module creation | Create a new module |
| Database setup | Connect to a database |
| Route protection | Protect your routes |
| Session management | Handle user sessions |
| Error handling | Handle errors gracefully |
| Testing | Run your tests |
| Deployment | Deploy to production |

## Terminology Consistency

**Check for:**
- Alternating between "config" and "configuration".
- Switching between "app" and "application".
- Inconsistent capitalization ("nuxt" vs. "Nuxt").
- Mixed terminology for the same concept.

**Verify:**
- Technical terms are defined on first use.
- Terms are named consistently.
- Product-specific terminology is used systematically.

## Code Examples

### Quality Checklist
- [ ] Complete and copy-paste-ready (not snippets).
- [ ] Filename labels on every code block representing a file (for example, ` ```vue [App.vue] `, ` ```ts [server.ts] `, ` ```tsx [App.tsx] `).
- [ ] Code language matches the project's stack (for example, TypeScript when the project uses TypeScript).
- [ ] Comments explain non-obvious logic.
- [ ] Realistic variable names (not foo/bar).
- [ ] Working code (no placeholder values such as `YOUR_API_KEY`).
- [ ] Consistent indentation and style.

### Multi-Package-Manager Support

Always use `::code-group` for installation commands to cover **every package manager the project / ecosystem supports**:

```markdown
::code-group
```bash [pnpm]
pnpm add package-name
```

```bash [npm]
npm install package-name
```

```bash [yarn]
yarn add package-name
```

```bash [bun]
bun add package-name
```
::
```

Check the project's README, lock files, or existing docs to decide which package managers to include. Make sure none are missing — the most commonly forgotten ones are newer entrants.

### Showing Rendered Output

Use `::code-preview` to show rendered output beside the source code. This is ideal for documenting visual features (Markdown syntax, code-block metadata, component rendering):

```markdown
::code-preview
- Task 1
- [x] Task 2 (completed)

#code
```mdc
- Task 1
- [x] Task 2 (completed)
```
::
```

### Code Group Best Practices

**Use `::code-group` for:**
- Package manager install variants (pnpm/npm/yarn/bun).
- Framework variants (Vue / React side by side).
- Code + output pairs.
- Syntax + AST pairs.

**Don't use `::code-group` to mix unrelated steps:**
- Terminal install commands and config file edits — these are sequential operations, not equivalent alternatives. Keep them as separate blocks with transition text in between.

## Common Clarity Issues

### Passive Voice in Instructions
❌ "The file should be created in the root directory."
✅ "Create the file in the root directory."

### Wordy Phrases
| Wordy | Concise |
|-------|---------|
| In order to | To |
| It is important to note | Note: |
| At this point in time | Now |
| Due to the fact that | Because |

### Vague Pronouns
❌ "This allows you to..."
✅ "This configuration allows you to..."

### Unexplained Jargon
❌ "Use SSR for better performance."
✅ "Use server-side rendering (SSR) for better performance."
