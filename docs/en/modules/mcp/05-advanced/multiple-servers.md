# Managing Multiple MCP Servers

A comprehensive guide to running, orchestrating, and managing multiple MCP servers simultaneously across different platforms. Learn strategies for server coordination, dependency management, resource allocation, and avoiding tool name collisions.

## Overview

As your MCP ecosystem grows, you'll likely need to run multiple servers simultaneously to provide different capabilities. This guide covers the architectural patterns, configuration strategies, and best practices for managing complex multi-server setups.

**Key Concepts:**
- Server orchestration and lifecycle management
- Resource allocation and performance optimization
- Tool namespace management and collision prevention
- Cross-server dependency handling
- Configuration strategies for different environments

---

## Why Use Multiple MCP Servers?

### Separation of Concerns

Each server handles a specific domain or capability:

```json
{
  "mcpServers": {
    "documentation": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**Benefits:**
- Clear responsibility boundaries
- Independent versioning and updates
- Focused tool sets
- Easier debugging and maintenance

### Distributed Architecture

Separate local and remote servers based on deployment needs:

**Local Servers:**
- File system access
- Local database connections
- Development tools
- Personal utilities

**Remote Servers:**
- Cloud APIs and services
- Team collaboration tools
- Production databases
- Enterprise integrations

### Scalability

Add new capabilities without modifying existing servers:

```json
{
  "mcpServers": {
    "core-tools": { /* existing */ },
    "analytics": { /* new capability */ },
    "monitoring": { /* new capability */ }
  }
}
```

---

## Multi-Server Architecture Patterns

### Pattern 1: Layered Architecture

Organize servers by architectural layer:

```json
{
  "mcpServers": {
    // Presentation Layer
    "ui-components": {
      "command": "npx",
      "args": ["-y", "mcp-server-figma"]
    },

    // Business Logic Layer
    "business-rules": {
      "command": "node",
      "args": ["./servers/business-logic.js"]
    },

    // Data Access Layer
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    },
    "redis-cache": {
      "command": "python",
      "args": ["-m", "redis_mcp_server"]
    }
  }
}
```

**Use cases:**
- Enterprise applications
- Complex business systems
- Multi-tier architectures

### Pattern 2: Domain-Driven Design

Organize servers by business domain:

```json
{
  "mcpServers": {
    // User Management Domain
    "user-auth": {
      "url": "https://auth.company.com/mcp"
    },

    // Inventory Domain
    "inventory-management": {
      "command": "node",
      "args": ["./domains/inventory/mcp-server.js"]
    },

    // Order Processing Domain
    "order-processing": {
      "command": "node",
      "args": ["./domains/orders/mcp-server.js"]
    },

    // Shared Services
    "email-notifications": {
      "url": "https://notifications.company.com/mcp"
    }
  }
}
```

**Use cases:**
- Large organizations
- Microservices architecture
- Team autonomy

### Pattern 3: Environment-Based

Different servers for different environments:

```json
{
  "mcpServers": {
    // Development Only
    "dev-database": {
      "command": "npx",
      "args": ["-y", "mcp-server-sqlite"],
      "env": {
        "DB_PATH": "./dev.db"
      }
    },
    "mock-api": {
      "url": "http://localhost:3000/mcp"
    },

    // Staging
    "staging-database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${STAGING_DB_URL}"
      }
    },

    // Production
    "prod-database": {
      "url": "https://prod-db-proxy.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${PROD_TOKEN}"
      }
    }
  }
}
```

**Use cases:**
- CI/CD pipelines
- Multi-environment deployments
- Progressive rollouts

### Pattern 4: Microservices

Each server is an independent microservice:

```json
{
  "mcpServers": {
    "user-service": {
      "url": "https://users.api.company.com/mcp"
    },
    "payment-service": {
      "url": "https://payments.api.company.com/mcp"
    },
    "notification-service": {
      "url": "https://notifications.api.company.com/mcp"
    },
    "analytics-service": {
      "url": "https://analytics.api.company.com/mcp"
    }
  }
}
```

**Use cases:**
- Cloud-native applications
- Distributed systems
- Independent scaling

---

## Server Orchestration and Coordination

### Startup Order Management

Some servers may depend on others being available first.

#### Sequential Startup (Bash Script)

```bash
#!/bin/bash
# startup-mcp-servers.sh

echo "Starting MCP servers in order..."

# 1. Start database server
echo "Starting database server..."
npx -y @modelcontextprotocol/server-postgres &
DB_PID=$!
sleep 3

# 2. Start cache server
echo "Starting cache server..."
python -m redis_mcp_server &
CACHE_PID=$!
sleep 2

# 3. Start application server
echo "Starting application server..."
node ./servers/app-server.js &
APP_PID=$!

# Wait for initialization
sleep 5

echo "All servers started"
echo "Database PID: $DB_PID"
echo "Cache PID: $CACHE_PID"
echo "App PID: $APP_PID"

# Save PIDs for cleanup
echo "$DB_PID $CACHE_PID $APP_PID" > .mcp-pids
```

**Shutdown script:**
```bash
#!/bin/bash
# shutdown-mcp-servers.sh

if [ -f .mcp-pids ]; then
  read -r DB_PID CACHE_PID APP_PID < .mcp-pids

  echo "Stopping servers..."
  kill $APP_PID
  sleep 2
  kill $CACHE_PID
  sleep 1
  kill $DB_PID

  rm .mcp-pids
  echo "All servers stopped"
else
  echo "No PID file found"
fi
```

#### Health Check Coordination

Wait for servers to be ready before starting dependent servers:

```javascript
// health-check.js
async function waitForServer(url, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        console.log(`✅ Server ready: ${url}`);
        return true;
      }
    } catch (error) {
      console.log(`⏳ Waiting for ${url}... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error(`Server not ready: ${url}`);
}

async function startServers() {
  // Start and wait for database
  console.log("Starting database...");
  exec("npx -y @modelcontextprotocol/server-postgres");
  await waitForServer("http://localhost:5432");

  // Start and wait for cache
  console.log("Starting cache...");
  exec("python -m redis_mcp_server");
  await waitForServer("http://localhost:6379");

  // Start application server
  console.log("Starting application...");
  exec("node ./servers/app-server.js");
  await waitForServer("http://localhost:3000");

  console.log("✅ All servers ready");
}

startServers().catch(console.error);
```

### Process Management with PM2

Use PM2 for robust process orchestration:

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: "mcp-database",
      script: "npx",
      args: "-y @modelcontextprotocol/server-postgres",
      env: {
        DATABASE_URL: process.env.DATABASE_URL
      },
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "mcp-cache",
      script: "python",
      args: "-m redis_mcp_server",
      wait_ready: true,
      listen_timeout: 5000
    },
    {
      name: "mcp-api",
      script: "node",
      args: "./servers/api-server.js",
      wait_ready: true,
      listen_timeout: 10000,
      depends_on: ["mcp-database", "mcp-cache"]
    },
    {
      name: "mcp-analytics",
      script: "node",
      args: "./servers/analytics-server.js",
      instances: 2,
      exec_mode: "cluster"
    }
  ]
};
```

**Usage:**
```bash
# Start all servers
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs mcp-database

# Restart specific server
pm2 restart mcp-api

# Stop all
pm2 stop all

# Delete all
pm2 delete all
```

### Docker Compose Orchestration

Manage multiple servers as containers:

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mcp-database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
      timeout: 5s
      retries: 5

  mcp-cache:
    image: redis:7
    depends_on:
      mcp-database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s

  mcp-postgres-server:
    build: ./servers/postgres-mcp
    depends_on:
      mcp-database:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@mcp-database:5432/postgres
    ports:
      - "3001:3000"

  mcp-api-server:
    build: ./servers/api-mcp
    depends_on:
      mcp-postgres-server:
        condition: service_started
      mcp-cache:
        condition: service_healthy
    environment:
      POSTGRES_MCP_URL: http://mcp-postgres-server:3000
      REDIS_URL: redis://mcp-cache:6379
    ports:
      - "3002:3000"

  mcp-analytics-server:
    build: ./servers/analytics-mcp
    depends_on:
      - mcp-api-server
    deploy:
      replicas: 3
    ports:
      - "3003-3005:3000"

networks:
  default:
    name: mcp-network
```

**Usage:**
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f mcp-api-server

# Scale service
docker-compose up -d --scale mcp-analytics-server=5

# Stop all
docker-compose down
```

---

## Dependency Management Between Servers

### Explicit Dependencies

Document server dependencies clearly:

**dependency-graph.md:**
```markdown
# MCP Server Dependency Graph

```
mcp-analytics-server
    ↓ depends on
mcp-api-server
    ↓ depends on
mcp-postgres-server ← → mcp-cache-server
    ↓ depends on          ↓ depends on
postgres (database)   redis (cache)
```

**Startup order:** postgres → redis → mcp-postgres-server → mcp-cache-server → mcp-api-server → mcp-analytics-server
```

### Dependency Injection Pattern

Pass server connection information as environment variables:

```json
{
  "mcpServers": {
    "data-layer": {
      "command": "node",
      "args": ["./servers/data-layer.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "business-layer": {
      "command": "node",
      "args": ["./servers/business-layer.js"],
      "env": {
        "DATA_LAYER_URL": "http://localhost:3001/mcp",
        "CACHE_URL": "redis://localhost:6379"
      }
    },
    "api-layer": {
      "command": "node",
      "args": ["./servers/api-layer.js"],
      "env": {
        "BUSINESS_LAYER_URL": "http://localhost:3002/mcp"
      }
    }
  }
}
```

### Service Discovery

Use service discovery for dynamic server locations:

**consul-config.json:**
```json
{
  "service": {
    "name": "mcp-database",
    "tags": ["mcp", "database"],
    "port": 3001,
    "check": {
      "http": "http://localhost:3001/health",
      "interval": "10s"
    }
  }
}
```

**Server using discovery:**
```javascript
// business-server.js
const consul = require('consul')();

async function getDataLayerUrl() {
  const result = await consul.health.service({
    service: 'mcp-database',
    passing: true
  });

  if (result.length === 0) {
    throw new Error('Data layer not available');
  }

  const service = result[0];
  return `http://${service.Service.Address}:${service.Service.Port}/mcp`;
}

async function initServer() {
  const dataLayerUrl = await getDataLayerUrl();
  console.log(`Connecting to data layer: ${dataLayerUrl}`);
  // Initialize server with discovered URL
}
```

---

## Resource Allocation and Limits

### Memory Limits

Prevent servers from consuming excessive memory:

#### Node.js Servers

```json
{
  "mcpServers": {
    "memory-limited-server": {
      "command": "node",
      "args": [
        "--max-old-space-size=512",
        "./servers/server.js"
      ],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=512"
      }
    }
  }
}
```

#### Docker Containers

```yaml
services:
  mcp-server:
    image: my-mcp-server
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### CPU Limits

Control CPU usage per server:

**Using cgroups (Linux):**
```bash
# Create cgroup
sudo cgcreate -g cpu:/mcp-servers

# Set CPU limit (50% of one core)
sudo cgset -r cpu.cfs_quota_us=50000 mcp-servers
sudo cgset -r cpu.cfs_period_us=100000 mcp-servers

# Run server in cgroup
sudo cgexec -g cpu:mcp-servers npx -y mcp-server
```

**Docker Compose:**
```yaml
services:
  mcp-server:
    image: my-mcp-server
    cpus: 0.5
    mem_limit: 512m
```

### Connection Pool Limits

Limit concurrent connections per server:

```json
{
  "mcpServers": {
    "database-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_MAX_CONNECTIONS": "10",
        "POSTGRES_IDLE_TIMEOUT": "30000",
        "POSTGRES_CONNECTION_TIMEOUT": "5000"
      }
    }
  }
}
```

### Request Rate Limiting

Implement rate limiting to prevent overload:

**Server-side implementation:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/mcp', limiter);
```

### Total Tool Limit

Platforms have limits on total tools across all servers:

| Platform | Tool Limit | Recommendation |
|----------|-----------|----------------|
| Claude Code | ~100 tools | Use tool filtering |
| Cursor | ~200 tools | Enable selectively |
| Gemini CLI | 50 tools | Use `includeTools` |
| Antigravity | 50 tools | Disable unused servers |

**Monitoring tool count:**
```bash
# Claude Code
claude mcp list | grep "tools:" | awk '{sum += $2} END {print "Total tools:", sum}'

# Cursor
# Check MCP panel in settings

# Gemini CLI
gemini mcp list --format json | jq '[.[] | .tools | length] | add'
```

---

## Tool Name Collision Handling

### Understanding Tool Namespacing

When multiple servers provide tools with the same name, platforms handle collisions differently.

#### Platform-Specific Behavior

**Claude Code:**
- Tools prefixed with server name: `server-name__tool-name`
- Explicit namespace visible to AI
- No collisions possible

**Cursor:**
- Tools may override each other
- Last-loaded server wins
- Check MCP panel for conflicts

**Gemini CLI:**
- Server name prefix: `server_tool`
- Collision warnings in logs
- First server registered wins

**Antigravity:**
- Server name prefix automatically added
- Clear namespace separation
- No manual intervention needed

### Naming Strategies

#### Strategy 1: Server Name Prefixing (Automatic)

Most platforms automatically prefix tools with server names:

```
Server: github
Tools: create_issue, list_repos

Available as:
- github__create_issue
- github__list_repos
```

#### Strategy 2: Explicit Tool Naming (Manual)

Design tool names to include context:

**Good tool names:**
```javascript
// Server: user-management
{
  tools: [
    { name: "user_auth_login" },
    { name: "user_auth_logout" },
    { name: "user_profile_get" },
    { name: "user_profile_update" }
  ]
}
```

**Bad tool names:**
```javascript
// Server: user-management
{
  tools: [
    { name: "login" },      // Too generic
    { name: "logout" },     // Too generic
    { name: "get" },        // Too vague
    { name: "update" }      // Too vague
  ]
}
```

#### Strategy 3: Server Name Disambiguation

Use descriptive server names to avoid confusion:

```json
{
  "mcpServers": {
    // ❌ BAD - Generic names
    "api": { /* ... */ },
    "database": { /* ... */ },
    "cache": { /* ... */ },

    // ✅ GOOD - Descriptive names
    "stripe-payment-api": { /* ... */ },
    "postgres-user-database": { /* ... */ },
    "redis-session-cache": { /* ... */ }
  }
}
```

### Detecting Collisions

**Custom script to check for collisions:**
```javascript
// check-tool-collisions.js
const configs = [
  require('./.cursor/mcp.json'),
  require('./.claude/mcp.json'),
  require('./.gemini/settings.json')
];

const toolMap = new Map();
const collisions = [];

for (const config of configs) {
  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    // Simulate tool discovery (would need actual server introspection)
    const tools = getToolsFromServer(serverConfig);

    for (const tool of tools) {
      const key = tool.name;
      if (toolMap.has(key)) {
        collisions.push({
          tool: key,
          servers: [toolMap.get(key), serverName]
        });
      }
      toolMap.set(key, serverName);
    }
  }
}

if (collisions.length > 0) {
  console.error('⚠️  Tool name collisions detected:');
  collisions.forEach(c => {
    console.error(`  - "${c.tool}" in servers: ${c.servers.join(', ')}`);
  });
  process.exit(1);
} else {
  console.log('✅ No tool name collisions');
}
```

### Resolving Collisions

#### Option 1: Rename Tools

Modify server implementation to use unique names:

```javascript
// Before
{
  name: "search",
  // ...
}

// After
{
  name: "github_search",
  // ...
}
```

#### Option 2: Use Different Server Instances

Run the same server with different configurations:

```json
{
  "mcpServers": {
    "github-personal": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${PERSONAL_TOKEN}"
      }
    },
    "github-work": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${WORK_TOKEN}"
      }
    }
  }
}
```

Tools are namespaced automatically:
- `github-personal__create_issue`
- `github-work__create_issue`

#### Option 3: Tool Filtering

Enable only non-conflicting tools:

**Cursor:**
```json
{
  "mcpServers": {
    "server1": {
      "command": "server1",
      "includeTools": ["unique_tool_1", "unique_tool_2"]
    },
    "server2": {
      "command": "server2",
      "includeTools": ["different_tool_1", "different_tool_2"]
    }
  }
}
```

**Gemini CLI:**
```json
{
  "mcpServers": {
    "server1": {
      "command": "server1",
      "includeTools": ["safe_*"],
      "excludeTools": ["conflicting_tool"]
    }
  }
}
```

---

## Configuration Strategies for Multi-Server Setups

### Strategy 1: Monolithic Configuration

Single configuration file for all servers:

**.cursor/mcp.json:**
```json
{
  "mcpServers": {
    "documentation": { /* ... */ },
    "filesystem": { /* ... */ },
    "database": { /* ... */ },
    "github": { /* ... */ },
    "slack": { /* ... */ },
    "analytics": { /* ... */ }
  }
}
```

**Pros:**
- Single source of truth
- Easy to see all servers
- Simple to version control

**Cons:**
- Large file size
- Difficult to manage at scale
- Hard to share subsets

### Strategy 2: Modular Configuration

Split configuration into multiple files:

**Project structure:**
```
.mcp/
├── servers/
│   ├── development.json
│   ├── documentation.json
│   ├── database.json
│   ├── api-integrations.json
│   └── analytics.json
├── environments/
│   ├── dev.json
│   ├── staging.json
│   └── production.json
└── build-config.js
```

**build-config.js:**
```javascript
const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

// Load base servers
const servers = {};
const serverFiles = fs.readdirSync('./mcp/servers');
for (const file of serverFiles) {
  const config = JSON.parse(fs.readFileSync(`./mcp/servers/${file}`));
  Object.assign(servers, config.mcpServers);
}

// Load environment-specific overrides
const envConfig = JSON.parse(
  fs.readFileSync(`./mcp/environments/${environment}.json`)
);

// Merge configurations
const finalConfig = {
  mcpServers: {
    ...servers,
    ...envConfig.mcpServers
  }
};

// Write to platform-specific locations
fs.writeFileSync('.cursor/mcp.json', JSON.stringify(finalConfig, null, 2));
fs.writeFileSync('.claude/mcp.json', JSON.stringify(finalConfig, null, 2));

console.log(`✅ Built MCP configuration for ${environment}`);
```

### Strategy 3: Template-Based Configuration

Use templates with variable substitution:

**mcp-config.template.json:**
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "{{DATABASE_URL}}"
      }
    },
    "api": {
      "url": "{{API_BASE_URL}}/mcp",
      "headers": {
        "Authorization": "Bearer {{API_TOKEN}}"
      }
    }
  }
}
```

**variables.dev.json:**
```json
{
  "DATABASE_URL": "postgresql://localhost/dev",
  "API_BASE_URL": "http://localhost:3000",
  "API_TOKEN": "dev-token-123"
}
```

**generate-config.js:**
```javascript
const fs = require('fs');

const template = fs.readFileSync('mcp-config.template.json', 'utf8');
const variables = JSON.parse(fs.readFileSync(`variables.${process.env.NODE_ENV}.json`));

let config = template;
for (const [key, value] of Object.entries(variables)) {
  config = config.replace(new RegExp(`{{${key}}}`, 'g'), value);
}

fs.writeFileSync('.cursor/mcp.json', config);
console.log('✅ Generated configuration');
```

### Strategy 4: Centralized Source of Truth

Use `.agents/mcp/mcp-servers.json` as single source:

**Project structure:**
```
project/
├── .agents/
│   └── mcp/
│       ├── mcp-servers.json        # Source of truth
│       └── sync-mcp.sh             # Sync script
├── .cursor/
│   └── mcp.json                    # Generated
├── .claude/
│   └── mcp.json                    # Generated
├── .gemini/
│   └── settings.json               # Generated
└── .gemini/antigravity/
    └── mcp_config.json             # Generated
```

**Benefits:**
- Single source of truth
- Platform-specific generation
- Version control friendly
- Automated synchronization

See [mcp-setup-guide.md](../guides/mcp/mcp-setup-guide.md) for implementation details.

---

## Performance Considerations

### Startup Performance

Multiple servers increase initialization time:

**Metrics to monitor:**
```bash
# Measure startup time
time claude mcp list

# Or
start_time=$(date +%s%N)
claude mcp list > /dev/null
end_time=$(date +%s%N)
duration=$((($end_time - $start_time) / 1000000))
echo "Startup took ${duration}ms"
```

**Optimization strategies:**

1. **Lazy Loading:**
   ```javascript
   // Only start servers when first tool is invoked
   const serverPool = new Map();

   async function getServer(name) {
     if (!serverPool.has(name)) {
       console.log(`Starting server: ${name}`);
       const server = await startServer(name);
       serverPool.set(name, server);
     }
     return serverPool.get(name);
   }
   ```

2. **Parallel Initialization:**
   ```javascript
   // Start all servers in parallel
   const servers = await Promise.all([
     startServer('database'),
     startServer('cache'),
     startServer('api')
   ]);
   ```

3. **Server Pooling:**
   ```javascript
   // Reuse servers across requests
   class ServerPool {
     constructor(maxSize = 5) {
       this.pool = [];
       this.maxSize = maxSize;
     }

     async acquire(serverName) {
       const idle = this.pool.find(s =>
         s.name === serverName && !s.busy
       );

       if (idle) {
         idle.busy = true;
         return idle;
       }

       if (this.pool.length < this.maxSize) {
         const server = await startServer(serverName);
         server.busy = true;
         this.pool.push(server);
         return server;
       }

       throw new Error('Server pool exhausted');
     }

     release(server) {
       server.busy = false;
     }
   }
   ```

### Runtime Performance

**Tool execution overhead:**

Each server adds latency to tool calls. Minimize by:

1. **Local servers over remote:**
   - stdio: <10ms latency
   - HTTP localhost: ~50ms latency
   - Remote HTTP: 100-500ms latency

2. **Connection pooling:**
   ```json
   {
     "mcpServers": {
       "api": {
         "url": "https://api.example.com/mcp",
         "headers": {
           "Connection": "keep-alive"
         },
         "connectionPool": {
           "maxConnections": 10,
           "keepAlive": true
         }
       }
     }
   }
   ```

3. **Caching responses:**
   ```javascript
   const cache = new Map();

   async function callTool(serverName, toolName, params) {
     const cacheKey = `${serverName}:${toolName}:${JSON.stringify(params)}`;

     if (cache.has(cacheKey)) {
       return cache.get(cacheKey);
     }

     const result = await actualToolCall(serverName, toolName, params);
     cache.set(cacheKey, result);

     // Expire after 5 minutes
     setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

     return result;
   }
   ```

### Memory Management

Multiple servers can consume significant memory:

**Monitoring:**
```bash
# Linux
ps aux | grep mcp | awk '{print $2, $4, $11}' | column -t

# macOS
ps aux | grep mcp | awk '{print $2, $3, $11}' | column -t

# Docker
docker stats --no-stream
```

**Optimization:**

1. **Implement graceful shutdown:**
   ```javascript
   process.on('SIGTERM', async () => {
     console.log('Shutting down gracefully...');
     await closeConnections();
     process.exit(0);
   });
   ```

2. **Use shared resources:**
   ```javascript
   // Share database connection pool
   const connectionPool = createPool({
     max: 20,
     // All servers use same pool
   });
   ```

3. **Implement resource limits:**
   ```json
   {
     "mcpServers": {
       "limited-server": {
         "command": "node",
         "args": [
           "--max-old-space-size=256",
           "server.js"
         ]
       }
     }
   }
   ```

---

## Load Balancing Strategies

### Round-Robin Load Balancing

Distribute requests across multiple server instances:

```json
{
  "mcpServers": {
    "api-node-1": {
      "url": "https://api-1.company.com/mcp"
    },
    "api-node-2": {
      "url": "https://api-2.company.com/mcp"
    },
    "api-node-3": {
      "url": "https://api-3.company.com/mcp"
    }
  }
}
```

**Client-side load balancer:**
```javascript
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.current = 0;
  }

  getNext() {
    const server = this.servers[this.current];
    this.current = (this.current + 1) % this.servers.length;
    return server;
  }

  async callTool(toolName, params) {
    const server = this.getNext();
    return await server.callTool(toolName, params);
  }
}

const lb = new LoadBalancer([
  getServer('api-node-1'),
  getServer('api-node-2'),
  getServer('api-node-3')
]);
```

### Least Connections

Route to server with fewest active connections:

```javascript
class LeastConnectionsBalancer {
  constructor(servers) {
    this.servers = servers.map(s => ({
      server: s,
      connections: 0
    }));
  }

  getNext() {
    const sorted = this.servers.sort((a, b) =>
      a.connections - b.connections
    );
    const selected = sorted[0];
    selected.connections++;
    return selected.server;
  }

  release(server) {
    const entry = this.servers.find(s => s.server === server);
    if (entry) {
      entry.connections--;
    }
  }
}
```

### Weighted Load Balancing

Assign weights based on server capacity:

```javascript
class WeightedBalancer {
  constructor(servers) {
    // servers: [{ server, weight }]
    this.servers = servers;
    this.totalWeight = servers.reduce((sum, s) => sum + s.weight, 0);
  }

  getNext() {
    let random = Math.random() * this.totalWeight;

    for (const { server, weight } of this.servers) {
      random -= weight;
      if (random <= 0) {
        return server;
      }
    }

    return this.servers[0].server;
  }
}

const lb = new WeightedBalancer([
  { server: getServer('api-node-1'), weight: 3 },  // 3x capacity
  { server: getServer('api-node-2'), weight: 2 },  // 2x capacity
  { server: getServer('api-node-3'), weight: 1 }   // 1x capacity
]);
```

### Health-Based Routing

Only route to healthy servers:

```javascript
class HealthAwareBalancer {
  constructor(servers) {
    this.servers = servers;
    this.healthStatus = new Map();

    // Start health checks
    this.startHealthChecks();
  }

  startHealthChecks() {
    setInterval(async () => {
      for (const server of this.servers) {
        const healthy = await this.checkHealth(server);
        this.healthStatus.set(server, healthy);
      }
    }, 30000); // Check every 30s
  }

  async checkHealth(server) {
    try {
      const response = await fetch(`${server.url}/health`, {
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getHealthyServers() {
    return this.servers.filter(s =>
      this.healthStatus.get(s) !== false
    );
  }

  getNext() {
    const healthy = this.getHealthyServers();
    if (healthy.length === 0) {
      throw new Error('No healthy servers available');
    }
    return healthy[Math.floor(Math.random() * healthy.length)];
  }
}
```

---

## Complete Multi-Server Examples

### Example 1: Full-Stack Development Setup

**Claude Code (.claude/mcp.json):**
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    },
    "postgres-dev": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DEV_DATABASE_URL}"
      }
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "oauth": true
    },
    "local-api": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/mcp/api-server.js"],
      "env": {
        "NODE_ENV": "development",
        "PORT": "3000"
      }
    }
  }
}
```

### Example 2: Cursor Team Configuration

**.cursor/mcp.json:**
```json
{
  "mcpServers": {
    "documentation": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "project-files": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    },
    "redis-cache": {
      "command": "python",
      "args": ["-m", "redis_mcp_server"],
      "env": {
        "REDIS_URL": "${env:REDIS_URL}"
      }
    },
    "github-org": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${env:GITHUB_TOKEN}"
      }
    },
    "slack-workspace": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${env:SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${env:SLACK_TEAM_ID}"
      }
    },
    "custom-tools": {
      "command": "node",
      "args": ["${workspaceFolder}/tools/mcp-server.js"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}",
        "TEAM_API_KEY": "${env:TEAM_API_KEY}"
      }
    }
  }
}
```

### Example 3: Gemini CLI Multi-Environment

**.gemini/settings.json:**
```json
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "$CONTEXT7_API_KEY"
      },
      "trust": true
    },
    "dev-database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "$DEV_DATABASE_URL"
      },
      "includeTools": ["query", "list_tables", "describe_table"],
      "trust": false
    },
    "staging-api": {
      "url": "https://staging.api.company.com/sse",
      "headers": {
        "Authorization": "Bearer $STAGING_TOKEN"
      },
      "trust": false
    },
    "prod-analytics": {
      "httpUrl": "https://analytics.company.com/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/bigquery"]
      },
      "includeTools": ["query_*", "list_*"],
      "excludeTools": ["delete_*", "modify_*"],
      "trust": false,
      "timeout": 60000
    },
    "local-tools": {
      "command": "python",
      "args": ["-m", "local_mcp_server"],
      "cwd": "${workspaceFolder}/servers",
      "env": {
        "PYTHONPATH": "${workspaceFolder}",
        "LOG_LEVEL": "debug"
      },
      "trust": true
    }
  }
}
```

### Example 4: Antigravity Global Configuration

**~/.gemini/antigravity/mcp_config.json:**
```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    },
    "github-personal": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_PERSONAL_TOKEN}"
      }
    },
    "github-work": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_WORK_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${env:SUPABASE_TOKEN}"
      ],
      "env": {}
    },
    "pencil-design": {
      "command": "/Users/username/.antigravity/extensions/highagency.pencildev-0.6.20-universal/out/mcp-server-darwin-arm64",
      "args": ["--ws-port", "54989"],
      "env": {}
    },
    "personal-tools": {
      "command": "node",
      "args": ["/Users/username/tools/mcp-server.js"],
      "env": {
        "USER_HOME": "${env:HOME}",
        "TOOLS_CONFIG": "/Users/username/.config/tools.json"
      }
    }
  }
}
```

### Example 5: Microservices Architecture

**Production deployment:**
```json
{
  "mcpServers": {
    "user-service": {
      "url": "https://users.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${USER_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 30000,
      "retries": 3
    },
    "payment-service": {
      "url": "https://payments.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${PAYMENT_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 45000,
      "retries": 5
    },
    "inventory-service": {
      "url": "https://inventory.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${INVENTORY_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 20000
    },
    "notification-service": {
      "url": "https://notifications.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTIFICATION_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 15000
    },
    "analytics-service": {
      "url": "https://analytics.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${ANALYTICS_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 60000
    },
    "audit-service": {
      "url": "https://audit.prod.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${AUDIT_SERVICE_TOKEN}",
        "X-Service": "ai-assistant"
      },
      "timeout": 10000
    }
  }
}
```

---

## Best Practices

### Configuration Management

**DO:**
- ✅ Use centralized configuration source (`.agents/mcp/mcp-servers.json`)
- ✅ Document server dependencies
- ✅ Provide environment variable templates
- ✅ Use descriptive server names
- ✅ Version control configurations
- ✅ Test configurations before deployment

**DON'T:**
- ❌ Duplicate configurations across platforms manually
- ❌ Hardcode sensitive credentials
- ❌ Use generic server names
- ❌ Skip documentation
- ❌ Commit secrets to version control

### Resource Management

**DO:**
- ✅ Set memory and CPU limits
- ✅ Monitor resource usage
- ✅ Implement graceful shutdown
- ✅ Use connection pooling
- ✅ Enable health checks
- ✅ Implement rate limiting

**DON'T:**
- ❌ Run unlimited server instances
- ❌ Ignore resource constraints
- ❌ Skip performance monitoring
- ❌ Leave connections open indefinitely

### Tool Management

**DO:**
- ✅ Use unique, descriptive tool names
- ✅ Implement tool filtering where needed
- ✅ Monitor total tool count
- ✅ Document tool purposes
- ✅ Test for name collisions

**DON'T:**
- ❌ Use generic tool names
- ❌ Exceed platform tool limits
- ❌ Ignore namespace conflicts
- ❌ Enable all tools from all servers

### Scalability

**DO:**
- ✅ Design for horizontal scaling
- ✅ Use load balancing strategies
- ✅ Implement service discovery
- ✅ Cache responses appropriately
- ✅ Monitor performance metrics

**DON'T:**
- ❌ Couple servers tightly
- ❌ Create circular dependencies
- ❌ Ignore startup performance
- ❌ Skip load testing

---

## Troubleshooting Multi-Server Issues

### Server Won't Start

**Check dependencies:**
```bash
# Verify all servers can start independently
for server in database cache api; do
  echo "Testing $server..."
  # Start server manually
  # Check for errors
done
```

**Review startup order:**
```bash
# Check dependency graph
cat dependency-graph.md

# Start servers in correct order
./scripts/startup-mcp-servers.sh
```

### High Memory Usage

**Identify culprit:**
```bash
# Monitor per-server memory
ps aux | grep mcp | awk '{print $2, $4, $11}' | sort -k2 -nr | head -10
```

**Set limits:**
```json
{
  "mcpServers": {
    "memory-hungry-server": {
      "command": "node",
      "args": ["--max-old-space-size=512", "server.js"]
    }
  }
}
```

### Tool Name Collisions

**Detect collisions:**
```bash
# Run collision detection script
node scripts/check-tool-collisions.js
```

**Resolve:**
1. Rename tools in server implementation
2. Use tool filtering to exclude conflicts
3. Rename server instances for namespacing

### Slow Performance

**Profile server startup:**
```bash
# Measure individual server startup times
for server in server1 server2 server3; do
  start=$(date +%s%N)
  start_server $server
  end=$(date +%s%N)
  duration=$((($end - $start) / 1000000))
  echo "$server: ${duration}ms"
done
```

**Optimize:**
- Enable parallel initialization
- Implement lazy loading
- Use connection pooling
- Cache frequently-used data

### Connection Failures

**Test connectivity:**
```bash
# Test remote server
curl -I https://api.example.com/mcp/health

# Test stdio server
npx -y @package/mcp-server
```

**Check network:**
```bash
# Verify DNS resolution
nslookup api.example.com

# Check firewall rules
telnet api.example.com 443
```

---

## Related Resources

### In This Guide
- [MCP Setup Guide](../guides/mcp/mcp-setup-guide.md) - Centralized configuration
- [Security Best Practices](./security.md) - Securing multi-server setups
- [Performance Optimization](./performance.md) - Optimizing server performance

### Platform-Specific Guides
- [Claude Code Configuration](../04-platform-guides/claude-code/configuration.md)
- [Cursor Configuration](../04-platform-guides/cursor/configuration.md)
- [Gemini CLI Configuration](../04-platform-guides/gemini-cli/configuration.md)
- [Antigravity Configuration](../04-platform-guides/antigravity/configuration.md)

### External Resources
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/latest)
- [MCP Server Reference](https://github.com/modelcontextprotocol/servers)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

**Last Updated:** February 2026
**Category:** Advanced Topics
**Difficulty:** Advanced
**Estimated Reading Time:** 45 minutes
