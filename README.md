# China EV News

Ein automatisiertes Nachrichtenportal für deutsche Auto-Enthusiasten mit den neuesten Nachrichten über chinesische Elektroautos.

## Features

- **Automatische Content-Sammlung** — RSS-Feeds von TechCrunch, The Verge, Ars Technica
- **KI-Übersetzung** — Qwen API (Aliyun) übersetzt Artikel ins Deutsche
- **Modernes Design** — Hugo Static Site mit responsivem Layout
- **Dark Mode** — Automatische dunkler Modus Unterstützung
- **Social Sharing** — Twitter, LinkedIn, Native Share

## Quick Start

```bash
# 1. API Key konfigurieren
cp .env.example .env
# .env bearbeiten

# 2. Dependencies installieren
pip install -r requirements.txt

# 3. Artikel holen und übersetzen
python fetch_translate.py

# 4. Seite bauen
hugo

# 5. Lokal ansehen
hugo server -D
```

## GitHub Actions

### Secrets konfigurieren

In https://github.com/Larsbyron/china_ev/settings/secrets → Actions:

| Secret | Beschreibung |
|---------|--------------|
| `ALIYUN_API_KEY` | Aliyun Qwen API Key |
| `FTP_SERVER` | ftp.your-domain.de |
| `FTP_USERNAME` | Strato Username |
| `FTP_PASSWORD` | Strato Passwort |

### Workflow aktivieren

1. https://github.com/Larsbyron/china_ev/actions
2. "deploy.yml" → "Run workflow"

Läuft automatisch täglich um 8:00 UTC.

## Strato Deployment

```bash
# deploy.sh bearbeiten mit echten Daten
./deploy.sh
```

## Lizenz

MIT
