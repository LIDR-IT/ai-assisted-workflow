# Agents Directory

This directory contains autonomous agents that handle complex, multi-step tasks independently.

## Overview

Agents are specialized subprocesses that execute workflows autonomously. They are triggered by commands or specific user requests, use multiple tools, read project rules, and can invoke skills for specialized knowledge.

## Available Agents

### doc-improver

**Purpose:** Audits and improves project documentation

**Triggered by:**
- `/improve-docs` command
- User asks to review/audit/improve documentation
- Requests to generate missing READMEs

**What it does:**
1. Reads `.agents/rules/process/documentation.md` for project standards
2. Analyzes documentation structure and content
3. Identifies gaps, outdated content, broken links
4. Reports findings with priorities
5. Implements approved improvements

**Tools used:** Read, Glob, Grep, Edit, Write, Bash, Skill

**Example usage:**
```bash
# Audit entire project
/improve-docs

# Audit specific directory
/improve-docs docs/guides

# Audit specific file
/improve-docs README.md
```

## Agent Architecture

Agents follow this pattern:

```
Command (UI) → Agent (Logic) → Rules (Constraints) + Skills (Knowledge)
```

### Agent Structure

Every agent file contains:

1. **YAML Frontmatter:**
   - `name` - Agent identifier
   - `description` - When to trigger (with examples)
   - `tools` - Available tools
   - `model` - Model preference
   - `color` - UI color

2. **System Prompt:**
   - Agent role and responsibilities
   - Working process (phases)
   - Rules to follow
   - Skills to use
   - Output format

### Agent vs Command vs Skill

**Agent:**
- Autonomous subprocess
- Multi-step workflow
- Takes decisions
- Uses multiple tools

**Command:**
- User interface
- Accepts arguments
- Invokes agents
- Documents usage

**Skill:**
- Specialized knowledge
- Invocable on-demand
- Reusable across agents
- Can include bundled resources

## Creating a New Agent

See: [Command → Agent → Skill Pattern Guide](../../docs/guides/patterns/command-agent-skill-pattern.md)

**Quick steps:**

1. Create agent file: `.agents/agents/your-agent.md`
2. Define frontmatter with trigger conditions
3. Write system prompt with workflow
4. Create invoking command: `.agents/commands/your-command.md`
5. Test invocation

**Or use:**
```bash
/agent-development  # Skill with full guide
```

## Agent Best Practices

### 1. Clear Trigger Conditions

Use examples in description to show when agent should activate:

```yaml
description: Use this agent when [conditions]. Examples:

<example>
user: "/command-name"
assistant: "I'll launch the agent..."
</example>
```

### 2. Always Read Rules First

Agents MUST read relevant project rules:

```markdown
## Phase 1: Discovery
1. Read `.agents/rules/relevant-rule.md`
2. Understand project standards
3. Proceed with workflow
```

### 3. Structured Workflow

Break agent work into phases:

```markdown
## Phase 1: Discovery
- Gather information
- Read rules

## Phase 2: Analysis
- Process data
- Identify issues

## Phase 3: Reporting
- Present findings
- Ask for approval

## Phase 4: Implementation
- Apply changes
- Verify results
```

### 4. Use Skills Sparingly

Only invoke skills for deep specialized knowledge:

```markdown
## When to use skills:
- Need specialized patterns (invoke skill)
- General task (use agent knowledge)
```

### 5. Request Approval for Changes

Never modify files without user consent:

```markdown
## Recommendations
1. Fix broken links
2. Update outdated examples

**Would you like me to implement these changes?**
```

## Synchronization

Agents are automatically synchronized to all platforms via `.agents/` directory:

- **Cursor:** Uses agents from `.agents/agents/`
- **Claude Code:** Uses agents from `.agents/agents/`
- **Gemini CLI:** Uses agents from `.agents/agents/`
- **Antigravity:** May need manual configuration

No sync script needed - agents are read directly from source.

## Testing Agents

### Manual Test

```bash
# Invoke via command
/improve-docs

# Or ask directly
"Can you audit the documentation?"
```

### Verify Agent Reads Rules

Check agent output mentions standards from project rules.

### Verify Agent Uses Tools

Check agent uses Read, Glob, Grep, etc. appropriately.

## Related Documentation

- [Command → Agent → Skill Pattern](../../docs/guides/patterns/command-agent-skill-pattern.md)
- [Agent Development Skill](../skills/agent-development/)
- [Command Development Skill](../skills/command-development/)
- [Documentation Standards](../rules/process/documentation.md)
