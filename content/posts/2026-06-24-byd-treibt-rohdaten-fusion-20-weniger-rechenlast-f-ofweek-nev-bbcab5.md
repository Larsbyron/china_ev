---
title: "BYD treibt Rohdaten-Fusion: 20 % weniger Rechenlast für L3"
date: 2026-06-24T06:03:30.095Z
description: "BYD, NXP und TI forcieren eine zentrale Rohdaten-Fusion für Radar, Lidar und Ultraschall. Die neue Architektur senkt die Rechenlast um 20 % und entmachtet traditionelle Zulieferer – ein Schlüssel für kostengünstiges autonomes Fahren der Stufe 3."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Autonomes Fahren", "Sicherheit"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD treibt Rohdaten-Fusion: 20 % weniger Rechenlast für L3

Die chinesische Automobilindustrie arbeitet an einem grundlegenden Wandel der Sensorarchitektur für Fahrassistenzsysteme. BYD (比亚迪) hat bei seinen aktuellen Modellen eine Plattform eingeführt, die Rohdaten von Radar, Lidar und Ultraschall zentral auf einem System-on-a-Chip (SoC) verarbeitet. Bisher wertete jeder Sensor die Signale selbst aus – etwa durch FFT-Analyse oder Zielobjekt-Extraktion – und übergab nur abstrahierte Ergebnisse an das Steuergerät. Die neue Architektur überträgt stattdessen die unverarbeiteten Rohdaten (z. B. das Radarspektrum oder die Lidar-Punktwolke) über Hochgeschwindigkeits-SerDes-Leitungen an einen zentralen SoC. Dort fusioniert eine gemeinsame Algorithmik alle Informationen, wodurch widersprüchliche Meldungen – etwa „Radar sieht Hindernis, Kamera sieht keins“ – intelligent aufgelöst werden können. Laut BYD sinkt die Rechenlast für die Ultraschallsensorik um rund 20 %, die Erkennungsreichweite steigt um 20 % und die Punktdichte um den Faktor 10.

## Machtkampf um die Algorithmen
Der Wechsel zur Rohdaten-Fusion ist auch ein Machtkampf. Bisher hielten Tier-1-Zulieferer das Know-how zur Radar-Signalverarbeitung – etwa wie aus dem Frequenzspektrum Ziele extrahiert werden. Die neue Architektur entzieht ihnen diese Kontrolle: Der Sensor-Chip (MMIC) liefert nur noch die rohen I/Q-Daten, die Software wandert auf den zentralen SoC. Chip-Hersteller wie NXP und Texas Instruments unterstützen diesen Trend. NXP bietet mit dem „Radar Bridge“-Chip eine dedizierte Schnittstelle zwischen MMIC und SoC und integriert Radar-Signalverarbeitungs-IP (RSP IP) direkt in den ADAS-SoC. Damit können Algorithmen künftig als Software-IP auf dem Chip laufen – unabhängig von traditionellen Zulieferern. TI verfolgt mit seiner AWR-Serie einen ähnlichen Weg und unterstützt bereits den Rohdaten-Modus für die Integration in übergeordnete SoCs.

## Unterschiedliche Herausforderungen pro Sensor
**Millimeterwellen-Radar:** Die Umstellung auf Rohdaten erfordert hohe Bandbreite. China setzt oft auf ein kosteneffizientes 8T8R-Design (acht Sende- und acht Empfangskanäle), Europa tendiert zu 16T16R oder bereits 24T24R. Bis 2028 werden sich die Pfade annähern, doch die Kosten- und Anwendungsmodelle bleiben unterschiedlich. Die größte Hürde liegt in der Algorithmik und der Portierung auf den zentralen SoC – insbesondere die Anbindung per MIPI (ursprünglich für Kameras entwickelt) ist für die 3D-Datenstruktur von Radar nicht optimal.

**Lidar:** Hier ist der Kostendruck am höchsten, da der FPGA zur Signalverarbeitung im Sensor wegfällt. Ein 192-Linien-Scanner mit 10 Hz und 120° Sichtfeld erzeugt rund 3,6 Gbit/s Rohdaten – vergleichbar mit einem hochauflösenden Videostream. Die Datenstruktur (organisiert in Slots mit Messzyklen) unterscheidet sich grundlegend von Kamera-Frames, sodass bestehende DSP-Kerne für Bildverarbeitung ineffizient arbeiten. Langfristig könnten spezialisierte Beschleuniger nötig sein.

**Ultraschall:** Die Verarbeitung ist algorithmisch einfacher als bei Radar oder Lidar. Durch die zentrale Rohdatenverarbeitung kann eine feinere Matched-Filter-Suche durchgeführt werden. BYD gibt an, die Rechenlast um 20 % reduziert, die Reichweite um 20 % erhöht und die Punktdichte um den Faktor 10 verbessert zu haben – bei gleichzeitiger Kostenersparnis gegenüber einer vollständigen Dezentralisierung.

## Der Weg zu L3 und darüber hinaus
Die Rohdaten-Fusion ist ein zentraler Schritt für autonomes Fahren der Stufe 3 und höher. Nur mit den ungefilterten Rohdaten können Algorithmen Widersprüche auflösen und eine lückenlose Umgebungswahrnehmung aufbauen. Die chinesische Industrie setzt dabei auf offene, aber kontrollierte Schnittstellen: vom Sensor bis zur Entscheidung darf es keine Blackbox geben. Erste Serienanwendungen laufen bereits in Fahrzeugen von BYD, während Hersteller wie NXP und TI die nötige Chip-Infrastruktur liefern. Für den deutschen Markt bedeutet dies: Die Technologie wird in den kommenden Modellen chinesischer Marken sowie in globalen Plattformen europäischer Hersteller Einzug halten – mit entscheidenden Vorteilen in Sachen Sicherheit und Kosteneffizienz.

---

Die beschriebene Technologie ist ein branchenweiter Trend ohne spezifischen Modellbezug. Chinesische Hersteller wie BYD setzen sie bereits in Serienfahrzeugen ein. Eine Markteinführung in Europa erfolgt modellabhängig; erste Fahrzeuge mit dieser Architektur könnten ab 2026 erhältlich sein.
