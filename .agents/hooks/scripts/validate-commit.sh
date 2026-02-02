#!/bin/bash
set -euo pipefail

# Pre-commit validation hook
# Validates git commits for tickets in branch name

# Read hook input from stdin
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command')

# Only validate git commit commands
if [[ ! "$command" =~ "git commit" ]]; then
  echo '{"continue": true}'
  exit 0
fi

# Get current branch
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$branch" ]; then
  echo '{"continue": true}'
  exit 0
fi

# Extract ticket ID from branch name (e.g., feature/TICK-123-description)
if [[ "$branch" =~ (TICK-[0-9]+) ]]; then
  ticket_id="${BASH_REMATCH[1]}"

  # Check if ticket exists in active/
  ticket_file=".agents/tickets/active/${ticket_id}.md"

  if [ ! -f "$ticket_file" ]; then
    # Not in active, check backlog
    ticket_file=".agents/tickets/backlog/${ticket_id}.md"

    if [ ! -f "$ticket_file" ]; then
      # Ticket doesn't exist
      echo "{
        \"hookSpecificOutput\": {
          \"permissionDecision\": \"deny\"
        },
        \"systemMessage\": \"❌ Ticket ${ticket_id} not found in active/ or backlog/. Create ticket first with /create-ticket.\"
      }" >&2
      exit 2
    fi
  fi

  # Ticket exists - ask user to validate
  echo "{
    \"hookSpecificOutput\": {
      \"permissionDecision\": \"ask\"
    },
    \"systemMessage\": \"⚠️  Branch ${branch} has ticket ${ticket_id}. Before committing, run /validate-pr to ensure all criteria are met. Proceed with commit?\"
  }"
  exit 0
else
  # No ticket in branch name - allow commit with note
  echo "{
    \"hookSpecificOutput\": {
      \"permissionDecision\": \"allow\"
    },
    \"systemMessage\": \"✅ No ticket reference in branch. Commit allowed.\"
  }"
  exit 0
fi
