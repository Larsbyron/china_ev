# China EV News

[![Deploy](https://github.com/Larsbyron/china_ev/actions/workflows/deploy.yml/badge.svg)](https://github.com/Larsbyron/china_ev/actions/workflows/deploy.yml)

Ein automatisiertes Nachrichtenportal für deutsche Auto-Enthusiasten mit den neuesten Nachrichten über chinesische Elektroautos — direkt aus chinesischen Quellen übersetzt.

## Features

- **Chinesische Primärquellen** — Sina Auto, 太平洋汽车, 网易汽车
- **KI-Übersetzung** — MiniMax Claude API übersetzt Artikel ins Deutsche
- **Modernes Design** — Hugo Static Site mit responsivem Layout
- **Deduplizierung** — SHA-256 Fingerprinting verhindert doppelte Artikel
- **Wöchentliche Kuratierung** — Top 5 chinesische E-Autos jede Woche

## Quick Start

```bash
# 1. Dependencies installieren
pip install -r requirements.txt

# 2. Artikel holen und übersetzen
python fetch_translate.py

# 3. Seite bauen
hugo

# 4. Lokal ansehen
hugo server
```

## GitHub Actions

### Secrets konfigurieren

In https://github.com/Larsbyron/china_ev/settings/secrets → Actions:

| Secret | Beschreibung |
|---------|--------------|
| `ANTHROPIC_API_KEY` | MiniMax Anthropic API Key |
| `VERCEL_TOKEN` | Vercel Deploy Token |
| `VERCEL_ORG_ID` | Vercel Organisation ID |
| `VERCEL_PROJECT_ID` | Vercel Projekt ID |

### Workflow

Läuft automatisch:
- Täglich um 8:00 UTC — tägliche Artikel
- Freitags um 8:00 UTC — wöchentliche Top 5 Kuratierung

## Lokale Commands

```bash
# Wöchentliche Top 5 neu erstellen
python fetch_translate.py --weekly

# Fingerprints neu aufbauen
python fetch_translate.py --rebuild-fingerprints
```

## Lizenz

MIT
