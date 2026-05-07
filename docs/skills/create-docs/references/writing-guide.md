# Writing Guide

Guidelines for authoring documentation content effectively.

## Writing Conventions

### Punctuation

Use straight ASCII punctuation in English documentation:

| Case | Correct | Incorrect |
|------|---------|-----------|
| Comma | Content, description | Content，description |
| Period | Done. | Done。 |
| Colon | Configure: | Configure： |
| Semicolon | First; second | First；second |
| Question mark | How do I use it? | How do I use it？ |
| Exclamation mark | Note! | Note！ |
| Quotes | Use straight `"quotes"` or `'apostrophes'` | Curly “quotes” mixed with straight |

Use the Oxford comma in lists of three or more items: `themes, layouts, and components`.

### Spacing

Add a single space after sentence-ending punctuation. No space between numbers and units:

```markdown
Correct: Width is 16px
Incorrect: Width is 16 px

Correct: Port defaults to 3000
Incorrect: Port defaults to 3 000
```

Add a space between an inline code identifier and surrounding text:

```markdown
Correct: Install the `@movk/nuxt-docs` package.
Incorrect: Install the`@movk/nuxt-docs`package.
```

### Proper Nouns

Preserve correct capitalization:

| Correct | Incorrect |
|---------|-----------|
| Nuxt | nuxt / NUXT |
| TypeScript | typescript / Typescript |
| Vue.js | vue.js / VueJS |
| GitHub | github / Github |
| Tailwind CSS | tailwindcss / TailwindCSS |
| Markdown | markdown |
| MDC | mdc |

### Contractions

Use contractions for a natural, friendly tone (`it's`, `you're`, `don't`). Avoid them in formal API references where precision matters.

---

## Table of Contents

- [Action-Based Content](#action-based-content)
- [Page Titles](#page-titles)
- [Tone and Voice](#tone-and-voice)
- [Code Examples](#code-examples)

---

## Action-Based Content

Use action verbs in **H2/H3 headings** to make pages scannable and task-oriented.

| Static heading | Action-based heading |
|----------------|----------------------|
| Configuration | Configure your app |
| Database setup | Connect to a database |
| Route protection | Protect your routes |
| Session management | Handle user sessions |
| Error handling | Handle errors gracefully |
| Deployment | Deploy your app |

### Action Verbs to Use

**Primary:** add, configure, create, set up, enable, connect, handle, customize, deploy, use

**Secondary:** build, implement, integrate, install, define, write, run, test, debug, update

---

## Page Titles

Different sections use different title styles:

| Section | Style | Example |
|---------|-------|---------|
| Getting started | Noun | Introduction, Installation, Quick start |
| Guide | Topic | Authentication, Configuration, Deployment |
| API | Function / component name | useSession, fetchData, Button |
| Recipe | Action phrase | Add dark mode, Deploy to Vercel |

Action style lives in **content headings**, not in page titles or file names.

---

## Tone and Voice

### Do

- Use the **active voice** and **present tense**.
- Write in the **second person** ("you can", "your project").
- Be **direct** and **actionable**.
- Start sentences with **action verbs** when possible.

### Examples

| Passive / verbose | Active / direct |
|-------------------|-----------------|
| Configuration can be done by... | Configure your app via... |
| It is recommended to... | We recommend... |
| The file should be created in... | Create the file in... |
| Authentication is handled by... | Handle authentication with... |

---

## Code Examples

### File Path Labels

Always add a file path label to code blocks:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
})
```

### Multi-Package-Manager Examples

Use `::code-group` and put the **detected package manager first**:

```md
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

### Best Practices

- Include **valid, copy-paste-ready** examples.
- Show **complete** code, not snippets.
- Add **comments** for non-obvious logic.
- Use **realistic** variable names.
