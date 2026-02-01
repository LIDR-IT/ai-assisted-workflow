# Skill Invocation

## Overview

Skills can be invoked in two ways: **automatically** by the AI agent when it detects matching intent, or **manually** by the user through explicit commands. Understanding how each invocation method works is essential for effectively using skills in your workflow.

This guide covers the mechanics of skill invocation, string substitutions for dynamic content, control mechanisms for determining who can invoke skills, and best practices for reliable skill activation.

---

## Two Invocation Methods

### Automatic Invocation (Agent-Triggered)

**How it works:**
1. Agent monitors conversation for user requests
2. Compares request against skill descriptions in context
3. When description matches user intent, loads full skill content
4. Applies skill knowledge to fulfill request

**Example:**

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---
```

**User request:** "How does this authentication system work?"

**Agent behavior:**
1. Detects keywords: "how does", "work", "authentication"
2. Matches against `explain-code` description
3. Loads full `explain-code` skill content
4. Applies skill instructions to explain authentication with diagrams and analogies

**When automatic invocation happens:**
- User request semantically matches skill description
- `disable-model-invocation` is NOT set to `true`
- Skill description is loaded in agent context

**Benefits:**
- Natural conversation flow (no command syntax needed)
- Agent applies expertise automatically
- User doesn't need to know skill exists
- Progressive disclosure keeps context lean

**Limitations:**
- Requires well-written, specific descriptions
- May not trigger if phrasing doesn't match
- Agent decides when to apply (not always predictable)

### Manual Invocation (User-Triggered)

**How it works:**
1. User types `/skill-name` with optional arguments
2. Agent immediately loads skill content
3. Applies skill regardless of context or description matching

**Example:**

```bash
# Basic invocation
/explain-code

# With argument
/explain-code src/auth/login.ts

# With multiple arguments
/migrate-component SearchBar React Vue
```

**When manual invocation happens:**
- User explicitly types `/skill-name`
- Skill has `user-invocable: true` (default) or field is omitted
- Skill appears in autocomplete menu when typing `/`

**Benefits:**
- Guaranteed activation (no description matching needed)
- Precise control over when skill applies
- Can pass arguments for dynamic behavior
- Predictable behavior every time

**Limitations:**
- User must know skill exists
- Requires typing command syntax
- Breaks conversational flow
- Hidden if `user-invocable: false`

---

## Automatic Triggering Mechanics

### Description Matching

The `description` field determines when automatic invocation occurs:

```yaml
---
name: database-migration-validator
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment
---
```

**Matching algorithm:**
1. Agent sees only skill **descriptions** initially (not full content)
2. User request analyzed for semantic intent
3. Agent compares intent against all available skill descriptions
4. Best matching skill(s) load full content
5. Agent applies loaded skill knowledge

**What makes a good triggering description:**

✅ **Specific action verbs:**
```yaml
description: Generates React functional components with TypeScript, hooks, and tests following project conventions
```

✅ **Clear context and constraints:**
```yaml
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

✅ **Natural language users would say:**
```yaml
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

❌ **Vague or generic:**
```yaml
description: Database tools  # Too vague, won't trigger reliably
description: Code helper      # Generic, matches too many requests
```

### Context Budget and Skill Loading

**Context loading strategy (Claude Code):**
- **At rest:** Only skill descriptions loaded (default budget: 15,000 characters)
- **On invoke:** Full skill content loads when triggered
- **After use:** Full content may unload to free context space

**If skills excluded due to budget:**

```bash
# Check current context
/context

# Increase budget if needed (environment variable)
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

**Progressive disclosure (Antigravity):**
- **At rest:** Agent sees only SKILL.md frontmatter (name + description)
- **On match:** Full skill content loads dynamically
- **On complete:** Skill unloads to free context

This prevents context saturation and enables scaling to many skills.

### Activation Flow (Antigravity)

**Step-by-step activation:**

1. **User request:** "Generate unit tests for this component"
2. **Agent scans:** Reviews all skill descriptions in context
3. **Intent match:** Finds `testing-skill` with description "Generates unit tests for components with comprehensive coverage and edge cases"
4. **Content load:** Full SKILL.md body, scripts, templates, examples load
5. **Execution:** Agent applies testing expertise using loaded knowledge
6. **Unload:** Skill content unloads after task completion

**Visual representation:**

```
User Request
     ↓
[Description Scan] ← All skill descriptions in context
     ↓
[Intent Match] → testing-skill matches "generate unit tests"
     ↓
[Content Load] ← SKILL.md body + scripts/ + examples/
     ↓
[Execution] → Agent applies testing expertise
     ↓
[Unload] ← Skill content removed to free context
```

---

## Manual Invocation with Arguments

### Basic Syntax

```bash
/skill-name [arg1] [arg2] [arg3]
```

**Examples:**

```bash
# No arguments
/deploy

# Single argument
/fix-issue 123

# Multiple arguments
/migrate-component SearchBar React Vue
```

### String Substitution Variables

Skills support dynamic value injection through string substitutions:

| Variable | Description | Example |
|----------|-------------|---------|
| `$ARGUMENTS` | All arguments as single string | `/deploy staging` → `$ARGUMENTS` = "staging" |
| `$ARGUMENTS[N]` | Specific argument by 0-based index | `$ARGUMENTS[0]` = first arg |
| `$N` | Shorthand for `$ARGUMENTS[N]` | `$0` = first, `$1` = second |
| `${CLAUDE_SESSION_ID}` | Current session ID | Unique ID for this session |

### Using $ARGUMENTS

**If `$ARGUMENTS` present in skill:**

```yaml
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

**Usage:** `/session-logger User completed authentication flow`

**Result:** Content "User completed authentication flow" injected where `$ARGUMENTS` appears

**If `$ARGUMENTS` NOT present in skill:**

Arguments automatically append as:

```
ARGUMENTS: <value>
```

**Example:**

```yaml
---
name: deploy
description: Deploy the application to production
---

Deploy to production:
1. Run tests
2. Build application
3. Push to deployment target
```

**Usage:** `/deploy staging`

**Agent sees:**

```
Deploy to production:
1. Run tests
2. Build application
3. Push to deployment target

ARGUMENTS: staging
```

### Using Indexed Arguments ($N)

**Skill definition:**

```yaml
---
name: migrate-component
description: Migrate a component from one framework to another
argument-hint: <component-name> <from-framework> <to-framework>
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.

## Process
1. Analyze $0 component structure
2. Identify $1-specific patterns
3. Convert to $2 equivalents
4. Maintain functionality
```

**Usage:** `/migrate-component SearchBar React Vue`

**Agent sees:**

```
Migrate the SearchBar component from React to Vue.
Preserve all existing behavior and tests.

## Process
1. Analyze SearchBar component structure
2. Identify React-specific patterns
3. Convert to Vue equivalents
4. Maintain functionality
```

**Benefits:**
- Structured, predictable argument handling
- Self-documenting with `argument-hint`
- Reusable skill template for different inputs
- Clear parameter positions

### Using Session ID

**Skill definition:**

```yaml
---
name: debug-logger
description: Log debugging information with session tracking
---

Create debug log at: `logs/debug-${CLAUDE_SESSION_ID}.log`

Include:
- Timestamp
- Session ID: ${CLAUDE_SESSION_ID}
- Debug information: $ARGUMENTS

Format log entries for easy parsing and correlation across sessions.
```

**Usage:** `/debug-logger Failed authentication attempt for user@example.com`

**Agent sees:**

```
Create debug log at: `logs/debug-a1b2c3d4-e5f6-7890-abcd-ef1234567890.log`

Include:
- Timestamp
- Session ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- Debug information: Failed authentication attempt for user@example.com
```

**Use cases for session ID:**
- Session-specific logging
- Temporary file naming
- Correlating output across multiple skills
- Debugging and tracing

### Argument Hints

The `argument-hint` field provides autocomplete guidance:

```yaml
---
name: fix-issue
description: Fix a GitHub issue by number
argument-hint: <issue-number>
---
```

**Autocomplete display:**

```
/fix-issue <issue-number>
```

**Multiple arguments:**

```yaml
argument-hint: <component-name> <from-framework> <to-framework>
```

**Autocomplete display:**

```
/migrate-component <component-name> <from-framework> <to-framework>
```

**Best practices:**
- Use angle brackets for required: `<arg>`
- Use square brackets for optional: `[arg]`
- Be descriptive but concise
- Match indexed argument positions

---

## Controlling Invocation

### Two Control Fields

Skills provide two frontmatter fields to control invocation:

**1. `disable-model-invocation`** - Controls automatic (agent) invocation

**2. `user-invocable`** - Controls manual (user) invocation

### disable-model-invocation

**Purpose:** Prevent agent from automatically invoking skill

**Default:** `false` (agent can auto-invoke)

**Set to `true` when:**
- Skill has side effects (deploys, commits, database changes)
- Timing matters (user must trigger at right moment)
- Requires user judgment to invoke
- Should only run when explicitly requested

**Example: Deployment Skill**

```yaml
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
context: fork
---

Deploy $ARGUMENTS to production:
1. Run the test suite
2. Build the application
3. Push to deployment target
4. Verify deployment succeeded
5. Monitor for errors
```

**Behavior:**
- ✅ User can invoke: `/deploy staging`
- ❌ Agent CANNOT auto-invoke (even if user says "deploy to staging")
- 📋 Description NOT loaded into agent context (saves budget)
- 🔒 Full skill loads ONLY when user manually invokes

**Why use this:**
- Prevents accidental deployments
- Ensures user approval for destructive operations
- User controls timing of side-effect operations
- Protects against misinterpretation of user intent

### user-invocable

**Purpose:** Hide skill from user's `/` menu

**Default:** `true` (skill appears in menu)

**Set to `false` when:**
- Skill provides background knowledge (not actionable command)
- Agent should auto-apply but users shouldn't directly invoke
- Skill is intermediate/helper (not user-facing)
- Reducing menu clutter

**Example: Legacy System Context**

```yaml
---
name: legacy-system-context
description: Context about legacy authentication system architecture and constraints. Use when working with auth/legacy/ directory or discussing legacy system migration.
user-invocable: false
---

# Legacy Authentication System

## Architecture
[Detailed legacy system documentation...]

## Constraints
[Migration constraints and gotchas...]

## Integration Points
[How legacy system connects to new system...]
```

**Behavior:**
- ✅ Agent can auto-invoke (when working in auth/legacy/)
- ❌ User CANNOT invoke (hidden from `/` menu)
- 📋 Description loaded into agent context
- 📚 Full skill loads when agent detects relevant work

**Why use this:**
- Background knowledge that's not a "command"
- Keeps `/` menu focused on actionable skills
- Agent-only expertise and context
- Reduces user cognitive load

**Important distinction:**

`user-invocable: false` only controls **menu visibility**, NOT tool access. To completely block programmatic invocation, use `disable-model-invocation: true`.

### Invocation Matrix

| Frontmatter | User `/skill` | Agent auto-invoke | Description in context | Full content loads |
|-------------|---------------|-------------------|------------------------|-------------------|
| (default) | ✅ Yes | ✅ Yes | ✅ Yes | On invoke |
| `disable-model-invocation: true` | ✅ Yes | ❌ No | ❌ No | When user invokes |
| `user-invocable: false` | ❌ No (hidden) | ✅ Yes | ✅ Yes | On invoke |
| Both `true` and `false` | ❌ No | ❌ No | ❌ No | Never (broken config) |

### Use Case Matrix

| Use Case | disable-model-invocation | user-invocable | Example |
|----------|-------------------------|----------------|---------|
| **General skill** | `false` | `true` | `/explain-code` - Both manual and auto |
| **Dangerous operation** | `true` | `true` | `/deploy` - User only, explicit |
| **Background knowledge** | `false` | `false` | `legacy-system-context` - Agent only |
| **Manual workflow** | `true` | `true` | `/commit` - User controls timing |
| **Auto-apply guideline** | `false` | `false` | `api-conventions` - Agent applies automatically |

### System-Level Restrictions

Beyond skill-level controls, you can restrict skill invocation through permission settings:

**Disable all skills:**

```
# In /permissions, add to deny rules:
Skill
```

**Allow specific skills only:**

```
# Allow only these skills
Skill(commit)
Skill(review-pr *)
```

**Deny specific skills:**

```
# Block these skills
Skill(deploy *)
```

**Permission syntax:**
- `Skill(name)` - Exact match
- `Skill(name *)` - Prefix match with any arguments

---

## Best Practices for Invocation

### Writing Triggering Descriptions

**Include natural keywords:**

✅ **Good:**
```yaml
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
```

Triggers on: "how does this work", "explain this code", "teach me about"

❌ **Bad:**
```yaml
description: Code explainer
```

Too generic, won't reliably match user intent.

**Be specific about context:**

✅ **Good:**
```yaml
description: Validates database schema migrations for consistency, safety, and rollback capability before production deployment, checking for missing indexes, unsafe operations, and reversibility
```

Triggers on: "validate migration", "check schema safety", "migration review"

❌ **Bad:**
```yaml
description: Database tools
```

Too vague, could match many unrelated requests.

**Include action verbs:**

✅ **Good:**
```yaml
description: Generates React functional components with TypeScript, hooks, styled-components, and comprehensive test coverage following project conventions
```

Triggers on: "generate component", "create React component", "scaffold component"

**Test both phrasings:**

Test skill activation with different user requests:
- "Generate a user profile component" ✅
- "I need a new component for user profiles" ✅
- "How do I create components?" ❌ (too general, might not match)

### Choosing Invocation Method

**Use automatic (default) when:**
- Skill provides general knowledge or guidelines
- User would naturally request capability in conversation
- No side effects or destructive operations
- Want seamless integration without command syntax

**Use `disable-model-invocation: true` when:**
- Skill has side effects (commits, deploys, API calls)
- Timing matters (user must control when)
- Requires confirmation or approval
- Potentially destructive or irreversible

**Use `user-invocable: false` when:**
- Background knowledge not actionable as command
- Agent should apply but users shouldn't directly invoke
- Reducing menu clutter
- Helper skill for other skills

### Designing Argument Patterns

**Use `$ARGUMENTS` for freeform content:**

```yaml
name: explain-concept
description: Explain a technical concept with analogies
---
Explain $ARGUMENTS using everyday analogies and examples.
```

Usage: `/explain-concept dependency injection in React`

**Use indexed `$N` for structured inputs:**

```yaml
name: create-endpoint
argument-hint: <route> <method> <description>
---
Create $1 endpoint at $0: $2
```

Usage: `/create-endpoint /api/users POST Create new user account`

**Provide argument hints:**

Always include `argument-hint` for skills with parameters:

```yaml
argument-hint: <issue-number>              # Single arg
argument-hint: <component> <framework>     # Multiple args
argument-hint: [environment]               # Optional arg
```

### Testing Invocation

**Test automatic invocation:**

1. Write request matching description keywords
2. Verify skill activates (check agent response applies skill knowledge)
3. Try variations of phrasing
4. Test edge cases (similar but different intents)

**Test manual invocation:**

1. Type `/skill-name` in conversation
2. Verify autocomplete appears
3. Test with various argument combinations
4. Verify string substitutions work correctly

**Test controls:**

1. Set `disable-model-invocation: true`, verify agent doesn't auto-invoke
2. Set `user-invocable: false`, verify hidden from menu
3. Test permission restrictions if configured

---

## Troubleshooting

### Skill Not Triggering

**Symptoms:**
- Request seems to match but skill doesn't activate
- Agent doesn't use skill knowledge
- Similar requests work inconsistently

**Solutions:**

**1. Check description specificity:**

❌ **Too vague:**
```yaml
description: Testing tools
```

✅ **Specific:**
```yaml
description: Generates unit tests for React components with Jest, React Testing Library, and comprehensive coverage including edge cases and user interactions
```

**2. Verify skill is discoverable:**

```bash
# Claude Code
What skills are available?

# Check if your skill appears in list
```

**3. Try exact phrasing from description:**

If description says "Use when explaining how code works", try:
```
Explain how this code works
```

**4. Invoke manually to confirm it works:**

```bash
/skill-name
```

If manual invocation works but automatic doesn't, it's a description matching issue.

**5. Check context budget:**

```bash
/context  # See if skills are excluded
```

Increase if needed:
```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

**6. Restart agent:**

Sometimes cache issues prevent detection:
```bash
# Claude Code
/restart
```

### Wrong Skill Triggered

**Symptoms:**
- Different skill activates than expected
- Multiple skills seem to compete
- Unpredictable skill selection

**Solutions:**

**1. Make descriptions more distinct:**

If two skills overlap:

❌ **Overlapping:**
```yaml
# Skill 1
description: Generate tests

# Skill 2
description: Create test files
```

✅ **Distinct:**
```yaml
# Skill 1
description: Generate unit tests for React components with Jest and React Testing Library

# Skill 2
description: Create integration tests for API endpoints with Supertest and database fixtures
```

**2. Add context constraints:**

```yaml
description: Generate React component tests (ONLY for TypeScript projects with Jest configured)
```

**3. Use `disable-model-invocation: true`:**

For precision-critical skills, disable automatic invocation:

```yaml
disable-model-invocation: true
```

Force manual invocation: `/skill-name`

### Skill Triggers Too Often

**Symptoms:**
- Skill activates when not wanted
- Interrupts other work
- Description too broad

**Solutions:**

**1. Narrow description:**

❌ **Too broad:**
```yaml
description: Helps with code
```

✅ **Narrow:**
```yaml
description: Refactors TypeScript code to extract reusable utility functions, but ONLY when user explicitly requests refactoring or code extraction
```

**2. Add `disable-model-invocation: true`:**

Require explicit invocation:

```yaml
disable-model-invocation: true
```

**3. Add conditional language:**

```yaml
description: Generates database migrations, but ONLY when user explicitly mentions creating, modifying, or migrating database schema
```

### Arguments Not Substituting

**Symptoms:**
- `$ARGUMENTS` appears literally in output
- `$0`, `$1` not replaced
- Session ID not substituted

**Solutions:**

**1. Check variable syntax:**

✅ **Correct:**
```markdown
Migrate $0 from $1 to $2
Session: ${CLAUDE_SESSION_ID}
All args: $ARGUMENTS
```

❌ **Incorrect:**
```markdown
Migrate %0 from %1 to %2        # Wrong prefix
Session: $CLAUDE_SESSION_ID     # Missing braces for session ID
All args: $ARGS                 # Wrong variable name
```

**2. Verify invocation includes arguments:**

```bash
# With arguments
/migrate-component SearchBar React Vue  ✅

# Without arguments (substitution fails)
/migrate-component  ❌
```

**3. Check argument count:**

If skill expects `$0`, `$1`, `$2` but only 2 args provided:
```bash
/skill-name arg1 arg2  # $2 will be empty/undefined
```

**4. Test with manual invocation:**

Manual invocation always works; if automatic invocation fails substitution, it may be a platform bug.

---

## Related Documentation

### Skill Development
- [Skill Anatomy](../01-understanding-skills/skill-anatomy.md) - SKILL.md structure and frontmatter
- [Skill Discovery](../01-understanding-skills/discovery.md) - How agents find skills
- [Creating Skills](../03-creating-skills/) - Building your own skills

### Advanced Topics
- **Skills + Subagents:** Running skills in isolated context with `context: fork`
- **Skills + Hooks:** Event-driven skill execution
- **Tool Restrictions:** Using `allowed-tools` to limit skill capabilities

### Platform References
- `docs/es/references/skills/skills-claude-code.md` - Claude Code skills documentation
- `docs/es/references/skills/antigravity-skills.md` - Antigravity skills documentation

---

**Last Updated:** February 2026
**Applies to:** Claude Code, Antigravity, Gemini CLI
**Related:** Skill anatomy, discovery, creation
