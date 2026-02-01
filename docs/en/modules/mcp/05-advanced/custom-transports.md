# Custom Transports

Advanced guide to implementing custom transport layers for the Model Context Protocol, including transport architecture, protocol requirements, and production-ready examples.

## Overview

MCP's architecture separates communication concerns into two distinct layers: the data layer (JSON-RPC protocol) and the transport layer (message delivery). This separation allows MCP to work across different communication channels while maintaining protocol consistency.

**What you'll learn:**
- Transport layer architecture and responsibilities
- Standard transport implementations (stdio, HTTP, SSE, WebSocket)
- How to implement custom transports
- Protocol requirements and message framing
- Authentication and security considerations
- Testing and debugging custom transports

**Who should read this:**
- Developers building MCP integrations for specialized environments
- Teams needing custom communication channels
- Engineers working with proprietary messaging systems
- Advanced MCP server/client implementers

## Transport Layer Architecture

### MCP's Two-Layer Design

MCP consists of two distinct layers that work together:

```
┌─────────────────────────────────────────────┐
│         Data Layer (Inner Layer)            │
│  ┌───────────────────────────────────────┐  │
│  │    JSON-RPC 2.0 Protocol              │  │
│  │  • Lifecycle management               │  │
│  │  • Tools, resources, prompts          │  │
│  │  • Sampling, elicitation, logging     │  │
│  │  • Notifications and progress         │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│      Transport Layer (Outer Layer)          │
│  ┌───────────────────────────────────────┐  │
│  │    Communication Channel              │  │
│  │  • Connection establishment           │  │
│  │  • Message framing                    │  │
│  │  • Serialization/deserialization      │  │
│  │  • Authentication                     │  │
│  │  • Error handling                     │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Data Layer Responsibilities:**
- Define JSON-RPC message structure
- Specify protocol methods and capabilities
- Handle MCP-specific logic (tools, resources, prompts)
- Manage lifecycle and state

**Transport Layer Responsibilities:**
- Establish and maintain connections
- Frame and deliver messages
- Handle network-level errors
- Manage authentication
- Ensure reliable message delivery

### Why Separate Layers?

**1. Flexibility**

Different environments require different communication mechanisms:
- Local processes: stdio (standard input/output)
- Web services: HTTP/HTTPS
- Real-time applications: WebSocket
- Enterprise systems: gRPC, message queues, custom protocols

**2. Protocol Consistency**

The JSON-RPC protocol remains the same regardless of transport:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {"title": "Bug report"}
  }
}
```

This message is identical whether sent via stdio, HTTP, WebSocket, or a custom transport.

**3. Independent Evolution**

Transport and protocol can evolve independently:
- New transports can support existing protocol versions
- Protocol updates work across all transports
- Transport-specific optimizations don't affect protocol

**4. Simplified Implementation**

Developers can focus on one layer at a time:
- Transport implementers handle message delivery
- Protocol implementers handle MCP semantics
- Clear separation of concerns

### Transport Interface Contract

All MCP transports must implement a common interface:

**Core Requirements:**

```typescript
interface Transport {
  // Start the transport and establish connection
  start(): Promise<void>;

  // Send a JSON-RPC message
  send(message: JSONRPCMessage): Promise<void>;

  // Close the transport
  close(): Promise<void>;

  // Event handlers
  onmessage?: (message: JSONRPCMessage) => void;
  onerror?: (error: Error) => void;
  onclose?: () => void;
}
```

**Message Flow:**

```
Client                Transport                Server
  |                      |                      |
  |---start()----------->|                      |
  |                      |---connection-------->|
  |                      |                      |
  |---send(message)----->|                      |
  |                      |---serialize--------->|
  |                      |---deliver----------->|
  |                      |                      |
  |                      |<--response-----------|
  |<--onmessage(reply)---|                      |
  |                      |                      |
  |---close()----------->|                      |
  |                      |---disconnect-------->|
```

## Standard Transport Implementations

MCP provides several standard transports out of the box. Understanding these implementations provides a foundation for creating custom transports.

### stdio Transport

**Use case:** Local MCP servers running as child processes

**How it works:**
- Server runs as a subprocess
- Communication via standard input/output streams
- Each message is a single line of JSON
- Message framing: newline-delimited JSON

**Message Format:**

```
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}\n
{"jsonrpc":"2.0","id":1,"result":{...}}\n
{"jsonrpc":"2.0","method":"notifications/initialized"}\n
```

**TypeScript Implementation (Conceptual):**

```typescript
import { spawn } from 'child_process';
import { createInterface } from 'readline';

class StdioTransport {
  private process: ChildProcess;
  private readline: ReadLine;

  async start() {
    // Spawn server process
    this.process = spawn('npx', ['-y', 'my-mcp-server']);

    // Set up line-by-line reading
    this.readline = createInterface({
      input: this.process.stdout,
      output: this.process.stdin,
    });

    // Handle incoming messages
    this.readline.on('line', (line) => {
      try {
        const message = JSON.parse(line);
        this.onmessage?.(message);
      } catch (error) {
        this.onerror?.(new Error(`Failed to parse message: ${line}`));
      }
    });

    // Handle process errors
    this.process.on('error', (error) => {
      this.onerror?.(error);
    });

    // Handle process exit
    this.process.on('exit', (code) => {
      this.onclose?.();
    });
  }

  async send(message: JSONRPCMessage) {
    // Serialize to single-line JSON
    const line = JSON.stringify(message) + '\n';

    // Write to stdin
    this.process.stdin.write(line);
  }

  async close() {
    this.process.kill();
  }
}
```

**Key Characteristics:**

- **Synchronous**: Single client, single server
- **Reliable**: No network failures (local process)
- **Simple**: No authentication needed
- **Efficient**: Minimal overhead
- **Platform-dependent**: Requires process spawning

**Configuration Example:**

```json
{
  "mcpServers": {
    "local-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    }
  }
}
```

### HTTP Transport (Streamable)

**Use case:** Remote MCP servers, web services, cloud deployments

**How it works:**
- Client sends JSON-RPC messages via HTTP POST
- Server can respond immediately or stream via Server-Sent Events
- Supports authentication via HTTP headers
- Stateless or stateful (with SSE)

**Message Flow:**

```
Client                                    Server
  |                                         |
  |---POST /mcp--------------------------->|
  |   Content-Type: application/json       |
  |   Authorization: Bearer token          |
  |   Body: {"jsonrpc":"2.0",...}          |
  |                                         |
  |<--200 OK------------------------------|
  |   Content-Type: application/json       |
  |   Body: {"jsonrpc":"2.0",...}          |
  |                                         |
  |---POST /mcp (with SSE)---------------->|
  |                                         |
  |<--200 OK------------------------------|
  |   Content-Type: text/event-stream      |
  |   data: {"jsonrpc":"2.0",...}          |
  |   data: {"jsonrpc":"2.0",...}          |
```

**TypeScript Implementation (Conceptual):**

```typescript
class HTTPTransport {
  private url: string;
  private headers: Record<string, string>;
  private sseConnection?: EventSource;

  constructor(url: string, headers: Record<string, string> = {}) {
    this.url = url;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async start() {
    // HTTP is connectionless, but we can test connectivity
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'ping',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }
  }

  async send(message: JSONRPCMessage) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is SSE or regular JSON
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        // Handle SSE streaming response
        await this.handleSSE(response);
      } else {
        // Handle immediate JSON response
        const reply = await response.json();
        this.onmessage?.(reply);
      }
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }
  }

  private async handleSSE(response: Response) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const message = JSON.parse(data);
            this.onmessage?.(message);
          } catch (error) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  }

  async close() {
    this.sseConnection?.close();
  }
}
```

**Key Characteristics:**

- **Stateless**: Each request is independent (without SSE)
- **Scalable**: Can handle many clients
- **Authenticated**: HTTP headers for auth
- **Cloud-friendly**: Works with load balancers, CDNs
- **Standard**: Uses well-known protocols

**Configuration Example:**

```json
{
  "mcpServers": {
    "remote-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      },
      "timeout": 30000
    }
  }
}
```

### WebSocket Transport

**Use case:** Real-time bidirectional communication, long-lived connections

**How it works:**
- Persistent connection between client and server
- Full-duplex communication
- Messages sent in both directions
- Automatic reconnection support

**Message Flow:**

```
Client                                    Server
  |                                         |
  |---WebSocket Upgrade------------------->|
  |                                         |
  |<--101 Switching Protocols--------------|
  |                                         |
  |<======= WebSocket Connection =========>|
  |                                         |
  |---{"jsonrpc":"2.0",...}--------------->|
  |<--{"jsonrpc":"2.0",...}----------------|
  |                                         |
  |---{"jsonrpc":"2.0",...}--------------->|
  |<--{"jsonrpc":"2.0",...}----------------|
```

**TypeScript Implementation (Conceptual):**

```typescript
class WebSocketTransport {
  private ws?: WebSocket;
  private url: string;
  private reconnect: boolean;
  private reconnectInterval: number;

  constructor(
    url: string,
    options: { reconnect?: boolean; reconnectInterval?: number } = {}
  ) {
    this.url = url;
    this.reconnect = options.reconnect ?? true;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
  }

  async start() {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onerror = (event) => {
        const error = new Error('WebSocket error');
        this.onerror?.(error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.onmessage?.(message);
        } catch (error) {
          this.onerror?.(new Error(`Failed to parse message: ${event.data}`));
        }
      };

      this.ws.onclose = () => {
        this.onclose?.();

        if (this.reconnect) {
          setTimeout(() => {
            this.start().catch((error) => {
              this.onerror?.(error);
            });
          }, this.reconnectInterval);
        }
      };
    });
  }

  async send(message: JSONRPCMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.ws.send(JSON.stringify(message));
  }

  async close() {
    this.reconnect = false; // Disable auto-reconnect
    this.ws?.close();
  }
}
```

**Key Characteristics:**

- **Persistent**: Long-lived connections
- **Bidirectional**: Server can push messages
- **Real-time**: Low latency
- **Efficient**: Less overhead than HTTP
- **Stateful**: Connection state management

**Configuration Example:**

```json
{
  "mcpServers": {
    "realtime-server": {
      "type": "websocket",
      "url": "wss://api.example.com/mcp",
      "reconnect": true,
      "reconnectInterval": 5000
    }
  }
}
```

### SSE Transport (Deprecated)

**Note:** Server-Sent Events transport is deprecated in favor of HTTP transport with optional SSE streaming.

**Why deprecated:**
- Limited to server-to-client streaming
- HTTP transport provides same functionality
- Better developer experience with unified HTTP approach

**Migration path:**

```json
// Old SSE configuration
{
  "type": "sse",
  "url": "https://api.example.com/sse"
}

// New HTTP configuration (equivalent)
{
  "type": "http",
  "url": "https://api.example.com/mcp"
}
```

The server can return SSE responses when appropriate, but the client configuration uses HTTP transport.

## Creating Custom Transports

Custom transports allow MCP to work in specialized environments. Common use cases include enterprise message buses, proprietary protocols, and optimized communication channels.

### Custom Transport Requirements

Every custom transport must:

**1. Implement the Transport Interface**

```typescript
interface CustomTransport {
  start(): Promise<void>;
  send(message: JSONRPCMessage): Promise<void>;
  close(): Promise<void>;
  onmessage?: (message: JSONRPCMessage) => void;
  onerror?: (error: Error) => void;
  onclose?: () => void;
}
```

**2. Handle Message Serialization**

- Serialize JSON-RPC messages to wire format
- Deserialize incoming messages
- Validate message structure

**3. Ensure Reliable Delivery**

- Guarantee message order (for stateful connections)
- Handle network failures gracefully
- Implement retries when appropriate

**4. Support Error Handling**

- Transport-level errors (connection failures)
- Protocol-level errors (malformed messages)
- Timeout handling

**5. Manage Connection Lifecycle**

- Establish connections
- Maintain connection health
- Clean up resources on close

### Example: Redis Pub/Sub Transport

Let's build a custom transport using Redis pub/sub for message-based communication.

**Use case:**
- Distributed MCP servers across multiple nodes
- Message-based communication via Redis
- Multiple clients subscribing to server responses

**Architecture:**

```
Client A                Redis               Server
  |                      |                    |
  |--publish------------>|                    |
  |  (channel: req)      |---deliver-------->|
  |                      |                    |
  |                      |<--publish---------|
  |<--subscribe----------|   (channel: res)  |
  |  (channel: res)      |                    |
  |                      |                    |

Client B
  |                      |                    |
  |--publish------------>|                    |
  |  (channel: req)      |---deliver-------->|
  |                      |                    |
  |<--subscribe----------|<--publish---------|
  |  (channel: res)      |   (channel: res)  |
```

**Implementation:**

```typescript
import { createClient, RedisClientType } from 'redis';

interface RedisTransportOptions {
  url: string;
  requestChannel: string;
  responseChannel: string;
  clientId: string;
}

class RedisTransport {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private options: RedisTransportOptions;
  private messageQueue: Map<string, (response: JSONRPCMessage) => void> = new Map();

  onmessage?: (message: JSONRPCMessage) => void;
  onerror?: (error: Error) => void;
  onclose?: () => void;

  constructor(options: RedisTransportOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    try {
      // Create separate clients for pub and sub
      this.publisher = createClient({ url: this.options.url });
      this.subscriber = createClient({ url: this.options.url });

      // Connect clients
      await this.publisher.connect();
      await this.subscriber.connect();

      // Subscribe to response channel
      await this.subscriber.subscribe(
        this.options.responseChannel,
        (message) => {
          this.handleMessage(message);
        }
      );

      console.log(`Redis transport connected: ${this.options.clientId}`);
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }
  }

  async send(message: JSONRPCMessage): Promise<void> {
    try {
      // Add client ID for response routing
      const wrappedMessage = {
        ...message,
        _clientId: this.options.clientId,
      };

      // Serialize and publish
      const serialized = JSON.stringify(wrappedMessage);
      await this.publisher.publish(this.options.requestChannel, serialized);

      // For requests (with id), wait for response
      if ('id' in message && message.id !== undefined) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            this.messageQueue.delete(String(message.id));
            reject(new Error(`Request timeout: ${message.id}`));
          }, 30000);

          this.messageQueue.set(String(message.id), (response) => {
            clearTimeout(timeoutId);
            this.onmessage?.(response);
            resolve();
          });
        });
      }
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }
  }

  private handleMessage(rawMessage: string): void {
    try {
      const message = JSON.parse(rawMessage);

      // Check if message is for this client
      if (message._clientId && message._clientId !== this.options.clientId) {
        return; // Ignore messages for other clients
      }

      // Remove transport metadata
      delete message._clientId;

      // Handle response to pending request
      if ('id' in message && message.id !== undefined) {
        const handler = this.messageQueue.get(String(message.id));
        if (handler) {
          this.messageQueue.delete(String(message.id));
          handler(message);
          return;
        }
      }

      // Handle notifications or unsolicited messages
      this.onmessage?.(message);
    } catch (error) {
      this.onerror?.(new Error(`Failed to parse message: ${rawMessage}`));
    }
  }

  async close(): Promise<void> {
    try {
      await this.subscriber.unsubscribe(this.options.responseChannel);
      await this.publisher.disconnect();
      await this.subscriber.disconnect();
      this.onclose?.();
    } catch (error) {
      this.onerror?.(error as Error);
    }
  }
}
```

**Usage:**

```typescript
// Create Redis transport
const transport = new RedisTransport({
  url: 'redis://localhost:6379',
  requestChannel: 'mcp:requests',
  responseChannel: 'mcp:responses',
  clientId: 'client-123',
});

// Set up event handlers
transport.onmessage = (message) => {
  console.log('Received:', message);
};

transport.onerror = (error) => {
  console.error('Transport error:', error);
};

// Start transport
await transport.start();

// Send message
await transport.send({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
});

// Close when done
await transport.close();
```

### Example: gRPC Transport

gRPC provides efficient binary serialization and is ideal for high-performance scenarios.

**Note:** Google Cloud is working with MCP maintainers to support pluggable transports and provide official gRPC support ([source](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp)).

**Conceptual Implementation:**

```protobuf
// mcp.proto
syntax = "proto3";

package mcp;

service MCPService {
  rpc Call(MCPRequest) returns (MCPResponse);
  rpc Stream(stream MCPRequest) returns (stream MCPResponse);
}

message MCPRequest {
  string json_rpc_message = 1;
}

message MCPResponse {
  string json_rpc_message = 1;
}
```

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

class GRPCTransport {
  private client: any;
  private stream?: any;

  async start(): Promise<void> {
    // Load proto definition
    const packageDefinition = protoLoader.loadSync('mcp.proto');
    const proto = grpc.loadPackageDefinition(packageDefinition) as any;

    // Create client
    this.client = new proto.mcp.MCPService(
      'localhost:50051',
      grpc.credentials.createInsecure()
    );

    // Establish streaming connection
    this.stream = this.client.Stream();

    // Handle incoming messages
    this.stream.on('data', (response: any) => {
      try {
        const message = JSON.parse(response.json_rpc_message);
        this.onmessage?.(message);
      } catch (error) {
        this.onerror?.(error as Error);
      }
    });

    this.stream.on('error', (error: Error) => {
      this.onerror?.(error);
    });

    this.stream.on('end', () => {
      this.onclose?.();
    });
  }

  async send(message: JSONRPCMessage): Promise<void> {
    const request = {
      json_rpc_message: JSON.stringify(message),
    };

    this.stream.write(request);
  }

  async close(): Promise<void> {
    this.stream?.end();
  }
}
```

## Message Framing and Serialization

Proper message framing ensures messages are correctly identified and parsed from the byte stream.

### Framing Strategies

**1. Newline-Delimited (stdio)**

Each message is a single line:
```
{"jsonrpc":"2.0","id":1,"method":"initialize"}\n
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-06-18"}}\n
```

**Pros:** Simple, human-readable
**Cons:** Messages can't contain literal newlines

**Implementation:**

```typescript
function frameMessage(message: JSONRPCMessage): string {
  return JSON.stringify(message) + '\n';
}

function parseFramedMessage(line: string): JSONRPCMessage {
  return JSON.parse(line.trim());
}
```

**2. Length-Prefixed**

Message length precedes content:
```
0000052{"jsonrpc":"2.0","id":1,"method":"initialize"}
```

**Pros:** Supports any content, efficient binary protocols
**Cons:** More complex parsing

**Implementation:**

```typescript
function frameMessage(message: JSONRPCMessage): Buffer {
  const json = JSON.stringify(message);
  const length = Buffer.byteLength(json);
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(length, 0);
  return Buffer.concat([lengthBuffer, Buffer.from(json)]);
}

async function parseFramedMessage(stream: Readable): Promise<JSONRPCMessage> {
  // Read 4-byte length prefix
  const lengthBuffer = await readExactly(stream, 4);
  const length = lengthBuffer.readUInt32BE(0);

  // Read message content
  const messageBuffer = await readExactly(stream, length);
  return JSON.parse(messageBuffer.toString('utf8'));
}
```

**3. HTTP Body (HTTP transport)**

Each HTTP request/response body is a complete message:
```http
POST /mcp HTTP/1.1
Content-Type: application/json
Content-Length: 52

{"jsonrpc":"2.0","id":1,"method":"initialize"}
```

**Pros:** Standard HTTP semantics, well-understood
**Cons:** More overhead than binary protocols

**4. WebSocket Frames**

WebSocket protocol handles framing:
```typescript
ws.send(JSON.stringify(message)); // Automatically framed
```

**Pros:** Built-in framing, bidirectional
**Cons:** Requires WebSocket support

### Serialization Best Practices

**1. Compact JSON**

Don't include unnecessary whitespace:

```typescript
// Good
JSON.stringify(message)
// {"jsonrpc":"2.0","id":1}

// Bad (wastes bandwidth)
JSON.stringify(message, null, 2)
// {
//   "jsonrpc": "2.0",
//   "id": 1
// }
```

**2. UTF-8 Encoding**

Always use UTF-8 for text encoding:

```typescript
Buffer.from(JSON.stringify(message), 'utf8');
```

**3. Binary for Large Payloads**

For large data, consider binary encoding:

```typescript
import { encode, decode } from 'msgpack-lite';

// Serialize with MessagePack
const binary = encode(message);

// Deserialize
const message = decode(binary);
```

**4. Schema Validation**

Validate messages before sending/after receiving:

```typescript
import { z } from 'zod';

const JSONRPCRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.any().optional(),
});

function validateMessage(message: unknown): JSONRPCMessage {
  return JSONRPCRequestSchema.parse(message);
}
```

## Authentication and Security

Custom transports must handle authentication and secure communication.

### Authentication Strategies

**1. Bearer Tokens (HTTP)**

```typescript
class HTTPTransport {
  private token: string;

  async send(message: JSONRPCMessage) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed');
    }

    return response.json();
  }
}
```

**2. API Keys (Custom Header)**

```typescript
class CustomTransport {
  private apiKey: string;

  async send(message: JSONRPCMessage) {
    const response = await fetch(this.url, {
      headers: {
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(message),
    });
  }
}
```

**3. OAuth 2.0**

```typescript
class OAuthTransport {
  private accessToken?: string;
  private refreshToken?: string;

  async start() {
    // Exchange authorization code for tokens
    const tokens = await this.exchangeAuthorizationCode();
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
  }

  async send(message: JSONRPCMessage) {
    // Check token expiration
    if (this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    const response = await fetch(this.url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(message),
    });

    // Handle token expiration
    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.send(message); // Retry
    }
  }

  private async refreshAccessToken() {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken!,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    const tokens = await response.json();
    this.accessToken = tokens.access_token;
  }
}
```

**4. mTLS (Mutual TLS)**

```typescript
import * as https from 'https';
import * as fs from 'fs';

class MTLSTransport {
  private agent: https.Agent;

  async start() {
    // Load client certificate and key
    this.agent = new https.Agent({
      cert: fs.readFileSync('client-cert.pem'),
      key: fs.readFileSync('client-key.pem'),
      ca: fs.readFileSync('ca-cert.pem'),
    });
  }

  async send(message: JSONRPCMessage) {
    const response = await fetch(this.url, {
      // @ts-ignore
      agent: this.agent,
      method: 'POST',
      body: JSON.stringify(message),
    });
  }
}
```

### Security Best Practices

**1. Always Use Encryption**

- HTTPS for HTTP transports
- WSS (WebSocket Secure) for WebSocket transports
- TLS for custom TCP protocols

```typescript
// Good
const transport = new HTTPTransport('https://api.example.com/mcp');

// Bad (unencrypted)
const transport = new HTTPTransport('http://api.example.com/mcp');
```

**2. Validate Server Certificates**

```typescript
import * as https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: true, // Verify server certificate
});
```

**3. Never Log Credentials**

```typescript
// Bad
console.log(`Connecting with token: ${token}`);

// Good
console.log('Connecting with authentication...');
```

**4. Store Tokens Securely**

- Use system keychain (macOS Keychain, Windows Credential Manager)
- Environment variables for development
- Encrypted files for production

```typescript
import * as keytar from 'keytar';

// Store token securely
await keytar.setPassword('mcp-transport', 'api-token', token);

// Retrieve token
const token = await keytar.getPassword('mcp-transport', 'api-token');
```

**5. Implement Token Refresh**

Don't wait for 401 errors:

```typescript
class TokenManager {
  private token: string;
  private expiresAt: number;

  async getToken(): Promise<string> {
    // Refresh proactively (5 minutes before expiry)
    if (Date.now() > this.expiresAt - 300000) {
      await this.refresh();
    }
    return this.token;
  }
}
```

## Error Handling in Transports

Robust error handling is critical for production transports.

### Error Categories

**1. Connection Errors**

```typescript
class CustomTransport {
  async start() {
    try {
      await this.connect();
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Server not reachable. Check if server is running.');
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Connection timeout. Server may be slow or unreachable.');
      }
      throw error;
    }
  }
}
```

**2. Authentication Errors**

```typescript
async send(message: JSONRPCMessage) {
  const response = await fetch(this.url, {
    headers: { 'Authorization': `Bearer ${this.token}` },
    body: JSON.stringify(message),
  });

  if (response.status === 401) {
    throw new Error('Authentication failed. Token may be invalid or expired.');
  }

  if (response.status === 403) {
    throw new Error('Forbidden. Token lacks required permissions.');
  }
}
```

**3. Serialization Errors**

```typescript
private handleMessage(rawMessage: string) {
  try {
    const message = JSON.parse(rawMessage);
    this.onmessage?.(message);
  } catch (error) {
    this.onerror?.(new Error(
      `Failed to parse message: ${rawMessage.substring(0, 100)}`
    ));
  }
}
```

**4. Network Errors**

```typescript
async send(message: JSONRPCMessage) {
  try {
    return await this.sendWithRetry(message);
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('DNS lookup failed. Check server hostname.');
    }
    if (error.code === 'ECONNRESET') {
      throw new Error('Connection reset. Server may have crashed.');
    }
    throw error;
  }
}
```

### Retry Strategies

**1. Exponential Backoff**

```typescript
class RetryableTransport {
  private async sendWithRetry(
    message: JSONRPCMessage,
    attempt: number = 1,
    maxAttempts: number = 5
  ): Promise<void> {
    try {
      await this.sendInternal(message);
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.sendWithRetry(message, attempt + 1, maxAttempts);
    }
  }
}
```

**2. Circuit Breaker**

```typescript
class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private readonly threshold: number = 5;
  private readonly resetTimeout: number = 60000; // 1 minute

  isOpen(): boolean {
    // Reset if enough time has passed
    if (Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.failures = 0;
      return false;
    }

    return this.failures >= this.threshold;
  }

  recordSuccess() {
    this.failures = 0;
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
  }
}

class ResilientTransport {
  private circuitBreaker = new CircuitBreaker();

  async send(message: JSONRPCMessage) {
    if (this.circuitBreaker.isOpen()) {
      throw new Error('Circuit breaker open. Too many failures.');
    }

    try {
      await this.sendInternal(message);
      this.circuitBreaker.recordSuccess();
    } catch (error) {
      this.circuitBreaker.recordFailure();
      throw error;
    }
  }
}
```

**3. Request Timeouts**

```typescript
async send(message: JSONRPCMessage) {
  const timeout = 30000; // 30 seconds

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });

  return Promise.race([
    this.sendInternal(message),
    timeoutPromise,
  ]);
}
```

## Testing Custom Transports

Thorough testing ensures transport reliability.

### Unit Testing

**Test Connection Establishment:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CustomTransport', () => {
  let transport: CustomTransport;

  beforeEach(() => {
    transport = new CustomTransport({ url: 'http://localhost:3000' });
  });

  afterEach(async () => {
    await transport.close();
  });

  it('should establish connection', async () => {
    await expect(transport.start()).resolves.toBeUndefined();
  });

  it('should fail with invalid URL', async () => {
    const badTransport = new CustomTransport({ url: 'invalid-url' });
    await expect(badTransport.start()).rejects.toThrow();
  });
});
```

**Test Message Sending:**

```typescript
it('should send and receive messages', async () => {
  await transport.start();

  const received: JSONRPCMessage[] = [];
  transport.onmessage = (msg) => received.push(msg);

  await transport.send({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
  });

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(received).toHaveLength(1);
  expect(received[0]).toMatchObject({
    jsonrpc: '2.0',
    id: 1,
  });
});
```

**Test Error Handling:**

```typescript
it('should handle serialization errors', async () => {
  await transport.start();

  const errors: Error[] = [];
  transport.onerror = (err) => errors.push(err);

  // Simulate malformed message
  transport['handleMessage']('invalid json');

  expect(errors).toHaveLength(1);
  expect(errors[0].message).toContain('Failed to parse');
});
```

### Integration Testing

**Test with Real Server:**

```typescript
describe('Transport Integration', () => {
  let server: MCPServer;
  let transport: CustomTransport;

  beforeEach(async () => {
    // Start test server
    server = new MCPServer();
    await server.listen(3000);

    // Connect transport
    transport = new CustomTransport({ url: 'http://localhost:3000' });
    await transport.start();
  });

  afterEach(async () => {
    await transport.close();
    await server.close();
  });

  it('should complete full MCP lifecycle', async () => {
    const responses: JSONRPCMessage[] = [];
    transport.onmessage = (msg) => responses.push(msg);

    // Initialize
    await transport.send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    });

    await waitFor(() => responses.length > 0);
    expect(responses[0]).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: expect.objectContaining({
        protocolVersion: '2025-06-18',
      }),
    });
  });
});
```

**Test Reconnection:**

```typescript
it('should reconnect after connection loss', async () => {
  await transport.start();

  // Simulate connection loss
  await server.close();

  // Wait for reconnect attempt
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Restart server
  await server.listen(3000);

  // Verify reconnection
  await transport.send({
    jsonrpc: '2.0',
    method: 'ping',
  });

  // Should succeed without throwing
});
```

### Load Testing

**Concurrent Requests:**

```typescript
it('should handle concurrent requests', async () => {
  await transport.start();

  const promises = Array.from({ length: 100 }, (_, i) =>
    transport.send({
      jsonrpc: '2.0',
      id: i,
      method: 'tools/list',
    })
  );

  await expect(Promise.all(promises)).resolves.toHaveLength(100);
});
```

**Sustained Load:**

```typescript
it('should handle sustained load', async () => {
  await transport.start();

  const duration = 60000; // 1 minute
  const startTime = Date.now();
  let requestCount = 0;

  while (Date.now() - startTime < duration) {
    await transport.send({
      jsonrpc: '2.0',
      id: requestCount++,
      method: 'tools/list',
    });

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(requestCount).toBeGreaterThan(500);
});
```

## SDK Integration

Integrate custom transports with MCP SDKs.

### TypeScript SDK Integration

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// Create custom transport
const transport = new RedisTransport({
  url: 'redis://localhost:6379',
  requestChannel: 'mcp:requests',
  responseChannel: 'mcp:responses',
  clientId: 'client-123',
});

// Create MCP client with custom transport
const client = new Client({
  name: 'my-client',
  version: '1.0.0',
}, {
  capabilities: {},
});

// Connect client to transport
await client.connect(transport);

// Use MCP client normally
const tools = await client.listTools();
console.log('Available tools:', tools);
```

### Python SDK Integration

```python
from mcp import ClientSession
from mcp.client.stdio import StdioServerParameters
from typing import Any

class RedisTransport:
    async def start(self) -> None:
        # Connect to Redis
        pass

    async def send(self, message: dict[str, Any]) -> None:
        # Publish message
        pass

    async def close(self) -> None:
        # Disconnect
        pass

# Create custom transport
transport = RedisTransport(
    url='redis://localhost:6379',
    request_channel='mcp:requests',
    response_channel='mcp:responses',
    client_id='client-123'
)

# Create MCP session with custom transport
async with ClientSession(transport) as session:
    # Initialize
    await session.initialize()

    # Use session normally
    tools = await session.list_tools()
    print(f'Available tools: {tools}')
```

## Production Considerations

### Performance Optimization

**1. Connection Pooling**

```typescript
class PooledHTTPTransport {
  private pool: http.Agent;

  constructor(url: string) {
    this.pool = new http.Agent({
      keepAlive: true,
      maxSockets: 10,
      maxFreeSockets: 5,
      timeout: 30000,
    });
  }

  async send(message: JSONRPCMessage) {
    return fetch(this.url, {
      // @ts-ignore
      agent: this.pool,
      method: 'POST',
      body: JSON.stringify(message),
    });
  }
}
```

**2. Message Batching**

```typescript
class BatchingTransport {
  private queue: JSONRPCMessage[] = [];
  private batchTimer?: NodeJS.Timeout;

  async send(message: JSONRPCMessage) {
    this.queue.push(message);

    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flushBatch();
      }, 100); // Batch every 100ms
    }
  }

  private async flushBatch() {
    const batch = this.queue.splice(0);
    this.batchTimer = undefined;

    if (batch.length === 0) return;

    await this.sendBatch(batch);
  }
}
```

**3. Compression**

```typescript
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

class CompressedTransport {
  async send(message: JSONRPCMessage) {
    // Compress large messages
    const json = JSON.stringify(message);

    if (json.length > 1024) {
      const compressed = await gzip(json);

      return fetch(this.url, {
        headers: {
          'Content-Encoding': 'gzip',
        },
        body: compressed,
      });
    }

    // Send small messages uncompressed
    return fetch(this.url, {
      body: json,
    });
  }
}
```

### Monitoring and Observability

**1. Metrics Collection**

```typescript
class InstrumentedTransport {
  private metrics = {
    requestCount: 0,
    errorCount: 0,
    totalLatency: 0,
  };

  async send(message: JSONRPCMessage) {
    const startTime = Date.now();
    this.metrics.requestCount++;

    try {
      const result = await this.sendInternal(message);
      this.metrics.totalLatency += Date.now() - startTime;
      return result;
    } catch (error) {
      this.metrics.errorCount++;
      throw error;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgLatency: this.metrics.totalLatency / this.metrics.requestCount,
      errorRate: this.metrics.errorCount / this.metrics.requestCount,
    };
  }
}
```

**2. Distributed Tracing**

```typescript
import { trace, context } from '@opentelemetry/api';

class TracedTransport {
  private tracer = trace.getTracer('mcp-transport');

  async send(message: JSONRPCMessage) {
    const span = this.tracer.startSpan('mcp.transport.send', {
      attributes: {
        'mcp.method': message.method,
        'mcp.id': message.id,
      },
    });

    try {
      const result = await context.with(
        trace.setSpan(context.active(), span),
        () => this.sendInternal(message)
      );

      span.setStatus({ code: 0 }); // OK
      return result;
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // ERROR
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  }
}
```

**3. Logging**

```typescript
import * as winston from 'winston';

class LoggedTransport {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'transport.log' }),
    ],
  });

  async send(message: JSONRPCMessage) {
    this.logger.info('Sending message', {
      method: message.method,
      id: message.id,
      timestamp: Date.now(),
    });

    try {
      const result = await this.sendInternal(message);

      this.logger.info('Message sent successfully', {
        method: message.method,
        id: message.id,
      });

      return result;
    } catch (error) {
      this.logger.error('Message send failed', {
        method: message.method,
        id: message.id,
        error: error.message,
      });
      throw error;
    }
  }
}
```

## Future of MCP Transports

The MCP ecosystem is actively evolving to support more flexible transport implementations.

### 2026 Roadmap

According to the [January 2026 MCP Core Maintainer Update](https://blog.modelcontextprotocol.io/posts/2026-01-22-core-maintainer-update/), several transport-related improvements are planned:

**1. Pluggable Transports**

MCP maintainers are working to support pluggable transports in the SDK, making it easier to implement and distribute custom transports as separate packages.

**2. gRPC Transport**

Google Cloud is collaborating with MCP maintainers to provide official gRPC support. The [gRPC transport blog post](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp) outlines the approach:

- Native gRPC support (no transcoding)
- Efficient binary serialization
- Bidirectional streaming
- Built-in authentication

**3. Enhanced Authentication**

Specification Enhancement Proposals (SEPs) are in progress for:
- DPoP (Demonstrating Proof-of-Possession) extension
- Improved OAuth 2.0 integration
- Token-based authentication patterns

**4. Multi-turn SSE**

Improvements to Server-Sent Events for better streaming support and multi-turn conversations.

**5. Specification Release**

Finalization of transport-related SEPs is targeted for Q1 2026, with inclusion in the next specification release tentatively scheduled for June 2026.

### Community Contributions

The MCP community is encouraged to:

- Implement and share custom transports
- Contribute transport implementations to the ecosystem
- Provide feedback on transport design and requirements
- Help improve SDK support for custom transports

**Resources:**
- [Transports Documentation](https://modelcontextprotocol.info/docs/concepts/transports/)
- [Architecture Overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [MCP Blog](https://blog.modelcontextprotocol.io/)

## Best Practices Summary

### Design

1. **Separate concerns**: Keep transport logic independent of protocol logic
2. **Follow interface**: Implement the complete Transport interface contract
3. **Handle errors gracefully**: Provide clear, actionable error messages
4. **Support reconnection**: Implement automatic reconnection for unstable connections

### Security

1. **Always encrypt**: Use TLS/SSL for all network transports
2. **Validate certificates**: Don't disable certificate verification
3. **Secure credentials**: Use system keychain or encrypted storage
4. **Implement authentication**: Don't rely on network security alone

### Performance

1. **Connection pooling**: Reuse connections when possible
2. **Efficient serialization**: Use compact JSON or binary formats
3. **Batch messages**: Combine multiple messages when latency allows
4. **Monitor performance**: Track latency, throughput, and error rates

### Reliability

1. **Retry with backoff**: Implement exponential backoff for failures
2. **Circuit breaker**: Prevent cascading failures
3. **Timeout requests**: Don't wait indefinitely
4. **Test thoroughly**: Unit, integration, and load testing

### Observability

1. **Log important events**: Connection, authentication, errors
2. **Collect metrics**: Request count, latency, error rate
3. **Distributed tracing**: Track requests across services
4. **Health checks**: Expose transport health status

## Resources

### Official Documentation

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [Transports Concepts](https://modelcontextprotocol.info/docs/concepts/transports/)
- [Architecture Overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)

### Community Resources

- [MCP Blog](https://blog.modelcontextprotocol.io/)
- [gRPC Transport Blog Post](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp)
- [MCP Transport Future Discussion](http://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/)
- [GitHub Discussions](https://github.com/modelcontextprotocol)

### Related Guides

- [Protocol Architecture](../01-fundamentals/protocol-architecture.md) - MCP architecture fundamentals
- [Getting Started](../03-creating-servers/getting-started.md) - Building MCP servers
- [Authentication Guide](../02-using-mcp/authentication/oauth-guide.md) - OAuth and authentication
- [Testing Guide](../03-creating-servers/testing.md) - Testing MCP implementations

## Summary

Custom transports enable MCP to work in diverse environments while maintaining protocol consistency. By understanding transport requirements, implementing proper error handling, and following security best practices, you can build production-ready custom transports for specialized use cases.

Key takeaways:

1. **Layer separation**: Transport handles delivery, protocol handles semantics
2. **Interface contract**: All transports implement the same interface
3. **Standard implementations**: stdio, HTTP, WebSocket provide patterns to follow
4. **Security first**: Always encrypt, authenticate, and validate
5. **Production-ready**: Include retry logic, monitoring, and comprehensive testing
6. **Future-proof**: Follow MCP community developments for upcoming improvements

Happy building!

---

**Sources:**
- [Transports – Model Context Protocol](https://modelcontextprotocol.info/docs/concepts/transports/)
- [gRPC as a custom transport for MCP | Google Cloud Blog](https://cloud.google.com/blog/products/networking/grpc-as-a-native-transport-for-mcp)
- [Architecture overview - Model Context Protocol](https://modelcontextprotocol.io/docs/learn/architecture)
- [Exploring the Future of MCP Transports | Model Context Protocol Blog](http://blog.modelcontextprotocol.io/posts/2025-12-19-mcp-transport-future/)
- [January MCP Core Maintainer Update | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-01-22-core-maintainer-update/)

**Last Updated:** February 2026
**Category:** Advanced - MCP
**Related:** Protocol Architecture, Custom Implementations, Security, Testing
