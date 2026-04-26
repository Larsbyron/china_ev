# China EV News Blog

Automated blog for German car enthusiasts featuring the latest Chinese EV news, translated via MiniMax Claude API.

**Live:** [chinaev.vercel.app](https://chinaev.vercel.app)

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
