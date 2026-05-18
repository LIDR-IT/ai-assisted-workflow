# Source Evaluation and Quality Assessment

## Source Credibility Framework

### Primary Source Evaluation

#### Expert Interview Quality Criteria

**Authority Assessment:**

- **Position Relevance:** Current or recent role in the domain (≤2 years)
- **Experience Depth:** Minimum 5 years in the specific domain area
- **Decision Influence:** Has made or influenced significant domain decisions
- **Thought Leadership:** Published research, conference speaking, industry recognition
- **Independence:** No direct financial interest in research conclusions

**Knowledge Quality Indicators:**

- **Specificity:** Can provide concrete examples and detailed scenarios
- **Current Awareness:** References recent developments and emerging trends
- **Balanced Perspective:** Acknowledges limitations and uncertainties
- **Cross-Functional View:** Understands business, technical, and regulatory aspects
- **Historical Context:** Can explain evolution and change drivers

**Interview Validation Checklist:**

- [ ] Expert provided specific, verifiable examples
- [ ] Information aligns with other credible sources
- [ ] Expert acknowledged areas of uncertainty
- [ ] No obvious bias or agenda promotion
- [ ] Expert demonstrated deep domain knowledge

#### Company Disclosure Analysis

**Regulatory Filings (SEC, Annual Reports):**

```
High Credibility Indicators:
├── Audited financial statements
├── Management discussion and analysis (MD&A)
├── Risk factor disclosures
├── Forward-looking statement caveats
└── Consistent year-over-year reporting

Quality Assessment Criteria:
├── Materiality thresholds clearly defined
├── Non-GAAP reconciliations provided
├── Segment reporting granularity
├── Risk factor specificity
└── Management forecast accuracy history
```

**Earnings Calls and Investor Relations:**

- **Signal Quality:** Unscripted Q&A responses vs. prepared remarks
- **Management Credibility:** Track record of forecast accuracy
- **Information Density:** Specific metrics vs. generic statements
- **Competitive Intelligence:** Comments about market dynamics
- **Strategic Direction:** Resource allocation and priority signals

### Secondary Source Evaluation

#### Industry Research Reports

**Analyst Firm Credibility Ranking:**

| Tier       | Firms                          | Strengths                              | Limitations                           |
| ---------- | ------------------------------ | -------------------------------------- | ------------------------------------- |
| **Tier 1** | Gartner, Forrester, IDC        | Brand recognition, broad coverage      | Conservative bias, lagging indicators |
| **Tier 2** | 451 Research, Frost & Sullivan | Specialized depth, emerging tech focus | Limited sample sizes                  |
| **Tier 3** | Specialist boutiques           | Niche expertise, contrarian views      | Limited resources, potential bias     |

**Report Quality Assessment:**

```markdown
Methodology Evaluation:
├── Sample size and selection criteria
├── Data collection methodology transparency
├── Statistical significance testing
├── Bias acknowledgment and mitigation
└── Peer review or validation processes

Content Quality Indicators:
├── Specific quantitative data vs. generalities
├── Source attribution and transparency
├── Predictive accuracy track record
├── Balanced perspective presentation
└── Actionable insights vs. generic observations
```

#### Academic Research

**Publication Quality Hierarchy:**

1. **Tier 1:** Top-tier peer-reviewed journals (Nature, Science, Cell)
2. **Tier 2:** Field-specific high-impact journals (impact factor >5)
3. **Tier 3:** Specialized peer-reviewed journals (impact factor 2-5)
4. **Tier 4:** Conference proceedings and working papers
5. **Tier 5:** Preprints and non-peer-reviewed publications

**Research Evaluation Framework:**

```
Methodological Rigor:
├── Study design appropriateness (RCT, observational, meta-analysis)
├── Sample size and power calculation
├── Control group and randomization
├── Outcome measure validity and reliability
└── Statistical analysis appropriateness

Relevance Assessment:
├── Population studied vs. target application
├── Outcome measures vs. business objectives
├── Study context vs. implementation environment
├── Time relevance (publication recency)
└── Geographic and regulatory applicability
```

### Patent and Technical Documentation

#### Patent Quality Assessment

**QUALITAS Framework Application:**

- **Quality (25%):** Claim breadth, technical depth, prosecution quality
- **Uniqueness (20%):** Novelty search results, prior art analysis
- **Applicability (15%):** Commercial relevance, implementation feasibility
- **Litigation (15%):** Enforceability strength, litigation history
- **International (10%):** Geographic coverage, family strength
- **Technology (10%):** Technical sophistication, innovation level
- **Assignee (5%):** Patent holder credibility and resources

**Patent Landscape Analysis:**

```python
# Patent Quality Scoring Example
def calculate_patent_quality(patent_data):
    score = 0

    # Claim analysis
    if patent_data['independent_claims'] <= 3:
        score += 20  # Focused claims indicate quality

    # Citation analysis
    if patent_data['forward_citations'] > 10:
        score += 15  # High citation indicates importance

    # Prosecution analysis
    if patent_data['prosecution_length'] < 36:  # months
        score += 10  # Efficient prosecution indicates quality

    # Family size analysis
    if patent_data['family_size'] > 5:
        score += 10  # Large family indicates investment

    return min(score, 100)  # Cap at 100
```

#### Technical Documentation Evaluation

**Open Source Project Assessment:**

- **Community Health:** Active contributors, regular commits, issue resolution speed
- **Code Quality:** Test coverage, documentation, code review practices
- **Adoption Metrics:** Download counts, dependent projects, enterprise users
- **Maintainer Credibility:** Organization backing, individual reputation
- **Security Posture:** Vulnerability disclosure, security audit history

## Information Age and Relevance

### Temporal Validity Framework

#### Information Half-Life by Domain

| Domain                    | Half-Life    | Refresh Frequency | Critical Indicators                            |
| ------------------------- | ------------ | ----------------- | ---------------------------------------------- |
| **Technology Trends**     | 6-12 months  | Quarterly         | Framework adoption, performance benchmarks     |
| **Market Sizing**         | 12-18 months | Semi-annually     | TAM/SAM updates, growth rates                  |
| **Competitive Landscape** | 3-6 months   | Monthly           | Funding rounds, product launches, partnerships |
| **Regulatory Changes**    | 6-24 months  | Quarterly         | Law changes, guidance updates, enforcement     |
| **Financial Performance** | 3 months     | Quarterly         | Earnings reports, guidance updates             |

#### Staleness Indicators

**Red Flags for Outdated Information:**

- Data predating significant market events (COVID-19, GDPR, etc.)
- Technology assessments ignoring major platform changes
- Market analyses missing recent entrants or exits
- Regulatory guidance predating major policy changes
- Financial models using pre-disruption assumptions

**Validation Techniques:**

```markdown
Recent Event Cross-Check:
├── Compare findings against recent news and events
├── Verify technology assessments against current releases
├── Check market data against recent funding rounds
├── Validate regulatory stance against recent guidance
└── Confirm competitive positioning against recent moves
```

### Geographic and Cultural Relevance

#### Market Context Adaptation

**Regional Variation Assessment:**

- **Regulatory Environment:** Data protection laws, financial regulations, healthcare standards
- **Market Maturity:** Technology adoption curves, payment preferences, trust factors
- **Cultural Factors:** Privacy expectations, government interaction preferences, social norms
- **Infrastructure:** Internet penetration, mobile vs. desktop usage, payment infrastructure
- **Economic Conditions:** GDP per capita, income distribution, spending patterns

**Localization Validation Checklist:**

- [ ] Regulatory requirements specific to target markets
- [ ] Cultural norms and expectations consideration
- [ ] Local competitor landscape analysis
- [ ] Infrastructure limitations and capabilities
- [ ] Economic and purchasing power assessment

## Bias Detection and Mitigation

### Common Research Biases

#### Confirmation Bias Mitigation

**Structured Devil's Advocate Process:**

1. **Assumption Identification:** List all key assumptions explicitly
2. **Contrary Evidence Search:** Actively seek disconfirming information
3. **Alternative Hypothesis:** Develop competing explanations
4. **Stress Testing:** Model scenarios where assumptions fail
5. **Red Team Review:** Have skeptical reviewers challenge findings

**Implementation Example:**

```markdown
Primary Hypothesis: "Biometric authentication will replace passwords within 5 years"

Devil's Advocate Analysis:
├── Privacy backlash could slow adoption
├── Technical limitations in accuracy across populations
├── Regulatory restrictions on biometric data collection
├── Cost barriers for small businesses
└── User behavior inertia and resistance to change

Alternative Hypotheses:
├── Hybrid approaches (biometric + password) may dominate
├── Zero-trust architectures may reduce authentication importance
├── Quantum computing may obsolete current biometric methods
└── Regulatory compliance costs may favor password alternatives
```

#### Selection Bias in Source Choice

**Balanced Source Portfolio:**

```
Geographic Distribution:
├── 40% North American sources
├── 30% European sources
├── 20% Asian sources
└── 10% Other regions

Source Type Distribution:
├── 30% Academic/research institutions
├── 25% Industry practitioners
├── 20% Financial/investment analysts
├── 15% Regulatory/policy experts
└── 10% Customer/user perspectives

Perspective Distribution:
├── 40% Supportive of hypothesis
├── 40% Neutral/analytical
└── 20% Skeptical/contrary
```

#### Survivorship Bias Awareness

**Failed Company Analysis:**

- Study companies that exited the market
- Understand failure modes and warning signs
- Identify survivor characteristics vs. luck factors
- Analyze timing and market condition impacts

**Implementation Approach:**

```python
# Example: Analyze both successful and failed companies
def comprehensive_market_analysis(sector):
    success_cases = get_successful_companies(sector)
    failure_cases = get_failed_companies(sector)

    success_patterns = analyze_patterns(success_cases)
    failure_patterns = analyze_patterns(failure_cases)

    # Identify true differentiators vs. survivorship bias
    real_success_factors = success_patterns - failure_patterns

    return {
        'success_factors': real_success_factors,
        'failure_modes': failure_patterns,
        'survivorship_bias': success_patterns & failure_patterns
    }
```

### Information Quality Scoring

#### Comprehensive Quality Framework

**Multi-Dimensional Scoring (1-10 scale):**

| Dimension       | Weight | Criteria                                                   | Score Calculation                             |
| --------------- | ------ | ---------------------------------------------------------- | --------------------------------------------- |
| **Authority**   | 25%    | Source credibility, expertise, independence                | Position + experience + reputation            |
| **Recency**     | 20%    | Information age, market relevance, event consideration     | Time decay function + event adjustment        |
| **Specificity** | 20%    | Concrete data, quantifiable metrics, actionable insights   | Detail level + quantification + actionability |
| **Validation**  | 15%    | Cross-source confirmation, methodology transparency        | Triangulation score + method disclosure       |
| **Relevance**   | 10%    | Geographic applicability, market segment alignment         | Context match + transferability               |
| **Objectivity** | 10%    | Bias mitigation, balanced perspective, agenda transparency | Bias indicators + perspective balance         |

**Automated Quality Scoring:**

```python
def calculate_information_quality(source_data):
    # Authority scoring (0-10)
    authority = calculate_authority_score(source_data['author'], source_data['institution'])

    # Recency scoring with domain-specific decay
    recency = calculate_recency_score(source_data['date'], source_data['domain'])

    # Specificity scoring
    specificity = analyze_content_specificity(source_data['content'])

    # Validation scoring
    validation = count_source_confirmations(source_data['claims'])

    # Calculate weighted score
    quality_score = (
        authority * 0.25 +
        recency * 0.20 +
        specificity * 0.20 +
        validation * 0.15 +
        source_data['relevance'] * 0.10 +
        source_data['objectivity'] * 0.10
    )

    return round(quality_score, 2)
```

## Source Documentation Standards

### Citation and Attribution

#### Academic Citation Standards

**Source Types and Formats:**

```markdown
Journal Articles:
Author, A. A. (Year). Title of article. Title of Journal, Volume(Issue), pages. DOI

Industry Reports:
Organization. (Year). Report Title. Retrieved from URL [Accessed: Date]

Expert Interviews:
Expert Name, Title, Organization. Personal communication, Date.
[Permission granted for attribution: Yes/No]

Company Filings:
Company Name. (Year, Month Day). Filing Type (Form 10-K, 8-K, etc.).
SEC EDGAR. Retrieved from URL

Patent Documents:
Inventor(s). (Year). Patent Title. Country Patent Number. Patent Office.
```

#### Chain of Custody Documentation

**Information Traceability:**

- Original source identification and access method
- Date and time of information retrieval
- Version or edition of source material
- Intermediary sources and potential modifications
- Researcher interpretation and analysis notes

**Documentation Template:**

```yaml
source_id: "SRC-2026-001"
original_source: "Gartner Market Guide for Biometric Authentication"
access_method: "Direct subscription download"
retrieval_date: "2026-03-15"
version: "2026 Edition, March 2026"
pages_referenced: "15-23, 45-47"
key_extracts:
  - quote: "Market will reach $8.2B by 2028"
    page: 16
    context: "Global market size projection"
  - quote: "Regulatory compliance drives 40% of adoption"
    page: 22
    context: "Adoption driver analysis"
researcher_notes: "Methodology unclear for market sizing; cross-check needed"
confidence_score: 7.5
```

### Reference Management

#### Database Schema for Source Tracking

```sql
-- Sources table
CREATE TABLE sources (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    author VARCHAR,
    organization VARCHAR,
    publication_date DATE,
    access_date DATE,
    source_type VARCHAR, -- 'academic', 'industry', 'news', 'interview'
    url VARCHAR,
    quality_score DECIMAL(3,1),
    notes TEXT
);

-- Claims table
CREATE TABLE claims (
    id UUID PRIMARY KEY,
    source_id UUID REFERENCES sources(id),
    claim_text TEXT NOT NULL,
    claim_type VARCHAR, -- 'quantitative', 'qualitative', 'prediction'
    confidence_level VARCHAR, -- 'high', 'medium', 'low'
    page_reference VARCHAR,
    extracted_date DATE,
    validation_status VARCHAR -- 'confirmed', 'refuted', 'uncertain'
);

-- Cross_references table
CREATE TABLE cross_references (
    claim_id UUID REFERENCES claims(id),
    supporting_source_id UUID REFERENCES sources(id),
    confirmation_type VARCHAR, -- 'confirms', 'contradicts', 'qualifies'
    strength INTEGER -- 1-10 scale
);
```

This comprehensive source evaluation framework ensures research quality while maintaining efficiency in the information gathering and analysis process.
