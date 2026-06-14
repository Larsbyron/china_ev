---
title: "[QA FAILED] Zentrale Sensor-Architektur: Chinas Autobranche erfindet das Radar neu"
date: 2026-06-14T19:14:01.989Z
description: "Vom verteilten zum zentralen Gehirn: Chinesische Hersteller ersetzen Blackbox-Sensoren durch Rohdaten-Algorithmen. Neue Chip-Architekturen von NXP und TI ermöglichen tiefere Sensorfusion für autonomes Fahren."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "TI"]
tags: ["Reichweite", "Hybrid", "Autonomes Fahren"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Zentrale Sensor-Architektur: Chinas Autobranche erfindet das Radar neu

Die chinesische Automobilindustrie vollzieht einen fundamentalen Wandel in der Sensor-Architektur für Fahrassistenzsysteme. Statt wie bisher jedes Radar, jede Kamera und jedes Lidar mit eigener Signalverarbeitung auszustatten, werden künftig rohe Sensordaten an eine zentrale Recheneinheit (ECU) geschickt. Das Ziel: vollständige Transparenz der Algorithmen und bessere Sensorfusion.

## Dezentral vs. zentral: Zwei Welten

Bisher arbeiteten Sensoren weitgehend autark: Ein Radar führte an Bord die gesamte Signalverarbeitung durch – von der FFT-Spektralanalyse (Fast Fourier Transformation, die aus den Radarwellen Objekte extrahiert) bis zur Zielverfolgung. An die Zentrale sendete es nur eine verdichtete „Detektionsliste" – etwa „50 Meter voraus Hindernis". Nachteile: Informationen gehen verloren, die Fusion unterschiedlicher Sensortypen wird erschwert. Bekanntes Beispiel: Ein 4D-Radar könnte stärker durch Regen dringen als ein Lidar, doch in der dezentralen Architektur widersprechen sich die Meldungen.

## Zentralarchitektur: Algorithmen-IP wandert vom Tier-1 zum SoC

Die neue Denkschule – in China als „zentrale Sensor-Architektur" bekannt – verlangt, dass die Sensoren nur noch die rohen Zwischenergebnisse (z. B. 1D-FFT aus dem Radar, „Punktwolken" aus dem Lidar) über Breitband-Verbindungen wie GMSL (Gigabit Multimedia Serial Link) an die zentrale ADAS-SoC (System-on-Chip) senden. Dort laufen alle Algorithmen zusammen. Das erlaubt echte Sensorfusion – etwa „Radar sieht eine diffuse Wolke, Lidar erkennt ein Fahrzeug dahinter – beide Daten werden kombiniert, nicht gegeneinander abgewogen".

Der Grund, warum dieser Schritt erst jetzt möglich wird: Bisher lag das Kern-Know-how der Radarsignalverarbeitung bei den Tier-1-Zulieferern wie Bosch oder Continental – in proprietären Firmwares. Mit der Zentralarchitektur wandert die Algorithmen-Kontrolle zu den SoC-Herstellern. NXP hat dafür spezielle Radar-Bridge-Chips (Radar-Brücken-Chips) entwickelt, die zwischen der MMIC (Monolithischer Mikrowellen-IC, der Hochfrequenz-Sende- und Empfangsteil) und dem SerDes (Serielles Datenübertragungs-Interface) vermitteln. Gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP IP) direkt in seine ADAS-SoCs. Auch TI geht diesen Weg: Seine AWR-Serie unterstützt bereits RAW-Datenausgabe.

## Herausforderungen: Datenmengen, Schnittstellen, Rechenlast

Der Wechsel bringt immense Herausforderungen. Ein Lidar mit 192 Laserzeilen, 10 Hz Bildrate und 120° Sichtfeld erzeugt pro Sekunde etwa 3,6 Gbit – das entspricht einem hochauflösenden Videostream. Die Datenstruktur ist aber völlig anders: Statt eines pixelbasierten Rasters (wie bei Kameras) arbeiten Lidars mit Slots – 1200 Slots pro Frame, jeder Slot trägt Entfernung, Amplitude und Reflektivität. Die MIPI-Schnittstelle (Mobile Industry Processor Interface, für Kameras optimiert) und die DSP (Digital Signal Processor) auf dem SoC sind oft nicht für solche Datenformate ausgelegt. Der Rechenaufwand für eine zentrale Rohdatenverarbeitung (FFT, CFAR – Constant False Alarm Rate, also Rauschschwellenberechnung) ist enorm: Werden 12 Radar-Kanäle vollständig auf dem SoC bearbeitet, steigt die CPU/GPU-Last drastisch.

## Hybride Lösungen als Zwischenschritt

Aus Kostengründen setzen viele Hersteller auf einen Mix: Statt aller Sensoren vollzentral zu verkabeln, werden die Daten zunächst lokal vorgefiltert und dann gebündelt an die ECU gesendet. BYD (比亚迪) beispielsweise präsentierte einen „verteilt zentralen" Ansatz: Die Rechenzeit für die Signalverarbeitung sank um fast 20 %, die Erkennungsreichweite stieg um 20 % und die Punktrückgabedichte (Detailtreue) nahm um das Zehnfache zu. Der Kompromiss: Ein Teil der Signalverarbeitung bleibt im Sensor, der Rest wird zentral erledigt.

## Fazit

Die chinesische Automobilindustrie treibt einen technologischen Paradigmenwechsel von der Blackbox-Sensorik hin zur offenen Rohdatenarchitektur voran. Algorithmen-IP verlässt die Tier-1-Zulieferer und geht an Chip- und Software-Plattformen. Das erlaubt tiefere Sensorfusion – die Voraussetzung für zuverlässiges L3-Autonomes Fahren (Stufe-3-Automatisierung, bei der der Fahrer nur noch bei Aufforderung eingreifen muss). Die nächste Stufe: L2-Plus-Systeme profitieren bereits heute von diesem Ansatz.

---

Dieser Artikel beschreibt einen branchenweiten Technologietrend aus China, der keine direkte Fahrzeugverfügbarkeit in Europa betrifft. Die Entwicklungen beeinflussen jedoch globale Zulieferer und könnten zukünftige Assistenzsysteme in europäischen Modellen prägen.
