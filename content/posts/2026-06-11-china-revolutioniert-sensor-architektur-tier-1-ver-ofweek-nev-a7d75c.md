---
title: "China revolutioniert Sensor-Architektur: Tier-1 verlieren Macht"
date: 2026-06-11T20:13:22.721Z
description: "Statt jedes Sensor-Modul mit eigener Intelligenz auszustatten, verlagern chinesische Hersteller die Rohdaten-Verarbeitung auf zentrale SoCs. Das entmachtet Zulieferer wie Bosch."
source: "OFweek NEV"

category: "news"

brands: ["(= leer =)"]
tags: ["Hybrid", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# China revolutioniert Sensor-Architektur: Tier-1 verlieren Macht

Bisher funktioniert ein modernes Fahrassistenzsystem so: Jeder Sensor – Millimeterwellen-Radar, Lidar oder Kamera – verarbeitet seine Daten selbst und schickt nur fertige „Detektionen" (z. B. „Objekt 50 m voraus") ans Steuergerät. Der Nachteil: Informationen gehen verloren, widersprüchliche Signale (z. B. Radar sagt „Hindernis", Kamera sagt „frei") müssen mühsam fusioniert werden. Die Entscheidungsmacht liegt beim Zulieferer, der die Algorithmen in die Sensorhardware einbettet – ein „Blackbox"-System.

## Rohdaten statt Detektionen

Eine neue, „dezentrale" Architektur kehrt das Prinzip um: Sensoren liefern nur noch rohe Messdaten – etwa das unverarbeitete FFT-Spektrum eines Radars oder die unkorrigierte Punktwolke eines Lidars. Diese Daten fließen über Hochgeschwindigkeits-SerDes-Leitungen (z. B. GMSL) direkt in einen zentralen ADAS-SoC (System-on-Chip). Dort laufen alle Rohdaten zusammen, die Algorithmen des Autoherstellers können sie erstmals echt fusionieren – 1+1 ergibt mehr als 2. Ein Beispiel: Regentropfen vernebeln das Kamerasignal, Millimeterwellen-Radar durchdringt Regen aber problemlos. In der alten Architektur käme ein Widerspruch: „Kameras sehen nichts, Radar schon". Im neuen System kombiniert ein zentraler Algorithmus die Stärken beider Sensoren und erzeugt ein einheitliches, robusteres Umfeldmodell.

## Warum jetzt? – Die Machtverschiebung

Jahrzehntelang hielten Tier-1 wie Bosch, Continental oder Valeo das Know-how der Radarsignalverarbeitung in Händen. Algorithmen zur Zielerkennung, Doppler-Auswertung oder Falschalarmunterdrückung waren fest verdrahtet in den Radar-ICs. Chinesische Hersteller – angeführt von Marken wie BYD, NIO, XPeng – drängen nun darauf, diese Algorithmen auf ihre eigenen, leistungsstarken SoCs zu holen. Das erfordert neue Chips: NXP bietet mit dem Radar Bridge einen speziellen Bridge-Chip zwischen MMIC und SerDes; TI liefert AWR-Serien, die Rohdaten-Ausgabe unterstützen; und immer mehr ADAS-SoCs integrieren eigene Radar-Signal-Prozessor-IP von NXP oder ARM. Die Folge: Der Autohersteller übernimmt die Kontrolle über die Sensorfusion und kann seine KI-Modelle direkt auf die Rohdaten ansetzen – für Stufe 3/4 autonomes Fahren unverzichtbar.

## Die drei Sensor-Roadmaps

- **Millimeterwellen-Radar (4D-Radar):** Zwei Lager: „China-Way" mit 8T8R (1 SoC + 2 MMICs) für niedrige Kosten; „Europe-Way" mit 16T16R bis 24T24R (1 SoC + 4 MMICs) für höhere Auflösung. Bis 2028 werden sich Wege trennen.

- **Lidar:** Liefert heute schon bis zu 3,6 Gbps pro Gerät (192-Linien, 10 Hz). Die Daten sind keine Bilder, sondern Puls-Slots – das zwingt SoC-Designer zu speziellen DSP-Pipelines, da die MIPI-Schnittstelle und GPU-Architektur für Kameras optimiert sind.

- **Ultraschall:** Einfachste Sensorik, aber in der dezentralen Architektur steigt der Rechenaufwand durch hochauflösende Matched-Filter. Ein Zwölf-Sensor-Set erzeugt so viele SerDes-Leitungen, dass praktisch eine Hybridlösung aus lokaler Vorfilterung und zentraler Fusion nötig wird.

## Fazit

Die Dezentralisierung der Sensor-Architektur ist eine der tiefgreifendsten Veränderungen der chinesischen Automobilindustrie. Sie entzieht den etablierten Tier-1-Lieferanten die Kontrolle über die Algorithmen und gibt sie an die Autohersteller weiter. Das kann die Innovationsgeschwindigkeit chinesischer EVs im autonomen Fahren massiv beschleunigen – und stellt deutsche Zulieferer vor die Wahl, ihre Blackbox zu öffnen oder ins Abseits zu geraten.

*Hinweis: Preise beziehen sich auf den chinesischen Markt und können in Europa abweichen.*

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
