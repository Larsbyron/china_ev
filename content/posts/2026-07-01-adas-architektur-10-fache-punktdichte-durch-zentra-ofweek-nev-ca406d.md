---
title: "ADAS-Architektur: 10-fache Punktdichte durch zentrale Fusion"
date: 2026-07-01T06:23:19.184Z
description: "Chinesische Hersteller setzen auf offene Sensor-Architekturen: Statt Blackbox-Lösungen von Tier-1 sollen Rohdaten zentral fusioniert werden. Das bringt mehr Punktdichte und erfordert neue Chipstrategien."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# ADAS-Architektur: 10-fache Punktdichte durch zentrale Fusion

Die chinesische Automobilindustrie treibt einen grundlegenden Wandel in der Sensorarchitektur voran. Weg von geschlossenen „Blackbox“-Systemen der Zulieferer (Tier-1) hin zu einer offenen, zentralen Fusionsplattform. Das Ziel: Alle Sensoren – Radar, Lidar, Kamera – liefern ihre Rohdaten direkt an eine leistungsstarke System-on-Chip (SoC) Einheit, die die Objekterkennung und -fusion übernimmt.

## Von der Verteiler- zur Zentralarchitektur

Bisher arbeiteten Radarsensoren weitgehend autonom: Jeder Sensor extrahiert mittels integriertem Signalprozessor Ziele (z. B. „50 Meter voraus Hindernis“) und sendet nur diese stark gefilterte Liste an das Steuergerät. Das Problem: Bei komplexen Szenarien gehen Informationen verloren – etwa wenn Regentropfen Radarwellen streuen und ein echtes Ziel unscharf wird. Ein Millimeterwellenradar könnte durch seine stärkere Durchdringung ein klareres Bild liefern, aber die verteilte Architektur kann die widersprüchlichen Einzelmeldungen nicht intelligent fusionieren.

Die neue zentrale Architektur vereint dagegen alle Rohdaten (FFT-Spektrogramme, Lidar-Rohscan, Kamerarohbilder) in einem gemeinsamen Koordinatensystem. Einheitliche Algorithmen entscheiden dann nicht mehr nach dem „Wer schreit am lautesten“-Prinzip, sondern kombinieren Daten aus allen Quellen optimiert – 1+1 kann plötzlich 5 ergeben.

## Algorithmus-Kontrolle: Vom Tier-1 zum Chip-Hersteller

Der Kern des Umbruchs: Bisher hielten Tier-1-Zulieferer wie Bosch oder Continental das Know-how zur Radarsignalverarbeitung (Zielextraktion aus FFT, Clustering, Doppler-Schätzung) in ihrer Firmware unter Verschluss. Die chinesischen Hersteller (OEMs) fordern nun Zugang zu den Rohdaten. Dazu treiben Halbleiterkonzerne wie NXP und TI spezielle Schnittstellen voran:

- **NXP Radar Bridge**: Ein Bridge-Chip zwischen MMIC (Hochfrequenz-Baustein) und SerDes, der die Rohdaten ausleitet.
- **TI AWR-Serie**: Radarchips, die bereits RAW-Datenausgabe unterstützen.  
- **RSP-IP (Radar Signal Processing IP)**: Wird direkt in ADAS-SoCs integriert – Algorithmen laufen dann auf offenen Chip-Architekturen.

Für L3/L4 autonomes Fahren reicht die alte „Objekttabelle“ nicht mehr: Einzelne Bildpunkte und Mikro-Doppler-Signaturen (z. B. für Fußgänger oder Fahrräder) sind entscheidend. Allerdings steigt die Rechenlast enorm – ein SoC muss z. B. 12 Radar-Kanäle mit FFT und CFAR verarbeiten.

## Technische Herausforderungen der drei Sensorarten

- **Millimeterwellen-Radar**: Der Modul-Ansatz (z. B. 8T8R-Chip+2 MMIC) senkt die Kosten. In Europa werden dagegen Hochleistungs-Lösungen mit 16T16R oder 24T24R favorisiert. Bis 2028 werden sich die beiden Linien weiter ausdifferenzieren.
- **Lidar**: Die zentrale Architektur eliminiert den FPGA auf dem Sensor. Stattdessen reichen Laser-Array, SPAD-Empfänger und TDC-Hardware die Rohdaten über MIPI aus. Problem: Die Datenstruktur von Lidar (z. B. 1200 Slots pro Frame, 3,6 Gbit/s) passt nicht zu standardisierten Kamera-MIPI-Schnittstellen – DSPs müssen umständlich übersetzen.
- **Ultraschall**: Algorithmisch einfach (Laufzeitmessung), aber die Rohdatenübertragung (= Abtastwerte) beansprucht 20 % mehr Rechenzeit und liefert 10-mal mehr Punktdichte als gefilterte Listen. Durch feinere matched-filter-Algorithmen lassen sich mehr Informationen extrahieren. Der Kabelaufwand (12 Sensoren, jeder mit SerDes) ist hoch – es sind Kompromisse zwischen „teilzentraler“ Bündelung im Stoßfänger und vollständiger Zentralisierung nötig.

BYD (比亚迪) setzt bei seinen Modellen auf einen Mittelweg: Die Rechenzeit steigt um 20 %, die Erkennungsreichweite um 20 %, die Punktdichte um das 10-Fache. Das Unternehmen bezeichnet dies als „teilsicher, teilzentral“ – einen optimalen Kompromiss zwischen Kosten und Performance.

## Fazit

Die chinesische Automobilindustrie will die Datenpipeline von der Erfassung bis zur Entscheidung komplett öffnen – ohne Blackbox. Nur mit Rohdaten können Algorithmen ihr volles Potenzial entfalten. Nach den Kamerabildern werden nun Radar- und Lidar-Rohdaten zur nächsten Stufe des Wettbewerbs in der Fahrerassistenz.

---

## In Europa

Dieser Artikel behandelt eine technische Branchenentwicklung ohne Bezug zu einem spezifischen Fahrzeugmodell.
