---
name: create-docs
description: |
  Create a complete documentation site for any project.
  Use when asked to:
  "create docs", "add documentation", "set up a docs site", "generate documentation",
  "document this project", "write docs", "initialize docs",
  "add docs folder", "scaffold a documentation site".
  为任何项目创建完整的文档网站。当被要求时使用此技能：
  "创建文档", "添加文档", "建立文档网站", "生成文档",
  "文档化项目", "编写文档", "初始化文档",
  "添加文档文件夹", "创建文档网站"。
  Generates a Movk Nuxt Docs based site with search, dark mode, MCP server, and llms.txt integration.
---

# Create Docs

Generate a complete, production-ready documentation site for any project.

## Workflow

1. **Analyze** — Detect package manager, monorepo layout, and read project context.
2. **Initialize** — Scaffold the docs directory with the right settings.
3. **Generate** — Author documentation pages from templates.
4. **Configure** — Set up AI integration (MCP, llms.txt).
5. **Finalize** — Provide next steps and the correct commands.

---

## Package Manager Reference

Detect from the lock file. Default to npm if no lock file is found:

| Lock file | PM | Install | Run | Add |
|-----------|------|---------|-----|-----|
| `pnpm-lock.yaml` | pnpm | `pnpm install` | `pnpm run` | `pnpm add` |
| `package-lock.json` | npm | `npm install` | `npm run` | `npm install` |
| `yarn.lock` | yarn | `yarn install` | `yarn` | `yarn add` |
| `bun.lockb` | bun | `bun install` | `bun run` | `bun add` |

Use `[pm]` as the placeholder in the commands below.

---

## Step 1: Analyze the Project

### Detect Project Structure

```
Check:
├── pnpm-workspace.yaml   → pnpm monorepo
├── turbo.json            → Turborepo monorepo
├── lerna.json            → Lerna monorepo
├── nx.json               → Nx monorepo
├── apps/                 → apps directory (monorepo)
├── packages/             → packages directory (monorepo)
├── docs/                 → existing documentation (avoid overwriting)
├── README.md             → primary documentation source
└── src/ or lib/          → source code location
```

### Determine the Docs Location

| Project type | Target directory | Workspace entry |
|--------------|------------------|-----------------|
| Standard project | `./docs` | N/A |
| Monorepo with `apps/` | `./apps/docs` | `apps/docs` |
| Monorepo with `packages/` | `./docs` | `docs` |
| Existing `docs/` folder | Ask the user, or use `./documentation` | — |

### Read Context Files

| File | Extract |
|------|---------|
| `README.md` | Project name, description, features, usage examples |
| `package.json` | Name, description, dependencies, repository URL |
| `src/` or `lib/` | Exported functions and composables for API docs |

---

## Step 2: Initialize the Docs

### Create the Directory Structure

```bash
# Full template
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/default my-docs

# Module documentation template
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/module my-module-docs
```

**Full template**

```
[docs-location]/
├── app/
│   └── composables/
│       ├── useCategory.ts       # Navigation category definitions
│       └── useHeader.ts         # Header navigation links
├── content/
│   ├── index.md                 # Landing page
│   └── docs/
│       └── 1.getting-started/
│           ├── .navigation.yml
│           ├── 1.index.md
│           └── 2.installation.md
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .editorconfig
├── .env.example
├── .gitignore
├── .vscode/
│   └── settings.json
├── eslint.config.mjs
├── nuxt.config.ts
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

**Module template**

```
[docs-location]/
├── app/
│   └── composables/
│       ├── useCategory.ts
│       └── useHeader.ts
├── content/
│   ├── index.md
│   ├── releases.yml
│   └── docs/
│       └── 1.getting-started/
│           ├── .navigation.yml
│           ├── 1.index.md
│           └── 2.installation.md
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .env.example
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### Update Monorepo Configuration (if applicable)

#### pnpm Monorepo

1. Add the docs package to the workspace and configure `onlyBuiltDependencies` (required by better-sqlite3):

```yaml [pnpm-workspace.yaml]
packages:
  - 'apps/*'
  - 'docs'

onlyBuiltDependencies:
  - better-sqlite3
```

2. Add a development script to the root `package.json`:

```json [package.json]
{
  "scripts": {
    "docs:dev": "pnpm run --filter [docs-package-name] dev"
  }
}
```

Or use a directory path:

```json [package.json]
{
  "scripts": {
    "docs:dev": "cd docs && pnpm dev"
  }
}
```

#### npm/yarn Monorepo

```json [package.json]
{
  "workspaces": ["apps/*", "docs"],
  "scripts": {
    "docs:dev": "npm run dev --workspace=docs"
  }
}
```

---

## Step 3: Generate Documentation

Use the templates in [references/templates.md](./references/templates.md).

**Critical: MDC component naming**

Every Nuxt UI component used inside MDC must keep the `u-` prefix:

| Correct | Incorrect |
|---------|-----------|
| `::u-page-hero` | `::page-hero` |
| `::u-page-section` | `::page-section` |
| `:::u-page-feature` | `:::page-feature` |
| `:::u-button` | `:::button` |
| `::::u-page-card` | `::::page-card` |

Without the `u-` prefix, Vue cannot resolve these components.

### Documentation Layout

```
content/
├── index.md                        # Landing page
├── 1.getting-started/
│   ├── .navigation.yml
│   ├── 1.introduction.md
│   └── 2.installation.md
├── 2.guide/
│   ├── .navigation.yml
│   ├── 1.configuration.md
│   ├── 2.authentication.md
│   └── 3.deployment.md
└── 3.api/                          # If applicable
    ├── .navigation.yml
    └── 1.reference.md
```

### Page Generation

1. **Landing page** (`index.md`) — Hero + feature grid.
2. **Introduction** — What and why, plus use cases.
3. **Installation** — Prerequisites and install commands.
4. **Guide pages** — Feature documentation with action-oriented H2 headings.

For writing style, see [references/writing-guide.md](./references/writing-guide.md).
For MDC components, see [references/mdc-components.md](./references/mdc-components.md).

---

## Step 4: Configure AI Integration

Movk Nuxt Docs ships with the MCP server (`/mcp`) and llms.txt generation enabled by default. No configuration is required.

**Do not add an "AI Integration" section to the landing page.** These features work automatically.

Optionally mention them on the introduction page:

```markdown
::note
This documentation includes AI integration through an MCP server and automatic `llms.txt` generation.
::
```

Load [references/configuration.md](./references/configuration.md) for detailed configuration options.

---

## Step 5: Author Agent Skills (Advanced)

When the project has specific workflows (code review, release process, content style checks, etc.), author Agent Skills for the docs site so AI agents can understand and execute those workflows directly. Skills are auto-published to the `/.well-known/skills/` endpoint, and tools such as Claude Code and Cursor can discover and load them automatically.

### Directory Structure

Create a `skills/` folder under the docs directory:

```
[docs-location]/
└── skills/
    └── my-skill/
        ├── SKILL.md          # Required: frontmatter + workflow description
        ├── references/       # Optional: detailed reference docs
        │   └── checklist.md
        └── assets/           # Optional: templates and example assets
            └── template.md
```

### SKILL.md Template

```markdown
---
name: my-skill
description: |
  One-sentence description of what this skill does.
  Use when asked to:
  "trigger phrase 1", "trigger phrase 2", "trigger phrase 3".
---

# My Skill

A brief statement of the skill's goal and where it applies.

## Workflow

1. **Step One** — What to do.
2. **Step Two** — What to do.
3. **Step Three** — What to do.

---

## Step One

Detailed instructions...
```

### Frontmatter Fields

| Field | Required | Description |
|------|------|------|
| `name` | Yes | kebab-case, must match the directory name exactly, ≤64 characters |
| `description` | Yes | Functional description plus trigger phrases. The AI uses these phrases to decide when to invoke the skill. |

**Trigger-phrase style:**

```yaml
description: |
  Review Vue component code for performance, accessibility, and best practices.
  Use when asked to:
  "review component", "check the code", "code review",
  "audit Vue", "analyze component quality".
```

### Reference File Organization

Keep the main `SKILL.md` lean (≤500 lines). Put detailed rules, checklists, and templates under `references/`, then link to them from the main file:

```markdown
See [references/checklist.md](./references/checklist.md) for details.
```

### Naming Validation

- [x] Directory name matches the `name` field exactly.
- [x] Lowercase letters, digits, and hyphens only.
- [x] Does not start or end with a hyphen.
- [x] No consecutive hyphens (`--`).
- [x] Length ≤64 characters.

### Full Example: `release-check`

```markdown
---
name: release-check
description: |
  Verify the project meets release criteria before publishing.
  Use when asked to:
  "check release readiness", "prepare a release", "release check",
  "validate release", "pre-release check".
---

# Release Check

Ensure the project meets every quality requirement before release.

## Workflow

1. **Code quality** — Run lint and type checks.
2. **Version number** — Verify the version field is updated.
3. **Changelog** — Confirm CHANGELOG entries exist.
4. **Build verification** — Run the production build and verify the output.

---

## Step 1: Code Quality

Run the following commands and confirm they all pass:

\`\`\`bash
pnpm lint
pnpm typecheck
\`\`\`

## Step 2: Version Number

Check that the `version` field in `package.json` matches the release version.

## Step 3: Changelog

Confirm `CHANGELOG.md` has an entry at the top for the current version with all major changes.

## Step 4: Build Verification

\`\`\`bash
pnpm build
\`\`\`

After a successful build, confirm the `.output/` directory is not empty.
```

---

## Step 6: Finalize

Provide instructions using the detected package manager.

### Standard Project

```
Documentation created at [docs-location]

To start:

  cd [docs-location]
  [pm] install
  [pm] run dev

Available at http://localhost:3000
```

### Monorepo

```
Documentation created at [docs-location]

From the repo root:

  [pm] install
  [pm] run docs:dev

Or from the docs directory:

  cd [docs-location]
  [pm] run dev

Available at http://localhost:3000
```

### Included Features

- Full-text search
- Dark mode
- MCP server for AI tools (`/mcp`)
- LLM integration (`/llms.txt`)
- SEO optimization
- GitHub integration
- Automatic component documentation

### Next Steps

1. Review the generated content.
2. Verify frontmatter completeness.
3. Check MDC syntax correctness.
4. Evaluate content clarity and SEO.
5. Validate structure and navigation.
6. Deploy to Vercel / Netlify / Cloudflare.

### Suggested Follow-ups

After the docs are created, suggest enhancements:

```
Your documentation is ready!

Would you like me to:
- **Customize the UI** — match your brand colors and style
- **Enhance the landing page** — add feature cards, code previews, visual polish
- **Set up deployment** — deploy to Vercel, Netlify, or Cloudflare

Let me know what you'd like to improve!
```

---

## Deployment

| Platform | Command | Output |
|----------|---------|--------|
| Vercel | `npx vercel --prod` | Auto-detected |
| Netlify | `[pm] run generate` | `.output/public` |
| Cloudflare Pages | `[pm] run generate` | `.output/public` |
| GitHub Pages | `[pm] run generate` | `.output/public` |

---

## Example: auth-utils

**Detected:** pnpm monorepo, packages live under `packages/`.

**Generated structure:**
```
docs/
├── content/
│   ├── index.md
│   ├── 1.getting-started/
│   │   ├── .navigation.yml
│   │   ├── 1.introduction.md
│   │   └── 2.installation.md
│   ├── 2.guide/
│   │   ├── .navigation.yml
│   │   ├── 1.authentication.md
│   │   ├── 2.oauth-providers.md
│   │   └── 3.sessions.md
│   └── 3.api/
│       ├── .navigation.yml
│       └── 1.composables.md
├── public/
│   └── favicon.ico
├── package.json
└── .gitignore
```

**In `authentication.md`** (action-oriented H2 headings):
```markdown
## Add basic authentication
## Protect your routes
## Handle login redirects
## Customize sessions
```
