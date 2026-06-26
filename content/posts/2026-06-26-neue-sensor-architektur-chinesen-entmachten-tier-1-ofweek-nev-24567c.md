---
title: "Neue Sensor-Architektur: Chinesen entmachten Tier-1-Lieferanten"
date: 2026-06-26T19:31:08.835Z
description: "Chinesische Hersteller setzen auf zentrale Rechenarchitektur: Sensoren liefern nur Rohdaten, Algorithmen laufen auf einem Zentralrechner. Das entzieht traditionellen Zulieferern wie Bosch die Kontrolle über das Fahrassistenz-Know-how."
source: "OFweek NEV"

category: "news"

brands: ["Huawei", "NXP", "Texas Instruments"]
tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Neue Sensor-Architektur: Chinesen entmachten Tier-1-Lieferanten

In der chinesischen Automobilindustrie zeichnet sich ein grundlegender Wandel in der Fahrassistenztechnologie ab: Weg von dezentralen Sensorarchitekturen, hin zu einem zentralen Rechenmodell. Dabei geben die Sensoren – Radar, Lidar oder Ultraschall – nur noch rohe, unverarbeitete Daten weiter. Die gesamte Wahrnehmungsalgorithmik läuft auf einem leistungsstarken Zentralcomputer (SoC), der alle Signale fusioniert.

Dieser „Zentralrechner“-Ansatz hat tiefgreifende Folgen. Bisher war jeder Sensor ein eigenständiges „Mini-Gehirn“, das vor Ort Signale filterte, Ziele erkannte und nur verdichtete Objektlisten an das Steuergerät sendete. Ein Beispiel: Ein Radarsensor meldete „Hindernis in 50 Metern“ – aber das „Warum“ (etwa Streureflexion durch Wasser) blieb verborgen. Bei der zentralen Architektur dagegen landen die Rohdaten (FFT-Spektren, Rohradar-Daten) im Hauptrechner. Algorithmen können nun verschiedene Sensorarten intelligent kombinieren: Wo ein Radar durch Regen gestreut wird, liefert das Lidar klare Daten – und umgekehrt. So entsteht aus 1+1 mehr als 2.

## Warum jetzt? – Die Machtverschiebung bei der Algorithmus-Entwicklung

Der Grund für den späten Umstieg liegt in der etablierten Arbeitsteilung: Tier-1-Zulieferer wie Continental, Bosch oder Hella hielten das Know-how über Radarsignalverarbeitung (FFT, Zielerkennung, Doppler-Auswertung) in Firmware verschlossen. Der Autohersteller bekam nur die fertige Objektliste. Das änderte sich erst, als chinesische Halbleiterfirmen und Chipdesigner wie NXP und Texas Instruments neue Bausteine einführten: Radar-Bridge-Chips, die MMIC und ADC direkt verbinden, und Radar-Signalverarbeitungs-IP (RSP IP), die direkt in ADAS-SoCs integriert wird. Damit können Autohersteller die Algorithmen selbst auf dem Zentralchip ausführen.

## Drei Sensortypen im Vergleich: Vor- und Nachteile der Zentralisierung

*   **4D-Millimeterwellenradar:** China setzt auf kostengünstige 8T8R-Varianten (1 SoC + 2 MMIC), Europa plant bereits 24T24R. Die Herausforderung liegt nicht in der Hardware, sondern in der Algorithmus-IP und der Plattformintegration.
*   **Lidar:** Bei der zentralen Architektur entfällt der teure FPGA-Signalprozessor im Sensor. Stattdessen liefert das Lidar nur Rohdaten (Photonen, Time-of-Flight). Das reduziert Stückkosten, erfordert aber höhere Datenraten (ca. 3,6 Gbit/s pro 192-Zeilen-Scanner) und eine Umstellung der Datenstruktur – Lidar-Daten sind slotsbasiert, nicht framebasiert wie Kamerabilder.
*   **Ultraschallsensor:** Die zentrale Verarbeitung ist hier algorithmisch einfacher, senkt aber die CPU-Last um bis zu 20 % und erhöht die Reichweite um 10 %. Allerdings steigen die Kosten für die vielen SerDes-Leitungen (12 Sensoren, je eigene Leitung). Ein Kompromiss ist die „lokale Bündelung“ mehrerer Sensoren zu einem Zwischenknoten.

## Branchenausblick: Wer die Rohdaten hat, hat die Macht

Die chinesische Autoindustrie treibt diesen Wandel voran, um die Abhängigkeit von westlichen Zulieferern zu reduzieren. Das Ziel: vom Sensor bis zur Entscheidung alles selbst zu kontrollieren. Für nächstes Jahr werden erste L2+-Systeme mit zentraler Architektur erwartet, die als Basis für L3 dienen. Die traditionelle TIER-1-Lieferkette steht vor einer Neuordnung – oder sie muss ihre Rolle als reiner Hardware-Lieferant akzeptieren.

---

## In Europa
Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
