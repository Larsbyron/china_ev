---
title: "BYD-Architektur: Radar-Latenz um 20 % gesenkt"
date: 2026-06-14T06:30:29.638Z
description: "Chinas Automobilindustrie stellt die Sensorarchitektur um: Statt Einzelsensoren mit Blackbox-Algorithmen bringen Hersteller wie BYD die Rohdaten zentral in den ADAS-SoC. Ergebnis: 20 % weniger Verzögerung, 10-fach dichtere Punktwolken."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "Texas Instruments"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 2
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD-Architektur: Radar-Latenz um 20 % gesenkt

Bislang arbeiteten Sensoren wie Radar, Lidar und Kameras weitgehend autark: Jeder Sensor wertete seine Signale selbst aus und sendete nur abstrakte Ziellisten an das Steuergerät. Diese „verteilte Architektur" sparte Bandbreite, opferte aber rohe Umfeldinformation – etwa Feinheiten einer Wasserpfütze, die das Radar durchdringt, die Kamera aber blendet.

## Zentralfusion übernimmt die Kontrolle

Immer mehr chinesische Entwickler setzen auf eine zentrale Sensorfusion: Millimeterwellen-Radar (4D-Radar mit RAW-Ausgabe über GMSL), Lidar (Punktwolken mit Intensität und Doppler) und Kameras senden ihre Rohdaten ungefiltert an eine leistungsstarke ADAS-SoC. Dort vereint ein Algorithmus die Informationen durch Kreuzkorrelation. Ergebnisse: bessere Objekterkennung, robustere Ghost-Blocker und höhere Redundanz für autonomes Fahren der Stufen 2+ bis 3/4.

Die Umstellung ist komplex: Zulieferer wie NXP, TI oder Samsung müssen ihre Radar-Bridge- und DSP-IP direkt in die SoCs integrieren. Die Signalverarbeitungs-Know-how – etwa bei FFT, CFAR oder Doppler-Schätzung – wandert vom Sensor in den Chip. Zudem braucht es Hochgeschwindigkeits-Schnittstellen (GMSL2/SerDes), um Rohdatenströme von bis zu 12 Sensoren (je 3–6 Gbit/s) zu transportieren. Ein 192-Zeilen-Lidar erzeugt bei 10 Hz und 0,1° Auflösung rund 3,6 Gbit/s – das geht nur mit optimierter Kabeltopologie.

## Drei Sensorgruppen, drei Wege

* **Millimeterwellen-Radar**: Chinesische Hersteller setzen auf kostengünstige 8T8R-Lösungen (1 SoC + 2 MMIC), Europa plant 16–24 Kanäle. Die Vorverarbeitung (ADC, FFT) wandert aus dem Sensor in den SoC.
* **Lidar**: Statt FPGA-Board schickt der Sensor nur rohe SPAD-TDC-Daten. Der SoC übernimmt die gesamte Punktwolkenverarbeitung – das senkt die Hardwarekosten des Lidar-Sensors drastisch.
* **Kameras**: Die zentrale Verarbeitung der Rohbilder ist bereits Standard; die neuen Architekturen erlauben eine feinere zeitliche Korrelation mit Radar- und Lidar-Daten.

BYD gab für sein zentrales Fusionssystem konkrete Daten: Die Latenz sinkt um 20 %, die Erkennungsreichweite steigt um 20 %, die Punktwolkendichte wird um den Faktor 10 erhöht. „Wir wollen die Blackbox der klassischen Tier-1-Zulieferer öffnen", sagt ein BYD-Entwickler.

Der Trend zur Zentralisierung verschiebt die Wertschöpfung: Wer die Signalverarbeitungs-IP hält – NXP, TI oder neue Player – entscheidet über die nächste Generation der ADAS-Plattformen. Gleichzeitig müssen die SoCs massiv leistungsfähiger werden: Ein Chip muss gleichzeitig 12 Radar-Kanäle mit FFT und CFAR, Lidar-Punktwolken und Kamerabilder verarbeiten.

---

Die Technologieentwicklung findet in China statt, hat aber globale Auswirkungen. Deutsche Zulieferer wie NXP und TI sind direkt beteiligt. Die ersten Fahrzeuge mit dieser Architektur werden ab 2025 in China erwartet. Ein direkter Export nach Deutschland ist noch nicht absehbar, aber die Technologie wird die nächste Generation von Assistenzsystemen weltweit prägen.
