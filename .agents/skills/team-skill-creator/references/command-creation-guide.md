# Command Creation Guide

Complete process for creating commands within the `.agents/` system. Commands are reusable prompt templates accessed via `/{command-name}`.

## Table of Contents

1. [What Are Commands?](#what-are-commands)
2. [When to Use Commands](#when-to-use-commands)
3. [Command Structure](#command-structure)
4. [Creation Process](#creation-process)
5. [Frontmatter Options](#frontmatter-options)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## What Are Commands?

Commands are **frequently-used prompts** stored as Markdown files in `.agents/commands/`. They're invoked via `/{command-name}` in AI agents.

**Key characteristics:**

- Single `.md` file (no bundled resources)
- Text-based instructions
- Quick, single-turn actions
- Lightweight (no complex directory structure)

**Comparison to skills:**

| Aspect     | Command         | Skill                           |
| ---------- | --------------- | ------------------------------- |
| Format     | Single .md file | Directory with resources        |
| Resources  | No              | Yes (scripts/references/assets) |
| Complexity | Low             | High                            |
| Use case   | Quick prompts   | Reusable knowledge              |
| Invocation | `/{name}`       | Auto-triggered by phrases       |

## When to Use Commands

### Good Command Candidates

**Use commands when:**

- ✅ Quick, repetitive prompts
- ✅ Single-turn actions
- ✅ No bundled resources needed
- ✅ Simple text instructions
- ✅ Frequently used by team

**Examples:**

- Code review checklist
- Security vulnerability scan
- Performance optimization suggestions
- Documentation generation prompt
- Commit message formatting

### Poor Command Candidates

**Don't use commands when:**

- ❌ Needs scripts, templates, or documentation
- ❌ Multi-step workflows
- ❌ Requires bundled resources
- ❌ Complex domain knowledge

**Use skills instead:**

- Database queries (needs schema docs)
- React testing (needs test templates)
- API integration (needs API reference docs)

**Use agents instead:**

- Autonomous refactoring
- Multi-file analysis
- Complex decision-making workflows

## Command Structure

### File Location

```
.agents/commands/{command-name}.md
```

**Naming conventions:**

- Lowercase only
- Use hyphens for spaces: `security-review.md`
- Descriptive: `optimize-performance.md` not `opt.md`

### Basic Format

**Minimal command (no frontmatter):**

```markdown
Review this code for common bugs and suggest improvements.
```

**Command with frontmatter:**

```markdown
---
description: Review code for bugs and improvements
---

Review this code for common bugs and suggest improvements:

1. Logic errors
2. Edge cases
3. Performance issues
4. Security vulnerabilities

Provide specific suggestions with code examples.
```

### File Structure

```markdown
---
description: Brief description (optional)
---

# Command Title (optional)

Main prompt instructions go here.

## Context (optional)

Additional context for the command.

## Output Format (optional)

Specify desired output format.
```

## Creation Process

### Step 1: Define Command Purpose

**Answer these questions:**

- What prompt is frequently repeated?
- What should the AI do?
- What output is expected?
- Who will use this command?

**Example:**

- **Purpose:** Review code for security issues
- **Action:** Scan for vulnerabilities
- **Output:** List of vulnerabilities with severity and fixes
- **Users:** All developers

### Step 2: Write Command Prompt

**Structure your prompt clearly:**

```markdown
# Main instruction

Review the code for security vulnerabilities.

# Specific checks

- SQL injection
- XSS attacks
- Authentication bypass
- CSRF vulnerabilities

# Output format

For each issue:

- Severity: Critical/High/Medium/Low
- Description: What the vulnerability is
- Fix: How to resolve it
```

**Best practices:**

- ✅ Be specific and actionable
- ✅ Include expected output format
- ✅ List explicit checks or criteria
- ✅ Use imperative language
- ❌ Avoid vague instructions

### Step 3: Add Frontmatter (Optional)

Frontmatter provides metadata for commands:

```yaml
---
description: Brief description of what command does
---
```

**When to include frontmatter:**

- When command needs a description for discoverability
- When using command in automated workflows
- When command has multiple variations

**When to skip frontmatter:**

- Simple, self-explanatory commands
- Commands only used by specific team members
- Experimental or temporary commands

### Step 4: Create File

```bash
# Create command file
touch .agents/commands/{command-name}.md

# Edit file
vim .agents/commands/{command-name}.md
```

**Write command content** following your design from Steps 1-3.

### Step 5: Sync to Platforms

**Automatic (when using team-skill-creator):**
Sync happens automatically after command creation.

**Manual (when creating directly):**

```bash
./.agents/sync-all.sh
```

**Verification:**

```bash
# Check command exists
ls .agents/commands/{command-name}.md

# Verify synced
ls -la .cursor/commands/{command-name}.md
ls -la .claude/commands/{command-name}.md

# Test access
cat .cursor/commands/{command-name}.md
```

### Step 6: Test Command

**In AI agent:**

```
/{command-name}
```

**Verify:**

- ✅ Command triggers correctly
- ✅ Prompt displays as expected
- ✅ Output format matches intent
- ✅ Works across all platforms

## Frontmatter Options

### Basic Frontmatter

```yaml
---
description: Brief description of command
---
```

**Field details:**

- **description**: Short summary (1 sentence, ~50-100 chars)
- Optional but recommended for discoverability

### Example Frontmatter

```yaml
---
description: Review code for security vulnerabilities and suggest fixes
---
```

```yaml
---
description: Generate commit message following conventional commits format
---
```

```yaml
---
description: Optimize code for performance with specific suggestions
---
```

### No Frontmatter

Simple commands can skip frontmatter entirely:

```markdown
Generate a concise commit message for the staged changes following conventional commits format.

Format: type(scope): description

Types: feat, fix, docs, refactor, test, chore
```

## Best Practices

### Writing Effective Commands

**1. Be specific and actionable**

✅ Good:

```markdown
Review this code for the following security issues:

- SQL injection in database queries
- XSS vulnerabilities in user inputs
- Missing authentication checks
- CSRF token validation

For each issue found, provide:

1. Line number
2. Vulnerability description
3. Recommended fix with code example
```

❌ Poor:

```markdown
Check for security problems.
```

**2. Define expected output format**

✅ Good:

```markdown
Generate a performance optimization report:

## Performance Issues

- [Issue]: [Description]
- [Suggested fix]: [Code example]

## Estimated Impact

- [Metric]: [Improvement estimate]
```

❌ Poor:

```markdown
Find performance problems and fix them.
```

**3. Use clear structure**

✅ Good:

```markdown
# Task

Analyze the codebase for unused dependencies.

# Steps

1. Check package.json dependencies
2. Search codebase for import statements
3. Identify unused packages

# Output

List each unused dependency with:

- Package name
- Last used (if found in git history)
- Safe to remove: Yes/No
```

❌ Poor:

```markdown
Find unused dependencies.
```

### Naming Conventions

**Good names:**

- `security-review.md` - Clear, descriptive
- `optimize-performance.md` - Action-oriented
- `generate-commit.md` - Specific purpose

**Poor names:**

- `sr.md` - Too abbreviated
- `command1.md` - Not descriptive
- `test.md` - Too vague

### Command Length

**Ideal:** 10-50 lines
**Maximum:** ~200 lines

If command approaches 200 lines:

- Consider splitting into multiple commands
- Or convert to a skill with bundled resources

### Version Control

**Include in Git:**

```bash
git add .agents/commands/{command-name}.md
git commit -m "feat: Add {command-name} command"
```

**Why commit commands:**

- Team collaboration
- Version history
- Sync across machines

## Examples

### Example 1: Security Review Command

**File:** `.agents/commands/security-review.md`

```markdown
---
description: Review code for security vulnerabilities with severity ratings
---

# Security Code Review

Analyze the provided code for security vulnerabilities.

## Checks to Perform

1. **SQL Injection**
   - Check for unsanitized user input in database queries
   - Verify parameterized queries are used

2. **Cross-Site Scripting (XSS)**
   - Check for unescaped user input in HTML
   - Verify output encoding is applied

3. **Authentication & Authorization**
   - Check for missing authentication checks
   - Verify proper authorization before sensitive operations

4. **CSRF Protection**
   - Check for CSRF tokens in state-changing operations
   - Verify token validation

5. **Sensitive Data Exposure**
   - Check for hardcoded secrets or credentials
   - Verify sensitive data is encrypted

## Output Format

For each vulnerability found:

**Vulnerability:** [Name]
**Severity:** [Critical/High/Medium/Low]
**Location:** [File:line]
**Description:** [What the vulnerability is]
**Impact:** [Potential consequences]
**Fix:** [Specific code change with example]

## Summary

- Total vulnerabilities: [Count]
- Critical: [Count]
- High: [Count]
- Medium: [Count]
- Low: [Count]
```

**Usage:**

```
/security-review
```

### Example 2: Commit Message Generator

**File:** `.agents/commands/generate-commit.md`

```markdown
---
description: Generate commit message following conventional commits format
---

Generate a concise commit message for the staged changes.

## Format
```

type(scope): description

[optional body]

[optional footer]

```

## Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **refactor**: Code restructuring without behavior change
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, configs)
- **perf**: Performance improvements

## Guidelines

1. **Subject line:**
   - Start with type(scope): format
   - Use imperative mood ("Add feature" not "Added feature")
   - Max 50 characters
   - No period at end

2. **Body (if needed):**
   - Explain WHAT changed and WHY
   - Wrap at 72 characters
   - Separate from subject with blank line

3. **Footer (if applicable):**
   - Reference issues: `Refs: #123`
   - Breaking changes: `BREAKING CHANGE: description`

## Example Output

```

feat(auth): Add JWT token refresh mechanism

Implement automatic token refresh before expiration
to improve user experience and reduce re-login frequency.

- Add refresh token endpoint
- Implement token rotation
- Add token expiry check middleware

Refs: #456

```

```

**Usage:**

```
/generate-commit
```

### Example 3: Performance Optimization

**File:** `.agents/commands/optimize-performance.md`

```markdown
Analyze the code for performance optimization opportunities.

## Analysis Areas

1. **Algorithm Complexity**
   - Identify O(n²) or worse algorithms
   - Suggest more efficient approaches

2. **Database Queries**
   - N+1 query problems
   - Missing indexes
   - Unnecessary queries

3. **Caching Opportunities**
   - Repeated computations
   - Cacheable API calls
   - Static data that could be memoized

4. **Resource Usage**
   - Memory leaks
   - Unnecessary object creation
   - Large data structure inefficiencies

## Output Format

### Performance Issues

**Issue:** [Description]
**Location:** [File:line]
**Current complexity:** [O notation]
**Impact:** [Estimated performance cost]
**Suggested fix:**
[Code example]
**Improved complexity:** [O notation]

### Estimated Impact

- Response time: [Expected improvement]
- Memory usage: [Expected improvement]
- Database load: [Expected improvement]
```

**Usage:**

```
/optimize-performance
```

### Example 4: Documentation Generator

**File:** `.agents/commands/generate-docs.md`

````markdown
---
description: Generate documentation for code following project standards
---

Generate comprehensive documentation for the provided code.

## Documentation Sections

1. **Overview**
   - Brief description of what the code does
   - Main use cases

2. **API Reference** (for functions/methods)
   - Function signature
   - Parameters with types and descriptions
   - Return value with type and description
   - Examples

3. **Usage Examples**
   - Basic usage
   - Advanced usage
   - Common patterns

4. **Notes**
   - Important considerations
   - Performance notes
   - Security considerations

## Format

Use Markdown with proper headings and code blocks.

## Example Output Structure

```markdown
# ComponentName

Brief description of the component and its purpose.

## API

### functionName(param1, param2)

Brief description of what the function does.

**Parameters:**

- `param1` (Type): Description
- `param2` (Type): Description

**Returns:** (Type) Description

**Example:**
[code example]

## Usage

### Basic Usage

[example]

### Advanced Usage

[example]

## Notes

- Note 1
- Note 2
```
````

```

**Usage:**
```

/generate-docs

````

## Platform-Specific Notes

### Cursor, Claude Code, Gemini CLI

**Full support:**
- ✅ Commands work identically
- ✅ Invoked via `/{command-name}`
- ✅ Symlinked from `.agents/commands/`
- ✅ Instant propagation of changes

### Antigravity

**Special considerations:**
- ✅ Commands available via `.agents/workflows/` (symlink to `.agents/commands/`)
- ⚠️ Must re-sync after editing: `./.agents/sync-all.sh`
- ⚠️ Changes don't propagate instantly (files are copied, not symlinked)

## Validation

After creating a command, validate it:

```bash
./.agents/skills/team-skill-creator/scripts/validate-command.sh {command-name}
````

**Checks performed:**

- ✅ File exists at `.agents/commands/{command-name}.md`
- ✅ File is readable
- ✅ Content is valid Markdown
- ✅ If frontmatter exists, it's valid YAML

## Troubleshooting

### Command Not Found

**Symptoms:** `/{command-name}` doesn't work

**Solutions:**

```bash
# 1. Check file exists
ls .agents/commands/{command-name}.md

# 2. Re-sync
./.agents/sync-all.sh

# 3. Verify synced
ls -la .cursor/commands/ | grep {command-name}

# 4. Check file has content
cat .agents/commands/{command-name}.md
```

### Command Not Triggering

**Symptoms:** Command exists but doesn't execute

**Solutions:**

- Check file extension is `.md`
- Verify file is in `.agents/commands/` not elsewhere
- Re-sync: `./.agents/sync-all.sh`
- Try full restart of AI agent

## Summary

Commands in `.agents/` system:

**✅ Use commands for:**

- Quick, repetitive prompts
- Single-turn actions
- Simple text instructions
- Frequently-used by team

**❌ Don't use commands for:**

- Complex workflows (use skills)
- Bundled resources needed (use skills)
- Autonomous tasks (use agents)

**Creation steps:**

1. Define purpose and prompt
2. Write command content
3. Add frontmatter (optional)
4. Create file in `.agents/commands/`
5. Sync (automatic or manual)
6. Test via `/{command-name}`

**Result:** Command available across all 5 platforms, invoked with `/{command-name}`!
