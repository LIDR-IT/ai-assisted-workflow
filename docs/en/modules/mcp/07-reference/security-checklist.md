# MCP Security Checklist

Comprehensive security checklists for developing, deploying, and maintaining secure MCP servers.

---

## Table of Contents

1. [Development Security Checklist](#development-security-checklist)
2. [Deployment Security Checklist](#deployment-security-checklist)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Protection & Encryption](#data-protection--encryption)
5. [Secret Management](#secret-management)
6. [Input Validation & Sanitization](#input-validation--sanitization)
7. [Rate Limiting & DoS Protection](#rate-limiting--dos-protection)
8. [Audit Logging](#audit-logging)
9. [Compliance Considerations](#compliance-considerations)
10. [Security Testing Procedures](#security-testing-procedures)

---

## Development Security Checklist

Use this checklist when developing MCP servers to ensure security is built-in from the start.

### Code Security

- [ ] **Input Validation**
  - All user inputs validated with JSON Schema
  - Type checking enforced for all parameters
  - String lengths limited to prevent memory exhaustion
  - Arrays/objects have maximum size limits

- [ ] **Output Sanitization**
  - HTML/XML content properly escaped
  - File paths validated against path traversal
  - URLs validated against open redirect vulnerabilities
  - No sensitive data in error messages

- [ ] **Error Handling**
  - Errors caught and handled gracefully
  - Stack traces not exposed to clients
  - Error messages are actionable but not revealing
  - Failed operations logged for security monitoring

- [ ] **Dependencies**
  - All dependencies from trusted sources only
  - Regular dependency audits with `npm audit` or `pip audit`
  - No known vulnerabilities in dependency tree
  - Dependency versions pinned (not using `^` or `~`)

**Example: Secure Input Validation**

```typescript
import { z } from 'zod';

// ✅ Good: Comprehensive validation
const CreateIssueSchema = z.object({
  repository: z.string()
    .regex(/^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/)
    .max(100)
    .describe('Repository in format owner/repo'),
  title: z.string()
    .min(1)
    .max(500)
    .describe('Issue title'),
  body: z.string()
    .max(65536)
    .optional()
    .describe('Issue description'),
  labels: z.array(z.string().max(50))
    .max(20)
    .optional(),
});

// ❌ Bad: No validation
const input = request.params.arguments; // Unsafe!
```

### API Security

- [ ] **Authentication**
  - OAuth 2.0 with PKCE implemented correctly
  - Access tokens have short expiration (≤1 hour)
  - Refresh tokens have reasonable expiration (≤30 days)
  - Token validation on every request

- [ ] **Authorization**
  - Principle of least privilege applied
  - Scope-based access control implemented
  - User permissions verified before operations
  - Role-based access control (RBAC) for enterprise

- [ ] **Transport Security**
  - HTTPS/TLS 1.3 for all HTTP transports
  - Certificate validation enabled
  - No mixed content (HTTP/HTTPS)
  - Proper CORS configuration for remote servers

- [ ] **API Keys**
  - API keys stored in environment variables
  - Keys rotated regularly (quarterly minimum)
  - Separate keys per environment (dev/staging/prod)
  - Keys have appropriate scopes/permissions

**Example: Secure Token Validation**

```typescript
// ✅ Good: Comprehensive token validation
async function validateAccessToken(token: string): Promise<boolean> {
  try {
    // Verify token signature
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: OAUTH_ISSUER,
      audience: CLIENT_ID
    });

    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return false;
    }

    // Check scopes
    const requiredScopes = ['repo:read'];
    const tokenScopes = decoded.scope?.split(' ') || [];
    if (!requiredScopes.every(s => tokenScopes.includes(s))) {
      return false;
    }

    return true;
  } catch (error) {
    logger.warn('Token validation failed', { error: error.message });
    return false;
  }
}

// ❌ Bad: No validation
const token = request.headers.authorization;
// Using token without verification!
```

### Resource Access Control

- [ ] **File System**
  - Whitelist allowed directories
  - Path traversal prevented (`.` and `..` blocked)
  - Symlink following disabled or restricted
  - File size limits enforced

- [ ] **Database**
  - Parameterized queries only (no string concatenation)
  - Connection pooling with limits
  - Read-only access where possible
  - Query timeouts configured

- [ ] **Network**
  - Egress filtering to allowed domains only
  - Internal network access blocked
  - DNS rebinding attacks prevented
  - SSRF vulnerabilities mitigated

- [ ] **Command Execution**
  - Shell commands avoided entirely if possible
  - If necessary, use allowlist of commands
  - Arguments escaped properly
  - Execution timeouts enforced

**Example: Secure File Access**

```typescript
import path from 'path';

const ALLOWED_DIRECTORIES = [
  '/app/data',
  '/app/public'
];

// ✅ Good: Secure file access
function secureReadFile(filePath: string): Promise<string> {
  // Resolve to absolute path
  const absolutePath = path.resolve(filePath);

  // Check against allowed directories
  const isAllowed = ALLOWED_DIRECTORIES.some(dir =>
    absolutePath.startsWith(path.resolve(dir))
  );

  if (!isAllowed) {
    throw new Error('Access denied: File outside allowed directories');
  }

  // Check for path traversal
  if (absolutePath.includes('..') || absolutePath.includes('./')) {
    throw new Error('Access denied: Invalid path');
  }

  // Verify file exists and is readable
  if (!fs.existsSync(absolutePath)) {
    throw new Error('File not found');
  }

  return fs.promises.readFile(absolutePath, 'utf-8');
}

// ❌ Bad: Direct file access
function unsafeReadFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8'); // Vulnerable!
}
```

### Secure Coding Practices

- [ ] **No Hardcoded Secrets**
  - API keys in environment variables
  - Passwords never in source code
  - Tokens loaded from secure storage
  - Private keys in secure key management

- [ ] **Cryptography**
  - Use standard libraries (crypto, Web Crypto API)
  - No custom encryption algorithms
  - Strong algorithms (AES-256, RSA-2048+, SHA-256+)
  - Secure random number generation

- [ ] **Session Management**
  - Session tokens cryptographically random
  - Sessions expire after timeout
  - Logout invalidates sessions
  - Concurrent session limits

- [ ] **Third-Party Code**
  - Only official MCP SDK packages
  - Verify publisher authenticity
  - Review source code when possible
  - Monitor for security advisories

---

## Deployment Security Checklist

Use this checklist when deploying MCP servers to production environments.

### Infrastructure Security

- [ ] **Network Security**
  - Firewall rules configured (allow only necessary ports)
  - DDoS protection enabled
  - Private subnets for backend services
  - VPC peering configured securely

- [ ] **Container Security** (if using Docker/containers)
  - Base images from trusted sources only
  - Images scanned for vulnerabilities
  - Non-root user in containers
  - Read-only file systems where possible
  - Resource limits (CPU, memory) configured

- [ ] **Server Hardening**
  - Unnecessary services disabled
  - Security patches applied regularly
  - SSH key-based authentication only
  - Sudo access restricted

**Example: Secure Dockerfile**

```dockerfile
# ✅ Good: Secure container configuration
FROM node:20-alpine AS base

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install dependencies as root
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Run with limited permissions
CMD ["node", "--max-old-space-size=512", "dist/index.js"]
```

### Environment Configuration

- [ ] **Environment Variables**
  - Production secrets in secure vault (AWS Secrets Manager, etc.)
  - Environment-specific configurations
  - No `.env` files in production
  - Secrets rotation process documented

- [ ] **Logging**
  - Sensitive data not logged (tokens, passwords, PII)
  - Logs sent to centralized logging system
  - Log retention policy enforced
  - Logs encrypted at rest and in transit

- [ ] **Monitoring**
  - Health checks configured
  - Resource usage monitored (CPU, memory, disk)
  - Error rates tracked
  - Security alerts configured

- [ ] **Backup & Recovery**
  - Regular backups scheduled
  - Backups encrypted
  - Recovery process tested
  - Backup retention policy enforced

**Example: Secure Logging Configuration**

```typescript
import winston from 'winston';

// ✅ Good: Secure logging with redaction
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    // Redact sensitive fields
    winston.format((info) => {
      const redactFields = ['password', 'token', 'apiKey', 'secret', 'authorization'];
      redactFields.forEach(field => {
        if (info[field]) {
          info[field] = '[REDACTED]';
        }
      });
      return info;
    })()
  ),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'combined.log',
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

// ❌ Bad: Logging sensitive data
logger.info('User authenticated', {
  token: userToken, // Sensitive!
  password: userPassword // Never log passwords!
});
```

### Access Control

- [ ] **Identity & Access Management**
  - Principle of least privilege enforced
  - Service accounts used (not personal accounts)
  - MFA enabled for privileged accounts
  - Access reviews conducted quarterly

- [ ] **Network Access**
  - Bastion hosts for SSH access
  - VPN required for internal services
  - IP whitelisting for administrative access
  - Zero-trust network architecture

- [ ] **API Gateway** (if applicable)
  - Request authentication required
  - Rate limiting per client
  - Request size limits enforced
  - API versioning implemented

### Deployment Process

- [ ] **CI/CD Security**
  - Security scans in pipeline
  - Dependency vulnerability checks
  - Code signing implemented
  - Deployment approvals required

- [ ] **Rollback Plan**
  - Rollback procedure documented
  - Previous versions retained
  - Rollback tested regularly
  - Monitoring during rollout

- [ ] **Change Management**
  - Changes reviewed and approved
  - Deployment windows defined
  - Communication plan for incidents
  - Post-deployment verification

---

## Authentication & Authorization

### OAuth 2.0 Implementation

- [ ] **Authorization Code Flow**
  - PKCE (Proof Key for Code Exchange) implemented
  - State parameter for CSRF protection
  - Redirect URI validation
  - Authorization code single-use only

- [ ] **Token Management**
  - Access tokens: short-lived (≤1 hour)
  - Refresh tokens: long-lived but revocable
  - Token rotation on refresh
  - Token revocation endpoint implemented

- [ ] **Scope Management**
  - Minimum necessary scopes requested
  - Scope validation on every request
  - Scope inheritance prevented
  - Scope documentation maintained

**Example: Secure OAuth Implementation**

```typescript
import crypto from 'crypto';
import { URLSearchParams } from 'url';

// ✅ Good: OAuth with PKCE
class OAuthClient {
  private codeVerifier: string;
  private codeChallenge: string;
  private state: string;

  generateAuthorizationUrl(): string {
    // Generate PKCE verifier
    this.codeVerifier = crypto.randomBytes(32).toString('base64url');

    // Generate PKCE challenge
    this.codeChallenge = crypto
      .createHash('sha256')
      .update(this.codeVerifier)
      .digest('base64url');

    // Generate state for CSRF protection
    this.state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'repo user:email',
      state: this.state,
      code_challenge: this.codeChallenge,
      code_challenge_method: 'S256'
    });

    return `${AUTHORIZATION_ENDPOINT}?${params}`;
  }

  async exchangeCodeForToken(code: string, receivedState: string): Promise<TokenResponse> {
    // Validate state to prevent CSRF
    if (receivedState !== this.state) {
      throw new Error('State mismatch - possible CSRF attack');
    }

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code_verifier: this.codeVerifier // PKCE verification
      })
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return response.json();
  }
}
```

### API Key Authentication

- [ ] **Key Generation**
  - Cryptographically random generation
  - Sufficient entropy (≥128 bits)
  - Unique per client
  - Prefix for identification (e.g., `sk_live_`)

- [ ] **Key Storage**
  - Keys hashed before storage (bcrypt, Argon2)
  - Salt used for each hash
  - Plain-text keys never stored
  - Secure key retrieval process

- [ ] **Key Rotation**
  - Rotation policy defined (e.g., quarterly)
  - Multiple keys per client supported
  - Grace period during rotation
  - Rotation notifications sent

**Example: Secure API Key Validation**

```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ✅ Good: Secure API key handling
class APIKeyManager {
  async generateKey(): Promise<{ key: string; hash: string }> {
    // Generate cryptographically random key
    const key = crypto.randomBytes(32).toString('base64url');
    const prefixedKey = `sk_live_${key}`;

    // Hash before storage
    const hash = await bcrypt.hash(prefixedKey, 12);

    return { key: prefixedKey, hash };
  }

  async validateKey(providedKey: string, storedHash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(providedKey, storedHash);
    } catch (error) {
      logger.error('Key validation error', { error });
      return false;
    }
  }

  async revokeKey(keyId: string): Promise<void> {
    await database.apiKeys.update({
      where: { id: keyId },
      data: {
        revokedAt: new Date(),
        status: 'revoked'
      }
    });

    logger.info('API key revoked', { keyId });
  }
}

// ❌ Bad: Plain-text key storage
async function unsafeStoreKey(key: string) {
  await database.insert({ api_key: key }); // Never store plain-text!
}
```

### Role-Based Access Control (RBAC)

- [ ] **Role Definition**
  - Roles clearly defined and documented
  - Principle of least privilege applied
  - Role hierarchy implemented if needed
  - Role assignments auditable

- [ ] **Permission Checks**
  - Permissions verified on every request
  - Permission checks centralized
  - Default deny policy
  - Permission caching with short TTL

**Example: RBAC Implementation**

```typescript
// ✅ Good: RBAC with permission checks
enum Role {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

const PERMISSIONS = {
  [Role.ADMIN]: ['*'],
  [Role.DEVELOPER]: [
    'repo:read',
    'repo:write',
    'issue:read',
    'issue:write',
    'pr:read',
    'pr:write'
  ],
  [Role.VIEWER]: [
    'repo:read',
    'issue:read',
    'pr:read'
  ]
};

class AuthorizationService {
  hasPermission(userRole: Role, requiredPermission: string): boolean {
    const userPermissions = PERMISSIONS[userRole] || [];

    // Check for wildcard permission
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check for exact match
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check for wildcard match (e.g., 'repo:*' matches 'repo:read')
    return userPermissions.some(permission => {
      if (permission.endsWith(':*')) {
        const prefix = permission.slice(0, -1);
        return requiredPermission.startsWith(prefix);
      }
      return false;
    });
  }

  requirePermission(userRole: Role, permission: string): void {
    if (!this.hasPermission(userRole, permission)) {
      throw new Error(`Insufficient permissions: ${permission} required`);
    }
  }
}
```

---

## Data Protection & Encryption

### Data at Rest

- [ ] **Database Encryption**
  - Encryption enabled for all databases
  - Encryption keys rotated regularly
  - Key management service used (AWS KMS, etc.)
  - Transparent data encryption (TDE) where available

- [ ] **File Storage**
  - Files encrypted before storage
  - Separate encryption keys per tenant
  - Encryption metadata stored separately
  - Secure key derivation (PBKDF2, Argon2)

- [ ] **Backup Encryption**
  - All backups encrypted
  - Backup encryption keys separate from production
  - Backup restoration tested regularly
  - Encrypted backups verified

**Example: File Encryption**

```typescript
import crypto from 'crypto';

// ✅ Good: Secure file encryption
class FileEncryption {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32; // 256 bits

  async encryptFile(data: Buffer, key: Buffer): Promise<EncryptedFile> {
    // Generate random IV
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    // Encrypt data
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);

    // Get auth tag for integrity
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv,
      authTag,
      algorithm: this.algorithm
    };
  }

  async decryptFile(
    encrypted: Buffer,
    key: Buffer,
    iv: Buffer,
    authTag: Buffer
  ): Promise<Buffer> {
    // Create decipher
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt data
    try {
      return Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);
    } catch (error) {
      throw new Error('Decryption failed - data may be tampered');
    }
  }
}
```

### Data in Transit

- [ ] **TLS Configuration**
  - TLS 1.3 required (1.2 minimum)
  - Strong cipher suites only
  - Perfect forward secrecy (PFS) enabled
  - Certificate validation enforced

- [ ] **Certificate Management**
  - Valid certificates from trusted CA
  - Certificate expiration monitoring
  - Automated renewal process
  - Certificate pinning considered

- [ ] **API Security**
  - HTTPS enforced (HSTS headers)
  - HTTP redirected to HTTPS
  - Secure WebSocket (WSS) for WS connections
  - No sensitive data in URL parameters

**Example: Secure TLS Configuration**

```typescript
import https from 'https';
import fs from 'fs';

// ✅ Good: Secure TLS configuration
const tlsOptions = {
  key: fs.readFileSync('/path/to/private-key.pem'),
  cert: fs.readFileSync('/path/to/certificate.pem'),
  ca: fs.readFileSync('/path/to/ca-bundle.pem'),

  // TLS 1.3 preferred, 1.2 minimum
  minVersion: 'TLSv1.2' as const,
  maxVersion: 'TLSv1.3' as const,

  // Strong cipher suites only
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_AES_128_GCM_SHA256',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256'
  ].join(':'),

  // Enable perfect forward secrecy
  honorCipherOrder: true,

  // Require client certificate for mutual TLS
  requestCert: true,
  rejectUnauthorized: true
};

const server = https.createServer(tlsOptions, app);
```

### Sensitive Data Handling

- [ ] **PII (Personally Identifiable Information)**
  - PII identified and classified
  - PII minimization principle applied
  - PII access logged
  - PII deletion process implemented

- [ ] **Data Masking**
  - Sensitive fields masked in logs
  - Partial masking in UI (e.g., `****1234`)
  - Full masking for non-privileged users
  - Masking rules documented

- [ ] **Data Retention**
  - Retention policy defined
  - Automatic deletion after retention period
  - Legal hold capability implemented
  - Deletion verification process

**Example: Data Masking**

```typescript
// ✅ Good: Sensitive data masking
class DataMasker {
  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (user.length <= 2) {
      return `**@${domain}`;
    }
    return `${user.slice(0, 2)}***@${domain}`;
  }

  maskCreditCard(card: string): string {
    const cleaned = card.replace(/\s/g, '');
    if (cleaned.length < 4) {
      return '****';
    }
    return `****-****-****-${cleaned.slice(-4)}`;
  }

  maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) {
      return '***-***-****';
    }
    return `***-***-${cleaned.slice(-4)}`;
  }

  maskApiKey(key: string): string {
    if (key.length < 8) {
      return '***';
    }
    return `${key.slice(0, 7)}...${key.slice(-4)}`;
  }
}

// Usage in logging
logger.info('User operation', {
  email: masker.maskEmail(user.email),
  phone: masker.maskPhone(user.phone),
  // Never log full values
});
```

---

## Secret Management

### Development Environment

- [ ] **Environment Variables**
  - Secrets in `.env` files (not committed)
  - `.env.example` template provided
  - Environment-specific configurations
  - Documentation for required variables

- [ ] **Local Development**
  - Development secrets separate from production
  - Minimal permissions for dev secrets
  - Secret rotation tested locally
  - Dev secrets documented

**Example: Environment Configuration**

```bash
# ✅ Good: .env.example template
# Copy to .env and fill in values
# NEVER commit .env to version control

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# API Keys
CONTEXT7_API_KEY=your_api_key
SENTRY_DSN=your_sentry_dsn

# Encryption
ENCRYPTION_KEY=generate_with_openssl_rand_-base64_32
```

```typescript
// ✅ Good: Environment validation
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(20),
  GITHUB_CLIENT_SECRET: z.string().min(40),
  CONTEXT7_API_KEY: z.string().startsWith('sk_'),
  ENCRYPTION_KEY: z.string().length(44), // base64 encoded 32 bytes
});

// Validate on startup
const env = envSchema.parse(process.env);
```

### Production Environment

- [ ] **Secret Management Service**
  - AWS Secrets Manager, Azure Key Vault, or similar
  - Secrets never in environment variables
  - Automatic rotation enabled
  - Access logging enabled

- [ ] **Secret Rotation**
  - Rotation schedule defined
  - Zero-downtime rotation process
  - Old secrets grace period
  - Rotation failures handled

- [ ] **Secret Access**
  - IAM roles for secret access
  - Principle of least privilege
  - Secret access audited
  - Emergency access process

**Example: AWS Secrets Manager Integration**

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// ✅ Good: Secrets from AWS Secrets Manager
class SecretManager {
  private client = new SecretsManagerClient({ region: 'us-east-1' });
  private cache = new Map<string, { value: string; expiresAt: number }>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  async getSecret(secretName: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(secretName);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;
    }

    try {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await this.client.send(command);

      if (!response.SecretString) {
        throw new Error('Secret not found');
      }

      // Cache with TTL
      this.cache.set(secretName, {
        value: response.SecretString,
        expiresAt: Date.now() + this.cacheTTL
      });

      return response.SecretString;
    } catch (error) {
      logger.error('Failed to retrieve secret', { secretName, error });
      throw new Error('Secret retrieval failed');
    }
  }

  async rotateSecret(secretName: string, newValue: string): Promise<void> {
    // Invalidate cache
    this.cache.delete(secretName);

    // Update in Secrets Manager
    await this.client.send(new UpdateSecretCommand({
      SecretId: secretName,
      SecretString: newValue
    }));

    logger.info('Secret rotated', { secretName });
  }
}
```

### Secret Handling Best Practices

- [ ] **Never Log Secrets**
  - Automatic redaction in logging
  - Secret detection in logs
  - Log scrubbing for leaked secrets
  - Alert on potential secret exposure

- [ ] **Secret Transmission**
  - Never in URL parameters
  - Never in email or chat
  - Encrypted in transit
  - Temporary exposure only (e.g., setup UI)

- [ ] **Secret Storage**
  - Never in source code
  - Never in version control
  - Never in client-side code
  - Never in error messages

---

## Input Validation & Sanitization

### Schema Validation

- [ ] **JSON Schema**
  - All inputs validated with JSON Schema
  - Type validation enforced
  - Required fields specified
  - Optional fields clearly marked

- [ ] **Type Safety**
  - TypeScript/Zod for compile-time checking
  - Runtime validation at boundaries
  - No `any` types in production code
  - Type guards for external data

**Example: Comprehensive Input Validation**

```typescript
import { z } from 'zod';

// ✅ Good: Comprehensive validation
const UserInputSchema = z.object({
  // Email validation
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .toLowerCase(),

  // Username validation
  username: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),

  // URL validation
  website: z.string()
    .url('Invalid URL')
    .refine(
      (url) => {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      },
      'Only HTTP(S) URLs allowed'
    )
    .optional(),

  // Age validation
  age: z.number()
    .int('Age must be an integer')
    .positive('Age must be positive')
    .max(120, 'Invalid age'),

  // Array validation
  tags: z.array(
    z.string()
      .min(1)
      .max(50)
      .regex(/^[a-z0-9-]+$/)
  )
    .max(10, 'Maximum 10 tags allowed')
    .optional(),

  // Enum validation
  role: z.enum(['admin', 'user', 'guest'])
    .default('guest'),

  // File path validation
  filePath: z.string()
    .refine(
      (path) => !path.includes('..') && !path.startsWith('/'),
      'Invalid file path'
    )
    .optional()
});

type UserInput = z.infer<typeof UserInputSchema>;

// Usage
function handleUserInput(rawInput: unknown): UserInput {
  try {
    return UserInputSchema.parse(rawInput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation failed', { errors: error.errors });
      throw new Error('Invalid input: ' + error.errors[0].message);
    }
    throw error;
  }
}
```

### Sanitization

- [ ] **String Sanitization**
  - HTML/XML special characters escaped
  - SQL injection prevented (use parameterized queries)
  - Command injection prevented (avoid shell execution)
  - Path traversal prevented

- [ ] **Output Encoding**
  - Context-appropriate encoding (HTML, URL, JavaScript)
  - Unicode normalization applied
  - Character set validation
  - Content-Type headers set correctly

**Example: String Sanitization**

```typescript
import { escape } from 'html-escaper';
import validator from 'validator';

// ✅ Good: Multiple sanitization methods
class Sanitizer {
  // HTML sanitization
  sanitizeHTML(input: string): string {
    return escape(input);
  }

  // SQL sanitization (use with parameterized queries)
  sanitizeSQL(input: string): string {
    // Remove SQL keywords and special characters
    return input.replace(/['";\\]/g, '');
  }

  // File path sanitization
  sanitizeFilePath(path: string): string {
    // Remove directory traversal attempts
    let sanitized = path.replace(/\.\./g, '');
    sanitized = sanitized.replace(/^\/+/, '');
    sanitized = sanitized.replace(/[^a-zA-Z0-9._/-]/g, '');
    return sanitized;
  }

  // URL sanitization
  sanitizeURL(url: string): string | null {
    if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
      return null;
    }

    try {
      const parsed = new URL(url);
      // Block internal/private IPs
      if (this.isPrivateIP(parsed.hostname)) {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }

  private isPrivateIP(hostname: string): boolean {
    const privateRanges = [
      /^127\./,          // Loopback
      /^10\./,           // Private
      /^172\.(1[6-9]|2\d|3[01])\./, // Private
      /^192\.168\./,     // Private
      /^localhost$/i,    // Localhost
      /^\[::1\]$/,       // IPv6 localhost
    ];

    return privateRanges.some(range => range.test(hostname));
  }
}
```

### Size Limits

- [ ] **Request Size**
  - Maximum request body size enforced
  - Maximum header size enforced
  - Maximum URL length enforced
  - Large payloads rejected early

- [ ] **Data Structure Limits**
  - Maximum array length
  - Maximum object depth
  - Maximum string length
  - Maximum file upload size

**Example: Size Limit Enforcement**

```typescript
import express from 'express';

// ✅ Good: Size limits enforced
const app = express();

// Body size limit
app.use(express.json({
  limit: '100kb',
  strict: true
}));

// URL length limit
app.use((req, res, next) => {
  if (req.url.length > 2048) {
    return res.status(414).json({ error: 'URI too long' });
  }
  next();
});

// Header size limit
app.use((req, res, next) => {
  const headerSize = Object.entries(req.headers)
    .reduce((sum, [key, value]) => sum + key.length + String(value).length, 0);

  if (headerSize > 8192) { // 8KB
    return res.status(431).json({ error: 'Request header too large' });
  }
  next();
});

// Custom validation for nested structures
function validateDepth(obj: any, maxDepth: number, currentDepth = 0): boolean {
  if (currentDepth > maxDepth) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null) {
    return true;
  }

  return Object.values(obj).every(value =>
    validateDepth(value, maxDepth, currentDepth + 1)
  );
}
```

---

## Rate Limiting & DoS Protection

### Request Rate Limiting

- [ ] **Global Rate Limits**
  - Requests per second per IP
  - Requests per minute per IP
  - Sliding window algorithm
  - 429 status code returned

- [ ] **Per-User Rate Limits**
  - Limits based on user/API key
  - Different limits per tier
  - Burst allowance configured
  - Rate limit headers included

- [ ] **Per-Endpoint Rate Limits**
  - Expensive operations limited more strictly
  - Different limits per endpoint
  - Write operations more restricted
  - Public endpoints most restricted

**Example: Rate Limiting Implementation**

```typescript
import { RateLimiterMemory } from 'rate-limiter-flexible';
import express from 'express';

// ✅ Good: Multi-tier rate limiting
class RateLimitManager {
  // Global IP-based limiter
  private ipLimiter = new RateLimiterMemory({
    points: 100, // requests
    duration: 60, // per 60 seconds
    blockDuration: 60 // Block for 60 seconds if exceeded
  });

  // User-based limiter
  private userLimiter = new RateLimiterMemory({
    points: 1000,
    duration: 60
  });

  // Expensive operation limiter
  private expensiveLimiter = new RateLimiterMemory({
    points: 10,
    duration: 60
  });

  async checkIPLimit(req: express.Request): Promise<void> {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    try {
      await this.ipLimiter.consume(ip);
    } catch (error) {
      throw new Error('Rate limit exceeded for IP');
    }
  }

  async checkUserLimit(userId: string): Promise<void> {
    try {
      await this.userLimiter.consume(userId);
    } catch (error) {
      throw new Error('Rate limit exceeded for user');
    }
  }

  async checkExpensiveOperation(key: string): Promise<void> {
    try {
      await this.expensiveLimiter.consume(key);
    } catch (error) {
      throw new Error('Rate limit exceeded for this operation');
    }
  }
}

// Middleware
const rateLimiter = new RateLimitManager();

app.use(async (req, res, next) => {
  try {
    await rateLimiter.checkIPLimit(req);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '95'); // Calculate actual remaining
    res.setHeader('X-RateLimit-Reset', String(Date.now() + 60000));

    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: 60
    });
  }
});
```

### DoS Protection

- [ ] **Connection Limits**
  - Maximum concurrent connections
  - Connection timeout configured
  - Slow connection detection
  - Connection draining on shutdown

- [ ] **Resource Limits**
  - CPU usage limits
  - Memory usage limits
  - Disk I/O limits
  - Network bandwidth limits

- [ ] **Request Validation**
  - Request timeout enforced
  - Large payload rejection
  - Compression bomb protection
  - Regular expression DoS (ReDoS) prevention

**Example: DoS Protection**

```typescript
import express from 'express';
import timeout from 'connect-timeout';
import compression from 'compression';

// ✅ Good: Comprehensive DoS protection
const app = express();

// Request timeout (30 seconds)
app.use(timeout('30s'));

// Compression with limits
app.use(compression({
  threshold: 1024, // Only compress if > 1KB
  filter: (req, res) => {
    // Don't compress already compressed content
    if (req.headers['content-encoding']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Payload size limits
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Prevent slow HTTP attacks
let requestCount = 0;
const MAX_CONCURRENT = 1000;

app.use((req, res, next) => {
  requestCount++;

  if (requestCount > MAX_CONCURRENT) {
    requestCount--;
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }

  res.on('finish', () => {
    requestCount--;
  });

  next();
});

// Timeout handler
app.use((req, res, next) => {
  if (req.timedout) {
    return res.status(408).json({ error: 'Request timeout' });
  }
  next();
});

// ReDoS protection
function safeRegexTest(pattern: string, input: string): boolean {
  const timeoutMs = 100; // 100ms timeout

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(false); // Timeout - assume no match
    }, timeoutMs);

    try {
      const result = new RegExp(pattern).test(input);
      clearTimeout(timer);
      resolve(result);
    } catch {
      clearTimeout(timer);
      resolve(false);
    }
  });
}
```

### DDoS Mitigation

- [ ] **Infrastructure Protection**
  - CDN/WAF configured (Cloudflare, AWS Shield)
  - Anycast network for distribution
  - Rate limiting at network edge
  - Geoblocking configured if needed

- [ ] **Anomaly Detection**
  - Traffic pattern monitoring
  - Sudden spike detection
  - Suspicious IP identification
  - Automatic blocking configured

- [ ] **Graceful Degradation**
  - Circuit breakers implemented
  - Fallback responses configured
  - Non-essential features disabled under load
  - Status page updated automatically

---

## Audit Logging

### What to Log

- [ ] **Authentication Events**
  - Successful logins
  - Failed login attempts
  - Password changes
  - Token issuance/revocation
  - OAuth authorizations

- [ ] **Authorization Events**
  - Permission checks
  - Access denials
  - Role changes
  - Privilege escalations

- [ ] **Data Access**
  - Read operations on sensitive data
  - Write operations
  - Delete operations
  - Data exports

- [ ] **System Events**
  - Configuration changes
  - System errors
  - Service starts/stops
  - Deployment events

**Example: Comprehensive Audit Logging**

```typescript
import winston from 'winston';

// ✅ Good: Structured audit logging
interface AuditLog {
  timestamp: string;
  eventType: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  resource?: string;
  action: string;
  result: 'success' | 'failure';
  details?: Record<string, any>;
}

class AuditLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        // Separate file for audit logs
        new winston.transports.File({
          filename: 'audit.log',
          maxsize: 104857600, // 100MB
          maxFiles: 10,
          tailable: true
        }),
        // Also send to centralized logging
        new winston.transports.Http({
          host: 'logging-service',
          port: 9000,
          path: '/audit-logs'
        })
      ]
    });
  }

  logAuthentication(event: {
    userId?: string;
    ip: string;
    success: boolean;
    method: string;
    reason?: string;
  }): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      eventType: 'authentication',
      userId: event.userId,
      ip: event.ip,
      action: event.method,
      result: event.success ? 'success' : 'failure',
      details: {
        reason: event.reason
      }
    };

    this.logger.info(log);
  }

  logDataAccess(event: {
    userId: string;
    ip: string;
    resource: string;
    action: 'read' | 'write' | 'delete';
    success: boolean;
    recordIds?: string[];
  }): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      eventType: 'data_access',
      userId: event.userId,
      ip: event.ip,
      resource: event.resource,
      action: event.action,
      result: event.success ? 'success' : 'failure',
      details: {
        recordIds: event.recordIds
      }
    };

    this.logger.info(log);
  }

  logConfigurationChange(event: {
    userId: string;
    ip: string;
    configKey: string;
    oldValue: string;
    newValue: string;
  }): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      eventType: 'configuration_change',
      userId: event.userId,
      ip: event.ip,
      resource: event.configKey,
      action: 'update',
      result: 'success',
      details: {
        oldValue: event.oldValue,
        newValue: event.newValue
      }
    };

    this.logger.info(log);
  }

  logSecurityEvent(event: {
    userId?: string;
    ip: string;
    eventType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }): void {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      eventType: `security_${event.eventType}`,
      userId: event.userId,
      ip: event.ip,
      action: event.eventType,
      result: 'failure',
      details: {
        severity: event.severity,
        description: event.description
      }
    };

    this.logger.warn(log);

    // Alert on high/critical severity
    if (['high', 'critical'].includes(event.severity)) {
      this.sendSecurityAlert(log);
    }
  }

  private sendSecurityAlert(log: AuditLog): void {
    // Send to security monitoring system
    // Implementation depends on your infrastructure
  }
}

// Usage in application
const auditLogger = new AuditLogger();

// Log authentication
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticateUser(username, password);

  auditLogger.logAuthentication({
    userId: user?.id,
    ip: req.ip,
    success: !!user,
    method: 'password',
    reason: user ? undefined : 'invalid_credentials'
  });

  // ... rest of login logic
});

// Log data access
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await database.users.findById(userId);

    auditLogger.logDataAccess({
      userId: req.user.id,
      ip: req.ip,
      resource: 'users',
      action: 'read',
      success: true,
      recordIds: [userId]
    });

    res.json(user);
  } catch (error) {
    auditLogger.logDataAccess({
      userId: req.user.id,
      ip: req.ip,
      resource: 'users',
      action: 'read',
      success: false,
      recordIds: [userId]
    });

    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});
```

### Log Retention & Analysis

- [ ] **Retention Policy**
  - Retention period defined (minimum 90 days)
  - Legal requirements met
  - Archived logs accessible
  - Deletion process automated

- [ ] **Log Analysis**
  - Centralized logging system (ELK, Splunk, etc.)
  - Automated alerts configured
  - Regular log reviews conducted
  - Anomaly detection enabled

- [ ] **Log Protection**
  - Logs immutable (append-only)
  - Logs integrity protected (signatures/hashes)
  - Access to logs restricted and logged
  - Logs encrypted at rest

---

## Compliance Considerations

### GDPR (General Data Protection Regulation)

- [ ] **Data Subject Rights**
  - Right to access implemented
  - Right to rectification implemented
  - Right to erasure ("right to be forgotten")
  - Right to data portability
  - Right to object to processing

- [ ] **Consent Management**
  - Explicit consent obtained
  - Consent easily withdrawn
  - Consent records maintained
  - Purpose of processing documented

- [ ] **Data Processing**
  - Lawful basis for processing identified
  - Data minimization applied
  - Purpose limitation enforced
  - Storage limitation enforced

- [ ] **Data Protection**
  - Privacy by design implemented
  - Data protection impact assessment (DPIA) conducted
  - Data breach notification process defined
  - Data processing records maintained

**Example: GDPR Data Subject Rights**

```typescript
// ✅ Good: GDPR compliance implementation
class GDPRCompliance {
  // Right to access
  async exportUserData(userId: string): Promise<UserDataExport> {
    const [profile, orders, preferences, logs] = await Promise.all([
      database.users.findById(userId),
      database.orders.findByUserId(userId),
      database.preferences.findByUserId(userId),
      database.auditLogs.findByUserId(userId)
    ]);

    return {
      personalData: {
        profile,
        orders,
        preferences
      },
      activityLog: logs,
      exportDate: new Date().toISOString(),
      format: 'JSON'
    };
  }

  // Right to erasure
  async deleteUserData(userId: string, reason: string): Promise<void> {
    // Log the deletion request
    auditLogger.logDataAccess({
      userId,
      ip: 'system',
      resource: 'user_data',
      action: 'delete',
      success: true,
      recordIds: [userId]
    });

    // Anonymize instead of delete (if legally required to retain)
    await database.users.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@anonymized.local`,
        name: '[DELETED]',
        phone: null,
        deletedAt: new Date(),
        deletionReason: reason
      }
    });

    // Delete non-essential data
    await Promise.all([
      database.preferences.deleteByUserId(userId),
      database.sessions.deleteByUserId(userId),
      database.oauthTokens.revokeByUserId(userId)
    ]);
  }

  // Right to data portability
  async portUserData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<string> {
    const data = await this.exportUserData(userId);

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data);
      case 'xml':
        return this.convertToXML(data);
      default:
        throw new Error('Unsupported format');
    }
  }

  // Consent management
  async updateConsent(userId: string, consent: {
    marketing: boolean;
    analytics: boolean;
    thirdParty: boolean;
  }): Promise<void> {
    await database.consent.upsert({
      where: { userId },
      create: {
        userId,
        ...consent,
        consentDate: new Date(),
        version: CONSENT_VERSION
      },
      update: {
        ...consent,
        consentDate: new Date(),
        version: CONSENT_VERSION
      }
    });
  }

  private convertToCSV(data: any): string {
    // CSV conversion logic
    return '';
  }

  private convertToXML(data: any): string {
    // XML conversion logic
    return '';
  }
}
```

### SOC 2 (Service Organization Control 2)

- [ ] **Security**
  - Access controls implemented
  - Logical and physical security
  - System operations monitoring
  - Change management process

- [ ] **Availability**
  - System uptime monitored
  - Disaster recovery plan documented
  - Backup and recovery tested
  - Incident response plan defined

- [ ] **Processing Integrity**
  - Data validation implemented
  - Error handling comprehensive
  - Processing monitored
  - Quality assurance processes

- [ ] **Confidentiality**
  - Data classification implemented
  - Access controls based on classification
  - Confidentiality agreements in place
  - Secure disposal of confidential data

- [ ] **Privacy**
  - Privacy notice provided
  - Data collection documented
  - Data usage transparent
  - Privacy controls implemented

### PCI DSS (Payment Card Industry Data Security Standard)

*(If handling payment card data)*

- [ ] **Build and Maintain Secure Network**
  - Firewall configuration documented
  - Vendor-supplied defaults changed
  - Network segmentation implemented

- [ ] **Protect Cardholder Data**
  - Cardholder data encrypted in transit
  - Cardholder data encrypted at rest
  - Sensitive authentication data not stored
  - Primary account number (PAN) masked

- [ ] **Vulnerability Management**
  - Antivirus software deployed
  - Security patches applied regularly
  - Secure development lifecycle implemented

- [ ] **Access Control**
  - Access to cardholder data restricted
  - Unique ID per user
  - Physical access to data restricted

- [ ] **Monitoring and Testing**
  - Network monitoring implemented
  - Access to cardholder data logged
  - Regular security testing conducted

### HIPAA (Health Insurance Portability and Accountability Act)

*(If handling health information)*

- [ ] **Administrative Safeguards**
  - Security management process
  - Risk analysis conducted
  - Workforce security training
  - Contingency planning

- [ ] **Physical Safeguards**
  - Facility access controls
  - Workstation security
  - Device and media controls

- [ ] **Technical Safeguards**
  - Access control
  - Audit controls
  - Integrity controls
  - Transmission security

- [ ] **Breach Notification**
  - Breach detection mechanisms
  - Breach notification process (60 days)
  - Documentation of breaches

---

## Security Testing Procedures

### Development Testing

- [ ] **Static Analysis**
  - SAST tools configured in CI/CD
  - Code scanned on every commit
  - Security findings triaged
  - High-severity findings block deployment

- [ ] **Dependency Scanning**
  - Dependency vulnerabilities scanned
  - Outdated dependencies identified
  - Vulnerable dependencies updated
  - Supply chain attacks mitigated

- [ ] **Secret Scanning**
  - Pre-commit hooks prevent secret commits
  - Repository scanned for historical secrets
  - Leaked secrets rotated immediately
  - Secret detection rules maintained

**Example: Pre-commit Security Checks**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# ✅ Good: Pre-commit security checks

echo "Running security checks..."

# 1. Secret detection
echo "Checking for secrets..."
if git diff --cached --name-only | xargs grep -E "(api[_-]?key|password|secret|token|private[_-]?key)" --color=never; then
  echo "❌ Potential secret detected in staged files"
  echo "Please remove secrets before committing"
  exit 1
fi

# 2. Dependency audit
echo "Auditing dependencies..."
if command -v npm &> /dev/null; then
  npm audit --audit-level=moderate || {
    echo "❌ Dependency vulnerabilities found"
    exit 1
  }
fi

# 3. Linting
echo "Running linter..."
npm run lint || {
  echo "❌ Linting failed"
  exit 1
}

# 4. Type checking
echo "Type checking..."
npx tsc --noEmit || {
  echo "❌ Type errors found"
  exit 1
}

echo "✅ All security checks passed"
exit 0
```

### Integration Testing

- [ ] **API Security Testing**
  - Authentication bypass attempts
  - Authorization boundary testing
  - Input validation testing
  - Rate limiting verification

- [ ] **OAuth Flow Testing**
  - PKCE implementation verified
  - State parameter validation tested
  - Token expiration handling tested
  - Refresh token rotation tested

**Example: Security Integration Tests**

```typescript
import { describe, it, expect } from '@jest/globals';
import supertest from 'supertest';
import app from '../src/app';

// ✅ Good: Comprehensive security tests
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const response = await supertest(app)
        .get('/api/protected')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject expired tokens', async () => {
      const expiredToken = generateExpiredToken();

      const response = await supertest(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.error).toMatch(/expired/i);
    });

    it('should reject tampered tokens', async () => {
      const validToken = await generateToken();
      const tamperedToken = validToken + 'tampered';

      await supertest(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);
    });
  });

  describe('Authorization', () => {
    it('should enforce role-based access control', async () => {
      const viewerToken = await generateToken({ role: 'viewer' });

      await supertest(app)
        .delete('/api/resources/123')
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(403);
    });

    it('should prevent privilege escalation', async () => {
      const userToken = await generateToken({ role: 'user' });

      await supertest(app)
        .post('/api/users/123/make-admin')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('Input Validation', () => {
    it('should reject SQL injection attempts', async () => {
      const token = await generateToken();

      await supertest(app)
        .get('/api/users?filter=1\' OR \'1\'=\'1')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('should reject XSS attempts', async () => {
      const token = await generateToken();

      await supertest(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: '<script>alert("XSS")</script>'
        })
        .expect(400);
    });

    it('should reject path traversal attempts', async () => {
      const token = await generateToken();

      await supertest(app)
        .get('/api/files/../../etc/passwd')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const token = await generateToken();

      // Make requests up to limit
      for (let i = 0; i < 100; i++) {
        await supertest(app)
          .get('/api/data')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      }

      // Next request should be rate limited
      await supertest(app)
        .get('/api/data')
        .set('Authorization', `Bearer ${token}`)
        .expect(429);
    });
  });
});
```

### Penetration Testing

- [ ] **External Penetration Testing**
  - Annual third-party penetration tests
  - Scope defined clearly
  - Findings remediated
  - Re-testing after fixes

- [ ] **Internal Testing**
  - Quarterly internal security assessments
  - Known attack vectors tested
  - Security team trained
  - Testing results documented

- [ ] **Red Team Exercises**
  - Simulated attacks conducted
  - Social engineering tested
  - Physical security tested
  - Incident response validated

### Vulnerability Management

- [ ] **Vulnerability Scanning**
  - Automated scans weekly
  - Manual reviews quarterly
  - Third-party assessments annually
  - Continuous monitoring

- [ ] **Vulnerability Remediation**
  - Critical: 24 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

- [ ] **Patch Management**
  - Security patches prioritized
  - Patch testing process
  - Rollback plan documented
  - Patch deployment tracked

---

## Security Incident Response

### Preparation

- [ ] **Incident Response Plan**
  - Plan documented and reviewed
  - Team roles defined
  - Communication channels established
  - Escalation procedures documented

- [ ] **Detection Mechanisms**
  - Security monitoring configured
  - Alert thresholds defined
  - On-call rotation scheduled
  - Runbooks prepared

### Detection & Analysis

- [ ] **Initial Assessment**
  - Incident severity classified
  - Scope determined
  - Stakeholders notified
  - Investigation initiated

- [ ] **Evidence Collection**
  - Logs preserved
  - System snapshots taken
  - Network traffic captured
  - Chain of custody maintained

### Containment & Recovery

- [ ] **Immediate Actions**
  - Threat contained
  - Access revoked
  - Systems isolated
  - Stakeholders updated

- [ ] **Recovery**
  - Systems restored
  - Data integrity verified
  - Monitoring enhanced
  - Services resumed

### Post-Incident

- [ ] **Post-Mortem**
  - Timeline documented
  - Root cause identified
  - Lessons learned
  - Improvements implemented

- [ ] **Notification**
  - Affected parties notified
  - Regulatory reporting completed
  - Public disclosure if required
  - Status updates provided

---

## Resources

### Security Tools

- **SAST**: SonarQube, Semgrep, CodeQL
- **DAST**: OWASP ZAP, Burp Suite
- **Dependency Scanning**: Snyk, npm audit, pip-audit
- **Secret Scanning**: GitGuardian, TruffleHog, git-secrets
- **Container Scanning**: Trivy, Clair, Anchore

### Security Standards

- **OWASP Top 10**: [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/)
- **CWE Top 25**: [cwe.mitre.org/top25](https://cwe.mitre.org/top25/)
- **NIST Cybersecurity Framework**: [nist.gov/cyberframework](https://www.nist.gov/cyberframework)
- **ISO 27001**: Information Security Management

### MCP-Specific Resources

- **MCP Security Guidelines**: [modelcontextprotocol.io/security](https://modelcontextprotocol.io/security)
- **Third-Party Security Guidelines**: `docs/guidelines/team-conventions/third-party-security-guidelines.md`
- **OAuth Implementation**: `docs/modules/mcp/02-using-mcp/authentication/oauth-guide.md`

---

**Last Updated:** February 2026
**Category:** MCP Reference
**Applies To:** All MCP Implementations
**Version:** 1.0
