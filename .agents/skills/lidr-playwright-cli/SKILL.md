---
name: lidr-playwright-cli
id: playwright-cli
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: remediation-tier1"
status: active
phase: 0
owner_role: "QA"
automation: false
domain_agnostic: true
description: >
  Automate browser interactions for web testing, form filling, screenshots, and data extraction
  — via the `playwright-cli` binary OR the Playwright MCP (`mcp__playwright__*`).
  ALWAYS use when navigating websites, testing web applications, or extracting information from pages.
  Also serves as a RUNTIME/VISUAL REVIEW LAYER on top of BMad's static reviews (`bmad-code-review`):
  drives the browser to confirm changed UI renders, key flows work, and there are no console/a11y/visual regressions.
allowed-tools: Bash(playwright-cli:*), mcp__playwright__browser_navigate, mcp__playwright__browser_click, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_console_messages, mcp__playwright__browser_fill_form, mcp__playwright__browser_evaluate
---

# Browser Automation with playwright-cli

## As an extra review layer for BMad reviews

BMad's reviews (`bmad-code-review`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter`)
read code **statically** — they don't exercise the running UI. Use this skill as the **runtime/visual
review layer** that complements them:

1. Run it AFTER the static review (`bmad-code-review`) on any change that touches the UI.
2. Drive the browser — via the **Playwright MCP** (`mcp__playwright__browser_*`, the live-tool engine
   that `lidr-sdlc/spec-execution.md` Step N+3 already mandates for E2E) or the `playwright-cli`
   binary documented below — to validate:
   - changed pages render (no blank/error states),
   - key user flows complete end-to-end,
   - no new console errors / failed network requests,
   - basic accessibility (focus, labels, contrast) and no visual regressions.
3. Capture a snapshot/screenshot as the review artifact (e.g. `docs/projects/{client}/reviews/runtime-review-*.md`).

Wired into the gate model as **optional G4 evidence** (`_shared/lidr/gate-evidence.yaml` → G4):
a "runtime/visual review passed" check before the Dev→QA handoff.

## When to Use

### Essential Use Cases

- **Web Application Testing**: Automated testing of user interfaces, forms, and workflows
- **Data Extraction**: Scraping information from web pages that require user interaction
- **Screenshot Capture**: Taking screenshots for documentation, bug reports, or visual regression testing
- **Form Automation**: Filling out repetitive forms for testing or data entry
- **Multi-Step User Flows**: Testing complex user journeys across multiple pages
- **Cross-Browser Validation**: Verifying functionality across different browser environments

### Recommended Scenarios

- **Pre-deployment Testing**: Validating web applications before releases
- **Regression Testing**: Ensuring new changes don't break existing functionality
- **Load Testing Setup**: Creating test scenarios for performance testing
- **Documentation Generation**: Capturing screenshots and flows for user guides
- **Compliance Verification**: Testing accessibility and regulatory compliance requirements

### Triggering Phrases

- "Test the web application"
- "Take a screenshot of"
- "Fill out this form"
- "Navigate to this page"
- "Click on this element"
- "Extract data from"
- "Automate browser interaction"
- "Test user flow"
- "Verify page functionality"

### When NOT to Use

- **Simple HTTP Requests**: Use curl or HTTP clients for API testing
- **Static Content Analysis**: Use web scrapers for non-interactive content
- **Mobile App Testing**: Use mobile testing frameworks instead
- **Performance Testing**: Use specialized load testing tools for performance metrics

## Structured Workflow

### Phase 1: Setup and Navigation (2-5 minutes)

1. **Initialize Browser Session**
   - Open new browser instance
   - Set viewport size if needed
   - Configure any required browser settings

2. **Navigate to Target**
   - Go to target URL
   - Wait for page load completion
   - Take initial snapshot for element reference

### Phase 2: Interaction Execution (5-30 minutes)

3. **Element Identification**
   - Use snapshot to identify element references
   - Plan interaction sequence
   - Verify elements are present and interactable

4. **Execute Interactions**
   - Perform clicks, form fills, navigation
   - Handle dynamic content and wait conditions
   - Capture intermediate states as needed

### Phase 3: Verification and Cleanup (2-10 minutes)

5. **Results Validation**
   - Verify expected outcomes
   - Capture screenshots or extract data
   - Document any issues or unexpected behavior

6. **Session Cleanup**
   - Save any required outputs
   - Close browser session
   - Clean up temporary files

## Quick start

```bash
# open new browser
playwright-cli open
# navigate to a page
playwright-cli goto https://playwright.dev
# interact with the page using refs from the snapshot
playwright-cli click e15
playwright-cli type "page.click"
playwright-cli press Enter
# take a screenshot (rarely used, as snapshot is more common)
playwright-cli screenshot
# close the browser
playwright-cli close
```

## Commands

### Core

```bash
playwright-cli open
# open and navigate right away
playwright-cli open https://example.com/
playwright-cli goto https://playwright.dev
playwright-cli type "search query"
playwright-cli click e3
playwright-cli dblclick e7
playwright-cli fill e5 "user@example.com"
playwright-cli drag e2 e8
playwright-cli hover e4
playwright-cli select e9 "option-value"
playwright-cli upload ./document.pdf
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli snapshot
playwright-cli snapshot --filename=after-click.yaml
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5
playwright-cli dialog-accept
playwright-cli dialog-accept "confirmation text"
playwright-cli dialog-dismiss
playwright-cli resize 1920 1080
playwright-cli close
```

### Navigation

```bash
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
```

### Keyboard

```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
```

### Mouse

```bash
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mousedown right
playwright-cli mouseup
playwright-cli mouseup right
playwright-cli mousewheel 0 100
```

### Save as

```bash
playwright-cli screenshot
playwright-cli screenshot e5
playwright-cli screenshot --filename=page.png
playwright-cli pdf --filename=page.pdf
```

### Tabs

```bash
playwright-cli tab-list
playwright-cli tab-new
playwright-cli tab-new https://example.com/page
playwright-cli tab-close
playwright-cli tab-close 2
playwright-cli tab-select 0
```

### Storage

```bash
playwright-cli state-save
playwright-cli state-save auth.json
playwright-cli state-load auth.json

# Cookies
playwright-cli cookie-list
playwright-cli cookie-list --domain=example.com
playwright-cli cookie-get session_id
playwright-cli cookie-set session_id abc123
playwright-cli cookie-set session_id abc123 --domain=example.com --httpOnly --secure
playwright-cli cookie-delete session_id
playwright-cli cookie-clear

# LocalStorage
playwright-cli localstorage-list
playwright-cli localstorage-get theme
playwright-cli localstorage-set theme dark
playwright-cli localstorage-delete theme
playwright-cli localstorage-clear

# SessionStorage
playwright-cli sessionstorage-list
playwright-cli sessionstorage-get step
playwright-cli sessionstorage-set step 3
playwright-cli sessionstorage-delete step
playwright-cli sessionstorage-clear
```

### Network

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli unroute
```

### DevTools

```bash
playwright-cli console
playwright-cli console warning
playwright-cli network
playwright-cli run-code "async page => await page.context().grantPermissions(['geolocation'])"
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start
playwright-cli video-stop video.webm
```

## Open parameters

```bash
# Use specific browser when creating session
playwright-cli open --browser=chrome
playwright-cli open --browser=firefox
playwright-cli open --browser=webkit
playwright-cli open --browser=msedge
# Connect to browser via extension
playwright-cli open --extension

# Use persistent profile (by default profile is in-memory)
playwright-cli open --persistent
# Use persistent profile with custom directory
playwright-cli open --profile=/path/to/profile

# Start with config file
playwright-cli open --config=my-config.json

# Close the browser
playwright-cli close
# Delete user data for the default session
playwright-cli delete-data
```

## Snapshots

After each command, playwright-cli provides a snapshot of the current browser state.

```bash
> playwright-cli goto https://example.com
### Page
- Page URL: https://example.com/
- Page Title: Example Domain
### Snapshot
[Snapshot](.playwright-cli/page-2026-02-14T19-22-42-679Z.yml)
```

You can also take a snapshot on demand using `playwright-cli snapshot` command.

If `--filename` is not provided, a new snapshot file is created with a timestamp. Default to automatic file naming, use `--filename=` when artifact is a part of the workflow result.

## Browser Sessions

```bash
# create new browser session named "mysession" with persistent profile
playwright-cli -s=mysession open example.com --persistent
# same with manually specified profile directory (use when requested explicitly)
playwright-cli -s=mysession open example.com --profile=/path/to/profile
playwright-cli -s=mysession click e6
playwright-cli -s=mysession close  # stop a named browser
playwright-cli -s=mysession delete-data  # delete user data for persistent session

playwright-cli list
# Close all browsers
playwright-cli close-all
# Forcefully kill all browser processes
playwright-cli kill-all
```

## Local installation

In some cases user might want to install playwright-cli locally. If running globally available `playwright-cli` binary fails, use `npx playwright-cli` to run the commands. For example:

```bash
npx playwright-cli open https://example.com
npx playwright-cli click e1
```

## Example: Form submission

```bash
playwright-cli open https://example.com/form
playwright-cli snapshot

playwright-cli fill e1 "user@example.com"
playwright-cli fill e2 "password123"
playwright-cli click e3
playwright-cli snapshot
playwright-cli close
```

## Example: Multi-tab workflow

```bash
playwright-cli open https://example.com
playwright-cli tab-new https://example.com/other
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli snapshot
playwright-cli close
```

## Example: Debugging with DevTools

```bash
playwright-cli open https://example.com
playwright-cli click e4
playwright-cli fill e7 "test"
playwright-cli console
playwright-cli network
playwright-cli close
```

```bash
playwright-cli open https://example.com
playwright-cli tracing-start
playwright-cli click e4
playwright-cli fill e7 "test"
playwright-cli tracing-stop
playwright-cli close
```

## Specific tasks

- **Request mocking** [references/request-mocking.md](references/request-mocking.md)
- **Running Playwright code** [references/running-code.md](references/running-code.md)
- **Browser session management** [references/session-management.md](references/session-management.md)
- **Storage state (cookies, localStorage)** [references/storage-state.md](references/storage-state.md)
- **Test generation** [references/test-generation.md](references/test-generation.md)
- **Tracing** [references/tracing.md](references/tracing.md)
- **Video recording** [references/video-recording.md](references/video-recording.md)

## Key Rules

### Browser Session Management

- **Always close browser sessions**: Use `playwright-cli close` when finished to prevent resource leaks
- **One task per session**: Open new browser sessions for unrelated tasks to avoid state contamination
- **Persistent profiles**: Use `--persistent` flag when you need to maintain login state across commands
- **Session isolation**: Each browser session is independent - cookies, storage, and state don't carry over

### Element Interaction Best Practices

- **Always take snapshots**: Use `playwright-cli snapshot` to get current element references before interactions
- **Use element references**: Prefer element IDs (e.g., `e15`) from snapshots over hardcoded selectors
- **Wait for page readiness**: Allow pages to fully load before attempting interactions
- **Handle dynamic content**: Be aware that element references can change after page updates or navigation

### Debugging and Troubleshooting

- **Save screenshots**: Use `playwright-cli screenshot --filename=debug.png` to capture visual state for debugging
- **Check console output**: Use `playwright-cli console` to see browser console messages and errors
- **Network monitoring**: Use `playwright-cli network` to debug failed requests or slow loading
- **Progressive testing**: Test interactions step-by-step rather than complex multi-step sequences

### Data and Security Considerations

- **No sensitive data in commands**: Never include passwords, API keys, or personal data in command line arguments
- **Use state management**: Save login sessions with `playwright-cli state-save auth.json` for reuse
- **Clean up test data**: Remove test cookies and storage data when testing is complete
- **Respect rate limits**: Don't overwhelm target sites with rapid automated requests

### Performance and Efficiency

- **Optimize viewport**: Set appropriate browser size with `playwright-cli resize` for consistent testing
- **Mock external requests**: Use `playwright-cli route` to mock slow or unreliable external API calls
- **Minimize network traffic**: Route and block unnecessary resources (images, analytics) during testing
- **Use headless mode**: Default headless mode is faster for automated testing scenarios

### Error Handling and Recovery

- **Expect dialog interactions**: Be prepared to handle alerts and confirmations with `dialog-accept`/`dialog-dismiss`
- **Handle timeouts gracefully**: Set appropriate timeouts for slow-loading pages or resources
- **Verify element existence**: Check snapshots to ensure elements exist before attempting interactions
- **Plan for failures**: Have cleanup procedures for partial test executions

### Integration with Testing Workflows

- **Document test procedures**: Save snapshots and screenshots with descriptive filenames for test documentation
- **Integrate with CI/CD**: Use exit codes and output files for automated test result validation
- **Version control**: Include saved states and test artifacts in version control for reproducible testing
- **Cross-browser compatibility**: Test critical flows across different browsers using `--browser` flag

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Browser automation compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
