---
title: "Perception-Dekopplung: China treibt radikal neue Sensor-Architektur"
date: 2026-06-10T06:18:48.806Z
description: "Chinesische Autoindustrie setzt auf dezentrale Sensorik: Rohdaten von Radar & Lidar direkt in den Zentralrechner. Die neue Architektur steigert Fusionseffizienz, stellt aber enorme Anforderungen an Datenbandbreite und Chip-Leistung."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "Texas Instruments"]
tags: []
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Perception-Dekopplung: China treibt radikal neue Sensor-Architektur

Die chinesische Automobilindustrie treibt eine grundlegende Neuordnung der Sensor-Architektur voran: Statt wie bisher Radarsignale lokal in den Sensoren vorzuverarbeiten, sollen künftig die Rohdaten direkt an eine zentrale Recheneinheit (SoC) übertragen werden. Dieser als „entkoppelte Perception-Architektur" bezeichnete Ansatz verspricht deutlich präzisere Fusionsergebnisse, da die Algorithmen nicht mehr auf bereits verdichtete, verlustbehaftete Objektlisten angewiesen sind.

### Vom „kleinen Rechner" im Sensor zur zentralen Verarbeitung

Bisher arbeitet jeder Millimeterwellen-Radar (mmWave) als eigener „Mini-Rechner": Signalverarbeitung inklusive FFT, Zielerkennung und Geschwindigkeitsmessung fanden direkt im Mikrocontroller des Sensors statt. Nach außen gesendet wurde nur eine Liste mit „N Zielen". Das Problem: Diese Verdichtung löscht etwa Rauschen, Mehrwegeffekte oder die Phaseninformation – Informationen, die für eine vollständige Fusionsverarbeitung eigentlich wertvoll wären.

Die neue Architektur verlegt die gesamte Signalverarbeitung auf den zentralen ADAS-SoC. Die Sensoren liefern nur noch „nackte" Rohdaten – etwa den FFT-Frequenzgitter-Vektor (Range-Doppler-Map) oder das RAW-Daten-Echo (I/Q-Daten). Das ermöglicht eine echtzeitfähige, pixelgenaue Fusion aller Sensorarten.

### Warum erst jetzt? Der Algorithmus-Kampf um die Hoheit

Der Grund für den späten Wechsel liegt im hart umkämpften Markt der Radarsignalverarbeitung. Traditionell kontrollierten Tier-1-Zulieferer (wie Bosch, Continental, Hella) die proprietären Algorithmen zur Zielerkennung aus den Radar-Rohdaten. Diese waren in den Sensor-Gehäusen fest verdrahtet – ein Blackbox-Geschäft.

Lösungen von NXP (z. B. Radar-Bridge-Chip) und TI (AWR-Serie) ermöglichen nun den Zugriff auf die Rohdaten über GMSL- oder MIPI-Schnittstellen. Gleichzeitig erlauben leistungsfähigere SoCs die Verarbeitung der massiven Datenmengen. Die Folge: Der Algorithmus wandert vom Tier-1 ins Haus der Fahrzeughersteller – oder in die Hände der SoC-Designer.

### Millimeterwellen-Radar: von 8T8R bis 24T24R

Im Bereich des 4D-Millimeterwellen-Radars zeichnen sich zwei Entwicklungslinien ab:
- **China-Weg:** Kosteneffizient mit Bausteinen wie „1 SoC + 2 MMIC" für 8T8R (8 Sende-/8 Empfangskanäle). Ziel: 6–8 Grad Auflösung.
- **Europa-Weg:** Hochperformant mit „1 SoC + 4 MMIC" für 16T16R (16T16R). Langfristig planen europäische Anbieter sogar 24T24R-Systeme, die ab etwa 2028 verfügbar sein könnten.

Die Herausforderung: Die Datenstruktur des Radars (mehrdimensionale Arrays nach Slot-Organisation) passt nicht in das für Kameras optimierte MIPI-Frame-Format. Der DSP muss daher speziell für diese Datenformate ausgelegt werden – sonst sinkt die Effizienz drastisch.

### Lidar: Satte Rohdaten, volle Bandbreite

Bei Lidar wird die Entkopplung noch anspruchsvoller. Ein 192-Linien-Lidar mit 10 Hz, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt pro Bild etwa 3,6 Gbit an Daten (Punktwolke mit Distanz, Intensität, Reflexion für jeden Punkt). GMSL2 mit 6 Gbit/s reicht gerade so – Störungen und Latenz werden zur Herausforderung.

Zudem ist die Datenstruktur des Lidars fundamental anders als die eines Kamera-Frames: 1200 Slots pro Frame, jeder Slot mit mehreren Returns. Eine einfache Einspeisung über MIPI-Kamera-Interface führt zu bitteren Performance-Verlusten im DSP.

### Ultraschall: Einfach, aber nicht trivial

Ultraschall-Sensoren (Parkpiepser) sind algorithmisch simpel – meist reicht eine Laufzeitmessung (Time-of-Flight) für die Abstandserkennung. In der entkoppelten Architektur übernimmt der Zentralrechner auch hier die komplette Korrelationsfilterung. Ergebnis: Die Messgenauigkeit steigt, doch die Rechenlast könnte um 20 % zunehmen. Die Zahl der benötigten SerDes-Paare wächst rapide, wenn jedes Piezo-Element einzeln angeschlossen wird.

### Fazit: Der Kampf um den Datenkern

Die chinesische Autoindustrie erkennt zunehmend: Nur wer die Rohdaten aller Sensoren – vom Millimeterwellen-Radar bis zum Lidar – in einem vereinheitlichten System verarbeitet, kann die für Level‑2+ bis Level‑3 notwendige Zuverlässigkeit erreichen. Der Trend zur entkoppelten Architektur bedeutet eine Machtverschiebung: Die Algorithmen-Know-how wandert von den Tier-1-Zulieferern hin zu Chip-Entwicklern und Fahrzeugherstellern, die eigene ADAS-Software-Plattformen bauen. Für deutsche Autobauer bedeutet dies: Sie müssen ihre Sensorstrategie und Datenverarbeitung grundlegend überdenken, wenn sie im globalen Wettbewerb nicht den Anschluss verlieren wollen.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
