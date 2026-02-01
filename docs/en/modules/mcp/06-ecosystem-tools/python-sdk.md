# Python SDK for MCP

Learn how to build Model Context Protocol servers using the official Python SDK with async patterns, Pydantic validation, and multiple transport implementations.

## Overview

The **MCP Python SDK** provides a Pythonic interface for building MCP servers. It leverages modern Python features including async/await, type hints, and Pydantic models for robust server development.

**Key Features:**
- Async-first architecture with asyncio
- Type-safe schemas with Pydantic
- Multiple transport options (stdio, HTTP/SSE)
- Decorator-based request handlers
- Built-in error handling
- Streaming support for large responses

**Official Repository:** [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)

## Installation and Setup

### Prerequisites

- Python 3.10 or higher
- pip or poetry for dependency management
- Basic understanding of async Python

### Installing the SDK

**Using pip:**

```bash
# Create project directory
mkdir my-mcp-server
cd my-mcp-server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install MCP SDK
pip install mcp

# Install additional dependencies
pip install pydantic httpx
```

**Using poetry:**

```bash
# Initialize poetry project
poetry init

# Add dependencies
poetry add mcp pydantic httpx

# Activate virtual environment
poetry shell
```

### Project Structure

```
my_mcp_server/
├── pyproject.toml
├── README.md
├── .env.example
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
│   │   ├── __init__.py
│   │   └── types.py       # Pydantic models
│   └── utils/
│       ├── __init__.py
│       ├── errors.py      # Error handling
│       └── pagination.py  # Pagination utilities
```

### Basic pyproject.toml

```toml
[project]
name = "my-mcp-server"
version = "1.0.0"
description = "MCP server for [your service]"
requires-python = ">=3.10"
dependencies = [
    "mcp>=1.0.0",
    "pydantic>=2.0.0",
    "httpx>=0.27.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "black>=24.0.0",
    "mypy>=1.8.0",
    "ruff>=0.1.0"
]

[project.scripts]
my-mcp-server = "src.server:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.black]
line-length = 100
target-version = ['py310']

[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.ruff]
line-length = 100
target-version = "py310"
```

## Core SDK Components

### Server Class

The `Server` class is the foundation of every MCP server.

**Creating a server:**

```python
from mcp.server import Server

# Initialize server with name
app = Server("my-mcp-server")
```

**Server with configuration:**

```python
from mcp.server import Server

app = Server(
    name="my-mcp-server",
    version="1.0.0"
)
```

### Decorators for Request Handlers

The Python SDK uses decorators to register request handlers.

**Available decorators:**

| Decorator | Purpose | Required |
|-----------|---------|----------|
| `@app.list_tools()` | List available tools | Yes (if using tools) |
| `@app.call_tool()` | Handle tool calls | Yes (if using tools) |
| `@app.list_resources()` | List available resources | Optional |
| `@app.read_resource()` | Read resource content | Optional |
| `@app.list_prompts()` | List available prompts | Optional |
| `@app.get_prompt()` | Get prompt content | Optional |

### Type System

The SDK provides type definitions for all MCP constructs.

**Common types:**

```python
from mcp.types import (
    Tool,                  # Tool definition
    TextContent,           # Text response content
    ResourceContent,       # Structured resource content
    CallToolRequest,       # Tool call request
    ListToolsRequest,      # Tools list request
)
```

## Creating Servers with Python SDK

### Minimal Working Server (stdio)

```python
#!/usr/bin/env python3
# src/server.py
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Create server instance
app = Server("hello-mcp")

@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="hello",
            description="Say hello to someone",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Name of the person to greet"
                    }
                },
                "required": ["name"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    if name == "hello":
        person_name = arguments.get("name", "World")
        return [
            TextContent(
                type="text",
                text=f"Hello, {person_name}!"
            )
        ]

    raise ValueError(f"Unknown tool: {name}")

async def main():
    """Run the server using stdio transport."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```

**Running the server:**

```bash
# Make executable
chmod +x src/server.py

# Run directly
python src/server.py

# Or with python -m
python -m src.server
```

### Server with HTTP Transport

```python
# src/server.py
from mcp.server import Server
from mcp.server.sse import sse_server
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.responses import JSONResponse
import uvicorn

app = Server("my-mcp-server")

# Register handlers (same as stdio version)
@app.list_tools()
async def list_tools() -> list[Tool]:
    # ... implementation
    pass

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    # ... implementation
    pass

# Create web application
async def handle_sse(request):
    """Handle SSE connections for MCP."""
    async with sse_server() as streams:
        await app.run(
            streams[0],
            streams[1],
            app.create_initialization_options()
        )

async def health_check(request):
    """Health check endpoint."""
    return JSONResponse({
        "status": "ok",
        "server": "my-mcp-server",
        "version": "1.0.0"
    })

# Create Starlette app
web_app = Starlette(
    routes=[
        Route("/mcp", handle_sse, methods=["POST"]),
        Route("/health", health_check, methods=["GET"]),
    ]
)

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(
        web_app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
```

**Required dependencies for HTTP:**

```bash
pip install starlette uvicorn
```

**Running the HTTP server:**

```bash
# Development
python src/server.py

# Production
uvicorn src.server:web_app --host 0.0.0.0 --port 3000

# With auto-reload
uvicorn src.server:web_app --reload
```

## Tool Definition with Pydantic

### Basic Pydantic Models

Pydantic provides type-safe schema validation with automatic JSON Schema generation.

**Simple tool schema:**

```python
from pydantic import BaseModel, Field
from typing import Optional

class CreateIssueInput(BaseModel):
    """Input schema for creating GitHub issues."""
    repository: str = Field(
        description="Repository in format owner/repo"
    )
    title: str = Field(
        description="Issue title"
    )
    body: Optional[str] = Field(
        None,
        description="Issue description"
    )

    class Config:
        # Generate JSON schema for MCP
        json_schema_extra = {
            "examples": [{
                "repository": "owner/repo",
                "title": "Bug report",
                "body": "Description of the bug"
            }]
        }
```

### Advanced Pydantic Patterns

**Validators:**

```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class CreateIssueInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(description="Issue title")

    @validator("repository")
    def validate_repository_format(cls, v):
        """Ensure repository is in owner/repo format."""
        if "/" not in v or v.count("/") != 1:
            raise ValueError("Repository must be in format owner/repo")

        owner, repo = v.split("/")
        if not owner or not repo:
            raise ValueError("Owner and repo cannot be empty")

        return v

    @validator("title")
    def validate_title_length(cls, v):
        """Ensure title is not too short or too long."""
        if len(v) < 3:
            raise ValueError("Title must be at least 3 characters")
        if len(v) > 256:
            raise ValueError("Title must be less than 256 characters")
        return v
```

**Enums for fixed choices:**

```python
from pydantic import BaseModel, Field
from enum import Enum

class IssueState(str, Enum):
    """Valid issue states."""
    OPEN = "open"
    CLOSED = "closed"
    ALL = "all"

class ListIssuesInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    state: IssueState = Field(
        IssueState.OPEN,
        description="Filter by issue state"
    )
    limit: int = Field(
        30,
        ge=1,
        le=100,
        description="Maximum number of issues to return"
    )
```

**Nested models:**

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserProfile(BaseModel):
    """User profile information."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = Field(None, max_length=500)

class UserSettings(BaseModel):
    """User preferences."""
    notifications: Optional[bool] = None
    theme: Optional[str] = Field(None, pattern="^(light|dark)$")

class UpdateUserInput(BaseModel):
    """Input for updating user information."""
    user_id: str = Field(description="User ID to update")
    profile: Optional[UserProfile] = Field(
        None,
        description="Profile fields to update"
    )
    settings: Optional[UserSettings] = Field(
        None,
        description="User settings to update"
    )
```

**Discriminated unions:**

```python
from pydantic import BaseModel, Field
from typing import Union, Literal

class EmailNotification(BaseModel):
    type: Literal["email"] = "email"
    to: str = Field(description="Email address")
    subject: str = Field(description="Email subject")
    body: str = Field(description="Email body")

class SlackNotification(BaseModel):
    type: Literal["slack"] = "slack"
    channel: str = Field(description="Slack channel")
    message: str = Field(description="Message text")

class SMSNotification(BaseModel):
    type: Literal["sms"] = "sms"
    phone: str = Field(description="Phone number")
    message: str = Field(description="SMS text")

# Union of notification types
NotificationInput = Union[
    EmailNotification,
    SlackNotification,
    SMSNotification
]
```

### Converting Pydantic to JSON Schema

Pydantic models automatically generate JSON Schema for MCP:

```python
from pydantic import BaseModel, Field

class MyInput(BaseModel):
    field1: str = Field(description="Description here")
    field2: int = Field(ge=1, le=100)

# Generate JSON Schema for MCP
schema = MyInput.model_json_schema()

# Use in tool definition
tool = Tool(
    name="my_tool",
    description="Tool description",
    inputSchema=schema
)
```

## Request Handlers

### Tool List Handler

Register available tools with the `@app.list_tools()` decorator.

**Basic implementation:**

```python
from mcp.types import Tool

@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return [
        Tool(
            name="github_create_issue",
            description="Create a new issue in a GitHub repository",
            inputSchema=CreateIssueInput.model_json_schema()
        ),
        Tool(
            name="github_list_issues",
            description="List issues in a GitHub repository",
            inputSchema=ListIssuesInput.model_json_schema()
        ),
        # Add more tools...
    ]
```

**With annotations:**

```python
@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools with safety annotations."""
    return [
        Tool(
            name="github_list_issues",
            description="List issues in a GitHub repository",
            inputSchema=ListIssuesInput.model_json_schema(),
            # Read-only, idempotent operation
            annotations={
                "readOnlyHint": True,
                "idempotentHint": True
            }
        ),
        Tool(
            name="github_create_issue",
            description="Create a new issue in a GitHub repository",
            inputSchema=CreateIssueInput.model_json_schema(),
            # Destructive, non-idempotent operation
            annotations={
                "destructiveHint": True,
                "idempotentHint": False
            }
        ),
    ]
```

### Tool Call Handler

Handle tool invocations with the `@app.call_tool()` decorator.

**Basic implementation:**

```python
from mcp.types import TextContent, ResourceContent

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent | ResourceContent]:
    """Execute the requested tool."""

    if name == "github_create_issue":
        # Validate input
        input_data = CreateIssueInput(**arguments)

        # Call handler function
        return await create_issue(client, input_data)

    elif name == "github_list_issues":
        input_data = ListIssuesInput(**arguments)
        return await list_issues(client, input_data)

    else:
        raise ValueError(f"Unknown tool: {name}")
```

**With error handling:**

```python
from mcp.types import TextContent
from .utils.errors import APIError
from pydantic import ValidationError

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Execute tool with comprehensive error handling."""
    try:
        if name == "github_create_issue":
            input_data = CreateIssueInput(**arguments)
            return await create_issue(client, input_data)

        elif name == "github_list_issues":
            input_data = ListIssuesInput(**arguments)
            return await list_issues(client, input_data)

        else:
            raise ValueError(f"Unknown tool: {name}")

    except ValidationError as error:
        # Handle Pydantic validation errors
        error_details = "\n".join([
            f"- {err['loc'][0]}: {err['msg']}"
            for err in error.errors()
        ])
        raise ValueError(
            f"Invalid input parameters:\n{error_details}"
        )

    except APIError as error:
        # Handle API errors with actionable messages
        raise ValueError(error.to_actionable_message())

    except Exception as error:
        # Handle unexpected errors
        raise ValueError(f"Unexpected error: {str(error)}")
```

### Resource Handlers

Resources provide read-only access to data.

**List resources:**

```python
from mcp.types import Resource

@app.list_resources()
async def list_resources() -> list[Resource]:
    """List available resources."""
    return [
        Resource(
            uri="github://user/profile",
            name="User Profile",
            description="GitHub user profile information",
            mimeType="application/json"
        ),
        Resource(
            uri="github://repos",
            name="User Repositories",
            description="List of user's repositories",
            mimeType="application/json"
        )
    ]
```

**Read resource:**

```python
from mcp.types import ResourceContent
import json

@app.read_resource()
async def read_resource(uri: str) -> ResourceContent:
    """Read resource content by URI."""

    if uri == "github://user/profile":
        profile = await client.get("/user")
        return ResourceContent(
            uri=uri,
            mimeType="application/json",
            text=json.dumps(profile, indent=2)
        )

    elif uri.startswith("github://repos"):
        repos = await client.get("/user/repos")
        return ResourceContent(
            uri=uri,
            mimeType="application/json",
            text=json.dumps(repos, indent=2)
        )

    else:
        raise ValueError(f"Unknown resource: {uri}")
```

## Transport Implementations

### stdio Transport

Standard input/output transport for local development and CLI integration.

**Basic stdio server:**

```python
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("my-mcp-server")

# Register handlers...

async def main():
    """Run server on stdio."""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```

**With logging:**

```python
import asyncio
import logging
import sys
from mcp.server import Server
from mcp.server.stdio import stdio_server

# Configure logging to stderr (stdout is used for protocol)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr
)

logger = logging.getLogger(__name__)

app = Server("my-mcp-server")

async def main():
    """Run server with logging."""
    logger.info("Starting MCP server on stdio")

    try:
        async with stdio_server() as (read_stream, write_stream):
            logger.info("Server initialized successfully")
            await app.run(
                read_stream,
                write_stream,
                app.create_initialization_options()
            )
    except Exception as error:
        logger.error(f"Server error: {error}", exc_info=True)
        raise

if __name__ == "__main__":
    asyncio.run(main())
```

### HTTP/SSE Transport

Server-Sent Events over HTTP for remote server deployment.

**Basic HTTP server:**

```python
from mcp.server import Server
from mcp.server.sse import sse_server
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.responses import JSONResponse
import uvicorn
import logging

logger = logging.getLogger(__name__)

app = Server("my-mcp-server")

# Register handlers...

async def handle_sse(request):
    """Handle MCP connections via SSE."""
    logger.info(f"New MCP connection from {request.client.host}")

    try:
        async with sse_server() as streams:
            await app.run(
                streams[0],
                streams[1],
                app.create_initialization_options()
            )
    except Exception as error:
        logger.error(f"SSE error: {error}")
        raise

async def health(request):
    """Health check endpoint."""
    return JSONResponse({
        "status": "healthy",
        "server": "my-mcp-server",
        "version": "1.0.0"
    })

# Create web application
web_app = Starlette(
    routes=[
        Route("/mcp", handle_sse, methods=["POST"]),
        Route("/health", health, methods=["GET"]),
    ]
)

if __name__ == "__main__":
    port = 3000
    logger.info(f"Starting HTTP server on port {port}")
    uvicorn.run(
        web_app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
```

**With CORS and authentication:**

```python
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.authentication import (
    AuthenticationBackend,
    AuthCredentials,
    SimpleUser,
)
import os

class BearerTokenAuth(AuthenticationBackend):
    """Simple bearer token authentication."""

    async def authenticate(self, conn):
        if "Authorization" not in conn.headers:
            return None

        auth = conn.headers["Authorization"]
        if not auth.startswith("Bearer "):
            return None

        token = auth.split(" ", 1)[1]
        expected_token = os.getenv("API_TOKEN")

        if token != expected_token:
            return None

        return AuthCredentials(["authenticated"]), SimpleUser("api_user")

# Create web app with middleware
web_app = Starlette(
    routes=[
        Route("/mcp", handle_sse, methods=["POST"]),
        Route("/health", health, methods=["GET"]),
    ],
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        ),
        Middleware(
            AuthenticationMiddleware,
            backend=BearerTokenAuth()
        ),
    ]
)
```

## Async Patterns in Python

### Understanding asyncio

MCP servers in Python are built on `asyncio`, Python's standard library for asynchronous programming.

**Key concepts:**

```python
import asyncio

# Async function definition
async def fetch_data():
    """Asynchronous function using async/await."""
    await asyncio.sleep(1)  # Non-blocking wait
    return "data"

# Running async code
result = asyncio.run(fetch_data())

# Concurrent execution
async def main():
    # Run multiple coroutines concurrently
    results = await asyncio.gather(
        fetch_data(),
        fetch_data(),
        fetch_data()
    )
    return results
```

### Async HTTP Client

Use `httpx` for async HTTP requests.

**Basic async client:**

```python
import httpx
from typing import Any, Dict, Optional

class APIClient:
    """Async HTTP client for API requests."""

    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    async def request(
        self,
        endpoint: str,
        method: str = "GET",
        params: Optional[Dict[str, str]] = None,
        json: Optional[Dict[str, Any]] = None
    ) -> Any:
        """Make async HTTP request."""
        url = f"{self.base_url}{endpoint}"

        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=url,
                params=params,
                json=json,
                headers=self.headers,
                timeout=30.0
            )

            response.raise_for_status()
            return response.json()

    async def get(self, endpoint: str, params: Optional[Dict] = None) -> Any:
        """GET request helper."""
        return await self.request(endpoint, "GET", params=params)

    async def post(self, endpoint: str, json: Dict) -> Any:
        """POST request helper."""
        return await self.request(endpoint, "POST", json=json)
```

### Concurrent Operations

Execute multiple operations concurrently for better performance.

**Using asyncio.gather:**

```python
import asyncio
from typing import List

async def fetch_issue(client: APIClient, issue_number: int):
    """Fetch a single issue."""
    return await client.get(f"/issues/{issue_number}")

async def fetch_multiple_issues(
    client: APIClient,
    issue_numbers: List[int]
) -> List[dict]:
    """Fetch multiple issues concurrently."""
    tasks = [
        fetch_issue(client, number)
        for number in issue_numbers
    ]

    # Run all tasks concurrently
    results = await asyncio.gather(*tasks)
    return results
```

**Using asyncio.create_task:**

```python
async def process_with_background_task(client: APIClient):
    """Process data with background operation."""

    # Start background task
    background_task = asyncio.create_task(
        send_notification()
    )

    # Do main work
    result = await process_data(client)

    # Optionally wait for background task
    await background_task

    return result
```

### Error Handling in Async Code

Handle errors gracefully in async operations.

**Try/except with async:**

```python
async def safe_fetch(client: APIClient, endpoint: str):
    """Fetch data with error handling."""
    try:
        data = await client.get(endpoint)
        return data
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 404:
            return None
        raise
    except httpx.RequestError as error:
        raise ValueError(f"Network error: {error}")
```

**Retry with exponential backoff:**

```python
import asyncio
from typing import Callable, TypeVar

T = TypeVar("T")

async def retry_with_backoff(
    fn: Callable[[], T],
    max_retries: int = 3,
    base_delay: float = 1.0
) -> T:
    """Retry async function with exponential backoff."""
    last_error: Optional[Exception] = None

    for attempt in range(max_retries):
        try:
            return await fn()
        except Exception as error:
            last_error = error

            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)
                await asyncio.sleep(delay)

    raise last_error

# Usage
result = await retry_with_backoff(
    lambda: client.get("/endpoint")
)
```

### Async Generators for Streaming

Stream large datasets efficiently with async generators.

**Paginated data streaming:**

```python
from typing import AsyncGenerator, TypeVar

T = TypeVar("T")

async def paginate_results(
    client: APIClient,
    endpoint: str,
    page_size: int = 100
) -> AsyncGenerator[dict, None]:
    """Stream paginated results."""
    page = 1

    while True:
        response = await client.get(
            endpoint,
            params={"page": str(page), "per_page": str(page_size)}
        )

        data = response.get("data", [])
        if not data:
            break

        for item in data:
            yield item

        if not response.get("has_more", False):
            break

        page += 1

# Usage
async for item in paginate_results(client, "/issues"):
    print(f"Processing: {item['title']}")
```

## Complete Python Server Example

Here's a comprehensive example bringing together all concepts:

```python
#!/usr/bin/env python3
"""
GitHub MCP Server - Complete Example

A production-ready MCP server for GitHub API integration.
"""
import asyncio
import json
import logging
import os
import sys
from typing import Optional, List
from enum import Enum

import httpx
from pydantic import BaseModel, Field, validator, EmailStr
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent, ResourceContent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

# ============================================================================
# Error Handling
# ============================================================================

class APIError(Exception):
    """API error with status code and actionable messages."""

    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.status_code = status_code

    def to_actionable_message(self) -> str:
        """Convert to user-friendly message."""
        messages = {
            401: "Authentication failed. Check your GITHUB_TOKEN environment variable.",
            403: "Permission denied. Ensure your token has required permissions.",
            404: f"Resource not found: {self}",
            422: f"Validation error: {self}",
            429: "Rate limit exceeded. Wait before retrying.",
        }

        return messages.get(
            self.status_code,
            f"API error ({self.status_code}): {self}"
        )

# ============================================================================
# API Client
# ============================================================================

class GitHubClient:
    """Async GitHub API client."""

    def __init__(self, token: str):
        self.token = token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }

    async def request(
        self,
        endpoint: str,
        method: str = "GET",
        json: Optional[dict] = None
    ) -> dict:
        """Make authenticated API request."""
        url = f"{self.base_url}{endpoint}"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=self.headers,
                    json=json,
                    timeout=30.0
                )

                if not response.is_success:
                    raise APIError(
                        response.text or "Request failed",
                        response.status_code
                    )

                return response.json()

            except httpx.RequestError as error:
                raise APIError(f"Network error: {error}", 0)

# ============================================================================
# Pydantic Schemas
# ============================================================================

class IssueState(str, Enum):
    """GitHub issue states."""
    OPEN = "open"
    CLOSED = "closed"
    ALL = "all"

class CreateIssueInput(BaseModel):
    """Input for creating GitHub issues."""
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(description="Issue title")
    body: Optional[str] = Field(None, description="Issue description")
    labels: Optional[List[str]] = Field(None, description="Issue labels")
    assignees: Optional[List[str]] = Field(None, description="Assign to users")

    @validator("repository")
    def validate_repository(cls, v):
        """Validate repository format."""
        if "/" not in v or v.count("/") != 1:
            raise ValueError("Repository must be in format owner/repo")
        owner, repo = v.split("/")
        if not owner or not repo:
            raise ValueError("Owner and repo cannot be empty")
        return v

    @validator("title")
    def validate_title(cls, v):
        """Validate title length."""
        if len(v) < 3:
            raise ValueError("Title must be at least 3 characters")
        if len(v) > 256:
            raise ValueError("Title must be less than 256 characters")
        return v

class ListIssuesInput(BaseModel):
    """Input for listing GitHub issues."""
    repository: str = Field(description="Repository in format owner/repo")
    state: IssueState = Field(IssueState.OPEN, description="Filter by state")
    limit: int = Field(30, ge=1, le=100, description="Maximum results")

    @validator("repository")
    def validate_repository(cls, v):
        """Validate repository format."""
        if "/" not in v or v.count("/") != 1:
            raise ValueError("Repository must be in format owner/repo")
        return v

# ============================================================================
# Tool Handlers
# ============================================================================

async def create_issue(
    client: GitHubClient,
    input_data: CreateIssueInput
) -> list[TextContent | ResourceContent]:
    """Create a GitHub issue."""
    try:
        # Make API request
        issue = await client.request(
            f"/repos/{input_data.repository}/issues",
            method="POST",
            json={
                "title": input_data.title,
                "body": input_data.body,
                "labels": input_data.labels or [],
                "assignees": input_data.assignees or []
            }
        )

        # Format response
        return [
            TextContent(
                type="text",
                text=f"""Created issue #{issue['number']}: {issue['title']}
URL: {issue['html_url']}
State: {issue['state']}
Created: {issue['created_at']}"""
            ),
            ResourceContent(
                type="resource",
                resource={
                    "uri": f"github://issues/{issue['id']}",
                    "mimeType": "application/json",
                    "text": json.dumps(issue, indent=2)
                }
            )
        ]

    except APIError as error:
        raise ValueError(error.to_actionable_message())

async def list_issues(
    client: GitHubClient,
    input_data: ListIssuesInput
) -> list[TextContent]:
    """List GitHub issues."""
    try:
        # Make API request
        issues = await client.request(
            f"/repos/{input_data.repository}/issues"
            f"?state={input_data.state.value}&per_page={input_data.limit}"
        )

        # Format response
        issue_list = "\n".join([
            f"#{issue['number']}: {issue['title']} ({issue['state']})"
            for issue in issues
        ])

        return [
            TextContent(
                type="text",
                text=f"""Found {len(issues)} {input_data.state.value} issues in {input_data.repository}:

{issue_list}"""
            )
        ]

    except APIError as error:
        raise ValueError(error.to_actionable_message())

# ============================================================================
# MCP Server
# ============================================================================

# Validate environment
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    logger.error("GITHUB_TOKEN environment variable is required")
    sys.exit(1)

# Initialize client and server
github_client = GitHubClient(GITHUB_TOKEN)
app = Server("github-mcp-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available GitHub tools."""
    return [
        Tool(
            name="github_create_issue",
            description="Create a new issue in a GitHub repository",
            inputSchema=CreateIssueInput.model_json_schema(),
            annotations={
                "destructiveHint": True,
                "idempotentHint": False
            }
        ),
        Tool(
            name="github_list_issues",
            description="List issues in a GitHub repository",
            inputSchema=ListIssuesInput.model_json_schema(),
            annotations={
                "readOnlyHint": True,
                "idempotentHint": True
            }
        )
    ]

@app.call_tool()
async def call_tool(
    name: str,
    arguments: dict
) -> list[TextContent | ResourceContent]:
    """Handle tool calls."""
    try:
        if name == "github_create_issue":
            input_data = CreateIssueInput(**arguments)
            return await create_issue(github_client, input_data)

        elif name == "github_list_issues":
            input_data = ListIssuesInput(**arguments)
            return await list_issues(github_client, input_data)

        else:
            raise ValueError(f"Unknown tool: {name}")

    except Exception as error:
        logger.error(f"Tool call error: {error}", exc_info=True)
        raise

async def main():
    """Run the MCP server."""
    logger.info("Starting GitHub MCP Server")

    try:
        async with stdio_server() as (read_stream, write_stream):
            logger.info("Server initialized successfully")
            await app.run(
                read_stream,
                write_stream,
                app.create_initialization_options()
            )
    except Exception as error:
        logger.error(f"Server error: {error}", exc_info=True)
        raise

if __name__ == "__main__":
    asyncio.run(main())
```

## Best Practices and Patterns

### 1. Type Safety

Always use type hints and Pydantic validation:

```python
# Good - type-safe
async def create_issue(
    client: GitHubClient,
    input_data: CreateIssueInput
) -> list[TextContent]:
    pass

# Bad - no types
async def create_issue(client, input_data):
    pass
```

### 2. Error Handling

Provide actionable error messages:

```python
# Good - actionable
except APIError as error:
    raise ValueError(error.to_actionable_message())

# Bad - cryptic
except Exception as e:
    raise ValueError(str(e))
```

### 3. Resource Management

Use async context managers:

```python
# Good - proper cleanup
async with httpx.AsyncClient() as client:
    response = await client.get(url)

# Bad - no cleanup
client = httpx.AsyncClient()
response = await client.get(url)
```

### 4. Logging

Log to stderr, not stdout (stdout is for protocol):

```python
import sys
import logging

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stderr  # Important!
)
```

### 5. Environment Variables

Validate required environment variables early:

```python
import os
import sys

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    print("Error: API_KEY environment variable required", file=sys.stderr)
    sys.exit(1)
```

### 6. Async Best Practices

- Use `async with` for resource management
- Use `asyncio.gather()` for concurrent operations
- Handle cancellation with `asyncio.CancelledError`
- Use async generators for streaming
- Avoid blocking operations in async functions

### 7. Testing

Write tests for schemas and handlers:

```python
import pytest
from pydantic import ValidationError

def test_create_issue_input_validation():
    """Test input validation."""
    # Valid input
    input_data = CreateIssueInput(
        repository="owner/repo",
        title="Test issue"
    )
    assert input_data.repository == "owner/repo"

    # Invalid repository format
    with pytest.raises(ValidationError):
        CreateIssueInput(
            repository="invalid",
            title="Test"
        )

@pytest.mark.asyncio
async def test_create_issue_handler(mock_client):
    """Test tool handler."""
    input_data = CreateIssueInput(
        repository="owner/repo",
        title="Test issue"
    )

    result = await create_issue(mock_client, input_data)
    assert len(result) > 0
    assert "Created issue" in result[0].text
```

## Next Steps

- [Testing MCP Servers](../03-creating-servers/testing.md) - Test your Python server
- [Error Handling](../03-creating-servers/error-handling.md) - Advanced error patterns
- [Performance Optimization](../05-advanced/performance.md) - Optimize async code
- [TypeScript SDK](./typescript-sdk.md) - Compare with TypeScript implementation

## Related Documentation

- [Official Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [asyncio Documentation](https://docs.python.org/3/library/asyncio.html)
- [httpx Documentation](https://www.python-httpx.org/)
