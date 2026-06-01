---
title: "XPeng und NIO zentralisieren Radar-Daten – 20 % weniger Rechenlast"
date: 2026-06-01T21:24:57.188Z
description: "Chinesische Hersteller wie XPeng (小鹏), NIO (蔚来) und BYD (比亚迪) verlagern die Radar-Signalverarbeitung auf zentrale SoCs. Die neue Architektur spart Kosten, steigert die Sensorfusion und entmachtet Tier-1-Zulieferer. Erste Modelle wie der XPeng G9 sind bereits im Einsatz."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# XPeng und NIO zentralisieren Radar-Daten – 20 % weniger Rechenlast

Die chinesische Automobilindustrie treibt eine grundlegende Umstellung voran: Statt lokaler Vorverarbeitung in jedem Radarsensor fließen künftig rohe Messdaten (RAW Radar, FFT-Spektren) über Hochgeschwindigkeitslinks wie SerDes oder GMSL direkt in einen zentralen ADAS-SoC. Erst dort werden alle Sensorströme fusioniert und interpretiert. Dies verschiebt die Kontrolle über Fahrassistenz-Algorithmen endgültig von Tier-1-Zulieferern zu OEMs und Chipentwicklern.

Die Vorteile sind messbar: Systemtakt lässt sich um bis zu 20 % senken, die Reichweite der Umfelderkennung steigt um 20 % und die Punktdichte kann sich verzehnfachen. BYD (比亚迪) etwa erzielt in seinem aktuellen Fahrerassistenz-System diese Werte durch die zentrale Fusion von 4D-Radar- und Lidar-Rohdaten – ohne herstellerspezifische Blackboxen.

## Vom „Objekt-Listing“ zur vollständigen Sensorfusion

Bisher arbeiteten Radarsensoren weitgehend autonom: Sie sammelten Signale, führten FFT-Analysen durch und meldeten lediglich Objektlisten (z. B. „50 m voraus Hindernis“) an das Steuergerät. Das Ergebnis war ein reduzierter, oft widersprüchlicher Datensatz. In der neuen Architektur liefern alle Sensoren unverarbeitete Rohdaten – etwa Frequenzspektren oder RAW-Radar-Daten. Ein zentraler Algorithmus fusioniert sie zu einem konsistenten Umfeldmodell.

Ein Beispiel: Bei Regen wird ein Lidar-Signal durch Tropfen gestreut, ein 4D-Radar durchdringt das Wasser. Alte Systeme lieferten widersprüchliche Meldungen – die zentrale Fusion kann aus beiden Rohdaten ein konsistentes Bild berechnen, das mehr ist als die Summe der Einzelsignale. XPeng (小鹏) hat diesen Ansatz im G9 erstmals serienmäßig umgesetzt: Der Nvidia-Drive-Orin-SoC verarbeitet dort die RAW-Daten von fünf Radaren und zwei Lidaren direkt.

## Wer kontrolliert die Radar-IP? – Machtverschiebung zu Chip- und OEM-Seite

Die neue Architektur entkoppelt Hardware und Software. Im Radarsensor verbleiben nur noch MMIC (Hochfrequenz-Sende-/Empfangsteil) und ADC (Analog-Digital-Wandler) sowie eine einfache 1D-FFT. Die gesamte Signalverarbeitung wandert auf den zentralen SoC. Damit verlieren Tier-1-Zulieferer wie Bosch oder Continental ihr bisheriges Monopol auf Radar-Firmware-Code.

Chip-Hersteller treiben diesen Wandel voran: NXP bietet spezielle „Radar Bridge ICs“ an, die MMICs direkt an GMSL-Links anbinden. Gleichzeitig integrieren SoC-Designer zunehmend eigene Radar-Signalverarbeitungs-IP (RSP-IP) in den Hauptchip. NXPs RSP-IP etwa wird direkt auf ADAS-SoCs ausgeführt – die Algorithmus-Hoheit liegt dann beim OEM oder Chip-Entwickler. Auch Texas Instruments unterstützt mit seiner AWR-Serie das Streaming von RAW-Daten.

Die nächste Herausforderung: SoCs haben typischerweise MIPI-Schnittstellen, die für Kameras optimiert sind. Radardaten sind jedoch dreidimensional strukturierte Frames – ihre effiziente Verarbeitung erfordert angepasste DSP-Pipelines. Hersteller wie Mobileye und Horizon Robotics arbeiten an dedizierten Beschleunigern.

## Drei Radar-Typen – drei Entwicklungslinien

**4D-Radar (Bildradar):** Hier schreitet die Entwicklung am schnellsten voran. China setzt auf kostengünstige 8T8R-Architekturen („1 SoC + 2 MMIC“), während europäische Zulieferer 16T16R oder sogar 24T24R planen. Bis 2028 werden sich diese Pfade je nach Kostenmodell und Anwendungsszenario ausdifferenzieren.

**Lidar:** Bei Lidar ist der Schritt zur Zentralisierung besonders kostensensibel. Bisher entfallen bis zu 30 % der Sensorkosten auf die lokale Signalverarbeitung (FPGA, DSP). Wenn die Verarbeitung auf den SoC wandert, bleiben nur noch optische Komponenten (SPAD, TDC) im Sensor. Die Datenrate steigt – bei 192-Zeilen-Scannern auf über 3,6 Gbit/s (GMSL2). Die Herausforderung: Lidar-Daten nutzen eine völlig andere Struktur („slots“ statt Frames) als Kameras. Ohne angepasste Beschleuniger drohen Effizienzeinbußen.

**Ultraschallradar:** Am einfachsten umzusetzen. Hier entfällt die Signalverarbeitung komplett – nur noch Time-of-Flight-Daten fließen an den Zentralcomputer. BYD (比亚迪) hat dies in seinem aktuellen Fahrerassistenzsystem realisiert: Die zwölf Ultraschallsensoren liefern Rohdaten über zwei gemeinsame SerDes-Leitungen, die Systemtaktung sank um 20 %, die Punktdichte verzehnfachte sich.

## Fazit für den Leser

Die Entwicklung ist eindeutig: Radarsensoren werden zu reinen „Datenrohren“ ohne eigene Intelligenz. Die eigentliche Intelligenz wandert in den zentralen SoC. Damit gewinnen OEMs (wie XPeng, NIO, BYD) und Chipentwickler (Nvidia, NXP, TI) die Kontrolle über die Algorithmen, während traditionelle Tier-1-Zulieferer an Einfluss verlieren. Für deutsche Autofahrer bedeutet dies: Künftige chinesische Modelle werden auf Basis dieser Architektur flexiblere und günstigere Fahrassistenz-Updates bieten können.

---

Die beschriebene Architektur ist ein globaler Trend, der auch europäische Hersteller erreicht. Erste chinesische Modelle mit zentraler Sensorfusion (z. B. XPeng G9) sind in Europa erhältlich. Weitere Fahrzeuge von NIO, BYD und anderen Marken werden folgen. Die Technologie ist nicht an einen bestimmten Markt gebunden, sondern wird die gesamte Branche prägen.
