# Commit Patterns and Best Practices

Common commit scenarios and recommended patterns for this project.

## Atomic Commit Patterns

### Pattern 1: Feature Development

**Scenario:** Building a new feature with multiple components

**Anti-pattern:**

```
❌ feat: add user management feature
   (one huge commit with API, UI, tests, docs)
```

**Best practice:**

```
✅ feat(api): add user endpoints
✅ feat(ui): add user management page
✅ test(api): add user endpoint tests
✅ test(ui): add user page tests
✅ docs(api): document user endpoints
```

**Rationale:**

- Each commit is independently revertable
- Clear progression of work
- Easier code review
- Better git bisect for finding bugs

### Pattern 2: Bug Fix

**Scenario:** Fixing a bug that requires multiple file changes

**Anti-pattern:**

```
❌ fix: various bug fixes
   (multiple unrelated fixes in one commit)
```

**Best practice:**

```
✅ fix(auth): resolve session timeout issue

Session tokens were expiring too quickly due to incorrect
timestamp calculation. Changed from seconds to milliseconds.

Fixes: #234
```

**Rationale:**

- Single, focused fix
- Clear cause and solution
- Links to issue tracker
- Future developers understand the fix

### Pattern 3: Refactoring

**Scenario:** Improving code structure

**Anti-pattern:**

```
❌ refactor: improve code and add new feature
   (mixing refactor with feature)
```

**Best practice:**

```
✅ refactor(auth): extract token validation logic
✅ feat(auth): add token refresh endpoint
```

**Rationale:**

- Separate behavioral changes from structure changes
- Easier to review
- Can revert refactor without losing feature

### Pattern 4: Breaking Change

**Scenario:** API change that breaks backward compatibility

**Pattern:**

```
feat(api): redesign authentication endpoints

Complete redesign of authentication API for better security
and improved developer experience.

Changes:
- /auth/login now returns JWT instead of session cookie
- /auth/refresh endpoint added for token refresh
- /auth/logout now requires token in header

BREAKING CHANGE: Authentication flow completely changed.
Clients must migrate to JWT-based authentication.

Migration guide: docs/migration/v2-auth.md

Closes: #567
```

**Key elements:**

- `BREAKING CHANGE:` footer (triggers major version bump)
- Clear explanation of what changed
- Migration instructions or documentation link
- Issue reference

### Pattern 5: Multi-Part Feature

**Scenario:** Large feature requiring multiple phases

**Anti-pattern:**

```
❌ Create one massive commit
❌ Create many tiny WIP commits
```

**Best practice:**

```
Phase 1: Foundation
✅ feat(database): add user preferences schema
✅ feat(api): add preferences CRUD endpoints

Phase 2: Business Logic
✅ feat(api): add preferences validation
✅ feat(api): add default preferences loader

Phase 3: Integration
✅ feat(ui): add preferences page
✅ feat(ui): integrate with API

Phase 4: Polish
✅ test(api): add preferences tests
✅ test(ui): add preferences page tests
✅ docs(api): document preferences endpoints
```

**Rationale:**

- Logical progression
- Each commit builds on previous
- Can release incrementally if needed
- Clear story in git history

## Message Patterns

### Pattern: Dependency Update

```
chore(deps): update React to v18.2.0

Update React and React-DOM from v17.0.2 to v18.2.0.

Changes required:
- Updated ReactDOM.render to createRoot
- Migrated to new JSX transform
- Updated related type definitions

Refs: #456
```

### Pattern: Configuration Change

```
chore(ci): add automated deployment workflow

Add GitHub Actions workflow for automatic deployment to staging
environment on push to main branch.

Workflow includes:
- Automated tests
- Build verification
- Deployment to staging
- Slack notification

Refs: #789
```

### Pattern: Documentation Update

```
docs(api): add authentication examples

Add comprehensive examples for authentication flow:
- Login with email/password
- Token refresh
- Logout
- Error handling

Closes: #234
```

### Pattern: Performance Improvement

```
perf(database): optimize user query with indexes

Added composite index on (email, created_at) for user table.
Reduces user search query time from 850ms to 45ms on 1M records.

Performance testing results: docs/perf/user-query-optimization.md

Refs: #567
```

### Pattern: Security Fix

```
fix(auth): prevent SQL injection in login endpoint

Sanitize user input before database query to prevent SQL injection
attacks. Replaced string concatenation with parameterized queries.

Security advisory: GHSA-xxxx-yyyy-zzzz
Fixes: #901
```

### Pattern: Test Addition

```
test(api): add integration tests for user endpoints

Add comprehensive integration tests covering:
- User creation with validation
- User retrieval and pagination
- User update with partial data
- User deletion with cascade

Test coverage increased from 65% to 89% for user module.
```

### Pattern: Build/Tooling Change

```
chore(build): optimize webpack bundle size

Configure webpack to:
- Enable tree shaking for unused exports
- Split vendor bundle from app code
- Enable compression plugins

Bundle size reduced from 2.4MB to 890KB (-63%).

Refs: #345
```

## Commit Timing Patterns

### When to Commit

**DO commit when:**

- ✅ Completed a logical unit of work
- ✅ Tests are passing
- ✅ Code compiles/runs successfully
- ✅ Before switching to different task
- ✅ End of work session

**DON'T commit when:**

- ❌ Code doesn't compile
- ❌ Tests are failing (unless explicitly WIP)
- ❌ In the middle of refactoring
- ❌ Contains debugging code

### Frequency

**Too frequent:**

```
❌ feat: add file
❌ feat: add another file
❌ feat: fix typo
❌ feat: fix another typo
```

**Too infrequent:**

```
❌ feat: complete entire feature (500 files changed)
```

**Just right:**

```
✅ feat(api): add user endpoint structure
✅ feat(api): add validation logic
✅ feat(api): add error handling
✅ test(api): add endpoint tests
```

**Guideline:** Commit when you can write a clear, single-purpose message

## Co-Author Patterns

### Pattern: Pair Programming

```
feat(feature): implement collaborative feature

Implemented during pair programming session with focus on
test-driven development and clean code principles.

Co-Authored-By: Alice Smith <alice@example.com>
```

### Pattern: AI Assistance

**Project standard:**

```
feat(commands): add /commit command for conventional commits

Implement /commit command with hybrid mode supporting both quick
commits with arguments and guided mode with AI suggestions.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**When to include:**

- Significant AI-generated code
- AI-designed architecture
- Complex AI-assisted refactoring

**Optional for:**

- Minor AI suggestions
- Code completion
- Simple fixes

### Pattern: Multiple Contributors

```
feat(feature): implement complex feature

Major feature requiring expertise from multiple team members.

Implementation details:
- Backend API by Alice
- Frontend UI by Bob
- Database schema by Charlie

Co-Authored-By: Alice Smith <alice@example.com>
Co-Authored-By: Bob Jones <bob@example.com>
Co-Authored-By: Charlie Brown <charlie@example.com>
```

## Scope Patterns

### Consistent Scopes

Define and use consistent scopes across project:

**Technology scopes:**

```
api      - Backend API
ui       - Frontend UI
database - Database layer
auth     - Authentication
```

**Feature scopes:**

```
users    - User management
posts    - Post features
comments - Comment features
```

**Infrastructure scopes:**

```
ci       - Continuous integration
deploy   - Deployment
config   - Configuration
```

### Scope Granularity

**Too broad:**

```
❌ feat(app): add feature
```

**Too specific:**

```
❌ feat(LoginButtonComponent): change color
```

**Just right:**

```
✅ feat(auth): add login functionality
✅ style(ui): update button colors
```

## History Patterns

### Linear History (Recommended)

**Pattern:** Use rebase to maintain linear history

```bash
# Update main
git checkout main
git pull

# Rebase feature branch
git checkout feature
git rebase main

# Resolve conflicts if any
git add .
git rebase --continue

# Push (force if already pushed)
git push --force-with-lease
```

**Result:** Clean, linear history easy to follow

### Merge Commits

**When to use:**

- Integration of long-lived feature branches
- Preserving exact history of parallel development
- Team preference for merge commits

**Pattern:**

```
Merge branch 'feature/user-management' into main

Brings in complete user management feature including:
- User CRUD operations
- Authentication
- Authorization
- Tests and documentation

Closes: #789
```

## Revert Patterns

### Simple Revert

```bash
git revert abc123
```

**Commit message:**

```
Revert "feat(auth): add SSO integration"

This reverts commit abc123.

Reason: SSO integration causing production issues with LDAP.
Will reimplement with proper LDAP support.

Refs: #890
```

### Revert of Revert

```bash
git revert def456  # def456 is the revert commit
```

**Commit message:**

```
Revert "Revert "feat(auth): add SSO integration""

This reverts commit def456, restoring the SSO integration.

LDAP issues have been resolved with updated configuration.
SSO integration is now working correctly in staging.

Refs: #890, #891
```

## Squash Patterns

### Before Merge Squash

**Scenario:** Clean up feature branch before merging

**Original commits:**

```
feat(api): add endpoint
WIP: debugging
fix: typo
WIP: more changes
feat(api): add validation
fix: address review comments
```

**Squashed:**

```
feat(api): add user management endpoints

Implement CRUD endpoints for user management with validation
and error handling.

- GET /users - List users
- POST /users - Create user
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

Refs: #456
```

**Command:**

```bash
git rebase -i HEAD~6
# Mark all but first as 'squash'
```

### Interactive Cleanup

**Scenario:** Organize commits logically before push

```bash
git rebase -i HEAD~5
```

**Editor:**

```
pick a1b2c3d feat(api): add endpoints
fixup d4e5f6g fix typo
pick g7h8i9j test(api): add tests
reword j1k2l3m docs(api): add documentation
drop m4n5o6p temporary debug code
```

**Result:** Clean, logical commits

## Anti-Patterns to Avoid

### Vague Messages

```
❌ fix: updates
❌ chore: changes
❌ feat: new stuff
```

### Kitchen Sink Commits

```
❌ feat: add login, fix bug, update docs, refactor code
```

### WIP in Production

```
❌ WIP: still working on this
❌ temp commit
❌ asdf
```

### Commented Code

```
❌ Commit including:
// TODO: fix this later
// console.log('debugging')
```

### Debug Code

```
❌ Commit including:
debugger;
console.log('test');
```

### Merge Conflict Markers

```
❌ Commit including:
<<<<<<< HEAD
code
=======
other code
>>>>>>> feature
```

## Best Practices Summary

### Message Quality

1. **Be specific** - "Add user authentication" not "Add feature"
2. **Be concise** - Subject under 50 characters
3. **Be consistent** - Follow conventional commits format
4. **Be informative** - Explain why, not what (code shows what)

### Commit Content

1. **Atomic** - One logical change per commit
2. **Complete** - Leave code in working state
3. **Clean** - No debug code or comments
4. **Tested** - Tests should pass

### Commit History

1. **Linear** - Use rebase to maintain linear history
2. **Logical** - Commits tell a story
3. **Revertable** - Each commit can be reverted safely
4. **Searchable** - Clear messages for git log/bisect

### Team Workflow

1. **Review before push** - Check commits before pushing
2. **Squash WIP commits** - Clean up before merging
3. **Communicate breaking changes** - Use BREAKING CHANGE footer
4. **Reference issues** - Link commits to issue tracker

---

**Remember:** Good commits make good history, and good history makes debugging, code review, and collaboration much easier.
