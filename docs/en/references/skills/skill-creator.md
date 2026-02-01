# Skill Creator - Building Effective Claude Skills

## Overview

**skill-creator** is Anthropic's official guidance tool for building effective skills. Skills are modular packages that extend Claude's capabilities with specialized knowledge, workflows, and tools, transforming Claude into a specialized agent for specific domains.

**Source:** [skills.sh/anthropics/skills/skill-creator](https://skills.sh/anthropics/skills/skill-creator)
**Provider:** Anthropic
**Category:** Skill Development

---

## What Are Skills?

Skills are **modular packages** that extend Claude's capabilities with:
- **Specialized knowledge**: Domain-specific information and expertise
- **Workflows**: Step-by-step processes and procedures
- **Tools**: Scripts, templates, and resources for specific tasks

Skills transform Claude from a general assistant into a specialized agent for specific domains like code review, documentation, testing, deployment, etc.

---

## Skill Structure

### Required Component

#### SKILL.md (Required)

The main skill file containing:
1. **YAML frontmatter**: Metadata (name and description)
2. **Markdown instructions**: Detailed guidance for Claude

**Structure:**
```markdown
---
name: skill-name
description: What this skill does and when to use it
---

# Skill Title

Detailed instructions for Claude...
```

### Optional Components

#### scripts/ Directory

Executable code for deterministic, repeatable tasks.

**When to use:**
- Tasks that must be performed exactly the same way every time
- Error-prone operations requiring precise execution
- Automation that benefits from code over natural language

**Examples:**
- File manipulation scripts
- Data transformation utilities
- API interaction helpers
- Build/deployment automation

#### references/ Directory

Documentation loaded into context as needed.

**When to use:**
- Large reference materials (API docs, specifications)
- Background information not always needed
- Supporting documentation for complex topics

**Examples:**
- API documentation
- Configuration schemas
- Code examples
- Best practices guides

#### assets/ Directory

Templates, icons, and boilerplate files for output use.

**When to use:**
- Files that need to be created/copied
- Templates for common patterns
- Boilerplate code structures
- Images, icons, or other media

**Examples:**
- Code templates
- Configuration file templates
- Markdown templates
- Icons/images for documentation

---

## Core Design Principles

### 1. Conciseness

**Principle:** The context window is shared across system prompts, conversation history, and other skills.

**Rule:** Only include information Claude wouldn't already know.

**Application:**
- Don't explain basic programming concepts
- Don't include general knowledge
- Focus on domain-specific information
- Remove redundant explanations

**Example:**
```markdown
❌ Don't:
React is a JavaScript library for building user interfaces.
Components are reusable pieces of UI.

✅ Do:
Prefer server components by default.
Use 'use client' only when:
- Component uses hooks (useState, useEffect)
- Component handles browser events
- Component uses browser-only APIs
```

### 2. Degrees of Freedom

**Principle:** Match specificity to task fragility.

**Spectrum:**
1. **Text instructions** → Flexible tasks where approach varies
2. **Pseudocode** → Preferred patterns with some flexibility
3. **Specific scripts** → Error-prone operations requiring precision

**When to use each:**

**Text Instructions:**
```markdown
Review code for performance issues:
- Check for unnecessary re-renders
- Identify expensive calculations
- Look for missing memoization
```

**Pseudocode:**
```markdown
Create API endpoint following this pattern:

1. Validate input with Zod schema
2. Check authentication/authorization
3. Execute business logic
4. Return standardized response
```

**Specific Scripts:**
```bash
#!/bin/bash
# scripts/deploy.sh
# Exact deployment sequence

set -e
npm run build
npm run test
aws s3 sync ./dist s3://bucket-name
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

### 3. Progressive Disclosure

**Principle:** Load information only when needed to preserve context window space.

**Levels:**

1. **Metadata (Always Available)**: ~100 words
   - Skill name and description
   - Always loaded in skill list
   - Critical for skill discovery

2. **SKILL.md Body (When Triggered)**: <5,000 words
   - Loaded when skill is activated
   - Main instructions and guidance
   - Should be comprehensive but concise

3. **Resources (As Needed)**: Variable size
   - Loaded only when explicitly referenced
   - References, scripts, assets
   - Can be larger as they're loaded on-demand

**Example Structure:**
```
my-skill/
├── SKILL.md (3,500 words - loaded when skill triggers)
├── scripts/
│   └── deploy.sh (500 lines - loaded when referenced)
└── references/
    ├── api-docs.md (10,000 words - loaded when needed)
    └── examples.md (5,000 words - loaded when needed)
```

---

## SKILL.md Format

### Frontmatter Requirements

**Required Fields:**
```yaml
---
name: skill-name
description: What this skill does and when to use it
---
```

**Field Details:**

**`name`**
- Skill identifier
- kebab-case format
- Short and descriptive
- Used in commands and references

**`description`**
- **Critical triggering mechanism**
- Describes what the skill does AND when to use it
- Claude uses this to decide when to invoke the skill
- Should be clear and specific

**Examples:**

```yaml
# ✅ Good
---
name: react-review
description: Review React components for performance, accessibility, and best practices. Use when reviewing .jsx/.tsx files.
---

# ✅ Good
---
name: api-generator
description: Generate REST API endpoints with TypeScript, validation, and tests. Use when creating new API routes.
---

# ❌ Too Vague
---
name: helper
description: Helps with code
---

# ❌ Missing When Clause
---
name: test-writer
description: Writes unit tests
---
```

**Important:** No other fields should appear in frontmatter.

### Body Content

**Structure:**
```markdown
---
name: skill-name
description: When and what
---

# Skill Title

Brief overview of what this skill does.

## When to Use

Clear criteria for when this skill should be invoked.

## Instructions

Step-by-step guidance or rules.

## Examples

Concrete examples of application.

## References

Links to scripts, references, or assets if needed.
```

**Best Practices:**

1. **Keep under 500 lines**
   - Longer skills are harder to maintain
   - Split complex skills into multiple focused skills

2. **Use imperative/infinitive form**
   ```markdown
   ✅ Check for type errors
   ✅ Validate user input
   ❌ You should check for type errors
   ❌ The code validates user input
   ```

3. **Include table of contents for 100+ line files**
   ```markdown
   ## Table of Contents

   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Usage](#usage)
   - [Examples](#examples)
   ```

4. **Organize references one level deep**
   ```
   ✅ Good:
   my-skill/
   ├── SKILL.md
   └── references/
       ├── api.md
       └── examples.md

   ❌ Too Deep:
   my-skill/
   ├── SKILL.md
   └── references/
       └── docs/
           └── api/
               └── endpoints.md
   ```

5. **Avoid extraneous files**
   ```markdown
   ❌ Don't include:
   - README.md (use SKILL.md)
   - CHANGELOG.md (track in git)
   - LICENSE (use package metadata)
   - .gitignore (not needed in packaged skill)
   ```

---

## Skill Creation Workflow

### Step 1: Understand Concrete Usage Examples

Before writing anything, gather real examples:

**Questions to answer:**
- What specific tasks will this skill handle?
- What are the input variations?
- What should the output look like?
- What edge cases exist?

**Example:**
```markdown
Task: Create API endpoint skill

Usage examples:
1. Create GET endpoint for fetching users
2. Create POST endpoint with validation
3. Create endpoint with authentication
4. Create endpoint with file upload

Edge cases:
- Missing authentication
- Invalid input schemas
- Error handling
- Rate limiting
```

### Step 2: Plan Reusable Contents

Decide what belongs in each directory:

**SKILL.md:**
- Core instructions
- Decision-making guidelines
- Process workflows

**scripts/:**
- Deployment automation
- File generation utilities
- Data transformation

**references/:**
- API documentation
- Configuration examples
- Best practices guides

**assets/:**
- Code templates
- Config file templates
- Example files

### Step 3: Initialize Skill Structure

Use `init_skill.py` or create manually:

```bash
my-skill/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

**Initial SKILL.md:**
```markdown
---
name: my-skill
description: [What it does] when [criteria for use]
---

# [Skill Title]

[Overview paragraph]

## When to Use

[Clear triggering criteria]

## Instructions

[Step-by-step guidance]
```

### Step 4: Edit Resources and SKILL.md

**Iterate on content:**

1. Write first draft of SKILL.md
2. Create necessary scripts
3. Add reference documentation
4. Include template assets
5. Test with real examples
6. Refine based on results

**Tips:**
- Start with minimal viable skill
- Add complexity as needed
- Get feedback from actual use
- Iterate based on what Claude struggles with

### Step 5: Package the Skill

Use `package_skill.py` or package manager:

```bash
# Using npx skills (if applicable)
npx skills add ./my-skill

# Or manual packaging for distribution
tar -czf my-skill.tar.gz my-skill/
```

**Verify package contents:**
```bash
# Check file sizes
du -sh my-skill/*

# Verify SKILL.md under 500 lines
wc -l my-skill/SKILL.md

# Test loading
# (depends on your skill platform)
```

### Step 6: Iterate Based on Real Usage

**Monitor:**
- When skill is invoked correctly
- When skill is missed (should have triggered but didn't)
- When skill produces wrong output
- User feedback and corrections

**Common iterations:**
1. Refine description for better triggering
2. Add missing edge cases to instructions
3. Create scripts for repetitive tasks
4. Move large sections to references
5. Add examples for clarity

---

## Best Practices Summary

### DO

✅ Keep SKILL.md under 500 lines
✅ Write clear, specific descriptions for triggering
✅ Use imperative/infinitive form
✅ Include only domain-specific knowledge
✅ Match specificity to task fragility
✅ Organize references one level deep
✅ Provide concrete examples
✅ Test with real usage before finalizing
✅ Add table of contents for 100+ line files
✅ Use progressive disclosure (metadata → SKILL.md → resources)

### DON'T

❌ Include general knowledge Claude already has
❌ Add extraneous files (README, CHANGELOG, LICENSE)
❌ Exceed 500 lines in SKILL.md
❌ Use passive voice or narrative form
❌ Create deep directory structures
❌ Add fields beyond name/description to frontmatter
❌ Write vague descriptions
❌ Omit "when to use" criteria
❌ Include unnecessary explanations
❌ Forget to test with real examples

---

## Example: Complete Skill Structure

### Minimal Skill (Text Instructions Only)

```
code-review/
└── SKILL.md
```

**SKILL.md:**
```markdown
---
name: code-review
description: Review code for bugs, performance, and best practices. Use when user asks to review code files.
---

# Code Review

Review code systematically for:

## Security
- SQL injection vulnerabilities
- XSS attack vectors
- Authentication bypass risks
- Sensitive data exposure

## Performance
- N+1 queries
- Missing indexes
- Inefficient algorithms
- Memory leaks

## Best Practices
- Code organization
- Error handling
- Type safety
- Documentation

Provide specific line numbers and actionable fixes.
```

### Medium Complexity Skill (with References)

```
api-generator/
├── SKILL.md
├── references/
│   ├── rest-patterns.md
│   └── validation-schemas.md
└── assets/
    └── endpoint-template.ts
```

**SKILL.md:**
```markdown
---
name: api-generator
description: Generate REST API endpoints with validation and tests. Use when creating new API routes.
---

# API Generator

Generate type-safe API endpoints following best practices.

## Endpoint Structure

1. Input validation (Zod schema)
2. Authentication check
3. Business logic
4. Error handling
5. Response formatting

See references/rest-patterns.md for detailed patterns.

## Template

Use assets/endpoint-template.ts as starting point.

## Validation

Follow references/validation-schemas.md for common schemas.
```

### Complex Skill (Full Structure)

```
deployment/
├── SKILL.md
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   └── deploy.sh
├── references/
│   ├── aws-setup.md
│   ├── rollback-procedures.md
│   └── monitoring.md
└── assets/
    ├── nginx.conf.template
    └── docker-compose.yml.template
```

**SKILL.md:**
```markdown
---
name: deployment
description: Deploy applications to production with validation and rollback. Use when deploying to production environments.
---

# Deployment Workflow

## Pre-Deployment

1. Run scripts/build.sh
2. Run scripts/test.sh
3. Verify environment variables

## Deployment

Execute scripts/deploy.sh which:
- Builds production bundle
- Runs tests
- Deploys to AWS
- Invalidates CDN cache

## Monitoring

Follow references/monitoring.md for post-deploy checks.

## Rollback

If issues detected, see references/rollback-procedures.md.
```

---

## Common Patterns

### Pattern 1: Review/Audit Skill

```markdown
---
name: accessibility-audit
description: Audit web pages for WCAG compliance. Use when checking accessibility.
---

# Accessibility Audit

Check for:

## Level A (Critical)
- Alt text on images
- Keyboard navigation
- Form labels

## Level AA (Important)
- Color contrast ratios
- Focus indicators
- ARIA labels

## Level AAA (Enhanced)
- Extended contrast
- Detailed descriptions

Output findings with file:line format.
```

### Pattern 2: Generator Skill

```markdown
---
name: component-generator
description: Generate React components with TypeScript and tests. Use when creating new React components.
---

# Component Generator

Create component with:

1. TypeScript interface for props
2. Component implementation
3. Storybook story
4. Unit tests
5. Documentation

Use assets/component-template.tsx as base.
```

### Pattern 3: Workflow Skill

```markdown
---
name: pr-review
description: Review pull requests for code quality, tests, and documentation. Use when reviewing PRs.
---

# Pull Request Review

## Checklist

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes without migration
- [ ] Performance impact assessed

## Review Process

1. Check diff for red flags
2. Run tests locally
3. Review test coverage
4. Check for security issues
5. Verify documentation

Provide actionable feedback with line numbers.
```

---

## Troubleshooting

### Skill Not Triggering

**Problem:** Skill available but not invoked when expected

**Solutions:**
1. Improve description with clearer "when to use" criteria
2. Add more specific keywords to description
3. Test description against actual user queries
4. Check if skill overlaps with another (Claude picks one)

### Skill Too Large

**Problem:** SKILL.md exceeds 500 lines

**Solutions:**
1. Move detailed docs to references/
2. Move code to scripts/
3. Remove general knowledge
4. Split into multiple focused skills
5. Use more concise language

### Skill Too Vague

**Problem:** Claude produces inconsistent results

**Solutions:**
1. Add more specific instructions
2. Include concrete examples
3. Move from text to pseudocode
4. Create scripts for critical steps
5. Add decision trees for complex logic

### Resource Not Loading

**Problem:** References or scripts not found

**Solutions:**
1. Check file paths (case-sensitive)
2. Verify directory structure
3. Ensure references are one level deep
4. Check for typos in file names
5. Verify skill packaging included all files

---

## Resources

- **Skill Source:** [skills.sh/anthropics/skills/skill-creator](https://skills.sh/anthropics/skills/skill-creator)
- **Anthropic Skills:** [github.com/anthropics/skills](https://github.com/anthropics/skills)
- **Skills Documentation:** [docs.anthropic.com/claude/skills](https://docs.anthropic.com/claude/skills)
- **Skills Marketplace:** [skills.sh](https://skills.sh)

---

**Last Updated:** January 2026
**Provider:** Anthropic
**Category:** Skill Development
