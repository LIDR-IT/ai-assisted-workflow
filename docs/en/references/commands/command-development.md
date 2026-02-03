# Command Development for Claude Code

## Overview

Slash commands are Markdown files containing reusable prompts that Claude executes during interactive sessions. Commands provide reusability, consistency, team sharing, and efficient access to complex workflows.

**Source:** [skills.sh/anthropics/claude-code/command-development](https://skills.sh/anthropics/claude-code/command-development)

---

## Critical Principle

**Commands are written FOR Claude, not FOR users.**

Commands must be directives TO Claude about what to analyze and how, not descriptions of what users will receive.

✅ **Correct:** "Review this code for security vulnerabilities. Check for SQL injection, XSS, and authentication bypass."

❌ **Incorrect:** "This command will help you review code and provide security recommendations."

---

## File Structure

### File Extension

All commands use `.md` extension.

### Storage Locations

```
1. Project Commands (team-specific)
   .claude/commands/

2. Personal Commands (cross-project)
   ~/.claude/commands/

3. Plugin Commands (plugin-specific)
   plugin-name/commands/
```

### Organization Strategies

**Flat Structure (5-15 commands):**

```
.claude/commands/
├── review-security.md
├── generate-tests.md
└── update-docs.md
```

**Namespaced (15+ commands):**

```
.claude/commands/
├── review/
│   ├── security.md
│   └── performance.md
└── generate/
    ├── tests.md
    └── docs.md
```

---

## YAML Frontmatter

### Available Fields

```yaml
---
description: Brief summary shown in /help (under 60 characters)
allowed-tools: Specific tools permitted (e.g., Read, Bash(git:*))
model: haiku | sonnet | opus
argument-hint: [file-path]
disable-model-invocation: true
---
```

### Field Details

**`description`**

- Brief summary shown in `/help` output
- Maximum 60 characters
- Helps users understand command purpose

**`allowed-tools`**

- Restricts which tools Claude can use
- Supports wildcards: `Bash(git:*)` allows git commands only
- Examples: `Read, Write, Bash(npm:*)`

**`model`**

- Specifies which Claude model to use
- Options: `haiku`, `sonnet`, `opus`
- Use `haiku` for simple tasks, `opus` for complex reasoning

**`argument-hint`**

- Documents expected arguments
- Shown in autocomplete
- Examples: `[file-path]`, `<directory>`, `[test-name]`

**`disable-model-invocation`**

- Prevents programmatic command execution
- Useful for commands that should only run interactively

### Example Frontmatter

```yaml
---
description: Review code for security vulnerabilities
allowed-tools: Read, Grep, Bash(git:*)
model: sonnet
argument-hint: [file-path]
---
```

---

## Dynamic Arguments

### Argument Types

**1. `$ARGUMENTS` - All arguments as single string**

```markdown
---
description: Search for pattern in codebase
---

Search for "$ARGUMENTS" across all files.
```

Usage: `/search-pattern login function`
Result: `$ARGUMENTS` = "login function"

**2. Positional (`$1`, `$2`, `$3`) - Individual arguments**

```markdown
---
description: Rename file
---

Rename file from $1 to $2 in the project.
```

Usage: `/rename old-name.js new-name.js`
Result: `$1` = "old-name.js", `$2` = "new-name.js"

**3. Combined - Positional + remaining**

```markdown
---
description: Create component with props
---

Create React component $1 with props: $2 $3 $4 $5
```

Usage: `/create-component Button onClick disabled children className`

---

## File References

### Static File Reference

```markdown
Review the authentication code in @src/auth/login.js
```

### Dynamic File Reference

```markdown
---
argument-hint: [file-path]
---

Review the code in @$1 for security issues.
```

Usage: `/review-security src/api/users.js`
Result: File contents of `src/api/users.js` included in context

---

## Bash Execution

### Inline Bash

Commands can execute bash inline for dynamic context gathering.

**Example:**

```markdown
Review the following git diff:

\`\`\`bash
git diff main...HEAD
\`\`\`

Check for breaking changes and suggest migration steps.
```

### Safe Bash Scoping

```yaml
---
allowed-tools: Bash(git:*)
---
```

This limits bash execution to git commands only, preventing broader system access.

---

## Plugin-Specific Features

### `${CLAUDE_PLUGIN_ROOT}` Variable

Plugin commands have access to `${CLAUDE_PLUGIN_ROOT}`, which resolves to the plugin's absolute path.

**Use Cases:**

**1. Portable Script Execution**

```markdown
Run validation:

\`\`\`bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/validate.js $1
\`\`\`
```

**2. Configuration Loading**

```markdown
Load config from ${CLAUDE_PLUGIN_ROOT}/config/defaults.json
```

**3. Template Access**

```markdown
Use template from ${CLAUDE_PLUGIN_ROOT}/templates/component.tsx
```

**4. Resource Management**

```markdown
Read schema: @${CLAUDE_PLUGIN_ROOT}/schemas/api.json
```

### Integration with Other Components

**Commands + Agents:**

```markdown
For complex refactoring, use the refactor-agent:
/agent refactor-agent $ARGUMENTS
```

**Commands + Skills:**

```markdown
This command uses the testing-skill for generating comprehensive tests.
```

**Commands + Hooks:**

```markdown
This command triggers PreBashExecution hook for validation.
```

---

## Best Practices

### Command Design

✅ **DO:**

- Single responsibility per command
- Clear, descriptive names (verb-noun pattern)
- Explicit tool dependencies in frontmatter
- Consistent argument patterns

❌ **DON'T:**

- Create catch-all commands doing too much
- Use vague names like "helper" or "utility"
- Leave tool permissions unrestricted
- Mix multiple concerns in one command

### Naming Patterns

**Verb-Noun Format:**

```
review-security.md
generate-tests.md
update-docs.md
refactor-component.md
```

**Namespaced:**

```
review/security.md
review/performance.md
generate/tests.md
generate/docs.md
```

### Argument Handling

✅ **DO:**

- Validate inputs in command body
- Provide sensible defaults
- Document expected formats
- Handle edge cases gracefully

**Example:**

```markdown
---
argument-hint: [file-path]
---

Review file: @$1

If file doesn't exist, search for similar names:

\`\`\`bash
find . -name "_$1_"
\`\`\`
```

### File References

✅ **DO:**

- Use explicit paths when possible
- Check file existence before referencing
- Use relative paths for portability

**Example:**

```markdown
Check if file exists:

\`\`\`bash
test -f $1 && echo "exists" || echo "not found"
\`\`\`

If exists, review @$1
```

### Bash Commands

✅ **DO:**

- Limit scope with `allowed-tools`
- Use safe, read-only operations when possible
- Handle errors gracefully
- Document bash commands with comments

**Example:**

```yaml
---
allowed-tools: Bash(git:*)
---
```

```bash
# Get recent commits
git log --oneline -10

# Show diff (read-only, safe)
git diff HEAD~1
```

### Documentation

✅ **DO:**

- Include usage comments in command
- Explain non-obvious requirements
- Document expected arguments
- Note any dependencies

**Example:**

```markdown
<!--
Usage: /review-pr [pr-number]
Requires: GitHub CLI (gh) installed
Example: /review-pr 123
-->

---

description: Review GitHub pull request
argument-hint: [pr-number]
allowed-tools: Bash(gh:\*)

---

Review pull request #$1 using GitHub CLI...
```

---

## Common Patterns

### 1. Review Pattern

```markdown
---
description: Review code for security vulnerabilities
allowed-tools: Read, Grep
model: sonnet
argument-hint: [file-or-pattern]
---

# Security Review

Analyze code in @$1 for:

## Critical Issues

- SQL injection vulnerabilities
- XSS attack vectors
- Authentication bypass risks
- Sensitive data exposure

## Medium Priority

- Input validation gaps
- Error handling improvements
- Access control weaknesses

## Output Format

- Issue severity (Critical/Medium/Low)
- File and line number
- Explanation
- Suggested fix
```

### 2. Testing Pattern

```markdown
---
description: Generate comprehensive tests
allowed-tools: Read, Write, Bash(npm:test)
model: sonnet
argument-hint: [file-path]
---

# Test Generation

For file @$1:

1. Analyze function signatures
2. Identify edge cases
3. Generate test suite
4. Run tests and verify coverage

\`\`\`bash
npm test -- $1
\`\`\`

If tests fail, suggest fixes.
```

### 3. Documentation Pattern

```markdown
---
description: Generate API documentation
allowed-tools: Read, Write, Grep
argument-hint: [directory]
---

# Documentation Generator

Scan directory $1 for:

- Function exports
- Type definitions
- JSDoc comments

Generate markdown documentation with:

- Function signatures
- Parameter descriptions
- Return types
- Usage examples
```

### 4. Workflow Pattern

```markdown
---
description: Complete feature development workflow
allowed-tools: Read, Write, Bash(git:*, npm:*)
model: opus
---

# Feature Development Workflow

Execute these steps:

1. Create feature branch
   \`\`\`bash
   git checkout -b feature/$ARGUMENTS
   \`\`\`

2. Implement feature with tests

3. Run test suite
   \`\`\`bash
   npm test
   \`\`\`

4. Update documentation

5. Create pull request
```

---

## Complete Examples

### Example 1: Simple Review Command

```markdown
---
description: Review code for best practices
allowed-tools: Read, Grep
model: sonnet
argument-hint: [file-path]
---

Review @$1 for:

1. **Code Quality**
   - Naming conventions
   - Function length
   - Code duplication

2. **Best Practices**
   - Error handling
   - Type safety
   - Documentation

3. **Performance**
   - Unnecessary computations
   - Memory leaks
   - Inefficient algorithms

Output findings with file:line format.
```

### Example 2: Git Workflow Command

```markdown
---
description: Review uncommitted changes
allowed-tools: Bash(git:*)
model: sonnet
---

# Change Review

## Staged Changes

\`\`\`bash
git diff --cached --stat
\`\`\`

## Unstaged Changes

\`\`\`bash
git diff --stat
\`\`\`

## Analysis

Review changes for:

- Breaking changes
- Missing tests
- Documentation updates needed
- Potential bugs
```

### Example 3: Plugin Command with Root Variable

```markdown
---
description: Validate plugin configuration
allowed-tools: Read, Bash(node:*)
---

# Plugin Validation

Run validation script:

\`\`\`bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-config.js
\`\`\`

Check against schema:
@${CLAUDE_PLUGIN_ROOT}/schemas/plugin-config.schema.json

Report any validation errors with suggested fixes.
```

---

## Resources

- **Source:** [skills.sh/anthropics/claude-code/command-development](https://skills.sh/anthropics/claude-code/command-development)
- **Claude Code Docs:** [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)

---

**Last Updated:** January 2026
**Category:** Claude Code Commands
