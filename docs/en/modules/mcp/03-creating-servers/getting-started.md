# Getting Started with MCP Server Development

Building a Model Context Protocol (MCP) server allows you to extend AI assistants with custom capabilities by connecting them to external services, APIs, and data sources. This guide will help you approach MCP server development with the right mindset, preparation, and foundational knowledge.

## Overview

MCP server development is a structured process that begins with thorough research and planning. Before writing any code, you need to understand:

- The MCP protocol and its core primitives
- Your chosen development framework (TypeScript or Python)
- The target API or service you're integrating
- Best practices for tool design and API coverage

This guide covers Phase 1 of the MCP server development workflow: **Research & Planning**. By the end, you'll have a solid foundation to begin implementing your server with confidence.

## Prerequisites

### Required Knowledge

- **Programming experience**: Intermediate knowledge of TypeScript or Python
- **API fundamentals**: Understanding of REST APIs, HTTP methods, and JSON
- **Command line**: Comfortable using terminal commands and package managers
- **Async programming**: Familiarity with promises/async-await patterns

### Development Environment

Before starting, ensure you have:

**For TypeScript development:**
- Node.js 18+ installed
- npm or yarn package manager
- TypeScript 5.0+ (typically installed as project dependency)
- Code editor with TypeScript support (VS Code recommended)

**For Python development:**
- Python 3.10+ installed
- pip package manager
- Virtual environment tool (venv or conda)
- Code editor with Python support

**General tools:**
- Git for version control
- API testing tool (curl, Postman, or similar)
- JSON validator/formatter

### Recommended Reading

Before diving into server development, familiarize yourself with these MCP fundamentals:

- [What is MCP?](../01-fundamentals/what-is-mcp.md) - Core concepts and use cases
- [Core Primitives](../01-fundamentals/core-primitives.md) - Tools, resources, and prompts
- [Protocol Architecture](../01-fundamentals/protocol-architecture.md) - Technical foundation
- [Lifecycle](../01-fundamentals/lifecycle.md) - Connection and initialization flow

## Phase 1: Research & Planning

The research and planning phase is crucial for building a well-designed MCP server. Rushing into implementation without proper planning often leads to architectural issues that are difficult to fix later.

### Objectives

By completing this phase, you will:

1. Understand the MCP protocol specification and its capabilities
2. Choose and familiarize yourself with a development framework
3. Thoroughly analyze your target API or service
4. Plan your tool design and API coverage strategy
5. Define success criteria for your implementation

### Step 1: Study the MCP Protocol

Understanding the MCP protocol is foundational to building effective servers. You don't need to memorize every detail, but you should grasp the core concepts and message patterns.

#### Essential Protocol Concepts

**1. Core Primitives**

MCP provides three main primitives for extending AI capabilities:

- **Tools**: Functions that the LLM can invoke to perform actions
  - Example: `create_issue`, `send_email`, `query_database`
  - Tools have input schemas and return results
  - Can modify external state (create, update, delete operations)

- **Resources**: Data sources that provide context to the LLM
  - Example: File contents, database records, API responses
  - Resources are read-only references with URIs
  - Support for text, binary, and structured data

- **Prompts**: Reusable interaction templates
  - Example: Code review template, bug report format
  - Pre-configured instructions and workflows
  - Can accept arguments for customization

For detailed explanations, see [Core Primitives](../01-fundamentals/core-primitives.md).

**2. Communication Protocol**

MCP uses JSON-RPC 2.0 for message exchange:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {
      "title": "Bug: Login fails",
      "description": "Users cannot log in..."
    }
  }
}
```

Key characteristics:
- Request-response pattern for most operations
- Support for notifications (one-way messages)
- Error handling with standard error codes
- Batch requests for efficiency

**3. Transport Options**

MCP supports two primary transport mechanisms:

- **stdio (Standard Input/Output)**
  - Used for local, single-user servers
  - Simple process communication
  - Example: Claude Code local MCP servers

- **Streamable HTTP**
  - Used for remote, multi-user servers
  - Supports streaming responses
  - Better for cloud-deployed services
  - Example: Shared team MCP servers

For most projects, start with stdio and migrate to HTTP when needed.

**4. Capability Negotiation**

During initialization, clients and servers negotiate capabilities:

```typescript
// Server declares what it supports
{
  "capabilities": {
    "tools": {},
    "resources": { "subscribe": true },
    "prompts": {},
    "logging": {}
  }
}
```

This allows clients to:
- Discover available features
- Adapt their behavior based on server capabilities
- Enable optional features like resource subscriptions

See [Lifecycle](../01-fundamentals/lifecycle.md) for the complete connection flow.

#### Protocol Study Checklist

As you review the MCP specification, ensure you understand:

- [ ] Tool definition structure (name, description, input schema)
- [ ] Resource URI format and content types
- [ ] Prompt argument handling
- [ ] Error response format and standard codes
- [ ] Lifecycle phases (initialize, capabilities, ready)
- [ ] Notification mechanisms for real-time updates
- [ ] Security considerations (authentication, authorization)

#### Official Resources

- **Specification**: [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)
- **Protocol docs**: [modelcontextprotocol.io/docs/concepts/architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- **Example servers**: [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

Take time to read these thoroughly. Understanding the protocol will help you make better design decisions throughout development.

### Step 2: Review Framework Documentation

Once you understand the protocol, choose a development framework and study its documentation. Both TypeScript and Python have official SDKs that handle protocol details.

#### Choosing Your Framework

**TypeScript (Recommended)**

TypeScript is the preferred choice for most MCP servers:

**Advantages:**
- High-quality SDK with excellent type safety
- AI models have extensive training on TypeScript
- Strong ecosystem with Zod for schema validation
- Better developer experience with IDE support
- npm ecosystem for easy dependency management

**Use TypeScript when:**
- Building new servers from scratch
- You want the best tooling and type safety
- Your team is comfortable with JavaScript/TypeScript
- You need good IDE autocomplete and error detection

**Python**

Python is a solid alternative, especially for data-heavy applications:

**Advantages:**
- Familiar to data scientists and ML engineers
- Rich ecosystem for data processing and APIs
- Excellent for scientific computing integrations
- Simpler syntax for rapid prototyping

**Use Python when:**
- Integrating with Python-specific libraries
- Your team primarily uses Python
- Working with data science or ML workflows
- The target API has official Python SDKs

#### TypeScript SDK Study Guide

If choosing TypeScript, focus on these key areas:

**1. Project Setup**

```bash
# Create new project
npm init -y
npm install @modelcontextprotocol/sdk zod

# TypeScript configuration
npm install -D typescript @types/node
npx tsc --init
```

**2. Core SDK Patterns**

Study these essential SDK components:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Server creation
const server = new Server(
  {
    name: "my-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool registration with Zod schema
const CreateIssueSchema = z.object({
  title: z.string().describe("Issue title"),
  description: z.string().describe("Issue description"),
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_issue",
      description: "Create a new issue",
      inputSchema: zodToJsonSchema(CreateIssueSchema),
    },
  ],
}));

// Tool implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_issue") {
    const validated = CreateIssueSchema.parse(args);
    const result = await createIssue(validated);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});
```

**3. Key SDK Concepts**

- **Request handlers**: How to register handlers for different request types
- **Schema validation**: Using Zod for input validation
- **Transport setup**: Configuring stdio or HTTP transport
- **Error handling**: SDK error types and best practices
- **Type safety**: Leveraging TypeScript's type system

**SDK Resources:**
- Repository: [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- Examples: Check the `examples/` directory in the repo
- API docs: TypeScript definitions provide inline documentation

#### Python SDK Study Guide

If choosing Python, focus on these areas:

**1. Project Setup**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install SDK
pip install mcp
```

**2. Core SDK Patterns**

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
from pydantic import BaseModel, Field

# Define tool input model
class CreateIssueInput(BaseModel):
    title: str = Field(description="Issue title")
    description: str = Field(description="Issue description")

# Create server instance
app = Server("my-server")

# List available tools
@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="create_issue",
            description="Create a new issue",
            inputSchema=CreateIssueInput.schema(),
        )
    ]

# Implement tool
@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "create_issue":
        input_data = CreateIssueInput(**arguments)
        result = await create_issue(input_data)

        return [
            TextContent(
                type="text",
                text=json.dumps(result, indent=2),
            )
        ]

    raise ValueError(f"Unknown tool: {name}")

# Run server
if __name__ == "__main__":
    import asyncio
    asyncio.run(stdio_server(app))
```

**3. Key SDK Concepts**

- **Decorators**: Using `@app` decorators for handlers
- **Pydantic models**: Schema definition and validation
- **Async/await**: Asynchronous request handling
- **Transport setup**: stdio_server configuration
- **Type hints**: Python type annotations for safety

**SDK Resources:**
- Repository: [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)
- Examples: Check the `examples/` directory
- Documentation: README and docstrings

#### Framework Study Checklist

Before proceeding, ensure you can:

- [ ] Create a basic MCP server with your chosen framework
- [ ] Define a simple tool with input validation
- [ ] Handle tool invocation requests
- [ ] Return properly formatted responses
- [ ] Handle errors gracefully
- [ ] Configure transport (stdio or HTTP)
- [ ] Run and test the server locally

### Step 3: Analyze Your Target API

Now that you understand MCP and your development framework, thoroughly analyze the external service or API you're integrating.

#### API Documentation Review

Gather comprehensive information about your target API:

**1. Endpoint Inventory**

Create a complete list of API endpoints:

```
Example: GitHub API
- GET /repos/{owner}/{repo}/issues
- POST /repos/{owner}/{repo}/issues
- PATCH /repos/{owner}/{repo}/issues/{number}
- POST /repos/{owner}/{repo}/issues/{number}/comments
- PUT /repos/{owner}/{repo}/issues/{number}/lock
- DELETE /repos/{owner}/{repo}/issues/{number}/lock
```

For each endpoint, document:
- HTTP method (GET, POST, PUT, DELETE, PATCH)
- Required and optional parameters
- Request body schema (if applicable)
- Response format and status codes
- Pagination mechanisms

**2. Authentication Requirements**

Identify how the API authenticates requests:

- **API Keys**: Simple token-based authentication
  ```
  Authorization: Bearer sk_abc123...
  ```

- **OAuth 2.0**: Token exchange flows
  ```
  Authorization: Bearer {oauth_token}
  ```

- **Basic Auth**: Username/password encoding
  ```
  Authorization: Basic {base64_credentials}
  ```

- **Custom headers**: Service-specific authentication
  ```
  X-API-Key: abc123...
  ```

**3. Rate Limiting**

Understanding rate limits prevents runtime errors:

```
Example: GitHub API
- 5,000 requests/hour for authenticated users
- 60 requests/hour for unauthenticated
- Additional limits for specific endpoints
```

Consider:
- Per-hour vs per-minute limits
- Separate limits for different endpoints
- Rate limit headers in responses
- Handling 429 Too Many Requests errors

**4. Error Response Patterns**

Document common error scenarios:

```json
// 400 Bad Request
{
  "error": "invalid_request",
  "message": "Missing required field: title"
}

// 401 Unauthorized
{
  "error": "unauthorized",
  "message": "Invalid API key"
}

// 404 Not Found
{
  "error": "not_found",
  "message": "Issue #999 not found"
}

// 429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Retry after 60 seconds",
  "retry_after": 60
}
```

Understanding error patterns helps you:
- Provide clear error messages to users
- Implement appropriate retry logic
- Handle edge cases gracefully

**5. Data Formats and Schemas**

Document data structures used by the API:

```typescript
// Example: GitHub Issue schema
interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    id: number;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}
```

This helps you:
- Design tool input/output schemas
- Handle optional fields correctly
- Transform API responses appropriately

#### API Testing

Before implementing your MCP server, manually test the API:

**1. Authentication Test**

Verify your credentials work:

```bash
# Example: Test GitHub API authentication
curl -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  https://api.github.com/user
```

**2. Endpoint Testing**

Test key endpoints you'll integrate:

```bash
# List issues
curl -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/owner/repo/issues"

# Create issue
curl -X POST \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test issue","body":"Test description"}' \
  "https://api.github.com/repos/owner/repo/issues"
```

**3. Error Handling Test**

Trigger error conditions intentionally:

```bash
# Test invalid auth
curl -H "Authorization: Bearer invalid_token" \
  https://api.github.com/user

# Test rate limiting (make many rapid requests)
for i in {1..100}; do
  curl -H "Authorization: Bearer ${TOKEN}" \
    https://api.github.com/user
done
```

#### API Analysis Checklist

Before proceeding to design, ensure you have:

- [ ] Complete list of API endpoints and their purposes
- [ ] Authentication mechanism documented and tested
- [ ] Rate limits understood and documented
- [ ] Common error responses documented
- [ ] Request/response schemas documented
- [ ] Pagination patterns understood (if applicable)
- [ ] Special endpoint behaviors noted (idempotency, etc.)
- [ ] API client library evaluated (if available)

### Step 4: Prioritize API Coverage

With your API knowledge complete, plan your tool design strategy. A common mistake is creating overly complex, workflow-oriented tools. Instead, prioritize comprehensive API coverage with simple, focused tools.

#### The Principle: Granular Tools Over Workflows

**Why granular tools?**

Large language models excel at composing simple tools into complex workflows. By providing granular tools that map 1:1 with API endpoints, you enable maximum flexibility.

**Example: Issue Management**

```
✅ GOOD: Granular Tools
- create_issue(title, description, labels)
- update_issue(issue_id, title, description, state)
- add_comment(issue_id, comment)
- add_label(issue_id, label)
- assign_issue(issue_id, assignee)
- close_issue(issue_id)

❌ LESS IDEAL: Workflow Tools
- handle_bug_report(title, description, severity, auto_assign)
  // This tool does too many things:
  // 1. Creates issue
  // 2. Adds labels based on severity
  // 3. Auto-assigns based on rules
  // 4. Posts formatted comment
```

**Why the granular approach wins:**

1. **LLM Composability**: The LLM can chain `create_issue` + `add_label` + `assign_issue` as needed
2. **Debugging**: Easier to identify which specific operation failed
3. **Error Recovery**: Can retry individual steps without redoing entire workflow
4. **Flexibility**: Supports use cases you didn't anticipate
5. **Testability**: Each tool can be tested independently

#### Designing Your Tool Coverage

**Step 1: Map API to Tools**

Create a 1:1 mapping of important API endpoints to tools:

```
API Endpoint                          → MCP Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST /repos/{owner}/{repo}/issues     → create_issue
GET /repos/{owner}/{repo}/issues      → list_issues
GET /repos/{owner}/{repo}/issues/{n}  → get_issue
PATCH /repos/{owner}/{repo}/issues/{n}→ update_issue
POST /{owner}/{repo}/issues/{n}/comments → add_comment
```

**Step 2: Prioritize by Importance**

Not all endpoints need tools. Prioritize by:

1. **Core operations**: CRUD operations (Create, Read, Update, Delete)
2. **Frequency of use**: Most commonly needed actions
3. **Value to LLM**: Operations that benefit from LLM intelligence
4. **Complexity**: Operations where automation helps most

**Priority levels:**

```
High Priority (MVP):
- create_issue
- list_issues
- get_issue
- update_issue
- add_comment

Medium Priority (Phase 2):
- add_label
- assign_issue
- search_issues
- close_issue

Low Priority (Future):
- transfer_issue
- lock_issue
- delete_issue
```

**Step 3: Define Tool Boundaries**

Each tool should have:

- **Single responsibility**: One primary action
- **Clear inputs**: Well-defined required and optional parameters
- **Predictable output**: Consistent response format
- **Idempotency**: Same inputs produce same results (when possible)

**Example: Well-Scoped Tool**

```typescript
// Good: Focused, single-purpose tool
{
  name: "create_issue",
  description: "Create a new issue in a GitHub repository",
  inputSchema: {
    type: "object",
    properties: {
      owner: {
        type: "string",
        description: "Repository owner username"
      },
      repo: {
        type: "string",
        description: "Repository name"
      },
      title: {
        type: "string",
        description: "Issue title"
      },
      body: {
        type: "string",
        description: "Issue description (supports Markdown)"
      },
      labels: {
        type: "array",
        items: { type: "string" },
        description: "Optional labels to add"
      }
    },
    required: ["owner", "repo", "title"]
  }
}
```

#### Special Considerations

**1. Read vs Write Operations**

Balance read and write capabilities:

- **Read tools**: Safe, can be called frequently (list, get, search)
- **Write tools**: Modify state, need clear confirmation (create, update, delete)

Both are valuable, but write tools require more careful error handling.

**2. Batch Operations**

For APIs with batch endpoints, consider:

```typescript
// Individual operation (preferred)
create_issue(title, description)

// vs Batch operation (use sparingly)
create_issues([{title, description}, ...])
```

Use batch operations only when:
- The API requires it
- Significant performance benefit
- Still simple to use correctly

**3. Convenience Tools**

Occasionally, high-level convenience tools are justified:

```typescript
// Acceptable convenience tool
search_issues_by_text(query)
// Wraps complex API search syntax that's hard for LLMs to construct
```

Create convenience tools when:
- The underlying API is extremely complex
- Common patterns are difficult to express
- Significant value from simplification

But keep them as the exception, not the rule.

#### Coverage Planning Checklist

Before implementation, document:

- [ ] List of all tools you'll implement (with priority levels)
- [ ] Tool naming convention decided
- [ ] Input/output schemas outlined for each tool
- [ ] Authentication approach for API calls
- [ ] Error handling strategy
- [ ] Rate limiting approach
- [ ] Testing plan for each tool

## Next Steps

Congratulations on completing the Research & Planning phase. You now have:

- Solid understanding of the MCP protocol
- Familiarity with your chosen development framework
- Comprehensive knowledge of your target API
- Clear plan for tool design and coverage

You're ready to move on to Phase 2: Implementation.

### Recommended Path Forward

1. **Set up your project structure**: Create project directories, install dependencies
   - See [Project Structure](./project-structure/) for recommended layouts

2. **Implement core infrastructure**: Set up server, transport, and configuration
   - Start with a basic server that responds to `initialize` and `tools/list`

3. **Implement your first tool**: Choose a simple read operation as your starting point
   - Example: `get_issue` or `list_issues` (no complex inputs, safe to test)

4. **Test thoroughly**: Verify tool works correctly before adding more
   - Manual testing with MCP inspector
   - Automated tests for validation logic

5. **Iterate and expand**: Add remaining tools incrementally
   - Implement one tool at a time
   - Test each before moving to the next

### Additional Resources

**Official Documentation:**
- MCP Specification: [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)
- TypeScript SDK: [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- Python SDK: [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)

**Community Resources:**
- Example servers: [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- Community Discord: Ask questions and share experiences
- Skills.sh: [skills.sh/anthropics/skills/mcp-builder](https://skills.sh/anthropics/skills/mcp-builder)

**Related Guides:**
- [Core Primitives](../01-fundamentals/core-primitives.md) - Deep dive into tools, resources, and prompts
- [Protocol Architecture](../01-fundamentals/protocol-architecture.md) - Technical protocol details
- [Lifecycle](../01-fundamentals/lifecycle.md) - Connection and initialization flow

## Summary

The research and planning phase sets the foundation for successful MCP server development. By thoroughly studying the MCP protocol, understanding your chosen framework, analyzing your target API, and prioritizing comprehensive tool coverage, you're positioned to build a well-designed, maintainable MCP server.

Remember the key principles:

1. **Understand before building**: Study protocol and frameworks first
2. **Know your API**: Document everything before coding
3. **Simple tools win**: Granular tools are more flexible than workflows
4. **Plan before implementing**: Clear design prevents costly refactoring

Take your time in this phase. The investment in planning pays dividends throughout the implementation, testing, and maintenance phases.

Happy building!
