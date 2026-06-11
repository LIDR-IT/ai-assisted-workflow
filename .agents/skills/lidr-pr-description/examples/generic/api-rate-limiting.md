---
id: pr-description-example-api-rate-limiting
version: "1.0.0"
last_updated: "2026-06-12"
updated_by: "TL: domain-pack convention"
status: active
type: template
---

# PR Description Example: API Rate Limiting Middleware

**Scenario**: Adding configurable rate limiting middleware to the public API to protect against abuse and ensure fair usage across tenants.

---

## PR Title

`feat(api): add configurable rate limiting middleware with Redis backend`

## What Changed?

Introduced a reusable rate limiting layer for all public API endpoints:

- **New middleware**: Token-bucket rate limiter applied per API key
- **Redis backend**: Distributed counters so limits hold across instances
- **Configurable limits**: Per-route and per-tenant overrides via config
- **Standard headers**: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
- **Graceful degradation**: Fails open with a logged warning if Redis is unreachable

### Technical Details

#### Files Changed

- `src/middleware/rateLimit.ts` - Token-bucket rate limiting middleware
- `src/services/RateLimitService.ts` - Redis-backed counter logic
- `src/config/rateLimit.config.ts` - Per-route and per-tenant limits
- `database/migrations/20260612_rate_limit_audit.sql` - Audit table for throttled requests
- `tests/middleware/rateLimit.spec.ts` - Unit tests for limiter behavior

## Why Changed?

### Business Driver

- **Abuse protection**: Prevent a single client from exhausting shared capacity
- **Fair usage**: Guarantee predictable performance across all tenants
- **Cost control**: Reduce wasted compute from runaway integrations

### Technical Driver

Current system has no per-client throttling:

- A misbehaving client can degrade latency for everyone
- No standard way to communicate limits back to API consumers
- No audit trail for throttled traffic

## How to Test

### Testing Checklist

- [ ] **Limit enforcement**: Confirm requests beyond the limit return `429`
- [ ] **Header accuracy**: Verify `RateLimit-Remaining` decrements correctly
- [ ] **Distributed counting**: Validate limits hold across two app instances
- [ ] **Fail-open**: Stop Redis and confirm requests still succeed with a warning
- [ ] **Per-tenant override**: Confirm a tenant override raises the limit

### Test Scenarios

```bash
# 1. Unit tests for limiter behavior
npm run test -- --grep "rate limit"

# 2. Verify 429 after exceeding the configured limit
for i in $(seq 1 101); do curl -s -o /dev/null -w "%{http_code}\n" \
  -H "X-API-Key: test-key" http://localhost:3000/api/v1/items; done
```

### Manual Testing Steps

1. Send requests under the limit and confirm `200` responses
2. Exceed the limit and confirm a `429` with a `Retry-After` header
3. Inspect the audit table and confirm throttled requests are recorded

## Verification Criteria

- Requests over the limit return `429` and are logged
- `RateLimit-*` headers are present and accurate on every response
- Expected result: no regression in P95 latency for compliant clients

## Change Impact

### API Changes

- New rate limit headers added to all responses (backwards compatible)
- No breaking changes to existing request or response payloads
- Versioning unchanged; behavior is additive

### Database Changes

- New `rate_limit_audit` table added via migration
- No changes to existing schema or columns

## Security Considerations

- Rate limiting reduces brute-force and credential-stuffing exposure
- Limiter keys derive from API key hashes; no raw secrets are stored
- All configuration validated at startup to keep limits safe

## Deployment Notes

- Requires `REDIS_URL` environment variable in each environment
- Roll out to staging first, then production after smoke tests pass

### Rollback Plan

- This is a critical path change; rollback disables the middleware via feature flag
- Revert is safe: removing the middleware restores prior unthrottled behavior

## Code Review Guidance

- Focus review attention on the fail-open path and Redis error handling
- Note: limiter config is hot-reloadable; confirm no stale config is cached

## Technical Debt

- TODO: follow-up to add sliding-window option as a future improvement
- No new debt introduced; refactor of shared middleware utilities included

## Related Issues

- Closes API-321: protect public API from abuse
- Relates to API-300: multi-tenant fair usage initiative

---

**Review**: ✅ Tech Lead approved
**Performance Review**: ✅ Meets latency SLA
