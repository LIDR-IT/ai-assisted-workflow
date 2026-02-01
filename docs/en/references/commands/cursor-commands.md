# Commands in Cursor

## Overview

**Commands** in Cursor are reusable workflows triggered with a `/` prefix in the chat input. They help standardize team processes and streamline common tasks by converting plain Markdown files into accessible shortcuts.

**Official Documentation:** [cursor.com/docs/context/commands](https://cursor.com/docs/context/commands)

**Status:** Beta (syntax and features may evolve)

---

## What Are Commands?

### Definition

Commands are Markdown files that provide:
- **Reusable workflows** - Standard processes accessible via `/` prefix
- **Team standardization** - Consistent approaches across organization
- **Quick access** - Common tasks triggered with simple shortcuts
- **Automatic discovery** - Available commands displayed when typing `/`

### Key Concept

When you type `/` in Cursor's chat, the editor automatically displays available commands from all configured locations, making complex workflows instantly accessible.

---

## Storage Locations

Cursor detects and displays commands from three locations:

### 1. Project Commands (Team-Specific)

**Location:** `.cursor/commands/` in your project root

**Purpose:**
- Project-specific workflows
- Team-shared standards
- Repository-specific processes

**Example:**
```
.cursor/commands/
├── address-github-pr-comments.md
├── code-review-checklist.md
├── create-pr.md
├── security-audit.md
└── setup-new-feature.md
```

### 2. Global Commands (Personal)

**Location:** `~/.cursor/commands/` in your home directory

**Purpose:**
- Personal workflows across all projects
- Individual productivity shortcuts
- Cross-project standards

### 3. Team Commands (Enterprise)

**Location:** Cursor Dashboard (Team/Enterprise plans only)

**Purpose:**
- Centralized management by admins
- Automatic distribution to all members
- Organization-wide standardization
- Instant updates without manual sync

**Features:**
- ✅ Admin-controlled access
- ✅ Automatic synchronization
- ✅ Server-enforced consistency
- ✅ No manual distribution needed

---

## Creating Custom Commands

### Setup Process

Three straightforward steps:

1. **Create directory:** `.cursor/commands/` at project root
2. **Add Markdown files:** Descriptive names (e.g., `review-code.md`, `write-tests.md`)
3. **Write content:** Markdown describing the command's functionality

Commands automatically appear when users type `/` in chat.

### File Structure

**File Extension:** All commands use `.md` (Markdown)

**Organization Strategies:**

**Flat Structure (recommended for 5-15 commands):**
```
.cursor/commands/
├── review-security.md
├── generate-tests.md
├── update-docs.md
├── create-pr.md
└── setup-feature.md
```

**Namespaced Structure (15+ commands):**
```
.cursor/commands/
├── review/
│   ├── security.md
│   ├── performance.md
│   └── accessibility.md
└── generate/
    ├── tests.md
    ├── docs.md
    └── changelog.md
```

### Example Command File

**`.cursor/commands/code-review-checklist.md`:**

```markdown
# Code Review Checklist

## Security
- Check for SQL injection vulnerabilities
- Verify input validation
- Review authentication and authorization
- Check for XSS attack vectors

## Performance
- Identify unnecessary computations
- Review database query efficiency
- Check for memory leaks
- Analyze algorithm complexity

## Code Quality
- Verify naming conventions
- Check function length and complexity
- Look for code duplication
- Review error handling

## Testing
- Verify test coverage
- Check for edge cases
- Review test quality
- Ensure integration tests exist

## Documentation
- Check inline comments
- Verify API documentation
- Review README updates
- Check changelog entries
```

---

## Usage and Parameters

### Basic Usage

**Trigger commands with `/` prefix:**
```
/code-review-checklist
/security-audit
/create-pr
```

### Parameters

Commands accept additional context after the command name:

**Example:**
```
/commit and /pr these changes to address DX-523
```

The model includes these parameters in its prompt execution.

**Multiple commands:**
```
/review-security src/auth/ and /generate-tests
```

---

## Team Commands

### Overview (Team/Enterprise Plans Only)

Team administrators can create server-enforced commands through the Cursor Team Content dashboard.

### Key Benefits

**1. Centralized Management**
- Single source of truth
- Admin-only creation/modification
- Organization-wide visibility

**2. Automatic Synchronization**
- Instant propagation to all members
- No manual distribution needed
- Always up-to-date

**3. Standardization**
- Consistent workflows across teams
- Enforced best practices
- Reduced onboarding time

**4. Access Control**
- Only administrators can create/modify
- Team members use read-only
- Prevents unauthorized changes

### Access

**Creating Team Commands:**
1. Log in to Cursor Dashboard
2. Navigate to Team Content
3. Create/edit commands
4. Changes instantly available to all members

**Using Team Commands:**
- Automatically available when typing `/`
- No configuration needed
- Same usage as project/global commands

---

## Example Templates

### 1. Code Review Checklist

**Purpose:** Systematic code review process

**File:** `.cursor/commands/code-review-checklist.md`

```markdown
# Code Review Checklist

Review the following code for:

## Security
- SQL injection vulnerabilities
- XSS attack vectors
- Authentication bypass risks
- Sensitive data exposure

## Performance
- Unnecessary computations
- Memory leaks
- Database query efficiency
- Algorithm complexity

## Code Quality
- Naming conventions
- Function length
- Code duplication
- Error handling

## Testing
- Test coverage
- Edge cases
- Integration tests
- Test quality
```

### 2. Security Audit

**Purpose:** Comprehensive security review

**File:** `.cursor/commands/security-audit.md`

```markdown
# Security Audit

Perform a comprehensive security audit:

## Authentication & Authorization
- Check authentication mechanisms
- Verify authorization logic
- Review session management
- Check password handling

## Input Validation
- Verify all user inputs validated
- Check for injection vulnerabilities
- Review file upload handling
- Check API input validation

## Data Protection
- Review encryption usage
- Check sensitive data storage
- Verify secure transmission
- Review logging practices

## Dependencies
- Check for vulnerable dependencies
- Review third-party library usage
- Verify security patches applied

Report findings with severity levels and remediation steps.
```

### 3. Feature Setup Workflow

**Purpose:** Standard feature development process

**File:** `.cursor/commands/setup-new-feature.md`

```markdown
# New Feature Setup

Complete feature setup:

## 1. Planning
- Review feature requirements
- Identify affected components
- Plan implementation approach
- Consider edge cases

## 2. Branch Setup
- Create feature branch
- Update from main
- Set up tracking

## 3. Implementation
- Write feature code
- Add unit tests
- Add integration tests
- Update documentation

## 4. Review
- Self-review changes
- Run all tests
- Check code quality
- Verify documentation

## 5. Preparation
- Create pull request
- Add description
- Request reviewers
- Link related issues
```

### 4. Pull Request Creation

**Purpose:** Standardized PR workflow

**File:** `.cursor/commands/create-pr.md`

```markdown
# Create Pull Request

Prepare and create pull request:

## 1. Pre-Flight Checks
- All tests pass
- Code review checklist completed
- Documentation updated
- Changelog updated

## 2. Commit Review
- Review all commits
- Verify commit messages
- Check for sensitive data
- Ensure clean history

## 3. PR Description
- Summarize changes
- Link related issues
- Add testing steps
- Note breaking changes

## 4. Final Steps
- Create pull request
- Add appropriate labels
- Request reviewers
- Assign to project board
```

### 5. Test Execution and Fixing

**Purpose:** Run tests and fix failures

**File:** `.cursor/commands/run-and-fix-tests.md`

```markdown
# Run and Fix Tests

Execute test suite and address failures:

## 1. Run Tests
- Execute full test suite
- Capture all failures
- Note error messages
- Identify patterns

## 2. Analyze Failures
- Root cause analysis
- Check recent changes
- Review stack traces
- Identify affected code

## 3. Fix Issues
- Implement minimal fixes
- Preserve test intent
- Update tests if needed
- Verify related tests

## 4. Verify
- Re-run failed tests
- Run full suite
- Check coverage
- Document changes
```

### 6. Developer Onboarding

**Purpose:** New developer setup process

**File:** `.cursor/commands/developer-onboarding.md`

```markdown
# Developer Onboarding

Complete onboarding process:

## 1. Environment Setup
- Install required tools
- Configure development environment
- Set up credentials
- Test local setup

## 2. Codebase Familiarization
- Review architecture overview
- Understand key components
- Explore coding standards
- Review contribution guidelines

## 3. First Tasks
- Run test suite
- Build project
- Run development server
- Make sample change

## 4. Team Integration
- Join communication channels
- Schedule team introductions
- Review team processes
- Access documentation

## 5. Verification
- All tools installed correctly
- Tests pass locally
- Development server runs
- Can build project
```

---

## Best Practices

### Command Design

✅ **DO:**
- **Single responsibility** - Each command has one clear purpose
- **Clear naming** - Use descriptive, verb-noun patterns
- **Consistent format** - Follow team conventions
- **Comprehensive content** - Include all necessary steps

❌ **DON'T:**
- Create catch-all commands doing too much
- Use vague names like "helper" or "utility"
- Mix multiple unrelated concerns
- Write overly brief or cryptic content

### Naming Conventions

**Verb-Noun Pattern:**
```
review-security.md
generate-tests.md
update-docs.md
create-pr.md
setup-feature.md
```

**Namespaced (for large sets):**
```
review/security.md
review/performance.md
generate/tests.md
generate/docs.md
```

### Content Structure

✅ **DO:**
- Use clear headers and sections
- Include numbered or bulleted lists
- Provide specific, actionable steps
- Add context and rationale

**Example:**
```markdown
# Security Review

## 1. Authentication
- Check login mechanisms
- Verify session handling
- Review password policies

## 2. Authorization
- Verify access controls
- Check permission logic
- Review role assignments

## 3. Data Protection
- Check encryption usage
- Verify sensitive data handling
- Review logging practices
```

### Version Control

✅ **DO:**
- Commit project commands to repository
- Document command purpose in README
- Track changes with meaningful commits
- Share useful commands with team

❌ **DON'T:**
- Keep useful project commands local only
- Skip documentation
- Make breaking changes without notice

### Team Collaboration

✅ **DO:**
- Discuss new commands with team
- Use team commands for organization standards
- Keep project commands relevant
- Archive outdated commands

**Example workflow:**
```bash
# Add new command
echo "# Review API Changes" > .cursor/commands/review-api.md

# Commit to repo
git add .cursor/commands/review-api.md
git commit -m "feat: add review-api command"

# Team members automatically get command on pull
```

---

## Common Patterns

### 1. Review Pattern

**Purpose:** Systematic code analysis

**Structure:**
```markdown
# [Review Type] Review

## Critical Issues
- [List critical items]

## Medium Priority
- [List medium items]

## Low Priority
- [List low priority items]

## Output Format
- Issue severity
- Location (file:line)
- Explanation
- Suggested fix
```

### 2. Generation Pattern

**Purpose:** Create boilerplate or documentation

**Structure:**
```markdown
# Generate [Artifact]

## 1. Analyze
- [What to analyze]

## 2. Generate
- [What to generate]

## 3. Verify
- [What to verify]

## 4. Output
- [Output format]
```

### 3. Workflow Pattern

**Purpose:** Multi-step processes

**Structure:**
```markdown
# [Workflow Name]

## Step 1: [Name]
- [Actions]

## Step 2: [Name]
- [Actions]

## Step 3: [Name]
- [Actions]

## Verification
- [Checkpoints]
```

### 4. Checklist Pattern

**Purpose:** Verification and validation

**Structure:**
```markdown
# [Task] Checklist

## Category 1
- [ ] Item 1
- [ ] Item 2

## Category 2
- [ ] Item 1
- [ ] Item 2

## Completion Criteria
- All items checked
- [Additional criteria]
```

---

## When to Use Commands

### Choose Commands For

✅ **Standardized workflows** - Processes used repeatedly
✅ **Team alignment** - Ensuring consistent approaches
✅ **Quick access** - Frequently needed tasks
✅ **Documentation** - Preserving institutional knowledge
✅ **Onboarding** - Helping new team members

### Choose Other Tools Instead For

**Subagents:**
- Complex multi-step autonomous work
- Tasks requiring separate context windows
- Independent verification
- Parallel workstreams

**Skills:**
- Plugin-specific functionality
- Advanced tool integrations
- Specialized domain knowledge

**Direct Chat:**
- One-off requests
- Exploratory conversations
- Iterative refinement
- Ad-hoc tasks

---

## Comparison: Cursor vs Claude Code Commands

### Similarities

- ✅ Markdown files with `.md` extension
- ✅ Triggered with `/` prefix in chat
- ✅ Project and user-level storage
- ✅ Reusable workflow patterns
- ✅ Team collaboration support

### Differences

| Feature | Cursor | Claude Code |
|---------|--------|-------------|
| **Project location** | `.cursor/commands/` | `.claude/commands/` |
| **Global location** | `~/.cursor/commands/` | `~/.claude/commands/` |
| **Team distribution** | Team Dashboard (Team/Enterprise) | Plugin system |
| **Frontmatter** | Basic (not documented) | Extensive YAML (description, allowed-tools, model, etc.) |
| **Arguments** | Parameters after command name | `$ARGUMENTS`, `$1`, `$2`, etc. |
| **File references** | Not documented | `@` syntax for file inclusion |
| **Tool restrictions** | Not documented | `allowed-tools` field with wildcards |
| **Model selection** | Not documented | `model: haiku\|sonnet\|opus` |
| **Plugin integration** | Not available | `${CLAUDE_PLUGIN_ROOT}` variable |
| **Bash execution** | Not documented | Inline bash with tool restrictions |
| **Admin control** | Team Dashboard (admins only) | Local/plugin-based |

### Cursor Advantages

✅ **Team Dashboard** - Centralized admin management
✅ **Instant sync** - Automatic distribution to team
✅ **Enterprise features** - Built-in team collaboration

### Claude Code Advantages

✅ **Advanced frontmatter** - Fine-grained control
✅ **Sophisticated arguments** - Positional and named
✅ **File references** - `@` syntax for context
✅ **Tool restrictions** - `allowed-tools` for security
✅ **Plugin system** - `${CLAUDE_PLUGIN_ROOT}` integration
✅ **Inline bash** - Execute commands within markdown

### Recommendation

**Use Cursor Commands for:**
- Team standardization with Enterprise plans
- Simple, straightforward workflows
- Quick access to common tasks

**Use Claude Code Commands for:**
- Advanced workflow automation
- Complex argument handling
- Strict tool permission control
- Plugin-based extensibility

**Use Both:**
- Create compatible commands in both locations
- Share common patterns across platforms
- Maintain cross-platform documentation

---

## Troubleshooting

### Commands Not Appearing

**Check:**
1. File extension is `.md`
2. File is in correct location (`.cursor/commands/`)
3. Cursor has been restarted
4. No syntax errors in Markdown

**Solution:**
```bash
# Verify file location
ls .cursor/commands/

# Check file extension
file .cursor/commands/my-command.md

# Restart Cursor
```

### Team Commands Not Syncing

**Check:**
1. Team/Enterprise plan active
2. User is logged in to Cursor
3. Network connectivity
4. Team membership confirmed

**Solution:**
- Log out and back in to Cursor
- Check Cursor Dashboard for team status
- Contact Cursor support if issue persists

### Commands Executing Incorrectly

**Check:**
1. Markdown syntax is correct
2. Instructions are clear and specific
3. No ambiguous language
4. Steps are in logical order

**Solution:**
- Test command with simple cases first
- Refine instructions iteratively
- Get team feedback on clarity

---

## Resources

**Official Documentation:**
- [Cursor Commands](https://cursor.com/docs/context/commands)
- [Cursor Dashboard](https://cursor.com/settings/team)

**In This Repository:**
- `command-development.md` - Claude Code commands reference
- `cursor-subagents.md` - Cursor subagents documentation
- `sub-agents-claude-code.md` - Claude Code sub-agents
- `.cursor/commands/` - Project commands directory

**Related:**
- [Cursor Subagents](https://cursor.com/docs/context/subagents)
- [Cursor Context](https://cursor.com/docs/context)

---

**Last Updated:** January 2026
**Category:** Cursor Commands
**Status:** Beta Feature
**Platform:** Cursor
