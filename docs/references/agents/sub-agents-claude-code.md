# Sub-Agents in Claude Code

## Overview

**Sub-agents** are specialized AI assistants in Claude Code that handle specific types of tasks. Each sub-agent runs in its own context window with a custom system prompt, specific tool access, and independent permissions.

**Source:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)

---

## What Are Sub-Agents?

### Definition

Sub-agents are autonomous AI assistants that:
- Run in **separate context windows**
- Have **custom system prompts**
- Use **specific tool subsets**
- Maintain **independent permissions**
- **Return results** to main conversation

### Key Concept

When Claude encounters a task matching a sub-agent's description, it **delegates** to that sub-agent, which works independently and returns results.

---

## Benefits

### 1. Preserve Context

Keep exploration and implementation out of your main conversation.

**Example:**
- Research task generates 10,000 tokens of analysis
- Only summary (500 tokens) returns to main conversation
- Main context stays focused

### 2. Enforce Constraints

Limit which tools a sub-agent can use.

**Example:**
- Read-only reviewer cannot modify files
- Database agent can only run SELECT queries
- Security scanner has no network access

### 3. Reuse Configurations

Share sub-agents across projects with user-level agents.

**Example:**
- Code reviewer available in all projects
- Testing agent works everywhere
- Custom workflows persist

### 4. Specialize Behavior

Focused system prompts for specific domains.

**Example:**
- Security expert for vulnerability scanning
- Performance optimizer for speed improvements
- Documentation writer for API docs

### 5. Control Costs

Route tasks to faster, cheaper models like Haiku.

**Example:**
- Exploration with Haiku (fast, cheap)
- Complex reasoning with Sonnet (balanced)
- Critical analysis with Opus (capable)

---

## Built-in Sub-Agents

Claude Code includes several built-in sub-agents:

### Explore

**Purpose:** Fast, read-only codebase exploration

**Configuration:**
- **Model:** Haiku (fast, low-latency)
- **Tools:** Read-only (no Write/Edit)
- **Use cases:** File discovery, code search, codebase understanding

**Thoroughness Levels:**
- `quick` - Targeted lookups
- `medium` - Balanced exploration
- `very thorough` - Comprehensive analysis

**When Claude uses it:**
- Searching for files
- Understanding code structure
- Finding patterns
- Analyzing dependencies

### Plan

**Purpose:** Research agent for plan mode

**Configuration:**
- **Model:** Inherits from main
- **Tools:** Read-only
- **Use cases:** Codebase research for planning

**When Claude uses it:**
- During plan mode
- Gathering context before presenting plan
- Understanding existing implementation

**Important:** Prevents infinite nesting (sub-agents cannot spawn sub-agents)

### General-Purpose

**Purpose:** Complex, multi-step tasks

**Configuration:**
- **Model:** Inherits from main
- **Tools:** All tools
- **Use cases:** Complex research, multi-step operations, modifications

**When Claude uses it:**
- Both exploration and modification needed
- Complex reasoning required
- Multiple dependent steps
- Sophisticated analysis

### Other Built-in Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| Bash | Inherits | Terminal commands in separate context |
| statusline-setup | Sonnet | Configure status line (`/statusline` command) |
| Claude Code Guide | Haiku | Answer questions about Claude Code features |

---

## Creating Sub-Agents

### Quick Start with `/agents` Command

**Recommended method** for creating and managing sub-agents.

**Steps:**

1. **Open interface:**
   ```
   /agents
   ```

2. **Create new agent:**
   - Select "Create new agent"
   - Choose "User-level" or "Project-level"

3. **Generate with Claude:**
   - Select "Generate with Claude"
   - Describe the sub-agent

4. **Configure tools:**
   - Select which tools to allow
   - Deselect for restrictions

5. **Select model:**
   - Choose: Haiku, Sonnet, or Opus
   - Or use "inherit"

6. **Choose color:**
   - Visual identifier in UI

7. **Save:**
   - Available immediately (no restart)

### Manual Creation

Create Markdown files with YAML frontmatter.

**Example:**

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Grep, Glob
model: sonnet
---

You are a code reviewer. Analyze code and provide specific,
actionable feedback on quality, security, and best practices.
```

---

## Sub-Agent Scope

### Storage Locations

| Location | Scope | Priority | Use Case |
|----------|-------|----------|----------|
| `--agents` CLI flag | Current session | 1 (highest) | Testing, automation |
| `.claude/agents/` | Project | 2 | Team workflows |
| `~/.claude/agents/` | User (all projects) | 3 | Personal tools |
| Plugin `agents/` | Where plugin enabled | 4 (lowest) | Distributed agents |

**Priority:** When multiple sub-agents share the same name, higher priority wins.

### Project Sub-Agents

**Location:** `.claude/agents/`

**Benefits:**
- Specific to codebase
- Version controlled
- Team collaboration
- Shared improvements

**Use cases:**
- Project-specific workflows
- Team standards
- Codebase conventions

### User Sub-Agents

**Location:** `~/.claude/agents/`

**Benefits:**
- Available everywhere
- Personal preferences
- Cross-project consistency

**Use cases:**
- Personal workflows
- Coding style
- Common patterns

### CLI-Defined Sub-Agents

**Method:** `--agents` flag

**Format:**
```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob"],
    "model": "sonnet"
  }
}'
```

**Benefits:**
- Session-only (not saved)
- Quick testing
- Automation scripts
- Temporary workflows

### Plugin Sub-Agents

**Location:** Plugin's `agents/` directory

**Benefits:**
- Distributed with plugin
- Automatic installation
- Shared across teams
- Version controlled

---

## Configuration

### Frontmatter Fields

#### Required Fields

**`name`**
- Unique identifier
- Lowercase letters and hyphens
- Examples: `code-reviewer`, `test-runner`, `security-scanner`

**`description`**
- When Claude should delegate
- Include concrete examples
- Be specific about triggers

**Example:**
```yaml
description: Expert code reviewer. Use proactively after code changes to check quality, security, and best practices.
```

#### Optional Fields

**`tools`**
- Tools the sub-agent can use
- Allowlist approach
- Inherits all if omitted

**Example:**
```yaml
tools: Read, Grep, Glob, Bash
```

**`disallowedTools`**
- Tools to deny
- Denylist approach
- Removed from inherited list

**Example:**
```yaml
disallowedTools: Write, Edit
```

**`model`**
- Which model to use
- Options: `sonnet`, `opus`, `haiku`, `inherit`
- Defaults to `inherit`

**`permissionMode`**
- How to handle permissions
- Options: `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`

**Permission Modes:**

| Mode | Behavior |
|------|----------|
| `default` | Standard permission prompts |
| `acceptEdits` | Auto-accept file edits |
| `dontAsk` | Auto-deny prompts (allowed tools still work) |
| `bypassPermissions` | Skip all checks (⚠️ use with caution) |
| `plan` | Read-only plan mode |

**`skills`**
- Skills to preload into context
- Full content injected at startup
- Not inherited from parent

**Example:**
```yaml
skills:
  - api-conventions
  - error-handling-patterns
```

**`hooks`**
- Lifecycle hooks for this sub-agent
- Scoped to sub-agent only
- Cleaned up when finished

---

## Tool Control

### Available Tools

Sub-agents can use Claude Code's internal tools:
- Read, Write, Edit
- Grep, Glob
- Bash
- MCP tools (if inherited)

### Tool Restrictions

**Allowlist (tools field):**
```yaml
tools: Read, Grep, Glob
```

**Denylist (disallowedTools field):**
```yaml
tools: Read, Write, Edit, Grep, Glob
disallowedTools: Write, Edit
# Result: Read, Grep, Glob only
```

### Conditional Tool Control with Hooks

For dynamic control, use `PreToolUse` hooks:

**Example: Read-only database queries**

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

**Validation script:**
```bash
#!/bin/bash
# validate-readonly-query.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Block SQL write operations
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b' > /dev/null; then
  echo "Blocked: Only SELECT queries allowed" >&2
  exit 2
fi

exit 0
```

### Disable Specific Sub-Agents

**Via settings.json:**
```json
{
  "permissions": {
    "deny": ["Task(Explore)", "Task(my-custom-agent)"]
  }
}
```

**Via CLI:**
```bash
claude --disallowedTools "Task(Explore)"
```

---

## Hooks for Sub-Agents

### Hooks in Sub-Agent Frontmatter

Define hooks that run only while sub-agent is active.

**Available events:**

| Event | Matcher Input | When it Fires |
|-------|---------------|---------------|
| `PreToolUse` | Tool name | Before using tool |
| `PostToolUse` | Tool name | After using tool |
| `Stop` | (none) | When sub-agent finishes |

**Example:**
```yaml
---
name: code-reviewer
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
  Stop:
    - hooks:
        - type: command
          command: "./scripts/cleanup.sh"
---
```

### Project-Level Hooks

**In settings.json:**

Define hooks that respond to sub-agent lifecycle in main session.

**Available events:**

| Event | Matcher Input | When it Fires |
|-------|---------------|---------------|
| `SubagentStart` | Agent type name | When sub-agent begins |
| `SubagentStop` | Agent type name | When sub-agent completes |

**Example:**
```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/setup-db-connection.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": "db-agent",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/cleanup-db-connection.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Working with Sub-Agents

### Automatic Delegation

Claude automatically delegates based on:
- Task description in request
- Sub-agent `description` field
- Current context

**Encourage proactive delegation:**
```yaml
description: Expert code reviewer. Use proactively after code changes.
```

### Explicit Invocation

Request specific sub-agent:
```
Use the test-runner sub-agent to fix failing tests
Have the code-reviewer sub-agent look at my recent changes
```

### Foreground vs Background

**Foreground (blocking):**
- Blocks main conversation
- Permission prompts passed through
- Can ask clarifying questions
- Full interactivity

**Background (concurrent):**
- Runs concurrently
- Pre-approved permissions only
- Auto-denies unapproved requests
- No clarifying questions
- No MCP tools

**Control:**
- Claude decides based on task
- Ask: "run this in the background"
- Press **Ctrl+B** to background running task

**Disable background:**
```bash
export CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1
```

### Common Patterns

#### 1. Isolate High-Volume Operations

Keep verbose output in sub-agent context:

```
Use a sub-agent to run the test suite and report only failing tests
```

**Benefit:** Main context stays clean

#### 2. Parallel Research

Independent investigations run simultaneously:

```
Research auth, database, and API modules in parallel using separate sub-agents
```

**Benefit:** Faster completion

⚠️ **Warning:** Each sub-agent returns results to main context

#### 3. Chain Sub-Agents

Multi-step workflows:

```
Use code-reviewer to find issues, then use optimizer to fix them
```

**Workflow:**
1. Sub-agent 1 completes → returns results
2. Claude analyzes results
3. Claude delegates to sub-agent 2
4. Sub-agent 2 completes → returns results

### When to Use Sub-Agents vs Main Conversation

**Use Main Conversation When:**
- Frequent back-and-forth needed
- Iterative refinement
- Phases share significant context
- Quick, targeted changes
- Latency matters

**Use Sub-Agents When:**
- Verbose output not needed in main context
- Specific tool restrictions required
- Self-contained work
- Summary sufficient

**Consider Skills When:**
- Reusable prompts/workflows
- Main conversation context preferred
- Not isolated execution

---

## Context Management

### Resuming Sub-Agents

Each invocation creates new instance with fresh context.

**To continue existing work:**
```
Use code-reviewer to review auth module
[Agent completes]

Continue that review and analyze authorization logic
[Claude resumes with full context]
```

**Benefits:**
- Retains full conversation history
- Includes all tool calls and results
- Preserves reasoning
- Picks up where it stopped

**Finding Agent IDs:**
- Ask Claude for the ID
- Check transcripts: `~/.claude/projects/{project}/{sessionId}/subagents/`
- Each stored as: `agent-{agentId}.jsonl`

### Transcript Persistence

**Storage:**
- Independent of main conversation
- Separate files per sub-agent
- Session-scoped

**Persistence:**
- Main conversation compaction → sub-agent unaffected
- Session restart → can resume same sub-agent
- Automatic cleanup → after `cleanupPeriodDays` (default: 30)

### Auto-Compaction

Sub-agents support automatic compaction:
- Same logic as main conversation
- Default: triggers at ~95% capacity
- Override: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`

**Logged in transcript:**
```json
{
  "type": "system",
  "subtype": "compact_boundary",
  "compactMetadata": {
    "trigger": "auto",
    "preTokens": 167189
  }
}
```

---

## Example Sub-Agents

### 1. Code Reviewer (Read-Only)

```markdown
---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes for quality, security, and maintainability checks.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code clarity and readability
- Proper naming conventions
- No code duplication
- Proper error handling
- No exposed secrets
- Input validation
- Test coverage
- Performance considerations

Provide feedback by priority:
- **Critical** (must fix)
- **Warnings** (should fix)
- **Suggestions** (consider)

Include specific examples of fixes.
```

### 2. Debugger (Can Modify)

```markdown
---
name: debugger
description: Debugging specialist for errors, failures, and unexpected behavior. Use proactively when encountering issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error and stack trace
2. Identify reproduction steps
3. Isolate failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze errors and logs
- Check recent changes
- Form and test hypotheses
- Add strategic logging
- Inspect variable states

For each issue provide:
- Root cause explanation
- Supporting evidence
- Specific code fix
- Testing approach
- Prevention recommendations

Fix underlying issue, not symptoms.
```

### 3. Data Scientist (Domain-Specific)

```markdown
---
name: data-scientist
description: Data analysis expert for SQL, BigQuery, and insights. Use proactively for data analysis and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery.

When invoked:
1. Understand analysis requirement
2. Write efficient SQL queries
3. Use BigQuery CLI (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Optimized SQL with proper filters
- Appropriate aggregations/joins
- Comment complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain query approach
- Document assumptions
- Highlight key findings
- Suggest next steps

Ensure queries are efficient and cost-effective.
```

### 4. Database Query Validator (Hook-Based)

**Sub-agent file:**
```markdown
---
name: db-reader
description: Execute read-only database queries for analysis and reporting.
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---

You are a database analyst with read-only access.

When analyzing data:
1. Identify relevant tables
2. Write efficient SELECT queries
3. Present results with context

You cannot modify data. If asked to INSERT, UPDATE, DELETE, or modify schema, explain you only have read access.
```

**Validation script (`scripts/validate-readonly-query.sh`):**
```bash
#!/bin/bash
# Blocks SQL write operations, allows SELECT only

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block write operations (case-insensitive)
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|REPLACE|MERGE)\b' > /dev/null; then
  echo "Blocked: Write operations not allowed. Use SELECT queries only." >&2
  exit 2
fi

exit 0
```

**Make executable:**
```bash
chmod +x ./scripts/validate-readonly-query.sh
```

---

## Best Practices

### Design

✅ **DO:**
- Design focused sub-agents (one task each)
- Write detailed descriptions for delegation
- Limit tool access to minimum needed
- Include specific examples in description
- Use proactive language: "Use proactively after..."

❌ **DON'T:**
- Create generic, multi-purpose sub-agents
- Use vague descriptions
- Grant unnecessary permissions
- Skip examples in description

### Documentation

✅ **DO:**
- Check into version control (project sub-agents)
- Document tool requirements
- Explain permission needs
- Include usage examples
- Maintain system prompt quality

❌ **DON'T:**
- Keep sub-agents local only
- Forget to document restrictions
- Leave system prompt vague
- Skip testing before sharing

### Context Management

✅ **DO:**
- Use sub-agents for verbose operations
- Resume for continued work
- Monitor context usage
- Clean up old transcripts

❌ **DON'T:**
- Run many verbose sub-agents in parallel
- Start fresh when resuming would work
- Ignore transcript storage

---

## Limitations

### What Sub-Agents Cannot Do

❌ **Spawn other sub-agents**
- Sub-agents cannot delegate to other sub-agents
- Prevents infinite nesting
- Use main conversation to chain sub-agents

❌ **Access parent context**
- Start with fresh context
- Only receive their system prompt
- Don't inherit main conversation history

❌ **Use skills automatically**
- Must explicitly list in `skills` field
- Don't inherit from parent

### Background Sub-Agent Limitations

❌ **No MCP tools** in background mode
❌ **Cannot ask clarifying questions** (tool calls fail)
❌ **Pre-approved permissions only**

**Solution:** Resume in foreground if permissions needed

---

## Resources

- **Official Docs:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
- **Hooks Reference:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- **Skills Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **MCP Integration:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)

---

## Related References

**In This Repository:**

- `agent-development-claude-code.md` - Creating autonomous agents
- `agents-md-format.md` - AGENTS.md file format
- `docs/references/commands/` - Command development
- `docs/references/skills/` - Skills ecosystem
- `docs/references/mcp/` - Model Context Protocol

---

**Last Updated:** January 2026
**Category:** Claude Code Sub-Agents
**Status:** Active Feature
