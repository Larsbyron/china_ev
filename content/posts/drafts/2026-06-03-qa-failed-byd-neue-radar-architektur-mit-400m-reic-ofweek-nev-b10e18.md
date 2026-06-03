---
title: "[QA FAILED] BYD: Neue Radar-Architektur mit 400m Reichweite"
date: 2026-06-03T20:49:45.426Z
description: "Chinesische Autohersteller setzen auf zentrale Sensorarchitektur. Rohdaten von Radar und Lidar werden gemeinsam verarbeitet – Reichweite 400 Meter, Punktdichte zehnfach höher."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] BYD: Neue Radar-Architektur mit 400m Reichweite

Die chinesische Automobilindustrie vollzieht einen grundlegenden Paradigmenwechsel in der Sensorarchitektur für Fahrassistenzsysteme (ADAS). Statt wie bisher jedes Radar- und Lidarmodul eigenständig Daten vorzuverarbeiten, fließen die Rohsignale künftig zentral in ein leistungsstarkes Steuergerät (SoC). BYD (比亚迪) zeigt in diesem Zusammenhang eine Architektur, bei der ein 4D-Millimeterwellenradar (4D-MMW) eine Reichweite von 400 Metern und eine zehnfach höhere Punktdichte erreicht – ein Sprung, der mit verteilter Verarbeitung nicht möglich wäre.

## Vorteil zentraler Rohdatenverarbeitung

Bisher arbeiteten Radarsensoren dezentral: Jeder Sensor führte eigenständig Signalakquisition, FFT-Berechnung und Zielextraktion durch und übergab nur eine reduzierte Zielliste an das Steuergerät. Dies führte zu Informationsverlusten – etwa wenn ein Millimeterwellenradar ein Ziel nicht erkennt, während ein Bildradar es detektiert. Die zentrale Architektur dagegen überträgt unverarbeitete Rohdaten (z. B. FFT-Spektren, Radar-RAW-Daten) über SerDes-Leitungen an den zentralen SoC. Dort können Algorithmen die Stärken beider Sensortypen kombinieren, ähnlich der Fusion von Radar- und Kameradaten. „1+1 kann hier 5 ergeben", heißt es in Branchenkreisen.

## Warum der Wandel? Algorithmus-Kontrolle wechselt zu OEMs

Der Schlüssel liegt in der Verlagerung der Signalverarbeitung. Bisher hielten Tier-1-Zulieferer wie Bosch oder Continental das Know-how zur Radarsignalverarbeitung in ihren Black-Box-Firmwaren. Die neue Architektur zwingt die Zulieferer, lediglich die RF-Frontend (MMIC) und den ADC-Baustein zu liefern; die gesamte Signalverarbeitung und Objektfusion wandert in den SoC des Fahrzeugherstellers. Dadurch erlangen OEMs die volle Kontrolle über die Algorithmen. Chiphersteller wie NXP (mit Radar-Bridge und RSP-IP) und TI (AWR-Serie mit RAW-Unterstützung) unterstützen diese Entwicklung bereits mit dedizierten Schnittstellen. Für höhere Autonomiestufen (L3/L4) werden Rohdaten benötigt, um auch komplexe Szenarien wie überlappende Ziele oder statische Hindernisse sicher zu erkennen.

## Drei Sensortypen im Vergleich

### Millimeterwellenradar

Die 4D-MMW-Radare entwickeln sich in zwei Preis-Leistungs-Richtungen: Chinesische Hersteller setzen auf ein 8T8R-Design (1 SoC + 2 MMIC) für Kostenvorteile; europäische Anbieter planen 16T16R oder sogar 24T24R. Bis 2028 werden sich diese Wege noch stärker ausdifferenzieren. Die Herausforderung liegt nicht in der Hardware, sondern in der Anpassung der Algorithmen an die neue Plattform und der Effizienz der DSP-Architektur für die radarspezifische Datenstruktur (Multi-Slot, Multi-Chirp).

### Lidar

Lidar profitiert besonders von der zentralen Architektur, da der teure FPGA zur Signalverarbeitung im Sensor entfallen kann. Moderne 192-Linien-Lidare erzeugen je nach Framerate (z. B. 10 Hz, 120° Sichtfeld) bis zu 3,6 Gbit/s Rohdaten – ein Datensatz, der mit GMSL2 noch beherrschbar ist. Allerdings ist die Datenstruktur (zeitliche Slots mit Distanz, Intensität, Geschwindigkeit) völlig anders als bei Kameras (Frame-basiert). Die reine Rechenleistung reicht nicht; die Speicherzugriffsmuster müssen optimiert werden.

### Ultraschall-Radar

Ultraschallsensoren (zur Nahbereichserkennung) sind algorithmisch simpler: Sie nutzen Laufzeitmessung ohne aufwändige Signalverarbeitung. Bei zentraler Architektur steigt der Rechenaufwand für die Laufzeitkorrelation um rund 20 %, was aber durch feinere Matching-Filter mehr Informationen liefert. Die größte Hürde sind 12 parallele SerDes-Leitungen pro Stoßfänger – ein Verkabelungs- und Kostenproblem. BYD (比亚迪) schlägt einen „Hybrid-Ansatz" vor: Vorverarbeitung im Sensor, Datenzusammenführung auf einer Zwischenebene, dann zentrale Verarbeitung. Dabei sinkt die Latenz um 20 %, die Reichweite steigt um 20 % und die Punktdichte verzehnfacht sich – ein Kompromiss zwischen „voll zentral" und „voll dezentral".

## Fazit

Chinas Autoindustrie durchbricht die Black-Box-Praxis der Zulieferer. Indem sie den gesamten Datenpfad vom Rohsignal bis zur Entscheidung kontrolliert, legt sie die Basis für die nächste Generation von Fahrassistenzsystemen – von L2+ bis L3. Hersteller wie BYD zeigen, dass der Wandel technisch machbar ist und immense Leistungssprünge ermöglicht.

---

In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
