# SITREP Context — For Merging With Sales Machine
*Exported April 13, 2026 · Thrill Wave LLC*

This document captures everything important about the SITREP build that matters when combining it with the Sales Machine project. Written for handoff to a new Claude project or working session.

---

## What SITREP Is (Locked-In Definition)

SITREP answers one question about any organization: **"Does the public internet suggest people should trust this company with their money, their career, or their reputation?"**

It is a **trust audit**, not opposition research. Not a dirt-digging tool. Every finding must pass the commercial materiality test: does this affect whether people buy from, work for, or partner with this company? If yes, it's in. If it's just embarrassing but commercially irrelevant, it's out.

Three trust dimensions every SITREP evaluates:

1. **Customer trust** — will people buy from them? Comment sentiment on their content, Reddit mentions, Google Reviews trajectory, recurring complaints. The revenue survival signal.
2. **Employee trust** — can they keep the people who deliver the work? Glassdoor/Indeed trajectory, Reddit threads from current/former employees, job posting patterns showing backfilled roles.
3. **Market trust** — do partners, vendors, and the industry take them seriously? News coverage tone and frequency, industry conversation, competitive visibility.

Output reads like an intelligence brief with receipts — every claim linked to a source, every trend quantified with a date range, every quote timestamped. Not "we think X" but "here are 47 data points across 5 sources showing X."

---

## What SITREP Is Not

- Not a generic marketing research report
- Not an AI wrapper around web search (that's ~85-90% of value and easily replicable by clients)
- Not an opposition research/blackmail machine
- Not a pitch generator (though it produces pitch angles as output)
- Not a replacement for the Sales Machine — different tool, different purpose

---

## SITREP vs Sales Machine — Clean Separation

**SITREP** = "We have an org in front of us. What video should they make and why?"

**Sales Machine** = "Who should we be talking to, and what do we say to get in the room?"

Different tools, different data needs. Some data sources serve both but belong primarily to one.

### Data sources by tool:

**SITREP (content, messaging, audience, gaps):**
- YouTube Data API (content audit with metrics)
- Reddit via Apify (community conversation)
- Google Reviews via Apify (customer sentiment — planned)
- Glassdoor via Apify (employee trust — planned)
- Instagram/TikTok via Apify (social engagement — planned)
- Document upload (client-provided strategic plans, RFPs, annual reports — planned)
- SEC EDGAR (corporate filings — planned)
- Claude web search passes (news, org overview, industry context)

**Sales Machine (who to target, when, what to say):**
- USAspending.gov (production budgets, contract expirations)
- LinkedIn company data (timing signals: new hires, leadership changes)
- News API (warm signals for outreach)
- Conference Prospector (speaker lists from industry events)
- SAM.gov (federal RFPs)
- CRM data

### Integration opportunities (where they should connect):

- Sales Machine runs Recon SITREP automatically on every researched org
- SITREP's output feeds Sales Machine's outreach personalization
- Shared Supabase database for org records — Sales Machine surfaces targets, SITREP deepens them
- Shared proof-points library (Thrill Wave case study matcher)
- One unified dashboard for Chris, Ari, Tony

---

## SITREP Architecture (As Built)

### Stack
- **Backend:** Python + FastAPI, deployed on Railway (`https://sitrep-production-e8f1.up.railway.app`)
- **Frontend:** HTML/CSS/JS, deploys to Vercel
- **Database:** Supabase (SITREPs table with fuzzy org search + RLS)
- **Auth:** Supabase Auth — Chris, Ari, Tony have accounts
- **AI:** Claude API — Sonnet for Recon, Opus for Full SITREP

### Local repo
`/Users/chriskuzman/sitrep/` — connected to GitHub, auto-deploys to Railway

### File Structure
```
sitrep/
├── backend/
│   ├── main.py                # FastAPI app + routes
│   ├── config.py              # Env vars, Supabase client, model settings
│   ├── requirements.txt
│   ├── Procfile               # Railway deployment
│   └── engine/
│       ├── sitrep.py          # Orchestrator (wires 3 phases, stores in Supabase)
│       ├── ingest.py          # Phase 1: raw research (Claude web search + APIs)
│       ├── synthesize.py      # Phase 2: analysis + pattern recognition
│       ├── execute.py         # Phase 3: recommendations + rendered brief
│       └── prompts.py         # All Claude prompts (centralized)
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── SPEC.md
└── REDDIT_INTEGRATION_SPEC.md
```

### Environment variables
```
ANTHROPIC_API_KEY=           # Claude API
SUPABASE_URL=                # Supabase project URL
SUPABASE_SERVICE_KEY=        # Server-side only
YOUTUBE_API_KEY=             # YouTube Data API v3
APIFY_API_TOKEN=             # Powers Reddit + future scrapers (Google Reviews, Glassdoor, Instagram, TikTok)
```

### API endpoints
```
POST /api/sitrep               # Kick off a run, returns sitrep_id
GET /api/sitrep/{sitrep_id}    # Poll for status / get completed brief
GET /api/sitreps               # List past SITREPs (searchable, filterable)
GET /api/health                # Health check
```

---

## The Three Phases

### Phase 1: INGEST (`ingest.py`)
Two types of research run concurrently via `asyncio.gather()`:

**A) Claude web search queries (5 parallel passes):**
1. Organization overview
2. Recent news (last 6 months)
3. Content audit (YouTube, social, web)
4. Industry/sector context
5. Public-facing messaging

**B) Structured API data sources (run concurrently alongside web searches):**
6. **YouTube Data API** — `_youtube_research()` — BUILT
7. **Reddit via Apify** — `_reddit_research()` — BUILT
8. **Google Maps/Places Reviews via Apify** — `_google_reviews_research()` — NEXT
9. **Glassdoor via Apify** — `_glassdoor_research()` — PLANNED
10. **Instagram via Apify** — `_instagram_research()` — PLANNED
11. **TikTok via Apify** — `_tiktok_research()` — PLANNED

All Apify sources share `APIFY_API_TOKEN` and `apify-client` Python package. Each follows the same async pattern: takes `org_name`, returns `{"label": "platform", "content": {...}}` or `{"label": "platform", "error": "..."}`.

### Phase 2: SYNTHESIZE (`synthesize.py`)
Takes raw research, produces structured analysis. Claude identifies:
- Gap between what org says publicly vs. what they need to communicate
- Which of four failure modes they're vulnerable to
- Who their real audience is vs. who they think it is
- Peer/competitor comparison (full mode only)
- Cross-references across structured data sources for contradictions (HIGH-VALUE findings)

Output: structured JSON analysis (org_snapshot, recent_intelligence, communication_landscape, the_gap, failure_mode_assessment, audience_analysis, peer_landscape, key_themes).

### Phase 3: EXECUTE (`execute.py`)
Produces actionable recommendations:
- 1-2 video concepts (Recon) or 3-5 (Full) with titles, formats, lengths, audiences, distribution, rationale, interview subjects (roles not names)
- Why Thrill Wave specifically
- Pitch angle (Chris's voice, ready to paste into email)
- Distribution strategy (Full only)

Final output: rendered markdown brief stored in Supabase.

---

## The Four Failure Modes Framework

Every SITREP diagnoses which of these modes the org is most at risk for:

1. **GUT INSTINCT** — Leadership decides what to produce based on personal interest, not audience need. Vanity projects, CEO-driven creative.
2. **COPYCAT** — Org sees a peer/competitor's content and says "make us one of those." No strategic foundation, just mimicry.
3. **VENDOR-PITCHED** — Production company sold them a format that serves the vendor's portfolio more than the client's needs. Style over substance.
4. **NO DISTRIBUTION PLAN** — They produce good content but have no strategy for getting it in front of the right audience.

---

## Structured Data Source Pattern (Critical for Build)

Every new data source follows the same architecture. This is the playbook:

1. **Dedicated async function in `ingest.py`** — named `_platform_research(org_name, vertical)`
2. **Uses structured API** (not Claude web search) — returns real numbers, timestamps, URLs
3. **Returns consistent format:**
   ```python
   {"label": "platform_name", "content": {...structured data...}}
   # or
   {"label": "platform_name", "error": "error message"}
   ```
4. **Added to `asyncio.gather()` call** in `run_ingest()` — runs concurrently with all others
5. **Gets a `_format_[platform]_data()` function in `synthesize.py`** that converts structured data to readable text for the synthesis prompt — must include source URLs
6. **Gets a section added to `_format_raw_research()` in `synthesize.py`**
7. **STRUCTURED DATA SOURCES block in `SYNTHESIZE_PROMPT` (`prompts.py`)** gets updated with guidance on how Claude should cite this data

### Why structured data matters
Claude web search gives impressions ("Glassdoor reviews seem negative"). Structured sources give receipts ("Glassdoor rating dropped from 3.8 to 2.4 over 18 months, with 'management' appearing in 67% of 1-star reviews"). Synthesis layer cites numbers, dates, and source URLs instead of summarizing what Claude browsed. This is the core differentiator that makes SITREP uncopyable by clients with their own Claude subscription.

### Why Apify (not direct APIs)
Reddit locked down their API in late 2024 — requires approval that takes days/weeks and may reject commercial use. Apify handles platform access, returns structured data, ~$0.05-0.10 per SITREP run for Reddit data. One Apify account/token powers Reddit, Google Reviews, Glassdoor, Instagram, TikTok scrapers — all future structured sources.

---

## Prompt Engineering Principles

All prompts live in `prompts.py` (centralized, editable). The prompts are the soul of the tool.

### Principles enforced in every prompt:
- **Opinionated** — No hedging. "They need X" not "they might benefit from X."
- **Thrill Wave-aware** — Every prompt includes `THRILL_WAVE_CONTEXT` so recommendations are grounded in real capability.
- **Vertical-adaptive** — The "competitive landscape" framing shifts by sector. Defense orgs have peer orgs, not competitors. Government orgs have public trust mandates, not market share. `VERTICAL_FRAMING` dict handles this.
- **Anti-generic** — Prompts explicitly instruct against generic observations. Push for specific, non-obvious insights specific to THIS organization.
- **Four failure modes integrated** — Used as a diagnostic lens, not a checklist.

### Trust audit filter (must be baked in):
The synthesis prompt should surface findings that affect whether people trust the org commercially. Not scandal. Not embarrassing irrelevancies. Commercial materiality only.

### STRUCTURED DATA SOURCES block (growing):
Tells Claude to treat structured data differently from web search summaries. Reference specific numbers. Cite source URLs. Cross-reference across sources. Contradictions between sources are high-value findings.

---

## Verticals Supported

Each vertical has custom framing language in `VERTICAL_FRAMING`:
- defense (aerospace, defense contractors — peer orgs, not competitors)
- healthcare (health systems, medical device, clinical)
- government (federal, state, local — public trust mandate)
- technology (advanced manufacturing, chip makers — talent recruiting focus)
- corporate (private sector — standard competitive framing)
- nonprofit (donor/volunteer/impact focus)
- other (fallback)

---

## Current State of Build (As of April 13, 2026)

### What's working:
- Backend deployed on Railway, `/api/health` returns OK
- Supabase DB with RLS
- Auth for Chris/Ari/Tony
- Two successful test runs on Relentless Beats (Recon mode)
- YouTube Data API integration live
- Reddit via Apify integration just merged (needs testing)
- Frontend deployed (Vercel git config issue blocking last push — fixable with `git config --global user.email chris@thrillwave.com`)

### What's next (in order):
1. Test Reddit integration on Relentless Beats, compare to prior run
2. Google Maps Reviews via Apify integration
3. Glassdoor via Apify integration
4. Instagram + TikTok via Apify
5. Document upload (client-provided materials become Layer 2 internal data)
6. Institutional knowledge layer (mark existing clients, store what Thrill Wave already knows)
7. Client-facing sanitized output mode (vs. internal raw mode)
8. PDF export with Thrill Wave branding
9. Longitudinal tracking (diff same org across quarters)

---

## Relentless Beats Test Run — Key Findings From Last Session

SITREP correctly identified:
- Revenue: $3.8M
- Employee scaling: 43 → 135
- Glassdoor culture issues
- Social metrics, event names, founder history
- **Key insight:** Caught gap between "family" public messaging and toxic Glassdoor reviews — this gap emerged from cross-referencing separate research queries
- Identified Vendor-Pitched as primary failure mode risk
- Generated pitchable concepts: "Breaking the Underground" feature doc, "The Real Builders" testimonial series

**Known limitation:** Tool didn't know Relentless Beats is an existing 8-year client. No institutional knowledge layer yet.

**Tone note:** Glassdoor/culture critique was diabolically honest — would nuke a client relationship if shared raw. Need client-facing sanitized mode before output goes external.

---

## Key Positioning Lines (For Sales Machine Integration)

When Sales Machine generates outreach that references SITREP findings, it should use Thrill Wave's locked-in language:

- "Research. Intelligence. Film."
- "We show up knowing what you should make, not asking what you want to make."
- "We run open source intelligence on your brand before we write a single word of script."
- "Your audience is already in a conversation. We study the conversation before we show up with a camera."
- "Most video fails because the story was wrong, not because the production was bad."

### Copy rules (enforce in Sales Machine outreach that uses SITREP output):
- No em dashes in headlines
- Never use "content" — use media, film, video, story
- Never say "failing" — clients are successful orgs with a communication gap
- Never promise ROI or metrics
- Don't lead with AI or technology — lead with the insight it produces

---

## Thrill Wave Business Context (Relevant for SITREP + Sales Machine)

**Company:** Thrill Wave LLC, Scottsdale AZ, 3-person team (Chris, Ari, Tony)

**2025 revenue:** ~$271K. **2026 target:** $500K–$1M. Primary constraint: pipeline.

**Retainer target:** 3-5 clients at $8K–$20K/month.
**Contract target:** 4-6 at $50K+ per year.
**Anchor:** $84,150 ITCA docu-series through July 2026 (flagship case study).

**Priority verticals:**
- Defense & Aerospace (Raytheon, Boeing Mesa, Luke AFB, Honeywell)
- Technology & Manufacturings/Advanced Manufacturing (TSMC, Intel Chandler)
- Healthcare Systems (Banner, HonorHealth, Mayo)
- Government/Public Affairs (border/immigration — AZ is ground zero)
- International NGOs
- Tribal governments

**Positioning:** The production company for technically difficult, sensitive, and controversial projects most crews won't touch. Not the safe choice — the right choice.

**Competitive edge:** Willingness to go where others don't + AI-augmented speed + lean overhead + genuine craft obsession.

---

## Chris's Working Style (Applies to Both Projects)

- Cowork = strategy, Claude Code = implementation. Don't write code in Cowork — write specs.
- Answer the actual question, no padding. No "great question!"
- Have opinions. Commit. No hedging.
- Push back hard when an idea is weak. Charm over cruelty, but don't sugarcoat.
- Brevity. If it fits in a sentence, one sentence.
- Chris has blind spots and explicitly asks to be pushed back on.

---

## Files to Reference

In the sitrep repo:
- `SPEC.md` — full build spec with phase descriptions and build order
- `REDDIT_INTEGRATION_SPEC.md` — template for future structured data source specs
- `backend/engine/ingest.py` — contains `_youtube_research()` and `_reddit_research()` as reference patterns
- `backend/engine/prompts.py` — all prompts, including STRUCTURED DATA SOURCES block
- `backend/engine/synthesize.py` — `_format_youtube_data()` and `_format_reddit_data()` as formatting reference

---

*This document captures the full strategic and technical context needed to merge SITREP with the Sales Machine project or to hand off to a new Claude project for continued development.*
