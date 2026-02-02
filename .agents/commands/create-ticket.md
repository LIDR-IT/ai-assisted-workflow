---
name: create-ticket
description: Create a new ticket with full folder structure
arguments:
  - name: type
    description: Ticket type (feature, bug, refactor, docs)
    required: true
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
mkdir -p "$FOLDER/resources/wireframes"
mkdir -p "$FOLDER/resources/designs"
mkdir -p "$FOLDER/resources/json"
mkdir -p "$FOLDER/resources/diagrams"

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
cat > "$FOLDER/resources/README.md" <<EOF
# Resources for ${TICKET_ID}

Store ticket resources here:

- \`wireframes/\` - UI/UX wireframes (Figma, Sketch, PNG exports)
- \`designs/\` - Design files and assets
- \`json/\` - JSON configs, API responses, test data
- \`diagrams/\` - Architecture diagrams, flowcharts, sequence diagrams

## Guidelines

- Use descriptive filenames
- Include version numbers when relevant (e.g., \`wireframe-v2.png\`)
- Add comments or documentation in files when helpful
- Keep files organized by type

## Examples

\`\`\`
wireframes/
├── dashboard-mobile.png
├── dashboard-desktop.png
└── user-profile.fig

designs/
├── color-palette.svg
└── component-specs.pdf

json/
├── api-response-example.json
└── config-schema.json

diagrams/
├── architecture.mmd
└── user-flow.drawio
\`\`\`
EOF

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
