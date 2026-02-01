# Conventional Commits Specification

Complete reference for the Conventional Commits format used in this project.

## Specification

Based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)

### Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Type

**Required.** Must be one of:

### Primary Types

**`feat`** - New feature
- Adds new functionality
- User-facing improvements
- API additions
- Examples:
  - `feat(auth): add password reset flow`
  - `feat: implement dark mode`

**`fix`** - Bug fix
- Fixes broken functionality
- Patches security vulnerabilities
- Resolves errors
- Examples:
  - `fix(api): handle null pointer in user endpoint`
  - `fix: prevent memory leak in event listeners`

**`docs`** - Documentation
- Documentation-only changes
- README updates
- Code comments
- API documentation
- Examples:
  - `docs(api): update authentication examples`
  - `docs: add setup instructions for Windows`

### Supporting Types

**`refactor`** - Code restructuring
- No behavior change
- Code cleanup
- Performance improvements (without user-facing changes)
- Examples:
  - `refactor(auth): simplify token validation logic`
  - `refactor: extract common utility functions`

**`test`** - Tests
- Adding tests
- Updating tests
- Test infrastructure
- Examples:
  - `test(auth): add integration tests for login`
  - `test: improve test coverage for utils`

**`chore`** - Maintenance
- Dependency updates
- Build configuration
- Tool configuration
- Release tasks
- Examples:
  - `chore: update dependencies`
  - `chore(ci): add GitHub Actions workflow`

**`perf`** - Performance
- User-facing performance improvements
- Optimization
- Examples:
  - `perf(database): optimize user query with index`
  - `perf: reduce bundle size by 30%`

**`style`** - Formatting
- Code style/formatting only
- No logic changes
- Whitespace, semicolons, etc.
- Examples:
  - `style: fix indentation in auth module`
  - `style: apply Prettier formatting`

## Scope

**Optional.** Specifies the area of change.

### Common Scopes

**Component/Module:**
- `auth` - Authentication module
- `api` - API layer
- `database` - Database layer
- `ui` - User interface
- `config` - Configuration

**Feature Area:**
- `login` - Login feature
- `signup` - Signup feature
- `profile` - User profile

**Technology:**
- `react` - React components
- `express` - Express backend
- `postgres` - PostgreSQL database

**Project Area:**
- `docs` - Documentation
- `ci` - Continuous integration
- `deps` - Dependencies

### Scope Guidelines

- Use lowercase
- Be consistent across project
- Keep scopes granular but not too specific
- Avoid abbreviations unless well-known

### Examples

```
feat(auth): add JWT validation
fix(api): resolve timeout issue
docs(readme): update installation steps
refactor(database): simplify connection pool
test(auth): add login integration tests
chore(deps): update React to v18
```

## Description

**Required.** Brief summary of the change.

### Rules

1. **Imperative mood**
   - ✅ "add feature"
   - ❌ "added feature"
   - ❌ "adds feature"

2. **Lowercase** (after type and scope)
   - ✅ `feat: add login`
   - ❌ `feat: Add login`

3. **No period** at the end
   - ✅ `feat: add login`
   - ❌ `feat: add login.`

4. **Length limit: 50 characters**
   - Keep it concise
   - Details go in body

5. **Be specific**
   - ✅ `feat(auth): add password reset via email`
   - ❌ `feat: updates`

### Good Examples

```
feat(api): add user authentication endpoint
fix(database): resolve connection pool exhaustion
docs(api): document authentication flow
refactor(auth): extract token validation logic
test(api): add integration tests for user CRUD
chore(deps): update Express to v5
perf(database): optimize user query with index
style(auth): apply consistent formatting
```

### Bad Examples

```
❌ feat: Added new feature
   (past tense, capitalized)

❌ fix: bug fixes
   (too vague)

❌ updates
   (missing type)

❌ feat: Add user authentication endpoint and update documentation and refactor login
   (too long, multiple changes)

❌ feat: add feature.
   (has period)
```

## Body

**Optional.** Provides detailed explanation.

### When to Include Body

Include body when:
- Change needs explanation beyond subject
- Context is important
- Impact is significant
- Multiple related changes

### Body Guidelines

1. **Separate from subject** with blank line
2. **Wrap at 72 characters** per line
3. **Explain WHAT and WHY**, not HOW
4. **Use bullet points** for multiple items
5. **Be concise** but complete

### Example with Body

```
feat(auth): add JWT token validation

Implement middleware to validate JWT tokens on protected routes.
Tokens are verified using the secret key from environment variables.
Expired tokens are rejected with 401 status.

This enables secure authentication for all API endpoints without
requiring session storage.
```

### Multiple Paragraphs

```
fix(database): resolve connection pool exhaustion

Database connections were not being released properly after queries,
causing the pool to exhaust under high load.

Changes:
- Added explicit connection release in finally blocks
- Reduced pool timeout from 30s to 10s
- Added connection pool monitoring

Performance testing shows 40% improvement under concurrent load.
```

## Footer

**Optional.** Metadata about the commit.

### Breaking Changes

**Format:**
```
BREAKING CHANGE: description
```

**Full example:**
```
feat(api): change user endpoint response format

BREAKING CHANGE: User API now returns { data: user } instead of
direct user object. Update all API clients to access user.data.
```

**Multiple breaking changes:**
```
BREAKING CHANGE: Authentication now requires API key in header
BREAKING CHANGE: User endpoint response format changed
```

### Issue References

**Formats:**
```
Refs: #123
Closes: #456
Fixes: #789
Resolves: #101
```

**Examples:**
```
fix(api): resolve timeout on user endpoint

Added retry logic with exponential backoff.

Fixes: #234
Refs: #567
```

**GitHub keywords** (auto-close issues):
- `Closes: #123`
- `Fixes: #123`
- `Resolves: #123`

### Co-Authors

**Format:**
```
Co-Authored-By: Name <email@example.com>
```

**Example:**
```
feat(feature): implement collaborative feature

Implemented during pair programming session.

Co-Authored-By: Alice Smith <alice@example.com>
Co-Authored-By: Bob Jones <bob@example.com>
```

**Project standard for AI assistance:**
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Multiple Footers

```
feat(auth): add SSO integration

Implement Single Sign-On using OAuth 2.0.

BREAKING CHANGE: Authentication flow changed to OAuth
Closes: #123
Refs: #456
Co-Authored-By: Alice Smith <alice@example.com>
```

## Complete Examples

### Simple Commit

```
feat(auth): add login endpoint
```

### Commit with Body

```
fix(database): resolve connection timeout

Connection pool was exhausting under high load due to connections
not being released properly. Added explicit release in finally
blocks and reduced timeout to 10s.

Refs: #234
```

### Commit with Breaking Change

```
feat(api): redesign authentication API

Complete redesign of authentication API to use JWT tokens instead
of session-based authentication.

BREAKING CHANGE: All authentication endpoints changed. Clients must
update to use /auth/login instead of /session/create and include
JWT token in Authorization header for subsequent requests.

Migration guide: docs/migration/v2-auth.md

Closes: #567
Refs: #543
```

### Complex Commit

```
feat(api): add user management endpoints

Implement CRUD operations for user management:
- GET /users - List all users with pagination
- GET /users/:id - Get single user
- POST /users - Create new user
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

All endpoints require admin authentication and include rate
limiting (100 requests per hour). Input validation uses Joi
schemas with detailed error messages.

Closes: #789
Refs: #123, #456
Co-Authored-By: Alice Smith <alice@example.com>
```

## Anti-Patterns

### Vague Messages

```
❌ feat: updates
❌ fix: bug fixes
❌ chore: changes
```

**Instead:**
```
✅ feat(auth): add password reset flow
✅ fix(api): handle null user in endpoint
✅ chore(deps): update React to v18
```

### Multiple Unrelated Changes

```
❌ feat: add login, update docs, fix typo
```

**Instead:** Create separate commits
```
✅ feat(auth): add login endpoint
✅ docs(api): update authentication guide
✅ fix(docs): correct typo in README
```

### Wrong Tense

```
❌ feat: added login
❌ fix: fixed bug
❌ docs: updated README
```

**Instead:**
```
✅ feat: add login
✅ fix: resolve bug
✅ docs: update README
```

### Too Long Subject

```
❌ feat(auth): add comprehensive user authentication system with JWT tokens, password reset, email verification, and remember me functionality
```

**Instead:** Use body for details
```
✅ feat(auth): add user authentication system

Implement comprehensive authentication with:
- JWT token-based sessions
- Password reset via email
- Email verification on signup
- Remember me functionality

Refs: #123
```

## Validation Checklist

Before committing, verify:

- [ ] **Type** is one of: feat, fix, docs, refactor, test, chore, perf, style
- [ ] **Scope** (if used) is lowercase and relevant
- [ ] **Description** uses imperative mood ("add" not "added")
- [ ] **Description** is lowercase after type
- [ ] **Description** has no period at end
- [ ] **Description** is under 50 characters
- [ ] **Body** (if used) is separated by blank line
- [ ] **Body** (if used) is wrapped at 72 characters
- [ ] **Body** explains WHY, not HOW
- [ ] **Breaking changes** use `BREAKING CHANGE:` footer
- [ ] **Issue references** use proper format (Refs, Closes, Fixes)
- [ ] **Co-authors** use proper format if applicable

## Tools

### Commitlint

Check commit message format:
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

### Commitizen

Interactive commit message builder:
```bash
npm install --save-dev commitizen cz-conventional-changelog
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

### Git Hooks

Validate commits automatically:
```bash
npm install --save-dev husky
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## Resources

- **Specification:** https://www.conventionalcommits.org/
- **Angular Convention:** https://github.com/angular/angular/blob/main/CONTRIBUTING.md
- **Semantic Versioning:** https://semver.org/
- **Project Git Workflow:** `.agents/rules/process/git-workflow.md`
