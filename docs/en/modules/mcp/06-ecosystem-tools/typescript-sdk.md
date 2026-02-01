# TypeScript SDK for MCP

Learn how to build MCP servers using the official TypeScript SDK with comprehensive examples, best practices, and patterns.

## Overview

The **@modelcontextprotocol/sdk** is the official TypeScript SDK for building Model Context Protocol (MCP) servers. It provides a complete, type-safe implementation of the MCP protocol with excellent developer experience.

**Why TypeScript SDK?**

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Zod Integration**: Built-in schema validation with Zod
- **AI Model Familiarity**: AI models have extensive training on TypeScript
- **Rich Ecosystem**: npm packages and excellent IDE support
- **Official Support**: Maintained by Anthropic with high-quality documentation

**Repository**: [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)

---

## Installation and Setup

### Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **TypeScript 5.0+** (installed as dev dependency)
- Code editor with TypeScript support (VS Code recommended)

### Project Initialization

**1. Create New Project**

```bash
# Create project directory
mkdir my-mcp-server
cd my-mcp-server

# Initialize npm project
npm init -y

# Install TypeScript SDK and dependencies
npm install @modelcontextprotocol/sdk zod

# Install development dependencies
npm install -D typescript @types/node

# Initialize TypeScript configuration
npx tsc --init
```

**2. Configure TypeScript**

Update `tsconfig.json` with MCP-friendly settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

**3. Update package.json**

Configure build scripts and module type:

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "./build/index.js",
  "types": "./build/index.d.ts",
  "bin": {
    "my-mcp-server": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "start": "node build/index.js",
    "dev": "tsc && node build/index.js"
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

**4. Create Project Structure**

```bash
mkdir -p src/{tools,schemas,utils}
touch src/index.ts
```

**Recommended Structure:**

```
my-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Server entry point
│   ├── tools/
│   │   ├── create.ts      # Tool implementations
│   │   ├── read.ts
│   │   └── update.ts
│   ├── schemas/
│   │   └── types.ts       # Zod schemas
│   └── utils/
│       ├── client.ts      # API client wrapper
│       └── errors.ts      # Error handling
├── build/                 # Compiled output (generated)
├── README.md
└── .env.example
```

---

## Core SDK Components

### 1. Server Class

The `Server` class is the foundation of your MCP server.

**Import:**

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
```

**Creation:**

```typescript
const server = new Server(
  {
    name: 'my-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);
```

**Parameters:**

- **serverInfo**: Server name and version
- **options**: Server configuration
  - `capabilities`: Declare what the server supports

**Methods:**

| Method | Purpose |
|--------|---------|
| `setRequestHandler(schema, handler)` | Register request handlers |
| `connect(transport)` | Connect to a transport |
| `close()` | Close server and cleanup |
| `notification(method, params)` | Send notifications to client |

### 2. Transport Classes

Transports handle how messages are transmitted between client and server.

#### StdioServerTransport

For local servers communicating via standard input/output.

**Import:**

```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
```

**Usage:**

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Characteristics:**

- Local process communication
- Zero network overhead
- Single client connection
- Simple setup

#### SSEServerTransport

For remote servers using Server-Sent Events over HTTP.

**Import:**

```typescript
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
```

**Usage:**

```typescript
import express from 'express';

const app = express();

app.post('/mcp', async (req, res) => {
  const transport = new SSEServerTransport('/mcp/sse', res);
  await server.connect(transport);
});

app.listen(3000, () => {
  console.log('MCP server listening on port 3000');
});
```

**Characteristics:**

- Remote server deployment
- HTTP-based communication
- Supports authentication
- Multiple client connections

### 3. Request Handler Schemas

The SDK provides schema constants for request types.

**Import:**

```typescript
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
```

**Usage:**

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // Tool definitions
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Tool execution logic
});
```

### 4. Zod Schema Integration

Zod provides runtime validation and TypeScript type inference.

**Import:**

```typescript
import { z } from 'zod';
```

**Schema Definition:**

```typescript
export const CreateIssueSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue description'),
  labels: z.array(z.string()).optional().describe('Labels to add'),
});

// Infer TypeScript type from schema
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
```

**Validation:**

```typescript
// Parse and validate
const input = CreateIssueSchema.parse(args);

// Safe parse (returns result object)
const result = CreateIssueSchema.safeParse(args);
if (!result.success) {
  throw new Error(`Invalid input: ${result.error.message}`);
}
```

---

## Creating a Basic Server

### Minimal Working Example

This example creates a functional MCP server with a single tool.

```typescript
// src/index.ts
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Create server instance
const server = new Server(
  {
    name: 'example-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool schema
const EchoInputSchema = z.object({
  message: z.string().describe('Message to echo back'),
});

// Register tools/list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'echo',
      description: 'Echo a message back',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Message to echo back',
          },
        },
        required: ['message'],
      },
    },
  ],
}));

// Register tools/call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'echo') {
    const input = EchoInputSchema.parse(args);

    return {
      content: [
        {
          type: 'text',
          text: `Echo: ${input.message}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Connect to stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Example MCP server running on stdio');
```

**Build and Run:**

```bash
# Build TypeScript
npm run build

# Run server
node build/index.js

# Or use npm start
npm start
```

---

## Tool Definition with Zod Schemas

### Schema Design Patterns

**Basic Schema:**

```typescript
import { z } from 'zod';

export const CreateIssueSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue description'),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
```

**Advanced Validation:**

```typescript
export const SearchSchema = z.object({
  query: z.string()
    .min(3, 'Query must be at least 3 characters')
    .max(256, 'Query too long')
    .describe('Search query'),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('Maximum results to return'),
  sort: z.enum(['created', 'updated', 'relevance'])
    .default('relevance')
    .describe('Sort order'),
});
```

**Nested Objects:**

```typescript
export const UpdateUserSchema = z.object({
  userId: z.string().describe('User ID'),
  profile: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    bio: z.string().max(500).optional(),
  }).optional().describe('Profile fields to update'),
  settings: z.object({
    notifications: z.boolean().optional(),
    theme: z.enum(['light', 'dark']).optional(),
  }).optional().describe('User settings'),
});
```

**Union Types:**

```typescript
export const NotificationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  }),
  z.object({
    type: z.literal('slack'),
    channel: z.string(),
    message: z.string(),
  }),
]);
```

### Converting Zod to JSON Schema

MCP requires JSON Schema format for tool input schemas. Use `zodToJsonSchema`:

```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';

const CreateIssueSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
});

// Convert to JSON Schema
const jsonSchema = zodToJsonSchema(CreateIssueSchema);

// Use in tool definition
{
  name: 'create_issue',
  description: 'Create a new issue',
  inputSchema: jsonSchema,
}
```

**Or manually construct JSON Schema:**

```typescript
{
  name: 'create_issue',
  description: 'Create a new issue',
  inputSchema: {
    type: 'object',
    properties: {
      repository: {
        type: 'string',
        description: 'Repository in format owner/repo',
      },
      title: {
        type: 'string',
        description: 'Issue title',
      },
    },
    required: ['repository', 'title'],
  },
}
```

---

## Request Handlers

### Tools Handler

**List Tools:**

```typescript
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'github_create_issue',
      description: 'Create a new issue in a GitHub repository',
      inputSchema: {
        type: 'object',
        properties: {
          repository: {
            type: 'string',
            description: 'Repository in format owner/repo',
          },
          title: {
            type: 'string',
            description: 'Issue title',
          },
          body: {
            type: 'string',
            description: 'Issue description',
          },
        },
        required: ['repository', 'title'],
      },
    },
    {
      name: 'github_list_issues',
      description: 'List issues in a GitHub repository',
      inputSchema: {
        type: 'object',
        properties: {
          repository: {
            type: 'string',
            description: 'Repository in format owner/repo',
          },
          state: {
            type: 'string',
            enum: ['open', 'closed', 'all'],
            description: 'Issue state filter',
          },
        },
        required: ['repository'],
      },
    },
  ],
}));
```

**Call Tool:**

```typescript
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'github_create_issue':
      return await handleCreateIssue(args);

    case 'github_list_issues':
      return await handleListIssues(args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function handleCreateIssue(args: unknown) {
  // Validate input
  const input = CreateIssueSchema.parse(args);

  // Execute logic
  const issue = await apiClient.createIssue(input);

  // Return response
  return {
    content: [
      {
        type: 'text',
        text: `Created issue #${issue.number}: ${issue.title}`,
      },
      {
        type: 'resource',
        resource: {
          uri: `github://issues/${issue.id}`,
          mimeType: 'application/json',
          text: JSON.stringify(issue, null, 2),
        },
      },
    ],
  };
}
```

### Resources Handler

**List Resources:**

```typescript
import { ListResourcesRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'file:///workspace/README.md',
      name: 'README.md',
      description: 'Project README file',
      mimeType: 'text/markdown',
    },
    {
      uri: 'file:///workspace/package.json',
      name: 'package.json',
      description: 'Package configuration',
      mimeType: 'application/json',
    },
  ],
}));
```

**Read Resource:**

```typescript
import { ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  // Parse file path from URI
  const filePath = uri.replace('file://', '');

  // Read file
  const content = await fs.readFile(filePath, 'utf-8');

  return {
    contents: [
      {
        uri,
        mimeType: 'text/plain',
        text: content,
      },
    ],
  };
});
```

### Prompts Handler

**List Prompts:**

```typescript
import { ListPromptsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'code-review',
      description: 'Review code for quality and best practices',
      arguments: [
        {
          name: 'language',
          description: 'Programming language',
          required: true,
        },
        {
          name: 'focus',
          description: 'Review focus area',
          required: false,
        },
      ],
    },
  ],
}));
```

**Get Prompt:**

```typescript
import { GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'code-review') {
    const language = args?.language || 'JavaScript';
    const focus = args?.focus || 'general';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review the following ${language} code with focus on ${focus}.
            Provide constructive feedback on:
            - Code quality and readability
            - Best practices compliance
            - Potential bugs or issues
            - Performance considerations`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});
```

---

## Transport Implementations

### Stdio Transport (Local Servers)

**Complete Example:**

```typescript
// src/index.ts
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'local-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handlers...

// Start stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is for MCP messages)
  console.error('MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

**Build for Distribution:**

```json
{
  "bin": {
    "my-server": "./build/index.js"
  }
}
```

**Publish to npm:**

```bash
npm run build
npm publish
```

**Usage:**

```bash
npx my-server
```

### HTTP/SSE Transport (Remote Servers)

**Complete Example with Express:**

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Create MCP server
const mcpServer = new Server(
  {
    name: 'remote-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handlers...

// MCP endpoint
app.post('/mcp', async (req, res) => {
  const transport = new SSEServerTransport('/mcp/sse', res);
  await mcpServer.connect(transport);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`MCP server listening on http://localhost:${port}`);
});
```

**With Authentication:**

```typescript
import express from 'express';

const app = express();

// Authentication middleware
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

// Protected MCP endpoint
app.post('/mcp', authenticate, async (req, res) => {
  const transport = new SSEServerTransport('/mcp/sse', res);
  await mcpServer.connect(transport);
});
```

---

## Complete TypeScript Server Example

### GitHub Issues MCP Server

This complete example demonstrates best practices for building production-ready MCP servers.

**Project Structure:**

```
github-mcp-server/
├── src/
│   ├── index.ts
│   ├── client.ts
│   ├── tools/
│   │   ├── create-issue.ts
│   │   ├── list-issues.ts
│   │   └── index.ts
│   ├── schemas/
│   │   └── types.ts
│   └── utils/
│       └── errors.ts
├── package.json
├── tsconfig.json
└── README.md
```

**src/schemas/types.ts:**

```typescript
import { z } from 'zod';

export const CreateIssueSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue description'),
  labels: z.array(z.string()).optional().describe('Labels to add'),
  assignees: z.array(z.string()).optional().describe('Users to assign'),
});

export const ListIssuesSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  state: z.enum(['open', 'closed', 'all']).default('open'),
  limit: z.number().int().min(1).max(100).default(30),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type ListIssuesInput = z.infer<typeof ListIssuesSchema>;
```

**src/utils/errors.ts:**

```typescript
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }

  toActionableMessage(): string {
    switch (this.statusCode) {
      case 401:
        return 'Authentication failed. Check your GITHUB_TOKEN environment variable.';
      case 403:
        return 'Permission denied. Ensure your token has required permissions.';
      case 404:
        return 'Resource not found. Verify the repository path.';
      case 422:
        return 'Invalid request. Check the input parameters.';
      default:
        return `GitHub API error: ${this.message}`;
    }
  }
}
```

**src/client.ts:**

```typescript
import { GitHubAPIError } from './utils/errors.js';

export class GitHubClient {
  private baseUrl = 'https://api.github.com';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new GitHubAPIError(
        error.message || response.statusText,
        response.status,
        error
      );
    }

    return response.json();
  }
}
```

**src/tools/create-issue.ts:**

```typescript
import { GitHubClient } from '../client.js';
import { CreateIssueSchema, CreateIssueInput } from '../schemas/types.js';
import { GitHubAPIError } from '../utils/errors.js';

export const createIssueTool = {
  name: 'github_create_issue',
  description: 'Create a new issue in a GitHub repository',
  inputSchema: {
    type: 'object',
    properties: {
      repository: {
        type: 'string',
        description: 'Repository in format owner/repo',
      },
      title: {
        type: 'string',
        description: 'Issue title',
      },
      body: {
        type: 'string',
        description: 'Issue description',
      },
      labels: {
        type: 'array',
        items: { type: 'string' },
        description: 'Labels to add',
      },
      assignees: {
        type: 'array',
        items: { type: 'string' },
        description: 'Users to assign',
      },
    },
    required: ['repository', 'title'],
  },
};

export async function createIssue(client: GitHubClient, args: unknown) {
  try {
    // Validate input
    const input: CreateIssueInput = CreateIssueSchema.parse(args);

    // Parse repository
    const [owner, repo] = input.repository.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    // Create issue
    const issue = await client.request<any>(
      `/repos/${owner}/${repo}/issues`,
      {
        method: 'POST',
        body: JSON.stringify({
          title: input.title,
          body: input.body,
          labels: input.labels,
          assignees: input.assignees,
        }),
      }
    );

    // Return response
    return {
      content: [
        {
          type: 'text',
          text: `Created issue #${issue.number}: ${issue.title}\nURL: ${issue.html_url}`,
        },
        {
          type: 'resource',
          resource: {
            uri: `github://issues/${issue.id}`,
            mimeType: 'application/json',
            text: JSON.stringify(issue, null, 2),
          },
        },
      ],
    };
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
}
```

**src/tools/list-issues.ts:**

```typescript
import { GitHubClient } from '../client.js';
import { ListIssuesSchema, ListIssuesInput } from '../schemas/types.js';
import { GitHubAPIError } from '../utils/errors.js';

export const listIssuesTool = {
  name: 'github_list_issues',
  description: 'List issues in a GitHub repository',
  inputSchema: {
    type: 'object',
    properties: {
      repository: {
        type: 'string',
        description: 'Repository in format owner/repo',
      },
      state: {
        type: 'string',
        enum: ['open', 'closed', 'all'],
        description: 'Issue state filter',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of issues to return',
        minimum: 1,
        maximum: 100,
      },
    },
    required: ['repository'],
  },
};

export async function listIssues(client: GitHubClient, args: unknown) {
  try {
    // Validate input
    const input: ListIssuesInput = ListIssuesSchema.parse(args);

    // Parse repository
    const [owner, repo] = input.repository.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    // List issues
    const issues = await client.request<any[]>(
      `/repos/${owner}/${repo}/issues?state=${input.state}&per_page=${input.limit}`
    );

    // Format response
    const issueList = issues
      .map(i => `#${i.number}: ${i.title} (${i.state})`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${issues.length} ${input.state} issues in ${input.repository}:\n\n${issueList}`,
        },
        {
          type: 'resource',
          resource: {
            uri: `github://issues?repo=${input.repository}`,
            mimeType: 'application/json',
            text: JSON.stringify(issues, null, 2),
          },
        },
      ],
    };
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
}
```

**src/tools/index.ts:**

```typescript
export * from './create-issue.js';
export * from './list-issues.js';
```

**src/index.ts:**

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { GitHubClient } from './client.js';
import {
  createIssueTool,
  createIssue,
  listIssuesTool,
  listIssues,
} from './tools/index.js';

// Validate environment
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

// Create GitHub client
const githubClient = new GitHubClient(token);

// Create MCP server
const server = new Server(
  {
    name: 'github-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools/list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    createIssueTool,
    listIssuesTool,
  ],
}));

// Register tools/call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'github_create_issue':
      return await createIssue(githubClient, args);

    case 'github_list_issues':
      return await listIssues(githubClient, args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('GitHub MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

**package.json:**

```json
{
  "name": "github-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "./build/index.js",
  "bin": {
    "github-mcp-server": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "start": "node build/index.js",
    "dev": "tsc && node build/index.js"
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

**Build and Run:**

```bash
# Install dependencies
npm install

# Build project
npm run build

# Set GitHub token
export GITHUB_TOKEN="your_github_token"

# Run server
npm start
```

---

## Best Practices and Patterns

### 1. Error Handling

**Custom Error Classes:**

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }

  toActionableMessage(): string {
    // Provide user-friendly error messages
    switch (this.statusCode) {
      case 401:
        return 'Authentication failed. Check your API credentials.';
      case 429:
        return 'Rate limit exceeded. Please wait before retrying.';
      default:
        return `API error: ${this.message}`;
    }
  }
}
```

**Error Handling in Tools:**

```typescript
export async function handleTool(args: unknown) {
  try {
    // Validate input
    const input = InputSchema.parse(args);

    // Execute logic
    const result = await performAction(input);

    return {
      content: [
        {
          type: 'text',
          text: formatSuccess(result),
        },
      ],
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
}
```

### 2. Input Validation

**Always Validate:**

```typescript
// Good - validate with schema
const input = CreateIssueSchema.parse(args);

// Bad - trust input without validation
const input = args as CreateIssueInput;
```

**Custom Validation:**

```typescript
const RepositorySchema = z.string()
  .describe('Repository in format owner/repo')
  .refine(
    (val) => val.includes('/') && val.split('/').length === 2,
    'Repository must be in format owner/repo'
  );
```

### 3. Response Formatting

**Include Both Text and Structured Data:**

```typescript
return {
  content: [
    // Human-readable text
    {
      type: 'text',
      text: `Created issue #${issue.number}`,
    },
    // Structured data
    {
      type: 'resource',
      resource: {
        uri: `github://issues/${issue.id}`,
        mimeType: 'application/json',
        text: JSON.stringify(issue, null, 2),
      },
    },
  ],
};
```

### 4. Environment Variables

**Validate at Startup:**

```typescript
const requiredEnvVars = ['GITHUB_TOKEN', 'API_URL'];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} environment variable is required`);
    process.exit(1);
  }
}
```

**Use .env for Development:**

```bash
# .env.example
GITHUB_TOKEN=your_github_token_here
API_URL=https://api.github.com
```

### 5. Logging

**Log to stderr (stdout is for MCP messages):**

```typescript
// Good - log to stderr
console.error('Server started');
console.error('Processing request:', request.params.name);

// Bad - log to stdout (interferes with MCP protocol)
console.log('Server started'); // Don't do this!
```

### 6. Type Safety

**Leverage TypeScript:**

```typescript
// Define types for all data
interface Issue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
}

// Use types in function signatures
async function fetchIssue(id: number): Promise<Issue> {
  // Implementation
}

// Avoid 'any' type
async function badFetch(id: number): Promise<any> {
  // Avoid this
}
```

### 7. Tool Organization

**Separate Concerns:**

- Keep tool definitions separate from implementation
- Use one file per tool for larger servers
- Export tools from index file

```typescript
// tools/index.ts
export * from './create-issue.js';
export * from './list-issues.js';
export * from './update-issue.js';
```

### 8. Testing

**Unit Test Schemas:**

```typescript
import { describe, it, expect } from 'vitest';
import { CreateIssueSchema } from './schemas/types.js';

describe('CreateIssueSchema', () => {
  it('validates correct input', () => {
    const result = CreateIssueSchema.safeParse({
      repository: 'owner/repo',
      title: 'Test issue',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid input', () => {
    const result = CreateIssueSchema.safeParse({
      title: 'Missing repository',
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Next Steps

Now that you understand the TypeScript SDK:

1. **Build your server**: Start with a simple tool and expand
2. **Test with MCP Inspector**: Validate your implementation
3. **Add error handling**: Make tools robust and user-friendly
4. **Deploy**: Choose stdio or HTTP transport based on needs
5. **Publish**: Share your server with the community

## Related Documentation

- [Getting Started](../03-creating-servers/getting-started.md) - Server development workflow
- [Tools and Schemas](../03-creating-servers/tools-and-schemas.md) - Tool design patterns
- [Best Practices](../03-creating-servers/best-practices.md) - Production-ready patterns
- [Python SDK](./python-sdk.md) - Alternative SDK implementation

---

**Last Updated:** February 2026
**SDK Version:** 0.6.0+
