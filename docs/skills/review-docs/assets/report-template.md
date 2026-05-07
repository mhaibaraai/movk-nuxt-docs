# Documentation Review Report

**Generated:** [date and time]
**Project:** [project name from package.json or directory]
**Content directory:** [actual path]
**Scope reviewed:** [X] pages, [Y] sections

---

## Executive Summary

- **Critical issues:** X (must fix — block deployment or cause errors)
- **Important issues:** Y (significant impact on UX / SEO)
- **Suggested optimizations:** Z (polish and optimization suggestions)

**Overall assessment:** [1–2 sentence summary of documentation quality]

---

## Critical Issues

> Must-fix issues because they cause build errors or break critical functionality.

### [Issue category]

**Priority:** Critical
**Impact:** [Brief explanation of what breaks if this isn't fixed]

#### Issue 1: [Short description]

**File:** [/path/to/file.md:line-number]

**Issue:**
[Detailed description of the problem]

**Current:**
```markdown
[Current problematic code]
```

**Should be:**
```markdown
[Corrected code]
```

**Reason:** [Explain why this is a critical issue]

---

## Important Issues

> Significant impact on user experience or SEO, but they don't directly break functionality.

### Missing Space Between Code and Surrounding Text

**File:** `content/docs/[path]/[page].md:line`

**Current:** `Install the@movk/nuxt-docsdependency`
**Should be:** `Install the @movk/nuxt-docs dependency`

### SEO Issues

#### Issue 1: [Short description]

**File:** [/path/to/file.md]

**Issue:** [Description]

**Current:** [Example]

**Suggestion:** [Specific fix recommendation]

**Impact:** [Impact on SEO or UX]

### Clarity Issues

[Use the same structure]

### Structural Issues

[Use the same structure]

---

## Suggested Optimizations

> Polish and optimization suggestions. Not urgent, but they raise the overall quality.

### SEO Optimizations

- **[file path]:** [suggestion]
- **[file path]:** [suggestion]

### Clarity Improvements

- **[file path]:** consider adding a callout (`::tip`) for [specific content].
- **[file path]:** code examples could be closer to real-world scenarios.

### Structural Enhancements

- **[section]:** consider splitting into subsections for better navigation.
- **[section]:** add cross-references to related pages.

---

### Content Overview

| Section | Pages | Avg. words / page |
|---------|-------|-------------------|
| Getting started | X | ~XXX |
| Guide | X | ~XXX |
| API | X | ~XXX |

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

[List 2–3 things the documentation does well]

- Effective use of callouts and code examples.
- Consistent MDC component usage.
- Clean, well-ordered section structure.
- High-quality SEO metadata on the landing page.

---

## Recommended Action Plan

### Priority 1: Fix Critical Issues (today)

1. Fix every MDC syntax error (missing `u-` prefix).
2. Backfill required frontmatter fields.
3. Repair broken navigation structure.

**Estimated fix:** X files.

### Priority 2: Important Issues (this week)

1. Optimize SEO metadata (title / description).
2. Rewrite passages that lack clarity (passive voice, unclear phrasing).
3. Fix heading hierarchy issues.

**Estimated fix:** X files.

### Priority 3: Suggested Optimizations (next sprint)

1. Add suggested callouts and examples.
2. Strengthen internal links.
3. Make code examples more realistic.
4. Add FAQ-style headings.

**Estimated fix:** X files.

---

## Next Steps

**Would you like me to:**

1. **Fix every critical issue** — I can auto-correct MDC syntax and frontmatter problems.
2. **Rewrite specific sections** — point me to pages that need clarity improvements and I'll rewrite them.
3. **Optimize SEO metadata** — I can normalize every title and description to optimal length.
4. **Restructure content** — if sections need reorganizing, I can help.

**Or tell me which area you'd like to tackle first.**

---

## Appendix: Per-File Detailed Analysis

<details>
<summary>Click to expand the full per-file analysis</summary>

### /1.getting-started/1.introduction.md

**Frontmatter:** ✅ Valid
**MDC syntax:** ✅ No issues
**SEO:** ⚠️ Description too short (85 chars, recommended 120–160)
**Clarity:** ✅ Active voice, clear structure
**Structure:** ✅ Logical flow, includes next-step guidance

**Suggestions:**
- Extend the meta description to 120–160 characters.

---

### /1.getting-started/2.installation.md

[Use the same detailed structure for each file]

</details>
