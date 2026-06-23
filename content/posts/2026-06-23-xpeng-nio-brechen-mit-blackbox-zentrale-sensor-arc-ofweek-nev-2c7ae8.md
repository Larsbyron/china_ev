---
title: "XPeng & NIO brechen mit Blackbox: Zentrale Sensor-Architektur ab 2026"
date: 2026-06-23T19:54:35.346Z
description: "Chinesische Autohersteller wie XPeng (小鹏) und NIO (蔚来) setzen ab 2026 auf eine zentrale Sensorarchitektur, die rohe Radar- und Lidardaten direkt an den SoC liefert. Damit umgehen sie die Blackbox traditioneller Tier-1-Zulieferer und verbessern die Sensorfusion deutlich."
source: "OFweek NEV"

category: "news"

brands: ["Huawei", "BYD", "NXP", "Texas Instruments"]
tags: ["Reichweite", "Hybrid", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# XPeng & NIO brechen mit Blackbox: Zentrale Sensor-Architektur ab 2026

**Technologiewandel bei chinesischen E-Autos: Rohdaten statt Objektlisten**

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel in der Sensorarchitektur für Fahrassistenzsysteme. Bisher arbeiteten Millimeterwellenradar (mmWave), Lidar und Ultraschallsensoren weitgehend autonom: Jeder Sensor führte eine eigene Signalverarbeitung durch (z. B. FFT, Zielverfolgung) und sendete nur eine reduzierte Objektliste („50 m voraus Hindernis“) über einen SerDes-Bus an das Steuergerät. Dabei ging Detailinformation verloren – etwa Streuverluste durch Regen oder die Unterscheidung zwischen einem stehenden Fahrzeug und einer Metallplatte.

Die neue Architektur überträgt dagegen die vollständigen Rohdaten – beim mmWave-Radar das FFT-Spektrum, beim Lidar die Punktwolke mit Intensität und Zeitstempel – an eine leistungsstarke System-on-Chip-Einheit (SoC). So können Algorithmen mehrere Sensoren fusionieren, statt sich auf widersprüchliche Einzelmeldungen verlassen zu müssen. XPeng (小鹏) setzt in seiner XNGP-Architektur bereits auf diese zentrale Verarbeitung, NIO (蔚来) nutzt den Adam-Supercomputer für die gleiche Aufgabe. Der Effekt: „1+1 kann dann 5 ergeben“, beschreibt ein Entwickler den Synergiegewinn.

**Warum erst jetzt? – Algorithmen-Know-how wandert zu SoC und OEM**

Der Grund für die späte Einführung liegt in der etablierten Arbeitsteilung: Tier-1-Zulieferer wie Bosch oder Continental hielten jahrelang die Signalverarbeitungs-Know-how in ihren Radar- und Lidar-Modulen unter Verschluss. Die neue Architektur reduziert das Modul auf die reine Hardware – MMIC (Monolithic Microwave Integrated Circuit), Sende-/Empfangseinheit, ADC – und schiebt alle Algorithmen in den SoC. Chiphersteller wie NXP treiben diesen Wandel mit speziellen Bridge-Chips (Radar Bridge) und integrierter Signalverarbeitungs-IP (RSP IP) in ADAS-SoCs voran. Auch TI unterstützt mit seinen AWR-Serien-Radarchips den RAW-Daten-Ausgang.

Für L3/L4-Autonomes Fahren ist die Rohdaten-Fusion unverzichtbar. „Ein Ziel- Tracking auf Basis von Objektlisten reicht nicht mehr aus. Wir brauchen die rohen Zeit- und Frequenzinformationen, um bewegte Ziele von statischen Hindernissen oder gar Schlaglöchern zu unterscheiden“, erklärt ein Entwicklungsingenieur eines chinesischen OEMs. Li Auto (理想) und Huawei (华为) mit seiner MDC-Plattform verfolgen ebenfalls diesen Weg.

**Die drei Sensor-Typen im Detail**

- *Millimeterwellenradar*: Am weitesten fortgeschritten. 4D-Imaging-Radar setzt auf Multi-Chip-Architekturen. Chinesische Hersteller favorisieren eine günstige Route (1 SoC + 2 MMIC = 8T8R), Europäer setzen auf 1 SoC + 4 MMIC (16T16R). Bis 2028 werden beide Pfade koexistieren.
- *Lidar*: Die Verlagerung der Signalverarbeitung auf den SoC spart Kosten, da teure FPGA-Schaltungen im Lidar-Modul entfallen. Chinesische Hersteller wie Hesai und RoboSense liefern bereits Module mit reinem SPAD-Array und MIPI-Ausgang. Die Herausforderung: Die Datenstruktur von Lidar (2D-Array aus Slots) unterscheidet sich fundamental von Kamerabildern (Frame-orientiert), was SoC-Architekturen und DSP-Schleifen optimiert werden muss.
- *Ultraschall*: Rohdaten vereinfachen die Auswertung. BYD (比亚迪) meldet für sein neues System eine um 20 % niedrigere Rechenzeit, 20 % mehr Reichweite und zehnfache Punktdichte. Das Unternehmen setzt auf eine hybride Architektur: lokale Vorverarbeitung plus zentrale Fusion.

**Ausblick: Neue Fahrzeuge ab 2026**

Erste Serienmodelle mit dieser Architektur werden ab 2025/2026 von XPeng (etwa das Flaggschiff-Modell X9) und NIO (die ET7-Baureihe) erwartet. Auch BYD plant die Integration in seine vollelektrische Han-Reihe. Die Algorithmen-Kontrolle liegt dann endgültig beim OEM – die Blackbox der Tier-1-Zulieferer ist aufgebrochen.

---

Die Technologie wird zunächst in China eingeführt. Europäische Modelle chinesischer Marken wie BYD und NIO mit dieser Architektur werden frühestens 2026 erwartet – zunächst in China, dann im Export.
