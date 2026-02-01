# Model Context Protocol (MCP) - Introduction

## Overview

**Model Context Protocol (MCP)** is an open-source standard for connecting AI applications to external systems. It provides a standardized way for AI applications like Claude or ChatGPT to connect to data sources, tools, and workflows.

**Official Documentation:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
**Specification:** [MCP Specification](https://modelcontextprotocol.io/specification/latest)

---

## The USB-C Analogy

Think of MCP like a **USB-C port for AI applications**. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

**Before MCP:** Each AI application needed custom integrations for every data source or tool.

**With MCP:** AI applications and external systems communicate through a standardized protocol, enabling plug-and-play connectivity.

---

## What Can MCP Enable?

### Real-World Use Cases

1. **Personal AI Assistant**
   - Agents can access your Google Calendar and Notion
   - Acting as a more personalized AI assistant

2. **Development Tools**
   - Claude Code can generate entire web apps using Figma designs
   - Access to file systems, databases, and development tools

3. **Enterprise Solutions**
   - Chatbots can connect to multiple databases across an organization
   - Empowering users to analyze data using chat

4. **Creative Applications**
   - AI models can create 3D designs on Blender
   - Print them out using a 3D printer

---

## Why MCP Matters

### Benefits by Stakeholder

#### For Developers
- **Reduced development time** when building or integrating with AI applications
- **Reduced complexity** through standardized interfaces
- **Reusable components** that work across different AI applications

#### For AI Applications & Agents
- **Access to ecosystem** of data sources, tools, and apps
- **Enhanced capabilities** through external integrations
- **Improved end-user experience** with richer functionality

#### For End-Users
- **More capable AI** applications and agents
- **Data access** - AI can access your data when needed
- **Action taking** - AI can take actions on your behalf

---

## MCP Architecture

### Participants

MCP follows a **client-server architecture** with three key participants:

#### 1. MCP Host
The AI application that coordinates and manages one or multiple MCP clients.

**Examples:**
- Claude Code
- Claude Desktop
- Visual Studio Code with MCP extension
- Custom AI applications

#### 2. MCP Client
A component that maintains a connection to an MCP server and obtains context from it for the MCP host to use.

**Characteristics:**
- One client per server connection
- Dedicated connection to its corresponding server
- Managed by the MCP host

#### 3. MCP Server
A program that provides context to MCP clients.

**Types:**
- **Local servers**: Run on the same machine (e.g., filesystem server)
- **Remote servers**: Run on remote platforms (e.g., Sentry MCP server)

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│       MCP Host (AI Application)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Client 1 │ │ Client 2 │ │ Client 3 ││
│  └────┬─────┘ └────┬─────┘ └────┬─────┘│
└───────┼────────────┼────────────┼───────┘
        │            │            │
        ▼            ▼            ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │Server A│   │Server B│   │Server C│
   │ Local  │   │ Local  │   │ Remote │
   └────────┘   └────────┘   └────────┘
```

**Example:**
- Visual Studio Code acts as MCP host
- Connects to Sentry MCP server → creates MCP Client 1
- Connects to filesystem server → creates MCP Client 2
- Each client maintains dedicated connection to its server

---

## MCP Layers

MCP consists of two layers:

### 1. Data Layer (Inner Layer)

Defines the JSON-RPC based protocol for client-server communication.

**Includes:**
- **Lifecycle management**: Connection initialization, capability negotiation, termination
- **Server features**: Tools, resources, prompts
- **Client features**: Sampling, elicitation, logging
- **Utility features**: Notifications, progress tracking

**Protocol:** JSON-RPC 2.0

### 2. Transport Layer (Outer Layer)

Manages communication channels and authentication.

**Includes:**
- Connection establishment
- Message framing
- Secure communication
- Authentication

**Supported Transports:**

#### Stdio Transport
- Uses standard input/output streams
- Direct process communication
- Local processes on same machine
- Optimal performance, no network overhead

#### Streamable HTTP Transport
- Uses HTTP POST for client-to-server messages
- Optional Server-Sent Events for streaming
- Enables remote server communication
- Supports standard HTTP authentication (bearer tokens, API keys, OAuth)

---

## Core Concepts: Primitives

MCP primitives define what clients and servers can offer each other. They specify the types of contextual information that can be shared and the range of actions that can be performed.

### Server Primitives

What **MCP servers** can expose to clients:

#### 1. Tools
**Executable functions** that AI applications can invoke to perform actions.

**Examples:**
- File operations (read, write, delete)
- API calls (REST, GraphQL)
- Database queries (SQL, NoSQL)
- System commands

**Methods:**
- `tools/list` - Discover available tools
- `tools/call` - Execute a tool

**Use Case:**
A database MCP server exposes tools for querying, inserting, updating, and deleting records.

#### 2. Resources
**Data sources** that provide contextual information to AI applications.

**Examples:**
- File contents
- Database records
- API responses
- Configuration data

**Methods:**
- `resources/list` - Discover available resources
- `resources/read` - Retrieve resource content

**Use Case:**
A database MCP server provides a resource containing the database schema, allowing the AI to understand table structures before generating queries.

#### 3. Prompts
**Reusable templates** that help structure interactions with language models.

**Examples:**
- System prompts
- Few-shot examples
- Interaction templates
- Query patterns

**Methods:**
- `prompts/list` - Discover available prompts
- `prompts/get` - Retrieve prompt content

**Use Case:**
A database MCP server includes a prompt with few-shot examples showing how to use the query tools effectively.

### Client Primitives

What **MCP clients** can expose to servers:

#### 1. Sampling
Allows servers to request language model completions from the client's AI application.

**Purpose:**
- Server authors want access to a language model
- Stay model-independent
- Don't include language model SDK in MCP server

**Method:**
- `sampling/complete` - Request LLM completion from client

**Use Case:**
An MCP server needs to generate natural language responses but doesn't want to depend on a specific LLM provider.

#### 2. Elicitation
Allows servers to request additional information from users.

**Purpose:**
- Get more information from the user
- Ask for confirmation of an action
- Gather required parameters interactively

**Method:**
- `elicitation/request` - Request user input

**Use Case:**
Before executing a destructive database operation, the server requests user confirmation through the client.

#### 3. Logging
Enables servers to send log messages to clients for debugging and monitoring.

**Purpose:**
- Debugging server operations
- Monitoring server health
- Tracking execution flow

**Methods:**
- Various log levels (debug, info, warn, error)

**Use Case:**
A server logs detailed execution information to help developers debug integration issues.

### Utility Primitives

Cross-cutting features that augment how requests are executed:

#### Tasks (Experimental)
Durable execution wrappers for long-running operations.

**Capabilities:**
- Deferred result retrieval
- Status tracking
- Progress monitoring

**Use Cases:**
- Expensive computations
- Workflow automation
- Batch processing
- Multi-step operations

---

## Lifecycle Management

MCP is a **stateful protocol** that requires proper lifecycle management.

### Initialization Sequence

```json
// 1. Client sends initialize request
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
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}

// 2. Server responds with its capabilities
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}

// 3. Client confirms ready
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

### Purpose of Initialization

1. **Protocol Version Negotiation**
   - Ensures compatible protocol versions
   - Prevents communication errors
   - Allows graceful version mismatches

2. **Capability Discovery**
   - Declares supported features
   - Specifies available primitives
   - Enables efficient communication

3. **Identity Exchange**
   - Provides identification
   - Versioning information
   - Debugging support

---

## Notifications

MCP supports **real-time notifications** to enable dynamic updates.

### Characteristics

- **No response required**: JSON-RPC 2.0 notification (no `id` field)
- **Event-driven**: Server decides when to send
- **Capability-based**: Must be declared during initialization

### Example: Tool List Changed

```json
// Server notifies client of tool changes
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}

// Client requests updated tool list
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/list"
}
```

### Benefits

1. **Dynamic Environments**: Tools/resources can change based on state
2. **Efficiency**: No polling needed
3. **Consistency**: Always accurate information
4. **Real-time Collaboration**: Responsive to changing contexts

---

## Complete Example: Weather Tool

### Step 1: Tool Discovery

```json
// Client requests available tools
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// Server responds with tool metadata
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "weather_current",
        "title": "Weather Information",
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
      }
    ]
  }
}
```

### Step 2: Tool Execution

```json
// Client executes the tool
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

// Server responds with result
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy with light winds from the west at 8 mph. Humidity: 65%"
      }
    ]
  }
}
```

---

## MCP in AI Applications

### How AI Applications Use MCP

1. **Initialization Phase**
   - Establish connections to configured MCP servers
   - Negotiate capabilities
   - Store server metadata

2. **Discovery Phase**
   - Fetch available tools, resources, prompts
   - Combine into unified registry
   - Make available to language model

3. **Execution Phase**
   - LLM decides to use a tool
   - Application routes to appropriate MCP server
   - Executes and returns results
   - Continues conversation with LLM

4. **Update Phase**
   - Receive notifications about changes
   - Refresh tool/resource registries
   - Update LLM capabilities dynamically

### Pseudo-code Example

```python
# Initialization
async with stdio_client(server_config) as (read, write):
    async with ClientSession(read, write) as session:
        init_response = await session.initialize()
        app.register_mcp_server(session)

# Discovery
available_tools = []
for session in app.mcp_server_sessions():
    tools_response = await session.list_tools()
    available_tools.extend(tools_response.tools)
conversation.register_available_tools(available_tools)

# Execution
async def handle_tool_call(tool_name, arguments):
    session = app.find_mcp_session_for_tool(tool_name)
    result = await session.call_tool(tool_name, arguments)
    conversation.add_tool_result(result.content)

# Updates
async def handle_tools_changed_notification(session):
    tools_response = await session.list_tools()
    app.update_available_tools(session, tools_response.tools)
    conversation.notify_llm_of_new_capabilities()
```

---

## MCP Scope

The Model Context Protocol project includes:

### 1. MCP Specification
Outlines implementation requirements for clients and servers.

**URL:** [modelcontextprotocol.io/specification/latest](https://modelcontextprotocol.io/specification/latest)

### 2. MCP SDKs
Language-specific implementations of MCP.

**Available SDKs:**
- TypeScript/JavaScript
- Python
- More languages in development

**Documentation:** [modelcontextprotocol.io/docs/sdk](https://modelcontextprotocol.io/docs/sdk)

### 3. MCP Development Tools
Tools for developing MCP servers and clients.

**Key Tool:**
- **MCP Inspector**: Debug and test MCP servers
- **Repository:** [github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)

### 4. Reference Server Implementations
Example implementations of MCP servers.

**Repository:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

**Examples:**
- Filesystem server (local file access)
- Database servers (PostgreSQL, SQLite)
- API integrations (GitHub, Sentry, etc.)

---

## Important Notes

### What MCP Does

✅ Defines protocol for context exchange between AI apps and external systems
✅ Provides standardized way to expose tools, resources, and prompts
✅ Enables discovery and execution of capabilities
✅ Supports real-time updates and notifications

### What MCP Doesn't Do

❌ Does NOT dictate how AI applications use LLMs
❌ Does NOT manage the provided context
❌ Does NOT specify which LLM to use
❌ Does NOT handle LLM inference

**Focus:** MCP is solely about the protocol for context exchange, not about how that context is used by the AI application.

---

## Getting Started

### For Developers

#### Build MCP Servers
Create MCP servers to expose your data and tools.

**Start:** [modelcontextprotocol.io/docs/develop/build-server](https://modelcontextprotocol.io/docs/develop/build-server)

#### Build MCP Clients
Develop applications that connect to MCP servers.

**Start:** [modelcontextprotocol.io/docs/develop/build-client](https://modelcontextprotocol.io/docs/develop/build-client)

### Learn More

#### Understand Concepts
Learn core concepts and architecture of MCP.

**Documentation:** [modelcontextprotocol.io/docs/learn/architecture](https://modelcontextprotocol.io/docs/learn/architecture)

---

## Resources

- **Official Website:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Documentation:** [modelcontextprotocol.io/docs](https://modelcontextprotocol.io/docs)
- **Specification:** [modelcontextprotocol.io/specification/latest](https://modelcontextprotocol.io/specification/latest)
- **GitHub Organization:** [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- **MCP Inspector:** [github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)
- **Reference Servers:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

---

**Last Updated:** January 2026
**Status:** Open Source Standard
**Maintained by:** Anthropic & Community
