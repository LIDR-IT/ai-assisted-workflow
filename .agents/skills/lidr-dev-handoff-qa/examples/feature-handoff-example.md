---
id: dev-handoff-qa-feature-example
version: "1.2.0"
last_updated: "2026-06-09"
updated_by: "TL: align example to canonical template + validation script"
status: active
type: example
---

# Handoff Dev → QA: SDLC-456 — Implement facial-recognition authentication

Example (Jira tracking + GitHub PRs + Slack chat — illustrative, not canonical; concrete tools resolve via the registry).

| Field                     | Value                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Ticket**                | [SDLC-456](https://jira.example.com/browse/SDLC-456)                                   |
| **Source RF (RF Origen)** | RF-SDLC-012                                                                            |
| **PR**                    | [#1310](https://github.com/example-org/platform/pull/1310) — merged 2026-03-16         |
| **Environment (Entorno)** | [https://staging.example.com](https://staging.example.com) — deployed 2026-03-16 15:45 |
| **Feature Flag**          | `FACE_AUTH_V1 = ON` or "No flag" / "Sin flag"                                          |
| **Developer**             | García, Miguel (@miguel.garcia)                                                        |
| **QA Assigned**           | López, Ana (@ana.lopez)                                                                |

## 1. What Was Implemented? (¿Qué se Implementó?)

### Functional Description (Descripción Funcional — USER language, not developer)

- **New flow**: The user can now authenticate using facial recognition for passwordless login on mobile.
- **Improved validation**: The system can verify whether a real, live person is present (liveness detection), not a photo.
- **Visual feedback**: Real-time capture guidance with an oval overlay (green/red frames).
- **Immediate results**: Identity validated in under 3 seconds with an accept/reject decision.

### Visible Changes (Cambios Visibles)

| Change                      | Where                      | Screenshot                                      |
| --------------------------- | -------------------------- | ----------------------------------------------- |
| "Login with Face ID" button | Mobile login screen        | `test-screenshots/login-face-id-button.png`     |
| Camera with guide overlay   | Facial capture screen      | `test-screenshots/camera-overlay-guides.png`    |
| Face ID setup section       | Settings > Security        | `test-screenshots/settings-face-id-section.png` |
| Results screen              | On verification completion | `test-screenshots/results-screen.png`           |

### What Was NOT Implemented (Lo que NO se Implementó — explicit exclusions to avoid false bugs)

- ❌ Offline mode (requires an internet connection)
- ❌ Multiple templates per user (single face template only)
- ❌ Landscape capture (portrait mode only)
- ❌ Third-party biometric service integration (proprietary algorithms only)

> These exclusions are intentional. Do not file bugs against them.

## 2. Technical Changes Relevant for QA (Cambios Técnicos Relevantes para QA)

### Endpoints

| Method | Path                       | Description                        | Status |
| ------ | -------------------------- | ---------------------------------- | ------ |
| POST   | `/api/v1/auth/face/verify` | Verifies a captured face for login | New    |
| GET    | `/api/v1/auth/face/status` | Returns enrollment/template status | New    |
| POST   | `/api/v1/auth/face/enroll` | Registers a face template          | New    |

- Input for verify: `{ image: base64, sessionId: string }`
- Output for verify: `{ success: boolean, token?: string, confidence: number }`
- Rate limit: 5 requests/minute per IP

### Database (Base de Datos)

| Table            | Change                                 | Migration                         | QA Impact                              |
| ---------------- | -------------------------------------- | --------------------------------- | -------------------------------------- |
| `face_templates` | New table for encrypted biometric data | `20260316_add_face_templates.sql` | Verify the DB stores no raw image data |
| `users`          | Added column `face_enrolled` BOOLEAN   | Same migration                    | Verify the flag flips after enrollment |

### Configuration (Configuración)

| Variable             | Staging Value | Notes                        |
| -------------------- | ------------- | ---------------------------- |
| `LIVENESS_THRESHOLD` | `0.75`        | Minimum confidence to accept |
| `MAX_FACE_ATTEMPTS`  | `3`           | Maximum attempts per session |
| `FACE_AUTH_V1`       | `true`        | Feature Flag active          |

### External Dependencies (Dependencias Externas)

| Service                   | Status    | Impact if down                   |
| ------------------------- | --------- | -------------------------------- |
| Identity Verification API | ✅ Active | Liveness detection does not work |
| Redis Cache               | ✅ Active | Sessions expire immediately      |

## 3. How to Test It (Cómo Probarlo)

### Prerequisites (Prerequisitos — verifiable checklist)

- [ ] Feature Flag `FACE_AUTH_V1 = ON` verified at `/admin/flags`
- [ ] Device: smartphone with a front camera, camera permission granted to the staging domain
- [ ] Test user enrolled: `qa_user1@example.com` / `TestPass2024!` (role: verified_user)
- [ ] Good lighting (avoid backlight)
- [ ] Test data available in folder `test-data/documents/`

### Main Flow — Happy Path (Flujo Principal)

| Step | Action                    | Data                                    | Expected Result                       |
| ---- | ------------------------- | --------------------------------------- | ------------------------------------- |
| 1    | Open the mobile app       | -                                       | Login screen visible                  |
| 2    | Tap "Login with Face ID"  | -                                       | Camera screen opens                   |
| 3    | Allow camera access       | -                                       | Active camera preview with oval guide |
| 4    | Position face in the oval | `test-data/documents/dni-valid-001.jpg` | Green frame, capture begins           |
| 5    | Wait for analysis         | ~2-3 seconds                            | Score > 0.75, status "ACCEPTED"       |
| 6    | Verify access             | -                                       | Automatic login to the main dashboard |

### Error Scenarios (Escenarios de Error)

| #   | Scenario             | How to Reproduce                   | Expected Result                                |
| --- | -------------------- | ---------------------------------- | ---------------------------------------------- |
| 1   | Photo spoofing       | Hold a printed photo to the camera | Error "Please use your real face, not a photo" |
| 2   | Unregistered face    | Capture a different person's face  | Error "We could not verify your identity"      |
| 3   | No camera permission | Deny camera access                 | Message "We need access to your camera"        |
| 4   | 3 failed attempts    | Fail liveness 3 times in a row     | Error "Attempt limit reached. Use password"    |

### Edge Cases

| #   | Case            | How to Reproduce         | Expected Result                      |
| --- | --------------- | ------------------------ | ------------------------------------ |
| 1   | Poor lighting   | Test in a dark room      | Guidance message; no false accept    |
| 2   | Multiple faces  | Two people in frame      | Rejected; "Only one face allowed"    |
| 3   | Expired session | Wait 15 minutes inactive | Redirect to login, "Session expired" |

## 4. Test Data (Datos de Prueba)

### Test Documents/Files (Test Documents)

| File                       | Type               | Purpose                | Expected Result                   |
| -------------------------- | ------------------ | ---------------------- | --------------------------------- |
| `dni-valid-001.jpg`        | Valid face capture | Basic happy path       | Successful login, status ACCEPTED |
| `dni-valid-002.jpg`        | Valid face capture | Alternative happy path | Successful login, status ACCEPTED |
| `face-photo-spoof-001.jpg` | Printed photo      | Liveness rejection     | Error "Please use your real face" |
| `face-corrupted-001.jpg`   | Corrupted file     | Format error           | Error "Invalid file format"       |

### Test Users

| User                 | Password      | Role          | Status  | Notes                        |
| -------------------- | ------------- | ------------- | ------- | ---------------------------- |
| qa_user1@example.com | TestPass2024! | verified_user | Active  | Template already enrolled    |
| qa_user2@example.com | TestPass2024! | verified_user | Active  | No template, requires enroll |
| qa_user3@example.com | TestPass2024! | verified_user | Blocked | For testing blocked users    |

## 5. Regression Areas (Áreas de Regresión)

### Impact areas

| Area               | Why Affected                   | Regression Priority |
| ------------------ | ------------------------------ | ------------------- |
| Traditional login  | Shares JWT/session logic       | 🔴 High             |
| Settings screen    | New Face ID section added      | 🟡 Medium           |
| Session management | New state during capture       | 🟡 Medium           |
| 2FA flow           | Face ID counts as first factor | 🟡 Medium           |

### Suggested Smoke Test (top 5 tests to run FIRST)

1. **Traditional login/logout** still works normally
2. **Settings screen** loads with the new Face ID section
3. **Dashboard** loads without errors after Face ID login
4. **API health** responds OK at `/health`
5. **Feature Flag** can be enabled/disabled correctly

## 6. Risks and Limitations (Riesgos y Limitaciones)

| Risk                            | Testing Impact                           | Workaround                                     |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| Liveness sensitive to lighting  | Tests may fail in poor light             | Test in well-lit conditions                    |
| Dependency on external services | Intermittent tests if services go down   | Check status at `/admin/health` before testing |
| Feature Flag may change         | Tests fail if the flag is disabled       | Verify the flag at the start of each session   |
| 3-attempt limit per session     | Cannot test multiple errors back-to-back | Use a new session for each error test          |

## 7. Screenshots / Demo

- **Login screen**: `test-screenshots/login-face-id-button.png`
- **Camera overlay**: `test-screenshots/camera-overlay-guides.png`
- **Settings section**: `test-screenshots/settings-face-id-section.png`
- **Success result**: `test-screenshots/results-screen.png`
- **Liveness error**: `test-screenshots/liveness-error-message.png`

**Full Demo video**: `test-videos/face-auth-complete-flow.mp4`

---

## Support & Questions

**Primary Developer**: García, Miguel (@miguel.garcia)
**Backup Support**: Rodríguez, Sandra (@sandra.rodriguez)
**Security Questions**: Martínez, Carlos (@carlos.martinez)
**QA Questions**: López, Ana (@ana.lopez)

**Chat Channel**: #facial-auth-testing
**Environment Issues**: #devops-support

**Happy Testing! If anything is unclear, ping Miguel before QA fails.**
