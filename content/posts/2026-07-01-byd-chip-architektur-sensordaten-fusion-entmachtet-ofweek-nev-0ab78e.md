---
title: "BYD-Chip-Architektur: Sensordaten-Fusion entmachtet Zulieferer"
date: 2026-07-01T12:30:46.063Z
description: "Chinesische Hersteller verlagern Radarsignalverarbeitung ins Zentralrechner-SoC. Das ermöglicht 20 % mehr Reichweite und 10 % mehr Zielerkennung – ein Paradigmenwechsel für ADAS."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Hybrid", "Sicherheit"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD-Chip-Architektur: Sensordaten-Fusion entmachtet Zulieferer

Chinesische Automobilhersteller treiben die Zentralisierung der Fahrerassistenzsysteme (ADAS) massiv voran. Statt wie bisher jede Radarantenne mit einem eigenen Signalprozessor auszustatten, fließen künftig die Rohdaten aller Sensoren – Millimeterwellen-Radar, 4D-Radar, Lidar und Kamera – direkt in eine zentrale Recheneinheit (SoC). BYD (比亚迪) nennt diese Architektur „Auge des Himmels" (天神之眼). Das Ziel: die algorithmische Kontrolle vom Tier-1-Zulieferer zurück ins Fahrzeug und damit in die Hand des Herstellers zu holen.

## Zentralrechner statt verteilter Intelligenz

Bisher arbeitet jeder Radarsensor autonom: Er erfasst Signale, führt eine schnelle Fourier-Transformation (FFT) durch, erkennt Ziele und gibt nur die verkürzte Information „Ziel in 50 Metern Entfernung" an das Steuergerät weiter. Dadurch gehen wertvolle Rohdaten verloren. Die neue Architektur verlagert die gesamte Signalverarbeitung – von der Rohdatenaufnahme über die FFT bis zur finalen Fusion – in den zentralen ADAS-SoC. Das ermöglicht eine echte Sensordatenfusion statt einer bloßen Objektlisten-Kombination. 

BYD demonstriert dies an einem Beispiel: Ein Wasserfilm vor dem Fahrzeug reflektiert das 77-GHz-Radar, während das 4D-Radar (Millimeterwellen-Radar mit Höheninformation) die Wasseroberfläche durchdringt. Im alten System stünden widersprüchliche Meldungen – „kein Hindernis" vs. „Hindernis erkannt". Im neuen System fusioniert der Algorithmus beide Rohdatensätze und erkennt: Es handelt sich um eine Wasserpfütze, die für die Fahrsicherheit irrelevant ist. Statt 1+1=2 entsteht so ein Mehrwert von 1+1=5.

## Algorithmisches Wettrennen: SoC vs. Zulieferer

Der Schlüssel zu diesem Wandel liegt in der Chip-Architektur. Halbleiterhersteller wie NXP bieten mit ihrem Radar Bridge eine spezielle Brücke zwischen MMIC (Hochfrequenz-Chip) und SerDes, die die Rohdatenübertragung optimiert. Gleichzeitig integrieren immer mehr ADAS-SoCs dedizierte Radar-Signalverarbeitungs-IP (RSP IP) direkt auf dem Chip. Damit können Hersteller die Radarsignalverarbeitung ohne Umweg über den Tier-1-Zulieferer selbst programmieren. 

Besonders für höhere Automatisierungsstufen (L3/L4) reichen Objektlisten nicht mehr aus. Die Unterscheidung zwischen einer Plastiktüte und einem Betonblock erfordert Rohdaten – Spektralanalyse, Mikro-Doppler-Profile. „Früher hätte die SoC-Rechnung mit 12 Radar-Kanälen den Chip überlastet. Heute sind die Prozessoren stark genug", erklärt ein BYD-Entwickler. 

## Drei Wege zur Zentralisierung

Die Industrie verfolgt aktuell drei konkurrierende Strategien:

**1. 4D-Millimeterwellen-Radar (4D-MMRadar)**  
- Der Einstieg in die Multi-Chip-Architektur ist vollzogen. Zwei Hauptströmungen:  
  - **China-Low-Cost-Route:** 1 SoC + 2 MMIC → 8 Sende- und 8 Empfangskanäle (8T8R)  
  - **Europa-High-End-Route:** 1 SoC + 4 MMIC → 16T16R, zukünftig bis 24T24R  
- Bis 2028 werden sich beide Linien treffen. Entscheidend ist die Algorithmus-IP: Wer besitzt die Radar-IP? Kann sie auf verschiedenen SoC-Plattformen portiert werden? Wie effizient arbeitet der DSP mit Radar-Datenstrukturen (zeitliche Slots statt Bild-Frames)?

**2. Lidar (Laser-Radar)**  
- Hier ist die Zentralisierung besonders einfach: Der optische Teil (Laser, SPAD-Array, TDC) bleibt im Sensor, die gesamte Signalverarbeitung wandert ins Zentral-SoC.  
- **Problem:** Ein 192-Linien-Lidar mit 10 Hz Bildrate und 0,1° Auflösung erzeugt 3,6 Gbit/s Rohdaten pro Sekunde – das entspricht einem unkomprimierten 4K-Videostream. Die GMSL2-Schnittstelle kommt damit an ihre Grenzen. Zudem ist die Datenstruktur (zeitliche Slots mit Hüllkurven und Phase) völlig anders als das Rasterbild einer Kamera – DSP-Kerne können diese Daten nicht effizient verarbeiten, CPU/GPU brauchen zu viel Zeit.

**3. Ultrabreitband-Radar (UWB-Radar)**  
- Die Signalverarbeitung ist hier am einfachsten (Laufzeitdifferenz-Verfahren). Allerdings steigt durch die Zentralisierung der Zeitaufwand im SoC um rund 20 %, dafür steigt die Zielerkennungsdichte um 10 %.  
- **Herausforderung:** Jede UWB-Antenne benötigt eine eigene SerDes-Leitung – bis zu 12 Leitungen für ein Fahrzeug. Kostentreiber und Steckerproblem. Praktisch setzt sich eine Hybridlösung durch: dezentrale Vorverarbeitung in einem Gateway im Stoßfänger, dann zentrale Datenfusion im Hauptrechner.

BYD hat mit seiner „Mittelweg"-Lösung einen Kompromiss gefunden: Die Zeitersparnis beträgt 20 %, die Erkennungsreichweite steigt um 20 %, die Zielerdichtung um 10 %. Zwischen vollständiger Dezentralisierung und vollständiger Zentralisierung positioniert sich BYD in einer intelligenten Zwischenebene.

## Fazit: Der industrielle Machtwechsel

Die chinesische Automobilindustrie treibt den Übergang von verteilter zu zentraler Sensorarchitektur massiv voran. Rohdaten fließen direkt zur Entscheidungsinstanz – ohne Blackbox dazwischen. Je mehr Rohdaten zur Verfügung stehen, desto besser können Algorithmen trainiert werden. Das schließt die Lücke zu den besten Systemen der Konkurrenz. Nach den Kameras folgen nun Radar und Lidar – der nächste Schritt auf dem Weg zum vollautonomen Fahren (L3 und höher).

---

## In Europa

Diese Technologieentwicklung ist in Europa noch nicht direkt in Fahrzeugen verfügbar. Allerdings arbeiten auch europäische Zulieferer wie Bosch, Continental und Mobileye an ähnlichen zentralisierten Sensorarchitekturen. Eine direkte Markteinführung eines chinesischen Fahrzeugs mit dieser Architektur in Europa ist bislang nicht angekündigt.
