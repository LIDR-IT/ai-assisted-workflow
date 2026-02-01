# Troubleshooting MCP in Cursor

This guide provides solutions to common issues when working with MCP servers in Cursor. Problems are organized by category for quick reference.

## Table of Contents

- [Connection Issues](#connection-issues)
- [Authentication Problems](#authentication-problems)
- [Server Not Loading](#server-not-loading)
- [Tool Execution Errors](#tool-execution-errors)
- [Debugging with Logs](#debugging-with-logs)
- [Configuration Mistakes](#configuration-mistakes)
- [Platform-Specific Issues](#platform-specific-issues)
- [Performance Problems](#performance-problems)

---

## Connection Issues

### Problem: Server Won't Connect

**Symptoms:**
- MCP server doesn't appear in Available Tools
- Connection timeout errors in logs
- Server status shows "disconnected"

**Common Causes:**

1. **Incorrect Command Path**

```json
// ❌ Wrong
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}

// ✅ Correct - use absolute path or workspace folder variable
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${workspaceFolder}/server.js"]
    }
  }
}
```

2. **Missing Dependencies**

Check that required packages are installed:

```bash
# For Node.js servers
npm install

# For Python servers
pip install -r requirements.txt

# For npx-based servers (auto-installs)
npx -y @package/mcp-server
```

3. **Environment Variables Not Set**

Verify environment variables are accessible:

```bash
# Test in terminal
echo $API_KEY

# If empty, set it
export API_KEY="your-key"

# Or use .env file in project root
echo "API_KEY=your-key" > .env
```

**Solutions:**

**Step 1: Verify Command Manually**

Test the server command directly in terminal:

```bash
# Navigate to project root
cd ~/your-project

# Run the exact command from mcp.json
node server.js
# or
python mcp_server.py
# or
npx -y @modelcontextprotocol/server-filesystem
```

**Step 2: Check MCP Logs**

1. Open Output panel: <kbd>Cmd+Shift+U</kbd> (Mac) or <kbd>Ctrl+Shift+U</kbd> (Windows/Linux)
2. Select "MCP Logs" from dropdown
3. Look for connection errors:

```
[ERROR] Failed to start server 'my-server'
[ERROR] Command not found: node
[ERROR] ENOENT: no such file or directory
```

**Step 3: Restart Cursor**

Sometimes Cursor needs a fresh start:

1. Close all Cursor windows
2. Fully quit Cursor (not just close window)
3. Reopen Cursor and project
4. Check if server connects

**Step 4: Test with Minimal Configuration**

Create a minimal test configuration:

```json
{
  "mcpServers": {
    "test-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    }
  }
}
```

If this works, gradually add back your original configuration to identify the problem.

### Problem: Remote Server Connection Timeout

**Symptoms:**
- HTTP/SSE server won't connect
- Network timeout errors
- Connection refused messages

**Solutions:**

**Step 1: Verify Server is Running**

```bash
# Test with curl
curl http://localhost:3000/mcp

# Should return server info or valid response
```

**Step 2: Check Firewall/Network Settings**

```bash
# On macOS
sudo lsof -i :3000

# On Linux
sudo netstat -tulpn | grep 3000

# Verify server is listening on correct port
```

**Step 3: Test with Alternative URL**

```json
{
  "mcpServers": {
    "remote-server": {
      "url": "http://127.0.0.1:3000/mcp",  // Try localhost IP
      "headers": {
        "Authorization": "Bearer ${env:TOKEN}"
      }
    }
  }
}
```

**Step 4: Enable CORS (if applicable)**

For remote servers, ensure CORS headers are configured:

```javascript
// Express.js example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

---

## Authentication Problems

### Problem: API Key Not Recognized

**Symptoms:**
- "Unauthorized" or "Invalid API key" errors
- Authentication failures in logs
- Tools fail with 401/403 errors

**Solutions:**

**Step 1: Verify API Key Format**

Check that the API key is correctly formatted:

```json
{
  "mcpServers": {
    "api-server": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        // ❌ Wrong - missing quotes
        "API_KEY": ${env:API_KEY}

        // ✅ Correct - with variable interpolation
        "API_KEY": "${env:API_KEY}"

        // ✅ Also correct - direct value (not recommended for secrets)
        "API_KEY": "sk-abc123..."
      }
    }
  }
}
```

**Step 2: Test Environment Variable**

```bash
# Check if variable is set
env | grep API_KEY

# Test in same shell that launches Cursor
echo $API_KEY

# If empty, add to shell profile
echo 'export API_KEY="your-key"' >> ~/.zshrc
source ~/.zshrc

# Restart Cursor after updating
```

**Step 3: Use .env File**

Create `.env` file in project root:

```env
API_KEY=sk-abc123...
ANOTHER_KEY=value
```

Reference in `mcp.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

**Important:** Add `.env` to `.gitignore`:

```gitignore
.env
.env.local
*.env
```

**Step 4: Verify API Key Validity**

Test the API key directly:

```bash
# Example for OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $API_KEY"

# Should return 200 OK, not 401
```

### Problem: OAuth Authentication Fails

**Symptoms:**
- OAuth flow doesn't complete
- Redirect URI mismatch errors
- "Invalid client" errors

**Solutions:**

**Step 1: Verify Redirect URI**

Cursor uses a static redirect URI:

```
cursor://anysphere.cursor-mcp/oauth/callback
```

Ensure this EXACT URI is registered with your OAuth provider:

1. Go to your OAuth app settings
2. Add the redirect URI exactly as shown
3. Save changes
4. Wait a few minutes for propagation

**Step 2: Check OAuth Configuration**

```json
{
  "mcpServers": {
    "oauth-server": {
      "url": "https://api.example.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:OAUTH_CLIENT_ID}",      // Not "client_id"
        "CLIENT_SECRET": "${env:OAUTH_CLIENT_SECRET}", // Not "client_secret"
        "scopes": ["read", "write"]                    // Array, not string
      }
    }
  }
}
```

**Step 3: Clear OAuth Cache**

1. Close Cursor completely
2. Delete OAuth cache:

```bash
# macOS
rm -rf ~/Library/Application\ Support/Cursor/oauth-cache

# Linux
rm -rf ~/.config/Cursor/oauth-cache

# Windows
# Delete: %APPDATA%\Cursor\oauth-cache
```

3. Restart Cursor
4. Attempt OAuth flow again

**Step 4: Inspect OAuth Errors**

Check MCP logs for specific OAuth errors:

```
[ERROR] OAuth error: invalid_client
[ERROR] OAuth error: redirect_uri_mismatch
[ERROR] OAuth error: invalid_scope
```

Each error indicates a specific configuration issue with your OAuth provider.

---

## Server Not Loading

### Problem: Server Doesn't Appear in Tools List

**Symptoms:**
- Server configured but not visible
- No errors in logs
- Other servers work fine

**Solutions:**

**Step 1: Verify Server is Enabled**

1. Open Settings: <kbd>Cmd+Shift+J</kbd> (Mac) or <kbd>Ctrl+Shift+J</kbd> (Windows/Linux)
2. Go to Features → Model Context Protocol
3. Check that server toggle is ON
4. If OFF, enable it and restart Cursor

**Step 2: Check Configuration Location**

Cursor reads from two locations:

```bash
# Project-specific (highest priority)
.cursor/mcp.json

# Global (fallback)
~/.cursor/mcp.json
```

Verify your configuration is in the correct file:

```bash
# Check project config
cat .cursor/mcp.json

# Check global config
cat ~/.cursor/mcp.json
```

**Step 3: Validate JSON Syntax**

Use `jq` to validate JSON:

```bash
# Validate syntax
jq empty .cursor/mcp.json

# If error, shows line number:
# parse error: Expected separator between values at line 5, column 10
```

Common JSON errors:

```json
// ❌ Trailing comma
{
  "mcpServers": {
    "server": {
      "command": "node"
    },  // ← Remove this comma
  }
}

// ❌ Missing comma
{
  "mcpServers": {
    "server1": {}  // ← Add comma here
    "server2": {}
  }
}

// ❌ Unquoted keys
{
  mcpServers: {  // ← Should be "mcpServers"
    "server": {}
  }
}
```

**Step 4: Check Server Implementation**

The MCP server must implement tool discovery correctly:

```javascript
// Minimal working server
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-server",
  version: "1.0.0"
});

// Must expose tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "example_tool",
        description: "Example tool",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// Start server
await server.connect(new StdioServerTransport());
```

**Step 5: Restart with Clean State**

1. Close Cursor
2. Clear server cache:

```bash
# macOS
rm -rf ~/Library/Application\ Support/Cursor/mcp-cache

# Linux
rm -rf ~/.config/Cursor/mcp-cache
```

3. Restart Cursor
4. Server should reload

### Problem: Server Crashes on Startup

**Symptoms:**
- Server appears briefly then disappears
- Crash errors in MCP logs
- Process exits immediately

**Solutions:**

**Step 1: Check Dependencies**

```bash
# For Node.js
node --version  # Should be v18+ for most MCP servers
npm list        # Check all dependencies installed

# For Python
python --version  # Should be 3.8+ for most servers
pip list          # Check all packages installed
```

**Step 2: Review Error Messages**

Look for specific errors in logs:

```
[ERROR] Module not found: '@modelcontextprotocol/sdk'
→ Run: npm install @modelcontextprotocol/sdk

[ERROR] No module named 'mcp'
→ Run: pip install mcp

[ERROR] Permission denied: /path/to/server.js
→ Run: chmod +x /path/to/server.js
```

**Step 3: Test with Verbose Logging**

Add debug flags to command:

```json
{
  "mcpServers": {
    "debug-server": {
      "command": "node",
      "args": ["--trace-warnings", "--inspect", "server.js"],
      "env": {
        "DEBUG": "*",
        "NODE_ENV": "development"
      }
    }
  }
}
```

**Step 4: Run Server Standalone**

Test server outside of Cursor:

```bash
# Run with same environment
export API_KEY="your-key"
node server.js

# Should not crash immediately
# Press Ctrl+C to stop
```

If server works standalone but crashes in Cursor, check for:
- Different Node.js versions
- Missing environment variables
- Path resolution issues

---

## Tool Execution Errors

### Problem: Tool Execution Fails

**Symptoms:**
- Tool appears but fails when invoked
- "Tool execution error" messages
- Partial results or timeouts

**Solutions:**

**Step 1: Check Tool Arguments**

Verify the AI is passing correct arguments:

1. Click arrow beside tool name before approval
2. Inspect argument structure:

```json
{
  "path": "/valid/path",
  "action": "read"
}
```

3. Ensure arguments match `inputSchema` definition

**Step 2: Add Input Validation**

Server-side validation example:

```javascript
server.tool("read_file", async ({ path }) => {
  // Validate inputs
  if (!path) {
    throw new Error("Path is required");
  }

  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  // Execute tool
  const content = fs.readFileSync(path, "utf-8");
  return { content };
});
```

**Step 3: Handle Timeouts**

For long-running operations:

```javascript
server.tool("slow_operation", async (params) => {
  const timeout = 30000; // 30 seconds

  return Promise.race([
    actualOperation(params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), timeout)
    )
  ]);
});
```

**Step 4: Return Proper Error Messages**

```javascript
server.tool("api_call", async (params) => {
  try {
    const result = await fetch(apiUrl);
    return { data: result };
  } catch (error) {
    // Return user-friendly error
    return {
      isError: true,
      content: [{
        type: "text",
        text: `API call failed: ${error.message}`
      }]
    };
  }
});
```

### Problem: Tool Returns No Results

**Symptoms:**
- Tool executes but returns empty
- No error message
- Cursor shows "No response"

**Solutions:**

**Step 1: Verify Return Format**

MCP tools must return content in specific format:

```javascript
// ✅ Correct format
return {
  content: [
    {
      type: "text",
      text: "Result here"
    }
  ]
};

// ❌ Wrong - missing content wrapper
return "Result here";

// ❌ Wrong - incorrect structure
return {
  text: "Result here"
};
```

**Step 2: Handle Empty Results**

Always return something, even if empty:

```javascript
server.tool("search", async ({ query }) => {
  const results = await search(query);

  if (results.length === 0) {
    return {
      content: [{
        type: "text",
        text: "No results found"
      }]
    };
  }

  return {
    content: [{
      type: "text",
      text: JSON.stringify(results, null, 2)
    }]
  };
});
```

**Step 3: Return Images Correctly**

For image results:

```javascript
server.tool("generate_image", async (params) => {
  const imageBase64 = await generateImage(params);

  return {
    content: [
      {
        type: "image",
        data: imageBase64,
        mimeType: "image/png"
      }
    ]
  };
});
```

---

## Debugging with Logs

### Accessing MCP Logs

**Method 1: Output Panel**

1. Open Output panel: <kbd>Cmd+Shift+U</kbd> (Mac) or <kbd>Ctrl+Shift+U</kbd> (Windows/Linux)
2. Select "MCP Logs" from dropdown at top-right
3. View real-time server activity

**Method 2: Log Files**

Direct access to log files:

```bash
# macOS
tail -f ~/Library/Logs/Cursor/mcp.log

# Linux
tail -f ~/.config/Cursor/logs/mcp.log

# Windows
# Open: %APPDATA%\Cursor\logs\mcp.log
```

### Understanding Log Messages

**Connection Logs:**

```
[INFO] Starting MCP server 'my-server'
[INFO] Server 'my-server' connected successfully
[INFO] Discovered 5 tools from 'my-server'
```

**Error Logs:**

```
[ERROR] Failed to start server 'my-server': Command not found
[ERROR] Server 'my-server' crashed with exit code 1
[ERROR] Authentication failed for 'my-server'
```

**Tool Execution Logs:**

```
[DEBUG] Executing tool 'read_file' with args: {"path":"/file.txt"}
[DEBUG] Tool 'read_file' completed in 45ms
[ERROR] Tool 'read_file' failed: ENOENT: no such file or directory
```

### Enabling Verbose Logging

Add debug environment variables:

```json
{
  "mcpServers": {
    "debug-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "DEBUG": "*",
        "MCP_DEBUG": "true",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Log Analysis Tips

**Search for Specific Errors:**

```bash
# In Output panel, use Cmd+F / Ctrl+F to search

# Common search terms:
- "ERROR"
- "failed"
- "timeout"
- "authentication"
- Server name (e.g., "my-server")
```

**Identify Patterns:**

```
# Repeated connection failures
[ERROR] Server 'my-server' crashed with exit code 1
[INFO] Restarting server 'my-server'
[ERROR] Server 'my-server' crashed with exit code 1
→ Server has a startup issue, not a transient error

# Intermittent failures
[DEBUG] Tool executed successfully (5 times)
[ERROR] Tool execution failed: timeout
→ Performance issue, not configuration problem
```

---

## Configuration Mistakes

### Problem: Variable Interpolation Not Working

**Symptoms:**
- Literal `${env:VAR}` appears instead of value
- "Variable not found" errors
- Environment variables not expanded

**Solutions:**

**Step 1: Check Variable Syntax**

```json
{
  "mcpServers": {
    "server": {
      "env": {
        // ✅ Correct
        "API_KEY": "${env:API_KEY}",

        // ❌ Wrong - missing env:
        "API_KEY": "${API_KEY}",

        // ❌ Wrong - wrong syntax
        "API_KEY": "$API_KEY",
        "API_KEY": "%API_KEY%"
      }
    }
  }
}
```

**Step 2: Use Supported Variable Types**

Cursor supports these interpolations:

| Variable | Example | Result |
|----------|---------|--------|
| `${env:NAME}` | `${env:HOME}` | `/Users/username` |
| `${userHome}` | `${userHome}/file` | `/Users/username/file` |
| `${workspaceFolder}` | `${workspaceFolder}/src` | `/path/to/project/src` |
| `${workspaceFolderBasename}` | `${workspaceFolderBasename}` | `project-name` |
| `${pathSeparator}` or `${/}` | `path${/}file` | `path/file` |

**Step 3: Verify Variables Exist**

```bash
# Check environment variable
echo $API_KEY

# List all environment variables
env

# Check if variable is in Cursor's environment
# (Cursor inherits from launching shell)
```

### Problem: Server Configuration Override Issues

**Symptoms:**
- Changes to `mcp.json` not taking effect
- Old server configuration still active
- Multiple versions of same server

**Solutions:**

**Step 1: Check Configuration Precedence**

Cursor uses this priority order:

1. Project: `.cursor/mcp.json` (highest priority)
2. Global: `~/.cursor/mcp.json` (fallback)

If server is defined in both, project config wins:

```bash
# Check both locations
cat .cursor/mcp.json
cat ~/.cursor/mcp.json

# If duplicate, remove from one location
```

**Step 2: Restart After Changes**

Configuration changes require restart:

1. Save `mcp.json` file
2. Close all Cursor windows
3. Fully quit Cursor
4. Reopen Cursor
5. Verify changes applied

**Step 3: Clear Configuration Cache**

```bash
# macOS
rm -rf ~/Library/Application\ Support/Cursor/mcp-cache
rm -rf ~/Library/Application\ Support/Cursor/mcp-config-cache

# Linux
rm -rf ~/.config/Cursor/mcp-cache
rm -rf ~/.config/Cursor/mcp-config-cache

# Restart Cursor
```

### Problem: Path Resolution Issues

**Symptoms:**
- "File not found" errors
- Relative paths not working
- Scripts can't find resources

**Solutions:**

**Use Absolute Paths:**

```json
{
  "mcpServers": {
    "server": {
      // ❌ Relative path - may break
      "command": "node",
      "args": ["./server.js"],

      // ✅ Workspace-relative path
      "command": "node",
      "args": ["${workspaceFolder}/server.js"],

      // ✅ Home-relative path
      "command": "node",
      "args": ["${userHome}/scripts/server.js"]
    }
  }
}
```

**For Cross-Platform Paths:**

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

### macOS Issues

**Problem: Command Not Found (even though installed)**

**Cause:** Cursor may not inherit full shell environment

**Solution:**

```bash
# 1. Check where command is installed
which node
# Output: /usr/local/bin/node

# 2. Use full path in mcp.json
{
  "mcpServers": {
    "server": {
      "command": "/usr/local/bin/node",
      "args": ["server.js"]
    }
  }
}

# 3. Or ensure Cursor launched from shell that has PATH
# Launch Cursor from terminal:
open /Applications/Cursor.app
```

**Problem: Permission Denied**

**Cause:** Gatekeeper or file permissions

**Solution:**

```bash
# Make script executable
chmod +x server.js

# If Gatekeeper blocks unsigned binary:
xattr -d com.apple.quarantine /path/to/binary

# Or in System Preferences:
# Security & Privacy → Allow apps from: App Store and identified developers
```

### Windows Issues

**Problem: Scripts Not Executing**

**Cause:** PowerShell execution policy

**Solution:**

```powershell
# Check current policy
Get-ExecutionPolicy

# Set to allow local scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use full path to executable
{
  "mcpServers": {
    "server": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["server.js"]
    }
  }
}
```

**Problem: Path with Spaces**

**Solution:**

```json
{
  "mcpServers": {
    "server": {
      // Use forward slashes, even on Windows
      "command": "C:/Program Files/nodejs/node.exe",

      // Or escape properly
      "command": "C:\\Program Files\\nodejs\\node.exe"
    }
  }
}
```

### Linux Issues

**Problem: Snap/Flatpak Isolation**

**Cause:** Cursor installed as Snap/Flatpak has restricted filesystem access

**Solution:**

```bash
# Grant filesystem access to Cursor snap
snap connect cursor:home

# Or install Cursor via different method (.deb, .rpm, .AppImage)
```

**Problem: Missing System Dependencies**

**Solution:**

```bash
# Install common dependencies
sudo apt-get install nodejs npm python3 python3-pip

# Or use Docker for isolated servers
{
  "mcpServers": {
    "docker-server": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp-server-image"]
    }
  }
}
```

---

## Performance Problems

### Problem: Slow Tool Execution

**Symptoms:**
- Tools take long time to respond
- Timeout errors
- UI freezes during tool use

**Solutions:**

**Step 1: Add Timeouts**

```javascript
const TIMEOUT = 10000; // 10 seconds

server.tool("slow_tool", async (params) => {
  return Promise.race([
    actualWork(params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), TIMEOUT)
    )
  ]);
});
```

**Step 2: Implement Caching**

```javascript
const cache = new Map();

server.tool("cached_tool", async ({ key }) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await expensiveOperation(key);
  cache.set(key, result);
  return result;
});
```

**Step 3: Use Streaming for Large Responses**

```javascript
server.tool("large_data", async (params) => {
  // Return summary instead of full data
  return {
    content: [{
      type: "text",
      text: `Found ${results.length} items. Showing first 10...`
    }]
  };
});
```

### Problem: High Memory Usage

**Cause:** Server holding too much data in memory

**Solutions:**

```javascript
// Clear cache periodically
setInterval(() => {
  cache.clear();
}, 300000); // Every 5 minutes

// Limit cache size
const MAX_CACHE_SIZE = 100;
if (cache.size > MAX_CACHE_SIZE) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}

// Stream large files instead of loading into memory
const stream = fs.createReadStream(path);
// Process in chunks
```

### Problem: Too Many Tool Calls

**Symptoms:**
- AI makes excessive tool calls
- Chat becomes slow
- Server overwhelmed

**Solutions:**

**Step 1: Improve Tool Descriptions**

```javascript
// ❌ Vague - AI will call repeatedly
server.tool("search", {
  description: "Search for things"
});

// ✅ Specific - AI knows when to use
server.tool("search", {
  description: "Search codebase for exact filename matches. Returns full file paths. Use when user asks to find specific files by name."
});
```

**Step 2: Combine Related Operations**

```javascript
// ❌ Multiple tools for related actions
server.tool("get_user", ...);
server.tool("get_user_posts", ...);
server.tool("get_user_comments", ...);

// ✅ Single tool with options
server.tool("get_user_data", {
  inputSchema: {
    properties: {
      userId: { type: "string" },
      include: {
        type: "array",
        items: { enum: ["posts", "comments", "profile"] }
      }
    }
  }
});
```

**Step 3: Return Comprehensive Results**

```javascript
// Return enough information to avoid follow-up calls
server.tool("file_info", async ({ path }) => {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        path,
        size: stats.size,
        modified: stats.mtime,
        content: fs.readFileSync(path, "utf-8"),
        lines: content.split("\n").length
      }, null, 2)
    }]
  };
});
```

---

## Getting Additional Help

### Before Asking for Help

Collect this information:

```bash
# System info
node --version
npm --version
python --version

# Cursor version
# Help → About Cursor

# MCP logs (last 50 lines)
tail -50 ~/Library/Logs/Cursor/mcp.log

# Configuration (remove secrets first!)
cat .cursor/mcp.json

# Test results
# Output of manual command execution
```

### Where to Get Help

**Official Resources:**
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Cursor Discord](https://discord.gg/cursor)

**Community:**
- [Cursor Forum](https://forum.cursor.com/)
- GitHub Issues for specific MCP servers
- [MCP Discord](https://discord.gg/modelcontextprotocol)

**Server-Specific:**
- Check server's GitHub repository
- Review server's documentation
- Search existing issues

---

## Related Resources

**In This Repository:**
- [Cursor Overview](./overview.md) - Cursor MCP introduction
- [Configuration Guide](./configuration.md) - Detailed configuration reference
- [Building Servers](../../03-creating-servers/README.md) - Create your own MCP servers

**External:**
- [MCP Debugging Guide](https://modelcontextprotocol.io/docs/debugging)
- [Cursor MCP FAQ](https://cursor.com/docs/context/mcp/faq)

---

**Last Updated:** February 2026
**Complexity:** Intermediate to Advanced
**Estimated Reading Time:** 30-40 minutes

