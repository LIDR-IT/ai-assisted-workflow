#!/bin/bash
set -euo pipefail

# Export test execution results from Xray to CSV
# Usage: ./export-from-xray.sh <project-key> <test-execution-key> [output-file]
# Based on: docs/standards/tool-integrations.md

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

error() {
    log "ERROR: $*"
    exit 1
}

validate_input() {
    [[ $# -ge 2 ]] || error "Usage: $0 <project-key> <test-execution-key> [output-file]"
    [[ -n "$1" ]] || error "Project key cannot be empty"
    [[ -n "$2" ]] || error "Test execution key cannot be empty"
}

# Validate inputs
validate_input "$@"
PROJECT_KEY="$1"
EXECUTION_KEY="$2"
OUTPUT_FILE="${3:-xray-results-$(date +%Y%m%d-%H%M%S).csv}"

# Check environment variables
[[ -n "${XRAY_API_TOKEN:-}" ]] || error "XRAY_API_TOKEN environment variable required"
[[ -n "${XRAY_BASE_URL:-}" ]] || error "XRAY_BASE_URL environment variable required"

log "Exporting results from Xray execution: $EXECUTION_KEY"

# Get test execution details
log "Fetching test execution details..."
TEMP_JSON=$(mktemp)
trap "rm -f $TEMP_JSON" EXIT

curl -s \
    -H "Authorization: Bearer $XRAY_API_TOKEN" \
    -H "Content-Type: application/json" \
    -X GET \
    "${XRAY_BASE_URL}/rest/raven/1.0/api/testexec/${EXECUTION_KEY}/test" \
    -o "$TEMP_JSON"

# Check if request was successful
if ! jq -e '.[]?' "$TEMP_JSON" >/dev/null 2>&1; then
    error "Failed to fetch test execution data or no tests found"
fi

log "Converting to CSV format..."

# Create CSV header
echo "Test Key,Test Name,Status,Started,Finished,Duration,Defects,Comment,Executed By" > "$OUTPUT_FILE"

# Process each test result
jq -r '.[] |
    [
        .testKey,
        .testSummary,
        .status,
        .startedOn // "N/A",
        .finishedOn // "N/A",
        .duration // "N/A",
        (.defects // [] | join(";")),
        (.comment // ""),
        .executedBy // "N/A"
    ] | @csv' "$TEMP_JSON" >> "$OUTPUT_FILE"

# Generate summary statistics
TOTAL_TESTS=$(jq '. | length' "$TEMP_JSON")
PASSED_TESTS=$(jq '[.[] | select(.status == "PASS")] | length' "$TEMP_JSON")
FAILED_TESTS=$(jq '[.[] | select(.status == "FAIL")] | length' "$TEMP_JSON")
SKIPPED_TESTS=$(jq '[.[] | select(.status == "TODO" or .status == "SKIPPED")] | length' "$TEMP_JSON")

log "Export completed successfully:"
log "- Output file: $OUTPUT_FILE"
log "- Total tests: $TOTAL_TESTS"
log "- Passed: $PASSED_TESTS"
log "- Failed: $FAILED_TESTS"
log "- Skipped: $SKIPPED_TESTS"

# Create summary file
SUMMARY_FILE="${OUTPUT_FILE%.csv}-summary.json"
cat > "$SUMMARY_FILE" << EOF
{
    "execution_key": "$EXECUTION_KEY",
    "project_key": "$PROJECT_KEY",
    "export_date": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "summary": {
        "total_tests": $TOTAL_TESTS,
        "passed": $PASSED_TESTS,
        "failed": $FAILED_TESTS,
        "skipped": $SKIPPED_TESTS,
        "pass_rate": $(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l)
    },
    "files": {
        "csv_results": "$OUTPUT_FILE",
        "summary": "$SUMMARY_FILE"
    }
}
EOF

log "Summary saved to: $SUMMARY_FILE"
exit 0