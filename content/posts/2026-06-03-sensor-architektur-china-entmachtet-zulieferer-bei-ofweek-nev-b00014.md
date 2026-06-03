---
title: "Sensor-Architektur: China entmachtet Zulieferer bei Algorithmen"
date: 2026-06-03T14:24:17.829Z
description: "Chinesische Autoindustrie treibt domänenzentrale Sensorarchitektur voran: Rohdaten statt gefilterter Reports. Das verlagert die Algorithmus-Hoheit von Tier-1-Zulieferern zu Fahrzeugherstellern und Halbleitern."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Sensor-Architektur: China entmachtet Zulieferer bei Algorithmen

Die chinesische Automobilindustrie vollzieht einen grundlegenden Wandel in der Architektur von Fahrerassistenzsystemen (ADAS). Statt wie bisher jeden Radar- oder Lidarsensor mit eigener Signalverarbeitung auszustatten, setzen immer mehr Hersteller auf eine **domänenzentrale Architektur**. Dabei werden die Rohdaten aller Sensoren – ohne Vorverarbeitung – direkt an eine zentrale Recheneinheit (SoC) übermittelt. Das verschiebt die **Kontrolle über Algorithmen** von klassischen Tier-1-Zulieferern hin zu Fahrzeugentwicklern und Chipdesignern.

## Was ist eine domänenzentrale Sensorarchitektur?

Bisher arbeitete jeder Sensor weitgehend autark: Ein Millimeterwellenradar führte an Bord eine schnelle Fourier-Transformation (FFT), eine Zielerkennung und eine Geschwindigkeitsmessung durch. An das Steuergerät schickte er nur noch eine kondensierte Liste – etwa „ein Hindernis auf 50 Metern, eines auf 30 Metern“. Diese **gefilterte Meldung** verlor bereits Informationen, die für eine präzise Sensorfusion essenziell sind.

Bei der neuen Architektur liefern die Sensoren dagegen die **rohen Messdaten** – zum Beispiel das FFT-Spektrum, die Amplitudenverteilung oder die gesamte Punktwolke eines Lidars. Erst die zentrale Recheneinheit, meist ein leistungsstarker ADAS-SoC, übernimmt sämtliche Algorithmen zur Sensorfusion. Das ermöglicht eine **echte Verschmelzung** unterschiedlicher Sensorarten: Wo ein Millimeterwellenradar nur „Reflexion von Wasser“ meldet und eine Kamera kein klares Objekt erkennt, kann der zentrale Algorithmus aus beiden Rohdaten ein korrektes Umgebungsbild errechnen. Statt „wer hat Recht bekommt Vorrang“ gilt das Prinzip „gemeinsam stärker“. Diese Architektur kann aus 1+1 nicht nur 2, sondern bis zu 5 machen.

## Warum jetzt? – Algorithmus-Zentrale entmachtet Tier-1

Der entscheidende Treiber ist der Fortschritt bei Halbleitern und Schnittstellen. Bisher lag das Know-how über Radarsignalverarbeitung fest in der Hand der Tier-1-Zulieferer – etwa bei Unternehmen wie Bosch oder Continental. Sie lieferten das Radar als **Blackbox**: Der Fahrzeughersteller bekam fertige Ziele, aber keinen Einblick in die Rohdaten und Algorithmen.

Dieses Modell bröckelt. Neue Chipgenerationen wie NXPs **Radar Bridge** oder TIs AWR-Serie unterstützen nun nativ den direkten Rohdaten-Abgriff (RAW) über GMSL- oder MIPI-Schnittstellen. Gleichzeitig integrieren SoC-Hersteller dedizierte Radar-Signalverarbeitungs-IP (RSP) direkt in ihre Chips. Damit können Fahrzeughersteller die Algorithmen **selbst entwickeln oder von Dritten beziehen** – ohne auf die proprietäre Firmware des Radarherstellers angewiesen zu sein.

Allerdings ist der Aufwand enorm: Ein SoC muss heute bis zu zwölf Radar-Kanäle parallel verarbeiten können, mit voller FFT, CFAR (Constant False Alarm Rate) und Ziel-Clustering. Erst mit dem Sprung zu 5-nm- oder 3-nm-Prozessen wurde dies rechnerisch leistbar.

## Drei Sensortypen – drei Lösungswege

Nicht alle Sensoren sind gleich. Die chinesische Industrie verfolgt für Millimeterwellen-, Lidar- und Ultraschallsensoren unterschiedliche Pfade:

**Millimeterwellenradar** (4D-Radar): Hier hat sich eine kosteneffiziente Route etabliert – zum Beispiel **1 SoC + 2 MMIC** für 8T8R (acht Sende-, acht Empfangskanäle). Europa und manche Premium-Hersteller setzen auf **1 SoC + 4 MMIC** für 12T16R oder sogar 24T24R bis 2028. Entscheidend ist nicht die Hardware, sondern wer die Algorithmen kontrolliert: der SoC-Hersteller, der Tier-1 oder der Autobauer selbst. Hinzu kommt, dass die Radardaten (2D-Array) nicht zum für Kameras optimierten MIPI-Datenformat passen – spezielle DSP-Kerne sind nötig.

**Lidar**: Die Domänenzentralisierung trifft Lidar besonders hart, weil bisher ein FPGA-Signalprozessor im Sensor für die Punktwolke zuständig war. Wenn diese Berechnung in den zentralen SoC wandert, bleiben beim Lidar nur noch Sender (VCSEL), SPAD-Empfänger und TDC-Schaltungen übrig – die Kosten sinken. Ein aktuelles 192-Zeilen-Lidar erzeugt bei 10 Hz Bildrate und 0,1° Auflösung etwa **3,6 Gbit/s** Rohdaten. Das erfordert hochwertige GMSL2-Verbindungen (6 Gbit/s) und stellt hohe Anforderungen an die SoC-Bandbreite. Auch hier passen die Lidar-Daten (punktweise mit Slot-Organisation) nicht in das kameratypische MIPI-Format.

**Ultraschallsensor**: Die Algorithmen sind vergleichsweise einfach – hauptsächlich Laufzeitmessung (Time of Flight). Bei zentraler Verarbeitung steigt die CPU-Last um bis zu 20 %, aber die Erkennungsreichweite erhöht sich um etwa zehn Prozent, weil feinere Korrelationsfilter möglich sind. Ein praktisches Design: sechs Sensoren vorn und sechs hinten, deren Daten über SerDes auf einer Leitung gesammelt und an die zentrale ECU weitergeleitet werden. BYD (比亚迪) verfolgt hier einen Mittelweg zwischen „voll zentral“ und „voll dezentral“: Der Zeitaufwand steigt um 20 %, Reichweite +20 %, Genauigkeit +10 %.

## Fazit: Keine Blackbox mehr

Die chinesische Automobilindustrie baut an einer Infrastruktur, die **vom Sensorrohsignal bis zur Entscheidung keine Blackbox** mehr zulässt. Nur mit vollständigen, ungefilterten Daten können Algorithmen ihre volle Leistung entfalten – und nur so ist der Sprung von Stufe-2- zu Stufe-3-Systemen realistisch. Dieses technologische Rennen, das von Herstellern wie BYD, NIO (蔚来) oder XPeng (小鹏) angetrieben wird, verschiebt die Macht in der Wertschöpfungskette endgültig von den Tier-1-Zulieferern zu den Fahrzeugentwicklern und Halbleiterfirmen.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
