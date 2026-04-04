# TODO: Address QA Findings — 2026-04-03

Generated from QA report: 7 issues found, health score 68/100.

## Context

Recent reliability sprint completed (dedup, draft mode, weekly Top 5, runlog). QA run on 2026-04-03 against live site https://www.china-ev.de/ revealed:

- CRITICAL: SSL certificate mismatch (www vs non-www)
- HIGH: Giscus comments not configured
- HIGH: URL mismatch (baseURL=china-ev.de, live=www.china-ev.de)
- HIGH: Content-brand mismatch (Western EV news, not Chinese EVs)
- MEDIUM: Search not functional
- MEDIUM: Pagination missing "Previous" link
- LOW: Social links broken

## Todo Items

### P0 — Critical
1. **Fix SSL certificate / URL redirect** — Decide www vs non-www canonical, configure Strato redirect/cert
2. **Fix baseURL in config.toml** — Match the canonical domain chosen above

### P1 — High
3. **Configure Giscus comments** — Visit giscus.app, get repo params, fill config.toml
4. **Fix content-brand mismatch** — Update sources.json to prioritize Chinese EV sources; filter Western sources more aggressively
5. **Fix URL redirect** — Ensure one version redirects to the other properly

### P2 — Medium
6. **Add search** — Integrate Pagefind or Fuse.js for static search
7. **Fix pagination** — Add "← Previous" link in Hugo templates

### P3 — Low
8. **Fix social links** — Fill in actual Twitter/YouTube links in theme footer

## Status
- No code written yet
- Waiting for /autoplan review before proceeding
