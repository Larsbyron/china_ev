---
title: "NXP Radar Bridge: Rohdaten-Fusion für präziseres autonomes Fahren"
date: 2026-07-16T19:04:56.435Z
description: "Eine neue Architektur verlagert die Sensorfusion vom Radar- in den Zentralrechner. NXP und TI liefern Schlüsselchips. Die Latenz sinkt um 20 %, die Reichweite steigt – erstmals für L3/L4 geeignet."
source: "OFweek NEV"

category: "news"

brands: ["Huawei", "NXP", "Texas Instruments"]
tags: ["Batterie", "Reichweite", "Absatz"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# NXP Radar Bridge: Rohdaten-Fusion für präziseres autonomes Fahren

Die „Brücke des eisernen Dreiecks" der intelligenten Fahrt rückt ins Zentrum einer technischen Revolution: die Architektur der Sensorfusion. Bisher arbeiteten Radar, Kamera und LiDAR weitgehend autark – jeder Sensor hatte seinen eigenen „Mini-Hirn". Nun aber verlagert sich die Algorithmus-Hoheit von den Zulieferern (Tier-1) hin zum zentralen Fahrzeug-Computer. Der Durchbruch kommt von spezialisierten Chips – allen voran NXP (NXP) mit dem Radar-Bridge-Chip und Texas Instruments (TI) mit der AWR-Serie, die den Rohdaten-Ausgang unterstützen. Bereits 2025 sollen erste Serienfahrzeuge diese Architektur nutzen; erwartet wird ein Absatz von über 4 Millionen Fahrzeugen bis 2028.

## Von verteilt zu zentral: Was ändert sich?

Bisher verarbeitete jeder Millimeterwellen-Radar selbstständig: Signalerfassung, FFT-Analyse, Zielerkennung und Geschwindigkeitsmessung fanden im Sensor statt. Heraus kam eine reduzierte „Ziel-Liste" – ein gefilterter Report. Die zentrale Steuereinheit bekam nur das Ergebnis, nicht die Rohdaten. Die neue Architektur dreht den Spieß um: Der Radar liefert nur die unverarbeitete Rohwelle (MMIC + 1D FFT) und schickt diese über SerDes-Leitungen an das zentrale SoC. Erst dort fusionieren Algorithmen alle Sensordaten – Radar, Kamera, LiDAR – in einem gemeinsamen Raum. Das ermöglicht eine Fusion, die mehr ist als die Summe der Teile. Ein Beispiel: Der Millimeterwellen-Radar durchdringt Wasser und Nebel, die Kamera sieht Farben und Formen. Beide Rohdaten zusammengeführt ergeben ein präzises Gesamtbild, das kein einzelner Sensor allein liefern könnte. Konkret meldet NXP, dass die neue Architektur die Latenz um 20 % senkt und die Erkennungsreichweite um 20 % erhöht – bei gleichzeitig zehnfach höherer Punktdichte.

## Warum der Wandel erst jetzt kommt?

Der technische Durchbruch liegt in spezialisierten Chips. NXP (NXP) bietet mit dem Radar Bridge einen dedizierten Brücken-Chip, der zwischen MMIC und SerDes schaltet. Gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP) direkt in ADAS-SoCs – Algorithmen wandern vom Radarmodul in den Chipkern. TI (Texas Instruments) geht einen ähnlichen Weg: Die AWR-Serie unterstützt bereits den Rohdaten-Ausgang. Der Druck kommt von höheren Autonomiestufen (L3/L4). Die einfache Ziel-Liste reicht nicht mehr. Für die Erkennung von teilweise verdeckten Fußgängern, Radfahrern oder Steinen auf der Fahrbahn braucht es das volle Frequenzspektrum, Mikro-Doppler und Intensitätsinformationen. Bisher war der Rechenaufwand zu hoch für zentrale SoCs – doch mit den neuen Brücken-Chips und leistungsfähigeren Prozessoren ist die Hürde genommen. Erste Tier-1-Lieferanten wie Bosch und Continental arbeiten bereits an der Integration für 2026er-Modelle.

## Drei Sensortypen – drei Herausforderungen

*   **Millimeterwellen-Radar:** Die 4D-Radar-Module werden auf zwei Wegen entwickelt: Chinesische Hersteller setzen auf „1 SoC + 2 MMIC" (8T8R) für Kostenvorteile, europäische auf „1 SoC + 4 MMIC" (16T16R) für höhere Leistung. Bis 2028 werden sich beide Linien angleichen. Die größte Hürde ist die Algorithmus-IP: Wer besitzt sie? Tier-1 oder Chip-Hersteller? NXP baut mit RSP IP eine Mauer um sein Ökosystem.
*   **LiDAR:** Die Zentralisierung senkt die Kosten, da teure FPGAs und Signalprozessoren im Sensor entfallen. Allerdings müssen die Datenströme (bis zu 3,6 Gbit/s pro Sensor) über GMSL2-Leitungen fließen. Zudem unterscheidet sich die Datenstruktur grundlegend von Kameras – eine effiziente Verarbeitung im SoC erfordert spezielle DSP-Kerne.
*   **Ultraschall-Radar:** Die Algorithmen sind einfacher (Laufzeitmessung), aber die Verlagerung in den Zentralrechner bringt Skalierungsprobleme: 12 Sensoren × SerDes-Leitungen würden zu teuer. Die Lösung ist eine „teilzentrale" Architektur mit lokalen Aggregatoren, die eine Zwischenstufe bilden. BYD (比亚迪) setzt diese bereits in seinen neuesten Modellen ein und meldet 20 % weniger Latenz, 20 % mehr Reichweite und zehnfach höhere Punktdichte – ein Kompromiss zwischen „voll zentral" und „voll verteilt".

Die chinesische Automobilindustrie will die schwarze Box öffnen: Vom Rohsignal bis zur Entscheidung darf kein undurchsichtiger Zwischenschritt mehr existieren. Nur so lassen sich Algorithmen optimieren, die über die Batterie- und Antriebsunterschiede hinaus den entscheidenden Vorsprung bringen. Nach den Kameras werden nun auch Radare und LiDARs Teil dieser offenen Architektur – und ebnen den Weg für L2+ und L3 in Serie.

---

Die beschriebene Technologie ist eine Branchenentwicklung ohne Bezug zu einem bestimmten Fahrzeugmodell. NXP und TI sind global tätig; eine Umsetzung in deutschen Fahrzeugen wird für 2026 erwartet.
