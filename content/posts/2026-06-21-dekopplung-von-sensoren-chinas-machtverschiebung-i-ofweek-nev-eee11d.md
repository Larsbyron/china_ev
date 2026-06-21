---
title: "Dekopplung von Sensoren: Chinas Machtverschiebung in der Autoindustrie"
date: 2026-06-21T12:08:03.773Z
description: "Chinesische Autohersteller und Start-ups trennen Radarsignalverarbeitung von den Sensoren – hin zu zentralen SoCs. Das verlagert die Algorithmus-Kompetenz von Tier-1-Lieferanten zu Fahrzeugherstellern und verändert die Branchenstruktur."
source: "OFweek NEV"

category: "news"


tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Dekopplung von Sensoren: Chinas Machtverschiebung in der Autoindustrie

Chinas Automobilindustrie erlebt einen grundlegenden Wandel: Die bisherige „verteilte Sensor-Architektur" wird durch eine zentralisierte „decoupled" Struktur ersetzt. Während früher jeder Millimeterwellen-Radar, Lidar oder Kamera seinen eigenen Mikrocontroller oder FPGA zur Signalvorverarbeitung besaß, werden diese Komponenten nun zu reinen Datensammlern degradiert. Die Rohdaten – von FFT-Spektren über Point Clouds bis hin zu Roh-Bildern – werden über SerDes-Leitungen an einen leistungsstarken ADAS-System-on-Chip (SoC) gesendet, der sämtliche Sensorfusion und Objekterkennung übernimmt.

Dieser Schritt ist technisch anspruchsvoll, aber strategisch entscheidend. In der alten Architektur erhielt die Zentrale nur aufbereitete „Berichte" wie „vorne 50 Meter Hindernis". Dabei gingen Details verloren, etwa die Unterscheidung zwischen einem echten Objekt und Streueffekten. Mit Rohdaten dagegen kann der Algorithmus mehrere Sensoren auf Bildebene fusionieren – etwa schwache Millimeterwellen-Radarechos mit starken Lidar-Punkten kombinieren. „1+1 kann 5 ergeben", beschreiben Brancheninsider das Potenzial.

## Warum jetzt? – Algorithmus-Rechte wechseln den Besitzer

Der Hauptgrund für die Verzögerung war die mächtige Position der Tier-1-Zulieferer. Lange Zeit hielten sie das Wissen um die Radar-Signalverarbeitung – wie FFT-Berechnung, Zieldetektion, Doppler-Geschwindigkeit – tief in ihrer Firmware verborgen. Die Automobilhersteller bekamen nur die fertigen Ergebnisse, nicht die Rohdaten. Jetzt ändert sich das: Seit Chip-Anbieter wie NXP eigenständige Radar-Bridge-ICs (zwischen MMIC und SerDes) und integrierte Radar-Signalverarbeitungs-IP (RSP) in ihre ADAS-SoCs einbauen, können die Autohersteller die Algorithmen selbst steuern. TI unterstützt mit seinen AWR-Serien offene RAW-Datenausgabe.

Für höhere autonome Fahrstufen (L3/L4) reichen die alten fusionierten Objektlisten jedoch nicht mehr. „Man braucht Rohdaten-Doppler-, Entfernungs-, Winkel-Spektren, um bewegliche Ziele wie Fußgänger oder Motorräder sicher von stehenden Hindernissen wie Leitplanken oder Steinen zu unterscheiden", erklären Entwickler. Die Rechenleistung der SoCs ist heute stark genug, um zwölf Radar-Kanäle mit FFT und CFAR zu verarbeiten.

## Drei Sensor-Typen, drei Herausforderungen

### Millimeterwellen-Radar (4D-Radar)
Der chinesische Markt verfolgt zwei Wege: Kostengünstige Lösung („1 SoC + 2 MMIC") für 8T8R (8 Sende-, 8 Empfangskanäle) und Hochleistungslösung („1 SoC + 4 MMIC") für 16T16R (bis zu 24T24R in Europa geplant). Bis 2028 werden beide Pfade koexistieren, mit unterschiedlichen Kostenmodellen und Einsatzszenarien.

### Lidar
Die Decoupling-Architektur führt dazu, dass das teure FPGA oder DSP im Lidar entfällt. Stattdessen liefert der Lidar nur Roh-Punktwolken über MIPI oder GigE. Die Herausforderung: Lidar-Daten sind deutlich datenintensiver – 192-Linien-Scanner mit 10 Hz und 120° horizontalem Sichtfeld erzeugen 3,6 Gbit/s pro Frame. Die Struktur ist völlig anders als Kameradaten (Frame-basiert) – Lidar organisiert Daten in Slots. Effiziente Verarbeitung auf dem SoC erfordert angepasste DSP-Pipelines.

### Kamera (Bildsensoren)
Die Kamera profitiert am einfachsten, da CMOS-Sensoren bereits MIPI-Lieferungen unterstützen. Durch die Zentralisierung entfällt der ISP im Sensor. Der SoC übernimmt die Bildverarbeitung. Allerdings steigt die CPU/GPU-Last um etwa 20 % aufgrund der Rohdatenverarbeitung.

## Zwischen Dezentral und Zentral: Kompromisse

Einige Hersteller wie BYD setzen auf eine hybride Lösung: Ein vorderer und ein hinterer lokaler Controller sammeln jeweils sechs Sensordaten und leiten sie aggregiert an die Zentrale weiter. So bleiben die Vorteile der Rohdatenverarbeitung erhalten, ohne dass jedes Kabel einzeln verlegt werden muss. Dies senkt die Timing-Synchronisationskomplexität und die Kabelkosten.

Fazit: Die chinesische Automobilindustrie treibt die Entkopplung der Sensordatenpipeline voran – vom Rohsignal bis zur Entscheidung im zentralen SoC, ohne Blackbox. Nur mit vollständigen, unbearbeiteten Daten entfaltet die KI ihr volles Potenzial. Nach den Kameras werden nun auch Radar und Lidar nachziehen – und damit den nächsten Schritt zu echtem L2+ und L3 auf chinesischen Straßen ermöglichen.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.

(Anmerkung: Der Artikel beschreibt eine technologische Entwicklung in der chinesischen Industrie, nicht ein konkretes Fahrzeug. Die Auswirkungen könnten jedoch auch europäische Zulieferer und Hersteller betreffen.)
