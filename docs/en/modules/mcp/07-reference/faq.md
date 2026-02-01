# MCP Frequently Asked Questions

Answers to common questions about the Model Context Protocol (MCP).

## General MCP Questions

### What is MCP?

**MCP (Model Context Protocol)** is an open standard that enables AI applications to connect with external data sources and tools. It provides a unified way for AI assistants like Claude, Cursor, and Gemini to access context from various sources including databases, APIs, file systems, and custom services.

### How does MCP work?

MCP uses a **client-server architecture**:

1. **MCP Servers** expose data and tools through a standardized protocol
2. **MCP Clients** (AI applications) connect to these servers
3. Communication happens through **JSON-RPC 2.0** messages
4. Servers can provide **resources**, **tools**, and **prompts**

The protocol defines standard message formats, allowing any compatible client to work with any compatible server.

### What's the difference between MCP and APIs?

| Aspect | Traditional APIs | MCP |
|--------|-----------------|-----|
| **Purpose** | General data exchange | AI context and tool access |
| **Protocol** | REST, GraphQL, gRPC | JSON-RPC 2.0 over stdio/SSE |
| **Discovery** | Manual integration | Automatic capability discovery |
| **Security** | OAuth, API keys | Environment variables, auth handlers |
| **Use Case** | Any application | AI assistants specifically |

MCP is **specialized for AI workflows**, providing semantic context and tool descriptions that AI models can understand.

### Who created MCP?

MCP was developed by **Anthropic** and released as an open standard. It's maintained as an open-source project with community contributions.

### Is MCP only for Claude?

**No.** While developed by Anthropic, MCP is an **open protocol** supported by multiple platforms:

- **Claude Code** (Anthropic)
- **Cursor** (Anysphere)
- **Gemini CLI** (Google)
- **Cline** (VS Code extension)
- **Other AI tools** implementing the protocol

### What programming languages are supported?

MCP servers can be written in **any language** that supports:
- JSON-RPC 2.0 communication
- stdio or HTTP/SSE transport

**Official SDKs:**
- **TypeScript/JavaScript** - Most mature, full-featured
- **Python** - Growing ecosystem, good documentation

**Community SDKs:**
- **Go** - Third-party implementations available
- **Rust** - Emerging support
- **Others** - Check the MCP ecosystem

### Do I need to host MCP servers?

**No.** Most MCP servers run **locally** on your machine:

- **stdio transport** - Servers run as child processes
- **No network hosting** required for personal use
- **SSE transport** - Optional for remote access

For team use, you can host SSE servers on internal infrastructure.

## Getting Started Questions

### How do I install MCP?

**For users** (installing pre-built servers):

```bash
# Example: Installing Context7 MCP server
npx -y @context7/mcp
```

**For developers** (building servers):

```bash
# TypeScript/JavaScript
npm install @modelcontextprotocol/sdk

# Python
pip install mcp
```

See platform-specific setup in [Platform Guides](../04-platform-guides/index.md).

### Which platform should I use MCP with?

Choose based on your workflow:

| Platform | Best For | MCP Support |
|----------|----------|-------------|
| **Claude Code** | Command-line workflows | Full stdio + SSE |
| **Cursor** | VS Code users, coding tasks | Full stdio + SSE |
| **Gemini CLI** | Google AI ecosystem | Full stdio + SSE |
| **Cline** | VS Code extension users | Full stdio |

All platforms support project-level and global MCP configurations.

### What's the easiest way to try MCP?

**Quick start** with a pre-built server:

1. **Choose a platform** (e.g., Claude Code, Cursor)

2. **Install a simple server** (e.g., filesystem):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

3. **Verify connection**:

```bash
claude mcp list
# Should show "filesystem" server
```

4. **Use it**:
```
Read the contents of my documents folder
```

### Where do I find MCP servers?

**Official sources:**
- [Anthropic MCP Servers](https://github.com/modelcontextprotocol/servers) - Official collection
- [Context7 Dashboard](https://context7.com/dashboard) - Documentation server
- Platform marketplaces (coming soon)

**Community sources:**
- [awesome-mcp](https://github.com/punkpeye/awesome-mcp) - Curated list
- GitHub search: `mcp-server` topic
- npm: Search for `@modelcontextprotocol/`

### How do I know if a server is working?

**Test server connection:**

```bash
# Claude Code
claude mcp list

# Cursor
# Check Settings → MCP Servers → Status indicator

# Gemini CLI
gemini mcp list
```

**Test server functionality:**
```
# In chat
List available tools from [server-name]
```

**Check logs:**
- Claude Code: `~/.claude/logs/`
- Cursor: VS Code Output panel → MCP
- Gemini CLI: `~/.gemini/logs/`

## Server Development Questions

### How do I create my own MCP server?

**Basic TypeScript example:**

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Define a tool
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "my-tool",
      description: "Does something useful",
      inputSchema: {
        type: "object",
        properties: {
          input: { type: "string" },
        },
      },
    },
  ],
}));

// Implement tool logic
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "my-tool") {
    return {
      content: [
        {
          type: "text",
          text: `Processed: ${args.input}`,
        },
      ],
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**See full guide:** [Creating Servers](../03-creating-servers/index.md)

### What's the difference between resources, tools, and prompts?

| Feature | Resources | Tools | Prompts |
|---------|-----------|-------|---------|
| **Purpose** | Provide data | Perform actions | Template workflows |
| **Direction** | Server → Client | Client → Server | Client → Server |
| **Caching** | Yes (typically) | No | No |
| **Examples** | Files, docs, DB records | API calls, file writes | "Analyze code", "Write docs" |

**Resources:** "Here's some data you can use"
**Tools:** "I can do this action for you"
**Prompts:** "Here's a common workflow"

### How do I handle authentication in MCP servers?

**Environment variables** (recommended for local):

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

```bash
# Set in shell
export MY_API_KEY="sk-..."
```

**Custom auth handler** (for advanced cases):

```typescript
server.setRequestHandler("auth/authenticate", async (request) => {
  const { token } = request.params;

  // Validate token
  if (await validateToken(token)) {
    return { authenticated: true };
  }

  throw new Error("Authentication failed");
});
```

**See:** [Authentication Guide](../02-using-mcp/authentication.md)

### Can MCP servers call other APIs?

**Yes!** MCP servers are regular programs that can:

- Make HTTP requests to any API
- Query databases
- Run system commands
- Call other services

**Example:**

```typescript
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "search-api") {
    const query = request.params.arguments.query;

    // Call external API
    const response = await fetch(`https://api.example.com/search?q=${query}`);
    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
});
```

### How do I test my MCP server?

**1. Unit tests** (test individual functions):

```typescript
import { describe, it, expect } from "vitest";
import { myTool } from "./server.js";

describe("myTool", () => {
  it("processes input correctly", () => {
    const result = myTool({ input: "test" });
    expect(result).toBe("Processed: test");
  });
});
```

**2. Integration tests** (test server communication):

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
  name: "test-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "node",
  args: ["./server.js"],
});

await client.connect(transport);

const tools = await client.request({
  method: "tools/list",
});

expect(tools.tools).toHaveLength(1);
```

**3. Manual testing** (test with AI client):

```bash
# Add to config, then use in chat
claude "Use my-server to process 'hello'"
```

### Can I publish my MCP server?

**Yes!** Options:

**1. npm package** (TypeScript/JavaScript):

```bash
npm publish
```

```json
{
  "name": "@yourusername/mcp-server-name",
  "version": "1.0.0",
  "bin": {
    "mcp-server-name": "./dist/index.js"
  }
}
```

**2. PyPI package** (Python):

```bash
python -m build
twine upload dist/*
```

**3. GitHub repository:**
- Tag with `mcp-server` topic
- Include clear README with installation
- Add to awesome-mcp list

**4. Platform marketplaces** (coming soon)

## Platform-Specific Questions

### Can I use the same MCP server across all platforms?

**Yes!** MCP is a standard protocol. A well-built server works with all clients.

**Configuration differs slightly:**

```json
// Cursor (.cursor/mcp.json)
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-server"]
    }
  }
}

// Claude Code (.claude/mcp.json)
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-server"]
    }
  }
}

// Gemini CLI (.gemini/settings.json)
{
  "mcp": {
    "servers": {
      "my-server": {
        "command": "npx",
        "args": ["-y", "my-server"]
      }
    }
  }
}
```

### Does Antigravity support project-level MCP?

**No.** Antigravity (Gemini's web-based agent) has a key limitation:

- ❌ **No project-level MCP** configurations
- ✅ **Global MCP only** (`~/.gemini/antigravity/mcp_config.json`)
- ✅ Other Gemini CLI modes support project-level

**Workaround:** Configure once globally for all projects.

**See:** [Antigravity Limitation](../04-platform-guides/antigravity.md)

### How do I configure MCP for multiple projects?

**Project-level configs:**

```
project-1/
  .cursor/mcp.json    # Project 1 servers
  .claude/mcp.json

project-2/
  .cursor/mcp.json    # Project 2 servers (different)
  .claude/mcp.json
```

**Global configs** (fallback):

```
~/.cursor/mcp.json    # Available to all projects
~/.claude/mcp.json
~/.gemini/settings.json
```

**Precedence:** Project configs override global configs.

### Can I share MCP configurations with my team?

**Yes!** Commit platform configs to version control:

```bash
git add .cursor/mcp.json
git add .claude/mcp.json
git add .gemini/settings.json
git commit -m "Add MCP server configurations"
```

**Important:** Use environment variables for secrets:

```json
{
  "mcpServers": {
    "api-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${TEAM_API_KEY}"
      }
    }
  }
}
```

Team members set `TEAM_API_KEY` locally.

## Performance and Scalability Questions

### How fast are MCP server calls?

**Typical latency:**

- **stdio transport:** 10-100ms (local process)
- **SSE transport:** 50-500ms (network + processing)
- **Complex operations:** Depends on tool logic

**Factors affecting speed:**
- Transport type (stdio faster than SSE)
- Server implementation (sync vs async)
- External API calls (if any)
- Data size returned

### Can I cache MCP responses?

**Built-in caching:**

MCP clients automatically cache **resources** based on their URIs.

```typescript
// This resource will be cached
server.setRequestHandler("resources/read", async (request) => {
  return {
    contents: [
      {
        uri: "file:///path/to/file.txt",
        mimeType: "text/plain",
        text: "Cached content",
      },
    ],
  };
});
```

**Custom caching:**

```typescript
const cache = new Map();

server.setRequestHandler("tools/call", async (request) => {
  const cacheKey = JSON.stringify(request.params);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await expensiveOperation();
  cache.set(cacheKey, result);

  return result;
});
```

### How many MCP servers can I run simultaneously?

**Practical limits:**

- **stdio servers:** 10-20 concurrent servers (process limit)
- **SSE servers:** Unlimited (network-based)
- **Memory:** Each server uses 20-100MB typically

**Recommendation:** Start with 3-5 essential servers, add as needed.

### Can MCP handle large datasets?

**Strategies for large data:**

**1. Pagination:**

```typescript
server.setRequestHandler("resources/list", async (request) => {
  const { cursor } = request.params;
  const pageSize = 100;
  const offset = cursor ? parseInt(cursor) : 0;

  const items = await fetchItems(offset, pageSize);

  return {
    resources: items,
    nextCursor: items.length === pageSize ? String(offset + pageSize) : undefined,
  };
});
```

**2. Streaming:**

```typescript
server.setRequestHandler("resources/read", async (request) => {
  const stream = createReadStream(filePath);

  // Return in chunks
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk.toString());
  }

  return {
    contents: [
      {
        uri: request.params.uri,
        text: chunks.join(""),
      },
    ],
  };
});
```

**3. Compression:**

```typescript
import { gzip } from "zlib";

const compressed = await gzip(largeData);
return {
  content: [{
    type: "text",
    text: compressed.toString("base64"),
  }],
};
```

## Security Questions

### Is MCP secure?

**Security depends on implementation:**

**Built-in protections:**
- stdio servers run with user's permissions (sandboxed)
- No automatic network access
- Explicit tool invocation required

**Your responsibility:**
- Validate all inputs
- Sanitize file paths
- Secure API credentials
- Review third-party servers

**See:** [Security Guidelines](../05-advanced/security.md)

### How do I secure API keys in MCP?

**Best practices:**

**1. Environment variables:**

```bash
# .env (DON'T commit)
MY_API_KEY=sk-abc123

# Load in shell
export $(cat .env | xargs)
```

**2. Config references:**

```json
{
  "mcpServers": {
    "secure-server": {
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

**3. Secret management:**

```typescript
// Use secret manager (AWS, 1Password, etc.)
import { getSecret } from "./secrets.js";

const apiKey = await getSecret("MY_API_KEY");
```

**NEVER:**
- ❌ Hardcode keys in server code
- ❌ Commit keys to git
- ❌ Share keys in configs

### Can MCP servers access my entire filesystem?

**It depends on the server:**

**Safe servers** (like official filesystem server):
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/allowed/path/only"  // Restricted access
  ]
}
```

**Unsafe servers:**
```typescript
// A malicious server could do:
import { readFileSync } from "fs";
const sensitiveData = readFileSync("/etc/passwd");
```

**Protection:**
- Only install trusted servers
- Review server code before using
- Use path restrictions where available
- Run servers with minimal permissions

### How do I audit MCP server activity?

**Enable logging:**

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "LOG_LEVEL": "debug",
        "LOG_FILE": "/path/to/server.log"
      }
    }
  }
}
```

**Check platform logs:**

```bash
# Claude Code
tail -f ~/.claude/logs/mcp.log

# Cursor
# VS Code → Output → MCP

# Gemini CLI
tail -f ~/.gemini/logs/mcp.log
```

**Implement audit logging:**

```typescript
server.setRequestHandler("tools/call", async (request) => {
  console.log(`[AUDIT] Tool called: ${request.params.name}`);
  console.log(`[AUDIT] Arguments:`, request.params.arguments);
  console.log(`[AUDIT] Timestamp:`, new Date().toISOString());

  const result = await handleTool(request);

  console.log(`[AUDIT] Result:`, result);
  return result;
});
```

## Troubleshooting Quick Answers

### Why doesn't my MCP server appear?

**Common causes:**

1. **Invalid JSON syntax:**
```bash
# Validate config
jq empty .cursor/mcp.json
```

2. **Wrong command/path:**
```bash
# Test command manually
npx -y @modelcontextprotocol/server-filesystem /tmp
```

3. **Missing dependencies:**
```bash
# Install globally
npm install -g @modelcontextprotocol/server-filesystem
```

4. **Platform not restarted:**
- Restart Cursor/Claude/Gemini after config changes

### How do I debug MCP connection issues?

**1. Check server status:**

```bash
claude mcp list
```

**2. Test server directly:**

```bash
# Run server command manually
npx -y @modelcontextprotocol/server-filesystem /tmp

# Should start and wait for input
```

**3. Check logs:**

```bash
# Claude Code
cat ~/.claude/logs/mcp.log | grep ERROR

# Cursor
# VS Code → Output → MCP → Check for errors
```

**4. Enable verbose logging:**

```json
{
  "mcpServers": {
    "my-server": {
      "env": {
        "DEBUG": "*"
      }
    }
  }
}
```

### Why are my tool calls failing?

**Check input schema:**

```typescript
// Server defines:
inputSchema: {
  type: "object",
  properties: {
    path: { type: "string" },  // Required
  },
  required: ["path"],
}

// But you're calling with:
{ file: "test.txt" }  // Wrong property name!

// Should be:
{ path: "test.txt" }  // Correct
```

**Validate in server:**

```typescript
server.setRequestHandler("tools/call", async (request) => {
  const { path } = request.params.arguments;

  if (!path) {
    throw new Error("path argument is required");
  }

  // Process tool...
});
```

### How do I fix "command not found" errors?

**Issue:** Platform can't find the server executable.

**Solutions:**

**1. Use full path:**

```json
{
  "command": "/usr/local/bin/node",
  "args": ["/full/path/to/server.js"]
}
```

**2. Use npx for npm packages:**

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem"]
}
```

**3. Install globally:**

```bash
npm install -g my-mcp-server
which my-mcp-server  # Verify installation
```

**4. Add to PATH:**

```bash
export PATH="$PATH:/path/to/server/bin"
```

### Why is my server slow?

**Common bottlenecks:**

**1. Synchronous operations:**

```typescript
// Bad (blocking)
const data = fs.readFileSync("large-file.txt");

// Good (non-blocking)
const data = await fs.promises.readFile("large-file.txt");
```

**2. No caching:**

```typescript
// Add caching
const cache = new Map();

if (cache.has(key)) {
  return cache.get(key);
}

const result = await expensiveOperation();
cache.set(key, result);
```

**3. Large responses:**

```typescript
// Paginate or summarize
return {
  content: [{
    type: "text",
    text: `Found ${results.length} items. Showing first 10: ${results.slice(0, 10)}`,
  }],
};
```

## Advanced Topics

### Can I create a multi-tool MCP server?

**Yes!** Most servers expose multiple tools:

```typescript
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "read-file",
      description: "Read a file",
      inputSchema: { /* ... */ },
    },
    {
      name: "write-file",
      description: "Write a file",
      inputSchema: { /* ... */ },
    },
    {
      name: "list-files",
      description: "List files",
      inputSchema: { /* ... */ },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  switch (request.params.name) {
    case "read-file":
      return await handleRead(request.params.arguments);
    case "write-file":
      return await handleWrite(request.params.arguments);
    case "list-files":
      return await handleList(request.params.arguments);
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});
```

### How do I implement server-side subscriptions?

**For dynamic resources that change:**

```typescript
import { EventEmitter } from "events";

const emitter = new EventEmitter();

server.setNotificationHandler("notifications/subscribe", async (notification) => {
  const { uri } = notification.params;

  // Watch for changes
  fs.watch(uri, () => {
    emitter.emit("resource-updated", { uri });
  });

  return { subscribed: true };
});

// Notify clients of changes
emitter.on("resource-updated", ({ uri }) => {
  server.sendNotification({
    method: "notifications/resources/updated",
    params: { uri },
  });
});
```

### Can I use MCP with streaming responses?

**MCP doesn't support streaming in the protocol**, but you can:

**1. Return iteratively:**

```typescript
// Return progress updates
return {
  content: [
    { type: "text", text: "Processing step 1..." },
    { type: "text", text: "Processing step 2..." },
    { type: "text", text: "Complete!" },
  ],
};
```

**2. Use SSE for events:**

With SSE transport, you can send progress notifications:

```typescript
// Send progress events
server.sendNotification({
  method: "notifications/progress",
  params: {
    id: "task-123",
    progress: 0.5,
    message: "50% complete",
  },
});
```

**3. Poll for updates:**

```typescript
// Tool returns task ID
const taskId = await startLongTask();
return { taskId };

// Separate tool to check status
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "check-task") {
    const status = await getTaskStatus(request.params.arguments.taskId);
    return { status };
  }
});
```

### How do I version my MCP server?

**Semantic versioning:**

```json
{
  "name": "my-mcp-server",
  "version": "1.2.3"
}
```

**Breaking changes (2.0.0):**
- Change tool input schemas
- Remove tools/resources
- Change behavior significantly

**Features (1.2.0):**
- Add new tools
- Add optional parameters
- Enhance existing functionality

**Fixes (1.2.1):**
- Bug fixes
- Performance improvements
- Security patches

**Communicate in server info:**

```typescript
const server = new Server({
  name: "my-server",
  version: "1.2.3",
}, {
  capabilities: {
    resources: {},
    tools: {},
  },
});
```

### Can I create a distributed MCP system?

**Yes**, using SSE transport:

**Architecture:**

```
[Claude Code] ──SSE──> [MCP Gateway] ──> [Backend Service 1]
                                      ──> [Backend Service 2]
                                      ──> [Database]
```

**Gateway server:**

```typescript
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});

app.post("/message", async (req, res) => {
  // Handle messages from client
});

app.listen(3000);
```

**Client config:**

```json
{
  "mcpServers": {
    "gateway": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

## Related Documentation

- **Getting Started:** [Using MCP](../02-using-mcp/index.md)
- **Platform Guides:** [Platform-Specific Setup](../04-platform-guides/index.md)
- **Creating Servers:** [Server Development](../03-creating-servers/index.md)
- **Advanced Topics:** [Security & Best Practices](../05-advanced/index.md)
- **Troubleshooting:** [Common Issues](troubleshooting.md)

## Still Have Questions?

- **MCP Repository:** [GitHub Discussions](https://github.com/modelcontextprotocol/sdk/discussions)
- **Community:** [Discord/Slack channels]
- **Documentation:** [Official MCP Docs](https://modelcontextprotocol.io)
- **Examples:** [MCP Servers Collection](https://github.com/modelcontextprotocol/servers)
