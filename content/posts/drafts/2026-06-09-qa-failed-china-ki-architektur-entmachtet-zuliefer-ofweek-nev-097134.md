---
title: "[QA FAILED] China: KI-Architektur entmachtet Zulieferer im Autobau"
date: 2026-06-09T20:26:22.246Z
description: "Eine neue zentrale Sensordaten-Architektur verlagert die Algorithmus-Hoheit von Tier-1 auf OEMs. Chinesische Hersteller setzen auf Rohdaten statt gefilterter Reports – das verändert die Wertschöpfungskette."
source: "OFweek NEV"

category: "news"


tags: []
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] China: KI-Architektur entmachtet Zulieferer im Autobau

Chinesische Autohersteller und Technologiepartner wie BYD (比亚迪) treiben einen grundlegenden Wandel in der Fahrerassistenz-Architektur voran: Statt jedes Radar und jeden Lidar im Sensor selbst vorzuverarbeiten, wird künftig das rohe, ungefilterte Signal direkt an eine zentrale Recheneinheit (SoC) gesendet. Das Unternehmen hinter diesem Konzept wird als „Sensorfusion ohne Blackbox" bezeichnet.

### Warum Rohdaten besser sind als Ergebnisse

Bisher arbeiteten Sensoren wie Radare und Lidare weitgehend autark: Jeder Sensor führte eigene Signalverarbeitung (etwa FFT, Zielerkennung, Clustering) durch und schickte nur das Ergebnis – „50 Meter voraus Hindernis erkannt" – an die Zentrale. Dabei gehen jedoch Informationen verloren. Der zentrale Algorithmus bekommt keine Rohdaten und kann widersprüchliche Meldungen („Radar sagt Hindernis, Lidar sagt frei") nicht auflösen.

Die neue Architektur verlangt von den Sensoren nur noch Rohsignale – bei Radaren das RAW-ADC-Signal oder das FFT-Spektrum, bei Lidaren die Punktwolke. Die gesamte Wahrnehmung und Fusion läuft auf einem leistungsstarken ADAS-SoC (etwa von NXP, TI oder chinesischen Herstellern). Das erlaubt eine viel intelligentere Fusion: 1+1 kann plötzlich 5 ergeben, weil die Stärken der Sensortypen kombiniert werden.

### Algorithmus-Macht wechselt den Besitzer

Der Schlüssel zu diesem Wandel liegt in der IP-Kontrolle. Bislang hielten Tier-1-Zulieferer (wie Bosch, Continental, aber auch chinesische) das Know-how zur Radarsignalverarbeitung in ihren Blackbox-Firmwares. Die neue Front-loading-Architektur zwingt die Zulieferer, nur noch die reine MMIC-Hardware und einfache Vorverarbeitung (erste FFT-Stufe) zu liefern. Die gesamte Smart-Logik wandert ins SoC – und damit in die Hand der Plattformentwickler.

Chipspezialisten wie NXP bieten spezielle Radar-Bridge-Chips an, die RAW-Daten per SerDes übertragen, und integrieren gleichzeitig Radar-Signalverarbeitungs-IP (RSP) direkt in den SoC. Auch TI geht mit seinen AWR-Serien diesen Weg. Damit wird die Algorithmus-Kompetenz von den Zulieferern zu den SoC-Designern und OEMs verlagert. Für L2+/L3-Anwendungen reichen lemmabasierte Zielobjektlisten nicht mehr aus – benötigt wird das feine Punkt-Rauschen zur Unterscheidung von regennasser Fahrbahn und Schlagloch.

### Drei Radartypen – drei Herausforderungen

**4D-Millimeterwellenradar:** Der Kostendruck zwingt zu Kompromissen. In China setzen viele auf eine „1 SoC + 2 MMIC"-Lösung (8T8R), in Europa auf 1+4 (16T16R). Bis 2028 konkurrieren 8T8R- und 24T24R-Architekturen. Die eigentliche Hürde ist die Algorithmus-IP: Wer sie besitzt, kontrolliert die Wertschöpfung.

**Lidar:** Die Vorverarbeitung (FPGA im Sensor) kostet viel. Die neue Architektur spart diese Komponente: Das Lidar sendet nur noch Rohdaten (SPAD-Pixel, Histogramme) über MIPI. Aber die Datenstruktur (Slots statt Frames) passt nicht zu bestehenden ISP-Pipelines – DSPs müssen effizient umgerüstet werden. Eine 192-Linien-Lidar erzeugt 3,6 Gbit/s, was GMSL2 an seine Grenzen bringt.

**Ultraschallsensor:** Er ist von Natur aus einfach – Laufzeitmessung, keine Signalverarbeitung. Die Architektur verschiebt die gesamte Echoanalyse in die Zentrale: 20 % mehr Rechenlast, aber 10 % höhere Erkennungsdichte. Allerdings: Bei 12 Sensoren braucht jeder eine SerDes-Leitung. Ein praktischer Kompromiss: lokale Bündelung (z. B. 6 Sensoren pro Caravan) und dann gemeinsamer Upload – BYD setzt diese Zwischenstufe erfolgreich ein.

### Fazit für die Branche

Die chinesische Automobilindustrie entscheidet sich für eine transparente, rohdatengesteuerte Wahrnehmungskette ohne Blackbox. Das verschiebt die Wertschöpfung von traditionellen Tier-1-Zulieferern hin zu Halbleiter- und Algorithmus-Firmen. Europäische Hersteller müssen diesen Trend beobachten, denn künftige Generationen chinesischer Fahrzeuge (von BYD, NIO, XPeng) werden mit dieser Architektur in den Westen kommen.

---

Dieser Artikel bezieht sich nicht auf ein spezifisches Fahrzeugmodell, sondern auf eine branchenweite technologische Entwicklung. Die beschriebene Sensorarchitektur könnte langfristig auch in Europa angebotene chinesische Fahrzeuge betreffen. Eine unmittelbare Markteinführung in Deutschland ist nicht bekannt.
