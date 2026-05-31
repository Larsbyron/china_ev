# E-Autos China — Project Specification

## 1. Concept & Vision

**Produkt:** Ein automatisierter deutschsprachiger Blog, der täglich die wichtigsten chinesischen E-Auto-Nachrichten kuratiert, übersetzt und als hochwertiges Editorial für deutsche Leser aufbereitet.

**Positionierung:** Die vertrauenswürdige deutschsprachige Quelle für China-EV-News — nicht nur ein Aggregator, sondern ein kuratiertes Magazin mit Biss.

**Warum das funktioniert:**
- Deutsche kaufen zunehmend chinesische EVs (BYD, NIO, MG etc.), aber kaum deutschsprachige Quellen für echten Journalismus aus China
- Deutsche Leser erwarten: Tiefe, Fakten, Einordnung — nicht nur Überschriften
- Automatisierung macht den Betrieb günstig, Qualitäts-Redaktion den Unterschied

---

## 2. Target Audience

**Primär:** Deutsche Autojournalisten, EV-Enthusiasten, Käufer von China-EVs (BYD, NIO, Xpeng, MG, etc.)
**Sekundär:** Investoren und Analysten im EV-Sektor

**Bedürfnisse:**
- Tägliche Einordnung: Was passiert gerade in China?
- Übersetzung ohne Sprachbarriere
- Vollständige Artikel, nicht nur Schlagzeilen
- Einordnende Kommentare (Tarife, Marktstrategien, Technologie)

---

## 3. German Market Pain Points

1. **Informationslücke:** Kaum deutschsprachige Quellen für China-EV-News. Englische Quellen wie Electrek erreichen Deutsche nicht.
2. **Sprachbarriere:** Chinesische Auto-Websites (autohome, ifeng, etc.) sind unzugänglich.
3. **Kein Kontext:** Maschinelle Übersetzung fehlt Einordnung für deutsche Leser.
4. **Veraltete RSS-Feeds:** Bestehende Pipeline nutzt RSS, was nur Snippets liefert — nicht ganze Artikel.
5. **Design-Defizit:** Bestehende Hugo-Seite sieht nach generischem Blog-Template aus, nicht nach redaktioneller publication.

---

## 4. Content Strategy

### Sources (chinesische Auto-Portale)

| Quelle | URL | Art | Warum |
|--------|-----|-----|-------|
| Autohome | autohome.com.cn | Spider | Größter Auto-Portal Chinas |
| Ifeng Auto | auto.ifeng.com | Spider | Hochwertiger Journalismus |
| Sina Auto | auto.sina.com.cn | Spider | Breite Abdeckung |
| 太平洋汽车 | pcauto.com.cn | Spider | Technik-fokussiert |

**Filter:** BYD, NIO, XPeng, Li Auto, Xiaomi SU7, Geely, Zeekr, Leapmotor, MG, Aion, Tarife, EU-Import, Batterietechnologie, Marktstrategien

**Output:** 8–12 Artikel täglich (werktags), Volltext-Translation ins Deutsche

### Content Types

- **News-Artikel:** Vollständige Artikel, deutsch, mit Quellenangabe
- **Weekly Top 5:** Jeden Freitag — kuratierte Top-5 der Woche
- **Brand Watch:** Dossier-artigeieces zu einzelnen Marken

---

## 5. Technical Architecture

```
e-autos-china/
├── SPEC.md                          # Dieses Dokument
├── CLAUDE.md                         # Projekt-Instructions
├── .env.example                      # API-Keys Template
├── .github/
│   └── workflows/
│       ├── daily.yml                 # Täglicher CI/CD
│       └── weekly.yml                # Weekly Top 5
├── src/
│   ├── lib/
│   │   ├── scraper/
│   │   │   ├── index.ts              # Scraper-Orchestrator
│   │   │   ├── dedup.ts              # SHA-256 Deduplizierung
│   │   │   └── sources/
│   │   │       ├── autohome.ts
│   │   │       ├── ifeng.ts
│   │   │       └── sina.ts
│   │   ├── translator/
│   │   │   └── index.ts              # MiniMax Translation
│   │   └── article.ts                # Article types & utilities
│   ├── app/
│   │   ├── layout.tsx                # Root layout (dark/light mode)
│   │   ├── page.tsx                  # Homepage (hero + article list)
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Article detail page
│   │   ├── brands/
│   │   │   └── page.tsx              # Brand overview
│   │   └── weekly/
│   │       └── page.tsx              # Weekly Top 5
│   ├── components/
│   │   ├── ArticleCard.tsx
│   │   ├── Hero.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── ThemeToggle.tsx
│   └── styles/
│       └── globals.css               # CSS with design tokens
├── scripts/
│   ├── fetch-translate.ts            # Standalone CLI für CI
│   └── build.ts                      # Build trigger
├── content/
│   └── posts/                        # Article Markdown files (für CI)
│       └── drafts/                   # Failed translations
├── next.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

### Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, CSS (kein Tailwind)
- **Scraper:** TypeScript mit fetch + cheerio (kein Playwright für SSR)
- **Translation:** MiniMax via API (bestehendes System)
- **Deployment:** Vercel (bestehend)
- **Comments:** Giscus (GitHub Discussions)
- **Hosting:** Vercel (bleibt bestehen)

### CI/CD Flow

```
GitHub Actions (täglich 08:00 UTC)
  ├── 1. Checkout
  ├── 2. npm install
  ├── 3. tsx scripts/fetch-translate.ts
  │     ├── Scrape autohome (5 articles)
  │     ├── Scrape ifeng (5 articles)
  │     ├── Scrape sina (3 articles)
  │     ├── Deduplicate (SHA-256)
  │     ├── Translate each → MiniMax API
  │     └── Save to content/posts/ as .md files
  ├── 4. next build
  └── 5. Deploy to Vercel
```

---

## 6. Design Language

### Direction: "Editorial Tech Magazine"

Denke an die visuelle Sprache von The Verge oder Wired — aber für EVs. Seriös, aber mitTech-Appeal. Nicht das typische deutsche Automagazin.

### Farbpalette

```
--color-bg-primary:       #0c0c0e       // Deep black
--color-bg-secondary:     #141416       // Card surfaces
--color-bg-tertiary:       #1c1c1f       // Elevated surfaces
--color-text-primary:     #f5f5f7       // Primary text
--color-text-secondary:   #86868b       // Secondary text
--color-accent-green:     #30d158       // EV/Tech accent (like Apple green)
--color-accent-orange:    #ff9f0a       // Warning/Tariff indicator
--color-border:            #2c2c2e       // Subtle borders

Light mode variants:
--color-bg-primary:       #ffffff
--color-bg-secondary:     #f5f5f7
--color-text-primary:     #1d1d1f
--color-text-secondary:   #6e6e73
--color-accent-green:     #34c759
--color-border:           #d2d2d7
```

### Typography

- **Headlines:** Inter (Google Fonts) — crisp, modern, nicht generic
- **Body:** Inter — für perfekte Lesbarkeit
- **Monospace (Tags/Dates):** JetBrains Mono
- **Scale:** 14px base, 1.25 ratio

### Spatial System

- 8px base grid
- Sections: 80px vertical rhythm
- Cards: 24px padding
- Content max-width: 720px (article), 1280px (listing)

### Motion

- Page transitions: fade + slight translate-y (200ms ease-out)
- Cards: hover scale 1.02, shadow lift
- Theme toggle: 300ms color scheme transition
- No motion on reduced-motion preference

---

## 7. Page Structure

### Homepage
```
[Header: Logo + Nav + Theme Toggle]
[Hero: "China EVs — Täglich" — Tagline + Latest Article Feature]
[Article Grid: 3-col on desktop, latest 6 articles]
[Brand Bar: Quick links BYD | NIO | XPeng | Li Auto | BYD | MG]
[Footer: Impressum | Datenschutz | GitHub]
```

### Article Detail
```
[Header]
[Article Header: Title + Date + Source Tag + Read Time]
[Hero Image: Full-width if available]
[Article Body: 720px max-width, clean typography]
[Tags: Related brands/topics]
[Comments: Giscus integration]
[Footer]
```

### Weekly Top 5 (Special Page)
```
[Header]
[Hero: "Top 5 diese Woche" — Datum]
[List: Numbered articles with excerpts]
[Footer]
```

---

## 8. Component Inventory

### SiteHeader
- Logo (text-based: "E-AUTOS")
- Nav: Alle | Marken | Weekly | Über
- Theme toggle button
- States: default, scrolled (backdrop blur)

### ArticleCard
- Thumbnail image (optional, right-aligned on desktop)
- Category tag
- Title (2 lines max)
- Excerpt (3 lines max)
- Date + read time
- Source badge
- States: default, hover (lift + border accent)

### Hero
- Large headline
- Sub-headline
- Featured article card
- Dark/light aware

### ThemeToggle
- Sun/Moon icon
- 300ms transition
- Persists to localStorage

---

## 9. API & Data Model

### Article (Markdown Frontmatter)
```yaml
---
title: "BYD Seal 2026: Neue Reichweite von 700 km"
date: 2026-04-14T08:00:00Z
description: "BYD präsentiert den überarbeiteten Seal mit verbesserter Batterie..."
source: "Autohome"
image: "https://example.com/image.jpg"
category: "news"
brand: "BYD"
tags: ["BYD", "Reichweite", "Batterie"]
draft: false
original_url: "https://autohome.com.cn/news/..."
read_time_minutes: 4
---
```

### Fingerprints (processed_articles.json)
```json
{
  "sha256_hash": { "title": "...", "source": "...", "date": "..." },
  ...
}
```

---

## 10. SEO & Performance

- Meta titles: "{Article Title} | E-AUTOS"
- Meta description: From article excerpt
- OG images: Article hero image
- Canonical URLs for all pages
- Sitemap: Auto-generated
- Robots.txt
- Performance targets: LCP < 2.5s, CLS < 0.1

---

## 11. Error Handling

- **Translation fails:** Save to drafts/, retry next day
- **Scraping fails:** Log error, continue with other sources
- **Rate limited:** Exponential backoff (1s, 2s, 4s)
- **Missing content:** Fall back to title-only translation

---

## 12. Security

- API keys: Only in .env (not committed)
- Secrets: GitHub Actions secrets
- No client-side API calls (all server-side in build)
- CSP headers configured
- No third-party tracking scripts