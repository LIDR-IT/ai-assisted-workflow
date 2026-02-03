#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TICKETS_ROOT="$SCRIPT_DIR"

echo "🔄 Migrating tickets to new folder structure..."
echo ""

# Function to extract dates from ticket YAML
extract_dates() {
  local ticket_file=$1
  local created=$(grep "^created_at:" "$ticket_file" | head -1 | awk '{print $2}')
  local updated=$(grep "^updated_at:" "$ticket_file" | head -1 | awk '{print $2}')

  # Convert YYYY-MM-DD to dd-mm-yyyy format
  if [[ $created =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2}) ]]; then
    start="${BASH_REMATCH[3]}-${BASH_REMATCH[2]}-${BASH_REMATCH[1]}"
  else
    start="01-01-2026"  # Default
  fi

  if [[ $updated =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2}) ]]; then
    end="${BASH_REMATCH[3]}-${BASH_REMATCH[2]}-${BASH_REMATCH[1]}"
  else
    end="$start"  # Use start date as default
  fi

  echo "$start $end"
}

# Function to migrate a ticket
migrate_ticket() {
  local old_path=$1
  local directory=$2  # backlog, active, or archived

  local ticket_id=$(basename "$old_path" .md)

  echo "  📋 Migrating $ticket_id..."

  # Extract dates
  read -r start_date end_date <<< $(extract_dates "$old_path")

  # Create new folder structure
  local new_folder="$TICKETS_ROOT/$directory/${ticket_id}-start-${start_date}-end-${end_date}"

  mkdir -p "$new_folder"
  mkdir -p "$new_folder/resources"

  # Move ticket.md
  cp "$old_path" "$new_folder/ticket.md"

  # Create empty plan.md if it doesn't exist
  if [ ! -f "$new_folder/plan.md" ]; then
    cat > "$new_folder/plan.md" <<'EOF'
# Implementation Plan

## Overview

Brief plan overview.

## Tasks

- [ ] Task 1 - Assigned to:
- [ ] Task 2 - Assigned to:
- [ ] Task 3 - Assigned to:

## Technical Approach

Describe technical approach here.

## Resources

- Link to relevant resources
- Designs, wireframes, etc.

## Notes

Implementation notes and decisions.
EOF
  fi

  # Create README in resources
  cat > "$new_folder/resources/README.md" <<EOF
# Resources for $ticket_id

Store ticket resources here:

- \`wireframes/\` - UI/UX wireframes
- \`designs/\` - Design files (Figma, Sketch, etc.)
- \`json/\` - JSON data files, configs, API responses
- \`diagrams/\` - Architecture diagrams, flowcharts, etc.

## Guidelines

- Use descriptive filenames
- Include version numbers when relevant
- Add comments in files when needed
EOF

  # Remove old file
  rm "$old_path"

  echo "    ✅ Created $new_folder"
}

# Migrate backlog tickets
echo "📂 Migrating backlog tickets..."
if [ -d "$TICKETS_ROOT/backlog" ]; then
  for ticket in "$TICKETS_ROOT/backlog"/*.md; do
    if [ -f "$ticket" ]; then
      migrate_ticket "$ticket" "backlog"
    fi
  done
fi

# Migrate active tickets
echo ""
echo "📂 Migrating active tickets..."
if [ -d "$TICKETS_ROOT/active" ]; then
  for ticket in "$TICKETS_ROOT/active"/*.md; do
    if [ -f "$ticket" ] && [ "$(basename "$ticket")" != ".gitkeep" ]; then
      migrate_ticket "$ticket" "active"
    fi
  done
fi

# Migrate archived tickets
echo ""
echo "📂 Migrating archived tickets..."
if [ -d "$TICKETS_ROOT/archived" ]; then
  for ticket in "$TICKETS_ROOT/archived"/*.md; do
    if [ -f "$ticket" ] && [ "$(basename "$ticket")" != ".gitkeep" ]; then
      # For archived, create 2026-Q1 subfolder
      mkdir -p "$TICKETS_ROOT/archived/2026-Q1"

      ticket_id=$(basename "$ticket" .md)
      read -r start_date end_date <<< $(extract_dates "$ticket")

      new_folder="$TICKETS_ROOT/archived/2026-Q1/${ticket_id}-start-${start_date}-end-${end_date}"

      mkdir -p "$new_folder"
      mkdir -p "$new_folder/resources/wireframes"
      mkdir -p "$new_folder/resources/designs"
      mkdir -p "$new_folder/resources/json"
      mkdir -p "$new_folder/resources/diagrams"

      cp "$ticket" "$new_folder/ticket.md"

      # Create plan.md
      cat > "$new_folder/plan.md" <<'EOF'
# Implementation Plan

## Overview

Brief plan overview.

## Tasks

- [x] Task 1 - Completed
- [x] Task 2 - Completed

## Technical Approach

Describe technical approach here.

## Resources

- Link to relevant resources

## Notes

Implementation notes and decisions.
EOF

      # Create resources README
      cat > "$new_folder/resources/README.md" <<EOF
# Resources for $ticket_id

Store ticket resources here:

- \`wireframes/\` - UI/UX wireframes
- \`designs/\` - Design files (Figma, Sketch, etc.)
- \`json/\` - JSON data files, configs, API responses
- \`diagrams/\` - Architecture diagrams, flowcharts, etc.
EOF

      rm "$ticket"
      echo "    ✅ Created $new_folder"
    fi
  done
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "New structure:"
tree -L 3 "$TICKETS_ROOT" -I 'templates|*.sh' || ls -la "$TICKETS_ROOT"
