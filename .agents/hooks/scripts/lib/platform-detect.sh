#!/bin/bash

# Platform Detection Utility
# Supports Claude Code, Gemini CLI, and Cursor

detect_platform() {
  # Check for Gemini CLI environment variables
  if [[ -n "${GEMINI_SESSION_ID}" ]] || [[ -n "${GEMINI_PROJECT_DIR}" ]]; then
    echo "gemini"
    return 0
  fi

  # Check for Claude Code environment variables
  if [[ -n "${CLAUDE_PROJECT_DIR}" ]] || [[ -n "${CLAUDE_PLUGIN_ROOT}" ]]; then
    echo "claude"
    return 0
  fi

  # Check for Cursor environment variables
  if [[ -n "${CURSOR_PROJECT_DIR}" ]]; then
    echo "cursor"
    return 0
  fi

  # Default to claude if no platform detected
  echo "claude"
  return 0
}

# Get project directory based on platform
get_project_dir() {
  local platform=$(detect_platform)

  case "$platform" in
    gemini)
      echo "${GEMINI_PROJECT_DIR:-$(pwd)}"
      ;;
    claude)
      echo "${CLAUDE_PROJECT_DIR:-$(pwd)}"
      ;;
    cursor)
      echo "${CURSOR_PROJECT_DIR:-$(pwd)}"
      ;;
    *)
      echo "$(pwd)"
      ;;
  esac
}

# Export functions for sourcing
export -f detect_platform
export -f get_project_dir
