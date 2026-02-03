# Skill Development for Claude Code

## Overview

Skills are modular packages that extend Claude's capabilities through specialized knowledge, workflows, and tools. They function as "onboarding guides" for specific domains, transforming Claude into a specialized agent.

**Source:** [skills.sh/anthropics/claude-code/skill-development](https://skills.sh/anthropics/claude-code/skill-development)

---

## Skill Structure

```
skill-name/
├── SKILL.md           # Required: Main skill file
├── references/        # Optional: Detailed documentation
├── examples/          # Optional: Working examples
└── scripts/           # Optional: Executable utilities
```

---

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: Skill Name
description: This skill should be used when the user asks to "specific phrase 1", "specific phrase 2"
version: 0.1.0
---
```

### Frontmatter Fields

**`name`** (required)

- Skill identifier
- Clear, descriptive name
- Used for discovery and reference

**`description`** (required)

- **Critical for triggering**
- Use third-person: "This skill should be used when..."
- Include concrete trigger phrases users would say
- 2-4 specific examples

**`version`** (optional)

- Semantic versioning: `0.1.0`
- Helps track changes

### Description Best Practices

✅ **Good:**

```yaml
description: This skill should be used when the user asks to "create a hook",
"add a PreToolUse hook", "validate tool use", or "implement hook validation"
```

❌ **Bad:**

```yaml
description: Provides guidance for working with hooks
```

**Why?** Specific phrases help Claude know exactly when to trigger the skill.

### Body Content

**Length:** 1,500-2,000 words (maximum 5,000)

**Writing Style:**

- Use imperative/infinitive form: "Start by...", "To accomplish X, do Y"
- **Never use second person:** Avoid "You should", "You need to", "You will"
- Be direct and actionable

**Example:**

✅ **Correct:**

```markdown
Start by reading the configuration file.
Validate the schema against the expected format.
Generate hooks based on the template.
```

❌ **Incorrect:**

```markdown
You should start by reading the configuration file.
You need to validate the schema.
You will generate hooks.
```

### Referencing Bundled Resources

**Always explicitly reference supporting files:**

```markdown
## Detailed Patterns

See **`references/patterns.md`** for comprehensive hook patterns.

## Examples

Working examples are in **`examples/`** directory:

- `examples/pre-tool-use.js` - PreToolUse hook
- `examples/post-bash.js` - PostBash hook

## Utilities

Use **`scripts/validate-hook.sh`** to validate hook implementations.
```

---

## Bundled Resources

### scripts/ Directory

**Purpose:** Executable code for deterministic, repeatable tasks.

**When to Include:**

- Code that gets rewritten repeatedly
- Validation scripts
- Utility functions
- Common operations

**Benefits:**

- Token-efficient
- Deterministic execution
- May execute without loading into context

**Examples:**

```
scripts/
├── validate-hook.sh
├── generate-template.js
└── test-integration.py
```

### references/ Directory

**Purpose:** Documentation loaded as-needed into context.

**When to Include:**

- Detailed patterns and techniques
- API documentation
- Configuration schemas
- Migration guides
- Troubleshooting docs

**Size:** Each file can be 2,000-5,000+ words

**Examples:**

```
references/
├── hook-patterns.md
├── api-reference.md
└── migration-guide.md
```

**Note:** If files exceed 10k words, include grep search patterns in SKILL.md.

### examples/ Directory

**Purpose:** Working code examples.

**When to Include:**

- Complete, runnable examples
- Different use case demonstrations
- Template implementations

**Examples:**

```
examples/
├── basic-hook.js
├── advanced-validation.js
└── multi-step-workflow.js
```

### assets/ Directory

**Purpose:** Files for output generation, **not** context loading.

**When to Include:**

- Templates
- Images/icons
- Boilerplate code
- Brand assets

**Examples:**

```
assets/
├── logo.png
├── component-template.tsx
└── config-template.json
```

---

## Progressive Disclosure

Skills use a three-level loading system:

### Level 1: Metadata (~100 words)

**Always loaded**

- Skill name
- Description
- Version

**Purpose:** Skill discovery and triggering

### Level 2: SKILL.md Body (<5,000 words)

**Loaded when skill triggers**

- Main instructions
- Process workflows
- References to resources

**Purpose:** Primary guidance for task execution

### Level 3: Bundled Resources (Variable size)

**Loaded as Claude determines necessary**

- Detailed documentation
- Complex examples
- Utility scripts

**Purpose:** Deep dive information on-demand

---

## Creation Workflow

### Step 1: Understand Use Cases

**Identify concrete examples:**

- What specific tasks will this skill handle?
- What phrases would users say?
- What are common variations?

**Ask clarifying questions** (don't overwhelm):

- "What's the primary use case?"
- "What triggers should activate this skill?"
- "Are there related tasks to include?"

### Step 2: Plan Resources

For each use case, determine what resources help:

**Analysis Questions:**

- Is code repeatedly rewritten? → `scripts/`
- Do users need detailed docs? → `references/`
- Are working examples helpful? → `examples/`
- Will outputs need templates? → `assets/`

**Example:**
For a PDF editing skill:

- Rotating PDFs → `scripts/rotate_pdf.py` (deterministic)
- Format specifications → `references/pdf-spec.md` (detailed)
- Sample workflows → `examples/batch-process.js` (complete)
- Output templates → `assets/report-template.pdf` (boilerplate)

### Step 3: Create Structure

**For plugin skills:**

```bash
mkdir -p plugin-name/skills/skill-name/{references,examples,scripts,assets}
touch plugin-name/skills/skill-name/SKILL.md
```

**For personal skills:**

```bash
mkdir -p ~/.claude/skills/skill-name/{references,examples,scripts}
touch ~/.claude/skills/skill-name/SKILL.md
```

**Note:** Delete unused directories. Don't keep empty folders.

### Step 4: Write SKILL.md

**Answer these questions:**

1. **What's the purpose?** (few sentences)

   ```markdown
   This skill provides guidance for creating and managing Git hooks
   in Claude Code plugins.
   ```

2. **When should it be used?** (specific triggers in description)

   ```yaml
   description: This skill should be used when asking to "create a hook",
   "add a PreToolUse hook", "implement hook validation"
   ```

3. **How should Claude use it?** (reference resources)

   ```markdown
   ## Hook Patterns

   See **`references/hook-patterns.md`** for detailed patterns.

   ## Validation

   Use **`scripts/validate-hook.sh`** to verify implementations.
   ```

### Step 5: Add Resources

**Create referenced files:**

```bash
# Add detailed docs
echo "# Hook Patterns\n..." > references/hook-patterns.md

# Add working examples
cp ~/examples/pre-tool-use.js examples/

# Add utility scripts
chmod +x scripts/validate-hook.sh
```

**Important:** Delete unused directories to keep structure clean.

### Step 6: Validate

**Structure Checklist:**

- [ ] Skill in correct location (`plugin-name/skills/skill-name/` or `~/.claude/skills/`)
- [ ] SKILL.md has required frontmatter (name, description)
- [ ] Description includes specific trigger phrases
- [ ] Writing uses imperative form, not second person
- [ ] SKILL.md body is lean (1,500-2,000 words)
- [ ] Detailed content moved to `references/`
- [ ] All referenced files exist
- [ ] Scripts are executable (`chmod +x`)
- [ ] No empty directories

### Step 7: Test

**Test triggering:**

```bash
# Start Claude Code
cc

# Try trigger phrases from description
"create a hook for validating tool use"
"add a PreToolUse hook"
```

**Verify:**

- Skill activates correctly
- Referenced files load as needed
- Scripts execute properly
- Examples work as expected

### Step 8: Iterate

**After testing, improve based on:**

- Strengthen trigger phrases if skill doesn't activate
- Move long SKILL.md sections to `references/`
- Add missing examples or scripts
- Clarify ambiguous instructions
- Fix broken references

---

## Best Practices Summary

### DO ✅

- **Specific trigger phrases** in description
- **Third-person voice** ("This skill should be used when...")
- **Imperative form** in body ("Start by...", "To do X...")
- **Lean SKILL.md** (1,500-2,000 words)
- **Progressive disclosure** (metadata → SKILL.md → resources)
- **Reference files explicitly** in SKILL.md
- **Provide working examples**
- **Create utility scripts** for common operations
- **Delete unused directories**

### DON'T ❌

- **Vague descriptions** ("Provides guidance for...")
- **Second person anywhere** ("You should...", "You will...")
- **Everything in SKILL.md** (bloats context)
- **Unreferenced resources** (Claude won't know they exist)
- **Broken examples** or scripts
- **Empty directories** cluttering structure
- **Overly broad scope** (split into multiple skills)

---

## Skill Complexity Levels

### Minimal Skill

**Structure:** SKILL.md only

**When:** Simple knowledge or guidance

```
skill-name/
└── SKILL.md
```

### Standard Skill (Recommended)

**Structure:** SKILL.md + references/ + examples/

**When:** Most use cases

```
skill-name/
├── SKILL.md
├── references/
│   └── detailed-guide.md
└── examples/
    └── working-example.js
```

### Complete Skill

**Structure:** All components

**When:** Complex domains with validation

```
skill-name/
├── SKILL.md
├── references/
│   ├── patterns.md
│   └── api-docs.md
├── examples/
│   ├── basic.js
│   └── advanced.js
└── scripts/
    ├── validate.sh
    └── generate.js
```

---

## Plugin-Specific Notes

### Auto-Discovery

Claude Code automatically:

1. Scans `skills/` directory in plugins
2. Finds subdirectories with `SKILL.md`
3. Loads skill metadata (always in context)
4. Loads SKILL.md body when skill triggers
5. Loads resources as needed

### Distribution

**Plugin skills distribute with the plugin:**

- No separate packaging needed
- Users get skills automatically with plugin
- Updates deploy with plugin updates

### Testing

```bash
# Load plugin
cc --plugin-dir /path/to/plugin

# Test skill triggering
"create a hook for validation"
"add a PreToolUse hook"

# Verify correct skill loads
# Check references/examples load as needed
```

---

## Complete Example

### Minimal Hook Skill

```yaml
---
name: Hook Development
description: This skill should be used when asking to "create a hook",
"add a PreToolUse hook", "implement hook validation", or "configure hooks"
version: 1.0.0
---

# Hook Development Guide

## Purpose

Provides guidance for creating and managing hooks in Claude Code plugins.

## When to Use

Activate when users need to:
- Create new hooks
- Implement hook validation
- Configure hook behavior
- Debug hook issues

## Hook Types

### PreToolUse Hook
Validates tool calls before execution.

See **`examples/pre-tool-use.js`** for implementation.

### PostBash Hook
Processes bash command results.

See **`examples/post-bash.js`** for implementation.

## Validation

Use **`scripts/validate-hook.sh`** to verify hook implementations:

\`\`\`bash
./scripts/validate-hook.sh path/to/hook.js
\`\`\`

## Detailed Patterns

For comprehensive patterns and advanced techniques, see **`references/hook-patterns.md`**.
```

### Supporting Files

**examples/pre-tool-use.js:**

```javascript
// PreToolUse hook example
export default async function preToolUse({ toolName, toolInput }) {
  // Validate tool input
  if (toolName === "Bash" && !toolInput.command) {
    throw new Error("Bash command required");
  }

  return { approved: true };
}
```

**scripts/validate-hook.sh:**

```bash
#!/bin/bash
# Validate hook implementation
node -c "$1" && echo "✓ Valid hook" || echo "✗ Invalid hook"
```

**references/hook-patterns.md:**

```markdown
# Hook Patterns

## Validation Pattern

...detailed patterns...

## Transformation Pattern

...detailed patterns...
```

---

## Resources

- **Source:** [skills.sh/anthropics/claude-code/skill-development](https://skills.sh/anthropics/claude-code/skill-development)
- **Claude Code Docs:** [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
- **Skill Creator Guide:** See `skill-creator.md` in this directory

---

**Last Updated:** January 2026
**Category:** Claude Code Skills
