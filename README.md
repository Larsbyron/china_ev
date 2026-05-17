# China EV News

[![CI](https://github.com/Larsbyron/china_ev/actions/workflows/ci.yml/badge.svg)](https://github.com/Larsbyron/china_ev/actions/workflows/ci.yml)

Ein automatisiertes Nachrichtenportal für deutsche Auto-Enthusiasten mit den neuesten Nachrichten über chinesische Elektroautos — direkt aus chinesischen Quellen übersetzt.

**Live:** [china-autonews.de](https://china-autonews.de)

## Features

- **Chinesische Primärquellen** — Electrek, CnEVPost und weitere
- **KI-Übersetzung** — MiniMax Claude API übersetzt Artikel ins Deutsche
- **Modernes Design** — Next.js 15 Static Export mit Dark-First Theme
- **Volltextsuche** — Pagefind für client-side Suche
- **EV-Daten** — Recharts Diagramme für Reichweite, Preise, Batterie
- **Vergleichstool** — Chinesische EVs side-by-side vergleichen
- **Wöchentliche Kuratierung** — Top 5 chinesische E-Autos jede Woche
- **Quick Facts** — EV-Spezifikationen auf Artikelseiten
- **Share Buttons** — X, Facebook, LinkedIn, Link kopieren
- **RSS Feed** — `/feed.xml` für alle Artikel
- **SEO** — Sitemap, robots.txt, strukturierte Daten (JSON-LD)

## Tech Stack

- **Framework:** Next.js 15 (Static Export)
- **Styling:** CSS Modules + CSS Custom Properties
- **Charts:** Recharts
- **Search:** Pagefind
- **Comments:** Giscus (GitHub Discussions)
- **Hosting:** Vercel
- **CI:** GitHub Actions

## Quick Start

```bash
# 1. Dependencies installieren
npm install

# 2. Dev-Server starten
npm run dev

# 3. Bauen
npm run build

# 4. Tests laufen lassen
npm test
```

## Projektstruktur

```
src/
├── app/                    # Next.js App Router Seiten
│   ├── page.tsx            # Homepage
│   ├── articles/           # Artikel-Listing + Detailseiten
│   ├── brands/             # Marken-Übersicht
│   ├── daten/              # EV-Daten mit Charts
│   ├── suche/              # Volltextsuche
│   ├── vergleich/          # Vergleichstool
│   ├── weekly/             # Wöchentliche Top 5
│   ├── about/              # Über uns
│   ├── impressum/          # Impressum (TMG)
│   └── datenschutz/        # Datenschutz (GDPR)
├── components/             # React-Komponenten
├── lib/                    # Utilities, Scraper, Markdown
└── data/                   # EV-Spezifikationen (JSON)
```

## Konfiguration

### Umgebungsvariablen (.env)
- `ANTHROPIC_API_KEY` — MiniMax Anthropic API Key
- `ANTHROPIC_BASE_URL` — API Base URL

### Giscus Kommentare
1. GitHub Discussions im Repo aktivieren
2. httpsg://giscus.app besuchen für Repo-Details
3. Giscus-Komponente konfigurieren

### Vercel Deployment
Automatisch via GitHub Push. Benötigt:
- Vercel Projekt mit `outputDirectory: "out"`
- Deployment Protection deaktiviert

## Lizenz

MIT
