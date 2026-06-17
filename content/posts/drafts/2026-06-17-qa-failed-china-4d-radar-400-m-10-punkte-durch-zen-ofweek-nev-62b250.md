---
title: "[QA FAILED] China: 4D-Radar 400 m, 10× Punkte durch Zentralrechner"
date: 2026-06-17T20:05:10.487Z
description: "Chinesische Hersteller ersetzen verteilte Sensorarchitekturen durch zentrale Recheneinheiten. Radar, Lidar und Kamera liefern Rohdaten direkt an den Zentralrechner – das vervielfacht die Punktwolke und verbessert die Objekterkennung."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# [QA FAILED] China: 4D-Radar 400 m, 10× Punkte durch Zentralrechner

Die chinesische Automobilindustrie vollzieht einen fundamentalen Wandel bei der Architektur des assistierten und autonomen Fahrens. Statt jedes Sensorsignal dezentral zu verarbeiten, setzen immer mehr Hersteller auf eine zentrale Rechenplattform: Alle Sensoren – Radar, Lidar, Kamera – liefern ihre Rohdaten über Hochgeschwindigkeits‑Links (SerDes) direkt an einen leistungsstarken ADAS‑SoC (System‑on‑a‑Chip). Dort werden die Signale erstmals fusioniert, bevor interpretiert wird. Das verschafft Algorithmen Zugang zu vollständigen Rohinformationen.

## Vom „Zielbericht“ zum „Rohsignal“

Im traditionellen, verteilten Ansatz verarbeitet jeder Sensor seine Daten selbst. Ein Radarsensor führt eigene FFT‑Berechnungen durch, filtert Störungen und gibt am Ende nur eine Liste erfasster Objekte an das Steuergerät weiter – inklusive Abstand und Geschwindigkeit. Diese „Zielberichte“ enthalten keine Informationen über die ursprüngliche Signalform. Kommt es zu Konflikten zwischen Sensoren – etwa wenn das Millimeterwellenradar kein Hindernis sieht, das Lidar aber doch –, erhält das Steuergerät widersprüchliche Ergebnisse. Eine tiefe Fusion ist nicht möglich.

Die zentrale Architektur ändert das grundlegend. Statt bereits gefilterter Listen fließen rohe I/Q‑Daten (bei Radar) oder Punktwolken (bei Lidar) auf den Zentralrechner. Dieser kann Radar‑ und Lidarsignale komplementär kombinieren: Das Radar durchdringt Regen oder Nebel, während das Lidar eine hochauflösende Punktwolke liefert. Die Fusion wird zu einem echten Mehrwert – 1+1 kann so 5 ergeben. Erste Versprechen: bis zu 20 % niedrigere Latenz, 20 % größere Reichweite und 10× mehr Punkte in der detektierten Szene.

## Hardware‑Grundlage: 4D‑Radar im Zentrum

Schlüssel für die neuen Fähigkeiten ist der 4D‑Millimeterwellenradar. In China verfolgen die Hersteller überwiegend einen kosteneffizienten Ansatz: ein ADAS‑SoC kombiniert mit zwei MMIC‑Chips (Monolithic Microwave Integrated Circuit) ergibt eine 8T8R‑Konfiguration (acht Sende‑, acht Empfangskanäle). Europäische Anbieter setzen auf 16T16R‑ oder sogar 24T24R‑Systeme mit vier MMICs. Bis 2028 werden sich die beiden Linien je nach Kosten‑ und Anforderungsprofil weiter ausdifferenzieren.

Herausforderung: Die Datenstruktur eines Radarsensors unterscheidet sich fundamental von der eines Kamerabilds. Radar liefert keine Bildframes, sondern Slots mit Doppler‑ und Entfernungsinformationen. Standard‑MIPI‑Schnittstellen sind dafür nicht optimiert. NXP hat daher spezielle Radar‑Bridge‑Chips entwickelt (Radar Bridge), die zwischen MMIC und SoC vermitteln. Auch Texas Instruments bietet mit seiner AWR‑Serie Chips an, die Rohdaten direkt ausgeben können. Das macht den Weg für eine durchgehende Rohdatenverarbeitung frei.

## Laser‑ und Ultraschall: gleicher Trend, andere Hürden

Auch beim Lidar geht der Trend zum Zentralrechner. Bisher verarbeitete ein separater FPGA im Lidar‑Sensor die Punktwolke. Kosten der Signalverarbeitung und Steuerlogik können auf den Haupt‑SoC verlagert werden, sodass der Lidar nur noch die reine Optik (Emitter, SPAD‑Sensor, TDC) enthält. Noch ist die Datenrate hoch: Ein 192‑Zeilen‑Lidar mit 10 Hz Bildrate liefert 3,6 Gbit/s – das entspricht einem unkomprimierten Video. Allerdings ist die Datenstruktur (Slots statt Frames) wieder anders, sodass der DSP im SoC speziell dafür ausgelegt sein muss.

Beim Ultraschallsensor ist die Umstellung am einfachsten: Die Laufzeitmessung erfordert wenig Signalverarbeitung. Im neuen Modell liefert der Sensor lediglich die gefilterte Rohhülle an den Zentralrechner, der dort eine feinere Korrelationsfilterung zur Objektunterscheidung (z. B. Bordsteinkante vs. Stein) durchführt. Gleichzeitig steigen die Kosten für die Verkabelung – bis zu 12 Sensoren mit je einem SerDes‑Link. Ein Kompromiss ist die „Cluster+Center“‑Architektur: Jeweils sechs Sensoren bündeln ihre Daten auf einer lokalen Zwischenstufe, bevor sie an das Zentrum gehen.

===
*Zusammenfassung: Die chinesische Autoindustrie bricht die Blackbox der Sensoren auf. Rohdaten statt Zielberichte, Zentralrechner statt verteilte Intelligenz – das gibt den Herstellern die volle Kontrolle über die Algorithmen und schafft die Grundlage für die nächste Stufe des autonomen Fahrens (L3 und höher).*

---

Diese technologische Entwicklung stammt aus China und hat derzeit keinen direkten Bezug zu in Europa erhältlichen Fahrzeugen. Sie zeigt, wie chinesische Hersteller die Kontrolle über Sensoralgorithmen übernehmen – ein Trend, der mittelfristig auch europäische Modelle beeinflussen könnte.
