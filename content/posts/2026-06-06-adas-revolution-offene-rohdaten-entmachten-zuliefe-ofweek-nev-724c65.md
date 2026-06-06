---
title: "ADAS-Revolution: Offene Rohdaten entmachten Zulieferer"
date: 2026-06-06T11:19:47.206Z
description: "Chinesische Hersteller forcieren die „Entkopplung“ der Sensorarchitektur. Rohdaten von Radar & Lidar werden direkt an die Zentrale gesendet – Tier-1-Zulieferer verlieren die Algorithmuskontrolle."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# ADAS-Revolution: Offene Rohdaten entmachten Zulieferer

## Die Wende in der Sensorarchitektur

Bislang verarbeiteten Radarsensoren Signale intern: Jeder Sensor lieferte eine fertige „Ziel-Liste“ (z. B. „Hindernis in 50 m“). Die Zentrale erhielt nur vorverdichtete Daten – wertvolle Rohinformationen gingen verloren. Dieser geschlossene Kreislauf sicherte Tier-1-Zulieferern (wie Bosch, Continental) die Kontrolle über die Algorithmen.

Doch chinesische Hersteller brechen dieses Modell auf. Die neue **entkoppelte Architektur** (解耦架构) leitet rohe Sensorrohdaten – etwa die FFT-Spektren des Millimeterwellenradars oder die Punktwolke des Lidars – über SerDes‑Leitungen direkt an die zentrale ADAS‑SoC. Dort fusioniert ein einheitlicher Algorithmus alle Signale. Statt „1 + 1 = 2“ wird „1 + 1 = 5“ möglich: Ein Millimeterwellenradar durchdringt Regen, ein Lidar erkennt feine Strukturen – kombiniert entsteht ein viel vollständigeres Umfeldmodell.

## Wer hat die Datenhoheit? Algorithmus-Kontrolle wechselt

Der Grund für den späten Umstieg: Bisher lag der gesamte Signalverarbeitungs‑Know-how bei Radar‑Tier‑1. Wie man aus einem FFT‑Spektrum Ziele extrahiert, Entfernungen schätzt oder Dopplergeschwindigkeiten filtert – all das steckte in der Firmware des Sensorchips. Die Entkopplung erfordert, dass nur noch die analoge Hochfrequenzstufe (MMIC) und ein einfacher ADC im Sensor verbleiben. Die vollständige Verarbeitung wandert in den SoC.

Neue Halbleiter treiben diese Entwicklung an: NXP hat einen speziellen Radar‑Bridge‑Chip vorgestellt und integriert RSP‑IP (Radar Signal Processing) direkt in ADAS‑SoCs. TI unterstützt mit seinen AWR‑Serien den RAW‑Daten‑Modus. Allerdings steigen die Anforderungen an den SoC: 12‑Kanal‑Radar‑FFT plus CFAR erzeugen eine enorme Rechenlast, die nur moderne Hochleistungs‑Chips bewältigen.

## Die drei Radartypen im Vergleich

**Millimeterwellenradar (4D‑Imaging‑Radar):** Hier konkurrieren zwei Pfade – ein kostengünstiger chinesischer mit „1 SoC + 2 MMIC“ (8T8R) und ein leistungsfähigerer europäischer mit „1 SoC + 4 MMIC“ (16T16R). Bis 2028 könnten sich bis zu 24T24R durchsetzen. Die größten Hürden sind nicht die Hardware, sondern der dynamische Aufbau der Algorithmus‑IP, die Portierung auf die SoC‑Plattform und die Optimierung des DSP für die ungewohnten Radardatenstrukturen.

**Lidar:** Eine offene Architektur spart Kosten, denn die teuren Signalprozessoren im Lidar (oft FPGA) entfallen. Übrig bleiben nur Lasertreiber, SPAD‑Empfänger und TDC‑Zeitgeber. Doch der Datenstrom eines 192‑Zeilen‑Lidars mit 3,6 Gbit/s überlastet bestehende MIPI‑Schnittstellen, die für Kamerabilder optimiert sind. Die auf Slots basierende Lidar‑Datenstruktur passt nicht in das Frame‑Modell der ISP‑Pipeline – viel CPU/GPU‑Rechenleistung geht verloren.

**Ultraschallsensor:** Die Verarbeitung ist simpel (Laufzeitverfahren). In der entkoppelten Architektur steigt die CPU‑Auslastung um rund 20 Prozent, die Detektionsreichweite wächst um 10 Prozent – durch feinere Matched‑Filter‑Algorithmen. Allerdings erfordert die hohe Kanalzahl (12+ Sensoren) viele SerDes‑Leitungen; ein Kompromiss ist die Kombination von lokaler Vorverarbeitung und zentraler Fusion, wie sie BYD einsetzt.

## Ausblick für die Branche

Die chinesische Automobilindustrie treibt den Trend zu offenen Datenpipelines voran: Vom Rohsignal bis zur Entscheidung gibt es keine Blackbox mehr. Nur mit vollständigen Rohdaten lassen sich Algorithmen trainieren, die die Leistungsunterschiede zwischen chinesischen und westlichen Systemen aufholen. Nach der Technologie der Kamera‑Bildverarbeitung wird nun die Sensorfusion radikal neu gedacht – eine Voraussetzung für Level‑3‑Autonomie.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
