---
title: "BYD: Frühe Sensorfusion steigert Erkennungsreichweite um 20 %"
date: 2026-06-10T20:20:12.560Z
description: "BYD setzt auf eine neue Radar-Lidar-Architektur, die rohe Signale zentral fusioniert. Statt Blackbox-Sensoren gibt es echte Rohdaten – das bringt 20 % mehr Reichweite bei der Objekterkennung. Ein Technologie-Ausblick."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "TI"]
tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 5
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# BYD: Frühe Sensorfusion steigert Erkennungsreichweite um 20 %

BYD (比亚迪) verbaut in künftigen Fahrzeuggenerationen eine Early-Fusion-Architektur für Fahrassistenzsysteme. Statt jedes Sensor-Modul (Radar, Lidar, Kamera) seine Daten isoliert auswerten zu lassen – wie bisher üblich – werden die rohen, unverarbeiteten Signale direkt an eine zentrale Recheneinheit (SoC) geschickt. Laut BYD-internen, nicht öffentlich validierten Tests ergeben sich folgende Vorteile: Die Zeit bis zur Objekterkennung sinkt um 20 %, die maximale Erfassungsreichweite (also die Entfernung, in der ein Hindernis zuverlässig erkannt wird) steigt um 20 %, und die Punktdichte der Umgebungsdarstellung erhöht sich um 10 %. Der Clou: Der Algorithmus bekommt nicht länger eine „fertige Objektliste" von jedem Einzelsensor, sondern alle Rohdaten – und kann daraus eine wesentlich genauere Umgebungskarte fusionieren.

## Was ist die Early-Fusion-Architektur?

Bisher arbeiteten Radar-, Lidar- und Kameramodule als geschlossene „Blackboxen". Jeder Sensor führte eigene Auswertungen durch – etwa FFT (Fast Fourier Transformation) bei Radaren, Objekt-Tracking bei Kameras – und schickte nur ein stark komprimiertes Ergebnis an das Steuergerät. Problem: Widersprechen sich zwei Sensoren (etwa Radar sagt „kein Hindernis", Lidar sagt „Hindernis"), kann die spätere Sensorfusion die Informationen nicht mehr richtig auflösen.

Die Early-Fusion-Architektur sendet dagegen die unverarbeiteten Signale – das RAW-Radar-Spektrum, die Lidar-Punktwolke – über Highspeed-Verbindungen (GMSL/SerDes) direkt in einen zentralen ADAS-SoC (Advanced Driver Assistance System System-on-a-Chip). Erst dort werden alle Daten in einem gemeinsamen Koordinatensystem fusioniert. Der Algorithmus kann dann Stärken kombinieren: etwa die hohe Reichweite des Radars mit der Winkelgenauigkeit des Lidars. Statt „entweder-oder" entsteht eine konsistente, übergeordnete Umgebungskarte – im Idealfall mehr als die Summe der Einzelsensoren (1+1 kann 5 ergeben).

## Machtverschiebung: Die Kontrolle über die Algorithmen wandert

Mit diesem Schritt verlagert sich die Algorithmen-Hoheit von den Zulieferern (Tier-1 wie Bosch, Continental) zu den Autoherstellern oder Chip-Anbietern. Bislang hielten die Tier-1 das Know-how zur Signalverarbeitung unter Verschluss – sie lieferten „fertige" Sensormodule, deren interne Verarbeitung (FFT, CFAR, Objekt-Tracking) für den Hersteller eine Blackbox blieb.

Die Early-Fusion-Architektur öffnet diese Blackbox: Die Tier-1 liefern künftig nur noch die reine Hardware – etwa das MMIC (Monolitischer Mikrowellen-IC) und den ADC (Analog-Digital-Wandler) – während die gesamte Signalverarbeitung auf den zentralen SoC verlagert wird. Chiphersteller wie NXP bringen spezielle „Radar Bridge"-Chips auf den Markt, die das RAW-Signal von MMIC zu SerDes konvertieren. TI bietet mit seiner AWR-Serie ebenso RAW-Daten-Unterstützung. Die Algorithmen könnten dann direkt auf den SoC von NXP, TI oder anderen laufen.

Der Trend ist klar: Für L3/L4 autonomes Fahren reichen „komprimierte Objektlisten" nicht mehr aus. Die Systeme brauchen rohe Spektral- und Mikro-Doppler-Daten, um etwa zwischen Fußgängern, Fahrrädern oder reflektierenden Verkehrsschildern zu unterscheiden. Bisher war die Rechenleistung der SoCs zu gering, um 12+ Kanäle Radar-FFT und CFAR in Echtzeit zu bewältigen – heute ist das möglich.

## Drei Sensortypen – drei Wege zur Early Fusion

Die Umstellung betrifft alle Sensortypen unterschiedlich:

**4D-Radar (High-End)**  
Hier wird die Multi-Chip-Architektur bereits getestet. Zwei Wege zeichnen sich ab:  
- *China-Linie (Kostenfokus):* 1 SoC + 2 MMICs → 6 Kanäle (8T8R)  
- *Europa-Linie (Performance):* 1 SoC + 4 MMICs → 12–16 Kanäle (bis 16T16R; 24T24R in Planung).  
Bis 2028 werden sich die beiden Architekturen trennen – unterschiedliche Kostenmodelle und Anwendungsfälle.

**Lidar (teuer, aber präzise)**  
Die Verlagerung der Signalverarbeitung auf den SoC spart Kosten, weil lidar-interne FPGAs entfallen. Bleiben müssen nur Emitter, SPAD-Sensor und TDC-Zeitmessung. Allerdings ist die Datenrate immens: Ein 192-Linien-Lidar mit 10 Hz Frame-Rate und 0,1° Auflösung erzeugt pro Frame ca. 3,6 Gbps – plus Intensität, Distanz und Dopplerversatz. GMSL2 (6 Gbps) reicht gerade, aber die Verarbeitung auf dem SoC ist eine Herausforderung: Lidar-Daten sind als Slots organisiert (1200 Slots pro Frame), völlig anders als Kamerabilder. Standard-MIPI-Interfaces, für Kameras optimiert, müssen umkonfiguriert werden. Effiziente DSP-Nutzung ist noch offen.

**Kamera (simpler, aber nicht trivial)**  
Kamerabasierte Verarbeitung ist am einfachsten – keine komplexe Signalvorverarbeitung, nur Laufzeitberechnung und Clustering. Bei Early Fusion wandern die Rohdaten aus der Kamera zum zentralen SoC. Die Zeitersparnis beträgt laut BYD 20 %, die Punktdichte steigt um 10 %. Doch auch hier gibt es praktische Grenzen: In einem typischen Fahrzeug mit 12 Kameras müssten 12 SerDes-Leitungen parallel laufen – teuer und verkabelungsintensiv. BYD wählt daher einen Mittelweg: „regionale Vorverarbeitung" (Stoßstange vorne, Dach, etc.) und anschließende Fusion der aggregierten Daten. Das bringt die Vorteile der Early Fusion ohne das Spinnennetz an Kabeln.

## Fazit: Technologie-Trend ohne konkrete Europa-Ankündigung

BYD hat noch kein konkretes Modell für den europäischen Markt mit dieser Early-Fusion-Architektur genannt. Die chinesische Industrie treibt die Entwicklung massiv voran: Weg vom Blackbox-Sensor hin zu einer transparenten Datenpipeline, in der Algorithmen auf Rohsignalen aufsetzen können. Für europäische Hersteller und Zulieferer bedeutet das eine Herausforderung – die Kontrolle über die Signalverarbeitung wandert von den Tier-1 zu den Autoherstellern oder Chip-Anbietern. BYD selbst gibt an, erste Ergebnisse aus internen Tests zu haben. Wann die Technik in europäischen Modellen ankommt – ab 2026 ist denkbar – bleibt abzuwarten. Fest steht: Die „Early Fusion" ist ein entscheidender Schritt für höhere Autonomiestufen (L2+ bis L3).

---

BYD bietet in Deutschland aktuell Modelle wie den Atto 3, Han, Tang und Dolphin an – jedoch ohne die hier beschriebene Early-Fusion-Architektur. Eine konkrete Ankündigung für Europa liegt bislang nicht vor. Der Artikel ist als Technologie-Ausblick zu verstehen.
