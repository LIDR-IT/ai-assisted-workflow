# Command Template

This is a copy-paste template for creating new commands within the `.agents/` system.

## How to Use This Template

1. Copy the template below
2. Replace all `[PLACEHOLDERS]` with your specific content
3. Create file: `.agents/commands/[command-name].md`
4. Run sync: `./.agents/sync-all.sh`
5. Test with: `[/command-name]`

---

## Template Content

```markdown
---
description: [Brief description of what this command does]
---

# [Command Title]

[Main instruction or prompt for what the AI should do]

## Context

[Optional: Additional context about when/how to use this command]

## Specific Tasks

[List specific tasks or checks to perform]

1. **[Task 1 Name]**
   - [Subtask or detail]
   - [Another subtask]

2. **[Task 2 Name]**
   - [Subtask]
   - [Subtask]

3. **[Task 3 Name]**
   - [Subtask]
   - [Subtask]

## Output Format

[Optional but recommended: Specify how output should be structured]

### [Section Name]
[What this section should contain]

### [Another Section]
[What this section should contain]

## Example Output

[Optional: Show example of expected output format]

```[language]
[Example output]
```

## Guidelines

[Optional: Specific guidelines for executing this command]

- [Guideline 1]
- [Guideline 2]
- [Guideline 3]
```

---

## Customization Tips

### Frontmatter

**description:**
- Brief summary (1 sentence, ~50-100 chars)
- Describes what command does
- Optional but recommended
- Example: `"Review code for security vulnerabilities and suggest fixes"`

**When to include frontmatter:**
- ✅ Command needs discoverability
- ✅ Multiple related commands exist
- ✅ Used in automated workflows

**When to skip frontmatter:**
- Simple, self-explanatory commands
- Only used by specific team members
- Experimental commands

### Body Structure

**Be specific and actionable:**

✅ Good:
```markdown
Review this code for SQL injection vulnerabilities:

1. Check for string concatenation in queries
2. Verify parameterized queries are used
3. Look for raw SQL execution

For each issue, provide:
- Line number
- Description of vulnerability
- Recommended fix with code example
```

❌ Poor:
```markdown
Check for security problems.
```

**Define output format:**

✅ Good:
```markdown
## Output Format

### Issues Found
**Vulnerability:** [Name]
**Severity:** [Critical/High/Medium/Low]
**Line:** [number]
**Fix:** [code example]

### Summary
- Total issues: [count]
- Critical: [count]
```

❌ Poor:
```markdown
List the problems.
```

**Use clear structure:**

✅ Good:
```markdown
# Security Review

## Task
Analyze code for security vulnerabilities.

## Checks
1. SQL injection
2. XSS attacks
3. CSRF protection

## Output
[Structured format]
```

❌ Poor:
```markdown
Find security bugs.
```

## Minimal Command Example

For very simple commands:

```markdown
Generate a commit message for the staged changes following conventional commits format.

Format: type(scope): description

Types: feat, fix, docs, refactor, test, chore
```

**No frontmatter needed** for simple, obvious commands.

## Complete Command Example

```markdown
---
description: Review code for security vulnerabilities with severity ratings and fixes
---

# Security Code Review

Analyze the provided code for security vulnerabilities.

## Security Checks

1. **SQL Injection**
   - Check for unsanitized user input in database queries
   - Verify parameterized queries are used
   - Look for string concatenation in SQL

2. **Cross-Site Scripting (XSS)**
   - Check for unescaped user input in HTML
   - Verify output encoding is applied
   - Look for innerHTML assignments with user data

3. **Authentication & Authorization**
   - Check for missing authentication checks
   - Verify proper authorization before sensitive operations
   - Look for hardcoded credentials

4. **CSRF Protection**
   - Check for CSRF tokens in state-changing operations
   - Verify token validation on server
   - Look for unprotected POST/PUT/DELETE endpoints

5. **Sensitive Data Exposure**
   - Check for secrets in code or logs
   - Verify sensitive data is encrypted
   - Look for API keys or passwords in strings

## Output Format

For each vulnerability found:

**Vulnerability:** [Short name]
**Severity:** [Critical/High/Medium/Low]
**Location:** [filename:line]
**Description:** [What the vulnerability is]
**Impact:** [Potential consequences]
**Fix:** [Specific code change with example]

```[language]
# Before (vulnerable)
[current code]

# After (secure)
[fixed code]
```

## Summary

- Total vulnerabilities: [count]
- Critical: [count] | High: [count] | Medium: [count] | Low: [count]

## Recommendations

[General security recommendations for this codebase]
```

## Platform Notes

### Cursor, Claude Code, Gemini CLI

Commands work identically across these platforms:
- ✅ Invoked via `/[command-name]`
- ✅ Symlinked from `.agents/commands/`
- ✅ Changes propagate instantly

### Antigravity

Special considerations:
- ⚠️ Commands copied to `.agent/workflows/` (not `.agent/commands/`)
- ⚠️ Must re-sync after editing
- ⚠️ Changes don't propagate instantly

## Real Examples

See these commands in `.agents/commands/`:

**sync-setup.md:**
- ✅ Has frontmatter with description
- ✅ Clear structure with sections
- ✅ Specific workflow steps
- ✅ Verification commands included

Study existing commands to understand different styles and approaches.
