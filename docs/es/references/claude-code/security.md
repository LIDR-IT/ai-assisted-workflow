# Security in Claude Code

## Overview

Claude Code is built with security at its core, developed according to Anthropic's comprehensive security program. Your code's security is paramount.

**Official Documentation:** [code.claude.com/docs/en/security](https://code.claude.com/docs/en/security)

**Key Benefit:** "Learn about Claude Code's security safeguards and best practices for safe usage."

---

## Security Foundation

### Anthropic Security Program

Claude Code developed according to **comprehensive security program**.

**Resources available:**
- SOC 2 Type 2 report
- ISO 27001 certificate
- Additional compliance documentation

**Access:** [Anthropic Trust Center](https://trust.anthropic.com)

### Core Principles

**1. Security by default**
- Built with security at core
- Strict read-only permissions by default
- Transparent operations

**2. User control**
- Explicit permission requests for actions
- Approve once or allow automatically
- Direct permission configuration

**3. Defense in depth**
- Multiple layers of protection
- Built-in safeguards
- User responsibility

---

## Permission-Based Architecture

### Default Permissions

**Read-only by default:** Claude Code starts with minimal permissions

**Actions requiring permission:**
- Editing files
- Running tests
- Executing commands

### Permission Model

**Explicit requests:** Claude Code requests permission when additional actions needed

**User control:**
- **Approve once** - Single action approval
- **Allow automatically** - Ongoing approval for pattern

**Transparency:** All actions visible before execution

**Example:** Bash commands require approval before executing

**Configuration:** See Identity and Access Management documentation

---

## Built-in Protections

### 1. Sandboxed Bash Tool

**Purpose:** Filesystem and network isolation for bash commands

**Benefits:**
- Reduces permission prompts
- Maintains security
- Autonomous work in defined boundaries

**Enable:** Use `/sandbox` to define boundaries

**See:** Sandboxing documentation for details

### 2. Write Access Restriction

**Boundary:** Claude Code can only write to folder where it was started and subfolders

**Protection:** Cannot modify files in parent directories without explicit permission

**Read permissions:** Can read files outside working directory (useful for system libraries and dependencies)

**Write operations:** Strictly confined to project scope

**Result:** Clear security boundary

### 3. Prompt Fatigue Mitigation

**Allowlisting support:**
- Frequently used safe commands
- Per-user configuration
- Per-codebase configuration
- Per-organization configuration

**Benefit:** Reduce repetitive prompts while maintaining security

### 4. Accept Edits Mode

**Feature:** Batch accept multiple edits

**Security:** Maintains permission prompts for commands with side effects

**Balance:** Efficiency + safety

---

## User Responsibility

**Critical:** Claude Code only has permissions you grant it

**Your responsibility:**
- Review proposed code before approval
- Review proposed commands before approval
- Verify safety of operations

---

## Prompt Injection Protection

**Threat:** Attacker attempts to override or manipulate AI assistant's instructions by inserting malicious text

**Claude Code includes several safeguards:**

### Core Protections

**Permission system**
- Sensitive operations require explicit approval

**Context-aware analysis**
- Detects potentially harmful instructions
- Analyzes full request

**Input sanitization**
- Prevents command injection
- Processes user inputs

**Command blocklist**
- Blocks risky commands by default
- Examples: `curl`, `wget` (fetch arbitrary web content)
- When explicitly allowed, be aware of permission pattern limitations

**See:** IAM documentation for permission pattern limitations

### Privacy Safeguards

**Data protection:**

**Limited retention periods**
- Sensitive information retention limited
- See Privacy Center for details: [privacy.anthropic.com](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data)

**Restricted access**
- User session data access restricted

**User control**
- Data training preferences controllable
- Consumer users can change privacy settings anytime: [claude.ai/settings/privacy](https://claude.ai/settings/privacy)

**Legal documentation:**
- **Team/Enterprise/API:** [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms)
- **Free/Pro/Max:** [Consumer Terms](https://www.anthropic.com/legal/consumer-terms)
- **All users:** [Privacy Policy](https://www.anthropic.com/legal/privacy)

### Additional Safeguards

**Network request approval**
- Tools making network requests require user approval by default

**Isolated context windows**
- Web fetch uses separate context window
- Avoids injecting potentially malicious prompts

**Trust verification**
- First-time codebase runs require trust verification
- New MCP servers require trust verification
- **Note:** Disabled when running non-interactively with `-p` flag

**Command injection detection**
- Suspicious bash commands require manual approval
- Even if previously allowlisted

**Fail-closed matching**
- Unmatched commands default to requiring manual approval

**Natural language descriptions**
- Complex bash commands include explanations
- User understanding before approval

**Secure credential storage**
- API keys and tokens encrypted
- See Credential Management in IAM documentation

---

## Windows WebDAV Security Risk

**Warning:** When running Claude Code on Windows:

**Recommendation:** Against enabling WebDAV or allowing Claude Code to access paths like `\\*` containing WebDAV subdirectories

**Reason:** [WebDAV deprecated by Microsoft](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features#:~:text=The%20Webclient%20\(WebDAV\)%20service%20is%20deprecated) due to security risks

**Risk:** Enabling WebDAV may allow Claude Code to trigger network requests to remote hosts, bypassing permission system

---

## Best Practices for Untrusted Content

**When working with untrusted content:**

**1. Review suggested commands** before approval
- Don't blindly approve
- Understand what command does

**2. Avoid piping untrusted content** directly to Claude
- Sanitize input first
- Verify source

**3. Verify proposed changes** to critical files
- Double-check modifications
- Understand impact

**4. Use virtual machines (VMs)** to run scripts and make tool calls
- Especially when interacting with external web services
- Additional isolation layer

**5. Report suspicious behavior** with `/bug`
- Help improve security
- Alert Anthropic to issues

**Warning:** While protections significantly reduce risk, no system is completely immune to all attacks. Always maintain good security practices when working with any AI tool.

---

## MCP Security

### MCP Server Configuration

**Location:** MCP servers configured in source code as part of Claude Code settings

**Version control:** Engineers check settings into source control

### Recommendations

**Write your own MCP servers** or use servers from **trusted providers**

**Configure permissions** for MCP servers through Claude Code

**Important:** Anthropic does **not** manage or audit any MCP servers

**Responsibility:** You are responsible for vetting and trusting MCP servers

---

## IDE Security

**VS Code integration:** See VS Code security and privacy documentation for details

**Additional considerations:**
- IDE extensions run with user permissions
- Review extension security before installing
- Keep VS Code and extensions updated

---

## Cloud Execution Security

**Applies to:** Claude Code on the web

**Additional controls:**

### 1. Isolated Virtual Machines

**Each cloud session runs in:**
- Isolated VM
- Anthropic-managed environment

**Benefit:** Session isolation prevents cross-contamination

### 2. Network Access Controls

**Default:** Network access limited

**Configuration options:**
- Disable entirely
- Allow only specific domains

### 3. Credential Protection

**Authentication handling:**
- Secure proxy
- Scoped credential inside sandbox
- Translated to actual GitHub token

**Benefit:** Tokens never exposed directly

### 4. Branch Restrictions

**Git push operations:** Restricted to current working branch

**Protection:** Cannot accidentally push to wrong branch

### 5. Audit Logging

**All operations logged for:**
- Compliance
- Audit purposes

**Visibility:** Full operation history

### 6. Automatic Cleanup

**Cloud environments:**
- Automatically terminated after session completion

**Benefit:** No lingering resources or data

**See:** Claude Code on the web documentation for more details

---

## Security Best Practices

### Working with Sensitive Code

**1. Review all suggested changes** before approval
- Don't auto-approve for sensitive repos
- Understand each change

**2. Use project-specific permission settings** for sensitive repositories
- Stricter controls for critical code
- Custom allowlists/denylists

**3. Consider using devcontainers** for additional isolation
- Container-based development
- Extra security layer

**4. Regularly audit permission settings** with `/permissions`
- Review what's allowed
- Remove unnecessary permissions
- Update as needed

**See:** Devcontainer documentation

### Team Security

**1. Use managed settings** to enforce organizational standards
- Centralized control
- Consistent policies
- Mandatory configurations

**2. Share approved permission configurations** through version control
- Team consistency
- Reviewed configurations
- Track changes

**3. Train team members** on security best practices
- Security awareness
- Proper usage patterns
- Incident reporting

**4. Monitor Claude Code usage** through OpenTelemetry metrics
- Track operations
- Detect anomalies
- Audit activity

**See:** Managed settings in IAM documentation

**See:** OpenTelemetry monitoring documentation

---

## Reporting Security Issues

**If you discover security vulnerability in Claude Code:**

### Responsible Disclosure

**1. Do NOT disclose publicly**
- Private disclosure only
- Protect other users

**2. Report through HackerOne**
- **URL:** [hackerone.com/anthropic-vdp/reports/new](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability)
- Official vulnerability disclosure program

**3. Include detailed reproduction steps**
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

**4. Allow time to address**
- Give Anthropic time to fix
- Coordinate disclosure timing
- Work collaboratively

---

## Security Layers

### Layer 1: Permission System

**First line of defense:**
- Read-only by default
- Explicit approval required
- User control

### Layer 2: Built-in Protections

**Automated safeguards:**
- Sandboxed execution
- Write access restrictions
- Command blocklisting
- Input sanitization

### Layer 3: User Vigilance

**Human oversight:**
- Review proposed changes
- Verify commands
- Report suspicious behavior

### Layer 4: Organizational Controls

**Enterprise security:**
- Managed settings
- Team policies
- Audit logging
- Monitoring

---

## Threat Model

### In-Scope Threats

**Claude Code protects against:**

**Unauthorized file access**
- Read-only default
- Write restrictions
- Permission checks

**Malicious command execution**
- Approval required
- Command blocklist
- Injection detection

**Prompt injection attacks**
- Context isolation
- Input sanitization
- Suspicious pattern detection

**Credential exposure**
- Encrypted storage
- Scoped credentials
- Secure proxy

**Network-based attacks**
- Network access controls
- Approval required
- Domain restrictions

### Out-of-Scope

**Claude Code cannot protect against:**

**User approval of malicious actions**
- User responsibility to review
- Cannot prevent deliberate approval

**Vulnerabilities in user code**
- Code review still necessary
- Not a security scanner

**Social engineering of users**
- User training required
- Security awareness

**Compromised dependencies**
- Dependency scanning separate
- Supply chain security

---

## Compliance and Certifications

### Available Certifications

**SOC 2 Type 2**
- Security controls audit
- Operational effectiveness

**ISO 27001**
- Information security management
- International standard

**Additional resources:**
- Compliance documentation
- Security whitepapers
- Penetration test summaries

**Access:** [Anthropic Trust Center](https://trust.anthropic.com)

### Data Handling

**Encryption:**
- In transit (TLS)
- At rest (encrypted storage)

**Access controls:**
- Role-based access
- Audit logging
- Limited retention

**Compliance:**
- GDPR
- SOC 2
- ISO 27001

---

## Security Checklist

### For Individual Developers

- [ ] Review all suggested changes before approval
- [ ] Understand commands before running
- [ ] Use `/sandbox` for untrusted operations
- [ ] Audit permissions regularly with `/permissions`
- [ ] Report suspicious behavior with `/bug`
- [ ] Keep Claude Code updated
- [ ] Use VMs for high-risk operations

### For Team Leads

- [ ] Configure managed settings for team
- [ ] Share approved permission configurations
- [ ] Train team on security best practices
- [ ] Monitor usage through OpenTelemetry
- [ ] Review team permission settings
- [ ] Establish incident response process
- [ ] Document security policies

### For Security Teams

- [ ] Review managed settings configuration
- [ ] Set up audit logging
- [ ] Configure network restrictions for cloud execution
- [ ] Establish vulnerability disclosure process
- [ ] Monitor for security incidents
- [ ] Regular security awareness training
- [ ] Penetration testing of configurations

---

## Related Resources

### In This Repository

**Security-Related:**
- Sandboxing documentation (when available)
- IAM documentation (when available)
- Monitoring usage documentation (when available)
- Devcontainer documentation (when available)

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/security](https://code.claude.com/docs/en/security)
- **Sandboxing:** [code.claude.com/docs/en/sandboxing](https://code.claude.com/docs/en/sandboxing)
- **IAM:** [code.claude.com/docs/en/iam](https://code.claude.com/docs/en/iam)
- **Monitoring:** [code.claude.com/docs/en/monitoring-usage](https://code.claude.com/docs/en/monitoring-usage)
- **Devcontainer:** [code.claude.com/docs/en/devcontainer](https://code.claude.com/docs/en/devcontainer)
- **Claude Code on Web:** [code.claude.com/docs/en/claude-code-on-the-web](https://code.claude.com/docs/en/claude-code-on-the-web)
- **VS Code Security:** [code.claude.com/docs/en/vs-code#security-and-privacy](https://code.claude.com/docs/en/vs-code#security-and-privacy)
- **Anthropic Trust Center:** [trust.anthropic.com](https://trust.anthropic.com)
- **HackerOne VDP:** [hackerone.com/anthropic-vdp](https://hackerone.com/anthropic-vdp/reports/new?type=team&report_type=vulnerability)
- **Privacy Center:** [privacy.anthropic.com](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data)
- **Privacy Settings:** [claude.ai/settings/privacy](https://claude.ai/settings/privacy)
- **Commercial Terms:** [anthropic.com/legal/commercial-terms](https://www.anthropic.com/legal/commercial-terms)
- **Consumer Terms:** [anthropic.com/legal/consumer-terms](https://www.anthropic.com/legal/consumer-terms)
- **Privacy Policy:** [anthropic.com/legal/privacy](https://www.anthropic.com/legal/privacy)

---

**Last Updated:** January 2026
**Category:** Security
**Status:** Core Feature
**Certifications:** SOC 2 Type 2, ISO 27001
