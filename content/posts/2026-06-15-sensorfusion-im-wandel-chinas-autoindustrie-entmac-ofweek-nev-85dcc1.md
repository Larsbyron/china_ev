---
title: "Sensorfusion im Wandel: Chinas Autoindustrie entmachtet Zulieferer"
date: 2026-06-15T20:49:16.653Z
description: "Neue zentrale Rechnerarchitektur verlagert Radarsignalverarbeitung vom Sensor ins Fahrzeug-SoC. Das verspricht bessere Umfelderkennung für autonomes Fahren."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# Sensorfusion im Wandel: Chinas Autoindustrie entmachtet Zulieferer

Die chinesische Automobilindustrie treibt die Neuordnung der Sensor- und Rechnerarchitektur für Fahrassistenzsysteme (ADAS) voran. Kern der Entwicklung: Weg von verteilten, abgeschotteten Sensor-Einheiten hin zu einer zentralen Rechnerplattform, die rohe Sensordaten verarbeitet.

Bisher arbeitete jeder Radarsensor als eigenständiger kleiner Computer: Signalerfassung, FFT-Berechnung, Zielerkennung und Geschwindigkeitsmessung fanden direkt im Sensor statt. An die zentrale Steuereinheit wurde nur ein verarbeitetes Ergebnis gemeldet – ein „voraus 50 Meter Hindernis“. Diese Datenkompression führt zu Informationsverlust.

Die neue zentrale Architektur („vorwärtsgerichtete Sensorfusion“) dreht den Prozess um: Statt vorverarbeiteter Listen werden rohe, unverarbeitete Daten – wie FFT-Spektren oder Radar-RAW-Daten – über SerDes-Verbindungen an eine leistungsstarke Fahrzeug-SoC (System-on-Chip) gesendet. Dort können Algorithmen alle Sensorinformationen fusionieren. Ein Beispiel: Regentropfen stören das Lidar-Signal, während Millimeterwellenradar durch Regen kaum beeinträchtigt wird. Im alten System käme es zu widersprüchlichen Meldungen („kein Hindernis“ vs. „Hindernis“). In der zentralen Architektur können Algorithmen die Stärken beider Sensoren kombinieren – 1+1 kann dann 5 ergeben.

## Warum die Umstellung jetzt erfolgt – Algorithmus-Know-how wandert

Der Grund hierfür ist eine Machtverschiebung: Bisher hielten Tier-1-Zulieferer wie Bosch, Continental oder Hikvision das gesamte Know-how zur Radarsignalverarbeitung in ihren Black-Box-Modulen. Die Autohersteller erhielten nur fertig verarbeitete Ergebnisse. Mit der neuen Architektur liefern die MMIC-Chips (Monolithic Microwave Integrated Circuit) und ADC-Wandler nur noch rohe HF-Daten. Die eigentliche intelligente Verarbeitung übernimmt der SoC des Fahrzeugherstellers.

Diese Umstellung wird durch neue Chip-Architekturen ermöglicht. NXP bietet spezielle Radar-Bridge-Chips an, die zwischen MMIC und SoC vermitteln, sowie Radar-Signalverarbeitungs-IP (RSP IP) direkt in ADAS-SoCs integrieren. TI unterstützt mit seinen AWR-Serien ebenfalls RAW-Datenausgabe. Für höhere Automatisierungsstufen (L3/L4) reichen listenbasierte Ziele nicht mehr aus – es werden rohe Punktwolken mit Doppler- und Mikrobewegungsinformationen benötigt, um z. B. Fahrradfahrer von Fußgängern oder lose Steine von auf der Straße liegenden Gegenständen zu unterscheiden.

Allerdings stellt die Verarbeitung von bis zu 12 Radar-Streams auf einem SoC hohe Anforderungen an Rechenleistung und Speicherbandbreite. Zukünftig werden sowohl verteilte als auch zentrale Architekturen koexistieren – entscheidend ist, wer die Kontrolle über die Algorithmen hat.

## Unterschiedliche Entwicklungswege: Milliwelle-, Laser- und Ultraschallradar

Die verschiedenen Sensortypen entwickeln sich unterschiedlich:

*   **Millimeterwellenradar (MMW):** Am weitesten fortgeschritten. 4D-MMW-Radar verwendet Mehrchip-Architekturen. Chinesische Hersteller setzen auf günstige „1 SoC + 2 MMIC“-Lösungen (6TX 8RX), europäische auf „1 SoC + 4 MMIC“ (12TX 16RX), teilweise sogar 24TX 24RX bis 2028. Die Herausforderung liegt nicht in der Hardware, sondern darin, dass Algorithmus-IP oft noch bei Tier-1 liegt und eine effiziente Portierung auf SoC-Plattformen schwierig ist – zudem sind Radar-Daten dreidimensional organisiert, während MIPI-Schnittstellen für kamerabasierte Bilddaten ausgelegt sind.

*   **Laserscanner (LiDAR):** Bisher enthalten viele mechanische LiDARs eigene FPGA-basierte Signalprozessoren. Durch die Verlagerung der Algorithmen auf den Zentralrechner können die Kosten für diese Sensoren deutlich sinken – nur noch Emitter, SPAD-Empfänger und TDC (Time-to-Digital-Converter) verbleiben im Sensor. Allerdings benötigt ein 192-Linien-LiDAR mit 10 Hz Bildrate und 120° horizontalem Sichtfeld etwa 3,6 Gbit/s Datenrate – GMSL2 mit 6 Gbit/s ist ausreichend, aber die Datenstruktur (zeitliche Slots statt Bildframes) ist komplett anders als bei Kameras, was eine effiziente Verarbeitung erschwert.

*   **Ultraschallsensor (USS):** Algorithmisch simpler (Laufzeitmessung), aber die zentrale Verarbeitung erhöht die ECU-Last um etwa 20 %. Die Reichweite steigt in der Praxis um über 10 Meter durch feinere Korrelationsfilter. Allerdings erfordert eine vollständige Vernetzung vieler Sensoren viele SerDes-Leitungen. BYD (比亚迪) zeigte einen Kompromiss: sechs Sensoren an der Front werden lokal vorverarbeitet und dann als aggregierte Daten an die Zentrale gesendet – eine hybride Lösung zwischen vollständig zentral und vollständig dezentral.

## Fazit

Die chinesische Automobilindustrie strebt eine durchgängige Datenpipeline vom rohen Sensorsignal bis zur finalen Entscheidung an – ohne Blackboxes dazwischen. Nur so können Algorithmen das volle Potenzial der Hardware entfalten. Nach der Dominanz der Kamerasensorik werden nun Radar und Lidar in den Fokus des nächsten Schritts hin zu L2+ und L3 rücken.

---

## In Europa

Dieser Artikel beschreibt eine technologische Entwicklung in der chinesischen Automobilindustrie. Sie betrifft die Architektur von Fahrassistenzsystemen und ist ein globaler Trend, der auch europäische Hersteller und Zulieferer beeinflusst.
