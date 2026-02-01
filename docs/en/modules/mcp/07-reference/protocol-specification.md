# Protocol Specification

Complete technical reference for the Model Context Protocol (MCP), including JSON-RPC 2.0 foundation, message formats, and all protocol primitives.

## Overview

The Model Context Protocol (MCP) is a stateful, JSON-RPC 2.0-based protocol that enables standardized communication between AI applications (hosts/clients) and external systems (servers). This specification defines the complete message format, protocol flows, and capabilities that make up MCP.

**Protocol Version:** `2025-06-18`
**Base Protocol:** JSON-RPC 2.0
**Official Specification:** [modelcontextprotocol.io/specification/latest](https://modelcontextprotocol.io/specification/latest)

---

## JSON-RPC 2.0 Foundation

MCP uses [JSON-RPC 2.0](https://www.jsonrpc.org/specification) as its base messaging protocol, leveraging its simple, transport-agnostic design.

### Message Types

#### Request

A request that expects a response from the receiver.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "optional": "parameters"
  }
}
```

**Required Fields:**
- `jsonrpc` (string): Must be `"2.0"`
- `id` (number | string): Unique identifier for correlating response
- `method` (string): Method to invoke

**Optional Fields:**
- `params` (object | array): Method parameters

#### Response

A response to a previous request.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": "success response"
  }
}
```

**Success Response:**
- `jsonrpc` (string): Must be `"2.0"`
- `id` (number | string): Same as request
- `result` (any): Method result

**Error Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {
      "details": "Additional error information"
    }
  }
}
```

- `jsonrpc` (string): Must be `"2.0"`
- `id` (number | string | null): Same as request
- `error` (object): Error object with:
  - `code` (number): Error code
  - `message` (string): Error message
  - `data` (any, optional): Additional error details

#### Notification

A message that does not expect a response.

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Required Fields:**
- `jsonrpc` (string): Must be `"2.0"`
- `method` (string): Notification method

**Optional Fields:**
- `params` (object | array): Notification parameters

**Note:** Notifications do NOT include an `id` field.

---

## Error Codes

MCP follows JSON-RPC 2.0 error codes with custom extensions for protocol-specific errors.

### Standard JSON-RPC Errors

| Code | Message | Description |
|------|---------|-------------|
| `-32700` | Parse error | Invalid JSON received |
| `-32600` | Invalid Request | Request object is invalid |
| `-32601` | Method not found | Method does not exist |
| `-32602` | Invalid params | Invalid method parameters |
| `-32603` | Internal error | Internal server error |

### MCP-Specific Errors

| Code | Message | Usage |
|------|---------|-------|
| `-32001` | Capability not supported | Requested capability not available |
| `-32002` | Resource not found | Requested resource does not exist |
| `-32003` | Tool not found | Requested tool does not exist |
| `-32004` | Prompt not found | Requested prompt does not exist |
| `-32005` | Invalid tool arguments | Tool arguments are invalid |
| `-32006` | Timeout | Operation timed out |
| `-32007` | Connection error | Transport layer error |

### Error Response Example

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32003,
    "message": "Tool not found",
    "data": {
      "toolName": "nonexistent_tool",
      "availableTools": ["weather_current", "database_query"]
    }
  }
}
```

---

## Protocol Versioning

MCP uses date-based versioning for protocol releases.

### Version Format

```
YYYY-MM-DD
```

**Example:** `2025-06-18`

### Version Negotiation

During initialization, client and server exchange protocol versions. Both must support the same protocol version for compatibility.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

**Version Mismatch Handling:**
- Client and server MUST agree on protocol version
- If versions don't match, return error:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Protocol version mismatch",
    "data": {
      "clientVersion": "2025-06-18",
      "serverVersion": "2024-12-01",
      "message": "Server requires protocol version 2024-12-01"
    }
  }
}
```

---

## Lifecycle Management

MCP is a stateful protocol requiring proper initialization and termination.

### 1. Initialization Sequence

#### Step 1: Client Sends Initialize

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {},
      "sampling": {},
      "experimental": {
        "tasks": {}
      }
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

**Parameters:**
- `protocolVersion` (string): Client's protocol version
- `capabilities` (object): Capabilities the client supports
- `clientInfo` (object): Client identification
  - `name` (string): Client name
  - `version` (string): Client version

#### Step 2: Server Responds with Capabilities

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
        "listChanged": false
      },
      "logging": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}
```

**Result:**
- `protocolVersion` (string): Server's protocol version
- `capabilities` (object): Capabilities the server supports
- `serverInfo` (object): Server identification
  - `name` (string): Server name
  - `version` (string): Server version

#### Step 3: Client Confirms Ready

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

**Purpose:** Client confirms it has processed initialization and is ready.

### 2. Active Session

During active session, client and server exchange requests, responses, and notifications based on negotiated capabilities.

### 3. Termination

Either side can close the connection:

**Graceful Shutdown:**
- Send pending responses
- Close transport cleanly
- Release resources

**Abrupt Disconnection:**
- Connection lost
- Process terminated
- Network failure

---

## Capability Negotiation

Capabilities define what features each party supports. They are exchanged during initialization.

### Client Capabilities

Capabilities that clients can offer to servers:

```json
{
  "capabilities": {
    "sampling": {},
    "elicitation": {},
    "experimental": {
      "tasks": {}
    }
  }
}
```

**Available Client Capabilities:**
- `sampling`: Client can provide LLM sampling
- `elicitation`: Client can request user input
- `experimental.tasks`: Client supports task primitives (experimental)

### Server Capabilities

Capabilities that servers can offer to clients:

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
    "logging": {}
  }
}
```

**Available Server Capabilities:**

| Capability | Sub-Capability | Description |
|------------|----------------|-------------|
| `tools` | `listChanged` | Supports tool list change notifications |
| `resources` | `subscribe` | Supports resource subscriptions |
| `resources` | `listChanged` | Supports resource list change notifications |
| `prompts` | `listChanged` | Supports prompt list change notifications |
| `logging` | - | Supports logging messages to client |

---

## Protocol Primitives

MCP defines several primitives that enable context exchange between clients and servers.

---

## 1. Tools

**Description:** Executable functions that AI applications can invoke to perform actions.

### Methods

#### tools/list

Discover available tools from the server.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "weather_current",
        "title": "Current Weather",
        "description": "Get current weather information for any location worldwide",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, address, or coordinates"
            },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial", "kelvin"],
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      },
      {
        "name": "database_query",
        "title": "Database Query",
        "description": "Execute SQL queries against the database",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "SQL query to execute"
            },
            "parameters": {
              "type": "array",
              "description": "Query parameters for prepared statements",
              "items": {
                "type": "string"
              }
            }
          },
          "required": ["query"]
        }
      }
    ]
  }
}
```

**Tool Schema:**
- `name` (string): Unique tool identifier
- `title` (string, optional): Human-readable title
- `description` (string): Tool description for AI understanding
- `inputSchema` (object): JSON Schema for tool arguments

#### tools/call

Execute a tool with provided arguments.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}
```

**Parameters:**
- `name` (string): Tool name to execute
- `arguments` (object): Tool arguments matching inputSchema

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy with light winds from the west at 8 mph. Humidity: 65%"
      }
    ],
    "isError": false
  }
}
```

**Result:**
- `content` (array): Array of content items
  - `type` (string): Content type (`text`, `image`, `resource`)
  - Type-specific fields (e.g., `text` for text content)
- `isError` (boolean, optional): Whether result represents an error

**Error Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Failed to fetch weather data: API rate limit exceeded"
      }
    ],
    "isError": true
  }
}
```

### Tool Notifications

#### notifications/tools/list_changed

Server notifies client that tool list has changed.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Client Response:**
Client should call `tools/list` to refresh tool list.

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/list"
}
```

---

## 2. Resources

**Description:** Data sources that provide contextual information to AI applications.

### Methods

#### resources/list

Discover available resources from the server.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "resources": [
      {
        "uri": "file:///project/schema.sql",
        "name": "Database Schema",
        "description": "Complete database schema with all tables and relationships",
        "mimeType": "text/plain"
      },
      {
        "uri": "db://localhost/users",
        "name": "Users Table",
        "description": "Current users in the database",
        "mimeType": "application/json"
      }
    ]
  }
}
```

**Resource Schema:**
- `uri` (string): Unique resource identifier (URI format)
- `name` (string): Human-readable name
- `description` (string): Resource description
- `mimeType` (string, optional): MIME type of resource content

#### resources/read

Retrieve content of a specific resource.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "resources/read",
  "params": {
    "uri": "file:///project/schema.sql"
  }
}
```

**Parameters:**
- `uri` (string): URI of resource to read

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {
    "contents": [
      {
        "uri": "file:///project/schema.sql",
        "mimeType": "text/plain",
        "text": "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  email VARCHAR(255) UNIQUE\n);\n\nCREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  title VARCHAR(255),\n  content TEXT\n);"
      }
    ]
  }
}
```

**Result:**
- `contents` (array): Array of content items
  - `uri` (string): Resource URI
  - `mimeType` (string): MIME type
  - Content data: `text`, `blob`, etc.

#### resources/subscribe

Subscribe to updates for a specific resource.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "resources/subscribe",
  "params": {
    "uri": "db://localhost/users"
  }
}
```

**Parameters:**
- `uri` (string): URI of resource to subscribe to

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {}
}
```

#### resources/unsubscribe

Unsubscribe from resource updates.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "resources/unsubscribe",
  "params": {
    "uri": "db://localhost/users"
  }
}
```

**Parameters:**
- `uri` (string): URI of resource to unsubscribe from

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "result": {}
}
```

### Resource Notifications

#### notifications/resources/list_changed

Server notifies client that resource list has changed.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}
```

#### notifications/resources/updated

Server notifies client that a subscribed resource has been updated.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "db://localhost/users"
  }
}
```

**Parameters:**
- `uri` (string): URI of updated resource

**Client Response:**
Client should call `resources/read` to get updated content.

---

## 3. Prompts

**Description:** Reusable templates that help structure interactions with language models.

### Methods

#### prompts/list

Discover available prompts from the server.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "prompts/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "result": {
    "prompts": [
      {
        "name": "sql_query_helper",
        "description": "Helps generate SQL queries with examples",
        "arguments": [
          {
            "name": "table_name",
            "description": "Name of the table to query",
            "required": true
          },
          {
            "name": "operation",
            "description": "Type of operation (SELECT, INSERT, UPDATE, DELETE)",
            "required": false
          }
        ]
      }
    ]
  }
}
```

**Prompt Schema:**
- `name` (string): Unique prompt identifier
- `description` (string): Prompt description
- `arguments` (array, optional): Prompt parameters
  - `name` (string): Argument name
  - `description` (string): Argument description
  - `required` (boolean): Whether argument is required

#### prompts/get

Retrieve a specific prompt with arguments.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "prompts/get",
  "params": {
    "name": "sql_query_helper",
    "arguments": {
      "table_name": "users",
      "operation": "SELECT"
    }
  }
}
```

**Parameters:**
- `name` (string): Prompt name
- `arguments` (object, optional): Prompt arguments

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "result": {
    "description": "SQL query helper for users table",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "You are an expert SQL developer. Help me write a SELECT query for the users table."
        }
      },
      {
        "role": "assistant",
        "content": {
          "type": "text",
          "text": "I'll help you write a SELECT query. Here are some examples:\n\n1. Select all users:\n   SELECT * FROM users;\n\n2. Select specific columns:\n   SELECT id, name, email FROM users;\n\n3. Filter by condition:\n   SELECT * FROM users WHERE email LIKE '%@example.com';\n\nWhat specific query would you like to write?"
        }
      }
    ]
  }
}
```

**Result:**
- `description` (string, optional): Prompt description
- `messages` (array): Array of message objects
  - `role` (string): Message role (`user`, `assistant`, `system`)
  - `content` (object): Message content
    - `type` (string): Content type
    - Type-specific fields

### Prompt Notifications

#### notifications/prompts/list_changed

Server notifies client that prompt list has changed.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}
```

---

## 4. Sampling

**Description:** Allows servers to request language model completions from the client.

**Direction:** Server → Client (client primitive)

### Methods

#### sampling/createMessage

Server requests LLM completion from client.

**Request (from server):**
```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Summarize the following data in one sentence: Users table has 1,523 records, Posts table has 8,742 records."
        }
      }
    ],
    "maxTokens": 100,
    "temperature": 0.7,
    "stopSequences": ["\n\n"],
    "metadata": {
      "requestId": "server-internal-123"
    }
  }
}
```

**Parameters:**
- `messages` (array): Conversation messages
  - `role` (string): Message role
  - `content` (object): Message content
- `maxTokens` (number, optional): Maximum tokens to generate
- `temperature` (number, optional): Sampling temperature
- `stopSequences` (array, optional): Sequences that stop generation
- `metadata` (object, optional): Additional metadata

**Response (from client):**
```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "result": {
    "role": "assistant",
    "content": {
      "type": "text",
      "text": "The database contains 1,523 users who have created a total of 8,742 posts."
    },
    "model": "claude-sonnet-4-5",
    "stopReason": "end_turn"
  }
}
```

**Result:**
- `role` (string): Response role (typically `assistant`)
- `content` (object): Generated content
- `model` (string): Model used for generation
- `stopReason` (string): Why generation stopped (`end_turn`, `stop_sequence`, `max_tokens`)

---

## 5. Elicitation

**Description:** Allows servers to request additional information from users.

**Direction:** Server → Client (client primitive)

### Methods

#### elicitation/createMessage

Server requests user input through client.

**Request (from server):**
```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "method": "elicitation/createMessage",
  "params": {
    "messages": [
      {
        "role": "assistant",
        "content": {
          "type": "text",
          "text": "I'm about to delete 500 records from the users table. Do you want to proceed? (yes/no)"
        }
      }
    ],
    "metadata": {
      "operationType": "destructive_delete",
      "recordCount": 500
    }
  }
}
```

**Parameters:**
- `messages` (array): Messages to present to user
- `metadata` (object, optional): Additional context

**Response (from client):**
```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "result": {
    "role": "user",
    "content": {
      "type": "text",
      "text": "yes"
    }
  }
}
```

**Result:**
- `role` (string): Response role (`user`)
- `content` (object): User's response

---

## 6. Logging

**Description:** Enables servers to send log messages to clients for debugging and monitoring.

**Direction:** Server → Client (client primitive)

### Methods

#### logging/setLevel

Client sets minimum log level for server.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 13,
  "method": "logging/setLevel",
  "params": {
    "level": "debug"
  }
}
```

**Parameters:**
- `level` (string): Minimum log level (`debug`, `info`, `warning`, `error`)

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 13,
  "result": {}
}
```

### Notifications

#### notifications/message

Server sends log message to client.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/message",
  "params": {
    "level": "info",
    "logger": "database-server",
    "data": {
      "message": "Successfully connected to database",
      "connectionId": "conn-123",
      "timestamp": "2026-02-01T12:34:56Z"
    }
  }
}
```

**Parameters:**
- `level` (string): Log level
- `logger` (string, optional): Logger name
- `data` (any): Log data

**Log Levels:**
- `debug`: Detailed debugging information
- `info`: General informational messages
- `warning`: Warning messages
- `error`: Error messages

---

## 7. Tasks (Experimental)

**Description:** Durable execution wrappers for long-running operations.

**Status:** Experimental feature

### Capabilities

Must be declared during initialization:

```json
{
  "capabilities": {
    "experimental": {
      "tasks": {}
    }
  }
}
```

### Methods

#### tasks/create

Create a new task for long-running operation.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 14,
  "method": "tasks/create",
  "params": {
    "name": "batch_process_users",
    "description": "Process user records in batches",
    "parameters": {
      "batchSize": 100,
      "totalRecords": 10000
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 14,
  "result": {
    "taskId": "task-abc123",
    "status": "pending",
    "createdAt": "2026-02-01T12:00:00Z"
  }
}
```

#### tasks/get

Get status of a task.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "method": "tasks/get",
  "params": {
    "taskId": "task-abc123"
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "result": {
    "taskId": "task-abc123",
    "status": "running",
    "progress": 0.45,
    "currentStep": "Processing batch 45 of 100",
    "createdAt": "2026-02-01T12:00:00Z",
    "startedAt": "2026-02-01T12:00:05Z"
  }
}
```

**Task Status Values:**
- `pending`: Task created but not started
- `running`: Task is executing
- `completed`: Task finished successfully
- `failed`: Task failed with error
- `cancelled`: Task was cancelled

#### tasks/cancel

Cancel a running task.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 16,
  "method": "tasks/cancel",
  "params": {
    "taskId": "task-abc123"
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 16,
  "result": {
    "taskId": "task-abc123",
    "status": "cancelled",
    "cancelledAt": "2026-02-01T12:15:30Z"
  }
}
```

### Task Notifications

#### notifications/tasks/progress

Server notifies client of task progress.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tasks/progress",
  "params": {
    "taskId": "task-abc123",
    "progress": 0.65,
    "currentStep": "Processing batch 65 of 100"
  }
}
```

#### notifications/tasks/completed

Server notifies client of task completion.

**Notification:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tasks/completed",
  "params": {
    "taskId": "task-abc123",
    "status": "completed",
    "result": {
      "processedRecords": 10000,
      "duration": "00:15:30"
    },
    "completedAt": "2026-02-01T12:15:30Z"
  }
}
```

---

## Message Patterns

### Request/Response Pattern

Standard request-response for methods that return results.

**Flow:**
1. Client sends request with `id`
2. Server processes request
3. Server sends response with same `id`

```
Client                           Server
  |                                |
  |  Request (id: 1)              |
  |------------------------------->|
  |                                |
  |                   (processing) |
  |                                |
  |             Response (id: 1)   |
  |<-------------------------------|
  |                                |
```

### Notification Pattern

One-way messages that don't expect responses.

**Flow:**
1. Sender sends notification (no `id`)
2. Receiver processes notification
3. No response sent

```
Sender                         Receiver
  |                                |
  |  Notification (no id)          |
  |------------------------------->|
  |                                |
  |                   (processing) |
  |                                |
```

### Subscribe/Update Pattern

Client subscribes to updates, receives notifications on changes.

**Flow:**
1. Client subscribes to resource
2. Server acknowledges subscription
3. Server sends notifications when resource changes
4. Client reads updated resource

```
Client                           Server
  |                                |
  |  resources/subscribe           |
  |------------------------------->|
  |             Response           |
  |<-------------------------------|
  |                                |
  |        (resource changes)      |
  |                                |
  |  notifications/resources/      |
  |       updated                  |
  |<-------------------------------|
  |                                |
  |  resources/read                |
  |------------------------------->|
  |             Response           |
  |<-------------------------------|
```

---

## Complete Protocol Example

### Weather Information Flow

#### 1. Initialization

**Client:**
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
      "name": "weather-client",
      "version": "1.0.0"
    }
  }
}
```

**Server:**
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
        "subscribe": false,
        "listChanged": false
      },
      "logging": {}
    },
    "serverInfo": {
      "name": "weather-server",
      "version": "2.1.0"
    }
  }
}
```

**Client:**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

#### 2. Tool Discovery

**Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "weather_current",
        "title": "Current Weather",
        "description": "Get current weather information for any location",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, address, or coordinates"
            },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial"],
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      },
      {
        "name": "weather_forecast",
        "title": "Weather Forecast",
        "description": "Get weather forecast for the next 7 days",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            },
            "days": {
              "type": "number",
              "minimum": 1,
              "maximum": 7,
              "default": 5
            }
          },
          "required": ["location"]
        }
      }
    ]
  }
}
```

#### 3. Resource Discovery

**Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/list"
}
```

**Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resources": [
      {
        "uri": "weather://api/locations",
        "name": "Supported Locations",
        "description": "List of all supported location formats and examples",
        "mimeType": "text/plain"
      }
    ]
  }
}
```

#### 4. Tool Execution

**Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco, CA",
      "units": "imperial"
    }
  }
}
```

**Server (logs during execution):**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/message",
  "params": {
    "level": "info",
    "logger": "weather-server",
    "data": {
      "message": "Fetching weather data",
      "location": "San Francisco, CA",
      "timestamp": "2026-02-01T12:34:56Z"
    }
  }
}
```

**Server (response):**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco, CA:\n- Temperature: 62°F\n- Conditions: Partly cloudy\n- Wind: W at 12 mph\n- Humidity: 68%\n- Pressure: 30.12 in\n- Visibility: 10 mi"
      }
    ],
    "isError": false
  }
}
```

#### 5. Dynamic Tool Update

**Server (notification):**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

**Client (refreshes):**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/list"
}
```

---

## Transport Layer

MCP defines the protocol but supports multiple transport mechanisms.

### Stdio Transport

**Characteristics:**
- Uses standard input/output streams
- Direct process communication
- Local processes only
- No network overhead

**Message Framing:**
Messages are newline-delimited JSON:

```
{"jsonrpc":"2.0","id":1,"method":"initialize",...}\n
{"jsonrpc":"2.0","id":1,"result":{...}}\n
{"jsonrpc":"2.0","method":"notifications/initialized"}\n
```

### HTTP Transport

**Characteristics:**
- Uses HTTP POST for client-to-server
- Optional Server-Sent Events for server-to-client
- Supports remote servers
- Standard HTTP authentication

**Client-to-Server:**
```http
POST /mcp HTTP/1.1
Host: server.example.com
Content-Type: application/json
Authorization: Bearer token123

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

**Server-to-Client (SSE):**
```http
GET /mcp/events HTTP/1.1
Host: server.example.com
Accept: text/event-stream
Authorization: Bearer token123

---

HTTP/1.1 200 OK
Content-Type: text/event-stream

event: notification
data: {"jsonrpc":"2.0","method":"notifications/tools/list_changed"}

event: notification
data: {"jsonrpc":"2.0","method":"notifications/message","params":{...}}
```

---

## Security Considerations

### Authentication

- **Stdio:** Process-level isolation
- **HTTP:** Bearer tokens, API keys, OAuth

### Authorization

- Servers should validate permissions for operations
- Clients should validate server capabilities match expectations

### Data Validation

- Always validate inputs against schemas
- Sanitize data before execution
- Implement rate limiting for tool calls

### Error Handling

- Never expose sensitive information in errors
- Log security-relevant events
- Implement proper timeout handling

---

## Best Practices

### Protocol Implementation

1. **Always negotiate capabilities** during initialization
2. **Validate protocol versions** before proceeding
3. **Handle notifications** even if not immediately processing
4. **Implement proper error handling** for all methods
5. **Use appropriate log levels** for debugging

### Performance

1. **Batch operations** when possible
2. **Use subscriptions** instead of polling
3. **Implement caching** for frequently accessed resources
4. **Set reasonable timeouts** for operations
5. **Clean up resources** on connection close

### Reliability

1. **Handle connection failures** gracefully
2. **Implement retry logic** with exponential backoff
3. **Validate all inputs** before processing
4. **Provide meaningful error messages**
5. **Log important operations** for debugging

---

## References

- **Official Specification:** [modelcontextprotocol.io/specification/latest](https://modelcontextprotocol.io/specification/latest)
- **JSON-RPC 2.0:** [jsonrpc.org/specification](https://www.jsonrpc.org/specification)
- **MCP Documentation:** [modelcontextprotocol.io/docs](https://modelcontextprotocol.io/docs)
- **GitHub Repository:** [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)

---

**Last Updated:** February 2026
**Protocol Version:** 2025-06-18
**Status:** Official Specification
