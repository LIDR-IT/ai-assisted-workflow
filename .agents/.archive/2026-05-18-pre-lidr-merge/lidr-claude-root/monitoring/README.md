# Continuous Monitoring Framework

## Overview

The SDLC ecosystem continuous monitoring framework provides automated health checking, alerting, and reporting for the complete development workflow ecosystem.

## Components

### 1. Monitoring Scripts

- **Location**: `.claude/monitoring/scripts/`
- **Main script**: `run-monitoring.sh` - Orchestrates all health checks
- **Alerting**: `send-alert.sh` - Handles notifications and alerts
- **Setup**: `setup-cron.sh` - Installs cron jobs for automation

### 2. Configuration

- **Location**: `.claude/monitoring/config.json`
- **Schedules**: Cron expressions for different check types
- **Thresholds**: Alert triggering criteria
- **Recipients**: Email/Slack notification targets

### 3. Health Checks

#### Coherence Validation

- **Frequency**: Weekly (configurable)
- **Script**: `scripts/validate-coherence.ts`
- **Purpose**: Detects drift between centralized data and hardcoded values
- **Alert threshold**: > 5 issues

#### Integrity Tests

- **Frequency**: Every 6 hours (configurable)
- **Tests**: T1-T32 ecosystem validation
- **Purpose**: Validates structural integrity and consistency
- **Alert threshold**: > 2 failed tests

#### Standards Audit

- **Frequency**: Monthly (configurable)
- **Script**: `audit-standards` skill
- **Purpose**: Comprehensive compliance checking
- **Alert threshold**: < 90% compliance score

### 4. Reporting

- **Location**: `.claude/monitoring/reports/`
- **Format**: JSON summary + detailed logs
- **Dashboard**: HTML template for visualization
- **History**: 30-day retention policy

## Setup Instructions

### Quick Start

```bash
# 1. Run setup
npx tsx scripts/continuous-monitoring-setup.ts

# 2. Configure (edit config.json if needed)
vim .claude/monitoring/config.json

# 3. Install cron jobs
bash .claude/monitoring/scripts/setup-cron.sh

# 4. Test
bash .claude/monitoring/scripts/run-monitoring.sh
```

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

- **URL**: `file://.claude/monitoring/templates/dashboard.html`
- **Metrics**: Coherence, compliance, test results, automation ROI
- **Actions**: Manual trigger buttons for immediate checks
- **History**: Recent activity and trend analysis

## Troubleshooting

### Common Issues

1. **Cron jobs not running**: Check `crontab -l` and permissions
2. **Alerts not sending**: Verify Slack webhook URL and network access
3. **Script failures**: Check logs in `.claude/monitoring/logs/`
4. **High false positives**: Adjust thresholds in config.json

### Log Analysis

```bash
# View recent monitoring activity
tail -f .claude/monitoring/logs/alerts.log

# Check specific script output
cat .claude/monitoring/logs/coherence_$(date +%Y%m%d)*.log
```

## Maintenance

### Regular Tasks

- **Monthly**: Review alert thresholds and adjust if needed
- **Quarterly**: Audit monitoring effectiveness and update criteria
- **Annually**: Assess framework evolution and upgrade needs

### Log Cleanup

Automated 30-day retention policy removes old logs. Manual cleanup:

```bash
find .claude/monitoring/logs -name "*.log" -mtime +30 -delete
```

---

**Status**: Production Ready ✅
**Next Review**: 2026-06-15
**Owner**: DevOps + Tech Lead
