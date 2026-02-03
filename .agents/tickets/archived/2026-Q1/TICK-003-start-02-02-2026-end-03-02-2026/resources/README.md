# Resources Naming Conventions

Store all ticket resources in this directory using clear naming conventions.

## File Naming Pattern

```
[type]-[platform]-[context]-[version].[ext]
```

**Components:**

- `type`: wireframe | final | design | diagram | api | config | spec | mock | test
- `platform`: desktop | mobile | tablet | web | ios | android | cursor | claude-code | gemini (optional)
- `context`: Descriptive name (auth-login, dashboard, user-profile, manual-validation)
- `version`: v1, v2, v3, etc. (optional)
- `ext`: Any extension (png, jpg, pdf, json, svg, mmd, fig, md, etc.)

## Examples by Type

### Wireframes (Product Owner / Designer)

```
wireframe-auth-login.png
wireframe-auth-login-v2.png
wireframe-mobile-dashboard.fig
wireframe-desktop-settings.pdf
```

### Final Designs (Designer → Developer)

```
final-desktop-ui-auth-login.png
final-mobile-ui-auth-login.png
final-tablet-ui-dashboard.pdf
final-web-component-button.svg
```

### Design Assets (Designer)

```
design-tokens.json
design-color-palette.svg
design-typography-scale.pdf
design-component-library.fig
```

### Diagrams (Developer / Architect)

```
diagram-architecture.mmd
diagram-architecture.png
diagram-user-flow.drawio
diagram-db-schema.svg
diagram-sequence-auth.png
```

### API & Data (Developer)

```
api-response-users.json
api-request-create-user.json
api-schema-openapi.yaml
mock-data-products.json
```

### Configurations (Developer)

```
config-feature-flags.json
config-env-variables.example
spec-requirements.md
spec-acceptance-criteria.pdf
```

### Testing Materials (QA / Developer)

```
test-cursor-manual-validation.md
test-claude-code-manual-validation.md
test-gemini-manual-validation.md
TESTING_GUIDE.md
```

## Naming Best Practices

### ✅ Good Examples

```
wireframe-auth-login-v2.png           # Clear type, context, version
final-desktop-ui-dashboard.png        # Platform specified
diagram-architecture-overview.mmd     # Descriptive context
api-response-get-users-200.json      # API with status code
design-tokens-theme-dark.json         # Variant specified
```

### ❌ Avoid

```
image1.png                    # Not descriptive
screen.jpg                    # Too generic
final.pdf                     # Missing context
design_file.fig               # Underscores (use hyphens)
AuthLoginWireframe.png        # CamelCase (use kebab-case)
```

## Version Control

When updating a file:

1. Keep previous version: `wireframe-dashboard-v1.png`
2. Add new version: `wireframe-dashboard-v2.png`
3. Or use dates: `wireframe-dashboard-2026-02-02.png`

## Organization Tips

**By Feature:**

```
wireframe-auth-login.png
wireframe-auth-register.png
wireframe-auth-reset-password.png
final-mobile-ui-auth-login.png
```

**By Platform:**

```
final-desktop-ui-dashboard.png
final-mobile-ui-dashboard.png
final-tablet-ui-dashboard.png
```

## Common Extensions

- **Images:** `.png`, `.jpg`, `.svg`, `.gif`
- **Design Files:** `.fig`, `.sketch`, `.xd`, `.psd`
- **Documents:** `.pdf`, `.md`, `.docx`
- **Data:** `.json`, `.yaml`, `.yml`, `.csv`
- **Diagrams:** `.mmd`, `.drawio`, `.puml`

## Collaboration

**Product Owner:**

- Add wireframes with `wireframe-` prefix
- Use descriptive context names
- Include platform if relevant

**Designer:**

- Export finals with `final-[platform]-ui-` prefix
- Provide design tokens as `design-tokens.json`
- Keep source files (`.fig`, `.sketch`)

**Developer:**

- Add diagrams with `diagram-` prefix
- Include API responses/schemas
- Document mock data for testing

**QA / Tester:**

- Add test procedures with `test-[platform]-` prefix
- Include expected outputs and validation checklists
- Document platform-specific quirks

Extensions don't matter—use what's appropriate for the content.

---

## Current Resources for TICK-003

### Testing Documentation

**Main Guide:**

- `TESTING_GUIDE.md` - Start here for testing overview and order

**Platform-Specific Tests:**

- `test-cursor-manual-validation.md` - Cursor IDE testing (5 tests, ~45 min)
- `test-claude-code-manual-validation.md` - Claude Code CLI testing (8 tests, ~60 min)
- `test-gemini-manual-validation.md` - Gemini CLI testing (7 tests, ~45 min)

**Total Testing Time:** ~2.5 hours (can be done in parallel with multiple testers)
