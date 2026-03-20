# China EV News Blog

Automated blog for German car enthusiasts featuring the latest Chinese EV news, translated via AI (Qwen/Aliyun).

## Project Structure

```
china-ev-news/
├── config.toml              # Hugo configuration
├── content/
│   ├── posts/               # Markdown articles (auto-generated)
│   ├── about.md
│   ├── impressum.md
│   └── datenschutz.md
├── themes/
│   └── china-ev-blog/       # Custom Hugo theme
├── fetch_translate.py       # Python pipeline
├── sources.json             # RSS feed configurations
├── requirements.txt          # Python dependencies
├── deploy.sh                # Strato deployment script
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

# 4. Deploy to Strato
./deploy.sh
```

## Configuration

### Environment Variables (.env)
- `ALIYUN_API_KEY` — Aliyun Qwen API key
- `ALIYUN_REGION` — Region (default: eu-central-1)
- `QWEN_BASE_URL` — API base URL

### RSS Sources
Edit `sources.json` to add/remove feeds.

### Giscus Comments
1. Enable GitHub Discussions in repo settings
2. Visit https://giscus.app to get repo details
3. Update `config.toml` with Giscus values

### Strato Deployment
Edit `deploy.sh` with your Strato credentials.
