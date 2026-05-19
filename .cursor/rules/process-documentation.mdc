---
name: documentation
description: Documentation standards and practices
alwaysApply: false
trigger: always_on
---

# Documentation Standards

## Documentation Philosophy

### Why We Document

- **Knowledge Transfer:** Enable team members to understand systems quickly
- **Future Self:** Help yourself 6 months from now
- **Onboarding:** Reduce ramp-up time for new contributors
- **Troubleshooting:** Provide reference during debugging
- **Compliance:** Meet project requirements and standards

### When to Document

**DO document:**

- Architecture decisions and rationale
- Setup and installation procedures
- Non-obvious workarounds or limitations
- Platform-specific behaviors
- Security considerations
- Complex algorithms or business logic

**DON'T document:**

- Obvious code that's self-explanatory
- Implementation details better suited for code comments
- Rapidly changing details (document the pattern, not the specifics)

## Documentation Structure

### Documentation Hierarchy

```
docs/
├── guidelines/              # Project-specific coding standards
│   ├── copywriting-guidelines.md
│   ├── react-native-guidelines.md
│   ├── web-design-guidelines.md
│   └── team-conventions/
│       ├── skills-management-guidelines.md
│       └── third-party-security-guidelines.md
├── guides/                  # How-to guides (task-oriented)
│   └── mcp/
│       ├── ANTIGRAVITY_SETUP.md
│       ├── ANTIGRAVITY_LIMITATION.md
│       ├── VALIDATION.md
│       └── mcp-setup-guide.md
├── notes/                   # Research, comparisons, explorations
│   └── skills-installation-and-mcp-comparison.md
└── references/              # Technical documentation (system-oriented)
    ├── agents/              # Agent system documentation
    ├── claude-code/         # Claude Code specifics
    ├── commands/            # CLI commands reference
    ├── hooks/               # Git hooks documentation
    ├── mcp/                 # MCP platform documentation
    ├── rules/               # Rules system documentation
    └── skills/              # Skills ecosystem reference
```

### Document Types

**Guidelines** (`docs/guidelines/`)

- Purpose: Define standards and best practices
- Audience: Team members writing code
- Example: `code-style.md`, `copywriting-guidelines.md`
- Format: Prescriptive rules with examples

**Guides** (`docs/guides/`)

- Purpose: Step-by-step instructions for tasks
- Audience: Users performing specific operations
- Example: `mcp-setup-guide.md`, `ANTIGRAVITY_SETUP.md`
- Format: Numbered steps with verification

**Notes** (`docs/notes/`)

- Purpose: Research, explorations, decision logs
- Audience: Team making decisions
- Example: `skills-installation-and-mcp-comparison.md`
- Format: Informal, exploratory, comparative

**References** (`docs/references/`)

- Purpose: Technical specifications and API docs
- Audience: Developers integrating systems
- Example: `mcp/README.md`, `skills/README.md`
- Format: Comprehensive, organized, searchable

## README Files

### Purpose of READMEs

Every major directory should have a README that answers:

- **What:** What is this directory/project?
- **Why:** Why does it exist?
- **How:** How do I use it?
- **Where:** Where can I learn more?

### README Structure

````markdown
# Directory/Project Name

Brief one-sentence description.

## Overview

1-2 paragraph explanation of purpose and context.

## Contents

- `file1.md` - Description
- `file2.md` - Description
- `subdirectory/` - Description

## Quick Start

```bash
# Basic usage example
./script.sh
```
````

## Related Documentation

- [Related Doc 1](path/to/doc1.md)
- [Related Doc 2](path/to/doc2.md)

````

### Root README (`README.md`)

Project root README should include:
```markdown
# Project Name

Brief project description.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

```bash
# Installation
npm install

# Usage
npm start
````

## Documentation

- [Setup Guide](docs/guides/setup.md)
- [Architecture](docs/references/architecture.md)
- [Contributing](CONTRIBUTING.md)

## Project Structure

```
project/
├── .agents/      # Centralized configurations
├── docs/         # Documentation
└── src/          # Source code
```

## License

[License Type]

````

## Writing Effective Documentation

### Markdown Best Practices

**Headers:**
```markdown
# H1: Document Title (only one per document)

## H2: Major Sections

### H3: Subsections

#### H4: Deep Details (use sparingly)
````

**Code Blocks:**

````markdown
```bash
# Always specify language
echo "Hello World"
```

```json
{
  "key": "value"
}
```
````

**Links:**

```markdown
# Internal (relative paths)

See [Setup Guide](../guides/setup.md)

# External (absolute URLs)

Visit [Website](https://example.com)

# Anchors (for long docs)

Jump to [Section](#section-name)
```

**Lists:**

```markdown
# Unordered (non-sequential)

- First item
- Second item
  - Nested item

# Ordered (sequential steps)

1. First step
2. Second step
3. Third step

# Definition lists

**Term:** Definition here
**Another:** Another definition
```

**Emphasis:**

```markdown
_Italic_ or _italic_
**Bold** or **bold**
**_Bold italic_**
`code`
```

**Tables:**

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

**Blockquotes:**

```markdown
> Important note or callout
> Continues on next line
```

**Horizontal Rules:**

```markdown
---
```

### Writing Style

**Clear and Concise:**

```markdown
# Good

Run the sync script to update configurations.

# Bad

You should probably consider running the synchronization script
in order to update the various configuration files across the project.
```

**Active Voice:**

```markdown
# Good

Create a new file in `.agents/rules/`.

# Bad

A new file should be created in `.agents/rules/`.
```

**Specific Examples:**

````markdown
# Good

```bash
./.agents/sync.sh --only=rules
```
````

# Bad

Run the sync script.

````

**Consistent Terminology:**
- Use same term throughout (e.g., "sync script" not "synchronization tool")
- Define acronyms on first use: "MCP (Model Context Protocol)"
- Maintain glossary for project-specific terms

## Code Comments

### When to Comment Code

**Comment for:**
- Complex algorithms
- Non-obvious workarounds
- Platform-specific limitations
- Security considerations
- TODOs and FIXMEs

**Don't comment:**
- Obvious code
- What the code does (code shows this)
- Redundant explanations
- Commented-out code (delete it)

### Comment Style

**Bash:**
```bash
# Single-line comment explaining why

# Multi-line comment explaining
# complex logic or edge cases
# across several lines

# TODO: Future improvement needed
# FIXME: Known issue to address
````

**Markdown (HTML comments):**

```markdown
<!-- Internal note not shown to readers -->
<!-- TODO: Add more examples -->
```

## Platform-Specific Documentation

### Antigravity Limitations

Always document Antigravity constraints clearly:

```markdown
## Platform Support

| Platform    | MCP Project | Rules   |
| ----------- | ----------- | ------- |
| Cursor      | ✅          | ✅      |
| Claude      | ✅          | ✅      |
| Gemini      | ✅          | ✅      |
| Antigravity | ❌          | ✅ Copy |

**Note:** Antigravity does NOT support project-level MCP configurations.
See [ANTIGRAVITY_LIMITATION.md](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md).
```

### Cross-References

Link to related documentation:

```markdown
## Related Documentation

- **Setup:** [MCP Setup Guide](docs/guides/mcp/mcp-setup-guide.md)
- **Limitations:** [Antigravity Limitation](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md)
- **Security:** [Third-Party Security](docs/guidelines/team-conventions/third-party-security-guidelines.md)
```

## Examples and Code Samples

### Good Examples

**Include context:**

````markdown
### Example: Adding a New MCP Server

1. Edit `.agents/mcp/mcp-servers.json`:

```json
{
  "servers": {
    "new-server": {
      "platforms": ["cursor", "claude", "gemini"],
      "command": "npx",
      "args": ["-y", "package-name"]
    }
  }
}
```
````

2. Run sync script:

```bash
./.agents/sync.sh --only=mcp
```

3. Verify:

```bash
claude mcp list
```

````

**Show expected output:**
```markdown
### Verification

Run the following command:
```bash
ls -la .cursor/rules
```

Expected output:
```
lrwxr-xr-x  1 user  staff  16 Jan 31 12:00 .cursor/rules -> ../.agents/rules
```
````

**Include error handling:**

````markdown
### Troubleshooting

**Symlink not created:**

```bash
# Check source exists
ls -la .agents/rules

# Re-run sync
./.agents/sync.sh --only=rules

# Manual creation
ln -s ../.agents/rules .cursor/rules
```
````

````

## Maintenance

### Keeping Documentation Current

**Review triggers:**
- When adding new features
- When fixing bugs (was it documented?)
- During code reviews
- Quarterly documentation sprints

**Update checklist:**
- [ ] Code changes reflected in docs
- [ ] Examples still work
- [ ] Links not broken
- [ ] Screenshots up-to-date (if any)
- [ ] Version numbers current

### Documentation TODOs

Mark incomplete sections clearly:

```markdown
## Advanced Configuration

> **TODO:** Document advanced configuration options
> **Status:** Placeholder - to be completed
> **Owner:** Team Lead
> **Priority:** Medium

For now, see [existing guide](basic-config.md).
```

## Templates

### Guide Template

```markdown
# Task Name Guide

Brief description of what this guide covers.

## Prerequisites

- Requirement 1
- Requirement 2
- Requirement 3

## Steps

### Step 1: First Task

Detailed instructions.

```bash
command --example
```

### Step 2: Second Task

More instructions.

### Step 3: Verification

How to verify success.

## Troubleshooting

**Issue:** Description
**Solution:** Resolution steps

## Related Documentation

- [Related Doc](path/to/doc.md)
```

### Reference Template

```markdown
# System/API Reference

Brief system overview.

## Architecture

System architecture explanation.

## Components

### Component 1

**Purpose:** What it does
**Location:** Where it lives
**Usage:** How to use it

### Component 2

**Purpose:** What it does
**Location:** Where it lives
**Usage:** How to use it

## API Reference

### Function Name

```bash
function_name(arg1, arg2)
```

**Parameters:**
- `arg1` (type): Description
- `arg2` (type): Description

**Returns:** Return value description

**Example:**
```bash
function_name "value1" "value2"
```

## Configuration

Configuration options and examples.

## Related Documentation

- [Guide](path/to/guide.md)
```

## References

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Write the Docs](https://www.writethedocs.org/)
- [Divio Documentation System](https://documentation.divio.com/)
````
