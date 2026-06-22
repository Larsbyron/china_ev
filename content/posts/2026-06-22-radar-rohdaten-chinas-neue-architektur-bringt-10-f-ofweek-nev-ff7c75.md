---
title: "Radar-Rohdaten: Chinas neue Architektur bringt 10-fache Punktdichte"
date: 2026-06-22T15:18:59.339Z
description: "Kein dezentrales Vorkochen mehr: Statt gefilterter Sensordaten fließen künftig unverarbeitete Rohsignale direkt in die Zentrale. BYD verspricht 20 % weniger Latenz und zehnmal höhere Punktdichte. Der Umbruch verlagert die Algorithmus-Hoheit von Tier-1 zu Chipherstellern."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Radar-Rohdaten: Chinas neue Architektur bringt 10-fache Punktdichte

Die chinesische Autoindustrie erlebt einen grundlegenden Wandel im Design von Fahrassistenzsystemen. Weg von dezentralen Sensoren, die selbstständig Ziele erkennen und nur Ergebnisse melden, hin zu einer Architektur, bei der Millimeterwellenradar, Lidar und Kamera ihre rohen, unverarbeiteten Daten direkt an eine zentrale Recheneinheit senden. Diese „Ende-zu-Ende"-Struktur soll eine präzisere Sensorfusion und bessere Entscheidungen auf dem Weg zum autonomen Fahren ermöglichen.

## Warum die alte Architektur an ihre Grenzen stößt

Bisher arbeitete jeder Sensor weitgehend autark: Das Millimeterwellenradar führte eine Fast-Fourier-Transformation (FFT) durch, ein Lidar erstellte eine Punktwolke, und die Kamera extrahierte Merkmale – jedes System meldete dann nur eine Liste erkannter „Objekte" oder „keine Hindernisse". Diese gefilterten Bits enthalten bereits erhebliche Informationsverluste. Beispiel: Bei Regen erfasst das Millimeterwellenradar ein entferntes Objekt zuverlässig, während das Lidar durch Wassertropfen gestört sein kann. In der alten Architektur erhält die Zentrale zwei widersprüchliche Meldungen – und muss raten.

Mit der neuen „Rohdaten-Architektur" fließen alle unverarbeiteten Sensordaten – Frequenzspektren vom Radar, Punktwolken vom Lidar – in ein einziges Planungsmodul. Dort vereint eine gemeinsame Algorithmik die Stärken aller Sensoren: Das Millimeterwellenradar liefert Entfernung und Geschwindigkeit, das Lidar die feine Kantendetektion, die Kamera die Farbinformation. So kann 1+1 mehr als 2 ergeben.

## Der Algorithmus-Poker: Wer kontrolliert die Intelligenz?

Bis vor Kurzem lag das Know-how der Radarsignalverarbeitung fast vollständig bei den Tier-1-Zulieferern. Sie steckten die FFT-Entfernungsanalyse, die CFAR-Detektion (Constant False Alarm Rate) und die Doppler-Geschwindigkeitsschätzung als Blackbox in die Sensor-Firmware. Hersteller bekamen nur das verdichtete Ergebnis – nie den Rohstoff.

Jetzt kehrt sich das um: Die Fabrik liefert nur noch das reine Antennenmodul (MMIC + ADC) und führt eine einfache eindimensionale FFT durch. Alle komplexen Schritte – Zielerkennung, Klassifikation, Tracking – werden auf den zentralen ADAS-SoC (System-on-Chip) verlagert. Dies erfordert leistungsfähigere Chips. NXP (恩智浦) hat einen speziellen Radar-Bridge-Chip vorgestellt, der zwischen MMIC und SerDes geschaltet wird, und bietet zugleich RSP-IP (Radar Signal Processing IP) zur Integration in SoCs an. TI (德州仪器) verfolgt einen ähnlichen Weg: Seine AWR-Serie unterstützt bereits RAW-Datenausgabe.

Der Vorteil: Für höhere Autonomiestufen (L3/L4) reichen diskrete Objektlisten nicht mehr. Systeme benötigen rohe Geschwindigkeitsspektren, Mikro-Doppler-Signaturen und andere Details, um etwa Roller von Radfahrern oder stehende Hindernisse von Straßenschmutz zu unterscheiden. Die Herausforderung bleibt die Rechenleistung: Zwölf Radar-Kanäle gleichzeitig mit FFT und CFAR zu versorgen, stellt hohe Anforderungen an den SoC.

## Die drei Sensor-Typen im Wandel

**Millimeterwellenradar (4D-Radar):** Derzeit dominieren zwei Wege: Chinesische Hersteller setzen auf eine kosteneffiziente Lösung mit 1 SoC + 2 MMICs (6 Sende- und 8 Empfangskanäle, 8T8R). Europäische Wettbewerber nutzen 1 SoC + 4 MMICs (12T16R oder 16T16R) und planen bereits 24T24R. Bis 2028 werden sich die Architekturen in unterschiedlichen Kostenmodellen und Einsatzszenarien manifestieren. BYD (比亚迪) gibt für seine neue Generation an: Die Latenz sinkt um 20 %, die Reichweite steigt um 20 % und die Punktdichte erhöht sich um das Zehnfache – bei einer 4D-Radar-Reichweite von über 400 Metern.

**Lidar:** Die Rohdaten-Architektur vereinfacht das Lidar-Design drastisch. Bislang war ein FPGA zur Signalverarbeitung nötig – ein teurer Posten. Künftig übernimmt der Host-SoC diese Aufgabe, sodass das Lidar-Modul nur noch aus Emitter, SPAD-Empfänger, TDC und einer einfachen Datenvorverarbeitung (z. B. Histogrammstatistik) besteht. Allerdings: Lidar-Daten sind anders organisiert als Kamera-Frames – sie kopieren keine Pixel, sondern Slots mit Distanz und Intensität. Ob die DSP-Kerne des SoC diese Struktur effizient verarbeiten können, bleibt offen.

**Ultraschallsensor:** Der simpelste Fall – nach der Entfernungsmessung muss keine aufwändige Signalverarbeitung mehr stattfinden. Die Rohdaten (Laufzeitmessungen) gehen direkt ins zentrale System. Allerdings benötigt jeder Sensor eine eigene SerDes-Leitung, was Verkabelung und Kosten erhöht. Eine praktikable Lösung ist die „regionale Bündelung": Die Daten mehrerer Sensoren (z. B. sechs an der vorderen Stoßstange) werden in einem lokalen Modul zusammengefasst und dann gebündelt an den Zentralrechner gesendet.

Der Trend ist klar: Die chinesische Automobilindustrie baut alle Blackboxes im Sensornetzwerk ab. Vom Rohsignal bis zur Entscheidung gibt es keine undurchsichtigen Zwischenschritte mehr. BYD hat konkrete Zahlen vorgelegt: 20 % weniger Latenz, 20 % mehr Reichweite, 10-fache Punktdichte – Belege für den Paradigmenwechsel.

---

Die von BYD (比亚迪) vorangetriebene Technik ist Teil eines globalen Trends. Deutsche Hersteller und Zulieferer wie Bosch oder Continental arbeiten an ähnlichen Architekturen. Eine direkte Markteinführung eines bestimmten Modells steht nicht im Fokus, doch die Entwicklungen beeinflussen künftige Fahrzeuge auch in Europa.
