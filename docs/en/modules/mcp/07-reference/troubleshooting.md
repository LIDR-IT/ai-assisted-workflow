# MCP Troubleshooting Reference

Comprehensive guide for diagnosing and resolving common MCP (Model Context Protocol) issues across all platforms. Organized by problem type with quick-reference solutions.

## Quick Start Diagnostics

### Universal Diagnostic Commands

Before diving into specific issues, gather essential information:

```bash
# Check MCP server status (platform-specific)
# Claude Code:
claude mcp list
claude mcp get <server-name>

# Cursor:
# Open Output panel: Cmd+Shift+U (Mac) or Ctrl+Shift+U (Windows/Linux)
# Select "MCP Logs" from dropdown

# Gemini CLI:
gemini mcp list
gemini --debug

# Antigravity:
# Click Agent → "..." → "MCP Servers"
```

### Enable Debug Logging

**Claude Code:**
```bash
DEBUG=mcp:* claude
# or
MCP_TIMEOUT=10000 claude
```

**Cursor:**
Open Settings → Features → Model Context Protocol → Enable Debug Logs

**Gemini CLI:**
```bash
gemini --debug
```

**Antigravity:**
Debug mode not directly available; check server logs via MCP Store UI.

### Verify Environment Variables

```bash
# Check if variables are set
echo $API_TOKEN
echo $DATABASE_URL
echo $GITHUB_TOKEN

# List all environment variables
env | grep -i token
env | grep -i api
env | grep -i key

# Export variables if missing
export API_TOKEN="your-token-here"
export DATABASE_URL="your-connection-string"
```

---

## Connection Issues

### Server Won't Start

**Symptoms:**
- "Connection failed" or "Server not responding" messages
- Server appears offline in status view
- Tools not available

**Common Causes:**

#### 1. Command Not Found

**Diagnosis:**
```bash
# Test if command exists
which npx
which node
which python3

# Try running command manually
npx -y @modelcontextprotocol/server-filesystem /tmp
node /path/to/server.js
python3 /path/to/server.py
```

**Solutions:**

**Use absolute paths:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "/usr/local/bin/node",
      "args": ["${workspaceFolder}/server.js"]
    }
  }
}
```

**Verify command is executable:**
```bash
# Make executable
chmod +x /path/to/server.js

# Check permissions
ls -la /path/to/server.js
```

#### 2. Missing Dependencies

**Diagnosis:**
```bash
# For Node.js servers
cd /path/to/server
npm list

# For Python servers
pip list | grep mcp

# For npx servers (auto-installs)
npx -y @package/name --version
```

**Solutions:**
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
pip install mcp

# Force npx reinstall
npx --yes @package/name@latest
```

#### 3. Environment Variables Not Set

**Diagnosis:**
```bash
# Check variable exists
echo $API_KEY

# Check if exported
env | grep API_KEY
```

**Solutions:**

**Export variables:**
```bash
# Temporary (current session)
export API_KEY="your-key-here"

# Permanent (add to shell profile)
# ~/.bashrc or ~/.zshrc
echo 'export API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc

# Restart application after setting
```

**Use .env file:**
```bash
# Create .env file
cat > .env << 'EOF'
API_KEY=your_key_here
DATABASE_URL=postgresql://user:pass@host/db
EOF

# Load before starting
export $(cat .env | xargs)
claude
```

**Important:** Add `.env` to `.gitignore`:
```gitignore
.env
.env.local
*.env
*secret*
```

#### 4. Port Already in Use

**Diagnosis:**
```bash
# Check if port is in use
lsof -i :8080
netstat -an | grep 8080

# Find process using port
lsof -t -i:8080
```

**Solutions:**
```bash
# Kill conflicting process
kill $(lsof -t -i:8080)

# Or configure server to use different port
```

#### 5. File Permissions

**Diagnosis:**
```bash
# Check executable permissions
ls -la $(which npx)
ls -la /path/to/server/script

# Check ownership
stat /path/to/server
```

**Solutions:**
```bash
# Make executable
chmod +x /path/to/server/script

# Fix ownership
chown $USER:$USER /path/to/server/script
```

---

### Server Connects Then Immediately Disconnects

**Symptoms:**
- Initial connection succeeds
- Server crashes after startup
- Repeated reconnection attempts
- "Connection closed" error in logs

**Solutions:**

#### 1. Check Server Logs

**Claude Code:**
```bash
# Within Claude Code
/mcp logs <server-name>

# Look for error messages or stack traces
```

**Cursor:**
```bash
# Open Output panel: Cmd+Shift+U or Ctrl+Shift+U
# Select "MCP Logs"
# Filter by server name
```

**Gemini CLI:**
```bash
gemini --debug 2>&1 | grep -A 10 "server-name"
```

#### 2. Test Server Independently

```bash
# Run server manually to check for errors
npx -y @modelcontextprotocol/server-filesystem /path

# For custom servers
node /path/to/server/index.js

# Check stderr for errors
node server.js 2>&1 | tee server-errors.log
```

#### 3. Validate Server Implementation

Ensure server properly implements MCP protocol:

```javascript
// Minimal working server
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-server",
  version: "1.0.0"
});

// Must implement required methods
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "example_tool",
    description: "Example tool",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }]
}));

// Must connect to transport
await server.connect(new StdioServerTransport());
```

#### 4. Increase Timeout

**Claude Code:**
```bash
MCP_TIMEOUT=60000 claude  # 60 seconds
```

**Cursor:**
```json
{
  "mcpServers": {
    "slow-server": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 60000
    }
  }
}
```

**Gemini CLI:**
```json
{
  "mcpServers": {
    "slow-server": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 120000
    }
  }
}
```

---

### Platform-Specific Connection Issues

#### Windows: Missing cmd /c Wrapper

On native Windows (not WSL), `npx` servers require the `cmd /c` wrapper:

```json
// ❌ This fails on Windows
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@package/name"]
    }
  }
}

// ✅ This works on Windows
{
  "mcpServers": {
    "my-server": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@package/name"]
    }
  }
}
```

#### macOS: Command Not Found Despite Being in PATH

**Cause:** Application may not inherit full shell environment

**Solution:**
```bash
# 1. Find full path
which node
# Output: /usr/local/bin/node

# 2. Use full path in configuration
{
  "mcpServers": {
    "my-server": {
      "command": "/usr/local/bin/node",
      "args": ["server.js"]
    }
  }
}

# 3. Or launch application from terminal
open /Applications/Cursor.app
```

#### Linux: Snap/Flatpak Isolation

**Cause:** Application installed as Snap/Flatpak has restricted filesystem access

**Solution:**
```bash
# Grant filesystem access
snap connect cursor:home

# Or install via different method (.deb, .rpm, .AppImage)
```

---

## Authentication Problems

### API Token Not Working

**Symptoms:**
- 401 Unauthorized errors
- 403 Forbidden errors
- "Invalid token" messages
- "Authentication failed" in logs

**Solutions:**

#### 1. Verify Token is Set

```bash
# Check environment variable exists
echo $API_TOKEN

# If empty, set it
export API_TOKEN="your-token-here"

# Restart application
```

#### 2. Test Token Manually

```bash
# Test token with curl
curl -H "Authorization: Bearer $API_TOKEN" \
     https://api.example.com/endpoint

# Should return 200 OK, not 401/403
```

#### 3. Check Token Format

```bash
# Check token doesn't have extra spaces/newlines
echo "$API_TOKEN" | wc -c
echo "$API_TOKEN" | cat -A

# Remove any trailing whitespace
export API_TOKEN=$(echo $API_TOKEN | tr -d '[:space:]')
```

#### 4. Verify Token in Configuration

**Correct formats:**

**Claude Code (.mcp.json):**
```json
{
  "mcpServers": {
    "api-server": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Cursor (.cursor/mcp.json):**
```json
{
  "mcpServers": {
    "api-server": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      }
    }
  }
}
```

**Gemini CLI (settings.json):**
```json
{
  "mcpServers": {
    "api-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "$MY_API_KEY"
      }
    }
  }
}
```

#### 5. Regenerate Token

1. Go to service provider's dashboard
2. Revoke old token
3. Generate new token with correct scopes
4. Update environment variable
5. Restart application

---

### OAuth Authentication Fails

**Symptoms:**
- Browser doesn't open for OAuth flow
- Authentication completes but server still unauthorized
- "OAuth discovery failed" error
- Token refresh failures

**Solutions:**

#### 1. Manual OAuth Flow

**Claude Code:**
```bash
# Add server (will prompt for auth)
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# Use /mcp command to authenticate
> /mcp
# Follow browser prompts
```

#### 2. Copy URL Manually

If browser doesn't open:
1. Run authentication command
2. Copy the authentication URL shown in terminal/output
3. Paste URL into browser manually
4. Complete authentication
5. Return to application

#### 3. Verify Redirect URI

**Cursor OAuth redirect URI:**
```
cursor://anysphere.cursor-mcp/oauth/callback
```

**Ensure this EXACT URI is registered with OAuth provider:**
1. Go to OAuth app settings
2. Add redirect URI exactly as shown
3. Save changes
4. Wait for propagation (a few minutes)

#### 4. Clear OAuth Cache

**Claude Code:**
```bash
# Clear authentication for specific server
> /mcp
# Select server → "Clear authentication"

# Re-authenticate
> /mcp
# Select server → Follow OAuth flow
```

**Cursor:**
```bash
# Delete OAuth cache
# macOS
rm -rf ~/Library/Application\ Support/Cursor/oauth-cache

# Linux
rm -rf ~/.config/Cursor/oauth-cache

# Restart Cursor and re-authenticate
```

#### 5. Check OAuth Configuration

**Gemini CLI explicit auth configuration:**
```json
{
  "mcpServers": {
    "google-service": {
      "httpUrl": "https://service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

---

### Environment Variables Not Substituted

**Symptoms:**
- Variables appear as literal `${VAR}` in config
- "Environment variable not found" errors
- Server receives `${TOKEN}` instead of actual value

**Platform-Specific Variable Syntax:**

| Platform | Syntax | Example |
|----------|--------|---------|
| **Claude Code** | `${VAR_NAME}` | `${API_TOKEN}` |
| **Cursor** | `${env:VAR_NAME}` | `${env:API_KEY}` |
| **Gemini CLI** | `$VAR_NAME` | `$MY_API_KEY` |
| **Antigravity** | `$VAR_NAME` | `$API_TOKEN` |

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

# Restart application
```

#### 3. Use .env File

Create `.env` file:
```bash
API_TOKEN=your-token-here
DATABASE_URL=postgresql://user:pass@localhost/db
GITHUB_TOKEN=ghp_your_github_token
```

Load before starting application:
```bash
# Using dotenv
export $(cat .env | xargs)
claude

# Or with direnv
direnv allow
claude
```

#### 4. Verify Variable Name Spelling

```bash
# List all environment variables
env | sort

# Search for similar names
env | grep -i token
env | grep -i api
env | grep -i key
```

---

## Tool Execution Errors

### Tools Not Appearing

**Symptoms:**
- MCP tools don't show up in application
- Server connected but no tools listed
- Cannot call MCP server tools

**Solutions:**

#### 1. Verify Server Connected

**Check server status:**

**Claude Code:**
```bash
> /mcp
# Should show:
# - Server name
# - Status: Connected
# - Available tools count
```

**Cursor:**
Open Output panel and check for "Discovered X tools from 'server-name'"

**Gemini CLI:**
```bash
gemini mcp list
# Should show server with tool count
```

#### 2. Check Server Implements tools/list

Test server independently:

```bash
# For stdio servers, send tools/list request
echo '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}' | node server.js

# Expected response format:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "tool_name",
        "description": "Tool description",
        "inputSchema": {
          "type": "object",
          "properties": {}
        }
      }
    ]
  }
}
```

#### 3. Verify Tool Naming Convention

**Claude Code tool naming:**
```
mcp__plugin_<plugin-name>_<server-name>__<tool-name>
```

Example:
```
mcp__plugin_database-tools_postgres__query
```

**If using MCP tools in commands, verify frontmatter:**
```markdown
---
name: my-command
allowed_tools:
  - mcp__plugin_myapp_server__tool1
  - mcp__plugin_myapp_server__tool2
---
```

#### 4. Check Tool Filtering

**Cursor/Gemini CLI:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      // Remove restrictive filters
      // "includeTools": ["specific-tool"]
      // "excludeTools": ["blocked-tool"]
    }
  }
}
```

#### 5. Verify Schema Compatibility

Ensure tool schemas meet requirements:

```json
{
  "name": "valid_tool_name",
  "description": "Must have description",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param": {
        "type": "string",
        "description": "Parameter description"
      }
    },
    "required": ["param"]
    // Don't include in Gemini CLI:
    // "$schema": "..." (auto-removed)
    // "additionalProperties": false (auto-removed)
  }
}
```

#### 6. Reload MCP Servers

**Claude Code:**
```bash
# Remove and re-add server
claude mcp remove <server-name>
claude mcp add --transport stdio <server-name> -- <command>

# Or restart Claude Code
```

**Cursor:**
1. Close all Cursor windows
2. Fully quit Cursor
3. Reopen Cursor and project
4. Check if tools appear

**Gemini CLI:**
```bash
# Exit and restart
exit
gemini
```

---

### Tool Calls Timeout

**Symptoms:**
- Tool execution hangs
- "Request timeout" errors
- Slow response times
- Operations fail intermittently

**Solutions:**

#### 1. Increase Timeout

**Claude Code:**
```bash
# Set longer MCP timeout (milliseconds)
MCP_TIMEOUT=30000 claude

# Or add to environment
export MCP_TIMEOUT=30000
```

**Cursor:**
Configuration-level timeout increase (check platform docs)

**Gemini CLI:**
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 300000  // 5 minutes
    }
  }
}
```

#### 2. Optimize Tool Implementation

For custom servers:

**Add caching:**
```javascript
const cache = new Map();

server.tool("cached_operation", async ({ key }) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await expensiveOperation(key);
  cache.set(key, result);
  return result;
});
```

**Implement timeout handling:**
```javascript
server.tool("long_operation", async (params) => {
  const timeout = 30000; // 30 seconds

  return Promise.race([
    actualOperation(params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeout)
    )
  ]);
});
```

**Use streaming for long operations:**
```javascript
async function* streamProgress(operation) {
  for await (const progress of operation) {
    yield {
      content: [{
        type: "text",
        text: `Progress: ${progress.percent}%`
      }]
    };
  }
}
```

#### 3. Check Network Latency

For remote servers:

```bash
# Test endpoint response time
ping api.example.com

# Measure total request time
curl -w "@curl-format.txt" https://api.example.com/mcp

# curl-format.txt:
# time_total: %{time_total}s\n
```

#### 4. Monitor Server Performance

```bash
# Monitor server process
top -p $(pgrep -f mcp-server)

# Check CPU and memory usage
# High usage may indicate performance issues
```

---

### Tool Output Too Large

**Symptoms:**
- "Output too large" warnings
- Truncated tool responses
- Context window exceeded errors
- Memory issues

**Solutions:**

#### 1. Increase Output Limit

**Claude Code:**
```bash
# Set higher token limit (default: 25,000)
MAX_MCP_OUTPUT_TOKENS=50000 claude

# Or add to environment
export MAX_MCP_OUTPUT_TOKENS=50000
```

#### 2. Implement Pagination in Server

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
        text: JSON.stringify({
          page,
          total: await database.count(),
          results
        })
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

```sql
-- ❌ Returns too much data
SELECT * FROM users;

-- ✅ Returns only necessary data
SELECT id, name, email FROM users WHERE active = true LIMIT 100;
```

#### 4. Use Summarization

For custom servers, summarize large outputs:

```javascript
server.tool("large_query", async (params) => {
  const results = await executeQuery(params);

  if (results.length > 1000) {
    return {
      content: [{
        type: 'text',
        text: `Found ${results.length} results. Summary: ${summarize(results)}\n\nUse pagination to retrieve full results.`
      }]
    };
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(results, null, 2)
    }]
  };
});
```

---

## Configuration Issues

### Invalid JSON Syntax

**Symptoms:**
- "Parse error" when starting application
- Settings not loaded
- Server configurations ignored

**Common JSON Errors:**

```json
// ❌ Trailing comma
{
  "mcpServers": {
    "server1": {},
  }
}

// ✅ No trailing comma
{
  "mcpServers": {
    "server1": {}
  }
}

// ❌ Single quotes
{
  'mcpServers': {
    'server1': {}
  }
}

// ✅ Double quotes
{
  "mcpServers": {
    "server1": {}
  }
}

// ❌ Missing comma
{
  "mcpServers": {
    "server1": {}
    "server2": {}
  }
}

// ✅ Proper commas
{
  "mcpServers": {
    "server1": {},
    "server2": {}
  }
}
```

**Solutions:**

#### 1. Validate JSON Syntax

```bash
# Use jq to validate and format
cat config.json | jq .

# Check for errors
jq empty config.json

# Format JSON properly
jq . config.json > config.formatted.json
mv config.formatted.json config.json
```

#### 2. Use JSON-Aware Editor

- VS Code with JSON schema validation
- Online JSON validators (jsonlint.com)
- `jq` command-line tool

---

### Variable Interpolation Not Working

**Platform-Specific Syntax:**

**Claude Code:**
```json
{
  "mcpServers": {
    "server": {
      "url": "https://api.example.com",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Cursor:**
```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${env:API_KEY}",
        "HOME_DIR": "${userHome}",
        "PROJECT_DIR": "${workspaceFolder}"
      }
    }
  }
}
```

**Supported Cursor variables:**
- `${env:NAME}` - Environment variable
- `${userHome}` - User home directory
- `${workspaceFolder}` - Project root
- `${workspaceFolderBasename}` - Project name
- `${pathSeparator}` or `${/}` - Path separator

**Gemini CLI:**
```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "$MY_API_KEY"
      }
    }
  }
}
```

**Common Mistakes:**

```json
// ❌ Wrong syntax for platform
"API_KEY": "$API_KEY"        // Wrong for Cursor
"API_KEY": "${API_KEY}"      // Wrong for Gemini CLI
"API_KEY": "%API_KEY%"       // Windows syntax doesn't work

// ✅ Correct for each platform
// Claude Code:
"Authorization": "Bearer ${API_TOKEN}"

// Cursor:
"API_KEY": "${env:API_KEY}"

// Gemini CLI:
"API_KEY": "$MY_API_KEY"
```

---

### Path Resolution Issues

**Symptoms:**
- "File not found" errors
- Relative paths not working
- Scripts can't find resources

**Solutions:**

**Use absolute paths:**

```json
{
  "mcpServers": {
    "server": {
      // ❌ Relative path - may break
      "command": "node",
      "args": ["./server.js"],

      // ✅ Workspace-relative path (Cursor)
      "command": "node",
      "args": ["${workspaceFolder}/server.js"],

      // ✅ Home-relative path
      "command": "node",
      "args": ["${userHome}/scripts/server.js"],

      // ✅ Absolute path
      "command": "node",
      "args": ["/absolute/path/to/server.js"]
    }
  }
}
```

**For cross-platform paths:**

```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": [
        "${workspaceFolder}${/}scripts${/}server.js"
      ]
    }
  }
}
```

This works on Windows (`\`), macOS, and Linux (`/`).

---

## Platform-Specific Issues

### Antigravity: No Project-Level MCP Support

**Critical Limitation:** Antigravity does NOT support project-level MCP configuration files.

**What Doesn't Work:**
```
❌ .gemini/mcp_config.json        (project directory)
❌ <project-root>/mcp_config.json  (project root)
❌ .antigravity/mcp_config.json    (project directory)
```

**What Works:**
```
✅ ~/.gemini/antigravity/mcp_config.json  (user home directory)
```

**Implications:**
- Manual configuration required for each developer
- Cannot commit MCP configuration to project repository
- Team collaboration requires workarounds
- Multi-project conflicts in global configuration

**Workarounds:**

#### 1. Reference Configuration File

Include `.gemini/mcp_config.json` in project as documentation:

```bash
# Create reference file
mkdir -p .gemini
cat > .gemini/mcp_config.json << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "$CONTEXT7_API_KEY"
      }
    }
  }
}
EOF

# Commit to git
git add .gemini/mcp_config.json
git commit -m "docs: add reference MCP configuration for Antigravity"
```

**Developers can copy reference:**
```bash
cp .gemini/mcp_config.json ~/.gemini/antigravity/mcp_config.json
```

#### 2. Automated Setup Script

```bash
#!/bin/bash
# scripts/setup-antigravity-mcp.sh

set -e

PROJECT_CONFIG=".gemini/mcp_config.json"
USER_CONFIG="$HOME/.gemini/antigravity/mcp_config.json"

if [ ! -f "$PROJECT_CONFIG" ]; then
  echo "❌ Project MCP config not found"
  exit 1
fi

mkdir -p "$(dirname "$USER_CONFIG")"

if [ ! -f "$USER_CONFIG" ]; then
  cp "$PROJECT_CONFIG" "$USER_CONFIG"
  echo "✅ Configuration created"
else
  echo "🔄 Merging configurations..."
  if command -v jq &> /dev/null; then
    cp "$USER_CONFIG" "$USER_CONFIG.backup"
    jq -s '.[0] * .[1]' "$USER_CONFIG.backup" "$PROJECT_CONFIG" > "$USER_CONFIG"
    echo "✅ Configuration merged"
  else
    echo "⚠️  jq not installed - manual merge required"
    exit 1
  fi
fi

echo "✅ Setup complete!"
```

#### 3. Use UI-Based Configuration

1. Open Antigravity
2. Click Agent session → "..." (menu)
3. Select "MCP Servers"
4. Click "Manage MCP Servers"
5. Click "View raw config"
6. Paste project configuration

**See full guide:** [Antigravity Limitations](../04-platform-guides/antigravity/limitations.md)

---

## Resources and Prompts Issues

### Resources Not Appearing

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
# Claude Code:
claude mcp remove <server-name>
claude mcp add --transport stdio <server-name> -- <command>

# Cursor: Restart Cursor

# Gemini CLI: Exit and restart
```

---

## Logging and Debugging

### Enable Detailed Logging

**Claude Code:**
```bash
# Full debug output
DEBUG=mcp:* claude

# More specific
DEBUG=mcp:server:* claude
DEBUG=mcp:transport:* claude
```

**Cursor:**
Open Settings → Features → Model Context Protocol → Enable Debug Logs

**Gemini CLI:**
```bash
# Full debug output
gemini --debug

# Redirect to file for analysis
gemini --debug 2>&1 | tee debug.log
```

**Server-Side Logging:**

**Node.js:**
```javascript
console.error('[MCP Server] Starting...');
console.error('[MCP Server] Tool registered:', toolName);
```

**Python:**
```python
import sys
sys.stderr.write('[MCP Server] Starting...\n')
sys.stderr.flush()
```

### Common Debug Patterns

```bash
# Connection issues
gemini --debug 2>&1 | grep -E "(spawn|connect|ENOENT)"

# Tool discovery
gemini --debug 2>&1 | grep -E "(tools/list|Received.*tools)"

# Execution errors
gemini --debug 2>&1 | grep -E "(tools/call|error|failed)"

# Authentication
gemini --debug 2>&1 | grep -E "(oauth|auth|token)"

# Timeouts
gemini --debug 2>&1 | grep -E "(timeout|ETIMEDOUT)"
```

### Analyze Connection Flow

Debug output shows connection sequence:

```
1. [MCP] Loading server: server-name
2. [MCP] Spawning process: command args...
3. [MCP] Sending initialize request
4. [MCP] Server initialized
5. [MCP] Fetching tools from server
6. [MCP] Received 5 tools
7. [MCP] Sanitizing schemas
8. [MCP] Registering tools
9. [MCP] Server ready: server-name
```

Look for errors at each step:
- **Step 2:** Command not found or permissions issue
- **Step 3:** Server not responding to protocol
- **Step 5:** tools/list not implemented
- **Step 7:** Invalid schema format
- **Step 8:** Tool name conflicts

---

## Error Message Reference

### Common Error Messages and Solutions

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Connection failed" | Command not found | Use absolute path to command |
| "Command not found: npx" | Node.js not installed | Install Node.js or use full path |
| "ENOENT: no such file" | File path incorrect | Check working directory and file path |
| "Permission denied" | File not executable | Run `chmod +x /path/to/file` |
| "Port already in use" | Another process using port | Kill process or use different port |
| "401 Unauthorized" | Invalid API token | Verify token and regenerate if needed |
| "403 Forbidden" | Insufficient token permissions | Check token scopes |
| "Timeout" | Operation too slow | Increase timeout or optimize server |
| "Output too large" | Response exceeds limit | Implement pagination or filtering |
| "Invalid JSON" | Syntax error in config | Validate with `jq` |
| "Variable not found" | Environment variable not set | Export variable and restart |
| "OAuth failed" | Redirect URI mismatch | Verify redirect URI in OAuth settings |
| "Server crashed" | Startup error | Check server logs for details |
| "No tools discovered" | tools/list not implemented | Verify server implementation |

---

## Performance Troubleshooting

### Slow Tool Discovery

**Solutions:**

#### 1. Reduce Number of Tools

```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["server.js"],
      "includeTools": ["essential-tool-1", "essential-tool-2"]
    }
  }
}
```

#### 2. Optimize Server Startup

```javascript
// Load tools lazily
const tools = new Map();

async function getTools() {
  if (tools.size === 0) {
    await loadTools();
  }
  return Array.from(tools.values());
}
```

#### 3. Cache Tool Definitions

```javascript
const toolCache = {
  lastUpdate: null,
  tools: [],
  maxAge: 60000  // 1 minute
};

async function listTools() {
  const now = Date.now();
  if (toolCache.tools.length &&
      now - toolCache.lastUpdate < toolCache.maxAge) {
    return toolCache.tools;
  }

  toolCache.tools = await fetchTools();
  toolCache.lastUpdate = now;
  return toolCache.tools;
}
```

---

### High Memory Usage

**Solutions:**

#### 1. Limit Response Size

```javascript
async function handleToolCall(toolName, params) {
  const result = await executeTool(toolName, params);

  const maxSize = 1000000; // 1MB
  if (JSON.stringify(result).length > maxSize) {
    return {
      content: [{
        type: "text",
        text: "Result too large. Use streaming or pagination."
      }],
      isError: true
    };
  }

  return { content: [{ type: "text", text: JSON.stringify(result) }] };
}
```

#### 2. Clear Cache Periodically

```javascript
// Clear cache every 5 minutes
setInterval(() => {
  cache.clear();
}, 300000);

// Limit cache size
const MAX_CACHE_SIZE = 100;
if (cache.size > MAX_CACHE_SIZE) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}
```

#### 3. Stream Large Files

```javascript
// Stream files instead of loading into memory
const stream = fs.createReadStream(path);
// Process in chunks
```

---

## Getting Help

### Information to Provide

When seeking help, provide:

**1. Platform and Version:**
```bash
# Claude Code
claude --version

# Cursor
# Help → About Cursor

# Gemini CLI
gemini --version
```

**2. Server Configuration:**
```bash
# Claude Code
claude mcp get <server-name>

# Cursor
cat .cursor/mcp.json

# Gemini CLI
cat ~/.config/gemini-cli/settings.json
```

**3. Server Logs:**
```bash
# Claude Code
/mcp logs <server-name>

# Cursor
# Output panel → MCP Logs

# Gemini CLI
gemini --debug 2>&1 | tee debug.log
```

**4. Environment Details:**
```bash
echo $SHELL
echo $PATH
env | grep -i token
node --version
python --version
uname -a
```

**5. Error Messages:**
- Full error text
- Steps to reproduce
- Expected vs actual behavior

---

### Support Resources

**Official Documentation:**
- [Claude Code MCP Docs](https://code.claude.com/docs/en/mcp)
- [Cursor MCP Docs](https://cursor.com/docs/context/mcp)
- [Gemini CLI MCP Docs](https://geminicli.com/docs/tools/mcp-server/)
- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)
- [MCP Website](https://modelcontextprotocol.io/)

**Community:**
- [MCP Discord Community](https://discord.gg/modelcontextprotocol)
- [Cursor Discord](https://discord.gg/cursor)
- [Cursor Forum](https://forum.cursor.com/)
- Stack Overflow (tags: model-context-protocol, cursor, claude-code)

**Server-Specific:**
- Check server's GitHub repository
- Review server's documentation
- Search existing issues
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)

---

## Related Documentation

**Platform Guides:**
- [Claude Code Troubleshooting](../04-platform-guides/claude-code/troubleshooting.md)
- [Cursor Troubleshooting](../04-platform-guides/cursor/troubleshooting.md)
- [Gemini CLI Troubleshooting](../04-platform-guides/gemini-cli/troubleshooting.md)
- [Antigravity Limitations](../04-platform-guides/antigravity/limitations.md)

**Configuration:**
- [Installation Overview](../02-using-mcp/installation-overview.md)
- [Environment Variables](../02-using-mcp/environment-variables.md)
- [Scoped Configuration](../02-using-mcp/scoped-configuration.md)

**Building Servers:**
- [Error Handling](../03-creating-servers/error-handling.md)
- [Testing](../03-creating-servers/testing.md)
- [Best Practices](../03-creating-servers/best-practices.md)

---

**Last Updated:** February 2026
**Category:** Reference / Troubleshooting
**Audience:** All MCP Users
**Estimated Reading Time:** 30-40 minutes
