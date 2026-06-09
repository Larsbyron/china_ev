---
title: "[QA FAILED] Autonomes Fahren: China setzt auf offene Sensor-Architektur"
date: 2026-06-09T06:03:38.154Z
description: "Chinesische Hersteller ersetzen geschlossene Sensorsysteme durch zentrale Rohdaten-Fusion. Das verspricht bessere Leistung, verlagert aber die Algorithmen-Kompetenz von Tier-1 zu Autoherstellern und Chip-Designern."
source: "OFweek NEV"

category: "news"


tags: []
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# [QA FAILED] Autonomes Fahren: China setzt auf offene Sensor-Architektur

Ein tiefgreifender Wandel in der chinesischen Automobilindustrie: Statt einzelner „intelligenter" Sensoren setzen immer mehr Hersteller auf eine **zentrale Fusionsarchitektur**. Dabei liefern Kameras, Lidar und Radargeräte ihre Rohdaten an einen leistungsstarken Zentralrechner (SoC), der sie gemeinsam verarbeitet. Bisher wertete jeder Sensor für sich aus und lieferte nur abstrahierte Objektlisten – typisch für die „verteilte" Architektur.  

## Vorteile der Rohdaten-Fusion
Die neue Architektur bringt entscheidende Vorteile. Beispiel: Ein Radarstrahl wird von Wasser zerstäubt, ein Lidar-Punkt erreicht das Ziel doch – im alten System entsteht ein Widerspruch. In der zentralen Fusion gleicht die Software die Stärken beider Sensoren aus: „1+1 kann 5 ergeben", heißt es in der Branche. So werden nicht nur mehr Objekte erkannt, sondern auch deren Bewegung und Beschaffenheit präziser bestimmt (etwa ob ein Hindernis ein weicher Müllsack oder ein harter Stein ist).

## Machtverschiebung bei der Algorithmen-Kontrolle
Bisher lag die Signalverarbeitung – etwa FFT, Zielerkennung und Doppler-Auswertung bei Radargeräten – fest in der Hand der Tier-1-Zulieferer (wie Bosch, Continental, aber auch chinesischen Unternehmen). Mit der Rohdaten-Architektur rückt diese Kompetenz zu den Autoherstellern und den SoC-Designern (z. B. NXP, TI). NXP hat einen speziellen „Radar Bridge"-Chip vorgestellt, der die Schnittstelle zwischen MMIC (Hochfrequenz-Baustein) und ADAS-SoC bildet. Gleichzeitig integrieren Chiphersteller Radar-Signalverarbeitungs-IP (RSP) direkt in ihre SoCs – so können Algorithmen künftig als fertige Hardware-Blöcke auf dem Chip laufen.

## Drei Sensortypen, drei Herausforderungen
- **Radar**: Chinesische Hersteller setzen auf günstige 8T8R-Konfigurationen (1 SoC + 2 MMICs), Europa plant mit 16T16R oder sogar 24T24R. Der Algorithmus, nicht die Hardware, wird zum entscheidenden Differenzierungsmerkmal.  
- **Lidar**: Hochauflösende 192-Linien-Lidare liefern 3,6 Gbit/s Rohdaten pro Sekunde – ähnlich wie ein 4K-Videostream. Die Datenstruktur (Slot-basiert statt Frame-basiert) passt nicht zu herkömmlichen MIPI-Schnittstellen, die für Kameras optimiert sind. Effiziente Verarbeitung erfordert spezielle DSP-Pipelines.  
- **Kameras**: Hier ist die Fusion am einfachsten, da die Algorithmen (z. B. Time-of-Flight) bereits auf dem SoC laufen können. Allerdings steigt die CPU-Last um bis zu 20 %, wenn Kamerarohdaten detailliert gematcht werden müssen.  

## Zukunftsausblick
Die chinesische Automobilindustrie treibt den Trend zu **vollständig transparenten Sensordaten-Pipelines** voran – kein Blackbox-Sensor mehr, sondern offene Rohdaten vom Messkopf bis zur Entscheidungslogik. Das ermöglicht leistungsfähigere Fahrassistenzsysteme und ebnet den Weg zu höheren Autonomiestufen (L3/L4). Bis etwa 2028 werden sich die verschiedenen Architekturen (8T8R vs. 24T24R) je nach Kostenmodell und Anwendungsfall ausdifferenzieren.

---

Diese Technologieentwicklung betrifft die globale Automobilindustrie. Eine spezifische Fahrzeugverfügbarkeit in Europa ist nicht gegeben. Chinesische Hersteller und Zulieferer treiben die Entwicklung voran, die mittelfristig auch in europäischen Modellen Einzug halten könnte.
