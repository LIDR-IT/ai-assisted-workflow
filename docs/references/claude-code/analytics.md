# Analytics in Claude Code

## Overview

Claude Code provides analytics dashboards to help organizations understand developer usage patterns, track contribution metrics, and measure how Claude Code impacts engineering velocity.

**Official Documentation:** [code.claude.com/docs/en/analytics](https://code.claude.com/docs/en/analytics)

**Key Benefit:** "View Claude Code usage metrics, track adoption, and measure engineering velocity in the analytics dashboard."

---

## Analytics Dashboards by Plan

| Plan                          | Dashboard URL                                                              | Includes                                                                              |
|:------------------------------|:---------------------------------------------------------------------------|:--------------------------------------------------------------------------------------|
| Claude for Teams / Enterprise | [claude.ai/analytics/claude-code](https://claude.ai/analytics/claude-code) | Usage metrics, contribution metrics with GitHub integration, leaderboard, data export |
| API (Claude Console)          | [platform.claude.com/claude-code](https://platform.claude.com/claude-code) | Usage metrics, spend tracking, team insights                                          |

---

## Teams and Enterprise Analytics

### Access Requirements

**URL:** [claude.ai/analytics/claude-code](https://claude.ai/analytics/claude-code)

**Permissions:** Admins and Owners can view dashboard

### Dashboard Includes

**Usage metrics:**
- Lines of code accepted
- Suggestion accept rate
- Daily active users and sessions

**Contribution metrics:**
- PRs and lines of code shipped with Claude Code assistance
- Requires GitHub integration

**Leaderboard:**
- Top contributors ranked by Claude Code usage

**Data export:**
- Download contribution data as CSV for custom reporting

---

## Enable Contribution Metrics

**Availability:** Public beta for Teams and Enterprise plans

**Coverage:** Users within your claude.ai organization only (excludes API and third-party integrations)

**Requirements:**
- Owner role to configure analytics settings
- GitHub admin to install GitHub app

### Setup Steps

**Step 1: Install GitHub App**

**Who:** GitHub admin

**Action:** Install Claude GitHub app at [github.com/apps/claude](https://github.com/apps/claude)

**Step 2: Enable Claude Code Analytics**

**Who:** Claude Owner

**Action:** Navigate to [claude.ai/admin-settings/claude-code](https://claude.ai/admin-settings/claude-code)

Enable "Claude Code analytics" feature

**Step 3: Enable GitHub Analytics**

**Action:** On same page, enable "GitHub analytics" toggle

**Step 4: Authenticate with GitHub**

**Action:**
- Complete GitHub authentication flow
- Select which GitHub organizations to include

### Data Availability

**Timing:**
- Data typically appears within 24 hours
- Daily updates thereafter

**Possible messages if no data:**
- **"GitHub app required"** - Install GitHub app to view contribution metrics
- **"Data processing in progress"** - Check back in few days, confirm GitHub app installed

**Support:**
- GitHub Cloud
- GitHub Enterprise Server

---

## Summary Metrics

**Note:** These metrics are deliberately **conservative** and represent an **underestimate** of actual impact. Only high-confidence Claude Code involvement is counted.

### Available Metrics

**PRs with CC**
- Total count of merged pull requests containing at least one Claude Code-written line

**Lines of code with CC**
- Total lines across all merged PRs written with Claude Code assistance
- Only "effective lines" counted: >3 characters after normalization
- Excludes empty lines, lines with only brackets or trivial punctuation

**PRs with Claude Code (%)**
- Percentage of all merged PRs containing Claude Code-assisted code

**Suggestion accept rate**
- Percentage of times users accept Claude Code's code editing suggestions
- Includes Edit, Write, NotebookEdit tool usage

**Lines of code accepted**
- Total lines written by Claude Code that users accepted in sessions
- Excludes rejected suggestions
- Does not track subsequent deletions

---

## Charts and Visualizations

### 1. Adoption Chart

**Shows:** Daily usage trends

**Metrics:**
- **users** - Daily active users
- **sessions** - Active Claude Code sessions per day

**Use:** Track overall adoption patterns

### 2. PRs per User

**Shows:** Individual developer activity over time

**Metrics:**
- **PRs per user** - Total merged PRs per day ÷ daily active users
- **users** - Daily active users

**Use:** Understand how individual productivity changes with Claude Code adoption

### 3. Pull Requests Breakdown

**Shows:** Daily breakdown of merged PRs

**Metrics:**
- **PRs with CC** - Pull requests containing Claude Code-assisted code
- **PRs without CC** - Pull requests without Claude Code-assisted code

**Toggle view:** Switch to **Lines of code** for same breakdown by lines instead of PR count

### 4. Leaderboard

**Shows:** Top 10 users ranked by contribution volume

**Toggle between:**
- **Pull requests** - PRs with CC vs All PRs per user
- **Lines of code** - Lines with CC vs All lines per user

**Export:** Click **Export all users** to download complete contribution data as CSV (includes all users, not just top 10)

---

## PR Attribution

When contribution metrics enabled, Claude Code analyzes merged PRs to determine which code was written with Claude Code assistance.

### Tagging Criteria

**Tagged as "with Claude Code" if:**
- PR contains at least one line written during Claude Code session
- Conservative matching: Only high-confidence involvement counted

### Attribution Process

**When PR merged:**

**1. Extract added lines** from PR diff

**2. Identify matching sessions**
- Sessions that edited matching files
- Within time window

**3. Match PR lines** against Claude Code output
- Multiple strategies used

**4. Calculate metrics**
- AI-assisted lines
- Total lines

**Line normalization before comparison:**
- Whitespace trimmed
- Multiple spaces collapsed
- Quotes standardized
- Text converted to lowercase

**GitHub labeling:** Merged PRs with Claude Code-assisted lines labeled as `claude-code-assisted`

### Time Window

**Sessions considered:** 21 days before to 2 days after PR merge date

### Excluded Files

**Automatically excluded (auto-generated):**

**Lock files:**
- package-lock.json
- yarn.lock
- Cargo.lock
- Similar

**Generated code:**
- Protobuf outputs
- Build artifacts
- Minified files

**Build directories:**
- dist/
- build/
- node_modules/
- target/

**Test fixtures:**
- Snapshots
- Cassettes
- Mock data

**Other exclusions:**
- Lines over 1,000 characters (likely minified/generated)

### Attribution Notes

**Keep in mind:**
- Code substantially rewritten by developers (>20% difference) NOT attributed to Claude Code
- Sessions outside 21-day window NOT considered
- Algorithm does NOT consider PR source or destination branch

---

## Get the Most from Analytics

### Monitor Adoption

**Track:** Adoption chart and user counts

**Identify:**
- Active users who can share best practices
- Overall adoption trends across organization
- Dips in usage indicating friction or issues

### Measure ROI

**Answer:** "Is this tool worth the investment?"

**Use contribution metrics to:**
- Track changes in PRs per user over time as adoption increases
- Compare PRs and lines shipped with vs without Claude Code
- Use alongside DORA metrics, sprint velocity, or engineering KPIs

**DORA metrics:** [dora.dev](https://dora.dev/)

### Identify Power Users

**Use leaderboard to find:**
- Team members with high Claude Code adoption
- People who can share prompting techniques and workflows
- Feedback providers on what's working
- Onboarding helpers for new users

### Access Data Programmatically

**Query via GitHub:**
- Search for PRs labeled with `claude-code-assisted`

---

## API Customer Analytics

### Access Requirements

**URL:** [platform.claude.com/claude-code](https://platform.claude.com/claude-code)

**Permissions:** UsageView permission required

**Roles with permission:**
- Developer
- Billing
- Admin
- Owner
- Primary Owner

**Note:** Contribution metrics with GitHub integration **not currently available** for API customers. Console dashboard shows usage and spend metrics only.

### Console Dashboard Metrics

**Lines of code accepted**
- Total lines written by Claude Code that users accepted
- Excludes rejected suggestions
- Does not track subsequent deletions

**Suggestion accept rate**
- Percentage of times users accept code editing tool usage
- Includes Edit, Write, NotebookEdit tools

**Activity chart**
- Daily active users
- Sessions

**Spend chart**
- Daily API costs in dollars
- User count

### Team Insights Table

**Shows per-user metrics:**

**Members**
- All users who authenticated to Claude Code
- API key users: Display by key identifier
- OAuth users: Display by email address

**Spend this month**
- Per-user total API costs for current month

**Lines this month**
- Per-user total accepted code lines for current month

**Note:** Spend figures are **estimates for analytics purposes**. For actual costs, refer to billing page.

---

## Privacy and Data Handling

### Data Coverage

**Teams/Enterprise analytics:**
- Only users within your claude.ai organization
- Excludes API usage
- Excludes third-party integrations

**API analytics:**
- All API-based usage
- Both API key and OAuth users

### Data Retention

**Check:** [Privacy Center](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data) for retention periods

### User Control

**Consumer users:** Change [privacy settings](https://claude.ai/settings/privacy) anytime

**Team/Enterprise:** Managed through admin settings

---

## Use Cases

### 1. Demonstrate ROI to Leadership

**Problem:** "Is Claude Code worth the investment?"

**Solution:**
- Show PRs per user trend over time
- Compare code shipped with vs without Claude Code
- Correlate with sprint velocity or DORA metrics
- Export data for executive presentations

### 2. Track Team Adoption

**Problem:** "How many developers are actually using Claude Code?"

**Solution:**
- Monitor daily active users
- Track session counts
- Identify adoption dips
- Find friction points

### 3. Identify Champions

**Problem:** "Who can help onboard new users?"

**Solution:**
- Check leaderboard for top users
- Find team members with high adoption
- Connect new users with power users
- Share best practices from champions

### 4. Measure Engineering Velocity

**Problem:** "Is Claude Code making us faster?"

**Solution:**
- Track PRs per user over time
- Compare lines of code shipped
- Monitor suggestion accept rate
- Correlate with sprint goals

### 5. Custom Reporting

**Problem:** "Need data in our existing dashboards"

**Solution:**
- Export CSV data
- Query GitHub for `claude-code-assisted` label
- Integrate with existing analytics stack
- Build custom visualizations

---

## Best Practices

### 1. Establish Baseline

✅ **DO:** Record metrics before rollout

- Capture PRs per user before Claude Code
- Track lines of code shipped historically
- Document current engineering velocity

❌ **DON'T:** Compare without baseline

### 2. Monitor Regularly

✅ **DO:** Review dashboard weekly

- Check adoption trends
- Monitor suggestion accept rate
- Identify usage dips
- Track power users

❌ **DON'T:** Only check quarterly

### 3. Share Insights

✅ **DO:** Communicate findings to team

- Share adoption milestones
- Highlight top contributors
- Present ROI data to leadership
- Celebrate wins

❌ **DON'T:** Keep data siloed

### 4. Act on Data

✅ **DO:** Use insights to improve

- Address adoption dips
- Connect new users with champions
- Share successful workflows
- Adjust rollout strategy

❌ **DON'T:** Just collect data

### 5. Combine with Other Metrics

✅ **DO:** Correlate with engineering KPIs

- DORA metrics (deployment frequency, lead time)
- Sprint velocity
- Code review time
- Bug fix rate

❌ **DON'T:** View in isolation

---

## Troubleshooting

### No Data Appearing (Teams/Enterprise)

**Possible causes:**

**1. GitHub app not installed**
- **Check:** Is GitHub app installed on your org?
- **Fix:** Install at [github.com/apps/claude](https://github.com/apps/claude)

**2. Analytics not enabled**
- **Check:** Is Claude Code analytics feature enabled?
- **Fix:** Go to [claude.ai/admin-settings/claude-code](https://claude.ai/admin-settings/claude-code)

**3. GitHub analytics not enabled**
- **Check:** Is GitHub analytics toggle on?
- **Fix:** Enable on admin settings page

**4. Data still processing**
- **Check:** Have you waited 24 hours?
- **Message:** "Data processing in progress"
- **Fix:** Wait a few days, verify GitHub app installed

### Low Suggestion Accept Rate

**Possible causes:**

**1. Users rejecting suggestions**
- **Check:** Are suggestions low quality?
- **Fix:** Train users on effective prompting

**2. Users not reviewing edits**
- **Check:** Are users accepting/rejecting edits?
- **Fix:** Educate on Edit tool workflow

**3. Complex changes**
- **Check:** Are tasks too large?
- **Fix:** Break down into smaller changes

### Export Not Working

**Possible causes:**

**1. No data available**
- **Check:** Is contribution metrics enabled?
- **Fix:** Enable GitHub integration

**2. Browser blocking download**
- **Check:** Are pop-ups blocked?
- **Fix:** Allow downloads from claude.ai

**3. Insufficient permissions**
- **Check:** Are you Admin or Owner?
- **Fix:** Request proper role

---

## Related Resources

### In This Repository

**Monitoring:**
- OpenTelemetry documentation (when available)

**Cost Management:**
- Cost optimization documentation (when available)

**Access Control:**
- IAM documentation (when available)

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/analytics](https://code.claude.com/docs/en/analytics)
- **Monitoring with OpenTelemetry:** [code.claude.com/docs/en/monitoring-usage](https://code.claude.com/docs/en/monitoring-usage)
- **Manage Costs:** [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs)
- **IAM:** [code.claude.com/docs/en/iam](https://code.claude.com/docs/en/iam)
- **DORA Metrics:** [dora.dev](https://dora.dev/)
- **Privacy Center:** [privacy.anthropic.com](https://privacy.anthropic.com/en/articles/10023548-how-long-do-you-store-my-data)
- **Privacy Settings:** [claude.ai/settings/privacy](https://claude.ai/settings/privacy)
- **GitHub App:** [github.com/apps/claude](https://github.com/apps/claude)

---

**Last Updated:** January 2026
**Category:** Analytics
**Status:** Official Claude Code Feature
**Availability:** Teams, Enterprise, API (Console)
