# Using MCP Resources and Prompts

## Overview

**MCP Resources** and **Prompts** are two fundamental primitives that enable rich, contextual interactions between AI applications and external systems. Resources provide data sources that can be referenced inline, while Prompts offer reusable templates that structure model interactions.

**Key Benefits:**
- **Resources**: Direct access to external data through simple @ mentions
- **Prompts**: Standardized, reusable interaction patterns
- **Platform Support**: Available across Claude Code, Gemini CLI, and other MCP hosts
- **Dynamic Discovery**: Both primitives are discoverable at runtime

This guide covers how to use Resources and Prompts across different MCP-enabled platforms.

---

## Understanding MCP Resources

### What Are Resources?

**Resources** are data sources exposed by MCP servers that AI applications can reference and fetch. They provide contextual information from external systems without requiring explicit tool calls.

**Think of Resources as:**
- Read-only data endpoints
- Referenceable URIs
- Contextual attachments
- Dynamic content sources

**Common Resource Types:**
- File contents
- Database schemas
- API documentation
- Configuration data
- Issue/ticket details
- Documentation pages

### Resource Architecture

```
┌─────────────────────────────────────────┐
│         AI Application (Host)           │
│  ┌──────────────────────────────────┐  │
│  │  User types: @github:issue://123  │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   MCP Client (GitHub)            │  │
│  │   Calls: resources/read          │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼───────────────────────┘
                  │
                  ▼
          ┌──────────────┐
          │ GitHub MCP   │
          │   Server     │
          │              │
          │ Returns:     │
          │ Issue #123   │
          │ content      │
          └──────────────┘
```

### Resource Discovery

MCP servers expose available resources through the `resources/list` method:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list"
}
```

**Server Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "github://issue/{number}",
        "name": "GitHub Issue",
        "description": "Fetch details of a GitHub issue",
        "mimeType": "text/plain"
      },
      {
        "uri": "github://pr/{number}",
        "name": "GitHub Pull Request",
        "description": "Fetch details of a pull request",
        "mimeType": "application/json"
      }
    ]
  }
}
```

---

## Using Resources with @ Mentions

### Basic Syntax

Resources are referenced using the `@` syntax followed by a URI:

```
@server:protocol://resource/path
```

**Component Breakdown:**
- `server`: MCP server name
- `protocol`: Resource protocol/type
- `resource/path`: Resource identifier

### Claude Code: Resource References

**Step 1: Discover available resources**

Type `@` in the prompt to see all available resources:

```
> @
```

Resources appear alongside files in the autocomplete menu.

**Step 2: Reference a specific resource**

```
> Can you analyze @github:issue://123 and suggest a fix?
```

```
> Please review the API documentation at @docs:file://api/authentication
```

**Step 3: Multiple resource references**

```
> Compare @postgres:schema://users with @docs:file://database/user-model
```

**Resource Features:**
- **Automatic fetching**: Resources are fetched and included as attachments
- **Fuzzy search**: Resource paths are fuzzy-searchable in @ autocomplete
- **Automatic tools**: Claude Code provides tools to list and read MCP resources
- **Any content type**: Text, JSON, structured data, images, etc.

### Gemini CLI: Resource Syntax

Gemini CLI uses similar `@` syntax for resources:

```
@server://resource/path
```

**Example usage:**

```
> Analyze the schema at @database://users/schema
```

**Features:**
- Resources appear in completion menus alongside filesystem paths
- When submitted, CLI calls `resources/read` on the MCP server
- Content is injected directly into the conversation
- Supports all resource types exposed by connected servers

### Resource URI Formats

Different MCP servers use different URI schemes:

**GitHub Server:**
```
@github:issue://123
@github:pr://456
@github:file://src/main.py
```

**Database Server:**
```
@postgres:schema://users
@postgres:table://orders/definition
@postgres:query://recent_orders
```

**Documentation Server:**
```
@docs:file://api/authentication
@docs:section://getting-started
@docs:page://reference/config
```

**Filesystem Server:**
```
@fs:file:///absolute/path/to/file.txt
@fs:dir:///project/src
```

---

## Resource Templates and Arguments

### URI Templates

Resources can use templated URIs with placeholders:

```json
{
  "uri": "github://issue/{number}",
  "name": "GitHub Issue",
  "description": "Fetch a specific issue by number"
}
```

**Usage:**
```
@github:issue://123
@github:issue://456
```

The `{number}` placeholder gets replaced with actual values.

### Multiple Parameters

Resources can accept multiple arguments:

```json
{
  "uri": "database://{schema}/{table}",
  "name": "Database Table",
  "description": "Access a specific database table"
}
```

**Usage:**
```
@database://public/users
@database://analytics/events
```

### Resource Reading

When a resource is referenced, the MCP client calls `resources/read`:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "github://issue/123"
  }
}
```

**Server Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "contents": [
      {
        "uri": "github://issue/123",
        "mimeType": "text/plain",
        "text": "Issue #123: Fix authentication bug\n\nDescription: Users cannot login after password reset..."
      }
    ]
  }
}
```

---

## Understanding MCP Prompts

### What Are Prompts?

**Prompts** are reusable templates exposed by MCP servers that help structure interactions with language models. They become available as slash commands in MCP-enabled applications.

**Prompts provide:**
- Pre-defined interaction patterns
- Templated queries with arguments
- Few-shot examples
- Specialized instructions
- Workflow templates

**Common Prompt Types:**
- Query templates (e.g., "Review PR", "Analyze error")
- Code generation patterns
- Analysis workflows
- Reporting templates
- Interactive wizards

### Prompt Architecture

```
┌─────────────────────────────────────────┐
│         AI Application (Host)           │
│  ┌──────────────────────────────────┐  │
│  │  User types: /mcp__github__pr_   │  │
│  │  review 456                       │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │   MCP Client (GitHub)            │  │
│  │   Calls: prompts/get             │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼───────────────────────┘
                  │
                  ▼
          ┌──────────────┐
          │ GitHub MCP   │
          │   Server     │
          │              │
          │ Returns:     │
          │ Prompt text  │
          │ with args    │
          └──────────────┘
```

### Prompt Discovery

MCP servers expose available prompts through the `prompts/list` method:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list"
}
```

**Server Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "pr_review",
        "description": "Review a pull request and provide detailed feedback",
        "arguments": [
          {
            "name": "pr_number",
            "description": "Pull request number to review",
            "required": true
          },
          {
            "name": "focus",
            "description": "Specific aspect to focus on (security, performance, etc.)",
            "required": false
          }
        ]
      }
    ]
  }
}
```

---

## Using Prompts as Slash Commands

### Command Naming Convention

MCP prompts become available as slash commands with this format:

```
/mcp__servername__promptname
```

**Component Breakdown:**
- `mcp__`: Prefix indicating MCP prompt
- `servername`: Name of the MCP server
- `promptname`: Name of the prompt (spaces become underscores)

### Claude Code: MCP Prompt Commands

**Step 1: Discover available prompts**

Type `/` to see all commands, including MCP prompts:

```
> /
```

MCP prompts appear with the `mcp__` prefix.

**Step 2: Execute prompt without arguments**

```
> /mcp__github__list_prs
```

The server returns a formatted prompt that gets injected into the conversation.

**Step 3: Execute prompt with arguments**

```
> /mcp__github__pr_review 456
```

```
> /mcp__jira__create_issue "Bug in login flow" high
```

**Argument Handling:**
- Arguments separated by spaces
- Use quotes for multi-word arguments
- Optional arguments can be omitted
- Based on prompt's defined parameters

### Gemini CLI: Prompt Slash Commands

Gemini CLI uses the same naming convention:

```bash
/mcp__servername__promptname [args...]
```

**Example usage:**

```
> /mcp__database__explain_query "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'"
```

**With multiple arguments:**

```
> /mcp__code__generate_test "src/auth.js" "login function"
```

**Features:**
- Prompts discovered from connected servers
- Arguments passed according to server definitions
- Prompt results injected directly into conversation
- Normalized names (spaces → underscores)

### Prompt Execution Flow

**Step 1: User invokes command**

```
/mcp__github__pr_review 456 security
```

**Step 2: Client requests prompt**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "pr_review",
    "arguments": {
      "pr_number": "456",
      "focus": "security"
    }
  }
}
```

**Step 3: Server returns populated template**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Review PR #456 focusing on security",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review pull request #456 with a focus on security concerns. Analyze:\n\n1. Authentication and authorization\n2. Input validation\n3. Data sanitization\n4. Potential vulnerabilities\n5. Security best practices\n\nProvide specific recommendations for improvements."
        }
      }
    ]
  }
}
```

**Step 4: Prompt injected into conversation**

The AI application adds the prompt messages to the conversation context and the language model processes it.

---

## Prompt Templates and Arguments

### Defining Prompt Arguments

Prompts can define required and optional arguments:

```json
{
  "name": "analyze_error",
  "description": "Analyze an error and suggest fixes",
  "arguments": [
    {
      "name": "error_id",
      "description": "Sentry error ID",
      "required": true
    },
    {
      "name": "context",
      "description": "Additional context (user flow, environment, etc.)",
      "required": false
    }
  ]
}
```

**Usage:**

```
/mcp__sentry__analyze_error abc123 "Production environment, checkout flow"
```

### Argument Substitution

Servers substitute arguments into prompt templates:

**Template:**
```
Analyze error {{error_id}} in detail. {{#if context}}Context: {{context}}{{/if}}

Provide:
1. Root cause analysis
2. Impact assessment
3. Suggested fixes
4. Prevention strategies
```

**After substitution:**
```
Analyze error abc123 in detail. Context: Production environment, checkout flow

Provide:
1. Root cause analysis
2. Impact assessment
3. Suggested fixes
4. Prevention strategies
```

### Multi-Message Prompts

Prompts can include multiple messages (e.g., system + user):

```json
{
  "messages": [
    {
      "role": "system",
      "content": {
        "type": "text",
        "text": "You are an expert code reviewer focusing on security."
      }
    },
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Review pull request #{{pr_number}} for security issues."
      }
    }
  ]
}
```

---

## Platform-Specific Features

### Claude Code

**Resource Features:**
- Fuzzy search in @ autocomplete
- Visual indicators for resource types
- Automatic content preview
- Support for images and binary data
- Resource caching

**Prompt Features:**
- Integrated with slash command system
- Argument autocomplete (when available)
- Prompt history
- Dynamic discovery via `/mcp` status

**Command Discovery:**
```
/mcp
```

Shows all connected servers, available prompts, and resources.

### Gemini CLI

**Resource Features:**
- @ syntax completion menus
- Mixed filesystem and MCP resources
- Automatic content fetching
- Rich content support (text, JSON, images)

**Prompt Features:**
- Standard slash command integration
- Argument parsing
- Template substitution
- Dynamic prompt updates

**Server Status:**
```bash
gemini mcp list
```

Shows all configured servers and their capabilities.

---

## Complete Examples

### Example 1: GitHub Issue Analysis

**Using Resources:**

```
> I need to fix @github:issue://789. Can you review the issue details and suggest an implementation approach?
```

**Behind the scenes:**
1. Claude Code sees `@github:issue://789`
2. Calls `resources/read` on GitHub MCP server
3. Server fetches issue #789 content
4. Content attached to conversation
5. LLM analyzes and responds

**Using Prompts:**

```
> /mcp__github__issue_analysis 789
```

**Behind the scenes:**
1. Claude Code invokes `prompts/get` for "issue_analysis"
2. Server returns templated prompt with issue #789 details
3. Prompt injected into conversation
4. LLM follows prompt structure

### Example 2: Database Schema Review

**Using Resources:**

```
> Compare @postgres:schema://public/users with @postgres:schema://public/profiles and suggest a normalization strategy.
```

**Multiple resources fetched:**
1. Users table schema
2. Profiles table schema
3. Both provided to LLM for analysis

**Using Prompts:**

```
> /mcp__database__schema_review public users
```

**Prompt provides:**
- Structured analysis template
- Best practice guidelines
- Specific review criteria

### Example 3: Code Review Workflow

**Combine Resources and Prompts:**

```
> /mcp__github__pr_review 456 performance
```

Then follow up with:

```
> Now compare the changes in this PR with our coding standards at @docs:file://standards/performance.md
```

**Workflow:**
1. Prompt structures initial review
2. Resource provides additional context
3. LLM gives comprehensive analysis

---

## Best Practices

### Using Resources Effectively

**DO:**
- ✅ Reference resources when you need fresh external data
- ✅ Use descriptive resource URIs
- ✅ Combine multiple resources for comprehensive context
- ✅ Leverage fuzzy search in autocomplete
- ✅ Cache frequently accessed resources (if supported)

**DON'T:**
- ❌ Don't use resources for data that should be tools (e.g., write operations)
- ❌ Don't assume resource format without checking
- ❌ Don't reference resources that require authentication without setup
- ❌ Don't over-rely on large resources (token limits apply)

### Using Prompts Effectively

**DO:**
- ✅ Use prompts for standardized workflows
- ✅ Provide all required arguments
- ✅ Use descriptive argument values
- ✅ Combine prompts with follow-up questions
- ✅ Create specialized prompts for common tasks

**DON'T:**
- ❌ Don't use prompts when simple questions suffice
- ❌ Don't skip required arguments
- ❌ Don't assume prompts are updated without checking
- ❌ Don't rely solely on prompts for complex multi-step workflows

### Combining Resources and Prompts

**Powerful Pattern:**
1. Use prompt to structure analysis
2. Reference resources for context
3. Get consistent, well-informed results

**Example:**

```
> /mcp__sentry__error_analysis abc123
> Also consider the recent code changes at @github:pr://456
```

### Security Considerations

**Resources:**
- Review resource permissions before granting access
- Be cautious with resources containing sensitive data
- Verify resource URIs are from trusted servers
- Monitor resource access logs

**Prompts:**
- Review prompt templates before trusting blindly
- Validate prompt arguments for injection risks
- Use prompts from verified servers only
- Be aware of prompt injection vulnerabilities

---

## Troubleshooting

### Resources Not Appearing

**Issue:** Resources don't show in @ autocomplete

**Solutions:**
1. Verify MCP server is connected: `/mcp` (Claude Code) or `gemini mcp list`
2. Check server exposes resources: Server must implement `resources/list`
3. Restart AI application to refresh resource registry
4. Check server logs for errors

### Resource Fetch Failures

**Issue:** Resource reference fails to fetch content

**Solutions:**
1. Verify URI format matches server expectations
2. Check authentication for remote resources
3. Ensure resource exists (e.g., issue #123 is valid)
4. Review server logs for detailed errors
5. Check network connectivity for remote servers

### Prompts Not Available

**Issue:** Expected prompt command not appearing

**Solutions:**
1. Confirm server is connected and running
2. Verify server implements `prompts/list` and `prompts/get`
3. Check prompt naming (spaces become underscores)
4. Restart application to refresh prompt registry
5. Use `/mcp` or `gemini mcp list` to verify server status

### Prompt Argument Errors

**Issue:** Prompt fails with argument errors

**Solutions:**
1. Check required vs. optional arguments
2. Use quotes for multi-word arguments
3. Verify argument types match expectations
4. Review prompt definition with `prompts/list`
5. Check server documentation for argument formats

---

## Advanced Topics

### Dynamic Resource Updates

MCP supports real-time resource updates via notifications:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}
```

When received, clients refresh their resource registry.

### Resource Subscriptions

Some MCP servers support resource subscriptions for live updates:

```json
{
  "jsonrpc": "2.0",
  "method": "resources/subscribe",
  "params": {
    "uri": "monitoring://alerts/critical"
  }
}
```

### Prompt Composition

Advanced workflows can chain multiple prompts:

```
> /mcp__github__pr_review 456
> /mcp__sentry__check_related_errors
> /mcp__jira__create_followup_tasks
```

Each prompt builds on previous context.

### Resource Content Types

Resources can return various content types:

```json
{
  "contents": [
    {
      "uri": "docs://screenshot",
      "mimeType": "image/png",
      "blob": "base64-encoded-data"
    },
    {
      "uri": "api://schema",
      "mimeType": "application/json",
      "text": "{\"schema\": {...}}"
    }
  ]
}
```

---

## Related Documentation

**Core Concepts:**
- [Core Primitives](../01-fundamentals/core-primitives.md) - Understanding MCP primitives
- [MCP Introduction](../../../en/references/mcp/mcp-introduction.md) - Complete MCP overview

**Platform Guides:**
- [Claude Code MCP Usage](../../../en/references/mcp/mcp-usage-claude-code.md) - Full Claude Code reference
- [Gemini CLI MCP](../../../en/references/mcp/mcp-gemini-cli.md) - Complete Gemini CLI guide

**Server Development:**
- [Building MCP Servers](../../../en/references/mcp/mcp-server-builder.md) - Create custom servers
- [MCP Specification](https://modelcontextprotocol.io/specification/latest) - Official spec

---

## Summary

### Key Takeaways

**Resources:**
- Data sources referenceable with @ mentions
- Automatic fetching and context injection
- Support multiple content types
- URI-based with template support

**Prompts:**
- Reusable templates as slash commands
- Structured interaction patterns
- Argument substitution
- Multi-message support

**Platform Support:**
- Claude Code: Full @ and /mcp__ support
- Gemini CLI: Complete resource and prompt integration
- Consistent experience across platforms

**Best Practices:**
- Use resources for external data context
- Use prompts for standardized workflows
- Combine both for powerful interactions
- Always verify server trust and permissions

---

**Last Updated:** February 2026
**Category:** MCP Usage
**Module:** 02-using-mcp
**Cross-References:** core-primitives.md, authentication.md
