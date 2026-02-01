# Rules - Best Practices Guide

**Source of Truth:** This directory contains all project rules synchronized to AI agents.

## Character Limit

**Maximum:** 12,000 characters per rule file

**Why?** Based on Cursor's recommendation of ~500 lines and cross-platform compatibility:
- Cursor: 500 lines recommended
- Claude Code: No hard limit, but concise is better
- Gemini CLI: Performance degrades with large files
- Antigravity: Flat structure requires focused rules

**Check file size:**
```bash
# Count characters in a rule
wc -c .agents/rules/category/rule-name.md

# Find rules exceeding limit
find .agents/rules -name "*.md" -type f -exec wc -c {} + | awk '$1 > 12000 {print $1, $2}'
```

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
# Rule Title

Brief introduction (1-2 sentences).

## Section 1

Content with examples.

## Section 2

More content.

## Anti-patterns (if applicable)

Common mistakes to avoid.
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
ls -la .cursor/rules
ls -la .claude/rules
ls -la .gemini/rules
ls -la .agent/rules
```

**Known behavior - Antigravity file detection:**

Antigravity uses file watchers that detect changes based on modification timestamps. The sync script automatically updates timestamps when copying files.

**IMPORTANT - Correct workflow for Antigravity:**

**Option 1: Sync BEFORE opening Antigravity (Recommended)**
```bash
# 1. Make changes in .agents/rules/
# 2. Run sync
./.agents/sync-all.sh
# 3. THEN open Antigravity
# Rules will load with updated timestamps
```

**Option 2: Reload AFTER sync**
```bash
# 1. Antigravity already open
# 2. Run sync
./.agents/sync-all.sh
# 3. Close and reopen project in Antigravity
# Or restart Antigravity completely
```

**Why this happens:**
- Antigravity loads rules into memory when it starts
- Sync updates file timestamps, but Antigravity already cached the rules
- Only detects changes to files AFTER they're loaded into memory
- Solution: Reload Antigravity after sync to pick up changes

## YAML Frontmatter (Platform-Specific)

Different platforms support different YAML fields. See `YAML-FORMATS.md` for complete guide.

### Universal Format (Recommended)

Use this format in `.agents/rules/` for maximum compatibility:

```yaml
---
# Cursor-specific
name: rule-name
description: Brief description
alwaysApply: false
globs: ["**/*.ts"]

# Claude/Gemini-specific
argument-hint: <file-pattern>
paths: ["src/**/*.ts"]

# Antigravity-specific
trigger: always_on
---
```

### Quick Reference

| Platform | Extension | Key Fields |
|----------|-----------|------------|
| Cursor | `.md` | `name`, `description`, `alwaysApply`, `globs` |
| Claude Code | `.md` | `description`, `argument-hint`, `paths` |
| Gemini CLI | `.md` | `description`, `argument-hint` |
| Antigravity | `.md` | `trigger` |

**Note:** For detailed field definitions and examples, see `YAML-FORMATS.md`.

## Checklist for New Rules

Before adding a new rule file:

- [ ] Single topic/theme
- [ ] Under 12,000 characters (`wc -c file.md`)
- [ ] Descriptive filename (lowercase-hyphen)
- [ ] Proper category subdirectory
- [ ] **YAML frontmatter with platform fields** (see above)
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

### ❌ Outdated Content

**Solution:** Regular quarterly reviews

## References

- [Cursor Rules Documentation](https://cursor.com/docs/context/rules) - Official Cursor guidelines
- [Claude Code Memory](https://code.claude.com/docs/en/memory) - Claude memory system
- [Gemini CLI Context](https://geminicli.com/docs/cli/gemini-md/) - Gemini.md format
- [AGENTS.md Standard](https://agents.md) - Universal format

---

**Last updated:** 2026-02-01
**Maintained by:** LIDR Template Team
