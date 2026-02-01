# Transport Comparison and Selection Guide

Comprehensive comparison of MCP transport mechanisms to help you choose the optimal transport for your deployment scenario, understand performance trade-offs, and plan migration strategies between transports.

## Overview

The Model Context Protocol (MCP) separates protocol semantics (data layer) from communication mechanisms (transport layer), enabling flexible deployment across diverse environments. This guide provides an exhaustive comparison of all transport options to help architects, developers, and operations teams make informed deployment decisions.

**What you'll learn:**
- Complete feature comparison across all transports
- Performance characteristics and benchmarks
- Security considerations for each transport
- Use case recommendations and anti-patterns
- Platform support matrix
- Migration paths between transports
- Decision-making framework

**Who should read this:**
- System architects designing MCP deployments
- DevOps engineers planning infrastructure
- Security teams evaluating transport options
- Developers choosing transport for new servers
- Teams migrating between transports

---

## Transport Overview

### What is a Transport?

In MCP's two-layer architecture, **transports** handle the physical transmission of JSON-RPC messages between clients and servers:

```
┌─────────────────────────────────────────────┐
│         Data Layer (Protocol)               │
│  • JSON-RPC 2.0 messages                    │
│  • Tools, resources, prompts                │
│  • Capability negotiation                   │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│      Transport Layer (Delivery)             │
│  • Connection establishment                 │
│  • Message framing                          │
│  • Authentication                           │
│  • Error handling                           │
└─────────────────────────────────────────────┘
```

**Key principle:** The same JSON-RPC message works identically across all transports. Transport choice is purely operational.

### Available Transports

MCP currently supports four primary transports:

1. **stdio**: Standard input/output streams
2. **HTTP**: Streamable HTTP with optional SSE
3. **SSE**: Server-Sent Events (deprecated, use HTTP)
4. **WebSocket**: Bidirectional persistent connections (custom implementations)

Each transport has specific strengths that make it ideal for certain deployment scenarios.

---

## Complete Feature Matrix

### Core Capabilities

| Feature | stdio | HTTP | SSE (Deprecated) | WebSocket |
|---------|-------|------|------------------|-----------|
| **Direction** | Bidirectional | Request/Response + SSE | Server→Client only | Bidirectional |
| **Connection Type** | Persistent | Stateless/Streaming | Persistent | Persistent |
| **Multiple Clients** | No (1:1) | Yes | Yes | Yes |
| **Server Push** | Yes | Via SSE | Yes | Yes |
| **Message Framing** | Newline-delimited | HTTP body/SSE | Event stream | WebSocket frames |
| **Built-in Authentication** | No | Yes (HTTP headers) | Yes (HTTP headers) | Yes (WebSocket headers) |
| **Network Required** | No | Yes | Yes | Yes |
| **Firewall Friendly** | N/A | Yes | Yes | Moderate |
| **Binary Support** | Text (JSON) | Text (JSON) | Text (JSON) | Binary + Text |

### Authentication Methods

| Method | stdio | HTTP | SSE (Deprecated) | WebSocket |
|--------|-------|------|------------------|-----------|
| **OAuth 2.0** | ❌ | ✅ Bearer tokens | ✅ Bearer tokens | ✅ Via headers |
| **API Keys** | ❌ | ✅ Custom headers | ✅ Custom headers | ✅ Via headers |
| **Basic Auth** | ❌ | ✅ Authorization header | ✅ Authorization header | ✅ Via headers |
| **mTLS** | ❌ | ✅ Client certificates | ✅ Client certificates | ✅ Client certificates |
| **Process Isolation** | ✅ | ❌ | ❌ | ❌ |
| **Session Tokens** | ❌ | ✅ Cookies/headers | ✅ Cookies/headers | ✅ Via headers |

### Operational Characteristics

| Characteristic | stdio | HTTP | SSE (Deprecated) | WebSocket |
|----------------|-------|------|------------------|-----------|
| **Scalability** | Single process | Horizontal | Horizontal | Horizontal |
| **Load Balancing** | N/A | Easy | Sticky sessions | Sticky sessions |
| **Deployment Complexity** | Simple | Moderate | Moderate | Moderate-High |
| **Monitoring** | Process metrics | HTTP logs/metrics | HTTP logs/SSE metrics | Custom metrics |
| **Error Recovery** | Process restart | Request retry | Reconnection | Reconnection |
| **State Management** | In-process | Stateless/session | Connection state | Connection state |
| **Resource Overhead** | Low | Low-Moderate | Moderate | Moderate |

### Platform Support

| Platform | stdio | HTTP | SSE (Deprecated) | WebSocket |
|----------|-------|------|------------------|-----------|
| **Claude Code** | ✅ Primary | ✅ Remote | ❌ | ⚠️ Custom |
| **Cursor** | ✅ Primary | ✅ Remote | ❌ | ⚠️ Custom |
| **Gemini CLI** | ✅ Primary | ✅ Remote | ✅ Deprecated | ⚠️ Custom |
| **Antigravity** | ✅ Primary | ✅ Remote | ❌ | ⚠️ Custom |
| **Custom Clients** | ✅ SDK support | ✅ SDK support | ⚠️ Legacy | ✅ Custom implementation |

**Legend:**
- ✅ Full support, recommended
- ⚠️ Possible with custom implementation
- ❌ Not supported

---

## Detailed Transport Comparisons

### stdio Transport

#### Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Server    │
│  (Parent)   │                    │   (Child)   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ spawn process                    │
       │─────────────────────────────────▶│
       │                                  │
       │ JSON-RPC via stdin               │
       │─────────────────────────────────▶│
       │                                  │
       │ JSON-RPC via stdout              │
       │◀─────────────────────────────────│
       │                                  │
```

**Message Format:**
```
{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n
{"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}\n
```

#### Strengths

**1. Zero Network Overhead**
- Direct inter-process communication
- No TCP/IP stack involvement
- Minimal latency (microseconds)
- No network failures

**2. Simple Security Model**
- Process isolation via OS
- No credential management
- No authentication layer needed
- Parent process controls child

**3. Easy Development**
- Simple to implement
- Easy to debug (stdio capture)
- No server infrastructure
- Fast iteration cycle

**4. Reliable Delivery**
- OS guarantees message ordering
- No packet loss
- Synchronous communication
- Predictable performance

#### Limitations

**1. Single Client Only**
- 1:1 parent-child relationship
- Cannot share across users
- No concurrent access
- Must spawn per client

**2. Same-Machine Only**
- Cannot access remote servers
- No network distribution
- No cloud deployment
- Platform-dependent execution

**3. Resource Consumption**
- One process per server instance
- Memory overhead per process
- Cannot pool connections
- Limited by local resources

**4. No Load Balancing**
- Cannot distribute load
- Single point of failure
- No horizontal scaling
- Limited to local capacity

#### Performance Characteristics

**Latency:**
- Message round-trip: 0.1-1ms
- Process spawn: 50-200ms (one-time)
- Message throughput: 10,000+ messages/second

**Resource Usage:**
- Memory: 20-50MB per server process
- CPU: Minimal (protocol overhead <1%)
- Disk: None

**Benchmarks (typical workload):**
```
Operation              stdio    HTTP
─────────────────────────────────────
Connection setup       200ms    100ms
Single request         1ms      50ms
100 sequential reqs    100ms    5000ms
Concurrent (n/a)       n/a      500ms
```

#### Best Use Cases

**✅ Ideal For:**
- Local development servers
- Personal productivity tools
- Desktop applications
- Filesystem operations
- Same-machine integrations
- Quick prototyping
- Single-user scenarios

**❌ Avoid For:**
- Multi-user applications
- Cloud services
- Shared team tools
- Remote access
- Load-balanced deployments
- High availability systems

#### Configuration Examples

**TypeScript SDK:**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "filesystem-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Start stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Client Configuration (Claude Code):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "ROOT_DIR": "/workspace"
      }
    }
  }
}
```

**Python SDK:**
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("filesystem-server")

# Server implementation here

if __name__ == "__main__":
    import asyncio
    asyncio.run(stdio_server(app))
```

---

### HTTP Transport (with Streamable SSE)

#### Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Server    │
│             │                    │  (HTTP)     │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ HTTP POST /mcp                   │
       │ (JSON-RPC request)               │
       │─────────────────────────────────▶│
       │                                  │
       │ HTTP 200 OK                      │
       │ (JSON-RPC response)              │
       │◀─────────────────────────────────│
       │                                  │
       │ Optional: SSE connection         │
       │ (server notifications)           │
       │◀═════════════════════════════════│
       │                                  │
```

**Request/Response:**
```http
POST /mcp HTTP/1.1
Host: api.example.com
Authorization: Bearer token123
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{...}}

HTTP/1.1 200 OK
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"result":{...}}
```

**SSE Notifications:**
```http
GET /mcp/sse HTTP/1.1
Host: api.example.com
Authorization: Bearer token123

HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"jsonrpc":"2.0","method":"notifications/tools/list_changed"}

data: {"jsonrpc":"2.0","method":"notifications/progress","params":{...}}
```

#### Strengths

**1. Internet-Scale Deployment**
- Cloud-native protocol
- CDN compatible
- Geographic distribution
- Standard infrastructure

**2. Rich Authentication**
- OAuth 2.0 flows
- API key management
- Bearer tokens
- Custom auth headers
- mTLS support

**3. Excellent Scalability**
- Horizontal scaling (stateless)
- Load balancer compatible
- Auto-scaling support
- Connection pooling
- Caching layers (HTTP caching)

**4. Enterprise Integration**
- WAF (Web Application Firewall) support
- DDoS protection
- Rate limiting (reverse proxy)
- Audit logging (access logs)
- Monitoring (APM tools)

**5. Firewall Friendly**
- Standard HTTPS port (443)
- No special firewall rules
- Proxy compatible
- Corporate network friendly

#### Limitations

**1. Higher Latency**
- Network round-trip: 50-500ms
- TLS handshake overhead
- HTTP protocol overhead
- Geographic distance impact

**2. Connection Overhead**
- TCP connection setup
- TLS negotiation
- HTTP headers
- Keep-alive management

**3. Notification Complexity**
- SSE for server push
- Separate connection management
- Reconnection logic
- Event stream parsing

**4. Debugging Complexity**
- Network layer issues
- TLS/certificate problems
- Proxy interference
- Load balancer behavior

#### Performance Characteristics

**Latency:**
- Connection setup: 100-300ms (TLS handshake)
- Same-datacenter request: 5-20ms
- Cross-region request: 100-500ms
- HTTP/2 multiplexing: ~5ms overhead per request

**Throughput:**
- Single connection: 1,000-5,000 req/sec
- HTTP/2: 10,000+ concurrent streams
- WebSocket upgrade: Minimal overhead

**Resource Usage:**
- Memory: 5-20MB per connection
- CPU: 2-5% (TLS encryption)
- Network: 1-10KB per message

**Benchmarks (production environment):**
```
Scenario                  Latency    Throughput
──────────────────────────────────────────────
Single request            50ms       -
100 sequential requests   5s         20 req/s
100 concurrent requests   500ms      200 req/s
Sustained load (1min)     45ms avg   500 req/s
```

#### Best Use Cases

**✅ Ideal For:**
- Remote MCP servers
- Cloud-deployed services
- Multi-user applications
- SaaS products
- Team collaboration tools
- API integrations
- Third-party services
- Geographically distributed teams
- High-availability systems
- Enterprise deployments

**❌ Avoid For:**
- Local-only tools (use stdio)
- Ultra-low latency requirements (<1ms)
- Offline-first applications
- Resource-constrained environments

#### Configuration Examples

**TypeScript Server:**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();
const server = new Server({
  name: "remote-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

// HTTP endpoint
app.post("/mcp", async (req, res) => {
  const result = await server.handleRequest(req.body);
  res.json(result);
});

// SSE endpoint for notifications
app.get("/mcp/sse", async (req, res) => {
  const transport = new SSEServerTransport("/mcp/sse", res);
  await server.connect(transport);
});

app.listen(3000);
```

**Client Configuration:**
```json
{
  "mcpServers": {
    "remote-api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-Client-ID": "client-123"
      },
      "timeout": 30000
    }
  }
}
```

**Python Server:**
```python
from fastapi import FastAPI
from mcp.server import Server
from mcp.server.sse import sse_server

app = FastAPI()
mcp_server = Server("remote-server")

@app.post("/mcp")
async def handle_mcp(request: dict):
    return await mcp_server.handle_request(request)

@app.get("/mcp/sse")
async def sse_endpoint():
    return sse_server(mcp_server)
```

---

### SSE Transport (Deprecated)

#### Status

**⚠️ Deprecated:** Server-Sent Events as a standalone transport is deprecated in favor of HTTP transport with optional SSE streaming. Use HTTP transport instead.

#### Why Deprecated?

1. **Limited Direction:** SSE is server-to-client only, requiring separate HTTP channel for client requests
2. **HTTP Provides Same Features:** HTTP transport now includes optional SSE streaming
3. **Better Developer Experience:** Unified HTTP approach simplifies implementation
4. **Reduced Confusion:** Single HTTP transport covers all use cases

#### Migration Path

**Old SSE Configuration:**
```json
{
  "type": "sse",
  "url": "https://api.example.com/sse"
}
```

**New HTTP Configuration (Equivalent):**
```json
{
  "type": "http",
  "url": "https://api.example.com/mcp"
}
```

**Server can still return SSE responses when appropriate:**
```typescript
// HTTP transport automatically handles SSE responses
app.post("/mcp", async (req, res) => {
  // For streaming responses, set SSE headers
  if (shouldStream(req.body)) {
    res.setHeader("Content-Type", "text/event-stream");
    // Stream SSE events
  } else {
    // Return immediate JSON response
    res.json(result);
  }
});
```

**Timeline:**
- Deprecated: December 2025
- Final support: June 2026
- Removal: December 2026 (estimate)

---

### WebSocket Transport (Custom Implementations)

#### Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Server    │
│             │                    │ (WebSocket) │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ WebSocket Upgrade                │
       │─────────────────────────────────▶│
       │                                  │
       │ 101 Switching Protocols          │
       │◀─────────────────────────────────│
       │                                  │
       │ ═══ Persistent Connection ═══    │
       │                                  │
       │ JSON-RPC message                 │
       │─────────────────────────────────▶│
       │                                  │
       │ JSON-RPC response                │
       │◀─────────────────────────────────│
       │                                  │
       │ Server notification              │
       │◀─────────────────────────────────│
       │                                  │
```

**Connection Upgrade:**
```http
GET /mcp HTTP/1.1
Host: ws.example.com
Upgrade: websocket
Connection: Upgrade

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

**Bidirectional Messages:**
```json
// Client → Server
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{...}}

// Server → Client
{"jsonrpc":"2.0","id":1,"result":{...}}

// Server → Client (notification)
{"jsonrpc":"2.0","method":"notifications/progress","params":{...}}
```

#### Strengths

**1. True Bidirectional**
- Full-duplex communication
- Server can push anytime
- No polling required
- Real-time updates

**2. Low Latency**
- Persistent connection
- No connection setup per message
- Minimal protocol overhead
- Fast message delivery

**3. Efficient for Real-Time**
- Continuous data streams
- Live updates
- Interactive workflows
- Event-driven architectures

**4. Binary Support**
- Can send binary frames
- Efficient for large payloads
- Mixed text/binary
- Compression support

#### Limitations

**1. Not Standard in MCP SDKs**
- Requires custom implementation
- No official SDK support
- Community implementations only
- More development effort

**2. Connection State Management**
- Keep-alive required
- Reconnection logic
- State synchronization
- Connection pooling complexity

**3. Load Balancing Challenges**
- Sticky sessions required
- Connection draining
- Scaling complexity
- Stateful nature

**4. Firewall/Proxy Issues**
- Some proxies block WebSocket
- Corporate firewalls may restrict
- HTTP/2 alternative often preferred
- Connection timeout variations

#### Performance Characteristics

**Latency:**
- Connection setup: 100-200ms (WebSocket upgrade)
- Message round-trip: 5-20ms
- Sustained messaging: 2-10ms

**Throughput:**
- Messages per second: 5,000-50,000
- Binary transfer: 100-1000 MB/s
- Text transfer: 10-100 MB/s

**Resource Usage:**
- Memory: 10-30MB per connection
- CPU: 1-3% per connection
- Network: Variable based on traffic

**Benchmarks:**
```
Scenario                  Latency    Throughput
──────────────────────────────────────────────
Initial connection        150ms      -
Single message            5ms        -
1000 messages             5s         200/s
Streaming (1 min)         3ms avg    5000/s
```

#### Best Use Cases

**✅ Ideal For:**
- Real-time collaboration
- Live dashboards
- Interactive applications
- Streaming data
- Gaming/simulations
- Chat applications
- Continuous monitoring
- Event streams

**❌ Avoid For:**
- Simple request/response
- Infrequent interactions
- Standard CRUD operations
- Stateless services
- When HTTP is sufficient

#### Implementation Example

**Server (TypeScript):**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", (ws) => {
  const server = new Server({
    name: "websocket-server",
    version: "1.0.0",
  }, {
    capabilities: {
      tools: {},
    },
  });

  // Custom WebSocket transport adapter
  const transport = {
    async start() {
      // Connection already established
    },
    async send(message: JSONRPCMessage) {
      ws.send(JSON.stringify(message));
    },
    async close() {
      ws.close();
    },
    onmessage: undefined,
    onerror: undefined,
    onclose: undefined,
  };

  // Handle incoming messages
  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());
      transport.onmessage?.(message);
    } catch (error) {
      transport.onerror?.(error);
    }
  });

  ws.on("close", () => {
    transport.onclose?.();
  });

  ws.on("error", (error) => {
    transport.onerror?.(error);
  });

  // Connect server to transport
  await server.connect(transport);
});
```

**Client (TypeScript):**
```typescript
import WebSocket from "ws";

const ws = new WebSocket("wss://ws.example.com/mcp");

ws.on("open", () => {
  // Send initialize request
  ws.send(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "ws-client", version: "1.0.0" },
    },
  }));
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.log("Received:", message);
});
```

---

## Security Comparison

### Authentication Methods by Transport

#### stdio: Process Isolation

**Security Model:**
- OS-level process isolation
- Parent process controls child
- No credential exchange
- Trust via execution

**Threat Model:**
```
✅ Protected Against:
- Network eavesdropping (no network)
- Credential theft (no credentials)
- Unauthorized access (OS isolation)

❌ Vulnerable To:
- Local privilege escalation
- Malicious parent process
- Process injection
```

**Best Practices:**
```bash
# Run server with minimal permissions
sudo -u mcp-user node server.js

# Restrict file access
chmod 700 /opt/mcp-server
chown mcp-user:mcp-user /opt/mcp-server

# Use read-only filesystem where possible
docker run --read-only ...
```

#### HTTP: Multiple Authentication Methods

**1. Bearer Tokens (OAuth 2.0)**

```typescript
// Client configuration
{
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
  }
}

// Server validation
import jwt from "jsonwebtoken";

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});
```

**2. API Keys**

```typescript
// Client configuration
{
  "headers": {
    "X-API-Key": "${API_KEY}"
  }
}

// Server validation
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
});
```

**3. mTLS (Mutual TLS)**

```typescript
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("server-key.pem"),
  cert: fs.readFileSync("server-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem"),
  requestCert: true,
  rejectUnauthorized: true,
};

https.createServer(options, app).listen(443);
```

**Security Comparison:**

| Method | Strength | Complexity | Use Case |
|--------|----------|------------|----------|
| Bearer Tokens | High | Moderate | Most common, flexible |
| API Keys | Moderate | Low | Simple auth, service-to-service |
| Basic Auth | Low | Low | Development only |
| mTLS | Very High | High | High-security environments |
| OAuth 2.0 | High | High | User authentication |

#### WebSocket: Header-Based Auth

```typescript
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  // Extract token from header
  const token = new URL(request.url, "http://localhost")
    .searchParams
    .get("token");

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Accept connection
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, payload);
    });
  } catch (error) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});
```

### Encryption Requirements

| Transport | Encryption | Required? | Setup Complexity |
|-----------|------------|-----------|------------------|
| stdio | N/A (local) | N/A | None |
| HTTP | TLS 1.2+ | **REQUIRED** | Moderate (cert management) |
| SSE | TLS 1.2+ | **REQUIRED** | Moderate |
| WebSocket | TLS 1.2+ (WSS) | **REQUIRED** | Moderate |

**Production Requirement:**
```bash
# ✅ Always use encrypted transports in production
https://api.example.com/mcp   # Good
wss://ws.example.com/mcp       # Good

# ❌ Never use unencrypted in production
http://api.example.com/mcp     # Bad - security risk
ws://ws.example.com/mcp        # Bad - security risk
```

---

## Performance and Scalability

### Latency Comparison

**Request Round-Trip Latency (typical):**

```
Transport      Min      Avg      Max      P99
─────────────────────────────────────────────
stdio          0.1ms    1ms      5ms      3ms
HTTP (local)   5ms      20ms     100ms    50ms
HTTP (remote)  50ms     200ms    1000ms   500ms
WebSocket      2ms      10ms     50ms     30ms
```

**Factors Affecting Latency:**

1. **Geographic Distance**
   - Same machine (stdio): <1ms
   - Same datacenter: 1-5ms
   - Cross-region: 50-200ms
   - International: 200-500ms

2. **Network Quality**
   - Packet loss: +50-500ms
   - Congestion: +10-100ms
   - Routing issues: Variable

3. **Server Load**
   - Low load: Baseline latency
   - Medium load: +10-50% latency
   - High load: +100-500% latency
   - Overload: Timeouts

### Throughput Comparison

**Messages per Second (single connection):**

```
Transport      Sequential    Concurrent    Sustained
──────────────────────────────────────────────────
stdio          10,000        N/A           10,000
HTTP           100           1,000         500
WebSocket      5,000         N/A           5,000
```

**Scaling Characteristics:**

| Transport | Horizontal Scaling | Vertical Scaling | Connection Pooling |
|-----------|-------------------|------------------|-------------------|
| stdio | ❌ No | ⚠️ Limited | ❌ No |
| HTTP | ✅ Excellent | ✅ Good | ✅ Yes |
| WebSocket | ⚠️ Sticky sessions | ✅ Good | ⚠️ Complex |

### Resource Consumption

**Per-Connection Resources:**

```
Transport      Memory     CPU        Network I/O
──────────────────────────────────────────────
stdio          20-50MB    <1%        None
HTTP           5-20MB     2-5%       1-10KB/msg
WebSocket      10-30MB    1-3%       Variable
```

**Scalability Limits:**

```
Transport      Max Connections    Bottleneck
────────────────────────────────────────────
stdio          1 per process      Process limit
HTTP           10,000+            Network/memory
WebSocket      10,000+            Memory/file descriptors
```

---

## Use Case Decision Matrix

### Selection Flowchart

```
┌─────────────────────────────────────┐
│  Is it a local-only tool?           │
└────────────┬────────────────────────┘
             │
      Yes ───┴─── No
       │              │
       │              ▼
       │     ┌─────────────────────────────┐
       │     │ Multiple clients/users?      │
       │     └─────────┬───────────────────┘
       │               │
       │        Yes ───┴─── No (single remote user)
       │         │               │
       ▼         ▼               ▼
    stdio    HTTP/WebSocket   HTTP (simpler)
                 │
                 ▼
        ┌──────────────────────┐
        │ Real-time required?  │
        └──────┬───────────────┘
               │
        Yes ───┴─── No
         │              │
         ▼              ▼
    WebSocket        HTTP
```

### Scenario-Based Recommendations

#### 1. Local Development Tool

**Scenario:**
- Developer working on local codebase
- Filesystem operations
- Git integration
- Database queries (local)

**Recommended Transport:** stdio

**Rationale:**
- Zero network overhead
- Simple setup
- Fast iteration
- Secure by default

**Configuration:**
```json
{
  "mcpServers": {
    "dev-tools": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "WORKSPACE": "${PWD}"
      }
    }
  }
}
```

#### 2. Team Collaboration Tool

**Scenario:**
- Multiple team members
- Shared resources (GitHub, Jira)
- Cloud-based APIs
- Team-wide authentication

**Recommended Transport:** HTTP

**Rationale:**
- Multi-user support
- Standard authentication
- Load balancing
- Audit logging

**Configuration:**
```json
{
  "mcpServers": {
    "team-tools": {
      "url": "https://mcp.company.com/github",
      "headers": {
        "Authorization": "Bearer ${TEAM_TOKEN}"
      }
    }
  }
}
```

#### 3. Real-Time Dashboard

**Scenario:**
- Live metrics streaming
- Continuous updates
- Interactive visualizations
- Low-latency requirements

**Recommended Transport:** WebSocket

**Rationale:**
- Bidirectional streaming
- Low latency
- Server push
- Efficient for real-time

**Configuration:**
```typescript
// Custom WebSocket client
const ws = new WebSocket("wss://dashboard.company.com/mcp");

ws.on("message", (data) => {
  const update = JSON.parse(data);
  updateDashboard(update);
});
```

#### 4. SaaS Product Integration

**Scenario:**
- Third-party service
- API rate limits
- Geographic distribution
- Enterprise customers

**Recommended Transport:** HTTP

**Rationale:**
- Internet-scale
- Standard protocol
- CDN compatible
- Enterprise features

**Configuration:**
```json
{
  "mcpServers": {
    "saas-integration": {
      "url": "https://api.service.com/mcp",
      "headers": {
        "X-API-Key": "${SERVICE_API_KEY}",
        "X-Client-ID": "company-123"
      },
      "timeout": 60000
    }
  }
}
```

#### 5. Enterprise Internal Tool

**Scenario:**
- Corporate network
- Strict security policies
- Audit requirements
- High availability

**Recommended Transport:** HTTP with mTLS

**Rationale:**
- Strong authentication
- Audit trail
- Load balancing
- Enterprise ready

**Configuration:**
```json
{
  "mcpServers": {
    "internal-api": {
      "url": "https://internal-mcp.corp.company.com/api",
      "headers": {
        "Authorization": "Bearer ${SSO_TOKEN}"
      },
      "tls": {
        "cert": "/etc/ssl/client-cert.pem",
        "key": "/etc/ssl/client-key.pem",
        "ca": "/etc/ssl/ca-cert.pem"
      }
    }
  }
}
```

---

## Migration Strategies

### stdio → HTTP Migration

**Scenario:** Moving from local development to team deployment

**Phase 1: Preparation**

```bash
# 1. Add HTTP server wrapper
npm install express

# 2. Create HTTP endpoint
cat > server-http.ts << 'EOF'
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const app = express();
const server = new Server({ /* ... */ }, { /* ... */ });

app.post("/mcp", async (req, res) => {
  const result = await server.handleRequest(req.body);
  res.json(result);
});

app.listen(3000);
EOF

# 3. Test locally
node server-http.ts
curl -X POST http://localhost:3000/mcp -d '{"jsonrpc":"2.0","method":"ping"}'
```

**Phase 2: Deployment**

```bash
# 1. Deploy to cloud platform
docker build -t mcp-server .
docker push company/mcp-server:latest

# 2. Configure TLS
kubectl create secret tls mcp-tls --cert=server.crt --key=server.key

# 3. Deploy with load balancer
kubectl apply -f deployment.yaml
```

**Phase 3: Client Migration**

```json
// Old stdio config
{
  "mcpServers": {
    "tool": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}

// New HTTP config
{
  "mcpServers": {
    "tool": {
      "url": "https://mcp.company.com/tool",
      "headers": {
        "Authorization": "Bearer ${TOKEN}"
      }
    }
  }
}
```

**Rollback Plan:**
- Keep stdio version available
- Gradual client migration
- Monitor error rates
- Fallback to stdio if issues

### HTTP → WebSocket Migration

**Scenario:** Adding real-time features

**Hybrid Approach:**

```typescript
// Support both HTTP and WebSocket
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(3000);
const wss = new WebSocketServer({ server: httpServer });

// HTTP endpoint (existing)
app.post("/mcp", async (req, res) => {
  const result = await server.handleRequest(req.body);
  res.json(result);
});

// WebSocket endpoint (new)
wss.on("connection", (ws) => {
  // WebSocket handler
});
```

**Client Configuration:**

```json
{
  "mcpServers": {
    "realtime-tool": {
      "url": "https://api.example.com/mcp",
      "wsUrl": "wss://api.example.com/mcp/ws"
    }
  }
}
```

**Migration Strategy:**
1. Add WebSocket endpoint alongside HTTP
2. Update clients progressively
3. Monitor WebSocket adoption
4. Deprecate HTTP when ready
5. Remove HTTP endpoint

### Transport Abstraction Layer

**Design Pattern for Easy Migration:**

```typescript
// Transport interface
interface Transport {
  send(message: JSONRPCMessage): Promise<void>;
  onMessage(handler: (message: JSONRPCMessage) => void): void;
  close(): Promise<void>;
}

// stdio implementation
class StdioTransport implements Transport {
  async send(message: JSONRPCMessage) {
    process.stdout.write(JSON.stringify(message) + "\n");
  }

  onMessage(handler: (message: JSONRPCMessage) => void) {
    process.stdin.on("line", (line) => {
      handler(JSON.parse(line));
    });
  }

  async close() {
    process.exit(0);
  }
}

// HTTP implementation
class HTTPTransport implements Transport {
  constructor(private url: string) {}

  async send(message: JSONRPCMessage) {
    const response = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(message),
    });
    return response.json();
  }

  onMessage(handler: (message: JSONRPCMessage) => void) {
    // SSE connection for notifications
  }

  async close() {
    // Close connections
  }
}

// Use transport abstraction
const transport = process.env.HTTP_URL
  ? new HTTPTransport(process.env.HTTP_URL)
  : new StdioTransport();

const server = new Server(/* ... */);
await server.connect(transport);
```

---

## Anti-Patterns and Common Mistakes

### Don't: Use HTTP for Local-Only Tools

**Problem:**
```json
// ❌ Bad: HTTP for local filesystem server
{
  "mcpServers": {
    "filesystem": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

**Why it's bad:**
- Unnecessary network overhead
- Additional process (HTTP server)
- Potential port conflicts
- More complex debugging

**Solution:**
```json
// ✅ Good: stdio for local tools
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["filesystem-server.js"]
    }
  }
}
```

### Don't: Use stdio for Multi-User Tools

**Problem:**
```bash
# ❌ Bad: Multiple users running stdio server
user1: claude-code  # Spawns server process
user2: claude-code  # Spawns another process
user3: claude-code  # Spawns yet another process
```

**Why it's bad:**
- Resource duplication
- No shared state
- No access control
- No audit trail

**Solution:**
```json
// ✅ Good: HTTP server for multi-user
{
  "mcpServers": {
    "shared-tool": {
      "url": "https://mcp.company.com/tool",
      "headers": {
        "Authorization": "Bearer ${USER_TOKEN}"
      }
    }
  }
}
```

### Don't: Unencrypted HTTP in Production

**Problem:**
```json
// ❌ Bad: Unencrypted production endpoint
{
  "mcpServers": {
    "production-api": {
      "url": "http://api.example.com/mcp"
    }
  }
}
```

**Why it's bad:**
- Credentials sent in cleartext
- Message tampering possible
- MITM attacks
- Compliance violations

**Solution:**
```json
// ✅ Good: Always use HTTPS
{
  "mcpServers": {
    "production-api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${TOKEN}"
      }
    }
  }
}
```

### Don't: Hardcode Credentials

**Problem:**
```json
// ❌ Bad: Hardcoded token
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer sk_live_abc123..."
      }
    }
  }
}
```

**Why it's bad:**
- Credentials in version control
- Shared credentials
- No rotation
- Security risk

**Solution:**
```json
// ✅ Good: Environment variable
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

---

## Summary and Quick Reference

### Transport Selection Checklist

Use this checklist to quickly determine the right transport:

**Choose stdio if:**
- [ ] Tool runs locally only
- [ ] Single user per instance
- [ ] No network access needed
- [ ] Development/prototyping
- [ ] Simple security requirements

**Choose HTTP if:**
- [ ] Multiple users/clients
- [ ] Remote server deployment
- [ ] Standard authentication needed
- [ ] Load balancing required
- [ ] Enterprise environment
- [ ] Cloud deployment

**Choose WebSocket if:**
- [ ] Real-time bidirectional needed
- [ ] Low latency critical
- [ ] Continuous data streams
- [ ] Server push required
- [ ] Interactive applications
- [ ] Willing to implement custom

**Avoid SSE:**
- [ ] Deprecated, use HTTP instead

### Quick Comparison Table

| Criterion | stdio | HTTP | WebSocket |
|-----------|-------|------|-----------|
| **Setup Complexity** | Simple | Moderate | Moderate-High |
| **Performance** | Excellent | Good | Excellent |
| **Scalability** | Poor | Excellent | Good |
| **Security** | Process isolation | TLS + Auth | TLS + Auth |
| **Multi-user** | No | Yes | Yes |
| **Real-time** | Yes | Via SSE | Yes |
| **Standard Support** | ✅ SDK | ✅ SDK | ⚠️ Custom |
| **Production Ready** | Local only | ✅ Yes | ✅ Yes |

### Best Practices Summary

1. **Use the simplest transport that meets your needs**
2. **Always encrypt network transports (TLS/SSL)**
3. **Use environment variables for credentials**
4. **Implement proper error handling and retries**
5. **Monitor transport health and performance**
6. **Plan migration paths for scaling**
7. **Test across all target platforms**
8. **Document transport choices and rationale**

---

## Related Documentation

**In This Repository:**
- [Protocol Architecture](../01-fundamentals/protocol-architecture.md) - MCP architecture fundamentals
- [Custom Transports](../05-advanced/custom-transports.md) - Building custom transport implementations
- [Enterprise Deployment](../05-advanced/enterprise-deployment.md) - Production deployment patterns
- [Performance Optimization](../05-advanced/performance.md) - Performance tuning guide

**External Resources:**
- [MCP Specification](https://modelcontextprotocol.io/specification) - Official protocol specification
- [Transport Documentation](https://modelcontextprotocol.info/docs/concepts/transports/) - Transport concepts
- [gRPC Transport Blog](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp) - Future gRPC support

**Platform Guides:**
- [Claude Code Setup](../04-platform-guides/claude-code/setup.md)
- [Cursor Setup](../04-platform-guides/cursor/setup.md)
- [Gemini CLI Setup](../04-platform-guides/gemini-cli/setup.md)
- [Antigravity Setup](../04-platform-guides/antigravity/setup.md)

---

**Last Updated:** February 2026
**Category:** Reference - MCP
**Related:** Architecture, Custom Transports, Enterprise Deployment
**Estimated Reading Time:** 35 minutes
