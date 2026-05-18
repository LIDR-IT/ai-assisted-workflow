#!/bin/bash
set -euo pipefail

# Import test cases to Xray from CSV
# Usage: ./import-to-xray.sh <csv-file> <project-key>
# Based on: docs/standards/tool-integrations.md

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

error() {
    log "ERROR: $*"
    exit 1
}

validate_input() {
    [[ $# -eq 2 ]] || error "Usage: $0 <csv-file> <project-key>"
    [[ -f "$1" ]] || error "CSV file not found: $1"
    [[ -n "$2" ]] || error "Project key cannot be empty"
}

# Validate inputs
validate_input "$@"
CSV_FILE="$1"
PROJECT_KEY="$2"

# Check environment variables
[[ -n "${XRAY_API_TOKEN:-}" ]] || error "XRAY_API_TOKEN environment variable required"
[[ -n "${XRAY_BASE_URL:-}" ]] || error "XRAY_BASE_URL environment variable required"

log "Starting CSV import to Xray project: $PROJECT_KEY"

# Validate CSV format first
log "Validating CSV format..."
if command -v node >/dev/null 2>&1; then
    node scripts/validate-xray-csv.js "$CSV_FILE" || error "CSV validation failed"
else
    log "WARN: Node.js not found, skipping CSV validation"
fi

# Convert CSV to Xray JSON format
log "Converting CSV to Xray format..."
TEMP_JSON=$(mktemp)
trap "rm -f $TEMP_JSON" EXIT

# Header: Test Name,Test Type,Gherkin,Priority,Labels,Test Set
{
    echo '{"tests": ['
    tail -n +2 "$CSV_FILE" | while IFS=',' read -r name type gherkin priority labels testset; do
        # Clean quoted fields
        name=$(echo "$name" | sed 's/^"//;s/"$//')
        gherkin=$(echo "$gherkin" | sed 's/^"""//;s/"""$//')
        priority=$(echo "$priority" | sed 's/^"//;s/"$//')
        labels=$(echo "$labels" | sed 's/^"//;s/"$//')
        testset=$(echo "$testset" | sed 's/^"//;s/"$//')

        cat << EOF
        {
            "fields": {
                "project": {"key": "$PROJECT_KEY"},
                "summary": "$name",
                "issuetype": {"name": "Test"},
                "priority": {"name": "$priority"},
                "labels": ["$(echo "$labels" | tr ';' '\n' | head -1)"],
                "customfield_10000": "$gherkin"
            }
        },
EOF
    done | sed '$ s/,$//'
    echo ']}'
} > "$TEMP_JSON"

# Import to Xray via REST API
log "Importing to Xray..."
RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $XRAY_API_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST \
    "${XRAY_BASE_URL}/rest/api/2/issue/bulk" \
    -d @"$TEMP_JSON" \
    -o /tmp/xray_response.json)

HTTP_CODE="${RESPONSE: -3}"

if [[ "$HTTP_CODE" == "201" ]]; then
    CREATED_COUNT=$(jq '.issues | length' /tmp/xray_response.json 2>/dev/null || echo "unknown")
    log "SUCCESS: Imported $CREATED_COUNT test cases to $PROJECT_KEY"
    jq -r '.issues[]?.key' /tmp/xray_response.json 2>/dev/null || true
    exit 0
else
    log "ERROR: HTTP $HTTP_CODE response from Xray"
    cat /tmp/xray_response.json >&2
    exit 1
fi