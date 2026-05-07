# Structure and Organization Guide

Guidelines for evaluating documentation structure, organization, and navigation patterns.

## Content Hierarchy

### Recommended Directory Structure

```
content/
├── index.md                      # Landing page (required)
├── 1.getting-started/
│   ├── .navigation.yml
│   ├── 1.introduction.md
│   ├── 2.installation.md
│   └── 3.quick-start.md
├── 2.guide/                      # or 2.concepts/
│   ├── .navigation.yml
│   ├── 1.configuration.md
│   ├── 2.authentication.md
│   └── 3.deployment.md
├── 3.api/                        # If applicable
│   ├── .navigation.yml
│   └── 1.reference.md
├── 4.advanced/                   # Optional
│   ├── .navigation.yml
│   └── 1.customization.md
```

### Depth Guidelines

**Recommended:** at most 3 levels of nesting.
- Level 1: top-level sections (`1.getting-started/`).
- Level 2: pages within a section (`1.introduction.md`).
- Level 3: subsections within a page (H2/H3 headings).

**Avoid:** deep folder nesting (4+ levels) — use H2/H3 headings instead.

## Section Organization

### Standard Section Types

**1. Getting started** (always first)
- Introduction (what and why)
- Installation (prerequisites, commands)
- Quick start / first steps
- Project structure (if applicable)

**2. Guide / Concepts** (core documentation)
- Feature documentation
- Configuration guides
- Integration tutorials
- Best practices

**3. API / Reference** (if applicable)
- Component reference
- Composable reference
- Function reference
- Configuration options

**4. Advanced** (optional)
- Advanced patterns
- Customization guides
- Troubleshooting
- Migration guides

### Pages per Section

**Guidelines:**
- **Minimum:** 2 pages per section (a single-page section should be merged into another).
- **Optimal:** 3–8 pages per section.
- **Maximum:** 15 pages (beyond this, consider splitting into subsections).

**Red flags:**
- Sections with only 1 page.
- Sections with 20+ pages (too broad, hard to navigate).

## Navigation Files

### `.navigation.yml` Structure

Every section directory should have a `.navigation.yml`:

```yaml
title: Getting started
icon: i-lucide-rocket
```

**Required fields:**
- `title`: section display name in the sidebar.
- `icon`: a Lucide icon (format: `i-lucide-{name}`).

### Recommended Icons by Section

| Section | Recommended icons |
|---------|-------------------|
| Getting started | `i-lucide-rocket`, `i-lucide-play` |
| Guide / Concepts | `i-lucide-book-open`, `i-lucide-layers` |
| API / Reference | `i-lucide-code`, `i-lucide-book` |
| Advanced | `i-lucide-settings`, `i-lucide-wrench` |
| Deployment | `i-lucide-cloud`, `i-lucide-upload` |
| Troubleshooting | `i-lucide-alert-circle`, `i-lucide-help-circle` |

## Content Flow

### Logical Progression

Documentation should follow a learning path:

1. **Direction** — What is this? Why use it?
2. **Setup** — How do I install it?
3. **Basics** — How do I use the core features?
4. **Advanced** — How do I customize or extend it?
5. **Reference** — Where do I find detailed API information?

### Page Structure

Every page should follow this pattern:

```markdown
---
frontmatter here
---

# H1 page title (matches the frontmatter title)

Brief introduction (1–2 sentences describing what this page covers).

## First main topic (H2)

Explain the topic (200–400 words).

### Subtopic (H3)

Detailed information.

## Second main topic (H2)

More content.

## Next steps

- Links to related pages.
- Suggested reading order.
```

### Next Steps / Related Content

**Every guide page should include:**
- Links to related documentation.
- Suggested next page.
- Prerequisites or dependencies.

**Example:**

```markdown
## Next steps

- [Configure your theme](/guide/configuration)
- [Add custom components](/guide/customization)
- [Deploy to production](/guide/deployment)

## Related

- [API reference](/api/reference) — Detailed API documentation.
- [Examples](/examples) — Real-world usage examples.
```

## Cross-References

### Internal Links

**Use relative links from the content root:**

✅ Good:
```markdown
Learn more about [authentication](/guide/authentication).
```

❌ Avoid:
```markdown
Learn more about [authentication](../guide/authentication.md).
```

### Linking Patterns

**Inline links** for contextual references:
```markdown
Configure your app by setting [environment variables](/guide/configuration#environment-variables).
```

**Callout links** for important related content:
```markdown
::note
This feature requires authentication. See the [authentication guide](/guide/authentication) for setup instructions.
::
```

**Frontmatter links** for primary related pages:
```yaml
---
links:
  - label: API reference
    to: /api/reference
    icon: i-lucide-book
---
```

## Consistency Checks

### Across Pages

- [ ] Consistent heading style (action-based in guide sections).
- [ ] Similar page structure (introduction → content → next steps).
- [ ] Consistent code-example formatting.
- [ ] Consistent terminology.

### Across Sections

- [ ] All sections have `.navigation.yml`.
- [ ] Numbered directories for consistent ordering.
- [ ] Similar depth levels (avoid 2 levels in one section, 5 in another).
- [ ] Consistent icon style (all Lucide, no mixing).

## Common Structural Issues

### Orphan Pages
- Pages with no incoming links.
- No path from the landing page reaches this page.
- Not included in navigation.

**Fix:** add a link from a parent / related page.

### Redundant Content
- Multiple pages cover the same topic.
- Duplicate information across sections.
- Overlapping content with no clear distinction.

**Fix:** merge or clearly differentiate the purpose.

### Missing Landing Page
- Section without an `index.md`.
- Jumps directly to numbered pages (causing 404 on the section root URL).

**Fix:** add an `index.md` with a section overview. If the page should not appear in the sidebar navigation, use `navigation: false` in frontmatter:

```yaml
---
title: Section name
description: Overview of this section
navigation: false
---
```

This pattern works for section landing pages that act as entry points (for example via redirects or direct URLs) but should not surface in the sidebar.

### Inconsistent Numbering
- Gaps in numbering (1, 2, 4, 5 — where's 3?).
- Duplicate numbers (`1.intro.md`, `1.install.md` in the same directory).

**Fix:** renumber files consistently.

### Poor Information Architecture
- Guide content under the getting-started section.
- Basic setup under the advanced section.
- API reference mixed with tutorials.

**Fix:** reorganize into the appropriate section.

## Landing Page Structure

The main landing page (`index.md`) should include:

1. **Hero section** — project name, tagline, CTA.
2. **Key features** — 3–6 primary features with icons.
3. **Quick start** — minimal example or install command.
4. **Section links** — Getting started, Guide, API.
5. **Optional:** showcase, testimonials, sponsors.

**Example structure:**

```markdown
---
title: Project name
description: Project tagline
---

::u-page-hero
# Hero content
::

::u-page-section
# Features
  :::u-page-grid
  # Feature cards
  :::
::

::u-page-section
# Quick start
# Minimal code example
::
```

## Validation Checklist

- [ ] Landing page (`index.md`) exists at the root.
- [ ] Every section has `.navigation.yml` with title and icon.
- [ ] Numbered directories follow a consistent pattern (`1.`, `2.`, `3.`).
- [ ] Page numbering is consistent within a section.
- [ ] At most 3 hierarchy levels (folders + headings).
- [ ] Each section has 2–15 pages (not 1, not 20+).
- [ ] Pages include "Next steps" or related links.
- [ ] No orphan pages (every page is reachable from navigation).
- [ ] Logical progression (Getting started → Guide → API → Advanced).
- [ ] Consistent heading depth (no lone H4 without an H3).
