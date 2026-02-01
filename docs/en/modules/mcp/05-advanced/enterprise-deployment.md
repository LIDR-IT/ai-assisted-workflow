# Enterprise Deployment Guide

## Overview

Deploying MCP (Model Context Protocol) servers in enterprise environments requires careful consideration of security, scalability, team collaboration, and operational excellence. This comprehensive guide provides enterprise-grade deployment patterns, security best practices, and centralized configuration management strategies for organizations deploying MCP at scale.

**Key Enterprise Concerns:**
- **Security**: Authentication, authorization, encryption, and audit logging
- **Scalability**: Horizontal scaling, load balancing, and resource optimization
- **Collaboration**: Team coordination, centralized configurations, and access control
- **Compliance**: Audit trails, data governance, and regulatory requirements
- **Operations**: Monitoring, high availability, disaster recovery, and CI/CD integration

---

## Enterprise Deployment Architectures

### Architecture 1: Centralized MCP Gateway

**Use Case:** Large organizations requiring centralized control, audit logging, and unified access management.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  AI Client 1    │────▶│                 │────▶│  MCP Server 1   │
│  (Claude Code)  │     │                 │     │  (GitHub)       │
└─────────────────┘     │                 │     └─────────────────┘
                        │  MCP Gateway    │
┌─────────────────┐     │  (Load Balancer │     ┌─────────────────┐
│  AI Client 2    │────▶│   + Proxy)      │────▶│  MCP Server 2   │
│  (Cursor)       │     │                 │     │  (Sentry)       │
└─────────────────┘     │  - Auth         │     └─────────────────┘
                        │  - Rate Limits  │
┌─────────────────┐     │  - Audit Logs   │     ┌─────────────────┐
│  AI Client 3    │────▶│  - Monitoring   │────▶│  MCP Server 3   │
│  (Gemini CLI)   │     │                 │     │  (Database)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Components:**

- **MCP Gateway**: Nginx/Envoy/Traefik proxy
- **Authentication**: OAuth 2.0, SAML, LDAP integration
- **Authorization**: Role-based access control (RBAC)
- **Audit Logging**: Centralized log aggregation (ELK, Splunk)
- **Monitoring**: Prometheus, Grafana, Datadog

**Benefits:**
- Single point of control for security policies
- Unified authentication and authorization
- Comprehensive audit trail
- Centralized rate limiting and throttling
- Easy to add security layers (WAF, DDoS protection)

**Implementation Example:**

```nginx
# nginx.conf for MCP Gateway
upstream mcp_github {
    server mcp-github-1:3000;
    server mcp-github-2:3000;
    server mcp-github-3:3000;
}

upstream mcp_sentry {
    server mcp-sentry-1:3000;
    server mcp-sentry-2:3000;
}

server {
    listen 443 ssl http2;
    server_name mcp-gateway.company.com;

    ssl_certificate /etc/ssl/certs/company.crt;
    ssl_certificate_key /etc/ssl/private/company.key;

    # Authentication via OAuth2 proxy
    auth_request /oauth2/auth;
    error_page 401 = /oauth2/sign_in;

    # Audit logging
    access_log /var/log/nginx/mcp-gateway.log main;

    # GitHub MCP Server
    location /mcp/github/ {
        proxy_pass http://mcp_github/;
        proxy_set_header X-User-ID $http_x_user_id;
        proxy_set_header X-Org-ID $http_x_org_id;

        # Rate limiting
        limit_req zone=mcp_zone burst=20;
    }

    # Sentry MCP Server
    location /mcp/sentry/ {
        proxy_pass http://mcp_sentry/;
        proxy_set_header X-User-ID $http_x_user_id;

        limit_req zone=mcp_zone burst=10;
    }

    # OAuth2 authentication endpoint
    location /oauth2/ {
        proxy_pass http://oauth2-proxy:4180;
    }
}
```

---

### Architecture 2: Distributed MCP Servers

**Use Case:** Teams requiring independent deployments with shared authentication.

```
┌─────────────────┐     ┌─────────────────┐
│  Team A         │────▶│  MCP Server 1   │
│  Clients        │     │  (Team A)       │
└─────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  Auth Service   │
         └─────────────▶│  (SSO/LDAP)     │
                        └─────────────────┘
         ┌──────────────────────▲
         │                       │
┌─────────────────┐     ┌─────────────────┐
│  Team B         │────▶│  MCP Server 2   │
│  Clients        │     │  (Team B)       │
└─────────────────┘     └─────────────────┘
```

**Benefits:**
- Team autonomy for server deployments
- Reduced single point of failure
- Easier to scale per-team workloads
- Shared authentication infrastructure

**Shared Authentication Service:**

```typescript
// Shared authentication middleware for MCP servers
import { OAuth2Client } from '@google-cloud/oauth2';

export async function authenticateRequest(req: Request): Promise<UserContext> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  // Verify token with SSO provider
  const payload = await verifyToken(token);

  return {
    userId: payload.sub,
    email: payload.email,
    orgId: payload.org_id,
    roles: payload.roles || [],
    scopes: payload.scopes || [],
  };
}

async function verifyToken(token: string): Promise<TokenPayload> {
  const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}
```

---

### Architecture 3: Multi-Tenant SaaS

**Use Case:** SaaS providers offering MCP as a service to multiple customers.

```
┌─────────────────┐     ┌─────────────────┐
│  Customer A     │────▶│  Tenant Router  │
│  Clients        │     │  (Domain-based) │
└─────────────────┘     └────────┬────────┘
                                 │
┌─────────────────┐              │      ┌─────────────────┐
│  Customer B     │──────────────┼─────▶│  MCP Server     │
│  Clients        │              │      │  (Multi-tenant) │
└─────────────────┘              │      └─────────────────┘
                                 │               │
┌─────────────────┐              │      ┌────────▼────────┐
│  Customer C     │──────────────┘      │  Data Isolation │
│  Clients        │                     │  (DB per tenant)│
└─────────────────┘                     └─────────────────┘
```

**Multi-Tenant Server Implementation:**

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

// Tenant-aware MCP server
class MultiTenantMCPServer {
  private servers: Map<string, Server> = new Map();

  async handleRequest(req: Request, tenantId: string) {
    // Get or create tenant-specific server instance
    let server = this.servers.get(tenantId);

    if (!server) {
      server = await this.createTenantServer(tenantId);
      this.servers.set(tenantId, server);
    }

    // Route request to tenant server
    return this.processRequest(server, req, tenantId);
  }

  private async createTenantServer(tenantId: string): Promise<Server> {
    const tenantConfig = await this.getTenantConfig(tenantId);

    const server = new Server({
      name: `mcp-server-${tenantId}`,
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
        resources: {},
      },
    });

    // Register tenant-specific tools
    await this.registerTenantTools(server, tenantConfig);

    return server;
  }

  private async getTenantConfig(tenantId: string): Promise<TenantConfig> {
    // Load tenant-specific configuration from database
    const config = await db.tenants.findUnique({
      where: { id: tenantId },
      include: { settings: true, permissions: true },
    });

    return config;
  }
}
```

---

## Security Best Practices

### Authentication Strategies

#### OAuth 2.0 with PKCE

**Industry standard for remote MCP servers:**

```typescript
// OAuth 2.0 server configuration
import express from 'express';
import { Issuer } from 'openid-client';

const app = express();

// OAuth configuration
const oidcIssuer = await Issuer.discover('https://accounts.google.com');
const client = new oidcIssuer.Client({
  client_id: process.env.OAUTH_CLIENT_ID,
  client_secret: process.env.OAUTH_CLIENT_SECRET,
  redirect_uris: ['https://mcp.company.com/callback'],
  response_types: ['code'],
  token_endpoint_auth_method: 'client_secret_post',
});

// Start OAuth flow with PKCE
app.get('/auth/login', (req, res) => {
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  // Store code verifier in session
  req.session.codeVerifier = codeVerifier;

  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: generators.state(),
  });

  res.redirect(authUrl);
});

// Handle OAuth callback
app.get('/callback', async (req, res) => {
  const params = client.callbackParams(req);
  const codeVerifier = req.session.codeVerifier;

  const tokenSet = await client.callback(
    'https://mcp.company.com/callback',
    params,
    { code_verifier: codeVerifier }
  );

  // Store tokens securely
  await storeUserTokens(tokenSet);

  res.redirect('/mcp/dashboard');
});
```

---

#### Service Account Authentication

**For system-to-system communication:**

```typescript
// Service account authentication
import { JWT } from 'google-auth-library';

const serviceAccount = {
  client_email: process.env.SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.SERVICE_ACCOUNT_KEY,
};

const client = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Authenticate MCP requests with service account
async function authenticateServiceAccount(req: Request): Promise<boolean> {
  const token = await client.getAccessToken();

  // Validate incoming request token matches
  const providedToken = req.headers.get('Authorization')?.split(' ')[1];

  return token === providedToken;
}
```

---

### Authorization and Access Control

#### Role-Based Access Control (RBAC)

```typescript
// RBAC implementation for MCP tools
enum Role {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

interface Permission {
  resource: string;
  actions: string[];
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    { resource: '*', actions: ['*'] },
  ],
  [Role.DEVELOPER]: [
    { resource: 'github', actions: ['read', 'write'] },
    { resource: 'sentry', actions: ['read'] },
    { resource: 'database', actions: ['read'] },
  ],
  [Role.VIEWER]: [
    { resource: 'github', actions: ['read'] },
    { resource: 'sentry', actions: ['read'] },
  ],
};

// Check if user can access tool
function canAccessTool(userRole: Role, toolName: string, action: string): boolean {
  const permissions = rolePermissions[userRole];

  return permissions.some(perm => {
    const resourceMatches = perm.resource === '*' || perm.resource === toolName;
    const actionMatches = perm.actions.includes('*') || perm.actions.includes(action);
    return resourceMatches && actionMatches;
  });
}

// Middleware to enforce permissions
server.setRequestHandler('tools/call', async (request, context) => {
  const { name, arguments: args } = request.params;
  const user = context.user;

  // Check permission
  if (!canAccessTool(user.role, name, 'execute')) {
    throw new Error(
      `Permission denied: User ${user.email} with role ${user.role} ` +
      `cannot execute tool ${name}`
    );
  }

  // Execute tool
  return await executeTool(name, args);
});
```

---

### Encryption

#### TLS/SSL Configuration

**Mandatory for production deployments:**

```bash
# Generate self-signed certificate (development only)
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout server.key \
  -out server.crt \
  -days 365 \
  -subj "/CN=mcp.company.com"

# Production: Use Let's Encrypt
certbot certonly --standalone \
  -d mcp.company.com \
  --email admin@company.com \
  --agree-tos
```

**Node.js HTTPS server:**

```typescript
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// Load SSL certificates
const options = {
  key: fs.readFileSync('/etc/ssl/private/server.key'),
  cert: fs.readFileSync('/etc/ssl/certs/server.crt'),
};

// Create HTTPS server
const server = https.createServer(options, app);

server.listen(443, () => {
  console.log('MCP Server running on https://mcp.company.com:443');
});
```

---

#### Data Encryption at Rest

```typescript
// Encrypt sensitive data before storing
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(data: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

function decrypt(encrypted: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionKey,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Store encrypted tokens
async function storeUserToken(userId: string, token: string) {
  const { encrypted, iv, authTag } = encrypt(token);

  await db.tokens.create({
    data: {
      userId,
      encryptedToken: encrypted,
      iv,
      authTag,
    },
  });
}
```

---

### Audit Logging and Monitoring

#### Comprehensive Audit Logging

```typescript
// Structured audit logging
import winston from 'winston';

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'audit.log' }),
    new winston.transports.Console(),
  ],
});

// Log all MCP tool invocations
server.setRequestHandler('tools/call', async (request, context) => {
  const { name, arguments: args } = request.params;
  const user = context.user;

  // Log invocation
  auditLogger.info('Tool invocation', {
    eventType: 'tool.call',
    timestamp: new Date().toISOString(),
    userId: user.id,
    userEmail: user.email,
    orgId: user.orgId,
    toolName: name,
    arguments: JSON.stringify(args),
    ipAddress: context.req.ip,
    userAgent: context.req.headers['user-agent'],
  });

  try {
    const result = await executeTool(name, args);

    // Log success
    auditLogger.info('Tool execution completed', {
      eventType: 'tool.success',
      userId: user.id,
      toolName: name,
      duration: Date.now() - startTime,
    });

    return result;
  } catch (error) {
    // Log failure
    auditLogger.error('Tool execution failed', {
      eventType: 'tool.error',
      userId: user.id,
      toolName: name,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  }
});
```

---

#### Monitoring and Observability

```typescript
// Prometheus metrics for MCP servers
import { register, Counter, Histogram } from 'prom-client';

// Define metrics
const requestCounter = new Counter({
  name: 'mcp_requests_total',
  help: 'Total number of MCP requests',
  labelNames: ['tool', 'status'],
});

const requestDuration = new Histogram({
  name: 'mcp_request_duration_seconds',
  help: 'Duration of MCP requests in seconds',
  labelNames: ['tool'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Instrument request handler
server.setRequestHandler('tools/call', async (request) => {
  const { name } = request.params;
  const startTime = Date.now();

  try {
    const result = await executeTool(name, request.params.arguments);

    // Record success metrics
    requestCounter.inc({ tool: name, status: 'success' });
    requestDuration.observe({ tool: name }, (Date.now() - startTime) / 1000);

    return result;
  } catch (error) {
    // Record error metrics
    requestCounter.inc({ tool: name, status: 'error' });
    throw error;
  }
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

---

## Centralized Configuration Management

### Team Collaboration Pattern

**Single source of truth for all MCP configurations:**

```
project-root/
├── .agents/
│   └── mcp/
│       ├── mcp-servers.json         # ← Source of truth
│       └── sync-mcp.sh              # ← Generation script
├── .cursor/
│   └── mcp.json                     # ← Generated (Cursor)
├── .claude/
│   └── mcp.json                     # ← Generated (Claude Code)
├── .gemini/
│   └── settings.json                # ← Generated (Gemini CLI)
└── .agent/
    └── README.md                    # ← Antigravity global only
```

**Source configuration (`.agents/mcp/mcp-servers.json`):**

```json
{
  "version": "1.0",
  "description": "Enterprise MCP servers configuration",
  "servers": {
    "github": {
      "type": "http",
      "url": "https://mcp.github.company.com/mcp",
      "platforms": ["cursor", "claude", "gemini"],
      "description": "GitHub integration for code and PR management",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.company.com/mcp",
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Error monitoring and performance tracking"
    },
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@company/mcp-database-server"],
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Read-only database query access",
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "DB_POOL_SIZE": "${DB_POOL_SIZE:-10}"
      }
    }
  }
}
```

---

### Configuration Synchronization Script

**Automate platform-specific config generation:**

```bash
#!/bin/bash
# .agents/mcp/sync-mcp.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MCP_CONFIG="$SCRIPT_DIR/mcp-servers.json"

echo "🔄 Synchronizing MCP configurations..."

# Validate jq is installed
if ! command -v jq &> /dev/null; then
  echo "❌ jq is required. Install: brew install jq"
  exit 1
fi

# Generate platform-specific config
generate_platform_config() {
  local platform=$1
  local output_file=$2

  echo "  📝 Generating $output_file..."
  mkdir -p "$(dirname "$output_file")"

  jq --arg platform "$platform" '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index($platform)) |
        {
          key: .key,
          value: (.value | del(.platforms, .description))
        }
      ) |
      from_entries
    )
  }' "$MCP_CONFIG" > "$output_file"
}

# Generate configs for each platform
generate_platform_config "cursor" "$PROJECT_ROOT/.cursor/mcp.json"
generate_platform_config "claude" "$PROJECT_ROOT/.claude/mcp.json"
generate_platform_config "gemini" "$PROJECT_ROOT/.gemini/settings.json"

echo "✅ Synchronization complete"
echo ""
echo "Generated configs:"
echo "  - .cursor/mcp.json (Cursor)"
echo "  - .claude/mcp.json (Claude Code)"
echo "  - .gemini/settings.json (Gemini CLI)"
echo ""
echo "⚠️  Remember to set environment variables:"
echo "  export GITHUB_TOKEN=\"your-token\""
echo "  export DATABASE_URL=\"your-db-url\""
```

---

### Environment-Specific Configurations

**Development vs. Staging vs. Production:**

```bash
# Development environment (.env.development)
GITHUB_TOKEN=ghp_dev_token
DATABASE_URL=postgresql://localhost:5432/dev_db
API_BASE_URL=http://localhost:3000
LOG_LEVEL=debug

# Staging environment (.env.staging)
GITHUB_TOKEN=ghp_staging_token
DATABASE_URL=postgresql://staging-db.internal:5432/staging_db
API_BASE_URL=https://api-staging.company.com
LOG_LEVEL=info

# Production environment (exported in deployment)
export GITHUB_TOKEN=ghp_prod_token
export DATABASE_URL=postgresql://prod-db.internal:5432/prod_db
export API_BASE_URL=https://api.company.com
export LOG_LEVEL=warn
```

**Load environment-specific config:**

```typescript
// Load config based on NODE_ENV
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

// Validate required environment variables
const requiredVars = ['GITHUB_TOKEN', 'DATABASE_URL', 'API_BASE_URL'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(
      `Missing required environment variable: ${varName}\n` +
      `Set it in .env.${env} or export it directly.`
    );
  }
}
```

---

## High Availability and Disaster Recovery

### Load Balancing

**Horizontal scaling with multiple MCP server instances:**

```yaml
# docker-compose.yml for load-balanced MCP servers
version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - mcp-server-1
      - mcp-server-2
      - mcp-server-3

  mcp-server-1:
    image: company/mcp-server:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G

  mcp-server-2:
    image: company/mcp-server:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G

  mcp-server-3:
    image: company/mcp-server:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

---

### Health Checks

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  // Check database connectivity
  db.raw('SELECT 1')
    .then(() => {
      health.checks.database = 'healthy';
    })
    .catch(() => {
      health.checks.database = 'unhealthy';
      health.status = 'degraded';
    });

  // Check Redis connectivity
  redis.ping()
    .then(() => {
      health.checks.redis = 'healthy';
    })
    .catch(() => {
      health.checks.redis = 'unhealthy';
      health.status = 'degraded';
    });

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

### Disaster Recovery

**Backup and restore procedures:**

```bash
#!/bin/bash
# backup-mcp-data.sh

BACKUP_DIR="/backups/mcp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Starting MCP data backup..."

# Backup database
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_$TIMESTAMP.sql"
echo "✅ Database backed up"

# Backup configuration
tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" \
  .agents/mcp/ \
  .cursor/ \
  .claude/ \
  .gemini/
echo "✅ Configuration backed up"

# Upload to S3
aws s3 cp "$BACKUP_DIR/" "s3://company-backups/mcp/$TIMESTAMP/" --recursive
echo "✅ Uploaded to S3"

# Retain last 30 days of backups
find "$BACKUP_DIR" -type f -mtime +30 -delete
echo "✅ Cleaned old backups"

echo "🎉 Backup complete: $TIMESTAMP"
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/mcp-deploy.yml
name: Deploy MCP Servers

on:
  push:
    branches:
      - main
    paths:
      - '.agents/mcp/**'
      - 'src/mcp-servers/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Validate MCP config
        run: |
          jq empty .agents/mcp/mcp-servers.json
          echo "✅ MCP config is valid JSON"

      - name: Check for secrets
        run: |
          if grep -r "ghp_" .agents/mcp/; then
            echo "❌ Found hardcoded secrets"
            exit 1
          fi
          echo "✅ No hardcoded secrets found"

  sync:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Sync MCP configurations
        run: |
          chmod +x .agents/mcp/sync-mcp.sh
          ./.agents/mcp/sync-mcp.sh

      - name: Commit generated configs
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore: sync MCP configurations"
          file_pattern: ".cursor/* .claude/* .gemini/*"

  deploy:
    needs: sync
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          docker build -t mcp-server:${{ github.sha }} .

      - name: Push to registry
        run: |
          docker push company/mcp-server:${{ github.sha }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/mcp-server \
            mcp-server=company/mcp-server:${{ github.sha }}
          kubectl rollout status deployment/mcp-server
```

---

## Scalability Considerations

### Stateless Server Design

**Enable horizontal scaling:**

```typescript
// Stateless MCP server (session stored in Redis)
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Store session data in Redis (not in-memory)
async function getSession(sessionId: string): Promise<Session> {
  const data = await redis.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

async function setSession(sessionId: string, session: Session): Promise<void> {
  await redis.setex(
    `session:${sessionId}`,
    3600, // 1 hour TTL
    JSON.stringify(session)
  );
}

// Use sessions in stateless way
server.setRequestHandler('tools/call', async (request, context) => {
  const sessionId = context.req.headers['x-session-id'];
  const session = await getSession(sessionId);

  if (!session) {
    throw new Error('Invalid or expired session');
  }

  // Execute tool with session context
  return await executeTool(request.params.name, request.params.arguments, session);
});
```

---

### Caching Strategies

```typescript
// Cache expensive operations
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

async function fetchGitHubData(repo: string): Promise<any> {
  const cacheKey = `github:${repo}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const data = await githubClient.fetchRepo(repo);

  // Store in cache
  cache.set(cacheKey, data);

  return data;
}
```

---

## Compliance and Governance

### Data Retention Policies

```typescript
// Automatic data cleanup based on retention policy
import cron from 'node-cron';

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running data retention cleanup...');

  // Delete audit logs older than 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  await db.auditLogs.deleteMany({
    where: {
      timestamp: {
        lt: ninetyDaysAgo,
      },
    },
  });

  // Delete inactive sessions older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await redis.keys('session:*').then(async (keys) => {
    for (const key of keys) {
      const session = await redis.get(key);
      const sessionData = JSON.parse(session);

      if (new Date(sessionData.lastActivity) < thirtyDaysAgo) {
        await redis.del(key);
      }
    }
  });

  console.log('Data retention cleanup complete');
});
```

---

### GDPR Compliance

```typescript
// User data export (GDPR Right to Access)
async function exportUserData(userId: string): Promise<UserDataExport> {
  const user = await db.users.findUnique({ where: { id: userId } });
  const auditLogs = await db.auditLogs.findMany({ where: { userId } });
  const sessions = await db.sessions.findMany({ where: { userId } });

  return {
    personalData: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    activityLogs: auditLogs.map(log => ({
      timestamp: log.timestamp,
      action: log.action,
      resource: log.resource,
    })),
    sessions: sessions.map(s => ({
      id: s.id,
      createdAt: s.createdAt,
      lastActivity: s.lastActivity,
    })),
  };
}

// User data deletion (GDPR Right to Erasure)
async function deleteUserData(userId: string): Promise<void> {
  // Anonymize audit logs (cannot delete for compliance)
  await db.auditLogs.updateMany({
    where: { userId },
    data: {
      userId: 'DELETED_USER',
      userEmail: 'deleted@example.com',
    },
  });

  // Delete sessions
  await db.sessions.deleteMany({ where: { userId } });

  // Delete user account
  await db.users.delete({ where: { id: userId } });

  // Log deletion for compliance
  auditLogger.info('User data deleted', {
    eventType: 'user.deleted',
    userId,
    timestamp: new Date().toISOString(),
  });
}
```

---

## Corporate Proxy and Firewall Configurations

### Proxy Configuration

**For environments behind corporate proxies:**

```bash
# Set proxy environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.company.com

# For npm packages
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# For Docker
# /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://proxy.company.com:8080"
Environment="HTTPS_PROXY=http://proxy.company.com:8080"
Environment="NO_PROXY=localhost,127.0.0.1"
```

**Configure MCP server to use proxy:**

```typescript
// Use proxy for external API calls
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

// Use agent in fetch calls
async function fetchWithProxy(url: string): Promise<Response> {
  return fetch(url, { agent });
}
```

---

### Firewall Whitelist

**Required outbound connections:**

```
# MCP Server Dependencies
- registry.npmjs.org:443           (npm packages)
- github.com:443                   (GitHub API)
- api.github.com:443               (GitHub API)
- sentry.io:443                    (Error tracking)

# Authentication Services
- accounts.google.com:443          (Google OAuth)
- login.microsoftonline.com:443    (Microsoft OAuth)
- auth0.com:443                    (Auth0)

# Monitoring and Logging
- logs.company.com:443             (Centralized logging)
- metrics.company.com:443          (Prometheus/Grafana)
```

---

## Related Documentation

**In This Repository:**
- [OAuth Authentication Guide](../02-using-mcp/authentication/oauth-guide.md)
- [Environment Variables](../02-using-mcp/environment-variables.md)
- [Scoped Configuration](../02-using-mcp/scoped-configuration.md)
- [Best Practices](../03-creating-servers/best-practices.md)
- [Testing Guide](../03-creating-servers/testing.md)

**External Resources:**
- [MCP Specification](https://modelcontextprotocol.io/specification)
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
- [OWASP Security Guidelines](https://owasp.org/)
- [GDPR Compliance](https://gdpr.eu/)

---

**Last Updated:** February 2026
**Category:** Enterprise MCP Deployment
**Audience:** DevOps Engineers, Security Teams, Enterprise Architects
**Estimated Reading Time:** 45 minutes
