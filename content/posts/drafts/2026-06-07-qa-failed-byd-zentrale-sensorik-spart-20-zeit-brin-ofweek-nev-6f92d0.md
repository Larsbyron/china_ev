---
title: "[QA FAILED] BYD: Zentrale Sensorik spart 20 % Zeit, bringt 10-fache Punktdichte"
date: 2026-06-07T11:44:02.190Z
description: "Chinesische Hersteller wie BYD setzen auf zentrale Sensorarchitekturen: Rohe Radar- und Lidar-Daten werden direkt im SoC fusioniert, statt in Black-Box-Sensoren vorverarbeitet. Das bringt 20 % mehr Reichweite, 10-fache Punktdichte – und entmachtet Tier-1-Lieferanten."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# [QA FAILED] BYD: Zentrale Sensorik spart 20 % Zeit, bringt 10-fache Punktdichte

Ein stiller, aber fundamentaler Wandel findet in der chinesischen Automobilindustrie statt: Die Architektur der Umfeldsensorik wird von Grund auf neu gedacht. Bislang verarbeitete jeder Sensor – ob Millimeterwellen-Radar, Lidar oder Ultraschall – seine Daten selbst und gab nur gefilterte Ziele an das zentrale Steuergerät weiter. Das ist jetzt vorbei.

Immer mehr chinesische Hersteller, allen voran BYD (比亚迪), setzen auf eine sogenannte **zentrale Sensorarchitektur**. Die Idee: Statt jedes Radarmodul mit einem eigenen Mikrocontroller für FFT, Zielerkennung und Dopplerberechnung auszustatten, liefern die Sensoren nur noch rohe Momentaufnahmen – also unverarbeitete I/Q-Daten oder direkt die Radar-RAW-Daten – über Hochgeschwindigkeits-Verbindungen wie GMSL oder SerDes an die zentrale ADAS-SoC. Dort läuft eine einheitliche, leistungsstarke Fusionsalgorithmik, die alle Sensordaten in einem gemeinsamen Koordinatensystem vereint.

Der Gewinn ist enorm. BYD selbst gibt für seine aktuelle Generation der zentral gesteuerten Sensorik an: **20 % geringere Latenz, 20 % höhere Erkennungsreichweite und eine zehnfach höhere Punktdichte im Umgebungsmodell**. Das ermöglicht nicht nur eine präzisere Objektklassifizierung – etwa zwischen einem stehenden Auto, einer Mülltonne oder einem Stein –, sondern auch eine robustere Funktion auf L3-Niveau.

## Der Preis: Algorithmus-Kompetenz muss ins Haus

Der Wechsel zur zentralen Architektur bedeutet aber auch eine Machtverschiebung. Bislang lag das Kern-Know-how der Radarsignalverarbeitung bei den Tier-1-Zulieferern wie Bosch, Continental oder Hella. Sie definierten, wie aus FFT-Spektren Ziele extrahiert werden, wie Doppler-Daten gefiltert werden und welche Genauigkeit die Sensorausgabe hat. Der OEM bekam nur ein „fertiges Menü" geliefert, oft ohne Einblick in die Rezepte.

Mit der zentralen Architektur übernehmen die Hersteller selbst die Kontrolle über die Algorithmen. Sie entscheiden, wie die rohen I/Q-Daten interpretiert werden und wie die Fusion mit Kamera- oder Lidar-Daten erfolgt. Das erfordert jedoch tiefe Kompetenz in Signalverarbeitung, Radar-IP und Chip-Design. NXP hat mit dem „Radar Bridge"-Chip eine eigene Schnittstelle geschaffen, die zwischen MMIC und SerDes vermittelt. TI bietet auf seinen AWR-Radar-Chips bereits RAW-Output-Modi an. Die Frage ist: Wer bringt die nötige DSP-Leistung auf dem SoC mit?

## Millimeterwellen-Radar: Der härteste Brocken

Besonders komplex ist der Umstieg beim Millimeterwellen-Radar. Ein 4D-Radar mit 8T8R (acht Sende-, acht Empfangskanäle) liefert bereits etwa 3,6 Gbps Rohdaten – das entspricht einem hochauflösenden Videostream. Der Datentransfer über GMSL2 (6 Gbps) ist knapp machbar, aber der SoC muss diese Daten in Echtzeit verarbeiten: FFT, CFAR, Doppler-Clustering. Das stellt selbst moderne ADAS-SoCs vor Herausforderungen.

Chinesische Hersteller gehen deshalb unterschiedliche Wege: Die „Cost-Price"-Route nutzt einen SoC mit zwei MMICs (6–8 Kanäle), die „Performance"-Route vier MMICs (12–16 Kanäle). Langfristig, so die Erwartung, werden sich 8T8R- und 24T24R-Architekturen je nach Kostenmodell und Einsatzszene ausdifferenzieren. Klar ist: Wer die Algorithmen beherrscht, bestimmt die Performance.

## Lidar und Ultraschall: Weniger komplex, aber auch nicht trivial

Beim Lidar fällt die Umstellung leichter. Viele moderne Festkörper-Lidare (z. B. 192-Laser-Systeme) liefern bereits strukturierte Punktwolken über Ethernet oder MIPI. Die größte Hürde ist der Datenfluss: 3,6 Gbps pro Sensor erfordern hochperformante Interfaces. Die Datenstruktur – nach Slots organisiert, nicht nach Frames – passt nicht zur klassischen MIPI-CSI-Schnittstelle für Kameras. Hersteller müssen eigene DSP-Pipelines für Lidar-Daten entwickeln.

Am einfachsten ist der Wechsel bei **Ultraschall-Sensoren**. Sie benötigen keine aufwändige Signalverarbeitung; die Laufzeitmessung kann zentral erfolgen. BYD gibt an, durch die zentrale Verarbeitung die Latenz um 20 % reduziert und die Erkennungsdichte um den Faktor 10 erhöht zu haben – bei gleichbleibender Hardware.

## Fazit: Die Black Box ist geöffnet

Die chinesische Automobilindustrie verabschiedet sich von der traditionellen Tier-1-Logik. Indem rohe Sensorrohdaten zentral verarbeitet werden, brechen die Hersteller die Black Box auf und übernehmen die volle Algorithmushoheit. Das erlaubt nicht nur bessere Performance, sondern auch schnellere Iterationen auf dem Weg zu L3 und höher. Der Wettbewerb verschiebt sich: Nicht mehr die Hardware, sondern die Software und die Fähigkeit, rohe Wellenformen in präzise Umgebungsmodelle zu übersetzen, entscheiden über die Qualität des autonomen Fahrens.

---

Dieser Artikel beschreibt eine technische Entwicklung in der chinesischen Automobilindustrie. Die Umstellung auf zentrale Sensorarchitekturen ist ein globaler Trend, der auch europäische Hersteller und Zulieferer betrifft. Eine spezifische Markteinführung eines Fahrzeugs in Deutschland steht damit nicht in Verbindung.
