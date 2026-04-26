# China EV News Blog

Automated blog for German car enthusiasts featuring the latest Chinese EV news, translated via MiniMax Claude API.

## Project Structure

```
china-ev-news/
├── config.toml              # Hugo configuration
├── content/
│   ├── posts/               # Markdown articles (auto-generated)
│   │   └── drafts/          # Failed translations saved here
│   ├── about.md
│   ├── impressum.md
│   └── datenschutz.md
├── themes/
│   └── china-ev-blog/       # Custom Hugo theme
├── fetch_translate.py       # Python pipeline (v3)
├── sources.json             # RSS feed configurations
├── requirements.txt         # Python dependencies
├── processed_articles.json  # SHA-256 fingerprints (committed)
├── .runlog.jsonl            # Structured run log (committed)
├── scripts/
│   └── archive/
│       └── deploy-strato.sh  # Archived Strato deploy script
└── .env                     # API keys (not committed)
```

## Daily Workflow

```bash
# 1. Install dependencies (first time)
pip install -r requirements.txt

# 2. Fetch and translate articles
python fetch_translate.py

# 3. Build site
hugo

# 4. Deploy to Vercel (via GitHub Actions)
#    Or locally: vercel --prod
```

## Pipeline Commands

```bash
python fetch_translate.py                  # Daily run
python fetch_translate.py --weekly        # Build weekly Top 5
python fetch_translate.py --rebuild-fingerprints  # Rebuild fingerprints from disk
```

## Configuration

### Environment Variables (.env)
- `ANTHROPIC_API_KEY` — MiniMax Anthropic API key
- `ANTHROPIC_BASE_URL` — API base URL (default: https://api.minimax.io/anthropic/v1)

### RSS Sources
Edit `sources.json` to add/remove feeds. Currently: Chinese sources only (Sina, 太平洋汽车, 网易汽车).

### Giscus Comments
1. Enable GitHub Discussions in repo settings
2. Visit https://giscus.app to get repo details
3. Update `config.toml` with Giscus values

### Vercel Deployment
Configured via GitHub Actions. Secrets needed:
- `ANTHROPIC_API_KEY`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Future Considerations

### Data Visualization
如果需要展示 EV 销量图表、趋势对比等数据可视化：
- **Recharts** — React 图表库，`npm install recharts`
  - GitHub: github.com/recharts/recharts
  - 支持折线图、柱状图、饼图、雷达图等 20+ 类型

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
