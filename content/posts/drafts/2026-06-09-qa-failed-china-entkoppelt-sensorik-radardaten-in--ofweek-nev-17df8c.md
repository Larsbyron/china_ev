---
title: "[QA FAILED] China entkoppelt Sensorik: Radardaten in Zentralcomputer"
date: 2026-06-09T12:32:19.391Z
description: "Chinesische Hersteller verlagern die Signalverarbeitung von Radar- und Lidarsensoren in zentrale Steuergeräte. Statt verdichteter Zieldaten liefern Sensoren nun Rohdaten für bessere Sensorfusion. Ein Paradigmenwechsel in der autonomen Fahrzeugarchitektur."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] China entkoppelt Sensorik: Radardaten in Zentralcomputer

Die chinesische Automobilindustrie treibt einen grundlegenden Wandel in der Fahrassistenz-Architektur voran. Anstatt dass jeder Radarsensor seine Daten eigenständig verarbeitet und nur abstrahierte Objektlisten an das zentrale Steuergerät sendet, gehen Hersteller nun den umgekehrten Weg: Die Sensoren liefern rohe Rohdaten – etwa FFT- oder Doppler-Spektren – direkt an einen leistungsstarken ADAS-SoC (System-on-a-Chip). Dieser übernimmt die gesamte Sensorfusion und Algorithmenverarbeitung zentral.

## Warum der Wechsel?
Bislang dominierten Tier-1-Zulieferer die Signalverarbeitung: Jeder Radarsensor enthielt eigene Mikrocontroller mit proprietärer Firmware. Der Zentralcomputer erhielt nur gefilterte, verlustbehaftete Daten. Die neue „entkoppelte“ Architektur hingegen erlaubt eine echte Rohdatenfusion. Beispiel: Ein Millimeterwellenradar (MMW) durchdringt Regen besser als ein Lidar, ein Lidar liefert höhere Auflösung. Erst im Zentralrechner lassen sich beide Datenströme so kombinieren, dass das Gesamtergebnis mehr ist als die Summe der Einzelsignale.

Technisch bedeutet das: Der Radar-Chip (MMIC) führt nur noch rudimentäre Vorverarbeitung durch (z. B. 1D-FFT). Die gesamte eigentliche Verarbeitung – Zielerkennung, CFAR (Constant False Alarm Rate), Geschwindigkeitsschätzung – wandert auf den SoC. Das erfordert leistungsfähige Chip-Architekturen: NXP bietet spezielle Radar-Bridge-ICs und Radarsignalverarbeitungs-IP (RSP IP) für ADAS-SoCs an. TI unterstützt mit seinen AWR-Serien ebenfalls direkte RAW-Datenausgabe. Der Vorteil: Systeme für höhere Automatisierungsstufen (L3/L4) benötigen keine vorgefilterten Listen, sondern originale Punktwolken- und Dopplerdaten, um bewegte Objekte wie Zweiräder oder gestapelte Container zuverlässig zu erkennen.

## Drei Sensortypen – unterschiedliche Herausforderungen

1. **Millimeterwellenradar (MMW):** Wichtigster Kandidat für die Entkopplung. Chinesische Hersteller setzen auf kosteneffiziente 8T8R-Konfigurationen (1 SoC + 2 MMIC), europäische Hersteller planen 16T16R oder sogar 24T24R. Der Algorithmus-Wettbewerb: Wer besitzt die beste Radar-IP – der SoC-Hersteller oder der Tier-1? Zudem passen MIPI-Schnittstellen, die für Kameras optimiert sind, nicht ideal zur 2D-Matrixstruktur von Radardaten.

2. **Lidar:** Hier entfallen teure FPGA-basierte Signalprozessoren im Sensor. Stattdessen liefern SPAD-Arrays (Single Photon Avalanche Dioden) mit TDC (Time-to-Digital Converter) Rohdaten über MIPI. Moderne 192-Linien-Lidare erzeugen 3,6 Gbps pro Sekunde – vergleichbar mit einem hochauflösenden Videostream. Die Datenstruktur (slots statt Frames) erfordert spezielle DSP-Verarbeitung im SoC.

3. **Ultraschallsensor:** Die Signalverarbeitung (z. B. Laufzeitmessung) ist simpel, doch im zentralen Modell steigt die CPU-Last um 20 %. Dafür gewinnt man an Genauigkeit durch angepasste Korrelationsfilter. Praktisch nutzen Hersteller eine Hybrid-Architektur: Lokale Vorverarbeitung in der Stoßstange plus zentrale Datenfusion – ein Kompromiss zwischen Latenz und Kosten.

## Fazit: Vom Blackbox-Sensor zur offenen Datenpipeline
Die chinesische Industrie zielt darauf ab, die gesamte Datenkette vom Sensor-Rohsignal bis zur Entscheidungsfindung ohne Blackbox zu gestalten. Nur mit unverfälschten Rohdaten können Algorithmen das Maximum an Umfelderkennung erreichen – ein entscheidender Schritt für den Übergang von L2+ zu L3. Auch deutsche Hersteller beobachten diese Entwicklung aufmerksam und arbeiten an ähnlichen zentralisierten Architekturen.

*Hinweis: Preise und Reichweiten entfallen bei diesem Branchenthema.*

---

Diese Entwicklung ist ein globaler Branchentrend. Auch deutsche Automobilhersteller wie BMW, Mercedes-Benz und Audi arbeiten an vergleichbaren zentralisierten Sensor-Architekturen für zukünftige Assistenzsysteme.
