# MCP Session Lifecycle

Understanding the MCP session lifecycle is critical for building reliable clients and servers. Unlike stateless HTTP APIs, MCP is a **stateful protocol** that requires proper initialization, capability negotiation, and graceful shutdown. This guide walks through each phase of an MCP session from connection to termination.

## Overview

An MCP session goes through four distinct phases:

1. **Connection Phase** - Establishing the transport channel
2. **Initialization Phase** - Protocol handshake and capability negotiation
3. **Operation Phase** - Active communication and feature usage
4. **Shutdown Phase** - Graceful termination and cleanup

Each phase has specific requirements and responsibilities for both clients and servers. Understanding this lifecycle ensures robust, predictable behavior in your MCP implementations.

---

## Lifecycle Phases

### 1. Connection Phase

The connection phase establishes the underlying transport channel between client and server. The transport mechanism depends on the deployment scenario.

**Transport Options:**

#### Stdio Transport
Used for local processes on the same machine:

```bash
# Client spawns server process
npx -y @modelcontextprotocol/server-filesystem /path/to/data
```

**Characteristics:**
- Direct process communication via stdin/stdout
- Optimal performance, no network overhead
- Server lifecycle managed by client
- Automatic cleanup when client terminates

#### HTTP with Server-Sent Events (SSE)
Used for remote server communication:

```
Connection flow:
Client → POST /messages → Server (JSON-RPC requests)
Client ← SSE /sse → Server (JSON-RPC responses/notifications)
```

**Characteristics:**
- Remote server communication
- HTTP authentication support (Bearer tokens, API keys, OAuth)
- Bidirectional communication via separate channels
- Network latency considerations

**Connection Established:** Once the transport channel is ready, the initialization phase begins.

---

### 2. Initialization Phase

The initialization phase performs a three-step handshake to establish the MCP session:

1. Client sends `initialize` request
2. Server responds with capabilities
3. Client confirms with `initialized` notification

#### Step 1: Initialize Request

The client initiates the session by sending an `initialize` request:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {},
      "sampling": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

**Key Fields:**

- **`protocolVersion`**: MCP protocol version the client supports
  - Format: `YYYY-MM-DD` (ISO 8601 date)
  - Current version: `2025-06-18`
  - Used for protocol version negotiation

- **`capabilities`**: Client capabilities exposed to server
  - Empty object `{}` indicates capability is supported
  - Omitting a capability means it's not supported
  - Common capabilities: `elicitation`, `sampling`, `logging`

- **`clientInfo`**: Client identification
  - `name`: Human-readable client name
  - `version`: Client version string
  - Used for debugging and logging

#### Step 2: Initialize Response

The server responds with its own capabilities and metadata:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "prompts": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    },
    "instructions": "Use the available tools to query data. Resources provide schema information."
  }
}
```

**Key Fields:**

- **`protocolVersion`**: Server's protocol version
  - Must match or be compatible with client version
  - Clients should validate compatibility

- **`capabilities`**: Server capabilities
  - `tools`: Indicates tool support
    - `listChanged`: Server will send notifications when tools change
  - `resources`: Indicates resource support
    - `subscribe`: Supports resource subscriptions
    - `listChanged`: Notifies on resource list changes
  - `prompts`: Indicates prompt support
    - `listChanged`: Notifies on prompt list changes

- **`serverInfo`**: Server identification
  - `name`: Server name
  - `version`: Server version

- **`instructions`** (optional): Usage instructions for AI models
  - Free-form text describing how to use the server
  - Helps LLMs understand server capabilities

#### Step 3: Initialized Notification

After receiving the server's response, the client confirms readiness:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

**Purpose:**
- Confirms client has processed server capabilities
- Signals server can now send notifications
- Completes the initialization handshake

**Important:** This is a JSON-RPC **notification** (no `id` field), not a request. The server does not respond.

---

## Capability Negotiation

Capability negotiation is a critical part of initialization. It allows clients and servers to communicate which features they support, enabling graceful degradation and feature detection.

### How Capability Negotiation Works

1. **Declaration Phase**: During initialization, both sides declare supported capabilities
2. **Discovery Phase**: Each side examines the other's capabilities
3. **Operation Phase**: Only mutually supported features are used

### Server Capabilities

Servers declare what **primitives** they expose:

```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    },
    "resources": {
      "subscribe": true,
      "listChanged": true
    },
    "prompts": {
      "listChanged": true
    }
  }
}
```

**Capability Flags:**

- **`listChanged`**: Server will send notifications when the list of items changes
  - Enables dynamic updates
  - Client should re-fetch list when notified

- **`subscribe`** (resources only): Supports resource subscriptions
  - Allows clients to subscribe to resource changes
  - Server sends updates when subscribed resources change

**Omitted Capabilities:**
If a server doesn't include a capability (e.g., `prompts`), the client should assume it's not supported and not attempt to use related methods.

### Client Capabilities

Clients declare what **services** they offer to servers:

```json
{
  "capabilities": {
    "elicitation": {},
    "sampling": {
      "maxTokens": 4000
    },
    "logging": {}
  }
}
```

**Client Capabilities:**

- **`elicitation`**: Client can prompt users for additional input
  - Servers can request user confirmation or additional parameters

- **`sampling`**: Client can provide LLM completions
  - `maxTokens` (optional): Maximum tokens per completion
  - Allows servers to request AI completions without embedding an LLM

- **`logging`**: Client accepts log messages from server
  - Enables server debugging and monitoring

### Protocol Version Agreement

Both sides specify their supported protocol version:

```json
{
  "protocolVersion": "2025-06-18"
}
```

**Version Compatibility:**

- **Exact match**: Both use the same version (ideal)
- **Minor differences**: Clients should handle gracefully
- **Major incompatibility**: Client should reject and close connection

**Best Practice:**
Always validate protocol version compatibility before proceeding with operations:

```typescript
if (serverVersion !== clientVersion) {
  if (isCompatible(serverVersion, clientVersion)) {
    logger.warn(`Protocol version mismatch: ${clientVersion} vs ${serverVersion}`);
  } else {
    throw new Error(`Incompatible protocol version: ${serverVersion}`);
  }
}
```

---

## Operation Phase

Once initialization completes, the session enters the **operation phase** where actual work happens. During this phase, clients and servers exchange requests, responses, and notifications.

### Request-Response Pattern

Most MCP operations follow the standard JSON-RPC request-response pattern:

```json
// Client requests available tools
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// Server responds with tool list
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "query_database",
        "description": "Execute SQL queries",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {"type": "string"}
          },
          "required": ["query"]
        }
      }
    ]
  }
}
```

**Request Rules:**
- Must include `id` field (for matching responses)
- `method` specifies the operation
- `params` contains operation-specific parameters

**Response Rules:**
- Must include matching `id` from request
- Either `result` (success) or `error` (failure)
- Never both result and error

### Notifications

Notifications enable real-time, event-driven updates without request-response overhead.

**Key Characteristics:**
- No `id` field (not expecting a response)
- One-way message (fire-and-forget)
- Must be declared during capability negotiation

#### Example: Tool List Changed

When a server's available tools change (e.g., based on state or context), it notifies the client:

```json
// Server sends notification
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Client Response:**
The client should re-fetch the tool list to get updated information:

```json
// Client requests fresh tool list
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/list"
}
```

#### Example: Resource Updated

When a subscribed resource changes, the server notifies the client:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "file:///project/config.json"
  }
}
```

**Client Response:**
The client should re-read the resource to get the latest content:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/read",
  "params": {
    "uri": "file:///project/config.json"
  }
}
```

### Common Operation Patterns

#### Discovery Pattern
```
Client → tools/list → Server
Client ← tools[] ← Server
```

Client discovers what the server offers before using features.

#### Execution Pattern
```
Client → tools/call → Server
Client ← result ← Server
```

Client executes a discovered tool with specific arguments.

#### Subscription Pattern
```
Client → resources/subscribe → Server
Server → notifications/resources/updated → Client
Client → resources/read → Server
```

Client subscribes to changes, receives notifications, fetches updates.

---

## Notifications System

MCP's notification system enables **real-time updates** and **dynamic capabilities** without polling.

### Notification Types

#### 1. List Changed Notifications

Inform clients when available items change:

**Tool List Changed:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Resource List Changed:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}
```

**Prompt List Changed:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}
```

**When to Send:**
- Tool added/removed dynamically
- Resource availability changes
- Prompt templates updated
- Context-dependent features change

#### 2. Resource Update Notifications

Inform subscribers when resource content changes:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "database://schema/users"
  }
}
```

**When to Send:**
- Subscribed resource modified
- File content changes
- Database schema updates
- API data refreshed

#### 3. Progress Notifications

Report progress for long-running operations:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "operation-123",
    "progress": 50,
    "total": 100
  }
}
```

**Use Cases:**
- Large file processing
- Batch operations
- Multi-step workflows
- Time-consuming computations

### Benefits of Notifications

1. **Efficiency**: No polling required for updates
2. **Real-time**: Immediate updates when changes occur
3. **Consistency**: Always accurate information
4. **Resource-friendly**: Reduces unnecessary requests
5. **Dynamic environments**: Tools/resources adapt to context

### Implementing Notifications

**Server Side:**

```typescript
// Check capability was negotiated
if (clientCapabilities.tools?.listChanged) {
  // When tools change
  server.notification({
    method: "notifications/tools/list_changed"
  });
}
```

**Client Side:**

```typescript
// Handle incoming notification
session.on("notification", async (notification) => {
  if (notification.method === "notifications/tools/list_changed") {
    // Refresh tool list
    const tools = await session.listTools();
    updateAvailableTools(tools);
  }
});
```

---

## Shutdown Phase

Proper shutdown ensures clean termination of MCP sessions and prevents resource leaks.

### Graceful Shutdown Process

There is no explicit shutdown handshake in MCP. Instead, shutdown happens through:

**Stdio Transport:**
- Client closes server process stdin
- Server detects EOF on stdin
- Server performs cleanup and exits

**HTTP/SSE Transport:**
- Client closes SSE connection
- Server detects connection closure
- Server releases session resources

### Shutdown Best Practices

**Server Side:**

```typescript
// Handle stdin EOF (stdio)
process.stdin.on("end", async () => {
  await cleanup();
  process.exit(0);
});

// Handle connection closure (HTTP/SSE)
connection.on("close", async () => {
  await cleanupSession(sessionId);
});
```

**Client Side:**

```typescript
// Graceful shutdown
async function shutdown() {
  try {
    // Stop sending new requests
    session.close();

    // Wait for pending operations (with timeout)
    await waitForPendingOperations(5000);
  } finally {
    // Terminate transport
    transport.close();
  }
}
```

### Handling Abnormal Termination

**Timeout Scenarios:**
```typescript
// Request timeout
const response = await session.request(request, {
  timeout: 30000 // 30 seconds
});
```

**Connection Loss:**
```typescript
// Detect broken connection
connection.on("error", (error) => {
  logger.error("Connection lost", error);
  attemptReconnect();
});
```

**Server Crashes:**
```typescript
// Stdio: process exit detection
serverProcess.on("exit", (code) => {
  if (code !== 0) {
    logger.error(`Server crashed with code ${code}`);
    handleServerFailure();
  }
});
```

---

## Session Management

Effective session management ensures reliability and proper resource handling.

### Session State Tracking

**Minimum Session State:**
```typescript
interface SessionState {
  phase: "connecting" | "initializing" | "ready" | "closing" | "closed";
  protocolVersion: string;
  serverCapabilities: Capabilities;
  clientCapabilities: Capabilities;
  pendingRequests: Map<number, Request>;
}
```

**State Transitions:**
```
connecting → initializing → ready → closing → closed
     ↓            ↓           ↓         ↓
   [error] → [error] → [error] → [error]
```

### Request Tracking

Track in-flight requests to handle responses correctly:

```typescript
class Session {
  private requestId = 0;
  private pending = new Map<number, Deferred<Response>>();

  async request(method: string, params?: any): Promise<any> {
    const id = ++this.requestId;
    const deferred = new Deferred<Response>();

    this.pending.set(id, deferred);

    await this.send({
      jsonrpc: "2.0",
      id,
      method,
      params
    });

    return deferred.promise;
  }

  handleResponse(response: Response) {
    const deferred = this.pending.get(response.id);
    if (deferred) {
      this.pending.delete(response.id);

      if (response.error) {
        deferred.reject(response.error);
      } else {
        deferred.resolve(response.result);
      }
    }
  }
}
```

### Keepalive Mechanisms

**Ping/Pong (if needed for long-lived connections):**
```json
// Periodic keepalive
{
  "jsonrpc": "2.0",
  "method": "ping"
}

// Server response
{
  "jsonrpc": "2.0",
  "method": "pong"
}
```

**Note:** MCP specification doesn't mandate ping/pong. Implement only if your transport requires it.

---

## Error Handling During Lifecycle

Robust error handling is essential at every lifecycle phase.

### Initialization Errors

**Protocol Version Mismatch:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": "Unsupported protocol version: 2024-01-01"
  }
}
```

**Solution:** Check server's supported versions, upgrade client/server if needed.

**Missing Required Capabilities:**
```typescript
// Validate server has required capabilities
if (!serverCapabilities.tools) {
  throw new Error("Server does not support tools");
}
```

### Operation Errors

**Method Not Found:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "error": {
    "code": -32601,
    "message": "Method not found: tools/execute"
  }
}
```

**Invalid Parameters:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": "Missing required field: query"
  }
}
```

**Tool Execution Failure:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "error": {
    "code": -32000,
    "message": "Tool execution failed",
    "data": "Database connection timeout"
  }
}
```

### Error Recovery Strategies

**Retry with Backoff:**
```typescript
async function requestWithRetry(
  session: Session,
  method: string,
  params: any,
  maxRetries = 3
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await session.request(method, params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

**Graceful Degradation:**
```typescript
// Fallback if feature unavailable
async function getTools(session: Session): Promise<Tool[]> {
  try {
    const response = await session.request("tools/list");
    return response.tools;
  } catch (error) {
    if (error.code === -32601) {
      // Method not found - server doesn't support tools
      logger.warn("Server does not support tools");
      return [];
    }
    throw error;
  }
}
```

---

## Complete Lifecycle Example

Here's a complete example showing all lifecycle phases:

```typescript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

async function mcpSessionExample() {
  // ============================================
  // PHASE 1: CONNECTION
  // ============================================
  console.log("Phase 1: Establishing connection...");

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp/data"]
  });

  const client = new Client({
    name: "example-client",
    version: "1.0.0"
  }, {
    capabilities: {
      sampling: {},
      elicitation: {}
    }
  });

  await client.connect(transport);
  console.log("✅ Connection established");

  // ============================================
  // PHASE 2: INITIALIZATION
  // ============================================
  console.log("\nPhase 2: Initializing session...");

  // SDK handles initialization automatically via connect()
  // Manual equivalent:
  // 1. Client sends initialize request
  // 2. Server responds with capabilities
  // 3. Client sends initialized notification

  const serverCapabilities = client.getServerCapabilities();
  console.log("Server capabilities:", serverCapabilities);
  console.log("✅ Initialization complete");

  // ============================================
  // PHASE 3: OPERATION
  // ============================================
  console.log("\nPhase 3: Operation phase...");

  // Discovery: List available resources
  const resourcesResponse = await client.listResources();
  console.log(`Found ${resourcesResponse.resources.length} resources`);

  // Execution: Read a resource
  if (resourcesResponse.resources.length > 0) {
    const uri = resourcesResponse.resources[0].uri;
    const contentResponse = await client.readResource({ uri });
    console.log(`Read resource: ${uri}`);
  }

  // Discovery: List available tools
  const toolsResponse = await client.listTools();
  console.log(`Found ${toolsResponse.tools.length} tools`);

  // Execution: Call a tool
  if (toolsResponse.tools.length > 0) {
    const toolName = toolsResponse.tools[0].name;
    const result = await client.callTool({
      name: toolName,
      arguments: { path: "/tmp/data" }
    });
    console.log(`Tool result:`, result.content);
  }

  // Handle notifications (if server sends them)
  client.setNotificationHandler("notifications/tools/list_changed", async () => {
    console.log("🔔 Tools changed - refreshing list");
    const updated = await client.listTools();
    console.log(`Updated tool count: ${updated.tools.length}`);
  });

  console.log("✅ Operations complete");

  // ============================================
  // PHASE 4: SHUTDOWN
  // ============================================
  console.log("\nPhase 4: Shutting down...");

  await client.close();
  console.log("✅ Session closed gracefully");
}

// Run example
mcpSessionExample().catch(console.error);
```

**Expected Output:**
```
Phase 1: Establishing connection...
✅ Connection established

Phase 2: Initializing session...
Server capabilities: {
  tools: { listChanged: true },
  resources: { subscribe: true, listChanged: true }
}
✅ Initialization complete

Phase 3: Operation phase...
Found 5 resources
Read resource: file:///tmp/data/config.json
Found 3 tools
Tool result: [{ type: "text", text: "Directory listing: ..." }]
✅ Operations complete

Phase 4: Shutting down...
✅ Session closed gracefully
```

---

## Best Practices

### 1. Always Validate Capabilities
Never assume a capability is supported - check during initialization:

```typescript
if (!serverCapabilities.tools) {
  throw new Error("Server does not support tools");
}

if (serverCapabilities.tools.listChanged) {
  // Server will notify when tools change
  setupToolChangeHandler();
}
```

### 2. Handle Notifications Asynchronously
Don't block the notification handler:

```typescript
// Good: Non-blocking
client.setNotificationHandler("notifications/resources/updated", async (params) => {
  setImmediate(async () => {
    await refreshResource(params.uri);
  });
});

// Bad: Blocking
client.setNotificationHandler("notifications/resources/updated", async (params) => {
  await refreshResource(params.uri); // Blocks notification loop
});
```

### 3. Implement Timeouts
Always use timeouts for requests:

```typescript
const result = await Promise.race([
  client.callTool({ name: "slow_operation", arguments: {} }),
  timeout(30000, "Tool execution timeout")
]);
```

### 4. Graceful Error Recovery
Handle errors gracefully and provide fallbacks:

```typescript
try {
  const tools = await client.listTools();
} catch (error) {
  if (error.code === -32601) {
    // Method not supported
    return [];
  }
  // Log and re-throw unexpected errors
  logger.error("Failed to list tools", error);
  throw error;
}
```

### 5. Clean Resource Management
Always clean up resources, even on errors:

```typescript
const client = new Client(/* ... */);
try {
  await client.connect(transport);
  // ... operations ...
} finally {
  await client.close();
}
```

---

## Sequence Diagrams

### Complete Session Lifecycle

```
Client                                Server
  |                                      |
  |  1. CONNECT (stdio/HTTP/SSE)        |
  |------------------------------------->|
  |                                      |
  |  2. initialize request               |
  |------------------------------------->|
  |  { protocolVersion, capabilities }   |
  |                                      |
  |  3. initialize response              |
  |<-------------------------------------|
  |  { protocolVersion, capabilities }   |
  |                                      |
  |  4. initialized notification         |
  |------------------------------------->|
  |  (no response)                       |
  |                                      |
  |  =========== READY ===========       |
  |                                      |
  |  5. tools/list request               |
  |------------------------------------->|
  |                                      |
  |  6. tools/list response              |
  |<-------------------------------------|
  |  { tools: [...] }                    |
  |                                      |
  |  7. tools/call request               |
  |------------------------------------->|
  |  { name, arguments }                 |
  |                                      |
  |  8. tools/call response              |
  |<-------------------------------------|
  |  { content: [...] }                  |
  |                                      |
  |  9. notification (async)             |
  |<-------------------------------------|
  |  tools/list_changed                  |
  |                                      |
  | 10. tools/list request               |
  |------------------------------------->|
  |                                      |
  | 11. tools/list response              |
  |<-------------------------------------|
  |  { tools: [...] } (updated)          |
  |                                      |
  | 12. CLOSE (stdio EOF / HTTP close)   |
  |------------------------------------->|
  |                                      |
  | 13. Cleanup & Exit                   |
  |                                      X
```

### Error Handling Flow

```
Client                                Server
  |                                      |
  |  Request with invalid params         |
  |------------------------------------->|
  |                                      |
  |  Error response                      |
  |<-------------------------------------|
  |  { error: { code, message, data } }  |
  |                                      |
  |  Validate error                      |
  |  - Log error                         |
  |  - Retry if appropriate              |
  |  - Fallback if available             |
  |                                      |
  |  Corrected request                   |
  |------------------------------------->|
  |                                      |
  |  Success response                    |
  |<-------------------------------------|
  |  { result: {...} }                   |
```

---

## Related Documentation

- **[Protocol Architecture](protocol-architecture.md)** - MCP layers and transport mechanisms
- **[Core Primitives](core-primitives.md)** - Tools, Resources, Prompts, Sampling
- **[Implementation Guide](../03-creating-servers/implementation-guide.md)** - Building MCP servers
- **[Testing](../03-creating-servers/testing.md)** - Testing lifecycle with MCP Inspector
- **[Protocol Specification](../07-reference/protocol-specification.md)** - Complete JSON-RPC reference

---

## Summary

The MCP session lifecycle consists of four phases:

1. **Connection**: Establish transport (stdio, HTTP/SSE)
2. **Initialization**: Handshake, capability negotiation, protocol version agreement
3. **Operation**: Active communication, requests, responses, notifications
4. **Shutdown**: Graceful termination and cleanup

Key takeaways:
- Always validate capabilities before using features
- Handle notifications asynchronously for real-time updates
- Implement proper error handling and recovery
- Clean up resources during shutdown
- Use timeouts for all requests
- Track session state and pending operations

Understanding the lifecycle ensures you build robust, reliable MCP implementations that handle edge cases, errors, and state transitions correctly.

---

**Last Updated:** February 2026
**Related Modules:** [MCP Module](../README.md) | [Protocol Architecture](protocol-architecture.md) | [Core Primitives](core-primitives.md)
