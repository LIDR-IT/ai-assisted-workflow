# MCP Glossary

Comprehensive terminology reference for the Model Context Protocol (MCP) ecosystem.

## A

### Annotation
Metadata attached to tool definitions that provides additional context to LLMs about usage, requirements, or behavior. Annotations can include examples, constraints, or semantic information.

**See also:** [Tool](#tool), [Schema](#schema)

### API Key
Authentication credential used to access MCP servers or external services. Stored in environment variables for security.

**See also:** [Authentication](#authentication), [Environment Variable](#environment-variable)

### Argument (Args)
Command-line arguments passed to an MCP server's startup command. Typically specified in platform configuration files.

**Example:** `["--port", "3000"]` or `["-y", "@modelcontextprotocol/server-name"]`

**See also:** [Command](#command), [Configuration](#configuration)

### Authentication
Process of verifying identity and access rights for MCP connections. Methods include API keys, OAuth tokens, or custom auth schemes.

**See also:** [API Key](#api-key), [Environment Variable](#environment-variable), [Security](#security)

## B

### Batch Operation
Executing multiple MCP operations (reads, writes, tool calls) in a single request to improve performance and maintain consistency.

**See also:** [Tool](#tool), [Transaction](#transaction)

### Bidirectional Communication
Two-way message exchange capability in MCP where both clients and servers can initiate requests. Enables notifications and subscriptions.

**See also:** [JSON-RPC](#json-rpc), [Protocol](#protocol), [Transport](#transport)

## C

### Capabilities
Features and functionality that an MCP server declares support for during initialization. Includes supported primitives (tools, resources, prompts) and optional features.

**See also:** [Initialization](#initialization), [Primitive](#primitive)

### Client
Application that connects to and consumes MCP servers. Examples include Claude Desktop, Claude Code, Cursor, and custom integrations.

**See also:** [Host](#host), [Server](#server)

### Command
Executable program or script that starts an MCP server. Specified in configuration along with arguments.

**Examples:** `"node"`, `"npx"`, `"python"`, custom shell script paths

**See also:** [Argument](#argument), [Configuration](#configuration)

### Configuration
Platform-specific JSON files that define MCP server connections, including command, arguments, environment variables, and capabilities.

**File examples:**
- Cursor: `.cursor/mcp.json`
- Claude Code: `.claude/mcp.json`
- Gemini CLI: `.gemini/settings.json`

**See also:** [Platform](#platform), [Server Registration](#server-registration)

### Connection
Active communication channel between an MCP client and server established via a specific transport mechanism.

**See also:** [Transport](#transport), [Session](#session)

### Context
Information provided to language models to enhance understanding and response quality. MCP servers extend context through tools, resources, and prompts.

**See also:** [Resource](#resource), [Tool](#tool), [Prompt](#prompt)

### Cross-Platform
Capability to run MCP servers across multiple operating systems (macOS, Linux, Windows) and platforms (Claude, Cursor, Gemini).

**See also:** [Platform](#platform), [Transport](#transport)

## D

### Discovery
Process by which MCP clients locate and enumerate available servers, their capabilities, and exposed functionality.

**See also:** [Capabilities](#capabilities), [Initialization](#initialization)

### Dynamic Discovery
Runtime detection and registration of MCP servers without manual configuration. Experimental feature in some platforms.

**See also:** [Server Registration](#server-registration), [Static Configuration](#static-configuration)

## E

### Environment Variable
System-level variable used to pass configuration (API keys, paths, settings) to MCP servers securely.

**Format:** `"${VARIABLE_NAME}"` in configuration files
**Example:** `"API_KEY": "${CONTEXT7_API_KEY}"`

**See also:** [Authentication](#authentication), [Configuration](#configuration), [Security](#security)

### Error Handling
Mechanisms for detecting, reporting, and recovering from failures in MCP operations. Uses JSON-RPC error codes and messages.

**See also:** [JSON-RPC](#json-rpc), [Protocol](#protocol)

### Event
Asynchronous notification sent by MCP servers to clients about state changes or updates. Part of bidirectional communication.

**See also:** [Bidirectional Communication](#bidirectional-communication), [Notification](#notification)

## H

### Host
Platform or application that integrates and manages MCP clients. Examples include Claude Desktop, VS Code with extensions, or custom applications.

**See also:** [Client](#client), [Platform](#platform)

### HTTP Transport
Transport mechanism using HTTP/HTTPS protocol for MCP communication. Supports both request/response and streaming (SSE).

**See also:** [Transport](#transport), [SSE Transport](#sse-transport)

## I

### Initialization
Handshake process when an MCP client connects to a server. Exchanges protocol versions, capabilities, and configuration.

**See also:** [Capabilities](#capabilities), [Protocol Version](#protocol-version)

### Integration
Connecting MCP servers to host applications or platforms. Requires platform-specific configuration and setup.

**See also:** [Host](#host), [Platform](#platform), [Configuration](#configuration)

## J

### JSON
JavaScript Object Notation - data format used for MCP configuration files and protocol messages.

**See also:** [JSON-RPC](#json-rpc), [Configuration](#configuration)

### JSON-RPC
Remote Procedure Call protocol using JSON. Foundation of MCP communication between clients and servers.

**Version:** MCP uses JSON-RPC 2.0
**Key concepts:** Request, response, notification, batch requests

**See also:** [Protocol](#protocol), [Transport](#transport)

### JSON Schema
Standard for defining the structure and validation rules of JSON data. Used extensively in MCP for tool parameters and resource schemas.

**See also:** [Schema](#schema), [Tool](#tool), [Validation](#validation)

## L

### Lifecycle
Stages of an MCP server's operation: startup, initialization, active operation, shutdown. Managed by the host platform.

**See also:** [Initialization](#initialization), [Session](#session)

### LLM (Large Language Model)
AI model that consumes MCP-provided context and tools to perform tasks. Examples include Claude, GPT, Gemini.

**See also:** [Context](#context), [Tool](#tool)

## M

### MCP (Model Context Protocol)
Open standard protocol enabling seamless integration between LLM applications and external data sources/tools.

**Key features:** Bidirectional communication, standardized primitives, flexible transport

**See also:** [Protocol](#protocol), [Primitive](#primitive)

### Message
Unit of communication in MCP. Can be request, response, notification, or error. Formatted according to JSON-RPC 2.0.

**See also:** [JSON-RPC](#json-rpc), [Protocol](#protocol)

### Method
JSON-RPC procedure name identifying the operation being invoked. Examples include `tools/call`, `resources/read`, `prompts/get`.

**See also:** [JSON-RPC](#json-rpc), [Primitive](#primitive)

## N

### Notification
One-way message in JSON-RPC that does not expect a response. Used for events and status updates.

**See also:** [Event](#event), [JSON-RPC](#json-rpc)

### NPM (Node Package Manager)
Package manager for Node.js. Many MCP servers distributed as npm packages.

**See also:** [NPX](#npx), [Package](#package)

### NPX
Tool for executing npm packages without global installation. Commonly used to run MCP servers.

**Example:** `"command": "npx", "args": ["-y", "@modelcontextprotocol/server-name"]`

**See also:** [NPM](#npm), [Command](#command)

## P

### Package
Distributable unit containing an MCP server implementation. Can be npm packages, Python packages, or standalone executables.

**See also:** [NPM](#npm), [NPX](#npx)

### Parameter
Input value required or accepted by a tool or method. Defined using JSON Schema.

**See also:** [Tool](#tool), [Schema](#schema), [Validation](#validation)

### Platform
Host environment or application that supports MCP integration. Each platform may have specific configuration requirements.

**Examples:**
- Claude Desktop
- Claude Code (CLI)
- Cursor
- Gemini CLI
- Antigravity
- Cline
- Zed

**See also:** [Host](#host), [Integration](#integration)

### Primitive
Core building block of MCP functionality. Three main types: Tools, Resources, and Prompts.

**See also:** [Tool](#tool), [Resource](#resource), [Prompt](#prompt)

### Project-Level Configuration
MCP configuration specific to a project or workspace, stored in project directories. Supported by most platforms except Antigravity.

**See also:** [Configuration](#configuration), [User-Level Configuration](#user-level-configuration)

### Prompt
Reusable prompt template exposed by MCP servers. Enables consistent prompt patterns across interactions.

**See also:** [Primitive](#primitive), [Template](#template)

### Protocol
Set of rules and message formats governing MCP communication. Based on JSON-RPC 2.0.

**See also:** [JSON-RPC](#json-rpc), [MCP](#mcp-model-context-protocol)

### Protocol Version
Version identifier for MCP protocol compatibility. Current version: 2024-11-05.

**See also:** [Initialization](#initialization), [Protocol](#protocol)

## R

### Registry
Centralized location for discovering available MCP servers. Official registry maintained by Anthropic, with community alternatives like MCP Hub.

**URLs:**
- Official: https://github.com/modelcontextprotocol/servers
- Community: https://mcphub.io

**See also:** [Server](#server), [Discovery](#discovery)

### Request
JSON-RPC message that expects a response. Contains method name, parameters, and request ID.

**See also:** [JSON-RPC](#json-rpc), [Response](#response)

### Resource
Data or content exposed by MCP servers that LLMs can access. Examples include files, database records, or API responses.

**See also:** [Primitive](#primitive), [URI](#uri)

### Response
JSON-RPC message sent in reply to a request. Contains result or error information.

**See also:** [Request](#request), [JSON-RPC](#json-rpc)

## S

### Schema
JSON Schema definition describing data structure and validation rules. Used for tool parameters and resource formats.

**See also:** [JSON Schema](#json-schema), [Validation](#validation)

### SDK (Software Development Kit)
Library providing tools and utilities for building MCP servers or clients in a specific programming language.

**Available SDKs:**
- TypeScript: `@modelcontextprotocol/sdk`
- Python: `mcp`
- Kotlin (experimental)

**See also:** [Server Development](#server-development)

### Security
Practices and mechanisms for protecting MCP communications and credentials. Includes authentication, secret management, and transport security.

**See also:** [Authentication](#authentication), [Environment Variable](#environment-variable)

### Server
Application or service that implements MCP protocol to expose tools, resources, or prompts to clients.

**Examples:** Context7, Filesystem, PostgreSQL, GitHub, Weather services

**See also:** [Client](#client), [Host](#host)

### Server Development
Process of creating custom MCP servers using SDKs or by implementing the protocol specification.

**See also:** [SDK](#sdk-software-development-kit), [Protocol](#protocol)

### Server Registration
Process of adding an MCP server to a platform's configuration, making it available for use.

**See also:** [Configuration](#configuration), [Static Configuration](#static-configuration)

### Session
Active period of interaction between an MCP client and server, from initialization to disconnection.

**See also:** [Connection](#connection), [Lifecycle](#lifecycle)

### SSE (Server-Sent Events)
HTTP-based protocol for streaming server-to-client messages. Used as an MCP transport for web-based clients.

**See also:** [Transport](#transport), [HTTP Transport](#http-transport)

### SSE Transport
MCP transport implementation using Server-Sent Events for server-to-client streaming and HTTP POST for client-to-server messages.

**See also:** [SSE](#sse-server-sent-events), [Transport](#transport)

### Static Configuration
Predefined MCP server connections specified in configuration files. Most common registration method.

**See also:** [Configuration](#configuration), [Dynamic Discovery](#dynamic-discovery)

### STDIO (Standard Input/Output)
Transport mechanism using standard input and output streams for MCP communication. Most common for local server processes.

**See also:** [Transport](#transport)

### STDIO Transport
MCP transport implementation using stdin for receiving messages and stdout for sending messages.

**See also:** [STDIO](#stdio-standard-inputoutput), [Transport](#transport)

### Streaming
Sending data incrementally rather than all at once. Supported by some MCP transports (SSE, WebSocket) for real-time updates.

**See also:** [SSE Transport](#sse-transport), [WebSocket Transport](#websocket-transport)

### Synchronization
Process of ensuring MCP configurations and resources remain consistent across platforms and projects.

**See also:** [Configuration](#configuration)

## T

### Template
Reusable pattern for prompts or messages. MCP servers can expose prompt templates with variable substitution.

**See also:** [Prompt](#prompt), [Variable](#variable)

### Tool
Executable function exposed by MCP servers that LLMs can invoke to perform actions or retrieve information.

**Examples:** Search, file operations, API calls, calculations

**See also:** [Primitive](#primitive), [Schema](#schema)

### Transaction
Atomic operation ensuring all steps complete successfully or roll back entirely. Important for multi-step tool executions.

**See also:** [Batch Operation](#batch-operation), [Tool](#tool)

### Transport
Communication mechanism for exchanging MCP messages between clients and servers.

**Types:**
- STDIO (Standard Input/Output)
- SSE (Server-Sent Events)
- HTTP (Request/Response)
- WebSocket (Bidirectional streaming)

**See also:** [STDIO Transport](#stdio-transport), [SSE Transport](#sse-transport), [HTTP Transport](#http-transport), [WebSocket Transport](#websocket-transport)

### Type
Data type specification in JSON Schema. Common types include string, number, boolean, object, array, null.

**See also:** [Schema](#schema), [Validation](#validation)

## U

### URI (Uniform Resource Identifier)
Unique identifier for resources exposed by MCP servers. Format varies by server implementation.

**Examples:**
- `file:///path/to/file.txt`
- `db://database/table/record`
- `api://service/endpoint`

**See also:** [Resource](#resource)

### User-Level Configuration
MCP configuration stored in user home directory, applying to all projects. Required for Antigravity, optional for other platforms.

**See also:** [Configuration](#configuration), [Project-Level Configuration](#project-level-configuration)

## V

### Validation
Process of verifying that data conforms to a defined schema. Essential for ensuring tool parameters are correct before execution.

**See also:** [Schema](#schema), [JSON Schema](#json-schema)

### Variable
Placeholder in prompts or configurations that gets replaced with actual values at runtime.

**Configuration variables:** Environment variables like `${API_KEY}`
**Prompt variables:** Template placeholders like `{{user_input}}`

**See also:** [Environment Variable](#environment-variable), [Template](#template)

### Version
Identifier for MCP protocol compatibility. Format: `YYYY-MM-DD`

**Current protocol version:** `2024-11-05`

**See also:** [Protocol Version](#protocol-version), [Initialization](#initialization)

## W

### WebSocket
Full-duplex communication protocol over TCP. Can be used as MCP transport for real-time bidirectional streaming.

**See also:** [Transport](#transport), [Streaming](#streaming)

### WebSocket Transport
MCP transport implementation using WebSocket protocol for bidirectional real-time communication.

**See also:** [WebSocket](#websocket), [Transport](#transport)

## Acronyms and Abbreviations

| Acronym | Full Term | Description |
|---------|-----------|-------------|
| **API** | Application Programming Interface | Interface for software interaction |
| **CLI** | Command Line Interface | Text-based user interface |
| **HTTP** | Hypertext Transfer Protocol | Web communication protocol |
| **HTTPS** | HTTP Secure | Encrypted HTTP |
| **IDE** | Integrated Development Environment | Software development application |
| **JSON** | JavaScript Object Notation | Data interchange format |
| **LLM** | Large Language Model | AI language processing model |
| **MCP** | Model Context Protocol | Protocol for LLM integration |
| **NPM** | Node Package Manager | JavaScript package manager |
| **NPX** | Node Package Execute | npm package runner |
| **OAuth** | Open Authorization | Authorization framework |
| **RPC** | Remote Procedure Call | Inter-process communication |
| **SDK** | Software Development Kit | Development tools collection |
| **SSE** | Server-Sent Events | HTTP streaming protocol |
| **STDIO** | Standard Input/Output | Process I/O streams |
| **TCP** | Transmission Control Protocol | Network transport protocol |
| **URI** | Uniform Resource Identifier | Resource identifier |
| **URL** | Uniform Resource Locator | Web address |
| **WS** | WebSocket | Bidirectional protocol |

## Cross-Reference Index

### By Category

**Protocol Fundamentals:**
- [MCP](#mcp-model-context-protocol)
- [JSON-RPC](#json-rpc)
- [Protocol](#protocol)
- [Protocol Version](#protocol-version)
- [Message](#message)

**Architecture Components:**
- [Client](#client)
- [Server](#server)
- [Host](#host)
- [Platform](#platform)
- [Transport](#transport)

**Core Primitives:**
- [Tool](#tool)
- [Resource](#resource)
- [Prompt](#prompt)
- [Primitive](#primitive)

**Data & Schema:**
- [Schema](#schema)
- [JSON Schema](#json-schema)
- [Validation](#validation)
- [Type](#type)
- [Parameter](#parameter)

**Configuration:**
- [Configuration](#configuration)
- [Environment Variable](#environment-variable)
- [Command](#command)
- [Argument](#argument)

**Communication:**
- [Request](#request)
- [Response](#response)
- [Notification](#notification)
- [Event](#event)
- [Bidirectional Communication](#bidirectional-communication)

**Transport Types:**
- [STDIO Transport](#stdio-transport)
- [SSE Transport](#sse-transport)
- [HTTP Transport](#http-transport)
- [WebSocket Transport](#websocket-transport)

**Development:**
- [SDK](#sdk-software-development-kit)
- [Server Development](#server-development)
- [Integration](#integration)
- [Package](#package)

**Security:**
- [Authentication](#authentication)
- [API Key](#api-key)
- [Security](#security)

## Related Documentation

- **Getting Started:** [Understanding MCP](../01-fundamentals/01-what-is-mcp.md)
- **Implementation:** [Creating MCP Servers](../03-creating-servers/index.md)
- **Platform Guides:** [Platform Integration](../04-platform-guides/index.md)
- **API Reference:** [MCP Specification](https://spec.modelcontextprotocol.io)

## External Resources

- **Official Specification:** https://spec.modelcontextprotocol.io
- **GitHub Repository:** https://github.com/modelcontextprotocol
- **Server Registry:** https://github.com/modelcontextprotocol/servers
- **Community Hub:** https://mcphub.io

---

**Document Version:** 1.0.0
**Last Updated:** 2026-02-01
**MCP Protocol Version:** 2024-11-05
