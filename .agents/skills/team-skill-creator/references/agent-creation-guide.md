# Agent Creation Guide

Complete process for creating autonomous agents within Claude Code. Agents are specialized subprocesses that handle complex, multi-step tasks independently.

## Table of Contents

1. [What Are Agents?](#what-are-agents)
2. [When to Use Agents](#when-to-use-agents)
3. [Agent Structure](#agent-structure)
4. [Frontmatter Configuration](#frontmatter-configuration)
5. [System Prompt Design](#system-prompt-design)
6. [Creation Process](#creation-process)
7. [Best Practices](#best-practices)
8. [Platform Limitations](#platform-limitations)

## What Are Agents?

Agents are **autonomous subprocesses** that Claude Code spawns to handle complex tasks requiring:

- Multiple steps and decision-making
- Deep codebase exploration
- Independent problem-solving
- Long-running operations

**Key characteristics:**

- Autonomous operation (work independently)
- Multi-step workflows
- Access to specific tools (Read, Edit, Grep, Bash, etc.)
- System prompt defining behavior
- Platform-specific (Claude Code only)

**Comparison to skills and commands:**

| Aspect          | Agent            | Skill               | Command       |
| --------------- | ---------------- | ------------------- | ------------- |
| Autonomy        | High             | None                | None          |
| Complexity      | High             | Medium-High         | Low           |
| Use case        | Multi-step tasks | Knowledge/workflows | Quick prompts |
| Decision-making | Yes              | No                  | No            |
| Platform        | Claude Code only | All 4               | All 4         |

## When to Use Agents

### Good Agent Candidates

**Use agents when:**

- ✅ Multi-step workflows requiring decisions
- ✅ Deep codebase analysis or refactoring
- ✅ Autonomous operation needed
- ✅ Complex problem-solving
- ✅ Long-running tasks

**Examples:**

- Code reviewer (analyze multiple files, identify patterns, suggest improvements)
- Test generator (explore code, determine test cases, write tests)
- Security auditor (scan codebase, identify vulnerabilities, prioritize fixes)
- Refactoring agent (analyze structure, plan refactoring, execute changes)
- Documentation generator (understand code, write comprehensive docs)

### Poor Agent Candidates

**Don't use agents when:**

- ❌ Simple, single-turn tasks (use commands)
- ❌ Needs bundled resources like templates (use skills)
- ❌ No decision-making required
- ❌ Quick prompts
- ❌ Platform compatibility needed (agents are Claude Code only)

**Use commands instead:**

- Security review checklist
- Commit message generation
- Code formatting prompts

**Use skills instead:**

- React testing patterns (needs templates)
- Database queries (needs schema docs)
- API integration (needs API reference)

## Agent Structure

### File Location

```
.claude/agents/{agent-name}.md
```

**Important:** Agents are **platform-specific** to Claude Code:

- Location: `.claude/agents/` NOT `.agents/`
- No synchronization needed (not in `.agents/` source of truth)
- Only works in Claude Code

**Naming conventions:**

- Lowercase, hyphens
- Descriptive: `code-reviewer.md`, `test-generator.md`
- Action-oriented names

### File Format

```markdown
---
name: agent-name
description: Brief description and triggering condition
tools: [Read, Edit, Grep, Bash]
model: sonnet
color: blue
---

# Agent System Prompt

You are an agent specialized in [specific task].

## Your Capabilities

- Capability 1
- Capability 2

## Your Workflow

1. Step 1
2. Step 2
3. Step 3

## Decision-Making

You should autonomously decide...
```

## Frontmatter Configuration

### Required Fields

**name:**

- Format: lowercase, hyphens
- Example: `code-reviewer`, `test-generator`

**description:**

- Brief description of agent purpose
- Triggering conditions (when agent should be used)
- Example: "Autonomous code reviewer for analyzing code quality and suggesting improvements"

### Optional Fields

**tools:**

- List of tools agent can use
- Available tools: `Read`, `Edit`, `Write`, `Grep`, `Glob`, `Bash`, `Task`, etc.
- Example: `[Read, Edit, Grep, Bash]`
- Default: All tools available if not specified

**model:**

- AI model to use
- Options: `sonnet`, `opus`, `haiku`
- Example: `sonnet` (recommended for most agents)
- Default: Inherits from parent if not specified

**color:**

- Visual identifier in Claude Code UI
- Options: `red`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`
- Example: `blue`
- Helps distinguish agents visually

### Example Frontmatter

**Simple agent:**

```yaml
---
name: code-reviewer
description: Autonomous code review agent for quality analysis
tools: [Read, Grep, Bash]
---
```

**Complex agent:**

```yaml
---
name: test-generator
description: Generate comprehensive test suites with coverage analysis
tools: [Read, Write, Grep, Bash]
model: sonnet
color: green
---
```

## System Prompt Design

The system prompt defines agent behavior, capabilities, and workflow.

### System Prompt Structure

```markdown
# Agent Title

Brief introduction: "You are an agent specialized in [task]."

## Your Capabilities

List what the agent can do:

- Capability 1: Description
- Capability 2: Description
- Capability 3: Description

## Your Workflow

Define the step-by-step process:

1. **Step 1**: What to do first
2. **Step 2**: What to do next
3. **Step 3**: How to conclude

## Autonomous Decision-Making

Describe what decisions the agent can make independently:

- Decision area 1
- Decision area 2

## Guidelines

Provide specific guidelines for agent behavior:

- Guideline 1
- Guideline 2

## Output Format (optional)

Specify how agent should present results.
```

### Writing Effective System Prompts

**1. Define clear role and purpose**

✅ Good:

```markdown
# Code Reviewer Agent

You are an autonomous agent specialized in comprehensive code review and quality analysis.
```

❌ Poor:

```markdown
You review code.
```

**2. List specific capabilities**

✅ Good:

```markdown
## Your Capabilities

- Analyze code structure and design patterns
- Identify code smells and anti-patterns
- Suggest refactoring opportunities
- Check for security vulnerabilities
- Assess test coverage
```

❌ Poor:

```markdown
## Capabilities

You can review code.
```

**3. Define autonomous decision-making**

✅ Good:

```markdown
## Decision-Making

You autonomously decide:

- Which files to analyze based on change impact
- Severity of issues (Critical/High/Medium/Low)
- Whether to suggest refactoring or accept current implementation
- Prioritization of recommendations
```

❌ Poor:

```markdown
Make decisions about the code.
```

**4. Specify clear workflow**

✅ Good:

```markdown
## Workflow

1. **Analyze structure**: Read files and understand codebase organization
2. **Identify issues**: Use grep to find patterns indicating problems
3. **Assess severity**: Categorize issues by impact and urgency
4. **Generate recommendations**: Provide specific, actionable fixes with code examples
5. **Summarize**: Create prioritized report of findings
```

❌ Poor:

```markdown
## Workflow

1. Look at code
2. Find problems
3. Report issues
```

## Creation Process

### Step 1: Define Agent Purpose

**Answer these questions:**

- What complex task needs autonomous handling?
- What decisions will the agent make?
- What tools does it need?
- What's the expected workflow?

**Example:**

- **Purpose:** Autonomous code review and quality analysis
- **Decisions:** Issue severity, refactoring suggestions, priority
- **Tools:** Read, Grep, Bash (for testing)
- **Workflow:** Analyze → Identify → Assess → Recommend → Report

### Step 2: Design System Prompt

Write comprehensive system prompt covering:

- Role and capabilities
- Step-by-step workflow
- Decision-making autonomy
- Guidelines and constraints

See [System Prompt Design](#system-prompt-design) section.

### Step 3: Configure Frontmatter

```yaml
---
name: agent-name
description: Clear description and triggering condition
tools: [Read, Edit, Grep, Bash] # Tools agent needs
model: sonnet # Recommended for most agents
color: blue # Visual identifier
---
```

### Step 4: Create Agent File

```bash
# Create agent file in Claude Code directory
touch .claude/agents/{agent-name}.md

# Edit file
vim .claude/agents/{agent-name}.md
```

**Note:** No sync needed - agents are Claude Code-specific.

### Step 5: Test Agent

**In Claude Code:**

1. Trigger agent with appropriate context
2. Observe autonomous behavior
3. Verify decisions and workflow
4. Check output quality

**Iteration:**

- Adjust system prompt based on behavior
- Refine decision-making guidelines
- Add or remove tools as needed

### Step 6: Document Usage

Add agent documentation to project:

- When to use the agent
- What it does autonomously
- Expected results
- Limitations

## Best Practices

### Agent Design Principles

**1. Clear autonomy boundaries**

Define what agent decides independently:

```markdown
## Decision-Making

You autonomously decide:

- Which files to analyze (based on impact)
- Issue severity ratings
- Refactoring approach
- Priority of recommendations

You should ask user for:

- Architectural changes
- Breaking changes
- Deployment decisions
```

**2. Specific tool selection**

Only include tools agent actually uses:

```yaml
# Code reviewer needs Read and Grep
tools: [Read, Grep]

# Refactorer needs Read, Edit, Bash (for testing)
tools: [Read, Edit, Bash]

# Test generator needs Read, Write, Bash
tools: [Read, Write, Bash]
```

**3. Defined workflow**

Provide clear step-by-step process:

```markdown
## Workflow

1. **Discover**: Use Glob to find relevant files
2. **Analyze**: Read files and understand structure
3. **Identify**: Grep for patterns indicating issues
4. **Evaluate**: Assess severity and impact
5. **Recommend**: Generate specific fixes with examples
6. **Report**: Summarize findings with priorities
```

**4. Output structure**

Specify how agent presents results:

```markdown
## Output Format

### Summary

- Total issues: [count]
- Critical: [count]
- High: [count]

### Detailed Findings

**Issue**: [Name]
**Severity**: [Critical/High/Medium/Low]
**Location**: [File:line]
**Description**: [What's wrong]
**Recommendation**: [How to fix]
**Example**: [Code fix]
```

### Naming Conventions

**Good agent names:**

- `code-reviewer` - Clear, action-oriented
- `test-generator` - Describes what it creates
- `refactorer` - Simple, descriptive

**Poor agent names:**

- `cr` - Too abbreviated
- `agent1` - Not descriptive
- `helper` - Too vague

### Model Selection

**Use `sonnet` (default) for:**

- Most agents
- Balanced performance and quality
- General-purpose tasks

**Use `opus` for:**

- Complex reasoning required
- Critical analysis
- High-stakes decisions

**Use `haiku` for:**

- Simple, fast operations
- Cost-sensitive tasks
- Lightweight agents

### Color Coding

Use colors to visually distinguish agent types:

- **Blue** - Code analysis, review
- **Green** - Testing, quality assurance
- **Purple** - Refactoring, restructuring
- **Orange** - Documentation, explanation
- **Red** - Security, critical analysis
- **Yellow** - Performance, optimization

## Platform Limitations

### Claude Code Only

**Important:** Agents currently only work in **Claude Code**.

**Not supported:**

- ❌ Cursor - No agent support
- ❌ Gemini CLI - No agent support
- ❌ Antigravity - No agent support

**Implications:**

- Agents live in `.claude/agents/` (not `.agents/`)
- No synchronization to other platforms
- Team members must use Claude Code for agents

### Future Considerations

If other platforms add agent support:

- Consider moving to `.agents/agents/` for synchronization
- Update sync scripts to handle agents
- Document platform compatibility

## Examples

### Example 1: Code Reviewer Agent

**File:** `.claude/agents/code-reviewer.md`

````markdown
---
name: code-reviewer
description: Autonomous code review for quality, security, and best practices
tools: [Read, Grep, Bash]
model: sonnet
color: blue
---

# Code Review Agent

You are an autonomous agent specialized in comprehensive code review and quality analysis.

## Your Capabilities

- Analyze code structure and design patterns
- Identify code smells and anti-patterns
- Detect security vulnerabilities
- Assess test coverage
- Suggest refactoring opportunities
- Evaluate performance implications

## Your Workflow

1. **Understand context**: Read recently changed files to understand the scope
2. **Analyze structure**: Examine overall code organization and architecture
3. **Identify issues**: Use Grep to find patterns indicating problems:
   - Hard-coded values
   - Console.log statements
   - TODO/FIXME comments
   - Potential security issues
4. **Assess severity**: Categorize each issue (Critical/High/Medium/Low)
5. **Generate recommendations**: Provide specific, actionable fixes with code examples
6. **Run tests**: Execute test suite to verify current behavior
7. **Summarize**: Create prioritized report of findings

## Autonomous Decision-Making

You autonomously decide:

- Which files to analyze based on change impact and dependencies
- Severity ratings for identified issues
- Whether to suggest refactoring or accept current implementation
- Priority order of recommendations
- Scope of analysis (related files, dependencies, etc.)

## Guidelines

- Focus on actionable feedback with specific code examples
- Prioritize security and correctness over style
- Consider project context (existing patterns, team conventions)
- Provide reasoning for recommendations
- Be constructive and specific, not vague or critical

## Output Format

### Summary

- Files analyzed: [count]
- Total issues: [count]
- Critical: [count] | High: [count] | Medium: [count] | Low: [count]

### Critical Issues

[List critical issues first]

### Detailed Findings

**Issue**: [Short name]
**Severity**: [Critical/High/Medium/Low]
**File**: [filename:line]
**Description**: [What's the issue]
**Impact**: [Why it matters]
**Recommendation**: [How to fix]
**Example**:

```[language]
# Before
[current code]

# After
[improved code]
```
````

### Additional Observations

[Optional insights about code quality, patterns, etc.]

````

### Example 2: Test Generator Agent

**File:** `.claude/agents/test-generator.md`

```markdown
---
name: test-generator
description: Generate comprehensive test suites with coverage analysis
tools: [Read, Write, Grep, Bash]
model: sonnet
color: green
---

# Test Generation Agent

You are an autonomous agent specialized in generating comprehensive test suites.

## Your Capabilities

- Analyze code to determine test requirements
- Generate unit, integration, and edge-case tests
- Assess current test coverage
- Write tests following project conventions
- Execute tests to verify correctness

## Your Workflow

1. **Analyze code**: Read source files to understand functionality
2. **Identify test cases**: Determine:
   - Happy path scenarios
   - Edge cases
   - Error conditions
   - Integration points
3. **Check existing tests**: Grep for existing test files and patterns
4. **Generate tests**: Write comprehensive test suite
5. **Execute tests**: Run tests to verify they work
6. **Calculate coverage**: Assess test coverage percentage
7. **Report**: Summarize test generation and coverage

## Autonomous Decision-Making

You autonomously decide:
- Which test cases are most important
- Test structure and organization
- Mocking strategies for dependencies
- Test data generation
- Whether to write unit vs integration tests

## Guidelines

- Follow project's existing test patterns and conventions
- Use descriptive test names
- Test one thing per test case
- Include edge cases and error conditions
- Add comments explaining complex test setup

## Output Format

### Test Generation Summary
- Tests created: [count]
- Test cases covered: [count]
- Coverage estimate: [percentage]

### Generated Test Files
[List of created test files]

### Test Execution Results
[Pass/fail status from running tests]

### Coverage Gaps
[Areas still needing tests, if any]
````

## Validation

After creating an agent, validate its structure:

```bash
./.agents/skills/team-skill-creator/scripts/validate-agent.sh {agent-name}
```

**Checks performed:**

- ✅ File exists at `.claude/agents/{agent-name}.md`
- ✅ YAML frontmatter present
- ✅ Required fields: `name`, `description`
- ✅ Optional fields valid: `tools`, `model`, `color`

## Troubleshooting

### Agent Not Triggering

**Symptoms:** Agent doesn't activate when expected

**Solutions:**

- Verify file location: `.claude/agents/` (not `.agents/`)
- Check frontmatter has required fields: `name`, `description`
- Restart Claude Code
- Check agent description matches triggering context

### Agent Behavior Issues

**Symptoms:** Agent doesn't follow expected workflow

**Solutions:**

- Review system prompt clarity
- Add more specific decision-making guidelines
- Refine workflow steps
- Test with simpler tasks first

### Tool Errors

**Symptoms:** Agent fails when using tools

**Solutions:**

- Verify tools listed in frontmatter match tools used
- Check tool syntax in system prompt
- Ensure agent has necessary permissions
- Review error messages for specific issues

## Summary

Agents in `.agents/` system (Claude Code only):

**✅ Use agents for:**

- Multi-step autonomous workflows
- Complex decision-making tasks
- Deep codebase analysis
- Long-running operations

**❌ Don't use agents for:**

- Simple prompts (use commands)
- Bundled resources needed (use skills)
- Cross-platform compatibility (agents are Claude Code only)

**Creation steps:**

1. Define agent purpose and autonomy
2. Design system prompt with capabilities and workflow
3. Configure frontmatter (name, description, tools, model, color)
4. Create file in `.claude/agents/`
5. Test and iterate

**Platform:** Claude Code only (not synced to other platforms)

**Result:** Autonomous agent ready for complex, multi-step tasks!
