#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Updating timestamps in all tickets..."

# Function to update timestamp format in a file
update_timestamps() {
  local file=$1
  
  # Check if file has old format (YYYY-MM-DD without time)
  if grep -q "created_at: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}$" "$file" || \
     grep -q "updated_at: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}$" "$file"; then
    
    echo "  📝 Updating $(basename $(dirname $file))/$(basename $file)..."
    
    # Add 00:00 to dates without time
    sed -i '' 's/^\(created_at: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\)$/\1 00:00/' "$file"
    sed -i '' 's/^\(updated_at: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\)$/\1 00:00/' "$file"
    
    echo "    ✅ Updated"
  fi
}

# Update all ticket.md files
find "$SCRIPT_DIR" -type f -name "ticket.md" | while read file; do
  update_timestamps "$file"
done

echo ""
echo "✅ All timestamps updated to YYYY-MM-DD HH:MM format!"
