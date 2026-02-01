# Available MCP Servers

Comprehensive guide to official and community MCP servers across development tools, data sources, communication, productivity, and cloud services.

## Overview

The MCP ecosystem includes a growing collection of servers that extend AI capabilities across various domains. This guide covers:

- **Official Servers:** Maintained by Anthropic
- **Community Servers:** Popular third-party implementations
- **Installation:** Setup instructions for each platform
- **Configuration:** Platform-specific examples
- **Use Cases:** Practical workflows and patterns

## Official MCP Servers

### Filesystem Server

**Purpose:** Local file and directory operations

**Capabilities:**
- Read/write files
- List directories
- Create/delete files and folders
- Search file contents
- File metadata operations

**Installation:**

```bash
# NPX (recommended)
npx -y @modelcontextprotocol/server-filesystem

# NPM global
npm install -g @modelcontextprotocol/server-filesystem
```

**Configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

**Security Considerations:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects",
        "/Users/username/documents"
      ],
      "env": {
        "READ_ONLY": "false"
      }
    }
  }
}
```

**Use Cases:**
- Project file management
- Documentation generation
- Code refactoring across multiple files
- Build script automation
- Configuration file management

**Example Workflow:**

```
User: "Find all TODO comments in my project"
AI (using filesystem):
  1. List all .js/.ts files
  2. Read each file
  3. Extract TODO comments
  4. Present organized list
```

### GitHub Server

**Purpose:** GitHub repository operations

**Capabilities:**
- Repository management
- Issue operations (create, update, search)
- Pull request workflows
- Code search
- Branch operations
- Commit history

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-github

# NPM
npm install -g @modelcontextprotocol/server-github
```

**Configuration:**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Token Setup:**

```bash
# Create GitHub Personal Access Token
# https://github.com/settings/tokens

# Required scopes:
# - repo (full control)
# - read:org (read organization data)
# - user (user data)

# Set environment variable
export GITHUB_TOKEN="ghp_your_token_here"
```

**Use Cases:**
- Automated issue triaging
- PR review assistance
- Repository documentation
- Code search across repos
- Release management
- Team collaboration

**Example Workflow:**

```
User: "Create an issue for the authentication bug"
AI (using github):
  1. Search existing issues for duplicates
  2. Create new issue with detailed description
  3. Apply relevant labels
  4. Assign to appropriate team member
  5. Link related PRs
```

### SQLite Server

**Purpose:** SQLite database operations

**Capabilities:**
- Query execution
- Schema inspection
- Database modification
- Transaction support
- Result formatting

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-sqlite

# NPM
npm install -g @modelcontextprotocol/server-sqlite
```

**Configuration:**

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "/path/to/database.db"
      ]
    }
  }
}
```

**Multiple Databases:**

```json
{
  "mcpServers": {
    "sqlite-dev": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "/project/dev.db"
      ]
    },
    "sqlite-analytics": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "/project/analytics.db"
      ]
    }
  }
}
```

**Use Cases:**
- Database schema analysis
- Data exploration and reporting
- Migration script generation
- Query optimization
- Test data generation
- Data validation

**Example Workflow:**

```
User: "Show me users who signed up last week"
AI (using sqlite):
  1. Inspect schema to find users table
  2. Construct query with date filters
  3. Execute query
  4. Format results in readable table
  5. Provide insights on data
```

### PostgreSQL Server

**Purpose:** PostgreSQL database operations

**Capabilities:**
- Complex query execution
- Schema management
- Performance analysis
- Advanced PostgreSQL features
- Connection pooling

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-postgres

# NPM
npm install -g @modelcontextprotocol/server-postgres
```

**Configuration:**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**Connection String Format:**

```
postgresql://[user[:password]@][host][:port][/dbname][?param=value]
```

**Use Cases:**
- Production database analysis
- Performance tuning
- Complex reporting queries
- Data pipeline debugging
- Schema evolution
- Index optimization

**Example Workflow:**

```
User: "Find slow queries in my application"
AI (using postgres):
  1. Query pg_stat_statements
  2. Analyze execution times
  3. Identify slow queries
  4. Suggest indexes
  5. Provide optimization recommendations
```

### Brave Search Server

**Purpose:** Web search capabilities

**Capabilities:**
- Web search queries
- News search
- Image search
- Video search
- Result filtering and ranking

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-brave-search

# NPM
npm install -g @modelcontextprotocol/server-brave-search
```

**Configuration:**

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    }
  }
}
```

**API Key Setup:**

```bash
# Get API key from: https://brave.com/search/api/

export BRAVE_API_KEY="your_api_key_here"
```

**Use Cases:**
- Real-time information gathering
- Research assistance
- News monitoring
- Competitive analysis
- Documentation search
- Fact-checking

**Example Workflow:**

```
User: "What are the latest updates to React 19?"
AI (using brave-search):
  1. Search for "React 19 updates"
  2. Filter recent results
  3. Analyze official sources
  4. Summarize key changes
  5. Provide relevant links
```

### Google Maps Server

**Purpose:** Location and mapping services

**Capabilities:**
- Geocoding/reverse geocoding
- Place search
- Directions and routing
- Distance calculations
- Place details

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-google-maps

# NPM
npm install -g @modelcontextprotocol/server-google-maps
```

**Configuration:**

```json
{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-maps"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "${GOOGLE_MAPS_API_KEY}"
      }
    }
  }
}
```

**Use Cases:**
- Location-based queries
- Travel planning
- Store locator applications
- Delivery route optimization
- Geographic data analysis
- Address validation

**Example Workflow:**

```
User: "Find coffee shops near Times Square"
AI (using google-maps):
  1. Geocode "Times Square"
  2. Search for coffee shops nearby
  3. Get ratings and reviews
  4. Sort by distance/rating
  5. Provide formatted results with details
```

### Memory Server

**Purpose:** Persistent conversation context

**Capabilities:**
- Store conversation facts
- Retrieve relevant context
- Update knowledge
- Temporal awareness
- Entity relationships

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-memory

# NPM
npm install -g @modelcontextprotocol/server-memory
```

**Configuration:**

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**Use Cases:**
- Long-term context retention
- User preference tracking
- Project-specific knowledge
- Conversation continuity
- Personalized assistance

**Example Workflow:**

```
Session 1:
User: "I prefer TypeScript for new projects"
AI (using memory): *stores preference*

Session 2:
User: "Create a new API service"
AI (using memory):
  1. Retrieves: User prefers TypeScript
  2. Generates TypeScript implementation
  3. Uses TypeScript patterns
```

### Puppeteer Server

**Purpose:** Browser automation and web scraping

**Capabilities:**
- Page navigation
- Screenshot capture
- PDF generation
- Form interaction
- JavaScript execution
- Dynamic content access

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-puppeteer

# NPM
npm install -g @modelcontextprotocol/server-puppeteer
```

**Configuration:**

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**Use Cases:**
- Web scraping
- Automated testing
- Screenshot generation
- PDF report creation
- Dynamic content extraction
- Form automation

**Example Workflow:**

```
User: "Get the latest prices from competitor website"
AI (using puppeteer):
  1. Navigate to competitor site
  2. Wait for dynamic content
  3. Extract pricing data
  4. Take screenshot for verification
  5. Format and present data
```

### Fetch Server

**Purpose:** HTTP requests and API interactions

**Capabilities:**
- GET/POST/PUT/DELETE requests
- Header customization
- Response parsing
- Authentication handling
- Error handling

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-fetch

# NPM
npm install -g @modelcontextprotocol/server-fetch
```

**Configuration:**

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

**Use Cases:**
- API testing
- Data fetching
- Webhook interactions
- Integration testing
- Service monitoring

**Example Workflow:**

```
User: "Check if our API is responding correctly"
AI (using fetch):
  1. Make GET request to API endpoint
  2. Verify response status
  3. Validate response structure
  4. Check response time
  5. Report health status
```

### Slack Server

**Purpose:** Slack workspace integration

**Capabilities:**
- Send messages
- Create channels
- Manage users
- File operations
- Reaction management
- Search history

**Installation:**

```bash
# NPX
npx -y @modelcontextprotocol/server-slack

# NPM
npm install -g @modelcontextprotocol/server-slack
```

**Configuration:**

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**Bot Token Setup:**

```bash
# Create Slack App: https://api.slack.com/apps
# Required scopes:
# - channels:read
# - channels:write
# - chat:write
# - files:write
# - users:read

export SLACK_BOT_TOKEN="xoxb-your-token"
export SLACK_TEAM_ID="T0000000000"
```

**Use Cases:**
- Team notifications
- Status updates
- Report distribution
- Alert management
- Collaboration automation

**Example Workflow:**

```
User: "Notify the team about deployment completion"
AI (using slack):
  1. Find appropriate channel
  2. Format deployment summary
  3. Send message with details
  4. Add reaction for visibility
  5. Pin important messages
```

## Popular Community Servers

### Development Tools

#### Git Server

**Purpose:** Advanced Git operations

**Repository:** `github.com/modelcontextprotocol/servers/tree/main/src/git`

**Capabilities:**
- Repository status
- Commit history
- Branch management
- Diff operations
- Merge operations

**Installation:**

```bash
npx -y @modelcontextprotocol/server-git
```

**Configuration:**

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "/path/to/repo"
      ]
    }
  }
}
```

**Use Cases:**
- Automated code reviews
- Commit message generation
- Branch cleanup
- Merge conflict resolution
- History analysis

#### Docker Server

**Purpose:** Container management

**Capabilities:**
- Container operations
- Image management
- Network configuration
- Volume management
- Compose operations

**Installation:**

```bash
npm install -g mcp-server-docker
```

**Configuration:**

```json
{
  "mcpServers": {
    "docker": {
      "command": "mcp-server-docker",
      "args": []
    }
  }
}
```

**Use Cases:**
- Container orchestration
- Development environment setup
- Service health monitoring
- Log analysis
- Resource management

#### Kubernetes Server

**Purpose:** Kubernetes cluster management

**Capabilities:**
- Pod operations
- Deployment management
- Service configuration
- Resource monitoring
- Log retrieval

**Installation:**

```bash
npm install -g mcp-server-kubernetes
```

**Configuration:**

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "mcp-server-kubernetes",
      "env": {
        "KUBECONFIG": "${HOME}/.kube/config"
      }
    }
  }
}
```

**Use Cases:**
- Cluster management
- Deployment automation
- Service debugging
- Resource optimization
- Incident response

### Data Sources

#### MongoDB Server

**Purpose:** MongoDB database operations

**Capabilities:**
- Collection queries
- Document operations
- Aggregation pipelines
- Index management
- Schema analysis

**Installation:**

```bash
npm install -g mcp-server-mongodb
```

**Configuration:**

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "mcp-server-mongodb",
      "env": {
        "MONGO_URI": "mongodb://localhost:27017/dbname"
      }
    }
  }
}
```

**Use Cases:**
- NoSQL data exploration
- Document schema analysis
- Query optimization
- Data migration
- Performance tuning

#### Redis Server

**Purpose:** Redis cache operations

**Capabilities:**
- Key-value operations
- Cache management
- Pub/sub messaging
- Performance monitoring
- Data structure operations

**Installation:**

```bash
npm install -g mcp-server-redis
```

**Configuration:**

```json
{
  "mcpServers": {
    "redis": {
      "command": "mcp-server-redis",
      "env": {
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

**Use Cases:**
- Cache analysis
- Session management
- Real-time analytics
- Message queue operations
- Performance optimization

#### Elasticsearch Server

**Purpose:** Search and analytics

**Capabilities:**
- Index operations
- Search queries
- Aggregations
- Mapping management
- Performance analysis

**Installation:**

```bash
npm install -g mcp-server-elasticsearch
```

**Configuration:**

```json
{
  "mcpServers": {
    "elasticsearch": {
      "command": "mcp-server-elasticsearch",
      "env": {
        "ES_URL": "http://localhost:9200",
        "ES_API_KEY": "${ES_API_KEY}"
      }
    }
  }
}
```

**Use Cases:**
- Full-text search
- Log analysis
- Data aggregation
- Search optimization
- Analytics queries

### Communication

#### Discord Server

**Purpose:** Discord bot integration

**Capabilities:**
- Message sending
- Channel management
- Role operations
- Embed creation
- Event handling

**Installation:**

```bash
npm install -g mcp-server-discord
```

**Configuration:**

```json
{
  "mcpServers": {
    "discord": {
      "command": "mcp-server-discord",
      "env": {
        "DISCORD_BOT_TOKEN": "${DISCORD_BOT_TOKEN}"
      }
    }
  }
}
```

**Use Cases:**
- Community management
- Automated moderation
- Event notifications
- Server analytics
- Custom commands

#### Email Server (SMTP)

**Purpose:** Email sending and management

**Capabilities:**
- Send emails
- Template rendering
- Attachment handling
- Bulk operations
- Delivery tracking

**Installation:**

```bash
npm install -g mcp-server-email
```

**Configuration:**

```json
{
  "mcpServers": {
    "email": {
      "command": "mcp-server-email",
      "env": {
        "SMTP_HOST": "smtp.gmail.com",
        "SMTP_PORT": "587",
        "SMTP_USER": "${EMAIL_USER}",
        "SMTP_PASS": "${EMAIL_PASS}"
      }
    }
  }
}
```

**Use Cases:**
- Automated notifications
- Report distribution
- Newsletter management
- Alert systems
- Customer communication

#### Telegram Server

**Purpose:** Telegram bot integration

**Capabilities:**
- Message sending
- Bot commands
- Inline keyboards
- File operations
- Webhook management

**Installation:**

```bash
npm install -g mcp-server-telegram
```

**Configuration:**

```json
{
  "mcpServers": {
    "telegram": {
      "command": "mcp-server-telegram",
      "env": {
        "TELEGRAM_BOT_TOKEN": "${TELEGRAM_BOT_TOKEN}"
      }
    }
  }
}
```

**Use Cases:**
- Customer support bots
- Notification systems
- Command interfaces
- Group management
- Content distribution

### Productivity

#### Google Drive Server

**Purpose:** Google Drive file operations

**Capabilities:**
- File upload/download
- Folder management
- Sharing operations
- Search files
- Metadata operations

**Installation:**

```bash
npm install -g mcp-server-gdrive
```

**Configuration:**

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "mcp-server-gdrive",
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

**Use Cases:**
- Document management
- Collaboration workflows
- File synchronization
- Backup operations
- Content organization

#### Notion Server

**Purpose:** Notion workspace integration

**Capabilities:**
- Page operations
- Database queries
- Block manipulation
- Property updates
- Search operations

**Installation:**

```bash
npm install -g mcp-server-notion
```

**Configuration:**

```json
{
  "mcpServers": {
    "notion": {
      "command": "mcp-server-notion",
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

**Use Cases:**
- Knowledge management
- Documentation automation
- Project tracking
- Content creation
- Team collaboration

#### Trello Server

**Purpose:** Trello board management

**Capabilities:**
- Board operations
- Card management
- List operations
- Label management
- Member operations

**Installation:**

```bash
npm install -g mcp-server-trello
```

**Configuration:**

```json
{
  "mcpServers": {
    "trello": {
      "command": "mcp-server-trello",
      "env": {
        "TRELLO_API_KEY": "${TRELLO_API_KEY}",
        "TRELLO_TOKEN": "${TRELLO_TOKEN}"
      }
    }
  }
}
```

**Use Cases:**
- Task automation
- Project management
- Sprint planning
- Progress tracking
- Team coordination

#### Jira Server

**Purpose:** Jira project management

**Capabilities:**
- Issue operations
- Project management
- Sprint operations
- JQL queries
- Workflow management

**Installation:**

```bash
npm install -g mcp-server-jira
```

**Configuration:**

```json
{
  "mcpServers": {
    "jira": {
      "command": "mcp-server-jira",
      "env": {
        "JIRA_URL": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

**Use Cases:**
- Issue tracking
- Sprint management
- Reporting
- Workflow automation
- Team analytics

### Cloud Services

#### AWS Server

**Purpose:** AWS service operations

**Capabilities:**
- EC2 management
- S3 operations
- Lambda functions
- CloudWatch metrics
- IAM operations

**Installation:**

```bash
npm install -g mcp-server-aws
```

**Configuration:**

```json
{
  "mcpServers": {
    "aws": {
      "command": "mcp-server-aws",
      "env": {
        "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

**Use Cases:**
- Infrastructure management
- Deployment automation
- Cost optimization
- Security auditing
- Resource monitoring

#### Google Cloud Server

**Purpose:** Google Cloud Platform operations

**Capabilities:**
- Compute Engine
- Cloud Storage
- Cloud Functions
- BigQuery
- IAM management

**Installation:**

```bash
npm install -g mcp-server-gcp
```

**Configuration:**

```json
{
  "mcpServers": {
    "gcp": {
      "command": "mcp-server-gcp",
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json",
        "GCP_PROJECT_ID": "${GCP_PROJECT_ID}"
      }
    }
  }
}
```

**Use Cases:**
- Resource provisioning
- Data pipeline management
- Application deployment
- Cost analysis
- Security management

#### Azure Server

**Purpose:** Microsoft Azure operations

**Capabilities:**
- Virtual machines
- Storage accounts
- App Services
- Azure Functions
- Resource management

**Installation:**

```bash
npm install -g mcp-server-azure
```

**Configuration:**

```json
{
  "mcpServers": {
    "azure": {
      "command": "mcp-server-azure",
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${AZURE_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
        "AZURE_CLIENT_ID": "${AZURE_CLIENT_ID}",
        "AZURE_CLIENT_SECRET": "${AZURE_CLIENT_SECRET}"
      }
    }
  }
}
```

**Use Cases:**
- Cloud resource management
- DevOps automation
- Application hosting
- Data services
- Identity management

#### Cloudflare Server

**Purpose:** Cloudflare service management

**Capabilities:**
- DNS management
- Worker operations
- KV storage
- Cache purging
- Analytics

**Installation:**

```bash
npm install -g mcp-server-cloudflare
```

**Configuration:**

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "mcp-server-cloudflare",
      "env": {
        "CLOUDFLARE_API_TOKEN": "${CLOUDFLARE_API_TOKEN}",
        "CLOUDFLARE_ACCOUNT_ID": "${CLOUDFLARE_ACCOUNT_ID}"
      }
    }
  }
}
```

**Use Cases:**
- DNS automation
- Edge computing
- CDN management
- Security configuration
- Performance optimization

## Multi-Server Workflows

### Development Pipeline

**Scenario:** Automated development workflow

**Servers Used:**
- Git (version control)
- GitHub (repository management)
- Docker (containerization)
- Slack (notifications)

**Configuration:**

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "docker": {
      "command": "mcp-server-docker"
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**Workflow:**

```
1. Developer: "Create a feature branch and set up environment"
   AI:
   - (git) Create feature branch
   - (github) Create draft PR
   - (docker) Start development containers
   - (slack) Notify team

2. Developer: "Run tests and create PR"
   AI:
   - (docker) Execute test suite
   - (git) Commit changes
   - (github) Update PR to ready
   - (slack) Request reviews

3. Developer: "Deploy to staging"
   AI:
   - (github) Merge PR
   - (docker) Build images
   - (kubernetes) Deploy to staging
   - (slack) Notify deployment
```

### Data Analysis Pipeline

**Scenario:** Multi-source data analysis

**Servers Used:**
- PostgreSQL (primary database)
- MongoDB (document store)
- Redis (cache)
- Elasticsearch (search/analytics)

**Configuration:**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${PG_CONN}"
      }
    },
    "mongodb": {
      "command": "mcp-server-mongodb",
      "env": {
        "MONGO_URI": "${MONGO_URI}"
      }
    },
    "redis": {
      "command": "mcp-server-redis",
      "env": {
        "REDIS_URL": "${REDIS_URL}"
      }
    },
    "elasticsearch": {
      "command": "mcp-server-elasticsearch",
      "env": {
        "ES_URL": "${ES_URL}",
        "ES_API_KEY": "${ES_API_KEY}"
      }
    }
  }
}
```

**Workflow:**

```
User: "Analyze user behavior patterns"
AI:
  1. (postgres) Get user demographic data
  2. (mongodb) Fetch interaction events
  3. (redis) Check cached analytics
  4. (elasticsearch) Run behavioral aggregations
  5. Combine and present insights
```

### Infrastructure Management

**Scenario:** Cloud infrastructure operations

**Servers Used:**
- AWS (cloud provider)
- Kubernetes (orchestration)
- Slack (notifications)
- Jira (tracking)

**Configuration:**

```json
{
  "mcpServers": {
    "aws": {
      "command": "mcp-server-aws",
      "env": {
        "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
        "AWS_REGION": "us-east-1"
      }
    },
    "kubernetes": {
      "command": "mcp-server-kubernetes",
      "env": {
        "KUBECONFIG": "${HOME}/.kube/config"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "jira": {
      "command": "mcp-server-jira",
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

**Workflow:**

```
User: "Scale up application for peak traffic"
AI:
  1. (aws) Check current EC2 capacity
  2. (kubernetes) Verify pod resources
  3. (aws) Provision additional instances
  4. (kubernetes) Scale deployments
  5. (jira) Create deployment ticket
  6. (slack) Notify ops team
```

## Installation Best Practices

### NPX vs Global Installation

**NPX (Recommended):**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"]
    }
  }
}
```

**Advantages:**
- No installation required
- Always uses latest version
- No version conflicts
- Clean environment

**Global Installation:**

```bash
npm install -g @modelcontextprotocol/server-name
```

```json
{
  "mcpServers": {
    "server-name": {
      "command": "mcp-server-name"
    }
  }
}
```

**Advantages:**
- Faster startup
- Offline availability
- Version control
- Lower bandwidth

### Version Management

**Specific Version:**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-name@1.2.3"
      ]
    }
  }
}
```

**Version Range:**

```bash
npm install -g @modelcontextprotocol/server-name@^1.0.0
```

**Update Strategy:**

```bash
# Check for updates
npm outdated -g

# Update specific server
npm update -g @modelcontextprotocol/server-name

# Update all
npm update -g
```

### Environment Variables

**Centralized Management:**

```bash
# .env file
GITHUB_TOKEN=ghp_xxx
SLACK_BOT_TOKEN=xoxb-xxx
POSTGRES_CONNECTION_STRING=postgresql://...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx
```

**Load in Shell:**

```bash
# .bashrc or .zshrc
export $(cat .env | xargs)
```

**Platform-Specific:**

```json
{
  "mcpServers": {
    "server": {
      "command": "npx",
      "args": ["-y", "server"],
      "env": {
        "API_KEY": "${API_KEY}",
        "FALLBACK": "default-value"
      }
    }
  }
}
```

### Security Considerations

**API Key Storage:**

```bash
# NEVER commit to git
echo ".env" >> .gitignore

# Use environment variables
export API_KEY="secure-key"

# Or use secret managers
export API_KEY=$(aws secretsmanager get-secret-value --secret-id mykey --query SecretString --output text)
```

**Least Privilege:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/allowed/path/only"
      ]
    }
  }
}
```

**Token Scopes:**

```
GitHub Token Scopes:
✅ repo (minimum required)
❌ admin:org (avoid if possible)
❌ delete_repo (never needed)

Slack Bot Scopes:
✅ chat:write
✅ channels:read
❌ admin (avoid)
```

## Platform-Specific Configurations

### Cursor

**Location:** `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Special Variables:**
- `${workspaceFolder}` - Current workspace root
- `${env:VAR}` - Environment variable

### Claude Code

**Location:** `.claude/mcp.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects"
      ]
    }
  }
}
```

**CLI Testing:**

```bash
# List servers
claude mcp list

# Test server
claude mcp test filesystem
```

### Gemini CLI

**Location:** `.gemini/settings.json`

```json
{
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/path"
        ]
      }
    }
  }
}
```

**Additional Config:** `.gemini/mcp_config.json`

### Antigravity

**Location:** `~/.gemini/antigravity/mcp_config.json` (global only)

```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username"
      ]
    }
  }
}
```

**Limitation:** No project-level MCP support

## Troubleshooting

### Server Not Found

**Symptoms:**
```
Error: MCP server 'name' not found
```

**Solutions:**

```bash
# Verify installation
npm list -g @modelcontextprotocol/server-name

# Reinstall
npm install -g @modelcontextprotocol/server-name

# Check path
which mcp-server-name

# Use full path
{
  "command": "/usr/local/bin/mcp-server-name"
}
```

### Authentication Failures

**Symptoms:**
```
Error: Authentication failed
Error: Invalid API key
```

**Solutions:**

```bash
# Verify environment variable
echo $API_KEY

# Check token validity
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/verify

# Regenerate token
# (platform-specific instructions)

# Test with direct value (temporarily)
{
  "env": {
    "API_KEY": "direct-value-for-testing"
  }
}
```

### Connection Issues

**Symptoms:**
```
Error: Connection timeout
Error: ECONNREFUSED
```

**Solutions:**

```bash
# Check service running
ps aux | grep postgres
docker ps

# Verify connection string
psql "$POSTGRES_CONNECTION_STRING"

# Check firewall
telnet localhost 5432

# Test network
ping database.host.com
```

### Permission Errors

**Symptoms:**
```
Error: EACCES: permission denied
Error: Insufficient privileges
```

**Solutions:**

```bash
# Check file permissions
ls -la /path/to/file

# Fix permissions
chmod 644 file
chmod 755 directory

# Check token scopes
# Regenerate with correct permissions

# Verify allowed paths
{
  "args": [
    "/explicitly/allowed/path"
  ]
}
```

## Testing MCP Servers

### Manual Testing

```bash
# Claude Code
claude mcp list
claude mcp test server-name

# Check server output
npx @modelcontextprotocol/server-name --help

# Test with curl (if HTTP)
curl http://localhost:3000/health
```

### Automated Testing

```javascript
// test-mcp-server.js
const { spawn } = require('child_process');

async function testServer(name, command, args) {
  console.log(`Testing ${name}...`);

  const server = spawn(command, args);

  let output = '';
  server.stdout.on('data', (data) => {
    output += data.toString();
  });

  server.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  setTimeout(() => {
    server.kill();
    console.log(`${name}: ${output.includes('ready') ? 'OK' : 'FAILED'}`);
  }, 5000);
}

// Test servers
testServer('filesystem', 'npx', ['-y', '@modelcontextprotocol/server-filesystem', '/tmp']);
testServer('github', 'npx', ['-y', '@modelcontextprotocol/server-github']);
```

## Resources

### Official Resources

- **MCP Documentation:** https://modelcontextprotocol.io/docs
- **Server Repository:** https://github.com/modelcontextprotocol/servers
- **Specification:** https://spec.modelcontextprotocol.io/
- **Community Forum:** https://github.com/modelcontextprotocol/discussions

### Server Discovery

- **npm Registry:** Search for "mcp-server-*"
- **GitHub Topics:** #model-context-protocol
- **Community List:** https://github.com/modelcontextprotocol/servers/blob/main/SERVERS.md

### Development

- **Create Server Guide:** See [Creating Servers](../03-creating-servers/README.md)
- **SDK Documentation:** https://github.com/modelcontextprotocol/sdk
- **Examples:** https://github.com/modelcontextprotocol/examples

### Platform Guides

- **Cursor:** See [Cursor Guide](../04-platform-guides/cursor.md)
- **Claude Code:** See [Claude Code Guide](../04-platform-guides/claude-code.md)
- **Gemini CLI:** See [Gemini CLI Guide](../04-platform-guides/gemini-cli.md)
- **Antigravity:** See [Antigravity Guide](../04-platform-guides/antigravity.md)

## Next Steps

- **[Security Best Practices](./security-best-practices.md)** - Secure your MCP servers
- **[Performance Optimization](./performance-optimization.md)** - Optimize server performance
- **[Creating Custom Servers](../03-creating-servers/README.md)** - Build your own servers
- **[Advanced Integration](../05-advanced/README.md)** - Multi-server patterns

## Summary

This guide covered:

- **Official Servers:** 10+ servers from Anthropic covering essential functionality
- **Community Servers:** 20+ popular servers across development, data, communication, productivity, and cloud
- **Installation:** NPX vs global installation strategies
- **Configuration:** Platform-specific setup for Cursor, Claude, Gemini, and Antigravity
- **Security:** Best practices for API keys, tokens, and permissions
- **Workflows:** Multi-server integration patterns
- **Troubleshooting:** Common issues and solutions

The MCP ecosystem continues to grow with new servers added regularly. Check the official server repository and community resources for the latest additions.
