# Change Request: CR-{{YYYY}}-{{NNN}}

## Metadata

| Field                 | Value                         |
| --------------------- | ----------------------------- |
| **Type**              | {{Standard/Normal/Emergency}} |
| **Release**           | {{VERSION}}                   |
| **Requested By**      | {{RELEASE_MANAGER_NAME}}      |
| **Target Date**       | {{YYYY-MM-DD HH:MM TIMEZONE}} |
| **Deployment Window** | {{START_TIME}} — {{END_TIME}} |
| **Impacted Systems**  | {{SYSTEM_LIST}}               |
| **Risk Level**        | {{Low/Medium/High/Critical}}  |

## 1. Description of Change

{{BUSINESS_DESCRIPTION_OF_CHANGES}}

## 2. Justification

{{WHY_THIS_CHANGE_IS_NEEDED}}

## 3. Scope of Impact

### Components Affected

| Component       | Change Type       | Risk Level |
| --------------- | ----------------- | ---------- |
| {{COMPONENT_A}} | {{CHANGE_TYPE_A}} | {{RISK_A}} |
| {{COMPONENT_B}} | {{CHANGE_TYPE_B}} | {{RISK_B}} |
| {{COMPONENT_C}} | {{CHANGE_TYPE_C}} | {{RISK_C}} |

### Users Affected

- **{{USER_GROUP_A}}**: {{USER_COUNT_A}}, {{IMPACT_DESCRIPTION_A}}
- **{{USER_GROUP_B}}**: {{USER_COUNT_B}}, {{IMPACT_DESCRIPTION_B}}

### Downtime Required

- **Required**: {{YES_NO}}
- **Duration**: {{DOWNTIME_DURATION}}
- **Mitigation**: {{DOWNTIME_MITIGATION_STRATEGY}}

## 4. Prerequisites

- [ ] **QA Sign-off**: {{LINK_TO_QA_EVIDENCE}}
- [ ] **Security Sign-off**: {{LINK_TO_SECURITY_EVIDENCE}}
- [ ] **Rollback Plan**: {{LINK_TO_ROLLBACK_PLAN}}
- [ ] **Release Notes**: {{LINK_TO_RELEASE_NOTES}}
- [ ] **{{ADDITIONAL_PREREQUISITE}}**: {{STATUS}}

## 5. Deployment Plan

| Step       | Action       | Responsible       | Duration       | Verification       |
| ---------- | ------------ | ----------------- | -------------- | ------------------ |
| {{STEP_1}} | {{ACTION_1}} | {{RESPONSIBLE_1}} | {{DURATION_1}} | {{VERIFICATION_1}} |
| {{STEP_2}} | {{ACTION_2}} | {{RESPONSIBLE_2}} | {{DURATION_2}} | {{VERIFICATION_2}} |
| {{STEP_3}} | {{ACTION_3}} | {{RESPONSIBLE_3}} | {{DURATION_3}} | {{VERIFICATION_3}} |

## 6. Rollback Criteria

{{WHEN_TO_TRIGGER_ROLLBACK}}

## 7. Communication Plan

- **{{TIMEFRAME_1}}**: {{COMMUNICATION_ACTION_1}}
- **{{TIMEFRAME_2}}**: {{COMMUNICATION_ACTION_2}}
- **{{TIMEFRAME_3}}**: {{COMMUNICATION_ACTION_3}}

## 8. Post-Deployment Verification

✅ {{VERIFICATION_STEP_1}}
✅ {{VERIFICATION_STEP_2}}
✅ {{VERIFICATION_STEP_3}}
✅ {{FOLLOW_CHECKLIST_REFERENCE}}

## Approvals

| Role      | Name              | Decision           | Date     |
| --------- | ----------------- | ------------------ | -------- |
| CAB Chair | {{CAB_CHAIR}}     | {{APPROVE_REJECT}} | {{DATE}} |
| Tech Lead | {{TECH_LEAD}}     | {{APPROVE_REJECT}} | {{DATE}} |
| PO        | {{PRODUCT_OWNER}} | {{APPROVE_REJECT}} | {{DATE}} |

---

**Template Variables:**

- Replace {{VARIABLE_NAME}} with actual deployment details
- Ensure all prerequisites are linked and verified
- Include specific verification criteria
