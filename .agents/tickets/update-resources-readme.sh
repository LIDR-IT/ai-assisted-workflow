#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Updating resources README files..."
echo ""

# Find all resources/ directories
find "$SCRIPT_DIR" -type d -name "resources" | while read resources_dir; do
  readme="$resources_dir/README.md"
  
  echo "📝 Updating $readme"
  
  # Create new README with naming conventions
  cat > "$readme" <<'RESOURCES_EOF'
# Resources Naming Conventions

Store all ticket resources in this directory using clear naming conventions.

## File Naming Pattern

```
[type]-[platform]-[context]-[version].[ext]
```

**Components:**
- `type`: wireframe | final | design | diagram | api | config | spec | mock
- `platform`: desktop | mobile | tablet | web | ios | android (optional)
- `context`: Descriptive name (auth-login, dashboard, user-profile)
- `version`: v1, v2, v3, etc. (optional)
- `ext`: Any extension (png, jpg, pdf, json, svg, mmd, fig, etc.)

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

Extensions don't matter—use what's appropriate for the content.
RESOURCES_EOF

  # Remove subdirectories if they exist
  for subdir in wireframes designs json diagrams; do
    if [ -d "$resources_dir/$subdir" ]; then
      echo "  🗑️  Removing empty subdirectory: $resources_dir/$subdir"
      rmdir "$resources_dir/$subdir" 2>/dev/null || true
    fi
  done
  
  echo "  ✅ Updated"
done

echo ""
echo "✅ All resources README files updated!"
echo "✅ Empty subdirectories removed!"
