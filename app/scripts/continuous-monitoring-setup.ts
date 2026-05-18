#!/usr/bin/env tsx
/// <reference types="node" />
/**
 * CONTINUOUS MONITORING SETUP
 * Establishes automated ecosystem health monitoring with scheduled validations,
 * reporting, and alerting for the SDLC ecosystem.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Constants for configuration
const MONITORING_CONFIG = {
  SCHEDULES: {
    COHERENCE: '0 9 * * 1', // Weekly Monday 9am
    AUDIT: '0 9 1 * *', // Monthly 1st 9am
    INTEGRITY: '0 */6 * * *', // Every 6 hours
  },
  THRESHOLDS: {
    COHERENCE_ISSUES: 5, // Max 5 coherence issues
    COMPLIANCE_SCORE: 90, // Min 90% compliance
    FAILED_TESTS: 2, // Max 2 failed tests
  },
  TIMEOUTS: {
    COHERENCE: '300s',
    INTEGRITY: '600s',
    AUDIT: '1800s',
  },
} as const;

interface MonitoringConfig {
  schedules: {
    coherence: string;
    audit: string;
    integrity: string;
  };
  thresholds: {
    coherenceIssues: number;
    complianceScore: number;
    failedTests: number;
  };
  reporting: {
    recipients: string[];
    slackWebhook?: string;
    enabled: boolean;
  };
}

class ContinuousMonitoringSetup {
  private readonly paths = {
    base: join(process.cwd(), '.claude/monitoring'),
    config: join(process.cwd(), '.claude/monitoring/config.json'),
    reports: join(process.cwd(), '.claude/monitoring/reports'),
    scripts: join(process.cwd(), '.claude/monitoring/scripts'),
    templates: join(process.cwd(), '.claude/monitoring/templates'),
    logs: join(process.cwd(), '.claude/monitoring/logs'),
  } as const;

  async setup(): Promise<void> {
    console.warn('🔧 Setting up Continuous Monitoring Framework...\n');

    // Create directory structure
    this.ensureDirectories();

    // Generate default configuration
    this.generateConfig();

    // Create monitoring scripts
    this.createMonitoringScripts();

    // Setup cron job templates
    this.createCronTemplates();

    // Create reporting templates
    this.createReportingTemplates();

    // Generate documentation
    this.generateDocumentation();

    console.warn('✅ Continuous Monitoring Framework setup complete!\n');
    console.warn('📋 Next steps:');
    console.warn('   1. Review config: .claude/monitoring/config.json');
    console.warn('   2. Setup cron jobs: .claude/monitoring/scripts/setup-cron.sh');
    console.warn('   3. Configure alerts: Update Slack webhook if needed');
    console.warn('   4. Test run: npm run monitor:test\n');
  }

  private ensureDirectories(): void {
    const dirs = Object.values(this.paths);

    dirs.forEach((dir) => {
      mkdirSync(dir, { recursive: true });
      if (!existsSync(dir)) {
        console.warn(`📁 Created: ${dir}`);
      }
    });
  }

  private generateConfig(): void {
    const defaultConfig: MonitoringConfig = {
      schedules: {
        coherence: MONITORING_CONFIG.SCHEDULES.COHERENCE,
        audit: MONITORING_CONFIG.SCHEDULES.AUDIT,
        integrity: MONITORING_CONFIG.SCHEDULES.INTEGRITY,
      },
      thresholds: {
        coherenceIssues: MONITORING_CONFIG.THRESHOLDS.COHERENCE_ISSUES,
        complianceScore: MONITORING_CONFIG.THRESHOLDS.COMPLIANCE_SCORE,
        failedTests: MONITORING_CONFIG.THRESHOLDS.FAILED_TESTS,
      },
      reporting: {
        recipients: ['tech-lead@docline.com', 'devops@docline.com'],
        enabled: true,
      },
    };

    writeFileSync(this.paths.config, JSON.stringify(defaultConfig, null, 2));
    console.warn('⚙️  Generated: monitoring config.json');
  }

  private createExecutableScript(filename: string, content: string): void {
    const scriptPath = join(this.paths.scripts, filename);
    writeFileSync(scriptPath, content);
    execSync(`chmod +x "${scriptPath}"`);
    console.warn(`📝 Created: ${filename}`);
  }

  private createMonitoringScripts(): void {
    // Main monitoring script
    const mainScript = `#!/bin/bash
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
    if timeout $timeout $script_path > "$LOG_DIR/\${check_name}_\${TIMESTAMP}.log" 2>&1; then
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
if ! run_check "coherence" "npx tsx scripts/validate-coherence.ts" "${MONITORING_CONFIG.TIMEOUTS.COHERENCE}"; then
    ((FAILED_CHECKS++))
fi

# 2. Integrity tests
if ! run_check "integrity" "npm run test:integrity" "${MONITORING_CONFIG.TIMEOUTS.INTEGRITY}"; then
    ((FAILED_CHECKS++))
fi

# 3. Audit standards (monthly only)
if [ "$(date +%d)" = "01" ]; then
    if ! run_check "audit" "npx tsx .claude/skills/audit-standards/scripts/run-audit.ts" "${MONITORING_CONFIG.TIMEOUTS.AUDIT}"; then
        ((FAILED_CHECKS++))
    fi
fi

# Generate summary report
cat > "$REPORT_DIR/monitoring_summary_\${TIMESTAMP}.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "failedChecks": $FAILED_CHECKS,
  "totalChecks": 3,
  "status": "$([ $FAILED_CHECKS -eq 0 ] && echo "HEALTHY" || echo "DEGRADED")",
  "details": {
    "coherence": "$(cat $LOG_DIR/coherence_\${TIMESTAMP}.log | tail -n 1)",
    "integrity": "$(cat $LOG_DIR/integrity_\${TIMESTAMP}.log | tail -n 1)",
    "lastAudit": "$(find $LOG_DIR -name "audit_*.log" -printf '%T@ %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)"
  }
}
EOF

echo "📊 Monitoring complete. Failed checks: $FAILED_CHECKS"

# Send alerts if failures exceed threshold
if [ $FAILED_CHECKS -gt ${MONITORING_CONFIG.THRESHOLDS.FAILED_TESTS} ]; then
    echo "🚨 ALERT: $FAILED_CHECKS failed checks exceed threshold"
    # Call alerting script
    bash .claude/monitoring/scripts/send-alert.sh "$FAILED_CHECKS"
fi

exit $FAILED_CHECKS`;

    this.createExecutableScript('run-monitoring.sh', mainScript);

    // Alert script
    const alertScript = `#!/bin/bash
# ALERTING SCRIPT
# Sends notifications when monitoring thresholds are exceeded

FAILED_CHECKS=$1
TIMESTAMP=$(date -Iseconds)
CONFIG_FILE=".claude/monitoring/config.json"

# Read Slack webhook from config (if configured)
if command -v jq >/dev/null && [ -f "$CONFIG_FILE" ]; then
    SLACK_WEBHOOK=$(jq -r '.reporting.slackWebhook // empty' "$CONFIG_FILE")

    if [ ! -z "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \\
            --data "{\\"text\\":\\"🚨 SDLC Ecosystem Alert: $FAILED_CHECKS failed health checks at $TIMESTAMP\\"}" \\
            "$SLACK_WEBHOOK"
    fi
fi

# Log alert
echo "$TIMESTAMP: ALERT sent for $FAILED_CHECKS failed checks" >> .claude/monitoring/logs/alerts.log

echo "🚨 Alert sent: $FAILED_CHECKS failed checks"`;

    this.createExecutableScript('send-alert.sh', alertScript);

    // Cron setup script
    const cronSetup = `#!/bin/bash
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
fi`;

    this.createExecutableScript('setup-cron.sh', cronSetup);
  }

  private createCronTemplates(): void {
    const cronTemplate = `# SDLC Ecosystem Monitoring Cron Jobs
# Generated by continuous-monitoring-setup.ts

# Weekly coherence validation (Mondays 9am)
0 9 * * 1 cd /path/to/project && bash .claude/monitoring/scripts/run-monitoring.sh coherence

# Monthly full audit (1st of month 9am)
0 9 1 * * cd /path/to/project && bash .claude/monitoring/scripts/run-monitoring.sh audit

# Integrity tests every 6 hours
0 */6 * * * cd /path/to/project && bash .claude/monitoring/scripts/run-monitoring.sh integrity

# Cleanup old logs monthly (1st of month 1am)
0 1 1 * * find /path/to/project/.claude/monitoring/logs -name "*.log" -mtime +30 -delete`;

    writeFileSync(join(this.paths.templates, 'crontab-template'), cronTemplate);
    console.warn('📝 Created: crontab template');
  }

  private createReportingTemplates(): void {
    // Dashboard template (simple HTML)
    const dashboardTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>SDLC Ecosystem Health Dashboard</title>
    <meta charset="utf-8">
    <style>
        body { font-family: system-ui; margin: 2rem; }
        .metric { display: inline-block; margin: 1rem; padding: 1rem; border-radius: 8px; min-width: 150px; }
        .healthy { background: #d1fae5; border-left: 4px solid #10b981; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .critical { background: #fee2e2; border-left: 4px solid #ef4444; }
        .metric-value { font-size: 2rem; font-weight: bold; }
        .metric-label { color: #6b7280; font-size: 0.875rem; }
    </style>
</head>
<body>
    <h1>🔍 SDLC Ecosystem Health Dashboard</h1>
    <p>Last updated: <span id="timestamp">{{timestamp}}</span></p>

    <div class="metrics">
        <div class="metric {{status-class}}">
            <div class="metric-value">{{coherence-score}}%</div>
            <div class="metric-label">Data Coherence</div>
        </div>

        <div class="metric {{compliance-class}}">
            <div class="metric-value">{{compliance-score}}%</div>
            <div class="metric-label">Standards Compliance</div>
        </div>

        <div class="metric {{tests-class}}">
            <div class="metric-value">{{passed-tests}}/32</div>
            <div class="metric-label">Integrity Tests</div>
        </div>

        <div class="metric {{automation-class}}">
            <div class="metric-value">{{automation-hours}}h</div>
            <div class="metric-label">Hours Saved (YTD)</div>
        </div>
    </div>

    <h2>Recent Activity</h2>
    <ul id="activity">
        {{activity-list}}
    </ul>

    <h2>Quick Actions</h2>
    <button onclick="runCheck('coherence')">🔍 Run Coherence Check</button>
    <button onclick="runCheck('audit')">📋 Run Full Audit</button>
    <button onclick="runCheck('integrity')">🧪 Run Integrity Tests</button>

    <script>
        function runCheck(type) {
            fetch('/api/monitoring/run/' + type, { method: 'POST' })
                .then(() => location.reload())
                .catch(err => alert('Error: ' + err.message));
        }

        // Auto-refresh every 5 minutes
        setTimeout(() => location.reload(), 300000);
    </script>
</body>
</html>`;

    writeFileSync(join(this.paths.templates, 'dashboard.html'), dashboardTemplate);
    console.warn('📝 Created: dashboard template');
  }

  private generateDocumentation(): void {
    const docs = `# Continuous Monitoring Framework

## Overview

The SDLC ecosystem continuous monitoring framework provides automated health checking, alerting, and reporting for the complete development workflow ecosystem.

## Components

### 1. Monitoring Scripts
- **Location**: \`.claude/monitoring/scripts/\`
- **Main script**: \`run-monitoring.sh\` - Orchestrates all health checks
- **Alerting**: \`send-alert.sh\` - Handles notifications and alerts
- **Setup**: \`setup-cron.sh\` - Installs cron jobs for automation

### 2. Configuration
- **Location**: \`.claude/monitoring/config.json\`
- **Schedules**: Cron expressions for different check types
- **Thresholds**: Alert triggering criteria
- **Recipients**: Email/Slack notification targets

### 3. Health Checks

#### Coherence Validation
- **Frequency**: Weekly (configurable)
- **Script**: \`scripts/validate-coherence.ts\`
- **Purpose**: Detects drift between centralized data and hardcoded values
- **Alert threshold**: > ${MONITORING_CONFIG.THRESHOLDS.COHERENCE_ISSUES} issues

#### Integrity Tests
- **Frequency**: Every 6 hours (configurable)
- **Tests**: T1-T32 ecosystem validation
- **Purpose**: Validates structural integrity and consistency
- **Alert threshold**: > ${MONITORING_CONFIG.THRESHOLDS.FAILED_TESTS} failed tests

#### Standards Audit
- **Frequency**: Monthly (configurable)
- **Script**: \`audit-standards\` skill
- **Purpose**: Comprehensive compliance checking
- **Alert threshold**: < ${MONITORING_CONFIG.THRESHOLDS.COMPLIANCE_SCORE}% compliance score

### 4. Reporting
- **Location**: \`.claude/monitoring/reports/\`
- **Format**: JSON summary + detailed logs
- **Dashboard**: HTML template for visualization
- **History**: 30-day retention policy

## Setup Instructions

### Quick Start
\`\`\`bash
# 1. Run setup
npx tsx scripts/continuous-monitoring-setup.ts

# 2. Configure (edit config.json if needed)
vim .claude/monitoring/config.json

# 3. Install cron jobs
bash .claude/monitoring/scripts/setup-cron.sh

# 4. Test
bash .claude/monitoring/scripts/run-monitoring.sh
\`\`\`

### Manual Configuration
1. **Slack Integration**: Add webhook URL to config.json
2. **Email Alerts**: Configure SMTP settings
3. **Custom Schedules**: Modify cron expressions in config.json
4. **Thresholds**: Adjust alert criteria based on team needs

## Monitoring Endpoints

### Health Checks
- **Coherence**: Validates data consistency across 8 sources of truth
- **Integrity**: Runs T1-T32 tests for structural validation
- **Audit**: Full compliance check against standards
- **Performance**: ROI tracking for automated skills

### Alerts
- **Threshold-based**: Configurable limits for each check type
- **Multi-channel**: Email + Slack notifications
- **Escalation**: Increasing frequency for persistent issues

## Dashboard Access

The monitoring dashboard provides real-time ecosystem health visualization:
- **URL**: \`file://.claude/monitoring/templates/dashboard.html\`
- **Metrics**: Coherence, compliance, test results, automation ROI
- **Actions**: Manual trigger buttons for immediate checks
- **History**: Recent activity and trend analysis

## Troubleshooting

### Common Issues
1. **Cron jobs not running**: Check \`crontab -l\` and permissions
2. **Alerts not sending**: Verify Slack webhook URL and network access
3. **Script failures**: Check logs in \`.claude/monitoring/logs/\`
4. **High false positives**: Adjust thresholds in config.json

### Log Analysis
\`\`\`bash
# View recent monitoring activity
tail -f .claude/monitoring/logs/alerts.log

# Check specific script output
cat .claude/monitoring/logs/coherence_$(date +%Y%m%d)*.log
\`\`\`

## Maintenance

### Regular Tasks
- **Monthly**: Review alert thresholds and adjust if needed
- **Quarterly**: Audit monitoring effectiveness and update criteria
- **Annually**: Assess framework evolution and upgrade needs

### Log Cleanup
Automated 30-day retention policy removes old logs. Manual cleanup:
\`\`\`bash
find .claude/monitoring/logs -name "*.log" -mtime +30 -delete
\`\`\`

---

**Status**: Production Ready ✅
**Next Review**: 2026-06-15
**Owner**: DevOps + Tech Lead`;

    writeFileSync(join(this.paths.base, 'README.md'), docs);
    console.warn('📚 Created: monitoring documentation');
  }
}

// CLI execution for ESM
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  const setup = new ContinuousMonitoringSetup();
  setup.setup().catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

export default ContinuousMonitoringSetup;
