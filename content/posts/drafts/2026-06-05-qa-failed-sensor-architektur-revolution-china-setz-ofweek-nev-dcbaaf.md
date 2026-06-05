---
title: "[QA FAILED] Sensor-Architektur-Revolution: China setzt auf Rohdaten-Fusion"
date: 2026-06-05T12:32:52.957Z
description: "Chinesische Hersteller verlagern die Signalverarbeitung von Radaren und Lidaren in zentrale Steuergeräte. Das bricht das Monopol der Tier-1-Zulieferer und verbessert die Sensorfusion für autonomes Fahren maßgeblich."
source: "OFweek NEV"

category: "news"

brands: ["BYD"]
tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Sensor-Architektur-Revolution: China setzt auf Rohdaten-Fusion

## Die neue Denkweise: Zentrale Rohdaten statt verteilter Vorverarbeitung

Bislang arbeiteten Radarsensoren in chinesischen Fahrzeugen wie kleine Inseln: Jeder Sensor sammelte Signale, filterte sie selbstständig und meldete nur abstrahierte Ergebnisse – etwa „50 Meter voraus ein Hindernis“ – an das zentrale Steuergerät. Das Problem: Bei diesem Schritt gehen wertvolle Rohinformationen verloren, etwa die genaue Streucharakteristik oder Bewegungsmuster.

Jetzt setzt ein radikaler Wandel ein. Immer mehr Hersteller und Technologiepartner – darunter auch BYD (比亚迪) – gehen dazu über, die unverarbeiteten Rohdaten aller Sensoren (Radar, Lidar, Ultraschall) über Hochgeschwindigkeitsverbindungen (SerDes, GMSL) direkt in eine zentrale Recheneinheit (SoC) zu speisen. Dort läuft eine einheitliche Fusionsalgorithmik, die Widersprüche zwischen verschiedenen Sensoren auflösen kann: Beispielsweise erkennt eine Kamera ein Objekt, das Millimeterwellenradar durch Nebel hindurch deutlicher sieht – die Fusion beider Rohquellen ergibt ein präziseres Gesamtbild.

## Warum jetzt? Algorithmuskontrolle wechselt von Tier-1 zu OEMs

Der Hauptgrund für diesen Paradigmenwechsel liegt in der Kontrolle über die Algorithmen. Bisher hielten große Tier-1-Zulieferer wie Bosch oder Continental das Know-how der Radarsignalverarbeitung in ihren Blackbox-Firmwares fest. Die OEMs bekamen nur fertig verarbeitete Daten – sie konnten die Algorithmen nicht selbst optimieren oder an eigene Software-Architekturen anpassen.

Mit der zentralen Rohdaten-Architektur ändert sich das. Die OEMs übernehmen die gesamte Verarbeitungskette – vom analogen Frontend über die 1D-FFT (Fast Fourier Transformation) bis zur Objektverfolgung – auf ihren eigenen ADAS-SoC. Chip-Hersteller wie NXP und TI unterstützen diesen Wandel: NXP bietet spezielle Radar-Bridge-Chips an, die RAW-Daten direkt an den SoC durchreichen, und TI integriert Radar-Signalverarbeitungs-IP (RSP) in seine SoCs.

Herausforderungen bleiben: Die Datenmengen sind enorm – ein 192-Linien-Lidar erzeugt 3,6 Gbit/s pro Sekunde, und 12 Radarkanäle bedeuten eine massive Rechenlast. Zudem ist das Datenformat von Radaren (3D-Array mit Slots und Doppler-Verschiebungen) grundlegend anders als das von Kameras (2D-Frames), was effiziente DSP-Architekturen erfordert.

## Drei Sensorarten – drei verschiedene Wege

Die Entwicklung verläuft je nach Sensortyp unterschiedlich:

**Millimeterwellen-Radar (mmWave):** Der Wandel ist am weitesten fortgeschritten. Während 4D-Radar lange auf Mehrchipsätzen basierte (z. B. 1 SoC + 2 MMIC für 8T8R), zeichnen sich zwei Pfade ab: China setzt auf kosteneffiziente 8T8R-Lösungen, Europa plant schon 24T24R. Bis 2028 werden sich beide Pfade weiter angleichen. Entscheidend bleibt, wer die Radar-IP kontrolliert – Hersteller oder Tier-1.

**Laser-Lidar:** Hier ist der Wandel direkter, da viele Lidar-Hersteller ihre FPGA-basierte Signalverarbeitung ins zentrale SoC verlegen wollen. Die Kosten für die FPGA fallen weg; übrig bleiben reine Transceiver, SPAD-Sensoren und TDC-Hardware. Allerdings erfordert die Datenstruktur (1200 Slots pro Frame mit Distanz-Intensitäts-Reflexions-Information) spezielle DMA-Engines – sie ähnelt keinem Kamera-Frame.

**Ultraschall-Sensor:** Der einfachste Fall – die Laufzeitmessung benötigt keine aufwändige Signalverarbeitung. Bei zentraler Architektur steigt die Rechenlast dennoch um etwa 20 %, dafür lässt sich die Reichweite durch feinere Korrelationsfilter um bis zu zehn Prozent steigern. BYD (比亚迪) zeigt einen Mittelweg: „teilzentral“ mit Sub-Knoten an der Stoßstange, die sechs Sensoren vorverdichten und dann an den Haupt-SoC senden.

## Fazit: Volle Transparenz als Wettbewerbsvorteil

Die chinesische Industrie treibt eine Architektur voran, bei der vom Rohsignal bis zur finalen Entscheidung keine Blackbox mehr existiert. Je transparenter die Datenflüsse, desto besser können Algorithmen – insbesondere für anspruchsvolle L2+- und L3-Funktionen – optimiert werden. Das könnte chinesischen Herstellern einen entscheidenden Vorsprung in der nächsten Generation des automatisierten Fahrens verschaffen.

---

Dieser Artikel beschreibt eine technische Entwicklung in der chinesischen Automobilindustrie. Eine direkte Markteinführung einzelner Komponenten in Europa ist nicht betroffen. Langfristig könnten die hier beschriebenen Architekturen auch in europäischen Fahrzeugen Einzug halten.
