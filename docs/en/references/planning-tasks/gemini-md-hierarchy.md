# GEMINI.md Context Hierarchy

The Gemini CLI implements a three-tier hierarchical context system that provides project-specific instructions to the model, eliminating the need to repeat guidance in every prompt.

## Overview

GEMINI.md files define:

- Coding standards and conventions
- Project-specific requirements
- Personas and communication style
- Architecture patterns and best practices

The CLI automatically discovers and concatenates these files, sending them to the model with each prompt.

## Hierarchy System

### Three-Tier Loading

The CLI loads context files in this order:

```
1. Global Context      (~/.gemini/GEMINI.md)
        ↓
2. Project Context     (<project-root>/GEMINI.md)
        ↓
3. Subdirectory Context (<subdirectories>/GEMINI.md)
```

**Concatenation:** All discovered files are combined and sent to the model together.

**Footer Display:** The CLI footer shows how many context files are active.

### 1. Global Context

**Location:** `~/.gemini/GEMINI.md`

**Scope:** Applies to ALL projects

**Use for:**

- Personal coding preferences
- Universal conventions (e.g., "Always use semicolons")
- Communication style (e.g., "Be concise in explanations")
- Default personas (e.g., "Act as a senior engineer")

**Example:**

```markdown
# Global Gemini Configuration

You are an expert software engineer helping me write clean, maintainable code.

## My Coding Preferences

- I prefer TypeScript over JavaScript
- Use functional programming patterns when possible
- Follow strict ESLint rules
- Write concise comments for complex logic only

## Communication Style

- Be direct and concise
- Provide code examples
- Explain trade-offs when suggesting solutions
```

### 2. Project Context

**Location:** `<project-root>/GEMINI.md`

**Discovery:** Searches current working directory and parent directories up to project root (marked by `.git`)

**Scope:** Applies to entire project

**Use for:**

- Project-specific coding standards
- Technology stack details
- Architecture patterns
- Team conventions

**Example:**

```markdown
# Project: E-commerce Platform

## Tech Stack

- Next.js 14 (App Router)
- TypeScript with strict mode
- Tailwind CSS v4
- Prisma ORM with PostgreSQL
- Vitest for testing

## Coding Standards

### TypeScript

- Use `interface` for public APIs, `type` for internal
- Enable all strict flags
- Prefer `const` over `let`, never use `var`

### React

- Functional components only
- Use React Server Components by default
- Client components: explicit "use client" directive

### Testing

- Write unit tests for all business logic
- Use React Testing Library for components
- Aim for 80% coverage minimum

## Architecture

### Directory Structure

\`\`\`
app/ # Next.js App Router pages
components/ # Shared React components
lib/ # Utility functions and helpers
prisma/ # Database schema and migrations
\`\`\`

### API Conventions

- REST endpoints in `app/api/`
- Use Zod for request validation
- Return standardized error responses
```

### 3. Subdirectory Context

**Location:** `<subdirectory>/GEMINI.md`

**Discovery:** Scans folders below current working directory

**Scope:** Applies to specific component/module

**Respects:** `.gitignore` and `.geminiignore` rules

**Use for:**

- Component-specific patterns
- Module-level conventions
- Special requirements for subsystems

**Example:**

```markdown
# Auth Module

This directory contains authentication and authorization logic.

## Security Requirements

- Never log sensitive data (passwords, tokens)
- Always hash passwords with bcrypt (cost factor 12)
- Validate all JWT tokens server-side
- Use HTTP-only cookies for refresh tokens

## Module Patterns

### Token Service

- Access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry
- Implement token rotation on refresh

### Middleware

- Authenticate all protected routes
- Check permissions before allowing access
- Return 401 for unauthenticated, 403 for unauthorized
```

## Context Loading Example

Given this project structure:

```
my-project/
├── .git/
├── GEMINI.md                      # Project context
├── components/
│   ├── GEMINI.md                  # Components context
│   └── Button.tsx
└── app/
    ├── api/
    │   ├── GEMINI.md              # API context
    │   └── auth/
    │       └── route.ts
```

When working in `app/api/auth/`:

**Loaded context:**

1. `~/.gemini/GEMINI.md` (Global)
2. `my-project/GEMINI.md` (Project)
3. `my-project/app/api/GEMINI.md` (Subdirectory)

**Total context sent to model:** All three files concatenated

## Modular Imports with @file.md

Import external files to avoid duplication:

**Syntax:**

```markdown
@./path/to/file.md
@../shared/style-guide.md
```

**Example:**

**Main GEMINI.md:**

```markdown
# Project Configuration

## Coding Standards

@./docs/code-style.md

## Architecture

@./docs/architecture.md
```

**Referenced file (`docs/code-style.md`):**

```markdown
# Code Style Guide

- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Prefer single quotes for strings
```

**Result:** Content from `code-style.md` is inserted inline.

## Memory Commands

### Show Context

```bash
# Display all concatenated GEMINI.md content
/memory show
```

### Refresh Context

```bash
# Rescan and reload all GEMINI.md files
/memory refresh
```

### Add to Memory

```bash
# Append to global GEMINI.md
/memory add "Prefer async/await over .then()"
```

## Alternative Filenames

Customize context file names in `settings.json`:

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

**Search order:** Files are checked in array order, first match wins.

## Best Practices

### ✅ DO

**Keep contexts focused:**

- Global: Universal preferences
- Project: Project-wide standards
- Subdirectory: Module-specific rules

**Be specific:**

```markdown
# Good

Use TypeScript strict mode with all checks enabled

# Bad

Use TypeScript
```

**Update regularly:**

- Remove outdated conventions
- Add new patterns as they emerge
- Keep technology versions current

**Use imports for reusability:**

```markdown
@../shared/typescript-config.md
@./testing-standards.md
```

### ❌ DON'T

**Don't duplicate:**

- If a rule applies globally, put it in global GEMINI.md
- Don't repeat project rules in subdirectories

**Don't overload:**

- Avoid massive context files (thousands of lines)
- Split into modular imports instead

**Don't store secrets:**

- Never put API keys, passwords, or credentials
- Use environment variables instead

## Example: TypeScript Project

**Global (`~/.gemini/GEMINI.md`):**

```markdown
# Luis's Coding Preferences

- I prefer TypeScript over JavaScript
- Use ESLint and Prettier for formatting
- Write unit tests for all business logic
```

**Project (`my-app/GEMINI.md`):**

```markdown
# My App - Next.js E-commerce

## Tech Stack

- Next.js 14, TypeScript, Tailwind CSS v4
- Prisma with PostgreSQL
- Deployed on Vercel

## Standards

@./docs/typescript-standards.md
@./docs/react-patterns.md

## Testing

- Vitest for unit tests
- Playwright for E2E tests
- Minimum 80% coverage
```

**Subdirectory (`my-app/components/GEMINI.md`):**

```markdown
# UI Components

All components in this directory:

- Must be React Server Components by default
- Add "use client" only when needed
- Export as named exports (not default)
- Include Storybook stories
```

**Result when working in `components/`:**

```
Luis's preferences + App standards + Component rules = Full context
```

## Verification

To verify context is loading:

```bash
# 1. Check footer in CLI
gemini> /help
# Look for: "Context files: 3 active"

# 2. Show loaded context
/memory show

# 3. Test with question
gemini> What coding style should I use?
# Agent should reference your GEMINI.md rules
```

## Troubleshooting

### Context Not Loading

**Issue:** GEMINI.md not being read

**Solutions:**

1. Check filename: Must be exact (case-sensitive)
2. Verify location: In project root or current directory
3. Refresh context: `/memory refresh`
4. Check `.geminiignore`: Ensure not excluded

### Too Much Context

**Issue:** Context files too large, slowing down responses

**Solutions:**

1. Split into modular files with `@` imports
2. Move rarely-used content to subdirectories
3. Remove outdated sections
4. Use `.geminiignore` to exclude verbose directories

### Conflicts Between Levels

**Issue:** Global and project contexts contradict each other

**Resolution:**

- More specific context takes precedence (subdirectory > project > global)
- Edit files to align or explicitly override:
  ```markdown
  Note: This project uses tabs (overrides global preference for spaces)
  ```

## Multi-Agent Integration

This project uses GEMINI.md alongside other agent configs:

| Agent       | Context File     | Scope                       |
| ----------- | ---------------- | --------------------------- |
| Gemini CLI  | `GEMINI.md`      | Hierarchical (3-tier)       |
| Cursor      | `.cursor/rules/` | Project-level symlinks      |
| Claude Code | `.claude/rules/` | Project-level symlinks      |
| Antigravity | `.agents/rules/` | Native `.agents/` detection |

**Recommendation:** Keep GEMINI.md focused on Gemini-specific instructions. Shared rules go in `.agents/rules/` (see [Rules System](../../rules/rules-system.md)).

## Related Documentation

- [Gemini Memory System](gemini-memory.md) - Persistent fact storage
- [Custom Commands](../../commands/gemini-cli-custom-commands.md) - Extend CLI
- [Cursor Plan Mode](cursor-plan-mode.md) - Alternative planning approach
- [Rules Synchronization](../../../guides/rules/SYNC_SETUP.md) - Multi-agent rules

## References

- Official Docs: https://geminicli.com/docs/cli/gemini-md/
- Settings Reference: https://geminicli.com/docs/cli/settings/
