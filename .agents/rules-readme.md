# Rules - Best Practices Guide

**Source of Truth:** This directory contains all project rules synchronized to AI agents.

## Character Target

**Target:** keep rule files under ~12,000 characters. This is a **Cursor
performance recommendation**, NOT a hard limit — it is not enforced by any hook
or CI gate.

**Why?** Based on Cursor's ~500-line recommendation and cross-platform behavior:

- Cursor: 500 lines recommended (perf)
- Claude Code: No hard limit, but concise is better
- Gemini CLI: Performance degrades with large files
- Antigravity: Focused rules work best
- Copilot (VSCode): Follows Cursor-like limits

**Intentional exceptions:** the `lidr-sdlc/` governance rules (`workflows`,
`tech-stack`, `documentation`, `org`, `project`, `spec-execution`) and
`product/roadmap` are comprehensive references that exceed the target by design
and load path-scoped/on-demand. Do **not** fragment them — see the
"Rules Character Target" section in the orchestrator (`CLAUDE.md`) for the full
list and rationale. Author **new** generic rules to stay under the target.

**Check file size:**

```bash
# Count characters in a rule
wc -c .agents/rules/category/rule-name.md

# List rules over the target (the lidr-sdlc governance set is expected)
find .agents/rules -name "*.md" -type f -exec wc -c {} + | awk '$1 > 12000 {print $1, $2}'
```

## YAML Frontmatter

### Platform Support Matrix

All rules in `.agents/rules/` should use universal YAML frontmatter that works across all platforms:

Verified against official docs (May 2026). `⚠️` = field is non-standard but harmlessly ignored by the platform.

| Field           | Cursor     | Claude Code               | Gemini CLI                | Antigravity | Copilot (VSCode)                      |
| --------------- | ---------- | ------------------------- | ------------------------- | ----------- | ------------------------------------- |
| `name`          | ⚠️ ignored | ❌                        | ❌                        | ❌          | ⚠️ ignored                            |
| `description`   | ✅         | ❌ (uses CLAUDE.md prose) | ❌ (uses GEMINI.md prose) | ❌          | ✅ (shown in UI)                      |
| `alwaysApply`   | ✅         | ❌                        | ❌                        | ❌          | ❌                                    |
| `globs`         | ✅         | ❌                        | ❌                        | ❌          | ❌ (adapter converts → `applyTo`)     |
| `trigger`       | ❌         | ❌                        | ❌                        | ✅          | ❌                                    |
| `argument-hint` | ❌         | ✅                        | ✅                        | ❌          | ❌                                    |
| `paths`         | ❌         | ✅                        | ❌                        | ❌          | ❌                                    |
| `applyTo`       | ❌         | ❌                        | ❌                        | ❌          | ✅ (required by GitHub Cloud Copilot) |

**Source references:**

- Cursor schema: https://cursor.com/docs/context/rules (only `description`/`alwaysApply`/`globs`)
- Claude path-scoped rules: https://code.claude.com/docs/en/memory
- Copilot custom instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- Gemini context files: https://geminicli.com/docs/cli/gemini-md/

### Universal Format (Recommended)

Use this format in `.agents/rules/` source files for maximum compatibility:

```yaml
---
name: rule-name # Non-standard. Harmlessly ignored. Kept for legacy compatibility.
description: Brief description # Cursor + Copilot use this — recommended
alwaysApply: false # Cursor (optional)
globs: ["**/*.ts"] # Cursor (optional). Adapter converts to applyTo for Copilot.
paths: ["src/**/*.ts"] # Claude (optional) — path-scoped rule loading
argument-hint: <file-pattern> # Claude/Gemini (optional)
trigger: always_on # Antigravity (optional)
---
```

**Example:**

```yaml
---
name: react-components
description: React component standards
alwaysApply: false
globs: ["src/components/**/*.tsx"]
argument-hint: <component-file>
paths: ["src/components/**/*.tsx"]
trigger: always_on
---
# React Component Standards

All components must use functional components...
```

### Field Definitions

**name** (legacy, non-standard)

- **Type:** String
- **Required:** No (not in any official platform schema as of May 2026)
- **Description:** Internal identifier. Per [Cursor docs](https://cursor.com/docs/context/rules) the schema is only `description`/`alwaysApply`/`globs`. Field is preserved in sources for human readability and search-by-name but no platform requires or enforces it.
- **Example:** `"react-components"`

**description**

- **Type:** String
- **Required:** No, recommended (shown in Cursor/Copilot UI when present)
- **Description:** Brief summary
- **Example:** `"React component standards"`

**alwaysApply** (Cursor)

- **Type:** Boolean
- **Required:** No (defaults to `false`)
- **Behavior (per Cursor docs):**
  - `true` → rule always in context; `description`/`globs` ignored
  - `false` + `globs` → auto-attached when matching file in context
  - `false` + `description` → agent decides when to apply
  - `false` + neither → only on `@rule-name` mention

**globs** (Cursor)

- **Type:** String (comma-separated) or array of strings
- **Required:** No
- **Description:** File-matching glob. Cursor uses this directly. Copilot adapter converts to `applyTo` (defaults to `**` when absent).
- **Example:** `["src/**/*.tsx", "src/**/*.ts"]`

**paths** (Claude Code)

- **Type:** Array of strings
- **Required:** No
- **Description:** Path-scoped rule loading per [Claude memory docs](https://code.claude.com/docs/en/memory). Rules without `paths` load at launch.
- **Example:** `["src/api/**/*.ts"]`

**applyTo** (Copilot/VSCode)

- **Type:** String (glob, optionally comma-separated)
- **Required:** Yes for GitHub Cloud Copilot, optional for VSCode
- **Description:** Files this instruction applies to. Adapter auto-generates from source `globs` or defaults to `**`.
- **Example:** `"src/**/*.ts"`

**argument-hint** (Claude/Gemini)

- **Type:** String
- **Required:** No
- **Description:** Placeholder text for slash-command arguments
- **Example:** `"<api-file>"`

**trigger** (Antigravity)

- **Type:** String
- **Required:** No
- **Values:** `always_on` (others undocumented)
- **Example:** `"always_on"`

### Platform-Specific Behavior

**Cursor (.md / .mdc format):**

- Per [Cursor docs](https://cursor.com/docs/context/rules), both `.md` and `.mdc` extensions are supported and subdirectories are allowed. The adapter still converts `.md` → `.mdc` and flattens for simplicity, but neither is a hard requirement.
- `name` is **non-standard** — harmlessly ignored. The documented schema is only `description`/`alwaysApply`/`globs` (all optional). Source files keep `name:` for legacy readability; Cursor does not require it.
- Extracts: `description`, `alwaysApply`, `globs` (and tolerates the legacy `name`)
- Flattened structure (adapter default): `code/principles.md` → `principles.mdc`
- `alwaysApply: true` = always active, `false` = intelligent application
- **Ignores:** `argument-hint`, `paths`, `trigger` (safe to include)

**Claude Code (.md format):**

- Uses symlinks to `.agents/rules/` (supports subdirectories)
- Reads: `description`, `argument-hint`, `paths`
- Ignores Cursor-specific fields

**Gemini CLI:**

- No native rules support
- Index file (`.gemini/GEMINI.md`) generated with links to rules
- See `.gemini/GEMINI.md` for categorized rule index

**Antigravity (.md format):**

- Reads natively from `.agents/rules/` (no copy or symlink needed)
- Reads: `trigger`
- Very minimal YAML requirements

**Copilot/VSCode (.instructions.md format):**

- ⚠️ **Extension MUST be `.instructions.md`** (sync script auto-converts)
- Per [VSCode docs](https://code.visualstudio.com/docs/copilot/customization/custom-instructions), the rules location is `.github/instructions/` and **recursive subdirectories are supported**. The adapter flattens for simplicity but subdirectories are not prohibited.
- Extracts: `description`, transforms `globs` → `applyTo` (defaults to `"**"` when `globs` absent; required by GitHub Cloud Copilot)
- Flattened structure (adapter default): `code/principles.md` → `principles.instructions.md`
- **Ignores:** `name`, `alwaysApply`, `paths`, `trigger`, `argument-hint`
- Also generates `.github/copilot-instructions.md` index file

### YAML Best Practices

**✅ Always include universal fields:**

```yaml
---
name: my-rule # Legacy, non-standard — harmlessly ignored by all platforms
description: Rule description # For all platforms
alwaysApply: false # For Cursor
globs: ["**/*.ts"] # For Cursor
argument-hint: <file> # For Claude/Gemini
paths: ["src/**/*.ts"] # For Claude
trigger: always_on # For Antigravity
---
```

**✅ Keep descriptions consistent:**

- Use the same `description` text across all fields
- Make it concise (1-2 sentences max)
- Focus on when the rule applies

**✅ Test on all platforms:**
After creating a rule, verify it works on:

- [ ] Cursor (check in settings UI)
- [ ] Claude Code (verify with `/memory`)
- [ ] Gemini CLI (check `.gemini/GEMINI.md` index)
- [ ] Antigravity (check in Customizations panel)
- [ ] Copilot/VSCode (check `.github/instructions/` and `.github/copilot-instructions.md`)

**❌ Don't create platform-specific files:**

- Avoid: `api-standards.cursor.md`, `api-standards.antigravity.md`
- Instead: Use universal format with all fields

## Structure Best Practices

### ✅ One Topic Per File

**Good:**

```
.agents/rules/
├── code/
│   ├── principles.md      # Core principles only
│   └── style.md           # Code style only
├── frameworks/
│   └── react-native.md    # React Native patterns
└── process/
    ├── git-workflow.md    # Git workflow only
    └── documentation.md   # Docs standards only
```

**Bad:**

```
.agents/rules/
└── everything.md          # ❌ Mixed topics, hard to maintain
```

### ✅ Descriptive Naming

**Good:**

- `react-native.md` - Clear technology reference
- `third-party-security.md` - Specific security scope
- `copywriting.md` - Clear content focus

**Bad:**

- `misc.md` - ❌ Vague, unclear content
- `stuff.md` - ❌ No indication of content
- `temp.md` - ❌ Suggests temporary, confusing

### ✅ Organized by Category

Group related rules in subdirectories:

- `code/` - Code style and principles
- `content/` - Copywriting and content guidelines
- `design/` - Design and UI standards
- `frameworks/` - Framework-specific patterns
- `process/` - Workflows and processes
- `quality/` - Testing and quality standards
- `team/` - Team conventions and policies
- `tools/` - Tool usage and configuration

## Content Best Practices

### ✅ Be Specific and Concrete

**Good:**

```markdown
## Button States

Buttons need visible focus states:

- Use `focus-visible:ring-2 ring-blue-500`
- Never `outline-none` without replacement
- Test with keyboard navigation (Tab key)
```

**Bad:**

```markdown
## Accessibility

Make things accessible. Follow best practices.
```

### ✅ Include Examples

**Good:**

```markdown
## Commit Messages

Format: `type: Brief summary (50 chars max)`

**Good examples:**

- `feat: Add user authentication`
- `fix: Resolve memory leak in cache`
- `docs: Update API reference`

**Bad examples:**

- `update` - ❌ No context
- `fixed bug` - ❌ Not descriptive
```

**Bad:**

```markdown
## Commit Messages

Follow conventional commits format.
```

### ✅ Avoid Ambiguity

**Good:**

```markdown
## Image Optimization

All images must include:

1. Explicit `width` and `height` attributes
2. `alt` text describing the image (or `alt=""` if decorative)
3. `loading="lazy"` for below-fold images
```

**Bad:**

```markdown
## Images

Images should be optimized and accessible.
```

### ✅ Use Active Voice

**Good:**

```markdown
- Create tests before implementing features
- Use TypeScript for type safety
- Run linter before committing
```

**Bad:**

```markdown
- Tests should be created before features
- Type safety can be achieved with TypeScript
- The linter should be run before commits
```

### ✅ Actionable Instructions

**Good:**

```markdown
## Form Validation

1. Validate on `onBlur` for fields
2. Show inline errors next to inputs
3. Focus first invalid field on submit
4. Disable submit button during request
```

**Bad:**

```markdown
## Forms

Forms are important and should work well. Make sure they're validated properly.
```

## Format Guidelines

### ✅ Consistent Structure

All rule files should follow this template:

````markdown
---
name: rule-name
description: Brief description
alwaysApply: false
globs: ["**/*.ts"]
argument-hint: <file>
paths: ["src/**/*.ts"]
trigger: always_on
---

# Rule Title

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Critical Section

Critical rules here.

### Section 1

Content with examples.

## Anti-patterns (if applicable)

Common mistakes to avoid.

## Output Format

Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/example.ts

src/example.ts:12 - issue description
src/example.ts:34 - another issue

## src/other.ts

✓ pass
```
````

State issue + location. Skip explanation unless fix non-obvious. No preamble.

````

### ✅ Use Lists for Multiple Items

**Good:**
```markdown
## Required Fields

All API endpoints must include:
- Input validation (Zod schemas)
- Error handling (try/catch)
- Rate limiting (public endpoints)
- OpenAPI documentation
````

**Bad:**

```markdown
## Required Fields

All API endpoints must include input validation, error handling, rate limiting, and OpenAPI documentation.
```

### ✅ Code Blocks with Language

**Good:**

````markdown
```typescript
interface User {
  id: string;
  name: string;
}
```
````

**Bad:**

````markdown
```
interface User {
  id: string;
  name: string;
}
```
````

### ✅ Headers for Navigation

Use hierarchical headers (H2, H3, H4) for scannable structure:

```markdown
# Main Title (H1 - once per file)

## Major Section (H2)

### Subsection (H3)

#### Detail (H4 - use sparingly)
```

## Platform Compatibility

### Character Encoding

- Use UTF-8 encoding
- Avoid special characters that may not render correctly
- Test on all platforms (Cursor, Claude, Gemini, Antigravity, Copilot)

### Line Endings

- Use Unix line endings (LF, not CRLF)
- Configure git: `git config core.autocrlf input`

### File Naming

- Use lowercase with hyphens: `react-native.md`
- No spaces: `third-party-security.md` not `third party security.md`
- Descriptive: `copywriting.md` not `copy.md`

## Maintenance

### Regular Review

- Quarterly review of all rules
- Remove obsolete rules
- Update examples to match current practices
- Check character count: `wc -c file.md`

### Version Control

- Commit rules to git
- Document changes in commit messages
- Use conventional commits: `docs: Update testing guidelines`

### Synchronization

After editing rules:

```bash
# Sync to all platforms
./.agents/sync.sh --only=rules

# Verify sync
ls -la .cursor/rules          # Should contain .mdc files
ls -la .claude/rules          # Should be symlink → ../.agents/rules
ls -la .gemini/GEMINI.md      # Should exist (index file)
ls -la .agents/rules/         # Antigravity reads natively from here (no copy needed)
ls -la .github/instructions/  # Should contain .instructions.md files (Copilot) — official path
```

## Checklist for New Rules

Before adding a new rule file:

- [ ] Single topic/theme
- [ ] Under ~12,000 characters target (`wc -c file.md`) — unless it's a documented comprehensive governance/reference rule
- [ ] Descriptive filename (lowercase-hyphen)
- [ ] Proper category subdirectory
- [ ] Universal YAML frontmatter (all platform fields)
- [ ] Review instructions with `$ARGUMENTS`
- [ ] Output format section
- [ ] Specific and concrete instructions
- [ ] Examples included
- [ ] Active voice used
- [ ] Actionable items
- [ ] Consistent formatting
- [ ] No ambiguous language
- [ ] Code blocks have language tags
- [ ] Tested on all platforms

## Examples of Good Rules

See these files as examples of well-structured rules:

- `code/principles.md` - Clear architecture decisions
- `content/copywriting.md` - Specific, with examples
- `team/skills-management.md` - Well-organized, actionable
- `frameworks/react-native.md` - Framework-specific, concise
- `design/web-design.md` - Comprehensive accessibility patterns
- `tools/use-context7.md` - Simple, clear directive

## Common Mistakes to Avoid

### ❌ Too Long (a generic rule >12,000 chars covering mixed topics)

**Solution:** Split a generic rule only when it covers two genuinely separate
topics. Comprehensive single-topic governance/reference rules (the `lidr-sdlc/`
set) are an accepted exception — trim redundancy rather than fragment them.

### ❌ Mixed Topics

**Solution:** One topic per file, use subdirectories

### ❌ Vague Instructions

**Solution:** Be specific, include examples

### ❌ No Examples

**Solution:** Show good and bad examples

### ❌ Passive Voice

**Solution:** Use active, imperative voice

### ❌ No Structure

**Solution:** Use headers, lists, code blocks

### ❌ Missing YAML Frontmatter

**Solution:** Add universal YAML with all platform fields

### ❌ Outdated Content

**Solution:** Regular quarterly reviews

## References

- [Cursor Rules Documentation](https://cursor.com/docs/context/rules) - Official Cursor guidelines
- [Claude Code Memory](https://code.claude.com/docs/en/memory) - Claude memory system
- [Gemini CLI Context](https://geminicli.com/docs/cli/gemini-md/) - Gemini.md format
- [AGENTS.md Standard](https://agents.md) - Universal format

---

**Last updated:** 2026-02-02
**Maintained by:** LIDR Template Team
