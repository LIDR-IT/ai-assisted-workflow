# Troubleshooting MCP in Gemini CLI

This guide covers common issues when working with MCP servers in Gemini CLI and provides step-by-step solutions.

## Quick Diagnostics

### Enable Debug Mode

Before troubleshooting, enable debug mode for detailed logs:

```bash
gemini --debug
```

This reveals:
- Server connection attempts
- Tool discovery process
- Execution flow details
- Error stack traces
- Communication logs

### Check Server Status

View all configured servers and their status:

```bash
gemini mcp list
```

Shows:
- Server names
- Connection status
- Enabled/disabled state
- Configuration summary

### In-Session Status

Within a Gemini CLI session:

```bash
/mcp
```

Displays:
- All servers
- Connection status
- Available tools
- Discovery state
- Resource listings

---

## Server Connection Issues

### Problem: Server Won't Connect

**Symptoms:**
- "Failed to connect to server" error
- Server shows as disconnected in `/mcp`
- No tools discovered

**Solutions:**

#### 1. Verify Command Path

```bash
# Test command directly
which node
# /usr/local/bin/node

which python3
# /usr/local/bin/python3

# If not found, use absolute path
{
  "mcpServers": {
    "myServer": {
      "command": "/usr/local/bin/node",
      "args": ["server.js"]
    }
  }
}
```

#### 2. Check File Permissions

```bash
# Verify executable permissions
ls -la /path/to/server

# Make executable if needed
chmod +x /path/to/server

# Test execution
/path/to/server --version
```

#### 3. Validate Working Directory

```json
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"],
      "cwd": "/absolute/path/to/server/directory"
    }
  }
}
```

#### 4. Test Server Independently

```bash
# Run server manually
node server.js

# Check for startup errors
# Verify it starts without issues
# Confirm it listens on expected port (for SSE/HTTP)
```

#### 5. Check Process Limits

```bash
# macOS/Linux: Check ulimit
ulimit -n
# Should be at least 256

# Increase if needed
ulimit -n 1024
```

---

### Problem: Server Connects But Immediately Disconnects

**Symptoms:**
- Initial connection succeeds
- Server crashes after startup
- Repeated reconnection attempts

**Solutions:**

#### 1. Check Server Logs

```bash
# Enable server logging
# Check stderr output in debug mode
gemini --debug 2>&1 | grep -A 10 "server-name"
```

#### 2. Verify Dependencies

```bash
# For Node.js servers
cd /path/to/server
npm install

# For Python servers
pip install -r requirements.txt
# or
pip install mcp
```

#### 3. Validate Server Implementation

Ensure server properly implements MCP protocol:

```javascript
// Server must respond to initialize request
// Must implement required methods:
// - initialize
// - tools/list
// - tools/call (if tools exposed)
```

#### 4. Increase Timeout

```json
{
  "mcpServers": {
    "slowServer": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 60000
    }
  }
}
```

---

### Problem: Connection Timeout

**Symptoms:**
- "Connection timeout" error
- Server takes long to respond
- Intermittent connection failures

**Solutions:**

#### 1. Increase Timeout Value

```json
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 120000
    }
  }
}
```

**Note:** Default timeout is 600,000ms (10 minutes)

#### 2. Optimize Server Startup

```javascript
// Defer expensive initialization
// Load resources lazily
// Use connection pooling
// Cache startup data
```

#### 3. Check Network Latency (Remote Servers)

```bash
# Test endpoint response time
curl -w "@curl-format.txt" https://api.example.com/sse

# curl-format.txt:
# time_total: %{time_total}\n
```

---

## Tool Discovery Problems

### Problem: No Tools Discovered

**Symptoms:**
- Server connected successfully
- `/mcp` shows 0 tools
- No errors displayed

**Solutions:**

#### 1. Verify Server Implements tools/list

Test server independently:

```bash
# For stdio servers, test with MCP client
echo '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}' | node server.js
```

Expected response:
```json
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

#### 2. Check Tool Filtering

```json
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"],
      // Remove restrictive filters
      // "includeTools": ["specific-tool"]
      // "excludeTools": ["blocked-tool"]
    }
  }
}
```

#### 3. Verify Schema Compatibility

Ensure tool schemas meet Gemini API requirements:

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
    // Don't include:
    // "$schema": "..." (auto-removed)
    // "additionalProperties": false (auto-removed)
  }
}
```

#### 4. Check Server Logs

```bash
gemini --debug
# Look for:
# - "Fetching tools from server..."
# - "Received X tools from server..."
# - Schema validation errors
# - Sanitization warnings
```

---

### Problem: Tools Discovered But Can't Execute

**Symptoms:**
- Tools appear in tool list
- Execution fails with errors
- "Invalid parameters" messages

**Solutions:**

#### 1. Validate Input Schema

```json
// Ensure schema matches execution
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query"
      },
      "limit": {
        "type": "number",
        "description": "Result limit",
        "default": 10
      }
    },
    "required": ["query"]
  }
}
```

#### 2. Check Parameter Compatibility

```bash
# Test tool with exact parameters
gemini --debug
# Try tool invocation
# Check stderr for parameter validation errors
```

#### 3. Verify Server Implementation

```javascript
// Server must handle tools/call correctly
async function handleToolCall(toolName, parameters) {
  // Validate parameters
  if (!parameters.query) {
    return {
      content: [{ type: "text", text: "Missing required parameter: query" }],
      isError: true
    };
  }

  // Execute tool logic
  const result = await executeTool(toolName, parameters);

  // Return proper response format
  return {
    content: [
      { type: "text", text: JSON.stringify(result) }
    ]
  };
}
```

#### 4. Test Tool Independently

```bash
# Call tool directly via MCP protocol
echo '{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {"query": "test"}
  },
  "id": 2
}' | node server.js
```

---

### Problem: Tool Name Conflicts

**Symptoms:**
- Tools prefixed with `serverName__`
- Duplicate tool names across servers
- Unexpected tool names

**Solutions:**

#### 1. Rename Tools in Server

```javascript
// Give tools unique names
const tools = [
  {
    name: "myserver_search",  // Prefix with server name
    description: "Search in myserver"
  }
];
```

#### 2. Use Tool Filtering

```json
{
  "mcpServers": {
    "server1": {
      "command": "node",
      "args": ["server1.js"],
      "includeTools": ["search", "fetch"]
    },
    "server2": {
      "command": "node",
      "args": ["server2.js"],
      "excludeTools": ["search"]  // Exclude conflicting tool
    }
  }
}
```

#### 3. Accept Auto-Prefixing

Gemini CLI automatically prefixes duplicate tool names:
- Original: `search`
- Renamed: `server2__search`

---

## Timeout Errors

### Problem: Tool Execution Timeouts

**Symptoms:**
- "Tool execution timeout" error
- Long-running operations fail
- Inconsistent timeout behavior

**Solutions:**

#### 1. Increase Server Timeout

```json
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"],
      "timeout": 300000  // 5 minutes
    }
  }
}
```

#### 2. Implement Streaming Responses

```javascript
// For long operations, stream progress
async function longRunningTool(parameters) {
  // Start operation
  const operation = startOperation(parameters);

  // Stream progress updates
  for await (const progress of operation) {
    yield {
      content: [
        { type: "text", text: `Progress: ${progress.percent}%` }
      ]
    };
  }

  // Final result
  return {
    content: [
      { type: "text", text: "Operation complete" }
    ]
  };
}
```

#### 3. Optimize Server Performance

```javascript
// Cache expensive operations
const cache = new Map();

async function cachedOperation(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await expensiveOperation(key);
  cache.set(key, result);
  return result;
}
```

#### 4. Break Up Large Operations

```javascript
// Split into smaller chunks
async function processLargeDataset(data) {
  const batchSize = 100;
  const results = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResult = await processBatch(batch);
    results.push(...batchResult);

    // Allow timeout reset between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
```

---

## OAuth Authentication Failures

### Problem: OAuth Discovery Fails

**Symptoms:**
- "OAuth discovery failed" error
- Cannot connect to OAuth-protected servers
- Authentication popup doesn't appear

**Solutions:**

#### 1. Use Explicit Auth Configuration

Instead of relying on discovery:

```json
{
  "mcpServers": {
    "googleServer": {
      "httpUrl": "https://service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

#### 2. Verify OAuth Scopes

```json
{
  "mcpServers": {
    "oauthServer": {
      "url": "https://api.example.com/sse",
      "oauth": {
        "scopes": [
          "openid",
          "email",
          "profile"
        ]
      }
    }
  }
}
```

#### 3. Check OAuth Provider Configuration

```bash
# Verify OAuth provider is configured
# Check client ID and secret
# Confirm redirect URIs
# Validate token endpoint
```

---

### Problem: Service Account Impersonation Fails

**Symptoms:**
- "Impersonation failed" error
- Cannot authenticate with service account
- Permission denied errors

**Solutions:**

#### 1. Verify Service Account Permissions

```bash
# Service account needs:
# - Service Account Token Creator role
# - Access to target audience
# - Impersonation permissions

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/iam.serviceAccountTokenCreator"
```

#### 2. Check Configuration

```json
{
  "mcpServers": {
    "iapServer": {
      "url": "https://service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "CLIENT_ID.apps.googleusercontent.com",
      "targetServiceAccount": "sa@project.iam.gserviceaccount.com"
    }
  }
}
```

#### 3. Validate Credentials

```bash
# Check active account
gcloud auth list

# Test impersonation
gcloud auth print-identity-token \
  --audiences="CLIENT_ID.apps.googleusercontent.com" \
  --impersonate-service-account="sa@project.iam.gserviceaccount.com"
```

---

## Environment Variable Issues

### Problem: Environment Variables Not Resolved

**Symptoms:**
- Server receives literal `$VAR_NAME` instead of value
- "Missing API key" errors
- Authentication failures

**Solutions:**

#### 1. Verify Variable Syntax

```json
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "$MY_API_KEY",           // ✅ Correct
        "SECRET": "${MY_SECRET}",           // ❌ Wrong syntax
        "TOKEN": "{{MY_TOKEN}}"             // ❌ Wrong syntax
      }
    }
  }
}
```

#### 2. Check Variable is Exported

```bash
# Export variable before starting Gemini CLI
export MY_API_KEY="your-key-here"

# Verify export
echo $MY_API_KEY

# Start Gemini CLI
gemini
```

#### 3. Use Shell Profile

Add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`:

```bash
# Export variables
export MY_API_KEY="your-key-here"
export MY_SECRET="your-secret-here"

# Source file
source ~/.bashrc
```

#### 4. Verify in Settings

```bash
# Check settings file
cat ~/.config/gemini-cli/settings.json

# Variable should be referenced, not hardcoded
"env": {
  "API_KEY": "$MY_API_KEY"  // ✅ Reference
  // NOT:
  // "API_KEY": "sk-abc123"  // ❌ Hardcoded
}
```

---

### Problem: Sensitive Variables Exposed

**Symptoms:**
- API keys visible in logs
- Secrets in debug output
- Credentials in error messages

**Solutions:**

#### 1. Use Proper Variable Naming

Variables with these patterns are auto-redacted:

```json
{
  "env": {
    "API_TOKEN": "$TOKEN",      // Redacted
    "SECRET_KEY": "$SECRET",    // Redacted
    "PASSWORD": "$PASS",        // Redacted
    "REGULAR_VAR": "$VAR"       // Not redacted
  }
}
```

Patterns that trigger redaction:
- Contains `TOKEN`
- Contains `SECRET`
- Contains `PASSWORD`
- Contains `KEY` (in some contexts)

#### 2. Never Hardcode Secrets

```json
// ❌ BAD - Never do this
{
  "mcpServers": {
    "myServer": {
      "env": {
        "API_KEY": "sk-abc123def456"
      }
    }
  }
}

// ✅ GOOD - Use environment variables
{
  "mcpServers": {
    "myServer": {
      "env": {
        "API_KEY": "$MY_API_KEY"
      }
    }
  }
}
```

#### 3. Review Debug Output

```bash
# Check that secrets are redacted
gemini --debug 2>&1 | grep -i "api_key"
# Should show: API_KEY: [REDACTED]
```

---

## Configuration Errors

### Problem: Invalid JSON in settings.json

**Symptoms:**
- "Parse error" when starting Gemini CLI
- Settings not loaded
- Server configurations ignored

**Solutions:**

#### 1. Validate JSON Syntax

```bash
# Use jq to validate
cat ~/.config/gemini-cli/settings.json | jq .

# Check for common errors:
# - Missing commas
# - Trailing commas
# - Unquoted keys
# - Unclosed brackets
```

#### 2. Common JSON Errors

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
```

#### 3. Use JSON Editor

Use a JSON-aware editor:
- VS Code with JSON schema validation
- Online JSON validators
- `jq` for formatting

```bash
# Format settings.json
jq . settings.json > settings.formatted.json
mv settings.formatted.json settings.json
```

---

### Problem: Server Configuration Not Recognized

**Symptoms:**
- Server doesn't appear in `gemini mcp list`
- Configuration ignored
- No error messages

**Solutions:**

#### 1. Verify Configuration Location

```bash
# Check settings file location
ls -la ~/.config/gemini-cli/settings.json

# If not found, create it
mkdir -p ~/.config/gemini-cli
cat > ~/.config/gemini-cli/settings.json << 'EOF'
{
  "mcpServers": {}
}
EOF
```

#### 2. Check Configuration Structure

```json
// ✅ Correct structure
{
  "mcpServers": {
    "serverName": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}

// ❌ Wrong - missing mcpServers
{
  "serverName": {
    "command": "node"
  }
}

// ❌ Wrong - incorrect nesting
{
  "mcpServers": [
    {
      "name": "serverName",
      "command": "node"
    }
  ]
}
```

#### 3. Verify Required Properties

Each server must have ONE of:
- `command` (for stdio)
- `url` (for SSE)
- `httpUrl` (for HTTP streaming)

```json
// ❌ Missing transport
{
  "mcpServers": {
    "myServer": {
      "args": ["server.js"]  // Missing command!
    }
  }
}

// ✅ Has transport
{
  "mcpServers": {
    "myServer": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

---

## Debugging and Logging

### Enable Detailed Logging

#### 1. Gemini CLI Debug Mode

```bash
# Full debug output
gemini --debug

# Redirect to file for analysis
gemini --debug 2>&1 | tee debug.log
```

#### 2. Server-Side Logging

```javascript
// Node.js server
console.error('[MCP Server] Starting...');
console.error('[MCP Server] Tool registered:', toolName);

// Python server
import sys
sys.stderr.write('[MCP Server] Starting...\n')
sys.stderr.flush()
```

#### 3. Filter Logs by Server

```bash
# View logs for specific server
gemini --debug 2>&1 | grep "server-name"

# View tool execution
gemini --debug 2>&1 | grep "tools/call"

# View connection attempts
gemini --debug 2>&1 | grep "connect"
```

---

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
- Step 2: Command not found or permissions issue
- Step 3: Server not responding to protocol
- Step 5: tools/list not implemented
- Step 7: Invalid schema format
- Step 8: Tool name conflicts

---

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

---

## Platform-Specific Issues

### macOS Issues

#### Problem: Command Not Found Despite Being in PATH

**Solution:**
```bash
# Use absolute path
which node
# /usr/local/bin/node

{
  "command": "/usr/local/bin/node"
}
```

#### Problem: Permission Denied

**Solution:**
```bash
# Check quarantine attribute
xattr /path/to/server

# Remove if present
xattr -d com.apple.quarantine /path/to/server

# Make executable
chmod +x /path/to/server
```

---

### Linux Issues

#### Problem: Missing Dependencies

**Solution:**
```bash
# Check dependencies
ldd /path/to/server

# Install missing libraries
sudo apt-get install libssl-dev  # Debian/Ubuntu
sudo yum install openssl-devel   # RHEL/CentOS
```

#### Problem: SELinux Blocks Execution

**Solution:**
```bash
# Check SELinux status
getenforce

# Temporary: Set to permissive
sudo setenforce 0

# Permanent: Adjust SELinux context
chcon -t bin_t /path/to/server
```

---

### Windows WSL Issues

#### Problem: Path Format Mismatch

**Solution:**
```bash
# Use WSL path format
{
  "command": "/usr/bin/node",
  "cwd": "/home/user/project"
}

# NOT Windows format:
# "command": "C:\\Program Files\\nodejs\\node.exe"
```

#### Problem: Line Ending Issues

**Solution:**
```bash
# Convert CRLF to LF
dos2unix /path/to/server.sh

# Or with sed
sed -i 's/\r$//' /path/to/server.sh
```

---

## Performance Troubleshooting

### Problem: Slow Tool Discovery

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
// Cache tool schemas
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

### Problem: High Memory Usage

**Solutions:**

#### 1. Limit Response Size

```javascript
async function handleToolCall(toolName, params) {
  const result = await executeTool(toolName, params);

  // Truncate large responses
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

#### 2. Use Streaming for Large Data

```javascript
// Stream results instead of buffering
async function* streamResults(query) {
  const stream = await database.query(query);

  for await (const row of stream) {
    yield {
      content: [{ type: "text", text: JSON.stringify(row) }]
    };
  }
}
```

#### 3. Clean Up Resources

```javascript
// Implement cleanup on shutdown
process.on('SIGTERM', async () => {
  await database.close();
  await cache.clear();
  process.exit(0);
});
```

---

## Getting Help

### Before Asking for Help

Collect this information:

1. **Gemini CLI version:**
   ```bash
   gemini --version
   ```

2. **Server configuration:**
   ```bash
   cat ~/.config/gemini-cli/settings.json
   ```

3. **Debug output:**
   ```bash
   gemini --debug 2>&1 | tee debug.log
   ```

4. **Test server independently:**
   ```bash
   node server.js --test
   ```

5. **Environment details:**
   ```bash
   uname -a
   node --version
   python --version
   ```

---

### Support Resources

**Documentation:**
- [Gemini CLI MCP Documentation](https://geminicli.com/docs/tools/mcp-server/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

**Community:**
- Gemini CLI GitHub Issues
- MCP Discord Community
- Stack Overflow (tag: gemini-cli)

**Related Documentation:**
- [Configuration Guide](/modules/mcp/04-platform-guides/gemini-cli/configuration.md)
- [Security Guide](/modules/mcp/04-platform-guides/gemini-cli/security.md)
- [Advanced Usage](/modules/mcp/04-platform-guides/gemini-cli/advanced-usage.md)

---

**Last Updated:** February 2026
**Category:** Troubleshooting
**Platform:** Gemini CLI
**Difficulty:** Intermediate
