#!/bin/bash
# ALERTING SCRIPT
# Sends notifications when monitoring thresholds are exceeded

FAILED_CHECKS=$1
TIMESTAMP=$(date -Iseconds)
CONFIG_FILE=".claude/monitoring/config.json"

# Read Slack webhook from config (if configured)
if command -v jq >/dev/null && [ -f "$CONFIG_FILE" ]; then
    SLACK_WEBHOOK=$(jq -r '.reporting.slackWebhook // empty' "$CONFIG_FILE")

    if [ ! -z "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 SDLC Ecosystem Alert: $FAILED_CHECKS failed health checks at $TIMESTAMP\"}" \
            "$SLACK_WEBHOOK"
    fi
fi

# Log alert
echo "$TIMESTAMP: ALERT sent for $FAILED_CHECKS failed checks" >> .claude/monitoring/logs/alerts.log

echo "🚨 Alert sent: $FAILED_CHECKS failed checks"