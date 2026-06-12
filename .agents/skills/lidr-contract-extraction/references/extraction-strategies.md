---
id: contract-extraction-strategies
version: "0.1.0"
last_updated: "2026-06-12"
updated_by: "TL: contract registry bootstrap"
status: active
---

# Extraction Strategies — how to derive a contract per stack & surface

Industry practice (verified 2026): contract testing combines a **schema-first** source of truth
(OpenAPI / AsyncAPI / GraphQL SDL / Protobuf) with **consumer-driven** verification (Pact + broker
`can-i-deploy`). Breaking changes are caught in CI per surface: `oasdiff` (OpenAPI), `buf breaking`
(Protobuf), `graphql-inspector` (GraphQL). The skill prefers the strongest source available and
falls back gracefully — AI synthesis is the last resort for legacy with no introspection.

## REST contracts (OpenAPI)

| Stack                                           | Strongest strategy                          | Notes                                                                                                |
| ----------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Spec already in repo (`openapi.*`, `swagger.*`) | **Import**                                  | canonical; skip generation                                                                           |
| NestJS                                          | `@nestjs/swagger` introspection             | near-complete from decorators                                                                        |
| Express                                         | `swagger-jsdoc` (annotations) or route scan | annotations work on legacy                                                                           |
| FastAPI / Django-Ninja                          | built-in `/openapi.json`                    | export at build/run                                                                                  |
| Spring Boot                                     | springdoc-openapi                           | export the generated spec                                                                            |
| Any (no introspection)                          | **traffic capture** then **AI synthesis**   | capture real requests → infer; or AI reads routes/handlers/DTOs → synthesize; mark `confidence: low` |

Diff tool: **oasdiff** (470+ change classifications; GitHub Action available to block breaking PRs).

## Event / async contracts (AsyncAPI)

- Describe producers/consumers + channels in **AsyncAPI**; payloads as **Avro / Protobuf / JSON-Schema**.
- If a **schema registry** exists (Confluent/Apicurio), treat it as the source of truth and read schemas + compatibility rules from it.
- Detect from broker deps (Kafka/RabbitMQ/SQS/SNS) and patterns (`@EventPattern`, emitters/handlers).
- Compatibility: schema-registry compat checks, or `buf breaking` for Protobuf payloads.

## GraphQL contracts (SDL)

- Export the SDL (`schema.graphql`); diff with **graphql-inspector** (breaking / dangerous / safe).
- Validate real consumer documents/fragments against the schema — a schema diff alone is half a contract strategy.

## gRPC contracts (Protobuf)

- The `.proto` files ARE the contract; diff with **buf breaking** (clients/servers/generated code).

## Consumer side (frontend / QA)

- Extract what the consumer USES: API client modules, generated types (`openapi-typescript`), fetch/RPC call sites, and Pact consumer tests.
- This fills `consumer_repos` / `consumer_systems` on the matching provider entry in the registry, enabling cross-repo impact ("if the provider changes X, who breaks").

## AI-fallback discipline (brownfield, no introspection)

1. Read routes, handlers, DTOs/types, serializers, and existing tests.
2. Synthesize the spec (OpenAPI/AsyncAPI) — structure first, then payload shapes.
3. Mark every AI-synthesized contract `confidence: low` + `[REQUIERE VALIDACIÓN HUMANA]`.
4. Raise confidence by (a) capturing real traffic, or (b) adding a contract test (Pact / schema validation) that pins the shape. Once a test pins it, the contract is executable truth.

## Where the outputs land

- Versioned specs (ADR-style): `docs/projects/{client}/registries/contracts/<id>/v<N>.*`
- Derived index (document-project-style): `docs/projects/{client}/registries/contract-registry.yaml` (consumed by `lidr-impact-analysis`).

## Sources (best-practice references)

- oasdiff — OpenAPI breaking-change detection: <https://www.oasdiff.com/>
- Buf — Protobuf breaking-change detection: <https://buf.build/docs/breaking/>
- Pactflow — schema-based + consumer-driven contract testing: <https://pactflow.io/>
- AsyncAPI — schema registry for events: <https://www.asyncapi.com/docs/tutorials/kafka/managing-schemas-using-schema-registry>
- Generating OpenAPI from existing code: <https://www.blazemeter.com/blog/openapi-spec-from-code>
