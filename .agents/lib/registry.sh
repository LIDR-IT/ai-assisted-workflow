#!/bin/bash
# Functions to query the platforms.json registry

REGISTRY_FILE="${AGENTS_DIR}/platforms.json"

# List all platform IDs
# Usage: list_platforms → "cursor claude gemini copilot antigravity"
list_platforms() {
  jq -r '.platforms | keys[]' "$REGISTRY_FILE"
}

# Get platform display name
# Usage: platform_name "copilot" → "Copilot (VSCode)"
platform_name() {
  jq -r ".platforms.\"$1\".name" "$REGISTRY_FILE"
}

# Get platform emoji
platform_emoji() {
  jq -r ".platforms.\"$1\".emoji" "$REGISTRY_FILE"
}

# Get platform output directory
platform_output_dir() {
  jq -r ".platforms.\"$1\".output_dir" "$REGISTRY_FILE"
}

# Check if platform supports a component
# Usage: platform_supports "copilot" "rules" → exit 0 (true) or 1 (false)
platform_supports() {
  local platform=$1 component=$2
  jq -e ".platforms.\"$platform\".components.\"$component\"" "$REGISTRY_FILE" &>/dev/null
}

# Get component strategy for a platform
# Usage: platform_strategy "copilot" "rules" → "copy-flatten"
platform_strategy() {
  jq -r ".platforms.\"$1\".components.\"$2\".strategy // empty" "$REGISTRY_FILE"
}

# Get component config value
# Usage: platform_config "copilot" "rules" "extension" → ".instructions.md"
platform_config() {
  jq -r ".platforms.\"$1\".components.\"$2\".\"$3\" // empty" "$REGISTRY_FILE"
}
