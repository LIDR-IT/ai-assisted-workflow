# Test Plan: {{PROJECT_NAME}} - {{RELEASE_VERSION}}

| Campo       | Valor                                     |
| ----------- | ----------------------------------------- |
| **ID**      | TP-{{YYYY}}-{{NNN}}                       |
| **Release** | {{VERSION}}                               |
| **QA Lead** | {{QA_LEAD_NAME}}                          |
| **Estado**  | {{Draft/Approved/In Execution/Completed}} |

## 1. Alcance

### In Scope

| Functionality       | RFs            | Test Types       | Priority       |
| ------------------- | -------------- | ---------------- | -------------- |
| {{FUNCTIONALITY_A}} | {{RF_RANGE_A}} | {{TEST_TYPES_A}} | {{PRIORITY_A}} |
| {{FUNCTIONALITY_B}} | {{RF_RANGE_B}} | {{TEST_TYPES_B}} | {{PRIORITY_B}} |
| {{FUNCTIONALITY_C}} | {{RF_RANGE_C}} | {{TEST_TYPES_C}} | {{PRIORITY_C}} |

### Out of Scope

| Exclusion       | Reason       | When           |
| --------------- | ------------ | -------------- |
| {{EXCLUSION_A}} | {{REASON_A}} | {{TIMELINE_A}} |
| {{EXCLUSION_B}} | {{REASON_B}} | {{TIMELINE_B}} |

### Assumptions

- {{ASSUMPTION_1}}
- {{ASSUMPTION_2}}
- {{ASSUMPTION_3}}

### Testing Risks

| Risk       | Probability       | Impact       | Mitigation       |
| ---------- | ----------------- | ------------ | ---------------- |
| {{RISK_A}} | {{PROBABILITY_A}} | {{IMPACT_A}} | {{MITIGATION_A}} |
| {{RISK_B}} | {{PROBABILITY_B}} | {{IMPACT_B}} | {{MITIGATION_B}} |
| {{RISK_C}} | {{PROBABILITY_C}} | {{IMPACT_C}} | {{MITIGATION_C}} |

## 2. Test Strategy

### Testing Levels

| Level       | Responsible       | Tool       | Automated? | Coverage Target | Focus Area  |
| ----------- | ----------------- | ---------- | ---------- | --------------- | ----------- |
| {{LEVEL_A}} | {{RESPONSIBLE_A}} | {{TOOL_A}} | {{AUTO_A}} | {{TARGET_A}}    | {{FOCUS_A}} |
| {{LEVEL_B}} | {{RESPONSIBLE_B}} | {{TOOL_B}} | {{AUTO_B}} | {{TARGET_B}}    | {{FOCUS_B}} |
| {{LEVEL_C}} | {{RESPONSIBLE_C}} | {{TOOL_C}} | {{AUTO_C}} | {{TARGET_C}}    | {{FOCUS_C}} |

### Test Types per Functionality

| Functionality | Functional      | Performance     | Security       | Compatibility     | Usability     |
| ------------- | --------------- | --------------- | -------------- | ----------------- | ------------- |
| {{FUNC_A}}    | {{FUNC_TEST_A}} | {{PERF_TEST_A}} | {{SEC_TEST_A}} | {{COMPAT_TEST_A}} | {{UX_TEST_A}} |
| {{FUNC_B}}    | {{FUNC_TEST_B}} | {{PERF_TEST_B}} | {{SEC_TEST_B}} | {{COMPAT_TEST_B}} | {{UX_TEST_B}} |

### Risk-Based Approach

| Area       | Risk Level       | Testing Effort % | Justification       |
| ---------- | ---------------- | ---------------- | ------------------- |
| {{AREA_A}} | {{RISK_LEVEL_A}} | {{EFFORT_A}}     | {{JUSTIFICATION_A}} |
| {{AREA_B}} | {{RISK_LEVEL_B}} | {{EFFORT_B}}     | {{JUSTIFICATION_B}} |
| {{AREA_C}} | {{RISK_LEVEL_C}} | {{EFFORT_C}}     | {{JUSTIFICATION_C}} |

## 3. Entry/Exit Criteria

### Entry Criteria

| Criterion                                         | Verified by          | Status       |
| ------------------------------------------------- | -------------------- | ------------ |
| All {{SCOPE_ITEMS}} implemented and code-complete | {{TECH_LEAD}}        | {{STATUS_1}} |
| Unit tests pass rate ≥{{UNIT_THRESHOLD}}%         | CI Pipeline          | {{STATUS_2}} |
| {{SECURITY_SCAN_TYPE}} scans show 0 Critical/High | Security Team        | {{STATUS_3}} |
| Test environments provisioned with {{DATA_TYPE}}  | DevOps               | {{STATUS_4}} |
| {{SPECIALIZED_CRITERIA}} available                | {{RESPONSIBLE_TEAM}} | {{STATUS_5}} |

### Exit Criteria

| Criterion                     | Threshold                 | Negotiable?                |
| ----------------------------- | ------------------------- | -------------------------- |
| {{QUALITY_METRIC_A}}          | {{THRESHOLD_A}}           | {{NEGOTIABLE_A}}           |
| {{COMPLIANCE_REQUIREMENT}}    | {{COMPLIANCE_THRESHOLD}}  | NO                         |
| Security vulnerability scan   | 0 Critical, 0 High        | NO                         |
| Performance SLA               | {{PERFORMANCE_TARGET}}    | {{NEGOTIABLE_PERF}}        |
| {{SPECIALIZED_EXIT_CRITERIA}} | {{SPECIALIZED_THRESHOLD}} | {{NEGOTIABLE_SPECIALIZED}} |
| Regression test suite         | 100% pass rate            | NO                         |

### Suspension Criteria

| Trigger                  | Action                  |
| ------------------------ | ----------------------- |
| {{SUSPENSION_TRIGGER_A}} | {{SUSPENSION_ACTION_A}} |
| {{SUSPENSION_TRIGGER_B}} | {{SUSPENSION_ACTION_B}} |

## 4. Test Cases Summary

| RF       | US       | Functional       | Integration     | Performance      | Security        | E2E             |
| -------- | -------- | ---------------- | --------------- | ---------------- | --------------- | --------------- |
| {{RF_A}} | {{US_A}} | {{COUNT_FUNC_A}} | {{COUNT_INT_A}} | {{COUNT_PERF_A}} | {{COUNT_SEC_A}} | {{COUNT_E2E_A}} |
| {{RF_B}} | {{US_B}} | {{COUNT_FUNC_B}} | {{COUNT_INT_B}} | {{COUNT_PERF_B}} | {{COUNT_SEC_B}} | {{COUNT_E2E_B}} |

## 5. Test Environments

| Env       | URL       | Purpose       | Data            | Availability       |
| --------- | --------- | ------------- | --------------- | ------------------ |
| {{ENV_A}} | {{URL_A}} | {{PURPOSE_A}} | {{DATA_TYPE_A}} | {{AVAILABILITY_A}} |
| {{ENV_B}} | {{URL_B}} | {{PURPOSE_B}} | {{DATA_TYPE_B}} | {{AVAILABILITY_B}} |
| {{ENV_C}} | {{URL_C}} | {{PURPOSE_C}} | {{DATA_TYPE_C}} | {{AVAILABILITY_C}} |

## 6. Test Data Strategy

### Data Types

| Type            | Source       | Management       | Refresh       | Privacy       |
| --------------- | ------------ | ---------------- | ------------- | ------------- |
| {{DATA_TYPE_A}} | {{SOURCE_A}} | {{MANAGEMENT_A}} | {{REFRESH_A}} | {{PRIVACY_A}} |
| {{DATA_TYPE_B}} | {{SOURCE_B}} | {{MANAGEMENT_B}} | {{REFRESH_B}} | {{PRIVACY_B}} |

### Sensitive Data Handling

- {{SENSITIVE_DATA_POLICY}}
- {{DATA_MASKING_STRATEGY}}
- {{RETENTION_POLICY}}

### {{SPECIALIZED_DATA_SECTION}}

- {{SPECIALIZED_DATA_TYPE_A}}: {{DESCRIPTION_A}}
- {{SPECIALIZED_DATA_TYPE_B}}: {{DESCRIPTION_B}}

## 7. Schedule

| Phase       | Duration       | Start       | End       | Dependency       |
| ----------- | -------------- | ----------- | --------- | ---------------- |
| {{PHASE_A}} | {{DURATION_A}} | {{START_A}} | {{END_A}} | {{DEPENDENCY_A}} |
| {{PHASE_B}} | {{DURATION_B}} | {{START_B}} | {{END_B}} | {{DEPENDENCY_B}} |
| {{PHASE_C}} | {{DURATION_C}} | {{START_C}} | {{END_C}} | {{DEPENDENCY_C}} |

### Effort Estimation

| Activity       | QA Lead           | QA Eng           | Dev Support      | {{SPECIALIST_ROLE}} | Total       |
| -------------- | ----------------- | ---------------- | ---------------- | ------------------- | ----------- |
| {{ACTIVITY_A}} | {{LEAD_EFFORT_A}} | {{ENG_EFFORT_A}} | {{DEV_EFFORT_A}} | {{SPEC_EFFORT_A}}   | {{TOTAL_A}} |
| {{ACTIVITY_B}} | {{LEAD_EFFORT_B}} | {{ENG_EFFORT_B}} | {{DEV_EFFORT_B}} | {{SPEC_EFFORT_B}}   | {{TOTAL_B}} |

## 8. Roles and Responsibilities

| Role                    | Name                | Responsibilities                 |
| ----------------------- | ------------------- | -------------------------------- |
| **QA Lead**             | {{QA_LEAD}}         | {{QA_LEAD_RESPONSIBILITIES}}     |
| **QA Engineer**         | {{QA_ENG}}          | {{QA_ENG_RESPONSIBILITIES}}      |
| **{{SPECIALIST_ROLE}}** | {{SPECIALIST_NAME}} | {{SPECIALIST_RESPONSIBILITIES}}  |
| **Dev Support**         | {{DEV_SUPPORT}}     | {{DEV_SUPPORT_RESPONSIBILITIES}} |

## 9. Testing Metrics

| Metric                 | Formula                   | Target                 | Frequency                 |
| ---------------------- | ------------------------- | ---------------------- | ------------------------- |
| {{METRIC_A}}           | {{FORMULA_A}}             | {{TARGET_A}}           | {{FREQUENCY_A}}           |
| {{METRIC_B}}           | {{FORMULA_B}}             | {{TARGET_B}}           | {{FREQUENCY_B}}           |
| {{SPECIALIZED_METRIC}} | {{SPECIALIZED_FORMULA}}   | {{SPECIALIZED_TARGET}} | {{SPECIALIZED_FREQUENCY}} |
| Test Coverage          | Lines covered/Total lines | ≥{{COVERAGE_TARGET}}%  | Per build                 |
| {{COMPLIANCE_METRIC}}  | {{COMPLIANCE_FORMULA}}    | {{COMPLIANCE_TARGET}}  | Per release               |

## 10. {{SPECIALIZED_TESTING_APPROACHES}}

### {{SPECIALIZED_APPROACH_A}}

- {{APPROACH_DESCRIPTION_A}}
- {{APPROACH_CRITERIA_A}}
- {{APPROACH_TOOLS_A}}

### {{SPECIALIZED_APPROACH_B}}

- {{APPROACH_DESCRIPTION_B}}
- {{APPROACH_CRITERIA_B}}
- {{APPROACH_TOOLS_B}}

## 11. Approval

| Role          | Name          | Decision        | Date        |
| ------------- | ------------- | --------------- | ----------- |
| **QA Lead**   | {{QA_LEAD}}   | {{DECISION_QA}} | {{DATE_QA}} |
| **PO**        | {{PO_NAME}}   | {{DECISION_PO}} | {{DATE_PO}} |
| **Tech Lead** | {{TECH_LEAD}} | {{DECISION_TL}} | {{DATE_TL}} |

---

**Template Variables:**

- {{VARIABLE_NAME}} = Replace with actual project values
- Sections can be customized based on domain requirements
- Specialized sections should be expanded based on industry needs
