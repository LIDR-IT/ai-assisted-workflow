#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Fixing folder names..."
echo ""

# Fix backlog folders (remove end date)
echo "📂 Fixing backlog folders..."
for folder in "$SCRIPT_DIR"/backlog/TICK-*-start-*-end-*/; do
  if [ -d "$folder" ]; then
    # Extract ticket ID and start date
    basename=$(basename "$folder")
    if [[ $basename =~ (TICK-[0-9]+)-start-([0-9]{2}-[0-9]{2}-[0-9]{4})-end-.* ]]; then
      ticket_id="${BASH_REMATCH[1]}"
      start_date="${BASH_REMATCH[2]}"
      
      new_folder="$SCRIPT_DIR/backlog/${ticket_id}-start-${start_date}"
      
      echo "  📋 $basename → ${ticket_id}-start-${start_date}"
      mv "$folder" "$new_folder"
    fi
  fi
done

# Fix active folders (remove end date)
echo ""
echo "📂 Fixing active folders..."
for folder in "$SCRIPT_DIR"/active/TICK-*-start-*-end-*/; do
  if [ -d "$folder" ]; then
    basename=$(basename "$folder")
    if [[ $basename =~ (TICK-[0-9]+)-start-([0-9]{2}-[0-9]{2}-[0-9]{4})-end-.* ]]; then
      ticket_id="${BASH_REMATCH[1]}"
      start_date="${BASH_REMATCH[2]}"
      
      new_folder="$SCRIPT_DIR/active/${ticket_id}-start-${start_date}"
      
      echo "  📋 $basename → ${ticket_id}-start-${start_date}"
      mv "$folder" "$new_folder"
    fi
  fi
done

echo ""
echo "✅ Folder names fixed!"
echo ""
echo "New structure:"
echo "- Backlog/Active: TICK-XXX-start-dd-mm-yyyy/"
echo "- Archived: TICK-XXX-start-dd-mm-yyyy-end-dd-mm-yyyy/"
