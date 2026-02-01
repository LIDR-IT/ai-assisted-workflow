# Skills in Claude Code

Comprehensive guide to creating, managing, and using skills in Claude Code, including advanced features and integration patterns.

**Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

---

## Table of Contents

- [Core Concepts](#core-concepts)
- [Skills vs Commands](#skills-vs-commands)
- [Skill Locations](#skill-locations)
- [Frontmatter Reference](#frontmatter-reference)
- [String Substitutions](#string-substitutions)
- [Controlling Invocation](#controlling-invocation)
- [Content Types](#content-types)
- [Supporting Files](#supporting-files)
- [Advanced Patterns](#advanced-patterns)
- [Tool Restrictions](#tool-restrictions)
- [Complete Examples](#complete-examples)
- [Integration Patterns](#integration-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Core Concepts

### What Are Skills?

Skills are **modular capabilities** packaged as markdown files that extend Claude's knowledge and abilities in Claude Code. Think of them as specialized "onboarding guides" that transform Claude into an expert for specific tasks or domains.

**Key characteristics:**
- Extend Claude's knowledge with domain expertise
- Provide step-by-step workflows for specific tasks
- Can be invoked manually (`/skill-name`) or automatically by Claude
- Follow the [Agent Skills](https://agentskills.io) open standard
- Work across multiple AI tools (not just Claude Code)

**Key benefit:** "Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit."

### How Skills Work

**Three-level loading system:**

1. **Metadata (always loaded):** Skill name, description, version (~100 words)
   - Purpose: Skill discovery and triggering
   - Claude sees all available skills and their descriptions

2. **SKILL.md body (loaded when triggered):** Main instructions, workflows (<5,000 words)
   - Purpose: Primary guidance for task execution
   - Loads only when skill is invoked or Claude decides it's relevant

3. **Bundled resources (loaded as needed):** Detailed docs, examples, scripts (variable size)
   - Purpose: Deep dive information on-demand
   - Claude loads only when explicitly referenced or contextually relevant

This **progressive disclosure** keeps context efficient while providing depth when needed.

---

## Skills vs Commands

**Important:** Custom slash commands have been merged into skills as of recent Claude Code updates.

### Legacy Behavior (Still Works)

Both paths create invocable slash commands:

| Location | Creates | Notes |
|:---------|:--------|:------|
| `.claude/commands/review.md` | `/review` command | Legacy format |
| `.claude/skills/review/SKILL.md` | `/review` skill | Current format |

**Priority:** If both exist with the same name, the skill takes precedence.

### What Skills Add Beyond Commands

Commands were simple markdown files. Skills add:

1. **Directory structure** for supporting files (templates, examples, scripts)
2. **Frontmatter** to control invocation behavior
3. **Automatic loading** by Claude when relevant (not just manual invocation)
4. **String substitutions** for dynamic content (`$ARGUMENTS`, `$0`, `$1`)
5. **Dynamic context injection** with `` !`command` `` syntax
6. **Subagent integration** with `context: fork` and `agent` fields
7. **Tool restrictions** with `allowed-tools` field
8. **Lifecycle hooks** scoped to skill execution

**Recommendation:** Use skills for all new development. Commands remain supported for backward compatibility.

---

## Skill Locations

Where you store a skill determines its scope and availability:

| Location | Path | Applies to | Precedence |
|:---------|:-----|:-----------|:-----------|
| **Enterprise** | See managed settings | All users in organization | 1 (highest) |
| **Personal** | `~/.claude/skills/<name>/SKILL.md` | All your projects | 2 |
| **Project** | `.claude/skills/<name>/SKILL.md` | This project only | 3 |
| **Plugin** | `<plugin>/skills/<name>/SKILL.md` | Where plugin is enabled | Separate namespace |

**Resolution priority:** Enterprise > Personal > Project

**Plugin namespace:** Plugin skills use `plugin-name:skill-name` format, preventing conflicts with other skill levels.

### Automatic Nested Discovery

Claude Code discovers skills from nested `.claude/skills/` directories when editing files in subdirectories.

**Example (monorepo):**
```
project-root/
├── .claude/skills/
│   └── general-review/SKILL.md
└── packages/
    └── frontend/
        ├── .claude/skills/
        │   └── frontend-tests/SKILL.md
        └── src/
            └── components/
```

When working in `packages/frontend/src/components/`, Claude finds both:
- Root `.claude/skills/` (general-review)
- `packages/frontend/.claude/skills/` (frontend-tests)

This enables **context-aware skills** that activate based on your current location in the codebase.

---

## Skill Structure

Each skill is a directory with `SKILL.md` as the entrypoint:

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── references/        # Detailed documentation (optional)
│   ├── patterns.md
│   └── api-docs.md
├── examples/          # Working code examples (optional)
│   ├── basic.js
│   └── advanced.js
├── scripts/           # Executable utilities (optional)
│   ├── validate.sh
│   └── generate.js
└── assets/            # Output templates (optional)
    ├── template.md
    └── config.json
```

**Required:** `SKILL.md` with optional YAML frontmatter + markdown content

**Directory purposes:**

- **references/** - Documentation loaded as-needed into context
  - Detailed patterns and techniques
  - API documentation
  - Configuration schemas
  - Migration guides
  - Each file can be 2,000-5,000+ words

- **examples/** - Working code examples
  - Complete, runnable examples
  - Different use case demonstrations
  - Template implementations

- **scripts/** - Executable code for deterministic tasks
  - Validation scripts
  - Utility functions
  - Common operations
  - May execute without loading into context

- **assets/** - Files for output generation, **not** context loading
  - Templates Claude fills in
  - Images/icons
  - Boilerplate code

---

## SKILL.md Format

Every `SKILL.md` has two parts:

### 1. YAML Frontmatter (Optional)

Between `---` markers at the top:

```yaml
---
name: my-skill
description: What this skill does and when to use it
argument-hint: [filename]
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep
model: sonnet
context: fork
agent: Explore
hooks:
  tool-approved:
    - run: echo "Tool approved during skill execution"
---
```

### 2. Markdown Content (Required)

Instructions Claude follows when the skill is invoked:

```markdown
When doing X, follow these steps:

1. First step
2. Second step
3. Third step

Keep Y in mind. Avoid Z.
```

**Writing style:**
- Use imperative/infinitive form: "Start by...", "To accomplish X, do Y"
- **Avoid second person:** Don't use "You should", "You need to", "You will"
- Be direct and actionable

**Length:** 1,500-2,000 words recommended (maximum 5,000)

---

## Frontmatter Reference

All fields are **optional**. Only `description` is strongly recommended.

### Complete Field List

| Field | Type | Description |
|:------|:-----|:------------|
| `name` | string | Display name for the skill. If omitted, uses directory name. Lowercase letters, numbers, hyphens only (max 64 chars). |
| `description` | string | **Critical for auto-triggering.** What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses first paragraph of markdown content. |
| `argument-hint` | string | Hint shown during autocomplete. Examples: `[issue-number]`, `[filename] [format]` |
| `disable-model-invocation` | boolean | Set to `true` to prevent Claude from auto-loading. Use for workflows you trigger manually. Default: `false` |
| `user-invocable` | boolean | Set to `false` to hide from `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true` |
| `allowed-tools` | string | Tools Claude can use without permission when this skill is active. Example: `Read, Grep, Bash(npm *)` |
| `model` | string | Model to use when this skill is active. Options: `sonnet`, `opus`, `haiku` |
| `context` | string | Set to `fork` to run in a forked subagent context. |
| `agent` | string | Which subagent type to use when `context: fork` is set. Options: built-in agents (`Explore`, `Plan`, `general-purpose`) or custom agents from `.claude/agents/` |
| `hooks` | object | Hooks scoped to this skill's lifecycle. See Hooks documentation for format. |
| `version` | string | Semantic versioning: `0.1.0`. Helps track changes. |

### Field Details

#### name

```yaml
name: my-skill
```

- Skill identifier used for invocation and display
- If omitted, uses directory name
- Must be lowercase letters, numbers, hyphens only
- Maximum 64 characters
- No spaces or special characters

#### description

```yaml
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

**Most important field for auto-triggering.**

**Best practices:**
- Include keywords users would naturally say
- Provide 2-4 specific trigger examples
- Use third-person voice: "This skill should be used when..."
- Be concrete, not vague

**Good examples:**
```yaml
# Specific trigger phrases
description: This skill should be used when the user asks to "create a hook", "add a PreToolUse hook", "validate tool use", or "implement hook validation"

# Natural language users would say
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

**Bad examples:**
```yaml
# Too vague
description: Provides guidance for hooks

# Too generic
description: Code explanation tool
```

#### argument-hint

```yaml
argument-hint: <issue-number>
argument-hint: [filename] [format]
argument-hint: <source> <target>
```

- Shown during autocomplete when user types `/skill-name `
- Helps users understand what arguments are expected
- Use `<required>` or `[optional]` conventions
- Examples guide users without being documentation

#### disable-model-invocation

```yaml
disable-model-invocation: true
```

- `true`: Only you can invoke (manual `/skill-name` only)
- `false` (default): Both you and Claude can invoke

**Use `true` for:**
- Workflows with side effects (deploy, commit, publish)
- Operations requiring timing control
- Destructive operations
- Explicit user approval needed

**Examples:** `/commit`, `/deploy`, `/send-slack-message`

#### user-invocable

```yaml
user-invocable: false
```

- `true` (default): Appears in `/` menu, users can invoke
- `false`: Hidden from menu, only Claude can invoke

**Use `false` for:**
- Background knowledge not actionable as a command
- Reference material without specific task
- Context that enriches Claude's understanding

**Example:** `legacy-system-context` skill providing architecture background

#### allowed-tools

```yaml
allowed-tools: Read, Grep
allowed-tools: Read, Grep, Bash(npm *)
allowed-tools: Bash(gh *)
```

- Comma-separated list of tools Claude can use without permission
- Can include glob patterns for Bash commands
- Overrides global permission settings for this skill
- Useful for sandboxing or enabling specific operations

**Examples:**
```yaml
# Read-only mode
allowed-tools: Read, Grep, Glob

# Allow specific bash commands
allowed-tools: Read, Write, Bash(npm test), Bash(npm run *)

# GitHub CLI operations
allowed-tools: Bash(gh pr *), Bash(gh issue *)
```

#### model

```yaml
model: sonnet
model: opus
model: haiku
```

- Override default model for this skill execution
- Options: `sonnet` (Sonnet 4.5), `opus` (Opus 4.5), `haiku` (Haiku 3.5)
- Useful when skill requires specific model capabilities

**When to use:**
- `opus`: Complex reasoning, analysis, creative tasks
- `sonnet`: Balanced performance and capability (default)
- `haiku`: Fast, simple tasks

#### context

```yaml
context: fork
```

- `fork`: Run skill in isolated subagent context
- Default (omitted): Run inline in main conversation

**Use `fork` when:**
- Skill contains explicit instructions for a complete task
- You want isolated execution (no cross-contamination)
- Task should run independently without conversation history

**Don't use `fork` when:**
- Skill contains only guidelines without a task
- Content is reference material, not executable workflow

#### agent

```yaml
agent: Explore
agent: Plan
agent: general-purpose
agent: custom-agent-name
```

- Which subagent type to use when `context: fork` is set
- Built-in options: `Explore`, `Plan`, `general-purpose`
- Custom: Any agent from `.claude/agents/`
- Default (if omitted): `general-purpose`

**Agent characteristics:**
- **Explore:** Research-focused, file discovery, analysis
- **Plan:** Multi-step planning, task breakdown
- **general-purpose:** Balanced capabilities
- **Custom:** Your defined agents with specific system prompts

#### hooks

```yaml
hooks:
  tool-approved:
    - run: echo "Tool approved during skill execution"
  pre-tool-use:
    - run: ./scripts/validate.sh
```

- Hooks scoped to this skill's lifecycle
- Same format as global hooks
- Only active while skill is executing
- See Hooks documentation for complete reference

#### version

```yaml
version: 1.0.0
version: 0.1.0
```

- Semantic versioning: `MAJOR.MINOR.PATCH`
- Helps track changes and compatibility
- Useful for distributed skills (plugins, organization-wide)

---

## String Substitutions

Skills support dynamic value injection at invocation time:

| Variable | Description | Example |
|:---------|:------------|:--------|
| `$ARGUMENTS` | All arguments passed when invoking | `$ARGUMENTS` → `file.js format json` |
| `$ARGUMENTS[N]` | Specific argument by 0-based index | `$ARGUMENTS[0]` → `file.js` |
| `$N` | Shorthand for `$ARGUMENTS[N]` | `$0` → first, `$1` → second |
| `${CLAUDE_SESSION_ID}` | Current session ID | Unique identifier for this session |

**If `$ARGUMENTS` not present:** Arguments appended as `ARGUMENTS: <value>` at the end of skill content.

### Example: Session Logger

```yaml
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Usage:** `/session-logger Updated authentication flow`

**Result:** Logs "Updated authentication flow" to `logs/abc123def.log`

### Example: Indexed Arguments

```yaml
---
name: migrate-component
description: Migrate a component from one framework to another
argument-hint: <component> <from> <to>
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

**Usage:** `/migrate-component SearchBar React Vue`

**Result:** "Migrate the SearchBar component from React to Vue."

### Example: Multiple Substitutions

```yaml
---
name: create-feature
description: Create a new feature with boilerplate
argument-hint: <feature-name> <author>
---

Create a new feature named "$0" by $1:

1. Create directory: src/features/$0/
2. Generate boilerplate files
3. Add to registry
4. Create test suite

Session: ${CLAUDE_SESSION_ID}
```

**Usage:** `/create-feature authentication alice`

**Result:**
```
Create a new feature named "authentication" by alice:
1. Create directory: src/features/authentication/
...
Session: xyz789abc
```

---

## Controlling Invocation

By default, **both you and Claude** can invoke any skill. Two frontmatter fields control this:

### Invocation Control Fields

#### 1. disable-model-invocation

Controls whether Claude can auto-invoke the skill:
- `false` (default): Claude can invoke when it determines skill is relevant
- `true`: Only manual `/skill-name` invocation works

#### 2. user-invocable

Controls whether skill appears in `/` menu:
- `true` (default): Appears in menu, users can invoke
- `false`: Hidden from menu, only Claude can invoke programmatically

### Invocation Matrix

| Frontmatter | You invoke | Claude invokes | Description in context | Full skill loads |
|:------------|:-----------|:---------------|:-----------------------|:-----------------|
| (default) | Yes | Yes | Yes | When invoked |
| `disable-model-invocation: true` | Yes | No | **No** | When you invoke |
| `user-invocable: false` | No | Yes | Yes | When Claude invokes |
| Both `true` and `false` | No | No | **No** | Never (disabled) |

**Important distinction:**

- **Description in context:** Skill description loaded for Claude to see and consider
- **Full skill loads:** Complete SKILL.md content loaded for execution

### Use Cases

**Default (both true):**
```yaml
---
name: explain-code
description: Explains code with visual diagrams
---
```
- User can manually invoke: `/explain-code file.js`
- Claude auto-invokes when user asks "how does this work?"
- Most skills use this

**Manual only (disable-model-invocation):**
```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
---
```
- User must explicitly invoke: `/deploy production`
- Claude never auto-invokes (prevents accidental deployments)
- Use for side-effect operations

**Background knowledge (user-invocable: false):**
```yaml
---
name: legacy-api-context
description: Background on legacy API architecture
user-invocable: false
---
```
- Hidden from `/` menu
- Claude uses when working with legacy code
- User cannot directly invoke (not actionable as command)

---

## Content Types

Skills can serve different purposes based on their content:

### Reference Content

Adds knowledge Claude applies to current work. Runs inline in conversation.

**Characteristics:**
- Guidelines, patterns, conventions
- Enriches Claude's understanding
- No specific task or workflow
- Applied contextually to user requests

**Example:**

```yaml
---
name: api-conventions
description: API design patterns for this codebase
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats: `{ error: string, code: number }`
- Include request validation with Zod schemas
- Add rate limiting to auth endpoints (100 req/min)
- Document all endpoints in OpenAPI format

Error responses follow this structure:
\`\`\`json
{
  "error": "Validation failed",
  "code": 400,
  "details": { "field": "email", "message": "Invalid format" }
}
\`\`\`
```

**When to use:**
- Code style guides
- Architecture patterns
- Domain knowledge
- Best practices

### Task Content

Step-by-step instructions for specific actions. Often manually invoked.

**Characteristics:**
- Explicit workflow or procedure
- Multiple sequential steps
- Clear deliverable or outcome
- Often has side effects

**Add `disable-model-invocation: true`** to prevent automatic triggering.

**Example:**

```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application to production:

1. **Run test suite**
   ```bash
   npm test
   ```
   Abort if any tests fail.

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Push to deployment target**
   ```bash
   git push production main
   ```

4. **Verify deployment succeeded**
   - Check application is responding: `curl https://app.example.com/health`
   - Verify version deployed correctly
   - Monitor error rates for 5 minutes

5. **Notify team**
   Post to #deployments Slack channel with version and timestamp.

If any step fails, abort immediately and report the issue.
```

**When to use:**
- Deployments
- Commit workflows
- Code generation
- Multi-step procedures

---

## Supporting Files

Keep `SKILL.md` focused and under 500 lines. Move detailed material to separate files.

### Referencing Files

Tell Claude what each file contains in `SKILL.md`:

```markdown
## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
- For advanced patterns, see [references/patterns.md](references/patterns.md)

## Validation

Use **`scripts/validate-hook.sh`** to verify hook implementations:

\`\`\`bash
./scripts/validate-hook.sh path/to/hook.js
\`\`\`
```

Claude loads these files **only when needed**, keeping context usage efficient.

### Directory Guidelines

**references/ directory:**
- Detailed documentation (2,000-5,000+ words per file)
- Loaded on-demand when Claude needs deep information
- Examples: API reference, migration guides, troubleshooting

**examples/ directory:**
- Complete, runnable code examples
- Working demonstrations of different use cases
- Templates for implementation

**scripts/ directory:**
- Executable utilities for common operations
- Validation scripts
- May execute without loading into context (token-efficient)
- Must be executable: `chmod +x scripts/*.sh`

**assets/ directory:**
- Files for **output generation**, not context loading
- Templates Claude fills in
- Images, icons, boilerplate code
- Not loaded into context

### Example Structure

```
complete-skill/
├── SKILL.md                    # 300 lines: overview + navigation
├── references/
│   ├── api-reference.md        # 3,000 lines: complete API docs
│   ├── patterns.md             # 2,000 lines: detailed patterns
│   └── troubleshooting.md      # 1,500 lines: common issues
├── examples/
│   ├── basic-example.js        # Simple working example
│   ├── advanced-example.js     # Complex use case
│   └── integration-test.js     # Test suite example
├── scripts/
│   ├── validate.sh             # Validation utility
│   ├── generate.js             # Code generator
│   └── setup.py                # Setup automation
└── assets/
    ├── template.md             # Output template
    └── config-template.json    # Config boilerplate
```

---

## Advanced Patterns

### 1. Dynamic Context Injection

The `` !`command` `` syntax runs shell commands **before** Claude sees the skill content (preprocessing).

**How it works:**
1. Each `` !`command` `` executes immediately at invocation time
2. Command output replaces the placeholder
3. Claude receives the fully-rendered prompt with actual data
4. **Important:** This is preprocessing, not something Claude executes later

**Example: PR Summary**

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context

- **PR diff:** !`gh pr diff`
- **PR comments:** !`gh pr view --comments`
- **Changed files:** !`gh pr diff --name-only`
- **PR metadata:** !`gh pr view --json title,author,createdAt`

## Your task

Summarize this pull request focusing on:

1. **What changed and why**
   - Identify the core changes from the diff
   - Explain the motivation based on PR description and comments

2. **Potential issues or concerns**
   - Breaking changes
   - Performance implications
   - Security considerations

3. **Testing recommendations**
   - What needs testing based on changes
   - Edge cases to verify
```

**Execution flow:**
1. User invokes: `/pr-summary` (in PR context)
2. Shell commands execute: `gh pr diff`, `gh pr view --comments`, etc.
3. Outputs replace `` !`...` `` placeholders
4. Claude receives skill with actual PR data embedded
5. Subagent executes analysis with injected context

**Use cases:**
- Inject current state: `` !`git status` ``
- Load configuration: `` !`cat .env.example` ``
- Get dynamic data: `` !`curl -s api.example.com/status` ``
- Query external systems: `` !`gh issue list --limit 5` ``

**Important notes:**
- Commands run in your shell environment
- Must be safe and fast (no long-running processes)
- Errors in commands will fail skill invocation
- Use with `allowed-tools` to control permissions

### 2. Run Skills in a Subagent

Add `context: fork` to run a skill in isolation without conversation history.

**When to use:**
- Skill contains explicit instructions for a complete task
- You want isolated execution (no context contamination)
- Task should run independently
- Heavy exploration or analysis work

**When NOT to use:**
- Skill contains only guidelines without a task
- Subagent would receive guidelines but no actionable prompt
- Would return without meaningful output

**Example: Research Skill**

```yaml
---
name: deep-research
description: Research a topic thoroughly across the codebase
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Research $ARGUMENTS thoroughly:

1. **Find relevant files**
   - Use Glob to identify potential files
   - Use Grep to search for key terms
   - Check related documentation

2. **Read and analyze the code**
   - Read identified files
   - Understand data flow and dependencies
   - Note patterns and conventions

3. **Identify patterns**
   - Common approaches used
   - Naming conventions
   - Architecture decisions

4. **Summarize findings**
   - Provide overview with specific file references
   - Include code snippets for key patterns
   - Note any inconsistencies or issues

Focus on understanding the overall architecture and key design decisions.
Return a comprehensive summary with actionable insights.
```

**Execution flow:**
1. User invokes: `/deep-research authentication`
2. New isolated context created (no conversation history)
3. Subagent receives skill content as its prompt with "authentication" substituted
4. `agent: Explore` determines execution environment (research-focused model/tools)
5. Subagent executes research workflow
6. Results summarized and returned to main conversation
7. Subagent context discarded

**Agent options:**

| Agent | Characteristics | Use for |
|:------|:----------------|:--------|
| `Explore` | Research-focused, file discovery | Codebase analysis, investigation |
| `Plan` | Multi-step planning, task breakdown | Complex workflows, architecture |
| `general-purpose` | Balanced capabilities | Most tasks |
| Custom agent | Your defined behavior | Specialized workflows |

### 3. Skills vs Subagents with Skills

Two directions for combining skills and subagents:

| Approach | System prompt | Task | Also loads |
|:---------|:--------------|:-----|:-----------|
| **Skill with `context: fork`** | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content | CLAUDE.md |
| **Subagent with `skills` field** | Subagent's markdown body | Claude's delegation message | Preloaded skills + CLAUDE.md |

**Skill with `context: fork`:**
- You write the task in the skill
- You pick the agent type to execute it
- Skill content becomes the subagent's task
- Single-purpose, focused execution

**Subagent with skills:**
- You define a custom subagent in `.claude/agents/`
- Skills serve as reference material (preloaded)
- Claude delegates a task to the subagent
- Subagent has access to specific skills as tools

**Example comparison:**

```yaml
# Approach 1: Skill with context fork
---
name: analyze-performance
context: fork
agent: Explore
---

Analyze application performance:
1. Profile the codebase
2. Identify bottlenecks
3. Recommend optimizations
```

```yaml
# Approach 2: Subagent with skills
# File: .claude/agents/performance-analyzer.md
---
name: performance-analyzer
skills:
  - profiling-patterns
  - optimization-techniques
---

You are a performance analysis expert.
Use the profiling-patterns and optimization-techniques skills
to guide your analysis.

Focus on identifying and explaining performance issues.
```

See [Sub-agents documentation](../../references/agents/sub-agents-claude-code.md) for complete subagent reference.

### 4. Extended Thinking (Thinking Mode)

Enable extended thinking for complex analysis by including the word **"ultrathink"** anywhere in your skill content.

```yaml
---
name: complex-analysis
description: Deep analysis requiring extended thinking
---

Ultrathink through this problem carefully:

1. **Analyze all aspects**
   - Consider multiple perspectives
   - Evaluate edge cases
   - Think through implications

2. **Reason about tradeoffs**
   - Compare different approaches
   - Weigh pros and cons
   - Consider long-term impact

3. **Arrive at recommendation**
   - Clear rationale for decision
   - Acknowledgment of alternatives
   - Implementation guidance
```

When "ultrathink" is present, Claude uses extended thinking mode for more deliberate, thorough analysis.

---

## Tool Restrictions

Control which tools Claude can use at both skill and system levels.

### Skill-Level Restrictions

Use `allowed-tools` to limit which tools Claude can use when a skill is active:

```yaml
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read, Grep, Glob
---

Explore the codebase to answer questions. You cannot modify files.
```

**Syntax:**
- Comma-separated list: `Read, Grep, Glob`
- Bash patterns: `Bash(npm *)`, `Bash(gh pr *)`
- Overrides global permissions for this skill

**Examples:**

```yaml
# Read-only mode
allowed-tools: Read, Grep, Glob

# Allow specific npm commands
allowed-tools: Read, Write, Bash(npm test), Bash(npm run lint)

# GitHub CLI only
allowed-tools: Bash(gh *)

# Unrestricted (same as omitting field)
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
```

### System-Level Restrictions

Control which skills Claude can invoke through permission settings.

**Disable all skills:**
```
# In /permissions, add to deny rules:
Skill
```

**Allow specific skills only:**
```
# Allow only these skills
Skill(commit)
Skill(review-pr *)
```

**Deny specific skills:**
```
# Block these skills
Skill(deploy *)
Skill(publish *)
```

**Permission syntax:**
- `Skill(name)` - Exact match
- `Skill(name *)` - Prefix match with any arguments
- `Skill(*)` - All skills

**Important:** The `user-invocable` field controls **menu visibility** only, not Skill tool access. Use `disable-model-invocation: true` to block programmatic invocation.

---

## Complete Examples

### Example 1: Explain Code (Auto-Invoked)

Uses default frontmatter so Claude can load automatically when you ask how something works.

**File:** `~/.claude/skills/explain-code/SKILL.md`

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
   - Make it relatable and concrete
   - Use common experiences or objects

2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
   - Keep it simple and focused
   - Label key components

3. **Walk through the code**: Explain step-by-step what happens
   - Follow execution order
   - Highlight important decision points
   - Show data transformations

4. **Highlight a gotcha**: What's a common mistake or misconception?
   - Warn about edge cases
   - Explain non-obvious behavior
   - Share debugging tips

Keep explanations conversational. For complex concepts, use multiple analogies approaching from different angles.
```

**Usage:**
- Auto: "How does this authentication code work?"
- Manual: `/explain-code src/auth/login.ts`

**Result:** Claude explains the code with analogy, diagram, walkthrough, and gotchas.

### Example 2: Deploy (Manual Only)

Prevents automatic invocation with `disable-model-invocation: true`.

**File:** `.claude/skills/deploy/SKILL.md`

```yaml
---
name: deploy
description: Deploy the application to production
argument-hint: <environment>
disable-model-invocation: true
context: fork
allowed-tools: Bash(npm *), Bash(git *)
---

Deploy $ARGUMENTS to production:

1. **Verify environment**
   ```bash
   echo "Deploying to: $0"
   ```
   Confirm this is the intended target.

2. **Run the test suite**
   ```bash
   npm test
   ```
   **Abort if any tests fail.**

3. **Build the application**
   ```bash
   npm run build
   ```
   Verify build completed successfully.

4. **Push to the deployment target**
   ```bash
   git push $0 main
   ```

5. **Verify the deployment succeeded**
   - Check application is responding
   - Verify version deployed correctly
   - Monitor for errors in the first 5 minutes

6. **Report status**
   - Summarize deployment outcome
   - Note any warnings or issues
   - Provide rollback instructions if needed

If any step fails, abort immediately and report the issue with specific error details.
```

**Usage:** `/deploy staging` or `/deploy production`

**Result:** Isolated subagent executes deployment workflow with specified environment.

### Example 3: Fix GitHub Issue (With Arguments)

Uses indexed arguments and dynamic context injection.

**File:** `.claude/skills/fix-issue/SKILL.md`

```yaml
---
name: fix-issue
description: Fix a GitHub issue by number following project conventions
argument-hint: <issue-number>
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash(gh *), Bash(git *)
---

Fix GitHub issue #$0 following our coding standards:

## Issue Details

!`gh issue view $0`

## Workflow

1. **Understand the requirements**
   - Read the issue description above
   - Review any linked PRs or discussions
   - Clarify scope and acceptance criteria

2. **Implement the fix**
   - Make necessary code changes
   - Follow existing patterns in the codebase
   - Maintain consistency with code style

3. **Write tests**
   - Add test coverage for the fix
   - Verify edge cases are handled
   - Ensure existing tests still pass

4. **Create commit**
   ```bash
   git add .
   git commit -m "fix: resolve issue #$0

   <brief description of fix>

   Closes #$0"
   ```

5. **Push and create PR**
   ```bash
   git push -u origin fix-issue-$0
   gh pr create --title "Fix: Issue #$0" --body "Closes #$0"
   ```

6. **Verify**
   - Confirm PR created successfully
   - Check CI passes
   - Request review if needed
```

**Usage:** `/fix-issue 123`

**Result:**
1. Fetches issue #123 details via `gh issue view 123`
2. Claude sees issue details injected into skill
3. Implements fix, writes tests, creates commit
4. Pushes branch and creates PR

### Example 4: Codebase Visualizer (With Script)

Generates interactive HTML visualization by running a bundled Python script.

**Directory structure:**
```
codebase-visualizer/
├── SKILL.md
└── scripts/
    └── visualize.py
```

**File:** `~/.claude/skills/codebase-visualizer/SKILL.md`

```yaml
---
name: codebase-visualizer
description: Generate an interactive collapsible tree visualization of your codebase. Use when exploring a new repo, understanding project structure, or identifying large files.
allowed-tools: Bash(python *)
---

# Codebase Visualizer

Generate an interactive HTML tree view showing your project's file structure.

## Usage

Run the visualization script from your project root:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```

This creates `codebase-map.html` in the current directory and opens it in your browser.

## What the visualization shows

- **Collapsible directories**: Click folders to expand/collapse
- **File sizes**: Displayed next to each file
- **Colors**: Different colors for different file types
- **Directory totals**: Shows aggregate size of each folder
- **Search functionality**: Filter files by name or type
- **Size distribution**: Bar chart showing largest files

## Interpreting results

- Large files may indicate optimization opportunities
- Deeply nested structures suggest refactoring candidates
- Duplicate patterns hint at potential abstractions
```

**File:** `~/.claude/skills/codebase-visualizer/scripts/visualize.py`

```python
#!/usr/bin/env python3
"""
Interactive codebase visualizer
Generates HTML tree view with collapsible directories
"""
import os
import sys
import json
from pathlib import Path

def get_size(path):
    """Get file or directory size in bytes"""
    if path.is_file():
        return path.stat().st_size
    return sum(f.stat().st_size for f in path.rglob('*') if f.is_file())

def build_tree(path, max_depth=10, current_depth=0):
    """Build tree structure for visualization"""
    if current_depth >= max_depth:
        return None

    tree = {
        'name': path.name or str(path),
        'type': 'directory' if path.is_dir() else 'file',
        'size': get_size(path),
        'children': []
    }

    if path.is_dir():
        for child in sorted(path.iterdir()):
            if child.name.startswith('.'):
                continue
            child_tree = build_tree(child, max_depth, current_depth + 1)
            if child_tree:
                tree['children'].append(child_tree)

    return tree

def generate_html(tree_data, output_path):
    """Generate interactive HTML visualization"""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Codebase Map</title>
        <style>
            /* Styles for interactive tree view */
            body {{ font-family: monospace; padding: 20px; }}
            .tree {{ list-style: none; padding-left: 20px; }}
            .directory {{ font-weight: bold; cursor: pointer; }}
            .file {{ color: #666; }}
            .size {{ color: #999; font-size: 0.9em; }}
            .collapsed {{ display: none; }}
        </style>
        <script>
            const data = {json.dumps(tree_data)};
            // Interactive JavaScript for collapsible tree
        </script>
    </head>
    <body>
        <h1>Codebase Map</h1>
        <div id="tree"></div>
    </body>
    </html>
    """

    output_path.write_text(html)
    print(f"Generated: {output_path}")

if __name__ == '__main__':
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    tree = build_tree(root)
    output = root / 'codebase-map.html'
    generate_html(tree, output)

    # Open in browser
    import webbrowser
    webbrowser.open(f'file://{output.absolute()}')
```

**Usage:** "Visualize this codebase" or `/codebase-visualizer`

**Result:**
1. Claude runs `python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .`
2. Script generates `codebase-map.html`
3. Opens in default browser
4. Interactive exploration of codebase structure

### Example 5: Context-Aware Testing (Nested Skills)

Demonstrates nested skill discovery in monorepo.

**Root skill:** `.claude/skills/general-tests/SKILL.md`
```yaml
---
name: general-tests
description: Run project test suite
---

Run the complete test suite:
```bash
npm test
```
```

**Frontend skill:** `packages/frontend/.claude/skills/frontend-tests/SKILL.md`
```yaml
---
name: frontend-tests
description: Run frontend-specific tests with coverage
---

Run frontend tests with coverage:

```bash
cd packages/frontend
npm test -- --coverage
```

Focus on:
- Component testing
- User interaction flows
- Accessibility compliance
```

**When working in `packages/frontend/`:**
- Both `general-tests` and `frontend-tests` available
- Claude chooses `frontend-tests` for frontend work
- Context-aware skill selection

---

## Integration Patterns

### Skills + Subagents

**Two approaches:**

1. **Skill with `context: fork`:** Skill content becomes subagent task
2. **Subagent with preloaded skills:** Skills provide reference material

See [Advanced Patterns: Skills vs Subagents](#3-skills-vs-subagents-with-skills) above.

See also: [Sub-agents documentation](../../references/agents/sub-agents-claude-code.md)

### Skills + Hooks

**Scope hooks to skill lifecycle:**

```yaml
---
name: validated-commit
description: Create a validated commit with hooks
hooks:
  tool-approved:
    - run: echo "Tool approved during skill execution"
  pre-tool-use:
    - script: ./scripts/validate.sh
---

Create a commit following our standards...
```

Hooks in skill frontmatter are **scoped to that skill's execution**, not global.

See also: [Hooks documentation](../../references/hooks/hooks-claude-code.md)

### Skills + Memory (CLAUDE.md)

**Skills automatically load alongside CLAUDE.md:**

- Personal skills load with `~/.claude/CLAUDE.md`
- Project skills load with `.claude/CLAUDE.md`
- Both available to Claude simultaneously

**Hierarchy:**
1. `CLAUDE.md` provides context/memory
2. Skills provide capabilities
3. Combined, they create a personalized, capable Claude

See also: [Memory documentation](../../references/claude-code/memory-claude-code.md)

### Skills + Plugins

**Package skills in plugins:**

```
my-plugin/
├── plugin.json
└── skills/
    ├── skill-one/
    │   └── SKILL.md
    └── skill-two/
        └── SKILL.md
```

**Namespace:** `my-plugin:skill-one`

**Benefits:**
- Distribute skills with other extensions
- Version together
- Install as unit

See also: [Plugins documentation](../../references/plugins/plugins-claude-code.md)

---

## Best Practices

### 1. Write Clear Descriptions

**DO** include keywords users would naturally say:

```yaml
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

**DON'T** be vague or generic:

```yaml
description: Code explanation tool
```

**Why:** Description is how Claude decides when to trigger the skill.

### 2. Choose Appropriate Invocation

**DO** use `disable-model-invocation: true` for side-effect operations:

```yaml
---
name: deploy
disable-model-invocation: true
---
```

**DON'T** let Claude auto-invoke deployments or destructive operations.

**Why:** Prevents accidental execution of dangerous operations.

### 3. Keep SKILL.md Focused

**DO** keep under 500 lines, use supporting files for details:

```
my-skill/
├── SKILL.md           # 200 lines: overview + navigation
├── references/
│   └── api-docs.md    # 3,000 lines: detailed API reference
└── examples/
    └── usage.md       # 500 lines: comprehensive examples
```

**DON'T** put everything in SKILL.md (context bloat).

**Why:** Progressive disclosure keeps context efficient while providing depth.

### 4. Use Argument Hints

**DO** provide clear hints for expected arguments:

```yaml
argument-hint: <issue-number>
argument-hint: [component-name] [framework-from] [framework-to]
```

**DON'T** leave users guessing what to pass.

**Why:** Helps users understand how to invoke the skill correctly.

### 5. Reference Supporting Files Explicitly

**DO** tell Claude what each file contains:

```markdown
## Additional resources

- [reference.md](reference.md) - Complete API documentation
- [examples.md](examples.md) - Usage examples
- [troubleshooting.md](troubleshooting.md) - Common issues
```

**DON'T** include files without explanation.

**Why:** Claude won't know when to load unreferenced files.

### 6. Test Both Invocation Methods

**DO** test both auto and manual invocation:

- Auto: "How does authentication work?" (should trigger explain-code)
- Manual: `/explain-code src/auth.ts`

**DON'T** only test one invocation method.

**Why:** Ensures skill works in both contexts.

### 7. Use Context Fork for Heavy Tasks

**DO** run research/analysis in isolated subagent:

```yaml
---
name: deep-research
context: fork
agent: Explore
---
```

**DON'T** run heavy exploration inline (clutters main conversation).

**Why:** Keeps main conversation focused, isolates heavy work.

### 8. Write in Imperative Form

**DO** use imperative/infinitive:

```markdown
Start by reading the configuration file.
Validate the schema against the expected format.
Generate hooks based on the template.
```

**DON'T** use second person:

```markdown
You should start by reading the configuration file.
You need to validate the schema.
You will generate hooks.
```

**Why:** More direct, actionable, and professional tone.

### 9. Include Specific Trigger Phrases

**DO** provide concrete examples in description:

```yaml
description: This skill should be used when the user asks to "create a hook", "add a PreToolUse hook", "validate tool use", or "implement hook validation"
```

**DON'T** be abstract:

```yaml
description: Provides guidance for working with hooks
```

**Why:** Specific phrases improve auto-triggering accuracy.

### 10. Delete Unused Directories

**DO** remove empty directories:

```
minimal-skill/
└── SKILL.md           # Only what's needed
```

**DON'T** keep empty directories:

```
minimal-skill/
├── SKILL.md
├── references/        # Empty - delete this
├── examples/          # Empty - delete this
└── scripts/           # Empty - delete this
```

**Why:** Cleaner structure, clearer intent.

---

## Troubleshooting

### Skill Not Triggering

**If Claude doesn't use your skill when expected:**

1. **Check description includes keywords** users would naturally say
   - Add specific trigger phrases
   - Use language users would actually type

2. **Verify skill appears** in available skills:
   ```
   What skills are available?
   ```

3. **Try rephrasing** request to match description more closely

4. **Invoke directly** with `/skill-name` (if user-invocable)

5. **Check context budget:**
   ```
   /context
   ```
   If skills excluded, increase budget:
   ```bash
   export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
   ```

### Skill Triggers Too Often

**If Claude uses your skill when you don't want it:**

1. **Make description more specific** (narrow the trigger conditions)
   ```yaml
   # Too broad
   description: Explains code

   # More specific
   description: Explains code with visual diagrams. Use when user explicitly asks for explanation with examples or diagrams.
   ```

2. **Add `disable-model-invocation: true`** for manual invocation only

3. **Use more specific keywords** that are less likely to match general requests

### Claude Doesn't See All Skills

**Skill descriptions are loaded into context** (default budget: 15,000 characters)

**Check for warnings:**
```
/context
```

**If skills excluded due to budget:**

Set environment variable to increase limit:
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

### Supporting Files Not Loading

**Ensure files are referenced in SKILL.md:**

```markdown
See [reference.md](reference.md) for complete API documentation.
```

**Claude loads files only when:**
- Referenced in SKILL.md
- Relevant to current task
- Explicitly mentioned by user

**To force loading:**
- User asks: "Show me the reference documentation"
- Reference it in task: "Following the patterns in [patterns.md](patterns.md)..."

### Skill Invoked But Does Nothing

**Check skill content is actionable:**

**BAD (just guidelines):**
```yaml
---
name: my-skill
context: fork
---

When writing code, follow these guidelines...
```

Subagent receives guidelines but no task.

**GOOD (explicit task):**
```yaml
---
name: my-skill
context: fork
---

Analyze the codebase and create a report:
1. Find all components
2. Document their relationships
3. Identify refactoring opportunities

Following these guidelines: ...
```

Subagent has clear deliverable.

### Dynamic Context Injection Fails

**Check command syntax:**

**WRONG:**
```markdown
!git status        # Missing backticks
! `git status`     # Space before backtick
`git status`       # Missing exclamation mark
```

**CORRECT:**
```markdown
!`git status`      # Correct syntax
```

**Check command works in shell:**
```bash
gh pr diff         # Test command independently
```

**Check `allowed-tools` permits command:**
```yaml
allowed-tools: Bash(gh *)
```

### Scripts Not Executing

**Make scripts executable:**
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.py
```

**Check shebang line:**
```bash
#!/bin/bash        # For bash scripts
#!/usr/bin/env python3  # For Python scripts
```

**Verify script location:**
```
skills/my-skill/scripts/validate.sh    # Correct
skills/my-skill/validate.sh            # Wrong location
```

**Reference correctly in SKILL.md:**
```markdown
Use **`scripts/validate.sh`** to verify implementations.
```

---

## Related Documentation

### Skills Ecosystem

- [Skills Fundamentals](../01-fundamentals/core-concepts.md) - Core concepts and architecture
- [Creating Skills](../02-creating-skills/skill-structure.md) - Detailed creation guide
- [Cross-Platform Guide](../03-cross-platform/agentskills-standard.md) - Using skills across tools
- [Cursor Skills](cursor.md) - Cursor-specific features
- [Cline Skills](cline.md) - Cline-specific features

### Claude Code Features

- [Sub-agents](../../references/agents/sub-agents-claude-code.md) - Creating and using subagents
- [Hooks](../../references/hooks/hooks-claude-code.md) - Event-driven automation
- [Memory (CLAUDE.md)](../../references/claude-code/memory-claude-code.md) - Persistent context
- [Plugins](../../references/plugins/plugins-claude-code.md) - Extending Claude Code
- [Commands](../../references/commands/command-development.md) - Creating commands (legacy)

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Agent Skills Standard:** [agentskills.io](https://agentskills.io)
- **Skills Directory:** [skills.sh](https://skills.sh)
- **Anthropic Skill Creator:** Built-in `/skill-creator` skill in Claude Code

---

**Last Updated:** February 2026
**Category:** Skills Platform Guide
**Platform:** Claude Code
**Standard:** Agent Skills (agentskills.io)
