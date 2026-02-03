# Skills in Claude Code

## Overview

**Skills** extend what Claude can do in Claude Code by providing specialized capabilities through simple markdown files. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke them directly with `/skill-name`.

**Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

**Key Benefit:** "Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit."

---

## Core Concept

### What Are Skills?

Skills are **modular capabilities** that:

- Extend Claude's knowledge with domain expertise
- Provide step-by-step workflows for specific tasks
- Can be invoked manually (`/skill-name`) or automatically by Claude
- Follow the [Agent Skills](https://agentskills.io) open standard
- Work across multiple AI tools (not just Claude Code)

### Skills vs Commands

**Custom slash commands have been merged into skills.**

**Legacy behavior still works:**

- File at `.claude/commands/review.md` creates `/review` command
- File at `.claude/skills/review/SKILL.md` creates `/review` skill

**Skills add new features:**

- Directory for supporting files (templates, examples, scripts)
- Frontmatter to control invocation behavior
- Automatic loading by Claude when relevant
- String substitutions and dynamic context injection

**Priority:** If both exist with same name, skill takes precedence.

---

## Skill Locations

Where you store a skill determines its scope:

| Location   | Path                               | Applies to                |
| :--------- | :--------------------------------- | :------------------------ |
| Enterprise | See managed settings               | All users in organization |
| Personal   | `~/.claude/skills/<name>/SKILL.md` | All your projects         |
| Project    | `.claude/skills/<name>/SKILL.md`   | This project only         |
| Plugin     | `<plugin>/skills/<name>/SKILL.md`  | Where plugin is enabled   |

**Resolution priority:** Enterprise > Personal > Project

**Plugin namespace:** `plugin-name:skill-name` (cannot conflict with other levels)

### Automatic Nested Discovery

When editing files in subdirectories, Claude Code discovers skills from nested `.claude/skills/` directories.

**Example (monorepo):**

```
packages/frontend/
├── .claude/skills/
│   └── frontend-tests/SKILL.md
└── src/
    └── components/
```

When working in `packages/frontend/src/components/`, Claude finds both:

- Root `.claude/skills/`
- `packages/frontend/.claude/skills/`

---

## Skill Structure

Each skill is a directory with `SKILL.md` as the entrypoint:

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

**Required:** `SKILL.md` with YAML frontmatter + markdown content

**Optional supporting files:**

- Templates for Claude to fill in
- Example outputs showing expected format
- Scripts Claude can execute
- Detailed reference documentation

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
  # Hook configuration (optional)
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

---

## Frontmatter Reference

All fields are **optional**. Only `description` is recommended.

| Field                      | Type    | Description                                                                                                                                                        |
| :------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | string  | Display name for the skill. If omitted, uses directory name. Lowercase letters, numbers, hyphens only (max 64 chars).                                              |
| `description`              | string  | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses first paragraph of markdown content. **Recommended.** |
| `argument-hint`            | string  | Hint shown during autocomplete. Examples: `[issue-number]`, `[filename] [format]`                                                                                  |
| `disable-model-invocation` | boolean | Set to `true` to prevent Claude from auto-loading. Use for workflows you trigger manually. Default: `false`                                                        |
| `user-invocable`           | boolean | Set to `false` to hide from `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`                                                |
| `allowed-tools`            | string  | Tools Claude can use without permission when this skill is active. Example: `Read, Grep, Bash(npm *)`                                                              |
| `model`                    | string  | Model to use when this skill is active. Options: `sonnet`, `opus`, `haiku`                                                                                         |
| `context`                  | string  | Set to `fork` to run in a forked subagent context.                                                                                                                 |
| `agent`                    | string  | Which subagent type to use when `context: fork` is set. Options: built-in agents (`Explore`, `Plan`, `general-purpose`) or custom agents from `.claude/agents/`    |
| `hooks`                    | object  | Hooks scoped to this skill's lifecycle. See Hooks documentation for format.                                                                                        |

---

## String Substitutions

Skills support dynamic value injection:

| Variable               | Description                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------- |
| `$ARGUMENTS`           | All arguments passed when invoking. If not present, arguments appended as `ARGUMENTS: <value>` |
| `$ARGUMENTS[N]`        | Access specific argument by 0-based index. `$ARGUMENTS[0]` = first argument                    |
| `$N`                   | Shorthand for `$ARGUMENTS[N]`. `$0` = first, `$1` = second, etc.                               |
| `${CLAUDE_SESSION_ID}` | Current session ID. Useful for logging, session-specific files, or correlating output          |

**Example:**

```yaml
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**With indexed arguments:**

```yaml
---
name: migrate-component
description: Migrate a component from one framework to another
---
Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

**Usage:** `/migrate-component SearchBar React Vue`

**Result:** "Migrate the SearchBar component from React to Vue."

---

## Types of Skill Content

### Reference Content

Adds knowledge Claude applies to current work. Runs inline in conversation.

**Use for:**

- Code conventions
- Style guides
- Architecture patterns
- Domain knowledge

**Example:**

```yaml
---
name: api-conventions
description: API design patterns for this codebase
---
When writing API endpoints:
  - Use RESTful naming conventions
  - Return consistent error formats
  - Include request validation
  - Add rate limiting to auth endpoints
```

### Task Content

Step-by-step instructions for specific actions. Often manually invoked.

**Use for:**

- Deployments
- Commits
- Code generation
- Multi-step workflows

**Add `disable-model-invocation: true`** to prevent automatic triggering.

**Example:**

```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify deployment succeeded
```

---

## Controlling Skill Invocation

By default, **both you and Claude** can invoke any skill.

### Two Control Fields

**1. `disable-model-invocation: true`**

- Only you can invoke (manual `/skill-name` only)
- Use for workflows with side effects or requiring timing control
- Examples: `/commit`, `/deploy`, `/send-slack-message`

**2. `user-invocable: false`**

- Only Claude can invoke (hidden from `/` menu)
- Use for background knowledge not actionable as a command
- Example: `legacy-system-context` skill

### Invocation Matrix

| Frontmatter                      | You invoke | Claude invokes | Context loading                                              |
| :------------------------------- | :--------- | :------------- | :----------------------------------------------------------- |
| (default)                        | Yes        | Yes            | Description in context, full skill loads when invoked        |
| `disable-model-invocation: true` | Yes        | No             | Description NOT in context, full skill loads when you invoke |
| `user-invocable: false`          | No         | Yes            | Description in context, full skill loads when invoked        |

**Note:** In regular sessions, only skill **descriptions** load into context. Full skill content loads **only when invoked**. Subagents with preloaded skills work differently.

---

## Supporting Files

Keep `SKILL.md` focused (under 500 lines). Move detailed material to separate files.

### Directory Structure

```
my-skill/
├── SKILL.md           # Overview and navigation (required)
├── reference.md       # Detailed API docs (loaded when needed)
├── examples.md        # Usage examples (loaded when needed)
└── scripts/
    └── helper.py      # Utility script (executed, not loaded)
```

### Referencing Files

Tell Claude what each file contains in `SKILL.md`:

```markdown
## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

Claude loads these files **only when needed**, keeping context usage efficient.

---

## Advanced Patterns

### 1. Dynamic Context Injection

The `` !`command` `` syntax runs shell commands **before** Claude sees the skill content.

**How it works:**

1. Each `` !`command` `` executes immediately (preprocessing)
2. Output replaces the placeholder
3. Claude receives the fully-rendered prompt with actual data

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
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request focusing on:
- What changed and why
- Potential issues or concerns
- Testing recommendations
```

**Important:** This is **preprocessing**, not something Claude executes. Claude only sees the final result.

### 2. Run Skills in a Subagent

Add `context: fork` to run a skill in isolation (no conversation history).

**When to use:**

- Skill contains explicit instructions for a complete task
- You want isolated execution (no cross-contamination)
- Task should run independently

**When NOT to use:**

- Skill contains only guidelines without a task
- Subagent receives guidelines but no actionable prompt
- Returns without meaningful output

**Example: Research Skill**

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

**Execution flow:**

1. New isolated context created
2. Subagent receives skill content as its prompt
3. `agent` field determines execution environment (model, tools, permissions)
4. Results summarized and returned to main conversation

**Agent options:**

- Built-in: `Explore`, `Plan`, `general-purpose`
- Custom: Any agent from `.claude/agents/`
- Default (if omitted): `general-purpose`

### 3. Skills vs Subagents with Skills

Two directions for combining skills and subagents:

| Approach                     | System prompt                             | Task                        | Also loads                   |
| :--------------------------- | :---------------------------------------- | :-------------------------- | :--------------------------- |
| Skill with `context: fork`   | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content            | CLAUDE.md                    |
| Subagent with `skills` field | Subagent's markdown body                  | Claude's delegation message | Preloaded skills + CLAUDE.md |

**Skill with `context: fork`:**

- You write the task in skill
- You pick agent type to execute it

**Subagent with skills:**

- You define custom subagent
- Skills serve as reference material
- See Sub-agents documentation

### 4. Extended Thinking (Thinking Mode)

To enable extended thinking in a skill, include the word **"ultrathink"** anywhere in your skill content.

**Example:**

```yaml
---
name: complex-analysis
description: Deep analysis requiring extended thinking
---

Ultrathink through this problem carefully:

1. Analyze all aspects
2. Consider edge cases
3. Evaluate tradeoffs
```

---

## Tool Restrictions

### Skill-Level Restrictions

Use `allowed-tools` to limit which tools Claude can use when a skill is active.

**Example: Read-only Mode**

```yaml
---
name: safe-reader
description: Read files without making changes
allowed-tools: Read, Grep, Glob
---
Explore the codebase to answer questions. You cannot modify files.
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
```

**Permission syntax:**

- `Skill(name)` - Exact match
- `Skill(name *)` - Prefix match with any arguments

**Note:** The `user-invocable` field controls **menu visibility** only, not Skill tool access. Use `disable-model-invocation: true` to block programmatic invocation.

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
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

Keep explanations conversational. For complex concepts, use multiple analogies.
```

**Usage:**

- Auto: "How does this code work?"
- Manual: `/explain-code src/auth/login.ts`

### Example 2: Deploy (Manual Only)

Prevents automatic invocation with `disable-model-invocation: true`.

**File:** `.claude/skills/deploy/SKILL.md`

```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
context: fork
---

Deploy $ARGUMENTS to production:

1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify the deployment succeeded
5. Monitor for errors in the first 5 minutes

If any step fails, abort and report the issue.
```

**Usage:** `/deploy staging` or `/deploy production`

### Example 3: Fix GitHub Issue (With Arguments)

Uses indexed arguments for structured input.

**File:** `.claude/skills/fix-issue/SKILL.md`

```yaml
---
name: fix-issue
description: Fix a GitHub issue by number
argument-hint: <issue-number>
disable-model-invocation: true
---

Fix GitHub issue $0 following our coding standards:

1. Fetch issue details: !`gh issue view $0`
2. Understand the requirements
3. Implement the fix
4. Write tests
5. Create a commit with message: "fix: resolve issue #$0"
6. Push and create PR
```

**Usage:** `/fix-issue 123`

**Result:** Claude sees issue #123 details injected via `gh issue view 123`

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

````yaml
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
````

This creates `codebase-map.html` in the current directory and opens it in your browser.

## What the visualization shows

- **Collapsible directories**: Click folders to expand/collapse
- **File sizes**: Displayed next to each file
- **Colors**: Different colors for different file types
- **Directory totals**: Shows aggregate size of each folder

````

**File:** `~/.claude/skills/codebase-visualizer/scripts/visualize.py`

See official documentation for complete Python script (generates interactive HTML with sidebar stats, bar chart, and collapsible tree).

**Usage:** "Visualize this codebase"

**Result:** Claude runs script, generates `codebase-map.html`, opens in browser.

---

## Sharing Skills

Skills can be distributed at different scopes:

### Project Skills

**Method:** Commit `.claude/skills/` to version control

**Benefit:** All team members get project-specific skills

**Example:**

```bash
git add .claude/skills/
git commit -m "Add project-specific skills"
git push
````

### Plugin Skills

**Method:** Create `skills/` directory in your plugin

**Structure:**

```
my-plugin/
├── plugin.json
└── skills/
    ├── skill-one/
    │   └── SKILL.md
    └── skill-two/
        └── SKILL.md
```

**Benefit:** Package and distribute skills with other extensions

**See:** Plugins documentation

### Organization Skills

**Method:** Deploy organization-wide through managed settings

**Benefit:** Enforce standards across entire organization

**See:** IAM and Managed Settings documentation

---

## Troubleshooting

### Skill Not Triggering

**If Claude doesn't use your skill when expected:**

1. **Check description includes keywords** users would naturally say
2. **Verify skill appears** in "What skills are available?"
3. **Try rephrasing** request to match description more closely
4. **Invoke directly** with `/skill-name` (if user-invocable)

### Skill Triggers Too Often

**If Claude uses your skill when you don't want it:**

1. **Make description more specific** (narrow the trigger conditions)
2. **Add `disable-model-invocation: true`** for manual invocation only

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

### Supporting Files Not Loading

**Ensure files are referenced in SKILL.md:**

```markdown
See [reference.md](reference.md) for complete API documentation.
```

**Claude loads files only when:**

- Referenced in SKILL.md
- Relevant to current task

---

## Integration with Other Features

### Skills + Subagents

**Two approaches:**

1. **Skill with `context: fork`:** Skill content becomes subagent task
2. **Subagent with preloaded skills:** Skills provide reference material

**See:** Sub-agents documentation

### Skills + Hooks

**Scope hooks to skill lifecycle:**

```yaml
---
name: my-skill
hooks:
  tool-approved:
    - run: echo "Tool approved during skill execution"
---
```

**See:** Hooks documentation

### Skills + Memory (CLAUDE.md)

**Skills automatically load alongside CLAUDE.md:**

- Personal skills: Load with personal CLAUDE.md
- Project skills: Load with project CLAUDE.md
- Both available to Claude simultaneously

**See:** Memory documentation

### Skills + Plugins

**Package skills in plugins:**

```
my-plugin/
├── plugin.json
└── skills/
    └── my-skill/
        └── SKILL.md
```

**Namespace:** `my-plugin:my-skill`

**See:** Plugins documentation

---

## Best Practices

### 1. Write Clear Descriptions

✅ **DO:** Include keywords users would naturally say

```yaml
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

❌ **DON'T:** Be vague or generic

```yaml
description: Code explanation tool
```

### 2. Choose Appropriate Invocation

✅ **DO:** Use `disable-model-invocation: true` for side-effect operations

```yaml
---
name: deploy
disable-model-invocation: true
---
```

❌ **DON'T:** Let Claude auto-invoke deployments or destructive operations

### 3. Keep SKILL.md Focused

✅ **DO:** Keep under 500 lines, use supporting files for details

```
my-skill/
├── SKILL.md           # Overview (200 lines)
├── reference.md       # Detailed docs (1000 lines)
└── examples.md        # Examples (300 lines)
```

❌ **DON'T:** Put everything in SKILL.md (context bloat)

### 4. Use Argument Hints

✅ **DO:** Provide clear hints for expected arguments

```yaml
argument-hint: <issue-number>
```

❌ **DON'T:** Leave users guessing what to pass

### 5. Reference Supporting Files

✅ **DO:** Tell Claude what each file contains

```markdown
## Additional resources

- [reference.md](reference.md) - Complete API documentation
- [examples.md](examples.md) - Usage examples
```

❌ **DON'T:** Include files without explanation (Claude won't know when to load them)

### 6. Test Both Invocation Methods

✅ **DO:** Test both auto and manual invocation

- Auto: "How does authentication work?" (should trigger explain-code)
- Manual: `/explain-code src/auth.ts`

❌ **DON'T:** Only test one invocation method

### 7. Use Context Fork for Heavy Tasks

✅ **DO:** Run research/analysis in isolated subagent

```yaml
---
name: deep-research
context: fork
agent: Explore
---
```

❌ **DON'T:** Run heavy exploration inline (clutters main conversation)

---

## Related Resources

### In This Repository

**Skills:**

- `npm-skills-package.md` - Skills package manager
- `openskills.md` - Universal skills loader
- `find-skills-vercel.md` - Skill discovery tool
- `skill-creator.md` - Creating skills guide (Anthropic official)
- `skill-development-claude-code.md` - Claude Code specific development
- `skills-ecosystem-overview.md` - Skills ecosystem general overview

**MCP:**

- `docs/references/mcp/mcp-introduction.md` - MCP overview
- `docs/references/mcp/mcp-integration-claude-code.md` - MCP integration
- `docs/references/mcp/mcp-server-builder.md` - Building MCP servers

**Commands & Agents:**

- `docs/references/commands/command-development.md` - Creating commands
- `docs/references/agents/agent-development-claude-code.md` - Creating agents
- `docs/references/agents/sub-agents-claude-code.md` - Sub-agents guide

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Agent Skills Standard:** [agentskills.io](https://agentskills.io)
- **Skills Directory:** [skills.sh](https://skills.sh)

---

**Last Updated:** January 2026
**Category:** Skills
**Status:** Official Claude Code Feature
**Standard:** Agent Skills (agentskills.io)
