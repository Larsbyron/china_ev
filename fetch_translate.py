#!/usr/bin/env python3
"""
China EV News Pipeline v2
Fetches RSS feeds, filters for relevant content, translates to German via Qwen API
"""

import os
import sys
import json
import feedparser
import requests
import re
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import hashlib
import time
import html

# Load environment variables
load_dotenv()

# Configuration
ALIYUN_API_KEY = os.getenv("ALIYUN_API_KEY")
ALIYUN_REGION = os.getenv("ALIYUN_REGION", "eu-central-1")
QWEN_BASE_URL = os.getenv("QWEN_BASE_URL", "https://coding-intl.dashscope.aliyuncs.com/v1")
CONTENT_DIR = Path("content/posts")
SOURCES_FILE = Path("sources.json")

# Qwen API endpoint
QWEN_API_URL = f"{QWEN_BASE_URL}/chat/completions"


def load_sources():
    """Load RSS source configurations"""
    with open(SOURCES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_rss_feed(source_url):
    """Fetch and parse RSS feed with error handling"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(source_url, headers=headers, timeout=30)
        response.raise_for_status()
        feed = feedparser.parse(response.content)
        if feed.bozo and not feed.entries:
            return []
        return feed.entries[:15]
    except Exception as e:
        print(f"  [ERROR] Failed to fetch {source_url}: {e}")
        return []


def is_relevant_article(entry, filter_keywords=None):
    """Check if article contains relevant keywords"""
    if not filter_keywords:
        return True
    text = ""
    if hasattr(entry, 'title'):
        text += entry.title.lower()
    if hasattr(entry, 'summary'):
        text += " " + entry.summary.lower()
    if hasattr(entry, 'description'):
        text += " " + entry.description.lower()
    if hasattr(entry, 'content'):
        for c in entry.content:
            if hasattr(c, 'value'):
                text += " " + c.value.lower()
    for keyword in filter_keywords:
        if keyword.lower() in text:
            return True
    return False


def extract_article_content(entry):
    """Extract content from RSS entry"""
    content = ""
    if hasattr(entry, 'content') and entry.content:
        content = entry.content[0].value if hasattr(entry.content[0], 'value') else str(entry.content[0])
    elif hasattr(entry, 'summary'):
        content = entry.summary
    elif hasattr(entry, 'description'):
        content = entry.description
    content = re.sub(r'<[^>]+>', '', content)
    content = re.sub(r'\s+', ' ', content)
    content = html.unescape(content)
    content = content.strip()
    return content[:4000]


def translate_with_qwen(text, target_lang="Deutsch"):
    """Translate text using Qwen API"""
    if not ALIYUN_API_KEY:
        print("  [ERROR] ALIYUN_API_KEY not set")
        return None

    prompt = f"""Übersetze den folgenden Text ins Deutsche准确翻译成德语。
Erhalte die Struktur und Formatierung wenn möglich.
Gebe nur die Übersetzung aus, ohne Erklärungen.

Text:
{text}

Deutsche Übersetzung:"""

    headers = {
        "Authorization": f"Bearer {ALIYUN_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "qwen3.5-plus",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 2500,
        "temperature": 0.3
    }

    try:
        response = requests.post(QWEN_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"].strip()
        return None
    except Exception as e:
        print(f"  [ERROR] Translation failed: {e}")
        return None


def generate_slug(title, source_key):
    """Generate unique slug for article"""
    hash_suffix = hashlib.md5(title.encode()).hexdigest()[:6]
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    return f"{slug[:50]}-{source_key}-{hash_suffix}"


def save_markdown(article, translated_title, translated_content, source_name, original_url=""):
    """Save article as Markdown file"""
    slug = generate_slug(article.get('title', translated_title), source_name.lower().replace(' ', ''))
    date = datetime.now().strftime("%Y-%m-%d")
    filename = CONTENT_DIR / f"{date}-{slug}.md"

    tags = []
    if hasattr(article, 'tags'):
        for tag in article.tags[:5]:
            if hasattr(tag, 'term'):
                tags.append(tag.term)

    frontmatter = f'''---
title: "{translated_title}"
date: {datetime.now().isoformat()}
description: "{translated_content[:200]}..."
source: "{source_name}"
category: "news"
tag: "E-Auto"
tags: [{', '.join(f'"{t}"' for t in tags[:5])}]
draft: false
original_url: "{original_url}"
---

# {translated_title}

{translated_content}

---
*Quelle: {source_name}*
'''

    with open(filename, "w", encoding="utf-8") as f:
        f.write(frontmatter)

    print(f"  [OK] Saved: {filename.name}")
    return filename


def process_source(source):
    """Process a single RSS source"""
    print(f"\n📥 Processing: {source['name']}")
    entries = fetch_rss_feed(source['url'])
    print(f"  Found {len(entries)} articles")
    if not entries:
        return 0

    filter_keywords = source.get('filter_keywords', [])
    if filter_keywords:
        entries = [e for e in entries if is_relevant_article(e, filter_keywords)]
        print(f"  Filtered to {len(entries)} relevant articles")

    if not entries:
        print(f"  [SKIP] No relevant articles found")
        return 0

    saved_count = 0
    for i, entry in enumerate(entries[:source.get('max_articles', 5)]):
        try:
            title = entry.get('title', 'Ohne Titel')
            content = extract_article_content(entry)
            link = entry.get('link', '')

            if not content or len(content) < 50:
                continue

            print(f"  Translating [{i+1}/{min(len(entries), 5)}]: {title[:40]}...")

            translated_title = translate_with_qwen(title)
            if not translated_title:
                translated_title = f"[FEHLER] {title[:80]}"

            time.sleep(0.3)

            translated_content = translate_with_qwen(content)
            if not translated_content:
                translated_content = f"[Übersetzung fehlgeschlagen]"

            save_markdown(entry, translated_title, translated_content, source['name'], link)
            saved_count += 1
            time.sleep(0.3)

        except Exception as e:
            print(f"  [ERROR] {e}")
            continue

    print(f"✅ {saved_count} articles from {source['name']}")
    return saved_count


def main():
    print("=" * 60)
    print("🇨🇳 China EV News Pipeline — DE Edition v2")
    print("=" * 60)

    if not ALIYUN_API_KEY:
        print("\n❌ ERROR: ALIYUN_API_KEY not set!")
        print("   Get your API key from: https://dashscope.console.aliyun.com/")
        sys.exit(1)

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    config = load_sources()
    sources = config.get('sources', [])

    # Chinese and Western sources are now co-primary (no fallback-only logic)
    chinese_sources = [s for s in sources if s.get('category') == 'news' and s.get('source_key') in ('sina', 'pconline', '163')]
    western_sources = [s for s in sources if s not in chinese_sources]

    print(f"\n📡 Loaded {len(chinese_sources)} Chinese + {len(western_sources)} Western sources")

    total = 0
    for source in sources:
        total += process_source(source)

    print("\n" + "=" * 60)
    print(f"✅ Complete! {total} articles")
    print(f"📁 Files: {CONTENT_DIR}/")
    print("=" * 60)
    print("\n📋 Next: hugo && ./deploy.sh")


if __name__ == "__main__":
    main()
