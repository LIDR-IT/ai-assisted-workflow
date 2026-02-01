# Claude Code MCP Setup Guide

## Overview

Claude Code provides native integration with the Model Context Protocol (MCP), enabling seamless connection to external tools, databases, and APIs. This guide covers installation, configuration, and management of MCP servers in Claude Code.

**Official Documentation:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)

### What You Can Do with MCP in Claude Code

With MCP servers connected, you can ask Claude Code to:

- **Implement features:** "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub"
- **Analyze data:** "Check Sentry and Statsig for usage of feature ENG-4521"
- **Query databases:** "Find emails of 10 random users who used feature ENG-4521 from PostgreSQL"
- **Integrate designs:** "Update our email template based on new Figma designs posted in Slack"
- **Automate workflows:** "Create Gmail drafts inviting these 10 users to a feedback session"

### Key Benefits

- **Hundreds of integrations:** Access GitHub, Sentry, PostgreSQL, Notion, and more
- **Multiple transport types:** HTTP, SSE, and stdio support
- **Flexible scoping:** Local, project, and user-level configurations
- **OAuth authentication:** Secure connection to cloud services
- **Dynamic updates:** Servers can update tools without reconnecting

---

## Installation Methods

Claude Code supports three transport types for MCP servers, each optimized for different use cases.

### Transport Type Comparison

| Transport | Best For | Connection Type | Authentication |
|-----------|----------|-----------------|----------------|
| **HTTP** | Cloud services, APIs | Remote | OAuth 2.0, headers |
| **SSE** | Legacy servers | Remote | Headers |
| **stdio** | Local tools, scripts | Local process | Environment vars |

### Method 1: HTTP Servers (Recommended)

HTTP servers are the recommended transport for cloud-based services and APIs.

**Basic syntax:**
```bash
claude mcp add --transport http <name> <url>
```

**Simple installation:**
```bash
# Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Connect to GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Connect to Sentry
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**With authentication headers:**
```bash
# Add Bearer token authentication
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token-here"

# Add custom API key header
claude mcp add --transport http custom-api https://api.company.com/mcp \
  --header "X-API-Key: your-api-key"

# Multiple headers
claude mcp add --transport http multi-auth https://api.example.com/mcp \
  --header "Authorization: Bearer token" \
  --header "X-Custom-Header: value"
```

**With environment variables:**
```bash
# Use environment variable for token
claude mcp add --transport http weather https://api.weather.com/mcp \
  --header "Authorization: Bearer ${WEATHER_API_KEY}"
```

### Method 2: SSE Servers (Deprecated)

Server-Sent Events transport is deprecated. Use HTTP servers instead.

**Basic syntax:**
```bash
claude mcp add --transport sse <name> <url>
```

**Examples:**
```bash
# Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# With authentication
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### Method 3: Stdio Servers

Stdio servers run as local processes, ideal for tools requiring direct system access.

**Basic syntax:**
```bash
claude mcp add [options] <name> -- <command> [args...]
```

**Important: The `--` separator**

All Claude Code options (`--transport`, `--env`, `--scope`) must come BEFORE the server name.

The `--` (double dash) separates the server name from the command and arguments.

**Examples:**

```bash
# NPM package server
claude mcp add --transport stdio airtable -- npx -y airtable-mcp-server

# With environment variables
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server

# Python script server
claude mcp add --transport stdio custom-tool \
  -- python /path/to/server.py --port 8080

# Node.js server with multiple arguments
claude mcp add --transport stdio myserver \
  --env DB_URL=postgresql://localhost/mydb \
  -- node /usr/local/bin/server.js --verbose --config config.json

# Filesystem server
claude mcp add --transport stdio filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem /Users/username/projects
```

**Why the `--` separator?**

Without `--`, Claude Code can't distinguish between its flags and the server's flags:

```bash
# Ambiguous - whose --port flag?
claude mcp add --transport stdio server --port 8080 npx server

# Clear - Claude knows npx and its args are the command
claude mcp add --transport stdio server -- npx server --port 8080
```

### Windows-Specific Setup

On native Windows (not WSL), stdio servers using `npx` require the `cmd /c` wrapper.

**Why?** Windows needs an explicit shell to execute `npx`.

**Windows installation:**
```bash
# Correct for Windows
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package

# With environment variables
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- cmd /c npx -y airtable-mcp-server

# With arguments
claude mcp add --transport stdio filesystem \
  -- cmd /c npx -y @modelcontextprotocol/server-filesystem C:\Users\username\projects
```

**Error without `cmd /c`:**
```
Error: Connection closed
spawn npx ENOENT
```

**This generates:**
```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@some/package"]
}
```

---

## Server Management Commands

### List All Configured Servers

View all MCP servers configured across all scopes:

```bash
claude mcp list
```

**Example output:**
```
MCP Servers:
  github (user scope) - HTTP server at https://api.githubcopilot.com/mcp/
  sentry (project scope) - HTTP server at https://mcp.sentry.dev/mcp
  filesystem (local scope) - stdio: npx -y @modelcontextprotocol/server-filesystem
```

### Get Server Details

View detailed configuration for a specific server:

```bash
claude mcp get <server-name>
```

**Example:**
```bash
claude mcp get github
```

**Output:**
```json
{
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "scope": "user",
  "headers": {}
}
```

### Remove Server

Remove an MCP server from configuration:

```bash
claude mcp remove <server-name>
```

**Example:**
```bash
claude mcp remove github
```

### Check Server Status

Within Claude Code, use the `/mcp` command to see server status:

```
/mcp
```

This shows:
- Connected servers
- Authentication status
- Available tools and resources
- Connection errors (if any)

---

## Installation Scopes

MCP servers can be configured at three scope levels, each serving different use cases.

### Scope Comparison

| Scope | Storage Location | Applies To | Use Cases |
|-------|-----------------|------------|-----------|
| **Local** | `~/.claude.json` (home dir) | You, current project only | Personal dev servers, experiments, sensitive credentials |
| **Project** | `.mcp.json` (project root) | All team members | Team-shared servers, project-specific tools |
| **User** | `~/.claude.json` (home dir) | You, all projects | Personal utilities, dev tools, cross-project services |

### Local Scope (Default)

**Storage:** `~/.claude.json` under your project's path

**Applies to:** You only, within current project

**Add local-scoped server:**
```bash
# Default scope is local
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

**Use for:**
- Personal development servers
- Experimental configurations
- Sensitive credentials not to be shared
- Project-specific overrides

**Important note:** MCP "local scope" differs from general local settings:
- **MCP local-scoped servers:** `~/.claude.json` (home directory)
- **General local settings:** `.claude/settings.local.json` (project directory)

### Project Scope

**Storage:** `.mcp.json` at project root (committed to version control)

**Applies to:** All team members in the project

**Add project-scoped server:**
```bash
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

**Resulting `.mcp.json` format:**
```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

**Security:** Claude Code prompts for approval before using project-scoped servers.

**Reset approvals:**
```bash
claude mcp reset-project-choices
```

**Use for:**
- Team-shared servers
- Project-specific tools (GitHub repo, project database)
- Collaboration services (Slack workspace, Notion workspace)
- Standardized development tools

### User Scope

**Storage:** `~/.claude.json` (global configuration)

**Applies to:** You, across all projects

**Add user-scoped server:**
```bash
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

**Use for:**
- Personal utility servers
- Development tools used everywhere
- Services used across multiple projects
- Personal API integrations

### Scope Priority

When servers with the same name exist at multiple scopes:

**Precedence:** Local > Project > User

Personal configurations override shared ones.

**Example:**
```bash
# User scope (global)
claude mcp add --transport http github --scope user https://api.githubcopilot.com/mcp/

# Project scope (overrides user for this project)
claude mcp add --transport http github --scope project https://enterprise.github.com/mcp/

# Local scope (overrides both for this project)
claude mcp add --transport http github --scope local https://localhost:8080/mcp/
```

Result: Local scope wins.

---

## Quick Start Examples

### Example 1: Connect to GitHub

```bash
# 1. Install GitHub MCP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Start Claude Code
claude

# 3. Authenticate (in Claude Code)
> /mcp

# 4. Use GitHub integration
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
> "Show me all open PRs assigned to me"
```

### Example 2: Monitor Errors with Sentry

```bash
# 1. Install Sentry MCP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Start Claude Code
claude

# 3. Authenticate
> /mcp

# 4. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### Example 3: Query PostgreSQL Database

```bash
# 1. Install database server with connection string
claude mcp add --transport stdio db \
  --env DB_URL=postgresql://readonly:pass@prod.db.com:5432/analytics \
  -- npx -y @bytebase/dbhub

# 2. Start Claude Code
claude

# 3. Query naturally
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't made a purchase in 90 days"
```

### Example 4: File System Access

```bash
# 1. Install filesystem server for specific directory
claude mcp add --transport stdio filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem /Users/username/projects

# 2. Start Claude Code
claude

# 3. Work with files
> "List all TypeScript files in the projects directory"
> "Read the contents of README.md in the main project"
> "Create a new directory called 'archives' and move old files there"
```

### Example 5: Airtable Integration

```bash
# 1. Install Airtable server with API key
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=your_key_here \
  -- npx -y airtable-mcp-server

# 2. Start Claude Code
claude

# 3. Query Airtable
> "Show me all records from the Tasks base"
> "Create a new record in the Contacts table"
> "Update the status of record rec123 to 'Complete'"
```

---

## Authentication

Many cloud-based MCP servers require authentication. Claude Code supports OAuth 2.0 and header-based authentication.

### OAuth 2.0 Authentication

**Step 1: Add server that requires authentication**
```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Step 2: Start Claude Code and use `/mcp` command**
```bash
claude
```

```
> /mcp
```

**Step 3: Follow browser prompts**

Claude Code will:
1. Display authentication URL
2. Open browser automatically (or provide URL to copy)
3. Guide you through OAuth flow
4. Store tokens securely

**Step 4: Verify authentication**

In the `/mcp` interface, you'll see:
- Green indicator for authenticated servers
- Available tools and resources
- Last connection time

### Header-Based Authentication

For API keys and bearer tokens:

```bash
# Bearer token
claude mcp add --transport http api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"

# API key
claude mcp add --transport http weather https://api.weather.com/mcp \
  --header "X-API-Key: your-api-key"

# Multiple headers
claude mcp add --transport http multi https://api.example.com/mcp \
  --header "Authorization: Bearer token" \
  --header "X-Custom-Header: value"
```

### Environment Variables for Stdio Servers

Pass sensitive credentials as environment variables:

```bash
# Single environment variable
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=your_key \
  -- npx -y airtable-mcp-server

# Multiple environment variables
claude mcp add --transport stdio db \
  --env DB_HOST=localhost \
  --env DB_PORT=5432 \
  --env DB_PASSWORD=secret \
  -- python db-server.py
```

### Authentication Tips

- **Tokens stored securely:** OAuth tokens encrypted and auto-refreshed
- **Clear authentication:** Use "Clear authentication" in `/mcp` menu to log out
- **Browser doesn't open?** Copy the provided URL manually
- **OAuth only works:** With HTTP servers (not stdio or SSE)
- **Environment variables:** Use `${VAR}` syntax for variable expansion in configs

---

## Advanced Configuration

### Environment Variable Expansion

Claude Code supports environment variable expansion in `.mcp.json` files.

**Supported syntax:**
- `${VAR}` - Expands to value of `VAR`
- `${VAR:-default}` - Expands to `VAR` if set, otherwise `default`

**Expansion locations:**
- `command` - Server executable path
- `args` - Command-line arguments
- `env` - Environment variables passed to server
- `url` - For HTTP server types
- `headers` - For HTTP server authentication

**Example with variable expansion:**
```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    },
    "local-tool": {
      "type": "stdio",
      "command": "${HOME}/bin/mcp-server",
      "args": ["--config", "${CONFIG_PATH:-/etc/mcp/config.json}"],
      "env": {
        "CACHE_DIR": "${TMPDIR:-/tmp}/mcp-cache"
      }
    }
  }
}
```

**Error handling:** If required variable is not set and has no default, Claude Code fails to parse config with a clear error message.

### Adding Servers from JSON

Add servers directly from JSON configuration for complex setups:

**Basic syntax:**
```bash
claude mcp add-json <name> '<json>'
```

**HTTP server example:**
```bash
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'
```

**Stdio server example:**
```bash
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

**With scope:**
```bash
claude mcp add-json --scope user my-server '{"type":"http","url":"https://api.example.com"}'
```

**Tips:**
- Properly escape JSON in your shell
- JSON must conform to MCP server configuration schema
- Useful for scripted deployments
- Can include complex nested configurations

### Import from Claude Desktop

Transfer existing Claude Desktop MCP servers to Claude Code:

**Step 1: Import servers**
```bash
claude mcp add-from-claude-desktop
```

**Step 2: Select servers interactively**

Interactive dialog shows available servers and lets you choose which to import.

**Step 3: Verify import**
```bash
claude mcp list
```

**Import options:**
```bash
# Import to user scope
claude mcp add-from-claude-desktop --scope user

# Import to project scope
claude mcp add-from-claude-desktop --scope project
```

**Platform support:**
- macOS: Reads from `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows/WSL: Reads from AppData location

**Import behavior:**
- Servers keep their Claude Desktop names
- Name conflicts get numerical suffix (e.g., `server_1`)
- Configurations preserved exactly
- Authentication may need to be redone

---

## Timeout and Output Configuration

### MCP Server Timeout

Configure how long Claude Code waits for MCP servers to start:

```bash
# Set 10-second timeout (default is 5 seconds)
MCP_TIMEOUT=10000 claude
```

Use for:
- Slow-starting servers
- Servers with complex initialization
- Network-dependent servers

### Output Token Limit

Configure maximum tokens for MCP tool outputs:

**Default limits:**
- Warning threshold: 10,000 tokens
- Default maximum: 25,000 tokens

**Increase limit:**
```bash
# Set 50,000 token limit
MAX_MCP_OUTPUT_TOKENS=50000 claude
```

**Or in settings.json:**
```json
{
  "env": {
    "MAX_MCP_OUTPUT_TOKENS": "50000"
  }
}
```

**Use cases:**
- Query large datasets or databases
- Generate detailed reports or documentation
- Process extensive log files
- Debug information aggregation

**Warning:** If you frequently encounter output warnings, consider:
- Increasing the limit
- Configuring server to paginate responses
- Filtering results server-side

---

## Using MCP Resources

MCP servers can expose resources referenceable with @ mentions, similar to files.

### Discovering Resources

**Step 1: Type `@` in prompt**

This shows resources from all connected MCP servers alongside files.

**Step 2: Browse or search**

Resources are fuzzy-searchable in the autocomplete menu.

### Reference Syntax

Use format `@server:protocol://resource/path`:

**GitHub issues:**
```
> Can you analyze @github:issue://123 and suggest a fix?
```

**Documentation resources:**
```
> Please review the API documentation at @docs:file://api/authentication
```

**Database schemas:**
```
> Compare @postgres:schema://users with @docs:file://database/user-model
```

**Multiple resources:**
```
> Compare @postgres:schema://users with @postgres:schema://orders and identify the relationship
```

### Resource Tips

- **Automatic fetching:** Resources fetched and included as attachments automatically
- **Fuzzy search:** Resource paths are fuzzy-searchable in autocomplete
- **Automatic tools:** Claude Code provides tools to list and read MCP resources
- **Any content type:** Text, JSON, structured data, images, etc.
- **Streaming support:** Large resources loaded efficiently

---

## MCP Prompts as Commands

MCP servers can expose prompts that become slash commands.

### Using MCP Prompts

**Discover available prompts:**

Type `/` to see all commands, including MCP prompts.

Format: `/mcp__servername__promptname`

**Execute without arguments:**
```
> /mcp__github__list_prs
```

**Execute with arguments:**
```
> /mcp__github__pr_review 456

> /mcp__jira__create_issue "Bug in login flow" high

> /mcp__sentry__analyze_error abc123 --last-24h
```

### MCP Prompt Tips

- **Dynamic discovery:** Prompts discovered from connected servers automatically
- **Argument parsing:** Based on prompt's defined parameters
- **Direct injection:** Prompt results injected into conversation context
- **Normalized names:** Spaces become underscores in command names
- **Tab completion:** MCP prompt commands appear in autocomplete

---

## Tool Search

When you have many MCP servers, tool definitions can consume significant context. Tool Search solves this by dynamically loading tools on-demand.

### How It Works

**Automatic activation:** When MCP tool descriptions exceed 10% of context window

**Process:**
1. MCP tools deferred instead of preloaded
2. Claude uses search tool to discover relevant MCP tools when needed
3. Only needed tools loaded into context
4. MCP tools continue working as before

### Configuration

**Default:** Auto mode (activates when tools exceed threshold)

**Model support:** Requires models with `tool_reference` blocks:
- Sonnet 4 and later
- Opus 4 and later
- Not supported: Haiku models

**Control with environment variable:**

```bash
# Use custom 5% threshold
ENABLE_TOOL_SEARCH=auto:5 claude

# Always enable
ENABLE_TOOL_SEARCH=true claude

# Disable entirely
ENABLE_TOOL_SEARCH=false claude
```

**Options:**

| Value | Behavior |
|-------|----------|
| `auto` | Activates when tools exceed 10% of context (default) |
| `auto:N` | Activates at custom threshold (e.g., `auto:5` for 5%) |
| `true` | Always enabled |
| `false` | Disabled, all MCP tools loaded upfront |

**Or in settings.json:**
```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:5"
  }
}
```

### For MCP Server Authors

Server instructions become more important with Tool Search:

**Add clear instructions explaining:**
- What category of tasks your tools handle
- When Claude should search for your tools
- Key capabilities your server provides

Similar to how skills work in Claude Code.

---

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications.

**Benefit:** MCP servers can dynamically update available tools, prompts, and resources without reconnecting.

**How it works:**
1. Server sends `list_changed` notification
2. Claude Code automatically refreshes capabilities
3. New tools/prompts/resources immediately available
4. No manual reconnection needed

**Use cases:**
- Servers that discover tools dynamically
- Context-aware tool availability
- Real-time capability updates
- Plugin-based server architectures

---

## Using Claude Code as MCP Server

Claude Code can act as an MCP server for other applications like Claude Desktop.

### Start Claude as MCP Server

```bash
# Start Claude Code as stdio MCP server
claude mcp serve
```

This exposes Claude Code's tools (View, Edit, LS, etc.) via MCP protocol.

### Configure in Claude Desktop

**Step 1: Find Claude Code executable path**
```bash
which claude
```

**Step 2: Add to `claude_desktop_config.json`**

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "/full/path/to/claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

**Important: Use full path**

```bash
# Find full path first
which claude
# Output: /usr/local/bin/claude

# Use in config
"command": "/usr/local/bin/claude"
```

Without correct path, you'll see: `Error: spawn claude ENOENT`

### What This Enables

In Claude Desktop, you can now:
- "Read the file `/path/to/file.txt`" (uses Claude Code's View tool)
- "Edit `config.json` and update the API URL" (uses Claude Code's Edit tool)
- "List all Python files in the project" (uses Claude Code's LS tool)

**Note:** Only exposes Claude Code's tools. Client (Claude Desktop) is responsible for user confirmation of file operations.

---

## Troubleshooting

### Common Issues

**Issue: "Connection closed" error on Windows**

**Solution:** Use `cmd /c` wrapper for npx commands:
```bash
claude mcp add --transport stdio server -- cmd /c npx -y package
```

**Issue: Server not appearing in `/mcp` list**

**Solutions:**
1. Check server was added: `claude mcp list`
2. Verify syntax: `claude mcp get server-name`
3. Restart Claude Code
4. Check for startup errors in `/mcp` interface

**Issue: Authentication fails for HTTP server**

**Solutions:**
1. Clear authentication: Use `/mcp` → "Clear authentication"
2. Re-authenticate: Use `/mcp` → Follow OAuth flow
3. Check server URL is correct
4. Verify network connectivity

**Issue: Environment variables not expanding**

**Solutions:**
1. Verify variable is set: `echo $VAR_NAME`
2. Use default syntax: `${VAR:-default}`
3. Check syntax in `.mcp.json`
4. Export variable before starting Claude: `export VAR=value && claude`

**Issue: Stdio server won't start**

**Solutions:**
1. Test command manually: Run the command directly in terminal
2. Check command path is correct
3. Verify permissions: `chmod +x /path/to/command`
4. Increase timeout: `MCP_TIMEOUT=10000 claude`
5. Check server logs for errors

**Issue: Tool outputs truncated**

**Solutions:**
1. Increase output limit: `MAX_MCP_OUTPUT_TOKENS=50000 claude`
2. Configure server to paginate results
3. Filter server responses server-side

### Debugging Tips

**View detailed MCP status:**
```
> /mcp
```

Shows:
- Connected servers
- Authentication status
- Available tools count
- Connection errors
- Last activity time

**Test server configuration:**
```bash
# View server details
claude mcp get server-name

# Check JSON validity
cat .mcp.json | jq .
```

**Check environment variables:**
```bash
# Before starting Claude
echo $AIRTABLE_API_KEY
echo $DB_URL

# Test variable expansion
cat .mcp.json | jq '.mcpServers.myserver.env'
```

**Test server command manually:**
```bash
# For stdio servers, test command directly
npx -y airtable-mcp-server
python /path/to/server.py
```

---

## Best Practices

### Security

- **Never commit API keys:** Use environment variables in project-scoped configs
- **Review third-party servers:** Understand what data they access
- **Use read-only credentials:** For database connections when possible
- **Prompt injection awareness:** Be careful with servers fetching untrusted content
- **Scope appropriately:** Use local scope for sensitive credentials

### Performance

- **Use HTTP over stdio:** For cloud services (faster, more reliable)
- **Enable Tool Search:** For many MCP servers (saves context)
- **Set appropriate timeouts:** Balance startup time vs connection reliability
- **Configure output limits:** Prevent token exhaustion from large responses

### Organization

- **User scope:** Personal utilities, development tools
- **Project scope:** Team-shared servers, project-specific tools
- **Local scope:** Experiments, personal overrides, sensitive configs
- **Naming convention:** Use descriptive server names (`github`, `prod-db`, `staging-api`)

### Team Collaboration

- **Commit `.mcp.json`:** Share project-scoped servers with team
- **Use environment variables:** Keep credentials out of version control
- **Document setup:** Include MCP setup in project README
- **Standardize servers:** Use same names across team projects

---

## Next Steps

Now that you understand Claude Code MCP setup, explore:

- **MCP Server Registry:** [Browse available servers](https://github.com/modelcontextprotocol/servers)
- **Build Your Own:** [MCP SDK Quickstart](https://modelcontextprotocol.io/quickstart/server)
- **Advanced Integration:** [Plugin-Provided MCP Servers](../../05-advanced/plugin-integration.md)
- **Platform Comparison:** [Compare MCP implementations](../../01-fundamentals/platform-comparison.md)

---

**Related Documentation:**
- [MCP Introduction](../../01-fundamentals/introduction.md)
- [Authentication Guide](../../02-using-mcp/authentication/oauth.md)
- [Building MCP Servers](../../03-creating-servers/quickstart.md)
- [Managed MCP Configuration](../../05-advanced/managed-configuration.md)

---

**Last Updated:** February 2026
**Platform Version:** Claude Code v1.x
**Standard:** Model Context Protocol (Open Source)
