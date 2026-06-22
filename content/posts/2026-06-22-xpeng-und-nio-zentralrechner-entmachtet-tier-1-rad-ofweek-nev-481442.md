---
title: "Xpeng und NIO: Zentralrechner entmachtet Tier-1-Radar"
date: 2026-06-22T20:37:53.481Z
description: "Xpeng und NIO treiben den Wandel zur Zentralarchitektur voran: Radar-Rohdaten fließen direkt ins zentrale SoC. Algorithmen-Kontrolle wechselt von Zulieferern zu Autoherstellern – das senkt Latenz um 20 % und verbessert die Sensorfusion entscheidend."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# Xpeng und NIO: Zentralrechner entmachtet Tier-1-Radar

## Teil 1: Was die Zentralarchitektur für Sensoren bedeutet

In chinesischen E-Autos wie dem **Xpeng G9** (小鹏) und **NIO ET7** (蔚来) vollzieht sich ein grundlegender Wandel der Sensorarchitektur. Statt jedes Radar, jeden Lidar und jede Kamera als eigenständige „Mini-Computer" zu behandeln, die Ziele lokal detektieren und nur gefilterte Objektlisten senden, sammelt ein zentrales System-on-Chip (SoC) die rohen, unverarbeiteten Signale aller Sensoren über SerDes-Leitungen ein.

Der Vorteil: Bisher meldete ein Radarsensor „50 m voraus Hindernis", ein anderer „30 m rechts Fahrzeug“ – zwei isolierte Aussagen, die in der ECU nur noch zusammengeklebt wurden. Mit der Zentralarchitektur erhält die KI die ungefilterten Daten: die FFT-Frequenzspektren des Millimeterwellenradars, die Punktwolken des Lidars, die Pixel des Kamerasensors. „1+1 kann plötzlich 5 ergeben", beschreibt ein Ingenieur aus Shenzhen den Effekt. Beispiel: Regen oder Gischt stört das Lidar-Signal, während das Millimeterwellenradar unempfindlich ist. In der alten Architektur entsteht ein Widerspruch („Kein Hindernis" vs. „Hindernis"). Fusioniert man die Rohdaten, kann das System die stärkere Radar-Information nutzen und den Fehler korrigieren.

## Teil 2: Algorithmus-Kontrolle wandert vom Tier-1 zum OEM

Die Signalverarbeitung von Radar war jahrzehntelang eine Blackbox der Tier-1-Zulieferer: Ob FFT-Zielerkennung, Doppler-Geschwindigkeit oder CFAR-Schwellwert – all das lag in der Firmware des Radarsensors begraben. Der Autobauer bekam nur die fertige Objektliste. Mit der Zentralarchitektur ändert sich das radikal: Der Tier-1 liefert nur noch die „nackte Hardware" – MMIC (Hochfrequenz-Sende-/Empfangselement), ADC (Analog-Digital-Wandler) und eine einfache 1D-FFT. Die gesamte Intelligenz wandert ins fahrzeugeigene SoC.

Ermöglicht wird dies durch neue Chip-Designs. **NXP** bringt spezielle Radar-Bridge-Chips heraus, die zwischen MMIC und SerDes vermitteln, und integriert zunehmend Radar-Signalverarbeitungs-IP (RSP IP) direkt in seine ADAS-SoCs. Auch **Texas Instruments** folgt diesem Weg: Seine AWR-Serie unterstützt bereits RAW-Modi. Für L3/L4-Automatisierung reicht die alte Objektliste nicht mehr – man braucht die rohe Range-Doppler-Karte, um stehende Hindernisse, spielende Kinder oder umgefallene Bäume zu erkennen. Früher wäre das SoC mit 12 Radar-FFTs und CFAR-Berechnungen überlastet gewesen – heute ist die Rechenleistung dafür ausreichend.

Die Folge: Die Algorithmus-Hoheit verlässt die Tier-1-Blackbox. Künftig werden Lidar und Radar dauerhaft koexistieren; entscheidend ist, wer die Algorithmen kontrolliert – der Autobauer (eigener IP) oder der Zulieferer.

## Teil 3: Drei Sensortypen – drei Strategien

**Millimeterwellenradar**  
Der 4D-Radar-Markt teilt sich in zwei Pfade: Chinas Kostenpfad setzt auf „1 SoC + 2 MMIC" für 6×8 Kanäle (6 Sendeeinheiten, 8 Empfangseinheiten), was 8T8R entspricht. Europas Performance-Pfad nutzt „1 SoC + 4 MMIC" für 12×16 Kanäle (16T16R) und plant sogar 24T24R. Bis 2028 werden beide Pfade nebeneinander bestehen – mit unterschiedlichen Kostenmodellen und Anwendungsszenarien. Die größte Herausforderung ist nicht die Hardware, sondern die Algorithmus-Integration: Wer liefert die Radar-IP? Wie wird sie auf dem SoC portiert? Und können die DSP-Kerne des SoC die speziellen Organisationsformen der Radardaten (2D-Matrizen statt Kameraframes) effizient verarbeiten?

**Lidar**  
In der Zentralarchitektur entfällt die teure FPGA-basierte Signalverarbeitung im Lidar. Die Kosten sinken, da nur noch Sender (VCSEL), SPAD-Empfänger und TDC-Zeitmessung nötig sind. Allerdings explodiert die Datenmenge: Eine 192-Linien-Lidar mit 10 Hz, 120° Sichtfeld und 0,1° Auflösung erzeugt 3,6 Gbit/s pro Sekunde – das entspricht fast zwei unkomprimierten HDMI-Streams. Die Datenstruktur (1200 Slots pro Frame mit Trägerinformationen) ist völlig anders als Kamerabilder; DSPs und CPU/GPU müssen effizient umsteigen.

**Kameras**  
Die Kamera-Algorithmik ist einfacher – sie benötigt keine aufwendige Signalverarbeitung, sondern nur Laufzeitmessung. Unter der Zentralarchitektur kann die Rechenlast im Sensor um etwa 20 % gesenkt werden, während die effektive Reichweite durch feinere Matching-Algorithmen um 10 % steigt. Ein Nachteil: Jede von (zum Beispiel) 12 Kameras benötigt eine eigene SerDes-Leitung – das verteuert die Verkabelung. Deshalb setzen Hersteller wie BYD auf eine „regionale Vorsammlung": Sechs Kameras bündeln ihre Daten in einer lokalen Einheit, bevor sie an das zentrale SoC gehen. BYD gibt an, dass so die Latenz um 20 % sinkt, die Erkennungsreichweite um 20 % steigt und die Rohdaten vollständig erhalten bleiben – ein Hybridweg zwischen lokalem und vollzentralem Ansatz.

**Fazit**  
Die chinesische E-Auto-Industrie treibt den Umbau der Sensorarchitektur voran: Weg von fragmentierten Blackboxen, hin zu einer zentralen Recheneinheit, die alle Rohsignale vereint. Dadurch kann die Algorithmus-Qualität sprunghaft steigen – und damit die Basis für echte L3-Systeme gelegt werden.

---

Die beschriebene vollständige Rohdaten-Zentralarchitektur ist in keinem in Deutschland erhältlichen chinesischen Serienmodell aktuell realisiert. Xpeng und NIO nutzen zwar bereits zentrale Rechnerplattformen, aber die hier skizzierte Stufe (alle Sensoren liefern unverarbeitete Rohdaten direkt an ein SoC) befindet sich noch in der Prototypenphase. Marktstart für erste Modelle mit dieser Architektur wird frühestens 2025/2026 in China und danach schrittweise in Europa erwartet.
