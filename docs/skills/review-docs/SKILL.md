---
name: review-docs
description: |
  Review documentation for quality, clarity, SEO, and technical correctness.
  Optimized for Movk Nuxt Docs / Nuxt Content but compatible with any Markdown docs.
  Use when asked to:
  "review docs", "audit documentation", "check documentation",
  "validate MDC syntax", "check SEO issues", "analyze docs structure",
  "improve documentation quality", "verify documentation".
  审查文档的质量、清晰度、SEO 和技术正确性。当被要求时使用：
  "审查文档"、"检查文档"、"审计文档"、"验证 MDC 语法"、
  "检查 SEO 问题"、"分析文档结构"、"改进文档质量"、"分析文档"。
  Provides prioritized, actionable suggestions (Critical / Important / Suggested).
---

# Review Docs

A comprehensive documentation review, optimized for Movk Nuxt Docs / Nuxt Content but compatible with any Markdown documentation.

## Workflow Overview

1. **Detect project type** — Identify Movk Nuxt Docs / Nuxt Content vs. generic Markdown.
2. **Analyze project structure** — Locate the content directory, count pages and sections.
3. **Technical validation** — Check frontmatter, MDC syntax (where applicable), file naming.
4. **Content quality review** — Clarity, SEO, structural organization.
5. **Generate the report** — Provide categorized, actionable suggestions.

### Priority Definitions

- **Critical** — Blocks the build or causes rendering errors (missing frontmatter, MDC syntax errors).
- **Important** — Significantly impacts UX/SEO (poor metadata, passive voice, unclear headings).
- **Suggested** — Nice-to-have polish (add callouts, improve examples, add images).

### Expectations

This skill **only generates a detailed report**. After the review, it offers help fixing the identified issues if requested.

---

## Step 1: Detect the Project Type

**Goal:** determine whether this is a Movk Nuxt Docs / Nuxt Content project or a generic Markdown documentation project.

### Detection Indicators

**Check for Movk Nuxt Docs / Nuxt Content:**

1. **package.json dependencies:**
   - `"@movk/nuxt-docs"` — Movk Nuxt Docs theme
   - `"@nuxt/content"` — Nuxt Content module
   - `"@nuxtjs/mdc"` — MDC support

2. **Configuration files:**
   - `nuxt.config.ts` or `nuxt.config.js` with the `@nuxt/content` module
   - `content.config.ts` — content collection configuration

3. **Content structure:**
   - `content/` or `docs/content/` directory
   - `.navigation.yml` files in subdirectories
   - MDC syntax in Markdown files (`::component-name`)

4. **Project structure:**
   - Numbered directories (`1.getting-started/`, `2.guide/`)
   - Frontmatter with `navigation` and `seo` fields

### Project Type Classification

**Type A: Movk Nuxt Docs / Nuxt Content project**
- All Movk Nuxt Docs specific validations apply.
- MDC component syntax checks (the `u-` prefix requirement).
- Nuxt Content frontmatter structure.
- Navigation files (`.navigation.yml`).
- Full technical validation.

**Type B: Generic Markdown documentation**
- Basic Markdown validation only.
- Generic frontmatter (`title`, `description`, `date`, `author`).
- Standard Markdown syntax.
- Focus on content quality (SEO, clarity, structure).
- No Movk Nuxt Docs specific technical checks.

### Detection Output

After detection, note the following in the report:

```
Project type: [Movk Nuxt Docs/Nuxt Content | Generic Markdown]
Validation mode: [Full (Movk Nuxt Docs specific) | Basic (Markdown only)]
```

**Adjust the validation steps based on the detected type:**
- **Type A (Movk Nuxt Docs):** run every step with full validation.
- **Type B (generic):** skip Movk Nuxt Docs specific checks and focus on content quality.

---

## Step 2: Analyze the Documentation Structure

### Locate the Content Directory

Check these paths in order:
- `docs/content/docs/` (monorepo, most common)
- `content/docs/` (standalone project)
- `app/content/` (alternative location)

### Count Pages

List every `.md` file and group by section:

```
Project: [project name]
Content directory: [path]
Sections:
  - 1.getting-started: [X] pages
  - 2.guide: [X] pages
  - 3.api: [X] pages (if any)
Total: [X] pages
```

### Verify Core Files

Check for required files:
- [ ] `index.md` exists at the root.
- [ ] `.navigation.yml` exists in every section directory.
- [ ] Numbered files follow the pattern (`1.introduction.md`, `2.installation.md`).

### Build a Structure Map

Record the structure for the report:

```
Project: [project-name]
Sections:
  - 1.getting-started: 5 pages, .navigation.yml ✅
  - 2.guide: 8 pages, .navigation.yml ✅
  - 3.api: 3 pages, .navigation.yml ❌ (missing)
```

---

## Step 3: Technical Validation

**Adjust the validation based on the project type detected in Step 1.**

### For Movk Nuxt Docs / Nuxt Content Projects (Type A)

Use [references/technical-checks.md](./references/technical-checks.md) for full technical validation:

**Validate:**

1. **Frontmatter structure** — Required: `title`, `description`. Optional: `navigation`, `seo`, `links`.
2. **MDC component syntax** — Every Nuxt UI component must use the `u-` prefix (`::u-page-hero`, `:::u-button`).
3. **Code block labels** — Code blocks that represent files need descriptive labels (` ```vue [App.vue] `, ` ```ts [config.ts] `).
4. **Code language consistency** — Code samples should match the project's stack (for example, `:lang="ts"` in Vue `<script setup>` for TypeScript projects).
5. **Package manager coverage** — `::code-group` install blocks must cover every package manager the project / ecosystem supports.
6. **Code previews** — Use `::code-preview` for visually renderable examples (tables, lists, rendered Markdown).
7. **Code group scope** — Group only equivalent alternatives (for example package managers or framework variants); do not mix unrelated steps (such as install commands + config files).
8. **File naming** — Numbered directories/files, kebab-case, `.navigation.yml` per section.
9. **Hidden pages** — Use `navigation: false` for pages that should exist as routes but be excluded from the sidebar.

**Common critical errors:**
- Missing `u-` prefix: `::page-hero` → should be `::u-page-hero`.
- Missing required frontmatter: `title`, `description`.
- Invalid `.navigation.yml` structure.
- Missing section `index.md` causing 404s on the section root URL.

See [references/technical-checks.md](./references/technical-checks.md) for the full validation rules, examples, and error patterns.

### For Generic Markdown Projects (Type B)

**Simplified validation** — skip Movk Nuxt Docs specific checks:

**Basic frontmatter validation:**
- Check common fields: `title`, `description`, `date`, `author`, `tags`.
- No strict requirements — these are recommendations.
- Flag completely missing frontmatter.

**Standard Markdown syntax:**
- Validate basic Markdown (headings, lists, links, code blocks).
- Check for broken internal links.
- Verify image paths exist.

**Skip:**
- MDC component syntax (not applicable).
- Nuxt Content frontmatter structure.
- `.navigation.yml` files.
- Movk Nuxt Docs specific conventions.

**Focus on:**
- Content quality (next step).
- SEO optimization.
- Clarity and readability.
- General structure.

---

## Step 4: Content Quality Review

**This step applies to all project types** (Movk Nuxt Docs and generic Markdown).

Evaluate content quality across four dimensions. Refer to the reference files for detailed checklists.

### Clarity Review

Use [references/clarity-checks.md](./references/clarity-checks.md) to check:
- **Tone and voice:** active voice, present tense, second person.
- **Sentence structure:** target 15–20 words, avoid wordy phrases.
- **Paragraph structure:** 2–5 sentences, 200–400 words between headings.
- **Action-based headings:** page titles (H1) and headings (H2/H3) in guides use action verbs (Nuxt convention).
  - Examples: "Create your first module", "Configure your app", "Build a plugin".
  - Exceptions: getting started (nouns), API (function names), concepts (descriptive).
- **Terminology** — consistent naming, defined technical terms.
- **Code examples:** complete, copy-paste-ready, realistic, with file labels.

### SEO Review

Use [references/seo-checks.md](./references/seo-checks.md) to check:
- **Title:** 50–60 characters, contains keywords, unique.
- **Description:** 120–160 characters, compelling, unique.
- **Headings:** single H1, logical hierarchy (H1 → H2 → H3), descriptive.
- **URLs:** kebab-case, descriptive, stable.
- **Links:** descriptive anchors, "Next steps" sections.
- **Content length:** landing 300+ words, guide 400+ words, 200–400 words between sections.
- **Images:** alt text, color-mode variants.

### Structure Review

Use [references/structure-checks.md](./references/structure-checks.md) to check:
- **Hierarchy:** at most 3 levels, logical progression.
- **Organization:** 2–15 pages per section, `.navigation.yml` present, appropriate icons.
- **Flow:** logical progression, "Next steps" links, no orphan pages.
- **Landing page:** hero, features, quick start.
- **Consistency:** similar structure across pages.

---

## Step 5: Generate the Report

Use [assets/report-template.md](assets/report-template.md) to create a comprehensive review report.

**Tailor the report to the project type:**
- **Movk Nuxt Docs / Nuxt Content:** include every section (technical, SEO, clarity, structure).
- **Generic Markdown:** focus on content quality (SEO, clarity, structure) and omit Movk Nuxt Docs specific technical issues.

### Report Structure

```markdown
# Documentation Review Report

**Generated:** [current date and time]
**Project:** [project name from package.json or directory]
**Reviewed:** [X] pages across [Y] sections

---

## Executive Summary

- **Critical issues:** [count] (must fix — block deployment / cause errors)
- **Important issues:** [count] (significant impact on UX/SEO)
- **Suggested optimizations:** [count] (polish and optimization suggestions)

**Overall assessment:** [1–2 sentence summary of documentation quality]

---

## Critical Issues

[All critical issues, grouped by category]

### Technical: MDC syntax errors

#### Nuxt UI component missing the u- prefix

**File:** `/content/1.getting-started/1.introduction.md:15`

**Issue:** the page hero component is missing the `u-` prefix.

**Current:**
\`\`\`markdown
::page-hero
#title
Welcome
::
\`\`\`

**Should be:**
\`\`\`markdown
::u-page-hero
#title
Welcome
::
\`\`\`

**Impact:** the component will not render, causing a build error.

---

### Technical: Missing frontmatter

[Use the same format for each issue]

---

## Important Issues

[All important issues, grouped by category: SEO, clarity, structure]

### SEO: Suboptimal metadata

[File path and recommended changes]

### Clarity: Passive voice

[Examples and recommended rewrites]

### Structure: Poor navigation

[Organizational recommendations]

---

## Suggested Optimizations

[Optimization suggestions, grouped by category]

### SEO optimizations
- **[file]**: [suggestion]

### Clarity improvements
- **[file]**: consider adding a `::tip` callout for [specific content].

### Structural enhancements
- **[section]**: consider splitting into subsections.

---

## Statistics

### Content Overview

| Section | Pages | Avg. words/page |
|---------|-------|-----------------|
| Getting started | [X] | ~[XXX] |
| Guide | [X] | ~[XXX] |

### Issue Breakdown

| Category | Critical | Important | Suggested | Total |
|----------|----------|-----------|-----------|-------|
| Technical | [X] | [X] | [X] | [X] |
| SEO | [X] | [X] | [X] | [X] |
| Clarity | [X] | [X] | [X] | [X] |
| Structure | [X] | [X] | [X] | [X] |
| **Total** | **[X]** | **[X]** | **[X]** | **[X]** |

---

## Positive Highlights

[Call out 2–3 things done well]
- Effective use of callouts and code examples.
- Consistent MDC component usage.
- Well-organized section structure.

---

## Recommended Action Plan

### Priority 1: Fix Critical Issues (today)
1. [Specific actionable item]

**Estimated fix:** [X] files.

### Priority 2: Important Issues (this week)
1. [Specific actionable item]

**Estimated fix:** [X] files.

### Priority 3: Suggested Optimizations (next sprint)
1. [Specific actionable item]

**Estimated fix:** [X] files.

---

## Next Steps

**Would you like me to:**

1. **Fix all critical issues** — I can auto-correct MDC syntax and frontmatter issues.
2. **Rewrite specific sections** — point me at the pages that need clarity improvements and I'll rewrite them.
3. **Optimize SEO metadata** — I can update every title and description to optimal length.
4. **Reorganize content** — if sections need restructuring, I can help reshape them.

**Or tell me which area you'd like to focus on first.**
```

### Report Generation Guidelines

**Be specific:**
- Include exact file paths and line numbers.
- Show current vs. recommended code.
- Explain why each issue matters (the impact).

**Be actionable:**
- Provide clear fix instructions.
- Include code examples.
- Prioritize by impact.

**Be balanced:**
- Highlight positives.
- Don't overwhelm with minor issues.
- Focus on high-impact improvements.

**After the report is generated:**
- Offer help fixing issues if requested.
- Be ready to handle specific categories or files.
- Suggest starting with critical issues.

---

## Quick Reference

**Most common issues:**
- Missing `u-` prefix on Nuxt UI components (`::page-hero` → `::u-page-hero`).
- SEO descriptions too short (need 120–160 characters).
- Passive voice in instructions ("can be done" → "do").
- Generic headings ("Configuration" → "Configure your app").
- Code blocks missing file labels (every block representing a file should have one).
- Code language doesn't match the project stack (for example, missing `lang="ts"` on Vue `<script setup>` in a TypeScript project).
- Incomplete package manager coverage in `::code-group` install blocks (check by ecosystem/project).
- Unrelated steps grouped together in `::code-group` (for example, install command + config file) — keep them as separate blocks.
- Missing `::code-preview` where a rendered preview adds clarity (tables, lists, etc.).
- Missing section landing page → 404 on the section root URL (add an `index.md` with `navigation: false` if needed).

**See the reference files for full checklists and examples.**
