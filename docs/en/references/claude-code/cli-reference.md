# Claude Code CLI Reference

## Overview

Complete reference for Claude Code command-line interface, including commands and flags.

**Official Documentation:** [code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)

**Key Benefit:** "Comprehensive CLI reference for all command-line options and usage patterns."

---

## CLI Commands

| Command                         | Description                                            | Example                                      |
| :------------------------------ | :----------------------------------------------------- | :------------------------------------------- |
| `claude`                        | Start interactive REPL                                 | `claude`                                     |
| `claude "query"`                | Start REPL with initial prompt                         | `claude "explain this project"`              |
| `claude -p "query"`             | Query via SDK, then exit                               | `claude -p "explain this function"`          |
| `cat file \| claude -p "query"` | Process piped content                                  | `cat logs.txt \| claude -p "explain"`        |
| `claude -c`                     | Continue most recent conversation in current directory | `claude -c`                                  |
| `claude -c -p "query"`          | Continue via SDK                                       | `claude -c -p "Check for type errors"`       |
| `claude -r "<session>" "query"` | Resume session by ID or name                           | `claude -r "auth-refactor" "Finish this PR"` |
| `claude update`                 | Update to latest version                               | `claude update`                              |
| `claude mcp`                    | Configure Model Context Protocol (MCP) servers         | See MCP documentation                        |

---

## CLI Flags

### Session Management

**`--continue`, `-c`**

- Load most recent conversation in current directory
- Example: `claude --continue`

**`--resume`, `-r`**

- Resume specific session by ID or name
- Show interactive picker to choose session
- Example: `claude --resume auth-refactor`

**`--session-id`**

- Use specific session ID for conversation
- Must be valid UUID
- Example: `claude --session-id "550e8400-e29b-41d4-a716-446655440000"`

**`--fork-session`**

- Create new session ID instead of reusing original
- Use with `--resume` or `--continue`
- Example: `claude --resume abc123 --fork-session`

**`--from-pr`**

- Resume sessions linked to specific GitHub PR
- Accepts PR number or URL
- Sessions automatically linked when created via `gh pr create`
- Example: `claude --from-pr 123`

**`--remote`**

- Create new web session on claude.ai with task description
- Example: `claude --remote "Fix the login bug"`

**`--teleport`**

- Resume web session in local terminal
- Example: `claude --teleport`

---

### Mode Control

**`--print`, `-p`**

- Print response without interactive mode
- See Agent SDK documentation for programmatic usage
- Example: `claude -p "query"`

**`--no-session-persistence`**

- Disable session persistence
- Sessions not saved to disk, cannot be resumed
- Print mode only
- Example: `claude -p --no-session-persistence "query"`

---

### Model Configuration

**`--model`**

- Set model for current session
- Alias for latest model: `sonnet` or `opus`
- Or full model name
- Example: `claude --model claude-sonnet-4-5-20250929`

**`--fallback-model`**

- Enable automatic fallback when default model overloaded
- Print mode only
- Example: `claude -p --fallback-model sonnet "query"`

**`--betas`**

- Beta headers to include in API requests
- API key users only
- Example: `claude --betas interleaved-thinking`

---

### Agent and Subagent Configuration

**`--agent`**

- Specify agent for current session
- Overrides `agent` setting
- Example: `claude --agent my-custom-agent`

**`--agents`**

- Define custom subagents dynamically via JSON
- See [Agents flag format](#agents-flag-format)
- Example: `claude --agents '{"reviewer":{"description":"Reviews code","prompt":"You are a code reviewer"}}'`

---

### System Prompt Customization

**`--system-prompt`**

- Replace entire system prompt with custom text
- Works in interactive and print modes
- Example: `claude --system-prompt "You are a Python expert"`

**`--system-prompt-file`**

- Load system prompt from file, replacing default
- Print mode only
- Example: `claude -p --system-prompt-file ./custom-prompt.txt "query"`

**`--append-system-prompt`**

- Append custom text to end of default prompt
- Works in interactive and print modes
- Example: `claude --append-system-prompt "Always use TypeScript"`

**`--append-system-prompt-file`**

- Load additional prompt text from file and append
- Print mode only
- Example: `claude -p --append-system-prompt-file ./extra-rules.txt "query"`

**See:** [System prompt flags](#system-prompt-flags) for detailed comparison

---

### Permissions and Security

**`--permission-mode`**

- Begin in specified permission mode
- Example: `claude --permission-mode plan`

**`--dangerously-skip-permissions`**

- Skip all permission prompts
- Use with caution
- Example: `claude --dangerously-skip-permissions`

**`--allow-dangerously-skip-permissions`**

- Enable permission bypassing as option without activating
- Allows composing with `--permission-mode`
- Use with caution
- Example: `claude --permission-mode plan --allow-dangerously-skip-permissions`

**`--permission-prompt-tool`**

- Specify MCP tool to handle permission prompts in non-interactive mode
- Example: `claude -p --permission-prompt-tool mcp_auth_tool "query"`

---

### Tool Access Control

**`--tools`**

- Restrict which built-in tools Claude can use
- Works in interactive and print modes
- Use `""` to disable all
- Use `"default"` for all
- Or specify tools: `"Bash,Edit,Read"`
- Example: `claude --tools "Bash,Edit,Read"`

**`--allowedTools`**

- Tools that execute without prompting for permission
- See permission rule syntax for pattern matching
- Example: `claude --allowedTools "Bash(git log *)" "Bash(git diff *)" "Read"`

**`--disallowedTools`**

- Tools removed from model's context and cannot be used
- Example: `claude --disallowedTools "Bash(git log *)" "Bash(git diff *)" "Edit"`

---

### Working Directory

**`--add-dir`**

- Add additional working directories for Claude to access
- Validates each path exists as directory
- Example: `claude --add-dir ../apps ../lib`

---

### MCP Configuration

**`--mcp-config`**

- Load MCP servers from JSON files or strings
- Space-separated
- Example: `claude --mcp-config ./mcp.json`

**`--strict-mcp-config`**

- Only use MCP servers from `--mcp-config`
- Ignore all other MCP configurations
- Example: `claude --strict-mcp-config --mcp-config ./mcp.json`

---

### Settings and Configuration

**`--settings`**

- Path to settings JSON file or JSON string
- Load additional settings
- Example: `claude --settings ./settings.json`

**`--setting-sources`**

- Comma-separated list of setting sources to load
- Options: `user`, `project`, `local`
- Example: `claude --setting-sources user,project`

---

### Plugins

**`--plugin-dir`**

- Load plugins from directories for this session only
- Repeatable
- Example: `claude --plugin-dir ./my-plugins`

**`--disable-slash-commands`**

- Disable all skills and slash commands for session
- Example: `claude --disable-slash-commands`

---

### Chrome Integration

**`--chrome`**

- Enable Chrome browser integration
- For web automation and testing
- Example: `claude --chrome`

**`--no-chrome`**

- Disable Chrome browser integration for session
- Example: `claude --no-chrome`

---

### IDE Integration

**`--ide`**

- Automatically connect to IDE on startup
- If exactly one valid IDE available
- Example: `claude --ide`

---

### Initialization and Maintenance

**`--init`**

- Run initialization hooks and start interactive mode
- Example: `claude --init`

**`--init-only`**

- Run initialization hooks and exit
- No interactive session
- Example: `claude --init-only`

**`--maintenance`**

- Run maintenance hooks and exit
- Example: `claude --maintenance`

---

### Output and Input Formats

**`--output-format`**

- Specify output format for print mode
- Options: `text`, `json`, `stream-json`
- Example: `claude -p "query" --output-format json`
- **Tip:** `json` format particularly useful for scripting and automation

**`--input-format`**

- Specify input format for print mode
- Options: `text`, `stream-json`
- Example: `claude -p --output-format json --input-format stream-json`

**`--include-partial-messages`**

- Include partial streaming events in output
- Requires `--print` and `--output-format=stream-json`
- Example: `claude -p --output-format stream-json --include-partial-messages "query"`

---

### Structured Output

**`--json-schema`**

- Get validated JSON output matching JSON Schema
- After agent completes workflow
- Print mode only
- See Agent SDK Structured Outputs documentation
- Example: `claude -p --json-schema '{"type":"object","properties":{...}}' "query"`

---

### Budget and Limits

**`--max-budget-usd`**

- Maximum dollar amount to spend on API calls before stopping
- Print mode only
- Example: `claude -p --max-budget-usd 5.00 "query"`

**`--max-turns`**

- Limit number of agentic turns
- Print mode only
- Exits with error when limit reached
- No limit by default
- Example: `claude -p --max-turns 3 "query"`

---

### Logging and Debugging

**`--verbose`**

- Enable verbose logging
- Shows full turn-by-turn output
- Helpful for debugging in print and interactive modes
- Example: `claude --verbose`

**`--debug`**

- Enable debug mode with optional category filtering
- Examples: `"api,hooks"` or `"!statsig,!file"`
- Example: `claude --debug "api,mcp"`

---

### Version

**`--version`, `-v`**

- Output version number
- Example: `claude -v`

---

## Agents Flag Format

The `--agents` flag accepts JSON object defining one or more custom subagents.

### Required Fields

| Field         | Required | Description                                    |
| :------------ | :------- | :--------------------------------------------- |
| `description` | Yes      | Natural language description of when to invoke |
| `prompt`      | Yes      | System prompt that guides subagent's behavior  |

### Optional Fields

| Field   | Required | Description                                                                                                            |
| :------ | :------- | :--------------------------------------------------------------------------------------------------------------------- |
| `tools` | No       | Array of specific tools subagent can use (e.g., `["Read", "Edit", "Bash"]`). If omitted, inherits all tools            |
| `model` | No       | Model alias: `sonnet`, `opus`, `haiku`, or `inherit`. If omitted, defaults to `inherit` (uses main conversation model) |

### Example: Multiple Subagents

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
  }
}'
```

**See:** Subagents documentation for creating and using subagents

---

## System Prompt Flags

Four flags for customizing system prompt, each serving different purpose.

### Flag Comparison

| Flag                          | Behavior                                    | Modes               | Use Case                                                             |
| :---------------------------- | :------------------------------------------ | :------------------ | :------------------------------------------------------------------- |
| `--system-prompt`             | **Replaces** entire default prompt          | Interactive + Print | Complete control over Claude's behavior and instructions             |
| `--system-prompt-file`        | **Replaces** with file contents             | Print only          | Load prompts from files for reproducibility and version control      |
| `--append-system-prompt`      | **Appends** to default prompt               | Interactive + Print | Add specific instructions while keeping default Claude Code behavior |
| `--append-system-prompt-file` | **Appends** file contents to default prompt | Print only          | Load additional instructions from files while keeping defaults       |

### When to Use Each

**`--system-prompt`** - Complete control over system prompt

**Use when:** Need complete control, removes all default Claude Code instructions

```bash
claude --system-prompt "You are a Python expert who only writes type-annotated code"
```

**`--system-prompt-file`** - Load custom prompt from file

**Use when:** Want team consistency or version-controlled prompt templates

```bash
claude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"
```

**`--append-system-prompt`** - Add instructions while keeping defaults

**Use when:** Want specific instructions while keeping Claude Code's default capabilities

**Recommended:** Safest option for most use cases

```bash
claude --append-system-prompt "Always use TypeScript and include JSDoc comments"
```

**`--append-system-prompt-file`** - Append from file while keeping defaults

**Use when:** Version-controlled additions while preserving defaults

```bash
claude -p --append-system-prompt-file ./prompts/style-rules.txt "Review this PR"
```

### Mutual Exclusivity

**`--system-prompt` and `--system-prompt-file`** are mutually exclusive.

**Append flags** can be used together with either replacement flag.

### Recommendation

**For most use cases:** Use `--append-system-prompt` or `--append-system-prompt-file`

**Why:** Preserve Claude Code's built-in capabilities while adding custom requirements

**Use replacement flags only when:** Need complete control over system prompt

---

## Usage Examples

### Basic Usage

**Start interactive session:**

```bash
claude
```

**Start with initial prompt:**

```bash
claude "explain this project"
```

**One-shot query (print mode):**

```bash
claude -p "explain this function"
```

**Process piped content:**

```bash
cat logs.txt | claude -p "explain these errors"
```

### Session Management

**Continue most recent conversation:**

```bash
claude -c
```

**Resume specific session:**

```bash
claude -r "auth-refactor"
```

**Resume session with new session ID:**

```bash
claude --resume abc123 --fork-session
```

**Resume from GitHub PR:**

```bash
claude --from-pr 123
```

### Permission Control

**Start in plan mode:**

```bash
claude --permission-mode plan
```

**Skip all permissions (use with caution):**

```bash
claude --dangerously-skip-permissions
```

**Allow bypass option with plan mode:**

```bash
claude --permission-mode plan --allow-dangerously-skip-permissions
```

### Tool Restrictions

**Limit to specific tools:**

```bash
claude --tools "Bash,Edit,Read"
```

**Allow specific commands without prompting:**

```bash
claude --allowedTools "Bash(git log *)" "Bash(git diff *)" "Read"
```

**Disallow specific tools:**

```bash
claude --disallowedTools "Edit" "Write"
```

### Custom System Prompts

**Replace entire system prompt:**

```bash
claude --system-prompt "You are a Python expert"
```

**Append to default prompt:**

```bash
claude --append-system-prompt "Always use TypeScript"
```

**Load prompt from file:**

```bash
claude -p --system-prompt-file ./prompts/custom.txt "query"
```

### Structured Output

**Get JSON output:**

```bash
claude -p "query" --output-format json
```

**Get validated JSON matching schema:**

```bash
claude -p --json-schema '{"type":"object","properties":{"result":{"type":"string"}}}' "query"
```

**Stream JSON with partial messages:**

```bash
claude -p --output-format stream-json --include-partial-messages "query"
```

### Budget and Limits

**Set maximum spend:**

```bash
claude -p --max-budget-usd 5.00 "analyze this codebase"
```

**Limit agentic turns:**

```bash
claude -p --max-turns 3 "fix this bug"
```

### Multiple Working Directories

**Add additional directories:**

```bash
claude --add-dir ../apps ../lib
```

### MCP Configuration

**Load MCP servers from file:**

```bash
claude --mcp-config ./mcp.json
```

**Strict MCP config (ignore others):**

```bash
claude --strict-mcp-config --mcp-config ./mcp.json
```

### Initialization and Maintenance

**Run initialization hooks:**

```bash
claude --init
```

**Run init hooks and exit:**

```bash
claude --init-only
```

**Run maintenance hooks:**

```bash
claude --maintenance
```

### Chrome Integration

**Enable Chrome automation:**

```bash
claude --chrome
```

**Disable Chrome for session:**

```bash
claude --no-chrome
```

### Custom Subagents

**Define subagents dynamically:**

```bash
claude --agents '{
  "reviewer": {
    "description": "Reviews code for quality",
    "prompt": "You are a code reviewer",
    "tools": ["Read", "Grep"],
    "model": "sonnet"
  }
}'
```

### Debugging

**Enable verbose logging:**

```bash
claude --verbose
```

**Enable debug mode with filtering:**

```bash
claude --debug "api,mcp"
```

**Exclude specific categories:**

```bash
claude --debug "!statsig,!file"
```

### Settings Override

**Load custom settings file:**

```bash
claude --settings ./custom-settings.json
```

**Specify setting sources:**

```bash
claude --setting-sources user,project
```

### Plugin Management

**Load plugins from directory:**

```bash
claude --plugin-dir ./my-plugins
```

**Disable all slash commands:**

```bash
claude --disable-slash-commands
```

---

## Best Practices

### 1. Use Append for System Prompts

✅ **DO:** Use `--append-system-prompt` to preserve built-in capabilities

```bash
claude --append-system-prompt "Use functional programming style"
```

❌ **DON'T:** Replace entire prompt unless necessary

```bash
# Removes all Claude Code's built-in instructions
claude --system-prompt "You are a coder"
```

### 2. Secure Permission Handling

✅ **DO:** Use permission modes for different workflows

```bash
claude --permission-mode plan  # For planning phase
```

❌ **DON'T:** Skip permissions unless in trusted environment

```bash
# Use with extreme caution
claude --dangerously-skip-permissions
```

### 3. Budget Controls in Automation

✅ **DO:** Set budget limits for automated tasks

```bash
claude -p --max-budget-usd 10.00 --max-turns 5 "analyze codebase"
```

❌ **DON'T:** Run unbounded automation in print mode

### 4. Structured Output for Scripting

✅ **DO:** Use JSON output for programmatic parsing

```bash
claude -p "query" --output-format json | jq '.result'
```

❌ **DON'T:** Parse text output for automation

### 5. Session Management

✅ **DO:** Use named sessions for better organization

```bash
claude -r "feature-auth" "continue working on authentication"
```

❌ **DON'T:** Rely only on session IDs

---

## Common Workflows

### Code Review Workflow

```bash
# Start with specific agent and custom prompt
claude --agent code-reviewer \
  --append-system-prompt "Focus on security and performance" \
  --tools "Read,Grep,Bash" \
  "Review changes in this PR"
```

### Automated Analysis

```bash
# Print mode with budget limit and structured output
claude -p \
  --max-budget-usd 5.00 \
  --max-turns 3 \
  --output-format json \
  "Analyze test coverage" > report.json
```

### Debugging Session

```bash
# Verbose logging with specific tools
claude --verbose \
  --debug "api,tools" \
  --tools "Read,Bash,Grep" \
  "Debug this error"
```

### Team Standardization

```bash
# Load team settings and prompt
claude --settings ./team-settings.json \
  --append-system-prompt-file ./team-prompts/style.txt \
  --setting-sources user,project
```

### Safe Exploration

```bash
# Plan mode with limited tools
claude --permission-mode plan \
  --tools "Read,Grep,Glob" \
  "Explore this codebase"
```

---

## Troubleshooting

### Command Not Recognized

**Issue:** `claude: command not found`

**Solutions:**

1. Check installation: `which claude`
2. Verify PATH: `echo $PATH`
3. Reinstall Claude Code
4. Restart terminal

### Permission Denied

**Issue:** Claude cannot access files/directories

**Solutions:**

1. Check file permissions
2. Use `--add-dir` for additional directories
3. Verify working directory

### Session Not Found

**Issue:** Cannot resume session

**Solutions:**

1. List sessions: `claude --resume` (interactive picker)
2. Check session ID format (must be UUID)
3. Verify session persistence not disabled

### MCP Server Errors

**Issue:** MCP servers not loading

**Solutions:**

1. Verify JSON format: `cat mcp.json | jq`
2. Check file path: `ls -la mcp.json`
3. Use `--debug "mcp"` for details
4. Try `--strict-mcp-config` to isolate

### Output Format Issues

**Issue:** Unexpected output format

**Solutions:**

1. Specify format: `--output-format json`
2. Check for errors in stderr
3. Use `--verbose` for details
4. Verify JSON schema if using `--json-schema`

---

## Related Resources

### In This Repository

**Claude Code:**

- `analytics.md` - Analytics and usage tracking
- `security.md` - Security best practices

**Related Features:**

- `docs/references/hooks/hooks-reference.md` - Hooks reference
- `docs/references/mcp/mcp-usage-claude-code.md` - MCP usage
- `docs/references/skills/skills-claude-code.md` - Skills reference

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)
- **Chrome Extension:** [code.claude.com/docs/en/chrome](https://code.claude.com/docs/en/chrome)
- **Interactive Mode:** [code.claude.com/docs/en/interactive-mode](https://code.claude.com/docs/en/interactive-mode)
- **Quickstart:** [code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart)
- **Common Workflows:** [code.claude.com/docs/en/common-workflows](https://code.claude.com/docs/en/common-workflows)
- **Settings:** [code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)
- **Agent SDK:** [docs.claude.com/en/docs/agent-sdk](https://docs.claude.com/en/docs/agent-sdk)
- **Subagents:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)

---

**Last Updated:** January 2026
**Category:** CLI Reference
**Status:** Official Claude Code Feature
**Type:** Command-Line Interface
