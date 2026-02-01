# Extended Thinking (Ultrathink Mode)

## Overview

Extended thinking, triggered by the **"ultrathink"** keyword, enables Claude to engage in deeper, more thorough reasoning when executing skills. This feature activates Claude's internal thinking process, allowing it to work through complex problems step-by-step before providing a response.

Extended thinking is particularly valuable for tasks requiring careful analysis, multi-step reasoning, or consideration of multiple approaches.

## What is Extended Thinking?

Extended thinking (also known as "thinking mode" or "ultrathink") is a special mode where Claude:

1. **Thinks through problems** in an explicit, visible thinking block
2. **Explores multiple approaches** before settling on a solution
3. **Considers edge cases** and potential issues proactively
4. **Shows its reasoning process** transparently
5. **Takes more time** to arrive at better conclusions

**Key concept:** Including "ultrathink" anywhere in your skill content activates this mode.

## When to Use Extended Thinking

### Use Extended Thinking For:

- **Complex analysis tasks** requiring careful consideration
- **Multi-step reasoning** with dependencies
- **Design decisions** with tradeoffs to evaluate
- **Security reviews** where missing issues is costly
- **Architecture planning** requiring holistic thinking
- **Debugging difficult issues** with multiple potential causes
- **Code refactoring** with many interdependent changes
- **Performance optimization** requiring tradeoff analysis

**Examples:**
- Architectural design reviews
- Security vulnerability analysis
- Complex algorithm design
- System design proposals
- Multi-service debugging
- Database schema optimization
- API design with backward compatibility

### Don't Use Extended Thinking For:

- **Simple, straightforward tasks** (unnecessary overhead)
- **Quick information retrieval** (slows down response)
- **Formatting or style fixes** (clear, mechanical tasks)
- **Time-sensitive operations** (adds latency)
- **Tasks with obvious solutions** (thinking adds no value)

## How It Works

### Activation

Include the word **"ultrathink"** anywhere in your skill content:

```yaml
---
name: complex-analysis
description: Deep analysis requiring extended thinking
---

Ultrathink through this problem carefully...
```

**Alternative phrasings:**
- "Ultrathink through..."
- "Use ultrathink mode..."
- "Think carefully (ultrathink)..."
- "Apply ultrathink to..."

### Execution Flow

1. **Skill Invocation**: User or Claude invokes skill with ultrathink
2. **Mode Activation**: Claude enters extended thinking mode
3. **Thinking Block**: Claude shows explicit reasoning process
4. **Analysis**: Deep exploration of the problem space
5. **Solution**: Final answer based on thorough thinking
6. **Presentation**: Clear, well-reasoned response

### What You See

**Without ultrathink:**
```
Analyzing the code...

The issue is in the authentication function. Here's the fix:
[code]
```

**With ultrathink:**
```
<thinking>
Let me analyze this authentication issue carefully.

First, I need to understand the current flow:
1. User submits credentials
2. System validates against database
3. Token is generated
4. Token is returned to client

Potential issues:
- SQL injection in validation?
- Timing attacks in password comparison?
- Token generation not cryptographically secure?
- Missing rate limiting?

Let me check each file:
- auth.ts: Uses parameterized queries ✓
- password.ts: Uses bcrypt.compare (timing-safe) ✓
- token.ts: Uses crypto.randomBytes - good ✓
- routes.ts: No rate limiting! ✗

Found the issue: Missing rate limiting allows brute force attacks.

Now considering solutions:
1. Add rate limiting middleware
2. Implement account lockout
3. Add CAPTCHA after failures

Best approach: Rate limiting + account lockout
- Rate limiting prevents rapid attempts
- Account lockout prevents persistent attacks
- Both together provide defense in depth
</thinking>

The authentication issue is missing rate limiting. Here's the fix:
[code with rate limiting middleware]

I also recommend adding account lockout after 5 failed attempts.
```

## Complete Examples

### Example 1: Security Audit

Deep security analysis with extended thinking.

**.claude/skills/security-audit/SKILL.md:**
```yaml
---
name: security-audit
description: Comprehensive security audit of codebase
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

# Security Audit Task

Ultrathink through a comprehensive security audit of the codebase.

## Analysis Areas

### 1. Input Validation
- Check all user input handling
- Look for injection vulnerabilities (SQL, XSS, command)
- Verify input sanitization

### 2. Authentication & Authorization
- Review authentication mechanisms
- Check session management
- Verify authorization checks
- Look for privilege escalation paths

### 3. Cryptography
- Check password storage (hashing, salting)
- Verify token generation
- Review encryption implementation
- Check for hardcoded secrets

### 4. API Security
- Review endpoint security
- Check rate limiting
- Verify CORS configuration
- Look for information disclosure

### 5. Data Protection
- Check sensitive data handling
- Verify data encryption at rest
- Review logging (no sensitive data logged)
- Check for secure deletion

## Thinking Process

For each area:
1. **Identify**: What could go wrong?
2. **Explore**: Check implementation
3. **Evaluate**: Assess severity
4. **Recommend**: Specific fixes

## Output Format

```
# Security Audit Report

## Critical Issues
[List with file:line, description, fix]

## High Priority Issues
[List with file:line, description, fix]

## Medium Priority Issues
[List with file:line, description, fix]

## Best Practice Improvements
[List with descriptions]

## Summary
[Overall security posture assessment]
```

Take your time. Missing a security issue is worse than taking longer to find all issues.
```

**Usage:**
```
/security-audit
```

**Result:** Thorough security analysis with visible reasoning.

### Example 2: Architecture Design

Complex system design with tradeoff analysis.

**.claude/skills/design-architecture/SKILL.md:**
```yaml
---
name: design-architecture
description: Design system architecture for new feature
argument-hint: [feature-description]
context: fork
agent: Plan
---

# Architecture Design Task

Ultrathink through the architecture design for: $ARGUMENTS

## Design Process

### 1. Requirements Analysis
- Understand functional requirements
- Identify non-functional requirements (performance, scalability, reliability)
- Consider constraints (budget, timeline, existing systems)

### 2. Option Exploration
Generate at least 3 different architectural approaches:

**For each approach:**
- Describe the design
- List pros and cons
- Estimate complexity
- Assess risks

### 3. Tradeoff Analysis
Compare approaches across dimensions:
- Performance
- Scalability
- Maintainability
- Cost
- Time to implement
- Risk level

### 4. Recommendation
Select best approach with clear justification.

### 5. Implementation Plan
- Components to build
- Integration points
- Migration strategy (if applicable)
- Testing approach
- Rollout plan

## Output Format

```
# Architecture Design: [Feature]

## Requirements
[Functional and non-functional]

## Design Options

### Option 1: [Name]
**Description:** [Overview]
**Pros:** [List]
**Cons:** [List]
**Complexity:** [Low/Medium/High]
**Risks:** [List]

### Option 2: [Name]
[Same format]

### Option 3: [Name]
[Same format]

## Tradeoff Analysis
[Comparison table or detailed discussion]

## Recommended Approach
**Choice:** Option X
**Justification:** [Why this option is best]

## Implementation Plan
[Detailed plan]
```

Think deeply about tradeoffs. Consider both immediate and long-term implications.
```

**Usage:**
```
/design-architecture real-time collaboration feature
```

**Result:** Well-reasoned architecture proposal with visible thinking.

### Example 3: Complex Debugging

Multi-service debugging with hypothesis testing.

**.claude/skills/debug-system/SKILL.md:**
```yaml
---
name: debug-system
description: Debug complex multi-service issues
argument-hint: [issue-description]
context: fork
agent: Explore
---

# System Debugging Task

Ultrathink through debugging this issue: $ARGUMENTS

## Investigation Process

### 1. Symptom Analysis
- What is the reported issue?
- What is the expected behavior?
- What is the actual behavior?
- When did it start?
- Is it consistent or intermittent?

### 2. Hypothesis Generation
Generate multiple hypotheses:
- Service A issue
- Service B issue
- Network issue
- Database issue
- Configuration issue
- Race condition
- Resource exhaustion

### 3. Evidence Gathering
For each hypothesis:
- What evidence would support it?
- What evidence would refute it?
- How can we test it?

### 4. Systematic Testing
Test hypotheses in order of likelihood:
- Check logs
- Review metrics
- Trace requests
- Examine configuration
- Test components in isolation

### 5. Root Cause Identification
- What is the underlying cause?
- Why did it happen?
- What allowed it to happen?

### 6. Solution Design
- Immediate fix (stop the bleeding)
- Root cause fix (prevent recurrence)
- Monitoring improvements (detect earlier next time)

## Thinking Guidelines

- Consider cascading failures
- Don't assume single root cause
- Check recent changes (code, config, infrastructure)
- Look for correlation vs causation
- Verify fixes don't introduce new issues

## Output Format

```
# Debug Report: [Issue]

## Symptoms
[Detailed description]

## Hypotheses Considered
1. [Hypothesis 1] - [Evidence for/against]
2. [Hypothesis 2] - [Evidence for/against]
...

## Investigation
[What was checked, what was found]

## Root Cause
[Detailed explanation]

## Solution
**Immediate fix:** [Quick mitigation]
**Root cause fix:** [Permanent solution]
**Prevention:** [How to avoid in future]

## Testing
[How to verify fix works]
```

Take time to think through all possibilities. A wrong diagnosis leads to wasted effort.
```

**Usage:**
```
/debug-system payment processing failures in production
```

**Result:** Systematic debugging with hypothesis testing and reasoning.

### Example 4: Performance Optimization

Complex performance analysis with measurement.

**.claude/skills/optimize-performance/SKILL.md:**
```yaml
---
name: optimize-performance
description: Analyze and optimize system performance
argument-hint: [component-or-operation]
context: fork
agent: Explore
---

# Performance Optimization Task

Ultrathink through optimizing: $ARGUMENTS

## Optimization Process

### 1. Baseline Measurement
- Current performance metrics
- Bottleneck identification
- Resource utilization
- User impact

### 2. Analysis
Investigate potential issues:
- Algorithm complexity
- Database queries (N+1, missing indexes)
- Network calls (too many, too large)
- Memory usage (leaks, excessive allocation)
- CPU usage (expensive operations)
- I/O operations (disk, network)

### 3. Optimization Strategies
Consider multiple approaches:

**Code-level:**
- Algorithm improvements
- Caching
- Lazy loading
- Batch operations

**Database-level:**
- Query optimization
- Index creation
- Denormalization
- Read replicas

**Architecture-level:**
- Async processing
- CDN for static assets
- Microservices splitting
- Horizontal scaling

### 4. Tradeoff Analysis
For each strategy:
- Performance improvement (estimated)
- Implementation complexity
- Maintenance burden
- Cost implications
- Risk assessment

### 5. Implementation Plan
- Priority order
- Expected improvements
- Measurement approach
- Rollback plan

## Thinking Guidelines

- Measure first, optimize second
- Focus on biggest bottlenecks
- Consider diminishing returns
- Balance complexity vs benefit
- Plan for measurement and validation

## Output Format

```
# Performance Optimization: [Component]

## Current Performance
[Metrics and bottlenecks]

## Analysis
[Detailed investigation findings]

## Optimization Strategies

### Strategy 1: [Name]
**Improvement:** [Estimated % or time reduction]
**Complexity:** [Low/Medium/High]
**Tradeoffs:** [List]
**Recommendation:** [Yes/No/Maybe]

[More strategies...]

## Recommended Approach
**Priority 1:** [Strategy] - [Justification]
**Priority 2:** [Strategy] - [Justification]
...

## Implementation Plan
[Detailed steps with measurement points]

## Success Criteria
[How to measure success]
```

Think carefully about tradeoffs. Premature optimization is wasteful, but late optimization is painful.
```

**Usage:**
```
/optimize-performance user dashboard loading
```

**Result:** Data-driven optimization plan with thorough analysis.

### Example 5: Refactoring Plan

Large-scale refactoring with risk management.

**.claude/skills/plan-refactor/SKILL.md:**
```yaml
---
name: plan-refactor
description: Plan complex code refactoring
argument-hint: [target-code-area]
context: fork
---

# Refactoring Plan

Ultrathink through refactoring: $ARGUMENTS

## Planning Process

### 1. Current State Analysis
- What is the current code structure?
- What are the problems?
- Why was it designed this way?
- What has changed since then?

### 2. Goal Definition
- What should the refactored code achieve?
- What problems must be solved?
- What constraints must be respected?
- What risks must be avoided?

### 3. Approach Options
Generate multiple refactoring approaches:

**For each approach:**
- Describe the changes
- Estimate scope
- Identify dependencies
- Assess risks

### 4. Risk Analysis
- What could go wrong?
- How likely is each risk?
- How severe would impact be?
- How can we mitigate?

### 5. Step-by-Step Plan
Break refactoring into safe, incremental steps:
- Each step should be independently testable
- Each step should be reversible
- Each step should maintain functionality

### 6. Testing Strategy
- What tests are needed?
- How to verify behavior unchanged?
- How to validate improvements?

## Thinking Guidelines

- Refactor or rewrite? (usually refactor)
- Can it be done incrementally? (usually yes)
- What's the worst that could happen? (plan for it)
- How to ensure no regressions? (comprehensive tests)

## Output Format

```
# Refactoring Plan: [Target]

## Current State
[Description and problems]

## Goals
[What we want to achieve]

## Approach Options
[Multiple approaches with pros/cons]

## Recommended Approach
[Selected approach with justification]

## Risk Analysis
[Risks and mitigation strategies]

## Step-by-Step Plan

### Phase 1: [Name]
**Steps:**
1. [Step]
2. [Step]
**Tests:** [What to test]
**Rollback:** [How to undo if needed]

[More phases...]

## Testing Strategy
[Comprehensive testing approach]

## Success Criteria
[How to know refactoring succeeded]
```

Think through the entire journey. A bad refactoring plan creates more problems than it solves.
```

**Usage:**
```
/plan-refactor authentication module
```

**Result:** Comprehensive refactoring plan with risk mitigation.

## Best Practices

### 1. Use for Complex Tasks Only

✅ **DO:** Use ultrathink for complex analysis:

```yaml
Ultrathink through the security implications of this API design.
```

❌ **DON'T:** Use for simple tasks:

```yaml
Ultrathink through formatting this file.
```

### 2. Provide Clear Context

✅ **DO:** Give Claude context to think about:

```yaml
Ultrathink through debugging this issue. Consider:
- Recent code changes
- System architecture
- Error patterns
- Resource constraints
```

❌ **DON'T:** Expect ultrathink to compensate for missing context.

### 3. Combine with Context Fork

✅ **DO:** Use in isolated subagent for focused thinking:

```yaml
---
context: fork
agent: Explore
---

Ultrathink through this complex problem...
```

### 4. Set Expectations

✅ **DO:** Explain what to think about:

```yaml
Ultrathink through all possible failure modes and their mitigations.
```

### 5. Allow Time

✅ **DO:** Accept that thinking takes time for better results.

❌ **DON'T:** Use ultrathink for time-sensitive operations.

## Platform Compatibility

### Claude Code

| Feature | Support |
|---------|---------|
| "ultrathink" keyword | ✅ Full support |
| Visible thinking blocks | ✅ Full support |
| Extended reasoning | ✅ Full support |

### Other Platforms

**Cursor, Gemini CLI, Antigravity:**
- Extended thinking support varies
- Some platforms may not support thinking blocks
- Keyword may be ignored or work differently
- Test on target platform

## Common Pitfalls

### 1. Overuse

❌ **Problem:** Using ultrathink for every skill.

**Issue:** Slows down simple tasks unnecessarily.

✅ **Solution:** Reserve for genuinely complex tasks.

### 2. No Clear Directive

❌ **Problem:**

```yaml
Ultrathink through this.
```

**Issue:** Claude doesn't know what specifically to think about.

✅ **Solution:**

```yaml
Ultrathink through the security implications, considering:
- Input validation
- Authentication
- Authorization
- Data protection
```

### 3. Time-Sensitive Tasks

❌ **Problem:**

```yaml
---
name: quick-fix
---

Ultrathink through fixing this typo.
```

**Issue:** Thinking adds unnecessary latency.

✅ **Solution:** Don't use ultrathink for simple, time-sensitive tasks.

## Troubleshooting

### No Thinking Block Visible

**Problem:** Ultrathink keyword present but no thinking shown.

**Diagnosis:**
1. Check platform supports thinking blocks
2. Verify "ultrathink" spelled correctly
3. Check task is complex enough to warrant thinking

**Solution:**
- Ensure platform compatibility
- Use more complex task that benefits from thinking
- Check for typos in keyword

### Thinking Too Shallow

**Problem:** Thinking block present but not thorough.

**Diagnosis:**
1. Is the task actually complex?
2. Is enough context provided?
3. Are specific thinking areas mentioned?

**Solution:**
```yaml
Ultrathink through this security audit. Consider:
1. Input validation in all endpoints
2. Authentication token security
3. Authorization bypass possibilities
4. Data encryption at rest and in transit
5. Logging and monitoring gaps
```

### Too Much Thinking

**Problem:** Thinking block is extremely long.

**Diagnosis:**
- Task may be too broad
- Too many dimensions to consider
- Lack of focus

**Solution:**
```yaml
# Break into smaller skills
/security-audit-auth  # Just authentication
/security-audit-data  # Just data protection
```

## Related Documentation

- [Skills in Claude Code](../claude-code.md) - Complete skills reference
- [Subagent Integration](subagents-integration.md) - Skills with subagents
- [Dynamic Context](dynamic-context.md) - Command injection
- [Tool Restrictions](tool-restrictions.md) - Controlling tools

## Further Reading

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Extended Thinking:** [anthropic.com/extended-thinking](https://www.anthropic.com)

---

**Last Updated:** February 2026
**Category:** Skills - Advanced
**Platform:** Claude Code
