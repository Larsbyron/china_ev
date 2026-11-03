#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bestandsprüfung vor dem Schreiben (Redaktions-Checkliste, Schritt 3).

Beispiel:
  python3 scripts/topic_check.py --keywords "B10 Elroq"
  python3 scripts/topic_check.py --keywords "Seal U" --keywords "Tiguan eHybrid"
  python3 scripts/topic_check.py --keywords "T03" --json

Ausgabe: Treffer nach Marktstufe, Datumsspanne, letzte Titel, Hinweis
"aktualisieren statt neu" wenn eine de_available-Seite existiert.
Python 3.9-kompatibel (keine 3.10-Syntax).
"""
import argparse
import collections
import glob
import json
import os
import re
import sys

POSTS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "posts")


def parse_frontmatter(path):
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            text = fh.read()
    except OSError:
        return None
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end < 0:
        return None
    data = {}
    for line in text[3:end].split("\n"):
        m = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if not m:
            continue
        key, value = m.group(1), m.group(2).strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
            value = value[1:-1]
        elif value in (">-", ">", "|", "|-"):
            value = ""
        data[key] = value
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keywords", action="append", required=True,
                    help="Suchbegriff(e), mehrere = ODER")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--limit", type=int, default=8)
    args = ap.parse_args()

    terms = [t.strip().lower() for t in args.keywords if t.strip()]
    if not terms:
        print("no keywords", file=sys.stderr)
        return 2

    hits = []
    for path in glob.glob(os.path.join(POSTS, "*.md")):
        fm = parse_frontmatter(path)
        if not fm or fm.get("category") == "weekly":
            continue
        haystack = (fm.get("title", "") + " " + fm.get("description", "")).lower()
        if any(t in haystack for t in terms):
            hits.append({
                "slug": os.path.basename(path)[:-3],
                "date": fm.get("date", "")[:10],
                "title": fm.get("title", ""),
                "market": fm.get("marketRelevance", "unbekannt"),
                "topic": fm.get("primaryTopic", ""),
                "brand": fm.get("brand", ""),
                "noindex": fm.get("noindex") == "true",
                "original": fm.get("source") == "E-AUTOS Redaktion",
            })

    by_market = collections.Counter(h["market"] for h in hits)
    published = [h for h in hits if not h["noindex"]]
    hits.sort(key=lambda h: h["date"], reverse=True)
    de_pages = [h for h in hits if h["market"] == "de_available"]
    # "de_available" ist unzuverlaessig: China-Preis/CLTC im Titel = falsch eingestuft.
    for h in de_pages:
        t = h["title"].lower()
        h["suspect"] = ("cltc" in t) or ("in china" in t)
    de_solid = [h for h in de_pages if not h["suspect"]]

    result = {
        "keywords": terms,
        "total": len(hits),
        "published": len(published),
        "byMarket": dict(by_market),
        "deAvailable": len(de_pages),
        "deAvailableSolid": len(de_solid),
        "deAvailableSuspect": len(de_pages) - len(de_solid),
        "dateRange": [hits[-1]["date"], hits[0]["date"]] if hits else [],
        "recommendation": (
            "belastbare de_available-Seite vorhanden -> bestehende Seite aktualisieren (kein Neuanlegen)"
            if de_solid else
            "de_available nur mit China-Preis/CLTC -> Marktstufe zuerst korrigieren, dann neu schreiben"
            if de_pages else
            "kein de_available-Artikel -> neu schreiben, Marktstufe und Quellen zuerst klaeren"
            if hits else
            "kein Bestand -> neu schreiben, Suchintention und Quellen pruefen"
        ),
        "recent": hits[: args.limit],
    }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    print("Suchbegriffe: " + ", ".join(terms))
    print("Treffer: %d (davon veroeffentlicht %d)" % (len(hits), len(published)))
    print("Marktstufen: " + (", ".join("%s=%d" % kv for kv in by_market.most_common()) or "-"))
    print("de_available: %d (davon belastbar %d, China-Preis/CLTC-Verdacht %d)" % (
        len(de_pages), len(de_solid), len(de_pages) - len(de_solid)))
    if hits:
        print("Zeitraum: %s -> %s" % (hits[-1]["date"], hits[0]["date"]))
    print("Empfehlung: " + result["recommendation"])
    print("")
    for h in result["recent"]:
        flags = []
        if h["noindex"]:
            flags.append("noindex")
        if h["original"]:
            flags.append("original")
        print("  %s  %-13s %-28s %s%s" % (
            h["date"], h["market"], h["topic"][:28], h["title"][:80],
            ("  [" + ",".join(flags) + "]") if flags else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
