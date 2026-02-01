# Tools and Schemas

Learn how to design and implement well-structured tools with proper schemas and annotations for your MCP server.

## Overview

Tools are the primary interface for AI models to interact with your MCP server. A well-designed tool has:

- Clear, action-oriented naming
- Comprehensive input validation via schemas
- Proper annotations for safety and behavior hints
- Rich responses with both text and structured data

This guide covers tool design from naming conventions through complete implementation patterns.

## Tool Naming Conventions

### Standard Format

Use the `service_action` pattern for consistency and clarity:

```
service_action
```

**Examples:**
- `github_create_issue`
- `github_list_repositories`
- `database_execute_query`
- `slack_send_message`
- `filesystem_read_file`
- `weather_get_forecast`

### Naming Best Practices

**DO:**
- Use verb-noun pairs that describe the action
- Include service prefix for clarity
- Use underscores for word separation
- Keep names concise but descriptive

**DON'T:**
- Use abbreviations (`gh_create` → `github_create`)
- Omit action verb (`github_issue` → `github_create_issue`)
- Mix naming styles in the same server
- Use generic names (`get`, `update`, `fetch`)

### Examples by Category

**CRUD Operations:**
```
database_create_record
database_read_record
database_update_record
database_delete_record
```

**List Operations:**
```
github_list_issues
github_list_repositories
slack_list_channels
```

**Search Operations:**
```
github_search_code
database_search_records
filesystem_search_files
```

**Action Operations:**
```
slack_send_message
github_merge_pull_request
email_send_notification
```

## Input Schema Design

### Using Zod (TypeScript)

Zod provides type-safe schema validation with excellent TypeScript integration.

**Basic Schema:**

```typescript
import { z } from 'zod';

export const CreateIssueInputSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue description'),
  labels: z.array(z.string()).optional().describe('Labels to add'),
  assignees: z.array(z.string()).optional().describe('Users to assign'),
});

// Infer TypeScript type from schema
export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;
```

**Advanced Schema Patterns:**

```typescript
// Enums for limited choices
export const IssueSortInputSchema = z.object({
  sortBy: z.enum(['created', 'updated', 'comments']).describe('Sort field'),
  direction: z.enum(['asc', 'desc']).describe('Sort direction'),
});

// Validation rules
export const SearchInputSchema = z.object({
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
});

// Nested objects
export const UpdateUserInputSchema = z.object({
  userId: z.string().describe('User ID'),
  profile: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    bio: z.string().max(500).optional(),
  }).describe('Profile fields to update'),
  settings: z.object({
    notifications: z.boolean().optional(),
    theme: z.enum(['light', 'dark']).optional(),
  }).optional().describe('User settings'),
});

// Union types for flexible inputs
export const FileInputSchema = z.object({
  file: z.union([
    z.string().describe('File path'),
    z.object({
      name: z.string(),
      content: z.string(),
    }).describe('File object with name and content'),
  ]).describe('File path or file object'),
});

// Discriminated unions
export const NotificationInputSchema = z.discriminatedUnion('type', [
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
  z.object({
    type: z.literal('sms'),
    phone: z.string(),
    message: z.string(),
  }),
]);
```

### Using Pydantic (Python)

Pydantic provides similar capabilities with Python type hints and validation.

**Basic Schema:**

```python
from pydantic import BaseModel, Field
from typing import Optional, List

class CreateIssueInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(description="Issue title")
    body: Optional[str] = Field(None, description="Issue description")
    labels: Optional[List[str]] = Field(None, description="Labels to add")
    assignees: Optional[List[str]] = Field(None, description="Users to assign")
```

**Advanced Schema Patterns:**

```python
from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, List, Union, Literal
from enum import Enum

# Enums for limited choices
class SortBy(str, Enum):
    created = "created"
    updated = "updated"
    comments = "comments"

class Direction(str, Enum):
    asc = "asc"
    desc = "desc"

class IssueSortInput(BaseModel):
    sort_by: SortBy = Field(description="Sort field")
    direction: Direction = Field(description="Sort direction")

# Validation rules
class SearchInput(BaseModel):
    query: str = Field(
        ...,
        min_length=3,
        max_length=256,
        description="Search query"
    )
    limit: int = Field(
        10,
        ge=1,
        le=100,
        description="Maximum results to return"
    )

# Nested objects
class UserProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = Field(None, max_length=500)

class UserSettings(BaseModel):
    notifications: Optional[bool] = None
    theme: Optional[Literal["light", "dark"]] = None

class UpdateUserInput(BaseModel):
    user_id: str = Field(description="User ID")
    profile: Optional[UserProfile] = Field(None, description="Profile fields to update")
    settings: Optional[UserSettings] = Field(None, description="User settings")

# Union types with discriminator
class EmailNotification(BaseModel):
    type: Literal["email"] = "email"
    to: EmailStr
    subject: str
    body: str

class SlackNotification(BaseModel):
    type: Literal["slack"] = "slack"
    channel: str
    message: str

class SMSNotification(BaseModel):
    type: Literal["sms"] = "sms"
    phone: str
    message: str

NotificationInput = Union[EmailNotification, SlackNotification, SMSNotification]

# Custom validators
class FileInput(BaseModel):
    path: str = Field(description="File path")

    @validator('path')
    def validate_path(cls, v):
        if not v.startswith('/') and not v.startswith('./'):
            raise ValueError('Path must be absolute or relative')
        return v
```

### Schema Design Best Practices

**1. Always Add Descriptions**

Descriptions help AI models understand what each field does:

```typescript
// Good
repository: z.string().describe('Repository in format owner/repo')

// Bad
repository: z.string()
```

**2. Use Optional for Non-Required Fields**

Make it clear which fields are required:

```typescript
// TypeScript
title: z.string(),                    // Required
body: z.string().optional(),          // Optional

// Python
title: str = Field(...)               # Required
body: Optional[str] = Field(None)     # Optional
```

**3. Provide Defaults Where Appropriate**

Set sensible defaults for optional parameters:

```typescript
// TypeScript
limit: z.number().default(10)

// Python
limit: int = Field(10)
```

**4. Add Validation Constraints**

Prevent invalid inputs early:

```typescript
// TypeScript
query: z.string().min(3).max(256)
limit: z.number().int().min(1).max(100)

// Python
query: str = Field(..., min_length=3, max_length=256)
limit: int = Field(..., ge=1, le=100)
```

**5. Use Enums for Fixed Choices**

Make valid options explicit:

```typescript
// TypeScript
status: z.enum(['open', 'closed', 'all'])

// Python
status: Literal["open", "closed", "all"]
```

## Tool Implementation Patterns

### Complete Tool Structure

A complete tool implementation includes:

1. Input schema definition
2. Type inference
3. Tool definition object
4. Handler function
5. Error handling
6. Response formatting

### TypeScript Implementation

```typescript
// src/tools/create-issue.ts
import { z } from 'zod';

// 1. Input schema
export const CreateIssueInputSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().describe('Issue title'),
  body: z.string().optional().describe('Issue description'),
  labels: z.array(z.string()).optional().describe('Labels to add'),
  assignees: z.array(z.string()).optional().describe('Users to assign'),
});

// 2. Type inference
export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;

// 3. Tool definition
export const createIssueTool = {
  name: 'github_create_issue',
  description: 'Create a new issue in a GitHub repository',
  inputSchema: CreateIssueInputSchema,
  annotations: {
    destructiveHint: true,  // Creates new data
    idempotentHint: false,  // Not idempotent
  },
};

// 4. Handler function
export async function createIssue(
  client: APIClient,
  input: CreateIssueInput
) {
  try {
    // Parse repository owner/repo
    const [owner, repo] = input.repository.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    // Make API request
    const issue = await client.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        labels: input.labels,
        assignees: input.assignees,
      }),
    });

    // 5. Format response
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
    // 6. Error handling
    if (error instanceof APIError) {
      throw new Error(error.toActionableMessage());
    }
    throw error;
  }
}
```

### Python Implementation

```python
# src/tools/create_issue.py
from pydantic import BaseModel, Field
from typing import Optional, List
import json

# 1. Input schema
class CreateIssueInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(description="Issue title")
    body: Optional[str] = Field(None, description="Issue description")
    labels: Optional[List[str]] = Field(None, description="Labels to add")
    assignees: Optional[List[str]] = Field(None, description="Users to assign")

# 2. Tool definition
create_issue_tool = {
    "name": "github_create_issue",
    "description": "Create a new issue in a GitHub repository",
    "inputSchema": CreateIssueInput.schema(),
    "annotations": {
        "destructiveHint": True,
        "idempotentHint": False,
    }
}

# 3. Handler function
async def create_issue(client: APIClient, input: CreateIssueInput):
    try:
        # Parse repository owner/repo
        parts = input.repository.split('/')
        if len(parts) != 2:
            raise ValueError('Invalid repository format. Use owner/repo')

        owner, repo = parts

        # Make API request
        issue = await client.request(
            f"/repos/{owner}/{repo}/issues",
            method="POST",
            json={
                "title": input.title,
                "body": input.body,
                "labels": input.labels,
                "assignees": input.assignees,
            }
        )

        # 4. Format response
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
        # 5. Error handling
        raise Exception(error.to_actionable_message())
    except ValueError as error:
        raise Exception(str(error))
```

### Read-Only Tool Example

```typescript
// TypeScript
export const listIssuesInput = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  state: z.enum(['open', 'closed', 'all']).default('open'),
  limit: z.number().int().min(1).max(100).default(30),
});

export const listIssuesTool = {
  name: 'github_list_issues',
  description: 'List issues in a GitHub repository',
  inputSchema: listIssuesInput,
  annotations: {
    readOnlyHint: true,    // Only reads data
    idempotentHint: true,  // Safe to call multiple times
  },
};

export async function listIssues(
  client: APIClient,
  input: z.infer<typeof listIssuesInput>
) {
  const [owner, repo] = input.repository.split('/');
  const issues = await client.request(
    `/repos/${owner}/${repo}/issues?state=${input.state}&per_page=${input.limit}`
  );

  return {
    content: [{
      type: 'text',
      text: `Found ${issues.length} ${input.state} issues in ${input.repository}:\n\n` +
            issues.map((i: any) => `#${i.number}: ${i.title}`).join('\n'),
    }],
  };
}
```

```python
# Python
class ListIssuesInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    state: Literal["open", "closed", "all"] = Field("open")
    limit: int = Field(30, ge=1, le=100)

list_issues_tool = {
    "name": "github_list_issues",
    "description": "List issues in a GitHub repository",
    "inputSchema": ListIssuesInput.schema(),
    "annotations": {
        "readOnlyHint": True,
        "idempotentHint": True,
    }
}

async def list_issues(client: APIClient, input: ListIssuesInput):
    owner, repo = input.repository.split('/')
    issues = await client.request(
        f"/repos/{owner}/{repo}/issues?state={input.state}&per_page={input.limit}"
    )

    issue_list = '\n'.join([f"#{i['number']}: {i['title']}" for i in issues])

    return {
        "content": [{
            "type": "text",
            "text": f"Found {len(issues)} {input.state} issues in {input.repository}:\n\n{issue_list}"
        }]
    }
```

## Tool Annotations

Annotations provide hints to AI models about tool behavior and safety characteristics.

### Available Annotations

#### 1. `readOnlyHint`

Indicates the tool only reads data and makes no modifications.

**When to use:**
- List operations
- Search operations
- Get/read operations
- Query operations

**Example:**

```typescript
{
  name: 'database_search_records',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,  // Usually paired with idempotent
  }
}
```

**Benefits:**
- AI models can call freely without concern
- Can be retried safely on errors
- Multiple calls won't cause problems

#### 2. `destructiveHint`

Indicates the tool creates, updates, or deletes data.

**When to use:**
- Create operations
- Update operations
- Delete operations
- Any state-changing action

**Example:**

```typescript
{
  name: 'github_create_issue',
  annotations: {
    destructiveHint: true,
    idempotentHint: false,  // Creates new resources each time
  }
}
```

**Benefits:**
- AI models will exercise caution
- May prompt user confirmation
- Won't retry automatically on errors

#### 3. `idempotentHint`

Indicates calling the tool multiple times with the same input has the same effect as calling it once.

**When to use:**
- All read-only operations
- Update operations that set absolute values
- Delete operations (deleting already-deleted resource is fine)

**When NOT to use:**
- Create operations (makes duplicates)
- Increment operations
- Operations with side effects

**Examples:**

```typescript
// Idempotent update (sets absolute value)
{
  name: 'github_update_issue_title',
  annotations: {
    destructiveHint: true,
    idempotentHint: true,  // Setting title multiple times = same result
  }
}

// Non-idempotent create (makes duplicates)
{
  name: 'github_create_issue',
  annotations: {
    destructiveHint: true,
    idempotentHint: false,  // Creates new issue each time
  }
}

// Idempotent delete (already deleted is fine)
{
  name: 'github_delete_issue',
  annotations: {
    destructiveHint: true,
    idempotentHint: true,  // Deleting deleted issue doesn't matter
  }
}
```

**Benefits:**
- Safe to retry on network errors
- AI models can be more confident
- Reduces need for confirmation

#### 4. `openWorldHint`

Indicates the tool can access arbitrary resources beyond predefined scopes.

**When to use:**
- File system access with dynamic paths
- Web scraping with arbitrary URLs
- Database queries with dynamic tables
- Any operation where input determines resource access

**Example:**

```typescript
{
  name: 'filesystem_read_file',
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,  // Can access any file path
  }
}

{
  name: 'web_fetch_url',
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,  // Can fetch any URL
  }
}
```

**Benefits:**
- AI models understand security implications
- May trigger additional safety checks
- User may need to approve scope

### Annotation Combinations

Common patterns and their meanings:

```typescript
// Safe read-only operation
{
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
  }
}

// Risky read-only operation (open world)
{
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  }
}

// Safe destructive operation (idempotent update)
{
  annotations: {
    destructiveHint: true,
    idempotentHint: true,
  }
}

// Risky destructive operation (creates new data)
{
  annotations: {
    destructiveHint: true,
    idempotentHint: false,
  }
}

// Very risky operation (destructive + open world)
{
  annotations: {
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  }
}
```

### Annotation Decision Tree

```
Is the tool read-only?
├─ Yes
│  ├─ Can access arbitrary resources? (files, URLs, etc.)
│  │  ├─ Yes → readOnlyHint: true, idempotentHint: true, openWorldHint: true
│  │  └─ No  → readOnlyHint: true, idempotentHint: true
│  └─ No
└─ No (modifies data)
   ├─ Is it idempotent? (same effect when called multiple times)
   │  ├─ Yes → destructiveHint: true, idempotentHint: true
   │  └─ No  → destructiveHint: true, idempotentHint: false
   └─ Can access arbitrary resources?
      ├─ Yes → Add openWorldHint: true
      └─ No  → No openWorldHint
```

## Response Format

### Standard Response Structure

MCP tools should return responses with both human-readable text and structured data.

**Structure:**

```typescript
{
  content: [
    {
      type: 'text',
      text: 'Human-readable summary'
    },
    {
      type: 'resource',
      resource: {
        uri: 'resource://identifier',
        mimeType: 'application/json',
        text: 'Structured data'
      }
    }
  ]
}
```

### Response Best Practices

**1. Always Include Text Summary**

The first content item should be human-readable text:

```typescript
{
  type: 'text',
  text: `Created issue #42: Fix login bug\nURL: https://github.com/owner/repo/issues/42`
}
```

**2. Include Structured Data for Complex Responses**

Add a resource with the full API response:

```typescript
{
  type: 'resource',
  resource: {
    uri: `github://issues/${issue.id}`,
    mimeType: 'application/json',
    text: JSON.stringify(issue, null, 2)
  }
}
```

**3. Format Text for Readability**

Use formatting for clarity:

```typescript
// Good
text: `Found 5 open issues:

#42: Fix login bug
#43: Add dark mode
#44: Improve performance`

// Bad
text: `Found 5 open issues: #42: Fix login bug, #43: Add dark mode, #44: Improve performance`
```

**4. Include Action URLs**

Help users follow up on actions:

```typescript
text: `Created pull request #123: Add feature
URL: https://github.com/owner/repo/pull/123
Review: https://github.com/owner/repo/pull/123/files`
```

### Response Examples

**Create Operation:**

```typescript
return {
  content: [
    {
      type: 'text',
      text: `Created issue #${issue.number}: ${issue.title}
URL: ${issue.html_url}
State: ${issue.state}
Created: ${issue.created_at}`
    },
    {
      type: 'resource',
      resource: {
        uri: `github://issues/${issue.id}`,
        mimeType: 'application/json',
        text: JSON.stringify(issue, null, 2)
      }
    }
  ]
};
```

**List Operation:**

```typescript
return {
  content: [
    {
      type: 'text',
      text: `Found ${issues.length} issues:\n\n` +
            issues.map(i => `#${i.number}: ${i.title} (${i.state})`).join('\n')
    },
    {
      type: 'resource',
      resource: {
        uri: `github://issues?repo=${input.repository}`,
        mimeType: 'application/json',
        text: JSON.stringify(issues, null, 2)
      }
    }
  ]
};
```

**Error Response:**

```typescript
// Throw descriptive errors
throw new Error(`Failed to create issue: ${error.message}\n` +
                `Check that you have write access to ${input.repository}`);
```

## Complete Tool Examples

### Example 1: Search Tool

```typescript
// TypeScript
import { z } from 'zod';

export const searchCodeInput = z.object({
  query: z.string().min(3).describe('Search query'),
  repository: z.string().optional().describe('Limit to specific repository'),
  language: z.string().optional().describe('Filter by programming language'),
  limit: z.number().int().min(1).max(100).default(30),
});

export const searchCodeTool = {
  name: 'github_search_code',
  description: 'Search for code across GitHub repositories',
  inputSchema: searchCodeInput,
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
  },
};

export async function searchCode(
  client: APIClient,
  input: z.infer<typeof searchCodeInput>
) {
  let query = input.query;
  if (input.repository) query += ` repo:${input.repository}`;
  if (input.language) query += ` language:${input.language}`;

  const results = await client.request(
    `/search/code?q=${encodeURIComponent(query)}&per_page=${input.limit}`
  );

  return {
    content: [
      {
        type: 'text',
        text: `Found ${results.total_count} results (showing ${results.items.length}):\n\n` +
              results.items.map((item: any) =>
                `${item.repository.full_name}/${item.path}\n${item.html_url}`
              ).join('\n\n')
      },
      {
        type: 'resource',
        resource: {
          uri: `github://search/code?q=${encodeURIComponent(query)}`,
          mimeType: 'application/json',
          text: JSON.stringify(results, null, 2)
        }
      }
    ]
  };
}
```

### Example 2: Update Tool

```typescript
// TypeScript
import { z } from 'zod';

export const updateIssueInput = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  issueNumber: z.number().int().describe('Issue number'),
  title: z.string().optional().describe('New title'),
  body: z.string().optional().describe('New description'),
  state: z.enum(['open', 'closed']).optional().describe('New state'),
  labels: z.array(z.string()).optional().describe('New labels (replaces existing)'),
});

export const updateIssueTool = {
  name: 'github_update_issue',
  description: 'Update an existing GitHub issue',
  inputSchema: updateIssueInput,
  annotations: {
    destructiveHint: true,
    idempotentHint: true,  // Setting values is idempotent
  },
};

export async function updateIssue(
  client: APIClient,
  input: z.infer<typeof updateIssueInput>
) {
  const [owner, repo] = input.repository.split('/');

  // Build update payload
  const updates: any = {};
  if (input.title) updates.title = input.title;
  if (input.body) updates.body = input.body;
  if (input.state) updates.state = input.state;
  if (input.labels) updates.labels = input.labels;

  const issue = await client.request(
    `/repos/${owner}/${repo}/issues/${input.issueNumber}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }
  );

  // List what changed
  const changes = Object.keys(updates).map(key =>
    `${key}: ${updates[key]}`
  ).join(', ');

  return {
    content: [
      {
        type: 'text',
        text: `Updated issue #${issue.number}
Changes: ${changes}
URL: ${issue.html_url}`
      },
      {
        type: 'resource',
        resource: {
          uri: `github://issues/${issue.id}`,
          mimeType: 'application/json',
          text: JSON.stringify(issue, null, 2)
        }
      }
    ]
  };
}
```

### Example 3: File System Tool

```typescript
// TypeScript
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const readFileInput = z.object({
  path: z.string().describe('File path to read'),
  encoding: z.enum(['utf-8', 'base64']).default('utf-8'),
});

export const readFileTool = {
  name: 'filesystem_read_file',
  description: 'Read contents of a file',
  inputSchema: readFileInput,
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,  // Can access any file path
  },
};

export async function readFile(
  input: z.infer<typeof readFileInput>
) {
  try {
    const absolutePath = path.resolve(input.path);
    const content = await fs.readFile(
      absolutePath,
      input.encoding as BufferEncoding
    );

    const stats = await fs.stat(absolutePath);

    return {
      content: [
        {
          type: 'text',
          text: `Read file: ${absolutePath}
Size: ${stats.size} bytes
Modified: ${stats.mtime.toISOString()}

Content preview (first 500 chars):
${content.toString().substring(0, 500)}${content.length > 500 ? '...' : ''}`
        },
        {
          type: 'resource',
          resource: {
            uri: `file://${absolutePath}`,
            mimeType: 'text/plain',
            text: content.toString()
          }
        }
      ]
    };
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}\nPath: ${input.path}`);
  }
}
```

## Testing Tools

### Unit Testing Schemas

```typescript
// TypeScript with Jest
import { CreateIssueInputSchema } from './create-issue';

describe('CreateIssueInputSchema', () => {
  it('validates correct input', () => {
    const result = CreateIssueInputSchema.safeParse({
      repository: 'owner/repo',
      title: 'Test issue',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid repository format', () => {
    const result = CreateIssueInputSchema.safeParse({
      repository: 'invalid',
      title: 'Test',
    });
    // Note: This would need custom validation added to schema
  });

  it('handles optional fields', () => {
    const result = CreateIssueInputSchema.safeParse({
      repository: 'owner/repo',
      title: 'Test',
      labels: ['bug', 'urgent'],
      assignees: ['user1'],
    });
    expect(result.success).toBe(true);
  });
});
```

### Integration Testing Tools

```typescript
// TypeScript with Jest
import { createIssue } from './create-issue';
import { MockAPIClient } from '../test/mocks';

describe('createIssue', () => {
  let mockClient: MockAPIClient;

  beforeEach(() => {
    mockClient = new MockAPIClient();
  });

  it('creates issue with minimal input', async () => {
    mockClient.mockResponse({
      number: 42,
      title: 'Test issue',
      html_url: 'https://github.com/owner/repo/issues/42',
      id: 123,
    });

    const result = await createIssue(mockClient, {
      repository: 'owner/repo',
      title: 'Test issue',
    });

    expect(result.content[0].text).toContain('Created issue #42');
    expect(mockClient.lastRequest?.url).toContain('/repos/owner/repo/issues');
  });

  it('handles API errors gracefully', async () => {
    mockClient.mockError(new Error('Not found'));

    await expect(
      createIssue(mockClient, {
        repository: 'owner/repo',
        title: 'Test',
      })
    ).rejects.toThrow('Not found');
  });
});
```

## Next Steps

Now that you understand tools and schemas:

1. **Design your tools** - Plan what operations your server needs
2. **Implement schemas** - Create robust input validation
3. **Add annotations** - Help AI models use tools safely
4. **Test thoroughly** - Validate schemas and tool behavior
5. **Document clearly** - Write good descriptions for schemas and tools

Continue to [Project Structure](./project-structure.md) to organize your tool implementations.

## Related Documentation

- [MCP Setup Guide](../../../guides/mcp/mcp-setup-guide.md)
- [Authentication](../02-using-mcp/authentication.md)
- [Server Entry Points](./server-entry-points.md)
