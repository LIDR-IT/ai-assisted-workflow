# Subagent Integration

## Overview

Skills and subagents are two powerful features in Claude Code that can be combined in different ways to create sophisticated workflows. Understanding how they interact allows you to build complex, isolated execution environments while maintaining clean separation of concerns.

This guide covers the two primary integration patterns: **skills that run in subagents** (using `context: fork`) and **subagents that preload skills** (using the `skills` field in agent definitions).

## What is Subagent Integration?

Subagent integration refers to how skills and subagents work together:

1. **Skill-First Approach**: A skill uses `context: fork` to execute in an isolated subagent
2. **Agent-First Approach**: A subagent definition preloads skills as reference material

Both approaches create isolated execution contexts, but they differ in how the task is defined and what role skills play.

## When to Use Each Approach

### Use Skill with `context: fork` When:

- You have a **complete, explicit task** defined in the skill
- The skill contains step-by-step instructions
- You want to trigger the task from the main conversation
- The task should run independently without conversation history
- You need to specify which agent type handles the task

**Examples:**
- Deep research on a codebase feature
- Generate a comprehensive test suite
- Analyze security vulnerabilities
- Create documentation from code

### Use Subagent with Preloaded Skills When:

- You're defining a **custom agent type** with specific capabilities
- Skills provide **reference material and guidelines** (not the task itself)
- Claude delegates work to the subagent (task comes from Claude)
- The subagent needs domain knowledge or conventions
- You want reusable agent configurations

**Examples:**
- Code review agent with style guide skills
- Deployment agent with infrastructure knowledge
- Test generation agent with testing conventions
- Refactoring agent with architecture patterns

## How Skill-First Integration Works

### The `context: fork` Pattern

When a skill includes `context: fork`, it runs in a completely isolated environment:

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:

1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Identify patterns and conventions
4. Summarize findings with specific file references

Focus on understanding the overall architecture and key design decisions.
```

### Execution Flow

1. **Invocation**: User or Claude invokes `/deep-research authentication`
2. **Fork Creation**: New isolated context created (no conversation history)
3. **Content Loading**: Skill content becomes the subagent's task prompt
4. **Agent Selection**: `agent: Explore` determines which agent handles the task
5. **Execution**: Subagent executes with appropriate tools and permissions
6. **Return**: Results summarized and returned to main conversation

### What Gets Loaded

When a skill runs with `context: fork`:

| Content | Loaded? | Purpose |
|---------|---------|---------|
| Skill content | ✅ Yes | Becomes the task prompt |
| CLAUDE.md | ✅ Yes | Project/personal memory |
| Conversation history | ❌ No | Isolated execution |
| Other skills | ❌ No | Only the invoked skill |
| Agent system prompt | ✅ Yes | From `agent` field |

### Agent Types

The `agent` field determines execution environment:

**Built-in agents:**
- `Explore` - Research and analysis focused
- `Plan` - Planning and strategy focused
- `general-purpose` - Default balanced agent

**Custom agents:**
- Any agent from `.claude/agents/` directory
- Use agent name: `agent: my-custom-agent`

**Example with custom agent:**

```yaml
---
name: refactor-component
description: Refactor a component following our patterns
context: fork
agent: refactoring-expert  # Custom agent from .claude/agents/
---

Refactor the $0 component:

1. Read current implementation
2. Identify code smells
3. Apply refactoring patterns
4. Ensure tests still pass
5. Document changes
```

## How Agent-First Integration Works

### The Subagent with Skills Pattern

Subagents can preload skills as reference material:

**.claude/agents/code-reviewer.md:**
```yaml
---
name: code-reviewer
description: Reviews code for quality and style
skills:
  - style-guide
  - security-checklist
  - performance-patterns
---

You are an expert code reviewer. Review code changes thoroughly:

1. Check against style guide
2. Identify security issues
3. Evaluate performance implications
4. Suggest improvements

Be constructive and specific in feedback.
```

### Execution Flow

1. **Delegation**: Claude delegates task to code-reviewer subagent
2. **Context Creation**: New isolated context created
3. **Skills Loading**: Preloaded skills loaded into context
4. **Task Assignment**: Claude's delegation message becomes the task
5. **Execution**: Subagent executes with skills as reference
6. **Return**: Results returned to main conversation

### What Gets Loaded

When a subagent runs with preloaded skills:

| Content | Loaded? | Purpose |
|---------|---------|---------|
| Subagent markdown body | ✅ Yes | System prompt |
| Preloaded skills (full content) | ✅ Yes | Reference material |
| CLAUDE.md | ✅ Yes | Project/personal memory |
| Conversation history | ❌ No | Isolated execution |
| Claude's delegation | ✅ Yes | The actual task |

### Preloaded Skills Format

Skills listed in the `skills` field are **fully loaded** (not just descriptions):

```yaml
---
name: test-generator
skills:
  - testing-conventions    # Full skill content loaded
  - test-patterns         # Full skill content loaded
  - assertion-library     # Full skill content loaded
---

Generate comprehensive tests following our conventions.
```

**Important:** These skills provide **knowledge and guidelines**, not tasks. The task comes from Claude's delegation message.

## Comparison Matrix

| Aspect | Skill with `context: fork` | Subagent with `skills` |
|--------|---------------------------|------------------------|
| **Task definition** | In skill content | From Claude's delegation |
| **System prompt** | From agent type | Subagent's markdown body |
| **Skills role** | The task itself | Reference material |
| **Triggered by** | User or Claude invokes skill | Claude delegates to agent |
| **Best for** | Explicit, complete tasks | Domain-specific agent types |
| **CLAUDE.md** | ✅ Loaded | ✅ Loaded |
| **Conversation history** | ❌ Not loaded | ❌ Not loaded |

## Complete Examples

### Example 1: Research Skill (Skill-First)

**Skill with explicit task:**

**.claude/skills/analyze-security/SKILL.md:**
```yaml
---
name: analyze-security
description: Analyze codebase for security vulnerabilities
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Perform a comprehensive security analysis of the codebase:

## Phase 1: Input Validation
- Scan for user input handling
- Check for SQL injection vulnerabilities
- Identify XSS risks

## Phase 2: Authentication
- Review authentication logic
- Check session management
- Verify password handling

## Phase 3: Authorization
- Identify permission checks
- Look for privilege escalation risks
- Review access control

## Output
Provide a prioritized list of security issues with:
- Severity level (Critical, High, Medium, Low)
- File location and line numbers
- Specific recommendation
- Example fix if applicable
```

**Usage:**
```
/analyze-security
```

**Result:** Complete security report generated in isolation.

### Example 2: Code Reviewer Agent (Agent-First)

**Agent with preloaded skills:**

**.claude/agents/code-reviewer.md:**
```yaml
---
name: code-reviewer
description: Expert code reviewer with knowledge of project standards
skills:
  - style-guide
  - security-checklist
  - testing-requirements
model: opus
---

You are an expert code reviewer for this project.

When reviewing code:

1. **Style & Conventions**
   - Follow the style-guide skill
   - Check naming consistency
   - Verify code organization

2. **Security**
   - Apply security-checklist
   - Identify vulnerabilities
   - Suggest secure alternatives

3. **Testing**
   - Verify testing-requirements met
   - Check test coverage
   - Validate edge cases

4. **Quality**
   - Assess code clarity
   - Identify potential bugs
   - Suggest improvements

Provide specific, actionable feedback with file/line references.
```

**Supporting skills:**

**.claude/skills/style-guide/SKILL.md:**
```yaml
---
name: style-guide
description: Project code style conventions
user-invocable: false
---

# Code Style Guide

## Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use UPPER_SNAKE_CASE for constants

## File Organization
- One component per file
- Group related utilities
- Co-locate tests with implementation
```

**.claude/skills/security-checklist/SKILL.md:**
```yaml
---
name: security-checklist
description: Security review checklist
user-invocable: false
---

# Security Checklist

## Input Validation
- [ ] All user input sanitized
- [ ] SQL queries use parameterization
- [ ] File paths validated

## Authentication
- [ ] Passwords hashed with bcrypt
- [ ] Session tokens properly secured
- [ ] MFA available for sensitive operations
```

**Usage:**

Claude automatically delegates to code-reviewer when reviewing code:

```
"Review the changes in src/auth/login.ts"
```

Claude invokes the code-reviewer subagent, which has access to style-guide and security-checklist as reference material.

### Example 3: Combined Approach

You can use both patterns together:

**.claude/skills/deep-test-generation/SKILL.md:**
```yaml
---
name: deep-test-generation
description: Generate comprehensive test suite
context: fork
agent: test-expert  # Custom agent with testing skills
---

Generate a comprehensive test suite for $ARGUMENTS:

1. Analyze the code structure
2. Identify all testable units
3. Create test cases covering:
   - Happy paths
   - Error conditions
   - Edge cases
   - Integration points
4. Follow project testing conventions
5. Ensure proper mocking and setup
```

**.claude/agents/test-expert.md:**
```yaml
---
name: test-expert
description: Testing specialist with framework knowledge
skills:
  - jest-patterns
  - mocking-conventions
  - assertion-best-practices
---

You are a testing expert. Write thorough, maintainable tests.
```

**Result:** The skill provides the task, the agent provides testing expertise.

## Best Practices

### 1. Choose the Right Pattern

✅ **DO:** Use skill-first for complete, explicit tasks:

```yaml
---
name: generate-docs
context: fork
---

Generate API documentation for all endpoints in src/api/.
```

✅ **DO:** Use agent-first for reusable agent types:

```yaml
---
name: deployment-specialist
skills:
  - infrastructure-knowledge
  - deployment-checklist
---

You are a deployment expert. Execute deployments safely.
```

❌ **DON'T:** Use skill-first with only guidelines (subagent has no task):

```yaml
---
name: bad-example
context: fork
---

When writing code, follow these conventions:
- Use TypeScript
- Add JSDoc comments
```

### 2. Task Definition Clarity

✅ **DO:** Provide explicit tasks in skill content:

```yaml
---
context: fork
---

Research the authentication flow:
1. Find auth-related files
2. Trace the login sequence
3. Identify security measures
4. Document the flow
```

❌ **DON'T:** Expect subagent to infer task from guidelines alone.

### 3. Skill Loading Strategy

✅ **DO:** Use `user-invocable: false` for agent-supporting skills:

```yaml
---
name: testing-patterns
user-invocable: false  # Only for agent reference
---
```

✅ **DO:** Keep supporting skills focused on knowledge, not tasks.

### 4. Agent Selection

✅ **DO:** Match agent type to task requirements:

```yaml
# Research task -> Explore agent
agent: Explore

# Planning task -> Plan agent
agent: Plan

# Custom domain -> Custom agent
agent: refactoring-expert
```

### 5. Tool Restrictions

✅ **DO:** Restrict tools appropriately for the task:

```yaml
---
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob  # Read-only research
---
```

### 6. Model Selection

✅ **DO:** Specify model for complex agent tasks:

```yaml
---
name: architecture-reviewer
skills:
  - design-patterns
  - best-practices
model: opus  # Use most capable model
---
```

## Platform Compatibility

### Claude Code

| Feature | Support |
|---------|---------|
| `context: fork` | ✅ Full support |
| Custom agents | ✅ Full support |
| Preloaded skills | ✅ Full support |
| Built-in agents | ✅ Explore, Plan, general-purpose |

### Other Platforms

**Cursor, Gemini CLI, Antigravity:**
- Check platform-specific documentation
- `context: fork` may not be supported
- Custom agents may not be available
- Skills may work differently

## Common Pitfalls

### 1. Guidelines Without Task

❌ **Problem:**

```yaml
---
context: fork
---

Follow our coding standards:
- Use TypeScript
- Write tests
- Document functions
```

**Issue:** Subagent receives guidelines but no actionable task. Returns without doing anything meaningful.

✅ **Solution:** Add explicit task or remove `context: fork`.

### 2. Mixing Task and Guidelines

❌ **Problem:**

```yaml
---
context: fork
---

Our API conventions:
- REST endpoints use plural nouns
- Return 404 for missing resources

Create API endpoints for the user model.
```

**Issue:** Unclear if this is a convention reference or a task.

✅ **Solution:** Separate conventions (skill) from task (agent delegation or different skill).

### 3. Over-Nesting

❌ **Problem:**

Skill A (context: fork) invokes Skill B (context: fork) which invokes Skill C (context: fork).

**Issue:** Deep nesting makes debugging difficult and context confusing.

✅ **Solution:** Keep execution hierarchies shallow. Use subagents for discrete tasks.

## Troubleshooting

### Subagent Returns Empty Results

**Problem:** Skill with `context: fork` returns without meaningful output.

**Diagnosis:**
1. Check if skill contains explicit task (not just guidelines)
2. Verify agent type is appropriate for task
3. Ensure allowed-tools include necessary capabilities

**Solution:**
```yaml
# Before (guidelines only)
---
context: fork
---
Follow these patterns when refactoring...

# After (explicit task)
---
context: fork
---
Refactor $ARGUMENTS following these patterns:
1. Read the file
2. Identify improvements
3. Apply changes
4. Verify tests pass
```

### Skills Not Loading in Subagent

**Problem:** Preloaded skills don't appear in subagent context.

**Diagnosis:**
1. Verify skill names are correct
2. Check skills exist in `.claude/skills/`
3. Look for warnings about skill loading

**Solution:**
```yaml
# Ensure skills exist
---
skills:
  - existing-skill  # Must exist in .claude/skills/existing-skill/
---
```

### Wrong Agent Type Used

**Problem:** Task requires different capabilities than agent provides.

**Diagnosis:**
1. Check if agent type matches task (Explore for research, custom for domain work)
2. Verify custom agent exists if specified

**Solution:**
```yaml
# Research task
agent: Explore

# Planning task
agent: Plan

# Domain-specific task
agent: my-custom-agent  # Must exist in .claude/agents/
```

## Related Documentation

- [Sub-agents in Claude Code](../../agents/sub-agents-claude-code.md) - Complete subagent guide
- [Skills in Claude Code](../claude-code.md) - Complete skills reference
- [Tool Restrictions](tool-restrictions.md) - Controlling tool access
- [Dynamic Context](dynamic-context.md) - Command injection patterns

## Further Reading

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Subagents:** [code.claude.com/docs/en/subagents](https://code.claude.com/docs/en/subagents)
- **Agent Skills Standard:** [agentskills.io](https://agentskills.io)

---

**Last Updated:** February 2026
**Category:** Skills - Advanced
**Platform:** Claude Code
