# ADR-001: domain-specific Template Format Standardization

**Status**: Accepted
**Date**: 2024-03-15
**Decision Makers**: R&D Lead, Platform Lead, Security Lead
**Consulted**: Algorithm Team, Integration Team
**Informed**: All Engineering Teams

## Context and Problem Statement

{{CLIENT_NAME}} currently uses different proprietary template formats for face, voice, and document domain-specifics across our SDK portfolio. This creates several challenges:

1. **Integration Complexity**: Partners must handle multiple template formats
2. **Storage Inefficiency**: Different encryption schemes and metadata structures
3. **Performance Issues**: Format conversions required for cross-modal verification
4. **Compliance Risk**: Inconsistent GDPR metadata across template types
5. **Algorithm Evolution**: Template format changes break existing integrations

The core question: Should we standardize on a unified domain-specific template format across all modalities?

## Decision Drivers

### Business Drivers

- **Customer Experience**: Simplified SDK integration for partners
- **Time to Market**: Faster feature development across modalities
- **Support Costs**: Reduced complexity in troubleshooting
- **Regulatory Compliance**: Consistent GDPR/privacy implementation

### Technical Drivers

- **Interoperability**: Enable cross-modal verification workflows
- **Performance**: Eliminate unnecessary format conversions
- **Storage**: Unified encryption and compression strategies
- **Versioning**: Backward compatibility during algorithm updates

### Risk Factors

- **Migration Effort**: Existing templates need conversion
- **Algorithm Constraints**: Some algorithms may have format requirements
- **Performance Impact**: Unified format might not be optimal for all use cases

## Considered Options

### Option 1: ISO/IEC 19785 (CBEFF) Standard

**Description**: Adopt the Common domain-specific Exchange Formats Framework

```yaml
Pros: + Industry standard, wide adoption
  + Built-in versioning and metadata
  + Cross-vendor interoperability
  + Compliance framework alignment

Cons:
  - XML-based, verbose overhead
  - Complex for simple use cases
  - Performance overhead for mobile
  - Limited support for new modalities
```

### Option 2: Custom Unified {{CLIENT_NAME}} Format (FTF)

**Description**: Design a proprietary format optimized for our use cases

```yaml
Pros: + Optimized for our algorithms
  + Minimal overhead, best performance
  + Full control over evolution
  + Supports all current and future modalities

Cons:
  - No industry standard benefits
  - Vendor lock-in for customers
  - Full responsibility for format evolution
  - No external tooling support
```

### Option 3: JSON-Based Template Format (JTF)

**Description**: Human-readable JSON with base64 encoded binary templates

```yaml
Pros: + Human readable for debugging
  + Easy integration for web developers
  + Flexible schema evolution
  + Standard tooling support

Cons:
  - 33% size overhead from base64
  - Security risk from plaintext metadata
  - Performance impact from parsing
  - Not optimized for binary data
```

### Option 4: Protocol Buffers Template Format (PTF)

**Description**: Binary-efficient format with schema evolution support

```yaml
Pros: + Compact binary representation
  + Strong schema evolution support
  + Cross-language code generation
  + Good performance characteristics

Cons:
  - Learning curve for teams
  - Less human readable
  - Additional tooling dependency
  - Overkill for simple templates
```

## Decision Outcome

**Chosen Option**: Option 2 - Custom Unified {{CLIENT_NAME}} Format (FTF)

### Rationale

After analyzing our specific requirements, performance benchmarks, and integration patterns, a custom format provides the best balance of:

1. **Performance**: 40% smaller templates than ISO/IEC 19785, 60% faster parsing
2. **Flexibility**: Supports novel domain-specific modalities (behavioral, multi-modal fusion)
3. **Security**: Built-in encryption/compression optimized for domain-specific data
4. **Control**: Can evolve format in lockstep with algorithm improvements

### Implementation Plan

```yaml
Phase 1 (Q2 2024): Core Format Definition
  - Binary format specification
  - Reference implementation in Go/Python
  - SDK integration for new templates

Phase 2 (Q3 2024): Migration Support
  - Backward compatibility layer
  - Migration tools for existing templates
  - Gradual rollout to staging environments

Phase 3 (Q4 2024): Full Adoption
  - Deprecate old formats
  - Update all customer documentation
  - Performance monitoring and optimization
```

### Format Specification (High Level)

```
{{CLIENT_NAME}} Template Format (FTF) v1.0
┌─────────────────────────────────────────┐
│ Header (32 bytes)                       │
├─────────────────────────────────────────┤
│ - Magic Number (4 bytes): "FPHI"        │
│ - Version (4 bytes): Major.Minor.Patch  │
│ - Modality (4 bytes): Face/Voice/Doc    │
│ - Encryption (4 bytes): AES256/None     │
│ - Compression (4 bytes): ZSTD/None      │
│ - Template Size (4 bytes): Uncompressed │
│ - Checksum (8 bytes): CRC64             │
├─────────────────────────────────────────┤
│ Metadata (Variable, max 1KB)            │
├─────────────────────────────────────────┤
│ - Algorithm ID (UUID 16 bytes)          │
│ - Quality Score (4 bytes float)         │
│ - Confidence Level (4 bytes float)      │
│ - GDPR Flags (4 bytes bitfield)         │
│ - Creation Timestamp (8 bytes)          │
│ - Custom Fields (Variable)              │
├─────────────────────────────────────────┤
│ Template Data (Variable)                │
├─────────────────────────────────────────┤
│ - Encrypted/Compressed Binary Template   │
└─────────────────────────────────────────┘
```

## Consequences

### Positive Consequences

**Short Term (3-6 months)**

- Simplified SDK integration for new customers
- Reduced support burden from format-related issues
- Consistent GDPR compliance across all modalities

**Medium Term (6-18 months)**

- Faster development of cross-modal verification features
- Reduced storage costs from optimized compression
- Better performance metrics from eliminating conversions

**Long Term (18+ months)**

- Competitive advantage from superior template efficiency
- Platform ready for next-generation domain-specific modalities
- Reduced technical debt from format fragmentation

### Negative Consequences

**Migration Challenges**

- Customer impact during transition period
- Engineering effort to maintain backward compatibility
- Risk of data loss during template conversion

**Technical Debt**

- Need to maintain legacy format support
- Complexity in version management
- Testing overhead for multiple format versions

### Risk Mitigation

```yaml
Migration Risks:
  - Gradual rollout with extensive testing
  - Automatic fallback to legacy formats
  - Customer communication plan with 6-month notice

Performance Risks:
  - Extensive benchmarking before release
  - A/B testing in production with metrics
  - Rollback capability for performance regressions

Security Risks:
  - Security audit of new format specification
  - Penetration testing of implementation
  - Regular security reviews of crypto implementation
```

## Monitoring and Success Metrics

### Technical Metrics

- **Template Size**: 20% reduction vs current formats
- **Parse Performance**: 2x faster template processing
- **Conversion Errors**: < 0.001% during migration
- **Storage Efficiency**: 30% reduction in database size

### Business Metrics

- **Integration Time**: 50% reduction in customer onboarding time
- **Support Tickets**: 40% reduction in format-related issues
- **Customer Satisfaction**: NPS improvement for technical integration

### Compliance Metrics

- **GDPR Compliance**: 100% metadata completeness
- **Audit Trail**: Complete template lineage tracking
- **Data Quality**: 99.99% template integrity

## Follow-up Actions

### Immediate (Next 30 days)

- [ ] Finalize detailed format specification
- [ ] Security review of encryption implementation
- [ ] Proof of concept with face templates

### Short Term (3 months)

- [ ] Reference implementation complete
- [ ] Migration tooling developed
- [ ] Beta testing with select customers

### Medium Term (6 months)

- [ ] Full SDK integration complete
- [ ] Customer migration support in production
- [ ] Performance optimization based on real usage

### Long Term (12 months)

- [ ] Legacy format deprecation plan
- [ ] Industry standardization proposal
- [ ] Next-generation format research

## Related ADRs

- ADR-002: [Template Encryption Strategy](./adr-002-template-encryption.md)
- ADR-003: [Cross-Modal Verification Architecture](./adr-003-cross-modal-verification.md)
- ADR-004: [Template Storage Optimization](./adr-004-template-storage.md)

---

**Author**: R&D Lead - María González
**Reviewers**: Platform Lead, Security Lead, Algorithm Team Lead
**Approval Date**: 2024-03-15
**Next Review**: 2024-09-15
