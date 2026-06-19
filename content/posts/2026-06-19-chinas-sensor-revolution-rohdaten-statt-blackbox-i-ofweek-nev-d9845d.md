---
title: "Chinas Sensor-Revolution: Rohdaten statt Blackbox im autonomen Fahren"
date: 2026-06-19T07:01:21.006Z
description: "Eine neue „dezentrale' Architektur verlagert die Sensor-Datenverarbeitung von Radaranbietern in die Fahrzeug-Zentralrechner. Das verspricht bessere Fusion, aber bringt Chip- und Algorithmus-Hersteller in neue Machtpositionen."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Chinas Sensor-Revolution: Rohdaten statt Blackbox im autonomen Fahren

Chinesische Automobilentwickler treiben einen fundamentalen Wandel in der Sensor-Architektur voran: Statt wie bisher Radar-, Lidar- und Kamerasignale bereits im Sensor vorzuverarbeiten, fließen künftig rohe Messdaten direkt in einen leistungsstarken Zentralcomputer (SoC). Das Ziel: eine verlustfreie Umfelderfassung ohne die traditionellen Blackboxen der Tier-1-Zulieferer.

## Was bedeutet „dezentrale" Architektur?

Bisher arbeitet jeder Radarsensor als eigenständiger „Mini-Computer": Er sammelt Rohdaten, führt eine FFT (Fast Fourier Transformation) durch, filtert Ziele und sendet nur eine „Objekttabelle" (z. B. „50 m voraus Hindernis") an das Steuergerät. Dabei gehen wertvolle Informationen verloren – etwa die genaue Beschaffenheit eines Objekts oder diffuse Reflexionen. Die neue Architektur kehrt das Prinzip um: Der Millimeterwellen-Radar (MMIC) wandelt nur noch das analoge Signal in digitale Rohdaten um, die dann per SerDes-Schnittstelle (GMSL) ungefiltert an den SoC gesendet werden. Dort fusioniert eine zentrale Algorithmik alle Sensorströme – Radar, Lidar, Kamera – auf Rohdatenebene. So lassen sich Widersprüche auflösen, z. B. wenn ein Millimeterwellen-Radar durch Regentropfen hindurch ein entferntes Ziel sieht, während die Kamera nur Nebel meldet. Statt „wer hat recht?" heißt es „was ist wirklich da?".

## Warum erst jetzt? – Machtverlagerung von Tier-1 zu Chip-Playern

Der Grund für den späten Umstieg liegt in der traditionellen Wertschöpfung: Bisher kontrollierten Tier-1-Zulieferer (wie Bosch, Continental oder chinesische Anbieter) die gesamte Radarsignalverarbeitung in ihrer festverdrahteten Firmware. Die Algorithmen galten als Geschäftsgeheimnis. Mit der neuen Architektur wird das Radar zum simplen „Rohdatentransporter" – die Intelligenz wandert in den SoC und in die Software-IP.

Ermöglicht wird dies durch neue Chip-Architekturen: Chiphersteller wie NXP bieten spezielle Radar-Bridge-ICs an, die MMIC und SoC verbinden, und integrieren Radarsignalverarbeitungs-IP (RSP IP) direkt in ADAS-SoCs. Auch Texas Instruments unterstützt mit seiner AWR-Serie den Rohdatenmodus. Für das Level 3/4-Autonome-Fahren reichen die bisherigen Objektlisten nicht mehr aus – hier braucht es die rohe Punktwolke, um stehende Hindernisse, Schlaglöcher oder Trümmerteile zu erkennen.

## Drei Wege, ein Ziel: Millimeterwellen-, Lidar- und Ultraschall im Umbruch

**Millimeterwellen-Radar (MMW):** Der Massenmarkt setzt auf preiswerte 2- oder 4-Chip-Lösungen (8T8R – 8 Sende-, 8 Empfangskanäle). Europa und gehobene Modelle nutzen 12/16-Kanal-Systeme (16T16R). Bis 2028 werden beide Zweige existieren – die Kosten- und Leistungsunterschiede entscheiden über die Anwendung. Die größte Hürde bleibt die Algorithmik: Wer beherrscht die Radar-IP? Kann sie effizient auf dem SoC portiert werden? Und wie passt das Radar-Datenformat (z. B. 3D-Tensor) in die für Kameras optimierten MIPI-Schnittstellen? NXP baut mit seiner RSP-IP eine eigene Chip-integrierte Mauer um die Algorithmen.

**Lidar:** Der Vorteil ist die direkte 3D-Punktwolke. Beim dezentralen Ansatz entfällt der teure FPGA-basierte Signalprozessor im Lidar – übrig bleiben Sender, SPAD-Empfänger und TDC (Time-to-Digital Converter). Moderne 192-Linien-Lidare erzeugen 3,6 Gbps Rohdaten bei 10 Hz und 120° Sichtfeld. Das passt gerade noch über GMSL2 (6 Gbps). Aber die Datenstruktur (zeitbasierte Slots statt Bildframes) ist mit Kamera-ISPs inkompatibel – DSPs müssen die Arbeit erledigen, was die Effizienz senkt.

**Ultraschall:** Hier ist die Algorithmik einfacher (Laufzeitmessung). Der Rohdaten-Ansatz kann die Genauigkeit steigern, indem feinere Korrelationsfilter angewendet werden. Allerdings steigt der Rechenaufwand um rund 20 %. Zudem würden 12 Sensoren à 12 Leitungen einen Kabelsalat erzeugen – praktikabel ist nur eine „regionale Vorverarbeitung" mit Bündelung pro Stoßfänger. BYD etwa nutzt diesen Mittelweg und gewinnt 20 % mehr Rechenleistung, 20 % mehr Reichweite und 10 % mehr Metalldichte-Nachweis.

## Fazit: Keine Blackbox mehr – alle Rohdaten an die Zentrale

Die chinesische Automobilindustrie treibt die „Ent-Blackboxung" der Sensorik voran. Künftig entscheiden nicht mehr die Zulieferer über die Qualität der Umfeldwahrnehmung, sondern die Algorithmen im Zentralrechner. Das verschiebt die Wertschöpfung hin zu Chip-Designern und Software-Experten – und eröffnet neue Möglichkeiten für Level 2+ und Level 3. Ob dieser Weg die hohen Rechenanforderungen und Schnittstellenprobleme löst, wird sich in den kommenden Modellgenerationen zeigen.

---

## In Europa

Dies ist keine Nachricht über ein bestimmtes Fahrzeug, sondern über eine technologische Entwicklung der chinesischen Automobilzulieferindustrie. Europäische Hersteller und Zulieferer beobachten den Trend genau; eine direkte Umsetzung in Deutschland erhältlichen Modellen steht noch aus.
