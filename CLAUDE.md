# Thrill Wave — Claude Code Project Instructions

## API Cost Discipline

Every Claude Code session costs real money. These rules apply to all Thrill Wave builds — SITREP, Sales Machine, website, and anything new.

### During Claude Code Sessions

- **Use `/compact` between tasks.** When a task is done and you're moving to the next topic, compact the conversation. Long sessions accumulate massive context that gets re-read (and re-billed) on every turn.
- **Use Sonnet for routine work.** Toggle `/model sonnet` for mechanical tasks: renaming, adding fields, updating lists, writing CSS, copy changes. Switch back to Opus for architecture decisions, debugging complex multi-file issues, or anything that requires deep judgment across a large codebase.
- **Start fresh sessions for unrelated work.** Don't continue a SITREP debugging session to start website styling. The old context is dead weight.
- **Don't ask Claude to re-read files it already has in context.** If it just read a file 5 turns ago, it still has it.

### When Writing Code That Makes API Calls

These rules apply to any code that calls the Anthropic API (Sales Machine, SITREP backend, future tools):

- **Use prompt caching on all API calls.** Static instructions, agency profiles, output format templates — anything that doesn't change between calls goes in a `system` prompt with `cache_control: {"type": "ephemeral"}`. Build the cached system prompt once outside loops, pass it into repeated calls.
- **Use the cheapest model that doesn't lose quality.** Sonnet for structured tasks with clear prompts (scoring, classification, data extraction, email generation). Opus only when synthesis quality measurably suffers on Sonnet.
- **Don't duplicate API calls.** If two pipeline steps need the same data, fetch it once and pass it through. Don't call Claude twice to get the same information in different formats.
- **Batch where possible.** Score 20 items per call, not 1. Generate email variables for all contacts at an org in one call, not per-contact.
- **Add timeouts to all API clients.** `timeout=120.0` minimum. A hung API call with no timeout blocks the pipeline and wastes money when it's eventually killed and retried.
- **Web search calls are expensive.** Each `web_search_20250305` invocation triggers multiple searches billed as tokens. Consolidate queries, avoid redundant searches, and don't run web search pipelines more often than the data actually changes.

### What NOT to Do

- Don't switch to Haiku for tasks where quality matters. Bad scoring loses leads silently. Bad email copy damages the brand. The savings aren't worth it.
- Don't skip API calls to save money if it removes capability. Cost reduction should come from efficiency (caching, batching, deduplication), not from doing less.
- Don't over-engineer cost optimization. If a change saves $0.10/day but adds complexity, skip it.
