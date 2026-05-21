---
description: Audits and improves project documentation
agent: 'agent'
---

# Improve Documentation Command

This command launches the doc-improver agent to audit and enhance your project documentation.

## What It Does

1. **Analyzes** existing documentation structure
2. **Identifies** gaps, outdated content, or unclear sections
3. **Suggests** improvements following project documentation standards
4. **Generates** missing documentation (READMEs, guides, references)

## Usage

```bash
# Audit entire project
/improve-docs

# Audit specific directory
/improve-docs docs/guides

# Audit specific file
/improve-docs README.md
```

## What Gets Checked

- README files in major directories
- Code documentation (comments, docstrings)
- Setup/installation guides
- API/reference documentation
- Outdated links or examples
- Compliance with `.agents/rules/process/documentation.md`

## Agent Behavior

The doc-improver agent will:

- Read your documentation standards from rules
- Explore the specified path
- Identify documentation issues
- Present findings and proposed improvements
- Ask for approval before making changes

## Examples

**Example 1: Audit project root**

```bash
/improve-docs
```

**Example 2: Improve guides directory**

```bash
/improve-docs docs/guides
```

**Example 3: Review specific README**

```bash
/improve-docs src/README.md
```
