---
title: "[QA FAILED] Sensor-Revolution: Rohdaten statt Fertigbefunde"
date: 2026-06-11T13:54:54.537Z
description: "Chinas Autoindustrie stellt Sensorarchitekturen um: Statt dezentraler Signalverarbeitung fließen rohe Sensordaten in zentrale Rechner. Das verschiebt die Algorithmus-Macht von Tier-1 zu Chip- und Softwarefirmen."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Sensor-Revolution: Rohdaten statt Fertigbefunde

Die chinesische Automobilbranche erlebt einen grundlegenden Wandel in der Sensorarchitektur für Fahrassistenzsysteme. Bisher verarbeitete jeder Sensor seine Daten selbst: Radare meldeten „Hindernis 50 Meter voraus", Kameras lieferten fertige Objektlisten. Doch eine neue Denkschule namens „entkoppelte Sensorarchitektur" setzt auf rohe, unverarbeitete Datenströme – und überträgt die gesamte Fusions-Algorithmik an ein zentrales Steuergerät (SoC).

## Revolution der Sensorarchitektur

Der Clou: Statt wie bisher jedes Radar seinen eigenen Mikrocontroller zu geben (der FFT, Zielerkennung und Geschwindigkeitsschätzung lokal erledigt), werden nun die rohen Zwischenfrequenzsignale („RAW-Daten") über Hochgeschwindigkeitsverbindungen wie SerDes und GMSL zum Zentralrechner gesendet. Dort laufen alle Sensorinformationen in einem einheitlichen Algorithmus zusammen. Das Ergebnis: 1+1 kann plötzlich 5 ergeben – etwa wenn ein Kamera-Radar, dessen Signal durch Regentropfen gestreut wird, mit der besseren Durchdringung eines 4D-Imaging-Radars fusioniert wird.

Dieser Schritt wird durch leistungsfähigere SoCs und spezielle Bridge-Chips wie NXPs Radar Bridge möglich. Die Herausforderung: Die Datenmengen sind enorm. Ein 192-Linien-Lidar erzeugt 3,6 Gbps Rohdaten – etwa ein unkomprimierter Full-HD-Film pro Sekunde. Und die Datenstruktur unterscheidet sich komplett von Kamera-Frames: Radar-Daten sind in Slots organisiert, nicht in Pixeln. Herkömmliche ISP-Pipelines und DSPs müssen angepasst werden.

## Algorithmus-Macht wechselt den Besitzer

Die Kehrseite der Medaille: Bisher hielten Tier-1-Zulieferer das Know-how über die Signalverarbeitung in ihren Radar-FPGAs unter Verschluss – eine Blackbox. Mit der entkoppelten Architektur wandert dieses Wissen in den Zentralrechner (SoC) und damit in die Hände von Chip-Entwicklern oder Autoherstellern selbst. „Wer die Algorithmus-IP steuert, kontrolliert die Wertschöpfung", heißt es in der Branche.

Besonders deutlich wird das bei 4D-Imaging-Radaren: Zwei Pfade zeichnen sich ab. Ein chinesischer Weg setzt auf 1 SoC + 2 MMICs für ein 8T8R-System (Kostenvorteil). Europäische Anbieter planen 12T16R oder sogar 24T24R mit 1 SoC + 4 MMICs. Ab 2028 treffen die unterschiedlichen Kostenmodelle aufeinander.

## Drei Sensortypen im Vergleich

Die drei relevanten Sensortypen entwickeln sich unterschiedlich:

- **4D-Imaging-Radar (毫米波雷达):** Der komplexeste Fall. Die Signalverarbeitung (FFT, CFAR, Doppler) wird komplett ins SoC verlagert. NXP und TI bieten spezielle IP-Blöcke an, die direkt in den SoC integriert werden.
- **Lidar (激光雷达):** Am radikalsten. Hersteller eliminieren das FPGA und nutzen nur noch SPAD-Sensoren mit TDC. Die restliche Datenverarbeitung (Punktwolken-Fusion) erfolgt im Zentralrechner. Die hohe Bandbreite (3,6 Gbps pro Scanner) fordert die Schnittstellen.
- **Ultraschall-Radar (超声波雷达):** Prinzipiell einfacher (Laufzeitmessung), aber durch die hohe Anzahl (12+ Sensoren) steigen Verkabelungs- und Interface-Kosten. Praktisch wird oft ein Mischweg gewählt: „lokal sammeln, zentral fusionieren".

BYD (比亚迪) etwa hat bei seinem Fahrassistenzsystem die Taktung um knapp 20 % erhöht, die Sensordichte um den Faktor 10 gesteigert – dank zentraler Rohdatenverarbeitung. Der Kompromiss: teils lokale Vorverarbeitung, teils zentrale Fusion.

## Fazit

Chinas Autoindustrie entpackt die Blackbox der Sensoren. Rohdaten ersetzen Fertigbefunde – und Algorithmus-Entscheidungen wandern von Tier-1 zu SoC-Herstellern und Automobilentwicklern. Das ermöglicht flexiblere, leistungsfähigere Systeme für die nächste Stufe des automatisierten Fahrens (L2/L3).

*Hinweis: CLTC (chinesischer Verbrauchszyklus, typischerweise 10–15 % höher als WLTP) wird in diesem Artikel nicht verwendet, da keine Reichweiten genannt werden.*

---

Diese technische Entwicklung betrifft die globale Automobilindustrie und hat keine spezifische Modell-Einführung in Europa zur Folge.
