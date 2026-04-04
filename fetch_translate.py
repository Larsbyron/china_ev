#!/usr/bin/env python3
"""
China EV News Pipeline v3
Fetches RSS feeds, filters for relevant content, translates to German via MiniMax Claude proxy.
Supports deduplication, draft mode, weekly Top 5 curation, and structured run logging.
"""

import os
import sys
import json
import feedparser
import requests
import re
import argparse
import hashlib
import time
import html
import unicodedata
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY") or os.getenv("ALIYUN_API_KEY")
ANTHROPIC_BASE_URL = "https://api.minimax.io/anthropic/v1"
CONTENT_DIR = Path("content/posts")
DRAFTS_DIR = Path("content/posts/drafts")
SOURCES_FILE = Path("sources.json")
FINGERPRINT_FILE = Path("processed_articles.json")
RUNLOG_FILE = Path(".runlog.jsonl")


def load_sources():
    """Load RSS source configurations"""
    with open(SOURCES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_fingerprints():
    """Load processed article fingerprints from disk"""
    if not FINGERPRINT_FILE.exists():
        return {}
    try:
        with open(FINGERPRINT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}


def save_fingerprints(fingerprints):
    """Save processed article fingerprints to disk"""
    with open(FINGERPRINT_FILE, "w", encoding="utf-8") as f:
        json.dump(fingerprints, f, indent=2, ensure_ascii=False)


def normalize_for_hash(text):
    """Normalize article text for SHA-256 fingerprinting"""
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # NFKD Unicode normalization
    text = unicodedata.normalize('NFKD', text)
    # Lowercase
    text = text.lower()
    # Trim leading/trailing whitespace
    text = text.strip()
    # Collapse internal whitespace to single space
    text = re.sub(r'\s+', ' ', text)
    return text


def compute_fingerprint(text):
    """Compute SHA-256 fingerprint of normalized text"""
    normalized = normalize_for_hash(text)
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def log_run(entry, action, translation_ok=True):
    """Append a structured log entry to runlog.jsonl"""
    log_entry = {
        "ts": datetime.now().isoformat(),
        "source": entry.get("source_key", "unknown"),
        "title": entry.get("title", "")[:100],
        "action": action,
        "translation_ok": translation_ok
    }
    try:
        with open(RUNLOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except IOError:
        pass  # Non-fatal


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


def extract_article_image(entry):
    """Extract the first image URL from RSS entry HTML"""
    html_content = ""
    if hasattr(entry, 'content') and entry.content:
        html_content = entry.content[0].value if hasattr(entry.content[0], 'value') else str(entry.content[0])
    elif hasattr(entry, 'summary'):
        html_content = entry.summary
    elif hasattr(entry, 'description'):
        html_content = entry.description

    # Look for <img src="..."> pattern
    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
    if img_match:
        return img_match.group(1)
    return ""


def translate_with_qwen(text, target_lang="Deutsch"):
    """Translate text using MiniMax Claude proxy with retry and backoff"""
    if not ANTHROPIC_API_KEY:
        print("  [ERROR] ANTHROPIC_API_KEY not set")
        return None

    prompt = f"""Übersetze den folgenden Text准确翻译成德语 ins Deutsche.
Erhalte die Struktur und Formatierung wenn möglich.
Gebe nur die Übersetzung aus, ohne Erklärungen.

Text:
{text}

Deutsche Übersetzung:"""

    headers = {
        "Authorization": f"Bearer {ANTHROPIC_API_KEY}",
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }

    payload = {
        "model": "MiniMax-M2.7",
        "max_tokens": 2500,
        "temperature": 0.3,
        "messages": [{"role": "user", "content": prompt}]
    }

    for attempt in range(2):
        try:
            response = requests.post(f"{ANTHROPIC_BASE_URL}/messages", headers=headers, json=payload, timeout=60)

            # Explicit 429 handling with backoff
            if response.status_code == 429:
                if attempt == 0:
                    print(f"  [WARN] Rate limited, retrying in 5s...")
                    time.sleep(5)
                    continue
                else:
                    print(f"  [ERROR] Rate limited after retry")
                    return None

            response.raise_for_status()
            result = response.json()
            if "content" in result and len(result["content"]) > 0:
                for block in result["content"]:
                    if block.get("type") == "text":
                        text_result = block["text"].strip()
                        if not text_result:
                            print(f"  [WARN] Empty translation response")
                            return None
                        return text_result
                print(f"  [WARN] No text block in response")
                return None
            print(f"  [WARN] Empty content in response")
            return None
        except requests.exceptions.HTTPError as e:
            if attempt == 0:
                time.sleep(2)
                continue
            print(f"  [ERROR] HTTP error after retry: {e}")
            return None
        except Exception as e:
            print(f"  [ERROR] Translation failed: {e}")
            return None
    return None


def generate_slug(title, source_key):
    """Generate unique slug for article"""
    hash_suffix = hashlib.md5(title.encode()).hexdigest()[:6]
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    return f"{slug[:50]}-{source_key}-{hash_suffix}"


def save_markdown(article, translated_title, translated_content, source_name, original_url="", draft=False, image_url=""):
    """Save article as Markdown file"""
    slug = generate_slug(article.get('title', translated_title), source_name.lower().replace(' ', ''))
    date = datetime.now().strftime("%Y-%m-%d")

    target_dir = DRAFTS_DIR if draft else CONTENT_DIR
    target_dir.mkdir(parents=True, exist_ok=True)
    filename = target_dir / f"{date}-{slug}.md"

    tags = []
    if hasattr(article, 'tags'):
        for tag in article.tags[:5]:
            if hasattr(tag, 'term'):
                tags.append(tag.term)

    # Strip double quotes from description to prevent YAML frontmatter breakage
    safe_title = translated_title.replace('"', "'")
    safe_source = source_name.replace('"', "'")
    safe_content_preview = (translated_content[:200].replace('"', "'").replace('\n', ' ') if translated_content else "").replace('"', "'")
    safe_tags = [t.replace('"', "'") for t in tags[:5]]
    tags_line = ', '.join(f'"{t}"' for t in safe_tags)
    image_line = f'\nimage: "{image_url}"' if image_url else ''

    frontmatter = f'''---
title: "{safe_title}"
date: {datetime.now().isoformat()}
description: "{safe_content_preview}..."
source: "{safe_source}"{image_line}
category: "news"
tag: "E-Auto"
tags: [{tags_line}]
draft: {str(draft).lower()}
original_url: "{original_url}"
---

# {translated_title}

{translated_content}

---
*Quelle: {source_name}*
'''

    with open(filename, "w", encoding="utf-8") as f:
        f.write(frontmatter)

    print(f"  [{'DRAFT' if draft else 'OK'}] Saved: {filename.name}")
    return filename


def process_source(source, fingerprints):
    """Process a single RSS source"""
    print(f"\n📥 Processing: {source['name']}")
    entries = fetch_rss_feed(source['url'])
    print(f"  Found {len(entries)} articles")
    if not entries:
        return 0, fingerprints

    filter_keywords = source.get('filter_keywords', [])
    if filter_keywords:
        entries = [e for e in entries if is_relevant_article(e, filter_keywords)]
        print(f"  Filtered to {len(entries)} relevant articles")

    if not entries:
        print(f"  [SKIP] No relevant articles found")
        return 0, fingerprints

    saved_count = 0
    for i, entry in enumerate(entries[:source.get('max_articles', 5)]):
        try:
            title = entry.get('title', 'Ohne Titel')
            raw_content = extract_article_content(entry)
            link = entry.get('link', '')
            image_url = extract_article_image(entry)

            if not raw_content or len(raw_content) < 50:
                log_run({"source_key": source['source_key'], "title": title}, "skipped_short", translation_ok=None)
                continue

            # Deduplication check
            fingerprint = compute_fingerprint(raw_content)
            if fingerprint in fingerprints:
                print(f"  [SKIP] Duplicate: {title[:40]}...")
                log_run({"source_key": source['source_key'], "title": title}, "skipped_dupe", translation_ok=True)
                continue

            print(f"  Translating [{i+1}/{min(len(entries), 5)}]: {title[:40]}...")

            translated_title = translate_with_qwen(title)
            if not translated_title:
                translated_title = f"[FEHLER] {title[:80]}"
                title_ok = False
            else:
                title_ok = True

            time.sleep(0.3)

            translated_content = translate_with_qwen(raw_content)
            if not translated_content:
                translated_content = "[Übersetzung fehlgeschlagen]"
                content_ok = False
            else:
                content_ok = True

            translation_ok = title_ok and content_ok

            # Save as draft if translation failed
            is_draft = not translation_ok
            save_markdown(entry, translated_title, translated_content, source['name'], link, draft=is_draft, image_url=image_url)

            # Record fingerprint even for drafts (don't retry failed articles)
            fingerprints[fingerprint] = {
                "title": title,
                "source": source['name'],
                "date": datetime.now().isoformat()
            }

            log_run({"source_key": source['source_key'], "title": title},
                    "draft" if is_draft else "published", translation_ok=translation_ok)

            saved_count += 1
            time.sleep(0.3)

        except Exception as e:
            print(f"  [ERROR] {e}")
            continue

    print(f"✅ {saved_count} articles from {source['name']}")
    return saved_count, fingerprints


def rebuild_fingerprints():
    """Rebuild fingerprints from existing markdown posts"""
    print("🔧 Rebuilding fingerprints from existing posts...")
    fingerprints = {}
    posts_dir = CONTENT_DIR

    if not posts_dir.exists():
        return fingerprints

    for md_file in posts_dir.glob("*.md"):
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
            # Extract body content (skip frontmatter)
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    body = parts[2]
                    # Remove markdown heading and source line
                    body = re.sub(r'^#.*$', '', body, flags=re.MULTILINE)
                    body = re.sub(r'^\*Quelle:.*$', '', body, flags=re.MULTILINE)
                    fingerprint = compute_fingerprint(body)
                    fingerprints[fingerprint] = {"title": md_file.stem, "source": "rebuild", "date": ""}
        except Exception:
            continue

    print(f"  Rebuilt {len(fingerprints)} fingerprints")
    save_fingerprints(fingerprints)
    return fingerprints


def build_weekly_top5(fingerprints):
    """Build weekly Top 5 curated post from recent Chinese-source articles"""
    print("\n📋 Building Weekly Top 5...")

    chinese_source_keys = ('sina', 'pconline', '163')
    cutoff = datetime.now() - timedelta(days=7)
    recent_articles = []

    posts_dir = CONTENT_DIR
    if not posts_dir.exists():
        print("  [WARN] No posts directory found")
        return

    for md_file in posts_dir.glob("*.md"):
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()

            # Parse frontmatter
            if not content.startswith('---'):
                continue
            parts = content.split('---', 2)
            if len(parts) < 2:
                continue

            fm_lines = parts[1].strip().split('\n')
            frontmatter = {}
            for line in fm_lines:
                if ':' in line:
                    key, val = line.split(':', 1)
                    frontmatter[key.strip()] = val.strip().strip('"')

            # Check if Chinese source
            source = frontmatter.get('source', '')
            source_key = source.lower().replace(' ', '')
            is_chinese = any(cs in source_key for cs in chinese_source_keys)
            is_weekly = frontmatter.get('category') == 'weekly'
            is_draft = frontmatter.get('draft', 'false') == 'true'

            if not is_chinese or is_weekly or is_draft:
                continue

            # Check date
            try:
                pub_date = datetime.fromisoformat(frontmatter.get('date', '1970-01-01'))
                if pub_date < cutoff:
                    continue
            except ValueError:
                continue

            recent_articles.append({
                'title': frontmatter.get('title', 'Ohne Titel'),
                'source': source,
                'link': frontmatter.get('original_url', ''),
                'date': pub_date,
                'file': md_file
            })
        except Exception:
            continue

    if not recent_articles:
        print("  [WARN] No recent Chinese articles found — skipping weekly Top 5")
        return

    # Sort by date descending
    recent_articles.sort(key=lambda x: x['date'], reverse=True)
    top5 = recent_articles[:5]

    # Check if already exists for current ISO week
    iso_week = datetime.now().isocalendar()[1]
    year = datetime.now().year
    weekly_filename = CONTENT_DIR / f"weekly-top5-{year}-W{iso_week:02d}.md"

    if weekly_filename.exists():
        print(f"  [SKIP] Weekly Top 5 already exists: {weekly_filename.name}")
        return

    # Build article list
    article_lines = []
    for i, art in enumerate(top5, 1):
        date_str = art['date'].strftime('%d.%m.%Y')
        link_str = f"[Quelle]({art['link']})" if art['link'] else ""
        article_lines.append(f"{i}. **{art['title']}** — {art['source']} ({date_str}) {link_str}")

    body = "# Top 5 chinesische E-Autos diese Woche\n\n"
    body += f"*KW {iso_week}, {datetime.now().strftime('%d.%m.%Y')}*\n\n"
    body += "\n".join(article_lines)
    body += "\n\n---\n*Kuratiert aus den besten chinesischen E-Auto-Nachrichten der Woche.*"

    # Write weekly post
    frontmatter = f'''---
title: "Top 5 chinesische E-Autos diese Woche"
date: {datetime.now().isoformat()}
description: "Die fünf wichtigsten chinesischen E-Auto-Nachrichten dieser Woche"
category: "weekly"
tag: "E-Auto"
draft: false
---

'''

    with open(weekly_filename, "w", encoding="utf-8") as f:
        f.write(frontmatter + body)

    print(f"  [OK] Saved: {weekly_filename.name}")

    # Log weekly entry
    log_entry = {
        "ts": datetime.now().isoformat(),
        "source": "weekly",
        "title": f"Top 5 KW {iso_week}",
        "action": "weekly_published",
        "translation_ok": True
    }
    try:
        with open(RUNLOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except IOError:
        pass


def main():
    parser = argparse.ArgumentParser(description="China EV News Pipeline")
    parser.add_argument("--weekly", action="store_true", help="Build weekly Top 5 curated post")
    parser.add_argument("--rebuild-fingerprints", action="store_true", help="Rebuild fingerprints from existing posts")
    args = parser.parse_args()

    if args.weekly:
        print("=" * 60)
        print("🇨🇳 China EV News — Weekly Top 5 Curator")
        print("=" * 60)
        fingerprints = load_fingerprints()
        build_weekly_top5(fingerprints)
        return

    if args.rebuild_fingerprints:
        rebuild_fingerprints()
        return

    print("=" * 60)
    print("🇨🇳 China EV News Pipeline — DE Edition v3")
    print("=" * 60)

    if not ANTHROPIC_API_KEY:
        print("\n❌ ERROR: ANTHROPIC_API_KEY not set!")
        print("   Set ANTHROPIC_API_KEY in .env or GitHub Secrets")
        sys.exit(1)

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)

    # Load or rebuild fingerprints
    if args.rebuild_fingerprints:
        fingerprints = rebuild_fingerprints()
    else:
        fingerprints = load_fingerprints()

    config = load_sources()
    sources = config.get('sources', [])

    print(f"\n📡 Loaded {len(sources)} sources")

    total = 0
    for source in sources:
        saved, fingerprints = process_source(source, fingerprints)
        total += saved

    # Save fingerprints after run
    save_fingerprints(fingerprints)

    # Commit fingerprints and runlog (git add handled by caller in CI)
    print("\n" + "=" * 60)
    print(f"✅ Complete! {total} articles processed")
    print(f"📁 Files: {CONTENT_DIR}/")
    print(f"📋 Fingerprints: {len(fingerprints)} tracked")
    print("=" * 60)
    print("\n📋 Next: hugo && ./deploy.sh")


if __name__ == "__main__":
    main()
