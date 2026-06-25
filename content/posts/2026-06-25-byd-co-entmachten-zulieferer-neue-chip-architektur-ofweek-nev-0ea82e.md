---
title: "BYD & Co. entmachten Zulieferer: neue Chip-Architektur ab 2026"
date: 2026-06-25T06:02:38.877Z
description: "Chinesische Hersteller wie BYD und NIO setzen ab 2026 auf zentrale Sensorfusion: Rohdaten von Radar, Lidar und Ultraschall landen direkt im ADAS-Chip. Deutsche OEMs wie BMW ziehen nach."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD & Co. entmachten Zulieferer: neue Chip-Architektur ab 2026

Ein grundlegender Wandel in der chinesischen Automobilindustrie zeichnet sich ab: Immer mehr Hersteller setzen auf eine zentrale Sensorfusionsarchitektur. Bei diesem Ansatz werden die rohen, unverarbeiteten Signale von Millimeterwellen-Radar, Lidar und Ultraschallsensoren nicht mehr dezentral im Sensor selbst vorverarbeitet, sondern direkt an einen leistungsstarken ADAS-SoC (System-on-a-Chip) übertragen. Der SoC übernimmt die gesamte Fusion und Objekterkennung – inklusive Tiefen- und Geschwindigkeitsschätzung. BYD (比亚迪) gab bekannt, dass der neue BYD Han ab Modelljahr 2026 diese Architektur nutzt, wodurch die Zulieferkosten pro Fahrzeug um rund 200 Euro sinken sollen. Auch NIO (蔚来) plant für den ET7 eine entsprechende Umstellung.

Bisher arbeiteten Sensoren als Blackbox: Jeder Millimeterwellen-Radar führte eine eigene Fourier-Transformation (FFT) und Zielerkennung durch und sendete lediglich eine abstrakte Objektliste („vorne 50 Meter Hindernis“) an das Steuergerät. Diese Teilinformationen sind verlustbehaftet – die ursprüngliche Messgenauigkeit blieb im Sensor verborgen. Bei einer zentralen Architektur hingegen landen alle Rohdaten – etwa das FFT-Spektrum, die Lidar-Punktwolke oder die Ultraschall-Echozeit – ohne Redundanzverlust im SoC. Das ermöglicht eine deutlich bessere Fusion: Wo das Radar durch Wasser auf der Straße kein klares Ziel sieht, kann das Lidar mit seiner Durchdringungsfähigkeit helfen. Die Algorithmen fusionieren die Daten nicht nach dem Prinzip „wer hat Recht?“, sondern kombinieren die Informationen zu einem gemeinsamen Weltbild.

## Warum jetzt der Umbruch? – Algorithmen-Kontrolle wechselt vom Zulieferer zum OEM
Der Treiber dieser Entwicklung ist die Machtverschiebung bei der Algorithmen-Kontrolle. Bisher hielten Tier-1-Zulieferer wie Bosch oder Continental das Kern-Know-how zur Radarsignalverarbeitung in ihren Händen. Die chinesischen Hersteller kauften fertige Komponenten, ohne die Algorithmen verändern zu können. Mit der Zentralisierung wandert die Signalverarbeitung in den SoC der OEMs. NXP hat mit dem Radar Bridge Chip einen speziellen Baustein zwischen MMIC und SerDes eingeführt, während Texas Instruments bei seinen AWR-Serien den RAW-Daten-Modus direkt unterstützt. Auch SoC-Anbieter wie Qualcomm integrieren Radar-Signalverarbeitungs-IP in ihre ADAS-Plattformen. Dadurch können Hersteller wie BYD, NIO und XPeng (小鹏) die Algorithmen selbst optimieren oder anpassen – die Abhängigkeit von Tier-1 sinkt.

## Status der Sensortechnologien – welche Architekturen setzen sich durch?
Die Umstellung betrifft alle Sensorarten unterschiedlich. Hier eine Übersicht:

- **4D-Millimeterwellen-Radar** (4D-Radar erfasst zusätzlich zu Entfernung, Geschwindigkeit und Winkel auch die Elevation): Die Entwicklung ist am weitesten. Chinesische Hersteller setzen auf eine kostengünstige „1 SoC + 2 MMIC“-Architektur mit 8T8R (8 Sende-, 8 Empfangskanäle), um Reichweite bis 400 Meter zu erreichen. Europäische Zulieferer planen dagegen „1 SoC + 4 MMIC“ mit 16T16R oder sogar 24T24R bis 2028. Die Schlüsselfrage ist, wer die Radar-IP beherrscht – OEMs oder Tier-1. Zudem müssen SoCs die MIPI-Schnittstelle für Radar-Daten effizient unterstützen, was derzeit eine Herausforderung darstellt.

- **Lidar** (optischer Sensor zur Entfernungsmessung mittels Laserpulsen): Hier bringt die Zentralisierung vor allem Kostenvorteile. Bisher benötigte jeder Lidar-Sensor einen eigenen FPGA zur Signalverarbeitung. In der zentralen Architektur reduziert sich der Sensor auf Sender, SPAD-Empfänger und TDC-Zeitmesser – die aufwendige Signalverarbeitung erfolgt im SoC. Hochleistungs-Lidar mit 192 Zeilen liefert bereits 3,6 Gbps Rohdaten. Das erfordert leistungsfähige GMSL-SerDes (bis 6 Gbps) und spezielle Datenstrukturen, die anders als Kamerabilder sind (über 1200 Slots pro Frame statt Pixel-Array).

- **Ultraschallsensoren** (Nahbereichserfassung, typisch für Einparkhilfen): Die Umstellung ist einfach, da bereits Zeit-Messdaten vorliegen. Durch zentrale Verarbeitung kann die Taktfrequenz um bis zu 20 % gesenkt werden, während die laterale Auflösung steigt (10 Punkte statt 8 pro Sensor). BYD hat bei seinem Fahrerassistenzsystem eine Hybridlösung entwickelt: sechs zentrale Sensoren, deren Daten gebündelt übertragen werden. Das spart Verkabelung und erhält die Vorteile der Zentralisierung.

## Fazit: Die Macht verschiebt sich – chinesische OEMs übernehmen die Kontrolle
Chinesische Automobilhersteller bauen eine komplett durchsichtige Datenpipeline auf – vom rohen Sensorsignal bis zur Entscheidung im SoC, ohne Blackbox. Das ermöglicht tiefere Algorithmen-Optimierung und schnellere Iterationen für die nächste Stufe des automatisierten Fahrens (ab L2+ und L3). Während BYD, NIO und XPeng ab 2026 erste Serienmodelle mit dieser Architektur ausliefern, planen auch deutsche OEMs wie BMW ähnliche Ansätze für die Neue Klasse ab 2025. Der Wettlauf um die Kontrolle über die Fahrintelligenz hat gerade erst begonnen.

---

Die Technologie wird zunächst in China ab 2026 eingeführt. Deutsche Hersteller wie BMW arbeiten an parallelen Architekturen für die Neue Klasse ab 2025. Ein direkter Export dieser Systeme nach Deutschland ist nicht vor 2027 zu erwarten, aber die Entwicklung beeinflusst die globale Zuliefererstruktur.
