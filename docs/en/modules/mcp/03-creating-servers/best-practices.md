# MCP Server Best Practices

A comprehensive guide to building high-quality, production-ready MCP servers with actionable recommendations for tool design, error handling, testing, and evaluation creation.

## Table of Contents

- [Tool Design Best Practices](#tool-design-best-practices)
- [Error Handling Best Practices](#error-handling-best-practices)
- [Response Format Best Practices](#response-format-best-practices)
- [Evaluation Creation](#evaluation-creation)
- [Transport Selection](#transport-selection)
- [Language Selection](#language-selection)
- [Complete Working Example](#complete-working-example)

---

## Tool Design Best Practices

### Core Principles

#### ✅ DO: Use Consistent Naming

**Pattern:** `service_action` format

```typescript
// ✅ Good: Clear, consistent naming
github_list_issues
github_create_issue
github_update_issue
github_close_issue

slack_send_message
slack_list_channels
slack_get_user

database_query
database_insert
database_update
```

```typescript
// ❌ Bad: Inconsistent naming
listGitHubIssues      // camelCase
create-issue          // kebab-case
GitHub_Update_Issue   // mixed case
closeIssue            // missing service prefix
```

**Why:** Consistent naming helps AI models predict tool names and understand relationships between tools.

---

#### ✅ DO: Prioritize Comprehensive API Coverage

**Focus on breadth over depth:**

```typescript
// ✅ Good: Comprehensive coverage
const tools = [
  'github_list_issues',
  'github_create_issue',
  'github_update_issue',
  'github_close_issue',
  'github_add_comment',
  'github_list_prs',
  'github_create_pr',
  'github_merge_pr',
  // ... more tools
];
```

```typescript
// ❌ Bad: Single complex workflow tool
const tools = [
  'github_issue_workflow', // Does everything
];
```

**Why:** Individual tools are easier to understand, test, and compose. AI models can combine simple tools into complex workflows.

---

#### ✅ DO: Include Detailed Descriptions

**Provide comprehensive tool and parameter descriptions:**

```typescript
// ✅ Good: Detailed descriptions
const tool = {
  name: 'github_list_issues',
  description: 'List issues in a GitHub repository. Returns title, number, state, labels, and assignees for each issue. Results are paginated.',
  inputSchema: z.object({
    repository: z.string()
      .describe('Repository in format owner/repo (e.g., "facebook/react")'),
    state: z.enum(['open', 'closed', 'all'])
      .default('open')
      .describe('Filter by issue state. Default is "open"'),
    labels: z.string().optional()
      .describe('Comma-separated list of labels (e.g., "bug,urgent")'),
    page: z.number().optional()
      .describe('Page number for pagination (1-based)'),
  }),
};
```

```typescript
// ❌ Bad: Vague descriptions
const tool = {
  name: 'github_list_issues',
  description: 'Get issues',
  inputSchema: z.object({
    repository: z.string().describe('Repo'),
    state: z.enum(['open', 'closed', 'all']),
  }),
};
```

**Why:** Detailed descriptions help AI models use tools correctly and understand edge cases.

---

#### ✅ DO: Use Proper Annotations

**Annotate tools with appropriate hints:**

```typescript
// Read-only, idempotent operation
{
  name: 'github_list_issues',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
  }
}

// Destructive, non-idempotent operation
{
  name: 'github_delete_issue',
  annotations: {
    destructiveHint: true,
    idempotentHint: false,
  }
}

// Destructive but idempotent
{
  name: 'github_update_issue_title',
  annotations: {
    destructiveHint: true,
    idempotentHint: true,
  }
}

// Open world access (file system, network)
{
  name: 'filesystem_read_file',
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  }
}
```

**Why:** Annotations help hosts make security decisions and warn users about potentially dangerous operations.

---

#### ✅ DO: Validate Inputs with Schemas

**Use Zod (TypeScript) or Pydantic (Python) for validation:**

```typescript
// ✅ Good: Comprehensive validation
const CreateIssueSchema = z.object({
  repository: z.string()
    .regex(/^[\w-]+\/[\w-]+$/, 'Must be in format owner/repo')
    .describe('Repository in format owner/repo'),
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(256, 'Title too long')
    .describe('Issue title'),
  body: z.string().optional()
    .describe('Issue body in markdown format'),
  labels: z.array(z.string()).optional()
    .describe('Array of label names'),
  assignees: z.array(z.string()).optional()
    .max(10, 'Maximum 10 assignees')
    .describe('Array of GitHub usernames'),
});

// Validate in tool handler
const input = CreateIssueSchema.parse(args);
```

```python
# ✅ Good: Python with Pydantic
from pydantic import BaseModel, Field, validator

class CreateIssueInput(BaseModel):
    repository: str = Field(
        ...,
        description="Repository in format owner/repo",
        regex=r"^[\w-]+/[\w-]+$"
    )
    title: str = Field(
        ...,
        min_length=1,
        max_length=256,
        description="Issue title"
    )
    body: str | None = Field(
        None,
        description="Issue body in markdown"
    )
    labels: list[str] | None = None
    assignees: list[str] | None = Field(None, max_items=10)

    @validator('repository')
    def validate_repository(cls, v):
        if '/' not in v:
            raise ValueError('Must be in format owner/repo')
        return v
```

**Why:** Schema validation catches errors early and provides clear feedback to users.

---

#### ❌ DON'T: Create Overly Complex Workflow Tools

**Bad: Single tool that does too much:**

```typescript
// ❌ Bad: Complex workflow tool
{
  name: 'github_issue_workflow',
  description: 'Complete issue workflow: create, add labels, assign users, add comments, link PRs, and close',
  inputSchema: z.object({
    repository: z.string(),
    title: z.string(),
    labels: z.array(z.string()),
    assignees: z.array(z.string()),
    comments: z.array(z.string()),
    linkedPRs: z.array(z.number()),
    shouldClose: z.boolean(),
  })
}
```

**Good: Individual composable tools:**

```typescript
// ✅ Good: Simple, composable tools
[
  { name: 'github_create_issue' },
  { name: 'github_add_labels' },
  { name: 'github_assign_users' },
  { name: 'github_add_comment' },
  { name: 'github_link_pr' },
  { name: 'github_close_issue' },
]
```

**Why:** Simple tools are easier to test, understand, and reuse. AI models can orchestrate complex workflows from simple building blocks.

---

#### ❌ DON'T: Use Inconsistent Naming

**Bad: Mixed naming conventions:**

```typescript
// ❌ Bad: Inconsistent patterns
const tools = [
  'github_list_issues',    // service_action
  'createGitHubIssue',     // camelCase
  'update-issue',          // kebab-case, missing service
  'GitHub_Close_Issue',    // PascalCase
  'addComment',            // missing service prefix
];
```

**Good: Consistent convention:**

```typescript
// ✅ Good: Uniform naming
const tools = [
  'github_list_issues',
  'github_create_issue',
  'github_update_issue',
  'github_close_issue',
  'github_add_comment',
];
```

---

### Tool Organization

#### Group Related Tools Logically

```typescript
// ✅ Good: Organized by feature area
const tools = {
  // Issue management
  github_list_issues,
  github_create_issue,
  github_update_issue,
  github_close_issue,

  // Pull request management
  github_list_prs,
  github_create_pr,
  github_merge_pr,

  // Repository information
  github_get_repo,
  github_list_branches,
  github_get_file,
};
```

---

## Error Handling Best Practices

### Core Principles

#### ✅ DO: Provide Actionable Error Messages

**Good error messages guide users toward solutions:**

```typescript
// ❌ Bad: Vague error
throw new Error('Invalid token');

// ❌ Bad: Technical error without context
throw new Error('401 Unauthorized');

// ✅ Good: Actionable error
throw new Error(
  'Authentication failed: Invalid API token. ' +
  'Generate a new token at https://github.com/settings/tokens ' +
  'and set it in the GITHUB_TOKEN environment variable.'
);
```

```typescript
// ❌ Bad: Cryptic error
throw new Error('Not found');

// ✅ Good: Specific and actionable
throw new Error(
  `Repository "${repository}" not found. ` +
  'Verify the repository name is in format "owner/repo" ' +
  'and you have access to this repository.'
);
```

**Why:** Actionable errors help AI models and users resolve issues quickly without manual intervention.

---

#### ✅ DO: Handle Common Error Cases

**Anticipate and handle expected errors gracefully:**

```typescript
// ✅ Good: Comprehensive error handling
async function createIssue(client: APIClient, args: any) {
  try {
    const input = CreateIssueSchema.parse(args);
    const response = await client.post(
      `/repos/${input.repository}/issues`,
      { title: input.title, body: input.body }
    );

    return {
      content: [{
        type: 'text',
        text: `Created issue #${response.number}: ${response.title}`
      }]
    };
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path}: ${e.message}`);
      throw new Error(
        `Invalid input:\n${messages.join('\n')}\n\n` +
        'Please check your parameters and try again.'
      );
    }

    // Authentication error
    if (error.status === 401) {
      throw new Error(
        'Authentication failed. Set GITHUB_TOKEN environment variable ' +
        'with a valid personal access token from ' +
        'https://github.com/settings/tokens'
      );
    }

    // Not found error
    if (error.status === 404) {
      throw new Error(
        `Repository "${input.repository}" not found. ` +
        'Verify the repository name and your access permissions.'
      );
    }

    // Rate limit error
    if (error.status === 403 && error.message.includes('rate limit')) {
      throw new Error(
        'GitHub API rate limit exceeded. ' +
        'Wait for the rate limit to reset or use an authenticated token ' +
        'for higher limits.'
      );
    }

    // Validation error from GitHub
    if (error.status === 422) {
      throw new Error(
        `GitHub API validation error: ${error.message}. ` +
        'Check that all required fields are provided and valid.'
      );
    }

    // Unexpected error
    throw new Error(
      `Failed to create issue: ${error.message}. ` +
      'If this persists, check GitHub status at https://www.githubstatus.com'
    );
  }
}
```

**Why:** Proper error handling improves user experience and makes debugging easier.

---

#### ✅ DO: Include Context in Error Messages

**Add relevant context to help diagnose issues:**

```typescript
// ❌ Bad: No context
throw new Error('Failed to fetch data');

// ✅ Good: Include context
throw new Error(
  `Failed to fetch issues from repository "${repository}": ${error.message}`
);
```

```typescript
// ✅ Good: Include request details
throw new Error(
  `GitHub API request failed:\n` +
  `Endpoint: GET /repos/${repository}/issues\n` +
  `Status: ${response.status}\n` +
  `Error: ${errorData.message}\n` +
  `Documentation: ${errorData.documentation_url}`
);
```

---

#### ❌ DON'T: Ignore Error Handling

**Bad: No error handling:**

```typescript
// ❌ Bad: Unhandled errors
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'github_create_issue') {
    const response = await fetch(`https://api.github.com/repos/${args.repository}/issues`, {
      method: 'POST',
      body: JSON.stringify(args),
    });
    return { content: [{ type: 'text', text: 'Done' }] };
  }
});
```

**Good: Proper error handling:**

```typescript
// ✅ Good: Comprehensive error handling
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'github_create_issue') {
      const input = CreateIssueSchema.parse(args);
      const response = await fetch(
        `https://api.github.com/repos/${input.repository}/issues`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `GitHub API error (${response.status}): ${error.message}`
        );
      }

      const issue = await response.json();
      return {
        content: [{
          type: 'text',
          text: `Created issue #${issue.number}: ${issue.title}`
        }]
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    // Re-throw with context
    throw new Error(
      `Tool execution failed (${name}): ${error.message}`
    );
  }
});
```

---

#### ❌ DON'T: Use Generic Error Messages

**Bad: Unhelpful generic errors:**

```typescript
// ❌ Bad: Generic errors
throw new Error('Request failed');
throw new Error('Something went wrong');
throw new Error('Error');
```

**Good: Specific, actionable errors:**

```typescript
// ✅ Good: Specific errors
throw new Error(
  'Repository name must be in format "owner/repo", got: ' + repository
);

throw new Error(
  'Issue title is required and cannot be empty'
);

throw new Error(
  'Invalid label names: labels must contain only alphanumeric ' +
  'characters, hyphens, and underscores'
);
```

---

## Response Format Best Practices

### Core Principles

#### ✅ DO: Return Both Text and Structured Data

**Provide content for both text-only and advanced clients:**

```typescript
// ✅ Good: Both text and structured data
return {
  content: [
    // Human-readable text for text-only clients
    {
      type: 'text',
      text: `Created issue #${issue.number}: ${issue.title}\n` +
            `State: ${issue.state}\n` +
            `URL: ${issue.html_url}\n` +
            `Labels: ${issue.labels.map(l => l.name).join(', ')}`
    },
    // Structured data for advanced clients
    {
      type: 'resource',
      resource: {
        uri: `github://issues/${issue.number}`,
        mimeType: 'application/json',
        text: JSON.stringify(issue, null, 2)
      }
    }
  ]
};
```

```typescript
// ❌ Bad: Only text
return {
  content: [{
    type: 'text',
    text: `Created issue #${issue.number}`
  }]
};

// ❌ Bad: Only structured data
return {
  content: [{
    type: 'resource',
    resource: {
      uri: `github://issues/${issue.number}`,
      mimeType: 'application/json',
      text: JSON.stringify(issue)
    }
  }]
};
```

**Why:** Text content works with all clients, while structured data enables advanced features like caching and linking.

---

#### ✅ DO: Format Text Content for Readability

**Make text responses easy to scan and understand:**

```typescript
// ✅ Good: Well-formatted text
{
  type: 'text',
  text:
    `Found 3 open issues:\n\n` +
    `#123: Login fails with empty email\n` +
    `  Labels: bug, high-priority\n` +
    `  Assignee: john-doe\n` +
    `  Updated: 2026-01-28\n\n` +
    `#122: 404 error on profile page\n` +
    `  Labels: bug, ui\n` +
    `  Assignee: jane-smith\n` +
    `  Updated: 2026-01-27\n\n` +
    `#120: Session timeout not working\n` +
    `  Labels: bug, security\n` +
    `  Assignee: bob-jones\n` +
    `  Updated: 2026-01-25`
}
```

```typescript
// ❌ Bad: Unformatted text
{
  type: 'text',
  text: 'Issue #123: Login fails with empty email, bug, high-priority, john-doe, 2026-01-28. Issue #122: 404 error on profile page, bug, ui, jane-smith, 2026-01-27...'
}
```

---

#### ✅ DO: Include Relevant Links

**Provide URLs for further actions:**

```typescript
// ✅ Good: Include actionable links
return {
  content: [{
    type: 'text',
    text:
      `Created pull request #456: Add new feature\n` +
      `View PR: ${pr.html_url}\n` +
      `Review changes: ${pr.html_url}/files\n` +
      `Merge when ready: ${pr.html_url}/merge`
  }]
};
```

---

#### ❌ DON'T: Return Only Raw JSON

**Bad: Dump raw API response:**

```typescript
// ❌ Bad: Raw JSON string
return {
  content: [{
    type: 'text',
    text: JSON.stringify(apiResponse)
  }]
};
```

**Good: Format for humans, include structured data:**

```typescript
// ✅ Good: Formatted text + structured data
return {
  content: [
    {
      type: 'text',
      text: `Repository: ${repo.full_name}\n` +
            `Description: ${repo.description}\n` +
            `Stars: ${repo.stargazers_count}\n` +
            `Forks: ${repo.forks_count}\n` +
            `URL: ${repo.html_url}`
    },
    {
      type: 'resource',
      resource: {
        uri: `github://repos/${repo.id}`,
        mimeType: 'application/json',
        text: JSON.stringify(repo, null, 2)
      }
    }
  ]
};
```

---

## Evaluation Creation

### Purpose of Evaluations

Evaluations are test questions that validate your MCP server's capabilities. They help:

- Verify tools work correctly
- Test complex multi-tool workflows
- Ensure realistic scenarios are handled
- Provide examples for documentation
- Enable automated testing

---

### Evaluation Format

**XML Structure:**

```xml
<evaluations>
  <evaluation>
    <question>
      Question text here describing the task
    </question>
    <answer>
      Expected answer text here
    </answer>
  </evaluation>

  <evaluation>
    <question>
      Another question
    </question>
    <answer>
      Another expected answer
    </answer>
  </evaluation>
</evaluations>
```

---

### Requirements for Good Evaluations

#### ✅ DO: Create Complex, Multi-Step Questions

**Good questions require multiple tool calls:**

```xml
<!-- ✅ Good: Multi-step, realistic scenario -->
<evaluation>
  <question>
    For the user 'johndoe' on GitHub, list all repositories they own,
    filter for those with more than 10 stars,
    and show the most recent commit date for each repository.
  </question>
  <answer>
    - awesome-project: 45 stars, last commit 2026-01-15
    - cool-library: 23 stars, last commit 2026-01-10
    - helpful-tool: 12 stars, last commit 2026-01-08
  </answer>
</evaluation>
```

```xml
<!-- ✅ Good: Complex filtering and aggregation -->
<evaluation>
  <question>
    What are the three most recent issues in the repository 'facebook/react'
    that have the label 'bug' and are currently open?
    Include issue number, title, and creation date.
  </question>
  <answer>
    #28456: Memory leak in useEffect cleanup (2026-01-30)
    #28442: Hydration mismatch in Suspense (2026-01-29)
    #28431: Event handler not firing in portal (2026-01-28)
  </answer>
</evaluation>
```

**Why:** Complex questions validate that tools work together correctly and handle realistic use cases.

---

#### ✅ DO: Use Read-Only Operations

**Questions should be safe to execute repeatedly:**

```xml
<!-- ✅ Good: Read-only operations -->
<evaluation>
  <question>
    How many pull requests were merged in the last 7 days
    in the repository 'vercel/next.js'?
  </question>
  <answer>
    23 pull requests were merged in the last 7 days.
  </answer>
</evaluation>

<!-- ❌ Bad: Destructive operations -->
<evaluation>
  <question>
    Delete all issues labeled 'wontfix' in repository 'owner/repo'
  </question>
  <answer>
    Deleted 5 issues.
  </answer>
</evaluation>
```

**Why:** Read-only operations are safe for automated testing and don't modify production data.

---

#### ✅ DO: Make Questions Independent

**Each question should work standalone:**

```xml
<!-- ✅ Good: Independent questions -->
<evaluation>
  <question>
    List the most popular programming languages used in the repository
    'microsoft/vscode' based on file count.
  </question>
  <answer>
    1. TypeScript: 12,543 files
    2. JavaScript: 3,421 files
    3. CSS: 876 files
  </answer>
</evaluation>

<evaluation>
  <question>
    What is the total number of contributors to the repository
    'microsoft/vscode'?
  </question>
  <answer>
    1,847 contributors
  </answer>
</evaluation>

<!-- ❌ Bad: Dependent questions -->
<evaluation>
  <question>
    Get the most starred repository from the previous search.
  </question>
  <answer>
    ???
  </answer>
</evaluation>
```

**Why:** Independent questions can be executed in any order and don't depend on previous state.

---

#### ✅ DO: Use Realistic Scenarios

**Questions should reflect actual use cases:**

```xml
<!-- ✅ Good: Realistic developer workflow -->
<evaluation>
  <question>
    For the repository 'facebook/react', find all open pull requests
    that have been approved by at least 2 reviewers but haven't been
    merged yet. Show PR number, title, and approval count.
  </question>
  <answer>
    #28789: Optimize re-render performance (3 approvals)
    #28764: Add new Hook for async data (2 approvals)
    #28701: Fix TypeScript definitions (2 approvals)
  </answer>
</evaluation>

<!-- ❌ Bad: Contrived scenario -->
<evaluation>
  <question>
    Count all issues created on Tuesdays with titles starting with 'T'.
  </question>
  <answer>
    17 issues
  </answer>
</evaluation>
```

**Why:** Realistic scenarios validate that the server solves actual problems users face.

---

#### ✅ DO: Include Verifiable Answers

**Answers should be deterministic and checkable:**

```xml
<!-- ✅ Good: Specific, verifiable answer -->
<evaluation>
  <question>
    What is the description of the repository 'torvalds/linux'?
  </question>
  <answer>
    Linux kernel source tree
  </answer>
</evaluation>

<!-- ❌ Bad: Vague or non-deterministic answer -->
<evaluation>
  <question>
    How many issues does the repository 'microsoft/vscode' have?
  </question>
  <answer>
    A lot
  </answer>
</evaluation>
```

**Note:** For time-sensitive data, use relative ranges:

```xml
<!-- ✅ Good: Relative verification -->
<evaluation>
  <question>
    How many commits were made to 'vercel/next.js' in the last 30 days?
  </question>
  <answer>
    Between 150 and 250 commits (as of January 2026)
  </answer>
</evaluation>
```

---

#### ❌ DON'T: Create Overly Simple Questions

**Bad: Single tool call with no complexity:**

```xml
<!-- ❌ Bad: Too simple -->
<evaluation>
  <question>
    What is the title of issue #123 in repository 'owner/repo'?
  </question>
  <answer>
    Login bug
  </answer>
</evaluation>

<!-- ✅ Good: Multi-step with context -->
<evaluation>
  <question>
    For issue #123 in repository 'owner/repo', show the issue title,
    all labels, assigned users, and count of comments. Also indicate
    if it's linked to any pull requests.
  </question>
  <answer>
    Title: Login fails when email field is empty
    Labels: bug, high-priority, authentication
    Assignees: john-doe, security-team
    Comments: 12
    Linked PRs: #456 (Fix authentication validation)
  </answer>
</evaluation>
```

---

#### ❌ DON'T: Create Ambiguous Questions

**Bad: Unclear requirements:**

```xml
<!-- ❌ Bad: Ambiguous -->
<evaluation>
  <question>
    Get some information about the repository.
  </question>
  <answer>
    It's a repository
  </answer>
</evaluation>

<!-- ✅ Good: Specific requirements -->
<evaluation>
  <question>
    For the repository 'facebook/react', provide:
    - Full name
    - Primary programming language
    - Star count
    - Fork count
    - Open issues count
    - Last update date
  </question>
  <answer>
    Name: facebook/react
    Language: JavaScript
    Stars: 218,543
    Forks: 45,621
    Open issues: 1,234
    Last updated: 2026-01-30
  </answer>
</evaluation>
```

---

### Complete Evaluation Example

```xml
<evaluations>
  <!-- Complex multi-repository analysis -->
  <evaluation>
    <question>
      Compare the repositories 'facebook/react', 'vuejs/vue', and 'angular/angular'.
      For each, show the star count, open issues count, and most recent release date.
      Order by star count descending.
    </question>
    <answer>
      1. facebook/react
         Stars: 218,543
         Open issues: 1,234
         Latest release: 2026-01-25 (v18.5.0)

      2. vuejs/vue
         Stars: 206,321
         Open issues: 543
         Latest release: 2026-01-20 (v3.4.0)

      3. angular/angular
         Stars: 93,876
         Open issues: 2,341
         Latest release: 2026-01-28 (v17.2.0)
    </answer>
  </evaluation>

  <!-- Advanced filtering and aggregation -->
  <evaluation>
    <question>
      In the repository 'microsoft/vscode', find all issues labeled 'feature-request'
      that were created in the last 30 days and have at least 5 thumbs-up reactions.
      Show issue number, title, and reaction count. Limit to top 5.
    </question>
    <answer>
      #187234: Add AI-powered code suggestions (127 👍)
      #187156: Support for WebAssembly debugging (89 👍)
      #186987: Integrated database viewer (76 👍)
      #186821: Real-time collaboration mode (65 👍)
      #186754: Advanced regex search builder (54 👍)
    </answer>
  </evaluation>

  <!-- Cross-entity relationships -->
  <evaluation>
    <question>
      For pull request #28789 in repository 'facebook/react':
      - Show the PR title and status
      - List all reviewers and their review status
      - Count the number of commits
      - Show linked issues
    </question>
    <answer>
      Title: Optimize re-render performance in Suspense boundaries
      Status: Open

      Reviewers:
      - dan-abramov: Approved
      - gaearon: Approved
      - sophiebits: Changes requested

      Commits: 8

      Linked issues:
      - #28654: Performance degradation in Suspense
      - #28432: Memory usage spike with multiple boundaries
    </answer>
  </evaluation>

  <!-- Time-based analysis -->
  <evaluation>
    <question>
      For the repository 'vercel/next.js', show commit activity statistics
      for the last 7 days. Include:
      - Total number of commits
      - Number of unique contributors
      - Most active contributor and their commit count
      - Day with most commits
    </question>
    <answer>
      Total commits: 87
      Unique contributors: 23
      Most active: timneutkens (14 commits)
      Peak day: January 28 (19 commits)
    </answer>
  </evaluation>

  <!-- User-focused query -->
  <evaluation>
    <question>
      For GitHub user 'gaearon', list all public repositories they own
      that are primarily written in JavaScript or TypeScript,
      have more than 100 stars, and were updated in the last year.
      Sort by star count.
    </question>
    <answer>
      1. redux (60,234 stars, JavaScript, updated 2026-01-15)
      2. create-react-app (101,876 stars, JavaScript, updated 2025-12-10)
      3. react-hot-loader (12,345 stars, JavaScript, updated 2025-09-22)
      4. overreacted.io (6,789 stars, JavaScript, updated 2026-01-05)
    </answer>
  </evaluation>

  <!-- Issue lifecycle tracking -->
  <evaluation>
    <question>
      In repository 'nodejs/node', find issues that were:
      - Labeled as 'bug'
      - Created more than 6 months ago
      - Still open
      - Have no assigned users
      Show the 3 oldest issues with their age in days.
    </question>
    <answer>
      #43201: Memory leak in http module (542 days old)
      #43087: Incorrect error handling in fs.promises (521 days old)
      #42956: Timezone issue in Date parsing (498 days old)
    </answer>
  </evaluation>

  <!-- Release and version tracking -->
  <evaluation>
    <question>
      For the repository 'expressjs/express', list the last 5 releases.
      For each release, show:
      - Version number
      - Release date
      - Number of commits since previous release
    </question>
    <answer>
      v4.18.2 (2026-01-15) - 23 commits
      v4.18.1 (2025-11-20) - 45 commits
      v4.18.0 (2025-09-10) - 67 commits
      v4.17.3 (2025-06-05) - 34 commits
      v4.17.2 (2025-03-12) - 28 commits
    </answer>
  </evaluation>

  <!-- Contributor analysis -->
  <evaluation>
    <question>
      Who are the top 5 contributors to 'python/cpython' based on
      commit count in the last 90 days? Show username and commit count.
    </question>
    <answer>
      1. gvanrossum: 87 commits
      2. terryjreedy: 62 commits
      3. vstinner: 54 commits
      4. serhiy-storchaka: 48 commits
      5. miss-islington: 45 commits
    </answer>
  </evaluation>

  <!-- Pull request workflow -->
  <evaluation>
    <question>
      In repository 'rust-lang/rust', how many pull requests are currently:
      - Open and awaiting review (no reviews yet)
      - Open with at least one approval
      - Open with changes requested
      Show counts for each category.
    </question>
    <answer>
      Awaiting review: 234 PRs
      Approved (at least 1): 87 PRs
      Changes requested: 156 PRs
    </answer>
  </evaluation>

  <!-- Label distribution analysis -->
  <evaluation>
    <question>
      For the repository 'tensorflow/tensorflow', what are the top 5
      most frequently used labels on open issues? Show label name
      and issue count for each.
    </question>
    <answer>
      1. type:bug - 1,234 issues
      2. comp:keras - 876 issues
      3. stat:awaiting response - 654 issues
      4. TF 2.x - 543 issues
      5. comp:ops - 432 issues
    </answer>
  </evaluation>
</evaluations>
```

---

## Transport Selection

### Transport Types

#### Stdio Transport

**Use for:**
- Local development and testing
- Desktop applications
- Single-user scenarios
- Simple integrations

**Characteristics:**
- Communication via stdin/stdout
- Process-based lifecycle
- No authentication needed
- Single client connection

**Example:**

```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

#### Streamable HTTP (SSE)

**Use for:**
- Remote servers
- Multi-user applications
- Production deployments
- Cloud-hosted services

**Characteristics:**
- HTTP-based communication
- Multiple client connections
- Authentication required
- Better observability

**Example:**

```typescript
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

const app = express();

app.post('/mcp', async (req, res) => {
  const transport = new SSEServerTransport('/mcp/sse', res);
  await server.connect(transport);
});

app.listen(3000);
```

---

### Decision Matrix

| Factor | Stdio | HTTP/SSE |
|--------|-------|----------|
| **Deployment** | Local only | Local or remote |
| **Clients** | Single | Multiple |
| **Authentication** | Not needed | Required |
| **Setup complexity** | Simple | Moderate |
| **Observability** | Limited | Good (logs, metrics) |
| **Scaling** | Single process | Horizontal scaling |
| **Best for** | Development, CLI tools | Production, web services |

**Recommendation:** Use **stdio** for development and local tools. Use **HTTP/SSE** with **stateless JSON** for production deployments.

---

## Language Selection

### TypeScript (Recommended)

#### Pros

- **High-quality SDK:** Official TypeScript SDK is mature and well-maintained
- **AI familiarity:** Language models are highly trained on TypeScript
- **Strong typing:** Zod provides excellent runtime validation and type inference
- **Developer experience:** Great tooling, IDE support, and error messages
- **Rich ecosystem:** Large npm package ecosystem

#### Cons

- **Build step required:** Must compile TypeScript to JavaScript
- **More verbose:** More boilerplate than Python
- **Learning curve:** Type system has complexity

#### Example

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const CreateIssueSchema = z.object({
  repository: z.string().describe('Repository in format owner/repo'),
  title: z.string().min(1).describe('Issue title'),
  body: z.string().optional().describe('Issue body'),
});

server.setRequestHandler('tools/call', async (request) => {
  const input = CreateIssueSchema.parse(request.params.arguments);
  // ... implementation
});
```

---

### Python

#### Pros

- **Simpler syntax:** Less boilerplate, more concise
- **Quick prototyping:** Faster to write initial implementations
- **Pydantic validation:** Good runtime validation library
- **Data science ecosystem:** Great for ML and data processing

#### Cons

- **SDK less mature:** Python SDK is newer and evolving
- **Type hints less enforced:** Types are optional and not always checked
- **Async complexity:** async/await can be tricky
- **Deployment:** Dependency management more complex

#### Example

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from pydantic import BaseModel, Field

class CreateIssueInput(BaseModel):
    repository: str = Field(description="Repository in format owner/repo")
    title: str = Field(min_length=1, description="Issue title")
    body: str | None = Field(None, description="Issue body")

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "github_create_issue":
        input = CreateIssueInput(**arguments)
        # ... implementation
```

---

### Recommendation

**Use TypeScript when:**
- Building production servers
- Need strong typing guarantees
- Want better AI model compatibility
- Have JavaScript/TypeScript experience

**Use Python when:**
- Rapid prototyping
- Integrating with Python-heavy ecosystems (ML, data science)
- Team has strong Python expertise
- Building data processing servers

**Overall:** TypeScript is recommended for most MCP servers due to better SDK support and AI model familiarity.

---

## Complete Working Example

### Minimal GitHub MCP Server

This example demonstrates all best practices in a single, production-ready server.

#### src/index.ts

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Initialize server
const server = new Server({
  name: 'github-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// Validation schema
const ListIssuesSchema = z.object({
  repository: z.string()
    .regex(/^[\w-]+\/[\w-]+$/, 'Must be in format owner/repo')
    .describe('Repository in format owner/repo (e.g., "facebook/react")'),
  state: z.enum(['open', 'closed', 'all'])
    .default('open')
    .describe('Filter by issue state. Default is "open"'),
  labels: z.string().optional()
    .describe('Comma-separated list of labels (e.g., "bug,urgent")'),
  page: z.number().min(1).default(1).optional()
    .describe('Page number for pagination (1-based)'),
});

// List available tools
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'github_list_issues',
    description:
      'List issues in a GitHub repository. Returns issue number, title, ' +
      'state, labels, assignees, and creation date. Results are paginated ' +
      'with 30 issues per page.',
    inputSchema: ListIssuesSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
    },
  }],
}));

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'github_list_issues') {
    try {
      // Validate input
      const input = ListIssuesSchema.parse(args);

      // Check for API token
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        throw new Error(
          'GITHUB_TOKEN environment variable is not set. ' +
          'Generate a token at https://github.com/settings/tokens ' +
          'and set it before running the server.'
        );
      }

      // Build API URL
      const params = new URLSearchParams({
        state: input.state,
        page: String(input.page || 1),
        per_page: '30',
      });

      if (input.labels) {
        params.append('labels', input.labels);
      }

      const url = `https://api.github.com/repos/${input.repository}/issues?${params}`;

      // Make API request
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'github-mcp-server/1.0.0',
        },
      });

      // Handle errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Authentication failed: Invalid GitHub token. ' +
            'Generate a new token at https://github.com/settings/tokens'
          );
        }

        if (response.status === 404) {
          throw new Error(
            `Repository "${input.repository}" not found. ` +
            'Verify the repository name is correct and you have access.'
          );
        }

        if (response.status === 403) {
          const remaining = response.headers.get('X-RateLimit-Remaining');
          if (remaining === '0') {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            const resetDate = new Date(Number(resetTime) * 1000);
            throw new Error(
              `GitHub API rate limit exceeded. ` +
              `Limit resets at ${resetDate.toISOString()}. ` +
              'Consider using an authenticated token for higher limits.'
            );
          }
        }

        const error = await response.json().catch(() => ({}));
        throw new Error(
          `GitHub API error (${response.status}): ${error.message || response.statusText}`
        );
      }

      // Parse response
      const issues = await response.json();

      // Format text response
      const textResponse = issues.length === 0
        ? `No ${input.state} issues found in ${input.repository}` +
          (input.labels ? ` with labels: ${input.labels}` : '')
        : `Found ${issues.length} ${input.state} issue(s) in ${input.repository}:\n\n` +
          issues.map((issue: any) =>
            `#${issue.number}: ${issue.title}\n` +
            `  State: ${issue.state}\n` +
            `  Labels: ${issue.labels.map((l: any) => l.name).join(', ') || 'none'}\n` +
            `  Assignees: ${issue.assignees.map((a: any) => a.login).join(', ') || 'none'}\n` +
            `  Created: ${new Date(issue.created_at).toLocaleDateString()}\n` +
            `  URL: ${issue.html_url}`
          ).join('\n\n');

      // Return both text and structured data
      return {
        content: [
          // Human-readable text
          {
            type: 'text',
            text: textResponse,
          },
          // Structured data for advanced clients
          {
            type: 'resource',
            resource: {
              uri: `github://${input.repository}/issues`,
              mimeType: 'application/json',
              text: JSON.stringify(issues, null, 2),
            },
          },
        ],
      };
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `  ${e.path.join('.')}: ${e.message}`);
        throw new Error(
          `Invalid input parameters:\n${messages.join('\n')}\n\n` +
          'Please check your parameters and try again.'
        );
      }

      // Re-throw other errors with context
      throw new Error(`Failed to list issues: ${error.message}`);
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Connect and start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

---

#### package.json

```json
{
  "name": "github-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for GitHub API integration",
  "type": "module",
  "bin": {
    "github-mcp-server": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "prepare": "npm run build"
  },
  "keywords": ["mcp", "github", "api"],
  "author": "Your Name",
  "license": "MIT",
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

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
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

---

#### README.md

```markdown
# GitHub MCP Server

MCP server for GitHub API integration with best practices.

## Features

- ✅ Comprehensive error handling
- ✅ Input validation with Zod
- ✅ Actionable error messages
- ✅ Rate limit handling
- ✅ Both text and structured responses
- ✅ Proper annotations

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
# Set GitHub token
export GITHUB_TOKEN="your_github_token"

# Run server
npx github-mcp-server
```

## Configuration

Add to your MCP client config:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["github-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## Tools

### github_list_issues

List issues in a GitHub repository.

**Parameters:**
- `repository` (string, required): Repository in format "owner/repo"
- `state` (enum, optional): Filter by state ("open" | "closed" | "all")
- `labels` (string, optional): Comma-separated labels
- `page` (number, optional): Page number for pagination

**Example:**

```typescript
{
  "repository": "facebook/react",
  "state": "open",
  "labels": "bug,high-priority",
  "page": 1
}
```

## License

MIT
```

---

### Key Features Demonstrated

1. **Validation:** Comprehensive Zod schemas with helpful descriptions
2. **Error Handling:** Actionable errors for common cases (auth, not found, rate limits)
3. **Response Format:** Both human-readable text and structured data
4. **Annotations:** Proper hints for read-only, idempotent operations
5. **Documentation:** Clear parameter descriptions and examples
6. **Best Practices:** All recommendations from this guide

---

## Additional Resources

### Official Documentation

- **MCP Specification:** [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)
- **TypeScript SDK:** [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Python SDK:** [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)

### Tools

- **MCP Inspector:** [github.com/modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)
- **Reference Servers:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

### Skills

- **MCP Builder Skill:** [skills.sh/anthropics/skills/mcp-builder](https://skills.sh/anthropics/skills/mcp-builder)

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Category:** MCP Development
