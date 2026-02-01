# MCP Inspector

## Overview

The **MCP Inspector** is an official interactive developer tool for testing and debugging Model Context Protocol (MCP) servers. Often described as the "Postman equivalent for the MCP world," it provides a browser-based interface that gives developers a direct window into their server's behavior without requiring a full-fledged AI client.

**Key Capabilities:**
- Test MCP servers during development
- Debug tool implementations and schemas
- Verify resource and prompt functionality
- Monitor server messages and notifications
- Test edge cases and error handling
- Validate server responses in real-time

**Official Links:**
- **Documentation:** [modelcontextprotocol.io/docs/tools/inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- **GitHub Repository:** [github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)

---

## Architecture

The MCP Inspector consists of two main components working together:

### 1. MCP Inspector Client (MCPI)

**Type:** React-based web UI
**Purpose:** Interactive interface for testing and debugging

**Features:**
- Form-based tool invocation
- Real-time response visualization
- Resource browsing and inspection
- Prompt template testing
- Server connection management
- Configuration export

### 2. MCP Proxy (MCPP)

**Type:** Node.js server
**Purpose:** Protocol bridge between web UI and MCP servers

**Functions:**
- Acts as MCP client connecting to your server
- Acts as HTTP server serving the web UI
- Supports stdio, SSE, and streamable-http transports
- Provides authentication and security features
- Handles message routing and protocol translation

**Architecture Diagram:**

```
┌─────────────────────┐
│   Browser (You)     │
│  localhost:6274     │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│   MCP Proxy         │
│  (port 6277)        │
│                     │
│  ┌──────────────┐   │
│  │ HTTP Server  │   │
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │ MCP Client   │   │
│  └──────┬───────┘   │
└─────────┼───────────┘
          │ stdio/SSE/HTTP
          ▼
┌─────────────────────┐
│   Your MCP Server   │
│  (under test)       │
└─────────────────────┘
```

---

## Installation and Setup

### Prerequisites

**System Requirements:**
- Node.js ^22.7.5 or later
- npm or npx (comes with Node.js)

### No Installation Required

The Inspector runs directly through `npx` without requiring global installation:

```bash
npx @modelcontextprotocol/inspector <command>
```

This approach:
- Always uses the latest version
- Requires no global packages
- Works across all platforms
- Minimal setup overhead

### Alternative Installation Methods

**Docker:**
```bash
docker run --rm \
  -p 127.0.0.1:6274:6274 \
  -p 127.0.0.1:6277:6277 \
  ghcr.io/modelcontextprotocol/inspector:latest
```

**Global Installation** (optional):
```bash
npm install -g @modelcontextprotocol/inspector
mcp-inspector <command>
```

---

## Launching Inspector for Different Server Types

### Testing stdio Servers

**stdio** is the default transport for local command execution.

#### npm Packages

```bash
npx @modelcontextprotocol/inspector npx <package-name> <args>
```

**Example: Testing filesystem server**
```bash
npx @modelcontextprotocol/inspector \
  npx @modelcontextprotocol/server-filesystem /Users/username/Desktop
```

**Example: Testing with `-y` flag** (auto-confirm installation)
```bash
npx -y @modelcontextprotocol/inspector \
  npx @modelcontextprotocol/server-filesystem /tmp
```

#### PyPI Packages

```bash
npx @modelcontextprotocol/inspector uvx <package-name> <args>
```

**Example: Testing Python server**
```bash
npx @modelcontextprotocol/inspector \
  uvx mcp-server-git --repository ~/code/mcp/servers.git
```

**Example: With environment variables**
```bash
npx @modelcontextprotocol/inspector \
  uvx mcp-server-github --env GITHUB_TOKEN=your_token
```

#### Local TypeScript Servers

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js [args...]
```

**Example: Testing development server**
```bash
# With compiled JavaScript
npx @modelcontextprotocol/inspector node build/index.js

# With tsx (TypeScript execution)
npx @modelcontextprotocol/inspector npx tsx src/index.ts

# With ts-node
npx @modelcontextprotocol/inspector npx ts-node src/index.ts
```

#### Local Python Servers

```bash
npx @modelcontextprotocol/inspector \
  uv --directory path/to/server run package-name [args...]
```

**Example: Testing with uv**
```bash
npx @modelcontextprotocol/inspector \
  uv --directory ~/projects/my-mcp-server \
  run my-mcp-server
```

**Example: Testing with Python directly**
```bash
npx @modelcontextprotocol/inspector \
  python src/server.py
```

### Testing HTTP Servers

For servers using SSE or streamable-http transports.

#### Starting HTTP Server First

```bash
# Terminal 1: Start your HTTP server
npm start
# Server running on http://localhost:3000/mcp

# Terminal 2: Launch Inspector
npx @modelcontextprotocol/inspector --url http://localhost:3000/mcp
```

#### With Authentication

```bash
npx @modelcontextprotocol/inspector \
  --url http://localhost:3000/mcp \
  --auth-token your-bearer-token
```

#### SSE Transport

```bash
npx @modelcontextprotocol/inspector \
  --transport sse \
  --url http://localhost:3000/mcp/sse
```

### Using Configuration Files

Create a configuration file to manage multiple servers:

**config.json:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop"
      ]
    },
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "custom-server": {
      "command": "node",
      "args": ["build/index.js"],
      "env": {
        "API_KEY": "your-api-key",
        "DEBUG": "true"
      }
    }
  }
}
```

**Launch with config:**
```bash
npx @modelcontextprotocol/inspector --config config.json
```

---

## Testing Workflow

### Phase 1: Server Initialization

When you launch the Inspector, follow this verification sequence:

#### Step 1: Verify Connection

**What to Check:**
- Server starts without errors
- Connection established successfully
- No timeout or connection refused errors

**UI Indicators:**
- Connection status shows "Connected"
- Server name appears in header
- No error messages in console

**Screenshot Description:**
*Top bar shows "Connected to github-mcp-server v1.0.0" with green indicator*

#### Step 2: Check Server Capabilities

**What to Verify:**
- Protocol version matches (currently 2024-11-05)
- Capabilities negotiated correctly
- Server info displayed properly

**Server Connection Pane Shows:**
```
Server Name: github-mcp-server
Version: 1.0.0
Protocol: 2024-11-05

Capabilities:
✓ tools
✓ resources
✓ prompts
✓ logging
```

**What This Means:**
- `tools`: Server provides executable functions
- `resources`: Server exposes data sources
- `prompts`: Server offers prompt templates
- `logging`: Server sends log messages

#### Step 3: Validate Environment

**Check Environment Variables:**
- API keys loaded correctly
- Configuration parameters present
- No missing required variables

**Notifications Pane Shows:**
```
[INFO] Server initialized
[INFO] GitHub token loaded
[INFO] Ready to accept requests
```

### Phase 2: Tool Discovery

#### Step 1: List Available Tools

Navigate to the **Tools** tab to see all exposed tools.

**What to Verify:**
- All expected tools appear
- Tool names follow naming convention
- Descriptions are clear and helpful

**Example Tools List:**
```
📋 Tools (5)

github_create_issue
  Create a new issue in a GitHub repository

github_list_issues
  List issues in a repository with filters

github_update_issue
  Update an existing issue

github_add_comment
  Add a comment to an issue

github_close_issue
  Close an open issue
```

#### Step 2: Inspect Tool Schemas

Click on a tool to view its detailed schema.

**Example: github_create_issue**

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "repository": {
      "type": "string",
      "description": "Repository in format owner/repo"
    },
    "title": {
      "type": "string",
      "description": "Issue title"
    },
    "body": {
      "type": "string",
      "description": "Issue description"
    },
    "labels": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Labels to add"
    }
  },
  "required": ["repository", "title"]
}
```

**What to Verify:**
- Required fields marked clearly
- Descriptions are actionable
- Types are correct (string, number, array, etc.)
- Default values present where appropriate

#### Step 3: Check Tool Annotations

**Annotations to Verify:**

```json
{
  "annotations": {
    "readOnlyHint": false,
    "destructiveHint": true,
    "idempotentHint": false
  }
}
```

**What Each Means:**
- `readOnlyHint: true` - Safe, only reads data
- `destructiveHint: true` - Creates/modifies/deletes data
- `idempotentHint: true` - Safe to call multiple times
- `openWorldHint: true` - Can access arbitrary resources

### Phase 3: Tool Execution

#### Step 1: Test with Valid Inputs

**Example: Creating an Issue**

1. Select tool: `github_create_issue`
2. Fill form inputs:
   ```
   repository: octocat/Hello-World
   title: Test issue from MCP Inspector
   body: This is a test issue created during development
   labels: ["test", "automated"]
   ```
3. Click **Call Tool**

**Expected Response:**

**Text Content:**
```
Created issue #456: Test issue from MCP Inspector
URL: https://github.com/octocat/Hello-World/issues/456
```

**Resource Content:**
```json
{
  "type": "resource",
  "resource": {
    "uri": "github://issues/456",
    "mimeType": "application/json",
    "text": "{\n  \"id\": 456,\n  \"number\": 456,\n  \"title\": \"Test issue from MCP Inspector\",\n  \"state\": \"open\",\n  \"created_at\": \"2026-02-01T10:30:00Z\"\n}"
  }
}
```

**What to Verify:**
- Response returns successfully (200 OK)
- Both text and structured data provided
- Resource URI follows convention
- Data format matches expectations

#### Step 2: Test with Invalid Inputs

**Example: Missing Required Field**

1. Select tool: `github_create_issue`
2. Fill form with missing `title`:
   ```
   repository: octocat/Hello-World
   body: Test without title
   ```
3. Click **Call Tool**

**Expected Error:**
```json
{
  "error": {
    "code": -32602,
    "message": "Invalid params: title is required"
  }
}
```

**What to Verify:**
- Error code is appropriate (-32602 for invalid params)
- Error message is clear and actionable
- No server crash or undefined behavior
- Validation happens before API call

#### Step 3: Test Error Handling

**Example: Authentication Failure**

1. Temporarily remove API key: unset `GITHUB_TOKEN`
2. Call any tool
3. Observe error response

**Expected Error:**
```
Authentication failed. Check your API key in environment variables.
Generate a new token at https://github.com/settings/tokens
```

**What to Verify:**
- Error message is actionable (tells user what to do)
- Includes links or specific instructions
- No sensitive data leaked in error
- Appropriate error code returned

**Example: Rate Limiting**

Simulate by making many rapid requests.

**Expected Error:**
```
Rate limit exceeded. Wait before retrying.
Limit resets at: 2026-02-01T11:00:00Z
```

**What to Verify:**
- Rate limit detected properly
- Reset time communicated
- Graceful degradation (no crash)

### Phase 4: Testing Edge Cases

#### Empty Inputs

**Test Case:** Submit tool with no parameters

**Example:**
```json
{
  "repository": "",
  "title": ""
}
```

**Expected:** Validation error before API call

#### Large Datasets

**Test Case:** Request with large result set

**Example:** `github_list_issues` with 1000+ issues

**What to Verify:**
- Pagination handled correctly
- No timeout errors
- Response streaming works
- Memory usage reasonable

#### Concurrent Operations

**Test Case:** Call multiple tools simultaneously

**Process:**
1. Open multiple tool tabs
2. Fill different tools
3. Click "Call Tool" on all quickly

**What to Verify:**
- No race conditions
- Each request completes independently
- No shared state issues
- Responses match requests

#### Unicode and Special Characters

**Test Case:** Use emoji, non-Latin scripts, special chars

**Example:**
```
title: "Bug 🐛: Database 失敗 with special chars: <>&\""
```

**What to Verify:**
- Characters preserved correctly
- No encoding errors
- API handles properly
- Display renders correctly

---

## Inspector UI Features

### Server Connection Pane

**Location:** Top of interface

**Features:**
- **Transport Selection:** Choose stdio, SSE, or HTTP
- **Command Arguments:** Customize server launch command
- **Environment Variables:** Set or override env vars
- **Reconnect Button:** Restart server connection
- **Connection Status:** Visual indicator (connected/disconnected)

**Example Configuration:**

```
Transport: stdio

Command: npx tsx src/index.ts

Environment:
  GITHUB_TOKEN: ghp_xxxxxxxxxxxx
  DEBUG: true
  LOG_LEVEL: info

[Reconnect] [Export Config]
```

**Screenshot Description:**
*Connection pane shows transport dropdown, command input field, environment variables section, and blue "Reconnect" button*

### Resources Tab

**Purpose:** Inspect server-provided context and data sources

**Features:**
- Resource listing with descriptions
- MIME type display
- Content preview
- Subscription testing for dynamic resources
- Resource URI copying

**Example Resources View:**

```
📦 Resources (3)

file:///project/README.md
  Type: text/markdown
  Description: Project documentation
  [View Content]

github://repos/octocat/Hello-World
  Type: application/json
  Description: Repository information
  [View Content] [Subscribe]

database://schema
  Type: application/json
  Description: Database schema
  [View Content]
```

**Content Preview:**
```
Resource: file:///project/README.md
MIME Type: text/markdown

# My Project

This is the project README...
```

**What to Test:**
- All resources listed correctly
- Content loads without errors
- MIME types accurate
- Subscriptions receive updates
- Large resources handle gracefully

### Prompts Tab

**Purpose:** Test prompt templates with custom arguments

**Features:**
- Prompt template listing
- Argument input forms
- Message preview
- Generated prompt display
- Template variable interpolation

**Example Prompts View:**

```
💬 Prompts (2)

create_pr_description
  Arguments:
    - branch_name (string): Feature branch name
    - changes (string): Summary of changes
  [Test Prompt]

review_code
  Arguments:
    - file_path (string): Path to code file
    - focus_areas (array): Areas to focus review
  [Test Prompt]
```

**Testing Prompt:**

1. Select `create_pr_description`
2. Fill arguments:
   ```
   branch_name: feature/add-authentication
   changes: Implement JWT-based authentication system
   ```
3. Click **Generate**

**Preview:**
```
Role: user
Content:
  Create a pull request description for branch 'feature/add-authentication'.

  Changes summary:
  Implement JWT-based authentication system

  Include:
  - Overview of changes
  - Testing instructions
  - Breaking changes (if any)
```

**What to Verify:**
- Variables interpolated correctly
- Message structure valid
- Role assignment appropriate
- Multi-turn conversations handled

### Tools Tab

**Purpose:** Test tool invocation and responses

**Features:**
- Tool listing with descriptions
- Schema-generated input forms
- Form validation
- Response display (text and JSON)
- Error message display
- Request/response history

**Tool Invocation Interface:**

```
Tool: github_create_issue

Inputs:
  repository: [octocat/Hello-World    ]
  title:      [Test issue              ]
  body:       [Issue description       ]
  labels:     [test, bug               ]

[Call Tool] [Clear]

Response:
  Status: 200 OK
  Time: 1.2s

  Text:
    Created issue #456: Test issue
    URL: https://github.com/octocat/Hello-World/issues/456

  Resource:
    {
      "id": 456,
      "number": 456,
      "title": "Test issue",
      ...
    }
```

**Screenshot Description:**
*Tools tab shows left sidebar with tool list, main area with input form fields, and bottom panel displaying formatted response with syntax highlighting*

### Notifications Pane

**Location:** Bottom panel or right sidebar

**Purpose:** Monitor server logs and notifications

**Features:**
- Real-time log streaming
- Log level filtering (INFO, WARN, ERROR, DEBUG)
- Timestamp display
- Auto-scroll toggle
- Log export
- Search/filter logs

**Example Notifications:**

```
Notifications (15)

[Filter: All ▼] [Clear] [Export]

2026-02-01 10:30:15 [INFO] Server initialized
2026-02-01 10:30:16 [INFO] GitHub token loaded
2026-02-01 10:30:20 [DEBUG] Calling tool: github_list_issues
2026-02-01 10:30:21 [DEBUG] API request: GET /repos/octocat/Hello-World/issues
2026-02-01 10:30:22 [INFO] Tool call completed successfully
2026-02-01 10:32:45 [WARN] Rate limit approaching: 45/60 remaining
2026-02-01 10:35:10 [ERROR] Authentication failed: Invalid token
2026-02-01 10:35:15 [INFO] Reconnecting with new token...
```

**Log Level Colors:**
- 🔵 DEBUG: Gray
- 🟢 INFO: Blue
- 🟡 WARN: Yellow
- 🔴 ERROR: Red

**What to Monitor:**
- Server lifecycle events (start, stop, errors)
- Tool execution traces
- API request/response details
- Warning messages (rate limits, deprecations)
- Error messages (failures, exceptions)

---

## Manual Testing with JSON-RPC

For advanced testing, you can send raw JSON-RPC messages.

### JSON-RPC Message Format

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Response (Success):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": "response_data"
  }
}
```

**Response (Error):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "details": "Additional error info"
    }
  }
}
```

### Testing Tool Discovery

**Request:**
```bash
echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}' | npx tsx src/index.ts
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "github_create_issue",
        "description": "Create a new issue in a GitHub repository",
        "inputSchema": {
          "type": "object",
          "properties": {...},
          "required": ["repository", "title"]
        }
      }
    ]
  }
}
```

### Testing Tool Execution

**Request:**
```bash
echo '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "octocat/Hello-World",
      "title": "Test issue",
      "body": "Testing from command line"
    }
  }
}' | npx tsx src/index.ts
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Created issue #456: Test issue\nURL: https://github.com/..."
      },
      {
        "type": "resource",
        "resource": {
          "uri": "github://issues/456",
          "mimeType": "application/json",
          "text": "{...}"
        }
      }
    ]
  }
}
```

### Testing Error Handling

**Invalid Tool Name:**
```bash
echo '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "nonexistent_tool",
    "arguments": {}
  }
}' | npx tsx src/index.ts
```

**Expected Error:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32601,
    "message": "Method not found: nonexistent_tool"
  }
}
```

**Invalid Parameters:**
```bash
echo '{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "invalid"
    }
  }
}' | npx tsx src/index.ts
```

**Expected Error:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "error": {
    "code": -32602,
    "message": "Invalid params: title is required"
  }
}
```

---

## Debugging with Inspector

### Common Issues and Solutions

#### Issue 1: Server Won't Start

**Symptoms:**
- Connection fails immediately
- "Command not found" errors
- Timeout during initialization

**Debugging Steps:**

1. **Verify command syntax:**
   ```bash
   # Test command separately
   node build/index.js
   npx tsx src/index.ts
   uvx mcp-server-github
   ```

2. **Check environment variables:**
   ```bash
   # Print env vars
   env | grep GITHUB_TOKEN

   # Test with explicit env
   GITHUB_TOKEN=xxx npx @modelcontextprotocol/inspector ...
   ```

3. **Inspect server logs:**
   ```bash
   # Run server directly to see errors
   node build/index.js
   # Look for initialization errors
   ```

4. **Check dependencies:**
   ```bash
   # Verify packages installed
   npm install
   pip install -r requirements.txt
   ```

**Common Fixes:**
- Rebuild TypeScript: `npm run build`
- Install dependencies: `npm install` or `pip install`
- Check Node.js version: `node --version` (need ^22.7.5)
- Verify Python environment: `which python`

#### Issue 2: Tools Not Appearing

**Symptoms:**
- Tools tab empty
- "No tools available" message

**Debugging Steps:**

1. **Verify capability negotiation:**
   - Check Server Connection pane shows `tools` capability
   - Confirm server responds to `tools/list`

2. **Check server implementation:**
   ```typescript
   // Verify handler exists
   server.setRequestHandler('tools/list', async () => ({
     tools: [/* tool definitions */],
   }));
   ```

3. **Test JSON-RPC directly:**
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
     | node build/index.js
   ```

4. **Check notifications pane for errors:**
   - Look for initialization errors
   - Check for schema validation failures

**Common Fixes:**
- Ensure `capabilities.tools: {}` in server config
- Verify tool definitions have required fields (name, description, inputSchema)
- Check for syntax errors in tool schemas

#### Issue 3: Tool Execution Fails

**Symptoms:**
- Tool returns error
- Unexpected response format
- Timeout errors

**Debugging Steps:**

1. **Check input validation:**
   - Verify all required parameters provided
   - Check parameter types match schema
   - Test with minimal valid input

2. **Inspect error messages:**
   - Read error code and message
   - Check "data" field for details
   - Look for stack traces in logs

3. **Test API directly:**
   ```bash
   # Test underlying API
   curl -H "Authorization: Bearer $TOKEN" \
     https://api.github.com/repos/octocat/Hello-World/issues
   ```

4. **Add debug logging:**
   ```typescript
   server.setRequestHandler('tools/call', async (request) => {
     console.error('Tool call:', JSON.stringify(request, null, 2));
     // ... handle tool ...
   });
   ```

**Common Fixes:**
- Validate API credentials
- Check API endpoint URLs
- Verify response parsing logic
- Handle rate limiting properly

#### Issue 4: Authentication Failures

**Symptoms:**
- 401 Unauthorized errors
- "Authentication failed" messages
- Missing credentials warnings

**Debugging Steps:**

1. **Verify environment variables:**
   ```bash
   # Check env var set
   echo $GITHUB_TOKEN

   # Check in Inspector
   # Server Connection > Environment
   ```

2. **Test credentials directly:**
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/user
   ```

3. **Check token permissions:**
   - Verify token has required scopes
   - Check token hasn't expired
   - Confirm token format correct

4. **Inspect auth header:**
   ```typescript
   console.error('Auth header:', headers.authorization);
   ```

**Common Fixes:**
- Regenerate API token
- Add required OAuth scopes
- Set environment variable correctly: `export GITHUB_TOKEN=xxx`
- Use env var substitution in config: `"${GITHUB_TOKEN}"`

### Debugging Best Practices

#### 1. Use Verbose Logging

Enable detailed logging during development:

```typescript
// TypeScript
const server = new Server({
  name: 'my-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    logging: {},  // Enable logging capability
  },
});

// Log all tool calls
server.notification({
  method: 'notifications/message',
  params: {
    level: 'debug',
    message: `Tool called: ${toolName}`,
  },
});
```

```python
# Python
import logging
logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)
logger.debug(f"Tool called: {tool_name}")
```

#### 2. Monitor Message Flow

Watch the Notifications pane for:
- Initialization sequence
- Tool discovery
- Parameter validation
- API requests/responses
- Error conditions

#### 3. Test Incrementally

Build up complexity gradually:

```typescript
// Step 1: Test basic tool
{
  name: 'hello',
  description: 'Returns hello',
  inputSchema: z.object({}),
}

// Step 2: Add simple parameter
{
  name: 'greet',
  description: 'Greets user',
  inputSchema: z.object({
    name: z.string(),
  }),
}

// Step 3: Add API call
{
  name: 'github_user',
  description: 'Get GitHub user',
  inputSchema: z.object({
    username: z.string(),
  }),
}
// ... gradually add more complexity
```

#### 4. Validate Schemas Thoroughly

Test schema validation:

```typescript
// Test valid input
const validInput = { repository: 'owner/repo', title: 'Test' };
const result = schema.parse(validInput);  // Should succeed

// Test invalid input
const invalidInput = { repository: 'owner/repo' };  // Missing title
try {
  schema.parse(invalidInput);
  console.error('Should have thrown error!');
} catch (error) {
  console.log('Validation working:', error.message);
}
```

#### 5. Handle Errors Gracefully

Provide actionable error messages:

```typescript
try {
  const result = await apiClient.request('/endpoint');
  return result;
} catch (error) {
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 401:
        throw new Error(
          'Authentication failed. Check GITHUB_TOKEN environment variable. ' +
          'Generate token at: https://github.com/settings/tokens'
        );
      case 403:
        throw new Error(
          'Permission denied. Token needs "repo" scope. ' +
          'Update token permissions at: https://github.com/settings/tokens'
        );
      case 404:
        throw new Error(
          `Resource not found: ${endpoint}. ` +
          'Verify repository name format: owner/repo'
        );
      case 429:
        throw new Error(
          'Rate limit exceeded. Wait 60 seconds before retrying. ' +
          'Check remaining: https://api.github.com/rate_limit'
        );
      default:
        throw new Error(
          `API error (${error.statusCode}): ${error.message}`
        );
    }
  }
  throw error;
}
```

---

## Best Practices for Server Testing

### Development Workflow

#### 1. Start Development

**Initial Setup:**
```bash
# Launch Inspector
npx @modelcontextprotocol/inspector npx tsx src/index.ts

# Verify:
# - Server connects successfully
# - Capabilities negotiated
# - No initialization errors
```

**Checklist:**
- [ ] Server starts without errors
- [ ] Connection status shows "Connected"
- [ ] Server info displays correctly
- [ ] Capabilities include expected features
- [ ] Environment variables loaded

#### 2. Iterative Testing

**Development Loop:**

```bash
# Make code changes
vim src/tools/create-issue.ts

# Rebuild (if TypeScript)
npm run build

# Reconnect Inspector
# Click "Reconnect" button in UI

# Test affected features
# - Call modified tool
# - Verify response
# - Check notifications for errors

# Monitor messages
# - Watch notifications pane
# - Check for warnings
# - Verify log output
```

**Efficient Iteration:**
- Use `npm run watch` for auto-rebuild
- Keep Inspector open, just reconnect
- Test only changed functionality first
- Run full test suite periodically

#### 3. Test Edge Cases

**Required Test Scenarios:**

**Empty Inputs:**
```json
{
  "repository": "",
  "title": ""
}
```
Expected: Validation error

**Missing Required Fields:**
```json
{
  "repository": "owner/repo"
  // Missing "title"
}
```
Expected: Schema validation error

**Invalid Types:**
```json
{
  "repository": "owner/repo",
  "title": 123  // Should be string
}
```
Expected: Type validation error

**Large Datasets:**
- Request with 1000+ items
- Test pagination
- Verify no timeouts
- Check memory usage

**Concurrent Operations:**
- Call multiple tools simultaneously
- Verify no race conditions
- Check response isolation
- Test error independence

**Special Characters:**
```json
{
  "title": "Bug 🐛: Database 失敗 with <>&\""
}
```
Expected: Characters preserved

#### 4. Verify Error Handling

**Test Error Scenarios:**

```typescript
// 1. Network errors
// Disconnect internet, try API call
// Expected: Clear network error message

// 2. Authentication errors
// Use invalid API key
// Expected: Actionable auth error

// 3. Rate limiting
// Make rapid requests
// Expected: Rate limit message with retry time

// 4. Invalid data
// Send malformed request
// Expected: Validation error with details

// 5. Server errors
// Force 500 response
// Expected: Graceful handling, no crash
```

**Error Message Quality:**
- Clear and specific
- Actionable (tells user what to do)
- Includes helpful links/references
- No sensitive data leaked

### Configuration Management

#### Export Server Configuration

Inspector allows exporting configuration for use in MCP clients.

**Steps:**
1. Configure server in Inspector
2. Click **Export Config**
3. Choose format:
   - Single server entry
   - Complete `mcp.json` file

**Exported Config Example:**

**Single Entry:**
```json
{
  "github": {
    "command": "npx",
    "args": [
      "@modelcontextprotocol/server-github"
    ],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Complete File:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop"
      ]
    }
  }
}
```

**Usage:**
```bash
# Copy to Claude Code
cp exported-config.json ~/.claude/mcp.json

# Copy to Cursor
cp exported-config.json ~/Library/Application\ Support/Cursor/User/mcp.json

# Copy to custom location
cp exported-config.json .agents/mcp/mcp-servers.json
```

### CLI Mode for Automation

Inspector supports CLI mode for programmatic testing:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js
```

**CLI Commands:**

**List Tools:**
```bash
mcp-inspector --cli node build/index.js list-tools
```

**Call Tool:**
```bash
mcp-inspector --cli node build/index.js call-tool \
  github_create_issue \
  '{"repository":"owner/repo","title":"Test"}'
```

**List Resources:**
```bash
mcp-inspector --cli node build/index.js list-resources
```

**Sample Prompt:**
```bash
mcp-inspector --cli node build/index.js sample-prompt \
  create_pr_description \
  '{"branch_name":"feature/test","changes":"Test changes"}'
```

**JSON Output:**
All CLI commands output JSON for easy parsing:

```json
{
  "success": true,
  "result": {
    "content": [...]
  }
}
```

**Scripting Example:**

```bash
#!/bin/bash
# test-server.sh

INSPECTOR="npx @modelcontextprotocol/inspector --cli node build/index.js"

# Test 1: List tools
echo "Testing tool discovery..."
tools=$($INSPECTOR list-tools)
if echo "$tools" | jq -e '.success' > /dev/null; then
  echo "✅ Tool discovery working"
else
  echo "❌ Tool discovery failed"
  exit 1
fi

# Test 2: Call tool
echo "Testing tool execution..."
result=$($INSPECTOR call-tool github_list_issues \
  '{"repository":"octocat/Hello-World","state":"open"}')
if echo "$result" | jq -e '.success' > /dev/null; then
  echo "✅ Tool execution working"
else
  echo "❌ Tool execution failed"
  exit 1
fi

echo "All tests passed!"
```

---

## Security Features

### Authentication

**Default Behavior:**
- Random session token generated on startup
- Token required for all requests
- Token printed to console

**Example:**
```
MCP Inspector started
Session token: a1b2c3d4e5f6...
UI: http://localhost:6274
Proxy: http://localhost:6277
```

**Disable Authentication** (not recommended):
```bash
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector ...
```

**Warning:** Only disable authentication in secure, isolated environments. Never disable in production or on shared networks.

### Network Binding

**Default:** Both services bind to `localhost` (127.0.0.1)
- UI accessible only from local machine
- Proxy accepts only local connections
- Not accessible from network

**Why This Matters:**
- Prevents unauthorized access
- Protects sensitive API keys
- Isolates testing environment

**Custom Binding** (advanced):
```bash
# Bind to specific IP (use with caution)
HOST=192.168.1.100 npx @modelcontextprotocol/inspector ...
```

### DNS Rebinding Protection

**Protection Mechanism:**
- Origin header validation
- Prevents malicious websites from accessing localhost
- Blocks unauthorized cross-origin requests

**How It Works:**
1. Inspector checks `Origin` header on requests
2. Rejects requests from unknown origins
3. Allows only trusted sources

### Bearer Token Support

For SSE authentication:

```bash
npx @modelcontextprotocol/inspector \
  --url http://localhost:3000/mcp/sse \
  --auth-token your-bearer-token
```

**Server Validation:**
```typescript
// Verify Authorization header
const authHeader = req.headers.authorization;
if (authHeader !== `Bearer ${expectedToken}`) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

---

## Advanced Configuration

### Custom Ports

```bash
# Custom UI port
PORT=8080 npx @modelcontextprotocol/inspector ...
# UI at http://localhost:8080

# Custom proxy port
PROXY_PORT=8081 npx @modelcontextprotocol/inspector ...
# Proxy at http://localhost:8081
```

### Timeout Configuration

```bash
# Set request timeout (milliseconds)
TIMEOUT=30000 npx @modelcontextprotocol/inspector ...
# 30 second timeout
```

**Timeout with Progress:**
Inspector shows progress notification for long-running requests.

### Multiple Server Configuration

**config.json:**
```json
{
  "mcpServers": {
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/tmp"]
    },
    "custom": {
      "command": "node",
      "args": ["build/index.js"],
      "env": {"API_KEY": "xxx", "DEBUG": "true"}
    }
  },
  "defaultServer": "github"
}
```

**Launch:**
```bash
npx @modelcontextprotocol/inspector --config config.json
```

**Auto-Selection:**
- Single server: Loads automatically
- Multiple servers: Shows selection dropdown
- `"defaultServer"` specified: Loads that server
- No default: User selects from dropdown

### Development Mode

For Inspector development/contribution:

```bash
git clone https://github.com/modelcontextprotocol/inspector.git
cd inspector
npm install
npm run dev
```

**Development Server:**
- UI: `http://localhost:5173` (Vite dev server)
- Proxy: `http://localhost:6277`
- Hot reload enabled
- Source maps available

---

## Troubleshooting

### Common Problems

#### Inspector Won't Start

**Error: "Command not found"**

Solution:
```bash
# Verify Node.js installed
node --version  # Should be ^22.7.5

# Verify npm available
npm --version

# Try explicit npx path
/usr/local/bin/npx @modelcontextprotocol/inspector ...
```

**Error: "Port already in use"**

Solution:
```bash
# Check what's using port 6274
lsof -i :6274

# Kill process
kill -9 <PID>

# Or use different port
PORT=8080 npx @modelcontextprotocol/inspector ...
```

#### Server Connection Fails

**Symptom:** "Failed to connect to server"

Debugging:
1. Test server command separately:
   ```bash
   node build/index.js
   # Should start without errors
   ```

2. Check for syntax errors:
   ```bash
   npx tsc --noEmit  # TypeScript
   python -m py_compile src/*.py  # Python
   ```

3. Verify dependencies installed:
   ```bash
   npm install  # Node.js
   pip install -r requirements.txt  # Python
   ```

4. Check environment variables:
   ```bash
   env | grep TOKEN
   ```

#### Tools Not Working

**Symptom:** Tool returns error or unexpected response

Debugging:
1. Check input validation:
   - Verify required fields provided
   - Check parameter types
   - Test with minimal input

2. Test API directly:
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     https://api.github.com/endpoint
   ```

3. Check notifications for errors:
   - Look for error logs
   - Check stack traces
   - Verify API responses

4. Add debug logging:
   ```typescript
   console.error('Tool input:', JSON.stringify(args, null, 2));
   const result = await apiCall(args);
   console.error('API result:', JSON.stringify(result, null, 2));
   ```

### Getting Help

**Resources:**
- **Documentation:** [modelcontextprotocol.io/docs/tools/inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- **GitHub Issues:** [github.com/modelcontextprotocol/inspector/issues](https://github.com/modelcontextprotocol/inspector/issues)
- **GitHub Discussions:** [github.com/modelcontextprotocol/inspector/discussions](https://github.com/modelcontextprotocol/inspector/discussions)
- **Debugging Guide:** [modelcontextprotocol.io/docs/tools/debugging](https://modelcontextprotocol.io/docs/tools/debugging)

**Reporting Bugs:**
Include in bug reports:
- Inspector version: `npx @modelcontextprotocol/inspector --version`
- Node.js version: `node --version`
- Operating system
- Server command used
- Error messages (full text)
- Steps to reproduce
- Expected vs actual behavior

---

## Summary

The MCP Inspector is an essential tool for MCP server development:

**Key Benefits:**
- Interactive testing without full AI client
- Real-time debugging and monitoring
- Visual response inspection
- Configuration export
- CLI automation support

**Best Practices:**
- Test early and often during development
- Use iterative development workflow
- Monitor notifications for issues
- Validate all edge cases
- Export configs for production use

**Testing Workflow:**
1. Start development with Inspector launch
2. Verify initialization and capabilities
3. Test tool discovery and schemas
4. Execute tools with various inputs
5. Test edge cases and error handling
6. Monitor logs and notifications
7. Export configuration for deployment

The Inspector streamlines MCP server development by providing immediate feedback and comprehensive testing capabilities, making it the "Postman for MCP" that every developer needs.

---

**Last Updated:** February 2026
**Inspector Version:** Latest (auto-updated via npx)
**Related Guides:** [MCP Server Builder](../references/mcp/mcp-server-builder.md), [Testing Guidelines](../../../.agents/rules/quality/testing.md)

## Sources

- [GitHub - modelcontextprotocol/inspector: Visual testing tool for MCP servers](https://github.com/modelcontextprotocol/inspector)
- [MCP Inspector - Model Context Protocol](https://modelcontextprotocol.io/docs/tools/inspector)
- [Model Context Protocol · GitHub](https://github.com/modelcontextprotocol)
- [Inspector – Model Context Protocol （MCP）](https://modelcontextprotocol.info/tools/inspector/)
- [MCP Inspector – Testing and Debugging for MCP Servers - Stainless MCP Portal](https://www.stainless.com/mcp/mcp-inspector-testing-and-debugging-mcp-servers)
