---
title: "BYD treibt Sensor-Revolution: Rohdaten statt Blackbox"
date: 2026-07-05T11:30:03.894Z
description: "Chinas Autoindustrie bricht mit alter Sensor-Architektur: Statt fertiger Daten liefern Radar & Lidar künftig Rohsignale an zentrale KI. BYD setzt auf Hybrid-Lösung – Ende der Zulieferer-Hoheit."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Hybrid", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD treibt Sensor-Revolution: Rohdaten statt Blackbox

Die chinesische Automobilindustrie erlebt einen grundlegenden Umbruch in der Sensor-Architektur für autonomes Fahren. Statt wie bisher jedes Radar oder Lidar seine eigenen Daten vorverarbeiten zu lassen (Blackbox-Prinzip), werden künftig rohe Erfassungsdaten direkt an eine zentrale Recheneinheit (SoC) geschickt. Die Hoheit über Algorithmen und Sensorfusion wandert damit von den Tier-1-Zulieferern zu den Fahrzeugherstellern und Halbleiterentwicklern.

Branchenkenner nennen diesen Trend eine „Zentralisierung der Sensor-Architektur" oder „Daten-Revolution" – ein Prozess, der längst in vollem Gange ist. BYD (比亚迪) etwa setzt bei seinen neuesten Modellen auf eine hybride Lösung: Teils lokale Vorverarbeitung, teils zentrale Datenfusion in einem gemeinsamen Datenraum. Ziel ist es, die Rohsignale aller Sensoren – Millimeterwellenradar, Lidar und Ultraschall – in einer leistungsstarken KI zu fusionieren, statt widersprüchliche Einzelbefunde auszuwerten.

## Wie die neue Architektur funktioniert

Bisher arbeiteten Sensoren wie autonome „Minicomputer": Das Millimeterwellenradar führte FFT-Analyse, Zielerkennung und Geschwindigkeitsmessung eigenständig im Sensorchip durch. Der Zentralcomputer erhielt nur eine fertige Liste mit Zielen („50 m voraus Hindernis"). Dabei gingen entscheidende Informationen verloren – etwa ob ein Ziel durch Wasserreflexion unscharf wurde. Der Prozess glich einem Treppengespräch zwischen getrennten Zimmern: Jeder Sensor rief seine Ergebnisse herein, aber niemand hörte die Rohdaten.

Die neue Architektur überträgt die rohen Erfassungsdaten jedes Sensors – Spektrogramme, Punktwolken, Zeitabläufe – über GMSL- oder SerDes-Verbindungen zum Haupt-SoC. Dort laufen alle Daten in einem einheitlichen Algorithmus zusammen. Statt „Radar sagt nein, Lidar sagt ja" entsteht eine echte Fusion: Das Lidar erkennt die Wasserspritzer, das Millimeterwellenradar blickt durch – und das System kombiniert beide Stärken. „1+1 kann hier mehr als 2 sein", so ein Entwickler.

## Kontrollverlust für Tier-1-Zulieferer

Bislang besaßen Zulieferer wie Bosch, Continental oder chinesische Radar-Spezialisten das gesamte Know-how zur Signalverarbeitung – fest verdrahtet in der Sensor-Firmware. Der OEM bekam nur das Ergebnis, nicht die Methode. Nun fordern Hersteller Zugriff auf die Rohdaten: Der Zulieferer liefert nur noch die Hardware (MMIC, ADC), die eigentliche „Magie" der Algorithmen wandert auf den Zentralcomputer.

NXP hat mit dem „Radar Bridge"-Chip bereits eine spezielle Schnittstelle geschaffen, die zwischen MMIC und SerDes vermittelt. Gleichzeitig integrieren erste Hersteller Radar-Signalprozessor-IP (RSP IP) direkt in ADAS-SoCs – ein Schritt, der die Abhängigkeit von Zulieferern weiter reduziert. TI geht mit seiner AWR-Serie einen ähnlichen Weg.

## Radar: Die drei Fronten der Revolution

**Millimeterwellenradar:** Der größte Wandel. 4D-Radare nutzen zunehmend Multi-Chip-Architekturen. Chinesische Hersteller setzen auf „1 SoC + 2 MMIC" für 8T8R, europäische auf „1 SoC + 4 MMIC" für 16T16R. Bis 2028 werden sich die Wege trennen: 8T8R vs. 24T24R – mit völlig unterschiedlichen Kostenmodellen und Einsatzbereichen. Die größte Hürde bleibt die Algorithmus-IP: Gehört sie dem Zulieferer oder dem Hersteller?

**Lidar:** Die Kostenbremse. Die teuren FPGA-basierten Signalprozessoren im Lidar entfallen, wenn die Verarbeitung auf die Zentraleinheit wandert. Übrig bleiben nur Sender, SPAD-Empfänger und TDC-Zeitmesser – die Hardwarekosten sinken drastisch. Allerdings: Hochauflösende Lidare mit 192 Zeilen erzeugen bis zu 3,6 Gbit/s Daten – eine Herausforderung für die Datenübertragung und SoC-Verarbeitung. Die Datenstruktur (Slot-basiert statt Frame-basiert) verträgt sich kaum mit den für Kameras optimierten MIPI-Schnittstellen.

**Ultraschall-Sensor:** Scheinbar simpel, aber knifflig. Die Laufzeitmessung ist einfach, doch die Rohdatenverarbeitung im ECU frisst bis zu 20 % mehr Rechenleistung. Dafür steigt die Erkennungsdichte um das Zehnfache – feinere Filteralgorithmen extrahieren mehr Informationen aus denselben Signalen. Ein praktisches Problem: 12 Einzelsensoren bedeuten 12 SerDes-Leitungen – zu teuer. BYD löst dies mit einem Hybrid-Ansatz: Eine lokale Bridge sammelt sechs Sensoren und schickt aggregierte Daten an das Zentralsystem.

Fazit: Chinas Automobilindustrie baut die Datenpipeline von Grund auf neu. Vom Rohsignal zur Entscheidung – ohne Blackbox. Wer die Daten kontrolliert, kontrolliert den Algorithmus. Und wer den Algorithmus kontrolliert, der bestimmt die Leistung.

---

Der Artikel beschreibt einen technologischen Trend in der chinesischen Automobilindustrie. BYD ist als Hersteller in Deutschland aktiv, die beschriebene Sensortechnologie ist jedoch eine strategische Entwicklungsrichtung – eine konkrete Markteinführung in Europa wurde nicht genannt. Der Wandel wird sich langfristig auf alle globalen Hersteller auswirken.
