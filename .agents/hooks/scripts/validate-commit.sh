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

  # Check if ticket folder exists in active/ (pattern: TICK-XXX-start-dd-mm-yyyy/)
  ticket_folder=$(find ".agents/tickets/active" -maxdepth 1 -type d -name "${ticket_id}-start-*" 2>/dev/null | head -1)

  if [ -z "$ticket_folder" ]; then
    # Not in active, check backlog
    ticket_folder=$(find ".agents/tickets/backlog" -maxdepth 1 -type d -name "${ticket_id}-start-*" 2>/dev/null | head -1)

    if [ -z "$ticket_folder" ]; then
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

  # Validate folder structure
  ticket_file="${ticket_folder}/ticket.md"
  plan_file="${ticket_folder}/plan.md"

  if [ ! -f "$ticket_file" ]; then
    echo "{
      \"hookSpecificOutput\": {
        \"permissionDecision\": \"deny\"
      },
      \"systemMessage\": \"❌ Ticket ${ticket_id} missing ticket.md file. Invalid ticket structure.\"
    }" >&2
    exit 2
  fi

  if [ ! -f "$plan_file" ]; then
    echo "{
      \"hookSpecificOutput\": {
        \"permissionDecision\": \"ask\"
      },
      \"systemMessage\": \"⚠️  Ticket ${ticket_id} missing plan.md. Consider adding implementation plan. Proceed with commit?\"
    }"
    exit 0
  fi

  # Check folder name format (backlog/active should NOT have end date)
  if [[ "$ticket_folder" =~ backlog|active ]]; then
    if [[ "$(basename "$ticket_folder")" =~ -end- ]]; then
      echo "{
        \"hookSpecificOutput\": {
          \"permissionDecision\": \"deny\"
        },
        \"systemMessage\": \"❌ Ticket folder in backlog/active should not have end date. Format: TICK-XXX-start-dd-mm-yyyy/\"
      }" >&2
      exit 2
    fi
  fi

  # Ticket exists and structure valid - ask user to validate
  echo "{
    \"hookSpecificOutput\": {
      \"permissionDecision\": \"ask\"
    },
    \"systemMessage\": \"⚠️  Branch ${branch} has ticket ${ticket_id}. Before committing, run /enrich-ticket ${ticket_id} to ensure all criteria are met. Proceed with commit?\"
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
