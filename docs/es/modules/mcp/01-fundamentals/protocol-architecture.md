# Protocol Architecture

Understanding the Model Context Protocol's architecture is essential for effectively building and integrating MCP servers and clients. This guide explains the core architectural components, design principles, and communication patterns that make MCP a robust and flexible protocol.

## Overview

MCP employs a **client-server architecture** built on **JSON-RPC 2.0**, organized into two distinct layers that separate concerns between what data is exchanged (Data Layer) and how it's transmitted (Transport Layer). This separation enables MCP to support diverse deployment scenarios while maintaining a consistent protocol for context exchange.

The architecture is designed around three key principles:

1. **Separation of Concerns**: Data protocol separated from transport mechanisms
2. **Capability Negotiation**: Dynamic discovery of supported features
3. **Stateful Communication**: Managed lifecycle with initialization and termination

---

## Architectural Participants

MCP defines three distinct participants, each with specific roles and responsibilities in the communication flow.

### 1. MCP Host

The **MCP Host** is the AI application that coordinates and manages the entire MCP ecosystem within an application context.

**Role:**
- Orchestrates communication with multiple MCP servers
- Manages client instances for each server connection
- Coordinates context gathering from various sources
- Provides unified interface to language models
- Handles user interactions and permissions

**Characteristics:**
- Single host per application instance
- Manages one or more MCP clients
- Responsible for combining context from all sources
- Controls access and security policies

**Examples:**
- **Claude Code**: CLI tool for AI-assisted development
- **Claude Desktop**: Desktop application for AI interactions
- **Cursor**: AI-powered code editor
- **Visual Studio Code**: With MCP extension installed
- **Custom AI Applications**: Any application implementing MCP host capabilities

**Host Responsibilities:**

```
┌─────────────────────────────────────────────────┐
│               MCP Host                          │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Client Management                        │ │
│  │  - Create/destroy clients                 │ │
│  │  - Monitor connection health              │ │
│  │  - Handle client errors                   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Context Aggregation                      │ │
│  │  - Combine tools from all servers         │ │
│  │  - Merge resource catalogs                │ │
│  │  - Consolidate prompts                    │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  LLM Integration                          │ │
│  │  - Provide context to language model      │ │
│  │  - Execute tool calls                     │ │
│  │  - Manage conversation flow               │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 2. MCP Client

The **MCP Client** is a protocol component that maintains a dedicated connection to a single MCP server on behalf of the host.

**Role:**
- Establish and maintain connection to one MCP server
- Translate host requests into protocol messages
- Handle protocol-level communication
- Manage connection lifecycle
- Report server capabilities to host

**Characteristics:**
- One client per server connection
- Dedicated to single server
- Stateful connection
- Managed by the host
- Protocol-aware component

**Client Lifecycle:**

```
┌──────────────┐
│   Created    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌─────────────┐
│ Connecting   │────▶│   Failed    │
└──────┬───────┘     └─────────────┘
       │
       ▼
┌──────────────┐
│ Initialized  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Active     │◀──┐
└──────┬───────┘   │
       │           │
       │   Requests/Responses
       └───────────┘
       │
       ▼
┌──────────────┐
│ Terminated   │
└──────────────┘
```

**Example Client Instance:**

```python
# Pseudo-code showing client instance
class MCPClient:
    def __init__(self, server_config):
        self.server_config = server_config
        self.session = None
        self.capabilities = {}
        self.tools_cache = []

    async def connect(self):
        """Establish connection to server"""
        self.session = await create_session(self.server_config)

    async def initialize(self):
        """Perform capability negotiation"""
        response = await self.session.initialize(
            protocol_version="2025-06-18",
            capabilities={"elicitation": {}}
        )
        self.capabilities = response.capabilities

    async def list_tools(self):
        """Fetch available tools from server"""
        response = await self.session.call("tools/list")
        self.tools_cache = response.tools
        return response.tools

    async def call_tool(self, name, arguments):
        """Execute tool on server"""
        return await self.session.call("tools/call", {
            "name": name,
            "arguments": arguments
        })
```

### 3. MCP Server

The **MCP Server** is a program that provides context, tools, and capabilities to MCP clients.

**Role:**
- Expose tools for AI applications to invoke
- Provide resources for contextual information
- Offer prompts for interaction templates
- Respond to client requests
- Send notifications about state changes

**Types of Servers:**

**Local Servers:**
- Run on the same machine as the host
- Communicate via stdio (standard input/output)
- No network overhead
- Direct process communication
- Examples: filesystem server, local database server

**Remote Servers:**
- Run on different machines or cloud platforms
- Communicate via HTTP/SSE
- Network-based communication
- Authentication required
- Examples: API integrations, cloud services

**Server Characteristics:**

```
┌─────────────────────────────────────────────────┐
│               MCP Server                        │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Capabilities                             │ │
│  │  - Tools: Executable functions            │ │
│  │  - Resources: Data sources                │ │
│  │  - Prompts: Interaction templates         │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  State Management                         │ │
│  │  - Track connection state                 │ │
│  │  - Manage resource lifecycle              │ │
│  │  - Monitor tool availability              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Notification System                      │ │
│  │  - Broadcast capability changes           │ │
│  │  - Send progress updates                  │ │
│  │  - Report status changes                  │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Example Server Types:**

| Server Type | Location | Transport | Examples |
|-------------|----------|-----------|----------|
| Filesystem | Local | stdio | File operations, directory listing |
| Database | Local/Remote | stdio/HTTP | PostgreSQL, SQLite, MongoDB |
| API Integration | Remote | HTTP | GitHub, Sentry, Slack |
| Development Tools | Local | stdio | Git, npm, Docker |
| Custom Business Logic | Local/Remote | stdio/HTTP | Domain-specific tools |

---

## Complete Architecture Diagram

The following diagram shows how all three participants interact:

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP Host                                │
│                (AI Application: Claude Code)                │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  MCP Client  │  │  MCP Client  │  │  MCP Client  │     │
│  │      1       │  │      2       │  │      3       │     │
│  │              │  │              │  │              │     │
│  │ Filesystem   │  │   GitHub     │  │  Database    │     │
│  │  Server      │  │   Server     │  │   Server     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │             │
└─────────┼─────────────────┼──────────────────┼─────────────┘
          │                 │                  │
          │ stdio           │ HTTP/SSE         │ stdio
          │                 │                  │
          ▼                 ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  Server  │      │  Server  │      │  Server  │
    │   A      │      │   B      │      │   C      │
    │          │      │          │      │          │
    │ Local    │      │ Remote   │      │ Local    │
    │ Process  │      │ Cloud    │      │ Process  │
    └──────────┘      └──────────┘      └──────────┘
```

**Communication Flow:**

1. Host creates client instance for each server
2. Each client maintains dedicated connection
3. Clients negotiate capabilities with servers
4. Host aggregates all tools/resources/prompts
5. Language model requests tool execution
6. Host routes request to appropriate client
7. Client sends request to server
8. Server executes and responds
9. Client returns result to host
10. Host provides result to language model

---

## Two-Layer Design

MCP's architecture is organized into two distinct layers, each handling different aspects of the protocol.

### 1. Data Layer (Inner Layer)

The **Data Layer** defines **what** information is exchanged between clients and servers and **how** that exchange is structured.

**Purpose:**
- Define protocol messages and structure
- Specify available operations (methods)
- Establish capability negotiation process
- Define primitive types (tools, resources, prompts)

**Foundation: JSON-RPC 2.0**

MCP uses JSON-RPC 2.0 as its messaging foundation, providing:
- Standardized request/response format
- Error handling conventions
- Notification mechanism
- Batch operation support

**JSON-RPC Request Format:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}
```

**JSON-RPC Response Format:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "File contents here..."
      }
    ]
  }
}
```

**JSON-RPC Notification Format:**

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```
**Note:** Notifications have no `id` field and expect no response.

**Data Layer Components:**

```
┌─────────────────────────────────────────────────┐
│              Data Layer (Protocol)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Lifecycle Management                           │
│  ├─ initialize                                  │
│  ├─ initialized (notification)                  │
│  └─ ping/pong                                   │
│                                                 │
│  Server Primitives                              │
│  ├─ Tools                                       │
│  │   ├─ tools/list                              │
│  │   └─ tools/call                              │
│  ├─ Resources                                   │
│  │   ├─ resources/list                          │
│  │   ├─ resources/read                          │
│  │   └─ resources/templates/list                │
│  └─ Prompts                                     │
│      ├─ prompts/list                            │
│      └─ prompts/get                             │
│                                                 │
│  Client Primitives                              │
│  ├─ Sampling                                    │
│  │   └─ sampling/complete                       │
│  ├─ Elicitation                                 │
│  │   └─ elicitation/request                     │
│  └─ Logging                                     │
│      └─ logging/setLevel                        │
│                                                 │
│  Notifications                                  │
│  ├─ notifications/tools/list_changed            │
│  ├─ notifications/resources/list_changed        │
│  ├─ notifications/prompts/list_changed          │
│  ├─ notifications/progress                      │
│  └─ notifications/message                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Protocol Version:**
- Current version: `2025-06-18`
- Specified in initialization
- Ensures compatibility between clients and servers
- Allows graceful version negotiation

### 2. Transport Layer (Outer Layer)

The **Transport Layer** defines **how** messages are transmitted between clients and servers.

**Purpose:**
- Establish physical connections
- Frame protocol messages
- Handle authentication
- Manage secure communication
- Support different deployment scenarios

**Characteristics:**
- Independent of data layer
- Pluggable transport mechanisms
- Transport-specific authentication
- Connection management

**Transport Layer Responsibilities:**

```
┌─────────────────────────────────────────────────┐
│           Transport Layer (Delivery)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Connection Management                          │
│  ├─ Establish connection                        │
│  ├─ Maintain connection health                  │
│  ├─ Handle reconnection                         │
│  └─ Graceful shutdown                           │
│                                                 │
│  Message Framing                                │
│  ├─ Encode messages for transmission            │
│  ├─ Decode received messages                    │
│  ├─ Handle message boundaries                   │
│  └─ Manage message ordering                     │
│                                                 │
│  Authentication & Security                      │
│  ├─ Authenticate connections                    │
│  ├─ Encrypt communication                       │
│  ├─ Manage credentials                          │
│  └─ Validate access                             │
│                                                 │
│  Error Handling                                 │
│  ├─ Network errors                              │
│  ├─ Timeout management                          │
│  ├─ Retry logic                                 │
│  └─ Connection failures                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Supported Transports:**

#### Stdio Transport

**Description:** Communication via standard input/output streams

**Use Cases:**
- Local server processes
- Same-machine communication
- Development and testing
- Low-latency requirements

**Characteristics:**
- Zero network overhead
- Direct process communication
- Synchronous message delivery
- Simple to implement

**Connection Setup:**

```javascript
// Server started as subprocess
const server = spawn('node', ['server.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

// Client reads from server stdout
const client = new Client({
  transport: {
    type: 'stdio',
    stdin: server.stdin,
    stdout: server.stdout
  }
});
```

**Message Flow:**

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │  Write JSON-RPC to stdin         │
     │─────────────────────────────────▶│
     │                                  │
     │                                  │ Process
     │                                  │ Request
     │                                  │
     │  Read JSON-RPC from stdout       │
     │◀─────────────────────────────────│
     │                                  │
```

**Configuration Example:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["path/to/filesystem-server.js"],
      "env": {
        "ROOT_PATH": "/workspace"
      }
    }
  }
}
```

#### HTTP with Server-Sent Events (SSE) Transport

**Description:** HTTP POST for client-to-server messages, optional SSE for server-to-client streaming

**Use Cases:**
- Remote server deployments
- Cloud-based services
- Internet-accessible integrations
- Authentication requirements

**Characteristics:**
- Standard HTTP protocol
- Firewall-friendly
- Supports authentication (Bearer tokens, OAuth, API keys)
- Scalable deployment

**Connection Setup:**

```javascript
const client = new Client({
  transport: {
    type: 'http',
    url: 'https://api.example.com/mcp',
    headers: {
      'Authorization': 'Bearer token123',
      'X-API-Key': 'api-key-456'
    }
  }
});
```

**Message Flow:**

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │  HTTP POST /mcp                  │
     │  (JSON-RPC request)              │
     │─────────────────────────────────▶│
     │                                  │
     │                                  │ Process
     │                                  │ Request
     │                                  │
     │  HTTP 200 Response               │
     │  (JSON-RPC response)             │
     │◀─────────────────────────────────│
     │                                  │
     │                                  │
     │  Server-Sent Events (optional)   │
     │  (Notifications)                 │
     │◀─────────────────────────────────│
     │                                  │
```

**SSE for Notifications:**

```
GET /mcp/sse HTTP/1.1
Authorization: Bearer token123

HTTP/1.1 200 OK
Content-Type: text/event-stream

event: notification
data: {"jsonrpc":"2.0","method":"notifications/tools/list_changed"}

event: notification
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{...}}
```

**Configuration Example:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://mcp.github.com",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Transport Comparison:**

| Feature | Stdio | HTTP/SSE |
|---------|-------|----------|
| **Network** | None (local) | Required |
| **Performance** | Excellent | Good |
| **Authentication** | Process isolation | Bearer tokens, OAuth, API keys |
| **Firewall** | N/A | Friendly |
| **Scalability** | Single machine | High |
| **Use Case** | Local tools | Remote services |
| **Setup Complexity** | Simple | Moderate |

---

## JSON-RPC Foundation

MCP builds upon JSON-RPC 2.0, a lightweight remote procedure call protocol.

### Why JSON-RPC?

**Benefits:**
- **Simplicity**: Easy to understand and implement
- **Language-agnostic**: Works with any programming language
- **Standardized**: Well-established protocol with clear specification
- **Flexible**: Supports requests, responses, notifications, and batching
- **Debugging-friendly**: Human-readable JSON format

### JSON-RPC Message Types

#### 1. Request

**Purpose:** Client asks server to perform an operation

**Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": {
      "query": "example"
    }
  }
}
```

**Fields:**
- `jsonrpc`: Protocol version (always "2.0")
- `id`: Unique identifier for matching responses (number or string)
- `method`: Operation to perform
- `params`: Optional parameters (object or array)

#### 2. Response (Success)

**Purpose:** Server returns successful result

**Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Search results..."
      }
    ]
  }
}
```

**Fields:**
- `jsonrpc`: Protocol version
- `id`: Matches request ID
- `result`: Operation result

#### 3. Response (Error)

**Purpose:** Server reports operation failure

**Structure:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found",
    "data": {
      "method": "invalid/method"
    }
  }
}
```

**Fields:**
- `jsonrpc`: Protocol version
- `id`: Matches request ID
- `error`: Error details
  - `code`: Error code (integer)
  - `message`: Error description
  - `data`: Optional additional information

**Standard Error Codes:**
```
-32700  Parse error
-32600  Invalid Request
-32601  Method not found
-32602  Invalid params
-32603  Internal error
-32000 to -32099  Server error (reserved for implementation-defined)
```

#### 4. Notification

**Purpose:** One-way message with no response expected

**Structure:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Fields:**
- `jsonrpc`: Protocol version
- `method`: Notification type
- `params`: Optional parameters
- **No `id` field** (indicates no response expected)

### Request-Response Matching

**ID Correlation:**

```
Client sends:                    Server responds:
{                                {
  "id": 42,                        "id": 42,
  "method": "tools/list"           "result": {...}
}                                }

Client sends:                    Server responds:
{                                {
  "id": 43,                        "id": 43,
  "method": "tools/call"           "result": {...}
}                                }
```

**Concurrent Requests:**

Clients can send multiple requests without waiting for responses. Servers may respond in any order. The `id` field ensures correct matching.

---

## Message Flow and Patterns

### Initialization Sequence

The initialization sequence establishes protocol compatibility and capability discovery.

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Server  │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. initialize request                       │
     │  (protocol version, client capabilities)     │
     │─────────────────────────────────────────────▶│
     │                                              │
     │                                              │ Validate
     │                                              │ version
     │                                              │
     │  2. initialize response                      │
     │  (protocol version, server capabilities)     │
     │◀─────────────────────────────────────────────│
     │                                              │
     │  Store                                       │
     │  capabilities                                │
     │                                              │
     │  3. initialized notification                 │
     │─────────────────────────────────────────────▶│
     │                                              │
     │                                              │ Ready
     │  Connection established                      │ for
     │  Ready for operations                        │ requests
     │                                              │
```

**Step 1: Initialize Request**

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
      "name": "claude-code",
      "version": "1.0.0"
    }
  }
}
```

**Step 2: Initialize Response**

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
        "subscribe": true
      },
      "prompts": {}
    },
    "serverInfo": {
      "name": "filesystem-server",
      "version": "2.0.1"
    }
  }
}
```

**Step 3: Initialized Notification**

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

### Discovery Pattern

After initialization, clients discover available capabilities.

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │  tools/list                      │
     │─────────────────────────────────▶│
     │                                  │
     │  [tool1, tool2, tool3]           │
     │◀─────────────────────────────────│
     │                                  │
     │  resources/list                  │
     │─────────────────────────────────▶│
     │                                  │
     │  [resource1, resource2]          │
     │◀─────────────────────────────────│
     │                                  │
     │  prompts/list                    │
     │─────────────────────────────────▶│
     │                                  │
     │  [prompt1]                       │
     │◀─────────────────────────────────│
     │                                  │
```

### Execution Pattern

When executing tools, the pattern is straightforward request-response.

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │  tools/call                      │
     │  (name: "search", args: {...})   │
     │─────────────────────────────────▶│
     │                                  │
     │                                  │ Execute
     │                                  │ tool
     │                                  │ logic
     │                                  │
     │  result                          │
     │◀─────────────────────────────────│
     │                                  │
     │  Process                         │
     │  result                          │
     │                                  │
```

### Notification Pattern

Servers can send notifications for dynamic updates.

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │                                  │ Internal
     │                                  │ state
     │                                  │ changes
     │                                  │
     │  notifications/tools/list_changed│
     │◀─────────────────────────────────│
     │                                  │
     │  Invalidate                      │
     │  cache                           │
     │                                  │
     │  tools/list                      │
     │─────────────────────────────────▶│
     │                                  │
     │  [updated tool list]             │
     │◀─────────────────────────────────│
     │                                  │
     │  Update                          │
     │  registry                        │
     │                                  │
```

### Progress Reporting Pattern

For long-running operations, servers can report progress.

```
┌─────────┐                        ┌─────────┐
│ Client  │                        │ Server  │
└────┬────┘                        └────┬────┘
     │                                  │
     │  tools/call                      │
     │  (long-running operation)        │
     │─────────────────────────────────▶│
     │                                  │
     │                                  │ Start
     │                                  │ processing
     │                                  │
     │  notifications/progress          │
     │  (progress: 25%)                 │
     │◀─────────────────────────────────│
     │                                  │
     │  Update UI                       │
     │                                  │
     │  notifications/progress          │
     │  (progress: 50%)                 │
     │◀─────────────────────────────────│
     │                                  │
     │  Update UI                       │
     │                                  │
     │  notifications/progress          │
     │  (progress: 75%)                 │
     │◀─────────────────────────────────│
     │                                  │
     │  Update UI                       │
     │                                  │
     │  result                          │
     │◀─────────────────────────────────│
     │                                  │
     │  Complete                        │
     │                                  │
```

---

## Capability Negotiation

Capability negotiation is the process by which clients and servers discover and agree upon supported features.

### Purpose of Capability Negotiation

1. **Feature Discovery**: Learn what operations are available
2. **Version Compatibility**: Ensure protocol version alignment
3. **Efficient Communication**: Avoid requesting unsupported operations
4. **Graceful Degradation**: Function with subset of features
5. **Future-Proofing**: Support new features without breaking existing implementations

### Capability Structure

Capabilities are declared during initialization in a hierarchical structure.

**Client Capabilities:**

```json
{
  "capabilities": {
    "elicitation": {},
    "sampling": {
      "maxTokens": 8192
    },
    "roots": {
      "listChanged": true
    }
  }
}
```

**Server Capabilities:**

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
      "listChanged": false
    },
    "experimental": {
      "customFeature": {
        "version": "0.1.0"
      }
    }
  }
}
```

### Capability Categories

**Server Capabilities:**

| Capability | Description | Common Options |
|------------|-------------|----------------|
| `tools` | Executable functions | `listChanged`: Supports notification when tools change |
| `resources` | Data sources | `subscribe`: Supports resource subscriptions<br>`listChanged`: Notification support |
| `prompts` | Interaction templates | `listChanged`: Notification support |
| `logging` | Log message support | Level configuration |

**Client Capabilities:**

| Capability | Description | Common Options |
|------------|-------------|----------------|
| `elicitation` | User input requests | Supported input types |
| `sampling` | LLM completions | `maxTokens`: Maximum completion length |
| `roots` | Workspace roots | `listChanged`: Root change notifications |

### Negotiation Example

**Scenario:** Client supports elicitation, server supports tools with notifications

```json
// Client declares capabilities
{
  "method": "initialize",
  "params": {
    "capabilities": {
      "elicitation": {}
    }
  }
}

// Server declares capabilities
{
  "result": {
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {}
    }
  }
}
```

**Agreed Features:**
- Client can request user input (elicitation)
- Server can provide tools
- Server will send notifications when tools change
- Server can provide resources (but no change notifications)

**Usage:**

```javascript
// Client knows server supports tool notifications
if (serverCapabilities.tools?.listChanged) {
  // Subscribe to notifications
  client.on('notification', (notification) => {
    if (notification.method === 'notifications/tools/list_changed') {
      // Refresh tool list
      client.listTools();
    }
  });
}

// Server knows client supports elicitation
if (clientCapabilities.elicitation) {
  // Can request user input
  await client.requestElicitation({
    prompt: "Confirm deletion of file?",
    type: "confirmation"
  });
}
```

### Version Negotiation

**Compatible Versions:**

```json
// Client sends
{
  "protocolVersion": "2025-06-18"
}

// Server responds with same version
{
  "protocolVersion": "2025-06-18"
}
// ✅ Proceed with connection
```

**Incompatible Versions:**

```json
// Client sends
{
  "protocolVersion": "2025-06-18"
}

// Server responds with different version
{
  "protocolVersion": "2024-01-15"
}
// ❌ Client should terminate or negotiate fallback
```

---

## Architecture Benefits

The MCP architecture provides significant advantages for building AI integrations.

### 1. Separation of Concerns

**Data Layer Independence:**
- Protocol logic decoupled from transport mechanism
- Same protocol works over stdio, HTTP, or future transports
- Easy to test protocol logic independently

**Transport Layer Independence:**
- Switch transports without changing protocol code
- Optimize for different deployment scenarios
- Add new transports without protocol changes

**Example:**

```javascript
// Same protocol code works with different transports

// Local deployment - stdio
const localClient = new Client({
  transport: new StdioTransport(),
  protocol: mcpProtocol  // Same protocol implementation
});

// Remote deployment - HTTP
const remoteClient = new Client({
  transport: new HttpTransport(),
  protocol: mcpProtocol  // Same protocol implementation
});
```

### 2. Flexibility

**Deployment Options:**
- Local servers for performance-critical operations
- Remote servers for cloud services
- Mixed deployments within single application

**Protocol Extensions:**
- Custom capabilities for domain-specific needs
- Experimental features without breaking compatibility
- Gradual feature adoption

### 3. Standardization

**Ecosystem Benefits:**
- Servers work with any MCP-compatible client
- Clients work with any MCP-compatible server
- Shared tooling and libraries
- Common debugging approaches

**Developer Benefits:**
- Learn protocol once, use everywhere
- Reusable server implementations
- Community-contributed servers

### 4. Scalability

**Horizontal Scaling:**
- Multiple servers can run independently
- Load balancing at transport layer
- Distributed server deployments

**Resource Efficiency:**
- Stateful connections avoid repeated initialization
- Capability caching reduces redundant requests
- Notification-based updates prevent polling

### 5. Security

**Authentication Flexibility:**
- Transport-specific authentication mechanisms
- Process isolation for local servers
- Standard HTTP auth for remote servers

**Controlled Access:**
- Host manages all server connections
- Explicit capability negotiation
- User confirmation via elicitation

### 6. Developer Experience

**Easy Debugging:**
- Human-readable JSON messages
- Standard error codes and messages
- MCP Inspector tool for testing

**Progressive Disclosure:**
- Start with basic features
- Add capabilities as needed
- Clear documentation of requirements

**Rich Ecosystem:**
- Reference implementations available
- SDKs for multiple languages
- Growing collection of servers

---

## Real-World Architecture Example

Let's walk through a complete example showing how MCP architecture works in practice.

### Scenario: AI-Powered Code Review Tool

**Goal:** Build an AI application that reviews code by:
1. Reading files from a repository
2. Fetching GitHub pull request information
3. Analyzing code with AI
4. Posting review comments

**Architecture:**

```
┌────────────────────────────────────────────────────┐
│              Code Review Host                      │
│                                                    │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ Filesystem   │  │   GitHub     │              │
│  │   Client     │  │   Client     │              │
│  └──────┬───────┘  └──────┬───────┘              │
└─────────┼──────────────────┼────────────────────────┘
          │                  │
          │ stdio            │ HTTP/SSE
          │                  │
          ▼                  ▼
    ┌──────────┐       ┌──────────┐
    │Filesystem│       │  GitHub  │
    │  Server  │       │  Server  │
    │  (Local) │       │ (Remote) │
    └──────────┘       └──────────┘
```

### Step 1: Initialization

**Filesystem Client (stdio):**

```json
// Client → Server
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": {
      "name": "code-review-tool",
      "version": "1.0.0"
    }
  }
}

// Server → Client
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {},
      "resources": {}
    },
    "serverInfo": {
      "name": "filesystem-server",
      "version": "1.0.0"
    }
  }
}
```

**GitHub Client (HTTP):**

```json
// Client → Server (HTTP POST)
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "code-review-tool",
      "version": "1.0.0"
    }
  }
}

// Server → Client (HTTP Response)
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "github-server",
      "version": "2.1.0"
    }
  }
}
```

### Step 2: Discovery

**List Filesystem Tools:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// Response
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "read_file",
        "description": "Read file contents",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" }
          },
          "required": ["path"]
        }
      },
      {
        "name": "list_directory",
        "description": "List directory contents",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" }
          }
        }
      }
    ]
  }
}
```

**List GitHub Tools:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/list"
}

// Response
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "tools": [
      {
        "name": "get_pull_request",
        "description": "Fetch pull request details",
        "inputSchema": {
          "type": "object",
          "properties": {
            "owner": { "type": "string" },
            "repo": { "type": "string" },
            "pr_number": { "type": "number" }
          },
          "required": ["owner", "repo", "pr_number"]
        }
      },
      {
        "name": "post_review_comment",
        "description": "Post review comment on PR",
        "inputSchema": {
          "type": "object",
          "properties": {
            "owner": { "type": "string" },
            "repo": { "type": "string" },
            "pr_number": { "type": "number" },
            "body": { "type": "string" },
            "path": { "type": "string" },
            "line": { "type": "number" }
          },
          "required": ["owner", "repo", "pr_number", "body"]
        }
      }
    ]
  }
}
```

### Step 3: Execution Workflow

**1. Get PR Information (GitHub Server via HTTP):**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "get_pull_request",
    "arguments": {
      "owner": "acme",
      "repo": "project",
      "pr_number": 42
    }
  }
}
```

**2. Read Changed Files (Filesystem Server via stdio):**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "src/components/Button.tsx"
    }
  }
}
```

**3. Post Review (GitHub Server via HTTP):**

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "post_review_comment",
    "arguments": {
      "owner": "acme",
      "repo": "project",
      "pr_number": 42,
      "body": "Consider extracting this logic into a separate function",
      "path": "src/components/Button.tsx",
      "line": 42
    }
  }
}
```

### Benefits Demonstrated

1. **Separation**: File operations use stdio, GitHub uses HTTP
2. **Standardization**: Same JSON-RPC protocol for both servers
3. **Flexibility**: Easy to add more servers (e.g., Slack for notifications)
4. **Scalability**: Servers run independently, can scale separately
5. **Security**: GitHub uses API token authentication, filesystem uses process isolation

---

## Related Documentation

- [What is MCP?](./what-is-mcp.md) - Introduction to MCP concepts
- [Protocol Lifecycle](./lifecycle.md) - Connection lifecycle and state management
- [Building Servers](../03-creating-servers/server-basics.md) - Creating MCP servers
- [Using MCP in Claude Code](../02-using-mcp/claude-code.md) - Claude Code integration guide

---

**Last Updated:** February 2026
**Protocol Version:** 2025-06-18
