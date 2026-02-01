# MCP Core Primitives

MCP primitives define the building blocks of communication between clients and servers. They specify what types of contextual information can be shared and what actions can be performed. Understanding these primitives is essential for both building and using MCP servers effectively.

## Overview

MCP primitives are divided into three categories:

1. **Server Primitives** - What servers expose to clients (Tools, Resources, Prompts)
2. **Client Primitives** - What clients expose to servers (Sampling, Elicitation, Logging)
3. **Utility Primitives** - Cross-cutting features (Tasks - experimental)

Each primitive serves a specific purpose and follows standardized JSON-RPC methods for discovery and execution.

---

## Server Primitives

Server primitives are capabilities that MCP servers expose to clients, enabling AI applications to access data and perform actions.

### 1. Tools

**Tools are executable functions** that AI applications can invoke to perform actions or computations.

#### What Are Tools?

Tools are the "verbs" of MCP - they represent actions that can be performed. Each tool has:
- **Name**: Unique identifier
- **Description**: What the tool does (LLM-readable)
- **Input Schema**: JSON Schema defining required/optional parameters
- **Output**: Structured response containing results

#### When to Use Tools

Use tools when you need to:
- **Perform actions**: Write files, send emails, create records
- **Execute computations**: Calculate values, process data
- **Query external systems**: Make API calls, run database queries
- **Modify state**: Update configurations, change settings

#### JSON Schema

**Tool Definition:**
```json
{
  "name": "query_database",
  "title": "Database Query Tool",
  "description": "Execute SQL queries against the database and return results in a structured format",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The SQL query to execute"
      },
      "database": {
        "type": "string",
        "description": "Target database name",
        "enum": ["production", "staging", "development"]
      },
      "limit": {
        "type": "number",
        "description": "Maximum number of rows to return",
        "default": 100,
        "minimum": 1,
        "maximum": 1000
      }
    },
    "required": ["query", "database"]
  }
}
```

**Tool Call Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "query": "SELECT * FROM users WHERE active = true",
      "database": "production",
      "limit": 50
    }
  }
}
```

**Tool Call Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 42 active users:\n\n| ID | Name | Email |\n|-----|------|-------|\n| 1 | Alice | alice@example.com |\n| 2 | Bob | bob@example.com |\n..."
      }
    ],
    "isError": false
  }
}
```

#### Complete Examples

**Example 1: File Operations Tool**

```json
{
  "name": "write_file",
  "description": "Write content to a file at the specified path",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Absolute or relative file path"
      },
      "content": {
        "type": "string",
        "description": "Content to write to the file"
      },
      "encoding": {
        "type": "string",
        "enum": ["utf8", "ascii", "base64"],
        "default": "utf8"
      },
      "createDirectories": {
        "type": "boolean",
        "description": "Create parent directories if they don't exist",
        "default": false
      }
    },
    "required": ["path", "content"]
  }
}
```

**Example 2: API Integration Tool**

```json
{
  "name": "send_slack_message",
  "description": "Send a message to a Slack channel",
  "inputSchema": {
    "type": "object",
    "properties": {
      "channel": {
        "type": "string",
        "description": "Channel ID or name (e.g., #general)"
      },
      "message": {
        "type": "string",
        "description": "Message text to send"
      },
      "username": {
        "type": "string",
        "description": "Username to display as sender"
      },
      "attachments": {
        "type": "array",
        "description": "Optional message attachments",
        "items": {
          "type": "object",
          "properties": {
            "title": {"type": "string"},
            "text": {"type": "string"},
            "color": {"type": "string"}
          }
        }
      }
    },
    "required": ["channel", "message"]
  }
}
```

#### Use Cases

1. **Development Tools**: Run tests, build projects, deploy code
2. **Data Operations**: CRUD operations on databases, file systems
3. **External Integrations**: Send notifications, create tickets, schedule meetings
4. **System Administration**: Monitor services, restart processes, manage configurations
5. **Content Creation**: Generate reports, export data, create documents

#### Methods

- `tools/list` - Discover available tools
- `tools/call` - Execute a specific tool

---

### 2. Resources

**Resources are data sources** that provide contextual information to AI applications.

#### What Are Resources?

Resources are the "nouns" of MCP - they represent data that can be read. Each resource has:
- **URI**: Unique identifier (e.g., `file:///path/to/file.txt`)
- **Name**: Human-readable name
- **Description**: What the resource contains
- **MIME Type**: Content type (text/plain, application/json, etc.)
- **Content**: The actual data (text, binary, or blob)

#### When to Use Resources

Use resources when you need to:
- **Provide context**: Database schemas, API documentation, configuration files
- **Share data**: File contents, API responses, cached results
- **Enable discovery**: Lists of available data sources
- **Supply reference material**: Templates, examples, guidelines

#### JSON Schema

**Resource Definition:**
```json
{
  "uri": "db://production/schema",
  "name": "Production Database Schema",
  "description": "Complete schema definition for the production database including all tables, columns, relationships, and indexes",
  "mimeType": "application/json"
}
```

**Resource Read Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "db://production/schema"
  }
}
```

**Resource Read Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "contents": [
      {
        "uri": "db://production/schema",
        "mimeType": "application/json",
        "text": "{\"tables\":{\"users\":{\"columns\":{\"id\":\"integer\",\"name\":\"varchar(255)\",\"email\":\"varchar(255)\"},\"primaryKey\":\"id\"},\"orders\":{\"columns\":{\"id\":\"integer\",\"user_id\":\"integer\",\"total\":\"decimal(10,2)\"},\"primaryKey\":\"id\",\"foreignKeys\":{\"user_id\":\"users.id\"}}}}"
      }
    ]
  }
}
```

#### Complete Examples

**Example 1: File System Resource**

```json
{
  "uri": "file:///Users/alice/project/README.md",
  "name": "Project README",
  "description": "Main project documentation and setup instructions",
  "mimeType": "text/markdown"
}
```

**Read Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "contents": [
      {
        "uri": "file:///Users/alice/project/README.md",
        "mimeType": "text/markdown",
        "text": "# My Project\n\nThis project does amazing things...\n\n## Setup\n\n```bash\nnpm install\n```"
      }
    ]
  }
}
```

**Example 2: API Data Resource**

```json
{
  "uri": "api://github/repos/owner/repo/issues",
  "name": "GitHub Issues",
  "description": "List of open issues in the repository",
  "mimeType": "application/json"
}
```

**Example 3: Dynamic Resource with Templates**

```json
{
  "uri": "config://app/{environment}/settings",
  "name": "Application Settings",
  "description": "Configuration settings for specified environment (production, staging, development)",
  "mimeType": "application/json"
}
```

#### Resource Templates

Resources support URI templates for dynamic data access:

```json
// Resource definition with template
{
  "uriTemplate": "log://app/{service}/{date}",
  "name": "Service Logs",
  "description": "Application logs for a specific service and date"
}

// Usage
{
  "method": "resources/read",
  "params": {
    "uri": "log://app/api/2026-01-31"
  }
}
```

#### Use Cases

1. **Documentation**: README files, API docs, configuration guides
2. **Schema Information**: Database schemas, API specifications, type definitions
3. **Configuration**: Environment settings, feature flags, credentials
4. **Historical Data**: Logs, audit trails, previous results
5. **Reference Material**: Code examples, templates, best practices

#### Methods

- `resources/list` - Discover available resources
- `resources/read` - Retrieve resource content
- `resources/templates/list` - List URI templates (optional)

---

### 3. Prompts

**Prompts are reusable templates** that help structure interactions with language models.

#### What Are Prompts?

Prompts are pre-configured conversation starters or templates. Each prompt has:
- **Name**: Unique identifier
- **Description**: What the prompt does
- **Arguments**: Optional parameters to customize the prompt
- **Messages**: Structured conversation template

#### When to Use Prompts

Use prompts when you need to:
- **Standardize workflows**: Common tasks with consistent structure
- **Provide examples**: Few-shot learning patterns
- **Guide interactions**: System prompts that shape behavior
- **Simplify complex tasks**: Multi-step operations as single invocation

#### JSON Schema

**Prompt Definition:**
```json
{
  "name": "code_review",
  "description": "Review code changes and provide detailed feedback on quality, security, and best practices",
  "arguments": [
    {
      "name": "language",
      "description": "Programming language of the code",
      "required": true
    },
    {
      "name": "code",
      "description": "Code snippet to review",
      "required": true
    },
    {
      "name": "focus",
      "description": "Specific aspect to focus on (security, performance, style)",
      "required": false
    }
  ]
}
```

**Prompt Get Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "language": "python",
      "code": "def calculate(x, y):\n    return eval(x + y)",
      "focus": "security"
    }
  }
}
```

**Prompt Get Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code with a focus on security:\n\n```python\ndef calculate(x, y):\n    return eval(x + y)\n```\n\nProvide feedback on:\n1. Security vulnerabilities\n2. Potential exploits\n3. Recommended fixes\n4. Best practices"
        }
      }
    ]
  }
}
```

#### Complete Examples

**Example 1: SQL Query Assistant Prompt**

```json
{
  "name": "sql_query_helper",
  "description": "Generate SQL queries based on natural language descriptions with schema context",
  "arguments": [
    {
      "name": "request",
      "description": "Natural language description of desired query",
      "required": true
    },
    {
      "name": "schema",
      "description": "Database schema information",
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Given this database schema:\n\n```json\n{\"tables\": {\"users\": [...], \"orders\": [...]}}\n```\n\nGenerate a SQL query to: Find all active users who made purchases in the last 30 days\n\nRequirements:\n- Use proper JOINs\n- Include appropriate WHERE clauses\n- Optimize for performance\n- Add helpful comments"
      }
    }
  ]
}
```

**Example 2: Few-Shot Learning Prompt**

```json
{
  "name": "classify_support_ticket",
  "description": "Classify customer support tickets into categories using few-shot examples",
  "arguments": [
    {
      "name": "ticket",
      "description": "Support ticket content to classify",
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Classify the following support ticket into one of these categories: billing, technical, account, feature_request\n\nExamples:\n\nTicket: \"I can't log in to my account\"\nCategory: account\n\nTicket: \"The app crashes when I click submit\"\nCategory: technical\n\nTicket: \"I was charged twice this month\"\nCategory: billing\n\nTicket: \"Can you add dark mode?\"\nCategory: feature_request\n\nNow classify:\nTicket: \"My password reset link doesn't work\""
      }
    }
  ]
}
```

**Example 3: Multi-Step Workflow Prompt**

```json
{
  "name": "deploy_workflow",
  "description": "Guide through deployment process with pre-deployment checks",
  "arguments": [
    {
      "name": "environment",
      "description": "Target environment (staging, production)",
      "required": true
    },
    {
      "name": "version",
      "description": "Version to deploy",
      "required": true
    }
  ]
}
```

#### Use Cases

1. **Task Templates**: Common workflows with consistent structure
2. **Few-Shot Examples**: Training patterns for specific tasks
3. **System Prompts**: Behavior guidelines and constraints
4. **Interactive Workflows**: Multi-step processes with guidance
5. **Quality Control**: Review and validation templates

#### Methods

- `prompts/list` - Discover available prompts
- `prompts/get` - Retrieve prompt content with arguments

---

## Client Primitives

Client primitives are capabilities that MCP clients expose to servers, enabling servers to request services from the client.

### 4. Sampling

**Sampling allows servers to request language model completions** from the client's AI application.

#### What Is Sampling?

Sampling enables MCP servers to leverage the language model capabilities of the client without:
- Bundling their own LLM SDK
- Depending on specific model providers
- Managing API keys and authentication
- Handling model-specific configurations

#### When to Use Sampling

Use sampling when your server needs to:
- **Generate natural language**: Create human-readable responses
- **Transform data**: Convert between formats using LLM
- **Make decisions**: Use LLM reasoning for complex logic
- **Stay model-agnostic**: Work with any LLM the client provides

#### JSON Schema

**Sampling Request (from server to client):**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Summarize this log file in plain English: [log content...]"
        }
      }
    ],
    "maxTokens": 500,
    "temperature": 0.7,
    "systemPrompt": "You are a helpful assistant that explains technical logs to non-technical users."
  }
}
```

**Sampling Response (from client to server):**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "role": "assistant",
    "content": {
      "type": "text",
      "text": "The system experienced a temporary database connection issue at 3:42 PM. The application automatically retried and successfully reconnected after 2 seconds. No data was lost and users were not affected."
    },
    "model": "claude-sonnet-4.5",
    "stopReason": "end_turn"
  }
}
```

#### Complete Examples

**Example 1: Data Transformation**

Server needs to convert structured data to natural language:

```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Convert this JSON error to a user-friendly message:\n\n```json\n{\"error\": \"ECONNREFUSED\", \"code\": \"ERR_CONNECTION_REFUSED\", \"syscall\": \"connect\", \"address\": \"127.0.0.1\", \"port\": 5432}\n```"
        }
      }
    ],
    "maxTokens": 200
  }
}
```

**Example 2: Intelligent Decision Making**

Server uses LLM to classify or make decisions:

```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Based on these metrics, determine if this deployment is healthy:\n- CPU: 45%\n- Memory: 78%\n- Error rate: 0.02%\n- Response time: 120ms\n- Success rate: 99.98%\n\nRespond with: HEALTHY, WARNING, or CRITICAL"
        }
      }
    ],
    "systemPrompt": "You are a DevOps expert analyzing system health.",
    "temperature": 0.1
  }
}
```

#### Use Cases

1. **Natural Language Generation**: Create human-readable summaries
2. **Data Interpretation**: Explain technical data to users
3. **Content Enhancement**: Improve or format text
4. **Classification**: Categorize data using LLM reasoning
5. **Model-Agnostic Tools**: Build tools that work with any LLM

#### Methods

- `sampling/createMessage` - Request LLM completion from client

---

### 5. Elicitation

**Elicitation allows servers to request additional information from users** through the client interface.

#### What Is Elicitation?

Elicitation enables servers to gather user input when needed, such as:
- Missing required parameters
- Confirmation for dangerous operations
- Additional context for ambiguous requests
- User preferences or choices

#### When to Use Elicitation

Use elicitation when you need to:
- **Request confirmation**: Before destructive actions
- **Gather missing data**: When parameters are incomplete
- **Resolve ambiguity**: When multiple options exist
- **Get user preferences**: For customization

#### JSON Schema

**Elicitation Request (from server to client):**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "This will delete all records from the 'users' table in production. Are you sure you want to proceed?",
    "type": "confirmation",
    "default": false
  }
}
```

**Elicitation Response (from client to server):**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {
    "input": false,
    "cancelled": false
  }
}
```

#### Complete Examples

**Example 1: Confirmation Dialog**

```json
{
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "Delete 342 files from /tmp? This cannot be undone.",
    "type": "confirmation",
    "default": false,
    "severity": "warning"
  }
}
```

**Example 2: Multiple Choice**

```json
{
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "Multiple databases found. Which one should I query?",
    "type": "choice",
    "options": [
      {
        "value": "production",
        "label": "Production (prod-db-01)"
      },
      {
        "value": "staging",
        "label": "Staging (stage-db-01)"
      },
      {
        "value": "development",
        "label": "Development (dev-db-01)"
      }
    ]
  }
}
```

**Example 3: Text Input**

```json
{
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "Enter the API key for the production environment:",
    "type": "text",
    "secure": true,
    "placeholder": "sk-..."
  }
}
```

**Example 4: Multi-Field Form**

```json
{
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "Database connection parameters:",
    "type": "form",
    "fields": [
      {
        "name": "host",
        "label": "Database Host",
        "type": "text",
        "required": true,
        "default": "localhost"
      },
      {
        "name": "port",
        "label": "Port",
        "type": "number",
        "required": true,
        "default": 5432
      },
      {
        "name": "database",
        "label": "Database Name",
        "type": "text",
        "required": true
      },
      {
        "name": "username",
        "label": "Username",
        "type": "text",
        "required": true
      },
      {
        "name": "password",
        "label": "Password",
        "type": "text",
        "secure": true,
        "required": true
      }
    ]
  }
}
```

#### Use Cases

1. **Safety Checks**: Confirm destructive operations
2. **Missing Parameters**: Request required information
3. **Interactive Configuration**: Gather setup details
4. **User Preferences**: Collect customization options
5. **Ambiguity Resolution**: Choose between multiple options

#### Methods

- `elicitation/requestInput` - Request user input from client

---

### 6. Logging

**Logging enables servers to send diagnostic messages** to clients for debugging and monitoring.

#### What Is Logging?

Logging allows servers to communicate operational information to clients without interrupting the main request/response flow. Logs help:
- **Developers**: Debug server implementations
- **Users**: Understand what's happening
- **Administrators**: Monitor server health
- **Auditors**: Track operations and decisions

#### When to Use Logging

Use logging to:
- **Debug issues**: Trace execution flow and variable states
- **Monitor performance**: Track timing and resource usage
- **Audit operations**: Record security-relevant actions
- **Inform users**: Provide progress updates

#### Log Levels

- `debug` - Detailed diagnostic information
- `info` - General informational messages
- `notice` - Normal but significant events
- `warning` - Warning messages for potential issues
- `error` - Error conditions that don't stop execution
- `critical` - Critical conditions requiring immediate attention
- `alert` - Actions must be taken immediately
- `emergency` - System is unusable

#### JSON Schema

**Log Message (from server to client):**
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/message",
  "params": {
    "level": "info",
    "logger": "database-query",
    "data": {
      "message": "Executing query: SELECT * FROM users WHERE active = true",
      "query": "SELECT * FROM users WHERE active = true",
      "database": "production",
      "timestamp": "2026-01-31T14:32:15Z"
    }
  }
}
```

#### Complete Examples

**Example 1: Debug Logging**

```json
{
  "method": "notifications/message",
  "params": {
    "level": "debug",
    "logger": "api-integration",
    "data": {
      "message": "Making HTTP request to GitHub API",
      "url": "https://api.github.com/repos/owner/repo/issues",
      "method": "GET",
      "headers": {
        "Accept": "application/vnd.github.v3+json"
      }
    }
  }
}
```

**Example 2: Error Logging**

```json
{
  "method": "notifications/message",
  "params": {
    "level": "error",
    "logger": "file-operations",
    "data": {
      "message": "Failed to write file: Permission denied",
      "path": "/etc/config.json",
      "error": "EACCES",
      "userId": "user123",
      "timestamp": "2026-01-31T14:35:42Z"
    }
  }
}
```

**Example 3: Performance Logging**

```json
{
  "method": "notifications/message",
  "params": {
    "level": "info",
    "logger": "query-performance",
    "data": {
      "message": "Query completed successfully",
      "duration": 145,
      "rowsReturned": 2500,
      "cacheHit": false,
      "query": "SELECT * FROM orders WHERE date > '2026-01-01'"
    }
  }
}
```

**Example 4: Security Audit Logging**

```json
{
  "method": "notifications/message",
  "params": {
    "level": "warning",
    "logger": "security-audit",
    "data": {
      "message": "Failed authentication attempt",
      "username": "admin",
      "ipAddress": "192.168.1.100",
      "timestamp": "2026-01-31T14:40:12Z",
      "attempts": 3
    }
  }
}
```

#### Use Cases

1. **Development**: Debug server logic and trace execution
2. **Operations**: Monitor server health and performance
3. **Security**: Audit access and operations
4. **User Feedback**: Provide progress updates for long operations
5. **Troubleshooting**: Diagnose issues in production

#### Methods

- `notifications/message` - Send log message to client

---

## Primitive Interactions

### Combining Primitives

MCP primitives work together to create powerful workflows:

#### Example: Safe Database Operation

1. **Resource**: Provide database schema
2. **Prompt**: Suggest query structure
3. **Elicitation**: Confirm destructive operation
4. **Tool**: Execute the query
5. **Logging**: Record execution details
6. **Sampling**: Generate human-readable summary

```json
// 1. Client reads schema resource
{
  "method": "resources/read",
  "params": {"uri": "db://production/schema"}
}

// 2. Client uses prompt for guidance
{
  "method": "prompts/get",
  "params": {
    "name": "sql_query_helper",
    "arguments": {"request": "Delete inactive users"}
  }
}

// 3. Server logs the operation
{
  "method": "notifications/message",
  "params": {
    "level": "info",
    "data": {"message": "Preparing to delete 15 inactive users"}
  }
}

// 4. Server requests confirmation
{
  "method": "elicitation/requestInput",
  "params": {
    "prompt": "Delete 15 inactive users from production?",
    "type": "confirmation"
  }
}

// 5. Client calls tool
{
  "method": "tools/call",
  "params": {
    "name": "execute_query",
    "arguments": {"query": "DELETE FROM users WHERE active = false"}
  }
}

// 6. Server uses sampling for summary
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [{
      "role": "user",
      "content": {
        "type": "text",
        "text": "Summarize: Deleted 15 inactive users from database"
      }
    }]
  }
}
```

### Best Practices

#### For Tools
- Use descriptive names and detailed descriptions
- Provide comprehensive input schemas with validation
- Return structured, parseable results
- Handle errors gracefully with clear messages
- Document side effects and requirements

#### For Resources
- Use consistent URI schemes
- Include accurate MIME types
- Provide helpful descriptions
- Keep content focused and relevant
- Support caching where appropriate

#### For Prompts
- Design for reusability across contexts
- Provide clear argument descriptions
- Include examples in prompt content
- Structure for optimal LLM understanding
- Test with various argument combinations

#### For Sampling
- Use appropriate temperature settings
- Provide clear, specific prompts
- Include necessary context in messages
- Set reasonable token limits
- Handle potential LLM failures

#### For Elicitation
- Only request essential information
- Provide clear, concise prompts
- Use appropriate input types
- Set sensible defaults
- Handle cancellation gracefully

#### For Logging
- Use appropriate log levels
- Include relevant context data
- Avoid logging sensitive information
- Structure log data consistently
- Consider log volume impact

---

## Related Documentation

- **Tools Implementation**: See [tools-and-schemas.md](./tools-and-schemas.md) for detailed implementation patterns
- **MCP Architecture**: See [../README.md](../README.md) for overall system architecture
- **Building Servers**: See [03-creating-servers/](../03-creating-servers/) for server development guides
- **MCP Specification**: [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification/latest)

---

**Last Updated:** February 2026
**Specification Version:** 2025-06-18
