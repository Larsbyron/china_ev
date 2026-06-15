---
title: "China treibt Zentralrechner für Radar und Lidar voran"
date: 2026-06-15T07:12:03.274Z
description: "Chinesische Autobauer lagern Sensor-Datenverarbeitung in zentrale Rechner aus. Das verspricht bessere Umfelderkennung – und entmachtet traditionelle Tier-1-Zulieferer."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "TI"]
tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# China treibt Zentralrechner für Radar und Lidar voran

Bisher verarbeitet jeder Radarsensor seine Daten selbst: Ein Millimeterwellen-Radar meldet „Hindernis in 50 Metern“, ein anderer „Lücke in 30 Metern“ – die Zentrale erhält nur noch gefilterte Ziel-Listen. Dieses Prinzip der verteilten Intelligenz wird in China zunehmend infrage gestellt. Denn mit dem Trend zu höheren Automatisierungsstufen (L3/L4) reichen vereinzelte Punktwolken nicht mehr aus – die Industrie wechselt zur **zentralen Rechnerarchitektur** (im Chinesischen als „zentral integrierte Architektur“ bekannt).

Bei der neuen Architektur liefern die Sensoren rohe, unverarbeitete Daten – etwa das FFT-Spektrum eines Radars oder die vollständige Point-Cloud eines Lidar – an einen leistungsstarken Zentralrechner (SoC). Dort läuft ein einheitlicher Fusionsalgorithmus, der die Stärken aller Sensoren kombiniert: Die hohe Durchdringungsfähigkeit des Millimeterwellen-Radars (z. B. durch Regen) kann die geringere Auflösung eines Lidar ausgleichen und umgekehrt. Statt 1+1=2 kann 1+1=5 werden – so das Versprechen der Hersteller.

## Warum der Wandel jetzt kommt – und wer verliert

Der Schlüssel liegt im Algorithmen-Know-how. Bisher hielten Tier-1-Zulieferer wie Bosch, Continental oder chinesische Radar-Spezialisten die Signalverarbeitung fest in der Hand. Die Firmware im Radar-Chip war eine Blackbox: „Du bekommst das Essen, aber weißt nicht, wie es gekocht wurde.“ Die zentrale Architektur zwingt die Zulieferer, die rohen Daten herauszugeben – und verlagert die Algorithmen-Kompetenz zu den Autoherstellern und den SoC-Chipdesignern.

Ermöglicht wird dieser Schritt durch neue Halbleiter: NXP bietet mit „Radar Bridge“ einen Bridge-Chip, der die MMIC-ADC-Stufe von der Verarbeitung trennt. Gleichzeitig lassen sich Radar-Signalverarbeitungs-IPs (RSP) direkt in ADAS-SoCs integrieren – etwa von TI oder NXP. Die Chipriesen bieten damit fertige Algorithmen-Bausteine, die Autohersteller einfach übernehmen können. Der Kampf um die „Kochrezepte“ ist damit neu entfacht.

## Drei Sensortypen – drei Herausforderungen

- **Millimeterwellen-Radar (4D-Radar):** China treibt die Kosteneffizienz: Ein SoC + zwei MMIC-Chips liefern 8T8R (acht Sende-, acht Empfangskanäle). Europa plant bereits 16T16R bis 24T24R. Bis 2028 werden sich die Kostenmodelle beider Stränge angleichen. Die größte Hürde bleibt die Algorithmus-IP und deren Portierung auf verschiedene SoC-Plattformen.
- **Lidar:** Hier entfällt durch die Zentralarchitektur teure FPGA-Signalverarbeitung im Sensor – nur noch Sender, SPAD-Empfänger und TDC (Zeit-Digital-Wandler) bleiben im Gehäuse. Doch die Datenrate eines 192-Laser-Lidars (10 Hz, 120° horizontal, 0,1° Auflösung, 3,6 Gbit/s) stellt hohe Anforderungen an die SoC-Schnittstelle. MIPI, das für Kameras optimiert ist, passt nicht zur Slot-basierten Lidar-Datenstruktur – DSPs müssen die Last auffangen.
- **Ultraschall-Radar:** Die Algorithmik ist einfach (Laufzeitmessung), doch die Synchronisation vieler Sensoren (12 Stück, jeder mit SerDes-Leitung) treibt Kosten. Chinesische Hersteller gehen zu einer Hybridlösung über: Ein lokaler Sub-Receiver bündelt die Daten mehrerer Sensoren und leitet sie an die Zentrale weiter. BYD (比亚迪) beispielsweise erzielt damit 20 % weniger Zeitversatz, 20 % mehr Reichweite und 10 % mehr Zielauflösung – ohne vollständig zentral zu sein.

## Fazit für deutsche Leser

Die chinesische Industrie baut eine datendurchgängige Pipeline vom rohen Sensorsignal bis zur Fahrzeugentscheidung – ohne Blackbox. Das ermöglicht tiefere Algorithmen und schnellere Iterationen für L2+ und L3. Deutsche Tier-1 müssen sich fragen, ob sie ihre Radar-Know-how als IP verkaufen oder die hohen Entwicklungskosten für eigene SoC-Integration stemmen. Der Wettlauf um die Rechnerarchitektur hat gerade erst begonnen.

---

## In Europa

Dies betrifft indirekt auch deutsche Hersteller und Zulieferer. Während BMW, Mercedes und VW bereits eigene Zentralrechner (z. B. VW E³ 1.2) entwickeln, ist der offene Zugriff auf rohe Sensordaten zwischen OEM und Tier-1 oft noch vertraglich geregelt. Chinesische Player wie BYD oder NIO treiben diesen Wandel aggressiver voran.
