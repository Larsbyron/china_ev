---
title: "Sensor-Revolution: China setzt auf zentrale Rohdatenverarbeitung"
date: 2026-06-05T19:44:41.631Z
description: "Chinesische Hersteller wechseln von verteilter zu zentraler Sensor-Architektur. Rohdaten von Radar, Lidar und Kamera werden direkt in einem SoC fusioniert – das verspricht bessere Umfelderkennung, aber birgt technische Hürden."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Sicherheit"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Sensor-Revolution: China setzt auf zentrale Rohdatenverarbeitung

In der chinesischen Automobilindustrie zeichnet sich ein Paradigmenwechsel ab: Weg von der dezentralen Sensor-Architektur mit eigenständigen Signalprozessoren in jedem Sensor hin zu einer zentralen „Raw-Daten“-Fusion. Dabei werden unverarbeitete Sensordaten – etwa Radar-Zwischenfrequenzsignale oder Lidar-Punktwolken – über Hochgeschwindigkeitsverbindungen (z. B. SerDes) direkt an eine zentrale Recheneinheit (SoC – System-on-a-Chip) gesendet. Erst dort erfolgt die komplette Wahrnehmungsalgorithmik, inklusive Sensorfusion.

## Warum der Wechsel zur zentralen Architektur?

Bisher arbeiteten Radarsensoren weitgehend autonom: Signalakquisition, FFT-Berechnung, Zielerkennung und Geschwindigkeitsschätzung fanden im Sensor selbst statt. Die ausgegebenen Daten waren keine Rohdaten, sondern bereits gefilterte „Ziel-Listen“ (z. B. „50 Meter voraus ein Hindernis“). Diese Vorverarbeitung verursachte jedoch Informationsverluste – schwache oder reflektierte Ziele gingen verloren. Bei der zentralen Architektur hingegen gehen alle Rohdaten in einen Topf: Ein Millimeterwellen-Radar, das Wasser reflektiert, liefert andere Messwerte als ein Kamerasystem. Erst die gemeinsame, lernfähige Fusion im SoC kann solche Widersprüche auflösen – „1 + 1 kann 5 ergeben“, wie Entwickler sagen.

## Algorithmische Kontrolle wechselt von Tier‑1 zu OEMs

Historisch kontrollierten Tier‑1-Lieferanten wie Bosch oder Continental die Radarsignalverarbeitung – ihr Know-how war in der Sensor-Firmware („Blackbox“) versteckt. Mit der zentralen Architektur übernehmen die Autohersteller selbst die Algorithmik. Sie benötigen nur noch die reine Hardware: den Hochfrequenzchip (MMIC) und den ADC-Wandler. Die gesamte 1D-FFT und Zielsuche wandert in den SoC.

Dieser Schritt wird durch neue Chips ermöglicht: NXP bietet mit „Radar Bridge“ einen speziellen Bridge-Chip zwischen MMIC und SoC; TI stellt Rohdaten-fähige AWR-Radar-ICs bereit. Auch IP-Blöcke für Radar-Signalverarbeitung (RSP IP) werden direkt in ADAS-SoCs integriert. Das erlaubt OEMs, eigene, optimierte Algorithmen zu entwickeln – etwa für L3/L4-Level-Autonomie, die hochaufgelöste Umweltmodelle benötigt.

## Drei Sensortypen im Vergleich

**Millimeterwellen-Radar (4D-Radar):** Die Hardware ist ausgereift. Unterschiedliche Pfade: In China dominiert die preiswerte „1 SoC + 2 MMIC“-Konfiguration (8T8R), während europäische Hersteller auf „1 SoC + 4 MMIC“ (16T16R) setzen oder sogar 24T24R planen. Bis 2028 werden sich die beiden Architekturen trennen – Kosten und Anwendungen unterscheiden sich grundlegend. Die große Herausforderung liegt jedoch in der Algorithmik: Wer besitzt die Radar-Signalverarbeitungs-IP? Und wer kann sie effizient auf dem SoC portieren und verifizieren? Radar-Daten (3D- oder 4D-Tensoren) passen nicht in das für Kamera-Bilder optimierte MIPI-Interface – DSP-Kerne müssen speziell angepasst werden.

**Lidar:** Bei der zentralen Architektur entfällt der teure FPGA-basierte Signalprozessor im Lidar-Sensor. Übrig bleiben Laserdiode, SPAD-Empfänger und TDC – die Rechenleistung wandert ins Fahrzeug-Zentralrechner. Allerdings benötigt ein typischer 192-Linien-Lidar bei 10 Hz und 0,1° Auflösung etwa 3,6 Gbps Rohdaten. GMSL2 mit 6 Gbps reicht zwar; die Datenstruktur (zeitliche Slots statt Kamerabild-Frames) erfordert jedoch eine eigene DSP-Architektur – die Performance von CPU/GPU-basierten Lösungen ist suboptimal.

**Ultraschallsensor:** Die Algorithmik ist einfach (Laufzeitmessung). In der zentralen Architektur steigt die CPU-Last um rund 20 %, aber die Erkennungsreichweite erhöht sich um das 10-Fache, da feinere Korrelationsfilter möglich sind. Ein Problem: 12 Sensoren benötigen 12 SerDes-Leitungen, das verteuert die Verkabelung. Praktische Lösungen kombinieren lokale Vorverarbeitung (je Stoßstange ein Controller) mit zentraler Fusion – so bleibt der Aufwand beherrschbar.

## Fazit: Die chinesische Industrie fordert Transparenz

Die neue Architektur eliminiert die Blackbox der Tier‑1-Lieferanten: Vom Rohsignal bis zur Entscheidung gibt es keine undurchsichtigen Zwischenschritte. Nur unverfälschte Daten erlauben maximale Leistungsfähigkeit der Algorithmen – und damit mehr Sicherheit für autonome Fahrfunktionen der Stufen L2 bis L3. Chinesische Hersteller haben hier einen technologischen Vorsprung, den sie nun auch in globalen Märkten ausspielen könnten.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt. Die beschriebene Architektur-Entwicklung betrifft vorerst nur den chinesischen Markt und die dort aktiven OEMs und Zulieferer.
