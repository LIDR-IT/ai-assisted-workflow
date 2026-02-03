# MCP Server Builder Guide

## Overview

**mcp-builder** is Anthropic's official skill for guiding developers in creating Model Context Protocol (MCP) servers. MCP servers enable large language models to interact with external services through well-designed tools.

**Source:** [skills.sh/anthropics/skills/mcp-builder](https://skills.sh/anthropics/skills/mcp-builder)
**Official Docs:** [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## Purpose

The mcp-builder skill helps developers:

- Create MCP servers that expose external services to LLMs
- Design well-structured tools with proper schemas
- Implement best practices for error handling and documentation
- Test and validate server implementations
- Create comprehensive evaluations

---

## Development Workflow

MCP server development follows a **four-phase workflow**:

### Phase 1: Research & Planning

**Objectives:**

- Understand the MCP protocol
- Study target API/service
- Plan implementation approach

#### Step 1.1: Study MCP Protocol

**Resources:**

- Read MCP documentation at [modelcontextprotocol.io](https://modelcontextprotocol.io)
- Understand core concepts: tools, resources, prompts
- Review JSON-RPC 2.0 message format
- Learn about transport options (stdio vs HTTP)

**Key Concepts to Understand:**

- **Tools**: Executable functions the LLM can invoke
- **Resources**: Data sources for context
- **Prompts**: Reusable interaction templates
- **Lifecycle**: Initialization and capability negotiation
- **Notifications**: Real-time updates

#### Step 1.2: Review Framework Documentation

**Recommended Stack:**

- **Language**: TypeScript (preferred) or Python
- **Transport**: Streamable HTTP (remote) or stdio (local)

**Why TypeScript?**

- High-quality SDK support
- Broad AI model familiarity with the language
- Strong typing with Zod schemas
- Better developer experience

**Framework Documentation:**

- TypeScript SDK: [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Python SDK: [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

#### Step 1.3: Analyze Target API

**Questions to Answer:**

- What are the API endpoints?
- What authentication is required?
- What rate limits exist?
- What error responses are possible?
- What data formats are used?

**Documentation to Review:**

- API reference documentation
- Authentication guides (OAuth, API keys, tokens)
- Rate limiting policies
- Error codes and messages

#### Step 1.4: Prioritize API Coverage

**Best Practice:** Prioritize comprehensive API coverage over specialized workflow tools.

**Approach:**

```
✅ Good: Expose all major API endpoints as individual tools
- create_issue
- update_issue
- list_issues
- add_comment
- close_issue

❌ Less Ideal: Create high-level workflow tools
- handle_bug_report (does too many things)
```

**Why?**

- LLMs are better at composing simple tools into workflows
- Simpler tools are easier to understand and debug
- More flexible for different use cases
- Better error handling granularity

---

### Phase 2: Implementation

**Objectives:**

- Set up project structure
- Create shared utilities
- Implement tools with schemas
- Add proper annotations

#### Step 2.1: Set Up Project Structure

**TypeScript Project Structure:**

```
my-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Server entry point
│   ├── client.ts          # API client wrapper
│   ├── tools/
│   │   ├── create.ts      # Tool implementations
│   │   ├── read.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   ├── schemas/
│   │   └── types.ts       # Zod schemas
│   └── utils/
│       ├── errors.ts      # Error handling
│       └── pagination.ts  # Pagination utilities
├── README.md
└── .env.example
```

**Python Project Structure:**

```
my_mcp_server/
├── pyproject.toml
├── src/
│   ├── __init__.py
│   ├── server.py          # Server entry point
│   ├── client.py          # API client wrapper
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── create.py      # Tool implementations
│   │   ├── read.py
│   │   ├── update.py
│   │   └── delete.py
│   ├── schemas/
│   │   └── types.py       # Pydantic models
│   └── utils/
│       ├── errors.py      # Error handling
│       └── pagination.py  # Pagination utilities
├── README.md
└── .env.example
```

**Initial Setup:**

TypeScript:

```bash
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init
```

Python:

```bash
python -m venv venv
source venv/bin/activate
pip install mcp pydantic
```

#### Step 2.2: Create Shared Utilities

**API Client Wrapper:**

TypeScript:

```typescript
// src/client.ts
export class APIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(`API request failed: ${response.statusText}`, response.status);
    }

    return response.json();
  }
}
```

**Error Handling:**

TypeScript:

```typescript
// src/utils/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = "APIError";
  }

  toActionableMessage(): string {
    switch (this.statusCode) {
      case 401:
        return "Authentication failed. Check your API key in environment variables.";
      case 403:
        return "Permission denied. Ensure your API key has required permissions.";
      case 404:
        return "Resource not found. Verify the ID or endpoint.";
      case 429:
        return "Rate limit exceeded. Wait before retrying.";
      default:
        return `API error: ${this.message}`;
    }
  }
}
```

**Pagination Helper:**

TypeScript:

```typescript
// src/utils/pagination.ts
export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export async function* paginate<T>(
  client: APIClient,
  endpoint: string,
  pageSize: number = 100
): AsyncGenerator<T> {
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      ...(cursor && { cursor }),
    });

    const response: PaginatedResponse<T> = await client.request(`${endpoint}?${params}`);

    for (const item of response.data) {
      yield item;
    }

    cursor = response.nextCursor;
  } while (cursor);
}
```

#### Step 2.3: Implement Tools with Schemas

**Tool Naming Convention:**
Use consistent prefixes: `service_action`

**Examples:**

- `github_create_issue`
- `github_list_repositories`
- `database_execute_query`
- `slack_send_message`

**Tool Implementation (TypeScript):**

```typescript
// src/tools/create-issue.ts
import { z } from "zod";

// Input schema
export const CreateIssueInputSchema = z.object({
  repository: z.string().describe("Repository in format owner/repo"),
  title: z.string().describe("Issue title"),
  body: z.string().optional().describe("Issue description"),
  labels: z.array(z.string()).optional().describe("Labels to add"),
  assignees: z.array(z.string()).optional().describe("Users to assign"),
});

export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;

// Tool definition
export const createIssueTool = {
  name: "github_create_issue",
  description: "Create a new issue in a GitHub repository",
  inputSchema: CreateIssueInputSchema,
  annotations: {
    destructiveHint: true, // Creates new data
    idempotentHint: false, // Not idempotent
  },
};

// Tool handler
export async function createIssue(client: APIClient, input: CreateIssueInput) {
  try {
    const issue = await client.request("/repos/{owner}/{repo}/issues", {
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        labels: input.labels,
        assignees: input.assignees,
      }),
    });

    // Return both text and structured data
    return {
      content: [
        {
          type: "text",
          text: `Created issue #${issue.number}: ${issue.title}\nURL: ${issue.html_url}`,
        },
        {
          type: "resource",
          resource: {
            uri: `github://issues/${issue.id}`,
            mimeType: "application/json",
            text: JSON.stringify(issue, null, 2),
          },
        },
      ],
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
}
```

**Tool Implementation (Python):**

```python
# src/tools/create_issue.py
from pydantic import BaseModel, Field
from typing import Optional, List

class CreateIssueInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(description="Issue title")
    body: Optional[str] = Field(None, description="Issue description")
    labels: Optional[List[str]] = Field(None, description="Labels to add")
    assignees: Optional[List[str]] = Field(None, description="Users to assign")

# Tool definition
create_issue_tool = {
    "name": "github_create_issue",
    "description": "Create a new issue in a GitHub repository",
    "inputSchema": CreateIssueInput.schema(),
    "annotations": {
        "destructiveHint": True,
        "idempotentHint": False,
    }
}

async def create_issue(client: APIClient, input: CreateIssueInput):
    try:
        issue = await client.request(
            f"/repos/{input.repository}/issues",
            method="POST",
            json={
                "title": input.title,
                "body": input.body,
                "labels": input.labels,
                "assignees": input.assignees,
            }
        )

        return {
            "content": [
                {
                    "type": "text",
                    "text": f"Created issue #{issue['number']}: {issue['title']}\nURL: {issue['html_url']}"
                },
                {
                    "type": "resource",
                    "resource": {
                        "uri": f"github://issues/{issue['id']}",
                        "mimeType": "application/json",
                        "text": json.dumps(issue, indent=2)
                    }
                }
            ]
        }
    except APIError as error:
        raise Exception(error.to_actionable_message())
```

#### Step 2.4: Add Tool Annotations

**Available Annotations:**

1. **`readOnlyHint`**: Tool only reads data, doesn't modify
2. **`destructiveHint`**: Tool creates, updates, or deletes data
3. **`idempotentHint`**: Calling multiple times has same effect as once
4. **`openWorldHint`**: Tool can access arbitrary resources

**Examples:**

```typescript
// Read-only tool
{
  name: 'github_list_issues',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
  }
}

// Destructive, non-idempotent
{
  name: 'github_create_issue',
  annotations: {
    destructiveHint: true,
    idempotentHint: false,
  }
}

// Idempotent update
{
  name: 'github_update_issue_title',
  annotations: {
    destructiveHint: true,
    idempotentHint: true,
  }
}

// Open world (file system access)
{
  name: 'filesystem_read_file',
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  }
}
```

#### Step 2.5: Server Entry Point

**TypeScript Server (stdio):**

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createIssueTool, createIssue } from "./tools/create-issue.js";
import { APIClient } from "./client.js";

const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const client = new APIClient(process.env.GITHUB_TOKEN!, "https://api.github.com");

// List available tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    createIssueTool,
    // ... other tools
  ],
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "github_create_issue":
      return await createIssue(client, args);
    // ... other tools
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**TypeScript Server (HTTP):**

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();
const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ... tool handlers ...

app.post("/mcp", async (req, res) => {
  const transport = new SSEServerTransport("/mcp/sse", res);
  await server.connect(transport);
});

app.listen(3000, () => {
  console.log("MCP server listening on port 3000");
});
```

---

### Phase 3: Review & Testing

**Objectives:**

- Verify code quality
- Test functionality
- Validate with MCP Inspector

#### Step 3.1: Code Review Checklist

**DRY Principle (Don't Repeat Yourself):**

- [ ] Shared utilities for common operations
- [ ] Reusable error handling
- [ ] Consistent API client usage
- [ ] No duplicated validation logic

**Error Handling:**

- [ ] Actionable error messages
- [ ] Proper status code handling
- [ ] Graceful fallbacks
- [ ] User-friendly error responses

**Type Coverage:**

- [ ] Input schemas for all tools
- [ ] Response type definitions
- [ ] No `any` types in critical paths
- [ ] Proper type inference

**Example Review:**

```typescript
// ❌ Poor error handling
try {
  const result = await api.call();
  return result;
} catch (e) {
  return { error: "Failed" };
}

// ✅ Good error handling
try {
  const result = await api.call();
  return result;
} catch (error) {
  if (error instanceof APIError) {
    throw new Error(error.toActionableMessage());
  }
  throw new Error(`Unexpected error: ${error.message}`);
}
```

#### Step 3.2: Build and Syntax Check

**TypeScript:**

```bash
# Build the project
npm run build

# Check for type errors
npx tsc --noEmit

# Run linter
npx eslint src/
```

**Python:**

```bash
# Check syntax
python -m py_compile src/**/*.py

# Type checking with mypy
mypy src/

# Run linter
ruff check src/
```

#### Step 3.3: Test with MCP Inspector

**MCP Inspector** is the official tool for testing MCP servers.

**Installation:**

```bash
npm install -g @modelcontextprotocol/inspector
```

**Launch Inspector:**

```bash
# For stdio servers
mcp-inspector npx tsx src/index.ts

# For HTTP servers
mcp-inspector http://localhost:3000/mcp
```

**Testing Workflow:**

1. **Verify Initialization**
   - Check server capabilities
   - Confirm protocol version
   - Validate server info

2. **Test Tool Discovery**
   - List all tools
   - Verify tool metadata
   - Check input schemas

3. **Execute Tools**
   - Test with valid inputs
   - Test with invalid inputs
   - Verify error messages
   - Check response format

4. **Test Edge Cases**
   - Empty inputs
   - Large datasets
   - Rate limiting
   - Network errors

**Manual Testing:**

```bash
# Test create issue
echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "owner/repo",
      "title": "Test issue",
      "body": "This is a test"
    }
  }
}' | npx tsx src/index.ts
```

---

### Phase 4: Evaluation Creation

**Objectives:**

- Create comprehensive test questions
- Validate server capabilities
- Ensure realistic scenarios

#### Step 4.1: Generate Test Questions

**Requirements:**

- **10 complex questions** minimum
- **Read-only operations** (safe for evaluation)
- **Independent questions** (can be answered in any order)
- **Realistic scenarios** (actual use cases)
- **Verifiable answers** (deterministic results)

**Question Format:**

```xml
<evaluations>
  <evaluation>
    <question>
      What are the three most recent issues in the repository 'owner/repo'
      that have the label 'bug' and are currently open?
    </question>
    <answer>
      Issue #123: "Login fails with empty email"
      Issue #122: "404 error on profile page"
      Issue #120: "Session timeout not working"
    </answer>
  </evaluation>

  <evaluation>
    <question>
      How many pull requests were merged in the last 7 days
      in the repository 'owner/repo'?
    </question>
    <answer>
      15 pull requests were merged in the last 7 days.
    </answer>
  </evaluation>
</evaluations>
```

#### Step 4.2: Evaluation Best Practices

**Good Questions:**

- Require multiple tool calls
- Test different capabilities
- Cover edge cases
- Realistic scenarios

**Bad Questions:**

- Too simple (single tool call)
- Ambiguous requirements
- Non-deterministic answers
- Destructive operations

**Examples:**

```xml
<!-- ✅ Good: Complex, multi-step -->
<evaluation>
  <question>
    For the user 'johndoe', list all repositories they own,
    filter for those with more than 10 stars,
    and show the most recent commit date for each.
  </question>
  <answer>
    - awesome-project: 45 stars, last commit 2026-01-15
    - cool-library: 23 stars, last commit 2026-01-10
    - helpful-tool: 12 stars, last commit 2026-01-08
  </answer>
</evaluation>

<!-- ❌ Bad: Too simple -->
<evaluation>
  <question>
    What is the title of issue #123?
  </question>
  <answer>
    "Login bug"
  </answer>
</evaluation>
```

---

## Best Practices Summary

### Tool Design

✅ **DO:**

- Use consistent naming: `service_action`
- Prioritize comprehensive API coverage
- Provide actionable error messages
- Return both text and structured data
- Use proper annotations
- Include detailed descriptions
- Validate inputs with schemas

❌ **DON'T:**

- Create overly complex workflow tools
- Use vague error messages
- Ignore error handling
- Return only text or only structured data
- Forget annotations
- Use inconsistent naming

### Error Messages

**Actionable Error Messages** guide agents toward solutions:

```typescript
// ❌ Not actionable
throw new Error("Invalid token");

// ✅ Actionable
throw new Error(
  "Authentication failed: Invalid API token. " +
    "Generate a new token at https://github.com/settings/tokens " +
    "and set it in the GITHUB_TOKEN environment variable."
);
```

### Response Format

**Return both text and structured data** for maximum compatibility:

```typescript
return {
  content: [
    // Human-readable text
    {
      type: "text",
      text: "Created issue #123: Bug in login flow",
    },
    // Structured data for modern SDKs
    {
      type: "resource",
      resource: {
        uri: "github://issues/123",
        mimeType: "application/json",
        text: JSON.stringify(issue, null, 2),
      },
    },
  ],
};
```

### Transport Selection

**Stdio Transport:**

- Local servers only
- Single client connection
- Simple setup
- No authentication needed

**Streamable HTTP:**

- Remote servers
- Multiple clients
- Requires authentication
- Better for production

**Recommendation:** Use **stateless JSON** with HTTP transport for production servers.

---

## Language Recommendations

### TypeScript (Recommended)

**Pros:**

- High-quality SDK support
- AI models familiar with TypeScript
- Strong typing with Zod
- Better developer experience
- Rich ecosystem

**Cons:**

- Build step required
- More verbose than Python

### Python

**Pros:**

- Simpler syntax
- Quick prototyping
- Pydantic for validation
- Large data science ecosystem

**Cons:**

- SDK less mature than TypeScript
- Type hints less enforced
- Async can be complex

---

## Complete Example: GitHub MCP Server

### Minimal Working Server

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const ListIssuesSchema = z.object({
  repository: z.string().describe("Repository in format owner/repo"),
  state: z.enum(["open", "closed", "all"]).default("open"),
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "github_list_issues",
      description: "List issues in a GitHub repository",
      inputSchema: ListIssuesSchema,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "github_list_issues") {
    const input = ListIssuesSchema.parse(args);
    const response = await fetch(
      `https://api.github.com/repos/${input.repository}/issues?state=${input.state}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const issues = await response.json();

    return {
      content: [
        {
          type: "text",
          text:
            `Found ${issues.length} issues:\n` +
            issues.map((i: any) => `#${i.number}: ${i.title}`).join("\n"),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### package.json

```json
{
  "name": "github-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "github-mcp-server": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.6.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Resources

- **Skill Source:** [skills.sh/anthropics/skills/mcp-builder](https://skills.sh/anthropics/skills/mcp-builder)
- **MCP Documentation:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **TypeScript SDK:** [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Python SDK:** [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)
- **MCP Inspector:** [github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)
- **Reference Servers:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- **MCP Specification:** [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)

---

**Last Updated:** January 2026
**Provider:** Anthropic
**Category:** MCP Development
