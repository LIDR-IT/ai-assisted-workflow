# Rules in Antigravity

## Overview

**Rules** in Antigravity are guidelines that shape how the agent behaves throughout development. They guide the agent's behavior as it generates code, tests, and performs other development tasks.

**Official Documentation:** [antigravity.google/docs/rules-workflows](https://antigravity.google/docs/rules-workflows)

**Key Concept:** Rules are more like **system instructions** that are always active, continuously guiding agent behavior.

---

## What Are Rules?

### Definition

Rules are:

- **Continuous guidance** - Always active throughout agent operation
- **System-level directives** - Shape fundamental agent behavior
- **Persistent guidelines** - Applied to all agent actions
- **Markdown files** - Simple, readable format

### Key Concept

Rules function as **passive, always-on guardrails** that ensure the agent follows specific standards, conventions, and best practices without requiring user intervention.

---

## Storage Locations

### Global Rules

**Location:** `~/.gemini/GEMINI.md`

**Purpose:**

- Cross-project standards
- Personal coding preferences
- Universal guidelines
- Consistent behavior across all work

**Example:**

```markdown
# Global Development Rules

## Code Style

- Use 2-space indentation for all languages
- Prefer const over let in JavaScript/TypeScript
- Always use explicit return types in TypeScript
- Follow language-specific conventions (PEP 8, PSR, etc.)

## Documentation

- Add JSDoc/docstrings for all public functions
- Include usage examples in documentation
- Keep comments concise and relevant

## Testing

- Write unit tests for all new functions
- Maintain minimum 80% code coverage
- Use descriptive test names
```

### Workspace Rules

**Location:** `<workspace-root>/.agents/rules/`

**Purpose:**

- Project-specific standards
- Team conventions
- Framework-specific guidelines
- Codebase-specific requirements

**Example structure:**

```
.agents/rules/
├── code-style.md
├── testing-standards.md
├── documentation.md
├── security.md
└── git-conventions.md
```

**In This Project:**

```
.agents/rules/           # Project-specific rules
```

---

## How to Create Rules

### Method 1: Via UI

1. Click `...` menu (top right corner)
2. Select "Customizations"
3. Choose "Rules"
4. Create new rule or edit existing

### Method 2: Via File System

**Global rule:**

```bash
# Edit global rules
vi ~/.gemini/GEMINI.md
```

**Workspace rules:**

```bash
# Create project rules directory
mkdir -p .agents/rules

# Create specific rule file
cat > .agents/rules/code-style.md << 'EOF'
# Code Style Guidelines

## Python
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Maximum line length: 88 characters (Black formatter)

## TypeScript
- Use strict mode
- Explicit return types required
- No implicit any
EOF
```

---

## Rule Format

### Markdown Structure

Rules are written in **plain Markdown** with directives:

**Structure:**

```markdown
# [Rule Category]

## [Subcategory]

- Directive 1
- Directive 2
- Directive 3

## [Another Subcategory]

- Directive 4
- Directive 5
```

**No YAML frontmatter required** - unlike Skills, Rules use pure Markdown.

---

## Examples

### Code Style Rule

**File:** `.agents/rules/code-style.md`

```markdown
# Code Style Guidelines

## General Principles

- Write self-documenting code with clear variable names
- Keep functions small and focused (max 50 lines)
- Avoid deep nesting (max 3 levels)
- Use early returns to reduce complexity

## Python

- Make sure all code follows PEP 8 style guide
- Make sure all code is properly commented
- Use type hints for function parameters and return values
- Prefer f-strings over .format() or % formatting
- Use descriptive variable names (no single letters except iterators)

## JavaScript/TypeScript

- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer const over let, never use var
- Use async/await over Promise chains
- Explicit return types for all functions
- Use strict null checks

## CSS

- Use BEM naming convention
- Mobile-first approach
- Avoid !important
- Use CSS custom properties for theming
```

### Testing Standards Rule

**File:** `.agents/rules/testing-standards.md`

```markdown
# Testing Standards

## Unit Testing

- Write tests for all new functions
- Use descriptive test names following pattern: should*[expected behavior]\_when*[condition]
- Arrange-Act-Assert pattern for test structure
- One assertion per test when possible
- Mock external dependencies

## Test Coverage

- Minimum 80% code coverage required
- 100% coverage for critical business logic
- Test edge cases and error conditions
- Include regression tests for fixed bugs

## Test Organization

- Generate unit tests for each file and each method
- Make sure unit tests are named similar to files but with test\_ prefix
- Keep test files next to source files
- Use test fixtures for shared setup

## Test Documentation

- Document complex test scenarios
- Include examples of expected input/output
- Explain why specific mocks are used
```

### Documentation Rule

**File:** `.agents/rules/documentation.md`

```markdown
# Documentation Standards

## Code Documentation

- Add JSDoc/docstrings for all public functions
- Include parameter descriptions
- Document return values
- Provide usage examples
- Note any side effects

## README Files

- Include project purpose and overview
- Setup instructions with prerequisites
- Usage examples
- API documentation
- Contributing guidelines
- License information

## Inline Comments

- Explain WHY, not WHAT
- Document non-obvious decisions
- Flag temporary solutions with TODO
- Keep comments up-to-date with code changes

## API Documentation

- Document all endpoints
- Include request/response examples
- Note authentication requirements
- List possible error codes
- Version API documentation
```

### Security Rule

**File:** `.agents/rules/security.md`

```markdown
# Security Guidelines

## Input Validation

- Validate all user input
- Sanitize data before database queries
- Use parameterized queries (never string concatenation)
- Validate file uploads (type, size, content)

## Authentication & Authorization

- Never store passwords in plain text
- Use bcrypt or similar for password hashing
- Implement rate limiting on auth endpoints
- Verify user permissions before sensitive operations
- Use secure session management

## Data Protection

- Never commit secrets to version control
- Use environment variables for sensitive config
- Encrypt sensitive data at rest
- Use HTTPS for all API calls
- Implement proper CORS policies

## Dependencies

- Keep dependencies up-to-date
- Review security advisories regularly
- Use lock files (package-lock.json, Pipfile.lock)
- Avoid packages with known vulnerabilities
```

### Git Conventions Rule

**File:** `.agents/rules/git-conventions.md`

```markdown
# Git Conventions

## Commit Messages

- Use Conventional Commits format
- Format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore
- Keep subject line under 50 characters
- Use imperative mood ("add feature" not "added feature")
- Include ticket number if applicable

## Branching

- main/master: production-ready code
- develop: integration branch
- feature/[name]: new features
- fix/[name]: bug fixes
- hotfix/[name]: urgent production fixes

## Pull Requests

- One feature/fix per PR
- Write descriptive PR titles and descriptions
- Include test results
- Request at least one review
- Update documentation
- Squash commits before merging
```

---

## Best Practices

### Writing Effective Rules

✅ **DO:**

- **Be specific** - Concrete directives are better than vague guidance
- **Use bullet points** - Clear, scannable format
- **Organize by category** - Group related guidelines
- **Explain WHY** - Help agent understand reasoning
- **Provide examples** - Show expected format/output
- **Keep updated** - Review and refine regularly

❌ **DON'T:**

- Write overly generic rules ("write good code")
- Create conflicting rules
- Make rules too restrictive (prevent innovation)
- Forget to update rules when practices change
- Duplicate content across multiple rule files

### Rule Organization

**Flat Structure (5-10 rules):**

```
.agents/rules/
├── code-style.md
├── testing.md
├── documentation.md
├── security.md
└── git-conventions.md
```

**Categorized Structure (10+ rules):**

```
.agents/rules/
├── code/
│   ├── python-style.md
│   ├── typescript-style.md
│   └── react-conventions.md
├── testing/
│   ├── unit-tests.md
│   ├── integration-tests.md
│   └── e2e-tests.md
└── process/
    ├── git-workflow.md
    ├── code-review.md
    └── deployment.md
```

### Rule Granularity

**Good granularity:**

```markdown
# Python Type Hints

- Use type hints for all function parameters
- Include return type annotations
- Use typing module for complex types (List, Dict, Optional)
- Prefer built-in generics (list, dict) over typing module when possible (Python 3.9+)
```

**Too granular:**

```markdown
# Python Type Hints for Functions

- Use type hints for function parameters

# Python Type Hints for Return Values

- Use return type annotations

# Python Type Hints for Complex Types

- Use typing module
```

**Too broad:**

```markdown
# All Python Rules

- Follow PEP 8
- Use type hints
- Write tests
- Document functions
- Handle errors
- ...
```

---

## Rules vs Other Features

### Rules vs Workflows

| Feature        | Rules               | Workflows               |
| :------------- | :------------------ | :---------------------- |
| **Activation** | Always active       | User-triggered with `/` |
| **Scope**      | Continuous guidance | On-demand tasks         |
| **Purpose**    | Behavior guidelines | Saved prompts           |
| **Location**   | `.agents/rules/`    | `.agents/workflows/`    |
| **Example**    | "Use PEP 8"         | "Generate tests"        |
| **Type**       | System instructions | Executable commands     |

**Use Rules for:**

- Code style standards
- Testing requirements
- Documentation standards
- Security guidelines
- Git conventions

**Use Workflows for:**

- Generate unit tests
- Create pull request
- Run security audit
- Setup new feature

### Rules vs Skills

| Feature        | Rules               | Skills                         |
| :------------- | :------------------ | :----------------------------- |
| **Activation** | Always active       | Agent-triggered (intent match) |
| **Visibility** | Always loaded       | Progressive disclosure         |
| **Complexity** | Simple directives   | Can include scripts, templates |
| **Scope**      | Behavior guidelines | Specialized capabilities       |
| **Format**     | Markdown only       | SKILL.md + scripts + resources |

**Use Rules for:**

- General coding standards
- Universal best practices
- Project conventions

**Use Skills for:**

- Complex workflows with scripts
- Specialized domain knowledge
- Conditional tool usage

---

## Common Patterns

### 1. Language-Specific Style

```markdown
# Language Style Guide

## Python

- PEP 8 compliance
- Type hints required
- Docstrings for all public functions
- Black formatter (88 char limit)

## TypeScript

- Strict mode enabled
- Explicit return types
- No implicit any
- ESLint + Prettier
```

### 2. Framework Conventions

```markdown
# React Conventions

## Component Structure

- Functional components with hooks
- One component per file
- Props interface at top of file
- Organize imports: external, internal, types, styles

## State Management

- Use useState for local state
- Use useReducer for complex state
- Context for shared global state
- Avoid prop drilling (max 2 levels)

## Naming

- Components: PascalCase
- Hooks: camelCase with "use" prefix
- Event handlers: "handle" prefix
- Boolean props: "is/has/should" prefix
```

### 3. Testing Philosophy

```markdown
# Testing Philosophy

## Principles

- Test behavior, not implementation
- Write tests before fixing bugs
- Keep tests simple and focused
- Test edge cases and errors
- Mock external dependencies

## Coverage Goals

- Critical paths: 100%
- Business logic: 90%
- UI components: 70%
- Utility functions: 80%
```

### 4. Code Review Standards

```markdown
# Code Review Standards

## Reviewer Checklist

- Code follows style guide
- Tests pass and cover changes
- Documentation updated
- No console.log or debugging code
- Error handling present
- Performance considered
- Security implications reviewed

## Author Checklist

- Self-review completed
- Tests written and passing
- Documentation updated
- Breaking changes noted
- Screenshots for UI changes
```

---

## Integration with Development Workflow

### Example: Full Development Rules

**File:** `.agents/rules/development-workflow.md`

```markdown
# Development Workflow

## Before Starting Work

- Pull latest from main branch
- Create feature branch from develop
- Review related issues/tickets
- Plan implementation approach

## During Development

- Follow code style guidelines
- Write tests alongside code
- Commit frequently with meaningful messages
- Keep PR scope focused

## Before Committing

- Run full test suite
- Check code coverage
- Run linter and formatter
- Self-review changes
- Update documentation

## Pull Request Process

- Write descriptive PR description
- Link related issues
- Request appropriate reviewers
- Respond to feedback promptly
- Squash commits before merge
```

---

## Troubleshooting

### Rules Not Being Applied

**Symptoms:**

- Agent ignores style guidelines
- Code doesn't follow conventions
- Standards not enforced

**Solutions:**

```bash
# Verify rule file location
ls -la .agents/rules/

# Check file is readable
cat .agents/rules/code-style.md

# Restart Antigravity
# CMD+Q (Mac) / Alt+F4 (Windows)
```

### Conflicting Rules

**Symptoms:**

- Agent receives mixed signals
- Inconsistent behavior
- Code style varies

**Solutions:**

- Review all active rules (global + workspace)
- Remove duplicates
- Ensure workspace rules override global when needed
- Be specific about priorities

### Rules Too Restrictive

**Symptoms:**

- Agent struggles with creative solutions
- Development feels constrained
- Frequent rule violations needed

**Solutions:**

- Review rules for necessity
- Make guidelines instead of hard rules
- Allow exceptions with justification
- Balance guidelines with flexibility

---

## Version Control

### Committing Rules

✅ **DO commit project rules to git:**

```bash
# Project rules should be shared
git add .agents/rules/
git commit -m "docs: add code style rules"
```

❌ **DON'T commit global rules:**

```bash
# Global rules are personal
# ~/.gemini/GEMINI.md stays local
```

### Sharing Rules with Team

**Best practices:**

1. Document rules in `.agents/rules/`
2. Commit to repository
3. Include in onboarding docs
4. Review in team meetings
5. Update based on team feedback

**Example workflow:**

```bash
# Create new rule
cat > .agents/rules/api-design.md << 'EOF'
# API Design Guidelines

## REST Endpoints
- Use nouns for resources (/users, not /getUsers)
- HTTP verbs for actions (GET, POST, PUT, DELETE)
- Plural for collections (/users)
- Singular for single resource (/user/:id)

## Response Format
- Consistent JSON structure
- Include metadata (pagination, etc.)
- Use standard HTTP status codes
- Provide meaningful error messages
EOF

# Commit
git add .agents/rules/api-design.md
git commit -m "docs: add API design guidelines"

# Push for team
git push
```

---

## Advanced Usage

### Conditional Rules

```markdown
# Environment-Specific Rules

## Development Environment

- Verbose logging enabled
- Debug mode allowed
- Mock external services
- Relaxed rate limits

## Production Environment

- Minimal logging (errors only)
- No debug code
- Real external services
- Strict rate limits
- Enhanced security checks
```

### Priority Rules

```markdown
# Rule Priority

## Critical (Must Follow)

- Security guidelines
- Data protection rules
- Legal compliance requirements

## Important (Should Follow)

- Code style conventions
- Testing standards
- Documentation requirements

## Recommended (Nice to Have)

- Performance optimizations
- Code organization preferences
- Comment style
```

---

## Resources

### Official Documentation

- [Rules & Workflows](https://antigravity.google/docs/rules-workflows)
- [Getting Started with Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Customize Antigravity with Rules](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)

### In This Repository

- `docs/notes/antigravity-agent-modes-settings.md` - Agent modes and configuration
- `docs/references/commands/antigravity-workflows.md` - Workflows documentation
- `.agents/rules/` - Project rules directory

---

**Last Updated:** January 2026
**Category:** Antigravity Rules
**Status:** Core Feature
**Platform:** Google Antigravity

## Sources

- [Customize Google Antigravity with rules and workflows - Mete Atamel](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)
- [Getting Started with Google Antigravity | Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Antigravity](https://antigravity.google/docs/rules-workflows)
