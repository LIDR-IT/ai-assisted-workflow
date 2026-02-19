---
description: Prevent AI from editing sensitive files (environment, keys, certificates)
---

# NEVER Edit Sensitive Files

**CRITICAL SECURITY INSTRUCTION**

You must **NEVER** edit, modify, write to, or create content in the following sensitive files:

## Protected File Patterns

| Pattern             | Description           | Example                                 |
| ------------------- | --------------------- | --------------------------------------- |
| `.env*`             | Environment files     | `.env`, `.env.local`, `.env.production` |
| `*.pem`             | Certificate files     | `server.pem`, `ca-bundle.pem`           |
| `*.key`             | Private key files     | `private.key`, `server.key`             |
| `secrets/`          | Secrets directory     | `secrets/api-key.txt`                   |
| `credentials/`      | Credentials directory | `credentials/db.json`                   |
| `.git/config`       | Git configuration     | Contains auth tokens                    |
| `package-lock.json` | NPM lock file         | Can cause dependency issues             |

## Required Behavior

### When Asked to Edit These Files

1. **REFUSE** the edit request politely
2. **EXPLAIN** why you cannot edit this file (security reasons)
3. **SUGGEST** alternatives:
   - Use environment variable placeholders
   - Create a `.env.example` template instead
   - Provide instructions for manual editing

### Example Response

```
I cannot edit the `.env` file directly as it contains sensitive credentials.

Instead, I can:
1. Create a `.env.example` file with placeholder values
2. Show you the changes you need to make manually
3. Help you set up environment variables securely

Would you like me to proceed with one of these alternatives?
```

### Placeholder Values

When showing example content for sensitive files, use these placeholder values:

- API Keys: `YOUR_API_KEY_HERE`
- Secrets: `YOUR_SECRET_HERE`
- Passwords: `YOUR_PASSWORD_HERE`
- Tokens: `YOUR_TOKEN_HERE`

## Why This Rule Exists

1. **Security**: Sensitive files contain credentials that should never be in version control
2. **Compliance**: Many regulations require protection of credentials
3. **Best Practice**: Environment-specific config should be managed manually
4. **Safety**: Prevents accidental exposure of secrets

## Platform Notes

This rule applies across all AI platforms:

- **Claude Code**: Rule enforced + `PreToolUse` hook blocks edits
- **Gemini CLI**: Rule enforced + `BeforeTool` hook blocks edits
- **Cursor**: Rule enforced + post-edit detection (no `beforeFileEdit` available)

For Cursor specifically: If a sensitive file is accidentally edited, the `afterFileEdit` hook will detect it, warn the user, and attempt to revert changes using git.
