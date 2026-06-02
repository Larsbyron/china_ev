---
title: "[QA FAILED] Autonomes Fahren: China setzt auf zentrale Rohdatenfusion"
date: 2026-06-02T20:38:40.714Z
description: "Chinesische Autobauer und Chip-Hersteller treiben eine neue Sensorarchitektur voran: Statt lokaler Vorverarbeitung fließen Rohdaten aller Sensoren in eine zentrale Recheneinheit. Das verspricht bessere Sensorfusion und entmachtet traditionelle Tier-1-Zulieferer."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Autonomes Fahren: China setzt auf zentrale Rohdatenfusion

Die chinesische Automobilindustrie erlebt einen Paradigmenwechsel in der Entwicklung autonomer Fahrfunktionen. Bisherige Systeme arbeiten mit dezentralen Sensormodulen: Jeder Radar- oder Lidar-Sensor führt eine eigene Signalverarbeitung durch und sendet nur gefilterte Objektlisten an das Steuergerät. Die neue Architektur – oft als „domänenübergreifende Sensorfusion“ bezeichnet – kehrt dieses Prinzip um: Sensoren erfassen nur noch das Rohsignal (z. B. FFT-Spektrum, RAW-Daten) und übertragen es über SerDes-Verbindungen (Serializer/Deserializer) an eine zentrale SoC-Plattform (System-on-Chip). Erst dort werden alle Daten fusioniert und durch leistungsfähige KI-Algorithmen ausgewertet.

Der Vorteil liegt auf der Hand: Während dezentrale Systeme bei Widersprüchen (z. B. Radar meldet Hindernis, Kamera sieht freie Fahrt) nur auf vorgefilterte Ergebnisse angewiesen sind, kann die zentrale Architektur die Rohsignale pixelgenau kombinieren und dadurch deutlich präzisere Umgebungsmodelle erstellen. Branchenkenner sprechen von einem möglichen Erkennungsvorteil von 30 bis 50 Prozent, insbesondere bei schwierigen Wetterbedingungen oder komplexen Verkehrssituationen.

## Warum erst jetzt? – Der Kampf um die Algorithmen-Hoheit

Lange Zeit blockten große Tier-1-Zulieferer (z. B. Bosch, Continental) den Zugang zu ihren Radar-Signalverarbeitungsalgorithmen. Die Software war tief in der Firmware der Sensormodule vergraben – eine Blackbox für die Autobauer. Erst mit dem Aufkommen leistungsstarker ADAS-SoC (wie von NXP, Texas Instruments oder chinesischen Herstellern wie Horizon Robotics und SemiDrive) wurde es möglich, die Rohdaten direkt auf der zentralen Plattform zu verarbeiten. NXP bietet beispielsweise spezielle Radar-Bridge-Chips und integriert Radar-Signalprozessor-IP (RSP) direkt in seine SoCs. Texas Instruments liefert mit der AWR-Serie MMICs (Monolithic Microwave Integrated Circuits), die bereits RAW-Daten unterstützen.

## Technische Herausforderungen: Datenraten und Schnittstellen

Die Umstellung bringt enorme Datenmengen mit sich: Ein 4D-Millimeterwellenradar mit 8T8R (8 Sende-, 8 Empfangskanäle) erzeugt bereits Datenraten von mehreren Gbit/s. Ein 192-Linien-Lidar mit 120° Sichtfeld und 0,1° Auflösung benötigt je nach Konfiguration bis zu 3,6 Gbit/s pro Sekunde – vergleichbar mit einem unkomprimierten 4K-Videostream. Die vorhandenen GMSL2-Schnittstellen (6 Gbit/s) sind hierfür gerade ausreichend. Zudem unterscheidet sich die Datenstruktur grundlegend von Kameras: Radardaten sind nach Slots organisiert (z. B. 1200 Slots pro Frame mit Abstand, Geschwindigkeit, Energie), während Kameras Framebased arbeiten. Effiziente DSPs oder spezielle MIPI-Controller für Radar sind noch selten.

## Welche Sensorik profitiert am meisten?

- **Millimeterwellenradar**: Die zentrale Architektur ermöglicht den Einsatz von „Cascading“ – mehrere MMICs werden verbunden, um virtuelle Kanäle (z. B. 16T16R oder 24T24R) zu bilden. Chinesische Anbieter setzen auf kosteneffiziente 8T8R-Lösungen mit einem SoC + zwei MMICs, während europäische Hersteller oft auf 16T16R oder höher setzen. Der Wettbewerb um die Radar-IP wird sich bis 2028 entscheiden.

- **Lidar**: Lidar-Sensoren, die traditionell eigene FPGA-basierte Signalprozessoren mit sich führen, können diese Hardware entfallen lassen. Die reine Rohdatenausgabe (Laufzeit, Reflexionsintensität) reduziert Kosten und erlaubt flexiblere Algorithmen. Allerdings steigt die Rechenlast im Zentral-ECU um rund 20 Prozent – bei gleichzeitig gesteigerter Erkennungsreichweite von bis zu 400 Metern.

- **Ultraschall**: Auch Ultraschallsensoren profitieren: Statt nur zu detektieren, liefern sie nun gesamte Echoprofile, die eine feinere Objektunterscheidung (z. B. Bordstein versus Straßenschild) ermöglichen. Die Datenmenge ist jedoch moderat.

## Konsequenzen für die Industrie

Der Trend zur zentralen Sensorfusion verschiebt die Wertschöpfung: Während Tier-1-Zulieferer ihr traditionelles Geschäft mit Firmware-Lizenzen verlieren, gewinnen Chip-Entwickler und Autobauer an Einfluss. Chinesische Hersteller wie BYD (比亚迪), NIO (蔚来) oder Xpeng (小鹏) investieren massiv in eigene ADAS-SoC-Entwicklungen, um die Datenhoheit zu sichern. Gleichzeitig steigt der Druck auf europäische Zulieferer, ihre Algorithmen zu öffnen – oder von neuen Chip-Partnern wie NXP und TI überrollt zu werden. Für den deutschen Markt bedeutet dies: In Zukunft werden Fahrzeuge aus China mit hochintegrierten Architekturen antreten, die eine ähnliche Sensorperformanz wie Tesla FSD bieten – aber zu deutlich niedrigeren Kosten.

---

Diese Branchenentwicklung beschreibt einen globalen Trend in der Automobilindustrie und bezieht sich nicht auf ein bestimmtes Fahrzeugmodell. Die Technologie wird voraussichtlich ab 2026 in europäischen Modellen chinesischer Hersteller Einzug halten.
