# Error Handling in MCP Servers

## Overview

Effective error handling is critical for MCP servers. When errors occur, AI agents need clear, actionable guidance to resolve issues and continue their work. Poor error messages lead to confusion, failed tasks, and degraded user experiences.

This guide covers how to implement robust error handling that helps both agents and developers diagnose and resolve problems quickly.

## Why Error Handling Matters

### For AI Agents

AI agents rely on error messages to:
- **Understand what went wrong** and why the operation failed
- **Determine next steps** based on the error type
- **Guide users** toward resolving authentication, permission, or configuration issues
- **Make informed decisions** about retrying operations or trying alternatives

### For Developers

Good error handling helps developers:
- **Debug issues faster** with clear error context
- **Monitor server health** by tracking error patterns
- **Improve reliability** by handling edge cases gracefully
- **Provide better UX** through actionable error messages

## Core Principles

### 1. Be Actionable

Every error message should guide the user toward a solution.

```typescript
// ❌ Not actionable
throw new Error('Invalid token');

// ✅ Actionable
throw new Error(
  'Authentication failed: Invalid API token. ' +
  'Generate a new token at https://github.com/settings/tokens ' +
  'and set it in the GITHUB_TOKEN environment variable.'
);
```

### 2. Be Specific

Provide context about what failed and why.

```typescript
// ❌ Too vague
throw new Error('Request failed');

// ✅ Specific
throw new Error(
  'Failed to create issue: Repository "owner/repo" not found. ' +
  'Verify the repository name and ensure you have access.'
);
```

### 3. Be Consistent

Use consistent error formats and status codes across your server.

```typescript
// Define standard error structure
interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
  suggestion?: string;
}
```

### 4. Include Context

Add relevant information that helps diagnose the issue.

```typescript
// ✅ Good context
throw new Error(
  `Rate limit exceeded for endpoint /repos/${repo}/issues. ` +
  `Retry after ${resetTime}. ` +
  `Current usage: ${used}/${limit} requests.`
);
```

## Custom Error Classes

### TypeScript Implementation

Create specialized error classes for different error types:

```typescript
// src/utils/errors.ts

/**
 * Base error class for API-related errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to actionable message for AI agents
   */
  toActionableMessage(): string {
    const baseMessage = this.getStatusMessage();
    const context = this.getContextMessage();
    const suggestion = this.getSuggestion();

    return [baseMessage, context, suggestion]
      .filter(Boolean)
      .join(' ');
  }

  private getStatusMessage(): string {
    switch (this.statusCode) {
      case 401:
        return 'Authentication failed.';
      case 403:
        return 'Permission denied.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation failed.';
      case 429:
        return 'Rate limit exceeded.';
      case 500:
        return 'Server error occurred.';
      case 503:
        return 'Service temporarily unavailable.';
      default:
        return `API error (${this.statusCode}).`;
    }
  }

  private getContextMessage(): string {
    if (this.endpoint) {
      return `Endpoint: ${this.endpoint}.`;
    }
    if (this.response?.message) {
      return this.response.message;
    }
    return this.message;
  }

  private getSuggestion(): string {
    switch (this.statusCode) {
      case 401:
        return 'Check your API key in environment variables and ensure it is valid.';
      case 403:
        return 'Ensure your API key has the required permissions for this operation.';
      case 404:
        return 'Verify the resource ID or endpoint path is correct.';
      case 422:
        return 'Check that all required fields are provided with valid values.';
      case 429:
        return 'Wait before retrying. Check rate limit headers for reset time.';
      case 500:
        return 'This is a server-side issue. Try again later or contact support.';
      case 503:
        return 'The service is temporarily down. Retry after a few minutes.';
      default:
        return 'Review the error details and try again.';
    }
  }
}

/**
 * Authentication-specific error
 */
export class AuthenticationError extends APIError {
  constructor(message: string, response?: any) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
  }

  toActionableMessage(): string {
    return (
      'Authentication failed: Invalid or missing API credentials. ' +
      'Ensure your API key is set correctly in environment variables. ' +
      'For GitHub, generate a new token at https://github.com/settings/tokens ' +
      'and set it as GITHUB_TOKEN.'
    );
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends APIError {
  constructor(
    message: string,
    public resetTime: Date,
    public limit: number,
    public remaining: number
  ) {
    super(message, 429);
    this.name = 'RateLimitError';
  }

  toActionableMessage(): string {
    const resetTimeStr = this.resetTime.toLocaleTimeString();
    return (
      `Rate limit exceeded: You have used ${this.limit - this.remaining} of ${this.limit} requests. ` +
      `The limit resets at ${resetTimeStr}. ` +
      `Wait until then before making more requests.`
    );
  }
}

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public expected?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toActionableMessage(): string {
    if (this.field && this.expected) {
      return (
        `Validation failed for field "${this.field}": ${this.message}. ` +
        `Expected: ${this.expected}.`
      );
    }
    return `Validation failed: ${this.message}`;
  }
}

/**
 * Network-related error
 */
export class NetworkError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'NetworkError';
  }

  toActionableMessage(): string {
    return (
      `Network error: ${this.message}. ` +
      'Check your internet connection and verify the API endpoint is accessible. ' +
      'If the issue persists, the service may be experiencing downtime.'
    );
  }
}
```

### Python Implementation

```python
# src/utils/errors.py
from datetime import datetime
from typing import Optional, Dict, Any

class APIError(Exception):
    """Base error class for API-related errors"""

    def __init__(
        self,
        message: str,
        status_code: int,
        response: Optional[Dict[str, Any]] = None,
        endpoint: Optional[str] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.response = response
        self.endpoint = endpoint

    def to_actionable_message(self) -> str:
        """Convert error to actionable message for AI agents"""
        parts = [
            self._get_status_message(),
            self._get_context_message(),
            self._get_suggestion()
        ]
        return " ".join(filter(None, parts))

    def _get_status_message(self) -> str:
        messages = {
            401: "Authentication failed.",
            403: "Permission denied.",
            404: "Resource not found.",
            422: "Validation failed.",
            429: "Rate limit exceeded.",
            500: "Server error occurred.",
            503: "Service temporarily unavailable."
        }
        return messages.get(self.status_code, f"API error ({self.status_code}).")

    def _get_context_message(self) -> str:
        if self.endpoint:
            return f"Endpoint: {self.endpoint}."
        if self.response and "message" in self.response:
            return self.response["message"]
        return self.message

    def _get_suggestion(self) -> str:
        suggestions = {
            401: "Check your API key in environment variables and ensure it is valid.",
            403: "Ensure your API key has the required permissions for this operation.",
            404: "Verify the resource ID or endpoint path is correct.",
            422: "Check that all required fields are provided with valid values.",
            429: "Wait before retrying. Check rate limit headers for reset time.",
            500: "This is a server-side issue. Try again later or contact support.",
            503: "The service is temporarily down. Retry after a few minutes."
        }
        return suggestions.get(
            self.status_code,
            "Review the error details and try again."
        )


class AuthenticationError(APIError):
    """Authentication-specific error"""

    def __init__(self, message: str, response: Optional[Dict[str, Any]] = None):
        super().__init__(message, 401, response)

    def to_actionable_message(self) -> str:
        return (
            "Authentication failed: Invalid or missing API credentials. "
            "Ensure your API key is set correctly in environment variables. "
            "For GitHub, generate a new token at https://github.com/settings/tokens "
            "and set it as GITHUB_TOKEN."
        )


class RateLimitError(APIError):
    """Rate limiting error"""

    def __init__(
        self,
        message: str,
        reset_time: datetime,
        limit: int,
        remaining: int
    ):
        super().__init__(message, 429)
        self.reset_time = reset_time
        self.limit = limit
        self.remaining = remaining

    def to_actionable_message(self) -> str:
        reset_str = self.reset_time.strftime("%I:%M:%S %p")
        used = self.limit - self.remaining
        return (
            f"Rate limit exceeded: You have used {used} of {self.limit} requests. "
            f"The limit resets at {reset_str}. "
            "Wait until then before making more requests."
        )


class ValidationError(Exception):
    """Validation error"""

    def __init__(
        self,
        message: str,
        field: Optional[str] = None,
        expected: Optional[str] = None
    ):
        super().__init__(message)
        self.field = field
        self.expected = expected

    def to_actionable_message(self) -> str:
        if self.field and self.expected:
            return (
                f'Validation failed for field "{self.field}": {self.message}. '
                f"Expected: {self.expected}."
            )
        return f"Validation failed: {self.message}"


class NetworkError(Exception):
    """Network-related error"""

    def __init__(self, message: str, cause: Optional[Exception] = None):
        super().__init__(message)
        self.cause = cause

    def to_actionable_message(self) -> str:
        return (
            f"Network error: {self.message}. "
            "Check your internet connection and verify the API endpoint is accessible. "
            "If the issue persists, the service may be experiencing downtime."
        )
```

## HTTP Status Code Mapping

Map HTTP status codes to appropriate error types and messages:

### Common Status Codes

| Status Code | Error Type | Meaning | Suggestion |
|-------------|------------|---------|------------|
| 400 | Bad Request | Invalid request format | Check request parameters and format |
| 401 | Unauthorized | Authentication failed | Verify API credentials |
| 403 | Forbidden | Permission denied | Check API key permissions |
| 404 | Not Found | Resource doesn't exist | Verify resource ID or path |
| 422 | Unprocessable Entity | Validation failed | Check required fields and types |
| 429 | Too Many Requests | Rate limit exceeded | Wait and retry later |
| 500 | Internal Server Error | Server-side error | Contact support or retry |
| 503 | Service Unavailable | Service is down | Retry after delay |

### Implementation Example

```typescript
// src/client.ts
import {
  APIError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NetworkError
} from './utils/errors.js';

export class APIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle error responses
      if (!response.ok) {
        await this.handleErrorResponse(response, endpoint);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(
          `Failed to connect to ${this.baseUrl}`,
          error
        );
      }
      throw error;
    }
  }

  private async handleErrorResponse(
    response: Response,
    endpoint: string
  ): Promise<never> {
    const status = response.status;
    let body: any;

    try {
      body = await response.json();
    } catch {
      body = { message: response.statusText };
    }

    // Handle specific status codes
    switch (status) {
      case 401:
        throw new AuthenticationError(
          body.message || 'Authentication failed',
          body
        );

      case 429:
        const resetTime = this.parseRateLimitReset(response);
        const limit = parseInt(response.headers.get('x-ratelimit-limit') || '0');
        const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
        throw new RateLimitError(
          body.message || 'Rate limit exceeded',
          resetTime,
          limit,
          remaining
        );

      case 422:
        throw new ValidationError(
          body.message || 'Validation failed',
          body.field,
          body.expected
        );

      default:
        throw new APIError(
          body.message || response.statusText,
          status,
          body,
          endpoint
        );
    }
  }

  private parseRateLimitReset(response: Response): Date {
    const resetHeader = response.headers.get('x-ratelimit-reset');
    if (resetHeader) {
      return new Date(parseInt(resetHeader) * 1000);
    }
    // Default to 1 hour from now
    return new Date(Date.now() + 3600000);
  }
}
```

## Error Response Formatting

### MCP Error Response Structure

When returning errors from tool handlers, use the MCP error format:

```typescript
// Tool handler with error handling
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'github_create_issue':
        return await createIssue(client, args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Convert errors to actionable messages
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    if (error instanceof ValidationError) {
      throw new Error(error.toActionableMessage());
    }
    if (error instanceof NetworkError) {
      throw new Error(error.toActionableMessage());
    }

    // Re-throw with context
    throw new Error(`Tool execution failed: ${error.message}`);
  }
});
```

### Error Response Best Practices

**Include multiple content types:**

```typescript
// Return detailed error information
return {
  content: [
    {
      type: 'text',
      text: error.toActionableMessage()
    },
    {
      type: 'resource',
      resource: {
        uri: 'error://details',
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error.name,
          status: error.statusCode,
          details: error.response,
          timestamp: new Date().toISOString()
        }, null, 2)
      }
    }
  ],
  isError: true
};
```

## Before/After Examples

### Example 1: Authentication Error

**❌ Bad: Vague and unhelpful**

```typescript
catch (error) {
  throw new Error('Auth failed');
}
```

**✅ Good: Actionable and specific**

```typescript
catch (error) {
  if (error.status === 401) {
    throw new Error(
      'Authentication failed: Invalid API token. ' +
      'Generate a new token at https://github.com/settings/tokens ' +
      'with "repo" scope and set it as the GITHUB_TOKEN environment variable. ' +
      'Example: export GITHUB_TOKEN=ghp_your_token_here'
    );
  }
}
```

### Example 2: Rate Limiting

**❌ Bad: No guidance on recovery**

```typescript
catch (error) {
  if (error.status === 429) {
    throw new Error('Too many requests');
  }
}
```

**✅ Good: Clear recovery path**

```typescript
catch (error) {
  if (error.status === 429) {
    const resetTime = new Date(error.headers['x-ratelimit-reset'] * 1000);
    const remaining = error.headers['x-ratelimit-remaining'];
    throw new Error(
      `Rate limit exceeded: Used all ${error.headers['x-ratelimit-limit']} requests. ` +
      `Limit resets at ${resetTime.toLocaleTimeString()}. ` +
      `Current remaining: ${remaining}. ` +
      `Wait approximately ${Math.ceil((resetTime.getTime() - Date.now()) / 60000)} minutes before retrying.`
    );
  }
}
```

### Example 3: Validation Error

**❌ Bad: No indication of what's wrong**

```typescript
catch (error) {
  throw new Error('Invalid input');
}
```

**✅ Good: Specific field and expected format**

```typescript
catch (error) {
  if (error.name === 'ZodError') {
    const issues = error.issues.map(issue =>
      `Field "${issue.path.join('.')}" ${issue.message}`
    ).join('; ');

    throw new Error(
      `Validation failed: ${issues}. ` +
      'Check that all required fields are provided with the correct types. ' +
      'Use the tool schema for reference.'
    );
  }
}
```

### Example 4: Resource Not Found

**❌ Bad: Generic message**

```typescript
catch (error) {
  if (error.status === 404) {
    throw new Error('Not found');
  }
}
```

**✅ Good: Context and verification steps**

```typescript
catch (error) {
  if (error.status === 404) {
    throw new Error(
      `Repository "${args.repository}" not found. ` +
      'Verify the repository name is in "owner/repo" format and that: ' +
      '1) The repository exists, ' +
      '2) You have access to it, and ' +
      '3) Your API token has the required permissions.'
    );
  }
}
```

## Common Error Scenarios

### 1. Missing Environment Variables

```typescript
// Check environment variables on initialization
export function validateEnvironment(): void {
  const required = ['GITHUB_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Set these variables before starting the server. ' +
      'For local development, create a .env file. ' +
      'For production, configure them in your deployment platform.'
    );
  }
}
```

### 2. Network Timeouts

```typescript
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    clearTimeout(timeout);
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      throw new Error(
        `Request timeout: The server took too long to respond (>30s). ` +
        'This may indicate network issues or server overload. ' +
        'Try again in a few moments.'
      );
    }
    throw error;
  }
}
```

### 3. Invalid JSON Response

```typescript
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, options);

  if (!response.ok) {
    throw new APIError('Request failed', response.status);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(
      'Invalid response format: Expected JSON but received ' +
      `"${contentType}". This may indicate a server error or incorrect endpoint. ` +
      `Response preview: ${text.substring(0, 200)}`
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(
      'Failed to parse JSON response. ' +
      'The server returned malformed data. ' +
      'This is likely a server-side issue.'
    );
  }
}
```

### 4. Pagination Errors

```typescript
export async function* paginate<T>(
  client: APIClient,
  endpoint: string,
  pageSize: number = 100
): AsyncGenerator<T> {
  let cursor: string | undefined;
  let page = 0;
  const maxPages = 100; // Safety limit

  try {
    do {
      page++;
      if (page > maxPages) {
        throw new Error(
          `Pagination limit exceeded: Fetched ${maxPages} pages. ` +
          'This dataset is too large to process in one operation. ' +
          'Consider adding filters to narrow down the results.'
        );
      }

      const params = new URLSearchParams({
        limit: pageSize.toString(),
        ...(cursor && { cursor }),
      });

      const response: PaginatedResponse<T> = await client.request(
        `${endpoint}?${params}`
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          'Invalid pagination response: Missing or malformed data array. ' +
          'This may indicate an API change or server error.'
        );
      }

      for (const item of response.data) {
        yield item;
      }

      cursor = response.nextCursor;
    } while (cursor);
  } catch (error) {
    throw new Error(
      `Pagination failed at page ${page}: ${error.message}`
    );
  }
}
```

## Error Propagation Best Practices

### 1. Preserve Error Context

```typescript
// ❌ Bad: Loses original error context
try {
  await operation();
} catch (error) {
  throw new Error('Operation failed');
}

// ✅ Good: Preserves error chain
try {
  await operation();
} catch (error) {
  throw new Error(
    `Operation failed: ${error.message}`,
    { cause: error }
  );
}
```

### 2. Convert at Boundaries

```typescript
// Convert errors at the tool boundary
export async function createIssue(
  client: APIClient,
  input: CreateIssueInput
) {
  try {
    // Business logic
    const issue = await client.request('/repos/{owner}/{repo}/issues', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    return {
      content: [{
        type: 'text',
        text: `Created issue #${issue.number}`,
      }],
    };
  } catch (error) {
    // Convert to actionable message at boundary
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    if (error instanceof ValidationError) {
      throw new Error(error.toActionableMessage());
    }
    // Unknown errors
    throw new Error(
      `Failed to create issue: ${error.message}. ` +
      'If this persists, check server logs for details.'
    );
  }
}
```

### 3. Add Operation Context

```typescript
// Add context at each layer
async function createIssue(repo: string, title: string) {
  try {
    return await api.createIssue(repo, title);
  } catch (error) {
    throw new Error(
      `Failed to create issue "${title}" in repository "${repo}": ${error.message}`
    );
  }
}
```

### 4. Log Before Throwing

```typescript
async function handleToolCall(name: string, args: any) {
  try {
    return await executeTool(name, args);
  } catch (error) {
    // Log detailed error for debugging
    console.error('Tool execution failed:', {
      tool: name,
      args,
      error: error.message,
      stack: error.stack,
    });

    // Throw user-friendly error
    throw new Error(
      error instanceof APIError
        ? error.toActionableMessage()
        : `Tool execution failed: ${error.message}`
    );
  }
}
```

## Testing Error Handling

### Unit Tests

```typescript
// test/errors.test.ts
import { describe, it, expect } from 'vitest';
import { APIError, AuthenticationError, RateLimitError } from '../src/utils/errors';

describe('Error handling', () => {
  describe('APIError', () => {
    it('should provide actionable message for 401', () => {
      const error = new APIError('Unauthorized', 401);
      const message = error.toActionableMessage();

      expect(message).toContain('Authentication failed');
      expect(message).toContain('API key');
      expect(message).toContain('environment variables');
    });

    it('should provide actionable message for 429', () => {
      const error = new APIError('Rate limit', 429);
      const message = error.toActionableMessage();

      expect(message).toContain('Rate limit exceeded');
      expect(message).toContain('Wait');
    });
  });

  describe('RateLimitError', () => {
    it('should include reset time in message', () => {
      const resetTime = new Date(Date.now() + 3600000);
      const error = new RateLimitError('Rate limit', resetTime, 5000, 0);
      const message = error.toActionableMessage();

      expect(message).toContain('5000');
      expect(message).toContain('resets at');
    });
  });
});
```

### Integration Tests

```typescript
// test/api-client.test.ts
import { describe, it, expect, vi } from 'vitest';
import { APIClient } from '../src/client';
import { AuthenticationError, NetworkError } from '../src/utils/errors';

describe('APIClient error handling', () => {
  it('should throw AuthenticationError for 401', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid token' }),
    });

    const client = new APIClient('invalid-token', 'https://api.example.com');

    await expect(
      client.request('/test')
    ).rejects.toThrow(AuthenticationError);
  });

  it('should throw NetworkError for fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(
      new TypeError('Failed to fetch')
    );

    const client = new APIClient('token', 'https://api.example.com');

    await expect(
      client.request('/test')
    ).rejects.toThrow(NetworkError);
  });
});
```

## Monitoring and Debugging

### Error Logging

```typescript
// src/utils/logger.ts
export interface ErrorLog {
  timestamp: string;
  error: string;
  statusCode?: number;
  endpoint?: string;
  context?: Record<string, any>;
}

export function logError(error: Error, context?: Record<string, any>): void {
  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    context,
  };

  if (error instanceof APIError) {
    log.statusCode = error.statusCode;
    log.endpoint = error.endpoint;
  }

  console.error(JSON.stringify(log));
}
```

### Error Metrics

```typescript
// Track error rates by type
const errorCounts = new Map<string, number>();

function trackError(error: Error): void {
  const type = error.constructor.name;
  errorCounts.set(type, (errorCounts.get(type) || 0) + 1);
}

// Expose metrics
server.setRequestHandler('server/metrics', async () => ({
  errors: Object.fromEntries(errorCounts),
}));
```

## Summary

Effective error handling in MCP servers requires:

1. **Custom error classes** for different error types
2. **Actionable messages** that guide users toward solutions
3. **HTTP status code mapping** to appropriate error types
4. **Context preservation** throughout the error propagation chain
5. **Consistent formatting** across all error responses
6. **Comprehensive testing** of error scenarios
7. **Proper logging** for debugging and monitoring

By following these practices, you'll create MCP servers that are resilient, debuggable, and provide excellent experiences for both AI agents and developers.

## Related Documentation

- **[Project Structure](./project-structure.md)** - Setting up error utilities
- **[Testing Best Practices](/docs/en/modules/mcp/05-advanced/testing.md)** - Testing error handling
- **[MCP Server Builder Reference](/docs/en/references/mcp/mcp-server-builder.md)** - Complete development guide

## Resources

- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Error Handling Best Practices](https://modelcontextprotocol.io/docs/best-practices/error-handling)
- [TypeScript Error Handling](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#control-flow-analysis-of-aliased-conditions)
- [Python Exception Handling](https://docs.python.org/3/tutorial/errors.html)

---

**Last Updated:** February 2026
