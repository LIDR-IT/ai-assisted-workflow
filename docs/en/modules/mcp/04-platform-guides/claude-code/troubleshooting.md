# Troubleshooting MCP in Claude Code

Comprehensive troubleshooting guide for resolving common MCP (Model Context Protocol) issues in Claude Code. This guide covers connection problems, authentication failures, server errors, and tool execution issues.

## Quick Diagnostics

### Essential Debugging Commands

```bash
# List all configured MCP servers
claude mcp list

# Get details for specific server
claude mcp get <server-name>

# Within Claude Code: Check MCP status
/mcp

# Check server logs
/mcp logs <server-name>

# Test server connection manually
claude mcp test <server-name>
```

### Check Environment Variables

```bash
# Verify required variables are set
echo $API_TOKEN
echo $DATABASE_URL
echo $GITHUB_TOKEN

# List all environment variables
env | grep -i token
env | grep -i api
```

---

## Connection Issues

### Problem: MCP Server Not Starting

**Symptoms:**
- Server fails to start when Claude Code launches
- "Connection failed" or "Server not responding" messages
- Server appears offline in `/mcp` status

**Solutions:**

#### 1. Check Server Configuration

```bash
# Verify server is configured correctly
claude mcp get <server-name>

# Expected output should show:
# - Valid command path
# - Correct arguments
# - Proper environment variables
```

#### 2. Verify Command Exists

```bash
# For npx-based servers
which npx

# For node-based servers
which node

# For Python servers
which python
which python3

# Test server command manually
npx -y @modelcontextprotocol/server-filesystem
```

#### 3. Check for Process Conflicts

```bash
# Check if server process is already running
ps aux | grep mcp
ps aux | grep <server-name>

# Kill conflicting processes if found
kill <process-id>
```

#### 4. Increase Server Timeout

```bash
# Set longer startup timeout (in milliseconds)
MCP_TIMEOUT=10000 claude

# Or add to shell profile
export MCP_TIMEOUT=10000
```

#### 5. Verify File Permissions

```bash
# Check executable permissions
ls -la $(which npx)
ls -la /path/to/server/script

# Make script executable if needed
chmod +x /path/to/server/script
```

---

### Problem: Connection Closed Immediately

**Symptoms:**
- Server starts but closes immediately
- "Connection closed" error in logs
- Works in one environment but not another

**Solutions:**

#### Windows: Missing cmd /c Wrapper

On native Windows (not WSL), `npx` servers require the `cmd /c` wrapper:

```bash
# ❌ This will fail on Windows
claude mcp add --transport stdio my-server -- npx -y @some/package

# ✅ This works on Windows
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

#### Verify Transport Type

```bash
# Check server configuration
claude mcp get <server-name>

# Ensure transport matches server type:
# - Local processes: stdio
# - Remote HTTP: http
# - Remote SSE: sse (deprecated)
# - WebSocket: websocket
```

#### Check Command Arguments

```bash
# Review full command configuration
claude mcp get <server-name>

# Ensure arguments are in correct order
# Example: npx -y package-name arg1 arg2
```

---

### Problem: Server Not Responding

**Symptoms:**
- Server starts but doesn't respond to requests
- Tool calls timeout
- No response from MCP server

**Solutions:**

#### 1. Check Server Logs

```bash
# View server logs within Claude Code
/mcp logs <server-name>

# Look for error messages or stack traces
```

#### 2. Test Server Independently

```bash
# Run server manually to check for errors
npx -y @modelcontextprotocol/server-filesystem /path

# For custom servers
node /path/to/server/index.js

# Check for error output
```

#### 3. Verify Network Connectivity

```bash
# For remote servers (HTTP/SSE/WebSocket)
curl -I https://api.example.com/mcp

# Check if service is reachable
ping api.example.com

# Test with explicit URL
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/mcp
```

#### 4. Check Port Availability

```bash
# If server uses specific port
lsof -i :8080
netstat -an | grep 8080

# Free port if in use
kill $(lsof -t -i:8080)
```

---

## Authentication Problems

### Problem: OAuth Authentication Fails

**Symptoms:**
- Browser doesn't open for OAuth flow
- Authentication completes but server still unauthorized
- Token refresh failures

**Solutions:**

#### 1. Manual OAuth Flow

```bash
# Add server (will prompt for auth)
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# Use /mcp command to authenticate
> /mcp
# Follow browser prompts
```

#### 2. Copy URL Manually

If browser doesn't open:
1. Run `/mcp` command
2. Copy the authentication URL shown
3. Paste URL into browser manually
4. Complete authentication
5. Return to Claude Code

#### 3. Clear Cached Authentication

```bash
# Clear authentication for specific server
> /mcp
# Select server → "Clear authentication"

# Re-authenticate
> /mcp
# Select server → Follow OAuth flow
```

#### 4. Check OAuth Scope

Review server configuration for correct OAuth scopes:

```json
{
  "mcpServers": {
    "service": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${TOKEN}"
      }
    }
  }
}
```

---

### Problem: API Token Not Working

**Symptoms:**
- 401 Unauthorized errors
- 403 Forbidden errors
- "Invalid token" messages

**Solutions:**

#### 1. Verify Token is Set

```bash
# Check environment variable exists
echo $API_TOKEN

# If empty, set it
export API_TOKEN="your-token-here"

# Restart Claude Code
claude
```

#### 2. Test Token Manually

```bash
# Test token with curl
curl -H "Authorization: Bearer $API_TOKEN" \
     https://api.example.com/endpoint

# Should return 200 OK, not 401/403
```

#### 3. Check Token Permissions

- Review token scopes in service dashboard
- Ensure token has required permissions
- Check if token is expired
- Verify token is for correct environment (prod vs dev)

#### 4. Regenerate Token

1. Go to service provider's dashboard
2. Revoke old token
3. Generate new token with correct scopes
4. Update environment variable
5. Restart Claude Code

#### 5. Verify Token Format

```bash
# Check token doesn't have extra spaces/newlines
echo "$API_TOKEN" | wc -c
echo "$API_TOKEN" | cat -A

# Remove any trailing whitespace
export API_TOKEN=$(echo $API_TOKEN | tr -d '[:space:]')
```

---

### Problem: Environment Variables Not Substituted

**Symptoms:**
- Variables appear as literal `${VAR}` in config
- "Environment variable not found" errors
- Server receives `${TOKEN}` instead of actual value

**Solutions:**

#### 1. Export Variables Properly

```bash
# ❌ Don't just set variables
API_TOKEN="abc123"

# ✅ Export them
export API_TOKEN="abc123"

# Verify it's exported
env | grep API_TOKEN
```

#### 2. Add to Shell Profile

```bash
# ~/.bashrc or ~/.zshrc
export API_TOKEN="your-token"
export DATABASE_URL="postgresql://..."
export GITHUB_TOKEN="ghp_..."

# Reload profile
source ~/.bashrc
# or
source ~/.zshrc
```

#### 3. Use .env File

Create `.env` file:
```bash
API_TOKEN=your-token-here
DATABASE_URL=postgresql://user:pass@localhost/db
GITHUB_TOKEN=ghp_your_github_token
```

Load before starting Claude Code:
```bash
# Using dotenv
export $(cat .env | xargs)
claude

# Or with direnv
direnv allow
claude
```

#### 4. Check Variable Name Spelling

```bash
# List all environment variables
env | sort

# Search for similar names
env | grep -i token
env | grep -i api
env | grep -i key
```

#### 5. Restart Claude Code

```bash
# Environment changes require restart
# Exit Claude Code
# Re-export variables
export API_TOKEN="token"

# Start Claude Code
claude
```

---

## Tool Execution Errors

### Problem: Tools Not Appearing

**Symptoms:**
- MCP tools don't show up in Claude Code
- `/mcp` shows server connected but no tools listed
- Cannot call MCP server tools

**Solutions:**

#### 1. List Connected Servers

```bash
# Check server status
> /mcp

# Should show:
# - Server name
# - Status: Connected
# - Available tools count
```

#### 2. Verify Tool Naming

MCP tools follow specific naming convention:
```
mcp__plugin_<plugin-name>_<server-name>__<tool-name>
```

Example:
```
mcp__plugin_database-tools_postgres__query
```

#### 3. Check allowed_tools in Commands

If using MCP tools in commands, verify frontmatter:

```markdown
---
name: my-command
allowed_tools:
  - mcp__plugin_myapp_server__tool1
  - mcp__plugin_myapp_server__tool2
---
```

#### 4. Reload MCP Servers

```bash
# Remove and re-add server
claude mcp remove <server-name>
claude mcp add --transport stdio <server-name> -- <command>

# Or restart Claude Code
```

#### 5. Check Server Implements tools/list

For custom servers, verify `tools/list` handler:

```javascript
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'tool_name',
    description: 'Tool description',
    inputSchema: { /* ... */ }
  }]
}));
```

---

### Problem: Tool Calls Timeout

**Symptoms:**
- Tool execution hangs
- "Request timeout" errors
- Slow response times

**Solutions:**

#### 1. Increase Timeout

```bash
# Set longer MCP timeout (milliseconds)
MCP_TIMEOUT=30000 claude

# Or add to environment
export MCP_TIMEOUT=30000
```

#### 2. Check Server Performance

```bash
# Monitor server process
top -p $(pgrep -f mcp-server)

# Check CPU and memory usage
# High usage may indicate performance issues
```

#### 3. Optimize Tool Implementation

For custom servers:
- Add caching for repeated queries
- Implement pagination for large results
- Use streaming for long operations
- Add timeout handling in server code

#### 4. Check Network Latency

```bash
# For remote servers
ping api.example.com
curl -w "@curl-format.txt" https://api.example.com/mcp

# curl-format.txt:
#   time_total: %{time_total}s\n
```

---

### Problem: Tool Output Too Large

**Symptoms:**
- "Output too large" warnings
- Truncated tool responses
- Context window exceeded errors

**Solutions:**

#### 1. Increase Output Limit

```bash
# Set higher token limit (default: 25,000)
MAX_MCP_OUTPUT_TOKENS=50000 claude

# Or add to environment
export MAX_MCP_OUTPUT_TOKENS=50000
```

#### 2. Implement Pagination in Server

For custom servers, add pagination:

```javascript
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'query') {
    const page = args.page || 1;
    const limit = args.limit || 100;
    const offset = (page - 1) * limit;

    const results = await database.query({
      limit,
      offset
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results)
      }]
    };
  }
});
```

#### 3. Filter Results at Source

Modify queries to return less data:
- Use SELECT with specific columns (not SELECT *)
- Add WHERE clauses to filter results
- Limit result count in query
- Aggregate data when possible

#### 4. Use Summarization

For custom servers, summarize large outputs:

```javascript
if (results.length > 1000) {
  return {
    content: [{
      type: 'text',
      text: `Found ${results.length} results. Summary: ${summarize(results)}`
    }]
  };
}
```

---

## MCP Resources Issues

### Problem: Resources Not Appearing

**Symptoms:**
- MCP resources don't show in @ mentions
- Resource paths not autocompleting
- "Resource not found" errors

**Solutions:**

#### 1. Check Server Exposes Resources

Verify server implements `resources/list`:

```javascript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'server://path/to/resource',
    name: 'Resource Name',
    description: 'Resource description',
    mimeType: 'text/plain'
  }]
}));
```

#### 2. Verify Resource URI Format

```bash
# Correct format
@server:protocol://path/to/resource

# Examples
@github:issue://123
@docs:file://api/authentication
@postgres:schema://users
```

#### 3. Check Resource Permissions

Ensure resource paths are accessible:
- File paths exist and are readable
- Database schemas are accessible
- API endpoints return data

#### 4. Refresh Resource List

```bash
# Restart server to refresh resources
claude mcp remove <server-name>
claude mcp add --transport stdio <server-name> -- <command>
```

---

## Plugin MCP Server Issues

### Problem: Plugin MCP Server Not Loading

**Symptoms:**
- Plugin installed but MCP tools unavailable
- Plugin server not appearing in `/mcp list`
- "Plugin server failed to start" errors

**Solutions:**

#### 1. Verify Plugin MCP Configuration

Check plugin has `.mcp.json` or `mcpServers` in `plugin.json`:

**Dedicated .mcp.json:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "${CLAUDE_PLUGIN_ROOT}/server/index.js",
      "args": [],
      "env": {}
    }
  }
}
```

**Or inline in plugin.json:**
```json
{
  "name": "my-plugin",
  "mcpServers": {
    "my-server": { /* config */ }
  }
}
```

#### 2. Check CLAUDE_PLUGIN_ROOT Usage

```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"]
    }
  }
}
```

Ensure paths are relative to plugin root using `${CLAUDE_PLUGIN_ROOT}`.

#### 3. Reload Plugin

```bash
# Reload plugin within Claude Code
/plugin reload <plugin-name>

# Or restart Claude Code entirely
```

#### 4. Check Plugin Logs

```bash
# View plugin logs
/plugin logs <plugin-name>

# Look for MCP server startup errors
```

#### 5. Verify Dependencies Installed

```bash
# Navigate to plugin directory
cd ~/.claude/plugins/<plugin-name>

# Install dependencies
npm install

# Or for Python plugins
pip install -r requirements.txt
```

---

## Scope and Configuration Issues

### Problem: Project MCP Servers Not Loading

**Symptoms:**
- Project-scoped servers not appearing
- `.mcp.json` in project root ignored
- "Approve project MCP servers" prompt not showing

**Solutions:**

#### 1. Verify .mcp.json Location

```bash
# File must be at project root
ls -la /path/to/project/.mcp.json

# ❌ Wrong locations:
# .claude/.mcp.json
# src/.mcp.json
# config/.mcp.json

# ✅ Correct location:
# /path/to/project/.mcp.json
```

#### 2. Approve Project Servers

```bash
# Claude Code prompts for approval on first use
# Select "Approve" when prompted

# If prompt doesn't appear, reset:
claude mcp reset-project-choices
```

#### 3. Verify JSON Format

```bash
# Validate JSON syntax
jq empty .mcp.json

# Should not show errors
# If errors, fix JSON formatting
```

#### 4. Check File Permissions

```bash
# Ensure file is readable
ls -la .mcp.json
chmod 644 .mcp.json
```

---

### Problem: User Scope vs Local Scope Confusion

**Symptoms:**
- Server configuration in wrong scope
- Changes not taking effect
- Servers duplicated across scopes

**Understanding Scopes:**

| Scope | Storage | Applies To | Use For |
|-------|---------|------------|---------|
| Local | `~/.claude.json` (under project path) | You, in current project | Personal dev servers, experimental configs |
| Project | `.mcp.json` (project root) | All team members | Team-shared servers, project tools |
| User | `~/.claude.json` | You, across all projects | Personal utilities, dev tools |

**Solutions:**

#### 1. Check Current Configuration

```bash
# List servers and their scopes
claude mcp list

# Get specific server details
claude mcp get <server-name>
```

#### 2. Move Server to Correct Scope

```bash
# Remove from current scope
claude mcp remove <server-name>

# Add to desired scope
claude mcp add --scope user <server-name> ...
claude mcp add --scope project <server-name> ...
claude mcp add --scope local <server-name> ...  # default
```

#### 3. Understand Scope Precedence

**Priority:** Local > Project > User

Same server name at multiple scopes: local overrides project overrides user.

---

## Managed MCP Configuration Issues

### Problem: Cannot Add MCP Servers (Managed Mode)

**Symptoms:**
- "MCP servers are managed" message
- Cannot use `claude mcp add` command
- Server list locked to specific set

**Explanation:**

System administrator has deployed `managed-mcp.json`, which takes exclusive control.

**Location of managed-mcp.json:**
- **macOS:** `/Library/Application Support/ClaudeCode/managed-mcp.json`
- **Linux/WSL:** `/etc/claude-code/managed-mcp.json`
- **Windows:** `C:\Program Files\ClaudeCode\managed-mcp.json`

**Solutions:**

#### 1. Contact IT Administrator

Request:
- Addition of required MCP server to managed configuration
- Explanation of security policies
- Alternative approved servers

#### 2. Use Approved Servers Only

```bash
# List available managed servers
claude mcp list

# Use only servers in managed configuration
```

---

### Problem: Server Blocked by Allowlist/Denylist

**Symptoms:**
- "Server not allowed" error
- Cannot add specific server
- Server removed after policy update

**Solutions:**

#### 1. Check Policy Configuration

Contact administrator to review policy settings:

```json
{
  "allowedMcpServers": [
    { "serverName": "approved-server" }
  ],
  "deniedMcpServers": [
    { "serverName": "blocked-server" }
  ]
}
```

#### 2. Request Server Approval

Submit request to IT with:
- Server name and purpose
- Security considerations
- Business justification
- Alternative options explored

#### 3. Use Approved Alternatives

Find similar servers in allowed list:

```bash
# List all allowed servers
claude mcp list

# Find alternatives with similar functionality
```

---

## Platform-Specific Issues

### Problem: Windows npx Servers Failing

**Symptoms:**
- "Connection closed" on Windows
- Works on macOS/Linux but not Windows
- npx command not found

**Solutions:**

#### 1. Add cmd /c Wrapper

```bash
# ❌ Fails on native Windows
claude mcp add --transport stdio server -- npx -y package

# ✅ Works on Windows
claude mcp add --transport stdio server -- cmd /c npx -y package
```

#### 2. Use Full Paths

```bash
# Find npx location
where npx

# Use full path
claude mcp add --transport stdio server -- \
  cmd /c "C:\Program Files\nodejs\npx.cmd" -y package
```

#### 3. Use WSL Instead

```bash
# Install WSL
wsl --install

# Use Claude Code in WSL
wsl
claude mcp add --transport stdio server -- npx -y package
```

---

### Problem: macOS Keychain Access Denied

**Symptoms:**
- "Keychain access denied" errors
- OAuth tokens not saving
- Authentication doesn't persist

**Solutions:**

#### 1. Grant Keychain Access

1. Open "Keychain Access" app
2. Search for "Claude Code"
3. Right-click → Get Info
4. Set "Access Control" to "Allow all applications"

#### 2. Reset Keychain Permissions

```bash
# Remove saved credentials
security delete-generic-password -s "Claude Code"

# Re-authenticate
> /mcp
```

---

## Import and Migration Issues

### Problem: Import from Claude Desktop Failed

**Symptoms:**
- "No servers found to import"
- Import command doesn't work
- Servers imported but not working

**Solutions:**

#### 1. Verify Claude Desktop Config Location

```bash
# macOS
ls ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Windows
dir %APPDATA%\Claude\claude_desktop_config.json

# Linux (varies by installation)
ls ~/.config/Claude/claude_desktop_config.json
```

#### 2. Check Platform Support

**Supported:**
- macOS
- Windows Subsystem for Linux (WSL)

**Not supported:**
- Native Windows (file path differs)
- Linux without WSL

#### 3. Manual Migration

```bash
# 1. View Claude Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 2. Add servers manually to Claude Code
claude mcp add --scope user <server-name> -- <command> <args>

# 3. Verify import
claude mcp list
```

#### 4. Handle Name Conflicts

```bash
# Imported servers get suffix if name exists
# Example: "server" becomes "server_1"

# Rename after import
claude mcp remove server_1
claude mcp add --scope user preferred-name -- <command>
```

---

## Logging and Diagnostics

### View Server Logs

```bash
# Within Claude Code
/mcp logs <server-name>

# Shows:
# - Server output
# - Error messages
# - Connection events
# - Tool calls and responses
```

### Enable Debug Logging

```bash
# Set debug environment variable
DEBUG=mcp:* claude

# Or more specific
DEBUG=mcp:server:* claude
DEBUG=mcp:transport:* claude
```

### Check System Logs

```bash
# macOS
log show --predicate 'process == "claude"' --last 30m

# Linux
journalctl -u claude -n 100

# Or check application logs
tail -f ~/.claude/logs/mcp.log
```

---

## MCP Tool Search Issues

### Problem: Tool Search Not Activating

**Symptoms:**
- All MCP tools loaded upfront (context heavy)
- Tool search tool not available
- Performance issues with many MCP servers

**Solutions:**

#### 1. Verify Model Support

Tool Search requires:
- Sonnet 4 or later
- Opus 4 or later
- **Not supported:** Haiku models

```bash
# Check current model
> /model

# Switch to supported model if needed
```

#### 2. Configure Tool Search Threshold

```bash
# Auto mode with custom threshold (default: 10%)
ENABLE_TOOL_SEARCH=auto:5 claude  # 5% threshold

# Always enabled
ENABLE_TOOL_SEARCH=true claude

# Disabled (load all tools)
ENABLE_TOOL_SEARCH=false claude
```

#### 3. Check MCPSearch Tool Permissions

```json
{
  "permissions": {
    "allow": ["MCPSearch"]
  }
}
```

Ensure MCPSearch not in deny list.

---

## Dynamic Updates Not Working

### Problem: list_changed Notifications Not Working

**Symptoms:**
- Tool list doesn't update dynamically
- Need to restart to see new tools
- Resource changes not reflected

**Solutions:**

#### 1. Verify Server Sends Notifications

Custom servers must emit `list_changed`:

```javascript
// When tools/resources/prompts change
await server.notification({
  method: 'notifications/list_changed'
});
```

#### 2. Check Transport Support

- **stdio:** Supports notifications
- **HTTP:** May require polling
- **SSE:** Supports notifications
- **WebSocket:** Supports notifications

#### 3. Restart Connection

```bash
# Force reconnection
claude mcp remove <server-name>
claude mcp add --transport stdio <server-name> -- <command>
```

---

## Getting Help

### Information to Provide

When seeking help, provide:

1. **Server configuration:**
   ```bash
   claude mcp get <server-name>
   ```

2. **Server logs:**
   ```bash
   /mcp logs <server-name>
   ```

3. **Environment details:**
   ```bash
   echo $SHELL
   echo $PATH
   env | grep -i token
   ```

4. **Platform information:**
   - OS: macOS / Linux / Windows
   - Shell: bash / zsh / fish
   - Claude Code version
   - Node.js version (if applicable)

5. **Error messages:**
   - Full error text
   - Steps to reproduce
   - Expected vs actual behavior

### Resources

- **Official Documentation:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **MCP Servers:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- **Community Forum:** [forum.claude.com](https://forum.claude.com)

---

## Quick Reference

### Common Commands

```bash
# List servers
claude mcp list

# Get server details
claude mcp get <server-name>

# Add stdio server
claude mcp add --transport stdio <name> -- <command> [args]

# Add HTTP server
claude mcp add --transport http <name> <url>

# Remove server
claude mcp remove <server-name>

# Import from Claude Desktop
claude mcp add-from-claude-desktop

# Reset project approvals
claude mcp reset-project-choices
```

### Within Claude Code

```bash
# Check MCP status
/mcp

# View logs
/mcp logs <server-name>

# Reload plugin (if using plugin MCP)
/plugin reload <plugin-name>
```

### Environment Variables

```bash
# Server timeout (milliseconds)
export MCP_TIMEOUT=10000

# Output token limit
export MAX_MCP_OUTPUT_TOKENS=50000

# Tool search configuration
export ENABLE_TOOL_SEARCH=auto:5

# Debug logging
export DEBUG=mcp:*
```

---

**Last Updated:** January 2026
**Category:** MCP / Claude Code / Troubleshooting
**Status:** Comprehensive Guide
