# MCP Server Project Structure

A well-organized project structure is essential for building maintainable and scalable MCP servers. This guide covers the recommended directory organization, configuration files, and setup procedures for both TypeScript and Python MCP server projects.

## Overview

The structure of an MCP server project depends on your chosen language and the complexity of your implementation. However, both TypeScript and Python projects share common organizational principles:

- **Separation of concerns**: Tools, schemas, utilities, and client code are organized into distinct modules
- **Clear entry points**: A single server entry point that initializes and configures the MCP server
- **Configuration management**: Environment variables and build configurations are properly managed
- **Documentation**: README files and inline documentation for maintenance and onboarding

---

## TypeScript Project Structure

TypeScript is the recommended language for MCP servers due to its strong typing, excellent SDK support, and broad AI model familiarity.

### Complete Directory Tree

```
my-mcp-server/
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript compiler configuration
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore patterns
├── README.md                 # Project documentation
├── src/
│   ├── index.ts              # Server entry point and initialization
│   ├── client.ts             # API client wrapper
│   ├── config.ts             # Configuration management
│   ├── tools/                # Tool implementations
│   │   ├── index.ts          # Tool registry and exports
│   │   ├── create.ts         # Create operations
│   │   ├── read.ts           # Read operations
│   │   ├── update.ts         # Update operations
│   │   ├── delete.ts         # Delete operations
│   │   └── search.ts         # Search operations
│   ├── schemas/              # Type definitions and validation
│   │   ├── types.ts          # Zod schemas and TypeScript types
│   │   ├── requests.ts       # Request schemas
│   │   └── responses.ts      # Response schemas
│   ├── utils/                # Shared utilities
│   │   ├── errors.ts         # Error handling utilities
│   │   ├── validation.ts     # Input validation helpers
│   │   ├── pagination.ts     # Pagination utilities
│   │   └── logging.ts        # Logging utilities
│   └── types/                # TypeScript type declarations
│       └── index.d.ts        # Global type declarations
├── tests/                    # Test files (optional but recommended)
│   ├── tools/
│   │   └── create.test.ts
│   └── utils/
│       └── errors.test.ts
└── dist/                     # Compiled JavaScript (gitignored)
```

### Key Directories Explained

**`src/`** - All TypeScript source code
- Entry point (`index.ts`) initializes the MCP server
- API client wrapper encapsulates external API calls
- Configuration management centralizes settings

**`src/tools/`** - Tool implementations
- Each file represents a category of operations
- Tools are modular and independently testable
- `index.ts` exports all tools for registration

**`src/schemas/`** - Type safety and validation
- Zod schemas define input/output structures
- TypeScript types derived from schemas
- Ensures runtime validation matches compile-time types

**`src/utils/`** - Shared utilities
- Error handling and custom error classes
- Validation helpers for common patterns
- Pagination utilities for list operations
- Logging utilities for debugging

### Initial Setup

**Step 1: Initialize Project**

```bash
# Create project directory
mkdir my-mcp-server
cd my-mcp-server

# Initialize npm project
npm init -y
```

**Step 2: Install Dependencies**

```bash
# Core MCP SDK
npm install @modelcontextprotocol/sdk

# Zod for schema validation
npm install zod

# Additional utilities (optional)
npm install dotenv

# Development dependencies
npm install -D typescript @types/node tsx
```

**Step 3: Initialize TypeScript**

```bash
# Generate tsconfig.json
npx tsc --init
```

**Step 4: Create Directory Structure**

```bash
# Create source directories
mkdir -p src/{tools,schemas,utils,types}

# Create configuration files
touch src/index.ts src/client.ts src/config.ts
touch .env.example .gitignore README.md
```

### Configuration Files

**`package.json`**

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for [Service Name]",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "node --test",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["mcp", "mcp-server", "ai"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0"
  }
}
```

**Key Fields:**
- `"type": "module"` enables ES modules
- `scripts.dev` uses `tsx` for development with hot reload
- `scripts.build` compiles TypeScript to JavaScript
- Dependencies include MCP SDK and Zod

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
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
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Key Settings:**
- `target: "ES2022"` uses modern JavaScript features
- `module: "Node16"` enables Node.js ESM support
- `strict: true` enforces strict type checking
- `outDir: "./dist"` compiles to dist directory
- `declaration: true` generates type definitions

**`.env.example`**

```bash
# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your_api_key_here
API_VERSION=v1

# Server Configuration
SERVER_PORT=3000
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

**`.gitignore`**

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build output
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/
```

---

## Python Project Structure

Python is a solid alternative for MCP servers, especially if you're integrating with Python-based services or prefer Python's ecosystem.

### Complete Directory Tree

```
my_mcp_server/
├── pyproject.toml            # Project metadata and dependencies
├── setup.py                  # Setup script (optional)
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore patterns
├── README.md                 # Project documentation
├── src/
│   ├── __init__.py           # Package initialization
│   ├── server.py             # Server entry point
│   ├── client.py             # API client wrapper
│   ├── config.py             # Configuration management
│   ├── tools/                # Tool implementations
│   │   ├── __init__.py       # Tool registry and exports
│   │   ├── create.py         # Create operations
│   │   ├── read.py           # Read operations
│   │   ├── update.py         # Update operations
│   │   ├── delete.py         # Delete operations
│   │   └── search.py         # Search operations
│   ├── schemas/              # Type definitions and validation
│   │   ├── __init__.py
│   │   ├── types.py          # Pydantic models
│   │   ├── requests.py       # Request models
│   │   └── responses.py      # Response models
│   └── utils/                # Shared utilities
│       ├── __init__.py
│       ├── errors.py         # Error handling utilities
│       ├── validation.py     # Input validation helpers
│       ├── pagination.py     # Pagination utilities
│       └── logging.py        # Logging utilities
├── tests/                    # Test files (optional but recommended)
│   ├── __init__.py
│   ├── test_tools/
│   │   └── test_create.py
│   └── test_utils/
│       └── test_errors.py
└── venv/                     # Virtual environment (gitignored)
```

### Key Directories Explained

**`src/`** - All Python source code
- Package initialization and exports
- Server entry point (`server.py`) initializes MCP server
- API client wrapper for external services
- Configuration management with environment variables

**`src/tools/`** - Tool implementations
- Each module represents a category of operations
- Tools are modular and independently testable
- `__init__.py` exports all tools for registration

**`src/schemas/`** - Type safety and validation
- Pydantic models define data structures
- Request and response models separate concerns
- Automatic validation and serialization

**`src/utils/`** - Shared utilities
- Custom exception classes for error handling
- Validation helpers for common patterns
- Pagination utilities for list operations
- Logging configuration and utilities

### Initial Setup

**Step 1: Create Project Directory**

```bash
# Create project directory
mkdir my_mcp_server
cd my_mcp_server
```

**Step 2: Set Up Virtual Environment**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

**Step 3: Install Dependencies**

```bash
# Install MCP SDK and Pydantic
pip install mcp pydantic

# Install additional utilities (optional)
pip install python-dotenv httpx

# Install development dependencies
pip install black mypy pytest pytest-asyncio
```

**Step 4: Create Directory Structure**

```bash
# Create source directories
mkdir -p src/{tools,schemas,utils}

# Create __init__.py files
touch src/__init__.py
touch src/tools/__init__.py
touch src/schemas/__init__.py
touch src/utils/__init__.py

# Create configuration files
touch src/server.py src/client.py src/config.py
touch .env.example .gitignore README.md pyproject.toml
```

### Configuration Files

**`pyproject.toml`**

```toml
[project]
name = "my-mcp-server"
version = "1.0.0"
description = "MCP server for [Service Name]"
authors = [
    { name = "Your Name", email = "your.email@example.com" }
]
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "mcp>=1.0.0",
    "pydantic>=2.5.0",
    "python-dotenv>=1.0.0",
    "httpx>=0.26.0"
]
keywords = ["mcp", "mcp-server", "ai"]
license = { text = "MIT" }

[project.optional-dependencies]
dev = [
    "black>=23.12.0",
    "mypy>=1.8.0",
    "pytest>=7.4.0",
    "pytest-asyncio>=0.23.0"
]

[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"

[tool.black]
line-length = 100
target-version = ['py310']
include = '\.pyi?$'

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

**Key Sections:**
- `project` defines metadata and core dependencies
- `project.optional-dependencies.dev` specifies development tools
- `tool.black` configures code formatting
- `tool.mypy` enables static type checking

**`setup.py` (Optional)**

If you need backward compatibility or custom build logic:

```python
from setuptools import setup, find_packages

setup(
    name="my-mcp-server",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "mcp>=1.0.0",
        "pydantic>=2.5.0",
        "python-dotenv>=1.0.0",
        "httpx>=0.26.0",
    ],
    python_requires=">=3.10",
)
```

**`.env.example`**

```bash
# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your_api_key_here
API_VERSION=v1

# Server Configuration
SERVER_HOST=localhost
SERVER_PORT=8000
LOG_LEVEL=INFO

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
```

**`.gitignore`**

```gitignore
# Virtual Environment
venv/
env/
ENV/
.venv/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Testing
.pytest_cache/
.coverage
htmlcov/
.tox/

# Type checking
.mypy_cache/
.dmypy.json
dmypy.json
```

---

## Directory Organization Best Practices

### Tools Directory

Organize tools by functionality, not by API endpoint:

**Good Structure:**
```
tools/
├── index.ts          # Export all tools
├── create.ts         # All create operations
├── read.ts           # All read operations
├── update.ts         # All update operations
├── delete.ts         # All delete operations
└── search.ts         # All search operations
```

**Each tool file should:**
- Export a single category of operations
- Include clear function names and descriptions
- Implement proper error handling
- Use shared schemas for validation

**Example: `tools/create.ts`**

```typescript
import { z } from 'zod';
import { CreateItemSchema } from '../schemas/types.js';
import { apiClient } from '../client.js';

export const createItemTool = {
  name: 'create_item',
  description: 'Create a new item in the system',
  inputSchema: CreateItemSchema,
  handler: async (input: z.infer<typeof CreateItemSchema>) => {
    try {
      const result = await apiClient.createItem(input);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
  },
};
```

### Schemas Directory

Separate request, response, and internal types:

**Structure:**
```
schemas/
├── types.ts          # Core Zod schemas and types
├── requests.ts       # Tool input schemas
└── responses.ts      # Tool output schemas
```

**Best Practices:**
- Define Zod schemas for runtime validation
- Derive TypeScript types from schemas using `z.infer`
- Keep schemas DRY (Don't Repeat Yourself)
- Document complex schemas with JSDoc comments

**Example: `schemas/types.ts`**

```typescript
import { z } from 'zod';

/**
 * Schema for creating an item
 */
export const CreateItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type CreateItemInput = z.infer<typeof CreateItemSchema>;

/**
 * Schema for item response
 */
export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Item = z.infer<typeof ItemSchema>;
```

### Utils Directory

Organize utilities by concern:

**Structure:**
```
utils/
├── errors.ts         # Custom error classes
├── validation.ts     # Validation helpers
├── pagination.ts     # Pagination utilities
└── logging.ts        # Logging configuration
```

**Example: `utils/errors.ts`**

```typescript
/**
 * Base error class for MCP server errors
 */
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

/**
 * Error thrown when API authentication fails
 */
export class AuthenticationError extends MCPError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends MCPError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends MCPError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
```

---

## File Naming Conventions

### TypeScript

- **Files**: Use kebab-case for file names: `api-client.ts`, `error-handler.ts`
- **Components**: Use PascalCase for class files: `ApiClient.ts`, `ErrorHandler.ts`
- **Tests**: Append `.test.ts` or `.spec.ts`: `create.test.ts`
- **Type declarations**: Use `.d.ts` extension: `index.d.ts`

### Python

- **Modules**: Use snake_case for module names: `api_client.py`, `error_handler.py`
- **Tests**: Prefix with `test_`: `test_create.py`, `test_utils.py`
- **Private modules**: Prefix with underscore: `_internal.py`
- **Package initialization**: Always include `__init__.py` in directories

### Common Conventions

- Keep file names short but descriptive
- Use consistent naming patterns across the project
- Avoid abbreviations unless they're widely understood
- Match file names to their primary export or purpose

---

## Module Organization

### TypeScript Module Patterns

**Named Exports (Recommended):**

```typescript
// tools/create.ts
export const createItemTool = { /* ... */ };
export const createUserTool = { /* ... */ };

// Import
import { createItemTool, createUserTool } from './tools/create.js';
```

**Default Export (Use Sparingly):**

```typescript
// client.ts
export default class ApiClient { /* ... */ }

// Import
import ApiClient from './client.js';
```

**Re-exporting (Index Files):**

```typescript
// tools/index.ts
export * from './create.js';
export * from './read.js';
export * from './update.js';
export * from './delete.js';

// Import all tools
import * as tools from './tools/index.js';
```

### Python Module Patterns

**Explicit Imports (Recommended):**

```python
# tools/create.py
def create_item_tool():
    """Create item tool implementation"""
    pass

# Import
from tools.create import create_item_tool
```

**Package-Level Exports:**

```python
# tools/__init__.py
from .create import create_item_tool
from .read import read_item_tool
from .update import update_item_tool
from .delete import delete_item_tool

__all__ = [
    'create_item_tool',
    'read_item_tool',
    'update_item_tool',
    'delete_item_tool',
]

# Import from package
from tools import create_item_tool
```

---

## Entry Point Structure

### TypeScript Entry Point

**`src/index.ts`**

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as tools from './tools/index.js';
import { loadConfig } from './config.js';

// Load configuration
const config = loadConfig();

// Create server instance
const server = new Server(
  {
    name: 'my-mcp-server',
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
    tools: Object.values(tools).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools[request.params.name];
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  return await tool.handler(request.params.arguments);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

### Python Entry Point

**`src/server.py`**

```python
#!/usr/bin/env python3
import asyncio
import logging
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from .config import load_config
from .tools import (
    create_item_tool,
    read_item_tool,
    update_item_tool,
    delete_item_tool,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load configuration
config = load_config()

# Create server instance
server = Server("my-mcp-server")

# Tool registry
TOOLS = {
    "create_item": create_item_tool,
    "read_item": read_item_tool,
    "update_item": update_item_tool,
    "delete_item": delete_item_tool,
}

@server.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools"""
    return [
        Tool(
            name=name,
            description=tool.description,
            inputSchema=tool.input_schema,
        )
        for name, tool in TOOLS.items()
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool execution"""
    if name not in TOOLS:
        raise ValueError(f"Unknown tool: {name}")

    tool = TOOLS[name]
    result = await tool.handler(arguments)

    return [TextContent(type="text", text=str(result))]

async def main():
    """Run the MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        logger.info("MCP server running on stdio")
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Development Workflow

### TypeScript Development

**Run in Development Mode:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
```

**Type Check:**
```bash
npm run typecheck
```

**Run Tests:**
```bash
npm test
```

### Python Development

**Activate Virtual Environment:**
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

**Run Server:**
```bash
python -m src.server
```

**Format Code:**
```bash
black src/
```

**Type Check:**
```bash
mypy src/
```

**Run Tests:**
```bash
pytest
```

---

## Next Steps

With your project structure in place, you're ready to:

1. **Implement tools** - Create tool handlers in the `tools/` directory
2. **Define schemas** - Add Zod/Pydantic schemas in `schemas/`
3. **Build API client** - Implement the external API wrapper
4. **Add error handling** - Create custom error classes
5. **Write tests** - Add unit and integration tests

For detailed implementation guidance, see:
- [Tool Implementation Guide](./tool-implementation.md)
- [Schema Design Patterns](./schema-design.md)
- [Error Handling Best Practices](./error-handling.md)
- [Testing MCP Servers](./testing.md)

---

## Quick Reference

### TypeScript Commands

```bash
# Initialize project
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx

# Run development
npm run dev

# Build production
npm run build
npm start
```

### Python Commands

```bash
# Set up project
python -m venv venv
source venv/bin/activate
pip install mcp pydantic

# Run development
python -m src.server

# Install dev tools
pip install black mypy pytest
```

### Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` or `src/server.py` | Server entry point |
| `src/client.ts` or `src/client.py` | API client wrapper |
| `src/config.ts` or `src/config.py` | Configuration management |
| `tools/index.ts` or `tools/__init__.py` | Tool registry |
| `schemas/types.ts` or `schemas/types.py` | Schema definitions |
| `.env.example` | Environment variable template |

---

This guide provides the foundation for building well-structured MCP servers. Follow these patterns to create maintainable, scalable, and professional-quality MCP server projects.
