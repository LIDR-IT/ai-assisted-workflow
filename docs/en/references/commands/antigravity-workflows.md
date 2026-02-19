# Workflows in Antigravity

## Overview

**Workflows** in Antigravity are saved prompts that you can trigger on demand with `/` as you interact with the agent. They function as reusable, user-triggered commands for specific tasks.

**Official Documentation:** [antigravity.google/docs/rules-workflows](https://antigravity.google/docs/rules-workflows)

**Key Concept:** Workflows are more like **saved prompts** that you can choose on demand, similar to commands in other platforms.

---

## What Are Workflows?

### Definition

Workflows are:

- **Saved prompts** - Reusable task definitions
- **User-triggered** - Activated with `/` command
- **On-demand execution** - Run only when explicitly invoked
- **Markdown files** - Simple, readable format

### Key Concept

Unlike Rules (which are always active), Workflows require **specific user commands** to execute. They're similar to Cursor's Commands or Claude Code's slash commands.

---

## Storage Locations

### Global Workflows

**Location:** `~/.gemini/antigravity/global_workflows/`

**Purpose:**

- Cross-project utilities
- Personal productivity shortcuts
- Universal tasks
- Reusable across all workspaces

**Example:**

```
~/.gemini/antigravity/global_workflows/
├── format-json.md
├── generate-uuid.md
├── code-review.md
└── performance-audit.md
```

### Workspace Workflows

**Location:** `<workspace-root>/.agents/workflows/`

**Purpose:**

- Project-specific tasks
- Team-shared workflows
- Framework-specific operations
- Codebase-specific utilities

**Example structure:**

```
.agents/workflows/
├── generate-tests.md
├── create-pr.md
├── setup-feature.md
├── deploy.md
└── run-migrations.md
```

**In This Project:**

```
.agents/workflows/       # Project-specific workflows
```

---

## How to Create Workflows

### Method 1: Via UI

1. Click `...` menu (top right corner)
2. Select "Customizations"
3. Choose "Workflows"
4. Create new workflow or edit existing

### Method 2: Via File System

**Global workflow:**

```bash
# Create global workflows directory if needed
mkdir -p ~/.gemini/antigravity/global_workflows

# Create workflow file
cat > ~/.gemini/antigravity/global_workflows/format-json.md << 'EOF'
# Format JSON

Take the provided JSON and format it with proper indentation and structure.

- Use 2-space indentation
- Sort keys alphabetically
- Remove trailing commas
- Validate JSON syntax
EOF
```

**Workspace workflow:**

```bash
# Create workflows directory
mkdir -p .agents/workflows

# Create workflow file
cat > .agents/workflows/generate-tests.md << 'EOF'
# Generate Unit Tests

* Generate unit tests for each file and each method
* Make sure the unit tests are named similar to files but with test_ prefix
* Include edge cases and error conditions
* Follow project testing standards
* Achieve minimum 80% coverage
EOF
```

---

## Workflow Format

### Markdown Structure

Workflows are written in **plain Markdown** with task directives:

**Structure:**

```markdown
# [Workflow Name]

[Brief description of what this workflow does]

## Steps/Requirements

- Step 1 or requirement 1
- Step 2 or requirement 2
- Step 3 or requirement 3

## Output Format (optional)

- Expected output description
```

**No YAML frontmatter required** - unlike Skills, Workflows use pure Markdown.

---

## Usage

### Invoking Workflows

**Syntax:**

```
/[workflow-name]
```

**Examples:**

```
/generate-tests
/create-pr
/format-json
/deploy
```

**With context:**

```
/generate-tests for the user authentication module
/create-pr addressing issue #123
/deploy to staging environment
```

### Workflow Discovery

**View available workflows:**

- Type `/` in chat
- Antigravity displays available workflows
- Both global and workspace workflows appear

---

## Examples

### Unit Test Generation

**File:** `.agents/workflows/generate-tests.md`

```markdown
# Generate Unit Tests

Generate comprehensive unit tests for the selected code.

## Requirements

- Generate unit tests for each file and each method
- Make sure the unit tests are named similar to files but with test\_ prefix
- Include test cases for:
  - Normal operation
  - Edge cases
  - Error conditions
  - Boundary values
- Follow project testing standards from .agents/rules/testing-standards.md
- Achieve minimum 80% code coverage
- Use appropriate mocking for external dependencies

## Test Structure

- Arrange-Act-Assert pattern
- Descriptive test names (should*[expected]\_when*[condition])
- One assertion per test when possible
- Clear setup and teardown

## Output

- Create test file in appropriate location
- Run tests to verify they pass
- Report coverage percentage
```

### Create Pull Request

**File:** `.agents/workflows/create-pr.md`

```markdown
# Create Pull Request

Prepare and create a pull request for current changes.

## Pre-Flight Checks

- All tests pass
- Code follows style guidelines
- Documentation updated
- No console.log or debug code
- Commit messages follow conventions

## PR Description

Include:

- Summary of changes
- Related issues (Fixes #123)
- Testing performed
- Screenshots (if UI changes)
- Breaking changes (if any)
- Migration steps (if needed)

## Steps

1. Review uncommitted changes
2. Ensure all changes are committed
3. Push branch to remote
4. Create pull request with description
5. Add appropriate labels
6. Request reviewers
7. Link to project board
```

### Security Audit

**File:** `.agents/workflows/security-audit.md`

```markdown
# Security Audit

Perform comprehensive security review of the codebase.

## Areas to Review

### Authentication & Authorization

- Check authentication mechanisms
- Verify authorization logic
- Review session management
- Validate token handling

### Input Validation

- Verify all user inputs are validated
- Check for SQL injection vulnerabilities
- Review XSS prevention
- Validate file upload handling

### Data Protection

- Review encryption usage
- Check sensitive data storage
- Verify secure data transmission
- Review logging (no sensitive data logged)

### Dependencies

- Check for known vulnerabilities
- Review third-party libraries
- Verify security patches applied
- Check outdated dependencies

## Output Format

For each issue found:

- Severity: Critical/High/Medium/Low
- Location: file:line
- Description: what the issue is
- Impact: what could happen
- Recommendation: how to fix
```

### Feature Setup

**File:** `.agents/workflows/setup-feature.md`

```markdown
# Setup New Feature

Complete workflow for setting up a new feature branch and structure.

## 1. Branch Setup

- Create feature branch from develop
- Format: feature/[feature-name]
- Push and set upstream tracking

## 2. Directory Structure

Create necessary directories:

- src/features/[feature-name]/
- src/features/[feature-name]/components/
- src/features/[feature-name]/**tests**/
- src/features/[feature-name]/hooks/
- src/features/[feature-name]/utils/

## 3. Boilerplate Files

Create:

- index.ts (barrel export)
- README.md (feature documentation)
- [Feature].tsx (main component)
- [Feature].test.tsx (test file)
- types.ts (TypeScript types)

## 4. Update Project Files

- Add feature to routing
- Update main exports
- Add to documentation
- Update changelog (Unreleased section)

## 5. Initial Commit

- Commit structure with message: "feat: setup [feature-name] structure"
- Push to remote
```

### Code Review

**File:** `.agents/workflows/code-review.md`

```markdown
# Code Review

Perform thorough code review of changes.

## Code Quality

- Naming conventions followed
- Functions are focused (single responsibility)
- No code duplication
- Proper error handling
- Edge cases handled

## Best Practices

- Follows project style guide
- Uses appropriate design patterns
- Efficient algorithms
- No premature optimization
- SOLID principles applied

## Testing

- Adequate test coverage
- Tests are meaningful
- Edge cases tested
- Integration tests where needed
- Tests actually pass

## Security

- Input validation present
- No SQL injection risks
- XSS prevention implemented
- Authentication/authorization correct
- Sensitive data protected

## Documentation

- Public APIs documented
- Complex logic explained
- README updated if needed
- Changelog updated
- Breaking changes noted

## Output Format

For each file reviewed:

- ✅ What's good
- ⚠️ Concerns or suggestions
- ❌ Issues that must be fixed
- 📝 Optional improvements
```

### Deployment Workflow

**File:** `.agents/workflows/deploy.md`

```markdown
# Deploy Application

Execute deployment workflow with safety checks.

## Pre-Deployment Checks

- All tests passing on CI
- No failing checks on GitHub
- Version number updated
- Changelog updated
- Documentation current
- Staging deployment successful

## Deployment Steps

### 1. Prepare Release

- Create release branch
- Update version in package.json
- Tag release with semantic version
- Generate release notes

### 2. Build

- Run production build
- Verify build artifacts
- Check bundle sizes
- Test production build locally

### 3. Deploy

- Deploy to production environment
- Run smoke tests
- Monitor error logs
- Check performance metrics

### 4. Post-Deployment

- Verify deployment successful
- Monitor for errors (15 minutes)
- Notify team in Slack
- Update deployment log

### 5. Rollback Plan

If issues detected:

- Revert to previous version
- Investigate issue
- Create hotfix if needed
```

### Database Migration

**File:** `.agents/workflows/run-migrations.md`

```markdown
# Run Database Migrations

Execute database migrations safely.

## Pre-Migration Checks

- Backup database created
- Migration scripts reviewed
- Rollback plan documented
- Staging migration successful
- Team notified

## Migration Steps

### 1. Preparation

- Review migration SQL
- Check for breaking changes
- Verify rollback script exists
- Estimate migration time

### 2. Execution

- Put application in maintenance mode (if needed)
- Run migrations
- Verify migration success
- Check data integrity

### 3. Verification

- Test affected features
- Check database indexes
- Verify foreign key constraints
- Review query performance

### 4. Completion

- Remove maintenance mode
- Monitor application logs
- Notify team of completion
- Document migration in changelog

## Rollback Procedure

If migration fails:

1. Stop application
2. Run rollback script
3. Restore from backup if needed
4. Investigate issue
5. Fix and retry
```

---

## Best Practices

### Writing Effective Workflows

✅ **DO:**

- **Be specific** - Clear, actionable steps
- **Use structure** - Headers, bullets, numbered lists
- **Include verification** - How to check success
- **Document output** - What to expect
- **Consider errors** - What could go wrong
- **Provide context** - Why this workflow exists

❌ **DON'T:**

- Write vague instructions
- Assume context
- Skip error handling
- Forget edge cases
- Make workflows too complex
- Duplicate rules content

### Workflow Organization

**Flat Structure (5-15 workflows):**

```
.agents/workflows/
├── generate-tests.md
├── code-review.md
├── create-pr.md
├── deploy.md
└── security-audit.md
```

**Categorized Structure (15+ workflows):**

```
.agents/workflows/
├── development/
│   ├── setup-feature.md
│   ├── generate-tests.md
│   └── code-review.md
├── deployment/
│   ├── deploy-staging.md
│   ├── deploy-production.md
│   └── rollback.md
└── database/
    ├── run-migrations.md
    ├── backup.md
    └── restore.md
```

### Naming Conventions

**Verb-Noun Pattern:**

```
generate-tests.md
create-pr.md
deploy-app.md
run-migrations.md
review-security.md
```

**Clear and Descriptive:**

```
✅ generate-unit-tests.md
✅ create-pull-request.md
✅ deploy-to-production.md

❌ tests.md
❌ pr.md
❌ deploy.md
```

---

## Workflows vs Other Features

### Workflows vs Rules

| Feature        | Workflows                   | Rules               |
| :------------- | :-------------------------- | :------------------ |
| **Activation** | User-triggered (`/command`) | Always active       |
| **Scope**      | On-demand tasks             | Continuous guidance |
| **Purpose**    | Execute specific tasks      | Guide behavior      |
| **Location**   | `.agents/workflows/`        | `.agents/rules/`    |
| **Example**    | `/generate-tests`           | "Use PEP 8"         |
| **Type**       | Executable prompts          | System instructions |

**Use Workflows for:**

- Generate unit tests
- Create pull requests
- Run deployments
- Perform audits
- Setup features

**Use Rules for:**

- Code style standards
- Testing requirements
- Documentation standards
- Security guidelines

### Workflows vs Skills

| Feature        | Workflows            | Skills                         |
| :------------- | :------------------- | :----------------------------- |
| **Activation** | Explicit `/command`  | Agent-triggered (intent)       |
| **Discovery**  | User knows command   | Agent matches description      |
| **Complexity** | Instructions only    | Can include scripts, templates |
| **Visibility** | Always known to user | Progressive disclosure         |
| **Format**     | Markdown only        | SKILL.md + scripts + resources |

**Use Workflows for:**

- Known, repeatable tasks
- User-controlled execution
- Simple instruction-based tasks

**Use Skills for:**

- Complex workflows with automation
- Agent-determined relevance
- Heavy procedural knowledge

### Workflows vs Commands (Other Platforms)

Antigravity Workflows are equivalent to:

- **Cursor Commands** (`.cursor/commands/`)
- **Claude Code Commands** (`.claude/commands/`)

All serve the same purpose: reusable, user-triggered prompts.

---

## Common Patterns

### 1. Generation Pattern

**Purpose:** Create boilerplate or documentation

```markdown
# Generate [Artifact]

Generate [artifact type] following project standards.

## Requirements

- Requirement 1
- Requirement 2

## Structure

- Expected structure details

## Verification

- How to verify output
```

### 2. Review Pattern

**Purpose:** Systematic code/security analysis

```markdown
# Review [Aspect]

Perform thorough review of [aspect].

## Areas to Check

- Area 1
- Area 2

## Output Format

- Issue severity
- Location
- Description
- Recommendation
```

### 3. Deployment Pattern

**Purpose:** Safe deployment procedures

```markdown
# Deploy to [Environment]

Execute deployment with safety checks.

## Pre-Deployment

- Check 1
- Check 2

## Deployment Steps

1. Step 1
2. Step 2

## Post-Deployment

- Verification 1
- Verification 2

## Rollback

- Rollback procedure
```

### 4. Setup Pattern

**Purpose:** Initialize features/components

```markdown
# Setup [Feature]

Initialize new [feature] with structure.

## Directory Structure

- Create directories

## Boilerplate Files

- Create files

## Configuration

- Update configs

## Initial Commit

- Commit message
```

---

## Integration with Development Workflow

### Example: Complete Development Workflow

```bash
# 1. Start new feature
/setup-feature user-dashboard

# 2. Develop feature
# ... write code ...

# 3. Generate tests
/generate-tests

# 4. Review security
/security-audit

# 5. Code review
/code-review

# 6. Create PR
/create-pr

# 7. After approval, deploy
/deploy-to-staging

# 8. If successful
/deploy-to-production
```

---

## Troubleshooting

### Workflow Not Found

**Symptoms:**

- `/workflow-name` doesn't trigger
- Workflow doesn't appear in autocomplete

**Solutions:**

```bash
# Verify file location
ls -la .agents/workflows/

# Check file name matches command
# /generate-tests needs generate-tests.md

# Restart Antigravity
```

### Workflow Executes Incorrectly

**Symptoms:**

- Agent doesn't follow workflow instructions
- Missing steps or unexpected behavior

**Solutions:**

- Review workflow clarity
- Make instructions more specific
- Add examples
- Break complex steps into sub-steps
- Test with simple cases first

### Workflows Too Complex

**Symptoms:**

- Agent gets confused
- Partial execution
- Errors midway

**Solutions:**

- Split into multiple smaller workflows
- Use Rules for continuous guidance
- Consider creating a Skill instead (for complex scripts)
- Simplify instructions

---

## Version Control

### Committing Workflows

✅ **DO commit project workflows to git:**

```bash
# Project workflows should be shared
git add .agents/workflows/
git commit -m "feat: add deployment workflow"
```

❌ **DON'T commit global workflows:**

```bash
# Global workflows are personal
# ~/.gemini/antigravity/global_workflows/ stays local
```

### Sharing Workflows with Team

**Best practices:**

1. Document workflows in `.agents/workflows/`
2. Commit to repository
3. Include usage in README
4. Train team on available workflows
5. Update based on team feedback

**Example:**

```bash
# Create team workflow
cat > .agents/workflows/onboard-developer.md << 'EOF'
# Developer Onboarding

Complete setup for new team member.

## Environment Setup
- Install Node.js, Python, Docker
- Clone repository
- Install dependencies
- Configure environment variables

## Access Setup
- Add to GitHub organization
- Grant database access
- Provide API keys
- Add to communication channels

## Verification
- Can run tests locally
- Can build project
- Can access staging environment
- Has completed first ticket
EOF

# Commit
git add .agents/workflows/onboard-developer.md
git commit -m "docs: add developer onboarding workflow"
git push
```

---

## Advanced Usage

### Parameterized Workflows

While workflows don't have formal parameters, you can write them to expect context:

```markdown
# Deploy to Environment

Deploy application to specified environment.

## Instructions

The user will specify the target environment (staging, production, etc.)

## Steps

1. Verify environment is valid
2. Run environment-specific pre-checks
3. Execute deployment to specified environment
4. Run environment-specific post-checks
```

**Usage:**

```
/deploy-to-environment staging
/deploy-to-environment production
```

### Chained Workflows

Reference other workflows within a workflow:

```markdown
# Complete Feature Release

Execute full feature release process.

## Steps

1. Run /generate-tests to ensure test coverage
2. Run /code-review to verify code quality
3. Run /security-audit to check for vulnerabilities
4. Run /create-pr to initiate review process
5. After approval, run /deploy-to-staging
6. If staging successful, run /deploy-to-production
```

---

## Resources

### Official Documentation

- [Rules & Workflows](https://antigravity.google/docs/rules-workflows)
- [Getting Started with Antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Customize Antigravity with Workflows](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)

### In This Repository

- `docs/notes/antigravity-agent-modes-settings.md` - Agent modes and configuration
- `docs/references/rules/antigravity-rules.md` - Rules documentation
- `docs/references/commands/cursor-commands.md` - Cursor commands (similar concept)
- `docs/references/commands/command-development.md` - Claude Code commands
- `.agents/workflows/` - Project workflows directory

---

**Last Updated:** January 2026
**Category:** Antigravity Workflows
**Status:** Core Feature
**Platform:** Google Antigravity

## Sources

- [Customize Google Antigravity with rules and workflows - Mete Atamel](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)
- [Getting Started with Google Antigravity | Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Google Antigravity](https://antigravity.google/docs/rules-workflows)
