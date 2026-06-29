---
title: "BYD Han: 20 % mehr Reichweite durch neue Radar-Architektur"
date: 2026-06-29T19:48:49.580Z
description: "BYD Han setzt auf zentrale Rohdaten-Radar-Architektur: 20 % weniger Latenz, 20 % mehr Reichweite, 10× höhere Punktdichte. SoC-Kontrolle wechselt von Zulieferern zum Hersteller."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD Han: 20 % mehr Reichweite durch neue Radar-Architektur

Der BYD Han (比亚迪汉) führt eine zentrale Sensor-Architektur ein, die Fahrassistenz und Reichweite grundlegend verbessert. Statt vorverarbeiteter Ziele liefern Radar, Lidar und Kamera jeweils Rohdaten an einen zentralen SoC – im Han kommt Nvidia Orin-X zum Einsatz. Die Technik verschiebt die Kontrolle von Tier-1-Zulieferern wie Bosch oder Continental zum OEM und bringt messbare Leistungsvorteile: Latenz −20 %, Reichweite +20 %, Punktdichte ×10.

Bislang verarbeitete jeder Radarsensor sein Signal selbst: Von der Signalaufnahme über die FFT (Fast Fourier Transform) bis zur Zielerkennung und Geschwindigkeitsmessung – alles im Sensor. An die Zentrale wurden nur verdichtete „Ziel-Listen“ gemeldet. Das bedeutete Informationsverlust: Ein Sensor meldete „50 Meter voraus kein Hindernis“, der nächste „30 Meter voraus Hindernis“. Die Zentrale erhielt widersprüchliche Berichte ohne Rohdaten.

### Rohdaten statt gefilterte Ergebnisse
Die neue Architektur ändert dies fundamental. Die Sensoren übermitteln nun die vollständigen Rohdaten – etwa das FFT-Spektrum oder Radar-RAW-Echo. Der zentrale SoC empfängt alle Daten in einem einheitlichen Koordinatensystem. Statt gegensätzlicher Einzelmeldungen werden die Daten intelligent fusioniert. „1+1“ muss nicht 2 ergeben – es kann auch 5 werden, wenn sich die Stärken verschiedener Sensortypen ergänzen. Beispiel: Eine Regenwolke erschwert die Sicht eines Kamerasensors, während Millimeterwellen-Radar hindurchsieht.

### Algorithmus-Kontrolle wechselt vom Tier-1 zum OEM
Bisher lag das Know-how zur Radarsignalverarbeitung bei den Tier-1-Zulieferern – sie definierten, wie Ziele aus dem FFT-Spektrum extrahiert und klassifiziert wurden. Die OEMs bekamen nur das fertige „Gericht“ serviert. Jetzt verlangen chinesische Hersteller wie BYD, dass die Rohdaten offenliegen. NXP hat eine spezielle Radar-Bridge entwickelt, die zwischen MMIC und SoC vermittelt. TI unterstützt mit seinen AWR-Serien direkt RAW-Datenausgabe. BYD selbst gibt an, dass der zentrale SoC im Han 12 Radar-Kanäle mit FFT und CFAR bewältigen kann – bisher undenkbar.

L3/L4-Fahren benötigt keine Ziel-Listen, sondern präzise Rohdaten. Nur so lassen sich ruhende Hindernisse wie Brückenpfeiler oder Steinblöcke zuverlässig von bewegten Zielen unterscheiden.

### Drei Radar-Typen im Vergleich
- **4D-Millimeterwellen-Radar**: Chinesische Hersteller setzen auf kosteneffiziente „1 SoC + 2 MMIC“-Lösungen (6×8 Kanäle), während europäische auf „1 SoC + 4 MMIC“ (12×16 Kanäle) setzen. Ab 2028 werden sich 8T8R- und 24T24R-Architekturen je nach Kostenmodell und Einsatzbereich aufspalten.
- **Lidar**: Der Trend zur zentralen Architektur eliminiert teure FPGA-Signalprozessoren im Lidar-Sensor selbst. Stattdessen übernimmt der SoC die Datenfusion. Die Datenrate einer 192-Linien-Lidar liegt bei 3,6 Gbps – GMSL2 mit 6 Gbps reicht knapp aus. Herausforderung: Die Slot-basierte Datenstruktur des Lidars (1200 Slots pro Frame) passt nicht in das Frame-Design von Kamera-MIPI-Schnittstellen.
- **Ultraschall-Radar**: Am einfachsten zu integrieren, da bereits auf Laufzeitmessung basierend. Die Datenmenge ist gering, aber 12 Sensoren brauchen 12 SerDes-Leitungen – eine Hybrid-Lösung (lokale Bündelung + zentrale Fusion) ist sinnvoller.

BYD gibt für den Han folgende Messwerte an: 20 % weniger Zeit für die Signalverarbeitung, 20 % mehr Reichweite, 10-fach höhere Punktdichte. Der Hersteller positioniert sich zwischen „vollständig zentral“ und „vollständig dezentral“ mit einem intelligenten Mittelweg.

### Auswirkungen auf die Industrie
BYD Han (比亚迪汉) setzt die zentrale Radar-Architektur seit dem Modelljahr 2024 in Verbindung mit dem DiPilot 100-System um. Der zentrale SoC ist ein Nvidia Orin-X mit 254 TOPS. Alle Radar-Rohdaten laufen über diese Einheit. Damit demonstriert BYD, wie die Kontrolle über die Algorithmen von Tier-1-Zulieferern zu den OEMs wandert – ein grundlegender Machtwechsel in der chinesischen Automobilindustrie.

Die chinesische Industrie baut eine transparente Datenpipeline: Rohsignal → verarbeitete Daten → finale Entscheidung. Keine Blackbox mehr. Nur mit diesen Rohdaten können Algorithmen die letzten Lücken schließen – und den Schritt von L2 zu L3 ermöglichen.

---

BYD Han ist offiziell in Deutschland erhältlich (Baureihe Han ab ca. 72.000 €). Die aktuelle Generation mit zentraler Radar-Architektur wird schrittweise in die hier ausgelieferten Modelle integriert. Ein genauer Zeitplan für Deutschland liegt noch nicht vor.
