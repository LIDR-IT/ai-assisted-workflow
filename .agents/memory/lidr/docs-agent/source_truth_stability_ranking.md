---
name: source_truth_stability_ranking
description: Ranking of 8 sources of truth by stability and drift propensity for monitoring prioritization
type: reference
---

# Sources of Truth Stability Ranking

Monitoring prioritization based on observed drift patterns and cleanup resilience.

## Stability Ranking (Most to Least Stable)

### 🥇 Tier 1: Rock Solid (Zero Drift)

**Priority**: Low monitoring - These sources are self-maintaining

#### 1. Skills Directory (.claude/skills/)

- **Count**: 61 SKILL.md files
- **Last Drift**: None detected
- **Why Stable**: Self-contained architecture, local templates, immutable structure
- **Monitoring**: Monthly count verification sufficient

#### 2. Commands Directory (.claude/commands/)

- **Count**: 23 \*.md files
- **Last Drift**: None detected
- **Why Stable**: Clear structure, well-defined scope, minimal dependencies
- **Monitoring**: Quarterly review sufficient

#### 3. Rules Directory (.claude/rules/)

- **Count**: 5 \*.md files
- **Last Drift**: None detected
- **Why Stable**: Core framework governance, infrequent changes, high attention
- **Monitoring**: Per-release verification sufficient

### 🥈 Tier 2: Stable with Caution (Minor Drift Risk)

**Priority**: Medium monitoring - Automated validation recommended

#### 4. Data Centralization System (src/data/)

- **Components**: artifacts/\*.ts, computed/stats.ts, phases.ts, client.ts
- **Last Drift**: Minor coherence warnings (7 info-level issues)
- **Why Mostly Stable**: Programmatic computation, anti-hardcoding validation
- **Risk**: Manual count updates can lag filesystem changes
- **Monitoring**: Weekly coherence validation runs

#### 5. Support Documentation (docs/)

- **Count**: 33 \*.md files
- **Last Drift**: Stale docs/projects/ references in rules
- **Why Mostly Stable**: Well-organized structure, regular cleanup phases
- **Risk**: Reference cascade failures after directory removal
- **Monitoring**: Monthly reference validation, quarterly cleanup

### 🥉 Tier 3: Moderate Drift (Active Management Required)

**Priority**: High monitoring - Weekly validation needed

#### 6. Central Index (CLAUDE.md)

- **Version**: 2.8.7 (manually maintained)
- **Last Drift**: Count methodology disputes, total calculation differences
- **Why Moderate Risk**: Manual maintenance, multiple counting sources
- **Risk**: Human lag updating after automated changes
- **Monitoring**: Pre-release count reconciliation with src/data/

### 🏃 Tier 4: High Drift Risk (Continuous Attention)

**Priority**: Critical monitoring - Daily/per-change validation

#### 7. Hooks Definition (docs/hooks/ vs .claude/hooks/)

- **Status**: Documentation exists (5 files) but no runtime implementation
- **Drift Type**: Conceptual confusion between "documented patterns" vs "executable artifacts"
- **Risk**: Persistent misunderstanding of hooks purpose and implementation
- **Monitoring**: Clarify hooks scope, update documentation strategy

#### 8. Validation Scripts Count (.claude/scripts/)

- **Claimed**: 59 scripts
- **Actual**: 34 Python files (.py)
- **Drift Type**: Counting methodology unclear (includes .ts tests?)
- **Risk**: Different tools count differently, no canonical definition
- **Monitoring**: Establish counting standards, automated reconciliation

## Monitoring Strategy by Tier

### Tier 1 (Rock Solid): Minimal Monitoring

- **Frequency**: Monthly/quarterly
- **Method**: Automated count verification
- **Alert Threshold**: Any count change
- **Owner**: System (automated)

### Tier 2 (Stable): Preventive Monitoring

- **Frequency**: Weekly
- **Method**: Automated validation + manual review
- **Alert Threshold**: Reference failures, coherence warnings
- **Owner**: Tech Lead

### Tier 3 (Moderate): Active Management

- **Frequency**: Per-release
- **Method**: Manual reconciliation required
- **Alert Threshold**: Count discrepancies >5%
- **Owner**: Tech Lead + PME

### Tier 4 (High Risk): Continuous Attention

- **Frequency**: Per-change + weekly review
- **Method**: Manual validation required
- **Alert Threshold**: Any inconsistency
- **Owner**: Architecture Team

## Drift Prevention Investment Priority

### High ROI: Fix Tier 4 Issues

1. **Establish hooks scope**: Documentation-only vs runtime artifacts
2. **Canonical validation script counting**: Python-only or TypeScript-only, not mixed
3. **Automated count reconciliation**: CLAUDE.md vs src/data/ synchronization

### Medium ROI: Strengthen Tier 3

1. **Reference validation automation**: Detect stale @references
2. **Count methodology documentation**: How each source calculates totals

### Low ROI: Tier 1-2 Maintenance

- Already stable, minimal intervention needed
- Focus on preserving current stability patterns
