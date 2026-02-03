# Gemini CLI Memory System

The Gemini CLI memory system enables the agent to retain information across sessions, providing personalized assistance by recalling stored facts and preferences.

## Overview

The `save_memory` tool allows you to store important information that persists across CLI sessions, eliminating the need to repeat context in every conversation.

## How It Works

### Storage Location

Memories are appended to: `~/.gemini/GEMINI.md`

Specifically organized under the section: `## Gemini Added Memories`

### Syntax

```
save_memory(fact="Your fact here.")
```

**Required Argument:**

- `fact` (string, required) - A clear, self-contained piece of information

## Memory Commands

### Save Memory

```bash
# The agent can call this during conversation
save_memory(fact="User prefers TypeScript over JavaScript")
save_memory(fact="Project uses React Native with Expo")
save_memory(fact="Team follows Conventional Commits format")
```

### View Memory

```bash
# Display concatenated context content
/memory show

# Alternative (shows all context including GEMINI.md)
/memory list
```

### Refresh Memory

```bash
# Rescan and reload all GEMINI.md files
/memory refresh
```

### Add Memory Manually

```bash
# Append content to global memory
/memory add "User prefers functional components over class components"
```

### Clear Memory

```bash
# Clear all stored memories
/memory clear
```

## Practical Applications

### Personal Preferences

```
save_memory(fact="User prefers Python 3.11+ with type hints")
save_memory(fact="User likes concise code comments, not verbose")
save_memory(fact="User follows PEP 8 style guide")
```

### Project-Specific Details

```
save_memory(fact="This project uses pnpm instead of npm")
save_memory(fact="API endpoints follow REST conventions")
save_memory(fact="Database migrations use Prisma")
```

### Workflow Patterns

```
save_memory(fact="User commits frequently with descriptive messages")
save_memory(fact="User runs tests before committing")
save_memory(fact="User prefers small, focused PRs")
```

## Best Practices

### ✅ DO

- **Store concise, important facts**
  - Good: "User prefers async/await over .then()"
  - Bad: "Today the user mentioned they sometimes use async/await when working with promises in JavaScript because..."

- **Keep facts self-contained**
  - Good: "Project uses Tailwind CSS v4"
  - Bad: "Uses Tailwind" (missing version context)

- **Update outdated facts manually**
  - Edit `~/.gemini/GEMINI.md` directly
  - Remove obsolete information

### ❌ DON'T

- **Store large amounts of data**
  - NOT intended for: Full code snippets, entire configurations
  - Use project GEMINI.md files instead (see [GEMINI.md Hierarchy](gemini-md-hierarchy.md))

- **Store conversational history**
  - NOT for: "User asked about X, then we discussed Y"
  - For: "User prefers X approach for Y scenarios"

- **Store sensitive information**
  - Never: API keys, passwords, credentials
  - Use environment variables instead

## Memory File Structure

The `~/.gemini/GEMINI.md` file is a plain text Markdown document:

```markdown
# My Gemini CLI Configuration

## Personal Coding Style

I prefer TypeScript with strict mode enabled.
I follow functional programming patterns when possible.

## Gemini Added Memories

- User prefers async/await over .then()
- Project uses pnpm instead of npm
- User commits frequently with descriptive messages
- Team follows Conventional Commits format
```

## Manual Editing

You can directly edit `~/.gemini/GEMINI.md`:

```bash
# Open in your editor
code ~/.gemini/GEMINI.md

# Or use vim/nano
vim ~/.gemini/GEMINI.md
```

After editing, refresh memory:

```bash
/memory refresh
```

## Integration with GEMINI.md Hierarchy

**Memory Tool vs GEMINI.md Files:**

| Feature  | Global Memory (`save_memory`) | Project GEMINI.md      |
| -------- | ----------------------------- | ---------------------- |
| Scope    | All projects                  | Current project only   |
| Storage  | `~/.gemini/GEMINI.md`         | `<project>/GEMINI.md`  |
| Best for | Personal preferences          | Project-specific rules |
| Updates  | Agent can write               | Manual editing only    |

**Recommended Strategy:**

- Use `save_memory` for personal preferences and workflow patterns
- Use project GEMINI.md for project-specific coding standards and architecture
- See [GEMINI.md Hierarchy](gemini-md-hierarchy.md) for multi-level context

## Examples

### Example 1: Development Preferences

```bash
gemini> I prefer using const over let when variables don't change

# Agent saves:
save_memory(fact="User prefers const over let for immutable variables")
```

### Example 2: Project Technology Stack

```bash
gemini> This project uses Next.js 14 with App Router

# Agent saves:
save_memory(fact="Current project uses Next.js 14 with App Router")
```

### Example 3: Testing Strategy

```bash
gemini> I always write unit tests with Vitest before committing

# Agent saves:
save_memory(fact="User writes unit tests with Vitest before committing")
```

## Verification

To verify memory is working:

```bash
# 1. Save a fact
gemini> Remember that I prefer tabs over spaces

# 2. Check memory
/memory show

# 3. Start new session and ask
gemini> Do you remember my indentation preference?

# Agent should recall: "Yes, you prefer tabs over spaces"
```

## Troubleshooting

### Memory Not Persisting

**Issue:** Facts not saved across sessions

**Solutions:**

1. Check file exists: `ls -la ~/.gemini/GEMINI.md`
2. Check permissions: `chmod 644 ~/.gemini/GEMINI.md`
3. Manually refresh: `/memory refresh`

### Too Many Memories

**Issue:** GEMINI.md file becoming bloated

**Solutions:**

1. Edit file directly: `code ~/.gemini/GEMINI.md`
2. Remove outdated facts
3. Organize into sections
4. Consider moving project-specific facts to project GEMINI.md

### Memory Not Loading

**Issue:** Memory commands not working

**Solutions:**

1. Update Gemini CLI: `npm update -g @google/generative-ai-cli`
2. Check settings: `gemini config list`
3. Verify context enabled in settings.json

## Related Documentation

- [GEMINI.md Hierarchy](gemini-md-hierarchy.md) - Multi-level context system
- [Cursor Plan Mode](cursor-plan-mode.md) - Alternative planning approach
- [Custom Commands](../../commands/gemini-cli-custom-commands.md) - Extend CLI functionality

## References

- Official Docs: https://geminicli.com/docs/tools/memory/
- Context Files: https://geminicli.com/docs/cli/gemini-md/
