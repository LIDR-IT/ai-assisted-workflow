# Testing MCP Servers

Testing is a critical phase in MCP server development that ensures your server works correctly, handles errors gracefully, and provides a reliable experience for AI assistants. This guide covers comprehensive testing strategies, from code review to manual verification using the MCP Inspector.

## Overview

Testing an MCP server involves multiple layers:

1. **Code Review** - Verify code quality, error handling, and type safety
2. **Build Verification** - Ensure the code compiles and passes static analysis
3. **MCP Inspector Testing** - Use the official tool to validate protocol compliance
4. **Manual Testing** - Test with direct JSON-RPC calls
5. **Edge Case Testing** - Verify behavior under unusual conditions
6. **Integration Testing** - Test with real AI assistants

This comprehensive approach ensures your server is production-ready before deployment.

## Prerequisites

Before testing, ensure you have:

- Completed server implementation (see [Implementation Guide](./implementation-guide.md))
- Development environment set up
- MCP Inspector installed globally
- Access to test accounts for your target API (if applicable)
- Test data prepared for various scenarios

## Phase 1: Code Review

Code review is the first line of defense against bugs and poor design. Use this checklist to systematically review your implementation.

### Code Review Checklist

#### DRY Principle (Don't Repeat Yourself)

Eliminate code duplication by extracting common patterns:

- [ ] Shared utilities for common operations
- [ ] Reusable error handling functions
- [ ] Consistent API client usage across tools
- [ ] No duplicated validation logic
- [ ] Centralized configuration management

**Example: Refactoring Duplicated Code**

```typescript
// ❌ Poor: Duplicated error handling
async function createIssue(args: any) {
  try {
    const result = await githubClient.createIssue(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
    throw new Error(`Failed to create issue: ${error.message}`);
  }
}

async function updateIssue(args: any) {
  try {
    const result = await githubClient.updateIssue(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
    throw new Error(`Failed to update issue: ${error.message}`);
  }
}

// ✅ Good: Shared error handling utility
function handleAPIError(error: unknown, operation: string): never {
  if (error instanceof APIError) {
    throw new Error(`GitHub API error during ${operation}: ${error.message}`);
  }
  throw new Error(`Failed to ${operation}: ${error.message}`);
}

function formatToolResponse(data: any): ToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
  };
}

async function createIssue(args: any) {
  try {
    const result = await githubClient.createIssue(args);
    return formatToolResponse(result);
  } catch (error) {
    handleAPIError(error, "create issue");
  }
}

async function updateIssue(args: any) {
  try {
    const result = await githubClient.updateIssue(args);
    return formatToolResponse(result);
  } catch (error) {
    handleAPIError(error, "update issue");
  }
}
```

#### Error Handling

Ensure errors are informative and actionable:

- [ ] Actionable error messages that guide users
- [ ] Proper status code handling from external APIs
- [ ] Graceful fallbacks for non-critical failures
- [ ] User-friendly error responses (avoid technical jargon)
- [ ] Error context preservation (include relevant request data)

**Example: Improving Error Messages**

```typescript
// ❌ Poor: Vague error message
try {
  const result = await api.call();
  return result;
} catch (e) {
  return { error: 'Failed' };
}

// ⚠️ Better: More context, but not actionable
try {
  const result = await api.call(repository, title);
  return result;
} catch (error) {
  throw new Error(`API call failed: ${error.message}`);
}

// ✅ Best: Actionable with troubleshooting hints
try {
  const result = await api.createIssue(repository, title, body);
  return result;
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 401) {
      throw new Error(
        'Authentication failed. Please check your API token is valid ' +
        'and has the required permissions (repo scope for private repositories).'
      );
    }
    if (error.status === 404) {
      throw new Error(
        `Repository '${repository}' not found. Verify the repository exists ` +
        'and your token has access to it.'
      );
    }
    if (error.status === 422) {
      throw new Error(
        `Invalid issue data: ${error.message}. Check that title is not empty ` +
        'and all required fields are provided.'
      );
    }
    throw new Error(`GitHub API error (${error.status}): ${error.message}`);
  }
  throw new Error(
    `Unexpected error creating issue: ${error.message}. ` +
    'Please check your network connection and try again.'
  );
}
```

#### Type Coverage

Strong typing prevents runtime errors:

- [ ] Input schemas for all tools (using Zod or similar)
- [ ] Response type definitions
- [ ] No `any` types in critical paths
- [ ] Proper type inference
- [ ] Discriminated unions for complex types

**Example: Adding Type Safety**

```typescript
// ❌ Poor: No type safety
async function handleToolCall(name: string, args: any) {
  if (name === "create_issue") {
    return await createIssue(args.repo, args.title, args.body);
  }
}

// ⚠️ Better: Some types, but still using 'any'
interface ToolArgs {
  [key: string]: any;
}

async function handleToolCall(name: string, args: ToolArgs) {
  if (name === "create_issue") {
    return await createIssue(
      args.repo as string,
      args.title as string,
      args.body as string
    );
  }
}

// ✅ Best: Full type safety with schema validation
import { z } from 'zod';

const CreateIssueSchema = z.object({
  repository: z.string().regex(/^[\w-]+\/[\w-]+$/, 'Must be format: owner/repo'),
  title: z.string().min(1, 'Title cannot be empty').max(256),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional()
});

type CreateIssueArgs = z.infer<typeof CreateIssueSchema>;

async function handleToolCall(
  name: string,
  args: unknown
): Promise<ToolResponse> {
  if (name === "github_create_issue") {
    const validated = CreateIssueSchema.parse(args);
    return await createIssue(validated);
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function createIssue(args: CreateIssueArgs): Promise<ToolResponse> {
  // TypeScript knows exact shape of args
  const result = await githubClient.createIssue({
    repository: args.repository,
    title: args.title,
    body: args.body ?? '',
    labels: args.labels ?? [],
    assignees: args.assignees ?? []
  });

  return formatToolResponse(result);
}
```

#### Code Structure

Ensure maintainability:

- [ ] Logical file organization
- [ ] Clear separation of concerns
- [ ] Reasonable function length (< 50 lines ideally)
- [ ] Descriptive naming conventions
- [ ] Adequate comments for complex logic

## Phase 2: Build and Syntax Check

Before runtime testing, ensure your code compiles and passes static analysis.

### TypeScript Projects

```bash
# Clean previous builds
rm -rf dist/

# Build the project
npm run build

# Check for type errors without emitting files
npx tsc --noEmit

# Run linter (fix automatically where possible)
npx eslint src/ --fix

# Check formatting
npx prettier --check src/

# Fix formatting
npx prettier --write src/
```

**Common TypeScript errors to watch for:**

```typescript
// Type errors
const value: string = 123; // ❌ Type 'number' not assignable to 'string'

// Missing return types
async function fetchData() { // ⚠️ Should specify return type
  return await api.getData();
}

// Unused variables
function process(data: Data, extra: string) { // ⚠️ 'extra' is unused
  return transform(data);
}

// Implicit any
function transform(input) { // ❌ Parameter 'input' implicitly has 'any' type
  return input.value;
}
```

### Python Projects

```bash
# Activate virtual environment
source venv/bin/activate

# Check syntax for all Python files
python -m py_compile src/**/*.py

# Type checking with mypy
mypy src/ --strict

# Run linter
ruff check src/

# Auto-fix linting issues
ruff check src/ --fix

# Format code
black src/

# Check imports are sorted
isort src/ --check-only

# Sort imports
isort src/
```

**Common Python errors to watch for:**

```python
# Type hints missing
def fetch_data(url):  # ⚠️ Should have type hints
    return requests.get(url)

# Incorrect type hints
def process(data: str) -> int:
    return data  # ❌ Return type doesn't match annotation

# Unused imports
import json
import os  # ⚠️ Unused import

# Shadowing built-ins
def process(list: List[str]):  # ❌ Don't shadow 'list' built-in
    return list
```

### Build Success Criteria

Your build should pass with:

- ✅ Zero compilation errors
- ✅ Zero type errors
- ✅ All linting rules passed (or explicitly suppressed with justification)
- ✅ All formatting consistent
- ✅ No unused imports or variables

## Phase 3: MCP Inspector Testing

The **MCP Inspector** is the official tool for testing MCP servers. It provides a visual interface to test protocol compliance and tool functionality.

### Installing MCP Inspector

Install globally for easy access:

```bash
# Using npm
npm install -g @modelcontextprotocol/inspector

# Using yarn
yarn global add @modelcontextprotocol/inspector

# Verify installation
mcp-inspector --version
```

### Launching MCP Inspector

The inspector connects to your server based on its transport type.

**For stdio servers (most common):**

```bash
# TypeScript server
mcp-inspector npx tsx src/index.ts

# Python server
mcp-inspector python -m mcp_server_myservice

# Node.js compiled server
mcp-inspector node dist/index.js
```

**For SSE servers (HTTP-based):**

```bash
# First, start your server
npm start

# Then connect inspector to running server
mcp-inspector http://localhost:3000/mcp
```

**For custom commands:**

```bash
# Using full command
mcp-inspector npx -y @my-org/my-mcp-server

# With environment variables
GITHUB_TOKEN=abc123 mcp-inspector npx tsx src/index.ts

# With custom args
mcp-inspector python src/server.py --debug --port 8080
```

### MCP Inspector Interface

When launched, the inspector opens in your browser with these sections:

1. **Connection Status** - Shows server initialization state
2. **Server Info** - Displays server name, version, capabilities
3. **Tools List** - All available tools with their schemas
4. **Tool Tester** - Interactive form to call tools
5. **Request/Response Log** - Raw JSON-RPC messages
6. **Resources** (if applicable) - Available resources list
7. **Prompts** (if applicable) - Available prompt templates

### Testing Workflow

Follow this systematic approach to test your server.

#### Step 1: Verify Initialization

When the inspector connects, check:

- [ ] Server connects successfully (no error messages)
- [ ] Server name and version displayed correctly
- [ ] Capabilities match your implementation
- [ ] Protocol version is correct (typically "2024-11-05")

**Expected output:**

```json
{
  "protocolVersion": "2024-11-05",
  "capabilities": {
    "tools": {}
  },
  "serverInfo": {
    "name": "github-mcp-server",
    "version": "1.0.0"
  }
}
```

**Common initialization issues:**

```bash
# ❌ Server doesn't start
# Check: Is the command correct?
# Check: Are dependencies installed?
# Check: Are environment variables set?

# ❌ Protocol version mismatch
# Update your SDK version to match inspector

# ❌ Server crashes immediately
# Check: Error logs in terminal
# Check: Syntax errors in code
```

#### Step 2: Test Tool Discovery

Verify all tools are listed correctly:

- [ ] All implemented tools appear in the list
- [ ] Tool names follow naming conventions (lowercase, underscores)
- [ ] Descriptions are clear and helpful
- [ ] Input schemas are complete and accurate
- [ ] Required vs optional parameters marked correctly

**Click on each tool to inspect:**

```json
{
  "name": "github_create_issue",
  "description": "Create a new issue in a GitHub repository",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repository": {
        "type": "string",
        "description": "Repository in format 'owner/repo'"
      },
      "title": {
        "type": "string",
        "description": "Issue title"
      },
      "body": {
        "type": "string",
        "description": "Issue description (optional)"
      }
    },
    "required": ["repository", "title"]
  }
}
```

#### Step 3: Execute Tools with Valid Inputs

Test the happy path first:

1. Select a tool from the list
2. Fill in the form with valid test data
3. Click "Call Tool"
4. Verify the response

**Example test cases:**

```json
// Test Case 1: Minimal valid input
{
  "repository": "test-org/test-repo",
  "title": "Test issue from MCP Inspector"
}

// Test Case 2: Full featured input
{
  "repository": "test-org/test-repo",
  "title": "Feature request: Dark mode",
  "body": "Would love to see dark mode support...",
  "labels": ["enhancement", "ui"],
  "assignees": ["johndoe"]
}

// Test Case 3: Edge of valid input
{
  "repository": "a/b",
  "title": "x"
}
```

**Verify responses:**

- [ ] Response format matches expected structure
- [ ] Response contains all necessary data
- [ ] Response is readable and formatted nicely
- [ ] No unexpected errors

#### Step 4: Execute Tools with Invalid Inputs

Test error handling thoroughly:

**Empty/missing required fields:**

```json
// Missing required field
{
  "repository": "test-org/test-repo"
  // Missing 'title'
}

// Empty required field
{
  "repository": "test-org/test-repo",
  "title": ""
}

// Null value
{
  "repository": "test-org/test-repo",
  "title": null
}
```

**Invalid formats:**

```json
// Invalid repository format
{
  "repository": "invalid-format",
  "title": "Test issue"
}

// Wrong type
{
  "repository": 123,
  "title": "Test issue"
}

// Invalid enum value
{
  "repository": "test-org/test-repo",
  "title": "Test",
  "state": "invalid_state"
}
```

**Verify error messages:**

- [ ] Error messages are clear and actionable
- [ ] Error messages don't expose sensitive information
- [ ] Schema validation errors are helpful
- [ ] API errors are translated to user-friendly messages

#### Step 5: Test Edge Cases

Test unusual but valid scenarios:

**Boundary values:**

```json
// Very long strings
{
  "repository": "test-org/test-repo",
  "title": "A".repeat(1000),
  "body": "B".repeat(50000)
}

// Special characters
{
  "repository": "test-org/test-repo",
  "title": "Issue with émojis 🎉 and symbols <>&",
  "body": "Code: ```javascript\nconst x = 'test';\n```"
}

// Unicode
{
  "repository": "test-org/test-repo",
  "title": "日本語のテスト",
  "body": "Testing 中文字符"
}
```

**Large datasets:**

```json
// Many labels
{
  "repository": "test-org/test-repo",
  "title": "Test",
  "labels": ["label1", "label2", "label3", ...] // 50+ labels
}

// Many assignees
{
  "repository": "test-org/test-repo",
  "title": "Test",
  "assignees": ["user1", "user2", "user3", ...] // 20+ users
}
```

**Timing issues:**

```json
// Test rate limiting
// Call the same tool rapidly 10+ times

// Test timeout handling
// Use parameters that cause slow API responses
```

### Viewing Request/Response Logs

The inspector logs all JSON-RPC messages:

**Successful tool call:**

```json
// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "test-org/test-repo",
      "title": "Test issue"
    }
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"number\": 42,\n  \"title\": \"Test issue\",\n  \"url\": \"https://github.com/test-org/test-repo/issues/42\"\n}"
      }
    ]
  }
}
```

**Error response:**

```json
// Request
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "invalid"
    }
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 2,
  "error": {
    "code": -32602,
    "message": "Invalid repository format. Expected 'owner/repo', got 'invalid'"
  }
}
```

## Phase 4: Manual JSON-RPC Testing

For automated testing or debugging, send JSON-RPC directly to your server.

### Using stdio Transport

**Test initialization:**

```bash
echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "test-client",
      "version": "1.0.0"
    }
  }
}' | npx tsx src/index.ts
```

**Test tool listing:**

```bash
echo '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}' | npx tsx src/index.ts
```

**Test tool execution:**

```bash
echo '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "test-org/test-repo",
      "title": "Test from command line"
    }
  }
}' | GITHUB_TOKEN=your_token npx tsx src/index.ts
```

### Using curl for HTTP Servers

**Test tool listing:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

**Test tool execution:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "github_create_issue",
      "arguments": {
        "repository": "test-org/test-repo",
        "title": "Test from curl"
      }
    }
  }'
```

### Automated Testing Script

Create a test script for regression testing:

```bash
#!/bin/bash

# test-server.sh

SERVER_CMD="npx tsx src/index.ts"
GITHUB_TOKEN="your_test_token"

echo "=== Testing MCP Server ==="

# Test 1: Initialization
echo -e "\n1. Testing initialization..."
RESPONSE=$(echo '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {"name": "test", "version": "1.0.0"}
  }
}' | $SERVER_CMD)

if echo "$RESPONSE" | jq -e '.result.serverInfo.name' > /dev/null; then
  echo "   ✅ Initialization successful"
else
  echo "   ❌ Initialization failed"
  exit 1
fi

# Test 2: Tool listing
echo -e "\n2. Testing tool listing..."
RESPONSE=$(echo '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}' | $SERVER_CMD)

TOOL_COUNT=$(echo "$RESPONSE" | jq '.result.tools | length')
if [ "$TOOL_COUNT" -gt 0 ]; then
  echo "   ✅ Found $TOOL_COUNT tools"
else
  echo "   ❌ No tools found"
  exit 1
fi

# Test 3: Valid tool call
echo -e "\n3. Testing valid tool call..."
RESPONSE=$(echo '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "test-org/test-repo",
      "title": "Automated test issue"
    }
  }
}' | GITHUB_TOKEN=$GITHUB_TOKEN $SERVER_CMD)

if echo "$RESPONSE" | jq -e '.result.content[0].text' > /dev/null; then
  echo "   ✅ Tool execution successful"
else
  echo "   ❌ Tool execution failed"
  echo "$RESPONSE" | jq
  exit 1
fi

# Test 4: Invalid input
echo -e "\n4. Testing error handling..."
RESPONSE=$(echo '{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "repository": "invalid"
    }
  }
}' | $SERVER_CMD)

if echo "$RESPONSE" | jq -e '.error' > /dev/null; then
  echo "   ✅ Error handling works"
else
  echo "   ❌ Error not properly handled"
  exit 1
fi

echo -e "\n=== All tests passed! ✅ ==="
```

## Phase 5: Integration Testing

Test with real AI assistants to verify end-to-end functionality.

### Testing with Claude Desktop

1. Add your server to Claude Desktop's config:

```json
{
  "mcpServers": {
    "github-test": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_token"
      }
    }
  }
}
```

2. Restart Claude Desktop

3. Test natural language queries:

```
"Create a GitHub issue in my test repository titled 'Bug report' with description 'App crashes on startup'"

"List all open issues in test-org/test-repo"

"Update issue #42 in my repository to mark it as closed"
```

### Testing with Cursor

1. Add server to `.cursor/mcp.json`
2. Restart Cursor
3. Use `Ctrl+Shift+P` → "MCP: List Servers" to verify
4. Test in chat with `@github` mentions

### Testing Checklist

- [ ] Server appears in MCP settings
- [ ] Natural language queries work correctly
- [ ] Tool selection is appropriate for queries
- [ ] Results are formatted clearly in chat
- [ ] Errors are displayed to users gracefully
- [ ] Follow-up questions work (context maintained)

## Edge Case Testing Strategies

### Authentication Edge Cases

```typescript
// Test expired tokens
// Test tokens with insufficient permissions
// Test missing tokens
// Test malformed tokens
```

### Network Edge Cases

```typescript
// Test slow network (add artificial delays)
// Test network failures (disconnect during request)
// Test partial responses
// Test timeout handling
```

### Data Edge Cases

```typescript
// Test empty results
// Test very large results (pagination needed)
// Test malformed API responses
// Test unexpected data types from API
```

### Concurrency Edge Cases

```typescript
// Test multiple simultaneous tool calls
// Test race conditions
// Test resource cleanup after errors
```

## Verification Procedures

### Pre-Release Checklist

Before deploying your server:

- [ ] All tests pass in MCP Inspector
- [ ] Manual JSON-RPC tests successful
- [ ] Integration tests with AI assistant passed
- [ ] Error messages are user-friendly
- [ ] Documentation is complete
- [ ] README includes setup instructions
- [ ] Example usage provided
- [ ] Security review completed (no exposed secrets)
- [ ] Performance acceptable (tools respond in < 5s)
- [ ] Rate limiting implemented (if needed)

### Performance Benchmarks

```bash
# Test tool response time
time echo '{...tool call...}' | npx tsx src/index.ts

# Acceptable: < 5 seconds for most operations
# Warning: 5-10 seconds (consider optimization)
# Unacceptable: > 10 seconds (must optimize)
```

### Security Verification

- [ ] API keys loaded from environment variables (never hardcoded)
- [ ] Input validation prevents injection attacks
- [ ] Error messages don't leak sensitive information
- [ ] HTTPS used for external API calls
- [ ] Dependencies scanned for vulnerabilities (`npm audit`)

## Troubleshooting Common Issues

### Inspector Connection Fails

```bash
# Check server starts independently
npx tsx src/index.ts

# Check for syntax errors
npx tsc --noEmit

# Check dependencies installed
npm install

# Try with verbose logging
DEBUG=mcp:* mcp-inspector npx tsx src/index.ts
```

### Tools Not Appearing

```typescript
// Verify tool registration
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "github_create_issue",
      description: "Create a GitHub issue",
      inputSchema: { /* schema */ }
    }
  ]
}));

// Check tool names are lowercase with underscores
// ❌ "createIssue" or "create-issue"
// ✅ "create_issue"
```

### Tool Execution Fails

```typescript
// Add detailed logging
console.error('Tool call failed:', {
  name,
  args,
  error: error.message,
  stack: error.stack
});

// Verify handler is registered
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Handler code
});

// Check argument validation
const validated = schema.parse(request.params.arguments);
```

## Next Steps

After thorough testing:

1. Document any known limitations or edge cases
2. Create example usage guide for end users
3. Publish to npm (TypeScript) or PyPI (Python)
4. Add to MCP server registry
5. Monitor real-world usage and iterate

## Related Resources

- [Error Handling Guide](./error-handling.md) - Strategies for robust error handling
- [Implementation Guide](./implementation-guide.md) - Full implementation walkthrough
- [Tools and Schemas](./tools-and-schemas.md) - Designing effective tool interfaces
- [MCP Inspector Documentation](https://github.com/modelcontextprotocol/inspector) - Official testing tool

## Summary

Testing is not optional—it's essential for building reliable MCP servers. By following this comprehensive testing approach:

- **Code review** ensures quality before runtime
- **Build verification** catches syntax and type errors
- **MCP Inspector** validates protocol compliance
- **Manual testing** enables automation
- **Edge cases** reveal hidden bugs
- **Integration tests** confirm real-world functionality

Invest time in thorough testing to build MCP servers that users can trust and rely on.
