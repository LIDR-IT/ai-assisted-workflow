# Agent Development for Claude Code

## Overview

Agents are autonomous subprocesses designed to handle complex, multi-step tasks independently. Unlike commands that respond to user actions, agents operate proactively based on specific conditions.

**Key Principle:** "Agents are FOR autonomous work, commands are FOR user-initiated actions."

**Source:** [skills.sh/anthropics/claude-code/agent-development](https://skills.sh/anthropics/claude-code/agent-development)

---

## Core Structure

Agents are Markdown files with YAML frontmatter:

```markdown
---
name: agent-identifier
description: Use this agent when [conditions]. Examples: ...
model: inherit
color: blue
tools: [Read, Write, Grep]
---

# Agent System Prompt

You are a specialized agent for [purpose].

## Responsibilities

1. [Primary responsibility]
2. [Secondary responsibility]
   ...
```

---

## Configuration Fields

### Required Fields

#### name

**Requirements:**

- 3-50 characters
- Lowercase with hyphens only
- Start and end with alphanumeric
- Unique within plugin/project

**Valid Examples:**

```
code-reviewer
test-generator
security-auditor
doc-writer
```

**Invalid Examples:**

```
CodeReviewer    # uppercase
code_reviewer   # underscores
-reviewer       # starts with hyphen
reviewer-       # ends with hyphen
cr              # too short
```

#### description

**Most critical field** - defines when agent triggers.

**Format:**

```yaml
description: Use this agent when [conditions]. Examples:
```

**Requirements:**

- 10-5,000 characters
- Start with "Use this agent when..."
- Include 2-4 concrete `<example>` blocks
- Cover different phrasings for same intent
- Show both proactive and reactive scenarios

**Example Structure:**

```yaml
description: Use this agent when users need code review for quality and security. Examples:

<example>
<context>User has written new authentication code</context>
<user>Review this login implementation</user>
<assistant>I'll use the security-reviewer agent to check this.</assistant>
<commentary>
Security review is needed for authentication code. The agent will check
for common vulnerabilities like SQL injection and XSS.
</commentary>
</example>

<example>
<context>Pull request ready for review</context>
<user>Can you review PR #123?</user>
<assistant>I'll activate the code-reviewer agent.</assistant>
<commentary>
PR review requires comprehensive analysis. Agent will check code quality,
test coverage, and documentation.
</commentary>
</example>
```

#### model

**Options:**

- `inherit` (recommended) - Use host's default model
- `sonnet` - Claude Sonnet (balanced)
- `opus` - Claude Opus (most capable)
- `haiku` - Claude Haiku (fastest)

**Recommendation:** Use `inherit` unless agent needs specific model capabilities.

**When to Override:**

- `haiku` - Simple, fast tasks (file organization, formatting)
- `sonnet` - Standard complexity (code review, testing)
- `opus` - Complex reasoning (architecture design, refactoring)

#### color

**Purpose:** Visual identifier for agent in UI.

**Options:**

- `blue` - Analysis, review tasks
- `cyan` - Data processing, transformation
- `green` - Success operations, validation
- `yellow` - Warning, caution tasks
- `magenta` - Creative, generation tasks
- `red` - Security, critical tasks

**Choose based on agent purpose:**

```yaml
color: blue      # Code reviewer
color: green     # Test validator
color: red       # Security auditor
color: magenta   # Documentation generator
```

### Optional Fields

#### tools

**Purpose:** Restrict agent to specific tools (principle of least privilege).

**Default:** All tools available if omitted.

**Examples:**

```yaml
# Read-only agent
tools: [Read, Grep]

# Documentation agent
tools: [Read, Write]

# Full development agent
tools: [Read, Write, Grep, Bash]

# Git-focused agent
tools: [Read, Bash]
```

**Best Practice:** Only grant necessary tools. Avoid giving all tools unless required.

---

## System Prompt Design

The markdown body becomes the agent's system prompt.

### Writing Style

**Use second person** - Address the agent directly:

```markdown
You are a code review specialist.
You will analyze code for bugs and security issues.
```

**Not third person:**

```markdown
❌ The agent analyzes code...
❌ This agent will review...
```

### Recommended Structure

```markdown
# [Agent Name]

You are a [specialization] agent focused on [primary purpose].

## Core Responsibilities

1. [Primary responsibility with details]
2. [Secondary responsibility with details]
3. [Additional responsibilities]

## Analysis Process

Follow these steps:

1. **[Step 1 Name]**
   - [Specific action]
   - [What to look for]

2. **[Step 2 Name]**
   - [Specific action]
   - [Criteria to check]

3. **[Step 3 Name]**
   - [Specific action]
   - [Output requirements]

## Quality Standards

- [Standard 1]
- [Standard 2]
- [Standard 3]

## Output Format

Provide findings in this format:

[Specific format specification]

## Edge Cases

- **[Edge Case 1]**: [How to handle]
- **[Edge Case 2]**: [How to handle]
```

### Length Guidelines

**Recommended:** 500-3,000 characters

**Too Short (<500):** Lacks necessary detail
**Too Long (>3,000):** Difficult to maintain focus

### Specificity

✅ **Be specific about:**

- What to analyze
- How to analyze
- What to report
- Output format
- Edge cases

❌ **Avoid vague prompts:**

```markdown
❌ Review code for issues
✅ Check for SQL injection, XSS, authentication bypass, and insecure data handling
```

---

## Triggering Best Practices

### Concrete Examples Required

**Minimum:** 2-4 examples in description

**Each example should include:**

- `<context>` - Situation/background
- `<user>` - What user says
- `<assistant>` - How agent responds
- `<commentary>` - Why agent triggers

### Cover Different Phrasings

```yaml
description: Use this agent when reviewing code. Examples:

<example>
<user>Review this code</user>
...
</example>

<example>
<user>Can you check this implementation?</user>
...
</example>

<example>
<user>Look over these changes</user>
...
</example>
```

### Proactive vs Reactive

**Proactive Triggering:**

```yaml
<example>
<context>User just wrote new code</context>
<user>I've finished the login feature</user>
<assistant>I'll review it with the security-reviewer agent.</assistant>
<commentary>New code should be reviewed proactively</commentary>
</example>
```

**Reactive Triggering:**

```yaml
<example>
<context>User explicitly requests review</context>
<user>Review this authentication code</user>
<assistant>I'll use the security-reviewer agent.</assistant>
<commentary>Direct request for security review</commentary>
</example>
```

### When NOT to Trigger

Include negative examples:

```yaml
<example>
<user>What's the weather?</user>
<assistant>That's not a code review task.</assistant>
<commentary>Don't trigger for unrelated questions</commentary>
</example>
```

---

## Creating Agents

### Approach 1: AI-Assisted

1. Use structured prompt requesting agent configuration
2. Get JSON output with all fields
3. Convert to markdown with frontmatter

**Template Prompt:**

```
Create an agent for [purpose] that:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Provide as JSON with: name, description, model, color, tools, and system_prompt
```

### Approach 2: Manual

**Steps:**

1. **Choose identifier**

   ```
   security-reviewer
   test-generator
   doc-writer
   ```

2. **Write description with examples**

   ```yaml
   description: Use this agent when [conditions]. Examples:
   [2-4 concrete examples]
   ```

3. **Select model and color**

   ```yaml
   model: inherit
   color: blue
   ```

4. **Define tools (if restricting)**

   ```yaml
   tools: [Read, Grep]
   ```

5. **Write system prompt**

   ```markdown
   You are a [specialization].

   ## Responsibilities

   ...
   ```

6. **Save as `agents/agent-name.md`**

---

## Validation

### Identifier Validation

**Check:**

- [ ] 3-50 characters
- [ ] Lowercase only
- [ ] Hyphens for word separation
- [ ] Starts with letter/number
- [ ] Ends with letter/number
- [ ] No special characters except hyphens

### Description Validation

**Check:**

- [ ] 10-5,000 characters
- [ ] Starts with "Use this agent when..."
- [ ] Contains 2-4 `<example>` blocks
- [ ] Examples have all required fields
- [ ] Examples show different phrasings
- [ ] Commentary explains triggering logic

### System Prompt Validation

**Check:**

- [ ] 20-10,000 characters
- [ ] Uses second person ("You are...")
- [ ] Clear responsibilities listed
- [ ] Step-by-step process defined
- [ ] Output format specified
- [ ] Edge cases addressed

---

## Testing

### Test Triggering

**Verify agent activates correctly:**

```bash
# Start Claude Code
cc

# Try phrases from examples
"Review this authentication code"
"Check this implementation for bugs"
"Can you look over these changes?"
```

**Confirm:**

- Agent triggers with similar phrasing
- Agent doesn't trigger for unrelated tasks
- Correct agent activates (if multiple agents exist)

### Test Execution

**Verify agent follows system prompt:**

1. Give agent a typical task
2. Check if it follows defined process
3. Verify output matches specified format
4. Confirm quality standards are applied
5. Test edge case handling

---

## Best Practices Summary

### DO ✅

- Use clear, specific triggering conditions
- Include 2-4 concrete examples in description
- Write comprehensive system prompts
- Apply principle of least privilege for tools
- Test with multiple phrasings
- Cover both proactive and reactive scenarios
- Use second person in system prompt
- Define clear output formats
- Address edge cases

### DON'T ❌

- Use generic descriptions
- Omit triggering examples
- Write vague system prompts
- Grant unnecessary tool access
- Skip testing phase
- Use only one triggering phrase
- Write in third person
- Leave output format undefined
- Ignore edge cases

---

## Complete Example

### Security Reviewer Agent

```markdown
---
name: security-reviewer
description: Use this agent when reviewing code for security vulnerabilities and best practices. Examples:

<example>
<context>User has written new authentication code</context>
<user>Review this login implementation</user>
<assistant>I'll use the security-reviewer agent to check for vulnerabilities.</assistant>
<commentary>
Authentication code requires security review. Agent will check for common issues
like SQL injection, XSS, insecure password storage, and authentication bypass.
</commentary>
</example>

<example>
<context>Pull request with API endpoint changes</context>
<user>Check PR #123 for security issues</user>
<assistant>I'll activate the security-reviewer agent for this PR.</assistant>
<commentary>
API changes need security analysis. Agent will verify input validation,
authentication, authorization, and data exposure risks.
</commentary>
</example>

<example>
<context>User asks about weather</context>
<user>What's the weather today?</user>
<assistant>That's not a security review task.</assistant>
<commentary>Don't trigger for unrelated questions</commentary>
</example>

model: sonnet
color: red
tools: [Read, Grep, Bash]
---

# Security Review Agent

You are a security review specialist focused on identifying vulnerabilities and security best practices in code.

## Core Responsibilities

1. **Identify Security Vulnerabilities**
   - SQL injection risks
   - XSS (Cross-Site Scripting) vectors
   - Authentication/authorization flaws
   - Insecure data handling
   - CSRF vulnerabilities

2. **Verify Security Best Practices**
   - Input validation and sanitization
   - Secure password storage (hashing, salting)
   - Proper error handling (no sensitive info leakage)
   - HTTPS enforcement
   - Security headers configuration

3. **Assess Data Protection**
   - Sensitive data exposure
   - Encryption at rest and in transit
   - API key and secret management
   - PII (Personally Identifiable Information) handling

## Analysis Process

Follow these steps for each review:

1. **Code Scanning**
   - Read all relevant files
   - Identify authentication and authorization code
   - Locate data handling functions
   - Find API endpoints and routes

2. **Vulnerability Detection**
   - Check for SQL injection (dynamic queries without parameterization)
   - Look for XSS risks (unescaped user input in output)
   - Verify authentication mechanisms
   - Test authorization logic

3. **Best Practices Verification**
   - Confirm input validation exists
   - Check password hashing methods
   - Verify HTTPS usage
   - Review error handling

## Quality Standards

- **Zero tolerance for critical vulnerabilities**
- **Clear severity classification** (Critical/High/Medium/Low)
- **Actionable remediation steps** for each finding
- **Code examples** showing secure alternatives

## Output Format

Provide findings in this structure:
```

## Security Review: [File/Component Name]

### Critical Issues

- **[Vulnerability Type]** (file:line)
  - Issue: [Description]
  - Risk: [Impact explanation]
  - Fix: [Specific remediation]

### High Priority

- ...

### Medium Priority

- ...

### Low Priority

- ...

### Recommendations

- [General security improvements]

```

## Edge Cases

- **Third-party libraries**: Flag outdated or vulnerable dependencies
- **Configuration files**: Check for hardcoded secrets or credentials
- **Test files**: Ensure test credentials aren't production credentials
- **Legacy code**: Note security debt that needs gradual improvement
- **Unclear intent**: Ask for clarification before flagging as vulnerability
```

---

## File Organization

### Plugin Agents

```
plugin-name/
└── agents/
    ├── security-reviewer.md
    ├── test-generator.md
    └── doc-writer.md
```

### Personal Agents

```
~/.claude/
└── agents/
    ├── custom-reviewer.md
    └── project-helper.md
```

---

## Resources

- **Source:** [skills.sh/anthropics/claude-code/agent-development](https://skills.sh/anthropics/claude-code/agent-development)
- **Claude Code Docs:** [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)

---

**Last Updated:** January 2026
**Category:** Claude Code Agents
