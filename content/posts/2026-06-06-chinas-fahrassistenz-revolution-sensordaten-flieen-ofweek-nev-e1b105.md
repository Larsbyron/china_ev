---
title: "Chinas Fahrassistenz-Revolution: Sensordaten fließen zentral"
date: 2026-06-06T05:49:38.839Z
description: "Chinesische Hersteller setzen auf zentrale Sensorfusion: Rohdaten statt gefilterter Reports. Das verschiebt die Macht von Tier-1 zu OEMs – und bringt neue Herausforderungen für SoCs."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Chinas Fahrassistenz-Revolution: Sensordaten fließen zentral

Die chinesische Automobilindustrie treibt den Wandel hin zu einer zentralisierten Fahrassistenz-Architektur voran. Statt jedes Radar und jeden Lidar seine eigene „kleine Gehirn"-Einheit verarbeiten zu lassen, sollen künftig alle Sensordaten als Rohsignale an eine gemeinsame Rechenplattform gesendet werden. Das verspricht bessere Sensorfusion und mehr Leistung – vor allem in komplexen Verkehrssituationen.

Bisher arbeiteten Millimeterwellenradare, Lidar und Kameras weitgehend autark. Jeder Sensor führte eigene Algorithmen wie FFT, Zielerkennung oder Doppler-Berechnung intern aus und sendete nur die reduzierte „Abschlussmeldung" an das Steuergerät. Dabei gingen wertvolle Informationen verloren – etwa die Rohsignatur eines Zieles, die zwischen Radartypen fusioniert werden könnte. Mit der zentralen Architektur ändert sich das: Die SoC (System-on-Chip) empfängt alle Rohdaten über Highspeed-Links und wendet dort die Gesamtalgorithmen an. Beispiel: Ein Millimeterwellenradar erkennt ein Hindernis, ein Lidar sieht eine Wasserlache – im dezentralen Fall ein Widerspruch, im zentralen Fall fusionieren beide Signale zu einem plausiblen Objekt.

## Machtverschiebung: Tier-1 verlieren Algorithmen-Kontrolle

Bislang lag das Know-how der Radarsignalverarbeitung komplett bei den Zulieferern (Tier-1). Sie entschieden, wie aus FFT-Spektren Ziele extrahiert, wie Clutter gefiltert und Geschwindigkeiten berechnet werden – alles verschlüsselt in der Firmware. Der OEM bekam nur die fertige Objektliste. Die zentrale Architektur zwingt die Tier-1, ihre Rohdaten freizugeben – ein gewaltiger Einschnitt. Chiphersteller wie NXP bieten inzwischen spezielle Bridge-Chips (Radar Bridge) an, die das Rohsignal per SerDes direkt an die SoC weiterleiten. Auch TI unterstützt mit seinen AWR-Serien diesen Weg.

Doch die Herausforderung ist enorm: Statt nur einer Objektliste pro Radar müssen die SoC nun zwölf oder mehr Radarkanäle samt Datenraten von mehreren Gbps bewältigen. Die klassischen, für Kamerabilder optimierten MIPI-Schnittstellen passen nicht zu den organisierten Radar-Rahmendaten (Frame-Burst mit Slots). Hinzu kommt: Für High-End L3/L4-Funktionen braucht man Rohdaten mit feiner Doppler- und Mikrobewegungsauflösung, um etwa Radfahrer oder Schlaglöcher zu erkennen. Der Rechenaufwand steigt drastisch.

## Drei Sensortypen, drei Wege

**Millimeterwellenradar (4D-Radar)**:
China setzt auf Kosteneffizienz: ein SoC plus zwei MMIC ergibt 8T8R. Europa plant mit einem SoC plus vier MMIC (12–16T16R), erste Hersteller bereits 24T24R. Bis 2028 könnten sich die Wege spalten – mit komplett unterschiedlichen Kostenmodellen. Entscheidend ist, wer die Radar-Algorithmen-IP besitzt: Tier-1 oder die SoC-Hersteller. NXP baut seine RSP-IP direkt in die SoC ein – das könnte eine neue Mauer errichten.

**Lidar**:
Hier ist der Schritt zur zentralen Architektur am saubersten. Der bisherige FPGA-basierte Lidar-Prozessor wird durch einen SoC ersetzt. Die Rohdaten – Emission, SPAD-Empfang, TDC – werden direkt an den SoC gesendet. Die Geräte arbeiten mit 192 Zeilen, 10 Hz, 120° Sichtfeld und 0,1° Auflösung. Die Datenrate pro Lidar beträgt 3,6 Gbps – vergleichbar mit einer HD-Videospur. Auch hier ist die Datenstruktur (Slots mit Wellenform) völlig anders als Kamerabilder – DSPs müssen umdenken.

**Ultraschall-Sensor**:
Die Algorithmen sind simpler (Laufzeitmessung). Durch die Zentralisierung steigt der Zeitaufwand auf etwa 20 %, dafür verbessert sich die Detektionsreichweite um über 40 %. Ein großer Nachteil: jeder Sensor braucht einen eigenen SerDes-Link – teuer und komplex. Eine Mischlösung mit lokalen Sub-Hubs und zentralem Gateway gilt als pragmatischer Weg, den BYD bereits testet: 20 % mehr Zeit, 20 % mehr Reichweite, 10 % mehr Dichte – ein „teils zentral, teils verteilt"-Ansatz.

## Fazit

Die chinesische Automobilindustrie drängt darauf, die gesamte Datenpipeline von der Rohsignalerfassung bis zur Entscheidungsfindung zu kontrollieren – ohne Blackbox. Nur so entfalten Algorithmen ihr volles Potential. Nachdem die Kamera bereits zentralisiert wurde, folgen nun Radar und Lidar. Der Wettlauf um die beste Sensorfusion hat begonnen – und er wird über den Erfolg von L2+ und L3 entscheiden.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
