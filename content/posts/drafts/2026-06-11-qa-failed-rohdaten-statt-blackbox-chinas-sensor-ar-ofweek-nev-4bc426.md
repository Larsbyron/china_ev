---
title: "[QA FAILED] Rohdaten statt Blackbox: Chinas Sensor-Architektur entmachtet Tier-1"
date: 2026-06-11T06:44:40.919Z
description: "Chinesische Autohersteller setzen bei Sensoren auf zentrale Rohdatenverarbeitung. Tier-1-Zulieferer verlieren Kontrolle über Algorithmen – Europa wählt andere Hardware-Roadmap."
source: "OFweek NEV"

category: "news"

brands: ["NXP", "TI", "BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# [QA FAILED] Rohdaten statt Blackbox: Chinas Sensor-Architektur entmachtet Tier-1

Chinas Automobilindustrie treibt einen grundlegenden Wandel in der Sensor-Architektur für Fahrassistenzsysteme voran: Statt wie bisher die Signalverarbeitung direkt im Sensor („Postfusion") durchzuführen, werden künftig alle Rohdaten von Radar, Lidar und Kamera ungefiltert an eine zentrale Recheneinheit (SoC) gesendet. Diese „Frontfusion" verspricht intelligentere Umfelderkennung und legt die Algorithmen-Kontrolle in die Hände der Fahrzeughersteller – zulasten der traditionellen Tier-1-Zulieferer.

## Zentrale Rohdatenverarbeitung statt lokaler Intelligenz

Bisher arbeiteten Sensoren weitgehend autonom: Ein Millimeterwellen-Radar führte selbstständig FFT-Berechnungen (Fast-Fourier-Transformation) durch, extrahierte Ziele und meldete nur abstrakte Ergebnisse wie „Objekt 50 Meter voraus" an das Steuergerät. Diese Datenkompression ging mit erheblichem Informationsverlust einher – etwa wenn Wassertropfen ein Radarsignal streuen und das Ziel verschwimmt.

Im neuen Modell liefern die Sensoren dagegen rohe I/Q-Daten (Amplituden-Phasen-Information) über schnelle SerDes-Verbindungen (SerDes = Seriell-Deserialisierungsverbindung) an das zentrale SoC. Dort fusioniert ein Algorithmus die Rohdaten aller Sensorarten und erzeugt ein gemeinsames Umfeldmodell. „1+1 kann dann 5 ergeben", beschreiben Entwickler den Effekt: Die starke Durchdringungsfähigkeit des Millimeterwellen-Radars und die hohe Auflösung des Lidar ergänzen sich – Widersprüche werden aufgelöst, nicht nur verwaltet.

## Warum der Wandel jetzt kommt

Der Schlüssel liegt in der Chip-Integration. Bisher hielten Tier-1-Lieferanten wie Bosch oder Continental das Know-how für die Radarsignalverarbeitung in ihrer eigenen Firmware. Neue Chipsätze öffnen diese Blackbox: NXP bietet mit dem Radar Bridge einen dedizierten Bridge-Chip an, der nur noch MMIC (Millimeterwellen-IC) und SerDes verbindet, während die Signalverarbeitung als RSP IP (Radar-Signalverarbeitungs-Intellectual Property) direkt in den ADAS-SoC integriert wird. Auch Texas Instruments ermöglicht mit seiner AWR-Serie den Rohdatenzugriff. Damit können Fahrzeughersteller eigene Algorithmen entwickeln, ohne auf die Zulieferer-Codebasis angewiesen zu sein.

Die Anforderungen für höhere Automatisierungsstufen (L3/L4) treiben den Wandel: Statt einer Liste von 50 Zielobjekten benötigen autonome Systeme ein dichtes Punktraster mit Geschwindigkeits- und Mikro-Doppler-Informationen, um auch schwache Reflektoren wie umgefallene Motorräder oder Steine zu erkennen. Die Rechenlast auf dem SoC wächst: Zwölf parallele Radar-Streams mit FFT und CFAR-Algorithmen fordern modernste Chip-Architekturen.

## Europa vs. China: Zwei Hardware-Roadmaps

Für 4D-Millimeterwellen-Radar zeichnen sich zwei Entwicklungslinien ab:

- **China setzt auf Kosteneffizienz**: Ein SoC mit zwei MMICs realisiert 8T8R (8 Sende-, 8 Empfangskanäle). Das reicht, um bei überschaubarem Aufwand die Vorteile der Frontfusion zu nutzen.
- **Europa wählt Performance**: Ein SoC mit vier MMICs (16T16R) oder sogar 24T24R sind in Planung. Das bringt mehr Winkelauflösung, aber auch höhere Kosten und Datenmengen.

Bis 2028 werden beide Pfade nebeneinander existieren – mit sehr unterschiedlichen Kostenmodellen und Einsatzszenarien.

Auch beim Lidar verlagert sich die Verarbeitung. Der teure FPGA im Lidar-Modul entfällt; nur noch Sender (SPAD/Laser) und einfacher TDC bleiben auf der Sensorplatine. Die 3D-Punktwolke wird direkt über MIPI an den SoC gesendet – eine Herausforderung, denn Lidar-Daten sind anders strukturiert als Kamerabilder: Sie bestehen aus Slots statt Frames. Effiziente DSP-Algorithmen für diese Datenstruktur sind erst im Entstehen.

Ultraschallsensoren profitieren ebenfalls: Statt einer simplen Entfernungsmessung vor Ort werden die rohen Echogramme an die Zentrale übermittelt. Erste Serienanwendungen bei BYD (比亚迪) zeigen 20 % weniger Zeitversatz, 20 % mehr Reichweite und eine zehnfache Punktdichte – ohne zusätzliche Hardwarekosten.

## Fazit

Chinas Automobilindustrie baut eine durchgängige Datenpipeline vom rohen Sensorsignal bis zur Fahrentscheidung auf – ohne undurchsichtige Blackbox. Diese Offenheit erlaubt tiefere Algorithmen-Optimierung und schafft die Grundlage für den nächsten Schritt von L2+ zu L3. Der Wettlauf um die beste Sensor-Architektur hat gerade erst begonnen.

---

Der beschriebene Technologietrend wird derzeit vor allem von chinesischen Herstellern vorangetrieben. Ein direktes, in Europa erhältliches Modell mit dieser spezifischen Sensor-Architektur wurde noch nicht bestätigt.
