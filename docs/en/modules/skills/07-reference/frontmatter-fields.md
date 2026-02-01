# SKILL.md Frontmatter Fields Reference

## Overview

This document provides a complete reference for all frontmatter fields available in SKILL.md files. Frontmatter is YAML metadata placed between `---` markers at the top of a SKILL.md file that controls skill behavior, invocation, and platform integration.

**Basic Example:**
```yaml
---
name: skill-name
description: What this skill does and when to use it
version: 1.0.0
---
```

**All frontmatter fields are optional**, though `name` and `description` are strongly recommended for proper skill discovery and triggering.

---

## Field Reference

### name

**Type:** `string`

**Required:** No (uses directory name if omitted)

**Default:** Directory name containing SKILL.md

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ✅ Full support
- Cross-platform: ✅ Recommended

**Purpose:**

Display name and identifier for the skill. Used in slash command menus, skill discovery, and when Claude references the skill.

**Format:**
- Lowercase letters, numbers, hyphens only
- No spaces or special characters (except hyphens)
- Maximum 64 characters
- Use kebab-case convention
- Underscores not recommended

**Examples:**

✅ **Valid names:**
```yaml
name: react-component-generator
name: api-security-audit
name: deploy-prod
name: fix-issue
name: pdf-editor
```

❌ **Invalid names:**
```yaml
name: React Component Generator  # Spaces not allowed
name: api_security_audit         # Underscores discouraged
name: DeployProd                 # Uppercase not allowed
name: fix/issue                  # Slashes not allowed
name: skill-with-an-extremely-long-name-that-exceeds-the-sixty-four-character-limit  # Too long
```

**Common Mistakes:**
- Using spaces instead of hyphens
- Including uppercase letters
- Omitting name and relying on directory (explicit is better)
- Using underscores (works but inconsistent)

**Best Practice:**

Always explicitly set `name` even though it defaults to directory name. This makes the skill self-documenting and portable.

```yaml
# Good - explicit and clear
name: code-review

# Works but implicit
# (no name field, uses directory "code-review")
```

---

### description

**Type:** `string`

**Required:** No (uses first paragraph of markdown content if omitted)

**Default:** First paragraph from SKILL.md body

**Platform Support:**
- Claude Code: ✅ Critical for auto-invocation
- Antigravity: ✅ Full support
- Cross-platform: ✅ Essential

**Purpose:**

**Most important field** for skill triggering. Claude uses this to decide when to automatically invoke the skill. Acts as the matching algorithm between user intent and skill activation.

**Format:**
- Include 2-4 concrete trigger phrases users would naturally say
- Be specific, not generic
- Use third-person voice: "This skill should be used when..."
- Include keywords and variations
- Length: 1-3 sentences (aim for clarity over brevity)

**Formula:** `[Action] [Target] [Context] when [Trigger conditions]`

**Examples:**

✅ **Excellent descriptions (specific triggers):**

```yaml
# Hooks skill - concrete phrases
description: This skill should be used when the user asks to "create a hook", "add a PreToolUse hook", "validate tool use", or "implement hook validation"

# Component generator - clear use cases
description: Generates React functional components with TypeScript, hooks, and tests. Use when creating new React components or converting class components.

# Database migrations - specific conditions
description: Validates database schema migrations for consistency and safety. Use when reviewing migration files or before applying database changes.

# Code explanation - natural triggers
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

❌ **Poor descriptions (too vague):**

```yaml
# Too generic
description: Helps with code

# No triggers
description: Database tools

# No context
description: Provides guidance for hooks

# Too broad
description: General development assistance
```

**Trigger Matching:**

Claude matches user input against descriptions to decide which skills to load. Include phrases users would actually type or say:

```yaml
# User says: "create a React component"
# Matches: "creating new React components"
description: Generates React functional components. Use when creating new React components.

# User says: "how does authentication work?"
# Matches: "how does this work"
description: Explains code. Use when the user asks "how does this work?"
```

**Common Mistakes:**
- Being too vague or generic
- Not including trigger phrases
- Writing from wrong perspective (first/second person)
- Forgetting to include variations users might say

**Best Practice:**

Test your description by asking "Would a user naturally say these exact phrases?" Include the most common variations.

```yaml
# Include multiple trigger variations
description: This skill should be used when the user asks to "fix a bug", "debug an issue", "resolve a problem", or "troubleshoot errors"
```

---

### version

**Type:** `string`

**Required:** No

**Default:** No version tracking

**Platform Support:**
- Claude Code: ✅ Supported
- Antigravity: ✅ Supported
- Cross-platform: ✅ Recommended

**Purpose:**

Track skill versions using semantic versioning. Helps maintain compatibility, document changes, and manage skill evolution.

**Format:**

Semantic versioning: `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes, incompatible updates
- `MINOR`: New features, backward compatible
- `PATCH`: Bug fixes, minor improvements

**Examples:**

```yaml
# Initial development
version: 0.1.0
version: 0.2.1
version: 0.9.5

# Stable releases
version: 1.0.0
version: 1.2.3
version: 2.0.0
```

**Version Evolution Example:**

```yaml
# Initial release
version: 1.0.0

# Add new feature (backward compatible)
version: 1.1.0

# Bug fix
version: 1.1.1

# Breaking change (new API)
version: 2.0.0
```

**Common Mistakes:**
- Using non-semantic versions (v1, 1.0, 1.x)
- Not updating version when making changes
- Jumping version numbers without reason

**Best Practice:**

Start at `0.1.0` for initial development, move to `1.0.0` when stable. Update version with every meaningful change.

```yaml
# Development
version: 0.1.0  # First working version
version: 0.2.0  # Added new capabilities
version: 1.0.0  # Production ready

# Production
version: 1.1.0  # Added examples
version: 1.1.1  # Fixed typos
version: 2.0.0  # Changed skill structure
```

---

### argument-hint

**Type:** `string`

**Required:** No

**Default:** No hint shown

**Platform Support:**
- Claude Code: ✅ Full support (shows in autocomplete)
- Antigravity: ⚠️ Limited support
- Cross-platform: ⚠️ Claude Code specific

**Purpose:**

Hint text shown during slash command autocomplete. Helps users understand what arguments the skill expects.

**Format:**
- Brief placeholder text
- Use angle brackets `<>` for required args
- Use square brackets `[]` for optional args
- Separate multiple args with spaces
- Keep concise (displays in UI)

**Examples:**

```yaml
# Single required argument
argument-hint: <issue-number>
argument-hint: <component-name>
argument-hint: <file-path>

# Optional arguments
argument-hint: [filename]
argument-hint: [environment]

# Multiple arguments
argument-hint: <source> <target>
argument-hint: [filename] [format]
argument-hint: <component-name> [variant]

# Complex patterns
argument-hint: <issue-number> [branch-name]
argument-hint: <from-framework> <to-framework>
```

**UI Integration:**

When user types `/skill-name`, Claude Code shows:
```
/skill-name <issue-number>
            ^^^^^^^^^^^^^^
            argument-hint appears here
```

**Common Mistakes:**
- Being too verbose (use short placeholders)
- Not indicating required vs optional
- Missing hints for skills that take arguments

**Best Practice:**

Always provide hints for skills expecting arguments. Use descriptive but concise placeholders.

```yaml
# Good - clear and concise
argument-hint: <issue-number>

# Too verbose
argument-hint: <the GitHub issue number to fix>

# Too cryptic
argument-hint: <num>
```

**Complete Example:**

```yaml
---
name: fix-issue
description: Fix a GitHub issue by number
argument-hint: <issue-number>
---

Fix GitHub issue $0 following coding standards.
```

**Invocation:** `/fix-issue 123`

---

### disable-model-invocation

**Type:** `boolean`

**Required:** No

**Default:** `false` (Claude can auto-invoke)

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ⚠️ Limited support
- Cross-platform: ⚠️ Claude Code specific

**Purpose:**

Prevent Claude from automatically loading the skill. When `true`, skill can **only** be invoked manually via `/skill-name` command. Critical for operations with side effects or requiring precise timing control.

**Use Cases:**

**Set to `true` for:**
- Deployment operations
- Git commits and pushes
- Sending emails/notifications
- Database migrations
- Financial transactions
- Any destructive operations
- Workflows requiring user confirmation
- Time-sensitive operations

**Leave as `false` for:**
- Code review guidelines
- Architecture patterns
- Knowledge reference
- Code generation (non-destructive)
- Analysis and exploration

**Examples:**

```yaml
# Deployment - manual only
---
name: deploy
description: Deploy application to production
disable-model-invocation: true
---

# Git commit - manual only
---
name: commit
description: Create and push Git commit
disable-model-invocation: true
---

# Send notification - manual only
---
name: notify-team
description: Send Slack message to team
disable-model-invocation: true
---

# Code review - can auto-invoke
---
name: code-review
description: Review code for bugs and best practices
disable-model-invocation: false  # or omit (default)
---
```

**Behavior:**

| Value | User Can Invoke | Claude Can Invoke | Description in Context |
|:------|:----------------|:------------------|:----------------------|
| `false` (default) | ✅ Yes (`/skill-name`) | ✅ Yes (auto) | ✅ Loaded |
| `true` | ✅ Yes (`/skill-name`) | ❌ No | ❌ Not loaded |

**Important:** When `disable-model-invocation: true`, the skill description is **NOT** loaded into Claude's context. Claude has no awareness the skill exists unless you manually invoke it.

**Common Mistakes:**
- Allowing auto-invocation of destructive operations
- Setting `true` for read-only reference skills (they should auto-load)
- Confusing with `user-invocable` (different purpose)

**Best Practice:**

Always set `disable-model-invocation: true` for operations with side effects. Better to require explicit invocation than risk accidental execution.

```yaml
# Anything that changes state outside the conversation
---
name: deploy-prod
disable-model-invocation: true
---

# Anything that sends external messages
---
name: send-email
disable-model-invocation: true
---

# Anything that commits or pushes code
---
name: git-push
disable-model-invocation: true
---
```

---

### user-invocable

**Type:** `boolean`

**Required:** No

**Default:** `true` (appears in `/` menu)

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ⚠️ Limited support
- Cross-platform: ⚠️ Claude Code specific

**Purpose:**

Control visibility in slash command menu. When `false`, skill is hidden from `/` autocomplete but Claude can still invoke it automatically. Use for background knowledge or context that users shouldn't directly invoke.

**Use Cases:**

**Set to `false` for:**
- Background knowledge (coding standards, architecture docs)
- Context automatically loaded by other skills
- Reference material not actionable as command
- Legacy system documentation
- Deprecated skills (transitioning users)

**Leave as `true` for:**
- Actionable commands users would invoke
- Workflows users trigger directly
- Any skill users should know about

**Examples:**

```yaml
# Background knowledge - hidden from menu
---
name: legacy-system-context
description: Documentation for legacy system
user-invocable: false
---

# Architecture patterns - hidden
---
name: internal-architecture
description: Internal architecture guidelines
user-invocable: false
---

# Actionable command - visible in menu
---
name: generate-component
description: Generate React component
user-invocable: true  # or omit (default)
---
```

**Behavior:**

| Value | In `/` Menu | Claude Can Auto-Invoke | Description in Context |
|:------|:------------|:----------------------|:----------------------|
| `true` (default) | ✅ Visible | ✅ Yes | ✅ Loaded |
| `false` | ❌ Hidden | ✅ Yes | ✅ Loaded |

**Interaction with disable-model-invocation:**

| user-invocable | disable-model-invocation | User Invokes | Claude Invokes | In Menu |
|:---------------|:-------------------------|:-------------|:---------------|:--------|
| `true` (default) | `false` (default) | ✅ | ✅ | ✅ |
| `true` | `true` | ✅ | ❌ | ✅ |
| `false` | `false` | ❌ | ✅ | ❌ |
| `false` | `true` | ❌ | ❌ | ❌ |

**Common Mistakes:**
- Hiding skills users would want to invoke directly
- Setting `false` for all skills (defeats discoverability)
- Confusing with `disable-model-invocation`

**Best Practice:**

Only set `user-invocable: false` for skills that are purely contextual knowledge. If users might want to invoke it, keep it visible.

```yaml
# Good - background context
---
name: codebase-conventions
description: Internal coding conventions
user-invocable: false
---

# Bad - users might want this
---
name: explain-code
description: Explain code with diagrams
user-invocable: false  # Should be true - users want this!
---
```

---

### allowed-tools

**Type:** `string` (comma-separated tool names)

**Required:** No

**Default:** No automatic approvals (all tools require permission)

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ❌ Not supported
- Cross-platform: ❌ Claude Code only

**Purpose:**

Pre-approve specific tools Claude can use without asking permission when this skill is active. Reduces friction for safe, expected operations while maintaining security for others.

**Format:**
- Comma-separated tool names
- Optional patterns with parentheses
- Case-sensitive tool names
- No quotes around tool names

**Available Tools:**
- `Read` - Read files
- `Write` - Write files
- `Edit` - Edit files
- `Grep` - Search file contents
- `Glob` - Find files by pattern
- `Bash` - Execute bash commands (with pattern restrictions)

**Examples:**

```yaml
# Read-only tools
allowed-tools: Read, Grep, Glob

# With bash patterns
allowed-tools: Bash(npm *), Bash(git status)

# Multiple tools with patterns
allowed-tools: Read, Write, Bash(python scripts/*)

# All read operations
allowed-tools: Read, Grep, Glob, Bash(cat *), Bash(ls *)

# Development tools
allowed-tools: Bash(npm test), Bash(npm run build)
```

**Pattern Syntax:**

```yaml
# Exact command
allowed-tools: Bash(git status)

# Wildcard prefix
allowed-tools: Bash(npm *)

# Wildcard suffix
allowed-tools: Bash(* --dry-run)

# Path restrictions
allowed-tools: Bash(python scripts/*)
```

**Security Considerations:**

**Safe pre-approvals:**
```yaml
# Read-only operations
allowed-tools: Read, Grep, Glob

# Safe git operations
allowed-tools: Bash(git status), Bash(git diff), Bash(git log)

# Non-destructive npm
allowed-tools: Bash(npm list), Bash(npm outdated)
```

**Risky pre-approvals:**
```yaml
# TOO BROAD - don't do this
allowed-tools: Bash(*)

# DANGEROUS - unrestricted write
allowed-tools: Write

# UNSAFE - unrestricted bash
allowed-tools: Bash
```

**Common Mistakes:**
- Approving `Bash(*)` (way too broad)
- Not restricting write operations
- Allowing destructive commands without patterns
- Forgetting security implications

**Best Practice:**

Only pre-approve tools you'd be comfortable Claude using without asking. When in doubt, don't pre-approve.

```yaml
# Good - specific, safe operations
---
name: codebase-explorer
allowed-tools: Read, Grep, Glob, Bash(git log)
---

# Good - restricted patterns
---
name: test-runner
allowed-tools: Bash(npm test), Bash(npm run test:*)
---

# Bad - too permissive
---
name: general-helper
allowed-tools: Bash(*), Write, Edit  # Don't do this!
---
```

**Complete Example:**

```yaml
---
name: safe-analyzer
description: Analyze codebase without making changes
allowed-tools: Read, Grep, Glob
---

Explore the codebase to answer questions. You cannot modify files.
```

---

### model

**Type:** `string`

**Required:** No

**Default:** User's current model selection

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ❌ Not supported
- Cross-platform: ❌ Claude Code only

**Purpose:**

Override model selection when this skill is active. Use faster models for simple tasks or more capable models for complex analysis.

**Options:**
- `sonnet` - Claude 3.5 Sonnet (balanced, recommended)
- `opus` - Claude Opus 4.5 (most capable, slower, expensive)
- `haiku` - Claude 3.5 Haiku (fastest, cheapest, less capable)

**Use Cases:**

**Use `haiku` for:**
- Simple code formatting
- Syntax validation
- Quick checks
- Template filling
- Deterministic tasks

**Use `sonnet` for:**
- Most development tasks (default)
- Balanced performance/capability
- General purpose work

**Use `opus` for:**
- Complex architectural decisions
- Deep code analysis
- Novel problem solving
- Research and exploration
- Critical security reviews

**Examples:**

```yaml
# Simple validation - use fast model
---
name: format-check
description: Check code formatting
model: haiku
---

# Complex analysis - use most capable
---
name: architecture-review
description: Review system architecture
model: opus
---

# Balanced task - default is fine
---
name: generate-component
description: Generate React component
# model: sonnet  # Default, can omit
---
```

**Performance vs Cost:**

| Model | Speed | Cost | Capability | Use For |
|:------|:------|:-----|:-----------|:--------|
| `haiku` | Fastest | Lowest | Good | Simple, deterministic tasks |
| `sonnet` | Fast | Medium | Excellent | Most development work |
| `opus` | Slower | Highest | Best | Complex, novel problems |

**Common Mistakes:**
- Using `opus` for simple tasks (expensive)
- Using `haiku` for complex reasoning (insufficient)
- Not considering cost implications
- Overriding model unnecessarily

**Best Practice:**

Only specify `model` when you have a clear reason. Let users choose for most skills.

```yaml
# Good - simple task benefits from speed
---
name: quick-validator
model: haiku
---

# Good - complex task needs capability
---
name: deep-analyzer
model: opus
---

# Unnecessary - let user decide
---
name: general-task
model: sonnet  # Can omit this
---
```

---

### context

**Type:** `string`

**Required:** No

**Default:** Runs inline in current conversation

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ❌ Not supported
- Cross-platform: ❌ Claude Code only

**Purpose:**

Run skill in isolated subagent context (forked conversation). When set to `fork`, creates new conversation with no history, executes skill, and returns results to main conversation.

**Options:**
- (omit) - Default, inline execution
- `fork` - Isolated subagent execution

**Use Cases:**

**Use `context: fork` for:**
- Self-contained tasks with explicit instructions
- Research and exploration (keeps main conversation clean)
- Heavy operations (lots of file reading)
- Tasks requiring fresh context
- Workflows that should run independently

**DO NOT use `context: fork` for:**
- Skills containing only guidelines (no actionable task)
- Skills requiring conversation context
- Quick inline operations
- Skills that assist current work

**Examples:**

```yaml
# Research skill - isolated execution
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
4. Summarize findings

# Deployment - isolated workflow
---
name: deploy
description: Deploy to production
context: fork
disable-model-invocation: true
---

Deploy $ARGUMENTS:
1. Run test suite
2. Build application
3. Push to deployment
4. Verify success

# Code review - inline (no fork)
---
name: code-review
description: Review code for issues
# No context field - runs inline
---

Review for:
- Security issues
- Performance problems
- Best practices
```

**Execution Flow:**

**Without `context: fork` (inline):**
```
User: "Review this code"
 ↓
Skill content added to conversation
 ↓
Claude responds in same conversation
```

**With `context: fork` (subagent):**
```
User: "/deep-research authentication"
 ↓
New isolated context created
 ↓
Skill content becomes subagent's task
 ↓
Subagent executes independently
 ↓
Results summarized back to main conversation
```

**Common Mistakes:**
- Using fork for guidelines (subagent has no task)
- Using fork for quick operations (overhead not worth it)
- Not providing explicit task in skill body
- Expecting subagent to have conversation context

**Best Practice:**

Only use `context: fork` when skill body contains a complete, actionable task. If skill is guidance for current work, don't fork.

```yaml
# Good - complete task for subagent
---
context: fork
---

Research the authentication system:
1. Find all auth-related files
2. Map the authentication flow
3. Identify security mechanisms
4. Document findings

# Bad - just guidelines
---
context: fork  # Don't fork!
---

When reviewing code, check for:
- Security issues
- Performance problems
```

---

### agent

**Type:** `string`

**Required:** No (only relevant with `context: fork`)

**Default:** `general-purpose`

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ❌ Not supported
- Cross-platform: ❌ Claude Code only

**Purpose:**

Specify which subagent type to use when `context: fork` is set. Different agents have different capabilities, tools, and system prompts optimized for specific tasks.

**Built-in Agents:**
- `general-purpose` - Default, balanced capabilities
- `Explore` - Optimized for codebase exploration
- `Plan` - Optimized for planning and task breakdown

**Custom Agents:**
- Any agent from `.claude/agents/` directory
- Use filename without `.md` extension

**Examples:**

```yaml
# Use Explore agent for research
---
name: deep-research
context: fork
agent: Explore
---

# Use Plan agent for task breakdown
---
name: plan-feature
context: fork
agent: Plan
---

# Use custom agent
---
name: security-audit
context: fork
agent: security-auditor  # From .claude/agents/security-auditor.md
---

# Default agent (can omit)
---
name: general-task
context: fork
# agent: general-purpose  # Default, can omit
---
```

**Agent Capabilities:**

| Agent | Best For | Tools | Characteristics |
|:------|:---------|:------|:----------------|
| `general-purpose` | General tasks | All standard tools | Balanced approach |
| `Explore` | Codebase navigation | Read-focused tools | Thorough exploration |
| `Plan` | Planning workflows | Analysis tools | Strategic thinking |
| Custom | Specialized tasks | Configured per agent | Domain-specific |

**When to Choose:**

**Choose `Explore` for:**
```yaml
# Codebase research
agent: Explore

# Finding patterns across files
agent: Explore

# Understanding architecture
agent: Explore
```

**Choose `Plan` for:**
```yaml
# Breaking down complex tasks
agent: Plan

# Creating implementation roadmaps
agent: Plan

# Strategic planning
agent: Plan
```

**Choose custom agent for:**
```yaml
# Domain-specific work
agent: database-expert

# Specialized workflows
agent: deployment-manager

# Custom tooling
agent: api-generator
```

**Common Mistakes:**
- Setting `agent` without `context: fork` (ignored)
- Using wrong agent for task type
- Not understanding agent capabilities
- Creating custom agent when built-in would work

**Best Practice:**

Match agent to task type. Use `Explore` for research, `Plan` for planning, custom for specialized needs.

```yaml
# Good - research task uses Explore
---
context: fork
agent: Explore
---
Research authentication patterns in codebase.

# Good - planning uses Plan
---
context: fork
agent: Plan
---
Break down feature implementation into steps.

# Bad - wrong agent for task
---
context: fork
agent: Plan  # Should use Explore
---
Find all files related to authentication.
```

**Complete Example:**

```yaml
---
name: analyze-architecture
description: Deep architectural analysis
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Analyze the system architecture:

1. Identify all major components
2. Map dependencies between components
3. Find architectural patterns used
4. Document design decisions
5. Highlight potential improvements
```

---

### hooks

**Type:** `object` (YAML object)

**Required:** No

**Default:** No skill-scoped hooks

**Platform Support:**
- Claude Code: ✅ Full support
- Antigravity: ❌ Not supported
- Cross-platform: ❌ Claude Code only

**Purpose:**

Define hooks that are **scoped to this skill's lifecycle**. These hooks only run when the skill is active, unlike global hooks which run for all operations.

**Format:**

```yaml
hooks:
  event-name:
    - run: command to execute
    - run: another command
```

**Available Events:**
- `tool-approved` - After tool use approved
- `tool-rejected` - After tool use rejected
- Other hook events (see Hooks documentation)

**Examples:**

```yaml
# Log when tools approved during skill
---
name: audited-workflow
hooks:
  tool-approved:
    - run: echo "Tool approved: $TOOL_NAME"
---

# Validate after file operations
---
name: validated-editor
hooks:
  tool-approved:
    - run: npm run lint
    - run: npm test
---

# Multiple event hooks
---
name: comprehensive-tracking
hooks:
  tool-approved:
    - run: echo "Approved: $TOOL_NAME"
  tool-rejected:
    - run: echo "Rejected: $TOOL_NAME"
---
```

**Hook Scope:**

**Skill-scoped hooks (in frontmatter):**
- Only run when this skill active
- Isolated to skill lifecycle
- Don't affect other skills or operations

**Global hooks (in `.claude/hooks/`):**
- Run for all operations
- System-wide behavior
- Affect all Claude operations

**Common Mistakes:**
- Defining hooks without testing
- Creating hooks with side effects
- Not understanding hook scope
- Forgetting hooks run on every matching event

**Best Practice:**

Use skill-scoped hooks for skill-specific validations or logging. Keep hooks lightweight and focused.

```yaml
# Good - validation specific to skill
---
name: safe-editor
hooks:
  tool-approved:
    - run: ./scripts/validate.sh
---

# Bad - too broad
---
name: my-skill
hooks:
  tool-approved:
    - run: rm -rf node_modules  # Dangerous!
---
```

**See Also:** Hooks documentation for complete event reference and hook patterns.

---

## Platform Compatibility Matrix

| Field | Claude Code | Antigravity | Cross-Platform | Notes |
|:------|:------------|:------------|:---------------|:------|
| `name` | ✅ Full | ✅ Full | ✅ Essential | Use kebab-case, max 64 chars |
| `description` | ✅ Full | ✅ Full | ✅ Essential | Critical for triggering |
| `version` | ✅ Full | ✅ Full | ✅ Recommended | Use semantic versioning |
| `argument-hint` | ✅ Full | ⚠️ Limited | ⚠️ Optional | Shows in Claude Code autocomplete |
| `disable-model-invocation` | ✅ Full | ⚠️ Limited | ⚠️ Optional | Prevents auto-loading |
| `user-invocable` | ✅ Full | ⚠️ Limited | ⚠️ Optional | Controls menu visibility |
| `allowed-tools` | ✅ Full | ❌ None | ❌ CC only | Pre-approve specific tools |
| `model` | ✅ Full | ❌ None | ❌ CC only | Override model selection |
| `context` | ✅ Full | ❌ None | ❌ CC only | Fork to subagent |
| `agent` | ✅ Full | ❌ None | ❌ CC only | Specify subagent type |
| `hooks` | ✅ Full | ❌ None | ❌ CC only | Skill-scoped hooks |

**Legend:**
- ✅ Full: Fully supported
- ⚠️ Limited: Partial support or different behavior
- ❌ None: Not supported

---

## Field Combination Patterns

### Pattern 1: Manual-Only Workflow

```yaml
---
name: deploy-prod
description: Deploy application to production
argument-hint: <environment>
disable-model-invocation: true
context: fork
---
```

**Use for:** Operations requiring explicit user trigger (deployments, commits).

---

### Pattern 2: Auto-Invoked Reference

```yaml
---
name: code-conventions
description: Coding standards and best practices. Use when writing new code.
version: 1.0.0
---
```

**Use for:** Knowledge that should auto-load when relevant.

---

### Pattern 3: Hidden Background Context

```yaml
---
name: legacy-system-docs
description: Legacy system documentation
user-invocable: false
version: 2.1.0
---
```

**Use for:** Context automatically loaded by other skills, not user-facing.

---

### Pattern 4: Isolated Research Task

```yaml
---
name: deep-analysis
description: Comprehensive codebase analysis
argument-hint: <topic>
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---
```

**Use for:** Heavy exploration that should run independently.

---

### Pattern 5: Safe Read-Only Explorer

```yaml
---
name: code-explorer
description: Explore code without modifications. Use when learning codebase.
allowed-tools: Read, Grep, Glob
model: haiku
---
```

**Use for:** Fast, safe exploration with pre-approved read operations.

---

### Pattern 6: Complete Feature Skill

```yaml
---
name: component-generator
description: Generate React components with tests. Use when creating components.
version: 1.2.0
argument-hint: <component-name>
model: sonnet
hooks:
  tool-approved:
    - run: npm run lint
---
```

**Use for:** Full-featured skills with validation and quality checks.

---

## Validation Rules

### Required Field Validation

**Minimal valid skill:**
```yaml
---
# No required fields! This is valid:
---

# Content here
```

**Recommended minimal skill:**
```yaml
---
name: skill-name
description: When to use this skill
---
```

### Field Type Validation

```yaml
# ✅ Valid types
name: string-value
description: string-value
version: 1.0.0
argument-hint: <string>
disable-model-invocation: true
user-invocable: false
allowed-tools: Read, Write
model: sonnet
context: fork
agent: Explore
hooks:
  tool-approved:
    - run: echo "test"

# ❌ Invalid types
name: 123  # Should be string
version: true  # Should be string
disable-model-invocation: yes  # Should be true/false
model: claude-3.5  # Should be sonnet/opus/haiku
context: isolated  # Should be fork
```

### Field Value Validation

```yaml
# ✅ Valid values
model: sonnet  # or opus, haiku
context: fork  # only valid value
agent: Explore  # built-in or custom

# ❌ Invalid values
model: gpt-4  # Not a valid option
context: new  # Only 'fork' supported
agent: NonExistent  # Must exist
```

---

## Common Mistakes

### Mistake 1: Vague Description

❌ **Wrong:**
```yaml
description: Code helper
```

✅ **Correct:**
```yaml
description: Generates React components with TypeScript. Use when creating new components or converting class components.
```

---

### Mistake 2: Wrong Invocation Control

❌ **Wrong:**
```yaml
# Deployment that can auto-trigger!
name: deploy
description: Deploy to production
```

✅ **Correct:**
```yaml
name: deploy
description: Deploy to production
disable-model-invocation: true  # Manual only!
```

---

### Mistake 3: Fork Without Task

❌ **Wrong:**
```yaml
---
context: fork  # But no task below!
---

When reviewing code, check for:
- Security issues
- Performance problems
```

✅ **Correct:**
```yaml
---
context: fork
---

Review the codebase:
1. Find all files
2. Analyze for security issues
3. Document findings
```

---

### Mistake 4: Overly Permissive Tools

❌ **Wrong:**
```yaml
allowed-tools: Bash(*), Write, Edit
```

✅ **Correct:**
```yaml
allowed-tools: Bash(npm test), Bash(git status), Read
```

---

### Mistake 5: Wrong Model Choice

❌ **Wrong:**
```yaml
# Simple formatting using expensive model
name: format-code
model: opus
```

✅ **Correct:**
```yaml
name: format-code
model: haiku  # Fast, cheap, sufficient
```

---

## Complete Examples

### Example 1: Basic Knowledge Skill

```yaml
---
name: api-conventions
description: API design patterns for this codebase. Use when designing or reviewing API endpoints.
version: 1.0.0
---

# API Conventions

When designing API endpoints:

1. **RESTful Naming:** Use resource nouns, not verbs
2. **Consistent Errors:** Return standard error format
3. **Validation:** Validate all input at endpoint entry
4. **Rate Limiting:** Add rate limiting to auth endpoints
5. **Versioning:** Use URL versioning (/v1/, /v2/)
```

---

### Example 2: Manual Deployment Workflow

```yaml
---
name: deploy
description: Deploy application to production environment
argument-hint: <environment>
disable-model-invocation: true
context: fork
agent: general-purpose
---

# Deployment Workflow

Deploy to $ARGUMENTS environment:

1. **Run Tests:**
   ```bash
   npm run test:all
   ```

2. **Build Application:**
   ```bash
   npm run build:prod
   ```

3. **Deploy:**
   ```bash
   ./scripts/deploy.sh $ARGUMENTS
   ```

4. **Verify:**
   - Check health endpoint
   - Monitor error logs
   - Confirm deployment success

If any step fails, abort and report the issue.
```

---

### Example 3: Auto-Invoked Code Explainer

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
version: 1.1.0
model: sonnet
allowed-tools: Read, Grep
---

# Code Explainer

When explaining code, always include:

1. **Analogy:** Compare to something from everyday life
2. **Diagram:** Use ASCII art to show flow/structure
3. **Walkthrough:** Explain step-by-step what happens
4. **Gotcha:** Highlight common mistake or misconception

Keep explanations conversational. For complex concepts, use multiple analogies.
```

---

### Example 4: Research Subagent

```yaml
---
name: deep-research
description: Research a topic thoroughly across the entire codebase
argument-hint: <topic>
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
version: 1.0.0
---

# Deep Research

Research "$ARGUMENTS" thoroughly:

## Phase 1: Discovery
1. Find all relevant files using Glob patterns
2. Search for keywords using Grep
3. Identify entry points and key files

## Phase 2: Analysis
1. Read and analyze code structure
2. Map relationships and dependencies
3. Identify patterns and conventions

## Phase 3: Documentation
1. Summarize architecture
2. Document key design decisions
3. Highlight important files with line numbers

Focus on understanding the overall architecture and key decisions.
```

---

## Best Practices Summary

### DO ✅

1. **Always write specific, concrete descriptions:**
   ```yaml
   description: Use when user asks to "create a hook", "add validation", or "implement PreToolUse"
   ```

2. **Set disable-model-invocation for side effects:**
   ```yaml
   disable-model-invocation: true  # For deploy, commit, send-email, etc.
   ```

3. **Use semantic versioning:**
   ```yaml
   version: 1.2.0
   ```

4. **Provide argument hints:**
   ```yaml
   argument-hint: <issue-number>
   ```

5. **Restrict tool permissions:**
   ```yaml
   allowed-tools: Read, Grep, Glob  # Only what's needed
   ```

### DON'T ❌

1. **Don't write vague descriptions:**
   ```yaml
   description: Code helper  # Too vague!
   ```

2. **Don't allow auto-invocation of destructive ops:**
   ```yaml
   # Missing disable-model-invocation: true
   name: deploy
   ```

3. **Don't over-permission tools:**
   ```yaml
   allowed-tools: Bash(*), Write  # Too broad!
   ```

4. **Don't fork without explicit task:**
   ```yaml
   context: fork
   # But skill body only has guidelines, no task!
   ```

5. **Don't use wrong model:**
   ```yaml
   model: opus  # For simple formatting (expensive!)
   ```

---

## Related Documentation

- [Skill Anatomy](../01-fundamentals/skill-anatomy.md) - Complete skill structure
- [Design Principles](../03-creating-skills/design-principles.md) - Skill design philosophy
- [Creation Workflow](../03-creating-skills/workflow.md) - Step-by-step creation guide
- [Skill Patterns](../03-creating-skills/skill-patterns.md) - Common skill patterns

---

**Last Updated:** February 2026
**Category:** Skills Reference
**Audience:** Skill developers
**Related:** SKILL.md format, frontmatter configuration, skill development
