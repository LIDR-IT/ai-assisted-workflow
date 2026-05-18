#!/bin/bash
set -euo pipefail

# Sync status between Jira tickets and GitHub issues
# Usage: ./sync-issues.sh [--dry-run] [--project PROJECT_KEY]
# Based on: docs/standards/tool-integrations.md

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

error() {
    log "ERROR: $*"
    exit 1
}

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --dry-run           Show what would be synced without making changes"
    echo "  --project KEY       Sync specific Jira project (default: all)"
    echo "  --github-only       Only sync from GitHub to Jira"
    echo "  --jira-only         Only sync from Jira to GitHub"
    echo "  --help             Show this help message"
    exit 0
}

check_dependencies() {
    command -v gh >/dev/null 2>&1 || error "GitHub CLI (gh) is required"
    command -v jq >/dev/null 2>&1 || error "jq is required for JSON processing"
    command -v curl >/dev/null 2>&1 || error "curl is required for API calls"
}

check_environment() {
    [[ -n "${JIRA_API_TOKEN:-}" ]] || error "JIRA_API_TOKEN environment variable required"
    [[ -n "${JIRA_BASE_URL:-}" ]] || error "JIRA_BASE_URL environment variable required"
    [[ -n "${JIRA_USER_EMAIL:-}" ]] || error "JIRA_USER_EMAIL environment variable required"

    # Test GitHub authentication
    if ! gh auth status >/dev/null 2>&1; then
        error "GitHub CLI not authenticated. Run 'gh auth login'"
    fi
}

get_jira_tickets() {
    local project_filter=""
    if [[ -n "${PROJECT_KEY:-}" ]]; then
        project_filter="AND project = $PROJECT_KEY"
    fi

    local jql="status IN ('In Progress', 'Ready for Dev', 'Ready for QA') $project_filter"

    log "Fetching Jira tickets with JQL: $jql"

    curl -s \
        -u "$JIRA_USER_EMAIL:$JIRA_API_TOKEN" \
        -H "Accept: application/json" \
        -G \
        "${JIRA_BASE_URL}/rest/api/2/search" \
        --data-urlencode "jql=$jql" \
        --data-urlencode "fields=key,summary,status,assignee,updated" \
        --data-urlencode "maxResults=100" | \
    jq -r '.issues[]? | {
        key: .key,
        summary: .fields.summary,
        status: .fields.status.name,
        assignee: (.fields.assignee.emailAddress // "unassigned"),
        updated: .fields.updated
    }'
}

get_github_issues() {
    log "Fetching GitHub issues with jira labels..."

    gh issue list \
        --json number,title,state,assignees,updatedAt,labels \
        --jq '.[] | select(.labels[]?.name | startswith("jira:")) | {
            number: .number,
            title: .title,
            state: .state,
            assignee: (.assignees[0].login // "unassigned"),
            updated: .updatedAt,
            jira_key: (.labels[] | select(.name | startswith("jira:")).name | split(":")[1])
        }'
}

map_jira_to_github_status() {
    local jira_status="$1"
    case "$jira_status" in
        "To Do"|"Open"|"Backlog") echo "open" ;;
        "In Progress"|"Ready for Dev"|"Ready for QA") echo "open" ;;
        "Done"|"Closed"|"Resolved") echo "closed" ;;
        *) echo "open" ;;
    esac
}

map_github_to_jira_status() {
    local github_state="$1"
    case "$github_state" in
        "open") echo "In Progress" ;;
        "closed") echo "Done" ;;
        *) echo "In Progress" ;;
    esac
}

sync_jira_to_github() {
    local jira_tickets_file="$1"
    local github_issues_file="$2"
    local changes=0

    log "Syncing Jira tickets to GitHub issues..."

    while IFS= read -r jira_ticket; do
        local jira_key=$(echo "$jira_ticket" | jq -r '.key')
        local jira_summary=$(echo "$jira_ticket" | jq -r '.summary')
        local jira_status=$(echo "$jira_ticket" | jq -r '.status')
        local expected_gh_state=$(map_jira_to_github_status "$jira_status")

        # Find corresponding GitHub issue
        local gh_issue=$(jq -r --arg key "$jira_key" '. | select(.jira_key == $key)' "$github_issues_file")

        if [[ -z "$gh_issue" ]]; then
            # Create new GitHub issue
            log "Creating GitHub issue for $jira_key: $jira_summary"
            if [[ "$DRY_RUN" != "true" ]]; then
                gh issue create \
                    --title "[$jira_key] $jira_summary" \
                    --body "Synced from Jira ticket: $JIRA_BASE_URL/browse/$jira_key" \
                    --label "jira:$jira_key" \
                    --label "sync:auto"
                ((changes++))
            fi
        else
            # Check if GitHub issue state needs update
            local gh_number=$(echo "$gh_issue" | jq -r '.number')
            local gh_state=$(echo "$gh_issue" | jq -r '.state')

            if [[ "$gh_state" != "$expected_gh_state" ]]; then
                log "Updating GitHub issue #$gh_number state: $gh_state -> $expected_gh_state"
                if [[ "$DRY_RUN" != "true" ]]; then
                    if [[ "$expected_gh_state" == "closed" ]]; then
                        gh issue close "$gh_number" --comment "Auto-closed: Jira ticket $jira_key marked as $jira_status"
                    else
                        gh issue reopen "$gh_number" --comment "Auto-reopened: Jira ticket $jira_key status changed to $jira_status"
                    fi
                    ((changes++))
                fi
            fi
        fi
    done < <(jq -c '.' "$jira_tickets_file")

    return $changes
}

sync_github_to_jira() {
    local jira_tickets_file="$1"
    local github_issues_file="$2"
    local changes=0

    log "Syncing GitHub issues to Jira tickets..."

    while IFS= read -r gh_issue; do
        local gh_number=$(echo "$gh_issue" | jq -r '.number')
        local gh_state=$(echo "$gh_issue" | jq -r '.state')
        local jira_key=$(echo "$gh_issue" | jq -r '.jira_key')
        local expected_jira_status=$(map_github_to_jira_status "$gh_state")

        # Find corresponding Jira ticket
        local jira_ticket=$(jq -r --arg key "$jira_key" '. | select(.key == $key)' "$jira_tickets_file")

        if [[ -n "$jira_ticket" ]]; then
            local jira_status=$(echo "$jira_ticket" | jq -r '.status')

            # Only sync if GitHub was updated more recently than Jira
            local gh_updated=$(echo "$gh_issue" | jq -r '.updated')
            local jira_updated=$(echo "$jira_ticket" | jq -r '.updated')

            if [[ "$gh_updated" > "$jira_updated" ]] && [[ "$jira_status" != "$expected_jira_status" ]]; then
                log "GitHub issue #$gh_number is newer, updating Jira $jira_key: $jira_status -> $expected_jira_status"
                if [[ "$DRY_RUN" != "true" ]]; then
                    # Transition Jira ticket (simplified - you'd need proper transition IDs)
                    curl -s \
                        -u "$JIRA_USER_EMAIL:$JIRA_API_TOKEN" \
                        -H "Content-Type: application/json" \
                        -X PUT \
                        "${JIRA_BASE_URL}/rest/api/2/issue/$jira_key" \
                        -d "{\"fields\":{\"summary\":\"[GITHUB SYNC] Updated from issue #$gh_number\"}}" >/dev/null
                    ((changes++))
                fi
            fi
        fi
    done < <(jq -c '.' "$github_issues_file")

    return $changes
}

main() {
    # Parse arguments
    DRY_RUN="false"
    PROJECT_KEY=""
    SYNC_MODE="both"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run) DRY_RUN="true"; shift ;;
            --project) PROJECT_KEY="$2"; shift 2 ;;
            --github-only) SYNC_MODE="github"; shift ;;
            --jira-only) SYNC_MODE="jira"; shift ;;
            --help) usage ;;
            *) error "Unknown option: $1" ;;
        esac
    done

    # Validate dependencies and environment
    check_dependencies
    check_environment

    # Create temp files
    JIRA_TEMP=$(mktemp)
    GITHUB_TEMP=$(mktemp)
    trap "rm -f $JIRA_TEMP $GITHUB_TEMP" EXIT

    log "Starting sync process (DRY_RUN=$DRY_RUN)"

    # Fetch data
    get_jira_tickets > "$JIRA_TEMP"
    get_github_issues > "$GITHUB_TEMP"

    local jira_count=$(jq -s 'length' "$JIRA_TEMP")
    local github_count=$(jq -s 'length' "$GITHUB_TEMP")

    log "Found $jira_count Jira tickets and $github_count GitHub issues"

    # Perform sync
    local total_changes=0

    if [[ "$SYNC_MODE" == "both" || "$SYNC_MODE" == "jira" ]]; then
        sync_jira_to_github "$JIRA_TEMP" "$GITHUB_TEMP"
        total_changes=$((total_changes + $?))
    fi

    if [[ "$SYNC_MODE" == "both" || "$SYNC_MODE" == "github" ]]; then
        sync_github_to_jira "$JIRA_TEMP" "$GITHUB_TEMP"
        total_changes=$((total_changes + $?))
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log "DRY RUN: Would make $total_changes changes"
    else
        log "Sync completed: Made $total_changes changes"
    fi

    # Generate sync report
    cat > "sync-report-$(date +%Y%m%d-%H%M%S).json" << EOF
{
    "sync_date": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "dry_run": $DRY_RUN,
    "project_key": "${PROJECT_KEY:-"all"}",
    "sync_mode": "$SYNC_MODE",
    "summary": {
        "jira_tickets": $jira_count,
        "github_issues": $github_count,
        "changes_made": $total_changes
    }
}
EOF

    exit 0
}

# Execute main function
main "$@"