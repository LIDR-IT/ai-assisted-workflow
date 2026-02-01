# Commit Message Examples

Real-world examples of good commit messages following conventional commits format.

## Simple Commits

### Feature Addition

```
feat(auth): add login endpoint
```

```
feat(ui): add dark mode toggle
```

```
feat(api): implement rate limiting
```

### Bug Fixes

```
fix(auth): resolve session timeout issue
```

```
fix(ui): correct button alignment on mobile
```

```
fix(api): handle null values in user endpoint
```

### Documentation

```
docs(api): add authentication examples
```

```
docs(readme): update installation instructions
```

```
docs: fix typos in contributing guide
```

## Commits with Body

### Feature with Explanation

```
feat(auth): add JWT token validation

Implement middleware to validate JWT tokens on protected routes.
Tokens are verified using the secret key from environment variables.
Expired tokens are rejected with 401 status.
```

### Bug Fix with Context

```
fix(database): resolve connection pool exhaustion

Database connections were not being released properly after queries,
causing the pool to exhaust under high load. Added explicit connection
release in finally blocks and reduced pool timeout from 30s to 10s.

Performance testing shows 40% improvement under concurrent load.
```

### Refactoring

```
refactor(auth): extract token validation logic

Extract JWT validation into separate utility function for better
testability and reuse. No behavior changes, pure code organization.
```

## Commits with Footers

### Breaking Change

```
feat(api): change user endpoint response format

User API endpoints now return data in { data: user } envelope format
instead of returning user object directly.

BREAKING CHANGE: All user endpoints changed response format.
Clients must update to access user data via response.data instead
of using response directly.

Migration guide: docs/migration/v2-user-api.md

Closes: #234
```

### With Issue References

```
fix(api): prevent memory leak in event listeners

Event listeners were not being properly removed when components
unmounted, causing memory to accumulate over time.

Fixes: #567
Refs: #543
```

### With Co-Authors

```
feat(payments): integrate Stripe payment gateway

Implement complete Stripe integration for payment processing:
- Card tokenization
- Payment intent creation
- Webhook handling for async events
- Subscription management

Co-Authored-By: Alice Smith <alice@example.com>
Co-Authored-By: Bob Jones <bob@example.com>

Closes: #789
```

## Dependency Updates

### Simple Update

```
chore(deps): update React to v18.2.0
```

### Update with Breaking Changes

```
chore(deps): update Express to v5.0.0

Update Express from v4.18.0 to v5.0.0.

Breaking changes handled:
- Updated middleware signatures
- Migrated to new router syntax
- Updated error handling

BREAKING CHANGE: Requires Node.js 14+ (previously 12+)

Refs: #456
```

### Security Update

```
chore(deps): update lodash to fix security vulnerability

Update lodash from 4.17.20 to 4.17.21 to address prototype pollution
vulnerability.

Security advisory: GHSA-xxxx-yyyy-zzzz
CVE-2021-23337

Fixes: #890
```

## Configuration Changes

### CI/CD

```
chore(ci): add automated deployment workflow

Add GitHub Actions workflow for automatic deployment to staging
environment on push to main branch.

Workflow includes:
- Automated tests
- Build verification
- Deployment to staging
- Slack notification on failure

Refs: #345
```

### Build Configuration

```
chore(build): optimize webpack bundle size

Configure webpack to:
- Enable tree shaking for unused exports
- Split vendor bundle from app code
- Enable compression plugins

Bundle size reduced from 2.4MB to 890KB (-63%).

Refs: #678
```

## Performance Improvements

### Database Optimization

```
perf(database): optimize user query with indexes

Added composite index on (email, created_at) for user table.
Reduces user search query time from 850ms to 45ms on dataset
of 1 million users.

Performance testing results: docs/perf/user-query-optimization.md

Refs: #234
```

### Frontend Optimization

```
perf(ui): implement virtual scrolling for large lists

Replace standard list rendering with virtual scrolling using
react-window. Only renders visible items plus small buffer.

Improves initial render time from 3.2s to 180ms for 10k items.
Memory usage reduced by 85%.

Closes: #567
```

## Test Additions

### Unit Tests

```
test(auth): add unit tests for token validation

Add comprehensive unit tests for JWT validation logic:
- Valid token scenarios
- Expired token handling
- Invalid signature detection
- Malformed token handling

Test coverage for auth module increased from 65% to 92%.
```

### Integration Tests

```
test(api): add integration tests for user endpoints

Add end-to-end integration tests covering:
- User creation with validation
- User retrieval and pagination
- User update with partial data
- User deletion with cascade

All tests use isolated test database with fixtures.

Refs: #890
```

## Documentation Updates

### API Documentation

```
docs(api): document authentication flow

Add comprehensive authentication documentation:
- Login/logout flows
- Token refresh mechanism
- Error handling
- Code examples in multiple languages

Documentation published to: https://api-docs.example.com/auth

Closes: #234
```

### README Update

```
docs(readme): add Docker setup instructions

Add step-by-step instructions for running application in Docker:
- Prerequisites
- Building images
- Running containers
- Environment configuration
- Troubleshooting

Refs: #567
```

## Refactoring

### Code Organization

```
refactor(api): reorganize endpoint structure

Reorganize API endpoints into feature-based structure:
- /auth/* -> auth/routes.js
- /users/* -> users/routes.js
- /posts/* -> posts/routes.js

No behavior changes, pure file organization.
```

### Extract Common Logic

```
refactor(utils): extract date formatting utilities

Extract date formatting logic used across multiple components
into shared utilities module. Removes code duplication and
centralizes date handling.

Functions extracted:
- formatRelativeTime()
- formatShortDate()
- formatLongDate()
```

## Multi-Line Messages

### Complex Feature

```
feat(api): add comprehensive user management system

Implement complete user management functionality:

**User Operations:**
- Create user with email verification
- Update user profile and preferences
- Soft delete with data retention
- Account recovery workflow

**Admin Operations:**
- User search and filtering
- Bulk operations
- Activity monitoring
- Role assignment

**Security:**
- Rate limiting on all endpoints
- Input validation with Joi schemas
- SQL injection prevention
- XSS protection

**Performance:**
- Pagination on list endpoints
- Caching frequently accessed data
- Optimized database queries

All operations logged for audit trail.

BREAKING CHANGE: User API endpoints moved from /api/v1/user to
/api/v2/users with new response format.

Migration guide: docs/migration/v2-users.md

Closes: #123, #456, #789
Refs: #234, #567
Co-Authored-By: Alice Smith <alice@example.com>
```

### Large Refactoring

```
refactor(codebase): migrate to TypeScript

Complete migration from JavaScript to TypeScript:

**Completed:**
- Added TypeScript configuration
- Migrated all source files (src/*)
- Added type definitions
- Updated build process
- Migrated tests
- Updated documentation

**Type Safety Improvements:**
- Strict null checks enabled
- No implicit any
- Strict property initialization
- All external dependencies typed

**Developer Experience:**
- IntelliSense support
- Compile-time error detection
- Better refactoring tools
- Improved documentation

Build time increased by ~20% but development experience and code
quality improvements justify the trade-off.

BREAKING CHANGE: Requires TypeScript-aware tooling for development.

Migration guide: docs/migration/typescript.md

Closes: #234
Refs: #567, #890, #123
```

## Security Fixes

### Vulnerability Fix

```
fix(auth): prevent timing attack on password comparison

Replace string equality check with constant-time comparison
using crypto.timingSafeEqual() to prevent timing attacks
that could leak information about password validity.

Security advisory: Internal security audit finding #45

Refs: #678
```

### XSS Prevention

```
fix(ui): sanitize user input to prevent XSS

Add DOMPurify sanitization to all user-generated content
before rendering to prevent XSS attacks. Applied to:
- User comments
- Profile descriptions
- Post content
- Search queries

Security audit finding resolved.

Fixes: #890
```

## Hotfix Examples

### Critical Production Bug

```
fix(api): resolve payment processing failure

Payment API was returning 500 error due to null reference
when processing refunds. Added null check and proper error
handling.

CRITICAL: This is a hotfix for production issue affecting
payment processing. Must be deployed immediately.

Fixes: #HOTFIX-234
Refs: #567
```

### Emergency Rollback

```
Revert "feat(api): add new caching layer"

This reverts commit abc123def456.

The caching layer is causing intermittent data inconsistencies
in production. Rolling back while we investigate the root cause.

This is an emergency production rollback.

Refs: #INCIDENT-890
```

## Style/Format Changes

### Code Formatting

```
style(codebase): apply Prettier formatting

Apply Prettier auto-formatting to entire codebase for
consistent code style. No logic changes.

Configuration:
- 2 space indentation
- Single quotes
- Semicolons
- Trailing commas

Refs: #456
```

### Linting

```
style(api): fix ESLint warnings

Resolve all ESLint warnings in API module:
- Unused variables removed
- Consistent naming conventions
- Proper const/let usage
- Arrow function preferences

No behavior changes, pure style cleanup.
```

## Chore Examples

### Dependency Cleanup

```
chore: remove unused dependencies

Remove packages that are no longer used:
- lodash (replaced with native methods)
- moment (replaced with date-fns)
- request (replaced with axios)

Bundle size reduced by 280KB.
```

### CI Improvement

```
chore(ci): add PR validation checks

Add automated checks for pull requests:
- Lint check
- Type check
- Unit tests
- Integration tests
- Build verification

PRs cannot be merged until all checks pass.

Refs: #234
```

## Real Project Examples

### From This Project

```
feat(commands): add /commit command for conventional commits

Implement /commit command with hybrid mode supporting both quick
commits with arguments and guided mode with AI suggestions.

Features:
- Validates conventional commit format
- Guides users through commit creation when no message provided
- Analyzes staged changes and suggests appropriate messages
- Restricted to git commands only (Bash(git:*))
- Synced to all platforms: Cursor, Claude Code, Gemini, Antigravity

Files:
- .agents/commands/commit.md - Command source definition
- .gemini/commands/commit.toml - Auto-generated TOML for Gemini
- .agent/workflows/commit.md - Symlink for Antigravity
- TODO.md - Marked task as completed

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
feat(docs): add improve-docs command and extension reference

Add /improve-docs command for automated documentation auditing
and quick reference guide for Claude Code extensions.

- improve-docs.md: Command to analyze and enhance project docs
- claude-code-extensions.md: Reference for skills, commands, agents, hooks, MCP
- Synced to all platform directories (.agent, .cursor)
- Follows project documentation and extension standards

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Bad Examples (Anti-Patterns)

### Too Vague

```
❌ fix: bug fixes
❌ feat: updates
❌ chore: changes
```

**Better:**
```
✅ fix(auth): resolve session timeout issue
✅ feat(api): add user authentication
✅ chore(deps): update React to v18
```

### Wrong Tense

```
❌ feat: added login feature
❌ fix: fixed the bug
❌ docs: updated README
```

**Better:**
```
✅ feat: add login feature
✅ fix: resolve the bug
✅ docs: update README
```

### Multiple Unrelated Changes

```
❌ feat: add login, fix typo, update docs
```

**Better:** Separate commits
```
✅ feat(auth): add login feature
✅ fix(docs): correct typo in README
✅ docs(api): update authentication guide
```

### Too Long Subject

```
❌ feat(auth): add comprehensive user authentication system with JWT tokens, password reset, email verification, and remember me functionality
```

**Better:** Use body for details
```
✅ feat(auth): add user authentication system

Implement authentication with JWT tokens, password reset,
email verification, and remember me functionality.

Refs: #123
```

---

**Use these examples as templates for your own commit messages!**
