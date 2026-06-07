---
title: "[QA FAILED] BYD setzt auf RAW-Daten-Fusion: 400 m Radar-Reichweite"
date: 2026-06-07T06:17:19.615Z
description: "Chinesische Hersteller wie BYD wechseln von verteilter zu zentraler Sensor-Architektur. Rohdaten aller Radare und Lidare werden in einem SoC fusioniert – 20 % weniger Latenz, 400 m Reichweite. Neue Machtverhältnisse in der Zulieferkette."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NIO", "XPeng"]
tags: ["Reichweite", "Elektroauto"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] BYD setzt auf RAW-Daten-Fusion: 400 m Radar-Reichweite

Die Zeiten, in denen jedes Radar und jeder Lidar in einem Elektroauto sein eigenes „kleines Gehirn" hatte, gehen zu Ende. Immer mehr chinesische Hersteller – angeführt von BYD (比亚迪) – setzen auf eine zentrale Sensor-Fusion-Architektur. Statt gefilterter Zielobjekte werden rohe, unverarbeitete Signale (RAW-Daten) von bis zu zwölf Sensoren über SerDes-Kabel an einen zentralen ADAS-SoC (System-on-a-Chip) geschickt. Das Ergebnis: Die Algorithmen sehen erstmals das vollständige Bild – ohne Informationsverlust durch Vorverarbeitung in den Sensoren.

## Was ist die zentrale Sensor-Fusion-Architektur?

Bisher arbeitet jedes Radar und Lidar weitgehend autonom: Der Chip im Sensor führt FFT (Fast Fourier Transformation) durch, erkennt Ziele, misst Abstände und Geschwindigkeiten und schickt nur die fertige Ziel-Liste an das Steuergerät. Bei einer zentralen Architektur hingegen bleibt der Sensor „dumm". Er beschränkt sich auf den Hochfrequenzteil (MMIC) und die Analog-Digital-Wandlung. Die gesamte Signalverarbeitung – von der FFT über die Objektklassifikation bis zur Fusion mit Kamera- und Lidar-Daten – erfolgt im leistungsstarken SoC der Fahrzeug-Zentraleinheit.

Der Vorteil liegt auf der Hand: Liefern zwei Radare widersprüchliche Meldungen (z. B. eines „kein Hindernis", das andere „Hindernis") kann der Algorithmus die Rohdaten beider Sensoren zeitlich und räumlich korrelieren. Statt einem „entweder-oder" entsteht ein „sowohl-als-auch" – die Reichweite steigt, Fehldetektionen sinken. BYD gibt an, dass die Latenz um über 20 % fällt und die Erkennungsdichte auf das Zehnfache steigt. 4D-Millimeterwellenradare erreichen so eine Reichweite von 400 Metern – fast doppelt so viel wie konventionelle Systeme.

## Warum erst jetzt? – Der Kampf um die Algorithmus-Hoheit

Die Umstellung scheiterte lange an den Tier-1-Zulieferern. Sie hüteten die Signalverarbeitungs-Know-how als ihr Kerngeheimnis: Wie werden aus FFT-Spektren Ziele extrahiert? Wie wird Rauschen unterdrückt? Die Algorithmen steckten fest in der Firmware der Radarmodule. Erst als Halbleiterhersteller wie NXP spezielle Radar-Bridge-Chips und TI rohdata-fähige AWR-Serien auf den Markt brachten, wurde der Weg frei. Parallel dazu integrieren ADAS-SoC-Hersteller zunehmend Radar-Signalverarbeitungs-IP (z. B. RSP-IP) direkt in ihre Chips. Das ermöglicht es Herstellern wie BYD, die Kontrolle über die gesamte Wahrnehmungskette zu übernehmen.

Allerdings gibt es Hürden: Lidar-Daten sind anders organisiert als Kamerabilder. Ein Lidar sendet Punktwolken in Slots, eine Kamera liefert Frames. Die MIPI-Schnittstelle vieler SoCs ist für Kameras optimiert – DSPs und GPUs müssen die Daten aufwändig umformatieren. Auch die Bandbreite ist enorm: Ein 192-Linien-Lidar mit 10 Hz und 120° Sichtfeld erzeugt 3,6 Gbit/s – das entspricht einem hochauflösenden Videostream pro Sekunde. GMSL2 (6 Gbit/s) reicht knapp, aber viele Hersteller müssen auf teure GMSL3 umsteigen.

## Zwei Wege: China setzt auf Kosten, Europa auf Performance

Bei der konkreten Radar-Hardware zeichnen sich zwei Lager ab. Chinesische Hersteller bevorzugen das „1 SoC + 2 MMIC"-Design mit 8T8R (8 Sende-, 8 Empfangskanäle). Das bietet gute Leistung zu niedrigen Kosten. Europäische und US-Hersteller tendieren zu „1 SoC + 4 MMIC" (16T16R), manche planen sogar 24T24R bis 2028. Die chinesische Industrie argumentiert, dass die zentrale Rohdaten-Fusion die geringere Hardware-Performance durch bessere Algorithmen mehr als ausgleicht.

Auch bei Lidar gibt es Unterschiede: Während konventionelle Lidar-Systeme ein FPGA zur Signalverarbeitung im Sensor selbst tragen, entfällt dieses bei der zentralen Architektur. Der Sensor besteht dann nur noch aus Sender, SPAD-Empfänger und TDC – die Verarbeitung wandert in den SoC. Das spart Kosten und vereinfacht das Packaging.

## Fazit: Die „Blackbox" der Tier-1-Zulieferer wird geöffnet

Die chinesische Automobilindustrie – allen voran BYD (比亚迪), aber auch NIO (蔚来) und XPeng (小鹏) – treibt diesen Wandel voran. Sie wollen die volle Kontrolle über die Datenpipeline: vom rohen Signal bis zur endgültigen Entscheidung. Keine Blackbox mehr, keine versteckten Algorithmen. Nur so lassen sich die Lücken zwischen L2 und L3 schließen. Die europäischen Hersteller stehen vor der Wahl: entweder selbst in die Rohdaten-Architektur zu investieren – oder die Abhängigkeit von chinesischen Zulieferern weiter zu vergrößern.

---

Die beschriebene zentrale Sensor-Fusion-Architektur wird in chinesischen Serienfahrzeugen wie dem BYD Yangwang U8 und anderen Modellen bereits eingesetzt. In Europa ist diese Technologie bislang in keinem Serienmodell verfügbar. Eine Markteinführung entsprechender Systeme durch chinesische Hersteller auf dem europäischen Markt steht noch aus und wird frühestens 2027 erwartet.
