# Using MCP in Claude Code

## Overview

Claude Code connects to external tools and data sources through the **Model Context Protocol (MCP)**, an open source standard for AI-tool integrations. MCP servers give Claude Code access to your tools, databases, and APIs.

**Official Documentation:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)

**Key Benefit:** "Connect Claude Code to hundreds of external tools and data sources through MCP servers."

---

## What You Can Do with MCP

With MCP servers connected, you can ask Claude Code to:

### Feature Implementation
- **From issue trackers:** "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."

### Data Analysis
- **Monitoring data:** "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."

### Database Operations
- **Query databases:** "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database."

### Design Integration
- **Integrate designs:** "Update our standard email template based on the new Figma designs that were posted in Slack"

### Workflow Automation
- **Automate workflows:** "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."

---

## Installing MCP Servers

MCP servers can be configured in **three different ways** depending on transport type:

### Option 1: Add Remote HTTP Server (Recommended)

HTTP servers are the recommended transport for cloud-based services.

**Basic syntax:**
```bash
claude mcp add --transport http <name> <url>
```

**Examples:**

```bash
# Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# With Bearer token authentication
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Option 2: Add Remote SSE Server (Deprecated)

**Warning:** SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead.

**Basic syntax:**
```bash
claude mcp add --transport sse <name> <url>
```

**Examples:**

```bash
# Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# With authentication header
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### Option 3: Add Local Stdio Server

Stdio servers run as local processes. Ideal for tools needing direct system access or custom scripts.

**Basic syntax:**
```bash
claude mcp add [options] <name> -- <command> [args...]
```

**Example:**

```bash
# Add Airtable server
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

**Important: Option Ordering**

All options (`--transport`, `--env`, `--scope`, `--header`) must come **before** the server name.

The `--` (double dash) separates the server name from the command and arguments.

**Examples:**
- `claude mcp add --transport stdio myserver -- npx server` → runs `npx server`
- `claude mcp add --transport stdio --env KEY=value myserver -- python server.py --port 8080` → runs `python server.py --port 8080` with `KEY=value`

This prevents conflicts between Claude's flags and the server's flags.

**Windows Users:**

On native Windows (not WSL), local MCP servers using `npx` require the `cmd /c` wrapper:

```bash
# Creates command="cmd" which Windows can execute
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

Without `cmd /c`, you'll encounter "Connection closed" errors.

---

## Managing MCP Servers

### List All Servers

```bash
claude mcp list
```

### Get Server Details

```bash
claude mcp get github
```

### Remove Server

```bash
claude mcp remove github
```

### Check Server Status (Within Claude Code)

```
/mcp
```

---

## MCP Installation Scopes

MCP servers can be configured at **three scope levels**:

### Local Scope (Default)

**Storage:** `~/.claude.json` under your project's path

**Applies to:** You only, within current project

**Use for:**
- Personal development servers
- Experimental configurations
- Sensitive credentials not to be shared

**Commands:**

```bash
# Add local-scoped server (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

**Note:** MCP "local scope" differs from general local settings:
- MCP local-scoped servers: `~/.claude.json` (home directory)
- General local settings: `.claude/settings.local.json` (project directory)

### Project Scope

**Storage:** `.mcp.json` at project root (checked into version control)

**Applies to:** All team members in the project

**Use for:**
- Team-shared servers
- Project-specific tools
- Collaboration services

**Commands:**

```bash
# Add project-scoped server
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

### User Scope

**Storage:** `~/.claude.json`

**Applies to:** You, across all projects

**Use for:**
- Personal utility servers
- Development tools
- Services used across multiple projects

**Commands:**

```bash
# Add user-scoped server
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### Scope Priority

When servers with same name exist at multiple scopes:

**Precedence:** Local > Project > User

Personal configurations override shared ones.

---

## Environment Variable Expansion

Claude Code supports environment variable expansion in `.mcp.json` files.

**Benefits:**
- Share configurations while maintaining flexibility
- Machine-specific paths
- Sensitive values (API keys)

### Supported Syntax

- `${VAR}` - Expands to value of `VAR`
- `${VAR:-default}` - Expands to `VAR` if set, otherwise `default`

### Expansion Locations

Variables can be expanded in:
- `command` - Server executable path
- `args` - Command-line arguments
- `env` - Environment variables passed to server
- `url` - For HTTP server types
- `headers` - For HTTP server authentication

### Example with Variable Expansion

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

**Error handling:** If required variable is not set and has no default, Claude Code fails to parse config.

---

## Authentication with Remote MCP Servers

Many cloud-based MCP servers require authentication. Claude Code supports OAuth 2.0.

### Authentication Steps

**Step 1: Add server that requires authentication**

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Step 2: Use `/mcp` command within Claude Code**

```
> /mcp
```

Then follow browser steps to login.

### Authentication Tips

- **Tokens stored securely** and refreshed automatically
- **Clear authentication** via "Clear authentication" in `/mcp` menu
- **Browser doesn't open?** Copy the provided URL
- **OAuth works** with HTTP servers

---

## Add MCP Servers from JSON

Add servers directly from JSON configuration.

### Basic Syntax

```bash
claude mcp add-json <name> '<json>'
```

### Examples

**HTTP server with JSON:**

```bash
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'
```

**Stdio server with JSON:**

```bash
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

### Tips

- Properly escape JSON in your shell
- JSON must conform to MCP server configuration schema
- Use `--scope user` to add to user configuration

---

## Import MCP Servers from Claude Desktop

Import existing Claude Desktop MCP servers.

### Import Steps

**Step 1: Import servers**

```bash
claude mcp add-from-claude-desktop
```

**Step 2: Select servers**

Interactive dialog allows selecting which servers to import.

**Step 3: Verify import**

```bash
claude mcp list
```

### Import Tips

- **Platform support:** macOS and Windows Subsystem for Linux (WSL) only
- **Reads from:** Claude Desktop configuration file standard location
- **Use `--scope user`** to add to user configuration
- **Same names:** Servers keep Claude Desktop names
- **Name conflicts:** Get numerical suffix (e.g., `server_1`)

---

## Plugin-Provided MCP Servers

Plugins can bundle MCP servers, automatically providing tools when enabled.

### How Plugin MCP Servers Work

- **Definition:** Plugins define MCP servers in `.mcp.json` at plugin root or inline in `plugin.json`
- **Automatic start:** MCP servers start when plugin is enabled
- **Tool appearance:** Plugin MCP tools appear alongside manually configured tools
- **Management:** Through plugin installation (not `/mcp` commands)

### Example Plugin MCP Configuration

**In `.mcp.json` at plugin root:**

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

**Or inline in `plugin.json`:**

```json
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

### Plugin MCP Features

- **Automatic lifecycle:** Servers start when plugin enables (requires Claude Code restart to apply changes)
- **Environment variables:** Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths
- **User environment access:** Access same environment variables as manual servers
- **Multiple transports:** Support stdio, SSE, HTTP (varies by server)

### Viewing Plugin MCP Servers

```bash
# Within Claude Code
/mcp
```

Plugin servers appear with indicators showing they're from plugins.

### Benefits

- **Bundled distribution:** Tools and servers packaged together
- **Automatic setup:** No manual MCP configuration needed
- **Team consistency:** Everyone gets same tools with plugin

**See:** Plugin components reference for bundling MCP servers with plugins

---

## Dynamic Tool Updates

Claude Code supports MCP `list_changed` notifications.

**Benefit:** MCP servers can dynamically update available tools, prompts, and resources without reconnecting.

**How it works:** When MCP server sends `list_changed` notification, Claude Code automatically refreshes capabilities.

---

## MCP Output Limits

Claude Code manages token usage for large MCP tool outputs.

### Output Limits

- **Warning threshold:** 10,000 tokens
- **Default maximum:** 25,000 tokens
- **Configurable:** Via `MAX_MCP_OUTPUT_TOKENS` environment variable

### Increase Output Limit

```bash
# Set higher limit for MCP tool outputs
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

### Use Cases

Useful for MCP servers that:
- Query large datasets or databases
- Generate detailed reports or documentation
- Process extensive log files or debugging information

**Warning:** If you frequently encounter output warnings, consider increasing limit or configuring server to paginate/filter responses.

---

## MCP Resources

MCP servers can expose resources referenceable with @ mentions.

### Using MCP Resources

**Step 1: List available resources**

Type `@` in prompt to see resources from all connected MCP servers.

Resources appear alongside files in autocomplete menu.

**Step 2: Reference specific resource**

Use format `@server:protocol://resource/path`:

```
> Can you analyze @github:issue://123 and suggest a fix?
```

```
> Please review the API documentation at @docs:file://api/authentication
```

**Step 3: Multiple resource references**

```
> Compare @postgres:schema://users with @docs:file://database/user-model
```

### Resource Tips

- **Automatic fetching:** Resources fetched and included as attachments
- **Fuzzy search:** Resource paths are fuzzy-searchable in @ autocomplete
- **Automatic tools:** Claude Code provides tools to list and read MCP resources
- **Any content type:** Text, JSON, structured data, etc.

---

## MCP Tool Search

When you have many MCP servers, tool definitions can consume significant context. Tool Search solves this by dynamically loading tools on-demand.

### How Tool Search Works

**Automatic activation:** When MCP tool descriptions exceed 10% of context window

**Process:**
1. MCP tools deferred instead of preloaded
2. Claude uses search tool to discover relevant MCP tools when needed
3. Only needed tools loaded into context
4. MCP tools continue working as before

### For MCP Server Authors

**Server instructions** become more useful with Tool Search.

**Add clear instructions explaining:**
- What category of tasks your tools handle
- When Claude should search for your tools
- Key capabilities your server provides

Similar to how skills work.

### Configure Tool Search

**Default:** Auto mode (activates when tools exceed threshold)

**Model support:** Requires models with `tool_reference` blocks:
- Sonnet 4 and later
- Opus 4 and later
- Not supported: Haiku models

### Control with Environment Variable

`ENABLE_TOOL_SEARCH` options:

| Value      | Behavior                                                    |
|:-----------|:------------------------------------------------------------|
| `auto`     | Activates when tools exceed 10% of context (default)        |
| `auto:<N>` | Activates at custom threshold (e.g., `auto:5` for 5%)       |
| `true`     | Always enabled                                              |
| `false`    | Disabled, all MCP tools loaded upfront                      |

**Examples:**

```bash
# Use custom 5% threshold
ENABLE_TOOL_SEARCH=auto:5 claude

# Disable tool search entirely
ENABLE_TOOL_SEARCH=false claude
```

**Or set in settings.json `env` field.**

### Disable MCPSearch Tool

```json
{
  "permissions": {
    "deny": ["MCPSearch"]
  }
}
```

---

## MCP Prompts as Commands

MCP servers can expose prompts that become available as commands.

### Using MCP Prompts

**Step 1: Discover available prompts**

Type `/` to see all commands, including MCP prompts.

Format: `/mcp__servername__promptname`

**Step 2: Execute prompt without arguments**

```
> /mcp__github__list_prs
```

**Step 3: Execute prompt with arguments**

```
> /mcp__github__pr_review 456
```

```
> /mcp__jira__create_issue "Bug in login flow" high
```

### MCP Prompt Tips

- **Dynamic discovery:** Prompts discovered from connected servers
- **Argument parsing:** Based on prompt's defined parameters
- **Direct injection:** Prompt results injected into conversation
- **Normalized names:** Spaces become underscores

---

## Use Claude Code as MCP Server

Claude Code can act as an MCP server for other applications.

### Start Claude as MCP Server

```bash
# Start Claude as stdio MCP server
claude mcp serve
```

### Configure in Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

**Important: Executable Path**

The `command` field must reference Claude Code executable.

**Find full path:**

```bash
which claude
```

**Use full path if not in PATH:**

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

Without correct path: Error `spawn claude ENOENT`

### MCP Server Features

- **Provides access** to Claude's tools (View, Edit, LS, etc.)
- **In Claude Desktop:** Ask Claude to read files, make edits, etc.
- **Note:** Only exposes Claude Code's tools; client responsible for user confirmation

---

## Managed MCP Configuration

For organizations needing centralized control over MCP servers.

### Two Configuration Options

**Option 1: Exclusive control with `managed-mcp.json`**
- Deploy fixed set of MCP servers
- Users cannot modify or extend

**Option 2: Policy-based control with allowlists/denylists**
- Allow users to add servers
- Restrict which ones are permitted

### Benefits for IT Administrators

- **Control access:** Deploy standardized approved MCP servers
- **Prevent unauthorized:** Restrict unapproved MCP servers
- **Disable MCP:** Remove MCP functionality if needed

---

## Option 1: Exclusive Control with managed-mcp.json

When deployed, `managed-mcp.json` takes **exclusive control** over all MCP servers.

**Users cannot:**
- Add MCP servers
- Modify MCP servers
- Use servers other than defined ones

**Simplest approach** for complete organizational control.

### Deploy Location (System-Wide)

**Requires administrator privileges:**

- **macOS:** `/Library/Application Support/ClaudeCode/managed-mcp.json`
- **Linux/WSL:** `/etc/claude-code/managed-mcp.json`
- **Windows:** `C:\Program Files\ClaudeCode\managed-mcp.json`

**Note:** System-wide paths (not user home directories).

### managed-mcp.json Format

Same format as standard `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

---

## Option 2: Policy-Based Control

Allow users to configure MCP servers while enforcing restrictions.

**Uses:** `allowedMcpServers` and `deniedMcpServers` in managed settings file

**Note:** Use Option 1 for fixed servers with no customization. Use Option 2 for user customization within policy constraints.

### Restriction Options

Each allowlist/denylist entry can restrict by:

1. **Server name** (`serverName`): Matches configured name
2. **Command** (`serverCommand`): Matches exact command/arguments for stdio servers
3. **URL pattern** (`serverUrl`): Matches remote URLs with wildcard support

**Important:** Each entry must have exactly one of these fields.

### Example Configuration

```json
{
  "allowedMcpServers": [
    // Allow by server name
    { "serverName": "github" },
    { "serverName": "sentry" },

    // Allow by exact command (stdio servers)
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] },
    { "serverCommand": ["python", "/usr/local/bin/approved-server.py"] },

    // Allow by URL pattern (remote servers)
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ],
  "deniedMcpServers": [
    // Block by server name
    { "serverName": "dangerous-server" },

    // Block by exact command
    { "serverCommand": ["npx", "-y", "unapproved-package"] },

    // Block by URL pattern
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

### Command-Based Restrictions

**Exact matching:**
- Command arrays must match **exactly** (command + all arguments in correct order)
- `["npx", "-y", "server"]` will NOT match `["npx", "server"]` or `["npx", "-y", "server", "--flag"]`

**Stdio server behavior:**
- When allowlist contains **any** `serverCommand` entries, stdio servers **must** match one
- Stdio servers cannot pass by name alone when command restrictions exist
- Ensures administrators enforce which commands can run

**Non-stdio server behavior:**
- Remote servers (HTTP, SSE, WebSocket) use URL-based matching when `serverUrl` entries exist
- If no URL entries, remote servers fall back to name-based matching
- Command restrictions don't apply to remote servers

### URL-Based Restrictions

URL patterns support wildcards using `*` to match any sequence.

**Wildcard examples:**
- `https://mcp.company.com/*` - All paths on specific domain
- `https://*.example.com/*` - Any subdomain of example.com
- `http://localhost:*/*` - Any port on localhost

**Remote server behavior:**
- When allowlist contains **any** `serverUrl` entries, remote servers **must** match one
- Remote servers cannot pass by name alone when URL restrictions exist
- Ensures administrators enforce which remote endpoints allowed

### Allowlist Behavior

- `undefined` (default): No restrictions, users can configure any MCP server
- Empty array `[]`: Complete lockdown, users cannot configure any servers
- List of entries: Users can only configure servers matching by name, command, or URL

### Denylist Behavior

- `undefined` (default): No servers blocked
- Empty array `[]`: No servers blocked
- List of entries: Specified servers explicitly blocked across all scopes

### Important Notes

- **Option 1 + Option 2:** Can be combined. If `managed-mcp.json` exists, users cannot add servers. Allowlists/denylists still apply to managed servers.
- **Denylist precedence:** If server matches denylist entry (name, command, or URL), blocked even if on allowlist
- **Multiple restriction types:** Server passes if it matches **either** name entry, command entry, or URL pattern (unless denied)

---

## Practical Examples

### Example: Monitor Errors with Sentry

```bash
# 1. Add Sentry MCP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Authenticate
> /mcp

# 3. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### Example: Connect to GitHub

```bash
# 1. Add GitHub MCP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Authenticate
> /mcp

# 3. Work with GitHub
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
> "Show me all open PRs assigned to me"
```

### Example: Query PostgreSQL Database

```bash
# 1. Add database server
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"

# 2. Query naturally
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't made a purchase in 90 days"
```

---

## Configuration Tips

### Timeout Configuration

Configure MCP server startup timeout:

```bash
MCP_TIMEOUT=10000 claude  # 10-second timeout
```

### Output Token Limit

Increase output token limit:

```bash
MAX_MCP_OUTPUT_TOKENS=50000 claude
```

### Scope Best Practices

- **Local scope:** Personal servers, experimental configs, sensitive credentials for one project
- **Project scope:** Team-shared servers, project-specific tools, collaboration services
- **User scope:** Personal utilities across projects, development tools, frequently used services

---

## Security Warnings

**Third-party MCP servers:**
- Use at your own risk
- Anthropic has not verified correctness or security
- Trust only servers you're installing
- **Prompt injection risk:** Be careful with servers fetching untrusted content

**Plugin MCP servers:**
- Review plugin before installation
- Check what tools and capabilities are provided
- Understand data access granted

---

## Popular MCP Servers

**Documentation contains dynamically loaded list from:**
- API endpoint: `https://api.anthropic.com/mcp-registry/v0/servers`
- MCP Registry docs: `https://api.anthropic.com/mcp-registry/docs`

**Browse hundreds more:** [MCP Servers on GitHub](https://github.com/modelcontextprotocol/servers)

**Build your own:** [MCP SDK](https://modelcontextprotocol.io/quickstart/server)

---

## Related Resources

### In This Repository

**MCP:**
- `mcp-introduction.md` - General MCP overview and concepts
- `mcp-integration-claude-code.md` - MCP integration for plugins
- `mcp-server-builder.md` - Building MCP servers (4-phase workflow)

**Skills:**
- `docs/references/skills/skills-claude-code.md` - Skills in Claude Code
- `docs/references/skills/skill-creator.md` - Creating skills
- `docs/references/skills/skills-ecosystem-overview.md` - Skills ecosystem

**Other:**
- `docs/references/hooks/` - Hooks for customization
- `docs/references/agents/` - Agents and sub-agents

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
- **MCP Introduction:** [modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction)
- **MCP SDK:** [modelcontextprotocol.io/quickstart/server](https://modelcontextprotocol.io/quickstart/server)
- **MCP Servers:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

---

**Last Updated:** January 2026
**Category:** MCP
**Status:** Official Claude Code Feature
**Standard:** Model Context Protocol (Open Source)
