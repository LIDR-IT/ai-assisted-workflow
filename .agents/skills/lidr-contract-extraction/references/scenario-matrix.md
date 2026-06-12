---
id: contract-extraction-scenario-matrix
version: "0.1.0"
last_updated: "2026-06-12"
updated_by: "TL: contract registry bootstrap"
status: active
---

# Scenario Matrix — deterministic routing for lidr-contract-extraction

The Step 0 probe resolves each axis; this table maps the resolved value to the solution.
Axes are independent — combine them (e.g. multi-repo + ai-fallback + events + pact + catalog).

## Axis 1 — Topology

| Detected                                                        | Solution                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monorepo** (workspaces: pnpm/turbo/lerna/nx, or `packages/*`) | Discover packages. One `contract-registry.yaml` at the repo root. Contracts may reference shared types directly (intra-repo `$ref`). Breaking-change diff per package in one CI.                                                                                         |
| **Multi-repo** (N clone paths in `repos.yaml`)                  | Aggregate one registry (in the docs/registries of the client) with **cross-links** `owner_repo` ↔ `consumer_repos`. Breaking-change diff per repo in each repo's CI, **plus** a cross-repo compatibility gate (Pact broker `can-i-deploy`, or registry version compare). |

## Axis 2 — Extraction source (per repo, fallback chain — pick the first available)

| Detected                                                               | Solution                                                                                                                                                                                         |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Spec exists** (openapi/asyncapi/graphql/proto found)                 | Import as canonical. Cheapest + strongest. Only index + diff.                                                                                                                                    |
| **Framework-introspectable** (Nest/FastAPI/Spring routes & decorators) | Generate the spec from code (near-complete).                                                                                                                                                     |
| **Annotations** (`swagger-jsdoc`-style, framework-independent)         | Generate from annotations. Good for legacy with partial annotation.                                                                                                                              |
| **Traffic capture** available                                          | Infer the spec from recorded requests (captures actually-used endpoints/shapes; no code cooperation).                                                                                            |
| **AI fallback** (none of the above)                                    | Read routes/handlers/types, synthesize OpenAPI/AsyncAPI. Mark `confidence: low` + `[REQUIERE VALIDACIÓN HUMANA]`. Recommend pairing with traffic capture or a contract test to raise confidence. |
| **Consumer repo** (frontend/QA)                                        | Extract what it CONSUMES (API client calls, generated types, Pact consumer tests) → fills `consumer_repos` on the matching provider entries.                                                     |

## Axis 3 — Surface (per repo, may be several)

| Detected               | Spec format                                     | Breaking-change tool                                                            |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| **REST**               | OpenAPI                                         | `oasdiff` (470+ change types)                                                   |
| **Events / messaging** | AsyncAPI (+ Avro/Protobuf/JSON-Schema payloads) | schema-registry compatibility (Confluent/Apicurio) or `buf breaking` (Protobuf) |
| **GraphQL**            | SDL                                             | `graphql-inspector` (breaking / dangerous / safe)                               |
| **gRPC**               | Protobuf `.proto`                               | `buf breaking`                                                                  |

## Axis 4 — Verification depth

| Detected / chosen           | Solution                                                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Baseline (always)**       | Schema diff in CI against the previous spec version → feeds `lidr-impact-analysis` severity. Spec travels with the code (DTC); diff runs on each pull request.              |
| **Pact in use OR opted-in** | Consumer-driven contract tests + a Pact Broker with `can-i-deploy` deploy gating across repos. This is the executable truth of the seam (ties to the TEA test-truth layer). |

## Axis 5 — Catalog

| Detected / chosen                  | Solution                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| **Baseline**                       | `contract-registry.yaml` (the derived index) in `docs/projects/{client}/registries/`. |
| **Backstage detected / opt-in**    | Also emit `catalog-info.yaml` API entities referencing each spec.                     |
| **Microcks / EventCatalog opt-in** | Also publish specs to the catalog for mocking/discovery.                              |

## Worked example — initiative touching Whatsapp + Notifications (multi-repo, events, brownfield bridge)

1. Probe: multi-repo (api, frontend, bridge, qa); api=spec-first REST; bridge=ai-fallback events; frontend=consumer; pact=off; catalog=registry-file.
2. Extract: api → OpenAPI (imported); bridge → AsyncAPI for `preview.ready` (AI-synth, `confidence: low`); frontend → consumes api REST.
3. Emit: `contracts/preview-ready-event/v1.yaml` (ADR-style) + registry entry (`owner_repo: bridge`, `consumer_repos: [api, frontend]`).
4. Verify: `oasdiff` on api in CI; AsyncAPI schema compat on `preview.ready`; recommend a Pact/contract test to confirm the AI-synth event.
5. Hand off to `lidr-impact-analysis`: "does changing `preview.ready` break api/frontend?" → severity + gate.
