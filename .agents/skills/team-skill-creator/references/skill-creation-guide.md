# Skill Creation Guide

Complete process for creating skills within the `.agents/` system, adapted from the generic skill-creator workflow for team-specific architecture.

## Table of Contents

1. [Skill Creation Philosophy](#skill-creation-philosophy)
2. [Progressive Disclosure Design](#progressive-disclosure-design)
3. [Step-by-Step Creation Process](#step-by-step-creation-process)
4. [Frontmatter Requirements](#frontmatter-requirements)
5. [Bundled Resources](#bundled-resources)
6. [Best Practices](#best-practices)
7. [Team-Specific Adaptations](#team-specific-adaptations)

## Skill Creation Philosophy

### What Makes a Good Skill?

Skills extend AI agent capabilities with specialized knowledge that no model inherently possesses:

**Good skill candidates:**

- Domain expertise (company schemas, business logic, proprietary workflows)
- Repetitive code patterns requiring templates or boilerplate
- Multi-step procedures needing documentation
- Tool integrations with specific file formats or APIs

**Poor skill candidates:**

- General knowledge already in model training
- One-time operations (use commands instead)
- Simple prompts without bundled resources

### Core Principles

**1. Concise is Key**

The context window is shared by system prompt, conversation history, all skills' metadata, and user requests. Challenge every piece of information: "Does Claude really need this explanation?"

- ✅ Prefer concise examples over verbose explanations
- ✅ Use progressive disclosure (SKILL.md → references/)
- ❌ Don't repeat information already in AI's training data

**2. Set Appropriate Degrees of Freedom**

Match specificity to task fragility:

- **High freedom (text instructions):** When multiple approaches are valid, decisions depend on context
- **Medium freedom (pseudocode/scripts with parameters):** When a preferred pattern exists with acceptable variation
- **Low freedom (specific scripts, few parameters):** When operations are fragile, error-prone, or require exact sequences

**3. Progressive Disclosure**

Skills use three-level loading:

1. **Metadata (name + description)** - Always loaded (~100 words)
2. **SKILL.md body** - Loaded when skill triggers (~400-700 lines ideal, max 5,000)
3. **Bundled resources** - Loaded on-demand by Claude (unlimited)

## Progressive Disclosure Design

### Keep SKILL.md Lean

Target: **400-700 lines** for SKILL.md body
Maximum: **5,000 lines** (but split earlier to avoid context bloat)

**Pattern: High-level guide with references**

```markdown
# Database Queries

## Quick Start

Basic query example:
[concise code example]

## Advanced Features

- **Joins and relations**: See references/joins.md
- **Performance optimization**: See references/optimization.md
- **Schema reference**: See references/schema.md
```

Claude loads references only when needed.

### Domain-Specific Organization

For skills covering multiple domains, organize by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview + navigation)
└── references/
    ├── finance.md (revenue, billing)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

When user asks about sales metrics, Claude only reads `sales.md`.

### Avoid Deeply Nested References

Keep references **one level deep** from SKILL.md:

- ✅ SKILL.md → references/patterns.md
- ❌ SKILL.md → references/advanced/patterns/hooks.md

All reference files should link directly from SKILL.md.

### Table of Contents for Long References

For reference files **>100 lines**, include table of contents at top:

```markdown
# React Testing Patterns

## Table of Contents

1. [Component Testing](#component-testing)
2. [Hook Testing](#hook-testing)
3. [Async Testing](#async-testing)
4. [Integration Testing](#integration-testing)

## Component Testing

...
```

## Step-by-Step Creation Process

### Step 1: Understand Skill with Concrete Examples

**Purpose:** Clearly define how the skill will be used

**Questions to answer:**

- What functionality should this skill support?
- Can you give concrete examples of usage?
- What would trigger this skill?
- What variations of usage exist?

**Example for image-editor skill:**

- "What should it support? Editing, rotating, anything else?"
- "Examples: 'Remove red-eye from this image' or 'Rotate this image'"
- "Other use cases?"

**Output:** Clear list of concrete usage examples

### Step 2: Plan Reusable Skill Contents

**Purpose:** Identify what bundled resources make the skill effective

**Analysis for each example:**

1. How would you execute this from scratch?
2. What scripts, references, or assets would help when executing repeatedly?

**Example decisions:**

**PDF rotation skill:**

- Analysis: Rotating PDFs requires re-writing same code each time
- Decision: Add `scripts/rotate_pdf.py`

**Frontend webapp builder skill:**

- Analysis: Webapps need same HTML/React boilerplate each time
- Decision: Add `assets/hello-world/` template with boilerplate files

**BigQuery skill:**

- Analysis: Queries require re-discovering table schemas each time
- Decision: Add `references/schema.md` documenting schemas

**Output:** List of bundled resources to create (scripts/, references/, assets/)

### Step 3: Create Directory Structure

**In `.agents/` system, manually create directories:**

```bash
# Create skill directory
mkdir -p .agents/skills/{skill-name}

# Create subdirectories as needed
mkdir -p .agents/skills/{skill-name}/references
mkdir -p .agents/skills/{skill-name}/examples
mkdir -p .agents/skills/{skill-name}/assets
mkdir -p .agents/skills/{skill-name}/scripts
```

**Note:** Unlike generic skill-creator, `.agents/` system doesn't use `init_skill.py`. Create directories manually following team conventions.

### Step 4: Implement Bundled Resources

**Start with resources identified in Step 2:**

**Scripts (`scripts/`):**

- Executable code (Python/Bash/etc.) for deterministic operations
- ✅ Test scripts by actually running them
- ✅ Verify output matches expectations

**References (`references/`):**

- Documentation Claude should reference while working
- Examples: schemas, API docs, policies, workflow guides
- For large files (>10k words), include grep patterns in SKILL.md

**Assets (`assets/`):**

- Files used in output (not loaded into context)
- Examples: templates, images, boilerplate code
- Used by copying/modifying in final output

**Examples (`examples/`):**

- Working examples demonstrating skill usage
- Concrete use cases for reference

**Delete unused example files** created during initialization.

### Step 5: Write SKILL.md

#### Frontmatter

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2", "trigger phrase 3". Additional context about what the skill provides and when to use it.
version: 0.1.0
---
```

**Critical requirements:**

- **name**: lowercase, hyphens, 3-50 characters
- **description**: MUST be in **third person** ("This skill should be used when...")
- **description**: MUST include **specific trigger phrases** users would say
- **description**: Include ALL "when to use" information HERE (body is only loaded after triggering)

**Example description:**

```yaml
description: This skill should be used when the user needs to "test React components", "write React tests", "test hooks", or "test async components". Provides testing patterns, templates, and boilerplate generation for React component and hook testing.
```

**Do NOT include** other fields like `model`, `color`, `tools` (those are for agents, not skills).

#### Body

**Writing style:** Always use imperative/infinitive form

- ✅ "Create a new document..."
- ✅ "To test hooks, use..."
- ❌ "You should create..."
- ❌ "You can test hooks by..."

**Structure recommendations:**

```markdown
# Skill Name

## Overview

Brief description of what this skill does.

## Quick Start

Minimal working example to get started.

## Usage Patterns

Common use cases and workflows.

## Examples

Concrete examples demonstrating usage.

## Advanced Features

Links to references/ for deep dives.

## References

- See references/details.md for...
- See assets/template.tsx for...
```

**Keep it lean:** Reference bundled resources instead of duplicating content.

## Frontmatter Requirements

### Required Fields

**name:**

- Format: lowercase, hyphens only
- Length: 3-50 characters
- Example: `react-testing`, `database-queries`, `pdf-editor`

**description:**

- MUST use third person: "This skill should be used when..."
- MUST include trigger phrases: Exact words users would say
- MUST include context: What skill provides
- Target length: 1-3 sentences, ~50-150 words

### Optional Fields

**version:**

- Semantic versioning recommended: `0.1.0`, `1.0.0`, `1.2.3`
- Helps track skill evolution

**license:**

- If distributing externally
- Example: `MIT`, `Complete terms in LICENSE.txt`

### Fields to AVOID

Do NOT include in skill frontmatter (these are for agents):

- ❌ `model`
- ❌ `color`
- ❌ `tools`

## Bundled Resources

### Scripts (`scripts/`)

**When to include:**

- Same code being rewritten repeatedly
- Deterministic reliability needed
- Token efficiency important

**Examples:**

- `scripts/rotate_pdf.py` - PDF rotation
- `scripts/extract_data.py` - Data extraction
- `scripts/generate_boilerplate.sh` - Code generation

**Best practices:**

- ✅ Test all scripts before adding
- ✅ Include usage documentation in SKILL.md
- ✅ Make scripts executable: `chmod +x scripts/*.sh`
- ✅ Use clear, descriptive names

**Note:** Scripts may still be read into context for patching or environment-specific adjustments.

### References (`references/`)

**When to include:**

- Documentation Claude should reference while working
- Domain knowledge (schemas, APIs, policies)
- Detailed workflow guides
- Examples and patterns

**Examples:**

- `references/schema.md` - Database schemas
- `references/api_docs.md` - API specifications
- `references/patterns.md` - Code patterns
- `references/policies.md` - Company policies

**Best practices:**

- ✅ Keep SKILL.md lean, move details to references
- ✅ Add table of contents for files >100 lines
- ✅ Include grep patterns in SKILL.md for large files (>10k words)
- ❌ Avoid duplication between SKILL.md and references

### Assets (`assets/`)

**When to include:**

- Files used in output (not loaded into context)
- Templates, boilerplate, starter code
- Images, icons, fonts
- Sample documents

**Examples:**

- `assets/logo.png` - Brand assets
- `assets/template.tsx` - React component template
- `assets/boilerplate/` - Project starter files
- `assets/font.ttf` - Typography

**Best practices:**

- ✅ Files are copied/modified in output, not read into context
- ✅ Keep assets focused and relevant
- ✅ Document asset usage in SKILL.md

### Examples (`examples/`)

**When to include:**

- Working examples demonstrating skill usage
- Concrete use cases for reference
- Sample outputs

**Best practices:**

- ✅ Examples should be complete and functional
- ✅ Show multiple variations if applicable
- ✅ Keep examples concise but realistic

## Best Practices

### Writing Effective Descriptions

**Good description:**

```yaml
description: This skill should be used when the user needs to "test React components", "write React tests", "test hooks", or "test async React code". Provides testing patterns, templates, and boilerplate for Jest and React Testing Library.
```

**Poor description:**

```yaml
description: React testing helper.
```

**Why good is better:**

- ✅ Includes specific trigger phrases
- ✅ Lists multiple use cases
- ✅ Describes what skill provides
- ✅ Uses third person

### Designing for Progressive Disclosure

**Pattern: Start simple, link to complexity**

```markdown
# Database Queries

## Basic Queries

Simple SELECT example:
[code]

## Advanced Queries

For complex queries involving joins, see references/joins.md.
For performance optimization, see references/optimization.md.
For full schema reference, see references/schema.md.
```

**Pattern: Domain-specific files**

```markdown
# Company Database

## Overview

This skill provides access to company database schemas and query patterns.

## Domains

- **Finance**: See references/finance.md for revenue, billing queries
- **Sales**: See references/sales.md for opportunities, pipeline queries
- **Product**: See references/product.md for usage, features queries
```

### Testing Skills

**Before finalizing:**

1. ✅ Run all scripts to verify they work
2. ✅ Test skill triggers with expected phrases
3. ✅ Verify bundled resources load correctly
4. ✅ Check references are accessible
5. ✅ Validate frontmatter structure

**Testing workflow:**

```bash
# Validate structure
./.agents/skills/team-skill-creator/scripts/validate-skill.sh {skill-name}

# Sync to platforms
./.agents/sync.sh

# Test in AI agent
# Try trigger phrases from description
# Verify resources load when needed
```

## Team-Specific Adaptations

### Differences from Generic skill-creator

**No init_skill.py script:**

- Generic: Use `scripts/init_skill.py skill-name --path .`
- `.agents/`: Manually create directories with `mkdir -p`

**Location:**

- Generic: Can be anywhere
- `.agents/`: Must be in `.agents/skills/{skill-name}/`

**Synchronization:**

- Generic: Manual installation
- `.agents/`: Automatic via `sync.sh`

**Platform awareness:**

- Generic: Single platform
- `.agents/`: 5 platforms (Cursor, Claude Code, Gemini CLI, Antigravity, Copilot)

### Automatic Synchronization

After creating skill, synchronization happens automatically:

```bash
# Automatic (when using team-skill-creator)
# Claude executes: ./.agents/sync.sh

# Manual (when editing existing skills)
./.agents/sync.sh
```

**Verification:**

```bash
# Check symlinks created
ls -la .cursor/skills/{skill-name}
ls -la .claude/skills/{skill-name}

# Verify content accessible
cat .cursor/skills/{skill-name}/SKILL.md
```

### Platform Considerations

**Cursor, Claude Code, Gemini CLI:**

- ✅ Full directory symlinks
- ✅ Instant propagation of edits
- ✅ No re-sync needed after changes

**Antigravity:**

- ⚠️ Selective symlinks (per-skill)
- ⚠️ Must re-sync after editing: `./.agents/sync.sh`

### Integration with Team Workflow

**Creation workflow:**

1. Use team-skill-creator for guidance
2. Create directories in `.agents/skills/`
3. Implement bundled resources
4. Write SKILL.md
5. **Automatic sync** happens
6. Test in all platforms

**Maintenance workflow:**

1. Edit files in `.agents/skills/{skill-name}/`
2. Changes propagate instantly (Cursor/Claude/Gemini)
3. For Antigravity: Re-run `./.agents/sync.sh`
4. Verify changes: `cat .cursor/skills/{skill-name}/SKILL.md`

## Summary Checklist

Creating a skill in `.agents/` system:

- [ ] Understand skill with concrete examples
- [ ] Identify bundled resources needed (scripts/references/assets)
- [ ] Create directory: `.agents/skills/{skill-name}/`
- [ ] Create subdirectories: references/, examples/, assets/, scripts/
- [ ] Implement bundled resources
- [ ] Test scripts (actually run them)
- [ ] Write SKILL.md with frontmatter
- [ ] Use third-person description with trigger phrases
- [ ] Keep SKILL.md lean (400-700 lines ideal)
- [ ] Reference bundled resources from SKILL.md
- [ ] Validate structure: `scripts/validate-skill.sh {skill-name}`
- [ ] Sync automatically happens (or run manually: `./.agents/sync.sh`)
- [ ] Verify symlinks: `ls -la .cursor/skills/{skill-name}`
- [ ] Test skill with trigger phrases in AI agents
- [ ] Iterate based on usage feedback

**Result:** Skill available across all 5 platforms, ready to use!
