# Cursor Plan Mode

Plan Mode is a specialized workflow in Cursor that enables comprehensive planning before implementation, ideal for complex features and architectural decisions.

## Overview

Plan Mode provides a structured 5-step process to ensure well-thought-out implementations:

1. **Clarification** - Agent asks questions to understand requirements
2. **Research** - Gathers relevant context from your codebase
3. **Plan Creation** - Develops comprehensive implementation plan
4. **Review & Edit** - You review and refine the plan
5. **Build** - Click to execute the approved plan

## Activation

**Keyboard Shortcut:**

- Press **Shift+Tab** from the chat input to rotate to Plan Mode

**Automatic Suggestion:**

- Cursor suggests Plan Mode automatically when it detects keywords indicating complex tasks

## When to Use Plan Mode

Plan Mode is ideal for:

- **Complex features** with multiple valid approaches
- **Multi-file changes** that touch many systems
- **Unclear requirements** where exploration is needed before understanding scope
- **Architectural decisions** requiring upfront review and team discussion
- **Tasks requiring precise planning** before delegating to Agent

**When NOT to use Plan Mode:**

- Quick changes or bug fixes
- Familiar, straightforward tasks
- Simple refactoring with clear approach

## Plan Storage

**Ephemeral Files:**

- Plans initially open as ephemeral virtual files (not saved to disk)

**Saving Plans:**

- Click **"Save to workspace"** to persist plans
- Saved location: `.cursor/plans/`
- Benefits:
  - Future reference
  - Team sharing
  - Documentation of decision-making process

## Best Practices

### Plan First, Build Second

The key insight: **"The hard part is often figuring out WHAT change should be made—a task suited well for humans."**

For substantial changes:

1. Invest time creating a precise, well-scoped plan
2. Review and refine until you're confident
3. Then delegate implementation to Agent

### Iterate on Plans, Not Code

When Agent's output misses your intent:

- ✅ **DO:** Revert changes and refine the plan
- ❌ **DON'T:** Use follow-up prompts to fix code

**Why:** Refining the plan often produces cleaner results faster than iterative code fixes.

### Leverage Team Collaboration

Saved plans in `.cursor/plans/` enable:

- Code review before implementation
- Team discussion on approach
- Documentation of architectural decisions
- Onboarding new team members

## Workflow Example

```markdown
# Example: Adding Authentication System

## 1. Clarification Phase

Agent: "What authentication method? (OAuth, JWT, session-based?)"
User: "JWT with refresh tokens"

## 2. Research Phase

Agent explores codebase:

- Current user model structure
- Existing middleware patterns
- Database schema capabilities

## 3. Plan Creation

Agent proposes:

- New auth middleware
- User model updates
- Token service implementation
- Protected route patterns

## 4. Review & Edit

User refines plan:

- Add rate limiting
- Specify token expiration times
- Include security headers

## 5. Build

Click "Build" → Agent implements approved plan
```

## Integration with Agent Mode

**Plan Mode + Agent Mode workflow:**

1. Use Plan Mode for complex tasks requiring upfront design
2. Review and approve plan
3. Let Agent Mode execute the implementation
4. Verify results match the plan

## Storage Location

```
project-root/
└── .cursor/
    └── plans/
        ├── add-authentication-2024-01-31.md
        ├── refactor-api-layer-2024-01-30.md
        └── implement-caching-2024-01-29.md
```

Plans are stored as Markdown files with timestamps for easy organization.

## Related Documentation

- [Cursor Agent Modes](https://cursor.com/docs/agent/modes)
- [Agent System Reference](../agents/agent-system.md)
- [Gemini Memory System](gemini-memory.md) - Alternative planning approach

## References

- Official Docs: https://cursor.com/docs/agent/modes#plan
