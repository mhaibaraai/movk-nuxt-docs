# SEO Review Guide

SEO best practices for Movk Nuxt Docs documentation sites.

## Title Optimization (`title`)

### Length Recommendations

| Status | Characters | Notes |
|--------|------------|-------|
| Too short | <30 chars | Insufficient information (e.g. "Configuration") |
| Optimal | 50–60 chars | Best display range in search engines |
| Too long | >70 chars | Search results get truncated |

### Title Quality

✅ Good titles:
- "Configure the AI chat feature"
- "Install the Movk Nuxt Docs theme"
- "Customize theme colors and fonts"

❌ Needs improvement:
- "Configuration" (too short, not descriptive)
- "Documentation" (too generic)
- "Movk Nuxt Docs Complete Installation Configuration Theme Customization Guide" (too long)

### `title` vs. `seo.title`

`title` is used for the page display; `seo.title` is for search engine optimization (the two may differ):

```yaml
---
title: AI Chat                                      # Navigation / page title (short)
seo:
  title: Configure the AI chat assistant for your docs site   # Search engine title (more descriptive)
---
```

---

## Description Optimization (`description`)

### Length Recommendations

| Status | Characters | Notes |
|--------|------------|-------|
| Too short | <80 chars | Search snippet isn't compelling |
| Optimal | 120–160 chars | Best snippet range for search engines |
| Too long | >200 chars | Search results get truncated |

### Description Quality

✅ Good description:
```
Add a built-in AI chat assistant to your docs site, with multi-model switching, FAQ lists, and a customizable UI. Connect to OpenAI, DeepSeek, and other models via AI Gateway.
```

❌ Needs improvement:
```
AI chat feature overview.   ← Too short, no information
```

### Description Writing Guidelines

- Include the page's core keywords.
- Describe the problem the page solves for the user.
- Start with a verb ("Add...", "Learn how to...", "Configure...").
- Each page description should be unique, not duplicated.

---

## Heading Hierarchy (H1–H3)

### Rules

In Movk Nuxt Docs, H1 is rendered automatically from the `title` field; documentation content starts at `##` (H2):

- [ ] Don't use `#` (H1) in the document body.
- [ ] Don't skip levels (`##` → `###`, never `##` → `####`).
- [ ] H2 and H3 headings are descriptive, not generic.
- [ ] Logical flow and nesting.
- [ ] Every heading on a page is unique.

### H1 Requirements

Generic documentation (not using the Movk Nuxt Docs theme) may use H1, but a clear hierarchy is still recommended.

- [ ] **A single H1 per page** (critical for SEO).
- [ ] Matches or relates to the `<title>` tag.
- [ ] Contains the primary keyword.
- [ ] Is descriptive and specific.

### Descriptive Headings

| Generic (avoid) | Descriptive (recommended) |
|-----------------|---------------------------|
| Overview | AI chat feature overview |
| Configuration | Configure the model and API key |
| Examples | Customize the floating input field |
| Options | aiChat configuration options reference |

### Keyword Optimization

H2 and H3 headings should:
- Naturally include relevant keywords.
- Answer user questions (FAQ-style when appropriate).
- Be scannable (users frequently skim headings).

**Example FAQ-style headings:**
- "How do I rotate API keys?"
- "What's the difference between OAuth and JWT?"
- "When should I use server-side rendering?"

---

## URL Structure

### Best Practices
- [ ] Lowercase, separated by hyphens (kebab-case).
- [ ] Descriptive and stable (don't change after publishing).
- [ ] Follow the numbered directory pattern (`1.getting-started/`, `2.guide/`).
- [ ] Match the content hierarchy.
- [ ] Avoid special characters and underscores.

### Examples

✅ Good:
- `/docs/getting-started/installation`
- `/docs/guide/authentication`
- `/docs/api/composables`

❌ Avoid:
- `/docs/getting_started/installation` (underscores)
- `/docs/GetStarted/Installation` (not lowercase)
- `/docs/p/123` (not descriptive)
- `/docs/docs-page` (too generic)

---

## Internal Links

### Strategy
- Link to related documentation pages.
- Use descriptive anchor text (not "click here" or "here").
- Include "Next steps" or "Related" sections.
- Add important links to the frontmatter `links` array.

### Anchor Text Best Practices

| Bad | Better |
|-----|--------|
| Click here | Learn about authentication |
| Read more | Configure OAuth providers |
| See this page | Browse the API reference |
| Docs | Deployment documentation |

### Frontmatter Links

For important related links, use the frontmatter `links` array:

```yaml
---
links:
  - label: "API reference"
    icon: "i-lucide-book"
    to: "/api/reference"
  - label: "GitHub repository"
    icon: "i-simple-icons-github"
    to: "https://github.com/..."
    target: "_blank"
---
```

---

## Image Optimization

### Alt Text
- [ ] Descriptive and specific (not "image" or "screenshot").
- [ ] Naturally includes relevant keywords.
- [ ] Describes the image content for accessibility users.
- [ ] 50–125 characters is optimal.

### Color Mode Images

Always provide light and dark variants:

```markdown
:u-color-mode-image{
  alt="Dashboard showing user analytics"
  light="/images/dashboard-light.png"
  dark="/images/dashboard-dark.png"
  class="rounded-lg"
  width="859"
  height="400"
}
```

### Image Filenames
- Use descriptive kebab-case names.
- Include context: `dashboard-analytics.png` instead of `screenshot-1.png`.

---

## Common SEO Issues

### Duplicate Metadata
❌ Multiple pages share the same title or description.
✅ Each page has unique, descriptive metadata.

### Missing Metadata
❌ No `seo.title` or `seo.description` in frontmatter.
✅ Every page defines SEO metadata.

### Keyword Stuffing
❌ "Movk Nuxt Docs documentation Movk Nuxt Docs theme Movk Nuxt Docs guide"
✅ Natural language with keywords integrated in context.

## Validation Checklist

Run this checklist for every page:

- [ ] Title: 50–60 characters, includes keywords, unique.
- [ ] Description: 120–160 characters, compelling, accurate.
- [ ] Single H1 that matches the title.
- [ ] Heading hierarchy is logical (no skipped levels).
- [ ] H2/H3 headings are descriptive, not generic.
- [ ] URLs are stable, descriptive, lowercase with hyphens.
- [ ] Internal links use descriptive anchor text.
- [ ] Content is 300+ words for substantive pages.
- [ ] Sections are 200–400 words between headings.
- [ ] Images have descriptive alt text.
- [ ] Color mode images include light/dark variants.
