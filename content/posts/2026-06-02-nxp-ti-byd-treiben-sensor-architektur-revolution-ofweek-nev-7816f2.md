---
title: "NXP, TI, BYD treiben Sensor-Architektur-Revolution"
date: 2026-06-02T06:30:23.250Z
description: "Chinesische Hersteller und Zulieferer stellen die Sensorarchitektur für autonomes Fahren um: Statt dezentraler Vorverarbeitung werden Rohdaten von Radar, Lidar und Kamera zentral fusioniert. Das verbessert die Umfelderkennung, verlagert aber die Algorithmenmacht von Tier-1 zu Chip- und Systemanbiete"
source: "OFweek NEV"

category: "news"

brands: ["NXP", "Texas Instruments", "BYD"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# NXP, TI, BYD treiben Sensor-Architektur-Revolution

Chinas Automobilindustrie erlebt einen grundlegenden Wandel in der Sensorarchitektur für assistiertes und autonomes Fahren. Bisher verarbeiteten Radar-, Lidar- und Kamerasensoren die Rohdaten weitgehend eigenständig und lieferten nur vorverarbeitete Ergebnisse an das zentrale Steuergerät (ECU). Doch nun setzt sich ein neues Paradigma durch: Die zentrale Fusion aller Rohdaten in einem leistungsstarken System-on-a-Chip (SoC).

## Was ist die neue Sensor-Architektur?
Bisher arbeiteten Sensoren weitgehend autark. Ein Radarsensor führte selbstständig FFT-Analysen und Zielerkennung durch und meldete „50 Meter voraus ein Hindernis". Die zentrale ECU erhielt nur gefilterte Daten – eine Art „Behauptung" statt der vollständigen Messung. Der Nachteil: Bei widersprüchlichen Meldungen – etwa Radar erkennt nichts, Lidar meldet Hindernis – konnte das System nicht auf die Rohdaten zurückgreifen, um die Diskrepanz aufzulösen.

Die neue Architektur dreht den Prozess um: Die Sensoren – insbesondere Radar und Lidar – liefern nun ihre Rohdaten (RAW-Daten) an eine zentrale Recheneinheit. Diese führt die gesamte Signalverarbeitung und Fusion einheitlich durch. Das ermöglicht eine deutlich intelligentere Datenfusion: Radardaten mit höherer Durchdringungsfähigkeit (z. B. bei Nebel oder Regen) können direkt mit Kamera-oder Lidar-Daten verrechnet werden – Stichwort „wer lügt, wer sagt die Wahrheit". Statt „1+1=2" kann so „1+1=5" werden, also eine echte Leistungssteigerung.

## Warum jetzt? – Algorithmenmacht verlagert sich
Der Hauptgrund für den Wandel liegt in der Verschiebung der Algorithmen-Hoheit. Bisher lag das Know-how für Radarsignalverarbeitung fast ausschließlich bei den Tier-1-Zulieferern. Sie definierten, wie aus dem FFT-Spektrum Ziele extrahiert werden. Die Fahrzeughersteller erhielten nur die fertigen Daten – ohne Einblick in die Verarbeitung.

Diese Macht verlagerte sich nun zu den Chip-Herstellern und Systemintegratoren. NXP (恩智浦) hat mit dem Radar Bridge einen speziellen Brückenchip entwickelt, der zwischen MMIC und SerDes sitzt und das Radar-Signal-Processing-IP (RSP IP) direkt in den ADAS-SoC integriert. Texas Instruments (德州仪器) verfolgt einen ähnlichen Weg: Seine AWR-Radar-Chips unterstützen bereits den RAW-Daten-Modus. Auch BYD (比亚迪) treibt die Entwicklung voran und meldet bei seinen Testfahrzeugen eine Reduzierung der Rechenzeit um knapp 20 % und eine Erhöhung der Umfeld-Detektionsdichte um 10 Prozentpunkte.

Die Herausforderung: SoCs mit 12 Radar-Kanälen müssen FFT, CFAR und andere Algorithmen bewältigen – das erfordert leistungsfähige DSP-Architekturen, die nicht auf Kamera-Frame-Strukturen ausgelegt sind. Radarrohdaten sind meist 2D- oder 3D-Matrizen, die sich fundamental von Kamerabildern unterscheiden. Die Integration in MIPI-Schnittstellen und die effiziente Verarbeitung auf CPU/GPU bleibt eine offene Frage.

## Drei Sensortypen – drei Wege
Die zentrale Architektur betrifft Radar, Lidar und Ultraschall unterschiedlich:

- **4D-Radar (毫米波雷达):** Zwei Wege zeichnen sich ab. Chinesische Hersteller setzen auf ein SoC plus zwei MMICs (8T8R) für Kostenvorteile. Europäer planen mit einem SoC plus vier MMICs (16T16R) bis hin zu 24T24R bis 2028. Die Herausforderung liegt nicht in der Hardware, sondern in der Algorithmus-Integration: Wer liefert das Radar-Signal-IP? Kann es auf dem SoC-Plattform portiert und validiert werden?

- **Lidar (激光雷达):** Hier ist der Schritt zur zentralen Architektur einfacher, da das FPGA zur Signalverarbeitung einen hohen Kostenblock darstellt. Durch Verlagerung in den SoC entfallen FPGA und teure Komponenten. Allerdings bringt Lidar Datenmengen von bis zu 3,6 Gbit/s (192 Linien, 10 Hz, 120° Sichtfeld) mit sich. GMSL2 mit 6 Gbit/s reicht knapp. Die Datenstruktur (Slots statt Frames) erfordert spezielle DSP-Verarbeitung, die nicht von Kameras übernommen werden kann.

- **Ultraschall (超声波雷达):** Die Verarbeitung ist simpel – Laufzeitmessung statt komplexer Signalverarbeitung. Bei zentraler Architektur können rohe Echoprofile statt vorverarbeiteter Daten übertragen werden. Das senkt die Rechenlast im Sensor, erhöht aber den Datenstrom. Ein Kompromiss: dezentrale Vorverarbeitung an der Stoßstange mit anschließender Aggregation. BYD gibt hierbei einen Zeitgewinn von knapp 20 % und eine Erhöhung der Detektionsreichweite um 20 % an – eine Mischung aus „zentral + dezentral".

Die chinesische Automobilindustrie ist dabei, die Macht über die Datenpipeline neu zu verteilen – von der Rohdaten-Erfassung bis zur finalen Entscheidung. Damit werden Blackboxen der Tier-1 aufgelöst. Algorithmen können auf vollständigen Daten trainieren und Fahrzeuge besser auf L2+- bis L3-Niveau bringen – ein entscheidender Schritt für das autonome Fahren der nächsten Generation.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
