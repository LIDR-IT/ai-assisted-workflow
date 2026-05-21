---
description: Create a new ticket with full folder structure
agent: 'agent'
---

# Create Ticket Command

Interactive command to create a new ticket with complete folder structure.

## Usage

```bash
/create-ticket [type]
```

**Arguments:**

- `type`: Ticket type - `feature`, `bug`, `refactor`, or `docs`

**Examples:**

```bash
/create-ticket feature
/create-ticket bug
```

## What This Command Does

1. **Generates next ticket ID** by finding highest existing ID across all directories
2. **Creates folder structure** with current date as start date:
   ```
   .agents/tickets/backlog/TICK-XXX-start-dd-mm-yyyy/
   ├── ticket.md
   ├── plan.md
   └── resources/
       ├── wireframes/
       ├── designs/
       ├── json/
       └── diagrams/
   ```
3. **Populates ticket.md** from appropriate template with:
   - Generated ID
   - Current timestamp (YYYY-MM-DD HH:MM)
   - Placeholder title and fields
4. **Creates empty plan.md** with basic structure
5. **Adds resources README** with usage instructions

## Implementation

```bash
#!/bin/bash

set -e

# Validate argument
TYPE=$1
if [[ ! "$TYPE" =~ ^(feature|bug|refactor|docs)$ ]]; then
  echo "❌ Invalid type. Use: feature, bug, refactor, or docs"
  exit 1
fi

# Find next ticket ID
TICKETS_DIR=".agents/tickets"
HIGHEST_ID=0

for dir in "$TICKETS_DIR"/backlog/TICK-* "$TICKETS_DIR"/active/TICK-* "$TICKETS_DIR"/archived/*/TICK-*; do
  if [ -d "$dir" ]; then
    basename=$(basename "$dir")
    if [[ $basename =~ TICK-([0-9]+) ]]; then
      id=${BASH_REMATCH[1]}
      if [ $id -gt $HIGHEST_ID ]; then
        HIGHEST_ID=$id
      fi
    fi
  fi
done

NEXT_ID=$((HIGHEST_ID + 1))
TICKET_ID=$(printf "TICK-%03d" $NEXT_ID)

# Get current date
START_DATE=$(date +"%d-%m-%Y")
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")

# Create folder structure
FOLDER="$TICKETS_DIR/backlog/${TICKET_ID}-start-${START_DATE}"
mkdir -p "$FOLDER"
mkdir -p "$FOLDER/resources"

echo "📋 Created ticket folder: $FOLDER"

# Copy and customize template
TEMPLATE="$TICKETS_DIR/templates/${TYPE}.md"
if [ ! -f "$TEMPLATE" ]; then
  echo "❌ Template not found: $TEMPLATE"
  exit 1
fi

# Replace placeholders in template
sed -e "s/TICK-000/${TICKET_ID}/" \
    -e "s/YYYY-MM-DD HH:MM/${TIMESTAMP}/g" \
    "$TEMPLATE" > "$FOLDER/ticket.md"

echo "  ✅ Created ticket.md from $TYPE template"

# Create plan.md
cat > "$FOLDER/plan.md" <<'EOF'
# Implementation Plan

## Overview

Brief plan overview and approach.

## Tasks

- [ ] Task 1 - Assigned to:
- [ ] Task 2 - Assigned to:
- [ ] Task 3 - Assigned to:

## Technical Approach

Describe the technical approach and key decisions.

## Dependencies

- List dependencies on other tickets or external factors

## Resources

- Links to designs, wireframes, or external documentation

## Notes

Implementation notes, decisions, and trade-offs.
EOF

echo "  ✅ Created plan.md"

# Create resources README
cat > "$FOLDER/resources/README.md" <<'RESOURCES_EOF'
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

wireframe-auth-login-v2.png # Clear type, context, version
final-desktop-ui-dashboard.png # Platform specified
diagram-architecture-overview.mmd # Descriptive context
api-response-get-users-200.json # API with status code
design-tokens-theme-dark.json # Variant specified

```

### ❌ Avoid
```

image1.png # Not descriptive
screen.jpg # Too generic
final.pdf # Missing context
design_file.fig # Underscores (use hyphens)
AuthLoginWireframe.png # CamelCase (use kebab-case)

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

echo "  ✅ Created resources README"
echo ""
echo "✅ Ticket ${TICKET_ID} created successfully!"
echo ""
echo "📁 Location: $FOLDER"
echo ""
echo "Next steps:"
echo "1. Edit ticket.md to fill in details"
echo "2. Add acceptance criteria and DoD"
echo "3. Optionally add resources (wireframes, designs, etc.)"
echo "4. Run /enrich-ticket ${TICKET_ID} to validate"
```

## Example Output

```
📋 Created ticket folder: .agents/tickets/backlog/TICK-006-start-02-02-2026
  ✅ Created ticket.md from feature template
  ✅ Created plan.md
  ✅ Created resources README

✅ Ticket TICK-006 created successfully!

📁 Location: .agents/tickets/backlog/TICK-006-start-02-02-2026

Next steps:
1. Edit ticket.md to fill in details
2. Add acceptance criteria and DoD
3. Optionally add resources (wireframes, designs, etc.)
4. Run /enrich-ticket TICK-006 to validate
```

## After Creation

1. **Edit ticket.md** - Fill in title, description, acceptance criteria
2. **Update plan.md** - Break down implementation tasks
3. **Add resources** - Include wireframes, designs, diagrams as needed
4. **Validate** - Run `/enrich-ticket TICK-XXX` to check completeness
5. **Move to active** - When ready to start: `mv backlog/TICK-XXX-* active/`

## Related Commands

- `/enrich-ticket TICK-XXX` - Validate ticket completeness
- `/validate-pr` - Check PR readiness before merge
