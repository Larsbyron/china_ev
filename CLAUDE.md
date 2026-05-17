# China EV News Blog

Automated blog for German car enthusiasts featuring the latest Chinese EV news, translated via MiniMax Claude API.

**Live:** [china-autonews.de](https://china-autonews.de)

## Tech Stack

- **Framework:** Next.js 15 (Static Export, `output: 'export'`)
- **Styling:** CSS Modules + CSS Custom Properties, dark-first theme
- **Charts:** Recharts (client-side only)
- **Search:** Pagefind (post-build indexing)
- **Comments:** Giscus (GitHub Discussions)
- **Hosting:** Vercel (auto-deploy from main)
- **Tests:** Vitest (100 tests)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── articles/           # Article listing + [slug] detail pages
│   ├── brands/             # Brand overview
│   ├── daten/              # EV data with Recharts
│   ├── suche/              # Pagefind search
│   ├── vergleich/          # EV comparison tool
│   ├── weekly/             # Weekly top 5
│   ├── about/              # About page
│   ├── impressum/          # Legal (TMG)
│   └── datenschutz/        # Privacy (GDPR)
├── components/             # React components
│   ├── charts/             # Recharts visualizations
│   └── comparison/         # Comparison tool
├── lib/                    # Utilities, scraper, markdown
└── data/                   # ev-specs.json
scripts/
├── generate-rss.ts         # RSS feed generation
└── translate-existing.ts   # Batch translation
```

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build (+ Pagefind + RSS)
npm test             # Run 100 tests
npm run lint         # ESLint
```

## Configuration

### Environment Variables
- `ANTHROPIC_API_KEY` — MiniMax Anthropic API key
- `ANTHROPIC_BASE_URL` — API base URL

### Giscus Comments
1. Enable GitHub Discussions in repo settings
2. Visit https://giscus.app to get repo details
3. Configure GiscusComments.tsx

### Vercel
- Auto-deploys from `main` on push
- `outputDirectory: "out"` in vercel.json
- Deployment Protection must be disabled for public access

## Web Scraping Routing (via Scrapling MCP)

When any scraping, data extraction, or content fetching task is requested, prefer
Scrapling MCP tools (`mcp__scrapling__*`) over raw `requests`/`curl`. The MCP
server provides TLS fingerprinting, anti-bot bypass (Cloudflare Turnstile), and
CSS-selector-based content narrowing that saves tokens.

### Route by task type

| Task | Tool | Key Options |
|------|------|-------------|
| Static page, fast fetch | `mcp__scrapling__get` | `main_content_only=true`, `extraction_type="markdown"` |
| Multiple static URLs | `mcp__scrapling__bulk_get` | Same as above, concurrent |
| JS-rendered / SPA | `mcp__scrapling__fetch` | `network_idle=true`, `wait_selector="..."` |
| Multiple dynamic URLs | `mcp__scrapling__bulk_fetch` | Concurrent tabs |
| Cloudflare / anti-bot | `mcp__scrapling__stealthy_fetch` | `headless=false` for visible browser |
| Multiple protected URLs | `mcp__scrapling__bulk_stealthy_fetch` | Concurrent stealth tabs |
| Multi-step workflow | `open_session` → `fetch`/`stealthy_fetch` → `close_session` | Reuse browser across requests |
| Screenshot | `open_session` → `mcp__scrapling__screenshot` | `full_page=true`, `image_type="jpeg"` |

### Source-specific patterns

- **CnEVPost** — static, `get` is sufficient, use `main_content_only=true`
- **Electrek** — static, `get` with selector `.post-content`
- **Sina Auto** — Chinese encoding, use `get` with selector `#artibody`
- **PCauto / Autohome** — may need JS rendering, try `get` first, escalate to `fetch` if empty

### CSS selectors for targeted extraction (saves tokens)

```
# CnEVPost article body
get https://cnevpost.com/2026/... → main_content_only=true

# Electrek article body  
get https://electrek.co/2026/... → main_content_only=true

# Sina article body
get https://auto.sina.com.cn/... → main_content_only=true
```

### Integration with fetch_translate.py

The `fetch_full_article()` function in `fetch_translate.py` can be called via Scrapling MCP
when doing ad-hoc extraction, but the Python script remains authoritative for the automated
CI pipeline (GitHub Actions can't use MCP). For one-off scraping and debugging, prefer the
MCP tools — they handle anti-bot escalation automatically.

### Fallback

If Scrapling MCP fails (rate limiting, connection issues), fall back to:
1. `WebFetch` for simple content extraction
2. `python3 fetch_full_scrapling.py <url>` for local Scrapling Selector usage
3. Raw `curl` / `requests` (last resort)

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. The
skill has multi-step workflows, checklists, and quality gates that produce better
results than an ad-hoc answer. When in doubt, invoke the skill. A false positive is
cheaper than a false negative.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke /office-hours
- Strategy, scope, "think bigger", "what should we build" → invoke /plan-ceo-review
- Architecture, "does this design make sense" → invoke /plan-eng-review
- Design system, brand, "how should this look" → invoke /design-consultation
- Design review of a plan → invoke /plan-design-review
- Developer experience of a plan → invoke /plan-devex-review
- "Review everything", full review pipeline → invoke /autoplan
- Bugs, errors, "why is this broken", "wtf", "this doesn't work" → invoke /investigate
- Test the site, find bugs, "does this work" → invoke /qa (or /qa-only for report only)
- Code review, check the diff, "look at my changes" → invoke /review
- Visual polish, design audit, "this looks off" → invoke /design-review
- Developer experience audit, try onboarding → invoke /devex-review
- Ship, deploy, create a PR, "send it" → invoke /ship
- Merge + deploy + verify → invoke /land-and-deploy
- Configure deployment → invoke /setup-deploy
- Post-deploy monitoring → invoke /canary
- Update docs after shipping → invoke /document-release
- Weekly retro, "how'd we do" → invoke /retro
- Second opinion, codex review → invoke /codex
- Safety mode, careful mode, lock it down → invoke /careful or /guard
- Restrict edits to a directory → invoke /freeze or /unfreeze
- Upgrade gstack → invoke /gstack-upgrade
- Save progress, "save my work" → invoke /context-save
- Resume, restore, "where was I" → invoke /context-restore
- Security audit, OWASP, "is this secure" → invoke /cso
- Make a PDF, document, publication → invoke /make-pdf
- Launch real browser for QA → invoke /open-gstack-browser
- Import cookies for authenticated testing → invoke /setup-browser-cookies
- Performance regression, page speed, benchmarks → invoke /benchmark
- Review what gstack has learned → invoke /learn
- Tune question sensitivity → invoke /plan-tune
- Code quality dashboard → invoke /health
