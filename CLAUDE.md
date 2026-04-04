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
