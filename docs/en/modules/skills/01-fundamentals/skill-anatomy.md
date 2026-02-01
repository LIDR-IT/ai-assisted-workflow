# Skill Anatomy

## Overview

Every skill follows a standardized structure that enables discovery, progressive disclosure, and cross-platform compatibility. This guide covers the anatomy of a well-structured skill.

## Core Structure

### Minimal Skill

The simplest possible skill:

```
skill-name/
└── SKILL.md           # Required: Main skill file
```

### Standard Skill (Recommended)

Most skills should follow this pattern:

```
skill-name/
├── SKILL.md           # Required: Main instructions
├── references/        # Optional: Detailed documentation
│   └── api-docs.md
└── examples/          # Optional: Working examples
    └── basic.js
```

### Complete Skill

For complex domains:

```
skill-name/
├── SKILL.md           # Main instructions
├── references/        # Detailed documentation
│   ├── patterns.md
│   └── api-docs.md
├── examples/          # Working examples
│   ├── basic.js
│   └── advanced.js
├── scripts/           # Executable utilities
│   ├── validate.sh
│   └── generate.py
└── assets/            # Templates and resources
    ├── template.json
    └── logo.png
```

## SKILL.md Format

Every `SKILL.md` file has two parts:

### 1. YAML Frontmatter

Between `---` markers at the top:

```yaml
---
name: skill-name
description: What this skill does and when to use it
---
```

### 2. Markdown Content

Instructions that Claude follows:

```markdown
---
name: skill-name
description: Specific trigger phrases and use cases
---

# Skill Title

Brief overview of what this skill does.

## When to Use

Clear criteria for when this skill should be invoked.

## Instructions

Step-by-step guidance or rules.

## Examples

Concrete examples of application.
```

## Frontmatter Fields

### Required Fields

#### name (string)

**Purpose:** Skill identifier

**Format:**
- Lowercase letters, numbers, hyphens only
- Max 64 characters
- No spaces or special characters

**Examples:**
```yaml
# ✅ Good
name: react-component-generator
name: api-security-audit
name: deploy-prod

# ❌ Bad
name: React Component Generator  # Spaces not allowed
name: api_security_audit         # Underscores not recommended
name: DeployProd                 # Uppercase not allowed
```

#### description (string)

**Purpose:** Critical triggering mechanism - Claude uses this to decide when to invoke the skill

**Format:**
- Concrete, specific trigger phrases
- Include keywords users would naturally say
- 2-4 example phrases
- Clear "when to use" criteria

**Examples:**

✅ **Good descriptions:**
```yaml
# Specific with trigger phrases
description: This skill should be used when the user asks to "create a hook", "add a PreToolUse hook", "validate tool use", or "implement hook validation"

# Clear use cases
description: Generates React functional components with TypeScript, hooks, and tests. Use when creating new React components or converting class components.

# Concrete triggers
description: Validates database schema migrations for consistency and safety. Use when reviewing migration files or before applying database changes.
```

❌ **Bad descriptions:**
```yaml
# Too vague
description: Helps with code

# No triggers
description: Database tools

# Generic
description: Provides guidance for hooks
```

**Formula:** `[Action] [Target] [Method/Context] [When to use]`

### Optional Fields

#### version (string)

**Purpose:** Track skill versions

**Format:** Semantic versioning `MAJOR.MINOR.PATCH`

```yaml
version: 1.0.0
version: 0.2.1
version: 2.1.0
```

#### argument-hint (string)

**Purpose:** Hint shown during autocomplete

**Format:** Brief placeholder text

```yaml
argument-hint: <issue-number>
argument-hint: [filename] [format]
argument-hint: <component-name>
```

#### disable-model-invocation (boolean)

**Purpose:** Prevent Claude from auto-loading (manual `/skill-name` only)

**Default:** `false`

**Use when:**
- Side-effect operations (deploy, commit, send-email)
- Operations requiring timing control
- Workflows you trigger manually

```yaml
# Manual invocation only
disable-model-invocation: true
```

#### user-invocable (boolean)

**Purpose:** Hide from `/` menu (background knowledge only)

**Default:** `true`

**Use when:**
- Background knowledge not actionable as command
- Context that should load automatically
- Skills users shouldn't invoke directly

```yaml
# Hidden from menu
user-invocable: false
```

#### allowed-tools (string)

**Purpose:** Tools Claude can use without permission when skill active

**Format:** Comma-separated tool names with optional patterns

```yaml
# Read-only tools
allowed-tools: Read, Grep, Glob

# With patterns
allowed-tools: Bash(npm *), Bash(git status)

# Multiple tools
allowed-tools: Read, Write, Bash(python scripts/*)
```

#### model (string)

**Purpose:** Model to use when skill is active

**Options:** `sonnet`, `opus`, `haiku`

```yaml
# Use faster model for simple tasks
model: haiku

# Use most capable for complex analysis
model: opus
```

#### context (string)

**Purpose:** Run skill in isolated subagent context

**Value:** `fork`

**Use when:**
- Skill contains complete task instructions
- Want isolated execution
- No conversation history needed

```yaml
# Run in subagent
context: fork
```

#### agent (string)

**Purpose:** Which subagent type when `context: fork`

**Options:**
- Built-in: `Explore`, `Plan`, `general-purpose`
- Custom: Any agent from `.claude/agents/`

```yaml
# Use Explore agent
context: fork
agent: Explore

# Use custom agent
context: fork
agent: my-custom-agent
```

#### hooks (object)

**Purpose:** Hooks scoped to skill lifecycle

**Format:** Hook configuration object

```yaml
hooks:
  tool-approved:
    - run: echo "Tool approved during skill"
```

## Frontmatter Reference Table

| Field | Type | Required | Default | Purpose |
|:------|:-----|:---------|:--------|:--------|
| `name` | string | Yes | - | Skill identifier (kebab-case, max 64 chars) |
| `description` | string | Recommended | First paragraph | Triggering mechanism with concrete phrases |
| `version` | string | No | - | Semantic version (e.g., 1.0.0) |
| `argument-hint` | string | No | - | Autocomplete hint (e.g., &lt;issue-number&gt;) |
| `disable-model-invocation` | boolean | No | false | Prevent auto-invocation (manual only) |
| `user-invocable` | boolean | No | true | Show in `/` menu |
| `allowed-tools` | string | No | - | Tools allowed without permission |
| `model` | string | No | - | Model preference (sonnet/opus/haiku) |
| `context` | string | No | - | Set to "fork" for subagent execution |
| `agent` | string | No | general-purpose | Subagent type when context=fork |
| `hooks` | object | No | - | Skill-scoped hooks |

## Markdown Content Guidelines

### Writing Style

**Use imperative/infinitive form:**

✅ **Correct:**
```markdown
Start by reading the configuration file.
Validate the schema against expected format.
Generate hooks based on the template.
```

❌ **Incorrect:**
```markdown
You should start by reading the configuration file.
You need to validate the schema.
You will generate hooks.
```

**Never use second person** ("you", "your"):
- ❌ "You should check..."
- ✅ "Check..."
- ❌ "Your task is..."
- ✅ "The task is..."

### Content Length

**SKILL.md body:**
- Target: 1,500-2,000 words
- Maximum: 5,000 words
- Exceeding 500 lines → Consider splitting

**When too large:**
- Move detailed docs to `references/`
- Extract examples to `examples/`
- Create utility scripts for `scripts/`

### Section Structure

**Recommended sections:**

```markdown
# Skill Title

Brief overview (1-2 paragraphs)

## When to Use

Clear triggering criteria

## Instructions

Step-by-step guidance

## Examples

Concrete usage examples

## Related Resources

- [Reference Doc](references/api.md)
- [Examples](examples/basic.js)
```

### Referencing Supporting Files

**Always explicitly reference files:**

```markdown
## Detailed Patterns

See **`references/patterns.md`** for comprehensive patterns.

## Examples

Working examples in **`examples/`** directory:
- `examples/basic.js` - Simple use case
- `examples/advanced.js` - Complex scenario

## Scripts

Use **`scripts/validate.sh`** to verify implementation.
```

**Why explicit references matter:**
- Claude needs to know files exist
- Knows when to load them
- Understands their purpose

## Supporting Directories

### scripts/

**Purpose:** Executable code for deterministic tasks

**When to include:**
- Code that gets rewritten repeatedly
- Validation scripts
- Utility functions
- Common operations

**Benefits:**
- Token-efficient
- Deterministic execution
- May execute without loading into context

**Example:**
```
scripts/
├── validate.sh      # Validation script
├── generate.py      # Code generation
└── test.js          # Testing utilities
```

**Make executable:**
```bash
chmod +x scripts/*.sh
chmod +x scripts/*.py
```

### references/

**Purpose:** Documentation loaded as-needed

**When to include:**
- Detailed patterns and techniques
- API documentation
- Configuration schemas
- Migration guides
- Troubleshooting docs

**Size:** Each file can be 2,000-5,000+ words

**Example:**
```
references/
├── api-reference.md    # Complete API docs
├── patterns.md         # Design patterns
└── migration.md        # Migration guide
```

**Note:** Files >10k words should include grep patterns in SKILL.md

### examples/

**Purpose:** Working code examples

**When to include:**
- Complete, runnable examples
- Different use case demonstrations
- Template implementations

**Example:**
```
examples/
├── basic.js           # Simple example
├── advanced.js        # Complex example
└── real-world.ts      # Production-like code
```

### assets/

**Purpose:** Files for output generation (not context loading)

**When to include:**
- Templates
- Images/icons
- Boilerplate code
- Brand assets

**Example:**
```
assets/
├── logo.png              # Brand logo
├── component-template.tsx # Code template
└── config-template.json  # Config boilerplate
```

**Important:** Assets are for OUTPUT, not for loading into context

## String Substitutions

Skills support dynamic value injection:

### Available Variables

| Variable | Description | Example |
|:---------|:------------|:--------|
| `$ARGUMENTS` | All arguments | "fix-issue 123" → "123" |
| `$ARGUMENTS[N]` | Specific argument (0-indexed) | `$ARGUMENTS[0]` = first arg |
| `$N` | Shorthand for argument | `$0` = first, `$1` = second |
| `${CLAUDE_SESSION_ID}` | Current session ID | Unique session identifier |

### Usage Examples

**Basic substitution:**
```markdown
---
name: fix-issue
description: Fix a GitHub issue by number
---

Fix GitHub issue $0 following coding standards.
```

**Multiple arguments:**
```markdown
---
name: migrate-component
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

**Invocation:** `/migrate-component SearchBar React Vue`
**Result:** "Migrate the SearchBar component from React to Vue."

**Session tracking:**
```markdown
---
name: session-logger
---

Log activity to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Default behavior:**
If `$ARGUMENTS` not present, arguments appended as:
```
ARGUMENTS: <value>
```

## Progressive Disclosure

### Three-Level System

**Level 1: Metadata (~100 words)**
- Always loaded
- Name + description
- Used for discovery

**Level 2: SKILL.md Body (&lt;5,000 words)**
- Loaded when skill triggers
- Main instructions
- References to resources

**Level 3: Resources (Variable size)**
- Loaded as Claude determines
- Detailed docs
- Examples and scripts

### Example Flow

```
1. All Skills (Metadata Only)
   ├─ react-component (description)
   ├─ api-security (description)
   └─ deployment (description)

2. User: "Create a React component"
   ↓
   Load: react-component/SKILL.md (full content)

3. Agent reads: "See references/patterns.md"
   ↓
   Load: react-component/references/patterns.md

4. Agent reads: "Use scripts/generate.js"
   ↓
   Execute: react-component/scripts/generate.js
```

## Platform-Specific Variations

### Claude Code

```yaml
---
name: skill-name
description: Trigger phrases
argument-hint: <args>
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep
model: sonnet
context: fork
agent: Explore
---
```

### Antigravity

```yaml
---
name: skill-name
description: Trigger phrases
---
```

**Note:** Antigravity supports fewer frontmatter fields

### Cross-Platform (OpenSkills)

```yaml
---
name: skill-name
description: Trigger phrases
version: 1.0.0
---
```

**Focus:** Maximize compatibility across platforms

## Best Practices

### Frontmatter

✅ **DO:**
- Write specific, concrete descriptions
- Include multiple trigger phrases
- Use semantic versioning
- Set disable-model-invocation for side effects

❌ **DON'T:**
- Write vague descriptions
- Omit version tracking
- Allow auto-invocation of destructive ops
- Use non-standard field names

### Content

✅ **DO:**
- Keep SKILL.md under 500 lines
- Use imperative form
- Reference supporting files explicitly
- Provide concrete examples

❌ **DON'T:**
- Put everything in SKILL.md
- Use second person
- Include unreferenced files
- Skip examples

### Organization

✅ **DO:**
- Use subdirectories for resources
- Make scripts executable
- Keep one level deep
- Delete unused directories

❌ **DON'T:**
- Flatten all files
- Forget chmod +x for scripts
- Create deep nesting
- Keep empty directories

## Common Patterns

### Pattern 1: Simple Instruction Skill

```markdown
---
name: code-review
description: Review code for bugs and best practices. Use when reviewing code files.
---

# Code Review

Review code for:

## Security
- SQL injection, XSS, auth bypass

## Performance
- N+1 queries, missing indexes

## Best Practices
- Organization, error handling, type safety
```

### Pattern 2: Workflow Skill

```markdown
---
name: deploy
description: Deploy application to production
disable-model-invocation: true
context: fork
---

# Deployment Workflow

1. Run test suite
2. Build application
3. Push to deployment target
4. Verify deployment succeeded

If any step fails, abort and report.
```

### Pattern 3: Generator Skill

```markdown
---
name: react-component
description: Generate React components with TypeScript and tests
---

# React Component Generator

Create component with:
1. TypeScript interface
2. Component implementation
3. Unit tests
4. Storybook story

Use assets/component-template.tsx as base.
```

## Troubleshooting

### Skill Not Triggering

**Check:**
1. Description includes user's keywords
2. Description is specific enough
3. Not conflicting with another skill

**Fix:**
- Add more trigger phrases
- Make description more specific
- Test with exact user phrasing

### Resources Not Loading

**Check:**
1. Files explicitly referenced in SKILL.md
2. Paths are correct (case-sensitive)
3. Files actually exist

**Fix:**
```markdown
See **`references/api.md`** for API documentation.
```

### Skill Too Large

**Check:**
1. SKILL.md line count
2. Content in main file vs references

**Fix:**
- Move detailed docs to references/
- Extract examples to examples/
- Create scripts for repetitive code

## Next Steps

- **Use skills:** [Discovery Guide](../02-using-skills/discovery.md)
- **Create skills:** [Creation Workflow](../03-creating-skills/workflow.md)
- **Learn patterns:** [Skill Patterns](../03-creating-skills/skill-patterns.md)

---

**Related:**
- [What Are Skills](what-are-skills.md) - Core concepts
- [Architecture](architecture.md) - How skills fit into agents
- [Design Principles](../03-creating-skills/design-principles.md) - Core philosophy

**External:**
- [Agent Skills Standard](https://agentskills.io) - Official specification
