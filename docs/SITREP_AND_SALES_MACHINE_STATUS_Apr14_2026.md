# SITREP + Sales Machine Status Update
**April 14, 2026 — For Website Build Reference**

---

## What SITREP Actually Is

SITREP is an OSINT-powered intelligence tool that answers one question before any camera rolls: **what story should this organization be telling, and why aren't they telling it?**

It runs open-source intelligence across 15 research sources simultaneously, produces a structured analysis of communication gaps, and outputs specific recommendations for what media to produce and where to distribute it.

It is NOT a content audit. It is NOT a brand survey. It is a research mechanism that maps the gap between how the world sees an organization and how that organization sees itself. That gap becomes the creative brief.

### How It Works (Three Phases)

**Phase 1: INGEST** — parallel intelligence gathering across:
- 5 Claude web search passes (org overview, recent news, content audit, industry context, public messaging)
- YouTube Data API (channel stats, video performance, top comments)
- Reddit (threads, upvotes, sentiment keywords via Apify)
- Instagram (profile data, post engagement, deep comment scraping on top posts)
- TikTok (video performance, comments)
- Twitter/X (tweet engagement, audience response)
- Facebook (page activity, post engagement)
- LinkedIn (company profile, employee count, follower count, industries)
- Google Reviews (ratings, review text, response patterns)
- Glassdoor (employee reviews, pros/cons, ratings)
- Yelp (business reviews — unreliable due to anti-scraping, included as option)

All sources run concurrently. Users select which to include via toggle interface.

**Phase 2: SYNTHESIZE** — Claude Opus analyzes all collected data and produces:
- Organization snapshot
- Recent intelligence
- Communication landscape (with explicit platform hierarchy — which channel is primary vs obligatory)
- The gap (what story they should be telling but aren't)
- Failure mode assessment (gut instinct, copycat, vendor-pitched, or no distribution plan)
- Audience analysis (including comment rhetoric from primary platform)
- Peer landscape

**Phase 3: EXECUTE** — produces actionable output:
- 3-5 recommended video/media productions with titles, formats, target audiences, distribution strategy
- "Why Thrill Wave" pitch angle
- Distribution strategy
- Full markdown brief

### The Four Failure Modes (Diagnostic Framework)

Every SITREP diagnoses which failure mode the org risks:

1. **GUT INSTINCT** — leadership decides based on personal interest, not audience need
2. **COPYCAT** — mimics peers, no strategic foundation
3. **VENDOR-PITCHED** — format serves vendor portfolio, not client needs
4. **NO DISTRIBUTION PLAN** — good content, wrong audience reach

### Platform Intelligence Hierarchy

SITREP doesn't treat all platforms equally. It ranks them:

1. Identifies the **primary audience platform** by engagement density (not follower count)
2. Labels secondary channels as obligatory, archive, or dormant
3. Weights the entire analysis toward the primary channel
4. Analyzes comment rhetoric on the primary channel as ground-truth audience intelligence

Example: If an org has 100K Instagram followers with 800 avg likes but 2K YouTube subscribers with dead uploads, the SITREP says "Instagram is the primary audience channel" and frames all recommendations for Instagram-first distribution.

### What Makes SITREP Different From "Just Asking Claude"

Right now, ~85% of the output could be replicated with a well-written prompt. What differentiates SITREP long-term:

- **Structured data with real numbers** — a Reddit comment with 200 upvotes is consensus, not opinion. A Glassdoor rating of 2.8 while the careers page says "best place to work" is a credibility gap. Claude web search gives impressions; structured APIs give receipts.
- **Cross-platform contradiction detection** — do Reddit employee complaints match Glassdoor cons? Does YouTube engagement match Instagram engagement?
- **Comment intelligence** — 20 comments per post on top 5 posts across Instagram, YouTube, and TikTok. Real audience voice, not engagement metrics.
- **Compounding prompt quality** — the synthesis and execute prompts improve with every run.

---

## SITREP Technical Stack

| Component | Technology | Status |
|-----------|-----------|--------|
| Backend | Python + FastAPI on Railway | Live |
| Frontend | HTML/CSS/JS on Vercel | Live |
| Database | Supabase (PostgreSQL) | Live |
| Auth | Supabase Auth (Chris, Ari, Tony) | Live |
| Models | claude-opus-4-6 (full), claude-sonnet-4-6 (supporting) | Live |
| Data sources | Apify (10 actors) + YouTube Data API + Claude web search | Live |

### Frontend
- Dark cinematic UI (Bebas Neue headlines, DM Sans body, DM Mono data readouts)
- Brand orange accent (#D4662A)
- Data source toggle selector (choose which platforms to include per run)
- Library view for past SITREPs with search/filter
- Hero: "Intelligence Starts Here"

### Verticals Supported
Defense & Aerospace, Healthcare, Government, Technology & Manufacturing, Corporate, Nonprofit & NGO, Education, Other

Each vertical has custom framing in the synthesis prompt that shapes how Claude analyzes the competitive/peer landscape.

---

## Sales Machine Status

### What It Does
Autonomous daily agent that discovers qualified organizations, researches them, finds decision-maker contacts, writes personalized cold emails, and pushes them to Instantly CRM for delivery. Chris gets a briefing email each morning.

### Two Campaigns Running

**1. Sales Machine Auto-Send** (signal-based)
- Sources: SAM.gov federal RFPs + Google News (33 keyword queries)
- Signal: recent events (funding, RFPs, leadership changes, initiatives)
- Email template: peer-tone, observation-based hook about a specific gap
- 204 emails sent, 12 bounces (5.9%), 3 real replies

**2. Competitor Intel** (portfolio-based) — NEW as of April 14
- Source: discovers AZ video production competitors, scrapes their portfolios, extracts client organizations
- Signal: org has existing video production budget (worked with a competitor)
- Email template: forward-looking, references their investment in media, pivots to SITREP angle
- Separate Instantly campaign, separate briefing email
- Test run: 153 client opps discovered across 12 competitors, 51 qualified, 2 researched, pushed to campaign

### Bounce Rate Fixes (April 13)
- Reject catch-all (accept_all) domains for pattern-guessed emails
- Skip pattern guessing for .gov/.mil/.edu TLDs
- Strip name suffixes (Jr, Sr, III, PhD) before email pattern generation
- Per-run contact deduplication by (name, domain)
- Replaced broken Gmail IMAP bounce detection with Instantly API (esp_code 999)
- Projected bounce rate: under 1% (was 5.9%)

### Technical
- Single file: unified_agent.py (~2800 lines)
- SQLite database (local)
- Runs via macOS launchd at 7 AM weekdays
- Models: claude-sonnet-4-6 (scoring, news), claude-opus-4-6 (research, outreach)
- APIs: Anthropic, SAM.gov, Hunter.io, Instantly, Gmail SMTP/IMAP

---

## How SITREP and Sales Machine Connect

**Currently:** They don't directly integrate. Sales Machine generates its own research per org. SITREP is a standalone tool.

**The competitor intel campaign bridges them:** the email template mentions SITREP by name ("Worth 20 minutes to see what SITREP finds on {org}?"). This is the first time SITREP is directly referenced in outbound sales.

**Not built yet:**
- Sales Machine auto-running SITREP on discovered orgs
- Shared org database between the two systems
- SITREP as a paid deliverable ($5K-$10K standalone brief)

---

## What SITREP Does for Video Production Projects

This is the key thing the website needs to communicate:

**The problem:** Every production company asks "what do you want to make?" Nobody asks "what should you make?" That question — what story actually needs telling, to whom, through what medium, distributed where — is where wasted production budgets live.

**What SITREP does:**
1. Maps how the world actually sees the organization (social sentiment, reviews, Reddit threads, news coverage, employee perception)
2. Maps how the organization sees itself (website messaging, published content, leadership communications)
3. Identifies the gap between those two views
4. Produces specific recommendations for media that closes the gap

**Why this matters for the client:**
- Their last video might have been beautiful. But was it telling the right story to the right people?
- SITREP answers that before a single dollar is spent on production
- The brief isn't written by a creative director's instinct — it's written by intelligence

**The deliverable chain:**
1. SITREP runs on the org (automated intelligence gathering)
2. Gap analysis identifies what story needs telling
3. That gap becomes the creative brief
4. Production (documentary, video, photography) is built on that brief
5. Distribution strategy is informed by where the audience actually lives (platform hierarchy from SITREP)

---

## Copy Rules (For Website Build)

- Never use "content" — say media, film, video, or story
- Never say "video production company" — say strategic consulting + documentary production
- Never use "solutions"
- Never promise ROI
- Never lead with technology or AI
- Never say a prospect is "failing" — say "communication gap"
- No em dashes in headlines
- "We ARE consultants" not "like consultants"
- Lead with the insight, not the tool

### Locked-In Key Lines
1. "Research. Intelligence. Film."
2. "Every production company asks what you want to make. We show up knowing what you should make."
3. "Most video fails because the story was wrong, not because the production was bad."
4. "You can't tell a true story without first figuring out what's actually true."
5. "We run open source intelligence on your brand before we write a single word of script."

---

## Pricing (Current)

| Tier | Range | Notes |
|------|-------|-------|
| SITREP brief (standalone) | $5K-$10K | Not actively sold yet — tool is internal only |
| Project floor | $15K | Nothing below this |
| Sweet spot | $25K-$150K per project | One-off engagements |
| Retainer | $8K-$20K/month | Ongoing relationship |
| Anchor example | $84,150 | ITCA docu-series through July 2026 |

---

## Case Studies (For Website)

### ITCA (Inter Tribal Council of Arizona) — Flagship
- Three engagements: WIC Nutrition, Tribal Education Center, Voter Engagement
- WIC: enrollment barrier was trust, not awareness. Produced tribal mothers speaking direct to camera.
- TEC: client wanted building tour. Thrill Wave reframed to sovereignty over education.
- Voter Engagement: "Your Voice, Your Power" — 10-part series, in production. $84,150.

### Relentless Beats — Long-term
- Almost a decade. Visual media strategy and live event coverage.
- 104K Instagram followers, 0.91% engagement rate, primary audience platform.

---

## Known Gaps / Not Built Yet

| Item | Status | Impact |
|------|--------|--------|
| Client-facing SITREP mode | Not built | Can't sell SITREP briefs externally until raw output is sanitized |
| PDF export with branding | Not built | SITREPs are markdown-only, no branded deliverable format |
| Sales Machine + SITREP integration | Not built | Auto-running SITREP on discovered orgs |
| Document upload (client RFPs, strategic plans) | Not built | SITREP can't ingest client-provided materials |
| Longitudinal tracking | Not built | Can't diff an org's SITREP across quarters |

---

## Brand Aesthetic (For Website)

- **Palette:** Near-black backgrounds (#07070A to #111114), warm white text (#E8E0D4), accent orange (#FF6B00 or #D4662A)
- **Typography:** IBM Plex Mono (UI/system), Source Serif 4 (headlines/body)
- **Texture:** Film grain (subtle, always present), scanlines (very subtle), ambient radial glows
- **Vibe:** Retro sci-fi, analog warmth, CRT-in-a-dark-room. Military intelligence briefing designed by a film studio.

---

## Audit Notes: What's Stale in Existing Docs

1. **Recon mode** — removed from frontend AND backend. All references cleaned up.
2. **"Technology & Manufacturing" vertical** — renamed to "Technology & Manufacturing" in code. Some docs still say technology.
3. **"Tribal" vertical** — removed as standalone. Tribal orgs fall under Government/Nonprofit.
4. **Model names** — updated to claude-opus-4-6 and claude-sonnet-4-6. Some docs reference older versions.
5. **Glassdoor/Instagram/TikTok** — listed as "planned" in some docs but are now live.
6. **SITREP data sources** — docs say YouTube only. Now 15 sources across 10 Apify actors + YouTube API + 5 Claude web search passes.
7. **Tribal positioning copy** — "Your stories have been told by outsiders for too long" is paternalistic. ITCA chose Thrill Wave for research depth, not narrative reclamation.
