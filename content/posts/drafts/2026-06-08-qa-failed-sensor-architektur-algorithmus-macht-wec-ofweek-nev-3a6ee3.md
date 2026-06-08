---
title: "[QA FAILED] Sensor-Architektur: Algorithmus-Macht wechselt zu SoC-Herstellern"
date: 2026-06-08T14:01:44.068Z
description: "Chinesische Hersteller stellen Sensordaten zentral. Radar- und Lidar-Algorithmen wandern von Tier-1 in den Chip. Das verändert die industrielle Wertschöpfungskette."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Sensor-Architektur: Algorithmus-Macht wechselt zu SoC-Herstellern

In der intelligenten Fahrassistenz bahnt sich ein fundamentaler Wandel an: Die zentrale Rechnerarchitektur ersetzt die bisherige verteilte Sensorlogik. Anstatt dass jeder Sensor (Radar, Lidar, Kamera) seine Daten lokal vorverarbeitet und nur „Ergebnisse" meldet, fließen nun rohe Signale direkt in einen leistungsstarken SoC (System-on-Chip). Dort fusioniert eine einheitliche Algorithmen-Suite alle Daten – und ermöglicht so eine präzisere Umfelderkennung.

## Der Unterschied: Verteilt vs. Zentral

Bisher arbeiteten Radarsensoren wie kleine „Inselrechner": Sie sammelten Signale, führten FFT (Fast Fourier Transformation) durch, erkannten Ziele und gaben nur abstrakte Listen wie „Hindernis bei 50 Metern" weiter. Dabei gingen wertvolle Rohinformationen verloren. Ein Beispiel: Spritzwasser auf der Fahrbahn reflektiert Radar unterschiedlich – ein verteiltes System meldet „kein Hindernis" oder „Hindernis" und gerät in Widersprüche. Die zentrale Architektur hingegen empfängt die Rohdaten aller Sensoren, kann Stärken kombinieren (z. B. Lidar-Punktwolke mit Radar-Doppler) und erzielt so 1+1 = 5 anstelle von 2.

## Algorithmus-Know-how wandert vom Tier-1 in den SoC

Der entscheidende Machtwechsel: Bislang lag die Signalverarbeitung von Radaren fest in der Hand der Zulieferer (Tier-1). Sie definierten die Firmware für FFT, Zielerkennung und Dopplerschätzung – eine Blackbox für den Autobauer. Mit der zentralen Architektur bleibt dem Radar-Modul nur noch die reine HF-Frontend-Funktion (MMIC, ADC). Die gesamte Signalverarbeitung wird auf den SoC verlagert.

Ermöglicht wird dies durch neue Chip-IP. NXP bietet spezielle Radar-Bridge-Chips an, die zwischen MMIC und SerDes vermitteln. Noch radikaler: NXP integriert Radar-Signalverarbeitungs-IP (RSP) direkt in ADAS-SoCs. Auch Texas Instruments (TI) unterstützt mit seiner AWR-Serie den Rohdaten-Ausgang. Das Ziel: SoCs müssen künftig bis zu 12 Radar-Streams gleichzeitig mit FFT, CFAR (Constant False Alarm Rate) und Tracking verarbeiten können – eine enorme Rechenlast, die nur mit hochintegrierten Chips zu stemmen ist.

## Drei Sensortypen – drei Herausforderungen

**4D-Radar (Bildradar):** Hier zeichnet sich ein technologischer Split zwischen China und Europa ab. Chinesische Hersteller setzen auf einen günstigen Pfad: 1 SoC + 2 MMICs → 8T8R (8 Sende-, 8 Empfangskanäle). Europa geht auf den High-End-Pfad: 1 SoC + 4 MMICs → 16T16R, teilweise sogar 24T24R geplant. Bis 2028 werden sich diese Pfade je nach Kostenmodell und Anwendung differenzieren. Die eigentliche Hürde liegt aber im Algorithmus-IP: Wer es schafft, Radar-Rohdaten effizient auf dem SoC zu verarbeiten (DSP-Pipeline statt CPU/GPU-Software), hat einen entscheidenden Vorteil.

**Lidar:** Bei Lidar entfällt durch die Zentralarchitektur das teure FPGA im Sensor. Übrig bleiben nur Emitter (VCSEL), SPAD-Empfänger und TDC (Time-to-Digital-Converter) – sowie ein einfacher MIPI-Interface-Chip. Die Datenrate ist enorm: Ein 192-Zeilen-Lidar mit 10 Hz und 0,1° Auflösung erzeugt 3,6 Gbit/s Rohdaten – das entspricht einem Full-HD-Videostream. Die Verarbeitung auf dem SoC erfordert eine spezielle Datenstruktur: Lidar organisiert seine Punkte in Slots (z. B. 1.200 Slots pro Frame) statt in Pixeln wie Kameras. Konventionelle ISP-Pipelines sind dafür ungeeignet.

**Ultraschall:** Hier ist die Algorithmik einfacher (Laufzeitmessung), aber die Anzahl der Sensoren steigt – bis zu 12 Stück. Jeder benötigt eine SerDes-Leitung, was teuer und komplex ist. Ein Kompromiss sind dezentrale „Sammelstellen" (z. B. zwei Module vorne/hinten), die die Daten bündeln und dann zentral verarbeiten. BYD (比亚迪) setzt auf einen Mittelweg: Die Sensor-Cluster übernehmen leichte Vorverarbeitung, die finale Fusion erfolgt zentral. Ergebnis: 20 % weniger Latenz, 20 % mehr Reichweite.

## Fazit: Die Datenpipeline wird transparent

Chinesische Autohersteller streben eine vollständig transparente Datenpipeline an: vom rohen Sensor-Signal bis zur Entscheidung im Planungsmodul – ohne Blackbox. Das erfordert leistungsfähige SoCs, die Radar-, Lidar- und Kamera-Daten in einheitlichen DSP-Pipelines verarbeiten können. Die industrielle Wertschöpfung verschiebt sich von traditionellen Tier-1-Zulieferern zu Chip-Entwicklern (NXP, TI) und ihren IP-Partnern.

*Quelle: Der Originalartikel erschien auf Chinesisch und wurde lokalisiert aufbereitet.*

---

Diese Analyse bezieht sich auf die Technologieentwicklung in China und hat derzeit keine direkte Auswirkung auf den deutschen Markt. Die beschriebenen Architekturveränderungen werden jedoch mittelfristig auch in europäischen Plattformen Einzug halten.
