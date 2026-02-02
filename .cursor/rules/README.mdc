# Rules - Best Practices Guide

**Source of Truth:** This directory contains all project rules synchronized to AI agents.

## Character Limit

**Maximum:** 12,000 characters per rule file

**Why?** Based on Cursor's recommendation of ~500 lines and cross-platform compatibility:
- Cursor: 500 lines recommended
- Claude Code: No hard limit, but concise is better
- Gemini CLI: Performance degrades with large files
- Antigravity: Focused rules work best

**Check file size:**
```bash
# Count characters in a rule
wc -c .agents/rules/category/rule-name.md

# Find rules exceeding limit
find .agents/rules -name "*.md" -type f -exec wc -c {} + | awk '$1 > 12000 {print $1, $2}'
```

## YAML Frontmatter

### Platform Support Matrix

All rules in `.agents/rules/` should use universal YAML frontmatter that works across all platforms:

| Field | Cursor | Claude Code | Gemini CLI | Antigravity |
|-------|--------|-------------|------------|-------------|
| `name` | ✅ | ❌ | ❌ | ❌ |
| `description` | ✅ | ✅ | ✅ | ❌ |
| `alwaysApply` | ✅ | ❌ | ❌ | ❌ |
| `globs` | ✅ | ❌ | ❌ | ❌ |
| `trigger` | ❌ | ❌ | ❌ | ✅ |
| `argument-hint` | ❌ | ✅ | ✅ | ❌ |
| `paths` | ❌ | ✅ | ❌ | ❌ |

### Universal Format (Recommended)

Use this format in `.agents/rules/` source files for maximum compatibility:

```yaml
---
name: rule-name                      # Cursor
description: Brief description       # All platforms
alwaysApply: false                   # Cursor (optional, defaults to false)
globs: ["**/*.ts"]                  # Cursor (optional)
argument-hint: <file-pattern>        # Claude/Gemini (optional)
paths: ["src/**/*.ts"]              # Claude (optional)
trigger: always_on                   # Antigravity (optional)
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

**name** (Cursor only)
- **Type:** String
- **Required:** Yes for Cursor
- **Description:** Unique identifier for the rule
- **Example:** `"react-components"`

**description**
- **Type:** String
- **Required:** Recommended for all platforms
- **Description:** Brief summary shown in UI
- **Example:** `"React component standards"`

**alwaysApply** (Cursor only)
- **Type:** Boolean
- **Required:** No (defaults to `false`)
- **Values:**
  - `true` = Rule always active in chat
  - `false` = AI decides when to apply intelligently
- **Example:** `false`

**globs** (Cursor only)
- **Type:** Array of strings
- **Required:** No
- **Description:** Glob patterns for file matching
- **Example:** `["src/**/*.tsx", "src/**/*.ts"]`

**argument-hint** (Claude/Gemini)
- **Type:** String
- **Required:** No
- **Description:** Placeholder text shown in UI for file arguments
- **Example:** `"<api-file>"`

**paths** (Claude only)
- **Type:** Array of strings
- **Required:** No
- **Description:** Path patterns for conditional rule application
- **Example:** `["src/api/**/*.ts"]`

**trigger** (Antigravity only)
- **Type:** String
- **Required:** No
- **Description:** Trigger mode for rule activation
- **Values:** `always_on` (others undocumented)
- **Example:** `"always_on"`

### Platform-Specific Behavior

**Cursor (.mdc format):**
- Extension must be `.mdc` (sync script auto-converts .md → .mdc)
- Extracts: `name`, `description`, `alwaysApply`, `globs`
- Flattened structure (no subdirectories)
- `alwaysApply: true` = always active, `false` = intelligent application

**Claude Code (.md format):**
- Uses symlinks to `.agents/rules/` (supports subdirectories)
- Reads: `description`, `argument-hint`, `paths`
- Ignores Cursor-specific fields

**Gemini CLI:**
- No native rules support
- Index file (`.gemini/GEMINI.md`) generated with links to rules
- See `.gemini/GEMINI.md` for categorized rule index

**Antigravity (.md format):**
- Uses symlinks to `.agents/rules/` (supports subdirectories)
- Reads: `trigger`
- Very minimal YAML requirements

### YAML Best Practices

**✅ Always include universal fields:**
```yaml
---
name: my-rule                        # For Cursor
description: Rule description        # For all platforms
alwaysApply: false                   # For Cursor
globs: ["**/*.ts"]                  # For Cursor
argument-hint: <file>                # For Claude/Gemini
paths: ["src/**/*.ts"]              # For Claude
trigger: always_on                   # For Antigravity
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

```markdown
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

State issue + location. Skip explanation unless fix non-obvious. No preamble.
```

### ✅ Use Lists for Multiple Items

**Good:**
```markdown
## Required Fields

All API endpoints must include:
- Input validation (Zod schemas)
- Error handling (try/catch)
- Rate limiting (public endpoints)
- OpenAPI documentation
```

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
- Test on all platforms (Cursor, Claude, Gemini, Antigravity)

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
./.agents/rules/sync-rules.sh

# Verify sync
ls -la .cursor/rules          # Should contain .mdc files
ls -la .claude/rules          # Should be symlink → ../.agents/rules
ls -la .gemini/GEMINI.md      # Should exist (index file)
ls -la .agent/rules           # Should be symlink → ../.agents/rules
```

## Checklist for New Rules

Before adding a new rule file:

- [ ] Single topic/theme
- [ ] Under 12,000 characters (`wc -c file.md`)
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

### ❌ Too Long (>12,000 chars)

**Solution:** Split into multiple focused files

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
