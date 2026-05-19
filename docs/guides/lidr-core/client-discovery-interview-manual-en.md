---
id: client-discovery-interview-manual-en
version: "3.2.0"
last_updated: "2026-04-29"
updated_by: "AI: Translation from Spanish v3.2.0"
status: active
type: guide
review_cycle: 90
next_review: "2026-07-28"
owner_role: "PME"
---

# Interview Manual: SDLC Client Discovery

> **Objective**: Assess SDLC process maturity, methodologies, tools, team communication and AI adoption in the client organization, and guide towards the selection of **one specific pilot project** to implement LIDR.
>
> **Scope**: We evaluate **how they work** (processes, tools, communication, AI in SDLC), NOT their product, business model or end users. Business context is collected only to calibrate size, regulations and complexity.
>
> **Key principle**: The company may have 20 projects and 15 teams. We need the complete picture, but **land on ONE project** with ONE team for the pilot.

---

## 📋 Methodological Framework and Preparation

### Frameworks Guiding This Interview

- **SPIN Selling** (Rackham) — Progression: Situation → Problem → **Implication** → **Need-Payoff**. Questions marked with [I] and [NP] are those that build urgency and make the client articulate the solution's value.
- **Gap Analysis** (McKinsey) — Current State → Desired State → Gap. Each section includes "where do you want to be?" questions in addition to "where are you?"
- **DORA + CMMI** — Quantitative metrics (DORA 4 key metrics) + maturity levels by process (1-5). Section 3 includes a scoring table by SDLC phase.
- **IMPACT** (Land-and-Expand) — Weighted criteria for pilot selection in section 8.
- **Funnel Technique** — Each section starts with open questions (Level 1) and narrows to specific ones (Level 3-4). Never start interrogating.

### Recommended Interview Sequence

> If multiple sessions, **never mix hierarchical levels** in the same session.

| Order | Who                            | Why                                                            |
| ----- | ------------------------------ | -------------------------------------------------------------- |
| 1st   | Internal Champion/Coach        | Political context, history, what they tried before             |
| 2nd   | Practitioners (devs, QA, ops)  | Ground truth — real workflows, not documented ones             |
| 3rd   | Middle management (TL, EM, PM) | Process vision, metrics, trade-offs                            |
| 4th   | Senior leadership (CTO, VP)    | Strategic vision — already armed with ground truth to validate |

### Pre-Interview Checklist

- [ ] **Research company**: Website, LinkedIn, sector, size, main products
- [ ] **Map portfolio**: How many products/projects? How many teams?
- [ ] **Research AI adoption**: Do they mention AI on web/blog/job postings?
- [ ] **Prepare hypotheses**: Based on research, what are the 3 most likely pain points?
- [ ] **Identify Buying Roles** (Miller Heiman): Economic Buyer (approves budget) / User Buyer (will use solution) / Technical Buyer (can veto) / Coach (internal ally)
- [ ] **Set up recording**: Get consent for transcription
- [ ] **Define duration and participants**: One session or two? What interview sequence?

### Required Documents

- [ ] This interview script
- [ ] Notes template (post-interview section)
- [ ] AI by SDLC phase table (section 2C) and pilot metrics table (section 8C)

---

## 🎯 Interview Structure (95-175 min) — Optimized

### Recommended Times by Section

| Section                                           | Startup (<50p) | Scale-up (50-200p) | Enterprise (>200p) |
| ------------------------------------------------- | -------------- | ------------------ | ------------------ |
| **1. Organizational Context (portfolio + teams)** | 10 min         | 15 min             | 20 min             |
| **2. AI Maturity & Strategy** ⭐                  | 20 min         | 25 min             | 30 min             |
| **3. SDLC Assessment (processes by phase)** ⭐    | 30 min         | 40 min             | 50 min             |
| **4. Pains → Desired State → Gaps (SPIN)**        | 15 min         | 20 min             | 25 min             |
| **5. Tools & Integrations**                       | 10 min         | 10 min             | 15 min             |
| **6. Stakeholders + Change Readiness**            | 5 min          | 10 min             | 10 min             |
| **7. Pilot Project Selection** ⭐                 | 10 min         | 15 min             | 20 min             |
| **8. Closing & Proposal**                         | 5 min          | 5 min              | 5 min              |
| **Total estimated**                               | ~95 min        | ~140 min           | ~175 min           |

### ⏰ **Timing Alerts & Checkpoints**

- **CHECKPOINT 30min**: Portfolio mapped + AI maturity baseline identified?
- **CHECKPOINT 60min**: Top 3 SDLC pain points identified + implications quantified?
- **CHECKPOINT 90min**: Pilot selected + team identified + baseline metrics defined?
- **🚨 ESCAPE HATCH**: If at 60min there's no clear pain → explore timing/readiness

> **Strategy by available duration:**
>
> - **Single 90 min session**: Sections 1, 2, 4, 7 — overview, AI, pains, and land on pilot. Schedule technical follow-up.
> - **Single 120 min session**: Sections 1-4, 7, 8 — sufficient for proposal with pilot.
> - **Two sessions**: S1 (90 min) = Sections 1-4. S2 (60 min) = Sections 5-8. Ideal for enterprise.
> - **Complete 3h session**: Full script.

---

## 1️⃣ Organizational Context (15-25 min)

### Objectives of This Section

- Calibrate: sector, regulations, size, complexity — only to contextualize SDLC
- Map project portfolio and team structure
- Understand motivation and urgency for improvement

### Calibration Questions

#### **A. Sector and Regulations** (context for SDLC only)

- **Could you briefly tell me what the company does and what sector you operate in?**
  - _Follow-up_: Are there regulations that impose mandatory processes? (GDPR, HIPAA, PCI-DSS, SOX)
  - _Dig deeper_: Compliance or certifications that affect how you develop? (audits, sign-offs, data residency)

#### **B. Scale, Structure and Project Portfolio**

> **Note for interviewer**: This subsection is critical. We need to map the complete project and team landscape BEFORE going deeper. Many subsequent questions will change depending on whether we're talking about a company with 1 product or 15.

- **How many people currently work at the company?**
  - _Follow-up_: How many are in development/product/technology?
  - _Follow-up_: How is the tech team organized? (by product, by function, squads, tribes, etc.)

- **How many digital products/services do you develop internally?**
  - _Follow-up_: Could you list them briefly? Which are the main ones?
  - _Dig deeper_: Are they independent products or are there dependencies between them? (monorepo, shared libs, internal APIs)
  - _Dig deeper_: How critical are they to the business? (revenue impact by product)

- **How many development teams do you have and how are they distributed?**
  - _Follow-up_: Dedicated teams per product or shared resources?
  - _Follow-up_: How many people per team typically?
  - _Dig deeper_: Are there platform, infrastructure or shared services teams?
  - _Dig deeper_: Are teams autonomous or do they depend heavily on each other?

- **Are SDLC processes uniform across all teams/projects or does each one work differently?**
  - _Follow-up_: Is there a "model team" that works better than others? Why?
  - _Follow-up_: Is there any project you would consider your biggest headache? Why?
  - _Dig deeper_: Are tools the same for everyone or does each team choose their own?

#### **C. Motivation and Improvement Objectives**

- **What motivated you to seek to improve your development processes?**
  - _Follow-up_: Was there any specific incident, audit or problem that triggered it?
  - _Dig deeper_: Is there external pressure? (compliance, investors, accelerated growth, talent loss)

- **Do you expect to scale the team or projects in the next 12-18 months?**
  - _Follow-up_: How much? New products, teams, geographical expansion?
  - _Dig deeper_: Which processes do you think won't handle that growth?

### 🚨 **RED FLAGS (stop or rethink approach)**

- **"Everything works perfectly"** → No pain, no urgency
- **"We don't have budget"** → No real Economic Buyer
- **"Each team is very different"** → Resistance to standardization
- **"We tried this before"** → High skepticism, need more evidence

### ✅ **GREEN SIGNALS (accelerate)**

- **Recent incident** that triggered the search → Real urgency
- **Growth pressure** → Clear timeline to improve
- **Identifiable champion** → Someone pushing internally
- **Budget allocated** → Not exploration, there's commitment

---

## 2️⃣ AI Maturity & Strategy (20-30 min)

### Objectives of This Section

- Map tools, users and SDLC phases where they use AI
- Assess governance, results, and data/analytics maturity as prerequisite
- Discover high-impact opportunities for AI-powered workflows

> **DISCOVERY CORE**: LIDR is AI-powered — this section is the backbone of the proposal.

### AI Questions

#### **A. Data and Analytics Maturity (AI prerequisite)**

> **Forrester**: many companies try to jump to AI without mastering BI. Assess this foundation first.

**How data-driven are your decisions today?** `[S]`

- _Follow-up_: Do you have business dashboards? Self-service BI? Who uses them?
- _Follow-up_: Is data centralized or in silos by team/product?
- _Dig deeper_: Do you trust the quality of your data? Do you have formal data governance?

#### **B. Current Adoption and Results**

**What AI tools are you using today?** `[S]`

- _Follow-up_: Code assistants? (Copilot, Cursor, Codeium, Windsurf, Tabnine)
- _Follow-up_: General LLMs? (ChatGPT, Claude, Gemini) — for what tasks?
- _Follow-up_: Specialized or embedded AI? (testing AI, doc gen, Notion AI, Linear AI, etc.)

**Who is using AI, how, and what results do they see?** `[S→P]`

- _Go through by role_: Developers · QA · PM · UX · DevOps · Management
- _Follow-up_: Corporate licenses or individual informal use? What % actively uses AI?
- _Follow-up_: Do they perceive improvement in speed/quality? Concrete metrics or perception?
- **[I]** _Implication_: What happens with teams that DON'T use AI? Are they falling behind in productivity?
- _Dig deeper_: Who are the champions? Who are the skeptics?

#### **C. AI Governance and Security**

**Do you have policies on AI use in development?** `[S→P]`

- _Follow-up_: Guidelines on what code/data can be passed to an LLM? IP/compliance restrictions?
- _Follow-up_: How do you validate AI output? Specific code review or blind trust?
- **[I]** _Implication_: What risk do you run if a dev passes proprietary code to a public LLM without realizing?
- _Dig deeper_: Main concerns? (security, dependency, skill loss, resistance)

#### **D. AI by SDLC Phase — Opportunity Mapping**

**For each phase, ask: "Do you use AI here? How? Would you like to?"**

| SDLC Phase                 | Uses AI? | Tool | Interest |
| -------------------------- | -------- | ---- | -------- |
| Ideation and brainstorming |          |      |          |
| Requirements / PRD         |          |      |          |
| UX/UI Design               |          |      |          |
| Architecture               |          |      |          |
| Code generation            |          |      |          |
| Code review                |          |      |          |
| Testing                    |          |      |          |
| Documentation              |          |      |          |
| CI/CD and DevOps           |          |      |          |
| Monitoring                 |          |      |          |
| Onboarding                 |          |      |          |

#### **E. Vision, Barriers and Expected Value**

**If you could have a perfect "copilot" for your SDLC, what would it do? What task would you never delegate to AI?** `[NP]`

- _Follow-up_: Do you expect pure automation, human assistance, or drafts for review?
- _Follow-up_: Priority: speed, quality, consistency, or cost reduction?
- **[NP]** _Need-Payoff_: If you could implement AI in the 2-3 most painful phases, what impact would it have on the business? In hours? In quality? In time-to-market?
- _Follow-up_: Do you have allocated or planned budget for AI tools?
- _Dig deeper_: What barriers do you see? (technical, cultural, organizational) What would you need to convince skeptics?

### 🚨 **AI RED FLAGS**

- **"AI is a fad"** → Lack of strategic vision
- **"Prohibited for security"** → Hard organizational blockers
- **"Only some devs use Copilot"** → Very limited adoption
- **"We don't see concrete results"** → Lack of measurement/ROI

### ✅ **AI GREEN SIGNALS**

- **Active champions** → Organic adoption + visible results
- **Corporate licenses** → Organizational commitment
- **Governance defined** → Mature approach
- **Metrics tracking** → Data-driven on AI impact

---

## 3️⃣ Current SDLC Process Assessment (25-45 min)

### Objectives of This Section

- Map current state of each SDLC phase and assign maturity level (1-5)
- Identify what works vs what's broken — real workflows, not documented ones

> **Maturity Scale (CMMI/Gartner)** — For each phase, mentally assign a level:
>
> 1. **Ad Hoc** — no process, everyone does their own thing
> 2. **Managed** — process exists at project level, but varies between teams
> 3. **Defined** — standardized at organizational level, documented
> 4. **Measured** — process measured with metrics, data-driven decisions
> 5. **Optimizing** — continuous improvement based on data, constant innovation

| SDLC Phase                 | Level (1-5) | Notes |
| -------------------------- | ----------- | ----- |
| Origination & Discovery    |             |       |
| Specification & Planning   |             |       |
| Development & Code Quality |             |       |
| QA & Testing               |             |       |
| Security & Deploy          |             |       |
| Monitoring & Ops           |             |       |

### Technical Context Affecting SDLC

> Only what's necessary to understand what conditions their processes — we're not evaluating their product.

**What technical factors condition how you work?**

- _Follow-up_: Regulations that impose mandatory processes? (compliance gates, audits, sign-offs)
- _Follow-up_: Scale affecting deployment? (concurrent users, critical latency, multi-region)
- _Dig deeper_: Have you had production incidents that changed how you work?

---

### LIDR SDLC Assessment Framework

#### **Phase 0-1: Origination, Discovery & UX**

**How do you decide what to develop?**

- _Follow-up_: Do you have a formal prioritization process? Who makes the decisions?
- _Dig deeper_: Do you document business cases or is it more informal?

**How do you capture and document requirements?**

- _Follow-up_: Do you do PRDs? Is there separation between functional and technical requirements?
- _Dig deeper_: How detailed are they before you start developing?

**Do you have a UX/UI design process? How is the design→development handoff?**

- _Follow-up_: Dedicated designers or devs do design? Figma, design system?
- _Dig deeper_: Is fidelity lost in handoff? Do you do user research or feedback loops?

#### **Phase 2-3: Specification & Planning**

**How do you transform a business idea into technical specifications?**

- _Follow-up_: Who participates in that transformation?
- _Follow-up_: Are there cross-reviews between product and technology?
- _Dig deeper_: Are you comfortable with the level of detail before implementing?

**How do you plan sprints/iterations?**

- _Follow-up_: Scrum, Kanban, hybrid? Iteration duration?
- _Follow-up_: How do you estimate? (story points, T-shirt, planning poker) Do you measure velocity?
- _Dig deeper_: How predictable is your delivery? Estimates vs reality?

**Do you have Definition of Done/Ready? Do you do retrospectives?**

- _Follow-up_: What does your DoD include? Is it respected or aspirational?
- _Follow-up_: Retros how often? Are action items implemented?
- _Dig deeper_: How much do you dedicate to tech debt vs new features?

**How do you handle dependencies between teams?**

- _Follow-up_: Formal coordination (Scrum of Scrums, PI Planning)?
- _Dig deeper_: Frequency of blocks due to dependencies?

#### **Phase 4-5: Development & Code Quality**

**How do you organize development work?**

- _Follow-up_: Do you use branches? What git strategy?
- _Follow-up_: Is code review mandatory?
- _Dig deeper_: How consistent are code standards?

**How do you handle code quality during development?**

- _Follow-up_: Do you have linting, automatic formatters?
- _Follow-up_: Do you use static analysis tools (SonarQube, etc.)?
- _Dig deeper_: What happens when it finds issues? Is it blocked or ignored?

#### **Phase 6: QA & Testing**

**How do you test what you develop?**

- _Follow-up_: Dedicated QA or devs do testing? Balance manual vs automated?
- _Follow-up_: What types of tests? (unit, integration, E2E, perf, security) Coverage target?
- _Dig deeper_: How confident do you feel deploying to production?

**What is your validation process before release?**

- _Follow-up_: Formal sign-offs? Production-like environments? (dev, staging, pre-prod)
- _Dig deeper_: How often do you find bugs in production? Feature flags? Quick rollback?

**How do you prioritize bugs and manage test data?**

- _Follow-up_: SLAs by severity? Who writes acceptance criteria?
- _Follow-up_: Synthetic data, anonymized snapshots? Are they a bottleneck?

#### **Phase 7-8: Security & Deploy**

**How do you handle security in development?**

- _Follow-up_: Are there regular security reviews?
- _Follow-up_: Do you use security scanning tools?
- _Dig deeper_: Who is responsible for security? Is there a CISO?

**How do you deploy to production?**

- _Follow-up_: Is it automatic, manual, or hybrid?
- _Follow-up_: How frequent are deploys?
- _Dig deeper_: What happens when something goes wrong in production?

---

## 4️⃣ Pains, Desired State and Gaps (20-30 min)

### Objectives of This Section

- Discover frustrations (Problem), explore consequences (Implication), and have client articulate value of resolving them (Need-Payoff)
- Map: **where they are → where they want to be → what gap exists** (McKinsey Gap Analysis)
- Cover the 3 MECE axes: **People/Culture**, **Process**, **Technology**

### Questions: Problems → Implications → Desired State

#### **A. People & Culture** `[P→I]`

**How aligned do product and development feel?**

- _Dig deeper_: Where do most misunderstandings occur? Is there "telephone game"?
- _Example_: "Tell me about the last time you had to redo something because the requirement wasn't clear"
- **[I]** _Implication_: How many hours/sprint are lost in re-work due to misunderstandings? What impact does it have on team morale?

**How do teams feel about their way of working?**

- _Follow-up_: Is there pressure for unrealistic deadlines? Can they pushback?
- _Follow-up_: Do they feel ownership of the product or just "fulfill tickets"?
- _Dig deeper_: Is there burnout? High turnover? Is onboarding new devs painful?

#### **B. Process & Governance** `[P→I]`

**How consistent are you between different projects or teams?**

- _Follow-up_: Can a new dev move between projects easily? Is there "tribalism"?
- **[I]** _Implication_: Has lack of standardization cost you concrete time? How much?

**Which processes feel most chaotic or unpredictable?**

- _Dig deeper_: Where do you lose most time in re-work? What would you like to automate?
- _Example_: "If you could eliminate one daily frustration, what would it be?"

#### **C. Technology & Scalability** `[P→I]`

**What worked when you were smaller but no longer scales?**

- _Follow-up_: Informal processes that need structure? Insufficient tools?
- **[I]** _Implication_: Are you going slower as you grow? How much slower vs 1 year ago?

**What worries you most about future growth?**

- _Follow-up_: Onboarding, quality with speed, compliance?

#### **D. Desired State and Need-Payoff** `[NP]`

> **Transition**: "We've talked about challenges. Now I want to understand where you want to go."

**What does "excellent" look like for your engineering team in 12-18 months?**

- _Follow-up_: What would change if you could solve the 3 problems you mentioned?
- **[NP]** _Need-Payoff_: What impact would it have on the business? (more releases, fewer bugs, more revenue, less churn)
- **[NP]** _Need-Payoff_: What value do you put on that? (hours saved, incidents avoided, time-to-market)

**What have you tried before to improve? What worked and what didn't?**

- _Dig deeper_: Why did previous attempts fail? (this reveals real constraints)

---

## 5️⃣ Tools & Integrations (10-15 min) — Streamlined

### Objectives of This Section

- Map core tools affecting SDLC workflow
- Assess readiness for new tool adoption
- Identify integration gaps that slow down work

### Tool Questions (workflow impact only)

#### **A. Current Ecosystem**

**What main tools do you use day-to-day to work?**

- _Core tools_: Project mgmt, Communication, Code/Git, CI/CD, Docs
- _Follow-up_: Are they integrated or silos? SSO? Does data flow between them?
- _Dig deeper_: Are there tools you love vs tolerate? Why?

**How easy is it to onboard someone new to your tools?**

- _Follow-up_: How many different logins? Automatic or manual setup?
- _Dig deeper_: Are there tools that are "bottlenecks" for new people?

#### **B. Change & Adoption Readiness**

**What's the process for testing/adopting new tools?**

- _Follow-up_: IT/Security approval? POC process? Budget approval?
- _Follow-up_: Recent example of successful vs failed new tool?
- _Dig deeper_: What do you need to convince the team to change a tool?

**Is there any tool you need to change but can't?**

- _Follow-up_: Why can't you? (contractual, technical, resistance)
- _Dig deeper_: What tool would solve your biggest gap today?

### 🚨 **Tool RED FLAGS**

- **"We can't install anything"** → Hard organizational constraints
- **"Each team uses their own"** → Severe lack of standardization
- **"Devs hate our tools"** → High internal resistance

### ✅ **Tool GREEN SIGNALS**

- **Defined POC process** → Mature change management
- **Integration-friendly** → APIs, webhooks, SSO available
- **Recent successful adoptions** → Culture openness

---

## 6️⃣ Stakeholders, Documentation and Change Management (10-20 min)

### Role Mapping — Technical + Buying Influences (Miller Heiman)

#### **Roles Present in Interview**

- [ ] **CTO/VP Eng** · [ ] **Product Owner/PM** · [ ] **Eng Manager/TL** · [ ] **QA Lead** · [ ] **DevOps/SRE** · [ ] **CISO/Security**

#### **Buying Influences (complete during/after interview)**

| Role                                                 | Person | Position (for/neutral/resistant) |
| ---------------------------------------------------- | ------ | -------------------------------- |
| **Economic Buyer** (approves budget)                 |        |                                  |
| **User Buyer** (will use solution daily)             |        |                                  |
| **Technical Buyer** (can veto on technical criteria) |        |                                  |
| **Coach** (internal ally who guides us)              |        |                                  |

#### **A. Role and Decision Validation**

**Who makes important technical decisions? Who defines what gets built and when?**

- _Follow-up_: How do you prioritize bugs vs features vs infrastructure? Is there business vs tech debt conflict?
- _Dig deeper_: Who approves investments in new tools/processes? What evidence do they need?

#### **B. Documentation and Knowledge**

**Where does technical documentation live? Is it up to date? Easy to find?**

- _Follow-up_: Confluence, Notion, Wiki, READMEs? API docs (OpenAPI, Postman)?
- _Follow-up_: Automated or manual changelogs/release notes?
- _Dig deeper_: How long does it take a new dev to be productive? Are there onboarding guides?

#### **C. Change Management and Culture**

**How have you historically responded to process changes?**

- _Follow-up_: Was the last big change successful? Are there internal champions?
- _Follow-up_: Do you do postmortems? Are improvements implemented? Hackathons or innovation days?
- _Dig deeper_: Where do you expect most resistance to change? Top-down or bottom-up culture?

---

## 7️⃣ Pilot Project Selection (15-20 min)

### Objectives of This Section

- Guide client to choose ONE concrete project to implement LIDR
- Define the team that will participate in the pilot
- Establish baseline metrics (before) to demonstrate value (after)
- Align expectations on pilot scope and timeline

> **Note for interviewer**: This is the "landing" section. All previous conversation was panoramic. Now we need the client to commit to ONE specific project. Without this, the proposal remains abstract and unmeasurable.

### Selection Questions

#### **A. Candidate Project Identification**

**Of all the projects/products you mentioned, which do you think would be the best pilot candidate?**

- _Follow-up_: Why that one and not another?
- _Follow-up_: Is it a new (greenfield) or existing (brownfield) project?
- _Dig deeper_: Which has more pain today? Which has more internal visibility?

> **Simplified Pilot Selection** — Evaluate each candidate on 3 core dimensions:
>
> | Criteria                                 | Project A      | Project B      | Project C      |
> | ---------------------------------------- | -------------- | -------------- | -------------- |
> | **Pain** (visible problem, not trivial?) | High/Med/Low   | High/Med/Low   | High/Med/Low   |
> | **Autonomy** (minimal dependencies?)     | Yes/Partial/No | Yes/Partial/No | Yes/Partial/No |
> | **Champion** (committed sponsor?)        | Yes/Weak/No    | Yes/Weak/No    | Yes/Weak/No    |
> | **SELECTION**                            | ✅❌           | ✅❌           | ✅❌           |
>
> **Heuristic**: Prioritize **High Pain + Yes Autonomy + Yes Champion**

**Are you about to start something new or is there an ongoing project that would benefit from better processes?**

- _Follow-up_: If brownfield — what phase is it in? Are you at a good time to introduce changes?
- _Follow-up_: If greenfield — when does it start? Is there margin to start with the framework from scratch?
- _Dig deeper_: Is there an important release or milestone coming up that we can use as a measurement milestone?

#### **B. Pilot Team**

**Who would form the pilot project team?**

- _Follow-up_: How many people? What roles? (dev, QA, PM, design, DevOps)
- _Follow-up_: Are they dedicated to this project or do they share time with others?
- _Dig deeper_: Is there a tech lead or PM who can be our main point of contact?

**How would you describe this team's attitude toward process changes?**

- _Follow-up_: Are they early adopters or do they need convincing?
- _Follow-up_: Is there someone on the team who is already a champion of process improvement or AI?
- _Dig deeper_: What has worked/failed when you introduced changes to them previously?

#### **C. Baseline Metrics (Before)**

> **Note for interviewer**: These metrics are what we'll measure "before" and "after" the pilot. They're the value evidence for rollout.

**For the pilot project you chose, can you give us these current data points?**

| Metric                                              | Current Value | Source |
| --------------------------------------------------- | ------------- | ------ |
| **Lead time** (idea → production)                   |               |        |
| **Cycle time** (ticket opened → closed)             |               |        |
| **Deploy frequency**                                |               |        |
| **Production bug rate** (per release or per sprint) |               |        |
| **Mean time to incident resolution (MTTR)**         |               |        |
| **Onboarding time** (days until first PR)           |               |        |
| **Test coverage** (%)                               |               |        |
| **Re-work time** (% of sprints dedicated to rework) |               |        |
| **Team satisfaction** (if measured)                 |               |        |

- _Follow-up_: Which of these metrics do you already measure? Which can you estimate?
- _Dig deeper_: Are there specific business metrics for the project you want to improve?

**How would you define pilot "success"?**

- _Follow-up_: What do you need to see to decide to extend LIDR to more teams?
- _Follow-up_: In what timeframe? (4 weeks? 8 weeks? 3 months?)
- _Dig deeper_: Who decides if the pilot was successful? What evidence does that person need?

#### **D. Pilot Scope and Constraints**

**Are there technical or security constraints we should consider?**

- _Follow-up_: Can you install new tools? Do you need security/IT approval?
- _Follow-up_: Can we integrate with your current tools (Jira, GitHub, CI/CD)?
- _Dig deeper_: Is there sensitive data in the pilot project that limits what AI tools to use?

**Which SDLC phases do you want to prioritize in the pilot?**

- _Follow-up_: Start with what hurts most or what's easiest to improve?
- _Follow-up_: Do you prefer deep on 2-3 phases or light coverage on all?
- _Dig deeper_: Are there phases that are untouchable for now? (regulatory, legacy, internal policies)

---

## 8️⃣ Closing and Proposal (15-25 min)

### Findings Summary (5 min)

**Synthesis Template:**
"Based on our conversation, I see your organization has [N] active projects with [N] teams. Your strengths are in [X, Y, Z], you face challenges mainly in [A, B, C], and your AI maturity is at [basic/intermediate/advanced] level. For the pilot, we've identified [project name] with the [name/leader] team as the best candidate."

### LIDR AI-Powered SDLC Value Proposition (5-10 min)

**For Startups/Scale-ups** — "Agile AI-powered framework that grows with you": incremental pilot, AI workflows from day 1, templates that multiply the team.

**For Enterprises** — "AI-powered standardization without rigidity": controlled pilot with before/after metrics, compliance-ready, data-driven scaling.

### Next Steps (5 min)

**Engagement Proposal:**

1. **Baseline & Audit (1-2 weeks)** — Pilot baseline metrics, LIDR gap analysis, AI maturity assessment
2. **Pilot (4-8 weeks)** — LIDR + AI workflows implementation in pilot project, team training, weekly tracking vs baseline
3. **Evaluation (1-2 weeks)** — After vs baseline metrics, team retrospective, leadership presentation
4. **Rollout (3-6 months)** — Gradual project-by-project scaling, context adaptation, continuous optimization

---

## 🚨 **Escape Hatches & Contingencies**

### **What to do if...**

#### **"We don't have budget"**

- **Pivot**: Are there internal initiatives that could benefit? (quality, velocity, onboarding)
- **Explore timing**: When would be the right time? What trigger would make them allocate budget?
- **ROI approach**: If we could demonstrate X hours saved, would that change the perspective?

#### **"We don't see real pain"**

- **Dig deeper**: Contrast questions, "What if...?" scenarios
- **Future-facing**: What worries you as you grow?
- **Competition**: How do you compare to others in release time?

#### **"We tried this before"**

- **Root cause**: What specifically failed? Adoption? Tools? Change mgmt?
- **Differentiation**: Explain what makes LIDR different from traditional consultancies
- **Evidence**: Offer quick assessment to demonstrate different approach

#### **"Each team is very different"**

- **Validation**: Is diversity good (innovation) or chaotic (duplicated effort)?
- **Pilot approach**: Start with ONE team that's a model to scale
- **Common ground**: What processes DO you share? (deployment, security, code review)

#### **"Everything works perfectly"**

- **Challenge gently**: Scalability and future growth questions
- **Benchmark**: How do you compare to industry leaders?
- **Future state**: If you had to 2x the team tomorrow, would everything stay the same?

---

## Appendix A: Deep-dive Techniques

### SPIN Progression (Rackham)

Questions marked with `[S]` `[P]` `[I]` `[NP]` in the script follow this sequence:

- **`[S]` Situation** — facts and context (minimize — research beforehand)
- **`[P]` Problem** — difficulties, frustrations, what's broken
- **`[I]` Implication** — problem consequences (builds urgency): "How much does this cost you?"
- **`[NP]` Need-Payoff** — client articulates value: "What would it mean to solve this?"

### The "5 Whys" Rule

**Example**: "Releases are delayed" → Why? "Bugs at the end" → Why? "No time for testing" → Why? "Optimistic estimates" → Why? "Don't include testing/docs" → Why? "No one taught how to estimate the complete cycle" → **Root cause found.**

### Contrast Questions

**Structure**: "What works well vs what doesn't work?"

- **"What was your last successful release? What did you do differently?"**
- **"What was your worst production incident? What failed in the process?"**
- **"What do you admire about how other teams/companies work?"**
- **"What would you never do the same way again?"**

### Scenario Questions

**"What would happen if...?"**

- **"What would happen if tomorrow you have to onboard 5 new developers?"**
- **"What would happen if you need to do an emergency release on Friday?"**
- **"What would happen if a client reports a critical security bug?"**
- **"What would happen if you want to do 2x more releases per month?"**

---

## Appendix B: Warning Signs by Company Size

### 🚀 Startups (<50 people)

#### Typical Red Flags

- **"Everything is in the founder's head"** → Lack of documentation
- **"We move too fast for processes"** → Technical debt accumulating
- **"We're too small for specialized roles"** → Quality gaps

#### Readiness Signals

- **Mentions of "scalability"** → Growth awareness
- **"We need to be more professional"** → Motivation for structure
- **Funding/hiring plans** → Right timing to implement

### 📈 Scale-ups (50-200 people)

#### Typical Red Flags

- **"We were more agile before"** → Growing pains without structure
- **"Each team does things differently"** → Lack of standardization
- **"New people take months to be productive"** → Onboarding chaos

#### Readiness Signals

- **Newly hired CTO/VP Eng** → Mandate for improvement
- **Compliance/audit pressure** → External drivers
- **Multiple products/teams** → Complexity requiring structure

### 🏢 Enterprise (>200 people)

#### Typical Red Flags

- **"We have processes but no one follows them"** → Implementation gaps
- **"Each division uses different tools"** → Organizational silos
- **"Changes take 6 months to approve"** → Excessive rigidity

#### Readiness Signals

- **Digital transformation initiatives** → Executive buy-in
- **DevOps/Platform teams** → Infrastructure for standardization
- **Compliance/audit findings** → Regulatory pressure

---

## 📝 Post-Interview Notes Templates

### 🚀 **Executive Summary Template** (10 critical fields)

```markdown
# Discovery Summary: [Company Name]

## 📊 **Quick Facts**

- **Industry**: [Sector] → **Industry Pack**: [Biometric/Fintech/Healthcare/etc]
- **Size**: [N] tech people, [N] teams, [N] projects → **Segment**: [Startup/Scale-up/Enterprise]
- **Champion**: [Name, role] → **Decision Maker**: [Name, role]

## 🎯 **AI Maturity & Tools**

- **Current AI**: [Tools being used + % adoption]
- **Readiness**: [High/Medium/Low] → **Barriers**: [Top 2 blockers]
- **AI Champion**: [Who pushes AI internally]

## ⚠️ **SDLC Pain Points (Top 3)**

1. **[Pain Point 1]** → Costs: [hours/money/impact]
2. **[Pain Point 2]** → Costs: [hours/money/impact]
3. **[Pain Point 3]** → Costs: [hours/money/impact]

## 🎯 **PILOT SELECTED**

- **Project**: [Name] → **Type**: [Greenfield/Brownfield]
- **Team**: [N people, roles] → **PoC**: [Name, role]
- **Why this project**: [Pain + Autonomy + Champion]
- **Success criteria**: [What they need to see to decide rollout]
- **Timeline**: [Expected pilot duration]

## 🚥 **GO/NO-GO Signal**: [✅ GO / ⚠️ CONDITIONAL / ❌ NO-GO]

**Reason**: [Budget confirmed + Pain clear + Champion identified / Budget unclear / No real pain]
```

---

### 📋 **Complete Template** (for detailed discovery)

#### Information for Client Configuration

```markdown
## Client Profile

- **Company**: [Name] — **Industry**: [Sector] → Pack: [Healthcare/Fintech/etc]
- **Size**: [N people] → [Startup/Scale-up/Enterprise] — **Tech Team**: [N people]
- **Regulations**: [Compliance requirements]

## Buying Influences (Miller Heiman)

- **Economic Buyer**: [Name, role, position: for/neutral/resistant]
- **User Buyer**: [Name, role, position]
- **Technical Buyer**: [Name, role, position]
- **Coach**: [Name, role]

## Portfolio & Teams

- **Projects**: [N total, main list] — **Teams**: [N, structure]
- **Autonomy**: [Autonomous vs dependent] — **Shared resources**: [Platform, infra]
- **SDLC Uniformity**: [Same process or each team different]
- **Best Team**: [Which and why] — **Worst Pain**: [Which and why]

## Motivation & Growth Context

- **Why now**: [What triggered improvement search — incident, audit, growth, pressure]
- **Growth plans**: [Scale team? New products? Expansion?]
- **Processes at risk**: [Which processes won't handle growth]

## AI Maturity (→ see completed table in section 2D)

- **Tools**: [Code assistants / General LLMs / Specialized / Embedded in stack]
- **Adoption**: [Individual informal / Team licensed / Org-wide] — [% active] — Champions: [who]
- **Impact**: [Concrete data vs perception] — Incidents: [bugs from AI?]
- **Governance**: [Policies? IP/data restrictions? Output validation?]
- **Vision & Barriers**: [What they expect / Technical, cultural, org / Budget]

## SDLC Maturity Scoring (→ see scale section 3)

| Phase                      | Level (1-5) | Current State | Desired State | Gap |
| -------------------------- | ----------- | ------------- | ------------- | --- |
| Origination & Discovery    |             |               |               |     |
| Specification & Planning   |             |               |               |     |
| Development & Code Quality |             |               |               |     |
| QA & Testing               |             |               |               |     |
| Security & Deploy          |             |               |               |     |
| Monitoring & Ops           |             |               |               |     |

## Pain Points & Gap Analysis (SPIN)

- **Top 3 Pain Points**: [1. ... 2. ... 3. ...]
- **Implication**: [How much they cost — hours, money, turnover, time-to-market]
- **Desired State**: [What "excellent" looks like in 12-18 months]
- **What they tried before**: [Previous improvement attempts and why they failed]

## Tech Context (only what affects SDLC)

- **Regulatory constraints**: [Compliance gates that condition processes]
- **Scale factors**: [Users, latency, multi-region — what impacts deploy]
- **Architecture**: [Mono/Micro/Serverless] — **Stack**: [FE, BE, DB, Cloud]

## QA, Docs & Change Management

- **Testing**: [Types, coverage %, automated %, framework, data mgmt]
- **Bug Triage**: [SLAs, environments, feature flags, rollback]
- **Docs**: [Tools, API docs, onboarding time, changelogs]
- **Change Readiness**: [History, champions, expected resistance, culture]

## PILOT PROJECT (CRITICAL)

- **IMPACT Score**: [weighted score — see matrix section 8A]
- **Project**: [Name] — **Why**: [pain, visibility, representativeness]
- **Type**: [Greenfield/Brownfield] — **Phase**: [Starting/Ongoing/Maintenance]
- **Team**: [N people] — Roles: [Dev, QA, PM, Design, DevOps]
- **Dedication**: [100% or shared] — **PoC**: [Tech lead or PM]
- **Change Attitude**: [Early adopters/neutral/resistant] — **AI Champion**: [who]
- **Baseline Metrics**: (→ see completed table in section 8C)
- **Success Criteria**: [What they need to see] — **Timeframe**: [duration]
- **Decision Maker**: [Who decides + what evidence needed]
- **Constraints**: [Security, tools, sensitive data]
- **Priority Phases**: [SDLC phases to attack first] — **Next Milestone**: [milestone]

---

## Changelog

| Version | Date       | Changes                                                                                                                                                                                                                                   |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.2.0   | 2026-04-06 | **Post-feedback optimization**: Reduced total time (95-175 min vs 105-185 min), rebalanced focus (AI+SDLC=80min vs Tools=15min), added guardrails/signals, simplified IMPACT matrix, added executive template, implemented escape hatches |
| 3.1.0   | 2026-04-06 | **Over-scoping correction**: Eliminated business model deep-dive, 100% focus on SDLC processes                                                                                                                                            |
| 3.0.0   | 2026-04-06 | Complete initial version                                                                                                                                                                                                                  |

## Readiness & Proposed Configuration

- **Score**: [1-5] — **Decision Makers**: [names and roles]
- **Budget**: [range] — **Timeline**: [when to start]
- **Priority Modules**: [what first] — **Integrations**: [tools]
- **AI Workflow Priorities**: [which AI workflows in which phases]
- **Rollout Strategy**: [pilot → N teams → timeline]
```

### Follow-up Actions

- [ ] **Send recap email** with key takeaways + confirmation of selected pilot project (24h)
- [ ] **Complete AI by SDLC phase table** if gaps remained during interview (48h)
- [ ] **Prepare detailed proposal** based on identified gaps + pilot plan (1 week)
- [ ] **Schedule technical session** with pilot team if not present (1 week)
- [ ] **Schedule demo** of LIDR framework configured for their context (2 weeks)
- [ ] **Obtain baseline metrics** they couldn't provide in interview (before starting pilot)

---

## 🎯 Interview Success Indicators

### ✅ Successful Interview If:

- You got them talking 70%+ of the time (you only facilitate/ask questions)
- You obtained concrete examples (not just generalizations)
- You identified at least 3 pain points with their quantified **implications** (SPIN)
- Client articulated **desired state** and **value of getting there** (Need-Payoff)
- You completed the **maturity scoring table** (section 3) and **AI by phase table** (section 2D)
- You stayed focused on **SDLC processes** — didn't deviate to evaluate their product or business model
- **They have a pilot project with IMPACT score** and baseline metrics
- You identified the 4 **buying roles** (Miller Heiman) and their positions
- Client asks about next steps (active engagement)

### ⚠️ Interview Red Flags:

- Very generic responses or "everything is fine"
- Can't give specific examples of problems
- Only 1 person present (lack of diverse context)
- Much defensiveness about current processes
- No clarity on budget or decision making process
- **Can't commit to a concrete pilot project**
- **Total resistance to AI tools without willingness to explore**
- **Only talk about "the company" without landing on specific teams/projects**

---

**💡 Final Tip**: The best interview is when the client ends saying "we had never thought about this this way" or "now I understand why we have these recurring problems".

## Changelog

| Version  | Date       | Author                  | Changes                                                                                                                                                                                                                                                                                     |
| -------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0    | 2026-04-06 | TL: Lead Engineer       | Initial interview manual for SDLC client discovery                                                                                                                                                                                                                                          |
| 2.0.0    | 2026-04-06 | AI-Assisted             | Multi-project/multi-team, complete AI section, Pilot Project Selection with metrics, UX, FRs/NFRs, Architecture, QA, Documentation, expanded template                                                                                                                                       |
| 2.1.0    | 2026-04-06 | AI-Assisted             | Compression: eliminated duplicate Metrics section, merged Stakeholders+Docs, compressed AI/SDLC/UX/Template                                                                                                                                                                                 |
| 3.0.0    | 2026-04-06 | AI-Assisted             | Standard alignment: SPIN, Gap Analysis, CMMI maturity scoring, IMPACT matrix, Miller Heiman, Forrester BI prerequisite, interview sequencing                                                                                                                                                |
| 3.1.0    | 2026-04-06 | AI-Assisted             | Pure SDLC focus: eliminated Product/Value Proposition section, eliminated complete UX section (UX process moved to Phase 0-1), eliminated FRs/NFRs/Data (replaced by "Technical Context Affecting SDLC"), cleaned template of product fields. From 8 to 8 sections but focused on processes |
| 3.2.0-en | 2026-04-29 | AI: English Translation | Complete translation from Spanish v3.2.0 to English maintaining all structure, technical terminology and methodological frameworks                                                                                                                                                          |
