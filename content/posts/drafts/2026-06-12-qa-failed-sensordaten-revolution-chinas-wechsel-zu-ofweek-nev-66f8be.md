---
title: "[QA FAILED] Sensordaten-Revolution: Chinas Wechsel zur zentralen Rechenplattform"
date: 2026-06-12T06:30:53.091Z
description: "Chinesische Autohersteller ersetzen verteilte Sensorarchitekturen durch zentrale Recheneinheiten. Rohdaten von Radar, Lidar & Kamera fließen direkt in einen SoC – ein Paradigmenwechsel mit Folgen für Zulieferer und Algorithmen-Hoheit."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "Texas Instruments"]
tags: []
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Sensordaten-Revolution: Chinas Wechsel zur zentralen Rechenplattform

Die chinesische Automobilindustrie vollzieht einen fundamentalen Wandel in der Sensorarchitektur. Statt jedes Radar oder Lidar die Daten eigenständig verarbeiten zu lassen, werden künftig alle Rohdaten an eine zentrale Rechenplattform (SoC/System-on-a-Chip) geschickt. Verschiebt sich die Wertschöpfung – und die Kontrolle über die Wahrnehmungsalgorithmen – von den Zulieferern (Tier-1) zu den Herstellern und Tech-Unternehmen.

## Was ist eine zentrale Sensorarchitektur?
Bisher arbeiteten Sensoren wie Radareinheiten oder Lidar weitgehend autonom: Jeder Sensor führte eigene Signalverarbeitung (z. B. FFT, Zielerkennung, Doppler-Analyse) durch und lieferte dem Steuergerät nur gefilterte „Quittungen" – z. B. „Objekt 50 Meter voraus erkannt". Eine zentrale Architektur hingegen überträgt rohe, unverarbeitete Sensordaten über serielle Hochgeschwindigkeitsleitungen (SerDes, z. B. GMSL) in einen zentralen SoC. Erst dort laufen alle Informationen zusammen, werden fusioniert und mit KI-Algorithmen ausgewertet.

Der Vorteil: Statt widersprüchlicher Meldungen („Radar sagt kein Hindernis, Lidar sagt Hindernis") kann die zentrale Instanz die Stärken jedes Sensors kombinieren – etwa die Durchdringungsfähigkeit von Millimeterwellen-Radar mit der hohen Auflösung eines Lidar. 1+1 kann so mehr als 2 ergeben.

## Warum der Wandel jetzt – und warum er die Machtverhältnisse verschiebt
Lange hielten Tier-1-Zulieferer wie Bosch oder Continental das Know-how der Radarsignalverarbeitung in ihren Black-Box-Firmwares. Die zentrale Architektur zwingt sie jedoch, die „Küche" zu öffnen: Die Hersteller übernehmen die Signalverarbeitung selbst. Ermöglicht wird dies durch leistungsstarke ADAS-SoCs (wie von NXP oder TI), die spezielle Radar-Signalverarbeitungs-IP (RSP) direkt integrieren. NXP bietet sogar einen dedizierten „Radar Bridge"-Chip an, der zwischen MMIC (Hochfrequenz-Baustein) und SoC vermittelt und Rohdaten effizient bündelt.

Für Level-3/4-Autonomie reichen die bisherigen Listenpunkt-Listen nicht mehr aus. Stattdessen benötigt die Software feinkörnige Rohdaten – etwa Zeit-Frequenz-Diagramme, Mikro-Doppler-Signaturen, um Fußgänger, Fahrräder oder sogar überfahrene Steine sicher zu klassifizieren.

## Die drei Sensortypen im Detail: Radar, Lidar, Ultraschall
### 1. 4D-Millimeterwellen-Radar
In China setzt sich ein kosteneffizienter Pfad durch: 1 SoC + 2 MMIC → 8T8R (8 Sende-, 8 Empfangskanäle). Europa geht ambitionierter vor: 1 SoC + 4 MMIC → 16T16R, teilweise sogar 24T24R geplant. Bis 2028 werden diese Pfade weiter auseinanderdriften – mit unterschiedlichen Kostenmodellen.

Die Herausforderung: Wer besitzt die Radar-Algorithmus-IP? Liegt sie beim Tier-1, beim Hersteller oder beim Chip-Entwickler? Und kann der SoC die Radar-Daten (3D+Doppler) genauso effizient verarbeiten wie Kamera-Bilddaten (2D-Raster)? DSPs müssen für diese neue Datenstruktur optimiert werden.

### 2. Lidar
Lidar (z. B. 192-Laser-Zeilen, 10 Hz, 120° Sichtfeld, 0,1° Auflösung) erzeugt pro Scan rund 3,6 Gbit/s Daten – das entspricht einem unkomprimierten HD-Videostream. Allein die Übertragung über GMSL2 ist anstrengend. Zudem ist die Datenstruktur anders als bei Kameras: Lidar-Daten sind nach Slots (Zeitschlitzen) organisiert, nicht nach Zeilen. Effiziente Verarbeitung auf MIPI-Schnittstellen, die für Kameras optimiert sind, ist eine bliebe Herausforderung.

### 3. Ultraschall
Ultraschallsensoren sind algorithmisch simpler (Laufzeitmessung). Die Zentralisierung erhöht den Rechenaufwand auf der ECU um etwa 20 % – ermöglicht aber doppelte Erfassungsdichte und feinere Kreuzkorrelation der Echos. Problem: Jeder Sensor braucht ein eigenes SerDes-Kabel. Ein Kompromiss ist die „lokale Bündelung zu Clustern" (z. B. 6 Sensoren pro Stoßfänger), die Daten vorverdichten und dann an die Zentrale schicken.

## Fazit: Datenhoheit entscheidet
Die chinesische Autoindustrie will den gesamten Datenpfad von der Rohdatenübertragung bis zur Entscheidungsfindung kontrollieren – ohne Blackbox. „Nur frische, unverarbeitete Daten entfalten das volle Potenzial der Algorithmen", so ein Ingenieur. Nach dem Siegeszug der Kamera-Zentralisierung folgt nun Radar und Lidar. Der Wettbewerb um die Sensor-Datenhoheit hat gerade erst begonnen.

*Quelle: Ursprungsartikel über zentrale Sensorarchitektur in der chinesischen Automobilindustrie.*

---

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
