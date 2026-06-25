---
title: "Machtwechsel im Auto: Neue Sensorarchitektur entmachtet Zulieferer"
date: 2026-06-25T19:52:30.877Z
description: "Chinesische Hersteller wie BYD setzen auf zentrale Rohdatenfusion statt Blackbox-Sensoren. Das entmachtet Tier-1-Zulieferer und ermöglicht echte Sensorfusion. Der Artikel erklärt die technische Revolution."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Machtwechsel im Auto: Neue Sensorarchitektur entmachtet Zulieferer

Chinesische Automobilhersteller wie BYD (比亚迪) vollziehen einen grundlegenden Wandel in der Architektur ihrer Fahrassistenzsysteme. Statt wie bisher auf abgeschottete Einzelsensoren zu setzen, die ihre Rohdaten bereits vorverarbeitet als finale Objektliste an ein zentrales Steuergerät liefern, gehen sie jetzt zur **zentralen Rohdatenfusion** über. Das Ziel: Mehr Leistung, bessere Entscheidungen und die Unabhängigkeit von traditionellen Tier-1-Zulieferern.

**Neue Denkweise: Rohdaten-Fusion statt Ziel-Listen**

Im neuen „zentralisierten Fusions-Framework" geben Sensoren ihre unverarbeiteten Rohdaten über SerDes-Leitungen an einen leistungsstarken ADAS-SoC weiter. So bleibt die vollständige Information erhalten – inklusive FFT-Spektren, Doppler-Daten und Punktwolken von Radar, Lidar und Kameras. Eine echte Sensordatenfusion wird möglich: Die Regendurchdringung des Millimeterwellenradars kombiniert sich mit der hohen Winkelauflösung des Lidars. Das Ergebnis: 1+1 kann mehr als 2 ergeben. BYD gibt für eine solche Architektur eine Steigerung der Taktdomäne um 20 Prozent, eine um 20 Prozent höhere Reichweite und eine zehnmal höhere Punktwolkendichte an.

**Algorithmen-Know-how wandert von Tier-1 zu Herstellern**

Der entscheidende Machtwechsel betrifft die Signalverarbeitung: Bislang hielten Tier-1 wie Bosch, Continental oder chinesische Zulieferer die Radar-Algorithmen in ihren Firmware-Blackboxen gefangen. Der OEM bekam nur die aufbereitete Ziel-Liste – ohne Einblick in die Rohdatenverarbeitung. Die neue Architektur bricht dieses Monopol auf: Die MMIC-Chips (z. B. von NXP oder Texas Instruments) liefern nur noch Rohdaten, die gesamte Verarbeitung – von der 1D-FFT über CFAR-Detektion bis zur Dopplerschätzung – findet im zentralen SoC statt.

NXP reagiert mit einem dedizierten Radar-Bridge-Chip zwischen MMIC und SoC, während TI bei seinen AWR-Serien bereits RAW-Ausgabe unterstützt. Zudem integrieren SoC-Hersteller zunehmend eigene Radar-Signalverarbeitungs-IP, um Tier-1 aus der Wertschöpfung zu verdrängen.

**Herausforderungen beim Wechsel**

Doch der Umbau ist anspruchsvoll. Die chinesische Industrie verfolgt derzeit mehrere Pfade:

+ Millimeterwellenradar: Die Industrie spaltet sich in eine preisgünstige chinesische Lösung (1 SoC + 2 MMIC → 8T8R) und eine europäische Hochleistungsroute (1 SoC + 4 MMIC → 16T16R, perspektivisch 24T24R). Bis 2028 werden sich die Wege trennen.
+ Die Verlagerung der Algorithmen auf den SoC erfordert massive Rechenleistung – bis zu 12 Radar-Streams mit FFT und CFAR müssen parallel verarbeitet werden.
+ Ein weiteres Problem: Die Datenstrukturen von Radar unterscheiden sich grundlegend von denen einer Kamera. Radardaten sind in Slots organisiert (z. B. 1200 Slots pro Frame mit Doppler- und Zielinformationen), während Kameras zeilenweise Pixel liefern. Die für Kameraoptimierten MIPI-Schnittstellen und DSP-Einheiten müssen erst angepasst werden.

Lidar vereinfacht die Hardwareseite: Da die Signalverarbeitung künftig zentral erfolgt, können die teuren FPGA-basierten Signalprozessoren im Sensor entfallen – übrig bleiben nur Sender, SPAD-Empfänger und Zeitmessung (TDC). Allerdings erzeugt ein 192-Zeilen-Lidar mit 10 Hz Bildrate und 0,1° Auflösung rund 3,6 Gbit/s Daten – das belastet die GMSL2-Leitung (6 Gbit/s) bereits stark. Auch hier ist die Datenstruktur (Punktwolke statt Pixel) eine Herausforderung für die Schnittstellen.

Ultraschallsensoren wiederum sind algorithmisch einfach: Laufzeitmessung reicht aus. Unter der neuen Architektur kann der zentrale SoC feinere Korrelationsfilter anwenden und die Taktung um 20 Prozent steigern, die Punktdichte verzehnfachen. Allerdings müssen bei 12 Sensoren 12 SerDes-Leitungen verlegt werden – das treibt Kosten und Stecker-Komplexität. BYD löst das mit einer Hybrid-Lösung: Die Sensoren an der vorderen Stoßstange arbeiten dezentral, die hinteren speisen ihre Daten zentral ein – ein Kompromiss zwischen Performance und Aufwand.

**Fazit**

Chinas Automobilindustrie baut die gesamte Sensordatenpipeline um: Vom Rohsignal bis zur finalen Entscheidung gibt es keine Blackbox mehr. Nur wer die gesamten Daten nutzen kann, kann die Algorithmen verbessern – und damit die Lücke zu etablierten Systemen schließen. Nach dem Erfolg bei Kameras wagen sich die chinesischen Hersteller nun auch an Radar und Lidar – der nächste Schritt zu L2+ und L3.

---

*Dieser Artikel beschreibt eine branchenweite Technologieentwicklung in China. Die vorgestellten Architekturänderungen betreffen nicht ein einzelnes Fahrzeugmodell, sondern die zukünftige Plattformentwicklung vieler chinesischer Hersteller – und werden indirekt auch in Europa Einfluss haben.*
