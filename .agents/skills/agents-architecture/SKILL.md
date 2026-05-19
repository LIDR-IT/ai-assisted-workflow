---
name: agents-architecture
description: This skill should be used when the user wants to "create a skill", "add a command to .agents/", "create an agent", "understand .agents/ architecture", "explain how to create components", "what's the difference between skills and commands", or needs guidance on creating skills, commands, or agents within the .agents/ source-of-truth system, with automatic synchronization across all platforms (Cursor, Claude Code, Gemini, Antigravity, Copilot).
version: 0.2.0
---

# Agents Architecture

Create and manage skills, commands, and agents within the `.agents/` centralized architecture with automatic synchronization across all AI platforms (Cursor, Claude Code, Gemini CLI, Antigravity, GitHub Copilot/VSCode).

## Overview

**agents-architecture** (formerly `team-skill-creator`) is the entry-point meta-skill for `.agents/` ecosystem authoring. It combines:

- **Understanding** the `.agents/` source-of-truth system
- **Decision guidance** for choosing the right component type
- **Creation workflows** for skills, commands, and agents
- **Automatic synchronization** across all platforms
- **Validation** and troubleshooting

### What is the `.agents/` System?

The `.agents/` directory serves as the **single source of truth** for all AI agent configurations:

```
.agents/
├── rules/        # Coding standards and best practices
├── skills/       # Modular knowledge packages
├── commands/     # Reusable prompt templates
└── mcp/          # MCP server configurations
```

**Key principle:** Edit once in `.agents/`, automatically synchronized to all platforms.

**Supported platforms:**

- **Cursor** - Full symlink support
- **Claude Code** - Full symlink support
- **Gemini CLI** - Full symlink support
- **Antigravity** - Native detection from `.agents/`
- **Copilot (VSCode)** - Copy+rename (`.instructions.md`, `.prompt.md`, `.agent.md`); reads skills natively from `.agents/`

### Automatic Synchronization

After creating any component, this skill automatically runs `./.agents/sync.sh` to:

1. Create symlinks for Cursor, Claude Code
2. Native detection for Gemini CLI, Antigravity, Copilot
3. Generate platform-specific MCP configs
4. Verify synchronization success

## Component Types

### Skills

**Definition:** Modular packages containing specialized knowledge, workflows, and bundled resources (scripts, references, assets).

**When to use:**

- Reusable across multiple projects or contexts
- Requires documentation, templates, or scripts
- Provides domain expertise (e.g., database schemas, testing patterns, API docs)
- Needs bundled resources

**Location:** `.agents/skills/{skill-name}/`

**Structure:**

```
.agents/skills/react-testing/
├── SKILL.md          # Main instructions
├── references/       # Documentation (loaded on-demand)
│   └── patterns.md
├── examples/         # Example files
├── assets/           # Templates, resources
│   └── test-template.tsx
└── scripts/          # Executable code
```

**Example use case:** "Create a skill for React component testing with test templates and pattern documentation"

**Detailed guide:** See `references/skill-creation-guide.md`

### Commands

**Definition:** Frequently-used prompts stored as Markdown files, accessible via `/{command-name}`.

**When to use:**

- Quick, single-turn actions
- Reusable prompts without complex logic
- No bundled resources needed
- Simple text-based instructions

**Location:** `.agents/commands/{command-name}.md`

**Structure:**

```markdown
## .agents/commands/security-review.md

## description: Review code for security issues

Review this code for common security vulnerabilities:

- SQL injection
- XSS attacks
- Authentication bypass
- CSRF vulnerabilities
```

**Example use case:** "Add a `/optimize` command to suggest performance improvements"

**Detailed guide:** See `references/command-creation-guide.md`

### Agents

**Definition:** Autonomous subprocesses that handle complex, multi-step tasks independently with decision-making capabilities.

**When to use:**

- Multi-step workflows requiring autonomy
- Tasks needing decision-making logic
- Complex analysis or refactoring
- Deep codebase exploration

**Location:** `.claude/agents/{agent-name}.md` (platform-specific, Claude Code only)

**Structure:**

```markdown
## .claude/agents/refactorer.md

name: refactorer
description: Autonomous code refactoring agent
tools: [Read, Edit, Grep, Bash]
model: sonnet
color: blue

---

Analyze codebase structure and perform autonomous refactoring...
```

**Example use case:** "Create an agent to automatically review and refactor legacy code"

**Platform note:** Agents are currently only supported in Claude Code.

**Detailed guide:** See `references/agent-creation-guide.md`

## Decision Guide

### Quick Decision Flowchart

```
What do you need to create?

├─ Reusable knowledge or workflow?
│  │
│  ├─ Needs scripts, templates, or documentation?
│  │  ├─ YES → SKILL
│  │  └─ NO  → COMMAND
│  │
│  └─ Used across multiple projects?
│     ├─ YES → SKILL
│     └─ NO  → COMMAND
│
├─ Autonomous multi-step task?
│  └─ AGENT (Claude Code only)
│
└─ Not sure?
   └─ Answer these questions:
      • Will it be used multiple times? → SKILL or COMMAND
      • Does it need to make decisions autonomously? → AGENT
      • Is it just a prompt template? → COMMAND
      • Does it include code/docs/assets? → SKILL
```

### Comparison Table

| Aspect          | Skill                  | Command             | Agent                  |
| --------------- | ---------------------- | ------------------- | ---------------------- |
| **Complexity**  | High                   | Low                 | High                   |
| **Autonomy**    | No                     | No                  | Yes                    |
| **Resources**   | Yes (scripts/refs/etc) | No                  | No                     |
| **Location**    | `.agents/skills/`      | `.agents/commands/` | `.claude/agents/`      |
| **Format**      | Directory with files   | Single `.md` file   | Single `.md` file      |
| **Platforms**   | All 5                  | All 5               | Claude Code only       |
| **Sync needed** | Yes (automatic)        | Yes (automatic)     | No (platform-specific) |

### Decision Examples

**Scenario 1:** "I need to teach AI how to write database queries with our schema"

- **Analysis:** Reusable knowledge + needs schema documentation
- **Decision:** SKILL (with `references/schema.md`)

**Scenario 2:** "I want a quick prompt to review code for bugs"

- **Analysis:** Simple prompt, no resources needed
- **Decision:** COMMAND

**Scenario 3:** "I need AI to analyze and refactor an entire module autonomously"

- **Analysis:** Multi-step, autonomous, decision-making
- **Decision:** AGENT

## Creation Workflows

### Workflow: Creating a Skill

**Steps:**

1. **Decide name and purpose**
   - Name: lowercase, hyphens (e.g., `react-testing`)
   - Purpose: What knowledge/workflow does it provide?

2. **Identify bundled resources**
   - Scripts needed? (`scripts/`)
   - Documentation? (`references/`)
   - Templates? (`assets/` or `examples/`)

3. **Create directory structure**

   ```bash
   mkdir -p .agents/skills/{skill-name}/{references,examples,assets,scripts}
   ```

4. **Create SKILL.md with frontmatter**

   ```markdown
   ---
   name: skill-name
   description: This skill should be used when the user asks to "trigger 1", "trigger 2". Context about skill.
   version: 0.1.0
   ---

   # Skill Name

   Instructions for using this skill...
   ```

5. **Add bundled resources**
   - Create files in `references/`, `examples/`, `assets/`, `scripts/`
   - Reference them from SKILL.md

6. **Automatic synchronization happens**
   - Skill triggers sync.sh automatically
   - Symlinks created for all platforms

7. **Verify synchronization**

   ```bash
   ls -la .cursor/skills/{skill-name}
   ls -la .claude/skills/{skill-name}
   ```

8. **Test in AI agents**
   - Trigger the skill with expected phrases
   - Verify it loads correctly

**Quick example:**

```
.agents/skills/react-testing/
├── SKILL.md
│   ---
│   name: react-testing
│   description: This skill should be used when the user needs help "testing React components", "writing React tests", "testing hooks". Provides patterns and templates.
│   version: 0.1.0
│   ---
│   # React Testing
│   ## Overview
│   Provides testing patterns for React components and hooks.
│   ## Patterns
│   ...
│   ## References
│   - See references/hook-testing.md for hook patterns
│   - See assets/test-template.tsx for boilerplate
│
├── references/
│   └── hook-testing.md
│
└── assets/
    └── test-template.tsx
```

**Detailed process:** See `references/skill-creation-guide.md`

**Template:** See `examples/skill-template.md`

### Workflow: Creating a Command

**Steps:**

1. **Decide name and prompt content**
   - Name: lowercase, hyphens (e.g., `security-review`)
   - Prompt: What should the AI do?

2. **Create file**

   ```bash
   touch .agents/commands/{command-name}.md
   ```

3. **Write frontmatter (optional) and content**

   ```markdown
   ---
   description: Brief description of command
   ---

   # Command Prompt

   Your prompt instructions here...
   ```

4. **Automatic synchronization happens**
   - Command triggers sync.sh automatically
   - Symlinks created for all platforms

5. **Verify synchronization**

   ```bash
   ls -la .cursor/commands/{command-name}.md
   ls -la .claude/commands/{command-name}.md
   ```

6. **Test command**
   - Use `/{command-name}` in AI agent
   - Verify prompt executes correctly

**Quick example:**

```markdown
## .agents/commands/security-review.md

## description: Review code for security vulnerabilities

Review the provided code for common security issues:

**Check for:**

- SQL injection vulnerabilities
- XSS (Cross-Site Scripting) attacks
- Authentication and authorization bypass
- CSRF (Cross-Site Request Forgery)
- Insecure data storage
- Hardcoded secrets or credentials

**Provide:**

- List of vulnerabilities found
- Severity rating (Critical/High/Medium/Low)
- Recommended fixes
```

**Detailed process:** See `references/command-creation-guide.md`

**Template:** See `examples/command-template.md`

### Workflow: Creating an Agent

**Steps:**

1. **Decide name and purpose**
   - Name: lowercase, hyphens (e.g., `code-reviewer`)
   - Purpose: What autonomous task will it perform?

2. **Create file** (Claude Code specific)

   ```bash
   touch .claude/agents/{agent-name}.md
   ```

3. **Write frontmatter with agent config**

   ```markdown
   ---
   name: agent-name
   description: Brief description and triggering conditions
   tools: [Read, Edit, Grep, Bash]
   model: sonnet
   color: blue
   ---
   ```

4. **Write system prompt**
   - Define agent's role and capabilities
   - Outline decision-making workflow
   - Specify autonomous behavior

5. **No sync needed**
   - Agents are platform-specific (Claude Code only)
   - No cross-platform synchronization required

6. **Test in Claude Code**
   - Trigger agent with expected conditions
   - Verify autonomous behavior

**Quick example:**

```markdown
## .claude/agents/refactorer.md

name: refactorer
description: Autonomous code refactoring for improving code quality and maintainability
tools: [Read, Edit, Grep, Bash]
model: sonnet
color: purple

---

# Code Refactoring Agent

You are an autonomous agent specialized in code refactoring and quality improvement.

## Your Capabilities

- Analyze code structure and identify improvement opportunities
- Refactor code for better readability and maintainability
- Apply design patterns and best practices
- Make autonomous decisions about refactoring approaches

## Your Workflow

1. **Analyze**: Read and understand the codebase structure
2. **Identify**: Find areas needing refactoring
3. **Plan**: Decide on refactoring strategy
4. **Execute**: Autonomously implement improvements
5. **Verify**: Ensure changes don't break functionality
6. **Report**: Summarize changes made

## Autonomous Decision-Making

Make independent decisions about:

- Which refactoring patterns to apply
- How to structure improved code
- When refactoring provides sufficient value
```

**Platform limitation:** Agents are currently only supported in **Claude Code**, not in Cursor, Gemini CLI, or Antigravity.

**Detailed process:** See `references/agent-creation-guide.md`

**Template:** See `examples/agent-template.md`

## Automatic Synchronization

### What is sync.sh?

The `.agents/sync.sh` CLI orchestrates synchronization of all components across platforms:

**What it does:**

1. Syncs rules from `.agents/rules/` → All platforms
2. Syncs skills from `.agents/skills/` → All platforms
3. Syncs commands from `.agents/commands/` → All platforms
4. Generates MCP configs from `.agents/mcp/` → Platform-specific files

**Synchronization strategies:**

- **Cursor, Claude Code, Gemini CLI:** Full directory symlinks (instant propagation)
- **Antigravity:** Selective symlinks per-item (platform limitation)
- **MCP configs:** Generated platform-specific files

### When Sync Happens

**Automatic:**

- After creating a skill via this skill
- After creating a command via this skill

**Manual (when needed):**

- After manually editing existing skills/commands
- After modifying rules or MCP configs
- When troubleshooting sync issues

### Sync Process (Automatic)

When creating skills/commands, the workflow is:

```
1. Create component in .agents/skills/ or .agents/commands/
2. Claude automatically executes: ./.agents/sync.sh
3. Sync script creates symlinks:
   - .cursor/skills → ../.agents/skills
   - .claude/skills → ../.agents/skills
   - .gemini/skills → ../.agents/skills
   - Antigravity reads natively from `.agents/skills/` (no symlink needed)
4. Verification checks run automatically
5. User receives confirmation: "✅ Synced to all platforms"
```

### Manual Verification

Verify synchronization manually:

```bash
# Check symlinks exist
ls -la .cursor/skills .cursor/commands
ls -la .claude/skills .claude/commands
ls -la .gemini/skills .gemini/commands

# Verify symlink targets
readlink .cursor/skills   # Should output: ../.agents/skills
readlink .cursor/commands # Should output: ../.agents/commands

# Test file access
ls .cursor/skills/agents-architecture/
cat .cursor/skills/agents-architecture/SKILL.md | head -20
```

### Platform-Specific Notes

**Cursor, Claude Code, Gemini CLI:**

- ✅ Full directory symlinks
- ✅ Instant propagation of changes
- ✅ No re-sync needed after edits

**Antigravity:**

- ⚠️ Selective symlinks (per-skill/command)
- ⚠️ Must re-run sync after editing existing components
- ✅ Commands go to `.agents/workflows/` (symlink to `.agents/commands/`)
- ❌ Agents not supported

**Detailed internals:** See `references/sync-system.md`

## Validation

### Validate a Skill

After creating a skill, validate its structure:

```bash
./.agents/skills/agents-architecture/scripts/validate-skill.sh {skill-name}
```

**Checks performed:**

- ✅ Directory exists at `.agents/skills/{skill-name}/`
- ✅ SKILL.md file exists
- ✅ YAML frontmatter is present
- ✅ Required fields: `name` and `description`
- ✅ Description uses third-person form
- ✅ Directory structure is valid

**Example:**

```bash
$ ./.agents/skills/agents-architecture/scripts/validate-skill.sh react-testing
🔍 Validating skill: react-testing
  ✅ Skill directory exists
  ✅ SKILL.md found
  ✅ YAML frontmatter valid
  ✅ Field 'name' present
  ✅ Field 'description' present
✅ Skill validation passed
```

### Validate a Command

```bash
./.agents/skills/agents-architecture/scripts/validate-command.sh {command-name}
```

**Checks performed:**

- ✅ File exists at `.agents/commands/{command-name}.md`
- ✅ File is readable
- ✅ Content is valid Markdown

### Validate an Agent

```bash
./.agents/skills/agents-architecture/scripts/validate-agent.sh {agent-name}
```

**Checks performed:**

- ✅ File exists at `.claude/agents/{agent-name}.md`
- ✅ YAML frontmatter present
- ✅ Required fields: `name`, `description`
- ✅ Optional fields valid: `tools`, `model`, `color`

## Troubleshooting

### Issue: Skill Not Appearing in Agent

**Symptoms:** Created skill doesn't show up or trigger in AI agent

**Diagnosis:**

```bash
# Check skill exists in source
ls .agents/skills/{skill-name}/

# Check symlink exists
ls -la .cursor/skills/{skill-name}

# Check symlink target
readlink .cursor/skills/{skill-name}
```

**Solution:**

```bash
# Re-run sync manually
./.agents/sync.sh

# Verify symlinks created
ls -la .cursor/skills .claude/skills

# Test file access
cat .cursor/skills/{skill-name}/SKILL.md
```

### Issue: Command Not Found

**Symptoms:** `/{command-name}` doesn't work

**Diagnosis:**

```bash
# Check command file exists
ls .agents/commands/{command-name}.md

# Check synced
ls -la .cursor/commands/{command-name}.md
```

**Solution:**

```bash
# Re-sync
./.agents/sync.sh

# Verify
ls .cursor/commands/ | grep {command-name}
```

### Issue: Agent Not Working

**Symptoms:** Agent doesn't trigger or execute

**Possible causes:**

1. **Platform:** Agents only work in Claude Code, not other platforms
2. **File location:** Must be in `.claude/agents/`, not `.agents/`
3. **Frontmatter:** Missing required fields

**Solution:**

```bash
# Verify file location
ls .claude/agents/{agent-name}.md

# Validate structure
./.agents/skills/agents-architecture/scripts/validate-agent.sh {agent-name}

# Check frontmatter has: name, description, tools
cat .claude/agents/{agent-name}.md | head -10
```

### Issue: Changes Not Propagating

**Symptoms:** Edited skill/command but changes not visible

**For Cursor, Claude Code, Gemini CLI:**

- Changes should propagate instantly (symlinks)
- If not: Check symlink is valid: `readlink .cursor/skills`

**For Antigravity:**

- Changes require re-sync (files are copied, not symlinked)
- Solution: `./.agents/sync.sh`

### Issue: Sync Script Fails

**Symptoms:** sync.sh exits with error

**Common causes:**

1. Source directory missing
2. Permissions issues
3. Invalid JSON in MCP configs

**Solution:**

```bash
# Check source exists
ls -la .agents/rules .agents/skills .agents/commands

# Check script executable
ls -l .agents/sync.sh

# Make executable if needed
chmod +x .agents/sync.sh

# Re-run
./.agents/sync.sh
```

## Architecture Overview

For detailed understanding of the `.agents/` system, see: `references/architecture-overview.md`

**Key concepts:**

- **Source of truth:** `.agents/` directory
- **Synchronization:** Symlinks for instant propagation
- **Platform support:** 5 platforms with varying capabilities
- **Component types:** Rules, Skills, Commands, Agents, MCP

**Platform support matrix:**

| Platform         | MCP Project | Skills | Commands | Agents  | Rules    |
| ---------------- | ----------- | ------ | -------- | ------- | -------- |
| Cursor           | ✅          | ✅ Sym | ✅ Sym   | ✅\*    | ✅ Copy  |
| Claude Code      | ✅          | ✅ Sym | ✅ Sym   | ✅      | ✅ Sym   |
| Gemini CLI       | ✅          | ✅ Sym | ✅ Gen   | ✅ Sym  | ❌ Index |
| Antigravity      | ❌ Global   | ✅ Nat | ✅ Nat   | ❌      | ✅ Nat   |
| Copilot (VSCode) | ✅          | ✅ Nat | ✅ Copy  | ✅ Copy | ✅ Copy  |

**Legend:**

- Sym = Full directory symlink
- Nat = Native detection from `.agents/`
- Gen = Generated (format conversion)
- Copy = Files copied during sync
- \*Agents may have limited support in Cursor

## References & Resources

### Detailed Guides

- **`references/skill-creation-guide.md`** - Complete process for creating skills with progressive disclosure, bundled resources, and best practices
- **`references/command-creation-guide.md`** - Detailed workflow for creating commands, frontmatter options, and usage patterns
- **`references/agent-creation-guide.md`** - Agent creation process, system prompt design, and autonomous workflows
- **`references/architecture-overview.md`** - Deep dive into `.agents/` system architecture, synchronization strategies, and platform capabilities
- **`references/sync-system.md`** - Internal workings of sync.sh, adapter-based architecture, and troubleshooting

### Templates

- **`examples/skill-template.md`** - Copy-paste template for creating new skills
- **`examples/command-template.md`** - Copy-paste template for creating new commands
- **`examples/agent-template.md`** - Copy-paste template for creating new agents

### Validation Scripts

- **`scripts/validate-skill.sh`** - Validate skill structure and frontmatter
- **`scripts/validate-command.sh`** - Validate command file
- **`scripts/validate-agent.sh`** - Validate agent structure and frontmatter

### Related Skills

For specialized creation workflows, see:

- **skill-development** - Deep dive into skill creation (637 lines)
- **command-development** - Comprehensive command creation (834 lines)
- **agent-development** - Detailed agent creation (415 lines)
- **skill-creator** - Generic skill creation workflow (357 lines)

**Note:** agents-architecture is a meta-skill that provides architectural context and routing. For in-depth component-specific guidance, the specialized skills above offer comprehensive workflows.

## Quick Reference

### File Locations

```
Skills:    .agents/skills/{name}/SKILL.md
Commands:  .agents/commands/{name}.md
Agents:    .claude/agents/{name}.md (platform-specific)
Rules:     .agents/rules/{name}.md
MCP:       .agents/mcp/mcp-servers.json
```

### Sync Commands

```bash
# Sync everything
./.agents/sync.sh

# Sync with preview (no changes)
./.agents/sync.sh --dry-run

# Sync specific components
./.agents/sync.sh --only=rules
./.agents/sync.sh --only=skills
./.agents/sync.sh --only=commands
./.agents/sync.sh --only=mcp
```

### Verification Commands

```bash
# Check symlinks
ls -la .cursor/{rules,skills,commands}
ls -la .claude/{rules,skills,commands}

# Verify symlink targets
readlink .cursor/skills    # → ../.agents/skills
readlink .cursor/commands  # → ../.agents/commands

# Test file access
cat .cursor/skills/agents-architecture/SKILL.md
ls .claude/skills/
```

### Validation Commands

```bash
# Validate skill
./.agents/skills/agents-architecture/scripts/validate-skill.sh {skill-name}

# Validate command
./.agents/skills/agents-architecture/scripts/validate-command.sh {command-name}

# Validate agent
./.agents/skills/agents-architecture/scripts/validate-agent.sh {agent-name}
```

---

**Ready to create?** Start by deciding which component type fits your need (skill, command, or agent), then follow the appropriate workflow above. Synchronization happens automatically!
