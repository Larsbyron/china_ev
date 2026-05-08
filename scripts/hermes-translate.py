#!/usr/bin/env python3
"""
Hermes Translate Pipeline — replaces MiniMax API translation.

This script is the data-collection half. It:
1. Fetches article list from Chinese auto news sites
2. Extracts full article content (title, text, image, date)
3. Outputs JSON to stdout for Hermes to translate

Usage:
    python3 scripts/hermes-translate.py fetch [--source sina|autohome|autohome_newenergy|autohome_all|pcauto|chooseauto|nev_ofweek] [--max 5]

Output: JSON array of articles with Chinese content, ready for translation.

After this script runs, Hermes reads the JSON, translates each article to German,
and writes the final markdown files to content/posts/.
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
from pathlib import Path
from datetime import datetime

import requests
from bs4 import BeautifulSoup

# ============================================================================
# Configuration
# ============================================================================

CONTENT_DIR = Path(__file__).parent.parent / "content" / "posts"
FINGERPRINT_FILE = Path(__file__).parent.parent / "processed_articles.json"

SOURCES = {
    "sina": {
        "name": "Sina",
        "list_url": "https://auto.sina.com.cn/news/",
        "base_url": "https://auto.sina.com.cn",
        "article_patterns": ["/detail-", "/article/", "/content-", "/doc-"],
    },
    "autohome": {
        "name": "Autohome",
        "list_url": "https://www.autohome.com.cn/news/",
        "base_url": "https://www.autohome.com.cn",
        "article_patterns": ["/news/2"],  # matches /news/YYYYMM/ (2026, 2025, etc.)
    },
    "pcauto": {
        "name": "PCauto",
        "list_url": "https://www.pcauto.com.cn/nation/",
        "base_url": "https://www.pcauto.com.cn",
        "article_patterns": ["/nation/"],
        "encoding": "gb2312",
    },
    "autohome_newenergy": {
        "name": "Autohome NewEnergy",
        "list_url": "https://www.autohome.com.cn/newenergy/",
        "base_url": "https://www.autohome.com.cn",
        "article_patterns": ["/news/2"],  # matches /news/YYYYMM/ (2026, 2025, etc.)
    },
    "chooseauto": {
        "name": "ChooseAuto",
        "list_url": "https://www.chooseauto.com.cn/list/channel_1.shtml",
        "base_url": "https://www.chooseauto.com.cn",
        "article_patterns": ["/news/"],  # /news/897997.shtml
    },
    "nev_ofweek": {
        "name": "OFweek NEV",
        "list_url": "https://nev.ofweek.com/CATList-71000-8200-nev.html",
        "base_url": "https://nev.ofweek.com",
        "article_patterns": ["/ART-"],  # /2026-04/ART-71008-8220-30686126.html
    },
    "autohome_all": {
        "name": "Autohome All",
        "list_url": "https://www.autohome.com.cn/all/",
        "base_url": "https://www.autohome.com.cn",
        "article_patterns": ["/news/2"],  # matches /news/YYYYMM/ (2026, 2025, etc.)
        "encoding": "gb2312",
        "ev_filter": True,  # filter ICE vehicles, only keep EV content
    },
}

BRAND_PATTERNS = {
    "BYD": [r"BYD", "比亚迪", "腾势", "方程豹"],
    "NIO": [r"NIO", "蔚来"],
    "XPeng": [r"XPeng", r"Xpeng", "小鹏"],
    "Li Auto": [r"Li\s*Auto", "理想"],
    "Geely": [r"Geely", "吉利", "领克"],
    "Zeekr": [r"Zeekr", "极氪"],
    "Xiaomi": [r"Xiaomi", "小米", "SU7"],
    "MG": [r"\bMG\b", "名爵"],
    "Aion": [r"Aion", "埃安"],
    "Leapmotor": [r"Leapmotor", "零跑"],
    "Onvo": [r"Onvo", "乐道"],
    "Tesla": [r"Tesla", "特斯拉"],
    "BMW": [r"BMW", "宝马"],
    "Mercedes": [r"Mercedes", "奔驰"],
    "Audi": [r"Audi", "奥迪"],
    "Volkswagen": [r"Volkswagen", "大众"],
    "Changan": [r"Changan", "长安"],
    "Avatr": [r"Avatr", "阿维塔"],
    "Hongqi": [r"Hongqi", "红旗"],
    "Deepal": [r"Deepal", "深蓝"],
    "Denza": [r"Denza", "腾势"],
    "Hyper": [r"Hyper", "昊铂"],
    "Arcfox": [r"Arcfox", "极狐"],
}

# EV keywords for filtering ICE content (used by autohome_all ev_filter)
EV_KEYWORDS = [
    r"电动", r"纯电", r"插混", r"增程", r"混动", r"新能源", r"电池",
    r"充电", r"续航", r"NIO", r"蔚来", r"BYD", r"比亚迪", r"XPeng", r"小鹏",
    r"理想", r"Zeekr", r"极氪", r"小米", r"SU7", r"特斯拉", r"Tesla",
    r"埃安", r"零跑", r"大众ID", r"ID\.", r"EQ", r"iX", r"e-tron",
    r"EQS", r"EQB", r"EQC", r"EQE", r"EQA",
    r"凯迪拉克.*纯电", r"路特斯", r"Polestar", r"极星",
    r"新势力", r"Robotaxi",
    # Specific EV/PHEV models that may not mention "纯电" in title
    r"华境S?", r"铂智", r"阿维塔", r"奥迪E\d", r"AUDI\s*E\d",
    r"深蓝", r"长安启源", r"岚图", r"仰望", r"方程豹",
    r"问界", r"享界", r"智界", r"尚界", r"尊界",
    r"昊铂", r"星途", r"猛士", r"坦克.*hi4", r"哈弗.*Hi4",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

DELAY_MS = 1000  # 1 request per second


# ============================================================================
# HTTP
# ============================================================================

def fetch_page(url: str, encoding: str = None) -> str:
    """Fetch a page with retry logic."""
    for attempt in range(3):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            if encoding:
                resp.encoding = encoding
            else:
                resp.encoding = resp.apparent_encoding or 'utf-8'
            return resp.text
        except requests.RequestException as e:
            if attempt == 2:
                raise
            print(f"  Retry {attempt+1}: {e}", file=sys.stderr)
            time.sleep(2)


# ============================================================================
# HTML Content Extraction
# ============================================================================

REMOVE_TAGS = {"script", "style", "nav", "header", "footer", "aside",
               "iframe", "noscript", "form", "button", "input", "select",
               "svg", "path"}

REMOVE_CLASSES = {"ad", "advertisement", "comment", "share", "related",
                  "sidebar", "toolbar", "nav-bar", "menu", "btn", "button",
                  "icon", "logo", "hotword", "search-box", "login", "user-info",
                  "breadcrumb", "pagination", "city", "switch"}


def extract_text(html: str, source_key: str = "") -> str:
    """Extract readable text from HTML using BeautifulSoup."""
    soup = BeautifulSoup(html, "html.parser")

    # Remove unwanted tags
    for tag in soup.find_all(REMOVE_TAGS):
        tag.decompose()

    # Remove elements with unwanted classes
    for cls in REMOVE_CLASSES:
        for tag in soup.find_all(class_=re.compile(cls, re.I)):
            tag.decompose()

    # Try source-specific selectors first, then generic ones
    selectors = []

    # Autohome / Autohome NewEnergy / Autohome All: Tailwind CSS Modules
    if source_key in ("autohome", "autohome_newenergy", "autohome_all"):
        # Content body: class contains "Article_Wrap_Box"
        aw = soup.find(class_=re.compile(r"Article_Wrap_Box"))
        if aw:
            selectors.append(aw)
        # Title: div with tw-text-[32px]
        title_el = soup.find(class_=re.compile(r"tw-text-\[32px\]"))
        if title_el:
            selectors.append(title_el)

    # PCauto: traditional class names
    if source_key == "pcauto":
        art = soup.find(class_="artText")
        if art:
            selectors.append(art)
        title_el = soup.find("h1", class_="tit")
        if title_el:
            selectors.append(title_el)

    # ChooseAuto: article body is after the title/author/date line, before "标签:"
    if source_key == "chooseauto":
        # Find all text blocks, exclude navigation and footer
        body = soup.find("body")
        if body:
            # Remove known boilerplate sections
            for cls_pattern in ["header", "nav", "footer", "hot-video", "hot-", "focus",
                                "related", "link", "breadcrumb"]:
                for tag in body.find_all(class_=re.compile(cls_pattern, re.I)):
                    tag.decompose()
            selectors.append(body)

    # OFweek NEV: article body starts after the title, ends before related articles
    if source_key == "nev_ofweek":
        # Content is in the body between the title line and "相关阅读"
        body = soup.find("body")
        if body:
            # Remove massive navigation/boilerplate
            for tag in body.find_all(class_=re.compile(r"header|nav|footer|side|hot|related|recommend|activity|pic-news", re.I)):
                tag.decompose()
            for tag in body.find_all(id=re.compile(r"header|nav|footer|side|hot|related|recommend")):
                tag.decompose()
            selectors.append(body)

    # Generic selectors (fallback and for sina)
    selectors.extend([
        soup.find(id="articleContent"),
        soup.find(class_="article-content"),
        soup.find(class_="news-content"),
        soup.find("article"),
        soup.find(class_="art_content"),
    ])

    best_text = ""
    for el in selectors:
        if el:
            text = el.get_text(separator="\n", strip=True)
            if len(text) > len(best_text):
                best_text = text

    # Fallback: use body
    if len(best_text) < 300:
        body = soup.find("body")
        if body:
            best_text = body.get_text(separator="\n", strip=True)

    # Clean up
    best_text = re.sub(r'\n{3,}', '\n\n', best_text)
    best_text = re.sub(r'[ \t]+', ' ', best_text)
    return best_text.strip()


def extract_image_urls(html: str, source_key: str = "") -> list:
    """Extract image URLs from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    imgs = []

    # Source-specific image selectors
    if source_key == "pcauto":
        for img in soup.select(".artText img"):
            src = img.get("src") or img.get("data-src") or ""
            if src:
                if src.startswith("//"):
                    src = "https:" + src
                imgs.append(src)
        return imgs

    if source_key == "autohome" or source_key == "autohome_newenergy" or source_key == "autohome_all":
        for img in soup.select("[class*='Article_Wrap_Box'] img, .editor-image img"):
            src = img.get("src") or img.get("data-src") or ""
            if src and "lazy" not in src.lower():
                imgs.append(src)
        return imgs

    if source_key == "chooseauto":
        for img in soup.find_all("img"):
            src = img.get("src") or ""
            if src and not any(x in src.lower() for x in ["avatar", "logo", "icon", "gif", "pixel", "1x1", "/ad/", "gaicon"]):
                if src.startswith("//"):
                    src = "https:" + src
                imgs.append(src)
        return imgs

    if source_key == "nev_ofweek":
        for img in soup.find_all("img"):
            src = img.get("src") or ""
            if src and not any(x in src.lower() for x in [
                "avatar", "logo", "icon", "gif", "pixel", "1x1",
                "images.ofweek.com/article/images/bar/",  # toolbar icons
                "images.ofweek.com/images/logo/",          # site logos
                "images.ofweek.com/newOFweekIndex/",       # footer icons
                "images.ofweek.com/ofweek/images/",        # HR/recruitment logos
                "beian.png", "qrcode", "weixin", "wechat",
                "online2.gif", "loading.png",
            ]):
                if src.startswith("//"):
                    src = "https:" + src
                imgs.append(src)
        return imgs

    # Generic fallback
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if src and not any(x in src for x in ["avatar", "logo", "icon", "gif", "pixel", "1x1",
                                               "default_big.png", "default", "placeholder",
                                               "empty", "blank"]):
            imgs.append(src)
    # For autohome: if we got nothing good, try broader content area
    if not imgs and source_key in ("autohome", "autohome_newenergy", "autohome_all"):
        for img in soup.select("div[class*='article'] img, div[class*='content'] img"):
            src = img.get("src") or ""
            if src and "autoimg" in src:
                imgs.append(src)
    return imgs


# ============================================================================
# Article List Parsing
# ============================================================================

def parse_article_links(html: str, base_url: str, source_key: str) -> list:
    """Parse article listing page for links. Uses BeautifulSoup for robustness."""
    soup = BeautifulSoup(html, "html.parser")
    links = []
    seen = set()

    # Get source-specific patterns
    source_cfg = SOURCES.get(source_key, {})
    article_patterns = source_cfg.get("article_patterns", ['/detail-', '/article/', '/content-', '/doc-'])

    # Find all links
    for a in soup.find_all("a", href=True):
        url = a["href"].strip()
        title = a.get_text(strip=True)

        if not url or not title or len(title) < 5:
            continue
        if "javascript" in url or url == "#":
            continue

        # Make absolute URL
        if url.startswith("//"):
            url = "https:" + url
        elif not url.startswith("http"):
            url = base_url.rstrip("/") + "/" + url.lstrip("/")

        # De-duplicate domain prefix (e.g. sina links sometimes have //auto.sina.com.cn//auto.sina.com.cn/...)
        url = re.sub(r'(https?://[^/]+)//\1', r'\1', url)

        # Filter for article detail URLs using source-specific patterns
        if not any(p in url for p in article_patterns):
            continue

        # For autohome, skip non-article pages (e.g. list pages like /news/202605/)
        if source_key in ("autohome", "autohome_all") and not re.search(r'/news/\d{6}/\d+\.html', url):
            continue
        # For pcauto, must end with numeric .html
        if source_key == "pcauto" and not re.search(r'/nation/\d+/\d+\.html', url):
            continue

        # Skip duplicates
        if url in seen:
            continue
        seen.add(url)
        links.append({"title": title[:200], "url": url})

    return links


# ============================================================================
# Brand Extraction
# ============================================================================

def extract_brand(title: str, content: str) -> str:
    """Extract EV brand from article title + content."""
    text = f"{title} {content}"
    for brand, patterns in BRAND_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return brand
    return ""


# ============================================================================
# Deduplication
# ============================================================================

def load_fingerprints() -> dict:
    """Load processed article fingerprints."""
    if FINGERPRINT_FILE.exists():
        try:
            return json.loads(FINGERPRINT_FILE.read_text("utf-8"))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def compute_fingerprint(text: str) -> str:
    """Compute SHA-256 fingerprint from normalized text."""
    normalized = re.sub(r'<[^>]+>', '', text)
    normalized = normalized.lower().strip()
    normalized = re.sub(r'\s+', ' ', normalized)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


# ============================================================================
# Main Pipeline
# ============================================================================

def fetch_articles(source_key: str, max_articles: int = 5) -> list:
    """Fetch articles from a news source."""
    source = SOURCES[source_key]
    source_name = source["name"]
    base_url = source["base_url"]
    list_url = source["list_url"]
    encoding = source.get("encoding")

    print(f"[{source_name}] Fetching article list from {list_url}...", file=sys.stderr)
    html = fetch_page(list_url, encoding)

    links = parse_article_links(html, base_url, source_key)

    print(f"[{source_name}] Found {len(links)} article links", file=sys.stderr)

    fingerprints = load_fingerprints()
    articles = []

    for link in links:
        if len(articles) >= max_articles:
            break

        url = link["url"]
        title = link["title"]

        try:
            time.sleep(DELAY_MS / 1000)
            print(f"[{source_name}] Scraping: {title[:50]}...", file=sys.stderr)
            article_html = fetch_page(url, encoding)
            text = extract_text(article_html, source_key)

            if len(text) < 300:
                print(f"[{source_name}] Skipping (too short: {len(text)} chars)", file=sys.stderr)
                continue

            # EV filter for autohome_all — skip ICE-only articles
            if source.get("ev_filter"):
                combined = f"{title} {text[:1000]}"
                if not any(re.search(kw, combined, re.I) for kw in EV_KEYWORDS):
                    print(f"[{source_name}] Skipping (not EV-related): {title[:50]}...", file=sys.stderr)
                    continue

            # Check duplicate
            fp = compute_fingerprint(text)
            if fp in fingerprints:
                print(f"[{source_name}] Skipping duplicate: {title[:40]}...", file=sys.stderr)
                continue

            # Extract image
            images = extract_image_urls(article_html, source_key)
            image = images[0] if images else ""

            # Extract brand
            brand = extract_brand(title, text)

            article = {
                "title": title,
                "content": text,
                "url": url,
                "source": source_name,
                "image": image,
                "brand": brand,
                "date": datetime.now().isoformat(),
                "fingerprint": fp,
            }

            articles.append(article)
            print(f"[{source_name}] OK ({len(text)} chars, brand={brand})", file=sys.stderr)

        except Exception as e:
            print(f"[{source_name}] Error: {e}", file=sys.stderr)

    return articles


def main():
    parser = argparse.ArgumentParser(description="Hermes Translate Pipeline")
    parser.add_argument("command", choices=["fetch"], help="Command to run")
    parser.add_argument("--source", default="sina", help="News source (sina, autohome, autohome_newenergy, autohome_all, pcauto, chooseauto, nev_ofweek, all)")
    parser.add_argument("--max", type=int, default=3, help="Max articles to fetch")
    args = parser.parse_args()

    if args.command == "fetch":
        if args.source == "all":
            all_sources = list(SOURCES.keys())
        else:
            all_sources = [args.source]

        all_articles = []
        for src in all_sources:
            articles = fetch_articles(src, args.max)
            all_articles.extend(articles)

        # Output as JSON to stdout
        print(json.dumps(all_articles, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
