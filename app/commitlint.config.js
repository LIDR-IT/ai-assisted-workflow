/**
 * Commitlint Configuration — LIDR SDLC SDLC Ecosystem
 *
 * Validates Conventional Commits format:
 *   type(scope): description
 *
 * Types allowed:
 *   feat     — New feature
 *   fix      — Bug fix
 *   docs     — Documentation only changes
 *   refactor — Code change that neither fixes a bug nor adds a feature
 *   test     — Adding missing tests or correcting existing tests
 *   chore    — Maintenance tasks (deps, configs, tooling)
 *   style    — Formatting, missing semicolons, etc. (no code change)
 *   perf     — Performance improvement
 *   ci       — CI/CD configuration changes
 *   build    — Build system or external dependencies
 *   revert   — Reverts a previous commit
 *
 * Reference: Guidelines.md §2.5 (Git conventions)
 * Doc: docs/standards/hooks-strategy.md
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce allowed types
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'refactor', 'test', 'chore',
      'style', 'perf', 'ci', 'build', 'revert'
    ]],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Type is required
    'type-empty': [2, 'never'],
    // Scope is optional but must be kebab-case when present
    'scope-case': [2, 'always', 'kebab-case'],
    // Subject is required
    'subject-empty': [2, 'never'],
    // Subject max length
    'subject-max-length': [2, 'always', 100],
    // No period at end of subject
    'subject-full-stop': [2, 'never', '.'],
    // Header max length (type + scope + subject)
    'header-max-length': [2, 'always', 120],
    // Body line max length
    'body-max-line-length': [2, 'always', 200],
    // Footer line max length
    'footer-max-line-length': [2, 'always', 200],
  },
};
