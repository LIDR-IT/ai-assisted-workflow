# YAML Frontmatter Formats by Platform

Guide to YAML frontmatter fields supported by each AI agent platform.

## Platform Support Matrix

| Field | Cursor | Claude Code | Gemini CLI | Antigravity |
|-------|--------|-------------|------------|-------------|
| `name` | ✅ | ❌ | ❌ | ❌ |
| `description` | ✅ | ✅ | ✅ | ❌ |
| `alwaysApply` | ✅ | ❌ | ❌ | ❌ |
| `globs` | ✅ | ❌ | ❌ | ❌ |
| `trigger` | ❌ | ❌ | ❌ | ✅ |
| `argument-hint` | ❌ | ✅ | ✅ | ❌ |
| `paths` | ❌ | ✅ | ❌ | ❌ |

## Cursor (.mdc format)

**File extension:** `.mdc` (Markdown Context) - **REQUIRED**

**Important:** Cursor requires `.mdc` extension for rules. The sync script automatically converts `.md` → `.mdc` when copying to Cursor.

**Supported fields:**
```yaml
---
name: rule-name                           # Rule identifier
description: Brief description            # Shown in UI
alwaysApply: false                        # true = always on, false = intelligent
globs: ["src/**/*.ts", "src/**/*.tsx"]   # File patterns to apply
---
```

**Example:**
```markdown
---
name: react-components
description: React component standards
alwaysApply: false
globs: ["src/components/**/*.tsx"]
---

# React Component Standards

All components must use functional components...
```

**Notes:**
- Extension must be `.mdc` not `.md`
- `name` is required for identification
- `alwaysApply: true` = always active in chat
- `alwaysApply: false` = AI decides when to apply
- `globs` uses standard glob patterns

## Claude Code (.md format)

**File extension:** `.md`

**Supported fields:**
```yaml
---
description: Brief description of rule
argument-hint: <file-pattern>             # Optional: shows in UI
paths: ["src/api/**/*.ts"]               # Optional: path-specific rules
---
```

**Example:**
```markdown
---
description: API development standards
argument-hint: <api-file>
paths: ["src/api/**/*.ts"]
---

# API Standards

All endpoints must validate input...
```

**Notes:**
- Uses symlinks from `.claude/rules/` → `.agents/rules/`
- Supports subdirectories
- `paths` field enables conditional application
- `argument-hint` shows placeholder text

## Gemini CLI (.md format)

**File extension:** `.md`

**Supported fields:**
```yaml
---
description: Brief description of rule
argument-hint: <file-pattern>             # Optional
---
```

**Example:**
```markdown
---
description: Testing standards
argument-hint: <test-file>
---

# Testing Standards

All tests must...
```

**Notes:**
- Uses symlinks from `.gemini/rules/` → `.agents/rules/`
- Supports subdirectories
- Similar to Claude Code format
- Simpler than Cursor (no `globs`, `alwaysApply`)

## Antigravity (.md format)

**File extension:** `.md`

**Supported fields:**
```yaml
---
trigger: always_on                        # or other trigger modes
---
```

**Example:**
```markdown
---
trigger: always_on
---

Always use Context7 MCP when I need library documentation...
```

**Notes:**
- Uses flat structure (no subdirectories supported)
- Very minimal YAML frontmatter
- `trigger: always_on` = rule always active
- Other trigger modes may exist (undocumented)

## Universal Format (Recommended)

For `.agents/rules/` source files, use this universal format that works across platforms:

```yaml
---
# Cursor-specific (will be used in .mdc conversion)
name: rule-name                           # For Cursor
description: Brief description            # For all platforms
alwaysApply: false                        # For Cursor (optional, defaults to false)
globs: ["**/*.ts"]                       # For Cursor (optional)

# Claude/Gemini-specific
argument-hint: <file-pattern>             # For Claude/Gemini (optional)
paths: ["src/**/*.ts"]                   # For Claude (optional)

# Antigravity-specific
trigger: always_on                        # For Antigravity (optional)
---

# Rule Content

Your rule content here...
```

**Sync behavior:**
- **Cursor:** Extracts `name`, `description`, `alwaysApply`, `globs` → saves as `.mdc` (flattened, no subdirs)
- **Claude Code:** Keeps original via symlink (ignores Cursor fields)
- **Gemini CLI:** Keeps original via symlink (ignores Cursor fields)
- **Antigravity:** Keeps original via symlink (supports subdirectories)

## Field Definitions

### name (Cursor only)
- **Type:** String
- **Required:** Yes (for Cursor)
- **Description:** Unique identifier for the rule
- **Example:** `"react-components"`

### description
- **Type:** String
- **Required:** Recommended for all
- **Description:** Brief summary shown in UI
- **Example:** `"React component standards"`

### alwaysApply (Cursor only)
- **Type:** Boolean
- **Required:** No (defaults to `false`)
- **Description:**
  - `true` = Rule always active in chat
  - `false` = AI decides when to apply intelligently
- **Example:** `true`

### globs (Cursor only)
- **Type:** Array of strings
- **Required:** No
- **Description:** Glob patterns for file matching
- **Example:** `["src/**/*.tsx", "src/**/*.ts"]`

### argument-hint (Claude/Gemini)
- **Type:** String
- **Required:** No
- **Description:** Placeholder text for file arguments
- **Example:** `"<api-file>"`

### paths (Claude only)
- **Type:** Array of strings
- **Required:** No
- **Description:** Path patterns for conditional rule application
- **Example:** `["src/api/**/*.ts"]`

### trigger (Antigravity only)
- **Type:** String
- **Required:** No
- **Description:** Trigger mode for rule activation
- **Values:** `always_on` (others undocumented)
- **Example:** `"always_on"`

## Migration Guide

### Converting to Universal Format

**Before (Cursor-only):**
```yaml
---
name: api-rules
description: API standards
alwaysApply: false
globs: ["src/api/**/*.ts"]
---
```

**After (Universal):**
```yaml
---
name: api-rules                           # Cursor
description: API standards                # All platforms
alwaysApply: false                        # Cursor
globs: ["src/api/**/*.ts"]               # Cursor
argument-hint: <api-file>                 # Claude/Gemini
paths: ["src/api/**/*.ts"]               # Claude
trigger: always_on                        # Antigravity
---
```

### Platform-Specific Files

If you need platform-specific rules, use naming convention:

```
.agents/rules/
  ├── api-standards.md              # Universal (Claude/Gemini via symlink)
  ├── api-standards.cursor.mdc      # Cursor-specific version
  └── api-standards.antigravity.md  # Antigravity-specific version
```

**Sync script will:**
1. Copy `.cursor.mdc` files to Cursor (if they exist)
2. Otherwise, generate `.mdc` from universal `.md` (auto-convert, flatten to single directory)
3. Symlink `.agents/rules/` to Claude, Gemini, and Antigravity (supports subdirectories)

## Best Practices

### 1. Use Universal Format
Always include all relevant fields in `.agents/rules/` source:
```yaml
---
name: my-rule
description: Rule description
alwaysApply: false
globs: ["**/*.ts"]
argument-hint: <file>
paths: ["src/**/*.ts"]
trigger: always_on
---
```

### 2. Keep Descriptions Consistent
Use the same `description` across all platforms for consistency.

### 3. Test on All Platforms
After creating a rule, verify it works on:
- [ ] Cursor (check in settings)
- [ ] Claude Code (verify with `/memory`)
- [ ] Gemini CLI (verify with `/memory show`)
- [ ] Antigravity (check in Customizations panel)

### 4. Document Platform Differences
If a rule behaves differently per platform, document in the rule content:
```markdown
---
name: my-rule
description: Rule description
---

# My Rule

**Platform notes:**
- Cursor: Always applies to .ts files
- Claude: Only applies in src/api/
- Antigravity: Always active
```

## References

- **Cursor Rules:** [docs/references/rules/cursor-rules.md](../../docs/en/references/rules/cursor-rules.md)
- **Claude Code Memory:** [docs/references/rules/memory-and-rules.md](../../docs/en/references/rules/memory-and-rules.md)
- **Gemini CLI:** [docs/references/rules/gemini-md.md](../../docs/en/references/rules/gemini-md.md)
- **Antigravity:** [docs/references/rules/antigravity-rules.md](../../docs/en/references/rules/antigravity-rules.md)

---

**Last updated:** 2026-02-02
**Maintained by:** LIDR Template Team
