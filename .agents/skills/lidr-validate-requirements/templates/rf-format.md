# Standard Format: Functional Requirement (RF)

> **Purpose**: Mandatory format defining the structure of every RF in the project.
> **Referenced by**: `.claude/rules/org.md` via `@../templates/rf-format.md`
> **Used by**: `skills/generate-rf/SKILL.md` as the mandatory output format
> **Associated Gate**: Gate 2 — RFs Complete
> **Policy**: Every RF must follow this exact format. RFs that do not comply are rejected in review.

---

## 1. Complete RF Structure

### 1.1 Header (Mandatory)

```markdown
---
id: RF-{PROJ}-{NNN}
title: { Descriptive requirement title — maximum 15 words }
version: { 1.0 }
status: Draft | In Review | Approved | Obsolete
prd_source: { Link to the Technical and/or Functional PRD }
author: { Full name }
created_date: { YYYY-MM-DD }
last_modified_date: { YYYY-MM-DD }
priority: Must Have | Should Have | Could Have | Won't Have (MoSCoW)
complexity: Low | Medium | High | Very High
sprint_estimate: { Sprint N — preliminary estimate }
---
```

**Header rules:**

- **ID**: Strict format `RF-{PROJ}-{NNN}` where PROJ = project code (3-5 chars), NNN = sequential with no gaps
- **Title**: Descriptive, jargon-free, understandable by PO and QA (not only devs)
- **Status**: Only valid transitions: Draft → In Review → Approved. Approved → Obsolete if replaced
- **Priority**: MoSCoW assigned by PO. "Must Have" = the sprint does not close without this

### 1.2 Objective (Mandatory)

```markdown
## Objective

{What this requirement achieves — 1-2 sentences maximum. Answers: "What value does it bring to the user/business?"}
```

**Rules:**

- Non-technical — write in business language
- Do not describe HOW (implementation), only WHAT (what is achieved) and WHY (for what purpose)
- If you cannot explain the objective in 2 sentences, the RF is too large → split it

### 1.3 Actors (Mandatory)

```markdown
## Actors

| Actor             | Role in this RF              | Required permissions      |
| ----------------- | ---------------------------- | ------------------------- |
| {Primary actor}   | {What it does in this RF}    | {What permissions needed} |
| {Secondary actor} | {What it does}               | {What permissions needed} |
| {System}          | {What it does automatically} | N/A                       |
```

**Rules:**

- Actors must exist in the project stakeholder map
- Always distinguish between a human actor and a system/service
- If an actor appears in multiple RFs, use the same name consistently (see `docs/checklists/rf-coherence.md`)

### 1.4 Scope (Mandatory)

```markdown
## Scope

### Includes

- {Functionality 1 that this RF DOES cover}
- {Functionality 2 that it DOES cover}

### Excludes

- {Functionality 1 it explicitly does NOT cover} → covered by RF-{PROJ}-{XXX}
- {Functionality 2 it does NOT cover} → out of project scope
```

**Rules:**

- Exclusions are as important as inclusions
- Each exclusion must reference where it is covered (another RF or "out of scope")
- If there are no exclusions, write "No explicit exclusions — everything described in Objective is in scope"

### 1.5 Prerequisites (Mandatory if they exist)

```markdown
## Prerequisites

| Prerequisite                   | Type      | Status                         |
| ------------------------------ | --------- | ------------------------------ |
| RF-{PROJ}-{XXX}: {description} | RF        | Approved / In Review / Pending |
| {Technical condition}          | Technical | Met / Pending                  |
| {Business condition}           | Business  | Met / Pending                  |
```

**Rules:**

- RF-type prerequisites must exist in the same project
- Verify that no circular dependencies are created (see coherence checklist)
- If a prerequisite is "Pending", this RF cannot move to "Approved"

---

## 2. Behavior (Mandatory)

### 2.1 Main Flow

```markdown
## Main Flow

### Preconditions

- {What must be true before starting this flow}
- {Required system/data state}

### Steps

1. **{Actor}** {action in present indicative — e.g.: "selects option X"}
2. **{System}** {automatic response/action — e.g.: "validates the entered data"}
3. **{Actor}** {next action}
4. **{System}** {result — e.g.: "shows confirmation with message: '{exact text}'"}

### Postconditions

- {System state after a successful flow}
- {Data created/modified/deleted}
- {Notifications sent}
```

**Step rules:**

- Each step has an explicit actor (human or system)
- Verbs in present indicative: "selects", "validates", "shows" — not "will select"
- User messages in quotes with exact text
- Maximum 10 steps in the main flow. If more → split the RF

### 2.2 Alternative Flows

```markdown
## Alternative Flows

### FA-{N}: {Descriptive name of the alternative flow}

- **Branch point**: Step {N} of the main flow
- **Trigger condition**: {When this alternative path is taken}
- **Steps**:
  1. **{Actor}** {alternative action}
  2. **{System}** {response}
- **Return point**: Step {M} of the main flow | End of flow
```

**Rules:**

- Minimum 1 alternative flow per RF (except trivial RFs with justification)
- Each alternative must indicate where it branches from (branch point) and where it returns (return point)
- If there are more than 3 complex alternatives, consider whether this RF should be split

### 2.3 Error Flows

```markdown
## Error Flows

### FE-{N}: {Error name}

- **Trigger condition**: {When this error occurs — be specific}
- **Expected behavior**:
  1. **{System}** {action on the error}
  2. **{System}** shows message: "{Exact text of the error message}"
- **Recovery**: {How the user can recover from the error}
- **Logging**: {What is logged — level, data, no PII}
```

**Rules:**

- Minimum 1 error flow per RF
- Error messages with exact text (in quotes)
- Always include a recovery path (what can the user do?)
- Never expose technical details to the user in the error message

### 2.4 Business Rules

```markdown
## Business Rules

| ID            | Rule        | Logic                                           | Source                                        |
| ------------- | ----------- | ----------------------------------------------- | --------------------------------------------- |
| RN-{RF-ID}-01 | {Rule name} | {Exact logic: conditions, formulas, thresholds} | {Who defined this rule: PO, regulation, etc.} |
| RN-{RF-ID}-02 |             |                                                 |                                               |
```

**Rules:**

- Each RN has a unique ID linked to the RF
- The logic must be precise: not "approximately X" but "exactly X"
- Include the source for traceability (who defined the rule)
- RNs shared across RFs are documented in each RF that uses them (with cross-reference)

---

## 3. Acceptance Criteria — BDD (Mandatory)

```gherkin
## Acceptance Criteria

### CA-{RF-ID}-01: {Descriptive criterion name}

Scenario: Happy path — {brief description}
  Given {precondition with concrete data}
    And {additional precondition with concrete data}
  When {user action — 1 atomic action}
  Then {expected observable and verifiable result}
    And {additional result}

Scenario: Alternative — {description}
  Given {different precondition with concrete data}
  When {user action}
  Then {different result}

Scenario: Error — {error description}
  Given {precondition that causes the error}
  When {user action}
  Then {system shows message: "{exact text}"}
    And {system logs a WARN/ERROR level event}
    And {user can: "{recovery action}"}

### CA-{RF-ID}-02: {Another criterion}
...
```

**BDD criteria rules:**

| Rule                        | Detail                              | Bad → good example                                                  |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| **Concrete data**           | Do not use abstractions             | "a user" → "admin user with email admin@corp.com"                   |
| **Atomic actions**          | 1 When = 1 action                   | "When enters data and clicks" → Split into 2 scenarios              |
| **Observable results**      | Verifiable by QA                    | "works correctly" → "shows message: 'Operation successful'"         |
| **No ambiguities**          | Prohibited: should, could, normally | "should show" → "shows"                                             |
| **Minimums per RF**         | ≥1 happy + ≥1 error                 | If there is only a happy path → add an error                        |
| **Reachable preconditions** | Given must be a reproducible state  | "Given the system is in a special mode" → describe how to get there |

---

## 4. Metadata (Mandatory)

### 4.1 Dependencies

```markdown
## Dependencies

| Type                   | RF              | Description                                    |
| ---------------------- | --------------- | ---------------------------------------------- |
| **Depends on**         | RF-{PROJ}-{XXX} | {Why it depends — what it needs from that RF}  |
| **Is prerequisite of** | RF-{PROJ}-{YYY} | {Which RF needs this one to be ready}          |
| **Related to**         | RF-{PROJ}-{ZZZ} | {Non-blocking relation — share an entity/flow} |
```

### 4.2 Technical Notes (Optional but recommended)

```markdown
## Technical Notes

{Relevant technical considerations for implementation. Not a technical specification,
but context that helps the dev understand constraints or suggestions.}

- {API constraint: endpoint X has a rate limit of N/min}
- {Note: table Y already has field Z that can be reused}
- {Performance consideration: query over a table with >1M rows}
```

### 4.3 Change History (Mandatory)

```markdown
## Change History

| Version | Date       | Author | Change               | Approved by    |
| ------- | ---------- | ------ | -------------------- | -------------- |
| 1.0     | YYYY-MM-DD | {Name} | Initial version      | —              |
| 1.1     | YYYY-MM-DD | {Name} | {Change description} | {PO/Tech Lead} |
```

---

## 5. Global Format Rules

### 5.1 Strict Rules (Violation = RF rejected)

| #   | Rule                                                                      | Verification |
| --- | ------------------------------------------------------------------------- | ------------ |
| 1   | **Unique ID**: RF-{PROJ}-{NNN} sequential with no gaps or duplicates      | Automatic    |
| 2   | **Mandatory BDD criteria**: Minimum 1 happy path + 1 error                | Automatic    |
| 3   | **No ambiguities**: Prohibited "should", "could", "normally", "etc."      | Automatic    |
| 4   | **Concrete data**: Criteria with real example data, not abstractions      | Automatic    |
| 5   | **Testable**: Each criterion verifiable by QA (automatically or manually) | Semi-auto    |
| 6   | **Explicit actor**: Each step has a clear actor (human or system)         | Automatic    |
| 7   | **Exact messages**: User messages with exact text in quotes               | Automatic    |
| 8   | **Error flow**: Minimum 1 error flow with documented recovery             | Automatic    |

### 5.2 Recommendations (Do not block but improve quality)

| #   | Recommendation               | Benefit                                    |
| --- | ---------------------------- | ------------------------------------------ |
| 1   | ≤10 steps in the main flow   | More granular and maintainable RFs         |
| 2   | ≥3 BDD scenarios per RF      | Greater testing coverage                   |
| 3   | Technical notes included     | Dev has more context to implement          |
| 4   | Alternative flows documented | Reduces mid-sprint ambiguity               |
| 5   | RN with exact formulas       | Leaves nothing to the dev's interpretation |

---

## 6. Complete Example — Reference RF

```markdown
---
id: RF-BIO-001
title: Facial enrollment with liveness validation
version: 1.0
status: Approved
prd_source: PRD-T-BIO §3.2, PRD-F-BIO §2.1
author: María González
created_date: 2025-11-15
last_modified_date: 2025-11-20
priority: Must Have
complexity: High
sprint_estimate: Sprint 3
---

## Objective

Allow a new user to register their facial identity with verification
that they are a real person (liveness detection), storing the biometric
template securely for future authentications.

## Actors

| Actor               | Role                                    | Permissions              |
| ------------------- | --------------------------------------- | ------------------------ |
| New user            | Starts enrollment, follows instructions | Public access (pre-auth) |
| {{CLIENT_NAME}} SDK | Captures image, runs liveness           | Valid API key            |
| Backend API         | Processes template, stores it encrypted | Service account          |

## Scope

### Includes

- Facial image capture via camera
- Liveness detection (anti-spoofing)
- Generation and storage of the biometric template

### Excludes

- 1:1 verification against an existing template → RF-BIO-002
- GDPR consent management → RF-BIO-005

## Acceptance Criteria

### CA-BIO-001-01: Successful enrollment

Scenario: Happy path — user with good lighting
Given user "juan.perez@example.com" has no biometric template
And the device camera is active
And lighting is ≥300 lux (sensor)
When the user positions their face inside the guide oval
And the system detects a liveness score ≥0.95
Then the system generates the biometric template
And stores the encrypted template (AES-256) linked to the user
And shows message: "Facial registration completed successfully"
And logs event: ENROLLMENT_SUCCESS (no PII)

Scenario: Error — liveness detection fails
Given the user positions their face inside the guide oval
And the system detects a liveness score <0.95
When the liveness attempt fails 3 consecutive times
Then the system shows: "We could not verify that you are a real person.
Try again in a place with better lighting."
And logs event: ENROLLMENT_LIVENESS_FAIL (attempt_count, score, no PII)
And the user can: retry or cancel

## Business Rules

| ID            | Rule                | Logic                                         | Source               |
| ------------- | ------------------- | --------------------------------------------- | -------------------- |
| RN-BIO-001-01 | Liveness threshold  | Score ≥0.95 to PASS                           | Security Policy v2.1 |
| RN-BIO-001-02 | Max attempts        | 3 failed attempts → temporary 5 min lockout   | UX Guidelines        |
| RN-BIO-001-03 | Template encryption | AES-256-GCM, key in KMS, key rotation 90 days | GDPR Art. 9          |

## Dependencies

| Type               | RF         | Description                                |
| ------------------ | ---------- | ------------------------------------------ |
| Is prerequisite of | RF-BIO-002 | Verification requires an existing template |
| Related to         | RF-BIO-005 | GDPR consent required beforehand           |
```

---

## 7. Connection with the SDLC Flow

```
PRD approved (Gate 1) → RFs generated (skill: generate-rf) → Coherence check → Gate 2
                            ↑                                        ↑
                     This mandatory format            docs/checklists/rf-coherence.md
```

### Cross-References

- **RF Generation**: `skills/generate-rf/SKILL.md` — uses this format as output
- **Coherence Check**: `docs/checklists/rf-coherence.md` — validates generated RFs
- **User Stories (next)**: `skills/user-stories/SKILL.md` — consumes RFs as input
- **Cross Review**: `docs/checklists/review-cruzado.md` — PRDs → RFs
- **Org Standards**: `docs/standards/org.md` — Gate 2 criteria

---

_Reference format for all RF generation._
_The generate-rf skill MUST produce RFs in this exact format. Deviations are rejected._
