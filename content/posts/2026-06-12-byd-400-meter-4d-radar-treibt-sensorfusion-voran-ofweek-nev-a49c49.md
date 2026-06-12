---
title: "BYD: 400-Meter-4D-Radar treibt Sensorfusion voran"
date: 2026-06-12T19:59:15.837Z
description: "Die chinesische Autoindustrie treibt einen Paradigmenwechsel in der Sensor-Architektur voran: Statt dezentraler Vorverarbeitung liefern Sensoren nun Rohdaten an zentrale Rechner. Das erhöht die Fusiongüte und entmachtet Zulieferer."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: 400-Meter-4D-Radar treibt Sensorfusion voran

Die chinesische Automobilindustrie steht vor einem grundlegenden Wandel in der Fahrassistenz-Technologie: Weg von dezentralen Sensoren mit eigener Signalverarbeitung hin zu einer zentralisierten Architektur, bei der Sensoren nur noch Rohdaten liefern und die gesamte Algorithmik auf einem leistungsstarken SoC (System-on-Chip) läuft. Dieser Schritt wird als „sensorenseitige Knochenstrukturänderung" bezeichnet und hat weitreichende Folgen für die Wertschöpfungskette.

Laut BYD (比亚迪) werden die bislang typischen „Intelligenzverluste" durch die Vorverarbeitung in den Sensoren beseitigt. Ein Beispiel: Ein Millimeterwellenradar mit 1,6 km Reichweite und 4D-Fähigkeiten kann bis zu 400 Meter weit erkennen und liefert in der zentralisierten Architektur nicht mehr nur die Meldung „Hindernis in 50 Metern", sondern die komplette Rohsignalkette inklusive des FFT-Spektrums. Dadurch kann die Fusions-Algorithmik widersprüchliche Informationen aus verschiedenen Sensoren – etwa Radar und Lidar – intelligent zusammenführen, statt sich mit gefilterten Daten begnügen zu müssen.

## Warum jetzt? – Algorithmus-Kontrolle verlagert sich

Der Treiber hinter diesem Wandel ist die Machtverschiebung zwischen Autoherstellern und Tier-1-Zulieferern. Bislang hielten Zulieferer wie Bosch oder Continental die Algorithmen für Radar- und Lidar-Signalverarbeitung unter Verschluss. Mit der neuen Architektur übernehmen die Hersteller selbst die Kontrolle über die zentrale Verarbeitung. Halbleiterfirmen wie NXP und Texas Instruments unterstützen diesen Trend: NXP bietet mit dem Radar Bridge einen speziellen Chip, der das MMIC mit dem SerDes verbindet, und integriert Radar-Signalverarbeitungs-IP (RSP) direkt in ADAS-SoCs. Texas Instruments bietet in seiner AWR-Serie bereits Rohdaten-Unterstützung für höhere Automatisierungsstufen (L3/L4) an.

Allerdings gibt es technische Hürden: SoC-Schnittstellen wie MIPI sind für Kameras optimiert, nicht für die radarspezifischen 2D- oder 3D-Datengitter. Die Effizienz der DSP-Kerne muss sich erst noch beweisen.

## Drei Sensortypen – drei Herausforderungen

### Millimeterwellenradar: Schnell, aber schwierig zu standardisieren
In China setzt man auf eine kosteneffiziente Route: 1 SoC + 2 MMIC = 8T8R (acht Sende-, acht Empfangskanäle). Europa geht den umgekehrten Weg: 1 SoC + 4 MMIC = 16T16R, teilweise sogar 24T24R geplant. Bis 2028 werden sich die beiden Pfade weiter differenzieren – mit unterschiedlichen Kosten- und Leistungsprofilen.

### Lidar: Teure Hardware, komplexe Datenstruktur
Bei Lidar ist die Umstellung auf zentrale Verarbeitung besonders radikal. Bislang übernahm ein FPGA die Signalverarbeitung; künftig übernimmt der zentrale SoC. Ein 192-Zeilen-Lidar mit 10 Hz Bildrate, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt pro Frame 3,6 Gbit/s Daten – das entspricht etwa einem 4K-Videostream in Echtzeit. Die Datengranularität (Hz + Slot) unterscheidet sich fundamental von Kameradaten, sodass vorhandene DSPs nicht optimal ausgelastet sind.

### Ultraschall-Radar: Einfach, aber verkabelungsintensiv
Ultraschall-Radare sind algorithmisch simpel (Laufzeitmessung). In der zentralisierten Architektur steigt die Rechenlast um rund 20 %, die Messdichte wird um das Zehnfache erhöht – erkennbar durch feinere Filteralgorithmen. Allerdings benötigen 12 Sensoren mit jeweils eigener SerDes-Verkabelung viel Platz und Kosten. Ein Kompromiss: sechs Sensoren vorn unter der Stoßstange, deren Daten vor Ort aggregiert und dann weitergeleitet werden. Diesen Mittelweg zwischen „vollständig zentral" und „vollständig dezentral" wählt BYD in seinen aktuellen Modellen.

## Fazit

Die chinesische Autoindustrie verfolgt das klare Ziel: Vom Sensordatenkanal bis zur Entscheidungsfindung – dazwischen darf es keine Blackbox geben. Nur mit rohen, unverarbeiteten Daten können Algorithmen ihr volles Potenzial entfalten. Das ist der Schlüssel für den nächsten Schritt von L2+ zu L3.

---

## In Europa

Dieses Thema betrifft die globale Fahrzeugentwicklung. Konkrete Modelle mit dieser Architektur sind in Europa noch nicht verfügbar; Hersteller wie BYD arbeiten jedoch an der Europa-Einführung entsprechender Fahrzeuge mit zentralisierter Sensorfusion.
