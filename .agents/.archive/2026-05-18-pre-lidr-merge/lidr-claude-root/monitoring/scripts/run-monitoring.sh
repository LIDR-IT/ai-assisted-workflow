#!/bin/bash
# ECOSYSTEM CONTINUOUS MONITORING SCRIPT
# Runs scheduled health checks and generates reports

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR=".claude/monitoring/reports"
LOG_DIR=".claude/monitoring/logs"

echo "🔍 Starting ecosystem monitoring at $(date)"

# Function to run with timeout and logging
run_check() {
    local check_name=$1
    local script_path=$2
    local timeout=$3

    echo "Running $check_name..."
    if timeout $timeout $script_path > "$LOG_DIR/${check_name}_${TIMESTAMP}.log" 2>&1; then
        echo "✅ $check_name: PASSED"
        return 0
    else
        echo "❌ $check_name: FAILED"
        return 1
    fi
}

# Run health checks
FAILED_CHECKS=0

# 1. Coherence validation
if ! run_check "coherence" "npx tsx scripts/validate-coherence.ts" "300s"; then
    ((FAILED_CHECKS++))
fi

# 2. Integrity tests
if ! run_check "integrity" "npm run test:integrity" "600s"; then
    ((FAILED_CHECKS++))
fi

# 3. Audit standards (monthly only)
if [ "$(date +%d)" = "01" ]; then
    if ! run_check "audit" "npx tsx .claude/skills/audit-standards/scripts/run-audit.ts" "1800s"; then
        ((FAILED_CHECKS++))
    fi
fi

# Generate summary report
cat > "$REPORT_DIR/monitoring_summary_${TIMESTAMP}.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "failedChecks": $FAILED_CHECKS,
  "totalChecks": 3,
  "status": "$([ $FAILED_CHECKS -eq 0 ] && echo "HEALTHY" || echo "DEGRADED")",
  "details": {
    "coherence": "$(cat $LOG_DIR/coherence_${TIMESTAMP}.log | tail -n 1)",
    "integrity": "$(cat $LOG_DIR/integrity_${TIMESTAMP}.log | tail -n 1)",
    "lastAudit": "$(find $LOG_DIR -name "audit_*.log" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)"
  }
}
EOF

echo "📊 Monitoring complete. Failed checks: $FAILED_CHECKS"

# Send alerts if failures exceed threshold
if [ $FAILED_CHECKS -gt 1 ]; then
    echo "🚨 ALERT: $FAILED_CHECKS failed checks exceed threshold"
    # Call alerting script
    bash .claude/monitoring/scripts/send-alert.sh "$FAILED_CHECKS"
fi

exit $FAILED_CHECKS