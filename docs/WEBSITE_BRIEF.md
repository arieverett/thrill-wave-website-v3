# Website Brief

What the Thrill Wave website needs to do, page by page, informed by how prospects actually arrive.

## The Sales Funnel

```
Cold email lands (Sales Machine)
    →
Prospect is curious → visits thrillwave.com
    →
Website confirms: these people are serious, they do real work, they actually researched me
    →
Prospect replies to the email or books a call
    →
20-minute discovery call (Chris)
    →
Paid SITREP brief ($5K-$10K) → the entry point, not a freebie
    →
SITREP reveals the gap → client sees exactly what story they should tell and why
    →
Production contract ($25K-$300K) → the obvious next step after seeing the SITREP
```

The website sits between "curious" and "replies to the email." Its job is to remove doubt, not to close the sale. The email already did the hard part — it showed the prospect something specific about their org. The website just needs to prove Thrill Wave is the real deal.

## What the Prospect Already Knows (From the Email)

- Someone at Thrill Wave identified a specific gap in their communications
- That person is Chris Kuzman
- Thrill Wave researches where the story's falling short, then builds the media that fixes it
- thrillwave.com exists

## What the Prospect Needs to Learn (From the Website)

- What Thrill Wave actually produces (documentary, video, photography — not "content")
- How the process works (research first, then film)
- What SITREP is and why it matters
- What it looks like when Thrill Wave does this for a real org
- That there's a clear next step (call, not a form submission into the void)

## What the Prospect Should NOT Experience

- A generic agency site with stock photos and buzzwords
- A tone shift from the email (email is peer-to-peer, website can't become a brochure)
- A wall of text before seeing any work
- "Schedule a demo" or "request a proposal" language — this isn't SaaS
- Any mention of AI as the headline. The intelligence layer is a capability, not the sell.

---

## Page Structure

### Page 1: Homepage (index.html)

**Job:** Confirm the email's promise. Show, don't explain.

**Above the fold:**
- One line that captures the thesis. Not a tagline — a statement.
  - "Every production company asks what you want to make. We show up knowing what you should make."
  - Or: "Most video fails because the story was wrong, not because the production was bad."
- Real work. A reel, a hero shot, something that proves production craft immediately. No stock. No illustrations.

**Below the fold, in order:**

1. **The problem** (2-3 sentences max). Organizations spend money on video that doesn't move anyone because nobody did the homework first. The story was wrong before the camera turned on.

2. **The three pillars** — Research. Intelligence. Film. One sentence each, max. Don't over-explain. Let it breathe.

3. **Work samples** — 3-4 pieces. Real frames, real projects. Each one: client name (if allowed), one sentence about what the SITREP revealed, one sentence about what was produced. Show the connection between research and output.

4. **SITREP teaser** — Not the full methodology. Just enough to make them want to know more. "Before we touch a camera, we run intelligence on your brand. What the public internet says about you, what your audience actually thinks, where the gap is. That gap becomes the brief." Link to the SITREP page.

5. **Client logos or names** — if permissions allow. Even a line like "We've worked with ITCA, Relentless Beats, State Farm, Boston Scientific, Golf Digest, and others."

6. **CTA** — "Worth 20 minutes?" with Chris's email and phone. Same language as the email. Not "schedule a consultation" or "get started." Keep the peer tone.

### Page 2: SITREP (sitrep.html)

**Job:** Explain the mechanism. Make the prospect want their own SITREP.

The email showed them a taste of what SITREP thinking looks like (we found a gap in YOUR org). This page explains the full version.

**Structure:**

1. **The hook** — "You just saw what we found about your organization from the outside. Imagine what a full SITREP looks like." (Or similar — the point is to connect the email experience to this page.)

2. **What SITREP is** — A pre-production intelligence brief. Two layers:
   - Layer 1 (External): What the public internet says about you. Social sentiment, search behavior, competitor positioning, reviews, forums, news coverage. Systematic, not anecdotal.
   - Layer 2 (Internal): What you know about yourself that isn't public. Under NDA. Stakeholder interviews, strategic docs, institutional knowledge.
   - The gap between external perception and internal reality = the brief.

3. **The four failure modes** — Frame as "why most video fails." Gut Instinct, Copycat, Vendor-Pitched, No Distribution Plan. One sentence each. The prospect should recognize at least one.

4. **What you get** — The three deliverables:
   - Intelligence Brief (the landscape)
   - Story Recommendation (what to make and why)
   - Production + Distribution Plan (how to make it land)

5. **The ITCA case study** — Walk through one real example. What the SITREP revealed that changed the creative direction. WIC is the strongest one: "They needed enrollment. We found a trust barrier nobody was talking about. That changed everything about what we produced."

6. **Pricing framing** — Don't hide it. "$5K-$10K for the intelligence brief. If we move to production, it folds into the project." Confidence, not caginess.

7. **CTA** — Same as homepage. Chris's direct line. "Let's talk."

---

## Tone Rules for the Entire Site

- Match the email. Peer-to-peer. Confident. Specific. Not corporate.
- Short paragraphs. One idea per paragraph.
- No jargon unless it's SITREP (which you're explaining).
- Never say "content." Say media, film, video, or story.
- Never say "we help organizations" — say what you actually do.
- Don't describe Thrill Wave. Show the work and let it speak.
- The word "solutions" should not appear anywhere on this website.

## Design Direction

Retro sci-fi meets analog warmth. CRT-in-a-dark-room feeling.

- Near-black backgrounds (#07070A to #111114)
- Orange accent (#FF6B00) — VCR power indicator amber
- Warm white text (#E8E0D4) — never cold blue-white
- IBM Plex Mono for UI/system elements (technical precision)
- Source Serif 4 for headlines and body copy (human warmth)
- Film grain overlay, subtle scanlines, ambient radial glows
- Top of page = analytical and precise. Bottom of page = warm and human.

Design references: Anduril, Shield AI (defense tech aesthetic applied to creative).

## Technical

- Custom static HTML/CSS/JS — no CMS, no build step
- GitHub + Netlify deployment
- staging.thrillwave.com keeps current site live during development
- Two pages at launch: index.html + sitrep.html
- Mobile-first. These emails get opened on phones.
