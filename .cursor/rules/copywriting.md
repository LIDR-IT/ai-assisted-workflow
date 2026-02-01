---
description: Review copy for effective copywriting principles and best practices
argument-hint: <file-or-pattern>
---

# Copywriting Guidelines

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Core Principles

- Clarity over cleverness: choose clear over creative when conflict
- Benefits over features: emphasize outcomes, not just capabilities
- Specific over vague: concrete metrics ("4 hours → 15 minutes") not abstract claims ("save time")
- Customer language over company jargon: mirror how customers describe problems
- One idea per section: single argument per paragraph/section
- Active voice over passive: "We generate" not "Reports are generated"
- Show over tell: describe outcomes, avoid adverbs
- Honest over sensational: never fabricate stats or testimonials

### Writing Style

- Simple words: "help" not "facilitate", "use" not "utilize"
- No buzzwords: avoid "streamline", "optimize", "innovative", "leverage", "synergy"
- Confident tone: remove hedging words ("almost", "very", "really", "perhaps")
- Delete exclamation points (unless brand voice demands them)
- Strip marketing jargon without substance
- No confusing industry-specific terms without explanation
- One sentence = one idea (avoid run-ons doing too much)

### Headlines

- Get to point immediately: bury nothing in qualifications
- Formula patterns:
  - "{Outcome} without {pain point}"
  - "The {category} for {audience}"
  - "Never {unpleasant event} again"
  - "{Question highlighting pain point}"
- Subheadline: 1-2 sentences max, expands headline
- Above fold: headline + subheadline + primary CTA visible

### CTA (Call-to-Action)

- Action verb + what they get + qualifier: "Start My Free Trial"
- Specific over generic: "Get Complete Checklist" not "Learn More"
- Avoid weak CTAs: Submit, Sign Up, Learn More, Click Here, Get Started
- Strong CTAs: "Start Free Trial", "See Pricing for My Team", "Create Your First [Thing]"
- Button copy communicates what visitor receives, not just action
- Match CTA to page context and visitor intent

### Page Structure

- Social proof early: logos, stats, testimonials near top
- Problem/pain section: demonstrate understanding before solution
- Solution/benefits: 3-5 key benefits connecting to outcomes
- How it works: 3-4 steps showing simplicity
- Objection handling: FAQ, comparisons, guarantees
- Final CTA: recap value, repeat CTA, risk reversal

### Content Patterns

- Rhetorical questions engage: "Tired of chasing approvals?"
- Analogies make abstract concrete
- Humor only if brand-appropriate and preserves clarity
- Testimonials: specific outcomes, attributed with name/photo
- Statistics: real numbers, sourced, relevant to claim

### Voice & Tone Consistency

- Define formality: casual/professional/formal
- Define personality: playful/serious, bold/understated, technical/accessible
- Maintain consistency while adjusting intensity
- Headlines: bolder
- Body copy: clearer
- CTAs: action-oriented

### Page-Specific Rules

**Homepage:**
- Serve multiple audiences without being generic
- Lead with broadest value proposition
- Clear navigation paths to specific use cases

**Landing Page:**
- Single message, single CTA
- Match headline to traffic source (ad/email/social)
- Complete argument on one page, no navigation away

**Pricing Page:**
- Help select right plan: "which fits me?" anxiety
- Make recommended option obvious (highlight/badge)
- Compare plans clearly, feature-by-feature

**Feature Page:**
- Feature → Benefit → Outcome chain
- Show use cases, not just capabilities
- Clear path to try or buy

**About Page:**
- Origin story connecting mission to customer benefit
- Include CTA (not just company history)
- Humanize brand with team/values

### Meta Content

- Page title: front-load keywords, under 60 chars
- Meta description: compelling, actionable, 150-160 chars
- OG/social share text: optimized for share context

### Anti-patterns (flag these)

- Passive voice: "is generated", "will be sent", "can be used"
- Buzzwords without substance: "innovative solution", "cutting-edge", "next-generation"
- Hedging: "almost", "very", "really", "quite", "rather", "perhaps"
- Vague claims: "save time" (specify how much)
- Generic CTAs: "Submit", "Click Here", "Learn More"
- Feature lists without benefits
- Jargon without explanation
- Multiple ideas in one section
- Clever wordplay obscuring meaning
- Exclamation point overuse
- Burying value in qualifications
- Company-speak not customer language
- Abstract benefits without concrete examples
- Run-on sentences doing too much
- Fabricated or unattributed testimonials
- Statistics without source
- Walls of text without whitespace
- Headlines that don't communicate value
- CTAs that don't say what you get

## Output Format

Group by page/file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## pages/landing/hero.tsx

pages/landing/hero.tsx:12 - headline vague → add specific outcome
pages/landing/hero.tsx:15 - "innovative solution" → remove buzzword, show actual benefit
pages/landing/hero.tsx:23 - CTA "Learn More" → "Start Free Trial" (specific action)
pages/landing/hero.tsx:34 - passive voice: "is generated" → "we generate"

## pages/home/index.tsx

pages/home/index.tsx:45 - "save time" → specify hours/minutes saved
pages/home/index.tsx:67 - exclamation points excessive (3) → remove or reduce
pages/home/index.tsx:89 - feature without benefit → add outcome

## components/pricing/PricingCard.tsx

components/pricing/PricingCard.tsx:23 - CTA "Sign Up" → "Start [Plan] Trial"
components/pricing/PricingCard.tsx:56 - no recommended plan highlighted → add visual emphasis

## copy/about.md

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.
