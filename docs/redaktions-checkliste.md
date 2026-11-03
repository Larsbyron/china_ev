# Redaktions-Checkliste (ab 2026-11-03)

Interne Arbeitsregel für jede Veröffentlichung auf china-autonews.de.
Diese Datei ersetzt keine Technik, sondern die Entscheidung **vor** dem Schreiben.

## 1. Fünf Marktstufen (Pflichtfeld `marketRelevance`)

| Stufe | Bedeutung | Erlaubte Publikation |
|---|---|---|
| `de_available` | In Deutschland offiziell kaufbar | Artikel **oder** Update einer Modellseite |
| `eu_available` | In der EU (nicht DE) kaufbar | Nur mit DE-Bezug (Import, Preisvergleich) |
| `eu_planned` | EU-Start angekündigt | Ja, aber Titel muss „geplant/unbestätigt" tragen |
| `china_only` | Nur China | **Standard = nur Wochenüberblick**; Einzelartikel nur bei Score ≥ 65 **und** klarem DE-Nutzen |
| `global_industry` | Technik/Industrie ohne Modellbezug | Nur bei Auswirkung auf DE-Preise, Markt oder Regulierung |

Regel: Ein china_only-Artikel darf **nie** eine deutsche Preisansage im Titel tragen.
CLTC niemals als WLTP ausgeben. Euro-Beträge aus China immer als „in China" kennzeichnen.

## 2. Fünf Prüfschritte vor dem Schreiben

1. **Markt** — Stufe bestimmen (s. o.). Unklar = nicht schreiben.
2. **Leserfrage** — Welche konkrete Entscheidung hilft der Artikel? (kaufen / leasen / warten / nicht kaufen / Kosten prüfen)
3. **Bestand** — `python3 scripts/topic_check.py --keywords "…"` laufen lassen.
   - Gleiche Marke + Modell + Markt + Suchintention → **bestehenden Artikel aktualisieren**, nicht neu anlegen.
   - Andere Intention (z. B. Marktstart vs. Langzeitkosten) → eigener Artikel erlaubt.
4. **Quellen** — mindestens: eine offizielle DE/EU-Quelle (Preisliste, Behördenseite, Importeur) **oder** ADAC/TÜV/KBA. Ohne sie: nur „Was bekannt ist"-Beitrag, max. 1×/Woche.
5. **Score** (s. § 3). < 50 → nicht veröffentlichen, nur intern ablegen.

## 3. Score (100 Punkte, subjektive Einschätzung, keine Messung)

| Kriterium | Punkte |
|---|---|
| Direkte Relevanz für DE-Käufer | 25 |
| Suchbedarf / Langzeitwert | 20 |
| Originalität / eigener Informationswert | 20 |
| Plausible Monetarisierung | 15 |
| Aktualität | 10 |
| Quellenlage | 10 |

Schwellen: **80+** Tiefenartikel · **65–79** normal, Bestand prüfen · **50–64** Wochenüberblick · **< 50** nicht veröffentlichen.
Ausnahme: Sicherheitsrückruf, Förder-/Rechtsänderung → sofort, danach Faktencheck.

## 4. Deutschland-Check (Pflicht bei Modellseiten)

Frontmatter `deutschlandCheck` — nur ausfüllen, was belegt ist; sonst `"unbekannt"`:

- `available`: ja / nein / unbestätigt
- `price`: deutscher Listenpreis + Datum + Quelle
- `priceNote`: z. B. „China-Preis, nicht auf DE übertragbar"
- `range`: WLTP (nicht CLTC)
- `variants`: in DE angebotene Versionen
- `warranty`: DE-Garantiebedingungen
- `service`: Werkstattnetz / Ersatzteilversorgung
- `competitors`: 2–3 in DE kaufbare Alternativen
- `dataStatus`: Datum der letzten Prüfung

## 5. Quellen- und Sprachregeln

- Deutsche Preise nur aus: Hersteller-DE-Seite, offizielle Preisliste (PDF), Importeur, ADAC/KBA. **Nie** aus chinesischen Preisen umrechnen.
- Jede Zahl mit Quelle + Stand. Unsicherheit ausschreiben („unbestätigt", „laut ADAC-Test 2026").
- Keine erfundenen Fahrberichte, keine erfundenen Händlerstimmen, keine erfundenen Garantiezusagen.
- Titel ohne `Test`/`Erfahrungen`, wenn wir nicht selbst gefahren sind.
- Bei Kostenvergleichen: gleicher Zeitraum, gleiche Ausstattung, gleiche Fahrleistung (ADAC-Standard: 5 Jahre / 75.000 km).

## 6. Kanäle (90 Tage, ohne neue URL-Struktur)

- Kaufberatung & Vergleiche → `modelle-marktstarts` + `preise-rabatte-wettbewerb`
- Preise, Förderung, Kosten → `preise-rabatte-wettbewerb` + `politik-zoelle-regulierung`
- Alltag, Service, Erfahrungen → `batterie-laden-reichweite` + `software-assistenz-autonomes-fahren`
- Markt & Politik → `markt-absatz-zulassungen` + `politik-zoelle-regulierung`
- China-Radar → `modelle-marktstarts` + `industrie-produktion-lieferkette`
