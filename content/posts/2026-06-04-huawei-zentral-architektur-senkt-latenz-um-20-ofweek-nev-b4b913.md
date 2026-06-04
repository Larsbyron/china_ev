---
title: "Huawei: Zentral-Architektur senkt Latenz um 20 %"
date: 2026-06-04T12:43:03.542Z
description: "Huawei treibt die Zentral-Architektur für autonomes Fahren voran: Rohdaten aller Sensoren werden in einem SoC fusioniert. Das senkt die Latenz um 20 % und steigert die Punktdichte um das Zehnfache – ein Paradigmenwechsel in der chinesischen Industrie."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Huawei: Zentral-Architektur senkt Latenz um 20 %

Huawei (华为) und weitere chinesische Hersteller forcieren den Umstieg auf eine zentrale Rechnerarchitektur (Zentral-Architektur) für autonomes Fahren. Statt verteilter Sensoren mit eigener Vorverarbeitung sollen alle Rohdaten – von Radar, Lidar, Kamera und Ultraschall – in einem leistungsstarken System-on-Chip (SoC) fusioniert werden. Das verspricht eine deutlich bessere Sensorfusion und eine grundlegende Verschiebung der Algorithmus-Kompetenz von klassischen Zulieferern (Tier-1) hin zu Halbleiter- und Systementwicklern.

Bisher arbeiteten Sensoren weitgehend autark: Ein Radarsensor führte selbstständig FFT-Analysen und Zielerkennung durch und meldete nur abstrakte Ergebnisse wie „Hindernis 50 m voraus“ an das Steuergerät. Gingen dabei wertvolle Rohdaten verloren (etwa die exakte Form oder Beschaffenheit eines Objekts), entstanden widersprüchliche Meldungen – etwa „Radar sieht Hindernis, Kamera nicht“. In der Zentral-Architektur hingegen liefern die Sensoren nur die unverarbeiteten Rohsignale über High-Speed-Verbindungen (SerDes, GMSL) an den SoC. Dort laufen alle Daten in einer einheitlichen Algorithmus-Umgebung zusammen, sodass die Stärken jedes Sensors kombiniert werden können – robuste Radarpenetration durch Regen mit der hohen Detailauflösung eines Lidars.

## Technische Schlüsselwerte der Zentral-Architektur

- **Latenzsenkung**: Rund 20 % geringere Verzögerung durch Wegfall lokaler Vorverarbeitung.
- **Punktdichte**: Steigerung um das Zehnfache – aus Rohdaten gewonnene Raumpunkte liefern feinere Umgebungsinformationen.
- **Erkennungsreichweite**: Zunahme um etwa 20 % dank optimierter Algorithmen im SoC.
- **Datenrate**: Ein 192-Linien-Lidar erzeugt bereits 3,6 Gbit/s Rohdaten – die heutige GMSL2-Schnittstelle (6 Gbit/s) ist damit ausgelastet.

## Huawei und die Neuverteilung der Algorithmus-Hoheit

Der Wandel betrifft vor allem die drei Sensorarten unterschiedlich:

**Radar (4D-Millimeterwellen-Radar):** Bisher lag die Signalverarbeitung (FFT, Zielidentifikation) fest in der Hand von Tier-1-Zulieferern wie NXP und TI. Mit der Zentral-Architektur geben diese nur noch die rohen MMIC-Daten (Hochfrequenz-Sendeempfänger + ADC) an den SoC weiter. NXP hat bereits spezielle Radar-Bridge-Chips und RSP-IP (Radar Signal Processing) für ADAS-SoCs angekündigt. TI unterstützt mit seinen AWR-Radar-Chips ebenfalls Rohdatenausgabe. Doch die Herausforderung: Datenorganisation (Radar-Slots vs. Kamera-Frames) und Schnittstellen müssen harmonisiert werden. Für L3/L4-Level reichen listenbasierte Zielobjekte nicht mehr aus – es braucht Rohdaten für feinere Klassifikation (z. B. Unterscheidung von Pfütze, Stein oder Schlagloch).

**Lidar:** Die Umstellung ist am direktesten. Bisher entfiel ein Großteil der Kosten auf FPGA-basierte Signalverarbeitung im Sensor. Mit Zentral-Architektur entfallen FPGA und DSP – übrig bleiben reine Hardware-Komponenten (Emitter, SPAD-Empfänger, TDC). Huaweis 192-Linien-Lidar (erhältlich in Modellen wie dem AITO M9) erzeugt bei 10 Hz Bildrate und 120° Sichtfeld rund 3,6 Gbit/s Rohdaten – für GMSL2 noch machbar. Allerdings unterscheidet sich die Datenstruktur (zeitbasierte Slots) grundlegend von Kameraframes; effiziente Verarbeitung auf CPU/GPU erfordert spezielle DSP-Anpassungen.

**Ultraschallsensor:** Hier ist die Algorithmik einfacher (Laufzeitmessung). Die Zentral-Architektur bringt Zeitersparnis (ca. 20 %) und höhere Punktdichte (10×), da feinere Matching-Filter möglich werden. Praktisch setzt sich ein Mischmodell durch: Lokale Vorsammlung mehrerer Sensoren mit anschließender zentraler Fusion – das spart Kabel und Schnittstellenkosten.

Huawei selbst nennt folgende Verbesserungen: Latenz −20 %, Erkennungsreichweite +20 %, Punktdichte x10. Die chinesische Autoindustrie arbeitet damit an einer „offenen Architektur“ ohne Blackbox – Algorithmus-Know-how wandert von Tier-1 zu Systementwicklern und Chip-Herstellern. Erst mit rohen Sensordaten können Algorithmen ihr volles Potenzial entfalten – eine Grundvoraussetzung für den nächsten Schritt von L2+ zu L3.

---

Die beschriebene Zentral-Architektur wird von chinesischen Herstellern wie Huawei (192-Linien-Lidar) und Halbleiterfirmen (NXP, TI) vorangetrieben. Eine direkte Markteinführung eines kompletten Fahrzeugs mit dieser Architektur in Deutschland steht noch nicht fest, doch Komponenten wie Huaweis Lidar finden sich bereits in Modellen der HIMA-Allianz (AITO, Luxeed), die in Deutschland nicht erhältlich sind.
