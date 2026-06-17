---
title: "[QA FAILED] BYD treibt zentrale Sensorarchitektur voran – Rohdaten statt Blackbox"
date: 2026-06-17T07:03:38.785Z
description: "Chinesische Autohersteller und Zulieferer stellen die Architektur der Fahrerassistenz um. Statt dezentraler Vorverarbeitung fließen Rohdaten aller Sensoren in eine zentrale Recheneinheit – das verspricht bessere Fusion und mehr Sicherheit."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] BYD treibt zentrale Sensorarchitektur voran – Rohdaten statt Blackbox

Die chinesische Automobilindustrie befindet sich in einem grundlegenden Wandel ihrer Sensor- und Rechenarchitektur für Fahrerassistenzsysteme. Bisher war die Verarbeitung von Radar-, Lidar- und Kameradaten dezentral organisiert: Jeder Sensor besaß einen eigenen "Mini-Computer", der Vorverarbeitung wie FFT-Spektrum oder Zielerkennung übernahm und nur aggregierte Ergebnisse an das zentrale Steuergerät weitergab. Diese klassische Blackbox-Struktur verursacht Informationsverluste, weil Zwischenergebnisse wegfallen.

## Von der Blackbox zur Rohdatenfusion

Die neue zentrale Architektur (chinesisch: 集中式架构) kehrt dieses Prinzip um. Statt jedes Radar oder Lidar erledigt die gesamte Signalverarbeitung lokal, werden die Rohdaten (RAW-ADC-Samples, Punktwolken) über schnelle SerDes-Verbindungen wie GMSL direkt in eine zentrale Recheneinheit (SoC) eingespeist. Dort läuft einheitliche Fusionssoftware, die echte 1+1>2-Effekte ermöglicht – zum Beispiel kombiniert die hohe Reichweite eines Millimeterwellenradars mit der Punktdichte eines Lidars.

Der Wandel wird durch neue Hardware möglich: NXP stellt eine Radar-Bridge vor, die zwischen MMIC und SoC geschaltet wird und die Signalverarbeitung direkt im SoC erlaubt. Auch Texas Instruments unterstützt mit seinen AWR-Serien den RAW-Datenmodus. Künftig wird die Radar-Signalverarbeitung als IP-Block (RSP-IP) direkt auf ADAS-SoCs integriert – die Algorithmen-Hoheit wandert von Tier-1-Zulieferern zu Chipentwicklern und OEMs.

## Millimeterwellenradar: Zwei Preis-Leistungs-Pfade

Beim 4D-Millimeterwellenradar zeichnen sich zwei Entwicklungslinien ab. Die chinesische Kosteneffizienz-Route setzt auf 1 SoC + 2 MMIC (8T8R), die europäische Premium-Variante auf 1 SoC + 4 MMIC (16T16R) bis hin zu 24T24R bis 2028. Beide Wege unterscheiden sich grundlegend in Kosten, Leistung und Einsatzszene. Die eigentliche Herausforderung liegt im Algorithmus: Wer besitzt das Radar-Signalverarbeitungs-IP? Kann der SoC die ungewohnte Datenstruktur (mehrdimensionale Arrays statt Bildframes) effizient verarbeiten?

## Laserradar und Ultraschall: Datenflut und Timing-Probleme

Laserradar (Lidar) liefert mit 192 Zeilen und 10 Hz Framerate etwa 3,6 Gbps Rohdaten – eine Datenmenge, die über GMSL2 transportiert werden kann. Allerdings ist die Datenstruktur (slots mit Hüllkurven) völlig anders als bei Kameras (Frames). Die ISPs und DSPs im SoC sind für Bilddaten optimiert, nicht für Lidar-Rohdaten. Hardware-Beschleuniger müssen umgewidmet werden, was die Effizienz drückt.

Ultraschall-Sensoren (Einparkhilfe) profitieren besonders von der zentralen Architektur: Statt einfacher Abstandsmessung können nun Laufzeitkorrelation und feinere Filter auf die Rohdaten angewendet werden – das erhöht die Reichweite um rund 20 % und detektiert auch statische Hindernisse wie Bordsteine. BYD (比亚迪) hat sein "Überschall"-System mit zentraler Verarbeitung vorgestellt und erreicht eine Reichweitensteigerung von ca. 20 % bei reduzierter Rechenlast.

## Fazit

Der Trend ist eindeutig: China baut seine Fahrerassistenz-Architektur von verteilt auf zentral um. Die Datenpipeline liefert Rohsignale ohne Blackbox – das ist die Grundlage für bessere Algorithmen und letztlich für den nächsten Schritt von Level-2 zu Level-3. Der Industriestandard verschiebt sich von der Sensor-Hardware zur Software-Kompetenz.

*Hinweis: Preise beziehen sich auf den chinesischen Markt und können in Europa abweichen.*

---

Die beschriebenen Architekturänderungen betreffen die gesamte Branche, sind aber keinem konkreten Fahrzeugmodell zuzuordnen. Eine Markteinführung in Deutschland ist nicht direkt absehbar.
