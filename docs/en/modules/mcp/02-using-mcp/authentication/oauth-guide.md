# OAuth Authentication in MCP

## Overview

OAuth 2.0 is the primary authentication mechanism for remote MCP servers that need to access user data from third-party services. This guide covers OAuth implementation across all MCP-supported platforms, providing platform-specific configuration examples, authorization flows, and security best practices.

**Why OAuth for MCP?**
- **Delegated authorization**: Users grant limited access without sharing passwords
- **Token-based security**: Short-lived access tokens with automatic refresh
- **Platform integration**: Native browser-based authentication flows
- **Standardized protocol**: Industry-standard OAuth 2.0 implementation

---

## OAuth Fundamentals for MCP

### OAuth 2.0 Flow Overview

MCP servers use the **Authorization Code Flow** with PKCE (Proof Key for Code Exchange) for enhanced security:

```
1. User initiates authentication in MCP client
2. Client generates PKCE code verifier and challenge
3. User redirected to OAuth provider (opens browser)
4. User authenticates and grants permissions
5. Provider redirects back with authorization code
6. Client exchanges code + verifier for access token
7. Client stores token securely
8. MCP server uses token for API requests
9. Client automatically refreshes expired tokens
```

### Key OAuth Components

**Authorization Server**
- Provider's OAuth endpoint (e.g., `https://github.com/login/oauth/authorize`)
- Handles user authentication and consent
- Issues authorization codes

**Token Endpoint**
- Exchanges authorization codes for access tokens
- Handles token refresh requests
- Returns token metadata (expiry, scope, etc.)

**Access Token**
- Short-lived credential for API access
- Included in API request headers
- Automatically refreshed when expired

**Refresh Token**
- Long-lived credential for obtaining new access tokens
- Stored securely by MCP client
- Used automatically without user interaction

---

## Platform-Specific OAuth Implementation

### Claude Code: Dynamic OAuth

Claude Code uses **dynamic OAuth discovery** where the MCP server advertises its OAuth configuration through the MCP protocol.

#### Configuration

**Basic HTTP server with OAuth:**

```bash
# Add server that supports OAuth
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**No OAuth configuration needed** in the add command. The server provides its OAuth metadata through MCP protocol.

#### Authentication Flow

**Step 1: Add server**

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**Step 2: Trigger authentication**

Within Claude Code session:

```
> /mcp
```

This opens the MCP management interface showing all servers and their auth status.

**Step 3: Authenticate**

1. Select the server requiring authentication
2. Click "Authenticate" button
3. Browser opens to provider's OAuth page
4. Log in and grant permissions
5. Browser redirects back to Claude Code
6. Tokens stored securely and refreshed automatically

#### OAuth Discovery Process

When connecting to an HTTP MCP server, Claude Code:

1. Sends MCP initialization request
2. Receives server capabilities including OAuth metadata
3. Displays authentication prompt if needed
4. Handles entire OAuth flow automatically

**Example server OAuth metadata:**

```json
{
  "capabilities": {
    "auth": {
      "oauth": {
        "authorizationUrl": "https://github.com/login/oauth/authorize",
        "tokenUrl": "https://github.com/login/oauth/access_token",
        "scopes": ["repo", "user"]
      }
    }
  }
}
```

#### Managing Authentication

**Check authentication status:**

```
> /mcp
```

Shows all servers with authentication indicators:
- ✅ Authenticated
- ⚠️ Authentication required
- ❌ Authentication failed

**Clear authentication:**

1. Open `/mcp` interface
2. Select server
3. Click "Clear authentication"
4. Re-authenticate when needed

#### Token Storage

- **Location**: Secure system keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service)
- **Automatic refresh**: Tokens refreshed before expiry
- **Scope preservation**: Original scopes maintained across refreshes

---

### Cursor: Static OAuth with Redirect URL

Cursor uses **static OAuth** where OAuth credentials are pre-configured in `mcp.json`.

#### Configuration

**Static OAuth configuration:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp",
      "auth": {
        "CLIENT_ID": "your-oauth-client-id",
        "CLIENT_SECRET": "your-client-secret",
        "scopes": ["repo", "user"]
      }
    }
  }
}
```

#### Redirect URL

**Fixed redirect URL for all servers:**

```
cursor://anysphere.cursor-mcp/oauth/callback
```

**Important**: Register this exact URL with your OAuth provider.

#### OAuth Provider Setup

**Example: GitHub OAuth App**

1. Navigate to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in application details:
   - **Application name**: "Cursor MCP Integration"
   - **Homepage URL**: `https://cursor.com`
   - **Authorization callback URL**: `cursor://anysphere.cursor-mcp/oauth/callback`
4. Click "Register application"
5. Copy Client ID and generate Client Secret
6. Add to `mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp",
      "auth": {
        "CLIENT_ID": "Iv1.a1b2c3d4e5f6g7h8",
        "CLIENT_SECRET": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
        "scopes": ["repo", "user", "read:org"]
      }
    }
  }
}
```

#### State Parameter

The OAuth `state` parameter identifies which MCP server initiated the flow:

- Cursor generates unique state for each server
- State passed to OAuth provider
- State validated on redirect to prevent CSRF attacks
- Allows single redirect URL for multiple servers

#### Authentication Process

1. User opens Cursor with configured MCP server
2. Cursor detects OAuth configuration
3. Browser opens to provider's authorization URL
4. User authenticates and grants scopes
5. Provider redirects to `cursor://anysphere.cursor-mcp/oauth/callback?code=...&state=...`
6. Cursor validates state and exchanges code for tokens
7. Tokens stored securely

#### Security Considerations

**Client Secret Storage:**

- ✅ Use environment variables: `"CLIENT_SECRET": "${env:GITHUB_CLIENT_SECRET}"`
- ✅ Use project-specific `.env` files (not committed)
- ❌ Never commit secrets to version control

**Example with environment variables:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:GITHUB_CLIENT_ID}",
        "CLIENT_SECRET": "${env:GITHUB_CLIENT_SECRET}",
        "scopes": ["repo", "user"]
      }
    }
  }
}
```

---

### Gemini CLI: Multiple OAuth Methods

Gemini CLI supports **three OAuth authentication methods**: Dynamic Discovery, Google Credentials, and Service Account Impersonation.

#### Method 1: Dynamic Discovery (Default)

**Configuration:**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

**How it works:**
- Similar to Claude Code's dynamic OAuth
- Server advertises OAuth configuration via MCP protocol
- Gemini CLI handles authentication flow automatically
- Best for third-party MCP servers with built-in OAuth support

**Authentication process:**

```bash
# Add server
gemini mcp add --transport sse github https://api.example.com/sse

# Authenticate (interactive)
gemini
> /mcp
# Select server and authenticate via browser
```

#### Method 2: Google Credentials

**Use case**: Authenticating to Google Cloud services or Google APIs.

**Configuration:**

```json
{
  "mcpServers": {
    "google-service": {
      "httpUrl": "https://service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/cloud-platform"
        ]
      }
    }
  }
}
```

**Authentication flow:**

1. Gemini CLI detects `google_credentials` auth type
2. Checks for Application Default Credentials (ADC)
3. If not found, initiates browser-based OAuth flow
4. User authenticates with Google account
5. Credentials stored in ADC location
6. Tokens automatically refreshed

**Setting up ADC:**

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Initialize and authenticate
gcloud auth application-default login

# Select account and grant permissions
# Credentials stored at:
# - macOS/Linux: ~/.config/gcloud/application_default_credentials.json
# - Windows: %APPDATA%\gcloud\application_default_credentials.json
```

**Required scopes:**

Common Google OAuth scopes:

| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/userinfo.email` | Access user email |
| `https://www.googleapis.com/auth/userinfo.profile` | Access user profile |
| `https://www.googleapis.com/auth/cloud-platform` | Full Google Cloud access |
| `https://www.googleapis.com/auth/drive.readonly` | Read-only Drive access |
| `https://www.googleapis.com/auth/gmail.send` | Send emails via Gmail |

#### Method 3: Service Account Impersonation

**Use case**: Accessing Google Cloud services protected by Identity-Aware Proxy (IAP) or requiring service account credentials.

**Configuration:**

```json
{
  "mcpServers": {
    "iap-protected": {
      "url": "https://service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "123456789-abc123.apps.googleusercontent.com",
      "targetServiceAccount": "mcp-server@project-id.iam.gserviceaccount.com"
    }
  }
}
```

**Parameters:**

- **`authProviderType`**: Must be `"service_account_impersonation"`
- **`targetAudience`**: OAuth 2.0 client ID of the IAP-protected resource
- **`targetServiceAccount`**: Service account email to impersonate

**How it works:**

1. User authenticates with their Google account (via ADC)
2. Gemini CLI requests short-lived token impersonating target service account
3. User must have `iam.serviceAccountTokenCreator` role on target service account
4. Token used to access IAP-protected MCP server
5. Tokens automatically refreshed

**Setup requirements:**

```bash
# Grant impersonation permissions
gcloud iam service-accounts add-iam-policy-binding \
  mcp-server@project-id.iam.gserviceaccount.com \
  --member="user:your-email@example.com" \
  --role="roles/iam.serviceAccountTokenCreator"

# For IAP-protected services, also grant IAP access
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=SERVICE_NAME \
  --member="serviceAccount:mcp-server@project-id.iam.gserviceaccount.com" \
  --role="roles/iap.httpsResourceAccessor"
```

**Finding target audience:**

```bash
# List IAP clients
gcloud iap oauth-clients list --project=PROJECT_ID

# Get client ID (target audience)
gcloud iap oauth-clients describe CLIENT_NAME \
  --project=PROJECT_ID \
  --format="value(name)"
```

#### Gemini CLI Authentication Management

**Check authentication status:**

```bash
gemini
> /mcp
```

Shows servers with authentication state:
- ✅ Authenticated
- 🔄 Refreshing token
- ⚠️ Authentication required
- ❌ Authentication error

**Re-authenticate:**

```bash
# Clear stored credentials
rm ~/.config/gemini/credentials/SERVER_NAME.json

# Restart Gemini CLI
gemini
> /mcp
# Re-authenticate via browser
```

---

## Authorization Flow Diagrams

### Dynamic OAuth Flow (Claude Code, Gemini CLI)

```
┌─────────────┐                                    ┌──────────────┐
│  MCP Client │                                    │ OAuth Provider│
│ (Claude/    │                                    │  (GitHub,    │
│  Gemini)    │                                    │   Google)    │
└──────┬──────┘                                    └──────┬───────┘
       │                                                  │
       │ 1. Connect to MCP server                        │
       ├─────────────────────────────►                   │
       │                               MCP Server        │
       │ 2. Receive OAuth metadata                       │
       │◄──────────────────────────────                  │
       │   (authorizationUrl, scopes)                    │
       │                                                  │
       │ 3. Generate PKCE challenge                      │
       │    Open browser with auth URL                   │
       ├──────────────────────────────────────────────► │
       │                                                  │
       │                         4. User authenticates   │
       │                            & grants permissions │
       │                                                  │
       │ 5. Redirect with auth code ◄───────────────────┤
       │    to callback URL                              │
       │                                                  │
       │ 6. Exchange code + verifier for tokens         │
       ├──────────────────────────────────────────────► │
       │                                                  │
       │ 7. Return access + refresh tokens  ◄───────────┤
       │                                                  │
       │ 8. Store tokens securely                        │
       │    (system keychain)                            │
       │                                                  │
       │ 9. Use access token in API requests            │
       ├─────────────────────────────►                   │
       │                               MCP Server        │
       │                                                  │
       │ 10. Auto-refresh when expired                   │
       ├──────────────────────────────────────────────► │
       │                                                  │
       │ 11. New access token           ◄───────────────┤
       │                                                  │
```

### Static OAuth Flow (Cursor)

```
┌─────────────┐                                    ┌──────────────┐
│   Cursor    │                                    │ OAuth Provider│
└──────┬──────┘                                    └──────┬───────┘
       │                                                  │
       │ 1. Read mcp.json with OAuth config              │
       │    (CLIENT_ID, CLIENT_SECRET, scopes)           │
       │                                                  │
       │ 2. Generate state parameter                     │
       │    Open browser to authorization URL            │
       ├──────────────────────────────────────────────► │
       │                                                  │
       │                         3. User authenticates   │
       │                            & grants permissions │
       │                                                  │
       │ 4. Redirect to cursor://...?code=...&state=... │
       │    ◄───────────────────────────────────────────┤
       │                                                  │
       │ 5. Validate state parameter                     │
       │                                                  │
       │ 6. Exchange code for tokens                     │
       │    (using CLIENT_ID + CLIENT_SECRET)            │
       ├──────────────────────────────────────────────► │
       │                                                  │
       │ 7. Return access + refresh tokens  ◄───────────┤
       │                                                  │
       │ 8. Store tokens securely                        │
       │                                                  │
```

### Service Account Impersonation (Gemini CLI)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Gemini CLI │     │Google Cloud  │     │ MCP Server   │
│             │     │IAM & IAP     │     │(IAP-protected)│
└──────┬──────┘     └──────┬───────┘     └──────┬───────┘
       │                   │                     │
       │ 1. User authenticates with ADC         │
       │    (personal Google account)            │
       │                   │                     │
       │ 2. Request impersonation token          │
       ├──────────────────►│                     │
       │   for target SA   │                     │
       │                   │                     │
       │                   │ 3. Verify user has  │
       │                   │    TokenCreator role│
       │                   │                     │
       │ 4. Return SA token│                     │
       │    (short-lived)  │                     │
       │◄──────────────────┤                     │
       │                   │                     │
       │ 5. Request MCP connection               │
       │    with SA token (ID token)             │
       ├─────────────────────────────────────────►
       │                   │                     │
       │                   │ 6. Verify ID token  │
       │                   │    with IAP         │
       │                   │◄────────────────────┤
       │                   │                     │
       │                   │ 7. Allow access     │
       │                   ├────────────────────►│
       │                   │                     │
       │ 8. MCP connection established           │
       │◄────────────────────────────────────────┤
       │                   │                     │
```

---

## Complete Setup Examples

### Example 1: GitHub MCP Server (Claude Code)

**Scenario**: Access GitHub repositories, issues, and pull requests.

**Step 1: Add MCP server**

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**Step 2: Authenticate**

```
# In Claude Code session
> /mcp

# Click on GitHub server
# Click "Authenticate"
# Browser opens to GitHub OAuth
```

**Step 3: Grant permissions**

GitHub prompts for permissions:
- ✅ Read access to repositories
- ✅ Write access to issues and pull requests
- ✅ Read user profile information

Click "Authorize" to grant access.

**Step 4: Verify**

```
> /mcp
```

GitHub server shows ✅ Authenticated status.

**Step 5: Use tools**

```
> Create an issue in my-org/my-repo titled "Add OAuth documentation" with label "documentation"
```

Claude Code uses GitHub MCP server with authenticated access.

### Example 2: Sentry MCP Server (Cursor)

**Scenario**: Monitor application errors and performance.

**Step 1: Create Sentry OAuth App**

1. Navigate to Sentry Organization Settings → Developer Settings
2. Click "New Internal Integration"
3. Fill in details:
   - **Name**: "Cursor MCP Integration"
   - **Webhook URL**: (leave empty)
   - **Redirect URL**: `cursor://anysphere.cursor-mcp/oauth/callback`
4. Grant permissions:
   - ✅ Project: Read
   - ✅ Issue & Event: Read
   - ✅ Organization: Read
5. Save and copy Client ID and Client Secret

**Step 2: Configure in mcp.json**

Create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp",
      "auth": {
        "CLIENT_ID": "${env:SENTRY_CLIENT_ID}",
        "CLIENT_SECRET": "${env:SENTRY_CLIENT_SECRET}",
        "scopes": ["project:read", "event:read", "org:read"]
      }
    }
  }
}
```

**Step 3: Set environment variables**

Create `.env` file in project root:

```bash
SENTRY_CLIENT_ID=your-client-id-here
SENTRY_CLIENT_SECRET=your-client-secret-here
```

**Step 4: Restart Cursor**

Cursor automatically initiates OAuth flow on startup.

**Step 5: Verify in Cursor**

Open Settings → Features → Model Context Protocol

Sentry should show as ✅ Connected.

### Example 3: Google Cloud Run Service (Gemini CLI)

**Scenario**: Access custom MCP server deployed to Google Cloud Run.

**Step 1: Deploy MCP server to Cloud Run**

```bash
# Deploy your MCP server
gcloud run deploy mcp-server \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated=false

# Note the service URL
# https://mcp-server-abc123-uc.a.run.app
```

**Step 2: Configure Gemini CLI**

Edit `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "cloud-run-mcp": {
      "httpUrl": "https://mcp-server-abc123-uc.a.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/cloud-platform"
        ]
      }
    }
  }
}
```

**Step 3: Authenticate with Google**

```bash
# Set up Application Default Credentials
gcloud auth application-default login

# Follow browser prompts
# Grant requested permissions
```

**Step 4: Verify in Gemini CLI**

```bash
gemini
> /mcp
```

Shows `cloud-run-mcp` as ✅ Authenticated.

**Step 5: Use the server**

```
> Use the cloud-run-mcp server to list available resources
```

---

## Token Management

### Token Lifecycle

**Access Token:**
- **Lifespan**: Typically 1 hour (provider-dependent)
- **Purpose**: Authenticate API requests
- **Refresh**: Automatic when expired
- **Storage**: Encrypted in system keychain

**Refresh Token:**
- **Lifespan**: Days to months (provider-dependent)
- **Purpose**: Obtain new access tokens
- **Refresh**: Not refreshed (long-lived)
- **Storage**: Encrypted in system keychain

### Automatic Token Refresh

All MCP clients handle token refresh automatically:

```
1. API request fails with 401 Unauthorized
2. Client checks if refresh token exists
3. Client requests new access token using refresh token
4. Provider returns new access token (and optionally new refresh token)
5. Client retries original API request with new token
6. Process transparent to user
```

### Token Storage Locations

**Claude Code:**
- **macOS**: Keychain Access (`~/Library/Keychains/`)
- **Linux**: Secret Service (GNOME Keyring, KWallet)
- **Windows**: Credential Manager

**Cursor:**
- Similar to Claude Code (platform-dependent secure storage)

**Gemini CLI:**
- **Location**: `~/.config/gemini/credentials/`
- **Format**: Encrypted JSON files per server
- **Google credentials**: ADC location (`~/.config/gcloud/`)

### Manual Token Refresh

**Force re-authentication:**

**Claude Code:**
```
> /mcp
# Select server → Clear authentication → Re-authenticate
```

**Cursor:**
Delete stored credentials:
```bash
# macOS
security delete-generic-password -s "cursor-mcp-SERVER_NAME"

# Restart Cursor to re-authenticate
```

**Gemini CLI:**
```bash
# Remove credentials file
rm ~/.config/gemini/credentials/SERVER_NAME.json

# Restart Gemini CLI
gemini
> /mcp
# Re-authenticate
```

### Token Expiry Handling

**Best practices for MCP server developers:**

```typescript
// Implement token refresh in API client
class APIClient {
  private accessToken: string;
  private refreshToken: string;
  private expiresAt: number;

  async request<T>(endpoint: string): Promise<T> {
    // Check if token expired
    if (Date.now() >= this.expiresAt) {
      await this.refreshAccessToken();
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    // Handle 401 as backup
    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.request(endpoint); // Retry
    }

    return response.json();
  }

  private async refreshAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + (data.expires_in * 1000);

    // Update refresh token if provider returns new one
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
    }
  }
}
```

---

## Security Best Practices

### For MCP Users

**1. Verify Server Identity**

Before authenticating:
- ✅ Check server URL is legitimate
- ✅ Verify OAuth provider matches expected service
- ✅ Review requested scopes carefully
- ❌ Never authenticate to unknown servers

**2. Minimize Scope Permissions**

Request only necessary scopes:

```json
// ✅ Good: Minimal scopes
{
  "scopes": ["repo:read", "user:email"]
}

// ❌ Bad: Excessive permissions
{
  "scopes": ["repo", "admin:org", "delete:repo"]
}
```

**3. Use Environment Variables for Secrets**

```json
// ✅ Good
{
  "auth": {
    "CLIENT_SECRET": "${env:OAUTH_SECRET}"
  }
}

// ❌ Bad
{
  "auth": {
    "CLIENT_SECRET": "hardcoded-secret-123"
  }
}
```

**4. Regular Token Rotation**

- Re-authenticate periodically (every 3-6 months)
- Revoke unused tokens in provider settings
- Monitor OAuth apps in provider dashboards

**5. Review Connected Applications**

**GitHub:**
Settings → Applications → Authorized OAuth Apps

**Google:**
myaccount.google.com → Security → Third-party apps with account access

**6. Use Separate OAuth Apps for Different Environments**

```json
// Development
{
  "CLIENT_ID": "${env:DEV_OAUTH_ID}"
}

// Production
{
  "CLIENT_ID": "${env:PROD_OAUTH_ID}"
}
```

### For MCP Server Developers

**1. Implement PKCE**

Use Proof Key for Code Exchange for enhanced security:

```typescript
import crypto from 'crypto';

// Generate code verifier
const codeVerifier = crypto.randomBytes(32).toString('base64url');

// Generate code challenge
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Include in authorization URL
const authUrl = new URL(AUTHORIZATION_ENDPOINT);
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

// Later, exchange code with verifier
const tokenResponse = await fetch(TOKEN_ENDPOINT, {
  method: 'POST',
  body: JSON.stringify({
    code: authCode,
    code_verifier: codeVerifier
  })
});
```

**2. Validate Redirect URIs**

```typescript
const ALLOWED_REDIRECTS = [
  'cursor://anysphere.cursor-mcp/oauth/callback',
  'http://localhost:3000/callback',  // Development only
];

function validateRedirect(uri: string): boolean {
  return ALLOWED_REDIRECTS.includes(uri);
}
```

**3. Use Short-Lived Access Tokens**

```typescript
// OAuth server configuration
{
  accessTokenTTL: 3600,      // 1 hour
  refreshTokenTTL: 2592000   // 30 days
}
```

**4. Implement Token Revocation**

```typescript
// Revoke endpoint
app.post('/oauth/revoke', async (req, res) => {
  const { token, token_type_hint } = req.body;

  if (token_type_hint === 'access_token') {
    await revokeAccessToken(token);
  } else {
    await revokeRefreshToken(token);
  }

  res.status(200).send();
});
```

**5. Log Authentication Events**

```typescript
// Log OAuth events
logger.info('OAuth authorization started', {
  client_id: clientId,
  scopes: requestedScopes,
  user_id: userId,
  ip: req.ip
});

logger.info('OAuth token issued', {
  client_id: clientId,
  token_id: tokenId,
  expires_at: expiresAt
});
```

---

## Troubleshooting OAuth Issues

### Common Problems

#### Issue: "Browser doesn't open during authentication"

**Symptoms:**
- OAuth flow initiated but browser doesn't launch
- Terminal shows authentication URL but nothing happens

**Solutions:**

1. **Copy URL manually:**
```
Copy the displayed URL and paste into browser
```

2. **Check default browser:**
```bash
# macOS
open https://auth-url-here

# Linux
xdg-open https://auth-url-here

# Windows
start https://auth-url-here
```

3. **Verify URL handler registration:**
```bash
# macOS - check if cursor:// protocol registered
open cursor://test

# Should launch Cursor or show handler error
```

#### Issue: "Invalid redirect URI" error

**Symptoms:**
- OAuth provider shows "Redirect URI mismatch"
- Authentication fails after user grants permissions

**Solutions:**

1. **Verify redirect URI in OAuth app settings:**
   - Must exactly match client expectation
   - Check for trailing slashes, protocol, port
   - Cursor: `cursor://anysphere.cursor-mcp/oauth/callback`

2. **Check client configuration:**
```json
// Ensure redirect_uri not hardcoded incorrectly
{
  "auth": {
    "redirect_uri": "cursor://anysphere.cursor-mcp/oauth/callback"
  }
}
```

#### Issue: "Token expired" or "401 Unauthorized"

**Symptoms:**
- API requests fail with 401
- MCP tools return authentication errors
- Previously working server stops functioning

**Solutions:**

1. **Force token refresh:**
```
> /mcp
# Select server → Clear authentication → Re-authenticate
```

2. **Check token expiry:**
```bash
# Gemini CLI - inspect token file
cat ~/.config/gemini/credentials/SERVER_NAME.json | jq '.expires_at'

# Compare to current time
date +%s
```

3. **Verify refresh token not revoked:**
   - Check provider's authorized apps
   - Ensure app not removed/revoked
   - Re-authorize if necessary

#### Issue: "Insufficient scope" error

**Symptoms:**
- Authentication succeeds but API calls fail
- Error message mentions missing permissions

**Solutions:**

1. **Review requested scopes:**
```json
{
  "scopes": [
    "repo:read",
    "repo:write",  // Add missing scope
    "user:email"
  ]
}
```

2. **Re-authenticate with new scopes:**
   - Clear existing authentication
   - Update scope configuration
   - Re-authenticate to grant new permissions

3. **Check provider's scope documentation:**
   - GitHub: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
   - Google: https://developers.google.com/identity/protocols/oauth2/scopes

#### Issue: "PKCE verification failed"

**Symptoms:**
- OAuth flow fails during code exchange
- Error mentions "code challenge" or "code verifier"

**Solutions:**

1. **Verify PKCE implementation:**
```typescript
// Ensure verifier and challenge match
const verifier = generateCodeVerifier();
const challenge = sha256(verifier);

// Use same verifier in token exchange
```

2. **Check provider supports PKCE:**
   - Some providers require PKCE
   - Others make it optional
   - Verify in provider documentation

#### Issue: Google Cloud "Permission denied" (Gemini CLI)

**Symptoms:**
- Service account impersonation fails
- IAP-protected server unreachable

**Solutions:**

1. **Verify IAM permissions:**
```bash
# Check if user has TokenCreator role
gcloud iam service-accounts get-iam-policy \
  SERVICE_ACCOUNT_EMAIL \
  --format=json | jq '.bindings'
```

2. **Grant missing permissions:**
```bash
gcloud iam service-accounts add-iam-policy-binding \
  SERVICE_ACCOUNT_EMAIL \
  --member="user:YOUR_EMAIL" \
  --role="roles/iam.serviceAccountTokenCreator"
```

3. **Verify IAP access:**
```bash
gcloud iap web get-iam-policy \
  --resource-type=backend-services \
  --service=SERVICE_NAME
```

---

## Provider-Specific Guides

### GitHub OAuth Setup

**1. Create OAuth App**

1. Navigate to: Settings → Developer settings → OAuth Apps → New OAuth App
2. Configure:
   - **Application name**: "MCP Integration"
   - **Homepage URL**: `https://yourcompany.com`
   - **Authorization callback URL**: Platform-specific redirect URI
   - **Description**: "MCP server access to GitHub"

**2. Available Scopes**

| Scope | Description | Use Case |
|-------|-------------|----------|
| `repo` | Full repository access | Read/write repositories, issues, PRs |
| `repo:status` | Commit status access | Update CI/CD status |
| `public_repo` | Public repository access | Read-only public repos |
| `user` | User profile access | Read user information |
| `user:email` | User email access | Get user email addresses |
| `read:org` | Organization access | List organization repos |
| `workflow` | GitHub Actions access | Trigger workflows |

**3. Configuration Example**

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "auth": {
        "CLIENT_ID": "${env:GITHUB_CLIENT_ID}",
        "CLIENT_SECRET": "${env:GITHUB_CLIENT_SECRET}",
        "scopes": ["repo", "user:email", "read:org"]
      }
    }
  }
}
```

### Google OAuth Setup

**1. Create OAuth Client**

1. Navigate to: Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Configure:
   - **Application type**: Choose based on platform
   - **Name**: "MCP Server Client"
   - **Authorized redirect URIs**: Platform-specific redirect

**2. Common Scopes**

| Scope | Description |
|-------|-------------|
| `https://www.googleapis.com/auth/userinfo.email` | User email |
| `https://www.googleapis.com/auth/userinfo.profile` | User profile |
| `https://www.googleapis.com/auth/drive.readonly` | Read Drive files |
| `https://www.googleapis.com/auth/gmail.send` | Send emails |
| `https://www.googleapis.com/auth/calendar` | Calendar access |
| `https://www.googleapis.com/auth/cloud-platform` | Google Cloud |

**3. Gemini CLI Configuration**

```json
{
  "mcpServers": {
    "google-workspace": {
      "httpUrl": "https://mcp-server.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/drive.readonly"
        ]
      }
    }
  }
}
```

### Slack OAuth Setup

**1. Create Slack App**

1. Navigate to: api.slack.com/apps → Create New App
2. Select "From scratch"
3. Configure OAuth & Permissions:
   - Add redirect URLs
   - Select scopes

**2. Available Scopes**

| Scope | Description |
|-------|-------------|
| `channels:read` | View channels |
| `channels:write` | Create/manage channels |
| `chat:write` | Send messages |
| `files:read` | Read file content |
| `users:read` | View users |

**3. Configuration Example**

```json
{
  "mcpServers": {
    "slack": {
      "url": "https://mcp.slack.com/api",
      "auth": {
        "CLIENT_ID": "${env:SLACK_CLIENT_ID}",
        "CLIENT_SECRET": "${env:SLACK_CLIENT_SECRET}",
        "scopes": [
          "channels:read",
          "chat:write",
          "users:read"
        ]
      }
    }
  }
}
```

---

## Related Resources

### In This Repository

- `docs/modules/mcp/01-fundamentals/what-is-mcp.md` - MCP introduction
- `docs/modules/mcp/03-creating-servers/project-structure/server-architecture.md` - Server development
- `docs/modules/mcp/04-platform-guides/claude-code/configuration.md` - Claude Code setup
- `docs/modules/mcp/04-platform-guides/cursor/configuration.md` - Cursor setup
- `docs/modules/mcp/04-platform-guides/gemini-cli/configuration.md` - Gemini CLI setup

### External Resources

- **OAuth 2.0 Specification**: [oauth.net/2/](https://oauth.net/2/)
- **PKCE RFC**: [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- **GitHub OAuth**: [docs.github.com/en/apps/oauth-apps](https://docs.github.com/en/apps/oauth-apps)
- **Google OAuth**: [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)
- **MCP Specification**: [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)

---

**Last Updated:** February 2026
**Category:** MCP Authentication
**Applies To:** Claude Code, Cursor, Gemini CLI
**Protocol Version:** MCP 1.0
