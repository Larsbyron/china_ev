---
title: "NXP treibt Wandel: 3,6 Gbps RAW-Daten-Architektur fürs autonome Fahren"
date: 2026-06-07T19:10:57.120Z
description: "Chinesische Autobauer setzen auf eine zentralisierte Sensorarchitektur: Radar, Lidar und Kameras liefern nur Rohdaten. Ein Zentralrechner verarbeitet bis zu 3,6 Gbps pro Sensor – das verschiebt die Wertschöpfung von klassischen Tier-1 zu Chipentwicklern wie NXP und TI."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 5
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# NXP treibt Wandel: 3,6 Gbps RAW-Daten-Architektur fürs autonome Fahren

Chinesische Automobilhersteller treiben einen grundlegenden Wandel in der Sensorarchitektur für autonomes Fahren voran. Statt dass jedes Radar-, Lidar- oder Kamerasystem seine eigene Signalverarbeitung an Bord hat, liefern die Sensoren künftig ausschließlich unbearbeitete Rohdaten (RAW-Daten) an einen zentralen Fahrassistenzrechner (SoC). Erst dort werden alle Informationen mit einer einheitlichen Fusionssoftware verarbeitet. Dies verschiebt die Wertschöpfung von klassischen Tier-1-Zulieferern, die bisher die Blackbox-Algorithmen kontrollierten, hin zu Halbleiter- und Softwarefirmen.

## Vom Zielobjekt zur Rohdatenflut

Bisher arbeiteten die meisten Fahrassistenzsysteme dezentral: Jeder Radarsensor führte selbst eine schnelle Fourier-Transformation (FFT) zur Zielerkennung durch und meldete dann eine Liste mit erkannten Objekten – etwa „50 Meter voraus Hindernis“ – an das Steuergerät. Diese Informationen waren bereits gefiltert und verloren Details. Die neue Architektur dagegen schickt die gesamte, unverarbeitete Signalinformation – inklusive Frequenzspektren, Phasenverschiebungen und Rauschen – über Hochleistungs-SerDes-Leitungen (z. B. GMSL) an den Zentralrechner.

Ein Beispiel verdeutlicht den Vorteil: Ein Millimeterwellen-Radar durchdringt Regen und Nebel deutlich besser als ein Lidar. Im alten System lieferte das Radar die Meldung „kein Hindernis“, während das Lidar „Hindernis erkannt“ meldete – ein Widerspruch ohne Rohteile. Im neuen System verrechnet die zentrale KI die stärkere Durchdringung des Radars mit der Auflösung des Lidars und erzeugt ein integriertes, zuverlässigeres Umfeldmodell. In der Branche heißt es: „1+1 kann hier 5 ergeben.“

## Machtverschiebung von Tier-1 zu Chip- und Softwarefirmen

Diese Umstellung hat tiefgreifende Folgen für die Wertschöpfungskette. Bisher kontrollierten große Tier-1-Zulieferer die Radarsignalverarbeitung als geschlossene Blackbox – die Algorithmen für Zielerkennung und Doppler-Geschwindigkeitsmessung waren in der Firmware der Sensoren verborgen. Mit der neuen Architektur werden diese Funktionen auf den Zentral-SoC verlagert. Der Sensor liefert nur noch die Rohsignale von der MMIC (Hochfrequenz-Sende-/Empfangseinheit) und dem ADC (Analog-Digital-Wandler). Chipentwickler wie NXP und Texas Instruments (TI) nutzen diesen Wandel, um eigene Signalverarbeitungs-IP (z. B. Radar Bridge, RSP IP) direkt in die ADAS-SoCs zu integrieren. Damit entsteht ein neuer Wettbewerb: Statt auf Tier-1-Blackboxen setzen die Hersteller auf offene, hardwarenahe Algorithmen, die von den Chip-Anbietern oder Drittanbietern entwickelt werden.

Für höhere Autonomie-Level wie L3/L4 reichen Objektlisten nicht mehr. Die Systeme benötigen rohe „Point Clouds“ mit Frequenz, Doppler und Phasenwinkeln, um etwa stehende Hindernisse oder bewegte Objekte zu unterscheiden. Bisher war die Berechnung von zwölf Kanälen Radar-FFT und CFAR (Constant False Alarm Rate) eine enorme Rechenlast für den SoC. Mit leistungsfähigen Chips und dedizierten DSPs wird dies nun möglich. Die Weichen sind gestellt: China setzt auf die zentrale RAW-Daten-Architektur.

## Unterschiedliche Wege bei Radar, Lidar und Ultraschall

### Millimeterwellen-Radar: Schnellste Entwicklung, auch die komplexeste

Auf dem chinesischen Markt konkurrieren zwei Wege: die preisorientierte Lösung mit „1 SoC + 2 MMIC“ (6–8 Kanäle, 8T8R) und die europäische Hochleistungsroute mit „1 SoC + 4 MMIC“ (12–16 Kanäle, 16T16R). 2028 könnten 24T24R-Systeme kommen. Die Herausforderung liegt jedoch nicht in der Hardware, sondern in der Algorithmen-IP. Wer diese IP bereitstellt – ob Tier-1 oder Chipentwickler – entscheidet über die Wertschöpfung. Zudem müssen die SoCs die untypischen Datenstrukturen (Range-Azimuth-Matrix statt Kamerabild-Frames) effizient verarbeiten können. NXPs RSP-IP zielt darauf ab, eine neue Algorithmen-Mauer um den SoC herum zu errichten.

### Lidar: Rohdaten sparen FPGA-Kosten

Lidar-Sensoren haben bisher hohe Kosten durch eigene FPGA-basierte Signalverarbeitung. In der zentralen Architektur können sie sich auf die reine Lasersendung, SPAD-Empfang und TDC (Time-to-Digital-Converter) beschränken. Die Berechnung wird auf den Zentralrechner verlagert. Moderne 192-Linien-Lidare liefern bereits 3,6 Gbps Rohdaten (10 Hz, 120°×0,1° Auflösung) – das entspricht einem komprimierten HD-Film pro Sekunde. Die Übertragung über GMSL2 (6 Gbps) ist möglich, aber die Datenstruktur (Slots statt Frames) unterscheidet sich fundamental von Kameras. Effizienzverluste in CPU/GPU sind noch eine offene Frage.

### Ultraschallsensoren: Einfach, aber auch anspruchsvoll

Ultraschall-Sensoren benötigen keine komplexe Signalverarbeitung; die Laufzeitmessung ist simpel. In der neuen Architektur werden die Rohdaten (Amplitude, Phase) zentral verarbeitet, was zu einer 20 % geringeren Totzeit und einer zehnfach höheren Punktdichte führen kann. Allerdings erfordert die Verdrahtung von 12 Sensoren mit jeweils eigenem SerDes hohe Kosten – daher setzen viele Hersteller auf hybride Lösungen: Vorverarbeitung im Sensor (z. B. sechs Kanäle) und Zusammenführung im Zentralrechner.

## Praktische Umsetzung: Hybride Ansätze

Ein konkretes Beispiel: BYD hat für seine zentralisierte Architektur eine Reduzierung der Totzeit um 20 %, eine 20 % höhere Erkennungsreichweite und eine zehnfach erhöhte Punktdichte gemeldet. Der Hersteller wählt einen Mittelweg zwischen vollständig zentraler und vollständig dezentraler Intelligenz – die Daten werden zwar zentral fusioniert, aber einige Vorverarbeitung bleibt im Sensor. Dieser Ansatz vereint die Vorteile der neuen Architektur mit den praktischen Grenzen der Datenleitung.

China stellt die gesamte Sensor-Datenpipeline um: von der Erfassung bis zur endgültigen Entscheidung – ohne Blackbox dazwischen. Je mehr Rohdaten fließen, desto mehr kann die KI daraus lernen. Nachdem die Kamera den Durchbruch geschafft hat, versuchen nun Radar und Lidar, diesen Schritt zu gehen. Das ist die Basis für den Sprung von L2 zu L3 und darüber hinaus.

*Hinweis: Die genannten Technologien werden zunächst in China eingeführt, sind aber aufgrund der globalen Halbleiterlieferkette (NXP, TI) auch für europäische Hersteller relevant.*

---

Die Technologie wird zunächst in China eingeführt, könnte aber auch in Europa relevant werden. NXP und TI als Halbleiterlieferanten agieren global.
