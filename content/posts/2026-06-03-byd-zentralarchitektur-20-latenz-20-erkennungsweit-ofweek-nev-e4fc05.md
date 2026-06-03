---
title: "BYD-Zentralarchitektur: −20 % Latenz, +20 % Erkennungsweite"
date: 2026-06-03T06:49:06.455Z
description: "BYD setzt auf eine zentrale Rechnerarchitektur für die Sensorfusion. Rohdaten von Radar, Lidar und Kameras werden direkt in einem SoC verarbeitet. Das bringt messbare Vorteile für Assistenzsysteme und autonomes Fahren."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD-Zentralarchitektur: −20 % Latenz, +20 % Erkennungsweite

BYD (比亚迪) hat in seinen aktuellen Modellen eine fundamentale Änderung in der Fahrzeugumfelderfassung eingeführt: eine zentrale Rechnerarchitektur. Statt wie bisher jedes Sensorsignal dezentral vorzuverarbeiten und nur gefilterte Ergebnisse an das Steuergerät zu senden, fließen nun alle Rohdaten von Millimeterwellen-Radaren (mmWave), Lidaren und Kameras über leistungsfähige SerDes-Schnittstellen direkt in eine einzige System-on-Chip-Einheit (SoC). Dort laufen die Algorithmen zur Sensorfusion auf den unverfälschten Originaldaten.

Laut BYD reduziert die neue Architektur die Systemlatenz um 20 %, steigert die maximale Erkennungsweite um 20 % und erhöht die Sensordichte – also die Anzahl der gleichzeitig verarbeiteten Sensorpunkte – um den Faktor zehn. Damit schafft sie die Grundlage für zuverlässigere Assistenzsysteme und höhere Automatisierungsstufen bis hin zu Stufe 3/4 (SAE-Klassifikation).

## Technischer Hintergrund: Vom „Kleinhirn" zum zentralen Gehirn

In der bisherigen dezentralen Architektur erledigte jeder Sensor seine Signalverarbeitung selbst – vom Millimeterwellen-Radar über die FFT-Berechnung bis zur Zielklassifikation. Die Zentrale erhielt lediglich eine Liste wie „50 m voraus Hindernis" oder „30 m rechts Fahrzeug". Dabei gingen wertvolle Rohinformationen verloren. Beispiel: Spritzwasser auf der Fahrbahn streut Lidar-Punkte, während das mmWave-Radar dank seiner physikalischen Eigenschaften das Hindernis weiterhin erkennt. Dezentral entsteht ein Widerspruch („Lidar: frei, Radar: Hindernis"), zentral dagegen können Algorithmen beide Rohdatensätze kombinieren – 1+1 ergibt mehr als 2.

Der Wechsel zur zentralen Architektur war jedoch kein Selbstläufer. Jahrelang hielten Tier-1-Zulieferer ihr Know-how zur Radarsignalverarbeitung in Black-Box-Firmware fest. Erst mit speziellen Brücken-Chips wie NXPs Radar Bridge und integrierbaren Radar-Signalverarbeitungs-IPs (RSP) in ADAS-SoCs wurde die Herausgabe der Rohdaten möglich. Auch Texas Instruments (TI) bietet mit der AWR-Serie mmWave-Chips an, die den RAW-Daten-Modus unterstützen. L3/L4-Systeme benötigen zwingend die ursprünglichen Daten – etwa den Doppler-Frequenzbereich – um eine bewegte Person von einer stehenden Leitplanke zu unterscheiden. Bisher wäre eine solche Verarbeitung von z. B. 12 Radar-Kanälen (FFT, CFAR) zu rechenintensiv für einen SoC gewesen; heute sind die Chips leistungsfähig genug.

## Drei Sensortypen, drei Herausforderungen

Der Umbau auf zentrale Architektur betrifft mmWave-Radar, Lidar und Ultraschallsensoren – jeder mit eigenen Schwierigkeiten.

### Millimeterwellen-Radar: Schnellster Wandel

Bei 4D-Millimeterwellen-Radaren hat sich der Markt in zwei Richtungen gespalten: Chinesische Hersteller setzen auf eine kosteneffiziente Route mit „1 SoC + 2 MMIC" (6 Kanal‑8 Kanal, 8T8R). Europäische Zulieferer gehen in die Hochleistungsroute mit „1 SoC + 4 MMIC" (12 Kanal‑16 Kanal, 16T16R), teilweise sogar 24T24R geplant. Bis 2028 werden sich beide Linien weiter auseinanderentwickeln. Die eigentliche Hürde liegt nicht in der Hardware, sondern in der Algorithmus-Öffentlichkeit: Wer besitzt die Radar-Signalverarbeitungs-IP? Kann der Algorithmus auf die zentrale SoC-Plattform portiert und validiert werden? Und – dritte Frage – ist der SoC für die Datenorganisation von Radardaten optimiert? Kameras senden Bilder im Frame-Format über MIPI; Radardaten hingegen sind zweidimensionale oder gar dreidimensionale Arrays, die mit DSP-Einheiten effizient verarbeitet werden müssen. NXP treibt mit seiner RSP IP die Öffnung voran, doch der Teufel steckt im Detail.

### Lidar: Chancen und Kostenfallen

Lidar profitiert besonders von der Zentralarchitektur, weil die aufwendige Signalverarbeitung (FPGA, DSP) im Sensor eingespart werden kann. Stattdessen wandern die Algorithmen in den zentralen SoC – die Hardware im Sensor reduziert sich auf Sender, SPAD-Empfänger und TDC-Zeitmesser. Allerdings steigen die Datenraten: Ein moderner 192‑Zeilen-Lidar mit 10 Hz, 120° horizontalem Sichtfeld und 0,1° Auflösung erzeugt etwa 3,6 Gbit/s. GMSL2 mit 6 Gbit/s reicht zwar noch, aber die Übertragungsqualität und SoC-seitige Verarbeitung werden zur Herausforderung. Zudem ist die Datenstruktur von Lidar völlig anders als die von Kameras: Lidar organisiert Daten in Slots (z. B. 1200 pro Frame) mit Abstand, Intensität und Rauschwerten – nicht in Pixeln. Reine MIPI-Einheiten oder GPU-Kerne kommen damit nicht optimal zurecht.

### Ultraschallsensoren: Einfach, aber viele Leitungen

Ultraschall-Radare sind algorithmisch simpel (Laufzeitmessung), doch bei 12 Sensoren pro Fahrzeug summieren sich die SerDes-Leitungen und Kosten. BYDs Lösung ist ein hybrider Ansatz: „lokal vorverarbeiten + zentral fusionieren". Die Stoßstangen-Einheit sammelt die Daten von bis zu 6 Sensoren, bündelt sie und sendet sie an die Zentrale. So bleiben die Vorteile zentraler Fusion erhalten, ohne dass ein Spinnennetz aus Kabeln entsteht.

BYD hat diesen Mittelweg für seine aktuelle Architektur gewählt – mit den genannten Verbesserungen: −20 % Latenz, +20 % Erkennungsweite, zehnfache Sensordichte.

## Fazit: Die Datenpipeline wird geöffnet

Die chinesische Automobilindustrie zwingt die Zuliefererkette, die Datenpipeline zu öffnen: Vom Sensorrohsignal bis zur finalen Entscheidung gibt es keine Blackbox mehr. Nur mit ungefilterten Daten können Algorithmen ihr volles Potenzial entfalten – und den Abstand zu etablierten Herstellern verringern. Nach dem Kamera-Durchbruch folgt nun die Integration von Radar und Lidar in die zentrale Recheneinheit. Dies ebnet den Weg für zuverlässigere L2-Systeme und erste L3-Erprobungen.

---

BYD verbaut die zentrale Architektur in aktuellen Modellen wie dem Han und Seal. Diese Fahrzeuge sind in Deutschland erhältlich, sodass die Technologie indirekt auch hierzulande Einzug hält. Ein separates Modell für Europa ist nicht angekündigt – es handelt sich um eine markenübergreifende Plattforminnovation.
