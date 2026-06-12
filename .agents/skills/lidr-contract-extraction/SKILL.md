---
name: lidr-contract-extraction
description: This skill should be used when the user asks to "extract contracts", "generate contract registry", "bootstrap API contracts", "build the contract registry from repos", "scan repos for contracts", "crear contratos desde el código", "contract registry brownfield", "document contracts across repos". Self-configuring (capability probe + scenario routing) extraction of API / event / schema contracts from one or more repositories — monorepo OR multi-repo (e.g. backend/api, frontend, bridge, QA in separate repos the user has cloned locally) — into versioned contract specs (ADR-style) plus a derived contract-registry.yaml (document-project-style index) that lidr-impact-analysis then consumes. Works brownfield (derives contracts from existing code via framework introspection, annotations, traffic capture, or AI fallback). Do NOT use it to measure the impact of a change (use lidr-impact-analysis) nor to document prose architecture (use bmad-document-project). Output is English by default; artifact language follows the client language setting.
id: contract-extraction
version: "0.1.0"
last_updated: "2026-06-12"
updated_by: "TL: contract registry bootstrap"
status: active
phase: 4
stage: development
owner_role: "Tech Lead"
domain_agnostic: true
language_default: en
integrations: []
---

# Contract Extraction — build the contract registry from the repos

Phase: 4 — Implementation · development (also runs anytime as a bootstrap/refresh) | Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). | Domain: Any stack/industry.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad and to lidr-impact-analysis

- **This skill PRODUCES contracts; `lidr-impact-analysis` CONSUMES them.** This is the "document-project for contracts": it scans the actual repos and derives the registry. `lidr-impact-analysis` then matches a change against that registry to report impact.
- **Two output styles, by design** (the user's mental model):
  - **Contracts = versioned specs (ADR-style):** each contract is a pinned artifact; a breaking change produces a new version that supersedes the old, with a deprecation window. Immutable history.
  - **Registry = derived index (document-project-style):** `contract-registry.yaml` is regenerated from the scan — never hand-curated content, only derived entries + owner/consumer links.
- BMad has no contract-extraction artifact; this is LIDR-unique. It complements `bmad-document-project` (prose/code docs) by emitting **machine-checkable** specs (OpenAPI/AsyncAPI/GraphQL/Protobuf) instead of prose.

## Self-configuring: the skill answers its own setup questions

This skill is **probe-driven** (mirrors BMad TEA's `*_type = "auto"` + `capability_probe`). It does NOT require the operator to pre-answer setup questions — it detects what it can and asks only the genuinely ambiguous ones, then writes a resolved `contract-config.yaml` the user confirms before extraction.

## Inputs

| Input                                                                 | Required                                    | Source                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| Repo manifest (`repos.yaml`) — local paths + role + (optional) stack  | ✅ (the skill generates a draft if missing) | `docs/projects/{client}/registries/repos.yaml`                         |
| The cloned repositories themselves (read-only)                        | ✅                                          | local paths the user provides (monorepo packages or multi-repo clones) |
| Architecture doc (system boundaries)                                  | Desirable                                   | `bmad-create-architecture` output                                      |
| Existing specs found in the repos (OpenAPI/AsyncAPI/GraphQL/Protobuf) | Desirable                                   | the repos — used as the strongest source when present                  |

## Procedure

### Step 0 — Probe (resolve the setup automatically)

Read `repos.yaml` if it exists; otherwise discover candidate repo paths and draft it (the user confirms). Then, per repo, **detect** and record into `contract-config.yaml`:

| Axis                                  | How it is detected                                                                                                                       | Ask only if…                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Topology** (monorepo vs multi-repo) | one path with workspaces (`pnpm-workspace.yaml`, `turbo.json`, `lerna.json`, `packages/*`) → monorepo; several paths → multi-repo        | the manifest is empty                                                       |
| **Stack** per repo                    | `package.json` (Nest/Express/Next), `pyproject.toml`/`requirements.txt` (FastAPI/Django), `pom.xml`/`build.gradle` (Spring), `go.mod`, … | the stack is unrecognized                                                   |
| **Existing specs**                    | search for `openapi.*`/`swagger.*`, `*.graphql`/`schema.graphql`, `*.proto`, `asyncapi.*`, JSON-Schema, Pact files                       | never (detection only)                                                      |
| **Events/messaging**                  | broker deps (Kafka/RabbitMQ/SQS/SNS) or patterns (`@EventPattern`, emitters)                                                             | confirm with the user                                                       |
| **Pact in use**                       | Pact deps / `pacts/` dir / pactflow config                                                                                               | if absent — ask whether to add it (default: schema-diff first, Pact opt-in) |
| **CI**                                | `.github/workflows`, `.gitlab-ci.yml`, …                                                                                                 | never (detection only)                                                      |
| **Central catalog**                   | `catalog-info.yaml` (Backstage), Microcks, EventCatalog                                                                                  | if absent — default to registry-file, catalog opt-in                        |

Emit `contract-config.yaml` (resolved decisions) and **show it to the user to confirm/override** before extracting. Never fabricate; mark inferred values `confidence: low|medium|high`.

### Step 1 — Route to the scenario

Follow `references/scenario-matrix.md` — it maps each detected axis to a deterministic solution (monorepo vs multi-repo registry shape; spec-first vs framework-aware vs AI-fallback extraction; REST/events/GraphQL tooling; schema-diff vs Pact verification; registry-file vs catalog).

### Step 2 — Extract per repo

Apply the strongest available strategy per repo (see `references/extraction-strategies.md`), in this fallback order:

1. **Spec exists** → import it as the canonical contract (strongest, cheapest).
2. **Framework-introspectable** (Nest/FastAPI/Spring decorators & routes) → generate the spec from code.
3. **Annotations** present (JSDoc/`swagger-jsdoc`-style) → generate from annotations.
4. **Traffic capture** available → infer the spec from recorded requests.
5. **AI fallback** (legacy, none of the above) → read routes/handlers/types and synthesize OpenAPI/AsyncAPI; mark `confidence: low` + `[REQUIERE VALIDACIÓN HUMANA]`.

For the **consumer side** (e.g. frontend) extract what it CONSUMES (API client calls / generated types) so the registry can link consumers to providers.

### Step 3 — Emit outputs

- **Versioned contract specs (ADR-style):** write each contract under `docs/projects/{client}/registries/contracts/<id>/v<N>.{yaml|graphql|proto}` with frontmatter (`id`, `version`, `owner_repo`, `status`, `supersedes`). A breaking change → new `v<N+1>` + deprecation note; never edit a finalized version in place.
- **Derived registry (document-project-style):** regenerate `docs/projects/{client}/registries/contract-registry.yaml` (the format `lidr-impact-analysis` already defines) from the scan — each entry: `id`, `type`, `source_path`, `owner_repo`, `consumer_systems`/`consumer_repos`, `spec_ref`. Record the scan `version` + `last_updated`.

### Step 4 — Verify (baseline always, the rest by scenario)

- **Baseline (always):** run a breaking-change diff against the previous spec version — OpenAPI → `oasdiff`, Protobuf → `buf breaking`, GraphQL → `graphql-inspector`. Feed the result to `lidr-impact-analysis` severity. Wire it into the detected CI on each repo's pull requests.
- **Opt-in / Pact detected:** consumer-driven verification + a broker with `can-i-deploy` for cross-repo deploy gating (the executable truth of the seam).
- **Opt-in / catalog detected:** emit the catalog entries (Backstage `catalog-info.yaml` / Microcks / EventCatalog).

## Brownfield bootstrap → incremental

- **First run = golden master:** derive the FULL registry + specs from the current code (the truthful snapshot of "what the contracts ARE today"), exactly like `bmad-document-project` derives docs.
- **Then incremental (DTC):** the contract spec is updated in the SAME pull request as the code that changes it; the CI diff catches breaking changes; the registry is regenerated.

## Degraded mode (repos not accessible)

If repo paths are missing/unreadable: state it explicitly, do NOT fabricate contracts, and emit the guided manual checklist (which surfaces/contracts does each repo expose? who consumes each? additive or breaking?), recommending the user clone the repos and populate `repos.yaml`. Register the gap in `lidr-risk-log`.

## Output locations

- Repo manifest: `docs/projects/{client}/registries/repos.yaml`
- Resolved probe config: `docs/projects/{client}/registries/contract-config.yaml`
- Versioned specs: `docs/projects/{client}/registries/contracts/<id>/v<N>.*`
- Derived registry (consumed by `lidr-impact-analysis`): `docs/projects/{client}/registries/contract-registry.yaml`

## Key rules

- **Registry entries are DERIVED, never hand-curated content** — regenerate from the scan; the human curates only `consumer_systems` ownership the scan cannot infer (mark `[REQUIERE VALIDACIÓN HUMANA]`).
- **Specs are versioned/immutable (ADR-style):** breaking change = new version + deprecation window per `lidr-sdlc/tech-stack.md` §4.4; never silently mutate a finalized spec.
- **Confidence travels:** AI-synthesized contracts carry `confidence: low` until a human or a contract test confirms them.
- **The skill produces; it does not judge impact** — hand off to `lidr-impact-analysis` (contract-impact mode) for the severity/gate decision.
- **Domain-agnostic:** works for any stack and topology — examples are illustrative only.

## Related skills

- `lidr-impact-analysis` — consumes the registry this skill produces (impact + severity + gate).
- `bmad-document-project` — prose/code docs (this skill is its machine-checkable contract counterpart).
- `bmad-create-architecture` — the centralized home of cross-feature contracts (events/APIs shared between features).
- `bmad-tea` / `bmad-testarch-*` — contract tests (Pact) that make the seam executable truth.

## References

- `references/scenario-matrix.md` — deterministic routing per detected axis.
- `references/extraction-strategies.md` — extraction strategy per stack + per surface (REST/events/GraphQL/types).

## Changelog

| Version | Date       | Author                          | Changes                                                                                                                                                           |
| ------- | ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1.0   | 2026-06-12 | TL: contract registry bootstrap | Initial — probe-driven, scenario-routed extraction of contracts from monorepo/multi-repo into versioned specs + derived registry consumed by lidr-impact-analysis |
