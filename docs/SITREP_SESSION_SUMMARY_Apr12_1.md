# SITREP Prototype — Session Summary
*April 12, 2026 · Handoff to Cowork*

---

## What Was Built Today

The SITREP prototype is live. Backend deployed on Railway, frontend functional, first test runs completed.

### Architecture
- **Backend:** Python + FastAPI, deployed on Railway at `https://sitrep-production-e8f1.up.railway.app`
- **Frontend:** Deployed (platform TBD — Vercel account created, not yet connected)
- **Database:** Supabase (free tier) — stores SITREPs, org history. Table created via SQL Editor with fuzzy org search and RLS enabled.
- **AI Engine:** Claude API — Sonnet for Recon mode, Opus for Full SITREP mode
- **Auth:** Supabase Auth (email/password) — Chris, Ari, Tony accounts

### Railway Config
- Root directory set to `backend`
- `/api/health` returns `{"status": "ok"}`
- Environment variables: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

### Supabase Config
- Project: "ckuzman's Project" under "Thrill Wave" org
- API keys page: Settings → API Keys (new format: `sb_publishable_...` and `sb_secret_...`)
- Schema created via SQL Editor ("SITREPs storage with fuzzy org search and RLS")

### Local Repo
- Location: `/Users/chriskuzman/sitrep/`
- Structure: `backend/` (Python engine + FastAPI) and `frontend/`
- GitHub repo: `sitrep` (connected to Railway)
- Spec file: `SPEC.md` in repo root

---

## Test Runs Completed

### Run 1: Relentless Beats (Recon) — FAILED
- Ingest phase web search returned no usable data
- Engine still produced output by reasoning from the context flag alone
- Claude Code fixed the search query logic

### Run 2: Relentless Beats (Recon) — SUCCEEDED
- Full research data pulled: revenue ($3.8M), employee count (43→135), Glassdoor reviews, social metrics, event names, founder history
- Caught the gap between "family" messaging and toxic Glassdoor reviews — cross-referenced from separate research passes
- Failure Mode Assessment correctly identified Vendor-Pitched as primary risk
- Recommended productions ("Breaking the Underground" feature doc, "The Real Builders" testimonial series) are pitchable concepts
- **Key gap:** Tool doesn't know Relentless Beats is an existing 8-year client. No way to input institutional knowledge yet.

---

## Key Design Decisions

### SITREP vs Sales Machine — Clean Separation
- **SITREP** = "We have an org in front of us. What video should they make and why?"
- **Sales Machine** = "Who should we be talking to, and what do we say to get in the room?"
- Different tools, different data needs. Some data sources serve both but belong primarily to one.

### Honest Assessment: SITREP vs a Good Prompt
Right now, ~85-90% of the output could be replicated with a well-written prompt in Claude.ai with web search. What the tool adds today:
- Repeatability without re-typing
- Shared access (Ari/Tony can run SITREPs)
- Library of past SITREPs (searchable, persistent)
- Consistent output format

What makes it worth the infrastructure long-term:
- Memory (knowing org is an existing client)
- Batch runs (30 orgs overnight)
- Sales Machine integration (auto-Recon on every researched org)
- Prompt improvements compound across all future runs
- Data sources that Claude can't access through web search

### What Actually Differentiates It From a Prompt
The SITREP tool runs multi-step research (5+ separate queries targeting different angles), then cross-references results in a second Claude call. That two-phase approach is why it caught both the "family" messaging AND the Glassdoor reality — those were separate research queries synthesized together. A single prompt gets one pass.

---

## Data Sources — What Belongs Where

### SITREP Tool (content, messaging, audience, gaps)
- **YouTube Data API** ← IN PROGRESS (API key being created now)
- **Instagram/TikTok APIs** — complete the content audit across platforms
- **Document upload** — read their RFP, strategic plan, annual report
- **SEC EDGAR** — their own words about priorities and risks from filings
- **News API** (partial) — context on what's happening at the org

### Sales Machine (who to target, when, what to say)
- **USAspending.gov** — who has production budgets, when contracts expire
- **LinkedIn company data** — timing signals (new hires, leadership changes)
- **News API** (partial) — warm signals for outreach
- **Conference Prospector** — speaker lists from industry events

### Build Order for SITREP Augmentation
1. **YouTube Data API** — biggest bang, free, directly upgrades content audit (IN PROGRESS)
2. **Document upload** — zero cost, transforms output when available
3. **Instagram/TikTok APIs** — completes content audit picture
4. **SEC EDGAR** — free, rich data for corporate clients

---

## YouTube API — Current Status

- Google Cloud project created ("My First Project" under thrillwave.com org)
- YouTube Data API v3 enabled
- Credential type: **Public data** selected (not User data)
- **Next step:** Copy the API key, add `YOUTUBE_API_KEY` to Railway environment variables

### Claude Code Prompt to Wire It In
> "Read SPEC.md. In the Ingest phase (ingest.py), add a YouTube research step. Using the YouTube Data API v3, search for the org's official channel, then pull: channel subscriber count, total video count, last 20 video titles with view counts and publish dates, average views per video. Return this as structured data in the ingest output so the Synthesize phase can reference it. The API key is in the environment variable YOUTUBE_API_KEY."

---

## OSINT Context

Traditional OSINT tools (Maltego, SL Crimewall, Recorded Future) are collection-heavy, analysis-light. They pull from 500+ sources including dark web, corporate records, social media APIs. But the expensive part was always the human analyst doing the synthesis.

Claude replaces the analyst layer — the pattern recognition, gap analysis, and "so what does this mean" reasoning. The SITREP tool becomes best-in-class when it combines Claude's synthesis with the data access those traditional tools have.

Relevant data sources that would make the SITREP output genuinely impossible to replicate with a prompt:
- YouTube API (real content audit with actual metrics)
- Document ingestion (reading their actual strategic plans, RFPs, annual reports)
- Longitudinal tracking (diff the same org across quarters)
- Multi-org comparison (run 3 orgs in same vertical, find the gap no one's filling)

---

## Outstanding Issues

1. **Frontend deployment on Vercel** — account created, not yet connected to GitHub repo
2. **No institutional knowledge layer** — tool doesn't know which orgs are existing clients or what Thrill Wave already knows about them
3. **Tone calibration** — Glassdoor/culture critique in Relentless Beats output would nuke a client relationship if shared. Need a "client-facing" sanitized version before this goes external.
4. **YouTube API key** — needs to be copied from Google Cloud Console and added to Railway env vars
5. **PDF export** — attempted in this chat but reportlab dark-background approach rendered empty. White-background version generated successfully but needs design refinement. PDF export should ultimately be a one-click button in the web UI.

---

## Files From This Session

- **SITREP_PROTOTYPE_SPEC.md** — full build spec (web-accessible architecture version)
- **SITREP_Relentless_Beats.pdf** — PDF export of second test run (white background version)
- **Relentless Beats SITREP output** — full markdown pasted in chat (the successful run)

---

## Key Accounts & URLs

| Service | URL | Notes |
|---------|-----|-------|
| Railway | railway.app | Backend deployed, `backend` root directory |
| Backend API | `https://sitrep-production-e8f1.up.railway.app` | `/api/health` returns OK |
| Supabase | supabase.com | "Thrill Wave" org, "ckuzman's Project" |
| Vercel | vercel.com | Account created, not yet connected |
| Google Cloud | console.cloud.google.com | "My First Project", YouTube Data API v3 enabled |
| Local repo | `/Users/chriskuzman/sitrep/` | GitHub: `sitrep` |

---

*Thrill Wave LLC · April 12, 2026*
