---
title: "BYD: 20 % mehr Sensorreichweite durch neue Architektur"
date: 2026-06-23T12:32:18.021Z
description: "Chinesische Autohersteller setzen auf zentrale Sensorfusion: Statt jedes Radar- oder Kamerasignal einzeln auszuwerten, fließen Rohdaten in einen Zentralrechner. BYD (比亚迪) meldet 20 % niedrigere Latenz, 20 % höhere Sensorreichweite und zehnfach höhere Punktdichte."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: 20 % mehr Sensorreichweite durch neue Architektur

Bislang arbeiteten Fahrassistenzsysteme (ADAS) dezentral: Jeder Sensor – Radar, Lidar oder Kamera – wertete seine Daten selbst aus, wie ein eigener Mini-Computer. Der Empfänger erhielt lediglich eine gefilterte Ergebnisliste, etwa „50 Meter voraus Hindernis“. Dabei gingen wertvolle Rohinformationen verloren, etwa Objektgeschwindigkeiten oder Materialeigenschaften. Dieser Ansatz stößt bei höheren Automatisierungsstufen (L3/L4) an Grenzen.

## Zentralrechner statt Einzelsensor-Intelligenz

Der neue Trend in China heißt „zentrale Sensorfusion" (端到端传感器架构). Dabei senden die Sensoren ihre rohen, unverarbeiteten Signale über SerDes-Leitungen (z. B. GMSL) direkt an einen leistungsstarken ADAS-SoC. Erst dort läuft die gesamte Signalverarbeitung und Fusionslogik – auf Rohdatenebene, nicht auf abstrahierten Objektlisten.

Der Vorteil: So lassen sich die Stärken verschiedener Sensorarten kombinieren. Ein Beispiel: Spritzwasser verwirbelt Millimeterwellenradar, optische Sensoren sehen schlecht im Nebel. In einer zentralen Architektur fusioniert der Algorithmus die Durchdringungsfähigkeit des Radars mit den Bildinformationen der Kamera – 1+1 ergibt nicht nur 2, sondern 5.

## Algorithmen-Dominanz: Vom Zulieferer zum Hersteller

Bisher kontrollierten Tier-1-Zulieferer wie Bosch, Continental oder chinesische Firmen wie Hesai die Radarsignalverarbeitung. Die Know-how-geschützte Firmware blieb eine Blackbox für die Autobauer. Mit der zentralen Architektur übernimmt der OEM (oder dessen Softwarepartner) die Hoheit über die Rohdaten. Die Folge: Die Wertschöpfung wandert vom Zulieferer zum Hersteller.

Dafür braucht es allerdings leistungsfähige Chips. NXP bietet mit dem Radar Bridge einen speziellen Brücken-IC zwischen MMIC und SoC, integriert aber auch zunehmend RSP-IP (Radar Signal Processing) direkt in ADAS-SoCs. Auch Texas Instruments liefert mit seinen AWR-Radar-Chipsätzen RAW-Daten-Unterstützung – eine wichtige Voraussetzung für L3/L4-Systeme, die keine komprimierten Objektlisten, sondern rohe Abstand-Frequenz-Amplituden-Daten benötigen.

## Drei Sensortypen im Vergleich

**Radar:** Der Wandel ist am weitesten fortgeschritten. Auf dem chinesischen Markt setzt sich eine preiswerte 8T8R-Konfiguration (1 SoC + 2 MMIC) durch, in Europa sind 12T16R (1 SoC + 4 MMIC) üblich. Bis 2028 könnten beide Linien zu einem Standard verschmelzen. Die große Herausforderung bleibt die Algorithmus-Integration: Wer liefert die IP? Kann der SoC die spezielle Radar-Datenstruktur (3D/4D-Arrays statt Bildframes) effizient verarbeiten?

**Lidar:** Hier reduziert sich der Kostenblock durch die Verlagerung der FPGA-Signalverarbeitung in den Zentralrechner. Übrig bleiben nur Emitter, SPAD-Empfänger und TDC – die Hardwarekosten sinken drastisch. Aktuelle 192-Linien-Lidare mit 10 Hz Bildrate und 120° Sichtfeld erzeugen jedoch 3,6 Gbps Datenstrom – GMSL2 reicht mit 6 Gbps zwar knapp, doch die Datenstruktur (Slots statt Frames) fordert spezielle DSP-Optimierung.

**Ultraschall:** Die einfachste Sensorklasse. Im dezentralen Modus benötigt jeder Wandler eine separate SerDes-Leitung. Ein praktikabler Kompromiss ist die Mischform: Vordere und hintere Stoßfängergruppen bündeln ihre Daten lokal und senden sie aggregiert an den Zentralrechner. BYD (比亚迪) berichtet konkret von einer 20 % niedrigeren Latenz, 20 % höherer Sensorreichweite und zehnfach höherer Punktdichte – ein klares Bekenntnis zur zentralen Architektur.

*Hinweis: Sensorreichweite bezeichnet die maximale Detektionsdistanz der Sensoren, nicht die Fahrzeugreichweite.*

## Fazit

Die chinesische Automobilindustrie zerbricht die alten Datenkanäle: Statt gefilterter Blackbox-Ergebnisse fließen Rohsignale in den Zentralrechner. Nur mit diesen unverarbeiteten Daten entfalten Algorithmen ihr volles Potenzial. Sobald Kamera, Lidar und Radar ihre Rohdaten teilen, wird der Sprung von L2 zu L3 und darüber hinaus realistisch.

---

Die beschriebene Technologie ist eine branchenweite Entwicklung, nicht an ein einzelnes Modell gebunden. BYD (比亚迪) ist als Automobilhersteller auch in Deutschland aktiv und vertreibt hier mehrere vollelektrische Modelle. Es ist zu erwarten, dass die zentrale Sensorfusion in künftigen BYD-Modellen für den europäischen Markt zum Einsatz kommt.
