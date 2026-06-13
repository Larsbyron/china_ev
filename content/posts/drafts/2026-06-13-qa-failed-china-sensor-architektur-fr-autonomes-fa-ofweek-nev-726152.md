---
title: "[QA FAILED] China: Sensor-Architektur für Autonomes Fahren im Umbruch"
date: 2026-06-13T11:50:25.215Z
description: "Chinesische Autobauer und Tech-Firmen verlagern die Radar-Signalverarbeitung vom Sensor in die zentrale Rechenplattform. Das verspricht bessere Umfelderkennung, entmachtet aber traditionelle Tier-1-Zulieferer."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] China: Sensor-Architektur für Autonomes Fahren im Umbruch

## Was ist eine zentrale Sensorarchitektur?

Bislang arbeiteten die meisten Fahrzeuge mit einer verteilten Architektur: Jeder Radar-Sensor besitzt einen eigenen Mikrocontroller, der vor Ort eine Zielerkennung durchführt (z. B. „50 Meter voraus Hindernis“) und nur diese abstrahierten Daten per CAN-Bus an das Steuergerät sendet. Informationen gehen dabei verloren – etwa Streuungen durch Regen oder die exakte Form eines Objekts.

Die neue Philosophie heißt **zentrale Architektur** (auch „zentralisierte Sensorfusion“): Sensoren liefern nur noch Rohdaten – beim Radar beispielsweise die FFT-Frequenzspektren oder die RAW-Amplituden. Diese Rohdaten werden über Hochgeschwindigkeits-SerDes-Links (z. B. GMSL) direkt an einen leistungsstarken ADAS-SoC (System-on-Chip) übertragen. Erst dort führt ein einheitlicher Algorithmus die gesamte Signalverarbeitung und Fusion durch.

Der Vorteil: Aus 1+1 wird nicht nur 2, sondern potenziell 5. Ein Beispiel: Ein Kamera-Radar sieht ein Objekt verschwommen, weil Regen die Mikrowellen streut – der Millimeterwellen-Radar dringt durch, aber liefert nur grobe Entfernungen. In der zentralen Architektur kombiniert der Algorithmus beide Rohdaten und erzeugt ein viel präziseres Umfeldmodell.

## Warum jetzt der Wechsel? – Kontrollverlust der Tier-1

Jahrzehntelang lag die Algorithmus-Hoheit bei den traditionellen Tier-1-Zulieferern (Bosch, Continental, Hella u. a.). Sie lieferten „Blackbox“-Sensoren: Der Autohersteller bekam fertige Objektlisten, aber keinen Einblick in die Verarbeitung. Für Stufe 2 reichte das.

Mit Stufe 3 und höher reicht eine bloße Objektliste nicht mehr aus. Die Systeme müssen feinste Bewegungen (Fahrradfahrer, Kinder) sowie stehende Hindernisse (Stein, Leitplanke) zuverlässig erkennen. Dazu sind **Rohdaten** nötig – FFT-Domänen, Mikro-Doppler, Punktwolken.

Die chinesische Sensor-Industrie treibt diesen Wandel massiv voran. Hersteller von Radar-IC wie NXP bieten spezielle Bridge-Chips (z. B. Radar Bridge) und lizenzieren Signalverarbeitungs-IP (RSP IP) direkt an SoC-Hersteller. TI unterstützt mit seinen AWR-Millimeterwellen-Radarchips serienmäßig RAW-Ausgabe.

Die Folge: Die Autohersteller – oder ihre ADAS-SoC-Partner (z. B. Horizon Robotics, Black Sesame, Mobileye) – übernehmen die Algorithmen. Tier-1 werden zu reinen Hardware-Lieferanten.

## Drei Radartypen, drei Wege zur Zentralisierung

**Millimeterwellen-Radar (24/77 GHz):** Die traditionelle 3D-Radar (Ein-Chip-Lösung) wird abgelöst durch **4D-Imaging-Radar** mit Multi-Chip-Architekturen. In China setzt man auf kostengünstige 1‑SoC + 2‑MMIC-Lösungen (6 Tx / 8 Rx). Europa plant bereits 24 Tx / 24 Rx mit 4 MMIC. Die Herausforderung: Radar-Daten sind nicht wie Kamerabilder im Frame-Format organisiert, sondern in Slots mit Doppler-Information. Die MIPI-Schnittstelle, eigentlich für Kameras optimiert, muss angepasst werden – oder man nutzt dedizierte DSP-Kerne.

**Laser-Radar (LiDAR):** Die Zentralisierung ist hier besonders reizvoll, da das FPGA oder der embedded Prozessor im LiDAR oft teuer ist. Verlegt man die gesamte Signalverarbeitung in den Zentral-SoC, entfallen FPGA-Kosten. Allerdings steigen die Anforderungen an die Datenbandbreite: Ein LiDAR mit 192 Zeilen, 10 Hz, 0,1° Auflösung erzeugt ca. 3,6 Gbps – das passt noch über GMSL2 (6 Gbps), aber die Latenz und Verarbeitung auf CPU/GPU statt dedizierter DSPs könnte ineffizient sein.

**Ultraschall-Radar:** Die einfachste Variante. Statt Laufzeitmessung im Sensor liefert man die gesamte Echo-Wellenform. In der Praxis wird eine Hybridlösung empfohlen: Ein zentraler Rechner im Stoßfänger (Local Domain Controller) sammelt die Daten von 6 Sensoren, fasst sie zusammen und sendet sie über ein SerDes-Link an den Zentralrechner. BYD hat diesen Ansatz bereits serienmäßig im Einsatz – mit 20 % weniger Zeitfehlern, 20 % mehr Reichweite und 10 % besserer Auflösung. Es ist ein Kompromiss zwischen „total zentral“ und „total dezentral“.

## Fazit: Die Daten-Pipeline wird zum entscheidenden Wettbewerbsfaktor

Die chinesische Automobilindustrie baut die komplette Datenpipeline vom Sensorrohsignal bis zur Entscheidung ohne Blackbox. Nur mit vollständigen Rohdaten lassen sich Algorithmen trainieren, die wirklich autonom fahren. Nachdem Kameras bereits in die SoCs integriert wurden, folgen nun Radar und LiDAR – und bald wohl auch Ultraschall. Der Kampf um die Algorithmen-Hoheit ist der eigentliche Kern des Strukturwandels in der Branche.

---

Dieser technologische Trend ist in Europa aktuell nicht an ein bestimmtes Fahrzeugmodell gebunden. Auch deutsche Hersteller wie BMW, Mercedes-Benz und VW arbeiten an zentralisierten Sensorarchitekturen, liegen aber in der Serienumsetzung oft hinter chinesischen Wettbewerbern zurück.
