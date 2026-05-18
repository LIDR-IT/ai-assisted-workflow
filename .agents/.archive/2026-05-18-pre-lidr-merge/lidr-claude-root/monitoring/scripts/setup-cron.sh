#!/bin/bash
# CRON SETUP SCRIPT
# Installs monitoring cron jobs from config.json

CONFIG_FILE=".claude/monitoring/config.json"
SCRIPT_DIR="$(dirname "$0")"

echo "📅 Setting up monitoring cron jobs..."

# Read schedules from config
if command -v jq >/dev/null && [ -f "$CONFIG_FILE" ]; then
    COHERENCE_SCHEDULE=$(jq -r '.schedules.coherence' "$CONFIG_FILE")
    AUDIT_SCHEDULE=$(jq -r '.schedules.audit' "$CONFIG_FILE")
    INTEGRITY_SCHEDULE=$(jq -r '.schedules.integrity' "$CONFIG_FILE")

    # Add to crontab (remove existing first)
    crontab -l 2>/dev/null | grep -v "ecosystem-monitoring" | crontab -

    (crontab -l 2>/dev/null; echo "$COHERENCE_SCHEDULE cd $(pwd) && bash .claude/monitoring/scripts/run-monitoring.sh coherence # ecosystem-monitoring") | crontab -
    (crontab -l 2>/dev/null; echo "$AUDIT_SCHEDULE cd $(pwd) && bash .claude/monitoring/scripts/run-monitoring.sh audit # ecosystem-monitoring") | crontab -
    (crontab -l 2>/dev/null; echo "$INTEGRITY_SCHEDULE cd $(pwd) && bash .claude/monitoring/scripts/run-monitoring.sh integrity # ecosystem-monitoring") | crontab -

    echo "✅ Cron jobs installed:"
    echo "   Coherence: $COHERENCE_SCHEDULE"
    echo "   Audit: $AUDIT_SCHEDULE"
    echo "   Integrity: $INTEGRITY_SCHEDULE"
else
    echo "❌ Could not read config.json or jq not available"
fi