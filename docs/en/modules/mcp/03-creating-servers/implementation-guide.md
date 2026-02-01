# Implementation Guide: Building MCP Servers

This guide covers Phase 2 of MCP server development: implementing the core functionality, utilities, tools, and server setup. After completing the research and planning phase, you're ready to write code.

## Overview

In this phase, you'll:
- Set up your project structure
- Create shared utilities for API communication
- Implement robust error handling
- Build pagination helpers
- Create tools with proper schemas
- Set up the server entry point with transport options
- Configure request handlers

**Time estimate:** 4-8 hours for a basic server with 5-10 tools

## Prerequisites

Before starting implementation:
- Completed Phase 1: Research & Planning
- Chosen your language (TypeScript recommended)
- Reviewed target API documentation
- Prioritized API coverage approach

## Step 1: Project Structure Setup

A well-organized project structure makes maintenance easier and code more navigable.

### TypeScript Project Structure

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

### Python Project Structure

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

### Initial Setup Commands

**TypeScript:**
```bash
# Create project directory
mkdir my-mcp-server
cd my-mcp-server

# Initialize npm project
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod

# Install dev dependencies
npm install -D typescript @types/node tsx

# Initialize TypeScript config
npx tsc --init
```

**Update package.json:**
```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

**Update tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Python:**
```bash
# Create project directory
mkdir my_mcp_server
cd my_mcp_server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install mcp pydantic httpx
```

**Create pyproject.toml:**
```toml
[project]
name = "my-mcp-server"
version = "1.0.0"
requires-python = ">=3.10"
dependencies = [
    "mcp>=1.0.0",
    "pydantic>=2.0.0",
    "httpx>=0.27.0"
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### Create Directory Structure

```bash
# TypeScript
mkdir -p src/{tools,schemas,utils}
touch src/{index.ts,client.ts}
touch src/tools/{create.ts,read.ts,update.ts,delete.ts}
touch src/schemas/types.ts
touch src/utils/{errors.ts,pagination.ts}
touch .env.example

# Python
mkdir -p src/{tools,schemas,utils}
touch src/__init__.py
touch src/{server.py,client.py}
touch src/tools/{__init__.py,create.py,read.py,update.py,delete.py}
touch src/schemas/{__init__.py,types.py}
touch src/utils/{__init__.py,errors.py,pagination.py}
touch .env.example
```

## Step 2: Create API Client Wrapper

A centralized API client simplifies authentication, request formatting, and error handling across all tools.

### TypeScript Implementation

**File: `src/client.ts`**

```typescript
export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export class APIClient {
  private baseUrl: string;
  private apiKey: string;
  private headers: Record<string, string>;

  constructor(
    apiKey: string,
    baseUrl: string,
    additionalHeaders: Record<string, string> = {}
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };
  }

  /**
   * Make an HTTP request to the API
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // Build URL with query parameters
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Merge headers
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      ...this.headers,
      ...options.headers,
    };

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
      });

      // Handle error responses
      if (!response.ok) {
        const errorBody = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorBody);
        } catch {
          errorData = { message: errorBody };
        }

        throw new APIError(
          errorData.message || `API request failed: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Re-throw APIError as-is
      if (error instanceof APIError) {
        throw error;
      }

      // Wrap other errors
      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * PATCH request helper
   */
  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Import from errors.ts (shown in next section)
import { APIError } from './utils/errors.js';
```

### Python Implementation

**File: `src/client.py`**

```python
import httpx
from typing import Any, Dict, Optional
from .utils.errors import APIError


class APIClient:
    """HTTP client wrapper for API requests with authentication."""

    def __init__(
        self,
        api_key: str,
        base_url: str,
        additional_headers: Optional[Dict[str, str]] = None
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.headers = {
            'Content-Type': 'application/json',
            **(additional_headers or {})
        }

    async def request(
        self,
        endpoint: str,
        method: str = 'GET',
        params: Optional[Dict[str, str]] = None,
        json: Optional[Dict[str, Any]] = None
    ) -> Any:
        """Make an HTTP request to the API."""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            **self.headers
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method=method,
                    url=url,
                    params=params,
                    json=json,
                    headers=headers,
                    timeout=30.0
                )

                # Handle error responses
                if not response.is_success:
                    try:
                        error_data = response.json()
                        message = error_data.get('message', response.text)
                    except Exception:
                        message = response.text

                    raise APIError(
                        message=message or f"API request failed: {response.status_code}",
                        status_code=response.status_code,
                        response=error_data if 'error_data' in locals() else None
                    )

                # Parse JSON response
                return response.json()

        except httpx.RequestError as error:
            raise APIError(
                message=f"Network error: {str(error)}",
                status_code=0
            )

    async def get(self, endpoint: str, params: Optional[Dict[str, str]] = None) -> Any:
        """GET request helper."""
        return await self.request(endpoint, method='GET', params=params)

    async def post(self, endpoint: str, json: Dict[str, Any]) -> Any:
        """POST request helper."""
        return await self.request(endpoint, method='POST', json=json)

    async def put(self, endpoint: str, json: Dict[str, Any]) -> Any:
        """PUT request helper."""
        return await self.request(endpoint, method='PUT', json=json)

    async def patch(self, endpoint: str, json: Dict[str, Any]) -> Any:
        """PATCH request helper."""
        return await self.request(endpoint, method='PATCH', json=json)

    async def delete(self, endpoint: str) -> Any:
        """DELETE request helper."""
        return await self.request(endpoint, method='DELETE')
```

### Usage Examples

**TypeScript:**
```typescript
import { APIClient } from './client.js';

const client = new APIClient(
  process.env.API_KEY!,
  'https://api.example.com'
);

// GET request
const issues = await client.get('/repos/owner/repo/issues', {
  state: 'open',
  per_page: '100'
});

// POST request
const newIssue = await client.post('/repos/owner/repo/issues', {
  title: 'Bug report',
  body: 'Description here'
});
```

**Python:**
```python
from .client import APIClient
import os

client = APIClient(
    api_key=os.getenv('API_KEY'),
    base_url='https://api.example.com'
)

# GET request
issues = await client.get('/repos/owner/repo/issues', params={
    'state': 'open',
    'per_page': '100'
})

# POST request
new_issue = await client.post('/repos/owner/repo/issues', json={
    'title': 'Bug report',
    'body': 'Description here'
})
```

## Step 3: Error Handling Utilities

Proper error handling transforms cryptic API errors into actionable messages for users.

### TypeScript Implementation

**File: `src/utils/errors.ts`**

```typescript
/**
 * Custom error class for API errors with status codes
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  /**
   * Convert error to actionable message for users
   */
  toActionableMessage(): string {
    switch (this.statusCode) {
      case 400:
        return `Bad request: ${this.message}. Check your input parameters.`;
      case 401:
        return 'Authentication failed. Check your API key in environment variables.';
      case 403:
        return 'Permission denied. Ensure your API key has required permissions.';
      case 404:
        return `Resource not found: ${this.message}. Verify the ID or endpoint.`;
      case 422:
        return `Validation error: ${this.message}. Check required fields and formats.`;
      case 429:
        return 'Rate limit exceeded. Wait before retrying or reduce request frequency.';
      case 500:
        return `Server error: ${this.message}. Try again later.`;
      case 502:
        return 'Bad gateway. The API server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. The API is undergoing maintenance.';
      default:
        if (this.statusCode >= 500) {
          return `Server error (${this.statusCode}): ${this.message}`;
        }
        return `API error (${this.statusCode}): ${this.message}`;
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    // Retry on rate limits and server errors
    return this.statusCode === 429 || this.statusCode >= 500;
  }
}

/**
 * Validation error for input parameters
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Retry helper with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Only retry on retryable errors
      if (error instanceof APIError && !error.isRetryable()) {
        throw error;
      }

      // Don't wait on last attempt
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

### Python Implementation

**File: `src/utils/errors.py`**

```python
import asyncio
from typing import Optional, Callable, TypeVar, Any


class APIError(Exception):
    """Custom error class for API errors with status codes."""

    def __init__(
        self,
        message: str,
        status_code: int,
        response: Optional[Any] = None
    ):
        super().__init__(message)
        self.status_code = status_code
        self.response = response

    def to_actionable_message(self) -> str:
        """Convert error to actionable message for users."""
        status_messages = {
            400: f"Bad request: {self}. Check your input parameters.",
            401: "Authentication failed. Check your API key in environment variables.",
            403: "Permission denied. Ensure your API key has required permissions.",
            404: f"Resource not found: {self}. Verify the ID or endpoint.",
            422: f"Validation error: {self}. Check required fields and formats.",
            429: "Rate limit exceeded. Wait before retrying or reduce request frequency.",
            500: f"Server error: {self}. Try again later.",
            502: "Bad gateway. The API server is temporarily unavailable.",
            503: "Service unavailable. The API is undergoing maintenance.",
        }

        if self.status_code in status_messages:
            return status_messages[self.status_code]

        if self.status_code >= 500:
            return f"Server error ({self.status_code}): {self}"

        return f"API error ({self.status_code}): {self}"

    def is_retryable(self) -> bool:
        """Check if error is retryable."""
        return self.status_code == 429 or self.status_code >= 500


class ValidationError(Exception):
    """Validation error for input parameters."""

    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message)
        self.field = field


T = TypeVar('T')


async def retry_with_backoff(
    fn: Callable[[], Any],
    max_retries: int = 3,
    base_delay: float = 1.0
) -> T:
    """Retry helper with exponential backoff."""
    last_error: Optional[Exception] = None

    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as error:
            last_error = error

            # Only retry on retryable errors
            if isinstance(error, APIError) and not error.is_retryable():
                raise error

            # Don't wait on last attempt
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)
                await asyncio.sleep(delay)

    raise last_error
```

### Usage Examples

**TypeScript:**
```typescript
import { APIError, retryWithBackoff } from './utils/errors.js';

try {
  const result = await client.get('/endpoint');
} catch (error) {
  if (error instanceof APIError) {
    // Show actionable message to user
    console.error(error.toActionableMessage());

    // Check if retryable
    if (error.isRetryable()) {
      const result = await retryWithBackoff(() => client.get('/endpoint'));
    }
  }
  throw error;
}
```

**Python:**
```python
from .utils.errors import APIError, retry_with_backoff

try:
    result = await client.get('/endpoint')
except APIError as error:
    # Show actionable message to user
    print(error.to_actionable_message())

    # Check if retryable
    if error.is_retryable():
        result = await retry_with_backoff(lambda: client.get('/endpoint'))
```

## Step 4: Pagination Helpers

Many APIs paginate results. A reusable pagination utility simplifies fetching all data.

### TypeScript Implementation

**File: `src/utils/pagination.ts`**

```typescript
import { APIClient } from '../client.js';

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  nextPage?: number;
  total?: number;
}

/**
 * Cursor-based pagination generator
 */
export async function* paginateCursor<T>(
  client: APIClient,
  endpoint: string,
  pageSize: number = 100,
  maxItems?: number
): AsyncGenerator<T> {
  let cursor: string | undefined;
  let itemCount = 0;

  do {
    const params: Record<string, string> = {
      limit: pageSize.toString(),
    };

    if (cursor) {
      params.cursor = cursor;
    }

    const response: PaginatedResponse<T> = await client.get(endpoint, params);

    for (const item of response.data) {
      yield item;
      itemCount++;

      if (maxItems && itemCount >= maxItems) {
        return;
      }
    }

    cursor = response.nextCursor;
  } while (cursor);
}

/**
 * Page-based pagination generator
 */
export async function* paginatePages<T>(
  client: APIClient,
  endpoint: string,
  pageSize: number = 100,
  maxItems?: number
): AsyncGenerator<T> {
  let page = 1;
  let itemCount = 0;

  while (true) {
    const params: Record<string, string> = {
      page: page.toString(),
      per_page: pageSize.toString(),
    };

    const response: PaginatedResponse<T> = await client.get(endpoint, params);

    if (response.data.length === 0) {
      break;
    }

    for (const item of response.data) {
      yield item;
      itemCount++;

      if (maxItems && itemCount >= maxItems) {
        return;
      }
    }

    if (!response.hasMore) {
      break;
    }

    page++;
  }
}

/**
 * Collect all paginated results into an array
 */
export async function collectAll<T>(
  generator: AsyncGenerator<T>,
  maxItems?: number
): Promise<T[]> {
  const results: T[] = [];

  for await (const item of generator) {
    results.push(item);

    if (maxItems && results.length >= maxItems) {
      break;
    }
  }

  return results;
}
```

### Python Implementation

**File: `src/utils/pagination.py`**

```python
from typing import AsyncGenerator, List, Optional, TypeVar, Dict, Any
from .client import APIClient

T = TypeVar('T')


class PaginatedResponse:
    """Response wrapper for paginated data."""

    def __init__(self, data: List[Any], has_more: bool = False,
                 next_cursor: Optional[str] = None,
                 next_page: Optional[int] = None,
                 total: Optional[int] = None):
        self.data = data
        self.has_more = has_more
        self.next_cursor = next_cursor
        self.next_page = next_page
        self.total = total


async def paginate_cursor(
    client: APIClient,
    endpoint: str,
    page_size: int = 100,
    max_items: Optional[int] = None
) -> AsyncGenerator[T, None]:
    """Cursor-based pagination generator."""
    cursor: Optional[str] = None
    item_count = 0

    while True:
        params: Dict[str, str] = {'limit': str(page_size)}

        if cursor:
            params['cursor'] = cursor

        response_data = await client.get(endpoint, params=params)

        # Adapt to your API's response format
        data = response_data.get('data', [])
        cursor = response_data.get('next_cursor')
        has_more = response_data.get('has_more', False)

        for item in data:
            yield item
            item_count += 1

            if max_items and item_count >= max_items:
                return

        if not cursor or not has_more:
            break


async def paginate_pages(
    client: APIClient,
    endpoint: str,
    page_size: int = 100,
    max_items: Optional[int] = None
) -> AsyncGenerator[T, None]:
    """Page-based pagination generator."""
    page = 1
    item_count = 0

    while True:
        params: Dict[str, str] = {
            'page': str(page),
            'per_page': str(page_size)
        }

        response_data = await client.get(endpoint, params=params)

        # Adapt to your API's response format
        data = response_data.get('data', [])

        if not data:
            break

        for item in data:
            yield item
            item_count += 1

            if max_items and item_count >= max_items:
                return

        has_more = response_data.get('has_more', False)
        if not has_more:
            break

        page += 1


async def collect_all(
    generator: AsyncGenerator[T, None],
    max_items: Optional[int] = None
) -> List[T]:
    """Collect all paginated results into a list."""
    results: List[T] = []

    async for item in generator:
        results.append(item)

        if max_items and len(results) >= max_items:
            break

    return results
```

### Usage Examples

**TypeScript:**
```typescript
import { paginateCursor, collectAll } from './utils/pagination.js';

// Stream results one by one
for await (const issue of paginateCursor(client, '/repos/owner/repo/issues')) {
  console.log(`Issue #${issue.number}: ${issue.title}`);
}

// Collect all results (be careful with large datasets)
const allIssues = await collectAll(
  paginateCursor(client, '/repos/owner/repo/issues'),
  500  // Max 500 items
);
```

**Python:**
```python
from .utils.pagination import paginate_cursor, collect_all

# Stream results one by one
async for issue in paginate_cursor(client, '/repos/owner/repo/issues'):
    print(f"Issue #{issue['number']}: {issue['title']}")

# Collect all results (be careful with large datasets)
all_issues = await collect_all(
    paginate_cursor(client, '/repos/owner/repo/issues'),
    max_items=500  # Max 500 items
)
```

## Step 5: Server Entry Point

The server entry point initializes the MCP server, sets up transport, and registers request handlers.

### TypeScript Implementation (stdio)

**File: `src/index.ts`**

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { APIClient } from './client.js';
import { createIssueTool, createIssue } from './tools/create.js';
import { listIssuesTool, listIssues } from './tools/read.js';
import { APIError } from './utils/errors.js';

// Validate environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('Error: API_KEY environment variable is required');
  process.exit(1);
}

// Initialize API client
const client = new APIClient(API_KEY, 'https://api.example.com');

// Create MCP server
const server = new Server(
  {
    name: 'example-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      createIssueTool,
      listIssuesTool,
      // Add more tools here
    ],
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'github_create_issue':
        return await createIssue(client, args);

      case 'github_list_issues':
        return await listIssues(client, args);

      // Add more tool cases here

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Transform errors to user-friendly messages
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
});

// Error handler
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

// Process error handler
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Example MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
```

### TypeScript Implementation (HTTP with SSE)

**File: `src/index.ts`**

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { APIClient } from './client.js';

const app = express();
app.use(express.json());

// Initialize API client
const API_KEY = process.env.API_KEY!;
const client = new APIClient(API_KEY, 'https://api.example.com');

// Create MCP server
const server = new Server(
  {
    name: 'example-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handlers (same as stdio version)
// ... tool registration code ...

// SSE endpoint for MCP communication
app.post('/mcp', async (req, res) => {
  console.log('Client connected via SSE');

  const transport = new SSEServerTransport('/mcp/sse', res);
  await server.connect(transport);

  // Keep connection alive
  req.on('close', () => {
    console.log('Client disconnected');
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'example-mcp-server' });
});

// Start HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server listening on http://localhost:${PORT}`);
  console.log(`Connect via: http://localhost:${PORT}/mcp`);
});
```

### Python Implementation (stdio)

**File: `src/server.py`**

```python
#!/usr/bin/env python3
import asyncio
import os
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from .client import APIClient
from .tools.create import create_issue_tool, create_issue
from .tools.read import list_issues_tool, list_issues
from .utils.errors import APIError

# Validate environment variables
API_KEY = os.getenv('API_KEY')
if not API_KEY:
    raise ValueError('API_KEY environment variable is required')

# Initialize API client
client = APIClient(api_key=API_KEY, base_url='https://api.example.com')

# Create MCP server
app = Server('example-mcp-server')


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        create_issue_tool,
        list_issues_tool,
        # Add more tools here
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    try:
        if name == 'github_create_issue':
            return await create_issue(client, arguments)

        elif name == 'github_list_issues':
            return await list_issues(client, arguments)

        # Add more tool cases here

        else:
            raise ValueError(f'Unknown tool: {name}')

    except APIError as error:
        # Transform to user-friendly message
        raise ValueError(error.to_actionable_message())


async def main():
    """Run the server using stdio transport."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == '__main__':
    asyncio.run(main())
```

### Python Implementation (HTTP)

**File: `src/server.py`**

```python
from mcp.server import Server
from mcp.server.sse import sse_server
from starlette.applications import Starlette
from starlette.routing import Route
import uvicorn

from .client import APIClient
import os

# Initialize API client
API_KEY = os.getenv('API_KEY')
client = APIClient(api_key=API_KEY, base_url='https://api.example.com')

# Create MCP server
app = Server('example-mcp-server')

# Register handlers (same as stdio version)
# ... tool registration code ...

# Create web app
async def handle_sse(request):
    """Handle SSE connections for MCP."""
    async with sse_server() as streams:
        await app.run(
            streams[0],
            streams[1],
            app.create_initialization_options()
        )

async def health(request):
    """Health check endpoint."""
    return JSONResponse({
        'status': 'ok',
        'server': 'example-mcp-server'
    })

web_app = Starlette(
    routes=[
        Route('/mcp', handle_sse, methods=['POST']),
        Route('/health', health),
    ]
)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    uvicorn.run(web_app, host='0.0.0.0', port=port)
```

## Step 6: Request Handlers

Request handlers respond to MCP protocol messages. The two primary handlers are `tools/list` and `tools/call`.

### Tools List Handler

Returns metadata about all available tools.

**TypeScript:**
```typescript
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
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
      // More tools...
    ],
  };
});
```

**Python:**
```python
from mcp.types import Tool

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name='github_create_issue',
            description='Create a new issue in a GitHub repository',
            inputSchema={
                'type': 'object',
                'properties': {
                    'repository': {
                        'type': 'string',
                        'description': 'Repository in format owner/repo',
                    },
                    'title': {
                        'type': 'string',
                        'description': 'Issue title',
                    },
                    'body': {
                        'type': 'string',
                        'description': 'Issue description',
                    },
                },
                'required': ['repository', 'title'],
            }
        ),
        # More tools...
    ]
```

### Tools Call Handler

Executes the requested tool with provided arguments.

**TypeScript:**
```typescript
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'github_create_issue':
        // Validate input
        const validatedInput = CreateIssueInputSchema.parse(args);
        return await createIssue(client, validatedInput);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${error.message}`);
    }
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
});
```

**Python:**
```python
from mcp.types import TextContent

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    try:
        if name == 'github_create_issue':
            # Validate input
            validated_input = CreateIssueInput(**arguments)
            return await create_issue(client, validated_input)

        else:
            raise ValueError(f'Unknown tool: {name}')

    except ValidationError as error:
        raise ValueError(f'Invalid input: {error}')
    except APIError as error:
        raise ValueError(error.to_actionable_message())
```

## Step 7: Server Initialization

Initialize the server with proper configuration and error handling.

### Configuration Options

**TypeScript:**
```typescript
const server = new Server(
  {
    name: 'example-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},  // If supporting resources
      prompts: {},    // If supporting prompts
    },
  }
);
```

**Python:**
```python
app = Server(
    name='example-mcp-server',
    version='1.0.0'
)
```

### Connection Setup

**TypeScript (stdio):**
```typescript
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for protocol)
  console.error('Server started successfully');
}
```

**Python (stdio):**
```python
async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )
```

## Testing Your Implementation

### Manual Testing with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Test TypeScript server
mcp-inspector npx tsx src/index.ts

# Test Python server
mcp-inspector python -m src.server
```

### Testing with curl (HTTP servers)

```bash
# Health check
curl http://localhost:3000/health

# List tools
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'

# Call a tool
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "github_create_issue",
      "arguments": {
        "repository": "owner/repo",
        "title": "Test issue"
      }
    }
  }'
```

## Common Patterns and Best Practices

### Pattern 1: Input Validation

Always validate inputs before making API calls:

```typescript
// TypeScript with Zod
const input = CreateIssueInputSchema.parse(args);

// Python with Pydantic
input = CreateIssueInput(**arguments)
```

### Pattern 2: Error Transformation

Convert technical errors to user-friendly messages:

```typescript
catch (error) {
  if (error instanceof APIError) {
    throw new Error(error.toActionableMessage());
  }
  throw error;
}
```

### Pattern 3: Response Formatting

Return both text and structured data:

```typescript
return {
  content: [
    {
      type: 'text',
      text: 'Created issue #123',
    },
    {
      type: 'resource',
      resource: {
        uri: 'github://issues/123',
        mimeType: 'application/json',
        text: JSON.stringify(issue, null, 2),
      },
    },
  ],
};
```

### Pattern 4: Graceful Shutdown

Handle process signals properly:

```typescript
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});
```

## Next Steps

After completing implementation:

1. **Code Review**: Check code quality, DRY principle, type coverage
2. **Testing**: Use MCP Inspector for comprehensive testing
3. **Documentation**: Add README with setup and usage instructions
4. **Evaluation**: Create test questions for validation

**Continue to**: [Testing Guide](./testing-guide.md) for comprehensive testing strategies.

## Summary

You've now implemented a complete MCP server with:
- Structured project organization
- Reusable API client wrapper
- Robust error handling with actionable messages
- Pagination utilities for large datasets
- Server entry point with stdio and HTTP options
- Request handlers for tools/list and tools/call
- Proper initialization and connection management

Your server is ready for testing and evaluation in Phase 3.
