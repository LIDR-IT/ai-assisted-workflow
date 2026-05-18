#!/bin/bash
set -euo pipefail

# Extract merged PRs and generate release notes
# Usage: ./release-notes.sh [--since TAG] [--until TAG] [--format FORMAT]
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
    echo "  --since TAG         Start from this tag (default: latest tag)"
    echo "  --until TAG         End at this tag (default: HEAD)"
    echo "  --format FORMAT     Output format: markdown, json, csv (default: markdown)"
    echo "  --output FILE       Output file (default: stdout)"
    echo "  --include-authors   Include PR authors in output"
    echo "  --group-by TYPE     Group by: label, author, none (default: label)"
    echo "  --help             Show this help message"
    exit 0
}

check_dependencies() {
    command -v gh >/dev/null 2>&1 || error "GitHub CLI (gh) is required"
    command -v git >/dev/null 2>&1 || error "Git is required"
    command -v jq >/dev/null 2>&1 || error "jq is required for JSON processing"

    # Check if we're in a git repository
    git rev-parse --git-dir >/dev/null 2>&1 || error "Not in a git repository"

    # Test GitHub authentication
    if ! gh auth status >/dev/null 2>&1; then
        error "GitHub CLI not authenticated. Run 'gh auth login'"
    fi
}

get_latest_tag() {
    git describe --tags --abbrev=0 2>/dev/null || echo ""
}

get_merged_prs() {
    local since_ref="$1"
    local until_ref="$2"

    log "Fetching merged PRs between $since_ref and $until_ref"

    # Get commit range
    local commit_range
    if [[ -n "$since_ref" ]]; then
        commit_range="${since_ref}..${until_ref}"
    else
        commit_range="$until_ref"
    fi

    # Get commits in range
    local commits=$(git log --format="%H" "$commit_range" | head -100)

    # For each commit, check if it was from a merged PR
    echo "["
    local first=true
    for commit in $commits; do
        local pr_info=$(gh pr list --search "$commit" --state merged --json number,title,mergedAt,author,labels,url --limit 1 2>/dev/null || echo "[]")

        if [[ "$pr_info" != "[]" ]] && [[ "$(echo "$pr_info" | jq length)" -gt 0 ]]; then
            if [[ "$first" != "true" ]]; then
                echo ","
            fi
            echo "$pr_info" | jq -c '.[0] | . + {"commit": "'$commit'"}'
            first=false
        fi
    done
    echo "]"
}

categorize_prs() {
    local prs="$1"

    # Initialize categories
    local features='[]'
    local bugfixes='[]'
    local performance='[]'
    local documentation='[]'
    local refactoring='[]'
    local other='[]'

    echo "$prs" | jq -c '.[]' | while read -r pr; do
        local labels=$(echo "$pr" | jq -r '.labels[].name' | tr '\n' ' ')
        local title=$(echo "$pr" | jq -r '.title')

        # Categorize based on labels or title
        if echo "$labels $title" | grep -qi 'feat\|feature\|enhancement'; then
            features=$(echo "$features" | jq ". + [$pr]")
        elif echo "$labels $title" | grep -qi 'bug\|fix\|hotfix'; then
            bugfixes=$(echo "$bugfixes" | jq ". + [$pr]")
        elif echo "$labels $title" | grep -qi 'perf\|performance\|optimization'; then
            performance=$(echo "$performance" | jq ". + [$pr]")
        elif echo "$labels $title" | grep -qi 'doc\|documentation'; then
            documentation=$(echo "$documentation" | jq ". + [$pr]")
        elif echo "$labels $title" | grep -qi 'refactor\|cleanup\|style'; then
            refactoring=$(echo "$refactoring" | jq ". + [$pr]")
        else
            other=$(echo "$other" | jq ". + [$pr]")
        fi
    done

    jq -n \
        --argjson features "$features" \
        --argjson bugfixes "$bugfixes" \
        --argjson performance "$performance" \
        --argjson documentation "$documentation" \
        --argjson refactoring "$refactoring" \
        --argjson other "$other" \
        '{
            "features": $features,
            "bugfixes": $bugfixes,
            "performance": $performance,
            "documentation": $documentation,
            "refactoring": $refactoring,
            "other": $other
        }'
}

format_markdown() {
    local categorized="$1"
    local since_ref="$2"
    local until_ref="$3"
    local include_authors="$4"

    local version_info=""
    if [[ -n "$since_ref" ]]; then
        version_info="Changes from $since_ref to $until_ref"
    else
        version_info="Changes in $until_ref"
    fi

    cat << EOF
# Release Notes

**$version_info**
**Generated:** $(date '+%Y-%m-%d %H:%M:%S')

EOF

    # Process each category
    local categories=("features" "bugfixes" "performance" "documentation" "refactoring" "other")
    local titles=("🚀 Features" "🐛 Bug Fixes" "⚡ Performance" "📝 Documentation" "♻️ Refactoring" "🔧 Other")

    for i in "${!categories[@]}"; do
        local category="${categories[$i]}"
        local title="${titles[$i]}"
        local prs=$(echo "$categorized" | jq -r ".${category}[]?")

        if [[ -n "$prs" ]]; then
            echo "## $title"
            echo

            echo "$categorized" | jq -c ".${category}[]" | while read -r pr; do
                local pr_title=$(echo "$pr" | jq -r '.title')
                local pr_number=$(echo "$pr" | jq -r '.number')
                local pr_url=$(echo "$pr" | jq -r '.url')
                local pr_author=$(echo "$pr" | jq -r '.author.login')

                if [[ "$include_authors" == "true" ]]; then
                    echo "- $pr_title ([#$pr_number]($pr_url)) by @$pr_author"
                else
                    echo "- $pr_title ([#$pr_number]($pr_url))"
                fi
            done

            echo
        fi
    done

    # Add contributors section if requested
    if [[ "$include_authors" == "true" ]]; then
        echo "## 👥 Contributors"
        echo

        echo "$categorized" | jq -r 'to_entries[] | .value[] | .author.login' | sort -u | while read -r author; do
            echo "- @$author"
        done

        echo
    fi

    # Add footer
    cat << EOF

---
*Generated automatically by release-notes.sh*
EOF
}

format_json() {
    local categorized="$1"
    local since_ref="$2"
    local until_ref="$3"

    jq -n \
        --argjson categorized "$categorized" \
        --arg since "$since_ref" \
        --arg until "$until_ref" \
        --arg generated "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)" \
        '{
            "version_range": {
                "since": $since,
                "until": $until
            },
            "generated_at": $generated,
            "changes": $categorized,
            "summary": {
                "total_prs": ($categorized | to_entries | map(.value | length) | add),
                "by_category": ($categorized | to_entries | map({key: .key, count: (.value | length)}) | from_entries)
            }
        }'
}

format_csv() {
    local categorized="$1"

    echo "Category,PR Number,Title,Author,Merged At,URL"

    echo "$categorized" | jq -r 'to_entries[] | .key as $category | .value[] | [
        $category,
        .number,
        .title,
        .author.login,
        .mergedAt,
        .url
    ] | @csv'
}

main() {
    # Parse arguments
    local since_tag=""
    local until_ref="HEAD"
    local output_format="markdown"
    local output_file=""
    local include_authors="false"
    local group_by="label"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --since) since_tag="$2"; shift 2 ;;
            --until) until_ref="$2"; shift 2 ;;
            --format) output_format="$2"; shift 2 ;;
            --output) output_file="$2"; shift 2 ;;
            --include-authors) include_authors="true"; shift ;;
            --group-by) group_by="$2"; shift 2 ;;
            --help) usage ;;
            *) error "Unknown option: $1" ;;
        esac
    done

    # Validate format
    case "$output_format" in
        markdown|json|csv) ;;
        *) error "Invalid format: $output_format. Use markdown, json, or csv" ;;
    esac

    # Check dependencies
    check_dependencies

    # Get since reference
    if [[ -z "$since_tag" ]]; then
        since_tag=$(get_latest_tag)
        if [[ -z "$since_tag" ]]; then
            log "WARN: No previous tags found, including all commits"
        else
            log "Using latest tag as start: $since_tag"
        fi
    fi

    # Get merged PRs
    log "Extracting release notes from $since_tag to $until_ref"
    local prs=$(get_merged_prs "$since_tag" "$until_ref")
    local pr_count=$(echo "$prs" | jq 'length')

    log "Found $pr_count merged PRs"

    if [[ "$pr_count" -eq 0 ]]; then
        log "No PRs found in range"
        exit 0
    fi

    # Categorize PRs
    log "Categorizing PRs..."
    local categorized=$(categorize_prs "$prs")

    # Generate output
    local output=""
    case "$output_format" in
        markdown) output=$(format_markdown "$categorized" "$since_tag" "$until_ref" "$include_authors") ;;
        json) output=$(format_json "$categorized" "$since_tag" "$until_ref") ;;
        csv) output=$(format_csv "$categorized") ;;
    esac

    # Write output
    if [[ -n "$output_file" ]]; then
        echo "$output" > "$output_file"
        log "Release notes written to: $output_file"
    else
        echo "$output"
    fi

    log "Release notes generation completed"
}

# Execute main function
main "$@"